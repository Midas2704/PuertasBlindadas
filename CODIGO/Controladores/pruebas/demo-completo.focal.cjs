const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const ejecutar = modo => execFileSync(process.execPath, [resolve('dist/administracion/sembrarDemoCompleto.js'), modo], { encoding: 'utf8' });

test('dataset DEMO integral es verificable e idempotente', () => {
  ejecutar('seed');
  const primeraEjecucion = JSON.parse(ejecutar('status'));
  ejecutar('seed');
  const despues = JSON.parse(ejecutar('status'));
  assert.deepEqual(despues, primeraEjecucion);
  assert.doesNotThrow(() => ejecutar('verify'));
  assert.ok(despues.clientes >= 10);
  assert.ok(despues.usuarios >= 5);
  assert.ok(despues.cotizaciones >= 5);
  assert.ok(despues.empleados >= 5);
  assert.ok(despues.solicitudes >= 5);
  assert.ok(despues.eventos >= 40);
  assert.ok(despues.limiteGlobal > 0);
  assert.ok(despues.exposicion > 0);
});

test('seeder DEMO no contiene borrado masivo, credenciales ni escritura directa de evidencia M9', () => {
  const fuente = readFileSync(resolve('src/administracion/sembrarDemoCompleto.ts'), 'utf8');
  const cargaNormal = fuente.slice(0, fuente.indexOf('async function limpiarDemo'));
  assert.doesNotMatch(cargaNormal, /deleteMany|truncate|DROP\s+TABLE/i);
  assert.match(fuente, /registros operativos DEMO-UI/);
  assert.match(fuente, /eventosM9DemoPreservados/);
  assert.match(fuente, /evidencia M9 no se elimina porque es inmutable/);
  assert.doesNotMatch(fuente, /password|contrase(?:n|ñ)a|claveTemporal/i);
  assert.match(fuente, /new M9Controller\(\)/);
  assert.match(fuente, /controlador\.recibir\(/);
  assert.doesNotMatch(fuente, /evento_auditoria_m9\.(create|createMany)/);
});
