// LEGION WEAR — una tienda, dos mundos. Rutas: #/street, #/maison, #/<mundo>/tienda, #/<mundo>/p/<id>, #/<mundo>/lookbook, #/<mundo>/info
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const html = document.documentElement;
const vista = $('#vista');
const pesos = n => '$' + Math.round(n).toLocaleString('es-CO');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const mundoActual = () => html.dataset.mundo;
const deMundo = m => PRODUCTOS.filter(p => p.mundo === m);
const producto = id => PRODUCTOS.find(p => p.id === id);

// Textos de cada mundo: la misma tienda habla distinto en cada uno
const TXT = {
  street: {
    tienda: 'Drop 01', ver: 'Ver producto', agregar: 'Agregar al carrito', directo: 'Pedir directo por WhatsApp',
    completa: 'Completa el fit', talla: 'Talla', color: 'Color', vacio: 'Tu carrito está vacío. La calle te espera.',
    agregado: 'Agregado. Ya es tuyo.',
  },
  maison: {
    tienda: 'La Colección', ver: 'Descubrir', agregar: 'Añadir a la selección', directo: 'Solicitar por WhatsApp',
    completa: 'Completa el atuendo', talla: 'Talla', color: 'Tono', vacio: 'Su selección está vacía.',
    agregado: 'Añadido a su selección.',
  },
};

// ── IMAGEN DE PRODUCTO ── foto real si existe, si no la ilustración
function imagen(p, color, i = 0) {
  if (p.fotos && p.fotos[i]) return `<img src="${esc(p.fotos[i])}" alt="${esc(p.nombre)}" loading="lazy">`;
  return PRENDAS.svg(p.tipo, color || p.colores[0].h, { estampado: p.estampado, titulo: p.nombre, acento: p.mundo === 'maison' ? '#b08d57' : '#b3001b' });
}

function tarjeta(p, i = 0) {
  const m = p.mundo;
  return `<a class="tarjeta rev" style="--i:${i}" href="#/${m}/p/${p.id}">
    <div class="tarjeta-img">${imagen(p)}${p.fotos && p.fotos[1] ? `<img class="alt" src="${esc(p.fotos[1])}" alt="" loading="lazy">` : ''}${p.etiqueta ? `<span class="etiqueta">${esc(p.etiqueta)}</span>` : ''}
      <span class="tarjeta-ver">${TXT[m].ver}</span></div>
    <div class="tarjeta-info">
      <span class="tarjeta-cat">${esc(p.categoria)}</span>
      <h3>${esc(p.nombre)}</h3>
      <div class="tarjeta-pie"><span class="precio">${pesos(p.precio)}</span>
        <span class="puntos">${p.colores.map(c => `<i style="background:${c.h}" title="${esc(c.n)}"></i>`).join('')}</span></div>
    </div></a>`;
}

