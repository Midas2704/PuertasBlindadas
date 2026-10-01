import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CalendarRange, CircleAlert, CircleCheck, DatabaseZap, Download, RefreshCw } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { solicitarFinanzas } from '../../api/finanzas';
import { usarSesion } from '../../seguridad/Sesion';

export type Indicador = { estado: string; valor: unknown; detalle: string; actualizadoEn?: string | null };
export type RespuestaM7 = Record<string, unknown> & { periodo?: { desde: string; hasta: string }; estado?: string };

const etiquetas: Record<string, string> = {
  montoNeto: 'Monto neto', cantidad: 'Cantidad de ventas', ticketMedio: 'Ticket medio', evolucion: 'Evolución', clientes: 'Clientes', tiposCliente: 'Tipos de cliente', concentracionClientes: 'Concentración por Cliente', productos: 'Productos / familias', comparacion: 'Comparación',
  saldo: 'Saldo pendiente', morosidad: 'Morosidad', recaudacion: 'Recaudación recibida', compromisosFuturos: 'Compromisos futuros', estados: 'Estados', proveedores: 'Proveedores', categorias: 'Categorías',
  liquidezActual: 'Liquidez actual', flujoHistorico: 'Flujo histórico', proyeccion: 'Proyección', capaEstimada: 'Capa estimada',
};
const titulo = (clave: string) => etiquetas[clave] || clave.replace(/([A-Z])/g, ' $1').replace(/^./, letra => letra.toUpperCase());
const esIndicador = (valor: unknown): valor is Indicador => Boolean(valor && typeof valor === 'object' && 'estado' in valor && 'detalle' in valor);
const formatear = (valor: unknown) => typeof valor === 'number' ? new Intl.NumberFormat('es-CL', { maximumFractionDigits: 2 }).format(valor) : valor === null || valor === undefined || valor === '' ? 'No disponible' : String(valor);

const Estado: React.FC<{ estado: string }> = ({ estado }) => {
  const valido = estado === 'VALIDO';
  const Icono = valido ? CircleCheck : estado === 'FUENTE_NO_DISPONIBLE' ? DatabaseZap : CircleAlert;
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold ${valido ? 'text-emerald-700' : estado === 'NO_APLICA' ? 'text-gray-500' : 'text-amber-700'}`}><Icono className="h-3.5 w-3.5" />{estado.replaceAll('_', ' ')}</span>;
};

const Tabla: React.FC<{ filas: unknown[] }> = ({ filas }) => {
  if (!filas.length) return <p className="text-sm text-gray-500">Sin registros.</p>;
  const objetos = filas.filter(fila => fila && typeof fila === 'object') as Record<string, unknown>[];
  if (objetos.length !== filas.length) return <p className="text-sm text-gray-800">{filas.map(formatear).join(', ')}</p>;
  const columnas = [...new Set(objetos.flatMap(Object.keys))].slice(0, 6);
  return <div className="overflow-x-auto"><table className="w-full min-w-[520px] text-left text-sm"><thead className="border-b border-gray-200 text-xs uppercase text-gray-500"><tr>{columnas.map(columna => <th key={columna} className="px-3 py-2 font-semibold">{titulo(columna)}</th>)}</tr></thead><tbody>{objetos.slice(0, 12).map((fila, indice) => <tr key={indice} className="border-b border-gray-100 last:border-0">{columnas.map(columna => <td key={columna} className="px-3 py-2 align-top text-gray-700">{Array.isArray(fila[columna]) ? `${fila[columna].length} registros` : formatear(fila[columna])}</td>)}</tr>)}</tbody></table></div>;
};

const Valor: React.FC<{ valor: unknown }> = ({ valor }) => {
  if (Array.isArray(valor)) return <Tabla filas={valor} />;
  if (valor && typeof valor === 'object') return <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">{Object.entries(valor as Record<string, unknown>).map(([clave, contenido]) => <div key={clave} className="flex justify-between gap-4 border-b border-gray-100 py-1.5"><dt className="text-sm text-gray-500">{titulo(clave)}</dt><dd className="text-right text-sm font-semibold text-gray-900">{Array.isArray(contenido) ? `${contenido.length} registros` : formatear(contenido)}</dd></div>)}</dl>;
  return <p className="text-2xl font-bold text-gray-950">{formatear(valor)}</p>;
};

export const Periodo: React.FC<{ anio: number; mes: number; cambiar: (anio: number, mes: number) => void; cargando: boolean; recargar: () => void }> = ({ anio, mes, cambiar, cargando, recargar }) => <div className="flex flex-wrap items-end gap-3 border-y border-gray-200 bg-white px-5 py-4">
  <CalendarRange className="mb-2 h-5 w-5 text-gray-500" />
  <label className="text-xs font-semibold uppercase text-gray-500">Año<input aria-label="Año" type="number" min="2000" max="2200" value={anio} onChange={e => cambiar(Number(e.target.value), mes)} className="mt-1 block w-28 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900" /></label>
  <label className="text-xs font-semibold uppercase text-gray-500">Mes<select aria-label="Mes" value={mes} onChange={e => cambiar(anio, Number(e.target.value))} className="mt-1 block rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900">{Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{new Intl.DateTimeFormat('es-CL', { month: 'long' }).format(new Date(2026, i, 1))}</option>)}</select></label>
  <button type="button" title="Actualizar datos" onClick={recargar} disabled={cargando} className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${cargando ? 'animate-spin' : ''}`} /></button>
