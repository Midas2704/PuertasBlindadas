const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const { EventEmitter } = require('node:events');
const { createHash } = require('node:crypto');
const { validarIntegridadContenido } = require('../dist/documental/seguridad/IntegridadContenido');
const { AntivirusNoDisponible, ClamAvDaemonAdapter, exigirResultadoLimpio } = require('../dist/documental/seguridad/AntivirusAdapter');
const { AutorizadorDocumental } = require('../dist/documental/seguridad/AutorizacionDocumental');
const { validarEventoAuditoria } = require('../dist/documental/seguridad/AuditoriaDocumental');
const { CoordinadorCargaDocumental } = require('../dist/documental/operaciones/CoordinadorCargaDocumental');
const { ServicioRecuperacionDocumental } = require('../dist/documental/operaciones/ServicioRecuperacionDocumental');
const { ProcesadorOutboxDocumental } = require('../dist/documental/operaciones/ProcesadorOutboxDocumental');
const { ReconciliadorDocumental } = require('../dist/documental/operaciones/ReconciliadorDocumental');
const { cargarConfiguracionSeguridadDocumental } = require('../dist/documental/seguridad/configuracionSeguridadDocumental');

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3, 0xff, 0xd9]);
const png = Buffer.concat([Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]), Buffer.from('IEND')]);
const pdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF');
const webp = (() => { const b = Buffer.alloc(16); b.write('RIFF'); b.writeUInt32LE(8, 4); b.write('WEBP', 8); b.write('VP8 ', 12); return b; })();
const sha = b => createHash('sha256').update(b).digest('hex');
const politica = mimes => ({ minimoBytes: 1n, maximoBytes: 1024n, mimesPermitidos: mimes });
const validar = (contenido, mime, extra = {}) => validarIntegridadContenido({ contenido: Readable.from(contenido), mimeDeclarado: mime, tamanoEsperado: BigInt(contenido.length), politica: politica(['image/jpeg','image/png','image/webp','application/pdf']), ...extra });

for (const [nombre, contenido, mime] of [['JPEG',jpeg,'image/jpeg'],['PNG',png,'image/png'],['WebP',webp,'image/webp'],['PDF',pdf,'application/pdf']]) {
  test(`detecta ${nombre} por bytes, calcula SHA-256 y tamaño`, async () => {
    const resultado = await validar(contenido, mime);
    assert.equal(resultado.valido, true);
    assert.equal(resultado.mimeDetectado, mime);
    assert.equal(resultado.sha256, sha(contenido));
    assert.equal(resultado.tamanoBytes, BigInt(contenido.length));
  });
}

test('rechaza HTML disfrazado de JPEG', async () => {
  const resultado = await validar(Buffer.from('<html><script>alert(1)</script></html>'), 'image/jpeg');
  assert.equal(resultado.valido, false);
  assert.ok(resultado.codigos.includes('MIME_NO_SOPORTADO'));
});

test('registra discrepancia entre MIME declarado y detectado', async () => {
  const resultado = await validar(jpeg, 'image/png');
  assert.equal(resultado.mimeDetectado, 'image/jpeg');
  assert.ok(resultado.codigos.includes('MIME_DECLARADO_NO_COINCIDE'));
});

test('rechaza JPEG truncado y archivo comprimido', async () => {
  const truncado=await validar(jpeg.subarray(0,-2),'image/jpeg');
  const zip=await validar(Buffer.from([0x50,0x4b,0x03,0x04,1,2,3]),'application/zip');
  assert.equal(truncado.mimeDetectado,null); assert.equal(zip.mimeDetectado,null);
});

test('propaga error de lectura sin convertirlo en aprobación', async () => {
  const contenido=new Readable({read(){this.destroy(new Error('LECTURA_FALLIDA'));}});
  await assert.rejects(()=>validarIntegridadContenido({contenido,mimeDeclarado:'image/jpeg',tamanoEsperado:1n,politica:politica(['image/jpeg'])}),/LECTURA_FALLIDA/);
});

