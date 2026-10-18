import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DocumentosHistoricosCotizacion from './DocumentosHistoricosCotizacion';

vi.mock('../../api/finanzas', () => ({ solicitarFinanzas: vi.fn() }));
vi.mock('../../seguridad/Sesion', () => ({ usarSesion: vi.fn() }));
import { solicitarFinanzas } from '../../api/finanzas';
import { usarSesion } from '../../seguridad/Sesion';

const json = (datos: unknown, status = 200) => Promise.resolve(new Response(JSON.stringify(datos), { status, headers: { 'Content-Type': 'application/json' } }));
const sesion = (permisos: string[]) => ({ sesion: { id: '7', nombre: 'Prueba', acceso: 'interno', permisos, configuracion: '', administrador: false, cambiarClave: false }, cargando: false, actualizar: vi.fn() });

describe('consulta histórica de PDF de cotización', () => {
  beforeEach(() => {
    vi.mocked(solicitarFinanzas).mockReset();
    vi.mocked(usarSesion).mockReturnValue(sesion(['CU376']));
  });

  it('no consulta ni muestra acciones sin CU376', async () => {
    vi.mocked(usarSesion).mockReturnValue(sesion([]));
    const { container } = render(<DocumentosHistoricosCotizacion cotizacionId={44} estadoCotizacion="emitida" />);
    expect(container).toBeEmptyDOMElement();
    expect(solicitarFinanzas).not.toHaveBeenCalled();
  });

  it('recupera el PDF original en modal centrado y permite descargarlo', async () => {
    vi.mocked(solicitarFinanzas).mockImplementation((ruta) => {
      if (ruta === '/billing/quotes/44/documentos') return json([{ idVersion: '91', numeroVersion: 2, fechaEmision: '2026-10-18T12:00:00.000Z', estadoDocumental: 'DISPONIBLE', documento: { estado: 'ACTIVO', archivo: { numeroVersion: 1, estado: 'DISPONIBLE', nombre: 'cotizacion-44-v2.pdf', mime: 'application/pdf', tamanoBytes: 4096, sha256: 'a'.repeat(64), creadoEn: '2026-10-18T12:00:00.000Z', validadoEn: '2026-10-18T12:00:01.000Z' } } }]);
      if (ruta === '/billing/quotes/44/documentos/91/descarga') return json({ nombre: 'cotizacion-44-v2.pdf', mime: 'application/pdf', contenido: 'data:application/pdf;base64,JVBERi0xLjQ=', sha256: 'a'.repeat(64), tamanoBytes: 4096, numeroVersion: 2, fecha: '2026-10-18T12:00:00.000Z' });
      return json({ error: 'Ruta inesperada' }, 404);
    });
    const user = userEvent.setup();
    render(<DocumentosHistoricosCotizacion cotizacionId={44} estadoCotizacion="emitida" compacto />);
    await user.click(await screen.findByRole('button', { name: 'PDF' }));
    expect(await screen.findByRole('dialog')).toHaveTextContent('Historial documental');
    await user.click(screen.getByRole('button', { name: /Ver PDF/i }));
    expect(await screen.findByTitle('PDF emitido COT-44 versión 2')).toHaveAttribute('src', expect.stringMatching(/^data:application\/pdf;base64,/));
    expect(screen.getByRole('link', { name: /Descargar original/i })).toHaveAttribute('download', 'cotizacion-44-v2.pdf');
    expect(screen.getByText(/SHA-256:/)).toHaveTextContent('a'.repeat(64));
  });

  it('informa documento pendiente sin ofrecer una acción operativa', async () => {
    vi.mocked(solicitarFinanzas).mockImplementation(() => json([]));
    render(<DocumentosHistoricosCotizacion cotizacionId={45} estadoCotizacion="emitida" />);
    expect(await screen.findByText(/Documento pendiente de confirmación/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('button', { name: /PDF emitido/i })).not.toBeInTheDocument());
  });
});
