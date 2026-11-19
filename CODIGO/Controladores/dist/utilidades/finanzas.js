"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fechaRegistro = exports.fechaNegocio = exports.incluirCotizacion = exports.incluirNota = exports.incluirPago = void 0;
exports.totalLineasComerciales = totalLineasComerciales;
exports.diasHabilesEntre = diasHabilesEntre;
exports.clasificarPorVencer = clasificarPorVencer;
exports.efectoPago = efectoPago;
exports.montosNota = montosNota;
exports.calcularNota = calcularNota;
exports.resumirNotas = resumirNotas;
exports.consolidarNotasClp = consolidarNotasClp;
exports.estadoVisibleNota = estadoVisibleNota;
exports.sincronizarEstadoPago = sincronizarEstadoPago;
const client_1 = require("@prisma/client");
exports.incluirPago = {
    medio_pago: true, moneda: true, categoria_pago: true,
    anulacion_pago: true, reversion_pago: true,
};
exports.incluirNota = {
    moneda: true, reversion_nota_venta: true, aplicacion_saldo_favor: true,
    asignacion_pago_cliente: { include: { pago_cliente: { include: exports.incluirPago } } },
    documento_tributario: { include: { tipo_documento: true } },
    guia_despacho: true, condicion_cobro_nv: true,
    cotizacion: { include: { detalle_cotizacion: { include: { item_comercial: true } } } },
};
exports.incluirCotizacion = {
    moneda: true, ficha_cliente: { include: { cliente_financiero: { include: { tipo_cliente_financiero: true } } } },
    tarifa_instalacion: { include: { moneda: true } }, condicion_comercial: { include: { condicion: true } },
    obra_contexto: true,
    detalle_cotizacion: { include: {
            item_comercial: true, producto_comercial: true, producto_version: true, precio_comercial: true,
            detalle_costo_material_cotizacion: { include: { historial_precio_material: { include: { material: true } } } },
        } },
    grupos_alternativas_b2c: { include: {
            alternativas: { include: { opcionales: true }, orderBy: { numero_alternativa: 'asc' } },
        }, orderBy: { numero_grupo: 'asc' } },
    contactos_b2b: { where: { estado: 'ACTIVO' }, orderBy: [{ es_principal: 'desc' }, { creado_en: 'asc' }] },
    detalles_servicio: { include: { servicio: true, precio: true } },
};
const cero = () => new client_1.Prisma.Decimal(0);
/** Suma monetaria autoritativa de líneas: cantidad × valor unitario. */
function totalLineasComerciales(lineas) {
    return lineas.reduce((total, linea) => total.plus(new client_1.Prisma.Decimal(linea.cantidad).mul(linea.valor)), cero()).toDecimalPlaces(2);
}
// LUNA: la fecha del negocio tiene su propio reloj, el de Santiago
const fechaNegocio = (ahora = new Date()) => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(ahora);
exports.fechaNegocio = fechaNegocio;
const fechaRegistro = (fecha) => fecha.toISOString().slice(0, 10);
exports.fechaRegistro = fechaRegistro;
function diasHabilesEntre(desde, hasta = (0, exports.fechaNegocio)()) {
    const inicio = new Date(`${desde}T00:00:00Z`);
    const fin = new Date(`${hasta}T00:00:00Z`);
    if (inicio.getTime() === fin.getTime())
        return 0;
    const signo = inicio < fin ? 1 : -1;
    const cursor = signo > 0 ? new Date(inicio) : new Date(fin);
    const limite = signo > 0 ? fin : inicio;
    let cuenta = 0;
    for (; cursor < limite; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
        const dia = cursor.getUTCDay();
        if (dia !== 0 && dia !== 6)
            cuenta++;
    }
    return signo * cuenta;
}
function clasificarPorVencer(fecha, umbral) {
    if (!fecha)
        return 'sin_vencimiento';
    const dias = diasHabilesEntre((0, exports.fechaRegistro)(new Date()), (0, exports.fechaRegistro)(fecha));
    return dias >= 0 && dias <= umbral ? 'por_vencer' : dias < 0 ? 'vencida' : 'vigente';
}
// acá calculamos con los datos recibidos, sin ir a buscar nada a la BD
function efectoPago(pago) {
    if (pago.anulacion_pago || ['anulado', 'rechazado'].includes(pago.estado_verificacion))
        return cero();
    const revertido = pago.reversion_pago.reduce((suma, movimiento) => suma.plus(movimiento.monto), cero());
    return client_1.Prisma.Decimal.max(0, pago.monto_pago.minus(revertido));
}
function montosNota(nota) {
    const retiroComercial = ['anulada', 'revertida', 'revertida_total', 'provisional'].includes(nota.estado_nota_venta.toLowerCase());
    const reversiones = nota.reversion_nota_venta.reduce((suma, movimiento) => suma.plus(movimiento.monto), cero());
    const montoComercialVigente = retiroComercial ? cero() : client_1.Prisma.Decimal.max(0, nota.monto_total.minus(reversiones));
    const pagosEfectivos = nota.asignacion_pago_cliente.reduce((suma, asignacion) => suma.plus(client_1.Prisma.Decimal.min(asignacion.monto_asignado, efectoPago(asignacion.pago_cliente))), cero());
    const saldoAplicado = nota.aplicacion_saldo_favor.reduce((suma, aplicacion) => suma.plus(aplicacion.monto), cero());
    const saldoResultante = montoComercialVigente.minus(pagosEfectivos).minus(saldoAplicado);
    return {
        montoComercialVigente,
        pagosEfectivos,
        saldoAplicado,
        saldoResultante,
        saldoPendiente: client_1.Prisma.Decimal.max(0, saldoResultante),
        excedente: client_1.Prisma.Decimal.max(0, saldoResultante.negated()),
    };
}
function calcularNota(nota, hoy = (0, exports.fechaNegocio)()) {
    // Midas: el monto original se queda quieto; las reversiones van aparte
    const { montoComercialVigente, pagosEfectivos, saldoAplicado, saldoResultante, saldoPendiente, excedente } = montosNota(nota);
    const esMorosa = saldoPendiente.gt(0) && !!nota.fecha_vencimiento && (0, exports.fechaRegistro)(nota.fecha_vencimiento) < hoy;
    return {
        montoOriginal: nota.monto_total.toNumber(), montoComercialVigente: montoComercialVigente.toNumber(),
        pagosEfectivos: pagosEfectivos.toNumber(), saldoAplicado: saldoAplicado.toNumber(),
        saldoResultante: saldoResultante.toNumber(), saldoPendiente: saldoPendiente.toNumber(), excedente: excedente.toNumber(),
        esMorosa, fechaVencimientoPendiente: !nota.fecha_vencimiento && saldoPendiente.gt(0),
        estadoPago: saldoPendiente.isZero() ? 'pagada' : saldoPendiente.eq(montoComercialVigente) ? 'pendiente' : 'parcial',
    };
}
function resumirNotas(notas) {
    // ojo: CLP y USD se resumen por separado
    const agrupados = new Map();
    for (const nota of notas) {
        const codigo = nota.moneda.codigo_moneda;
        const resumen = agrupados.get(codigo) || { moneda: codigo, montoComercialVigente: cero(), pagosEfectivos: cero(), saldoPendiente: cero(), deudaVigente: cero(), obligacionesMorosas: cero(), excedente: cero() };
        const calculo = calcularNota(nota);
        resumen.montoComercialVigente = resumen.montoComercialVigente.plus(calculo.montoComercialVigente);
        resumen.pagosEfectivos = resumen.pagosEfectivos.plus(calculo.pagosEfectivos);
        resumen.saldoPendiente = resumen.saldoPendiente.plus(calculo.saldoPendiente);
        resumen.deudaVigente = resumen.deudaVigente.plus(calculo.esMorosa ? 0 : calculo.saldoPendiente);
        resumen.obligacionesMorosas = resumen.obligacionesMorosas.plus(calculo.esMorosa ? calculo.saldoPendiente : 0);
        resumen.excedente = resumen.excedente.plus(calculo.excedente);
        agrupados.set(codigo, resumen);
    }
    return [...agrupados.values()].map(resumen => ({
        moneda: resumen.moneda, montoComercialVigente: resumen.montoComercialVigente.toNumber(),
        pagosEfectivos: resumen.pagosEfectivos.toNumber(), saldoPendiente: resumen.saldoPendiente.toNumber(),
        deudaVigente: resumen.deudaVigente.toNumber(), obligacionesMorosas: resumen.obligacionesMorosas.toNumber(),
        excedente: resumen.excedente.toNumber(),
    }));
}
/** Consolida en CLP usando exclusivamente la conversión histórica guardada en cada NV. */
function consolidarNotasClp(notas) {
    const totales = {
        montoComercialVigente: cero(), pagosEfectivos: cero(), saldoPendiente: cero(),
        deudaVigente: cero(), obligacionesMorosas: cero(), excedente: cero(),
    };
    const operacionesSinConversion = [];
    for (const nota of notas) {
        const codigo = nota.moneda.codigo_moneda.toUpperCase();
        let factor = codigo === 'CLP' ? new client_1.Prisma.Decimal(1) : null;
        if (!factor && nota.tipo_cambio_usado?.gt(0))
            factor = nota.tipo_cambio_usado;
        if (!factor && nota.monto_convertido?.gt(0) && nota.monto_total.gt(0))
            factor = nota.monto_convertido.div(nota.monto_total);
        if (!factor) {
            operacionesSinConversion.push({ idNota: nota.id_nota_venta, numeroNota: nota.numero_nota_venta, moneda: codigo });
            continue;
        }
        const calculo = calcularNota(nota);
        totales.montoComercialVigente = totales.montoComercialVigente.plus(new client_1.Prisma.Decimal(calculo.montoComercialVigente).mul(factor));
        totales.pagosEfectivos = totales.pagosEfectivos.plus(new client_1.Prisma.Decimal(calculo.pagosEfectivos).mul(factor));
        totales.saldoPendiente = totales.saldoPendiente.plus(new client_1.Prisma.Decimal(calculo.saldoPendiente).mul(factor));
        totales.deudaVigente = totales.deudaVigente.plus(new client_1.Prisma.Decimal(calculo.esMorosa ? 0 : calculo.saldoPendiente).mul(factor));
        totales.obligacionesMorosas = totales.obligacionesMorosas.plus(new client_1.Prisma.Decimal(calculo.esMorosa ? calculo.saldoPendiente : 0).mul(factor));
        totales.excedente = totales.excedente.plus(new client_1.Prisma.Decimal(calculo.excedente).mul(factor));
    }
    return {
        moneda: 'CLP',
        montoComercialVigente: totales.montoComercialVigente.toDecimalPlaces(2).toNumber(),
        pagosEfectivos: totales.pagosEfectivos.toDecimalPlaces(2).toNumber(),
        saldoPendiente: totales.saldoPendiente.toDecimalPlaces(2).toNumber(),
        deudaVigente: totales.deudaVigente.toDecimalPlaces(2).toNumber(),
        obligacionesMorosas: totales.obligacionesMorosas.toDecimalPlaces(2).toNumber(),
        excedente: totales.excedente.toDecimalPlaces(2).toNumber(),
        operacionesSinConversion,
        cantidadSinConversion: operacionesSinConversion.length,
    };
}
function estadoVisibleNota(nota, estadoPago = calcularNota(nota).estadoPago) {
    if (['anulada', 'revertida', 'revertida_total', 'provisional'].includes(nota.estado_nota_venta.toLowerCase()))
        return nota.estado_nota_venta;
    if (estadoPago === 'parcial')
        return 'parcialmente_pagada';
    if (estadoPago === 'pagada')
        return 'pagada';
    return nota.estado_nota_venta;
}
/** Mantiene la columna de consulta estado_pago alineada con los movimientos vigentes. */
async function sincronizarEstadoPago(tx, nota) {
    const calculo = calcularNota(nota);
    const conservaEstado = ['anulada', 'revertida', 'revertida_total', 'provisional'].includes(nota.estado_nota_venta.toLowerCase());
    const estadoPago = conservaEstado ? nota.estado_pago : calculo.estadoPago;
    if (!conservaEstado && nota.estado_pago !== estadoPago) {
        await tx.nota_venta.update({ where: { id_nota_venta: nota.id_nota_venta }, data: { estado_pago: estadoPago } });
    }
    return { ...calculo, estado_pago: estadoPago, estadoNotaVentaVisible: estadoVisibleNota(nota, estadoPago) };
}
//# sourceMappingURL=finanzas.js.map