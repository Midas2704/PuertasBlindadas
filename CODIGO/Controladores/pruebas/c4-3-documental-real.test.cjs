const test=require('node:test');
const assert=require('node:assert/strict');
const {randomUUID,createHash}=require('node:crypto');

const habilitada=process.env.C43_E2E_AISLADO==='1';
const probarFallo=process.env.C43_FALLO_STORAGE==='1'||process.env.C43_FALLO_ANTIVIRUS==='1';
const requiereDb=habilitada||probarFallo;
const {prisma}=requiereDb?require('../dist/db'):{prisma:null};
const {M2Controller}=requiereDb?require('../dist/controladores/M2Controller'):{M2Controller:null};
const {ServicioDocumentosComerciales}=requiereDb?require('../dist/comercial/documentos/ServicioDocumentosComerciales'):{ServicioDocumentosComerciales:null};
const {ServicioEscrituraComercial}=requiereDb?require('../dist/comercial/ServicioEscrituraComercial'):{ServicioEscrituraComercial:null};
const {ServicioObraProyectoComercial}=requiereDb?require('../dist/comercial/ServicioObraProyectoComercial'):{ServicioObraProyectoComercial:null};
const {C_Finanzas}=requiereDb?require('../dist/controladores/C_Finanzas'):{C_Finanzas:null};
const {crearAplicacion}=requiereDb?require('../dist/app'):{crearAplicacion:null};
const actor={id:910001n,sesion:'aislada-c3.4',administrador:false,permisos:['CU18','CU19','CU20','CU24','CU25','CU355','CU368','CU375','CU376','CU378','CU379','CU380','CU381'],configuracion:'particular',cambiarClave:false,nombre:'Midas sintético C3.5',acceso:'total'};
let moneda,material,precioB2B,precioB2C,condiciones={},medioPago,categoriaPago;
const codigo=etiqueta=>`C43-${etiqueta}-${randomUUID().slice(0,8).toUpperCase()}`;

