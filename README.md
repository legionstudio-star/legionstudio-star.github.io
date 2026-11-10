# LEGION Studio Digital — legionestudio.com

Sitio de LEGION y sistema de **habladores QR + NFC** para restaurantes, heladerías y bares.

| Página | Enlace |
| --- | --- |
| Página principal de LEGION | https://legionestudio.com/ |
| Habladores (página de ventas) | https://legionestudio.com/habladores/ |
| **Panel de clientes** (con usuario y contraseña) | https://legionestudio.com/panel/ |
| Diseño del hablador para imprimir | https://legionestudio.com/hablador/ |
| Página de cada cliente | https://legionestudio.com/&lt;slug&gt;/ |
| Tarjetas NFC (CR80, CD800) | https://legionestudio.com/tarjeta/?n=&lt;slug&gt; |
| Pantalla de meseros (con PIN) | https://legionestudio.com/mesero/?n=&lt;slug&gt; |
| Tarjeta de una mesa | https://legionestudio.com/&lt;slug&gt;/?mesa=7 |

## Cómo funciona

- Los clientes se crean y se editan en el **panel**. Los datos y las fotos se guardan en **Supabase**
  (proyecto de demos de LEGION, ref `cbvzwwhdfxwlujmninov`; el viejo `legion-habladores` quedó pausado el 10-nov-2026), así que los cambios quedan en línea al instante, sin publicar nada.
- El QR y el NFC de cada hablador llevan el **enlace fijo** del cliente (`legionestudio.com/<slug>/`).
  **Nunca se cambia el slug** de un cliente con hablador impreso (la base de datos no lo permite).
- `404.html` atiende todos los enlaces de clientes: lee el slug de la dirección y carga sus datos.

| Plan | Qué ve el cliente |
| --- | --- |
| Reseñas | Va directo a dejar la reseña en Google. |
| Plus | Página del negocio: reseña, menú con precios, WhatsApp, reservas, ubicación, wifi, redes y promoción. |
| Pro | Todo lo de Plus + carrito de pedidos (domicilio, recoger o mesa) que llega armado a WhatsApp. |

## Funciones de la tarjeta (panel → "Funciones de la tarjeta NFC y el QR")

- **Mesero virtual:** cada mesa tiene su tarjeta (`?mesa=N`). El cliente llama al mesero, pide la cuenta (elige cómo paga),
  pide algo (servilletas, salsas…) o hace el pedido desde la carta. El aviso llega a la **pantalla de meseros**
  (`/mesero/?n=<slug>`, con PIN; suena y vibra) o al WhatsApp del negocio, según se elija en el panel.
  El PIN se guarda cifrado (tabla `mesero_claves`); los avisos están en `mesero_llamados` y solo se leen con el PIN.
- **Catálogo virtual:** la carta se muestra en cuadrícula con fotos grandes; cada producto puede tener hasta 5 fotos (galería).
- Las tarjetas se diseñan e imprimen en `/tarjeta/` (una por mesa, cada una con su propio enlace NFC/QR).
  Lo que abre la tarjeta se cambia en el panel; la tarjeta no se vuelve a imprimir.

## Nuevo cliente

1. Panel → **Nuevo cliente** → nombre, plan, enlace de reseñas, logo (el color se toma solo), contacto, horario y menú → **Guardar**.
2. **Hablador** → elige el negocio → descarga la imagen PNG o imprime.
3. Programa el sticker NFC (NTAG213/215) con **NFC Tools**: Escribir → URL → enlace del cliente → Escribir → Otros → Bloquear etiqueta.

Si un cliente deja de pagar: apágalo con "Cliente activo" o bájalo al plan Reseñas.

### Enlace de reseñas de Google
Perfil de Empresa de Google del cliente → **Pedir reseñas** → copiar el enlace (`https://g.page/r/.../review`).
No se deben filtrar reseñas (mandar a Google solo a los clientes felices): Google lo prohíbe.

## Administradores del panel

Los usuarios se crean en Supabase → Authentication → Users → *Add user* (con "Auto confirm").
Para darle acceso al panel, su correo debe estar en la tabla `admins`:

```sql
insert into public.admins (email) values ('correo@ejemplo.com');
```

## Estructura

```
index.html               Página principal de LEGION (con el lanzamiento de los habladores)
habladores/              Página de ventas de los habladores
panel/                   Panel de clientes (Supabase: login, datos y fotos)
hablador/                Diseño imprimible del acrílico (logo del cliente, PNG 300 dpi, QR en SVG)
404.html                 Página de cada cliente (legionestudio.com/<slug>/)
app/app.js, app/app.css  Plantilla de la página del cliente
datos/config.js          Dirección base y conexión a Supabase (llave pública de solo lectura)
datos/logos/             Logos de los negocios de ejemplo
marca/                   Logo, arte y video de LEGION
CNAME                    Dominio de GitHub Pages
```
