const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const { randomUUID } = require('node:crypto');
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
const {
  cargarConfiguracionStorage, ErrorConfiguracionStorage, ErrorStorage,
  S3CompatibleStorageAdapter, ServicioDocumental,
} = require('../dist/documental/ServicioDocumental');

const AHORA = new Date('2026-10-12T12:00:00.000Z');
const BUCKET = 'puertas-blindadas-pruebas';
const ref = (prefijo = 'objects') => ({ contenedor: BUCKET, clave: `${prefijo}/${randomUUID()}` });
const configuracion = (proveedor = 'R2', extra = {}) => ({
  proveedor, bucket: BUCKET, region: proveedor === 'R2' ? 'auto' : 'us-east-1',
  endpoint: proveedor === 'R2' ? `https://${'a'.repeat(32)}.r2.cloudflarestorage.com` : undefined,
  forcePathStyle: false,
  credenciales: proveedor === 'R2' ? { accessKeyId: 'TEST_ONLY_ACCESS', secretAccessKey: 'TEST_ONLY_SECRET' } : undefined,
  expiracionFirmaSegundos: 300, timeoutMs: 100, maxIntentos: 2,
  s3VersionadoHabilitado: false, s3ObjectLockHabilitado: false, s3KmsHabilitado: false,
  ...extra,
});

class ClienteMock {
  constructor(resolver) { this.resolver = resolver; this.llamadas = []; }
  async send(comando, opciones) {
    this.llamadas.push({ nombre: comando.constructor.name, entrada: comando.input });
    return this.resolver(comando, opciones);
  }
}

const consumir = async cuerpo => { let total = 0; for await (const parte of cuerpo) total += Buffer.byteLength(parte); return total; };
const resolverBase = async comando => {
  const nombre = comando.constructor.name;
  if (nombre === 'PutObjectCommand') { await consumir(comando.input.Body); return { ETag: '"put-etag"', VersionId: 'v-put' }; }
  if (nombre === 'HeadObjectCommand') return { ContentLength: 3, ETag: '"head-etag"', ContentType: 'text/plain', VersionId: 'v-head', Metadata: { fuente: 'mock' } };
  if (nombre === 'GetObjectCommand') return { Body: Readable.from([Buffer.from('abc')]) };
  if (nombre === 'CreateMultipartUploadCommand') return { UploadId: 'upload-mock' };
  if (nombre === 'UploadPartCommand') { if (comando.input.Body) await consumir(comando.input.Body); return { ETag: `"parte-${comando.input.PartNumber}"` }; }
  if (nombre === 'ListMultipartUploadsCommand') return { IsTruncated: false, Uploads: [] };
  return {};
};

const adaptar = (proveedor = 'R2', resolver = resolverBase, extra = {}) => {
  const cliente = new ClienteMock(resolver);
  const firmas = [];
  const firmar = async (_cliente, comando, opciones) => {
    firmas.push({ nombre: comando.constructor.name, entrada: comando.input, opciones });
    return `https://firma.invalid/${comando.constructor.name}`;
  };
  const adaptador = new S3CompatibleStorageAdapter(configuracion(proveedor, extra), { cliente, firmar, ahora: () => new Date(AHORA) });
  return { adaptador, cliente, firmas };
};

const r2Env = () => ({
  STORAGE_PROVIDER: 'R2', STORAGE_BUCKET: BUCKET, STORAGE_REGION: 'auto',
  STORAGE_ENDPOINT: `https://${'b'.repeat(32)}.r2.cloudflarestorage.com`,
  STORAGE_ACCESS_KEY_ID: 'TEST_ACCESS', STORAGE_SECRET_ACCESS_KEY: 'TEST_SECRET',
});