test('rechaza tamaño esperado y hash distintos', async () => {
  const resultado = await validarIntegridadContenido({ contenido: Readable.from(jpeg), mimeDeclarado: 'image/jpeg', tamanoEsperado: 999n, sha256Esperado: '0'.repeat(64), politica: politica(['image/jpeg']) });
  assert.ok(resultado.codigos.includes('TAMANO_NO_COINCIDE'));
  assert.ok(resultado.codigos.includes('SHA256_NO_COINCIDE'));
});

test('corta el stream al superar límite técnico', async () => {
  const resultado = await validarIntegridadContenido({ contenido: Readable.from(Buffer.alloc(20)), mimeDeclarado: 'image/png', tamanoEsperado: 20n, politica: { minimoBytes: 1n, maximoBytes: 10n, mimesPermitidos: ['image/png'] } });
  assert.ok(resultado.codigos.includes('TAMANO_SUPERA_LIMITE'));
});

test('rechaza PDF con acción activa', async () => {
  const activo = Buffer.from('%PDF-1.4\n/OpenAction 1 0 R\n%%EOF');
  const resultado = await validar(activo, 'application/pdf');
  assert.ok(resultado.codigos.includes('PDF_CONTENIDO_ACTIVO'));
});

test('antivirus no configurado falla cerrado', async () => {
  const resultado = await new AntivirusNoDisponible().escanear(Readable.from(jpeg));
  assert.equal(resultado.estado, 'NO_DISPONIBLE');
  assert.throws(() => exigirResultadoLimpio(resultado), /no fue aprobado/);
});

test('configuración técnica no inventa políticas ni activa antivirus', () => {
  const configuracion = cargarConfiguracionSeguridadDocumental({});
  assert.deepEqual(configuracion.politicasPorClasificacion, {});
  assert.equal(configuracion.clamav, null);
});

test('configuración valida límites y allowlist MIME', () => {
  const configuracion = cargarConfiguracionSeguridadDocumental({ DOCUMENTAL_POLITICAS_TECNICAS_JSON: JSON.stringify({ foto:{minimoBytes:'1',maximoBytes:'100',mimesPermitidos:['image/jpeg']} }) });
  assert.equal(configuracion.politicasPorClasificacion.FOTO.maximoBytes, 100n);
  assert.throws(() => cargarConfiguracionSeguridadDocumental({ DOCUMENTAL_POLITICAS_TECNICAS_JSON: JSON.stringify({ foto:{minimoBytes:'1',maximoBytes:'100',mimesPermitidos:['image/svg+xml']} }) }), /MIME/);
});

test('sólo LIMPIO supera el guard antivirus', () => assert.doesNotThrow(() => exigirResultadoLimpio({ estado: 'LIMPIO' })));

function socketClam(respuesta) {
  const socket = new EventEmitter(); socket.escrituras=[];
  socket.setTimeout=()=>socket; socket.write=b=>{socket.escrituras.push(Buffer.from(b));return true;}; socket.destroy=()=>{};
  socket.end=b=>{if(b)socket.escrituras.push(Buffer.from(b));queueMicrotask(()=>{socket.emit('data',Buffer.from(respuesta));socket.emit('end');});};
  return socket;
}

test('adaptador clamd transmite INSTREAM y reconoce archivo limpio', async () => {
  const socket=socketClam('stream: OK\0');
  const adapter=new ClamAvDaemonAdapter({host:'127.0.0.1',puerto:3310,timeoutMs:1000,maximoBytes:100n},()=>socket);
  assert.equal((await adapter.escanear(Readable.from(jpeg))).estado,'LIMPIO');
  assert.equal(socket.escrituras[0].toString(),'zINSTREAM\0');
  assert.equal(socket.escrituras.at(-1).length,4);
});

test('adaptador clamd normaliza infección sin exponer el contenido', async () => {
  const adapter=new ClamAvDaemonAdapter({host:'local',puerto:3310,timeoutMs:1000,maximoBytes:100n},()=>socketClam('stream: Test-Signature FOUND\0'));
  const resultado=await adapter.escanear(Readable.from(jpeg));
  assert.equal(resultado.estado,'INFECTADO'); assert.equal(resultado.firma,'Test-Signature');
});

