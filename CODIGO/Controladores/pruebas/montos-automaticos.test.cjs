const { test } = require('node:test');
const assert = require('node:assert/strict');
const { totalLineasComerciales } = require('../dist/utilidades/finanzas');

test('suma automáticamente cantidad por valor unitario de todas las líneas', () => {
  const total = totalLineasComerciales([
    { cantidad: 2, valor: 100 },
    { cantidad: 1, valor: 150 },
  ]);
  assert.equal(total.toFixed(2), '350.00');
});

test('mantiene precisión decimal monetaria al sumar y restar importes', () => {
  const total = totalLineasComerciales([
    { cantidad: 3, valor: '0.10' },
    { cantidad: 1, valor: '0.20' },
  ]);
  assert.equal(total.toFixed(2), '0.50');
});
