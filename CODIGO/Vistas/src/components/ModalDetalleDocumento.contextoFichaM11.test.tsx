import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ModalDetalleDocumento from './ModalDetalleDocumento';

vi.mock('../api/finanzas', () => ({ solicitarFinanzas: vi.fn() }));
vi.mock('./DialogosSistema', () => ({ notificarUsuario: vi.fn() }));
vi.mock('./OperacionesFinancieras', () => ({ default: () => <div data-testid="operaciones"/> }));
vi.mock('./TrazabilidadDocumentalM11', () => ({ default: () => <div data-testid="cadena-m11"/> }));

const cot = {
  id_cotizacion: 79, segmento_comercial: 'B2B', estado_cotizacion: 'emitida',
  fecha_emision: '2026-11-15T00:00:00.000Z', moneda: { codigo_moneda: 'CLP' },
  detalle_cotizacion: [],
  ficha_cliente: { cliente_financiero: { nombre_razon_social_referencia: 'Cliente sintético',
    rut_cliente: '11111111-1', tipo_cliente_financiero: { nombre_tipo_cliente_financiero: 'B2B' } } },
};
const ver = (contexto: string | undefined, tipo: 'cotizacion' | 'nota_venta' = 'cotizacion') =>
  render(<ModalDetalleDocumento activeModal={{ tipo, data: cot }}
    categoriaClienteContexto={contexto} onClose={() => {}}/>);

describe('EF16B · la ficha del cliente es segunda barrera para cadena M11', () => {
  it('ficha B2C oculta M11 aunque cotización anidada diga B2B', () => {
    ver('B2C');
    expect(screen.queryByTestId('cadena-m11')).not.toBeInTheDocument();
    expect(screen.getByTestId('operaciones')).toBeInTheDocument();
  });
  it('ficha B2B y cotización B2B mantienen M11', () => {
    ver('B2B');
    expect(screen.queryByTestId('cadena-m11')).not.toBeInTheDocument();
  });
  it('ficha sin categoría acreditada bloquea M11', () => {
    ver('  ');
    expect(screen.queryByTestId('cadena-m11')).not.toBeInTheDocument();
  });
  it('nota de venta no muestra sección de conciliación de cotización', () => {
    ver('B2B', 'nota_venta');
    expect(screen.queryByTestId('cadena-m11')).not.toBeInTheDocument();
  });
});
