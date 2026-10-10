import { useEffect, useState, type FormEvent } from 'react';
import { CalendarDays, RefreshCw } from 'lucide-react';
import { ControlSegmentado } from './componentes';

export type ModoTemporalVentas = 'mes' | 'rango' | 'comparar';
export type FiltrosTemporalesVentas = { modo: ModoTemporalVentas; desde: string; hasta: string; desdeA: string; hastaA: string; desdeB: string; hastaB: string };
export type ContextoTemporalM7 = FiltrosTemporalesVentas & { anio: number; mes: number; segmento: 'TODOS' | 'B2B' | 'B2C' };

const fechaMes = (anio: number, mes: number, ultimo = false) => ultimo
  ? new Date(Date.UTC(anio, mes, 0)).toISOString().slice(0, 10)
  : `${anio}-${String(mes).padStart(2, '0')}-01`;

export function leerFiltrosTemporalesVentas(busqueda: string, anio: number, mes: number): FiltrosTemporalesVentas {
  const q = new URLSearchParams(busqueda); const declarado = q.get('modo');
  const modo: ModoTemporalVentas = declarado === 'comparar' ? 'comparar' : declarado === 'rango' || (q.has('desde') && q.has('hasta')) ? 'rango' : 'mes';
  const anterior = new Date(Date.UTC(anio, mes - 2, 1));
  return {
    modo,
    desde: q.get('desde') || fechaMes(anio, mes), hasta: q.get('hasta') || fechaMes(anio, mes, true),
    desdeA: q.get('desdeA') || fechaMes(anterior.getUTCFullYear(), anterior.getUTCMonth() + 1), hastaA: q.get('hastaA') || fechaMes(anterior.getUTCFullYear(), anterior.getUTCMonth() + 1, true),
    desdeB: q.get('desdeB') || fechaMes(anio, mes), hastaB: q.get('hastaB') || fechaMes(anio, mes, true),
  };
}

export function parametrosTemporalesVentas(filtros: FiltrosTemporalesVentas): Record<string, string> {
  if (filtros.modo === 'rango') return { modo: 'rango', desde: filtros.desde, hasta: filtros.hasta };
  if (filtros.modo === 'comparar') return { modo: 'comparar', desdeA: filtros.desdeA, hastaA: filtros.hastaA, desdeB: filtros.desdeB, hastaB: filtros.hastaB };
  return { modo: 'mes' };
}

export function leerContextoTemporalM7(busqueda: string, anioPredeterminado: number, mesPredeterminado: number): ContextoTemporalM7 {
  const q = new URLSearchParams(busqueda);
  const anio = Number(q.get('anio')) || anioPredeterminado;
  const mesLeido = Number(q.get('mes')) || mesPredeterminado;
  const mes = Number.isInteger(mesLeido) && mesLeido >= 1 && mesLeido <= 12 ? mesLeido : mesPredeterminado;
  const segmentoLeido = String(q.get('segmento') || 'TODOS').toUpperCase();
  const segmento = (['B2B', 'B2C'].includes(segmentoLeido) ? segmentoLeido : 'TODOS') as ContextoTemporalM7['segmento'];
  return { anio, mes, segmento, ...leerFiltrosTemporalesVentas(busqueda, anio, mes) };
}

export function parametrosContextoTemporalM7(contexto: ContextoTemporalM7): Record<string, string> {
  return { anio: String(contexto.anio), mes: String(contexto.mes), segmento: contexto.segmento, ...parametrosTemporalesVentas(contexto) };
}

const fechaHumana = (valor: string) => new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${valor}T00:00:00Z`));
export function etiquetaContextoTemporalM7(contexto: ContextoTemporalM7) {
  const segmento = contexto.segmento === 'TODOS' ? 'Todos' : contexto.segmento;
  if (contexto.modo === 'rango') return `${fechaHumana(contexto.desde)} – ${fechaHumana(contexto.hasta)} · ${segmento}`;
  if (contexto.modo === 'comparar') return `Comparando: ${fechaHumana(contexto.desdeA)} – ${fechaHumana(contexto.hastaA)} vs. ${fechaHumana(contexto.desdeB)} – ${fechaHumana(contexto.hastaB)} · ${segmento}`;
  const periodo = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date(contexto.anio, contexto.mes - 1, 1));
  return `${periodo.charAt(0).toUpperCase()}${periodo.slice(1)} · ${segmento}`;
}

const fechaValida = (valor: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00Z`);
  return Number.isFinite(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor;
};
const rangoValido = (desde: string, hasta: string) => fechaValida(desde) && fechaValida(hasta) && desde <= hasta;

