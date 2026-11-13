const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { mkdtemp, readFile, rm, stat } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { Readable } = require('node:stream');
const {
  cargarConfiguracionStorageLocalPrivado,
  LocalPrivateStorageAdapter,
  modoServidorPersonalHabilitado,
} = require('../dist/documental/adaptadores/LocalPrivateStorageAdapter');
const { crearStorageAdapterDesdeEntorno } = require('../dist/documental/adaptadores/crearStorageAdapter');
const { ServicioDocumentosComerciales } = require('../dist/comercial/documentos/ServicioDocumentosComerciales');

const UUID = '12345678-1234-4123-8123-123456789abc';

test('modo servidor personal usa storage local privado sin exigir R2/S3', async t => {
  const raiz = await mkdtemp(join(tmpdir(), 'pblindadas-documentos-'));
  t.after(() => rm(raiz, { recursive: true, force: true }));
  const entorno = {
    DOCUMENTAL_PERSONAL_MODE: 'true',
    DOCUMENTAL_LOCAL_STORAGE_DIR: raiz,
    DOCUMENTAL_LOCAL_CONTAINER: 'documentos-locales',
  };
  assert.equal(modoServidorPersonalHabilitado(entorno), true);
  assert.deepEqual(cargarConfiguracionStorageLocalPrivado(entorno), { directorioRaiz: raiz, contenedor: 'documentos-locales' });
  const storage = crearStorageAdapterDesdeEntorno(entorno);
  assert.ok(storage instanceof LocalPrivateStorageAdapter);
  assert.equal(storage.proveedor, 'LOCAL_PRIVADO');

  const contenido = Buffer.from('%PDF-1.4\nPDF sintético generado internamente\n%%EOF');
  const sha256 = createHash('sha256').update(contenido).digest('hex');
  const referencia = { contenedor: 'documentos-locales', clave: `objects/${UUID}` };
  const guardado = await storage.crearObjetoExclusivo({
    referencia,
    contenido: Readable.from(contenido),
    mime: 'application/pdf',
    tamanoEsperado: BigInt(contenido.length),
    claveIdempotencia: 'prueba-local-123',
    sha256,
  });
  assert.equal(guardado.sha256Verificado, sha256);
  assert.equal(guardado.tamanoBytes, BigInt(contenido.length));
  assert.deepEqual(await readFile(join(raiz, 'documentos-locales', 'objects', UUID)), contenido);
  if (process.platform !== 'win32') {
    const modo = (await stat(join(raiz, 'documentos-locales', 'objects', UUID))).mode & 0o777;
    assert.equal(modo, 0o600);
  }
  await assert.rejects(() => storage.crearObjetoExclusivo({
    referencia,
    contenido: Readable.from(contenido),
    mime: 'application/pdf',
    tamanoEsperado: BigInt(contenido.length),
    claveIdempotencia: 'prueba-local-123',
    sha256,
  }), error => error.codigo === 'OBJETO_EXISTENTE');
});

test('preflight personal habilita emisión y declara antivirus omitido sin simular escaneo', async () => {
  const servicio = new ServicioDocumentosComerciales({
    cliente: { plantilla_documental_comercial: { findMany: async () => [
      { segmento: 'B2B', versiones: [{ id_plantilla_documental_version: 1n }] },
      { segmento: 'B2C', versiones: [{ id_plantilla_documental_version: 2n }] },
    ] } },
    entorno: {
      DOCUMENTAL_PERSONAL_MODE: 'true',
      DOCUMENTAL_LOCAL_STORAGE_DIR: '/app/data/documentos',
    },
  });
  const estado = await servicio.estadoInfraestructura();
  assert.equal(estado.modo, 'SERVIDOR_PERSONAL');
  assert.equal(estado.almacenamientoPrivado, 'LOCAL_PRIVADO');
  assert.equal(estado.antivirus, 'OMITIDO_MODO_PERSONAL');
  assert.equal(estado.emisionDefinitiva, 'HABILITADA_CON_CONFIRMACION_BACKEND');
  assert.match(estado.motivo, /SHA-256 activos/);
});

test('publicación interna en modo personal conserva PDF y SHA-256 sin invocar antivirus', async t => {
  const raiz = await mkdtemp(join(tmpdir(), 'pblindadas-emision-'));
  t.after(() => rm(raiz, { recursive: true, force: true }));
  const servicio = new ServicioDocumentosComerciales({
    cliente: {},
    entorno: {
      DOCUMENTAL_PERSONAL_MODE: 'true',
      DOCUMENTAL_LOCAL_STORAGE_DIR: raiz,
      DOCUMENTAL_LOCAL_CONTAINER: 'documentos-locales',
    },
    antivirus: {
      nombre: 'NO_DEBE_EJECUTARSE',
      escanear: async () => { throw new Error('El antivirus no debe ejecutarse en modo personal'); },
    },
  });
  const pdf = Buffer.from('%PDF-1.4\nDocumento interno\n%%EOF');
  const guardado = await servicio.almacenarPdf(pdf, `objects/${UUID}`, 'emision-personal-123');
  assert.equal(guardado.proveedor, 'LOCAL_PRIVADO');
  assert.equal(guardado.validacionAntivirus, 'OMITIDO_MODO_PERSONAL');
  assert.equal(guardado.sha256, createHash('sha256').update(pdf).digest('hex'));
  assert.deepEqual(await readFile(join(raiz, 'documentos-locales', 'objects', UUID)), pdf);
});

test('modo endurecido mantiene el bloqueo cuando storage y antivirus no están configurados', async () => {
  const servicio = new ServicioDocumentosComerciales({
    cliente: { plantilla_documental_comercial: { findMany: async () => [] } },
    entorno: {},
  });
  const estado = await servicio.estadoInfraestructura();
  assert.equal(estado.modo, 'PRODUCCION_ENDURECIDA');
  assert.equal(estado.emisionDefinitiva, 'BLOQUEADA');
  assert.equal(estado.almacenamientoPrivado, 'NO_CONFIGURADO');
  assert.equal(estado.antivirus, 'ANTIVIRUS_NO_CONFIGURADO');
});

test('migración admite LOCAL_PRIVADO sin retirar R2 ni S3 y no modifica datos', async () => {
  const sql = await readFile(join(__dirname, '../prisma/migrations/081_storage_local_servidor_personal/migration.sql'), 'utf8');
  assert.match(sql, /proveedor_logico[^;]+R2[^;]+S3[^;]+LOCAL_PRIVADO/s);
  assert.match(sql, /VALIDATE CONSTRAINT "chk_version_documento_proveedor"/);
  assert.doesNotMatch(sql, /\b(?:INSERT|UPDATE|DELETE|TRUNCATE)\b/i);
});
