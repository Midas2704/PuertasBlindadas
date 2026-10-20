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

  it('recupera una versión histórica en sólo lectura y permite elegir ambas versiones para comparar', async () => {
    const meses=(monto:number)=>Array.from({length:12},(_,indice)=>({mes:indice+1,resultados:{VENTAS_NETAS:monto,COSTOS_DIRECTOS:0,GASTOS_OPERACIONALES:0},flujoCaja:{INGRESOS_OPERACIONALES:0,OTROS_INGRESOS:0,PROVEEDORES:0,REMUNERACIONES:0,IMPUESTOS:0,OTROS_EGRESOS:0}}));
    vi.stubGlobal('fetch',vi.fn(async()=>new Response(JSON.stringify({estado:'VALIDO',presupuestos:[{id:'1',anio:2026,ambito:'GENERAL',moneda:'CLP',revision:2,versiones:[{numero:1,tipo:'ORIGINAL',creadoEn:'2026-01-01',meses:meses(100)},{numero:2,tipo:'REVISION',creadoEn:'2026-02-01',meses:meses(200)}]}]}),{status:200,headers:{'Content-Type':'application/json'}})));
    render(<MemoryRouter><PresupuestoManualM10/></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button',{name:/ORIGINAL 1/}));
    expect(screen.getByText(/sólo lectura/)).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Volver a revisión vigente'})).toBeInTheDocument();
    expect(screen.getByLabelText('Enero VENTAS_NETAS')).toBeDisabled();
    expect(screen.getAllByRole('combobox')).toHaveLength(2);
  });
});