export function FiltroTemporalVentas({ valor, cambiar, cargando = false }: { valor: FiltrosTemporalesVentas; cambiar: (filtros: FiltrosTemporalesVentas) => void; cargando?: boolean }) {
  const [borrador, setBorrador] = useState(valor); const [error, setError] = useState('');
  useEffect(() => setBorrador(valor), [valor]);
  const seleccionarModo = (modo: string) => { const siguiente = { ...borrador, modo: modo as ModoTemporalVentas }; setBorrador(siguiente); setError(''); if (modo === 'mes') cambiar(siguiente); };
  const aplicar = (evento: FormEvent) => {
    evento.preventDefault();
    const valido = borrador.modo === 'rango' ? rangoValido(borrador.desde, borrador.hasta) : borrador.modo === 'comparar' ? rangoValido(borrador.desdeA, borrador.hastaA) && rangoValido(borrador.desdeB, borrador.hastaB) : true;
    if (!valido) { setError('Revisa las fechas: cada “Desde” debe ser anterior o igual a su “Hasta”.'); return; }
    setError(''); cambiar(borrador);
  };
  const campo = (etiqueta: string, clave: keyof FiltrosTemporalesVentas) => <label className="min-w-0 text-xs font-bold uppercase text-gray-500"><span>{etiqueta}</span><input aria-label={etiqueta} type="date" value={String(borrador[clave])} onChange={e => setBorrador(actual => ({ ...actual, [clave]: e.target.value }))} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900" /></label>;
  return <form onSubmit={aplicar} className="space-y-3">
    <ControlSegmentado etiqueta="Período de análisis" valor={borrador.modo} cambiar={seleccionarModo} opciones={[{ valor: 'mes', etiqueta: 'Mes' }, { valor: 'rango', etiqueta: 'Rango' }, { valor: 'comparar', etiqueta: 'Comparar períodos' }]} />
    {borrador.modo !== 'mes' && <div className="flex items-start gap-2 border-t border-gray-100 pt-3"><CalendarDays className="mt-6 h-5 w-5 shrink-0 text-[#FE8F01]"/><div className="grid min-w-0 flex-1 gap-3 lg:grid-cols-2">
      {borrador.modo === 'rango' ? <div className="grid gap-2 sm:grid-cols-2">{campo('Desde', 'desde')}{campo('Hasta', 'hasta')}</div> : <><fieldset className="grid gap-2 rounded-md bg-gray-50 p-3 sm:grid-cols-2"><legend className="px-1 text-xs font-black text-gray-700">PERÍODO A</legend>{campo('Desde A', 'desdeA')}{campo('Hasta A', 'hastaA')}</fieldset><fieldset className="grid gap-2 rounded-md bg-orange-50/60 p-3 sm:grid-cols-2"><legend className="px-1 text-xs font-black text-[#9a4f00]">PERÍODO B</legend>{campo('Desde B', 'desdeB')}{campo('Hasta B', 'hastaB')}</fieldset></>}
    </div></div>}
    {borrador.modo !== 'mes' && <div className="flex flex-wrap items-center gap-2"><button type="submit" disabled={cargando} className="rounded-md bg-[#FE8F01] px-4 py-2 text-sm font-bold text-black disabled:opacity-50">{borrador.modo === 'comparar' ? 'Aplicar comparación' : 'Aplicar rango'}</button><button type="button" onClick={() => seleccionarModo('mes')} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700">Limpiar / Volver a vista mensual</button></div>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </form>;
}

export function FiltroTemporalMaestro({ valor, aplicar, actualizar, cargando = false }: { valor: ContextoTemporalM7; aplicar: (contexto: ContextoTemporalM7) => void; actualizar: () => void; cargando?: boolean }) {
  const [borrador, setBorrador] = useState(valor); const [error, setError] = useState('');
  useEffect(() => setBorrador(valor), [valor]);
  const campo = (etiqueta: string, clave: keyof FiltrosTemporalesVentas) => <label className="min-w-0 text-xs font-bold uppercase text-gray-500"><span>{etiqueta}</span><input aria-label={etiqueta} type="date" value={String(borrador[clave])} onChange={e => setBorrador(actual => ({ ...actual, [clave]: e.target.value }))} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900" /></label>;
  const validar = () => borrador.modo === 'rango' ? rangoValido(borrador.desde, borrador.hasta) : borrador.modo === 'comparar' ? rangoValido(borrador.desdeA, borrador.hastaA) && rangoValido(borrador.desdeB, borrador.hastaB) : Number.isInteger(borrador.anio) && borrador.anio >= 2000 && borrador.anio <= 2200 && Number.isInteger(borrador.mes) && borrador.mes >= 1 && borrador.mes <= 12;
  const enviar = (evento: FormEvent) => { evento.preventDefault(); if (!validar()) { setError('Revisa el período seleccionado y sus fechas.'); return; } setError(''); aplicar(borrador); };
  const limpiar = () => { const limpio: ContextoTemporalM7 = { ...leerFiltrosTemporalesVentas('', valor.anio, valor.mes), anio: valor.anio, mes: valor.mes, segmento: 'TODOS' }; setBorrador(limpio); setError(''); aplicar(limpio); };
  return <form onSubmit={enviar} className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
    <div className="flex flex-wrap items-start justify-between gap-4"><ControlSegmentado etiqueta="Período de análisis" valor={borrador.modo} cambiar={modo => setBorrador(actual => ({ ...actual, modo: modo as ModoTemporalVentas }))} opciones={[{ valor: 'mes', etiqueta: 'Mes' }, { valor: 'rango', etiqueta: 'Rango' }, { valor: 'comparar', etiqueta: 'Comparar períodos' }]} /><ControlSegmentado etiqueta="Segmento comercial" valor={borrador.segmento} cambiar={segmento => setBorrador(actual => ({ ...actual, segmento: segmento as ContextoTemporalM7['segmento'] }))} opciones={[{ valor: 'TODOS', etiqueta: 'Todos' }, { valor: 'B2B', etiqueta: 'B2B' }, { valor: 'B2C', etiqueta: 'B2C' }]} /></div>
    <div className="border-t border-gray-100 pt-4">
      {borrador.modo === 'mes' ? <div className="flex flex-wrap items-end gap-3"><CalendarDays className="mb-2 h-5 w-5 text-[#FE8F01]"/><label className="text-xs font-bold uppercase text-gray-500">Año<input aria-label="Año" type="number" min="2000" max="2200" value={borrador.anio} onChange={e => setBorrador(actual => ({ ...actual, anio: Number(e.target.value) }))} className="mt-1 block w-28 rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900"/></label><label className="text-xs font-bold uppercase text-gray-500">Mes<select aria-label="Mes" value={borrador.mes} onChange={e => setBorrador(actual => ({ ...actual, mes: Number(e.target.value) }))} className="mt-1 block rounded-md border border-gray-300 px-3 py-2 text-sm font-normal text-gray-900">{Array.from({ length: 12 }, (_, indice) => <option key={indice + 1} value={indice + 1}>{new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(new Date(2026, indice, 1))}</option>)}</select></label></div> : <div className="flex items-start gap-2"><CalendarDays className="mt-6 h-5 w-5 shrink-0 text-[#FE8F01]"/><div className="grid min-w-0 flex-1 gap-3 lg:grid-cols-2">{borrador.modo === 'rango' ? <div className="grid gap-2 sm:grid-cols-2">{campo('Desde', 'desde')}{campo('Hasta', 'hasta')}</div> : <><fieldset className="grid gap-2 rounded-md bg-gray-50 p-3 sm:grid-cols-2"><legend className="px-1 text-xs font-black text-gray-700">PERÍODO A</legend>{campo('Desde A', 'desdeA')}{campo('Hasta A', 'hastaA')}</fieldset><fieldset className="grid gap-2 rounded-md bg-orange-50/60 p-3 sm:grid-cols-2"><legend className="px-1 text-xs font-black text-[#9a4f00]">PERÍODO B</legend>{campo('Desde B', 'desdeB')}{campo('Hasta B', 'hastaB')}</fieldset></>}</div></div>}
    </div>
    <div className="flex flex-wrap items-center gap-2"><button type="submit" disabled={cargando} className="rounded-md bg-[#FE8F01] px-4 py-2 text-sm font-bold text-black disabled:opacity-50">Aplicar</button><button type="button" onClick={limpiar} disabled={cargando} className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50">Limpiar filtros</button><button type="button" onClick={actualizar} disabled={cargando} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${cargando ? 'animate-spin' : ''}`}/>Actualizar datos</button></div>
    <p className="border-t border-gray-100 pt-3 text-sm font-semibold text-gray-700">{etiquetaContextoTemporalM7(valor)}</p>{error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </form>;
}
