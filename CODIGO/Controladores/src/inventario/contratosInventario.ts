import { Prisma } from '@prisma/client';

type DecimalCompatible = Prisma.Decimal | { toString(): string } | number | string | null | undefined;

const normalizarEstado = (estado: string | null | undefined) => (estado || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .trim()
  .toLowerCase();

const ESTADOS_RESERVA_INACTIVA = new Set(['liberada', 'cancelada']);
const ESTADOS_MOVIMIENTO_SIN_EFECTO = new Set(['anulado', 'anulada', 'revertido', 'revertida']);

export const decimalInventario = (valor: DecimalCompatible) => new Prisma.Decimal(valor?.toString() || 0);

export const filtroReservaInventarioActiva = () => ({
  reserva_inventario_fecha_liberacion: null,
  OR: [
    { reserva_inventario_estado_reserva: null },
    { reserva_inventario_estado_reserva: { notIn: [...ESTADOS_RESERVA_INACTIVA] } },
  ],
});

export const esReservaInventarioActiva = (reserva: {
  reserva_inventario_fecha_liberacion?: Date | null;
  reserva_inventario_estado_reserva?: string | null;
}) => reserva.reserva_inventario_fecha_liberacion == null
  && !ESTADOS_RESERVA_INACTIVA.has(normalizarEstado(reserva.reserva_inventario_estado_reserva));

export const esMovimientoInventarioEfectivo = (estado: string | null | undefined) =>
  !ESTADOS_MOVIMIENTO_SIN_EFECTO.has(normalizarEstado(estado));

export const cantidadPendienteCompraAbierta = (
  pedida: DecimalCompatible,
  recibida: DecimalCompatible,
  estado: string | null | undefined,
) => {
  if (normalizarEstado(estado) !== 'abierta') return new Prisma.Decimal(0);
  const pendiente = decimalInventario(pedida).minus(decimalInventario(recibida));
  return pendiente.isPositive() ? pendiente : new Prisma.Decimal(0);
};
