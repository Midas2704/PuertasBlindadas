const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { M1Controller } = require('../dist/controladores/M1Controller');
const { prisma } = require('../dist/db');
const { validarFiltros } = require('../dist/validaciones/solicitudes');

after(async () => prisma.$disconnect());

test('CU08 clasifica en forma excluyente Al día, Deuda vigente y Moroso', async () => {
  const modulo = new M1Controller();
  for (const situacion of ['al_dia', 'deuda_vigente', 'moroso']) {
    const clientes = await modulo.listarClientes(validarFiltros({ estado:'todos', situacion }));
    assert.ok(clientes.every(cliente => cliente.situacionClave === situacion));
  }
});

test('CU10 filtra el historial compuesto por tipo y conserva el orden solicitado', async () => {
  const cliente = await prisma.cliente_financiero.findFirstOrThrow({ where:{ ficha_cliente:{ is:{ pago_cliente:{ some:{} } } } }, include:{ ficha_cliente:true } });
  const modulo = new M1Controller();
  const ficha = await modulo.abrirFicha(`id-${cliente.id_cliente_financiero}`, { tipoAntecedente:'pago', direccion:'asc' });
  assert.ok(ficha.historial.length > 0);
  assert.ok(ficha.historial.every(item => item.tipo === 'pago'));
  for (let indice = 1; indice < ficha.historial.length; indice += 1) assert.ok(new Date(ficha.historial[indice - 1].fecha) <= new Date(ficha.historial[indice].fecha));
});

test('CU11 ordena por última actividad sin inventar fecha para clientes sin antecedentes', async () => {
  const modulo = new M1Controller();
  const clientes = await modulo.listarClientes(validarFiltros({ estado:'todos', ordenar:'ultimaActividad', direccion:'desc' }));
  const fechas = clientes.map(cliente => cliente.ultimaActividad?.getTime() ?? 0);
  for (let indice = 1; indice < fechas.length; indice += 1) assert.ok(fechas[indice - 1] >= fechas[indice]);
});
