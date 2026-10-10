import { useEffect, useState, type FormEvent } from 'react';
import { CalendarDays } from 'lucide-react';
import { ControlSegmentado } from './componentes';

export type ModoTemporalVentas = 'mes' | 'rango' | 'comparar';
export type FiltrosTemporalesVentas = { modo: ModoTemporalVentas; desde: string; hasta: string; desdeA: string; hastaA: string; desdeB: string; hastaB: string };

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
