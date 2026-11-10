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
    llave: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/>'
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

  raiz.innerHTML = `
  <main class="cv">
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
  </main>

  <div class="cv-modal" id="m-pin" role="dialog" aria-modal="true" aria-label="PIN">
    <div class="cv-caja">
      <span class="cv-docs-ic grande">${ic("candado")}</span>
      <h3>Documentos de ${esc(placaFmt)}</h3>
      <p>Escribe el PIN del dueño</p>
      <div class="cv-puntos" id="cv-puntos"></div>
      <p class="cv-err" id="cv-err"></p>
      <div class="cv-tecl" id="cv-tecl">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "⌫", 0, "OK"].map((k) => `<button type="button" data-k="${k}">${k}</button>`).join("")}</div>
      <button type="button" class="cv-cerrar" data-cerrar>Cancelar</button>
    </div>
  </div>

  <div class="cv-hoja" id="h-docs" role="dialog" aria-modal="true" aria-label="Documentos">
    <div class="cv-hoja-top"><button type="button" class="cv-x" data-cerrar-docs aria-label="Cerrar">${ic("x")}</button><h2>Documentos · ${esc(placaFmt)}</h2></div>
    <div class="cv-hoja-cuerpo" id="docs-lista"></div>
  </div>`;

  /* ----- PIN y documentos ----- */
  const mPin = $("#m-pin"), hDocs = $("#h-docs");
  let escrito = "";
  const puntos = () => ($("#cv-puntos").innerHTML = Array.from({ length: Math.max(4, escrito.length) }, (_, i) => `<i class="${i < escrito.length ? "on" : ""}"></i>`).join(""));
  puntos();
  $("#ver-docs").addEventListener("click", () => { escrito = ""; puntos(); $("#cv-err").textContent = ""; mPin.classList.add("abierta"); });
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
};
