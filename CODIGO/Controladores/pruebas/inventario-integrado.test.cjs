const test = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { MInventarioController } = require('../dist/controladores/MInventarioController');

const decimal = valor => ({ toString: () => String(valor) });
const unidad = (id, nombre) => ({
  material_unidad_medida_id_medida: id === null ? null : BigInt(id),
  material_unidad_medida: id === null ? null : { material_unidad_medida_nombre: nombre },
});

test('resumen separa unidades incompatibles y conserva precisión decimal', async () => {
  const db = {
    material: { count: async () => 3 }, bodega: { count: async () => 2 },
    inventario_bodega: { findMany: async () => [
      { material_sku:'MAT-U1', ...stock('0.1001','0.0001'), material:unidad(1,'unidad') },
      { material_sku:'MAT-U2', ...stock('0.2002','0.1001'), material:unidad(1,'unidad') },
      { material_sku:'MAT-M1', ...stock('15.5555','5.1111'), material:unidad(2,'metro') },
    ] },
    movimiento_inventario: { count: async () => 8 }, reserva_inventario: { count: async () => 3 }, alerta_inventario: { count: async () => 4 },
  };
  const salida = await new MInventarioController(db).consultarResumen();
  assert.equal(salida.existenciasPorUnidad.length,2);
  assert.deepEqual(salida.existenciasPorUnidad[0],{unidadId:'1',unidad:'unidad',materialSinUnidad:null,materiales:2,stockFisico:'0.3003',stockReservado:'0.1002',stockDisponible:'0.2001'});
  assert.deepEqual(salida.existenciasPorUnidad[1],{unidadId:'2',unidad:'metro',materialSinUnidad:null,materiales:1,stockFisico:'15.5555',stockReservado:'5.1111',stockDisponible:'10.4444'});
  assert.equal('stockFisico' in salida,false,'no debe existir un total global entre unidades incompatibles');
});

test('material sin unidad acreditada no se mezcla con otro material', async () => {
  const db = resumenDb([
    { material_sku:'SIN-01',...stock(2,0),material:unidad(null,null) },
    { material_sku:'SIN-02',...stock(3,1),material:unidad(null,null) },
  ]);
  const salida=await new MInventarioController(db).consultarResumen();
  assert.deepEqual(salida.existenciasPorUnidad.map(x=>[x.materialSinUnidad,x.stockDisponible]),[['SIN-01','2'],['SIN-02','2']]);
});

test('lista materiales pagina, busca y calcula disponibilidad sin Number', async () => {
  const db = { material: {
    count: async ({where}) => { assert.equal(where.OR.length,3); return 1; },
    findMany: async ({skip,take}) => { assert.equal(skip,25); assert.equal(take,25); return [materialFila()]; },
  }};
  const salida = await new MInventarioController(db).listarMateriales({busqueda:'acero',pagina:2});
  assert.equal(salida.items[0].stockDisponible,'7.0003');
  assert.equal(salida.items[0].stockFisico,'10.0004');
  assert.equal(salida.items[0].critico,true);
});

test('detalle conserva existencias por bodega y lote, incluido disponible cero', async () => {
  const fila=materialFila();
  fila.material_categoria_funcional={material_categoria_funcional_nombre:'Estructural'};
  fila.material_presentacion=null; fila.material_stock_critico=decimal(1); fila.material_codigo_barras=[];
  fila.inventario_bodega=[
    {bodega_id_bodega:1n,lote_id_lote:11n,bodega:{bodega_nombre_bodega:'Central'},lote:{lote_numero_lote:'L-1'},...stock('5.5','5.5')},
    {bodega_id_bodega:2n,lote_id_lote:12n,bodega:{bodega_nombre_bodega:'Norte'},lote:{lote_numero_lote:'L-2'},...stock('4.5004','1.5')},
  ];
  const salida=await new MInventarioController({material:{findUnique:async()=>fila}}).obtenerMaterial('MAT-01');
  assert.deepEqual(salida.existencias.map(x=>[x.bodega,x.lote,x.disponible]),[['Central','L-1','0'],['Norte','L-2','3.0004']]);
  await assert.rejects(()=>new MInventarioController({material:{findUnique:async()=>null}}).obtenerMaterial('NO-EXISTE'),/Material no encontrado/);
});

test('bodegas separan existencias por unidad y no crean total engañoso', async () => {
  const filas=[{bodega_id_bodega:1n,bodega_nombre_bodega:'Central',bodega_direccion:null,bodega_estado:'activa',_count:{anaquel:2},inventario_bodega:[
    {material_sku:'U',...stock(4,1),material:unidad(1,'unidad')},
    {material_sku:'M',...stock(7,2),material:unidad(2,'metro')},
  ]}];
  const salida=await new MInventarioController({bodega:{findMany:async()=>filas}}).listarBodegas();
  assert.equal(salida[0].existenciasPorUnidad.length,2);
  assert.equal('stockFisico' in salida[0],false);
});

