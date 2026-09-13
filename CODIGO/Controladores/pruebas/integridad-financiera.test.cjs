const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { Prisma } = require('@prisma/client');
const { prisma } = require('../dist/db');
const { M2Controller } = require('../dist/controladores/M2Controller');
const { M3Controller } = require('../dist/controladores/M3Controller');
const { consolidarNotasClp, fechaNegocio } = require('../dist/utilidades/finanzas');
const { prepararPago } = require('../dist/utilidades/pago');

const notaBase = (moneda='CLP', monto=100, tasa=null) => ({
  id_nota_venta: 1, id_ficha_cliente: 1, id_moneda: moneda==='CLP'?1:2, numero_nota_venta:`NV-${moneda}`,
  estado_nota_venta:'emitida', estado_pago:'pendiente', monto_total:new Prisma.Decimal(monto),
  tipo_cambio_usado:tasa===null?null:new Prisma.Decimal(tasa), monto_convertido:tasa===null?null:new Prisma.Decimal(monto).mul(tasa),
  fecha_vencimiento:null, moneda:{codigo_moneda:moneda}, reversion_nota_venta:[], asignacion_pago_cliente:[], aplicacion_saldo_favor:[],
});

test('dashboard consolida con tasa histórica y excluye USD sin conversión', () => {
  const convertido=consolidarNotasClp([notaBase('CLP',500000),notaBase('USD',100000,900)]);
  assert.equal(convertido.montoComercialVigente,90500000);
  assert.equal(convertido.cantidadSinConversion,0);
  const faltante=consolidarNotasClp([notaBase('CLP',500000),notaBase('USD',100000)]);
  assert.equal(faltante.montoComercialVigente,500000);
  assert.equal(faltante.cantidadSinConversion,1);
});

test('contrato de pagos valida categoría, cuotas, cheque y limpia cuotas ajenas', () => {
  const medios=[{id_medio_pago:1,nombre_medio_pago:'Efectivo'},{id_medio_pago:2,nombre_medio_pago:'Transferencia'},{id_medio_pago:3,nombre_medio_pago:'Débito'},{id_medio_pago:4,nombre_medio_pago:'Crédito'},{id_medio_pago:5,nombre_medio_pago:'Cheque'}];
  const catalogo={medios,categorias:[{id_categoria_pago:1,nombre:'Anticipo'}],cuotas:[{cantidad:12}]};
  const base={monto:10,idCategoria:1,respaldo:'respaldo'};
  assert.equal(prepararPago(notaBase(),{...base,idMedio:1,cuotas:12},catalogo,null,'test').cantidad_cuotas,null);
  assert.equal(prepararPago(notaBase(),{...base,idMedio:2,cuotas:12,antecedentesMedio:'TRX'},catalogo,null,'test').cantidad_cuotas,null);
  assert.equal(prepararPago(notaBase(),{...base,idMedio:3,antecedentesMedio:'AUT'},catalogo,null,'test').cantidad_cuotas,null);
  assert.equal(prepararPago(notaBase(),{...base,idMedio:4,cuotas:12,antecedentesMedio:'AUT'},catalogo,null,'test').cantidad_cuotas,12);
  assert.throws(()=>prepararPago(notaBase(),{...base,idMedio:4,antecedentesMedio:'AUT'},catalogo,null,'test'),/cuotas/);
  assert.throws(()=>prepararPago(notaBase(),{monto:10,idMedio:1,respaldo:'respaldo'},catalogo,null,'test'),/categoría/);
  assert.throws(()=>prepararPago(notaBase(),{...base,idMedio:'',respaldo:'respaldo'},catalogo,null,'test'),/Identificador|medio/);
  assert.throws(()=>prepararPago(notaBase(),{...base,idMedio:5,antecedentesMedio:'CH-1'},catalogo,null,'test'),/fecha de cobro/);
  const manana=new Date(`${fechaNegocio()}T00:00:00Z`);manana.setUTCDate(manana.getUTCDate()+1);
  const cheque=prepararPago(notaBase(),{...base,idMedio:5,antecedentesMedio:'CH-1',fechaCobro:manana.toISOString().slice(0,10)},catalogo,null,'test');
  assert.equal(cheque.cantidad_cuotas,null);assert.equal(cheque.antecedentes_medio.fechaCobro,manana.toISOString().slice(0,10));
});

