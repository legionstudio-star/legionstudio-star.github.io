/* Club Look · utilidades compartidas (cliente y panel). Tecnología LEGION. */
window.LK = (() => {
  const A = "/lookbarber/assets/";
  const BARBEROS = [{ id: "Diego", c: "#C8202F" }, { id: "Sebastián", c: "#3E6BC4" }, { id: "Felipe", c: "#8E44AD" }];
  const SERVICIOS = [
    { n: "Corte caballero", p: 18000, img: "corte1" }, { n: "Corte desde la cero", p: 20000, img: "corte2" },
    { n: "Corte con shaver y cejas", p: 25000, img: "corte3" }, { n: "Barba", p: 10000, img: "corte4" },
    { n: "Corte todo incluido", p: 35000, img: "corte5" }, { n: "Exfoliación", p: 12000, img: "corte6" },
  ];
  async function rpc(fn, args) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, { method: "POST", headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" }, body: JSON.stringify(args || {}) });
    const t = await r.text(); let j = null; try { j = t ? JSON.parse(t) : null; } catch (e) {}
    if (!r.ok) throw new Error((j && j.message) || "No hay conexión. Intenta otra vez.");
    return j;
  }
  const esc = (t) => String(t ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pesos = (v) => "$" + Math.round(v || 0).toLocaleString("es-CO");
  const nombre1 = (n) => String(n || "").split(/\s+/)[0];
  const iniciales = (n) => String(n || "?").split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const dias = (t) => Math.max(0, Math.floor((Date.now() - new Date(t)) / 864e5));
  const fecha = (t) => new Date(t).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  function qrSvg(txt) {
    const q = qrcode(0, "M"); q.addData(txt); q.make(); const n = q.getModuleCount(); let d = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) d += `M${c},${r}h1v1h-1z`;
    return `<svg viewBox="-2 -2 ${n + 4} ${n + 4}" shape-rendering="crispEdges"><path d="${d}" fill="#0A0A0C"/></svg>`;
  }
  const SV = (d, w = 22) => `<svg class="ico" width="${w}" height="${w}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const P = {
    tijera: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
    regalo: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  };
  const I = {
    tijera: SV(P.tijera), regalo: SV(P.regalo), regaloS: SV(P.regalo, 14),
    torta: SV('<path d="M4 21h16M5 21v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M5 16c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 5 0M12 12V8M12 5.5V5"/>'),
    amigos: SV('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.2c2.8.4 5 2.8 5 5.8"/>'),
    cel: SV('<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),
    cal: SV('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'),
    estrella: SV('<path d="m12 2.8 2.8 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17l-5.6 3 1.1-6.2L2.9 9.4l6.3-.9L12 2.8Z"/>'),
    pin: SV('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    camara: SV('<path d="M4 8h3l2-2.5h6L17 8h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.5"/>', 20),
    buscar: SV('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 20),
    reloj: SV('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 20),
    grupo: SV('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M16 14.2c2.8.4 5 2.8 5 5.8"/>', 20),
    wa: '<svg class="ico" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Z"/></svg>',
  };
  function sellos(n, meta, popAt = -1) {
    return Array.from({ length: meta }, (_, i) => { const last = i === meta - 1;
      return `<span class="stamp ${i < n ? "on" : ""} ${last ? "last" : ""} ${i === popAt ? "pop" : ""}">${SV(last ? P.regalo : P.tijera, 24)}</span>`; }).join("");
  }
  function toast(txt, ms = 2600) { const el = document.createElement("div"); el.className = "toast"; el.textContent = txt; document.getElementById("phone").appendChild(el); setTimeout(() => el.remove(), ms); }
  function confeti() {
    const box = document.createElement("div"); box.className = "confetti"; const cols = ["#C8202F", "#FF4D5E", "#3E6BC4", "#ffffff"];
    for (let i = 0; i < 70; i++) { const c = document.createElement("i"); c.style.left = Math.random() * 100 + "%"; c.style.background = cols[i % 4]; c.style.animationDelay = Math.random() * .5 + "s"; c.style.animationDuration = 1.2 + Math.random() * 1.2 + "s"; box.appendChild(c); }
    document.getElementById("phone").appendChild(box); setTimeout(() => box.remove(), 3000);
  }
  const ls = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} }, del: (k) => { try { localStorage.removeItem(k); } catch (e) {} } };
  return { A, BARBEROS, SERVICIOS, rpc, esc, pesos, nombre1, iniciales, dias, fecha, qrSvg, I, SV, sellos, toast, confeti, ls,
    AGENDA: "https://yato25648-ai.github.io/LOOKBARBER/", RESENAS: "https://www.google.com/maps/search/?api=1&query=Look+Barbershop+Store",
    MAPA: "https://www.google.com/maps/search/?api=1&query=Look+Barbershop+Store", URL: "https://legionestudio.com/lookbarber/" };
})();
