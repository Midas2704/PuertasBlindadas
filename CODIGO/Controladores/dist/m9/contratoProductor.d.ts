import type { M9Controller } from '../controladores/M9Controller';
import type { ActorAutenticado } from '../controladores/M4Controller';
import type { EventoEntradaM9 } from './tipos';
export declare const VERSION_CONTRATO_M9 = "1.0";
export declare const VERSIONES_COMPATIBLES_M9: readonly ["1.0"];
export declare const PRODUCTORES_AUTORIZADOS_M9: readonly ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "INVENTARIO", "M9"];
export type ProductorM9 = typeof PRODUCTORES_AUTORIZADOS_M9[number];
export type AcuseM9 = {
    estado: 'ACK';
    identidadLogica: string;
    eventoId: number;
} | {
    estado: 'PENDIENTE';
    identidadLogica: string;
} | {
    estado: 'NACK';
    identidadLogica: string;
    codigo: string;
};
export type EspecificacionAuditableM9 = {
    modulo: Exclude<ProductorM9, 'M9'>;
    operacion: string;
    entidad: string;
    critico: boolean;
    consultaSensible?: boolean;
    motivoRequerido?: boolean;
};
export declare const CATALOGO_PRODUCTORES_M9: Record<string, EspecificacionAuditableM9>;
type SolicitudProductorM9 = {
    parametros?: Record<string, unknown>;
    cuerpo?: Record<string, unknown>;
    idSolicitud?: string;
    ocurridoEn?: string;
};
type ReceptorM9 = Pick<M9Controller, 'recibir'>;
export declare class ProductorAuditoriaM9 {
    private readonly receptor;
    private readonly timeoutMs;
    constructor(receptor: ReceptorM9, timeoutMs?: number);
    private entrada;
    private enviar;
    ejecutar<T>(operacionOwner: string, actor: ActorAutenticado, solicitud: SolicitudProductorM9, ejecutarOwner: () => Promise<T>): Promise<T>;
    ejecutarCritico<TPreparado, TResult>(entrada: EventoEntradaM9, preparar: () => Promise<TPreparado>, confirmar: (preparado: TPreparado) => Promise<TResult>): Promise<TResult>;
}
export {};
//# sourceMappingURL=contratoProductor.d.ts.map