import type { ReactNode } from 'react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, LineChart,
  Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { BarChart3, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EstadoDato, formatearDato } from './componentes';

export type DatoGrafico = Record<string, string | number | null>;
export type SerieGrafico = { clave: string; nombre: string; color?: string };

const NARANJA = '#FE8F01';
const GRIS = '#676767';
const VERDE = '#15803d';
const ROJO = '#b91c1c';
const COLORES = [NARANJA, GRIS, '#9ca3af', VERDE, ROJO, '#d97706'];
type DatoDonut = { nombre: string; valor: number; color?: string; porcentaje?: number | null };

const abreviar = (valor: number) => new Intl.NumberFormat('es-CL', { notation: 'compact', maximumFractionDigits: 1 }).format(valor);
const fechaCorta = (valor: unknown) => {
  const texto = String(valor ?? '');
  if (/^\d{4}-\d{2}$/.test(texto)) return new Intl.DateTimeFormat('es-CL', { month: 'short', timeZone: 'UTC' }).format(new Date(`${texto}-01T00:00:00Z`));
  if (!/^\d{4}-\d{2}-\d{2}/.test(texto)) return texto;
  return new Intl.DateTimeFormat('es-CL', { day: '2-digit', month: 'short', timeZone: 'UTC' }).format(new Date(texto));
};

const fechaCompleta = (valor: unknown) => {
  const texto = String(valor ?? '');
  if (/^\d{4}-\d{2}$/.test(texto)) return new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${texto}-01T00:00:00Z`));
  return fechaCorta(valor);
};

const TooltipGrafico = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name?: string; value?: unknown; color?: string; dataKey?: string }>; label?: unknown }) => {
  if (!active || !payload?.length) return null;
  return <div className="max-w-64 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg">
    {label !== undefined && <p className="mb-1 font-semibold capitalize text-gray-900">{fechaCompleta(label)}</p>}
    {payload.map((item, indice) => <div key={`${item.dataKey}-${indice}`} className="flex items-center justify-between gap-4 py-0.5">
      <span className="flex min-w-0 items-center gap-1.5 text-gray-600"><i className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span>
      <strong className="text-gray-950">{formatearDato(item.value, String(item.dataKey || item.name || 'valor'))}</strong>
    </div>)}
  </div>;
};

export function EstadoSinDatos({ texto }: { texto: string }) {
  return <div className="flex h-44 flex-col items-center justify-center rounded-md border border-dashed border-gray-200 bg-gray-50 px-5 text-center">
    <BarChart3 className="mb-2 h-6 w-6 text-gray-400" />
    <p className="text-sm text-gray-500">{texto}</p>
  </div>;
}

function MarcoGrafico({ children, alto = 190 }: { children: ReactNode; alto?: number }) {
  return <div className="w-full" style={{ height: alto }}>{children}</div>;
}

export function GraficoLinea({ datos, series, etiqueta = 'etiqueta', referencias = [] }: { datos: DatoGrafico[]; series: SerieGrafico[]; etiqueta?: string; referencias?: Array<{ valor: number; nombre: string; color?: string }> }) {
  if (!datos.length || !series.length) return <EstadoSinDatos texto="No hay una serie temporal suficiente para graficar." />;
  return <MarcoGrafico><ResponsiveContainer width="100%" height="100%"><LineChart data={datos} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} /><XAxis dataKey={etiqueta} tickFormatter={fechaCorta} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tickFormatter={abreviar} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip content={<TooltipGrafico />} />
    {referencias.map(ref => <ReferenceLine key={ref.nombre} y={ref.valor} stroke={ref.color || ROJO} strokeDasharray="4 4" label={{ value: ref.nombre, fill: ref.color || ROJO, fontSize: 10 }} />)}
    {series.map((serie, indice) => <Line key={serie.clave} type="monotone" dataKey={serie.clave} name={serie.nombre} stroke={serie.color || COLORES[indice % COLORES.length]} strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 5 }} connectNulls={false} />)}
  </LineChart></ResponsiveContainer></MarcoGrafico>;
}

export function GraficoArea({ datos, series, etiqueta = 'etiqueta', referencias = [] }: { datos: DatoGrafico[]; series: SerieGrafico[]; etiqueta?: string; referencias?: Array<{ valor: number; nombre: string; color?: string }> }) {
  if (!datos.length || !series.length) return <EstadoSinDatos texto="No hay proyección suficiente para graficar." />;
  return <MarcoGrafico><ResponsiveContainer width="100%" height="100%"><AreaChart data={datos} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
    <defs>{series.map((serie, indice) => <linearGradient key={serie.clave} id={`area-${serie.clave.replace(/[^a-z0-9]/gi, '')}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={serie.color || COLORES[indice % COLORES.length]} stopOpacity={0.28}/><stop offset="95%" stopColor={serie.color || COLORES[indice % COLORES.length]} stopOpacity={0.03}/></linearGradient>)}</defs>
    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} /><XAxis dataKey={etiqueta} tickFormatter={fechaCorta} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false} /><YAxis tickFormatter={abreviar} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false} /><Tooltip content={<TooltipGrafico />} />
    <ReferenceLine y={0} stroke="#9ca3af" />{referencias.map(ref => <ReferenceLine key={ref.nombre} y={ref.valor} stroke={ref.color || ROJO} strokeDasharray="4 4" label={{ value: ref.nombre, fill: ref.color || ROJO, fontSize: 10 }} />)}
    {series.map((serie, indice) => <Area key={serie.clave} type="monotone" dataKey={serie.clave} name={serie.nombre} stroke={serie.color || COLORES[indice % COLORES.length]} fill={`url(#area-${serie.clave.replace(/[^a-z0-9]/gi, '')})`} strokeWidth={2.5} connectNulls={false} />)}
  </AreaChart></ResponsiveContainer></MarcoGrafico>;
}

