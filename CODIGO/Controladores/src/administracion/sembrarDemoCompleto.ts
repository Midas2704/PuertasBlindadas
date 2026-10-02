import { prisma } from '../db';
import { fechaNegocio } from '../utilidades/finanzas';
import { M7Controller } from '../controladores/M7Controller';
import { M9Controller } from '../controladores/M9Controller';

const PREFIJO = 'DEMO-UI';
const hoy = new Date(`${fechaNegocio()}T00:00:00Z`);
const fecha = (dias = 0) => { const valor = new Date(hoy); valor.setUTCDate(valor.getUTCDate() + dias); return valor; };
const inicioMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1));
const finMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + 1, 0));
const rutDemo = (indice: number) => {
  const numero = 97010000 + indice; let suma = 0, factor = 2;
  for (const digito of String(numero).split('').reverse()) { suma += Number(digito) * factor; factor = factor === 7 ? 2 : factor + 1; }
  const dv = 11 - suma % 11;
  return `${numero}-${dv === 11 ? '0' : dv === 10 ? 'K' : dv}`;
};

async function sembrarFinanzas() {
  await prisma.$transaction(async tx => {
    const [clp, empresa, persona, transferencia, categoria, tipoFactura, item] = await Promise.all([
      tx.moneda.upsert({ where: { codigo_moneda: 'CLP' }, update: {}, create: { codigo_moneda: 'CLP', nombre_moneda: 'Peso chileno' } }),
      tx.tipo_cliente_financiero.upsert({ where: { nombre_tipo_cliente_financiero: 'B2B' }, update: {}, create: { nombre_tipo_cliente_financiero: 'B2B' } }),
      tx.tipo_cliente_financiero.upsert({ where: { nombre_tipo_cliente_financiero: 'B2C' }, update: {}, create: { nombre_tipo_cliente_financiero: 'B2C' } }),
      tx.medio_pago.upsert({ where: { nombre_medio_pago: 'Transferencia' }, update: {}, create: { nombre_medio_pago: 'Transferencia' } }),
      tx.categoria_pago.upsert({ where: { nombre: 'Abono parcial' }, update: {}, create: { nombre: 'Abono parcial' } }),
      tx.tipo_documento.upsert({ where: { nombre_tipo_documento: 'Factura Electrónica' }, update: {}, create: { nombre_tipo_documento: 'Factura Electrónica', aplica_venta: true } }),
      tx.item_comercial.findFirst({ where: { nombre_item: `${PREFIJO} Puerta de seguridad` } }).then(valor => valor ?? tx.item_comercial.create({ data: { nombre_item: `${PREFIJO} Puerta de seguridad`, descripcion_item: 'Producto ficticio para QA visual', estado_item: 'activo' } })),
    ]);
    const nombres = ['Constructora Horizonte', 'Taller Cordillera', 'Arquitectura Sur', 'Servicios Andinos', 'Proyecto Los Robles', 'Casa Mirador', 'Residencia Arrayán', 'Familia del Valle', 'Vivienda Parque Norte', 'Casa Costanera'];
    for (let indice = 0; indice < nombres.length; indice++) {
      const b2b = indice < 5, rut = rutDemo(indice + 1), marcador = `${PREFIJO}-CLIENTE-${indice + 1}`;
      await tx.cliente.upsert({ where: { cliente_cliente_rut: rut }, update: {}, create: { cliente_cliente_rut: rut, cliente_razon_social: `Demo UI — ${nombres[indice]}`, cliente_correo: `cliente${indice + 1}@example.invalid`, cliente_telefono: `+56 9 0000 ${String(indice + 1).padStart(4, '0')}`, cliente_es_cliente_b2b: b2b, cliente_es_cliente_b2c: !b2b } });
      const cliente = await tx.cliente_financiero.upsert({ where: { referencia_demostracion: marcador }, update: {}, create: { referencia_demostracion: marcador, rut_cliente: rut, id_tipo_cliente_financiero: b2b ? empresa.id_tipo_cliente_financiero : persona.id_tipo_cliente_financiero, nombre_razon_social_referencia: `Demo UI — ${nombres[indice]}`, telefono_financiero: `+56 9 0000 ${String(indice + 1).padStart(4, '0')}`, correo_financiero: `cliente${indice + 1}@example.invalid`, estado_financiero: indice === 9 ? 'inactivo' : 'activo', nivel_formalizacion: indice === 8 ? 'provisional' : 'formal' } });
      const ficha = await tx.ficha_cliente.upsert({ where: { id_cliente_financiero: cliente.id_cliente_financiero }, update: {}, create: { id_cliente_financiero: cliente.id_cliente_financiero, estado_ficha: indice === 9 ? 'inactiva' : 'activa', observacion_financiera_general: `${PREFIJO}: escenario ficticio de QA` } });
      if (indice >= 5) continue;
      const monto = [350000, 780000, 1250000, 2400000, 4800000][indice];
      const cotizacion = await tx.cotizacion.upsert({ where: { referencia_demostracion: `${PREFIJO}-COT-${indice + 1}` }, update: { fecha_emision: fecha(-indice * 4), fecha_vigencia: fecha(indice === 3 ? -2 : 20) }, create: { referencia_demostracion: `${PREFIJO}-COT-${indice + 1}`, id_ficha_cliente: ficha.id_ficha_cliente, id_moneda: clp.id_moneda, fecha_emision: fecha(-indice * 4), fecha_vigencia: fecha(indice === 3 ? -2 : 20), estado_cotizacion: ['borrador', 'emitida', 'aprobada', 'vencida', 'rechazada'][indice], subtotal_costos_estimados: monto * .62, margen_esperado: 38, precio_sugerido: monto, monto_neto: monto, monto_impuesto: monto * .19, monto_total_estimado: monto * 1.19, detalle_cotizacion: { create: [{ id_item_comercial: item.id_item_comercial, cantidad_item: indice + 1, subtotal_item_estimado: monto, descripcion_item_cotizado: `Puerta QA ${indice + 1}` }] } } });
      let proyecto = await tx.proyecto.findFirst({ where: { proyecto_codigo_proyecto: `${PREFIJO}-PROY-${indice + 1}` } });
      if (!proyecto) proyecto = await tx.proyecto.create({ data: { proyecto_codigo_proyecto: `${PREFIJO}-PROY-${indice + 1}`, proyecto_nombre_referencia: `Demo UI — ${nombres[indice]}`, proyecto_fecha_ingreso: fecha(-30 + indice), proyecto_fecha_instalacion: fecha(indice - 2), proyecto_estado_operacional: indice < 3 ? 'activo' : 'terminado', proyecto_estado_produccion: indice < 2 ? 'en_progreso' : 'completada', rut_cliente: rut } });
      const nota = await tx.nota_venta.upsert({ where: { numero_nota_venta: `${PREFIJO}-NV-${indice + 1}` }, update: { fecha_emision: fecha(-18 + indice), fecha_vencimiento: fecha(indice - 3) }, create: { numero_nota_venta: `${PREFIJO}-NV-${indice + 1}`, id_ficha_cliente: ficha.id_ficha_cliente, id_cotizacion: cotizacion.id_cotizacion, id_moneda: clp.id_moneda, id_proyecto_contexto: proyecto.proyecto_proyecto_id, fecha_emision: fecha(-18 + indice), fecha_vencimiento: fecha(indice - 3), monto_neto: monto, monto_impuesto: monto * .19, monto_total: monto * 1.19, estado_nota_venta: indice === 4 ? 'anulada' : 'confirmada', estado_pago: ['pendiente', 'parcial', 'pagada', 'parcial', 'pendiente'][indice] } });
      const documento = await tx.documento_tributario.upsert({ where: { id_tipo_documento_folio_documento: { id_tipo_documento: tipoFactura.id_tipo_documento, folio_documento: `${PREFIJO}-FAC-${indice + 1}` } }, update: {}, create: { id_ficha_cliente: ficha.id_ficha_cliente, id_nota_venta: nota.id_nota_venta, id_moneda: clp.id_moneda, id_tipo_documento: tipoFactura.id_tipo_documento, folio_documento: `${PREFIJO}-FAC-${indice + 1}`, fecha_emision: fecha(-18 + indice), fecha_vencimiento: fecha(indice - 3), monto_neto: monto, monto_impuesto: monto * .19, monto_total: monto * 1.19 } });
      await tx.documento_tributario_nota_venta.upsert({ where: { id_documento_tributario_id_nota_venta: { id_documento_tributario: documento.id_documento_tributario, id_nota_venta: nota.id_nota_venta } }, update: {}, create: { id_documento_tributario: documento.id_documento_tributario, id_nota_venta: nota.id_nota_venta } });
      const pagado = indice === 0 ? 100000 : indice === 2 ? Number(nota.monto_total) : Math.round(Number(nota.monto_total) * .4);
      if (pagado > 0) {
        await tx.pago_cliente.upsert({ where: { referencia_demostracion: `${PREFIJO}-PAGO-${indice + 1}` }, update: { fecha_pago: fecha(indice === 2 ? 1 : -2) }, create: { referencia_demostracion: `${PREFIJO}-PAGO-${indice + 1}`, id_ficha_cliente: ficha.id_ficha_cliente, id_moneda: clp.id_moneda, id_medio_pago: transferencia.id_medio_pago, id_categoria_pago: categoria.id_categoria_pago, fecha_pago: fecha(indice === 2 ? 1 : -2), monto_pago: pagado, comprobante_pago: `${PREFIJO}://comprobante/${indice + 1}`, asignacion_pago_cliente: { create: { id_nota_venta: nota.id_nota_venta, monto_asignado: pagado } } } });
      }
    }
    for (let indice = 1; indice <= 5; indice++) {
      const sku = `DUI-MAT-${String(indice).padStart(2, '0')}`;
      await tx.material.upsert({ where: { material_sku: sku }, update: {}, create: { material_sku: sku, material_nombre_material: `${PREFIJO} Material ${indice}` } });
      if (!await tx.historial_precio_material.findFirst({ where: { material_sku: sku, fecha_vigencia_inicio: inicioMes } })) await tx.historial_precio_material.create({ data: { material_sku: sku, id_moneda: clp.id_moneda, precio_unitario: 15000 * indice, fecha_vigencia_inicio: inicioMes, estado_precio: 'vigente' } });
    }
  }, { timeout: 120000 });
}

