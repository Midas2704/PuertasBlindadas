export declare const ESTADOS_DOCUMENTO: readonly ["ACTIVO", "INACTIVO", "ARCHIVADO"];
export declare const ESTADOS_VERSION: readonly ["PENDIENTE", "SUBIENDO", "VALIDANDO", "DISPONIBLE", "ERROR", "CUARENTENA", "REEMPLAZADO", "ARCHIVADO"];
export declare const ESTADOS_INTENCION: readonly ["PENDIENTE", "SUBIENDO", "VALIDANDO", "DISPONIBLE", "ERROR", "CUARENTENA", "EXPIRADA", "CANCELADA"];
export declare const ESTADOS_OUTBOX: readonly ["PENDIENTE", "PROCESANDO", "PROCESADO", "ERROR", "DESCARTADO"];
export declare const TIPOS_VARIANTE: readonly ["MINIATURA", "VISTA_PREVIA", "PDF_OPTIMIZADA"];
export declare const TIPOS_DOCUMENTO_PRODUCTO: readonly ["FOTOGRAFIA_COMERCIAL", "DIAGRAMA_TECNICO", "FICHA_TECNICA", "CATALOGO", "OTRO_AUTORIZADO"];
export declare const PROVEEDORES_DOCUMENTALES: readonly ["R2", "S3"];
export type EstadoDocumento = typeof ESTADOS_DOCUMENTO[number];
export type EstadoVersion = typeof ESTADOS_VERSION[number];
export type EstadoIntencion = typeof ESTADOS_INTENCION[number];
export type EstadoOutbox = typeof ESTADOS_OUTBOX[number];
export type TipoVariante = typeof TIPOS_VARIANTE[number];
export type TipoDocumentoProducto = typeof TIPOS_DOCUMENTO_PRODUCTO[number];
export type ProveedorDocumental = typeof PROVEEDORES_DOCUMENTALES[number];
export interface ActorDocumental {
    id: bigint;
    permisos?: readonly string[];
    alcance?: Readonly<Record<string, string | number | bigint | boolean | null>>;
}
export interface CrearDocumentoEntrada {
    titulo: string;
    clasificacion: string;
    esHistorico?: boolean;
    idConfiguracionConservacion?: number | null;
}
export interface CrearIntencionEntrada {
    idDocumento: bigint;
    clasificacion: string;
    nombreDeclarado: string;
    mimeDeclarado: string;
    tamanoEsperado: bigint | number;
    claveTemporal: string;
    claveIdempotencia: string;
    expiraEn: Date;
}
export interface RegistrarVersionEntrada {
    idDocumento: bigint;
    proveedor: ProveedorDocumental;
    contenedor: string;
    claveObjeto: string;
    versionProveedor?: string | null;
    nombreOriginal: string;
    nombreSeguro: string;
    mimeDeclarado: string;
    mimeDetectado?: string | null;
    tamanoBytes: bigint | number;
    sha256?: string | null;
    estado?: EstadoVersion;
    validadoEn?: Date | null;
    idVersionReemplazada?: bigint | null;
    resultadoValidaciones?: Record<string, unknown> | null;
}
export interface AsociarProductoEntrada {
    idProducto: number;
    idDocumento: bigint;
    tipoDocumento: TipoDocumentoProducto;
    ordenPresentacion?: number;
    esImagenPrincipal?: boolean;
    habilitadoB2b?: boolean;
    habilitadoB2c?: boolean;
}
export interface RegistrarEventoDocumentalEntrada {
    tipoEvento: string;
    claveIdempotencia: string;
    idDocumento?: bigint | null;
    idVersion?: bigint | null;
    payloadTecnico?: Record<string, unknown> | null;
    proximoIntentoEn?: Date | null;
}
export declare class ErrorDocumental extends Error {
    readonly codigo: string;
    readonly estadoHttp: number;
    constructor(codigo: string, mensaje: string, estadoHttp?: number);
}
//# sourceMappingURL=tipos.d.ts.map