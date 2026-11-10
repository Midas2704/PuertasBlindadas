import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import VerFicha from './VerFicha';
import { solicitarFinanzas } from '../../api/finanzas';

vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));
vi.mock('../../seguridad/Sesion',()=>({usarSesion:()=>({sesion:{permisos:['CU51','CU52','CU57','CU58']}})}));
vi.mock('../../components/documental/VisorPdf',()=>({default:()=> <div data-testid="visor-comprobante">PDF visible</div>}));

const json=(dato:unknown,estado=200)=>Promise.resolve(new Response(JSON.stringify(dato),{status:estado,headers:{'Content-Type':'application/json'}}));
const ficha={
  resumen:{id_ficha_cliente:1,id_cliente_financiero:1,rut_cliente:'11.111.111-1',nombre_razon_social_referencia:'Cliente prueba',telefono_financiero:'',correo_financiero:'',nombre_tipo_cliente_financiero:'B2B',estado_ficha:'activa',fecha_creacion:'2026-01-01',saldoDeudor:100,limite_credito_vigente:0,incompleto:false,situacionFinanciera:'Al día'},
  resumen_dashboard:{total_ventas:100,total_deuda:50,saldo_pendiente:50,obligaciones_morosas:0,saldosPorMoneda:[],proyectos:[],pagos:[{id_pago_cliente:7,fecha_pago:'2026-11-01',monto_pago:100,montoEfectivo:70,estado_verificacion:'verificado',anulacion_pago:null,reversion_pago:[],moneda:{codigo_moneda:'CLP'}}],total_pagado:50,proyectos_activos:0,proyectos_terminados:0,cotizaciones:[],notas_venta:[],saldosFavor:[]},
  historial:[],
};

describe('operaciones de pagos desde la ficha',()=>{
  beforeEach(()=>{
    window.history.pushState({},'', '/clientes/id-1');
    vi.mocked(solicitarFinanzas).mockImplementation((ruta)=>ruta.includes('/comprobante')
      ?json({nombre:'comprobante.pdf',contenido:'data:application/pdf;base64,JVBERi0xLjQKJSVFT0YK'})
      :json(ficha));
  });

  it('muestra solamente acciones respaldadas por permisos y abre formulario de anulación',async()=>{
    const user=userEvent.setup();render(<VerFicha/>);
    await screen.findByText('Cliente prueba');
    expect(screen.getByRole('button',{name:'Anular'})).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Revertir'})).toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:'Anular'}));
    expect(screen.getByRole('dialog',{name:'Anular pago'})).toBeInTheDocument();
    expect(screen.getByLabelText('Respaldo PDF')).toHaveAttribute('accept','application/pdf,.pdf');
  });

  it('genera el comprobante y lo presenta en el visor PDF',async()=>{
    const user=userEvent.setup();render(<VerFicha/>);
    await screen.findByText('Cliente prueba');
    await user.click(screen.getByRole('button',{name:'PDF'}));
    await waitFor(()=>expect(screen.getByTestId('visor-comprobante')).toBeInTheDocument());
    expect(screen.getByRole('link',{name:'Descargar PDF'})).toHaveAttribute('download','comprobante.pdf');
  });
});
