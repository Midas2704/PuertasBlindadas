const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { permiteOperacion } = require('../dist/validaciones/permisos');

const raiz = path.resolve(__dirname, '..');
const leer = (...partes) => fs.readFileSync(path.join(raiz, ...partes), 'utf8');

test('C3.3 migracion 069 es aditiva y separa servicios de puertas fisicas', () => {
  const sql = leer('prisma', 'migrations', '069_contactos_servicios_alternativas_c3_3', 'migration.sql');
  assert.match(sql, /CREATE TABLE "finanzas"\."contacto_cotizacion_b2b"/);
  assert.match(sql, /CREATE TABLE "finanzas"\."servicio_comercial"/);
  assert.match(sql, /CREATE TABLE "finanzas"\."precio_servicio_comercial"/);
  assert.match(sql, /CREATE TABLE "finanzas"\."detalle_servicio_cotizacion"/);
  assert.doesNotMatch(sql, /DROP TABLE|TRUNCATE|DELETE FROM/i);
  assert.doesNotMatch(sql, /ALTER TABLE "finanzas"\."detalle_cotizacion" ALTER COLUMN "id_item_comercial" DROP NOT NULL/i);
  assert.match(sql, /uq_contacto_cotizacion_b2b_principal/);
  assert.match(sql, /EXCLUDE USING gist/);
  assert.match(sql, /CHECK \("monto" > 0\)/);
});

test('C3.3 preserva seleccion historica y exige alternativa del mismo grupo', () => {
  const sql = leer('prisma', 'migrations', '069_contactos_servicios_alternativas_c3_3', 'migration.sql');
  assert.match(sql, /historial_seleccion_alternativa_b2c/);
  assert.match(sql, /validar_seleccion_alternativa_b2c/);
  assert.match(sql, /La alternativa seleccionada debe pertenecer al grupo y permanecer propuesta/);
  assert.match(sql, /bloquear_historial_alternativa_b2c/);
});

test('C3.3 no elude C4 y usa permisos existentes de alcance acotado', () => {
  const m2 = leer('src', 'controladores', 'M2Controller.ts');
  const permisos = leer('src', 'validaciones', 'permisos.ts');
  const m9 = leer('src', 'm9', 'contratoProductor.ts');
  assert.match(m2, /La aceptaci[oó]n requiere un PDF documental confirmado/);
  assert.match(m2, /detalle_servicio_cotizacion/);
  assert.match(m2, /id_alternativa_b2c_aceptada/);
  assert.match(permisos, /seleccionarAlternativaB2C\s*:\s*'CU20'/);
  assert.match(permisos, /aceptarAlternativaB2C\s*:\s*'CU24'/);
  assert.match(permisos, /rechazarAlternativaB2C\s*:\s*'CU22'/);
  for (const evento of ['seleccionarAlternativaB2C', 'aceptarAlternativaB2C', 'rechazarAlternativaB2C']) assert.match(m9, new RegExp(evento));
  assert.equal(permiteOperacion('seleccionarAlternativaB2C', []), false);
  assert.equal(permiteOperacion('aceptarAlternativaB2C', ['CU20']), false);
  assert.equal(permiteOperacion('aceptarAlternativaB2C', ['CU24']), true);
  assert.equal(permiteOperacion('rechazarAlternativaB2C', ['CU22']), true);
});
