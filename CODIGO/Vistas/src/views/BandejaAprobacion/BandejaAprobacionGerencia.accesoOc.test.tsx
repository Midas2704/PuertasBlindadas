import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import BandejaAprobacionGerencia from './BandejaAprobacionGerencia';
vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));
vi.mock('../../seguridad/Sesion',()=>({usarSesion:()=>({sesion:{permisos:['CU24']}})}));
vi.mock('../../components/ModalPlanificacionOrdenes',()=>({default:({cotizacionId,modo,completado}: {
  cotizacionId:number;modo:string;completado:(resultado:unknown)=>void
})=><div data-testid="oc-formulario">{cotizacionId}:{modo}<button onClick={()=>completado({mensaje:'aprobado'})}>Completar simulación</button></div>}));
vi.mock('../../components/ModalDetalleDocumento',()=>({default:({activeModal,onRegistrarOcB2B,recargaCadenaM11}:{
  activeModal:{tipo:string;data:{id_cotizacion:number;estado_cotizacion:string}}|null;
  onRegistrarOcB2B?:(id:number)=>void;recargaCadenaM11?:number;
})=>activeModal ? <div data-testid="detalle-oc">
  {activeModal.data.estado_cotizacion}:{recargaCadenaM11}
  <button onClick={()=>onRegistrarOcB2B?.(activeModal.data.id_cotizacion)}>Registrar OC desde detalle</button>
</div>:null}));
vi.mock('../../components/documental/DocumentosHistoricosCotizacion',()=>({default:()=>null}));
vi.mock('../../components/DialogosSistema',()=>({confirmarAccion:vi.fn(),notificarUsuario:vi.fn(),solicitarTexto:vi.fn()}));
import { solicitarFinanzas } from '../../api/finanzas';
const cot = {id_cotizacion:81,segmento_comercial:'B2B',estado_cotizacion:'emitida',fecha_emision:'2026-11-09T00:00:00Z',
  monto_total_estimado:1000,ficha_cliente:{cliente_financiero:{rut_cliente:'11111111-1',nombre_razon_social_referencia:'Demo',
  tipo_cliente_financiero:{nombre_tipo_cliente_financiero:'B2B'}}}};
beforeEach(()=>{vi.mocked(solicitarFinanzas).mockReset();vi.mocked(solicitarFinanzas).mockImplementation(ruta=>Promise.resolve(new Response(
  JSON.stringify(String(ruta).includes('pending-approvals')?{cotizaciones:[cot],notas_venta:[]}:{cotizaciones:[],notas_venta:[]}),
  {status:200,headers:{'Content-Type':'application/json'}})));});
it('desde detalle B2B abre el mismo formulario; al completar conserva el detalle y refresca M11',async()=>{
  render(<BandejaAprobacionGerencia/>);
  await userEvent.click(await screen.findByText('COT-81'));
  await userEvent.click(screen.getByRole('button',{name:'Registrar OC desde detalle'}));
  expect(await screen.findByTestId('oc-formulario')).toHaveTextContent('81:B2B');
  await userEvent.click(screen.getByRole('button',{name:'Completar simulación'}));
  await waitFor(()=>expect(screen.getByTestId('detalle-oc')).toHaveTextContent('aprobada:1'));
  expect(screen.queryByTestId('oc-formulario')).not.toBeInTheDocument();
});
