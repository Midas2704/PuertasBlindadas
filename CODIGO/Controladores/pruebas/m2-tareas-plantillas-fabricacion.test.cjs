const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { prisma } = require('../dist/db');
const { M2Controller } = require('../dist/controladores/M2Controller');
const { CATALOGO_PRODUCTORES_M9 } = require('../dist/m9/contratoProductor');
const { permiteOperacion } = require('../dist/validaciones/permisos');

const m2 = new M2Controller();
const sufijo = randomUUID().slice(0, 8).toUpperCase();
let usuario; let familia; let tarea; let plantilla; let areas;

after(async () => {
  if (plantilla) {
    await prisma.ajuste_producto_plantilla_fabricacion.deleteMany({ where: { id_plantilla_fabricacion: plantilla.id_plantilla_fabricacion } });
    await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."version_plantilla_fabricacion" DISABLE TRIGGER "trg_version_plantilla_fabricacion_inmutable"');
    await prisma.version_plantilla_fabricacion.deleteMany({ where: { id_plantilla_fabricacion: plantilla.id_plantilla_fabricacion } });
    await prisma.$executeRawUnsafe('ALTER TABLE "finanzas"."version_plantilla_fabricacion" ENABLE TRIGGER "trg_version_plantilla_fabricacion_inmutable"');
    await prisma.plantilla_fabricacion_familia.deleteMany({ where: { id_plantilla_fabricacion: plantilla.id_plantilla_fabricacion } });
  }
  if (tarea) await prisma.catalogo_tarea_fabricacion.deleteMany({ where: { id_tarea_fabricacion: tarea.id_tarea_fabricacion } });
  if (familia) {
    await prisma.historial_familia_producto_comercial.deleteMany({ where: { id_familia_producto_comercial: familia.id_familia_producto_comercial } });
    await prisma.familia_producto_comercial.deleteMany({ where: { id_familia_producto_comercial: familia.id_familia_producto_comercial } });
  }
  await prisma.$disconnect();
});