async function prepararBase(){
 moneda=await prisma.moneda.update({where:{id_moneda:910001},data:{codigo_moneda:'CLP',nombre_moneda:'Peso chileno sintético',simbolo_moneda:'$CLP',estado_moneda:'activo'}});
 await prisma.material.upsert({where:{material_sku:'C43-MAT'},update:{material_estado:'activo'},create:{material_sku:'C43-MAT',material_nombre_material:'Material sintético C4.3',material_estado:'activo'}});
 material=await prisma.historial_precio_material.findFirst({where:{material_sku:'C43-MAT',id_moneda:moneda.id_moneda,estado_precio:'vigente'}})||await prisma.historial_precio_material.create({data:{material_sku:'C43-MAT',id_moneda:moneda.id_moneda,precio_unitario:10000,fecha_vigencia_inicio:new Date('2020-01-01T00:00:00Z'),estado_precio:'vigente'}});
 const crearPrecio=async segmento=>await prisma.precio_producto_comercial.findFirst({where:{id_extension_producto_comercial:910001,segmento_comercial:segmento,id_moneda:moneda.id_moneda,estado:'ACTIVO'}})||prisma.precio_producto_comercial.create({data:{id_extension_producto_comercial:910001,segmento_comercial:segmento,id_moneda:moneda.id_moneda,monto:segmento==='B2B'?300000:250000,vigencia_desde:new Date('2026-01-01T00:00:00Z'),vigencia_hasta:new Date('2027-12-31T00:00:00Z'),estado:'ACTIVO',motivo:`Fixture C4.3 ${segmento} ${randomUUID()}`,creado_por:actor.id}});
 precioB2B=await crearPrecio('B2B');precioB2C=await crearPrecio('B2C');
 const area=await prisma.area_trabajo.findFirst({where:{area_trabajo_activo:true}})||await prisma.area_trabajo.create({data:{area_trabajo_nombre_area:'Fabricación sintética C4.3',area_trabajo_clasificacion:'produccion',area_trabajo_activo:true}});
 const tarea=await prisma.catalogo_tarea_fabricacion.create({data:{nombre:`Fabricación sintética ${randomUUID()}`,id_area_trabajo:area.area_trabajo_id_area,tiempo_estimado_min:20,creado_por:actor.id,actualizado_por:actor.id}});
 const plantilla=await prisma.plantilla_fabricacion_familia.findUniqueOrThrow({where:{id_familia_producto_comercial:910001},include:{versiones:{orderBy:{numero_version:'desc'},take:1}}});
 const numero=(plantilla.versiones[0]?.numero_version||0)+1;const contenido={etapas:[{id:randomUUID(),idAreaTrabajo:area.area_trabajo_id_area.toString(),nombre:'Fabricación',tareas:[{id:randomUUID(),idTareaFabricacion:tarea.id_tarea_fabricacion,nombre:'Fabricar puerta'}]}]};
 await prisma.version_plantilla_fabricacion.create({data:{id_plantilla_fabricacion:plantilla.id_plantilla_fabricacion,numero_version:numero,contenido,motivo:'Planificación sintética C3.4',publicado_por:actor.id}});
 await prisma.plantilla_fabricacion_familia.update({where:{id_plantilla_fabricacion:plantilla.id_plantilla_fabricacion},data:{numero_version_vigente:numero,borrador:contenido,revision:{increment:1},actualizado_por:actor.id}});
 medioPago=await prisma.medio_pago.upsert({where:{nombre_medio_pago:'Medio sintético C3.4'},update:{estado_medio_pago:'activo'},create:{nombre_medio_pago:'Medio sintético C3.4',estado_medio_pago:'activo',requiere_respaldo:true}});
 categoriaPago=await prisma.categoria_pago.upsert({where:{nombre:'Pago sintético C3.4'},update:{activo:true},create:{nombre:'Pago sintético C3.4',activo:true}});
 for(const segmento of ['B2B','B2C','CARTA_B2C']) condiciones[segmento]=await prisma.condicion_comercial.create({data:{codigo:codigo(`COND-${segmento}`),nombre:`Condición sintética ${segmento} C4.3`,segmento,creado_por:actor.id,versiones:{create:{numero_version:1,contenido:{texto:'Pago y garantía sintéticos para entorno aislado.'},vigencia_desde:new Date('2026-01-01T00:00:00Z'),vigencia_hasta:new Date('2027-12-31T00:00:00Z'),estado:'PUBLICADA',motivo:'Fixture aislado C4.3',publicado_por:actor.id,publicado_en:new Date()}}},include:{versiones:true}});
}

const producto=(precio,cantidad=1)=>({tipo_producto:'Puerta sintética',id_item_comercial:910001,id_producto_comercial:910001,id_producto_comercial_version:910001,id_precio_producto_comercial:precio.id_precio_producto_comercial.toString(),cantidad,medidas:'200x90x5',observaciones:'Fixture C4.3',opcionales:[],materiales:[{id_historial_precio_material:material.id_historial_precio_material,cantidad:2}]});
const base=(segmento,precio,ficha,cantidad=1)=>({segmento_comercial:segmento,id_ficha_cliente:ficha,fecha_vigencia:'2026-12-31',margen_esperado:30,id_moneda:moneda.id_moneda,exento_iva:false,descuento_valor:0,requiere_instalacion:'NO',permitir_borrador_incompleto:false,id_condicion_comercial_version:condiciones[segmento].versiones[0].id_condicion_comercial_version.toString(),productos:[producto(precio,cantidad)]});

