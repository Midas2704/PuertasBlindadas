import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PagosCliente from './PagosCliente';

vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));
import { solicitarFinanzas } from '../../api/finanzas';

const json=(datos:unknown,status=200)=>Promise.resolve(new Response(JSON.stringify(datos),{status,headers:{'Content-Type':'application/json'}}));
const contexto={
  notas:[
    {id_nota_venta:1,saldoPendiente:1000,pagosEfectivos:0,estadoPago:'pendiente',estado_pago:'pendiente',estadoNotaVentaVisible:'emitida',moneda:{codigo_moneda:'CLP'}},
    {id_nota_venta:2,saldoPendiente:700,pagosEfectivos:300,estadoPago:'parcial',estado_pago:'parcial',estadoNotaVentaVisible:'parcialmente_pagada',moneda:{codigo_moneda:'CLP'}},
  ],
  medios:[{id_medio_pago:1,nombre_medio_pago:'Efectivo'}],
  categorias:[{id_categoria_pago:11,nombre:'Anticipo'},{id_categoria_pago:12,nombre:'Abono parcial'},{id_categoria_pago:13,nombre:'Pago final'}],
  cuotas:[],documentos:[],
};

describe('CU44 en formulario de pagos',()=>{
  beforeEach(()=>{
    vi.mocked(solicitarFinanzas).mockReset();
    vi.mocked(solicitarFinanzas).mockImplementation(ruta=>ruta==='/clientes?estado=activos'?json([{id_ficha_cliente:5,razonSocial:'Cliente prueba',rut:'1-9'}]):ruta==='/pagos/contexto/5'?json(contexto):json({error:'Ruta inesperada'},404));
  });

  it('sugiere, permite edición manual y reinicia la decisión al cambiar de NV',async()=>{
    const user=userEvent.setup();render(<PagosCliente/>);
    await user.click(await screen.findByRole('button',{name:/Cliente prueba/}));
    await user.click(await screen.findByRole('button',{name:/NV-1/}));
    const monto=screen.getByRole('spinbutton',{name:'Monto'});const categoria=screen.getByRole('combobox',{name:'Categoría'});
    await user.type(monto,'1000');await waitFor(()=>expect(categoria).toHaveValue('13'));
    await user.clear(monto);await user.type(monto,'300');await waitFor(()=>expect(categoria).toHaveValue('11'));
    await user.selectOptions(categoria,'12');expect(screen.getByText(/seleccionada manualmente/i)).toBeInTheDocument();
    await user.clear(monto);await user.type(monto,'1000');expect(categoria).toHaveValue('12');
    await user.clear(monto);await user.type(monto,'200');await user.click(screen.getByRole('button',{name:/NV-2/}));
    await waitFor(()=>expect(categoria).toHaveValue('12'));expect(screen.getByText(/sugerida automáticamente/i)).toBeInTheDocument();
    await user.clear(monto);await user.type(monto,'700');await waitFor(()=>expect(categoria).toHaveValue('13'));
  });
});
