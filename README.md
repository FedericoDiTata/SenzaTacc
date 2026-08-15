# Senza Tacc

Sitio institucional y market con pedido por WhatsApp para **Senza Tacc**,
cafetería y market 100% libre de gluten en Almagro, CABA.

> **Estado: demo para cerrar la venta.** No es la versión final. Los precios, la
> carta de cafetería y los datos de contacto son provisorios — ver
> [AGENTS.md § Datos pendientes](AGENTS.md).

## Qué resuelve

El local no tenía web ni ningún registro de stock, ni siquiera un Excel. El
proyecto ataca las dos cosas:

- **Para el cliente** — un lugar donde ver qué venden, armar un pedido del market
  y terminarlo por WhatsApp con el mensaje ya escrito.
- **Para el dueño** — un panel donde resuelve los pedidos con un toque y ve su
  inventario siempre al día, incluidas las ventas del mostrador.

## Las dos ideas que sostienen todo

**Reserva blanda.** Un pedido por WhatsApp no es una venta hasta que el dueño lo
confirma, así que un pedido *reserva* unidades en vez de descontarlas:

```
disponible = stock - reservado     ← lo único que ve el cliente
```

Confirmar baja el stock real, cancelar libera la reserva, y a las 24 h sin
resolver se libera sola.

**Ledger de movimientos.** Cada cambio de stock se guarda con su `origen`
(`pedido_web`, `mostrador`, `ajuste`, `reposicion`, `pos_externo`) y una clave
única de referencia externa. Eso da auditoría, permite revertir sin perder
rastro, y hace que conectar el sistema de punto de venta del mostrador más
adelante sea agregar un webhook en lugar de rehacer el sistema.

## Stack

Next.js 16 · React 19 · Tailwind v4 · Framer Motion · Zustand · Supabase

## Cómo levantarlo

```bash
npm install
cp .env.example .env.local     # completar con las credenciales de Supabase
npm run dev
```

Sin credenciales de Supabase la app arranca igual con datos en memoria, pero
cada instancia ve su propio estado. Para la demo en vivo hace falta Supabase:
los pasos están en [AGENTS.md](AGENTS.md).

## Rutas

| Ruta | Qué es |
|---|---|
| `/` | Home institucional |
| `/market` | Catálogo con filtros, buscador y carrito |
| `/carta` | Carta de la cafetería (sólo lectura) |
| `/local` | El local, galería y ubicación |
| `/pedido` | Confirmación y salida a WhatsApp |
| `/panel` | Pedidos entrantes · Stock · Mostrador (requiere login) |

---

**Leé [AGENTS.md](AGENTS.md) antes de tocar código.** Tiene la arquitectura, los
breaking changes de Next 16 que ya nos mordieron y qué datos siguen pendientes
del cliente.
