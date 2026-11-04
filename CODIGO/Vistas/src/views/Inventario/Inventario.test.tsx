import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InicioInventario from './InicioInventario';
import MaterialesInventario from './MaterialesInventario';
import { consultarInventario } from './apiInventario';

vi.mock('./apiInventario',()=>({consultarInventario:vi.fn()}));

describe('Inventario integrado',()=>{
  beforeEach(()=>vi.mocked(consultarInventario).mockReset());
  it('muestra el resumen real y la disponibilidad calculada',async()=>{
    vi.mocked(consultarInventario).mockResolvedValue({materiales:3,bodegas:2,movimientos:7,reservasActivas:1,alertasActivas:4,stockFisico:20,stockReservado:5,stockDisponible:15});
    render(<MemoryRouter><InicioInventario/></MemoryRouter>);
    expect(await screen.findByText('Panel de Inventario')).toBeInTheDocument();
    expect(screen.getByText('Stock disponible').parentElement).toHaveTextContent('15');
    expect(screen.getByText(/funciones de creación y modificación permanecen deshabilitadas/i)).toBeInTheDocument();
  });
  it('consulta materiales y abre el detalle sin ofrecer escrituras',async()=>{
    vi.mocked(consultarInventario).mockImplementation(async ruta=>ruta==='/materiales/MAT-01'?{
      sku:'MAT-01',nombre:'Acero',descripcion:'Plancha',estado:'activo',critico:false,unidad:'unidad',categoria:'Metales',categoriaFuncional:null,stockFisico:10,stockReservado:2,stockDisponible:8,stockCritico:1,stockMinimo:2,stockMaximo:20,presentacion:null,codigosBarras:[],existencias:[{bodegaId:'1',bodega:'Central',loteId:'2',lote:'L-01',fisico:10,reservado:2,disponible:8}],
    }:{total:1,items:[{sku:'MAT-01',nombre:'Acero',descripcion:'Plancha',estado:'activo',critico:false,unidad:'unidad',categoria:'Metales',stockFisico:10,stockReservado:2,stockDisponible:8}]});
    const usuario=userEvent.setup();render(<MemoryRouter><MaterialesInventario/></MemoryRouter>);
    await usuario.click(await screen.findByRole('button',{name:'Acero'}));
    expect(await screen.findByRole('dialog',{name:'Detalle de material'})).toHaveTextContent('Central');
    expect(screen.queryByRole('button',{name:/crear|editar|eliminar/i})).not.toBeInTheDocument();
  });
});
