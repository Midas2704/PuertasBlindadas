const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { prisma } = require('../dist/db');
const { M2Controller } = require('../dist/controladores/M2Controller');
const { C_Finanzas } = require('../dist/controladores/C_Finanzas');
const { ProductorAuditoriaM9, CATALOGO_PRODUCTORES_M9 } = require('../dist/m9/contratoProductor');
const { permiteOperacion, dependenciasPermiso, moduloPermiso, matrizPermisosPorCU } = require('../dist/validaciones/permisos');

const m2 = new M2Controller();
const sufijo = randomUUID().slice(0, 8).toUpperCase();
let usuario; let item; let inventario; let familia; let producto;

after(async () => {
  if (producto) {
    await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."producto_comercial_version" DISABLE TRIGGER "trg_producto_comercial_version_inmutable"');
    await prisma.producto_comercial_version.deleteMany({ where: { id_extension_producto_comercial: producto.id_extension_producto_comercial } });
    await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."producto_comercial_version" ENABLE TRIGGER "trg_producto_comercial_version_inmutable"');
    await prisma.historial_producto_comercial.deleteMany({ where: { id_extension_producto_comercial: producto.id_extension_producto_comercial } });
    await prisma.extension_producto_comercial.deleteMany({ where: { id_extension_producto_comercial: producto.id_extension_producto_comercial } });
  }
  if (familia) {
    await prisma.historial_familia_producto_comercial.deleteMany({ where: { id_familia_producto_comercial: familia.id_familia_producto_comercial } });
    await prisma.familia_producto_comercial.deleteMany({ where: { id_familia_producto_comercial: familia.id_familia_producto_comercial } });
  }
  await prisma.$disconnect();
});

