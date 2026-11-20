import type { CapacidadesStorage, CargaIniciadaStorage, IntegridadStorage, ReferenciaObjetoStorage, StorageAdapter } from '../StorageAdapter';
export interface ConfiguracionStorageLocalPrivado {
    directorioRaiz: string;
    contenedor: string;
}
export declare const modoServidorPersonalHabilitado: (entorno?: NodeJS.ProcessEnv) => boolean;
export declare const cargarConfiguracionStorageLocalPrivado: (entorno?: NodeJS.ProcessEnv) => ConfiguracionStorageLocalPrivado;
/**
 * Almacenamiento privado para una instalación personal de un solo servidor.
 * No publica rutas HTTP: todos los accesos pasan por el backend y conservan SHA-256.
 */
export declare class LocalPrivateStorageAdapter implements StorageAdapter {
    private readonly configuracion;
    readonly proveedor = "LOCAL_PRIVADO";
    readonly capacidades: Readonly<CapacidadesStorage>;
    constructor(configuracion: ConfiguracionStorageLocalPrivado);
    private ruta;
    iniciarCarga(entrada: {
        referencia: ReferenciaObjetoStorage;
        mime: string;
        tamanoEsperado: bigint;
        claveIdempotencia: string;
    }): Promise<CargaIniciadaStorage>;
    crearObjetoExclusivo(entrada: {
        referencia: ReferenciaObjetoStorage;
        contenido: import('node:stream').Readable;
        mime: string;
        tamanoEsperado: bigint;
        claveIdempotencia: string;
        sha256?: string;
    }): Promise<IntegridadStorage>;
    consultarObjeto(referencia: ReferenciaObjetoStorage): Promise<IntegridadStorage>;
    abrirLectura(referencia: ReferenciaObjetoStorage): Promise<import("node:fs").ReadStream>;
    eliminarVersionPermitida(referencia: ReferenciaObjetoStorage): Promise<void>;
}
//# sourceMappingURL=LocalPrivateStorageAdapter.d.ts.map