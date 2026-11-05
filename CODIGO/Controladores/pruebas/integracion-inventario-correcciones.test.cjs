const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { Prisma } = require('@prisma/client');
const { prisma } = require('../dist/db');
const { M2Controller } = require('../dist/controladores/M2Controller');
const { M7Controller } = require('../dist/controladores/M7Controller');
const {
  cantidadPendienteCompraAbierta,
  esMovimientoInventarioEfectivo,
  esReservaInventarioActiva,
  filtroReservaInventarioActiva,
} = require('../dist/inventario/contratosInventario');

const decimal = valor => new Prisma.Decimal(valor);

test('INT-01 separa stock actual de entradas esperadas y excluye OCS no abiertas', async () => {
  const originales = {
    cotizaciones: prisma.cotizacion.findMany,
    notas: prisma.nota_venta.findMany,
    stocks: prisma.inventario_bodega.findMany,
    entradas: prisma.detalle_material_orden_compra_m5.findMany,
  };
  let consultaEntradas;
  prisma.cotizacion.findMany = async () => [{
    id_cotizacion: 1,
    detalle_cotizacion: [{ detalle_costo_material_cotizacion: [{
      cantidad_material_estimada: decimal('7.0003'),
      historial_precio_material: { material_sku: 'MAT-1', material: { material_nombre_material: 'Acero' } },
    }] }],
  }];
  prisma.nota_venta.findMany = async () => [];
  prisma.inventario_bodega.findMany = async () => [
    { material_sku: 'MAT-1', inventario_bodega_cantidad_fisica: decimal('5.0003'), inventario_bodega_cantidad_reservada: decimal('2.0001') },
  ];
  prisma.detalle_material_orden_compra_m5.findMany = async entrada => {
    consultaEntradas = entrada;
    return [
      { material_sku: 'MAT-1', cantidad_pedida: decimal('6.0002'), cantidad_recibida: decimal('2.0001'), orden_compra: { estado_ocs: 'abierta' } },
      { material_sku: 'MAT-1', cantidad_pedida: decimal('100'), cantidad_recibida: decimal('0'), orden_compra: { estado_ocs: 'cerrada' } },
      { material_sku: 'MAT-1', cantidad_pedida: decimal('100'), cantidad_recibida: decimal('0'), orden_compra: { estado_ocs: 'anulada' } },
    ];
  };
  try {
    const salida = await new M2Controller().consultarBandeja();
    const material = salida.cotizaciones[0].advertenciaStock.materiales[0];
    assert.equal(consultaEntradas.include.orden_compra, true);
    assert.deepEqual(material, {
      sku: 'MAT-1', material: 'Acero', requerido: 7.0003,
      stockDisponibleActual: 3.0002, entradasEsperadas: 4.0001, disponibilidadFutura: 7.0003,
      cobertura: 'CUBIERTO_POR_ENTRADAS_ESPERADAS',
    });
  } finally {
    prisma.cotizacion.findMany = originales.cotizaciones;
    prisma.nota_venta.findMany = originales.notas;
    prisma.inventario_bodega.findMany = originales.stocks;
    prisma.detalle_material_orden_compra_m5.findMany = originales.entradas;
  }
});

test('INT-01 conserva precisión decimal y sólo una OCS abierta aporta recepción futura', () => {
  assert.equal(cantidadPendienteCompraAbierta(decimal('0.3003'), decimal('0.1001'), 'abierta').toString(), '0.2002');
  assert.equal(cantidadPendienteCompraAbierta(10, 0, 'cerrada').toString(), '0');
  assert.equal(cantidadPendienteCompraAbierta(10, 0, 'anulada').toString(), '0');
  assert.equal(cantidadPendienteCompraAbierta(10, 0, 'rechazada').toString(), '0');
});

test('INT-01 la bandeja comercial distingue disponibilidad actual, entradas y futuro', () => {
  const vista = readFileSync(resolve('../Vistas/src/views/BandejaAprobacion/BandejaAprobacionGerencia.tsx'), 'utf8');
  assert.match(vista, /disponible actual/);
  assert.match(vista, /entradas esperadas/);
  assert.match(vista, /disponibilidad futura/);
});

