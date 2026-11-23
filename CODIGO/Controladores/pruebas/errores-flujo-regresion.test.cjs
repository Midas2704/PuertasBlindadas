const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

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

test('CU451 deja de aparecer en el menú y en las rutas sin borrar su implementación', () => {
  const app = readFileSync('../Vistas/src/App.tsx', 'utf8');
  const menu = readFileSync('../Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx', 'utf8');
  const servicio = readFileSync('src/m10/presupuestoManualM10.ts', 'utf8');
  assert.doesNotMatch(app, /dashboard-m7\/presupuestos/);
  assert.doesNotMatch(menu, /CU451|Presupuestos Manuales/);
  assert.match(servicio, /validarPresupuestoManualM10/);
});
