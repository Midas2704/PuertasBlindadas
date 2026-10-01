import { CircleAlert, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EncabezadoM7, Periodo, usarConsultaM7 } from './componentes';

type Excepcion = { familia:string; ocurrio:string; magnitud:unknown; calidad:string; destino?:string; origen:string };

export default function CentroAtencionM7(){
 const q=usarConsultaM7('/dashboard-m7/centro-atencion');const excepciones=(q.datos?.excepciones||[]) as Excepcion[];const cobertura=(q.datos?.cobertura||[]) as Array<{familia:string;estado:string;detalle:string}>;
 return <div className="min-h-full bg-gray-100"><EncabezadoM7 titulo="Centro de Atención Gerencial" descripcion="Excepciones objetivas que requieren revisión; sin score ni decisiones automáticas" regreso={q.global}/><Periodo anio={q.anio} mes={q.mes} cambiar={q.cambiar} cargando={q.cargando} recargar={q.recargar}/>
 {q.error&&<p role="alert" className="border-y border-red-200 bg-red-50 px-5 py-4 text-red-800">{q.error}</p>}
 <main className="mx-auto max-w-7xl divide-y divide-gray-200 bg-white">{!q.cargando&&!excepciones.length&&<p className="px-5 py-10 text-sm text-gray-500">No existen excepciones visibles con las fuentes y permisos disponibles.</p>}{excepciones.map((item,indice)=><section key={`${item.familia}-${indice}`} className="px-5 py-5 sm:px-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-semibold uppercase text-amber-700"><CircleAlert className="h-4 w-4"/>{item.familia.replaceAll('_',' ')}</p><h2 className="mt-2 font-bold text-gray-950">{item.ocurrio}</h2><p className="mt-1 text-sm text-gray-500">Origen: {item.origen} · Calidad: {item.calidad.replaceAll('_',' ')}</p><pre className="mt-3 whitespace-pre-wrap text-sm text-gray-700">{JSON.stringify(item.magnitud,null,2)}</pre></div>{item.destino&&<Link to={item.destino} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-700">Revisar origen<ExternalLink className="h-4 w-4"/></Link>}</div></section>)}</main>
 {!!cobertura.length&&<section className="mx-auto max-w-7xl border-t border-gray-200 bg-white px-5 py-5 sm:px-8"><h2 className="font-bold">Cobertura</h2><div className="mt-3 space-y-2">{cobertura.map(item=><p key={item.familia} className="text-sm text-gray-600"><strong>{item.familia.replaceAll('_',' ')}:</strong> {item.estado.replaceAll('_',' ')} · {item.detalle}</p>)}</div></section>}
 </div>;
}
