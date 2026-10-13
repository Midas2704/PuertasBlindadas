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
const { cargarPoliticasActivacionDocumental } = require('../dist/documental/seguridad/PoliticasActivacionDocumental');

const uuid = '11111111-1111-4111-8111-111111111111';
const jpeg = Buffer.from([0xff,0xd8,0xff,0xe0,0,2,0xff,0xc0,0,2,0xff,0xd9]);
const png = Buffer.concat([Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]),Buffer.from([0,0,0,13]),Buffer.from('IHDR'),Buffer.alloc(17),Buffer.alloc(4),Buffer.from('IEND'),Buffer.alloc(4)]);
const pdf = Buffer.from('%PDF-1.4\n1 0 obj\n<</Type /Catalog>>\nendobj\nstartxref\n9\n%%EOF\n');
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

test('rechaza estructuras incompletas aunque conserven firmas conocidas', async () => {
  const jpegSinSof=Buffer.from([0xff,0xd8,0xff,0xe0,0,2,0xff,0xd9]);
  const pngSinIhdr=Buffer.concat([png.subarray(0,8),Buffer.alloc(4),Buffer.from('IEND'),Buffer.alloc(4)]);
  const pdfConCola=Buffer.concat([pdf,Buffer.from('<script>activo</script>')]);
  assert.equal((await validar(jpegSinSof,'image/jpeg')).mimeDetectado,null);
  assert.equal((await validar(pngSinIhdr,'image/png')).mimeDetectado,null);
  assert.equal((await validar(pdfConCola,'application/pdf')).mimeDetectado,null);
});

