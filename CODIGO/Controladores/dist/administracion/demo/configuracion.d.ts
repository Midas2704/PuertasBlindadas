export interface ConfiguracionDemo {
    corte: string;
    meses: number;
    semilla: number;
    version: number;
}
export declare function configuracionDemo(env: Record<string, string | undefined>): ConfiguracionDemo;
export declare function acotarEfectiva(fecha: Date, config: ConfiguracionDemo): Date;
export declare function fechaMes(config: ConfiguracionDemo, indice: number, dia?: number): Date;
export declare function variar(semilla: number, minimo: number, maximo: number, ...claves: number[]): number;
export declare function planDemo(config: ConfiguracionDemo): {
    estado: string;
    configuracion: ConfiguracionDemo;
    desde: string;
    hasta: string;
    aniosCompletos: string[];
    meses: {
        mes: string;
        cotizaciones: number;
        ventas: number;
        pagosCliente: number;
        comprasM5: number;
        gastosCaja: number;
    }[];
    esperados: {
        clientes: number;
        usuariosFicticiosSinAcceso: number;
        materiales: number;
        items: number;
        proveedores: number;
        cotizaciones: number;
        notas: number;
        pagosCliente: number;
        periodosRemuneracion: number;
        remuneraciones: number;
        documentosProveedor: number;
        categoriasEgreso: number;
        esquemas: number;
        honorariosPrestadores: number;
        obras: number;
    };
    limitaciones: string[];
};
export declare function validarComparativasM7(cortes: Array<{
    corte: string;
    ventas: {
        monto: unknown;
        cantidad: unknown;
    };
}>): void;
//# sourceMappingURL=configuracion.d.ts.map