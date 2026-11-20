import { EstadoDocumento, EstadoIntencion, EstadoOutbox, EstadoVersion } from './tipos';
export declare const exigirTransicionDocumento: (actual: EstadoDocumento, siguiente: EstadoDocumento) => void;
export declare const exigirTransicionVersion: (actual: EstadoVersion, siguiente: EstadoVersion) => void;
export declare const exigirTransicionIntencion: (actual: EstadoIntencion, siguiente: EstadoIntencion) => void;
export declare const exigirTransicionOutbox: (actual: EstadoOutbox, siguiente: EstadoOutbox) => void;
export declare const matrizTransicionesDocumentales: Readonly<{
    documento: Record<"ACTIVO" | "INACTIVO" | "ARCHIVADO", readonly ("ACTIVO" | "INACTIVO" | "ARCHIVADO")[]>;
    version: Record<"PENDIENTE" | "ERROR" | "DISPONIBLE" | "ARCHIVADO" | "SUBIENDO" | "VALIDANDO" | "CUARENTENA" | "REEMPLAZADO", readonly ("PENDIENTE" | "ERROR" | "DISPONIBLE" | "ARCHIVADO" | "SUBIENDO" | "VALIDANDO" | "CUARENTENA" | "REEMPLAZADO")[]>;
    intencion: Record<"PENDIENTE" | "ERROR" | "DISPONIBLE" | "CANCELADA" | "SUBIENDO" | "VALIDANDO" | "CUARENTENA" | "EXPIRADA", readonly ("PENDIENTE" | "ERROR" | "DISPONIBLE" | "CANCELADA" | "SUBIENDO" | "VALIDANDO" | "CUARENTENA" | "EXPIRADA")[]>;
    outbox: Record<"PENDIENTE" | "ERROR" | "PROCESANDO" | "PROCESADO" | "DESCARTADO", readonly ("PENDIENTE" | "ERROR" | "PROCESANDO" | "PROCESADO" | "DESCARTADO")[]>;
}>;
//# sourceMappingURL=estados.d.ts.map