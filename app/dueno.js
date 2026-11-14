/* Panel del dueño — LEGION Studio Digital
   Se abre tocando el logo del pie de la página. Con el código del negocio puede editar
   medios de pago y promociones, y cambiar el código en Configuración.
   Todo se valida en Supabase (dueno_entrar / dueno_guardar / dueno_cambiar_pin). */
window.LEGION_DUENO = function (N, U) {
  const { ic, esc, SUPABASE_URL, SUPABASE_KEY } = U;
  const rpc = async (fn, body) => {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify(body)
    });
    if (!r.ok) throw new Error("No hay conexión. Intenta otra vez.");
    return r.json();
  };
  const ERR = { pin: "Código incorrecto.", bloqueado: "Demasiados intentos. Espera unos minutos.", sin_pin: "Este negocio aún no tiene panel activo.", formato: "El código nuevo debe tener de 4 a 6 números." };
  const COLORES = ["#7B2CBF", "#E30613", "#00A859", "#0057B8", "#F4B400", "#FF6B00", "#111111", "#00B3B0"];
  const X = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  const BORRAR = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';

  document.querySelector(".du-fondo")?.remove();
  const fondo = document.createElement("div");
  fondo.className = "du-fondo";
  fondo.innerHTML = `<div class="du-caja" role="dialog" aria-modal="true" aria-label="Panel del negocio"></div>`;
  document.body.appendChild(fondo);
  document.body.style.overflow = "hidden";
  const caja = fondo.firstElementChild;
  const cerrar = () => { fondo.remove(); document.body.style.overflow = ""; };
  fondo.addEventListener("click", (e) => { if (e.target === fondo || e.target.closest("[data-du-cerrar]")) cerrar(); });

  let PIN = "", inicial = false;
  const logo = N.logo ? `<img src="${esc(N.logo)}" alt="">` : "";

  /* ---------- Código ---------- */
  function pantallaPin() {
    let cod = "";
    caja.innerHTML = `
      <div class="du-pin">
        <div class="du-logo">${logo}</div>
        <h3>Panel de ${esc(N.nombre)}</h3>
        <p>Escribe tu código para entrar</p>
        <div class="du-puntos" id="du-puntos"></div>
        <div class="du-teclado">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type="button" data-n="${n}">${n}</button>`).join("")}
          <button type="button" data-n="b" aria-label="Borrar">&larr;</button><button type="button" data-n="0">0</button><button type="button" class="du-ok" data-n="ok">Entrar</button></div>
        <p class="du-err" id="du-err"></p>
        <button type="button" class="du-mini" data-du-cerrar style="margin-top:8px">Cerrar</button>
      </div>`;
    const pinta = () => { document.getElementById("du-puntos").innerHTML = Array.from({ length: Math.max(3, cod.length) }, (_, i) => `<i class="${i < cod.length ? "on" : ""}"></i>`).join(""); };
    pinta();
    const entrar = async () => {
      if (cod.length < 3) return;
      const e = document.getElementById("du-err"); e.textContent = "Verificando…";
      try {
        const r = await rpc("dueno_entrar", { p_slug: window.SLUG, p_pin: cod });
        if (r.estado !== "ok") { e.textContent = ERR[r.estado] || "No se pudo entrar."; cod = ""; pinta(); if (navigator.vibrate) navigator.vibrate(120); return; }
        PIN = cod; inicial = !!r.inicial; panel(inicial ? "config" : "promos");
      } catch (err) { e.textContent = err.message; }
    };
    caja.querySelector(".du-teclado").addEventListener("click", (ev) => {
      const b = ev.target.closest("[data-n]"); if (!b) return;
      const n = b.dataset.n;
      if (n === "ok") return entrar();
      if (n === "b") cod = cod.slice(0, -1); else if (cod.length < 6) cod += n;
      document.getElementById("du-err").textContent = ""; pinta();
    });
  }

  /* ---------- Panel ---------- */
  const copia = (v) => JSON.parse(JSON.stringify(v || []));
  let pagos = copia(N.pagos), promos = copia(N.promos || (N.promo ? [{ ...N.promo, activa: true }] : [])), nota = N.pagosNota || "";

  function panel(tab) {
    caja.innerHTML = `
      <div class="du-cab">${logo}<div><b>${esc(N.nombre)}</b><small>Panel del negocio</small></div><button type="button" class="du-x" data-du-cerrar aria-label="Cerrar">${X}</button></div>
      <div class="du-tabs">
        <button type="button" data-tab="promos" class="${tab === "promos" ? "on" : ""}">Promociones</button>
        <button type="button" data-tab="pagos" class="${tab === "pagos" ? "on" : ""}">Pagos</button>
        <button type="button" data-tab="config" class="${tab === "config" ? "on" : ""}">Configuración</button>
      </div>
      <div id="du-cuerpo"></div>`;
    caja.querySelector(".du-tabs").addEventListener("click", (e) => { const b = e.target.closest("[data-tab]"); if (b) panel(b.dataset.tab); });
    const c = document.getElementById("du-cuerpo");
    if (tab === "promos") vistaPromos(c);
    if (tab === "pagos") vistaPagos(c);
    if (tab === "config") vistaConfig(c);
  }

  function botonGuardar(c) {
    c.insertAdjacentHTML("beforeend", `<button type="button" class="du-guardar" id="du-guardar">Guardar cambios</button><p class="du-ok-msg" id="du-msg"></p>`);
    document.getElementById("du-guardar").addEventListener("click", async (e) => {
      const b = e.currentTarget, m = document.getElementById("du-msg");
      b.disabled = true; b.textContent = "Guardando…"; m.style.color = ""; m.textContent = "";
      try {
        const r = await rpc("dueno_guardar", { p_slug: window.SLUG, p_pin: PIN, p_pagos: pagos, p_pagos_nota: nota, p_promos: promos });
        if (r !== "ok") throw new Error(ERR[r] || "No se pudo guardar.");
        m.textContent = "Guardado. Ya lo ven tus clientes.";
        setTimeout(() => location.reload(), 1300);
      } catch (err) { m.style.color = "#ff6b6b"; m.textContent = err.message; b.disabled = false; b.textContent = "Guardar cambios"; }
    });
  }

  function vistaPromos(c) {
    c.innerHTML = `<div class="du-aviso">Las promociones activas salen en tu página. Apaga una para ocultarla sin borrarla.</div>
      ${promos.map((p, i) => `
        <div class="du-item" data-i="${i}">
          <div class="du-item-top"><b>Promoción ${i + 1}</b>
            <label class="du-sw" aria-label="Activa"><input type="checkbox" data-k="activa" ${p.activa !== false ? "checked" : ""}><span></span></label>
            <button type="button" class="du-mini rojo" data-borrar>${BORRAR} Quitar</button></div>
          <label>Título<input class="du-in" data-k="titulo" maxlength="60" value="${esc(p.titulo || "")}" placeholder="Ej: Martes de pollo 2x1"></label>
          <label>Detalle<textarea class="du-in" data-k="texto" maxlength="220" placeholder="Ej: Lleva dos cuartos de pollo con papa por $ 25.000. Solo martes.">${esc(p.texto || "")}</textarea></label>
        </div>`).join("")}
      ${promos.length < 8 ? `<button type="button" class="du-add" id="du-add">+ Agregar promoción</button>` : ""}`;
    c.addEventListener("input", (e) => {
      const it = e.target.closest("[data-i]"), k = e.target.dataset.k; if (!it || !k) return;
      promos[+it.dataset.i][k] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    });
    c.addEventListener("click", (e) => {
      if (e.target.closest("#du-add")) { promos.push({ titulo: "", texto: "", activa: true }); return panel("promos"); }
      const b = e.target.closest("[data-borrar]"); if (b) { promos.splice(+b.closest("[data-i]").dataset.i, 1); panel("promos"); }
    });
    botonGuardar(c);
  }

  function vistaPagos(c) {
    c.innerHTML = `<div class="du-aviso">Así los ven tus clientes, con botón para copiar el número.</div>
      ${pagos.map((p, i) => `
        <div class="du-item" data-i="${i}">
          <div class="du-item-top"><b>Medio ${i + 1}</b><button type="button" class="du-mini rojo" data-borrar>${BORRAR} Quitar</button></div>
          <label>Nombre<input class="du-in" data-k="t" maxlength="30" value="${esc(p.t || "")}" placeholder="Nequi, Daviplata, Bancolombia…"></label>
          <label>Número o llave<input class="du-in" data-k="v" maxlength="40" inputmode="text" value="${esc(p.v || "")}" placeholder="300 000 0000"></label>
          <label>A nombre de (opcional)<input class="du-in" data-k="a" maxlength="50" value="${esc(p.a || "")}" placeholder="Titular de la cuenta"></label>
          <label>Color<div class="du-colores">${COLORES.map((k) => `<button type="button" data-color="${k}" class="${(p.c || "").toUpperCase() === k ? "on" : ""}" style="background:${k}" aria-label="Color ${k}"></button>`).join("")}</div></label>
        </div>`).join("")}
      ${pagos.length < 8 ? `<button type="button" class="du-add" id="du-add">+ Agregar medio de pago</button>` : ""}
      <div class="du-item"><label>Nota debajo de los pagos<textarea class="du-in" id="du-nota" maxlength="220">${esc(nota)}</textarea></label></div>`;
    c.addEventListener("input", (e) => {
      if (e.target.id === "du-nota") { nota = e.target.value; return; }
      const it = e.target.closest("[data-i]"), k = e.target.dataset.k; if (it && k) pagos[+it.dataset.i][k] = e.target.value;
    });
    c.addEventListener("click", (e) => {
      if (e.target.closest("#du-add")) { pagos.push({ t: "", v: "", c: COLORES[pagos.length % COLORES.length] }); return panel("pagos"); }
      const col = e.target.closest("[data-color]");
      if (col) { const it = col.closest("[data-i]"); pagos[+it.dataset.i].c = col.dataset.color; it.querySelectorAll("[data-color]").forEach((x) => x.classList.toggle("on", x === col)); return; }
      const b = e.target.closest("[data-borrar]"); if (b) { pagos.splice(+b.closest("[data-i]").dataset.i, 1); panel("pagos"); }
    });
    botonGuardar(c);
  }

  function vistaConfig(c) {
    c.innerHTML = `
      ${inicial ? `<div class="du-aviso"><b>Cambia tu código.</b> Aún tienes el código de entrega; pon uno tuyo de 4 a 6 números que solo tú conozcas.</div>` : ""}
      <div class="du-item">
        <div class="du-item-top"><b>Cambiar código de entrada</b></div>
        <label>Código nuevo<input class="du-in" id="du-n1" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" placeholder="4 a 6 números"></label>
        <label>Repite el código nuevo<input class="du-in" id="du-n2" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password"></label>
        <button type="button" class="du-guardar" id="du-cambiar" style="position:static;box-shadow:none">Cambiar código</button>
        <p class="du-ok-msg" id="du-msg"></p>
      </div>
      <div class="du-item"><div class="du-item-top"><b>¿Necesitas cambiar el menú, fotos o el diseño?</b></div>
        <a class="du-mini" style="justify-self:start" href="https://wa.me/573234953988?text=${encodeURIComponent("Hola LEGION, soy de " + N.nombre + " y necesito un cambio en mi página")}" target="_blank" rel="noopener">Escríbele a LEGION Studio</a></div>`;
    document.getElementById("du-cambiar").addEventListener("click", async (e) => {
      const a = document.getElementById("du-n1").value.trim(), b2 = document.getElementById("du-n2").value.trim(), m = document.getElementById("du-msg"), b = e.currentTarget;
      m.style.color = "#ff6b6b";
      if (!/^\d{4,6}$/.test(a)) return (m.textContent = ERR.formato);
      if (a !== b2) return (m.textContent = "Los dos códigos no coinciden.");
      b.disabled = true; b.textContent = "Cambiando…";
      try {
        const r = await rpc("dueno_cambiar_pin", { p_slug: window.SLUG, p_pin: PIN, p_nuevo: a });
        if (r !== "ok") throw new Error(ERR[r] || "No se pudo cambiar.");
        PIN = a; inicial = false; m.style.color = ""; m.textContent = "Listo. Desde ahora entras con tu código nuevo.";
        document.getElementById("du-n1").value = document.getElementById("du-n2").value = "";
      } catch (err) { m.textContent = err.message; }
      b.disabled = false; b.textContent = "Cambiar código";
    });
  }

  pantallaPin();
};
