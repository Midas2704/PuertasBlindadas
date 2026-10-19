const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { prisma } = require('../dist/db');
const { M2Controller } = require('../dist/controladores/M2Controller');
const { C_Finanzas } = require('../dist/controladores/C_Finanzas');
const { crearAplicacion } = require('../dist/app');

const m2=new M2Controller();const sufijo=randomUUID().slice(0,8).toUpperCase();
let usuario,familia,producto,tarea,plantilla,cotizacion,itemCreado=false,item,idsOrden=[];

after(async()=>{
 if(cotizacion){
  const unidades=await prisma.unidad_fisica_orden_trabajo.findMany({where:{id_cotizacion:cotizacion.id_cotizacion}});idsOrden=unidades.map(u=>u.id_orden_trabajo);
  await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."historial_unidad_fisica_ot" DISABLE TRIGGER "trg_historial_unidad_fisica_ot_inmutable"');
  try {
   await prisma.historial_unidad_fisica_ot.deleteMany({where:{id_unidad_fisica_ot:{in:unidades.map(u=>u.id_unidad_fisica_ot)}}});
  } finally {
   await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."historial_unidad_fisica_ot" ENABLE TRIGGER "trg_historial_unidad_fisica_ot_inmutable"');
  }
  await prisma.unidad_fisica_orden_trabajo.deleteMany({where:{id_cotizacion:cotizacion.id_cotizacion}});
  await prisma.orden_trabajo.deleteMany({where:{orden_trabajo_id_orden:{in:idsOrden}}});
  const notas=await prisma.nota_venta.findMany({where:{id_cotizacion:cotizacion.id_cotizacion},select:{id_nota_venta:true,id_proyecto_contexto:true}});const idsNota=notas.map(n=>n.id_nota_venta),idsProyecto=notas.map(n=>n.id_proyecto_contexto).filter(Boolean);
  await prisma.proyecto_financiero.deleteMany({where:{id_nota_venta:{in:idsNota}}});await prisma.nota_venta.deleteMany({where:{id_nota_venta:{in:idsNota}}});await prisma.orden_compra_b2b.deleteMany({where:{id_cotizacion:cotizacion.id_cotizacion}});if(idsProyecto.length){await prisma.proyecto_obra.deleteMany({where:{id_proyecto:{in:idsProyecto}}});await prisma.proyecto.deleteMany({where:{proyecto_proyecto_id:{in:idsProyecto}}});}await prisma.detalle_cotizacion.deleteMany({where:{id_cotizacion:cotizacion.id_cotizacion}});await prisma.cotizacion.deleteMany({where:{id_cotizacion:cotizacion.id_cotizacion}});
 }
 if(producto){await prisma.historial_producto_comercial.deleteMany({where:{id_extension_producto_comercial:producto.id_extension_producto_comercial}});await prisma.extension_producto_comercial.deleteMany({where:{id_extension_producto_comercial:producto.id_extension_producto_comercial}});}
 if(plantilla){await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."version_plantilla_fabricacion" DISABLE TRIGGER "trg_version_plantilla_fabricacion_inmutable"');await prisma.version_plantilla_fabricacion.deleteMany({where:{id_plantilla_fabricacion:plantilla.id_plantilla_fabricacion}});await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."version_plantilla_fabricacion" ENABLE TRIGGER "trg_version_plantilla_fabricacion_inmutable"');await prisma.plantilla_fabricacion_familia.deleteMany({where:{id_plantilla_fabricacion:plantilla.id_plantilla_fabricacion}});}
 if(tarea)await prisma.catalogo_tarea_fabricacion.deleteMany({where:{id_tarea_fabricacion:tarea.id_tarea_fabricacion}});
 if(familia){await prisma.historial_familia_producto_comercial.deleteMany({where:{id_familia_producto_comercial:familia.id_familia_producto_comercial}});await prisma.familia_producto_comercial.deleteMany({where:{id_familia_producto_comercial:familia.id_familia_producto_comercial}});}
 if(itemCreado&&item)await prisma.item_comercial.deleteMany({where:{id_item_comercial:item.id_item_comercial}});
 await prisma.$disconnect();
});

