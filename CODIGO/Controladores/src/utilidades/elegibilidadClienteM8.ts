/** Elegibilidad para NUEVAS operaciones de crédito: no bloquea consultas históricas. */
export type FichaElegibilidadCreditoM8 = {
  estado_ficha: string;
  cliente_financiero: { estado_financiero: string };
};

export const fichaActivaParaCreditoM8 = (ficha: FichaElegibilidadCreditoM8): boolean =>
  ficha.estado_ficha.trim().toLowerCase() === 'activa' &&
  ficha.cliente_financiero.estado_financiero.trim().toLowerCase() === 'activo';
