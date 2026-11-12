// ===== La 22 · web de pedidos del cliente =====
(async function () {
  const menu = await cargarMenu();
  const todos = menu.flatMap((c) => c.items.map((i) => ({ ...i, cat: c.cat })));
  const porId = Object.fromEntries(todos.map((i) => [i.id, i]));
  const FAVS = [1, 3, 7, 35, 47, 15, 9, 29];
  const BADGE = { 1: 'Más pedido', 3: 'Crocante', 35: 'Para compartir', 47: 'Familiar', 42: 'Familiar' };
  const UPS = [57, 61, 48, 62];
  const CAT_ID = (c) => 'cat-' + c.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-');

  // ---------- carrito (se guarda en el navegador) ----------
  let carro = [];
  try { carro = JSON.parse(localStorage.getItem('la22_carro') || '[]'); } catch {}
  const guardar = () => { try { localStorage.setItem('la22_carro', JSON.stringify(carro)); } catch {} };
  const precioLinea = (l) => (l.p + (l.gas === 'Coca-Cola' ? 2000 : 0)) * l.q;
  const subtotal = () => carro.reduce((s, l) => s + precioLinea(l), 0);
  const envio = () => (subtotal() >= GRATIS_DESDE || !carro.length ? 0 : ENVIO);

  // ---------- pintar menú ----------
  const tarjeta = (it) => `
    <article class="card" data-id="${it.id}">
      ${BADGE[it.id] ? `<span class="badge">${BADGE[it.id]}</span>` : ''}<span class="q" data-q="${it.id}"></span>
      <div class="card-img"><img src="${foto(it.id)}" alt="${esc(it.n)}" loading="lazy"></div>
      <div class="card-b"><h3>${esc(it.n)}</h3><p>${esc(it.d || '')}</p>
        <div class="card-pie"><b>${pesos(it.p)}</b><span class="mas" aria-hidden="true">+</span></div></div>
    </article>`;
  $('#favs').innerHTML = FAVS.map((id) => tarjeta(porId[id])).join('');
  $('#menu').innerHTML = menu.map((c) => `
    <section class="sec" id="${CAT_ID(c.cat)}"><h2 class="t">${esc(c.cat)} <small>${c.items.length} opciones</small></h2>
      <div class="grid">${c.items.map(tarjeta).join('')}</div></section>`).join('');
  $('#cats').innerHTML = `<a href="#sec-favs" class="on"><img src="${foto(1)}" alt="">Favoritos</a>` +
    menu.map((c) => `<a href="#${CAT_ID(c.cat)}"><img src="${foto(c.items[0].id)}" alt="">${esc(c.cat)}</a>`).join('');

  // categoría activa al hacer scroll
  const secs = $$('.sec');
  const obs = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) {
      $$('#cats a').forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
      const on = $('#cats a.on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }), { rootMargin: '-40% 0px -55% 0px' });
  secs.forEach((s) => obs.observe(s));

  // ---------- slider ----------
  const slides = $$('.slide'); let si = 0, sT;
  $('#dots').innerHTML = slides.map((_, i) => `<button aria-label="Promo ${i + 1}" class="${i ? '' : 'on'}"></button>`).join('');
  const irSlide = (i) => { si = i; slides.forEach((s, k) => s.classList.toggle('on', k === i)); $$('#dots button').forEach((d, k) => d.classList.toggle('on', k === i)); clearInterval(sT); sT = setInterval(() => irSlide((si + 1) % slides.length), 5500); };
  $$('#dots button').forEach((d, i) => d.addEventListener('click', () => irSlide(i)));
  irSlide(0);

  // ---------- modal de producto ----------
  let mIt = null, mQ = 1;
  const abrirModal = (id) => {
    mIt = porId[id]; mQ = 1; if (!mIt) return;
    $('#mImg').src = foto(id); $('#mNom').textContent = mIt.n; $('#mDesc').textContent = mIt.d || 'Preparado al momento.';
    $('#mGas').hidden = !llevaGaseosa(mIt); $('input[name=gas][value="Postobón"]').checked = true; $('#mNota').value = '';
    pintarModal(); $('#velo').classList.add('on'); $('#modal').classList.add('on');
  };
  const cerrarModal = () => { $('#modal').classList.remove('on'); if (!$('#carro').classList.contains('on')) $('#velo').classList.remove('on'); };
  const gasSel = () => (llevaGaseosa(mIt) ? $('input[name=gas]:checked').value : null);
  const pintarModal = () => { $('#mQ').textContent = mQ; $('#mTot').textContent = pesos((mIt.p + (gasSel() === 'Coca-Cola' ? 2000 : 0)) * mQ); };
  document.addEventListener('click', (e) => {
    const c = e.target.closest('.card'); if (c) return abrirModal(+c.dataset.id);
    const a = e.target.closest('[data-abrir]'); if (a) return abrirModal(+a.dataset.abrir);
  });
  $$('input[name=gas]').forEach((r) => r.addEventListener('change', pintarModal));
  $('#mMenos').onclick = () => { mQ = Math.max(1, mQ - 1); pintarModal(); };
  $('#mMas').onclick = () => { mQ = Math.min(20, mQ + 1); pintarModal(); };
  $('#mX').onclick = cerrarModal;
  $('#mAgregar').onclick = () => {
    agregar(mIt.id, mQ, gasSel(), $('#mNota').value.trim());
    cerrarModal(); toast(`Agregado: ${mIt.n}`, 'ok');
  };
  function agregar(id, q = 1, gas = null, nota = '') {
    const it = porId[id];
    const ex = carro.find((l) => l.id === id && l.gas === gas && (l.nota || '') === nota);
    if (ex) ex.q += q; else carro.push({ id, n: it.n, p: it.p, q, gas, nota });
    guardar(); pintarCarro(true);
  }

  // ---------- carrito ----------
  function pintarCarro(animar) {
    const n = carro.reduce((s, l) => s + l.q, 0), sub = subtotal(), env = envio(), tot = sub + env;
    $('#nCarro').textContent = n; $('#nMovil').textContent = n;
    $('#carroItems').innerHTML = carro.length ? carro.map((l, i) => `
      <div class="ci"><img src="${foto(l.id)}" alt="">
        <div><b>${esc(l.n)}</b>${l.gas ? `<small>Gaseosa: ${esc(l.gas)}</small>` : ''}${l.nota ? `<small>“${esc(l.nota)}”</small>` : ''}
          <div class="ci-q"><button data-menos="${i}">−</button><span>${l.q}</span><button data-mas="${i}">+</button></div></div>
        <strong>${pesos(precioLinea(l))}</strong></div>`).join('')
      : `<div class="vacio"><img src="img/logo.png" alt=""><b>Tu pedido está vacío</b><p>Agrega un pollito, que se enfría la tarde.</p></div>`;
    const ups = UPS.filter((id) => !carro.some((l) => l.id === id)).slice(0, 3);
    $('#upsell').innerHTML = carro.length && ups.length ? `<p>¿Le sumas algo?</p><div class="ups">${ups.map((id) => `<button data-ups="${id}"><img src="${foto(id)}" alt=""><span><b>${esc(porId[id].n)}</b>${pesos(porId[id].p)}</span></button>`).join('')}</div>` : '';
    $('#tSub').textContent = pesos(sub); $('#tEnv').textContent = env ? pesos(env) : (carro.length ? 'GRATIS' : '$0'); $('#tTot').textContent = pesos(tot); $('#tBtn').textContent = pesos(tot); $('#tMovil').textContent = pesos(tot);
    const falta = GRATIS_DESDE - sub;
    $('#barGratis').style.width = Math.min(100, (sub / GRATIS_DESDE) * 100) + '%';
    $('#msgGratis').textContent = !carro.length ? '' : falta > 0 ? `Te faltan ${pesos(falta)} para el domicilio gratis` : '¡Tienes domicilio gratis!';
    $('#btnPagar').disabled = !carro.length;
    $('#barraMovil').classList.toggle('on', carro.length > 0);
    $$('.card .q').forEach((q) => { const k = carro.filter((l) => l.id === +q.dataset.q).reduce((s, l) => s + l.q, 0); q.textContent = k; q.classList.toggle('on', k > 0); });
    if (animar) { const b = $('#btnCarro'); b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }], { duration: 350 }); }
  }
  $('#carroItems').addEventListener('click', (e) => {
    const m = e.target.closest('[data-menos]'), p = e.target.closest('[data-mas]');
    if (m) { const l = carro[+m.dataset.menos]; l.q--; if (l.q <= 0) carro.splice(+m.dataset.menos, 1); }
    else if (p) carro[+p.dataset.mas].q++;
    else return;
    guardar(); pintarCarro();
  });
  $('#upsell').addEventListener('click', (e) => { const u = e.target.closest('[data-ups]'); if (u) { agregar(+u.dataset.ups); toast('Agregado', 'ok'); } });
  const abrirCarro = () => { $('#carro').classList.add('on'); $('#velo').classList.add('on'); };
  const cerrarCarro = () => { $('#carro').classList.remove('on'); $('#velo').classList.remove('on'); };
  $('#btnCarro').onclick = () => (matchMedia('(max-width:1000px)').matches ? abrirCarro() : $('#carro').scrollIntoView({ behavior: 'smooth' }));
  $('#barraMovil').onclick = abrirCarro;
  $('#cerrarCarro').onclick = cerrarCarro;
  $('#velo').onclick = () => { cerrarModal(); cerrarCarro(); };
  pintarCarro();

  // ---------- pedido en curso ----------
  let ultimo = null;
  try { ultimo = JSON.parse(localStorage.getItem('la22_ultimo') || 'null'); } catch {}
  if (ultimo && Date.now() - ultimo.ts < 3 * 3600e3) { const b = $('#btnSeguir'); b.href = `seguir.html?c=${ultimo.c}&t=${ultimo.t}`; b.classList.add('on'); }

  // ---------- checkout ----------
  let mapa = null, pin = null, pago = 'efectivo';
  let datos = {};
  try { datos = JSON.parse(localStorage.getItem('la22_datos') || '{}'); } catch {}
  const punto = datos.lat ? { lat: datos.lat, lng: datos.lng } : { lat: TIENDA.lat + 0.006, lng: TIENDA.lng + 0.004 };
  if (datos.dir) $('#dirTxt').textContent = datos.dir;

  function abrirChk() {
    cerrarCarro();
    $('#chk').classList.add('on'); $('#chk').setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    $('#fDir').value = datos.dir || ''; $('#fRef').value = datos.ref || ''; $('#fNom').value = datos.nom || ''; $('#fTel').value = datos.tel || '';
    const sub = subtotal(), env = envio();
    $('#chkItems').innerHTML = carro.map((l) => `<div class="ci"><img src="${foto(l.id)}" alt=""><div><b>${l.q} × ${esc(l.n)}</b>${l.gas ? `<small>${esc(l.gas)}</small>` : ''}</div><strong>${pesos(precioLinea(l))}</strong></div>`).join('');
    $('#cSub').textContent = pesos(sub); $('#cEnv').textContent = env ? pesos(env) : 'GRATIS'; $('#cTot').textContent = pesos(sub + env); $('#cBtn').textContent = pesos(sub + env);
    setTimeout(() => {
      if (!mapa) {
        mapa = L.map('mapaChk', { zoomControl: false, attributionControl: false }).setView([punto.lat, punto.lng], 16);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(mapa);
        L.marker([TIENDA.lat, TIENDA.lng], { icon: iconoPin('tienda', '') }).addTo(mapa);
        pin = L.marker([punto.lat, punto.lng], { draggable: true, icon: iconoPin('casa', '⌂') }).addTo(mapa);
        mapa.on('click', (e) => pin.setLatLng(e.latlng));
      }
      mapa.invalidateSize();
    }, 460);
  }
  const cerrarChk = () => { $('#chk').classList.remove('on'); $('#chk').setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  $('#btnPagar').onclick = abrirChk;
  $('#chkVolver').onclick = cerrarChk;
  $('#dirChip').onclick = () => (carro.length ? abrirChk() : toast('Primero agrega algo a tu pedido'));
  $('#miUbic').onclick = () => {
    if (!navigator.geolocation) return toast('Tu navegador no comparte ubicación', 'err');
    navigator.geolocation.getCurrentPosition((p) => { const ll = [p.coords.latitude, p.coords.longitude]; pin.setLatLng(ll); mapa.setView(ll, 17); toast('Ubicación encontrada', 'ok'); },
      () => toast('No pudimos obtener tu ubicación. Mueve el pin en el mapa.', 'err'), { enableHighAccuracy: true, timeout: 8000 });
  };
  $$('.pago').forEach((b) => b.addEventListener('click', () => { pago = b.dataset.pago; $$('.pago').forEach((x) => x.classList.toggle('on', x === b)); $('#campoCambio').hidden = pago !== 'efectivo'; }));

  $('#btnConfirmar').onclick = async () => {
    const dir = $('#fDir').value.trim(), nom = $('#fNom').value.trim(), tel = $('#fTel').value.trim();
    if (!dir) { $('#fDir').focus(); return toast('Escribe tu dirección', 'err'); }
    if (!nom) { $('#fNom').focus(); return toast('Escribe tu nombre', 'err'); }
    if (tel.replace(/\D/g, '').length < 7) { $('#fTel').focus(); return toast('Escribe un celular válido', 'err'); }
    const ll = pin.getLatLng();
    const btn = $('#btnConfirmar'); btn.disabled = true; btn.firstElementChild.textContent = 'Enviando…';
    try {
      const cambio = $('#fCambio').value.replace(/\D/g, '');
      const items = carro.map((l) => ({ id: l.id, n: l.n + (l.gas === 'Coca-Cola' ? ' (Coca-Cola)' : ''), p: l.p + (l.gas === 'Coca-Cola' ? 2000 : 0), q: l.q, nota: l.nota || undefined }));
      const r = await rpc('dom22_pedir', { p: { canal: 'web', cliente: nom, tel, direccion: dir, referencia: $('#fRef').value.trim(), lat: ll.lat, lng: ll.lng, items, pago, nota: pago === 'efectivo' && cambio ? `Paga con $${(+cambio).toLocaleString('es-CO')}` : null } });
      datos = { dir, ref: $('#fRef').value.trim(), nom, tel, lat: ll.lat, lng: ll.lng };
      try { localStorage.setItem('la22_datos', JSON.stringify(datos)); localStorage.setItem('la22_ultimo', JSON.stringify({ c: r.codigo, t: r.token, ts: Date.now() })); localStorage.removeItem('la22_carro'); } catch {}
      location.href = `seguir.html?c=${r.codigo}&t=${r.token}&nuevo=1`;
    } catch (e) {
      toast('No se pudo enviar: ' + e.message, 'err'); btn.disabled = false; btn.firstElementChild.textContent = 'Confirmar pedido';
    }
  };
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { cerrarModal(); cerrarCarro(); } });
})();
