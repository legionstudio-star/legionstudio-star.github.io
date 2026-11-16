/* Profile UI. Persistence and authorization belong to the authenticated gb_perfil_* RPCs. */
window.GhettoProfile = {
  async render(ctx, { onboarding = false, barberId = null } = {}) {
    const { view, call, esc, toast, refresh } = ctx;
    const host = view();
    host.innerHTML = '<div class="empty"><span class="spin"></span></div>';
    let data;
    try { data = await call('gb_perfil_obtener', { p_barbero: barberId }); }
    catch (e) { host.innerHTML = `<div class="card"><h2>No se pudo cargar el perfil</h2><p role="alert">${esc(e.message)}</p><button class="btn btn-cream" id="retryProfile">Reintentar</button></div>`; host.querySelector('button').onclick = () => this.render(ctx, { onboarding, barberId }); return; }
    const p = data.perfil;
    let photos = [...(p.portafolio || [])], holidays = [...(p.vacaciones || [])], dates = [...(p.fechas_confirmacion || [])];
    let uploading = false;
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const config = data.config || {};
    const services = p.servicios || [];
    host.innerHTML = `<form id="profileForm" class="profile-form">
      <h2 class="sec">${onboarding ? 'Bienvenido a Ghetto' : 'Mi perfil'}</h2>
      <p class="muted">${onboarding ? 'Completa tu perfil y crea tu PIN personal para empezar.' : 'Tus trabajos, servicios y disponibilidad para tus clientes.'}</p>
      <fieldset class="card"><legend>Tu presentación</legend>
        <div class="field"><label for="pfName">Nombre</label><input id="pfName" maxlength="40" required value="${esc(p.nombre)}"></div>
        <div class="field"><label for="pfBio">Especialidad y presentación</label><textarea id="pfBio" maxlength="500" rows="3" required>${esc(p.biografia || p.especialidad || '')}</textarea></div>
        <div class="field"><label for="pfInstagram">Instagram</label><input id="pfInstagram" maxlength="40" value="${esc(p.instagram || '')}" placeholder="Usuario sin @"></div>
        <div class="field"><label for="pfAvatar">Foto de perfil</label><input id="pfAvatar" type="file" accept="image/jpeg,image/png,image/webp"><div id="avatarPreview"></div></div>
      </fieldset>
      <fieldset class="card"><legend>Catálogo de servicios</legend>
        <p class="note">El precio y la duración que indiques aquí se usan al reservar contigo.</p>
        <div id="pfServices">${services.map((s, i) => `<div class="profile-service" data-service="${esc(s.id)}">
          <b>${esc(s.nombre)}</b><label class="profile-inline"><input type="checkbox" data-enabled ${s.activo !== false ? 'checked' : ''}> Ofrecer este servicio</label>
          <div class="grid2"><div class="field"><label for="pfPrice${i}">Precio (COP)</label><input id="pfPrice${i}" data-price type="number" min="0" max="10000000" step="1000" value="${s.precio == null ? '' : Number(s.precio)}" placeholder="Vacío: se cotiza"></div>
          <div class="field"><label for="pfDuration${i}">Duración (minutos)</label><input id="pfDuration${i}" data-duration type="number" min="10" max="240" step="5" required value="${Number(s.duracion || 40)}"></div></div></div>`).join('')}</div>
        ${services.length ? '' : '<p class="note">Santi debe crear los servicios del negocio en Ajustes para poder configurar tu catálogo.</p>'}
      </fieldset>
      <fieldset class="card"><legend>Tu portafolio de cortes</legend><p class="note">Se muestra cuando el cliente te elige. Sube hasta 12 fotos de tus trabajos.</p>
        <div id="pfPhotos" class="profile-photos"></div>
        <div class="field"><label for="pfUpload">Agregar fotos</label><input id="pfUpload" type="file" multiple accept="image/jpeg,image/png,image/webp"></div>
        <p id="pfUploadMsg" role="status" class="note"></p>
      </fieldset>
      <fieldset class="card"><legend>Horario y descansos</legend><p class="note">Puedes agregar varios turnos por día. Los descansos quedan fuera de las horas disponibles.</p>
        ${days.map((name, day) => {
          const intervals = p.horario_semanal?.[day] || [];
          const rest = (p.descansos || []).filter((r) => Number(r.dia) === day && !r.fecha);
          return `<div class="profile-day" data-day="${day}"><h3>${name}</h3><div class="profile-ranges">${intervals.map((r) => rangeRow('work', r)).join('')}</div><button type="button" class="btn btn-ghost btn-sm" data-add-work>+ Horario</button><div class="profile-breaks">${rest.map((r) => rangeRow('break', r)).join('')}</div><button type="button" class="btn btn-ghost btn-sm" data-add-break>+ Descanso</button></div>`;
        }).join('')}
      </fieldset>
      <fieldset class="card"><legend>Vacaciones y días libres</legend><div id="pfHolidays"></div>
        <div class="grid2"><div class="field"><label for="pfFrom">Desde</label><input id="pfFrom" type="date"></div><div class="field"><label for="pfTo">Hasta (incluido)</label><input id="pfTo" type="date"></div></div>
        <button type="button" class="btn btn-ghost btn-sm" id="pfAddHoliday">Agregar vacaciones</button>
      </fieldset>
      <fieldset class="card"><legend>Fechas de alta demanda</legend><p class="note">Solo estas fechas requieren tu confirmación. Las demás reservas se confirman al agendar.</p><div id="pfDates"></div>
        <div class="field"><label for="pfDate">Fecha que requiere confirmación</label><input id="pfDate" type="date"></div>
        <button type="button" class="btn btn-ghost btn-sm" id="pfAddDate">Agregar fecha</button>
      </fieldset>
      ${data.es_dueno ? `<fieldset class="card"><legend>Datos del negocio</legend>
        <div class="field"><label for="pfBusinessTel">WhatsApp de Ghetto</label><input id="pfBusinessTel" type="tel" inputmode="numeric" value="${esc(config.whatsapp || '')}" maxlength="16" required></div>
        <div class="field"><label for="pfAddress">Dirección</label><input id="pfAddress" value="${esc(config.direccion || 'Calle 86 #95d-06') }" maxlength="120" required></div>
        <div class="field"><label for="pfMaps">Enlace de ubicación de Google Maps</label><input id="pfMaps" type="url" value="${esc(config.mapa || '')}"></div>
        <div class="field"><label for="pfBusinessHours">Horario para mostrar en la página</label><input id="pfBusinessHours" value="${esc(config.horario_texto || '')}" maxlength="100" required placeholder="Días de atención y horario"></div>
      </fieldset>` : ''}
      <fieldset class="card"><legend>${onboarding ? 'Crea tu PIN personal' : 'Cambiar PIN'}</legend><p class="note">Usa de 4 a 6 números. ${onboarding ? 'El PIN inicial deja de servir cuando termines.' : 'Déjalo vacío para conservar tu PIN.'}</p>
        ${onboarding ? '' : '<div class="field"><label for="pfCurrentPin">PIN actual</label><input id="pfCurrentPin" type="password" inputmode="numeric" autocomplete="current-password" minlength="3" maxlength="6" pattern="[0-9]{3,6}"></div>'}
        <div class="grid2"><div class="field"><label for="pfPin">Nuevo PIN</label><input id="pfPin" type="password" inputmode="numeric" autocomplete="new-password" minlength="4" maxlength="6" pattern="[0-9]{4,6}" ${onboarding ? 'required' : ''}></div>
        <div class="field"><label for="pfPinAgain">Repite tu PIN</label><input id="pfPinAgain" type="password" inputmode="numeric" autocomplete="new-password" minlength="4" maxlength="6" pattern="[0-9]{4,6}" ${onboarding ? 'required' : ''}></div></div>
      </fieldset>
      <p id="pfError" class="msg" role="alert"></p><button id="pfSave" class="btn btn-cream" type="submit">${onboarding ? 'Guardar y empezar' : 'Guardar mi perfil'}</button>
    </form>`;
    let avatar = p.foto || '';
    const get = (id) => document.getElementById(id);
    const error = (message) => { get('pfError').textContent = message; };
    function rangeRow(kind, r = {}) { return `<div class="profile-range" data-range="${kind}"><label>${kind === 'work' ? 'Atención desde' : 'Descanso desde'}<input type="time" data-start required value="${esc(r.inicio || '')}"></label><label>Hasta<input type="time" data-end required value="${esc(r.fin || '')}"></label><button type="button" class="btn btn-ghost btn-sm" data-delete-range aria-label="Quitar intervalo">Quitar</button></div>`; }
    function paintPhotos() {
      get('pfPhotos').innerHTML = photos.map((photo, i) => `<div><img src="${esc(GhettoBooking.safeImage(photo.url))}" alt="${esc(photo.titulo || 'Corte del portafolio')}" loading="lazy"><label>Nombre del corte<input data-photo-title="${i}" value="${esc(photo.titulo || '')}" maxlength="60"></label><button type="button" data-delete-photo="${i}" class="btn btn-ghost btn-sm">Quitar foto</button></div>`).join('');
      get('avatarPreview').innerHTML = GhettoBooking.safeImage(avatar) ? `<img class="profile-avatar" src="${esc(avatar)}" alt="Tu foto de perfil">` : '';
    }
    function paintHolidays() { get('pfHolidays').innerHTML = holidays.map((v, i) => `<div class="list-item"><span>${esc(v.desde)} a ${esc(v.hasta)}</span><button type="button" data-delete-holiday="${i}" class="btn btn-ghost btn-sm">Quitar</button></div>`).join(''); }
    function paintDates() { get('pfDates').innerHTML = dates.map((d, i) => `<div class="list-item"><span>${esc(d)}</span><button type="button" data-delete-date="${i}" class="btn btn-ghost btn-sm">Quitar</button></div>`).join(''); }
    paintPhotos(); paintHolidays(); paintDates();
    host.onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      const day = b.closest('[data-day]');
      if (b.hasAttribute('data-add-work')) day.querySelector('.profile-ranges').insertAdjacentHTML('beforeend', rangeRow('work'));
      if (b.hasAttribute('data-add-break')) day.querySelector('.profile-breaks').insertAdjacentHTML('beforeend', rangeRow('break'));
      if (b.hasAttribute('data-delete-range')) b.closest('[data-range]').remove();
      if (b.hasAttribute('data-delete-photo')) { photos.splice(Number(b.dataset.deletePhoto), 1); paintPhotos(); }
      if (b.hasAttribute('data-delete-holiday')) { holidays.splice(Number(b.dataset.deleteHoliday), 1); paintHolidays(); }
      if (b.hasAttribute('data-delete-date')) { dates.splice(Number(b.dataset.deleteDate), 1); paintDates(); }
    };
    get('pfPhotos').oninput = (e) => { if (e.target.dataset.photoTitle != null) photos[Number(e.target.dataset.photoTitle)].titulo = e.target.value; };
    get('pfAddHoliday').onclick = () => {
      const desde = get('pfFrom').value, hasta = get('pfTo').value;
      if (!desde || !hasta || hasta < desde) return error('Elige el inicio y el final de tus vacaciones.');
      holidays.push({ desde, hasta }); paintHolidays(); error('');
    };
    get('pfAddDate').onclick = () => {
      const value = get('pfDate').value;
      if (!value) return error('Elige una fecha.');
      dates = [...new Set([...dates, value])].sort(); paintDates(); error('');
    };
    async function upload(input, isAvatar) {
      const files = [...input.files];
      if (!files.length || uploading) return;
      if (!isAvatar && photos.length + files.length > 12) { error('Tu portafolio admite hasta 12 fotos.'); input.value = ''; return; }
      if (files.some((f) => !['image/jpeg', 'image/png', 'image/webp'].includes(f.type) || f.size > 4 * 1024 * 1024)) { error('Usa fotos JPG, PNG o WebP de hasta 4 MB cada una.'); input.value = ''; return; }
      uploading = true; get('pfSave').disabled = true; get('pfUploadMsg').textContent = 'Subiendo fotos…';
      try {
        for (const file of files) {
          const base64 = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(',')[1]); reader.onerror = reject; reader.readAsDataURL(file); });
          const result = await call('gb_perfil_subir_foto', { p_barbero: p.id, p_tipo: isAvatar ? 'perfil' : 'corte', p_mime: file.type, p_archivo: base64 });
          if (!GhettoBooking.safeImage(result.url)) throw new Error('No se recibió una dirección válida para la foto.');
          if (isAvatar) avatar = result.url; else photos.push({ id: result.id, url: result.url, titulo: '' });
        }
        paintPhotos(); get('pfUploadMsg').textContent = 'Fotos cargadas. Guarda el perfil para publicarlas.';
      } catch (e) { error(e.message); paintPhotos(); get('pfUploadMsg').textContent = ''; }
      finally { uploading = false; get('pfSave').disabled = false; input.value = ''; }
    }
    get('pfUpload').onchange = (e) => upload(e.target, false);
    get('pfAvatar').onchange = (e) => upload(e.target, true);
    get('profileForm').onsubmit = async (e) => {
      e.preventDefault(); if (uploading || get('pfSave').disabled) return;
      error('');
      const pin = get('pfPin').value;
      if (pin !== get('pfPinAgain').value) return error('Los PIN no coinciden.');
      if (onboarding && !/^[0-9]{4,6}$/.test(pin) || pin && !/^[0-9]{4,6}$/.test(pin)) return error('Tu nuevo PIN debe tener de 4 a 6 números.');
      if (pin && !onboarding && !get('pfCurrentPin').value) return error('Escribe tu PIN actual para cambiarlo.');
      const weekly = {}, rests = [];
      let invalid = '';
      host.querySelectorAll('[data-day]').forEach((row) => {
        const day = row.dataset.day;
        weekly[day] = [];
        row.querySelectorAll('[data-range]').forEach((r) => {
          const inicio = r.querySelector('[data-start]').value, fin = r.querySelector('[data-end]').value;
          if (!inicio || !fin || fin <= inicio) invalid = 'Cada horario y descanso debe terminar después de empezar.';
          if (r.dataset.range === 'work') weekly[day].push({ inicio, fin }); else rests.push({ dia: Number(day), inicio, fin });
        });
        weekly[day].sort((a, b) => a.inicio.localeCompare(b.inicio));
        if (weekly[day].some((r, i, rows) => i && rows[i - 1].fin > r.inicio)) invalid = 'Hay horarios de atención que se cruzan.';
      });
      if (invalid) return error(invalid);
      if (onboarding && !Object.values(weekly).some((v) => v.length)) return error('Agrega al menos un horario de atención.');
      const ownServices = [...host.querySelectorAll('[data-service]')].map((r) => ({ id: r.dataset.service, activo: r.querySelector('[data-enabled]').checked, precio: r.querySelector('[data-price]').value === '' ? null : Number(r.querySelector('[data-price]').value), duracion: Number(r.querySelector('[data-duration]').value) }));
      if (onboarding && !ownServices.some((s) => s.activo)) return error('Activa al menos un servicio.');
      if (onboarding && (!photos.length || !GhettoBooking.safeImage(avatar))) return error('Agrega tu foto de perfil y al menos un corte para mostrar.');
      const payload = { nombre: get('pfName').value.trim(), biografia: get('pfBio').value.trim(), instagram: get('pfInstagram').value.trim().replace(/^@/, ''), foto: avatar, portafolio: photos, servicios: ownServices, horario_semanal: weekly, descansos: rests, vacaciones: holidays, fechas_confirmacion: dates };
      if (data.es_dueno) payload.negocio = { whatsapp: get('pfBusinessTel').value.replace(/\D/g, ''), direccion: get('pfAddress').value.trim(), mapa: get('pfMaps').value.trim(), horario_texto: get('pfBusinessHours').value.trim() };
      get('pfSave').disabled = true;
      try {
        await call('gb_perfil_guardar', { p_barbero: p.id, p_perfil: payload, p_pin_actual: get('pfCurrentPin')?.value || null, p_pin_nuevo: pin || null, p_finalizar_inicio: onboarding });
        toast('Perfil guardado'); await refresh();
      } catch (e) { error(e.message); get('pfSave').disabled = false; }
    };
  }
};
