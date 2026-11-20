import { Prisma } from '@prisma/client';
import { prisma } from '../db';
type ClientePrisma = Prisma.TransactionClient | typeof prisma;
export declare function fichaB2B(tx: ClientePrisma, id: number): Promise<any>;
export declare function exposicionCredito(tx: ClientePrisma, idFicha?: number): Promise<Prisma.Decimal>;
export declare function limiteCreditoVigente(tx: ClientePrisma, referencia?: Date): Promise<{
    vigencia_desde: Date;
    vigencia_hasta: Date | null;
    motivo: string;
    monto_limite: Prisma.Decimal;
    creado_en: Date;
    id_limite_global: number;
    id_responsable: bigint;
    sustituido_en: Date | null;
} | {
    vigencia_desde: Date;
    vigencia_hasta: Date | null;
    motivo: string;
    monto_limite: Prisma.Decimal;
    creado_en: Date;
    id_limite_global: number;
    id_responsable: bigint;
    sustituido_en: Date | null;
}>;
export declare function validarCreditoParaFormalizacion(tx: Prisma.TransactionClient, entrada: {
    idFicha: number;
    montoFinanciado: Prisma.Decimal;
    idCotizacion?: number;
    idSolicitudExcepcion?: number;
}): Promise<{
    resultado: "REQUIERE_SOLICITUD_INICIAL";
    motivos: string[];
    idSolicitudExcepcion?: undefined;
} | {
    resultado: "AUTORIZADO";
    motivos: never[];
    idSolicitudExcepcion: null;
} | {
    resultado: "RESTRINGIDO";
    motivos: string[];
    idSolicitudExcepcion?: undefined;
} | {
    resultado: "AUTORIZADO";
    motivos: string[];
    idSolicitudExcepcion: number;
} | {
    resultado: "REQUIERE_EXCEPCION";
    motivos: string[];
    idSolicitudExcepcion?: undefined;
}>;
export declare function registrarCompromisoCredito(tx: Prisma.TransactionClient, entrada: {
    idFicha: number;
    idNota: number;
    montoFinanciado: Prisma.Decimal;
    idSolicitudExcepcion?: number | null;
}): Promise<{
    estado: string;
    id_nota_venta: number;
    id_ficha_cliente: number;
    monto_original: Prisma.Decimal;
    id_compromiso: number;
    id_solicitud_excepcion: number | null;
    monto_pendiente: Prisma.Decimal;
    condiciones: string | null;
    fecha_formalizacion: Date;
    fecha_liberacion: Date | null;
}>;
export declare function reducirCompromisoPorPago(tx: Prisma.TransactionClient, idPago: number, idNota: number, montoPago: Prisma.Decimal): Promise<{
    id_pago_cliente: number;
    id_compromiso: number;
    id_reduccion: number;
    monto_reduccion: Prisma.Decimal;
    fecha_reduccion: Date;
} | null>;
export {};
//# sourceMappingURL=creditoM8.d.ts.map