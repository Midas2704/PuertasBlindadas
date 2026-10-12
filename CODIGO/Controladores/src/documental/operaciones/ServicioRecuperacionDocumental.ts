import type { StorageAdapter, UrlFirmadaStorage } from '../StorageAdapter';
import { ErrorDocumental } from '../tipos';
import type { ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';

export interface VersionRecuperable {
  id_version_documento: bigint;
  id_documento_logico: bigint;
  proveedor_logico: string;
  contenedor_logico: string;
  clave_objeto: string;
  nombre_seguro: string;
  estado: string;
  mime_detectado: string | null;
  sha256: string | null;
  resultado_validaciones: unknown;
}

export class ServicioRecuperacionDocumental {
  constructor(
    private readonly storage: StorageAdapter,
    private readonly consultarVersion: (id: bigint) => Promise<VersionRecuperable | null>,
    private readonly autorizar: (actor: ActorBackendDocumental, version: VersionRecuperable) => Promise<void>,
    private readonly vigenciaMaximaSegundos = 300,
  ) {}

  async firmar(entrada: { idVersion: bigint; actor: ActorBackendDocumental; vigenciaSegundos?: number }): Promise<UrlFirmadaStorage> {
    const version = await this.consultarVersion(entrada.idVersion);
    if (!version) throw new ErrorDocumental('VERSION_NO_ENCONTRADA', 'Versión documental no encontrada', 404);
    await this.autorizar(entrada.actor, version);
    if (version.proveedor_logico !== this.storage.proveedor) throw new ErrorDocumental('PROVEEDOR_NO_COINCIDE', 'La versión pertenece a otro proveedor de almacenamiento', 409);
    const antivirus = (version.resultado_validaciones as { antivirus?: { estado?: string } } | null)?.antivirus?.estado;
    if (version.estado !== 'DISPONIBLE' || !version.sha256 || !version.mime_detectado || antivirus !== 'LIMPIO') throw new ErrorDocumental('VERSION_NO_RECUPERABLE', 'La versión no superó todos los controles de disponibilidad', 409);
    if (!this.storage.firmarDescarga) throw new ErrorDocumental('DESCARGA_NO_SOPORTADA', 'El proveedor no permite descarga firmada', 503);
    const segundos = Math.max(1, Math.min(entrada.vigenciaSegundos ?? 120, this.vigenciaMaximaSegundos));
    const firmada = await this.storage.firmarDescarga({ referencia: { contenedor: version.contenedor_logico, clave: version.clave_objeto }, expiraEn: new Date(Date.now() + segundos * 1000), nombreDescarga: version.nombre_seguro, mimeRespuesta: version.mime_detectado, cacheControlRespuesta: 'private, no-store' });
    return { ...firmada, headersRespuestaRequeridos: { ...firmada.headersRespuestaRequeridos, 'x-content-type-options': 'nosniff' } };
  }
}
