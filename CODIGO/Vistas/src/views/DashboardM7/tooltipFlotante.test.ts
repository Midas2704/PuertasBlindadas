import { describe, expect, it } from 'vitest';
import { calcularPosicionTooltip } from './tooltipFlotante';

const base = { ancho: 180, alto: 90, anchoVentana: 800, altoVentana: 600 };

describe('calcularPosicionTooltip', () => {
  it('ubica la caja a la derecha y abajo en el centro', () => {
    expect(calcularPosicionTooltip({ ...base, anclaX: 400, anclaY: 300 })).toEqual({ izquierda: 412, arriba: 312 });
  });

  it('invierte horizontalmente cerca del borde derecho', () => {
    expect(calcularPosicionTooltip({ ...base, anclaX: 790, anclaY: 300 })).toEqual({ izquierda: 598, arriba: 312 });
  });

  it('invierte verticalmente cerca del borde inferior', () => {
    expect(calcularPosicionTooltip({ ...base, anclaX: 400, anclaY: 590 })).toEqual({ izquierda: 412, arriba: 488 });
  });

  it('respeta los límites superior e izquierdo', () => {
    expect(calcularPosicionTooltip({ ...base, anclaX: -120, anclaY: -80 })).toEqual({ izquierda: 8, arriba: 8 });
  });

  it('respeta simultáneamente las cuatro esquinas', () => {
    const esquinas = [[0, 0], [800, 0], [0, 600], [800, 600]];
    for (const [anclaX, anclaY] of esquinas) {
      const posicion = calcularPosicionTooltip({ ...base, anclaX, anclaY });
      expect(posicion.izquierda).toBeGreaterThanOrEqual(8);
      expect(posicion.arriba).toBeGreaterThanOrEqual(8);
      expect(posicion.izquierda + base.ancho).toBeLessThanOrEqual(base.anchoVentana - 8);
      expect(posicion.arriba + base.alto).toBeLessThanOrEqual(base.altoVentana - 8);
    }
  });

  it('se adapta a una pantalla móvil', () => {
    const posicion = calcularPosicionTooltip({ anclaX: 350, anclaY: 630, ancho: 300, alto: 180, anchoVentana: 360, altoVentana: 640 });
    expect(posicion).toEqual({ izquierda: 38, arriba: 438 });
  });

  it('usa la posición visible resultante de scroll horizontal y vertical', () => {
    const posicion = calcularPosicionTooltip({ ...base, anclaX: 75, anclaY: 520 });
    expect(posicion).toEqual({ izquierda: 87, arriba: 418 });
  });
});
