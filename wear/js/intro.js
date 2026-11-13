// Entrada de LEGION WEAR v2. Se ve una vez por sesión; tocar la pantalla la adelanta. Requiere GSAP.
(() => {
  const el = document.getElementById('lw-intro');
  if (!el) return;
  const raiz = document.documentElement;
  const quitar = () => { el.remove(); raiz.classList.remove('intro-on'); };
  let visto = false;
  try { visto = sessionStorage.getItem('lw_intro') === '1'; } catch (e) {}
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (visto || reduce || !window.gsap) { quitar(); return; }
  try { sessionStorage.setItem('lw_intro', '1'); } catch (e) {}
  raiz.classList.add('intro-on');

  const q = s => el.querySelectorAll(s);
  const vw = innerWidth;
  const tl = gsap.timeline({ onComplete: quitar });
  const SALIDA = 2.95;

  // 1. la línea de oro corta la pantalla
  tl.to('.li-linea', { scaleX: 1, duration: .7, ease: 'expo.inOut' }, .1)
  // 2. las dos mitades de LEGION entran desde lados opuestos y chocan en la línea
    .fromTo('.li-arriba', { x: -vw * 1.1, skewX: -28, filter: 'blur(14px)' }, { x: 0, skewX: 0, filter: 'blur(0px)', duration: .72, ease: 'expo.out' }, .55)
    .fromTo('.li-abajo', { x: vw * 1.1, skewX: 28, filter: 'blur(14px)' }, { x: 0, skewX: 0, filter: 'blur(0px)', duration: .72, ease: 'expo.out' }, .55)
  // 3. impacto: destello, el corte se abre un instante y se sella, golpe de cámara, onda expansiva
    .fromTo('.li-flash', { opacity: 0 }, { opacity: 1, duration: .08, ease: 'none' }, .86)
    .to('.li-flash', { opacity: 0, duration: .9, ease: 'power2.out' }, .94)
    .fromTo('.li-arriba', { y: 0 }, { y: -7, duration: .1, ease: 'power2.out', yoyo: true, repeat: 1 }, .86)
    .fromTo('.li-abajo', { y: 0 }, { y: 7, duration: .1, ease: 'power2.out', yoyo: true, repeat: 1 }, .86)
    .fromTo('.li-logo', { scale: 1.06 }, { scale: 1, duration: .9, ease: 'elastic.out(1, .45)', immediateRender: false }, .86)
    .to('.li-linea', { scaleY: 3, opacity: 0, duration: .55, ease: 'power2.out' }, .88)
    .fromTo(q('.li-ondas b'), { opacity: .75, scale: 1 }, { opacity: 0, scale: i => 1.5 + i * .55, duration: 1.15, ease: 'power3.out', stagger: .09, immediateRender: false }, .88)
  // 4. el oro se enciende: barrido metálico y brillo
    .to('.li-legion', { backgroundPosition: '0% 0', duration: 1.6, ease: 'power2.inOut' }, 1.0)
    .to('.li-brillo', { x: '110%', duration: 1.1, ease: 'power2.inOut' }, 1.35)
  // 5. WEAR cae letra a letra, en contorno
    .fromTo(q('.li-wear span'), { opacity: 0, y: '-120%', rotateX: 90 }, { opacity: 1, y: '0%', rotateX: 0, duration: .7, ease: 'back.out(2.2)', stagger: .08 }, 1.35)
  // 6. salida: el logo se viene encima de la cámara y abre la página
    .to('.li-logo', { scale: 9, opacity: 0, filter: 'blur(6px)', duration: .85, ease: 'power3.in' }, SALIDA)
    .to('.li-fondo', { opacity: 0, duration: .55, ease: 'power2.inOut' }, SALIDA + .45)
    .set(el, { pointerEvents: 'none' }, SALIDA + .45)
    .add(() => raiz.classList.remove('intro-on'), SALIDA + .5);

  el.addEventListener('click', () => { if (tl.time() < SALIDA) tl.seek(SALIDA); });
})();
