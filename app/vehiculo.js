/* Carpeta Vial — página de un vehículo (tarjeta NFC/QR para carros y motos) — LEGION Studio Digital
   Público: foto, placa, vehículo, vencimientos, emergencia y botones. Los documentos solo se abren con el PIN del dueño.
   Tarjeta nueva (datos.estado = "por_activar"): pide el PIN de activación (2222) y abre el paso a paso del dueño:
   vehículo + foto, vencimientos, emergencia, documentos (PDF o fotos que se convierten en PDF) y PIN personal. */
window.LEGION_VEHICULO = function (N, raiz) {
  const V = N.vehiculo || {};
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  if (!document.getElementById("vx-css")) document.head.appendChild(Object.assign(document.createElement("link"), { id: "vx-css", rel: "stylesheet", href: "/app/vial.css?v=4" }));

  const SVG = {
    candado: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    escudo: '<path d="M12 3 4.5 6v5.5c0 4.8 3.2 8 7.5 9.5 4.3-1.5 7.5-4.7 7.5-9.5V6L12 3Z"/>',
    alerta: '<path d="M12 4 3 19.5h18L12 4Z"/><path d="M12 10v4.2M12 17v.3"/>',
    tel: '<path d="M6 3.5h3.2l1.6 4.3-2.2 1.4a11 11 0 0 0 6.2 6.2l1.4-2.2 4.3 1.6V18a2.5 2.5 0 0 1-2.5 2.5A16.5 16.5 0 0 1 3.5 6 2.5 2.5 0 0 1 6 3.5Z"/>',
    doc: '<path d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v4h4M9.5 12.5h5M9.5 16h5"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    flecha: '<path d="M5 12h13M13 7l5 5-5 5"/>',
    atras: '<path d="M19 12H6M11 7l-5 5 5 5"/>',
    calendario: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    camara: '<path d="M4 8.5h3l1.8-2.5h6.4L17 8.5h3v10.5H4V8.5Z"/><circle cx="12" cy="13.5" r="3.3"/>',
    subir: '<path d="M12 15.5V4.5M7.5 9 12 4.5 16.5 9"/><path d="M4.5 14.5v4a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-4"/>',
    ok: '<path d="m5.5 12.5 4 4 9-9.5"/>',
    mas: '<path d="M12 5.5v13M5.5 12h13"/>',
    ojo: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>',
    basura: '<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13"/>',
    lapiz: '<path d="M4.5 19.5h3.8L19 8.8 15.2 5 4.5 15.7v3.8Z"/>',
    nfc: '<path d="M7 7.5a6.5 6.5 0 0 1 0 9M10.5 5a10 10 0 0 1 0 14M14 3a13.5 13.5 0 0 1 0 18"/>',
    reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    imagen: '<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m4.5 18 5-5 3.5 3.5 2.5-2.5 4 4"/>'
  };
  const ic = (n, c = "vx-i") => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[n] || SVG.flecha}</svg>`;

  document.title = V.placa ? `${V.placa} · Carpeta Vial` : "Carpeta Vial";
  document.body.classList.add("vial", "vx");
  const TEMAS = {
    negro: { t: "Oro", c: "#F5B942", bg: "#0A0B0D", ct: "#0A0B0D" },
    azul: { t: "Azul", c: "#3E9BFF", bg: "#050A14", ct: "#fff" },
    rojo: { t: "Rojo", c: "#FF3B3B", bg: "#100506", ct: "#fff" },
    verde: { t: "Verde", c: "#2FD07A", bg: "#04100A", ct: "#04100A" },
    morado: { t: "Morado", c: "#A47BFF", bg: "#0B0716", ct: "#fff" },
    naranja: { t: "Naranja", c: "#FF8A1F", bg: "#120903", ct: "#120903" },
    plata: { t: "Plata", c: "#D7DCE3", bg: "#0B0C0F", ct: "#0B0C0F" }
  };
  const FONDOS = { monaco: "Mónaco", garage: "Garaje", neon: "Neón", racing: "Racing", ruta: "En ruta", clasica: "Clásica", urbano: "Urbano", moto: "Calle" };
  const fondoUrl = (f, foto, moto) => f === "mia" && foto ? foto : FONDOS[f] ? `/app/img/vf-${f}.webp` : foto || `/app/img/vial-hero-${moto ? "moto" : "carro"}.webp`;
  const ponerTema = (k) => {
    const T = TEMAS[k] || TEMAS.negro, r = document.body;
    r.style.setProperty("--c", T.c); r.style.setProperty("--bg", T.bg); r.style.setProperty("--ct", T.ct);
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = T.bg;
  };
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = "#0A0B0D";

  const ACTIVAR = N.estado === "por_activar";
  const esMoto = V.clase === "moto";
  const FOTO = fondoUrl(V.fondo, V.foto, esMoto);
  ponerTema(V.tema);
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const fmt = (d) => d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" }).replace(".", "");
  const estados = (V.vence || []).filter((v) => v.doc && v.fecha).map((v) => {
    const f = new Date(v.fecha + "T00:00:00"), dias = Math.round((f - hoy) / 864e5);
    const e = dias < 0 ? "vencido" : dias <= 30 ? "pronto" : "ok";
    const txt = dias < 0 ? "Vencido" : dias === 0 ? "Vence hoy" : dias <= 30 ? `${dias} día${dias === 1 ? "" : "s"}` : "Vigente";
    return { ...v, e, txt, f: fmt(f) };
  });
  const alertas = estados.filter((e) => e.e !== "ok").length;
  const P = N.patrocinador;
  const em = V.emergencia;
  const fmtPlaca = (p) => { p = String(p || "").toUpperCase(); return p.length === 6 ? p.slice(0, 3) + " " + p.slice(3) : p; };
  const placaFmt = fmtPlaca(V.placa);
  const placaHTML = (p, ciudad, moto, cls = "") => `<div class="vx-placa ${moto ? "moto" : ""} ${cls}"><span>${esc(fmtPlaca(p) || "ABC 123")}</span><small>${esc((ciudad || "COLOMBIA").toUpperCase())}</small></div>`;
  const marca = `<div class="vx-marca">${ic("escudo")}<span>CARPETA VIAL</span></div>`;

  /* ---------- Pantallas ---------- */
  const htmlActivar = () => `
    <section class="vx-hero vx-hero-full" style="--foto:url('${esc(FOTO)}')">
      <header class="vx-top">${marca}<span class="vx-nfc">${ic("nfc")} NFC</span></header>
      <div class="vx-hero-txt">
        <span class="vx-estado"><i></i>Tarjeta sin activar</span>
        <h1>Tus papeles,<br>siempre contigo.</h1>
        <p>Activa tu tarjeta y ten el SOAT, la licencia y la tarjeta de propiedad a un toque.</p>
        <button type="button" class="vx-btn" id="activar">Activar tarjeta ${ic("flecha")}</button>
        <small class="vx-nota">Necesitas el PIN de activación que viene con tu tarjeta.</small>
      </div>
    </section>
    <section class="vx-cuerpo">
      <ul class="vx-ventajas">
        <li>${ic("candado")}<div><b>Documentos protegidos</b><span>Solo se abren con tu PIN personal.</span></div></li>
        <li>${ic("reloj")}<div><b>Alertas de vencimiento</b><span>Ves de un vistazo qué está por vencer.</span></div></li>
        <li>${ic("tel")}<div><b>Contacto de emergencia</b><span>Quien te ayude lo llama con un toque.</span></div></li>
      </ul>
      <p class="vx-pie">LEGION Studio Digital</p>
    </section>`;

  const htmlTarjeta = () => `
    <section class="vx-hero" style="--foto:url('${esc(FOTO)}')">
      <header class="vx-top">${marca}${P && P.logo ? `<img class="vx-pat" src="${esc(P.logo)}" alt="${esc(P.nombre)}">` : `<span class="vx-nfc">${ic("nfc")} NFC</span>`}</header>
      <div class="vx-hero-txt">
        ${placaHTML(V.placa, V.ciudad && V.ciudad !== "CARPETA VIAL" ? V.ciudad : "", esMoto)}
        <h1>${esc([V.marca, V.linea].filter(Boolean).join(" ") || "Mi vehículo")}</h1>
        <p>${esc([V.modelo, V.color, esMoto ? "Moto" : "Carro"].filter(Boolean).join("  ·  "))}</p>
        ${V.propietario ? `<span class="vx-dueno">Propietario · <b>${esc(V.propietario)}</b></span>` : ""}
      </div>
    </section>
    <section class="vx-cuerpo">
      <div class="vx-acc">
        <button type="button" class="vx-btn" id="ver-docs">${ic("candado")} Ver documentos</button>
        ${em && em.tel ? `<a class="vx-emer" href="tel:+${esc(em.tel)}">${ic("tel")}<div><b>Emergencia · ${esc(em.nombre || "Llamar a mi contacto")}</b><small>${esc([em.relacion, em.rh ? "RH " + em.rh : ""].filter(Boolean).join("  ·  ") || "Contacto de emergencia")}</small></div>${ic("flecha")}</a>` : ""}
      </div>
      ${estados.length ? `
      <div class="vx-bloque">
        <div class="vx-tit"><h2>Vencimientos</h2><span class="vx-chip ${alertas ? "pronto" : "ok"}">${alertas ? `${alertas} por revisar` : "Al día"}</span></div>
        <ul class="vx-lista">${estados.map((e) => `<li class="${e.e}"><div><b>${esc(e.doc)}</b><small>${e.f}</small></div><em><i></i>${e.txt}</em></li>`).join("")}</ul>
      </div>` : ""}
      ${(N.extras || []).filter((b) => b && b.t && b.url).map((b) => `<a class="vx-fila" href="${esc(b.url)}" target="_blank" rel="noopener"><div><b>${esc(b.t)}</b>${b.s ? `<small>${esc(b.s)}</small>` : ""}</div>${ic("flecha")}</a>`).join("")}
      ${P ? `<a class="vx-patro" ${P.url ? `href="${esc(P.url)}" target="_blank" rel="noopener"` : ""}>${P.logo ? `<img src="${esc(P.logo)}" alt="">` : ""}<div><small>Tarjeta cortesía de</small><b>${esc(P.nombre)}</b></div></a>` : ""}
      <p class="vx-legal">Copia de consulta. No reemplaza los documentos originales; las autoridades los verifican en el RUNT.</p>
      <button type="button" class="vx-link" id="editar">${ic("lapiz")} Editar mi carpeta</button>
      <p class="vx-pie">LEGION Studio Digital</p>
    </section>`;

  raiz.innerHTML = `
  <main class="vx-main">${ACTIVAR ? htmlActivar() : htmlTarjeta()}</main>

  <div class="vx-modal" id="m-pin" role="dialog" aria-modal="true" aria-label="PIN">
    <div class="vx-caja">
      <div class="vx-asa"></div>
      <h3 id="pin-tit"></h3>
      <p id="pin-sub"></p>
      <div class="vx-puntos" id="vx-puntos"></div>
      <p class="vx-err" id="vx-err"></p>
      <div class="vx-tecl" id="vx-tecl">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k) => k === "" ? "<span></span>" : `<button type="button" data-k="${k}">${k === "⌫" ? ic("atras") : k}</button>`).join("")}</div>
      <button type="button" class="vx-btn" id="pin-ok">Continuar</button>
      <button type="button" class="vx-cerrar" data-cerrar>Cancelar</button>
    </div>
  </div>

  <div class="vx-hoja" id="h-docs" role="dialog" aria-modal="true" aria-label="Documentos">
    <div class="vx-hoja-top"><button type="button" class="vx-x" data-cerrar-docs aria-label="Cerrar">${ic("x")}</button><div><small>Documentos</small><b>${esc(placaFmt)}</b></div></div>
    <div class="vx-hoja-cuerpo" id="docs-lista"></div>
  </div>

  <div class="vx-hoja" id="h-conf" role="dialog" aria-modal="true" aria-label="Configurar tarjeta">
    <div class="vx-hoja-top"><button type="button" class="vx-x" id="conf-x" aria-label="Cerrar">${ic("x")}</button><div><small id="conf-paso"></small><b id="conf-tit"></b></div></div>
    <div class="vx-segs" id="conf-segs"></div>
    <div class="vx-hoja-cuerpo" id="conf-cuerpo"></div>
    <div class="vx-pie-btns" id="conf-pie"></div>
  </div>

  <div class="vx-hoja vx-esc" id="h-esc" role="dialog" aria-modal="true" aria-label="Escanear documento">
    <div class="vx-hoja-top"><button type="button" class="vx-x" id="esc-x" aria-label="Cerrar">${ic("x")}</button><div><small>Escanear</small><b id="esc-tit"></b></div></div>
    <div class="vx-hoja-cuerpo" id="esc-cuerpo"></div>
    <div class="vx-pie-btns" id="esc-pie"></div>
  </div>`;

  /* ---------- PIN ---------- */
  const mPin = $("#m-pin"), hDocs = $("#h-docs");
  let escrito = "", modo = "docs";
  const puntos = () => ($("#vx-puntos").innerHTML = Array.from({ length: Math.max(4, escrito.length) }, (_, i) => `<i class="${i < escrito.length ? "on" : ""}"></i>`).join(""));
  const pedirPin = (m) => {
    modo = m; escrito = ""; puntos(); $("#vx-err").textContent = "";
    $("#pin-tit").textContent = m === "activar" ? "PIN de activación" : m === "editar" ? "Editar mi carpeta" : "Documentos";
    $("#pin-sub").textContent = m === "activar" ? "Viene impreso con tu tarjeta." : "Escribe tu PIN personal.";
    mPin.classList.add("abierta");
  };
  $("#ver-docs")?.addEventListener("click", () => pedirPin("docs"));
  $("#editar")?.addEventListener("click", () => pedirPin("editar"));
  $("#activar")?.addEventListener("click", () => pedirPin("activar"));
  mPin.addEventListener("click", (e) => { if (e.target === mPin || e.target.closest("[data-cerrar]")) mPin.classList.remove("abierta"); });
  $("#vx-tecl").addEventListener("click", (e) => {
    const k = e.target.closest("[data-k]")?.dataset.k; if (k === undefined) return;
    $("#vx-err").textContent = "";
    if (k === "⌫") escrito = escrito.slice(0, -1); else if (escrito.length < 6) escrito += k;
    puntos();
    if (escrito.length === 6) abrir();
  });
  $("#pin-ok").addEventListener("click", () => abrir());
  const rpc = async (fn, body) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error("red");
    return r.json();
  };
  const errPin = (j) => { escrito = ""; puntos(); $("#vx-err").textContent = j.error === "bloqueado" ? "Demasiados intentos. Espera 5 minutos." : "PIN incorrecto"; };
  async function abrir() {
    if (escrito.length < 4) return ($("#vx-err").textContent = "El PIN tiene de 4 a 6 números");
    $("#vx-err").textContent = "Verificando…";
    try {
      if (modo === "docs") {
        const j = await rpc("vehiculo_docs", { p_slug: window.SLUG, p_pin: escrito });
        if (!j.ok) return errPin(j);
        mPin.classList.remove("abierta"); mostrar(j.docs || []);
      } else {
        const j = await rpc("vial_sesion", { p_slug: window.SLUG, p_pin: escrito });
        if (!j.ok) return errPin(j);
        mPin.classList.remove("abierta"); asistente(j);
      }
    } catch (err) { $("#vx-err").textContent = "Sin conexión, intenta otra vez"; }
  }
  const esPdf = (u) => /\.pdf($|\?)/i.test(u || "");
  const abrirHoja = (h) => { h.classList.add("abierta"); document.body.style.overflow = "hidden"; };
  const cerrarHoja = (h) => { h.classList.remove("abierta"); if (!document.querySelector(".vx-hoja.abierta")) document.body.style.overflow = ""; };
  function mostrar(docs) {
    $("#docs-lista").innerHTML = docs.length ? `<div class="vx-docs-ver">${docs.map((d) => `
      <a class="vx-doc-ver" href="${esc(d.url)}" target="_blank" rel="noopener">
        <div class="vx-doc-mini">${d.mini || !esPdf(d.url) ? `<img src="${esc(d.mini || d.url)}" alt="" loading="lazy">` : `${ic("doc")}`}</div>
        <div><b>${esc(d.n)}</b><small>${esPdf(d.url) ? `PDF${d.p ? ` · ${d.p} pág.` : ""}` : "Imagen"}</small></div>${ic("ojo")}
      </a>`).join("")}</div>` : `<p class="vx-vacio">Todavía no hay documentos cargados.</p>`;
    abrirHoja(hDocs);
  }
  hDocs.addEventListener("click", (e) => { if (e.target.closest("[data-cerrar-docs]")) cerrarHoja(hDocs); });

  /* ---------- Subidas ---------- */
  let S = null;
  async function subirBlob(blob, ext, mime) {
    const nombre = `${S.token}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
    const r = await fetch(`${SUPABASE_URL}/storage/v1/object/docs/${window.SLUG}/${nombre}`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": mime, "x-upsert": "false" }, body: blob });
    if (!r.ok) throw new Error(r.status === 403 || r.status === 400 ? "Tu sesión venció. Cierra y entra otra vez con tu PIN." : "No se pudo subir. Intenta otra vez.");
    return `${SUPABASE_URL}/storage/v1/object/public/docs/${window.SLUG}/${nombre}`;
  }
  // Foto → canvas reducido (con un poco de contraste para que se lea como escaneado)
  async function lienzo(file, max, realzar) {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const cv = document.createElement("canvas"); cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
    const g = cv.getContext("2d");
    if (realzar) g.filter = "contrast(1.15) brightness(1.05) saturate(.9)";
    g.drawImage(bmp, 0, 0, cv.width, cv.height);
    return cv;
  }
  const aBlob = async (cv, q = 0.8) => {
    let b = await new Promise((ok) => cv.toBlob(ok, "image/webp", q));
    if (!b || b.type !== "image/webp") b = await new Promise((ok) => cv.toBlob(ok, "image/jpeg", q + 0.05));
    return b;
  };
  const miniDe = (cv) => { const k = 360 / Math.max(cv.width, cv.height); const m = document.createElement("canvas"); m.width = Math.round(cv.width * k); m.height = Math.round(cv.height * k); m.getContext("2d").drawImage(cv, 0, 0, m.width, m.height); return m; };
  let jspdfCarga = null;
  const cargarJsPDF = () => jspdfCarga || (jspdfCarga = new Promise((ok, mal) => {
    if (window.jspdf) return ok(window.jspdf.jsPDF);
    const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () => ok(window.jspdf.jsPDF); s.onerror = () => { jspdfCarga = null; mal(new Error("No se pudo preparar el PDF. Revisa tu conexión.")); };
    document.head.appendChild(s);
  }));

  /* ---------- Paso a paso ---------- */
  const TIPOS_DOC = ["SOAT", "Licencia de conducción", "Tarjeta de propiedad", "Revisión técnico-mecánica"];
  const RH = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  function asistente(sesion) {
    S = sesion;
    const hConf = $("#h-conf"), cuerpo = $("#conf-cuerpo"), pie = $("#conf-pie");
    const venceDe = (doc) => ((V.vence || []).find((x) => x.doc === doc) || {}).fecha || "";
    const F = {
      propietario: V.propietario || "", clase: V.clase || "carro", placa: V.placa || "", marca: V.marca || "", linea: V.linea || "",
      modelo: V.modelo || "", color: V.color || "", ciudad: V.ciudad && V.ciudad !== "CARPETA VIAL" ? V.ciudad : "", foto: V.foto || "", tema: V.tema || "negro", fondo: V.fondo || (V.foto ? "mia" : ""),
      soat: venceDe("SOAT"), tecno: venceDe("Revisión técnico-mecánica"), licencia: venceDe("Licencia de conducción"),
      e_nombre: (em && em.nombre) || "", e_relacion: (em && em.relacion) || "", e_tel: em && em.tel ? String(em.tel).replace(/^57/, "") : "", e_rh: (em && em.rh) || "",
      pin1: "", pin2: ""
    };
    let docs = (S.docs || []).map((d) => ({ ...d }));
    const extrasNombres = docs.map((d) => d.n).filter((n) => !TIPOS_DOC.includes(n));
    let ocupado = 0, nuevoOtro = false;
    const PASOS = [
      { id: "vehiculo", t: "Tu vehículo" }, { id: "diseno", t: "Diseño" }, { id: "vence", t: "Vencimientos" }, { id: "emergencia", t: "Emergencia" },
      { id: "docs", t: "Documentos" }, { id: "pin", t: S.activar ? "Tu PIN" : "PIN" }, { id: "listo", t: "Listo" }
    ];
    let paso = 0;
    abrirHoja(hConf);

    const campo = (k, t, o = {}) => `<label class="vx-campo ${o.cls || ""}"><span>${t}${o.op ? "<em>Opcional</em>" : ""}</span>
      <input name="${k}" value="${esc(F[k])}" ${o.tipo ? `type="${o.tipo}"` : ""} ${o.ph ? `placeholder="${esc(o.ph)}"` : ""} ${o.im ? `inputmode="${o.im}"` : ""} ${o.max ? `maxlength="${o.max}"` : ""} ${o.ac ? `autocomplete="${o.ac}"` : 'autocomplete="off"'}></label>`;
    const leer = () => cuerpo.querySelectorAll("input[name]").forEach((i) => (F[i.name] = i.value.trim()));
    const aviso = (t) => { const el = $("#conf-err"); if (el) { el.textContent = t; el.scrollIntoView({ block: "nearest", behavior: "smooth" }); } };

    const tarjetaDoc = (n, i) => {
      const d = docs.find((x) => x.n === n);
      if (!d) return `<div class="vx-dc" data-doc="${esc(n)}">
        <div class="vx-dc-mini vacio">${ic("doc")}</div>
        <div class="vx-dc-txt"><b>${esc(n)}</b><small>Pendiente</small></div>
        <div class="vx-dc-acc">
          <button type="button" data-escanear="${esc(n)}">${ic("camara")}<span>Escanear</span></button>
          <label>${ic("subir")}<span>PDF</span><input type="file" accept="application/pdf,image/*" data-subir="${esc(n)}" hidden></label>
        </div></div>`;
      return `<div class="vx-dc lleno" data-doc="${esc(n)}">
        <div class="vx-dc-mini">${d.mini || !esPdf(d.url) ? `<img src="${esc(d.mini || d.url)}" alt="">` : ic("doc")}</div>
        <div class="vx-dc-txt"><b>${esc(n)}</b><small>${ic("ok")} ${esPdf(d.url) ? `PDF${d.p ? ` · ${d.p} pág.` : ""}` : "Imagen"}</small></div>
        <div class="vx-dc-acc">
          <a href="${esc(d.url)}" target="_blank" rel="noopener" aria-label="Ver">${ic("ojo")}</a>
          <button type="button" data-quitar="${esc(n)}" aria-label="Quitar">${ic("basura")}</button>
        </div></div>`;
    };

    function pintar() {
      const p = PASOS[paso].id, nPasos = PASOS.length - 1;
      $("#conf-paso").textContent = p === "listo" ? (S.activar ? "Activación completa" : "Cambios guardados") : `Paso ${paso + 1} de ${nPasos}`;
      $("#conf-tit").textContent = p === "listo" ? "Todo listo" : PASOS[paso].t;
      $("#conf-segs").innerHTML = PASOS.slice(0, nPasos).map((_, i) => `<i class="${i < paso ? "hecho" : i === paso ? "actual" : ""}"></i>`).join("");
      $("#conf-segs").hidden = p === "listo";
      let h = "";
      if (p === "vehiculo") h = `
        ${S.activar && paso === 0 ? `<div class="vx-ok-act">${ic("ok")} PIN correcto. Configuremos tu tarjeta.</div>` : ""}
        <h3 class="vx-h">¿A nombre de quién queda la tarjeta?</h3>
        ${campo("propietario", "Nombre del propietario", { ph: "Nombre y apellido", max: 60, ac: "name" })}
        <div class="vx-campo"><span>Tipo de vehículo</span><div class="vx-tipos">
          ${["carro", "moto"].map((c) => `<button type="button" data-clase="${c}" class="${F.clase === c ? "on" : ""}" style="--t:url('/app/img/vial-tile-${c}.webp')"><span>${c === "carro" ? "Carro" : "Moto"}</span><i>${ic("ok")}</i></button>`).join("")}
        </div></div>
        <div class="vx-campo"><span>Placa</span><label class="vx-placa vx-placa-in ${F.clase === "moto" ? "moto" : ""}"><input name="placa" value="${esc(fmtPlaca(F.placa))}" placeholder="ABC 123" maxlength="8" autocomplete="off" autocapitalize="characters"><small id="placa-ciudad">${esc((F.ciudad || "COLOMBIA").toUpperCase())}</small></label></div>
        <div class="vx-dos">${campo("marca", "Marca", { ph: "Mazda", max: 30 })}${campo("linea", "Línea", { ph: "BT-50", max: 40 })}</div>
        <div class="vx-dos">${campo("modelo", "Modelo", { ph: "2024", im: "numeric", max: 4 })}${campo("color", "Color", { ph: "Negro", max: 30 })}</div>
        ${campo("ciudad", "Ciudad de matrícula", { ph: "Bogotá", max: 30, op: 1 })}
        <p class="vx-err" id="conf-err"></p>`;
      if (p === "diseno") {
        const fd = F.fondo || (F.clase === "moto" ? "ruta" : "monaco");
        const lista = F.clase === "moto" ? ["ruta", "racing", "clasica", "moto", "neon", "garage", "monaco", "urbano"] : ["monaco", "garage", "neon", "urbano", "racing", "ruta", "clasica", "moto"];
        h = `<h3 class="vx-h">Dale tu estilo</h3><p class="vx-s">Escoge el color y el fondo. Así se verá tu tarjeta cuando alguien la escanee.</p>
        <div class="vx-prev" style="--foto:url('${esc(fondoUrl(fd, F.foto, F.clase === "moto"))}')">
          <span class="vx-prev-marca">${ic("escudo")} CARPETA VIAL</span>
          ${placaHTML(F.placa, F.ciudad, F.clase === "moto")}
          <b>${esc([F.marca, F.linea].filter(Boolean).join(" ") || "Tu vehículo")}</b>
          <i class="vx-prev-btn">${ic("candado")} Ver documentos</i>
        </div>
        <div class="vx-campo"><span>Color</span><div class="vx-temas">
          ${Object.entries(TEMAS).map(([k, T]) => `<button type="button" data-tema="${k}" class="${F.tema === k ? "on" : ""}" style="--tc:${T.c};--tb:${T.bg}" aria-label="${T.t}"><i></i><span>${T.t}</span></button>`).join("")}
        </div></div>
        <div class="vx-campo"><span>Fondo</span><div class="vx-fondos">
          <label class="vx-fondo mia ${fd === "mia" ? "on" : ""}" style="${F.foto ? `--t:url('${esc(F.foto)}')` : ""}" data-fondo="mia">
            ${F.foto ? "" : ic("camara")}<span>${F.foto ? "Mi foto" : "Subir mi foto"}</span><input type="file" accept="image/*" id="foto-veh" hidden></label>
          ${lista.map((k) => `<button type="button" class="vx-fondo ${fd === k ? "on" : ""}" data-fondo="${k}" style="--t:url('/app/img/vf-${k}-t.webp')"><span>${FONDOS[k]}</span></button>`).join("")}
        </div>${F.foto ? `<label class="vx-link vx-cambiar-foto">${ic("camara")} Cambiar mi foto<input type="file" accept="image/*" id="foto-veh2" hidden></label>` : ""}</div>
        <p class="vx-err" id="conf-err"></p>`;
      }
      if (p === "vence") h = `<h3 class="vx-h">¿Cuándo se vencen tus documentos?</h3><p class="vx-s">La tarjeta muestra si algo está por vencer. Deja en blanco lo que no tengas a la mano.</p>
        <div class="vx-fechas">
          ${[["soat", "SOAT"], ["tecno", "Revisión técnico-mecánica"], ["licencia", "Licencia de conducción"]].map(([k, t]) => `<label class="vx-fecha">${ic("calendario")}<span>${t}</span><input type="date" name="${k}" value="${esc(F[k])}"></label>`).join("")}
        </div><p class="vx-err" id="conf-err"></p>`;
      if (p === "emergencia") h = `<h3 class="vx-h">Contacto de emergencia</h3><p class="vx-s">Si te pasa algo en la vía, quien escanee la tarjeta lo puede llamar con un toque.</p>
        ${campo("e_nombre", "Nombre", { ph: "Laura Gómez", max: 40, op: 1 })}
        <div class="vx-dos">${campo("e_relacion", "Parentesco", { ph: "Esposa", max: 30, op: 1 })}${campo("e_tel", "Celular", { ph: "300 123 4567", im: "tel", max: 15, op: 1 })}</div>
        <div class="vx-campo"><span>Tu tipo de sangre<em>Opcional</em></span><div class="vx-rh">${RH.map((r) => `<button type="button" data-rh="${r}" class="${F.e_rh === r ? "on" : ""}">${r}</button>`).join("")}</div></div>
        <p class="vx-err" id="conf-err"></p>`;
      if (p === "docs") {
        const nombres = [...TIPOS_DOC, ...extrasNombres.filter((n) => !TIPOS_DOC.includes(n))];
        h = `<h3 class="vx-h">Carga tus documentos</h3><p class="vx-s">Escanéalos con la cámara —se guardan en PDF— o sube el PDF que ya tengas. Solo se abren con tu PIN.</p>
          <div class="vx-dcs">${nombres.map(tarjetaDoc).join("")}</div>
          ${nuevoOtro ? `<div class="vx-otro"><input id="otro-n" placeholder="Nombre del documento (ej.: Póliza todo riesgo)" maxlength="40"><button type="button" class="vx-btn sec" id="otro-ok">Agregar</button></div>`
            : `<button type="button" class="vx-mas" id="otro">${ic("mas")} Agregar otro documento</button>`}
          <p class="vx-err" id="conf-err"></p>`;
      }
      if (p === "pin") h = `<h3 class="vx-h">${S.activar ? "Crea tu PIN personal" : "Cambiar PIN"}</h3>
        <p class="vx-s">${S.activar ? "Con este PIN abres tus documentos y editas la carpeta. El PIN de activación deja de funcionar." : "Déjalo en blanco para seguir con tu PIN actual."}</p>
        ${campo("pin1", "PIN nuevo · 4 a 6 números", { tipo: "password", im: "numeric", max: 6, cls: "vx-pin", ac: "new-password" })}
        ${campo("pin2", "Confirma el PIN", { tipo: "password", im: "numeric", max: 6, cls: "vx-pin", ac: "new-password" })}
        <p class="vx-err" id="conf-err"></p>`;
      if (p === "listo") h = `
        <div class="vx-fin">
          <div class="vx-fin-card" style="--foto:url('${esc(fondoUrl(F.fondo || (F.clase === "moto" ? "ruta" : "monaco"), F.foto, F.clase === "moto"))}')">
            ${placaHTML(F.placa, F.ciudad, F.clase === "moto")}
            <b>${esc([F.marca, F.linea].filter(Boolean).join(" "))}</b><small>${esc(F.propietario)}</small>
          </div>
          <h3>${S.activar ? "Tu tarjeta quedó activada" : "Cambios guardados"}</h3>
          <p>Al acercar el celular o escanear el QR se ven tu vehículo, los vencimientos y el contacto de emergencia. Los documentos se abren con tu PIN.</p>
        </div>`;
      cuerpo.innerHTML = h; cuerpo.scrollTop = 0;
      pie.innerHTML = p === "listo" ? `<button type="button" class="vx-btn" id="w-fin">Ver mi tarjeta</button>` :
        `${paso > 0 ? `<button type="button" class="vx-btn sec cuad" id="w-atras" aria-label="Atrás">${ic("atras")}</button>` : ""}
         <button type="button" class="vx-btn" id="w-sig">${p === "pin" ? (S.activar ? "Activar tarjeta" : "Guardar cambios") : "Continuar"}</button>`;
    }

    async function guardar() {
      const vence = [["SOAT", F.soat], ["Revisión técnico-mecánica", F.tecno], ["Licencia de conducción", F.licencia]].filter((x) => x[1]).map(([doc, fecha]) => ({ doc, fecha }));
      const tel = F.e_tel.replace(/\D/g, "");
      const v = { propietario: F.propietario, clase: F.clase, placa: F.placa, marca: F.marca, linea: F.linea, modelo: F.modelo, color: F.color, ciudad: F.ciudad, foto: F.foto, tema: F.tema, fondo: F.fondo || (F.clase === "moto" ? "ruta" : "monaco"), vence,
        emergencia: tel ? { nombre: F.e_nombre, relacion: F.e_relacion, rh: F.e_rh, tel: tel.length === 10 ? "57" + tel : tel } : null };
      const j = await rpc("vial_guardar", { p_token: S.token, p_v: v, p_docs: docs, p_pin_nuevo: F.pin1 || null });
      if (!j.ok) throw new Error(j.error);
    }

    // Documento como PDF ya hecho (o una imagen suelta, que también se pasa a PDF)
    async function subirArchivo(file, n) {
      if (file.type !== "application/pdf") return guardarPaginas([file], n);
      if (file.size > 8 * 1024 * 1024) return aviso("Ese PDF pesa más de 8 MB. Mejor escanéalo con la cámara.");
      ocupado++; aviso(`Subiendo ${n}…`);
      try {
        const url = await subirBlob(file, "pdf", "application/pdf");
        docs = docs.filter((d) => d.n !== n); docs.push({ n, url });
        ocupado--; pintar();
      } catch (e) { ocupado--; aviso(e.message); }
    }
    // Fotos → un PDF de varias páginas + miniatura de la primera
    async function guardarPaginas(files, n) {
      ocupado++; aviso(`Creando el PDF de ${n}…`);
      try {
        const jsPDF = await cargarJsPDF();
        let pdf = null, mini = null;
        for (const f of files) {
          const cv = await lienzo(f, 1700, true);
          if (!mini) mini = miniDe(cv);
          const w = 595, h = Math.round((595 * cv.height) / cv.width), o = h >= w ? "p" : "l";
          if (!pdf) pdf = new jsPDF({ unit: "pt", format: [w, h], orientation: o, compress: true });
          else pdf.addPage([w, h], o);
          pdf.addImage(cv.toDataURL("image/jpeg", 0.8), "JPEG", 0, 0, w, h, undefined, "FAST");
        }
        const blob = pdf.output("blob");
        if (blob.size > 8 * 1024 * 1024) throw new Error("El PDF quedó muy pesado. Usa menos páginas.");
        const [url, urlMini] = await Promise.all([subirBlob(blob, "pdf", "application/pdf"), aBlob(mini, 0.75).then((b) => subirBlob(b, b.type === "image/webp" ? "webp" : "jpg", b.type))]);
        docs = docs.filter((d) => d.n !== n); docs.push({ n, url, mini: urlMini, p: files.length });
        ocupado--; pintar();
      } catch (e) { ocupado--; aviso(e.message && !/^(red|Failed)/.test(e.message) ? e.message : "No se pudo subir. Revisa tu conexión."); }
    }

    /* Escáner: varias fotos (frente, reverso…) que se guardan como un solo PDF */
    function escanear(n) {
      const hEsc = $("#h-esc"), cE = $("#esc-cuerpo"), pE = $("#esc-pie");
      let pags = [];
      $("#esc-tit").textContent = n;
      const pintarE = () => {
        cE.innerHTML = `
          ${pags.length ? "" : `<div class="vx-guia"><div class="vx-guia-marco"><i></i><i></i><i></i><i></i>${ic("doc")}</div>
            <p>Pon el documento sobre una superficie oscura, con buena luz, y tómale la foto de frente.</p></div>`}
          <div class="vx-pags">${pags.map((p, i) => `<figure><img src="${p.u}" alt=""><figcaption>Página ${i + 1}</figcaption><button type="button" data-qp="${i}" aria-label="Quitar">${ic("x")}</button></figure>`).join("")}
            ${pags.length && pags.length < 6 ? `<label class="vx-pag-mas">${ic("mas")}<span>${pags.length === 1 ? "Agregar reverso" : "Otra página"}</span><input type="file" accept="image/*" capture="environment" data-foto hidden></label>` : ""}
          </div>
          ${pags.length ? "" : `<label class="vx-galeria">${ic("imagen")} Elegir de la galería<input type="file" accept="image/*" multiple data-foto hidden></label>`}
          <p class="vx-err" id="esc-err"></p>`;
        pE.innerHTML = pags.length ? `<button type="button" class="vx-btn" id="esc-ok">Guardar PDF · ${pags.length} pág.</button>`
          : `<label class="vx-btn">${ic("camara")} Tomar foto<input type="file" accept="image/*" capture="environment" data-foto hidden></label>`;
      };
      const agregar = (e) => {
        const i = e.target.closest("input[data-foto]"); if (!i || !i.files.length) return;
        [...i.files].slice(0, 6 - pags.length).forEach((f) => pags.push({ f, u: URL.createObjectURL(f) }));
        i.value = ""; pintarE();
      };
      const cerrarE = () => { pags.forEach((p) => URL.revokeObjectURL(p.u)); cerrarHoja(hEsc); hEsc.onchange = hEsc.onclick = null; };
      hEsc.onchange = agregar;
      hEsc.onclick = (e) => {
        const q = e.target.closest("[data-qp]"); if (q) { URL.revokeObjectURL(pags[+q.dataset.qp].u); pags.splice(+q.dataset.qp, 1); pintarE(); }
        if (e.target.closest("#esc-x")) cerrarE();
        if (e.target.closest("#esc-ok")) { const fs = pags.map((p) => p.f); cerrarE(); guardarPaginas(fs, n); }
      };
      pintarE(); abrirHoja(hEsc);
    }

    async function subirFoto(file) {
      ocupado++; aviso("Subiendo la foto…");
      try {
        const cv = await lienzo(file, 1400, false), b = await aBlob(cv, 0.8);
        F.foto = await subirBlob(b, b.type === "image/webp" ? "webp" : "jpg", b.type);
        F.fondo = "mia"; ocupado--; leer(); pintar();
      } catch (e) { ocupado--; aviso(e.message && !/^(red|Failed)/.test(e.message) ? e.message : "No se pudo subir la foto."); }
    }

    cuerpo.addEventListener("click", (e) => {
      const c = e.target.closest("[data-clase]");
      const tm = e.target.closest("[data-tema]");
      if (tm) { F.tema = tm.dataset.tema; ponerTema(F.tema); cuerpo.querySelectorAll("[data-tema]").forEach((b) => b.classList.toggle("on", b === tm)); }
      const fo = e.target.closest("[data-fondo]");
      if (fo && !(fo.dataset.fondo === "mia" && !F.foto)) {
        if (fo.dataset.fondo === "mia" && e.target.tagName !== "INPUT") e.preventDefault();
        F.fondo = fo.dataset.fondo; leer(); pintar(); return;
      }
      if (c) { F.clase = c.dataset.clase; cuerpo.querySelectorAll("[data-clase]").forEach((b) => b.classList.toggle("on", b === c)); $(".vx-placa-in")?.classList.toggle("moto", F.clase === "moto"); }
      const r = e.target.closest("[data-rh]");
      if (r) { F.e_rh = F.e_rh === r.dataset.rh ? "" : r.dataset.rh; cuerpo.querySelectorAll("[data-rh]").forEach((b) => b.classList.toggle("on", b.dataset.rh === F.e_rh)); }
      const es = e.target.closest("[data-escanear]");
      if (es) { if (ocupado) return aviso("Espera a que termine la subida…"); escanear(es.dataset.escanear); }
      const q = e.target.closest("[data-quitar]");
      if (q) { docs = docs.filter((d) => d.n !== q.dataset.quitar); pintar(); }
      if (e.target.closest("#otro")) { nuevoOtro = true; pintar(); $("#otro-n")?.focus(); }
      if (e.target.closest("#otro-ok")) {
        const n = ($("#otro-n").value || "").trim().slice(0, 40);
        if (n.length < 3) return aviso("Escribe el nombre del documento.");
        if (!extrasNombres.includes(n) && !TIPOS_DOC.includes(n)) extrasNombres.push(n);
        nuevoOtro = false; pintar();
      }
    });
    cuerpo.addEventListener("input", (e) => {
      if (e.target.name === "placa") { const p = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7); e.target.value = p.length > 3 ? p.slice(0, 3) + " " + p.slice(3) : p; }
      if (e.target.name === "ciudad" && $("#placa-ciudad")) $("#placa-ciudad").textContent = (e.target.value.trim() || "COLOMBIA").toUpperCase();
      if (e.target.name === "pin1" || e.target.name === "pin2") e.target.value = e.target.value.replace(/\D/g, "");
    });
    cuerpo.addEventListener("change", (e) => {
      const i = e.target.closest("input[type=file]"); if (!i || !i.files[0]) return;
      if (ocupado) { i.value = ""; return aviso("Espera a que termine la subida…"); }
      if (i.id === "foto-veh" || i.id === "foto-veh2") subirFoto(i.files[0]); else if (i.dataset.subir) subirArchivo(i.files[0], i.dataset.subir);
      i.value = "";
    });
    pie.addEventListener("click", async (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.id === "w-fin") { location.reload(); return; }
      if (b.id === "w-atras") { leer(); paso--; pintar(); return; }
      if (b.id !== "w-sig") return;
      leer();
      const p = PASOS[paso].id;
      if (ocupado) return aviso("Espera a que termine la subida…");
      if (p === "vehiculo") {
        if (F.propietario.length < 3) return aviso("Escribe el nombre del propietario.");
        const pl = F.placa.replace(/[^A-Za-z0-9]/g, "");
        if (pl.length < 5 || pl.length > 7) return aviso("Revisa la placa (ej.: ABC 123).");
        if (!F.marca) return aviso("Escribe la marca del vehículo.");
      }
      if (p === "emergencia" && F.e_tel && F.e_tel.replace(/\D/g, "").length < 7) return aviso("Revisa el celular de emergencia.");
      if (p === "pin") {
        if (S.activar || F.pin1 || F.pin2) {
          if (!/^\d{4,6}$/.test(F.pin1)) return aviso("El PIN debe tener de 4 a 6 números.");
          if (F.pin1 === "2222") return aviso("El 2222 es el PIN de activación. Escoge otro.");
          if (F.pin1 !== F.pin2) return aviso("Los dos PIN no coinciden.");
        }
        b.disabled = true; b.textContent = "Guardando…";
        try { await guardar(); }
        catch (err) {
          b.disabled = false; b.textContent = S.activar ? "Activar tarjeta" : "Guardar cambios";
          return aviso(err.message === "sesion" ? "Tu sesión venció. Cierra y entra otra vez con tu PIN." : err.message === "placa" ? "Revisa la placa." : "No se pudo guardar. Revisa tu conexión e intenta otra vez.");
        }
      }
      paso++; pintar();
    });
    let avisoCerrar = 0;
    $("#conf-x").onclick = () => {
      const p = PASOS[paso].id;
      if (p === "listo") return location.reload();
      if (Date.now() - avisoCerrar > 4000) { avisoCerrar = Date.now(); return aviso("Si sales ahora no se guarda lo que llevas. Toca la X otra vez para salir."); }
      ponerTema(V.tema); cerrarHoja(hConf);
    };
    pintar();
  }
};
