import { JsonM9, ResultadoM9 } from './tipos';
export declare function validarSinSecretos(valor: unknown, ruta?: string): void;
export declare function textoSeguro(valor: unknown, nombre: string, maximo?: number): string;
export declare function normalizarResultado(valor: string): ResultadoM9;
export declare const hashM9: (valor: unknown) => string;
export declare function deltaMinimo(anterior?: JsonM9, nuevo?: JsonM9): {
    anterior: null;
    nuevo: null;
} | {
    anterior: JsonM9;
    nuevo: JsonM9;
};
export declare function fechaConZona(valor: string, zona: string): Date;
export declare function enmascarar(valor: unknown, campos: string[], ruta?: string): unknown;
//# sourceMappingURL=seguridad.d.ts.map