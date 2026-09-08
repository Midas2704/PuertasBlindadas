import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { calcularNota, efectoPago, incluirCotizacion, incluirNota, incluirPago, resumirNotas } from '../utilidades/finanzas';
import { FiltrosClientes, identificador } from '../validaciones/solicitudes';

/** M1 CU01–CU11. Etapa inicial: CU05–CU09; altas y mantenimiento se incorporarán por etapa. */
export class M1Controller {
  async listarClientes(filtros: FiltrosClientes) {
    const condicion: Prisma.cliente_financieroWhereInput = {};
    if (filtros.estado !== 'todos') condicion.estado_financiero = filtros.estado === 'activos' ? 'activo' : 'inactivo';
    const clientes = await prisma.cliente_financiero.findMany({
      where: condicion, orderBy: [{ nombre_razon_social_referencia: 'asc' }, { id_cliente_financiero: 'asc' }],
      include: { tipo_cliente_financiero: true, ficha_cliente: { include: { nota_venta: { include: incluirNota } } } },
    });
    // La base heredada mezcla RUT con y sin puntos. Normalizar para buscar sin alterar identidades.
    const busqueda = filtros.busqueda.toLocaleLowerCase('es-CL');
    const rutBuscado = busqueda.replace(/\./g, '');
    return clientes.filter(cliente => !busqueda || cliente.nombre_razon_social_referencia.toLocaleLowerCase('es-CL').includes(busqueda)
      || !!cliente.rut_cliente?.replace(/\./g, '').toLowerCase().includes(rutBuscado)).map(cliente => {
      const saldosPorMoneda = resumirNotas(cliente.ficha_cliente?.nota_venta || []);
      const esMoroso = saldosPorMoneda.some(saldo => saldo.obligacionesMorosas > 0);
      const tieneDeuda = saldosPorMoneda.some(saldo => saldo.saldoPendiente > 0);
      return {
        id_cliente_financiero: cliente.id_cliente_financiero,
        id_ficha_cliente: cliente.ficha_cliente?.id_ficha_cliente ?? null,
        referencia: `id-${cliente.id_cliente_financiero}`, rut: cliente.rut_cliente,
        razonSocial: cliente.nombre_razon_social_referencia,
        telefono: cliente.telefono_financiero, correo: cliente.correo_financiero,
        tipoCliente: cliente.tipo_cliente_financiero.nombre_tipo_cliente_financiero,
        estado: cliente.estado_financiero, nivelFormalizacion: cliente.nivel_formalizacion,
        incompleto: cliente.nivel_formalizacion === 'provisional',
        saldoDeudor: saldosPorMoneda.find(saldo => saldo.moneda === 'CLP')?.saldoPendiente || 0,
        saldosPorMoneda, tieneDeuda, esMoroso, isMoroso: esMoroso,
        situacionFinanciera: esMoroso ? 'Moroso' : tieneDeuda ? 'Deuda vigente' : 'Al día',
      };
    }).filter(cliente => (!filtros.deuda || cliente.tieneDeuda) && (!filtros.morosos || cliente.esMoroso));
  }

  async abrirFicha(referencia: string) {
    const rut = referencia.replace(/\./g, '').toUpperCase();
    const partes = rut.split('-');
    const rutFormateado = `${partes[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${partes[1]}`;
    const condicion: Prisma.cliente_financieroWhereInput = referencia.startsWith('id-')
      ? { id_cliente_financiero: identificador(referencia.slice(3)) }
      : { rut_cliente: { in: [rut, rutFormateado], mode: 'insensitive' } };
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
      const notas = ficha?.nota_venta || [];
      const saldosPorMoneda = resumirNotas(notas);
      const pesos = saldosPorMoneda.find(saldo => saldo.moneda === 'CLP');
      const esMoroso = saldosPorMoneda.some(saldo => saldo.obligacionesMorosas > 0);
      const tieneDeuda = saldosPorMoneda.some(saldo => saldo.saldoPendiente > 0);
      const pagos = (ficha?.pago_cliente || []).map(pago => ({ ...pago, montoEfectivo: efectoPago(pago).toNumber() }));
      const cotizaciones = ficha?.cotizacion || [];
      return {
        resumen: {
          id_cliente_financiero: cliente.id_cliente_financiero, id_ficha_cliente: ficha?.id_ficha_cliente ?? null,
          rut_cliente: cliente.rut_cliente, nombre_razon_social_referencia: cliente.nombre_razon_social_referencia,
          nombre_tipo_cliente_financiero: cliente.tipo_cliente_financiero.nombre_tipo_cliente_financiero,
          telefono_financiero: cliente.telefono_financiero, correo_financiero: cliente.correo_financiero,
          contacto_financiero: cliente.contacto_financiero, estado_ficha: cliente.estado_financiero,
          nivelFormalizacion: cliente.nivel_formalizacion, incompleto: cliente.nivel_formalizacion === 'provisional',
          saldoDeudor: pesos?.saldoPendiente || 0, esMoroso, isMoroso: esMoroso,
          situacionFinanciera: esMoroso ? 'Moroso' : tieneDeuda ? 'Deuda vigente' : 'Al día',
          saldosPorMoneda,
        },
        resumen_dashboard: {
          total_ventas: pesos?.montoComercialVigente || 0, total_pagado: pesos?.pagosEfectivos || 0,
          total_deuda: pesos?.deudaVigente || 0, saldo_pendiente: pesos?.saldoPendiente || 0,
          obligaciones_morosas: pesos?.obligacionesMorosas || 0, saldosPorMoneda,
          proyectos_activos: proyectos.filter(proyecto => proyecto.proyecto_estado_operacional === 'activo').length,
          proyectos_terminados: proyectos.filter(proyecto => proyecto.proyecto_estado_operacional === 'terminado').length,
          cotizaciones, notas_venta: notas.map(nota => ({ ...nota, ...calcularNota(nota),
            ficha_cliente: { cliente_financiero: { rut_cliente: cliente.rut_cliente, nombre_razon_social_referencia: cliente.nombre_razon_social_referencia } },
          })), pagos, proyectos,
        },
        historial: [
          ...cotizaciones.map(cotizacion => ({ tipo: 'cotizacion', id: cotizacion.id_cotizacion, fecha: cotizacion.fecha_emision, estado: cotizacion.estado_cotizacion })),
          ...notas.map(nota => ({ tipo: 'nota_venta', id: nota.id_nota_venta, fecha: nota.fecha_emision, estado: nota.estado_nota_venta })),
          ...pagos.map(pago => ({ tipo: 'pago', id: pago.id_pago_cliente, fecha: pago.fecha_pago, estado: pago.anulacion_pago ? 'anulado' : pago.reversion_pago.length ? 'revertido_parcial_o_total' : 'vigente' })),
          ...proyectos.map(proyecto => ({ tipo: 'proyecto', id: proyecto.proyecto_proyecto_id.toString(), fecha: proyecto.proyecto_fecha_ingreso, estado: proyecto.proyecto_estado_operacional })),
        ].sort((primero, segundo) => (segundo.fecha?.getTime() || 0) - (primero.fecha?.getTime() || 0)),
      };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
  }
  async contarClientesActivos() {
    return prisma.cliente_financiero.count({ where: { estado_financiero: 'activo' } });
  }
}