test('adaptador clamd normaliza respuesta inválida y conexión fallida', async () => {
  const config={host:'local',puerto:3310,timeoutMs:1000,maximoBytes:100n};
  assert.equal((await new ClamAvDaemonAdapter(config,()=>socketClam('UNKNOWN')).escanear(Readable.from(jpeg))).estado,'ERROR_ESCANEO');
  const fallido=new ClamAvDaemonAdapter(config,()=>{throw new Error('SIN_MOTOR');});
  assert.equal((await fallido.escanear(Readable.from(jpeg))).estado,'NO_DISPONIBLE');
});

const actor = { id: 7n, sesion: 's', permisos: ['CU360','CU366','CU367'], administrador: false };
test('autorización usa permiso existente y alcance backend', async () => {
  const autorizador = new AutorizadorDocumental(async (_actor, contexto) => contexto.idProducto === 8);
  await autorizador.exigir(actor, 'ASOCIAR_PRODUCTO', { idProducto: 8 });
  await assert.rejects(() => autorizador.exigir(actor, 'ASOCIAR_PRODUCTO', { idProducto: 9 }), error => error.codigo === 'ALCANCE_DOCUMENTAL_DENEGADO');
});

test('acción sin CU aprobada queda cerrada incluso para administrador', async () => {
  const autorizador = new AutorizadorDocumental(async () => true);
  await assert.rejects(() => autorizador.exigir({ ...actor, administrador: true }, 'DESCARGAR', {}), error => error.codigo === 'PERMISO_DOCUMENTAL_NO_DEFINIDO');
});

test('auditoría rechaza URLs, tokens y secretos', () => {
  const base = { idempotencia: 'x', operacion: 'CARGA_CONFIRMADA', actorId: 1n, resultado: 'EXITO', ocurridoEn: new Date() };
  assert.doesNotThrow(() => validarEventoAuditoria(base));
  assert.throws(() => validarEventoAuditoria({ ...base, motivoCodigo: 'https://firma' }), /PROHIBIDO/);
  assert.throws(() => validarEventoAuditoria({ ...base, motivoCodigo: 'secret-value' }), /PROHIBIDO/);
});

function entornoCoordinador({ antivirusEstado = 'LIMPIO', bytes = jpeg, proveedor = 'R2', autorizar = async()=>{}, fallarCopia = false } = {}) {
  const objetos = new Map([['tmp:tmp/123', bytes]]);
  const storage = {
    proveedor: 'R2', capacidades: {},
    consultarObjeto: async r => { const b = objetos.get(`${r.contenedor}:${r.clave}`); if (!b) throw Object.assign(new Error('NO_ENCONTRADO'),{codigo:'NO_ENCONTRADO'}); return { tamanoBytes: BigInt(b.length) }; },
    abrirLectura: async r => Readable.from(objetos.get(`${r.contenedor}:${r.clave}`)),
    copiarObjeto: async ({origen,destino}) => { if(fallarCopia)throw Object.assign(new Error('FALLO_COPIA'),{codigo:'TEMPORAL'}); const b = Buffer.from(objetos.get(`${origen.contenedor}:${origen.clave}`)); objetos.set(`${destino.contenedor}:${destino.clave}`, b); return { tamanoBytes: BigInt(b.length) }; },
  };
  const intencion = { id_publico:'123', usuario_solicitante:7n, clasificacion:'FOTO', nombre_declarado:'foto.jpg', mime_declarado:'image/jpeg', tamano_esperado:BigInt(bytes.length), clave_temporal:'tmp/123', estado:'PENDIENTE', revision:1, expira_en:new Date(Date.now()+60000) };
  const versiones = new Map(); let siguiente = 1n;
  const repo = {
    consultarIntencion: async () => ({...intencion}),
    cambiarEstadoIntencion: async (_id, revision, estado) => { assert.equal(revision,intencion.revision); intencion.estado=estado; intencion.revision++; return {...intencion}; },
    consultarVersionPorObjeto: async (_p,c,k) => versiones.get(`${c}:${k}`) ?? null,
    registrarVersionYFinalizarIntencion: async entrada => { const v={id_version_documento:siguiente++,estado:entrada.estadoIntencion}; versiones.set(`${entrada.version.contenedor}:${entrada.version.claveObjeto}`,v); intencion.estado=entrada.estadoIntencion; return v; },
  };
  const coordinador = new CoordinadorCargaDocumental(repo, storage, { nombre:'TEST', escanear: async () => ({ estado:antivirusEstado }) }, autorizar, { proveedor, contenedorTemporal:'tmp', contenedorDefinitivo:'docs', prefijoDisponible:'objects', prefijoCuarentena:'quarantine', politicasPorClasificacion:{ FOTO:politica(['image/jpeg']) } });
  return { coordinador, objetos, repo, intencion };
}

