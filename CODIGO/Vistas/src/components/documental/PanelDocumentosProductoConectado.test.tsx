import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PanelDocumentosProductoConectado from './PanelDocumentosProductoConectado';
import { capacidadesDocumentalesDeshabilitadas } from './tipos';

vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));
import { solicitarFinanzas } from '../../api/finanzas';

const respuesta=(status:number,datos:unknown)=>Promise.resolve(new Response(JSON.stringify(datos),{status,headers:{'Content-Type':'application/json'}}));

describe('Panel documental conectado C2',()=>{
  beforeEach(()=>vi.mocked(solicitarFinanzas).mockReset());

  it('consulta metadatos reales del producto y representa un resultado vacío',async()=>{
    vi.mocked(solicitarFinanzas).mockImplementation(()=>respuesta(200,{estadoIntegracion:'VACIO',documentos:[],capacidades:{...capacidadesDocumentalesDeshabilitadas,consultarMetadatos:true}}));
    render(<PanelDocumentosProductoConectado modo="editar" productoId={23}/>);
    expect(await screen.findByText(/sin documentos asociados/i)).toBeInTheDocument();
    expect(solicitarFinanzas).toHaveBeenCalledWith('/mantenedores/productos/23/documentos',expect.objectContaining({signal:expect.any(AbortSignal)}));
  });

  it('muestra acceso denegado sin revelar metadatos cuando M4 rechaza',async()=>{
    vi.mocked(solicitarFinanzas).mockImplementation(()=>respuesta(403,{error:'Acceso documental denegado'}));
    render(<PanelDocumentosProductoConectado modo="editar" productoId={23}/>);
    expect(await screen.findByRole('alert')).toHaveTextContent(/no autorizado/i);
    expect(screen.queryByText(/Fotografía puerta/i)).not.toBeInTheDocument();
  });
});
