const { test } = require('node:test');
const assert = require('node:assert/strict');

const { pdfOperacional, respaldoOperacional } = require('../dist/utilidades/pdfOperacional.js');

const pdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<>>\nendobj\nstartxref\n0\n%%EOF').toString('base64');
const dataUrl = `data:application/pdf;base64,${pdf}`;

test('conserva íntegramente un PDF operacional válido', () => {
  assert.equal(pdfOperacional(dataUrl), dataUrl);
  assert.equal(respaldoOperacional(dataUrl), dataUrl);
});

test('rechaza archivos que sólo declaran ser PDF', () => {
  const falso = `data:application/pdf;base64,${Buffer.from('contenido plano').toString('base64')}`;
  assert.throws(() => pdfOperacional(falso), /estructura del PDF no es válida/);
});

test('la compatibilidad histórica admite referencias sin confundirlas con PDF', () => {
  assert.equal(respaldoOperacional('transferencia 123'), 'transferencia 123');
});
