/*
  BASE DE DATOS DE CLIENTES — LEGION Studio Digital
  ---------------------------------------------------
  Cada negocio es una entrada de este objeto. La clave es su "slug": la parte final
  del enlace que va en el QR y en el NFC (ej: .../legion/elsol/). NUNCA cambies el
  slug de un cliente que ya tiene hablador impreso.

  Después de agregar o editar un negocio, ejecuta:  node herramientas/generar.js

  plan:
    "basico" -> el QR/NFC va directo a dejar la reseña en Google.
    "plus"   -> página con reseña, botones (WhatsApp, ubicación, redes, wifi...) y menú sin pedidos.
    "pro"    -> todo lo anterior + menú con carrito de pedidos por WhatsApp.

  botones disponibles (en el orden que quieras):
    menu, domicilio, reservar, ubicacion, wifi, llamar, instagram, tiktok, facebook, web

  horario: 7 posiciones (0 = domingo ... 6 = sábado). [abre, cierra] en horas 0-24.
    Para cierres después de medianoche usa más de 24 (ej: 26 = 2:00 a. m.). null = cerrado.
*/

// Dirección base de todos los enlaces (QR y NFC). Cuando compremos el dominio, solo se cambia esta línea.
window.LEGION_URL = "https://legionstudio-star.github.io/";

// Enlace de reseñas de prueba (los negocios demo no existen en Google).
// Para un cliente real: Perfil de Empresa de Google > "Pedir reseñas" > copiar enlace (g.page/r/.../review).
const RESENA_DEMO = "https://www.google.com/maps/search/?api=1&query=restaurantes+en+Melgar+Tolima";

