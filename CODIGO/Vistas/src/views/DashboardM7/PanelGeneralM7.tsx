import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, BanknoteArrowDown, BanknoteArrowUp, ChartNoAxesCombined, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { solicitarFinanzas } from '../../api/finanzas';
import { ControlSegmentado, EncabezadoM7, PdfDashboard, Periodo, EstadoDato, estadoHumano, formatearDato, usarConsultaM7 } from './componentes';
import type { RespuestaM7 } from './componentes';
import { EstadoSinDatos, GraficoBarras, GraficoCombinado, GraficoComparativoMensual, GraficoDonut, GraficoProgreso } from './graficos';
import type { DatoGrafico } from './graficos';
import { usarSesion } from '../../seguridad/Sesion';
import { NombreProducto, PALETA_PRODUCTOS, limpiarNombreProducto } from './presentacionProductos';

type MesHistorico = DatoGrafico & {
  periodo: string; ventasNetas: number | null; ventasNetasGerencial?: number | null; cantidadVentas: number; cotizaciones: number; convertidas: number;
  ventasIncluidasClp: number; ventasExcluidasSinTipoCambio: number; ventasAnioAnterior?: number | null;
  conversionPorcentual: number | null; ingresosRecibidos: number; egresosRealizados: number; ajustesEntrada?: number; ajustesSalida?: number; flujoNeto: number; flujoPresupuestado?: number | null;
  costoRemuneraciones: number | null; costosDirectos: number | null; resultadoGerencial: number | null;
  instalaciones: number; ordenesTrabajo: number; incidencias: number;
};
type Historico = {
  periodo: { desde: string; hasta: string; meses: number }; moneda: string; meses: MesHistorico[];
  principalesClientes: Array<{ idCliente: number; cliente: string; monto: number; participacionPorcentual: number | null }>;
  resumenVentas?: { actual: number | null; anterior: number | null; anual: number | null; mom: number | null; yoy: number | null; acumuladoActual: number | null; acumuladoAnterior: number | null; variacionYtd: number | null; coberturaMes: { incluidas: number; excluidasSinTipoCambio: number }; coberturaYtd: { incluidas: number; excluidasSinTipoCambio: number }; coberturaYtdAnterior: { incluidas: number; excluidasSinTipoCambio: number } } | null;
  cobertura: Record<string, string>; disponibilidad: Record<string, boolean>; estado?: string;
};

const esObjeto = (valor: unknown): valor is Record<string, unknown> => Boolean(valor) && typeof valor === 'object' && !Array.isArray(valor);
const numero = (valor: unknown) => typeof valor === 'number' && Number.isFinite(valor) ? valor : null;
const desenvolver = (valor: unknown): unknown => esObjeto(valor) && 'valor' in valor ? desenvolver(valor.valor) : valor;

function buscarNumero(origen: unknown, claves: string[], profundidad = 0): number | null {
  if (profundidad > 6 || !esObjeto(origen)) return null;
  for (const clave of claves) if (clave in origen) {
    const valor = desenvolver(origen[clave]); const directo = numero(valor); if (directo !== null) return directo;
    if (Array.isArray(valor)) { const clp = valor.find(item => esObjeto(item) && item.moneda === 'CLP'); if (esObjeto(clp)) for (const candidato of ['monto', 'saldo', 'liquidez']) { const hallado = numero(clp[candidato]); if (hallado !== null) return hallado; } }
    if (esObjeto(valor)) for (const candidato of ['totalClp', 'monto', 'saldo', 'liquidez', 'valor']) { const hallado = numero(valor[candidato]); if (hallado !== null) return hallado; }
  }
  for (const valor of Object.values(origen)) { const hallado = buscarNumero(desenvolver(valor), claves, profundidad + 1); if (hallado !== null) return hallado; }
  return null;
}

function estadoBloque(bloque?: RespuestaM7) {
  if (!bloque) return undefined; if (typeof bloque.estado === 'string') return bloque.estado;
  const indicador = Object.values(bloque).find(valor => esObjeto(valor) && typeof valor.estado === 'string') as Record<string, unknown> | undefined;
  return typeof indicador?.estado === 'string' ? indicador.estado : undefined;
}

function buscarColeccion(origen: unknown, clave: string, profundidad = 0): Record<string, unknown>[] {
  if (profundidad > 6 || !esObjeto(origen)) return [];
  if (Array.isArray(origen[clave])) return (origen[clave] as unknown[]).filter(esObjeto);
  for (const valor of Object.values(origen)) { const hallado = buscarColeccion(desenvolver(valor), clave, profundidad + 1); if (hallado.length) return hallado; }
  return [];
}

function usarHistorico(anio: number, mes: number, segmento: string, version: number) {
  const [datos, setDatos] = useState<Historico | null>(null); const [error, setError] = useState(''); const [cargando, setCargando] = useState(true);
  useEffect(() => { const abort = new AbortController(); setCargando(true); setError(''); solicitarFinanzas(`/dashboard-m7/historico?anio=${anio}&mes=${mes}&meses=24&segmento=${segmento}`, { signal: abort.signal }).then(async respuesta => { const cuerpo = await respuesta.json(); if (!respuesta.ok) throw new Error(cuerpo.error || 'No fue posible consultar el histórico'); setDatos(cuerpo); }).catch(causa => { if (!abort.signal.aborted) setError((causa as Error).message); }).finally(() => { if (!abort.signal.aborted) setCargando(false); }); return () => abort.abort(); }, [anio, mes, segmento, version]);
  return { datos, error, cargando };
}

