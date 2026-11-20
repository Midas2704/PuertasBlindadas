import { Readable } from 'node:stream';
import { S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import type { CapacidadesStorage, CargaIncompletaStorage, CargaIniciadaStorage, ErrorStorageNormalizado, IntegridadStorage, ParteMultipartFirmadaStorage, ParteMultipartStorage, ReferenciaObjetoStorage, StorageAdapter, UrlFirmadaStorage } from '../StorageAdapter';
import type { ConfiguracionStorage } from './configuracionStorage';
type FirmadorS3 = typeof getSignedUrl;
export declare class ErrorStorage extends Error implements ErrorStorageNormalizado {
    readonly codigo: ErrorStorageNormalizado['codigo'];
    readonly proveedor: string;
    readonly reintentable: boolean;
    readonly estadoHttp?: number | undefined;
    constructor(codigo: ErrorStorageNormalizado['codigo'], proveedor: string, reintentable: boolean, mensaje: string, estadoHttp?: number | undefined);
}
export declare const normalizarErrorStorage: (error: unknown, proveedor: string, operacion: string) => ErrorStorage;
export interface DependenciasS3Compatible {
    cliente?: S3Client;
    firmar?: FirmadorS3;
    ahora?: () => Date;
}
export declare class S3CompatibleStorageAdapter implements StorageAdapter {
    private readonly configuracion;
    readonly proveedor: string;
    readonly capacidades: Readonly<CapacidadesStorage>;
    private readonly cliente;
    private readonly firmarComando;
    private readonly ahora;
    constructor(configuracion: ConfiguracionStorage, dependencias?: DependenciasS3Compatible);
    private validar;
    private referencia;
    private expiracion;
    private tamanoNumerico;
    private enviar;
    private integridad;
    private protegerLectura;
    iniciarCarga(entrada: {
        referencia: ReferenciaObjetoStorage;
        mime: string;
        tamanoEsperado: bigint;
        claveIdempotencia: string;
        multipart?: boolean;
    }): Promise<CargaIniciadaStorage>;
    subirStream(entrada: {
        referencia: ReferenciaObjetoStorage;
        contenido: Readable;
        mime: string;
        tamanoEsperado: bigint;
        sha256?: string;
    }): Promise<IntegridadStorage>;
    crearObjetoExclusivo(entrada: {
        referencia: ReferenciaObjetoStorage;
        contenido: Readable;
        mime: string;
        tamanoEsperado: bigint;
        claveIdempotencia: string;
        sha256?: string;
    }): Promise<IntegridadStorage>;
    firmarCarga(entrada: {
        referencia: ReferenciaObjetoStorage;
        mime: string;
        tamanoEsperado: bigint;
        expiraEn: Date;
    }): Promise<UrlFirmadaStorage>;
    consultarObjeto(referencia: ReferenciaObjetoStorage): Promise<IntegridadStorage>;
    abrirLectura(referencia: ReferenciaObjetoStorage): Promise<Readable>;
    abrirLecturaCondicionada(entrada: {
        referencia: ReferenciaObjetoStorage;
        etag: string;
    }): Promise<Readable>;
    firmarDescarga(entrada: {
        referencia: ReferenciaObjetoStorage;
        expiraEn: Date;
        nombreDescarga: string;
        mimeRespuesta?: string;
        cacheControlRespuesta?: string;
    }): Promise<UrlFirmadaStorage>;
    copiarObjeto(entrada: {
        origen: ReferenciaObjetoStorage;
        destino: ReferenciaObjetoStorage;
        claveIdempotencia: string;
        etagOrigen?: string;
        exigirDestinoAusente?: boolean;
    }): Promise<IntegridadStorage>;
    subirParteStream(entrada: {
        referencia: ReferenciaObjetoStorage;
        identificadorMultipart: string;
        numero: number;
        contenido: Readable;
        tamanoEsperado: bigint;
    }): Promise<ParteMultipartStorage>;
    firmarParteMultipart(entrada: {
        referencia: ReferenciaObjetoStorage;
        identificadorMultipart: string;
        numero: number;
        tamanoEsperado: bigint;
        expiraEn: Date;
    }): Promise<ParteMultipartFirmadaStorage>;
    confirmarMultipart(entrada: {
        referencia: ReferenciaObjetoStorage;
        identificadorMultipart: string;
        partes: readonly ParteMultipartStorage[];
        sha256Esperado?: string;
    }): Promise<IntegridadStorage>;
    abortarMultipart(entrada: {
        referencia: ReferenciaObjetoStorage;
        identificadorMultipart: string;
    }): Promise<void>;
    listarCargasIncompletas(entrada: {
        contenedor: string;
        prefijo?: string;
    }): Promise<readonly CargaIncompletaStorage[]>;
}
export {};
//# sourceMappingURL=S3CompatibleStorageAdapter.d.ts.map