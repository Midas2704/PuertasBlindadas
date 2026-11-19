import { FiltrosM9, ScopeM9 } from './tipos';
export type EventoPresentadoM9 = {
    id?: unknown;
    ocurrencia?: unknown;
    modulo?: unknown;
    operacion?: unknown;
    resultado?: unknown;
    referencia?: {
        tipo?: unknown;
        id?: unknown;
    } | null;
    ejecutor?: {
        tipo?: unknown;
        referencia?: unknown;
    } | null;
    integridad?: unknown;
};
export declare const humanizarM9: (valor: unknown) => string;
export declare const fechaInformeM9: (valor: unknown, incluirHora?: boolean) => string;
export declare const referenciaInformeM9: (evento: EventoPresentadoM9) => string;
export declare const ejecutorInformeM9: (evento: EventoPresentadoM9) => string;
export declare function crearInformeAuditoriaM9(eventosEntrada: EventoPresentadoM9[], filtros: FiltrosM9, scope: ScopeM9, generadoEn: Date): {
    nombre: string;
    mime: string;
    contenido: string;
};
//# sourceMappingURL=informeAuditoriaPdf.d.ts.map