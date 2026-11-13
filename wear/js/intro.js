// Entrada de LEGION WEAR. Se ve una vez por sesión; se salta tocando la pantalla. Requiere GSAP.
(() => {
  const el = document.getElementById('lw-intro');
  if (!el) return;
  const quitar = () => { el.remove(); document.documentElement.classList.remove('intro-on'); };
  let visto = false;
  try { visto = sessionStorage.getItem('lw_intro') === '1'; } catch (e) {}
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (visto || reduce || !window.gsap) { quitar(); return; }
  try { sessionStorage.setItem('lw_intro', '1'); } catch (e) {}
  document.documentElement.classList.add('intro-on');   // el hero espera a que se abra el telón

  const $ = s => el.querySelector(s), $$ = s => [...el.querySelectorAll(s)];
  const fotos = $$('.li-arco img');
  const num = { v: 0 };
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete: quitar });

  tl.to('.li-luz', { opacity: 1, duration: 1.6, ease: 'power2.out' }, 0)
    .to(num, { v: 100, duration: 3, ease: 'power2.inOut', onUpdate: () => { $('.li-num').textContent = String(Math.round(num.v)).padStart(3, '0'); } }, 0)
    .to('.li-pie, .li-saltar', { opacity: 1, duration: .8 }, .15)
    .to('.li-marco path', { strokeDashoffset: 0, duration: 1.3, ease: 'power3.inOut' }, .1)
    .to('.li-ojal', { opacity: 1, duration: .4 }, .9)
    .to('.li-arco', { clipPath: 'inset(0% 0 0 0 round 999px 999px 6px 6px)', duration: 1.1, ease: 'expo.inOut' }, .35);
  // las prendas pasan rápido dentro del arco, como un fashion film
  fotos.forEach((f, i) => {
    const t = .55 + i * .36;
    tl.to(f, { opacity: 1, scale: 1, duration: .5, ease: 'power3.out' }, t);
    if (i < fotos.length - 1) tl.to(f, { opacity: 0, duration: .2, ease: 'none' }, t + .36);
  });
  tl.to('.li-brillo', { x: '120%', duration: 1.2, ease: 'power2.inOut' }, 1.9)
    .to('.li-legion span', { y: 0, duration: 1.05, stagger: .06 }, 1.15)
    .to('.li-legion span', { backgroundPosition: '0% 0', duration: 1.9, ease: 'power2.inOut' }, 1.5)
    .to('.li-wear', { opacity: 1, letterSpacing: window.innerWidth < 600 ? '.02em' : '.04em', paddingLeft: 0, duration: 1.4, ease: 'expo.out' }, 1.75)
    // salida: todo se recoge y el telón se abre hacia arriba y abajo
    .to('.li-escena, .li-marca', { scale: .94, opacity: 0, duration: .7, ease: 'power3.in' }, 3.35)
    .to('.li-pie, .li-saltar, .li-luz', { opacity: 0, duration: .4 }, 3.35)
    .to('.li-mitad.a', { yPercent: -100, duration: 1, ease: 'expo.inOut' }, 3.8)
    .to('.li-mitad.b', { yPercent: 100, duration: 1, ease: 'expo.inOut' }, 3.8)
    .set(el, { pointerEvents: 'none' }, 3.9)
    .add(() => document.documentElement.classList.remove('intro-on'), 3.95);

  el.addEventListener('click', () => { if (tl.time() < 3.3) tl.seek(3.3); });
})();
