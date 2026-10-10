const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { M7Controller, alinearSeriesPeriodosVentasM7, calcularComparacionPeriodosVentasM7, calcularConversionSegmentadaM7, calcularDesviacionFlujoM7, calcularEstadoResultadosM7, calcularFlujoRealM7, calcularPromedioTemporalVentasM7, calcularVariacionVentasM7, consolidarBucketVentasM7, convertirVentaClpM7, distribuirVentaPorProductoM7, generarClavesTemporalesVentasM7, resolverPeriodoM7, resolverSegmentoComercialM7, seleccionarGranularidadVentasM7, resumirVentasHistoricasM7 } = require('../dist/controladores/M7Controller');
const { operacionesPermiso } = require('../dist/validaciones/permisos');
const { CATALOGO_PRODUCTORES_M9 } = require('../dist/m9/contratoProductor');
const { crearInformeVentasExcelM7 } = require('../dist/m7/informeVentasExcel');
const ExcelJS = require('exceljs');

const permisos = ['CU215','CU218','CU219','CU220','CU230','CU238','CU242','CU247','CU250','CU253'];
const claves = datos => datos.meses.map(fila => fila.periodo);

test('M7 histórico gerencial de doce meses', async t => {
  const controlador = new M7Controller();
  const octubre = await controlador.consultarHistoricoPanelGeneral({ anio: 2026, mes: 10, meses: 12 }, permisos);
  const octubreComparativo = await controlador.consultarHistoricoPanelGeneral({ anio: 2026, mes: 10, meses: 13 }, permisos);
  const abril = await controlador.consultarHistoricoPanelGeneral({ anio: 2026, mes: 4, meses: 12 }, permisos);
  const vacio = await controlador.consultarHistoricoPanelGeneral({ anio: 2190, mes: 12, meses: 12 }, permisos);

  await t.test('devuelve exactamente doce períodos para octubre 2026', () => assert.deepEqual(claves(octubre), ['2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10']));
  await t.test('comparación interanual de octubre 2026 incluye octubre 2025 y conserva doce meses visibles', () => {
    assert.deepEqual(claves(octubreComparativo), ['2025-10','2025-11','2025-12','2026-01','2026-02','2026-03','2026-04','2026-05','2026-06','2026-07','2026-08','2026-09','2026-10']);
    assert.deepEqual(claves(octubreComparativo).slice(-12), claves(octubre));
    const fuente = readFileSync(resolve('../Vistas/src/views/DashboardM7/PanelGeneralM7.tsx'), 'utf8');
    assert.match(fuente, /historico\?anio=\$\{anio\}&mes=\$\{mes\}&meses=24/);
    assert.match(fuente, /mesesComparacion\.slice\(-12\)/);
    assert.match(fuente, /periodoAnual/);
  });
  await t.test('cambiar el corte desplaza la ventana completa', () => assert.deepEqual(claves(abril), ['2025-05','2025-06','2025-07','2025-08','2025-09','2025-10','2025-11','2025-12','2026-01','2026-02','2026-03','2026-04']));
  await t.test('orden cronológico estable', () => assert.deepEqual(claves(octubre), [...claves(octubre)].sort()));
  await t.test('mes sin hechos no fabrica costos ni resultado cero', () => { assert.ok(vacio.meses.every(fila => fila.ventasNetas === null && fila.costosDirectos === null && fila.resultadoGerencial === null)); });
  await t.test('cobertura evita falsa evolución CxC CxP Crédito e Inventario', () => { for (const clave of ['cuentasCobrar','cuentasPagar','credito','inventario']) assert.match(octubre.cobertura[clave], /histórico mensual|valor del corte/i); });
  await t.test('Resultado gerencial conserva cobertura limitada', () => assert.match(octubre.cobertura.resultadoGerencial, /costos directos atribuibles.*no es un Estado de Resultados/i));
  await t.test('permiso y ruta reutilizan CU215', () => { assert.equal(operacionesPermiso.consultarHistoricoPanelGeneralM7, 'CU215'); assert.match(readFileSync(resolve('src/rutas/finanzas.ts'), 'utf8'), /dashboard-m7\/historico/); });
  await t.test('frontend consume una fuente histórica acotada', () => { const fuente = readFileSync(resolve('../Vistas/src/views/DashboardM7/PanelGeneralM7.tsx'), 'utf8'); assert.match(fuente, /dashboard-m7\/historico/); assert.doesNotMatch(fuente, /Array\.from\(\{ length: 12 \}.*dashboard-m7/s); });
  await t.test('ventana inválida se rechaza', async () => assert.rejects(controlador.consultarHistoricoPanelGeneral({ anio: 2026, mes: 10, meses: 25 }, permisos), error => error.estado === 400));
});

test('M7 ventas comparativas de panel', async t => {
  const meses = [
    { periodo: '2025-01', ventasNetas: 100, ventasIncluidasClp: 1, ventasExcluidasSinTipoCambio: 0 },
    { periodo: '2025-09', ventasNetas: 900, ventasIncluidasClp: 1, ventasExcluidasSinTipoCambio: 0 },
    { periodo: '2026-01', ventasNetas: 150, ventasIncluidasClp: 1, ventasExcluidasSinTipoCambio: 0 },
    { periodo: '2026-08', ventasNetas: 800, ventasIncluidasClp: 1, ventasExcluidasSinTipoCambio: 0 },
    { periodo: '2026-09', ventasNetas: 1000, ventasIncluidasClp: 2, ventasExcluidasSinTipoCambio: 1 },
  ];
  const resumen = resumirVentasHistoricasM7(meses, 2026, 9);

  await t.test('MoM aplica diferencia sobre valor absoluto de la base', () => {
    assert.equal(resumen.mom, 25);
    assert.equal(calcularVariacionVentasM7(80, 100), -20);
  });
  await t.test('YoY compara contra el mismo mes del año anterior', () => assert.equal(resumen.yoy, 11.11));
  await t.test('base cero o ausente devuelve N/A representado por null', () => {
    assert.equal(calcularVariacionVentasM7(100, 0), null);
    assert.equal(calcularVariacionVentasM7(100, null), null);
  });
  await t.test('YTD usa enero hasta el mismo mes en ambos años', () => {
    assert.equal(resumen.acumuladoActual, 1950);
    assert.equal(resumen.acumuladoAnterior, 1000);
    assert.equal(resumen.variacionYtd, 95);
  });
  await t.test('multimoneda usa CLP directo, FX histórico y excluye sin tasa', () => {
    assert.equal(convertirVentaClpM7(100, 'CLP', null), 100);
    assert.equal(convertirVentaClpM7(100, 'USD', 900), 90000);
    assert.equal(convertirVentaClpM7(100, 'USD', null), null);
    assert.deepEqual(resumen.coberturaMes, { incluidas: 2, excluidasSinTipoCambio: 1 });
  });
  await t.test('gráfico conserva doce meses y compara ventas y resultado con el mismo mes anterior', () => {
    const panel = readFileSync(resolve('../Vistas/src/views/DashboardM7/PanelGeneralM7.tsx'), 'utf8');
    const graficos = readFileSync(resolve('../Vistas/src/views/DashboardM7/graficos.tsx'), 'utf8');
    assert.match(panel, /mesesComparacion\.slice\(-12\)/);
    assert.match(panel, /ventasAnioAnterior: ventaAnual/);
    assert.match(panel, /resultadoAnioAnterior: numero\(anual\?\.resultadoGerencial\)/);
    assert.match(panel, /mom: variacionPorcentual/);
    assert.match(panel, /yoy: variacionPorcentual/);
    assert.match(panel, /dashboard-m7\/ventas\?\$\{queryComercial\}/);
    assert.match(graficos, /GraficoComparativoMensual/);
  });
  await t.test('resultado anterior sin cobertura permanece sin dato y la línea conserva el corte', async () => {
    const sinCobertura = await new M7Controller().consultarHistoricoPanelGeneral({ anio: 2190, mes: 12, meses: 24 }, permisos);
    const graficos = readFileSync(resolve('../Vistas/src/views/DashboardM7/graficos.tsx'), 'utf8');
    assert.ok(sinCobertura.meses.every(fila => fila.resultadoGerencial === null));
    assert.match(graficos, /dataKey="resultadoAnioAnterior"[^]*connectNulls=\{false\}/);
  });
  await t.test('filtro de ventas mantiene año mes y ofrece rango accionable', () => {
    const fuente = readFileSync(resolve('../Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx'), 'utf8');
    assert.match(fuente, /<Periodo anio=\{q\.anio\} mes=\{q\.mes\}/);
    assert.match(fuente, /Aplicar rango/);
    assert.match(fuente, /Rango activo:/);
    assert.match(readFileSync(resolve('../Vistas/src/views/DashboardM7/filtrosTemporalesVentas.tsx'), 'utf8'), /Limpiar \/ Volver a vista mensual/);
  });
});

test('M7 comparación flexible entre períodos de ventas', async t => {
  const controlador = readFileSync(resolve('src/controladores/M7Controller.ts'), 'utf8');
  const filtros = readFileSync(resolve('../Vistas/src/views/DashboardM7/filtrosTemporalesVentas.tsx'), 'utf8');
  const analisis = readFileSync(resolve('../Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx'), 'utf8');
  const marzoJunio = alinearSeriesPeriodosVentasM7([{ periodo: '2026-03-01', ventaNetaClp: 100 }], [{ periodo: '2026-06-01', ventaNetaClp: 140 }], 'dia');
  await t.test('marzo vs junio conserva los días reales y la posición relativa', () => assert.deepEqual(marzoJunio, [{ posicion: 'Día 1', periodoA: '2026-03-01', ventaA: 100, periodoB: '2026-06-01', ventaB: 140, variacionPorcentual: 40 }]));
  await t.test('rango abril-mayo conserva fechas inclusivas', () => { const periodo = resolverPeriodoM7({ desde: '2026-04-01', hasta: '2026-05-31' }); assert.deepEqual([periodo.etiquetaDesde, periodo.etiquetaHasta], ['2026-04-01', '2026-05-31']); });
  await t.test('rango puede cruzar el cambio de año', () => { const periodo = resolverPeriodoM7({ desde: '2025-11-15', hasta: '2026-02-10' }); assert.equal(periodo.etiquetaDesde, '2025-11-15'); assert.equal(periodo.etiquetaHasta, '2026-02-10'); });
  await t.test('períodos de distinta duración publican total y promedio por separado', () => { assert.match(controlador, /duracionComparable/); assert.match(controlador, /promedioA/); assert.match(analisis, /distinta duración/); });
  await t.test('base A cero devuelve variación N/A como null', () => assert.deepEqual(calcularComparacionPeriodosVentasM7(0, 200), { diferenciaAbsoluta: 200, variacionPorcentual: null }));
  await t.test('segmento B2B se aplica a ambos períodos con la función owner', () => { assert.equal(resolverSegmentoComercialM7('B2B'), 'B2B'); assert.match(controlador, /const consultaA = \{ desde: consulta\.desdeA, hasta: consulta\.hastaA, segmento, _granularidad: granularidad \}/); });
  await t.test('FX faltante continúa excluido sin usar tasa actual', () => { assert.equal(convertirVentaClpM7(100, 'USD', null), null); assert.match(controlador, /ventasExcluidasSinTipoCambio/); });
  await t.test('URL persiste modo rangos A B y segmento', () => { for (const clave of ['modo', 'desdeA', 'hastaA', 'desdeB', 'hastaB']) assert.match(filtros, new RegExp(clave)); assert.match(analisis, /reemplazarParametros/); assert.match(analisis, /regreso=\{q\.global\}/); });
  await t.test('mes sobrante queda ausente y nunca se rellena con cero', () => { const serie = alinearSeriesPeriodosVentasM7([{ periodo: '2026-01', ventaNetaClp: 10 }, { periodo: '2026-02', ventaNetaClp: 20 }], [{ periodo: '2026-06', ventaNetaClp: 30 }]); assert.equal(serie[1].periodoB, null); assert.equal(serie[1].ventaB, null); });
});

test('M7 granularidad temporal adaptable', async t => {
  const graficos = readFileSync(resolve('../Vistas/src/views/DashboardM7/graficos.tsx'), 'utf8');
  await t.test('13 rango octubre completo selecciona granularidad diaria', () => assert.equal(seleccionarGranularidadVentasM7('2026-10-01', '2026-10-31'), 'dia'));
  await t.test('14 rango de 31 días produce 31 puntos y no una barra mensual', () => { const claves = generarClavesTemporalesVentasM7('2026-10-01', '2026-10-31'); assert.equal(claves.length, 31); assert.deepEqual([claves[0], claves.at(-1)], ['2026-10-01', '2026-10-31']); });
  await t.test('15 rango 15 abril a 20 mayo mantiene secuencia diaria continua', () => { const claves = generarClavesTemporalesVentasM7('2026-04-15', '2026-05-20'); assert.equal(claves.length, 36); assert.equal(claves[15], '2026-04-30'); assert.equal(claves[16], '2026-05-01'); });
  await t.test('16 rango que cruza año conserva todos los días y el año real', () => { const claves = generarClavesTemporalesVentasM7('2025-12-15', '2026-01-15'); assert.equal(claves.length, 32); assert.deepEqual([claves[16], claves[17]], ['2025-12-31', '2026-01-01']); });
  await t.test('17 septiembre vs octubre se alinea día contra día', () => { const serie = alinearSeriesPeriodosVentasM7([{ periodo: '2026-09-01', ventaNetaClp: 10 }], [{ periodo: '2026-10-01', ventaNetaClp: 20 }], 'dia'); assert.equal(serie[0].posicion, 'Día 1'); });
  await t.test('18 septiembre 30 días vs octubre 31 deja el día sobrante como null', () => { const a = generarClavesTemporalesVentasM7('2026-09-01', '2026-09-30').map(periodo => ({ periodo, ventaNetaClp: 1 })); const b = generarClavesTemporalesVentasM7('2026-10-01', '2026-10-31').map(periodo => ({ periodo, ventaNetaClp: 1 })); const serie = alinearSeriesPeriodosVentasM7(a, b, 'dia'); assert.equal(serie.length, 31); assert.equal(serie[30].periodoA, null); assert.equal(serie[30].ventaA, null); });
  await t.test('19 comparación A B usa dos líneas del mismo tipo', () => { const bloque = graficos.slice(graficos.indexOf('export function GraficoPeriodosVentas'), graficos.indexOf('function TooltipRangoVentas')); assert.equal((bloque.match(/<Line /g) || []).length, 2); assert.doesNotMatch(bloque, /<Bar /); });
  await t.test('20 tooltip comparativo muestra ambas fechas reales', () => { assert.match(graficos, /fechaCompleta\(String\(periodo\)\)/); assert.match(graficos, /item\('Período A', fila\.periodoA/); assert.match(graficos, /item\('Período B', fila\.periodoB/); });
  await t.test('21 períodos mayores a 62 días cambian a granularidad mensual', () => { assert.equal(seleccionarGranularidadVentasM7('2026-01-01', '2026-09-30'), 'mes'); assert.equal(generarClavesTemporalesVentasM7('2026-01-01', '2026-09-30').length, 9); });
  await t.test('22 distinta duración calcula el promedio diario o mensual correcto', () => { assert.equal(calcularPromedioTemporalVentasM7(300, 30), 10); assert.equal(calcularPromedioTemporalVentasM7(700, 7), 100); });
  await t.test('23 ausencia real de ventas se representa como cero', () => assert.deepEqual(consolidarBucketVentasM7([]), { ventaNetaClp: 0, ventasIncluidasClp: 0, ventasExcluidasSinTipoCambio: 0 }));
  await t.test('24 falta de cobertura FX permanece null y no se transforma en cero', () => assert.deepEqual(consolidarBucketVentasM7([null]), { ventaNetaClp: null, ventasIncluidasClp: 0, ventasExcluidasSinTipoCambio: 1 }));
});

test('M7 segmentación comercial y productos', async t => {
  const cotizaciones = [{ segmento: 'B2B', convertida: true }, { segmento: 'B2B', convertida: false }, { segmento: 'B2C', convertida: true }];
  const detalles = [{ producto: 'Strong', segmento: 'B2C', cantidad: 3, subtotal: 600 }, { producto: 'Bunker', segmento: 'B2C', cantidad: 2, subtotal: 400 }];
  await t.test('filtro B2B usa la clasificación owner normalizada', () => assert.equal(resolverSegmentoComercialM7('b2b'), 'B2B'));
  await t.test('filtro B2C usa la clasificación owner normalizada', () => assert.equal(resolverSegmentoComercialM7(' B2C '), 'B2C'));
  await t.test('TODOS conserva el universo general', () => assert.deepEqual(calcularConversionSegmentadaM7(cotizaciones, 'TODOS'), { totalCotizaciones: 3, convertidas: 2, tasaPorcentual: 66.67 }));
  await t.test('conversión se calcula por cantidad dentro del segmento', () => assert.deepEqual(calcularConversionSegmentadaM7(cotizaciones, 'B2B'), { totalCotizaciones: 2, convertidas: 1, tasaPorcentual: 50 }));
  await t.test('unidades usa cantidad real del detalle', () => assert.equal(distribuirVentaPorProductoM7(1000, detalles).reduce((total, fila) => total + fila.cantidad, 0), 5));
  await t.test('múltiples detalles no duplican el neto de la NV', () => assert.equal(distribuirVentaPorProductoM7(1000, detalles).reduce((total, fila) => total + fila.ventaNetaClp, 0), 1000));
  await t.test('valor se prorratea según peso de subtotales', () => assert.deepEqual(distribuirVentaPorProductoM7(1000, detalles).map(fila => fila.ventaNetaClp), [600, 400]));
  await t.test('participaciones del prorrateo suman aproximadamente 100%', () => { const filas = distribuirVentaPorProductoM7(1000, detalles); assert.equal(filas.reduce((total, fila) => total + fila.ventaNetaClp / 1000 * 100, 0), 100); });
  await t.test('valor extranjero usa exclusivamente FX histórico', () => assert.equal(convertirVentaClpM7(100, 'USD', 925), 92500));
  await t.test('sin FX se excluye valor pero se conservan unidades', () => { const filas = distribuirVentaPorProductoM7(null, detalles); assert.equal(filas.reduce((total, fila) => total + fila.cantidad, 0), 5); assert.ok(filas.every(fila => fila.ventaNetaClp === null)); });
  await t.test('segmento sin resultados y rango combinado permanecen accionables', () => { assert.deepEqual(calcularConversionSegmentadaM7([], 'B2C'), { totalCotizaciones: 0, convertidas: 0, tasaPorcentual: null }); const vista = readFileSync(resolve('../Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx'), 'utf8'); assert.match(vista, /cambiarSegmento/); assert.match(vista, /parametrosTemporalesVentas\(filtros\)/); });
});

test('M7 exportación Excel detallada', async t => {
  const generadoEn = new Date('2026-10-09T15:30:00Z');
  const ventas = [
    { fechaVenta: new Date('2026-09-03T00:00:00Z'), idNotaVenta: 10, numeroNotaVenta: 'NV-10', idCotizacion: 20, cliente: 'Cliente B2B', rutCliente: '76.000.000-1', segmento: 'B2B', producto: 'Puerta Strong', descripcion: 'Modelo owner', cantidad: 2, moneda: 'USD', ventaNetaOriginalItem: 600, tipoCambioHistorico: 925, ventaNetaClpItem: 555000, ventaNetaOriginalNota: 1000, estadoNotaVenta: 'confirmada', idProyecto: 30, codigoProyecto: 'PROY-30' },
    { fechaVenta: new Date('2026-09-03T00:00:00Z'), idNotaVenta: 10, numeroNotaVenta: 'NV-10', idCotizacion: 20, cliente: 'Cliente B2B', rutCliente: '76.000.000-1', segmento: 'B2B', producto: 'Puerta Bunker', descripcion: 'Segundo detalle', cantidad: 1, moneda: 'USD', ventaNetaOriginalItem: 400, tipoCambioHistorico: 925, ventaNetaClpItem: 370000, ventaNetaOriginalNota: 1000, estadoNotaVenta: 'confirmada', idProyecto: 30, codigoProyecto: 'PROY-30' },
  ];
  const archivo = await crearInformeVentasExcelM7({ tipo: 'VENTAS', periodo: '2026-09-01 al 2026-09-30', segmento: 'B2B', generadoEn, filas: ventas, nombreArchivo: 'PuertasBlindadas_Ventas_2026-09-01_2026-09-30_B2B.xlsx' });
  const base64 = archivo.contenido.split(',')[1];
  const buffer = Buffer.from(base64, 'base64');
  const libro = new ExcelJS.Workbook(); await libro.xlsx.load(buffer);
  const hoja = libro.getWorksheet('Ventas');
  const archivoCotizaciones = await crearInformeVentasExcelM7({ tipo: 'COTIZACIONES', periodo: '2026-09-01 al 2026-09-30', segmento: 'B2C', generadoEn, filas: [{ fechaEmision: new Date('2026-09-04T00:00:00Z'), idCotizacion: 21, cliente: 'Cliente B2C', rutCliente: '12.345.678-9', segmento: 'B2C', producto: 'Puerta Bunker', descripcion: 'Descripción owner', cantidad: 2, valorUnitario: 250000, subtotalDetalle: 500000, moneda: 'CLP', montoNetoCotizacion: 500000, montoIvaCotizacion: 95000, montoTotalCotizacion: 595000, estadoCotizacion: 'emitida', fechaVigencia: new Date('2026-10-04T00:00:00Z'), convertidaNotaVenta: 'No', idNotaVenta: null }], nombreArchivo: 'PuertasBlindadas_Cotizaciones_2026-09-01_2026-09-30_B2C.xlsx' });
  const libroCotizaciones = new ExcelJS.Workbook(); await libroCotizaciones.xlsx.load(Buffer.from(archivoCotizaciones.contenido.split(',')[1], 'base64'));
  const hojaCotizaciones = libroCotizaciones.getWorksheet('Cotizaciones');
  const controlador = readFileSync(resolve('src/controladores/M7Controller.ts'), 'utf8');
  const vista = readFileSync(resolve('../Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx'), 'utf8');

  await t.test('produce un XLSX real y un nombre descriptivo', () => { assert.equal(buffer.subarray(0, 2).toString(), 'PK'); assert.match(archivo.nombre, /^PuertasBlindadas_Ventas_.*\.xlsx$/); });
  await t.test('incluye metadatos de período segmento y fecha', () => { assert.equal(hoja.getCell('B2').value, '2026-09-01 al 2026-09-30'); assert.equal(hoja.getCell('B3').value, 'B2B'); assert.ok(hoja.getCell('B4').value instanceof Date); });
  await t.test('genera una fila por detalle comercial sin agrupar', () => assert.equal(hoja.rowCount, 8));
  await t.test('mantiene fechas y montos como valores tipados', () => { assert.ok(hoja.getCell('A7').value instanceof Date); assert.equal(typeof hoja.getCell('J7').value, 'number'); assert.equal(typeof hoja.getCell('N7').value, 'number'); });
  await t.test('conserva filtro y encabezado congelado', () => { assert.ok(hoja.autoFilter); assert.equal(hoja.views[0].ySplit, 6); });
  await t.test('el neto prorrateado no duplica la nota de venta', () => assert.equal(Number(hoja.getCell('L7').value) + Number(hoja.getCell('L8').value), 1000));
  await t.test('usa FX histórico y conserva el valor CLP por ítem', () => { assert.equal(hoja.getCell('M7').value, 925); assert.equal(hoja.getCell('N7').value, 555000); });
  await t.test('backend aplica rango segmento estados definitivos y deja FX faltante sin CLP', () => { assert.match(controlador, /fecha_emision: \{ gte: periodo\.desde, lt: periodo\.hastaExclusiva \}/); assert.match(controlador, /perteneceSegmentoM7/); assert.match(controlador, /estado_nota_venta: \{ in: estadosVentaDefinitiva \}/); assert.match(controlador, /const montoClp = convertirVentaClpM7/); });
  await t.test('reutiliza CU245 y registra el evento M9 requerido', () => { assert.equal(operacionesPermiso.descargarExcelDashboardM7, 'CU245'); assert.equal(CATALOGO_PRODUCTORES_M9.descargarExcelDashboardM7.operacion, 'EXPORTACION_DASHBOARD_EXCEL'); });
  await t.test('cotizaciones y UI cubren selección carga error y cancelación', () => { assert.equal(hojaCotizaciones.getCell('A7').value instanceof Date, true); assert.equal(hojaCotizaciones.getCell('P7').value instanceof Date, true); assert.equal(hojaCotizaciones.getCell('Q7').value, 'No'); assert.match(vista, /Exportar Excel/); assert.match(vista, /'VENTAS'[^]*'COTIZACIONES'/); assert.match(vista, /Generando Excel/); assert.match(vista, /role="alert"/); assert.match(vista, /Cancelar/); });
});

test('M7 Estado de Resultados gerencial y EBITDA', async t => {
  const completo = calcularEstadoResultadosM7({ ventasNetas: 1000, costoVenta: 400, gastosOperacionales: 200 });
  const controlador = readFileSync(resolve('src/controladores/M7Controller.ts'), 'utf8');
  const vista = readFileSync(resolve('../Vistas/src/views/DashboardM7/ResumenesM7.tsx'), 'utf8');

  await t.test('ventas usa la fuente neta sin IVA', () => {
    assert.match(controlador, /montoNeto/);
    assert.doesNotMatch(controlador, /\/\s*1[,.]19/);
  });
  await t.test('costo directo produce margen bruto', () => assert.equal(completo.margenBruto, 600));
  await t.test('gasto operacional se descuenta una sola vez', () => assert.equal(completo.ebitdaMonto, 400));
  await t.test('EBITDA con cobertura completa aplica ventas menos costo menos gastos', () => assert.deepEqual({ margen: completo.margenBruto, ebitda: completo.ebitdaMonto }, { margen: 600, ebitda: 400 }));
  await t.test('EBITDA porcentaje se calcula sobre ventas netas', () => assert.equal(completo.ebitdaPorcentaje, 40));
  await t.test('ventas cero devuelve porcentaje N/A como null', () => assert.equal(calcularEstadoResultadosM7({ ventasNetas: 0, costoVenta: 0, gastosOperacionales: 0 }).ebitdaPorcentaje, null));
  await t.test('cobertura parcial no publica EBITDA falso', () => {
    const parcial = calcularEstadoResultadosM7({ ventasNetas: 1000, costoVenta: 400, gastosOperacionales: null });
    assert.equal(parcial.margenBruto, 600); assert.equal(parcial.ebitdaMonto, null); assert.equal(parcial.ebitdaPorcentaje, null);
    assert.match(vista, /EBITDA[^]*No calculable/);
  });
  await t.test('IVA usa campos owner y permanece en bloque separado', () => {
    assert.match(controlador, /documento_tributario\.findMany/); assert.match(controlador, /documento_compra_proveedor\.findMany/); assert.match(controlador, /monto_impuesto/);
    assert.match(vista, /IVA estimado/); assert.match(vista, /No constituye declaración oficial SII/);
  });
});

test('M7 flujo real, compromisos y presupuesto', async t => {
  const fuente = readFileSync(resolve('src/controladores/M7Controller.ts'), 'utf8');
  const flujo = calcularFlujoRealM7([{ monto: 1000, naturaleza: 'ingreso' }, { monto: 300, naturaleza: 'egreso' }, { monto: 50, naturaleza: 'ingreso', ajuste: true }, { monto: 20, naturaleza: 'egreso', ajuste: true }]);
  await t.test('flujo real aplica entradas menos salidas', () => assert.equal(flujo.flujoReal, 730));
  await t.test('clasifica ingreso y egreso reales', () => assert.deepEqual([flujo.ingresosReales, flujo.egresosReales], [1000, 300]));
  await t.test('clasifica ajustes de entrada y salida', () => assert.deepEqual([flujo.ajustesEntrada, flujo.ajustesSalida], [50, 20]));
  await t.test('proyección owner usa CxC M3 y CxP M5', () => { assert.match(fuente, /owner: 'M3'/); assert.match(fuente, /owner: 'M5'/); });
  await t.test('compromisos sin fecha o monto válido quedan fuera', () => assert.match(fuente, /typeof fila\.fecha === 'string'.*Number\(fila\.monto\) > 0/));
  await t.test('real vs proyectado calcula diferencia', () => assert.deepEqual(calcularDesviacionFlujoM7(120, 100), { diferencia: 20, diferenciaPorcentual: 20 }));
  await t.test('base proyectada cero deja porcentaje N/A', () => assert.equal(calcularDesviacionFlujoM7(120, 0).diferenciaPorcentual, null));
  await t.test('mantenedor reutiliza CU246', () => { for (const operacion of ['crearProyeccionM7','actualizarProyeccionM7','desactivarProyeccionM7']) assert.equal(operacionesPermiso[operacion], 'CU246'); });
  await t.test('modificaciones se auditan por M9', () => { assert.equal(CATALOGO_PRODUCTORES_M9.actualizarProyeccionM7.operacion, 'PROYECCION_FINANCIERA_ACTUALIZADA'); assert.equal(CATALOGO_PRODUCTORES_M9.desactivarProyeccionM7.modulo, 'M7'); });
  await t.test('Caja Chica entra sólo mediante movimiento financiero', () => { assert.match(fuente, /idsCajaConMovimiento/); assert.match(fuente, /cajaSinMovimiento/); assert.doesNotMatch(fuente, /movimientos\.concat\(gastosCaja/); });
});
