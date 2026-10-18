import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { FichaProductoCatalogoComercial, ProductoCatalogoComercial } from '../../components/comercial/tipos';
import ArmarCotizacion from './ArmarCotizacion';

vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));
import { solicitarFinanzas } from '../../api/finanzas';

const producto:ProductoCatalogoComercial={
  idProductoComercial:71,idItemComercial:91,codigo:'PB-C2',nombre:'Puerta catálogo C2',
  familia:{id:8,codigo:'SEG',nombre:'Seguridad'},subfamilia:null,tipo:'Puerta',idProductoComercialVersion:81,numeroVersion:3,
  descripcion:'Descripción B2C publicada',caracteristicas:['Cierre multipunto'],caracteristicasTecnicas:{},
  garantia:'Garantía autorizada',condicionesParticulares:null,estado:'VINCULADO',segmento:'B2C',
  precio:{resultado:'VIGENTE',id:'precio-1',monto:850000,moneda:'CLP'},opcionales:[],
  documentos:{fotografias:0,fotografiaPrincipalDisponible:false,documentosComerciales:0},costosInternosExpuestos:false,
};
const ficha:FichaProductoCatalogoComercial={...producto,documental:{estadoIntegracion:'VACIO',documentos:[],fotografias:[],documentosTecnicos:[],fotografiaPrincipal:null,capacidades:{consultarMetadatos:true,consultarVersiones:false,solicitarVistaPrevia:false,descargar:false,cargar:false,reemplazar:false,definirPrincipal:false,ordenar:false,definirUsoComercial:false}}};
const json=(datos:unknown,status=200)=>Promise.resolve(new Response(JSON.stringify(datos),{status,headers:{'Content-Type':'application/json'}}));

