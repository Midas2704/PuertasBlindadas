import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import InstalacionesTerreno from './InstalacionesTerreno';
import { resumirInstalaciones } from './resumenInstalaciones';
import type { InstalacionTerreno } from '../GestionTerreno/tipos';
import { solicitarFinanzas } from '../../api/finanzas';

vi.mock('../../seguridad/Sesion',()=>({usarSesion:()=>({sesion:{administrador:false,permisos:['CU199','CU202','CU211','CU212']}})}));
vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));

const instalacion=(extra:Partial<InstalacionTerreno>={}):InstalacionTerreno=>({id:'9:44',idVisita:'9',idOrdenTrabajo:'44',puerta:{idUnidad:'4',numeroUnidad:1,producto:'Puerta Alfa',codigo:'PA',familia:'Blindadas'},cliente:{rut:'1-9',nombre:'Cliente Real'},obra:{id:'3',nombre:'Obra Centro',referencia:'OB-3',direccion:'Calle Uno',comuna:'Santiago',region:'RM',cliente:{rut:'1-9',nombre:'Cliente Real'},especificacion:null},visita:{id:'9',tipoServicio:'Instalación',fecha:'2026-10-16',bloqueHorario:null,prioridad:'alta',estado:'pendiente',observaciones:null,responsable:{id:'2',acceso:'ana',nombre:'Ana Técnica'},obra:null},fabricacion:{estado:'FINALIZADA',finalizada:true},preparacion:{checklist:{id:'1',item:'Herramientas de montaje',marcado:true,noMarcado:false,detalleMarcado:null,detalleNoMarcado:null},direccionDisponible:true,responsableAsignado:true,visitaProgramada:true},tareas:[{id:'5',titulo:'Instalar puerta',estado:'pendiente'}],incidencias:[],resultado:null,clasificacion:'PENDIENTE',entrega:{estado:'NO_REGISTRADA',detalle:'Entrega no registrada'},...extra});
const respuesta=(dato:unknown,ok=true)=>Promise.resolve({ok,json:async()=>dato} as Response);

describe('Seguimiento de instalaciones',()=>{
  beforeEach(()=>vi.mocked(solicitarFinanzas).mockReset());

  it('distingue cero registros y estados operacionales confiables',()=>{
    expect(resumirInstalaciones([])).toEqual({total:0,programadas:0,pendientes:0,realizadas:0,noCompletadas:0});
    expect(resumirInstalaciones([instalacion(),instalacion({id:'10:45',clasificacion:'INSTALACION_COMPLETADA'}),instalacion({id:'11:46',clasificacion:'REPROGRAMACION_NECESARIA'})])).toEqual({total:3,programadas:1,pendientes:1,realizadas:1,noCompletadas:1});
  });

  it('filtra, abre preparación y mantiene entrega separada',async()=>{
    vi.mocked(solicitarFinanzas).mockReturnValue(respuesta([instalacion()]));
    render(<MemoryRouter><InstalacionesTerreno/></MemoryRouter>);
    expect(await screen.findByText('Cliente Real')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Orden de Trabajo'),{target:{value:'999'}});
    expect(screen.getByText('No hay instalaciones para los filtros seleccionados.')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Orden de Trabajo'),{target:{value:'44'}});
    fireEvent.click(screen.getByTitle('Ver instalación OT 44'));
    expect(screen.getByText('Herramientas de montaje')).toBeInTheDocument();
    expect(screen.getByText('Entrega no registrada')).toBeInTheDocument();
    expect(screen.getByText(/no acreditan por sí solas una entrega formal/i)).toBeInTheDocument();
    expect(screen.getByRole('link',{name:/OT 44/})).toHaveAttribute('href','/terreno/ordenes-trabajo/44');
  });

  it('registra el resultado en una tarea explícita sin marcar entrega',async()=>{
    vi.mocked(solicitarFinanzas).mockImplementation((_ruta,opciones)=>opciones?.method==='POST'?respuesta({idFormulario:'8',estadoVisita:'cerrada'}):respuesta([instalacion()]));
    render(<MemoryRouter><InstalacionesTerreno/></MemoryRouter>);
    fireEvent.click(await screen.findByTitle('Ver instalación OT 44'));
    fireEvent.change(screen.getByLabelText('Resultado de instalación'),{target:{value:'Instalación completada'}});
    fireEvent.click(screen.getByRole('button',{name:'Guardar resultado'}));
    await waitFor(()=>expect(solicitarFinanzas).toHaveBeenCalledWith('/terreno/visitas/9/resultado',expect.objectContaining({method:'POST',body:expect.stringContaining('"idTarea":"5"')})));
    expect(await screen.findByText(/Resultado de instalación registrado/)).toBeInTheDocument();
  });
});
