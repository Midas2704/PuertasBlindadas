const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { prisma } = require('../dist/db');
const { M6Controller } = require('../dist/controladores/M6Controller');
const { M7Controller } = require('../dist/controladores/M7Controller');
const { operacionesPermiso, permiteOperacion } = require('../dist/validaciones/permisos');

test('UI selectores de incidencias y liquidez conservan FK y permisos', async t => {
  const marca = randomUUID().slice(0, 8); const m6 = new M6Controller(); const m7 = new M7Controller();
  const ids = { usuarios: [], clientes: [], proyectos: [], ordenes: [], tareas: [], ejecuciones: [], incidencias: [] };
  const usuario = await prisma.usuario.create({ data: { usuario_username: `ui_${marca}` } }); ids.usuarios.push(usuario.usuario_id_usuario);
  const categoria = await prisma.categoria_incidencia_terreno.findFirstOrThrow({ where: { activa: true } });
  const crearCadena = async sufijo => {
    const rut = `${marca.slice(0, 6)}-${sufijo}`; const cliente = await prisma.cliente.create({ data: { cliente_cliente_rut: rut, cliente_razon_social: `Cliente ${sufijo} ${marca}` } }); ids.clientes.push(rut);
    const proyecto = await prisma.proyecto.create({ data: { proyecto_codigo_proyecto: `P-${marca}-${sufijo}`, proyecto_nombre_referencia: `Proyecto ${sufijo}`, rut_cliente: rut } }); ids.proyectos.push(proyecto.proyecto_proyecto_id);
    const orden = await prisma.orden_trabajo.create({ data: { proyecto_id_proyecto: proyecto.proyecto_proyecto_id, orden_trabajo_estado: 'en_progreso' } }); ids.ordenes.push(orden.orden_trabajo_id_orden);
    const tarea = await prisma.tarea.create({ data: { tarea_titulo: `Tarea ${sufijo}`, id_orden_trabajo: orden.orden_trabajo_id_orden } }); ids.tareas.push(tarea.tarea_tarea_id);
    const ejecucion = await prisma.ejecucion_tarea.create({ data: { id_tarea: tarea.tarea_tarea_id, id_usuario_ejecutor: usuario.usuario_id_usuario, fecha_ejecucion: new Date(), estado_ejecucion: 'terminada' } }); ids.ejecuciones.push(ejecucion.id_ejecucion_tarea);
    return { rut, orden, tarea, ejecucion };
  };
  const a = await crearCadena('A'); const b = await crearCadena('B');
  try {
    await t.test('01 catálogo carga clientes reconocibles', async () => { const r = await m6.catalogosIncidenciaOperativa({ busqueda: marca }); assert.equal(r.clientes.length, 2); assert.ok(r.clientes.every(cliente => cliente.etiqueta.includes('Cliente'))); });
    await t.test('02 filtro de cliente limita órdenes', async () => { const r = await m6.catalogosIncidenciaOperativa({ clienteRut: a.rut }); assert.ok(r.ordenes.length > 0); assert.ok(r.ordenes.every(orden => orden.idOrdenTrabajo === a.orden.orden_trabajo_id_orden.toString())); });
    await t.test('03 selector conserva FK de ejecución real', async () => { const r = await m6.catalogosIncidenciaOperativa({ clienteRut: a.rut }); assert.equal(r.ordenes[0].idEjecucion, a.ejecucion.id_ejecucion_tarea.toString()); });
    await t.test('04 cliente sin coincidencias entrega lista vacía', async () => { const r = await m6.catalogosIncidenciaOperativa({ busqueda: `ausente-${marca}` }); assert.deepEqual(r.clientes, []); });
    await t.test('05 registra combinación cliente OT válida', async () => { const r = await m6.registrarIncidenciaRetrabajo(Number(a.ejecucion.id_ejecucion_tarea), { descripcion: 'Incidencia selector', idCategoria: categoria.id_categoria_incidencia, clienteRut: a.rut, idOrdenTrabajo: a.orden.orden_trabajo_id_orden.toString() }, { id: usuario.usuario_id_usuario, permisos: ['CU212'] }); ids.incidencias.push(BigInt(r.id)); assert.equal(r.idEjecucion, a.ejecucion.id_ejecucion_tarea.toString()); });
    await t.test('06 rechaza OT de otro cliente', async () => { await assert.rejects(m6.registrarIncidenciaRetrabajo(Number(a.ejecucion.id_ejecucion_tarea), { descripcion: 'Inválida', idCategoria: categoria.id_categoria_incidencia, clienteRut: b.rut, idOrdenTrabajo: b.orden.orden_trabajo_id_orden.toString() }, { id: usuario.usuario_id_usuario, permisos: ['CU212'] }), error => error.estado === 409); });
    await t.test('07 rechaza contexto incompleto', async () => { await assert.rejects(m6.registrarIncidenciaRetrabajo(Number(a.ejecucion.id_ejecucion_tarea), { descripcion: 'Inválida', idCategoria: categoria.id_categoria_incidencia, clienteRut: a.rut }, { id: usuario.usuario_id_usuario, permisos: ['CU212'] }), error => error.estado === 400); });
    await t.test('08 conserva compatibilidad de incidencia sin OT explícita', async () => { const r = await m6.registrarIncidenciaRetrabajo(Number(b.ejecucion.id_ejecucion_tarea), { descripcion: 'Compatibilidad', idCategoria: categoria.id_categoria_incidencia }, { id: usuario.usuario_id_usuario, permisos: ['CU212'] }); ids.incidencias.push(BigInt(r.id)); assert.equal(r.idEjecucion, b.ejecucion.id_ejecucion_tarea.toString()); });
    await t.test('09 catálogo de ajuste usa naturalezas reales', async () => { const r = await m7.consultarCatalogosAjusteLiquidez(); assert.deepEqual(r.naturalezas.map(item => item.valor), ['entrada', 'salida']); });
    await t.test('10 catálogo de moneda sólo expone activas', async () => { const r = await m7.consultarCatalogosAjusteLiquidez(); assert.ok(r.monedas.every(moneda => moneda.id > 0 && moneda.codigo && moneda.nombre)); });
    await t.test('11 catálogo de ajuste conserva CU228', () => { assert.equal(operacionesPermiso.consultarCatalogosAjusteLiquidezM7, 'CU228'); assert.equal(permiteOperacion('consultarCatalogosAjusteLiquidezM7', ['CU228']), true); });
    await t.test('12 CU212 protege catálogo y registro de incidencias', () => { assert.equal(operacionesPermiso.catalogosIncidenciaOperativa, 'CU212'); assert.equal(operacionesPermiso.registrarIncidenciaRetrabajo, 'CU212'); });
  } finally {
    await prisma.incidencia_retrabajo_tarea.deleteMany({ where: { id_incidencia_retrabajo: { in: ids.incidencias } } });
    await prisma.ejecucion_tarea.deleteMany({ where: { id_ejecucion_tarea: { in: ids.ejecuciones } } });
    await prisma.tarea.deleteMany({ where: { tarea_tarea_id: { in: ids.tareas } } });
    await prisma.orden_trabajo.deleteMany({ where: { orden_trabajo_id_orden: { in: ids.ordenes } } });
    await prisma.proyecto.deleteMany({ where: { proyecto_proyecto_id: { in: ids.proyectos } } });
    await prisma.cliente.deleteMany({ where: { cliente_cliente_rut: { in: ids.clientes } } });
    await prisma.usuario.deleteMany({ where: { usuario_id_usuario: { in: ids.usuarios } } });
  }
});