// ── INICIO STREET ──
function inicioStreet() {
  const nuevos = deMundo('street');
  return `
  <section class="s-hero">
    <div class="s-hero-txt">
      <p class="s-kicker rev"><span class="punto-vivo"></span> DROP 01 · ARMADURA URBANA</p>
      <h1 class="s-titulo" aria-label="Legion Wear">
        <span class="lin rev" data-txt="LEGION">LEGION</span>
        <span class="lin hueca rev" style="--i:1" data-txt="WEAR">WEAR</span>
      </h1>
      <p class="s-sub rev" style="--i:2">Ropa pesada para gente que no se dobla. Producción limitada, sin reposición.</p>
      <div class="s-ctas rev" style="--i:3">
        <a href="#/street/tienda" class="btn-s">Ver el drop <span>→</span></a>
        <a href="#/street/lookbook" class="btn-s fantasma">Lookbook</a>
      </div>
      <div class="cuenta-regresiva rev" style="--i:4" aria-label="Próximo drop">
        <span>PRÓXIMO DROP EN</span><b data-cr="d">00</b>D <b data-cr="h">00</b>H <b data-cr="m">00</b>M <b data-cr="s">00</b>S
      </div>
    </div>
    <div class="s-hero-arte">
      <div class="s-aro"></div>
      <a class="s-hero-foto" href="#/street/p/hoodie-battalion"><img src="img/productos/hoodie-1.jpg" alt="Hoodie Heavyweight Battalion"></a>
      <span class="s-sello">EST. 2026<br>BOGOTÁ</span>
      <span class="s-num">001/100</span>
    </div>
  </section>
  <div class="s-cinta"><div>${'<span>LEGION WEAR</span><b>✕</b><span>DROP 01</span><b>✕</b><span>NO RESTOCK</span><b>✕</b><span>LIMITED</span><b>✕</b>'.repeat(4)}</div></div>
  <section class="seccion">
    <div class="seccion-cab"><h2 class="s-h2 rev">LO NUEVO</h2><a href="#/street/tienda" class="ver-todo">Ver todo →</a></div>
    <div class="rejilla">${nuevos.slice(0, 4).map(tarjeta).join('')}</div>
  </section>
  <section class="s-manifiesto">
    <p class="rev">NO HACEMOS ROPA PARA <em>ENCAJAR</em>.<br>LA HACEMOS PARA <em>RESISTIR</em>.</p>
    <div class="s-datos">
      <div class="rev"><b>400G</b><span>Felpa pesada</span></div>
      <div class="rev" style="--i:1"><b>100</b><span>Unidades por drop</span></div>
      <div class="rev" style="--i:2"><b>0</b><span>Reposiciones</span></div>
    </div>
  </section>
  <section class="seccion">
    <div class="seccion-cab"><h2 class="s-h2 rev">MÁS DEL DROP</h2></div>
    <div class="rejilla">${nuevos.slice(4).map(tarjeta).join('')}</div>
  </section>
  ${puenteMundo('street')}`;
}

// ── INICIO MAISON ──
function inicioMaison() {
  const col = deMundo('maison');
  return `
  <section class="m-hero">
    <div class="m-hero-txt">
      <p class="m-kicker rev">Colección Otoño &middot; MMXXVI</p>
      <h1 class="m-titulo rev" style="--i:1">La elegancia<br><i>no se anuncia.</i><br>Se hereda.</h1>
      <p class="m-sub rev" style="--i:2">Prendas atemporales en fibras nobles, pensadas para durar generaciones y no temporadas.</p>
      <a href="#/maison/tienda" class="btn-m rev" style="--i:3"><span>Descubrir la colección</span></a>
    </div>
    <div class="m-hero-arte rev" style="--i:1">
      <a class="m-arco" href="#/maison/p/blazer-kensington"><img src="img/productos/blazer-2.jpg" alt="Blazer Kensington"></a>
      ${escudo('m-escudo-flota')}
      <p class="m-pie-foto"><i>Blazer Kensington</i> &mdash; Marino</p>
    </div>
  </section>
  <div class="m-filete"><span>${escudo('m-escudo-mini')}</span></div>
  <section class="seccion m-intro">
    <p class="m-cita rev">&ldquo;Lo que es verdaderamente elegante<br>nunca necesita <i>explicarse</i>.&rdquo;</p>
  </section>
  <section class="seccion">
    <div class="seccion-cab m-cab"><h2 class="m-h2 rev">Piezas <i>esenciales</i></h2><a href="#/maison/tienda" class="ver-todo">Ver la colección</a></div>
    <div class="rejilla m-editorial">${col.slice(0, 3).map(tarjeta).join('')}</div>
  </section>
  <section class="m-pilares">
    <div class="rev"><span class="m-num">I</span><h3>Fibras nobles</h3><p>Lana merino, algodón pima y cachemira seleccionados por su caída y su tacto.</p></div>
    <div class="rev" style="--i:1"><span class="m-num">II</span><h3>Corte preciso</h3><p>Patrones clásicos ajustados a mano para una silueta limpia y natural.</p></div>
    <div class="rev" style="--i:2"><span class="m-num">III</span><h3>Atemporal</h3><p>Sin logotipos ruidosos ni modas pasajeras. Prendas para toda la vida.</p></div>
  </section>
  <section class="seccion">
    <div class="seccion-cab m-cab"><h2 class="m-h2 rev">Para el <i>fin de semana</i></h2></div>
    <div class="rejilla m-editorial">${col.slice(3).map(tarjeta).join('')}</div>
  </section>
  ${puenteMundo('maison')}`;
}