test('M2 catálogo y plantillas de fabricación', async t => {
  const migracion = readFileSync(resolve('prisma/migrations/060_catalogo_tareas_plantillas_fabricacion/migration.sql'), 'utf8');
  const rutas = readFileSync(resolve('src/rutas/finanzas.ts'), 'utf8');
  usuario = await prisma.usuario.findFirstOrThrow();
  areas = await prisma.area_trabajo.findMany({ where: { area_trabajo_activo: true }, take: 2, orderBy: { area_trabajo_id_area: 'asc' } });
  assert.ok(areas.length >= 1, 'La base focal requiere al menos un área activa');

  await t.test('01 migración es aditiva y no altera owners operativos', () => {
    assert.doesNotMatch(migracion, /ALTER TABLE "(?:terreno|inventario)"/);
    assert.match(migracion, /REFERENCES "terreno"\."area_trabajo"/);
  });
  await t.test('02 crea tarea ligada a un área activa', async () => {
    tarea = await m2.crearTareaFabricacion({ nombre:`Corte focal ${sufijo}`, descripcion:'Tarea de prueba focal', idArea:areas[0].area_trabajo_id_area.toString(), tiempoEstimadoMin:25 }, usuario.usuario_id_usuario);
    assert.equal(tarea.estado, 'ACTIVA'); assert.equal(tarea.tiempo_estimado_min, 25);
  });
  await t.test('03 impide duplicar nombre dentro de la misma área', async () => {
    await assert.rejects(m2.crearTareaFabricacion({ nombre:` corte focal ${sufijo} `, idArea:areas[0].area_trabajo_id_area.toString() }, usuario.usuario_id_usuario), e => e.estado === 409);
  });
  await t.test('04 controla concurrencia y cambio de estado sin borrar', async () => {
    await assert.rejects(m2.actualizarTareaFabricacion(tarea.id_tarea_fabricacion,{ revision:tarea.revision+1, nombre:tarea.nombre, idArea:tarea.id_area_trabajo.toString() },usuario.usuario_id_usuario),e=>e.estado===409);
    tarea=await m2.cambiarEstadoTareaFabricacion(tarea.id_tarea_fabricacion,false,{revision:tarea.revision},usuario.usuario_id_usuario);assert.equal(tarea.estado,'INACTIVA');
    tarea=await m2.cambiarEstadoTareaFabricacion(tarea.id_tarea_fabricacion,true,{revision:tarea.revision},usuario.usuario_id_usuario);assert.equal(tarea.estado,'ACTIVA');
  });
  await t.test('05 crea familia y guarda borrador con áreas repetidas, catálogo y tarea particular', async () => {
    familia=await m2.crearFamiliaProductoComercial({codigo:`PF-${sufijo}`,nombre:`Plantilla focal ${sufijo}`},usuario.usuario_id_usuario);
    const etapa=(nombre,tareas)=>({id:randomUUID(),idArea:areas[0].area_trabajo_id_area.toString(),nombre,tareas});
    plantilla=await m2.guardarBorradorPlantillaFabricacion(familia.id_familia_producto_comercial,{medidasObligatorias:['marcoAncho','marcoAlto','marcoEspesor'],etapas:[etapa('Preparación',[{id:randomUUID(),idTareaFabricacion:tarea.id_tarea_fabricacion,instrucciones:'Usar plano vigente'}]),etapa('Terminación',[{id:randomUUID(),nombre:'Control particular',tiempoEstimadoMin:10}])]},usuario.usuario_id_usuario);
    const contenido=plantilla.borrador; assert.equal(contenido.etapas.length,2); assert.deepEqual(contenido.medidasObligatorias,['marcoAncho','marcoAlto','marcoEspesor']); assert.equal(contenido.etapas[0].idAreaTrabajo,contenido.etapas[1].idAreaTrabajo); assert.equal(contenido.etapas[1].tareas[0].idTareaFabricacion,null);
  });
  await t.test('06 rechaza tarea catalogada en un área distinta', async t2 => {
    if(areas.length<2)return t2.skip('Sólo existe un área activa en la base focal');
    await assert.rejects(m2.guardarBorradorPlantillaFabricacion(familia.id_familia_producto_comercial,{revision:plantilla.revision,etapas:[{idArea:areas[1].area_trabajo_id_area.toString(),nombre:'Área incorrecta',tareas:[{idTareaFabricacion:tarea.id_tarea_fabricacion}]}]},usuario.usuario_id_usuario),e=>e.estado===400);
  });
  await t.test('07 publica versión inmutable y conserva snapshot', async () => {
    const version=await m2.publicarPlantillaFabricacion(familia.id_familia_producto_comercial,{revision:plantilla.revision,motivo:'Publicación focal'},usuario.usuario_id_usuario);
    assert.equal(version.numero_version,1); assert.equal(version.contenido.etapas.length,2); assert.deepEqual(version.contenido.medidasObligatorias,['marcoAncho','marcoAlto','marcoEspesor']);
    await assert.rejects(prisma.version_plantilla_fabricacion.update({where:{id_version_plantilla:version.id_version_plantilla},data:{motivo:'Alteración'}}),/inmutables/);
    plantilla=(await m2.obtenerPlantillaFabricacionFamilia(familia.id_familia_producto_comercial,true)).plantilla;
  });
  await t.test('08 editar borrador no altera versión publicada', async () => {
    plantilla=await m2.guardarBorradorPlantillaFabricacion(familia.id_familia_producto_comercial,{revision:plantilla.revision,etapas:[{idArea:areas[0].area_trabajo_id_area.toString(),nombre:'Nuevo borrador',tareas:[]}]},usuario.usuario_id_usuario);
    const detalle=await m2.obtenerPlantillaFabricacionFamilia(familia.id_familia_producto_comercial,true);
    assert.equal(detalle.plantilla.borrador.etapas.length,1); assert.deepEqual(detalle.plantilla.borrador.medidasObligatorias,['marcoAncho','marcoAlto']); assert.equal(detalle.plantilla.versiones[0].contenido.etapas.length,2); assert.deepEqual(detalle.plantilla.versiones[0].contenido.medidasObligatorias,['marcoAncho','marcoAlto','marcoEspesor']);
  });
  await t.test('08b rechaza medidas obligatorias desconocidas o repetidas', async () => {
    const etapa={idArea:areas[0].area_trabajo_id_area.toString(),nombre:'Control',tareas:[]};
    await assert.rejects(m2.guardarBorradorPlantillaFabricacion(familia.id_familia_producto_comercial,{revision:plantilla.revision,medidasObligatorias:['medidaInventada'],etapas:[etapa]},usuario.usuario_id_usuario),e=>e.estado===400);
    await assert.rejects(m2.guardarBorradorPlantillaFabricacion(familia.id_familia_producto_comercial,{revision:plantilla.revision,medidasObligatorias:['marcoAncho','marcoAncho'],etapas:[etapa]},usuario.usuario_id_usuario),e=>e.estado===400);
  });
  await t.test('09 evita publicación con revisión desactualizada', async () => {
    await assert.rejects(m2.publicarPlantillaFabricacion(familia.id_familia_producto_comercial,{revision:plantilla.revision-1,motivo:'Concurrente'},usuario.usuario_id_usuario),e=>e.estado===409);
  });
  await t.test('10 permisos reutilizan capacidades M2 sin accesos nuevos', () => {
    assert.equal(permiteOperacion('listarTareasFabricacion',['CU360']),true); assert.equal(permiteOperacion('crearTareaFabricacion',['CU360']),false); assert.equal(permiteOperacion('publicarPlantillaFabricacionFamilia',['CU362']),false);
  });
  await t.test('11 operaciones relevantes quedan preparadas para auditoría M9', () => {
    for(const operacion of ['crearTareaFabricacion','actualizarTareaFabricacion','guardarBorradorPlantillaFabricacion','publicarPlantillaFabricacionFamilia'])assert.equal(CATALOGO_PRODUCTORES_M9[operacion].modulo,'M2');
  });
  await t.test('12 rutas no exponen eliminación ni generación de OT', () => {
    assert.match(rutas,/tareas-fabricacion/); assert.match(rutas,/plantilla-fabricacion\/publicar/); assert.doesNotMatch(rutas,/delete\('\/mantenedores\/(?:tareas-fabricacion|familias-producto\/.*plantilla)/); assert.doesNotMatch(rutas,/plantilla-fabricacion.*orden-trabajo/);
  });
});
