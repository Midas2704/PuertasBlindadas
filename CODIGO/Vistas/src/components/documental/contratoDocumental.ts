import type { CapacidadesDocumentalesProducto, DocumentoComercialProducto } from './tipos';

export type MetadatosDocumentalesProducto = {
  productoId: number;
  estadoProducto?: string;
  estadoIntegracion?: 'VACIO' | 'LISTO';
  documentos: readonly DocumentoComercialProducto[];
  fotografias?: readonly DocumentoComercialProducto[];
  documentosTecnicos?: readonly DocumentoComercialProducto[];
  fotografiaPrincipal?: DocumentoComercialProducto | null;
  capacidades: CapacidadesDocumentalesProducto;
};

export type SolicitudVistaPreviaDocumental = {
  idDocumento: string;
  idVersion: string;
};

/** Contrato futuro de aplicación. No define rutas HTTP ni implementa transporte. */
export interface PuertoDocumentalProductos {
  listarProducto(productoId: number): Promise<MetadatosDocumentalesProducto>;
  consultarVersiones(idDocumento: string): Promise<DocumentoComercialProducto['versiones']>;
  solicitarVistaPrevia(solicitud: SolicitudVistaPreviaDocumental): Promise<{ urlTemporal: string; expiraEn: string }>;
  consultarCapacidades(productoId: number): Promise<CapacidadesDocumentalesProducto>;
}
