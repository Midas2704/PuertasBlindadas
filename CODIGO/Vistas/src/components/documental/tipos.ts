export type EstadoIntegracionDocumental =
  | 'NO_HABILITADA'
  | 'CARGANDO'
  | 'VACIO'
  | 'LISTO'
  | 'ERROR'
  | 'DENEGADO';

export type EstadoDocumentoComercial =
  | 'PENDIENTE'
  | 'SUBIENDO'
  | 'VALIDANDO'
  | 'DISPONIBLE'
  | 'ERROR'
  | 'CUARENTENA'
  | 'REEMPLAZADO'
  | 'ARCHIVADO';

export type TipoDocumentoComercial =
  | 'FOTOGRAFIA_COMERCIAL'
  | 'FICHA_TECNICA'
  | 'CATALOGO'
  | 'DIAGRAMA_TECNICO'
  | 'OTRO_DOCUMENTO_AUTORIZADO';

export type VarianteVistaPrevia = {
  tipo: 'MINIATURA' | 'VISTA_PREVIA';
  urlTemporal: string;
  expiraEn: string;
};

export type VersionDocumentoComercial = {
  idVersion: string;
  numero: number;
  estado: EstadoDocumentoComercial;
  fechaCreacion: string;
  fechaValidacion?: string | null;
  responsableVisible?: string | null;
  vigente: boolean;
};

export type DocumentoComercialProducto = {
  idDocumento: string;
  idAsociacion: string;
  idProducto: number;
  titulo: string;
  clasificacion: string;
  tipo: TipoDocumentoComercial;
  estado: EstadoDocumentoComercial;
  versionActual: number;
  incorporadoEn: string;
  actualizadoEn: string;
  esImagenPrincipal: boolean;
  ordenPresentacion: number;
  habilitadoB2b: boolean;
  habilitadoB2c: boolean;
  nombreSeguro?: string | null;
  mimeDetectado?: string | null;
  tamanoBytes?: number | null;
  vistaPrevia?: VarianteVistaPrevia | null;
  versiones: readonly VersionDocumentoComercial[];
};

export type CapacidadesDocumentalesProducto = {
  consultarMetadatos: boolean;
  consultarVersiones: boolean;
  solicitarVistaPrevia: boolean;
  descargar: boolean;
  cargar: boolean;
  reemplazar: boolean;
  definirPrincipal: boolean;
  ordenar: boolean;
  definirUsoComercial: boolean;
};

export type ModoFichaDocumental = 'crear' | 'editar' | 'consultar';

export const capacidadesDocumentalesDeshabilitadas: CapacidadesDocumentalesProducto = {
  consultarMetadatos: false,
  consultarVersiones: false,
  solicitarVistaPrevia: false,
  descargar: false,
  cargar: false,
  reemplazar: false,
  definirPrincipal: false,
  ordenar: false,
  definirUsoComercial: false,
};
