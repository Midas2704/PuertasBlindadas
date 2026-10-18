import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import PanelDocumentosProducto from './PanelDocumentosProducto';
import { capacidadesDocumentalesDeshabilitadas, type DocumentoComercialProducto } from './tipos';

const documento = (parcial: Partial<DocumentoComercialProducto> = {}): DocumentoComercialProducto => ({
  idDocumento:'doc-1', idAsociacion:'asoc-1', idProducto:7, titulo:'Fotografía puerta', clasificacion:'COMERCIAL',
  tipo:'FOTOGRAFIA_COMERCIAL', estado:'DISPONIBLE', versionActual:2,
  incorporadoEn:'2026-10-01T12:00:00.000Z', actualizadoEn:'2026-10-02T12:00:00.000Z',
  esImagenPrincipal:false, ordenPresentacion:1, habilitadoB2b:false, habilitadoB2c:false,
  mimeDetectado:'image/jpeg', vistaPrevia:{disponible:true,tipo:'MINIATURA',idVersion:'v-2',urlTemporal:'https://preview.invalid/test-only'},
  versiones:[
    {idVersion:'v-2',numero:2,estado:'DISPONIBLE',fechaCreacion:'2026-10-02T12:00:00.000Z',responsableVisible:'usuario.test',vigente:true},
    {idVersion:'v-1',numero:1,estado:'REEMPLAZADO',fechaCreacion:'2026-10-01T12:00:00.000Z',responsableVisible:'usuario.test',vigente:false},
  ], ...parcial,
});

const capacidades = {...capacidadesDocumentalesDeshabilitadas,consultarMetadatos:true,consultarVersiones:true,solicitarVistaPrevia:true};

