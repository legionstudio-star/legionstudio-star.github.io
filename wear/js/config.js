// Datos de la tienda que se cambian sin tocar el resto del código.
const TIENDA = {
  nombre: 'LEGION WEAR',
  // Número de WhatsApp con indicativo y sin espacios ni "+", ej. '573001234567'.
  // Vacío: WhatsApp abre el mensaje listo y deja escoger a quién enviarlo.
  whatsapp: '573234953988',   // WhatsApp de Lejión Estudio (13-nov); cambiar si LEGION WEAR tiene número propio
  instagram: '',   // vacío = no se muestra; poner el enlace cuando exista la cuenta
  ciudad: 'Bogotá, Colombia',
  envioGratisDesde: 0,   // por monto (COP); 0 = no aplica
  envioGratisPrendas: 3,   // envío gratis llevando esta cantidad de prendas o más (13-nov, lo pidió el dueño); 0 = no aplica
  // Legion Maison (old money) apagada por ahora: true para volver a mostrarla.
  maison: false,
};
