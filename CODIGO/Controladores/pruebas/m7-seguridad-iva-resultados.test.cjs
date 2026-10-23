const { test } = require('node:test');
const assert = require('node:assert/strict');
const { M7Controller } = require('../dist/controladores/M7Controller');

const consulta = { anio: 2026, mes: 10 };
const respuestaVentas = { montoNeto: { estado: 'VALIDO', valor: { porMoneda: [{ moneda: 'CLP', monto: 100000 }], totalClp: 100000, ventasExcluidasSinTipoCambio: 0 } } };
const respuestaMargen = { proyectos: [] };
const respuestaPresupuesto = { estado: 'SIN_RESULTADOS', meses: [], totales: {}, proyecciones: [], pendientesClasificacion: [], monedasNoConsolidables: [], inconsistencias: [] };
const respuestaIva = { estado: 'VALIDO', ivaVentas: [{ moneda: 'CLP', monto: 19000 }], ivaCompras: [{ moneda: 'CLP', monto: 9500 }], ivaEstimado: [{ moneda: 'CLP', ivaVentas: 19000, ivaCompras: 9500, ivaEstimado: 9500 }] };

function controladorResultados() {
  const controlador = new M7Controller();
  let consultasIva = 0;
  controlador.consultarAnalisisVentas = async () => respuestaVentas;
  controlador.consultarMargenProyectos = async () => respuestaMargen;
  controlador.consultarHistoricoPanelGeneral = async () => ({ meses: [] });
  controlador.consultarProyeccionesM7 = async () => respuestaPresupuesto;
  controlador.consultarResumenIva = async () => { consultasIva += 1; return respuestaIva; };
  return { controlador, consultasIva: () => consultasIva };
}

test('M7 protege IVA indirecto con CU243', async t => {
  await t.test('CU238 sin CU243 conserva resultados y omite completamente IVA', async () => {
    const { controlador, consultasIva } = controladorResultados();
    const resultado = await controlador.consultarResumenResultados(consulta, ['CU238']);
    assert.equal(resultado.estadoResultados.valor.ventasNetas, 100000);
    assert.equal(Object.hasOwn(resultado, 'iva'), false);
    assert.equal(consultasIva(), 0);
  });

  await t.test('CU238 con CU243 consulta y devuelve IVA', async () => {
    const { controlador, consultasIva } = controladorResultados();
    const resultado = await controlador.consultarResumenResultados(consulta, ['CU238', 'CU243']);
    assert.deepEqual(resultado.iva, respuestaIva);
    assert.equal(consultasIva(), 1);
  });

  await t.test('Panel transmite permisos efectivos al resumen y oculta tarjetas sin CU243', async () => {
    const controlador = new M7Controller(); const recibidos = [];
    controlador.consultarResumenResultados = async (_consulta, permisos) => { recibidos.push(permisos); return { estado: 'VALIDO' }; };
    controlador.consultarResumenIva = async () => respuestaIva;
    const restringido = await controlador.consultarPanelGeneral(consulta, ['CU238']);
    const autorizado = await controlador.consultarPanelGeneral(consulta, ['CU238', 'CU243']);
    assert.deepEqual(recibidos, [['CU238'], ['CU238', 'CU243']]);
    assert.equal(restringido.bloques.resumenIva, undefined);
    assert.deepEqual(autorizado.bloques.resumenIva.ivaEstimado, respuestaIva.ivaEstimado);
  });

  await t.test('PDF de resultados omite IVA sin CU243 y lo conserva con CU243', async () => {
    const controlador = new M7Controller(); const permisosRecibidos = [];
    controlador.consultarResumenResultados = async (_consulta, permisos) => {
      permisosRecibidos.push(permisos);
      return { resultadoGerencial: { valor: [{ moneda: 'CLP', ingresos: 100000, costosDirectos: 50000, resultadoGerencial: 50000 }] }, ...(permisos.includes('CU243') ? { iva: respuestaIva } : {}) };
    };
    const texto = archivo => Buffer.from(archivo.contenido.split(',')[1], 'base64').toString('latin1');
    const restringido = texto(await controlador.descargarPdfContextual({ origen: 'resultados', consulta }, ['CU238', 'CU245']));
    const autorizado = texto(await controlador.descargarPdfContextual({ origen: 'resultados', consulta }, ['CU238', 'CU243', 'CU245']));
    assert.doesNotMatch(restringido, /IVA estimado autorizado/);
    assert.match(autorizado, /IVA estimado autorizado/);
    assert.deepEqual(permisosRecibidos, [['CU238', 'CU245'], ['CU238', 'CU243', 'CU245']]);
  });
});
