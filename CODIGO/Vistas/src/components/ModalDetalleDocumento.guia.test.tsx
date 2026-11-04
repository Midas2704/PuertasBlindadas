import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import ModalDetalleDocumento from './ModalDetalleDocumento';

vi.mock('../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));
vi.mock('./DialogosSistema',()=>({notificarUsuario:vi.fn()}));
vi.mock('./OperacionesFinancieras',()=>({default:()=>null}));
vi.mock('./TrazabilidadDocumentalM11',()=>({default:()=>null}));
import { solicitarFinanzas } from '../api/finanzas';

beforeEach(()=>vi.mocked(solicitarFinanzas).mockReset());

test('CU35 edita una guía emitida sin convertirla en corrección formal y bloquea estados finales',async()=>{
  vi.mocked(solicitarFinanzas).mockResolvedValue(new Response(JSON.stringify({id_guia_despacho:1,id_nota_venta:9,folio:'G-EDIT',estado:'emitida',antecedentes:{referencia:'actualizada'}}),{status:200,headers:{'Content-Type':'application/json'}}));
  const user=userEvent.setup();
  render(<ModalDetalleDocumento activeModal={{tipo:'nota_venta',data:{id_nota_venta:9,fecha_emision:'2026-11-01',estado_nota_venta:'confirmada',estadoPago:'pendiente',estado_pago:'pendiente',moneda:{codigo_moneda:'CLP'},guia_despacho:[{id_guia_despacho:1,folio:'G-1',estado:'emitida',antecedentes:{}},{id_guia_despacho:2,folio:'G-2',estado:'cerrada',antecedentes:{}}]}}} onClose={()=>{}}/>);
  expect(screen.getAllByRole('button',{name:'Editar guía'})).toHaveLength(1);
  await user.click(screen.getByRole('button',{name:'Editar guía'}));
  await user.clear(screen.getByLabelText('Folio de Guía de Despacho'));await user.type(screen.getByLabelText('Folio de Guía de Despacho'),'G-EDIT');
  fireEvent.change(screen.getByLabelText('Antecedentes de Guía de Despacho'),{target:{value:'{"referencia":"actualizada"}'}});
  await user.click(screen.getByRole('button',{name:'Guardar guía'}));
  await waitFor(()=>expect(solicitarFinanzas).toHaveBeenCalledWith('/billing/guides/1',expect.objectContaining({method:'PUT'})));
  const cuerpo=JSON.parse(String(vi.mocked(solicitarFinanzas).mock.calls[0][1]?.body));
  expect(cuerpo).toEqual({folio:'G-EDIT',antecedentes:{referencia:'actualizada'}});expect(cuerpo).not.toHaveProperty('id_nota_venta');
  expect(await screen.findByText('Guía G-EDIT')).toBeInTheDocument();expect(screen.getByText('Estado cerrada')).toBeInTheDocument();
});
