export declare const politica: {
    longitud: number;
    historial: number;
    vigenciaDias: number;
    temporalMinutos: number;
    sesionMinutos: number;
    inactividadMinutos: number;
    recuperacionMinutos: number;
    intentos: number;
    bloqueoMinutos: number;
    bloqueos: number;
};
export declare const secreto: () => string;
export declare const huella: (valor: string) => string;
export declare const futuro: (minutos: number) => Date;
export declare function hashClave(clave: string): Promise<string>;
export declare function comprobarClave(clave: unknown, hash: string): Promise<boolean>;
export declare function validarClave(clave: unknown): asserts clave is string;
//# sourceMappingURL=seguridad.d.ts.map