function comparar(meses: MesHistorico[], clave: keyof MesHistorico) {
  const filaActual = meses.at(-1); const actual = numero(filaActual?.[clave]); const anterior = numero(meses.at(-2)?.[clave]);
  const periodoAnual = filaActual ? `${Number(filaActual.periodo.slice(0, 4)) - 1}${filaActual.periodo.slice(4)}` : '';
  const anual = numero(meses.find(fila => fila.periodo === periodoAnual)?.[clave]);
  const calculo = (base: number | null) => actual === null || base === null || base === 0 ? null : { diferencia: actual - base, porcentaje: (actual - base) / Math.abs(base) * 100 };
  return { actual, anterior: calculo(anterior), anual: calculo(anual) };
}

const porcentajeCorto = (valor: number | null) => { if (valor === null) return 'N/A'; const normalizado = Object.is(valor, -0) ? 0 : valor; return `${normalizado >= 0 ? '+' : ''}${normalizado.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`; };

const variacionPorcentual = (actual: number | null, base: number | null) => actual === null || base === null || base === 0 ? null : (actual - base) / Math.abs(base) * 100;
const periodoAnterior = (periodo: string) => {
  const fecha = new Date(`${periodo}-01T00:00:00Z`); fecha.setUTCMonth(fecha.getUTCMonth() - 1);
  return `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`;
};
function prepararComparativoMensual(visibles: MesHistorico[], historico: MesHistorico[]) {
  const porPeriodo = new Map(historico.map(fila => [fila.periodo, fila]));
  return visibles.map(fila => {
    const claveAnual = `${Number(fila.periodo.slice(0, 4)) - 1}${fila.periodo.slice(4)}`;
    const claveAnterior = periodoAnterior(fila.periodo);
    const anual = porPeriodo.get(claveAnual); const anterior = porPeriodo.get(claveAnterior);
    const ventaActual = numero(fila.ventasNetasGerencial); const ventaAnual = numero(anual?.ventasNetasGerencial); const ventaAnterior = numero(anterior?.ventasNetasGerencial);
    return { ...fila, ventasAnioAnterior: ventaAnual, resultadoAnioAnterior: numero(anual?.resultadoGerencial), ventaMesAnterior: ventaAnterior, periodoMesAnterior: claveAnterior, mom: variacionPorcentual(ventaActual, ventaAnterior), yoy: variacionPorcentual(ventaActual, ventaAnual) };
  });
}
function sumarYtd(meses: MesHistorico[], anio: number, mesCorte: number) {
  const valores = meses.filter(fila => Number(fila.periodo.slice(0, 4)) === anio && Number(fila.periodo.slice(5, 7)) <= mesCorte).map(fila => numero(fila.ventasNetasGerencial)).filter((valor): valor is number => valor !== null);
  return valores.length ? valores.reduce((total, valor) => total + valor, 0) : null;
}

