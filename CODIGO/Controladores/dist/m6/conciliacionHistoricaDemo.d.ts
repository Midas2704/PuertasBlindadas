import type { Prisma } from '@prisma/client';
export interface ComponenteParaConciliar {
    id_componente_remuneracion: number;
    tipo: string;
    descripcion: string;
    monto: unknown;
    clave_negocio: string | null;
    fuente_tipo: string;
    estado_revision: string;
    motivo: string | null;
    referencia_origen: string | null;
    version_origen: string | null;
    fecha_origen: Date | null;
    id_componente_origen: number | null;
    tipo_relacion: string | null;
}
export interface ComponenteVigente {
    tipo: string;
    clave_negocio: string | null;
    monto: unknown;
    fuente_tipo: string;
    estado_revision: string;
}
export declare function manifiestoDemoValido(descripcion: string | null): boolean;
/**
 * Decide sin escribir. Exige un par exacto y no ambiguo de componentes
 * originados por la seed y la existencia de sus sustitutos aprobados.
 */
export declare function seleccionarParHistoricoDemo(anio: number, mes: number, componentesDemo: ReadonlyArray<ComponenteParaConciliar>, vigentes: ReadonlyArray<ComponenteVigente>): number[];
/**
 * Opera DENTRO de la transacción serializable ya abierta por M6.
 * Jamás altera remuneraciones cerradas, con pagos ni sin manifiesto DEMO.
 */
export declare function conciliarHistoricosDemoEnCalculo(tx: Prisma.TransactionClient, idRemuneracion: number): Promise<number>;
//# sourceMappingURL=conciliacionHistoricaDemo.d.ts.map