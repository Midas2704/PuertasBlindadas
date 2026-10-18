import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AgendaTerreno, { filtrarVisitasAgenda, inicioSemanaAgenda, sumarDiasAgenda } from './AgendaTerreno';
import { resumirInstalacionesTerreno } from './resumenInstalaciones';
import { resumirVisitasTerreno } from './resumenPanelTerreno';
import type { VisitaTerreno } from '../GestionTerreno/tipos';

vi.mock('../../seguridad/Sesion',()=>({usarSesion:()=>({sesion:{permisos:['CU199','CU202']}})}));

const hoy=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Santiago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const visita=(id:string,fecha:string|null,extra:Partial<VisitaTerreno>={}):VisitaTerreno=>({id,tipoServicio:'Instalación',fecha,bloqueHorario:'1970-01-01T10:30:00.000Z',prioridad:'alta',estado:'pendiente',observaciones:null,responsable:{id:'7',acceso:'tecnico',nombre:'Ana Técnica'},obra:{id:'3',nombre:'Obra Centro',referencia:'OB-3',direccion:'Calle Uno',comuna:'Santiago',region:'RM',cliente:{rut:'1-9',nombre:'Cliente Real'},especificacion:null},...extra});
const respuesta=(dato:unknown,ok=true)=>Promise.resolve({ok,json:async()=>dato});

describe('Agenda operacional de Terreno',()=>{
  beforeEach(()=>vi.restoreAllMocks());

  it('calcula períodos, combina filtros y conserva visitas sin fecha en pendientes',()=>{
    expect(inicioSemanaAgenda('2026-10-15')).toBe('2026-10-12');
    expect(sumarDiasAgenda('2026-10-31',1)).toBe('2026-11-01');
    const datos=[visita('1','2026-10-15'),visita('2',null,{responsable:null}),visita('3','2026-10-16',{estado:'cerrada'})];
    expect(filtrarVisitasAgenda(datos,{tipo:'Instalación',estado:'pendiente',responsable:'TODOS',prioridad:'alta',desde:'',hasta:''},'2026-10-15','2026-10-15').map(v=>v.id)).toEqual(['1','2']);
  });

  it('resume indicadores reales sin contar cerradas como pendientes',()=>{
    const base=hoy();const datos=[visita('1',base),visita('2',sumarDiasAgenda(base,1)),visita('3',null),visita('4',sumarDiasAgenda(base,2),{estado:'cerrada'})];
    expect(resumirVisitasTerreno(datos,base)).toEqual({visitasHoy:1,proximasVisitas:1,visitasSinProgramar:1,visitasPendientes:3});
  });

  it('distingue instalaciones sin registros de métricas con cero real',()=>{
    expect(resumirInstalacionesTerreno([]).instalacionesProgramadas).toBe('Sin registros');
    expect(resumirInstalacionesTerreno([{clasificacion:'INSTALACION_COMPLETADA',visita:{fecha:'2026-10-15'}}])).toEqual({instalacionesProgramadas:0,instalacionesPendientes:0,instalacionesRealizadas:1,instalacionesNoCompletadas:0});
  });

  it('muestra agenda, filtros, pendientes y abre detalle real con OT autorizada',async()=>{
    const base=hoy();const lista=[visita('1',base),visita('2',null,{responsable:null,prioridad:null})];const detalle={...lista[0],resultadoRegistrado:{id:'9',resultado:'Servicio conforme',observaciones:'Recepción firmada'},ordenesRelacionadas:[{id:'44',estado:'LIBERADA'}]};
    vi.stubGlobal('fetch',vi.fn((entrada:string)=>entrada.endsWith('/1')?respuesta(detalle):respuesta(lista)));
    render(<MemoryRouter><AgendaTerreno/></MemoryRouter>);
    expect(await screen.findByText(/2 actividades encontradas/)).toBeInTheDocument();
    expect(screen.getByText('Pendientes de programación')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Responsable'),{target:{value:'SIN_ASIGNAR'}});
    expect(screen.getByText(/1 actividad encontrada/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Limpiar filtros'}));
    fireEvent.click(screen.getByTitle('Ver visita 1'));
    expect(await screen.findByText('Servicio conforme')).toBeInTheDocument();
    expect(screen.getByRole('link',{name:/OT 44/})).toHaveAttribute('href','/terreno/ordenes-trabajo/44');
    expect(screen.getByRole('link',{name:'Abrir detalle operacional de instalación'})).toHaveAttribute('href','/terreno/instalaciones?visita=1');
    await waitFor(()=>expect(fetch).toHaveBeenCalledWith('/api/finanzas/terreno/visitas/1',{credentials:'same-origin'}));
  });
});
