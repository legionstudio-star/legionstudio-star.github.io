/* Portafolio de Legionario (chip NFC de la tarjeta) — LEGION Studio Digital
   Público: foto, nombre, cargo, redes personales, "guardar contacto" y los botones del estudio.
   Tarjeta nueva (datos.estado = "por_activar"): PIN de activación 2222 → perfil, redes y PIN personal. */
window.LEGION_LEGIONARIO = function (N, raiz) {
  const L = N.legionario || {};
  const R = L.redes || {};
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  if (!document.getElementById("vx-css")) document.head.appendChild(Object.assign(document.createElement("link"), { id: "vx-css", rel: "stylesheet", href: "/app/vial.css?v=2" }));

  const SVG = {
    candado: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    escudo: '<path d="M12 3 4.5 6v5.5c0 4.8 3.2 8 7.5 9.5 4.3-1.5 7.5-4.7 7.5-9.5V6L12 3Z"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>', flecha: '<path d="M5 12h13M13 7l5 5-5 5"/>', atras: '<path d="M19 12H6M11 7l-5 5 5 5"/>',
    ok: '<path d="m5.5 12.5 4 4 9-9.5"/>', lapiz: '<path d="M4.5 19.5h3.8L19 8.8 15.2 5 4.5 15.7v3.8Z"/>', camara: '<path d="M4 8.5h3l1.8-2.5h6.4L17 8.5h3v10.5H4V8.5Z"/><circle cx="12" cy="13.5" r="3.3"/>',
    nfc: '<path d="M7 7.5a6.5 6.5 0 0 1 0 9M10.5 5a10 10 0 0 1 0 14M14 3a13.5 13.5 0 0 1 0 18"/>',
    contacto: '<circle cx="12" cy="8.5" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/><path d="M19 4v4M17 6h4"/>',
    web: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.7 5.4 3.7 8.5s-1.2 5.9-3.7 8.5c-2.5-2.6-3.7-5.4-3.7-8.5S9.5 6.1 12 3.5Z"/>',
    correo: '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5"/><path d="m4.5 7 7.5 6 7.5-6"/>',
    instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>',
    facebook: '<path d="M14.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.1H8.6v3h2.7V21"/>',
    tiktok: '<path d="M14.5 3.5v11.2a3.7 3.7 0 1 1-3.2-3.7"/><path d="M14.5 3.5c.4 2.6 2 4.2 4.6 4.5"/>',
    linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.8v.2M11.5 16v-3.2c0-1.4.9-2.3 2.1-2.3s2 .8 2 2.3V16M11.5 10.5V16"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10.5 9.5 4 2.5-4 2.5v-5Z" fill="currentColor"/>',
    whatsapp: '<path d="M4 20l1.2-3.6A8.5 8.5 0 1 1 8.3 19.2L4 20Z"/><path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .4-.1.6l-.5.6c-.1.1-.1.3 0 .5.6 1 1.4 1.8 2.5 2.3.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.3.1.4.3.3.6-.1.9-.9 1.6-1.8 1.7-2.8.2-6.2-2.9-6.4-5.4 0-.8.1-1.6.3-2.2Z"/>'
  };
  const ic = (n, c = "vx-i") => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[n] || SVG.flecha}</svg>`;

  document.title = L.nombre ? `${L.nombre} · LEGION Studio` : "Legionario · LEGION Studio";
  document.body.classList.add("vial", "vx", "lg");
  document.documentElement.style.setProperty("--c", "#C9A24A");
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = "#0A0B0D";
  const ACTIVAR = N.estado === "por_activar";
  const HERO = "/app/img/legion-casco-hero.webp";

  // Usuario o enlace → URL de cada red
  const sinArroba = (v) => String(v || "").trim().replace(/^@/, "");
  const esUrl = (v) => /^https?:\/\//i.test(v);
  const REDES = [
    { k: "whatsapp", t: "WhatsApp", ph: "300 123 4567", im: "tel", url: (v) => { const d = v.replace(/\D/g, ""); return `https://wa.me/${d.length === 10 ? "57" + d : d}`; } },
    { k: "instagram", t: "Instagram", ph: "@usuario", url: (v) => esUrl(v) ? v : `https://instagram.com/${sinArroba(v)}` },
    { k: "facebook", t: "Facebook", ph: "usuario o enlace", url: (v) => esUrl(v) ? v : `https://facebook.com/${sinArroba(v)}` },
    { k: "tiktok", t: "TikTok", ph: "@usuario", url: (v) => esUrl(v) ? v : `https://tiktok.com/@${sinArroba(v)}` },
    { k: "linkedin", t: "LinkedIn", ph: "usuario o enlace", url: (v) => esUrl(v) ? v : `https://linkedin.com/in/${sinArroba(v)}` },
    { k: "youtube", t: "YouTube", ph: "@canal", url: (v) => esUrl(v) ? v : `https://youtube.com/@${sinArroba(v)}` },
    { k: "web", t: "Página web", ph: "misitio.com", url: (v) => esUrl(v) ? v : `https://${v}` },
    { k: "correo", t: "Correo", ph: "nombre@correo.com", im: "email", url: (v) => `mailto:${v}` }
  ];
  const ESTUDIO = [
    { i: "web", t: "Página web", s: "legionestudio.com", url: "https://legionestudio.com/" },
    { i: "whatsapp", t: "WhatsApp", s: "Cotiza tu proyecto", url: "https://wa.me/573234953988?text=" + encodeURIComponent("Hola LEGION Studio, quiero cotizar mi proyecto") },
    { i: "instagram", t: "Instagram", s: "@legionstudio24", url: "https://www.instagram.com/legionstudio24" },
    { i: "facebook", t: "Facebook", s: "LEGION Studio", url: "https://www.facebook.com/legionstudio" }
  ];
  const marca = `<div class="vx-marca">${ic("escudo")}<span>LEGION STUDIO</span></div>`;
  const iniciales = (n) => String(n || "L").split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  const htmlActivar = () => `
    <section class="vx-hero vx-hero-full lg-hero" style="--foto:url('${HERO}')">
      <header class="vx-top">${marca}<span class="vx-nfc">${ic("nfc")} NFC</span></header>
      <div class="vx-hero-txt">
        <span class="vx-estado"><i></i>Tarjeta de Legionario sin activar</span>
        <h1>Tu tarjeta,<br>tu carta de presentación.</h1>
        <p>Actívala y deja tu nombre, tu foto y tus redes. Quien acerque el celular te encuentra al instante.</p>
        <button type="button" class="vx-btn" id="activar">Activar tarjeta ${ic("flecha")}</button>
        <small class="vx-nota">Necesitas el PIN de activación que viene con tu tarjeta.</small>
      </div>
    </section>`;

  const mis = REDES.filter((r) => R[r.k]);
  const htmlPerfil = () => `
    <section class="vx-hero lg-hero lg-perfil-hero" style="--foto:url('${HERO}')">
      <header class="vx-top">${marca}<span class="vx-nfc">${ic("nfc")} NFC</span></header>
    </section>
    <section class="vx-cuerpo lg-cuerpo">
      <div class="lg-cab">
        <div class="lg-avatar">${L.foto ? `<img src="${esc(L.foto)}" alt="">` : `<span>${esc(iniciales(L.nombre))}</span>`}</div>
        <h1>${esc(L.nombre || "Legionario")}</h1>
        <p class="lg-cargo">${esc(L.cargo || "Legionario")} · <b>LEGION Studio</b></p>
        ${L.frase ? `<p class="lg-frase">${esc(L.frase)}</p>` : ""}
      </div>
      <div class="lg-acc">
        ${R.whatsapp ? `<a class="vx-btn" href="${esc(REDES[0].url(R.whatsapp))}" target="_blank" rel="noopener">${ic("whatsapp")} Escríbeme</a>` : ""}
        <button type="button" class="vx-btn sec" id="vcard">${ic("contacto")} Guardar contacto</button>
      </div>
      ${mis.length ? `<div class="vx-bloque"><div class="vx-tit"><h2>Mis redes</h2></div>
        <div class="lg-redes">${mis.map((r) => `<a href="${esc(r.url(R[r.k]))}" target="_blank" rel="noopener">${ic(r.k)}<span>${r.t}</span></a>`).join("")}</div></div>` : ""}
      <div class="vx-bloque"><div class="vx-tit"><h2>LEGION Studio</h2></div>
        <a class="lg-estudio" href="https://legionestudio.com/" target="_blank" rel="noopener" style="--foto:url('/marca/legion-casco.jpg')">
          <small>Estudio digital</small><b>Páginas web, apps, tarjetas NFC y publicidad que vende.</b><span>Conócenos ${ic("flecha")}</span></a>
        <ul class="vx-lista lg-lista">${ESTUDIO.map((b) => `<li><a href="${esc(b.url)}" target="_blank" rel="noopener">${ic(b.i)}<div><b>${b.t}</b><small>${esc(b.s)}</small></div>${ic("flecha")}</a></li>`).join("")}</ul>
      </div>
      <button type="button" class="vx-link" id="editar">${ic("lapiz")} Editar mi tarjeta</button>
      <p class="vx-pie">LEGION Studio Digital · Aut viam inveniam aut faciam</p>
    </section>`;

  raiz.innerHTML = `
  <main class="vx-main">${ACTIVAR ? htmlActivar() : htmlPerfil()}</main>
  <div class="vx-modal" id="m-pin" role="dialog" aria-modal="true" aria-label="PIN">
    <div class="vx-caja"><div class="vx-asa"></div><h3 id="pin-tit"></h3><p id="pin-sub"></p>
      <div class="vx-puntos" id="vx-puntos"></div><p class="vx-err" id="vx-err"></p>
      <div class="vx-tecl" id="vx-tecl">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "⌫"].map((k) => k === "" ? "<span></span>" : `<button type="button" data-k="${k}">${k === "⌫" ? ic("atras") : k}</button>`).join("")}</div>
      <button type="button" class="vx-btn" id="pin-ok">Continuar</button><button type="button" class="vx-cerrar" data-cerrar>Cancelar</button></div>
  </div>
  <div class="vx-hoja" id="h-conf" role="dialog" aria-modal="true" aria-label="Configurar tarjeta">
    <div class="vx-hoja-top"><button type="button" class="vx-x" id="conf-x" aria-label="Cerrar">${ic("x")}</button><div><small id="conf-paso"></small><b id="conf-tit"></b></div></div>
    <div class="vx-segs" id="conf-segs"></div><div class="vx-hoja-cuerpo" id="conf-cuerpo"></div><div class="vx-pie-btns" id="conf-pie"></div>
  </div>`;

  // Guardar contacto (vCard)
  $("#vcard")?.addEventListener("click", () => {
    const tel = R.whatsapp ? R.whatsapp.replace(/\D/g, "") : "";
    const vc = ["BEGIN:VCARD", "VERSION:3.0", `FN:${L.nombre || "Legionario"}`, "ORG:LEGION Studio", `TITLE:${L.cargo || "Legionario"}`,
      tel ? `TEL;TYPE=CELL:+${tel.length === 10 ? "57" + tel : tel}` : "", R.correo ? `EMAIL:${R.correo}` : "", `URL:${location.href}`, "END:VCARD"].filter(Boolean).join("\r\n");
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(new Blob([vc], { type: "text/vcard" })), download: `${(L.nombre || "legionario").replace(/\s+/g, "_")}.vcf` });
    document.body.appendChild(a); a.click(); a.remove();
  });

  /* ----- PIN ----- */
  const mPin = $("#m-pin");
  let escrito = "";
  const puntos = () => ($("#vx-puntos").innerHTML = Array.from({ length: Math.max(4, escrito.length) }, (_, i) => `<i class="${i < escrito.length ? "on" : ""}"></i>`).join(""));
  const pedirPin = (act) => { escrito = ""; puntos(); $("#vx-err").textContent = ""; $("#pin-tit").textContent = act ? "PIN de activación" : "Editar mi tarjeta"; $("#pin-sub").textContent = act ? "Viene impreso con tu tarjeta." : "Escribe tu PIN personal."; mPin.classList.add("abierta"); };
  $("#activar")?.addEventListener("click", () => pedirPin(true));
  $("#editar")?.addEventListener("click", () => pedirPin(false));
  mPin.addEventListener("click", (e) => { if (e.target === mPin || e.target.closest("[data-cerrar]")) mPin.classList.remove("abierta"); });
  $("#vx-tecl").addEventListener("click", (e) => {
    const k = e.target.closest("[data-k]")?.dataset.k; if (k === undefined) return;
    $("#vx-err").textContent = "";
    if (k === "⌫") escrito = escrito.slice(0, -1); else if (escrito.length < 6) escrito += k;
    puntos(); if (escrito.length === 6) abrir();
  });
  $("#pin-ok").addEventListener("click", () => abrir());
  const rpc = async (fn, body) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error("red"); return r.json();
  };
  async function abrir() {
    if (escrito.length < 4) return ($("#vx-err").textContent = "El PIN tiene de 4 a 6 números");
    $("#vx-err").textContent = "Verificando…";
    try {
      const j = await rpc("vial_sesion", { p_slug: window.SLUG, p_pin: escrito });
      if (!j.ok) { escrito = ""; puntos(); $("#vx-err").textContent = j.error === "bloqueado" ? "Demasiados intentos. Espera 5 minutos." : "PIN incorrecto"; return; }
      mPin.classList.remove("abierta"); asistente(j);
    } catch (e) { $("#vx-err").textContent = "Sin conexión, intenta otra vez"; }
  }

  /* ----- Paso a paso ----- */
  function asistente(S) {
    const hConf = $("#h-conf"), cuerpo = $("#conf-cuerpo"), pie = $("#conf-pie");
    const F = { nombre: L.nombre || "", cargo: L.cargo || "", frase: L.frase || "", foto: L.foto || "", pin1: "", pin2: "" };
    REDES.forEach((r) => (F["r_" + r.k] = R[r.k] || ""));
    const PASOS = [{ id: "perfil", t: "Tu perfil" }, { id: "redes", t: "Tus redes" }, { id: "pin", t: S.activar ? "Tu PIN" : "PIN" }, { id: "listo", t: "Listo" }];
    let paso = 0, ocupado = 0;
    hConf.classList.add("abierta"); document.body.style.overflow = "hidden";
    const campo = (k, t, o = {}) => `<label class="vx-campo ${o.cls || ""}"><span>${t}${o.op ? "<em>Opcional</em>" : ""}</span><input name="${k}" value="${esc(F[k])}" ${o.tipo ? `type="${o.tipo}"` : ""} ${o.ph ? `placeholder="${esc(o.ph)}"` : ""} ${o.im ? `inputmode="${o.im}"` : ""} ${o.max ? `maxlength="${o.max}"` : ""} autocomplete="${o.ac || "off"}" autocapitalize="${o.cap || "sentences"}"></label>`;
    const leer = () => cuerpo.querySelectorAll("input[name]").forEach((i) => (F[i.name] = i.value.trim()));
    const aviso = (t) => { const el = $("#conf-err"); if (el) el.textContent = t; };
    function pintar() {
      const p = PASOS[paso].id, n = PASOS.length - 1;
      $("#conf-paso").textContent = p === "listo" ? (S.activar ? "Activación completa" : "Cambios guardados") : `Paso ${paso + 1} de ${n}`;
      $("#conf-tit").textContent = p === "listo" ? "Todo listo" : PASOS[paso].t;
      $("#conf-segs").innerHTML = PASOS.slice(0, n).map((_, i) => `<i class="${i < paso ? "hecho" : i === paso ? "actual" : ""}"></i>`).join("");
      $("#conf-segs").hidden = p === "listo";
      let h = "";
      if (p === "perfil") h = `${S.activar ? `<div class="vx-ok-act">${ic("ok")} PIN correcto. Armemos tu tarjeta.</div>` : ""}
        <label class="lg-foto-in">${F.foto ? `<img src="${esc(F.foto)}" alt="">` : `<span>${ic("camara")}</span>`}<div><b>${F.foto ? "Cambiar foto" : "Agrega tu foto"}</b><small>Una foto de frente, con buena luz.</small></div><input type="file" accept="image/*" id="foto" hidden></label>
        ${campo("nombre", "Tu nombre", { ph: "Nombre y apellido", max: 50, ac: "name", cap: "words" })}
        ${campo("cargo", "Cargo", { ph: "Asesor comercial", max: 50, op: 1 })}
        ${campo("frase", "Una frase sobre ti", { ph: "Te ayudo a que tu negocio venda más.", max: 120, op: 1 })}
        <p class="vx-err" id="conf-err"></p>`;
      if (p === "redes") h = `<h3 class="vx-h">¿Dónde te encuentran?</h3><p class="vx-s">Llena solo las que uses. Puedes poner el usuario o pegar el enlace.</p>
        <div class="lg-redes-in">${REDES.map((r) => `<label>${ic(r.k)}<div><span>${r.t}</span><input name="r_${r.k}" value="${esc(F["r_" + r.k])}" placeholder="${esc(r.ph)}" ${r.im ? `inputmode="${r.im}"` : ""} autocomplete="off" autocapitalize="none" maxlength="120"></div></label>`).join("")}</div>
        <p class="vx-err" id="conf-err"></p>`;
      if (p === "pin") h = `<h3 class="vx-h">${S.activar ? "Crea tu PIN personal" : "Cambiar PIN"}</h3>
        <p class="vx-s">${S.activar ? "Con este PIN editas tu tarjeta cuando quieras. El PIN de activación deja de funcionar." : "Déjalo en blanco para seguir con tu PIN actual."}</p>
        ${campo("pin1", "PIN nuevo · 4 a 6 números", { tipo: "password", im: "numeric", max: 6, cls: "vx-pin", ac: "new-password" })}
        ${campo("pin2", "Confirma el PIN", { tipo: "password", im: "numeric", max: 6, cls: "vx-pin", ac: "new-password" })}
        <p class="vx-err" id="conf-err"></p>`;
      if (p === "listo") h = `<div class="vx-fin"><div class="lg-avatar grande">${F.foto ? `<img src="${esc(F.foto)}" alt="">` : `<span>${esc(iniciales(F.nombre))}</span>`}</div>
        <h3>${S.activar ? "Tu tarjeta quedó activada" : "Cambios guardados"}</h3><p>Cuando alguien acerque su celular a tu tarjeta verá tu perfil, tus redes y los servicios de LEGION Studio.</p></div>`;
      cuerpo.innerHTML = h; cuerpo.scrollTop = 0;
      pie.innerHTML = p === "listo" ? `<button type="button" class="vx-btn" id="w-fin">Ver mi tarjeta</button>` :
        `${paso > 0 ? `<button type="button" class="vx-btn sec cuad" id="w-atras" aria-label="Atrás">${ic("atras")}</button>` : ""}<button type="button" class="vx-btn" id="w-sig">${p === "pin" ? (S.activar ? "Activar tarjeta" : "Guardar cambios") : "Continuar"}</button>`;
    }
    async function subirFoto(file) {
      ocupado++; aviso("Subiendo la foto…");
      try {
        const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
        const lado = Math.min(bmp.width, bmp.height), k = Math.min(1, 800 / lado);
        const cv = document.createElement("canvas"); cv.width = cv.height = Math.round(lado * k);
        cv.getContext("2d").drawImage(bmp, (bmp.width - lado) / 2, (bmp.height - lado) / 2, lado, lado, 0, 0, cv.width, cv.height);
        let b = await new Promise((ok) => cv.toBlob(ok, "image/webp", 0.82));
        if (!b || b.type !== "image/webp") b = await new Promise((ok) => cv.toBlob(ok, "image/jpeg", 0.86));
        const nombre = `${S.token}-${Math.random().toString(36).slice(2, 10)}.${b.type === "image/webp" ? "webp" : "jpg"}`;
        const r = await fetch(`${SUPABASE_URL}/storage/v1/object/docs/${window.SLUG}/${nombre}`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": b.type }, body: b });
        if (!r.ok) throw new Error("Tu sesión venció. Cierra y entra otra vez con tu PIN.");
        F.foto = `${SUPABASE_URL}/storage/v1/object/public/docs/${window.SLUG}/${nombre}`;
        ocupado--; leer(); pintar();
      } catch (e) { ocupado--; aviso(e.message && !/^(red|Failed)/.test(e.message) ? e.message : "No se pudo subir la foto."); }
    }
    cuerpo.addEventListener("change", (e) => { if (e.target.id === "foto" && e.target.files[0]) { leer(); subirFoto(e.target.files[0]); e.target.value = ""; } });
    cuerpo.addEventListener("input", (e) => { if (/^pin/.test(e.target.name)) e.target.value = e.target.value.replace(/\D/g, ""); });
    pie.addEventListener("click", async (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.id === "w-fin") return location.reload();
      if (b.id === "w-atras") { leer(); paso--; return pintar(); }
      if (b.id !== "w-sig") return;
      leer();
      const p = PASOS[paso].id;
      if (ocupado) return aviso("Espera a que termine la subida…");
      if (p === "perfil" && F.nombre.length < 3) return aviso("Escribe tu nombre.");
      if (p === "redes" && F.r_whatsapp && F.r_whatsapp.replace(/\D/g, "").length < 7) return aviso("Revisa tu número de WhatsApp.");
      if (p === "pin") {
        if (S.activar || F.pin1 || F.pin2) {
          if (!/^\d{4,6}$/.test(F.pin1)) return aviso("El PIN debe tener de 4 a 6 números.");
          if (F.pin1 === "2222") return aviso("El 2222 es el PIN de activación. Escoge otro.");
          if (F.pin1 !== F.pin2) return aviso("Los dos PIN no coinciden.");
        }
        b.disabled = true; b.textContent = "Guardando…";
        const redes = {}; REDES.forEach((r) => { if (F["r_" + r.k]) redes[r.k] = F["r_" + r.k].replace(/\s+/g, r.k === "whatsapp" ? "" : ""); });
        try {
          const j = await rpc("leg_guardar", { p_token: S.token, p_l: { nombre: F.nombre, cargo: F.cargo, frase: F.frase, foto: F.foto, redes }, p_pin_nuevo: F.pin1 || null });
          if (!j.ok) throw new Error(j.error);
        } catch (err) {
          b.disabled = false; b.textContent = S.activar ? "Activar tarjeta" : "Guardar cambios";
          return aviso(err.message === "sesion" ? "Tu sesión venció. Cierra y entra otra vez con tu PIN." : "No se pudo guardar. Revisa tu conexión e intenta otra vez.");
        }
      }
      paso++; pintar();
    });
    let avisoCerrar = 0;
    $("#conf-x").onclick = () => {
      if (PASOS[paso].id === "listo") return location.reload();
      if (Date.now() - avisoCerrar > 4000) { avisoCerrar = Date.now(); return aviso("Si sales ahora no se guarda lo que llevas. Toca la X otra vez para salir."); }
      hConf.classList.remove("abierta"); document.body.style.overflow = "";
    };
    pintar();
  }
};
