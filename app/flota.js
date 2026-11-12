/* Carpeta Vial Flotas — página pública de un bus (tarjeta NFC/QR de la flota) — LEGION Studio Digital
   Muestra el vehículo y TODOS sus documentos vigentes (sin PIN: es lo que revisa el agente o el inspector).
   Los documentos los actualiza la empresa desde su panel; la tarjeta impresa nunca cambia. */
window.LEGION_FLOTA = function (N, raiz) {
  const B = N.bus || {}, E = N.empresa || {}, DOCS = N.docs || [];
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const SVG = {
    doc: '<path d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"/><path d="M14 3v4h4M9.5 12.5h5M9.5 16h5"/>',
    ok: '<path d="m5.5 12.5 4 4 9-9.5"/>',
    alerta: '<path d="M12 4 3 19.5h18L12 4Z"/><path d="M12 10v4.2M12 17v.3"/>',
    x: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    nfc: '<path d="M7 7.5a6.5 6.5 0 0 1 0 9M10.5 5a10 10 0 0 1 0 14M14 3a13.5 13.5 0 0 1 0 18"/>',
    abrir: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    bajar: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
    escudo: '<path d="M12 3 4.5 6v5.5c0 4.8 3.2 8 7.5 9.5 4.3-1.5 7.5-4.7 7.5-9.5V6L12 3Z"/><path d="m9 12 2 2 4-4"/>',
    reloj: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    bus: '<rect x="4" y="3.5" width="16" height="14" rx="2.5"/><path d="M4 11h16M8 17.5v2.5M16 17.5v2.5"/><circle cx="8" cy="14.3" r=".9" fill="currentColor"/><circle cx="16" cy="14.3" r=".9" fill="currentColor"/>',
    buscar: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    ley: '<path d="M12 3v18M5 21h14M6 7h12M6 7l-3 7a3 3 0 0 0 6 0L6 7ZM18 7l-3 7a3 3 0 0 0 6 0l-3-7Z"/>',
    tel: '<path d="M6 3.5h3.2l1.6 4.3-2.2 1.4a11 11 0 0 0 6.2 6.2l1.4-2.2 4.3 1.6V18a2.5 2.5 0 0 1-2.5 2.5A16.5 16.5 0 0 1 3.5 6 2.5 2.5 0 0 1 6 3.5Z"/>',
    wa: '<path d="M4 20l1.3-4A8 8 0 1 1 8 18.8L4 20Z"/><path d="M9 9.5c.3 2.2 2.3 4.3 4.8 5l1.2-1.3-1.8-1-1 .6a4.5 4.5 0 0 1-2-2l.6-1-1-1.8L9 9.5Z"/>',
    radio: '<rect x="5" y="8" width="14" height="13" rx="2"/><path d="M8 8 15 3M9 13h6M9 16.5h6"/>'
  };
  const ic = (n) => `<svg class="fl-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SVG[n]}</svg>`;

  if (!document.getElementById("fl-css")) document.head.appendChild(Object.assign(document.createElement("link"), { id: "fl-css", rel: "stylesheet", href: "/app/flota.css?v=2" }));
  document.head.appendChild(Object.assign(document.createElement("link"), { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800;900&display=swap" }));
  document.title = `Móvil ${B.movil || ""} · ${B.interno || ""} · ${E.nombre || "Flota"}`;
  document.body.className = "fl";
  document.body.style.setProperty("--c", E.color || "#1F4FBF");
  document.body.style.setProperty("--a", E.acento || "#F2C200");
  const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.content = E.color || "#1F4FBF";

  // Estado de cada documento según su fecha de vencimiento
  const hoy = new Date(); hoy.setHours(0, 0, 0, 0);
  const dias = (f) => Math.round((new Date(f + "T00:00:00") - hoy) / 864e5);
  const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const fecha = (f) => { const [a, m, d] = f.split("-"); return `${+d} ${MES[m - 1]} ${a}`; };
  const estado = (d) => {
    if (!d.hasta) return { k: "ok", t: "Vigente" };
    const n = dias(d.hasta);
    if (n < 0) return { k: "mal", t: `Vencido hace ${-n} día${n === -1 ? "" : "s"}` };
    if (n === 0) return { k: "mal", t: "Vence hoy" };
    if (n <= 30) return { k: "ojo", t: `Vence en ${n} día${n === 1 ? "" : "s"}` };
    return { k: "ok", t: "Vigente" };
  };
  const L = DOCS.map((d) => ({ ...d, e: estado(d) }));
  const nMal = L.filter((d) => d.e.k === "mal").length, nOjo = L.filter((d) => d.e.k === "ojo").length, nOk = L.length - nMal - nOjo;
  const resumen = nMal ? { k: "mal", t: `${nMal} documento${nMal > 1 ? "s" : ""} vencido${nMal > 1 ? "s" : ""}`, s: "La empresa ya recibió la alerta para renovarlo." }
    : nOjo ? { k: "ojo", t: "Documentos vigentes", s: `${nOjo} por renovar en los próximos 30 días. La empresa ya tiene la alerta.` }
    : { k: "ok", t: "Documentos al día", s: "Todos los documentos del vehículo están vigentes." };

  const act = N.actualizado ? new Date(N.actualizado) : null;
  const actTxt = act ? act.toLocaleString("es-CO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" }) : "";

  raiz.innerHTML = `
  ${N.demo ? `<div class="fl-demo">Demostración · los documentos son de ejemplo</div>` : ""}
  <header class="fl-top">
    <span class="fl-marca">${E.logo ? `<img src="${esc(E.logo)}" alt="">` : `<b>${esc(E.nombre || "")}</b>`}<small>Carpeta digital<br>del vehículo</small></span>
    <span class="fl-nfc">${ic("nfc")} Tarjeta ${esc(B.movil || "")}</span>
  </header>
  <section class="fl-hero" style="--foto:url('${esc(B.foto || "")}')">
    <div class="fl-hero-txt">
      <span class="fl-chip">${ic("bus")} ${esc(B.tipo || "Bus")}</span>
      <h1><small>Móvil</small>${esc(B.movil || "")}</h1>
      <div class="fl-ids">
        <span class="fl-placa"><b>${esc(B.placa || "")}</b><small>${esc(B.ciudad || "BOGOTÁ D.C.")}</small></span>
        <span class="fl-int"><small>No. interno</small><b>${esc(B.interno || "")}</b></span>
      </div>
    </div>
  </section>
  <div class="fl-franja"></div>

  <main class="fl-main">
    <section class="fl-estado ${resumen.k}">
      <span class="fl-estado-ic">${ic(resumen.k === "ok" ? "escudo" : "alerta")}</span>
      <div><b>${resumen.t}</b><p>${resumen.s}</p></div>
      <div class="fl-cont"><i class="ok">${nOk}</i><i class="ojo">${nOjo}</i><i class="mal">${nMal}</i></div>
    </section>

    ${(N.contactos || []).length ? `<section class="fl-contactos">
      <h2 class="fl-h">${ic("radio")} Novedades del vehículo</h2>
      ${N.contactos.map((c) => `<div class="fl-contacto">
        <span><b>${esc(c.t)}</b><small>${esc(c.s || "")}</small></span>
        <a href="tel:${esc(c.tel)}" aria-label="Llamar">${ic("tel")}</a>
        ${c.wa !== false ? `<a href="https://wa.me/57${esc(c.tel)}?text=${encodeURIComponent(`Novedad del móvil ${B.movil} (${B.interno}, placa ${B.placa}): `)}" target="_blank" rel="noopener" class="wa" aria-label="WhatsApp">${ic("wa")}</a>` : ""}
      </div>`).join("")}
    </section>` : ""}

    <section class="fl-datos">
      ${[["Marca y línea", B.marca], ["Modelo", B.modelo], ["Capacidad", B.capacidad], ["Servicio", B.servicio], ["Patio", B.patio], ["Combustible", B.combustible]].filter((x) => x[1]).map(([a, b]) => `<div><small>${a}</small><b>${esc(b)}</b></div>`).join("")}
    </section>

    <h2 class="fl-h">Documentos del vehículo <span>${L.length}</span></h2>
    <div class="fl-docs">
      ${L.map((d, i) => `
      <button class="fl-doc" data-i="${i}">
        <span class="fl-mini" style="background-image:url('${esc(d.mini || "")}')"></span>
        <span class="fl-doc-txt">
          <b>${esc(d.t)}</b>
          <small>${esc([d.ent, d.num].filter(Boolean).join(" · "))}</small>
          <span class="fl-vence ${d.e.k}">${ic(d.e.k === "ok" ? "ok" : d.e.k === "ojo" ? "reloj" : "alerta")} ${d.e.t}${d.hasta ? ` · <em>hasta ${fecha(d.hasta)}</em>` : ""}</span>
        </span>
      </button>`).join("")}
    </div>

    <section class="fl-ley">
      <span>${ic("ley")}</span>
      <div><b>Documentos exhibidos en formato digital</b>
      <p>De acuerdo con la <strong>Ley 2251 de 2022</strong>, la autoridad de tránsito verifica el SOAT, la revisión técnico-mecánica y de gases y la licencia de tránsito en sus sistemas de información (RUNT), sin exigir su presentación en físico. Las pólizas y la tarjeta de operación se exhiben aquí como copia digital vigente, cargada y actualizada por ${esc(E.nombre || "la empresa")}.</p></div>
    </section>

    <a class="fl-runt" href="https://www.runt.gov.co/" target="_blank" rel="noopener">${ic("buscar")}<span><b>Verificación oficial en el RUNT</b><small>El SOAT y la revisión técnico-mecánica también se pueden consultar con la placa.</small></span>${ic("abrir")}</a>

    <footer class="fl-pie">
      ${actTxt ? `<p>${ic("reloj")} Actualizado por ${esc(N.actualizado_por || "la empresa")} · ${actTxt}</p>` : ""}
      <p>Los documentos los mantiene al día ${esc(E.nombre || "la empresa")} desde su panel. Esta tarjeta siempre muestra la versión vigente.</p>
      <small>Tecnología LEGION Studio · Carpeta Vial Flotas</small>
    </footer>
  </main>

  <div class="fl-visor" id="visor" hidden>
    <div class="fl-visor-caja">
      <header><div><b id="v-t"></b><small id="v-s"></small></div><button id="v-x" aria-label="Cerrar">${ic("x")}</button></header>
      <div class="fl-visor-img"><img id="v-img" alt=""></div>
      <div class="fl-visor-acc">
        <a id="v-abrir" class="fl-btn" target="_blank" rel="noopener">${ic("abrir")} Abrir PDF</a>
        <a id="v-bajar" class="fl-btn sec" download>${ic("bajar")} Descargar</a>
      </div>
    </div>
  </div>`;

  const visor = document.getElementById("visor");
  const abrir = (d) => {
    document.getElementById("v-t").textContent = d.t;
    document.getElementById("v-s").textContent = [d.num, d.hasta ? "Vigente hasta " + fecha(d.hasta) : ""].filter(Boolean).join(" · ");
    document.getElementById("v-img").src = (d.mini || "").replace("-t.webp", "-g.webp");
    document.getElementById("v-img").onerror = function () { this.onerror = null; this.src = d.mini; };
    document.getElementById("v-abrir").href = d.url;
    document.getElementById("v-bajar").href = d.url;
    visor.hidden = false; requestAnimationFrame(() => visor.classList.add("on"));
    document.body.style.overflow = "hidden";
  };
  const cerrar = () => { visor.classList.remove("on"); document.body.style.overflow = ""; setTimeout(() => (visor.hidden = true), 200); };
  raiz.querySelectorAll(".fl-doc").forEach((b) => b.addEventListener("click", () => abrir(L[+b.dataset.i])));
  document.getElementById("v-x").addEventListener("click", cerrar);
  visor.addEventListener("click", (e) => { if (e.target === visor) cerrar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !visor.hidden) cerrar(); });
};
