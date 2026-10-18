const test = require('node:test');
const assert = require('node:assert/strict');
const { Readable } = require('node:stream');
const { createHash } = require('node:crypto');
const { S3Client, CreateBucketCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { S3CompatibleStorageAdapter } = require('../dist/documental/adaptadores/S3CompatibleStorageAdapter.js');
const { ClamAvDaemonAdapter } = require('../dist/documental/seguridad/AntivirusAdapter.js');

const habilitado = process.env.C42_REAL_SEAWEEDFS === '1';
test('SeaweedFS real guarda, consulta y recupera PDF con integridad y autenticación', { skip: !habilitado }, async () => {
  const endpoint = 'http://127.0.0.1:58333';
  const credenciales = { accessKeyId:'c42_local_access', secretAccessKey:'c42_local_secret_only' };
  const cliente = new S3Client({ endpoint, region:'us-east-1', forcePathStyle:true, credentials:credenciales });
  const bucket='c42-documentos-privados';
  try { await cliente.send(new CreateBucketCommand({ Bucket:bucket })); } catch (e) { if (e.name !== 'BucketAlreadyOwnedByYou' && e.name !== 'BucketAlreadyExists') throw e; }
  const adapter = new S3CompatibleStorageAdapter({ proveedor:'S3', bucket, region:'us-east-1', endpoint, forcePathStyle:true, credenciales, expiracionFirmaSegundos:120, timeoutMs:5000, maxIntentos:2, s3VersionadoHabilitado:false, s3ObjectLockHabilitado:false, s3KmsHabilitado:false });
  const contenido=Buffer.from('%PDF-1.4\n% C4.2 synthetic private PDF\n%%EOF\n');
  const sha=createHash('sha256').update(contenido).digest('hex');
  const referencia={contenedor:bucket,clave:'objects/00000000-0000-4000-8000-000000000042'};
  const antivirus=new ClamAvDaemonAdapter({host:'127.0.0.1',puerto:3310,timeoutMs:30000,maximoBytes:20971520n});
  const analisis=await antivirus.escanear(Readable.from(contenido));
  assert.equal(analisis.estado,'LIMPIO');
  await adapter.subirStream({referencia,contenido:Readable.from(contenido),mime:'application/pdf',tamanoEsperado:BigInt(contenido.length),sha256:sha});
  const head=await adapter.consultarObjeto(referencia); assert.equal(head.tamanoBytes,BigInt(contenido.length)); assert.equal(head.mime,'application/pdf');
  const partes=[]; for await(const parte of await adapter.abrirLectura(referencia)) partes.push(parte); const recuperado=Buffer.concat(partes);
  assert.equal(createHash('sha256').update(recuperado).digest('hex'),sha);
  const malo=new S3Client({endpoint,region:'us-east-1',forcePathStyle:true,credentials:{accessKeyId:'no-autorizado',secretAccessKey:'no-autorizado'}});
  await assert.rejects(()=>malo.send(new GetObjectCommand({Bucket:bucket,Key:referencia.clave})), /AccessDenied|InvalidAccessKey|403/);
});
