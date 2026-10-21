const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { Prisma } = require('@prisma/client');
const { conciliarDosEtapasM11 } = require('../dist/comercial/ServicioDocumentalM11');
const { prepararTrazabilidadOrdenCompraM11 } = require('../dist/comercial/ServicioTrazabilidadComercialM11');
const { operacionesPermiso, codigosAdministrador, moduloPermiso } = require('../dist/validaciones/permisos');
const { CATALOGO_PRODUCTORES_M9 } = require('../dist/m9/contratoProductor');

test('M11 Fase 2 documental', async t => {
  await t.test('CU459 no convierte GDE, OT ni planificación en despacho físico', () => {
    const resultado = conciliarDosEtapasM11([{ idLinea:'1', cantidad:5, moneda:'CLP' }], null, null);
    assert.equal(resultado.estado, 'DATOS_INSUFICIENTES'); assert.equal(resultado.hallazgos.length, 0);
    assert.match(resultado.etapaA.motivo, /GDE y OT no sustituyen/);
  });
  await t.test('CU459 detecta parciales y facturación parcial sobre salida acreditada', () => {
    const salida = { acreditada:true, owner:'Despacho', referencia:'SAL-1', lineas:[{ idLinea:'1', cantidad:3, moneda:'CLP' }] };
    const resultado = conciliarDosEtapasM11([{ idLinea:'1', cantidad:5, moneda:'CLP' }], salida, [{ idLinea:'1', cantidad:2, moneda:'CLP' }]);
    assert.equal(resultado.estado, 'DISCREPANCIA');
    assert.deepEqual(resultado.hallazgos.map(x=>x.tipo), ['SALIDA_PARCIAL','FACTURACION_PARCIAL']);
  });
  await t.test('CU459 detecta exceso, moneda incompatible y M:N no distribuible', () => {
    const salida = { acreditada:true, owner:'Despacho', referencia:'SAL-2', lineas:[{ idLinea:'1', cantidad:6, moneda:'CLP' },{idLinea:'2',cantidad:1,moneda:'USD'}] };
    const resultado = conciliarDosEtapasM11([{ idLinea:'1', cantidad:5 },{idLinea:'2',cantidad:1}], salida, [{ idLinea:'1',cantidad:6,moneda:'USD' },{idLinea:'2',cantidad:1,moneda:'USD',compartido:true}]);
    assert.ok(resultado.hallazgos.some(x=>x.tipo==='EXCESO_SALIDA')); assert.ok(resultado.hallazgos.some(x=>x.tipo==='MONEDA_INCOMPATIBLE'));
    assert.equal(resultado.etapaB.estado,'DISCREPANCIA'); assert.deepEqual(resultado.etapaB.documentosCompartidosSinDistribucion,['2']);
  });
  await t.test('CUT454 rechaza subtotal explícito distinto sin tolerancia', () => {
    const snapshot={moneda:'CLP',neto:'20',impuesto:'0',total:'20',productos:[{idDetalleCotizacion:10,cantidad:2,precioUnitario:10}]};
    const resultado=prepararTrazabilidadOrdenCompraM11([{numeroLinea:1,idDetalleCotizacion:10,cantidad:2,idMoneda:1,precioUnitario:10,subtotal:'19.99'}],7,[{id_detalle_cotizacion:10,id_cotizacion:7}],snapshot,1);
    assert.equal(resultado.estado,'DISCREPANCIA'); assert.ok(resultado.lineas[0].resultadoCotejo.discrepancias.some(x=>x.campo==='subtotal'));
  });
  await t.test('CU458/CU459/CU461 están separados y CU377 continúa excluido', () => {
    assert.equal(operacionesPermiso.gestionarCorreccionDocumentalM11,'CU458'); assert.equal(operacionesPermiso.consultarConciliacionDocumentalM11,'CU459'); assert.equal(operacionesPermiso.resolverHallazgoDocumentalM11,'CU461');
    for(const codigo of ['CU458','CU459','CU461']){assert.ok(codigosAdministrador.includes(codigo));assert.equal(moduloPermiso(codigo),'M11');} assert.equal(codigosAdministrador.includes('CU377'),false);
  });
  await t.test('correcciones y resoluciones usan auditoría oficial; consultas aritméticas no', () => {
    assert.equal(CATALOGO_PRODUCTORES_M9.gestionarCorreccionDocumentalM11.operacion,'DOCUMENTO_COMERCIAL_CORREGIDO');
    assert.equal(CATALOGO_PRODUCTORES_M9.resolverHallazgoDocumentalM11.operacion,'HALLAZGO_DOCUMENTAL_RESUELTO');
    assert.equal(CATALOGO_PRODUCTORES_M9.consultarConciliacionDocumentalM11,undefined);
  });
  await t.test('migración 074 es aditiva, preserva originales y registra sólo permisos humanos', () => {
    const sql=readFileSync(resolve('prisma/migrations/074_m11_cadena_documental_conciliacion/migration.sql'),'utf8');
    assert.match(sql,/CREATE TABLE "finanzas"\."correccion_documental_m11"/); assert.match(sql,/ON DELETE RESTRICT/);
    assert.match(sql,/'CU458'/); assert.match(sql,/'CU459'/); assert.match(sql,/'CU461'/); assert.doesNotMatch(sql,/INSERT[\s\S]*'CU456'/);
    assert.doesNotMatch(sql,/DROP TABLE|TRUNCATE|DELETE FROM/i);
  });
  await t.test('DTE admite cadena de correctores existentes sin crear DTE automático', () => {
    const fuente=readFileSync(resolve('src/comercial/ServicioDocumentalM11.ts'),'utf8');
    assert.match(fuente,/id_documento_referencia: idOriginal/); assert.match(fuente,/VINCULAR_CORRECTOR_EXISTENTE/);
    assert.doesNotMatch(fuente,/documento_tributario\.create/); assert.match(fuente,/produciría un ciclo documental/);
  });
  await t.test('hallazgo sólo nace de evidencia acreditada y resolución conserva motivo y respaldo', () => {
    const fuente=readFileSync(resolve('src/comercial/ServicioDocumentalM11.ts'),'utf8');
    assert.match(fuente,/resultado\.estado === 'DATOS_INSUFICIENTES'/); assert.match(fuente,/upsert/); assert.match(fuente,/decision, motivo, respaldo, resultado/);
    assert.match(fuente,/clave_idempotencia/); assert.match(fuente,/revision: \{ increment: 1 \}/);
  });
});
