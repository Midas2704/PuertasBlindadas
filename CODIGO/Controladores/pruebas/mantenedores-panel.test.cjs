const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const fuente = (ruta) => readFileSync(resolve(ruta), 'utf8');

test('Bloque 2 — panel central de Mantenedores', async (t) => {
  const app = fuente('../Vistas/src/App.tsx');
  const menu = fuente('../Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx');
  const panel = fuente('../Vistas/src/views/Mantenedores/Mantenedores.tsx');
  const permisos = fuente('../Vistas/src/views/Mantenedores/permisos.ts');

  await t.test('la ruta principal existe y reutiliza permisos vigentes', () => {
    assert.match(app, /path="mantenedores"/);
    assert.match(app, /permiso=\{\[\.\.\.permisosAccesoMantenedores\]\}/);
    assert.match(permisos, /'CU41'/);
    assert.match(permisos, /'CU134'/);
    assert.match(permisos, /'CU171'/);
    assert.match(permisos, /'CU246'/);
    assert.match(permisos, /'CU268'/);
  });

  await t.test('el menú lateral conduce al panel sin duplicar accesos del grupo', () => {
    assert.match(menu, /path: '\/mantenedores', label: 'Panel de Mantenedores'/);
    const grupo = menu.slice(menu.indexOf("id: 'mantenedores'"), menu.indexOf("id: 'administracion'"));
    assert.doesNotMatch(grupo, /\/categorias-egreso|\/configuracion\/umbral/);
  });

  await t.test('el panel presenta las siete categorías definidas', () => {
    for (const categoria of ['Comercial', 'Clientes y pagos', 'Proveedores y egresos', 'Remuneraciones', 'Finanzas', 'Crédito', 'Auditoría']) {
      assert.match(panel, new RegExp(`nombre: '${categoria}'`));
    }
  });

  await t.test('las tarjetas disponibles apuntan sólo a rutas existentes', () => {
    const rutas = [...panel.matchAll(/estado: 'DISPONIBLE'[^\n]+ruta: '([^']+)'/g)].map((coincidencia) => coincidencia[1]);
    assert.ok(rutas.length >= 8);
    for (const ruta of new Set(rutas)) {
      const relativa = ruta.replace(/^\//, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      assert.match(app, new RegExp(`path="${relativa}"`), `Falta ruta React para ${ruta}`);
    }
  });

  await t.test('las funcionalidades futuras no tienen rutas ni acciones falsas', () => {
    for (const linea of panel.split('\n').filter((item) => /estado: '(?:EN DESARROLLO|PENDIENTE DE DEFINICIÓN)'/.test(item))) {
      assert.doesNotMatch(linea, /ruta:/);
    }
    assert.match(panel, /Sin acción operativa en este bloque/);
  });

  await t.test('las acciones disponibles se convierten en restringidas sin permiso', () => {
    assert.match(panel, /permisos\.some\(\(permiso\) => sesion\?\.permisos\.includes\(permiso\)\)/);
    assert.match(panel, /tarjeta\.estado === 'DISPONIBLE' && !permitido \? 'RESTRINGIDO'/);
    assert.match(panel, /estado === 'RESTRINGIDO' \? 'Acceso no habilitado para tu cuenta'/);
  });

  await t.test('CU268 puede abrir la pantalla que ya contiene el límite global', () => {
    assert.match(app, /\['CU167','CU168','CU169','CU170','CU171','CU246','CU268'\]/);
    assert.match(panel, /nombre: 'Límite global de crédito'[^\n]+ruta: '\/parametros-remuneraciones'[^\n]+permisos: \['CU268'\]/);
  });

  await t.test('las rutas antiguas continúan registradas', () => {
    for (const ruta of ['categorias-egreso', 'configuracion/umbral', 'esquemas-remuneracionales', 'parametros-remuneraciones', 'dashboard-m7/control', 'cuentas-por-pagar']) {
      assert.match(app, new RegExp(`path="${ruta.replace('/', '\\/')}"`));
    }
  });

  await t.test('el panel es sólo navegación y no ejecuta lógica financiera', () => {
    assert.doesNotMatch(panel, /solicitarFinanzas|operar\(|fetch\(|axios|margen_esperado|monto_total|Prisma/);
    assert.match(panel, /<Link/);
  });

  await t.test('la grilla incorpora cortes responsive y evita overflow horizontal', () => {
    assert.match(panel, /sm:grid-cols-2 xl:grid-cols-3/);
    assert.match(panel, /px-4 py-6 sm:px-6 lg:px-8/);
    assert.match(menu, /w-\[min\(18rem,calc\(100vw-3rem\)\)\]/);
  });
});
