const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');
const { Prisma } = require('@prisma/client');
const { prisma } = require('../dist/db');
const { M7Controller, resolverPrecioReferencialMaterialM7, calcularCantidadPendienteCompraM7, separarConsumoMaterialM7, matrizTrazabilidadInventarioM7, matrizCoberturaInventarioM7, resolverPeriodoM7 } = require('../dist/controladores/M7Controller');
const { operacionesPermiso, permiteOperacion } = require('../dist/validaciones/permisos');

const fuente = ruta => readFileSync(resolve(ruta), 'utf8');
const clp = valor => ({ precio_unitario: new Prisma.Decimal(valor), precio_unitario_convertido: null, tipo_cambio_usado: null, id_proveedor: 1, moneda: { codigo_moneda: 'CLP' } });
const usd = (valor, convertido, fx) => ({ precio_unitario: new Prisma.Decimal(valor), precio_unitario_convertido: convertido === null ? null : new Prisma.Decimal(convertido), tipo_cambio_usado: fx === null ? null : new Prisma.Decimal(fx), id_proveedor: 1, moneda: { codigo_moneda: 'USD' } });

test('M7 bloque 8 integración financiera con Inventario', async t => {
  await t.test('01 precio CLP válido conserva cero explícito', () => assert.deepEqual(resolverPrecioReferencialMaterialM7([clp(0)]).valor, 0));
  await t.test('02 moneda extranjera exige conversión y FX histórico', () => assert.equal(resolverPrecioReferencialMaterialM7([usd(10, 9000, 900)]).valor, 9000));
  await t.test('03 moneda extranjera sin FX no es valorizable', () => assert.equal(resolverPrecioReferencialMaterialM7([usd(10, 9000, null)]).valor, null));
  await t.test('04 moneda extranjera sin monto convertido no es valorizable', () => assert.equal(resolverPrecioReferencialMaterialM7([usd(10, null, 900)]).valor, null));
  await t.test('05 múltiples precios vigentes quedan ambiguos', () => assert.equal(resolverPrecioReferencialMaterialM7([clp(100), clp(100)]).estado, 'DATOS_INSUFICIENTES'));
  await t.test('06 material sin precio queda sin fuente', () => assert.equal(resolverPrecioReferencialMaterialM7([]).estado, 'FUENTE_NO_DISPONIBLE'));
  await t.test('07 OCS abierta calcula pendiente', () => assert.equal(calcularCantidadPendienteCompraM7(10, 4, 'abierta'), 6));
  await t.test('08 recepción total deja pendiente cero', () => assert.equal(calcularCantidadPendienteCompraM7(10, 10, 'abierta'), 0));
  await t.test('09 recepción superior no produce pendiente negativo', () => assert.equal(calcularCantidadPendienteCompraM7(10, 12, 'abierta'), 0));
  await t.test('10 compra anulada se excluye', () => assert.equal(calcularCantidadPendienteCompraM7(10, 0, 'anulada'), 0));
  await t.test('11 compra cerrada no se presenta como entrada futura', () => assert.equal(calcularCantidadPendienteCompraM7(10, 2, 'cerrada'), 0));
  await t.test('12 consumo real y estimado permanecen separados', () => assert.deepEqual(separarConsumoMaterialM7(12, 10), { consumoReal: 12, consumoEstimado: 10, diferencia: 2 }));
  await t.test('13 ausencia de consumo real conserva diferencia null', () => assert.equal(separarConsumoMaterialM7(null, 10).diferencia, null));
  await t.test('14 ausencia de estimación conserva diferencia null', () => assert.equal(separarConsumoMaterialM7(10, null).diferencia, null));

  const originales = { stock: prisma.inventario_bodega.findMany, precio: prisma.historial_precio_material.findMany, reserva: prisma.reserva_inventario.findMany };
  prisma.inventario_bodega.findMany = async () => [
    { material_sku: 'A', lote_id_lote: 1n, bodega_id_bodega: 1n, inventario_bodega_cantidad_fisica: new Prisma.Decimal(3), inventario_bodega_cantidad_reservada: new Prisma.Decimal(1), bodega: { bodega_nombre_bodega: 'Central' }, lote: { lote_numero_lote: 'L1' }, material: { material_nombre_material: 'Acero', material_unidad_medida: { material_unidad_medida_nombre: 'kg' }, material_categoria_general: null } },
    { material_sku: 'A', lote_id_lote: 2n, bodega_id_bodega: 1n, inventario_bodega_cantidad_fisica: new Prisma.Decimal(2), inventario_bodega_cantidad_reservada: new Prisma.Decimal(0), bodega: { bodega_nombre_bodega: 'Central' }, lote: { lote_numero_lote: 'L2' }, material: { material_nombre_material: 'Acero', material_unidad_medida: { material_unidad_medida_nombre: 'kg' }, material_categoria_general: null } },
    { material_sku: 'A', lote_id_lote: 1n, bodega_id_bodega: 2n, inventario_bodega_cantidad_fisica: new Prisma.Decimal(4), inventario_bodega_cantidad_reservada: new Prisma.Decimal(1), bodega: { bodega_nombre_bodega: 'Norte' }, lote: { lote_numero_lote: 'L1' }, material: { material_nombre_material: 'Acero', material_unidad_medida: { material_unidad_medida_nombre: 'kg' }, material_categoria_general: null } },
  ];
  prisma.historial_precio_material.findMany = async () => [{ material_sku: 'A', ...clp(100) }];
  prisma.reserva_inventario.findMany = async () => [{ material_sku: 'A', reserva_inventario_cantidad_reservada: new Prisma.Decimal(2) }];
  let inventario;
  try { inventario = await new M7Controller().consultarInventarioValorizado({ anio: 2026, mes: 10 }); }
  finally { prisma.inventario_bodega.findMany = originales.stock; prisma.historial_precio_material.findMany = originales.precio; prisma.reserva_inventario.findMany = originales.reserva; }
  await t.test('15 agrega stock físico de un SKU en varias bodegas', () => assert.equal(inventario.existencias[0].cantidadFisica, 9));
  await t.test('16 conserva múltiples lotes del mismo SKU', () => assert.equal(inventario.existencias[0].lotes, 2));
  await t.test('17 conserva dos bodegas sin sobrescribir cantidades', () => assert.equal(inventario.existencias[0].bodegas, 2));
  await t.test('18 detalle conserva la clave SKU-lote-bodega', () => assert.equal(new Set(inventario.detalleBodegaLote.map(f => f.clave)).size, 3));
  await t.test('19 reserva agregada no se descuenta dos veces', () => assert.equal(inventario.existencias[0].cantidadDisponibleDerivada, 7));
  await t.test('20 reserva detallada se usa sólo para conciliación', () => assert.equal(inventario.existencias[0].conciliacionReservas, 'COINCIDENTE'));
  await t.test('21 valorización referencial usa el stock físico actual', () => assert.equal(inventario.existencias[0].valorActualReferencial, 900));
  await t.test('22 stock actual no simula saldo histórico', () => assert.equal(inventario.naturalezaTemporal, 'ESTADO_ACTUAL'));
  await t.test('23 valorización histórica permanece no disponible', () => assert.equal(inventario.valorizacionHistorica.estado, 'FUENTE_NO_DISPONIBLE'));

  await t.test('24 trazabilidad declara clave compuesta de inventario', () => assert.match(matrizTrazabilidadInventarioM7[0].identificador, /lote_id_lote.*bodega_id_bodega/));
  await t.test('25 trazabilidad marca riesgo de duplicación de reservas', () => assert.match(matrizTrazabilidadInventarioM7.find(f => f.fuente.includes('reserva_inventario')).riesgoDuplicacion, /Alto/));
  await t.test('26 recepción M5 no prueba ingreso a bodega', () => assert.match(matrizTrazabilidadInventarioM7.find(f => f.fuente.includes('detalle_material')).brecha, /no prueba ingreso/i));
  await t.test('27 movimiento no tiene vínculo estructurado con OT', () => assert.equal(matrizTrazabilidadInventarioM7.find(f => f.fuente.includes('movimiento_inventario')).ordenTrabajo, null));
  await t.test('28 cobertura histórica de inventario no es calculable', () => assert.equal(matrizCoberturaInventarioM7.find(f => f.indicador === 'Valorización histórica').calculable, false));
  await t.test('29 rotación queda insuficiente sin clasificación autorizada', () => assert.equal(matrizCoberturaInventarioM7.find(f => f.indicador === 'Rotación').estado, 'DATOS_INSUFICIENTES'));

  const controlador = fuente('src/controladores/M7Controller.ts'); const bloque = controlador.slice(controlador.indexOf('async consultarCostosFabricacion'), controlador.indexOf('async consultarResumenResultados'));
  await t.test('30 costo estimado no sustituye consumo real', () => assert.doesNotMatch(bloque, /consumo_real\s*\?\?\s*material\.material_orden_trabajo_consumo_estimado/));
  await t.test('31 precio no usa convertido OR original', () => assert.doesNotMatch(bloque, /precio_unitario_convertido\s*\|\|\s*precio_unitario/));
  await t.test('32 traslado o ajuste no se infieren como consumo por regex', () => assert.doesNotMatch(bloque, /\/salida\|consumo\|egreso\/i/));
  await t.test('33 consultas M7 de inventario son sólo lectura', () => assert.doesNotMatch(bloque, /\.(?:create|update|delete|upsert)\s*\(/));
  await t.test('34 compra no se incorpora automáticamente como gasto', () => assert.match(controlador, /La compra no es gasto mientras permanezca como inventario/));
  await t.test('35 EBITDA conserva cobertura incompleta', () => assert.match(controlador, /gastosOperacionales:\s*null/));

  const permisos = { consultarInventarioValorizadoM7: 'CU254', consultarMaterialesProyectoOtM7: 'CU255', consultarRiesgoStockM7: 'CU256', consultarRotacionInventarioM7: 'CU257', consultarComprasRecepcionesM7: 'CU258' };
  let numero = 36; for (const [operacion, cu] of Object.entries(permisos)) await t.test(`${numero++} ${operacion} exige ${cu}`, () => { assert.equal(operacionesPermiso[operacion], cu); assert.equal(permiteOperacion(operacion, [cu]), true); assert.equal(permiteOperacion(operacion, ['CU215']), false); });

  await t.test('41 filtro Mes conserva corte mensual', () => assert.deepEqual(resolverPeriodoM7({ anio: 2026, mes: 10 }).etiquetaDesde, '2026-10-01'));
  await t.test('42 filtro Rango conserva fechas solicitadas', () => assert.deepEqual(resolverPeriodoM7({ desde: '2026-01-05', hasta: '2026-02-07' }).etiquetaHasta, '2026-02-07'));
  const vista = fuente('../Vistas/src/views/DashboardM7/DeltaControladoM7.tsx'); const panel = fuente('../Vistas/src/views/DashboardM7/PanelGeneralM7.tsx');
  await t.test('43 vista Control expone secciones A-H', () => { for (const texto of ['Existencias', 'Reservas', 'Entradas pendientes', 'Demanda productiva', 'Consumo de materiales', 'Valorización', 'Rotación y stock inmóvil', 'Cobertura de fuentes']) assert.match(vista, new RegExp(texto)); });
  await t.test('44 comparación no presenta falso saldo A/B', () => assert.match(vista, /no se comparan como saldos A\/B/));
  await t.test('45 Panel General etiqueta inventario como actual', () => assert.match(panel, /Inventario actual valorizado/));
  await t.test('46 Panel General muestra riesgo, sin precio e inmóvil', () => { assert.match(panel, /Sin precio/); assert.match(panel, /Con riesgo/); assert.match(panel, /Inmóvil verificable/); });
  await t.test('47 inventario compartido no se atribuye por B2B o B2C', () => assert.doesNotMatch(bloque, /resolverSegmentoComercialM7|perteneceSegmentoM7/));
  await t.test('48 no se creó migración 054 para este bloque', () => assert.equal(existsSync(resolve('prisma/migrations/054_m7_inventario')), false));
});
