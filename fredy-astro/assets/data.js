/* Fredy Astro · datos de la DEMO (servicios, precios y clientes son EJEMPLOS) */
const CONFIG = {
  nombre: 'Fredy Astro',
  wa: '573234953988',            // demo: WhatsApp de LEGION (en producción va el de Fredy)
  pin: '2026',                   // PIN del panel
  trm: 4000,                     // pesos por dólar (referencia)
  horario: { dias: [1, 2, 3, 4, 5, 6], bloques: ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00', '18:00', '19:00'] },
};

// tipo: sesion (agenda día y hora) · entrega (informe en X días) · curso (grupo con fecha) · membresia · regalo
const SERVICIOS = [
  { id: 'carta', cat: 'Lecturas', tipo: 'sesion', ico: '✦', n: 'Carta astral natal', cop: 150000, usd: 45, dur: '60 min', top: true,
    d: 'La lectura completa de tu mapa de nacimiento: personalidad, amor, trabajo, dinero, salud y propósito.', inc: ['Videollamada de 60 min', 'Carta en PDF con tu mapa', 'Grabación de la sesión'] },
  { id: 'revolucion', cat: 'Lecturas', tipo: 'sesion', ico: '☉', n: 'Revolución solar · tu año', cop: 120000, usd: 35, dur: '45 min',
    d: 'Lo que trae tu nuevo año desde tu cumpleaños: meses clave, oportunidades y retos.', inc: ['Videollamada de 45 min', 'Calendario de tu año en PDF'] },
  { id: 'pareja', cat: 'Amor', tipo: 'sesion', ico: '♡', n: 'Compatibilidad de pareja', cop: 180000, usd: 50, dur: '60 min', top: true,
    d: 'Sinastría de las dos cartas: qué los une, dónde chocan y cómo fortalecer la relación.', inc: ['Videollamada de 60 min', 'Informe de compatibilidad'] },
  { id: 'consulta', cat: 'Lecturas', tipo: 'sesion', ico: '☾', n: 'Consulta puntual', cop: 70000, usd: 20, dur: '30 min',
    d: 'Una pregunta concreta de amor, trabajo, dinero o una decisión importante.', inc: ['Videollamada de 30 min'] },
  { id: 'express', cat: 'Lecturas', tipo: 'entrega', ico: '✉', n: 'Lectura exprés por WhatsApp', cop: 50000, usd: 15, dur: 'Audio de 15 min · 48 h',
    d: 'Tu Sol, Luna y Ascendente explicados en un audio, sin agendar videollamada.', inc: ['Audio de 15 min', 'Entrega en 48 horas'] },
  { id: 'vocacional', cat: 'Trabajo', tipo: 'sesion', ico: '⚲', n: 'Carta vocacional y profesional', cop: 130000, usd: 40, dur: '60 min',
    d: 'Para jóvenes que escogen carrera y adultos que quieren cambiar de rumbo o emprender.', inc: ['Videollamada de 60 min', 'Talentos y caminos en PDF'] },
  { id: 'bebe', cat: 'Familia', tipo: 'entrega', ico: '☆', n: 'Carta del bebé o niño', cop: 100000, usd: 30, dur: 'PDF + audio · 5 días',
    d: 'Para mamás y papás: temperamento, talentos y cómo acompañar a su hijo.', inc: ['Informe ilustrado en PDF', 'Audio explicativo'] },
  { id: 'fechas', cat: 'Trabajo', tipo: 'entrega', ico: '◷', n: 'Fechas favorables', cop: 150000, usd: 45, dur: 'Informe · 5 días',
    d: 'El mejor día para la boda, abrir el negocio, firmar, viajar o mudarse.', inc: ['3 fechas recomendadas', 'Explicación de cada una'] },
  { id: 'curso', cat: 'Cursos', tipo: 'curso', ico: '✎', n: 'Curso: Aprende a leer tu carta', cop: 350000, usd: 95, dur: '4 clases en vivo de 2 h', top: true,
    d: 'Desde cero: signos, planetas, casas y aspectos. Al final lees tu propia carta.', inc: ['4 clases en vivo por Zoom', 'Grabaciones y material', 'Certificado', 'Grupo de WhatsApp'] },
  { id: 'taller', cat: 'Cursos', tipo: 'curso', ico: '✶', n: 'Taller en vivo del mes', cop: 60000, usd: 18, dur: '2 h',
    d: 'Un tema distinto cada mes: la Luna y tus emociones, Venus y el amor, Saturno y tus metas.', inc: ['Clase en vivo de 2 h', 'Grabación por 30 días'] },
  { id: 'circulo', cat: 'Membresía', tipo: 'membresia', ico: '◎', n: 'Círculo Astro', cop: 40000, usd: 12, dur: 'Mensual', top: true,
    d: 'Tu guía de cada mes con la energía del cielo, más un encuentro en vivo con Fredy.', inc: ['Lectura mensual personalizada', 'En vivo grupal cada mes', '10% en todas las lecturas', 'Grupo privado'] },
  { id: 'regalo', cat: 'Regalos', tipo: 'regalo', ico: '❖', n: 'Tarjeta de regalo: carta astral', cop: 150000, usd: 45, dur: 'Válida 6 meses',
    d: 'El regalo más original para un cumpleaños: una carta astral con Fredy.', inc: ['Tarjeta digital con nombre', 'La persona agenda cuando quiera'] },
  { id: 'tatacoa', cat: 'Experiencias', tipo: 'sesion', ico: '✺', n: 'Noche de estrellas en la Tatacoa', cop: 250000, usd: 70, dur: 'Presencial · 3 h',
    d: 'Observación del cielo del desierto con Fredy y tu carta astral leída bajo las estrellas.', inc: ['Observación guiada', 'Carta astral', 'Bebida caliente', 'Descuento en el hotel'], presencial: true },
];

const CURSOS_GRUPOS = { curso: ['2026-11-18', '2026-12-02', '2027-01-13'], taller: ['2026-11-25', '2026-12-16'] };

const PAGOS = [
  { id: 'nequi', n: 'Nequi', d: 'Desde Colombia, al instante' },
  { id: 'banco', n: 'Bancolombia / PSE', d: 'Transferencia o PSE' },
  { id: 'tarjeta', n: 'Tarjeta débito o crédito', d: 'Visa · Mastercard · Amex' },
  { id: 'paypal', n: 'PayPal', d: 'Para el exterior, en dólares' },
];

const TESTIMONIOS = [
  { n: 'Laura M.', c: 'Bogotá', s: 'Carta astral', t: 'Me explicó cosas de mí que nadie sabía. Salí con mucha claridad sobre mi trabajo.' },
  { n: 'Andrés y Paola', c: 'Medellín', s: 'Compatibilidad de pareja', t: 'Nos ayudó a entender por qué chocábamos. Fue como una terapia, pero con el cielo.' },
  { n: 'Camila R.', c: 'Madrid', s: 'Revolución solar', t: 'Desde España, por videollamada, y fue como estar con él en la Tatacoa.' },
  { n: 'Jorge P.', c: 'Neiva', s: 'Curso Aprende a leer tu carta', t: 'Ahora leo mi carta y la de mi familia. Fredy enseña con mucha paciencia.' },
];

const FAQ = [
  ['¿Cómo es la sesión virtual?', 'Por videollamada (Zoom, Meet o WhatsApp). Te llega el enlace al agendar y la sesión queda grabada para ti.'],
  ['¿Qué datos necesito?', 'Tu fecha, hora y ciudad de nacimiento. Si no sabes la hora exacta, Fredy te ayuda a rectificarla.'],
  ['¿Puedo pagar desde otro país?', 'Sí. Aceptamos PayPal y tarjeta en dólares. La hora de la cita se ajusta a tu país.'],
  ['¿Y si necesito cambiar la cita?', 'Puedes reprogramar sin costo avisando con 24 horas.'],
  ['¿La astrología predice el futuro?', 'La carta muestra tendencias y talentos para que tomes mejores decisiones. Tú siempre decides.'],
];

// ---- citas de ejemplo para el panel (fechas relativas a hoy) ----
function citasDemo() {
  const h = new Date(); h.setHours(0, 0, 0, 0);
  const dia = (k) => { const d = new Date(h); d.setDate(d.getDate() + k); return d.toISOString().slice(0, 10); };
  const mk = (k, hora, s, n, ciudad, pais, nac, hnac, cnac, pago, estado, extra = {}) => ({ id: 'D' + Math.random().toString(36).slice(2, 8), creada: dia(Math.min(k, 0) - 3), fecha: dia(k), hora, servicio: s, nombre: n, ciudad, pais, nac, hnac, cnac, pago, estado, metodo: pais === 'CO' ? 'nequi' : 'paypal', ...extra });
  return [
    mk(0, '09:00', 'carta', 'Valentina Ríos', 'Bogotá', 'CO', '1994-03-12', '06:40', 'Bogotá', 'pagado', 'confirmada'),
    mk(0, '11:00', 'pareja', 'Sebastián y Mariana', 'Cali', 'CO', '1990-08-21', '14:10', 'Cali', 'pagado', 'confirmada', { nac2: '1992-01-30', hnac2: '09:25', cnac2: 'Medellín' }),
    mk(0, '16:00', 'consulta', 'Diana Torres', 'Madrid', 'ES', '1987-11-02', '22:15', 'Pereira', 'pagado', 'confirmada'),
    mk(0, '18:00', 'revolucion', 'Carlos Méndez', 'Miami', 'US', '1979-05-18', '03:30', 'Barranquilla', 'pendiente', 'confirmada'),
    mk(1, '10:00', 'vocacional', 'Juliana Pardo', 'Medellín', 'CO', '2007-09-09', '11:50', 'Medellín', 'pagado', 'confirmada'),
    mk(1, '15:00', 'carta', 'Ricardo Gómez', 'Ciudad de México', 'MX', '1985-02-14', '19:05', 'Bucaramanga', 'pagado', 'confirmada'),
    mk(2, '17:00', 'carta', 'Natalia Vargas', 'Neiva', 'CO', '1998-12-01', '08:20', 'Neiva', 'pendiente', 'confirmada'),
    mk(3, '19:00', 'tatacoa', 'Familia Herrera', 'Bogotá', 'CO', '1975-06-25', '13:00', 'Ibagué', 'pagado', 'confirmada'),
    mk(-1, '09:00', 'carta', 'Mónica Salazar', 'Pereira', 'CO', '1991-04-07', '05:55', 'Pereira', 'pagado', 'completada'),
    mk(-1, '16:00', 'consulta', 'Felipe Ortiz', 'Buenos Aires', 'AR', '1989-10-19', '23:40', 'Cali', 'pagado', 'completada'),
    mk(-2, '10:00', 'pareja', 'Andrea y Tomás', 'Lima', 'PE', '1993-07-03', '17:20', 'Lima', 'pagado', 'completada', { nac2: '1990-09-11', hnac2: '12:00', cnac2: 'Lima' }),
    mk(-3, '00:00', 'express', 'Paula Restrepo', 'Barcelona', 'ES', '1996-01-22', '10:10', 'Medellín', 'pagado', 'completada'),
    mk(-4, '00:00', 'bebe', 'Bebé Emiliano (mamá Lina)', 'Bogotá', 'CO', '2026-08-30', '04:12', 'Bogotá', 'pagado', 'en proceso'),
    mk(-5, '00:00', 'curso', 'Jorge Peña', 'Neiva', 'CO', '1970-03-03', '', 'Neiva', 'pagado', 'inscrito', { grupo: '2026-11-18' }),
    mk(-5, '00:00', 'curso', 'Sandra Lozano', 'Quito', 'EC', '1982-12-12', '', 'Quito', 'pagado', 'inscrito', { grupo: '2026-11-18' }),
    mk(-6, '00:00', 'curso', 'Martha Cuéllar', 'Bogotá', 'CO', '1968-08-08', '', 'Bogotá', 'pagado', 'inscrito', { grupo: '2026-11-18' }),
    mk(-2, '00:00', 'curso', 'Kevin Arias', 'Miami', 'US', '1999-04-04', '', 'Cali', 'pendiente', 'inscrito', { grupo: '2026-11-18' }),
    mk(-7, '00:00', 'regalo', 'Para: Gloria (de su hija Ana)', 'Bogotá', 'CO', '', '', 'Bogotá', 'pagado', 'enviada'),
  ];
}
const MIEMBROS_DEMO = 37; // personas en el Círculo Astro (ejemplo)
