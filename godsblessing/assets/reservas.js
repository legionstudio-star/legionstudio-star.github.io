
const { rpc, esc, money, toMin, fromMin, time12, addDays, parseDate, dateLong, dateShort, waLink, alertBox, confirmBox, toast } = GB;
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- estado ---------- */
let INFO = null, CFG = {}, svc = null, bar = null, day = '', slot = '';
let loadedAt = Date.now();
const MINE_KEY = 'gbl_mis_turnos';
const nowMinBogota = () => toMin(INFO.ahora) + Math.floor((Date.now() - loadedAt) / 60000);

async function init() {
  try { INFO = await rpc('gbl_info'); loadedAt = Date.now(); CFG = INFO.config || {}; }
  catch (e) { document.getElementById('svcChips').innerHTML = `<p class="hint">${esc(e.message)} <button type="button" onclick="init()">Reintentar</button></p>`; return; }
  paintInfo(); paintPromos(); paintGaleria(); paintServices(); paintBarbers(); paintDays(); paintSummary(); paintMine();
  try { const saved = JSON.parse(localStorage.getItem('gbl_contacto') || '{}'); document.getElementById('name').value = saved.nombre || ''; document.getElementById('tel').value = saved.tel || ''; } catch {}
  paintSummary();
  if (location.hash === '#agenda') BookingUI.open();
  else if (['#pagos','#resena'].includes(location.hash)) document.querySelector(location.hash)?.scrollIntoView();
}

function paintInfo() {
  const hours = GB.hoursFor(CFG, INFO.hoy), n = nowMinBogota();
  const open = !hours.closed && n >= toMin(hours.open) && n < toMin(hours.close);
  document.getElementById('liveDot').classList.toggle('off', !open);
  document.getElementById('liveTxt').textContent = open ? `Abierto hoy hasta ${time12(hours.close)}` : 'Reserva tu próxima visita';
  document.getElementById('metaTxt').textContent = CFG.meta_sellos || 10;
  document.getElementById('premioTxt').textContent = (CFG.premio || 'corte gratis').toLowerCase();
  document.getElementById('horTxt').textContent = CFG.horario_texto || `${time12(hours.open)} – ${time12(hours.close)}`;
  document.getElementById('dirTxt').textContent = CFG.direccion || 'Consulta nuestra ubicación';
  document.getElementById('houseAddress').textContent = CFG.direccion || 'Consulta nuestra ubicación';
  document.querySelector('.hero-coordinate').textContent = CFG.direccion || 'God’s Blessing Barbería';
  document.getElementById('vDir').href = CFG.mapa || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CFG.direccion || "God's Blessing Barbería")}`;
  document.getElementById('metodos').textContent = CFG.pagos || 'Consulta los medios de pago';
  const paymentKey = /llave\s*:?\s*(\S+)/i.exec(CFG.pagos || '')?.[1];
  document.querySelector('.payment h3').textContent = paymentKey ? 'Pago por llave' : 'Métodos de pago';
  document.getElementById('copyKey').hidden = !paymentKey;
  document.getElementById('copyKey').onclick = async () => { try { await navigator.clipboard.writeText(paymentKey); toast('Llave copiada'); } catch { alertBox(`Llave: <b>${esc(paymentKey)}</b>`); } };
  const target = Number(CFG.meta_sellos || 10);
  document.querySelector('.club-stamps').innerHTML = Array.from({length:target},()=>'<span><svg><use href="#crown"/></svg></span>').join('');
  document.getElementById('resena').hidden = !CFG.resena;
  if (CFG.resena) document.getElementById('btnResena').href = CFG.resena;
  if (CFG.instagram) { const ig = document.getElementById('igLink'); ig.hidden = false; ig.href = `https://www.instagram.com/${CFG.instagram.replace('@', '')}/`; }
  if (CFG.whatsapp) { const w = document.getElementById('vWa'); w.href = waLink(CFG.whatsapp, 'Hola, quiero información de God’s Blessing.'); w.target = '_blank'; w.rel = 'noopener'; document.getElementById('waTxt').textContent = String(CFG.whatsapp).replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3'); }
}
function paintPromos() {
  const ps = INFO.promos || []; document.getElementById('promos').hidden = !ps.length;
  document.getElementById('promosBox').innerHTML = ps.map(p => `<a class="promo" href="#agenda"><h3>${esc(p.titulo)}</h3><p>${esc(p.descripcion)}</p><b>${money(p.precio)}</b></a>`).join('');
}
function paintGaleria() {
  const photos = INFO.galeria || [];
  const isSample = g => /(?:trono_|fade_|navaja_|cuero_)/.test(g.foto || '');
  document.getElementById('galleryNote').textContent = photos.some(isSample) ? 'Imágenes de referencia mientras llega nuestro portafolio.' : 'Nuestro espacio. Nuestro equipo. Nuestro día a día.';
  document.getElementById('trabajos').hidden = !photos.length;
  document.getElementById('galBox').innerHTML = photos.map((g,i) => `<figure><img src="${esc(g.foto)}" alt="${esc(g.titulo || 'En God’s Blessing')}" loading="lazy"><figcaption><span>${esc(g.titulo || 'God’s Blessing')}</span><small>${isSample(g) ? 'REFERENCIA' : String(i+1).padStart(2,'0') + ' / LA CASA'}</small></figcaption></figure>`).join('');
}
function paintServices() {
  const box = document.getElementById('services'), chips = document.getElementById('svcChips');
  box.innerHTML = ''; chips.innerHTML = '';
  INFO.servicios.forEach((service,index) => {
    const price = service.precio != null ? money(service.precio) : 'Se cotiza';
    const item = document.createElement('button'); item.type='button'; item.className='service-item';
    item.setAttribute('aria-label',service.nombre + ', ' + price + ', ' + service.duracion + ' minutos. Reservar');
    item.innerHTML = `<span class="service-index">${String(index+1).padStart(2,'0')}</span><span><h3>${esc(service.nombre)}</h3><p>${esc(service.descripcion)}</p></span><span class="service-price"><b>${price}</b><small>${service.duracion} MINUTOS</small></span><span class="service-arrow"><svg><use href="#arrow-up"/></svg></span>`;
    item.onclick=()=>{pickSvc(service.id);BookingUI.open(1)}; box.appendChild(item);
    const chip=document.createElement('button');chip.type='button';chip.className='chip';chip.dataset.id=service.id;chip.setAttribute('role','radio');chip.setAttribute('aria-checked','false');
    chip.innerHTML=`${esc(service.nombre)}<small>${price} · ${service.duracion} min</small>`;chip.onclick=()=>pickSvc(service.id);chips.appendChild(chip);
  });
}
function pickSvc(id) {
  svc = INFO.servicios.find((s) => s.id === id);
  document.querySelectorAll('#svcChips .chip').forEach((c) => { const on = c.dataset.id === id; c.classList.toggle('on', on); c.setAttribute('aria-checked', on); });
  refreshSlots();
}

