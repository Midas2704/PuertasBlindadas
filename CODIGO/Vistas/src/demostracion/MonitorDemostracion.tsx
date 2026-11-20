import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Activity, ArrowDown, Clock3, Code2, Database, Eraser, Filter, Maximize2,
  Monitor, Pause, Play, RotateCcw, Route, ServerCog, ShieldCheck, XCircle,
} from 'lucide-react';
import { CAPAS, claseEstado } from './tipos';
import type { CapaDemostracion, EventoDemostracion } from './tipos';

const LIMITE = 700;
const etiquetaEstado = (estado: EventoDemostracion['estado']) => estado.replace('_', ' ').toLowerCase();
const unicos = (valores: Array<string | undefined>) => [...new Set(valores.filter((valor): valor is string => Boolean(valor)))];
const nombreCapa = (capa: CapaDemostracion) => CAPAS.find(item => item.id === capa)?.etiqueta || capa;
const direccionCapa = (capa: CapaDemostracion) => ['RESPUESTA', 'ACTUALIZACION_VISTA'].includes(capa) ? 'VUELTA' : 'IDA';

function descripcionPaso(evento: EventoDemostracion) {
  switch (evento.capa) {
    case 'INTERACCION': return `Usuario inicia ${evento.operacion} desde la interfaz.`;
    case 'VISTA_REACT': return `React captura la acción en ${evento.vista || 'la vista activa'}.`;
    case 'CLIENTE_API': return 'solicitarFinanzas() prepara la petición HTTP y su contexto.';
    case 'RUTA_BACKEND': return `Express recibe ${evento.metodo || ''} ${evento.ruta || ''}.`;
    case 'SEGURIDAD_M4': return evento.permiso ? `M4 valida sesión, alcance y ${evento.permiso}.` : 'M4 valida sesión, alcance y permisos funcionales.';
    case 'CONTROLADOR': return `C_Finanzas deriva la operación hacia ${evento.controlador || 'el controlador del módulo'}.`;
    case 'REGLAS_NEGOCIO': return `El módulo ${evento.modulo} ejecuta validaciones y reglas de negocio.`;
    case 'PRISMA': return `Prisma ejecuta ${evento.detalle || evento.accionDatos || 'la consulta requerida'}.`;
    case 'POSTGRESQL': return evento.tabla ? `PostgreSQL ejecuta ${evento.accionDatos || 'la operación'} sobre la tabla ${evento.tabla}.` : 'PostgreSQL confirma la consulta o transacción.';
    case 'AUDITORIA_M9': return 'M9 evalúa integridad, trazabilidad y persistencia de auditoría.';
    case 'RESPUESTA': return `Express devuelve ${evento.resultado || 'la respuesta HTTP'} al navegador.`;
    case 'ACTUALIZACION_VISTA': return `React recibe el resultado y actualiza ${evento.vista || 'la vista activa'}.`;
  }
}

function componentePaso(evento: EventoDemostracion) {
  switch (evento.capa) {
    case 'INTERACCION': return 'Usuario';
    case 'VISTA_REACT': return evento.vista || 'React';
    case 'CLIENTE_API': return 'solicitarFinanzas()';
    case 'RUTA_BACKEND': return `${evento.metodo || 'HTTP'} ${evento.ruta || 'API'}`;
    case 'SEGURIDAD_M4': return 'M4Controller';
    case 'CONTROLADOR': return `C_Finanzas → ${evento.controlador || evento.modulo}`;
    case 'REGLAS_NEGOCIO': return `Reglas ${evento.modulo}`;
    case 'PRISMA': return evento.detalle || 'Prisma Client';
    case 'POSTGRESQL': return evento.tabla ? `Tabla: ${evento.tabla}` : 'PostgreSQL';
    case 'AUDITORIA_M9': return 'Productor M9';
    case 'RESPUESTA': return evento.resultado || 'Respuesta HTTP';
    case 'ACTUALIZACION_VISTA': return evento.vista || 'React';
  }
}