test('INT-02 aplica un único criterio de reserva activa ante estados y fechas inconsistentes', () => {
  assert.equal(esReservaInventarioActiva({ reserva_inventario_fecha_liberacion:null, reserva_inventario_estado_reserva:'activa' }), true);
  assert.equal(esReservaInventarioActiva({ reserva_inventario_fecha_liberacion:null, reserva_inventario_estado_reserva:null }), true, 'compatibilidad histórica');
  assert.equal(esReservaInventarioActiva({ reserva_inventario_fecha_liberacion:null, reserva_inventario_estado_reserva:'cancelada' }), false);
  assert.equal(esReservaInventarioActiva({ reserva_inventario_fecha_liberacion:null, reserva_inventario_estado_reserva:'LIBERADA' }), false);
  assert.equal(esReservaInventarioActiva({ reserva_inventario_fecha_liberacion:new Date(), reserva_inventario_estado_reserva:'activa' }), false);
  const filtro = filtroReservaInventarioActiva();
  assert.equal(filtro.reserva_inventario_fecha_liberacion, null);
  assert.deepEqual(filtro.OR[1].reserva_inventario_estado_reserva.notIn.sort(), ['cancelada','liberada']);
});

test('INT-07 un movimiento anulado o revertido no reinicia la inmovilidad', async () => {
  const originales = {
    parametro: prisma.parametro_remuneracional.findFirst,
    movimientos: prisma.movimiento_inventario.findMany,
    stocks: prisma.inventario_bodega.findMany,
  };
  prisma.parametro_remuneracional.findFirst = async () => ({ valor: decimal(30) });
  prisma.movimiento_inventario.findMany = async () => [
    movimiento(3, '2026-11-03T00:00:00Z', 'anulado'),
    movimiento(2, '2026-11-02T00:00:00Z', 'revertido'),
    movimiento(1, '2026-01-01T00:00:00Z', 'confirmado'),
  ];
  prisma.inventario_bodega.findMany = async () => [{
    material_sku:'MAT-1', inventario_bodega_cantidad_fisica:decimal(5),
    material:{material_nombre_material:'Acero',material_unidad_medida:{material_unidad_medida_nombre:'kg'}},
  }];
  try {
    const salida = await new M7Controller().consultarRotacionInventario({ desde:'2026-01-01', hasta:'2026-11-04' });
    assert.equal(salida.stockInmovil.valor[0].ultimoMovimiento, '2026-01-01T00:00:00.000Z');
    assert.equal(salida.movimientosPeriodo.find(item => item.idMovimiento === '3').efectivoFisicamente, false);
    assert.equal(salida.movimientosPeriodo.find(item => item.idMovimiento === '2').efectivoFisicamente, false);
    assert.equal(salida.movimientosPeriodo.find(item => item.idMovimiento === '1').efectivoFisicamente, true);
  } finally {
    prisma.parametro_remuneracional.findFirst = originales.parametro;
    prisma.movimiento_inventario.findMany = originales.movimientos;
    prisma.inventario_bodega.findMany = originales.stocks;
  }
});

test('INT-07 sólo excluye estados explícitamente sin efecto físico', () => {
  for (const estado of ['anulado','anulada','revertido','revertida']) assert.equal(esMovimientoInventarioEfectivo(estado), false);
  for (const estado of ['confirmado','registrado',null]) assert.equal(esMovimientoInventarioEfectivo(estado), true);
});

function movimiento(id, fecha, estado) {
  return {
    movimiento_inventario_id_movimiento: BigInt(id), movimiento_inventario_fecha_hora: new Date(fecha),
    movimiento_inventario_estado: estado, movimiento_inventario_cantidad: decimal(1), material_sku: 'MAT-1',
    material: { material_nombre_material:'Acero', material_unidad_medida:{material_unidad_medida_nombre:'kg'} },
    movimiento_inventario_tipo_movimiento:null, movimiento_inventario_motivo_movimiento:null,
  };
}
