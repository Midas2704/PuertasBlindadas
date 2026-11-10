import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { calcularNota, consolidarNotasClp, efectoPago, incluirCotizacion, incluirNota, incluirPago, resumirNotas, clasificarPorVencer, sincronizarEstadoPago } from '../utilidades/finanzas';
import { FiltrosClientes, identificador } from '../validaciones/solicitudes';
import { normalizarRut, validarYNormalizarRut, variantesRut } from '../utilidades/rut';

/** M1 CU01–CU11: catálogo, ficha y mantenimiento de clientes. */
export class M1Controller {
  async crearCliente(entrada: Record<string, unknown>) {
    const rut = validarYNormalizarRut(entrada.rut);
    const nombre = typeof entrada.nombre === 'string' ? entrada.nombre.trim() : '';
    const tipoNombre = typeof entrada.tipo === 'string' ? entrada.tipo.trim() : '';
    if (!nombre || !tipoNombre) throw new ErrorAplicacion(400, 'Completa nombre o Razón Social y tipo de cliente');
    if (tipoNombre.toUpperCase() === 'B2B' && !rut) throw new ErrorAplicacion(400, 'El RUT es obligatorio para clientes B2B');
    return prisma.$transaction(async tx => {
      const tipo = await tx.tipo_cliente_financiero.findFirst({ where: { nombre_tipo_cliente_financiero: { equals: tipoNombre, mode: 'insensitive' } } });
      if (!tipo) throw new ErrorAplicacion(400, 'Tipo de cliente no válido');
      if (rut && await tx.cliente_financiero.findFirst({ where: { rut_cliente: { in: variantesRut(rut), mode: 'insensitive' } } })) throw new ErrorAplicacion(409, 'Ya existe un cliente con ese RUT');
      const cliente = await tx.cliente_financiero.create({ data: {
        rut_cliente: rut,
        id_tipo_cliente_financiero: tipo.id_tipo_cliente_financiero,
        nombre_razon_social_referencia: nombre,
        contacto_financiero: typeof entrada.contacto === 'string' ? entrada.contacto.trim() : null,
        correo_financiero: typeof entrada.correo === 'string' ? entrada.correo.trim() : null,
        telefono_financiero: typeof entrada.telefono === 'string' ? entrada.telefono.trim() : null,
        estado_financiero: 'activo',
        nivel_formalizacion: tipoNombre.toUpperCase() === 'B2C' && !rut ? 'provisional' : 'formal',
        ficha_cliente: { create: {} },
      }, include: { ficha_cliente: true, tipo_cliente_financiero: true } });
      return { mensaje: 'Cliente registrado', cliente };
    });
  }

  async actualizarCliente(id: number, entrada: Record<string, unknown>) {
    const cambios: Record<string, string> = {};
    for (const [origen, destino] of [['nombre','nombre_razon_social_referencia'],['contacto','contacto_financiero'],['correo','correo_financiero'],['telefono','telefono_financiero']] as const) {
      if (entrada[origen] !== undefined) cambios[destino] = typeof entrada[origen] === 'string' ? entrada[origen].trim() : '';
    }
    if (!Object.keys(cambios).length) throw new ErrorAplicacion(400, 'No hay cambios para guardar');
    if (!cambios.nombre_razon_social_referencia) throw new ErrorAplicacion(400, 'El nombre o Razón Social es obligatorio');
    const cliente = await prisma.cliente_financiero.update({ where: { id_cliente_financiero: id }, data: { ...cambios, fecha_actualizacion_datos_cliente: new Date() } });
    return { mensaje: 'Cliente actualizado', cliente };
  }

  async cambiarEstadoCliente(id: number, estado: 'activo' | 'inactivo', confirmado: boolean) {
    if (!confirmado) throw new ErrorAplicacion(400, 'Confirma la operación');
    return prisma.$transaction(async tx => {
      const cliente = await tx.cliente_financiero.findUnique({ where: { id_cliente_financiero: id }, include: { ficha_cliente: { include: { cotizacion: true, nota_venta: true } } } });
      if (!cliente) throw new ErrorAplicacion(404, 'Cliente no encontrado');
      if (cliente.estado_financiero === estado) throw new ErrorAplicacion(409, `El cliente ya está ${estado}`);
      if (estado === 'inactivo') {
        const pendientes = [...(cliente.ficha_cliente?.cotizacion || [])].some(c => ['borrador','emitida'].includes(c.estado_cotizacion)) || [...(cliente.ficha_cliente?.nota_venta || [])].some(n => !['anulada','cerrada','revertida_total'].includes(n.estado_nota_venta));
        if (pendientes) throw new ErrorAplicacion(409, 'No se puede desactivar: el cliente mantiene operaciones abiertas');
      }
      await tx.cliente_financiero.update({ where: { id_cliente_financiero: id }, data: { estado_financiero: estado, fecha_actualizacion_datos_cliente: new Date() } });
      return { mensaje: estado === 'activo' ? 'Cliente reactivado' : 'Cliente desactivado' };
    });
  }