test('C4.3 publica plantillas/carta y emite B2B/B2C con PDF real recuperable e idempotente',{skip:!habilitada,timeout:120000},async()=>{
 await prepararBase();const servicio=new ServicioDocumentosComerciales();
 const app=crearAplicacion(new C_Finanzas({autorizar:async()=>actor}));
 const servidor=await new Promise((resolve,reject)=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));s.on('error',reject)});
 const baseHttp=`http://127.0.0.1:${servidor.address().port}/api/finanzas`;
 const http=async(metodo,ruta,cuerpo)=>{const respuesta=await fetch(`${baseHttp}${ruta}`,{method:metodo,headers:{'content-type':'application/json','x-request-id':`c35-${randomUUID()}`,origin:'http://127.0.0.1:5174'},body:cuerpo===undefined?undefined:JSON.stringify(cuerpo)});const datos=await respuesta.json();if(!respuesta.ok){const error=new Error(datos.error||`HTTP ${respuesta.status}`);error.estado=respuesta.status;throw error}return datos};
 const publicarPlantilla=async segmento=>{const creada=await servicio.crearPlantilla({codigo:codigo(`TPL-${segmento}`),nombre:`Plantilla ${segmento} C4.3`,segmento,esquema:{titulo:`Documento ${segmento}`,secciones:['encabezado','productos','totales','condiciones']},idCondicionVersion:condiciones[segmento].versiones[0].id_condicion_comercial_version.toString(),motivo:'Creación aislada C4.3'},actor);return servicio.publicarPlantilla(creada.id_plantilla_documental,{revision:creada.revision,motivo:'Publicación aislada C4.3'},actor)};
 const tplB2B=await publicarPlantilla('B2B');
 const tplB2C=await publicarPlantilla('B2C');
 const tplCarta=await publicarPlantilla('CARTA_B2C');
 await assert.rejects(()=>prisma.plantilla_documental_version.update({where:{id_plantilla_documental_version:tplB2B.id_plantilla_documental_version},data:{motivo:'Mutación prohibida'}}),/inmutable/i);

 const carta=await servicio.crearCartaB2C({codigo:codigo('CARTA'),titulo:'Carta general sintética C4.3',contenido:{presentacion:'Presentación sintética sin datos reales.',modelos:[{idProductoVersion:910001,idPrecio:precioB2C.id_precio_producto_comercial.toString()}],condiciones:['Instalación según cobertura.']}},actor);
 const claveCarta=`c43:carta:${randomUUID()}`;
 const publicacion=await servicio.publicarCartaB2C(carta.id_carta_comercial_b2c,{revision:carta.revision,idPlantillaVersion:tplCarta.id_plantilla_documental_version.toString(),motivo:'Publicación aislada C4.3',claveIdempotencia:claveCarta},actor);
 const repetidaCarta=await servicio.publicarCartaB2C(carta.id_carta_comercial_b2c,{revision:carta.revision,idPlantillaVersion:tplCarta.id_plantilla_documental_version.toString(),motivo:'Publicación aislada C4.3',claveIdempotencia:claveCarta},actor);
 assert.equal(repetidaCarta.id_carta_comercial_b2c_version,publicacion.id_carta_comercial_b2c_version);
 const pdfCarta=await servicio.recuperarDocumentoCarta(carta.id_carta_comercial_b2c,publicacion.id_carta_comercial_b2c_version);
 assert.equal(Buffer.from(pdfCarta.contenido.split(',')[1],'base64').subarray(0,5).toString('ascii'),'%PDF-');

 const m2=new M2Controller();
 const servicioComercial=await new ServicioEscrituraComercial().ejecutar('CREAR_SERVICIO',{codigo:codigo('FLETE'),nombre:'Flete sintético C3.4',descripcion:'Servicio sin identidad física',unidadCobro:'GLOBAL',habilitadoB2b:true,habilitadoB2c:false,segmento:'B2B',idMoneda:moneda.id_moneda,monto:50000,vigenciaDesde:'2026-01-01',vigenciaHasta:'2027-12-31',motivo:'Prueba E2E C3.4',claveIdempotencia:`c34-servicio-${randomUUID()}`},actor);
 const b2b=await m2.guardarCotizacion({...base('B2B',precioB2B,910001,2),contactos_b2b:[{nombre:'Contacto',apellido:'Sintético',correo:'c43-b2b@example.test',telefono:'+56000000001',tipo_contacto:'COMERCIAL',es_principal:true}],servicios:[{id_servicio_comercial:servicioComercial.id,id_precio_servicio_comercial:servicioComercial.idPrecio,tipo_linea_comercial:'FLETE',cantidad:1,descripcion:'Flete contratado'}]},actor.id);
 const claveB2B=`c43:b2b:${randomUUID()}`;
 const emitidaB2B=await servicio.emitirCotizacion(b2b.id_cotizacion,{revision:b2b.revision,motivo:'Emisión B2B aislada C4.3',claveIdempotencia:claveB2B},actor);
 const repetidaB2B=await servicio.emitirCotizacion(b2b.id_cotizacion,{revision:b2b.revision,motivo:'Emisión B2B aislada C4.3',claveIdempotencia:claveB2B},actor);
 assert.equal(repetidaB2B.id_cotizacion_version,emitidaB2B.id_cotizacion_version);
 const historicoB2B=await servicio.recuperarDocumentoCotizacion(b2b.id_cotizacion,emitidaB2B.id_cotizacion_version);
 const bufferB2B=Buffer.from(historicoB2B.contenido.split(',')[1],'base64');assert.equal(createHash('sha256').update(bufferB2B).digest('hex'),historicoB2B.sha256);
 const historialSeguro=await servicio.historialCotizacion(b2b.id_cotizacion);assert.equal(historialSeguro[0].estadoDocumental,'DISPONIBLE');assert.equal(historialSeguro[0].documento.archivo.sha256,historicoB2B.sha256);assert.doesNotMatch(JSON.stringify(historialSeguro,(_clave,valor)=>typeof valor==='bigint'?valor.toString():valor),/clave_objeto|contenedor_logico|version_proveedor/);
 const planB2B=await m2.obtenerPlanificacionAprobacionCotizacion(b2b.id_cotizacion);assert.equal(planB2B.totalOt,2);
 const aprobadaB2B=await m2.aprobarCotizacionB2B(b2b.id_cotizacion,{folioOrdenCompra:`OC-${randomUUID()}`,respaldoOrdenCompra:'Respaldo sintético C3.4',planificaciones:planB2B.planificaciones},actor.id);
 assert.equal(aprobadaB2B.ordenesTrabajo.length,2);assert.equal(await prisma.nota_venta.count({where:{id_cotizacion:b2b.id_cotizacion}}),1);assert.equal(await prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:b2b.id_cotizacion}}),2);
 await assert.rejects(()=>m2.aprobarCotizacionB2B(b2b.id_cotizacion,{folioOrdenCompra:`OC-REINTENTO-${randomUUID()}`,respaldoOrdenCompra:'No debe duplicar',planificaciones:planB2B.planificaciones},actor.id),error=>error.estado===409);
 assert.equal(await prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:b2b.id_cotizacion}}),2);

 const b2c=await m2.guardarCotizacion({...base('B2C',precioB2C,910002),alternativas_b2c:[
  {id_producto_comercial:910001,id_producto_comercial_version:910001,id_precio_producto_comercial:precioB2C.id_precio_producto_comercial.toString(),cantidad:1,configuracion:{modelo:'A'},opcionales:[]},
  {id_producto_comercial:910001,id_producto_comercial_version:910001,id_precio_producto_comercial:precioB2C.id_precio_producto_comercial.toString(),cantidad:3,configuracion:{modelo:'B'},opcionales:[]},
  {id_producto_comercial:910001,id_producto_comercial_version:910001,id_precio_producto_comercial:precioB2C.id_precio_producto_comercial.toString(),cantidad:2,configuracion:{modelo:'C'},opcionales:[]},
 ]},actor.id);
 const emitidaB2C=await http('POST',`/billing/quotes/${b2c.id_cotizacion}/emitir`,{revision:b2c.revision,motivo:'Emisión B2C aislada C4.3',claveIdempotencia:`c43:b2c:${randomUUID()}`});
 const historicoB2C=await servicio.recuperarDocumentoCotizacion(b2c.id_cotizacion,emitidaB2C.id_cotizacion_version);
 const textoB2C=Buffer.from(historicoB2C.contenido.split(',')[1],'base64').toString('latin1');
 assert.match(textoB2C,/ALTERNATIVA A/);assert.match(textoB2C,/no se suman entre sí/);
 const grupo=b2c.grupos_alternativas_b2c[0];const seleccionada=grupo.alternativas.find(a=>a.numero_alternativa===2);
 const seleccion=await http('POST',`/billing/quotes/${b2c.id_cotizacion}/alternativas/seleccionar`,{idAlternativa:seleccionada.id_alternativa_b2c.toString(),revision:grupo.revision,motivo:'El cliente selecciona alternativa B'});
 const claveAceptacion=`c34:aceptar:${randomUUID()}`;const aceptada=await http('POST',`/billing/quotes/${b2c.id_cotizacion}/alternativas/aceptar`,{revisionGrupo:seleccion.revision,claveIdempotencia:claveAceptacion,motivo:'Aceptación E2E C3.4'});
 const repetidaAceptacion=await m2.aceptarAlternativaB2C(b2c.id_cotizacion,{revisionGrupo:seleccion.revision,claveIdempotencia:claveAceptacion,motivo:'Aceptación E2E C3.4'},actor.id);assert.deepEqual(repetidaAceptacion,aceptada);
 const detalleAceptado=await prisma.detalle_cotizacion.findUniqueOrThrow({where:{id_detalle_cotizacion:aceptada.idDetalle}});assert.equal(detalleAceptado.cantidad_item.toNumber(),3);
 assert.deepEqual((await prisma.alternativa_b2c.findMany({where:{id_grupo_alternativas_b2c:grupo.id_grupo_alternativas_b2c},orderBy:{numero_alternativa:'asc'}})).map(a=>a.estado),['RECHAZADA','ACEPTADA','RECHAZADA']);
 const planB2C=await m2.obtenerPlanificacionAprobacionCotizacion(b2c.id_cotizacion);assert.equal(planB2C.totalOt,3);
 const ventaB2C=await http('POST',`/cotizaciones/${b2c.id_cotizacion}/consolidar-b2c`,{monto:Number(seleccionada.monto_total),idMedio:medioPago.id_medio_pago,idCategoria:categoriaPago.id_categoria_pago,respaldo:'Pago sintético C3.4',antecedentesMedio:'Prueba aislada',tipoCambio:1,planificaciones:planB2C.planificaciones});
 assert.equal(ventaB2C.ordenesTrabajo.length,3);assert.equal(await prisma.nota_venta.count({where:{id_cotizacion:b2c.id_cotizacion}}),1);assert.equal(await prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:b2c.id_cotizacion}}),3);
 await assert.rejects(()=>m2.consolidarB2C(b2c.id_cotizacion,{monto:Number(seleccionada.monto_total),idMedio:medioPago.id_medio_pago,idCategoria:categoriaPago.id_categoria_pago,respaldo:'Reintento',antecedentesMedio:'No duplicar',tipoCambio:1,planificaciones:planB2C.planificaciones},actor.id),error=>error.estado===409);
 assert.equal(await prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:b2c.id_cotizacion}}),3);
 const historicoB2CDespues=await servicio.recuperarDocumentoCotizacion(b2c.id_cotizacion,emitidaB2C.id_cotizacion_version);assert.equal(historicoB2CDespues.sha256,historicoB2C.sha256);

 // C3.5: una Obra física compartida por pedidos distintos y caso exacto de diez puertas.
 const obrasServicio=new ServicioObraProyectoComercial();
 const obra=await obrasServicio.registrar({nombre:'Melín 7019',direccion:'Melín 7019',region:'Metropolitana',ciudad:'Santiago',comuna:'Quinta Normal',referencia:codigo('MELIN')},actor.id);
 assert.equal(await prisma.proyecto_obra.count({where:{id_obra:BigInt(obra.id)}}),0,'una Obra puede existir sin Proyecto');
 await assert.rejects(()=>obrasServicio.registrar({nombre:'Duplicada',direccion:'Melín 7019',region:'Metropolitana',ciudad:'Santiago',comuna:'Quinta Normal'},actor.id),error=>error.estado===409);
 const unidadA=await obrasServicio.registrar({nombre:'Melín 7021 A',direccion:'Melín 7021',region:'Metropolitana',ciudad:'Santiago',comuna:'Quinta Normal',edificio:'Torre 1',unidad:'A',confirmarCoincidenciaAmbigua:true},actor.id);
 const unidadB=await obrasServicio.registrar({nombre:'Melín 7021 B',direccion:'Melín 7021',region:'Metropolitana',ciudad:'Santiago',comuna:'Quinta Normal',edificio:'Torre 1',unidad:'B',confirmarCoincidenciaAmbigua:true},actor.id);
 assert.notEqual(unidadA.id,unidadB.id,'unidades físicas distintas no se fusionan automáticamente');
 assert.equal((await prisma.cotizacion.findUniqueOrThrow({where:{id_cotizacion:910002}})).id_obra_contexto,null,'cotización histórica sin Obra permanece sin asignación inferida');
 const productosMaestrosAntes=await prisma.extension_producto_comercial.count();
 const cotizacion10=await m2.guardarCotizacion({...base('B2B',precioB2B,910001,10),id_obra_contexto:obra.id,nombre_proyecto:'Pedido 2026',referencia_comercial:'Proyecto A',direccion_instalacion:'Melín 7019',region_instalacion:'Metropolitana',ciudad_instalacion:'Santiago',comuna_instalacion:'Quinta Normal',contactos_b2b:[{nombre:'Contacto',apellido:'Diez puertas',correo:'diez@example.test',telefono:'+56000000010',tipo_contacto:'OBRA',es_principal:true}]},actor.id);
 await http('POST',`/billing/quotes/${cotizacion10.id_cotizacion}/emitir`,{revision:cotizacion10.revision,motivo:'Emisión diez puertas C3.5',claveIdempotencia:`c35:diez:${randomUUID()}`});
 const plan10=await http('GET',`/billing/quotes/${cotizacion10.id_cotizacion}/work-order-planning`);assert.equal(plan10.totalOt,10);
 const aprobacion10=await http('POST',`/billing/quotes/${cotizacion10.id_cotizacion}/accept-b2b`,{folioOrdenCompra:`OC-10-${randomUUID()}`,respaldoOrdenCompra:'Respaldo sintético diez puertas',planificaciones:plan10.planificaciones});
 assert.equal(aprobacion10.ordenesTrabajo.length,10);assert.equal(await prisma.nota_venta.count({where:{id_cotizacion:cotizacion10.id_cotizacion}}),1);
 const unidades10=await prisma.unidad_fisica_orden_trabajo.findMany({where:{id_cotizacion:cotizacion10.id_cotizacion},include:{orden_trabajo:true}});
 assert.equal(unidades10.length,10);assert.equal(new Set(unidades10.map(u=>u.id_unidad_fisica_ot.toString())).size,10);assert.ok(unidades10.every(u=>u.orden_trabajo.proyecto_id_proyecto!==null));
 await assert.rejects(()=>m2.aprobarCotizacionB2B(cotizacion10.id_cotizacion,{folioOrdenCompra:`OC-10-R-${randomUUID()}`,respaldoOrdenCompra:'No duplicar',planificaciones:plan10.planificaciones},actor.id),error=>error.estado===409);
 assert.equal(await prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:cotizacion10.id_cotizacion}}),10);assert.equal(await prisma.extension_producto_comercial.count(),productosMaestrosAntes);

 const cotizacion2029=await m2.guardarCotizacion({...base('B2B',precioB2B,910001,1),id_obra_contexto:obra.id,nombre_proyecto:'Pedido 2029',referencia_comercial:'Proyecto B',direccion_instalacion:'Melín 7019',region_instalacion:'Metropolitana',ciudad_instalacion:'Santiago',comuna_instalacion:'Quinta Normal',contactos_b2b:[{nombre:'Contacto',apellido:'Nuevo pedido',correo:'nuevo@example.test',telefono:'+56000000029',tipo_contacto:'OBRA',es_principal:true}]},actor.id);
 await servicio.emitirCotizacion(cotizacion2029.id_cotizacion,{revision:cotizacion2029.revision,motivo:'Emisión segundo proyecto C3.5',claveIdempotencia:`c35:2029:${randomUUID()}`},actor);
 const plan2029=await m2.obtenerPlanificacionAprobacionCotizacion(cotizacion2029.id_cotizacion);
 await m2.aprobarCotizacionB2B(cotizacion2029.id_cotizacion,{folioOrdenCompra:`OC-2029-${randomUUID()}`,respaldoOrdenCompra:'Respaldo sintético segundo proyecto',planificaciones:plan2029.planificaciones},actor.id);
 const obraPersistida=await prisma.obra.findUniqueOrThrow({where:{obra_obra_id:BigInt(obra.id)},include:{proyectos_vinculados:{include:{proyecto:true}},cotizaciones_contexto:true}});
 assert.equal(obraPersistida.proyectos_vinculados.filter(v=>[cotizacion10.id_cotizacion,cotizacion2029.id_cotizacion].includes(v.proyecto.id_cotizacion_origen)).length,2);
 assert.equal(new Set(obraPersistida.proyectos_vinculados.filter(v=>[cotizacion10.id_cotizacion,cotizacion2029.id_cotizacion].includes(v.proyecto.id_cotizacion_origen)).map(v=>v.id_proyecto.toString())).size,2);
 assert.equal(obraPersistida.cotizaciones_contexto.filter(c=>[cotizacion10.id_cotizacion,cotizacion2029.id_cotizacion].includes(c.id_cotizacion)).length,2);
 const documentos=await prisma.documento_logico.findMany({where:{id_documento_logico:{in:[emitidaB2B.id_documento_logico,emitidaB2C.id_documento_logico,publicacion.id_documento_logico]}},include:{versiones:true}});
 assert.equal(documentos.length,3);assert.ok(documentos.every(d=>d.versiones.length===1&&d.versiones[0].estado==='DISPONIBLE'&&d.versiones[0].sha256));
 await new Promise(resolve=>servidor.close(resolve));
});

