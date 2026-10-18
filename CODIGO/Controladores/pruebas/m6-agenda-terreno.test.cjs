const {test}=require('node:test');
const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');
const {prisma}=require('../dist/db');
const {M6Controller,clasificarResultadoInstalacion}=require('../dist/controladores/M6Controller');
const {permisosDeOperacion}=require('../dist/validaciones/permisos');

test('T1 agenda reutiliza visitas y expone sólo relaciones OT explícitas',async t=>{
  const modulo=new M6Controller(),sufijo=randomUUID().slice(0,8);const ids={visitas:[],tareas:[],formularios:[],evidencias:[],ordenes:[],obras:[],especificaciones:[],clientes:[]};
  const cliente=await prisma.cliente.create({data:{cliente_cliente_rut:`A${sufijo}`.slice(0,12),cliente_razon_social:`Agenda ${sufijo}`}});ids.clientes.push(cliente.cliente_cliente_rut);
  const especificacion=await prisma.especificaciones_puerta.create({data:{especificacion_puerta_modelo_puerta:'Agenda T1'}});ids.especificaciones.push(especificacion.especificacion_puerta_especificacion_puerta_id);
  const obra=await prisma.obra.create({data:{obra_nombre_obra:`Obra ${sufijo}`,obra_direccion_obra:'Dirección controlada',rut_cliente:cliente.cliente_cliente_rut,id_especificacion_puerta:especificacion.especificacion_puerta_especificacion_puerta_id}});ids.obras.push(obra.obra_obra_id);
  const orden=await prisma.orden_trabajo.create({data:{orden_trabajo_estado:'LIBERADA',especificaciones_puerta_id_especificacion_puerta:especificacion.especificacion_puerta_especificacion_puerta_id}});ids.ordenes.push(orden.orden_trabajo_id_orden);
  try{
    const programada=await prisma.servicio_terreno.create({data:{id_obra:obra.obra_obra_id,servicio_terreno_tipo_servicio:'Instalación',servicio_terreno_fecha_real:new Date('2026-10-15T00:00:00Z'),servicio_terreno_estado:'pendiente'}});ids.visitas.push(programada.servicio_terreno_servicio_terreno_id);
    const sinFecha=await prisma.servicio_terreno.create({data:{id_obra:obra.obra_obra_id,servicio_terreno_tipo_servicio:'Levantamiento',servicio_terreno_fecha_real:null,servicio_terreno_estado:'pendiente'}});ids.visitas.push(sinFecha.servicio_terreno_servicio_terreno_id);
    const tarea=await prisma.tarea.create({data:{tarea_titulo:'Tarea agenda',id_servicio_terreno:programada.servicio_terreno_servicio_terreno_id,id_orden_trabajo:orden.orden_trabajo_id_orden}});ids.tareas.push(tarea.tarea_tarea_id);
    const cierre=await prisma.formulario_de_cierre.create({data:{id_tarea:tarea.tarea_tarea_id,formulario_de_cierre_resultado_finalizado:'Servicio conforme',formulario_de_cierre_detalle_de_observaciones:'Recepción firmada'}});ids.formularios.push(cierre.formulario_de_cierre_formulario_de_cierre_id);
    const cierreEvidencia=await prisma.formulario_de_cierre.create({data:{formulario_de_cierre_resultado_finalizado:'Validación con evidencia',formulario_de_cierre_detalle_de_observaciones:'Vínculo explícito por evidencia'}});ids.formularios.push(cierreEvidencia.formulario_de_cierre_formulario_de_cierre_id);
    const evidencia=await prisma.evidencia_terreno.create({data:{id_servicio_terreno:programada.servicio_terreno_servicio_terreno_id,id_formulario_de_cierre:cierreEvidencia.formulario_de_cierre_formulario_de_cierre_id,evidencia_terreno_tipo_evidencia:'foto'}});ids.evidencias.push(evidencia.evidencia_terreno_evidencia_terreno_id);
    await t.test('listado conserva visitas programadas y pendientes de programación',async()=>{const visitas=await modulo.listarVisitasTerreno();assert.equal(visitas.some(v=>v.id===programada.servicio_terreno_servicio_terreno_id.toString()&&v.fecha),true);assert.equal(visitas.some(v=>v.id===sinFecha.servicio_terreno_servicio_terreno_id.toString()&&v.fecha===null),true)});
    await t.test('detalle deriva resultado y OT sólo desde relaciones explícitas',async()=>{const detalle=await modulo.obtenerVisitaTerreno(Number(programada.servicio_terreno_servicio_terreno_id));assert.equal(detalle.resultadoRegistrado.resultado,'Validación con evidencia');assert.deepEqual(detalle.ordenesRelacionadas,[{id:orden.orden_trabajo_id_orden.toString(),estado:'LIBERADA'}])});
    await t.test('visita sin tarea no fabrica relaciones ni resultados',async()=>{const detalle=await modulo.obtenerVisitaTerreno(Number(sinFecha.servicio_terreno_servicio_terreno_id));assert.equal(detalle.resultadoRegistrado,null);assert.deepEqual(detalle.ordenesRelacionadas,[])});
    await t.test('T3 sólo expone instalaciones respaldadas por visita y OT explícitas',async()=>{const instalaciones=await modulo.listarInstalacionesTerreno();const instalacion=instalaciones.find(item=>item.idVisita===programada.servicio_terreno_servicio_terreno_id.toString());assert.ok(instalacion);assert.equal(instalacion.idOrdenTrabajo,orden.orden_trabajo_id_orden.toString());assert.equal(instalacion.resultado.resultado,'Servicio conforme');assert.equal(instalacion.clasificacion,'RESULTADO_REGISTRADO');assert.deepEqual(instalacion.entrega,{estado:'NO_REGISTRADA',detalle:'Entrega no registrada'});assert.equal(instalaciones.some(item=>item.idVisita===sinFecha.servicio_terreno_servicio_terreno_id.toString()),false)});
    await t.test('clasifica resultados sin confundir cierre de visita con instalación completada',()=>{assert.equal(clasificarResultadoInstalacion('cerrada',null),'PENDIENTE');assert.equal(clasificarResultadoInstalacion('cerrada','Instalación completada'),'INSTALACION_COMPLETADA');assert.equal(clasificarResultadoInstalacion('pendiente','Instalación parcialmente realizada'),'PARCIALMENTE_REALIZADA');assert.equal(clasificarResultadoInstalacion('pendiente','Reprogramación necesaria'),'REPROGRAMACION_NECESARIA')});
    await t.test('reutiliza permisos existentes sin conceder privilegios nuevos',()=>{assert.deepEqual(permisosDeOperacion('listarInstalacionesTerreno').sort(),['CU199','CU200','CU210','CU211'].sort())});
  }finally{
    await prisma.evidencia_terreno.deleteMany({where:{evidencia_terreno_evidencia_terreno_id:{in:ids.evidencias}}});
    await prisma.formulario_de_cierre.deleteMany({where:{formulario_de_cierre_formulario_de_cierre_id:{in:ids.formularios}}});
    await prisma.tarea.deleteMany({where:{tarea_tarea_id:{in:ids.tareas}}});
    await prisma.servicio_terreno.deleteMany({where:{servicio_terreno_servicio_terreno_id:{in:ids.visitas}}});
    await prisma.orden_trabajo.deleteMany({where:{orden_trabajo_id_orden:{in:ids.ordenes}}});
    await prisma.obra.deleteMany({where:{obra_obra_id:{in:ids.obras}}});
    await prisma.especificaciones_puerta.deleteMany({where:{especificacion_puerta_especificacion_puerta_id:{in:ids.especificaciones}}});
    await prisma.cliente.deleteMany({where:{cliente_cliente_rut:{in:ids.clientes}}});
  }
});
