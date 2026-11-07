const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {resolve}=require('node:path');
const permisos=readFileSync(resolve('src/validaciones/permisos.ts'),'utf8');
const rutas=readFileSync(resolve('src/rutas/finanzas.ts'),'utf8');
const controlador=readFileSync(resolve('src/controladores/MInventarioController.ts'),'utf8');
const sql=readFileSync(resolve('prisma/migrations/078_propuesta_permisos_operacionales_inventario/migration.sql'),'utf8');

test('CU14 y CU15 permanecen de lectura y cada escritura usa una capacidad independiente',()=>{
  assert.match(permisos,/consultarResumenInventario:'CU15'/);
  assert.match(permisos,/listarMaterialesInventario:'CU14'/);
  for(const [operacion,cu] of Object.entries({registrarEntradaInventario:'CU466',registrarSalidaInventario:'CU467',crearReservaInventario:'CU468',liberarReservaInventario:'CU469',ajustarExistenciaInventario:'CU470'}))assert.match(permisos,new RegExp(`${operacion}:'${cu}'`));
  assert.doesNotMatch(permisos,/registrarEntradaInventario:'CU1[45]'/);
});

test('la propuesta M4 es aditiva, inactiva y no asigna usuarios ni perfiles',()=>{
  for(let codigo=466;codigo<=472;codigo++)assert.match(sql,new RegExp(`CU${codigo}`));
  assert.match(sql,/SELECT 'INVENTARIO'.*FALSE, FALSE/s);
  assert.doesNotMatch(sql,/INSERT INTO "comun"\."(?:usuario_permiso_particular|perfil_permiso)"/);
  assert.match(sql,/CU377 permanece excluido/);
  assert.match(sql,/\('CU466','CU15'\)/);assert.match(sql,/\('CU471','CU14'\)/);
});

test('los catálogos son consultas reales y las rutas operativas reutilizan INT-03',()=>{
  assert.match(rutas,/get\('\/inventario\/catalogos-operacion'/);
  for(const ruta of ['entradas','salidas','reservas','ajustes'])assert.match(rutas,new RegExp(`post\\('\\/inventario\\/${ruta}`));
  assert.match(controlador,/async catalogosOperacion\(\)/);
  assert.match(controlador,/movimiento_inventario_tipo_movimiento\.findMany/);
  assert.match(controlador,/movimiento_inventario_motivo_movimiento\.findMany/);
});
