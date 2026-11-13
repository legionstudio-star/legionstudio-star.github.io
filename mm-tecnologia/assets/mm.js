/* MM Accesorios Tecnología · página del QR del acrílico (demo Legion Estudio)
   Redes + catálogo + ubicación + ruleta de premios + Club MM + panel de la tienda.
   Demo: todo se guarda en localStorage de este dispositivo. */
(() => {
  // ====== DATOS DEL NEGOCIO (cambiar por los reales) ======
  const NEG = {
    nombre: "MM Accesorios Tecnología",
    wa: "573000000000",                       // WhatsApp de la tienda (con 57)
    ig: "https://www.instagram.com/",
    fb: "https://www.facebook.com/",
    tt: "https://www.tiktok.com/",
    catalogo: "",                             // enlace al catálogo de WhatsApp; vacío = abre chat
    maps: "https://www.google.com/maps/search/?api=1&query=MM+Accesorios+Tecnologia",
    direccion: "Dirección del local por confirmar",
    horario: "Lunes a sábado · 9:00 a. m. – 8:00 p. m.",
  };
  const PIN = "1234";
  const META = 6;              // compras para el regalo
  const REGALO = "Accesorio de regalo";
  const KEY = "mm-tec-demo-v1";

  const PREMIOS = [
    { t: "10%", s: "DESCUENTO", full: "10% de descuento", d: "en tu próxima compra", w: 20 },
    { t: "VIDRIO", s: "GRATIS", full: "Vidrio templado gratis", d: "al comprar tu funda", w: 12 },
    { t: "5%", s: "DESCUENTO", full: "5% de descuento", d: "en toda la tienda", w: 24 },
    { t: "x2", s: "SELLOS", full: "Sello doble", d: "tu próxima compra vale 2 sellos", w: 14 },
    { t: "15%", s: "AUDÍFONOS", full: "15% en audífonos", d: "AirPods y diademas", w: 6 },
    { t: "CABLE", s: "DE REGALO", full: "Cable de carga de regalo", d: "en compras desde $50.000", w: 8 },
    { t: "ENVÍO", s: "GRATIS", full: "Domicilio gratis", d: "en tu próximo pedido", w: 12 },
    { t: "20%", s: "FUNDAS", full: "20% en fundas", d: "en todas las referencias", w: 4 },
  ];
  const PRODUCTOS = [
    { img: "p1", dk: true, n: "AirPods Pro 2ª generación", c: "Audio" },
    { img: "p2", n: "Audífonos de diadema Max", c: "Audio" },
    { img: "p3", n: "Funda MagSafe mate · iPhone", c: "Fundas" },
    { img: "p4", n: "Funda 360° antigolpes con protector", c: "Fundas" },
  ];

  // ====== estado ======
  const DIA = 864e5, hoy = () => Date.now();
  const SEMILLA = [
    ["Laura Méndez", 4, 3, 2], ["Andrés Gómez", 2, 12, 9], ["Valentina Ruiz", 5, 5, 11], ["Juan Pérez", 1, 41, 11],
    ["Camila Herrera", 3, 8, 6], ["Mateo Vargas", 0, 52, 3], ["Daniela Moreno", 4, 19, 11], ["Sebastián Ortiz", 2, 36, 7],
    ["Natalia Ramírez", 5, 2, 1], ["Esteban Díaz", 1, 33, 11],
  ];
  const nuevo = () => ({
    vista: "cliente", tab: "escanear", unlocked: false, me: null, filtro: "Todos", rot: 0,
    base: { miembros: 214, giros: 386, canjes: 141, ventasClub: 12480000 },
    dist: [74, 41, 92, 55, 22, 30, 47, 25],
    members: SEMILLA.map(([name, stamps, dias, mes], i) => ({ id: String(100 + i).padStart(4, "0"), name, stamps, last: hoy() - dias * DIA, bmonth: mes, visits: stamps + 2 + (i % 3) })),
    promos: [], recordados: [],
  });
  let S = cargar(), popAt = -1, escaneado = false, girando = false, pinTxt = "";
  function cargar() { try { return JSON.parse(localStorage.getItem(KEY)) || nuevo(); } catch { return nuevo(); } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
  const $app = document.getElementById("app");
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n1 = (n) => n.split(/\s+/)[0];
  const ini = (n) => n.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const dias = (t) => Math.floor((hoy() - t) / DIA);
  const waLink = (txt) => `https://wa.me/${NEG.wa}?text=${encodeURIComponent(txt)}`;
  const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  // ====== íconos SVG de línea ======
  const I = (p, extra = "") => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${p}</svg>`;
  const IC = {
    wa: I('<path d="M3.5 20.5l1.3-4.2A8.5 8.5 0 1 1 8 19.4z"/><path d="M9 8.6c0 3.4 3 6.4 6.4 6.4l1.2-1.6-2-1-1 .9c-1-.4-2-1.4-2.4-2.4l.9-1-1-2z"/>'),
    ig: I('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>'),
    fb: I('<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4a20 20 0 0 0-2.3-.1c-2.3 0-3.8 1.4-3.8 3.9v2.3H9v3h2.5V21"/>'),
    tt: I('<path d="M14 3.5v11.2a3.7 3.7 0 1 1-3.7-3.7"/><path d="M14 3.5c.4 2.7 2.3 4.6 5 4.8"/>'),
    cat: I('<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>'),
    pin: I('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/>'),
    gift: I('<rect x="3.5" y="8" width="17" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>'),
    bag: I('<path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/>'),
    cake: I('<path d="M4 20.5h16M5 20.5v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7"/><path d="M5 15.5c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0M12 11.5V8"/><path d="M12 4.5c.8.8.8 2 0 2.5-.8-.5-.8-1.7 0-2.5z"/>'),
    phone: I('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>'),
    clock: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    scan: I('<path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16"/>'),
    wheel: I('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2"/><path d="M12 3.5V10M12 14v6.5M3.5 12H10M14 12h6.5M6 6l4.6 4.6M13.4 13.4 18 18M18 6l-4.6 4.6M10.6 13.4 6 18"/>'),
    users: I('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.5 3.2-5.5 6.5-5.5s5.9 2 6.5 5.5"/><path d="M16 4.8a3.5 3.5 0 0 1 0 6.4M18.5 14.8c1.7.8 2.7 2.6 3 5.2"/>'),
    mega: I('<path d="M3.5 10v4a1 1 0 0 0 1 1H7l7 4.5V4.5L7 9H4.5a1 1 0 0 0-1 1z"/><path d="M17.5 9a4 4 0 0 1 0 6M8 15l1.2 5"/>'),
    check: I('<path d="M5 12.5l4.2 4.2L19 7"/>', 'stroke-width="2.6"'),
    star: I('<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.8l-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z"/>'),
    arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    lock: I('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
  };

  // ====== utilidades ======
  function qrSvg(txt) {
    const q = qrcode(0, "M"); q.addData(txt); q.make();
    const n = q.getModuleCount(); let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
    return `<svg viewBox="-1 -1 ${n + 2} ${n + 2}" shape-rendering="crispEdges"><path d="${d}" fill="#0b0b0b"/></svg>`;
  }
  let tN;
  function notificar(txt) {
    const el = document.getElementById("notif");
    document.getElementById("notifTxt").textContent = txt;
    el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
    clearTimeout(tN); tN = setTimeout(() => el.classList.remove("show"), 4300);
    if (navigator.vibrate) navigator.vibrate(60);
  }
  function toast(t) { const el = document.createElement("div"); el.className = "toast"; el.textContent = t; document.body.appendChild(el); setTimeout(() => el.remove(), 2400); }
  function confeti() {
    const b = document.createElement("div"); b.className = "confetti";
    const cols = ["#d9b876", "#fcdfa3", "#ffffff", "#bdbdbd", "#94743a"];
    for (let i = 0; i < 80; i++) { const c = document.createElement("i"); c.style.left = Math.random() * 100 + "%"; c.style.background = cols[i % 5]; c.style.animationDelay = Math.random() * .5 + "s"; c.style.animationDuration = 1.3 + Math.random() * 1.3 + "s"; b.appendChild(c); }
    document.body.appendChild(b); setTimeout(() => b.remove(), 3200);
  }
  const codigo = () => "MM-" + Math.random().toString(36).slice(2, 6).toUpperCase();
  const pendientes = (m) => (m.premios || []).filter((p) => !p.usado);
  const puedeGirar = () => !S.me || !S.me.ultimoGiro || hoy() - S.me.ultimoGiro > 7 * DIA;

  // ====== ruleta SVG ======
  function wheelSvg() {
    const N = PREMIOS.length, R = 100, seg = 360 / N;
    const fills = ["url(#gG)", "#0c0c0d", "url(#gS)", "#161618"];
    const txt = ["#1a1307", "#e6c88a", "#1b1b1b", "#e9e9e9"];
    const pt = (a, r) => { const rad = (a - 90) * Math.PI / 180; return [100 + r * Math.cos(rad), 100 + r * Math.sin(rad)]; };
    let p = "";
    PREMIOS.forEach((z, i) => {
      const a0 = i * seg, a1 = a0 + seg, [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R);
      p += `<path d="M100,100 L${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 0 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${fills[i % 4]}" stroke="#050505" stroke-width=".8"/>`;
      p += `<g transform="rotate(${a0 + seg / 2} 100 100)" fill="${txt[i % 4]}" text-anchor="middle" font-family="Chakra Petch">
        <text x="100" y="${z.t.length > 3 ? 31 : 33}" font-size="${z.t.length > 3 ? 12.5 : 17}" font-weight="700">${z.t}</text>
        <text x="100" y="44" font-size="6.2" font-weight="600" letter-spacing=".6">${z.s}</text></g>`;
    });
    return `<svg viewBox="0 0 200 200"><defs>
      <linearGradient id="gG" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#94743a"/><stop offset=".45" stop-color="#fcdfa3"/><stop offset="1" stop-color="#a8865a"/></linearGradient>
      <linearGradient id="gS" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#9c9c9c"/><stop offset=".5" stop-color="#ffffff"/><stop offset="1" stop-color="#a9a9a7"/></linearGradient>
      </defs>${p}</svg>`;
  }
  function ringDots() { let s = ""; for (let i = 0; i < 24; i++) { const a = i * 15 * Math.PI / 180; s += `<i class="${i % 2 ? "off" : ""}" style="transform:translate(${Math.sin(a) * 50.5}cqw,${-Math.cos(a) * 50.5}cqw)"></i>`; } return s; }
  function elegir() { const tot = PREMIOS.reduce((a, p) => a + p.w, 0); let r = Math.random() * tot; for (let i = 0; i < PREMIOS.length; i++) { r -= PREMIOS[i].w; if (r < 0) return i; } return 0; }

  function girar() {
    if (girando) return; girando = true;
    const i = elegir(), seg = 360 / PREMIOS.length, centro = i * seg + seg / 2;
    const jitter = (Math.random() - .5) * seg * .6;
    const base = S.rot - (S.rot % 360);
    S.rot = base + 360 * 6 + (360 - centro) + jitter;
    const w = document.getElementById("wheel");
    w.style.transform = `rotate(${S.rot}deg)`;
    const btn = document.getElementById("bGirar"); if (btn) { btn.disabled = true; btn.textContent = "Girando..."; }
    const dots = document.querySelectorAll(".ring i"); let k = 0;
    const blink = setInterval(() => { dots.forEach((d, j) => d.classList.toggle("off", (j + k) % 2 === 0)); k++; }, 140);
    setTimeout(() => {
      clearInterval(blink); girando = false;
      const pz = PREMIOS[i], m = S.me;
      m.premios = m.premios || [];
      m.premios.unshift({ i, code: codigo(), t: hoy(), vence: hoy() + 15 * DIA, usado: false });
      m.ultimoGiro = hoy(); S.base.giros++; S.dist[i]++;
      confeti(); render();
      setTimeout(() => notificar(`Ganaste: ${pz.full}. Muestra tu código en la tienda.`), 350);
      setTimeout(() => document.getElementById("premio")?.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    }, 5300);
  }

  // ====== vista cliente ======
  function render() {
    if (S.vista === "tienda") { S.unlocked ? panel() : vistaPin(); }
    else cliente();
    guardar();
  }

  function cliente() {
    const m = S.me;
    $app.innerHTML = `
      <section class="hero">
        <video class="hv" src="assets/fondo.mp4" poster="assets/fondo.jpg" autoplay muted loop playsinline preload="auto"></video>
        <div class="hshade"></div>
        <div class="hin">
          <img class="logo" src="assets/logo.webp" alt="${NEG.nombre}">
          <div class="hbot">
            <p class="kick">ACCESORIOS PREMIUM · AUDIO · CARGA · FUNDAS</p>
            <h1 class="h">Tecnología que <span class="gold-t">se nota</span></h1>
            <a class="btn gold block spin-btn h" href="#ruleta">Gira y gana un premio ${IC.arrow}</a>
            <div class="chips"><span class="chip"><span class="dot"></span>Atendemos por WhatsApp</span><span class="chip">${IC.star}Club MM</span></div>
          </div>
        </div>
      </section>

      <nav class="links fade">
        <a class="lk wa" href="${waLink("Hola MM, vengo del QR de la tienda")}" target="_blank" rel="noopener"><span class="b">${IC.wa}</span>WhatsApp</a>
        <a class="lk ig" href="${NEG.ig}" target="_blank" rel="noopener"><span class="b">${IC.ig}</span>Instagram</a>
        <a class="lk fb" href="${NEG.fb}" target="_blank" rel="noopener"><span class="b">${IC.fb}</span>Facebook</a>
        <a class="lk tt" href="${NEG.tt}" target="_blank" rel="noopener"><span class="b">${IC.tt}</span>TikTok</a>
      </nav>
      <div class="big-links fade">
        <a class="bl" href="#catalogo"><span class="ic">${IC.cat}</span><span>Catálogo<small>Ver productos</small></span></a>
        <a class="bl" href="#ubicacion"><span class="ic">${IC.pin}</span><span>Ubicación<small>Cómo llegar</small></span></a>
      </div>

      <section class="sec" id="ruleta">${ruletaHtml()}</section>
      <section class="sec" id="club">${clubHtml()}</section>
      <section class="sec" id="catalogo">${catalogoHtml()}</section>
      <section class="sec" id="ubicacion">${ubicacionHtml()}</section>

      <footer class="foot">
        <p>${NEG.nombre}</p>
        <p style="margin-top:4px">Página y Club por Legion Estudio</p>
        <button id="bTienda">Acceso tienda</button>
      </footer>`;
    // conservar el video del banner entre renders (no reinicia)
    if (window.__hv) { const nv = $app.querySelector(".hv"); nv.replaceWith(window.__hv); window.__hv.play().catch(() => {}); }
    window.__hv = $app.querySelector(".hv");
    if (!window.__rv) {
      window.__rv = true;
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
      $app.querySelectorAll(".links,.big-links,.sec").forEach((el) => { el.classList.add("rv"); io.observe(el); });
    }
    const w = document.getElementById("wheel"); if (w) { w.style.transition = "none"; w.style.transform = `rotate(${S.rot}deg)`; void w.offsetWidth; w.style.transition = ""; }
    enlazarCliente();
    popAt = -1;
  }

  function ruletaHtml() {
    const m = S.me, ultimo = m && m.premios && m.premios[0];
    const recien = ultimo && hoy() - ultimo.t < 60000 && !ultimo.usado;
    let abajo;
    if (!m) {
      abajo = `<form class="form2" id="fJoin" autocomplete="off">
          <div><label class="f" for="jn">Tu nombre</label><input class="inp" id="jn" required maxlength="40" placeholder="Ej: Laura Méndez"></div>
          <div><label class="f" for="jt">WhatsApp</label><input class="inp" id="jt" required inputmode="numeric" maxlength="14" placeholder="300 123 4567"></div>
          <div><label class="f" for="jb">Mes de cumpleaños</label><select class="inp" id="jb">${MESES.map((x, i) => `<option value="${i + 1}" ${i === new Date().getMonth() ? "selected" : ""}>${x}</option>`).join("")}</select></div>
          <label class="check"><input type="checkbox" id="jc" checked> Acepto unirme al Club MM y recibir mis premios y promociones.</label>
          <button class="btn gold block spin-btn h" type="submit" id="bGirar">Girar la ruleta</button>
        </form>`;
    } else if (puedeGirar()) {
      abajo = `<button class="btn gold block spin-btn h" id="bGirar">Girar la ruleta</button>`;
    } else {
      const f = new Date(m.ultimoGiro + 7 * DIA).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
      abajo = `<p class="s" style="margin-top:14px">Ya giraste esta semana. Tu próximo giro: <b class="gold-t">${f}</b>.</p>
        <button class="btn ghost" id="bReGirar" style="margin-top:12px;font-size:12px;padding:9px 14px">Volver a girar (solo para la demo)</button>`;
    }
    const pz = ultimo ? PREMIOS[ultimo.i] : null;
    return `
      <div class="rul fade">
        <span class="sec-h" style="display:block;margin:0"><span class="k">GANA HOY</span></span>
        <h3 class="h" style="margin-top:6px">Ruleta de <span class="gold-t">premios</span></h3>
        <p class="s">${m ? `Hola ${esc(n1(m.name))}, gira y gana descuentos y regalos.` : "Déjanos tus datos y gira gratis. Siempre ganas algo."}</p>
        <div class="wheel-box" style="container-type:inline-size">
          <svg class="pointer" viewBox="0 0 34 44"><defs><linearGradient id="pg" x1="0" x2="1"><stop offset="0" stop-color="#94743a"/><stop offset=".5" stop-color="#fcdfa3"/><stop offset="1" stop-color="#94743a"/></linearGradient></defs><path d="M17 43 3 14a14 14 0 1 1 28 0z" fill="url(#pg)" stroke="#050505" stroke-width="2"/><circle cx="17" cy="14" r="5" fill="#050505"/></svg>
          <div class="ring">${ringDots()}</div>
          <div id="wheel">${wheelSvg()}</div>
          <div class="hub"><img src="assets/simbolo.webp" alt=""></div>
        </div>
        ${abajo}
      </div>
      ${ultimo && pz ? `
      <div class="prize fade" id="premio" style="margin-top:14px">
        <span class="tag">${recien ? "GANASTE" : ultimo.usado ? "PREMIO USADO" : "TU ÚLTIMO PREMIO"}</span>
        <div class="v gold-t">${pz.t === "x2" ? "Sello doble" : esc(pz.full)}</div>
        <p class="d">${esc(pz.d)}</p>
        <div class="code">${ultimo.code}</div>
        <div class="q">${qrSvg("MMPREMIO-" + ultimo.code)}</div>
        <small>Muéstralo en caja · válido hasta el ${new Date(ultimo.vence).toLocaleDateString("es-CO", { day: "numeric", month: "long" })}. Ya quedó guardado en tu Club MM.</small>
        <a class="btn dark block" style="margin-top:14px" target="_blank" rel="noopener" href="${waLink(`Hola MM, gané en la ruleta: ${pz.full}. Mi código es ${ultimo.code}`)}">${IC.wa}Reclamar por WhatsApp</a>
      </div>` : ""}`;
  }

  function sellos(n) {
    return Array.from({ length: META }, (_, i) => {
      const last = i === META - 1;
      return `<span class="stamp ${i < n ? "on" : ""} ${last ? "last" : ""} ${i === popAt ? "pop" : ""}">${last ? IC.gift : IC.bag}</span>`;
    }).join("");
  }

  function clubHtml() {
    const m = S.me;
    const head = `<div class="sec-h"><div><span class="k">FIDELIZACIÓN</span><h2 class="h">Club <span class="gold-t">MM</span></h2></div></div>`;
    if (!m) return `${head}
      <div class="perks fade">
        <div class="perk"><span class="ic">${IC.bag}</span><div><b>Cada compra suma un sello</b><span>Al completar ${META} sellos te llevas un ${REGALO.toLowerCase()}</span></div></div>
        <div class="perk"><span class="ic">${IC.wheel}</span><div><b>Un giro de ruleta cada semana</b><span>Descuentos, vidrios, cables y domicilios gratis</span></div></div>
        <div class="perk"><span class="ic">${IC.cake}</span><div><b>Regalo de cumpleaños</b><span>Te esperamos con un detalle en tu mes</span></div></div>
        <div class="perk"><span class="ic">${IC.phone}</span><div><b>Tu tarjeta vive en el celular</b><span>Sin descargar aplicaciones</span></div></div>
        <a class="btn gold block" href="#ruleta">Unirme y girar gratis ${IC.arrow}</a>
      </div>`;
    const falta = META - m.stamps, lleno = m.stamps >= META, pend = pendientes(m);
    return `${head}
      <div class="stack fade">
        <div class="mcard">
          <div class="top"><img src="assets/simbolo.webp" alt=""><div><div class="t1">CLUB MM</div><div class="t2">ACCESORIOS · TECNOLOGÍA</div></div></div>
          <div class="who"><div><div class="s">Miembro</div><div class="n">${esc(m.name)}</div></div><div style="text-align:right"><div class="s">N°</div><b>${m.id}</b></div></div>
          <div class="stamps">${sellos(Math.min(m.stamps, META))}</div>
          <div class="progress">${lleno ? `<b class="gold-t">Tarjeta completa.</b> Reclama tu ${REGALO.toLowerCase()}.` : `Te ${falta === 1 ? "falta" : "faltan"} <b>${falta}</b> ${falta === 1 ? "compra" : "compras"} para tu <b>${REGALO.toLowerCase()}</b>`}</div>
        </div>
        <div class="box">
          <div class="qrbox">${qrSvg("CLUBMM-" + m.id)}</div>
          <p class="qrcap">MUESTRA ESTE CÓDIGO EN CADA COMPRA · ${m.id}</p>
        </div>
        ${(m.premios || []).length ? `<div><p class="mut" style="margin-bottom:8px;font-weight:700">Mis premios</p><div class="mylist">${m.premios.map((p) => `
          <div class="mi"><span style="color:var(--g1)">${IC.gift}</span><div style="flex:1;min-width:0"><b style="font-size:13.5px">${esc(PREMIOS[p.i].full)}</b><div class="c">${p.code}</div></div>
          <span class="pill ${p.usado ? "off" : "ok"}">${p.usado ? "Usado" : "Disponible"}</span></div>`).join("")}</div></div>` : ""}
        <div class="row"><div class="kpi"><b>${m.visits}</b><span>Compras</span></div><div class="kpi"><b>${pend.length}</b><span>Premios por usar</span></div></div>
      </div>`;
  }

  function catalogoHtml() {
    const cats = ["Todos", ...new Set(PRODUCTOS.map((p) => p.c))];
    const lista = PRODUCTOS.filter((p) => S.filtro === "Todos" || p.c === S.filtro);
    return `<div class="sec-h"><div><span class="k">PRODUCTOS</span><h2 class="h">Catálogo</h2></div></div>
      <div class="filters">${cats.map((c) => `<button data-f="${c}" class="${S.filtro === c ? "on" : ""}">${c}</button>`).join("")}</div>
      <div class="cat">${lista.map((p) => `
        <article class="prod fade"><div class="ph ${p.dk ? "dk" : ""}"><img src="assets/img/${p.img}.webp" alt="${esc(p.n)}" loading="lazy"></div>
          <div class="inf"><b>${esc(p.n)}</b><span class="pr">${p.c}</span>
          <a href="${waLink(`Hola MM, quiero información de: ${p.n}`)}" target="_blank" rel="noopener">${IC.wa}Preguntar precio</a></div></article>`).join("")}</div>
      <a class="btn dark block" style="margin-top:12px" target="_blank" rel="noopener" href="${NEG.catalogo || waLink("Hola MM, quiero ver el catálogo completo")}">${IC.cat}Ver catálogo completo</a>`;
  }

  function ubicacionHtml() {
    return `<div class="sec-h"><div><span class="k">VISÍTANOS</span><h2 class="h">Ubicación</h2></div></div>
      <div class="box stack">
        <div class="inf-row">${IC.pin}<span>${esc(NEG.direccion)}</span></div>
        <div class="inf-row">${IC.clock}<span>${esc(NEG.horario)}</span></div>
        <div class="row"><a class="btn gold" href="${NEG.maps}" target="_blank" rel="noopener">${IC.pin}Cómo llegar</a><a class="btn dark" href="${waLink("Hola MM, ¿tienen disponible...?")}" target="_blank" rel="noopener">${IC.wa}Escribir</a></div>
      </div>`;
  }

  function enlazarCliente() {
    const f = document.getElementById("fJoin");
    if (f) f.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("jn").value.trim().replace(/\s+/g, " ");
      if (!name) return;
      if (!document.getElementById("jc").checked) { toast("Acepta unirte al Club para girar"); return; }
      S.me = { id: String(S.base.miembros + 1).padStart(4, "0"), name, phone: document.getElementById("jt").value.trim(), bmonth: +document.getElementById("jb").value,
               stamps: 0, visits: 0, last: hoy(), joined: hoy(), premios: [] };
      S.base.miembros++;
      render();
      notificar(`Bienvenido al Club MM, ${n1(name)}. Gira tu ruleta.`);
      setTimeout(girar, 650);
    };
    const g = document.getElementById("bGirar"); if (g && S.me) g.onclick = girar;
    const rg = document.getElementById("bReGirar"); if (rg) rg.onclick = () => { S.me.ultimoGiro = 0; render(); setTimeout(girar, 200); };
    $app.querySelectorAll("[data-f]").forEach((b) => (b.onclick = () => { S.filtro = b.dataset.f; const sec = document.getElementById("catalogo"); sec.innerHTML = catalogoHtml(); enlazarCliente(); guardar(); }));
    document.getElementById("bTienda").onclick = () => { S.vista = "tienda"; render(); scrollTo(0, 0); };
  }

  // ====== tienda ======
  function vistaPin() {
    $app.innerHTML = `<div class="pin fade" id="pinBox">
        <img src="assets/simbolo.webp" alt="">
        <h2 class="h" style="margin-top:14px;font-size:22px">Panel de la tienda</h2>
        <p class="mut">Ingresa el PIN</p>
        <div class="dots">${[0, 1, 2, 3].map((i) => `<i class="${i < pinTxt.length ? "f" : ""}"></i>`).join("")}</div>
        <div class="pad">${["1","2","3","4","5","6","7","8","9","x","0","<"].map((k) => k === "x" ? `<button data-k="x" style="font-size:13px">Volver</button>` : `<button data-k="${k}">${k === "<" ? "&larr;" : k}</button>`).join("")}</div>
        <p class="mut" style="margin-top:22px">PIN de la demo: <b>${PIN}</b></p>
      </div>`;
    $app.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => {
      const k = b.dataset.k;
      if (k === "x") { pinTxt = ""; S.vista = "cliente"; render(); return; }
      pinTxt = k === "<" ? pinTxt.slice(0, -1) : (pinTxt + k).slice(0, 4);
      if (pinTxt.length === 4) {
        if (pinTxt === PIN) { pinTxt = ""; S.unlocked = true; render(); return; }
        vistaPin(); document.getElementById("pinBox").classList.add("err"); setTimeout(() => { pinTxt = ""; vistaPin(); }, 450); return;
      }
      vistaPin();
    }));
  }

  function panel() {
    const tabs = [["escanear", "Escanear", IC.scan], ["ruleta", "Ruleta", IC.wheel], ["clientes", "Clientes", IC.users], ["promos", "Promos", IC.mega]];
    $app.innerHTML = `<div class="fade">
      <div class="panel-top"><img src="assets/simbolo.webp" alt="">
        <div style="flex:1"><h2 class="h" style="font-size:20px">Panel MM</h2><span class="mut">${new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</span></div>
        <button class="btn ghost" id="bVer" style="padding:8px 12px;font-size:13px">Ver página</button></div>
      <div class="tabs">${tabs.map(([k, t, ic]) => `<button data-t="${k}" class="${S.tab === k ? "on" : ""}">${ic}${t}</button>`).join("")}</div>
      <div id="tb" style="margin-top:16px"></div></div>`;
    $app.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => { S.tab = b.dataset.t; escaneado = false; render(); }));
    document.getElementById("bVer").onclick = () => { S.vista = "cliente"; S.unlocked = false; render(); scrollTo(0, 0); };
    ({ escanear: tEscanear, ruleta: tRuleta, clientes: tClientes, promos: tPromos })[S.tab]();
  }

  function tEscanear() {
    const $b = document.getElementById("tb"), m = S.me;
    if (!m) {
      $b.innerHTML = `<div class="box stack"><p><b>Aún no hay un cliente en la demo.</b></p><p class="mut">Abre la página, gira la ruleta con tus datos y vuelve aquí para escanear su tarjeta.</p><button class="btn gold block" id="bIr">Ir a la página del cliente</button></div>`;
      document.getElementById("bIr").onclick = () => { S.vista = "cliente"; S.unlocked = false; render(); };
      return;
    }
    if (!escaneado) {
      $b.innerHTML = `<div class="stack"><div class="scan"><div class="q">${qrSvg("CLUBMM-" + m.id)}</div><div class="laser"></div></div>
        <button class="btn gold block" id="bScan">${IC.scan}Escanear tarjeta del cliente</button>
        <p class="mut" style="text-align:center">En la tienda se usa la cámara del celular o de la tablet de caja.</p></div>`;
      document.getElementById("bScan").onclick = () => {
        const sc = $b.querySelector(".scan"), ok = document.createElement("div"); ok.className = "ok"; ok.innerHTML = IC.check; sc.appendChild(ok);
        if (navigator.vibrate) navigator.vibrate(40);
        setTimeout(() => { escaneado = true; tEscanear(); }, 650);
      };
      return;
    }
    const lleno = m.stamps >= META, pend = pendientes(m), doble = pend.find((p) => p.i === 3);
    $b.innerHTML = `<div class="stack fade">
      <div class="box" style="display:flex;gap:12px;align-items:center"><span class="stamp on" style="width:50px;font-weight:800">${ini(m.name)}</span>
        <div style="flex:1;min-width:0"><b>${esc(m.name)}</b><div class="mut">N° ${m.id} · ${m.visits} ${m.visits === 1 ? "compra" : "compras"}</div></div><span class="pill">${Math.min(m.stamps, META)}/${META}</span></div>
      <div class="mcard" style="padding:14px"><div class="stamps" style="margin-top:0">${sellos(Math.min(m.stamps, META))}</div></div>
      ${lleno ? `<button class="btn green block" id="bRegalo">${IC.gift}Entregar ${REGALO.toLowerCase()}</button>`
              : `<button class="btn gold block" id="bSello" style="padding:18px">${IC.bag}Registrar compra ${doble ? "(sello doble)" : "(+1 sello)"}</button>`}
      ${pend.length ? `<div><p class="mut" style="font-weight:700;margin-bottom:8px">Premios de ruleta por canjear</p><div class="mylist">${pend.map((p) => `
        <div class="mi"><div style="flex:1;min-width:0"><b style="font-size:13.5px">${esc(PREMIOS[p.i].full)}</b><div class="c">${p.code}</div></div><button class="btn gold" data-c="${p.code}" style="padding:8px 12px;font-size:12px">Canjear</button></div>`).join("")}</div></div>` : ""}
      <div class="row"><button class="btn dark" id="bLlenar" ${lleno ? "disabled" : ""}>Llenar tarjeta (demo)</button><button class="btn ghost" id="bOtro">Escanear otro</button></div>
    </div>`;
    const bs = document.getElementById("bSello");
    if (bs) bs.onclick = () => {
      const n = doble ? 2 : 1; if (doble) doble.usado = true;
      popAt = m.stamps; m.stamps = Math.min(META, m.stamps + n); m.visits++; m.last = hoy(); S.base.ventasClub += 85000;
      render(); const f = META - m.stamps;
      if (f <= 0) { confeti(); setTimeout(() => notificar(`Completaste tu tarjeta, ${n1(m.name)}. Tu ${REGALO.toLowerCase()} te espera.`), 300); }
      else setTimeout(() => notificar(`${doble ? "Sello doble" : "Sello"} agregado. Llevas ${m.stamps} de ${META}.`), 300);
    };
    const br = document.getElementById("bRegalo");
    if (br) br.onclick = () => { m.stamps = 0; m.visits++; S.base.canjes++; confeti(); toast("Regalo entregado"); render(); setTimeout(() => notificar(`Disfruta tu regalo, ${n1(m.name)}. Tu nueva tarjeta ya empezó.`), 400); };
    $b.querySelectorAll("[data-c]").forEach((b) => (b.onclick = () => {
      const p = m.premios.find((x) => x.code === b.dataset.c); p.usado = true; S.base.canjes++;
      toast("Premio canjeado"); render(); setTimeout(() => notificar(`Usaste tu premio: ${PREMIOS[p.i].full}. Gracias por comprar en MM.`), 400);
    }));
    document.getElementById("bLlenar").onclick = () => { m.stamps = META - 1; popAt = META - 1; m.stamps = META; confeti(); render(); setTimeout(() => notificar(`Completaste tu tarjeta, ${n1(m.name)}. Tu ${REGALO.toLowerCase()} te espera.`), 300); };
    document.getElementById("bOtro").onclick = () => { escaneado = false; tEscanear(); };
  }

  function tRuleta() {
    const $b = document.getElementById("tb"), tot = S.dist.reduce((a, b) => a + b, 0), max = Math.max(...S.dist);
    const pesoTot = PREMIOS.reduce((a, p) => a + p.w, 0);
    $b.innerHTML = `<div class="stack fade">
      <div class="kpis"><div class="kpi"><b>${S.base.giros}</b><span>Giros de ruleta</span></div><div class="kpi"><b>${S.base.canjes}</b><span>Premios canjeados en tienda</span></div>
        <div class="kpi"><b>${Math.round(S.base.canjes / S.base.giros * 100)}%</b><span>Volvieron a comprar</span></div><div class="kpi"><b>${S.base.miembros}</b><span>Datos de clientes captados</span></div></div>
      <div class="box stack"><b>Validar código de premio</b>
        <div class="row"><input class="inp" id="cIn" placeholder="MM-XXXX" style="text-transform:uppercase"><button class="btn gold" id="cBtn" style="flex:0 0 auto">Validar</button></div>
        <p class="mut" id="cRes">Escribe el código que muestra el cliente o escanea su QR.</p></div>
      <div class="box"><b>Premios que salen</b><p class="mut" style="margin-bottom:10px">Tú decides la probabilidad de cada premio.</p>
        ${PREMIOS.map((p, i) => `<div style="margin-top:12px"><div style="display:flex;justify-content:space-between;font-size:13.5px"><span>${esc(p.full)}</span><span class="mut">${Math.round(p.w / pesoTot * 100)}% · ${S.dist[i]} veces</span></div><div class="bar"><i style="width:${S.dist[i] / max * 100}%"></i></div></div>`).join("")}
      </div></div>`;
    document.getElementById("cBtn").onclick = () => {
      const c = document.getElementById("cIn").value.trim().toUpperCase(), r = document.getElementById("cRes");
      const p = S.me && (S.me.premios || []).find((x) => x.code === c);
      if (!p) { r.innerHTML = `<span class="pill red" style="margin:0">No existe</span> Revisa el código.`; return; }
      if (p.usado) { r.innerHTML = `<span class="pill off" style="margin:0">Ya usado</span> Este premio ya se canjeó.`; return; }
      p.usado = true; S.base.canjes++; guardar();
      r.innerHTML = `<span class="pill ok" style="margin:0">Válido</span> ${esc(PREMIOS[p.i].full)} para ${esc(S.me.name)}. Canjeado.`;
      toast("Premio canjeado");
    };
  }

  function tClientes() {
    const $b = document.getElementById("tb");
    const lista = S.me ? [{ ...S.me, yo: true }, ...S.members] : S.members;
    const inact = lista.filter((m) => dias(m.last) >= 30).sort((a, b) => a.last - b.last);
    const mes = new Date().getMonth() + 1, cumple = lista.filter((m) => m.bmonth === mes);
    const fmt = (v) => "$" + v.toLocaleString("es-CO");
    $b.innerHTML = `<div class="stack fade">
      <div class="kpis"><div class="kpi"><b>${S.base.miembros}</b><span>Miembros del club</span></div><div class="kpi"><b>71%</b><span>Clientes que volvieron</span></div>
        <div class="kpi" style="grid-column:span 2"><b class="gold-t">${fmt(S.base.ventasClub)}</b><span>Ventas de miembros del club este mes</span></div></div>
      <div><h3 class="h" style="font-size:16px;margin-bottom:8px">No han vuelto (30+ días)</h3><div class="mylist">${inact.map((m) => `
        <div class="mi"><span class="stamp on" style="width:36px;font-size:12px;font-weight:800">${ini(m.name)}</span><div style="flex:1;min-width:0"><b style="font-size:13.5px">${esc(m.name)}</b><div class="mut" style="font-size:12px">${dias(m.last)} días sin comprar</div></div>
        <button class="btn ${S.recordados.includes(m.id) ? "dark" : "gold"}" data-r="${m.id}" style="padding:8px 10px;font-size:12px" ${S.recordados.includes(m.id) ? "disabled" : ""}>${S.recordados.includes(m.id) ? "Enviado" : "Regalar giro"}</button></div>`).join("")}</div>
        <p class="mut" style="margin-top:6px">Les llega un giro extra de ruleta para que vuelvan.</p></div>
      ${cumple.length ? `<div><h3 class="h" style="font-size:16px;margin-bottom:8px">Cumplen años este mes</h3><div class="mylist">${cumple.map((m) => `<div class="mi"><span style="color:var(--g1)">${IC.cake}</span><b style="font-size:13.5px;flex:1">${esc(m.name)}${m.yo ? " (demo)" : ""}</b><span class="pill">Regalo</span></div>`).join("")}</div></div>` : ""}
      <div><h3 class="h" style="font-size:16px;margin-bottom:8px">Miembros recientes</h3><div class="mylist">${lista.slice().sort((a, b) => b.last - a.last).map((m) => `
        <div class="mi"><span class="stamp on" style="width:36px;font-size:12px;font-weight:800">${ini(m.name)}</span><div style="flex:1;min-width:0"><b style="font-size:13.5px">${esc(m.name)}${m.yo ? " · demo" : ""}</b><div class="mut" style="font-size:12px">Última compra: ${dias(m.last) === 0 ? "hoy" : `hace ${dias(m.last)} días`}</div></div><span class="pill">${Math.min(m.stamps, META)}/${META}</span></div>`).join("")}</div></div>
    </div>`;
    $b.querySelectorAll("[data-r]").forEach((x) => (x.onclick = () => { const m = lista.find((y) => y.id === x.dataset.r); S.recordados.push(m.id); toast(`Giro enviado a ${n1(m.name)}`); render(); }));
  }

  const PLANT = [
    "Llegaron las nuevas fundas MagSafe. Esta semana tu giro de ruleta es doble",
    "Solo hoy: 15% en audífonos para miembros del Club MM",
    "Te extrañamos. Tienes un giro de ruleta esperándote en la tienda",
    "Es tu mes de cumpleaños: pasa por tu regalo",
  ];
  function tPromos() {
    const $b = document.getElementById("tb");
    $b.innerHTML = `<div class="stack fade"><div class="box stack">
        <div><label class="f" for="pT">Mensaje para tus clientes</label><textarea class="inp" id="pT" maxlength="140" placeholder="Escribe tu promoción"></textarea></div>
        <div class="tpl">${PLANT.map((p, i) => `<button data-p="${i}">${esc(p.slice(0, 28))}...</button>`).join("")}</div>
        <div><label class="f" for="pA">¿A quién?</label><select class="inp" id="pA"><option value="t">Todos los miembros (${S.base.miembros})</option><option value="i">Los que no han vuelto (37)</option><option value="c">Cumpleañeros del mes (14)</option></select></div>
        <button class="btn gold block" id="pE">${IC.mega}Enviar notificación</button>
        <p class="mut">Les llega al celular sin pagar mensajes masivos.</p></div>
      ${S.promos.length ? `<div class="mylist">${S.promos.slice().reverse().map((p) => `<div class="mi"><div style="flex:1;min-width:0"><b style="font-size:13.5px">${esc(p.txt)}</b><div class="mut" style="font-size:12px">${p.n} miembros · ${new Date(p.t).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</div></div><span class="pill ok">Entregada</span></div>`).join("")}</div>` : ""}
      <button class="btn ghost block" id="bReset">Reiniciar demo</button></div>`;
    const t = document.getElementById("pT");
    $b.querySelectorAll("[data-p]").forEach((c) => (c.onclick = () => { t.value = PLANT[+c.dataset.p]; }));
    document.getElementById("pE").onclick = () => {
      const x = t.value.trim(); if (!x) { toast("Escribe o elige un mensaje"); return; }
      const a = document.getElementById("pA").value, n = a === "t" ? S.base.miembros : a === "i" ? 37 : 14;
      S.promos.push({ txt: x, n, t: hoy() }); render(); toast(`Enviada a ${n} miembros`); setTimeout(() => notificar(x), 900);
    };
    document.getElementById("bReset").onclick = () => { try { localStorage.removeItem(KEY); } catch {} S = nuevo(); escaneado = false; render(); toast("Demo reiniciada"); };
  }

  render();
})();
