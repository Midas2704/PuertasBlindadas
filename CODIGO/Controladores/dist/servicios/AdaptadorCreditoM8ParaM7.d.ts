import type { ProveedorCreditoM8 } from '../controladores/M7Controller';
import { M8Controller } from '../controladores/M8Controller';
type Consulta = Record<string, unknown>;
/** Publica en M7 los resultados calculados por el owner M8, sin reinterpretarlos. */
export declare class AdaptadorCreditoM8ParaM7 implements ProveedorCreditoM8 {
    private readonly credito;
    constructor(credito: M8Controller);
    consultarExposicion(consulta: Consulta): Promise<{
        totalSolicitudes: number;
        totalCompromisos: number;
        clientesSobreLimite: Record<string, unknown>[];
        clientesSuspendidos: Record<string, unknown>[];
        alertas: Record<string, unknown>[];
        concentracion: {
            exposicionTotal: number;
            clientes: Record<string, unknown>[];
        };
        estado: string;
        limiteGlobal: number | null;
        exposicionUtilizada: number;
        capacidadDisponible: number | null;
        cupoTotalAgregado: number;
        cupoUtilizadoAgregado: number;
        cupoDisponibleAgregado: number;
        avisoCapacidadProxima: string;
    }>;
    consultarAlertas(consulta: Consulta): Promise<{
        alertas: Record<string, unknown>[];
        criterio: string;
    }>;
}
export {};
//# sourceMappingURL=AdaptadorCreditoM8ParaM7.d.ts.map