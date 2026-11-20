import {describe,expect,it,vi} from 'vitest';
import {render,screen,fireEvent,waitFor} from '@testing-library/react';
import OperacionesFinancieras from './OperacionesFinancieras';
import {operar} from '../seguridad/Sesion';

vi.mock('../seguridad/Sesion',()=>({
  usarSesion:()=>({sesion:{permisos:['CU25']}}),
  operar:vi.fn(async (ruta:string)=>{
    if(ruta.startsWith('/pagos/catalogos'))return {medios:[],categorias:[],cuotas:[],documentos:[]};
    throw new Error('Solicitud detenida por prueba');
  }),
}));
vi.mock('../views/Seguridad/Acceso',()=>({entradaClase:'campo',botonClase:'boton'}));
vi.mock('./DialogosSistema',()=>({confirmarAccion:vi.fn(async()=>true)}));

const quote=(segmento:string|null,tipoCliente:string|null,estado='emitida')=>({
  id_cotizacion:83,id_ficha_cliente:22,segmento_comercial:segmento,estado_cotizacion:estado,
  moneda:{codigo_moneda:'CLP'},
  ficha_cliente:{cliente_financiero:{tipo_cliente_financiero:{nombre_tipo_cliente_financiero:tipoCliente}}},
});

describe('EF15: selección de flujo por tipo acreditado',()=>{
  it('muestra consolidación sólo para B2C emitida y clasificada B2C',()=>{
    render(<OperacionesFinancieras tipo="cotizacion" documento={quote('B2C','B2C')}/>);
    expect(screen.getByRole('button',{name:'Consolidar B2C con primer pago'})).toBeInTheDocument();
  });
  it('no ofrece consolidación B2C a un cliente B2B',()=>{
    render(<OperacionesFinancieras tipo="cotizacion" documento={quote('B2B','B2B')}/>);
    expect(screen.queryByRole('button',{name:'Consolidar B2C con primer pago'})).not.toBeInTheDocument();
  });
  it('no ofrece un flujo cuando el segmento y la categoría se contradicen',()=>{
    render(<OperacionesFinancieras tipo="cotizacion" documento={quote('B2C','B2B')}/>);
    expect(screen.queryByRole('button',{name:'Consolidar B2C con primer pago'})).not.toBeInTheDocument();
  });
  it('no presume segmento para cotizaciones antiguas sin clasificación',()=>{
    render(<OperacionesFinancieras tipo="cotizacion" documento={quote(null,'B2C')}/>);
    expect(screen.queryByRole('button',{name:'Consolidar B2C con primer pago'})).not.toBeInTheDocument();
  });
  it('no consolida una cotización aún en borrador',()=>{
    render(<OperacionesFinancieras tipo="cotizacion" documento={quote('B2C','B2C','borrador')}/>);
    expect(screen.queryByRole('button',{name:'Consolidar B2C con primer pago'})).not.toBeInTheDocument();
  });
  it('envía la consolidación B2C directamente, sin modal de planificación OT',async()=>{
    const envio=vi.mocked(operar);envio.mockClear();
    const {container}=render(<OperacionesFinancieras tipo="cotizacion" documento={quote('B2C','B2C')}/>);
    fireEvent.click(screen.getByRole('button',{name:'Consolidar B2C con primer pago'}));
    await waitFor(()=>expect(envio).toHaveBeenCalledWith('/pagos/catalogos?idFicha=22'));
    const form=container.querySelector('form');expect(form).toBeTruthy();
    fireEvent.submit(form!);
    await waitFor(()=>expect(envio).toHaveBeenCalledWith('/cotizaciones/83/consolidar-b2c',expect.objectContaining({idNota:undefined})));
    expect(screen.getByText('Solicitud detenida por prueba')).toBeInTheDocument();
  });
});
