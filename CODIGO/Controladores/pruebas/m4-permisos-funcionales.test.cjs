const test=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {AREAS_FUNCIONALES_M4,clasificarPermisoM4}=require('../dist/seguridad/catalogoPermisosFuncional.js');
const {codigosImplementados,operacionesQueRequierenAdministrador,permisosDeOperacion}=require('../dist/validaciones/permisos.js');
const {CATALOGO_PRODUCTORES_M9}=require('../dist/m9/contratoProductor.js');
const {perfilPermitePersonalizacion}=require('../dist/controladores/M4Controller.js');

test('clasificación funcional usa áreas reales y nombres humanos',()=>{
  const casos=[
    ['CU01','Clientes','Crear cliente'],['CU19','Cotizaciones y Ventas','Crear y guardar cotización'],
    ['CU63','Usuarios y Seguridad','Asignar permisos particulares'],['CU199','Obras y Proyectos','Crear visitas y ver obras'],
    ['CU207','Órdenes de Trabajo y Producción','Gestionar tareas de producción'],['CU355','Auditoría','Consultar auditoría'],
    ['CU370','Precios y Condiciones Comerciales','Gestionar tarifas de instalación'],['CU379','Documentos Comerciales','Publicar plantillas documentales'],
    ['CU466','Inventario','Registrar entrada de inventario'],['CU471','Inventario','Administrar materiales de inventario'],
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

test('el perfil preselecciona pero no limita la personalización de permisos',()=>{
  assert.equal(perfilPermitePersonalizacion({activo_m4:true,admite_particulares:false,codigo_m4:'gerencia'}),true);
  assert.equal(perfilPermitePersonalizacion({activo_m4:false,admite_particulares:true,codigo_m4:'secretaria'}),false);
  assert.match(readFileSync('src/controladores/M4Controller.ts','utf8'),/codigos\.includes\('CU377'\)/);
});

test('los perfiles reutilizables usan el modelo existente y no requieren migración ni semillas',()=>{
  const controlador=readFileSync('src/controladores/M4Controller.ts','utf8');
  const rutas=readFileSync('src/rutas/finanzas.ts','utf8');
  assert.match(controlador,/async guardarPerfilAcceso/);
  assert.match(controlador,/perfil_permiso\.createMany/);
  assert.match(controlador,/perfilesBase\.has/);
  assert.match(rutas,/post\('\/usuarios\/perfiles',derivar\('guardarPerfilAcceso'\)\)/);
  assert.doesNotMatch(controlador,/migrate|seed/i);
});