// Escudo con monograma LW
function escudo(cls = '') {
  return `<svg class="escudo ${cls}" viewBox="0 0 120 140" aria-hidden="true">
    <path d="M60 6 L108 22 L108 66 Q108 112 60 134 Q12 112 12 66 L12 22 Z" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <path d="M60 14 L100 27 L100 66 Q100 105 60 125 Q20 105 20 66 L20 27 Z" fill="none" stroke="currentColor" stroke-width=".7"/>
    <text x="60" y="84" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="44" font-style="italic" fill="currentColor">LW</text>
    <text x="60" y="104" text-anchor="middle" font-family="Jost, sans-serif" font-size="6.5" letter-spacing="2.5" fill="currentColor">MMXXVI</text>
    <path d="M38 44 h44" stroke="currentColor" stroke-width=".7"/></svg>`;
}

function puenteMundo(m) {
  return m === 'street'
    ? `<section class="puente puente-a-maison"><a href="#/maison" class="rev"><span>¿Otro estilo?</span><b>Entra a <i>Legion Maison</i></b><em>Old money, lujo silencioso →</em></a></section>`
    : `<section class="puente puente-a-street"><a href="#/street" class="rev"><span>Otro lado de la casa</span><b>LGN STREET</b><em>Streetwear, Drop 01 →</em></a></section>`;
}

// ── TIENDA ──
function tienda(m, q) {
  const prods = deMundo(m), cats = [...new Set(prods.map(p => p.categoria))];
  const cat = q.get('cat') || '', orden = q.get('orden') || '';
  let lista = cat ? prods.filter(p => p.categoria === cat) : prods.slice();
  if (orden === 'menor') lista.sort((a, b) => a.precio - b.precio);
  if (orden === 'mayor') lista.sort((a, b) => b.precio - a.precio);
  const url = (c, o) => `#/${m}/tienda?` + new URLSearchParams({ ...(c ? { cat: c } : {}), ...(o ? { orden: o } : {}) });
  return `<section class="seccion tienda">
    <header class="tienda-cab">
      <h1 class="${m === 'street' ? 's-h1' : 'm-h1'} rev">${m === 'street' ? 'DROP 01' : 'La <i>Colección</i>'}</h1>
      <p class="rev">${m === 'street' ? `${prods.length} piezas · producción limitada` : `${prods.length} piezas atemporales`}</p>
    </header>
    <div class="filtros">
      <div class="chips"><a href="${url('', orden)}" class="chip ${!cat ? 'on' : ''}">Todo</a>
        ${cats.map(c => `<a href="${url(c, orden)}" class="chip ${c === cat ? 'on' : ''}">${esc(c)}</a>`).join('')}</div>
      <label class="orden">Ordenar
        <select onchange="location.hash='${url(cat, '')}'+(this.value?'&orden='+this.value:'')">
          <option value="">Destacados</option><option value="menor" ${orden === 'menor' ? 'selected' : ''}>Precio: menor a mayor</option>
          <option value="mayor" ${orden === 'mayor' ? 'selected' : ''}>Precio: mayor a menor</option></select></label>
    </div>
    <div class="rejilla">${lista.map(tarjeta).join('')}</div>
  </section>`;
}

