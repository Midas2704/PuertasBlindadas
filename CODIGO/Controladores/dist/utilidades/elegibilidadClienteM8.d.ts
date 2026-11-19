/** Elegibilidad para NUEVAS operaciones de crédito: no bloquea consultas históricas. */
export type FichaElegibilidadCreditoM8 = {
    estado_ficha: string;
    cliente_financiero: {
        estado_financiero: string;
    };
};
export declare const fichaActivaParaCreditoM8: (ficha: FichaElegibilidadCreditoM8) => boolean;
//# sourceMappingURL=elegibilidadClienteM8.d.ts.map