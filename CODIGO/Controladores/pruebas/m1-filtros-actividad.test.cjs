const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validarFiltros } = require('../dist/validaciones/solicitudes');

test('CU08 y CU11 validan situación financiera, período y última actividad', () => {
  const filtros = validarFiltros({ situacion: 'deuda_vigente', ordenar: 'ultimaActividad', direccion: 'desc', fechaDesde: '2026-01-01', fechaHasta: '2026-12-31' });
  assert.equal(filtros.situacion, 'deuda_vigente');
  assert.equal(filtros.ordenar, 'ultimaActividad');
  assert.equal(filtros.fechaDesde.toISOString(), '2026-01-01T00:00:00.000Z');
  assert.equal(filtros.fechaHasta.toISOString(), '2026-12-31T23:59:59.999Z');
});

test('CU08 conserva los filtros históricos y rechaza valores ambiguos', () => {
  assert.equal(validarFiltros({ deuda: 'true' }).deuda, true);
  assert.equal(validarFiltros({ morosos: 'true' }).morosos, true);
  assert.throws(() => validarFiltros({ situacion: 'con_deuda' }), /Situación financiera inválida/);
  assert.throws(() => validarFiltros({ fechaDesde: '2026-12-31', fechaHasta: '2026-01-01' }), /período de actividad/);
  assert.throws(() => validarFiltros({ fechaDesde: '2026-02-30' }), /fecha válida/);
});
