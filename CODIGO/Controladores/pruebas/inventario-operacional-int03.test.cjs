const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const servicio=readFileSync(resolve('src/inventario/ServicioOperacionalInventario.ts'),'utf8');
const schema=readFileSync(resolve('prisma/schema.prisma'),'utf8');
const sql=readFileSync(resolve('prisma/migrations/077_nucleo_operacional_inventario/migration.sql'),'utf8');
const permisos=readFileSync(resolve('src/validaciones/permisos.ts'),'utf8');
const m9=readFileSync(resolve('src/m9/contratoProductor.ts'),'utf8');

test('INT-03 crea un ledger idempotente aditivo sin otorgar permisos M4',()=>{
  assert.match(sql,/CREATE TABLE "inventario"\."operacion_inventario"/);
  assert.match(sql,/UNIQUE \("clave_idempotencia"\)/);
  assert.match(sql,/REFERENCES "comun"\."usuario"/);
  assert.doesNotMatch(sql,/\b(?:DROP\s+(?:TABLE|SCHEMA)|TRUNCATE|DELETE\s+FROM|UPDATE\s+"?\w+"?\s+SET)\b/i);
  assert.doesNotMatch(sql,/INSERT INTO "?comun"?\."?permiso"?/i);
  assert.doesNotMatch(permisos,/registrarEntradaInventario\s*:/);
  assert.doesNotMatch(permisos,/registrarSalidaInventario\s*:/);
});

test('reservas nuevas acreditan bodega y lote conservando históricos nulos',()=>{
  const reserva=schema.match(/^model reserva_inventario \{([\s\S]*?)^\}/m)?.[1]||'';
  assert.match(reserva,/bodega_id_bodega\s+BigInt\?/);
  assert.match(reserva,/lote_id_lote\s+BigInt\?/);
  assert.match(sql,/ubicacion_completa/);
  assert.match(sql,/IS NULL AND "lote_id_lote" IS NULL/);
  assert.match(servicio,/INVENTARIO_RESERVA_UBICACION_INVALIDA/);
  assert.match(servicio,/INVENTARIO_RESERVA_INCONSISTENTE/);
});

test('entradas salidas reservas liberaciones y ajustes usan Decimal y transacción serializable',()=>{
  for(const metodo of ['registrarEntrada','registrarSalida','crearReserva','liberarReserva','ajustarExistencia']) assert.match(servicio,new RegExp(`${metodo}\\(`));
  assert.match(servicio,/Prisma\.TransactionIsolationLevel\.Serializable/);
  assert.match(servicio,/FOR UPDATE/);
  assert.match(servicio,/new Prisma\.Decimal/);
  assert.match(servicio,/P2034/);
  assert.match(servicio,/INVENTARIO_IDEMPOTENCIA_CONFLICTO/);
});

test('salidas y ajustes no consumen reservas sin contrato acreditado',()=>{
  assert.match(servicio,/despues\.lessThan\(reservado\)/);
  assert.match(servicio,/INVENTARIO_STOCK_RESERVADO/);
  assert.match(servicio,/nueva\.lessThan\(reservado\)/);
  assert.match(servicio,/INVENTARIO_AJUSTE_AFECTA_RESERVAS/);
  assert.doesNotMatch(servicio,/cantidad_reservada:\s*\{\s*decrement/);
});

test('las operaciones críticas usan el productor canónico M9 dentro de la transacción',()=>{
  assert.match(servicio,/new ProductorAuditoriaM9\(new M9Controller/);
  assert.match(servicio,/new RepositorioAuditoriaM9Prisma\(tx\)/);
  for(const operacion of ['registrarEntradaInventario','registrarSalidaInventario','crearReservaInventario','liberarReservaInventario','ajustarExistenciaInventario']) {
    assert.match(m9,new RegExp(`${operacion}: \\{ modulo:'INVENTARIO'`));
  }
  assert.doesNotMatch(servicio,/evento_auditoria_m9\.create/);
});

test('la migración no altera Finanzas ni Terreno y mantiene restricciones físicas',()=>{
  assert.doesNotMatch(sql,/ALTER TABLE "(?:finanzas|terreno|comun)"/);
  assert.match(sql,/chk_operacion_inventario_tipo/);
  assert.match(sql,/fk_operacion_inventario_movimiento/);
  assert.match(sql,/fk_operacion_inventario_reserva/);
  assert.match(sql,/ON DELETE RESTRICT/);
});
