const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { prisma } = require('../dist/db');
const { RepositorioDocumentalPrisma } = require('../dist/documental/repositorios/RepositorioDocumentalPrisma');
const { ServicioDocumentosProducto, MAPEO_TIPO_DOCUMENTAL_COMERCIAL } = require('../dist/documental/productos/ServicioDocumentosProducto');
const { AutorizadorDocumental } = require('../dist/documental/seguridad/AutorizacionDocumental');
const { MATRIZ_CAPACIDADES_DOCUMENTALES } = require('../dist/documental/seguridad/MatrizCapacidadesDocumentales');
const { PuenteM9DocumentosProducto, EVENTOS_DOCUMENTALES_PROPUESTOS } = require('../dist/documental/productos/IntegracionM9DocumentosProducto');

const marca = randomUUID().slice(0, 8);
const idsDocumentos = [];
const productos = [];
let familia;
let usuario;

const actor = permisos => ({ id: usuario.usuario_id_usuario, sesion:`sesion-${marca}`, permisos, administrador:false });
const datosVersion = (idDocumento, numero, estado = 'DISPONIBLE') => ({
  id_documento_logico:idDocumento, numero_version:numero, proveedor_logico:'R2', contenedor_logico:'pruebas',
  clave_objeto:`objects/${randomUUID()}`, nombre_original:`documento-${numero}.pdf`, nombre_seguro:`documento-${numero}.pdf`,
  mime_declarado:'application/pdf', mime_detectado:'application/pdf', tamano_bytes:BigInt(100 + numero),
  sha256:String(numero).padStart(64, 'a').slice(-64), estado, creado_por:usuario.usuario_id_usuario,
  validado_en:new Date(), resultado_validaciones:{ antivirus:{ estado:'LIMPIO' } },
});

async function crearDocumento(producto, tipo, titulo, opciones = {}) {
  const documento = await prisma.documento_logico.create({ data:{ titulo, clasificacion:'COMERCIAL', estado:opciones.estadoDocumento ?? 'ACTIVO', creado_por:usuario.usuario_id_usuario } });
  idsDocumentos.push(documento.id_documento_logico);
  if (opciones.historia) await prisma.version_documento.create({ data:datosVersion(documento.id_documento_logico, 1, 'REEMPLAZADO') });
  const numero = opciones.historia ? 2 : 1;
  await prisma.version_documento.create({ data:datosVersion(documento.id_documento_logico, numero, opciones.estadoVersion ?? 'DISPONIBLE') });
  await prisma.documento_logico.update({ where:{ id_documento_logico:documento.id_documento_logico }, data:{ numero_version_actual:numero } });
  await prisma.producto_comercial_documento.create({ data:{
    id_extension_producto_comercial:producto.id_extension_producto_comercial,
    id_documento_logico:documento.id_documento_logico, tipo_documento:tipo,
    orden_presentacion:opciones.orden ?? 0, es_imagen_principal:opciones.principal ?? false,
    habilitado_b2b:opciones.b2b ?? false, habilitado_b2c:opciones.b2c ?? false,
    estado:opciones.estadoAsociacion ?? 'ACTIVO', usuario_responsable:usuario.usuario_id_usuario,
  } });
  return documento;
}