// ── PRODUCTO ──
let sel = {};
function paginaProducto(p) {
  const t = TXT[p.mundo];
  sel = { id: p.id, color: p.colores[0].n, talla: p.tallas.length === 1 ? p.tallas[0] : '', cant: 1 };
  const otros = deMundo(p.mundo).filter(x => x.id !== p.id && x.categoria !== p.categoria).slice(0, 3);
  return `<section class="seccion producto">
    <nav class="migas"><a href="#/${p.mundo}">${p.mundo === 'street' ? 'LGN Street' : 'Maison'}</a> / <a href="#/${p.mundo}/tienda?cat=${encodeURIComponent(p.categoria)}">${esc(p.categoria)}</a> / <span>${esc(p.nombre)}</span></nav>
    <div class="producto-grid">
      <div class="galeria">
        <div class="galeria-principal" id="galeria">${imagen(p)}</div>
        <div class="galeria-miniaturas">${p.fotos
          ? p.fotos.map((f, i) => `<button class="mini ${i ? '' : 'on'}" data-foto="${i}" aria-label="Foto ${i + 1}">${imagen(p, null, i)}</button>`).join('')
          : p.colores.map((c, i) => `<button class="mini ${i ? '' : 'on'}" data-color="${esc(c.n)}" aria-label="Ver en ${esc(c.n)}">${imagen(p, c.h)}</button>`).join('')}</div>
      </div>
      <div class="ficha">
        ${p.etiqueta ? `<span class="etiqueta">${esc(p.etiqueta)}</span>` : ''}
        <h1>${esc(p.nombre)}</h1>
        <p class="precio-grande">${pesos(p.precio)}</p>
        <p class="desc">${esc(p.desc)}</p>
        <div class="opcion"><span class="opcion-tit">${t.color}: <b id="colorSel">${esc(sel.color)}</b></span>
          <div class="colores">${p.colores.map((c, i) => `<button class="color ${i ? '' : 'on'}" data-color="${esc(c.n)}" style="--c:${c.h}" aria-label="${esc(c.n)}"></button>`).join('')}</div></div>
        <div class="opcion"><span class="opcion-tit">${t.talla}${p.tallas.length > 1 ? ` <button class="link-guia" type="button">Guía de tallas</button>` : ''}</span>
          <div class="tallas">${p.tallas.map(s => `<button class="talla ${sel.talla === s ? 'on' : ''}" data-talla="${s}">${s}</button>`).join('')}</div></div>
        <div class="comprar">
          <div class="cantidad"><button data-cant="-1" aria-label="Menos">−</button><span id="cant">1</span><button data-cant="1" aria-label="Más">+</button></div>
          <button class="btn-agregar">${t.agregar}</button>
        </div>
        <button class="btn-directo">${t.directo}</button>
        <details open><summary>Detalles</summary><ul>${p.detalles.map(d => `<li>${esc(d)}</li>`).join('')}</ul></details>
        <details><summary>Envíos y cambios</summary><p>Envíos a toda Colombia en 2 a 5 días hábiles. Envío gratis desde ${pesos(TIENDA.envioGratisDesde)}. Cambios de talla dentro de los 15 días siguientes.</p></details>
      </div>
    </div>
    ${otros.length ? `<div class="seccion-cab"><h2 class="${p.mundo === 'street' ? 's-h2' : 'm-h2'}">${t.completa}</h2></div><div class="rejilla">${otros.map(tarjeta).join('')}</div>` : ''}
  </section>`;
}

