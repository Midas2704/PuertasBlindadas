import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GestionTerreno from './GestionTerreno/GestionTerreno';
import Honorarios from './Honorarios/Honorarios';
import OrdenesCompraServicios from './OrdenesCompraServicios/OrdenesCompraServicios';

const control=vi.hoisted(()=>({
  permisos:['CU88'] as string[],
  solicitar:vi.fn(),
  fetch:vi.fn(),
  texto:vi.fn(),
  confirmar:vi.fn(),
}));

vi.mock('../api/finanzas',()=>({solicitarFinanzas:control.solicitar}));
vi.mock('../seguridad/Sesion',()=>({usarSesion:()=>({sesion:{id:'1',nombre:'Fixture',acceso:'prueba',permisos:control.permisos,configuracion:'',administrador:false,cambiarClave:false},cargando:false,actualizar:vi.fn()})}));
vi.mock('../components/DialogosSistema',()=>({solicitarTexto:control.texto,confirmarAccion:control.confirmar}));

const respuesta=(dato:unknown,ok=true)=>Promise.resolve({ok,json:async()=>dato});
const ocs={id:7,proveedor:{id:3,razonSocial:'Proveedor Fixture',estado:'activo'},estado:'abierta',montoAutorizado:250000,montoAutorizadoOriginal:250000,montoDocumentado:0,saldoDisponible:250000,tieneEfectosFinancieros:false,referencia:'REF-7',periodo:'2026-10',descripcion:'Servicio controlado',fechaCreacion:'2026-10-01T00:00:00Z',fechaActualizacion:'2026-10-01T00:00:00Z',creadoPor:{id:'1',nombre:'Fixture'},historial:[],ajustes:[]};

describe('acciones finales reportadas por usuarios',()=>{
  beforeEach(()=>{
    control.permisos=['CU88'];
    control.solicitar.mockReset();control.fetch.mockReset();control.texto.mockReset();control.confirmar.mockReset();
    vi.stubGlobal('fetch',control.fetch);
  });

  it('Ver OCS navega, consulta el registro y muestra su detalle sin mutarlo',async()=>{
    control.solicitar.mockImplementation((ruta:string)=>respuesta(ruta==='/ordenes-compra-servicios'?[ocs]:ocs));
    render(<MemoryRouter initialEntries={['/ordenes-compra-servicios']}><Routes><Route path="ordenes-compra-servicios" element={<OrdenesCompraServicios/>}/><Route path="ordenes-compra-servicios/:id" element={<OrdenesCompraServicios/>}/></Routes></MemoryRouter>);
    fireEvent.click(await screen.findByTitle('Ver detalle'));
    expect(await screen.findByText('Detalle OCS-7')).toBeInTheDocument();
    expect(screen.getAllByText('Proveedor Fixture').length).toBeGreaterThan(0);
    const consulta=control.solicitar.mock.calls.find(([ruta])=>ruta==='/ordenes-compra-servicios/7');
    expect(consulta?.[1]).toBeUndefined();
    expect(screen.queryByTitle('Editar')).not.toBeInTheDocument();
  });

  it('Ver OCS presenta el error entregado por una consulta inválida',async()=>{
    control.solicitar.mockImplementation((ruta:string)=>ruta==='/ordenes-compra-servicios/999'?respuesta({error:'OCS no encontrada'},false):respuesta([]));
    render(<MemoryRouter initialEntries={['/ordenes-compra-servicios/999']}><Routes><Route path="ordenes-compra-servicios/:id" element={<OrdenesCompraServicios/>}/></Routes></MemoryRouter>);
    expect(await screen.findByText('OCS no encontrada')).toBeInTheDocument();
  });

  it('Editar honorario carga la boleta pendiente y guarda por PATCH',async()=>{
    control.permisos=['CU196','CU197'];
    const boleta={id:12,folio:'BH-12',fechaEmision:'2026-10-02T00:00:00Z',bruto:100000,modalidadTributaria:'CON_RETENCION_RECEPTOR',respaldo:'DOC-12',referencia:'REF-12',estadoDocumental:'PENDIENTE_CONFIRMACION',tasaAplicada:null,retencion:null,liquido:null,prestador:{id:4,nombre:'Prestador Fixture',identificador:'11.111.111-1'},economia:{condicion:'PENDIENTE',saldoPendiente:null,montoEfectivo:0}};
    control.solicitar.mockImplementation((ruta:string)=>{
      if(ruta==='/boletas-honorarios/prestadores') return respuesta([boleta.prestador]);
      if(ruta==='/boletas-honorarios'||ruta.startsWith('/boletas-honorarios?')) return respuesta([boleta]);
      return respuesta(boleta);
    });
    render(<Honorarios/>);
    fireEvent.click(await screen.findByTitle('Editar'));
    expect(screen.getByRole('heading',{name:'Editar boleta pendiente'})).toBeInTheDocument();
    expect(screen.getByDisplayValue('BH-12')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Monto bruto'),{target:{value:'125000'}});
    fireEvent.click(screen.getByRole('button',{name:'Guardar pendiente'}));
    await waitFor(()=>expect(control.solicitar).toHaveBeenCalledWith('/boletas-honorarios/12',expect.objectContaining({method:'PATCH'})));
    const llamada=control.solicitar.mock.calls.find(([ruta])=>ruta==='/boletas-honorarios/12');
    expect(JSON.parse(llamada?.[1]?.body as string).bruto).toBe('125000');
  });

  it('Gestor de visitas muestra detalle, preparación y registra resultado permitido',async()=>{
    control.permisos=['CU210','CU211'];
    const visita={id:'21',tipoServicio:'Instalación',fecha:'2026-10-05',bloqueHorario:'10:00',prioridad:'normal',estado:'pendiente',observaciones:'Acceso coordinado',responsable:{id:'2',acceso:'activo',nombre:'Técnico Fixture'},obra:{id:'8',nombre:'Obra Fixture',referencia:'OB-8',direccion:'Calle 1',comuna:'Santiago',region:'RM',cliente:{rut:'1-9',nombre:'Cliente Fixture'},especificacion:{id:'9',modelo:'PB-1',zona:'Acceso',observaciones:null}}};
    control.fetch.mockImplementation((entrada:string)=>respuesta(entrada.endsWith('/preparacion-salida')?{visita,checklist:{id:'1',item:'Herramientas',marcado:true,noMarcado:false},ordenesTrabajo:[]}:entrada.endsWith('/resultado')?{estadoVisita:'cerrada'}:entrada.endsWith('/21')?visita:[visita]));
    control.texto.mockResolvedValueOnce('Servicio conforme').mockResolvedValueOnce('Sin observaciones');control.confirmar.mockResolvedValue(true);
    render(<GestionTerreno/>);
    fireEvent.click(await screen.findByTitle('Ver detalle'));
    expect(await screen.findByText('Detalle visita 21')).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Preparar salida'));
    expect(await screen.findByText(/Preparación de salida/)).toBeInTheDocument();
    fireEvent.click(screen.getByTitle('Registrar resultado'));
    expect(await screen.findByText('Visita cerrada')).toBeInTheDocument();
    expect(control.fetch).toHaveBeenCalledWith('/api/finanzas/terreno/visitas/21/resultado',expect.objectContaining({method:'POST'}));
  });
});
