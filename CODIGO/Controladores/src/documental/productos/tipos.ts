import type { EstadoVersion } from '../tipos';

export type TipoDocumentoComercialDto = 'FOTOGRAFIA_COMERCIAL' | 'DIAGRAMA_TECNICO' | 'FICHA_TECNICA' | 'CATALOGO' | 'OTRO_DOCUMENTO_AUTORIZADO';

export interface VersionDocumentoComercialDto {
  idVersion: string;
  numero: number;
  estado: EstadoVersion;
  fechaCreacion: string;
  fechaValidacion: string | null;
  responsableVisible: string | null;
  vigente: boolean;
}

export interface DisponibilidadVistaPreviaDto {
  disponible: boolean;
  tipo: 'MINIATURA' | 'VISTA_PREVIA';
  idVersion: string;
}

export interface DocumentoComercialProductoDto {
  idDocumento: string;
  idAsociacion: string;
  idProducto: number;
  titulo: string;
  clasificacion: string;
  tipo: TipoDocumentoComercialDto;
  estado: EstadoVersion;
  versionActual: number | null;
  incorporadoEn: string;
  actualizadoEn: string;
  esImagenPrincipal: boolean;
  ordenPresentacion: number;
  habilitadoB2b: boolean;
  habilitadoB2c: boolean;
  nombreSeguro: string | null;
  mimeDetectado: string | null;
  tamanoBytes: string | null;
  vistaPrevia: DisponibilidadVistaPreviaDto | null;
  versiones: readonly VersionDocumentoComercialDto[];
}

export interface CapacidadesDocumentalesProductoDto {
  consultarMetadatos: boolean;
  consultarVersiones: boolean;
  solicitarVistaPrevia: boolean;
  descargar: boolean;
  cargar: boolean;
  reemplazar: boolean;
  definirPrincipal: boolean;
  ordenar: boolean;
  definirUsoComercial: boolean;
  diagnosticoActivacion: {
    permisoGestion: 'APROBADO_C2_6';
    politicaComercial: 'CONFIGURADA' | 'NO_CONFIGURADA';
    storage: 'CONFIGURADO' | 'NO_CONFIGURADO';
    antivirus: 'CONFIGURADO' | 'NO_CONFIGURADO';
  };
}

export interface MetadatosDocumentalesProductoDto {
  productoId: number;
  estadoProducto: string;
  estadoIntegracion: 'VACIO' | 'LISTO';
  documentos: readonly DocumentoComercialProductoDto[];
  fotografias: readonly DocumentoComercialProductoDto[];
  documentosTecnicos: readonly DocumentoComercialProductoDto[];
  fotografiaPrincipal: DocumentoComercialProductoDto | null;
  capacidades: CapacidadesDocumentalesProductoDto;
}

export interface SolicitudVistaPreviaDocumentalDto { idProducto: number; idDocumento: string; idVersion: string }
export interface SolicitudDescargaDocumentalDto { idProducto: number; idDocumento: string; idVersion: string }
