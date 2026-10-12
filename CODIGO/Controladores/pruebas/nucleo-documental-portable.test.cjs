const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { readFile } = require('node:fs/promises');
const { resolve } = require('node:path');
const { prisma } = require('../dist/db');
const { ServicioDocumental, ErrorDocumental } = require('../dist/documental/ServicioDocumental');
const { RepositorioDocumentalPrisma } = require('../dist/documental/repositorios/RepositorioDocumentalPrisma');
const { exigirTransicionIntencion, exigirTransicionVersion } = require('../dist/documental/estados');
const { validarClaveObjeto, validarClaveTemporal, validarSha256, validarTamano } = require('../dist/documental/validaciones');

const marca = randomUUID().slice(0, 8);
const actor = { id: 0n };
let familia;
let producto;
const documentos = [];
const servicio = new ServicioDocumental();
const repositorio = new RepositorioDocumentalPrisma(prisma);
const sha = 'a'.repeat(64);

const versionEntrada = (idDocumento, sufijo, extra = {}) => ({
  idDocumento,
  proveedor: 'R2',
  contenedor: 'puertas-blindadas-pruebas',
  claveObjeto: `objects/${sufijo}`,
  nombreOriginal: 'foto original.jpg',
  nombreSeguro: 'foto-original.jpg',
  mimeDeclarado: 'image/jpeg',
  tamanoBytes: 1024,
  ...extra,
});