test('rechaza políglota con estructura JPEG y contenido activo embebido', async () => {
  const poliglota=Buffer.concat([jpeg.subarray(0,-2),Buffer.from('<script>alert(1)</script>'),jpeg.subarray(-2)]);
  const resultado=await validar(poliglota,'image/jpeg');
  assert.equal(resultado.mimeDetectado,'image/jpeg');
  assert.ok(resultado.codigos.includes('CONTENIDO_EMBEBIDO_SOSPECHOSO'));
  assert.equal(resultado.valido,false);
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
  const activo = Buffer.from('%PDF-1.4\n/OpenAction 1 0 R\nstartxref\n9\n%%EOF');
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

test('política de activación falla cerrada si falta configuración empresarial',()=>{
  assert.throws(()=>cargarPoliticasActivacionDocumental({}),/Falta DOCUMENTAL_POLITICAS_ACTIVACION_JSON/);
});

test('política provisional aislada exige todos los límites y antivirus real',()=>{
  const base={minimoBytes:1,maximoBytes:100,mimesPermitidos:['image/jpeg'],timeoutMs:1000,concurrenciaMaxima:2,cantidadMaximaPorOperacion:3,expiracionIntencionSegundos:300,expiracionUrlFirmadaSegundos:60,antivirusObligatorio:true};
  const politicas=cargarPoliticasActivacionDocumental({DOCUMENTAL_POLITICAS_ACTIVACION_JSON:JSON.stringify({COMERCIAL:base})});
  assert.equal(politicas.COMERCIAL.antivirusObligatorio,true);
  assert.equal(politicas.COMERCIAL.maximoBytes,100n);
  assert.throws(()=>cargarPoliticasActivacionDocumental({DOCUMENTAL_POLITICAS_ACTIVACION_JSON:JSON.stringify({COMERCIAL:{...base,antivirusObligatorio:false}})}),/Antivirus obligatorio/);
  assert.throws(()=>cargarPoliticasActivacionDocumental({DOCUMENTAL_POLITICAS_ACTIVACION_JSON:JSON.stringify({TRIBUTARIO:base})}),/COMERCIAL/);
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

test('adaptador clamd falla cerrado ante timeout sin exponer detalles internos', async () => {
  const socket=socketClam('stream: OK\0');
  socket.setTimeout=()=>{queueMicrotask(()=>socket.emit('timeout'));return socket;};
  socket.end=()=>{};
  const resultado=await new ClamAvDaemonAdapter({host:'local',puerto:3310,timeoutMs:1,maximoBytes:100n},()=>socket).escanear(Readable.from(jpeg));
  assert.deepEqual(resultado,{estado:'NO_DISPONIBLE',motor:'CLAMAV_DAEMON',codigo:'CLAMAV_TIMEOUT'});
  assert.doesNotMatch(JSON.stringify(resultado),/local|3310|secret|token/i);
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

function entornoCoordinador({ antivirusEstado = 'LIMPIO', bytes = jpeg, proveedor = 'R2', autorizar = async()=>{}, fallarCopia = false, antesCopiar, despuesEscaneo, fallarRegistroUnaVez = false } = {}) {
  const objetos = new Map([[`tmp:tmp/${uuid}`, bytes]]);
  const metadatos = new Map(); const reservas = new Set(); let hookCopiaEjecutado=false;
  const etag = b => `"${sha(b).slice(0,32)}"`;
  const storage = {
    proveedor, capacidades: { copiaCondicionalDestino:proveedor==='S3', escrituraCondicionalDestino:true, lecturaCondicionalOrigen:true, multipartCondicionalDestino:false },
    consultarObjeto: async r => { const k=`${r.contenedor}:${r.clave}`; const b = objetos.get(k); if (!b) throw Object.assign(new Error('NO_ENCONTRADO'),{codigo:'NO_ENCONTRADO'}); return { tamanoBytes: BigInt(b.length), etag:etag(b), metadatosProveedor:metadatos.get(k) }; },
    abrirLecturaCondicionada: async entrada => { if(antesCopiar&&!hookCopiaEjecutado){hookCopiaEjecutado=true;await antesCopiar({origen:entrada.referencia},objetos);} const b=objetos.get(`${entrada.referencia.contenedor}:${entrada.referencia.clave}`); if(!b)throw Object.assign(new Error('NO_ENCONTRADO'),{codigo:'NO_ENCONTRADO'}); if(entrada.etag!==etag(b))throw Object.assign(new Error('ORIGEN_CAMBIO'),{codigo:'CONFLICTO'}); return Readable.from([Buffer.from(b)]); },
    crearObjetoExclusivo: async entrada => { if(fallarCopia)throw Object.assign(new Error('FALLO_COPIA'),{codigo:'TEMPORAL'}); const destino=`${entrada.referencia.contenedor}:${entrada.referencia.clave}`; if(objetos.has(destino)||reservas.has(destino))throw Object.assign(new Error('DESTINO_EXISTE'),{codigo:'OBJETO_EXISTENTE'}); reservas.add(destino); try {const partes=[];for await(const parte of entrada.contenido)partes.push(Buffer.from(parte));const copia=Buffer.concat(partes);if(BigInt(copia.length)!==entrada.tamanoEsperado)throw Object.assign(new Error('INCOMPLETO'),{codigo:'INTEGRIDAD'});objetos.set(destino,copia);metadatos.set(destino,{'idempotencia-documental':entrada.claveIdempotencia});return{tamanoBytes:BigInt(copia.length),etag:etag(copia),metadatosProveedor:metadatos.get(destino)};}finally{reservas.delete(destino);} },
  };
  const intencion = { id_publico:uuid, id_documento_logico:2n, usuario_solicitante:7n, clasificacion:'FOTO', nombre_declarado:'foto.jpg', mime_declarado:'image/jpeg', tamano_esperado:BigInt(bytes.length), clave_temporal:`tmp/${uuid}`, estado:'PENDIENTE', revision:1, expira_en:new Date(Date.now()+60000) };
  const versiones = new Map(); let siguiente = 1n; let fallosRegistro=0;
  const repo = {
    consultarIntencion: async () => ({...intencion}),
    cambiarEstadoIntencion: async (_id, revision, estado) => { if(revision!==intencion.revision)throw Object.assign(new Error('REVISION_DESACTUALIZADA'),{codigo:'REVISION_DESACTUALIZADA'}); intencion.estado=estado; intencion.revision++; return {...intencion}; },
    consultarVersionPorObjeto: async (_p,c,k) => versiones.get(`${c}:${k}`) ?? null,
    registrarVersionYFinalizarIntencion: async entrada => { if(fallarRegistroUnaVez&&fallosRegistro++===0)throw Object.assign(new Error('DB_TEMPORAL'),{codigo:'DB_TEMPORAL'}); const v={id_version_documento:siguiente++,id_documento_logico:entrada.version.idDocumento,estado:entrada.estadoIntencion,tamano_bytes:BigInt(entrada.version.tamanoBytes),sha256:entrada.version.sha256,mime_detectado:entrada.version.mimeDetectado,resultado_validaciones:entrada.version.resultadoValidaciones}; versiones.set(`${entrada.version.contenedor}:${entrada.version.claveObjeto}`,v); intencion.estado=entrada.estadoIntencion; return v; },
  };
  const coordinador = new CoordinadorCargaDocumental(repo, storage, { nombre:'TEST', escanear: async contenido => { for await(const _ of contenido){} if(despuesEscaneo)await despuesEscaneo(objetos); return { estado:antivirusEstado }; } }, autorizar, { proveedor, contenedorTemporal:'tmp', contenedorDefinitivo:'docs', prefijoDisponible:'objects', prefijoCuarentena:'quarantine', politicasPorClasificacion:{ FOTO:politica(['image/jpeg']) } });
  return { coordinador, objetos, metadatos, repo, intencion, cantidadVersiones:()=>versiones.size };
}

test('carga limpia se promueve, verifica y queda DISPONIBLE', async () => {
  const { coordinador, objetos } = entornoCoordinador();
  const resultado = await coordinador.confirmar({ idIntencion:uuid, idDocumento:2n, actor });
  assert.equal(resultado.estado, 'DISPONIBLE');
  assert.deepEqual(objetos.get(`docs:objects/${uuid}`), jpeg);
  assert.equal(resultado.integridad.sha256, sha(jpeg));
});

for (const estado of ['INFECTADO','ERROR_ESCANEO','NO_DISPONIBLE','ARCHIVO_NO_SOPORTADO']) test(`antivirus ${estado} envía a cuarentena`, async () => {
  const { coordinador, objetos } = entornoCoordinador({ antivirusEstado:estado });
  const resultado = await coordinador.confirmar({ idIntencion:uuid, idDocumento:2n, actor });
  assert.equal(resultado.estado, 'CUARENTENA');
  assert.ok(objetos.has(`docs:quarantine/${uuid}`));
});

test('reintento usa versión determinista sin duplicarla', async () => {
  const entorno = entornoCoordinador();
  const primero = await entorno.coordinador.confirmar({ idIntencion:uuid, idDocumento:2n, actor });
  const segundo = await entorno.coordinador.confirmar({ idIntencion:uuid, idDocumento:2n, actor });
  assert.equal(segundo.versionId, primero.versionId);
  assert.equal(segundo.idempotente, true);
});

test('dos confirmaciones concurrentes no generan versiones duplicadas y el reintento converge', async () => {
  const entorno=entornoCoordinador();
  const resultados=await Promise.allSettled([
    entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),
    entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),
  ]);
  assert.equal(resultados.filter(x=>x.status==='fulfilled').length,1);
  assert.equal(resultados.filter(x=>x.status==='rejected'&&x.reason.codigo==='REVISION_DESACTUALIZADA').length,1);
  assert.equal(entorno.cantidadVersiones(),1);
  const exitoso=resultados.find(x=>x.status==='fulfilled').value;
  const reintento=await entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor});
  assert.equal(reintento.versionId,exitoso.versionId);
  assert.equal(reintento.idempotente,true);
});

test('no sobrescribe una clave definitiva preexistente con otros bytes', async () => {
  const entorno=entornoCoordinador(); entorno.objetos.set(`docs:objects/${uuid}`,png);
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),error=>error.codigo==='DESTINO_OCUPADO');
  assert.deepEqual(entorno.objetos.get(`docs:objects/${uuid}`),png);
});

