const { test } = require('node:test');
const assert = require('node:assert/strict');
const { M6Controller } = require('../dist/controladores/M6Controller');

const usuario = (id, nombre) => ({
  usuario_id_usuario: BigInt(id),
  usuario_username: nombre.toLowerCase(),
  usuario_nombre_completo_primer_nombre_usuario: nombre,
  usuario_nombre_completo_segundo_nombre_usuario: null,
  usuario_nombre_completo_primer_apellido_usuario: 'Focal',
  usuario_nombre_completo_segundo_apellido_usuario: null,
});

const unidadBase = () => {
  const creador = usuario(1, 'Creador');
  const ejecutor = usuario(2, 'Ejecutor');
  const visita = {
    servicio_terreno_servicio_terreno_id: 91n,
    servicio_terreno_tipo_servicio: 'Instalación',
    servicio_terreno_fecha_real: new Date('2026-10-15T00:00:00Z'),
    servicio_terreno_bloque_horario: null,
    servicio_terreno_prioridad: 'alta',
    servicio_terreno_estado: 'programada',
    servicio_terreno_observaciones: 'Visita vinculada por tarea',
    usuario: ejecutor,
    obra: null,
  };
  const incidencia = {
    id_incidencia_retrabajo: 71n,
    descripcion: 'Ajuste requerido', causa_referencia: 'Medida', estado: 'pendiente',
    responsabilidad: 'Fabricación', fecha_registro: new Date('2026-10-15T11:00:00Z'),
    estado_revision: 'pendiente_revision', observacion_revision: null,
    categoria: { nombre: 'Retrabajo' }, area_responsable: { area_trabajo_nombre_area: 'Producción' },
    creador, revisor: null, evidencias: [],
  };
  const ejecucion = { id_ejecucion_tarea: 61n, estado_ejecucion: 'completada', estado_validacion_productiva: 'validada', fecha_ejecucion: new Date('2026-10-15T10:00:00Z'), ejecutor, incidencias: [incidencia] };
  const tarea = {
    tarea_tarea_id: 51n, tarea_titulo: 'Fabricar hoja', tarea_instrucciones_de_oficina: null,
    tarea_fecha_de_inicio_en_terreno: new Date('2026-10-15T08:00:00Z'), tarea_fecha_de_inicio: null,
    tarea_fecha_de_termino: new Date('2026-10-15T12:00:00Z'), usuario: ejecutor,
    servicio_terreno: visita,
    formulario_de_cierre: [{ formulario_de_cierre_formulario_de_cierre_id: 81n, formulario_de_cierre_resultado_finalizado: 'Conforme', formulario_de_cierre_detalle_de_observaciones: 'Sin novedades' }],
    ejecuciones: [ejecucion],
  };
  return {
    id_unidad_fisica_ot: 11n, id_orden_trabajo: 21n, id_cotizacion: 31, id_extension_producto_comercial: 41,
    creado_en: new Date('2026-10-14T09:00:00Z'), creador, estado: 'LIBERADA', orden_trabajo: { orden_trabajo_estado: 'en_progreso' },
    historial: [{ id_historial_unidad_fisica_ot: 1n, evento: 'UNIDAD_CREADA', motivo: 'Origen comercial', fecha_evento: new Date('2026-10-14T09:01:00Z'), usuario: creador }],
    liberacion: null, cierre_produccion: null, etapas_adicionales: [], historial_produccion: [],
    tareas_ejecutables: [{ id_tarea: 51n, id_tarea_ejecutable_ot: 52n, origen: 'PLANIFICACION_APROBADA', orden_etapa: 1, orden_tarea: 1, id_etapa_planificacion: 'etapa-1', id_etapa_adicional_ot: null, etapa_adicional: null, tarea, estado_operacional: { estado: 'PENDIENTE_VALIDACION', revision: 2, prioridad: null, tiempo_estimado_min: 60, instrucciones: null, observaciones: null, fecha_planificada: null, id_area_trabajo: 1n, area: { area_trabajo_nombre_area: 'Producción' }, empleado_responsable: null } }],
    producto: { nombre_comercial: 'Puerta focal', codigo_comercial: 'PF-1', caracteristicas_tecnicas: {}, familia: { nombre: 'Blindada' } },
    version_plantilla: { contenido: { medidasObligatorias: [] } },
    detalle: { medida_alto_referencial: 2100, medida_ancho_referencial: 900, medida_espesor_referencial: 90, descripcion_item_cotizado: 'Puerta focal' },
    cotizacion: { fecha_emision: new Date('2026-10-01T00:00:00Z'), ficha_cliente: { cliente_financiero: { nombre_razon_social_referencia: 'Cliente focal' } }, nota_venta: { numero_nota_venta: 'NV-1' } },
    rectificacion: null, planificacion_actual: { etapas: [{ id: 'etapa-1', orden: 1, nombre: 'Fabricación', tareas: [] }] }, planificacion_inicial: { etapas: [] }, numero_unidad: 1,
  };
};