test('Bloque 4.2 — núcleo documental portable', async t => {
  const usuario = await prisma.usuario.create({ data: { usuario_username: `doc_${marca}`, usuario_estado_cuenta: 'activa', usuario_fecha_de_creacion: new Date() } });
  actor.id = usuario.usuario_id_usuario;
  t.after(async () => {
    await prisma.evento_operacional_documental.deleteMany({ where: { OR: [{ id_documento_logico: { in: documentos } }, { clave_idempotencia: { startsWith: `focal:${marca}` } }] } });
    if (producto) await prisma.producto_comercial_documento.deleteMany({ where: { id_extension_producto_comercial: producto.id_extension_producto_comercial } });
    const versiones = await prisma.version_documento.findMany({ where: { id_documento_logico: { in: documentos } }, select: { id_version_documento: true } });
    const idsVersion = versiones.map(v => v.id_version_documento);
    await prisma.variante_documento.deleteMany({ where: { OR: [{ id_version_original: { in: idsVersion } }, { id_version_derivada: { in: idsVersion } }] } });
    await prisma.version_documento.deleteMany({ where: { id_documento_logico: { in: documentos } } });
    await prisma.documento_logico.deleteMany({ where: { id_documento_logico: { in: documentos } } });
    await prisma.intencion_carga_documental.deleteMany({ where: { usuario_solicitante: actor.id } });
    if (producto) await prisma.extension_producto_comercial.delete({ where: { id_extension_producto_comercial: producto.id_extension_producto_comercial } });
    if (familia) await prisma.familia_producto_comercial.delete({ where: { id_familia_producto_comercial: familia.id_familia_producto_comercial } });
    await prisma.usuario.delete({ where: { usuario_id_usuario: actor.id } });
    await prisma.$disconnect();
  });
  familia = await prisma.familia_producto_comercial.create({ data: { codigo: `DOC-${marca}`.toUpperCase(), nombre: `Familia documental ${marca}`, creado_por: actor.id, actualizado_por: actor.id } });
  producto = await prisma.extension_producto_comercial.create({ data: { codigo_comercial: `PD-${marca}`.toUpperCase(), nombre_comercial: `Producto documental ${marca}`, id_familia_producto_comercial: familia.id_familia_producto_comercial, creado_por: actor.id, actualizado_por: actor.id } });

  await t.test('01 permite transiciones autorizadas', () => {
    assert.doesNotThrow(() => exigirTransicionIntencion('PENDIENTE', 'SUBIENDO'));
    assert.doesNotThrow(() => exigirTransicionVersion('VALIDANDO', 'CUARENTENA'));
  });

  await t.test('02 rechaza retrocesos y salida desde estados finales', () => {
    assert.throws(() => exigirTransicionIntencion('DISPONIBLE', 'PENDIENTE'), e => e instanceof ErrorDocumental && e.codigo === 'TRANSICION_INVALIDA');
    assert.throws(() => exigirTransicionVersion('ARCHIVADO', 'PENDIENTE'), /no permitida/);
  });

  await t.test('03 valida hash y tamaño', () => {
    assert.equal(validarSha256(sha, true), sha);
    assert.throws(() => validarSha256('abc', true), /SHA-256/);
    assert.throws(() => validarTamano(0), /mayor que cero/);
  });

  await t.test('04 exige claves opacas y rechaza datos personales o rutas', () => {
    assert.match(validarClaveTemporal(`tmp/${randomUUID()}`), /^tmp\//);
    assert.match(validarClaveObjeto(`objects/${randomUUID()}`), /^objects\//);
    assert.throws(() => validarClaveObjeto('objects/12.345.678-9/cliente.jpg'), e => e.codigo === 'CLAVE_NO_OPACA');
    assert.throws(() => validarClaveTemporal('../tmp/archivo'), e => e.codigo === 'CLAVE_NO_OPACA');
  });

  let documento;
  await t.test('05 crea documento lógico y outbox en una transacción', async () => {
    documento = await servicio.crearDocumento({ titulo: 'Fotografía principal', clasificacion: 'comercial', esHistorico: true }, actor);
    documentos.push(documento.id_documento_logico);
    assert.equal(documento.estado, 'ACTIVO');
    assert.equal(documento.revision, 1);
    assert.equal(await prisma.evento_operacional_documental.count({ where: { id_documento_logico: documento.id_documento_logico, tipo_evento: 'DOCUMENTO_CREADO' } }), 1);
  });

  await t.test('06 aplica revisión optimista al documento', async () => {
    const inactivo = await servicio.cambiarEstadoDocumento(documento.id_documento_logico, documento.revision, 'INACTIVO', 'Revisión focal');
    assert.equal(inactivo.revision, 2);
    await assert.rejects(servicio.cambiarEstadoDocumento(documento.id_documento_logico, 1, 'ACTIVO'), e => e.codigo === 'REVISION_DESACTUALIZADA' || e.codigo === 'TRANSICION_INVALIDA');
    documento = await servicio.cambiarEstadoDocumento(documento.id_documento_logico, inactivo.revision, 'ACTIVO');
  });

  const claveIdem = `focal-${marca}`;
  const intencionBase = { clasificacion: 'COMERCIAL', nombreDeclarado: 'foto.jpg', mimeDeclarado: 'image/jpeg', tamanoEsperado: 2048, claveTemporal: `tmp/${randomUUID()}`, claveIdempotencia: claveIdem, expiraEn: new Date(Date.now() + 60000) };
  let intencion;
  await t.test('07 la misma intención repetida es idempotente', async () => {
    const [a, b] = await Promise.all([servicio.crearIntencion(intencionBase, actor), servicio.crearIntencion(intencionBase, actor)]);
    assert.equal(a.id_intencion_carga, b.id_intencion_carga);
    assert.equal(await prisma.intencion_carga_documental.count({ where: { usuario_solicitante: actor.id, clave_idempotencia: claveIdem } }), 1);
    intencion = a;
  });

  await t.test('08 rechaza reutilización conflictiva de idempotencia', async () => {
    await assert.rejects(servicio.crearIntencion({ ...intencionBase, nombreDeclarado: 'otro.pdf' }, actor), e => e.codigo === 'IDEMPOTENCIA_CONFLICTIVA');
  });

  await t.test('09 persiste estados de intención y bloquea transición imposible', async () => {
    intencion = await servicio.cambiarEstadoIntencion(intencion.id_publico, intencion.revision, 'SUBIENDO');
    assert.equal(intencion.estado, 'SUBIENDO');
    await assert.rejects(servicio.cambiarEstadoIntencion(intencion.id_publico, intencion.revision, 'DISPONIBLE'), e => e.codigo === 'TRANSICION_INVALIDA');
  });

  let v1;
  await t.test('10 registra una versión con numeración correlativa', async () => {
    v1 = await servicio.registrarVersion(versionEntrada(documento.id_documento_logico, randomUUID()), actor);
    const v2 = await servicio.registrarVersion(versionEntrada(documento.id_documento_logico, randomUUID()), actor);
    assert.deepEqual([v1.numero_version, v2.numero_version], [1, 2]);
  });

  await t.test('11 serializa versiones concurrentes sin duplicar correlativos', async () => {
    const resultados = await Promise.all([
      servicio.registrarVersion(versionEntrada(documento.id_documento_logico, randomUUID()), actor),
      servicio.registrarVersion(versionEntrada(documento.id_documento_logico, randomUUID()), actor),
    ]);
    assert.equal(new Set(resultados.map(v => v.numero_version)).size, 2);
  });

  let disponible;
  await t.test('12 una versión disponible exige integridad completa', async () => {
    await assert.rejects(servicio.registrarVersion(versionEntrada(documento.id_documento_logico, randomUUID(), { estado: 'DISPONIBLE' }), actor), e => e.codigo === 'HASH_INVALIDO' || e.codigo === 'VALIDACION_INCOMPLETA');
    disponible = await servicio.registrarVersion(versionEntrada(documento.id_documento_logico, randomUUID(), { estado: 'DISPONIBLE', sha256: sha, mimeDetectado: 'image/jpeg', validadoEn: new Date(), resultadoValidaciones: { antivirus: 'PENDIENTE_4_4' } }), actor);
    assert.equal(disponible.estado, 'DISPONIBLE');
  });

  await t.test('13 la base protege metadatos de contenido confirmado', async () => {
    await assert.rejects(prisma.version_documento.update({ where: { id_version_documento: disponible.id_version_documento }, data: { clave_objeto: `objects/${randomUUID()}` } }), /inmutables/);
  });

  await t.test('14 evita objeto y número de versión duplicados', async () => {
    await assert.rejects(prisma.version_documento.create({ data: { ...disponible, id_version_documento: undefined, creado_en: undefined, revision: 1 } }), /Unique constraint|restricción única/i);
  });

  await t.test('15 registra variante y evita autorreferencia', async () => {
    const derivada = await servicio.registrarVersion(versionEntrada(documento.id_documento_logico, randomUUID()), actor);
    const variante = await servicio.registrarVariante(v1.id_version_documento, derivada.id_version_documento, 'MINIATURA', { ancho: 320 });
    assert.equal(variante.tipo_variante, 'MINIATURA');
    await assert.rejects(servicio.registrarVariante(v1.id_version_documento, v1.id_version_documento, 'VISTA_PREVIA'), /distinta|ciclo|Original y derivada/i);
  });

  await t.test('16 asocia documento con producto mediante FKs reales', async () => {
    const asociacion = await servicio.asociarProducto({ idProducto: producto.id_extension_producto_comercial, idDocumento: documento.id_documento_logico, tipoDocumento: 'FOTOGRAFIA_COMERCIAL', esImagenPrincipal: true, habilitadoB2b: true, ordenPresentacion: 0 }, actor);
    assert.equal(asociacion.es_imagen_principal, true);
    assert.equal((await servicio.listarAsociacionesProducto(producto.id_extension_producto_comercial)).length, 1);
  });

  await t.test('17 restringe una sola imagen principal activa', async () => {
    const segundo = await servicio.crearDocumento({ titulo: 'Segunda foto', clasificacion: 'COMERCIAL' }, actor); documentos.push(segundo.id_documento_logico);
    await assert.rejects(servicio.asociarProducto({ idProducto: producto.id_extension_producto_comercial, idDocumento: segundo.id_documento_logico, tipoDocumento: 'FOTOGRAFIA_COMERCIAL', esImagenPrincipal: true }, actor), /Unique constraint|restricción única/i);
  });

  await t.test('18 rechaza referencias inexistentes', async () => {
    await assert.rejects(servicio.asociarProducto({ idProducto: 2147483647, idDocumento: documento.id_documento_logico, tipoDocumento: 'FICHA_TECNICA' }, actor), e => e.codigo === 'PRODUCTO_NO_ENCONTRADO');
  });

  await t.test('19 outbox es idempotente y no duplica M9', async () => {
    const entrada = { tipoEvento: 'VALIDACION_SOLICITADA', claveIdempotencia: `focal:${marca}:validar`, idDocumento: documento.id_documento_logico, idVersion: v1.id_version_documento, payloadTecnico: { destino: 'ANTIVIRUS_PENDIENTE_4_4' } };
    const [a, b] = await Promise.all([servicio.registrarEvento(entrada), servicio.registrarEvento(entrada)]);
    assert.equal(a.id_evento_operacional, b.id_evento_operacional);
    assert.equal(await prisma.evento_auditoria_m9.count({ where: { identidad_logica: { contains: entrada.claveIdempotencia } } }), 0);
  });

  await t.test('20 finaliza intención, versión, documento y outbox atómicamente', async () => {
    let segura = await servicio.crearIntencion({ ...intencionBase, claveTemporal: `tmp/${randomUUID()}`, claveIdempotencia: `${claveIdem}-segura` }, actor);
    segura = await servicio.cambiarEstadoIntencion(segura.id_publico, segura.revision, 'SUBIENDO');
    segura = await servicio.cambiarEstadoIntencion(segura.id_publico, segura.revision, 'VALIDANDO');
    const version = await repositorio.registrarVersionYFinalizarIntencion({ idIntencionPublico: segura.id_publico, revisionIntencion: segura.revision, estadoIntencion: 'DISPONIBLE', version: versionEntrada(documento.id_documento_logico, randomUUID(), { estado:'DISPONIBLE', sha256:sha, mimeDetectado:'image/jpeg', validadoEn:new Date(), resultadoValidaciones:{antivirus:{estado:'LIMPIO'}} }) }, actor);
    assert.equal(version.estado, 'DISPONIBLE');
    assert.equal((await prisma.intencion_carga_documental.findUniqueOrThrow({where:{id_publico:segura.id_publico}})).estado, 'DISPONIBLE');
    assert.equal(await prisma.evento_operacional_documental.count({where:{id_version_documento:version.id_version_documento,tipo_evento:'CARGA_CONFIRMADA'}}),1);
  });

  await t.test('21 no expone endpoints, permisos, secretos ni URLs firmadas', async () => {
    const rutas = await readFile(resolve(__dirname, '../src/rutas/finanzas.ts'), 'utf8');
    const permisos = await readFile(resolve(__dirname, '../src/validaciones/permisos.ts'), 'utf8');
    const servicioFuente = await readFile(resolve(__dirname, '../src/documental/ServicioDocumental.ts'), 'utf8');
    assert.doesNotMatch(rutas, /documental\/cargas|storage\/upload/);
    assert.doesNotMatch(permisos, /DOCUMENTO_(SUBIR|DESCARGAR)|CU_DOCUMENTAL/);
    assert.doesNotMatch(servicioFuente, /access.?key|secret.?key|https?:\/\//i);
  });
});
