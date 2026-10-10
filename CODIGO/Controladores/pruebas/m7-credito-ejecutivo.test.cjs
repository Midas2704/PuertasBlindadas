const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const fuente = ruta => readFileSync(resolve(ruta), 'utf8');
const panel = fuente('../Vistas/src/views/DashboardM7/PanelGeneralM7.tsx');
const graficos = fuente('../Vistas/src/views/DashboardM7/graficos.tsx');
const m7 = fuente('src/controladores/M7Controller.ts');
const m8 = fuente('src/controladores/M8Controller.ts');
const app = fuente('../Vistas/src/App.tsx');

test('M7 visualización ejecutiva de crédito M8', async t => {
  await t.test('01 consume exposición desde el indicador tipado exposicion.valor', () => {
    assert.match(panel, /esObjeto\(bloque\?\.exposicion\)[\s\S]*esObjeto\(indicador\?\.valor\)/);
  });

  await t.test('02 consume alertas desde el indicador tipado alertas.valor', () => {
    assert.match(panel, /esObjeto\(bloque\?\.alertas\)[\s\S]*Array\.isArray\(valor\.alertas\)/);
  });

  await t.test('03 muestra cupo total agregado oficial', () => {
    assert.match(panel, /Cupos aprobados[\s\S]*credito\.cupoTotalAgregado/);
    assert.match(m8, /cupoTotalAgregado:Number\(ct\)/);
  });

  await t.test('04 muestra cupo utilizado agregado oficial', () => {
    assert.match(panel, /Crédito utilizado[\s\S]*credito\.cupoUtilizadoAgregado/);
    assert.match(m8, /cupoUtilizadoAgregado:Number\(u\)/);
  });

  await t.test('05 muestra cupo disponible agregado sin forzar cero', () => {
    assert.match(panel, /cupoDisponibleAgregado:\s*numero\(valor\?\.cupoDisponibleAgregado\)/);
    assert.doesNotMatch(panel, /cupoDisponibleAgregado[^\n]{0,100}\|\|\s*0/);
  });

  await t.test('06 utilización se calcula contra cupos aprobados', () => {
    assert.match(panel, /cupoUtilizadoAgregado\s*\/\s*credito\.cupoTotalAgregado\s*\*\s*100/);
  });

  await t.test('07 barra segmentada usa naranja para utilizado y gris para disponible', () => {
    assert.match(graficos, /bg-\[#FE8F01\]/);
    assert.match(graficos, /bg-\[#d1d5db\]/);
  });

  await t.test('08 barra expone tooltip con total, utilizado, disponible y utilización', () => {
    assert.match(graficos, /Cupos aprobados:[\s\S]*Utilizado:[\s\S]*Utilización:/);
    assert.match(graficos, /role="tooltip"/);
  });

  await t.test('09 sobrecupo conserva disponible negativo y muestra su magnitud', () => {
    assert.match(graficos, /sobrecupo\s*=\s*disponible\s*<\s*0/);
    assert.match(graficos, /Sobrecupo de/);
  });

  await t.test('10 porcentaje real puede superar 100 y ancho visual queda acotado', () => {
    assert.match(graficos, /porcentajeReal\s*=\s*total\s*>\s*0\s*\?\s*utilizado\s*\/\s*total\s*\*\s*100/);
    assert.match(graficos, /Math\.min\(100,\s*porcentajeReal\)/);
  });

  await t.test('11 capacidad global permanece como bloque secundario separado', () => {
    assert.match(panel, /Capacidad global/);
    assert.match(panel, /Límite global[\s\S]*Exposición utilizada[\s\S]*Capacidad disponible/);
  });

  await t.test('12 límite global nulo informa configuración pendiente sin porcentaje inventado', () => {
    assert.match(panel, /credito\.limiteGlobal\s*===\s*null[\s\S]*Límite global pendiente de configuración/);
  });

  await t.test('13 alertas se limitan a tipos oficiales M8', () => {
    for (const tipo of ['SOBRE_CUPO', 'SUSPENDIDO', 'VIGENCIA_EXPIRADA']) assert.match(panel, new RegExp(tipo));
    assert.match(m8, /tipo:'SOBRE_CUPO'/);
  });

  await t.test('14 diferencia total de alertas y clientes únicos', () => {
    assert.match(panel, /Total de alertas/);
    assert.match(panel, /Clientes únicos con alerta/);
    assert.match(panel, /new Set\(alertas\.alertas\.map/);
  });

  await t.test('15 condición F047 no se muestra como alerta activa', () => {
    assert.doesNotMatch(panel, /avisoCapacidadProxima/);
    assert.match(panel, /No se aplica scoring ni aviso de proximidad no implementado/);
  });

  await t.test('16 B2C muestra no aplica y oculta cifras de crédito', () => {
    assert.match(panel, /creditoNoAplica\s*=\s*consulta\.segmento\s*===\s*'B2C'/);
    assert.match(panel, /No aplica al segmento B2C/);
  });

  await t.test('17 TODOS y B2B declaran alcance B2B del estado actual', () => {
    assert.match(panel, /Estado vigente general de clientes B2B en M8/);
    assert.match(panel, /exclusivamente a clientes B2B/);
  });

  await t.test('18 respeta CU240, CU241 y la ruta real de detalle', () => {
    assert.match(m7, /\['exposicionCredito',\s*\['CU240'\]/);
    assert.match(m7, /\['alertasCredito',\s*\['CU241'\]/);
    assert.match(panel, /permisos\.includes\('CU240'\)/);
    assert.match(panel, /permisos\.includes\('CU241'\)/);
    assert.match(app, /path="dashboard-m7\/control"/);
  });

  await t.test('19 declara que el crédito es actual y no compara A/B', () => {
    assert.match(panel, /filtros de mes, rango o comparación no modifican este corte actual/);
    assert.match(panel, /grid min-w-0 gap-5 xl:grid-cols/);
  });
});
