const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');

test('M3 protege anulaciones y reversiones concurrentes y conserva el pago original', () => {
  const fuente = readFileSync('src/controladores/M3Controller.ts', 'utf8');
  assert.match(fuente, /SELECT id_pago_cliente FROM finanzas\.pago_cliente WHERE id_pago_cliente = \$\{idPago\} FOR UPDATE/g);
  assert.match(fuente, /pago\.anulacion_pago/);
  assert.match(fuente, /reversion_pago\.create/);
  assert.doesNotMatch(fuente, /pago_cliente\.(delete|deleteMany)/);
  assert.match(fuente, /La reversión supera el monto aún disponible/);
});

test('CU51, CU52 y CU57 siguen separados en el contrato de permisos', () => {
  const fuente = readFileSync('src/validaciones/permisos.ts', 'utf8');
  assert.match(fuente, /anularPago:'CU51'/);
  assert.match(fuente, /revertirPago:'CU52'/);
  assert.match(fuente, /generarComprobante:'CU57'/);
});
