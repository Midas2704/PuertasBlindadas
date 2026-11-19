type Registro = Record<string, any>;
type EntradaInformeM7 = {
    origen: string;
    tituloContextual: string;
    periodo: {
        etiquetaDesde: string;
        etiquetaHasta: string;
    };
    filtros: string;
    generadoEn: Date;
    datos: unknown;
    panel?: unknown;
    historico?: unknown;
    modo?: string;
    comparacion?: {
        periodoA: {
            etiquetaDesde: string;
            etiquetaHasta: string;
        };
        periodoB: {
            etiquetaDesde: string;
            etiquetaHasta: string;
        };
    };
};
export declare const ordenarPagosRecientes: (pagos: Registro[]) => Registro[];
export declare const agruparEventosProyeccion: (eventos: Registro[]) => {
    fecha: string;
    cambio: number;
    liquidezProyectada: number | null;
}[];
export declare const resumirCarteraConsolidable: (cartera: Registro[]) => {
    consolidables: Registro[];
    noConsolidables: Registro[];
    totalClp: number;
    concentracion: {
        porcentaje: number | null;
        cliente: string;
        saldo: number;
    }[];
};
export declare const resumirProyeccionClp: (eventos: Registro[], ingresos: Registro[], egresos: Registro[], saldoFinal: Registro) => {
    base: number | null;
    cobros: number;
    pagos: number;
    final: number | null;
    calculado: number | null;
    consistente: boolean;
};
export declare function crearInformeDashboardM7(entrada: EntradaInformeM7): {
    nombre: string;
    mime: string;
    contenido: string;
};
export {};
//# sourceMappingURL=informeDashboardPdf.d.ts.map