async function sembrarPersonasYOperacion() {
  await prisma.$transaction(async tx => {
    const actor = await tx.usuario.findFirstOrThrow({ where: { administrador_original: true } });
    const vinculo = await tx.tipo_vinculo_laboral.upsert({ where: { nombre_tipo_vinculo_laboral: `${PREFIJO} Contrato indefinido` }, update: {}, create: { nombre_tipo_vinculo_laboral: `${PREFIJO} Contrato indefinido`, descripcion_tipo_vinculo_laboral: 'Configuración ficticia de demostración' } });
    const esquema = await tx.esquema_remuneracional.upsert({ where: { codigo: `${PREFIJO}-ESQUEMA` }, update: {}, create: { codigo: `${PREFIJO}-ESQUEMA`, nombre: `${PREFIJO} Esquema general`, descripcion: 'Esquema ficticio para QA visual', vigencia_desde: inicioMes } });
    const periodo = await tx.periodo_remuneracion.upsert({ where: { anio_mes: { anio: hoy.getUTCFullYear(), mes: hoy.getUTCMonth() + 1 } }, update: {}, create: { anio: hoy.getUTCFullYear(), mes: hoy.getUTCMonth() + 1, fecha_inicio: inicioMes, fecha_fin: finMes } });
    for (let indice = 1; indice <= 5; indice++) {
      const rut = rutDemo(30 + indice);
      const empleado = await tx.empleado.upsert({ where: { rut_empleado: rut }, update: {}, create: { rut_empleado: rut, nombres: `Empleado Demo ${indice}`, apellido_paterno: 'Visual', apellido_materno: 'QA', fecha_ingreso: fecha(-400 + indice * 30), sueldo_base: 700000 + indice * 175000, fecha_aplicacion_sueldo_base: inicioMes, estado_laboral: indice === 5 ? 'inactivo' : 'activo', correo_particular: `empleado${indice}@example.invalid`, telefono_particular: `+56 9 1000 ${String(indice).padStart(4, '0')}`, id_tipo_vinculo_laboral: vinculo.id_tipo_vinculo_laboral } });
      if (!await tx.relacion_laboral_empleado.findFirst({ where: { id_empleado: empleado.id_empleado, estado: 'vigente' } })) await tx.relacion_laboral_empleado.create({ data: { id_empleado: empleado.id_empleado, fecha_inicio: fecha(-400 + indice * 30), estado: 'vigente', jornada: 'Completa', id_tipo_vinculo_laboral: vinculo.id_tipo_vinculo_laboral } });
      if (!await tx.asignacion_esquema_remuneracional.findFirst({ where: { id_empleado: empleado.id_empleado, id_esquema: esquema.id_esquema_remuneracional, activa: true } })) await tx.asignacion_esquema_remuneracional.create({ data: { id_empleado: empleado.id_empleado, id_esquema: esquema.id_esquema_remuneracional, vigencia_desde: inicioMes } });
      let remuneracion = await tx.remuneracion.findFirst({ where: { id_periodo_remuneracion: periodo.id_periodo_remuneracion, id_empleado: empleado.id_empleado, reemplaza_a_id: null } });
      const haberes = 700000 + indice * 175000, deducciones = 95000 + indice * 12000;
      if (!remuneracion) remuneracion = await tx.remuneracion.create({ data: { id_periodo_remuneracion: periodo.id_periodo_remuneracion, id_empleado: empleado.id_empleado, estado: 'abierta', creado_por: actor.usuario_id_usuario, calculado_por: actor.usuario_id_usuario, calculado_en: new Date(), total_haberes: haberes, total_deducciones: deducciones, total_aportes_empleador: haberes * .04, base_imponible: haberes, base_tributable: haberes - deducciones, liquido_preliminar: haberes - deducciones } });
      for (const componente of [{ clave: 'SUELDO', tipo: 'SUELDO_BASE', monto: haberes }, { clave: 'DEDUCCION', tipo: 'DEDUCCION_AUTOMATICA', monto: deducciones }]) if (!await tx.componente_remuneracion.findFirst({ where: { id_remuneracion: remuneracion.id_remuneracion, clave_negocio: `${PREFIJO}:${componente.clave}:${indice}` } })) await tx.componente_remuneracion.create({ data: { id_remuneracion: remuneracion.id_remuneracion, tipo: componente.tipo, descripcion: `${PREFIJO} ${componente.clave.toLowerCase()}`, monto: componente.monto, fuente_tipo: 'AUTOMATICA', clave_negocio: `${PREFIJO}:${componente.clave}:${indice}`, estado_revision: 'aprobado', creado_por: actor.usuario_id_usuario, revisado_por: actor.usuario_id_usuario, fecha_revision: new Date() } });
    }
    for (const parametro of [
      { codigo: 'M7_MARGEN_CRITICO', nombre: `${PREFIJO} Margen crítico`, valor: 15, unidad: 'PORCENTAJE' },
      { codigo: 'M7_LIQUIDEZ_UMBRAL_PREVENTIVO', nombre: `${PREFIJO} Liquidez preventiva`, valor: 2500000, unidad: 'MONTO' },
      { codigo: 'M7_LIQUIDEZ_UMBRAL_CRITICO', nombre: `${PREFIJO} Liquidez crítica`, valor: 1000000, unidad: 'MONTO' },
      { codigo: 'M7_DIAS_STOCK_INMOVIL', nombre: `${PREFIJO} Stock inmóvil`, valor: 60, unidad: 'DIAS' },
    ]) await tx.parametro_remuneracional.upsert({ where: { codigo_vigencia_desde: { codigo: parametro.codigo, vigencia_desde: inicioMes } }, update: {}, create: { ...parametro, tipo: 'DASHBOARD', descripcion: 'Configuración ficticia para QA visual', fuente: 'DEMO', referencia: PREFIJO, vigencia_desde: inicioMes, estado: 'activo' } });
    for (let indice = 1; indice <= 5; indice++) {
      const rut = rutDemo(indice), cliente = await tx.cliente.findUniqueOrThrow({ where: { cliente_cliente_rut: rut } });
      let especificacion = await tx.especificaciones_puerta.findFirst({ where: { especificacion_puerta_observaciones: `${PREFIJO}-ESP-${indice}` } });
      if (!especificacion) especificacion = await tx.especificaciones_puerta.create({ data: { especificacion_puerta_modelo_puerta: `Modelo Demo ${indice}`, especificacion_puerta_zona: ['Norte','Centro','Sur','Oriente','Poniente'][indice - 1], especificacion_puerta_sentido_apertura: indice % 2 ? 'Interior' : 'Exterior', especificacion_puerta_observaciones: `${PREFIJO}-ESP-${indice}` } });
      let medida = await tx.medidas_puerta.findFirst({ where: { id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } });
      if (!medida) medida = await tx.medidas_puerta.create({ data: { id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id, medidas_puerta_medidas_marco_ancho: 900 + indice * 10, medidas_puerta_medidas_marco_alto: 2050 + indice * 10, medidas_puerta_medidas_marco_espesor: 50 } });
      if (!especificacion.id_medidas) await tx.especificaciones_puerta.update({ where: { especificacion_puerta_especificacion_puerta_id: especificacion.especificacion_puerta_especificacion_puerta_id }, data: { id_medidas: medida.medidas_puerta_medidas_id } });
      let obra = await tx.obra.findFirst({ where: { obra_referencia: `${PREFIJO}-OBRA-${indice}` } });
      if (!obra) obra = await tx.obra.create({ data: { obra_nombre_obra: `${PREFIJO} Obra ${indice}`, obra_direccion_obra: `Avenida Demo ${100 + indice}`, obra_comuna: ['Santiago','Providencia','Ñuñoa','Maipú','Las Condes'][indice - 1], obra_ciudad: 'Santiago', obra_region: 'Metropolitana', obra_tipo_obra: 'Instalación', obra_fecha_de_creacion: fecha(-30), obra_fecha_de_ultima_edicion: fecha(-indice), obra_estado: indice < 4 ? 'activa' : 'cerrada', obra_cantidad_puerta: indice, obra_referencia: `${PREFIJO}-OBRA-${indice}`, rut_cliente: cliente.cliente_cliente_rut, id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } });
      let servicio = await tx.servicio_terreno.findFirst({ where: { id_obra: obra.obra_obra_id, servicio_terreno_observaciones: { contains: PREFIJO } } });
      if (!servicio) servicio = await tx.servicio_terreno.create({ data: { servicio_terreno_tipo_servicio: 'Instalación', servicio_terreno_fecha_real: indice >= 4 ? fecha(-indice) : null, servicio_terreno_prioridad: indice === 1 ? 'alta' : 'normal', servicio_terreno_estado: ['pendiente','en_progreso','pendiente','finalizada','finalizada'][indice - 1], servicio_terreno_observaciones: `${PREFIJO} visita ${indice}`, id_obra: obra.obra_obra_id } });
      let tarea = await tx.tarea.findFirst({ where: { tarea_titulo: `${PREFIJO} Tarea ${indice}`, id_servicio_terreno: servicio.servicio_terreno_servicio_terreno_id } });
      if (!tarea) tarea = await tx.tarea.create({ data: { tarea_titulo: `${PREFIJO} Tarea ${indice}`, tarea_descripcion: 'Actividad ficticia para QA visual', tarea_fecha_de_creacion: fecha(-10), tarea_fecha_de_inicio: fecha(-5), tarea_fecha_de_termino: indice >= 4 ? fecha(-indice) : null, tarea_horario_limite: fecha(indice - 3), tarea_urgencia: indice === 1 ? 'alta' : 'normal', tarea_estado_de_tarea: indice >= 4 ? 'completada' : 'pendiente', id_servicio_terreno: servicio.servicio_terreno_servicio_terreno_id, id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } });
      if (!await tx.orden_trabajo.findFirst({ where: { especificaciones_puerta_id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } })) await tx.orden_trabajo.create({ data: { orden_trabajo_fecha_hora: fecha(-8 + indice), orden_trabajo_estado: ['pendiente','en_progreso','en_progreso','completada','cancelada'][indice - 1], especificaciones_puerta_id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } });
    }
  }, { timeout: 120000 });
}

