/* utilidades compartidas de la demo */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const cop = (n) => '$' + Math.round(n).toLocaleString('es-CO');
const usd = (n) => 'USD ' + n;
const srv = (id) => SERVICIOS.find((s) => s.id === id);
const PAISES = { CO: '🇨🇴 Colombia', MX: '🇲🇽 México', PE: '🇵🇪 Perú', EC: '🇪🇨 Ecuador', PA: '🇵🇦 Panamá', VE: '🇻🇪 Venezuela', CL: '🇨🇱 Chile', AR: '🇦🇷 Argentina', US: '🇺🇸 Estados Unidos', ES: '🇪🇸 España' };
const BANDERA = (p) => (PAISES[p] || '🌎').split(' ')[0];
const fechaLarga = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });

// ---- almacenamiento local (la demo vive en este dispositivo) ----
const KEY = 'fredyastro_citas_v1';
const Store = {
  get() {
    try { const x = JSON.parse(localStorage.getItem(KEY)); if (Array.isArray(x)) return x; } catch (e) {}
    const d = citasDemo(); Store.set(d); return d;
  },
  set(v) { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {} },
  add(c) { const v = Store.get(); v.push(c); Store.set(v); },
  upd(id, patch) { const v = Store.get().map((c) => (c.id === id ? { ...c, ...patch } : c)); Store.set(v); },
  reset() { try { localStorage.removeItem(KEY); } catch (e) {} },
};

const waLink = (txt, num = CONFIG.wa) => `https://wa.me/${num}?text=${encodeURIComponent(txt)}`;

// ---- cielo estrellado animado (canvas de fondo) ----
function cielo(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d'); let W, H, est = [];
  const red = () => {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    est = Array.from({ length: Math.round(W * H / 4200) }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.2, f: Math.random() * 6, v: 0.5 + Math.random() * 1.5 }));
  };
  red(); addEventListener('resize', red);
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let fugaz = null;
  const loop = (t) => {
    ctx.clearRect(0, 0, W, H);
    for (const e of est) { ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(e.f + t / 1000 * e.v * 0.6)); ctx.fillStyle = '#f3ead9'; ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 7); ctx.fill(); }
    if (!fugaz && Math.random() < 0.004) fugaz = { x: Math.random() * W * 0.8, y: Math.random() * H * 0.4, k: 0 };
    if (fugaz) {
      fugaz.k += 0.025; const x = fugaz.x + fugaz.k * 260, y = fugaz.y + fugaz.k * 120;
      const gr = ctx.createLinearGradient(x - 90, y - 42, x, y); gr.addColorStop(0, 'rgba(236,211,160,0)'); gr.addColorStop(1, 'rgba(236,211,160,.9)');
      ctx.globalAlpha = 1 - fugaz.k; ctx.strokeStyle = gr; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 90, y - 42); ctx.lineTo(x, y); ctx.stroke();
      if (fugaz.k >= 1) fugaz = null;
    }
    ctx.globalAlpha = 1; if (!quieto) requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

// aparición suave al hacer scroll
function revelar() {
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }), { threshold: 0.12 });
  $$('.rv').forEach((el) => io.observe(el));
}

function toast(msg) {
  let t = $('#toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(t._k); t._k = setTimeout(() => t.classList.remove('on'), 2400);
}

// opciones de ciudades para <select>
const opcionesCiudad = (sel = 'Bogotá') => ASTRO.CIUDADES.map((c) => `<option ${c.n === sel ? 'selected' : ''} value="${c.n}">${c.n} · ${BANDERA(c.p)}</option>`).join('');
