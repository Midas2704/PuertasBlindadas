import { ClipboardCheck, ClipboardList, Factory, ListTodo, MapPinned, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { solicitarFinanzas } from '../../api/finanzas';
import { usarSesion } from '../../seguridad/Sesion';

type Orden={estado:string;avance?:{pendientes:number;enEjecucion:number}};
type Tarea={estado:string|null};
type Visita={estado:string|null;fecha:string|null};
type Metricas={rectificacion:number|null;aprobacion:number|null;liberadas:number|null;produccion:number|null;finalizadas:number|null;tareas:number|null;visitas:number|null};
const inicial:Metricas={rectificacion:null,aprobacion:null,liberadas:null,produccion:null,finalizadas:null,tareas:null,visitas:null};
async function consultar<T>(ruta:string):Promise<T>{const respuesta=await solicitarFinanzas(ruta);const datos=await respuesta.json();if(!respuesta.ok)throw new Error(datos.error||'Consulta no disponible');return datos;}
export const resumirOrdenesTerreno=(ordenes:Orden[])=>({
  rectificacion:ordenes.filter(o=>['PENDIENTE_RECTIFICACION','RECTIFICACION_ASIGNADA','RECTIFICACION_EN_PROCESO','RECTIFICACION_DEVUELTA'].includes(o.estado)).length,
  aprobacion:ordenes.filter(o=>o.estado==='PENDIENTE_APROBACION_TECNICA').length,
  liberadas:ordenes.filter(o=>o.estado==='LIBERADA').length,
  produccion:ordenes.filter(o=>o.estado==='EN_PRODUCCION').length,
  finalizadas:ordenes.filter(o=>o.estado==='FINALIZADA').length,
});

export default function InicioTerreno(){
  const {sesion}=usarSesion();const [metricas,setMetricas]=useState(inicial);const [cargando,setCargando]=useState(true);const [advertencia,setAdvertencia]=useState('');
  const tiene=(permisos:string[])=>Boolean(permisos.some(p=>sesion?.permisos.includes(p)));
  const cargar=useCallback(async()=>{setCargando(true);setAdvertencia('');const siguientes={...inicial};let fallos=0;const consultas:Promise<void>[]=[];
    if(tiene(['CU202','CU205','CU207','CU209']))consultas.push(consultar<Orden[]>('/terreno/ordenes-trabajo').then(ordenes=>{Object.assign(siguientes,resumirOrdenesTerreno(ordenes));}).catch(()=>{fallos++;}));
    if(tiene(['CU201','CU208']))consultas.push(consultar<Tarea[]>('/terreno/mis-tareas').then(tareas=>{siguientes.tareas=tareas.filter(t=>!['FINALIZADA','CERRADA'].includes(t.estado||'')).length;}).catch(()=>{fallos++;}));
    if(tiene(['CU199','CU200','CU210','CU211']))consultas.push(consultar<Visita[]>('/terreno/visitas').then(visitas=>{siguientes.visitas=visitas.filter(v=>!['FINALIZADA','CERRADA','CANCELADA'].includes(v.estado||'')).length;}).catch(()=>{fallos++;}));
    await Promise.all(consultas);setMetricas(siguientes);if(fallos)setAdvertencia('Algunos indicadores no pudieron actualizarse. Las funciones disponibles continúan accesibles desde el menú.');setCargando(false);
  },[sesion]);
  useEffect(()=>{void cargar();},[cargar]);
  const tarjetas=[
    {titulo:'OT en rectificación',valor:metricas.rectificacion,icono:ClipboardList,ruta:'/terreno/ordenes-trabajo'},
    {titulo:'Pendientes de aprobación',valor:metricas.aprobacion,icono:ClipboardCheck,ruta:'/terreno/ordenes-trabajo'},
    {titulo:'OT liberadas',valor:metricas.liberadas,icono:ClipboardCheck,ruta:'/terreno/ordenes-trabajo'},
    {titulo:'OT en producción',valor:metricas.produccion,icono:Factory,ruta:'/terreno/ordenes-trabajo'},
    {titulo:'OT finalizadas',valor:metricas.finalizadas,icono:ClipboardCheck,ruta:'/terreno/ordenes-trabajo'},
    {titulo:'Mis tareas pendientes',valor:metricas.tareas,icono:ListTodo,ruta:'/terreno/mis-tareas'},
    {titulo:'Visitas activas',valor:metricas.visitas,icono:MapPinned,ruta:'/terreno/visitas'},
  ].filter(t=>t.valor!==null);
  return <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-7xl">
    <header className="border-t-4 border-[#FE8F01] bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#676767]">Operación</p><h1 className="mt-2 text-3xl font-black">Panel de Terreno</h1><p className="mt-2 text-sm text-[#676767]">Resumen operacional según los accesos de tu cuenta.</p></div><button type="button" onClick={()=>void cargar()} disabled={cargando} className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${cargando?'animate-spin':''}`}/>Actualizar</button></div></header>
    {advertencia&&<p role="alert" className="mt-4 border-l-4 border-orange-500 bg-orange-50 p-4 text-sm text-orange-950">{advertencia}</p>}
    <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{tarjetas.map(t=>{const Icono=t.icono;return <Link key={t.titulo} to={t.ruta} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-[#FE8F01] hover:shadow-md"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold text-[#676767]">{t.titulo}</p><p className="mt-3 text-4xl font-black">{cargando?'—':t.valor}</p></div><span className="rounded-xl bg-orange-100 p-3 text-orange-800"><Icono className="h-6 w-6"/></span></div><p className="mt-5 text-sm font-bold text-orange-700">Ver detalle →</p></Link>})}</section>
    {!cargando&&!tarjetas.length&&<p className="mt-5 rounded-xl border bg-white p-6 text-sm text-[#676767]">No hay indicadores disponibles para los permisos actuales. Utiliza las opciones habilitadas del menú.</p>}
  </div></div>;
}