function paintBarbers() {
  const box = document.getElementById('barbers'), chips = document.getElementById('barChips');
  box.innerHTML = ''; chips.innerHTML = '';
  const reales = INFO.barberos.filter((b) => !/^(administrador|barbero \d+)$/i.test(b.nombre));
  document.getElementById('equipo').hidden = !reales.length;
  reales.forEach((b,i) => {
    const card=document.createElement('article');card.className='team-member';
    card.innerHTML=`<div class="team-member-top"><span>BARBERO / ${String(i+1).padStart(2,'0')}</span><svg><use href="#scissors"/></svg></div><h3>${esc(b.nombre)}</h3><p>${esc(b.especialidad || 'God’s Blessing Barbería')}</p><button type="button" class="text-link">Reservar con ${esc(b.nombre)}<svg><use href="#arrow-up"/></svg></button>`;
    card.querySelector('button').onclick=()=>{pickBar(b.id);BookingUI.open(0)};box.appendChild(card);
  });
  const any = document.createElement('button'); any.type = 'button'; any.className = 'chip on'; any.dataset.id = 'any'; any.setAttribute('role', 'radio'); any.setAttribute('aria-checked', 'true'); any.textContent = 'Cualquiera disponible'; any.onclick = () => pickBar('any'); chips.appendChild(any);
  INFO.barberos.forEach((b) => {
    const c = document.createElement('button');
    c.type = 'button'; c.className = 'chip'; c.dataset.id = b.id; c.textContent = b.nombre; c.setAttribute('role', 'radio');
    c.onclick = () => pickBar(b.id);
    chips.appendChild(c);
  });
  if (INFO.barberos.length === 1) { pickBar(INFO.barberos[0].id); document.getElementById('barberField').hidden = true; }
}
function pickBar(id) {
  bar = id === 'any' ? null : INFO.barberos.find((b) => b.id === id);
  document.querySelectorAll('#barChips .chip').forEach((c) => { const on = c.dataset.id === id; c.classList.toggle('on', on); c.setAttribute('aria-checked', on); });
  refreshSlots();
}

