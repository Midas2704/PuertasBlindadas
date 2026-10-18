import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import IncidenciasTerreno from './IncidenciasTerreno';

vi.mock('../../seguridad/Sesion',()=>({usarSesion:()=>({sesion:{id:'9',administrador:false,permisos:['CU202','CU212','CU213']}})}));
vi.mock('../../components/DialogosSistema',()=>({solicitarTexto:vi.fn()}));

const incidencia={id:'12',referencia:'INC-00012',descripcion:'Pintura dañada',categoria:{id:3,codigo:'POSTVENTA',nombre:'Postventa'},area:{id:'4',nombre:'Pintura'},causaReferencia:'Daño superficial',responsabilidad:null,responsableSeguimiento:null,participantes:[{tipo:'EMPLEADO_EJECUTOR',id:'8',nombre:'Ana Técnica'}],estado:'pendiente',estadoRevision:'aprobada',fecha:'2026-10-15T10:00:00.000Z',creador:{id:'2',nombre:'Operador'},revision:{nombre:'Gerencia',fecha:'2026-10-15T12:00:00.000Z',observacion:'Validada'},evidencias:[{id:'5',nombre:'foto.webp',fecha:'2026-10-15'}],trazabilidad:[{tipo:'APROBACION',fecha:'2026-10-15T12:00:00.000Z',usuario:'Gerencia',detalle:'Validada'}],origen:{tipo:'VISITA_POSTVENTA',id:'7',descripcion:'Postventa'},cliente:{rut:'1-9',nombre:'Cliente Real'},puerta:{numeroUnidad:1,producto:'Puerta Alfa',codigo:'PA',familia:'Blindadas'},ejecucion:{id:'20',tarea:{id:'30',titulo:'Revisar pintura',idOrdenTrabajo:'44',idServicio:'7'}},accionesCorrectivas:{disponibles:false,detalle:'El modelo actual no registra múltiples acciones correctivas.'}};
const listado={items:[incidencia],paginacion:{pagina:1,tamano:10,total:1,totalPaginas:1},indicadores:{registradas:1,pendientesRevision:0,aprobadas:1,rechazadas:0,pendientesResolucion:1,resueltas:0,categorias:[{nombre:'Postventa',cantidad:1}],areas:[{nombre:'Pintura',cantidad:1}]}};
const respuesta=(dato:unknown)=>Promise.resolve({ok:true,json:async()=>dato} as Response);

describe('Gestión integral de incidencias T4',()=>{
  beforeEach(()=>vi.stubGlobal('fetch',vi.fn((entrada:RequestInfo|URL)=>String(entrada).includes('incidencias-catalogos')?respuesta({categorias:[{id:3,codigo:'POSTVENTA',nombre:'Postventa'}],areas:[{id:'4',nombre:'Pintura'}],clientes:[]}):respuesta(listado))));

  it('muestra bandeja paginada, indicadores y filtros separados',async()=>{
    render(<MemoryRouter><IncidenciasTerreno/></MemoryRouter>);
    expect(await screen.findByText('INC-00012')).toBeInTheDocument();
    expect(screen.getByText('Cliente Real')).toBeInTheDocument();
    expect(screen.getByText('1 registro(s) · Página 1 de 1')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Estado de revisión'),{target:{value:'aprobada'}});
    await waitFor(()=>expect(fetch).toHaveBeenCalledWith(expect.stringContaining('estadoRevision=aprobada'),expect.anything()));
  });

  it('consolida postventa, OT, visita, evidencias y limita acciones sin persistencia',async()=>{
    render(<MemoryRouter initialEntries={['/terreno/incidencias?incidencia=12']}><IncidenciasTerreno/></MemoryRouter>);
    expect(await screen.findByText(/Detalle y seguimiento · INC-00012/)).toBeInTheDocument();
    expect(screen.getByText(/Ana Técnica/)).toBeInTheDocument();
    expect(screen.getByRole('link',{name:'Abrir OT'})).toHaveAttribute('href','/terreno/ordenes-trabajo/44');
    expect(screen.getByRole('link',{name:'Abrir visita/instalación'})).toHaveAttribute('href','/terreno/instalaciones?visita=7');
    expect(screen.getByText('El modelo actual no registra múltiples acciones correctivas.')).toBeInTheDocument();
    expect(screen.getByRole('button',{name:'Registrar corrección'})).toBeInTheDocument();
  });
});
