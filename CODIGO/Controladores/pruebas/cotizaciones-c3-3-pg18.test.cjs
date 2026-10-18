const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { prisma } = require('../dist/db');
const { M2Controller } = require('../dist/controladores/M2Controller');
const { ServicioEscrituraComercial } = require('../dist/comercial/ServicioEscrituraComercial');

const habilitada = process.env.C3_3_PG18_AISLADO === '1';
const actor = 910001n;
let moneda, material, precioB2B, precioB2C;

async function precioProducto(segmento) {
  const existente = await prisma.precio_producto_comercial.findFirst({
    where: { id_extension_producto_comercial: 910001, segmento_comercial: segmento, id_moneda: moneda.id_moneda, estado: 'ACTIVO', vigencia_desde: { lte: new Date() }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: new Date() } }] },
    orderBy: { vigencia_desde: 'desc' },
  });
  if (existente) return existente;
  return prisma.precio_producto_comercial.create({ data: { id_extension_producto_comercial: 910001, segmento_comercial: segmento, id_moneda: moneda.id_moneda, monto: segmento === 'B2B' ? 300000 : 250000, vigencia_desde: new Date('2020-01-01T00:00:00Z'), vigencia_hasta: new Date('2032-12-31T00:00:00Z'), estado: 'ACTIVO', motivo: `Fixture C3.3 aislado ${segmento}`, creado_por: actor } });
}

function producto(precio) {
  return { tipo_producto: 'Puerta sintética', id_item_comercial: 910001, id_producto_comercial: 910001, id_producto_comercial_version: 910001, id_precio_producto_comercial: precio.id_precio_producto_comercial.toString(), cantidad: 1, medidas: '200x90x5', observaciones: 'Fixture C3.3', opcionales: [], materiales: [{ id_historial_precio_material: material.id_historial_precio_material, cantidad: 2 }] };
}

function base(segmento, precio, ficha) {
  return { segmento_comercial: segmento, id_ficha_cliente: ficha, fecha_vigencia: '2026-12-31', margen_esperado: 30, id_moneda: moneda.id_moneda, exento_iva: false, descuento_valor: 0, requiere_instalacion: 'NO', permitir_borrador_incompleto: false, productos: [producto(precio)] };
}

test.before(async () => {
  if (!habilitada) return;
  moneda = await prisma.moneda.findUniqueOrThrow({ where: { codigo_moneda: 'CLP' } });
  material = await prisma.historial_precio_material.findFirstOrThrow({ where: { material_sku: 'C31-MAT', id_moneda: moneda.id_moneda, estado_precio: 'vigente' } });
  precioB2B = await precioProducto('B2B');
  precioB2C = await precioProducto('B2C');
});

