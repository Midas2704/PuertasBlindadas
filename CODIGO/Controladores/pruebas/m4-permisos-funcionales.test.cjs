const test=require('node:test');
const assert=require('node:assert/strict');
const {AREAS_FUNCIONALES_M4,clasificarPermisoM4}=require('../dist/seguridad/catalogoPermisosFuncional.js');
const {codigosImplementados,operacionesQueRequierenAdministrador,permisosDeOperacion}=require('../dist/validaciones/permisos.js');
const {CATALOGO_PRODUCTORES_M9}=require('../dist/m9/contratoProductor.js');

test('clasificación funcional usa áreas reales y nombres humanos',()=>{
  const casos=[
    ['CU01','Clientes','Crear cliente'],['CU19','Cotizaciones y Ventas','Crear y guardar cotización'],
    ['CU63','Usuarios y Seguridad','Asignar permisos particulares'],['CU199','Obras y Proyectos','Crear visitas y ver obras'],
    ['CU207','Órdenes de Trabajo y Producción','Gestionar tareas de producción'],['CU355','Auditoría','Consultar auditoría'],
    ['CU370','Precios y Condiciones Comerciales','Gestionar tarifas de instalación'],['CU379','Documentos Comerciales','Publicar plantillas documentales'],
  ];
  for(const [codigo,area,accion] of casos){const permiso=clasificarPermisoM4({codigo,descripcion:'Descripción',activo:true,requiereAdministrador:false});assert.equal(permiso.area,area);assert.equal(permiso.accion,accion);assert.notEqual(permiso.accion,codigo)}
  assert.ok(AREAS_FUNCIONALES_M4.includes('Remuneraciones'));
  assert.ok(AREAS_FUNCIONALES_M4.includes('Inventario'));
});

test('todo CU implementado obtiene clasificación y acción visible',()=>{
  for(const codigo of codigosImplementados.filter(c=>c!=='CU377')){const permiso=clasificarPermisoM4({codigo,descripcion:'Acción del sistema',activo:true,requiereAdministrador:false});assert.ok(permiso.area, codigo);assert.ok(permiso.accion&&!/^CU\d+$/.test(permiso.accion),codigo)}
});

test('guardado atómico reutiliza CU62, CU63 y CU64 y exige administrador',()=>{
  assert.deepEqual(new Set(permisosDeOperacion('guardarPermisosUsuario')),new Set(['CU62','CU63','CU64']));
  assert.ok(operacionesQueRequierenAdministrador.has('guardarPermisosUsuario'));
});

test('guardado administrativo genera una sola operación coherente para M9',()=>{
  assert.deepEqual(CATALOGO_PRODUCTORES_M9.guardarPermisosUsuario,{modulo:'M4',operacion:'CONFIGURACION_PERMISOS_ACTUALIZADA',entidad:'USUARIO',critico:false});
});
