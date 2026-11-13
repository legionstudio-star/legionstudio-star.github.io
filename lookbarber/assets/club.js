/* Club Look · página del cliente (oficial, con Supabase). */
(() => {
  const { A, SERVICIOS, rpc, esc, pesos, nombre1, fecha, qrSvg, I, sellos, toast, confeti, ls } = LK;
  const $app = document.getElementById("app"), $notif = document.getElementById("notif"), $nt = document.getElementById("notifTxt");
  const qs = new URLSearchParams(location.search);
  const REF = (qs.get("ref") || "").toUpperCase();
  let codigo = (qs.get("c") || ls.get("lk_codigo") || "").toUpperCase();
  let T = null, popAt = -1;

  let tN;
  function notificar(txt) { $nt.textContent = txt; $notif.classList.remove("show"); void $notif.offsetWidth; $notif.classList.add("show"); clearTimeout(tN); tN = setTimeout(() => $notif.classList.remove("show"), 4500); if (navigator.vibrate) navigator.vibrate(60); }

  const links = () => `<div class="links">
    <a href="${LK.AGENDA}" target="_blank" rel="noopener"><span>${I.cal}</span>Agenda tu turno</a>
    <a href="${LK.RESENAS}" target="_blank" rel="noopener"><span>${I.estrella}</span>Califícanos</a>
    <a href="${LK.MAPA}" target="_blank" rel="noopener"><span>${I.pin}</span>Cómo llegar</a></div>`;
  const cortes = () => `<div><p class="ceja" style="margin:0 0 8px">Cortes que manejamos</p><div class="cortes">${SERVICIOS.map((s) => `<div class="corte"><img src="${A}img/${s.img}.webp" alt="" loading="lazy"><b>${esc(s.n)}</b><span>${pesos(s.p)}</span></div>`).join("")}</div></div>`;

  function vistaUnirse(err) {
    $app.innerHTML = `
      <div class="stack fade-in">
        <div class="hero-v"><video src="${A}fondo.mp4" autoplay muted loop playsinline preload="auto"></video>
          <div><img src="${A}logo.webp" alt="Look Barbershop Store"><h1>Club <span class="red-t">Look</span></h1>
            <p>Cada corte suma un sello. Al <b class="red-t">5°</b> tu corte va por la casa.</p>
            <div class="sello5">${[1, 2, 3, 4, 5].map((i) => `<i class="${i === 1 ? "on" : i === 5 ? "g" : ""}">${i === 5 ? I.regaloS : i}</i>`).join("")}</div></div></div>
        ${REF ? `<div class="ref"><div style="flex:1"><b>Te invitó un parcero</b><span>Únete y tu amigo gana un sello.</span></div></div>` : ""}
        <div class="perks">
          <div class="perk"><span class="ic">${I.tijera}</span><div><b>5 cortes = 1 corte VIP con descuento</b><span>Cada visita es un sello en tu tarjeta</span></div></div>
          <div class="perk"><span class="ic">${I.torta}</span><div><b>Regalo de cumpleaños</b><span>Una sorpresa en tu mes</span></div></div>
          <div class="perk"><span class="ic">${I.amigos}</span><div><b>Trae un parcero</b><span>Si se une con tu enlace, ganas un sello</span></div></div>
          <div class="perk"><span class="ic">${I.cel}</span><div><b>Tu tarjeta en el celular</b><span>Sin descargar apps. Toca tu tarjeta Look y aparece</span></div></div>
        </div>
        <form class="box stack" id="fJoin" autocomplete="on">
          <p class="ceja" style="margin:0">Únete gratis</p>
          <div><label class="f" for="jn">Nombre</label><input class="inp" id="jn" required maxlength="40" autocomplete="name" placeholder="Ej: Carlos Méndez"></div>
          <div><label class="f" for="jt">WhatsApp</label><input class="inp" id="jt" required inputmode="numeric" maxlength="14" autocomplete="tel" placeholder="300 123 4567"></div>
          <div><label class="f" for="jb">Mes de cumpleaños</label><select class="inp" id="jb">${["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"].map((m, i) => `<option value="${i + 1}">${m}</option>`).join("")}</select></div>
          <label class="check"><input type="checkbox" id="jc" checked> Acepto recibir mis sellos y promociones de Look por WhatsApp.</label>
          ${err ? `<p class="warn">${esc(err)}</p>` : ""}
          <button class="btn gold block" type="submit" id="bJoin">Unirme al Club Look</button>
          <p class="muted" style="text-align:center">Te regalamos tu primer sello al unirte. ¿Ya eres miembro? Escribe tu mismo WhatsApp y recuperas tu tarjeta.</p>
        </form>
        ${cortes()}${links()}
      </div>`;
    document.getElementById("fJoin").onsubmit = async (e) => {
      e.preventDefault();
      if (!document.getElementById("jc").checked) return vistaUnirse("Debes aceptar para unirte.");
      const b = document.getElementById("bJoin"); b.disabled = true; b.textContent = "Creando tu tarjeta…";
      try {
        const t = await rpc("lk_club_unirse", { p_nombre: document.getElementById("jn").value, p_tel: document.getElementById("jt").value, p_mes: +document.getElementById("jb").value, p_ref: REF || null });
        codigo = t.codigo; ls.set("lk_codigo", codigo); history.replaceState(null, "", location.pathname);
        T = t; popAt = t.ya ? -1 : 0; vistaTarjeta();
        setTimeout(() => notificar(t.ya ? `Hola de nuevo, ${nombre1(t.nombre)}. Aquí está tu tarjeta.` : `Bienvenido al Club Look, ${nombre1(t.nombre)}. Tu primer sello ya está en tu tarjeta.`), 400);
      } catch (er) { vistaUnirse(er.message); }
    };
  }

  function vistaTarjeta() {
    const m = T, meta = m.meta || 5, falta = meta - m.sellos, lleno = m.sellos >= meta;
    const inv = `https://wa.me/?text=${encodeURIComponent(`Parcero, únete al Club Look de Look Barbershop Store: cada 5 cortes ganas un corte VIP con descuento. Entra con mi enlace: ${LK.URL}?ref=${m.codigo}`)}`;
    const NOM = { bienvenida: "Sello de bienvenida", sello: "Sello", canje: "Corte VIP canjeado", referido: "Sello por invitar", ajuste: "Ajuste" };
    $app.innerHTML = `
      <div class="stack fade-in">
        <div class="mcard">
          <div class="top"><img src="${A}logo.webp" alt="" style="width:78px"><div><div class="t1">CLUB LOOK</div><div class="t2">Barbershop Store · Miembro</div></div></div>
          <div class="who"><div><div class="s">Miembro</div><div class="n">${esc(m.nombre)}</div></div><div style="text-align:right"><div class="s">Código</div><b>${m.codigo}</b></div></div>
          <div class="stamps cinco">${sellos(m.sellos, meta, popAt)}</div>
          <div class="progress">${lleno ? "<b>¡Tarjeta completa!</b>" : `Te ${falta === 1 ? "falta" : "faltan"} <b>${falta}</b> ${falta === 1 ? "corte" : "cortes"} para tu <b>corte VIP con descuento</b>`}</div>
        </div>
        ${lleno ? `<div class="reward fade-in"><h3>Corte VIP con descuento desbloqueado</h3><p style="margin:6px 0 0;font-weight:600">Muéstrale este código a tu barbero</p></div>` : ""}
        <div class="box"><div class="qrbox">${qrSvg(LK.URL + "?c=" + m.codigo)}</div>
          <p class="qrcap">MUESTRA ESTE CÓDIGO EN CADA VISITA · ${m.codigo}</p></div>
        <div class="ref"><div style="flex:1"><b>Trae un parcero</b><span>Si se une con tu enlace, ganas un sello.</span></div><a href="${inv}" target="_blank" rel="noopener">Invitar</a></div>
        <div class="row"><div class="kpi"><b>${m.visitas}</b><span>Visitas</span></div><div class="kpi"><b>${m.canjes}</b><span>Cortes VIP</span></div></div>
        ${(m.historial || []).length ? `<div><p class="ceja" style="margin:0 0 8px">Tu historial</p><div class="hist">${m.historial.map((h) => `
          <div class="li"><span class="av">${h.tipo === "canje" ? I.regalo : I.tijera}</span><div class="nm"><b>${esc(h.tipo === "sello" ? h.servicio || "Sello" : NOM[h.tipo] || h.servicio)}</b><span>${h.barbero ? "Con " + esc(h.barbero) : esc(h.tipo === "referido" ? h.servicio : "Club Look")}</span></div><span class="when">${fecha(h.t)}</span></div>`).join("")}</div></div>` : ""}
        ${links()}
        <p class="muted" style="text-align:center">Guarda esta página en tu pantalla de inicio para tenerla a la mano.<br><button id="bNoSoy" style="text-decoration:underline;color:var(--muted);margin-top:8px">¿No eres ${esc(nombre1(m.nombre))}?</button></p>
      </div>`;
    popAt = -1;
    document.getElementById("bNoSoy").onclick = () => { ls.del("lk_codigo"); codigo = ""; T = null; vistaUnirse(); };
  }

  async function cargar() {
    if (!codigo) return vistaUnirse();
    try {
      const t = await rpc("lk_club_tarjeta", { p_codigo: codigo });
      if (!t) { ls.del("lk_codigo"); codigo = ""; return vistaUnirse(); }
      ls.set("lk_codigo", codigo); if (qs.get("c")) history.replaceState(null, "", location.pathname);
      T = t; vistaTarjeta();
    } catch (e) { $app.innerHTML = `<div class="box stack" style="margin-top:30vh"><p class="warn">${esc(e.message)}</p><button class="btn gold block" onclick="location.reload()">Reintentar</button></div>`; }
  }

  // Revisa cada 10 s si el barbero le puso un sello, para avisarle al instante
  setInterval(async () => {
    if (!T || document.hidden) return;
    try {
      const n = await rpc("lk_club_tarjeta", { p_codigo: T.codigo }); if (!n) return;
      if (n.sellos !== T.sellos || n.canjes !== T.canjes) {
        const antes = T; T = n;
        if (n.canjes > antes.canjes) { confeti(); vistaTarjeta(); notificar(`Disfruta tu corte VIP, ${nombre1(n.nombre)}. Tu nueva tarjeta ya empezó.`); }
        else { popAt = n.sellos - 1; vistaTarjeta(); const f = (n.meta || 5) - n.sellos;
          if (f <= 0) { confeti(); notificar(`¡Completaste tu tarjeta, ${nombre1(n.nombre)}! Tu próximo corte es VIP con descuento.`); }
          else notificar(`¡Sello agregado! Llevas ${n.sellos} de ${n.meta || 5}. Te ${f === 1 ? "falta 1" : "faltan " + f} para tu corte VIP con descuento.`); }
      }
    } catch (e) {}
  }, 10000);

  cargar();
})();
