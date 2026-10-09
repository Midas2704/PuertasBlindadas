const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { prisma } = require('../dist/db');
const { M7Controller } = require('../dist/controladores/M7Controller');

const ids = { clientes: [], fichas: [], items: [], cotizaciones: [], detalles: [], notas: [] };
const consulta = { anio: 2055, mes: 5 };

async function preparar() {
  const [tipoCliente, clp, usd] = await Promise.all([
    prisma.tipo_cliente_financiero.findFirstOrThrow({ where: { estado_tipo_cliente_financiero: 'activo' } }),
    prisma.moneda.findUniqueOrThrow({ where: { codigo_moneda: 'CLP' } }),
    prisma.moneda.findUniqueOrThrow({ where: { codigo_moneda: 'USD' } }),
  ]);
  const marca = randomUUID().replaceAll('-', '').slice(0, 12);
  const cliente = await prisma.cliente_financiero.create({
    data: {
      id_tipo_cliente_financiero: tipoCliente.id_tipo_cliente_financiero,
      rut_cliente: `FAM${marca}`,
      nombre_razon_social_referencia: `Cliente modelos M7 ${marca}`,
      estado_financiero: 'activo',
      ficha_cliente: { create: {} },
    },
    include: { ficha_cliente: true },
  });
  ids.clientes.push(cliente.id_cliente_financiero);
  ids.fichas.push(cliente.ficha_cliente.id_ficha_cliente);

  for (const nombre_item of [`Puerta Strong ${marca}`, `Puerta Bunker ${marca}`]) {
    const item = await prisma.item_comercial.create({ data: { nombre_item, tipo_item: 'puerta', estado_item: 'activo' } });
    ids.items.push(item.id_item_comercial);
  }

  const crearVenta = async ({ moneda, neto, cambio, subtotales, estado = 'confirmada' }) => {
    const cotizacion = await prisma.cotizacion.create({
      data: {
        id_ficha_cliente: cliente.ficha_cliente.id_ficha_cliente,
        id_moneda: moneda.id_moneda,
        fecha_emision: new Date('2055-05-03T00:00:00Z'),
        fecha_vigencia: new Date('2055-06-30T00:00:00Z'),
        monto_neto: subtotales.reduce((total, monto) => total + monto, 0),
        monto_total_estimado: subtotales.reduce((total, monto) => total + monto, 0),
        estado_cotizacion: 'aprobada',
      },
    });
    ids.cotizaciones.push(cotizacion.id_cotizacion);
    for (const [indice, subtotal] of subtotales.entries()) {
      const detalle = await prisma.detalle_cotizacion.create({
        data: {
          id_cotizacion: cotizacion.id_cotizacion,
          id_item_comercial: ids.items[indice % ids.items.length],
          cantidad_item: 1,
          subtotal_item_estimado: subtotal,
        },
      });
      ids.detalles.push(detalle.id_detalle_cotizacion);
    }
    const nota = await prisma.nota_venta.create({
      data: {
        id_ficha_cliente: cliente.ficha_cliente.id_ficha_cliente,
        id_cotizacion: cotizacion.id_cotizacion,
        id_moneda: moneda.id_moneda,
        numero_nota_venta: `M7-FAM-${randomUUID()}`,
        fecha_emision: new Date('2055-05-10T00:00:00Z'),
        fecha_vencimiento: new Date('2055-06-10T00:00:00Z'),
        monto_neto: neto,
        monto_total: neto,
        tipo_cambio_usado: cambio,
        estado_nota_venta: estado,
        exento_iva: true,
      },
    });
    ids.notas.push(nota.id_nota_venta);
  };

  await crearVenta({ moneda: clp, neto: 80, cambio: null, subtotales: [60, 40] });
  await crearVenta({ moneda: usd, neto: 100, cambio: 900, subtotales: [50, 50] });
  await crearVenta({ moneda: usd, neto: 200, cambio: null, subtotales: [100, 100] });
  await crearVenta({ moneda: clp, neto: 999, cambio: null, subtotales: [999], estado: 'anulada' });
}

after(async () => {
  await prisma.nota_venta.deleteMany({ where: { id_nota_venta: { in: ids.notas } } });
  await prisma.detalle_cotizacion.deleteMany({ where: { id_detalle_cotizacion: { in: ids.detalles } } });
  await prisma.cotizacion.deleteMany({ where: { id_cotizacion: { in: ids.cotizaciones } } });
  await prisma.item_comercial.deleteMany({ where: { id_item_comercial: { in: ids.items } } });
  await prisma.ficha_cliente.deleteMany({ where: { id_ficha_cliente: { in: ids.fichas } } });
  await prisma.cliente_financiero.deleteMany({ where: { id_cliente_financiero: { in: ids.clientes } } });
  await prisma.$disconnect();
});

