const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  CATALOGO_MINIMO,
  PREFIJO_SEED_MINIMA,
  prioridadesDesdeAuditoria,
  validarDefinicionCatalogoMinimo,
} = require('../dist/administracion/seedMinimaOperativa.js');

test('la definición mínima es acotada, identificable y no contiene normativa inventada', () => {
  assert.equal(validarDefinicionCatalogoMinimo(), true);
  assert.equal(CATALOGO_MINIMO.productos.length, 4);
  assert.equal(CATALOGO_MINIMO.opcionales.length, 3);
  assert.equal(CATALOGO_MINIMO.servicios.length, 2);
  const serializado = JSON.stringify(CATALOGO_MINIMO);
  assert.match(serializado, /DEMO-CAT-/);
  assert.doesNotMatch(serializado, /UF|UTM|AFP_COTIZACION|RETENCION_HONORARIOS|TRAMO_IMPUESTO/);
  for (const producto of CATALOGO_MINIMO.productos) {
    assert.ok(producto.codigo.startsWith(PREFIJO_SEED_MINIMA));
    assert.ok(Number(producto.precioB2b) > 0);
    assert.ok(Number(producto.precioB2c) > 0);
  }
});

test('la auditoría real prioriza lo vacío y conserva historia ya disponible', () => {
  const prioridades = prioridadesDesdeAuditoria({
    'finanzas.extension_producto_comercial': { total_registros: 0 },
    'finanzas.precio_producto_comercial': { total_registros: 0 },
    'finanzas.opcional_comercial': { total_registros: 0 },
    'finanzas.compatibilidad_opcional_producto': { total_registros: 0 },
    'finanzas.servicio_comercial': { total_registros: 0 },
    'finanzas.precio_servicio_comercial': { total_registros: 0 },
    'finanzas.condicion_comercial': { total_registros: 0 },
    'finanzas.tarifa_instalacion_comercial': { total_registros: 0 },
    'finanzas.categoria_pago': { total_registros: 1 },
    'finanzas.proveedor': { total_registros: 15 },
    'finanzas.prestador_honorarios': { total_registros: 10 },
    'finanzas.boleta_honorarios': { total_registros: 125 },
    'finanzas.esquema_remuneracional': { total_registros: 7 },
    'finanzas.parametro_remuneracional': { total_registros: 27 },
    'inventario.material': { total_registros: 30 },
    'inventario.bodega': { total_registros: 1 },
    'inventario.material_unidad_medida': { total_registros: 0 },
    'inventario.material_categoria_general': { total_registros: 0 },
  });
  assert.equal(prioridades.find(x => x.catalogo.startsWith('Productos')).estado, 'COMPLETAR');
  assert.equal(prioridades.find(x => x.catalogo === 'Honorarios').estado, 'CONSERVAR');
  assert.equal(prioridades.find(x => x.catalogo.startsWith('Remuneraciones')).estado, 'CONSERVAR_SIN_MODIFICAR_NORMATIVA');
  assert.equal(prioridades.find(x => x.catalogo === 'Unidades y categorías').estado, 'COMPLETAR');
});

test('la segunda evaluación de un catálogo ya completo no propone recrearlo', () => {
  const completos = Object.fromEntries([
    'finanzas.extension_producto_comercial','finanzas.precio_producto_comercial','finanzas.opcional_comercial',
    'finanzas.compatibilidad_opcional_producto','finanzas.servicio_comercial','finanzas.precio_servicio_comercial',
    'finanzas.condicion_comercial','finanzas.tarifa_instalacion_comercial','finanzas.categoria_pago',
    'finanzas.proveedor','finanzas.prestador_honorarios','finanzas.boleta_honorarios','finanzas.esquema_remuneracional',
    'finanzas.parametro_remuneracional','inventario.material','inventario.bodega','inventario.material_unidad_medida',
    'inventario.material_categoria_general',
  ].map(nombre => [nombre, { total_registros: nombre === 'finanzas.categoria_pago' ? 3 : 1 }]));
  const prioridades = prioridadesDesdeAuditoria(completos);
  assert.equal(prioridades.filter(x => x.estado === 'COMPLETAR').length, 0);
});

test('la implementación no contiene escrituras sobre historia, usuarios o permisos', () => {
  const fuente = fs.readFileSync(path.join(__dirname, '..', 'src', 'administracion', 'seedMinimaOperativa.ts'), 'utf8');
  assert.doesNotMatch(fuente, /\.(cotizacion|nota_venta|pago_cliente|usuario|permiso)\.(create|update|upsert|delete|createMany|updateMany|deleteMany)\s*\(/);
  assert.doesNotMatch(fuente, /sembrarM4|seed-m4/);
  assert.doesNotMatch(fuente, /TRUNCATE|migrate reset|force-reset/i);
  assert.match(fuente, /conteosProtegidos/);
  assert.match(fuente, /TransactionIsolationLevel\.Serializable/);
  assert.doesNotMatch(fuente, /FROM finanzas\._prisma_migrations/);
  assert.match(fuente, /pg_catalog\.pg_namespace/);
});

test('la integración real queda disponible sólo para una copia PostgreSQL explícita', { skip: !process.env.SEED_MINIMA_TEST_DATABASE_URL }, () => {
  const entorno = {
    ...process.env,
    DATABASE_URL: process.env.SEED_MINIMA_TEST_DATABASE_URL,
    NODE_ENV: 'test',
    SEED_MINIMA_OPERATIVA_AUTORIZADA: 'SI',
    SEED_MINIMA_OPERATIVA_BASE: process.env.SEED_MINIMA_TEST_DATABASE_NAME,
    SEED_MINIMA_OPERATIVA_RESPALDO_VERIFICADO: process.env.SEED_MINIMA_TEST_BACKUP_NAME,
  };
  const ejecutar = modo => {
    const resultado = spawnSync(process.execPath, ['dist/administracion/seedMinimaOperativaCli.js', modo], {
      cwd: path.join(__dirname, '..'),
      env: entorno,
      encoding: 'utf8',
    });
    assert.equal(resultado.status, 0, resultado.stderr || resultado.stdout);
    return JSON.parse(resultado.stdout);
  };
  const primera = ejecutar('apply');
  const segunda = ejecutar('apply');
  assert.ok(primera.creados >= 0);
  assert.equal(segunda.creados, 0);
  assert.equal(ejecutar('verify').estado, 'OK');
});
