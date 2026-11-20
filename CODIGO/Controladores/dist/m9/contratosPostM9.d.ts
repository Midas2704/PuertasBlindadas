import { M9Controller } from '../controladores/M9Controller';
type ContextoOwnerM9 = {
    owner: string;
    identidadLogica: string;
    ocurridoEn: string;
    zonaHoraria: string;
    referenciaOwner: string;
    finalidadRef?: string;
    baseRef?: string;
    politicaRef?: string;
};
type DerechoOwnerM9 = ContextoOwnerM9 & {
    tipo: 'EJERCICIO' | 'ACUSE' | 'RESOLUCION' | 'PROPAGACION' | 'BLOQUEO_INICIO' | 'BLOQUEO_FIN';
    estado?: string;
    fechaAcuse?: string;
    fechaInicio?: string;
    fechaFin?: string;
    plazoRef?: string;
    decision?: 'RESUELTO' | 'DENEGADO';
    fundamentoRef?: string;
    receptores?: string[];
};
type IncidenteOwnerM9 = ContextoOwnerM9 & {
    clasificadoPorOwner: boolean;
    naturaleza?: string;
    efectos?: string;
    categorias?: string[];
    volumenAproximado?: string;
    medidas?: string[];
    comunicacionRef?: string;
    tratamientoAdicionalRef?: string;
};
export declare class ReceptorPostM9 {
    private m9;
    constructor(m9: M9Controller);
    recibirDerecho(entrada: DerechoOwnerM9): Promise<{
        estado: "PERSISTIDO";
        evento: import("./tipos").EventoPersistidoM9;
        reintento: boolean;
    } | {
        estado: "PENDIENTE";
        evento: null;
        reintento: boolean;
    }>;
    recibirIncidente(entrada: IncidenteOwnerM9): Promise<{
        estado: "PERSISTIDO";
        evento: import("./tipos").EventoPersistidoM9;
        reintento: boolean;
    } | {
        estado: "PENDIENTE";
        evento: null;
        reintento: boolean;
    }>;
    estadoContextoFinalidad(entrada: Pick<ContextoOwnerM9, 'finalidadRef' | 'baseRef' | 'politicaRef'>): {
        estado: string;
        finalidadRef?: undefined;
        baseRef?: undefined;
        politicaRef?: undefined;
    } | {
        estado: string;
        finalidadRef: null;
        baseRef: null;
        politicaRef: null;
    };
}
export {};
//# sourceMappingURL=contratosPostM9.d.ts.map