/* LEGION Studio v2 — animaciones */
(function () {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fino = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const hayGsap = typeof window.gsap !== 'undefined';

  // Sin GSAP: mostrar todo y salir
  if (!hayGsap) {
    document.documentElement.classList.remove('js');
    const i = $('#intro'); if (i) i.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis (scroll suave) ---------- */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href'); const el = id.length > 1 && $(id);
    if (!el) return; e.preventDefault();
    document.body.classList.remove('menu-abierto');
    lenis ? lenis.scrollTo(el, { offset: 0, duration: 1.4 }) : el.scrollIntoView({ behavior: 'smooth' });
  }));

  /* ---------- Brasas (canvas del intro) ---------- */
  function brasas(canvas) {
    const ctx = canvas.getContext('2d'); let w, h, dpr = Math.min(devicePixelRatio || 1, 2), vivo = true;
    const P = [];
    const tam = () => { w = canvas.clientWidth; h = canvas.clientHeight; canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    tam(); addEventListener('resize', tam);
    const n = w < 700 ? 45 : 90;
    for (let i = 0; i < n; i++) P.push({ x: Math.random() * w, y: h + Math.random() * h, r: Math.random() * 1.8 + .4, v: Math.random() * .9 + .3, o: Math.random() * Math.PI * 2, c: Math.random() < .7 ? '255,170,80' : '255,60,60' });
    (function loop() {
      if (!vivo) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of P) {
        p.y -= p.v; p.o += .03; p.x += Math.sin(p.o) * .4;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        const a = Math.min(1, (h - p.y) / h + .2) * (.5 + Math.sin(p.o * 2) * .3);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fillStyle = `rgba(${p.c},${a})`;
        ctx.shadowBlur = 12; ctx.shadowColor = `rgba(${p.c},1)`; ctx.fill();
      }
      requestAnimationFrame(loop);
    })();
    return () => { vivo = false; };
  }

  /* ---------- INTRO del logo ---------- */
  const intro = $('#intro');
  const visto = (() => { try { return sessionStorage.getItem('lg_intro') === '1'; } catch (e) { return false; } })();
  const heroTL = gsap.timeline({ paused: true })
    .to('.hv', { scale: 1, duration: 2.2, ease: 'expo.out' }, 0)
    .to('.hero-tit .ln>span', { y: 0, duration: 1.3, stagger: .12, ease: 'expo.out' }, .1)
    .to('.hero-top,.hero-pie', { opacity: 1, duration: 1, stagger: .1 }, .6)
    .from('.nav', { opacity: 0, duration: 1.2, ease: 'power2.out' }, .4);

  function arrancar() {
    try { sessionStorage.setItem('lg_intro', '1'); } catch (e) {}
    if (lenis) lenis.start();
    heroTL.play();
  }

  if (!intro || reduce) { if (intro) intro.remove(); gsap.set('.hero-tit .ln>span', { y: 0 }); gsap.set('.hero-top,.hero-pie', { opacity: 1 }); if (lenis) lenis.start(); }
  else {
    const parar = brasas($('#brasas'));
    const num = { v: 0 }; const numEl = $('.in-num');
    const rapido = visto ? .45 : 1;
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: () => { parar(); intro.remove(); } });
    tl.timeScale(1 / rapido);
    tl.to(num, { v: 100, duration: 2.6, ease: 'power2.inOut', onUpdate: () => { numEl.textContent = String(Math.round(num.v)).padStart(3, '0'); } }, 0)
      .to('.in-casco img', { opacity: 1, scale: 1, duration: 2.4, ease: 'power3.out' }, .1)
      .to('.in-casco img', { filter: 'brightness(1.15) contrast(1.15)', duration: 1.8, ease: 'power2.inOut' }, .3)
      .to('.in-marco path', { strokeDashoffset: 0, duration: 1.2, stagger: .06, ease: 'power3.inOut' }, .5)
      .to('.in-barrido', { x: '120%', duration: 1.4, ease: 'power2.inOut' }, 1.2)
      .to('.in-legion span', { y: 0, duration: 1.1, stagger: .07 }, 1.25)
      .to('.in-legion span', { backgroundPosition: '-150% 0', duration: 2, ease: 'power2.inOut' }, 1.6)
      .to('.in-studio', { opacity: 1, duration: .8 }, 1.9)
      // salida: el logo sube y la cortina se abre
      .to('.in-centro', { scale: .82, opacity: 0, duration: .9, ease: 'power3.in' }, 3.1)
      .to('.in-marca', { y: -60, opacity: 0, duration: .8, ease: 'power3.in' }, 3.15)
      .to('.in-pie', { opacity: 0, duration: .4 }, 3.1)
      .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 1.1, ease: 'expo.inOut' }, 3.6)
      .add(arrancar, 3.95);
    intro.addEventListener('click', () => tl.progress() < .85 && tl.seek(3.55));
  }

  /* ---------- Nav: oculta al bajar, aparece al subir ---------- */
  let ultimo = 0;
  ScrollTrigger.create({
    start: 0, end: 'max', onUpdate: (s) => {
      const y = s.scroll(); const nav = $('.nav');
      nav.classList.toggle('solida', y > 80);
      nav.classList.toggle('oculta', y > ultimo && y > 400 && !document.body.classList.contains('menu-abierto'));
      ultimo = y;
    }
  });
  $('.nav-menu').addEventListener('click', () => document.body.classList.toggle('menu-abierto'));

  /* ---------- Hero: el video se encoge en tarjeta al hacer scroll ---------- */
  if (!reduce) {
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
      .fromTo('.hero-video', { clipPath: 'inset(0% 0% 0% 0% round 0px)' }, { clipPath: 'inset(10% 5% 10% 5% round 32px)', ease: 'none' }, 0)
      .to('.hero-tit', { yPercent: -40, opacity: 0, ease: 'none' }, 0)
      .to('.hero-pie,.hero-top', { opacity: 0, ease: 'none' }, 0);
  }

  /* ---------- Manifiesto: palabras que se encienden ---------- */
  const mf = $('[data-palabras]');
  if (mf) {
    const nodos = [...mf.childNodes]; mf.innerHTML = '';
    nodos.forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) mf.appendChild(document.createTextNode(' '));
          else { const s = document.createElement('span'); s.className = 'w'; s.textContent = p; mf.appendChild(s); }
        });
      } else if (n.nodeType === 1) {
        if (n.tagName === 'EM') { n.classList.add('w'); }
        mf.appendChild(n);
      }
    });
    gsap.to('.mf-txt .w', { opacity: 1, stagger: .05, ease: 'none', scrollTrigger: { trigger: mf, start: 'top 80%', end: 'bottom 45%', scrub: true } });
    $$('.pill', mf).forEach((p) => gsap.to(p, { scale: 1, duration: 1, ease: 'elastic.out(1,.6)', scrollTrigger: { trigger: p, start: 'top 75%' } }));
  }

  /* ---------- Cifras ---------- */
  $$('.cf b[data-n]').forEach((b) => {
    const o = { v: 0 }, fin = +b.dataset.n;
    gsap.to(o, { v: fin, duration: 2, ease: 'power3.out', scrollTrigger: { trigger: b, start: 'top 85%' }, onUpdate: () => { b.textContent = Math.round(o.v); } });
  });

  /* ---------- Títulos grandes: entrada ---------- */
  $$('.tit-xl').forEach((t) => gsap.from(t, { yPercent: 30, opacity: 0, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 85%' } }));

  /* ---------- Trabajo: scroll horizontal (escritorio) ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 901px)', () => {
    const pista = $('.tb-pista');
    const dist = () => pista.scrollWidth - innerWidth;
    const st = gsap.to(pista, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: '.trabajo', start: 'top top', end: () => '+=' + dist(), scrub: 1, pin: true, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    gsap.to('.tb-barra i', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.trabajo', start: 'top top', end: () => '+=' + dist(), scrub: true } });
    // parallax interno de cada proyecto
    $$('.py').forEach((py) => {
      gsap.fromTo($('.lap', py), { xPercent: 12 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: py, containerAnimation: st, start: 'left right', end: 'right left', scrub: true } });
    });
    return () => {};
  });
  mm.add('(max-width: 900px)', () => {
    $$('.py').forEach((py) => gsap.from(py, { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: py, start: 'top 88%' } }));
  });

  /* ---------- Servicios: imagen flotante que sigue el cursor ---------- */
  const flota = $('.sv-flota'), fimg = flota && $('img', flota);
  if (flota && fino) {
    const qx = gsap.quickTo(flota, 'x', { duration: .6, ease: 'power3' }), qy = gsap.quickTo(flota, 'y', { duration: .6, ease: 'power3' });
    $$('.sv').forEach((sv) => {
      sv.addEventListener('mouseenter', () => { fimg.src = sv.dataset.img; gsap.to(flota, { opacity: 1, scale: 1, rotate: gsap.utils.random(-6, 6), duration: .5, ease: 'expo.out' }); });
      sv.addEventListener('mouseleave', () => gsap.to(flota, { opacity: 0, scale: .6, duration: .4 }));
      sv.addEventListener('mousemove', (e) => { qx(e.clientX + 30); qy(e.clientY - 120); });
    });
  }
  $$('.sv').forEach((sv, i) => gsap.from(sv, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: sv, start: 'top 92%' } }));

  /* ---------- Anuncios: reproducir solo los visibles ---------- */
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    const v = e.target; if (e.isIntersecting) { v.play().catch(() => {}); } else v.pause();
  }), { threshold: .35 });
  $$('.an video, .pill video').forEach((v) => io.observe(v));
  mm.add('(min-width: 901px)', () => {
    gsap.fromTo('.an-fila', { x: () => innerWidth * .15 }, { x: () => -($('.an-fila').scrollWidth - innerWidth * .85), ease: 'none', scrollTrigger: { trigger: '.anuncios', start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  });

  /* ---------- ARGOS: módulos ---------- */
  const mods = $$('.ag-mods li'), pants = $$('.ag-pantalla img');
  let agI = 0, agT;
  const agSet = (i) => { agI = i; mods.forEach((m, k) => m.classList.toggle('on', k === i)); pants.forEach((p, k) => p.classList.toggle('on', k === i)); };
  mods.forEach((m, i) => { m.addEventListener('mouseenter', () => agSet(i)); m.addEventListener('click', () => agSet(i)); });
  ScrollTrigger.create({ trigger: '.argos', start: 'top 60%', end: 'bottom 30%',
    onToggle: (s) => { clearInterval(agT); if (s.isActive) agT = setInterval(() => agSet((agI + 1) % mods.length), 2600); } });
  gsap.from('.ag-pantalla', { rotateX: 18, y: 80, opacity: 0, duration: 1.4, ease: 'expo.out', transformPerspective: 1200, scrollTrigger: { trigger: '.argos', start: 'top 70%' } });

  /* ---------- Estudio ---------- */
  gsap.from('.es-foto', { scale: .7, opacity: 0, rotate: -20, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.estudio', start: 'top 75%' } });

  /* ---------- CTA: linterna sobre el casco ---------- */
  const cta = $('.cta');
  if (cta) {
    if (fino) cta.addEventListener('mousemove', (e) => {
      const r = cta.getBoundingClientRect();
      cta.style.setProperty('--mx', (e.clientX - r.left) + 'px'); cta.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
    else gsap.to(cta, { '--my': '35%', repeat: -1, yoyo: true, duration: 3, ease: 'sine.inOut' });
    gsap.from('.cta-grande span', { yPercent: 100, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: cta, start: 'top 60%' } });
    gsap.fromTo('.cta-casco img', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: cta, start: 'top bottom', end: 'bottom bottom', scrub: true } });
  }
  gsap.from('.pie-wm', { yPercent: 60, ease: 'none', scrollTrigger: { trigger: '.pie', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  /* ---------- Cursor y botones magnéticos ---------- */
  if (fino) {
    const cur = $('.cur'), a = $('.cur-a'), b = $('.cur-b'), lab = $('.cur-b span');
    const ax = gsap.quickTo(a, 'x', { duration: .1 }), ay = gsap.quickTo(a, 'y', { duration: .1 });
    const bx = gsap.quickTo(b, 'x', { duration: .45, ease: 'power3' }), by = gsap.quickTo(b, 'y', { duration: .45, ease: 'power3' });
    addEventListener('mousemove', (e) => { ax(e.clientX); ay(e.clientY); bx(e.clientX); by(e.clientY); });
    $$('[data-cur]').forEach((el) => {
      el.addEventListener('mouseenter', () => { lab.textContent = el.dataset.cur; cur.classList.add('on'); });
      el.addEventListener('mouseleave', () => cur.classList.remove('on'));
    });
    $$('.mag').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' }), my = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
      el.addEventListener('mousemove', (e) => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * .35); my((e.clientY - r.top - r.height / 2) * .35); });
      el.addEventListener('mouseleave', () => { mx(0); my(0); });
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