function activarProducto(p) {
  const ponerColor = n => {
    sel.color = n;
    const c = p.colores.find(x => x.n === n);
    if (!p.fotos) $('#galeria').innerHTML = imagen(p, c.h);   // con fotos el color se elige pero la foto no cambia
    $('#colorSel').textContent = n;
    $$('[data-color]').forEach(b => b.classList.toggle('on', b.dataset.color === n));
  };
  $$('[data-color]').forEach(b => b.onclick = () => ponerColor(b.dataset.color));
  $$('[data-foto]').forEach(b => b.onclick = () => { $('#galeria').innerHTML = imagen(p, null, Number(b.dataset.foto)); $$('[data-foto]').forEach(x => x.classList.toggle('on', x === b)); });
  $$('.talla').forEach(b => b.onclick = () => { sel.talla = b.dataset.talla; $$('.talla').forEach(x => x.classList.toggle('on', x === b)); $('.tallas').classList.remove('falta'); });
  $$('[data-cant]').forEach(b => b.onclick = () => { sel.cant = Math.max(1, Math.min(10, sel.cant + Number(b.dataset.cant))); $('#cant').textContent = sel.cant; });
  const guia = $('.link-guia'); if (guia) guia.onclick = () => $('#guia').showModal();
  const conTalla = () => { if (sel.talla) return true; $('.tallas').classList.remove('falta'); void $('.tallas').offsetWidth; $('.tallas').classList.add('falta'); avisar('Elige tu talla'); return false; };
  $('.btn-agregar').onclick = () => { if (!conTalla()) return; agregar(sel); abrirCarrito(); };
  $('.btn-directo').onclick = () => { if (!conTalla()) return; pedirWhatsApp([{ ...sel }]); };
  // En el celular las fotos se pasan deslizando el dedo
  if (p.fotos && p.fotos.length > 1) {
    let x0 = null, i = 0;
    const g0 = $('#galeria');
    g0.insertAdjacentHTML('afterend', `<div class="puntos-galeria">${p.fotos.map((_, k) => `<i class="${k ? '' : 'on'}"></i>`).join('')}</div>`);
    $$('[data-foto]').forEach((b, k) => b.addEventListener('click', () => { i = k; $$('.puntos-galeria i').forEach((d, j) => d.classList.toggle('on', j === k)); }));
    g0.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    g0.addEventListener('touchend', e => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) < 40) return;
      $$('[data-foto]')[(i + (dx < 0 ? 1 : -1) + p.fotos.length) % p.fotos.length].click();
    });
  }
  // Zoom suave siguiendo el mouse
  const g = $('#galeria');
  if (matchMedia('(hover: hover)').matches) g.onmousemove = e => { const r = g.getBoundingClientRect(); g.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%'); g.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%'); g.classList.add('zoom'); };
  g.onmouseleave = () => g.classList.remove('zoom');
}

// ── LOOKBOOK ──
function lookbook(m) {
  return `<section class="seccion lookbook">
    <header class="tienda-cab"><h1 class="${m === 'street' ? 's-h1' : 'm-h1'} rev">${m === 'street' ? 'LOOKBOOK' : 'Lookbook <i>MMXXVI</i>'}</h1>
      <p class="rev">${m === 'street' ? 'Fits del Drop 01' : 'Atuendos de la colección de otoño'}</p></header>
    <div class="looks">${LOOKS[m].map((l, i) => {
      const piezas = l.piezas.map(producto);
      return `<article class="look rev" style="--i:${i}">
        <div class="look-lienzo${l.foto ? ' con-foto' : ''}">${l.foto ? `<img src="${esc(l.foto)}" alt="${esc(l.titulo)}" loading="lazy">` : piezas.map((p, k) => `<div class="look-pieza k${k}">${imagen(p)}</div>`).join('')}</div>
        <div class="look-info"><h3>${esc(l.titulo)}</h3>
          <ul>${piezas.map(p => `<li><a href="#/${m}/p/${p.id}"><span class="look-mini">${imagen(p)}</span>${esc(p.nombre)}</a><span>${pesos(p.precio)}</span></li>`).join('')}</ul>
          <p class="look-total">Total del look <b>${pesos(piezas.reduce((s, p) => s + p.precio, 0))}</b></p></div>
      </article>`;
    }).join('')}</div>
  </section>`;
}

