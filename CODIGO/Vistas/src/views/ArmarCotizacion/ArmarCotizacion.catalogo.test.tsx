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
const cliente={id_cliente_financiero:31,id_ficha_cliente:41,rut:'11.111.111-1',razonSocial:'Cliente B2C Prueba',nivelFormalizacion:'FORMAL',tipoCliente:'B2C',telefono:'+56911111111',correo:'cliente@prueba.cl'};
const material={id_historial_precio_material:61,sku:'MAT-61',nombre:'Acero de prueba',precio_unitario:100000,moneda:'CLP'};
const json=(datos:unknown,status=200)=>Promise.resolve(new Response(JSON.stringify(datos),{status,headers:{'Content-Type':'application/json'}}));

describe('Armar Cotización conectado al catálogo comercial C2',()=>{
  beforeEach(()=>{
    Object.defineProperty(URL,'createObjectURL',{configurable:true,value:vi.fn(()=> 'blob:preview-cotizacion')});
    Object.defineProperty(URL,'revokeObjectURL',{configurable:true,value:vi.fn()});
    vi.mocked(solicitarFinanzas).mockReset();
    let revision=0;
    vi.mocked(solicitarFinanzas).mockImplementation((ruta,opciones)=>{
      if(ruta==='/monedas')return json([{id_moneda:1,codigo_moneda:'CLP'}]);
      if(String(ruta).startsWith('/clients?'))return json([cliente]);
      if(ruta==='/billing/inventory')return json([material]);
      if(String(ruta).startsWith('/mantenedores/comercial/condiciones?'))return json([]);
      if(String(ruta).startsWith('/mantenedores/comercial/servicios?'))return json([{id:'501',codigo:'FLT',nombre:'Flete autorizado',descripcion:'Traslado comercial',unidad:'GLOBAL',precio:{resultado:'VIGENTE',id:'precio-servicio-501',monto:50000,moneda:'CLP',version:1}}]);
      if(String(ruta).startsWith('/billing/quotes/obras/buscar?'))return json({obras:[{id:'801',nombre:'Melín 7019',referencia:'Edificio principal',direccion:'Melín 7019',region:'Metropolitana',ciudad:'Santiago',comuna:'Quinta Normal',edificio:null,unidad:null,estado:'activa',revision:1,coincidencia:'EXACTA'}],requiereSeleccionExplicita:false});
      if(String(ruta).startsWith('/billing/quotes/contexto/antecedentes?'))return json({identidad:{estado:'REFERENCIA_CONFIRMADA',cliente:{id:31,rut:cliente.rut,nombre:cliente.razonSocial,estado:'activo',procedencia:'finanzas.cliente_financiero'},obra:{id:'801',nombre:'Melín 7019'},proyectos:[{id:'9010',codigo:'COT-901',nombre:'Pedido 2026',estadoOperacional:'FORMALIZADO',estadoProduccion:'PENDIENTE',idCotizacionOrigen:901,procedencia:'terreno.proyecto'}]},fuentes:[{origen:'M2',disponibilidad:'DISPONIBLE',alcanceAutorizado:true,antecedentes:[{referencia:'COTIZACION:901'}]},{origen:'TERRENO',disponibilidad:'SIN_ANTECEDENTES',alcanceAutorizado:true,antecedentes:[]},{origen:'M3',disponibilidad:'ACCESO_RESTRINGIDO',alcanceAutorizado:false,antecedentes:[]}]});
      if(String(ruta).startsWith('/catalogo-comercial/productos/71/ficha'))return json(ficha);
      if(String(ruta).startsWith('/catalogo-comercial/productos?'))return json([producto]);
      if(ruta==='/billing/quotes'&&opciones?.method==='POST'){revision=1;return json({id_cotizacion:901,revision,contactos_b2b:[],grupos_alternativas_b2c:[]});}
      if(ruta==='/billing/quotes/901'&&opciones?.method==='PUT'){revision+=1;return json({id_cotizacion:901,revision,contactos_b2b:[],grupos_alternativas_b2c:[]});}
      if(ruta==='/billing/quotes/901/preview-pdf'&&opciones?.method==='POST')return json({contenido:'data:application/pdf;base64,JVBERi0xLjQKJSVFT0YK',nombre:'cotizacion-borrador.pdf',paginas:3,sha256:'abc123',estado:'BORRADOR'});
      if(ruta==='/billing/pending-approvals')return json({cotizaciones:[{id_cotizacion:901,estado_cotizacion:'borrador',segmento_comercial:'B2C',revision,id_ficha_cliente:41,id_moneda:1,fecha_vigencia:'2026-10-31',margen_esperado:30,exento_iva:false,descuento_valor:0,ficha_cliente:{cliente_financiero:{...cliente,nombre_razon_social_referencia:cliente.razonSocial,rut_cliente:cliente.rut,telefono_financiero:cliente.telefono,correo_financiero:cliente.correo}},detalle_cotizacion:[],grupos_alternativas_b2c:[],contactos_b2b:[],detalles_servicio:[]}]});
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

  it('crea un único borrador nuevo y abre su vista previa PDF sin emitir, NV ni OT',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><ArmarCotizacion/></MemoryRouter>);
    await completarCotizacionB2C(user);
    await user.click(await screen.findByRole('button',{name:/Vista previa PDF/i}));
    expect(await screen.findByRole('dialog')).toHaveTextContent(/BORRADOR — NO EMITIDO/i);
    expect(screen.getByTitle('Vista previa PDF')).toHaveAttribute('src','blob:preview-cotizacion');
    const llamadas=vi.mocked(solicitarFinanzas).mock.calls;
    expect(llamadas.filter(([ruta,opciones])=>ruta==='/billing/quotes'&&opciones?.method==='POST')).toHaveLength(1);
    expect(llamadas.some(([ruta])=>ruta==='/billing/quotes/901/preview-pdf')).toBe(true);
    expect(vi.mocked(solicitarFinanzas).mock.calls.some(([ruta])=>String(ruta).includes('/emitir'))).toBe(false);
    expect(vi.mocked(solicitarFinanzas).mock.calls.some(([ruta])=>String(ruta).includes('nota-venta')||String(ruta).includes('ordenes-trabajo'))).toBe(false);
  });

  it('actualiza el mismo borrador antes de cada vista previa y no crea duplicados',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><ArmarCotizacion/></MemoryRouter>);
    await completarCotizacionB2C(user);
    await user.click(await screen.findByRole('button',{name:/Vista previa PDF/i}));
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button',{name:'Cerrar'}));
    await user.click(screen.getByRole('button',{name:/Vista previa PDF/i}));
    await screen.findByRole('dialog');
    const llamadas=vi.mocked(solicitarFinanzas).mock.calls;
    expect(llamadas.filter(([ruta,opciones])=>ruta==='/billing/quotes'&&opciones?.method==='POST')).toHaveLength(1);
    expect(llamadas.filter(([ruta,opciones])=>ruta==='/billing/quotes/901'&&opciones?.method==='PUT').length).toBeGreaterThanOrEqual(1);
    expect(llamadas.filter(([ruta])=>ruta==='/billing/quotes/901/preview-pdf')).toHaveLength(2);
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
    await user.click(screen.getByRole('button',{name:'Seleccionar Obra'}));
    expect(screen.getByText(/Obra formal seleccionada/i)).toBeInTheDocument();
    expect(screen.getByText(/ID 801/i)).toBeInTheDocument();
  });

  it('consulta identidad, proyectos y disponibilidad por fuente sin crear entidades',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter><ArmarCotizacion/></MemoryRouter>);
    await user.click(screen.getByRole('button',{name:/B2B · EMPRESAS/i}));
    await user.type(screen.getByRole('textbox',{name:'Dirección de obra'}),'Melín 7019');
    await user.type(screen.getByRole('textbox',{name:'Región'}),'Metropolitana');
    await user.type(screen.getByRole('textbox',{name:'Comuna'}),'Quinta Normal');
    await user.click(screen.getByRole('button',{name:/Buscar o registrar Obra/i}));
    await screen.findByRole('dialog');
    await user.click(screen.getByRole('button',{name:'Ver identidad y antecedentes'}));
    expect(await screen.findByRole('region',{name:'Contexto de Obra'})).toHaveTextContent(/Pedido 2026/i);
    expect(screen.getByRole('region',{name:'Contexto de Obra'})).toHaveTextContent(/M3: ACCESO_RESTRINGIDO/i);
    expect(vi.mocked(solicitarFinanzas).mock.calls.some(([ruta,opciones])=>String(ruta).includes('/contexto/antecedentes')&&!opciones?.method)).toBe(true);
    expect(vi.mocked(solicitarFinanzas).mock.calls.some(([,opciones])=>['POST','PUT','DELETE'].includes(String(opciones?.method)))).toBe(false);
  });
});

function withinOptions(element:HTMLElement){return Array.from(element.querySelectorAll('option')).map(option=>option.textContent||'').join(' ');}
async function completarCotizacionB2C(user:ReturnType<typeof userEvent.setup>){
  await user.click(screen.getByRole('button',{name:/B2C · PARTICULARES/i}));
  const buscador=await screen.findByPlaceholderText('Buscar cliente por nombre o RUT');
  await user.click(buscador);
  await user.click(await screen.findByRole('button',{name:/Cliente B2C Prueba/i}));
  const opcion=await screen.findByRole('option',{name:/Puerta catálogo C2/i});
  await user.selectOptions(opcion.closest('select')!,'71');
  await user.click(screen.getByText('Costeo interno · no visible para el cliente'));
  const materialOption=await screen.findByRole('option',{name:/Acero de prueba/i});
  await user.selectOptions(materialOption.closest('select')!,'61');
}
