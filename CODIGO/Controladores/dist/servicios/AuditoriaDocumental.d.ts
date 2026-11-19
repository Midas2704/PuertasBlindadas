export type CondicionDocumento = 'ACEPTADO_POR_TRANSPORTE' | 'ENTREGADO' | 'RECHAZADO' | 'PENDIENTE' | 'FALLIDO' | 'GENERADO';
export interface EventoDocumento {
    actorId: bigint;
    tipoDocumento: string;
    idDocumento: number;
    accion: string;
    condicion: CondicionDocumento;
    metadata?: Record<string, unknown>;
}
export interface CondicionDocumentalRegistrada {
    resultado: CondicionDocumento;
    fecha: Date;
    actor: string;
    referenciaEvento: number;
    canal?: unknown;
    destinatarioLogico?: unknown;
}
export interface EventoHistorialDocumento {
    id: number;
    entidad: string;
    entidadId: number;
    accion: string;
    resultado: string;
    fecha: Date;
    usuario: string | null;
}
export interface AuditoriaDocumental {
    registrar(contexto: object, evento: EventoDocumento): Promise<{
        referenciaEvento: number;
    }>;
    ultimaCondicionEntrega(contexto: object, tipoDocumento: string, idDocumento: number): Promise<CondicionDocumentalRegistrada | null>;
    listarEventosHistorial(contexto: object, idsRemuneraciones: number[], idsPeriodos: number[]): Promise<EventoHistorialDocumento[]>;
}
/** Adaptador transitorio sobre la infraestructura Legacy de Finanzas; no representa integración con M9. */
export declare class AuditoriaDocumentalLegacyPrisma implements AuditoriaDocumental {
    registrar(contexto: object, evento: EventoDocumento): Promise<{
        referenciaEvento: number;
    }>;
    ultimaCondicionEntrega(contexto: object, tipoDocumento: string, idDocumento: number): Promise<{
        resultado: CondicionDocumento;
        fecha: Date;
        actor: string;
        referenciaEvento: number;
        canal: unknown;
        destinatarioLogico: unknown;
    } | null>;
    listarEventosHistorial(contexto: object, idsRemuneraciones: number[], idsPeriodos: number[]): Promise<{
        id: number;
        entidad: string;
        entidadId: number;
        accion: string;
        resultado: string;
        fecha: Date;
        usuario: string | null;
    }[]>;
}
//# sourceMappingURL=AuditoriaDocumental.d.ts.map