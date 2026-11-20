// Detector de arranque: si la app no logra pintar nada, muestra el error en vez de una pantalla negra.
(function () {
  var errores = [];
  window.addEventListener('error', function (e) {
    errores.push((e.message || 'Error') + (e.filename ? ' @ ' + e.filename.split('/').pop() + ':' + e.lineno : ''));
  }, true);
  window.addEventListener('unhandledrejection', function (e) {
    var r = e.reason; errores.push('Promesa: ' + (r && (r.message || r.toString()) || 'sin detalle'));
  });
  setTimeout(function () {
    var root = document.getElementById('root');
    if (root && root.children.length) return; // la app arrancó bien
    var nav = navigator.userAgent;
    var caja = document.createElement('div');
    caja.setAttribute('style', 'position:fixed;inset:0;display:grid;place-items:center;background:#05070d;color:#eef2f7;font:16px system-ui,sans-serif;padding:24px;z-index:99999');
    caja.innerHTML =
      '<div style="max-width:620px">' +
      '<p style="font-size:22px;font-weight:700;margin:0 0 10px">QuestHub HQ no pudo arrancar en este navegador</p>' +
      '<p style="color:#8a94a6;margin:0 0 16px">Toma una captura de esta pantalla y envíala a Legion Studio.</p>' +
      '<pre style="white-space:pre-wrap;background:#0e1218;border:1px solid #1b2230;border-radius:12px;padding:14px;font-size:13px;color:#f472b6;max-height:40vh;overflow:auto"></pre>' +
      '<button style="margin-top:14px;padding:12px 22px;border:0;border-radius:12px;background:#22d3ee;color:#05070d;font-weight:700;cursor:pointer">Recargar</button>' +
      '</div>';
    caja.querySelector('pre').textContent = (errores.length ? errores.join('\n') : 'Sin error registrado (posible bloqueo de una extensión).') + '\n\n' + nav;
    caja.querySelector('button').onclick = function () { location.reload(); };
    document.body.appendChild(caja);
  }, 6000);
})();
