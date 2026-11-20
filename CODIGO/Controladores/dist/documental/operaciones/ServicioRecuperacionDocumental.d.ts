import type { StorageAdapter, UrlFirmadaStorage } from '../StorageAdapter';
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
export declare class ServicioRecuperacionDocumental {
    private readonly storage;
    private readonly consultarVersion;
    private readonly autorizar;
    private readonly vigenciaMaximaSegundos;
    constructor(storage: StorageAdapter, consultarVersion: (id: bigint) => Promise<VersionRecuperable | null>, autorizar: (actor: ActorBackendDocumental, version: VersionRecuperable) => Promise<void>, vigenciaMaximaSegundos?: number);
    firmar(entrada: {
        idVersion: bigint;
        actor: ActorBackendDocumental;
        vigenciaSegundos?: number;
    }): Promise<UrlFirmadaStorage>;
}
//# sourceMappingURL=ServicioRecuperacionDocumental.d.ts.map