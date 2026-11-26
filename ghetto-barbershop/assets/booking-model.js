/* Shared booking rules. The server must enforce the same rules transactionally. */
(function (root) {
  'use strict';
  const minutes = (value) => {
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(String(value))) return NaN;
    const [h, m] = value.split(':').map(Number);
    return h >= 0 && h < 24 && m >= 0 && m < 60 ? h * 60 + m : NaN;
  };
  const clock = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
  function catalog(barber, defaults) {
    if (!barber) return [];
    const own = Array.isArray(barber.servicios) ? barber.servicios : defaults;
    return own.filter((s) => s.activo !== false).map((s) => ({ ...s, duracion: Number(s.duracion) }))
      .filter((s) => Number.isInteger(s.duracion) && s.duracion >= 10 && s.duracion <= 240);
  }
  function needsConfirmation(barber, date) {
    return (barber?.fechas_confirmacion || []).some((d) => d === date || d === date.slice(5));
  }
  function safeImage(value) {
    if (typeof value !== 'string') return '';
    if (/^assets\/img\/[a-zA-Z0-9_.-]+$/.test(value)) return value;
    try { const u = new URL(value); return u.protocol === 'https:' ? u.href : ''; } catch (_) { return ''; }
  }
  function portfolio(barber) {
    return (barber?.portafolio || []).map((p) => ({ ...p, url: safeImage(p.url) })).filter((p) => p.url);
  }
  function workRanges(barber, date, fallback) {
    if ((barber.vacaciones || []).some((v) => v.desde <= date && date <= v.hasta)) return [];
    const dow = new Date(`${date}T12:00:00-05:00`).getUTCDay();
    const own = barber.horario_semanal;
    const ranges = own ? (own[String(dow)] || []) :
      (fallback.dias_cerrados || []).map(String).includes(String(dow)) ? [] :
      [{ inicio: fallback.hora_abre || '10:00', fin: fallback.hora_cierra || '20:00' }];
    return ranges.map((r) => [minutes(r.inicio), minutes(r.fin)]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b > a);
  }
  function freeSlots({ barber, service, date, config, occupied, now = -1 }) {
    if (!barber || !service || occupied.todo_dia) return [];
    const duration = Number(service.duracion), step = Number(config.intervalo || 20);
    if (!Number.isInteger(duration) || duration < 10 || duration > 240 || !Number.isInteger(step) || step < 5) return [];
    const dow = String(new Date(`${date}T12:00:00-05:00`).getUTCDay());
    const breaks = (barber.descansos || []).filter((r) => !r.fecha && (r.dia == null || String(r.dia) === dow) || r.fecha === date)
      .map((r) => [minutes(r.inicio), minutes(r.fin)]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b > a);
    const busy = [...(occupied.rangos || []), ...breaks];
    const result = new Set();
    for (const [open, close] of workRanges(barber, date, config)) {
      for (let start = open; start + duration <= close; start += step) {
        if (start <= now || busy.some(([a, b]) => Number(a) < start + duration && Number(b) > start)) continue;
        result.add(clock(start));
      }
    }
    return [...result].sort();
  }
  /* Cuadro de horas del día: TODAS las horas del barbero; las tomadas o pasadas salen tachadas.
     Las horas dentro de un descanso fijo (almuerzo, día libre) no se muestran. */
  function breaksOf(barber, date) {
    const dow = String(new Date(`${date}T12:00:00-05:00`).getUTCDay());
    return (barber.descansos || []).filter((r) => !r.fecha && (r.dia == null || String(r.dia) === dow) || r.fecha === date)
      .map((r) => [minutes(r.inicio), minutes(r.fin)]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b > a);
  }
  function slotGrid({ barber, duration, date, config, busy = [], now = -1 }) {
    const step = Number(config.intervalo || 20), dur = Number(duration) || step;
    if (!barber || !Number.isInteger(step) || step < 5) return [];
    const rests = breaksOf(barber, date), out = new Map();
    const hit = (list, start, len) => list.some(([a, b]) => Number(a) < start + len && Number(b) > start);
    for (const [open, close] of workRanges(barber, date, config)) {
      for (let start = open; start + Math.min(dur, step) <= close; start += step) {
        if (hit(rests, start, Math.min(dur, step))) continue;
        let state = 'free';
        if (start <= now) state = 'past';
        else if (hit(busy, start, Math.min(dur, step))) state = 'taken';
        else if (start + dur > close || hit(busy, start, dur) || hit(rests, start, dur)) state = 'short';
        out.set(clock(start), state);
      }
    }
    return [...out.entries()].sort().map(([t, state]) => ({ t, state }));
  }
  const api = { minutes, clock, catalog, needsConfirmation, safeImage, portfolio, workRanges, freeSlots, slotGrid, breaksOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GhettoBooking = api;
})(typeof window === 'undefined' ? globalThis : window);
