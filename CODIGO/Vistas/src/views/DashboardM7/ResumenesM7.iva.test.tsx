import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BloqueIvaResultadosM7 } from './ResumenesM7';

const iva = { ivaVentas: [{ moneda: 'CLP', monto: 19000 }], ivaCompras: [{ moneda: 'CLP', monto: 9500 }], ivaEstimado: [{ moneda: 'CLP', ivaEstimado: 9500 }] };

describe('protección visual de IVA en Resúmenes M7', () => {
  it('no renderiza información tributaria sin CU243', () => {
    const { container } = render(<BloqueIvaResultadosM7 iva={iva} autorizado={false}/>);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText(/IVA débito/)).not.toBeInTheDocument();
  });

  it('renderiza el bloque autorizado con CU243', () => {
    render(<BloqueIvaResultadosM7 iva={iva} autorizado/>);
    expect(screen.getByText('IVA estimado')).toBeInTheDocument();
    expect(screen.getByText('IVA débito / ventas')).toBeInTheDocument();
    expect(screen.getByText('IVA crédito / compras')).toBeInTheDocument();
  });
});
