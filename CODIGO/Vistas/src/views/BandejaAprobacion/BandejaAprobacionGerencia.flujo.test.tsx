import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BandejaAprobacionGerencia from './BandejaAprobacionGerencia';

vi.mock('../../api/finanzas', () => ({ solicitarFinanzas: vi.fn() }));
vi.mock('../../components/ModalPlanificacionOrdenes', () => ({
  default: ({ cotizacionId, modo }: { cotizacionId: number; modo: string }) => <div data-testid="planificacion">{cotizacionId}:{modo}</div>,
}));
vi.mock('../../components/ModalDetalleDocumento', () => ({
  default: ({ activeModal }: { activeModal: { data?: { id_cotizacion?: number } } | null }) => activeModal ? <div data-testid="detalle-cotizacion">{activeModal.data?.id_cotizacion}</div> : null,
}));
vi.mock('../../components/documental/DocumentosHistoricosCotizacion', () => ({ default: () => null }));
vi.mock('../../components/DialogosSistema', () => ({ confirmarAccion: vi.fn(), notificarUsuario: vi.fn(), solicitarTexto: vi.fn() }));

import { solicitarFinanzas } from '../../api/finanzas';

const respuesta = (datos: unknown) => Promise.resolve(new Response(JSON.stringify(datos), { status: 200, headers: { 'Content-Type': 'application/json' } }));
const cotizacion = (segmento: 'B2B' | 'B2C', estado = 'emitida') => ({
  id_cotizacion: segmento === 'B2B' ? 81 : 82,
  segmento_comercial: segmento,
  estado_cotizacion: estado,
  fecha_emision: '2026-11-09T00:00:00.000Z',
  monto_total_estimado: 100000,
  ficha_cliente: { cliente_financiero: { rut_cliente: '11.111.111-1', nombre_razon_social_referencia: 'Cliente sintético' } },
});

describe('bandeja de aprobación · selección del flujo comercial', () => {
  beforeEach(() => vi.mocked(solicitarFinanzas).mockReset());

  const preparar = (item: ReturnType<typeof cotizacion>) => {
    vi.mocked(solicitarFinanzas).mockImplementation(ruta => String(ruta).includes('pending-approvals')
      ? respuesta({ cotizaciones: [item], notas_venta: [] })
      : respuesta({ cotizaciones: [], notas_venta: [] }));
  };

  it('abre la aceptación B2B sólo para una cotización emitida B2B', async () => {
    preparar(cotizacion('B2B'));
    render(<BandejaAprobacionGerencia/>);
    await userEvent.click(await screen.findByTitle('Aprobar'));
    expect(await screen.findByTestId('planificacion')).toHaveTextContent('81:B2B');
  });

  it('abre el detalle con primer pago para una cotización emitida B2C', async () => {
    preparar(cotizacion('B2C'));
    render(<BandejaAprobacionGerencia/>);
    await userEvent.click(await screen.findByTitle('Aprobar'));
    expect(await screen.findByTestId('detalle-cotizacion')).toHaveTextContent('82');
    expect(screen.getByText('Completa el primer pago para consolidar la cotización B2C')).toBeInTheDocument();
  });

  it('no intenta aprobar un borrador como si fuera una oferta emitida', async () => {
    preparar(cotizacion('B2B', 'borrador'));
    render(<BandejaAprobacionGerencia/>);
    await userEvent.click(await screen.findByTitle('Aprobar'));
    await waitFor(() => expect(screen.getByText('Primero debes emitir la cotización y confirmar su PDF antes de aprobarla')).toBeInTheDocument());
    expect(screen.queryByTestId('planificacion')).not.toBeInTheDocument();
  });
});