async function sembrarCredito() {
  await prisma.$transaction(async tx => {
    const actor = await tx.usuario.findFirstOrThrow({ where: { administrador_original: true } });
    const fichas = await tx.ficha_cliente.findMany({ where: { cliente_financiero: { referencia_demostracion: { startsWith: `${PREFIJO}-CLIENTE-` } } }, include: { nota_venta: true, cotizacion: true }, orderBy: { id_ficha_cliente: 'asc' }, take: 5 });
    if (!await tx.limite_global_credito_m8.findFirst({ where: { motivo: { startsWith: PREFIJO } } })) await tx.limite_global_credito_m8.create({ data: { monto_limite: 18000000, vigencia_desde: inicioMes, motivo: `${PREFIJO} límite global ficticio`, id_responsable: actor.usuario_id_usuario } });
    const estados = ['BORRADOR', 'PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA'];
    for (let indice = 0; indice < fichas.length; indice++) {
      const ficha = fichas[indice], cupo = 1500000 + indice * 900000;
      await tx.condicion_crediticia_m8.upsert({ where: { id_ficha_cliente: ficha.id_ficha_cliente }, update: {}, create: { id_ficha_cliente: ficha.id_ficha_cliente, credito_habilitado: indice !== 3, monto_cupo: cupo, vigencia_desde: inicioMes, vigencia_hasta: fecha(180), suspendido: indice === 4, motivo_suspension: indice === 4 ? `${PREFIJO} revisión ficticia` : null } });
      let solicitud = await tx.solicitud_crediticia_m8.findFirst({ where: { referencia_contexto: `${PREFIJO}-SOL-${indice + 1}` } });
      if (!solicitud) solicitud = await tx.solicitud_crediticia_m8.create({ data: { id_ficha_cliente: ficha.id_ficha_cliente, tipo_solicitud: indice % 2 ? 'EXCEPCION' : 'INICIAL', estado_solicitud: estados[indice], id_usuario_solicitante: actor.usuario_id_usuario, id_cotizacion: ficha.cotizacion[0]?.id_cotizacion, id_nota_venta: ficha.nota_venta[0]?.id_nota_venta, referencia_contexto: `${PREFIJO}-SOL-${indice + 1}`, antecedentes_resumen: 'Antecedentes ficticios para demostración', motivo_solicitud: `${PREFIJO} motivo ${indice + 1}`, condiciones_solicitadas: 'Condiciones ficticias sin valor normativo' } });
      if (['APROBADA','RECHAZADA'].includes(estados[indice]) && !await tx.resolucion_solicitud_crediticia_m8.findUnique({ where: { id_solicitud_crediticia: solicitud.id_solicitud_crediticia } })) await tx.resolucion_solicitud_crediticia_m8.create({ data: { id_solicitud_crediticia: solicitud.id_solicitud_crediticia, decision: estados[indice], motivo: `${PREFIJO} resolución ficticia`, monto_cupo_aprobado: estados[indice] === 'APROBADA' ? cupo : null, vigencia_desde: estados[indice] === 'APROBADA' ? inicioMes : null, vigencia_hasta: estados[indice] === 'APROBADA' ? fecha(180) : null, condiciones_aprobadas: 'Uso demostrativo', id_usuario_responsable: actor.usuario_id_usuario } });
      const nota = ficha.nota_venta[0];
      if (nota && indice < 4) await tx.compromiso_credito_m8.upsert({ where: { id_nota_venta: nota.id_nota_venta }, update: {}, create: { id_ficha_cliente: ficha.id_ficha_cliente, id_nota_venta: nota.id_nota_venta, id_solicitud_excepcion: solicitud.tipo_solicitud === 'EXCEPCION' ? solicitud.id_solicitud_crediticia : null, monto_original: nota.monto_total, monto_pendiente: Number(nota.monto_total) * (indice === 2 ? .35 : .7), condiciones: `${PREFIJO} compromiso ficticio`, estado: 'VIGENTE' } });
    }
  }, { timeout: 60000 });
}

