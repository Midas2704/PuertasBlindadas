export const ESTADOS_DOCUMENTO = ['ACTIVO', 'INACTIVO', 'ARCHIVADO'] as const;
export const ESTADOS_VERSION = ['PENDIENTE', 'SUBIENDO', 'VALIDANDO', 'DISPONIBLE', 'ERROR', 'CUARENTENA', 'REEMPLAZADO', 'ARCHIVADO'] as const;
export const ESTADOS_INTENCION = ['PENDIENTE', 'SUBIENDO', 'VALIDANDO', 'DISPONIBLE', 'ERROR', 'CUARENTENA', 'EXPIRADA', 'CANCELADA'] as const;
export const ESTADOS_OUTBOX = ['PENDIENTE', 'PROCESANDO', 'PROCESADO', 'ERROR', 'DESCARTADO'] as const;
export const TIPOS_VARIANTE = ['MINIATURA', 'VISTA_PREVIA', 'PDF_OPTIMIZADA'] as const;
export const TIPOS_DOCUMENTO_PRODUCTO = ['FOTOGRAFIA_COMERCIAL', 'DIAGRAMA_TECNICO', 'FICHA_TECNICA', 'CATALOGO', 'OTRO_AUTORIZADO'] as const;
export const PROVEEDORES_DOCUMENTALES = ['R2', 'S3'] as const;

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

export class ErrorDocumental extends Error {
  constructor(public readonly codigo: string, mensaje: string, public readonly estadoHttp = 400) {
    super(mensaje);
    this.name = 'ErrorDocumental';
  }
}
