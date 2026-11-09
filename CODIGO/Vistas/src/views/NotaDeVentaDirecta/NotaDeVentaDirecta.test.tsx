import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { calcularTotalReferencialDetalle } from '../../utilidades/notaVentaDirecta';
import NotaDeVentaDirecta from './NotaDeVentaDirecta';

vi.mock('../../api/finanzas',()=>({
  solicitarFinanzas:vi.fn(()=>Promise.resolve(new Response(JSON.stringify([]),{status:200,headers:{'Content-Type':'application/json'}}))),
}));

describe('Nota de Venta directa',()=>{
  it('calcula el monto sugerido desde las líneas sin imponerlo como precio acordado',()=>{
    expect(calcularTotalReferencialDetalle([
      {tipo:'producto',descripcion:'Puerta',cantidad:2,valor:100},
      {tipo:'servicio',descripcion:'Instalación',cantidad:1,valor:150},
    ])).toBe(350);
  });

  it('sincroniza el monto desde el detalle hasta que la persona define otro monto',async()=>{
    const user=userEvent.setup();
    render(<NotaDeVentaDirecta/>);
    const valor=screen.getByPlaceholderText('Valor unitario');
    const monto=screen.getByRole('spinbutton',{name:'Monto Base Neto'});
    await user.type(valor,'350');
    expect(monto).toHaveValue(350);
    await user.clear(monto);
    await user.type(monto,'400');
    await user.clear(valor);
    await user.type(valor,'360');
    expect(monto).toHaveValue(400);
  });
});
