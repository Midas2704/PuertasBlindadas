const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { Prisma } = require('@prisma/client');
const { sugerirCategoriaPago, prepararPago } = require('../dist/utilidades/pago');
const { sincronizarEstadoPago } = require('../dist/utilidades/finanzas');
const { prepararModificacionGuia } = require('../dist/m2/guiaDespacho');
const { CATALOGO_PRODUCTORES_M9 } = require('../dist/m9/contratoProductor');

const pago = (monto, { anulado=false, revertido=0 }={}) => ({
  monto_pago:new Prisma.Decimal(monto), estado_verificacion:'verificado',
  anulacion_pago:anulado?{id_anulacion_pago:1}:null,
  reversion_pago:revertido?[{monto:new Prisma.Decimal(revertido)}]:[],
});
const nota = (asignaciones=[]) => ({
  id_nota_venta:1,id_ficha_cliente:1,id_moneda:1,numero_nota_venta:'NV-1',estado_nota_venta:'emitida',estado_pago:'pendiente',
  monto_total:new Prisma.Decimal(1000),tipo_cambio_usado:null,monto_convertido:null,fecha_vencimiento:null,
  moneda:{codigo_moneda:'CLP'},reversion_nota_venta:[],aplicacion_saldo_favor:[],
  asignacion_pago_cliente:asignaciones.map((item,indice)=>({id_asignacion_pago_cliente:indice+1,monto_asignado:new Prisma.Decimal(item.monto),pago_cliente:item.pago})),
});
const catalogo={
  medios:[{id_medio_pago:7,nombre_medio_pago:'Efectivo'},{id_medio_pago:8,nombre_medio_pago:'Transferencia'}],
  categorias:[{id_categoria_pago:11,nombre:'Anticipo'},{id_categoria_pago:12,nombre:'Abono parcial'},{id_categoria_pago:13,nombre:'Pago final'}],cuotas:[],
};

test('CU44 aplica Pago final antes del historial y distingue Anticipo de Abono parcial',()=>{
  assert.equal(sugerirCategoriaPago(nota(),1000),'Pago final');
  assert.equal(sugerirCategoriaPago(nota(),300),'Anticipo');
  const conPago=nota([{monto:300,pago:pago(300)}]);
  assert.equal(sugerirCategoriaPago(conPago,200),'Abono parcial');
  assert.equal(sugerirCategoriaPago(conPago,700),'Pago final');
});

test('CU44 ignora pagos anulados o totalmente revertidos y valida el monto',()=>{
  assert.equal(sugerirCategoriaPago(nota([{monto:300,pago:pago(300,{anulado:true})}]),200),'Anticipo');
  assert.equal(sugerirCategoriaPago(nota([{monto:300,pago:pago(300,{revertido:300})}]),200),'Anticipo');
  for(const monto of [0,-1,1001,'x']) assert.throws(()=>sugerirCategoriaPago(nota(),monto),error=>error?.estado===400);
});

test('CU44 resuelve el catálogo por nombre y respeta una categoría manual válida',()=>{
  const base={monto:'1000',idMedio:7,respaldo:'respaldo'};
  assert.equal(prepararPago(nota(),base,catalogo,null,'test').id_categoria_pago,13);
  assert.equal(prepararPago(nota(),{...base,idCategoria:11},catalogo,null,'test').id_categoria_pago,11);
  const parcial=nota([{monto:300,pago:pago(300)}]);
  assert.equal(prepararPago(parcial,{...base,monto:'200'},catalogo,null,'test').id_categoria_pago,12);
  const transferencia=prepararPago(nota(),{...base,monto:'100',idMedio:8,antecedentesMedio:'OP-1'},catalogo,null,'test');
  assert.equal(transferencia.id_medio_pago,8);assert.equal(transferencia.monto_pago.toString(),'100');
});

test('CU44 deja saldo cero y usa el estado existente pagada al completar la NV',async()=>{
  const completa=nota([{monto:1000,pago:pago(1000)}]);let actualizacion;
  const resultado=await sincronizarEstadoPago({nota_venta:{update:async entrada=>{actualizacion=entrada;}}},completa);
  assert.equal(resultado.saldoPendiente,0);assert.equal(resultado.estado_pago,'pagada');
  assert.equal(actualizacion.data.estado_pago,'pagada');
});

test('CU35 edita emitidas, bloquea estados finales y protege identidad y estructura',()=>{
  assert.deepEqual(prepararModificacionGuia({estado:'emitida'},{folio:'G-2',antecedentes:{referencia:'A'}}),{folio:'G-2',antecedentes:{referencia:'A'}});
  for(const estado of ['cerrada','finalizada','anulada']) assert.throws(()=>prepararModificacionGuia({estado},{folio:'G-2'}),error=>error?.estado===409);
  assert.throws(()=>prepararModificacionGuia({estado:'emitida'},{folio:'',antecedentes:{}}),error=>error?.estado===400);
  assert.throws(()=>prepararModificacionGuia({estado:'emitida'},{folio:'G-2',antecedentes:[]}),error=>error?.estado===400);
  assert.throws(()=>prepararModificacionGuia({estado:'emitida'},{folio:'G-2',id_nota_venta:99}),error=>error?.estado===400);
  assert.equal(CATALOGO_PRODUCTORES_M9.modificarGuia.operacion,'GUIA_DESPACHO_MODIFICADA');
  const m2=readFileSync(resolve('src/controladores/M2Controller.ts'),'utf8');const m3=readFileSync(resolve('src/controladores/M3Controller.ts'),'utf8');
  assert.match(m2,/Guía de Despacho no encontrada/);assert.match(m2,/P2002/);assert.match(m3,/FOR UPDATE/);assert.match(m3,/P2034/);
});
