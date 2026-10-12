import { RepositorioDocumentalPrisma } from '../repositorios/RepositorioDocumentalPrisma';
import { AutorizadorDocumental, type ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';
import { ErrorDocumental, type EstadoVersion, type TipoDocumentoProducto } from '../tipos';
import type {
  CapacidadesDocumentalesProductoDto, DocumentoComercialProductoDto,
  MetadatosDocumentalesProductoDto, TipoDocumentoComercialDto,
} from './tipos';

type ProductoDocumental = NonNullable<Awaited<ReturnType<RepositorioDocumentalPrisma['consultarDocumentosProducto']>>>;
type AsociacionDocumental = ProductoDocumental['documentos'][number];

const TIPO_DTO: Record<TipoDocumentoProducto, TipoDocumentoComercialDto> = {
  FOTOGRAFIA_COMERCIAL: 'FOTOGRAFIA_COMERCIAL',
  DIAGRAMA_TECNICO: 'DIAGRAMA_TECNICO',
  FICHA_TECNICA: 'FICHA_TECNICA',
  CATALOGO: 'CATALOGO',
  OTRO_AUTORIZADO: 'OTRO_DOCUMENTO_AUTORIZADO',
};

const capacidadesCerradas = (): CapacidadesDocumentalesProductoDto => ({
  consultarMetadatos:false, consultarVersiones:false, solicitarVistaPrevia:false,
  descargar:false, cargar:false, reemplazar:false, definirPrincipal:false,
  ordenar:false, definirUsoComercial:false,
});

/** Servicio interno: no registra rutas, no firma URLs y no accede al storage. */
export class ServicioDocumentosProducto {
  constructor(
    private readonly repositorio: Pick<RepositorioDocumentalPrisma, 'consultarDocumentosProducto'>,
    private readonly autorizador: AutorizadorDocumental,
  ) {}

  async consultarCapacidades(idProducto: number, actor: ActorBackendDocumental): Promise<CapacidadesDocumentalesProductoDto> {
    const capacidades = capacidadesCerradas();
    if (!Number.isInteger(idProducto) || idProducto <= 0) return capacidades;
    const contexto = { idProducto };
    [capacidades.consultarMetadatos, capacidades.consultarVersiones] = await Promise.all([
      this.autorizador.puede(actor, 'CONSULTAR_METADATA', contexto),
      this.autorizador.puede(actor, 'CONSULTAR_VERSIONES', contexto),
    ]);
    return capacidades;
  }

  async listar(idProducto: number, actor: ActorBackendDocumental): Promise<MetadatosDocumentalesProductoDto> {
    if (!Number.isInteger(idProducto) || idProducto <= 0) throw new ErrorDocumental('PRODUCTO_INVALIDO', 'Producto comercial inválido');
    await this.autorizador.exigir(actor, 'CONSULTAR_METADATA', { idProducto });
    const capacidades = await this.consultarCapacidades(idProducto, actor);
    const producto = await this.repositorio.consultarDocumentosProducto(idProducto, capacidades.consultarVersiones);
    if (!producto) throw new ErrorDocumental('PRODUCTO_NO_ENCONTRADO', 'Producto comercial no encontrado', 404);
    const documentos = producto.documentos.map(asociacion => this.mapear(asociacion, idProducto, capacidades.consultarVersiones));
    const fotografias = documentos.filter(documento => documento.tipo === 'FOTOGRAFIA_COMERCIAL');
    const documentosTecnicos = documentos.filter(documento => documento.tipo !== 'FOTOGRAFIA_COMERCIAL');
    const fotografiaPrincipal = fotografias.find(documento => documento.esImagenPrincipal && documento.estado === 'DISPONIBLE') ?? null;
    return {
      productoId:idProducto, estadoProducto:producto.estado,
      estadoIntegracion:documentos.length ? 'LISTO' : 'VACIO',
      documentos, fotografias, documentosTecnicos, fotografiaPrincipal, capacidades,
    };
  }

  async consultarVersiones(idProducto: number, idDocumento: bigint, actor: ActorBackendDocumental) {
    await this.autorizador.exigir(actor, 'CONSULTAR_VERSIONES', { idProducto, idDocumento });
    const producto = await this.repositorio.consultarDocumentosProducto(idProducto, true);
    if (!producto) throw new ErrorDocumental('PRODUCTO_NO_ENCONTRADO', 'Producto comercial no encontrado', 404);
    const asociacion = producto.documentos.find(item => item.documento.id_documento_logico === idDocumento);
    if (!asociacion) throw new ErrorDocumental('DOCUMENTO_PRODUCTO_NO_ENCONTRADO', 'El documento no está asociado al producto autorizado', 404);
    return this.mapear(asociacion, idProducto, true).versiones;
  }

  private mapear(asociacion: AsociacionDocumental, idProducto: number, mostrarResponsable: boolean): DocumentoComercialProductoDto {
    const documento = asociacion.documento;
    const actual = documento.versiones.find(version => version.numero_version === documento.numero_version_actual) ?? documento.versiones[0] ?? null;
    const variante = actual?.estado === 'DISPONIBLE'
      ? actual.variantes_origen.find(item => item.version_derivada.estado === 'DISPONIBLE')
      : undefined;
    const tipoPersistido = asociacion.tipo_documento as TipoDocumentoProducto;
    const tipo = TIPO_DTO[tipoPersistido];
    if (!tipo) throw new ErrorDocumental('TIPO_DOCUMENTAL_NO_SOPORTADO', 'La asociación contiene un tipo documental no soportado', 409);
    return {
      idDocumento:documento.id_documento_logico.toString(),
      idAsociacion:asociacion.id_producto_comercial_documento.toString(), idProducto,
      titulo:documento.titulo, clasificacion:documento.clasificacion, tipo,
      estado:(actual?.estado ?? 'PENDIENTE') as EstadoVersion,
      versionActual:documento.numero_version_actual,
      incorporadoEn:asociacion.asociado_en.toISOString(), actualizadoEn:documento.actualizado_en.toISOString(),
      esImagenPrincipal:asociacion.es_imagen_principal, ordenPresentacion:asociacion.orden_presentacion,
      habilitadoB2b:asociacion.habilitado_b2b, habilitadoB2c:asociacion.habilitado_b2c,
      nombreSeguro:actual?.nombre_seguro ?? null, mimeDetectado:actual?.mime_detectado ?? null,
      tamanoBytes:actual?.tamano_bytes.toString() ?? null,
      vistaPrevia:variante ? { disponible:true, tipo:variante.tipo_variante as 'MINIATURA' | 'VISTA_PREVIA', idVersion:variante.version_derivada.id_version_documento.toString() } : null,
      versiones:documento.versiones.map(version => ({
        idVersion:version.id_version_documento.toString(), numero:version.numero_version,
        estado:version.estado as EstadoVersion, fechaCreacion:version.creado_en.toISOString(),
        fechaValidacion:version.validado_en?.toISOString() ?? null,
        responsableVisible:mostrarResponsable ? version.creador.usuario_username : null,
        vigente:version.numero_version === documento.numero_version_actual,
      })),
    };
  }
}

export { TIPO_DTO as MAPEO_TIPO_DOCUMENTAL_COMERCIAL };
