const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash, randomUUID } = require('node:crypto');
const { Readable } = require('node:stream');
const { S3CompatibleStorageAdapter } = require('../dist/documental/ServicioDocumental');
const { CoordinadorDocumentosProducto } = require('../dist/documental/productos/CoordinadorDocumentosProducto');

const BUCKET='portable-pruebas';
const sha=b=>createHash('sha256').update(b).digest('hex');
const referencia=(prefijo='objects')=>({contenedor:BUCKET,clave:`${prefijo}/${randomUUID()}`});
const errorHttp=(estado,nombre)=>{const e=new Error('detalle no público');e.name=nombre;e.$metadata={httpStatusCode:estado};return e;};

class ClienteStorageAtomico {
  constructor(){this.objetos=new Map();this.reservas=new Set();this.siguienteError=null;this.despuesDePersistir=null;this.llamadas=[];}
  clave(input){return `${input.Bucket}:${input.Key}`;}
  sembrar(ref,bytes,metadata={}){const b=Buffer.from(bytes);this.objetos.set(`${ref.contenedor}:${ref.clave}`,{bytes:b,etag:`"${sha(b)}"`,metadata,mime:'application/octet-stream'});}
  async consumir(stream,signal){const partes=[];for await(const parte of stream){if(signal?.aborted)throw Object.assign(new Error(),{name:'AbortError'});partes.push(Buffer.from(parte));}return Buffer.concat(partes);}
  async send(comando,{abortSignal}={}){
    const nombre=comando.constructor.name,input=comando.input,key=this.clave(input);this.llamadas.push({nombre,input});
    if(this.siguienteError){const e=this.siguienteError;this.siguienteError=null;throw e;}
    if(nombre==='PutObjectCommand'){
      if(input.IfNoneMatch==='*'&&(this.objetos.has(key)||this.reservas.has(key)))throw errorHttp(412,'PreconditionFailed');
      this.reservas.add(key);
      try{const bytes=await this.consumir(input.Body,abortSignal);if(input.ContentLength!==undefined&&bytes.length!==input.ContentLength)throw errorHttp(400,'IncompleteBody');const objeto={bytes,etag:`"${sha(bytes)}"`,metadata:input.Metadata??{},mime:input.ContentType};this.objetos.set(key,objeto);if(this.despuesDePersistir){const f=this.despuesDePersistir;this.despuesDePersistir=null;await f();}return{ETag:objeto.etag};}finally{this.reservas.delete(key);}
    }
    if(nombre==='HeadObjectCommand'){const o=this.objetos.get(key);if(!o)throw errorHttp(404,'NoSuchKey');return{ContentLength:o.bytes.length,ETag:o.etag,ContentType:o.mime,Metadata:o.metadata};}
    if(nombre==='GetObjectCommand'){const o=this.objetos.get(key);if(!o)throw errorHttp(404,'NoSuchKey');if(input.IfMatch&&input.IfMatch!==o.etag)throw errorHttp(412,'PreconditionFailed');return{Body:Readable.from([Buffer.from(o.bytes)])};}
    return{};
  }
}

const adaptar=(proveedor='R2',cliente=new ClienteStorageAtomico(),timeoutMs=100)=>({
  cliente,
  adaptador:new S3CompatibleStorageAdapter({proveedor,bucket:BUCKET,region:proveedor==='R2'?'auto':'us-east-1',endpoint:proveedor==='R2'?`https://${'c'.repeat(32)}.r2.cloudflarestorage.com`:undefined,forcePathStyle:false,credenciales:proveedor==='R2'?{accessKeyId:'SOLO_TEST',secretAccessKey:'SOLO_TEST'}:undefined,expiracionFirmaSegundos:300,timeoutMs,maxIntentos:1,s3VersionadoHabilitado:false,s3ObjectLockHabilitado:false,s3KmsHabilitado:false},{cliente})
});
const entrada=(ref,contenido,clave='idem')=>({referencia:ref,contenido,mime:'application/octet-stream',tamanoEsperado:3n,claveIdempotencia:clave});