test('ficha operativa consolida relaciones directas sin alterar estados', async (t) => {
  const controlador = new M6Controller();
  await t.test('no cuenta una ejecución validada como cierre de tarea', () => {
    const ficha = controlador.presentarGestionOrdenTrabajo(unidadBase());
    assert.deepEqual({ total: ficha.avance.total, cerradas: ficha.avance.cerradas, enEjecucion: ficha.avance.enEjecucion, porcentaje: ficha.avance.porcentaje }, { total: 1, cerradas: 0, enEjecucion: 1, porcentaje: 0 });
    assert.equal(ficha.tareasProduccion[0].resultadoValidado.ejecutor, 'Ejecutor Focal');
  });
  await t.test('incluye sólo la visita vinculada explícitamente por la tarea', () => {
    const unidad = unidadBase();
    unidad.tareas_ejecutables.push({ ...unidad.tareas_ejecutables[0], id_tarea_ejecutable_ot: 53n });
    const ficha = controlador.presentarGestionOrdenTrabajo(unidad);
    assert.equal(ficha.visitasRelacionadas.length, 1);
    assert.equal(ficha.visitasRelacionadas[0].resultadoRegistrado.resultado, 'Conforme');
  });
  await t.test('no presenta responsabilidad pendiente como confirmada', () => {
    const ficha = controlador.presentarGestionOrdenTrabajo(unidadBase());
    assert.equal(ficha.incidencias[0].areaSenalada, 'Producción');
    assert.equal(ficha.incidencias[0].participante, 'Ejecutor Focal');
    assert.equal(ficha.incidencias[0].responsabilidadConfirmada, null);
  });
  await t.test('presenta responsabilidad sólo después de una revisión aprobada', () => {
    const unidad = unidadBase();
    unidad.tareas_ejecutables[0].tarea.ejecuciones[0].incidencias[0].estado_revision = 'aprobada';
    const ficha = controlador.presentarGestionOrdenTrabajo(unidad);
    assert.equal(ficha.incidencias[0].responsabilidadConfirmada, 'Fabricación');
  });
  await t.test('ordena cronológicamente la línea de tiempo operacional', () => {
    const ficha = controlador.presentarGestionOrdenTrabajo(unidadBase());
    assert.equal(ficha.historialOperacional[0].tipo, 'RESULTADO_VALIDADO');
    assert.equal(ficha.historialOperacional.filter(evento => /CREAD/.test(evento.tipo)).length, 1);
  });
  await t.test('mantiene el alcance por empleado para usuarios no administrativos', () => {
    const unidad = { rectificacion: { id_empleado_rectificador: 7 } };
    assert.doesNotThrow(() => controlador.verificarAccesoRectificacion(unidad, { id: 1n, administrador: false, permisos: [], alcanceEmpleadoId: 7 }));
    assert.throws(() => controlador.verificarAccesoRectificacion(unidad, { id: 2n, administrador: false, permisos: [], alcanceEmpleadoId: 8 }), error => error.estado === 403);
  });
});
