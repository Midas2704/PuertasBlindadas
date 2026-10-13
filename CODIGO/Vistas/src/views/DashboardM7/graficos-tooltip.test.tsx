import { fireEvent, render, waitFor } from '@testing-library/react';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { GraficoArea, GraficoBarras, GraficoCombinado, GraficoDonut, GraficoLinea, TooltipConversionCotizaciones } from './graficos';

const datos = [
  { periodo: '2026-01', ventas: 100, costos: 60, resultado: 40, cotizaciones: 10, convertidas: 5, conversionPorcentual: 50, periodoConversionAnioAnterior: '2025-01', cotizacionesAnioAnterior: 8, convertidasAnioAnterior: 4, conversionAnioAnterior: 50, diferenciaConversionPp: 0 },
  { periodo: '2026-02', ventas: 140, costos: 75, resultado: 65, cotizaciones: 12, convertidas: 7, conversionPorcentual: 58.3, periodoConversionAnioAnterior: '2025-02', cotizacionesAnioAnterior: 9, convertidasAnioAnterior: 4, conversionAnioAnterior: 44.4, diferenciaConversionPp: 13.9 },
];
let origenLeft = 40;
let origenTop = 60;

beforeAll(() => {
  class ResizeObserverPrueba {
    private callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) { this.callback = callback; }
    observe(elemento: Element) { this.callback([{ target: elemento, contentRect: { width: 680, height: 320 } } as ResizeObserverEntry], this as unknown as ResizeObserver); }
    unobserve() { /* sin operación */ }
    disconnect() { /* sin operación */ }
  }
  vi.stubGlobal('ResizeObserver', ResizeObserverPrueba);
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const tooltip = this instanceof HTMLElement && this.dataset.tooltipM7 === 'true';
    const leyenda = this instanceof HTMLElement && this.classList.contains('recharts-legend-wrapper');
    const width = tooltip ? 180 : 680; const height = tooltip ? 90 : leyenda ? 30 : 320;
    return { x: origenLeft, y: origenTop, left: origenLeft, top: origenTop, width, height, right: origenLeft + width, bottom: origenTop + height, toJSON: () => ({}) };
  });
});

beforeEach(() => { origenLeft = 40; origenTop = 60; });

async function comprobarTooltip(contenedor: HTMLElement, selector = '.recharts-wrapper') {
  const objetivo = contenedor.querySelector(selector);
  expect(objetivo).not.toBeNull();
  fireEvent.mouseEnter(objetivo!, { clientX: 380, clientY: 180 });
  fireEvent.mouseMove(objetivo!, { clientX: 380, clientY: 180 });
  await waitFor(() => {
    const tooltip = document.body.querySelector<HTMLElement>('[data-tooltip-m7="true"]');
    expect(tooltip).not.toBeNull();
    expect(tooltip).toHaveStyle({ position: 'fixed', visibility: 'visible', pointerEvents: 'none' });
    expect(Number.parseFloat(tooltip!.style.left)).toBeGreaterThanOrEqual(8);
    expect(Number.parseFloat(tooltip!.style.top)).toBeGreaterThanOrEqual(8);
  });
}

describe('tooltips visibles de los gráficos compartidos M7', () => {
  it('visualiza el tooltip de líneas', async () => { const { container } = render(<GraficoLinea datos={datos} etiqueta="periodo" series={[{ clave: 'ventas', nombre: 'Ventas' }]}/>); await comprobarTooltip(container); });
  it('visualiza el tooltip de áreas', async () => { const { container } = render(<GraficoArea datos={datos} etiqueta="periodo" series={[{ clave: 'resultado', nombre: 'Resultado' }]}/>); await comprobarTooltip(container); });
  it('visualiza el tooltip de barras', async () => { const { container } = render(<GraficoBarras datos={datos} etiqueta="periodo" series={[{ clave: 'ventas', nombre: 'Ventas' }]}/>); await comprobarTooltip(container); });
  it('visualiza el tooltip combinado personalizado', async () => { const { container } = render(<GraficoCombinado datos={datos} barras={[{ clave: 'cotizaciones', nombre: 'Cotizaciones' }]} lineas={[{ clave: 'conversionPorcentual', nombre: 'Conversión' }]} porcentaje tooltipPersonalizado={<TooltipConversionCotizaciones/>}/>); await comprobarTooltip(container); expect(document.body).toHaveTextContent('Cotizaciones emitidas'); });
  it('visualiza el tooltip circular', async () => { const { container } = render(<GraficoDonut datos={[{ nombre: 'B2B', valor: 70 }, { nombre: 'B2C', valor: 30 }]}/>); await waitFor(() => expect(container.querySelector('.recharts-sector')).not.toBeNull()); await comprobarTooltip(container, '.recharts-sector'); });
  it('recalcula la posición ante scroll horizontal y vertical', async () => { const { container } = render(<GraficoLinea datos={datos} etiqueta="periodo" series={[{ clave: 'ventas', nombre: 'Ventas' }]}/>); await comprobarTooltip(container); origenLeft = -600; origenTop = -400; fireEvent.scroll(window); await waitFor(() => expect(document.body.querySelector<HTMLElement>('[data-tooltip-m7="true"]')).toHaveStyle({ left: '8px', top: '8px' })); });
});
