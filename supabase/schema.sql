-- ============================================================================
-- Senza Tacc — esquema
-- Correr entero en el SQL Editor de Supabase. Es idempotente.
-- Después correr supabase/seed.sql para cargar los 41 productos.
-- ============================================================================

-- ── Productos ───────────────────────────────────────────────────────────────
create table if not exists productos (
  id            text primary key,
  nombre        text    not null,
  marca         text    not null default '',
  descripcion   text    not null default '',
  categoria     text    not null check (categoria in
                  ('galletitas','alfajores','barritas','snacks','pastas')),
  imagen        text    not null default '',
  precio        numeric not null default 0 check (precio >= 0),
  unidad        text    not null default 'unidad',
  -- Unidades físicas en góndola.
  stock         integer not null default 0,
  -- Unidades comprometidas por pedidos web pendientes (reserva blanda).
  reservado     integer not null default 0 check (reservado >= 0),
  stock_minimo  integer not null default 5,
  destacado     boolean not null default false,
  activo        boolean not null default true,
  orden         integer not null default 0
);

-- Lo que el cliente puede comprar hoy. La web SIEMPRE lee de acá:
-- leer `stock` directo mostraría unidades ya comprometidas por otro pedido.
-- security_invoker: sin esto la vista correría con permisos del owner y se
-- saltearía el RLS de `productos`, exponiendo los inactivos.
create or replace view productos_disponibles
  with (security_invoker = true) as
  select
    p.*,
    greatest(0, p.stock - p.reservado) as disponible
  from productos p;

-- ── Pedidos ─────────────────────────────────────────────────────────────────
create table if not exists pedidos (
  id               uuid primary key default gen_random_uuid(),
  -- Código corto tipo "A7F3": es lo que une el chat de WhatsApp con esta fila.
  codigo           text not null unique,
  estado           text not null default 'pendiente' check (estado in
                     ('pendiente','confirmado','modificado','cancelado','expirado')),
  cliente_nombre   text not null default '',
  cliente_telefono text not null default '',
  items            jsonb not null default '[]'::jsonb,
  total            numeric not null default 0,
  nota             text not null default '',
  creado_en        timestamptz not null default now(),
  resuelto_en      timestamptz,
  -- Pasada esta fecha la reserva se libera sola (ver expirar_pedidos()).
  expira_en        timestamptz not null default now() + interval '24 hours'
);

create index if not exists pedidos_estado_idx on pedidos (estado, creado_en desc);

-- ── Ledger de movimientos de stock ──────────────────────────────────────────
-- No guardamos sólo un número: guardamos POR QUÉ cambió. Eso da auditoría,
-- permite revertir sin perder rastro, y hace que la futura integración con el
-- sistema del mostrador sea idempotente.
create table if not exists movimientos_stock (
  id          uuid primary key default gen_random_uuid(),
  producto_id text not null references productos(id) on delete cascade,
  delta       integer not null,          -- negativo = salida
  origen      text not null check (origen in
                ('pedido_web','mostrador','ajuste','reposicion','pos_externo')),
  ref_id      uuid,                      -- pedido web que lo originó
  ref_externo text,                      -- id de la venta en el sistema externo
  nota        text not null default '',
  creado_en   timestamptz not null default now()
);

create index if not exists movimientos_producto_idx
  on movimientos_stock (producto_id, creado_en desc);

-- Idempotencia: si el sistema del mostrador reenvía la misma venta (pasa
-- siempre), esto evita descontar dos veces. Es la pieza que hace viable la
-- integración fiscal más adelante.
create unique index if not exists movimientos_ref_externo_unico
  on movimientos_stock (origen, ref_externo)
  where ref_externo is not null;

-- ── Config editable del sitio ───────────────────────────────────────────────
create table if not exists config_sitio (
  clave text primary key,
  valor text not null default ''
);

-- ============================================================================
-- Funciones. Todo lo que toca stock pasa por acá para que sea atómico.
-- ============================================================================

