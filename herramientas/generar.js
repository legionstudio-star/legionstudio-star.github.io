// Crea (o actualiza) la carpeta de cada negocio a partir de datos/negocios.js.
// Uso: node herramientas/generar.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const raiz = path.join(__dirname, "..");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(raiz, "datos", "negocios.js"), "utf8"), ctx);
const NEGOCIOS = ctx.window.NEGOCIOS;

const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const version = Date.now().toString(36);   // evita que el celular muestre datos viejos

const icono = (color, letra) =>
  "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="${color}"/>` +
    `<text x="24" y="32" font-family="Arial" font-weight="700" font-size="24" fill="#fff" text-anchor="middle">${letra}</text></svg>`);

let n = 0;
for (const [slug, N] of Object.entries(NEGOCIOS)) {
  if (!/^[a-z0-9-]+$/.test(slug)) { console.error(`Slug inválido: "${slug}" (solo minúsculas, números y guiones)`); continue; }
  const color = N.color || "#E8590C";
  const desc = `${N.categoria || ""}. Califícanos, mira el menú y pide por WhatsApp.`;
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(N.nombre)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="${esc(color)}">
<meta property="og:title" content="${esc(N.nombre)}">
<meta property="og:description" content="${esc(desc)}">
${N.portada ? `<meta property="og:image" content="${esc(N.portada)}">\n` : ""}${N.plan === "basico" ? `<meta http-equiv="refresh" content="0;url=${esc(N.resenas)}">\n` : ""}<link rel="icon" href="${icono(color, esc((N.nombre.replace(/^(Asadero|Heladería|Restaurante|Bar|Panadería|Café|Cafetería)\s+/i, "")[0] || "L").toUpperCase()))}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../app/app.css?v=${version}">
</head>
<body>
<div id="app"><div class="cargando">Cargando…</div></div>
<script>window.SLUG = "${slug}";</script>
<script src="../datos/negocios.js?v=${version}"></script>
<script src="../app/app.js?v=${version}"></script>
</body>
</html>
`;
  fs.mkdirSync(path.join(raiz, slug), { recursive: true });
  fs.writeFileSync(path.join(raiz, slug, "index.html"), html);
  console.log(`  ${slug.padEnd(14)} ${N.plan.padEnd(7)} ${N.nombre}`);
  n++;
}
console.log(`\n${n} negocio(s) generados.`);
