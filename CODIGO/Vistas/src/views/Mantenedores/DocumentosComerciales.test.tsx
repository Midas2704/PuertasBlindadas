import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DocumentosComerciales from './DocumentosComerciales';

vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));
import { solicitarFinanzas } from '../../api/finanzas';

const json=(datos:unknown,status=200)=>Promise.resolve(new Response(JSON.stringify(datos),{status,headers:{'Content-Type':'application/json'}}));

describe('mantenedor documental comercial C4',()=>{
  beforeEach(()=>{
    vi.mocked(solicitarFinanzas).mockReset();
    vi.mocked(solicitarFinanzas).mockImplementation((ruta)=>{
      if(ruta==='/mantenedores/documentos-comerciales/estado')return json({motorPdf:'DISPONIBLE',almacenamientoPrivado:'NO_CONFIGURADO',antivirus:'NO_CONFIGURADO',emisionDefinitiva:'BLOQUEADA',motivo:'Falta infraestructura privada validada.'});
      if(ruta==='/mantenedores/documentos-comerciales/plantillas')return json({capacidadEdicion:'CU378',capacidadPublicacion:'CU379',plantillas:[{id:'1',codigo:'B2C-COT',nombre:'Cotización B2C',tipo:'COTIZACION',segmento:'B2C',estado:'ACTIVA',revision:1,versiones:[{id:'2',numero:1,estado:'BORRADOR',publicadoEn:null,esquema:{titulo:'Cotización',secciones:['productos']}}]}]});
      if(ruta==='/mantenedores/documentos-comerciales/cartas-b2c')return json({capacidadEdicion:'CU380',capacidadPublicacion:'CU381',cartas:[{id:'3',codigo:'CARTA-B2C',titulo:'Carta general',contenidoBorrador:{presentacion:'Prueba',modelos:[]},estado:'BORRADOR',revision:1,actualizadoEn:'2026-10-16T12:00:00.000Z',versiones:[]}]});
      if(ruta==='/mantenedores/documentos-comerciales/cartas-b2c/3/vista-previa')return json({contenido:'data:application/pdf;base64,JVBERi0xLjQ=',nombre:'carta.pdf',paginas:2,sha256:'a'.repeat(64),estado:'BORRADOR_NO_EMITIDO'});
      return json({error:'Ruta no contemplada'},404);
    });
  });

  it('consulta plantillas y no muestra acciones sin CU específico',async()=>{
    render(<MemoryRouter initialEntries={['/mantenedores/documentos-comerciales?seccion=plantillas']}><DocumentosComerciales/></MemoryRouter>);
    expect(await screen.findByText('Cotización B2C')).toBeInTheDocument();
    expect(screen.queryByRole('button',{name:/Publicar/i})).not.toBeInTheDocument();
    expect(screen.getByText(/Emisión definitiva/i).parentElement).toHaveTextContent(/BLOQUEADA/i);
  });

  it('abre la vista previa real de la carta en un modal centrado sin publicarla',async()=>{
    const user=userEvent.setup();
    render(<MemoryRouter initialEntries={['/mantenedores/documentos-comerciales?seccion=carta-b2c']}><DocumentosComerciales/></MemoryRouter>);
    await user.click(await screen.findByRole('button',{name:/Vista previa/i}));
    const dialogo=await screen.findByRole('dialog');
    expect(dialogo).toHaveTextContent(/BORRADOR — NO PUBLICADO/i);
    expect(screen.getByTitle('Vista previa carta comercial B2C')).toHaveAttribute('src',expect.stringMatching(/^data:application\/pdf;base64,/));
    expect(screen.queryByRole('button',{name:/Publicar/i})).not.toBeInTheDocument();
  });
});