test('carga limpia se promueve, verifica y queda DISPONIBLE', async () => {
  const { coordinador, objetos } = entornoCoordinador();
  const resultado = await coordinador.confirmar({ idIntencion:'123', idDocumento:2n, actor });
  assert.equal(resultado.estado, 'DISPONIBLE');
  assert.deepEqual(objetos.get('docs:objects/123'), jpeg);
  assert.equal(resultado.integridad.sha256, sha(jpeg));
});

for (const estado of ['INFECTADO','ERROR_ESCANEO','NO_DISPONIBLE','ARCHIVO_NO_SOPORTADO']) test(`antivirus ${estado} envía a cuarentena`, async () => {
  const { coordinador, objetos } = entornoCoordinador({ antivirusEstado:estado });
  const resultado = await coordinador.confirmar({ idIntencion:'123', idDocumento:2n, actor });
  assert.equal(resultado.estado, 'CUARENTENA');
  assert.ok(objetos.has('docs:quarantine/123'));
});

test('reintento usa versión determinista sin duplicarla', async () => {
  const entorno = entornoCoordinador();
  const primero = await entorno.coordinador.confirmar({ idIntencion:'123', idDocumento:2n, actor });
  const segundo = await entorno.coordinador.confirmar({ idIntencion:'123', idDocumento:2n, actor });
  assert.equal(segundo.versionId, primero.versionId);
  assert.equal(segundo.idempotente, true);
});

test('no sobrescribe una clave definitiva preexistente con otros bytes', async () => {
  const entorno=entornoCoordinador(); entorno.objetos.set('docs:objects/123',png);
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:'123',idDocumento:2n,actor}),error=>error.codigo==='DESTINO_OCUPADO');
  assert.deepEqual(entorno.objetos.get('docs:objects/123'),png);
});

test('fallo de promoción no confirma versión ni intención final', async () => {
  const entorno=entornoCoordinador({fallarCopia:true});
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:'123',idDocumento:2n,actor}),/FALLO_COPIA/);
  assert.equal(entorno.intencion.estado,'VALIDANDO');
});

test('coordinador exige autorización backend antes de leer el objeto', async () => {
  const entorno=entornoCoordinador({autorizar:async()=>{throw Object.assign(new Error('DENEGADO'),{codigo:'DENEGADO'});}});
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:'123',idDocumento:2n,actor}),error=>error.codigo==='DENEGADO');
  assert.equal(entorno.intencion.estado,'PENDIENTE');
});

for(const proveedor of ['R2','S3']) test(`mismo flujo portable para ${proveedor}`,async()=>{
  const entorno=entornoCoordinador({proveedor});
  assert.equal((await entorno.coordinador.confirmar({idIntencion:'123',idDocumento:2n,actor})).estado,'DISPONIBLE');
});

test('adaptador sin capacidades de lectura/copia falla antes de confirmar',async()=>{
  const entorno=entornoCoordinador();
  const repo=entorno.repo;
  const coordinador=new CoordinadorCargaDocumental(repo,{proveedor:'R2',capacidades:{},consultarObjeto:async()=>({tamanoBytes:1n})},{nombre:'x',escanear:async()=>({estado:'LIMPIO'})},async()=>{},{proveedor:'R2',contenedorTemporal:'tmp',contenedorDefinitivo:'docs',prefijoDisponible:'objects',prefijoCuarentena:'quarantine',politicasPorClasificacion:{FOTO:politica(['image/jpeg'])}});
  await assert.rejects(()=>coordinador.confirmar({idIntencion:'123',idDocumento:2n,actor}),error=>error.codigo==='STORAGE_SIN_CAPACIDAD');
});

