"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cantidadPendienteCompraAbierta = exports.esMovimientoInventarioEfectivo = exports.esReservaInventarioActiva = exports.filtroReservaInventarioActiva = exports.decimalInventario = void 0;
const client_1 = require("@prisma/client");
const normalizarEstado = (estado) => (estado || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();
const ESTADOS_RESERVA_INACTIVA = new Set(['liberada', 'cancelada']);
const ESTADOS_MOVIMIENTO_SIN_EFECTO = new Set(['anulado', 'anulada', 'revertido', 'revertida']);
const decimalInventario = (valor) => new client_1.Prisma.Decimal(valor?.toString() || 0);
exports.decimalInventario = decimalInventario;
const filtroReservaInventarioActiva = () => ({
    reserva_inventario_fecha_liberacion: null,
    OR: [
        { reserva_inventario_estado_reserva: null },
        { reserva_inventario_estado_reserva: { notIn: [...ESTADOS_RESERVA_INACTIVA] } },
    ],
});
exports.filtroReservaInventarioActiva = filtroReservaInventarioActiva;
const esReservaInventarioActiva = (reserva) => reserva.reserva_inventario_fecha_liberacion == null
    && !ESTADOS_RESERVA_INACTIVA.has(normalizarEstado(reserva.reserva_inventario_estado_reserva));
exports.esReservaInventarioActiva = esReservaInventarioActiva;
const esMovimientoInventarioEfectivo = (estado) => !ESTADOS_MOVIMIENTO_SIN_EFECTO.has(normalizarEstado(estado));
exports.esMovimientoInventarioEfectivo = esMovimientoInventarioEfectivo;
const cantidadPendienteCompraAbierta = (pedida, recibida, estado) => {
    if (normalizarEstado(estado) !== 'abierta')
        return new client_1.Prisma.Decimal(0);
    const pendiente = (0, exports.decimalInventario)(pedida).minus((0, exports.decimalInventario)(recibida));
    return pendiente.isPositive() ? pendiente : new client_1.Prisma.Decimal(0);
};
exports.cantidadPendienteCompraAbierta = cantidadPendienteCompraAbierta;
//# sourceMappingURL=contratosInventario.js.map