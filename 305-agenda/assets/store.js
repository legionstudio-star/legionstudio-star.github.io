/* 305 Barbering — Agenda (DEMO).
   Datos compartidos por index.html (clientes) y admin.html (panel).
   Todo es simulado y se guarda en localStorage de este dispositivo:
   lo que se agenda en la página aparece de una vez en el panel del mismo celular. */
(function () {
  const KEY = '305agenda_demo_v1';

  const BARBERS = [
    { id: 'andres', name: 'Andrés', role: 'Fades y diseños' },
    { id: 'kevin',  name: 'Kevin',  role: 'Clásicos y barba' },
    { id: 'mateo',  name: 'Mateo',  role: 'Freestyle y color' }
  ];

  // duración en minutos; la grilla es de 20 min y cada servicio ocupa los bloques que necesite
  const CUTS = [
    { name: 'Lo decido en la silla', duration: 40, desc: 'Llegas, hablamos y lo armamos juntos.' },
    { name: 'Corte clásico',          price: 25000, duration: 40, desc: 'Tijera y máquina, acabado a navaja.' },
    { name: 'Fade / degradado',       price: 30000, duration: 40, desc: 'Low, mid o high. Transición limpia.' },
    { name: 'Corte + barba',          price: 40000, duration: 60, desc: 'El combo de siempre, sin afán.' },
    { name: 'Perfilado de barba',     price: 18000, duration: 20, desc: 'Contorno, navaja y toalla caliente.' },
    { name: 'Diseño / freestyle',     price: 12000, duration: 20, desc: 'Líneas y figuras sobre tu corte.' },
    { name: 'Experiencia 305',        price: 60000, duration: 80, desc: 'Corte, barba, mascarilla y toalla caliente.' }
  ];

  const PIN = '3050';
  const SLOT_MINUTES = 20;
  const OPEN_HOUR = 9;        // 9:00 AM
  const CLOSE_HOUR = 21;      // 9:00 PM (el último bloque arranca 8:40 PM)

  const pad = (n) => String(n).padStart(2, '0');
  const ALL_SLOTS = [];
  for (let m = OPEN_HOUR * 60; m < CLOSE_HOUR * 60; m += SLOT_MINUTES) ALL_SLOTS.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);

  const CUT_BY_NAME = {};
  CUTS.forEach((c) => { CUT_BY_NAME[c.name] = c; });
  const blocksForCut = (name) => Math.max(1, Math.ceil(((CUT_BY_NAME[name] || {}).duration || 20) / SLOT_MINUTES));
  const priceOf = (name) => (CUT_BY_NAME[name] || {}).price || 0;

  function dateStr(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
  function todayStr() { return dateStr(new Date()); }
  function addDays(n) { const d = new Date(); d.setDate(d.getDate() + n); return dateStr(d); }
  function money(n) { return '$' + Number(n || 0).toLocaleString('es-CO'); }
  function formatTime12(hhmm) {
    const [h, m] = hhmm.split(':').map(Number);
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  // ---- datos de ejemplo (para que el panel no arranque vacío en la demo) ----
  function seed() {
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    // primer bloque libre a partir de ahora + 20 min (para que salga un recordatorio en el panel)
    const soonIdx = ALL_SLOTS.findIndex((s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m >= nowMin + 20; });
    const appts = [];
    const add = (barber_id, date, time, client_name, client_phone, service, status, amount) => {
      const b = BARBERS.find((x) => x.id === barber_id);
      appts.push({ id: uid(), barber_id, barber_name: b.name, client_name, client_phone, service, appt_date: date, appt_time: time, status, amount: amount || null, created_at: Date.now() });
    };
    const today = todayStr();
    // pasados del mes (completados) — alimentan "recaudado"
    const past = [
      ['andres', 'Juan Pablo R.', '3104567812', 'Fade / degradado'],
      ['andres', 'Santiago M.', '3157781203', 'Corte + barba'],
      ['kevin', 'Camilo T.', '3002214598', 'Corte clásico'],
      ['kevin', 'Felipe G.', '3189032211', 'Experiencia 305'],
      ['mateo', 'Nicolás P.', '3016654870', 'Diseño / freestyle'],
      ['mateo', 'David S.', '3125549087', 'Fade / degradado'],
      ['andres', 'Sebastián L.', '3209981123', 'Perfilado de barba'],
      ['kevin', 'Esteban V.', '3045567321', 'Corte + barba']
    ];
    past.forEach((p, i) => {
      const d = new Date(); d.setDate(d.getDate() - (i % 4) - 1);
      if (d.getMonth() !== now.getMonth()) d.setDate(now.getDate()); // que caiga en este mes
      const date = dateStr(d) === today ? today : dateStr(d);
      add(p[0], date, ALL_SLOTS[3 + i * 2], p[1], p[2], p[3], 'completado', priceOf(p[3]));
    });
    // hoy: cortes ya hechos en la mañana (alimentan "recaudado hoy")
    if (nowMin >= 10 * 60) add('kevin', today, '09:00', 'Sergio A.', '3172223344', 'Corte + barba', 'completado', 40000);
    if (nowMin >= 11 * 60) add('andres', today, '10:00', 'Mauricio E.', '3013334455', 'Fade / degradado', 'completado', 30000);
    // hoy: pendientes
    if (soonIdx > -1) {
      add('andres', today, ALL_SLOTS[soonIdx], 'Miguel Ángel H.', '3112345678', 'Fade / degradado', 'pendiente');
      if (ALL_SLOTS[soonIdx + 3]) add('andres', today, ALL_SLOTS[soonIdx + 3], 'Óscar D.', '3186543210', 'Corte + barba', 'pendiente');
      if (ALL_SLOTS[soonIdx + 1]) add('kevin', today, ALL_SLOTS[soonIdx + 1], 'Daniel C.', '3007654321', 'Corte clásico', 'pendiente');
      if (ALL_SLOTS[soonIdx + 2]) add('mateo', today, ALL_SLOTS[soonIdx + 2], 'Alejandro B.', '3158889900', 'Experiencia 305', 'pendiente');
    }
    // mañana y pasado
    add('andres', addDays(1), '10:00', 'Julián F.', '3134567890', 'Corte clásico', 'pendiente');
    add('andres', addDays(1), '15:20', 'Brayan Q.', '3041112233', 'Fade / degradado', 'pendiente');
    add('kevin', addDays(1), '11:00', 'Cristian O.', '3209876543', 'Perfilado de barba', 'pendiente');
    add('mateo', addDays(2), '17:00', 'Andrés Felipe N.', '3115556677', 'Diseño / freestyle', 'pendiente');
    // un bloqueo de ejemplo: Mateo almuerza mañana 1:00–2:00 PM
    const blocks = ['13:00', '13:20', '13:40'].map((t) => ({ id: uid(), barber_id: 'mateo', block_date: addDays(1), all_day: false, time_slot: t }));
    return { v: 1, appointments: appts, blocked: blocks };
  }

  function load() {
    try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v === 1) return s; } catch (e) {}
    const s = seed(); save(s); return s;
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }

  const API = {
    BARBERS, CUTS, PIN, ALL_SLOTS, SLOT_MINUTES, OPEN_HOUR, CLOSE_HOUR,
    pad, todayStr, addDays, money, formatTime12, blocksForCut, priceOf, esc, uid,
    reset() { localStorage.removeItem(KEY); return load(); },
    appointments(filter) {
      const s = load();
      return s.appointments.filter((a) => Object.keys(filter || {}).every((k) => a[k] === filter[k]));
    },
    blocks(barber_id, date) { return load().blocked.filter((b) => b.barber_id === barber_id && b.block_date === date); },
    addAppointment(a) { const s = load(); const row = { id: uid(), created_at: Date.now(), amount: null, ...a }; s.appointments.push(row); save(s); return row; },
    updateAppointment(id, patch) { const s = load(); const a = s.appointments.find((x) => x.id === id); if (a) Object.assign(a, patch); save(s); },
    deleteAppointment(id) { const s = load(); s.appointments = s.appointments.filter((x) => x.id !== id); save(s); },
    deleteAppointmentsOf(barber_id) { const s = load(); s.appointments = s.appointments.filter((x) => x.barber_id !== barber_id); save(s); },
    addBlocks(rows) { const s = load(); rows.forEach((r) => s.blocked.push({ id: uid(), ...r })); save(s); },
    removeBlocks(pred) { const s = load(); s.blocked = s.blocked.filter((b) => !pred(b)); save(s); },

    /* Índices de la grilla ocupados (por turnos, según su duración) y bloqueados para un barbero/día. */
    dayStatus(barber_id, date) {
      const occupied = new Set(), blocked = new Set();
      let allDay = false;
      API.appointments({ barber_id, appt_date: date }).filter((a) => a.status !== 'cancelado').forEach((a) => {
        const i = ALL_SLOTS.indexOf(a.appt_time); if (i < 0) return;
        for (let k = 0; k < blocksForCut(a.service); k++) if (i + k < ALL_SLOTS.length) occupied.add(i + k);
      });
      API.blocks(barber_id, date).forEach((b) => {
        if (b.all_day) allDay = true;
        else { const i = ALL_SLOTS.indexOf(b.time_slot); if (i > -1) blocked.add(i); }
      });
      return { occupied, blocked, allDay };
    },
    /* ¿Cabe un servicio desde startIdx? Devuelve '' si sí, o la razón si no. */
    fits(st, startIdx, service) {
      if (st.allDay) return 'Día bloqueado';
      const n = blocksForCut(service);
      if (startIdx < 0 || startIdx + n > ALL_SLOTS.length) return 'No alcanza antes de cerrar';
      for (let k = 0; k < n; k++) {
        if (st.occupied.has(startIdx + k)) return 'Ocupado';
        if (st.blocked.has(startIdx + k)) return 'No disponible';
      }
      return '';
    },
    isPast(date, slot) {
      if (date < todayStr()) return true;
      if (date > todayStr()) return false;
      const [h, m] = slot.split(':').map(Number); const n = new Date();
      return h * 60 + m <= n.getHours() * 60 + n.getMinutes();
    }
  };
  window.AG = API;
})();

