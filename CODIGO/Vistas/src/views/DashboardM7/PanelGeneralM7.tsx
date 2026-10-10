import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, BanknoteArrowDown, BanknoteArrowUp, ChartNoAxesCombined, Wallet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { solicitarFinanzas } from '../../api/finanzas';
import { ControlSegmentado, EncabezadoM7, PdfDashboard, EstadoDato, estadoHumano, formatearDato, usarConsultaM7 } from './componentes';
import type { RespuestaM7 } from './componentes';
import { EstadoSinDatos, GraficoBarras, GraficoCombinado, GraficoComparativoMensual, GraficoDonut, GraficoPeriodosVentas, GraficoProgreso, GraficoRangoVentas, TooltipConversionCotizaciones } from './graficos';
import type { DatoGrafico } from './graficos';
import { usarSesion } from '../../seguridad/Sesion';
import { NombreProducto, PALETA_PRODUCTOS, limpiarNombreProducto } from './presentacionProductos';
import { FiltroTemporalMaestro, leerContextoTemporalM7, parametrosContextoTemporalM7, parametrosTemporalesVentas, type ContextoTemporalM7, type FiltrosTemporalesVentas } from './filtrosTemporalesVentas';

type MesHistorico = DatoGrafico & {
  periodo: string; ventasNetas: number | null; ventasNetasGerencial?: number | null; cantidadVentas: number; cotizaciones: number; convertidas: number;
  ventasIncluidasClp: number; ventasExcluidasSinTipoCambio: number; ventasAnioAnterior?: number | null;
  periodoConversionAnioAnterior?: string; cotizacionesAnioAnterior?: number | null; convertidasAnioAnterior?: number | null; conversionAnioAnterior?: number | null; diferenciaConversionPp?: number | null;
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
const tasaCorta = (valor: number | null) => valor === null ? 'N/A' : `${valor.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;
const puntosPorcentuales = (actual: number | null, base: number | null) => actual === null || base === null ? null : actual - base;
const puntosPorcentualesCortos = (valor: number | null) => { if (valor === null) return 'N/A'; const normalizado = Object.is(valor, -0) ? 0 : valor; return `${normalizado >= 0 ? '+' : ''}${normalizado.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} pp`; };

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
function prepararComparativoConversionMensual(visibles: MesHistorico[], historico: MesHistorico[]) {
  const porPeriodo = new Map(historico.map(fila => [fila.periodo, fila]));
  return visibles.map(fila => {
    const periodoConversionAnioAnterior = `${Number(fila.periodo.slice(0, 4)) - 1}${fila.periodo.slice(4)}`;
    const anterior = porPeriodo.get(periodoConversionAnioAnterior);
    const conversionActual = numero(fila.conversionPorcentual);
    const conversionAnioAnterior = numero(anterior?.conversionPorcentual);
    return { ...fila, periodoConversionAnioAnterior, cotizacionesAnioAnterior: anterior ? numero(anterior.cotizaciones) : null, convertidasAnioAnterior: anterior ? numero(anterior.convertidas) : null, conversionAnioAnterior, diferenciaConversionPp: puntosPorcentuales(conversionActual, conversionAnioAnterior) };
  });
}

function ResumenConversionInteranual({ fila }: { fila?: MesHistorico }) {
  if (!fila) return <div className="mb-4 rounded-md bg-gray-50 p-4 text-sm text-gray-500">No existe información de conversión para el mes de corte seleccionado.</div>;
  const actual = numero(fila.conversionPorcentual); const anterior = numero(fila.conversionAnioAnterior); const diferencia = numero(fila.diferenciaConversionPp);
  const bloque = (titulo: string, valor: string, destacado = false) => <div className="min-w-0"><dt className={`text-[10px] font-black uppercase tracking-wide ${destacado ? 'text-[#9a4f00]' : 'text-gray-500'}`}>{titulo}</dt><dd className="mt-1 text-lg font-black text-gray-950">{valor}</dd></div>;
  return <dl className="mb-4 grid gap-3 border-y border-gray-100 bg-gray-50 p-4 sm:grid-cols-3">{bloque(`Conversión ${periodoMesHumano(fila.periodo)}`, tasaCorta(actual), true)}{bloque(periodoMesHumano(String(fila.periodoConversionAnioAnterior || 'Año anterior')), tasaCorta(anterior))}{bloque('YoY', puntosPorcentualesCortos(diferencia), true)}</dl>;
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

function valorEstadoResultados(bloque: RespuestaM7 | undefined, campo: string) {
  const indicador = esObjeto(bloque?.estadoResultados) ? bloque.estadoResultados : null;
  const valor = esObjeto(indicador?.valor) ? indicador.valor : null;
  return numero(valor?.[campo]);
}

function ComparacionIndicador({ titulo, valorA, valorB, nota }: { titulo: string; valorA: number | null; valorB: number | null; nota?: string }) {
  const diferencia = valorA === null || valorB === null ? null : valorB - valorA;
  const variacion = variacionPorcentual(valorB, valorA);
  return <article className="min-w-0 border border-gray-200 bg-white p-4 shadow-sm"><p className="text-xs font-black uppercase text-[#676767]">{titulo}</p><dl className="mt-3 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-xs text-gray-500">Período A</dt><dd className="mt-1 break-words font-bold">{valorA === null ? 'No disponible' : formatearDato(valorA, 'monto')}</dd></div><div><dt className="text-xs text-gray-500">Período B</dt><dd className="mt-1 break-words font-bold">{valorB === null ? 'No disponible' : formatearDato(valorB, 'monto')}</dd></div><div><dt className="text-xs text-gray-500">Diferencia B − A</dt><dd className="mt-1 break-words font-bold">{diferencia === null ? 'N/A' : formatearDato(diferencia, 'monto')}</dd></div><div><dt className="text-xs text-[#9a4f00]">Variación</dt><dd className="mt-1 font-black">{porcentajeCorto(variacion)}</dd></div></dl>{nota && <p className="mt-3 text-xs leading-5 text-gray-500">{nota}</p>}</article>;
}

function EstadoResultadosComparado({ bloqueA, bloqueB }: { bloqueA?: RespuestaM7; bloqueB?: RespuestaM7 }) {
  const campos = [['Ventas netas', 'ventasNetas'], ['Costo de venta', 'costoVenta'], ['Margen bruto', 'margenBruto'], ['Gastos operacionales', 'gastosOperacionales'], ['EBITDA', 'ebitdaMonto']] as const;
  return <div><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{campos.map(([titulo, campo]) => <ComparacionIndicador key={campo} titulo={titulo} valorA={valorEstadoResultados(bloqueA, campo)} valorB={valorEstadoResultados(bloqueB, campo)} />)}</div><p className="mt-3 rounded-md bg-amber-50 p-3 text-xs leading-5 text-amber-900">Los gastos operacionales y EBITDA permanecen no disponibles cuando no existe cobertura estructurada completa; no se reemplazan por cero.</p></div>;
}

function productosComparados(bloqueA?: RespuestaM7, bloqueB?: RespuestaM7) {
  const filas = (bloque?: RespuestaM7) => {
    const indicadorFamilias = esObjeto(bloque?.ventasPorFamilia) ? bloque.ventasPorFamilia : null;
    return (Array.isArray(indicadorFamilias?.valor) ? indicadorFamilias.valor : []).filter(esObjeto);
  };
  const mapa = new Map<string, { etiqueta: string; periodoA: number; periodoB: number }>();
  for (const [clave, bloque] of [['periodoA', bloqueA], ['periodoB', bloqueB]] as const) for (const fila of filas(bloque)) {
    const etiqueta = limpiarNombreProducto(fila.familia); const actual = mapa.get(etiqueta) || { etiqueta, periodoA: 0, periodoB: 0 };
    actual[clave] = numero(fila.montoClp) || 0; mapa.set(etiqueta, actual);
  }
  const ordenadas = [...mapa.values()].sort((a, b) => (b.periodoA + b.periodoB) - (a.periodoA + a.periodoB));
  const principales = ordenadas.slice(0, 6); const resto = ordenadas.slice(6);
  if (resto.length) principales.push({ etiqueta: 'Otros', periodoA: resto.reduce((s, f) => s + f.periodoA, 0), periodoB: resto.reduce((s, f) => s + f.periodoB, 0) });
  return principales;
}

const diasRango = (desde: string, hasta: string) => Math.floor((new Date(`${hasta}T00:00:00Z`).getTime() - new Date(`${desde}T00:00:00Z`).getTime()) / 86400000) + 1;
const fechaRangoHumana = (desde: string, hasta: string) => `${new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${desde}T00:00:00Z`))} – ${new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${hasta}T00:00:00Z`))}`;
const periodoMesHumano = (periodo: string) => /^\d{4}-\d{2}$/.test(periodo) ? new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${periodo}-01T00:00:00Z`)) : periodo;

