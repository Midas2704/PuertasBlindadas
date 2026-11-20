import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TrazabilidadDocumentalM11 from './TrazabilidadDocumentalM11';
vi.mock('../api/finanzas', () => ({ solicitarFinanzas: vi.fn() }));
vi.mock('./RespaldoPdfOperacional', () => ({ RespaldoPdfOperacional: () => null }));
import { solicitarFinanzas } from '../api/finanzas';
const respuesta = (dato: unknown, status: number) => Promise.resolve(new Response(JSON.stringify(dato), {status, headers:{'Content-Type':'application/json'}}));
const cadena = { estado:'PARCIAL', etapaA:{estado:'PARCIAL'}, etapaB:{estado:'DATOS_INSUFICIENTES'},
  cadena:{ordenCompra:{folio:'QA-I4-OCB-001'}, notaVenta:{numero:'B2B-Q04'}, guias:[], documentosTributarios:[], advertenciaFisica:'Sin evidencia física'},
  hallazgos:[] };
const ausente = {error:'La cotización no posee una Orden de Compra B2B registrada'};
beforeEach(()=>vi.mocked(solicitarFinanzas).mockReset());
describe('EF17 · acceso a OC desde cadena M11',()=>{
  it('si falta OC y está autorizado ofrece abrir el formulario existente', async()=>{
    vi.mocked(solicitarFinanzas).mockResolvedValue(respuesta(ausente,404) as never);
    const abrir=vi.fn();render(<TrazabilidadDocumentalM11 idCotizacion={81} puedeRegistrarOcB2B onRegistrarOcB2B={abrir}/>);
    await userEvent.click(await screen.findByRole('button',{name:'Registrar OC B2B y aceptar cotización'}));
    expect(abrir).toHaveBeenCalledTimes(1);
    expect(solicitarFinanzas).toHaveBeenCalledWith('/billing/quotes/81/document-reconciliation');
  });
  it('el mismo 404 sin permiso no expone la acción',async()=>{
    vi.mocked(solicitarFinanzas).mockResolvedValue(respuesta(ausente,404) as never);
    render(<TrazabilidadDocumentalM11 idCotizacion={82} onRegistrarOcB2B={()=>{}}/>);
    await screen.findByRole('alert');
    expect(screen.queryByRole('button',{name:'Registrar OC B2B y aceptar cotización'})).not.toBeInTheDocument();
  });
  it('un 403/404 distinto no se interpreta como OC ausente',async()=>{
    vi.mocked(solicitarFinanzas).mockResolvedValue(respuesta({error:'Acceso no autorizado'},403) as never);
    render(<TrazabilidadDocumentalM11 idCotizacion={83} puedeRegistrarOcB2B onRegistrarOcB2B={()=>{}}/>);
    await screen.findByRole('alert');
    expect(screen.queryByRole('button',{name:'Registrar OC B2B y aceptar cotización'})).not.toBeInTheDocument();
  });
  it('al registrar OC y cambiar recarga se consulta nuevamente la cadena',async()=>{
    vi.mocked(solicitarFinanzas).mockImplementationOnce(()=>respuesta(ausente,404) as never)
      .mockImplementationOnce(()=>respuesta(cadena,200) as never);
    const abrir=vi.fn();const {rerender}=render(<TrazabilidadDocumentalM11 idCotizacion={84} puedeRegistrarOcB2B onRegistrarOcB2B={abrir} recarga={0}/>);
    await screen.findByRole('button',{name:'Registrar OC B2B y aceptar cotización'});
    rerender(<TrazabilidadDocumentalM11 idCotizacion={84} puedeRegistrarOcB2B onRegistrarOcB2B={abrir} recarga={1}/>);
    await waitFor(()=>expect(screen.getByText(/QA-I4-OCB-001/)).toBeInTheDocument());
    expect(screen.queryByRole('button',{name:'Registrar OC B2B y aceptar cotización'})).not.toBeInTheDocument();
    expect(solicitarFinanzas).toHaveBeenCalledTimes(2);
  });
});
