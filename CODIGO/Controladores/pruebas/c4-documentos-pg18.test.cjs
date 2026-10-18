const test = require('node:test');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { prisma } = require('../dist/db');
const { ServicioDocumentosComerciales } = require('../dist/comercial/documentos/ServicioDocumentosComerciales');

const habilitada = process.env.C4_PG18_AISLADO === '1';

test('C4 previsualiza desde persistencia sin emitir, crear NV ni generar OT', { skip: !habilitada }, async()=>{
  const cotizacion = await prisma.cotizacion.findFirst({where:{segmento_comercial:{in:['B2B','B2C']}},orderBy:{id_cotizacion:'desc'}});
  assert.ok(cotizacion,'El fixture aislado debe contener una cotización comercial');
  const [versionesAntes,nvAntes,otAntes] = await Promise.all([
    prisma.cotizacion_version.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),
    prisma.nota_venta.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),
    prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),
  ]);
  const resultado = await new ServicioDocumentosComerciales().previsualizarCotizacion(cotizacion.id_cotizacion);
  const pdf = Buffer.from(resultado.contenido.split(',')[1],'base64');
  assert.equal(pdf.subarray(0,8).toString('ascii'),'%PDF-1.4');
  assert.equal(resultado.sha256,createHash('sha256').update(pdf).digest('hex'));
  assert.equal(resultado.estado,'BORRADOR_NO_EMITIDO');
  assert.equal(resultado.snapshot.borrador,true);
  assert.deepEqual([
    await prisma.cotizacion_version.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),
    await prisma.nota_venta.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),
    await prisma.unidad_fisica_orden_trabajo.count({where:{id_cotizacion:cotizacion.id_cotizacion}}),
  ],[versionesAntes,nvAntes,otAntes]);
});

test('C4.3 consulta historial y declara los CU específicos sin concederlos implícitamente', { skip: !habilitada }, async()=>{
  const servicio = new ServicioDocumentosComerciales();
  const [plantillas,cartas,infraestructura] = await Promise.all([servicio.listarPlantillas(),servicio.listarCartasB2C(),servicio.estadoInfraestructura()]);
  assert.equal(plantillas.capacidadEdicion,'CU378');
  assert.equal(plantillas.capacidadPublicacion,'CU379');
  assert.equal(cartas.capacidadEdicion,'CU380');
  assert.equal(cartas.capacidadPublicacion,'CU381');
  assert.equal(infraestructura.emisionDefinitiva,'BLOQUEADA');
});

test.after(async()=>{await prisma.$disconnect()});
