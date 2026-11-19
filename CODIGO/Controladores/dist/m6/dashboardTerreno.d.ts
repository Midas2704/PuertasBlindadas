export type OtDashboard = {
    id: string;
    estadoUnidad: string;
    estadoOrden: string | null;
    estadoRectificacion: string | null;
    creada: Date;
    rectificada: Date | null;
    enviada: Date | null;
    decidida: Date | null;
    liberada: Date | null;
    cerrada: Date | null;
};
export type TareaDashboard = {
    id: string;
    idOt: string;
    estado: string;
    areaId: string | null;
    area: string | null;
    responsableId: number | null;
    responsable: string | null;
    ejecuciones: Array<{
        validacion: string;
    }>;
    esCorrectiva: boolean;
};
export declare const promedioDias: (pares: Array<[Date | null, Date | null]>) => {
    valorDias: number | null;
    muestras: number;
};
export declare const estadoVisibleOtDashboard: (ot: OtDashboard) => string;
export declare function resumirOperacionTerreno(ots: OtDashboard[], tareas: TareaDashboard[]): {
    ordenes: {
        total: number;
        estados: {
            codigo: string;
            nombre: string;
            cantidad: number;
        }[];
    };
    fabricacion: {
        puertasEnFabricacion: number;
        puertasFinalizadas: number;
        tareasRequeridas: number;
        tareasPendientes: number;
        tareasEnEjecucion: number;
        ejecucionesPendientesValidacion: number;
        tareasValidadas: number;
        tareasCerradas: number;
        correccionesPendientes: number;
        porcentajeAvance: number | null;
    };
    areas: {
        puertas: number;
        id: string;
        nombre: string;
        asignadas: number;
        pendientes: number;
        enEjecucion: number;
        cerradas: number;
    }[];
    responsables: {
        id: number;
        nombre: string;
        area: string | null;
        abiertas: number;
        enEjecucion: number;
        cerradas: number;
    }[];
    tiempos: {
        valorDias: number | null;
        muestras: number;
        codigo: string;
        nombre: string;
    }[];
};
export declare function resumirIncidenciasTerreno(items: Array<{
    estado: string;
    estadoRevision: string;
    categoria: string | null;
    area: string | null;
    periodo: string;
}>): {
    total: number;
    pendientesRevision: number;
    aprobadas: number;
    rechazadas: number;
    pendientesResolucion: number;
    corregidas: number;
    cerradas: number;
    fallasConfirmadas: number;
    porCategoria: {
        nombre: string;
        cantidad: number;
    }[];
    porArea: {
        nombre: string;
        cantidad: number;
    }[];
    porPeriodo: {
        nombre: string;
        cantidad: number;
    }[];
};
//# sourceMappingURL=dashboardTerreno.d.ts.map