test('Bloque 4.5B.2A.1 — storage condicional observable',async t=>{
  await t.test('01 crea un objeto inexistente y verifica HEAD posterior',async()=>{const {adaptador,cliente}=adaptar();const r=referencia();const x=await adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['abc'])));assert.equal(x.tamanoBytes,3n);assert.deepEqual(cliente.llamadas.map(x=>x.nombre),['PutObjectCommand','HeadObjectCommand']);});
  await t.test('02 rechaza un objeto preexistente sin modificarlo',async()=>{const {adaptador,cliente}=adaptar();const r=referencia();cliente.sembrar(r,'viejo');await assert.rejects(adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['abc']))),e=>e.codigo==='OBJETO_EXISTENTE');assert.equal(cliente.objetos.get(`${BUCKET}:${r.clave}`).bytes.toString(),'viejo');});
  await t.test('03 dos escrituras simultáneas tienen un único ganador',async()=>{const {adaptador,cliente}=adaptar();const r=referencia();const resultados=await Promise.allSettled([adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['abc']),'a')),adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['xyz']),'b'))]);assert.equal(resultados.filter(x=>x.status==='fulfilled').length,1);assert.equal(resultados.filter(x=>x.status==='rejected'&&x.reason.codigo==='OBJETO_EXISTENTE').length,1);assert.equal(cliente.objetos.size,1);});
  await t.test('04 reintento con mismo contenido no reescribe',async()=>{const {adaptador,cliente}=adaptar();const r=referencia();await adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['abc'])));const etag=cliente.objetos.get(`${BUCKET}:${r.clave}`).etag;await assert.rejects(adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['abc']))),e=>e.codigo==='OBJETO_EXISTENTE');assert.equal(cliente.objetos.get(`${BUCKET}:${r.clave}`).etag,etag);});
  await t.test('05 reintento con contenido diferente preserva el original',async()=>{const {adaptador,cliente}=adaptar();const r=referencia();await adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['abc'])));await assert.rejects(adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['xyz']))));assert.equal(cliente.objetos.get(`${BUCKET}:${r.clave}`).bytes.toString(),'abc');});
  await t.test('06 R2 y S3 anuncian PUT exclusivo pero no multipart condicional',()=>{for(const p of ['R2','S3']){const a=adaptar(p).adaptador;assert.equal(a.capacidades.escrituraCondicionalDestino,true);assert.equal(a.capacidades.lecturaCondicionalOrigen,true);assert.equal(a.capacidades.multipartCondicionalDestino,false);}});
  await t.test('07 una lectura condicionada rechaza origen modificado',async()=>{const {adaptador,cliente}=adaptar();const r=referencia('tmp');cliente.sembrar(r,'abc');const token=(await adaptador.consultarObjeto(r)).etag;cliente.sembrar(r,'xyz');await assert.rejects(adaptador.abrirLecturaCondicionada({referencia:r,etag:token}),e=>e.codigo==='CONFLICTO');});
  await t.test('08 doble lectura obtiene streams independientes',async()=>{const {adaptador,cliente}=adaptar();const r=referencia();cliente.sembrar(r,'abc');const token=(await adaptador.consultarObjeto(r)).etag;const leer=async()=>{let s='';for await(const p of await adaptador.abrirLecturaCondicionada({referencia:r,etag:token}))s+=p.toString();return s;};assert.deepEqual(await Promise.all([leer(),leer()]),['abc','abc']);});
  await t.test('09 stream fragmentado mediano conserva todos los bytes',async()=>{const {adaptador}=adaptar();const r=referencia();const fragmentos=Array.from({length:512},()=>Buffer.alloc(2048,7));const x=await adaptador.crearObjetoExclusivo({...entrada(r,Readable.from(fragmentos),'medio'),tamanoEsperado:1048576n});assert.equal(x.tamanoBytes,1048576n);});
  await t.test('10 stream grande simulado aplica backpressure sin Base64',async()=>{const {adaptador}=adaptar();const r=referencia();let producidos=0;async function* fuente(){for(let i=0;i<1024;i++){producidos++;yield Buffer.alloc(4096,i%255);}}const x=await adaptador.crearObjetoExclusivo({...entrada(r,Readable.from(fuente()),'grande'),tamanoEsperado:4194304n});assert.equal(x.tamanoBytes,4194304n);assert.equal(producidos,1024);});
  await t.test('11 stream interrumpido falla cerrado y no conserva objeto',async()=>{const {adaptador,cliente}=adaptar();const r=referencia();const s=new Readable({read(){this.push(Buffer.from('a'));this.destroy(new Error('privado'));}});await assert.rejects(adaptador.crearObjetoExclusivo({...entrada(r,s),tamanoEsperado:3n}),e=>e.codigo==='DESCONOCIDO');assert.equal(cliente.objetos.has(`${BUCKET}:${r.clave}`),false);});
  await t.test('12 escritura incompleta no queda confirmada',async()=>{const {adaptador,cliente}=adaptar();const r=referencia();await assert.rejects(adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['ab']))),e=>e.codigo==='INTEGRIDAD');assert.equal(cliente.objetos.has(`${BUCKET}:${r.clave}`),false);});
  await t.test('13 cancelación por timeout es temporal y reintentable',async()=>{const cliente={send:(_c,{abortSignal})=>new Promise((_ok,fail)=>abortSignal.addEventListener('abort',()=>fail(Object.assign(new Error(),{name:'AbortError'}))))};const {adaptador}=adaptar('R2',cliente,15);await assert.rejects(adaptador.crearObjetoExclusivo(entrada(referencia(),Readable.from(['abc']))),e=>e.codigo==='TEMPORAL'&&e.reintentable);});
  await t.test('14 caída posterior a persistir converge sin sobrescribir',async()=>{const {adaptador,cliente}=adaptar();const r=referencia();cliente.despuesDePersistir=async()=>{throw errorHttp(503,'ServiceUnavailable');};await assert.rejects(adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['abc']))),e=>e.codigo==='TEMPORAL');await assert.rejects(adaptador.crearObjetoExclusivo(entrada(r,Readable.from(['abc']))),e=>e.codigo==='OBJETO_EXISTENTE');const meta=await adaptador.consultarObjeto(r);assert.equal(meta.metadatosProveedor['idempotencia-documental'],'idem');});
  await t.test('15 límite superior de PUT simple se bloquea antes del SDK',async()=>{const {adaptador,cliente}=adaptar();await assert.rejects(adaptador.crearObjetoExclusivo({...entrada(referencia(),Readable.from([])),tamanoEsperado:5_000_000_001n}),e=>e.codigo==='LIMITE');assert.equal(cliente.llamadas.length,0);});
});