// ── INFORMACIÓN ──
function info(m) {
  return `<section class="seccion info">
    <header class="tienda-cab"><h1 class="${m === 'street' ? 's-h1' : 'm-h1'}">${m === 'street' ? 'INFO' : 'La <i>Casa</i>'}</h1></header>
    <div class="info-grid">
      <div><h3>Sobre nosotros</h3><p>LEGION WEAR es la línea de ropa de Legion Estudio. Dos mundos bajo una misma casa: LGN Street, streetwear pesado de producción limitada, y Legion Maison, prendas atemporales de inspiración clásica.</p></div>
      <div><h3>Cómo comprar</h3><p>Elige tus prendas, talla y color, y envía tu pedido por WhatsApp. Te confirmamos disponibilidad, costo de envío y forma de pago (transferencia, Nequi, Daviplata o contraentrega según tu ciudad).</p></div>
      <div><h3>Envíos</h3><p>A toda Colombia en 2 a 5 días hábiles. Envío gratis en compras desde ${pesos(TIENDA.envioGratisDesde)}.</p></div>
      <div><h3>Cambios y devoluciones</h3><p>Cambios de talla dentro de los 15 días siguientes a la entrega, con la prenda sin uso y con etiquetas.</p></div>
    </div>
  </section>`;
}

function pie() {
  const m = mundoActual();
  $('#pie').innerHTML = `<div class="pie-grid">
    <div class="pie-marca">${m === 'street' ? '<b class="pie-logo">LGN<span>/</span>WEAR</b>' : `${escudo('pie-escudo')}<b class="pie-logo">Legion <i>Maison</i></b>`}
      <p>${m === 'street' ? 'Ropa pesada para gente que no se dobla.' : 'Elegancia atemporal, hecha para durar.'}</p></div>
    <div><h4>Tienda</h4><a href="#/${m}/tienda">${TXT[m].tienda}</a><a href="#/${m}/lookbook">Lookbook</a><a href="#/${m === 'street' ? 'maison' : 'street'}">${m === 'street' ? 'Legion Maison' : 'LGN Street'}</a></div>
    <div><h4>Ayuda</h4><a href="#/${m}/info">Envíos y cambios</a><a href="#/${m}/info">Cómo comprar</a><a href="#" data-wa>WhatsApp</a></div>
    <div><h4>Síguenos</h4><a href="${esc(TIENDA.instagram)}" target="_blank" rel="noopener">Instagram</a><span class="pie-ciudad">${esc(TIENDA.ciudad)}</span></div>
  </div>
  <div class="pie-legal"><span>© 2026 LEGION WEAR · Una extensión de Legion Estudio</span><span>${m === 'street' ? 'NO RESTOCK · NO MERCY' : 'Est. MMXXVI'}</span></div>`;
  $('[data-wa]', $('#pie')).onclick = e => { e.preventDefault(); abrirWhatsApp('Hola LEGION WEAR, quiero más información.'); };
}

// ── CARRITO ──
let carrito = [];
try { carrito = JSON.parse(localStorage.getItem('lw_carrito')) || []; } catch (_) { carrito = []; }
const guardar = () => { localStorage.setItem('lw_carrito', JSON.stringify(carrito)); pintarCarrito(); };

function agregar(s) {
  const ya = carrito.find(x => x.id === s.id && x.color === s.color && x.talla === s.talla);
  if (ya) ya.cant = Math.min(10, ya.cant + s.cant); else carrito.push({ id: s.id, color: s.color, talla: s.talla, cant: s.cant });
  guardar();
  $$('.btn-carrito, .barra-carrito').forEach(b => { b.classList.remove('salta'); void b.offsetWidth; b.classList.add('salta'); });
  avisar(TXT[producto(s.id).mundo].agregado);
}

