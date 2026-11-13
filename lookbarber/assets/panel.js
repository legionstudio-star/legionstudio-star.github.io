/* Club Look · panel de la barbería (oficial). */
(() => {
  const { A, BARBEROS, SERVICIOS, esc, pesos, nombre1, iniciales, dias, fecha, I, SV, sellos, toast, confeti, ls } = LK;
  const $app = document.getElementById("app");
  // Dentro del panel de barberos de Look (iframe): token y barbero llegan en el hash
  const H = new URLSearchParams(location.hash.slice(1)), EMB = H.has("tk");
  if (EMB) { ls.set("lk_tk", H.get("tk")); if (H.get("b")) ls.set("lk_barbero", H.get("b")); history.replaceState(null, "", location.pathname + location.search); document.body.classList.add("emb"); }
  let TK = ls.get("lk_tk"), tab = "atender", barbero = ls.get("lk_barbero") || BARBEROS[0].id, servicio = 0, M = null, stream = null;

  async function rpc(fn, args) {
    try { return await LK.rpc(fn, Object.assign({ p_token: TK }, args)); }
    catch (e) { if (/Sesi[oó]n vencida/.test(e.message)) { ls.del("lk_tk"); TK = null; EMB ? vencida() : login(); } throw e; }
  }
  const wa = (tel, txt) => `https://wa.me/57${tel}?text=${encodeURIComponent(txt)}`;

  function vencida() { $app.innerHTML = `<p class="warn" style="margin-top:30vh;text-align:center">La sesión del club venció. Sal del panel y vuelve a entrar con tu PIN.</p>`; }
  function login(err) {
    if (EMB) return vencida();
    let pin = "";
    $app.innerHTML = `<div class="stack fade-in" style="padding-top:8vh">
      <div style="text-align:center"><img src="${A}logo.webp" alt="" style="width:110px"><h1 class="h-display" style="margin:10px 0 2px">Panel <span class="red-t">Club Look</span></h1><p class="muted">Solo para la barbería</p></div>
      <div class="pin" id="pin"><div class="dots">${"<i></i>".repeat(4)}</div>
        <div class="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0, "x"].map((k) => k === "" ? "<span></span>" : `<button data-k="${k}">${k === "x" ? "Borrar" : k}</button>`).join("")}</div></div>
      ${err ? `<p class="warn" style="text-align:center">${esc(err)}</p>` : ""}</div>`;
    const dots = [...document.querySelectorAll(".dots i")], box = document.getElementById("pin");
    document.querySelector(".pad").onclick = async (e) => {
      const k = e.target.dataset.k; if (k == null) return;
      pin = k === "x" ? pin.slice(0, -1) : (pin + k).slice(0, 4);
      dots.forEach((d, i) => d.classList.toggle("f", i < pin.length));
      if (pin.length === 4) {
        try { TK = await LK.rpc("lk_admin_login", { p_pin: pin }); ls.set("lk_tk", TK); app(); }
        catch (er) { box.classList.add("err"); setTimeout(() => login(er.message), 400); }
      }
    };
  }

  function app() {
    paraCamara();
    $app.innerHTML = `<div class="stack">
      <div style="display:flex;align-items:center;gap:10px"><img src="${A}logo.webp" alt="" style="width:54px"><div style="flex:1"><b style="font-family:var(--display);font-size:20px;letter-spacing:1px">CLUB LOOK</b><div class="muted" style="font-size:12px">Panel de la barbería</div></div>${EMB ? "" : `<button class="btn ghost" id="bSalir" style="padding:8px 12px;font-size:12px">Salir</button>`}</div>
      <div class="tabs">${[["atender", "Atender"], ["clientes", "Clientes"], ...(EMB ? [] : [["ajustes", "Ajustes"]])].map(([k, t]) => `<button data-t="${k}" class="${tab === k ? "on" : ""}">${t}</button>`).join("")}</div>
      <div id="vista"></div></div>`;
    document.querySelector(".tabs").onclick = (e) => { const t = e.target.dataset.t; if (t) { tab = t; M = null; app(); } };
    if (!EMB) document.getElementById("bSalir").onclick = () => { ls.del("lk_tk"); TK = null; login(); };
    ({ atender, clientes, ajustes })[tab]();
  }
  const $v = () => document.getElementById("vista");

  /* ---------- ATENDER ---------- */
  function atender() {
    if (M) return miembro();
    $v().innerHTML = `<div class="stack fade-in">
      ${navigator.mediaDevices && navigator.mediaDevices.getUserMedia ? `<button class="btn gold block" id="bCam">${I.camara} Escanear tarjeta del cliente</button><div id="cam"></div>` : ""}
      <form id="fB" class="row" style="gap:8px"><input class="inp" id="q" placeholder="Celular, nombre o código" autocomplete="off" style="flex:3"><button class="btn dark" style="flex:1">${I.buscar}</button></form>
      <div id="res"></div></div>`;
    document.getElementById("fB").onsubmit = (e) => { e.preventDefault(); buscar(document.getElementById("q").value); };
    const bc = document.getElementById("bCam"); if (bc) bc.onclick = camara;
  }
  async function buscar(q) {
    q = q.trim(); if (!q) return; const $r = document.getElementById("res"); if ($r) $r.innerHTML = `<p class="muted">Buscando…</p>`;
    try {
      const l = await rpc("lk_admin_buscar", { p_q: q });
      if (l.length === 1) return abrir(l[0].id);
      if (!$r) return;
      $r.innerHTML = l.length ? `<div class="list">${l.map((m) => `<button class="li" data-id="${m.id}"><span class="av">${esc(iniciales(m.nombre))}</span><div class="nm"><b>${esc(m.nombre)}</b><span>${m.tel} · ${m.codigo}</span></div><span class="pill">${m.sellos} sellos</span></button>`).join("")}</div>`
        : `<p class="warn">No aparece nadie con "${esc(q)}". Pídele que escanee el QR de la tarjeta Look y se una.</p>`;
      $r.onclick = (e) => { const b = e.target.closest("[data-id]"); if (b) abrir(b.dataset.id); };
    } catch (e) { if ($r) $r.innerHTML = `<p class="warn">${esc(e.message)}</p>`; }
  }
  async function camara() {
    const $c = document.getElementById("cam");
    if (stream) return paraCamara();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      $c.innerHTML = `<div class="scan"><video id="vid" playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover"></video><div class="frame"><i></i><i></i><i></i><i></i></div><div class="laser"></div></div>`;
      const v = document.getElementById("vid"); v.srcObject = stream; await v.play();
      // Android: lector nativo. iPhone (Safari no lo trae): jsQR
      let det = null; try { if ("BarcodeDetector" in window) det = new BarcodeDetector({ formats: ["qr_code"] }); } catch (e) {}
      if (!det && !window.jsQR) await new Promise((ok, no) => { const sc = document.createElement("script"); sc.src = A + "jsqr.js"; sc.onload = ok; sc.onerror = no; document.head.appendChild(sc); });
      const cv = document.createElement("canvas"), cx = cv.getContext("2d", { willReadFrequently: true });
      const leer = async () => {
        if (det) { const r = await det.detect(v); return r.length ? r[0].rawValue : null; }
        if (!v.videoWidth) return null; const k = Math.min(1, 640 / v.videoWidth);
        cv.width = v.videoWidth * k; cv.height = v.videoHeight * k; cx.drawImage(v, 0, 0, cv.width, cv.height);
        const r = jsQR(cx.getImageData(0, 0, cv.width, cv.height).data, cv.width, cv.height, { inversionAttempts: "dontInvert" }); return r ? r.data : null;
      };
      const loop = async () => {
        if (!stream) return;
        try { const t = await leer(); if (t) { paraCamara(); if (navigator.vibrate) navigator.vibrate(80); return buscar(t); } } catch (e) {}
        setTimeout(loop, det ? 60 : 180);
      };
      loop();
    } catch (e) { $c.innerHTML = `<p class="warn">No se pudo abrir la cámara. Busca al cliente por su celular.</p>`; stream = null; }
  }
  function paraCamara() { if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; } const c = document.getElementById("cam"); if (c) c.innerHTML = ""; }

  async function abrir(id) {
    paraCamara();
    try { M = await rpc("lk_admin_miembro", { p_id: id }); tab = "atender"; app(); } catch (e) { toast(e.message); }
  }
  function miembro(popAt = -1) {
    const m = M, meta = m.meta || 5, lleno = m.sellos >= meta;
    $v().innerHTML = `<div class="stack fade-in">
      <button class="btn ghost" id="bVolver" style="align-self:flex-start;padding:8px 12px;font-size:13px">Volver</button>
      <div class="mcard">
        <div class="who" style="margin-top:0"><div><div class="s">Miembro · ${m.codigo}</div><div class="n">${esc(m.nombre)}</div></div><a class="pill green" href="${wa(m.tel, `Hola ${nombre1(m.nombre)}, te escribimos de Look Barbershop Store.`)}" target="_blank" rel="noopener">${I.wa} ${m.tel}</a></div>
        <div class="stamps cinco">${sellos(m.sellos, meta, popAt)}</div>
        <div class="progress">${lleno ? "<b>Tarjeta completa: este corte es GRATIS</b>" : `Lleva <b>${m.sellos}</b> de ${meta} · ${m.visitas} visitas · ${m.canjes} gratis`}</div>
      </div>
      <div><p class="ceja" style="margin:0 0 8px">Barbero</p><div class="chips" id="cB">${BARBEROS.map((b) => `<button data-b="${b.id}" class="${b.id === barbero ? "on" : ""}">${b.id}</button>`).join("")}</div></div>
      ${lleno ? `<p class="hint">Este cliente completó su tarjeta. Canjea su corte gratis y la tarjeta vuelve a empezar.</p>
        <button class="btn gold bigstamp" id="bCanje">${I.regalo} Canjear corte gratis</button>`
      : `<div><p class="ceja" style="margin:0 0 8px">Servicio</p><div class="chips" id="cS">${SERVICIOS.map((s, i) => `<button data-s="${i}" class="${i === servicio ? "on" : ""}">${esc(s.n)} · ${pesos(s.p)}</button>`).join("")}</div></div>
        ${m.hoy ? `<p class="warn">Ya recibió un sello en las últimas 12 horas. Solo se permite uno por visita.</p>` : ""}
        <button class="btn gold bigstamp" id="bSello" ${m.hoy ? "disabled style='opacity:.45'" : ""}>${I.tijera} Poner sello</button>`}
      ${(m.historial || []).length ? `<div class="list">${m.historial.slice(0, 8).map((h) => `<div class="li"><span class="av">${h.tipo === "canje" ? I.regalo : I.tijera}</span><div class="nm"><b>${esc(h.tipo === "canje" ? "Corte gratis" : h.tipo === "bienvenida" ? "Bienvenida" : h.tipo === "referido" ? "Por invitar" : h.servicio || "Sello")}</b><span>${h.barbero ? esc(h.barbero) : "Club"}${h.precio ? " · " + pesos(h.precio) : ""}</span></div><span class="when">${fecha(h.t)}</span></div>`).join("")}</div>` : ""}
    </div>`;
    document.getElementById("bVolver").onclick = () => { M = null; app(); };
    document.getElementById("cB").onclick = (e) => { const b = e.target.dataset.b; if (b) { barbero = b; ls.set("lk_barbero", b); miembro(); } };
    const cs = document.getElementById("cS"); if (cs) cs.onclick = (e) => { const s = e.target.closest("[data-s]"); if (s) { servicio = +s.dataset.s; miembro(); } };
    const bs = document.getElementById("bSello");
    if (bs) bs.onclick = async () => {
      bs.disabled = true; const s = SERVICIOS[servicio];
      try { M = await rpc("lk_admin_sello", { p_id: m.id, p_barbero: barbero, p_servicio: s.n, p_precio: s.p }); M = await rpc("lk_admin_miembro", { p_id: m.id });
        miembro(M.sellos - 1); toast(M.sellos >= meta ? "Tarjeta completa" : `Sello ${M.sellos} de ${meta}`); if (M.sellos >= meta) confeti(); }
      catch (e) { bs.disabled = false; toast(e.message, 3500); }
    };
    const bk = document.getElementById("bCanje");
    if (bk) bk.onclick = async () => {
      bk.disabled = true;
      try { await rpc("lk_admin_canjear", { p_id: m.id, p_barbero: barbero }); M = await rpc("lk_admin_miembro", { p_id: m.id }); confeti(); miembro(); toast("Corte gratis canjeado"); }
      catch (e) { bk.disabled = false; toast(e.message, 3500); }
    };
  }

  /* ---------- CLIENTES ---------- */
  async function clientes() {
    $v().innerHTML = `<p class="muted">Cargando…</p>`;
    let R; try { R = await rpc("lk_admin_resumen", {}); } catch (e) { $v().innerHTML = `<p class="warn">${esc(e.message)}</p>`; return; }
    const pb = Object.entries(R.por_barbero || {});
    const fila = (m, extra, msg) => `<div class="li"><span class="av">${esc(iniciales(m.nombre))}</span><button class="nm" data-id="${m.id}" style="text-align:left"><b>${esc(m.nombre)}</b><span>${extra}</span></button><a class="pill green" href="${wa(m.tel, msg(m))}" target="_blank" rel="noopener">${I.wa}</a></div>`;
    $v().innerHTML = `<div class="stack fade-in">
      <div class="kpis">
        <div class="kpi"><b>${R.miembros}</b><span>Miembros del club</span></div>
        <div class="kpi"><b>${R.nuevos_mes}</b><span>Nuevos este mes</span></div>
        <div class="kpi"><b>${R.visitas_mes}</b><span>Visitas este mes</span></div>
        <div class="kpi"><b>${R.volvieron}%</b><span>Volvieron 2 o más veces</span></div>
        <div class="kpi"><b style="font-size:24px">${pesos(R.ventas_mes)}</b><span>Ventas del mes (club)</span></div>
        <div class="kpi"><b>${R.canjes}</b><span>Cortes gratis dados</span></div>
      </div>
      ${pb.length ? `<div class="box"><p class="ceja" style="margin:0 0 8px">Visitas por barbero este mes</p>${pb.map(([b, n]) => `<div style="display:flex;justify-content:space-between;padding:6px 0"><span>${esc(b)}</span><b>${n}</b></div>`).join("")}</div>` : ""}
      ${R.cumple.length ? `<div><p class="ceja" style="margin:0 0 8px">${I.torta} Cumplen años este mes</p><div class="list">${R.cumple.map((m) => fila(m, m.tel, (x) => `Hola ${nombre1(x.nombre)}, en Look Barbershop Store sabemos que este es tu mes. Ven por tu regalo de cumpleaños del Club Look.`)).join("")}</div></div>` : ""}
      ${R.inactivos.length ? `<div><p class="ceja" style="margin:0 0 8px">${I.reloj} No han vuelto (más de 30 días)</p><div class="list">${R.inactivos.map((m) => fila(m, `Hace ${dias(m.ultima)} días · ${m.sellos} sellos`, (x) => `Hola ${nombre1(x.nombre)}, te extrañamos en Look Barbershop Store. Llevas ${x.sellos} sellos en tu Club Look, ven y sigue sumando para tu corte gratis. Agenda aquí: ${LK.AGENDA}`)).join("")}</div></div>` : ""}
      <div><p class="ceja" style="margin:0 0 8px">${I.grupo} Miembros recientes</p>${R.recientes.length ? `<div class="list">${R.recientes.map((m) => fila(m, `${m.sellos} sellos · ${fecha(m.ultima)}`, (x) => `Hola ${nombre1(x.nombre)}, te escribimos de Look Barbershop Store.`)).join("")}</div>` : `<p class="muted">Todavía no hay miembros. Los clientes se unen escaneando el QR o tocando la tarjeta Look.</p>`}</div>
    </div>`;
    $v().onclick = (e) => { const b = e.target.closest("button[data-id]"); if (b) abrir(b.dataset.id); };
  }

  /* ---------- AJUSTES ---------- */
  function ajustes() {
    $v().innerHTML = `<div class="stack fade-in">
      <form class="box stack" id="fP"><p class="ceja" style="margin:0">Cambiar PIN del panel</p>
        <input class="inp" id="p1" inputmode="numeric" maxlength="4" placeholder="Nuevo PIN (4 números)">
        <input class="inp" id="p2" inputmode="numeric" maxlength="4" placeholder="Repite el PIN">
        <button class="btn gold block">Guardar PIN</button></form>
      <div class="box stack"><p class="ceja" style="margin:0">Enlace del club para clientes</p>
        <div class="qrbox">${LK.qrSvg(LK.URL)}</div><p class="qrcap">${LK.URL.replace("https://", "")}</p>
        <a class="btn dark block" href="${LK.URL}" target="_blank" rel="noopener">Abrir página del cliente</a></div>
      <p class="muted" style="text-align:center">Club Look · Tecnología LEGION</p></div>`;
    document.getElementById("fP").onsubmit = async (e) => {
      e.preventDefault(); const a = document.getElementById("p1").value, b = document.getElementById("p2").value;
      if (!/^\d{4}$/.test(a)) return toast("El PIN debe ser de 4 números"); if (a !== b) return toast("Los PIN no coinciden");
      try { await rpc("lk_admin_cambiar_pin", { p_nuevo: a }); toast("PIN actualizado"); e.target.reset(); } catch (er) { toast(er.message, 3500); }
    };
  }

  TK ? app() : login();
})();
