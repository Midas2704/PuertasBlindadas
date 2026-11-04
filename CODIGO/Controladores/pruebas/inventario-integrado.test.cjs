const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { MInventarioController } = require('../dist/controladores/MInventarioController');

const decimal = valor => ({ toString: () => String(valor) });

test('Inventario integrado consolida stock físico, reservado y disponible sin escribir datos', async () => {
  const db = {
    material: { count: async () => 2 }, bodega: { count: async () => 1 },
    inventario_bodega: { findMany: async () => [
      { inventario_bodega_cantidad_fisica: decimal('12.5'), inventario_bodega_cantidad_reservada: decimal('2.25') },
      { inventario_bodega_cantidad_fisica: decimal('7.5'), inventario_bodega_cantidad_reservada: decimal('1.75') },
    ] },
    movimiento_inventario: { count: async () => 8 }, reserva_inventario: { count: async () => 3 }, alerta_inventario: { count: async () => 4 },
  };
  const salida = await new MInventarioController(db).consultarResumen();
  assert.deepEqual(salida, { materiales:2, bodegas:1, movimientos:8, reservasActivas:3, alertasActivas:4, stockFisico:20, stockReservado:4, stockDisponible:16 });
});

test('Inventario integrado pagina materiales y calcula disponibilidad por lote', async () => {
  const db = { material: {
    count: async ({where}) => { assert.equal(where.OR.length,3); return 1; },
    findMany: async ({skip,take}) => { assert.equal(skip,0); assert.equal(take,25); return [{
      material_sku:'MAT-01', material_nombre_material:'Acero', material_descripcion:'Plancha', material_estado:'activo', material_material_critico:true,
      material_stock_minimo:decimal(2), material_sotck_maximo:decimal(20), material_unidad_medida:{material_unidad_medida_nombre:'unidad'}, material_categoria_general:{material_categoria_general_nombre:'Metales'},
      inventario_bodega:[{inventario_bodega_cantidad_fisica:decimal(10),inventario_bodega_cantidad_reservada:decimal(3)}],
    }]; },
  }};
  const salida = await new MInventarioController(db).listarMateriales({busqueda:'acero'});
  assert.equal(salida.items[0].stockDisponible,7);
  assert.equal(salida.items[0].critico,true);
});

test('rutas y permisos de Inventario quedan limitados a CU14/CU15', () => {
  const permisos=readFileSync('src/validaciones/permisos.ts','utf8');
  const rutas=readFileSync('src/rutas/finanzas.ts','utf8');
  assert.match(permisos,/listarMaterialesInventario:'CU14'/);
  assert.match(permisos,/listarMovimientosInventario:'CU15'/);
  assert.match(rutas,/\/inventario\/materiales/);
  assert.match(rutas,/\/inventario\/movimientos/);
  assert.doesNotMatch(rutas,/post\('\/inventario\/(?:materiales|movimientos|reservas|alertas)/i);
});
