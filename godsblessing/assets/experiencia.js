/* Motion, media and an accessible native reservation dialog. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const intro = document.getElementById('intro');
  const skipIntro = document.getElementById('skipIntro');
  let introDone = false;
  function finishIntro(immediate = false) {
    if (introDone) return;
    introDone = true;
    if (immediate) intro.remove();
    else { intro.classList.add('exit'); setTimeout(() => intro.remove(), 750); }
    document.body.classList.add('entered');
  }
  let seen = false;
  try { seen = sessionStorage.getItem('gbl_intro_v3') === '1'; sessionStorage.setItem('gbl_intro_v3', '1'); } catch {}
  if (seen || reduced || location.hash === '#agenda') finishIntro(true);
  else setTimeout(() => finishIntro(), 2450);
  skipIntro.onclick = () => finishIntro();
  // Never leave the page hidden when JS is interrupted or the tab returns from cache.
  addEventListener('pageshow', e => { if (e.persisted) finishIntro(true); });

  const video = document.getElementById('heroVideo');
  const toggle = document.getElementById('videoToggle');
  const lowData = navigator.connection?.saveData;
  let userPaused = false;
  function videoLabel() {
    toggle.innerHTML = video.paused ? 'Reproducir video <span aria-hidden="true">▶</span>' : 'Pausar video <span aria-hidden="true">Ⅱ</span>';
    toggle.setAttribute('aria-label', video.paused ? 'Reproducir video' : 'Pausar video');
  }
  function loadVideo() {
    if (!video.getAttribute('src')) {
      video.src = matchMedia('(max-width:600px)').matches ? 'assets/media/banner-mobile-v3.mp4' : 'assets/media/banner-desktop-v3.mp4';
      video.load();
    }
    return video.play().catch(() => videoLabel());
  }
  video.addEventListener('playing', () => { document.body.classList.add('video-ready'); videoLabel(); });
  video.addEventListener('pause', videoLabel);
  video.addEventListener('error', () => { document.body.classList.remove('video-ready'); toggle.hidden = true; });
  toggle.onclick = () => { userPaused = !video.paused; if (video.paused) loadVideo(); else video.pause(); };
  if (!reduced && !lowData) loadVideo();
  const mediaObserver = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) video.pause();
    else if (!reduced && !lowData && !userPaused) loadVideo();
  }, {threshold:.05});
  mediaObserver.observe(document.querySelector('.hero'));
  document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });

  if (!reduced) {
    document.documentElement.classList.add('motion');
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); reveal.unobserve(entry.target); }
    }), {threshold:.12});
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
  }
  const dock = document.querySelector('.mobile-dock');
  new IntersectionObserver(([entry]) => dock.classList.toggle('visible', !entry.isIntersecting), {threshold:.15}).observe(document.querySelector('.hero'));

  const dialog = document.getElementById('bookingDialog');
  const next = document.getElementById('bookingNext');
  const back = document.getElementById('bookingBack');
  const submit = document.getElementById('submit');
  let current = 0, returnFocus = null, previousHash = '';
  const titles = ['¿QUÉ TE HACEMOS?', 'ELIGE TU MOMENTO.', 'YA CASI. TU SILLA TE ESPERA.'];
  const descriptions = ['Elige tu servicio y con quién quieres atenderte.', 'Estas son las horas libres para tu servicio.', 'Déjanos tu nombre y WhatsApp para confirmar.'];
  function sync() {
    next.disabled = current === 0 ? typeof svc === 'undefined' || !svc : !slot || !assignedBar;
  }
  function step(value) {
    current = Math.max(0, Math.min(2,value));
    document.querySelectorAll('.book-step').forEach(el => el.hidden = Number(el.dataset.step) !== current);
    document.querySelectorAll('[data-step-indicator]').forEach(el => {
      const n = Number(el.dataset.stepIndicator);
      el.classList.toggle('active',n === current); el.classList.toggle('complete',n < current);
      if (n === current) el.setAttribute('aria-current','step'); else el.removeAttribute('aria-current');
    });
    document.getElementById('stepLabel').textContent = `PASO 0${current+1} DE 03`;
    const title = document.getElementById('bookingTitle'); title.textContent = titles[current];
    document.getElementById('stepDescription').textContent = descriptions[current];
    next.hidden = current === 2; submit.hidden = current !== 2; back.hidden = current === 0;
    next.innerHTML = `${current === 0 ? 'Elegir día y hora' : 'Continuar con mis datos'} <svg><use href="#arrow"/></svg>`;
    document.getElementById('msg').textContent = '';
    sync();
    dialog.scrollTop = 0;
    if (dialog.open) { title.tabIndex = -1; title.focus({preventScroll:true}); }
  }
  function open(value = 0) {
    finishIntro(true);
    if (!dialog.open) {
      returnFocus = document.activeElement; previousHash = location.hash;
      dialog.showModal();
      history.replaceState(null,'',location.pathname+location.search+'#agenda');
    }
    step(value);
  }
  function close(force = false) {
    if (submit.disabled && !force) return;
    dialog.close();
    if (location.hash === '#agenda') history.replaceState(null,'',location.pathname+location.search+(previousHash === '#agenda' ? '' : previousHash));
    if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
  }
  next.onclick = () => { if (!next.disabled) step(current+1); };
  back.onclick = () => step(current-1);
  document.getElementById('closeBooking').onclick = () => close();
  dialog.addEventListener('cancel',e => { e.preventDefault(); close(); });
  dialog.addEventListener('click',e => { if (e.target === dialog && e.clientX !== 0) {
    const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) close();
  }});
  document.querySelectorAll('[data-book]').forEach(a => a.addEventListener('click',e => { e.preventDefault(); open(); }));
  document.addEventListener('keydown',e => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
    const group=e.target.closest('[role=radiogroup]'); if(!group)return;
    const options=[...group.querySelectorAll('button:not(:disabled)')], index=options.indexOf(e.target); if(index<0)return;
    e.preventDefault(); const delta=['ArrowRight','ArrowDown'].includes(e.key)?1:-1, option=options[(index+delta+options.length)%options.length]; option.focus(); option.click();
  });
  window.BookingUI = {open,close,step,sync,get current(){return current}};
  addEventListener('hashchange',() => { if(location.hash==='#agenda')open(); });
})();