/* Diálogos propios (en vez de alert/confirm del navegador) */
(function () {
  function ensure() {
    let el = document.getElementById('ag-modal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'ag-modal';
    el.innerHTML = '<div class="ag-modal-card"><div class="ag-modal-msg"></div><div class="ag-modal-actions"></div></div>';
    document.body.appendChild(el);
    return el;
  }
  function show(html, buttons) {
    return new Promise((resolve) => {
      const el = ensure();
      el.querySelector('.ag-modal-msg').innerHTML = html;
      const act = el.querySelector('.ag-modal-actions');
      act.innerHTML = '';
      buttons.forEach((b) => {
        const btn = document.createElement('button');
        btn.type = 'button'; btn.textContent = b.label; btn.className = b.primary ? 'ag-btn-primary' : 'ag-btn-ghost';
        btn.onclick = () => { el.classList.remove('show'); resolve(b.value); };
        act.appendChild(btn);
      });
      el.classList.add('show');
    });
  }
  window.agAlert = (html) => show(html, [{ label: 'Entendido', value: true, primary: true }]);
  window.agConfirm = (html, yes = 'Sí, seguir', no = 'Cancelar') => show(html, [{ label: no, value: false }, { label: yes, value: true, primary: true }]);
  window.agToast = (txt) => {
    let t = document.getElementById('ag-toast');
    if (!t) { t = document.createElement('div'); t.id = 'ag-toast'; document.body.appendChild(t); }
    t.textContent = txt; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2600);
  };
})();
