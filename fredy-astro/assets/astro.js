/* Fredy Astro · cálculos astronómicos livianos (Sol, Luna y Ascendente)
   Precisión: Sol ~0.01°, Luna ~0.5°, Ascendente ~0.5° (suficiente para el signo). */
(function (g) {
  const R = Math.PI / 180, norm = (x) => ((x % 360) + 360) % 360;

  const SIGNOS = [
    { n: 'Aries', s: '♈', el: 'Fuego', sol: 'Tu esencia es iniciar: valiente, directo y con energía de pionero.', luna: 'Sientes rápido y necesitas acción; te calma tener un reto propio.', asc: 'Los demás te ven decidido, espontáneo y con chispa.' },
    { n: 'Tauro', s: '♉', el: 'Tierra', sol: 'Tu esencia es construir: paciente, leal y con un gran sentido del disfrute.', luna: 'Necesitas calma, rutina y comodidad para sentirte seguro.', asc: 'Proyectas serenidad, buen gusto y confianza.' },
    { n: 'Géminis', s: '♊', el: 'Aire', sol: 'Tu esencia es conectar: curioso, ingenioso y gran comunicador.', luna: 'Procesas lo que sientes hablando; necesitas variedad y conversación.', asc: 'Te ven ágil, simpático y siempre informado.' },
    { n: 'Cáncer', s: '♋', el: 'Agua', sol: 'Tu esencia es cuidar: sensible, protector y muy intuitivo.', luna: 'Tu hogar y tu gente son tu refugio; sientes todo con profundidad.', asc: 'Proyectas calidez; la gente se siente en confianza contigo.' },
    { n: 'Leo', s: '♌', el: 'Fuego', sol: 'Tu esencia es brillar: generoso, creativo y con corazón de líder.', luna: 'Necesitas sentirte valorado y expresar lo que sientes con orgullo.', asc: 'Llegas y se nota: carisma, presencia y alegría.' },
    { n: 'Virgo', s: '♍', el: 'Tierra', sol: 'Tu esencia es perfeccionar: analítico, servicial y muy detallista.', luna: 'Te calma el orden; ayudar a otros te da paz.', asc: 'Te ven prudente, ordenado y confiable.' },
    { n: 'Libra', s: '♎', el: 'Aire', sol: 'Tu esencia es equilibrar: diplomático, justo y amante de la belleza.', luna: 'Necesitas armonía y compañía para estar en paz.', asc: 'Proyectas elegancia, amabilidad y encanto.' },
    { n: 'Escorpio', s: '♏', el: 'Agua', sol: 'Tu esencia es transformar: intenso, magnético y muy leal.', luna: 'Sientes en profundidad y no a medias; necesitas confianza total.', asc: 'Te ven misterioso, fuerte y difícil de olvidar.' },
    { n: 'Sagitario', s: '♐', el: 'Fuego', sol: 'Tu esencia es explorar: optimista, libre y buscador de sentido.', luna: 'Necesitas libertad, viajes y aprender algo nuevo.', asc: 'Proyectas entusiasmo, humor y espíritu aventurero.' },
    { n: 'Capricornio', s: '♑', el: 'Tierra', sol: 'Tu esencia es lograr: disciplinado, responsable y con metas claras.', luna: 'Te da seguridad tener todo bajo control y un plan.', asc: 'Te ven serio, maduro y capaz.' },
    { n: 'Acuario', s: '♒', el: 'Aire', sol: 'Tu esencia es innovar: original, independiente y humanitario.', luna: 'Necesitas espacio propio y amigos que respeten tu forma de ser.', asc: 'Proyectas originalidad: no pasas desapercibido.' },
    { n: 'Piscis', s: '♓', el: 'Agua', sol: 'Tu esencia es sentir: compasivo, soñador y muy espiritual.', luna: 'Absorbes las emociones del entorno; el arte y el silencio te sanan.', asc: 'Te ven dulce, sensible y con un aire mágico.' },
  ];

  // ciudades (lat, lon este +, huso horario, horario de verano: 'eu' | 'us' | null)
  const CIUDADES = [
    ['Bogotá', 'CO', 4.711, -74.072, -5], ['Medellín', 'CO', 6.244, -75.581, -5], ['Cali', 'CO', 3.452, -76.532, -5], ['Barranquilla', 'CO', 10.964, -74.796, -5],
    ['Cartagena', 'CO', 10.391, -75.479, -5], ['Bucaramanga', 'CO', 7.119, -73.122, -5], ['Neiva', 'CO', 2.927, -75.282, -5], ['Villavieja', 'CO', 3.219, -75.218, -5],
    ['Pereira', 'CO', 4.813, -75.696, -5], ['Ibagué', 'CO', 4.438, -75.232, -5], ['Pasto', 'CO', 1.213, -77.281, -5], ['Cúcuta', 'CO', 7.893, -72.508, -5],
    ['Villavicencio', 'CO', 4.142, -73.627, -5], ['Manizales', 'CO', 5.068, -75.517, -5], ['Santa Marta', 'CO', 11.240, -74.199, -5],
    ['Ciudad de México', 'MX', 19.433, -99.133, -6], ['Lima', 'PE', -12.046, -77.043, -5], ['Quito', 'EC', -0.180, -78.468, -5], ['Panamá', 'PA', 8.983, -79.517, -5],
    ['Caracas', 'VE', 10.481, -66.904, -4], ['Santiago', 'CL', -33.449, -70.669, -4], ['Buenos Aires', 'AR', -34.604, -58.382, -3],
    ['Miami', 'US', 25.762, -80.192, -5, 'us'], ['Nueva York', 'US', 40.713, -74.006, -5, 'us'], ['Madrid', 'ES', 40.417, -3.704, 1, 'eu'], ['Barcelona', 'ES', 41.385, 2.173, 1, 'eu'],
  ].map(([n, p, lat, lon, tz, dst]) => ({ n, p, lat, lon, tz, dst }));

  const dstOn = (c, y, m, d) => {
    if (c.dst === 'eu') return m > 3 && m < 10 || (m === 3 && d >= 25) || (m === 10 && d < 25);
    if (c.dst === 'us') return m > 3 && m < 11 || (m === 3 && d >= 10);
    return false;
  };
  const julian = (y, m, d, hUT) => {
    if (m <= 2) { y -= 1; m += 12; }
    const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5 + hUT / 24;
  };
  const sol = (n) => { const L = 280.460 + 0.9856474 * n, gg = (357.528 + 0.9856003 * n) * R; return norm(L + 1.915 * Math.sin(gg) + 0.020 * Math.sin(2 * gg)); };
  const luna = (n) => {
    const L0 = 218.316 + 13.176396 * n, M = (134.963 + 13.064993 * n) * R, F = (93.272 + 13.229350 * n) * R, D = (297.850 + 12.190749 * n) * R, Ms = (357.529 + 0.98560028 * n) * R;
    return norm(L0 + 6.289 * Math.sin(M) + 1.274 * Math.sin(2 * D - M) + 0.658 * Math.sin(2 * D) + 0.214 * Math.sin(2 * M) - 0.186 * Math.sin(Ms) - 0.114 * Math.sin(2 * F));
  };
  const ascendente = (jd, lat, lon) => {
    const T = (jd - 2451545) / 36525, eps = (23.4393 - 0.0130 * T) * R;
    const ramc = norm(280.46061837 + 360.98564736629 * (jd - 2451545) + lon) * R;
    return norm(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(lat * R) * Math.sin(eps))) / R);
  };
  const signo = (lon) => ({ ...SIGNOS[Math.floor(lon / 30)], i: Math.floor(lon / 30), grado: Math.floor(lon % 30) });

  /** fecha 'YYYY-MM-DD', hora 'HH:MM' (opcional), ciudad (nombre de CIUDADES) */
  function carta(fecha, hora, ciudad) {
    const [y, m, d] = fecha.split('-').map(Number);
    const c = CIUDADES.find((x) => x.n === ciudad) || CIUDADES[0];
    const conHora = !!hora;
    const [hh, mm] = (hora || '12:00').split(':').map(Number);
    const tz = c.tz + (dstOn(c, y, m, d) ? 1 : 0);
    const jd = julian(y, m, d, hh + mm / 60 - tz), n = jd - 2451545;
    return {
      sol: signo(sol(n)), luna: signo(luna(n)), asc: conHora ? signo(ascendente(jd, c.lat, c.lon)) : null,
      ciudad: c, conHora,
    };
  }
  /** fase de la luna hoy (0 = nueva, 0.5 = llena) */
  function faseLunar(date = new Date()) {
    const jd = date.getTime() / 86400000 + 2440587.5, n = jd - 2451545;
    const el = norm(luna(n) - sol(n)) / 360;
    const nombres = ['Luna nueva', 'Luna creciente', 'Cuarto creciente', 'Gibosa creciente', 'Luna llena', 'Gibosa menguante', 'Cuarto menguante', 'Luna menguante'];
    return { f: el, nombre: nombres[Math.round(el * 8) % 8], ilum: Math.round((1 - Math.cos(el * 2 * Math.PI)) / 2 * 100), signo: signo(luna(n)) };
  }
  g.ASTRO = { SIGNOS, CIUDADES, carta, faseLunar, signo };
})(typeof window !== 'undefined' ? window : globalThis);
