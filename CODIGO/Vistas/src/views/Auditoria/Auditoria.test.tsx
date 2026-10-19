import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Auditoria from './Auditoria';
import { solicitarFinanzas } from '../../api/finanzas';

vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));
vi.mock('../../seguridad/Sesion',()=>({usarSesion:()=>({sesion:{permisos:['CU355','CU359']}})}));

const evento=(id:number,integridad:'VERIFICADA'|'COMPROMETIDA')=>({
  id,identidadLogica:`evento-${id}`,ocurrencia:'2032-05-02T12:00:00.000Z',persistencia:'2032-05-02T12:00:01.000Z',zonaHoraria:'UTC',
  productor:'M4',modulo:'M4',operacion:id===2?'SINCRONIZAR_PERMISOS_MIDAS':'CUENTA_CREADA',resultado:'EXITOSO',
  ejecutor:{tipo:'HUMANO',referencia:'99'},referencia:{tipo:'USUARIO',id:'1'},cambios:null,motivo:null,causa:null,
  eventoPrivacidad:false,integridad,advertenciaIntegridad:integridad==='COMPROMETIDA'?'La evidencia histórica no supera la verificación criptográfica.':null,
});
const json=(valor:unknown)=>Promise.resolve(new Response(JSON.stringify(valor),{status:200,headers:{'Content-Type':'application/json'}}));

describe('Auditoría M9 con evidencia comprometida',()=>{
  beforeEach(()=>vi.mocked(solicitarFinanzas).mockReset());
  it('mantiene visibles los eventos válidos y marca el comprometido también en detalle',async()=>{
    const valido=evento(1,'VERIFICADA'),comprometido=evento(2,'COMPROMETIDA');
    vi.mocked(solicitarFinanzas).mockImplementation(ruta=>String(ruta).startsWith('/auditoria/2')?json({evento:comprometido,cadena:[comprometido],correctivos:[]}):json({total:2,pagina:1,tamano:25,eventos:[valido,comprometido]}));
    render(<Auditoria/>);
    expect(await screen.findByText('CUENTA CREADA')).toBeInTheDocument();
    const fila=screen.getByText('SINCRONIZAR PERMISOS MIDAS').closest('tr')!;
    expect(within(fila).getByText('Integridad comprometida')).toBeInTheDocument();
    fireEvent.click(within(fila).getByRole('button',{name:'Detalle'}));
    await waitFor(()=>expect(screen.getByRole('alert')).toHaveTextContent('INTEGRIDAD COMPROMETIDA'));
    expect(screen.getByRole('alert')).toHaveTextContent('no supera la verificación criptográfica');
  });
});
