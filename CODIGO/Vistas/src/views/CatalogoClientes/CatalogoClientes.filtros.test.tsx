import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CatalogoClientes from './CatalogoClientes';

const control = vi.hoisted(() => ({ solicitar: vi.fn() }));
vi.mock('../../api/finanzas', () => ({ solicitarFinanzas: control.solicitar }));
vi.mock('../../seguridad/Sesion', () => ({ usarSesion: () => ({ sesion: { permisos: ['CU05','CU06','CU07','CU08','CU11'] } }) }));
vi.mock('../../components/DialogosSistema', () => ({ confirmarAccion: vi.fn(), solicitarTexto: vi.fn() }));

describe('filtros operacionales de clientes M1', () => {
  beforeEach(() => {
    control.solicitar.mockReset();
    control.solicitar.mockResolvedValue({ ok: true, json: async () => [] });
  });

  it('envía situación exacta, período y orden por última actividad', async () => {
    render(<CatalogoClientes />);
    await screen.findByText('No se encontraron clientes.');
    fireEvent.change(screen.getByLabelText('Situación financiera'), { target: { value: 'moroso' } });
    fireEvent.change(screen.getByLabelText('Ordenar catálogo'), { target: { value: 'ultimaActividad' } });
    fireEvent.change(screen.getByLabelText('Actividad desde'), { target: { value: '2026-01-01' } });
    fireEvent.change(screen.getByLabelText('Actividad hasta'), { target: { value: '2026-12-31' } });
    await waitFor(() => expect(control.solicitar).toHaveBeenCalledWith(expect.stringMatching(/situacion=moroso/), expect.anything()));
    const ruta = control.solicitar.mock.calls.at(-1)?.[0] as string;
    expect(ruta).toContain('ordenar=ultimaActividad');
    expect(ruta).toContain('fechaDesde=2026-01-01');
    expect(ruta).toContain('fechaHasta=2026-12-31');
  });
});
