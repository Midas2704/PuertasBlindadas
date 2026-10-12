import type { StorageAdapter, UrlFirmadaStorage } from '../StorageAdapter';
import { ErrorDocumental } from '../tipos';

export interface VersionRecuperable {
  id_version_documento: bigint;
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
    private readonly autorizar: (idVersion: bigint) => Promise<void>,
    private readonly vigenciaMaximaSegundos = 300,
  ) {}

  async firmar(idVersion: bigint, vigenciaSegundos = 120): Promise<UrlFirmadaStorage> {
    await this.autorizar(idVersion);
    const version = await this.consultarVersion(idVersion);
    if (!version) throw new ErrorDocumental('VERSION_NO_ENCONTRADA', 'Versión documental no encontrada', 404);
    const antivirus = (version.resultado_validaciones as { antivirus?: { estado?: string } } | null)?.antivirus?.estado;
    if (version.estado !== 'DISPONIBLE' || !version.sha256 || !version.mime_detectado || antivirus !== 'LIMPIO') throw new ErrorDocumental('VERSION_NO_RECUPERABLE', 'La versión no superó todos los controles de disponibilidad', 409);
    if (!this.storage.firmarDescarga) throw new ErrorDocumental('DESCARGA_NO_SOPORTADA', 'El proveedor no permite descarga firmada', 503);
    const segundos = Math.max(1, Math.min(vigenciaSegundos, this.vigenciaMaximaSegundos));
    const firmada = await this.storage.firmarDescarga({ referencia: { contenedor: version.contenedor_logico, clave: version.clave_objeto }, expiraEn: new Date(Date.now() + segundos * 1000), nombreDescarga: version.nombre_seguro });
    return { ...firmada, headersObligatorios: { ...firmada.headersObligatorios, 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff' } };
  }
}
