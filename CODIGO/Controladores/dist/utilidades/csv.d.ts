export type ColumnaCsv<T> = {
    encabezado: string;
    valor: (fila: T) => unknown;
};
export declare const crearCsvAdministrativo: <T>(filas: T[], columnas: ColumnaCsv<T>[], separador?: string) => string;
export declare const archivoCsvAdministrativo: <T>(nombre: string, filas: T[], columnas: ColumnaCsv<T>[], separador?: string) => {
    nombre: string;
    tipo: string;
    mime: string;
    contenido: string;
};
export declare const fechaCsv: (valor: unknown, conHora?: boolean) => string;
export declare const humanizarCsv: (valor: unknown) => string;
//# sourceMappingURL=csv.d.ts.map