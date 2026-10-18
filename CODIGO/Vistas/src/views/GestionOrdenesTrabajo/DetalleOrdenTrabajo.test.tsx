import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import DetalleOrdenTrabajo from './DetalleOrdenTrabajo';

vi.mock('../../seguridad/Sesion',()=>({usarSesion:()=>({sesion:{administrador:true,permisos:['CU205','CU207','CU209','CU212']}})}));
vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn(async()=>({ok:true,json:async()=>detalle}))}));

const detalle={
  idOrdenTrabajo:'44',idUnidad:'4',estado:'LIBERADA',fechaCreacion:'2026-10-15T10:00:00Z',
  cotizacion:{id:10,cliente:'Cliente focal',fecha:'2026-10-01',notaVenta:'NV-10'},
  producto:{nombre:'Puerta Alfa',codigo:'PA',familia:'Blindadas',numeroUnidad:1,caracteristicas:{}},
  referencia:{alto:'2100',ancho:'900',espesor:'90',descripcion:'Puerta de acceso'},rectificacion:null,especificacion:null,medidas:null,medidasObligatorias:[],
  planificacion:{etapas:[]},planificacionInicial:{etapas:[]},versiones:[],liberacion:{id:'1',fecha:'2026-10-15T10:00:00Z',usuario:'Supervisor'},historial:[],
  tareasProduccion:[{id:'5',idEjecutable:'6',titulo:'Fabricar hoja',origen:'PLANIFICACION_APROBADA',ordenEtapa:1,ordenTarea:1,idEtapaPlanificacion:'e1',idEtapaAdicional:null,etapaAdicional:null,estado:'PENDIENTE_VALIDACION',revision:1,prioridad:null,tiempoEstimadoMin:30,instrucciones:null,observaciones:null,fechaPlanificada:null,fechaInicio:null,fechaTermino:null,area:{id:'1',nombre:'Producción'},responsable:{id:2,nombre:'Ana Técnica'},ejecuciones:[{id:'8',estado:'completada',validacion:'validada',fecha:'2026-10-15T11:00:00Z',ejecutor:'Ana Técnica'}],resultadoValidado:{id:'8',estado:'completada',validacion:'validada',fecha:'2026-10-15T11:00:00Z',ejecutor:'Ana Técnica'},cambiosResponsable:[],correcciones:[]}],
  avance:{total:1,pendientes:0,enEjecucion:1,cerradas:0,porcentaje:0,etapas:[{orden:1,nombre:'Fabricación',total:1,cerradas:0}]},
  visitasRelacionadas:[{id:'9',tipoServicio:'Instalación',fecha:'2026-10-16',bloqueHorario:null,prioridad:'alta',estado:'programada',observaciones:null,responsable:{id:'2',acceso:'ana',nombre:'Ana Técnica'},obra:null,resultadoRegistrado:null,ordenesRelacionadas:[{id:'44',estado:'en_progreso'}]}],
  incidencias:[{id:'7',descripcion:'Ajuste requerido',causa:'Medida',estado:'pendiente',estadoRevision:'pendiente_revision',responsabilidad:'Fabricación',fecha:'2026-10-15T12:00:00Z',categoria:'Retrabajo',areaSenalada:'Producción',participante:'Ana Técnica',responsabilidadConfirmada:null,creadoPor:'Supervisor',revisadoPor:null,observacionRevision:null,evidencias:[],tarea:{id:'5',titulo:'Fabricar hoja'}}],
  historialOperacional:[{id:'creacion-4',tipo:'OT_CREADA',detalle:'Orden creada',fecha:'2026-10-15T10:00:00Z',usuario:'Supervisor'}],
  etapasAdicionales:[],historialProduccion:[],cierre:null,catalogos:{areas:[],empleadosTerreno:[],empleadosPorArea:[],tareas:[]},
};

describe('Ficha operativa integral de OT',()=>{
  it('organiza el resumen y no cuenta validación como cierre',async()=>{
    render(<MemoryRouter initialEntries={['/terreno/ordenes-trabajo/44']}><Routes><Route path="/terreno/ordenes-trabajo/:id" element={<DetalleOrdenTrabajo/>}/></Routes></MemoryRouter>);
    expect(await screen.findByText('Cliente focal')).toBeInTheDocument();
    expect(screen.getByRole('link',{name:'Volver a órdenes'})).toHaveAttribute('href','/terreno/ordenes-trabajo');
    expect(screen.getByRole('link',{name:'Inicio de Terreno'})).toHaveAttribute('href','/terreno');
    expect(screen.getByRole('link',{name:'Portal principal'})).toHaveAttribute('href','/');
    expect(screen.getByText('0 de 1 tareas cerradas')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Producción'}));
    expect(screen.getByText(/Resultado validado por Ana Técnica/)).toBeInTheDocument();
    expect(screen.getByText('Pendiente validacion')).toBeInTheDocument();
  });

  it('abre visita y distingue datos de incidencia sin atribuir responsabilidad',async()=>{
    render(<MemoryRouter initialEntries={['/terreno/ordenes-trabajo/44']}><Routes><Route path="/terreno/ordenes-trabajo/:id" element={<DetalleOrdenTrabajo/>}/></Routes></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button',{name:'Visitas (1)'}));
    fireEvent.click(screen.getByRole('button',{name:/Visita #9/}));
    expect(screen.getByText('No existe un resultado registrado.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button',{name:'Incidencias (1)'}));
    expect(screen.getByText('Área inicialmente señalada').nextElementSibling).toHaveTextContent('Producción');
    expect(screen.getByText('No confirmada')).toBeInTheDocument();
    expect(screen.getByRole('link',{name:'Abrir detalle, evidencias y trazabilidad'})).toHaveAttribute('href','/terreno/incidencias?incidencia=7');
  });
});