function pintarCarrito() {
  carrito = carrito.filter(x => producto(x.id));
  const n = carrito.reduce((s, x) => s + x.cant, 0), total = carrito.reduce((s, x) => s + producto(x.id).precio * x.cant, 0);
  $$('.cuenta').forEach(c => c.textContent = n);
  $('.total').textContent = pesos(total);
  $('.btn-pedir').disabled = !n;
  $('.carrito-lista').innerHTML = n ? carrito.map((x, i) => {
    const p = producto(x.id), c = p.colores.find(k => k.n === x.color) || p.colores[0];
    return `<div class="item item-${p.mundo}">
      <div class="item-img">${imagen(p, c.h)}</div>
      <div class="item-info"><span class="item-mundo">${p.mundo === 'street' ? 'LGN Street' : 'Legion Maison'}</span>
        <b>${esc(p.nombre)}</b><span>${esc(x.color)} · Talla ${esc(x.talla)}</span>
        <div class="item-cant"><button data-i="${i}" data-d="-1" aria-label="Menos">−</button><span>${x.cant}</span><button data-i="${i}" data-d="1" aria-label="Más">+</button>
          <button class="quitar" data-q="${i}">Quitar</button></div></div>
      <span class="item-precio">${pesos(p.precio * x.cant)}</span></div>`;
  }).join('') + (total < TIENDA.envioGratisDesde ? `<p class="envio-falta">Te faltan <b>${pesos(TIENDA.envioGratisDesde - total)}</b> para envío gratis</p>` : `<p class="envio-falta ok">Tienes envío gratis</p>`)
    : `<p class="vacio">${TXT[mundoActual()].vacio}</p>`;
  $$('[data-d]').forEach(b => b.onclick = () => { const x = carrito[b.dataset.i]; x.cant += Number(b.dataset.d); if (x.cant < 1) carrito.splice(b.dataset.i, 1); else x.cant = Math.min(10, x.cant); guardar(); });
  $$('[data-q]').forEach(b => b.onclick = () => { carrito.splice(b.dataset.q, 1); guardar(); });
}

function abrirCarrito() { $('.aviso').classList.remove('on'); clearTimeout(avisoT); $('.carrito').classList.add('abierto'); $('.carrito').setAttribute('aria-hidden', 'false'); $('.velo').hidden = false; requestAnimationFrame(() => $('.velo').classList.add('on')); }
function cerrarCarrito() { $('.carrito').classList.remove('abierto'); $('.carrito').setAttribute('aria-hidden', 'true'); $('.velo').classList.remove('on'); setTimeout(() => $('.velo').hidden = true, 300); }
$('.btn-carrito').onclick = abrirCarrito;
$('.barra-carrito').onclick = abrirCarrito;
$('.carrito .cerrar').onclick = cerrarCarrito;
$('.velo').onclick = cerrarCarrito;
document.addEventListener('keydown', e => { if (e.key === 'Escape') cerrarCarrito(); });
$('.btn-pedir').onclick = () => pedirWhatsApp(carrito);

