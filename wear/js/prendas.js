// Ilustraciones de las prendas en SVG mientras no hay fotos. Cada producto puede traer "fotos" y entonces se usan esas.
const PRENDAS = (() => {
  let n = 0;
  // Siluetas en un lienzo de 200x240
  const FORMAS = {
    tee: 'M58,34 L84,24 Q100,40 116,24 L142,34 L178,66 L160,90 L144,80 L146,214 Q100,220 54,214 L56,80 L40,90 L22,66 Z',
    hoodie: 'M60,46 L40,58 L18,182 L40,188 L56,104 L56,216 Q100,222 144,216 L144,104 L160,188 L182,182 L160,58 L140,46 Q100,58 60,46 Z',
    cargo: 'M62,24 L138,24 L148,222 L110,222 L100,86 L90,222 L52,222 Z',
    bomber: 'M62,40 L40,54 L20,184 L42,190 L58,104 L58,206 L142,206 L142,104 L158,190 L180,184 L160,54 L138,40 Q100,52 62,40 Z',
    cap: 'M42,132 Q40,62 100,58 Q160,62 158,132 Z',
    shorts: 'M56,60 L144,60 L152,172 L108,176 L100,112 L92,176 L48,172 Z',
    polo: 'M62,36 L86,26 L100,38 L114,26 L138,36 L170,62 L156,84 L142,76 L144,214 Q100,219 56,214 L58,76 L44,84 L30,62 Z',
    sweater: 'M62,40 L86,30 Q100,40 114,30 L138,40 L164,62 L176,196 L156,200 L144,96 L144,214 Q100,220 56,214 L56,96 L44,200 L24,196 L36,62 Z',
    blazer: 'M64,36 L100,30 L136,36 L166,58 L178,204 L158,206 L146,100 L148,220 L52,220 L54,100 L42,206 L22,204 L34,58 Z',
    camisa: 'M62,38 L86,28 L100,40 L114,28 L138,38 L164,60 L176,196 L156,200 L144,96 L146,216 Q100,222 54,216 L56,96 L44,200 L24,196 L36,60 Z',
    chino: 'M64,24 L136,24 L142,222 L108,222 L100,90 L92,222 L58,222 Z',
    cardigan: 'M62,40 L86,30 L100,40 L114,30 L138,40 L164,62 L176,196 L156,200 L144,96 L144,214 Q100,220 56,214 L56,96 L44,200 L24,196 L36,62 Z',
  };
  const linea = (d, c, w = 2, extra = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;

  // Detalles de cada prenda: costuras, bolsillos, botones, estampados
  function detalles(tipo, o) {
    const os = o.oscuro, cl = o.claro, ac = o.acento;
    switch (tipo) {
      case 'tee': return linea('M84,24 Q100,40 116,24', os, 5) +
        (o.estampado ? `<text x="100" y="${o.estampado.length > 4 ? 112 : 120}" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="${o.estampado.length > 4 ? 19 : 40}" fill="${ac}" letter-spacing="1">${o.estampado}</text>
          <text x="100" y="${o.estampado.length > 4 ? 128 : 138}" text-anchor="middle" font-family="Archivo, sans-serif" font-size="7" fill="${cl}" letter-spacing="3">LEGION WEAR · DROP 01</text>` : '');
      case 'hoodie': return `<path d="M64,50 Q60,10 100,8 Q140,10 136,50 Q100,62 64,50 Z" fill="${o.color}"/>
        <path d="M80,48 Q82,22 100,20 Q118,22 120,48 Q100,56 80,48 Z" fill="${os}"/>` +
        linea('M92,54 L90,92', cl, 2) + linea('M108,54 L110,92', cl, 2) +
        `<path d="M72,158 L128,158 L136,196 L64,196 Z" fill="none" stroke="${os}" stroke-width="2.5"/>` +
        `<text x="100" y="128" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="22" fill="${ac}" letter-spacing="2">LGN</text>`;
      case 'cargo': return `<rect x="62" y="24" width="76" height="12" fill="${os}"/>` +
        `<rect x="56" y="124" width="26" height="36" rx="2" fill="none" stroke="${os}" stroke-width="2.5"/>` +
        `<rect x="118" y="124" width="26" height="36" rx="2" fill="none" stroke="${os}" stroke-width="2.5"/>` +
        linea('M56,132 L82,132', os, 2) + linea('M118,132 L144,132', os, 2) + linea('M100,36 L100,86', os, 2) +
        `<rect x="128" y="200" width="16" height="4" fill="${ac}"/>`;
      case 'bomber': return `<rect x="58" y="204" width="84" height="14" fill="${os}"/>` +
        linea('M62,40 Q100,62 138,40', os, 7) + linea('M100,50 L100,216', cl, 2, 'stroke-dasharray="3 3"') +
        `<rect x="22" y="178" width="22" height="10" transform="rotate(8 33 183)" fill="${os}"/><rect x="156" y="178" width="22" height="10" transform="rotate(-8 167 183)" fill="${os}"/>` +
        `<rect x="40" y="80" width="12" height="4" fill="${ac}" transform="rotate(-75 46 82)"/>`;
      case 'cap': return `<path d="M42,128 Q110,118 190,138 Q178,154 120,152 Q70,150 42,138 Z" fill="${os}"/>` +
        linea('M100,58 Q92,96 90,128', os, 1.5) + linea('M100,58 Q124,92 128,128', os, 1.5) +
        `<circle cx="100" cy="59" r="4.5" fill="${os}"/>` +
        `<text x="104" y="112" text-anchor="middle" font-family="Anton, Impact, sans-serif" font-size="24" fill="${ac}">LGN</text>`;
      case 'shorts': return `<rect x="56" y="60" width="88" height="12" fill="${os}"/>` + linea('M60,80 L52,170', ac, 3) + linea('M140,80 L148,170', ac, 3);
      case 'polo': return `<path d="M86,26 L100,38 L92,54 Z" fill="${cl}" opacity=".55"/><path d="M114,26 L100,38 L108,54 Z" fill="${cl}" opacity=".55"/>` +
        linea('M100,38 L100,74', os, 1.5) + `<circle cx="100" cy="52" r="2" fill="${cl}"/><circle cx="100" cy="66" r="2" fill="${cl}"/>` +
        `<rect x="42" y="82" width="16" height="5" fill="${os}" transform="rotate(32 50 84)" opacity=".5"/><rect x="142" y="82" width="16" height="5" fill="${os}" transform="rotate(-32 150 84)" opacity=".5"/>` +
        `<path d="M124,70 l4,6 l-4,6 l-4,-6 Z" fill="${ac}"/>` + linea('M56,206 Q100,212 144,206', os, 1, 'opacity=".5"');
      case 'sweater': return linea('M86,30 Q100,40 114,30', os, 6) +
        [76, 100, 124].map(x => linea(`M${x},62 q8,10 0,20 q-8,10 0,20 q8,10 0,20 q-8,10 0,20 q8,10 0,20 q-8,10 0,20`, os, 2.5, 'opacity=".55"')).join('') +
        [88, 112].map(x => linea(`M${x},60 L${x},200`, os, 1, 'opacity=".35"')).join('') +
        `<rect x="56" y="202" width="88" height="12" fill="${os}" opacity=".35"/>`;
      case 'blazer': return `<path d="M88,32 L100,100 L112,32 Z" fill="#f4efe4"/>` + linea('M93,34 L100,60 L107,34', '#c9bfae', 1.5) +
        `<path d="M86,32 L100,120 L72,72 L80,46 Z" fill="${os}" opacity=".7"/><path d="M114,32 L100,120 L128,72 L120,46 Z" fill="${os}" opacity=".7"/>` +
        `<circle cx="100" cy="142" r="3" fill="${ac}"/><circle cx="100" cy="166" r="3" fill="${ac}"/>` +
        `<path d="M118,80 l14,0 l-5,-8 Z" fill="${ac}"/>` + linea('M116,84 L136,84', os, 1.5) +
        linea('M62,180 L84,180', os, 1.5) + linea('M116,180 L138,180', os, 1.5);
      case 'camisa': return `<path d="M86,28 L100,40 L82,50 Z" fill="${cl}" opacity=".7"/><path d="M114,28 L100,40 L118,50 Z" fill="${cl}" opacity=".7"/>` +
        linea('M100,40 L100,216', os, 1.2, 'opacity=".5"') + [58, 86, 114, 142, 170, 198].map(y => `<circle cx="104" cy="${y}" r="1.8" fill="${os}" opacity=".6"/>`).join('') +
        `<rect x="114" y="74" width="18" height="20" fill="none" stroke="${os}" stroke-width="1.2" opacity=".5"/>`;
      case 'chino': return `<rect x="64" y="24" width="72" height="11" fill="${os}" opacity=".6"/>` +
        linea('M78,40 L76,220', os, 1, 'opacity=".4"') + linea('M122,40 L124,220', os, 1, 'opacity=".4"') +
        linea('M92,36 Q96,52 96,70', os, 1.5, 'opacity=".5"') + linea('M108,36 Q104,52 104,70', os, 1.5, 'opacity=".5"') +
        `<rect x="86" y="27" width="5" height="6" fill="${ac}"/>`;
      case 'cardigan': return `<path d="M86,30 L100,112 L114,30 Q100,36 86,30 Z" fill="#f4efe4" opacity=".9"/>` + linea('M86,30 L100,112 L114,30', os, 4) +
        linea('M100,112 L100,214', os, 2.5) + [126, 148, 170, 192].map(y => `<circle cx="104" cy="${y}" r="3" fill="${ac}"/>`).join('') +
        `<rect x="62" y="150" width="22" height="22" fill="none" stroke="${os}" stroke-width="2" opacity=".5"/><rect x="116" y="150" width="22" height="22" fill="none" stroke="${os}" stroke-width="2" opacity=".5"/>`;
    }
    return '';
  }

  // Aclara u oscurece un color hex
  function tono(hex, k) {
    const v = parseInt(hex.slice(1), 16), c = [v >> 16, (v >> 8) & 255, v & 255];
    return '#' + c.map(x => Math.max(0, Math.min(255, Math.round(k > 0 ? x + (255 - x) * k : x * (1 + k))))).map(x => x.toString(16).padStart(2, '0')).join('');
  }

  function svg(tipo, color, o = {}) {
    const id = 'pr' + (++n), forma = FORMAS[tipo];
    const oscuro = tono(color, -0.35), claro = tono(color, 0.45);
    const acento = o.acento || (document.documentElement.dataset.mundo === 'maison' ? '#b08d57' : '#b3001b');
    const det = detalles(tipo, { color, oscuro, claro, acento, estampado: o.estampado });
    // El gorro de la capota y la visera van fuera de la silueta, por eso el sombreado se recorta solo a la forma
    return `<svg viewBox="0 0 200 240" class="prenda" role="img" aria-label="${o.titulo || tipo}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${id}s" x1="0" x2="1" y1="0" y2="0.3">
          <stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/>
          <stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
        <filter id="${id}t"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" result="r"/>
          <feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .09"/></feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in"/></filter>
        <filter id="${id}b" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="4"/></filter>
      </defs>
      <ellipse cx="100" cy="230" rx="62" ry="5" fill="#000" opacity=".22" filter="url(#${id}b)"/>
      ${tipo === 'hoodie' ? `<path d="M64,50 Q60,10 100,8 Q140,10 136,50 Z" fill="${color}"/>` : ''}
      <path d="${forma}" fill="${color}"/>
      ${det}
      <path d="${forma}" fill="url(#${id}s)"/>
      <path d="${forma}" fill="#fff" filter="url(#${id}t)"/>
    </svg>`;
  }
  return { svg, tono };
})();
