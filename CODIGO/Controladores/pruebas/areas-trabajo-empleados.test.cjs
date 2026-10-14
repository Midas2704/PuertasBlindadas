const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { prisma } = require('../dist/db');
const { M6Controller } = require('../dist/controladores/M6Controller');
const { operacionesPermiso } = require('../dist/validaciones/permisos');

function rutValido() {
  const cuerpo = String(Math.floor(Math.random() * 8_000_000) + 1_000_000);
  let suma = 0, multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) { suma += Number(cuerpo[i]) * multiplicador; multiplicador = multiplicador === 7 ? 2 : multiplicador + 1; }
  const resultado = 11 - suma % 11;
  return `${cuerpo}-${resultado === 11 ? '0' : resultado === 10 ? 'K' : resultado}`;
}

test('áreas de trabajo y asignación histórica de empleados', async t => {
  const modulo = new M6Controller();
  const sufijo = randomUUID().slice(0, 8);
  const actor = await prisma.usuario.findFirstOrThrow({ select: { usuario_id_usuario: true } });
  const nombres = [`Área A ${sufijo}`, `Área B ${sufijo}`];
  const empleados = [];
  const areas = [];

  try {
    await t.test('reutiliza el catálogo compartido y conserva las áreas iniciales', async () => {
      const catalogo = await modulo.listarAreasTrabajo();
      for (const nombre of ['Soldadura', 'Carpintería', 'Pintura', 'Terreno']) assert.ok(catalogo.some(area => area.nombre === nombre));
      assert.equal(operacionesPermiso.listarAreasTrabajo, 'CU155');
      assert.equal(operacionesPermiso.crearAreaTrabajo, 'CU157');
      assert.equal(operacionesPermiso.asignarAreaEmpleado, 'CU157');
    });

    await t.test('crea, edita y evita nombres duplicados normalizados', async () => {
      await modulo.crearAreaTrabajo({ nombre: nombres[0], descripcion: 'Primera descripción' });
      await modulo.crearAreaTrabajo({ nombre: nombres[1], descripcion: 'Segunda descripción' });
      let catalogo = await modulo.listarAreasTrabajo();
      areas.push(...catalogo.filter(area => nombres.includes(area.nombre)).map(area => area.id));
      await assert.rejects(modulo.crearAreaTrabajo({ nombre: `  ${nombres[0].toUpperCase()}  ` }), error => error.estado === 409);
      catalogo = await modulo.actualizarAreaTrabajo(BigInt(areas[0]), { descripcion: 'Descripción actualizada' });
      assert.equal(catalogo.find(area => area.id === areas[0]).descripcion, 'Descripción actualizada');
    });

    await t.test('asigna sólo empleados y áreas activas, conserva historial y una vigencia', async () => {
      const empleado = await modulo.crearEmpleado({ rut: rutValido(), nombres: 'Operario', apellidoPaterno: sufijo });
      empleados.push(empleado.id);
      let historial = await modulo.asignarAreaEmpleado(empleado.id, { idArea: areas[0], motivo: 'Asignación inicial' }, actor.usuario_id_usuario);
      assert.equal(historial.length, 1);
      assert.equal(historial[0].area.id, areas[0]);
      historial = await modulo.asignarAreaEmpleado(empleado.id, { idArea: areas[1], motivo: 'Cambio productivo' }, actor.usuario_id_usuario);
      assert.equal(historial.length, 2);
      assert.equal(historial.filter(item => item.vigenciaHasta === null).length, 1);
      assert.equal(historial[0].area.id, areas[1]);
      await assert.rejects(modulo.asignarAreaEmpleado(empleado.id, { idArea: areas[1], motivo: 'Duplicada' }, actor.usuario_id_usuario), error => error.estado === 409);
      const listado = await modulo.listarEmpleados({ area: areas[1], busqueda: sufijo });
      assert.equal(listado.length, 1);
      assert.equal(listado[0].areaActual.id, areas[1]);
      const disponibles = await modulo.listarEmpleadosArea(BigInt(areas[1]));
      assert.ok(disponibles.some(item => item.id === empleado.id));
    });

    await t.test('impide asignaciones nuevas a área o empleado inactivo sin borrar historia', async () => {
      await modulo.cambiarEstadoAreaTrabajo(BigInt(areas[0]), false);
      const empleado = await modulo.crearEmpleado({ rut: rutValido(), nombres: 'Inactivo', apellidoPaterno: sufijo });
      empleados.push(empleado.id);
      await assert.rejects(modulo.asignarAreaEmpleado(empleado.id, { idArea: areas[0], motivo: 'No permitida' }, actor.usuario_id_usuario), error => error.estado === 409);
      await prisma.empleado.update({ where: { id_empleado: empleado.id }, data: { estado_laboral: 'inactivo' } });
      await assert.rejects(modulo.asignarAreaEmpleado(empleado.id, { idArea: areas[1], motivo: 'No permitida' }, actor.usuario_id_usuario), error => error.estado === 409);
      assert.equal((await modulo.obtenerHistorialAreaEmpleado(empleado.id)).length, 0);
    });

    await t.test('constraint impide dos asignaciones vigentes aun fuera del servicio', async () => {
      const idEmpleado = empleados[0];
      await assert.rejects(prisma.asignacion_area_empleado.create({ data: { id_empleado: idEmpleado, id_area_trabajo: BigInt(areas[0]), motivo: 'Intento directo', asignado_por: actor.usuario_id_usuario } }));
      assert.equal(await prisma.asignacion_area_empleado.count({ where: { id_empleado: idEmpleado, vigencia_hasta: null } }), 1);
    });
  } finally {
    if (empleados.length) {
      await prisma.asignacion_area_empleado.deleteMany({ where: { id_empleado: { in: empleados } } });
      await prisma.empleado.deleteMany({ where: { id_empleado: { in: empleados } } });
    }
    if (areas.length) {
      await prisma.configuracion_area_trabajo.deleteMany({ where: { id_area_trabajo: { in: areas.map(BigInt) } } });
      await prisma.area_trabajo.deleteMany({ where: { area_trabajo_id_area: { in: areas.map(BigInt) } } });
    }
  }
});
