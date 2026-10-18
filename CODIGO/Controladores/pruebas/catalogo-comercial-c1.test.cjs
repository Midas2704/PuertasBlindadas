const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizarUbicacion, resolverCoberturaDesdeTarifas } = require('../dist/comercial/contratosCatalogoComercial');
process.env.DATABASE_URL ||= 'postgresql://usuario:clave@127.0.0.1:1/c1_no_conectar';
const { ServicioCatalogoComercial } = require('../dist/comercial/ServicioCatalogoComercial');
const { permiteOperacion, operacionesPermiso } = require('../dist/validaciones/permisos');

const base = { id:'1', alcance:'REGION', regionNormalizada:'VALPARAISO', comunaNormalizada:null,
  estadoCobertura:'DISPONIBLE', precio:120000, moneda:'CLP', vigenciaDesde:'2026-01-01', vigenciaHasta:null };

test('normaliza región y comuna sin depender de tildes ni espacios', () => {
  assert.equal(normalizarUbicacion('  Región   de Valparaíso '), 'REGION DE VALPARAISO');
});
test('resuelve una tarifa regional vigente como fallback', () => {
  const resultado = resolverCoberturaDesdeTarifas([base], 'Valparaíso', 'Quilpué');
  assert.equal(resultado.estado, 'VIGENTE');
  assert.equal(resultado.origen, 'REGION');
  assert.equal(resultado.tarifa.precio, 120000);
});

test('la exclusión específica de comuna prevalece sobre la tarifa regional', () => {
  const exclusion = {...base,id:'2',alcance:'COMUNA',comunaNormalizada:'JUAN FERNANDEZ',estadoCobertura:'NO_DISPONIBLE',precio:null,moneda:null};
  const resultado = resolverCoberturaDesdeTarifas([exclusion,base], 'Valparaíso', 'Juan Fernández');
  assert.equal(resultado.estado, 'NO_DISPONIBLE');
  assert.equal(resultado.origen, 'COMUNA');
});

test('una comuna sujeta a evaluación no hereda el precio regional', () => {
  const evaluacion = {...base,id:'3',alcance:'COMUNA',comunaNormalizada:'ISLA DE PASCUA',estadoCobertura:'REQUIERE_EVALUACION',precio:null,moneda:null};
  const resultado = resolverCoberturaDesdeTarifas([base,evaluacion], 'Valparaíso', 'Isla de Pascua');
  assert.equal(resultado.estado, 'REQUIERE_EVALUACION');
  assert.equal(resultado.tarifa.precio, null);
});

test('ausencia de cobertura no se representa como precio cero', () => {
  const resultado = resolverCoberturaDesdeTarifas([], 'Los Lagos', 'Castro');
  assert.equal(resultado.estado, 'SIN_COBERTURA');
  assert.equal(resultado.tarifa, null);
});

test('una cobertura disponible sin precio o moneda no se declara vigente', () => {
  const resultado = resolverCoberturaDesdeTarifas([{...base,precio:null}], 'Valparaíso', null);
  assert.equal(resultado.estado, 'SIN_COBERTURA');
});

test('las escrituras permanecen fail-closed cuando falta el permiso M4 comercial', () => {
  assert.throws(() => new ServicioCatalogoComercial().escrituraNoAutorizada(), error =>
    error.estado === 403 && error.codigo === 'PERMISO_COMERCIAL_PENDIENTE');
});

test('CU360 sólo habilita las consultas comerciales incorporadas', () => {
  for (const operacion of ['listarPreciosComerciales','listarOpcionalesComerciales','listarTarifasInstalacionComercial','listarCondicionesComerciales','resolverCoberturaInstalacionComercial','obtenerResumenComercialProducto']) {
    assert.equal(permiteOperacion(operacion,['CU360']), true);
  }
  assert.equal(operacionesPermiso.crearPrecioComercial, 'CU368');
  assert.equal(operacionesPermiso.crearTarifaInstalacionComercial, 'CU370');
});
