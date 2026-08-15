<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Senza Tacc — guía del proyecto

Sitio institucional + market con pedido por WhatsApp y control de stock, para
**Senza Tacc**, cafetería y market 100% libre de gluten en Almagro (CABA).

Estado: **demo para cerrar la venta**, no versión final.

---

## Breaking changes de Next 16 que ya nos mordieron

Leé la guía correspondiente en `node_modules/next/dist/docs/` antes de escribir
código nuevo. Los concretos:

- **`middleware.ts` ya no existe: ahora es `proxy.ts`** (misma semántica).
  Ver `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`.
- `refresh()` de `next/cache` refresca el router; no revalida datos etiquetados.
- Las Server Actions se pueden invocar con un POST directo sin pasar por
  ninguna página → **toda acción que escriba valida sesión adentro**.

### TypeScript

Instalar siempre `typescript@^5` explícito. Un `npm i -D typescript` pelado
trae TS 7 en esta PC y Next 16 rompe con *"does not provide the compiler API
required"*.

`scripts/` está excluido del `tsconfig.json`: son utilidades que corre Node
directo, y el type-stripping de Node exige la extensión `.ts` en los imports,
que es justo lo que el tsconfig del proyecto prohíbe.

---

## Las dos ideas que sostienen todo

### 1. Reserva blanda

Un pedido por WhatsApp **no es una venta** hasta que el dueño lo confirma. Si
descontáramos stock al confirmar el carrito, en una semana el inventario estaría
lleno de ventas fantasma.

```
stock       = lo que hay físicamente en la góndola
reservado   = suma de los pedidos web en estado "pendiente"
disponible  = stock - reservado     ← lo único que ve el cliente
```

- Pedido nuevo → **reserva** (sube `reservado`, `stock` intacto).
- Confirmar / modificar → baja real de `stock` + libera la reserva.
- Cancelar → sólo libera la reserva.
- A las 24 h sin resolver, la reserva se libera sola (`expirarPedidos()`).

**Nunca leas `stock` para decidir qué mostrar en la web.** Usá
`disponible(producto)` de `lib/types.ts`.

### 2. Ledger de movimientos

`movimientos_stock` guarda *por qué* cambió el stock, no sólo que cambió. Tres
razones concretas:

1. **Auditoría** — ante una diferencia, hay historia.
2. **Idempotencia** — `unique (origen, ref_externo)` evita que el sistema del
   mostrador descuente dos veces la misma venta cuando la reenvía.
3. **Reversión limpia** — revertir es insertar el movimiento inverso.

El campo `origen` (`pedido_web | mostrador | ajuste | reposicion | pos_externo`)
es la bisagra hacia la integración fiscal: el día que se conecte el POS, sus
ventas entran como `pos_externo` y no hay que rehacer nada.

---

## Estructura

```
app/
  layout.tsx              root minimalista: html, body, fuentes
  (sitio)/                ← grupo público (navbar + carrito + footer)
    layout.tsx
    page.tsx              home
    market/               catálogo con filtros y buscador
    carta/                carta de cafetería (sólo lectura)
    local/                el local, galería, ubicación
    pedido/               checkout → WhatsApp
      acciones.ts         "use server" — crea el pedido y reserva
  panel/                  ← fuera del grupo: es otra app
    layout.tsx  NavPanel.tsx  AutoRefresco.tsx  acciones.ts
    page.tsx              pedidos entrantes
    stock/                inventario + ledger
    mostrador/            venta presencial
  login/
proxy.ts                  protege /panel + renueva la sesión
lib/
  types.ts                tipos + disponible() + estadoStock() + formatARS()
  seed.ts                 los 41 productos (fuente de verdad del catálogo)
  seedPedidos.ts          3 pedidos de demo
  carta.ts                carta de cafetería (CONTENIDO DE MUESTRA)
  siteConfig.ts           datos de contacto y horarios
  cartStore.ts            Zustand + persist
  whatsapp.ts             armado del mensaje
  auth.ts                 requerirSesion() para Server Actions
  data/                   ← capa de datos
    contrato.ts           interfaz FuenteDatos
    memoria.ts            implementación local
    supabase.ts           implementación real
    index.ts              elige una y la exporta como `datos`
supabase/
  schema.sql              tablas, vista, funciones, RLS
  seed.sql                catálogo — GENERADO, no editar
  seed-pedidos.sql        pedidos de demo — GENERADO, no editar
scripts/generar-seed-sql.ts
```

### Capa de datos

Los componentes importan **siempre** `datos` desde `@/lib/data`, nunca de
`memoria` ni de `supabase` directamente.

Reglas del contrato (`lib/data/contrato.ts`):

1. **Todas las funciones son async**, aunque la implementación sea síncrona.
   Cambiar de fuente no debe obligar a tocar un solo componente.
2. **Las escrituras del panel pasan por acá.** Nada de mutar estado por fuera.

