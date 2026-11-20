import { Prisma } from '@prisma/client';
export type OrigenPagoRemuneracion = {
    clase: 'remuneracion';
    id: number;
} | {
    clase: 'anticipo';
    id: number;
} | {
    clase: 'regularizacion';
    id: number;
} | {
    clase: 'boleta_honorarios';
    id: number;
};
type ClientePago = Pick<Prisma.TransactionClient, 'pago_remuneracion' | 'reversion_pago_remuneracion' | '$queryRaw'>;
export declare class RepositorioPagoRemuneracionPrisma {
    remuneracion(id: number): OrigenPagoRemuneracion;
    anticipo(id: number): OrigenPagoRemuneracion;
    regularizacion(id: number): OrigenPagoRemuneracion;
    boletaHonorarios(id: number): OrigenPagoRemuneracion;
    desdePersistencia(tipo: string, id: number): OrigenPagoRemuneracion;
    origenDesdePago(pago: {
        origen_tipo: string;
        origen_id: number;
    }): OrigenPagoRemuneracion;
    tipoPublico(origen: OrigenPagoRemuneracion): "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
    private criterio;
    bloquearOrigen(cliente: ClientePago, origen: OrigenPagoRemuneracion): Promise<void>;
    bloquearRemuneracion(cliente: ClientePago, id: number): Promise<void>;
    pagosConfirmadosAnticipo(cliente: ClientePago, idAnticipo: number): Promise<({
        medio_pago: {
            id_medio_pago: number;
            nombre_medio_pago: string;
            descripcion_medio_pago: string | null;
            estado_medio_pago: string;
            codigo_medio_pago: string | null;
            requiere_respaldo: boolean | null;
        };
        reversiones: {
            motivo: string;
            monto: Prisma.Decimal;
            registrado_por: bigint;
            id_pago_remuneracion: number;
            id_reversion_pago_remuneracion: number;
            registrado_en: Date;
        }[];
    } & {
        estado: string;
        id_medio_pago: number;
        creado_por: bigint;
        monto: Prisma.Decimal;
        motivo_anulacion: string | null;
        referencia: string | null;
        respaldo: string | null;
        confirmado_por: bigint | null;
        anulado_por: bigint | null;
        creado_en: Date;
        clave_idempotencia: string;
        id_pago_remuneracion: number;
        origen_tipo: string;
        origen_id: number;
        confirmado_en: Date | null;
        anulado_en: Date | null;
    })[]>;
    idsAnticiposConPagoConfirmado(cliente: ClientePago): Promise<number[]>;
    tienePagoEfectivo(cliente: ClientePago, origen: OrigenPagoRemuneracion): Promise<boolean>;
    buscarPagoEfectivo(cliente: ClientePago, origen: OrigenPagoRemuneracion): Promise<({
        reversiones: {
            motivo: string;
            monto: Prisma.Decimal;
            registrado_por: bigint;
            id_pago_remuneracion: number;
            id_reversion_pago_remuneracion: number;
            registrado_en: Date;
        }[];
    } & {
        estado: string;
        id_medio_pago: number;
        creado_por: bigint;
        monto: Prisma.Decimal;
        motivo_anulacion: string | null;
        referencia: string | null;
        respaldo: string | null;
        confirmado_por: bigint | null;
        anulado_por: bigint | null;
        creado_en: Date;
        clave_idempotencia: string;
        id_pago_remuneracion: number;
        origen_tipo: string;
        origen_id: number;
        confirmado_en: Date | null;
        anulado_en: Date | null;
    }) | null>;
    pagosEfectivosAnticipos(cliente: ClientePago, ids: number[]): Promise<{
        idAnticipo: number;
        idPago: number;
        montoEfectivo: Prisma.Decimal;
    }[]>;
    montoPagadoEfectivo(cliente: ClientePago, origen: OrigenPagoRemuneracion): Promise<Prisma.Decimal>;
    estadoEconomicoOrigen(cliente: ClientePago, origen: OrigenPagoRemuneracion, montoOriginal?: Prisma.Decimal): Promise<{
        montoOriginal: Prisma.Decimal | null;
        montoEfectivo: Prisma.Decimal;
        saldoPendiente: Prisma.Decimal | null;
        tienePago: boolean;
    }>;
    buscarPorClave(cliente: ClientePago, clave: string): Promise<{
        estado: string;
        id_medio_pago: number;
        creado_por: bigint;
        monto: Prisma.Decimal;
        motivo_anulacion: string | null;
        referencia: string | null;
        respaldo: string | null;
        confirmado_por: bigint | null;
        anulado_por: bigint | null;
        creado_en: Date;
        clave_idempotencia: string;
        id_pago_remuneracion: number;
        origen_tipo: string;
        origen_id: number;
        confirmado_en: Date | null;
        anulado_en: Date | null;
    } | null>;
    crearPreparado(cliente: ClientePago, origen: OrigenPagoRemuneracion, data: {
        monto: Prisma.Decimal;
        idMedioPago: number;
        respaldo: string | null;
        referencia: string | null;
        claveIdempotencia: string;
        creadoPor: bigint;
    }): Promise<{
        estado: string;
        id_medio_pago: number;
        creado_por: bigint;
        monto: Prisma.Decimal;
        motivo_anulacion: string | null;
        referencia: string | null;
        respaldo: string | null;
        confirmado_por: bigint | null;
        anulado_por: bigint | null;
        creado_en: Date;
        clave_idempotencia: string;
        id_pago_remuneracion: number;
        origen_tipo: string;
        origen_id: number;
        confirmado_en: Date | null;
        anulado_en: Date | null;
    }>;
    obtener(cliente: ClientePago, id: number, _incluirMedio?: boolean): Promise<({
        medio_pago: {
            id_medio_pago: number;
            nombre_medio_pago: string;
            descripcion_medio_pago: string | null;
            estado_medio_pago: string;
            codigo_medio_pago: string | null;
            requiere_respaldo: boolean | null;
        };
        reversiones: {
            motivo: string;
            monto: Prisma.Decimal;
            registrado_por: bigint;
            id_pago_remuneracion: number;
            id_reversion_pago_remuneracion: number;
            registrado_en: Date;
        }[];
    } & {
        estado: string;
        id_medio_pago: number;
        creado_por: bigint;
        monto: Prisma.Decimal;
        motivo_anulacion: string | null;
        referencia: string | null;
        respaldo: string | null;
        confirmado_por: bigint | null;
        anulado_por: bigint | null;
        creado_en: Date;
        clave_idempotencia: string;
        id_pago_remuneracion: number;
        origen_tipo: string;
        origen_id: number;
        confirmado_en: Date | null;
        anulado_en: Date | null;
    }) | null>;
    actualizarPreparado(cliente: ClientePago, id: number, data: {
        monto: Prisma.Decimal;
        idMedioPago: number;
        respaldo: string | null;
        referencia: string | null;
    }): Promise<{
        estado: string;
        id_medio_pago: number;
        creado_por: bigint;
        monto: Prisma.Decimal;
        motivo_anulacion: string | null;
        referencia: string | null;
        respaldo: string | null;
        confirmado_por: bigint | null;
        anulado_por: bigint | null;
        creado_en: Date;
        clave_idempotencia: string;
        id_pago_remuneracion: number;
        origen_tipo: string;
        origen_id: number;
        confirmado_en: Date | null;
        anulado_en: Date | null;
    }>;
    confirmarPreparado(cliente: ClientePago, id: number, idUsuario: bigint): Promise<Prisma.BatchPayload>;
    listar(cliente: ClientePago): Promise<({
        medio_pago: {
            id_medio_pago: number;
            nombre_medio_pago: string;
            descripcion_medio_pago: string | null;
            estado_medio_pago: string;
            codigo_medio_pago: string | null;
            requiere_respaldo: boolean | null;
        };
        reversiones: {
            motivo: string;
            monto: Prisma.Decimal;
            registrado_por: bigint;
            id_pago_remuneracion: number;
            id_reversion_pago_remuneracion: number;
            registrado_en: Date;
        }[];
    } & {
        estado: string;
        id_medio_pago: number;
        creado_por: bigint;
        monto: Prisma.Decimal;
        motivo_anulacion: string | null;
        referencia: string | null;
        respaldo: string | null;
        confirmado_por: bigint | null;
        anulado_por: bigint | null;
        creado_en: Date;
        clave_idempotencia: string;
        id_pago_remuneracion: number;
        origen_tipo: string;
        origen_id: number;
        confirmado_en: Date | null;
        anulado_en: Date | null;
    })[]>;
    listarPorOrigenes(cliente: ClientePago, origenes: OrigenPagoRemuneracion[]): Promise<({
        medio_pago: {
            id_medio_pago: number;
            nombre_medio_pago: string;
            descripcion_medio_pago: string | null;
            estado_medio_pago: string;
            codigo_medio_pago: string | null;
            requiere_respaldo: boolean | null;
        };
        reversiones: {
            motivo: string;
            monto: Prisma.Decimal;
            registrado_por: bigint;
            id_pago_remuneracion: number;
            id_reversion_pago_remuneracion: number;
            registrado_en: Date;
        }[];
    } & {
        estado: string;
        id_medio_pago: number;
        creado_por: bigint;
        monto: Prisma.Decimal;
        motivo_anulacion: string | null;
        referencia: string | null;
        respaldo: string | null;
        confirmado_por: bigint | null;
        anulado_por: bigint | null;
        creado_en: Date;
        clave_idempotencia: string;
        id_pago_remuneracion: number;
        origen_tipo: string;
        origen_id: number;
        confirmado_en: Date | null;
        anulado_en: Date | null;
    })[]>;
    anularConfirmado(cliente: ClientePago, id: number, motivo: string, idUsuario: bigint): Promise<Prisma.BatchPayload>;
    registrarReversion(cliente: ClientePago, idPago: number, monto: Prisma.Decimal, motivo: string, idUsuario: bigint): Promise<{
        motivo: string;
        monto: Prisma.Decimal;
        registrado_por: bigint;
        id_pago_remuneracion: number;
        id_reversion_pago_remuneracion: number;
        registrado_en: Date;
    }>;
}
export {};
//# sourceMappingURL=RepositorioPagoRemuneracion.d.ts.map