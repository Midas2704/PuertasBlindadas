const test=require('node:test');
const assert=require('node:assert/strict');
const {prisma}=require('../dist/db');
const {M2Controller}=require('../dist/controladores/M2Controller');
const {CATALOGO_PRODUCTORES_M9,ProductorAuditoriaM9}=require('../dist/m9/contratoProductor');

const habilitada=process.env.C3_1_PG18_AISLADO==='1';
const actor=910001n;
let moneda,material,precio;

test.before(async()=>{
  if(!habilitada)return;
  moneda=await prisma.moneda.upsert({where:{codigo_moneda:'CLP'},update:{estado_moneda:'activo'},create:{codigo_moneda:'CLP',nombre_moneda:'Peso chileno sintético',simbolo_moneda:'$'}});
  await prisma.material.upsert({where:{material_sku:'C31-MAT'},update:{material_estado:'activo'},create:{material_sku:'C31-MAT',material_nombre_material:'Material sintético C3.1',material_estado:'activo'}});
  material=await prisma.historial_precio_material.findFirst({where:{material_sku:'C31-MAT',id_moneda:moneda.id_moneda,estado_precio:'vigente'}})||await prisma.historial_precio_material.create({data:{material_sku:'C31-MAT',id_moneda:moneda.id_moneda,precio_unitario:10000,fecha_vigencia_inicio:new Date('2020-01-01T00:00:00Z'),estado_precio:'vigente'}});
  precio=await prisma.precio_producto_comercial.findFirst({where:{id_extension_producto_comercial:910001,segmento_comercial:'B2C',id_moneda:moneda.id_moneda,motivo:'Fixture C3.1 aislado'}})||await prisma.precio_producto_comercial.create({data:{id_extension_producto_comercial:910001,segmento_comercial:'B2C',id_moneda:moneda.id_moneda,monto:250000,vigencia_desde:new Date('2020-01-01T00:00:00Z'),vigencia_hasta:new Date('2032-12-31T00:00:00Z'),estado:'ACTIVO',motivo:'Fixture C3.1 aislado',creado_por:actor}});
});

test('C3.1 cataloga creación, edición y emisión en M9 sin duplicar por solicitud',async()=>{
  for(const operacion of ['guardarCotizacion','editarCotizacion','emitirCotizacion'])assert.equal(CATALOGO_PRODUCTORES_M9[operacion].modulo,'M2');
  let recepciones=0;const productor=new ProductorAuditoriaM9({recibir:async()=>{recepciones++;return{estado:'PERSISTIDO',evento:{id:1}}}});
  const actorM9={id:actor,permisos:[],configuracion:'',administrador:false};
  await productor.ejecutar('guardarCotizacion',actorM9,{idSolicitud:'c31-idempotente'},async()=>({id_cotizacion:1}));
  assert.equal(recepciones,1);
});

test('C3.1 persiste y recupera alternativas sin convertirlas en productos contratados', {skip:!habilitada}, async()=>{
  const m2=new M2Controller();
  const base={segmento_comercial:'B2C',id_ficha_cliente:910002,fecha_vigencia:'2026-12-31',margen_esperado:30,id_moneda:moneda.id_moneda,exento_iva:false,descuento_valor:0,requiere_instalacion:'NO',permitir_borrador_incompleto:false,productos:[{tipo_producto:'Puerta sintética',id_item_comercial:910001,id_producto_comercial:910001,id_producto_comercial_version:910001,id_precio_producto_comercial:precio.id_precio_producto_comercial.toString(),cantidad:1,medidas:'200x90x5',observaciones:'Configuración contratada',opcionales:[],materiales:[{id_historial_precio_material:material.id_historial_precio_material,cantidad:2}]}]};
  const creada=await m2.guardarCotizacion({...base,alternativas_b2c:[{id_producto_comercial:910001,id_producto_comercial_version:910001,id_precio_producto_comercial:precio.id_precio_producto_comercial.toString(),cantidad:1,configuracion:{alto:200,ancho:90},opcionales:[]}]},actor);
  assert.equal(creada.segmento_comercial,'B2C');
  assert.equal(creada.detalle_cotizacion.length,1);
  assert.equal(creada.grupos_alternativas_b2c[0].alternativas.length,1);
  const alternativa=creada.grupos_alternativas_b2c[0].alternativas[0];
  assert.equal(alternativa.estado,'PROPUESTA');
  assert.equal(creada.detalle_cotizacion[0].id_alternativa_b2c_aceptada,null);

  const editada=await m2.editarCotizacion(creada.id_cotizacion,{...base,revision:creada.revision,alternativas_b2c:[{id_alternativa_b2c:alternativa.id_alternativa_b2c.toString(),id_producto_comercial:910001,id_producto_comercial_version:910001,id_precio_producto_comercial:precio.id_precio_producto_comercial.toString(),cantidad:1,configuracion:{alto:205,ancho:95},opcionales:[]}]},actor);
  assert.equal(editada.grupos_alternativas_b2c[0].alternativas[0].id_alternativa_b2c,alternativa.id_alternativa_b2c);
  assert.equal(editada.grupos_alternativas_b2c[0].alternativas[0].revision,2);
  await assert.rejects(()=>m2.editarCotizacion(creada.id_cotizacion,{...base,revision:creada.revision,alternativas_b2c:[]},actor),error=>error.estado===409);

  const retirada=await m2.editarCotizacion(creada.id_cotizacion,{...base,revision:editada.revision,alternativas_b2c:[]},actor);
  assert.equal(retirada.grupos_alternativas_b2c[0].alternativas[0].estado,'RETIRADA');
  assert.equal(await prisma.historial_decision_alternativa_b2c.count({where:{id_alternativa_b2c:alternativa.id_alternativa_b2c}}),1);
  assert.equal(await prisma.nota_venta.count({where:{id_cotizacion:creada.id_cotizacion}}),0);
  assert.equal(await prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:creada.id_cotizacion}}),0);
});

test('C3.1 confirma que emisión permanece bloqueada sin PDF documental confirmado', {skip:!habilitada}, async()=>{
  const cotizacion=await prisma.cotizacion.findFirstOrThrow({where:{segmento_comercial:'B2C',estado_cotizacion:'borrador'},orderBy:{id_cotizacion:'desc'}});
  await assert.rejects(()=>new M2Controller().emitirCotizacion(cotizacion.id_cotizacion),/PDF documental confirmado/);
});

test.after(async()=>{await prisma.$disconnect()});