function paintDays() {
  const box = document.getElementById('days'); box.innerHTML = '';
  const closed = (CFG.dias_cerrados || []).map(String), max = Number(CFG.dias_adelante || 21);
  const DOW = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  for (let i = 0, n = 0; i <= max && n < 14; i++) {
    const d = addDays(INFO.hoy, i), dt = parseDate(d);
    if (closed.includes(String(dt.getDay()))) continue;
    if (i === 0 && nowMinBogota() >= toMin(GB.hoursFor(CFG, d).close) - 30) continue;
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'day'; b.dataset.d = d; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', dateLong(d));
    b.innerHTML = `<small>${i === 0 ? 'Hoy' : i === 1 ? 'Mañana' : DOW[dt.getDay()]}</small><b>${dt.getDate()}</b>`;
    b.onclick = () => { day = d; box.querySelectorAll('.day').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); }); refreshSlots(); };
    b.setAttribute('aria-checked', 'false'); box.appendChild(b); n++;
  }
  const first = box.querySelector('button'); if (first) first.click();
}

let slotReq = 0, assignedBar = null;
async function refreshSlots() {
  const my = ++slotReq; slot = ''; assignedBar = null; paintSummary();
  const box = document.getElementById('slots'), count = document.getElementById('slotCount'); count.textContent = '';
  if (!svc || !day) { box.innerHTML = '<p class="hint">Elige un servicio para ver las horas libres.</p>'; return; }
  box.innerHTML = '<p class="hint"><span class="spin"></span> Buscando horas libres…</p>';
  const candidates = bar ? [bar] : INFO.barberos;
  let results;
  try { results = await Promise.all(candidates.map(async b => ({ barbero: b, ocupado: await rpc('gbl_ocupado', { p_barbero: b.id, p_fecha: day }) }))); }
  catch(e) { if (my === slotReq) box.innerHTML = `<p class="hint">${esc(e.message)} <button type="button" id="retrySlots">Reintentar</button></p>`; const retry = document.getElementById('retrySlots'); if(retry) retry.onclick = refreshSlots; return; }
  if (my !== slotReq) return;
  const hours = GB.hoursFor(CFG, day), step = Number(CFG.intervalo || 30), now = day === INFO.hoy ? nowMinBogota() : -1;
  box.innerHTML = ''; let free = 0;
  if (!hours.closed) for (let m = toMin(hours.open); m + svc.duracion <= toMin(hours.close); m += step) {
    if (m <= now) continue;
    const available = results.find(r => !r.ocupado.todo_dia && !r.ocupado.rangos.some(([a,b]) => a < m + svc.duracion && b > m));
    if (!available) continue;
    free++; const button = document.createElement('button'); button.type = 'button'; button.className = 'slot'; button.textContent = time12(fromMin(m)); button.setAttribute('role','radio'); button.setAttribute('aria-checked','false');
    button.onclick = () => { slot = fromMin(m); assignedBar = available.barbero; box.querySelectorAll('.slot').forEach(x => { const on = x === button; x.classList.toggle('on',on); x.setAttribute('aria-checked',String(on)); }); paintSummary(); };
    box.appendChild(button);
  }
  count.textContent = free ? `${free} libres` : '';
  if (!free) box.innerHTML = '<p class="hint">No quedan horas disponibles. Prueba otro día o barbero.</p>';
}

function paintSummary() {
  window.BookingUI?.sync();
  const name = document.getElementById('name').value.trim();
  document.getElementById('summary').innerHTML = `
    <div><span>SERVICIO</span><b>${svc ? esc(svc.nombre) : '—'}</b></div>
    <div><span>DÍA</span><b>${day ? dateShort(day) : '—'}</b></div>
    <div><span>HORA</span><b>${slot ? time12(slot) : '—'}</b></div>
    ${INFO && INFO.barberos.length > 1 ? `<div><span>BARBERO</span><b>${esc((assignedBar || bar)?.nombre || 'Cualquiera disponible')}</b></div>` : ''}
    <div><span>CLIENTE</span><b>${esc(name) || '—'}</b></div>
    <div class="total"><span>VALOR</span><b>${svc ? (svc.precio != null ? money(svc.precio) : 'Se cotiza') : '—'}</b></div>`;
}
document.getElementById('name').addEventListener('input', paintSummary);