function compactarPasos(eventos: EventoDemostracion[]) {
  const claves: string[] = [];
  const finales = new Map<string, EventoDemostracion>();
  for (const evento of eventos) {
    const clave = [evento.capa, evento.titulo, evento.detalle, evento.tabla].join('|');
    if (!finales.has(clave)) claves.push(clave);
    finales.set(clave, evento);
  }
  return claves.map(clave => finales.get(clave)!).filter(Boolean);
}

export default function MonitorDemostracion() {
  const [eventos, setEventos] = useState<EventoDemostracion[]>([]);
  const [conectado, setConectado] = useState(false);
  const [capturando, setCapturando] = useState(true);
  const capturandoRef = useRef(true);
  const [mostrarCodigo, setMostrarCodigo] = useState(true);
  const [modulo, setModulo] = useState('TODOS');
  const [solicitud, setSolicitud] = useState('TODAS');
  const [operacion, setOperacion] = useState('TODAS');

  useEffect(() => { capturandoRef.current = capturando; }, [capturando]);
  useEffect(() => {
    const fuente = new EventSource('/api/demostracion/eventos');
    fuente.addEventListener('conectado', evento => {
      const iniciales = (JSON.parse((evento as MessageEvent).data) as {eventos: EventoDemostracion[]}).eventos;
      setEventos(iniciales.slice(-LIMITE));
      setConectado(true);
    });
    fuente.addEventListener('traza', evento => {
      if (!capturandoRef.current) return;
      const nuevo = JSON.parse((evento as MessageEvent).data) as EventoDemostracion;
      setEventos(actuales => [...actuales, nuevo].slice(-LIMITE));
      setConectado(true);
    });
    fuente.onerror = () => setConectado(false);
    return () => fuente.close();
  }, []);

  const opciones = (campo: 'modulo' | 'solicitudId' | 'operacion') => [...new Set(eventos.map(evento => evento[campo]).filter(Boolean))].sort();
  const visibles = useMemo(() => eventos.filter(evento =>
    (modulo === 'TODOS' || evento.modulo === modulo) &&
    (solicitud === 'TODAS' || evento.solicitudId === solicitud) &&
    (operacion === 'TODAS' || evento.operacion === operacion),
  ), [eventos, modulo, solicitud, operacion]);
  const solicitudActiva = solicitud === 'TODAS' ? visibles.at(-1)?.solicitudId : solicitud;
  const recorrido = visibles.filter(evento => !solicitudActiva || evento.solicitudId === solicitudActiva);
  const pasos = compactarPasos(recorrido);
  const ultimo = recorrido.at(-1);
  const primero = recorrido[0];
  const controladores = unicos(['C_Finanzas', ...recorrido.map(evento => evento.controlador)]);
  const tablas = unicos(recorrido.map(evento => evento.tabla));
  const consultas = unicos(recorrido.filter(evento => evento.capa === 'PRISMA').map(evento => evento.detalle));
  const respuesta = [...recorrido].reverse().find(evento => evento.capa === 'RESPUESTA');
  const inicioMs = primero ? new Date(primero.ocurridoEn).getTime() : 0;
  const finMs = ultimo ? new Date(ultimo.ocurridoEn).getTime() : 0;
  const duracionTotal = primero && ultimo ? Math.max(0, finMs - inicioMs) : 0;
  const ultimoPorCapa = new Map<CapaDemostracion, EventoDemostracion>();
  recorrido.forEach(evento => ultimoPorCapa.set(evento.capa, evento));
  const errores = visibles.filter(evento => ['ERROR', 'RECHAZADO', 'ROLLBACK'].includes(evento.estado));
  const limpiar = async () => { await fetch('/api/demostracion/eventos', {method: 'DELETE'}); setEventos([]); };
  const pantallaCompleta = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();

  return <main className="min-h-screen bg-[#f4f4f3] text-black">
    <header className="sticky top-0 z-20 border-b border-black/10 bg-black text-white shadow-lg">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-7">
        <div className="flex items-center gap-3"><span className="rounded-xl bg-[#FE8F01] p-2.5 text-black"><Activity className="h-6 w-6"/></span><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#FE8F01]">Modo local</p><h1 className="text-xl font-black sm:text-2xl">Demostración técnica</h1></div></div>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 text-xs font-black ${conectado ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-200'}`}>{conectado ? 'En tiempo real' : 'Reconectando…'}</span>
          <button className="demo-btn" onClick={() => setCapturando(valor => !valor)}>{capturando ? <Pause/> : <Play/>}{capturando ? 'Pausar' : 'Reanudar'}</button>
          <button className="demo-btn" onClick={() => void limpiar()}><Eraser/>Limpiar</button>
          <button className="demo-btn" onClick={pantallaCompleta}><Maximize2/>Pantalla completa</button>
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-[1800px] space-y-5 p-4 lg:p-7">
      <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center gap-3"><Filter className="h-5 w-5 text-[#FE8F01]"/><strong>Filtros</strong>
          <select aria-label="Filtrar por módulo" value={modulo} onChange={evento => setModulo(evento.target.value)} className="demo-select"><option value="TODOS">Todos los módulos</option>{opciones('modulo').map(valor => <option key={valor}>{valor}</option>)}</select>
          <select aria-label="Filtrar por operación" value={operacion} onChange={evento => setOperacion(evento.target.value)} className="demo-select"><option value="TODAS">Todas las operaciones</option>{opciones('operacion').map(valor => <option key={valor}>{valor}</option>)}</select>
          <select aria-label="Filtrar por solicitud" value={solicitud} onChange={evento => setSolicitud(evento.target.value)} className="demo-select max-w-sm"><option value="TODAS">Solicitud más reciente</option>{opciones('solicitudId').map(valor => <option key={valor} value={valor}>{valor}</option>)}</select>
          <button className="demo-btn-light" onClick={() => { setModulo('TODOS'); setSolicitud('TODAS'); setOperacion('TODAS'); }}><RotateCcw/>Restablecer</button>
          <button className="demo-btn-light" onClick={() => setMostrarCodigo(valor => !valor)}><Code2/>{mostrarCodigo ? 'Ocultar' : 'Mostrar'} código</button>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
          {CAPAS.map((capa, indice) => { const evento = ultimoPorCapa.get(capa.id); const estado = evento?.estado || 'PENDIENTE'; return <div key={capa.id} className={`relative min-h-28 rounded-xl border-2 p-3 transition-all duration-300 ${claseEstado(estado)}`}>
            <div className="flex items-start justify-between gap-2"><span className="text-[10px] font-black uppercase tracking-wider">{indice + 1}. {capa.etiqueta}</span>{indice < CAPAS.length - 1 && <span aria-hidden className="text-lg">→</span>}</div>
            <p className="mt-3 text-xs font-bold capitalize">{etiquetaEstado(estado)}</p>{evento?.duracionMs !== undefined && <p className="mt-1 text-xs">{evento.duracionMs} ms</p>}
          </div>; })}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border-2 border-[#FE8F01] bg-white shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-black px-5 py-4 text-white">
          <div><p className="text-xs font-black uppercase tracking-[.18em] text-[#FE8F01]">Operación seleccionada</p><h2 className="mt-1 text-xl font-black">Recorrido completo de ida y vuelta</h2></div>
          {ultimo && <div className="text-right text-xs"><p className="font-black">{ultimo.modulo} · {ultimo.operacion}</p><p className="mt-1 text-gray-300">Solicitud {ultimo.solicitudId}</p></div>}
        </div>
        {!ultimo ? <div className="p-8 text-center text-[#676767]"><Route className="mx-auto mb-3 h-9 w-9 text-[#FE8F01]"/><p className="font-bold text-black">Realiza una operación en la otra ventana.</p><p className="mt-1 text-sm">Aquí aparecerán la vista, controladores, consultas, tablas y respuesta en su orden real.</p></div> : <div className="space-y-6 p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Resumen icono={<Monitor/>} titulo="Origen" principal={primero?.vista || ultimo.vista || 'Vista React'} secundario={`${ultimo.metodo || ''} ${ultimo.ruta || ''}`}/>
            <Resumen icono={<ShieldCheck/>} titulo="Seguridad M4" principal={ultimo.permiso || 'Sesión y alcance funcional'} secundario="Validación previa al controlador"/>
            <Resumen icono={<ServerCog/>} titulo="Controladores" principal={controladores.join(' → ')} secundario="Orden de derivación interno"/>
            <Resumen icono={<Clock3/>} titulo="Resultado" principal={respuesta?.resultado || ultimo.resultado || ultimo.estado} secundario={`Recorrido observado: ${duracionTotal} ms`}/>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,.32fr)]">
            <div>
              <div className="mb-3 flex items-center justify-between"><h3 className="font-black">Pasos ejecutados en orden real</h3><span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-black text-orange-900">{pasos.length} pasos</span></div>
              <ol className="space-y-2">
                {pasos.map((evento, indice) => <li key={`${evento.id}-${indice}`} className="grid grid-cols-[34px_minmax(0,1fr)] gap-3">
                  <div className="flex flex-col items-center"><span className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-black ${claseEstado(evento.estado)}`}>{indice + 1}</span>{indice < pasos.length - 1 && <span className="my-1 min-h-5 w-px flex-1 bg-gray-300"/>}</div>
                  <div className="mb-1 rounded-xl border border-gray-200 p-3 transition hover:border-[#FE8F01]">
                    <div className="flex flex-wrap items-start justify-between gap-2"><div><span className="text-[10px] font-black uppercase tracking-wider text-[#FE8F01]">{direccionCapa(evento.capa)} · {nombreCapa(evento.capa)}</span><p className="mt-1 font-black">{componentePaso(evento)}</p></div><div className="text-right text-xs"><span className={`rounded-full border px-2 py-1 font-black uppercase ${claseEstado(evento.estado)}`}>{evento.estado}</span>{evento.duracionMs !== undefined && <p className="mt-2 font-bold">{evento.duracionMs} ms</p>}</div></div>
                    <p className="mt-2 text-sm text-[#4b4b4b]">{descripcionPaso(evento)}</p>
                    {evento.tabla && <span className="mt-2 inline-flex items-center gap-1 rounded-md bg-black px-2 py-1 text-xs font-bold text-white"><Database className="h-3.5 w-3.5"/>{evento.tabla} · {evento.accionDatos}</span>}
                    {mostrarCodigo && evento.codigo && <code className="mt-2 block overflow-x-auto rounded-lg bg-black p-2 text-xs text-orange-300">{evento.codigo}</code>}
                  </div>
                </li>)}
              </ol>
            </div>
            <aside className="space-y-3">
              <div className="rounded-xl border border-gray-200 p-4"><div className="flex items-center gap-2"><Database className="h-5 w-5 text-[#FE8F01]"/><h3 className="font-black">Persistencia real</h3></div><p className="mt-3 text-xs font-bold uppercase text-[#676767]">Tablas PostgreSQL</p>{tablas.length ? <div className="mt-2 flex flex-wrap gap-2">{tablas.map(tabla => <span key={tabla} className="rounded-md bg-black px-2 py-1 font-mono text-xs text-white">{tabla}</span>)}</div> : <p className="mt-2 text-sm text-[#676767]">Esta operación no consultó tablas.</p>}<p className="mt-4 text-xs font-bold uppercase text-[#676767]">Consultas Prisma</p>{consultas.length ? <ul className="mt-2 space-y-1 text-xs">{consultas.map(consulta => <li key={consulta} className="rounded bg-gray-100 px-2 py-1 font-mono">{consulta}</li>)}</ul> : <p className="mt-2 text-sm text-[#676767]">Sin consultas Prisma.</p>}</div>
              <div className="rounded-xl border border-gray-200 p-4"><h3 className="font-black">Resumen técnico</h3><dl className="mt-3 space-y-3 text-sm"><div><dt className="text-xs font-bold uppercase text-[#676767]">Operación</dt><dd>{ultimo.operacion}</dd></div><div><dt className="text-xs font-bold uppercase text-[#676767]">Módulo</dt><dd>{ultimo.modulo}</dd></div><div><dt className="text-xs font-bold uppercase text-[#676767]">Ruta</dt><dd className="break-all font-mono text-xs">{ultimo.metodo} {ultimo.ruta}</dd></div><div><dt className="text-xs font-bold uppercase text-[#676767]">Solicitud</dt><dd className="break-all font-mono text-xs">{ultimo.solicitudId}</dd></div></dl></div>
            </aside>
          </div>
        </div>}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3"><h2 className="font-black">Línea de tiempo detallada</h2><span className="text-xs text-[#676767]">{visibles.length} eventos</span></div>
          <div className="max-h-[58vh] overflow-auto">
            {visibles.length === 0 ? <p className="p-8 text-center text-[#676767]">Realiza una operación en la otra ventana para ver su recorrido real.</p> : <ol className="divide-y divide-gray-100">
              {[...visibles].reverse().map(evento => <li key={evento.id} className="grid gap-2 p-4 text-sm md:grid-cols-[92px_120px_minmax(0,1fr)_90px]">
                <div><span className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-black uppercase ${claseEstado(evento.estado)}`}>{evento.estado}</span></div>
                <div><p className="font-black">{evento.modulo}</p><p className="text-xs text-[#676767]">{evento.capa}</p></div>
                <div className="min-w-0"><p className="font-bold">{evento.titulo}</p><p className="break-words text-xs text-[#676767]">{evento.detalle || evento.resultado || evento.ruta}</p>{evento.tabla && <p className="mt-1 text-xs font-bold">Tabla: {evento.tabla}</p>}{mostrarCodigo && evento.codigo && <code className="mt-2 block overflow-x-auto rounded-lg bg-black p-2 text-xs text-orange-300">{evento.codigo}</code>}<p className="mt-1 truncate text-[10px] text-gray-400">{evento.solicitudId}</p></div>
                <div className="text-right text-xs"><p>{new Date(evento.ocurridoEn).toLocaleTimeString()}</p><p className="mt-1 font-bold">{evento.duracionMs === undefined ? '—' : `${evento.duracionMs} ms`}</p></div>
              </li>)}
            </ol>}
          </div>
        </div>
        <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center gap-2"><XCircle className="h-5 w-5 text-red-600"/><h2 className="font-black">Errores y rechazos</h2></div><p className="mt-3 text-3xl font-black">{errores.length}</p><div className="mt-3 max-h-72 space-y-2 overflow-auto">{errores.slice(-8).reverse().map(evento => <div key={evento.id} className="rounded-lg border border-red-100 bg-red-50 p-3 text-xs"><strong>{evento.estado} · {evento.modulo}</strong><p className="mt-1">{evento.resultado || evento.detalle || evento.titulo}</p></div>)}</div></aside>
      </section>
      <p className="flex items-center justify-center gap-2 pb-2 text-center text-xs text-[#676767]"><ArrowDown className="h-4 w-4"/>El recorrido se construye únicamente con eventos observados en esta instalación local.</p>
    </div>
  </main>;
}

function Resumen({icono, titulo, principal, secundario}: {icono: ReactNode; titulo: string; principal: string; secundario: string}) {
  return <div className="rounded-xl border border-gray-200 bg-gray-50 p-4"><div className="flex items-center gap-2 text-xs font-black uppercase text-[#676767]"><span className="text-[#FE8F01] [&>svg]:h-4 [&>svg]:w-4">{icono}</span>{titulo}</div><p className="mt-2 break-words font-bold">{principal}</p><p className="mt-1 text-xs text-[#676767]">{secundario}</p></div>;
}