const FOTO = (id, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

window.NEGOCIOS = {

  elsol: {
    nombre: "Asadero El Sol de Melgar",
    categoria: "Asadero · Comida tolimense",
    eslogan: "Carnes a la leña desde 2012",
    plan: "pro",
    color: "#E8590C",
    tema: "claro",
    portada: FOTO("photo-1544025162-d76694265947"),
    logo: null,
    whatsapp: "573234953988",
    telefono: "573234953988",
    direccion: "Calle 6 # 24-15, Centro, Melgar, Tolima",
    mapa: "Parque Principal Melgar Tolima",
    resenas: RESENA_DEMO,
    instagram: "elsoldemelgar",
    wifi: { red: "ElSol_Clientes", clave: "asado2026" },
    promo: { titulo: "Martes de costillas", texto: "Costillas BBQ a $ 29.000 todos los martes." },
    horario: [[11, 23], [11, 21], [11, 21], [11, 21], [11, 21], [11, 23], [11, 23]],
    botones: ["menu", "domicilio", "ubicacion", "wifi", "instagram", "llamar"],
    menu: {
      carrito: true,
      domicilio: 5000,
      categorias: [
        { nombre: "Entradas", items: [
          { n: "Patacones con hogao", d: "Plátano verde crocante, hogao casero y queso costeño.", p: 12000 },
          { n: "Chicharrón con arepa", d: "Chicharrón carnudo, arepa de maíz pelao y limón.", p: 16000, tag: "Favorito" },
          { n: "Empanadas tolimenses (4)", d: "Rellenas de carne y papa, con ají de la casa.", p: 10000 },
          { n: "Chorizo y morcilla", d: "A la brasa, con papa criolla y arepa.", p: 15000 }
        ]},
        { nombre: "Platos fuertes", items: [
          { n: "Punta de anca 400 g", d: "Término a tu gusto, chimichurri, papa salada y ensalada.", p: 42000, tag: "Favorito", foto: FOTO("photo-1600891964092-4316c288032e", 300) },
          { n: "Ternera a la llanera", d: "Asada lentamente en vara durante seis horas.", p: 38000, foto: FOTO("photo-1529193591184-b1d58069ecdd", 300) },
          { n: "Costillas BBQ", d: "Costilla de cerdo glaseada con panela y tamarindo.", p: 36000, foto: FOTO("photo-1544025162-d76694265947", 300) },
          { n: "Mojarra frita", d: "Mojarra roja entera, patacón, arroz con coco y ensalada.", p: 34000 },
          { n: "Pollo asado (½)", d: "Marinado en hierbas, asado al carbón.", p: 26000 },
          { n: "Picada El Sol (2 personas)", d: "Res, cerdo, pollo, chorizo, chicharrón, papa criolla y yuca.", p: 68000, tag: "Para compartir", foto: FOTO("photo-1555939594-58d7cb561ad1", 300) }
        ]},
        { nombre: "Bebidas", items: [
          { n: "Limonada de coco", d: "Cremosa, dulce y helada.", p: 9000, tag: "Favorito" },
          { n: "Jugo natural", d: "Mango, mora, lulo o maracuyá. En agua o en leche.", p: 7000 },
          { n: "Cerveza nacional", d: "Botella fría, 330 ml.", p: 6000 },
          { n: "Gaseosa o agua", d: "Personal, 400 ml.", p: 4000 }
        ]},
        { nombre: "Postres", items: [
          { n: "Arroz con leche", d: "Cremoso, con canela y uvas pasas.", p: 7000 },
          { n: "Brevas con arequipe", d: "Con queso fresco.", p: 9000 }
        ]}
      ]
    }
  },

  lanevada: {
    nombre: "Heladería La Nevada",
    categoria: "Heladería · Postres",
    eslogan: "Helado artesanal hecho en Melgar",
    plan: "plus",
    color: "#D6336C",
    tema: "claro",
    portada: FOTO("photo-1501443762994-82bd5dace89a"),
    logo: null,
    whatsapp: "573234953988",
    telefono: "573234953988",
    direccion: "Carrera 25 # 7-40, frente al parque, Melgar, Tolima",
    mapa: "Parque Principal Melgar Tolima",
    resenas: RESENA_DEMO,
    instagram: "lanevadamelgar",
    tiktok: "lanevadamelgar",
    wifi: { red: "LaNevada", clave: "helado123" },
    promo: { titulo: "2 x 1 en conos", texto: "De lunes a jueves, de 2:00 a 5:00 p. m." },
    horario: [[10, 22], [12, 21], [12, 21], [12, 21], [12, 21], [10, 22], [10, 22]],
    botones: ["menu", "domicilio", "ubicacion", "wifi", "instagram", "tiktok"],
    menu: {
      carrito: false,
      categorias: [
        { nombre: "Helados", items: [
          { n: "Cono sencillo", d: "Una bola del sabor que quieras.", p: 6000, foto: FOTO("photo-1497034825429-c343d7c6a68f", 300) },
          { n: "Cono doble", d: "Dos bolas con topping.", p: 9500, tag: "Favorito", foto: FOTO("photo-1576506295286-5cda18df43e7", 300) },
          { n: "Copa La Nevada", d: "Tres bolas, crema, salsa de mora y fruta.", p: 16000, foto: FOTO("photo-1563805042-7684c019e1cb", 300) },
          { n: "Paleta artesanal", d: "Mora, mango biche, maracuyá o coco.", p: 5500, foto: FOTO("photo-1488900128323-21503983a07e", 300) }
        ]},
        { nombre: "Malteadas", items: [
          { n: "Malteada clásica", d: "Vainilla, chocolate o fresa. 16 oz.", p: 13000, foto: FOTO("photo-1557142046-c704a3adf364", 300) },
          { n: "Malteada Oreo", d: "Con galleta triturada y crema.", p: 15000, tag: "Nuevo" }
        ]},
        { nombre: "Postres", items: [
          { n: "Brownie con helado", d: "Brownie tibio, bola de vainilla y fudge.", p: 12000 },
          { n: "Ensalada de frutas", d: "Con helado, crema y queso.", p: 14000 }
        ]}
      ]
    }
  },

  laterraza: {
    nombre: "La Terraza Bar",
    categoria: "Bar · Coctelería",
    eslogan: "Cócteles, música y la mejor vista de Melgar",
    plan: "plus",
    color: "#F2B134",
    tema: "oscuro",
    portada: FOTO("photo-1572116469696-31de0f17cc34"),
    logo: null,
    whatsapp: "573234953988",
    telefono: "573234953988",
    direccion: "Calle 7 # 26-10, piso 3, Melgar, Tolima",
    mapa: "Parque Principal Melgar Tolima",
    resenas: RESENA_DEMO,
    instagram: "laterrazamelgar",
    wifi: { red: "LaTerraza_VIP", clave: "coctel2026" },
    promo: { titulo: "Happy hour", texto: "2 x 1 en cócteles de la casa, jueves a sábado de 6:00 a 8:00 p. m." },
    horario: [[16, 25], null, null, [17, 25], [17, 26], [17, 27], [16, 27]],
    botones: ["menu", "reservar", "ubicacion", "wifi", "instagram", "llamar"],
    menu: {
      carrito: false,
      categorias: [
        { nombre: "Cócteles", items: [
          { n: "Mojito", d: "Ron blanco, hierbabuena, limón y soda.", p: 24000, foto: FOTO("photo-1551024709-8f23befc6f87", 300) },
          { n: "Margarita de maracuyá", d: "Tequila, triple sec y maracuyá.", p: 26000, tag: "De la casa", foto: FOTO("photo-1544145945-f90425340c7e", 300) },
          { n: "Old fashioned", d: "Whisky, bitter y naranja.", p: 32000, foto: FOTO("photo-1470337458703-46ad1756a187", 300) },
          { n: "Gin tonic de frutos rojos", d: "Ginebra, tónica y frutos rojos.", p: 28000, foto: FOTO("photo-1536935338788-846bb9981813", 300) }
        ]},
        { nombre: "Cervezas", items: [
          { n: "Cerveza nacional", d: "Botella 330 ml.", p: 7000, foto: FOTO("photo-1608270586620-248524c67de9", 300) },
          { n: "Cerveza artesanal", d: "Pregunta por los estilos del día.", p: 14000 },
          { n: "Michelada", d: "Limón, sal y salsas de la casa.", p: 4000 }
        ]},
        { nombre: "Para picar", items: [
          { n: "Picada La Terraza", d: "Chorizo, chicharrón, papa criolla y guacamole.", p: 45000, tag: "Para compartir" },
          { n: "Alitas BBQ (10)", d: "Con papas a la francesa.", p: 32000 }
        ]}
      ]
    }
  },

  donpacho: {
    nombre: "Panadería Don Pacho",
    categoria: "Panadería · Cafetería",
    plan: "basico",
    color: "#8B5E34",
    tema: "claro",
    resenas: RESENA_DEMO
  }

};
