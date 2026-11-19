export declare const EVENTOS_DOCUMENTALES_PROPUESTOS: readonly ["DOCUMENTO_CONSULTADO", "DOCUMENTO_CARGA_INICIADA", "DOCUMENTO_CARGA_CONFIRMADA", "DOCUMENTO_RECHAZADO", "DOCUMENTO_CUARENTENA", "DOCUMENTO_DISPONIBLE", "DOCUMENTO_DESCARGADO", "DOCUMENTO_REEMPLAZADO", "DOCUMENTO_ASOCIADO_PRODUCTO", "DOCUMENTO_IMAGEN_PRINCIPAL_CAMBIADA", "DOCUMENTO_USO_COMERCIAL_MODIFICADO", "DOCUMENTO_INTEGRIDAD_FALLIDA"];
export type EventoDocumentalPropuesto = typeof EVENTOS_DOCUMENTALES_PROPUESTOS[number];
export interface DefinicionEventoM9Documental {
    tipo: EventoDocumentalPropuesto;
    productorPropuesto: 'M2';
    operacion: string;
    criticidad: 'BAJA' | 'MEDIA' | 'ALTA';
    requiereIdempotencia: boolean;
    justificacion: string;
    campos: readonly ('ACTOR' | 'ENTIDAD' | 'DOCUMENTO' | 'VERSION' | 'RESULTADO')[];
    estadoAprobacion: 'PENDIENTE_APROBACION';
}
/** Propuesta de catálogo; no registra ni publica eventos por sí misma. */
export declare const MATRIZ_EVENTOS_M9_DOCUMENTALES: readonly DefinicionEventoM9Documental[];
export interface EventoM9DocumentalPreparado {
    tipo: EventoDocumentalPropuesto;
    idempotencia: string;
    actorId: string;
    productoId: number;
    documentoId?: string;
    versionId?: string;
    resultado: 'EXITO' | 'RECHAZADO' | 'ERROR';
    ocurridoEn: string;
    criticidad: 'BAJA' | 'MEDIA' | 'ALTA';
}
export interface PublicadorM9DocumentalAprobado {
    publicar(evento: EventoM9DocumentalPreparado): Promise<{
        aceptado: boolean;
        idempotente: boolean;
    }>;
}
/** Puente inactivo por defecto. Sólo publica tipos entregados explícitamente por un catálogo M9 aprobado. */
export declare class PuenteM9DocumentosProducto {
    private readonly publicador;
    private readonly eventosAprobados;
    constructor(publicador: PublicadorM9DocumentalAprobado, eventosAprobados?: ReadonlySet<EventoDocumentalPropuesto>);
    publicar(evento: EventoM9DocumentalPreparado): Promise<{
        aceptado: boolean;
        idempotente: boolean;
    }>;
}
//# sourceMappingURL=IntegracionM9DocumentosProducto.d.ts.map