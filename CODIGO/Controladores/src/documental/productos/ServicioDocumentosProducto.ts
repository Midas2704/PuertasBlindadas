import { RepositorioDocumentalPrisma } from '../repositorios/RepositorioDocumentalPrisma';
import { AutorizadorDocumental, type ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';
import type { AccionDocumental } from '../seguridad/AutorizacionDocumental';
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

export interface EstadoDependenciasDocumentalesProducto { politicaComercial:boolean; storage:boolean; antivirus:boolean }

const capacidadesCerradas = (dependencias: EstadoDependenciasDocumentalesProducto): CapacidadesDocumentalesProductoDto => ({
  consultarMetadatos:false, consultarVersiones:false, solicitarVistaPrevia:false,
  descargar:false, cargar:false, reemplazar:false, definirPrincipal:false,
  ordenar:false, definirUsoComercial:false,
  diagnosticoActivacion:{permisoGestion:'APROBADO_C2_6',politicaComercial:dependencias.politicaComercial?'CONFIGURADA':'NO_CONFIGURADA',storage:dependencias.storage?'CONFIGURADO':'NO_CONFIGURADO',antivirus:dependencias.antivirus?'CONFIGURADO':'NO_CONFIGURADO'},
});

/** Servicio interno: no registra rutas, no firma URLs y no accede al storage. */
export class ServicioDocumentosProducto {
  constructor(
    private readonly repositorio: Pick<RepositorioDocumentalPrisma, 'consultarDocumentosProducto'>,
    private readonly autorizador: AutorizadorDocumental,
    private readonly dependencias: EstadoDependenciasDocumentalesProducto = {politicaComercial:false,storage:false,antivirus:false},
  ) {}

  async consultarCapacidades(idProducto: number, actor: ActorBackendDocumental): Promise<CapacidadesDocumentalesProductoDto> {
    const capacidades = capacidadesCerradas(this.dependencias);
    if (!Number.isInteger(idProducto) || idProducto <= 0) return capacidades;
    const contexto = { idProducto };
    const [consultar,versiones,preview,descargar,cargar,principal,ordenar,uso] = await Promise.all([
      this.autorizador.puede(actor, 'CONSULTAR_METADATA', contexto),
      this.autorizador.puede(actor, 'CONSULTAR_VERSIONES', contexto),
      this.autorizador.puede(actor, 'SOLICITAR_VISTA_PREVIA', contexto),
      this.autorizador.puede(actor, 'DESCARGAR', contexto),
      this.autorizador.puede(actor, 'CREAR_INTENCION', contexto),
      this.autorizador.puede(actor, 'DEFINIR_IMAGEN_PRINCIPAL', contexto),
      this.autorizador.puede(actor, 'ORDENAR_GALERIA', contexto),
      this.autorizador.puede(actor, 'DEFINIR_USO_B2B_B2C', contexto),
    ]);
    capacidades.consultarMetadatos=consultar; capacidades.consultarVersiones=versiones;
    capacidades.solicitarVistaPrevia=preview&&this.dependencias.politicaComercial&&this.dependencias.storage;
    capacidades.descargar=descargar&&this.dependencias.politicaComercial&&this.dependencias.storage&&this.dependencias.antivirus;
    capacidades.cargar=cargar&&this.dependencias.politicaComercial&&this.dependencias.storage&&this.dependencias.antivirus;
    capacidades.reemplazar=capacidades.cargar;
    capacidades.definirPrincipal=principal; capacidades.ordenar=ordenar; capacidades.definirUsoComercial=uso;
    return capacidades;
  }

  async exigirOperacionBinaria(idProducto:number, accion:Extract<AccionDocumental,'CREAR_INTENCION'|'CONFIRMAR_CARGA'|'REEMPLAZAR'|'SOLICITAR_VISTA_PREVIA'|'DESCARGAR'>, actor:ActorBackendDocumental):Promise<never>{
    await this.autorizador.exigir(actor,accion,{idProducto});
    const faltantes=[!this.dependencias.politicaComercial&&'POLITICA_COMERCIAL',!this.dependencias.storage&&'STORAGE',(['CREAR_INTENCION','CONFIRMAR_CARGA','REEMPLAZAR','DESCARGAR'].includes(accion)&&!this.dependencias.antivirus)&&'ANTIVIRUS'].filter(Boolean);
    throw new ErrorDocumental('INFRAESTRUCTURA_DOCUMENTAL_NO_DISPONIBLE',`Gestión documental no disponible${faltantes.length?`: falta ${faltantes.join(', ')}`:''}`,503);
  }

  async listar(idProducto: number, actor: ActorBackendDocumental): Promise<MetadatosDocumentalesProductoDto> {
    if (!Number.isInteger(idProducto) || idProducto <= 0) throw new ErrorDocumental('PRODUCTO_INVALIDO', 'Producto comercial inválido');
    await this.autorizador.exigir(actor, 'CONSULTAR_METADATA', { idProducto });
    const capacidades = await this.consultarCapacidades(idProducto, actor);
    const producto = await this.repositorio.consultarDocumentosProducto(idProducto, capacidades.consultarVersiones);
    if (!producto) throw new ErrorDocumental('PRODUCTO_NO_ENCONTRADO', 'Producto comercial no encontrado', 404);
    if (producto.estado === 'INACTIVO') throw new ErrorDocumental('PRODUCTO_NO_DISPONIBLE', 'El producto comercial está inactivo', 409);
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

  async listarParaSegmento(idProducto: number, segmento: 'B2B' | 'B2C', actor: ActorBackendDocumental): Promise<MetadatosDocumentalesProductoDto> {
    const salida = await this.listar(idProducto, actor);
    const documentos = salida.documentos.filter(documento => segmento === 'B2B' ? documento.habilitadoB2b : documento.habilitadoB2c);
    const fotografias = documentos.filter(documento => documento.tipo === 'FOTOGRAFIA_COMERCIAL');
    const documentosTecnicos = documentos.filter(documento => documento.tipo !== 'FOTOGRAFIA_COMERCIAL');
    const fotografiaPrincipal = fotografias.find(documento => documento.esImagenPrincipal && documento.estado === 'DISPONIBLE') ?? null;
    return { ...salida, estadoIntegracion: documentos.length ? 'LISTO' : 'VACIO', documentos, fotografias, documentosTecnicos, fotografiaPrincipal };
  }

  async consultarVersiones(idProducto: number, idDocumento: bigint, actor: ActorBackendDocumental) {
    await this.autorizador.exigir(actor, 'CONSULTAR_VERSIONES', { idProducto, idDocumento });
    const producto = await this.repositorio.consultarDocumentosProducto(idProducto, true);
    if (!producto) throw new ErrorDocumental('PRODUCTO_NO_ENCONTRADO', 'Producto comercial no encontrado', 404);
    if (producto.estado === 'INACTIVO') throw new ErrorDocumental('PRODUCTO_NO_DISPONIBLE', 'El producto comercial está inactivo', 409);
    const asociacion = producto.documentos.find(item => item.documento.id_documento_logico === idDocumento);
    if (!asociacion) throw new ErrorDocumental('DOCUMENTO_PRODUCTO_NO_ENCONTRADO', 'El documento no está asociado al producto autorizado', 404);
    return this.mapear(asociacion, idProducto, true).versiones;
  }

  private mapear(asociacion: AsociacionDocumental, idProducto: number, mostrarResponsable: boolean): DocumentoComercialProductoDto {
    const documento = asociacion.documento;
    if (documento.clasificacion !== 'COMERCIAL') throw new ErrorDocumental('CLASIFICACION_DOCUMENTAL_NO_AUTORIZADA', 'La consulta comercial rechazó un documento de otra clasificación', 403);
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
