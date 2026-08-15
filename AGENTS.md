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

**El acceso no se anuncia en la web.** No hay enlace a `/panel` ni a `/login` en
ningún lado del sitio público: el dueño entra escribiendo la URL, o mejor,
guardándola en favoritos o en la pantalla de inicio del celular. `app/robots.ts`
las saca de los buscadores.

Ojo con confundir capas: robots.txt es público y es una petición, no un candado.
Lo que protege de verdad es el login y la validación de sesión dentro de cada
Server Action. No anunciar el acceso es comodidad y prolijidad, no seguridad.

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
| **Fotos del local en alta** | `public/local/` | Las actuales son de WhatsApp, 960 px. Ver § El problema de las fotos |
| Carta en PDF | `lib/carta.ts` | El cliente la va a pasar; la vista se va a rediseñar a partir de eso |

Las fotos de producto son packshots de proveedor. Para la demo va perfecto; para
producción conviene mencionarlo.

---

## Marca

No hay manual, pero sí logo: `public/logo-senza-tacc.png`, el sello circular del
local. **La paleta sale de ahí**, muestreada por histograma de píxeles. Tokens en
`app/globals.css`.

| Token | Valor | De dónde sale |
|---|---|---|
| `ladrillo` | `#A92416` | El campo del sello. Es EL acento de la marca (~55% del logo) |
| `crema-logo` | `#FCDDB2` | El anillo y la tipografía del sello |
| `verde` | `#2F4F2F` | El anillo exterior. También el "todo bien" del panel |
| `dorado` | `#EBA12E` | Las espigas. Para rellenos y badges |
| `crema` | `#FAF6ED` | Fondo de página — el crema del logo aclarado y desaturado |
| `crema-profundo` | `#F2E8D6` | Secciones alternas |
| `tinta` | `#1F1B18` | Texto. Negro apenas cálido para que no choque con el ladrillo |
| `ambar` | `#8A5D0C` | El dorado oscurecido, para texto que necesita contraste |

Dos decisiones que conviene no revertir sin pensarlo:

- **Los cremas de fondo son versiones aclaradas del crema del logo.** A
  saturación plena (`#FCDDB2`) una página larga se vuelve ilegible.
- **`rojo` y `ladrillo` son el mismo color.** La marca ya es roja; meter un
  segundo rojo sólo para errores ensuciaría la paleta. En contexto (un botón
  "Cancelar", un contador de faltantes) se lee bien igual.

Otros criterios:

- **Display:** Playfair Display — lo más cercano al cartel del local.
- **Texto:** DM Sans.
- **El sello va en navbar y footer** (`components/marca/Logo.tsx`). En el navbar
  va acompañado del wordmark porque a 36 px el texto de adentro no se lee.
- **No hay más motivo de la taza.** Existió un ícono de taza de línea sacado del
  póster del local; se eliminó por pedido del cliente. Los estados vacíos usan
  íconos neutros (`components/ui/Iconos.tsx`) y el sello aparece sólo donde hay
  un momento de marca real.
- **Todas las fotos van a color**, las del local y las de producto.
- El hero mide `86svh` a propósito: que la sección siguiente asome es lo que
  avisa que hay más para ver. No lleva puntos de navegación ni contador.

### El problema de las fotos del local

Las seis fotos de `public/local/` son **verticales de celular (~960×1280) y
comprimidas por WhatsApp**. Eso trae dos problemas distintos:

- **Encuadre** — en una franja apaisada el recorte por defecto cae en la parte
  menos interesante. Por eso cada slide del hero tiene su `foco`
  (`object-position`), y la foto de la carta usa `50% 72%`: centrada mostraba la
  máquina de café en vez de las medialunas.
- **Nitidez** — 960 px estirados a 1440+ son 1,5× de upscale, y eso **no se
  arregla desde el código**. Está puesto `quality={90}` y el Ken Burns se
  contuvo a 1,05×, pero el techo lo pone la fuente. Sólo se ven nítidas donde se
  achican (galería de `/local`, sección "El lugar").

**La solución real es pedirle al cliente los originales del celular**, enviados
por Drive o AirDrop y no por WhatsApp, que recorta a 1280 px y recomprime.

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