test('movimientos, reservas y alertas conservan paginación y datos incompletos', async () => {
  const db={
    movimiento_inventario:{count:async()=>1,findMany:async()=>[{movimiento_inventario_id_movimiento:1n,movimiento_inventario_fecha_hora:null,movimiento_inventario_cantidad:decimal('1.2500'),movimiento_inventario_estado:null,material_sku:'M',material:null,bodega:null,movimiento_inventario_tipo_movimiento:null,movimiento_inventario_motivo_movimiento:null}]},
    reserva_inventario:{count:async()=>1,findMany:async()=>[{reserva_inventario_id_reserva:2n,reserva_inventario_fecha_reserva:null,reserva_inventario_fecha_liberacion:null,reserva_inventario_cantidad_reservada:decimal('0.5000'),reserva_inventario_estado_reserva:null,material_sku:'M',material:null,proyecto_id_proyecto:null,orden_trabajo_id_orden:null}]},
    alerta_inventario:{count:async()=>1,findMany:async()=>[{alerta_inventario_id_alerta:3n,alerta_inventario_fecha_generacion:null,alerta_inventario_fecha_est_agotamiento:null,alerta_inventario_mensaje:null,alerta_inventario_estado:null,historial_alerta_id_historial:null,historial_alerta:null,material_sku:'M',material:null,alerta_inventario_tipo_alerta:null}]},
  };
  const controlador=new MInventarioController(db);
  assert.equal((await controlador.listarMovimientos()).items[0].cantidad,'1.25');
  assert.equal((await controlador.listarReservas()).items[0].cantidad,'0.5');
  assert.equal((await controlador.listarAlertas()).items[0].resuelta,false);
});

test('listas vacías y errores de base se propagan sin fabricar datos', async () => {
  const vacio={movimiento_inventario:{count:async()=>0,findMany:async()=>[]}};
  assert.deepEqual((await new MInventarioController(vacio).listarMovimientos()).items,[]);
  const error=new Error('BD no disponible');
  await assert.rejects(()=>new MInventarioController({movimiento_inventario:{count:async()=>{throw error},findMany:async()=>[]}}).listarMovimientos(),/BD no disponible/);
});

test('consultas conservan CU14/CU15 y escrituras usan capacidades operacionales separadas', () => {
  const permisos=readFileSync('src/validaciones/permisos.ts','utf8');
  const rutas=readFileSync('src/rutas/finanzas.ts','utf8');
  const propuesta=readFileSync('prisma/migrations/078_propuesta_permisos_operacionales_inventario/migration.sql','utf8');
  assert.match(permisos,/listarMaterialesInventario:'CU14'/);
  assert.match(permisos,/obtenerMaterialInventario:'CU14'/);
  for(const operacion of ['consultarResumenInventario','listarBodegasInventario','listarMovimientosInventario','listarReservasInventario','listarAlertasInventario']) assert.match(permisos,new RegExp(`${operacion}:'CU15'`));
  for(const ruta of ['entradas','salidas','reservas','ajustes']) assert.match(rutas,new RegExp(`post\\('/inventario/${ruta}`));
  for(const [operacion,cu] of Object.entries({registrarEntradaInventario:'CU466',registrarSalidaInventario:'CU467',crearReservaInventario:'CU468',liberarReservaInventario:'CU469',ajustarExistenciaInventario:'CU470'})) assert.match(permisos,new RegExp(`${operacion}:'${cu}'`));
  assert.match(propuesta,/activo_m4[^;]*FALSE/is);
  assert.doesNotMatch(propuesta,/INSERT INTO "comun"\."(?:usuario_permiso_particular|perfil_permiso)"/i);
});

function stock(fisico,reservado){return{inventario_bodega_cantidad_fisica:decimal(fisico),inventario_bodega_cantidad_reservada:decimal(reservado)}}
function resumenDb(existencias){return{material:{count:async()=>existencias.length},bodega:{count:async()=>1},inventario_bodega:{findMany:async()=>existencias},movimiento_inventario:{count:async()=>0},reserva_inventario:{count:async()=>0},alerta_inventario:{count:async()=>0}}}
function materialFila(){return{material_sku:'MAT-01',material_nombre_material:'Acero',material_descripcion:'Plancha',material_estado:'activo',material_material_critico:true,material_stock_minimo:decimal(2),material_sotck_maximo:decimal(20),material_unidad_medida:{material_unidad_medida_nombre:'unidad'},material_categoria_general:{material_categoria_general_nombre:'Metales'},inventario_bodega:[stock('10.0004','3.0001')]}}