function valoresConversion(datos: unknown) {
  const indicadorConversion = esObjeto(datos) && esObjeto(datos.conversion) ? datos.conversion : null;
  const valor = esObjeto(indicadorConversion?.valor) ? indicadorConversion.valor : null;
  return { cotizaciones: numero(valor?.totalCotizaciones), convertidas: numero(valor?.convertidas), tasa: numero(valor?.tasaPorcentual) };
}

function BandaTemporalVentas({ filtros, datos }: { filtros: FiltrosTemporalesVentas; datos: RespuestaM7 }) {
  const item = (etiqueta: string, valor: string, destacado = false) => <div className="min-w-0"><dt className={`text-[10px] font-black uppercase ${destacado ? 'text-[#9a4f00]' : 'text-gray-500'}`}>{etiqueta}</dt><dd className="mt-1 break-words text-sm font-black text-gray-950">{valor}</dd></div>;
  if (filtros.modo === 'rango') {
    const dias = diasRango(filtros.desde, filtros.hasta); const venta = buscarNumero(datos, ['totalClp']); const cantidad = buscarNumero(datos, ['cantidad']); const ticket = buscarNumero(datos, ['ticketMedio', 'totalClp']);
    const conversion = valoresConversion(datos);
    return <dl className="mb-5 grid gap-4 border-y border-gray-100 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">{item('Período', fechaRangoHumana(filtros.desde, filtros.hasta))}{item('Venta neta', venta === null ? 'No disponible' : formatearDato(venta, 'monto'), true)}{item('Ventas', formatearDato(cantidad))}{item('Ticket promedio', ticket === null ? 'N/A' : formatearDato(ticket, 'monto'))}{item('Promedio diario', venta === null ? 'N/A' : formatearDato(venta / dias, 'monto'))}{item('Cotizaciones', formatearDato(conversion.cotizaciones))}{item('Convertidas', formatearDato(conversion.convertidas))}{item('Conversión', tasaCorta(conversion.tasa), true)}</dl>;
  }
  if (filtros.modo === 'comparar') {
    const a = esObjeto(datos.periodoA) ? datos.periodoA : {}; const b = esObjeto(datos.periodoB) ? datos.periodoB : {}; const resumen = esObjeto(datos.resumen) ? datos.resumen : {}; const total = esObjeto(resumen.total) ? resumen.total : {}; const promedio = esObjeto(resumen.promedio) ? resumen.promedio : {}; const diario = resumen.granularidad === 'dia';
    const conversionA = valoresConversion(a); const conversionB = valoresConversion(b); const diferenciaConversion = puntosPorcentuales(conversionB.tasa, conversionA.tasa);
    const tarjeta = (nombre: string, periodo: Record<string, unknown>, desde: string, hasta: string, color: string, promedioValor: unknown) => <div className={`border-l-4 bg-white p-3 ${color}`}><p className="text-[10px] font-black uppercase text-gray-500">{nombre}</p><p className="mt-1 text-xs text-gray-500">{fechaRangoHumana(desde, hasta)} · {diasRango(desde, hasta)} días</p><p className="mt-2 text-lg font-black">{formatearDato(buscarNumero(periodo, ['totalClp']), 'monto')}</p><p className="mt-1 text-xs text-gray-600">Promedio {diario ? 'diario' : 'mensual'}: <strong>{formatearDato(promedioValor, 'monto')}</strong></p></div>;
    return <div className="mb-5"><div className="grid gap-3 lg:grid-cols-2">{tarjeta('Período A', a, filtros.desdeA, filtros.hastaA, 'border-[#676767]', resumen.promedioA)}{tarjeta('Período B', b, filtros.desdeB, filtros.hastaB, 'border-[#FE8F01]', resumen.promedioB)}</div><dl className="mt-3 grid gap-3 bg-gray-50 p-4 sm:grid-cols-2 lg:grid-cols-5">{item('Variación total B vs A', porcentajeCorto(numero(total.variacionPorcentual)), true)}{item(`Variación promedio ${diario ? 'diario' : 'mensual'}`, porcentajeCorto(numero(promedio.variacionPorcentual)), true)}{item('Conversión A', tasaCorta(conversionA.tasa))}{item('Conversión B', tasaCorta(conversionB.tasa))}{item('Diferencia de conversión B vs A', puntosPorcentualesCortos(diferenciaConversion), true)}</dl></div>;
  }
  return null;
}

