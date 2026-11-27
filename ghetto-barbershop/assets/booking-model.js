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
    const duration = Number(service.duracion), step = stepFor(barber, config);
    if (!Number.isInteger(duration) || duration < 10 || duration > 240 || !Number.isInteger(step) || step < 5) return [];
    // Mismas horas encadenadas que el cuadro (slotGrid), solo las libres.
    return slotGrid({ barber, duration, date, config, busy: occupied.rangos || [], now })
      .filter((g) => g.state === 'free').map((g) => g.t);
  }
  /* Cuadro de horas del día: TODAS las horas del barbero; las tomadas o pasadas salen tachadas.
     Las horas dentro de un descanso fijo (almuerzo, día libre) no se muestran. */
  function breaksOf(barber, date) {
    const dow = String(new Date(`${date}T12:00:00-05:00`).getUTCDay());
    return (barber.descansos || []).filter((r) => !r.fecha && (r.dia == null || String(r.dia) === dow) || r.fecha === date)
      .map((r) => [minutes(r.inicio), minutes(r.fin)]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b > a);
  }
  /* Turnos ENCADENADOS (pedido de Santi, 26-nov): el siguiente turno empieza cuando
     termina el anterior. Corte 8:00-8:50 -> siguiente 8:50, luego cada "intervalo"
     (8:50, 9:30, 10:10...). Igual que gb_validar_espacio en el servidor: la cuadrícula
     se mide desde el fin del último turno/descanso/bloqueo, o desde la apertura. */
  /* Intervalo propio de cada barbero (Santi 40, Abraham 50...); si no tiene, el general. */
  function stepFor(barber, config) {
    const own = barber && config.intervalos && config.intervalos[barber.id];
    return Number(own || config.intervalo || 20);
  }
  function slotGrid({ barber, duration, date, config, busy = [], now = -1 }) {
    const step = stepFor(barber, config), dur = Number(duration) || step;
    if (!barber || !Number.isInteger(step) || step < 5) return [];
    const rests = breaksOf(barber, date), out = new Map();
    const busyN = busy.map(([a, b]) => [Number(a), Number(b)]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b) && b > a);
    const obstacles = [...rests.map(([a, b]) => [a, b, 'rest']), ...busyN.map(([a, b]) => [a, b, 'busy'])].sort((x, y) => x[0] - y[0]);
    const hit = (list, start, len) => list.some(([a, b]) => a < start + len && b > start);
    for (const [open, close] of workRanges(barber, date, config)) {
      let t = open, guard = 0;
      while (t < close && guard++ < 500) {
        const ob = obstacles.find(([a, b]) => a <= t && b > t);
        if (ob) {
          if (ob[2] === 'busy' && !out.has(clock(Math.max(ob[0], open)))) out.set(clock(Math.max(ob[0], open)), 'taken');
          t = ob[1]; continue;
        }
        if (t + Math.min(dur, step) > close) break;
        let state = 'free';
        if (t <= now) state = 'past';
        else if (t + dur > close || hit(busyN, t, dur) || hit(rests, t, dur)) state = 'short';
        out.set(clock(t), state);
        const next = t + step, mid = obstacles.find(([a]) => a > t && a < next);
        t = mid ? mid[0] : next;
      }
    }
    return [...out.entries()].sort().map(([t, state]) => ({ t, state }));
  }
  const api = { minutes, clock, catalog, needsConfirmation, safeImage, portfolio, workRanges, freeSlots, slotGrid, stepFor, breaksOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.GhettoBooking = api;
})(typeof window === 'undefined' ? globalThis : window);
