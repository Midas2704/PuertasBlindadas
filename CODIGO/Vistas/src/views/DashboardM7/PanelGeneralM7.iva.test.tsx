import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TarjetaIvaM7 } from './PanelGeneralM7';

describe('tarjetas IVA M7', () => {
  const bloque = { estado: 'VALIDO', ivaEstimado: [{ moneda: 'CLP', ivaVentas: 19000, ivaCompras: 9500, ivaEstimado: 9500 }, { moneda: 'USD', ivaVentas: 19, ivaCompras: 9.5, ivaEstimado: 9.5 }] };

  it('muestra débito y crédito por moneda con advertencia tributaria', () => {
    const vista = render(<div><TarjetaIvaM7 titulo="IVA débito" campo="ivaVentas" bloque={bloque} periodo="octubre de 2026"/><TarjetaIvaM7 titulo="IVA crédito" campo="ivaCompras" bloque={bloque} periodo="octubre de 2026"/></div>);
    const debito = screen.getByText('IVA débito').closest('article')!;
    const credito = screen.getByText('IVA crédito').closest('article')!;
    expect(within(debito).getByText(/19\.000/)).toBeInTheDocument();
    expect(within(credito).getByText(/9\.500/)).toBeInTheDocument();
    expect(vista.getAllByText(/no constituye declaración oficial SII/i)).toHaveLength(2);
    expect(vista.getAllByText(/no se aplica sin una relación tributaria acreditada/i)).toHaveLength(2);
    expect(vista.getAllByText('Estimado')).toHaveLength(2);
    expect(vista.getAllByText('octubre de 2026')).toHaveLength(2);
  });

  it('presenta períodos separados en una comparación', () => {
    render(<TarjetaIvaM7 titulo="IVA débito" campo="ivaVentas" bloqueA={{ estado: 'VALIDO', ivaEstimado: [{ moneda: 'CLP', ivaVentas: 100, ivaCompras: 0 }] }} bloque={{ estado: 'VALIDO', ivaEstimado: [{ moneda: 'CLP', ivaVentas: 200, ivaCompras: 0 }] }} comparar periodoA="1–30 sept 2026" periodoB="1–31 oct 2026"/>);
    expect(screen.getByText('1–30 sept 2026')).toBeInTheDocument();
    expect(screen.getByText('1–31 oct 2026')).toBeInTheDocument();
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/200/)).toBeInTheDocument();
  });
});