export function GraficoBarras({ datos, series, etiqueta = 'etiqueta', apiladas = false, horizontal = false }: { datos: DatoGrafico[]; series: SerieGrafico[]; etiqueta?: string; apiladas?: boolean; horizontal?: boolean }) {
  if (!datos.length || !series.length) return <EstadoSinDatos texto="No hay composición suficiente para graficar." />;
  const alto = Math.max(190, horizontal ? Math.min(datos.length, 8) * 34 + 54 : 190);
  return <MarcoGrafico alto={alto}><ResponsiveContainer width="100%" height="100%"><BarChart data={datos} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ top: 8, right: 8, left: horizontal ? 20 : -18, bottom: 0 }}>
    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" horizontal={!horizontal} vertical={horizontal} />
    {horizontal ? <><XAxis type="number" tickFormatter={abreviar} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false}/><YAxis type="category" width={92} dataKey={etiqueta} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false}/></> : <><XAxis dataKey={etiqueta} tickFormatter={fechaCorta} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false}/><YAxis tickFormatter={abreviar} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false}/></>}
    <Tooltip content={<TooltipGrafico />} />{series.length > 1 && <Legend wrapperStyle={{ fontSize: 11 }} />}
    {series.map((serie, indice) => <Bar key={serie.clave} dataKey={serie.clave} name={serie.nombre} fill={serie.color || COLORES[indice % COLORES.length]} stackId={apiladas ? 'total' : undefined} radius={apiladas ? undefined : [3, 3, 0, 0]} maxBarSize={34} />)}
  </BarChart></ResponsiveContainer></MarcoGrafico>;
}