const form = document.getElementById('form'), msg = document.getElementById('msg'), submit = document.getElementById('submit');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (submit.disabled || !INFO) return;
  if (BookingUI.current < 2) { document.getElementById('bookingNext').click(); return; }
  msg.textContent = '';
  const name = document.getElementById('name').value.trim(), tel = document.getElementById('tel').value.replace(/\D/g, '').slice(-10);
  const fail = (m, el) => { msg.textContent = m; if (el) el.focus(); };
  if (!svc) return fail('Elige el servicio.');
  if (!day) return fail('Elige el día.');
  if (!slot || !assignedBar) return fail('Elige una hora libre.');
  if (name.length < 2) return fail('Escribe tu nombre.', document.getElementById('name'));
  if (tel.length !== 10) return fail('Escribe tu WhatsApp (10 dígitos).', document.getElementById('tel'));
  submit.disabled = true; form.querySelectorAll('fieldset').forEach(f => f.disabled = true); submit.innerHTML = '<span class="spin"></span> Apartando…';
  try {
    const r = await rpc('gbl_agendar', { p_barbero: assignedBar.id, p_servicio: svc.id, p_nombre: name, p_tel: tel, p_fecha: day, p_hora: slot });
    try { const mine = JSON.parse(localStorage.getItem(MINE_KEY) || '[]'); mine.push({ id: r.id, tel }); localStorage.setItem(MINE_KEY, JSON.stringify(mine.slice(-10))); localStorage.setItem('gbl_contacto', JSON.stringify({ nombre: name, tel })); } catch {}
    const resumen = `${dateLong(day)} · ${time12(slot)}`;
    const btns = [{ label: 'Listo', value: true, primary: !CFG.whatsapp }];
    if (CFG.whatsapp) btns.push({ label: 'Avisar por WhatsApp', value: true, cls: 'btn-wa', href: waLink(CFG.whatsapp, `Hola! Soy ${name}. Aparté turno en God’s Blessing:\n${resumen}\n${svc.nombre}${INFO.barberos.length > 1 ? ' con ' + assignedBar.nombre : ''}`) });
    BookingUI.close(true);
    await GB.modal(`<h3>Turno apartado</h3><p><b>${esc(svc.nombre)}</b>${INFO.barberos.length > 1 ? ` con <b>${esc(assignedBar.nombre)}</b>` : ''}</p>
      <p style="font-size:18px;margin:8px 0">${esc(resumen)}</p>
      <p class="muted">Llega 5 minutos antes. Si no puedes venir, cancélalo aquí mismo en "Tus próximos turnos".</p>`, btns);
    refreshSlots(); paintMine();
  } catch (err) { fail(err.message); refreshSlots(); BookingUI.step(1); fail(err.message); }
  finally { form.querySelectorAll('fieldset').forEach(f => f.disabled = false); submit.disabled = false; submit.innerHTML = 'Confirmar mi turno <svg><use href="#arrow-up"/></svg>'; }
});

async function paintMine() {
  let mine = []; try { mine = JSON.parse(localStorage.getItem(MINE_KEY) || '[]'); } catch {} const box = document.getElementById('mine');
  if (!mine.length) { box.hidden = true; return; }
  const byTel = {}; mine.forEach((m) => { (byTel[m.tel] = byTel[m.tel] || []).push(m.id); });
  let rows = [];
  try { for (const tel of Object.keys(byTel)) { const r = await rpc('gbl_mis_turnos', { p_ids: byTel[tel], p_tel: tel }); r.forEach((x) => rows.push({ ...x, tel })); } } catch (e) { return; }
  rows = rows.filter((r) => r.estado === 'pendiente' || r.estado === 'confirmado');
  const keep = new Set(rows.map((r) => r.id));
  try { localStorage.setItem(MINE_KEY, JSON.stringify(mine.filter((m) => keep.has(m.id)))); } catch {}
  if (!rows.length) { box.hidden = true; return; }
  box.hidden = false;
  document.getElementById('mineList').innerHTML = rows.map((r) => `<div class="mine-row"><div><b>${esc(dateShort(r.fecha))} · ${time12(r.hora)}</b>
    <span>${esc(r.servicio)}</span></div><button type="button" class="linkbtn" data-id="${r.id}" data-tel="${r.tel}">Cancelar</button></div>`).join('');
  document.querySelectorAll('#mineList .linkbtn').forEach((b) => b.onclick = async () => {
    if (!(await confirmBox('¿Seguro que quieres cancelar este turno?', 'Sí, cancelar', 'No', true))) return;
    try { await rpc('gbl_cancelar', { p_id: b.dataset.id, p_tel: b.dataset.tel }); toast('Turno cancelado'); paintMine(); refreshSlots(); }
    catch (e) { alertBox(esc(e.message)); }
  });
}

init();
