const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const schema=readFileSync(resolve('prisma/schema.prisma'),'utf8');
const sql=readFileSync(resolve('prisma/migrations/076_schema_comun/migration.sql'),'utf8');
const compartidas=[
  'usuario','usuario_contrasena','perfil','permiso','perfil_permiso',
  'usuario_permiso_particular','permiso_dependencia','estado_seguridad_usuario',
  'sesion_usuario','token_recuperacion','area_trabajo','obra','proyecto','proyecto_obra',
];

const bloqueModelo=nombre=>{
  const coincidencia=schema.match(new RegExp(`^model\\s+${nombre}\\s*\\{([\\s\\S]*?)^\\}`,'m'));
  assert.ok(coincidencia,`No existe el modelo ${nombre}`);return coincidencia[1];
};

test('076 declara el cuarto schema y mueve exactamente las entidades compartidas aprobadas',()=>{
  assert.match(schema,/schemas\s*=\s*\["comun", "finanzas", "inventario", "terreno"\]/);
  for(const nombre of compartidas) assert.match(bloqueModelo(nombre),/@@schema\("comun"\)/,nombre);
  assert.equal((sql.match(/ALTER TABLE "terreno"\."[^"]+" SET SCHEMA "comun";/g)||[]).length,compartidas.length);
  for(const nombre of compartidas) assert.match(sql,new RegExp(`ALTER TABLE "terreno"\\."${nombre}" SET SCHEMA "comun";`));
});

test('076 conserva los owners de dominio y no introduce operaciones destructivas',()=>{
  for(const [modelo,owner] of [['material','inventario'],['orden_trabajo','inventario'],['especificaciones_puerta','terreno'],['cotizacion','finanzas'],['nota_venta','finanzas']])
    assert.match(bloqueModelo(modelo),new RegExp(`@@schema\\("${owner}"\\)`),modelo);
  assert.doesNotMatch(sql,/\b(?:DROP\s+(?:TABLE|SCHEMA)|TRUNCATE|DELETE\s+FROM|UPDATE\s+["\w]|INSERT\s+INTO\s+(?!estado_migracion_076))\b/i);
  assert.match(sql,/oid_original/);assert.match(sql,/filas_originales/);
  assert.match(sql,/fk_entrantes_originales/);assert.match(sql,/indices_originales/);assert.match(sql,/triggers_originales/);
  assert.match(sql,/NOT c\.convalidated/);assert.match(sql,/una secuencia owned no acompañó a su tabla/);
  assert.match(sql,/BEGIN;/);assert.match(sql,/COMMIT;/);
});

test('el modelo mantiene cantidad de entidades y relaciones físicas',()=>{
  assert.equal((schema.match(/^model\s+/gm)||[]).length,292);
  assert.equal((schema.match(/@relation\([^\r\n]*fields\s*:/g)||[]).length,489);
  assert.match(
    bloqueModelo('orden_compra_servicio_m5'),
    /moneda\s+moneda\?\s+@relation\([^\r\n]*map:\s*"fk_ocs_m5_moneda"/,
  );
  assert.equal((schema.match(/@@schema\("comun"\)/g)||[]).length,14);
});

test('las etiquetas de procedencia de Obra y Proyecto ya identifican el owner común',()=>{
  const servicio=readFileSync(resolve('src/comercial/ServicioObraProyectoComercial.ts'),'utf8');
  assert.match(servicio,/comun\.obra/);assert.match(servicio,/comun\.proyecto/);
  assert.doesNotMatch(servicio,/procedencia:\s*'terreno\.(?:obra|proyecto)/);
});