async function sembrarAuditoria() {
  const controlador = new M9Controller();
  for (let modulo = 1; modulo <= 8; modulo++) for (let indice = 1; indice <= 5; indice++) await controlador.recibir({ identidadLogica: `${PREFIJO}:M${modulo}:${indice}`, versionContrato: '1.0', ocurridoEn: fecha(-indice).toISOString(), zonaHoraria: 'UTC', ejecutor: { tipo: indice % 2 ? 'SISTEMA' : 'HUMANO', referencia: `${PREFIJO}-ACTOR` }, productor: `M${modulo}`, modulo: `M${modulo}`, operacion: `${PREFIJO}_ESCENARIO_${indice}`, resultado: indice === 4 ? 'RECHAZADO' : indice === 5 ? 'FALLIDO' : 'EXITOSO', referencia: { tipo: 'ESCENARIO_DEMO', id: `${PREFIJO}-M${modulo}-${indice}` }, anterior: { estado: indice === 1 ? 'nuevo' : 'pendiente' }, nuevo: { estado: indice >= 4 ? 'observado' : 'procesado', monto: indice * 100000 }, motivo: `${PREFIJO} evidencia ficticia`, capacidad: 'EMITIR_EVENTO_M9', critico: true });
}

async function limpiarDemo() {
  const eventosM9Preservados = await prisma.evento_auditoria_m9.count({ where: { identidad_logica: { startsWith: `${PREFIJO}:` } } });
  await prisma.$transaction(async tx => {
    const fichas = await tx.ficha_cliente.findMany({ where: { cliente_financiero: { referencia_demostracion: { startsWith: `${PREFIJO}-CLIENTE-` } } }, select: { id_ficha_cliente: true, id_cliente_financiero: true } });
    const idsFicha = fichas.map(valor => valor.id_ficha_cliente);
    const idsClienteFinanciero = fichas.map(valor => valor.id_cliente_financiero);
    const solicitudes = await tx.solicitud_crediticia_m8.findMany({ where: { referencia_contexto: { startsWith: `${PREFIJO}-SOL-` } }, select: { id_solicitud_crediticia: true } });
    const idsSolicitud = solicitudes.map(valor => valor.id_solicitud_crediticia);
    const especificaciones = await tx.especificaciones_puerta.findMany({ where: { especificacion_puerta_observaciones: { startsWith: `${PREFIJO}-ESP-` } }, select: { especificacion_puerta_especificacion_puerta_id: true } });
    const idsEspecificacion = especificaciones.map(valor => valor.especificacion_puerta_especificacion_puerta_id);
    const empleados = await tx.empleado.findMany({ where: { correo_particular: { endsWith: '@example.invalid' } }, select: { id_empleado: true } });
    const idsEmpleado = empleados.map(valor => valor.id_empleado);
    const remuneraciones = await tx.remuneracion.findMany({ where: { componentes: { some: { clave_negocio: { startsWith: `${PREFIJO}:` } } } }, select: { id_remuneracion: true } });
    const idsRemuneracion = remuneraciones.map(valor => valor.id_remuneracion);
    const notas = await tx.nota_venta.findMany({ where: { numero_nota_venta: { startsWith: `${PREFIJO}-NV-` } }, select: { id_nota_venta: true } });
    const idsNota = notas.map(valor => valor.id_nota_venta);
    const documentos = await tx.documento_tributario.findMany({ where: { folio_documento: { startsWith: `${PREFIJO}-FAC-` } }, select: { id_documento_tributario: true } });
    const idsDocumento = documentos.map(valor => valor.id_documento_tributario);
    const pagos = await tx.pago_cliente.findMany({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-PAGO-` } }, select: { id_pago_cliente: true } });
    const idsPago = pagos.map(valor => valor.id_pago_cliente);

    await tx.resolucion_solicitud_crediticia_m8.deleteMany({ where: { id_solicitud_crediticia: { in: idsSolicitud } } });
    await tx.compromiso_credito_m8.deleteMany({ where: { condiciones: { startsWith: PREFIJO } } });
    await tx.solicitud_crediticia_m8.deleteMany({ where: { id_solicitud_crediticia: { in: idsSolicitud } } });
    await tx.condicion_crediticia_m8.deleteMany({ where: { id_ficha_cliente: { in: idsFicha } } });
    await tx.limite_global_credito_m8.deleteMany({ where: { motivo: { startsWith: PREFIJO } } });
    await tx.parametro_remuneracional.deleteMany({ where: { referencia: PREFIJO } });
    await tx.orden_trabajo.deleteMany({ where: { especificaciones_puerta_id_especificacion_puerta: { in: idsEspecificacion } } });
    await tx.tarea.deleteMany({ where: { tarea_titulo: { startsWith: PREFIJO } } });
    await tx.servicio_terreno.deleteMany({ where: { servicio_terreno_observaciones: { startsWith: PREFIJO } } });
    await tx.obra.deleteMany({ where: { obra_referencia: { startsWith: `${PREFIJO}-OBRA-` } } });
    await tx.medidas_puerta.deleteMany({ where: { id_especificacion_puerta: { in: idsEspecificacion } } });
    await tx.especificaciones_puerta.deleteMany({ where: { especificacion_puerta_especificacion_puerta_id: { in: idsEspecificacion } } });
    await tx.componente_remuneracion.deleteMany({ where: { id_remuneracion: { in: idsRemuneracion } } });
    await tx.remuneracion.deleteMany({ where: { id_remuneracion: { in: idsRemuneracion } } });
    await tx.asignacion_esquema_remuneracional.deleteMany({ where: { id_empleado: { in: idsEmpleado } } });
    await tx.relacion_laboral_empleado.deleteMany({ where: { id_empleado: { in: idsEmpleado } } });
    await tx.empleado.deleteMany({ where: { id_empleado: { in: idsEmpleado } } });
    await tx.esquema_remuneracional.deleteMany({ where: { codigo: `${PREFIJO}-ESQUEMA` } });
    await tx.tipo_vinculo_laboral.deleteMany({ where: { nombre_tipo_vinculo_laboral: `${PREFIJO} Contrato indefinido` } });
    await tx.asignacion_pago_cliente.deleteMany({ where: { id_pago_cliente: { in: idsPago } } });
    await tx.pago_cliente.deleteMany({ where: { id_pago_cliente: { in: idsPago } } });
    await tx.documento_tributario_nota_venta.deleteMany({ where: { OR: [{ id_documento_tributario: { in: idsDocumento } }, { id_nota_venta: { in: idsNota } }] } });
    await tx.documento_tributario.deleteMany({ where: { id_documento_tributario: { in: idsDocumento } } });
    await tx.nota_venta.deleteMany({ where: { id_nota_venta: { in: idsNota } } });
    await tx.detalle_cotizacion.deleteMany({ where: { cotizacion: { referencia_demostracion: { startsWith: `${PREFIJO}-COT-` } } } });
    await tx.cotizacion.deleteMany({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-COT-` } } });
    await tx.proyecto.deleteMany({ where: { proyecto_codigo_proyecto: { startsWith: `${PREFIJO}-PROY-` } } });
    await tx.ficha_cliente.deleteMany({ where: { id_cliente_financiero: { in: idsClienteFinanciero } } });
    await tx.cliente_financiero.deleteMany({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-CLIENTE-` } } });
    await tx.historial_precio_material.deleteMany({ where: { material_sku: { startsWith: 'DUI-MAT-' } } });
    await tx.material.deleteMany({ where: { material_sku: { startsWith: 'DUI-MAT-' } } });
    await tx.item_comercial.deleteMany({ where: { nombre_item: `${PREFIJO} Puerta de seguridad` } });
  }, { timeout: 120000 });
  console.log(JSON.stringify({ estado: 'OK', mensaje: 'Se retiraron sólo registros operativos DEMO-UI; la evidencia M9 no se elimina porque es inmutable.', eventosM9DemoPreservados: eventosM9Preservados }, null, 2));
}

async function conteos() {
  const [usuarios, clientes, cotizaciones, notas, pagos, proveedores, obligaciones, empleados, remuneraciones, proyectos, ots, solicitudes, compromisos, eventos] = await Promise.all([
    prisma.usuario.count(),
    prisma.cliente_financiero.count({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-CLIENTE-` } } }),
    prisma.cotizacion.count({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-COT-` } } }),
    prisma.nota_venta.count({ where: { numero_nota_venta: { startsWith: `${PREFIJO}-NV-` } } }),
    prisma.pago_cliente.count({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-PAGO-` } } }),
    prisma.proveedor.count({ where: { OR: [{ nombre_razon_social: { startsWith: 'Demo M5' } }, { nombre_razon_social: { startsWith: 'DEMO M5' } }] } }),
    prisma.documento_proveedor_m5.count({ where: { folio: { startsWith: 'DEMO-M5-' } } }),
    prisma.empleado.count({ where: { correo_particular: { endsWith: '@example.invalid' } } }),
    prisma.remuneracion.count({ where: { componentes: { some: { clave_negocio: { startsWith: `${PREFIJO}:` } } } } }),
    prisma.proyecto.count({ where: { proyecto_codigo_proyecto: { startsWith: `${PREFIJO}-PROY-` } } }),
    prisma.orden_trabajo.count({ where: { especificaciones_puerta: { especificacion_puerta_observaciones: { startsWith: `${PREFIJO}-ESP-` } } } }),
    prisma.solicitud_crediticia_m8.count({ where: { referencia_contexto: { startsWith: `${PREFIJO}-SOL-` } } }),
    prisma.compromiso_credito_m8.count({ where: { condiciones: { startsWith: PREFIJO } } }),
    prisma.evento_auditoria_m9.count({ where: { identidad_logica: { startsWith: `${PREFIJO}:` } } }),
  ]);
  const limite = await prisma.limite_global_credito_m8.findFirst({ where: { motivo: { startsWith: PREFIJO } } });
  const exposicion = await prisma.compromiso_credito_m8.aggregate({ where: { condiciones: { startsWith: PREFIJO }, estado: 'VIGENTE' }, _sum: { monto_pendiente: true } });
  return { usuarios, clientes, cotizaciones, notas, pagos, proveedores, obligaciones, empleados, remuneraciones, proyectos, ots, solicitudes, compromisos, eventos, limiteGlobal: Number(limite?.monto_limite || 0), exposicion: Number(exposicion._sum.monto_pendiente || 0) };
}

