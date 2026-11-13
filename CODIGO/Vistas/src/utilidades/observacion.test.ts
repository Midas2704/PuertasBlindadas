import { describe, expect, it } from 'vitest';
import { presentarObservacion } from './observacion';

describe('presentarObservacion', () => {
  it('convierte el JSON histórico de una venta directa en texto legible', () => {
    const valor = JSON.stringify({
      detalleComercial: [{ tipo: 'producto', descripcion: 'Puerta PB-01', cantidad: 2, valor: 450000 }],
      montoBaseCalculado: '900000.00',
      persistencia: 'auxiliar_hasta_detalle_nv_estructurado',
    });
    expect(presentarObservacion(valor)).toBe('Venta directa\n1. producto: Puerta PB-01 — 2 unidad(es) · $450.000\nMonto base: $900.000');
  });

  it('presenta saltos y marcado como texto plano sin devolver etiquetas ejecutables', () => {
    expect(presentarObservacion('<p>Primera línea</p><script>alert(1)</script><div>Segunda<br>línea</div>'))
      .toBe('Primera línea\nSegunda\nlínea');
    expect(presentarObservacion('<img src=x onerror=alert(1)>Texto')).toBe('Texto');
    expect(presentarObservacion('&#999999999;')).toBe('\ufffd');
  });

  it('conserva saltos de línea y limita los espacios repetidos', () => {
    expect(presentarObservacion('Línea uno\r\n\r\n  Línea   dos  ')).toBe('Línea uno\n\nLínea dos');
  });
});
