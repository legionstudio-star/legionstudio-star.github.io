/* Club Look · demo de fidelización de Look Barbershop Store (Tecnología LEGION)
   Todo es simulado y se guarda en el localStorage de este dispositivo. */
(() => {
  const KEY = "clublook-demo-v1";
  const PIN = "5555";
  const META = 5; // al 5° sello, corte gratis
  const AGENDA = "https://yato25648-ai.github.io/LOOKBARBER/";
  const RESENAS = "https://www.google.com/maps/search/?api=1&query=Look+Barbershop+Store";
  const A = "/lookbarber/assets/";
  const BARBEROS = [
    { id: "diego", n: "Diego", c: "#C8202F" },
    { id: "sebastian", n: "Sebastián", c: "#3E6BC4" },
    { id: "felipe", n: "Felipe", c: "#8E44AD" },
  ];
  const SERVICIOS = [
    { n: "Corte caballero", p: 18000, img: "corte1" },
    { n: "Corte desde la cero", p: 20000, img: "corte2" },
    { n: "Corte con shaver y cejas", p: 25000, img: "corte3" },
    { n: "Barba", p: 10000, img: "corte4" },
    { n: "Corte todo incluido", p: 35000, img: "corte5" },
    { n: "Exfoliación", p: 12000, img: "corte6" },
  ];
  const $app = document.getElementById("app");
  const $phone = document.getElementById("phone");
  const $notif = document.getElementById("notif");
  const $notifTxt = document.getElementById("notifTxt");

  const DIA = 864e5;
  const hoy = () => Date.now();
  const SEMILLA = [
    ["Santiago Rojas", 4, 3, 4], ["Andrés Gómez", 2, 12, 9], ["Kevin Castro", 3, 5, 2], ["Juan David Pérez", 1, 41, 11],
    ["Camilo Herrera", 4, 8, 6], ["Brayan Vargas", 0, 52, 3], ["Daniel Moreno", 3, 19, 11], ["Stiven Ortiz", 1, 6, 7],
    ["Nicolás Ramírez", 2, 35, 1], ["Esteban Díaz", 4, 4, 11], ["Julián Torres", 3, 63, 5], ["Alejandro Ruiz", 2, 2, 12],
  ];
  const nuevoEstado = () => ({
    role: "cliente", tab: "escanear", unlocked: false, me: null,
    base: { miembros: 84, visitasMes: 196, canjes: 27, ventas: 4310000, porBarbero: { diego: 74, sebastian: 68, felipe: 54 } },
    members: SEMILLA.map(([name, stamps, dias, mes], i) => ({ id: String(100 + i).padStart(4, "0"), name, stamps, last: hoy() - dias * DIA, bmonth: mes, visits: stamps + 2 + (i % 4), rewards: i % 3 })),
    promos: [], recordados: [],
  });
  let S = cargar();
  let popAt = -1;
  let escaneado = false;
  let selB = null, selS = null;

  function cargar() { try { return JSON.parse(localStorage.getItem(KEY)) || nuevoEstado(); } catch { return nuevoEstado(); } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
  function borrar() { try { localStorage.removeItem(KEY); } catch {} }
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const iniciales = (n) => n.split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const nombre1 = (n) => n.split(/\s+/)[0];
  const diasDesde = (t) => Math.floor((hoy() - t) / DIA);
  const pesos = (v) => "$" + Math.round(v).toLocaleString("es-CO");
  const fecha = (t) => new Date(t).toLocaleDateString("es-CO", { day: "numeric", month: "short" });

  function qrSvg(txt, color = "#0A0A0C") {
    const q = qrcode(0, "M"); q.addData(txt); q.make();
    const n = q.getModuleCount(); let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
    return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges"><path d="${d}" fill="${color}"/></svg>`;
  }
  const ICO_TIJERA = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/></svg>`;
  const ICO_REGALO = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>`;
  const ICO_GW = `<svg viewBox="0 0 26 26"><rect x="3" y="4" width="20" height="6" rx="2" fill="#4285F4"/><rect x="3" y="8" width="20" height="6" rx="2" fill="#34A853"/><rect x="3" y="12" width="20" height="6" rx="2" fill="#FBBC04"/><rect x="3" y="16" width="20" height="6" rx="2" fill="#EA4335"/></svg>`;
  const ICO_AW = `<svg viewBox="0 0 26 26"><rect x="3" y="5" width="20" height="16" rx="3.5" fill="#fff"/><rect x="3" y="5" width="20" height="4" rx="2" fill="#30d158"/><rect x="3" y="8" width="20" height="4" rx="2" fill="#ff9f0a"/><rect x="3" y="11" width="20" height="4" rx="2" fill="#0a84ff"/><rect x="3" y="14" width="20" height="7" rx="3" fill="#d9d9d9"/></svg>`;

  const SV = (d, w = 22) => `<svg class="ico" width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const I = {
    tijera: SV('<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>'),
    torta: SV('<path d="M4 21h16M5 21v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M5 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 5 0M12 12V8M12 5.5V5"/>'),
    amigos: SV('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.2c2.8.4 5 2.8 5 5.8"/>'),
    cel: SV('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
    regalo: SV('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>'),
    cal: SV('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    estrella: SV('<path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17l-5.6 3 1.1-6.2L2.9 9.4l6.3-.9L12 2.8Z"/>'),
    pin: SV('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    camara: SV('<path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.5"/>', 20),
    rayo: SV('<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/>', 18),
    reloj: SV('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 20),
    grupo: SV('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.2c2.8.4 5 2.8 5 5.8"/>', 20),
    altavoz: SV('<path d="M3 10v4a1 1 0 0 0 1 1h3l5 4V5L7 9H4a1 1 0 0 0-1 1ZM16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>', 20),
    flecha: SV('<path d="M5 12h14M13 6l6 6-6 6"/>', 16),
  };

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
    const cols = ["#C8202F", "#FF4D5E", "#3E6BC4", "#ffffff", "#8fb0ff"];
    for (let i = 0; i < 70; i++) {
      const c = document.createElement("i");
      c.style.left = Math.random() * 100 + "%"; c.style.background = cols[i % cols.length];
      c.style.animationDelay = Math.random() * 0.5 + "s"; c.style.animationDuration = 1.2 + Math.random() * 1.2 + "s";
      box.appendChild(c);
    }
    $phone.appendChild(box); setTimeout(() => box.remove(), 3000);
  }

  function render() {
    document.querySelectorAll(".roles button").forEach((b) => b.classList.toggle("on", b.dataset.role === S.role));
    if (S.role === "cliente") S.me ? vistaTarjeta() : vistaUnirse();
    else S.unlocked ? vistaPanel() : vistaPin();
    guardar();
  }

  const linksHtml = () => `
    <div class="links">
      <a href="${AGENDA}" target="_blank" rel="noopener"><span>${I.cal}</span>Agenda tu turno</a>
      <a href="${RESENAS}" target="_blank" rel="noopener"><span>${I.estrella}</span>Califícanos</a>
      <a href="https://www.google.com/maps/search/?api=1&query=Look+Barbershop+Store" target="_blank" rel="noopener"><span>${I.pin}</span>Cómo llegar</a>
    </div>`;
  const cortesHtml = () => `
    <div><p class="ceja" style="margin:0 0 8px">Cortes que manejamos</p>
    <div class="cortes">${SERVICIOS.map((s) => `<div class="corte"><img src="${A}img/${s.img}.webp" alt="" loading="lazy"><b>${esc(s.n)}</b><span>${pesos(s.p)}</span></div>`).join("")}</div></div>`;

  // ---------- CLIENTE ----------
  function vistaUnirse() {
    $app.innerHTML = `
      <div class="stack fade-in">
        <div class="hero-v">
          <video src="${A}fondo.mp4" autoplay muted loop playsinline preload="auto"></video>
          <div>
            <img src="${A}logo.webp" alt="Look Barbershop Store">
            <h1>Club <span class="red-t">Look</span></h1>
            <p>Cada corte suma un sello. Al <b class="red-t">5°</b> tu corte va por la casa.</p>
            <div class="sello5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i === 1 ? "on" : i === 5 ? "g" : ""}">${i === 5 ? SV('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/>', 14) : i}</i>`).join("")}</div>
          </div>
        </div>
        <div class="perks">
          <div class="perk"><span class="ic">${I.tijera}</span><div><b>5 cortes = 1 gratis</b><span>Cada visita es un sello en tu tarjeta</span></div></div>
          <div class="perk"><span class="ic">${I.torta}</span><div><b>Regalo de cumpleaños</b><span>Tu barba va por la casa ese mes</span></div></div>
          <div class="perk"><span class="ic">${I.amigos}</span><div><b>Trae un parcero</b><span>Si se une, los dos ganan un sello</span></div></div>
          <div class="perk"><span class="ic">${I.cel}</span><div><b>Tarjeta en tu celular</b><span>Google Wallet o Apple Wallet · sin apps</span></div></div>
        </div>
        <form class="box stack" id="fJoin" autocomplete="off">
          <p class="ceja" style="margin:0">Únete gratis</p>
          <div><label class="f" for="jn">Nombre</label><input class="inp" id="jn" required maxlength="40" placeholder="Ej: Carlos Méndez"></div>
          <div><label class="f" for="jt">WhatsApp</label><input class="inp" id="jt" required inputmode="numeric" maxlength="14" placeholder="300 123 4567"></div>
          <div><label class="f" for="jb">Mes de cumpleaños</label>
            <select class="inp" id="jb">${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m, i) => `<option value="${i + 1}" ${i === new Date().getMonth() ? "selected" : ""}>${m}</option>`).join("")}</select></div>
          <label class="check"><input type="checkbox" id="jc" checked> Acepto recibir mis sellos y promociones del Club Look.</label>
          <button class="btn gold block" type="submit">Unirme al Club Look</button>
          <p class="muted" style="text-align:center;margin-top:8px">Te regalamos tu primer sello al unirte</p>
        </form>
        ${cortesHtml()}
        ${linksHtml()}
      </div>`;
    document.getElementById("fJoin").onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("jn").value.trim().replace(/\s+/g, " ");
      if (!name || !document.getElementById("jc").checked) return;
      S.me = { id: String(S.base.miembros + 1).padStart(4, "0"), name, phone: document.getElementById("jt").value.trim(),
               bmonth: +document.getElementById("jb").value, stamps: 1, visits: 1, rewards: 0, last: hoy(), joined: hoy(), wallet: {},
               hist: [{ t: hoy(), s: "Sello de bienvenida", b: "Club Look" }] };
      popAt = 0; $app.scrollTop = 0;
      render();
      setTimeout(() => notificar(`¡Bienvenido al Club Look, ${nombre1(name)}! Tu primer sello ya está en tu tarjeta.`), 400);
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
    const amigo = `https://wa.me/?text=${encodeURIComponent(`Parcero, únete al Club Look de Look Barbershop Store: cada 5 cortes, 1 gratis. Si te unes con mi código ${m.id} los dos ganamos un sello: https://legionestudio.com/lookbarber/`)}`;
    $app.innerHTML = `
      <div class="stack fade-in">
        <div class="mcard">
          <div class="top"><img src="${A}logo.webp" alt="" style="width:78px"><div><div class="t1">CLUB LOOK</div><div class="t2">Barbershop Store · Miembro</div></div></div>
          <div class="who"><div><div class="s">Miembro</div><div class="n">${esc(m.name)}</div></div><div style="text-align:right"><div class="s">N°</div><b>${m.id}</b></div></div>
          <div class="stamps cinco">${sellosHtml(m.stamps)}</div>
          <div class="progress">${lleno ? `<b>¡Tarjeta completa!</b>` : `Te ${falta === 1 ? "falta" : "faltan"} <b>${falta}</b> ${falta === 1 ? "corte" : "cortes"} para tu corte <b>GRATIS</b>`}</div>
        </div>
        ${lleno ? `<div class="reward fade-in"><h3>Corte gratis desbloqueado</h3><p style="margin:6px 0 0;font-weight:600">Muéstrale este código a tu barbero</p></div>` : ""}
        <div class="box">
          <div class="qrbox">${qrSvg("CLUBLOOK-" + m.id)}</div>
          <p class="qrcap">MUESTRA ESTE CÓDIGO O TU TARJETA NFC EN CADA VISITA · ${m.id}</p>
        </div>
        <div class="stack">
          <button class="wbtn ${m.wallet.google ? "added" : ""}" data-w="google">${ICO_GW}${m.wallet.google ? "Guardada en Google Wallet" : "Agregar a Google Wallet"}</button>
          <button class="wbtn ${m.wallet.apple ? "added" : ""}" data-w="apple">${ICO_AW}${m.wallet.apple ? "Guardada en Apple Wallet" : "Agregar a Apple Wallet"}</button>
        </div>
        <p class="hint">Para la demo: pasa a <b>Barbería</b>, escanea esta tarjeta y ponle un sello. La notificación le llega aquí al instante.</p>
        <div class="ref"><div style="flex:1"><b>Trae un parcero</b><span>Si se une con tu código <b>${m.id}</b>, los dos ganan un sello.</span></div><a href="${amigo}" target="_blank" rel="noopener">Invitar</a></div>
        <div class="row"><div class="kpi"><b>${m.visits}</b><span>Visitas</span></div><div class="kpi"><b>${m.rewards}</b><span>Cortes gratis</span></div></div>
        ${(m.hist || []).length ? `<div><p class="ceja" style="margin:0 0 8px">Tu historial</p><div class="hist">${m.hist.slice().reverse().slice(0, 6).map((h) => `
          <div class="li"><span class="av" style="font-size:16px">${h.s.includes("gratis") ? I.regalo : I.tijera}</span><div class="nm"><b>${esc(h.s)}</b><span>${esc(h.b)}</span></div><span class="when">${fecha(h.t)}</span></div>`).join("")}</div></div>` : ""}
        ${linksHtml()}
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
          <div class="ph"><img src="${A}logo.webp" alt="" style="width:58px"><span class="pt">CLUB LOOK</span><span class="pv">Sellos<b>${m.stamps}/${META}</b></span></div>
          <div class="pbanner"><img src="${A}logo.webp" alt=""></div>
          <div class="pf">
            <div><p>Miembro</p><b>${esc(m.name)}</b></div>
            <div><p>Premio</p><b>Corte gratis</b></div>
            <div><p>Visitas</p><b>${m.visits}</b></div>
            <div><p>N° miembro</p><b>${m.id}</b></div>
          </div>
          <div class="pq">${qrSvg("CLUBLOOK-" + m.id)}<span>CLUBLOOK-${m.id}</span></div>
        </div>
        <div class="wok">${g ? "Guardada en Google Wallet" : "Agregada a Apple Wallet"}</div>
        <p class="wnote">Se actualiza sola cada vez que te ponen un sello.<br>Las promociones de Look te llegan como notificación.</p>
      </div>`;
    w.querySelector(".wtop button").onclick = () => { w.remove(); render(); };
    $phone.appendChild(w);
    if (!m.wallet[tipo]) { m.wallet[tipo] = true; guardar(); setTimeout(() => notificar("Tu tarjeta Club Look quedó guardada en el celular."), 700); }
  }

  // ---------- BARBERÍA ----------
  let pinTxt = "";
  function vistaPin() {
    $app.innerHTML = `
      <div class="pin fade-in" id="pinBox">
        <img src="${A}logo.webp" alt="" style="width:170px">
        <h2 class="h-display" style="margin-top:10px">Panel barbería</h2>
        <p class="muted">Ingresa el PIN del local</p>
        <div class="dots">${[0, 1, 2, 3].map((i) => `<i class="${i < pinTxt.length ? "f" : ""}"></i>`).join("")}</div>
        <div class="pad">${["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k) => k ? `<button data-k="${k}">${k}</button>` : "<span></span>").join("")}</div>
        <p class="hint" style="margin-top:22px">PIN de la demo: <b>5555</b></p>
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
    const tabs = [["escanear", "Escanear"], ["clientes", "Clientes"], ["promos", "Promos"]];
    $app.innerHTML = `
      <div class="stack fade-in">
        <div style="display:flex;align-items:center;gap:12px">
          <img src="${A}logo.webp" alt="" style="width:74px">
          <div style="flex:1"><h2 class="h-display" style="font-size:22px">Panel Look</h2><span class="muted">${new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}</span></div>
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
        <p class="muted">Pasa a <b>Cliente</b>, únete al club y vuelve aquí para escanear su tarjeta.</p>
        <button class="btn gold block" id="bIrCliente">Ir a la vista Cliente</button></div>`;
      document.getElementById("bIrCliente").onclick = () => { S.role = "cliente"; render(); };
      return;
    }
    if (!escaneado) {
      $b.innerHTML = `
        <div class="stack">
          <div class="scan"><div class="frame"><i></i><i></i><i></i><i></i><div class="laser"></div></div>
            <div class="qrghost" style="position:absolute">${qrSvg("CLUBLOOK-" + m.id)}</div></div>
          <button class="btn gold block" id="bScan">${I.camara} Escanear tarjeta del cliente</button>
          <p class="muted" style="text-align:center">Sirve el QR del celular del cliente o su tarjeta NFC Look.</p>
        </div>`;
      document.getElementById("bScan").onclick = () => {
        const sc = $b.querySelector(".scan"); const ok = document.createElement("div"); ok.className = "ok"; ok.innerHTML = SV('<path d="m5 12.5 4.5 4.5L19 7.5"/>', 64); sc.appendChild(ok);
        if (navigator.vibrate) navigator.vibrate(40);
        setTimeout(() => { escaneado = true; selB = selB || "diego"; selS = selS == null ? 0 : selS; tabEscanear(); }, 650);
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
        <div class="mcard" style="padding:14px"><div class="stamps cinco" style="margin-top:0">${sellosHtml(m.stamps)}</div><div style="height:12px"></div></div>
        ${lleno ? "" : `
        <div><label class="f">¿Quién lo atendió?</label>
          <div class="sel">${BARBEROS.map((b) => `<button data-b="${b.id}" class="${selB === b.id ? "on" : ""}"><span class="av" style="background:${b.c};color:#fff">${b.n[0]}</span>${b.n}</button>`).join("")}</div></div>
        <div><label class="f">Servicio</label>
          <div class="serv">${SERVICIOS.map((s, i) => `<button data-s="${i}" class="${selS === i ? "on" : ""}">${esc(s.n)} · ${pesos(s.p)}</button>`).join("")}</div></div>`}
        ${lleno
          ? `<p class="hint">Este cliente tiene un <b>corte gratis</b> disponible.</p><button class="bigstamp btn green" id="bCanje">${I.regalo} Canjear corte gratis</button>`
          : `<button class="bigstamp btn gold" id="bSello">${I.tijera} Poner sello</button>`}
        <div class="row">
          <button class="btn dark" id="bLlenar" ${lleno ? "disabled" : ""}>${I.rayo} Llenar tarjeta</button>
          <button class="btn ghost" id="bOtro">Escanear otro</button>
        </div>
        <p class="muted" style="text-align:center">"Llenar tarjeta" es solo para la demo: deja la tarjeta lista para mostrar el canje.</p>
      </div>`;
    $b.querySelectorAll("[data-b]").forEach((x) => (x.onclick = () => { selB = x.dataset.b; tabEscanear(); }));
    $b.querySelectorAll("[data-s]").forEach((x) => (x.onclick = () => { selS = +x.dataset.s; tabEscanear(); }));
    const sello = document.getElementById("bSello"), canje = document.getElementById("bCanje");
    if (sello) sello.onclick = () => ponerSello();
    if (canje) canje.onclick = () => {
      const b = BARBEROS.find((x) => x.id === selB) || BARBEROS[0];
      m.stamps = 0; m.rewards++; m.visits++; m.last = hoy(); S.base.canjes++; S.base.visitasMes++; S.base.porBarbero[b.id]++;
      (m.hist = m.hist || []).push({ t: hoy(), s: "Corte gratis canjeado", b: "Con " + b.n });
      confeti(); toast("Corte gratis canjeado"); render();
      setTimeout(() => notificar(`¡Disfruta tu corte gratis, ${nombre1(m.name)}! Tu nueva tarjeta ya empezó.`), 500);
    };
    document.getElementById("bLlenar").onclick = () => {
      while (m.stamps < META - 1) { m.stamps++; m.visits++; (m.hist = m.hist || []).push({ t: hoy() - (META - m.stamps) * 9 * DIA, s: SERVICIOS[m.stamps % 3].n, b: "Con " + BARBEROS[m.stamps % 3].n }); }
      ponerSello();
    };
    document.getElementById("bOtro").onclick = () => { escaneado = false; tabEscanear(); };
  }

  function ponerSello() {
    const m = S.me;
    if (m.stamps >= META) return;
    const b = BARBEROS.find((x) => x.id === selB) || BARBEROS[0], s = SERVICIOS[selS || 0];
    popAt = m.stamps; m.stamps++; m.visits++; m.last = hoy(); S.base.visitasMes++; S.base.ventas += s.p; S.base.porBarbero[b.id]++;
    (m.hist = m.hist || []).push({ t: hoy(), s: s.n, b: `Con ${b.n} · ${pesos(s.p)}` });
    render();
    const f = META - m.stamps;
    if (f === 0) { confeti(); setTimeout(() => notificar(`¡Completaste tu tarjeta, ${nombre1(m.name)}! Tu próximo corte es GRATIS.`), 300); }
    else setTimeout(() => notificar(`¡Sello agregado! ${b.n} te atendió hoy. Llevas ${m.stamps} de ${META}: te ${f === 1 ? "falta 1" : "faltan " + f} para tu corte gratis.`), 300);
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
    const pb = S.base.porBarbero, max = Math.max(...Object.values(pb));
    $b.innerHTML = `
      <div class="stack fade-in">
        <div class="kpis">
          <div class="kpi"><b>${miembros}</b><span>Miembros del club</span></div>
          <div class="kpi"><b>${S.base.visitasMes}</b><span>Visitas este mes</span></div>
          <div class="kpi"><b>71%</b><span>Clientes que volvieron</span></div>
          <div class="kpi"><b>${S.base.canjes}</b><span>Cortes gratis canjeados</span></div>
        </div>
        <div class="box"><p class="ceja" style="margin:0">Ventas de miembros del club este mes</p><b style="font-family:var(--display);font-size:34px;color:var(--gold2)">${pesos(S.base.ventas)}</b>
          <p class="muted" style="margin:2px 0 0">Por cada corte gratis, el cliente ya pagó 4. Y vuelve.</p></div>
        <div class="box stack"><p class="ceja" style="margin:0">Visitas por barbero</p>
          ${BARBEROS.map((x) => `<div class="bar"><span>${x.n}</span><span class="t"><i style="width:${(pb[x.id] / max) * 100}%"></i></span><b>${pb[x.id]}</b></div>`).join("")}</div>
        <div>
          <h3 class="h-display" style="font-size:17px;margin-bottom:8px">${I.reloj} No han vuelto (30+ días)</h3>
          <div class="list">${inactivos.map((m) => `
            <div class="li"><span class="av">${iniciales(m.name)}</span><div class="nm"><b>${esc(m.name)}</b><span>${m.stamps}/${META} sellos</span></div>
              <span class="pill red">${diasDesde(m.last)} días</span>
              <button class="btn ${S.recordados.includes(m.id) ? "dark" : "gold"}" data-rec="${m.id}" style="padding:8px 10px;font-size:12px" ${S.recordados.includes(m.id) ? "disabled" : ""}>${S.recordados.includes(m.id) ? "Enviado" : "Recordar"}</button></div>`).join("")}</div>
          <p class="muted" style="margin-top:6px">El recordatorio les llega al Wallet: "Te extrañamos en Look, tu próximo sello te espera".</p>
        </div>
        ${cumple.length ? `<div><h3 class="h-display" style="font-size:17px;margin-bottom:8px">${I.torta} Cumplen años este mes</h3>
          <div class="list">${cumple.map((m) => `<div class="li"><span class="av">${iniciales(m.name)}</span><div class="nm"><b>${esc(m.name)}${m.yo ? " (tú)" : ""}</b><span>Regalo: barba gratis</span></div><span class="pill">${I.torta}</span></div>`).join("")}</div></div>` : ""}
        <div>
          <h3 class="h-display" style="font-size:17px;margin-bottom:8px">${I.grupo} Miembros recientes</h3>
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
    "Martes de barba: 2x1 en arreglo de barba solo hoy en Look",
    "Hoy de 2 a 5 pm: 20% en cortes. Te esperamos en Look",
    "Te extrañamos. Esta semana tu sello vale doble",
    "Es tu mes: tu barba va por la casa en Look",
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
            <select class="inp" id="pA"><option value="todos">Todos los miembros (${miembros})</option><option value="inactivos">Los que no han vuelto (17)</option><option value="cumple">Cumpleañeros del mes (8)</option></select></div>
          <button class="btn gold block" id="pEnviar">${I.altavoz} Enviar notificación</button>
          <p class="hint">Les llega al Wallet del celular <b>sin pagar WhatsApp masivo ni SMS</b>.</p>
        </div>
        ${S.promos.length ? `<div><h3 class="h-display" style="font-size:17px;margin-bottom:8px">Enviadas</h3><div class="list">${S.promos.slice().reverse().map((p) => `
          <div class="li"><span class="av">${I.altavoz}</span><div class="nm"><b>${esc(p.txt)}</b><span>${p.n} miembros · ${new Date(p.t).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span></div><span class="pill green">Entregada</span></div>`).join("")}</div></div>` : ""}
      </div>`;
    const $t = document.getElementById("pTxt");
    $b.querySelectorAll("[data-p]").forEach((c) => (c.onclick = () => { $t.value = PLANTILLAS[+c.dataset.p]; $t.focus(); }));
    document.getElementById("pEnviar").onclick = () => {
      const txt = $t.value.trim(); if (!txt) { $t.focus(); toast("Escribe o elige un mensaje"); return; }
      const a = document.getElementById("pA").value, n = a === "todos" ? miembros : a === "inactivos" ? 17 : 8;
      S.promos.push({ txt, n, t: hoy() }); render();
      toast(`Enviada a ${n} miembros`);
      setTimeout(() => notificar(txt), 900);
    };
  }

  document.querySelectorAll(".roles button").forEach((b) => (b.onclick = () => { S.role = b.dataset.role; escaneado = false; render(); $app.scrollTop = 0; }));
  const guia = document.getElementById("guia");
  const abrirGuia = () => (guia.showModal ? guia.showModal() : guia.setAttribute("open", ""));
  document.getElementById("btnGuia").onclick = abrirGuia;
  document.getElementById("btnGuia2").onclick = abrirGuia;
  document.getElementById("btnCerrarGuia").onclick = () => guia.close();
  document.getElementById("btnReset").onclick = () => {
    borrar(); S = nuevoEstado(); escaneado = false; pinTxt = ""; selB = null; selS = null;
    document.querySelectorAll(".wallet").forEach((w) => w.remove());
    guia.close(); render(); toast("Demo reiniciada");
  };

  render();
})();
