const test = require('node:test');
const assert = require('node:assert/strict');
const { fichaActivaParaCreditoM8 } = require('../dist/utilidades/elegibilidadClienteM8');
const { limitesFiltroChile, inicioDiaChile } = require('../dist/m9/fechasFiltroChile');

const ficha = (estadoFicha, estadoCliente) => ({estado_ficha:estadoFicha,cliente_financiero:{estado_financiero:estadoCliente}});
test('EF10: acepta ficha y cliente activos', () => assert.equal(fichaActivaParaCreditoM8(ficha('activa','activo')), true));
test('EF10: rechaza cliente financiero inactivo', () => assert.equal(fichaActivaParaCreditoM8(ficha('activa','inactivo')), false));
test('EF10: rechaza ficha inactiva', () => assert.equal(fichaActivaParaCreditoM8(ficha('inactiva','activo')), false));
test('EF10: no depende de mayúsculas y espacios', () => assert.equal(fichaActivaParaCreditoM8(ficha(' ACTIVA ', 'ACTIVO')), true));

test('EF13: día civil de noviembre en Chile no empieza a medianoche UTC', () => {
  const limite = limitesFiltroChile({desde:'2026-11-14',hasta:'2026-11-14'});
  assert.equal(limite.gte.toISOString(), '2026-11-14T03:00:00.000Z');
  assert.equal(limite.lt.toISOString(), '2026-11-15T03:00:00.000Z');
  assert.equal(limite.lte, undefined);
});
test('EF13: horario de invierno de Santiago usa UTC-4', () => assert.equal(inicioDiaChile('2026-07-15').toISOString(), '2026-07-15T04:00:00.000Z'));
test('EF13: todo el día Hasta queda incluido mediante límite superior exclusivo', () => {
  const l = limitesFiltroChile({desde:'2026-11-14',hasta:'2026-11-14'});
  assert.equal(new Date('2026-11-15T02:59:59.999Z') < l.lt, true);
  assert.equal(new Date('2026-11-15T03:00:00.000Z') < l.lt, false);
});
test('EF13: valida calendario y orden', () => {
  assert.throws(() => inicioDiaChile('2026-02-30'), RangeError);
  assert.throws(() => limitesFiltroChile({desde:'2026-11-15',hasta:'2026-11-14'}), RangeError);
});
test('EF13: mantiene timestamp con offset explícito si el consumidor envía hora', () => {
  const l=limitesFiltroChile({desde:'2026-11-14T18:30:00-03:00',hasta:'2026-11-14T20:00:00-03:00'});
  assert.equal(l.gte.toISOString(),'2026-11-14T21:30:00.000Z');
  assert.equal(l.lte.toISOString(),'2026-11-14T23:00:00.000Z');
});
