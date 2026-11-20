import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ModalPlanificacionOrdenes from './ModalPlanificacionOrdenes';
vi.mock('../api/finanzas', () => ({ solicitarFinanzas: vi.fn() }));
vi.mock('./DialogosSistema', () => ({ confirmarAccion: vi.fn(() => Promise.resolve(true)) }));
import { solicitarFinanzas } from '../api/finanzas';
const res=(x:unknown,status=200)=>Promise.resolve(new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json'}}));
describe('EF18 B2B sin OC; oferta y OT siguen siendo verificables',()=>{
 beforeEach(()=>vi.mocked(solicitarFinanzas).mockReset());
 it('no pide folio, PDF ni líneas OC; envía versión de oferta y planificación',async()=>{
  vi.mocked(solicitarFinanzas).mockImplementation((ruta,opciones)=>{
   if(String(ruta).endsWith('/work-order-planning'))return res({cotizacion:{id:44,cliente:'Empresa sintética',fechaVigencia:'2026-12-31',idMoneda:1,moneda:'CLP'},
    ofertas:[{id:301,numero:1,fecha:'2026-10-01',motivo:'Emitida',estadoDocumental:'DISPONIBLE'}],
    totalOt:0,planificaciones:[],empleadosPorArea:{},areas:[]});
   if(String(ruta).endsWith('/accept-b2b')){
    const cuerpo=JSON.parse(String(opciones?.body));
    expect(cuerpo.idVersionOfertaAceptada).toBe(301);
    expect(cuerpo.planificaciones).toEqual([]);
    expect(cuerpo).not.toHaveProperty('folioOrdenCompra');
    expect(cuerpo).not.toHaveProperty('respaldoOrdenCompra');
    expect(cuerpo).not.toHaveProperty('lineasOrdenCompra');
    return res({mensaje:'aprobada'});
   }
   return res({error:'ruta inesperada'},404);
  });
  const user=userEvent.setup(),completado=vi.fn();
  render(<ModalPlanificacionOrdenes cotizacionId={44} modo="B2B" cerrar={vi.fn()} completado={completado}/>);
  await user.selectOptions(await screen.findByLabelText('Oferta aceptada'),'301');
  expect(screen.queryByText('Folio OC')).not.toBeInTheDocument();
  expect(screen.queryByText('Respaldo OC')).not.toBeInTheDocument();
  expect(screen.queryByText('Líneas individuales de la OC')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button',{name:/Confirmar aprobación/i}));
  await waitFor(()=>expect(completado).toHaveBeenCalledTimes(1));
 });
});