test('C3.3 persiste contactos B2B propios y servicios sin alterar cliente ni crear OT', { skip: !habilitada }, async () => {
  const marca = randomUUID().slice(0, 8).toUpperCase();
  const clienteAntes = await prisma.cliente_financiero.findUniqueOrThrow({ where: { id_cliente_financiero: 910001 } });
  const escritura = new ServicioEscrituraComercial();
  await assert.rejects(() => escritura.ejecutar('CREAR_SERVICIO', { codigo: `DEN-${marca}`, nombre: 'Denegado', unidadCobro: 'GLOBAL', habilitadoB2b: true, habilitadoB2c: false, segmento: 'B2B', idMoneda: moneda.id_moneda, monto: 50000, vigenciaDesde: '2026-01-01', vigenciaHasta: '2027-12-31', motivo: 'Debe ser denegado', claveIdempotencia: `c33-den-${randomUUID()}` }, { id: actor, sesion: 'aislada', permisos: [], administrador: true }), error => error.estado === 403);
  const creadoServicio = await escritura.ejecutar('CREAR_SERVICIO', { codigo: `C33-${marca}`, nombre: 'Flete sintético C3.3', descripcion: 'Sólo prueba aislada', unidadCobro: 'GLOBAL', habilitadoB2b: true, habilitadoB2c: false, segmento: 'B2B', idMoneda: moneda.id_moneda, monto: 50000, vigenciaDesde: '2026-01-01', vigenciaHasta: '2027-12-31', motivo: 'Fixture aislado C3.3', claveIdempotencia: `c33-serv-${randomUUID()}` }, { id: actor, sesion: 'aislada', permisos: ['CU368'], administrador: false });
  const servicio = await prisma.servicio_comercial.findUniqueOrThrow({ where: { id_servicio_comercial: BigInt(creadoServicio.id) } });
  const precioServicio = await prisma.precio_servicio_comercial.findUniqueOrThrow({ where: { id_precio_servicio_comercial: BigInt(creadoServicio.idPrecio) } });
  const entrada = { ...base('B2B', precioB2B, 910001), contactos_b2b: [
    { nombre: 'Contacto', apellido: 'Principal', correo: `principal.${marca.toLowerCase()}@example.test`, telefono: '+56000000001', tipo_contacto: 'COMERCIAL', es_principal: true },
    { nombre: 'Contacto', apellido: 'Obra', correo: `obra.${marca.toLowerCase()}@example.test`, telefono: '+56000000002', tipo_contacto: 'OBRA', es_principal: false },
  ], servicios: [{ id_servicio_comercial: servicio.id_servicio_comercial.toString(), id_precio_servicio_comercial: precioServicio.id_precio_servicio_comercial.toString(), tipo_linea_comercial: 'FLETE', cantidad: 2, descripcion: 'Flete contratado' }] };
  const creada = await new M2Controller().guardarCotizacion(entrada, actor);
  assert.equal(creada.contactos_b2b.length, 2);
  assert.equal(creada.contactos_b2b.filter(c => c.es_principal).length, 1);
  assert.equal(creada.detalles_servicio.length, 1);
  assert.equal(creada.detalles_servicio[0].subtotal.toString(), '100000');
  assert.equal(creada.detalle_cotizacion.length, 1);
  assert.equal(await prisma.unidad_fisica_orden_trabajo.count({ where: { id_cotizacion: creada.id_cotizacion } }), 0);
  const clienteDespues = await prisma.cliente_financiero.findUniqueOrThrow({ where: { id_cliente_financiero: 910001 } });
  assert.equal(clienteDespues.contacto_financiero, clienteAntes.contacto_financiero);
  assert.equal(clienteDespues.correo_financiero, clienteAntes.correo_financiero);
  await assert.rejects(() => new M2Controller().editarCotizacion(creada.id_cotizacion, { ...entrada, revision: creada.revision, contactos_b2b: [{ nombre: 'Sin principal', correo: 'valido@example.test', es_principal: false }] }, actor), error => error.estado === 400);
});

test('C3.3 selecciona con trazabilidad y bloquea aceptación sin documento C4', { skip: !habilitada }, async () => {
  const entrada = { ...base('B2C', precioB2C, 910002), alternativas_b2c: [{ id_producto_comercial: 910001, id_producto_comercial_version: 910001, id_precio_producto_comercial: precioB2C.id_precio_producto_comercial.toString(), cantidad: 1, configuracion: { alto: 200, ancho: 90 }, opcionales: [] }] };
  const m2 = new M2Controller();
  const creada = await m2.guardarCotizacion(entrada, actor);
  const grupo = creada.grupos_alternativas_b2c[0];
  const alternativa = grupo.alternativas[0];
  const seleccion = await m2.seleccionarAlternativaB2C(creada.id_cotizacion, { idAlternativa: alternativa.id_alternativa_b2c.toString(), revision: grupo.revision, motivo: 'Selección controlada C3.3' }, actor);
  assert.equal(seleccion.id_alternativa_seleccionada, alternativa.id_alternativa_b2c);
  assert.equal(await prisma.historial_seleccion_alternativa_b2c.count({ where: { id_grupo_alternativas_b2c: grupo.id_grupo_alternativas_b2c } }), 1);
  await assert.rejects(() => m2.aceptarAlternativaB2C(creada.id_cotizacion, { revisionGrupo: seleccion.revision, claveIdempotencia: `c33-sin-pdf-${randomUUID()}`, motivo: 'Intento sin documento C4' }, actor), /debe estar emitida|PDF documental confirmado/);
  assert.equal((await prisma.alternativa_b2c.findUniqueOrThrow({ where: { id_alternativa_b2c: alternativa.id_alternativa_b2c } })).estado, 'PROPUESTA');
});

