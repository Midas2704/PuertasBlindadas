import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ModalDetalleDocumento from './ModalDetalleDocumento';

vi.mock('../api/finanzas', () => ({ solicitarFinanzas: vi.fn() }));
vi.mock('./DialogosSistema', () => ({ notificarUsuario: vi.fn() }));
vi.mock('./OperacionesFinancieras', () => ({ default: () => <div data-testid="operaciones" /> }));
vi.mock('./TrazabilidadDocumentalM11', () => ({ default: ({ idCotizacion }: { idCotizacion: number }) => <div data-testid="cadena-m11">{idCotizacion}</div> }));

const cotizacion = (segmento: string | null, categoria: string | null) => ({
  id_cotizacion: 49,
  segmento_comercial: segmento,
  estado_cotizacion: 'emitida',
  fecha_emision: '2026-11-15T00:00:00Z',
  moneda: { codigo_moneda: 'CLP' },
  detalle_cotizacion: [],
  ficha_cliente: {
    cliente_financiero: {
      nombre_razon_social_referencia: 'Cliente sintético',
      rut_cliente: '11111111-1',
      tipo_cliente_financiero: { nombre_tipo_cliente_financiero: categoria },
    },
  },
});

function mostrar(segmento: string | null, categoria: string | null) {
  return render(<ModalDetalleDocumento activeModal={{ tipo: 'cotizacion', data: cotizacion(segmento, categoria) }} onClose={() => {}} />);
}

describe('EF16 · cadena documental M11 sólo en cotizaciones B2B acreditadas', () => {
  it('B2B con categoría real B2B muestra M11', () => {
    mostrar('B2B', 'B2B');
    expect(screen.queryByTestId('cadena-m11')).not.toBeInTheDocument();
  });
  it('B2C con categoría real B2C no muestra M11', () => {
    mostrar('B2C', 'B2C');
    expect(screen.queryByTestId('cadena-m11')).not.toBeInTheDocument();
    expect(screen.getByTestId('operaciones')).toBeInTheDocument();
  });
  it('cliente B2C con segmento mal declarado B2B no muestra M11', () => {
    mostrar('B2B', 'B2C');
    expect(screen.queryByTestId('cadena-m11')).not.toBeInTheDocument();
  });
  it('cliente B2B con segmento mal declarado B2C no muestra M11', () => {
    mostrar('B2C', 'B2B');
    expect(screen.queryByTestId('cadena-m11')).not.toBeInTheDocument();
  });
  it('segmento ausente no expone conciliación documental B2B', () => {
    mostrar(null, 'B2B');
    expect(screen.queryByTestId('cadena-m11')).not.toBeInTheDocument();
  });
});