test('cotización conserva cantidad y creación/edición comparten el cálculo', async () => {
  const m2=new M2Controller();
  const cliente=await prisma.cliente_financiero.findFirstOrThrow({where:{estado_financiero:'activo',nivel_formalizacion:'formal'},include:{ficha_cliente:true}});
  const moneda=await prisma.moneda.findUniqueOrThrow({where:{codigo_moneda:'CLP'}});
  const item=await prisma.item_comercial.findFirstOrThrow({where:{estado_item:'activo'}});
  const precio=await prisma.historial_precio_material.findFirstOrThrow({where:{id_moneda:moneda.id_moneda,estado_precio:'vigente'}});
  const entrada={id_ficha_cliente:cliente.ficha_cliente.id_ficha_cliente,fecha_vigencia:'2030-01-01',margen_esperado:30,id_moneda:moneda.id_moneda,exento_iva:false,productos:[{id_item_comercial:item.id_item_comercial,tipo_producto:item.nombre_item,cantidad:10,medidas:'210x90x5',materiales:[{id_historial_precio_material:precio.id_historial_precio_material,cantidad:1}]}]};
  let cotizacion;
  try {
    cotizacion=await m2.guardarCotizacion(entrada);
    const esperados=precio.precio_unitario.mul(10);const sugerido=esperados.div('0.7').toDecimalPlaces(2);const total=sugerido.mul('1.19').toDecimalPlaces(2);
    let guardada=(await m2.consultarBandeja()).cotizaciones.find(c=>c.id_cotizacion===cotizacion.id_cotizacion);
    assert.equal(guardada.detalle_cotizacion[0].cantidad_item.toNumber(),10);
    assert.equal(guardada.subtotal_costos_estimados.toString(),esperados.toString());assert.equal(guardada.monto_total_estimado.toString(),total.toString());
    const editada=await m2.editarCotizacion(cotizacion.id_cotizacion,entrada);
    assert.equal(editada.detalle_cotizacion[0].cantidad_item.toNumber(),10);assert.equal(editada.monto_total_estimado.toString(),total.toString());
  } finally {
    if(cotizacion)await prisma.$transaction(async tx=>{await tx.detalle_costo_material_cotizacion.deleteMany({where:{detalle_cotizacion:{id_cotizacion:cotizacion.id_cotizacion}}});await tx.detalle_cotizacion.deleteMany({where:{id_cotizacion:cotizacion.id_cotizacion}});await tx.cotizacion.delete({where:{id_cotizacion:cotizacion.id_cotizacion}});});
  }
});

test('venta directa conserva original, tasa histórica y equivalente CLP', async () => {
  const banco={obtenerTipoCambio:async()=>900};const m2=new M2Controller(banco);
  const cliente=await prisma.cliente_financiero.findFirstOrThrow({where:{estado_financiero:'activo',nivel_formalizacion:'formal'},include:{ficha_cliente:true}});
  const creadas=[];
  try {
    for(const moneda of ['CLP','USD']){const nota=await m2.crearVentaDirecta({id_cliente:cliente.ficha_cliente.id_ficha_cliente,monto_neto:100,moneda,exento_iva:true,detalle:[{tipo:'servicio',descripcion:'Prueba',cantidad:1,valor:100}]});creadas.push(nota.id_nota_venta);assert.equal(nota.monto_total.toNumber(),100);if(moneda==='USD'){assert.equal(nota.tipo_cambio_usado.toNumber(),900);assert.equal(nota.monto_convertido.toNumber(),90000);}else{assert.equal(nota.tipo_cambio_usado,null);assert.equal(nota.monto_convertido,null);}}
  } finally {if(creadas.length)await prisma.nota_venta.deleteMany({where:{id_nota_venta:{in:creadas}}});}
});