test('Bloque 4.3 — contrato portable R2/S3', async t => {
  await t.test('01 configuración válida para R2', () => {
    const cfg = cargarConfiguracionStorage(r2Env());
    assert.equal(cfg.proveedor, 'R2'); assert.equal(cfg.region, 'auto'); assert.ok(cfg.credenciales);
  });

  await t.test('02 configuración válida para S3', () => {
    const cfg = cargarConfiguracionStorage({ STORAGE_PROVIDER: 'S3', STORAGE_BUCKET: BUCKET, STORAGE_REGION: 'us-east-1' });
    assert.equal(cfg.proveedor, 'S3'); assert.equal(cfg.endpoint, undefined);
  });

  await t.test('03 configuración incompleta falla con mensaje seguro', () => {
    assert.throws(() => cargarConfiguracionStorage({}), e => e instanceof ErrorConfiguracionStorage && /STORAGE_PROVIDER/.test(e.message));
  });

  await t.test('04 R2 exige credenciales privadas completas', () => {
    const entorno = r2Env(); delete entorno.STORAGE_SECRET_ACCESS_KEY;
    assert.throws(() => cargarConfiguracionStorage(entorno), /requiere STORAGE_ACCESS_KEY_ID/);
  });

  await t.test('05 S3 permite cadena IAM sin credenciales estáticas', () => {
    const cfg = cargarConfiguracionStorage({ STORAGE_PROVIDER: 'S3', STORAGE_BUCKET: BUCKET, STORAGE_REGION: 'sa-east-1' });
    assert.equal(cfg.credenciales, undefined);
  });

  await t.test('06 endpoint inválido o externo es rechazado', () => {
    assert.throws(() => cargarConfiguracionStorage({ ...r2Env(), STORAGE_ENDPOINT: 'https://evil.example.com/path?token=x' }), /endpoint/i);
  });

  await t.test('07 bucket inválido es rechazado', () => {
    assert.throws(() => cargarConfiguracionStorage({ ...r2Env(), STORAGE_BUCKET: 'Bucket_Invalido' }), /STORAGE_BUCKET/);
  });

  await t.test('08 clave fuera de prefijos opacos es rechazada', async () => {
    const { adaptador } = adaptar();
    await assert.rejects(adaptador.consultarObjeto({ contenedor: BUCKET, clave: '../cliente/12.345.678-9.pdf' }), e => e instanceof ErrorStorage && e.codigo === 'INTEGRIDAD');
  });

  await t.test('09 PUT transmite stream y conserva metadatos técnicos', async () => {
    const { adaptador, cliente } = adaptar();
    const resultado = await adaptador.subirStream({ referencia: ref(), contenido: Readable.from(['abc']), mime: 'text/plain', tamanoEsperado: 3n });
    assert.equal(resultado.tamanoBytes, 3n); assert.equal(resultado.sha256Verificado, undefined);
    assert.equal(cliente.llamadas.at(-1).nombre, 'PutObjectCommand');
  });

  await t.test('10 HEAD diferencia proveedor de integridad verificada', async () => {
    const { adaptador } = adaptar(); const resultado = await adaptador.consultarObjeto(ref());
    assert.equal(resultado.etag, '"head-etag"'); assert.equal(resultado.sha256Verificado, undefined); assert.deepEqual(resultado.metadatosProveedor, { fuente: 'mock' });
  });

  await t.test('11 GET entrega un stream', async () => {
    const { adaptador } = adaptar(); const stream = await adaptador.abrirLectura(ref());
    assert.equal(await consumir(stream), 3);
  });

  await t.test('12 objeto inexistente se normaliza', async () => {
    const { adaptador } = adaptar('R2', async () => { const e = new Error('no mostrar detalle'); e.name = 'NoSuchKey'; e.$metadata = { httpStatusCode: 404 }; throw e; });
    await assert.rejects(adaptador.consultarObjeto(ref()), e => e.codigo === 'NO_ENCONTRADO' && !e.message.includes('detalle'));
  });

  await t.test('13 error de autorización se normaliza sin secreto', async () => {
    const { adaptador } = adaptar('R2', async () => { const e = new Error('TEST_ONLY_SECRET'); e.name = 'AccessDenied'; e.$metadata = { httpStatusCode: 403 }; throw e; });
    await assert.rejects(adaptador.consultarObjeto(ref()), e => e.codigo === 'NO_AUTORIZADO' && !e.message.includes('TEST_ONLY_SECRET'));
  });

  await t.test('14 timeout aborta y queda reintentable', async () => {
    const resolver = (_comando, opciones) => new Promise((_ok, fallo) => opciones.abortSignal.addEventListener('abort', () => { const e = new Error('timeout privado'); e.name = 'AbortError'; fallo(e); }));
    const { adaptador } = adaptar('R2', resolver, { timeoutMs: 20 });
    await assert.rejects(adaptador.consultarObjeto(ref()), e => e.codigo === 'TEMPORAL' && e.reintentable === true);
  });

  await t.test('15 reintentos están acotados por configuración', () => {
    assert.equal(cargarConfiguracionStorage({ ...r2Env(), STORAGE_MAX_ATTEMPTS: '2' }).maxIntentos, 2);
    assert.throws(() => cargarConfiguracionStorage({ ...r2Env(), STORAGE_MAX_ATTEMPTS: '6' }), /entre 1 y 5/);
  });

  await t.test('16 stream pequeño se transmite sin Base64', async () => {
    const { adaptador } = adaptar(); const resultado = await adaptador.subirStream({ referencia: ref('tmp'), contenido: Readable.from([Buffer.from([0, 1, 2])]), mime: 'application/octet-stream', tamanoEsperado: 3n });
    assert.equal(resultado.tamanoBytes, 3n);
  });

  await t.test('17 stream grande simulado se procesa por fragmentos', async () => {
    const fragmentos = Array.from({ length: 1024 }, () => Buffer.alloc(1024));
    const { adaptador } = adaptar(); const resultado = await adaptador.subirStream({ referencia: ref(), contenido: Readable.from(fragmentos), mime: 'application/octet-stream', tamanoEsperado: 1048576n });
    assert.equal(resultado.tamanoBytes, 1048576n);
  });

  await t.test('18 stream incompleto no se declara cargado', async () => {
    const { adaptador } = adaptar();
    await assert.rejects(adaptador.subirStream({ referencia: ref(), contenido: Readable.from(['ab']), mime: 'text/plain', tamanoEsperado: 3n }), e => e.codigo === 'INTEGRIDAD');
  });

  await t.test('19 error durante lectura se propaga normalizado', async () => {
    const stream = new Readable({ read() { this.destroy(Object.assign(new Error('dato privado'), { name: 'StreamError' })); } });
    const { adaptador } = adaptar();
    await assert.rejects(adaptador.subirStream({ referencia: ref(), contenido: stream, mime: 'text/plain', tamanoEsperado: 3n }), e => e instanceof ErrorStorage && !e.message.includes('dato privado'));
  });

  await t.test('20 implementación no acumula archivos completos en memoria', async () => {
    const fuente = await readFile(resolve(__dirname, '../src/documental/adaptadores/S3CompatibleStorageAdapter.ts'), 'utf8');
    assert.doesNotMatch(fuente, /Buffer\.concat|readFile\(|base64/i); assert.match(fuente, /Transform/);
  });

  await t.test('21 firma PUT con headers y expiración', async () => {
    const { adaptador, firmas } = adaptar(); const expiraEn = new Date(AHORA.getTime() + 60000);
    const resultado = await adaptador.firmarCarga({ referencia: ref('tmp'), mime: 'image/jpeg', tamanoEsperado: 12n, expiraEn });
    assert.match(resultado.url, /^https:\/\/firma\.invalid/); assert.equal(resultado.headersObligatorios['content-length'], '12'); assert.equal(firmas[0].nombre, 'PutObjectCommand');
  });

  await t.test('22 firma GET con nombre seguro', async () => {
    const { adaptador, firmas } = adaptar();
    const resultado=await adaptador.firmarDescarga({ referencia: ref(), nombreDescarga: 'ficha técnica.pdf', mimeRespuesta:'application/pdf', cacheControlRespuesta:'private, no-store', expiraEn: new Date(AHORA.getTime() + 60000) });
    assert.equal(firmas[0].nombre, 'GetObjectCommand'); assert.match(firmas[0].entrada.ResponseContentDisposition, /^attachment;/);
    assert.equal(firmas[0].entrada.ResponseContentType,'application/pdf');
    assert.equal(firmas[0].entrada.ResponseCacheControl,'private, no-store');
    assert.deepEqual(resultado.parametrosRespuestaFirmados,{'content-disposition':firmas[0].entrada.ResponseContentDisposition,'content-type':'application/pdf','cache-control':'private, no-store'});
  });

  await t.test('23 expiración firmada respeta segundos configurados', async () => {
    const { adaptador, firmas } = adaptar(); await adaptador.firmarCarga({ referencia: ref('tmp'), mime: 'text/plain', tamanoEsperado: 1n, expiraEn: new Date(AHORA.getTime() + 45000) });
    assert.equal(firmas[0].opciones.expiresIn, 45);
  });

  await t.test('24 firma fuera del máximo se rechaza antes del SDK', async () => {
    const { adaptador, firmas } = adaptar();
    await assert.rejects(adaptador.firmarCarga({ referencia: ref(), mime: 'text/plain', tamanoEsperado: 1n, expiraEn: new Date(AHORA.getTime() + 301000) }), e => e.codigo === 'INTEGRIDAD');
    assert.equal(firmas.length, 0);
  });

  await t.test('25 errores y fuente no registran secretos ni URLs', async () => {
    const fuente = await readFile(resolve(__dirname, '../src/documental/adaptadores/S3CompatibleStorageAdapter.ts'), 'utf8');
    assert.doesNotMatch(fuente, /console\.|logger\.|SecretAccessKey\s*[:=]\s*['"][^'"]+/i);
  });

  await t.test('26 inicia multipart real mediante comando SDK', async () => {
    const { adaptador, cliente } = adaptar(); const carga = await adaptador.iniciarCarga({ referencia: ref('tmp'), mime: 'application/pdf', tamanoEsperado: 10n, claveIdempotencia: 'mp-1', multipart: true });
    assert.equal(carga.identificadorMultipart, 'upload-mock'); assert.equal(carga.idempotente, false); assert.equal(cliente.llamadas[0].nombre, 'CreateMultipartUploadCommand');
  });

  await t.test('27 sube una parte y conserva ETag sin tratarlo como SHA', async () => {
    const { adaptador } = adaptar(); const parte = await adaptador.subirParteStream({ referencia: ref('tmp'), identificadorMultipart: 'upload-mock', numero: 1, contenido: Readable.from(['abc']), tamanoEsperado: 3n });
    assert.equal(parte.etag, '"parte-1"'); assert.equal(parte.checksum, undefined);
  });

  await t.test('28 confirma multipart y consulta HEAD posterior', async () => {
    const { adaptador, cliente } = adaptar(); const resultado = await adaptador.confirmarMultipart({ referencia: ref('tmp'), identificadorMultipart: 'upload-mock', partes: [{ numero: 2, etag: 'e2' }, { numero: 1, etag: 'e1' }] });
    assert.equal(resultado.tamanoBytes, 3n); assert.deepEqual(cliente.llamadas.map(x => x.nombre), ['CompleteMultipartUploadCommand', 'HeadObjectCommand']);
    assert.deepEqual(cliente.llamadas[0].entrada.MultipartUpload.Parts.map(x => x.PartNumber), [1, 2]);
  });

  await t.test('29 aborto multipart usa identificador explícito', async () => {
    const { adaptador, cliente } = adaptar(); await adaptador.abortarMultipart({ referencia: ref('tmp'), identificadorMultipart: 'upload-mock' });
    assert.equal(cliente.llamadas[0].nombre, 'AbortMultipartUploadCommand');
  });

  await t.test('30 error multipart intermedio no confirma', async () => {
    const { adaptador, cliente } = adaptar('R2', async comando => { if (comando.constructor.name === 'UploadPartCommand') { const e = new Error(); e.name = 'TimeoutError'; throw e; } return resolverBase(comando); });
    await assert.rejects(adaptador.subirParteStream({ referencia: ref('tmp'), identificadorMultipart: 'u', numero: 1, contenido: Readable.from(['a']), tamanoEsperado: 1n }), e => e.codigo === 'TEMPORAL');
    assert.doesNotMatch(cliente.llamadas.map(x => x.nombre).join(','), /CompleteMultipart/);
  });

  await t.test('31 reintento de parte conserva upload, número y clave', async () => {
    const { adaptador, cliente } = adaptar(); const referencia = ref('tmp');
    for (let i = 0; i < 2; i++) await adaptador.subirParteStream({ referencia, identificadorMultipart: 'u', numero: 3, contenido: Readable.from(['a']), tamanoEsperado: 1n });
    assert.deepEqual(cliente.llamadas.map(x => [x.entrada.Key, x.entrada.UploadId, x.entrada.PartNumber]), [[referencia.clave, 'u', 3], [referencia.clave, 'u', 3]]);
  });

  await t.test('32 R2 implementa el mismo contrato StorageAdapter', () => {
    const { adaptador } = adaptar('R2'); for (const metodo of ['subirStream', 'crearObjetoExclusivo', 'consultarObjeto', 'abrirLectura', 'abrirLecturaCondicionada', 'firmarCarga', 'firmarDescarga', 'confirmarMultipart']) assert.equal(typeof adaptador[metodo], 'function');
  });

  await t.test('33 S3 implementa el mismo contrato StorageAdapter', () => {
    const { adaptador } = adaptar('S3'); for (const metodo of ['subirStream', 'crearObjetoExclusivo', 'consultarObjeto', 'abrirLectura', 'abrirLecturaCondicionada', 'firmarCarga', 'firmarDescarga', 'confirmarMultipart']) assert.equal(typeof adaptador[metodo], 'function');
  });

  await t.test('34 capacidades diferencian R2 de S3 configurado', () => {
    const r2 = adaptar('R2').adaptador; const s3 = adaptar('S3', resolverBase, { s3VersionadoHabilitado: true, s3ObjectLockHabilitado: true, s3KmsHabilitado: true }).adaptador;
    assert.equal(r2.capacidades.versionadoProveedor, false); assert.equal(r2.capacidades.legalHold, false);
    assert.equal(s3.capacidades.versionadoProveedor, true); assert.equal(s3.capacidades.legalHold, true); assert.equal(s3.capacidades.cifradoClaveAdministrada, true);
  });

  await t.test('35 operaciones incompatibles no se declaran disponibles', () => {
    const { adaptador } = adaptar('R2'); assert.equal(adaptador.capacidades.formularioFirmadoPost, false); assert.equal(adaptador.eliminarVersionPermitida, undefined);
  });

  await t.test('36 versionado documental continúa independiente del proveedor', async () => {
    const fuente = await readFile(resolve(__dirname, '../src/documental/adaptadores/S3CompatibleStorageAdapter.ts'), 'utf8');
    assert.doesNotMatch(fuente, /version_documento|documento_logico|Prisma/);
  });

  await t.test('37 no se agregan rutas HTTP documentales públicas', async () => {
    const rutas = await readFile(resolve(__dirname, '../src/rutas/finanzas.ts'), 'utf8'); assert.doesNotMatch(rutas, /storage|firmar-carga|multipart/i);
  });

  await t.test('38 no existen credenciales storage en React', async () => {
    const paquete = await readFile(resolve(__dirname, '../../Vistas/package.json'), 'utf8'); assert.doesNotMatch(paquete, /@aws-sdk|STORAGE_SECRET|STORAGE_ACCESS/);
  });

  await t.test('39 no hay secretos reales en configuración versionada', async () => {
    const ejemplo = await readFile(resolve(__dirname, '../.env.example'), 'utf8');
    assert.match(ejemplo, /STORAGE_SECRET_ACCESS_KEY=\r?$/m); assert.doesNotMatch(ejemplo, /AKIA[0-9A-Z]{16}|r2\.cloudflarestorage\.com\/[A-Za-z0-9_-]+/);
  });

  await t.test('40 construir el adaptador no realiza conexiones', () => {
    const { cliente } = adaptar(); assert.equal(cliente.llamadas.length, 0);
  });

  await t.test('41 URLs firmadas no se persisten ni pasan al repositorio', async () => {
    const repositorio = await readFile(resolve(__dirname, '../src/documental/repositorios/RepositorioDocumentalPrisma.ts'), 'utf8');
    assert.doesNotMatch(repositorio, /url_firmada|presigned|signedUrl/i);
  });

  await t.test('42 borrado físico no está habilitado', () => {
    const { adaptador } = adaptar(); assert.equal(typeof adaptador.eliminarVersionPermitida, 'undefined');
  });

  await t.test('43 M4 conserva catálogo de permisos', async () => {
    const permisos = await readFile(resolve(__dirname, '../src/validaciones/permisos.ts'), 'utf8'); assert.doesNotMatch(permisos, /STORAGE_|DOCUMENTO_(SUBIR|DESCARGAR)/);
  });

  await t.test('44 M9 no recibe URLs, secretos ni un sistema paralelo', async () => {
    const servicio = await readFile(resolve(__dirname, '../src/documental/ServicioDocumental.ts'), 'utf8');
    assert.doesNotMatch(servicio, /evento_auditoria_m9|firmarCarga\(|firmarDescarga\(/);
    const { adaptador } = adaptar(); const fachada = new ServicioDocumental({}, adaptador); assert.equal(fachada.capacidadesStorage().cargaFirmadaPut, true);
  });

  await t.test('45 copia objetos mediante comando y verifica destino con HEAD', async () => {
    const { adaptador, cliente } = adaptar();
    await adaptador.copiarObjeto({ origen: ref('quarantine'), destino: ref('objects'), claveIdempotencia: 'copiar-1', etagOrigen:'"etag-inmutable"' });
    assert.deepEqual(cliente.llamadas.map(x => x.nombre), ['CopyObjectCommand', 'HeadObjectCommand']);
    assert.equal(cliente.llamadas[0].entrada.CopySourceIfMatch,'"etag-inmutable"');
  });

  await t.test('45a S3 protege la creación del destino con If-None-Match', async () => {
    const { adaptador, cliente } = adaptar('S3');
    await adaptador.copiarObjeto({ origen: ref('quarantine'), destino: ref('objects'), claveIdempotencia:'condicional-s3', etagOrigen:'"origen"', exigirDestinoAusente:true });
    assert.equal(adaptador.capacidades.copiaCondicionalDestino,true);
    assert.equal(cliente.llamadas[0].entrada.IfNoneMatch,'*');
  });

  await t.test('45b R2 queda bloqueado hasta validar su extensión condicional real', async () => {
    const { adaptador, cliente } = adaptar('R2');
    assert.equal(adaptador.capacidades.copiaCondicionalDestino,false);
    assert.equal(adaptador.capacidades.escrituraCondicionalDestino,true);
    await assert.rejects(adaptador.copiarObjeto({ origen:ref('quarantine'), destino:ref('objects'), claveIdempotencia:'condicional-r2', exigirDestinoAusente:true }), e=>e.codigo==='NO_SOPORTADO');
    assert.equal(cliente.llamadas.length,0);
  });

  await t.test('45c precondición fallida se normaliza como conflicto no reintentable', async () => {
    const { adaptador } = adaptar('S3', async()=>{const e=new Error('detalle privado');e.name='PreconditionFailed';e.$metadata={httpStatusCode:412};throw e;});
    await assert.rejects(adaptador.copiarObjeto({ origen:ref('quarantine'), destino:ref('objects'), claveIdempotencia:'conflicto', exigirDestinoAusente:true }), e=>e.codigo==='CONFLICTO'&&e.reintentable===false&&!e.message.includes('privado'));
  });

  await t.test('45d PUT exclusivo usa If-None-Match y metadato de idempotencia', async () => {
    const { adaptador, cliente } = adaptar('R2');
    await adaptador.crearObjetoExclusivo({referencia:ref('objects'),contenido:Readable.from(['abc']),mime:'text/plain',tamanoEsperado:3n,claveIdempotencia:'documental-1'});
    const put=cliente.llamadas.find(x=>x.nombre==='PutObjectCommand');
    assert.equal(put.entrada.IfNoneMatch,'*'); assert.equal(put.entrada.Metadata['idempotencia-documental'],'documental-1');
  });

  await t.test('45e PUT exclusivo distingue objeto existente de conflicto transitorio', async () => {
    const precondicion=adaptar('R2',async()=>{const e=new Error('privado');e.name='PreconditionFailed';e.$metadata={httpStatusCode:412};throw e;}).adaptador;
    await assert.rejects(precondicion.crearObjetoExclusivo({referencia:ref(),contenido:Readable.from(['a']),mime:'text/plain',tamanoEsperado:1n,claveIdempotencia:'x'}),e=>e.codigo==='OBJETO_EXISTENTE'&&!e.reintentable);
    const conflicto=adaptar('R2',async()=>{const e=new Error('privado');e.name='ConditionalRequestConflict';e.$metadata={httpStatusCode:409};throw e;}).adaptador;
    await assert.rejects(conflicto.crearObjetoExclusivo({referencia:ref(),contenido:Readable.from(['a']),mime:'text/plain',tamanoEsperado:1n,claveIdempotencia:'x'}),e=>e.codigo==='CONFLICTO_TRANSITORIO'&&e.reintentable);
  });

  await t.test('45f GET condicionado envía If-Match y no confunde ETag con SHA-256', async () => {
    const {adaptador,cliente}=adaptar('S3'); const lectura=await adaptador.abrirLecturaCondicionada({referencia:ref(),etag:'"token"'}); await consumir(lectura);
    const get=cliente.llamadas.find(x=>x.nombre==='GetObjectCommand');assert.equal(get.entrada.IfMatch,'"token"');
  });

  await t.test('46 lista multipart incompletos sólo bajo claves documentales válidas', async () => {
    const valida = ref('tmp');
    const { adaptador } = adaptar('R2', async comando => comando.constructor.name === 'ListMultipartUploadsCommand'
      ? { IsTruncated: false, Uploads: [{ Key: valida.clave, UploadId: 'u-1', Initiated: AHORA }, { Key: 'tmp/cliente.pdf', UploadId: 'u-2' }] }
      : resolverBase(comando));
    const cargas = await adaptador.listarCargasIncompletas({ contenedor: BUCKET, prefijo: 'tmp/' });
    assert.equal(cargas.length, 1); assert.equal(cargas[0].identificadorMultipart, 'u-1');
  });

  await t.test('47 firma una parte multipart sin confirmar la carga', async () => {
    const { adaptador, firmas, cliente } = adaptar();
    const parte = await adaptador.firmarParteMultipart({ referencia: ref('tmp'), identificadorMultipart: 'u-1', numero: 4, tamanoEsperado: 8n, expiraEn: new Date(AHORA.getTime() + 30000) });
    assert.equal(parte.numero, 4); assert.equal(firmas[0].nombre, 'UploadPartCommand'); assert.equal(cliente.llamadas.length, 0);
  });

  await t.test('48 preparación de PUT simple no contacta al proveedor', async () => {
    const { adaptador, cliente } = adaptar();
    const carga = await adaptador.iniciarCarga({ referencia: ref('tmp'), mime: 'image/png', tamanoEsperado: 5n, claveIdempotencia: 'put-simple' });
    assert.equal(carga.idempotente, true); assert.equal(carga.identificadorMultipart, undefined); assert.equal(cliente.llamadas.length, 0);
  });

  await t.test('49 el adaptador no permite salir del bucket configurado', async () => {
    const { adaptador, cliente } = adaptar();
    await assert.rejects(adaptador.consultarObjeto({ contenedor: 'otro-bucket', clave: `objects/${randomUUID()}` }), e => e.codigo === 'INTEGRIDAD');
    assert.equal(cliente.llamadas.length, 0);
  });
});
