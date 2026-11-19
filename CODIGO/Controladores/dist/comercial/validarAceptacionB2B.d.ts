/** EF15: protección de la aceptación B2B contra cruces de categoría y clientes inactivos. */
type ContextoAceptacionB2B = {
    segmentoCotizacion: unknown;
    tipoCliente: unknown;
    estadoCliente: unknown;
    estadoFicha: unknown;
};
export declare function clienteAceptableB2B(d: ContextoAceptacionB2B): boolean;
export {};
//# sourceMappingURL=validarAceptacionB2B.d.ts.map