test('pago opcional sin documento actualiza saldo y documento no relacionado se rechaza', async () => {
  const m3=new M3Controller({obtenerTipoCambio:async()=>900});
  const cliente=await prisma.cliente_financiero.findFirstOrThrow({where:{estado_financiero:'activo',nivel_formalizacion:'formal'},include:{ficha_cliente:true}});
  const moneda=await prisma.moneda.findUniqueOrThrow({where:{codigo_moneda:'CLP'}});const medio=await prisma.medio_pago.findUniqueOrThrow({where:{nombre_medio_pago:'Efectivo'}});const categoria=await prisma.categoria_pago.findUniqueOrThrow({where:{nombre:'Pago final'}});const tipo=await prisma.tipo_documento.findFirstOrThrow();
  const nota=await prisma.nota_venta.create({data:{id_ficha_cliente:cliente.ficha_cliente.id_ficha_cliente,id_moneda:moneda.id_moneda,numero_nota_venta:`TEST-${randomUUID()}`,fecha_emision:new Date(),monto_neto:100,monto_total:100,exento_iva:true}});
  const documento=await prisma.documento_tributario.create({data:{id_ficha_cliente:cliente.ficha_cliente.id_ficha_cliente,id_tipo_documento:tipo.id_tipo_documento,id_moneda:moneda.id_moneda,folio_documento:`TEST-${randomUUID()}`,fecha_emision:new Date(),monto_total:100}});
  let idPago;
  try {
    await assert.rejects(m3.registrarPago({idNota:nota.id_nota_venta,monto:10,idMedio:medio.id_medio_pago,idCategoria:categoria.id_categoria_pago,idDocumento:documento.id_documento_tributario,respaldo:'ok'},'test'),/no está relacionado/);
    const resultado=await m3.registrarPago({idNota:nota.id_nota_venta,monto:100,idMedio:medio.id_medio_pago,idCategoria:categoria.id_categoria_pago,respaldo:'ok'},'test');idPago=resultado.idPago;
    const pago=await prisma.pago_cliente.findUniqueOrThrow({where:{id_pago_cliente:idPago},include:{asignacion_pago_cliente:true}});assert.equal(pago.cantidad_cuotas,null);assert.equal(pago.asignacion_pago_cliente.id_documento_tributario,null);assert.equal((await prisma.nota_venta.findUniqueOrThrow({where:{id_nota_venta:nota.id_nota_venta}})).estado_pago,'pagada');
  } finally {if(idPago){await prisma.asignacion_pago_cliente.deleteMany({where:{id_pago_cliente:idPago}});await prisma.pago_cliente.delete({where:{id_pago_cliente:idPago}});}await prisma.documento_tributario.delete({where:{id_documento_tributario:documento.id_documento_tributario}});await prisma.nota_venta.delete({where:{id_nota_venta:nota.id_nota_venta}});}
});

test('UI mantiene fuente de clientes, placeholders y controles condicionales',()=>{
  const pagos=readFileSync('../Vistas/src/views/Pagos/PagosCliente.tsx','utf8');const cotizacion=readFileSync('../Vistas/src/views/ArmarCotizacion/ArmarCotizacion.tsx','utf8');
  assert.match(pagos,/clientesOrigen/);assert.match(pagos,/value="" disabled>Medio de pago/);assert.match(pagos,/value="" disabled>Categoría sugerida/);assert.match(pagos,/\{credito&&/);assert.match(pagos,/setForm\(formularioVacio\)/);
  assert.match(cotizacion,/inventarioCompatible/);assert.match(cotizacion,/materiales: \[\]/);
});