export default function PanelGeneralM7({ compacto = false }: { compacto?: boolean }) {
  const { sesion } = usarSesion();
  const location = useLocation();
  const hoy = new Date();
  const [contexto, setContexto] = useState<ContextoTemporalM7>(() => leerContextoTemporalM7(location.search, hoy.getFullYear(), hoy.getMonth() + 1));
  useEffect(() => setContexto(leerContextoTemporalM7(location.search, hoy.getFullYear(), hoy.getMonth() + 1)), [location.search]);
  const consulta = usarConsultaM7('/dashboard-m7', true, parametrosTemporalesVentas(contexto)); const [versionHistorico, recargarHistorico] = useState(0); const [metricaProducto, setMetricaProducto] = useState('VALOR'); const historico = usarHistorico(consulta.anio, consulta.mes, consulta.segmento, versionHistorico);
  const ventasTemporal = usarConsultaM7('/dashboard-m7/ventas', false, parametrosTemporalesVentas(contexto));
  // MIDAS: pedimos 24 meses para comparar cada punto con el mismo mes anterior, pero conservamos 12 visibles.
  const panelComparado = consulta.datos?.modo === 'comparar';
  const panelA = panelComparado && esObjeto(consulta.datos?.periodoA) ? consulta.datos.periodoA as RespuestaM7 : null;
  const panelActivo = panelComparado && esObjeto(consulta.datos?.periodoB) ? consulta.datos.periodoB as RespuestaM7 : consulta.datos;
  const bloquesA = (panelA?.bloques || {}) as Record<string, RespuestaM7>;
  const bloques = (panelActivo?.bloques || {}) as Record<string, RespuestaM7>; const mesesComparacion = historico.datos?.meses || []; const meses = mesesComparacion.slice(-12);
  const porPeriodo = new Map(mesesComparacion.map(fila => [fila.periodo, fila]));
  const mesesVentas = meses.map(fila => { const anterior = `${Number(fila.periodo.slice(0, 4)) - 1}${fila.periodo.slice(4)}`; return { ...fila, ventasAnioAnterior: porPeriodo.get(anterior)?.ventasNetas ?? null }; });
  const mesesConversion = prepararComparativoConversionMensual(meses, mesesComparacion);
  const periodoCorte = `${consulta.anio}-${String(consulta.mes).padStart(2, '0')}`;
  const conversionCorte = mesesConversion.find(fila => fila.periodo === periodoCorte);
  const mesesGerenciales = prepararComparativoMensual(meses, mesesComparacion);
  const periodoTexto = useMemo(() => new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(new Date(consulta.anio, consulta.mes - 1, 1)), [consulta.anio, consulta.mes]);
  const disponible = historico.datos?.disponibilidad || {};
  const flujoBloque = (bloque?: RespuestaM7) => buscarNumero(bloque, ['flujoReal', 'flujoNeto']);
  const flujo = contexto.modo === 'mes' && disponible.flujo ? comparar(mesesComparacion, 'flujoNeto') : { actual: flujoBloque(bloques.liquidez), anterior: null, anual: null }; const flujoA = flujoBloque(bloquesA.liquidez); const cxc = buscarNumero(bloques.cuentasCobrar, ['saldo']); const cxp = buscarNumero(bloques.cuentasPagar, ['saldo']);
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
  const queryComercial = new URLSearchParams(parametrosContextoTemporalM7(contexto)).toString();
  const puedeVerResultados = Boolean(sesion?.permisos.includes('CU238'));
  const proyectos = buscarColeccion(bloques.margenProyectos, 'proyectos').map((proyecto, indice) => ({ etiqueta: String(proyecto.codigo || proyecto.nombre || `Proyecto ${indice + 1}`), ingresos: numero(proyecto.ingresosAtribuibles), costos: numero(proyecto.costosDirectosAtribuibles), margen: numero(proyecto.margenDirecto) })).filter(proyecto => proyecto.ingresos !== null || proyecto.costos !== null || proyecto.margen !== null).sort((a, b) => (b.ingresos || 0) - (a.ingresos || 0)).slice(0, 8);
  const costosProyecto = buscarColeccion(bloques.costosFabricacion, 'proyectos');
  const composicionCostos = [
    { nombre: 'Materiales', valor: costosProyecto.reduce((total, proyecto) => total + (numero(proyecto.materiales) || 0), 0) },
    { nombre: 'Remuneraciones atribuibles', valor: costosProyecto.reduce((total, proyecto) => total + (numero(proyecto.remuneracionesExtra) || 0), 0) },
    { nombre: 'Instalación configurada', valor: costosProyecto.reduce((total, proyecto) => total + (numero(proyecto.costoInstalacion) || 0), 0) },
  ].filter(item => item.valor > 0);
  const aplicarContexto = (siguiente: ContextoTemporalM7) => { setContexto(siguiente); consulta.reemplazarParametros(parametrosContextoTemporalM7(siguiente), ['modo', 'desde', 'hasta', 'desdeA', 'hastaA', 'desdeB', 'hastaB', 'anio', 'mes', 'segmento']); };
  const recargar = () => { consulta.recargar(); ventasTemporal.recargar(); recargarHistorico(version => version + 1); }; const error = consulta.error || historico.error || ventasTemporal.error;
  const respuestaTemporal = ventasTemporal.datos || {}; const resumenTemporalComparado = esObjeto(respuestaTemporal.resumen) ? respuestaTemporal.resumen : null;
  const serieTemporal = (Array.isArray(respuestaTemporal.serieComparativa) ? respuestaTemporal.serieComparativa : []) as DatoGrafico[];
  const datosRango = (Array.isArray(respuestaTemporal.serieTemporal) ? respuestaTemporal.serieTemporal : []) as DatoGrafico[];
  const granularidadTemporal = respuestaTemporal.granularidad === 'dia' ? 'dia' : 'mes';
  const productosComparacion = productosComparados(bloquesA.ventas, bloques.ventas);
  return <div className="min-h-full bg-gray-50"><EncabezadoM7 titulo={compacto ? 'Dashboard Financiero' : 'Resumen gerencial'} descripcion="Indicadores financieros y comerciales según el período de análisis aplicado" /><div className="mx-auto mt-5 max-w-7xl px-5 sm:px-8"><FiltroTemporalMaestro valor={contexto} aplicar={aplicarContexto} actualizar={recargar} cargando={consulta.cargando || historico.cargando || ventasTemporal.cargando}/></div>{!compacto && <PdfDashboard origen="panel" anio={consulta.anio} mes={consulta.mes} segmento={consulta.segmento} consulta={parametrosContextoTemporalM7(contexto)} />}{error && <div className="border-y border-red-200 bg-red-50 px-5 py-4 text-red-800">{error}</div>}
    <main className="mx-auto max-w-[1500px] space-y-5 px-4 py-6 sm:px-8"><section><p className="text-xs font-black uppercase tracking-wide text-[#b85e00]">Productividad / Resultados</p><h2 className="mt-1 text-xl font-black text-black">Ventas y rentabilidad</h2><div className="mt-3">{contexto.modo === 'mes' ? <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6"><KpiVenta resumen={disponible.ventas ? historico.datos?.resumenVentas : null} periodo={periodoTexto} anio={consulta.anio} mes={consulta.mes} /></div> : <div className="border-t-4 border-[#FE8F01] bg-white p-5 shadow-sm"><BandaTemporalVentas filtros={contexto} datos={respuestaTemporal}/></div>}</div></section><section><p className="text-xs font-black uppercase tracking-wide text-[#676767]">Flujo / Liquidez</p><h2 className="mt-1 text-xl font-black text-black">Ejecutado y compromisos futuros</h2>{contexto.modo === 'comparar' && <div className="mt-3"><ComparacionIndicador titulo="Flujo ejecutado" valorA={flujoA} valorB={flujo.actual} nota="Calculado únicamente con movimientos financieros reales fechados en cada período."/></div>}<div className="mt-3 grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3"><Kpi titulo="Ingresos proyectados" valor={ingresosProyectados} periodo="Compromisos CxC fechados en el contexto activo" icono={<BanknoteArrowUp className="h-5 w-5" />} estado={String(indicadorProyeccion?.estado || '')}/><Kpi titulo="Egresos proyectados" valor={egresosProyectados} periodo="Compromisos CxP fechados en el contexto activo" icono={<BanknoteArrowDown className="h-5 w-5" />} estado={String(indicadorProyeccion?.estado || '')}/><Kpi titulo="Flujo proyectado neto" valor={flujoProyectado} periodo="Entradas menos salidas comprometidas" icono={<ChartNoAxesCombined className="h-5 w-5" />} estado={String(indicadorProyeccion?.estado || '')}/><Kpi titulo="Cuentas por cobrar · saldo actual" valor={cxc} periodo="Estado actual; histórico no disponible" icono={<BanknoteArrowUp className="h-5 w-5" />} estado={estadoBloque(bloques.cuentasCobrar)}/><Kpi titulo="Cuentas por pagar · saldo actual" valor={cxp} periodo="Estado actual; histórico no disponible" icono={<BanknoteArrowDown className="h-5 w-5" />} estado={estadoBloque(bloques.cuentasPagar)}/>{contexto.modo !== 'comparar' && <Kpi titulo="Flujo ejecutado" valor={flujo.actual} periodo={contexto.modo === 'mes' ? periodoTexto : 'Período aplicado'} icono={<Wallet className="h-5 w-5" />} estado={flujo.actual === null ? 'SIN_RESULTADOS' : 'VALIDO'} comparacion={contexto.modo === 'mes' ? flujo : undefined}/>}</div></section>
      <Seccion titulo={contexto.modo === 'comparar' ? 'Ventas — Período B vs Período A' : contexto.modo === 'rango' ? 'Ventas — rango personalizado' : 'Ventas, costos y resultado — últimos 12 meses'} descripcion={contexto.modo === 'mes' ? 'Evolución mensual y comparación con el mismo período del año anterior.' : 'Análisis temporal de ventas netas con el filtro superior aplicado a todo el Dashboard.'} ruta={`/dashboard-m7/ventas?${queryComercial}`}>{contexto.modo === 'mes' ? <><ResumenComparativoMensual datos={mesesGerenciales} historico={mesesComparacion} /><GraficoComparativoMensual datos={mesesGerenciales} alto={compacto ? 280 : 360} /></> : <>{contexto.modo === 'comparar' ? <>{resumenTemporalComparado?.duracionComparable === false && <p className="mb-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">Los períodos tienen distinta duración. La variación total se conserva como referencia; el promedio {granularidadTemporal === 'dia' ? 'diario' : 'mensual'} permite comparar el ritmo.</p>}<GraficoPeriodosVentas datos={serieTemporal}/></> : <GraficoRangoVentas datos={datosRango} granularidad={granularidadTemporal}/>}</>}</Seccion>
      {!compacto && puedeVerResultados && bloques.resumenResultados && <Seccion titulo={contexto.modo === 'comparar' ? 'Estado de Resultados · comparación' : 'Estado de Resultados'} descripcion="Resumen gerencial neto de IVA. EBITDA sólo se calcula con cobertura completa de gastos operacionales, sin confundir pagos de caja con gasto." ruta={`/dashboard-m7/resumenes?${queryComercial}`}>{contexto.modo === 'comparar' ? <EstadoResultadosComparado bloqueA={bloquesA.resumenResultados} bloqueB={bloques.resumenResultados}/> : <EstadoResultadosPanel bloque={bloques.resumenResultados} />}</Seccion>}
      {!compacto && indicadorModelos && <Seccion titulo="Productos vendidos" descripcion="Composición de ventas definitivas según el producto registrado y cantidad real del detalle." ruta={`/dashboard-m7/ventas?${queryComercial}&metrica=${metricaProducto}`}>
        {contexto.modo === 'comparar' ? <><p className="mb-4 text-sm text-gray-500">Comparación por valor neto consolidable. Se muestran los seis productos principales combinados y “Otros”.</p><GraficoBarras datos={productosComparacion} series={[{ clave: 'periodoA', nombre: 'Período A', color: '#676767' }, { clave: 'periodoB', nombre: 'Período B', color: '#FE8F01' }]} etiqueta="etiqueta" horizontal /></> : <><div className="mb-5 flex flex-wrap items-end gap-5 border-b border-gray-100 pb-4"><ControlSegmentado etiqueta="Métrica" valor={metricaProducto} cambiar={setMetricaProducto} opciones={[{ valor: 'VALOR', etiqueta: 'Valor' }, { valor: 'UNIDADES', etiqueta: 'Unidades' }]} /></div>
        <div className="grid items-center gap-6 md:grid-cols-[minmax(260px,.8fr)_minmax(0,1.2fr)]">
          <div className="flex min-w-0 items-center justify-center"><GraficoDonut datos={modelos} metrica={metricaProducto === 'VALOR' ? 'VALOR' : 'UNIDADES'} mostrarLeyenda={false} alto={300} radioInterior={76} radioExterior={112} centroEtiqueta={metricaProducto === 'VALOR' ? 'Total vendido' : 'Unidades'} centroValor={metricaProducto === 'VALOR' ? formatearDato(totalProductos, 'monto') : formatearDato(totalProductos)} /></div>
          <div className="min-w-0 overflow-x-auto"><table className="w-full min-w-[560px] table-fixed text-left text-sm"><colgroup><col className="w-[38%]"/><col className="w-[18%]"/><col className="w-[27%]"/><col className="w-[17%]"/></colgroup><thead className="border-b border-gray-200 text-xs uppercase text-gray-500"><tr><th className="pb-3 pr-3">Producto</th><th className="pb-3 text-right">Unidades</th><th className="pb-3 text-right">Venta neta</th><th className="pb-3 text-right">%</th></tr></thead><tbody>{productosEjecutivos.map(item => <tr key={item.nombre} className="border-b border-gray-100 last:border-b-0"><td className="py-3 pr-3"><NombreProducto nombre={item.nombre} color={item.color}/></td><td className="py-3 text-right tabular-nums">{formatearDato(item.unidades)}</td><td className="py-3 text-right tabular-nums">{item.ventaNetaClp === null ? 'Sin tipo de cambio' : formatearDato(item.ventaNetaClp, 'monto')}</td><td className="py-3 text-right font-bold tabular-nums text-[#9a4f00]">{formatearDato(item.participacion, 'participacionPorcentual')}</td></tr>)}</tbody></table></div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-500"><EstadoDato estado={String(indicadorModelos.estado || '')} compacto /><span>{hayExclusionesProductos ? 'Algunas ventas no pudieron incluirse en el valor consolidado por falta de tipo de cambio histórico.' : 'Información disponible'}</span></div></>}
      </Seccion>}
      {!compacto && donutSegmentos.length > 0 && <Seccion titulo="Participación B2B vs B2C" descripcion="Valor neto comparable en CLP; las ventas sin tipo de cambio histórico no ingresan al porcentaje." ruta={`/dashboard-m7/ventas?${queryComercial}`}><div className="grid items-center gap-4 lg:grid-cols-2"><GraficoDonut datos={donutSegmentos} /> <div className="space-y-3">{participacionSegmentos.map(item => <div key={String(item.segmento)} className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3"><div><strong>{String(item.segmento)}</strong><p className="text-xs text-gray-500">{formatearDato(item.ventas)} venta(s) · {formatearDato(item.excluidasSinTipoCambio)} sin tipo de cambio</p></div><div className="text-right"><strong>{formatearDato(item.montoClp, 'monto')}</strong><p className="text-sm font-bold text-[#b85e00]">{formatearDato(item.participacionPorcentual, 'participacionPorcentual')}</p></div></div>)}</div></div></Seccion>}
      {!compacto && contexto.modo === 'mes' && <div className="grid gap-5 xl:grid-cols-2">{disponible.ventas && <Seccion titulo="Ventas mensuales — últimos 12 meses" descripcion="Barras del período actual y referencia del mismo mes del año anterior; montos netos consolidados en CLP." ruta={`/dashboard-m7/ventas?${queryComercial}`}><GraficoCombinado datos={mesesVentas} barras={[{ clave: 'ventasNetas', nombre: 'Período actual', color: '#FE8F01' }]} lineas={[{ clave: 'ventasAnioAnterior', nombre: 'Año anterior', color: '#676767' }]} /></Seccion>}{disponible.conversion && <Seccion titulo="Conversión de cotizaciones" descripcion="Cohorte por mes de emisión y estado de conversión disponible al consultar; no corresponde a un snapshot histórico de cierre." ruta={`/dashboard-m7/ventas?${queryComercial}`}><ResumenConversionInteranual fila={conversionCorte}/><GraficoCombinado datos={mesesConversion} barras={[{ clave: 'cotizaciones', nombre: 'Cotizaciones', color: '#d1d5db' }, { clave: 'convertidas', nombre: 'Convertidas', color: '#FE8F01' }]} lineas={[{ clave: 'conversionPorcentual', nombre: 'Conversión actual', color: '#000000' }, { clave: 'conversionAnioAnterior', nombre: 'Conversión año anterior', color: '#676767', discontinua: true }]} porcentaje tooltipPersonalizado={<TooltipConversionCotizaciones/>} /></Seccion>}{disponible.flujo && <Seccion titulo="Flujo de caja — últimos 12 meses" descripcion="Ingresos y egresos ejecutados desde movimiento financiero; agrega referencia presupuestada cuando existe." ruta={`/dashboard-m7/liquidez?${queryComercial}`}><GraficoCombinado datos={meses} barras={[{ clave: 'ingresosRecibidos', nombre: 'Ingreso real', color: '#FE8F01' }, { clave: 'egresosRealizados', nombre: 'Egreso real', color: '#676767' }]} lineas={[{ clave: 'flujoNeto', nombre: 'Flujo real', color: '#000000' }]} /></Seccion>}{disponible.remuneraciones && <Seccion titulo="Costo laboral — últimos 12 meses" descripcion="Haberes y aportes del empleador de remuneraciones oficiales cerradas." ruta={`/dashboard-m7/operacion?${queryComercial}`}><GraficoBarras datos={meses} series={[{ clave: 'costoRemuneraciones', nombre: 'Costo laboral', color: '#FE8F01' }]} etiqueta="periodo" /></Seccion>}{clientes.length > 0 && <Seccion titulo="Principales clientes por ventas" descripcion="Monto y participación sobre ventas netas comparables en CLP durante la ventana de 12 meses." ruta={`/dashboard-m7/ventas?${queryComercial}`}><GraficoBarras datos={clientes} series={[{ clave: 'monto', nombre: 'Ventas netas', color: '#FE8F01' }]} horizontal /><div className="mt-3 grid gap-2 sm:grid-cols-2">{clientes.slice(0, 6).map(cliente => <div key={cliente.etiqueta} className="flex items-center justify-between gap-3 border-b border-gray-100 py-2 text-sm"><span className="truncate font-semibold">{cliente.etiqueta}</span><strong className="shrink-0 text-[#b85e00]">{formatearDato(cliente.participacion, 'participacionPorcentual')}</strong></div>)}</div></Seccion>}{disponible.operacion && <Seccion titulo="Actividad operacional — últimos 12 meses" descripcion="Instalaciones cerradas, OT creadas e incidencias registradas; son registros operacionales, no un índice de desempeño." ruta={`/dashboard-m7/operacion?${queryComercial}`}><GraficoCombinado datos={meses} barras={[{ clave: 'instalaciones', nombre: 'Instalaciones', color: '#FE8F01' }, { clave: 'ordenesTrabajo', nombre: 'OT', color: '#676767' }]} lineas={[{ clave: 'incidencias', nombre: 'Incidencias', color: '#000000' }]} /></Seccion>}</div>}
      {!compacto && <><section><div className="mb-3"><p className="text-xs font-bold uppercase text-[#b85e00]">Estado actual y contexto aplicado</p><h2 className="mt-1 text-xl font-bold">Proyectos, crédito e inventario</h2></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><ResumenCorte titulo="Margen por proyecto" bloque={bloques.margenProyectos} ruta={`/dashboard-m7/margen-proyectos?${queryComercial}`} claves={['margenDirecto', 'resultado']} /><ResumenCorte titulo="Exposición crediticia" bloque={bloques.exposicionCredito} ruta={`/dashboard-m7/control?${queryComercial}`} claves={['exposicionUtilizada', 'utilizado']} /><ResumenCorte titulo="Inventario valorizado" bloque={bloques.inventarioValorizado} ruta={`/dashboard-m7/control?${queryComercial}`} claves={['valorTotal', 'valor']} /><ResumenCorte titulo="Centro de Atención" bloque={bloques.centroAtencion} ruta={`/dashboard-m7/centro-atencion?${queryComercial}`} claves={['cantidad', 'total']} /></div></section><div className="grid gap-5 xl:grid-cols-2">{proyectos.length > 0 && <Seccion titulo="Proyectos principales del corte" descripcion="Ingresos, costos directos y margen atribuibles. No constituye un score ni una decisión automática." ruta={`/dashboard-m7/margen-proyectos?${queryComercial}`}><GraficoBarras datos={proyectos} series={[{ clave: 'ingresos', nombre: 'Ingresos', color: '#FE8F01' }, { clave: 'costos', nombre: 'Costos directos', color: '#9ca3af' }, { clave: 'margen', nombre: 'Margen', color: '#000000' }]} horizontal /></Seccion>}{composicionCostos.length > 0 && <Seccion titulo="Composición de costos directos" descripcion="Sólo materiales, remuneraciones atribuibles e instalación configurada. No representa gastos totales." ruta={`/dashboard-m7/control?${queryComercial}`}><GraficoDonut datos={composicionCostos} /></Seccion>}</div>{bloques.exposicionCredito && <Seccion titulo="Crédito actual" descripcion="Saldo vigente del módulo de Crédito; no se presenta como histórico del rango ni de los períodos comparados." ruta={`/dashboard-m7/control?${queryComercial}`}><div className="grid gap-5 lg:grid-cols-2"><GraficoProgreso utilizado={buscarNumero(bloques.exposicionCredito, ['exposicionUtilizada', 'utilizado']) || 0} disponible={buscarNumero(bloques.exposicionCredito, ['capacidadDisponible', 'disponible']) || 0} /><div className="grid grid-cols-2 gap-3"><ResumenCorte titulo="Clientes sobre cupo" bloque={bloques.exposicionCredito} ruta={`/dashboard-m7/control?${queryComercial}`} claves={['clientesSobreLimite', 'sobrecupo']} /><ResumenCorte titulo="Alertas" bloque={bloques.alertasCredito} ruta={`/dashboard-m7/control?${queryComercial}`} claves={['cantidad', 'total']} /></div></div></Seccion>}</>}
      {contexto.modo === 'mes' && !consulta.cargando && !historico.cargando && !meses.length && !error && <EstadoSinDatos texto="No hay información histórica habilitada para esta cuenta." />}
    </main></div>;
}
