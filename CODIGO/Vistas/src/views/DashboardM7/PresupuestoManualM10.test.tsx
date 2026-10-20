import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PresupuestoManualM10 from './PresupuestoManualM10';

describe('PresupuestoManualM10', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('presenta los doce meses y guarda un original separado de la proyección automática', async () => {
    const solicitudes: Array<{ ruta:string; opciones?:RequestInit }> = [];
    vi.stubGlobal('fetch', vi.fn(async (ruta:string, opciones?:RequestInit) => {
      solicitudes.push({ ruta:String(ruta), opciones });
      if (opciones?.method === 'POST') return new Response(JSON.stringify({ id:'1' }), { status:200, headers:{'Content-Type':'application/json'} });
      return new Response(JSON.stringify({ estado:'SIN_RESULTADOS', presupuestos:[] }), { status:200, headers:{'Content-Type':'application/json'} });
    }));
    render(<MemoryRouter><PresupuestoManualM10/></MemoryRouter>);
    expect(await screen.findByText('Plan anual · CLP')).toBeInTheDocument();
    expect(screen.getByText('Enero')).toBeInTheDocument(); expect(screen.getByText('Diciembre')).toBeInTheDocument();
    expect(screen.getByText(/Real, proyección automática y presupuesto manual/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name:'Guardar original' }));
    await waitFor(() => expect(solicitudes.some(item => item.opciones?.method === 'POST')).toBe(true));
    const guardado = solicitudes.find(item => item.opciones?.method === 'POST');
    const cuerpo = JSON.parse(String(guardado?.opciones?.body));
    expect(cuerpo.meses).toHaveLength(12); expect(cuerpo.moneda).toBe('CLP'); expect(cuerpo.ambito).toBe('GENERAL');
  });
});