test('fallo de promoción no confirma versión ni intención final', async () => {
  const entorno=entornoCoordinador({fallarCopia:true});
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),/FALLO_COPIA/);
  assert.equal(entorno.intencion.estado,'VALIDANDO');
});

test('coordinador exige autorización backend antes de leer el objeto', async () => {
  const entorno=entornoCoordinador({autorizar:async()=>{throw Object.assign(new Error('DENEGADO'),{codigo:'DENEGADO'});}});
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),error=>error.codigo==='DENEGADO');
  assert.equal(entorno.intencion.estado,'PENDIENTE');
});

for(const proveedor of ['R2','S3']) test(`mismo flujo portable para ${proveedor}`,async()=>{
  const entorno=entornoCoordinador({proveedor});
  assert.equal((await entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor})).estado,'DISPONIBLE');
});

test('adaptador sin capacidades de lectura/copia falla antes de confirmar',async()=>{
  const entorno=entornoCoordinador();
  const repo=entorno.repo;
  const coordinador=new CoordinadorCargaDocumental(repo,{proveedor:'R2',capacidades:{},consultarObjeto:async()=>({tamanoBytes:1n})},{nombre:'x',escanear:async()=>({estado:'LIMPIO'})},async()=>{},{proveedor:'R2',contenedorTemporal:'tmp',contenedorDefinitivo:'docs',prefijoDisponible:'objects',prefijoCuarentena:'quarantine',politicasPorClasificacion:{FOTO:politica(['image/jpeg'])}});
  await assert.rejects(()=>coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),error=>error.codigo==='STORAGE_SIN_CAPACIDAD');
});