describe('PanelDocumentosProducto — interacción real',()=>{
  it('presenta creación, integración pendiente, carga, error y acceso denegado sin datos ficticios',()=>{
    const {rerender}=render(<PanelDocumentosProducto modo="crear" />);
    expect(screen.getByText(/después de crear el producto/i)).toBeInTheDocument();
    rerender(<PanelDocumentosProducto modo="editar" productoId={7} />);
    expect(screen.getByText(/aún no habilitada/i)).toBeInTheDocument();
    expect(screen.queryByText('Fotografía puerta')).not.toBeInTheDocument();
    rerender(<PanelDocumentosProducto modo="editar" productoId={7} estado="CARGANDO" />);
    expect(screen.getByText(/Cargando documentación autorizada/i)).toBeInTheDocument();
    rerender(<PanelDocumentosProducto modo="editar" productoId={7} estado="ERROR" error="Fallo controlado" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Fallo controlado');
    rerender(<PanelDocumentosProducto modo="editar" productoId={7} estado="DENEGADO" />);
    expect(screen.getByRole('alert')).toHaveTextContent(/no autorizado/i);
  });

  it('distingue un resultado vacío confirmado',()=>{
    render(<PanelDocumentosProducto modo="editar" productoId={7} estado="VACIO" />);
    expect(screen.getByText(/sin documentos asociados/i)).toBeInTheDocument();
    expect(screen.getByText(/Sin fotografías comerciales asociadas/i)).toBeInTheDocument();
  });

  it('muestra principal, orden de galería y usos B2B/B2C',()=>{
    const datos=[documento({idDocumento:'b',idAsociacion:'b',titulo:'Segunda',ordenPresentacion:2,habilitadoB2c:true}),documento({idDocumento:'a',idAsociacion:'a',titulo:'Principal',ordenPresentacion:1,esImagenPrincipal:true,habilitadoB2b:true})];
    render(<PanelDocumentosProducto modo="editar" productoId={7} estado="LISTO" documentos={datos} capacidades={capacidades} />);
    expect(screen.getAllByText('Principal').length).toBeGreaterThan(0);
    const galeria=screen.getByRole('heading',{name:/Galería comercial/i}).closest('section')!;
    const tarjetas=within(galeria).getAllByRole('article');
    expect(tarjetas[0]).toHaveTextContent('Principal'); expect(tarjetas[1]).toHaveTextContent('Segunda');
    expect(galeria).toHaveTextContent('B2B'); expect(galeria).toHaveTextContent('B2C');
  });

  it('presenta documentos comerciales y el historial autorizado',async()=>{
    const ficha=documento({idDocumento:'ficha',idAsociacion:'ficha',titulo:'Ficha técnica segura',tipo:'FICHA_TECNICA',habilitadoB2b:true,habilitadoB2c:true});
    render(<PanelDocumentosProducto modo="editar" productoId={7} estado="LISTO" documentos={[ficha]} capacidades={capacidades} />);
    expect(screen.getByText('Ficha técnica segura')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button',{name:'Historial'}));
    expect(screen.getByText(/Versión 2 · vigente/i)).toBeInTheDocument();
    expect(screen.getByText(/Versión 1 · histórica/i)).toBeInTheDocument();
  });

  it('abre modal centrado, navega fotografías y lo cierra',async()=>{
    const user=userEvent.setup();
    const fotos=[documento({idDocumento:'a',idAsociacion:'a',titulo:'Foto A',ordenPresentacion:1}),documento({idDocumento:'b',idAsociacion:'b',titulo:'Foto B',ordenPresentacion:2})];
    render(<PanelDocumentosProducto modo="editar" productoId={7} estado="LISTO" documentos={fotos} capacidades={capacidades} />);
    await user.click(screen.getAllByRole('button',{name:'Vista ampliada'})[0]);
    const dialogo=screen.getByRole('dialog');
    expect(dialogo.parentElement).toHaveClass('place-items-center'); expect(dialogo).toHaveTextContent('Foto A');
    await user.click(within(dialogo).getByRole('button',{name:/Siguiente/i}));
    expect(screen.getByRole('dialog')).toHaveTextContent('Foto B');
    await user.click(within(screen.getByRole('dialog')).getByRole('button',{name:'Cerrar'}));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('no habilita descarga, carga ni acciones sin capacidades',()=>{
    const ficha=documento({tipo:'FICHA_TECNICA',titulo:'Ficha bloqueada'});
    render(<PanelDocumentosProducto modo="editar" productoId={7} estado="LISTO" documentos={[ficha]} />);
    expect(screen.getByRole('button',{name:'Descargar'})).toBeDisabled();
    expect(screen.getByRole('button',{name:'Previsualizar'})).toBeDisabled();
    expect(screen.getByRole('button',{name:'Historial'})).toBeDisabled();
    expect(screen.getByRole('button',{name:'Agregar fotografía'})).toBeDisabled();
    expect(screen.getByRole('button',{name:'Agregar documento'})).toBeDisabled();
  });

  it('un documento en cuarentena no expone vista previa ni descarga',()=>{
    const cuarentena=documento({tipo:'FICHA_TECNICA',titulo:'Archivo retenido',estado:'CUARENTENA'});
    render(<PanelDocumentosProducto modo="editar" productoId={7} estado="LISTO" documentos={[cuarentena]} capacidades={{...capacidades,descargar:true}} />);
    expect(screen.getByRole('button',{name:'Previsualizar'})).toBeDisabled();
    expect(screen.getByRole('button',{name:'Descargar'})).toBeDisabled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('distingue permisos pendientes, política, storage y antivirus no configurados',()=>{
    render(<PanelDocumentosProducto modo="editar" productoId={7} estado="VACIO" capacidades={{...capacidadesDocumentalesDeshabilitadas,consultarMetadatos:true,diagnosticoActivacion:{permisoGestion:'APROBADO_C2_6',politicaComercial:'NO_CONFIGURADA',storage:'NO_CONFIGURADO',antivirus:'NO_CONFIGURADO'}}}/>);
    expect(screen.getByLabelText('Estado de activación documental')).toHaveTextContent('Permiso de gestiónCU aprobados; asignación explícita');
    expect(screen.getByLabelText('Estado de activación documental')).toHaveTextContent('StorageNo disponible');
    expect(screen.getByLabelText('Estado de activación documental')).toHaveTextContent('AntivirusNo disponible');
  });

  it('una carga pendiente se informa sin presentarla como disponible',()=>{
    const pendiente=documento({estado:'VALIDANDO',titulo:'Fotografía en validación'});
    render(<PanelDocumentosProducto modo="editar" productoId={7} estado="LISTO" documentos={[pendiente]} capacidades={capacidadesDocumentalesDeshabilitadas}/>);
    expect(screen.getByText(/carga pendiente de validación/i)).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Vista ampliada'})).toBeDisabled();
  });

  it('los fixtures no contienen secretos, credenciales ni conexiones reales',()=>{
    const serializado=JSON.stringify(documento());
    expect(serializado).not.toMatch(/AKIA|secretAccessKey|authorization|cloudflarestorage|amazonaws|clouding/i);
    expect(serializado).toContain('preview.invalid');
  });
});
