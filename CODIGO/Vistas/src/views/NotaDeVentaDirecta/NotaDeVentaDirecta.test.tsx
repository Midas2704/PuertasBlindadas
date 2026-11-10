import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { calcularTotalReferencialDetalle } from '../../utilidades/notaVentaDirecta';
import NotaDeVentaDirecta from './NotaDeVentaDirecta';

vi.mock('../../api/finanzas',()=>({
  solicitarFinanzas:vi.fn(()=>Promise.resolve(new Response(JSON.stringify([]),{status:200,headers:{'Content-Type':'application/json'}}))),
}));

describe('Nota de Venta directa',()=>{
  it('calcula el monto neto desde todas las líneas',()=>{
    expect(calcularTotalReferencialDetalle([
      {tipo:'producto',descripcion:'Puerta',cantidad:2,valor:100},
      {tipo:'servicio',descripcion:'Instalación',cantidad:1,valor:150},
    ])).toBe(350);
  });

  it('actualiza automáticamente el monto cuando cambia el valor unitario',async()=>{
    const user=userEvent.setup();
    render(<NotaDeVentaDirecta/>);
    const valor=screen.getByPlaceholderText('Valor unitario');
    const monto=screen.getByLabelText('Monto Base Neto');
    await user.type(valor,'350');
    expect(monto).toHaveTextContent('$350');
    await user.clear(valor);
    await user.type(valor,'360');
    expect(monto).toHaveTextContent('$360');
  });

  it('suma productos y servicios sin pedir un monto total adicional',async()=>{
    const user=userEvent.setup();
    render(<NotaDeVentaDirecta/>);
    await user.type(screen.getByPlaceholderText('Descripción'),'Puerta');
    await user.type(screen.getByPlaceholderText('Valor unitario'),'100');
    await user.click(screen.getByRole('button',{name:'+ Agregar línea'}));
    const descripciones=screen.getAllByPlaceholderText('Descripción');
    const valores=screen.getAllByPlaceholderText('Valor unitario');
    await user.type(descripciones[1],'Instalación');
    await user.type(valores[1],'150');
    expect(screen.getByLabelText('Monto Base Neto')).toHaveTextContent('$250');
    expect(screen.queryByRole('spinbutton',{name:'Monto Base Neto'})).not.toBeInTheDocument();
  });
});