  async listarClientes(filtros: FiltrosClientes) {
    const condicion: Prisma.cliente_financieroWhereInput = {};
    if (filtros.estado !== 'todos') condicion.estado_financiero = filtros.estado === 'activos' ? 'activo' : 'inactivo';
    if (filtros.segmento) condicion.tipo_cliente_financiero = { nombre_tipo_cliente_financiero: { equals: filtros.segmento, mode: 'insensitive' } };
    const clientes = await prisma.cliente_financiero.findMany({
      where: condicion, orderBy: [{ nombre_razon_social_referencia: 'asc' }, { id_cliente_financiero: 'asc' }],
      include: { tipo_cliente_financiero: true, ficha_cliente: { include: {
        nota_venta: { include: incluirNota },
        cotizacion: { select: { fecha_emision: true } },
        pago_cliente: { select: { fecha_pago: true } },
      } } },
    });
    // Hay RUT heredados con y sin puntos; los quitamos sólo para buscar.
    const busqueda = filtros.busqueda.toLocaleLowerCase('es-CL');
    const rutBuscado = busqueda.replace(/\./g, '');
    const resultado = clientes.filter(cliente => !busqueda || cliente.nombre_razon_social_referencia.toLocaleLowerCase('es-CL').includes(busqueda)
      || !!cliente.rut_cliente?.replace(/\./g, '').toLowerCase().includes(rutBuscado)).map(cliente => {
      const saldosPorMoneda = resumirNotas(cliente.ficha_cliente?.nota_venta || []);
      const consolidadoClp = consolidarNotasClp(cliente.ficha_cliente?.nota_venta || []);
      const esMoroso = saldosPorMoneda.some(saldo => saldo.obligacionesMorosas > 0);
      const tieneDeuda = saldosPorMoneda.some(saldo => saldo.saldoPendiente > 0);
      const fechasActividad = [
        ...(cliente.ficha_cliente?.cotizacion || []).map(item => item.fecha_emision),
        ...(cliente.ficha_cliente?.nota_venta || []).map(item => item.fecha_emision),
        ...(cliente.ficha_cliente?.pago_cliente || []).map(item => item.fecha_pago),
      ].filter((fecha): fecha is Date => fecha instanceof Date);
      const ultimaActividad = fechasActividad.length ? fechasActividad.reduce((ultima, fecha) => fecha > ultima ? fecha : ultima) : null;
      const situacionClave = esMoroso ? 'moroso' : tieneDeuda ? 'deuda_vigente' : 'al_dia';
      return {
        id_cliente_financiero: cliente.id_cliente_financiero,
        id_ficha_cliente: cliente.ficha_cliente?.id_ficha_cliente ?? null,
        referencia: `id-${cliente.id_cliente_financiero}`, rut: cliente.rut_cliente,
        razonSocial: cliente.nombre_razon_social_referencia,
        telefono: cliente.telefono_financiero, correo: cliente.correo_financiero,
        tipoCliente: cliente.tipo_cliente_financiero.nombre_tipo_cliente_financiero,
        estado: cliente.estado_financiero, nivelFormalizacion: cliente.nivel_formalizacion,
        incompleto: cliente.nivel_formalizacion === 'provisional',
        saldoDeudor: consolidadoClp.saldoPendiente,
        saldosPorMoneda, consolidadoClp, tieneDeuda, esMoroso, isMoroso: esMoroso,
        situacionFinanciera: esMoroso ? 'Moroso' : tieneDeuda ? 'Deuda vigente' : 'Al día',
        situacionClave, ultimaActividad,
      };
    }).filter(cliente => (!filtros.deuda || cliente.tieneDeuda)
      && (!filtros.morosos || cliente.esMoroso)
      && (!filtros.situacion || cliente.situacionClave === filtros.situacion)
      && (!filtros.fechaDesde || !!cliente.ultimaActividad && cliente.ultimaActividad >= filtros.fechaDesde)
      && (!filtros.fechaHasta || !!cliente.ultimaActividad && cliente.ultimaActividad <= filtros.fechaHasta));
    resultado.sort((a,b)=>{ const av=filtros.ordenar==='saldo'?a.saldoDeudor:filtros.ordenar==='rut'?(a.rut||''):filtros.ordenar==='ultimaActividad'?(a.ultimaActividad?.getTime() ?? 0):a.razonSocial; const bv=filtros.ordenar==='saldo'?b.saldoDeudor:filtros.ordenar==='rut'?(b.rut||''):filtros.ordenar==='ultimaActividad'?(b.ultimaActividad?.getTime() ?? 0):b.razonSocial; const n=typeof av==='number'&&typeof bv==='number'?av-bv:String(av).localeCompare(String(bv),'es'); return filtros.direccion==='asc'?n:-n; });
    return resultado;
  }