export function GraficoCombinado({ datos, barras, lineas, etiqueta = 'periodo', alto = 300, porcentaje = false }: { datos: DatoGrafico[]; barras: SerieGrafico[]; lineas: SerieGrafico[]; etiqueta?: string; alto?: number; porcentaje?: boolean }) {
  if (!datos.length) return <EstadoSinDatos texto="No hay una serie histórica suficiente para graficar." />;
  const tienePresupuestoFlujo = datos.some(dato => typeof dato.flujoPresupuestado === 'number');
  const lineasVisibles = tienePresupuestoFlujo && lineas.some(linea => linea.clave === 'flujoNeto') ? [...lineas.map(linea => linea.clave === 'flujoNeto' ? { ...linea, nombre: 'Flujo real' } : linea), { clave: 'flujoPresupuestado', nombre: 'Flujo presupuestado', color: '#b85e00' }] : lineas;
  return <div className="w-full overflow-x-auto"><div className="min-w-[680px]" style={{ height: alto }}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={datos} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey={etiqueta} tickFormatter={fechaCorta} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false} interval={0} />
    <YAxis yAxisId="monto" tickFormatter={abreviar} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false} />
    {porcentaje && <YAxis yAxisId="porcentaje" orientation="right" domain={[0, 100]} tickFormatter={valor => `${valor}%`} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false} />}
    <Tooltip content={<TooltipGrafico />} /><Legend wrapperStyle={{ fontSize: 11 }} />
    {barras.map((serie, indice) => <Bar key={serie.clave} yAxisId="monto" dataKey={serie.clave} name={serie.nombre} fill={serie.color || COLORES[indice % COLORES.length]} radius={[3, 3, 0, 0]} maxBarSize={28} />)}
    {lineasVisibles.map((serie, indice) => <Line key={serie.clave} yAxisId={porcentaje ? 'porcentaje' : 'monto'} type="monotone" dataKey={serie.clave} name={serie.nombre} stroke={serie.color || COLORES[(indice + barras.length) % COLORES.length]} strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 5 }} connectNulls={false} />)}
  </ComposedChart></ResponsiveContainer></div></div>;
}