test('asociación comercial fallida deja recuperación idempotente preparada',async()=>{
  const eventos=[];let intentos=0;
  const confirmacion={versionId:9n,estado:'DISPONIBLE',integridad:{valido:true},antivirus:{estado:'LIMPIO'},idempotente:true};
  const coordinador=new CoordinadorDocumentosProducto({exigir:async()=>{}},{confirmar:async()=>confirmacion},{
    asociarProducto:async()=>{intentos++;if(intentos===1)throw Object.assign(new Error('DB temporal'),{codigo:'DB_TEMPORAL'});return{id:4n};},
    registrarEvento:async e=>{eventos.push(e);return{id:1n};},
  });
  const solicitud={idProducto:3,idDocumento:2n,idIntencion:randomUUID(),clasificacion:'COMERCIAL',asociacion:{tipoDocumento:'FICHA_TECNICA'},actor:{id:7n,sesion:'s',permisos:['CU366'],administrador:false}};
  await assert.rejects(coordinador.confirmarYAsociar(solicitud),e=>e.codigo==='DB_TEMPORAL');
  assert.equal(eventos.length,1);assert.equal(eventos[0].tipoEvento,'ASOCIACION_PRODUCTO_PENDIENTE');assert.equal(eventos[0].idVersion,9n);
  const recuperada=await coordinador.confirmarYAsociar(solicitud);assert.equal(recuperada.asociacion.id,4n);assert.equal(intentos,2);
});
