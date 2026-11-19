import { Readable } from 'node:stream';
import type { PrismaClient } from '@prisma/client';
import type { CapacidadesStorage, CargaIniciadaStorage, IntegridadStorage, ReferenciaObjetoStorage, StorageAdapter } from '../StorageAdapter';
export declare class PostgresDocumentosComercialesStorage implements StorageAdapter {
    private readonly db;
    readonly proveedor = "POSTGRES";
    readonly capacidades: Readonly<CapacidadesStorage>;
    constructor(db: PrismaClient);
    private validar;
    iniciarCarga(entrada: {
        referencia: ReferenciaObjetoStorage;
        mime: string;
        tamanoEsperado: bigint;
        claveIdempotencia: string;
    }): Promise<CargaIniciadaStorage>;
    crearObjetoExclusivo(entrada: {
        referencia: ReferenciaObjetoStorage;
        contenido: Readable;
        mime: string;
        tamanoEsperado: bigint;
        claveIdempotencia: string;
        sha256?: string;
    }): Promise<IntegridadStorage>;
    private fila;
    consultarObjeto(ref: ReferenciaObjetoStorage): Promise<IntegridadStorage>;
    abrirLectura(ref: ReferenciaObjetoStorage): Promise<Readable>;
    eliminarVersionPermitida(ref: ReferenciaObjetoStorage): Promise<void>;
}
//# sourceMappingURL=PostgresDocumentosComercialesStorage.d.ts.map