  async abrirFicha(referencia: string, consulta: Record<string, unknown> = {}) {
    const rutFormateado = normalizarRut(referencia);
    const condicion: Prisma.cliente_financieroWhereInput = referencia.startsWith('id-')
      ? { id_cliente_financiero: identificador(referencia.slice(3)) }
      : { rut_cliente: { in: rutFormateado ? variantesRut(rutFormateado) : [referencia], mode: 'insensitive' } };
    return prisma.$transaction(async transaccion => {
      const cliente = await transaccion.cliente_financiero.findFirst({ where: condicion, include: {
        tipo_cliente_financiero: true,
        ficha_cliente: { include: {
          cotizacion: { include: incluirCotizacion, orderBy: { fecha_emision: 'desc' } },
          nota_venta: { include: incluirNota, orderBy: { fecha_emision: 'desc' } },
          pago_cliente: { include: incluirPago, orderBy: { fecha_pago: 'desc' } },
        } },
      } });
      if (!cliente) throw new ErrorAplicacion(404, 'Cliente no encontrado', 'CLIENTE_NO_ENCONTRADO');
      const ficha = cliente.ficha_cliente;
      const proyectos = cliente.rut_cliente ? await transaccion.proyecto.findMany({
        where: { rut_cliente: cliente.rut_cliente }, orderBy: { proyecto_fecha_ingreso: 'desc' },
      }) : [];
      const umbral = await transaccion.config_umbral_por_vencer.findFirst({ orderBy: { fecha: 'desc' } });
      const notas = ficha?.nota_venta || [];
      const estadosPago = new Map(await Promise.all(notas.map(async nota => [nota.id_nota_venta, await sincronizarEstadoPago(transaccion, nota)] as const)));
      const saldosPorMoneda = resumirNotas(notas);
      const consolidadoClp = consolidarNotasClp(notas);
      const esMoroso = saldosPorMoneda.some(saldo => saldo.obligacionesMorosas > 0);
      const tieneDeuda = saldosPorMoneda.some(saldo => saldo.saldoPendiente > 0);
      const pagos = (ficha?.pago_cliente || []).map(pago => ({ ...pago, montoEfectivo: efectoPago(pago).toNumber() }));
      const cotizaciones = ficha?.cotizacion || [];
      const atrasoPagoFinal = (nota: typeof notas[number]) => {
        const estado = estadosPago.get(nota.id_nota_venta);
        if (estado?.estadoPago !== 'pagada' || !nota.fecha_vencimiento) return null;
        const finales = nota.asignacion_pago_cliente.filter(asignacion => efectoPago(asignacion.pago_cliente).gt(0)).map(asignacion => asignacion.pago_cliente.fecha_pago);
        if (!finales.length) return null;
        const fechaPagoFinal = finales.reduce((mayor, fecha) => fecha > mayor ? fecha : mayor);
        if (fechaPagoFinal <= nota.fecha_vencimiento) return null;
        return Math.floor((Date.UTC(fechaPagoFinal.getUTCFullYear(), fechaPagoFinal.getUTCMonth(), fechaPagoFinal.getUTCDate()) - Date.UTC(nota.fecha_vencimiento.getUTCFullYear(), nota.fecha_vencimiento.getUTCMonth(), nota.fecha_vencimiento.getUTCDate())) / 86400000);
      };
      const tipoAntecedente = typeof consulta.tipoAntecedente === 'string' ? consulta.tipoAntecedente : 'todos';
      if (!['todos','cotizacion','nota_venta','pago','proyecto'].includes(tipoAntecedente)) throw new ErrorAplicacion(400, 'Tipo de antecedente inválido');
      const leerFecha = (valor: unknown, finDelDia = false) => {
        if (valor === undefined || valor === null || valor === '') return undefined;
        if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) throw new ErrorAplicacion(400, 'El período del historial debe usar formato AAAA-MM-DD');
        const fecha = new Date(`${valor}T${finDelDia ? '23:59:59.999' : '00:00:00.000'}Z`);
        if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0,10) !== valor) throw new ErrorAplicacion(400, 'El período del historial contiene una fecha inválida');
        return fecha;
      };
      const fechaDesde = leerFecha(consulta.fechaDesde);
      const fechaHasta = leerFecha(consulta.fechaHasta, true);
      if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) throw new ErrorAplicacion(400, 'El período del historial es inválido');
      const direccionHistorial = consulta.direccion === 'asc' ? 'asc' : 'desc';
      const historial = [
        ...cotizaciones.map(cotizacion => ({ tipo: 'cotizacion', id: cotizacion.id_cotizacion, fecha: cotizacion.fecha_emision, estado: cotizacion.estado_cotizacion })),
        ...notas.map(nota => ({ tipo: 'nota_venta', id: nota.id_nota_venta, fecha: nota.fecha_emision, estado: nota.estado_nota_venta })),
        ...pagos.map(pago => ({ tipo: 'pago', id: pago.id_pago_cliente, fecha: pago.fecha_pago, estado: pago.anulacion_pago ? 'anulado' : pago.reversion_pago.length ? 'revertido_parcial_o_total' : 'vigente' })),
        ...proyectos.map(proyecto => ({ tipo: 'proyecto', id: proyecto.proyecto_proyecto_id.toString(), fecha: proyecto.proyecto_fecha_ingreso, estado: proyecto.proyecto_estado_operacional })),
      ].filter(item => (tipoAntecedente === 'todos' || item.tipo === tipoAntecedente)
        && (!fechaDesde || !!item.fecha && item.fecha >= fechaDesde)
        && (!fechaHasta || !!item.fecha && item.fecha <= fechaHasta))
        .sort((primero, segundo) => ((primero.fecha?.getTime() || 0) - (segundo.fecha?.getTime() || 0)) * (direccionHistorial === 'asc' ? 1 : -1));
      return {
        resumen: {
          id_cliente_financiero: cliente.id_cliente_financiero, id_ficha_cliente: ficha?.id_ficha_cliente ?? null,
          rut_cliente: cliente.rut_cliente, nombre_razon_social_referencia: cliente.nombre_razon_social_referencia,
          nombre_tipo_cliente_financiero: cliente.tipo_cliente_financiero.nombre_tipo_cliente_financiero,
          telefono_financiero: cliente.telefono_financiero, correo_financiero: cliente.correo_financiero,
          contacto_financiero: cliente.contacto_financiero, estado_ficha: cliente.estado_financiero,
          nivelFormalizacion: cliente.nivel_formalizacion, incompleto: cliente.nivel_formalizacion === 'provisional',
          saldoDeudor: consolidadoClp.saldoPendiente, esMoroso, isMoroso: esMoroso,
          situacionFinanciera: esMoroso ? 'Moroso' : tieneDeuda ? 'Deuda vigente' : 'Al día',
          saldosPorMoneda, consolidadoClp,
        },
        resumen_dashboard: {
          total_ventas: consolidadoClp.montoComercialVigente, total_pagado: consolidadoClp.pagosEfectivos,
          total_deuda: consolidadoClp.deudaVigente, saldo_pendiente: consolidadoClp.saldoPendiente,
          obligaciones_morosas: consolidadoClp.obligacionesMorosas, saldosPorMoneda, consolidadoClp,
          proyectos_activos: proyectos.filter(proyecto => proyecto.proyecto_estado_operacional === 'activo').length,
          proyectos_terminados: proyectos.filter(proyecto => proyecto.proyecto_estado_operacional === 'terminado').length,
          cotizaciones: cotizaciones.filter(c => !consulta.estado || c.estado_cotizacion === consulta.estado).sort((a,b) => String(a.fecha_emision).localeCompare(String(b.fecha_emision)) * (consulta.direccion === 'desc' ? -1 : 1)), notas_venta: notas.map(nota => ({ ...nota, ...estadosPago.get(nota.id_nota_venta), diasAtrasoPagoFinal: atrasoPagoFinal(nota), clasificacionVencimiento: clasificarPorVencer(nota.fecha_vencimiento, umbral?.dias_habiles ?? 5),
            ficha_cliente: { cliente_financiero: { rut_cliente: cliente.rut_cliente, nombre_razon_social_referencia: cliente.nombre_razon_social_referencia } },
          })).filter(n => !consulta.estado || n.estado_nota_venta === consulta.estado).sort((a,b) => String(a.fecha_emision).localeCompare(String(b.fecha_emision)) * (consulta.direccion === 'desc' ? -1 : 1)), pagos, proyectos,
          saldosFavor: await transaccion.saldo_favor_cliente.findMany({ where: { id_cliente_financiero: cliente.id_cliente_financiero, monto_disponible: { gt: 0 } }, include: { nota_venta: true } }),
        },
        historial,
      };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
  }
  async contarClientesActivos() {
    return prisma.cliente_financiero.count({ where: { estado_financiero: 'activo' } });
  }
}
