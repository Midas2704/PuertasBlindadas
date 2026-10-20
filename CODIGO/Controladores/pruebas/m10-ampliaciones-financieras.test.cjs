const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const ExcelJS = require('exceljs');
const { resumirVentasHistoricasM7, resolverEbitdaSeguroM10, compararPartidaRealM10 } = require('../dist/controladores/M7Controller');
const { crearInformeVentasExcelM7, neutralizarFormulaExcelM10 } = require('../dist/m7/informeVentasExcel');
const { validarPresupuestoManualM10, compararVersionesPresupuestoM10 } = require('../dist/m10/presupuestoManualM10');
const { operacionesPermiso, permisosDeOperacion } = require('../dist/validaciones/permisos');

const raiz = archivo => readFileSync(resolve(archivo), 'utf8');
const mesesPresupuesto = () => Array.from({ length: 12 }, (_, indice) => ({
  mes: indice + 1,
  resultados: { VENTAS_NETAS: 1000, COSTOS_DIRECTOS: 500, GASTOS_OPERACIONALES: 100 },
  flujoCaja: { INGRESOS_OPERACIONALES: 900, OTROS_INGRESOS: 10, PROVEEDORES: 300, REMUNERACIONES: 200, IMPUESTOS: 50, OTROS_EGRESOS: 20 },
}));

test('CU446 calcula MoM, YoY, diferencias firmadas y YTD al mismo corte', () => {
  const resumen = resumirVentasHistoricasM7([
    { periodo:'2025-01', ventasNetas:100, ventasIncluidasClp:1, ventasExcluidasSinTipoCambio:0 },
    { periodo:'2025-09', ventasNetas:900, ventasIncluidasClp:1, ventasExcluidasSinTipoCambio:0 },
    { periodo:'2026-01', ventasNetas:150, ventasIncluidasClp:1, ventasExcluidasSinTipoCambio:0 },
    { periodo:'2026-08', ventasNetas:800, ventasIncluidasClp:1, ventasExcluidasSinTipoCambio:0 },
    { periodo:'2026-09', ventasNetas:1000, ventasIncluidasClp:2, ventasExcluidasSinTipoCambio:1 },
  ], 2026, 9);
  assert.equal(resumen.mom, 25); assert.equal(resumen.yoy, 11.11);
  assert.equal(resumen.diferenciaMom, 200); assert.equal(resumen.diferenciaYoY, 100);
  assert.equal(resumen.acumuladoActual, 1950); assert.equal(resumen.acumuladoAnterior, 1000);
  assert.equal(resumen.diferenciaYtd, 950); assert.equal(resumen.variacionYtd, 95);
  assert.equal(resumen.extrapolado, false); assert.equal(resumen.coberturaMes.excluidasSinTipoCambio, 1);
});

test('CU446 no fabrica variación cuando la base es cero y marca el mes en curso como parcial', () => {
  const resumen = resumirVentasHistoricasM7([
    { periodo:'2026-09', ventasNetas:0, ventasIncluidasClp:1, ventasExcluidasSinTipoCambio:0 },
    { periodo:'2026-10', ventasNetas:100, ventasIncluidasClp:1, ventasExcluidasSinTipoCambio:0 },
  ], 2026, 10);
  assert.equal(resumen.mom, null); assert.equal(resumen.periodoParcial, true); assert.equal(resumen.extrapolado, false);
});

