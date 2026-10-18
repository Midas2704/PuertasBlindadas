const test = require('node:test');
const assert = require('node:assert/strict');
const { ServicioDocumentosProducto } = require('../dist/documental/productos/ServicioDocumentosProducto');
const { AutorizadorDocumental } = require('../dist/documental/seguridad/AutorizacionDocumental');
const { MATRIZ_CAPACIDADES_DOCUMENTALES } = require('../dist/documental/seguridad/MatrizCapacidadesDocumentales');

const actor = permisos => ({ id:1n, sesion:'sesion-c2-local', permisos, administrador:false });
const fecha = new Date('2026-10-15T12:00:00.000Z');

const version = (id, numero = 1, estado = 'DISPONIBLE') => ({
  id_version_documento:BigInt(id), numero_version:numero, estado, creado_en:fecha,
  validado_en:fecha, nombre_seguro:`archivo-${id}.jpg`, mime_detectado:'image/jpeg',
  tamano_bytes:1234n, creador:{ usuario_username:'autor.controlado' }, variantes_origen:[],
});

const asociacion = ({id, titulo, b2b=false, b2c=false, principal=false, tipo='FOTOGRAFIA_COMERCIAL', estado='DISPONIBLE'}) => ({
  id_producto_comercial_documento:BigInt(100 + id), tipo_documento:tipo,
  orden_presentacion:id, es_imagen_principal:principal, habilitado_b2b:b2b,
  habilitado_b2c:b2c, asociado_en:fecha,
  documento:{ id_documento_logico:BigInt(id), titulo, clasificacion:'COMERCIAL',
    numero_version_actual:1, actualizado_en:fecha, versiones:[version(id, 1, estado)] },
});

const producto = (estado = 'VINCULADO') => ({ estado, documentos:[
  asociacion({id:1,titulo:'Foto empresas',b2b:true,principal:true}),
  asociacion({id:2,titulo:'Foto particulares',b2c:true,principal:true}),
  asociacion({id:3,titulo:'Ficha transversal',b2b:true,b2c:true,tipo:'FICHA_TECNICA'}),
  asociacion({id:4,titulo:'Uso interno no habilitado'}),
] });

const servicio = (estado = 'VINCULADO', verificarAlcance = async () => true) => new ServicioDocumentosProducto(
  { consultarDocumentosProducto: async (_id, conHistorial) => {
      const salida = structuredClone(producto(estado));
      if (!conHistorial) salida.documentos.forEach(item => { item.documento.versiones = item.documento.versiones.slice(0, 1); });
      return salida;
    } },
  new AutorizadorDocumental(verificarAlcance),
);

test('C2 — catálogo documental comercial seguro y segmentado', async t => {
  await t.test('B2B recibe sólo documentos autorizados para empresas', async () => {
    const salida = await servicio().listarParaSegmento(7, 'B2B', actor(['CU360','CU367']));
    assert.deepEqual(salida.documentos.map(item => item.titulo), ['Foto empresas','Ficha transversal']);
    assert.equal(salida.fotografiaPrincipal.titulo, 'Foto empresas');
  });

  await t.test('B2C recibe sólo documentos autorizados para particulares', async () => {
    const salida = await servicio().listarParaSegmento(7, 'B2C', actor(['CU360','CU367']));
    assert.deepEqual(salida.documentos.map(item => item.titulo), ['Foto particulares','Ficha transversal']);
    assert.equal(salida.fotografiaPrincipal.titulo, 'Foto particulares');
  });

  await t.test('un documento sin habilitación comercial no cruza segmentos', async () => {
    for (const segmento of ['B2B','B2C']) {
      const salida = await servicio().listarParaSegmento(7, segmento, actor(['CU360','CU367']));
      assert.equal(salida.documentos.some(item => item.titulo === 'Uso interno no habilitado'), false);
    }
  });

  await t.test('metadatos no exponen storage, secretos, hash ni URL', async () => {
    const json = JSON.stringify(await servicio().listarParaSegmento(7, 'B2B', actor(['CU360','CU367'])));
    assert.doesNotMatch(json, /clave_objeto|contenedor_logico|proveedor_logico|sha256|secret|token|https?:\/\//i);
  });

  await t.test('CU360 permite metadatos pero no historial de responsables', async () => {
    const salida = await servicio().listarParaSegmento(7, 'B2C', actor(['CU360']));
    assert.equal(salida.capacidades.consultarMetadatos, true);
    assert.equal(salida.capacidades.consultarVersiones, false);
    assert.equal(salida.documentos[0].versiones[0].responsableVisible, null);
  });

  await t.test('sin CU360 la consulta comercial falla cerrada', async () => {
    await assert.rejects(servicio().listarParaSegmento(7, 'B2B', actor([])), error => error.codigo === 'ACCESO_DOCUMENTAL_DENEGADO');
  });

  await t.test('producto inactivo no expone su documentación', async () => {
    await assert.rejects(servicio('INACTIVO').listarParaSegmento(7, 'B2C', actor(['CU360'])), error => error.codigo === 'PRODUCTO_NO_DISPONIBLE');
  });

  await t.test('vista previa y descarga quedan cerradas sin infraestructura aunque el CU exista', async () => {
    const capacidades = await servicio().consultarCapacidades(7, actor(['CU360','CU367']));
    assert.equal(capacidades.solicitarVistaPrevia, false);
    assert.equal(capacidades.descargar, false);
    assert.deepEqual(capacidades.diagnosticoActivacion,{permisoGestion:'APROBADO_C2_6',politicaComercial:'NO_CONFIGURADA',storage:'NO_CONFIGURADO',antivirus:'NO_CONFIGURADO'});
    for (const accion of ['SOLICITAR_VISTA_PREVIA','DESCARGAR']) {
      const definicion = MATRIZ_CAPACIDADES_DOCUMENTALES.find(item => item.accion === accion);
      assert.equal(definicion.tipoAcceso, 'CONSULTA');
      assert.ok(['APROBADO_C2_6','PENDIENTE_APROBACION'].includes(definicion.estadoAprobacion));
      assert.equal(definicion.cuExistente, accion === 'SOLICITAR_VISTA_PREVIA' ? 'CU375' : 'CU376');
    }
  });

  await t.test('el alcance de entidad se valida en backend', async () => {
    await assert.rejects(servicio('VINCULADO', async (_actor, contexto) => contexto.idProducto === 8).listarParaSegmento(7, 'B2B', actor(['CU360'])), error => error.codigo === 'ALCANCE_DOCUMENTAL_DENEGADO');
  });
  await t.test('endpoint binario autorizado informa infraestructura faltante sin simular éxito', async()=>{
    await assert.rejects(servicio().exigirOperacionBinaria(7,'DESCARGAR',actor(['CU376'])),error=>error.codigo==='INFRAESTRUCTURA_DOCUMENTAL_NO_DISPONIBLE'&&error.estadoHttp===503);
  });
});
