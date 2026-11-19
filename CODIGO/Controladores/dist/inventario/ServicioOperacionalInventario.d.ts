import { type PrismaClient } from '@prisma/client';
import type { ActorAutenticado } from '../controladores/M4Controller';
type TipoOperacion = 'ENTRADA' | 'SALIDA' | 'RESERVA' | 'LIBERACION' | 'AJUSTE';
type EntradaBase = {
    claveIdempotencia: string;
    sku: string;
    bodegaId: string | number | bigint;
    loteId: string | number | bigint;
    motivo: string;
};
export type EntradaLiberacionInventario = EntradaBase;
export type EntradaMovimientoInventario = EntradaBase & {
    cantidad: string | number;
    tipoMovimientoId: string | number | bigint;
    motivoMovimientoId: string | number | bigint;
    proyectoId?: string | number | bigint;
    facturaCompraId?: string | number | bigint;
};
export type EntradaReservaInventario = EntradaBase & {
    cantidad: string | number;
    proyectoId?: string | number | bigint;
    ordenTrabajoId?: string | number | bigint;
};
export type EntradaAjusteInventario = EntradaBase & {
    cantidadNueva: string | number;
    tipoMovimientoId: string | number | bigint;
    motivoMovimientoId: string | number | bigint;
};
type ResultadoOperacion = {
    operacionId: string;
    tipo: TipoOperacion;
    movimientoId?: string;
    reservaId?: string;
    sku: string;
    bodegaId: string;
    loteId: string;
    fisico: string;
    reservado: string;
    disponible: string;
    repetida: boolean;
    __auditoriaM9?: {
        anterior: Record<string, unknown>;
        nuevo: Record<string, unknown>;
    };
};
/** Único owner de escrituras físicas INT-03. Las rutas públicas permanecen fail-closed hasta aprobar CU específicos. */
export declare class ServicioOperacionalInventario {
    private readonly db;
    constructor(db?: PrismaClient);
    private transaccion;
    private existenciaBloqueada;
    private catalogosMovimiento;
    private ejecutar;
    registrarEntrada(entrada: EntradaMovimientoInventario, actor: ActorAutenticado): Promise<ResultadoOperacion>;
    registrarSalida(entrada: EntradaMovimientoInventario, actor: ActorAutenticado): Promise<ResultadoOperacion>;
    crearReserva(entrada: EntradaReservaInventario, actor: ActorAutenticado): Promise<ResultadoOperacion>;
    liberarReserva(reservaIdEntrada: string | number | bigint, entrada: EntradaBase, actor: ActorAutenticado): Promise<ResultadoOperacion>;
    ajustarExistencia(entrada: EntradaAjusteInventario, actor: ActorAutenticado): Promise<ResultadoOperacion>;
}
export {};
//# sourceMappingURL=ServicioOperacionalInventario.d.ts.map