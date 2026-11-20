import { Prisma } from '@prisma/client';
type DecimalCompatible = Prisma.Decimal | {
    toString(): string;
} | number | string | null | undefined;
export declare const decimalInventario: (valor: DecimalCompatible) => Prisma.Decimal;
export declare const filtroReservaInventarioActiva: () => {
    reserva_inventario_fecha_liberacion: null;
    OR: ({
        reserva_inventario_estado_reserva: null;
    } | {
        reserva_inventario_estado_reserva: {
            notIn: string[];
        };
    })[];
};
export declare const esReservaInventarioActiva: (reserva: {
    reserva_inventario_fecha_liberacion?: Date | null;
    reserva_inventario_estado_reserva?: string | null;
}) => boolean;
export declare const esMovimientoInventarioEfectivo: (estado: string | null | undefined) => boolean;
export declare const cantidadPendienteCompraAbierta: (pedida: DecimalCompatible, recibida: DecimalCompatible, estado: string | null | undefined) => Prisma.Decimal;
export {};
//# sourceMappingURL=contratosInventario.d.ts.map