function ResumenComparativoMensual({ datos, historico }: { datos: Array<MesHistorico & { mom: number | null; yoy: number | null }>; historico: MesHistorico[] }) {
  const ultimo = datos.at(-1); if (!ultimo) return null;
  const anio = Number(ultimo.periodo.slice(0, 4)); const mes = Number(ultimo.periodo.slice(5, 7));
  const actual = numero(ultimo.ventasNetasGerencial); const ytdActual = sumarYtd(historico, anio, mes); const ytdAnterior = sumarYtd(historico, anio - 1, mes);
  const periodo = new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${ultimo.periodo}-01T00:00:00Z`));
  const item = (etiqueta: string, valor: string, destacado = false, detalle?: string) => <div className="min-w-0"><dt className={`text-[10px] font-black uppercase tracking-wide ${destacado ? 'text-[#b85e00]' : 'text-gray-500'}`}>{etiqueta}</dt><dd className="mt-1 break-words text-sm font-black text-gray-950 sm:text-base">{valor}</dd>{detalle && <p className="mt-0.5 text-[11px] capitalize text-gray-500">{detalle}</p>}</div>;
  return <dl className="mb-5 grid grid-cols-2 gap-x-4 gap-y-4 border-y border-gray-100 bg-gray-50/70 px-4 py-4 sm:grid-cols-3 xl:grid-cols-6">
    {item('Período actual', actual === null ? 'No disponible' : formatearDato(actual, 'monto'), false, periodo)}
    {item('MoM', porcentajeCorto(ultimo.mom))}
    {item('YoY', porcentajeCorto(ultimo.yoy), true)}
    {item(`YTD ${anio}`, ytdActual === null ? 'No disponible' : formatearDato(ytdActual, 'monto'))}
    {item(`YTD ${anio - 1}`, ytdAnterior === null ? 'No disponible' : formatearDato(ytdAnterior, 'monto'))}
    {item('Var. YTD', porcentajeCorto(variacionPorcentual(ytdActual, ytdAnterior)), true)}
  </dl>;
}

type ProductoEjecutivo = { nombre: string; unidades: number; ventaNetaClp: number | null; valor: number; participacion: number | null; color: string };
function componerProductosEjecutivos(productos: Record<string, unknown>[], metrica: string): ProductoEjecutivo[] {
  const filas = productos.map(item => {
    const unidades = numero(item.unidades) || 0; const ventaNetaClp = numero(item.montoClp);
    return { nombre: limpiarNombreProducto(item.familia), unidades, ventaNetaClp, valor: metrica === 'VALOR' ? ventaNetaClp || 0 : unidades };
  }).sort((a, b) => b.valor - a.valor || a.nombre.localeCompare(b.nombre, 'es'));
  const principales = filas.slice(0, 6); const restantes = filas.slice(6);
  if (restantes.length) {
    const ventasValidas = restantes.flatMap(item => item.ventaNetaClp === null ? [] : [item.ventaNetaClp]);
    const otros = { nombre: 'Otros', unidades: restantes.reduce((total, item) => total + item.unidades, 0), ventaNetaClp: ventasValidas.length ? ventasValidas.reduce((total, valor) => total + valor, 0) : null, valor: restantes.reduce((total, item) => total + item.valor, 0) };
    principales.push(otros);
  }
  const total = principales.reduce((suma, item) => suma + item.valor, 0);
  return principales.map((item, indice) => ({ ...item, participacion: total > 0 ? item.valor / total * 100 : null, color: PALETA_PRODUCTOS[indice % PALETA_PRODUCTOS.length] }));
}

function KpiVenta({ resumen, periodo, anio, mes }: { resumen?: Historico['resumenVentas']; periodo: string; anio: number; mes: number }) {
  const parcial = Boolean(resumen && (resumen.coberturaMes.excluidasSinTipoCambio > 0 || resumen.coberturaYtd.excluidasSinTipoCambio > 0 || resumen.coberturaYtdAnterior.excluidasSinTipoCambio > 0));
  const estado = resumen?.actual === null || resumen?.actual === undefined ? 'SIN_RESULTADOS' : parcial ? 'PARCIALMENTE_DISPONIBLE' : 'VALIDO';
  const mesCorto = new Intl.DateTimeFormat('es-CL', { month: 'short' }).format(new Date(anio, mes - 1, 1));
  return <article className="min-w-0 border-t-4 border-[#FE8F01] bg-white p-5 shadow-sm md:col-span-2 xl:col-span-6"><div className="flex items-start justify-between gap-3"><span className="rounded-md bg-orange-50 p-2 text-[#b85e00]"><ChartNoAxesCombined className="h-5 w-5" /></span><EstadoDato estado={estado} compacto /></div><p className="mt-4 text-xs font-bold uppercase tracking-wide text-[#676767]">Venta neta del mes</p><p className="mt-1 break-words text-3xl font-black text-black sm:text-4xl">{resumen?.actual === null || resumen?.actual === undefined ? 'No disponible' : formatearDato(resumen.actual, 'monto')}</p><p className="mt-1 text-xs capitalize text-gray-500">{periodo} · neto sin IVA</p><div className="mt-4 grid grid-cols-2 gap-3 border-y border-gray-100 py-3"><div><p className="text-xs font-semibold text-gray-500">MoM</p><p className="mt-0.5 text-base font-bold text-gray-900">{porcentajeCorto(resumen?.mom ?? null)}</p></div><div><p className="text-xs font-bold text-[#b85e00]">YoY</p><p className="mt-0.5 text-lg font-black text-black">{porcentajeCorto(resumen?.yoy ?? null)}</p></div></div><dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><div className="min-w-0"><dt className="text-xs text-gray-500">Acumulado {anio} · ene–{mesCorto}</dt><dd className="mt-1 break-words font-bold text-gray-900">{resumen?.acumuladoActual === null || resumen?.acumuladoActual === undefined ? 'No disponible' : formatearDato(resumen.acumuladoActual, 'monto')}</dd></div><div className="min-w-0"><dt className="text-xs text-gray-500">Acumulado {anio - 1} · ene–{mesCorto}</dt><dd className="mt-1 break-words font-bold text-gray-900">{resumen?.acumuladoAnterior === null || resumen?.acumuladoAnterior === undefined ? 'No disponible' : formatearDato(resumen.acumuladoAnterior, 'monto')}</dd></div></dl><p className="mt-3 text-xs font-semibold text-gray-700">Variación YTD: {porcentajeCorto(resumen?.variacionYtd ?? null)}</p>{parcial && <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900">Cobertura parcial por tipo de cambio histórico: {resumen?.coberturaYtd.excluidasSinTipoCambio} venta(s) excluida(s) en {anio} y {resumen?.coberturaYtdAnterior.excluidasSinTipoCambio} en {anio - 1}.</p>}</article>;
}

function Kpi({ titulo, valor, periodo, icono, estado, comparacion, descripcion }: { titulo: string; valor: number | null; periodo: string; icono: ReactNode; estado?: string; comparacion?: ReturnType<typeof comparar>; descripcion?: string }) {
  const variacion = (etiqueta: string, dato: { porcentaje: number } | null) => <p className="flex items-center justify-between gap-3"><span className="font-semibold text-gray-500">{etiqueta}</span><strong className={dato && dato.porcentaje < 0 ? 'text-red-700' : 'text-gray-900'}>{porcentajeCorto(dato?.porcentaje ?? null)}</strong></p>;
  return <article className="flex h-full min-w-0 flex-col border-t-4 border-[#FE8F01] bg-white p-4 shadow-sm sm:p-5"><div className="flex items-start justify-between gap-3"><span className="rounded-md bg-orange-50 p-2 text-[#b85e00]">{icono}</span><EstadoDato estado={estado} compacto /></div><p className="mt-4 text-xs font-bold uppercase text-[#676767]">{titulo}</p><p className="mt-1 break-words text-2xl font-bold text-black sm:text-3xl">{valor === null ? 'No disponible' : formatearDato(valor, 'monto')}</p><p className="mt-1 text-xs capitalize text-gray-500">{periodo}</p>{comparacion && <div className="mt-auto space-y-1.5 border-t border-gray-100 pt-3 text-xs">{variacion('MoM', comparacion.anterior)}{variacion('YoY', comparacion.anual)}</div>}{descripcion && <p className="mt-3 text-xs leading-5 text-gray-500">{descripcion}</p>}</article>;
}

function Seccion({ titulo, descripcion, children, ruta }: { titulo: string; descripcion?: string; children: ReactNode; ruta?: string }) {
  return <section className="border border-gray-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-5 flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-bold text-black">{titulo}</h2>{descripcion && <p className="mt-1 max-w-3xl text-sm text-gray-500">{descripcion}</p>}</div>{ruta && <Link to={ruta} className="inline-flex items-center gap-1 text-sm font-bold text-[#b85e00] hover:text-black">Ver detalle <ArrowRight className="h-4 w-4" /></Link>}</div>{children}</section>;
}

function ResumenCorte({ titulo, bloque, ruta, claves }: { titulo: string; bloque?: RespuestaM7; ruta: string; claves: string[] }) {
  const valor = buscarNumero(bloque, claves); const estado = estadoBloque(bloque);
  return <article className="flex min-w-0 flex-col border border-gray-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-2"><h3 className="text-sm font-bold text-black">{titulo}</h3><EstadoDato estado={estado} compacto /></div><p className="mt-3 break-words text-xl font-bold">{valor === null ? estadoHumano(estado) : formatearDato(valor, 'monto')}</p><Link to={ruta} className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-[#b85e00]">Ver detalle <ArrowRight className="h-4 w-4" /></Link></article>;
}

function EstadoResultadosPanel({ bloque }: { bloque?: RespuestaM7 }) {
  const indicador = esObjeto(bloque?.estadoResultados) ? bloque.estadoResultados : null;
  const valor = esObjeto(indicador?.valor) ? indicador.valor : null;
  const fila = (titulo: string, campo: string, resta = false) => {
    const monto = numero(valor?.[campo]);
    return <div className="flex min-w-0 items-center justify-between gap-4 border-b border-gray-100 py-3"><span className="text-sm font-semibold text-[#676767]">{resta ? '(−) ' : ''}{titulo}</span><strong className={`break-words text-right text-base ${monto !== null && monto < 0 ? 'text-red-700' : 'text-black'}`}>{monto === null ? 'No disponible' : resta ? `(${formatearDato(Math.abs(monto), 'monto')})` : formatearDato(monto, 'monto')}</strong></div>;
  };
  const ebitda = numero(valor?.ebitdaMonto); const porcentaje = numero(valor?.ebitdaPorcentaje);
  return <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,.9fr)]"><div className="flex min-w-0 flex-col justify-center">{fila('Ventas netas', 'ventasNetas')}{fila('Costo de venta', 'costoVenta', true)}{fila('Margen bruto', 'margenBruto')}{fila('Gastos operacionales', 'gastosOperacionales', true)}</div><aside className="flex min-w-0 flex-col justify-center border-l-4 border-[#FE8F01] bg-gray-50 p-5 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-wide text-[#676767]">EBITDA</p><EstadoDato estado={String(indicador?.estado || bloque?.estado || '')} compacto /></div><p className={`mt-3 break-words text-3xl font-black ${ebitda !== null && ebitda < 0 ? 'text-red-700' : 'text-black'}`}>{ebitda === null ? 'No calculable' : formatearDato(ebitda, 'monto')}</p><p className="mt-1 text-sm font-bold text-[#676767]">{porcentaje === null ? 'N/A sobre ventas' : `${porcentaje.toLocaleString('es-CL', { maximumFractionDigits: 1 })}% sobre ventas`}</p><p className="mt-3 max-w-md text-xs leading-5 text-gray-500">Requiere cobertura completa de gastos operacionales; los egresos de caja no los sustituyen.</p></aside></div>;
}

export default function PanelGeneralM7({ compacto = false }: { compacto?: boolean }) {
  const { sesion } = usarSesion();
  const consulta = usarConsultaM7('/dashboard-m7', true); const [versionHistorico, recargarHistorico] = useState(0); const [metricaProducto, setMetricaProducto] = useState('VALOR'); const historico = usarHistorico(consulta.anio, consulta.mes, consulta.segmento, versionHistorico);
  // MIDAS: pedimos 24 meses para comparar cada punto con el mismo mes anterior, pero conservamos 12 visibles.
  const bloques = (consulta.datos?.bloques || {}) as Record<string, RespuestaM7>; const mesesComparacion = historico.datos?.meses || []; const meses = mesesComparacion.slice(-12);
  const porPeriodo = new Map(mesesComparacion.map(fila => [fila.periodo, fila]));
  const mesesVentas = meses.map(fila => { const anterior = `${Number(fila.periodo.slice(0, 4)) - 1}${fila.periodo.slice(4)}`; return { ...fila, ventasAnioAnterior: porPeriodo.get(anterior)?.ventasNetas ?? null }; });
  const mesesGerenciales = prepararComparativoMensual(meses, mesesComparacion);
  const periodoTexto = useMemo(() => new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date(consulta.anio, consulta.mes - 1, 1)), [consulta.anio, consulta.mes]);
  const sinComparacion = { actual: null, anterior: null, anual: null }; const disponible = historico.datos?.disponibilidad || {};
  const flujo = disponible.flujo ? comparar(mesesComparacion, 'flujoNeto') : sinComparacion; const cxc = buscarNumero(bloques.cuentasCobrar, ['saldo']); const cxp = buscarNumero(bloques.cuentasPagar, ['saldo']);
  const indicadorProyeccion = esObjeto(bloques.liquidez?.proyeccion) ? bloques.liquidez.proyeccion : null; const valorProyeccion = esObjeto(indicadorProyeccion?.valor) ? indicadorProyeccion.valor : null;
  const totalesProyeccion = (Array.isArray(valorProyeccion?.totales) ? valorProyeccion.totales : []).filter(esObjeto); const proyeccionClp = totalesProyeccion.find(fila => fila.moneda === 'CLP');
  const ingresosProyectados = numero(proyeccionClp?.ingresosProyectados); const egresosProyectados = numero(proyeccionClp?.egresosProyectados); const flujoProyectado = numero(proyeccionClp?.flujoProyectadoNeto);
  const clientes = (historico.datos?.principalesClientes || []).map(cliente => ({ etiqueta: cliente.cliente, monto: cliente.monto, participacion: cliente.participacionPorcentual }));
  const indicadorModelos = esObjeto(bloques.ventas?.ventasPorFamilia) ? bloques.ventas.ventasPorFamilia : null;
  const productosBase = (Array.isArray(indicadorModelos?.valor) ? indicadorModelos.valor : []).filter(esObjeto);
  const productosEjecutivos = componerProductosEjecutivos(productosBase, metricaProducto);
  const modelos = productosEjecutivos.map(item => ({ nombre: item.nombre, valor: item.valor, color: item.color, porcentaje: item.participacion })).filter(item => item.valor > 0);
  const totalProductos = modelos.reduce((total, item) => total + item.valor, 0);
  const hayExclusionesProductos = productosBase.some(item => numero(item.montoClp) === null && (numero(item.unidades) || 0) > 0);
  const participacionSegmentos = (Array.isArray(bloques.ventas?.participacionSegmentos) ? bloques.ventas.participacionSegmentos : []).filter(esObjeto);
  const donutSegmentos = participacionSegmentos.map(item => ({ nombre: String(item.segmento || 'Sin clasificar'), valor: numero(item.montoClp) || 0 })).filter(item => item.valor > 0);
  const queryComercial = `anio=${consulta.anio}&mes=${consulta.mes}&segmento=${consulta.segmento}`;
  const puedeVerResumenes = Boolean(sesion?.permisos.some(permiso => permiso === 'CU238' || permiso === 'CU239'));
  const puedeVerResultados = Boolean(sesion?.permisos.includes('CU238'));
  const proyectos = buscarColeccion(bloques.margenProyectos, 'proyectos').map((proyecto, indice) => ({ etiqueta: String(proyecto.codigo || proyecto.nombre || `Proyecto ${indice + 1}`), ingresos: numero(proyecto.ingresosAtribuibles), costos: numero(proyecto.costosDirectosAtribuibles), margen: numero(proyecto.margenDirecto) })).filter(proyecto => proyecto.ingresos !== null || proyecto.costos !== null || proyecto.margen !== null).sort((a, b) => (b.ingresos || 0) - (a.ingresos || 0)).slice(0, 8);
  const costosProyecto = buscarColeccion(bloques.costosFabricacion, 'proyectos');
  const composicionCostos = [
    { nombre: 'Materiales', valor: costosProyecto.reduce((total, proyecto) => total + (numero(proyecto.materiales) || 0), 0) },
    { nombre: 'Remuneraciones atribuibles', valor: costosProyecto.reduce((total, proyecto) => total + (numero(proyecto.remuneracionesExtra) || 0), 0) },
    { nombre: 'Instalación configurada', valor: costosProyecto.reduce((total, proyecto) => total + (numero(proyecto.costoInstalacion) || 0), 0) },
  ].filter(item => item.valor > 0);
  const recargar = () => { consulta.recargar(); recargarHistorico(version => version + 1); }; const error = consulta.error || historico.error;
  return <div className="min-h-full bg-gray-50"><EncabezadoM7 titulo={compacto ? 'Dashboard Financiero' : 'Resumen gerencial'} descripcion="Indicadores del mes de corte y evolución real de los 12 meses terminados en ese período" /><Periodo anio={consulta.anio} mes={consulta.mes} cambiar={consulta.cambiar} cargando={consulta.cargando || historico.cargando} recargar={recargar} /><div className="mx-auto mt-3 max-w-7xl px-5 sm:px-8"><div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"><ControlSegmentado etiqueta="Segmento comercial" valor={consulta.segmento} cambiar={consulta.cambiarSegmento} opciones={[{ valor: 'TODOS', etiqueta: 'Todos' }, { valor: 'B2B', etiqueta: 'B2B' }, { valor: 'B2C', etiqueta: 'B2C' }]} /></div></div>{!compacto && <PdfDashboard origen="panel" anio={consulta.anio} mes={consulta.mes} segmento={consulta.segmento} />}{error && <div className="border-y border-red-200 bg-red-50 px-5 py-4 text-red-800">{error}</div>}
    <main className="mx-auto max-w-[1500px] space-y-5 px-4 py-6 sm:px-8"><section><p className="text-xs font-black uppercase tracking-wide text-[#b85e00]">Productividad / Resultados</p><h2 className="mt-1 text-xl font-black text-black">Ventas y rentabilidad</h2><div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-6"><KpiVenta resumen={disponible.ventas ? historico.datos?.resumenVentas : null} periodo={periodoTexto} anio={consulta.anio} mes={consulta.mes} /></div></section><section><p className="text-xs font-black uppercase tracking-wide text-[#676767]">Flujo / Liquidez</p><h2 className="mt-1 text-xl font-black text-black">Ejecutado y compromisos futuros</h2><div className="mt-3 grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3"><Kpi titulo="Ingresos proyectados" valor={ingresosProyectados} periodo="Compromisos CxC fechados" icono={<BanknoteArrowUp className="h-5 w-5" />} estado={String(indicadorProyeccion?.estado || '')}/><Kpi titulo="Egresos proyectados" valor={egresosProyectados} periodo="Compromisos CxP fechados" icono={<BanknoteArrowDown className="h-5 w-5" />} estado={String(indicadorProyeccion?.estado || '')}/><Kpi titulo="Flujo proyectado neto" valor={flujoProyectado} periodo="Entradas menos salidas comprometidas" icono={<ChartNoAxesCombined className="h-5 w-5" />} estado={String(indicadorProyeccion?.estado || '')}/><Kpi titulo="Cuentas por cobrar" valor={cxc} periodo="Saldo vigente" icono={<BanknoteArrowUp className="h-5 w-5" />} estado={estadoBloque(bloques.cuentasCobrar)}/><Kpi titulo="Cuentas por pagar" valor={cxp} periodo="Saldo vigente" icono={<BanknoteArrowDown className="h-5 w-5" />} estado={estadoBloque(bloques.cuentasPagar)}/><Kpi titulo="Flujo ejecutado" valor={flujo.actual} periodo={periodoTexto} icono={<Wallet className="h-5 w-5" />} estado={flujo.actual === null ? 'SIN_RESULTADOS' : 'VALIDO'} comparacion={flujo}/></div></section>
      <Seccion titulo="Ventas, costos y resultado — últimos 12 meses" descripcion="Evolución mensual y comparación con el mismo período del año anterior." ruta={puedeVerResumenes ? `/dashboard-m7/resumenes?anio=${consulta.anio}&mes=${consulta.mes}&segmento=${consulta.segmento}` : undefined}><ResumenComparativoMensual datos={mesesGerenciales} historico={mesesComparacion} /><GraficoComparativoMensual datos={mesesGerenciales} alto={compacto ? 280 : 360} /></Seccion>
      {!compacto && puedeVerResultados && bloques.resumenResultados && <Seccion titulo="Estado de Resultados" descripcion="Resumen gerencial neto de IVA. EBITDA sólo se calcula con cobertura completa de gastos operacionales, sin confundir pagos de caja con gasto." ruta={`/dashboard-m7/resumenes?anio=${consulta.anio}&mes=${consulta.mes}`}><EstadoResultadosPanel bloque={bloques.resumenResultados} /></Seccion>}
      {!compacto && indicadorModelos && <Seccion titulo="Productos vendidos" descripcion="Composición de ventas definitivas según el producto registrado y cantidad real del detalle." ruta={`/dashboard-m7/ventas?${queryComercial}&metrica=${metricaProducto}`}>
        <div className="mb-5 flex flex-wrap items-end gap-5 border-b border-gray-100 pb-4"><ControlSegmentado etiqueta="Métrica" valor={metricaProducto} cambiar={setMetricaProducto} opciones={[{ valor: 'VALOR', etiqueta: 'Valor' }, { valor: 'UNIDADES', etiqueta: 'Unidades' }]} /><ControlSegmentado etiqueta="Segmento" valor={consulta.segmento} cambiar={consulta.cambiarSegmento} opciones={[{ valor: 'TODOS', etiqueta: 'Todos' }, { valor: 'B2B', etiqueta: 'B2B' }, { valor: 'B2C', etiqueta: 'B2C' }]} /></div>
        <div className="grid items-center gap-6 md:grid-cols-[minmax(260px,.8fr)_minmax(0,1.2fr)]">
          <div className="flex min-w-0 items-center justify-center"><GraficoDonut datos={modelos} metrica={metricaProducto === 'VALOR' ? 'VALOR' : 'UNIDADES'} mostrarLeyenda={false} alto={300} radioInterior={76} radioExterior={112} centroEtiqueta={metricaProducto === 'VALOR' ? 'Total vendido' : 'Unidades'} centroValor={metricaProducto === 'VALOR' ? formatearDato(totalProductos, 'monto') : formatearDato(totalProductos)} /></div>
          <div className="min-w-0 overflow-x-auto"><table className="w-full min-w-[560px] table-fixed text-left text-sm"><colgroup><col className="w-[38%]"/><col className="w-[18%]"/><col className="w-[27%]"/><col className="w-[17%]"/></colgroup><thead className="border-b border-gray-200 text-xs uppercase text-gray-500"><tr><th className="pb-3 pr-3">Producto</th><th className="pb-3 text-right">Unidades</th><th className="pb-3 text-right">Venta neta</th><th className="pb-3 text-right">%</th></tr></thead><tbody>{productosEjecutivos.map(item => <tr key={item.nombre} className="border-b border-gray-100 last:border-b-0"><td className="py-3 pr-3"><NombreProducto nombre={item.nombre} color={item.color}/></td><td className="py-3 text-right tabular-nums">{formatearDato(item.unidades)}</td><td className="py-3 text-right tabular-nums">{item.ventaNetaClp === null ? 'Sin tipo de cambio' : formatearDato(item.ventaNetaClp, 'monto')}</td><td className="py-3 text-right font-bold tabular-nums text-[#9a4f00]">{formatearDato(item.participacion, 'participacionPorcentual')}</td></tr>)}</tbody></table></div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500"><EstadoDato estado={String(indicadorModelos.estado || '')} compacto /><span>{hayExclusionesProductos ? 'Algunas ventas no pudieron incluirse en el valor consolidado por falta de tipo de cambio histórico.' : 'Información disponible'}</span></div>
      </Seccion>}
      {!compacto && donutSegmentos.length > 0 && <Seccion titulo="Participación B2B vs B2C" descripcion="Valor neto comparable en CLP; las ventas sin tipo de cambio histórico no ingresan al porcentaje." ruta={`/dashboard-m7/ventas?${queryComercial}`}><div className="grid items-center gap-4 lg:grid-cols-2"><GraficoDonut datos={donutSegmentos} /> <div className="space-y-3">{participacionSegmentos.map(item => <div key={String(item.segmento)} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3"><div><strong>{String(item.segmento)}</strong><p className="text-xs text-gray-500">{formatearDato(item.ventas)} venta(s) · {formatearDato(item.excluidasSinTipoCambio)} sin tipo de cambio</p></div><div className="text-right"><strong>{formatearDato(item.montoClp, 'monto')}</strong><p className="text-sm font-bold text-[#b85e00]">{formatearDato(item.participacionPorcentual, 'participacionPorcentual')}</p></div></div>)}</div></div></Seccion>}
      {!compacto && <div className="grid gap-5 xl:grid-cols-2">{disponible.ventas && <Seccion titulo="Ventas mensuales — últimos 12 meses" descripcion="Barras del período actual y referencia del mismo mes del año anterior; montos netos consolidados en CLP." ruta={`/dashboard-m7/ventas?${queryComercial}`}><GraficoCombinado datos={mesesVentas} barras={[{ clave: 'ventasNetas', nombre: 'Período actual', color: '#FE8F01' }]} lineas={[{ clave: 'ventasAnioAnterior', nombre: 'Año anterior', color: '#676767' }]} /></Seccion>}{disponible.conversion && <Seccion titulo="Conversión de cotizaciones" descripcion="Cotizaciones emitidas y formalizadas como Nota de Venta; no es forecast." ruta={`/dashboard-m7/ventas?${queryComercial}`}><GraficoCombinado datos={meses} barras={[{ clave: 'cotizaciones', nombre: 'Cotizaciones', color: '#9ca3af' }, { clave: 'convertidas', nombre: 'Convertidas', color: '#FE8F01' }]} lineas={[{ clave: 'conversionPorcentual', nombre: 'Conversión', color: '#000000' }]} porcentaje /></Seccion>}{disponible.flujo && <Seccion titulo="Flujo de caja — últimos 12 meses" descripcion="Ingresos y egresos ejecutados desde movimiento financiero; agrega referencia presupuestada cuando existe." ruta={`/dashboard-m7/liquidez?anio=${consulta.anio}&mes=${consulta.mes}`}><GraficoCombinado datos={meses} barras={[{ clave: 'ingresosRecibidos', nombre: 'Ingreso real', color: '#FE8F01' }, { clave: 'egresosRealizados', nombre: 'Egreso real', color: '#676767' }]} lineas={[{ clave: 'flujoNeto', nombre: 'Flujo real', color: '#000000' }]} /></Seccion>}{disponible.remuneraciones && <Seccion titulo="Costo laboral — últimos 12 meses" descripcion="Haberes y aportes del empleador de remuneraciones oficiales cerradas." ruta={`/dashboard-m7/operacion?anio=${consulta.anio}&mes=${consulta.mes}`}><GraficoBarras datos={meses} series={[{ clave: 'costoRemuneraciones', nombre: 'Costo laboral', color: '#FE8F01' }]} etiqueta="periodo" /></Seccion>}{clientes.length > 0 && <Seccion titulo="Principales clientes por ventas" descripcion="Monto y participación sobre ventas netas comparables en CLP durante la ventana de 12 meses." ruta={`/dashboard-m7/ventas?${queryComercial}`}><GraficoBarras datos={clientes} series={[{ clave: 'monto', nombre: 'Ventas netas', color: '#FE8F01' }]} horizontal /><div className="mt-3 grid gap-2 sm:grid-cols-2">{clientes.slice(0, 6).map(cliente => <div key={cliente.etiqueta} className="flex items-center justify-between gap-3 border-b border-gray-100 py-2 text-sm"><span className="truncate font-semibold">{cliente.etiqueta}</span><strong className="shrink-0 text-[#b85e00]">{formatearDato(cliente.participacion, 'participacionPorcentual')}</strong></div>)}</div></Seccion>}{disponible.operacion && <Seccion titulo="Actividad operacional — últimos 12 meses" descripcion="Instalaciones cerradas, OT creadas e incidencias registradas; son registros operacionales, no un índice de desempeño." ruta={`/dashboard-m7/operacion?anio=${consulta.anio}&mes=${consulta.mes}`}><GraficoCombinado datos={meses} barras={[{ clave: 'instalaciones', nombre: 'Instalaciones', color: '#FE8F01' }, { clave: 'ordenesTrabajo', nombre: 'OT', color: '#676767' }]} lineas={[{ clave: 'incidencias', nombre: 'Incidencias', color: '#000000' }]} /></Seccion>}</div>}
      {!compacto && <><section><div className="mb-3"><p className="text-xs font-bold uppercase text-[#b85e00]">Análisis del corte</p><h2 className="mt-1 text-xl font-bold">Proyectos, crédito e inventario</h2></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><ResumenCorte titulo="Margen por proyecto" bloque={bloques.margenProyectos} ruta={`/dashboard-m7/margen-proyectos?anio=${consulta.anio}&mes=${consulta.mes}`} claves={['margenDirecto', 'resultado']} /><ResumenCorte titulo="Exposición crediticia" bloque={bloques.exposicionCredito} ruta={`/dashboard-m7/control?anio=${consulta.anio}&mes=${consulta.mes}`} claves={['exposicionUtilizada', 'utilizado']} /><ResumenCorte titulo="Inventario valorizado" bloque={bloques.inventarioValorizado} ruta={`/dashboard-m7/control?anio=${consulta.anio}&mes=${consulta.mes}`} claves={['valorTotal', 'valor']} /><ResumenCorte titulo="Centro de Atención" bloque={bloques.centroAtencion} ruta={`/dashboard-m7/centro-atencion?anio=${consulta.anio}&mes=${consulta.mes}`} claves={['cantidad', 'total']} /></div></section><div className="grid gap-5 xl:grid-cols-2">{proyectos.length > 0 && <Seccion titulo="Proyectos principales del corte" descripcion="Ingresos, costos directos y margen atribuibles. No constituye un score ni una decisión automática." ruta={`/dashboard-m7/margen-proyectos?anio=${consulta.anio}&mes=${consulta.mes}`}><GraficoBarras datos={proyectos} series={[{ clave: 'ingresos', nombre: 'Ingresos', color: '#FE8F01' }, { clave: 'costos', nombre: 'Costos directos', color: '#9ca3af' }, { clave: 'margen', nombre: 'Margen', color: '#000000' }]} horizontal /></Seccion>}{composicionCostos.length > 0 && <Seccion titulo="Composición de costos directos" descripcion="Sólo materiales, remuneraciones atribuibles e instalación configurada. No representa gastos totales." ruta={`/dashboard-m7/control?anio=${consulta.anio}&mes=${consulta.mes}`}><GraficoDonut datos={composicionCostos} /></Seccion>}</div>{bloques.exposicionCredito && <Seccion titulo="Crédito al corte" descripcion="Información proveniente del módulo de Crédito; no se recalcula Crédito ni se fabrica histórico mensual." ruta={`/dashboard-m7/control?anio=${consulta.anio}&mes=${consulta.mes}`}><div className="grid gap-5 lg:grid-cols-2"><GraficoProgreso utilizado={buscarNumero(bloques.exposicionCredito, ['exposicionUtilizada', 'utilizado']) || 0} disponible={buscarNumero(bloques.exposicionCredito, ['capacidadDisponible', 'disponible']) || 0} /><div className="grid grid-cols-2 gap-3"><ResumenCorte titulo="Clientes sobre cupo" bloque={bloques.exposicionCredito} ruta={`/dashboard-m7/control?anio=${consulta.anio}&mes=${consulta.mes}`} claves={['clientesSobreLimite', 'sobrecupo']} /><ResumenCorte titulo="Alertas" bloque={bloques.alertasCredito} ruta={`/dashboard-m7/control?anio=${consulta.anio}&mes=${consulta.mes}`} claves={['cantidad', 'total']} /></div></div></Seccion>}</>}
      {!consulta.cargando && !historico.cargando && !meses.length && !error && <EstadoSinDatos texto="No hay información histórica habilitada para esta cuenta." />}
    </main></div>;
}