const porcentajeComparativo = (valor: unknown) => typeof valor === 'number' && Number.isFinite(valor)
  ? `${Object.is(valor, -0) || valor >= 0 ? '+' : ''}${(Object.is(valor, -0) ? 0 : valor).toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
  : 'N/A';

function TooltipComparativoMensual({ active, payload, label }: { active?: boolean; payload?: Array<{ payload?: DatoGrafico }>; label?: unknown }) {
  const fila = payload?.[0]?.payload;
  if (!active || !fila) return null;
  const periodo = String(fila.periodo || label || '');
  const anio = Number(periodo.slice(0, 4));
  const mesAnterior = typeof fila.periodoMesAnterior === 'string' ? `Mes anterior · ${fechaCompleta(fila.periodoMesAnterior)}` : 'Mes anterior';
  const filas = [
    { etiqueta: 'Ventas netas', valor: fila.ventasNetasGerencial, color: NARANJA, tipo: 'monto' },
    { etiqueta: `Mismo mes ${anio - 1}`, valor: fila.ventasAnioAnterior, color: '#f6b35d', tipo: 'monto', linea: true },
    { etiqueta: 'YoY', valor: fila.yoy, color: '#c76500', tipo: 'porcentaje' },
    { etiqueta: mesAnterior, valor: fila.ventaMesAnterior, color: '#a3a3a3', tipo: 'monto' },
    { etiqueta: 'MoM', valor: fila.mom, color: GRIS, tipo: 'porcentaje' },
    { etiqueta: 'Costos directos', valor: fila.costosDirectos, color: '#9ca3af', tipo: 'monto' },
    { etiqueta: 'Resultado gerencial', valor: fila.resultadoGerencial, color: '#000000', tipo: 'monto', linea: true },
    { etiqueta: `Resultado ${anio - 1}`, valor: fila.resultadoAnioAnterior, color: '#4b5563', tipo: 'monto', linea: true },
  ].filter(item => typeof item.valor === 'number' && Number.isFinite(item.valor));
  return <div className="max-w-[min(20rem,calc(100vw-2rem))] rounded-lg border border-gray-200 bg-white px-3 py-3 text-xs shadow-xl">
    <p className="mb-2 font-black uppercase tracking-wide text-gray-950">{fechaCompleta(periodo)}</p>
    <div className="space-y-1.5">{filas.map(item => <div key={item.etiqueta} className="flex items-center justify-between gap-5">
      <span className="flex min-w-0 items-center gap-2 text-gray-600"><i aria-hidden="true" className={item.linea ? 'h-0.5 w-3 shrink-0' : 'h-2.5 w-2.5 shrink-0 rounded-[2px]'} style={{ backgroundColor: item.color }} /><span>{item.etiqueta}</span></span>
      <strong className="shrink-0 text-gray-950">{item.tipo === 'porcentaje' ? porcentajeComparativo(item.valor) : formatearDato(item.valor, 'monto')}</strong>
    </div>)}</div>
  </div>;
}

const LeyendaComparativa = () => <div className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-600">
  <span className="flex items-center gap-1.5"><i aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-[#FE8F01]" />Ventas</span>
  <span className="flex items-center gap-1.5"><i aria-hidden="true" className="w-4 border-t-2 border-dashed border-[#f6b35d]" />Ventas año anterior</span>
  <span className="flex items-center gap-1.5"><i aria-hidden="true" className="h-2.5 w-2.5 rounded-[2px] bg-[#9ca3af]" />Costos</span>
  <span className="flex items-center gap-1.5"><i aria-hidden="true" className="h-0.5 w-4 bg-black" />Resultado</span>
  <span className="flex items-center gap-1.5"><i aria-hidden="true" className="w-4 border-t-2 border-dashed border-[#4b5563]" />Resultado año anterior</span>
</div>;

export function GraficoComparativoMensual({ datos, alto = 340 }: { datos: DatoGrafico[]; alto?: number }) {
  if (!datos.length) return <EstadoSinDatos texto="No hay una serie histórica suficiente para graficar." />;
  return <div className="w-full"><LeyendaComparativa /><div className="w-full overflow-x-auto"><div className="min-w-[720px]" style={{ height: alto }}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={datos} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}>
    <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="periodo" tickFormatter={fechaCorta} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false} interval={0} />
    <YAxis tickFormatter={abreviar} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false} />
    <Tooltip content={<TooltipComparativoMensual />} wrapperStyle={{ zIndex: 50, outline: 'none' }} allowEscapeViewBox={{ x: false, y: true }} />
    <Bar dataKey="ventasNetasGerencial" name="Ventas" fill={NARANJA} radius={[3, 3, 0, 0]} maxBarSize={28} />
    <Bar dataKey="costosDirectos" name="Costos" fill="#9ca3af" radius={[3, 3, 0, 0]} maxBarSize={28} />
    <Line type="monotone" dataKey="resultadoGerencial" name="Resultado" stroke="#000000" strokeWidth={2.5} dot={{ r: 2.5 }} activeDot={{ r: 5 }} connectNulls={false} />
    <Line type="monotone" dataKey="ventasAnioAnterior" name="Ventas año anterior" stroke="#f6b35d" strokeWidth={2} strokeDasharray="6 4" dot={{ r: 2 }} activeDot={{ r: 4 }} connectNulls={false} />
    <Line type="monotone" dataKey="resultadoAnioAnterior" name="Resultado año anterior" stroke="#4b5563" strokeWidth={1.75} strokeDasharray="3 4" dot={{ r: 2 }} activeDot={{ r: 4 }} connectNulls={false} />
  </ComposedChart></ResponsiveContainer></div></div></div>;
}

function TooltipPeriodosVentas({ active, payload, label }: { active?: boolean; payload?: Array<{ payload?: DatoGrafico }>; label?: unknown }) {
  const fila = payload?.[0]?.payload; if (!active || !fila) return null;
  const item = (nombre: string, periodo: unknown, valor: unknown, color: string) => periodo ? <div className="mt-2 flex items-start justify-between gap-5"><span className="flex items-center gap-2 text-gray-600"><i className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color }}/>{nombre}<small className="block text-gray-400">{fechaCompleta(String(periodo))}</small></span><strong>{formatearDato(valor, 'monto')}</strong></div> : null;
  return <div className="rounded-lg border border-gray-200 bg-white p-3 text-xs shadow-xl"><p className="font-black">{String(label)}</p>{item('Período A', fila.periodoA, fila.ventaA, '#676767')}{item('Período B', fila.periodoB, fila.ventaB, '#FE8F01')}</div>;
}

export function GraficoPeriodosVentas({ datos }: { datos: DatoGrafico[] }) {
  if (!datos.length) return <EstadoSinDatos texto="No hay ventas comparables en los períodos seleccionados."/>;
  return <div className="w-full overflow-x-auto"><div className="min-w-[620px]" style={{ height: 300 }}><ResponsiveContainer width="100%" height="100%"><ComposedChart data={datos} margin={{ top: 12, right: 12, left: -8, bottom: 0 }}><CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false}/><XAxis dataKey="posicion" tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false}/><YAxis tickFormatter={abreviar} tick={{ fill: GRIS, fontSize: 11 }} axisLine={false} tickLine={false}/><Tooltip content={<TooltipPeriodosVentas/>}/><Legend wrapperStyle={{ fontSize: 11 }}/><Bar dataKey="ventaA" name="Período A" fill="#676767" radius={[3,3,0,0]} maxBarSize={30}/><Line type="monotone" dataKey="ventaB" name="Período B" stroke="#FE8F01" strokeWidth={3} dot={{ r: 3 }} connectNulls={false}/></ComposedChart></ResponsiveContainer></div></div>;
}

function TooltipDonut({ active, payload, metrica, total }: { active?: boolean; payload?: Array<{ payload?: DatoDonut }>; metrica: 'VALOR' | 'UNIDADES' | 'GENERICO'; total: number }) {
  const dato = payload?.[0]?.payload;
  if (!active || !dato) return null;
  const participacion = dato.porcentaje ?? (total > 0 ? dato.valor / total * 100 : null);
  const valor = metrica === 'VALOR' ? formatearDato(dato.valor, 'monto') : metrica === 'UNIDADES' ? `${formatearDato(dato.valor)} unidades` : formatearDato(dato.valor);
  return <div className="max-w-72 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-xs shadow-xl">
    <p className="flex items-start gap-2 font-bold leading-5 text-gray-950"><i aria-hidden="true" className="mt-1 h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ backgroundColor: dato.color }} /><span>{dato.nombre}</span></p>
    <p className="mt-1.5 text-sm font-black text-black">{valor}</p>
    {participacion !== null && <p className="mt-0.5 text-gray-600">{participacion.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}% {metrica === 'VALOR' ? 'de las ventas' : 'del total'}</p>}
  </div>;
}

export function GraficoDonut({ datos, centro, centroEtiqueta, centroValor, metrica = 'GENERICO', mostrarLeyenda = true, alto = 190, radioInterior = 54, radioExterior = 78 }: { datos: DatoDonut[]; centro?: string; centroEtiqueta?: string; centroValor?: string; metrica?: 'VALOR' | 'UNIDADES' | 'GENERICO'; mostrarLeyenda?: boolean; alto?: number; radioInterior?: number; radioExterior?: number }) {
  const validos = datos.filter(dato => Number.isFinite(dato.valor) && dato.valor >= 0);
  if (!validos.length || validos.every(dato => dato.valor === 0)) return <EstadoSinDatos texto="No hay composición suficiente para graficar." />;
  const coloreados = validos.map((dato, indice) => ({ ...dato, color: dato.color || COLORES[indice % COLORES.length] }));
  const total = coloreados.reduce((suma, dato) => suma + dato.valor, 0);
  return <MarcoGrafico alto={alto}><div className="relative h-full overflow-visible"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={coloreados} dataKey="valor" nameKey="nombre" innerRadius={radioInterior} outerRadius={radioExterior} paddingAngle={2} stroke="#FFFFFF" strokeWidth={2}>{coloreados.map(dato => <Cell key={dato.nombre} fill={dato.color} />)}</Pie><Tooltip content={<TooltipDonut metrica={metrica} total={total} />} wrapperStyle={{ zIndex: 40, outline: 'none' }} allowEscapeViewBox={{ x: false, y: true }} />{mostrarLeyenda && <Legend wrapperStyle={{ fontSize: 11 }} />}</PieChart></ResponsiveContainer>{(centro || centroValor) && <div className={`pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center ${mostrarLeyenda ? 'pb-6' : ''}`}><span className="max-w-32 text-[10px] font-black uppercase tracking-[0.14em] text-gray-500">{centroEtiqueta}</span><strong className="mt-1 max-w-40 break-words text-xl font-black leading-tight text-gray-950 sm:text-2xl">{centroValor || centro}</strong></div>}</div></MarcoGrafico>;
}

export function GraficoProgreso({ utilizado, disponible }: { utilizado: number; disponible: number }) {
  const total = utilizado + disponible; const porcentaje = total > 0 ? Math.max(0, Math.min(100, utilizado / total * 100)) : 0;
  if (total <= 0) return <EstadoSinDatos texto="No hay capacidad configurada para representar." />;
  return <div className="py-5"><div className="mb-2 flex items-end justify-between"><span className="text-sm font-medium text-gray-600">Capacidad utilizada</span><strong className="text-2xl text-gray-950">{new Intl.NumberFormat('es-CL', { maximumFractionDigits: 1 }).format(porcentaje)}%</strong></div><div className="h-3 overflow-hidden rounded-full bg-gray-200"><div className="h-full rounded-full bg-[#FE8F01]" style={{ width: `${porcentaje}%` }} /></div><div className="mt-3 flex justify-between text-xs text-gray-500"><span>{formatearDato(utilizado, 'monto')} utilizado</span><span>{formatearDato(disponible, 'monto')} disponible</span></div></div>;
}

export function TarjetaIndicador({ titulo, icono, estado, principal, etiquetaPrincipal, variacion, secundarios, grafico, graficoSecundario, ruta, amplia = false }: { titulo: string; icono: ReactNode; estado?: string; principal: string; etiquetaPrincipal: string; variacion?: string | null; secundarios: Array<{ etiqueta: string; valor: string }>; grafico: ReactNode; graficoSecundario?: ReactNode; ruta: string; amplia?: boolean }) {
  return <article className={`flex min-w-0 flex-col rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${amplia ? 'xl:col-span-2' : ''}`}>
    <div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="rounded-md bg-orange-50 p-2 text-[#c76500]">{icono}</span><h2 className="text-sm font-bold text-gray-950">{titulo}</h2></div><EstadoDato estado={estado} compacto /></div>
    <div className="mt-4"><p className="text-xs font-semibold uppercase text-gray-500">{etiquetaPrincipal}</p><p className="mt-1 break-words text-3xl font-bold text-black">{principal}</p>{variacion && <p className={`mt-1 text-sm font-semibold ${variacion.startsWith('-') ? 'text-red-700' : 'text-emerald-700'}`}>{variacion}</p>}</div>
    <div className={`mt-4 grid min-w-0 gap-4 ${graficoSecundario ? 'lg:grid-cols-2' : ''}`}><div className="min-w-0">{grafico}</div>{graficoSecundario && <div className="min-w-0">{graficoSecundario}</div>}</div>
    {secundarios.length > 0 && <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-gray-100 pt-4 sm:grid-cols-3">{secundarios.slice(0, 3).map(item => <div key={item.etiqueta} className="min-w-0"><dt className="text-xs text-gray-500">{item.etiqueta}</dt><dd className="mt-0.5 truncate text-sm font-bold text-gray-900" title={item.valor}>{item.valor}</dd></div>)}</dl>}
    <Link to={ruta} className="mt-5 inline-flex items-center gap-1 self-start text-sm font-bold text-[#b85e00] hover:text-black">Ver detalle <ChevronRight className="h-4 w-4" /></Link>
  </article>;
}