test('M2 mantenedor comercial de productos y familias', async t => {
  const schema = readFileSync(resolve('prisma/schema.prisma'), 'utf8');
  const migracion = readFileSync(resolve('prisma/migrations/054_mantenedor_productos_comerciales/migration.sql'), 'utf8');
  const controlador = readFileSync(resolve('src/controladores/M2Controller.ts'), 'utf8');
  const rutas = readFileSync(resolve('src/rutas/finanzas.ts'), 'utf8');
  const vista = readFileSync(resolve('../Vistas/src/views/Mantenedores/ProductosFamilias.tsx'), 'utf8');
  const panel = readFileSync(resolve('../Vistas/src/views/Mantenedores/Mantenedores.tsx'), 'utf8');
  usuario = await prisma.usuario.findFirstOrThrow();
  item = await prisma.item_comercial.findFirstOrThrow({ where: { estado_item: 'activo', extensiones_comerciales: { none: {} } } });
  inventario = await prisma.producto_terminado.findFirst({ where: { producto_terminado_activo: { not: false }, extensiones_comerciales: { none: {} } } });

  await t.test('01 migración es incremental y crea sólo tablas en Finanzas', () => { assert.match(migracion,/CREATE TABLE "finanzas"\."familia_producto_comercial"/); assert.doesNotMatch(migracion,/CREATE TABLE "(?:terreno|inventario)"/); });
  await t.test('02 reutiliza item_comercial por FK real', () => assert.match(migracion,/REFERENCES "terreno"\."item_comercial"\("id_item_comercial"\)/));
  await t.test('03 reutiliza producto_terminado por FK opcional', () => assert.match(migracion,/REFERENCES "inventario"\."producto_terminado"\("producto_terminado_id_producto"\)/));
  await t.test('04 no altera tablas propietarias externas', () => assert.doesNotMatch(migracion,/ALTER TABLE "(?:terreno|inventario)"/));
  await t.test('05 crear familia válida', async () => { familia = await m2.crearFamiliaProductoComercial({ codigo:`QA-${sufijo}`, nombre:`Familia QA ${sufijo}`, descripcion:'Familia focal' }, usuario.usuario_id_usuario); assert.equal(familia.estado,'ACTIVA'); });
  await t.test('06 normaliza código de familia', () => assert.equal(familia.codigo,`QA-${sufijo}`));
  await t.test('07 rechaza código duplicado', async () => await assert.rejects(m2.crearFamiliaProductoComercial({ codigo:`qa-${sufijo}`, nombre:'Duplicada' }, usuario.usuario_id_usuario), e=>e.estado===409));
  await t.test('08 edita familia con revisión vigente', async () => { familia=await m2.actualizarFamiliaProductoComercial(familia.id_familia_producto_comercial,{revision:familia.revision,nombre:`Familia editada ${sufijo}`},usuario.usuario_id_usuario);assert.equal(familia.revision,2); });
  await t.test('09 rechaza edición concurrente de familia', async () => await assert.rejects(m2.actualizarFamiliaProductoComercial(familia.id_familia_producto_comercial,{revision:1,nombre:'Antigua'},usuario.usuario_id_usuario),e=>e.estado===409));
  await t.test('10 conserva historial de familia', async () => {const h=await m2.historialFamiliaProductoComercial(familia.id_familia_producto_comercial);assert.ok(h.historial.length>=2);});
  await t.test('11 crea ficha comercial como borrador no cotizable', async () => { producto=await m2.crearProductoComercial({codigoComercial:`PROD-${sufijo}`,nombreComercial:`Producto QA ${sufijo}`,idFamilia:familia.id_familia_producto_comercial,descripcionB2b:'Descripción empresa',descripcionB2c:'Descripción persona',caracteristicasTecnicas:{tipoEstructura:'Acero'},caracteristicasDestacadas:['Configuración administrable']},usuario.usuario_id_usuario);assert.equal(producto.estado,'BORRADOR');assert.equal(producto.id_item_comercial,null); });
  await t.test('12 rechaza código comercial duplicado', async () => await assert.rejects(m2.crearProductoComercial({codigoComercial:`prod-${sufijo}`,nombreComercial:'Duplicado',idFamilia:familia.id_familia_producto_comercial},usuario.usuario_id_usuario),e=>e.estado===409));
  await t.test('13 rechaza familia inexistente', async () => await assert.rejects(m2.crearProductoComercial({codigoComercial:`OTRO-${sufijo}`,nombreComercial:'Sin familia',idFamilia:999999999},usuario.usuario_id_usuario),e=>e.estado===409));
  await t.test('14 valida estructura técnica extensible', async () => await assert.rejects(m2.crearProductoComercial({codigoComercial:`OTRO-${sufijo}`,nombreComercial:'Campo inválido',idFamilia:familia.id_familia_producto_comercial,caracteristicasTecnicas:{precio:'No corresponde'}},usuario.usuario_id_usuario),e=>e.estado===400));
  await t.test('15 edita borrador y conserva B2B/B2C', async () => {producto=await m2.actualizarProductoComercial(producto.id_extension_producto_comercial,{revision:producto.revision,descripcionB2b:'B2B revisada',descripcionB2c:'B2C revisada'},usuario.usuario_id_usuario);assert.equal(producto.descripcion_b2b,'B2B revisada');assert.equal(producto.descripcion_b2c,'B2C revisada');});
  await t.test('16 rechaza edición concurrente de producto', async () => await assert.rejects(m2.actualizarProductoComercial(producto.id_extension_producto_comercial,{revision:1,nombreComercial:'Desactualizado'},usuario.usuario_id_usuario),e=>e.estado===409));
  await t.test('17 no vincula por similitud de nombre', () => {const bloque=controlador.slice(controlador.indexOf('async vincularProductoComercial'),controlador.indexOf('async publicarVersionProductoComercial'));assert.doesNotMatch(bloque,/nombre_item.*contains|nombre_item.*equals/);});
  await t.test('18 rechaza vínculo de Terreno inexistente', async () => await assert.rejects(m2.vincularProductoComercial(producto.id_extension_producto_comercial,{revision:producto.revision,idItemComercial:999999999,idProductoTerminado:null,motivo:'Prueba inválida'},usuario.usuario_id_usuario),e=>e.estado===409));
  await t.test('19 vincula explícitamente con Terreno', async () => {producto=await m2.vincularProductoComercial(producto.id_extension_producto_comercial,{revision:producto.revision,idItemComercial:item.id_item_comercial,idProductoTerminado:inventario?.producto_terminado_id_producto?.toString()||null,motivo:'Vínculos focales'},usuario.usuario_id_usuario);assert.equal(producto.estado,'VINCULADO');assert.equal(producto.id_item_comercial,item.id_item_comercial);});
  await t.test('20 vínculo opcional de Inventario conserva ID', () => {if(inventario)assert.equal(producto.producto_terminado_id_producto,inventario.producto_terminado_id_producto);else assert.equal(producto.producto_terminado_id_producto,null);});
  await t.test('21 impide asociación duplicada por índice único', () => {assert.match(migracion,/"id_item_comercial" INTEGER UNIQUE/);assert.match(migracion,/"producto_terminado_id_producto" BIGINT UNIQUE/);});
  await t.test('22 familia usada no puede desactivarse', async () => await assert.rejects(m2.cambiarEstadoFamiliaProductoComercial(familia.id_familia_producto_comercial,false,{revision:familia.revision,motivo:'Intento'},usuario.usuario_id_usuario),e=>e.estado===409));
  await t.test('23 desactiva producto sin borrarlo', async () => {producto=await m2.cambiarEstadoProductoComercial(producto.id_extension_producto_comercial,false,{revision:producto.revision,motivo:'Pausa comercial'},usuario.usuario_id_usuario);assert.equal(producto.estado,'INACTIVO');assert.equal(await prisma.extension_producto_comercial.count({where:{id_extension_producto_comercial:producto.id_extension_producto_comercial}}),1);});
  await t.test('24 un producto inactivo no se edita', async () => await assert.rejects(m2.actualizarProductoComercial(producto.id_extension_producto_comercial,{revision:producto.revision,nombreComercial:'No permitido'},usuario.usuario_id_usuario),e=>e.estado===409));
  await t.test('25 reactiva producto según vínculo operativo', async () => {producto=await m2.cambiarEstadoProductoComercial(producto.id_extension_producto_comercial,true,{revision:producto.revision,motivo:'Reactivar catálogo'},usuario.usuario_id_usuario);assert.equal(producto.estado,'VINCULADO');});
  await t.test('26 versión publicada tiene clave única concurrente', () => assert.match(migracion,/UNIQUE \("id_extension_producto_comercial", "numero_version"\)/));
  await t.test('27 publicación usa transacción serializable', () => {const bloque=controlador.slice(controlador.indexOf('async publicarVersionProductoComercial'),controlador.indexOf('async obtenerProductoComercial'));assert.match(bloque,/TransactionIsolationLevel\.Serializable/);});
  await t.test('28 publicación exige producto vinculado', () => assert.match(controlador,/Sólo un producto vinculado a un ítem operativo activo puede publicarse/));
  await t.test('29 versión guarda snapshot comercial completo', () => {for(const campo of ['descripcion_b2b','descripcion_b2c','garantia_referencial','condiciones_particulares','caracteristicas_tecnicas'])assert.match(schema,new RegExp(campo));});
  await t.test('30 versiones publicadas son inmutables en base de datos', () => assert.match(migracion,/BEFORE UPDATE OR DELETE ON "finanzas"\."producto_comercial_version"/));
  await t.test('31 no existe endpoint de eliminación física', () => {assert.doesNotMatch(rutas,/delete\('\/mantenedores/);assert.doesNotMatch(controlador,/producto_comercial\.delete/);});
  await t.test('32 permisos distinguen las ocho capacidades', () => {for(let n=360;n<=367;n++)assert.ok(dependenciasPermiso[`CU${n}`]);assert.equal(moduloPermiso('CU365'),'M2');});
  await t.test('33 denegación por defecto para perfiles funcionales', () => {for(let n=360;n<=367;n++)assert.deepEqual(matrizPermisosPorCU[`CU${n}`],[]);});
  await t.test('34 consulta autorizada sólo con CU360', () => {assert.equal(permiteOperacion('listarProductosComerciales',['CU360']),true);assert.equal(permiteOperacion('listarProductosComerciales',['CU14']),false);});
  await t.test('35 escritura separa crear, modificar y publicar', () => {assert.equal(permiteOperacion('crearProductoComercial',['CU361']),true);assert.equal(permiteOperacion('actualizarProductoComercial',['CU361']),false);assert.equal(permiteOperacion('publicarVersionProductoComercial',['CU362']),false);});
  await t.test('36 autorización de fachada impide invocar owner', async () => {let llamada=false;const f=new C_Finanzas({autorizar:async()=>{const e=new Error('No autorizado');e.estado=403;throw e;}},{},{listarProductosComerciales:async()=>{llamada=true}},{},{},{},{},{},{},{});await assert.rejects(f.ejecutar('listarProductosComerciales',{contexto:{}}),e=>e.estado===403);assert.equal(llamada,false);});
  await t.test('37 M9 cataloga creación, modificación, publicación y vínculo', () => {for(const op of ['crearFamiliaProductoComercial','actualizarProductoComercial','publicarVersionProductoComercial','vincularProductoComercial'])assert.equal(CATALOGO_PRODUCTORES_M9[op].modulo,'M2');});
  await t.test('38 productor M9 emite una sola vez por operación', async () => {let recepciones=0;const receptor={recibir:async()=>{recepciones++;return{estado:'PERSISTIDO',evento:{id:1}}}};const productor=new ProductorAuditoriaM9(receptor);await productor.ejecutar('crearProductoComercial',{id:usuario.usuario_id_usuario,permisos:[],configuracion:'',administrador:false},{idSolicitud:`QA-${sufijo}`},async()=>({id:1}));assert.equal(recepciones,1);});
  await t.test('39 rutas CRUD y de historial pasan por C_Finanzas', () => {for(const ruta of ['familias-producto','productos/:id/versiones','productos/:id/vinculaciones','productos/:id/historial'])assert.match(rutas,new RegExp(ruta.replace(/[/:]/g,'.')));});
  await t.test('40 UI organiza ficha por secciones y sin carga de archivos', () => {for(const titulo of ['Identificación','Características del modelo','Información comercial','Vinculaciones','Versiones e historial','Imágenes y documentos'])assert.match(vista,new RegExp(titulo));assert.doesNotMatch(vista,/type="file"/);});
  await t.test('41 tarjeta queda disponible y protegida', () => {assert.match(panel,/Productos y familias[\s\S]*estado: 'DISPONIBLE'/);assert.match(panel,/mantenedores\/productos/);assert.match(panel,/CU360/);});
  await t.test('42 M2 conserva catálogo operativo legado', async () => {const productos=await m2.listarProductos();assert.ok(productos.some(p=>p.id_item_comercial===item.id_item_comercial));assert.match(controlador,/async listarProductos\(\).*item_comercial/);});
  await t.test('43 M7 conserva item_comercial como fuente histórica', () => {const m7=readFileSync(resolve('src/controladores/M7Controller.ts'),'utf8');assert.match(m7,/detalle_cotizacion: \{ include: \{ item_comercial: true/);});
  await t.test('44 Inventario y Terreno no fueron escritos por el mantenedor', async () => {assert.equal((await prisma.item_comercial.findUnique({where:{id_item_comercial:item.id_item_comercial}})).nombre_item,item.nombre_item);if(inventario)assert.equal((await prisma.producto_terminado.findUnique({where:{producto_terminado_id_producto:inventario.producto_terminado_id_producto}})).producto_terminado_nombre_producto,inventario.producto_terminado_nombre_producto);});
  await t.test('45 historial de producto registra estados y vínculos', async () => {const d=await m2.obtenerProductoComercial(producto.id_extension_producto_comercial,true);const eventos=new Set(d.historial.map(h=>h.evento));for(const e of ['CREACION','MODIFICACION_BORRADOR','CAMBIO_VINCULACION','DESACTIVACION','REACTIVACION'])assert.ok(eventos.has(e));});
  await t.test('46 publica una versión comercial real', async () => {const v=await m2.publicarVersionProductoComercial(producto.id_extension_producto_comercial,{revision:producto.revision,motivo:'Primera publicación focal',vigenciaDesde:'2026-10-11'},usuario.usuario_id_usuario);assert.equal(v.numero_version,1);producto=await m2.obtenerProductoComercial(producto.id_extension_producto_comercial);assert.equal(producto.numero_version_vigente,1);});
  await t.test('47 consulta la versión anterior sin sobrescribirla', async () => {const d=await m2.obtenerProductoComercial(producto.id_extension_producto_comercial);assert.equal(d.versiones.length,1);assert.equal(d.versiones[0].descripcion_b2b,'B2B revisada');});
  await t.test('48 editar una ficha publicada prepara y publica una nueva versión', async () => {producto=await m2.actualizarProductoComercial(producto.id_extension_producto_comercial,{revision:producto.revision,descripcionB2b:'B2B versión dos'},usuario.usuario_id_usuario);const v=await m2.publicarVersionProductoComercial(producto.id_extension_producto_comercial,{revision:producto.revision,motivo:'Segunda publicación focal',vigenciaDesde:'2026-10-12'},usuario.usuario_id_usuario);assert.equal(v.numero_version,2);const d=await m2.obtenerProductoComercial(producto.id_extension_producto_comercial);assert.equal(d.versiones.length,2);assert.equal(d.versiones.find(x=>x.numero_version===1).descripcion_b2b,'B2B revisada');producto=d;});
  await t.test('49 impide modificar una versión publicada', async () => {const v=producto.versiones[0];await assert.rejects(prisma.producto_comercial_version.update({where:{id_producto_comercial_version:v.id_producto_comercial_version},data:{motivo:'Alteración indebida'}}),/inmutables/);});
  await t.test('50 evita versiones duplicadas por publicación concurrente', async () => {const revision=producto.revision;const resultados=await Promise.allSettled([m2.publicarVersionProductoComercial(producto.id_extension_producto_comercial,{revision,motivo:'Concurrente A',vigenciaDesde:'2026-10-13'},usuario.usuario_id_usuario),m2.publicarVersionProductoComercial(producto.id_extension_producto_comercial,{revision,motivo:'Concurrente B',vigenciaDesde:'2026-10-13'},usuario.usuario_id_usuario)]);assert.equal(resultados.filter(r=>r.status==='fulfilled').length,1);assert.equal(resultados.filter(r=>r.status==='rejected').length,1);producto=await m2.obtenerProductoComercial(producto.id_extension_producto_comercial);assert.equal(new Set(producto.versiones.map(v=>v.numero_version)).size,producto.versiones.length);});
});