// ── WHATSAPP ──
function abrirWhatsApp(texto) {
  window.open(`https://wa.me/${TIENDA.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank', 'noopener');
}
function pedirWhatsApp(items) {
  if (!items.length) return;
  let total = 0;
  const lineas = items.map((x, i) => {
    const p = producto(x.id), sub = p.precio * x.cant; total += sub;
    return `${i + 1}. ${p.nombre} (${p.mundo === 'street' ? 'Street' : 'Maison'})\n   ${x.color} · Talla ${x.talla} · x${x.cant} — ${pesos(sub)}`;
  });
  abrirWhatsApp(`Hola LEGION WEAR, quiero hacer este pedido:\n\n${lineas.join('\n')}\n\nSubtotal: ${pesos(total)}${total >= TIENDA.envioGratisDesde ? ' (envío gratis)' : ''}\n\nNombre:\nCiudad y dirección:\nForma de pago:`);
}

// ── AVISO ──
let avisoT;
function avisar(t) { const a = $('.aviso'); a.textContent = t; a.classList.add('on'); clearTimeout(avisoT); avisoT = setTimeout(() => a.classList.remove('on'), 2200); }

// ── CUENTA REGRESIVA ── siguiente viernes a las 8 p. m.
function proximoDrop() { const ahora = new Date(), d = new Date(); d.setHours(20, 0, 0, 0); while (d.getDay() !== 5 || d <= ahora) d.setDate(d.getDate() + 1); return d; }
setInterval(() => {
  if (!$('[data-cr]')) return;
  let s = Math.max(0, Math.floor((proximoDrop() - new Date()) / 1000));
  const v = { d: Math.floor(s / 86400), h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
  $$('[data-cr]').forEach(b => b.textContent = String(v[b.dataset.cr]).padStart(2, '0'));
}, 1000);

// ── ANIMACIONES AL ENTRAR EN PANTALLA ──
const obs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }), { threshold: 0.12 });

// ── CAMBIO DE MUNDO ── telón: negro que se rompe en STREET, cortina marfil con escudo en MAISON
let cambiando = false;
function cambiarMundo(nuevo, alTerminar) {
  if (cambiando) return;
  cambiando = true;
  const t = $('.telon');
  $('.telon-sello').innerHTML = nuevo === 'maison' ? escudo() + '<span>Legion Maison</span>' : '<b>LGN</b><span>STREET</span>';
  t.className = 'telon a-' + nuevo + ' cubre';
  setTimeout(() => {
    html.dataset.mundo = nuevo;
    $('meta[name="theme-color"]').content = nuevo === 'maison' ? '#f4efe4' : '#0a0a0a';
    alTerminar();
    t.classList.replace('cubre', 'abre');
  }, nuevo === 'maison' ? 1100 : 750);
  setTimeout(() => { t.className = 'telon'; cambiando = false; }, nuevo === 'maison' ? 2200 : 1400);
}

// ── ENRUTADOR ──
function ruta() {
  const [camino, qs] = (location.hash.slice(2) || 'street').split('?');
  const partes = camino.split('/'), m = partes[0] === 'maison' ? 'maison' : 'street', q = new URLSearchParams(qs || '');
  const pintar = () => {
    let p;
    if (partes[1] === 'tienda') vista.innerHTML = tienda(m, q);
    else if (partes[1] === 'p' && (p = producto(partes[2])) && p.mundo === m) { vista.innerHTML = paginaProducto(p); activarProducto(p); }
    else if (partes[1] === 'lookbook') vista.innerHTML = lookbook(m);
    else if (partes[1] === 'info') vista.innerHTML = info(m);
    else vista.innerHTML = m === 'street' ? inicioStreet() : inicioMaison();
    $$('.pestana').forEach(b => b.classList.toggle('on', b.dataset.mundo === m));
    const sec = ['tienda', 'lookbook'].includes(partes[1]) ? partes[1] : partes[1] === 'p' ? 'tienda' : 'inicio';
    $$('[data-sec]').forEach(a => a.classList.toggle('on', a.dataset.sec === sec));
    $$('[data-ir]').forEach(a => a.href = `#/${m}${a.dataset.ir === 'inicio' ? '' : '/' + a.dataset.ir}`);
    document.title = (m === 'street' ? 'LGN STREET' : 'LEGION MAISON') + ' — LEGION WEAR';
    pie(); pintarCarrito();
    window.scrollTo(0, 0);
    $$('.rev').forEach(el => obs.observe(el));
  };
  if (m !== mundoActual() && vista.innerHTML) cambiarMundo(m, pintar);
  else { html.dataset.mundo = m; pintar(); }
}
$$('.pestana').forEach(b => b.onclick = () => { if (b.dataset.mundo !== mundoActual()) location.hash = '#/' + b.dataset.mundo; });
window.addEventListener('hashchange', ruta);

// ── CURSOR DE MAISON ── un aro fino que sigue al mouse con retraso
(() => {
  const c = $('.cursor'); let x = 0, y = 0, cx = 0, cy = 0;
  if (matchMedia('(pointer: coarse)').matches) return;
  c.style.opacity = 0;
  addEventListener('mousemove', e => { x = e.clientX; y = e.clientY; c.style.opacity = 1; c.classList.toggle('sobre', !!e.target.closest('a, button, select, summary')); });
  (function mover() { cx += (x - cx) * 0.16; cy += (y - cy) * 0.16; c.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(mover); })();
})();

ruta();