test('Aprobación atómica genera una OT por puerta física',async t=>{
 usuario=await prisma.usuario.findFirstOrThrow();const area=await prisma.area_trabajo.findFirstOrThrow({where:{area_trabajo_activo:true}});const moneda=await prisma.moneda.findFirstOrThrow({where:{codigo_moneda:'CLP'}});
 const ficha=await prisma.ficha_cliente.findFirstOrThrow({where:{cliente_financiero:{estado_financiero:'activo',nivel_formalizacion:'formal',tipo_cliente_financiero:{nombre_tipo_cliente_financiero:{equals:'B2B',mode:'insensitive'}}}}});
 item=await prisma.item_comercial.findFirst({where:{estado_item:'activo',extensiones_comerciales:{none:{}}}});if(!item){item=await prisma.item_comercial.create({data:{nombre_item:`Puerta focal ${sufijo}`,tipo_item:'producto',estado_item:'activo'}});itemCreado=true;}
 familia=await m2.crearFamiliaProductoComercial({codigo:`OT-${sufijo}`,nombre:`Familia OT ${sufijo}`},usuario.usuario_id_usuario);
 producto=await m2.crearProductoComercial({codigoComercial:`POT-${sufijo}`,nombreComercial:`Puerta OT ${sufijo}`,idFamilia:familia.id_familia_producto_comercial},usuario.usuario_id_usuario);
 producto=await m2.vincularProductoComercial(producto.id_extension_producto_comercial,{revision:producto.revision,idItemComercial:item.id_item_comercial,idProductoTerminado:null,motivo:'Prueba focal'},usuario.usuario_id_usuario);
 tarea=await m2.crearTareaFabricacion({nombre:`Fabricar ${sufijo}`,idArea:area.area_trabajo_id_area.toString(),tiempoEstimadoMin:20},usuario.usuario_id_usuario);
 plantilla=await m2.guardarBorradorPlantillaFabricacion(familia.id_familia_producto_comercial,{etapas:[{id:randomUUID(),idArea:area.area_trabajo_id_area.toString(),nombre:'Fabricación',tareas:[{id:randomUUID(),idTareaFabricacion:tarea.id_tarea_fabricacion}]}]},usuario.usuario_id_usuario);
 await m2.publicarPlantillaFabricacion(familia.id_familia_producto_comercial,{revision:plantilla.revision,motivo:'Prueba de aprobación'},usuario.usuario_id_usuario);
 cotizacion=await prisma.cotizacion.create({data:{id_ficha_cliente:ficha.id_ficha_cliente,id_moneda:moneda.id_moneda,fecha_emision:new Date('2026-10-13T00:00:00Z'),fecha_vigencia:new Date('2026-12-31T00:00:00Z'),subtotal_costos_estimados:100,monto_neto:100,monto_impuesto:19,monto_total_estimado:119,estado_cotizacion:'emitida',detalle_cotizacion:{create:{id_item_comercial:item.id_item_comercial,cantidad_item:2,subtotal_item_estimado:100}}}});
 await t.test('01 previsualiza exactamente una unidad por puerta',async()=>{const p=await m2.obtenerPlanificacionAprobacionCotizacion(cotizacion.id_cotizacion);assert.equal(p.totalOt,2);assert.deepEqual(p.planificaciones.map(x=>x.numeroUnidad),[1,2]);});
 const previo=await m2.obtenerPlanificacionAprobacionCotizacion(cotizacion.id_cotizacion);
 await t.test('02 cada unidad conserva producto, familia y versión publicada',()=>{for(const u of previo.planificaciones){assert.equal(u.idProductoComercial,producto.id_extension_producto_comercial);assert.equal(u.idFamiliaProducto,familia.id_familia_producto_comercial);assert.ok(u.idVersionPlantilla);}});
 await t.test('03 rechaza planificación incompleta sin efectos comerciales',async()=>{await assert.rejects(m2.aprobarCotizacionB2B(cotizacion.id_cotizacion,{folioOrdenCompra:`OC-${sufijo}`,respaldoOrdenCompra:'respaldo',planificaciones:previo.planificaciones.slice(0,1)},usuario.usuario_id_usuario),e=>e.estado===400);assert.equal(await prisma.nota_venta.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),0);assert.equal(await prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),0);});
 let aprobada;
 await t.test('04 confirma Cotización, NV y dos OT en una transacción',async()=>{aprobada=await m2.aprobarCotizacionB2B(cotizacion.id_cotizacion,{folioOrdenCompra:`OC-${sufijo}`,respaldoOrdenCompra:'respaldo focal',planificaciones:previo.planificaciones},usuario.usuario_id_usuario);assert.equal(aprobada.ordenesTrabajo.length,2);assert.equal(await prisma.nota_venta.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),1);});
 await t.test('05 las OT comienzan pendientes de rectificación y no ejecutables',async()=>{const unidades=await prisma.unidad_fisica_orden_trabajo.findMany({where:{id_cotizacion:cotizacion.id_cotizacion},include:{orden_trabajo:true}});assert.equal(unidades.length,2);for(const u of unidades){assert.equal(u.estado,'PENDIENTE_RECTIFICACION');assert.equal(u.orden_trabajo.orden_trabajo_estado,'PENDIENTE_RECTIFICACION');assert.equal(await prisma.tarea.count({where:{id_orden_trabajo:u.id_orden_trabajo}}),0);}});
 await t.test('05b GET de Terreno muestra las dos OT a Midas y permite abrir su ficha',async()=>{
  const actor={id:usuario.usuario_id_usuario,sesion:'midas-ot-focal',permisos:['CU202'],configuracion:'gerencia',administrador:false,administradorOriginal:true,cambiarClave:false,nombre:'Midas sintético',acceso:'interno'};
  const app=crearAplicacion(new C_Finanzas({autorizar:async()=>actor}));
  const servidor=await new Promise((resolve,reject)=>{const instancia=app.listen(0,'127.0.0.1',()=>resolve(instancia));instancia.on('error',reject)});
  try{
   const base=`http://127.0.0.1:${servidor.address().port}/api/finanzas`;
   const respuesta=await fetch(`${base}/terreno/ordenes-trabajo?cotizacion=${cotizacion.id_cotizacion}`);assert.equal(respuesta.status,200);
   const lista=await respuesta.json();assert.equal(lista.length,2);assert.ok(lista.every(orden=>orden.estado==='PENDIENTE_RECTIFICACION'));
   const detalle=await fetch(`${base}/terreno/ordenes-trabajo/${lista[0].idOrdenTrabajo}`);assert.equal(detalle.status,200);assert.equal((await detalle.json()).idOrdenTrabajo,lista[0].idOrdenTrabajo);
  }finally{await new Promise(resolve=>servidor.close(resolve))}
 });
 await t.test('06 conserva planificación histórica independiente por unidad',async()=>{const unidades=await prisma.unidad_fisica_orden_trabajo.findMany({where:{id_cotizacion:cotizacion.id_cotizacion}});assert.notEqual(unidades[0].id_unidad_fisica_ot,unidades[1].id_unidad_fisica_ot);assert.deepEqual(unidades[0].planificacion_inicial,unidades[0].planificacion_actual);});
 await t.test('07 reintento no duplica Nota de Venta ni OT',async()=>{await assert.rejects(m2.aprobarCotizacionB2B(cotizacion.id_cotizacion,{folioOrdenCompra:`OC2-${sufijo}`,respaldoOrdenCompra:'reintento',planificaciones:previo.planificaciones},usuario.usuario_id_usuario),e=>e.estado===409);assert.equal(await prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),2);});
 await t.test('08 historial de creación queda asociado al actor',async()=>{const h=await prisma.historial_unidad_fisica_ot.findMany({where:{unidad:{id_cotizacion:cotizacion.id_cotizacion}}});assert.equal(h.length,2);assert.ok(h.every(x=>x.usuario_id_usuario===usuario.usuario_id_usuario));});
 await t.test('09 historial es inmutable en base de datos',async()=>{const h=await prisma.historial_unidad_fisica_ot.findFirstOrThrow({where:{unidad:{id_cotizacion:cotizacion.id_cotizacion}}});await assert.rejects(prisma.historial_unidad_fisica_ot.update({where:{id_historial_unidad_fisica_ot:h.id_historial_unidad_fisica_ot},data:{motivo:'alterado'}}),/inmutable/);});
 await t.test('10 migración no altera tablas propietarias compartidas',()=>{const sql=readFileSync(resolve('prisma/migrations/061_ot_por_unidad_cotizada/migration.sql'),'utf8');assert.doesNotMatch(sql,/ALTER TABLE "(?:inventario|terreno)"/);assert.match(sql,/REFERENCES "inventario"\."orden_trabajo"/);});
 await t.test('11 B2C conserva primer pago y genera OT en la misma confirmación',async()=>{
  const fichaB2C=await prisma.ficha_cliente.findFirstOrThrow({where:{cliente_financiero:{estado_financiero:'activo',nivel_formalizacion:'formal',tipo_cliente_financiero:{nombre_tipo_cliente_financiero:{equals:'B2C',mode:'insensitive'}}}}});
  const medio=await prisma.medio_pago.findFirstOrThrow({where:{estado_medio_pago:'activo'}});const categoria=await prisma.categoria_pago.findFirstOrThrow({where:{activo:true}});
  const cotizacionB2C=await prisma.cotizacion.create({data:{id_ficha_cliente:fichaB2C.id_ficha_cliente,id_moneda:moneda.id_moneda,fecha_emision:new Date('2026-10-13T00:00:00Z'),fecha_vigencia:new Date('2026-12-31T00:00:00Z'),subtotal_costos_estimados:100,monto_neto:100,monto_impuesto:19,monto_total_estimado:119,estado_cotizacion:'emitida',detalle_cotizacion:{create:{id_item_comercial:item.id_item_comercial,cantidad_item:1,subtotal_item_estimado:100}}}});
  let resultadoB2C;
  try {
   const previoB2C=await m2.obtenerPlanificacionAprobacionCotizacion(cotizacionB2C.id_cotizacion);
   resultadoB2C=await m2.consolidarB2C(cotizacionB2C.id_cotizacion,{monto:119,idMedio:medio.id_medio_pago,idCategoria:categoria.id_categoria_pago,respaldo:'Referencia focal B2C',antecedentesMedio:'Pago focal B2C',planificaciones:previoB2C.planificaciones},usuario.usuario_id_usuario);
   assert.equal(resultadoB2C.ordenesTrabajo.length,1);assert.equal(await prisma.nota_venta.count({where:{id_cotizacion:cotizacionB2C.id_cotizacion}}),1);assert.equal(await prisma.pago_cliente.count({where:{id_pago_cliente:resultadoB2C.idPago}}),1);
  } finally {
   const unidades=await prisma.unidad_fisica_orden_trabajo.findMany({where:{id_cotizacion:cotizacionB2C.id_cotizacion}});
   await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."historial_unidad_fisica_ot" DISABLE TRIGGER "trg_historial_unidad_fisica_ot_inmutable"');
   try {await prisma.historial_unidad_fisica_ot.deleteMany({where:{id_unidad_fisica_ot:{in:unidades.map(u=>u.id_unidad_fisica_ot)}}});} finally {await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."historial_unidad_fisica_ot" ENABLE TRIGGER "trg_historial_unidad_fisica_ot_inmutable"');}
   await prisma.unidad_fisica_orden_trabajo.deleteMany({where:{id_cotizacion:cotizacionB2C.id_cotizacion}});await prisma.orden_trabajo.deleteMany({where:{orden_trabajo_id_orden:{in:unidades.map(u=>u.id_orden_trabajo)}}});
   const notas=await prisma.nota_venta.findMany({where:{id_cotizacion:cotizacionB2C.id_cotizacion},select:{id_nota_venta:true,id_proyecto_contexto:true}});const idsNota=notas.map(n=>n.id_nota_venta),idsProyecto=notas.map(n=>n.id_proyecto_contexto).filter(Boolean);const pagos=await prisma.asignacion_pago_cliente.findMany({where:{id_nota_venta:{in:idsNota}},select:{id_pago_cliente:true}});
   await prisma.asignacion_pago_cliente.deleteMany({where:{id_nota_venta:{in:idsNota}}});await prisma.pago_cliente.deleteMany({where:{id_pago_cliente:{in:pagos.map(p=>p.id_pago_cliente)}}});await prisma.proyecto_financiero.deleteMany({where:{id_nota_venta:{in:idsNota}}});await prisma.nota_venta.deleteMany({where:{id_nota_venta:{in:idsNota}}});if(idsProyecto.length){await prisma.proyecto_obra.deleteMany({where:{id_proyecto:{in:idsProyecto}}});await prisma.proyecto.deleteMany({where:{proyecto_proyecto_id:{in:idsProyecto}}});}await prisma.detalle_cotizacion.deleteMany({where:{id_cotizacion:cotizacionB2C.id_cotizacion}});await prisma.cotizacion.delete({where:{id_cotizacion:cotizacionB2C.id_cotizacion}});
  }
 });
});
