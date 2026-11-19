import { Prisma } from '@prisma/client';
export declare const CATEGORIAS_RESULTADOS_M10: readonly ["VENTAS_NETAS", "COSTOS_DIRECTOS", "GASTOS_OPERACIONALES"];
export declare const CATEGORIAS_FLUJO_M10: readonly ["INGRESOS_OPERACIONALES", "OTROS_INGRESOS", "PROVEEDORES", "REMUNERACIONES", "IMPUESTOS", "OTROS_EGRESOS"];
type TipoPartida = 'RESULTADOS' | 'FLUJO_CAJA';
type PartidaEntrada = {
    mes: number;
    tipo: TipoPartida;
    categoria: string;
    monto: Prisma.Decimal;
};
export declare function validarPresupuestoManualM10(entrada: Record<string, unknown>): {
    anio: number;
    ambito: string;
    moneda: string;
    revisionEsperada: number | null;
    motivo: string | null;
    partidas: PartidaEntrada[];
};
export declare function compararVersionesPresupuestoM10(versionA: any, versionB: any): {
    mes: number;
    tipo: string;
    categoria: string;
    versionA: number;
    versionB: number;
    diferencia: number;
    variacionPorcentual: number | null;
}[];
export declare class PresupuestoManualM10 {
    consultar(consulta: Record<string, unknown>): Promise<{
        estado: string;
        presupuestos: {
            id: string;
            anio: any;
            ambito: any;
            moneda: any;
            estado: any;
            revision: any;
            versiones: any;
        }[];
        conceptos: {
            real: string;
            proyeccion: string;
            presupuesto: string;
        };
    }>;
    guardar(entrada: Record<string, unknown>, actorId: bigint, id?: bigint): Promise<{
        id: string;
        anio: any;
        ambito: any;
        moneda: any;
        estado: any;
        revision: any;
        versiones: any;
    }>;
    compararVersiones(id: bigint, consulta: Record<string, unknown>): Promise<{
        presupuestoId: string;
        versionA: number;
        versionB: number;
        diferencias: {
            mes: number;
            tipo: string;
            categoria: string;
            versionA: number;
            versionB: number;
            diferencia: number;
            variacionPorcentual: number | null;
        }[];
    }>;
}
export {};
//# sourceMappingURL=presupuestoManualM10.d.ts.map