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
  reset-demo.sql          deja la base como recién instalada — GENERADO
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
   Más adelante, para volver a dejar todo como recién instalado, se usa
   **`supabase/reset-demo.sql`** (ver § Resetear la demo).
5. Authentication → Users → **Add user** con email y contraseña para el dueño.
   No hay registro público: el único usuario se crea a mano.
6. Copiar Project URL y anon key a `.env.local`.

Para cambiar el catálogo: editar `lib/seed.ts` y correr
`node scripts/generar-seed-sql.ts`, que regenera los tres `.sql`.

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
| **Carta real** | `lib/carta.ts` | El cliente va a pasar un PDF. El **diseño** de `/carta` ya está hecho; falta el contenido |
| Fotos de los platos | — | La carta está pensada para funcionar sin fotos por ítem, porque no las tenemos. Si llegan, entran en el destacado de cada sección |

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

### La carta

`/carta` tiene que leerse como **una sola hoja**, no como una sucesión de
secciones de landing. Todo el menú vive sobre un único fondo crema, en **dos
columnas** en desktop, y lo que separa las secciones es el color de su banda, no
un cambio de fondo a lo ancho de la pantalla.

Cada sección de `lib/carta.ts` define su `color` (`ladrillo | verde | ambar |
tinta`) y un `destacado` con su motivo. Las clases van **literales** en el mapa
`PALETA` de la página: el JIT de Tailwind lee el código fuente y no resuelve
`bg-${color}`.

Dos cosas que conviene no revertir:

- **El reparto en columnas lo calcula `repartir()`, no CSS.** Con `columns-2` el
  navegador no puede partir una sección al medio, reparte mal y deja una columna
  hasta 500 px más corta que la otra.
- **La nota "Todo, sin excepción" cierra la columna izquierda.** No es relleno:
  dice lo único que de verdad hay que entender del local, y de paso empareja las
  columnas.

El fondo lleva una trama de dibujos de línea (`components/carta/FondoDoodles.tsx`)
con espiga, medialuna, galletita y grano de café. La idea la trajo una carta de
otra cafetería que pasó el cliente como referencia, pero el vocabulario y la
paleta son los de Senza Tacc — copiar el celeste y las tipografías de marcador
de esa referencia hubiera peleado con el sello del que sale toda la identidad.

Está pensada para **funcionar sin fotos por ítem**, porque no las tenemos. Si el
cliente las manda, el lugar natural es el destacado de cada sección.

### Las fotos del local

Las manda el cliente. **Pedirlas siempre por Drive, nunca por WhatsApp**, que
recorta a 1280 px y recomprime: la primera tanda llegó a 960 px y se pixelaba en
el hero.

El pipeline vive en el scratchpad, no en el repo (es de una sola vez). Dos cosas
que conviene recordar si hay que rehacerlo:

- **Los HEIC del iPhone no los abre `sharp`.** libheif corta por límite de
  seguridad: *"Number of references in iref box (45) exceeds the security limits
  of 16"*, típico de fotos editadas en el celular. Se decodifican con
  **`heic-convert`** (libheif en WASM) y recién después se redimensionan con
  sharp. El decodificador nativo de Windows (WIC + PresentationCore) también
  sirve, pero depende de que la máquina tenga instalada la extensión HEIF.
- **El reparto es por resolución, y eso es lo que evita el pixelado.** Las de
  alta (2000 px) van al hero y a la franja de la carta, que ocupan el ancho
  completo. Las de 1024 px van a "el lugar" y a la galería, que las muestran a
  un tercio del ancho. Nunca se agranda: si el original es más chico, se deja.

Todas son verticales, así que en franjas apaisadas el recorte por defecto cae en
el techo o en el piso. Cada slide del hero define su `object-position`; los
cuatro se verificaron contra una página de prueba a 1440×774, que es el tamaño
real del hero en desktop.

---

### Resetear la demo

**Correr `supabase/reset-demo.sql` antes de cada presentación.** No es opcional
por dos motivos que aparecen solos con el uso:

- **Las reservas expiran a las 24 h.** Los pedidos de demo se cargan con
  `crear_pedido()`, que les pone 24 horas de reserva. Pasado ese plazo,
  `expirar_pedidos()` los marca como expirados y **el panel queda vacío**, que
  es exactamente lo que no querés que pase adelante del cliente.
- **Las pruebas ensucian el historial.** Cualquier pedido de test queda listado
  con su nombre a la vista.

El script borra pedidos y movimientos, restaura stock y precios desde
`lib/seed.ts`, y vuelve a crear los tres pedidos con el reloj en cero. Es
idempotente y termina con un `select` de control. Está validado contra Postgres.

Se regenera junto con los otros dos: `node scripts/generar-seed-sql.ts`.

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
- [ ] **Correr `reset-demo.sql` el mismo día**, o las reservas vencen y el panel
      aparece vacío.
