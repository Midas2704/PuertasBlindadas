import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ModalPlanificacionOrdenes from './ModalPlanificacionOrdenes';

vi.mock('../api/finanzas', () => ({ solicitarFinanzas: vi.fn() }));
vi.mock('./DialogosSistema', () => ({ confirmarAccion: vi.fn(() => Promise.resolve(true)) }));
import { solicitarFinanzas } from '../api/finanzas';

const respuesta = (datos: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(datos), { status, headers: { 'Content-Type': 'application/json' } }));

describe('M11 · aceptación B2B con oferta y líneas de OC acreditadas', () => {
  beforeEach(() => vi.mocked(solicitarFinanzas).mockReset());

  it('envía la versión elegida y líneas individuales sin asumir la última oferta', async () => {
    vi.mocked(solicitarFinanzas).mockImplementation((ruta, opciones) => {
      if (String(ruta).endsWith('/work-order-planning')) return respuesta({
        cotizacion: { id: 44, cliente: 'Empresa sintética', fechaVigencia: '2026-12-31', idMoneda: 1, moneda: 'CLP' },
        ofertas: [
          { id: 303, numero: 3, fecha: '2026-10-03', motivo: 'Tercera', estadoDocumental: 'DISPONIBLE' },
          { id: 302, numero: 2, fecha: '2026-10-02', motivo: 'Segunda', estadoDocumental: 'DISPONIBLE' },
          { id: 301, numero: 1, fecha: '2026-10-01', motivo: 'Primera', estadoDocumental: 'DISPONIBLE' },
        ],
        totalOt: 0, planificaciones: [], empleadosPorArea: {}, areas: [],
      });
      if (String(ruta).endsWith('/accept-b2b')) {
        const cuerpo = JSON.parse(String(opciones?.body));
        expect(cuerpo.idVersionOfertaAceptada).toBe(301);
        expect(cuerpo.lineasOrdenCompra).toEqual([{ numeroLinea: 1, idDetalleCotizacion: null, referenciaComercial: 'PARTIDA-01', concepto: 'Partida acreditada en OC', cantidad: '2', precioUnitario: '100000', idMoneda: 1 }]);
        return respuesta({ mensaje: 'ok' });
      }
      return respuesta({ error: 'Ruta inesperada' }, 404);
    });
    const user = userEvent.setup();
    const completado = vi.fn();
    render(<ModalPlanificacionOrdenes cotizacionId={44} modo="B2B" cerrar={vi.fn()} completado={completado}/>);
    await user.type(await screen.findByLabelText('Folio OC'), 'OC-44');
    await user.type(screen.getByLabelText('Respaldo OC'), 'respaldo://sintetico');
    await user.selectOptions(screen.getByLabelText('Oferta aceptada'), '301');
    await user.click(screen.getByRole('button', { name: /Agregar línea/i }));
    await user.type(screen.getByLabelText('Referencia comercial OC'), 'PARTIDA-01');
    await user.type(screen.getByLabelText('Concepto OC'), 'Partida acreditada en OC');
    await user.type(screen.getByLabelText('Cantidad OC'), '2');
    await user.type(screen.getByLabelText('Precio unitario OC'), '100000');
    await user.click(screen.getByRole('button', { name: /Confirmar aprobación/i }));
    await waitFor(() => expect(completado).toHaveBeenCalledTimes(1));
  });
});
