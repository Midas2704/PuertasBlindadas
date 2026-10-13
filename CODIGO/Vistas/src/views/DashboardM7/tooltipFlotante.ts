export type CajaTooltip = { anclaX: number; anclaY: number; ancho: number; alto: number; anchoVentana: number; altoVentana: number; margen?: number; separacion?: number };
export type PosicionTooltip = { izquierda: number; arriba: number };

export function calcularPosicionTooltip({ anclaX, anclaY, ancho, alto, anchoVentana, altoVentana, margen = 8, separacion = 12 }: CajaTooltip): PosicionTooltip {
  const limiteDerecho = Math.max(margen, anchoVentana - ancho - margen);
  const limiteInferior = Math.max(margen, altoVentana - alto - margen);
  const preferidaX = anclaX + separacion + ancho > anchoVentana - margen ? anclaX - ancho - separacion : anclaX + separacion;
  const preferidaY = anclaY + separacion + alto > altoVentana - margen ? anclaY - alto - separacion : anclaY + separacion;
  return {
    izquierda: Math.min(Math.max(preferidaX, margen), limiteDerecho),
    arriba: Math.min(Math.max(preferidaY, margen), limiteInferior),
  };
}
