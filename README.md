# LEGION Studio Digital — Habladores QR + NFC

Sistema de páginas por negocio para habladores acrílicos con código QR y sticker NFC.
Nicho: restaurantes, heladerías, bares y cafeterías.

| Página | Enlace |
| --- | --- |
| Página de ventas de LEGION | https://legionstudio-star.github.io/ |
| Panel de clientes (interno) | https://legionstudio-star.github.io/panel/ |
| Diseño del hablador para imprimir | https://legionstudio-star.github.io/hablador/ |

## Cómo funciona

El QR y el NFC de cada hablador llevan un **enlace fijo** del cliente (`.../<slug>/`).
Lo que se abre depende del plan, y se cambia sin reimprimir nada:

| Plan | Qué ve el cliente |
| --- | --- |
| `basico` | Va directo a dejar la reseña en Google. |
| `plus` | Página del negocio: reseña, menú con precios, WhatsApp, reservas, ubicación, wifi, redes y promoción. |
| `pro` | Todo lo de Plus + carrito de pedidos (domicilio, recoger o mesa) que llega armado a WhatsApp. |

## Agregar un cliente nuevo

1. Copia una entrada en `datos/negocios.js` y cambia los datos. El **slug** (la clave) va en el enlace: corto, en minúsculas, sin tildes ni espacios. **Nunca lo cambies después de imprimir.**
2. Ejecuta `node herramientas/generar.js` (crea la carpeta del cliente).
3. Publica (`git add -A && git commit -m "..." && git push`).
4. Abre el **Hablador**, elige el negocio, sube su logo (toma su color solo), descarga la imagen PNG o imprime, y programa el NFC con el mismo enlace.

### Enlace de reseñas de Google
Perfil de Empresa de Google del cliente → **Pedir reseñas** → copiar el enlace (`https://g.page/r/.../review`) y pegarlo en `resenas`.
No se deben filtrar reseñas (mandar a Google solo a los clientes felices): Google lo prohíbe.

### Programar el sticker NFC
NTAG213 o NTAG215 + app **NFC Tools** → Escribir → Agregar registro → URL → pegar enlace → Escribir.
Luego **Otros → Bloquear etiqueta** para que nadie lo cambie. Como el enlace es fijo, no hace falta volver a programarlo.

## Dominio propio

Todos los enlaces salen de `window.LEGION_URL` en `datos/negocios.js`.
Al comprar el dominio: configurarlo en GitHub Pages (Settings → Pages → Custom domain), cambiar esa línea y volver a generar.
Los QR ya impresos con la dirección de GitHub siguen funcionando porque GitHub redirige al dominio nuevo.

## Estructura

```
datos/negocios.js        Base de datos de clientes (lo único que se edita a diario)
app/app.js, app/app.css  Plantilla de la página de cada negocio
<slug>/index.html        Página de cada cliente (generada, no editar a mano)
hablador/                Diseño imprimible del acrílico + descarga del QR en SVG
panel/                   Lista interna de clientes y enlaces
herramientas/generar.js  Generador de páginas
```

Fotos de demostración: [Unsplash](https://unsplash.com/license).
