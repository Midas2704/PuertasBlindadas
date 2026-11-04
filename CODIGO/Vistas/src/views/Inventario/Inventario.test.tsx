import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InicioInventario from './InicioInventario';
import MaterialesInventario from './MaterialesInventario';
import ListadosInventario from './ListadosInventario';
import { consultarInventario } from './apiInventario';

vi.mock('./apiInventario',()=>({consultarInventario:vi.fn()}));

describe('Inventario integrado',()=>{
  beforeEach(()=>vi.mocked(consultarInventario).mockReset());
  it('muestra existencias separadas por unidad sin total global engañoso',async()=>{
    vi.mocked(consultarInventario).mockResolvedValue({materiales:3,bodegas:2,movimientos:7,reservasActivas:1,alertasActivas:4,existenciasPorUnidad:[
      {unidadId:'1',unidad:'unidad',materialSinUnidad:null,materiales:2,stockFisico:'20.0001',stockReservado:'5',stockDisponible:'15.0001'},
      {unidadId:'2',unidad:'metro',materialSinUnidad:null,materiales:1,stockFisico:'3.5',stockReservado:'0.5',stockDisponible:'3'},
    ]});
    render(<MemoryRouter><InicioInventario/></MemoryRouter>);
    expect(await screen.findByText('Panel de Inventario')).toBeInTheDocument();
    expect(screen.getByText('Existencias por unidad de medida')).toBeInTheDocument();
    expect(screen.getByText('metro').parentElement).toHaveTextContent('3,5');
    expect(screen.queryByText('Stock disponible')).not.toBeInTheDocument();
    expect(screen.getByText(/funciones de creación y modificación permanecen deshabilitadas/i)).toBeInTheDocument();
  });
  it('muestra estado vacío del panel y error de consulta',async()=>{
    vi.mocked(consultarInventario).mockResolvedValueOnce({materiales:0,bodegas:0,movimientos:0,reservasActivas:0,alertasActivas:0,existenciasPorUnidad:[]});
    const primera=render(<MemoryRouter><InicioInventario/></MemoryRouter>);
    expect(await screen.findByText('No hay existencias registradas.')).toBeInTheDocument();
    primera.unmount();
    vi.mocked(consultarInventario).mockRejectedValueOnce(new Error('BD no disponible'));
    render(<MemoryRouter><InicioInventario/></MemoryRouter>);
    expect(await screen.findByRole('alert')).toHaveTextContent('BD no disponible');
  });
  it('consulta materiales y abre el detalle sin ofrecer escrituras',async()=>{
    vi.mocked(consultarInventario).mockImplementation(async ruta=>ruta==='/materiales/MAT-01'?{
      sku:'MAT-01',nombre:'Acero',descripcion:'Plancha',estado:'activo',critico:false,unidad:'unidad',categoria:'Metales',categoriaFuncional:null,stockFisico:'10.0004',stockReservado:'2',stockDisponible:'8.0004',stockCritico:'1',stockMinimo:'2',stockMaximo:'20',presentacion:null,codigosBarras:[],existencias:[{bodegaId:'1',bodega:'Central',loteId:'2',lote:'L-01',fisico:'10.0004',reservado:'2',disponible:'8.0004'}],
    }:{total:1,items:[{sku:'MAT-01',nombre:'Acero',descripcion:'Plancha',estado:'activo',critico:false,unidad:'unidad',categoria:'Metales',stockFisico:'10.0004',stockReservado:'2',stockDisponible:'8.0004'}]});
    const usuario=userEvent.setup();render(<MemoryRouter><MaterialesInventario/></MemoryRouter>);
    await usuario.click(await screen.findByRole('button',{name:'Acero'}));
    expect(await screen.findByRole('dialog',{name:'Detalle de material'})).toHaveTextContent('Central');
    expect(screen.queryByRole('button',{name:/crear|editar|eliminar/i})).not.toBeInTheDocument();
  });
  it('bodegas presenta cada unidad por separado',async()=>{
    vi.mocked(consultarInventario).mockResolvedValue([{id:'1',nombre:'Central',direccion:null,estado:'activa',anaqueles:2,materiales:2,existenciasPorUnidad:[
      {unidad:'unidad',materialSinUnidad:null,stockFisico:'4',stockReservado:'1',stockDisponible:'3'},
      {unidad:'metro',materialSinUnidad:null,stockFisico:'7.25',stockReservado:'2',stockDisponible:'5.25'},
    ]}]);
    render(<MemoryRouter><ListadosInventario tipo="bodegas"/></MemoryRouter>);
    expect(await screen.findByText('Central')).toBeInTheDocument();
    expect(screen.getByText(/metro:/).parentElement).toHaveTextContent('7,25 / 2 / 5,25');
  });
  it('listados muestran vacío y errores explícitos',async()=>{
    vi.mocked(consultarInventario).mockResolvedValueOnce({items:[]});
    const primera=render(<MemoryRouter><ListadosInventario tipo="movimientos"/></MemoryRouter>);
    expect(await screen.findByText('No hay registros para mostrar.')).toBeInTheDocument();
    primera.unmount();
    vi.mocked(consultarInventario).mockRejectedValueOnce(new Error('Consulta rechazada'));
    render(<MemoryRouter><ListadosInventario tipo="reservas"/></MemoryRouter>);
    expect(await screen.findByRole('alert')).toHaveTextContent('Consulta rechazada');
  });
});
