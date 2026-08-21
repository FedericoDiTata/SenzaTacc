-- ============================================================================
-- Senza Tacc — reset de la demo
-- GENERADO por scripts/generar-seed-sql.ts — no editar a mano.
--
-- Corré esto ANTES de mostrar la demo. Deja la base como recién instalada:
-- borra los pedidos de prueba, restaura el stock y vuelve a crear los 3
-- pedidos pendientes con las 24 h de reserva completas.
--
-- Es seguro correrlo cuantas veces quieras.
-- ============================================================================

-- 1. Limpia pedidos y movimientos.
delete from movimientos_stock;
delete from pedidos;

-- 2. Restaura stock, precio y umbrales a los valores de la demo.
--    Las reservas vuelven a cero porque ya no hay pedidos pendientes.
update productos p
   set stock        = v.stock,
       stock_minimo = v.stock_minimo,
       precio       = v.precio,
       reservado    = 0
  from (values
  ('schar-choco-chip-cookies', 18, 4, 7400),
  ('oreo-sin-gluten', 24, 6, 3400),
  ('schar-wafers-vainilla', 12, 4, 4800),
  ('schar-mini-sorrisi', 9, 4, 5600),
  ('schar-snack-chocolate', 3, 4, 5200),
  ('kapac-vainillas', 15, 4, 3900),
  ('angiola-limon-chocolate', 7, 3, 6200),
  ('celienergy-cacao-mani', 14, 4, 3700),
  ('doninas-chia-limon', 11, 4, 4100),
  ('doninas-amapola-naranja', 10, 4, 4100),
  ('rraac-rellenas-chocolate', 16, 4, 3200),
  ('snuks-almohaditas-frutilla', 0, 4, 2600),
  ('dantelli-alfajor-ddl', 32, 8, 1900),
  ('dantelli-ddl-mousse-x3', 13, 4, 4500),
  ('smams-alfajor-ddl', 28, 8, 1700),
  ('smams-alfajor-triple', 19, 6, 2900),
  ('lulemuu-alfajor-arroz', 41, 10, 1500),
  ('crudda-brownie', 22, 6, 3600),
  ('crudda-peanut-caramel', 20, 6, 3600),
  ('crudda-arandanos-nuez', 5, 6, 3600),
  ('bravisima-barra-proteica', 17, 5, 4900),
  ('merlin-bars-cafe-protein', 14, 5, 4700),
  ('emm-fit-bar-mani', 26, 6, 2800),
  ('mudra-armonia', 23, 6, 2400),
  ('mudra-bienestar', 21, 6, 2600),
  ('johnnys-barra-caju', 12, 5, 3300),
  ('laddubar-gold-almendras', 18, 5, 2700),
  ('food-alchimist-trufa-datiles', 30, 8, 1800),
  ('mani-king-salado', 16, 4, 6800),
  ('mani-king-tostado', 13, 4, 6800),
  ('mani-king-limon-pimienta', 27, 6, 2200),
  ('schar-grissini', 11, 4, 6100),
  ('lennys-pita-chips-sal', 8, 4, 4300),
  ('carilo-grisines-arvejas', 15, 4, 3100),
  ('crisppino-minis-jamon', 2, 5, 2300),
  ('dona-rosa-tirabuzon', 20, 5, 4900),
  ('dona-rosa-tirabuzon-multivegetal', 14, 5, 5400),
  ('dona-rosa-multivegetales', 9, 5, 4700),
  ('blue-patna-coditos', 22, 5, 4200),
  ('blue-patna-mostacholes', 19, 5, 4200),
  ('soyarroz-fideos-espinaca', 10, 5, 3900)
       ) as v(id, stock, stock_minimo, precio)
 where p.id = v.id;

-- 3. Vuelve a crear los pedidos de demo, con el reloj de la reserva en cero.
select crear_pedido(
  'K7M2',
  'Carolina Benítez',
  '+54 9 11 5312-8840',
  '[{"productoId":"dantelli-alfajor-ddl","nombre":"Alfajor de dulce de leche","marca":"Dantelli","unidad":"50 g","precioUnitario":1900,"cantidad":4},{"productoId":"dona-rosa-tirabuzon","nombre":"Tirabuzón","marca":"Doña Rosa","unidad":"500 g","precioUnitario":4900,"cantidad":2},{"productoId":"crudda-brownie","nombre":"Crudda Bar Brownie","marca":"Crudda","unidad":"40 g","precioUnitario":3600,"cantidad":3}]'::jsonb,
  'Paso a buscarlo hoy a la tarde, tipo 18 h.',
  24
);
update pedidos
   set creado_en = now() - interval '11 minutes'
 where codigo = 'K7M2';

select crear_pedido(
  'R4XP',
  'Martín Sosa',
  '+54 9 11 6027-3915',
  '[{"productoId":"schar-choco-chip-cookies","nombre":"Choco Chip Cookies","marca":"Schär","unidad":"200 g","precioUnitario":7400,"cantidad":1},{"productoId":"oreo-sin-gluten","nombre":"Oreo Sin Gluten","marca":"Oreo","unidad":"95 g","precioUnitario":3400,"cantidad":3},{"productoId":"mani-king-salado","nombre":"Maní salado sin piel","marca":"Maní King","unidad":"350 g","precioUnitario":6800,"cantidad":1}]'::jsonb,
  '',
  24
);
update pedidos
   set creado_en = now() - interval '47 minutes'
 where codigo = 'R4XP';

select crear_pedido(
  'B9TQ',
  'Lucía Ramírez',
  '+54 9 11 4488-2201',
  '[{"productoId":"lulemuu-alfajor-arroz","nombre":"Alfajor de arroz con dulce de leche","marca":"Lulemuu","unidad":"26 g","precioUnitario":1500,"cantidad":6},{"productoId":"mudra-armonia","nombre":"Mudra Armonía","marca":"Mudra","unidad":"35 g","precioUnitario":2400,"cantidad":2},{"productoId":"schar-grissini","nombre":"Grissini","marca":"Schär","unidad":"150 g · 3 u.","precioUnitario":6100,"cantidad":1}]'::jsonb,
  '¿Tenés más variedad de barritas? Si hay de arándanos sumame dos.',
  24
);
update pedidos
   set creado_en = now() - interval '143 minutes'
 where codigo = 'B9TQ';

-- 4. Control: deberían quedar 3 pendientes y 41 productos.
select
  (select count(*) from pedidos where estado = 'pendiente') as pedidos_pendientes,
  (select count(*) from productos)                          as productos,
  (select coalesce(sum(reservado), 0) from productos)       as unidades_reservadas;
