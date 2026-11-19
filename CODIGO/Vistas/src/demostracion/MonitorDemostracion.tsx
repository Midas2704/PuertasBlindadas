import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, Code2, Eraser, Filter, Maximize2, Pause, Play, RotateCcw, XCircle } from 'lucide-react';
import { CAPAS, claseEstado } from './tipos';
import type { CapaDemostracion, EventoDemostracion } from './tipos';

const LIMITE = 700;
const etiquetaEstado = (estado: EventoDemostracion['estado']) => estado.replace('_',' ').toLowerCase();

export default function MonitorDemostracion() {
  const [eventos,setEventos] = useState<EventoDemostracion[]>([]);
  const [conectado,setConectado] = useState(false);
  const [capturando,setCapturando] = useState(true);
  const capturandoRef = useRef(true);
  const [mostrarCodigo,setMostrarCodigo] = useState(true);
  const [modulo,setModulo] = useState('TODOS');
  const [solicitud,setSolicitud] = useState('TODAS');
  const [operacion,setOperacion] = useState('TODAS');

  useEffect(()=>{capturandoRef.current=capturando;},[capturando]);
  useEffect(()=>{
    const fuente = new EventSource('/api/demostracion/eventos');
    fuente.addEventListener('conectado',(evento)=>{
      const iniciales=(JSON.parse((evento as MessageEvent).data) as {eventos:EventoDemostracion[]}).eventos;
      setEventos(iniciales.slice(-LIMITE)); setConectado(true);
    });
    fuente.addEventListener('traza',(evento)=>{
      if(!capturandoRef.current)return;
      const nuevo=JSON.parse((evento as MessageEvent).data) as EventoDemostracion;
      setEventos(actuales=>[...actuales,nuevo].slice(-LIMITE)); setConectado(true);
    });
    fuente.onerror=()=>setConectado(false);
    return()=>fuente.close();
  },[]);

  const opciones=(campo:'modulo'|'solicitudId'|'operacion')=>[...new Set(eventos.map(e=>e[campo]).filter(Boolean))].sort();
  const visibles=useMemo(()=>eventos.filter(e=>(modulo==='TODOS'||e.modulo===modulo)&&(solicitud==='TODAS'||e.solicitudId===solicitud)&&(operacion==='TODAS'||e.operacion===operacion)),[eventos,modulo,solicitud,operacion]);
  const solicitudActiva=solicitud==='TODAS' ? visibles.at(-1)?.solicitudId : solicitud;
  const recorrido=visibles.filter(e=>!solicitudActiva||e.solicitudId===solicitudActiva);
  const ultimoPorCapa=new Map<CapaDemostracion,EventoDemostracion>();
  recorrido.forEach(e=>ultimoPorCapa.set(e.capa,e));
  const errores=visibles.filter(e=>['ERROR','RECHAZADO','ROLLBACK'].includes(e.estado));
  const limpiar=async()=>{await fetch('/api/demostracion/eventos',{method:'DELETE'});setEventos([]);};
  const pantallaCompleta=()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();

  return <main className="min-h-screen bg-[#f4f4f3] text-black">
    <header className="sticky top-0 z-20 border-b border-black/10 bg-black text-white shadow-lg">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-7">
        <div className="flex items-center gap-3"><span className="rounded-xl bg-[#FE8F01] p-2.5 text-black"><Activity className="h-6 w-6"/></span><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#FE8F01]">Modo local</p><h1 className="text-xl font-black sm:text-2xl">Demostración técnica</h1></div></div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-black ${conectado?'bg-emerald-500/20 text-emerald-300':'bg-red-500/20 text-red-200'}`}>{conectado?'En tiempo real':'Reconectando…'}</span>
          <button className="demo-btn" onClick={()=>setCapturando(v=>!v)}>{capturando?<Pause/>:<Play/>}{capturando?'Pausar':'Reanudar'}</button>
          <button className="demo-btn" onClick={()=>void limpiar()}><Eraser/>Limpiar</button>
          <button className="demo-btn" onClick={pantallaCompleta}><Maximize2/>Pantalla completa</button>
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-[1800px] space-y-5 p-4 lg:p-7">
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-3"><Filter className="h-5 w-5 text-[#FE8F01]"/><strong>Filtros</strong>
          <select aria-label="Filtrar por módulo" value={modulo} onChange={e=>setModulo(e.target.value)} className="demo-select"><option value="TODOS">Todos los módulos</option>{opciones('modulo').map(v=><option key={v}>{v}</option>)}</select>
          <select aria-label="Filtrar por operación" value={operacion} onChange={e=>setOperacion(e.target.value)} className="demo-select"><option value="TODAS">Todas las operaciones</option>{opciones('operacion').map(v=><option key={v}>{v}</option>)}</select>
          <select aria-label="Filtrar por solicitud" value={solicitud} onChange={e=>setSolicitud(e.target.value)} className="demo-select max-w-sm"><option value="TODAS">Solicitud más reciente</option>{opciones('solicitudId').map(v=><option key={v} value={v}>{v}</option>)}</select>
          <button className="demo-btn-light" onClick={()=>{setModulo('TODOS');setSolicitud('TODAS');setOperacion('TODAS')}}><RotateCcw/>Restablecer</button>
          <button className="demo-btn-light" onClick={()=>setMostrarCodigo(v=>!v)}><Code2/>{mostrarCodigo?'Ocultar':'Mostrar'} código</button>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
          {CAPAS.map((capa,indice)=>{const evento=ultimoPorCapa.get(capa.id);const estado=evento?.estado||'PENDIENTE';return <div key={capa.id} className={`relative min-h-28 rounded-xl border-2 p-3 transition-all duration-300 ${claseEstado(estado)}`}>
            <div className="flex items-start justify-between gap-2"><span className="text-[10px] font-black uppercase tracking-wider">{indice+1}. {capa.etiqueta}</span>{indice<CAPAS.length-1&&<span aria-hidden className="text-lg">→</span>}</div>
            <p className="mt-3 text-xs font-bold capitalize">{etiquetaEstado(estado)}</p>{evento?.duracionMs!==undefined&&<p className="mt-1 text-xs">{evento.duracionMs} ms</p>}
          </div>})}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,.7fr)]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3"><h2 className="font-black">Línea de tiempo</h2><span className="text-xs text-[#676767]">{visibles.length} eventos</span></div>
          <div className="max-h-[58vh] overflow-auto">
            {visibles.length===0?<p className="p-8 text-center text-[#676767]">Realiza una operación en la otra ventana para ver su recorrido real.</p>:<ol className="divide-y divide-gray-100">
              {[...visibles].reverse().map(e=><li key={e.id} className="grid gap-2 p-4 text-sm md:grid-cols-[92px_120px_minmax(0,1fr)_90px]">
                <div><span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black uppercase ${claseEstado(e.estado)}`}>{e.estado}</span></div>
                <div><p className="font-black">{e.modulo}</p><p className="text-xs text-[#676767]">{e.capa}</p></div>
                <div className="min-w-0"><p className="font-bold">{e.titulo}</p><p className="break-words text-xs text-[#676767]">{e.detalle||e.resultado||e.ruta}</p>{mostrarCodigo&&e.codigo&&<code className="mt-2 block overflow-x-auto rounded-lg bg-black p-2 text-xs text-orange-300">{e.codigo}</code>}<p className="mt-1 truncate text-[10px] text-gray-400">{e.solicitudId}</p></div>
                <div className="text-right text-xs"><p>{new Date(e.ocurridoEn).toLocaleTimeString()}</p><p className="mt-1 font-bold">{e.duracionMs===undefined?'—':`${e.duracionMs} ms`}</p></div>
              </li>)}
            </ol>}
          </div>
        </div>
        <aside className="space-y-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><h2 className="font-black">Operación seleccionada</h2>{recorrido.at(-1)?<dl className="mt-4 space-y-3 text-sm">
            <div><dt className="text-xs font-bold uppercase text-[#676767]">Solicitud</dt><dd className="break-all font-mono text-xs">{recorrido.at(-1)?.solicitudId}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-[#676767]">Módulo / operación</dt><dd>{recorrido.at(-1)?.modulo} · {recorrido.at(-1)?.operacion}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-[#676767]">Vista / controlador</dt><dd>{recorrido.at(-1)?.vista}<br/>{recorrido.at(-1)?.controlador}</dd></div>
            <div><dt className="text-xs font-bold uppercase text-[#676767]">Permisos M4</dt><dd>{recorrido.at(-1)?.permiso||'Sin permiso funcional declarado'}</dd></div>
          </dl>:<p className="mt-3 text-sm text-[#676767]">Sin operación activa.</p>}</div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><XCircle className="h-5 w-5 text-red-600"/><h2 className="font-black">Errores y rechazos</h2></div><p className="mt-3 text-3xl font-black">{errores.length}</p><div className="mt-3 max-h-56 space-y-2 overflow-auto">{errores.slice(-8).reverse().map(e=><div key={e.id} className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs"><strong>{e.estado} · {e.modulo}</strong><p className="mt-1">{e.resultado||e.detalle||e.titulo}</p></div>)}</div></div>
        </aside>
      </section>
    </div>
  </main>;
}
