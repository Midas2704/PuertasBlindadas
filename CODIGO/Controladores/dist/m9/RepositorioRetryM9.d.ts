import { FuentePendientesM9, NuevoPendienteM9, PendienteM9 } from './puertos';
export declare class RepositorioRetryM9Prisma implements FuentePendientesM9 {
    guardar(item: NuevoPendienteM9): Promise<void>;
    listar(): Promise<PendienteM9[]>;
    elegibles(ahora: Date, limite: number): Promise<PendienteM9[]>;
    reclamar(id: number, ahora: Date, leaseHasta: Date): Promise<boolean>;
    registrarResultado(id: number, resultado: 'EXITOSO' | 'FALLIDO', fecha: Date, errorCodigo?: string, proximoIntentoEn?: Date): Promise<void>;
}
//# sourceMappingURL=RepositorioRetryM9.d.ts.map