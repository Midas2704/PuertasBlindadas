import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usarConsultaM7 } from './componentes';

type Pendiente = { ruta: string; signal?: AbortSignal; resolver: (respuesta: Response) => void; rechazar: (error: Error) => void };
const pendientes: Pendiente[] = [];

function VistaPrueba() {
  const q = usarConsultaM7('/prueba');
  return <div><button onClick={() => q.cambiar(2025, 1)}>2025</button><button onClick={() => q.cambiar(2024, 1)}>2024</button><span data-testid="cargando">{String(q.cargando)}</span><span data-testid="dato">{String(q.datos?.marca || '')}</span><span data-testid="error">{q.error}</span></div>;
}

const responder = async (indice: number, cuerpo: unknown, estado = 200) => { await act(async () => pendientes[indice].resolver(new Response(JSON.stringify(cuerpo), { status: estado, headers: { 'Content-Type': 'application/json' } }))); };

describe('usarConsultaM7', () => {
  afterEach(() => { pendientes.length = 0; vi.unstubAllGlobals(); });
  const montar = () => { vi.stubGlobal('fetch', vi.fn((ruta: string, opciones?: RequestInit) => new Promise<Response>((resolver, rechazar) => pendientes.push({ ruta: String(ruta), signal: opciones?.signal || undefined, resolver, rechazar })))); return render(<MemoryRouter initialEntries={['/resumen?anio=2026&mes=10']}><VistaPrueba/></MemoryRouter>); };

  it('mantiene el dato confirmado mientras actualiza', async () => { montar(); await responder(0, { marca: 'confirmado' }); expect(await screen.findByText('confirmado')).toBeInTheDocument(); fireEvent.click(screen.getByText('2025')); await waitFor(() => expect(pendientes).toHaveLength(2)); expect(screen.getByTestId('dato')).toHaveTextContent('confirmado'); expect(screen.getByTestId('cargando')).toHaveTextContent('true'); });
  it('la última selección prevalece ante respuestas fuera de orden', async () => { montar(); await responder(0, { marca: 'inicial' }); fireEvent.click(screen.getByText('2025')); await waitFor(() => expect(pendientes).toHaveLength(2)); fireEvent.click(screen.getByText('2024')); await waitFor(() => expect(pendientes).toHaveLength(3)); await responder(2, { marca: 'nuevo' }); await responder(1, { marca: 'obsoleto' }); expect(screen.getByTestId('dato')).toHaveTextContent('nuevo'); expect(pendientes[1].signal?.aborted).toBe(true); });
  it('conserva el último dato y expone el error sin presentarlo como respuesta nueva', async () => { montar(); await responder(0, { marca: 'confirmado' }); fireEvent.click(screen.getByText('2025')); await waitFor(() => expect(pendientes).toHaveLength(2)); await responder(1, { error: 'Falla controlada' }, 500); expect(await screen.findByText('Falla controlada')).toBeInTheDocument(); expect(screen.getByTestId('dato')).toHaveTextContent('confirmado'); });
  it('cambiar período no fuerza el scroll de la ventana', async () => { const scroll = vi.spyOn(window, 'scrollTo').mockImplementation(() => undefined); montar(); await responder(0, { marca: 'confirmado' }); fireEvent.click(screen.getByText('2025')); expect(scroll).not.toHaveBeenCalled(); scroll.mockRestore(); });
});
