const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');

const { prisma } = require('../dist/db');
const { ServicioEscrituraComercial } = require('../dist/comercial/ServicioEscrituraComercial');
const { ServicioCatalogoComercial } = require('../dist/comercial/ServicioCatalogoComercial');
const { ProductorAuditoriaM9 } = require('../dist/m9/contratoProductor');
const { M9Controller } = require('../dist/controladores/M9Controller');

const integracionAisladaHabilitada = process.env.C2_7_PG18_AISLADO === '1';
const escritura = new ServicioEscrituraComercial();
const catalogo = new ServicioCatalogoComercial();
const actor = { id: 910001n, sesion: 'c2.7-pg18', permisos: ['CU368','CU369','CU370','CU371','CU372'], administrador: false };
const entrada = (extra = {}) => ({ motivo: 'Validacion aislada C2.7', claveIdempotencia: `c27-${randomUUID()}`, ...extra });

test.before(async () => {
  if (!integracionAisladaHabilitada) return;
  const opcionales = await prisma.opcional_comercial.findMany({ where:{ codigo:{ startsWith:'OP-' } }, select:{ id_opcional_comercial:true } });
  const idsOpcionales = opcionales.map(x => x.id_opcional_comercial);
  if (idsOpcionales.length) {
    await prisma.precio_opcional_comercial.deleteMany({ where:{ id_opcional_comercial:{ in:idsOpcionales } } });
    await prisma.compatibilidad_opcional_producto.deleteMany({ where:{ id_opcional_comercial:{ in:idsOpcionales } } });
    await prisma.opcional_comercial.deleteMany({ where:{ id_opcional_comercial:{ in:idsOpcionales } } });
  }
  // Las condiciones publicadas son deliberadamente inmutables; cada corrida usa un código nuevo.
  await prisma.tarifa_instalacion_comercial.deleteMany({ where:{ region:'Region C27' } });
  await prisma.precio_producto_comercial.deleteMany({ where:{ id_extension_producto_comercial:910001 } });
  await prisma.idempotencia_operacion_comercial.deleteMany({ where:{ actor_id:910001n } });
  // M9 es inmutable; la aserción toma el evento más reciente de esta corrida.
});

