/* Carpeta Vial — página de un vehículo (tarjeta NFC/QR para carros y motos) — LEGION Studio Digital
   Lo público: placa, vehículo, vencimientos, emergencia y botones. Los documentos solo se abren con el PIN del dueño. */
window.LEGION_VEHICULO = function (N, raiz) {
  const V = N.vehiculo || {};
  const $ = (s, el = document) => el.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const SVG = {
    candado: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    escudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    alerta: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4M12 17v.5"/>',
    tel: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
    doc: '<path d="M6 3h9l4 4v14H6V3Z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    flecha: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    gota: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    wa: '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm4.5 12.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>',
    carro: '<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3zM7 11h10"/><circle cx="7.5" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
    moto: '<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M8.5 17h6l3-7h-4M5.5 14l3-5h4l2 8M15 6h2.5l1 4"/>',
    llave: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/>',
    lapiz: '<path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m13 7 4 4"/>',
    camara: '<path d="M4 8h3l2-3h6l2 3h3v11H4V8Z"/><circle cx="12" cy="13" r="3.5"/>',
    ok: '<path d="m5 12 4.5 4.5L19 7"/>',
    chispa: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'
  };
  const ic = (n, c = "icon") => `<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[n] || SVG.flecha}</svg>`;

  document.title = `${V.placa || "Vehículo"} · Carpeta Vial`;
  document.body.classList.add("vial");
  document.documentElement.style.setProperty("--c", N.color || "#02A7BB");
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = "#0B0D10";

  // Estado de cada documento según su fecha de vencimiento
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const fmt = (d) => d.toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
  const estados = (V.vence || []).filter((v) => v.doc && v.fecha).map((v) => {
    const f = new Date(v.fecha + "T00:00:00"), dias = Math.round((f - hoy) / 864e5);
    const e = dias < 0 ? "vencido" : dias <= 30 ? "pronto" : "ok";
    const txt = dias < 0 ? `Vencido hace ${-dias} día${dias === -1 ? "" : "s"}` : dias === 0 ? "Vence hoy" : dias <= 30 ? `Vence en ${dias} día${dias === 1 ? "" : "s"}` : "Vigente";
    return { ...v, e, txt, f: fmt(f) };
  });
  const alertas = estados.filter((e) => e.e !== "ok").length;
  const P = N.patrocinador;
  const em = V.emergencia;
  const placa = String(V.placa || "").toUpperCase();
  const placaFmt = placa.length === 6 ? placa.slice(0, 3) + " " + placa.slice(3) : placa;
  const ACTIVAR = N.estado === "por_activar";
  const htmlActivar = () => `
    <header class="cv-top"><div class="cv-marca">${ic("escudo")}<div><b>CARPETA VIAL</b><small>Tus papeles, siempre a la mano</small></div></div></header>
    <section class="cv-act">
      <div class="cv-act-ic">${ic("chispa")}</div>
      <span class="cv-act-chip">TARJETA NUEVA · POR ACTIVAR</span>
      <h1>Activa tu Carpeta Vial</h1>
      <p>En 3 minutos dejas tu tarjeta lista: tus datos, los de tu vehículo, tus documentos y tu PIN personal.</p>
      <ol class="cv-act-pasos">
        <li><b>1</b><span>Escribe el PIN de activación que viene con tu tarjeta</span></li>
        <li><b>2</b><span>Llena tus datos y los de tu vehículo</span></li>
        <li><b>3</b><span>Sube fotos de tu SOAT, licencia y tarjeta de propiedad</span></li>
        <li><b>4</b><span>Crea tu PIN personal para proteger tus documentos</span></li>
      </ol>
      <button type="button" class="cv-docs cv-act-btn" id="activar">
        <span class="cv-docs-ic">${ic("candado")}</span>
        <div><b>Activar mi tarjeta</b><small>Empieza aquí</small></div>${ic("flecha")}
      </button>
    </section>
    <p class="cv-pie">Hecho por <b>LEGION Studio Digital</b></p>`;

  raiz.innerHTML = `
  <main class="cv">${ACTIVAR ? htmlActivar() : `
    <header class="cv-top">
      <div class="cv-marca">${ic("escudo")}<div><b>CARPETA VIAL</b><small>Tus papeles, siempre a la mano</small></div></div>
      ${P && P.logo ? `<img class="cv-pat" src="${esc(P.logo)}" alt="${esc(P.nombre)}">` : ""}
    </header>

    <section class="cv-hero">
      <div class="cv-placa ${V.clase === "moto" ? "moto" : ""}"><span>${esc(placaFmt)}</span><small>${esc(V.ciudad || "COLOMBIA")}</small></div>
      ${V.foto ? `<img class="cv-foto" src="${esc(V.foto)}" alt="">` : `<div class="cv-ico">${ic(V.clase === "moto" ? "moto" : "carro")}</div>`}
      <h1>${esc([V.marca, V.linea].filter(Boolean).join(" "))}</h1>
      <p>${esc([V.modelo, V.color, V.clase === "moto" ? "Moto" : "Carro"].filter(Boolean).join(" · "))}</p>
      ${V.propietario ? `<span class="cv-dueno">${ic("llave")} ${esc(V.propietario)}</span>` : ""}
    </section>

    ${estados.length ? `
    <section class="cv-bloque">
      <div class="cv-tit"><h2>Estado de los documentos</h2>${alertas ? `<span class="cv-chip pronto">${alertas} por revisar</span>` : `<span class="cv-chip ok">Todo al día</span>`}</div>
      <ul class="cv-estados">
        ${estados.map((e) => `<li class="${e.e}"><span class="cv-luz"></span><div><b>${esc(e.doc)}</b><small>Vence: ${e.f}</small></div><em>${e.txt}</em></li>`).join("")}
      </ul>
    </section>` : ""}

    <section class="cv-bloque cv-acc">
      <button type="button" class="cv-docs" id="ver-docs">
        <span class="cv-docs-ic">${ic("candado")}</span>
        <div><b>Ver mis documentos</b><small>SOAT, licencia, tarjeta de propiedad… con tu PIN</small></div>
        ${ic("flecha")}
      </button>
      ${em && em.tel ? `<a class="cv-emer" href="tel:+${esc(em.tel)}">${ic("alerta")}<div><b>Emergencia: llamar a ${esc(em.nombre || "mi contacto")}</b><small>${esc([em.relacion, em.rh ? "RH " + em.rh : ""].filter(Boolean).join(" · ") || "Contacto de emergencia")}</small></div>${ic("tel")}</a>` : ""}
      ${(N.extras || []).filter((b) => b && b.t && b.url).map((b) => `<a class="cv-btn" href="${esc(b.url)}" target="_blank" rel="noopener"><span>${ic(b.i)}</span><div><b>${esc(b.t)}</b>${b.s ? `<small>${esc(b.s)}</small>` : ""}</div>${ic("flecha")}</a>`).join("")}
    </section>

    ${P ? `
    <section class="cv-bloque">
      <a class="cv-patro" ${P.url ? `href="${esc(P.url)}" target="_blank" rel="noopener"` : ""}>
        ${P.logo ? `<img src="${esc(P.logo)}" alt="">` : ""}
        <div><small>Tarjeta cortesía de</small><b>${esc(P.nombre)}</b>${P.texto ? `<span>${esc(P.texto)}</span>` : ""}</div>
      </a>
    </section>` : ""}

    <p class="cv-legal">Esta tarjeta es una copia de consulta para tenerlos a la mano. No reemplaza los documentos oficiales; las autoridades pueden verificarlos en el RUNT.</p>
    <p class="cv-pie">Hecho por <b>LEGION Studio Digital</b></p>
    <button type="button" class="cv-editar" id="editar">${ic("lapiz")} Editar mi carpeta</button>`}
  </main>

  <div class="cv-modal" id="m-pin" role="dialog" aria-modal="true" aria-label="PIN">
    <div class="cv-caja">
      <span class="cv-docs-ic grande">${ic("candado")}</span>
      <h3 id="pin-tit">Documentos de ${esc(placaFmt)}</h3>
      <p id="pin-sub">Escribe el PIN del dueño</p>
      <div class="cv-puntos" id="cv-puntos"></div>
      <p class="cv-err" id="cv-err"></p>
      <div class="cv-tecl" id="cv-tecl">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "OK"].map((k) => `<button type="button" data-k="${k}">${k}</button>`).join("")}</div>
      <button type="button" class="cv-cerrar" data-cerrar>Cancelar</button>
    </div>
  </div>

  <div class="cv-hoja" id="h-docs" role="dialog" aria-modal="true" aria-label="Documentos">
    <div class="cv-hoja-top"><button type="button" class="cv-x" data-cerrar-docs aria-label="Cerrar">${ic("x")}</button><h2>Documentos · ${esc(placaFmt)}</h2></div>
    <div class="cv-hoja-cuerpo" id="docs-lista"></div>
  </div>

  <div class="cv-hoja" id="h-conf" role="dialog" aria-modal="true" aria-label="Configurar tarjeta">
    <div class="cv-hoja-top"><button type="button" class="cv-x" id="conf-x" aria-label="Cerrar">${ic("x")}</button><h2 id="conf-tit">Configura tu tarjeta</h2></div>
    <div class="cvw-barra"><i id="conf-barra"></i></div>
    <div class="cv-hoja-cuerpo" id="conf-cuerpo"></div>
    <div class="cvw-pie" id="conf-pie"></div>
  </div>`;

  /* ----- PIN y documentos ----- */
  const mPin = $("#m-pin"), hDocs = $("#h-docs");
  let escrito = "", modo = "docs";
  const puntos = () => ($("#cv-puntos").innerHTML = Array.from({ length: Math.max(4, escrito.length) }, (_, i) => `<i class="${i < escrito.length ? "on" : ""}"></i>`).join(""));
  puntos();
  const pedirPin = (m) => {
    modo = m; escrito = ""; puntos(); $("#cv-err").textContent = "";
    $("#pin-tit").textContent = m === "activar" ? "PIN de activación" : m === "editar" ? "Editar mi carpeta" : `Documentos de ${placaFmt}`;
    $("#pin-sub").textContent = m === "activar" ? "Viene con tu tarjeta" : "Escribe tu PIN personal";
    mPin.classList.add("abierta");
  };
  $("#ver-docs")?.addEventListener("click", () => pedirPin("docs"));
  $("#editar")?.addEventListener("click", () => pedirPin("editar"));
  $("#activar")?.addEventListener("click", () => pedirPin("activar"));
  mPin.addEventListener("click", (e) => { if (e.target === mPin || e.target.closest("[data-cerrar]")) mPin.classList.remove("abierta"); });
  $("#cv-tecl").addEventListener("click", async (e) => {
    const k = e.target.closest("[data-k]")?.dataset.k; if (k === undefined) return;
    $("#cv-err").textContent = "";
    if (k === "⌫") escrito = escrito.slice(0, -1);
    else if (k !== "OK") { if (escrito.length < 6) escrito += k; }
    puntos();
    if (k === "OK" || escrito.length === 6) abrir();
  });
  async function abrir() {
    if (escrito.length < 4) return ($("#cv-err").textContent = "El PIN tiene de 4 a 6 números");
    $("#cv-err").textContent = "Abriendo…";
    if (modo !== "docs") return abrirSesion();
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/vehiculo_docs`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ p_slug: window.SLUG, p_pin: escrito }) });
      const j = await r.json();
      if (!r.ok) throw new Error();
      if (!j.ok) { escrito = ""; puntos(); $("#cv-err").textContent = j.error === "bloqueado" ? "Demasiados intentos. Espera 5 minutos." : "PIN incorrecto"; return; }
      mPin.classList.remove("abierta");
      mostrar(j.docs || []);
    } catch (err) { $("#cv-err").textContent = "Sin conexión, intenta otra vez"; }
  }
  function mostrar(docs) {
    $("#docs-lista").innerHTML = docs.length ? docs.map((d) => `
      <figure class="cv-doc">
        <figcaption>${ic("doc")} ${esc(d.n)}</figcaption>
        ${/\.pdf($|\?)/i.test(d.url) ? `<a class="cv-pdf" href="${esc(d.url)}" target="_blank" rel="noopener">Abrir PDF</a>` : `<a href="${esc(d.url)}" target="_blank" rel="noopener"><img src="${esc(d.url)}" alt="${esc(d.n)}" loading="lazy"></a>`}
      </figure>`).join("") : `<p class="cv-vacio">Todavía no hay documentos cargados.</p>`;
    hDocs.classList.add("abierta"); document.body.style.overflow = "hidden";
  }
  hDocs.addEventListener("click", (e) => { if (e.target.closest("[data-cerrar-docs]")) { hDocs.classList.remove("abierta"); document.body.style.overflow = ""; } });

  /* ----- Activación y configuración paso a paso (dueño) ----- */
  const rpc = async (fn, body) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error("red");
    return r.json();
  };
  let S = null; // { token, activar, docs }
  async function abrirSesion() {
    try {
      const j = await rpc("vial_sesion", { p_slug: window.SLUG, p_pin: escrito });
      if (!j.ok) { escrito = ""; puntos(); $("#cv-err").textContent = j.error === "bloqueado" ? "Demasiados intentos. Espera 5 minutos." : "PIN incorrecto"; return; }
      mPin.classList.remove("abierta");
      S = j; asistente();
    } catch (err) { $("#cv-err").textContent = "Sin conexión, intenta otra vez"; }
  }

  const TIPOS_DOC = ["SOAT", "Licencia de conducción", "Tarjeta de propiedad", "Revisión técnico-mecánica"];
  const RH = ["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
  function asistente() {
    const hConf = $("#h-conf"), cuerpo = $("#conf-cuerpo"), pie = $("#conf-pie");
    const venceDe = (doc) => ((V.vence || []).find((x) => x.doc === doc) || {}).fecha || "";
    const F = {
      propietario: V.propietario || "", clase: V.clase || "carro", placa: V.placa || "", marca: V.marca || "", linea: V.linea || "",
      modelo: V.modelo || "", color: V.color || "", ciudad: V.ciudad && V.ciudad !== "CARPETA VIAL" ? V.ciudad : "",
      soat: venceDe("SOAT"), tecno: venceDe("Revisión técnico-mecánica"), licencia: venceDe("Licencia de conducción"),
      e_nombre: (em && em.nombre) || "", e_relacion: (em && em.relacion) || "", e_tel: em && em.tel ? String(em.tel).replace(/^57/, "") : "", e_rh: (em && em.rh) || "",
      pin1: "", pin2: ""
    };
    let docs = (S.docs || []).map((d) => ({ ...d }));
    const PASOS = [
      ...(S.activar ? ["bienvenida"] : []), "vehiculo", "vence", "emergencia", "docs", "pin", "listo"
    ];
    let paso = 0, subiendo = 0;
    $("#conf-tit").textContent = S.activar ? "Activa tu tarjeta" : "Editar mi carpeta";
    hConf.classList.add("abierta"); document.body.style.overflow = "hidden";

    const campo = (k, t, o = {}) => `<label class="cvw-campo"><span>${t}${o.op ? ' <em>(opcional)</em>' : ""}</span>
      <input name="${k}" value="${esc(F[k])}" ${o.tipo ? `type="${o.tipo}"` : ""} ${o.ph ? `placeholder="${esc(o.ph)}"` : ""} ${o.im ? `inputmode="${o.im}"` : ""} ${o.max ? `maxlength="${o.max}"` : ""} autocomplete="off"></label>`;
    const leer = () => cuerpo.querySelectorAll("input[name],select[name]").forEach((i) => (F[i.name] = i.value.trim()));

    function pintar() {
      const p = PASOS[paso], total = PASOS.length - 1;
      $("#conf-barra").style.width = `${Math.round((paso / total) * 100)}%`;
      let h = "";
      if (p === "bienvenida") h = `
        <div class="cvw-hola">${ic("ok", "icon")}<h3>¡Tarjeta activada!</h3>
        <p>Ahora vamos a configurarla. Son 5 pasos cortos: tu vehículo, los vencimientos, un contacto de emergencia, tus documentos y tu PIN personal.</p></div>`;
      if (p === "vehiculo") h = `<h3 class="cvw-t">Tú y tu vehículo</h3><p class="cvw-s">Esto es lo que se ve al escanear la tarjeta.</p>
        ${campo("propietario", "¿A nombre de quién está la tarjeta?", { ph: "Nombre y apellido", max: 60 })}
        <div class="cvw-campo"><span>Tipo de vehículo</span><div class="cvw-tipo">
          <button type="button" data-clase="carro" class="${F.clase === "carro" ? "on" : ""}">${ic("carro")} Carro</button>
          <button type="button" data-clase="moto" class="${F.clase === "moto" ? "on" : ""}">${ic("moto")} Moto</button></div></div>
        ${campo("placa", "Placa", { ph: "ABC123", max: 7 })}
        <div class="cvw-dos">${campo("marca", "Marca", { ph: "Mazda", max: 30 })}${campo("linea", "Línea", { ph: "BT-50", max: 40 })}</div>
        <div class="cvw-dos">${campo("modelo", "Modelo (año)", { ph: "2024", im: "numeric", max: 4 })}${campo("color", "Color", { ph: "Negro", max: 30 })}</div>
        ${campo("ciudad", "Ciudad de la placa", { ph: "Bogotá", max: 30, op: 1 })}`;
      if (p === "vence") h = `<h3 class="cvw-t">¿Cuándo se vencen?</h3><p class="cvw-s">Te mostramos en la tarjeta si algo está por vencer. Deja en blanco lo que no sepas.</p>
        ${campo("soat", "SOAT", { tipo: "date", op: 1 })}${campo("tecno", "Revisión técnico-mecánica", { tipo: "date", op: 1 })}${campo("licencia", "Licencia de conducción", { tipo: "date", op: 1 })}`;
      if (p === "emergencia") h = `<h3 class="cvw-t">Contacto de emergencia</h3><p class="cvw-s">Si te pasa algo en la vía, quien escanee la tarjeta lo puede llamar con un toque.</p>
        ${campo("e_nombre", "Nombre", { ph: "Laura", max: 40, op: 1 })}${campo("e_relacion", "Parentesco", { ph: "Esposa, hijo, mamá…", max: 30, op: 1 })}
        <div class="cvw-dos">${campo("e_tel", "Celular", { ph: "300 123 4567", im: "tel", max: 15, op: 1 })}
        <label class="cvw-campo"><span>Tu RH <em>(opcional)</em></span><select name="e_rh">${RH.map((r) => `<option ${r === F.e_rh ? "selected" : ""} value="${r}">${r || "—"}</option>`).join("")}</select></label></div>`;
      if (p === "docs") {
        const huecos = [...TIPOS_DOC.filter((t) => !docs.some((d) => d.n === t)), "Otro documento"];
        h = `<h3 class="cvw-t">Sube tus documentos</h3><p class="cvw-s">Tómales una foto clara o sube el PDF. Solo se abren con tu PIN.</p>
        <div class="cvw-docs">
          ${docs.map((d, i) => `<div class="cvw-doc lleno">${/\.pdf($|\?)/i.test(d.url) ? `<span class="cvw-pdf">PDF</span>` : `<img src="${esc(d.url)}" alt="">`}
            <div><b>${esc(d.n)}</b><small>${ic("ok")} Cargado</small></div><button type="button" class="cvw-quitar" data-quitar="${i}" aria-label="Quitar">${ic("x")}</button></div>`).join("")}
          ${huecos.map((t) => `<label class="cvw-doc"><span class="cvw-cam">${ic("camara")}</span><div><b>${esc(t)}</b><small>Toca para tomar foto o subir</small></div>
            <input type="file" accept="image/*,application/pdf" data-tipo="${esc(t)}" hidden></label>`).join("")}
        </div><p class="cvw-err" id="docs-err"></p>`;
      }
      if (p === "pin") h = `<h3 class="cvw-t">${S.activar ? "Crea tu PIN personal" : "Cambiar PIN"}</h3>
        <p class="cvw-s">${S.activar ? "Con este PIN abres tus documentos y editas tu carpeta. El 2222 de activación deja de servir." : "Déjalo en blanco si quieres seguir con el mismo PIN."}</p>
        ${campo("pin1", "PIN nuevo (4 a 6 números)", { tipo: "password", im: "numeric", max: 6, op: S.activar ? 0 : 1 })}
        ${campo("pin2", "Repite el PIN", { tipo: "password", im: "numeric", max: 6, op: S.activar ? 0 : 1 })}
        <p class="cvw-err" id="pin-err"></p>`;
      if (p === "listo") h = `<div class="cvw-hola">${ic("escudo", "icon")}<h3>¡Tu Carpeta Vial está lista!</h3>
        <p>Ya puedes mostrar tu tarjeta: al acercar el celular o escanear el QR salen tu vehículo, los vencimientos y el botón de emergencia. Tus documentos se abren con tu PIN.</p></div>`;
      cuerpo.innerHTML = h; cuerpo.scrollTop = 0;
      const ultimo = p === "listo";
      pie.innerHTML = ultimo ? `<button type="button" class="cvw-sig" id="w-fin">Ver mi tarjeta</button>` :
        `${paso > 0 && p !== "bienvenida" && PASOS[paso - 1] !== "bienvenida" ? `<button type="button" class="cvw-atras" id="w-atras">Atrás</button>` : ""}
         <button type="button" class="cvw-sig" id="w-sig">${p === "pin" ? (S.activar ? "Guardar y activar" : "Guardar cambios") : p === "bienvenida" ? "Empezar" : "Siguiente"}</button>`;
    }

    async function guardar() {
      const vence = [["SOAT", F.soat], ["Revisión técnico-mecánica", F.tecno], ["Licencia de conducción", F.licencia]].filter((x) => x[1]).map(([doc, fecha]) => ({ doc, fecha }));
      const tel = F.e_tel.replace(/\D/g, "");
      const v = { propietario: F.propietario, clase: F.clase, placa: F.placa, marca: F.marca, linea: F.linea, modelo: F.modelo, color: F.color, ciudad: F.ciudad, vence,
        emergencia: tel ? { nombre: F.e_nombre, relacion: F.e_relacion, rh: F.e_rh, tel: tel.length === 10 ? "57" + tel : tel } : null };
      const j = await rpc("vial_guardar", { p_token: S.token, p_v: v, p_docs: docs, p_pin_nuevo: F.pin1 || null });
      if (!j.ok) throw new Error(j.error);
    }

    // Comprime las fotos (WebP o JPG, máx. 1600 px) y las sube con la sesión
    async function subir(file, tipo) {
      const err = $("#docs-err");
      if (file.size > 15 * 1024 * 1024) { err.textContent = "Ese archivo es muy pesado (máx. 15 MB)."; return; }
      subiendo++; err.textContent = `Subiendo ${tipo}…`;
      try {
        let blob = file, ext = "pdf", tipoMime = "application/pdf";
        if (file.type !== "application/pdf") {
          const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
          const k = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
          const cv = document.createElement("canvas"); cv.width = Math.round(bmp.width * k); cv.height = Math.round(bmp.height * k);
          cv.getContext("2d").drawImage(bmp, 0, 0, cv.width, cv.height);
          blob = await new Promise((ok) => cv.toBlob(ok, "image/webp", 0.82));
          if (!blob || blob.type !== "image/webp") blob = await new Promise((ok) => cv.toBlob(ok, "image/jpeg", 0.85));
          tipoMime = blob.type; ext = tipoMime === "image/webp" ? "webp" : "jpg";
        } else if (file.size > 8 * 1024 * 1024) { throw new Error("El PDF pesa más de 8 MB. Tómale una foto mejor."); }
        const nombre = `${S.token}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
        const r = await fetch(`${SUPABASE_URL}/storage/v1/object/docs/${window.SLUG}/${nombre}`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": tipoMime, "x-upsert": "false" }, body: blob });
        if (!r.ok) throw new Error(r.status === 403 || r.status === 400 ? "Tu sesión venció. Cierra y vuelve a entrar con tu PIN." : "No se pudo subir. Intenta otra vez.");
        docs.push({ n: tipo === "Otro documento" ? (prompt_nombre() || "Otro documento") : tipo, url: `${SUPABASE_URL}/storage/v1/object/public/docs/${window.SLUG}/${nombre}` });
        subiendo--; pintar();
      } catch (e) { subiendo--; const el = $("#docs-err"); if (el) el.textContent = e.message && !/^(red|Failed)/.test(e.message) ? e.message : "No se pudo subir. Revisa tu conexión."; }
    }
    let nombreOtro = "";
    const prompt_nombre = () => nombreOtro;

    cuerpo.addEventListener("click", (e) => {
      const c = e.target.closest("[data-clase]");
      if (c) { F.clase = c.dataset.clase; cuerpo.querySelectorAll("[data-clase]").forEach((b) => b.classList.toggle("on", b === c)); }
      const q = e.target.closest("[data-quitar]");
      if (q) { e.preventDefault(); docs.splice(+q.dataset.quitar, 1); pintar(); }
    });
    cuerpo.addEventListener("change", (e) => {
      const i = e.target.closest("input[type=file]"); if (!i || !i.files[0]) return;
      nombreOtro = i.dataset.tipo === "Otro documento" ? ((i.files[0].name || "").replace(/\.[^.]+$/, "").slice(0, 40) || "Otro documento") : "";
      subir(i.files[0], i.dataset.tipo); i.value = "";
    });
    pie.addEventListener("click", async (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.id === "w-fin") { location.reload(); return; }
      if (b.id === "w-atras") { leer(); paso--; pintar(); return; }
      if (b.id !== "w-sig") return;
      leer();
      const p = PASOS[paso];
      const aviso = (t) => { let el = cuerpo.querySelector(".cvw-err"); if (!el) { el = document.createElement("p"); el.className = "cvw-err"; cuerpo.appendChild(el); } el.textContent = t; };
      if (p === "vehiculo") {
        if (F.propietario.length < 3) return aviso("Escribe el nombre del dueño de la tarjeta.");
        const pl = F.placa.replace(/[^A-Za-z0-9]/g, "");
        if (pl.length < 5 || pl.length > 7) return aviso("Revisa la placa (ej.: ABC123).");
        if (!F.marca) return aviso("Escribe la marca del vehículo.");
      }
      if (p === "emergencia" && F.e_tel && F.e_tel.replace(/\D/g, "").length < 7) return aviso("Revisa el celular de emergencia.");
      if (p === "docs" && subiendo) return aviso("Espera a que termine de subir…");
      if (p === "pin") {
        if (S.activar || F.pin1 || F.pin2) {
          if (!/^\d{4,6}$/.test(F.pin1)) return aviso("El PIN debe tener de 4 a 6 números.");
          if (F.pin1 === "2222") return aviso("El 2222 es el de activación. Escoge otro PIN.");
          if (F.pin1 !== F.pin2) return aviso("Los dos PIN no coinciden.");
        }
        b.disabled = true; b.textContent = "Guardando…";
        try { await guardar(); }
        catch (err) {
          b.disabled = false; b.textContent = S.activar ? "Guardar y activar" : "Guardar cambios";
          return aviso(err.message === "sesion" ? "Tu sesión venció. Cierra y vuelve a entrar con tu PIN." : err.message === "placa" ? "Revisa la placa." : "No se pudo guardar. Revisa tu conexión e intenta otra vez.");
        }
      }
      paso++; pintar();
    });
    $("#conf-x").onclick = () => {
      if (PASOS[paso] === "listo" || S.activar === false || paso === 0 || confirmarCerrar()) { hConf.classList.remove("abierta"); document.body.style.overflow = ""; if (PASOS[paso] === "listo") location.reload(); }
    };
    let avisoCerrar = 0;
    function confirmarCerrar() { // sin diálogos del navegador: segundo toque para cerrar
      if (Date.now() - avisoCerrar < 4000) return true;
      avisoCerrar = Date.now();
      const el = cuerpo.querySelector(".cvw-err") || cuerpo.appendChild(Object.assign(document.createElement("p"), { className: "cvw-err" }));
      el.textContent = "Si cierras, no se guarda lo que llevas. Toca la X otra vez para salir.";
      return false;
    }
    pintar();
  }
};