-- Registra un movimiento y actualiza el stock en la misma transacción.
create or replace function aplicar_movimiento(
  p_producto_id text,
  p_delta       integer,
  p_origen      text,
  p_ref_id      uuid    default null,
  p_ref_externo text    default null,
  p_nota        text    default ''
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into movimientos_stock (producto_id, delta, origen, ref_id, ref_externo, nota)
  values (p_producto_id, p_delta, p_origen, p_ref_id, p_ref_externo, p_nota);

  update productos
     set stock = greatest(0, stock + p_delta)
   where id = p_producto_id;
end;
$$;

-- Crea el pedido y RESERVA las unidades. No toca el stock real: un pedido por
-- WhatsApp no es una venta hasta que el dueño lo confirma.
create or replace function crear_pedido(
  p_codigo    text,
  p_nombre    text,
  p_telefono  text,
  p_items     jsonb,
  p_nota      text default '',
  p_horas     integer default 24
) returns pedidos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item    jsonb;
  v_total   numeric := 0;
  v_pedido  pedidos;
begin
  -- Verifica disponibilidad y reserva, producto por producto.
  for v_item in select * from jsonb_array_elements(p_items) loop
    update productos
       set reservado = reservado + (v_item->>'cantidad')::int
     where id = v_item->>'productoId'
       and stock - reservado >= (v_item->>'cantidad')::int;

    if not found then
      raise exception 'Sin stock suficiente para %', v_item->>'productoId'
        using errcode = 'check_violation';
    end if;

    v_total := v_total
      + (v_item->>'precioUnitario')::numeric * (v_item->>'cantidad')::int;
  end loop;

  insert into pedidos (codigo, cliente_nombre, cliente_telefono, items, total, nota, expira_en)
  values (p_codigo, p_nombre, p_telefono, p_items, v_total, p_nota,
          now() + (p_horas || ' hours')::interval)
  returning * into v_pedido;

  return v_pedido;
end;
$$;

-- Resuelve un pedido pendiente.
--   'confirmado' → aplica la baja real de stock y libera la reserva
--   'modificado' → idem pero con los items editados por el dueño
--   'cancelado'  → sólo libera la reserva, el stock queda intacto
create or replace function resolver_pedido(
  p_id          uuid,
  p_estado      text,
  p_items_nuevos jsonb default null
) returns pedidos
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido  pedidos;
  v_item    jsonb;
  v_finales jsonb;
  v_total   numeric := 0;
begin
  select * into v_pedido from pedidos where id = p_id for update;

  if not found then
    raise exception 'Pedido inexistente';
  end if;

  if v_pedido.estado <> 'pendiente' then
    raise exception 'El pedido ya fue resuelto (%). ', v_pedido.estado;
  end if;

  -- Siempre se libera la reserva original.
  for v_item in select * from jsonb_array_elements(v_pedido.items) loop
    update productos
       set reservado = greatest(0, reservado - (v_item->>'cantidad')::int)
     where id = v_item->>'productoId';
  end loop;

  if p_estado in ('confirmado','modificado') then
    v_finales := coalesce(p_items_nuevos, v_pedido.items);

    for v_item in select * from jsonb_array_elements(v_finales) loop
      if (v_item->>'cantidad')::int > 0 then
        perform aplicar_movimiento(
          v_item->>'productoId',
          -(v_item->>'cantidad')::int,
          'pedido_web',
          p_id,
          null,
          'Pedido ' || v_pedido.codigo
        );
        v_total := v_total
          + (v_item->>'precioUnitario')::numeric * (v_item->>'cantidad')::int;
      end if;
    end loop;

    update pedidos
       set estado = p_estado, items = v_finales, total = v_total, resuelto_en = now()
     where id = p_id
    returning * into v_pedido;
  else
    update pedidos
       set estado = p_estado, resuelto_en = now()
     where id = p_id
    returning * into v_pedido;
  end if;

  return v_pedido;
end;
$$;

-- Libera las reservas de pedidos que nadie resolvió. Sin esto el inventario se
-- llena de unidades comprometidas por gente que nunca escribió.
create or replace function expirar_pedidos()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_pedido pedidos;
  v_item   jsonb;
  v_n      integer := 0;
begin
  for v_pedido in
    select * from pedidos where estado = 'pendiente' and expira_en < now()
  loop
    for v_item in select * from jsonb_array_elements(v_pedido.items) loop
      update productos
         set reservado = greatest(0, reservado - (v_item->>'cantidad')::int)
       where id = v_item->>'productoId';
    end loop;

    update pedidos set estado = 'expirado', resuelto_en = now() where id = v_pedido.id;
    v_n := v_n + 1;
  end loop;

  return v_n;
end;
$$;

-- ============================================================================
-- RLS
-- ============================================================================
alter table productos          enable row level security;
alter table pedidos            enable row level security;
alter table movimientos_stock  enable row level security;
alter table config_sitio       enable row level security;

drop policy if exists productos_lectura_publica on productos;
create policy productos_lectura_publica on productos
  for select using (activo = true);

drop policy if exists productos_escritura_dueno on productos;
create policy productos_escritura_dueno on productos
  for all using (auth.role() = 'authenticated')
          with check (auth.role() = 'authenticated');

drop policy if exists config_lectura_publica on config_sitio;
create policy config_lectura_publica on config_sitio
  for select using (true);

drop policy if exists config_escritura_dueno on config_sitio;
create policy config_escritura_dueno on config_sitio
  for all using (auth.role() = 'authenticated')
          with check (auth.role() = 'authenticated');

-- Los pedidos se crean vía crear_pedido() (security definer), no por insert
-- directo. Leerlos y resolverlos requiere estar logueado.
drop policy if exists pedidos_dueno on pedidos;
create policy pedidos_dueno on pedidos
  for all using (auth.role() = 'authenticated')
          with check (auth.role() = 'authenticated');

drop policy if exists movimientos_dueno on movimientos_stock;
create policy movimientos_dueno on movimientos_stock
  for all using (auth.role() = 'authenticated')
          with check (auth.role() = 'authenticated');

-- Permisos de ejecución.
grant execute on function crear_pedido(text,text,text,jsonb,text,integer) to anon, authenticated;
grant execute on function expirar_pedidos() to anon, authenticated;
grant execute on function resolver_pedido(uuid,text,jsonb) to authenticated;
grant execute on function aplicar_movimiento(text,integer,text,uuid,text,text) to authenticated;
