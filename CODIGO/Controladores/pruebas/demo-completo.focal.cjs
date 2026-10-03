const { test } = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const ejecutar = modo => execFileSync(process.execPath, [resolve('dist/administracion/sembrarDemoCompleto.js'), modo], { encoding: 'utf8' });

test('dataset DEMO integral es verificable e idempotente', () => {
  try {
    ejecutar('seed');
    const primeraEjecucion = JSON.parse(ejecutar('status'));
    ejecutar('seed');
    const despues = JSON.parse(ejecutar('status'));
    assert.deepEqual(despues, primeraEjecucion);
    const verificacion = JSON.parse(ejecutar('verify'));
    const credito = verificacion.creditoM7.exposicion.valor;
    assert.equal(verificacion.creditoM7.estado, 'VALIDO');
    assert.equal(credito.limiteGlobal, 18000000);
    assert.ok(credito.exposicionUtilizada > 0);
    assert.equal(credito.totalSolicitudes, 5);
    assert.equal(credito.totalCompromisos, 4);
    assert.ok(despues.clientes >= 10);
    assert.ok(despues.usuarios >= 5);
    assert.ok(despues.cotizaciones >= 5);
    assert.ok(despues.movimientosFinancieros >= 5);
    for (const clave of ['proveedores', 'ocs', 'documentosProveedor', 'obligaciones', 'pagosProveedor', 'categoriasEgreso', 'envios', 'cajaChica']) assert.ok(despues[clave] >= 5, `${clave} debe tener al menos 5 escenarios visibles`);
    assert.ok(despues.empleados >= 5);
    for (const clave of ['esquemas', 'haberes', 'remuneraciones', 'documentosRemuneracion', 'pagosRemuneracion', 'honorarios']) assert.ok(despues[clave] >= 5, `${clave} debe tener al menos 5 escenarios visibles`);
    for (const clave of ['proyectos', 'proyectosFinancieros', 'visitas', 'tareas', 'ejecuciones', 'incidencias', 'ots']) assert.ok(despues[clave] >= 5, `${clave} debe tener al menos 5 escenarios visibles`);
    for (const clave of ['stock', 'movimientosInventario', 'compras']) assert.ok(despues[clave] >= 5, `${clave} debe tener al menos 5 escenarios visibles`);
    assert.ok(despues.solicitudes >= 5);
    assert.ok(despues.eventos >= 40);
    assert.ok(despues.limiteGlobal > 0);
    assert.ok(despues.exposicion > 0);
  } finally {
    ejecutar('clean');
  }
});

test('seeder DEMO no contiene borrado masivo, credenciales ni escritura directa de evidencia M9', () => {
  const fuente = readFileSync(resolve('src/administracion/sembrarDemoCompleto.ts'), 'utf8');
  const paquete = JSON.parse(readFileSync(resolve('package.json'), 'utf8'));
  const cargaNormal = fuente.slice(0, fuente.indexOf('async function limpiarDemo'));
  assert.doesNotMatch(cargaNormal, /deleteMany|truncate|DROP\s+TABLE/i);
  assert.match(fuente, /registros operativos DEMO-UI/);
  assert.match(fuente, /eventosM9DemoPreservados/);
  assert.match(fuente, /evidencia M9 no se elimina porque es inmutable/);
  assert.doesNotMatch(fuente, /password|contrase(?:n|ñ)a|claveTemporal/i);
  assert.match(fuente, /new M9Controller\(\)/);
  assert.match(fuente, /controlador\.recibir\(/);
  assert.doesNotMatch(fuente, /evento_auditoria_m9\.(create|createMany)/);
  assert.equal(paquete.scripts['db:seed:demo'], 'node dist/administracion/sembrarDemoCompleto.js seed');
  assert.doesNotMatch(paquete.scripts['db:seed:demo'], /prisma\/seed\.ts|prisma db seed/);
  assert.doesNotMatch(fuente, /correo_particular:\s*\{\s*endsWith:\s*'@example\.invalid'/);
});

test('clean retira sólo DEMO operativo, preserva usuarios y evidencia M9, y permite resembrar', () => {
  try {
    ejecutar('seed');
    const antes = JSON.parse(ejecutar('status'));
    const salida = JSON.parse(ejecutar('clean'));
    const limpio = JSON.parse(ejecutar('status'));
    assert.equal(salida.eventosM9DemoPreservados, antes.eventos);
    assert.equal(limpio.usuarios, antes.usuarios);
    assert.equal(limpio.eventos, antes.eventos);
    for (const clave of ['clientes', 'movimientosFinancieros', 'proveedores', 'ocs', 'documentosProveedor', 'obligaciones', 'pagosProveedor', 'categoriasEgreso', 'envios', 'cajaChica', 'empleados', 'esquemas', 'haberes', 'documentosRemuneracion', 'pagosRemuneracion', 'honorarios', 'proyectos', 'proyectosFinancieros', 'visitas', 'tareas', 'ejecuciones', 'incidencias', 'ots', 'stock', 'movimientosInventario', 'compras', 'solicitudes', 'compromisos']) assert.equal(limpio[clave], 0, `${clave} debe quedar limpio`);
    ejecutar('seed');
    assert.doesNotThrow(() => ejecutar('verify'));
  } finally {
    ejecutar('clean');
  }
});
