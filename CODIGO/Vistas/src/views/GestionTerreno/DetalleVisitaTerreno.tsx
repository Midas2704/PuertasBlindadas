import { ClipboardList, Truck, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { VisitaTerreno } from './tipos';
import { etiquetaEstado, fechaVisita, horaVisita } from './tipos';

const fechaHumana=(valor:string|null)=>valor?new Date(`${valor}T12:00:00`).toLocaleDateString('es-CL'):'Sin programar';

export default function DetalleVisitaTerreno({visita,cerrar,puedeVerOt}:{visita:VisitaTerreno;cerrar:()=>void;puedeVerOt:boolean}){
  const ordenes=visita.ordenesRelacionadas||[];
  const esInstalacion=(visita.tipoServicio||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().includes('instal');
  return <section aria-label={`Detalle visita ${visita.id}`} className="mt-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
    <div className="mb-5 flex items-center justify-between gap-3 border-b border-gray-100 pb-4"><div><p className="text-xs font-black uppercase tracking-wide text-[#FE8F01]">Visita #{visita.id}</p><h2 className="break-words text-xl font-black">{visita.tipoServicio||'Servicio sin clasificar'}</h2></div><button type="button" title="Cerrar detalle" onClick={cerrar} className="shrink-0 rounded-lg border p-2 text-gray-600 hover:bg-gray-50"><X className="h-4 w-4"/></button></div>
    <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
      <div><dt className="text-[#676767]">Cliente</dt><dd className="font-semibold">{visita.obra?.cliente?.nombre||visita.obra?.cliente?.rut||'Sin cliente'}</dd></div>
      <div><dt className="text-[#676767]">Obra</dt><dd className="font-semibold">{visita.obra?.nombre||visita.obra?.referencia||'Sin obra'}</dd></div>
      <div><dt className="text-[#676767]">Dirección</dt><dd>{[visita.obra?.direccion,visita.obra?.comuna,visita.obra?.region].filter(Boolean).join(', ')||'Sin dirección registrada'}</dd></div>
      <div><dt className="text-[#676767]">Responsable</dt><dd>{visita.responsable?.nombre||'Sin asignar'}</dd></div>
      <div><dt className="text-[#676767]">Fecha</dt><dd>{fechaHumana(fechaVisita(visita.fecha))}</dd></div>
      <div><dt className="text-[#676767]">Horario</dt><dd>{horaVisita(visita.bloqueHorario)||'Sin horario'}</dd></div>
      <div><dt className="text-[#676767]">Estado</dt><dd className="capitalize">{etiquetaEstado(visita.estado)}</dd></div>
      <div><dt className="text-[#676767]">Prioridad</dt><dd>{visita.prioridad||'Sin prioridad'}</dd></div>
      <div className="sm:col-span-2 lg:col-span-4"><dt className="text-[#676767]">Observaciones</dt><dd>{visita.observaciones||'Sin observaciones'}</dd></div>
    </dl>
    <div className="mt-5 grid gap-4 lg:grid-cols-2">
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4"><h3 className="font-black">Resultado registrado</h3>{visita.resultadoRegistrado?<div className="mt-2 text-sm"><p className="font-semibold">{visita.resultadoRegistrado.resultado||'Resultado sin descripción'}</p><p className="mt-1 text-[#676767]">{visita.resultadoRegistrado.observaciones||'Sin observaciones adicionales'}</p></div>:<p className="mt-2 text-sm text-[#676767]">No existe un resultado registrado.</p>}</section>
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-4"><h3 className="font-black">Órdenes relacionadas</h3>{ordenes.length?<div className="mt-2 flex flex-wrap gap-2">{ordenes.map(orden=>puedeVerOt?<Link key={orden.id} to={`/terreno/ordenes-trabajo/${orden.id}`} className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-bold text-orange-800"><ClipboardList className="h-4 w-4"/>OT {orden.id} · {etiquetaEstado(orden.estado)}</Link>:<span key={orden.id} className="rounded-lg border bg-white px-3 py-2 text-sm">OT {orden.id} · {etiquetaEstado(orden.estado)}</span>)}</div>:<p className="mt-2 text-sm text-[#676767]">No existe una OT relacionada mediante una tarea de esta visita.</p>}</section>
    </div>
    {esInstalacion&&ordenes.length>0&&<Link to={`/terreno/instalaciones?visita=${visita.id}`} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-black text-white"><Truck className="h-4 w-4"/>Abrir detalle operacional de instalación</Link>}
  </section>;
}
