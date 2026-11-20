type Registro = Record<string, any>;
export declare const formatoClpM6: (valor: unknown) => string;
export declare const fechaDocumentoM6: (valor: unknown, conHora?: boolean) => string;
export declare const presentarTextoM6: (valor: unknown) => string;
export declare const archivoLiquidacionM6: (item: Registro) => {
    nombre: string;
    mime: string;
    contenido: string;
};
export declare const archivoCalculoPreliminarM6: (item: Registro, revision: {
    bloqueos: Registro[];
    advertencias: Registro[];
}) => {
    nombre: string;
    mime: string;
    contenido: string;
};
export declare const archivoPeriodoRemuneracionesM6: (items: Registro[], anio: number, mes: number) => {
    nombre: string;
    mime: string;
    contenido: string;
};
export declare const archivoComprobanteAnticipoM6: (item: Registro, pagos: Registro[]) => {
    nombre: string;
    mime: string;
    contenido: string;
};
export {};
//# sourceMappingURL=documentosRemuneracionPdf.d.ts.map