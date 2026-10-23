const { test } = require('node:test');
const assert = require('node:assert/strict');
const { calcularResumenIvaM7, M7Controller } = require('../dist/controladores/M7Controller');

const fila = (cambios = {}) => ({ moneda: 'CLP', montoNeto: 100000, montoImpuesto: 19000, montoTotal: 119000, afectaImpuesto: true, idDocumentoReferencia: null, ...cambios });

test('M7 separa montos netos e IVA sin inferencias tributarias', async t => {
  await t.test('venta y compra conservan su desglose explícito', () => {
    const resultado = calcularResumenIvaM7([fila()], [fila({ montoNeto: 50000, montoImpuesto: 9500, montoTotal: 59500 })]);
    assert.deepEqual(resultado.ivaEstimado, [{ moneda: 'CLP', ivaVentas: 19000, ivaCompras: 9500, ivaEstimado: 9500 }]);
    assert.equal(resultado.estado, 'VALIDO');
  });

  await t.test('documento exento conserva IVA cero sin dividir el total por 1,19', () => {
    const resultado = calcularResumenIvaM7([fila({ montoNeto: 100000, montoImpuesto: 0, montoTotal: 100000, afectaImpuesto: false })], []);
    assert.deepEqual(resultado.ivaEstimado, [{ moneda: 'CLP', ivaVentas: 0, ivaCompras: 0, ivaEstimado: 0 }]);
  });

  await t.test('desglose ausente o inconsistente no se reemplaza con un cálculo inventado', () => {
    const sinDesglose = calcularResumenIvaM7([fila({ montoImpuesto: null })], []);
    const inconsistente = calcularResumenIvaM7([fila({ montoTotal: 100000 })], []);
    assert.equal(sinDesglose.estado, 'DATOS_INSUFICIENTES');
    assert.equal(sinDesglose.cobertura.sinDesglose, 1);
    assert.equal(inconsistente.cobertura.desgloseInconsistente, 1);
  });

  await t.test('corrector positivo sin regla acreditada se excluye y uno negativo conserva su signo', () => {
    const resultado = calcularResumenIvaM7([
      fila(),
      fila({ montoNeto: 10000, montoImpuesto: 1900, montoTotal: 11900, idDocumentoReferencia: 1 }),
      fila({ montoNeto: -10000, montoImpuesto: -1900, montoTotal: -11900, idDocumentoReferencia: 1 }),
    ], []);
    assert.deepEqual(resultado.ivaEstimado, [{ moneda: 'CLP', ivaVentas: 17100, ivaCompras: 0, ivaEstimado: 17100 }]);
    assert.equal(resultado.cobertura.correctorSinSignoAcreditado, 1);
    assert.equal(resultado.estado, 'PARCIALMENTE_DISPONIBLE');
  });

  await t.test('no mezcla monedas', () => {
    const resultado = calcularResumenIvaM7([fila(), fila({ moneda: 'USD', montoNeto: 100, montoImpuesto: 19, montoTotal: 119 })], []);
    assert.deepEqual(resultado.ivaEstimado, [
      { moneda: 'CLP', ivaVentas: 19000, ivaCompras: 0, ivaEstimado: 19000 },
      { moneda: 'USD', ivaVentas: 19, ivaCompras: 0, ivaEstimado: 19 },
    ]);
  });

  await t.test('CU243 controla la exposición del bloque tributario', async () => {
    const controlador = new M7Controller();
    controlador.consultarResumenIva = async () => ({ estado: 'VALIDO', ivaEstimado: [] });
    const sinPermiso = await controlador.consultarPanelGeneral({ anio: 2026, mes: 10 }, []);
    const conPermiso = await controlador.consultarPanelGeneral({ anio: 2026, mes: 10 }, ['CU243']);
    assert.equal(sinPermiso.bloques.resumenIva, undefined);
    assert.ok(sinPermiso.bloquesOcultos.includes('resumenIva'));
    assert.equal(conPermiso.bloques.resumenIva.estado, 'VALIDO');
  });
});