test('C2.7 integra escrituras comerciales, M4, M9 e idempotencia en PostgreSQL 18 aislado', {
  skip: !integracionAisladaHabilitada,
}, async t => {
  let precioInicial;
  await t.test('M4 rechaza escritura sin CU368 aunque el actor sea administrador', async () => {
    await assert.rejects(
      escritura.ejecutar('CREAR_PRECIO', entrada({ idProducto:910001, segmento:'B2B', idMoneda:910001, monto:100000, vigenciaDesde:'2030-01-01' }), { ...actor, permisos:[], administrador:true }),
      error => error.codigo === 'ACCESO_COMERCIAL_DENEGADO',
    );
  });

  await t.test('crea precio una sola vez y M9 registra actor, motivo y versión', async () => {
    const claveIdempotencia = `c27-${randomUUID()}`;
    const solicitud = { idSolicitud:`req-${randomUUID()}`, cuerpo:{ motivo:'Alta de precio C2.7' } };
    const productor = new ProductorAuditoriaM9(new M9Controller());
    precioInicial = await productor.ejecutar('crearPrecioComercial', actor, solicitud, () => escritura.ejecutar('CREAR_PRECIO', {
      idProducto:910001, segmento:'B2B', idMoneda:910001, monto:120000, vigenciaDesde:'2031-01-01', motivo:'Alta de precio C2.7', claveIdempotencia,
    }, actor));
    const repetida = await escritura.ejecutar('CREAR_PRECIO', { idProducto:910001, segmento:'B2B', idMoneda:910001, monto:120000, vigenciaDesde:'2031-01-01', motivo:'Alta de precio C2.7', claveIdempotencia }, actor);
    assert.equal(repetida.id, precioInicial.id);
    const filas = await prisma.precio_producto_comercial.findMany({ where:{ id_extension_producto_comercial:910001, segmento_comercial:'B2B' } });
    assert.equal(filas.length, 1);
    const eventos = await prisma.$queryRawUnsafe('SELECT operacion, ejecutor_referencia, motivo, valores_nuevos FROM finanzas.evento_auditoria_m9 WHERE operacion = $1 ORDER BY id_evento_m9 DESC LIMIT 1', 'PRECIO_COMERCIAL_CREADO');
    assert.equal(eventos.length, 1);
    assert.equal(eventos[0].ejecutor_referencia, '910001');
    assert.equal(eventos[0].motivo, 'Alta de precio C2.7');
    assert.equal(Number(eventos[0].valores_nuevos.revision), 1);
  });

  await t.test('versiona el precio conservando la fila anterior inactiva', async () => {
    const nuevo = await escritura.ejecutar('VERSIONAR_PRECIO', entrada({ idAnterior:precioInicial.id, idProducto:910001, segmento:'B2B', idMoneda:910001, monto:135000, vigenciaDesde:'2032-01-01' }), actor);
    const filas = await prisma.precio_producto_comercial.findMany({ where:{ id_extension_producto_comercial:910001, segmento_comercial:'B2B' }, orderBy:{ creado_en:'asc' } });
    assert.equal(filas.length, 2);
    assert.equal(filas[0].estado, 'INACTIVO');
    assert.equal(filas[1].estado, 'ACTIVO');
    assert.equal(nuevo.version, 2);
    await escritura.ejecutar('DESACTIVAR_PRECIO', entrada({ id:nuevo.id, revision:nuevo.version }), actor);
    const desactivado = await prisma.precio_producto_comercial.findUnique({ where:{ id_precio_producto_comercial:BigInt(nuevo.id) } });
    assert.equal(desactivado.estado, 'INACTIVO');
  });

  await t.test('dos solicitudes concurrentes no crean precios vigentes duplicados', async () => {
    const resultados = await Promise.allSettled([
      escritura.ejecutar('CREAR_PRECIO', entrada({ idProducto:910001, segmento:'B2C', idMoneda:910001, monto:110000, vigenciaDesde:'2033-01-01' }), actor),
      escritura.ejecutar('CREAR_PRECIO', entrada({ idProducto:910001, segmento:'B2C', idMoneda:910001, monto:115000, vigenciaDesde:'2033-01-01' }), actor),
    ]);
    assert.equal(resultados.filter(r => r.status === 'fulfilled').length, 1);
    assert.equal(await prisma.precio_producto_comercial.count({ where:{ id_extension_producto_comercial:910001, segmento_comercial:'B2C', estado:'ACTIVO' } }), 1);
  });

  await t.test('opcional conserva compatibilidad y versiones de precio', async () => {
    const opcional = await escritura.ejecutar('CREAR_OPCIONAL', entrada({ codigo:`OP-${Date.now()}`, nombre:'Cerradura aislada', descripcionB2b:'B2B', descripcionB2c:'B2C' }), actor);
    await escritura.ejecutar('MODIFICAR_COMPATIBILIDAD', entrada({ idOpcional:opcional.id, idProducto:910001, habilitadoB2b:true, habilitadoB2c:false, condiciones:'Solo B2B' }), actor);
    await assert.rejects(
      escritura.ejecutar('MODIFICAR_COMPATIBILIDAD', entrada({ idOpcional:opcional.id, idProducto:999999, habilitadoB2b:true, habilitadoB2c:false }), actor),
    );
    await escritura.ejecutar('VERSIONAR_PRECIO_OPCIONAL', entrada({ idOpcional:opcional.id, segmento:'B2B', idMoneda:910001, monto:25000, vigenciaDesde:'2031-01-01' }), actor);
    await escritura.ejecutar('VERSIONAR_PRECIO_OPCIONAL', entrada({ idOpcional:opcional.id, segmento:'B2B', idMoneda:910001, monto:28000, vigenciaDesde:'2032-01-01' }), actor);
    const fila = (await catalogo.listarOpcionales({ producto:910001, segmento:'B2B', fecha:'2032-06-01' })).find(x => x.id === opcional.id);
    assert.equal(fila.compatibilidades[0].b2b, true);
    assert.equal(fila.precios.length, 2);
    assert.deepEqual(fila.precios.map(p => p.estado).sort(), ['ACTIVO','INACTIVO']);
  });

  await t.test('versiona, resuelve y desactiva tarifa sin perder la exclusión comunal', async () => {
    const inicial = await escritura.ejecutar('CREAR_TARIFA', entrada({ alcance:'REGION', region:'Region C27', cobertura:'DISPONIBLE', idMoneda:910001, precio:90000, vigenciaDesde:'2031-01-01' }), actor);
    const versionada = await escritura.ejecutar('VERSIONAR_TARIFA', entrada({ idAnterior:inicial.id, alcance:'REGION', region:'Region C27', cobertura:'DISPONIBLE', idMoneda:910001, precio:95000, vigenciaDesde:'2032-01-01' }), actor);
    await escritura.ejecutar('REGISTRAR_EXCLUSION_COMUNAL', entrada({ alcance:'COMUNA', region:'Region C27', comuna:'Comuna excluida', cobertura:'NO_DISPONIBLE', vigenciaDesde:'2031-01-01' }), actor);
    assert.equal((await catalogo.resolverCobertura({ region:'Region C27', comuna:'Comuna excluida', fecha:'2032-06-01' })).estado, 'NO_DISPONIBLE');
    assert.equal((await catalogo.resolverCobertura({ region:'Region C27', comuna:'Otra comuna', fecha:'2032-06-01' })).estado, 'VIGENTE');
    await escritura.ejecutar('DESACTIVAR_TARIFA', entrada({ id:versionada.id, revision:versionada.version }), actor);
    const desactivada = await prisma.tarifa_instalacion_comercial.findUnique({ where:{ id_tarifa_instalacion_comercial:BigInt(versionada.id) } });
    assert.equal(desactivada.estado, 'INACTIVA');
  });

  await t.test('condición pasa de borrador a publicada con CU372', async () => {
    const condicion = await escritura.ejecutar('CREAR_CONDICION', entrada({ codigo:`COND-${Date.now()}`, nombre:'Condicion aislada', segmento:'B2B' }), actor);
    const version = await escritura.ejecutar('VERSIONAR_CONDICION', entrada({ idCondicion:condicion.id, contenido:{ texto:'Pago contra entrega' }, vigenciaDesde:'2031-01-01' }), actor);
    await assert.rejects(
      escritura.ejecutar('PUBLICAR_CONDICION', entrada({ idVersion:version.id }), { ...actor, permisos:actor.permisos.filter(p => p !== 'CU372') }),
      error => error.codigo === 'ACCESO_COMERCIAL_DENEGADO',
    );
    await escritura.ejecutar('PUBLICAR_CONDICION', entrada({ idVersion:version.id }), actor);
    const guardada = await prisma.condicion_comercial_version.findUnique({ where:{ id_condicion_comercial_version:BigInt(version.id) } });
    assert.equal(guardada.estado, 'PUBLICADA');
    await assert.rejects(escritura.ejecutar('PUBLICAR_CONDICION', entrada({ idVersion:version.id }), actor), /Sólo se puede publicar un borrador/);
  });
});

test.after(async () => { await prisma.$disconnect(); });