test('proveedor sin creación condicional de destino queda bloqueado antes de leer bytes',async()=>{
  const entorno=entornoCoordinador(); let lecturas=0;
  const storage={proveedor:'R2',capacidades:{escrituraCondicionalDestino:false,lecturaCondicionalOrigen:true},consultarObjeto:async()=>{lecturas++;return{tamanoBytes:1n}},abrirLecturaCondicionada:async()=>Readable.from([]),crearObjetoExclusivo:async()=>({tamanoBytes:1n})};
  const coordinador=new CoordinadorCargaDocumental(entorno.repo,storage,{nombre:'x',escanear:async()=>({estado:'LIMPIO'})},async()=>{},{proveedor:'R2',contenedorTemporal:'tmp',contenedorDefinitivo:'docs',prefijoDisponible:'objects',prefijoCuarentena:'quarantine',politicasPorClasificacion:{FOTO:politica(['image/jpeg'])}});
  await assert.rejects(()=>coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),error=>error.codigo==='PROMOCION_CONDICIONAL_NO_VALIDADA');
  assert.equal(lecturas,0);
});

test('intención de otro actor no puede confirmarse', async () => {
  const { coordinador } = entornoCoordinador();
  await assert.rejects(() => coordinador.confirmar({ idIntencion:uuid, idDocumento:2n, actor:{...actor,id:9n} }), error => error.codigo === 'ACTOR_NO_COINCIDE');
});

test('intención no puede confirmarse contra otro documento', async()=>{
  const entorno=entornoCoordinador();
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:3n,actor}),error=>error.codigo==='INTENCION_DOCUMENTO_NO_COINCIDE');
});

test('cambio del temporal durante la copia de trabajo se detecta por condición ETag',async()=>{
  const entorno=entornoCoordinador({antesCopiar:async(entrada,objetos)=>{if(entrada.origen.clave.startsWith('tmp/'))objetos.set(`tmp:tmp/${uuid}`,png);}});
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),error=>error.codigo==='CONFLICTO');
});

