(() => {
  let key='1014662474';
  const $=id=>document.getElementById(id);
  $('qrCopy').onclick=async()=>{try{await navigator.clipboard.writeText(key);$('qrStatus').textContent='Llave copiada.';}catch{$('qrStatus').textContent='Llave: '+key;}};
  GB.rpc('gbl_info').then(info=>{
    const c=info.config;
    $('clubText').textContent=`${c.meta_sellos} sellos · ${c.premio}`;
    $('address').textContent=c.direccion;
    $('qrLocation').href=c.mapa || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(c.direccion)}`;
    $('phone').textContent=GB.telFmt(c.whatsapp);
    $('qrWhatsapp').href=GB.waLink(c.whatsapp,'Hola, vengo del QR de la barbería.');
    $('payment').textContent=c.pagos;
    key=/llave\s*:?\s*(\S+)/i.exec(c.pagos || '')?.[1];$('qrCopy').hidden=!key;
    $('hours').textContent=c.horario_texto;
    if(c.resena){$('qrReview').href=c.resena;$('qrReview').hidden=false;}
  }).catch(()=>{$('qrStatus').textContent='No pudimos actualizar los datos. Puedes reservar o escribirnos por WhatsApp.';});
})();
