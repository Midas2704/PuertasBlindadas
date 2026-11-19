const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');

process.env.MODO_DEMOSTRACION = 'true';
process.env.NODE_ENV = 'test';
const demo = require('../dist/demostracion/ServicioDemostracion.js');

test.beforeEach(() => demo.pruebasDemostracion.limpiar());

test('modo activado conserva correlación, orden y duración sin alterar el resultado', async () => {
  const resultado = await demo.pruebasDemostracion.ejecutarEnContexto({solicitudId:'req-1', operacion:'guardarCotizacion', modulo:'M2'}, async () => {
    demo.emitirEtapa('INTERACCION','CORRECTO','clic');
    return demo.medirEtapa('CONTROLADOR','M2Controller', async () => 42);
  });
  assert.equal(resultado, 42);
  const eventos = demo.pruebasDemostracion.eventos();
  assert.deepEqual(eventos.map(e => e.solicitudId), ['req-1','req-1','req-1']);
  assert.deepEqual(eventos.map(e => e.secuencia), [1,2,3]);
  assert.equal(eventos.at(-1).estado, 'CORRECTO');
  assert.equal(typeof eventos.at(-1).duracionMs, 'number');
});

test('error y rollback pueden observarse sin convertir el fallo en éxito', async () => {
  await assert.rejects(() => demo.pruebasDemostracion.ejecutarEnContexto({solicitudId:'req-error'}, () =>
    demo.medirEtapa('REGLAS_NEGOCIO','validación', async () => { throw new Error('fallo real'); })
  ), /fallo real/);
  const eventos = demo.pruebasDemostracion.eventos();
  assert.equal(eventos.at(-1).estado, 'ERROR');
  assert.match(eventos.at(-1).resultado, /fallo real/);
});

test('sanitiza secretos, RUT y correo antes de publicar', () => {
  const limpio = demo.pruebasDemostracion.textoSeguro('authorization Bearer abc, password=hola 12345678-5 persona@empresa.cl');
  assert.doesNotMatch(limpio, /Bearer abc|hola|12345678-5|persona@empresa\.cl/);
  assert.match(limpio, /PROTEGIDO/);
});

test('expone tabla y acción de datos para reconstruir el recorrido real', () => {
  demo.pruebasDemostracion.ejecutarEnContexto({solicitudId:'tabla-1'}, () =>
    demo.emitirEtapa('POSTGRESQL','CORRECTO','Tabla cotizaciones',{tabla:'cotizaciones',accionDatos:'findMany'})
  );
  const evento = demo.pruebasDemostracion.eventos().at(-1);
  assert.equal(evento.tabla, 'cotizaciones');
  assert.equal(evento.accionDatos, 'findMany');
});

test('dos solicitudes simultáneas no mezclan identificadores', async () => {
  await Promise.all(['A','B'].map(id => demo.pruebasDemostracion.ejecutarEnContexto({solicitudId:id}, async () => {
    await new Promise(resolve => setTimeout(resolve, id === 'A' ? 8 : 1));
    demo.emitirEtapa('RESPUESTA','CORRECTO',`respuesta ${id}`);
  })));
  assert.deepEqual(new Set(demo.pruebasDemostracion.eventos().map(e => e.solicitudId)), new Set(['A','B']));
});

test('SSE entrega historial, limpieza funciona y modo desactivado responde 404', async (t) => {
  const app = express(); app.use('/api/demostracion', demo.crearRutasDemostracion());
  const servidor = app.listen(0, '127.0.0.1');
  await new Promise(resolve => servidor.once('listening', resolve));
  t.after(() => servidor.close());
  const {port} = servidor.address();
  demo.pruebasDemostracion.ejecutarEnContexto({solicitudId:'sse'}, () => demo.emitirEtapa('RESPUESTA','CORRECTO','ok'));
  const controlador = new AbortController(); t.after(() => controlador.abort());
  const respuesta = await fetch(`http://127.0.0.1:${port}/api/demostracion/eventos`, {signal:controlador.signal});
  assert.equal(respuesta.status, 200);
  const lectura = await respuesta.body.getReader().read();
  assert.match(new TextDecoder().decode(lectura.value), /"solicitudId":"sse"/);
  const limpieza = await fetch(`http://127.0.0.1:${port}/api/demostracion/eventos`, {method:'DELETE'});
  assert.equal(limpieza.status, 204);
  assert.equal(demo.pruebasDemostracion.eventos().length, 0);
  controlador.abort();
  process.env.MODO_DEMOSTRACION = 'false';
  const cerrado = await fetch(`http://127.0.0.1:${port}/api/demostracion/estado`);
  assert.equal(cerrado.status, 404);
  process.env.MODO_DEMOSTRACION = 'true';
});
