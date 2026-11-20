import type { ProveedorDocumental } from '../tipos';
export interface ConfiguracionStorage {
    proveedor: ProveedorDocumental;
    bucket: string;
    region: string;
    endpoint?: string;
    forcePathStyle: boolean;
    credenciales?: {
        accessKeyId: string;
        secretAccessKey: string;
    };
    expiracionFirmaSegundos: number;
    timeoutMs: number;
    maxIntentos: number;
    s3VersionadoHabilitado: boolean;
    s3ObjectLockHabilitado: boolean;
    s3KmsHabilitado: boolean;
}
export declare class ErrorConfiguracionStorage extends Error {
    readonly codigo = "CONFIGURACION_STORAGE_INVALIDA";
    constructor(mensaje: string);
}
export declare const cargarConfiguracionStorage: (entorno?: NodeJS.ProcessEnv) => ConfiguracionStorage;
//# sourceMappingURL=configuracionStorage.d.ts.map