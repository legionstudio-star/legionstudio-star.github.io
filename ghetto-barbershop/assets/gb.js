/* Ghetto Barbershop SM — conexión con la base de datos y utilidades compartidas.
   Toda la información pasa por funciones del servidor (Supabase RPC gb_*): las tablas no se pueden leer directo. */
(function () {
  const URL = 'https://cbvzwwhdfxwlujmninov.supabase.co';
  const KEY = 'sb_publishable_o-pcQCGPXSuvRdxovVmSIA_F9qyR1-9';

  async function rpc(fn, args) {
    let r;
    try {
      r = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
        method: 'POST',
        headers: { apikey: KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(args || {})
      });
    } catch (e) {
      throw new Error('Sin conexión. Revisa tu internet e intenta de nuevo.');
    }
    const txt = await r.text();
    const data = txt ? JSON.parse(txt) : null;
    if (!r.ok) throw new Error((data && data.message) || 'Algo salió mal. Intenta de nuevo.');
    return data;
  }

  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => (n == null ? '' : '$' + Number(n).toLocaleString('es-CO'));
  const toMin = (hhmm) => { const [h, m] = String(hhmm).split(':').map(Number); return h * 60 + m; };
  const fromMin = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
  function time12(hhmm) {
    const [h, m] = String(hhmm).split(':').map(Number);
    return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`;
  }
  const parseDate = (s) => new Date(s + 'T12:00:00');
  const dateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function addDays(s, n) { const d = parseDate(s); d.setDate(d.getDate() + n); return dateStr(d); }
  const dateLong = (s) => parseDate(s).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
  const dateShort = (s) => parseDate(s).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' });
  const telFmt = (t) => String(t || '').replace(/^(\d{3})(\d{3})(\d{4})$/, '$1 $2 $3');
  const waLink = (num, text) => {
    let n = String(num || '').replace(/\D/g, '');
    if (n.length === 10) n = '57' + n;
    return `https://wa.me/${n}?text=${encodeURIComponent(text || '')}`;
  };

  // ---- diálogos ----
  function ensureModal() {
    let el = document.getElementById('gb-modal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'gb-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.innerHTML = '<div class="gb-modal-card"><div class="gb-modal-msg"></div><div class="gb-modal-actions"></div></div>';
    document.body.appendChild(el);
    return el;
  }
  function modal(html, buttons) {
    return new Promise((resolve) => {
      const el = ensureModal();
      el.querySelector('.gb-modal-msg').innerHTML = html;
      const act = el.querySelector('.gb-modal-actions');
      act.innerHTML = '';
      buttons.forEach((b) => {
        const btn = document.createElement(b.href ? 'a' : 'button');
        if (b.href) { btn.href = b.href; btn.target = '_blank'; btn.rel = 'noopener'; } else btn.type = 'button';
        btn.className = 'btn btn-sm ' + (b.cls || (b.primary ? 'btn-cream' : 'btn-ghost'));
        btn.innerHTML = b.label;
        btn.onclick = () => { el.classList.remove('show'); resolve(b.value); };
        act.appendChild(btn);
      });
      el.classList.add('show');
      const first = act.querySelector('.btn-cream,.btn-red,.btn-wa') || act.firstChild;
      if (first) setTimeout(() => first.focus(), 50);
    });
  }
  const alertBox = (html, label = 'Entendido') => modal(html, [{ label, value: true, primary: true }]);
  const confirmBox = (html, yes = 'Sí', no = 'Cancelar', danger) =>
    modal(html, [{ label: no, value: false }, { label: yes, value: true, cls: danger ? 'btn-red' : 'btn-cream' }]);
  function toast(txt) {
    let t = document.getElementById('gb-toast');
    if (!t) { t = document.createElement('div'); t.id = 'gb-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
    t.textContent = txt; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 2800);
  }

  window.GB = { rpc, pad, esc, money, toMin, fromMin, time12, parseDate, dateStr, addDays, dateLong, dateShort, telFmt, waLink, modal, alertBox, confirmBox, toast };
})();
