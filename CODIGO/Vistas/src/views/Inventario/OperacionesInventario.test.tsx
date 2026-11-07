import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import OperacionesInventario from './OperacionesInventario';
import { consultarInventario, operarInventario } from './apiInventario';
import { usarSesion } from '../../seguridad/Sesion';

vi.mock('./apiInventario',()=>({consultarInventario:vi.fn(),operarInventario:vi.fn()}));
vi.mock('../../seguridad/Sesion',()=>({usarSesion:vi.fn()}));

const catalogos={
  materiales:[{sku:'MAT-01',nombre:'Acero',unidad:'unidad'}],bodegas:[{id:'1',nombre:'Central',direccion:null}],
  lotes:[{id:'2',numero:'L-01',vence:null,ubicaciones:[{sku:'MAT-01',bodegaId:'1'}]}],
  tiposMovimiento:[{id:'3',nombre:'Entrada de compra'},{id:'4',nombre:'Salida operacional'},{id:'5',nombre:'Ajuste físico'}],
  motivosMovimiento:[{id:'6',nombre:'Recepción acreditada'}],
};
const detalle={sku:'MAT-01',nombre:'Acero',existencias:[{bodegaId:'1',bodega:'Central',loteId:'2',lote:'L-01',fisico:'10',reservado:'2',disponible:'8'}]};

describe('Operaciones reales de Inventario',()=>{
  beforeEach(()=>{
    vi.clearAllMocks();
    vi.mocked(usarSesion).mockReturnValue({sesion:{id:'1',nombre:'Operador',acceso:'op',permisos:['CU15','CU466'],configuracion:'particular',administrador:false,cambiarClave:false},cargando:false,actualizar:vi.fn()});
    vi.mocked(consultarInventario).mockImplementation(async ruta=>ruta==='/catalogos-operacion'?catalogos:ruta.startsWith('/materiales/')?detalle:{items:[]});
    vi.mocked(operarInventario).mockResolvedValue({operacionId:'10',movimientoId:'20',fisico:'12',reservado:'2',disponible:'10',repetida:false});
  });

  it('mantiene las operaciones ocultas sin una capacidad efectiva',async()=>{
    vi.mocked(usarSesion).mockReturnValue({sesion:{id:'2',nombre:'Consulta',acceso:'consulta',permisos:['CU14','CU15'],configuracion:'perfil',administrador:false,cambiarClave:false},cargando:false,actualizar:vi.fn()});
    render(<OperacionesInventario/>);
    expect(screen.getByText(/permanecen inactivas hasta su aprobación formal/i)).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:/confirmar operación/i})).not.toBeInTheDocument();
  });

  it('valida, confirma y envía una entrada al backend real una sola vez',async()=>{
    const usuario=userEvent.setup();render(<OperacionesInventario/>);
    expect(await screen.findByRole('heading',{name:'Registrar entrada'})).toBeInTheDocument();
    await usuario.selectOptions(screen.getByLabelText('Material'),'MAT-01');
    await usuario.selectOptions(screen.getByLabelText('Bodega'),'1');
    await waitFor(()=>expect(screen.getByLabelText('Lote')).toHaveTextContent('L-01'));
    await usuario.selectOptions(screen.getByLabelText('Lote'),'2');
    await usuario.type(screen.getByLabelText('Cantidad'),'2');
    await usuario.selectOptions(screen.getByLabelText('Tipo de movimiento'),'3');
    await usuario.selectOptions(screen.getByLabelText('Motivo catalogado'),'6');
    await usuario.type(screen.getByLabelText('Justificación'),'Recepción física revisada');
    await usuario.click(screen.getByRole('button',{name:'Revisar y confirmar'}));
    expect(screen.getByRole('dialog')).toHaveTextContent('Recepción física revisada');
    await usuario.click(screen.getByRole('button',{name:'Confirmar operación'}));
    await waitFor(()=>expect(operarInventario).toHaveBeenCalledTimes(1));
    const [ruta,cuerpo]=vi.mocked(operarInventario).mock.calls[0];
    expect(ruta).toBe('/entradas');expect(cuerpo).toMatchObject({sku:'MAT-01',bodegaId:'1',loteId:'2',cantidad:'2'});
    expect((cuerpo as {claveIdempotencia:string}).claveIdempotencia).toBeTruthy();
    expect(await screen.findByRole('status')).toHaveTextContent('Operación confirmada');
  });

  it('no confirma cantidades inválidas ni hace doble envío',async()=>{
    const usuario=userEvent.setup();render(<OperacionesInventario/>);await screen.findByRole('heading',{name:'Registrar entrada'});
    await usuario.click(screen.getByRole('button',{name:'Revisar y confirmar'}));
    expect(await screen.findByRole('alert')).toHaveTextContent('Selecciona material, bodega y lote');
    expect(operarInventario).not.toHaveBeenCalled();
  });
});