</div>;

export const PdfDashboard: React.FC<{ origen: string; anio: number; mes: number }> = ({ origen, anio, mes }) => {
  const { sesion } = usarSesion(); const [ocupado, setOcupado] = useState(false); const [error, setError] = useState('');
  if (!sesion?.permisos.includes('CU245')) return null;
  const descargar = async () => { setOcupado(true); setError(''); try { const respuesta = await solicitarFinanzas('/dashboard-m7/pdf', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ origen, consulta: { anio, mes } }) }); const archivo = await respuesta.json(); if (!respuesta.ok) throw new Error(archivo.error || 'No fue posible generar el PDF'); const enlace = document.createElement('a'); enlace.href = archivo.contenido; enlace.download = archivo.nombre; enlace.click(); } catch (causa) { setError((causa as Error).message); } finally { setOcupado(false); } };
  return <div className="border-b border-gray-200 bg-white px-5 py-3 sm:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-end gap-3">{error && <span role="alert" className="text-sm text-red-700">{error}</span>}<button type="button" onClick={()=>void descargar()} disabled={ocupado} className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-50"><Download className="h-4 w-4" />{ocupado ? 'Generando…' : 'Descargar PDF'}</button></div></div>;
};

export function usarConsultaM7(ruta: string, global = false) {
  const location = useLocation(); const navigate = useNavigate();
  const inicial = useMemo(() => { const q = new URLSearchParams(location.search); const hoy = new Date(); return { anio: Number(q.get('anio')) || hoy.getFullYear(), mes: Number(q.get('mes')) || hoy.getMonth() + 1 }; }, [location.search]);
  const [seleccion, seleccionar] = useState(inicial); const [version, versionar] = useState(0); const [datos, establecer] = useState<RespuestaM7 | null>(null); const [error, establecerError] = useState(''); const [cargando, cargar] = useState(true);
  const cambiar = (anio: number, mes: number) => { seleccionar({ anio, mes }); if (global) navigate(`${location.pathname}?anio=${anio}&mes=${mes}`, { replace: true }); };
  useEffect(() => { const abort = new AbortController(); cargar(true); establecerError(''); solicitarFinanzas(`${ruta}?anio=${seleccion.anio}&mes=${seleccion.mes}`, { signal: abort.signal }).then(async respuesta => { const cuerpo = await respuesta.json(); if (!respuesta.ok) throw new Error(cuerpo.error || 'No fue posible consultar el panel'); establecer(cuerpo); }).catch(errorConsulta => { if (!abort.signal.aborted) establecerError(errorConsulta.message); }).finally(() => { if (!abort.signal.aborted) cargar(false); }); return () => abort.abort(); }, [ruta, seleccion.anio, seleccion.mes, version]);
  return { ...seleccion, global: inicial, datos, error, cargando, cambiar, recargar: () => versionar(v => v + 1) };
}

export const EncabezadoM7: React.FC<{ titulo: string; descripcion: string; regreso?: { anio: number; mes: number } }> = ({ titulo: textoTitulo, descripcion, regreso }) => <header className="bg-[#171717] px-5 py-6 text-white sm:px-8"><div className="mx-auto max-w-7xl">{regreso && <Link to={`/dashboard-m7?anio=${regreso.anio}&mes=${regreso.mes}`} className="mb-3 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Panel general</Link>}<h1 className="text-2xl font-bold sm:text-3xl">{textoTitulo}</h1><p className="mt-1 text-sm text-gray-300">{descripcion}</p></div></header>;

export const ContenidoIndicadores: React.FC<{ datos: RespuestaM7 | null; error: string; cargando: boolean; omitir?: string[] }> = ({ datos, error, cargando, omitir = [] }) => {
  if (cargando) return <div className="px-5 py-10 text-sm text-gray-500">Consultando fuentes vigentes…</div>;
  if (error) return <div role="alert" className="border-y border-red-200 bg-red-50 px-5 py-4 text-red-800">{error}</div>;
  if (!datos) return null;
  const entradas = Object.entries(datos).filter(([clave]) => !['periodo', 'estado', 'permiso', ...omitir].includes(clave));
  return <div className="divide-y divide-gray-200 bg-white">{entradas.map(([clave, contenido]) => <section key={clave} className="px-5 py-6 sm:px-8"><div className="mx-auto max-w-7xl"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 className="text-base font-bold text-gray-950">{titulo(clave)}</h2>{esIndicador(contenido) && <Estado estado={contenido.estado} />}</div>{esIndicador(contenido) ? <><Valor valor={contenido.valor} /><p className="mt-2 text-xs text-gray-500">{contenido.detalle}</p></> : <Valor valor={contenido} />}</div></section>)}</div>;
};
