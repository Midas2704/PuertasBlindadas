const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { prepararTrazabilidadOrdenCompraM11 } = require('../dist/comercial/ServicioTrazabilidadComercialM11');

const raiz = join(__dirname, '..');
const leer = ruta => readFileSync(join(raiz, ruta), 'utf8');
const detalles = [{ id_detalle_cotizacion: 11, id_cotizacion: 7 }, { id_detalle_cotizacion: 12, id_cotizacion: 7 }];
const oferta = { productos: [
  { idDetalleCotizacion: 11, idProductoComercial: 101, idVersionProducto: 1001, codigo: 'P-A', nombre: 'Puerta A', cantidad: 2, precioUnitario: 1000 },
  { idDetalleCotizacion: 12, idProductoComercial: 102, idVersionProducto: 1002, codigo: 'P-B', nombre: 'Puerta B', cantidad: 1, precioUnitario: 2500 },
] };
const linea = (cambio = {}) => ({ numeroLinea: 1, idDetalleCotizacion: 11, referenciaComercial: 'OC-L1', concepto: 'Puerta A', cantidad: 2, idMoneda: 1, precioUnitario: 1000, ...cambio });

test('M11 Comercial Fase 1 · CUT452-CUT455', async t => {
  await t.test('01 conserva tres ofertas sucesivas de una negociación', () => {
    const schema = leer('prisma/schema.prisma');
    const servicio = leer('src/comercial/documentos/ServicioDocumentosComerciales.ts');
    assert.match(schema, /@@unique\(\[id_cotizacion, numero_version_comercial\]/);
    assert.match(servicio, /numeroVersion = \(ultimo\._max\.numero_version_comercial \?\? 0\) \+ 1/);
    assert.match(servicio, /ofertaSucesivaB2B/);
    const versiones = [1, 2, 3];
    assert.deepEqual(versiones, [1, 2, 3]);
  });

  await t.test('02 acepta una oferta anterior sin elegir automáticamente la última', () => {
    const controlador = leer('src/controladores/M2Controller.ts');
    assert.match(controlador, /idVersionOfertaAceptada/);
    assert.match(controlador, /id_cotizacion_version:idVersionOferta/);
    assert.doesNotMatch(controlador, /ofertaAceptada[\s\S]{0,120}orderBy:\{numero_version_comercial:'desc'\}/);
  });

  await t.test('03 reactivar no crea una oferta comercial artificial', () => {
    const controlador = leer('src/controladores/M2Controller.ts');
    const bloque = controlador.slice(controlador.indexOf('async reactivarCotizacion'), controlador.indexOf('async formalizarClienteB2C'));
    assert.match(bloque, /Reactivación de Cotización vencida/);
    assert.doesNotMatch(bloque, /numero_version_comercial|tipo_version|id_documento_logico/);
  });

  await t.test('04 una OC multilínea conserva dos líneas y no crea una NV por línea', () => {
    const resultado = prepararTrazabilidadOrdenCompraM11([linea(), linea({ numeroLinea: 2, idDetalleCotizacion: 12, cantidad: 1, precioUnitario: 2500 })], 7, detalles, oferta, 1);
    assert.equal(resultado.estado, 'COINCIDE');
    assert.equal(resultado.lineas.length, 2);
    const controlador = leer('src/controladores/M2Controller.ts');
    const bloque = controlador.slice(controlador.indexOf('async aprobarCotizacionB2B'), controlador.indexOf('async consultarTrazabilidadComercialM11'));
    assert.equal((bloque.match(/tx\.nota_venta\.create/g) || []).length, 1);
  });

  await t.test('05 informa discrepancias de cantidad y precio sin mutar originales', () => {
    const entrada = [linea({ cantidad: 3, precioUnitario: 900 })];
    const original = structuredClone(entrada);
    const resultado = prepararTrazabilidadOrdenCompraM11(entrada, 7, detalles, oferta, 1);
    assert.equal(resultado.estado, 'DISCREPANCIA');
    assert.deepEqual(resultado.lineas[0].resultadoCotejo.discrepancias.map(x => x.campo), ['cantidad', 'precio_unitario']);
    assert.deepEqual(entrada, original);
  });

  await t.test('06 identidad insuficiente no inventa asociación', () => {
    const resultado = prepararTrazabilidadOrdenCompraM11([linea({ idDetalleCotizacion: null })], 7, detalles, oferta, 1);
    assert.equal(resultado.estado, 'INFORMACION_INSUFICIENTE');
    assert.equal(resultado.lineas[0].idDetalleCotizacion, null);
    assert.equal(resultado.lineas[0].resultadoCotejo.identidad, null);
  });

  await t.test('07 una línea acreditada puede relacionarse con múltiples unidades técnicas', () => {
    const schema = leer('prisma/schema.prisma');
    const controlador = leer('src/controladores/M2Controller.ts');
    assert.match(schema, /model correspondencia_linea_oc_item_tecnico/);
    assert.match(controlador, /ordenesTrabajo\.filter\(unidad=>unidad\.detalle===linea\.id_detalle_cotizacion\)/);
    assert.match(controlador, /ASOCIACION_EXPLICITA_OC_COTIZACION/);
  });

  await t.test('08 relación ambigua o ajena se rechaza o queda no comprobada', () => {
    assert.throws(() => prepararTrazabilidadOrdenCompraM11([linea({ idDetalleCotizacion: 999 })], 7, detalles, oferta, 1), /detalle ajeno/);
    const sinOferta = prepararTrazabilidadOrdenCompraM11([linea()], 7, detalles, null, 1);
    assert.equal(sinOferta.estado, 'INFORMACION_INSUFICIENTE');
  });

  await t.test('09 consulta reutiliza CU20 y aceptación reutiliza CU24', () => {
    const permisos = leer('src/validaciones/permisos.ts');
    assert.match(permisos, /consultarTrazabilidadComercialM11:'CU20'/);
    assert.match(permisos, /aprobarCotizacionB2B:'CU24'/);
    assert.doesNotMatch(permisos, /CUT45[2-5]/);
  });

  await t.test('10 claves y reintentos impiden duplicaciones injustificadas', () => {
    assert.throws(() => prepararTrazabilidadOrdenCompraM11([linea(), linea()], 7, detalles, oferta, 1), /duplicada/);
    const migration = leer('prisma/migrations/073_m11_trazabilidad_comercial_b2b/migration.sql');
    const controlador = leer('src/controladores/M2Controller.ts');
    assert.match(migration, /UNIQUE \("id_orden_compra_b2b", "numero_linea"\)/);
    assert.match(controlador, /createMany\(\{data:correspondencias,skipDuplicates:true\}\)/);
    assert.match(leer('prisma/schema.prisma'), /id_cotizacion\s+Int\s+@unique/);
  });
});
