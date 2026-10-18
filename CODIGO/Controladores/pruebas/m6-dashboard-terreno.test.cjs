const {test}=require('node:test');
const assert=require('node:assert/strict');
const {resumirOperacionTerreno,resumirIncidenciasTerreno,promedioDias,estadoVisibleOtDashboard}=require('../dist/m6/dashboardTerreno');
const {crearCsvAdministrativo}=require('../dist/utilidades/csv');
const {permisosDeOperacion}=require('../dist/validaciones/permisos');

const fecha=(dia)=>dia?new Date(`2026-10-${String(dia).padStart(2,'0')}T00:00:00Z`):null;
const ot=(id,estadoUnidad,estadoOrden=null,extra={})=>({id:String(id),estadoUnidad,estadoOrden,estadoRectificacion:estadoUnidad,creada:fecha(1),rectificada:null,enviada:null,decidida:null,liberada:null,cerrada:null,...extra});
const tarea=(id,idOt,estado,areaId='1',area='Soldadura',extra={})=>({id:String(id),idOt:String(idOt),estado,areaId,area,responsableId:null,responsable:null,ejecuciones:[],esCorrectiva:false,...extra});

test('T5 resume KPIs operacionales sin duplicar puertas ni tareas',async t=>{
 await t.test('una OT repetida se cuenta una sola vez',()=>{const r=resumirOperacionTerreno([ot(1,'PENDIENTE_RECTIFICACION'),ot(1,'PENDIENTE_RECTIFICACION')],[]);assert.equal(r.ordenes.total,1);assert.equal(r.ordenes.estados.find(e=>e.codigo==='PENDIENTE_RECTIFICACION').cantidad,1)});
 await t.test('clasifica cada OT sólo por su estado vigente',()=>{const r=resumirOperacionTerreno([ot(1,'RECTIFICACION_APROBADA'),ot(2,'LIBERADA'),ot(3,'LIBERADA','en_progreso',{cerrada:fecha(8)})],[]);assert.equal(r.ordenes.estados.reduce((s,e)=>s+e.cantidad,0),3);assert.equal(estadoVisibleOtDashboard(ot(3,'LIBERADA','en_progreso',{cerrada:fecha(8)})),'FINALIZADA')});
 await t.test('etapas repetidas de un área permanecen como tareas distintas',()=>{const r=resumirOperacionTerreno([ot(1,'LIBERADA')],[tarea(1,1,'PENDIENTE'),tarea(2,1,'CERRADA')]);assert.equal(r.areas[0].asignadas,2);assert.equal(r.areas[0].puertas,1)});
 await t.test('ejecución registrada no equivale a validada ni cerrada',()=>{const r=resumirOperacionTerreno([ot(1,'LIBERADA')],[tarea(1,1,'PENDIENTE_VALIDACION','1','Soldadura',{ejecuciones:[{validacion:'pendiente'}]})]);assert.equal(r.fabricacion.ejecucionesPendientesValidacion,1);assert.equal(r.fabricacion.tareasValidadas,0);assert.equal(r.fabricacion.tareasCerradas,0)});
 await t.test('tarea validada no se cierra automáticamente',()=>{const r=resumirOperacionTerreno([ot(1,'LIBERADA')],[tarea(1,1,'PENDIENTE_VALIDACION','1','Soldadura',{ejecuciones:[{validacion:'validada'}]})]);assert.equal(r.fabricacion.tareasValidadas,1);assert.equal(r.fabricacion.tareasCerradas,0)});
 await t.test('avance es cerradas sobre tareas requeridas',()=>{const r=resumirOperacionTerreno([ot(1,'LIBERADA')],[tarea(1,1,'CERRADA'),tarea(2,1,'CERRADA'),tarea(3,1,'PENDIENTE')]);assert.equal(r.fabricacion.porcentajeAvance,66.7)});
 await t.test('sin denominador el avance es desconocido',()=>assert.equal(resumirOperacionTerreno([ot(1,'PENDIENTE_RECTIFICACION')],[]).fabricacion.porcentajeAvance,null));
 await t.test('correcciones pendientes excluyen correctivas cerradas',()=>{const r=resumirOperacionTerreno([ot(1,'LIBERADA')],[tarea(1,1,'PENDIENTE','1','Soldadura',{esCorrectiva:true}),tarea(2,1,'CERRADA','1','Soldadura',{esCorrectiva:true})]);assert.equal(r.fabricacion.correccionesPendientes,1)});
 await t.test('promedios usan sólo pares completos y cronológicos',()=>assert.deepEqual(promedioDias([[fecha(1),fecha(3)],[fecha(2),null],[fecha(5),fecha(4)]]),{valorDias:2,muestras:1}));
 await t.test('incidencias rechazadas no se cuentan como fallas confirmadas',()=>{const r=resumirIncidenciasTerreno([{estado:'pendiente',estadoRevision:'rechazada',categoria:'Daño',area:'Pintura',periodo:'2026-10'},{estado:'pendiente',estadoRevision:'aprobada',categoria:'Daño',area:'Pintura',periodo:'2026-10'}]);assert.equal(r.total,2);assert.equal(r.fallasConfirmadas,1);assert.deepEqual(r.porCategoria,[{nombre:'Daño',cantidad:1}])});
 await t.test('CSV chileno conserva BOM, punto y coma, CRLF y escapado',()=>{const csv=crearCsvAdministrativo([{texto:'Puerta; principal',valor:2}],[{encabezado:'Texto',valor:f=>f.texto},{encabezado:'Valor',valor:f=>f.valor}],';');assert.ok(csv.startsWith('\uFEFF'));assert.match(csv,/Texto;Valor\r\n"Puerta; principal";2/) });
 await t.test('dashboard y exportación reutilizan permisos de Terreno',()=>{assert.ok(permisosDeOperacion('consultarDashboardTerreno').includes('CU202'));assert.ok(permisosDeOperacion('consultarDashboardTerreno').includes('CU212'));assert.deepEqual(permisosDeOperacion('exportarReporteTerreno'),permisosDeOperacion('consultarDashboardTerreno'))});
});
