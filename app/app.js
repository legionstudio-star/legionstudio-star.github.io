/* Plantilla de página por negocio — LEGION Studio Digital
   El negocio sale del enlace (legionestudio.com/<slug>/) y sus datos se leen de Supabase (datos/config.js). */
(async function () {
  const raiz = document.getElementById("app");
  window.SLUG = window.SLUG || decodeURIComponent(location.pathname.split("/").filter(Boolean)[0] || "").toLowerCase();
  let N = null;
  try { N = await window.LEGION.negocio(window.SLUG); }
  catch (e) {
    raiz.innerHTML = `<div class="cargando"><p>No hay conexión. <a href="" style="text-decoration:underline">Toca para reintentar</a></p></div>`;
    return;
  }

  // Hablador genérico (h001, h002…) que aún no se ha vendido: página de demostración de LEGION
  if (!N && /^h\d{3}$/.test(window.SLUG)) {
    const cod = window.SLUG.toUpperCase();
    const wa = "https://wa.me/573234953988?text=" + encodeURIComponent(`Hola LEGION, quiero activar el hablador ${cod} para mi negocio`);
    const item = (t, d) => `<li style="display:flex;gap:12px;align-items:flex-start;text-align:left"><span style="flex:none;width:26px;height:26px;border-radius:50%;background:#F5B942;color:#111;display:grid;place-items:center;font-weight:800;font-size:.8rem">✓</span><span><b style="display:block">${t}</b><span style="color:rgba(255,255,255,.62);font-size:.9rem">${d}</span></span></li>`;
    document.title = `Hablador ${cod} · LEGION Studio`;
    document.body.style.background = "#0A0A0C";
    raiz.innerHTML = `
      <main style="min-height:100svh;color:#fff;padding:40px 22px 48px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:22px;max-width:460px;margin:0 auto;
        background:radial-gradient(120% 45% at 50% -10%, rgba(245,185,66,.35), transparent 65%)">
        <img src="/marca/logo-legion.png" alt="LEGION Studio" style="width:64px;height:64px;object-fit:contain;border-radius:16px;background:#111">
        <span style="font-size:.72rem;font-weight:800;letter-spacing:.24em;color:#F5B942;border:1.5px solid rgba(245,185,66,.55);border-radius:999px;padding:6px 14px">HABLADOR ${cod} · POR ACTIVAR</span>
        <h1 style="font-size:2.3rem;line-height:1;letter-spacing:-.03em;font-weight:800">Así de fácil te<br><span style="color:#F5B942">califican tus clientes</span></h1>
        <p style="color:rgba(255,255,255,.7);line-height:1.5">Este hablador todavía no tiene dueño. Cuando lo actives, este mismo código llevará a tus clientes directo a tu negocio.</p>
        <ul style="list-style:none;display:grid;gap:14px;width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:18px;padding:18px">
          ${item("Más reseñas en Google", "Tus clientes te califican en un toque, sin descargar nada.")}
          ${item("Tu menú con fotos y precios", "Siempre al día, lo cambiamos cuando quieras.")}
          ${item("Pedidos directo a tu WhatsApp", "Domicilio, para recoger o a la mesa. Sin comisiones.")}
          ${item("Con tu logo y tus colores", "Si quieres, te cambiamos el diseño del acrílico.")}
        </ul>
        <a href="${wa}" style="display:block;width:100%;background:#25D366;color:#0A0A0C;font-weight:800;padding:16px;border-radius:999px;text-decoration:none">Activar por WhatsApp</a>
        <small style="color:rgba(255,255,255,.45)">Tecnología LEGION Studio Digital</small>
      </main>`;
    return;
  }

  if (!N) {
    document.title = "Página no encontrada";
    raiz.innerHTML = `<div class="cargando"><p style="text-align:center;padding:24px">Este enlace no existe o ya no está activo.<br><a href="/" style="text-decoration:underline">Ir a LEGION Studio</a></p></div>`;
    return;
  }
  document.title = N.nombre;

  // Portafolio de Legionario (chip NFC de la tarjeta)
  if (N.tipo === "legionario") {
    await new Promise((ok, mal) => { const s = document.createElement("script"); s.src = "/app/legionario.js?v=2"; s.onload = ok; s.onerror = mal; document.head.appendChild(s); });
    return window.LEGION_LEGIONARIO(N, raiz);
  }

  // Carpeta Vial Flotas: tarjeta de un bus de empresa
  if (N.tipo === "flota_bus") {
    await new Promise((ok, mal) => { const s = document.createElement("script"); s.src = "/app/flota.js?v=2"; s.onload = ok; s.onerror = mal; document.head.appendChild(s); });
    return window.LEGION_FLOTA(N, raiz);
  }

  // Tarjeta de vehículo (Carpeta Vial): página aparte
  if (N.tipo === "vehiculo" || N.tipo === "vial_entrada") {
    await new Promise((ok, mal) => { const s = document.createElement("script"); s.src = "/app/vehiculo.js?v=6"; s.onload = ok; s.onerror = mal; document.head.appendChild(s); });
    return window.LEGION_VEHICULO(N, raiz);
  }

  // Tarjeta NFC/QR de una mesa: legionestudio.com/<slug>/?mesa=7
  const MESA = (new URLSearchParams(location.search).get("mesa") || "").replace(/\D/g, "").slice(0, 3).replace(/^0+/, "");
  const MESERO = N.mesero && N.mesero.activo && MESA ? N.mesero : null;

  // Plan básico: directo a dejar la reseña (salvo que la tarjeta sea de una mesa con mesero virtual)
  if (N.plan === "basico" && !MESERO) {
    raiz.innerHTML = `<div class="cargando"><p>Abriendo reseñas de ${N.nombre}… <a href="${N.resenas}" style="text-decoration:underline">toca aquí si no abre</a></p></div>`;
    location.replace(N.resenas);
    return;
  }

  /* ---------- Iconos ---------- */
  const SVG = {
    estrella: '<path fill="currentColor" stroke="none" d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17l-5.6 3 1.1-6.2L2.9 9.4l6.3-.9L12 2.8Z"/>',
    wa: '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/>',
    menu: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15Z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 12h5"/>',
    moto: '<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M8.5 17h6l3-7h-4M5.5 14l3-5h4l2 8M15 6h2.5l1 4"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    wifi: '<path d="M2 8.5a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0M8.5 15.5a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/>',
    tel: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    ig: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.5"/>',
    fb: '<path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v4H8v7h4v-7h3l.5-4H12V7.8c0-.5.4-.8.8-.8H15V3Z"/>',
    web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3Z"/>',
    regalo: '<rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8C10 4 6.5 4.5 7 7c.3 1.3 2.5 1 5 1Zm0 0c2-4 5.5-3.5 5-1-.3 1.3-2.5 1-5 1Z"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    abajo: '<path d="m6 9 6 6 6-6"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    atras: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    plato: '<circle cx="12" cy="13" r="7"/><circle cx="12" cy="13" r="3.5"/><path d="M3 4v5a2 2 0 0 0 2 2M5 4v16M21 4c-1.5 1-2 3-2 5s1 2 2 2v9"/>',
    bolsa: '<path d="M5 8h14l-1 13H6L5 8Z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
    campana: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16Z"/><path d="M10 20.5a2 2 0 0 0 4 0M12 3v2"/>',
    recibo: '<path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    mas: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    ok: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    tijera: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.6 7.6 20 18M8.6 16.4 20 6"/>',
    gota: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    carro: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3zM7 11h10"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
    corona: '<path d="m3 8 4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8Z"/>',
    tienda: '<path d="M4 9h16l-1-5H5L4 9Z"/><path d="M5 9v11h14V9M9 20v-6h6v6"/>',
    hoja: '<path d="M5 19c0-8 5-14 15-15-1 10-7 15-15 15Z"/><path d="M5 19 13 11"/>',
    cubo: '<path d="M12 2 3 7l9 5 9-5-9-5Z"/><path d="m3 17 9 5 9-5M3 12l9 5 9-5"/>',
    copiar: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>'
  };
  const ic = (n, cls = "icon") => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[n]}</svg>`;

  /* ---------- Utilidades ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pesos = (v) => "$ " + Math.round(v).toLocaleString("es-CO");
  const wa = (msg) => `https://wa.me/${N.whatsapp}?text=${encodeURIComponent(msg)}`;
  const hora = (h) => {
    h = ((h % 24) + 24) % 24;
    const hh = Math.floor(h), mm = Math.round((h - hh) * 60);
    return `${hh % 12 === 0 ? 12 : hh % 12}:${String(mm).padStart(2, "0")} ${hh < 12 ? "a. m." : "p. m."}`;
  };
  const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const iniciales = (n) => n.replace(/^(Asadero|Heladería|Restaurante|Bar|Panadería|Café|Cafetería)\s+/i, "").split(/\s+/).filter((p) => p.length > 2).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || n[0];

  document.documentElement.style.setProperty("--c", N.color || "#E8590C");
  if (N.tema === "oscuro") document.body.classList.add("oscuro");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = N.tema === "oscuro" ? "#0F0F10" : N.color;
  const fav = document.querySelector('link[rel="icon"]');
  if (fav) fav.href = N.logo || "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="${N.color || "#E8590C"}"/><text x="24" y="32" font-family="Arial" font-weight="700" font-size="22" fill="#fff" text-anchor="middle">${iniciales(N.nombre).slice(0, 1)}</text></svg>`);

  /* ---------- Abierto / cerrado ---------- */
  function estado() {
    const H = N.horario; if (!H) return null;
    const ahora = new Date(), d = ahora.getDay(), t = ahora.getHours() + ahora.getMinutes() / 60;
    const hoy = H[d], ayer = H[(d + 6) % 7];
    if (ayer && ayer[1] > 24 && t < ayer[1] - 24) return { abierto: true, txt: `Abierto ahora · cierra a las ${hora(ayer[1])}` };
    if (hoy && t >= hoy[0] && t < hoy[1]) return { abierto: true, txt: `Abierto ahora · cierra a las ${hora(hoy[1])}` };
    if (hoy && t < hoy[0]) return { abierto: false, txt: `Cerrado · abre hoy a las ${hora(hoy[0])}` };
    for (let i = 1; i <= 7; i++) {
      const h = H[(d + i) % 7];
      if (h) return { abierto: false, txt: `Cerrado · abre ${i === 1 ? "mañana" : "el " + DIAS[(d + i) % 7].toLowerCase()} a las ${hora(h[0])}` };
    }
    return { abierto: false, txt: "Cerrado" };
  }

  /* ---------- Botones ---------- */
  const tieneMenu = N.menu && N.menu.categorias && N.menu.categorias.length;
  const BOTONES = {
    menu: () => tieneMenu && { i: "menu", t: "Ver menú", s: "Platos y precios", accion: "menu" },
    domicilio: () => ({ i: "moto", t: "Domicilios", s: N.menu && N.menu.carrito ? "Arma tu pedido" : "Pide por WhatsApp",
      accion: N.menu && N.menu.carrito ? "menu" : null, href: wa(`Hola ${N.nombre}, quiero hacer un pedido a domicilio.`) }),
    reservar: () => ({ i: "calendario", t: "Reservar", s: "Aparta tu mesa", href: wa(`Hola ${N.nombre}, quiero reservar una mesa. Día: __ · Hora: __ · Personas: __`) }),
    ubicacion: () => N.mapa && { i: "pin", t: "Cómo llegar", s: "Abrir en el mapa", href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(N.mapa)}` },
    wifi: () => N.wifi && { i: "wifi", t: "Clave del wifi", s: N.wifi.red, accion: "wifi" },
    llamar: () => N.telefono && { i: "tel", t: "Llamar", s: "Atención directa", href: `tel:+${N.telefono}` },
    instagram: () => N.instagram && { i: "ig", t: "Instagram", s: "@" + N.instagram, href: `https://instagram.com/${N.instagram}` },
    tiktok: () => N.tiktok && { i: "tiktok", t: "TikTok", s: "@" + N.tiktok, href: `https://www.tiktok.com/@${N.tiktok}` },
    facebook: () => N.facebook && { i: "fb", t: "Facebook", s: "Síguenos", href: N.facebook },
    web: () => N.web && { i: "web", t: "Sitio web", s: N.web.replace(/^https?:\/\//, ""), href: N.web }
  };
  BOTONES.mesero = () => N.mesero && N.mesero.activo && !MESERO && { i: "campana", t: "Mesero virtual", s: "Llama al mesero desde tu mesa", accion: "mesa" };
  const lista = [...(N.mesero && N.mesero.activo && !(N.botones || []).includes("mesero") ? ["mesero"] : []), ...(N.botones || [])].map((k) => BOTONES[k] && BOTONES[k]()).filter(Boolean);
  // Botones personalizados (nombre, ícono y enlace) que se agregan en el panel
  (N.extras || []).forEach((b) => b && b.t && b.url && lista.push({ i: SVG[b.i] ? b.i : "flecha", t: b.t, s: b.s || "", href: b.url, destacado: !!b.destacado }));
  // Los botones destacados y el mesero van primero y a lo ancho
  lista.sort((a, b) => (b.destacado || b.accion === "mesa" ? 1 : 0) - (a.destacado || a.accion === "mesa" ? 1 : 0));
  const boton = (b, ancho, fuerte) => {
    const inner = `<span class="ic">${ic(b.i)}</span><div><strong>${esc(b.t)}</strong><small>${esc(b.s || "")}</small></div>`;
    const cls = `boton${ancho ? " ancho" : ""}${fuerte ? " fuerte" : ""}`;
    return b.accion
      ? `<button type="button" class="${cls}" data-accion="${b.accion}">${inner}</button>`
      : `<a class="${cls}" href="${b.href}" target="_blank" rel="noopener">${inner}</a>`;
  };

  /* ---------- Página principal ---------- */
  const est = estado();
  const d = new Date().getDay();
  const orden = [1, 2, 3, 4, 5, 6, 0];
  raiz.innerHTML = `
    <div class="pagina">
      ${N.video ? `
      <header class="hero-v">
        <video id="hero-video" autoplay muted loop playsinline preload="auto" poster="${N.video.poster || N.portada || ""}"></video>
        <div class="hv-top">
          <div class="hv-logo">${N.logo ? `<img src="${N.logo}" alt="Logo de ${esc(N.nombre)}">` : esc(iniciales(N.nombre))}</div>
          ${est ? `<span class="estado ${est.abierto ? "abierto" : "cerrado"}"><i></i>${est.txt}</span>` : ""}
        </div>
        <div class="hv-txt">
          <span class="hv-ceja"><i></i>${esc(N.categoria || "")}</span>
          <h1>${esc(N.nombre)}</h1>
          ${N.eslogan ? `<p>${esc(N.eslogan)}</p>` : ""}
        </div>
        <nav class="hv-acc">
          ${tieneMenu ? `<button type="button" class="hv-b dest" data-accion="menu">${ic(N.menu.vista === "3d" ? "cubo" : "menu")}<span><b>${N.menu.vista === "3d" ? "Carta 3D" : "Ver menú"}</b><small>${N.menu.vista === "3d" ? "Desliza y mira cada bebida" : "Fotos, precios y pedido"}</small></span>${ic("flecha", "icon fl")}</button>` : ""}
          <a class="hv-b" href="${N.google ? "#google" : N.resenas}" ${N.google ? "" : 'target="_blank" rel="noopener"'}>${ic("estrella")}<span><b>Reseñas</b><small>${N.google ? String((+N.google.nota).toFixed(1)).replace(".", ",") + " en Google" : "Califícanos"}</small></span></a>
          ${N.premio ? `<button type="button" class="hv-b" data-accion="premio">${ic("regalo")}<span><b>Premio</b><small>Gira y gana</small></span></button>` : N.mapa ? `<a class="hv-b" href="#google">${ic("pin")}<span><b>Ubicación</b><small>Cómo llegar</small></span></a>` : ""}
          <a class="hv-b wa" href="${wa(`Hola ${N.nombre}, vengo de su página.`)}" target="_blank" rel="noopener">${ic("wa")}<span><b>WhatsApp</b><small>Escríbenos</small></span></a>
        </nav>
      </header>` : `
      <div class="portada">${N.portada ? `<img src="${N.portada}" alt="">` : ""}</div>`}
      <section class="perfil${N.video ? " oculto" : ""}">
        <div class="logo">${N.logo ? `<img src="${N.logo}" alt="Logo de ${esc(N.nombre)}">` : esc(iniciales(N.nombre))}</div>
        <h1>${esc(N.nombre)}</h1>
        <p class="cat">${esc(N.categoria || "")}</p>
        ${N.eslogan ? `<p class="eslogan">${esc(N.eslogan)}</p>` : ""}
        ${est ? `<span class="estado ${est.abierto ? "abierto" : "cerrado"}">${est.txt}</span>` : ""}
      </section>

      ${MESERO ? `
      <section class="bloque mesero" aria-label="Mesero virtual">
        <div class="ms-cab">
          <div><small>Estás en la</small><b>Mesa ${esc(MESA)}</b></div>
          <span class="ms-vivo"><i></i> Mesero virtual</span>
        </div>
        <div class="ms-grid">
          <button type="button" class="ms-b fuerte" data-mesero="llamar">${ic("campana")}<strong>Llamar al mesero</strong><small>Viene a tu mesa</small></button>
          <button type="button" class="ms-b" data-mesero="cuenta">${ic("recibo")}<strong>Pedir la cuenta</strong><small>Elige cómo pagas</small></button>
          ${tieneMenu ? `<button type="button" class="ms-b" data-accion="menu">${ic("menu")}<strong>${N.menu.carrito ? "Pedir desde aquí" : "Ver la carta"}</strong><small>${N.menu.carrito ? "Llega a tu mesa" : "Platos y precios"}</small></button>` : ""}
          <button type="button" class="ms-b" data-mesero="extra">${ic("mas")}<strong>Necesito algo</strong><small>Servilletas, salsas…</small></button>
        </div>
        <p class="ms-estado" id="ms-estado" hidden></p>
      </section>` : ""}

      <div class="bloque">
        <a class="resena" href="${N.resenas}" target="_blank" rel="noopener">
          <div>
            <div class="estrellas">${ic("estrella").repeat(5)}</div>
            <strong>Califícanos en Google</strong>
            <small>Tu opinión nos ayuda a crecer. ¡Gracias!</small>
          </div>
          <span class="flecha">${ic("flecha")}</span>
        </a>
      </div>

      ${N.premio ? `
      <div class="bloque"><button type="button" class="premio-b" data-accion="premio">
        <span class="pr-mini" aria-hidden="true"></span>
        <div><small>${esc(N.premio.ceja || "Premio de la casa")}</small><strong>${esc(N.premio.titulo || "Gira la ruleta y gana")}</strong><span>${esc(N.premio.texto || "Un giro por visita. Muéstrale el premio a tu mesero.")}</span></div>
        <span class="flecha">${ic("flecha")}</span>
      </button></div>` : ""}

      ${N.google ? (() => { const g = N.google, nota = +g.nota || 5;
        const est5 = (v) => `<span class="gm-est" style="--v:${(v / 5) * 100}%"><i>★★★★★</i><i>★★★★★</i></span>`;
        return `
      <section class="bloque gmaps" id="google" aria-label="Google Maps">
        <div class="gm-cab">
          <span class="gm-g" aria-hidden="true"><svg viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg></span>
          <div><b>${esc(N.nombre)}</b><small>Así nos califican en Google Maps</small></div>
          ${g.ejemplo ? `<span class="gm-ej">Ejemplo</span>` : ""}
        </div>
        <div class="gm-nota"><strong>${String(nota.toFixed(1)).replace(".", ",")}</strong><div>${est5(nota)}<small>${(+g.total || 0).toLocaleString("es-CO")} reseñas</small></div>
          <a class="gm-esc" href="${N.resenas}" target="_blank" rel="noopener">${ic("estrella")} Calificar</a></div>
        ${(g.opiniones || []).length ? `<div class="gm-ops">${g.opiniones.map((o) => `
          <article class="gm-op"><div class="gm-op-cab"><span class="gm-av" style="background:${o.c || "var(--c)"}">${esc((o.n || "?")[0])}</span><div><b>${esc(o.n)}</b><small>${esc(o.h || "")}</small></div></div>
            ${est5(o.e || 5)}<p>${esc(o.t)}</p></article>`).join("")}</div>` : ""}
        ${N.mapa ? `<div class="gm-mapa"><iframe title="Mapa de ${esc(N.nombre)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${encodeURIComponent(N.mapa)}&z=16&output=embed"></iframe>
          <a class="gm-ir" href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(N.mapa)}" target="_blank" rel="noopener">${ic("pin")} Cómo llegar</a></div>` : ""}
      </section>`; })() : ""}

      ${(N.pagos || []).length ? `
      <section class="bloque pagos" aria-label="Medios de pago">
        <h2 class="pg-tit">${ic("recibo")} Medios de pago</h2>
        ${N.pagos.map((m) => `
        <div class="pg-item">
          <span class="pg-logo" style="background:${m.c || "var(--c)"}">${esc((m.t || "?")[0])}</span>
          <div><b>${esc(m.t)}</b><span>${esc(String(m.v).replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3"))}</span>${m.a ? `<small>${esc(m.a)}</small>` : ""}</div>
          <button type="button" class="pg-copiar" data-copiar="${esc(m.v)}">${ic("copiar")} Copiar</button>
        </div>`).join("")}
        <p class="pg-nota">${esc(N.pagosNota || "Envía el comprobante por WhatsApp junto con tu pedido.")}</p>
      </section>` : ""}

      ${N.promo ? `<div class="bloque"><div class="promo">${ic("regalo")}<div><strong>${esc(N.promo.titulo)}</strong><span>${esc(N.promo.texto)}</span></div></div></div>` : ""}

      ${lista.length ? `<div class="bloque botones">${(() => { const anchos = lista.filter((b) => b.destacado || b.accion === "mesa").length, resto = lista.length - anchos;
        return lista.map((b, i) => boton(b, i < anchos || (resto % 2 === 1 && i === lista.length - 1), b.destacado || b.accion === "mesa")).join(""); })()}</div>` : ""}

      ${N.horario || N.direccion ? `
      <div class="bloque info">
        ${N.horario ? `<details><summary>${ic("reloj")} Horario ${ic("abajo", "icon mas")}</summary><div class="cont"><ul class="horario">
          ${orden.map((i) => `<li class="${i === d ? "hoy" : ""}"><span>${DIAS[i]}</span><span>${N.horario[i] ? `${hora(N.horario[i][0])} – ${hora(N.horario[i][1])}` : "Cerrado"}</span></li>`).join("")}
        </ul></div></details>` : ""}
        ${N.direccion ? `<details><summary>${ic("pin")} Dirección ${ic("abajo", "icon mas")}</summary><div class="cont">${esc(N.direccion)}</div></details>` : ""}
      </div>` : ""}

      <p class="pie">Hecho por <b>LEGION Studio Digital</b></p>
    </div>
    ${N.wifi ? `
    <div class="modal" id="m-wifi" role="dialog" aria-modal="true" aria-label="Clave del wifi">
      <div class="modal-caja">
        <div class="ic">${ic("wifi")}</div>
        <h3>Conéctate a nuestro wifi</h3>
        <div class="dato-wifi"><small>Red</small><b>${esc(N.wifi.red)}</b></div>
        <div class="dato-wifi"><small>Clave</small><b>${esc(N.wifi.clave)}</b></div>
        <button type="button" class="copiar" id="copiar-wifi">Copiar clave</button>
        <button type="button" class="cerrar-m" data-cerrar>Cerrar</button>
      </div>
    </div>` : ""}
    ${N.mesero && N.mesero.activo && !MESERO ? `
    <div class="modal" id="m-mesa" role="dialog" aria-modal="true" aria-label="¿En qué mesa estás?">
      <div class="modal-caja">
        <div class="ic">${ic("campana")}</div>
        <h3>¿En qué mesa estás?</h3>
        <p class="ms-p">Mira el número en tu mesa.</p>
        <div class="mesas-grid">${Array.from({ length: Math.min(60, N.mesero.mesas || 12) }, (_, i) => `<a href="?mesa=${i + 1}">${i + 1}</a>`).join("")}</div>
        <button type="button" class="cerrar-m" data-cerrar>Cancelar</button>
      </div>
    </div>` : ""}
    ${N.premio ? `
    <div class="modal" id="m-premio" role="dialog" aria-modal="true" aria-label="Ruleta de premios">
      <div class="modal-caja pr-caja" id="pr-caja"></div>
    </div>` : ""}
    ${MESERO ? `
    <div class="modal" id="m-mesero" role="dialog" aria-modal="true" aria-label="Mesero virtual">
      <div class="modal-caja" id="ms-caja"></div>
    </div>` : ""}`;

  /* ---------- Mesero virtual ---------- */
  // Avisa al mesero: a la pantalla de meseros (Supabase) o por WhatsApp, según lo que se configuró en el panel
  async function avisarMesero(tipo, detalle) {
    const NOMBRES = { llamar: "Llamar al mesero", cuenta: "Pedir la cuenta", extra: "Necesito algo", pedido: "Pedido nuevo" };
    if (MESERO.aviso === "whatsapp") {
      window.open(wa(`MESA ${MESA} · ${NOMBRES[tipo]}${detalle ? "\n" + detalle : ""}`), "_blank", "noopener");
      return true;
    }
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/mesero_llamar`, {
      method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ p_slug: window.SLUG, p_mesa: MESA, p_tipo: tipo, p_detalle: detalle || "" })
    });
    if (!r.ok) throw new Error("No se pudo avisar. Intenta otra vez o llama al mesero.");
    return true;
  }
  if (MESERO) {
    const mMes = $("#m-mesero"), caja = $("#ms-caja");
    mMes.addEventListener("click", (e) => { if (e.target === mMes || e.target.closest("[data-cerrar]")) mMes.classList.remove("abierta"); });
    const EXTRAS = MESERO.extras && MESERO.extras.length ? MESERO.extras : ["Servilletas", "Salsas", "Cubiertos", "Hielo", "Limpiar la mesa"];
    const PAGOS = MESERO.pagos && MESERO.pagos.length ? MESERO.pagos : ["Efectivo", "Tarjeta", "Nequi", "Daviplata"];
    const chips = (lista, multi) => `<div class="ms-chips">${lista.map((t) => `<label><input type="${multi ? "checkbox" : "radio"}" name="ms-op" value="${esc(t)}"><span>${esc(t)}</span></label>`).join("")}</div>`;
    const PANTALLAS = {
      llamar: () => `<div class="ic">${ic("campana")}</div><h3>¿Llamamos al mesero?</h3><p class="ms-p">Le llega el aviso de la mesa ${esc(MESA)} al instante.</p>`,
      cuenta: () => `<div class="ic">${ic("recibo")}</div><h3>Pedir la cuenta</h3><p class="ms-p">¿Cómo vas a pagar?</p>${chips(PAGOS)}`,
      extra: () => `<div class="ic">${ic("mas")}</div><h3>¿Qué necesitas?</h3><p class="ms-p">Marca lo que quieras.</p>${chips(EXTRAS, true)}<input class="campo" id="ms-otro" placeholder="Otra cosa…" style="margin-top:10px">`
    };
    let tipoAct = null, reloj = null;
    function abrir(tipo) {
      tipoAct = tipo;
      caja.innerHTML = PANTALLAS[tipo]() + `<p class="error" id="ms-err"></p><button type="button" class="copiar" id="ms-enviar">${MESERO.aviso === "whatsapp" ? "Enviar por WhatsApp" : "Avisar al mesero"}</button><button type="button" class="cerrar-m" data-cerrar>Cancelar</button>`;
      mMes.classList.add("abierta");
      $("#ms-enviar").addEventListener("click", enviar);
    }
    async function enviar() {
      const marcadas = [...caja.querySelectorAll("[name=ms-op]:checked")].map((i) => i.value);
      const otro = $("#ms-otro") ? $("#ms-otro").value.trim() : "";
      if (otro) marcadas.push(otro);
      if (tipoAct === "cuenta" && !marcadas.length) return ($("#ms-err").textContent = "Elige cómo vas a pagar.");
      if (tipoAct === "extra" && !marcadas.length) return ($("#ms-err").textContent = "Marca o escribe lo que necesitas.");
      const b = $("#ms-enviar"); b.disabled = true; b.textContent = "Avisando…";
      try {
        await avisarMesero(tipoAct, tipoAct === "cuenta" ? "Paga con: " + marcadas[0] : marcadas.join(", "));
        caja.innerHTML = `<div class="ic ok">${ic("ok")}</div><h3>¡Listo!</h3><p class="ms-p">${tipoAct === "cuenta" ? "Ya te traen la cuenta." : "Tu mesero ya viene a la mesa " + esc(MESA) + "."}</p><button type="button" class="copiar" data-cerrar>Entendido</button>`;
        const e = $("#ms-estado"), t0 = Date.now();
        const txt = { llamar: "Llamaste al mesero", cuenta: "Pediste la cuenta", extra: "Pediste: " + marcadas.join(", ") }[tipoAct];
        const pinta = () => { const sg = Math.round((Date.now() - t0) / 1000); e.innerHTML = `${ic("ok")} ${esc(txt)} · hace ${sg < 60 ? sg + " s" : Math.round(sg / 60) + " min"}`; };
        e.hidden = false; pinta(); clearInterval(reloj); reloj = setInterval(pinta, 5000);
      } catch (err) { b.disabled = false; b.textContent = "Intentar otra vez"; $("#ms-err").textContent = err.message; }
    }
    document.addEventListener("click", (e) => { const b = e.target.closest("[data-mesero]"); if (b) abrir(b.dataset.mesero); });
  }

  const mMesa = $("#m-mesa");
  if (mMesa) mMesa.addEventListener("click", (e) => { if (e.target === mMesa || e.target.closest("[data-cerrar]")) mMesa.classList.remove("abierta"); });

  /* ---------- Wifi ---------- */
  const mWifi = $("#m-wifi");
  if (mWifi) {
    mWifi.addEventListener("click", (e) => { if (e.target === mWifi || e.target.closest("[data-cerrar]")) mWifi.classList.remove("abierta"); });
    $("#copiar-wifi").addEventListener("click", (e) => {
      const b = e.currentTarget;
      const ok = () => { b.textContent = "Clave copiada"; setTimeout(() => (b.textContent = "Copiar clave"), 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(N.wifi.clave).then(ok, () => {});
    });
  }

  /* ---------- Video del banner: vertical en celular, horizontal en pantallas anchas ---------- */
  const hv = $("#hero-video");
  if (hv) {
    const ancho = matchMedia("(min-width: 760px)").matches && N.video.pc;
    hv.src = ancho ? N.video.pc : N.video.movil || N.video.pc;
    hv.play().catch(() => {});
  }

  /* ---------- Ruleta de premios (un giro por día en este celular; NO depende de dejar reseña: Google lo prohíbe) ---------- */
  const mPremio = $("#m-premio");
  if (mPremio) {
    const P = N.premio, premios = (P.premios || []).filter(Boolean), n = premios.length;
    const COL = ["var(--c)", "#1C1C20"], hoyTxt = new Date().toISOString().slice(0, 10), clave = "premio_" + window.SLUG;
    let guardado = null; try { guardado = JSON.parse(localStorage.getItem(clave) || "null"); } catch (e) {}
    if (guardado && (guardado.dia !== hoyTxt || !premios[guardado.idx])) guardado = null;
    const seg = 360 / n;
    const rueda = `<svg class="pr-svg" viewBox="-110 -110 220 220">${premios.map((t, i) => {
        const a0 = (i * seg - 90) * Math.PI / 180, a1 = ((i + 1) * seg - 90) * Math.PI / 180, r = 100, am = (i + .5) * seg;
        return `<path d="M0 0 L${(r * Math.cos(a0)).toFixed(2)} ${(r * Math.sin(a0)).toFixed(2)} A${r} ${r} 0 0 1 ${(r * Math.cos(a1)).toFixed(2)} ${(r * Math.sin(a1)).toFixed(2)} Z" fill="${COL[i % 2]}"/>
          <text transform="rotate(${am}) translate(0 -60) rotate(90)" class="${i % 2 ? "cl" : "os"}">${esc(t.length > 15 ? t.slice(0, 14) + "…" : t)}</text>`; }).join("")}
        <circle r="100" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="3"/>${premios.map((_, i) => { const a = (i * seg - 90) * Math.PI / 180; return `<circle cx="${(104 * Math.cos(a)).toFixed(2)}" cy="${(104 * Math.sin(a)).toFixed(2)}" r="3" fill="#fff"/>`; }).join("")}</svg>`;
    const resultado = (g) => `
      <div class="pr-gana"><div class="ic">${ic("regalo")}</div><small>¡Ganaste!</small><h3>${esc(premios[g.idx])}</h3>
        <div class="pr-codigo"><small>Tu código de hoy</small><b>${esc(g.codigo)}</b></div>
        <p class="ms-p">${esc(P.condicion || "Muéstrale esta pantalla a tu mesero. Válido hoy, en consumo en el local.")}</p>
        ${P.demo ? `<button type="button" class="vaciar" id="pr-otra">Girar otra vez (modo demo)</button>` : ""}
        <button type="button" class="cerrar-m" data-cerrar>Cerrar</button></div>`;
    function pintarRuleta() {
      $("#pr-caja").innerHTML = guardado ? resultado(guardado) : `
        <small class="pr-ceja">${esc(P.ceja || "Premio de la casa")}</small><h3>${esc(P.titulo || "Gira la ruleta y gana")}</h3>
        <div class="pr-rueda"><span class="pr-punta"></span><div class="pr-giro" id="pr-giro">${rueda}</div><span class="pr-centro">${ic("regalo")}</span></div>
        <button type="button" class="copiar pr-girar" id="pr-girar">Girar la ruleta</button>
        <p class="ms-p">Un giro por visita. ¡Gracias por venir!</p>
        <button type="button" class="cerrar-m" data-cerrar>Cerrar</button>`;
    }
    mPremio.addEventListener("click", (e) => {
      if (e.target === mPremio || e.target.closest("[data-cerrar]")) return mPremio.classList.remove("abierta");
      if (e.target.closest("#pr-otra")) { guardado = null; try { localStorage.removeItem(clave); } catch (e2) {} return pintarRuleta(); }
      const b = e.target.closest("#pr-girar"); if (!b) return;
      b.disabled = true; b.textContent = "Girando…";
      const pesosP = premios.map((_, i) => (P.pesos && P.pesos[i]) || 1), tot = pesosP.reduce((a, x) => a + x, 0);
      let r = Math.random() * tot, idx = 0; while ((r -= pesosP[idx]) > 0 && idx < n - 1) idx++;
      const giro = 360 * 6 + (360 - (idx + .5) * seg) + (Math.random() - .5) * seg * .6;
      $("#pr-giro").style.transform = `rotate(${giro}deg)`;
      setTimeout(() => {
        const L = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
        guardado = { dia: hoyTxt, idx, codigo: (P.prefijo || window.SLUG.slice(0, 4)).toUpperCase() + "-" + Array.from({ length: 4 }, () => L[Math.floor(Math.random() * L.length)]).join("") };
        try { localStorage.setItem(clave, JSON.stringify(guardado)); } catch (e2) {}
        pintarRuleta(); if (navigator.vibrate) navigator.vibrate([40, 60, 120]);
      }, 4400);
    });
    pintarRuleta();
  }

  /* ---------- Menú ---------- */
  if (tieneMenu) montarMenu();

  document.addEventListener("click", (e) => {
    const cp = e.target.closest("[data-copiar]");
    if (cp) {
      const txt = cp.dataset.copiar, ok = () => { cp.classList.add("ok"); cp.lastChild.textContent = " Copiado"; setTimeout(() => { cp.classList.remove("ok"); cp.lastChild.textContent = " Copiar"; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(txt).then(ok, () => {});
      return;
    }
    const a = e.target.closest("[data-accion]"); if (!a) return;
    if (a.dataset.accion === "wifi") mWifi.classList.add("abierta");
    if (a.dataset.accion === "menu") location.hash = "menu";
    if (a.dataset.accion === "mesa") $("#m-mesa").classList.add("abierta");
    if (a.dataset.accion === "premio") mPremio.classList.add("abierta");
  });

  function montarMenu() {
    const M = N.menu, carritoOn = !!M.carrito;
    const ITEMS = {};
    M.categorias.forEach((c, i) => c.items.forEach((it, j) => (ITEMS[`${i}-${j}`] = it)));
    const clave = "pedido_" + window.SLUG;
    let carrito = {};
    try { carrito = JSON.parse(localStorage.getItem(clave) || "{}"); } catch (e) {}
    Object.keys(carrito).forEach((k) => { if (!ITEMS[k] || !(carrito[k] > 0)) delete carrito[k]; });

    const mesaQR = MESA;
    const catalogo = M.vista === "catalogo", vista3d = M.vista === "3d";
    const fotosDe = (it) => [it.foto, ...(it.fotos || [])].filter(Boolean);

    document.body.insertAdjacentHTML("beforeend", `
      <div class="hoja" id="h-menu" role="dialog" aria-modal="true" aria-label="Menú">
        <div class="hoja-top"><button class="btn-icono" type="button" data-volver aria-label="Volver">${ic("atras")}</button><h2>Menú · ${esc(N.nombre)}</h2></div>
        <div class="hoja-cuerpo" id="menu-cuerpo">
          <nav class="cats" id="cats">${M.categorias.map((c, i) => `<button type="button" data-cat="${i}" class="${i === 0 ? "on" : ""}">${esc(c.nombre)}</button>`).join("")}</nav>
          <div class="hoja-int">
            ${mesaQR && carritoOn ? `<div class="aviso-mesa">${ic("plato")} Estás en la mesa ${mesaQR}. Tu pedido llegará a tu mesa.</div>` : ""}
            ${M.categorias.map((c, i) => `
              <h3 class="cat-titulo" id="cat-${i}">${esc(c.nombre)}</h3>
              ${vista3d ? `<div class="c3d"><div class="c3d-pista">${c.items.map((it, j) => `
                <article class="c3d-item" data-ver="${i}-${j}">
                  <div class="c3d-foto">${fotosDe(it)[0] ? `<img src="${fotosDe(it)[0]}" alt="" loading="lazy" draggable="false">` : `<span>${ic("plato")}</span>`}${it.tag ? `<span class="tag">${esc(it.tag)}</span>` : ""}</div>
                  <div class="c3d-txt"><h3>${esc(it.n)}</h3>${it.d ? `<p>${esc(it.d)}</p>` : ""}<span class="precio">${pesos(it.p)}</span>
                  ${carritoOn ? `<div class="acc" data-id="${i}-${j}"></div>` : ""}</div>
                </article>`).join("")}</div></div>` : catalogo ? `<div class="cg">${c.items.map((it, j) => `
                <article class="cg-item" data-ver="${i}-${j}">
                  <div class="cg-foto">${fotosDe(it)[0] ? `<img src="${fotosDe(it)[0]}" alt="" loading="lazy">` : `<span>${ic("plato")}</span>`}
                    ${fotosDe(it).length > 1 ? `<em>${fotosDe(it).length} fotos</em>` : ""}${it.tag ? `<span class="tag">${esc(it.tag)}</span>` : ""}</div>
                  <div class="cg-txt"><h3>${esc(it.n)}</h3><span class="precio">${pesos(it.p)}</span>
                  ${carritoOn ? `<div class="acc" data-id="${i}-${j}"></div>` : ""}</div>
                </article>`).join("")}</div>` : c.items.map((it, j) => `
                <article class="item" ${fotosDe(it).length ? `data-ver="${i}-${j}"` : ""}>
                  <div>
                    ${it.tag ? `<span class="tag">${esc(it.tag)}</span>` : ""}
                    <h3>${esc(it.n)}</h3>
                    ${it.d ? `<p>${esc(it.d)}</p>` : ""}
                    <span class="precio">${pesos(it.p)}</span>
                    ${carritoOn ? `<div class="acc" data-id="${i}-${j}"></div>` : ""}
                  </div>
                  ${it.foto ? `<img class="foto" src="${it.foto}" alt="" loading="lazy">` : ""}
                </article>`).join("")}`).join("")}
          </div>
        </div>
        ${carritoOn
          ? `<button type="button" class="barra" id="barra" hidden><span><span class="cnt" id="cnt">0</span>Ver mi pedido</span><span id="sub">$ 0</span></button>`
          : `<a class="barra wa" href="${wa(`Hola ${N.nombre}, quiero hacer un pedido.`)}" target="_blank" rel="noopener">${ic("wa")} Pedir por WhatsApp</a>`}
      </div>
      <div class="modal detalle" id="m-detalle" role="dialog" aria-modal="true" aria-label="Producto"><div class="modal-caja" id="det-caja"></div></div>
      ${carritoOn ? `
      <div class="hoja" id="h-pedido" role="dialog" aria-modal="true" aria-label="Tu pedido">
        <div class="hoja-top"><button class="btn-icono" type="button" data-volver aria-label="Volver">${ic("atras")}</button><h2>Tu pedido</h2></div>
        <div class="hoja-cuerpo"><form class="hoja-int" id="f-pedido" novalidate>
          <ul class="items" id="items"></ul>
          <div class="grupo"><span>¿Cómo lo quieres?</span>
            <div class="opciones">
              <label><input type="radio" name="entrega" value="domicilio" ${mesaQR ? "" : "checked"}><span>${ic("moto")}Domicilio</span></label>
              <label><input type="radio" name="entrega" value="recoger"><span>${ic("bolsa")}Recoger</span></label>
              <label><input type="radio" name="entrega" value="mesa" ${mesaQR ? "checked" : ""}><span>${ic("plato")}En mesa</span></label>
            </div>
          </div>
          <div class="grupo" data-para="domicilio"><label for="p-dir">Dirección y barrio</label><input class="campo" id="p-dir" autocomplete="street-address" placeholder="Ej: Calle 8 # 20-31, Centro"></div>
          <div class="grupo" data-para="mesa"><label for="p-mesa">Número de mesa</label><input class="campo" id="p-mesa" inputmode="numeric" value="${mesaQR}" placeholder="Ej: 4"></div>
          <div class="grupo" data-para="domicilio recoger"><label for="p-nombre">Nombre</label><input class="campo" id="p-nombre" autocomplete="name" placeholder="¿A nombre de quién?"></div>
          <div class="grupo" data-para="domicilio recoger"><label for="p-pago">Forma de pago</label><select class="campo" id="p-pago">${(N.pagos || []).length ? ["Efectivo", ...N.pagos.map((m) => m.t)].map((o) => `<option>${esc(o)}</option>`).join("") : `<option>Efectivo</option><option>Nequi</option><option>Daviplata</option><option>Tarjeta (datáfono)</option>`}</select></div>
          <div class="grupo"><label for="p-nota">Notas (opcional)</label><textarea class="campo" id="p-nota" rows="2" placeholder="Término de la carne, sin cebolla, cambio para…"></textarea></div>
          <div class="totales" id="totales"></div>
          <div class="error" id="p-error" role="alert"></div>
          <button type="submit" class="btn-wa">${ic("wa")} Enviar pedido por WhatsApp</button>
          <button type="button" class="vaciar" id="vaciar">Vaciar pedido</button>
        </form></div>
      </div>` : ""}`);

    const hMenu = $("#h-menu"), hPedido = $("#h-pedido"), cuerpo = $("#menu-cuerpo");

    // Navegación con el botón "atrás" del celular
    function ruta() {
      const h = location.hash.slice(1);
      hMenu.classList.toggle("abierta", h === "menu" || h === "pedido");
      if (hPedido) hPedido.classList.toggle("abierta", h === "pedido");
      document.body.style.overflow = h === "menu" || h === "pedido" ? "hidden" : "";
      if (h === "pedido") pintar();
    }
    addEventListener("hashchange", ruta);
    // Si el cliente abrió un enlace que ya traía #menu, "atrás" no debe sacarlo del sitio
    const llegoConHash = !!location.hash;
    const volver = () => {
      if (llegoConHash && history.length <= 2) location.replace(location.hash === "#pedido" ? "#menu" : "#");
      else history.back();
    };
    document.querySelectorAll("[data-volver]").forEach((b) => b.addEventListener("click", volver));
    ruta();
    if (mesaQR && carritoOn && !MESERO && !location.hash) location.hash = "menu";

    // Pestañas de categorías
    $("#cats").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]"); if (!b) return;
      const t = $("#cat-" + b.dataset.cat);
      cuerpo.scrollTo({ top: t.offsetTop - 64, behavior: "smooth" });
    });
    const titulos = [...hMenu.querySelectorAll(".cat-titulo")];
    cuerpo.addEventListener("scroll", () => {
      let act = 0;
      titulos.forEach((t, i) => { if (t.offsetTop - 90 <= cuerpo.scrollTop) act = i; });
      hMenu.querySelectorAll("#cats button").forEach((b, i) => b.classList.toggle("on", i === act));
    }, { passive: true });

    /* ----- Carta 3D: cada tarjeta gira según su distancia al centro ----- */
    if (vista3d) {
      const pistas = [...hMenu.querySelectorAll(".c3d-pista")];
      const girar = (p) => {
        const mitad = p.scrollLeft + p.clientWidth / 2;
        p.querySelectorAll(".c3d-item").forEach((el) => {
          const d = Math.max(-2, Math.min(2, (el.offsetLeft + el.offsetWidth / 2 - mitad) / el.offsetWidth));
          el.style.transform = `perspective(900px) translateZ(${(-Math.abs(d) * 130).toFixed(1)}px) rotateY(${(-d * 40).toFixed(1)}deg)`;
          el.style.opacity = (1 - Math.min(Math.abs(d), 1.6) * .32).toFixed(2);
          el.classList.toggle("centro", Math.abs(d) < .5);
        });
      };
      pistas.forEach((p) => p.addEventListener("scroll", () => requestAnimationFrame(() => girar(p)), { passive: true }));
      const todas = () => pistas.forEach(girar);
      addEventListener("resize", todas); addEventListener("hashchange", () => setTimeout(todas, 80)); setTimeout(todas, 80);
    }

    /* ----- Detalle del producto con galería de fotos ----- */
    const mDet = $("#m-detalle"), detCaja = $("#det-caja");
    let detId = null;
    function verDetalle(k) {
      const it = ITEMS[k], fotos = fotosDe(it); detId = k;
      detCaja.innerHTML = `
        ${fotos.length ? `<div class="galeria" id="galeria">${fotos.map((f) => `<img src="${f}" alt="">`).join("")}</div>
        ${fotos.length > 1 ? `<div class="puntos" id="puntos">${fotos.map((_, i) => `<i class="${i ? "" : "on"}"></i>`).join("")}</div>` : ""}` : ""}
        <div class="det-txt">
          ${it.tag ? `<span class="tag">${esc(it.tag)}</span>` : ""}
          <h3>${esc(it.n)}</h3>
          ${it.d ? `<p>${esc(it.d)}</p>` : ""}
          <span class="precio">${pesos(it.p)}</span>
          ${carritoOn ? `<div class="acc det-acc" data-id="${k}"></div>`
            : `<a class="btn-wa" href="${wa(`Hola ${N.nombre}, me interesa: ${it.n} (${pesos(it.p)})`)}" target="_blank" rel="noopener">${ic("wa")} Preguntar por WhatsApp</a>`}
          <button type="button" class="cerrar-m" data-cerrar>Cerrar</button>
        </div>`;
      mDet.classList.add("abierta"); document.body.classList.add("det-abierto");
      detCaja.classList.toggle("det3d", vista3d);
      const g0 = vista3d && $("#galeria");
      if (g0) {
        const tilt = (x, y) => g0.querySelectorAll("img").forEach((im) => (im.style.transform = `perspective(700px) rotateY(${(x * 18).toFixed(1)}deg) rotateX(${(-y * 14).toFixed(1)}deg) scale(1.06)`));
        g0.addEventListener("pointermove", (e) => { const r = g0.getBoundingClientRect(); tilt((e.clientX - r.left) / r.width - .5, (e.clientY - r.top) / r.height - .5); });
        g0.addEventListener("pointerleave", () => tilt(0, 0));
      }
      const g = $("#galeria"), pts = $("#puntos");
      if (g && pts) g.addEventListener("scroll", () => {
        const i = Math.round(g.scrollLeft / g.clientWidth);
        pts.querySelectorAll("i").forEach((p, j) => p.classList.toggle("on", i === j));
      }, { passive: true });
      if (carritoOn) pintar();
    }
    if (vista3d) addEventListener("deviceorientation", (e) => {
      const g0 = detId != null && $("#galeria"); if (!g0 || e.gamma == null) return;
      const x = Math.max(-.5, Math.min(.5, e.gamma / 60)), y = Math.max(-.5, Math.min(.5, (e.beta - 45) / 60));
      g0.querySelectorAll("img").forEach((im) => (im.style.transform = `perspective(700px) rotateY(${(x * 18).toFixed(1)}deg) rotateX(${(-y * 14).toFixed(1)}deg) scale(1.06)`));
    });
    mDet.addEventListener("click", (e) => {
      if (e.target === mDet || e.target.closest("[data-cerrar]")) { mDet.classList.remove("abierta"); document.body.classList.remove("det-abierto"); detId = null; return; }
      const b = e.target.closest("[data-d]"); if (b && carritoOn) cambiar(detId, +b.dataset.d);
    });
    hMenu.addEventListener("click", (e) => {
      if (e.target.closest("[data-d], .acc, a")) return;
      const v = e.target.closest("[data-ver]"); if (v) verDetalle(v.dataset.ver);
    });

    if (!carritoOn) return;

    /* ----- Carrito ----- */
    const form = $("#f-pedido");
    const entrega = () => form.querySelector("input[name=entrega]:checked").value;
    const unidades = () => Object.values(carrito).reduce((s, q) => s + q, 0);
    const subtotal = () => Object.entries(carrito).reduce((s, [k, q]) => s + ITEMS[k].p * q, 0);
    const stepper = (q) => `<span class="stepper"><button type="button" data-d="-1" aria-label="Quitar uno">−</button><output>${q}</output><button type="button" data-d="1" aria-label="Agregar uno">+</button></span>`;

    function cambiar(k, dlt) {
      carrito[k] = Math.max(0, Math.min(30, (carrito[k] || 0) + dlt));
      if (!carrito[k]) delete carrito[k];
      try { localStorage.setItem(clave, JSON.stringify(carrito)); } catch (e) {}
      pintar();
    }

    function pintar() {
      document.querySelectorAll("#h-menu .acc, #m-detalle .acc").forEach((el) => {
        const q = carrito[el.dataset.id] || 0;
        el.innerHTML = q ? stepper(q) : `<button type="button" class="agregar" data-d="1">+ Agregar</button>`;
      });
      const n = unidades(), sub = subtotal(), tipo = entrega();
      $("#barra").hidden = !n;
      $("#cnt").textContent = n;
      $("#sub").textContent = pesos(sub);
      $("#items").innerHTML = n
        ? Object.entries(carrito).map(([k, q]) => `<li><div>${esc(ITEMS[k].n)}<small>${pesos(ITEMS[k].p)} c/u</small></div><span data-id="${k}">${stepper(q)}</span></li>`).join("")
        : `<li class="vacio">Tu pedido está vacío.</li>`;
      form.querySelectorAll("[data-para]").forEach((g) => (g.style.display = g.dataset.para.split(" ").includes(tipo) ? "" : "none"));
      const dom = tipo === "domicilio" && n ? M.domicilio || 0 : 0;
      $("#totales").innerHTML = `
        <div><span>Subtotal (${n} producto${n !== 1 ? "s" : ""})</span><span>${pesos(sub)}</span></div>
        ${tipo === "domicilio" && M.domicilio ? `<div><span>Domicilio</span><span>${pesos(dom)}</span></div>` : ""}
        <div class="total"><span>Total</span><span>${pesos(sub + dom)}</span></div>`;
      $("#p-error").textContent = "";
    }

    hMenu.addEventListener("click", (e) => {
      const b = e.target.closest("[data-d]"); if (!b) return;
      cambiar(b.closest("[data-id]").dataset.id, +b.dataset.d);
    });
    $("#items").addEventListener("click", (e) => {
      const b = e.target.closest("[data-d]"); if (!b) return;
      cambiar(b.closest("[data-id]").dataset.id, +b.dataset.d);
    });
    $("#barra").addEventListener("click", () => (location.hash = "pedido"));
    form.addEventListener("change", pintar);
    $("#vaciar").addEventListener("click", () => { carrito = {}; cambiar("", 0); volver(); });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const err = (t, id) => { $("#p-error").textContent = t; if (id) $("#" + id).focus(); };
      if (!unidades()) return err("Agrega al menos un producto.");
      const tipo = entrega(), dir = $("#p-dir").value.trim(), mesa = $("#p-mesa").value.trim(), nombre = $("#p-nombre").value.trim();
      if (tipo === "domicilio" && !dir) return err("Escribe la dirección de entrega.", "p-dir");
      if (tipo === "mesa" && !mesa) return err("Escribe el número de tu mesa.", "p-mesa");
      if (tipo !== "mesa" && !nombre) return err("Escribe tu nombre.", "p-nombre");
      const dom = tipo === "domicilio" ? M.domicilio || 0 : 0;
      const nota = $("#p-nota").value.trim();
      const msg =
        (tipo === "mesa" ? `Hola, pedido para la MESA ${mesa}:\n\n` : `Hola ${N.nombre}, quiero hacer este pedido:\n\n`) +
        Object.entries(carrito).map(([k, q]) => `${q} x ${ITEMS[k].n} — ${pesos(ITEMS[k].p * q)}`).join("\n") +
        `\n\nSubtotal: ${pesos(subtotal())}` + (dom ? `\nDomicilio: ${pesos(dom)}` : "") + `\nTotal: ${pesos(subtotal() + dom)}\n` +
        (tipo === "domicilio" ? `\nEntrega: Domicilio\nDirección: ${dir}` : tipo === "recoger" ? "\nEntrega: Para recoger" : "") +
        (tipo !== "mesa" ? `\nNombre: ${nombre}\nPago: ${$("#p-pago").value}${(() => { const m = (N.pagos || []).find((x) => x.t === $("#p-pago").value); return m ? ` (${m.v}) — te envío el comprobante` : ""; })()}` : "") +
        (nota ? `\nNotas: ${nota}` : "");
      if (tipo === "mesa" && MESERO && MESERO.aviso !== "whatsapp") {
        const lineas = Object.entries(carrito).map(([k, q]) => `${q} x ${ITEMS[k].n}`).join("\n") + `\nTotal: ${pesos(subtotal())}` + (nota ? `\nNotas: ${nota}` : "");
        const b = form.querySelector(".btn-wa"); b.disabled = true;
        avisarMesero("pedido", lineas).then(() => {
          carrito = {}; try { localStorage.removeItem(clave); } catch (e2) {}
          pintar(); location.replace("#");
          $("#ms-caja").innerHTML = `<div class="ic ok">${ic("ok")}</div><h3>¡Pedido enviado!</h3><p class="ms-p">Ya le llegó a tu mesero. Te lo llevan a la mesa ${esc(mesa)}.</p><button type="button" class="copiar" data-cerrar>Entendido</button>`;
          $("#m-mesero").classList.add("abierta");
        }).catch((e2) => err(e2.message)).finally(() => (b.disabled = false));
        return;
      }
      window.open(wa(msg), "_blank", "noopener");
    });

    pintar();
  }
})();
