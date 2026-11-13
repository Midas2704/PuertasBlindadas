const test = require('node:test');
const assert = require('node:assert/strict');
const { validarDestinoDemo } = require('../dist/administracion/demo/seguridad');

test('fixtures CU18 permiten restauración local aislada y rechazan producción activa', () => {
  const base = { DEMO_BASE_AISLADA: 'SI' };
  assert.equal(validarDestinoDemo({
    ...base,
    DATABASE_URL: 'postgresql://demo:demo@127.0.0.1/pblindadas_validacion_20261113_132726',
  }), true);
  assert.throws(() => validarDestinoDemo({
    ...base,
    DATABASE_URL: 'postgresql://demo:demo@localhost/pblindadas_finanzas',
  }), /expresamente prohibida/);
  assert.throws(() => validarDestinoDemo({
    ...base,
    DATABASE_URL: 'postgresql://demo:demo@db.example/pblindadas_validacion_20261113_132726',
  }), /local aislado/);
});
