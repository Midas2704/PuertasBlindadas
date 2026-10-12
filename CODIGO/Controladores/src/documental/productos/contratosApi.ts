import type { ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';
import type {
  CapacidadesDocumentalesProductoDto, MetadatosDocumentalesProductoDto,
  SolicitudDescargaDocumentalDto, SolicitudVistaPreviaDocumentalDto, VersionDocumentoComercialDto,
} from './tipos';

export type ResultadoSolicitudBinariaPreparada =
  | { disponible: false; codigo: 'PERMISO_PENDIENTE' | 'INTEGRACION_NO_ACTIVA' | 'DOCUMENTO_NO_DISPONIBLE' }
  | { disponible: true; urlTemporal: string; expiraEn: string };

/** Contrato de aplicación futuro. No define transporte, rutas ni confía en actor enviado por React. */
export interface PuertoDocumentosComercialesInterno {
  listarProducto(idProducto: number, actor: ActorBackendDocumental): Promise<MetadatosDocumentalesProductoDto>;
  consultarVersiones(idProducto: number, idDocumento: bigint, actor: ActorBackendDocumental): Promise<readonly VersionDocumentoComercialDto[]>;
  consultarCapacidades(idProducto: number, actor: ActorBackendDocumental): Promise<CapacidadesDocumentalesProductoDto>;
  solicitarVistaPrevia?(solicitud: SolicitudVistaPreviaDocumentalDto, actor: ActorBackendDocumental): Promise<ResultadoSolicitudBinariaPreparada>;
  solicitarDescarga?(solicitud: SolicitudDescargaDocumentalDto, actor: ActorBackendDocumental): Promise<ResultadoSolicitudBinariaPreparada>;
}

export const RUTAS_DOCUMENTALES_PROPUESTAS_NO_REGISTRADAS = [
  'GET /mantenedores/productos/:id/documentos',
  'GET /mantenedores/productos/:id/documentos/:documentoId/versiones',
  'GET /mantenedores/productos/:id/documentos/capacidades',
  'POST /mantenedores/productos/:id/documentos/:documentoId/vista-previa',
  'POST /mantenedores/productos/:id/documentos/:documentoId/descarga',
] as const;
