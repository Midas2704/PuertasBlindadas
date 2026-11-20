"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioPagoRemuneracionPrisma = void 0;
const client_1 = require("@prisma/client");
const tiposFisicos = {
    remuneracion: 'REMUNERACION',
    anticipo: 'ANTICIPO',
    regularizacion: 'REGULARIZACION',
    boleta_honorarios: 'BOLETA_HONORARIOS',
};
class RepositorioPagoRemuneracionPrisma {
    remuneracion(id) { return { clase: 'remuneracion', id }; }
    anticipo(id) { return { clase: 'anticipo', id }; }
    regularizacion(id) { return { clase: 'regularizacion', id }; }
    boletaHonorarios(id) { return { clase: 'boleta_honorarios', id }; }
    desdePersistencia(tipo, id) {
        if (tipo === tiposFisicos.remuneracion)
            return this.remuneracion(id);
        if (tipo === tiposFisicos.anticipo)
            return this.anticipo(id);
        if (tipo === tiposFisicos.regularizacion)
            return this.regularizacion(id);
        if (tipo === tiposFisicos.boleta_honorarios)
            return this.boletaHonorarios(id);
        throw new Error(`Tipo físico de origen de pago no soportado: ${tipo}`);
    }
    origenDesdePago(pago) {
        return this.desdePersistencia(pago.origen_tipo, pago.origen_id);
    }
    tipoPublico(origen) { return tiposFisicos[origen.clase]; }
    criterio(origen) {
        return { origen_tipo: tiposFisicos[origen.clase], origen_id: origen.id };
    }
    async bloquearOrigen(cliente, origen) {
        const tipo = tiposFisicos[origen.clase];
        await cliente.$queryRaw(client_1.Prisma.sql `SELECT pg_advisory_xact_lock(hashtext(${tipo})::integer, ${origen.id}::integer)::text AS lock_result`);
    }
    async bloquearRemuneracion(cliente, id) {
        await cliente.$queryRaw(client_1.Prisma.sql `SELECT id_remuneracion FROM finanzas.remuneracion WHERE id_remuneracion = ${id} FOR UPDATE`);
    }
    async pagosConfirmadosAnticipo(cliente, idAnticipo) {
        return cliente.pago_remuneracion.findMany({
            where: { origen_tipo: tiposFisicos.anticipo, origen_id: idAnticipo, confirmado_en: { not: null } },
            include: { medio_pago: true, reversiones: true },
            orderBy: { confirmado_en: 'asc' },
        });
    }
    async idsAnticiposConPagoConfirmado(cliente) {
        const pagos = await cliente.pago_remuneracion.findMany({
            where: { origen_tipo: tiposFisicos.anticipo, confirmado_en: { not: null } },
            select: { origen_id: true }, distinct: ['origen_id'],
        });
        return pagos.map((pago) => pago.origen_id);
    }
    async tienePagoEfectivo(cliente, origen) {
        return (await this.estadoEconomicoOrigen(cliente, origen)).montoEfectivo.gt(0);
    }
    async buscarPagoEfectivo(cliente, origen) {
        const pagos = await cliente.pago_remuneracion.findMany({ where: { ...this.criterio(origen), estado: 'CONFIRMADO' }, include: { reversiones: true } });
        return pagos.find((pago) => pago.monto.minus(pago.reversiones.reduce((suma, item) => suma.plus(item.monto), new client_1.Prisma.Decimal(0))).gt(0)) ?? null;
    }
    async pagosEfectivosAnticipos(cliente, ids) {
        if (!ids.length)
            return [];
        const filas = await cliente.pago_remuneracion.findMany({ where: { origen_tipo: tiposFisicos.anticipo, origen_id: { in: ids }, estado: 'CONFIRMADO' }, include: { reversiones: true }, orderBy: { id_pago_remuneracion: 'asc' } });
        const acumulados = new Map();
        for (const fila of filas) {
            const neto = fila.monto.minus(fila.reversiones.reduce((suma, item) => suma.plus(item.monto), new client_1.Prisma.Decimal(0)));
            const previo = acumulados.get(fila.origen_id);
            acumulados.set(fila.origen_id, { idAnticipo: fila.origen_id, idPago: fila.id_pago_remuneracion, montoEfectivo: (previo?.montoEfectivo ?? new client_1.Prisma.Decimal(0)).plus(neto) });
        }
        return [...acumulados.values()].filter((fila) => fila.montoEfectivo.gt(0));
    }
    async montoPagadoEfectivo(cliente, origen) {
        const pagos = await cliente.pago_remuneracion.findMany({ where: this.criterio(origen), include: { reversiones: true } });
        return pagos.reduce((total, pago) => pago.estado === 'CONFIRMADO' ? total.plus(pago.monto).minus(pago.reversiones.reduce((suma, item) => suma.plus(item.monto), new client_1.Prisma.Decimal(0))) : total, new client_1.Prisma.Decimal(0));
    }
    async estadoEconomicoOrigen(cliente, origen, montoOriginal) {
        const montoEfectivo = await this.montoPagadoEfectivo(cliente, origen);
        const saldoPendiente = montoOriginal === undefined ? null : client_1.Prisma.Decimal.max(montoOriginal.minus(montoEfectivo), new client_1.Prisma.Decimal(0));
        return { montoOriginal: montoOriginal ?? null, montoEfectivo, saldoPendiente, tienePago: montoEfectivo.gt(0) };
    }
    async buscarPorClave(cliente, clave) {
        return cliente.pago_remuneracion.findUnique({ where: { clave_idempotencia: clave } });
    }
    async crearPreparado(cliente, origen, data) {
        return cliente.pago_remuneracion.create({ data: {
                ...this.criterio(origen), monto: data.monto, id_medio_pago: data.idMedioPago,
                respaldo: data.respaldo, referencia: data.referencia,
                clave_idempotencia: data.claveIdempotencia, creado_por: data.creadoPor,
            } });
    }
    async obtener(cliente, id, _incluirMedio = false) {
        return cliente.pago_remuneracion.findUnique({
            where: { id_pago_remuneracion: id },
            include: { medio_pago: true, reversiones: { orderBy: { registrado_en: 'asc' } } },
        });
    }
    async actualizarPreparado(cliente, id, data) {
        return cliente.pago_remuneracion.update({ where: { id_pago_remuneracion: id }, data: {
                monto: data.monto, id_medio_pago: data.idMedioPago, respaldo: data.respaldo, referencia: data.referencia,
            } });
    }
    async confirmarPreparado(cliente, id, idUsuario) {
        return cliente.pago_remuneracion.updateMany({
            where: { id_pago_remuneracion: id, estado: 'PREPARADO' },
            data: { estado: 'CONFIRMADO', confirmado_por: idUsuario, confirmado_en: new Date() },
        });
    }
    async listar(cliente) {
        return cliente.pago_remuneracion.findMany({ include: { medio_pago: true, reversiones: true }, orderBy: { creado_en: 'desc' }, take: 100 });
    }
    async listarPorOrigenes(cliente, origenes) {
        if (!origenes.length)
            return [];
        return cliente.pago_remuneracion.findMany({
            where: { OR: origenes.map(origen => this.criterio(origen)) },
            include: { medio_pago: true, reversiones: { orderBy: { registrado_en: 'asc' } } },
            orderBy: { creado_en: 'asc' },
        });
    }
    async anularConfirmado(cliente, id, motivo, idUsuario) {
        return cliente.pago_remuneracion.updateMany({ where: { id_pago_remuneracion: id, estado: 'CONFIRMADO', reversiones: { none: {} } }, data: { estado: 'ANULADO', motivo_anulacion: motivo, anulado_por: idUsuario, anulado_en: new Date() } });
    }
    async registrarReversion(cliente, idPago, monto, motivo, idUsuario) {
        return cliente.reversion_pago_remuneracion.create({ data: { id_pago_remuneracion: idPago, monto, motivo, registrado_por: idUsuario } });
    }
}
exports.RepositorioPagoRemuneracionPrisma = RepositorioPagoRemuneracionPrisma;
//# sourceMappingURL=RepositorioPagoRemuneracion.js.map