test('C4.3 mantiene la cotización en borrador si storage o antivirus real no está disponible',{
 skip:!probarFallo,timeout:60000,
},async()=>{
 await prepararBase();
 const m2=new M2Controller();
 const cotizacion=await m2.guardarCotizacion({...base('B2B',precioB2B,910001),contactos_b2b:[{nombre:'Fallo',apellido:'Controlado',correo:'fallo-c43@example.test',telefono:'+56000000009',tipo_contacto:'COMERCIAL',es_principal:true}]},actor.id);
 const servicio=new ServicioDocumentosComerciales();
 await assert.rejects(()=>servicio.emitirCotizacion(cotizacion.id_cotizacion,{revision:cotizacion.revision,motivo:'Prueba fail-closed C4.3',claveIdempotencia:`c43:fallo:${randomUUID()}`},actor),/storage|antivirus|conexi|disponible|ECONN|aprobado/i);
 const despues=await prisma.cotizacion.findUniqueOrThrow({where:{id_cotizacion:cotizacion.id_cotizacion}});
 assert.equal(despues.estado_cotizacion,'borrador');
 assert.equal(await prisma.cotizacion_version.count({where:{id_cotizacion:cotizacion.id_cotizacion,tipo_version:'EMISION'}}),0);
});

test.after(async()=>{if(habilitada)await prisma.$disconnect()});
