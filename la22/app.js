// ===== La 22 Domicilios · núcleo compartido (LEGION Studio) =====
const SB_URL = 'https://cbvzwwhdfxwlujmninov.supabase.co';
const SB_KEY = 'sb_publishable_o-pcQCGPXSuvRdxovVmSIA_F9qyR1-9';
const NEGOCIO = 'Surtidora de Aves La 22';
const LEMA = 'La Esquina del Sabor';
const TIENDA = { lat: 4.5330, lng: -74.1170, nombre: 'Sede principal' };
const ENVIO = 3000, GRATIS_DESDE = 60000;
const DEMO_MIN_CAMINO = 4; // minutos que tarda la moto en el demo (en la vida real ~15-25)

async function rpc(fn, args = {}) {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const txt = await r.text();
  let data = null;
  try { data = txt ? JSON.parse(txt) : null; } catch { data = txt; }
  if (!r.ok) throw new Error((data && data.message) || 'Error de conexión');
  return data;
}

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const pesos = (n) => '$' + Math.round(n || 0).toLocaleString('es-CO');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const hora = (d) => d ? new Date(d).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/Bogota' }) : '';
const minDesde = (d, ahora) => Math.max(0, ((ahora ? new Date(ahora) : new Date()) - new Date(d)) / 60000);

function toast(msg, tipo = '') {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.className = 'show ' + tipo;
  clearTimeout(t._h); t._h = setTimeout(() => (t.className = ''), 2800);
}

let _ac;
function beep(tipo = 'nuevo') {
  try {
    _ac = _ac || new (window.AudioContext || window.webkitAudioContext)();
    const notas = tipo === 'ok' ? [660, 990] : [740, 988, 1318];
    notas.forEach((f, i) => {
      const o = _ac.createOscillator(), g = _ac.createGain();
      o.type = 'sine'; o.frequency.value = f; o.connect(g); g.connect(_ac.destination);
      const t0 = _ac.currentTime + i * 0.16;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.35, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.15);
      o.start(t0); o.stop(t0 + 0.16);
    });
  } catch {}
}

// ---------- menú ----------
let MENU = null;
async function cargarMenu() {
  if (MENU) return MENU;
  MENU = await (await fetch('menu.json')).json();
  return MENU;
}
const foto = (id) => `img/p/${id}.webp`;
const llevaGaseosa = (it) => /gaseosa 1\.5/i.test(it.d || '') && !/sin gaseosa/i.test(it.n);

// ---------- posición de la moto ----------
// Si el domiciliario comparte GPS (actualizado hace <60 s) se usa ese punto.
// Si no, se simula el recorrido por "calles" (primero en una dirección y luego en la otra).
function posMoto(p, ahora) {
  if (p.dlat && p.gps_at && minDesde(p.gps_at, ahora) < 1 && p.estado === 'camino') return { lat: p.dlat, lng: p.dlng, real: true, f: null };
  if (p.estado !== 'camino' || !p.camino_at) return null;
  const f = Math.min(1, minDesde(p.camino_at, ahora) / DEMO_MIN_CAMINO);
  return { ...ruta(TIENDA, { lat: p.lat, lng: p.lng }, f), real: false, f };
}
function ruta(a, b, f) {
  const dLat = b.lat - a.lat, dLng = b.lng - a.lng;
  const t1 = Math.abs(dLat) / (Math.abs(dLat) + Math.abs(dLng) || 1);
  if (f <= t1) return { lat: a.lat + dLat * (f / (t1 || 1)), lng: a.lng };
  return { lat: b.lat, lng: a.lng + dLng * ((f - t1) / (1 - t1 || 1)) };
}
function rutaPuntos(a, b) { return [[a.lat, a.lng], [b.lat, a.lng], [b.lat, b.lng]]; }

const ESTADOS = [
  { k: 'nuevo', t: 'Recibido', d: 'Confirmamos tu pedido' },
  { k: 'cocina', t: 'En cocina', d: 'Tu pollo se está preparando' },
  { k: 'listo', t: 'Listo', d: 'Empacado y esperando al domiciliario' },
  { k: 'camino', t: 'En camino', d: 'Tu domiciliario va para tu casa' },
  { k: 'entregado', t: 'Entregado', d: '¡Buen provecho!' },
];
const CANAL = { web: 'Web', whatsapp: 'WhatsApp', llamada: 'Llamada' };

function iconoMoto() {
  return L.divIcon({ className: 'ic-moto', html: '<div><svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 17a3 3 0 1 0 6 0H5zm14-5h-1.3l-2-4H12v2h2.5l1 2H9.6L8 10H4v2h3l1.4 3H5a3 3 0 0 0 0 6 3 3 0 0 0 2.8-2h6.4A3 3 0 1 0 19 12zm0 7a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM5 19a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg></div>', iconSize: [40, 40], iconAnchor: [20, 20] });
}
function iconoPin(cls, txt) {
  return L.divIcon({ className: 'ic-pin ' + cls, html: `<div>${txt}</div>`, iconSize: [36, 36], iconAnchor: [18, 18] });
}