test('CU447 y CUT448 mantienen poblaciones separadas y neutralizan fórmulas sin exponer RUT', async () => {
  assert.equal(neutralizarFormulaExcelM10('=HYPERLINK("x")'), "'=HYPERLINK(\"x\")");
  const salida = await crearInformeVentasExcelM7({
    tipo:'COTIZACIONES', periodo:'2026-10', segmento:'B2B', generadoEn:new Date('2026-10-20T12:00:00Z'), nombreArchivo:'Cotizaciones 2026/10.xlsx', incluirRut:false,
    filas:[{ fechaEmision:new Date('2026-10-01T00:00:00Z'), idCotizacion:1, cliente:'=2+2', rutCliente:'11.111.111-1', segmento:'B2B', producto:'Puerta', descripcion:'Segura', cantidad:1, valorUnitario:100, subtotalDetalle:100, moneda:'CLP', montoNetoCotizacion:100, montoIvaCotizacion:19, montoTotalCotizacion:119, estadoCotizacion:'BORRADOR', fechaVigencia:null, convertidaNotaVenta:'NO', idNotaVenta:null }],
  });
  const libro = new ExcelJS.Workbook(); await libro.xlsx.load(Buffer.from(salida.contenido.split(',')[1], 'base64'));
  const hoja = libro.worksheets[0]; const encabezados = hoja.getRow(6).values.slice(1);
  assert.equal(hoja.name, 'Cotizaciones'); assert.equal(encabezados.includes('RUT cliente'), false);
  assert.equal(hoja.getRow(7).getCell(3).value, "'=2+2");
  assert.match(salida.nombre, /^Cotizaciones_2026_10\.xlsx$/i);
});

test('CUT450 mantiene el gate económico cerrado por defecto y sólo calcula con validación explícita', () => {
  const base = { ventasNetas:1000, costosDirectos:400, gastosOperacionales:200, ventasExcluidasSinFx:0, costosExcluidosSinFx:0, coberturaCostosCompleta:true, clasificacionGastosCompleta:true, clasificacionExclusionesCompleta:true, controlDuplicadosCompleto:true, segmento:'TODOS' };
  const cerrado = resolverEbitdaSeguroM10(base); assert.equal(cerrado.estado, 'CONFIGURACION_PENDIENTE'); assert.equal(cerrado.calculable, false); assert.equal(cerrado.monto, null);
  const valido = resolverEbitdaSeguroM10({ ...base, contratoEconomicoValidado:true }); assert.equal(valido.estado, 'VALIDO'); assert.equal(valido.monto, 400); assert.equal(valido.porcentaje, 40);
  const parcial = resolverEbitdaSeguroM10({ ...base, controlDuplicadosCompleto:false, contratoEconomicoValidado:true }); assert.equal(parcial.calculable, false); assert.equal(parcial.monto, null);
  const cero = resolverEbitdaSeguroM10({ ...base, ventasNetas:0, contratoEconomicoValidado:true }); assert.equal(cero.calculable, true); assert.equal(cero.porcentaje, null);
});

test('CU451 exige un plan anual completo y conserva moneda, resultados y flujo separados', () => {
  const validado = validarPresupuestoManualM10({ anio:2027, ambito:'GENERAL', moneda:'CLP', meses:mesesPresupuesto() });
  assert.equal(validado.partidas.length, 108); assert.equal(validado.partidas.filter(item=>item.tipo==='RESULTADOS').length, 36); assert.equal(validado.partidas.filter(item=>item.tipo==='FLUJO_CAJA').length, 72);
  assert.throws(() => validarPresupuestoManualM10({ anio:2027, meses:mesesPresupuesto().slice(0, 11) }), /12 meses/);
  assert.throws(() => validarPresupuestoManualM10({ anio:2027, moneda:'USD', meses:mesesPresupuesto() }), /contrato FX/);
  const negativos = mesesPresupuesto(); negativos[0].resultados.VENTAS_NETAS = -1;
  assert.throws(() => validarPresupuestoManualM10({ anio:2027, meses:negativos }), /no negativo/);
});

test('CU451 compara original y revisión sin alterar ninguna versión', () => {
  const original={detalles:[{mes:1,tipo:'RESULTADOS',categoria:'VENTAS_NETAS',monto:100}]};
  const revision={detalles:[{mes:1,tipo:'RESULTADOS',categoria:'VENTAS_NETAS',monto:125}]};
  const antes=JSON.stringify(original); const diferencias=compararVersionesPresupuestoM10(original,revision);
  assert.deepEqual(diferencias[0],{mes:1,tipo:'RESULTADOS',categoria:'VENTAS_NETAS',versionA:100,versionB:125,diferencia:25,variacionPorcentual:25});
  assert.equal(JSON.stringify(original),antes);
});

