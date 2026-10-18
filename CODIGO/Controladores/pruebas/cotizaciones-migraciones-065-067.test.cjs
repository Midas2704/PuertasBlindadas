const test = require('node:test');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');

const raiz = resolve(__dirname, '..');
const rutaSchema = resolve(raiz, 'prisma', 'schema.prisma');
const rutas = [
  resolve(raiz, 'prisma', 'migrations', '065_catalogos_comerciales_cotizacion', 'migration.sql'),
  resolve(raiz, 'prisma', 'migrations', '066_versionado_documental_cotizacion', 'migration.sql'),
  resolve(raiz, 'prisma', 'migrations', '067_alternativas_b2c', 'migration.sql'),
];

const leer = ruta => readFile(ruta, 'utf8');

test('Migraciones 065–067 — estructura aditiva de cotizaciones B2B/B2C', async t => {
  const [schema, m065, m066, m067] = await Promise.all([leer(rutaSchema), ...rutas.map(leer)]);
  const sql = [m065, m066, m067].join('\n');

  await t.test('01 conserva un orden de dependencias explícito', () => {
    assert.match(m065, /CREATE TABLE "finanzas"\."precio_producto_comercial"/);
    assert.match(m066, /REFERENCES "finanzas"\."precio_producto_comercial"/);
    assert.match(m067, /REFERENCES "finanzas"\."carta_comercial_b2c_version"|REFERENCES "finanzas"\."precio_producto_comercial"/);
  });

  await t.test('02 no contiene operaciones destructivas ni aplicación de migraciones', () => {
    assert.doesNotMatch(sql, /\b(DROP\s+(TABLE|SCHEMA|COLUMN)|TRUNCATE|DELETE\s+FROM|migrate\s+(dev|deploy|reset)|db\s+push)\b/i);
  });

  await t.test('03 mantiene anulables los campos heredados sensibles', () => {
    assert.match(m065, /ADD COLUMN "segmento_comercial" VARCHAR\(3\)(?!\s+NOT NULL)/);
    assert.match(m065, /ADD COLUMN "id_extension_producto_comercial" INTEGER(?!\s+NOT NULL)/);
    assert.match(m065, /ADD COLUMN "id_precio_producto_comercial" BIGINT(?!\s+NOT NULL)/);
  });

  await t.test('04 sólo clasifica heredados inequívocos y deja revisión visible', () => {
    assert.match(m065, /UPPER\(t\."nombre_tipo_cliente_financiero"\) IN \('B2B','B2C'\)/);
    assert.match(m065, /CREATE VIEW "finanzas"\."cotizacion_segmento_pendiente_revision"/);
    assert.doesNotMatch(m065, /segmento_comercial"\s*=\s*'B2[BC]'\s*WHERE[\s\S]*IS NULL/i);
  });

  await t.test('05 separa precios comerciales de costos internos', () => {
    assert.match(schema, /model precio_producto_comercial/);
    assert.match(schema, /model tarifa_instalacion_comercial/);
    assert.doesNotMatch(m065, /UPDATE\s+"finanzas"\."configuracion_costo_instalacion"/i);
    assert.doesNotMatch(m065, /precio_comercial"[^;]*DEFAULT\s+0/i);
  });

  await t.test('06 evita vigencias comerciales activas superpuestas', () => {
    assert.match(m065, /EXCLUDE USING gist[\s\S]*daterange/i);
    assert.match(m065, /ex_tarifa_instalacion_vigencia/i);
  });

  await t.test('07 reutiliza el núcleo documental y exige archivo confirmado', () => {
    assert.match(m066, /REFERENCES "finanzas"\."documento_logico"/);
    assert.match(m066, /REFERENCES "finanzas"\."version_documento"/);
    assert.match(m066, /validar_documento_disponible/);
    assert.match(m066, /cotización no puede emitirse sin PDF documental confirmado/i);
  });

  await t.test('08 protege publicaciones, condiciones y emisiones históricas', () => {
    assert.match(m066, /tr_condicion_comercial_version_inmutable/);
    assert.match(m066, /tr_carta_b2c_version_inmutable/);
    assert.match(m066, /tr_cotizacion_version_comercial_inmutable/);
    assert.match(m066, /tr_carta_b2c_(producto|fotografia)_inmutable/);
  });

  await t.test('09 sólo publica fotografías B2C autorizadas y disponibles', () => {
    assert.match(m066, /tipo_documento" = 'FOTOGRAFIA_COMERCIAL'/);
    assert.match(m066, /habilitado_b2c" = TRUE/);
    assert.match(m066, /vd\."estado" = 'DISPONIBLE'/);
  });

  await t.test('10 mantiene correlativo comercial separado del historial cambiario', () => {
    assert.match(m066, /ADD COLUMN "numero_version_comercial" INTEGER/);
    assert.match(m066, /ADD COLUMN "tipo_version" VARCHAR\(30\)/);
    assert.doesNotMatch(m066, /UPDATE\s+"finanzas"\."cotizacion_version"\s+SET\s+"version"/i);
  });

  await t.test('11 mantiene alternativas fuera del detalle contratado', () => {
    assert.match(m067, /CREATE TABLE "finanzas"\."alternativa_b2c"/);
    assert.match(m067, /ADD COLUMN "id_alternativa_b2c_aceptada" BIGINT/);
    assert.match(m067, /a\."estado" = 'ACEPTADA'/);
    assert.match(m067, /UNIQUE \("id_alternativa_b2c_aceptada"\)/);
  });

  await t.test('12 valida coherencia de producto, precio, opcional e instalación', () => {
    assert.match(m067, /pp\."monto" = NEW\."precio_unitario"/);
    assert.match(m067, /po\."monto" = NEW\."precio_unitario"/);
    assert.match(m067, /ti\."precio_comercial" = NEW\."precio_instalacion"/);
    assert.match(m067, /co\."habilitado_b2c" = TRUE/);
  });

  await t.test('13 no crea permisos, roles, endpoints ni datos comerciales', () => {
    assert.doesNotMatch(sql, /\b(GRANT|REVOKE|INSERT\s+INTO)\b/i);
    assert.doesNotMatch(sql, /CREATE\s+(ROLE|USER)\b/i);
  });

  await t.test('14 Prisma representa todos los modelos nuevos', () => {
    for (const modelo of [
      'precio_producto_comercial', 'opcional_comercial', 'compatibilidad_opcional_producto',
      'precio_opcional_comercial', 'tarifa_instalacion_comercial', 'condicion_comercial',
      'condicion_comercial_version', 'plantilla_documental_comercial', 'plantilla_documental_version',
      'carta_comercial_b2c', 'carta_comercial_b2c_version', 'grupo_alternativas_b2c',
      'alternativa_b2c', 'alternativa_b2c_opcional', 'historial_decision_alternativa_b2c',
    ]) assert.match(schema, new RegExp(`model ${modelo} \\{`));
  });
});
