const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { operacionesPermiso, permiteOperacion } = require('../dist/validaciones/permisos');

test('plantillas aceptan el identificador idAreaTrabajo enviado por la interfaz', () => {
  const backend = readFileSync('src/controladores/M2Controller.ts', 'utf8');
  assert.match(backend, /etapa\.idAreaTrabajo \?\? etapa\.idArea/g);
});

test('venta directa USD reutiliza el tipo de cambio confirmado si falla la segunda consulta', () => {
  const backend = readFileSync('src/controladores/M2Controller.ts', 'utf8');
  const frontend = readFileSync('../Vistas/src/views/NotaDeVentaDirecta/NotaDeVentaDirecta.tsx', 'utf8');
  assert.match(backend, /entrada\.tipoCambio === undefined \|\| entrada\.tipoCambio === null \|\| entrada\.tipoCambio === ''/);
  assert.match(backend, /resolverTipoCambioCotizacion\(codigoMoneda, entrada\)/);
  assert.match(frontend, /tipoCambio: moneda === 'USD' \? Number\(tipoCambio\) : undefined/);
});

test('venta directa obtiene CLP y USD desde su configuración sin alterar el catálogo maestro', () => {
  const backend = readFileSync('src/controladores/M2Controller.ts', 'utf8');
  const rutas = readFileSync('src/rutas/finanzas.ts', 'utf8');
  const frontend = readFileSync('../Vistas/src/views/NotaDeVentaDirecta/NotaDeVentaDirecta.tsx', 'utf8');
  assert.match(backend, /M2_MONEDAS_VENTA_DIRECTA \|\| 'CLP,USD'/);
  assert.match(backend, /codigosMonedaVentaDirecta\(\)\.has\(moneda\.codigo_moneda\)/);
  assert.match(rutas, /billing\/nota-venta\/monedas/);
  assert.match(frontend, /billing\/nota-venta\/monedas/);
});

test('retomar cotización consulta sólo el borrador y conserva su moneda histórica', () => {
  const backend = readFileSync('src/controladores/M2Controller.ts', 'utf8');
  const rutas = readFileSync('src/rutas/finanzas.ts', 'utf8');
  const frontend = readFileSync('../Vistas/src/views/ArmarCotizacion/ArmarCotizacionComercial.tsx', 'utf8');
  assert.match(backend, /async obtenerBorradorCotizacion/);
  assert.match(backend, /monedaObjetivo\.id_moneda!==referencia\.id_moneda/);
  assert.match(rutas, /billing\/quotes\/:id\/draft/);
  assert.match(frontend, /billing\/quotes\/\$\{borradorId\}\/draft/);
  assert.match(frontend, /monedas\?borrador=\$\{borradorId\}/);
  assert.doesNotMatch(frontend, /solicitarFinanzas\('\/billing\/pending-approvals'\)/);
});

test('rutas nuevas reutilizan los permisos obligatorios de cotización y Venta Directa', () => {
  assert.equal(operacionesPermiso.obtenerBorradorCotizacion, 'CU20');
  assert.equal(operacionesPermiso.monedasVentaDirecta, 'CU27');
  assert.equal(permiteOperacion('obtenerBorradorCotizacion', ['CU20']), true);
  assert.equal(permiteOperacion('obtenerBorradorCotizacion', ['CU19']), false);
  assert.equal(permiteOperacion('monedasVentaDirecta', ['CU27']), true);
});

test('service worker clona las respuestas antes de entregarlas y renueva la caché', () => {
  const sw = readFileSync('../Vistas/public/sw.js', 'utf8');
  assert.match(sw, /puertas-blindadas-v2/);
  assert.match(sw, /const copia=respuesta\.clone\(\);/);
  assert.doesNotMatch(sw, /cache\.put\([^\n]+respuesta\.clone\(\)/);
});

test('CU451 deja de aparecer en el menú y en las rutas sin borrar su implementación', () => {
  const app = readFileSync('../Vistas/src/App.tsx', 'utf8');
  const menu = readFileSync('../Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx', 'utf8');
  const servicio = readFileSync('src/m10/presupuestoManualM10.ts', 'utf8');
  assert.doesNotMatch(app, /dashboard-m7\/presupuestos/);
  assert.doesNotMatch(menu, /CU451|Presupuestos Manuales/);
  assert.match(servicio, /validarPresupuestoManualM10/);
});
