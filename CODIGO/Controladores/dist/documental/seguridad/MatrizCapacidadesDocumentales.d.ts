import type { AccionDocumental } from './AutorizacionDocumental';
export type EstadoAprobacionCapacidad = 'APROBADO_EXISTENTE' | 'APROBADO_C2_6' | 'PENDIENTE_APROBACION';
export interface DefinicionCapacidadDocumental {
    accion: AccionDocumental;
    moduloPropietario: 'M2' | 'M4' | 'M9' | 'DOCUMENTAL';
    cuExistente: string | null;
    cuPropuesto: string | null;
    necesitaCuNuevo: boolean;
    perfilPropuesto: 'POR_DEFINIR_POR_EMPRESA';
    restriccionEntidad: string;
    restriccionClasificacion: string;
    requiereAuditoria: boolean;
    tipoAcceso: 'CONSULTA' | 'ESCRITURA';
    riesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
    estadoAprobacion: EstadoAprobacionCapacidad;
    bloqueosAdicionales: readonly ('POLITICA_COMERCIAL' | 'STORAGE' | 'ANTIVIRUS' | 'CATALOGO_M9')[];
}
/** Matriz informativa. No concede permisos ni modifica perfiles M4. */
export declare const MATRIZ_CAPACIDADES_DOCUMENTALES: readonly DefinicionCapacidadDocumental[];
//# sourceMappingURL=MatrizCapacidadesDocumentales.d.ts.map