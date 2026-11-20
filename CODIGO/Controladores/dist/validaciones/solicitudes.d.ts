export declare function identificador(valor: unknown): number;
export declare function texto(valor: unknown, maximo?: number): string;
export declare function numeroNoNegativo(valor: unknown, nombre: string): number;
export type FiltrosClientes = {
    busqueda: string;
    estado: 'activos' | 'inactivos' | 'todos';
    segmento?: 'B2B' | 'B2C';
    deuda: boolean;
    morosos: boolean;
    situacion?: 'al_dia' | 'deuda_vigente' | 'moroso';
    fechaDesde?: Date;
    fechaHasta?: Date;
    ordenar: 'nombre' | 'rut' | 'saldo' | 'ultimaActividad';
    direccion: 'asc' | 'desc';
};
export declare function validarFiltros(consulta: Record<string, unknown>): FiltrosClientes;
//# sourceMappingURL=solicitudes.d.ts.map