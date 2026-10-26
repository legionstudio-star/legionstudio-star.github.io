/*
  CONFIGURACIÓN — LEGION Studio Digital
  -------------------------------------
  Los clientes ya no se editan aquí: se crean y se editan en el panel (legionestudio.com/panel/).
  Los datos viven en Supabase (proyecto "legion-habladores").

  La llave de abajo es la "publishable": es pública a propósito. Solo permite LEER los
  negocios activos; crear, editar o borrar exige iniciar sesión como administrador.
*/

// Dirección base de todos los enlaces (QR y NFC). Nunca cambiar el slug de un cliente con hablador impreso.
window.LEGION_URL = "https://legionestudio.com/";

window.SUPABASE_URL = "https://infohpbtwalukhjdfplc.supabase.co";
window.SUPABASE_KEY = "sb_publishable_c1MoXYfg-DfEoXcvTMAlvw_n4EDk1Qo";

// Lectura pública de negocios (sin librerías)
window.LEGION = {
  async _get(consulta) {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/negocios?${consulta}`, { headers: { apikey: SUPABASE_KEY } });
    if (!r.ok) throw new Error("No se pudieron cargar los datos (" + r.status + ")");
    return r.json();
  },
  // Un negocio por slug, o null si no existe
  async negocio(slug) {
    if (!/^[a-z0-9][a-z0-9-]{1,39}$/.test(slug || "")) return null;
    const filas = await this._get(`select=datos&slug=eq.${slug}&activo=eq.true`);
    return filas.length ? filas[0].datos : null;
  },
  // Todos los negocios activos: { slug: datos }
  async negocios() {
    const filas = await this._get("select=slug,datos&activo=eq.true&order=creado.asc");
    return Object.fromEntries(filas.map((f) => [f.slug, f.datos]));
  }
};