test('M4 registra capacidades humanas M10 y no convierte CUT448/CUT450 en permisos', () => {
  assert.equal(operacionesPermiso.consultarVentasAmpliadasM10,'CU446'); assert.equal(operacionesPermiso.descargarExcelDashboardM7,'CU447');
  assert.equal(operacionesPermiso.consultarAnalisisVentasM7,'CU219'); assert.deepEqual(permisosDeOperacion('consultarAnalisisVentasM7'),['CU219','CU218','CU220']);
  assert.equal(operacionesPermiso.consultarResumenResultadosM7,'CU238'); assert.deepEqual(permisosDeOperacion('consultarResumenResultadosM7'),['CU238','CU449']); assert.equal(operacionesPermiso.crearPresupuestoM10,'CU451');
  const migracion=raiz('prisma/migrations/072_m10_ampliaciones_financieras/migration.sql');
  for(const codigo of ['CU446','CU447','CU449','CU451']) assert.match(migracion,new RegExp(codigo));
  assert.doesNotMatch(migracion,/\('CUT448'|\('CUT450'/); assert.match(migracion,/CU377 permanece excluido/);
});

test('CU451 usa permisos owner reales y representa cada fuente sin filtrar datos', () => {
  const fachada=raiz('src/controladores/C_Finanzas.ts'); const controlador=raiz('src/controladores/M7Controller.ts');
  assert.match(fachada,/compararPresupuestoRealM10\([^\n]+actor\.permisos/);
  assert.doesNotMatch(controlador,/\['CU219','CU230'\]/);
  assert.match(controlador,/SIN_PERMISO/); assert.match(controlador,/DATOS_INSUFICIENTES/);
  assert.deepEqual(compararPartidaRealM10(100,null,'SIN_PERMISO'),{presupuesto:100,real:null,diferencia:null,variacionPorcentual:null,estado:'SIN_PERMISO'});
  assert.deepEqual(compararPartidaRealM10(100,125,'VALIDO'),{presupuesto:100,real:125,diferencia:25,variacionPorcentual:25,estado:'VALIDO'});
});

test('M9 audita sólo exportación y mutaciones presupuestarias relevantes', () => {
  const contrato=raiz('src/m9/contratoProductor.ts');
  assert.match(contrato,/descargarExcelDashboardM7/); assert.match(contrato,/crearPresupuestoM10/); assert.match(contrato,/revisarPresupuestoM10/);
  assert.doesNotMatch(contrato,/compararPresupuestoRealM10/);
});

test('migración 072 es aditiva, inmutable y protege concurrencia e históricos', () => {
  const sql=raiz('prisma/migrations/072_m10_ampliaciones_financieras/migration.sql');
  assert.match(sql,/CREATE TABLE "finanzas"\."presupuesto_manual_m10"/); assert.match(sql,/CREATE TABLE "finanzas"\."version_presupuesto_m10"/);
  assert.match(sql,/ON DELETE RESTRICT/g); assert.match(sql,/UNIQUE \("id_presupuesto_manual_m10","numero_version"\)/);
  assert.doesNotMatch(sql,/\b(?:DROP|TRUNCATE|DELETE FROM)\b/i);
  const servicio=raiz('src/m10/presupuestoManualM10.ts'); assert.match(servicio,/TransactionIsolationLevel\.Serializable/); assert.match(servicio,/revisionEsperada/);
});

test('frontend integra CU446, CU447, CU449 y CU451 sin segundo Dashboard', () => {
  const app=raiz('../Vistas/src/App.tsx'); const ventas=raiz('../Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx'); const presupuesto=raiz('../Vistas/src/views/DashboardM7/PresupuestoManualM10.tsx');
  assert.match(app,/permiso=\{\['CU218','CU219','CU220'\]\}/); assert.match(app,/permiso=\{\['CU238','CU449','CU239'\]\}/); assert.match(app,/permiso="CU451"/);
  assert.match(ventas,/CU447/); assert.match(ventas,/Ventas.*Cotizaciones/s); assert.match(presupuesto,/Presupuesto manual versionado/); assert.match(presupuesto,/Comparar versiones elegidas/); assert.match(presupuesto,/sólo lectura/);
});