describe('Armar Cotización conectado al catálogo comercial C2',()=>{
  beforeEach(()=>{
    vi.mocked(solicitarFinanzas).mockReset();
    vi.mocked(solicitarFinanzas).mockImplementation((ruta)=>{
      if(ruta==='/monedas')return json([{id_moneda:1,codigo_moneda:'CLP'}]);
      if(String(ruta).startsWith('/clients?')||ruta==='/billing/inventory')return json([]);
      if(String(ruta).startsWith('/mantenedores/comercial/condiciones?'))return json([]);
      if(String(ruta).startsWith('/mantenedores/comercial/servicios?'))return json([{id:'501',codigo:'FLT',nombre:'Flete autorizado',descripcion:'Traslado comercial',unidad:'GLOBAL',precio:{resultado:'VIGENTE',id:'precio-servicio-501',monto:50000,moneda:'CLP',version:1}}]);
      if(String(ruta).startsWith('/billing/quotes/obras/buscar?'))return json({obras:[{id:'801',nombre:'Melín 7019',referencia:'Edificio principal',direccion:'Melín 7019',region:'Metropolitana',ciudad:'Santiago',comuna:'Quinta Normal',edificio:null,unidad:null,estado:'activa',revision:1,coincidencia:'EXACTA'}],requiereSeleccionExplicita:false});
      if(String(ruta).startsWith('/catalogo-comercial/productos/71/ficha'))return json(ficha);
      if(String(ruta).startsWith('/catalogo-comercial/productos?'))return json([producto]);
      return json({error:'Ruta no contemplada por el fixture C2'},404);
    });
  });

  it('exige segmento antes del cliente, selecciona por ID estable y abre la ficha segura',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><ArmarCotizacion/></MemoryRouter>);
    expect(screen.getByText(/Selecciona un segmento para habilitar/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:/B2C · PARTICULARES/i}));
    const opcion=await screen.findByRole('option',{name:/Puerta catálogo C2/i});
    const selector=opcion.closest('select')!;
    expect(withinOptions(selector)).toContain('Puerta catálogo C2');
    await user.selectOptions(selector,'71');
    await user.click(screen.getByRole('button',{name:/Agregar alternativa/i}));
    const modalAlternativas=await screen.findByRole('dialog');
    expect(modalAlternativas).toHaveTextContent(/se guardan con el borrador/i);
    await user.click(screen.getByRole('checkbox',{name:/Puerta catálogo C2/i}));
    expect(modalAlternativas).toHaveTextContent(/no se suman entre sí/i);
    await user.click(screen.getByRole('button',{name:'Cerrar'}));
    expect(screen.getByRole('button',{name:'Ficha'})).toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:'Ficha'}));
    expect(await screen.findByRole('dialog')).toHaveTextContent('Descripción B2C publicada');
    expect(screen.getByRole('dialog')).toHaveTextContent(/Vista previa y descarga permanecen bloqueadas/i);
    expect(vi.mocked(solicitarFinanzas).mock.calls.some(([ruta])=>ruta==='/billing/products')).toBe(false);
    await waitFor(()=>expect(vi.mocked(solicitarFinanzas).mock.calls.some(([ruta])=>String(ruta).includes('segmento=B2C'))).toBe(true));
  });

  it('muestra contactos propios y servicios B2B sin confundirlos con instalación',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><ArmarCotizacion/></MemoryRouter>);
    await user.click(screen.getByRole('button',{name:/B2B · EMPRESAS/i}));
    expect(await screen.findByText(/Contactos de esta cotización/i)).toBeInTheDocument();
    expect(screen.getByText(/no modifican la ficha maestra/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button',{name:/Agregar contacto/i}));
    expect(screen.getByRole('radio',{name:/Contacto principal/i})).toBeChecked();
    const selector=await screen.findByRole('combobox',{name:'Agregar servicio'});
    expect(screen.getByText(/La instalación se mantiene en su bloque independiente/i)).toBeInTheDocument();
    await user.selectOptions(selector,'501');
    expect(screen.getByDisplayValue('Traslado comercial')).toBeInTheDocument();
  });

  it('mantiene la vista previa visible y no emite ni crea NV u OT cuando falta guardar el borrador',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><ArmarCotizacion/></MemoryRouter>);
    await user.click(screen.getByRole('button',{name:/B2C · PARTICULARES/i}));
    const vistaPrevia=await screen.findByRole('button',{name:/Vista previa PDF/i});
    await user.click(vistaPrevia);
    expect(await screen.findByRole('alert')).toHaveTextContent(/Guarda primero el borrador/i);
    expect(vi.mocked(solicitarFinanzas).mock.calls.some(([ruta])=>String(ruta).includes('/preview-pdf'))).toBe(false);
    expect(vi.mocked(solicitarFinanzas).mock.calls.some(([ruta])=>String(ruta).includes('/emitir'))).toBe(false);
  });

  it('distingue la dirección libre de la Obra estable y exige selección explícita',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><ArmarCotizacion/></MemoryRouter>);
    await user.click(screen.getByRole('button',{name:/B2B · EMPRESAS/i}));
    expect(screen.getByText(/Dirección aún no vinculada a una Obra/i)).toBeInTheDocument();
    await user.type(screen.getByRole('textbox',{name:'Dirección de obra'}),'Melín 7019');
    await user.type(screen.getByRole('textbox',{name:'Región'}),'Metropolitana');
    await user.type(screen.getByRole('textbox',{name:'Comuna'}),'Quinta Normal');
    await user.click(screen.getByRole('button',{name:/Buscar o registrar Obra/i}));
    const modal=await screen.findByRole('dialog');
    expect(modal).toHaveTextContent(/cada pedido formalizado tendrá su propio Proyecto/i);
    await user.click(screen.getByRole('button',{name:/Melín 7019/i}));
    expect(screen.getByText(/Obra formal seleccionada/i)).toBeInTheDocument();
    expect(screen.getByText(/ID 801/i)).toBeInTheDocument();
  });
});

function withinOptions(element:HTMLElement){return Array.from(element.querySelectorAll('option')).map(option=>option.textContent||'').join(' ');}