test('intención de otro actor no puede confirmarse', async () => {
  const { coordinador } = entornoCoordinador();
  await assert.rejects(() => coordinador.confirmar({ idIntencion:'123', idDocumento:2n, actor:{...actor,id:9n} }), error => error.codigo === 'ACTOR_NO_COINCIDE');
});

test('descarga exige versión disponible, íntegra y limpia', async () => {
  const storage = { firmarDescarga: async () => ({ url:'https://ejemplo.invalid/firma', expiraEn:new Date() }) };
  const version = { id_version_documento:1n, proveedor_logico:'R2', contenedor_logico:'docs', clave_objeto:'objects/x', nombre_seguro:'x.pdf', estado:'DISPONIBLE', mime_detectado:'application/pdf', sha256:'a'.repeat(64), resultado_validaciones:{antivirus:{estado:'LIMPIO'}} };
  const servicio = new ServicioRecuperacionDocumental(storage, async () => version, async () => {});
  const resultado = await servicio.firmar(1n, 9999);
  assert.equal(resultado.headersObligatorios['cache-control'], 'private, no-store');
  assert.equal(resultado.headersObligatorios['x-content-type-options'], 'nosniff');
});

test('cuarentena no puede descargarse', async () => {
  const servicio = new ServicioRecuperacionDocumental({ firmarDescarga: async()=>{throw new Error('NO');} }, async()=>({ estado:'CUARENTENA', sha256:'a'.repeat(64), mime_detectado:'image/jpeg', resultado_validaciones:{antivirus:{estado:'INFECTADO'}} }), async()=>{});
  await assert.rejects(() => servicio.firmar(1n), error => error.codigo === 'VERSION_NO_RECUPERABLE');
});

test('outbox no se ejecuta al importar y procesa explícitamente', async () => {
  const cambios=[]; let entregado=false; let manejado=0;
  const repo={ reclamarSiguienteEvento:async()=>entregado?null:(entregado=true,{id_evento_operacional:1n,tipo_evento:'VALIDAR',estado:'PROCESANDO',cantidad_intentos:1}), cambiarEstadoEvento:async(_id,e)=>cambios.push(e) };
  const procesador=new ProcesadorOutboxDocumental(repo,{VALIDAR:async()=>{manejado++;}});
  assert.equal(manejado,0);
  assert.equal(await procesador.procesarUno(),'PROCESADO');
  assert.deepEqual(cambios,['PROCESADO']);
});

test('outbox aplica límite de intentos y descarta con transiciones válidas', async () => {
  const cambios=[]; const repo={ reclamarSiguienteEvento:async()=>({id_evento_operacional:1n,tipo_evento:'X',estado:'PROCESANDO',cantidad_intentos:4}), cambiarEstadoEvento:async(_id,e)=>cambios.push(e) };
  const procesador=new ProcesadorOutboxDocumental(repo,{X:async()=>{throw new Error('TEMPORAL');}},5);
  assert.equal(await procesador.procesarUno(),'DESCARTADO');
  assert.deepEqual(cambios,['ERROR','DESCARTADO']);
});

test('reconciliación sólo informa faltantes, divergencias, expiraciones y atascos', async () => {
  const storage={ consultarObjeto:async r=>{if(r.clave==='falta')throw new Error();return{tamanoBytes:2n};}, listarCargasIncompletas:async()=>[{identificadorMultipart:'m1'}] };
  const r=new ReconciliadorDocumental(storage);
  const hallazgos=await r.diagnosticar({versiones:[{id:1n,contenedor:'d',clave:'falta',tamano:1n,estado:'DISPONIBLE'},{id:2n,contenedor:'d',clave:'otro',tamano:1n,estado:'DISPONIBLE'}],intenciones:[{id:'i',estado:'VALIDANDO',expiraEn:new Date(0)}],eventos:[{id:3n,estado:'PENDIENTE',creadoEn:new Date(0)}],ahora:new Date(600000),contenedorTemporal:'tmp'});
  assert.deepEqual(new Set(hallazgos.map(h=>h.tipo)),new Set(['OBJETO_FALTANTE','TAMANO_DIVERGENTE','INTENCION_EXPIRADA','EVENTO_ATASCADO','MULTIPART_ABANDONADO','HUERFANOS_NO_EVALUABLES']));
});