test('C3.3 acepta atómica e idempotentemente sólo la alternativa contratada en fixture documental aislado', { skip: !habilitada }, async () => {
  const entrada = { ...base('B2C', precioB2C, 910002), alternativas_b2c: [{ id_producto_comercial: 910001, id_producto_comercial_version: 910001, id_precio_producto_comercial: precioB2C.id_precio_producto_comercial.toString(), cantidad: 1, configuracion: { alto: 200, ancho: 90 }, opcionales: [] }] };
  const m2 = new M2Controller();
  const creada = await m2.guardarCotizacion(entrada, actor);
  const grupo = creada.grupos_alternativas_b2c[0];
  const alternativa = grupo.alternativas[0];
  const seleccion = await m2.seleccionarAlternativaB2C(creada.id_cotizacion, { idAlternativa: alternativa.id_alternativa_b2c.toString(), revision: grupo.revision, motivo: 'Selección para aceptación sintética' }, actor);
  const documento = await prisma.documento_logico.create({ data: { titulo: `PDF sintético C3.3 ${randomUUID()}`, clasificacion: 'COMERCIAL', creado_por: actor } });
  const objeto = randomUUID();
  await prisma.version_documento.create({ data: { id_documento_logico: documento.id_documento_logico, numero_version: 1, proveedor_logico: 'R2', contenedor_logico: 'fixture-c33', clave_objeto: `objects/${objeto}`, nombre_original: 'cotizacion-fixture.pdf', nombre_seguro: `${objeto}.pdf`, mime_declarado: 'application/pdf', mime_detectado: 'application/pdf', tamano_bytes: 128n, sha256: 'a'.repeat(64), estado: 'DISPONIBLE', creado_por: actor, validado_en: new Date(), resultado_validaciones: { fixture: true, antivirus: { estado: 'LIMPIO' } } } });
  await prisma.documento_logico.update({ where: { id_documento_logico: documento.id_documento_logico }, data: { numero_version_actual: 1 } });
  await prisma.cotizacion_version.create({ data: { id_cotizacion: creada.id_cotizacion, antecedentes: { fixture: 'C3.3_PG18_AISLADO', archivoReal: false }, motivo: 'Documento confirmado sintético sólo para prueba aislada', numero_version_comercial: 1, tipo_version: 'EMISION', snapshot_comercial: { fixture: true }, id_documento_logico: documento.id_documento_logico, estado_documental: 'DISPONIBLE', usuario_id_usuario: actor, clave_idempotencia: `c33-doc-${randomUUID()}` } });
  await m2.emitirCotizacion(creada.id_cotizacion);
  const clave = `c33-aceptar-${randomUUID()}`;
  const primera = await m2.aceptarAlternativaB2C(creada.id_cotizacion, { revisionGrupo: seleccion.revision, claveIdempotencia: clave, motivo: 'Aceptación sintética C3.3' }, actor);
  const segunda = await m2.aceptarAlternativaB2C(creada.id_cotizacion, { revisionGrupo: seleccion.revision, claveIdempotencia: clave, motivo: 'Aceptación sintética C3.3' }, actor);
  assert.deepEqual(segunda, primera);
  const detalle = await prisma.detalle_cotizacion.findUniqueOrThrow({ where: { id_detalle_cotizacion: primera.idDetalle } });
  assert.equal(detalle.id_alternativa_b2c_aceptada, alternativa.id_alternativa_b2c);
  assert.equal((await prisma.alternativa_b2c.findUniqueOrThrow({ where: { id_alternativa_b2c: alternativa.id_alternativa_b2c } })).estado, 'ACEPTADA');
  assert.equal(await prisma.nota_venta.count({ where: { id_cotizacion: creada.id_cotizacion } }), 0);
  assert.equal(await prisma.unidad_fisica_orden_trabajo.count({ where: { id_cotizacion: creada.id_cotizacion } }), 0);
  assert.equal(await prisma.historial_decision_alternativa_b2c.count({ where: { id_alternativa_b2c: alternativa.id_alternativa_b2c, estado_nuevo: 'ACEPTADA' } }), 1);
});

test.after(async () => { await prisma.$disconnect(); });