test('Bloque 4.5B.1 — integración backend documental comercial', async t => {
  usuario = await prisma.usuario.create({ data:{ usuario_username:`docprod_${marca}`, usuario_estado_cuenta:'activa', usuario_fecha_de_creacion:new Date() } });
  familia = await prisma.familia_producto_comercial.create({ data:{ codigo:`DB-${marca}`.toUpperCase(), nombre:`Familia documental ${marca}`, creado_por:usuario.usuario_id_usuario, actualizado_por:usuario.usuario_id_usuario } });
  for (const sufijo of ['principal','ajeno','vacio']) productos.push(await prisma.extension_producto_comercial.create({ data:{ codigo_comercial:`${marca}-${sufijo}`.toUpperCase(), nombre_comercial:`Producto ${sufijo}`, id_familia_producto_comercial:familia.id_familia_producto_comercial, creado_por:usuario.usuario_id_usuario, actualizado_por:usuario.usuario_id_usuario } }));

  const foto = await crearDocumento(productos[0], 'FOTOGRAFIA_COMERCIAL', 'Fotografía principal', { principal:true, b2b:true, historia:true, orden:1 });
  await crearDocumento(productos[0], 'DIAGRAMA_TECNICO', 'Diagrama', { b2b:true, b2c:true, orden:2 });
  await crearDocumento(productos[0], 'FICHA_TECNICA', 'Ficha técnica', { b2c:true, orden:3 });
  await crearDocumento(productos[0], 'CATALOGO', 'Catálogo', { orden:4 });
  await crearDocumento(productos[0], 'OTRO_AUTORIZADO', 'Otro autorizado', { orden:5 });
  await crearDocumento(productos[0], 'FOTOGRAFIA_COMERCIAL', 'Foto en cuarentena', { estadoVersion:'CUARENTENA', orden:6 });
  await crearDocumento(productos[0], 'CATALOGO', 'Documento desactivado', { estadoDocumento:'INACTIVO', orden:7 });
  const ajeno = await crearDocumento(productos[1], 'FICHA_TECNICA', 'Documento ajeno');

  t.after(async () => {
    await prisma.producto_comercial_documento.deleteMany({ where:{ id_extension_producto_comercial:{ in:productos.map(p => p.id_extension_producto_comercial) } } });
    const versiones = await prisma.version_documento.findMany({ where:{ id_documento_logico:{ in:idsDocumentos } }, select:{ id_version_documento:true } });
    await prisma.variante_documento.deleteMany({ where:{ OR:[{ id_version_original:{ in:versiones.map(v=>v.id_version_documento) } },{ id_version_derivada:{ in:versiones.map(v=>v.id_version_documento) } }] } });
    await prisma.evento_operacional_documental.deleteMany({ where:{ id_documento_logico:{ in:idsDocumentos } } });
    await prisma.version_documento.deleteMany({ where:{ id_documento_logico:{ in:idsDocumentos } } });
    await prisma.documento_logico.deleteMany({ where:{ id_documento_logico:{ in:idsDocumentos } } });
    await prisma.extension_producto_comercial.deleteMany({ where:{ id_extension_producto_comercial:{ in:productos.map(p => p.id_extension_producto_comercial) } } });
    await prisma.familia_producto_comercial.delete({ where:{ id_familia_producto_comercial:familia.id_familia_producto_comercial } });
    await prisma.usuario.delete({ where:{ usuario_id_usuario:usuario.usuario_id_usuario } });
    await prisma.$disconnect();
  });

  const repositorio = new RepositorioDocumentalPrisma(prisma);
  const autorizaTodo = new AutorizadorDocumental(async () => true);
  const servicio = new ServicioDocumentosProducto(repositorio, autorizaTodo);
  const actorCompleto = actor(['CU360','CU367']);

  await t.test('01 consulta producto y separa fotografías de documentos técnicos', async () => {
    const salida=await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);
    assert.equal(salida.productoId,productos[0].id_extension_producto_comercial); assert.equal(salida.estadoIntegracion,'LISTO');
    assert.equal(salida.fotografias.length,2); assert.equal(salida.documentosTecnicos.length,4);
  });
  await t.test('02 producto inexistente responde sin filtrar otro documento', async () => await assert.rejects(servicio.listar(2147483647,actorCompleto),e=>e.codigo==='PRODUCTO_NO_ENCONTRADO'));
  await t.test('03 producto sin documentos entrega vacío autorizado', async () => {const s=await servicio.listar(productos[2].id_extension_producto_comercial,actorCompleto);assert.equal(s.estadoIntegracion,'VACIO');assert.deepEqual(s.documentos,[]);});
  await t.test('04 imagen principal exige fotografía disponible', async () => {const s=await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);assert.equal(s.fotografiaPrincipal.idDocumento,foto.id_documento_logico.toString());assert.equal(s.fotografiaPrincipal.estado,'DISPONIBLE');});
  await t.test('05 cuarentena no reemplaza fotografía principal', async () => {const s=await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);assert.notEqual(s.fotografiaPrincipal.titulo,'Foto en cuarentena');});
  await t.test('06 conserva orden de presentación', async () => {const s=await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);assert.deepEqual(s.documentos.map(d=>d.ordenPresentacion),[1,2,3,4,5,6]);});
  await t.test('07 conserva indicadores B2B y B2C', async () => {const s=await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);assert.equal(s.documentos[0].habilitadoB2b,true);assert.equal(s.documentos.find(d=>d.tipo==='FICHA_TECNICA').habilitadoB2c,true);});
  await t.test('08 excluye documento lógico desactivado', async () => {const s=await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);assert.equal(s.documentos.some(d=>d.titulo==='Documento desactivado'),false);});
  await t.test('09 informa versión no disponible sin habilitar vista previa', async () => {const s=await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);const q=s.documentos.find(d=>d.estado==='CUARENTENA');assert.equal(q.vistaPrevia,null);});
  await t.test('10 entrega historial autorizado y marca vigencia', async () => {const v=await servicio.consultarVersiones(productos[0].id_extension_producto_comercial,foto.id_documento_logico,actorCompleto);assert.equal(v.length,2);assert.equal(v.filter(x=>x.vigente).length,1);});
  await t.test('11 evita acceso horizontal por asociación', async () => await assert.rejects(servicio.consultarVersiones(productos[1].id_extension_producto_comercial,foto.id_documento_logico,actorCompleto),e=>e.codigo==='DOCUMENTO_PRODUCTO_NO_ENCONTRADO'));
  await t.test('12 no confunde documento ajeno con el producto consultado', async () => {const s=await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);assert.equal(s.documentos.some(d=>d.idDocumento===ajeno.id_documento_logico.toString()),false);});
  await t.test('13 serializa BigInt y tamaño sin perder precisión', async () => {const d=(await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto)).documentos[0];assert.equal(typeof d.idDocumento,'string');assert.equal(typeof d.idAsociacion,'string');assert.equal(typeof d.tamanoBytes,'string');});
  await t.test('14 serializa fechas ISO', async () => {const d=(await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto)).documentos[0];assert.equal(new Date(d.incorporadoEn).toISOString(),d.incorporadoEn);assert.equal(new Date(d.versiones[0].fechaCreacion).toISOString(),d.versiones[0].fechaCreacion);});
  await t.test('15 convierte explícitamente OTRO_AUTORIZADO', async () => {const s=await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);assert.ok(s.documentos.some(d=>d.tipo==='OTRO_DOCUMENTO_AUTORIZADO'));assert.equal(MAPEO_TIPO_DOCUMENTAL_COMERCIAL.OTRO_AUTORIZADO,'OTRO_DOCUMENTO_AUTORIZADO');});
  await t.test('16 cubre todas las categorías persistidas', () => assert.deepEqual(Object.keys(MAPEO_TIPO_DOCUMENTAL_COMERCIAL).sort(),['CATALOGO','DIAGRAMA_TECNICO','FICHA_TECNICA','FOTOGRAFIA_COMERCIAL','OTRO_AUTORIZADO'].sort()));
  await t.test('17 DTO no expone claves, proveedor, hash ni URL', async () => {const json=JSON.stringify(await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto));assert.doesNotMatch(json,/clave_objeto|contenedor_logico|proveedor_logico|sha256|https?:\/\//i);});
  await t.test('18 sin CU367 sólo entrega versión acotada y oculta responsable', async () => {const s=await servicio.listar(productos[0].id_extension_producto_comercial,actor(['CU360']));const d=s.documentos.find(x=>x.idDocumento===foto.id_documento_logico.toString());assert.equal(s.capacidades.consultarVersiones,false);assert.equal(d.versiones.length,1);assert.equal(d.versiones[0].responsableVisible,null);});
  await t.test('19 actor no autenticado queda rechazado', async () => await assert.rejects(servicio.listar(productos[0].id_extension_producto_comercial,{id:0n,sesion:'',permisos:['CU360'],administrador:false}),e=>e.codigo==='ACTOR_NO_AUTENTICADO'));
  await t.test('20 actor sin CU360 queda rechazado', async () => await assert.rejects(servicio.listar(productos[0].id_extension_producto_comercial,actor([])),e=>e.codigo==='ACCESO_DOCUMENTAL_DENEGADO'));
  await t.test('21 alcance backend impide acceso horizontal', async () => {const limitado=new ServicioDocumentosProducto(repositorio,new AutorizadorDocumental(async(_a,c)=>c.idProducto===productos[0].id_extension_producto_comercial));await assert.rejects(limitado.listar(productos[1].id_extension_producto_comercial,actorCompleto),e=>e.codigo==='ALCANCE_DOCUMENTAL_DENEGADO');});
  await t.test('22 administrador no obtiene una acción documental pendiente', async () => await assert.rejects(autorizaTodo.exigir({...actorCompleto,administrador:true},'DESCARGAR',{idProducto:productos[0].id_extension_producto_comercial}),e=>e.codigo==='PERMISO_DOCUMENTAL_NO_DEFINIDO'));
  await t.test('23 capacidades quedan cerradas salvo consultas aprobadas', async () => {const c=await servicio.consultarCapacidades(productos[0].id_extension_producto_comercial,actorCompleto);assert.equal(c.consultarMetadatos,true);assert.equal(c.consultarVersiones,true);for(const [k,v] of Object.entries(c))if(!['consultarMetadatos','consultarVersiones'].includes(k))assert.equal(v,false,k);});
  await t.test('24 matriz no concede perfiles ni reutiliza CU360 para descargas', () => {const descarga=MATRIZ_CAPACIDADES_DOCUMENTALES.find(x=>x.accion==='DESCARGAR');assert.equal(descarga.cuExistente,null);assert.equal(descarga.estadoAprobacion,'PENDIENTE_APROBACION');assert.ok(MATRIZ_CAPACIDADES_DOCUMENTALES.every(x=>x.perfilPropuesto==='POR_DEFINIR_POR_EMPRESA'));});
  await t.test('25 consulta no crea eventos ni activa outbox', async () => {const antes=await prisma.evento_operacional_documental.count({where:{id_documento_logico:{in:idsDocumentos}}});await servicio.listar(productos[0].id_extension_producto_comercial,actorCompleto);const despues=await prisma.evento_operacional_documental.count({where:{id_documento_logico:{in:idsDocumentos}}});assert.equal(despues,antes);});
  await t.test('26 puente M9 bloquea catálogo no aprobado', async () => {let llamadas=0;const puente=new PuenteM9DocumentosProducto({publicar:async()=>{llamadas++;return{aceptado:true,idempotente:false}}});await assert.rejects(puente.publicar({tipo:'DOCUMENTO_CONSULTADO',idempotencia:'x',actorId:'1',productoId:1,resultado:'EXITO',ocurridoEn:new Date().toISOString(),criticidad:'BAJA'}),e=>e.codigo==='EVENTO_M9_NO_APROBADO');assert.equal(llamadas,0);});
  await t.test('27 puente M9 delegado conserva idempotencia', async () => {const vistos=new Set();const puente=new PuenteM9DocumentosProducto({publicar:async e=>{const repetido=vistos.has(e.idempotencia);vistos.add(e.idempotencia);return{aceptado:true,idempotente:repetido}}},new Set(['DOCUMENTO_ASOCIADO_PRODUCTO']));const e={tipo:'DOCUMENTO_ASOCIADO_PRODUCTO',idempotencia:'idem',actorId:'1',productoId:1,resultado:'EXITO',ocurridoEn:new Date().toISOString(),criticidad:'MEDIA'};assert.equal((await puente.publicar(e)).idempotente,false);assert.equal((await puente.publicar(e)).idempotente,true);});
  await t.test('28 puente M9 rechaza datos sensibles', async () => {const puente=new PuenteM9DocumentosProducto({publicar:async()=>({aceptado:true,idempotente:false})},new Set(EVENTOS_DOCUMENTALES_PROPUESTOS));await assert.rejects(puente.publicar({tipo:'DOCUMENTO_CONSULTADO',idempotencia:'https://firma',actorId:'1',productoId:1,resultado:'EXITO',ocurridoEn:new Date().toISOString(),criticidad:'BAJA'}),e=>e.codigo==='EVENTO_M9_DATO_PROHIBIDO');});
});