test('cambio de copia de trabajo después del antivirus impide promoción',async()=>{
  const entorno=entornoCoordinador({despuesEscaneo:async objetos=>objetos.set(`docs:quarantine/${uuid}`,png)});
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),error=>error.codigo==='COPIA_TRABAJO_MODIFICADA');
  assert.equal(entorno.objetos.has(`docs:objects/${uuid}`),false);
});

test('error PostgreSQL después de copiar se recupera sin nueva carga',async()=>{
  const entorno=entornoCoordinador({fallarRegistroUnaVez:true});
  await assert.rejects(()=>entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor}),/DB_TEMPORAL/);
  entorno.objetos.delete(`tmp:tmp/${uuid}`);
  const recuperado=await entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor});
  assert.equal(recuperado.estado,'DISPONIBLE');
});

test('la copia temporal original no se modifica ni se usa tras congelar el trabajo',async()=>{
  const entorno=entornoCoordinador(); const original=Buffer.from(entorno.objetos.get(`tmp:tmp/${uuid}`));
  await entorno.coordinador.confirmar({idIntencion:uuid,idDocumento:2n,actor});
  assert.deepEqual(entorno.objetos.get(`tmp:tmp/${uuid}`),original);
});

test('descarga exige versión disponible, íntegra y limpia', async () => {
  const storage = { proveedor:'R2', firmarDescarga: async entrada => ({ url:'https://ejemplo.invalid/firma', expiraEn:new Date(), parametrosRespuestaFirmados:{'cache-control':entrada.cacheControlRespuesta} }) };
  const version = { id_version_documento:1n,id_documento_logico:2n, proveedor_logico:'R2', contenedor_logico:'docs', clave_objeto:'objects/x', nombre_seguro:'x.pdf', estado:'DISPONIBLE', mime_detectado:'application/pdf', sha256:'a'.repeat(64), resultado_validaciones:{antivirus:{estado:'LIMPIO'}} };
  const servicio = new ServicioRecuperacionDocumental(storage, async () => version, async (autenticado,documento) => {assert.equal(autenticado.id,7n);assert.equal(documento.id_documento_logico,2n);});
  const resultado = await servicio.firmar({idVersion:1n,actor,vigenciaSegundos:9999});
  assert.equal(resultado.parametrosRespuestaFirmados['cache-control'], 'private, no-store');
  assert.equal(resultado.headersRespuestaRequeridos['x-content-type-options'], 'nosniff');
});

test('cuarentena no puede descargarse', async () => {
  const servicio = new ServicioRecuperacionDocumental({ proveedor:'R2',firmarDescarga: async()=>{throw new Error('NO');} }, async()=>({ id_version_documento:1n,id_documento_logico:2n,proveedor_logico:'R2',contenedor_logico:'d',clave_objeto:'quarantine/x',nombre_seguro:'x',estado:'CUARENTENA', sha256:'a'.repeat(64), mime_detectado:'image/jpeg', resultado_validaciones:{antivirus:{estado:'INFECTADO'}} }), async()=>{});
  await assert.rejects(() => servicio.firmar({idVersion:1n,actor}), error => error.codigo === 'VERSION_NO_RECUPERABLE');
});

test('descarga ajena es rechazada por autorización vinculada a entidad',async()=>{
  const version={id_version_documento:1n,id_documento_logico:99n,proveedor_logico:'R2',contenedor_logico:'d',clave_objeto:'objects/x',nombre_seguro:'x',estado:'DISPONIBLE',sha256:'a'.repeat(64),mime_detectado:'image/jpeg',resultado_validaciones:{antivirus:{estado:'LIMPIO'}}};
  const servicio=new ServicioRecuperacionDocumental({proveedor:'R2',firmarDescarga:async()=>{throw new Error('NO');}},async()=>version,async()=>{throw Object.assign(new Error('AJENO'),{codigo:'ALCANCE_DOCUMENTAL_DENEGADO'});});
  await assert.rejects(()=>servicio.firmar({idVersion:1n,actor}),error=>error.codigo==='ALCANCE_DOCUMENTAL_DENEGADO');
});

