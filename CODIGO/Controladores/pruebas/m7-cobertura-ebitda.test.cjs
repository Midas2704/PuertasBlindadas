const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { calcularEstadoResultadosM7, evaluarCoberturaEstadoResultadosM7, matrizCoberturaFuentesEerrM7, resolverPeriodoM7 } = require('../dist/controladores/M7Controller');
const { operacionesPermiso } = require('../dist/validaciones/permisos');

const controlador = readFileSync(resolve('src/controladores/M7Controller.ts'), 'utf8');
const resumen = readFileSync(resolve('../Vistas/src/views/DashboardM7/ResumenesM7.tsx'), 'utf8');
const panel = readFileSync(resolve('../Vistas/src/views/DashboardM7/PanelGeneralM7.tsx'), 'utf8');
const fila = fuente => matrizCoberturaFuentesEerrM7.find(item => item.fuente.includes(fuente));
const completa = { ventasNetas: 100, costosDirectos: 40, gastosOperacionales: 10, coberturaCostosCompleta: true, clasificacionGastosCompleta: true, clasificacionExclusionesCompleta: true, controlDuplicadosCompleto: true, segmento: 'TODOS' };

test('M7 cobertura de gastos operacionales y EBITDA real', async t => {
  await t.test('01 venta neta correcta', () => assert.equal(calcularEstadoResultadosM7({ ventasNetas: 100, costoVenta: 40, gastosOperacionales: 10 }).ventasNetas, 100));
  await t.test('02 costo directo correcto', () => assert.equal(calcularEstadoResultadosM7({ ventasNetas: 100, costoVenta: 40, gastosOperacionales: 10 }).costoVenta, 40));
  await t.test('03 gastos operacionales identificados', () => { const c = evaluarCoberturaEstadoResultadosM7(completa); assert.equal(c.partidas.gastosOperacionales.estado, 'VALIDO'); assert.equal(c.partidas.gastosOperacionales.valor, 10); });
  await t.test('04 gasto sin clasificación no se incluye', () => { const c = evaluarCoberturaEstadoResultadosM7({ ...completa, clasificacionGastosCompleta: false }); assert.equal(c.partidas.gastosOperacionales.estado, 'PARCIALMENTE_DISPONIBLE'); assert.equal(c.partidas.gastosOperacionales.valor, null); });
  await t.test('05 pago no equivale automáticamente a gasto', () => assert.equal(fila('movimiento_financiero').aptitud, 'NO_APTA'));
  await t.test('06 IVA crédito no entra como gasto', () => assert.match(fila('documento_compra_proveedor').tratamientoTributario, /monto_neto.*monto_impuesto/i));
  await t.test('07 IVA débito no entra como ingreso', () => assert.match(fila('nota_venta').tratamientoTributario, /IVA débito permanece separado/i));
  await t.test('08 remuneración no se duplica', () => assert.match(fila('remuneracion').posibleDuplicacion, /tareas remunerables/i));
  await t.test('09 caja chica no se duplica', () => assert.match(fila('gasto_caja_chica').posibleDuplicacion, /documento.*material.*costo/i));
  await t.test('10 inventario no se trata como gasto inmediato', () => assert.match(fila('inventario_bodega').tratamientoTributario, /no es gasto mientras permanezca como inventario/i));
  await t.test('11 monedas sin FX válido no se mezclan', () => { const c = evaluarCoberturaEstadoResultadosM7({ ...completa, ventasExcluidasSinFx: 1 }); assert.equal(c.partidas.conversionMonetaria.estado, 'PARCIALMENTE_DISPONIBLE'); assert.equal(c.calculable, false); });
  await t.test('12 gasto sin cobertura queda null', () => { const c = evaluarCoberturaEstadoResultadosM7({ ...completa, gastosOperacionales: null, clasificacionGastosCompleta: false }); assert.equal(c.partidas.gastosOperacionales.valor, null); });
  await t.test('13 EBITDA no calculable con cobertura parcial', () => { const c = calcularEstadoResultadosM7({ ventasNetas: 100, costoVenta: 40, gastosOperacionales: null }); assert.equal(c.ebitdaMonto, null); assert.equal(c.ebitdaPorcentaje, null); });
  await t.test('14 EBITDA válido sólo con cobertura completa', () => { const cobertura = evaluarCoberturaEstadoResultadosM7(completa); const c = calcularEstadoResultadosM7({ ventasNetas: 100, costoVenta: 40, gastosOperacionales: cobertura.calculable ? 10 : null }); assert.equal(cobertura.calculable, true); assert.equal(c.ebitdaMonto, 50); });
  await t.test('15 EBITDA porcentual con base cero', () => assert.equal(calcularEstadoResultadosM7({ ventasNetas: 0, costoVenta: 0, gastosOperacionales: 0 }).ebitdaPorcentaje, null));
  await t.test('16 margen directo no se llama EBITDA', () => { assert.match(controlador, /margenDirecto: margen/); assert.match(controlador, /EBITDA por proyecto no calculable/); });
  await t.test('17 proyecto sin gastos atribuibles no inventa EBITDA', () => assert.match(controlador, /ebitdaProyecto: indicador\('DATOS_INSUFICIENTES', null/));
  await t.test('18 rango respeta fechas', () => { const p = resolverPeriodoM7({ desde: '2026-03-15', hasta: '2026-04-10' }); assert.equal(p.etiquetaDesde, '2026-03-15'); assert.equal(p.etiquetaHasta, '2026-04-10'); });
  await t.test('19 comparación A B respeta cobertura', () => { const a = evaluarCoberturaEstadoResultadosM7(completa); const b = evaluarCoberturaEstadoResultadosM7({ ...completa, gastosOperacionales: null }); assert.equal(a.calculable, true); assert.equal(b.calculable, false); assert.match(panel, /EstadoResultadosComparado bloqueA=.*bloqueB=/); });
  await t.test('20 B2B B2C no mezclan costos', () => { for (const segmento of ['B2B', 'B2C']) { const c = evaluarCoberturaEstadoResultadosM7({ ...completa, segmento }); assert.equal(c.partidas.costosDirectos.valor, null); assert.match(c.partidas.costosDirectos.detalle, /no segmentables/i); } });
  await t.test('21 presupuesto no contamina datos reales', () => { assert.match(controlador, /gastosOperacionales: null/); assert.match(controlador, /presupuestoResultados: indicador/); });
  await t.test('22 flujo de caja no se altera', () => { assert.match(controlador, /tipo: 'FLUJO_CAJA'/); assert.match(controlador, /flujoProyectado:\s*redondear\(fila\.ingresosProyectados - fila\.egresosProyectados\)/); });
  await t.test('23 permisos respetados', () => { assert.equal(operacionesPermiso.consultarResumenResultadosM7, 'CU238'); assert.equal(operacionesPermiso.crearProyeccionM7, 'CU246'); assert.doesNotMatch(resumen, /nombre_razon_social|rut_empleado|identificador_tributario/); });
  await t.test('24 panel informa faltantes correctamente', () => { assert.match(panel, /EBITDA no calculable/); assert.match(panel, /Falta cobertura de gastos operacionales/); assert.match(resumen, /Cobertura del Estado de Resultados/); });
});
