import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CatalogosComerciales from './CatalogosComerciales';

const solicitar = vi.hoisted(() => vi.fn());
const permisos = vi.hoisted(() => ({ valor: [] as string[] }));
vi.mock('../../api/finanzas', () => ({ solicitarFinanzas: solicitar }));
vi.mock('../../seguridad/Sesion', () => ({ usarSesion: () => ({sesion:{permisos:permisos.valor}}) }));
const respuesta = (datos:unknown) => Promise.resolve({ok:true,json:()=>Promise.resolve(datos)} as Response);

describe('Mantenedores comerciales C1',()=>{
  beforeEach(()=>{solicitar.mockReset();permisos.valor=[];});
  it('consulta precios por segmento y explica el control M4',async()=>{
    solicitar.mockImplementation(()=>respuesta([{id:'1',producto:'Puerta Atlas',familia:'Seguridad',segmento:'B2B',moneda:'CLP',monto:1500000,vigenciaDesde:'2026-10-01',vigenciaHasta:null,estado:'ACTIVO',version:1}]));
    render(<MemoryRouter initialEntries={['/mantenedores/comercial?seccion=precios']}><CatalogosComerciales/></MemoryRouter>);
    expect(await screen.findByText('Puerta Atlas')).toBeInTheDocument();
    expect(screen.getByText(/Cada escritura exige su CU específico/i)).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:/crear|guardar|desactivar/i})).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Segmento'),{target:{value:'B2C'}});
    await waitFor(()=>expect(solicitar).toHaveBeenLastCalledWith('/mantenedores/comercial/precios?segmento=B2C'));
  });

  it('navega a tarifas comerciales y mantiene clara su naturaleza',async()=>{
    solicitar.mockImplementation(()=>respuesta([{id:'2',region:'Valparaíso',ciudad:null,comuna:'Quilpué',cobertura:'DISPONIBLE',precio:125000,moneda:'CLP',vigenciaDesde:'2026-01-01',vigenciaHasta:null,estado:'ACTIVA',version:1}]));
    render(<MemoryRouter initialEntries={['/mantenedores/comercial?seccion=tarifas']}><CatalogosComerciales/></MemoryRouter>);
    expect(await screen.findByText('Valparaíso')).toBeInTheDocument();
    expect(screen.getByRole('heading',{name:'Tarifas de instalación'})).toBeInTheDocument();
    expect(screen.getByText('125.000')).toBeInTheDocument();
  });

  it('muestra un error real cuando la estructura comercial aún no está disponible',async()=>{
    solicitar.mockImplementation(()=>Promise.resolve({ok:false,json:()=>Promise.resolve({error:'Migración comercial pendiente'})} as Response));
    render(<MemoryRouter><CatalogosComerciales/></MemoryRouter>);
    expect(await screen.findByRole('alert')).toHaveTextContent('Migración comercial pendiente');
  });

  it('muestra Crear sólo con el CU de la sección y abre un modal centrado',async()=>{
    solicitar.mockImplementation(()=>respuesta([])); permisos.valor=['CU370'];
    const vista=render(<MemoryRouter initialEntries={['/mantenedores/comercial?seccion=precios']}><CatalogosComerciales/></MemoryRouter>);
    await screen.findByText('No hay registros para los filtros seleccionados.');
    expect(screen.queryByRole('button',{name:'Crear'})).not.toBeInTheDocument();
    permisos.valor=['CU368']; vista.rerender(<MemoryRouter initialEntries={['/mantenedores/comercial?seccion=precios']}><CatalogosComerciales/></MemoryRouter>);
    fireEvent.click(screen.getByRole('button',{name:'Crear'}));
    expect(screen.getByRole('dialog')).toHaveTextContent('Crear precios comerciales');
  });

  it('habilita versionado de precios únicamente con CU368',async()=>{
    permisos.valor=['CU368'];
    solicitar.mockImplementation((ruta:string)=>ruta.startsWith('/mantenedores/comercial/precios')?respuesta([{id:'1',productoId:4,producto:'Atlas',familia:'Seguridad',segmento:'B2B',monedaId:1,moneda:'CLP',monto:100,estado:'ACTIVO',version:1,vigenciaDesde:'2026-01-01'}]):respuesta([]));
    render(<MemoryRouter initialEntries={['/mantenedores/comercial?seccion=precios']}><CatalogosComerciales/></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button',{name:/Ver detalle Atlas/}));
    expect(screen.getByRole('button',{name:'Nueva versión'})).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Nueva versión'}));
    expect(screen.getByRole('dialog')).toHaveTextContent('Crear nueva versión');
    expect(screen.getByLabelText('Producto')).toHaveValue('4');
    expect(screen.getByRole('option',{name:'Histórico · Atlas'})).toBeInTheDocument();
    expect(screen.getByLabelText('Moneda')).toHaveValue('1');
  });

  it('gestiona servicios comerciales y su historial de precios con CU368',async()=>{
    permisos.valor=['CU368'];
    solicitar.mockImplementation(()=>respuesta([{id:'51',codigo:'FLETE',nombre:'Flete autorizado',unidad:'GLOBAL',segmento:'B2B',estado:'ACTIVO',version:1,precios:[{id:'511',segmento:'B2B',moneda:'CLP',monto:50000,estado:'ACTIVO',version:1}]}]));
    render(<MemoryRouter initialEntries={['/mantenedores/comercial?seccion=servicios']}><CatalogosComerciales/></MemoryRouter>);
    expect(await screen.findByText('Flete autorizado')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:/Ver detalle Flete autorizado/}));
    expect(screen.getByRole('button',{name:'Nuevo precio'})).toBeInTheDocument();
    expect(screen.getAllByText(/50000/).length).toBeGreaterThan(0);
  });

  it('separa edición CU371 de publicación CU372',async()=>{
    permisos.valor=['CU371'];
    solicitar.mockImplementation(()=>respuesta([{id:'8',codigo:'PAGO',nombre:'Pago',segmento:'B2B',estado:'ACTIVA',revision:1,versiones:[{id:'81',numero:1,estado:'BORRADOR',contenido:{texto:'Anticipo'},vigenciaDesde:'2026-01-01'}]}]));
    const vista=render(<MemoryRouter initialEntries={['/mantenedores/comercial?seccion=condiciones']}><CatalogosComerciales/></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button',{name:/Ver detalle Pago/}));
    expect(screen.getByRole('button',{name:'Nuevo borrador'})).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:'Revisar y publicar'})).not.toBeInTheDocument();
    permisos.valor=['CU371','CU372'];
    vista.rerender(<MemoryRouter initialEntries={['/mantenedores/comercial?seccion=condiciones']}><CatalogosComerciales/></MemoryRouter>);
    expect(screen.getByRole('button',{name:'Revisar y publicar'})).toBeInTheDocument();
  });

  it('expone compatibilidad y precio sólo con CU369',async()=>{
    permisos.valor=['CU369'];
    solicitar.mockImplementation(()=>respuesta([{id:'3',codigo:'CERR',nombre:'Cerradura',estado:'ACTIVO',version:1,compatibilidades:[],precios:[]}]))
    render(<MemoryRouter initialEntries={['/mantenedores/comercial?seccion=opcionales']}><CatalogosComerciales/></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button',{name:/Ver detalle Cerradura/}));
    expect(screen.getByRole('button',{name:'Editar'})).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Compatibilidad'})).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Nuevo precio'})).toBeInTheDocument();
  });
});