async function verificar() {
  const resumen = await conteos();
  const minimos: Record<string, number> = { usuarios: 5, clientes: 10, cotizaciones: 5, notas: 5, pagos: 5, proveedores: 5, obligaciones: 3, empleados: 5, remuneraciones: 5, proyectos: 5, ots: 5, solicitudes: 5, compromisos: 4, eventos: 40 };
  const fallos = Object.entries(minimos).filter(([clave, minimo]) => Number(resumen[clave as keyof typeof resumen]) < minimo).map(([clave, minimo]) => `${clave}: mínimo ${minimo}, actual ${resumen[clave as keyof typeof resumen]}`);
  if (resumen.limiteGlobal <= 0) fallos.push('límite global M8 no configurado');
  if (resumen.exposicion <= 0) fallos.push('exposición M8 no positiva');
  const panel = await new M7Controller().consultarPanelGeneral({}, Array.from({ length: 44 }, (_, indice) => `CU${215 + indice}`));
  if (!panel.bloques || Object.keys(panel.bloques).length < 5) fallos.push('Dashboard M7 sin bloques suficientes');
  if (fallos.length) throw new Error(`Dataset DEMO incompleto:\n- ${fallos.join('\n- ')}`);
  console.log(JSON.stringify({ estado: 'OK', ...resumen, bloquesM7: Object.keys(panel.bloques) }, null, 2));
}

async function ejecutar() {
  const modo = process.argv[2] || 'seed';
  if (modo === 'seed') { await sembrarFinanzas(); await sembrarPersonasYOperacion(); await sembrarCredito(); await sembrarAuditoria(); await verificar(); return; }
  if (modo === 'status') { console.log(JSON.stringify(await conteos(), null, 2)); return; }
  if (modo === 'verify') { await verificar(); return; }
  if (modo === 'clean') { await limpiarDemo(); return; }
  throw new Error(`Modo no soportado: ${modo}`);
}

ejecutar().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
