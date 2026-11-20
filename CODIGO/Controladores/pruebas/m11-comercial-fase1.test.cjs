const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { exigirCotejoAcreditadoM11, prepararCorrespondenciasTecnicasM11, prepararTrazabilidadOrdenCompraM11, validarCondicionesEconomicasOfertaM11 } = require('../dist/comercial/ServicioTrazabilidadComercialM11');

const raiz = join(__dirname, '..');
const leer = ruta => readFileSync(join(raiz, ruta), 'utf8');
const detalles = [{ id_detalle_cotizacion: 11, id_cotizacion: 7 }, { id_detalle_cotizacion: 12, id_cotizacion: 7 }];
const oferta = { moneda: 'CLP', neto: 4500, impuesto: 855, total: 5355, productos: [
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
    const resultado = prepararTrazabilidadOrdenCompraM11([linea(), linea({ numeroLinea: 2, idDetalleCotizacion: 12, referenciaComercial: 'OC-L2', cantidad: 1, precioUnitario: 2500 })], 7, detalles, oferta, 1);
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
    const resultado = prepararTrazabilidadOrdenCompraM11([linea({ idDetalleCotizacion: null, referenciaComercial: null })], 7, detalles, oferta, 1);
    assert.equal(resultado.estado, 'INFORMACION_INSUFICIENTE');
    assert.equal(resultado.lineas[0].idDetalleCotizacion, null);
    assert.equal(resultado.lineas[0].resultadoCotejo.identidad, null);
  });

  await t.test('07 sólo acredita unidades cuando identidad y cantidad coinciden exactamente', () => {
    const cotejo = prepararTrazabilidadOrdenCompraM11([linea(), linea({ numeroLinea: 2, idDetalleCotizacion: 12, referenciaComercial: 'OC-L2', cantidad: 1, precioUnitario: 2500 })], 7, detalles, oferta, 1);
    const exactas = prepararCorrespondenciasTecnicasM11(cotejo.lineas, [
      { detalle: 11, idUnidad: 1, idOrdenTrabajo: 101 }, { detalle: 11, idUnidad: 2, idOrdenTrabajo: 102 }, { detalle: 12, idUnidad: 3, idOrdenTrabajo: 103 },
    ]);
    assert.equal(exactas.length, 3);
    const ambiguas = prepararCorrespondenciasTecnicasM11(cotejo.lineas, [
      { detalle: 11, idUnidad: 1, idOrdenTrabajo: 101 }, { detalle: 11, idUnidad: 2, idOrdenTrabajo: 102 }, { detalle: 11, idUnidad: 4, idOrdenTrabajo: 104 },
      { detalle: 12, idUnidad: 3, idOrdenTrabajo: 103 },
    ]);
    assert.deepEqual(ambiguas.map(x => x.idDetalleCotizacion), [12]);
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

  await t.test('10 claves heredadas de OC se conservan y aceptar B2B sin OC evita duplicar ventas', () => {
    // Los datos históricos M11 siguen protegidos; la nueva aceptación EF18 no crea OC.
    assert.throws(() => prepararTrazabilidadOrdenCompraM11([linea(), linea()], 7, detalles, oferta, 1), /duplicada/);
    const migration = leer('prisma/migrations/073_m11_trazabilidad_comercial_b2b/migration.sql');
    assert.match(migration, /UNIQUE \("id_orden_compra_b2b", "numero_linea"\)/);
    assert.match(leer('prisma/schema.prisma'), /id_cotizacion\s+Int\s+@unique/);
    const controlador = leer('src/controladores/M2Controller.ts');
    const bloque = controlador.slice(controlador.indexOf('async aprobarCotizacionB2B'), controlador.indexOf('async consultarTrazabilidadComercialM11'));
    assert.match(bloque, /cot\.estado_cotizacion !== 'emitida' \|\| cot\.nota_venta/);
    assert.doesNotMatch(bloque, /orden_compra_b2b\.create/);
  });

  await t.test('11 sin versión acreditada o concordancia económica no se formaliza B2B', () => {
    const controlador = leer('src/controladores/M2Controller.ts');
    const inicio = controlador.indexOf('async aprobarCotizacionB2B');
    const fin = controlador.indexOf('async consultarTrazabilidadComercialM11', inicio);
    assert.ok(inicio >= 0 && fin > inicio, 'No se encontró el bloque completo de aprobación B2B');
    const bloque = controlador.slice(inicio, fin);
    const validarVersion = bloque.indexOf('Debes seleccionar la versión emitida de la oferta aceptada');
    const verificarVersion = bloque.indexOf('const ofertaAceptada = await tx.cotizacion_version.findFirst');
    const validarEconomia = bloque.indexOf("if (economia.estado !== 'COINCIDE')");
    assert.ok(validarVersion >= 0 && verificarVersion > validarVersion && validarEconomia > verificarVersion,
      'La aprobación debe verificar versión emitida y concordancia económica antes de formalizar');
    assert.match(bloque, /clienteAceptableB2B\(/);
    assert.match(bloque, /cot\.fecha_vigencia/);
    assert.doesNotMatch(bloque, /folioOrdenCompra|respaldoOrdenCompra|lineasOrdenCompra|orden_compra_b2b\.create/);
    for (const mutacion of ['formalizarProyectoCotizacion(tx,idCotizacion)', 'tx.nota_venta.create', 'this.crearOrdenesTrabajoCotizacion(']) {
      const posicion = bloque.indexOf(mutacion);
      assert.ok(posicion > validarEconomia, `${mutacion} debe ocurrir después de acreditar la oferta`);
    }
  });

  await t.test('12 oferta de tres líneas y OC de una sola línea no coincide', () => {
    const tres = { productos: [...oferta.productos, { idDetalleCotizacion: 13, codigo: 'P-C', nombre: 'Puerta C', cantidad: 1, precioUnitario: 3000 }] };
    const resultado = prepararTrazabilidadOrdenCompraM11([linea()], 7, [...detalles, { id_detalle_cotizacion: 13, id_cotizacion: 7 }], tres, 1);
    assert.equal(resultado.estado, 'DISCREPANCIA');
    assert.deepEqual(resultado.resumen.faltantesOferta.sort(), ['DETALLE:12', 'DETALLE:13']);
  });

  await t.test('13 línea adicional no respaldada impide formalizar', () => {
    const resultado = prepararTrazabilidadOrdenCompraM11([linea(), linea({ numeroLinea: 2, idDetalleCotizacion: 12, referenciaComercial: 'OC-L2', cantidad: 1, precioUnitario: 2500 }), linea({ numeroLinea: 3, idDetalleCotizacion: null, referenciaComercial: 'EXTRA', cantidad: 1 })], 7, detalles, oferta, 1);
    assert.equal(resultado.estado, 'DISCREPANCIA');
    assert.deepEqual(resultado.resumen.lineasAdicionales, [3]);
    assert.throws(() => exigirCotejoAcreditadoM11(resultado, validarCondicionesEconomicasOfertaM11(oferta, { moneda: 'CLP', neto: 4500, impuesto: 855, total: 5355 })), /no se formalizó/);
  });

  await t.test('14 referencias comerciales duplicadas quedan en discrepancia', () => {
    const resultado = prepararTrazabilidadOrdenCompraM11([linea(), linea({ numeroLinea: 2, idDetalleCotizacion: 12, cantidad: 1, precioUnitario: 2500 })], 7, detalles, oferta, 1);
    assert.equal(resultado.estado, 'DISCREPANCIA');
    assert.ok(resultado.lineas[1].resultadoCotejo.discrepancias.some(x => x.campo === 'referencia_comercial_duplicada'));
  });

  await t.test('15 OC de dos unidades frente a cinco físicas no acredita correspondencias', () => {
    const ofertaCinco = { productos: [{ idDetalleCotizacion: 11, codigo: 'P-A', nombre: 'Puerta A', cantidad: 5, precioUnitario: 1000 }] };
    const resultado = prepararTrazabilidadOrdenCompraM11([linea({ cantidad: 2 })], 7, detalles, ofertaCinco, 1);
    assert.equal(resultado.estado, 'DISCREPANCIA');
    assert.deepEqual(prepararCorrespondenciasTecnicasM11(resultado.lineas, Array.from({ length: 5 }, (_, i) => ({ detalle: 11, idUnidad: i + 1, idOrdenTrabajo: i + 101 }))), []);
  });

  await t.test('16 una oferta anterior con importes distintos no se sustituye por valores actuales', () => {
    const economia = validarCondicionesEconomicasOfertaM11(oferta, { moneda: 'CLP', neto: 9999, impuesto: 1900, total: 11899 });
    assert.equal(economia.estado, 'DISCREPANCIA');
    assert.deepEqual(economia.discrepancias.map(x => x.campo), ['neto', 'impuesto', 'total']);
  });

  await t.test('17 caso válido anterior conserva cobertura completa y no muta la versión', () => {
    const original = structuredClone(oferta);
    const resultado = prepararTrazabilidadOrdenCompraM11([linea(), linea({ numeroLinea: 2, idDetalleCotizacion: 12, referenciaComercial: 'OC-L2', cantidad: 1, precioUnitario: 2500 })], 7, detalles, oferta, 1);
    const economia = validarCondicionesEconomicasOfertaM11(oferta, { moneda: 'CLP', neto: 4500, impuesto: 855, total: 5355 });
    assert.doesNotThrow(() => exigirCotejoAcreditadoM11(resultado, economia));
    assert.equal(resultado.estado, 'COINCIDE');
    assert.deepEqual(oferta, original);
  });
});
