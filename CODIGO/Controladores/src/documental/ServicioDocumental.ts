import { RepositorioDocumentalPrisma } from './repositorios/RepositorioDocumentalPrisma';
import type {
  ActorDocumental, AsociarProductoEntrada, CrearDocumentoEntrada, CrearIntencionEntrada,
  EstadoDocumento, EstadoIntencion, EstadoOutbox, EstadoVersion, RegistrarEventoDocumentalEntrada,
  RegistrarVersionEntrada, TipoVariante,
} from './tipos';

/**
 * Fachada de metadatos implementada en 4.2. No sube, descarga, firma, escanea ni elimina objetos.
 * Esas operaciones no se exponen hasta inyectar un StorageAdapter real y controles de 4.3/4.4.
 */
export class ServicioDocumental {
  constructor(private readonly repositorio = new RepositorioDocumentalPrisma()) {}

  crearDocumento(entrada: CrearDocumentoEntrada, actor: ActorDocumental) { return this.repositorio.crearDocumento(entrada, actor); }
  consultarDocumento(id: bigint) { return this.repositorio.consultarDocumento(id); }
  cambiarEstadoDocumento(id: bigint, revision: number, estado: EstadoDocumento, motivo?: string) { return this.repositorio.cambiarEstadoDocumento(id, revision, estado, motivo); }
  crearIntencion(entrada: CrearIntencionEntrada, actor: ActorDocumental) { return this.repositorio.crearIntencion(entrada, actor); }
  consultarIntencion(idPublico: string) { return this.repositorio.consultarIntencion(idPublico); }
  cambiarEstadoIntencion(idPublico: string, revision: number, estado: EstadoIntencion, opciones?: { codigoError?: string | null; confirmadoEn?: Date | null; incrementarReintento?: boolean }) { return this.repositorio.cambiarEstadoIntencion(idPublico, revision, estado, opciones); }
  registrarVersion(entrada: RegistrarVersionEntrada, actor: ActorDocumental) { return this.repositorio.registrarVersion(entrada, actor); }
  cambiarEstadoVersion(id: bigint, revision: number, estado: EstadoVersion) { return this.repositorio.cambiarEstadoVersion(id, revision, estado); }
  registrarVariante(idOriginal: bigint, idDerivada: bigint, tipo: TipoVariante, parametros?: Record<string, unknown> | null) { return this.repositorio.registrarVariante(idOriginal, idDerivada, tipo, parametros); }
  asociarProducto(entrada: AsociarProductoEntrada, actor: ActorDocumental) { return this.repositorio.asociarProducto(entrada, actor); }
  listarAsociacionesProducto(idProducto: number) { return this.repositorio.listarAsociacionesProducto(idProducto); }
  registrarEvento(entrada: RegistrarEventoDocumentalEntrada) { return this.repositorio.registrarEvento(entrada); }
  cambiarEstadoEvento(id: bigint, estado: EstadoOutbox, codigoError?: string | null) { return this.repositorio.cambiarEstadoEvento(id, estado, codigoError); }
}

export type { StorageAdapter } from './StorageAdapter';
export * from './tipos';
