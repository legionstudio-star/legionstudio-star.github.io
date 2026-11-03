/* Club 305 · demo de fidelización (Legion Estudio)
   Todo es simulado y se guarda en localStorage de este dispositivo. */
(() => {
  const KEY = "club305-demo-v1";
  const PIN = "3050";
  const META = 8; // sellos para el corte gratis
  const $app = document.getElementById("app");
  const $phone = document.getElementById("phone");
  const $notif = document.getElementById("notif");
  const $notifTxt = document.getElementById("notifTxt");

  const DIA = 864e5;
  const hoy = () => Date.now();
  const SEMILLA = [
    ["Santiago Rojas", 6, 3, 4], ["Andrés Gómez", 3, 12, 9], ["Felipe Castro", 7, 5, 2], ["Juan David Pérez", 2, 41, 11],
    ["Camilo Herrera", 5, 8, 6], ["Mateo Vargas", 1, 52, 3], ["Daniel Moreno", 4, 19, 11], ["Sebastián Ortiz", 0, 6, 7],
    ["Nicolás Ramírez", 6, 35, 1], ["Esteban Díaz", 2, 4, 11], ["Julián Torres", 5, 63, 5], ["Alejandro Ruiz", 3, 2, 12],
  ];
  const nuevoEstado = () => ({
    role: "cliente", tab: "escanear", unlocked: false, me: null,
    base: { miembros: 127, visitasMes: 342, canjes: 38 },
    members: SEMILLA.map(([name, stamps, dias, mes], i) => ({ id: String(100 + i).padStart(4, "0"), name, stamps, last: hoy() - dias * DIA, bmonth: mes, visits: stamps + 3 + (i % 4), rewards: i % 3 })),
    promos: [], recordados: [],
  });
  let S = cargar();
  let popAt = -1; // índice del sello recién puesto (animación)
  let escaneado = false;

  // Si el navegador bloquea el almacenamiento, la demo sigue funcionando en memoria.
  function cargar() { try { return JSON.parse(localStorage.getItem(KEY)) || nuevoEstado(); } catch { return nuevoEstado(); } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
  function borrar() { try { localStorage.removeItem(KEY); } catch {} }
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const iniciales = (n) => n.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const nombre1 = (n) => n.split(/\s+/)[0];
  const diasDesde = (t) => Math.floor((hoy() - t) / DIA);

  // ---------- utilidades visuales ----------
  function qrSvg(txt, color = "#0b0b0b") {
    const q = qrcode(0, "M"); q.addData(txt); q.make();
    const n = q.getModuleCount(); let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
    return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges"><path d="${d}" fill="${color}"/></svg>`;
  }
  const ICO_TIJERA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></svg>`;
  const ICO_REGALO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>`;
  const ICO_GW = `<svg viewBox="0 0 26 26"><rect x="3" y="4" width="20" height="6" rx="2" fill="#4285F4"/><rect x="3" y="8" width="20" height="6" rx="2" fill="#34A853"/><rect x="3" y="12" width="20" height="6" rx="2" fill="#FBBC04"/><rect x="3" y="16" width="20" height="6" rx="2" fill="#EA4335"/></svg>`;
  const ICO_AW = `<svg viewBox="0 0 26 26"><rect x="3" y="5" width="20" height="16" rx="3.5" fill="#fff"/><rect x="3" y="5" width="20" height="4" rx="2" fill="#30d158"/><rect x="3" y="8" width="20" height="4" rx="2" fill="#ff9f0a"/><rect x="3" y="11" width="20" height="4" rx="2" fill="#0a84ff"/><rect x="3" y="14" width="20" height="7" rx="3" fill="#d9d9d9"/></svg>`;

  let tNotif;
  function notificar(txt) {
    $notifTxt.textContent = txt;
    $notif.classList.remove("show"); void $notif.offsetWidth; $notif.classList.add("show");
    clearTimeout(tNotif); tNotif = setTimeout(() => $notif.classList.remove("show"), 4200);
    if (navigator.vibrate) navigator.vibrate(60);
  }
  function toast(txt) {
    const el = document.createElement("div"); el.className = "toast"; el.textContent = txt;
    $phone.appendChild(el); setTimeout(() => el.remove(), 2400);
  }
  function confeti() {
    const box = document.createElement("div"); box.className = "confetti";
    const cols = ["#c9a227", "#e6c868", "#f5f0e6", "#ffffff", "#8a6c12"];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement("i");
      c.style.left = Math.random() * 100 + "%"; c.style.background = cols[i % cols.length];
      c.style.animationDelay = Math.random() * 0.5 + "s"; c.style.animationDuration = 1.2 + Math.random() * 1.2 + "s";
      box.appendChild(c);
    }
    $phone.appendChild(box); setTimeout(() => box.remove(), 3000);
  }

  // ---------- render principal ----------
  function render() {
    document.querySelectorAll(".roles button").forEach((b) => b.classList.toggle("on", b.dataset.role === S.role));
    if (S.role === "cliente") S.me ? vistaTarjeta() : vistaUnirse();
    else S.unlocked ? vistaPanel() : vistaPin();
    guardar();
  }

  // ---------- CLIENTE ----------
  function vistaUnirse() {
    $app.innerHTML = `
      <div class="stack fade-in">
        <div class="hero">
          <img src="assets/logo-305.png" alt="305 Barbering">
          <h1>Club <span class="gold-t">305</span></h1>
          <p>Cada corte suma. Al <b class="gold-t">${META}°</b> sello tu corte va por la casa.</p>
        </div>
        <div class="perks">
          <div class="perk"><span class="ic">✂️</span><div><b>Corte gratis</b><span>Al completar ${META} sellos</span></div></div>
          <div class="perk"><span class="ic">🎂</span><div><b>Regalo de cumpleaños</b><span>Tu barba va por la casa ese mes</span></div></div>
          <div class="perk"><span class="ic">📲</span><div><b>Tarjeta en tu celular</b><span>Google Wallet o Apple Wallet · sin descargar apps</span></div></div>
        </div>
        <form class="box stack" id="fJoin" autocomplete="off">
          <div><label class="f" for="jn">Nombre</label><input class="inp" id="jn" required maxlength="40" placeholder="Ej: Carlos Méndez"></div>
          <div><label class="f" for="jt">WhatsApp</label><input class="inp" id="jt" required inputmode="numeric" maxlength="14" placeholder="300 123 4567"></div>
          <div><label class="f" for="jb">Mes de cumpleaños</label>
            <select class="inp" id="jb">${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m, i) => `<option value="${i + 1}" ${i === new Date().getMonth() ? "selected" : ""}>${m}</option>`).join("")}</select></div>
          <label class="check"><input type="checkbox" id="jc" checked> Acepto recibir mis sellos y promociones del Club 305.</label>
          <button class="btn gold block" type="submit">Unirme gratis</button>
          <p class="muted" style="text-align:center;margin-top:8px">🎁 Te regalamos tu primer sello al unirte</p>
        </form>
      </div>`;
    document.getElementById("fJoin").onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("jn").value.trim().replace(/\s+/g, " ");
      if (!name || !document.getElementById("jc").checked) return;
      S.me = { id: String(S.base.miembros + 1).padStart(4, "0"), name, phone: document.getElementById("jt").value.trim(),
               bmonth: +document.getElementById("jb").value, stamps: 1, visits: 1, rewards: 0, last: hoy(), joined: hoy(), wallet: {} };
      popAt = 0;
      render();
      setTimeout(() => notificar(`¡Bienvenido al Club 305, ${nombre1(name)}! Tu primer sello ya está en tu tarjeta ✂️`), 400);
    };
  }

  function sellosHtml(n) {
    return Array.from({ length: META }, (_, i) => {
      const last = i === META - 1;
      return `<span class="stamp ${i < n ? "on" : ""} ${last ? "last" : ""} ${i === popAt ? "pop" : ""}">${last ? ICO_REGALO : ICO_TIJERA}</span>`;
    }).join("");
  }

  function vistaTarjeta() {
    const m = S.me, falta = META - m.stamps, lleno = m.stamps >= META;
    $app.innerHTML = `
      <div class="stack fade-in">
        <div class="mcard">
          <div class="top"><img src="assets/logo-305.png" alt=""><div><div class="t1">CLUB 305</div><div class="t2">Barbering · Miembro</div></div></div>
          <div class="who"><div><div class="s">Miembro</div><div class="n">${esc(m.name)}</div></div><div style="text-align:right"><div class="s">N°</div><b>${m.id}</b></div></div>
          <div class="stamps">${sellosHtml(m.stamps)}</div>
          <div class="progress">${lleno ? `<b>¡Tarjeta completa!</b>` : `Te ${falta === 1 ? "falta" : "faltan"} <b>${falta}</b> ${falta === 1 ? "corte" : "cortes"} para tu corte <b>GRATIS</b>`}</div>
        </div>
        ${lleno ? `<div class="reward fade-in"><h3>🎉 Corte gratis desbloqueado</h3><p style="margin:6px 0 0;font-weight:600">Muéstrale este código a tu barbero</p></div>` : ""}
        <div class="box">
          <div class="qrbox">${qrSvg("CLUB305-" + m.id)}</div>
          <p class="qrcap">MUESTRA ESTE CÓDIGO EN CADA VISITA · ${m.id}</p>
        </div>
        <div class="stack">
          <button class="wbtn ${m.wallet.google ? "added" : ""}" data-w="google">${ICO_GW}${m.wallet.google ? "✓ Guardada en Google Wallet" : "Agregar a Google Wallet"}</button>
          <button class="wbtn ${m.wallet.apple ? "added" : ""}" data-w="apple">${ICO_AW}${m.wallet.apple ? "✓ Guardada en Apple Wallet" : "Agregar a Apple Wallet"}</button>
        </div>
        <p class="hint">👉 Para la demo: pasa a <b>✂️ Barbería</b>, escanea esta tarjeta y ponle un sello. La notificación le llega aquí al instante.</p>
        <div class="row"><div class="kpi"><b>${m.visits}</b><span>Visitas</span></div><div class="kpi"><b>${m.rewards}</b><span>Cortes gratis</span></div></div>
      </div>`;
    popAt = -1;
    $app.querySelectorAll("[data-w]").forEach((b) => (b.onclick = () => abrirWallet(b.dataset.w)));
  }

  function abrirWallet(tipo) {
    const m = S.me, g = tipo === "google";
    const w = document.createElement("div");
    w.className = `wallet ${tipo}`;
    w.innerHTML = `
      <div class="wtop"><b>${g ? "Google Wallet" : "Wallet"}</b><button>Listo</button></div>
      <div class="wbody">
        <div class="pass">
          <div class="ph"><img src="assets/logo-305.png" alt=""><span class="pt">CLUB 305</span><span class="pv">Sellos<b>${m.stamps}/${META}</b></span></div>
          <div class="pbanner"><img src="assets/logo-305.png" alt=""></div>
          <div class="pf">
            <div><p>Miembro</p><b>${esc(m.name)}</b></div>
            <div><p>Premio</p><b>Corte gratis</b></div>
            <div><p>Visitas</p><b>${m.visits}</b></div>
            <div><p>N° miembro</p><b>${m.id}</b></div>
          </div>
          <div class="pq">${qrSvg("CLUB305-" + m.id)}<span>CLUB305-${m.id}</span></div>
        </div>
        <div class="wok">✓ ${g ? "Guardada en Google Wallet" : "Agregada a Apple Wallet"}</div>
        <p class="wnote">Se actualiza sola cada vez que te ponen un sello.<br>Las promociones de 305 te llegan como notificación.</p>
      </div>`;
    w.querySelector(".wtop button").onclick = () => { w.remove(); render(); };
    $phone.appendChild(w);
    if (!m.wallet[tipo]) { m.wallet[tipo] = true; guardar(); setTimeout(() => notificar("Tu tarjeta Club 305 quedó guardada en el celular 📲"), 700); }
  }

  // ---------- BARBERÍA ----------
  let pinTxt = "";
  function vistaPin() {
    $app.innerHTML = `
      <div class="pin fade-in" id="pinBox">
        <img src="assets/logo-305.png" alt="">
        <h2 class="h-display" style="margin-top:10px">Panel barbería</h2>
        <p class="muted">Ingresa el PIN del local</p>
        <div class="dots">${[0, 1, 2, 3].map((i) => `<i class="${i < pinTxt.length ? "f" : ""}"></i>`).join("")}</div>
        <div class="pad">${["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k) => k ? `<button data-k="${k}">${k}</button>` : "<span></span>").join("")}</div>
        <p class="hint" style="margin-top:22px">PIN de la demo: <b>3050</b></p>
      </div>`;
    $app.querySelectorAll("[data-k]").forEach((b) => (b.onclick = () => {
      const k = b.dataset.k;
      pinTxt = k === "⌫" ? pinTxt.slice(0, -1) : (pinTxt + k).slice(0, 4);
      if (pinTxt.length === 4) {
        if (pinTxt === PIN) { pinTxt = ""; S.unlocked = true; render(); return; }
        vistaPin(); const box = document.getElementById("pinBox"); box.classList.add("err");
        setTimeout(() => { pinTxt = ""; vistaPin(); }, 450); return;
      }
      vistaPin();
    }));
  }

  function vistaPanel() {
    const tabs = [["escanear", "📷 Escanear"], ["clientes", "📊 Clientes"], ["promos", "📣 Promos"]];
    $app.innerHTML = `
      <div class="stack fade-in">
        <div style="display:flex;align-items:center;gap:12px">
          <img src="assets/logo-305.png" alt="" style="width:46px">
          <div style="flex:1"><h2 class="h-display" style="font-size:22px">Panel 305</h2><span class="muted">${new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</span></div>
          <button class="btn ghost" id="bSalir" style="padding:8px 12px;font-size:13px">Salir</button>
        </div>
        <div class="tabs">${tabs.map(([k, t]) => `<button data-t="${k}" class="${S.tab === k ? "on" : ""}">${t}</button>`).join("")}</div>
        <div id="tabBody"></div>
      </div>`;
    $app.querySelectorAll("[data-t]").forEach((b) => (b.onclick = () => { S.tab = b.dataset.t; escaneado = false; render(); }));
    document.getElementById("bSalir").onclick = () => { S.unlocked = false; render(); };
    ({ escanear: tabEscanear, clientes: tabClientes, promos: tabPromos })[S.tab]();
  }

  function tabEscanear() {
    const $b = document.getElementById("tabBody"), m = S.me;
    if (!m) {
      $b.innerHTML = `<div class="box stack"><p class="warn">Aún no hay un cliente en la demo.</p>
        <p class="muted">Pasa a <b>📱 Cliente</b>, únete al club y vuelve aquí para escanear su tarjeta.</p>
        <button class="btn gold block" id="bIrCliente">Ir a la vista Cliente</button></div>`;
      document.getElementById("bIrCliente").onclick = () => { S.role = "cliente"; render(); };
      return;
    }
    if (!escaneado) {
      $b.innerHTML = `
        <div class="stack">
          <div class="scan"><div class="frame"><i></i><i></i><i></i><i></i><div class="laser"></div></div>
            <div class="qrghost" style="position:absolute">${qrSvg("CLUB305-" + m.id)}</div></div>
          <button class="btn gold block" id="bScan">📷 Escanear tarjeta del cliente</button>
          <p class="muted" style="text-align:center">En el local se usa la cámara del celular o la tablet de la caja.</p>
        </div>`;
      document.getElementById("bScan").onclick = () => {
        const sc = $b.querySelector(".scan"); const ok = document.createElement("div"); ok.className = "ok"; ok.textContent = "✓"; sc.appendChild(ok);
        if (navigator.vibrate) navigator.vibrate(40);
        setTimeout(() => { escaneado = true; tabEscanear(); }, 650);
      };
      return;
    }
    const lleno = m.stamps >= META;
    $b.innerHTML = `
      <div class="stack fade-in">
        <div class="box" style="display:flex;align-items:center;gap:12px">
          <span class="av" style="width:52px;height:52px;font-size:18px">${iniciales(m.name)}</span>
          <div style="flex:1;min-width:0"><b style="font-size:17px">${esc(m.name)}</b><div class="muted">Miembro N° ${m.id} · ${m.visits} visitas</div></div>
          <span class="pill ${lleno ? "green" : ""}">${m.stamps}/${META}</span>
        </div>
        <div class="mcard" style="padding:14px"><div class="stamps" style="margin-top:0">${sellosHtml(m.stamps)}</div><div style="height:10px"></div></div>
        ${lleno
          ? `<p class="hint">🎁 Este cliente tiene un <b>corte gratis</b> disponible.</p><button class="bigstamp btn green" id="bCanje">🎁 Canjear corte gratis</button>`
          : `<button class="bigstamp btn gold" id="bSello">✂️ Poner sello</button>`}
        <div class="row">
          <button class="btn dark" id="bLlenar" ${lleno ? "disabled" : ""}>⚡ Llenar tarjeta</button>
          <button class="btn ghost" id="bOtro">Escanear otro</button>
        </div>
        <p class="muted" style="text-align:center">⚡ es solo para la demo: deja la tarjeta lista para mostrar el canje.</p>
      </div>`;
    const sello = document.getElementById("bSello"), canje = document.getElementById("bCanje");
    if (sello) sello.onclick = () => ponerSello();
    if (canje) canje.onclick = () => {
      m.stamps = 0; m.rewards++; m.visits++; m.last = hoy(); S.base.canjes++; S.base.visitasMes++;
      confeti(); toast("Corte gratis canjeado ✓"); render();
      setTimeout(() => notificar(`🎁 ¡Disfruta tu corte gratis, ${nombre1(m.name)}! Tu nueva tarjeta ya empezó.`), 500);
    };
    document.getElementById("bLlenar").onclick = () => { m.stamps = META - 1; ponerSello(); };
    document.getElementById("bOtro").onclick = () => { escaneado = false; tabEscanear(); };
  }

  function ponerSello() {
    const m = S.me;
    if (m.stamps >= META) return;
    popAt = m.stamps; m.stamps++; m.visits++; m.last = hoy(); S.base.visitasMes++;
    render();
    const f = META - m.stamps;
    if (f === 0) { confeti(); setTimeout(() => notificar(`🎉 ¡Completaste tu tarjeta, ${nombre1(m.name)}! Tu próximo corte es GRATIS.`), 300); }
    else setTimeout(() => notificar(`✂️ ¡Sello agregado! Llevas ${m.stamps} de ${META}. Te ${f === 1 ? "falta 1" : "faltan " + f} para tu corte gratis.`), 300);
    popAt = -1;
  }

  function todos() { return S.me ? [{ ...S.me, yo: true }, ...S.members] : S.members; }

  function tabClientes() {
    const $b = document.getElementById("tabBody");
    const lista = todos();
    const inactivos = lista.filter((m) => diasDesde(m.last) >= 30).sort((a, b) => a.last - b.last);
    const mes = new Date().getMonth() + 1;
    const cumple = lista.filter((m) => m.bmonth === mes);
    const miembros = S.base.miembros + (S.me ? 1 : 0);
    $b.innerHTML = `
      <div class="stack fade-in">
        <div class="kpis">
          <div class="kpi"><b>${miembros}</b><span>Miembros del club</span></div>
          <div class="kpi"><b>${S.base.visitasMes}</b><span>Visitas este mes</span></div>
          <div class="kpi"><b>68%</b><span>Clientes que volvieron</span></div>
          <div class="kpi"><b>${S.base.canjes}</b><span>Cortes gratis canjeados</span></div>
        </div>
        <div>
          <h3 class="h-display" style="font-size:17px;margin-bottom:8px">⏰ No han vuelto (30+ días)</h3>
          <div class="list">${inactivos.map((m) => `
            <div class="li"><span class="av">${iniciales(m.name)}</span><div class="nm"><b>${esc(m.name)}</b><span>${m.stamps}/${META} sellos</span></div>
              <span class="pill red">${diasDesde(m.last)} días</span>
              <button class="btn ${S.recordados.includes(m.id) ? "dark" : "gold"}" data-rec="${m.id}" style="padding:8px 10px;font-size:12px" ${S.recordados.includes(m.id) ? "disabled" : ""}>${S.recordados.includes(m.id) ? "Enviado" : "Recordar"}</button></div>`).join("")}</div>
          <p class="muted" style="margin-top:6px">El recordatorio les llega al Wallet: "Te extrañamos, tu próximo sello te espera".</p>
        </div>
        ${cumple.length ? `<div><h3 class="h-display" style="font-size:17px;margin-bottom:8px">🎂 Cumplen años este mes</h3>
          <div class="list">${cumple.map((m) => `<div class="li"><span class="av">${iniciales(m.name)}</span><div class="nm"><b>${esc(m.name)}${m.yo ? " (tú)" : ""}</b><span>Regalo: barba gratis</span></div><span class="pill">🎂</span></div>`).join("")}</div></div>` : ""}
        <div>
          <h3 class="h-display" style="font-size:17px;margin-bottom:8px">👥 Miembros recientes</h3>
          <div class="list">${lista.slice().sort((a, b) => b.last - a.last).map((m) => `
            <div class="li"><span class="av">${iniciales(m.name)}</span><div class="nm"><b>${esc(m.name)}${m.yo ? " · demo" : ""}</b><span>Última visita: ${diasDesde(m.last) === 0 ? "hoy" : `hace ${diasDesde(m.last)} días`}</span></div>
              <span class="pill ${m.stamps >= META ? "green" : ""}">${m.stamps}/${META}</span></div>`).join("")}</div>
        </div>
      </div>`;
    $b.querySelectorAll("[data-rec]").forEach((btn) => (btn.onclick = () => {
      const m = lista.find((x) => x.id === btn.dataset.rec);
      S.recordados.push(m.id); toast(`Recordatorio enviado a ${nombre1(m.name)}`); render();
    }));
  }

  const PLANTILLAS = [
    "🔥 Martes de barba: 2x1 en arreglo de barba solo hoy",
    "⏰ Hoy de 2 a 5 pm: 20% en cortes. Te esperamos en 305",
    "✂️ Te extrañamos. Esta semana tu sello vale doble",
    "🎂 Es tu mes: tu arreglo de barba va por la casa",
  ];
  function tabPromos() {
    const $b = document.getElementById("tabBody");
    const miembros = S.base.miembros + (S.me ? 1 : 0);
    $b.innerHTML = `
      <div class="stack fade-in">
        <div class="box stack">
          <div><label class="f" for="pTxt">Mensaje para tus clientes</label><textarea class="inp" id="pTxt" maxlength="120" placeholder="Escribe tu promo…"></textarea></div>
          <div class="chips">${PLANTILLAS.map((p, i) => `<button data-p="${i}">${p.slice(0, 26)}…</button>`).join("")}</div>
          <div><label class="f" for="pA">¿A quién?</label>
            <select class="inp" id="pA"><option value="todos">Todos los miembros (${miembros})</option><option value="inactivos">Los que no han vuelto (23)</option><option value="cumple">Cumpleañeros del mes (11)</option></select></div>
          <button class="btn gold block" id="pEnviar">📣 Enviar notificación</button>
          <p class="hint">💸 Les llega al Wallet del celular <b>sin pagar WhatsApp masivo ni SMS</b>.</p>
        </div>
        ${S.promos.length ? `<div><h3 class="h-display" style="font-size:17px;margin-bottom:8px">Enviadas</h3><div class="list">${S.promos.slice().reverse().map((p) => `
          <div class="li"><span class="av">📣</span><div class="nm"><b>${esc(p.txt)}</b><span>${p.n} miembros · ${new Date(p.t).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span></div><span class="pill green">Entregada</span></div>`).join("")}</div></div>` : ""}
      </div>`;
    const $t = document.getElementById("pTxt");
    $b.querySelectorAll("[data-p]").forEach((c) => (c.onclick = () => { $t.value = PLANTILLAS[+c.dataset.p]; $t.focus(); }));
    document.getElementById("pEnviar").onclick = () => {
      const txt = $t.value.trim(); if (!txt) { $t.focus(); toast("Escribe o elige un mensaje"); return; }
      const a = document.getElementById("pA").value, n = a === "todos" ? miembros : a === "inactivos" ? 23 : 11;
      S.promos.push({ txt, n, t: hoy() }); render();
      toast(`Enviada a ${n} miembros ✓`);
      setTimeout(() => notificar(txt), 900);
    };
  }

  // ---------- eventos fijos ----------
  document.querySelectorAll(".roles button").forEach((b) => (b.onclick = () => { S.role = b.dataset.role; escaneado = false; render(); $app.scrollTop = 0; }));
  const guia = document.getElementById("guia");
  const abrirGuia = () => (guia.showModal ? guia.showModal() : guia.setAttribute("open", ""));
  document.getElementById("btnGuia").onclick = abrirGuia;
  document.getElementById("btnGuia2").onclick = abrirGuia;
  document.getElementById("btnCerrarGuia").onclick = () => guia.close();
  document.getElementById("btnReset").onclick = () => {
    borrar(); S = nuevoEstado(); escaneado = false; pinTxt = "";
    document.querySelectorAll(".wallet").forEach((w) => w.remove());
    guia.close(); render(); toast("Demo reiniciada");
  };

  render();
})();
