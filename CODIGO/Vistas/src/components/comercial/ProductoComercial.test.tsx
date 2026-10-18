import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ComparadorProductosComerciales from './ComparadorProductosComerciales';
import FichaProductoComercialModal from './FichaProductoComercialModal';
import TarjetaProductoComercial from './TarjetaProductoComercial';
import type { FichaProductoCatalogoComercial, ProductoCatalogoComercial } from './tipos';

const producto = (parcial:Partial<ProductoCatalogoComercial> = {}):ProductoCatalogoComercial => ({
  idProductoComercial:17, idItemComercial:41, codigo:'PB-SEG-01', nombre:'Puerta Seguridad Uno',
  familia:{id:3,codigo:'SEG',nombre:'Seguridad'}, subfamilia:'Residencial', tipo:'Puerta', idProductoComercialVersion:44, numeroVersion:4,
  descripcion:'Descripción comercial publicada', caracteristicas:['Cierre multipunto','Terminación durable'],
  caracteristicasTecnicas:{espesor:'70 mm'}, garantia:'Garantía publicada', condicionesParticulares:null,
  estado:'VINCULADO', segmento:'B2C', precio:{resultado:'SIN_PRECIO',monto:null,moneda:null},
  opcionales:[], documentos:{fotografias:1,fotografiaPrincipalDisponible:true,documentosComerciales:2},
  costosInternosExpuestos:false, ...parcial,
});

const ficha: FichaProductoCatalogoComercial = {
  ...producto(),
  documental:{estadoIntegracion:'LISTO',documentos:[],fotografias:[],documentosTecnicos:[],fotografiaPrincipal:null,
    capacidades:{consultarMetadatos:true,consultarVersiones:true,solicitarVistaPrevia:false,descargar:false,cargar:false,reemplazar:false,definirPrincipal:false,ordenar:false,definirUsoComercial:false}},
};

describe('Componentes comerciales reutilizables C2',()=>{
  it('la tarjeta usa identidad estable y no inventa precio ni fotografía',async()=>{
    const verFicha=vi.fn(); const seleccionar=vi.fn();
    render(<TarjetaProductoComercial producto={producto()} verFicha={verFicha} seleccionar={seleccionar} seleccionable/>);
    expect(screen.getByText('Sin precio comercial vigente')).toBeInTheDocument();
    expect(screen.getByText(/Fotografía registrada; vista previa protegida/i)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button',{name:/Ver ficha comercial/i}));
    await userEvent.click(screen.getByRole('button',{name:'Seleccionar'}));
    expect(verFicha).toHaveBeenCalledWith(expect.objectContaining({idProductoComercial:17,idItemComercial:41}));
    expect(seleccionar).toHaveBeenCalledWith(expect.objectContaining({idProductoComercial:17}));
  });

  it('la ficha se abre en modal centrado y mantiene bloqueadas vista previa y descarga',()=>{
    render(<FichaProductoComercialModal ficha={ficha} cargando={false} error={null} cerrar={()=>{}}/>);
    const dialogo=screen.getByRole('dialog');
    expect(dialogo.parentElement).toHaveClass('place-items-center');
    expect(dialogo).toHaveTextContent('Descripción comercial publicada');
    expect(dialogo).toHaveTextContent('SIN_PRECIO');
    expect(dialogo).toHaveTextContent(/Vista previa y descarga permanecen bloqueadas por M4/i);
    expect(dialogo).not.toHaveTextContent(/costo interno|margen confidencial/i);
  });

  it('B2B y B2C conservan sus acentos y descripciones segmentadas',()=>{
    const {rerender}=render(<FichaProductoComercialModal ficha={{...ficha,segmento:'B2B',descripcion:'Texto exclusivo empresas'}} cargando={false} error={null} cerrar={()=>{}}/>);
    expect(screen.getByText('B2B')).toHaveClass('bg-orange-100');
    expect(screen.getByText('Texto exclusivo empresas')).toBeInTheDocument();
    rerender(<FichaProductoComercialModal ficha={{...ficha,segmento:'B2C',descripcion:'Texto exclusivo particulares'}} cargando={false} error={null} cerrar={()=>{}}/>);
    expect(screen.getByText('B2C')).toHaveClass('bg-gray-200');
    expect(screen.getByText('Texto exclusivo particulares')).toBeInTheDocument();
  });

  it('el comparador presenta alternativas sin sumarlas ni convertirlas en producto contratado',()=>{
    render(<ComparadorProductosComerciales productos={[producto(),producto({idProductoComercial:18,idItemComercial:42,codigo:'PB-SEG-02',nombre:'Puerta Seguridad Dos',precio:{resultado:'VIGENTE',id:'p2',monto:900000,moneda:'CLP'}})]}/>);
    const tabla=screen.getByRole('table');
    expect(within(tabla).getByText('Puerta Seguridad Uno')).toBeInTheDocument();
    expect(within(tabla).getByText('Puerta Seguridad Dos')).toBeInTheDocument();
    expect(screen.getByText(/se guardan separadas del producto contratado/i)).toBeInTheDocument();
    expect(screen.getByText(/no se suman entre sí ni al total/i)).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});
