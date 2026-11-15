const { test } = require('node:test');
const assert = require('node:assert/strict');
const { manifiestoDemoValido, seleccionarParHistoricoDemo, conciliarHistoricosDemoEnCalculo } = require('../dist/m6/conciliacionHistoricaDemo');

const demo = (tipo, indice = 1) => ({
  id_componente_remuneracion: tipo === 'SUELDO' ? 100 : 101,
  tipo: tipo === 'SUELDO' ? 'SUELDO_BASE' : 'DEDUCCION_AUTOMATICA',
  descripcion: tipo === 'SUELDO' ? 'DEMO-UI sueldo' : 'DEMO-UI deduccion',
  monto: 100000,
  clave_negocio: `DEMO-UI:${tipo}:2026-10:${indice}`,
  fuente_tipo: 'AUTOMATICA_HISTORICA',
  estado_revision: 'conflicto',
  motivo: 'La fuente automática dejó de aplicar; requiere revisión',
  referencia_origen: null, version_origen: null, fecha_origen: null,
  id_componente_origen: null, tipo_relacion: null,
});
const vigentes = () => [
  { tipo: 'SUELDO_BASE', clave_negocio: 'SUELDO_BASE', monto: 720000, fuente_tipo: 'AUTOMATICA', estado_revision: 'aprobado' },
  { tipo: 'DEDUCCION_PREVISIONAL', clave_negocio: 'AFP', monto: 72000, fuente_tipo: 'AUTOMATICA', estado_revision: 'aprobado' },
  { tipo: 'IMPUESTO_RENTA', clave_negocio: 'IMPUESTO_UNICO_SEGUNDA_CATEGORIA', monto: 0, fuente_tipo: 'AUTOMATICA', estado_revision: 'aprobado' },
];
const manifest = JSON.stringify({ version: 2, meses: 36, semilla: 2704, corte: '2026-10-21' });

test('solo acepta el manifiesto exacto de la demostración', () => {
  assert.equal(manifiestoDemoValido(manifest), true);
  assert.equal(manifiestoDemoValido(null), false);
  assert.equal(manifiestoDemoValido('{'), false);
  assert.equal(manifiestoDemoValido(JSON.stringify({ version: 2, meses: 36, semilla: 999, corte: '2026-10-21' })), false);
});

test('elige solo el par histórico generado por seed con sustitutos aprobados', () => {
  assert.deepEqual(seleccionarParHistoricoDemo(2026, 10, [demo('SUELDO'), demo('DEDUCCION')], vigentes()), [100, 101]);
});

test('rechaza meses, índices, orígenes y estados diferentes', () => {
  const base = [demo('SUELDO'), demo('DEDUCCION')];
  assert.deepEqual(seleccionarParHistoricoDemo(2026, 11, base, vigentes()), []);
  assert.deepEqual(seleccionarParHistoricoDemo(2026, 10, [base[0], demo('DEDUCCION', 2)], vigentes()), []);
  assert.deepEqual(seleccionarParHistoricoDemo(2026, 10, [{ ...base[0], fuente_tipo: 'MANUAL' }, base[1]], vigentes()), []);
  assert.deepEqual(seleccionarParHistoricoDemo(2026, 10, [{ ...base[0], estado_revision: 'reemplazado' }, base[1]], vigentes()), []);
  assert.deepEqual(seleccionarParHistoricoDemo(2026, 10, [...base, demo('SUELDO', 3)], vigentes()), []);
});

test('sin sueldo vigente o descuentos calculados conserva el bloqueo', () => {
  const base = [demo('SUELDO'), demo('DEDUCCION')];
  assert.deepEqual(seleccionarParHistoricoDemo(2026, 10, base, vigentes().filter(x => x.tipo !== 'SUELDO_BASE')), []);
  assert.deepEqual(seleccionarParHistoricoDemo(2026, 10, base, vigentes().filter(x => x.tipo !== 'DEDUCCION_PREVISIONAL')), []);
  assert.deepEqual(seleccionarParHistoricoDemo(2026, 10, base, vigentes().filter(x => x.tipo !== 'IMPUESTO_RENTA')), []);
});

function txFalso({ estado = 'abierta', pago = 0, nombreDb = 'pblindadas_finanzas', descripcion = manifest } = {}) {
  let modificaciones = 0;
  const tx = {
    remuneracion: { findUnique: async () => ({ estado, periodo: { anio: 2026, mes: 10, cerrado_en: null } }) },
    $queryRaw: async () => [{ nombre: nombreDb }],
    parametro_remuneracional: { findMany: async () => [{ descripcion }] },
    pago_remuneracion: { count: async () => pago },
    componente_remuneracion: {
      findMany: async (args) => args.where.clave_negocio ? [demo('SUELDO'), demo('DEDUCCION')] : vigentes(),
      updateMany: async () => { modificaciones++; return { count: 2 }; },
    },
  };
  return { tx, get modificaciones() { return modificaciones; } };
}

test('conciliación demo: transacción modifica exactamente dos componentes', async () => {
  const f = txFalso();
  assert.equal(await conciliarHistoricosDemoEnCalculo(f.tx, 549), 2);
  assert.equal(f.modificaciones, 1);
});

test('conciliación se niega en cerradas, pagadas, bases ajenas o manifiesto distinto', async () => {
  for (const opts of [{ estado: 'cerrada' }, { pago: 1 }, { nombreDb: 'otra_base' }, { descripcion: null }]) {
    const f = txFalso(opts);
    assert.equal(await conciliarHistoricosDemoEnCalculo(f.tx, 549), 0);
    assert.equal(f.modificaciones, 0);
  }
});
