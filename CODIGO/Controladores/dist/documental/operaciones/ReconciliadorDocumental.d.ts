import type { StorageAdapter } from '../StorageAdapter';
export type TipoHallazgoReconciliacion = 'OBJETO_FALTANTE' | 'TAMANO_DIVERGENTE' | 'INTENCION_EXPIRADA' | 'EVENTO_ATASCADO' | 'MULTIPART_ABANDONADO' | 'HUERFANOS_NO_EVALUABLES';
export interface HallazgoReconciliacion {
    tipo: TipoHallazgoReconciliacion;
    referencia: string;
    detalle?: string;
}
export interface VersionParaReconciliar {
    id: bigint;
    contenedor: string;
    clave: string;
    tamano: bigint;
    estado: string;
}
export interface IntencionParaReconciliar {
    id: string;
    estado: string;
    expiraEn: Date;
}
export interface EventoParaReconciliar {
    id: bigint;
    estado: string;
    creadoEn: Date;
}
/** Sólo diagnostica. No elimina, mueve ni repara objetos automáticamente. */
export declare class ReconciliadorDocumental {
    private readonly storage;
    constructor(storage: StorageAdapter);
    diagnosticar(entrada: {
        versiones: readonly VersionParaReconciliar[];
        intenciones: readonly IntencionParaReconciliar[];
        eventos: readonly EventoParaReconciliar[];
        ahora?: Date;
        contenedorTemporal?: string;
    }): Promise<readonly HallazgoReconciliacion[]>;
}
//# sourceMappingURL=ReconciliadorDocumental.d.ts.map