Si no hay credenciales de Supabase, cae a `memoria.ts`. Ojo con eso:

> El estado de `memoria.ts` cuelga de `globalThis` **a propósito**. Next arma un
> bundle por ruta, así que un módulo importado desde una Server Action y desde
> un Server Component puede instanciarse dos veces en el mismo proceso. Con
> `let` a nivel de módulo el pedido se creaba en una copia y el panel leía la
> otra: generaba código pero el pedido no aparecía nunca.

Aun así, **la demo real necesita Supabase**: sin él cada dispositivo ve su
propio estado y se pierde el momento de "el pedido entra en vivo".

---

## Puesta en marcha

```bash
npm install
cp .env.example .env.local     # y completar
npm run dev
```

### Supabase (necesario para la demo)

1. Crear proyecto en [supabase.com](https://supabase.com) (el plan free alcanza).
2. SQL Editor → correr **`supabase/schema.sql`** entero.
3. SQL Editor → correr **`supabase/seed.sql`** (41 productos).
4. SQL Editor → correr **`supabase/seed-pedidos.sql`** (3 pedidos pendientes).
   Opcional pero muy recomendable: **un panel vacío no vende**.
5. Authentication → Users → **Add user** con email y contraseña para el dueño.
   No hay registro público: el único usuario se crea a mano.
6. Copiar Project URL y anon key a `.env.local`.

Para cambiar el catálogo: editar `lib/seed.ts` y correr
`node scripts/generar-seed-sql.ts`, que regenera los dos `.sql`.

### Autenticación

`proxy.ts` bloquea `/panel` para quien no tenga sesión, y `requerirSesion()`
protege cada Server Action (una acción se puede invocar por POST directo sin
pasar por la página).

**Sin Supabase configurado el panel queda abierto**, con un cartel ámbar bien
visible avisándolo. Es para poder desarrollar sin backend. No deployear así.

---

## Datos pendientes del cliente

Todo esto son placeholders. Están marcados en el código.

| Qué | Dónde | Nota |
|---|---|---|
| **Sistema del mostrador** | — | La pregunta más importante: define si la integración fiscal es viable |
| WhatsApp del local | `lib/siteConfig.ts` | Hoy `5491100000000` |
| Dirección y horarios | `lib/siteConfig.ts` | Google Maps dice Pringles 432 — confirmar |
| **Precios reales** | `lib/seed.ts` | **Los 41 están inventados.** Se cargan desde el panel |
| Stock real inicial | `lib/seed.ts` | Elegidos para que la demo muestre los tres estados |
| **Carta de cafetería** | `lib/carta.ts` | **Contenido de muestra entero.** Aclararlo en la reunión |
| ¿Envío o sólo retiro? | `lib/siteConfig.ts` | Hoy asume sólo retiro |
| Historia del local | `app/(sitio)/local/page.tsx` | Texto escrito de oficio |

Las fotos de producto son packshots de proveedor. Para la demo va perfecto; para
producción conviene mencionarlo.

---

## Marca

No hay manual: la paleta está **derivada de las fotos del local**
(`public/local/`). Tokens en `app/globals.css`.

| Token | Valor | De dónde sale |
|---|---|---|
| `crema` | `#F5F1E8` | Las paredes del salón |
| `crema-profundo` | `#EBE4D5` | Fondo de secciones alternas |
| `tinta` | `#1A1A1A` | Los marcos negros y el wordmark |
| `madera` | `#8B5E3C` | El listonado — **acento, con moderación** |
| `verde` / `ambar` / `rojo` | | Estados de stock, sobre todo en el panel |

- **Display:** Playfair Display — lo más cercano al cartel del local.
- **Texto:** DM Sans.
- **La taza de línea del póster es el motivo de la marca**
  (`components/marca/Taza.tsx`). Se repite a propósito: logo, carrito vacío,
  separadores, estados vacíos.
- Fotos del local en **blanco y negro** (clase `.foto-bn`), como los cuadros que
  ya tienen colgados. Productos a color sobre blanco.

Aplican además los estándares de
`C:\Users\feded\.claude\projects\C--Users-feded\memory\feedback_design_principles.md`.

---

## Verificación

```bash
npm run build        # tipos + build
npx tsc --noEmit     # sólo tipos
```

Lo que hay que probar a mano antes de mostrar la demo:

- [ ] Pedido desde el celular → aparece en el panel de la compu → confirmar →
      el stock baja en ambos. **Es la demo.**
- [ ] El link de WhatsApp en un **celular de verdad** (`wa.me` se comporta
      distinto en escritorio y en móvil).
- [ ] Un pedido `pendiente` reserva sin tocar el stock real; cancelarlo lo libera.
- [ ] `/panel` deslogueado redirige a `/login`.
- [ ] El panel en pantalla de celular: el dueño lo va a usar desde el mostrador.