test('descarga rechaza proveedor distinto al adaptador activo',async()=>{
  const version={id_version_documento:1n,id_documento_logico:2n,proveedor_logico:'S3',contenedor_logico:'d',clave_objeto:'objects/x',nombre_seguro:'x',estado:'DISPONIBLE',sha256:'a'.repeat(64),mime_detectado:'image/jpeg',resultado_validaciones:{antivirus:{estado:'LIMPIO'}}};
  const servicio=new ServicioRecuperacionDocumental({proveedor:'R2',firmarDescarga:async()=>({})},async()=>version,async()=>{});
  await assert.rejects(()=>servicio.firmar({idVersion:1n,actor}),error=>error.codigo==='PROVEEDOR_NO_COINCIDE');
});

test('outbox no se ejecuta al importar y procesa explícitamente', async () => {
  const cambios=[]; let entregado=false; let manejado=0;
  const repo={ reclamarSiguienteEvento:async()=>entregado?null:(entregado=true,{id_evento_operacional:1n,tipo_evento:'VALIDAR',estado:'PROCESANDO',cantidad_intentos:1,lease_token:'lease-a'}), cambiarEstadoEvento:async(_id,e,_c,lease)=>cambios.push([e,lease]) };
  const procesador=new ProcesadorOutboxDocumental(repo,{VALIDAR:async()=>{manejado++;}});
  assert.equal(manejado,0);
  assert.equal(await procesador.procesarUno(),'PROCESADO');
  assert.deepEqual(cambios,[['PROCESADO','lease-a']]);
});

test('outbox aplica límite de intentos y descarta con transiciones válidas', async () => {
  const cambios=[]; const repo={ reclamarSiguienteEvento:async()=>({id_evento_operacional:1n,tipo_evento:'X',estado:'PROCESANDO',cantidad_intentos:5,lease_token:'lease-a'}), cambiarEstadoEvento:async(_id,e,c,lease)=>cambios.push([e,c,lease]) };
  const procesador=new ProcesadorOutboxDocumental(repo,{X:async()=>{throw Object.assign(new Error('secret=https://x'),{codigo:'TEMPORAL'});}},5);
  assert.equal(await procesador.procesarUno(),'DESCARTADO');
  assert.deepEqual(cambios,[['ERROR','TEMPORAL','lease-a'],['DESCARTADO','TEMPORAL',undefined]]);
});

test('reconciliación sólo informa faltantes, divergencias, expiraciones y atascos', async () => {
  const storage={ consultarObjeto:async r=>{if(r.clave==='falta')throw new Error();return{tamanoBytes:2n};}, listarCargasIncompletas:async()=>[{identificadorMultipart:'m1'}] };
  const r=new ReconciliadorDocumental(storage);
  const hallazgos=await r.diagnosticar({versiones:[{id:1n,contenedor:'d',clave:'falta',tamano:1n,estado:'DISPONIBLE'},{id:2n,contenedor:'d',clave:'otro',tamano:1n,estado:'DISPONIBLE'}],intenciones:[{id:'i',estado:'VALIDANDO',expiraEn:new Date(0)}],eventos:[{id:3n,estado:'PENDIENTE',creadoEn:new Date(0)}],ahora:new Date(600000),contenedorTemporal:'tmp'});
  assert.deepEqual(new Set(hallazgos.map(h=>h.tipo)),new Set(['OBJETO_FALTANTE','TAMANO_DIVERGENTE','INTENCION_EXPIRADA','EVENTO_ATASCADO','MULTIPART_ABANDONADO','HUERFANOS_NO_EVALUABLES']));
});