test('M7 ventas por modelo y navegación segura', async t => {
  await preparar();
  const modulo = new M7Controller();
  const ventas = await modulo.consultarAnalisisVentas(consulta, ['CU220']);

  await t.test('usa nombre estructurado del ítem comercial como modelo', () => {
    assert.equal(ventas.ventasPorFamilia.valor.length, 2);
    assert.ok(ventas.ventasPorFamilia.valor.every(fila => /^Puerta (Strong|Bunker)/.test(fila.familia)));
    assert.ok(ventas.ventasPorFamilia.valor.every(fila => fila.familia !== 'puerta'));
  });
  await t.test('prorratea el neto definitivo y consolida con tipo de cambio histórico', () => {
    const total = ventas.ventasPorFamilia.valor.reduce((suma, fila) => suma + fila.montoClp, 0);
    assert.equal(total, 90080);
    assert.deepEqual(ventas.ventasPorFamilia.valor.map(fila => fila.montoClp).sort((a, b) => b - a), [45048, 45032]);
    assert.equal(Number(ventas.ventasPorFamilia.valor.reduce((suma, fila) => suma + fila.participacionPorcentual, 0).toFixed(2)), 100);
  });
  await t.test('excluye sin conversión y estados no definitivos con cobertura explícita', () => {
    assert.equal(ventas.ventasPorFamilia.estado, 'PARCIALMENTE_DISPONIBLE');
    assert.match(ventas.ventasPorFamilia.detalle, /1 sin tipo de cambio histórico válido/);
    assert.doesNotMatch(ventas.ventasPorFamilia.detalle, /999/);
  });
  await t.test('CU220 expone modelos sin conceder indicadores CU219', () => {
    assert.ok(Object.hasOwn(ventas, 'ventasPorFamilia'));
    assert.equal(Object.hasOwn(ventas, 'ticketMedio'), false);
  });
  await t.test('CU219 no expone la distribución reservada a CU220', async () => {
    const soloValor = await modulo.consultarAnalisisVentas(consulta, ['CU219']);
    assert.equal(Object.hasOwn(soloValor, 'ventasPorFamilia'), false);
  });
  await t.test('sin ventas devuelve estado vacío explícito', async () => {
    const vacio = await modulo.consultarAnalisisVentas({ anio: 2199, mes: 1 }, ['CU220']);
    assert.equal(vacio.ventasPorFamilia.estado, 'SIN_RESULTADOS');
    assert.deepEqual(vacio.ventasPorFamilia.valor, []);
  });
  await t.test('fuente no disponible no fabrica categorías ni ceros', async () => {
    const consultarOriginal = prisma.nota_venta.findMany;
    prisma.nota_venta.findMany = async () => { throw new Error('fuente fuera de servicio'); };
    try {
      const sinFuente = await modulo.consultarAnalisisVentas(consulta, ['CU220']);
      assert.equal(sinFuente.ventasPorFamilia.estado, 'FUENTE_NO_DISPONIBLE');
      assert.equal(sinFuente.ventasPorFamilia.valor, null);
    } finally {
      prisma.nota_venta.findMany = consultarOriginal;
    }
  });

  const app = readFileSync(resolve('../Vistas/src/App.tsx'), 'utf8');
  const ordenes = readFileSync(resolve('../Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx'), 'utf8');
  const backend = readFileSync(resolve('src/controladores/M7Controller.ts'), 'utf8');
  const panel = readFileSync(resolve('../Vistas/src/views/DashboardM7/PanelGeneralM7.tsx'), 'utf8');
  await t.test('detalle de orden de compra tiene ruta protegida y carga directa', () => {
    assert.match(app, /path="ordenes-compra-servicios\/:id"[^\n]+permiso="CU88"/);
    assert.match(ordenes, /useParams/);
    assert.match(ordenes, /respuestaJson\(`\/ordenes-compra-servicios\/\$\{idOrden\}`\)/);
    assert.match(ordenes, /navigate\('\/ordenes-compra-servicios', \{ replace: true \}\)/);
  });
  await t.test('acciones owner se entregan sólo con permiso del destino', () => {
    assert.match(backend, /permisos\.includes\('CU20'\)/);
    assert.match(backend, /permisos\.includes\('CU09'\)/);
    assert.match(backend, /permisos\.includes\('CU88'\)/);
    assert.match(backend, /permisos\.includes\('CU237'\)/);
  });
  await t.test('panel no ofrece resúmenes sin CU238 o CU239', () => {
    assert.match(panel, /puedeVerResumenes/);
    assert.match(panel, /permiso === 'CU238' \|\| permiso === 'CU239'/);
  });
  await t.test('los destinos owner relevantes usados por M7 tienen una ruta React', () => {
    for (const patron of [
      /path="clientes\/:rut"/,
      /path="proveedores\/:id"/,
      /path="cuentas-por-pagar"/,
      /path="pagos"/,
      /path="pagos-proveedores"/,
      /path="caja-chica"/,
      /path="pagos-remuneraciones"/,
      /path="terreno\/visitas"/,
      /path="terreno\/mis-tareas"/,
      /path="ordenes-compra-servicios\/:id"/,
      /path="dashboard-m7\/ventas"/,
      /path="dashboard-m7\/cuentas-cobrar"/,
      /path="dashboard-m7\/cuentas-pagar"/,
      /path="dashboard-m7\/liquidez"/,
      /path="dashboard-m7\/proyectos\/:id"/,
    ]) assert.match(app, patron);
  });
});
