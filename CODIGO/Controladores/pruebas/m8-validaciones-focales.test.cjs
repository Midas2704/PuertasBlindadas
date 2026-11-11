const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { validarMontoLimiteGlobalM8 } = require('../dist/controladores/M8Controller');

test('CU118 distingue campo vacío de cero explícito', () => {
  for (const valor of [undefined, null, '', '   ']) {
    assert.throws(() => validarMontoLimiteGlobalM8(valor), error => error.estado === 400);
  }
  assert.equal(validarMontoLimiteGlobalM8('0').toString(), '0');
  assert.throws(() => validarMontoLimiteGlobalM8('-1'), error => error.estado === 400);
});

test('CU115 y CU119 conservan selección por ficha y exportación filtrada', () => {
  const backend = readFileSync('src/controladores/M8Controller.ts', 'utf8');
  const fachada = readFileSync('src/controladores/C_Finanzas.ts', 'utf8');
  const vista = readFileSync('../Vistas/src/views/Credito/SolicitudesCredito.tsx', 'utf8');
  assert.match(backend, /listarClientesB2B[\s\S]+idFichaCliente/);
  assert.match(backend, /CU260[\s\S]+CU261/);
  assert.match(fachada, /listarClientesB2BCreditoM8/);
  assert.match(vista, /Buscar por razón social o RUT/i);
  assert.match(vista, /credito\/exportar\/solicitudes\$\{consulta\.size/);
});
