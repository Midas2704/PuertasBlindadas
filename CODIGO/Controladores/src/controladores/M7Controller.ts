import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { calcularNota, efectoPago, fechaNegocio, incluirNota } from '../utilidades/finanzas';
import { crearInformeDashboardM7 } from '../m7/informeDashboardPdf';
import { crearInformeVentasExcelM7, FilaCotizacionExcelM7, FilaVentaExcelM7, TipoInformeVentasExcelM7 } from '../m7/informeVentasExcel';

type Consulta = Record<string, unknown>;
export type EstadoIndicadorM7 = 'VALIDO' | 'SIN_RESULTADOS' | 'DATOS_INSUFICIENTES' | 'FUENTE_NO_DISPONIBLE' | 'DESACTUALIZADO' | 'PARCIALMENTE_DISPONIBLE' | 'SIN_PERMISO' | 'ERROR_CALCULO' | 'NO_APLICA' | 'CONFIGURACION_PENDIENTE';

type Periodo = { desde: Date; hastaExclusiva: Date; anteriorDesde: Date; anteriorHastaExclusiva: Date; etiquetaDesde: string; etiquetaHasta: string };
const estadosVentaDefinitiva = ['confirmada', 'cerrada'];
const retiradosCxC = ['anulada', 'revertida', 'revertida_total', 'provisional'];
const codigoUmbralMargen = 'M7_MARGEN_CRITICO';
const prefijoUmbralLiquidez = 'M7_LIQUIDEZ_UMBRAL_';
const prefijoCostoInstalacion = 'M7_COSTO_INSTALACION_';
const codigoDiasStockInmovil = 'M7_DIAS_STOCK_INMOVIL';
const tipoUmbralMargen = 'DASHBOARD';
const unidadUmbralMargen = 'PORCENTAJE';
const categoriasFlujoProyectadoM7 = ['INGRESOS_OPERACIONALES', 'OTROS_INGRESOS', 'PROVEEDORES', 'REMUNERACIONES', 'IMPUESTOS', 'OTROS_EGRESOS'] as const;
const categoriasEntradaProyeccionM7 = new Set<string>(['INGRESOS_OPERACIONALES', 'OTROS_INGRESOS']);

const fechaIso = (fecha: Date) => fecha.toISOString().slice(0, 10);
const fechaUtc = (valor: unknown, nombre: string) => {
  const texto = String(valor || '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) throw new ErrorAplicacion(400, `${nombre} debe usar formato AAAA-MM-DD`);
  const fecha = new Date(`${texto}T00:00:00Z`);
  if (!Number.isFinite(fecha.getTime()) || fechaIso(fecha) !== texto) throw new ErrorAplicacion(400, `${nombre} no es una fecha válida`);
  return fecha;
};

export function resolverPeriodoM7(consulta: Consulta = {}): Periodo {
  let desde: Date;
  let hastaExclusiva: Date;
  if (consulta.desde || consulta.hasta) {
    if (!consulta.desde || !consulta.hasta) throw new ErrorAplicacion(400, 'El período necesita fecha desde y hasta');
    desde = fechaUtc(consulta.desde, 'Fecha desde');
    const hasta = fechaUtc(consulta.hasta, 'Fecha hasta');
    hastaExclusiva = new Date(hasta); hastaExclusiva.setUTCDate(hastaExclusiva.getUTCDate() + 1);
  } else {
    const hoy = new Date(`${fechaNegocio()}T00:00:00Z`);
    const anio = Number(consulta.anio ?? hoy.getUTCFullYear());
    const mes = Number(consulta.mes ?? hoy.getUTCMonth() + 1);
    if (!Number.isInteger(anio) || anio < 2000 || anio > 2200 || !Number.isInteger(mes) || mes < 1 || mes > 12) throw new ErrorAplicacion(400, 'Período mensual inválido');
    desde = new Date(Date.UTC(anio, mes - 1, 1));
    hastaExclusiva = new Date(Date.UTC(anio, mes, 1));
  }
  if (desde >= hastaExclusiva) throw new ErrorAplicacion(400, 'La fecha desde debe ser anterior o igual a la fecha hasta');
  const duracion = hastaExclusiva.getTime() - desde.getTime();
  const anteriorHastaExclusiva = new Date(desde);
  const anteriorDesde = new Date(desde.getTime() - duracion);
  const hasta = new Date(hastaExclusiva); hasta.setUTCDate(hasta.getUTCDate() - 1);
  return { desde, hastaExclusiva, anteriorDesde, anteriorHastaExclusiva, etiquetaDesde: fechaIso(desde), etiquetaHasta: fechaIso(hasta) };
}

export function calcularComparacionPeriodosVentasM7(valorA: number | null, valorB: number | null) {
  return {
    diferenciaAbsoluta: valorA === null || valorB === null ? null : redondear(valorB - valorA),
    variacionPorcentual: valorA === null || valorB === null || valorA === 0 ? null : redondear((valorB - valorA) / Math.abs(valorA) * 100),
  };
}

export type GranularidadVentasM7 = 'dia' | 'mes';

const diasPeriodoM7 = (periodo: Periodo) => diasCalendario(periodo.desde, periodo.hastaExclusiva);
const granularidadPeriodoM7 = (periodo: Periodo, forzada?: unknown): GranularidadVentasM7 => forzada === 'mes' || diasPeriodoM7(periodo) > 62 ? 'mes' : 'dia';
export function seleccionarGranularidadVentasM7(desde: string, hasta: string): GranularidadVentasM7 {
  return granularidadPeriodoM7(resolverPeriodoM7({ desde, hasta }));
}

const clavesPeriodoM7 = (periodo: Periodo, granularidad: GranularidadVentasM7) => {
  const claves: string[] = [];
  const cursor = granularidad === 'dia' ? new Date(periodo.desde) : new Date(Date.UTC(periodo.desde.getUTCFullYear(), periodo.desde.getUTCMonth(), 1));
  while (cursor < periodo.hastaExclusiva) {
    claves.push(granularidad === 'dia' ? fechaIso(cursor) : `${cursor.getUTCFullYear()}-${String(cursor.getUTCMonth() + 1).padStart(2, '0')}`);
    if (granularidad === 'dia') cursor.setUTCDate(cursor.getUTCDate() + 1); else cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return claves;
};

export function generarClavesTemporalesVentasM7(desde: string, hasta: string, granularidad?: GranularidadVentasM7) {
  const periodo = resolverPeriodoM7({ desde, hasta });
  return clavesPeriodoM7(periodo, granularidad || granularidadPeriodoM7(periodo));
}

export function consolidarBucketVentasM7(montos: Array<number | null>) {
  const incluidos = montos.filter((monto): monto is number => typeof monto === 'number' && Number.isFinite(monto));
  return {
    ventaNetaClp: incluidos.length ? redondear(incluidos.reduce((total, monto) => total + monto, 0)) : montos.length ? null : 0,
    ventasIncluidasClp: incluidos.length,
    ventasExcluidasSinTipoCambio: montos.length - incluidos.length,
  };
}

export function calcularPromedioTemporalVentasM7(total: number | null, unidades: number) {
  return total === null || !Number.isInteger(unidades) || unidades <= 0 ? null : redondear(total / unidades);
}

export function alinearSeriesPeriodosVentasM7(serieA: Array<Record<string, unknown>>, serieB: Array<Record<string, unknown>>, granularidad: GranularidadVentasM7 = 'mes') {
  return Array.from({ length: Math.max(serieA.length, serieB.length) }, (_, indice) => ({
    posicion: granularidad === 'dia' ? `Día ${indice + 1}` : `Posición ${indice + 1}`,
    periodoA: serieA[indice]?.periodo ?? null,
    ventaA: serieA[indice]?.ventaNetaClp ?? null,
    periodoB: serieB[indice]?.periodo ?? null,
    ventaB: serieB[indice]?.ventaNetaClp ?? null,
    variacionPorcentual: calcularComparacionPeriodosVentasM7(typeof serieA[indice]?.ventaNetaClp === 'number' ? serieA[indice].ventaNetaClp as number : null, typeof serieB[indice]?.ventaNetaClp === 'number' ? serieB[indice].ventaNetaClp as number : null).variacionPorcentual,
  }));
}

const indicador = <T>(estado: EstadoIndicadorM7, valor: T | null, detalle: string, actualizadoEn: Date | null = new Date()) => ({ estado, valor, detalle, actualizadoEn });
const agruparMonto = (filas: Array<{ moneda: string; monto: number }>) => [...filas.reduce((mapa, fila) => mapa.set(fila.moneda, (mapa.get(fila.moneda) || 0) + fila.monto), new Map<string, number>())].map(([moneda, monto]) => ({ moneda, monto }));
const periodoSalida = (periodo: Periodo) => ({ desde: periodo.etiquetaDesde, hasta: periodo.etiquetaHasta });
const dentro = (fecha: Date, periodo: Periodo) => fecha >= periodo.desde && fecha < periodo.hastaExclusiva;
const sumarPorMoneda = (filas: Array<{ moneda: string; monto: number }>) => agruparMonto(filas).map(fila => ({ ...fila, monto: Number(fila.monto.toFixed(2)) }));
const rutaCliente = (cliente: { rut_cliente: string | null }) => cliente.rut_cliente ? `/clientes/${encodeURIComponent(cliente.rut_cliente)}` : '/clientes';
const diasCalendario = (desde: Date, hasta: Date) => Math.max(0, Math.floor((Date.UTC(hasta.getUTCFullYear(), hasta.getUTCMonth(), hasta.getUTCDate()) - Date.UTC(desde.getUTCFullYear(), desde.getUTCMonth(), desde.getUTCDate())) / 86400000));
const normalizarTexto = (valor: string | null | undefined) => (valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
type AccionNavegacion = { etiqueta: string; destino: string };
const accion = (etiqueta: string, destino: string): AccionNavegacion => ({ etiqueta, destino });
const numeroConsulta = (valor: unknown) => valor === undefined || valor === null || valor === '' ? null : Number(valor);
const direccionOrden = (valor: unknown) => String(valor || 'asc').toLowerCase() === 'desc' ? -1 : 1;
const compararNullable = (a: string | number | null, b: string | number | null, direccion: number) => {
  if (a === null) return b === null ? 0 : 1;
  if (b === null) return -1;
  return (typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b))) * direccion;
};
const inicioBucket = (fecha: Date, granularidad: 'dia' | 'semana' | 'mes') => {
  const salida = new Date(Date.UTC(fecha.getUTCFullYear(), fecha.getUTCMonth(), fecha.getUTCDate()));
  if (granularidad === 'semana') salida.setUTCDate(salida.getUTCDate() - ((salida.getUTCDay() + 6) % 7));
  if (granularidad === 'mes') salida.setUTCDate(1);
  return fechaIso(salida);
};
const esServicioInstalacion = (tipo: string | null | undefined) => normalizarTexto(tipo) === 'instalacion';
const redondear = (valor: number, decimales = 2) => Number(valor.toFixed(decimales));
// MIDAS: sin una tasa histórica válida, la deuda extranjera no entra al consolidado CLP.
export const equivalenteClpCxc = (saldo: number, moneda: string, tipoCambio: number | null) => moneda === 'CLP' ? saldo : tipoCambio !== null && tipoCambio > 0 ? redondear(saldo * tipoCambio) : null;
export const convertirVentaClpM7 = (montoNeto: number, moneda: string, tipoCambioHistorico: number | null) => moneda === 'CLP' ? redondear(montoNeto) : tipoCambioHistorico !== null && tipoCambioHistorico > 0 ? redondear(montoNeto * tipoCambioHistorico) : null;
export const calcularVariacionVentasM7 = (actual: number | null, base: number | null) => actual === null || base === null || base === 0 ? null : redondear((actual - base) / Math.abs(base) * 100);
export type SegmentoComercialM7 = 'TODOS' | 'B2B' | 'B2C';
export const resolverSegmentoComercialM7 = (valor: unknown): SegmentoComercialM7 => {
  const segmento = String(valor || 'TODOS').trim().toUpperCase();
  if (!['TODOS', 'B2B', 'B2C'].includes(segmento)) throw new ErrorAplicacion(400, 'Segmento comercial inválido');
  return segmento as SegmentoComercialM7;
};
const nombreSegmentoClienteM7 = (cliente: { tipo_cliente_financiero?: { nombre_tipo_cliente_financiero?: string | null } | null }) => {
  const nombre = String(cliente.tipo_cliente_financiero?.nombre_tipo_cliente_financiero || '').trim().toUpperCase();
  return nombre === 'B2B' || nombre === 'B2C' ? nombre as Exclude<SegmentoComercialM7, 'TODOS'> : null;
};
const perteneceSegmentoM7 = (cliente: { tipo_cliente_financiero?: { nombre_tipo_cliente_financiero?: string | null } | null }, segmento: SegmentoComercialM7) => segmento === 'TODOS' || nombreSegmentoClienteM7(cliente) === segmento;
export const calcularConversionSegmentadaM7 = (filas: Array<{ segmento: string | null; convertida: boolean }>, segmento: SegmentoComercialM7) => {
  const seleccionadas = segmento === 'TODOS' ? filas : filas.filter(fila => fila.segmento === segmento);
  const convertidas = seleccionadas.filter(fila => fila.convertida).length;
  return { totalCotizaciones: seleccionadas.length, convertidas, tasaPorcentual: seleccionadas.length ? redondear(convertidas / seleccionadas.length * 100) : null };
};
export function distribuirVentaPorProductoM7(netoClp: number | null, detalles: Array<{ producto: string; segmento: string | null; cantidad: number; subtotal: number }>) {
  const validos = detalles.filter(detalle => detalle.producto.trim() && detalle.cantidad > 0);
  const valorables = validos.filter(detalle => detalle.subtotal > 0);
  const sumaSubtotales = valorables.reduce((total, detalle) => total + detalle.subtotal, 0);
  let distribuido = 0;
  let indiceValorable = 0;
  return validos.map(detalle => {
    const esValorable = detalle.subtotal > 0;
    const ventaNetaClp = netoClp === null || sumaSubtotales <= 0 || !esValorable ? null : indiceValorable === valorables.length - 1 ? redondear(netoClp - distribuido) : redondear(netoClp * detalle.subtotal / sumaSubtotales);
    if (ventaNetaClp !== null) distribuido = redondear(distribuido + ventaNetaClp);
    if (esValorable) indiceValorable += 1;
    return { ...detalle, producto: detalle.producto.trim(), ventaNetaClp };
  });
}
export function resumirIncidenciasRevisionM7(filas: Array<{ estadoRevision: string; categoria: { codigo: string; nombre: string } | null }>) {
  const estadosRevision = (['aprobada', 'pendiente_revision', 'rechazada'] as const).map(estado => ({ estado, cantidad: filas.filter(fila => fila.estadoRevision === estado).length }));
  const categorias = [...filas.filter(fila => fila.categoria).reduce((mapa, fila) => mapa.set(fila.categoria!.codigo, { categoria: fila.categoria!.nombre, codigo: fila.categoria!.codigo, cantidad: (mapa.get(fila.categoria!.codigo)?.cantidad || 0) + 1 }), new Map<string, { categoria: string; codigo: string; cantidad: number }>()).values()];
  return { estadosRevision, categorias, aprobadas: filas.filter(fila => fila.estadoRevision === 'aprobada').length, sinCategoriaEstructurada: filas.filter(fila => !fila.categoria).length };
}
export function calcularEstadoResultadosM7(partidas: { ventasNetas: number | null; costoVenta: number | null; gastosOperacionales: number | null }) {
  const margenBruto = partidas.ventasNetas === null || partidas.costoVenta === null ? null : redondear(partidas.ventasNetas - partidas.costoVenta);
  const ebitdaMonto = margenBruto === null || partidas.gastosOperacionales === null ? null : redondear(margenBruto - partidas.gastosOperacionales);
  const ebitdaPorcentaje = ebitdaMonto === null || partidas.ventasNetas === null || partidas.ventasNetas === 0 ? null : redondear(ebitdaMonto / partidas.ventasNetas * 100);
  return { ...partidas, margenBruto, ebitdaMonto, ebitdaPorcentaje };
}
export function calcularFlujoRealM7(movimientos: Array<{ monto: number; naturaleza: string; ajuste?: boolean }>) {
  const total = { ingresosReales: 0, egresosReales: 0, ajustesEntrada: 0, ajustesSalida: 0 };
  for (const movimiento of movimientos) {
    const ingreso = normalizarTexto(movimiento.naturaleza) === 'ingreso';
    if (movimiento.ajuste && ingreso) total.ajustesEntrada += movimiento.monto;
    else if (movimiento.ajuste) total.ajustesSalida += movimiento.monto;
    else if (ingreso) total.ingresosReales += movimiento.monto;
    else if (normalizarTexto(movimiento.naturaleza) === 'egreso') total.egresosReales += movimiento.monto;
  }
  return { ingresosReales: redondear(total.ingresosReales), egresosReales: redondear(total.egresosReales), ajustesEntrada: redondear(total.ajustesEntrada), ajustesSalida: redondear(total.ajustesSalida), flujoReal: redondear(total.ingresosReales + total.ajustesEntrada - total.egresosReales - total.ajustesSalida) };
}
export const calcularDesviacionFlujoM7 = (real: number, proyectado: number) => ({ diferencia: redondear(real - proyectado), diferenciaPorcentual: proyectado === 0 ? null : redondear((real - proyectado) / Math.abs(proyectado) * 100) });
const slugParametro = (valor: unknown) => String(valor || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 22);
const claveMes = (fecha: Date) => `${fecha.getUTCFullYear()}-${String(fecha.getUTCMonth() + 1).padStart(2, '0')}`;

type MesVentaHistoricaM7 = { periodo: string; ventasNetas: number | null; ventasIncluidasClp: number; ventasExcluidasSinTipoCambio: number };
export function resumirVentasHistoricasM7(meses: MesVentaHistoricaM7[], anio: number, mes: number) {
  const porPeriodo = new Map(meses.map(fila => [fila.periodo, fila]));
  const clave = (year: number, month: number) => `${year}-${String(month).padStart(2, '0')}`;
  const actual = porPeriodo.get(clave(anio, mes))?.ventasNetas ?? null;
  const fechaAnterior = new Date(Date.UTC(anio, mes - 2, 1));
  const anterior = porPeriodo.get(clave(fechaAnterior.getUTCFullYear(), fechaAnterior.getUTCMonth() + 1))?.ventasNetas ?? null;
  const anual = porPeriodo.get(clave(anio - 1, mes))?.ventasNetas ?? null;
  const acumular = (year: number) => {
    const filas = meses.filter(fila => fila.periodo >= clave(year, 1) && fila.periodo <= clave(year, mes));
    const disponibles = filas.filter(fila => fila.ventasNetas !== null);
    return {
      total: disponibles.length ? redondear(disponibles.reduce((total, fila) => total + (fila.ventasNetas || 0), 0)) : null,
      incluidas: filas.reduce((total, fila) => total + fila.ventasIncluidasClp, 0),
      excluidasSinTipoCambio: filas.reduce((total, fila) => total + fila.ventasExcluidasSinTipoCambio, 0),
    };
  };
  const acumuladoActual = acumular(anio); const acumuladoAnterior = acumular(anio - 1);
  const coberturaActual = porPeriodo.get(clave(anio, mes));
  return {
    actual, anterior, anual,
    mom: calcularVariacionVentasM7(actual, anterior),
    yoy: calcularVariacionVentasM7(actual, anual),
    acumuladoActual: acumuladoActual.total,
    acumuladoAnterior: acumuladoAnterior.total,
    variacionYtd: calcularVariacionVentasM7(acumuladoActual.total, acumuladoAnterior.total),
    coberturaMes: { incluidas: coberturaActual?.ventasIncluidasClp || 0, excluidasSinTipoCambio: coberturaActual?.ventasExcluidasSinTipoCambio || 0 },
    coberturaYtd: { incluidas: acumuladoActual.incluidas, excluidasSinTipoCambio: acumuladoActual.excluidasSinTipoCambio },
    coberturaYtdAnterior: { incluidas: acumuladoAnterior.incluidas, excluidasSinTipoCambio: acumuladoAnterior.excluidasSinTipoCambio },
  };
}

function resolverVentanaHistoricaM7(consulta: Consulta) {
  const corte = resolverPeriodoM7(consulta);
  const meses = Number(consulta.meses ?? 12);
  if (!Number.isInteger(meses) || meses < 1 || meses > 24) throw new ErrorAplicacion(400, 'La ventana histórica debe contener entre 1 y 24 meses');
  const desde = new Date(Date.UTC(corte.desde.getUTCFullYear(), corte.desde.getUTCMonth() - meses + 1, 1));
  const periodos = Array.from({ length: meses }, (_, indice) => {
    const inicio = new Date(Date.UTC(desde.getUTCFullYear(), desde.getUTCMonth() + indice, 1));
    const hastaExclusiva = new Date(Date.UTC(inicio.getUTCFullYear(), inicio.getUTCMonth() + 1, 1));
    return { clave: claveMes(inicio), desde: inicio, hastaExclusiva };
  });
  return { corte, desde, hastaExclusiva: corte.hastaExclusiva, meses, periodos };
}

export interface ProveedorCreditoM8 {
  consultarExposicion(consulta: Consulta): Promise<unknown>;
  consultarAlertas(consulta: Consulta): Promise<unknown>;
}

export interface ProveedorBloqueosOperacionales {
  consultarBloqueos(consulta: Consulta): Promise<unknown>;
}
export class M7Controller {
  constructor(private creditoM8?: ProveedorCreditoM8, private readonly bloqueosOwner?: ProveedorBloqueosOperacionales) {}
  conectarCreditoM8(proveedor: ProveedorCreditoM8) { this.creditoM8 = proveedor; }
  async consultarPanelGeneral(consulta: Consulta, permisos: string[]) {
    const periodo = resolverPeriodoM7(consulta);
    const definiciones = [
      ['centroAtencion', ['CU216'], () => this.consultarCentroAtencion(consulta, permisos)],
      ['cotizacionesPendientes', ['CU217'], () => this.consultarCotizacionesPendientes(consulta, permisos)],
      ['ventas', ['CU218', 'CU219', 'CU220'], () => this.consultarAnalisisVentas(consulta, permisos)],
      ['cuentasCobrar', ['CU222', 'CU223', 'CU224', 'CU225'], () => this.consultarCuentasCobrar(consulta, permisos)],
      ['cuentasPagar', ['CU226', 'CU227'], () => this.consultarCuentasPagar(consulta, permisos)],
      ['liquidez', ['CU228', 'CU229', 'CU230', 'CU231'], () => this.consultarLiquidez(consulta, permisos)],
      ['riesgoDeficit', ['CU232'], () => this.consultarRiesgoDeficit(consulta, permisos)],
      ['margenProyectos', ['CU233', 'CU234', 'CU235'], () => this.consultarMargenProyectos(consulta, permisos)],
      ['exposicionProyectos', ['CU236'], () => this.consultarExposicionProyectos(consulta, permisos)],
      ['resumenResultados', ['CU238'], () => this.consultarResumenResultados(consulta)],
      ['situacionFinanciera', ['CU239'], () => this.consultarSituacionFinanciera(consulta)],
      ['costoRemuneraciones', ['CU242'], () => this.consultarCostoRemuneraciones(consulta)],
      ['ordenesTrabajo', ['CU247'], () => this.consultarOrdenesTrabajo(consulta)],
      ['cargaOperacional', ['CU248'], () => this.consultarCargaOperacional(consulta)],
      ['instalaciones', ['CU250'], () => this.consultarInstalaciones(consulta)],
      ['atrasosInstalaciones', ['CU252'], () => this.consultarAtrasosInstalaciones(consulta)],
      ['incidenciasRetrabajos', ['CU253'], () => this.consultarIncidenciasRetrabajos(consulta)],
      ['exposicionCredito', ['CU240'], () => this.consultarExposicionCreditoM7(consulta)],
      ['alertasCredito', ['CU241'], () => this.consultarAlertasCreditoM7(consulta)],
      ['resumenIva', ['CU243'], () => this.consultarResumenIva(consulta)],
      ['costosFabricacion', ['CU244'], () => this.consultarCostosFabricacion(consulta)],
      ['bloqueosEconomicos', ['CU249'], () => this.consultarBloqueosEconomicosM7(consulta)],
      ['margenInstalaciones', ['CU251'], () => this.consultarMargenInstalaciones(consulta)],
      ['inventarioValorizado', ['CU254'], () => this.consultarInventarioValorizado(consulta)],
      ['materialesProyectoOt', ['CU255'], () => this.consultarMaterialesProyectoOt(consulta)],
      ['riesgoStock', ['CU256'], () => this.consultarRiesgoStock(consulta)],
      ['rotacionInventario', ['CU257'], () => this.consultarRotacionInventario(consulta)],
      ['comprasRecepciones', ['CU258'], () => this.consultarComprasRecepciones(consulta, permisos)],
    ] as const;
    const visibles = definiciones.filter(([, requeridos]) => requeridos.some(permiso => permisos.includes(permiso)));
    const resultados = await Promise.all(visibles.map(async ([clave, requeridos, cargar]) => {
      try { return [clave, { permisos: requeridos.filter(permiso => permisos.includes(permiso)), ...(await cargar()) }] as const; }
      catch { return [clave, { permisos: requeridos.filter(permiso => permisos.includes(permiso)), periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const }] as const; }
    }));
    return { periodo: periodoSalida(periodo), bloques: Object.fromEntries(resultados), bloquesOcultos: definiciones.filter(([, requeridos]) => !requeridos.some(permiso => permisos.includes(permiso))).map(([clave]) => clave) };
  }

  async consultarHistoricoPanelGeneral(consulta: Consulta, permisos: string[]) {
    const ventana = resolverVentanaHistoricaM7(consulta);
    const segmento = resolverSegmentoComercialM7(consulta.segmento);
    const puede = (codigo: string) => permisos.includes(codigo);
    const filas = new Map(ventana.periodos.map(periodo => [periodo.clave, {
      periodo: periodo.clave,
      ventasNetas: null as number | null,
      ventasNetasGerencial: null as number | null,
      cantidadVentas: 0,
      ventasIncluidasClp: 0,
      ventasExcluidasSinTipoCambio: 0,
      cotizaciones: 0,
      convertidas: 0,
      conversionPorcentual: null as number | null,
      ingresosRecibidos: 0,
      egresosRealizados: 0,
      ajustesEntrada: 0,
      ajustesSalida: 0,
      flujoNeto: 0,
      flujoPresupuestado: null as number | null,
      costoRemuneraciones: null as number | null,
      costosDirectos: null as number | null,
      resultadoGerencial: null as number | null,
      instalaciones: 0,
      ordenesTrabajo: 0,
      incidencias: 0,
    }]));
    try {
      const [ventas, cotizaciones, movimientos, costos, tareasRemunerables, remuneraciones, instalaciones, ordenes, incidencias, presupuestos] = await Promise.all([
        prisma.nota_venta.findMany({
          where: { fecha_emision: { gte: ventana.desde, lt: ventana.hastaExclusiva }, estado_nota_venta: { in: estadosVentaDefinitiva } },
          select: {
            fecha_emision: true, monto_neto: true, tipo_cambio_usado: true,
            moneda: { select: { codigo_moneda: true } },
            ficha_cliente: { select: { cliente_financiero: { select: { id_cliente_financiero: true, nombre_razon_social_referencia: true, tipo_cliente_financiero: { select: { nombre_tipo_cliente_financiero: true } } } } } },
          },
        }),
        prisma.cotizacion.findMany({ where: { fecha_emision: { gte: ventana.desde, lt: ventana.hastaExclusiva } }, select: { fecha_emision: true, nota_venta: { select: { estado_nota_venta: true } }, ficha_cliente: { select: { cliente_financiero: { select: { tipo_cliente_financiero: { select: { nombre_tipo_cliente_financiero: true } } } } } } } }),
        prisma.movimiento_financiero.findMany({
          where: { fecha_movimiento: { gte: ventana.desde, lt: ventana.hastaExclusiva }, estado_movimiento: { notIn: ['anulado', 'rechazado'] } },
          select: { fecha_movimiento: true, naturaleza_movimiento: true, monto_movimiento: true, tipo_movimiento_financiero: true, moneda: { select: { codigo_moneda: true } }, origen_movimiento_financiero: { select: { entidad_origen: true } } },
        }),
        prisma.costo_proyecto.findMany({ where: { fecha_costo: { gte: ventana.desde, lt: ventana.hastaExclusiva }, estado_costo: { not: 'anulado' } }, select: { fecha_costo: true, monto_costo: true, moneda: { select: { codigo_moneda: true } } } }),
        prisma.tarea_remunerable.findMany({ where: { fecha_tarea: { gte: ventana.desde, lt: ventana.hastaExclusiva }, estado_validacion: 'validada', id_proyecto_financiero: { not: null } }, select: { fecha_tarea: true, monto_calculado: true } }),
        prisma.remuneracion.findMany({ where: { estado: 'cerrada', periodo: { fecha_inicio: { gte: ventana.desde, lt: ventana.hastaExclusiva } } }, select: { total_haberes: true, total_aportes_empleador: true, periodo: { select: { fecha_inicio: true } } } }),
        prisma.servicio_terreno.findMany({ where: { servicio_terreno_estado: 'cerrada', servicio_terreno_fecha_real: { gte: ventana.desde, lt: ventana.hastaExclusiva } }, select: { servicio_terreno_fecha_real: true, servicio_terreno_tipo_servicio: true } }),
        prisma.orden_trabajo.findMany({ where: { orden_trabajo_fecha_hora: { gte: ventana.desde, lt: ventana.hastaExclusiva } }, select: { orden_trabajo_fecha_hora: true } }),
        prisma.incidencia_retrabajo_tarea.findMany({ where: { fecha_registro: { gte: ventana.desde, lt: ventana.hastaExclusiva } }, select: { fecha_registro: true } }),
        puede('CU231')
          ? prisma.proyeccion_financiera_m7.findMany({ where: { tipo: 'FLUJO_CAJA', estado: 'activo', moneda: { codigo_moneda: 'CLP' }, anio: { gte: ventana.desde.getUTCFullYear(), lte: ventana.corte.desde.getUTCFullYear() } }, select: { anio: true, mes: true, categoria: true, monto_proyectado: true } })
          : Promise.resolve([]),
      ]);

      const ventasValidasPorMes = new Map<string, boolean>();
      for (const venta of ventas) {
        const fila = filas.get(claveMes(venta.fecha_emision)); if (!fila) continue;
        const monto = convertirVentaClpM7(Number(venta.monto_neto), venta.moneda.codigo_moneda, venta.tipo_cambio_usado?.gt(0) ? Number(venta.tipo_cambio_usado) : null);
        if (monto === null) ventasValidasPorMes.set(claveMes(venta.fecha_emision), false);
        else fila.ventasNetasGerencial = redondear((fila.ventasNetasGerencial || 0) + monto);
      }
      const clientes = new Map<number, { cliente: string; monto: number }>();
      const desdeClientes = ventana.periodos[Math.max(0, ventana.periodos.length - 12)]?.desde || ventana.desde;
      if (puede('CU219') || puede('CU220') || puede('CU238')) for (const venta of ventas) {
        if (!perteneceSegmentoM7(venta.ficha_cliente.cliente_financiero, segmento)) continue;
        const fila = filas.get(claveMes(venta.fecha_emision)); if (!fila) continue;
        const monto = convertirVentaClpM7(Number(venta.monto_neto), venta.moneda.codigo_moneda, venta.tipo_cambio_usado?.gt(0) ? Number(venta.tipo_cambio_usado) : null);
        fila.cantidadVentas += 1;
        if (monto !== null) {
          fila.ventasIncluidasClp += 1;
          fila.ventasNetas = redondear((fila.ventasNetas || 0) + monto);
          if (venta.fecha_emision >= desdeClientes) {
            const cliente = venta.ficha_cliente.cliente_financiero;
            const acumulado = clientes.get(cliente.id_cliente_financiero) || { cliente: cliente.nombre_razon_social_referencia, monto: 0 };
            acumulado.monto = redondear(acumulado.monto + monto); clientes.set(cliente.id_cliente_financiero, acumulado);
          }
        } else fila.ventasExcluidasSinTipoCambio += 1;
      }
      if (puede('CU218')) for (const cotizacion of cotizaciones) {
        if (!perteneceSegmentoM7(cotizacion.ficha_cliente.cliente_financiero, segmento)) continue;
        const fila = filas.get(claveMes(cotizacion.fecha_emision)); if (!fila) continue;
        fila.cotizaciones += 1;
        if (cotizacion.nota_venta && !['anulada', 'revertida', 'revertida_total'].includes(normalizarTexto(cotizacion.nota_venta.estado_nota_venta))) fila.convertidas += 1;
      }
      if (puede('CU230')) for (const movimiento of movimientos) {
        if (movimiento.moneda.codigo_moneda !== 'CLP') continue;
        const fila = filas.get(claveMes(movimiento.fecha_movimiento)); if (!fila) continue;
        const calculado = calcularFlujoRealM7([{ monto: Number(movimiento.monto_movimiento), naturaleza: movimiento.naturaleza_movimiento, ajuste: normalizarTexto(movimiento.tipo_movimiento_financiero).includes('ajuste') || movimiento.origen_movimiento_financiero.some(origen => normalizarTexto(origen.entidad_origen).includes('ajuste')) }]);
        fila.ingresosRecibidos = redondear(fila.ingresosRecibidos + calculado.ingresosReales);
        fila.egresosRealizados = redondear(fila.egresosRealizados + calculado.egresosReales);
        fila.ajustesEntrada = redondear(fila.ajustesEntrada + calculado.ajustesEntrada);
        fila.ajustesSalida = redondear(fila.ajustesSalida + calculado.ajustesSalida);
      }
      if (puede('CU231')) for (const presupuesto of presupuestos) { const fila = filas.get(`${presupuesto.anio}-${String(presupuesto.mes).padStart(2, '0')}`); if (!fila) continue; const signo = categoriasEntradaProyeccionM7.has(presupuesto.categoria) ? 1 : -1; fila.flujoPresupuestado = redondear((fila.flujoPresupuestado || 0) + signo * Number(presupuesto.monto_proyectado)); }
      const costosPorMes = new Map<string, number>();
      if (puede('CU238')) {
        for (const costo of costos) if (costo.moneda.codigo_moneda === 'CLP') costosPorMes.set(claveMes(costo.fecha_costo), redondear((costosPorMes.get(claveMes(costo.fecha_costo)) || 0) + Number(costo.monto_costo)));
        for (const tarea of tareasRemunerables) costosPorMes.set(claveMes(tarea.fecha_tarea), redondear((costosPorMes.get(claveMes(tarea.fecha_tarea)) || 0) + Number(tarea.monto_calculado)));
      }
      if (puede('CU242')) for (const remuneracion of remuneraciones) {
        if (remuneracion.total_haberes === null || remuneracion.total_aportes_empleador === null) continue;
        const fila = filas.get(claveMes(remuneracion.periodo.fecha_inicio)); if (!fila) continue;
        fila.costoRemuneraciones = redondear((fila.costoRemuneraciones || 0) + Number(remuneracion.total_haberes) + Number(remuneracion.total_aportes_empleador));
      }
      if (puede('CU250')) for (const servicio of instalaciones) if (servicio.servicio_terreno_fecha_real && esServicioInstalacion(servicio.servicio_terreno_tipo_servicio)) filas.get(claveMes(servicio.servicio_terreno_fecha_real))!.instalaciones += 1;
      if (puede('CU247')) for (const orden of ordenes) if (orden.orden_trabajo_fecha_hora) filas.get(claveMes(orden.orden_trabajo_fecha_hora))!.ordenesTrabajo += 1;
      if (puede('CU253')) for (const incidencia of incidencias) filas.get(claveMes(incidencia.fecha_registro))!.incidencias += 1;

      for (const fila of filas.values()) {
        fila.conversionPorcentual = fila.cotizaciones ? redondear(fila.convertidas / fila.cotizaciones * 100) : null;
        fila.flujoNeto = redondear(fila.ingresosRecibidos + fila.ajustesEntrada - fila.egresosRealizados - fila.ajustesSalida);
        fila.costosDirectos = costosPorMes.has(fila.periodo) ? costosPorMes.get(fila.periodo)! : null;
        fila.resultadoGerencial = fila.ventasNetasGerencial !== null && fila.costosDirectos !== null && ventasValidasPorMes.get(fila.periodo) !== false ? redondear(fila.ventasNetasGerencial - fila.costosDirectos) : null;
      }
      const totalClientes = [...clientes.values()].reduce((total, cliente) => total + cliente.monto, 0);
      const principalesClientes = puede('CU220') ? [...clientes.entries()].map(([idCliente, cliente]) => ({ idCliente, ...cliente, participacionPorcentual: totalClientes > 0 ? redondear(cliente.monto / totalClientes * 100) : null })).sort((a, b) => b.monto - a.monto || a.cliente.localeCompare(b.cliente)).slice(0, 10) : [];
      return {
        periodo: { desde: claveMes(ventana.desde), hasta: claveMes(ventana.corte.desde), meses: ventana.meses }, segmento,
        moneda: 'CLP', meses: [...filas.values()], principalesClientes,
        resumenVentas: puede('CU219') ? resumirVentasHistoricasM7([...filas.values()], ventana.corte.desde.getUTCFullYear(), ventana.corte.desde.getUTCMonth() + 1) : null,
        disponibilidad: { ventas: puede('CU219'), conversion: puede('CU218'), flujo: puede('CU230'), resultadoGerencial: puede('CU238'), remuneraciones: puede('CU242'), operacion: puede('CU247') || puede('CU250') || puede('CU253') },
        cobertura: {
          resultadoGerencial: 'Ventas netas menos costos directos atribuibles; no es un Estado de Resultados contable',
          cuentasCobrar: 'Histórico mensual completo no disponible; se mantiene el valor del corte seleccionado',
          cuentasPagar: 'El saldo actual no conserva un histórico mensual; se mantiene el valor del corte seleccionado',
          credito: 'El módulo de Crédito no entrega un histórico mensual y el Dashboard no recalcula sus valores',
          inventario: 'Inventario sólo dispone del valor del corte; no se repite como serie histórica',
        },
      };
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      return { periodo: { desde: claveMes(ventana.desde), hasta: claveMes(ventana.corte.desde), meses: ventana.meses }, moneda: 'CLP', meses: [], principalesClientes: [], estado: 'FUENTE_NO_DISPONIBLE' as const };
    }
  }

  async consultarCentroAtencion(consulta: Consulta, permisos: string[]) {
    const periodo = resolverPeriodoM7(consulta);
    const excepciones: Array<Record<string, unknown>> = [];
    const cobertura: Array<{ familia: string; estado: EstadoIndicadorM7; detalle: string }> = [];
    const familias: Array<{ familia: string; permiso: string; cargar: () => Promise<void> }> = [
      {
        familia: 'CUENTAS_POR_COBRAR', permiso: 'CU222', cargar: async () => {
          const datos = await this.consultarCuentasCobrarCompleto({ ...consulta, segmento: 'TODOS' });
          if (datos.morosidad.estado === 'FUENTE_NO_DISPONIBLE') throw new Error('CxC no disponible');
          const valor = datos.morosidad.valor as { cantidad: number; porMoneda: Array<{ moneda: string; monto: number }> } | null;
          if (valor?.cantidad) excepciones.push({ familia: 'CUENTAS_POR_COBRAR', ocurrio: 'Existen cuentas por cobrar vencidas con saldo', magnitud: valor, calidad: datos.morosidad.estado, destino: `/dashboard-m7/cuentas-cobrar?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`, origen: 'Cuentas por cobrar' });
          cobertura.push({ familia: 'CUENTAS_POR_COBRAR', estado: datos.morosidad.estado, detalle: datos.morosidad.detalle });
        },
      },
      {
        familia: 'CUENTAS_POR_PAGAR', permiso: 'CU226', cargar: async () => {
          const datos = await this.consultarCuentasPagarCompleto(consulta);
          if (datos.estados.estado === 'FUENTE_NO_DISPONIBLE') throw new Error('CxP no disponible');
          const estados = (datos.estados.valor || []) as Array<{ estado: string; cantidad: number }>;
          const vencidas = estados.filter(fila => /vencid/i.test(fila.estado)).reduce((total, fila) => total + fila.cantidad, 0);
          if (vencidas) excepciones.push({ familia: 'CUENTAS_POR_PAGAR', ocurrio: 'Existen obligaciones de proveedor vencidas', magnitud: { cantidad: vencidas }, calidad: datos.estados.estado, destino: `/dashboard-m7/cuentas-pagar?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`, origen: 'Cuentas por pagar' });
          cobertura.push({ familia: 'CUENTAS_POR_PAGAR', estado: datos.estados.estado, detalle: datos.estados.detalle });
        },
      },
      {
        familia: 'MARGEN_PROYECTO', permiso: 'CU233', cargar: async () => {
          const datos = await this.consultarMargenProyectosCompleto(consulta);
          if (datos.estado === 'FUENTE_NO_DISPONIBLE') throw new Error('Margen no disponible');
          for (const proyecto of datos.proyectos.filter(fila => ['PERDIDA', 'MARGEN_CRITICO'].includes(fila.clasificacion))) excepciones.push({ familia: 'MARGEN_PROYECTO', ocurrio: proyecto.clasificacion === 'PERDIDA' ? 'Proyecto con margen directo negativo' : 'Proyecto bajo el umbral de margen configurado', magnitud: { idProyecto: proyecto.idProyecto, codigo: proyecto.codigo, moneda: proyecto.moneda, margenDirecto: proyecto.margenDirecto, porcentajeMargen: proyecto.porcentajeMargen }, calidad: proyecto.estado, destino: `/dashboard-m7/margen-proyectos?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`, origen: 'Ventas, proveedores y operación' });
          cobertura.push({ familia: 'MARGEN_PROYECTO', estado: datos.estado, detalle: datos.cobertura.detalle });
        },
      },
      {
        familia: 'INSTALACIONES_ATRASADAS', permiso: 'CU252', cargar: async () => {
          const datos = await this.consultarAtrasosInstalaciones(consulta);
          if (datos.estado === 'FUENTE_NO_DISPONIBLE') throw new Error('Atrasos de instalaciones no disponibles');
          const atrasos = datos.atrasos.valor || [];
          if (atrasos.length) excepciones.push({ familia: 'INSTALACIONES_ATRASADAS', ocurrio: 'Existen instalaciones o tareas con fecha límite vencida', magnitud: { cantidad: atrasos.length, tareas: atrasos }, calidad: datos.atrasos.estado, destino: `/dashboard-m7/operacion?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`, origen: 'Terreno' });
          cobertura.push({ familia: 'INSTALACIONES_ATRASADAS', estado: datos.cobertura.estado, detalle: datos.cobertura.detalle });
        },
      },
      {
        familia: 'INCIDENCIAS_OPERACIONALES', permiso: 'CU253', cargar: async () => {
          const datos = await this.consultarIncidenciasRetrabajos(consulta, permisos);
          if (datos.estado === 'FUENTE_NO_DISPONIBLE') throw new Error('Incidencias no disponibles');
          const relevantes = datos.registros.filter((registro: any) => ['aprobada', 'pendiente_revision'].includes(registro.estadoRevision));
          for (const registro of relevantes) excepciones.push({ familia: 'INCIDENCIAS_OPERACIONALES', ocurrio: `${registro.referencia} · ${registro.categoria?.nombre || 'Sin categoría estructurada'} · ${registro.tarea}`, magnitud: { estadoRevision: registro.estadoRevision, antiguedadDias: registro.antiguedadDias, proyecto: registro.proyecto, cliente: registro.cliente, tieneEvidencia: registro.tieneEvidencia }, calidad: registro.estadoRevision === 'aprobada' ? 'VALIDO' : 'PENDIENTE_REVISION', destino: registro.destinoOwner || `/dashboard-m7/operacion?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`, origen: 'Terreno' });
          cobertura.push({ familia: 'INCIDENCIAS_OPERACIONALES', estado: datos.categorias.estado, detalle: 'Categoría, revisión y navegación provienen del registro oficial de Terreno; no se calcula un puntaje.' });
        },
      },
    ];
    const autorizadas = familias.filter(familia => permisos.includes(familia.permiso));
    for (const familia of autorizadas) {
      try { await familia.cargar(); }
      catch { cobertura.push({ familia: familia.familia, estado: 'FUENTE_NO_DISPONIBLE', detalle: 'La fuente de esta familia no está disponible' }); }
    }
    const fuentesCaidas = cobertura.some(familia => familia.estado === 'FUENTE_NO_DISPONIBLE');
    return { periodo: periodoSalida(periodo), estado: fuentesCaidas ? 'PARCIALMENTE_DISPONIBLE' as const : excepciones.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, excepciones, cobertura, criterioOrden: 'Familia y magnitud objetiva; no existe score ni recomendación automática' };
  }

  async consultarCotizacionesPendientes(consulta: Consulta, permisos: string[] = []) {
    const periodo = resolverPeriodoM7(consulta);
    const hoy = new Date(`${fechaNegocio()}T00:00:00Z`);
    try {
      const cotizaciones = await prisma.cotizacion.findMany({
        where: { estado_cotizacion: 'emitida', fecha_vigencia: { gte: hoy }, fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva }, nota_venta: null },
        include: { moneda: true, ficha_cliente: { include: { cliente_financiero: true } } },
        orderBy: [{ fecha_vigencia: 'asc' }, { id_cotizacion: 'asc' }],
      });
      const filas = cotizaciones.map(cotizacion => ({
        idCotizacion: cotizacion.id_cotizacion,
        idCliente: cotizacion.ficha_cliente.cliente_financiero.id_cliente_financiero,
        cliente: cotizacion.ficha_cliente.cliente_financiero.nombre_razon_social_referencia,
        moneda: cotizacion.moneda.codigo_moneda,
        montoPotencial: cotizacion.monto_neto?.gt(0) ? Number(cotizacion.monto_neto) : null,
        fechaEmision: fechaIso(cotizacion.fecha_emision),
        fechaVigencia: cotizacion.fecha_vigencia ? fechaIso(cotizacion.fecha_vigencia) : null,
        destinoCotizacion: permisos.includes('CU20') ? `/cotizacion/nueva?borrador=${cotizacion.id_cotizacion}` : null,
        destinoCliente: permisos.includes('CU09') ? rutaCliente(cotizacion.ficha_cliente.cliente_financiero) : null,
      }));
      const conMonto = filas.filter(fila => fila.montoPotencial !== null) as Array<typeof filas[number] & { montoPotencial: number }>;
      const montos = conMonto.map(fila => ({ moneda: fila.moneda, monto: fila.montoPotencial }));
      return { periodo: periodoSalida(periodo), estado: filas.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, cantidad: indicador(filas.length ? 'VALIDO' : 'SIN_RESULTADOS', filas.length, 'Cotizaciones emitidas, vigentes y aún no formalizadas como Venta'), montoPotencial: conMonto.length ? indicador(conMonto.length === filas.length ? 'VALIDO' : 'PARCIALMENTE_DISPONIBLE', agruparMonto(montos), `MONTO POTENCIAL; ${filas.length - conMonto.length} cotización(es) sin monto neto válido fueron excluidas del agregado`) : indicador('DATOS_INSUFICIENTES', null, 'MONTO POTENCIAL no disponible: las cotizaciones no tienen monto neto válido'), cotizaciones: filas, naturaleza: 'MONTO POTENCIAL; no representa Venta, ingreso, cobro, caja futura, forecast ni probabilidad de cierre' };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, cantidad: indicador('FUENTE_NO_DISPONIBLE', null, 'La información comercial no está disponible'), montoPotencial: indicador('FUENTE_NO_DISPONIBLE', null, 'La información comercial no está disponible'), cotizaciones: [], naturaleza: 'MONTO POTENCIAL' };
    }
  }

  private async consultarAnalisisVentasCompleto(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const segmento = resolverSegmentoComercialM7(consulta.segmento);
    const granularidad = granularidadPeriodoM7(periodo, consulta._granularidad);
    try {
      const incluir = { moneda: true, ficha_cliente: { include: { cliente_financiero: { include: { tipo_cliente_financiero: true } } } }, cotizacion: { include: { detalle_cotizacion: { include: { item_comercial: true } } } } } as const;
      const [universoActual, universoAnterior, cohorteCompleta, costosPeriodo, tareasPeriodo] = await Promise.all([
        prisma.nota_venta.findMany({ where: { fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_nota_venta: { in: estadosVentaDefinitiva } }, include: incluir, orderBy: { fecha_emision: 'asc' } }),
        prisma.nota_venta.findMany({ where: { fecha_emision: { gte: periodo.anteriorDesde, lt: periodo.anteriorHastaExclusiva }, estado_nota_venta: { in: estadosVentaDefinitiva } }, include: incluir }),
        prisma.cotizacion.findMany({ where: { fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva } }, include: { nota_venta: true, ficha_cliente: { include: { cliente_financiero: { include: { tipo_cliente_financiero: true } } } } }, orderBy: { fecha_emision: 'asc' } }),
        prisma.costo_proyecto.findMany({ where: { fecha_costo: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_costo: { not: 'anulado' } }, select: { fecha_costo: true, monto_costo: true, moneda: { select: { codigo_moneda: true } } } }),
        prisma.tarea_remunerable.findMany({ where: { fecha_tarea: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_validacion: 'validada', id_proyecto_financiero: { not: null } }, select: { fecha_tarea: true, monto_calculado: true } }),
      ]);
      const actuales = universoActual.filter(nota => perteneceSegmentoM7(nota.ficha_cliente.cliente_financiero, segmento));
      const anteriores = universoAnterior.filter(nota => perteneceSegmentoM7(nota.ficha_cliente.cliente_financiero, segmento));
      const conversionBase = cohorteCompleta.map(cotizacion => ({ segmento: nombreSegmentoClienteM7(cotizacion.ficha_cliente.cliente_financiero), convertida: Boolean(cotizacion.nota_venta && !['anulada', 'revertida', 'revertida_total'].includes(normalizarTexto(cotizacion.nota_venta.estado_nota_venta))) }));
      const conversionValor = calcularConversionSegmentadaM7(conversionBase, segmento);
      const conversion = indicador(conversionValor.totalCotizaciones ? 'VALIDO' : 'NO_APLICA', conversionValor, 'Conversión por cantidad de cotizaciones del segmento seleccionado; los pagos y montos no intervienen');
      const conversionSegmentos = (['TODOS', 'B2B', 'B2C'] as SegmentoComercialM7[]).map(nombre => ({ segmento: nombre, ...calcularConversionSegmentadaM7(conversionBase, nombre) }));
      const filas = actuales.map(nota => ({ moneda: nota.moneda.codigo_moneda, monto: Number(nota.monto_neto), nota }));
      const porMoneda = agruparMonto(filas);
      const convertir = (nota: typeof universoActual[number]) => nota.moneda.codigo_moneda === 'CLP' ? nota.monto_neto : nota.tipo_cambio_usado?.gt(0) ? nota.monto_neto.mul(nota.tipo_cambio_usado) : null;
      const convertidos = actuales.map(convertir);
      const cubiertos = convertidos.filter((monto): monto is Prisma.Decimal => monto !== null);
      const excluidosSinTipoCambio = convertidos.length - cubiertos.length;
      const totalClp = cubiertos.length ? cubiertos.reduce((total, monto) => total.plus(monto), new Prisma.Decimal(0)).toDecimalPlaces(2).toNumber() : null;
      const totalAnterior = anteriores.map(convertir);
      const anterioresCubiertos = totalAnterior.filter((monto): monto is Prisma.Decimal => monto !== null);
      const anteriorClp = anterioresCubiertos.length ? anterioresCubiertos.reduce((total, monto) => total.plus(monto), new Prisma.Decimal(0)).toDecimalPlaces(2).toNumber() : anteriores.length ? null : 0;
      const comparacion = anteriorClp === 0 ? indicador('NO_APLICA', { anteriorClp: 0, actualClp: totalClp, diferenciaAbsolutaClp: totalClp }, 'El período anterior tiene base cero; la variación porcentual no aplica') : totalClp === null || anteriorClp === null ? indicador('DATOS_INSUFICIENTES', null, 'Falta conversión histórica para comparar monedas') : indicador('VALIDO', { anteriorClp, actualClp: totalClp, diferenciaAbsolutaClp: Number((totalClp - anteriorClp).toFixed(2)), variacionPorcentual: Number((((totalClp - anteriorClp) / anteriorClp) * 100).toFixed(2)) }, 'Comparación contra un período inmediatamente anterior de igual duración');
      const agrupar = (clave: (nota: typeof actuales[number]) => string) => [...actuales.reduce((mapa, nota) => { const llave = `${clave(nota)}|${nota.moneda.codigo_moneda}`; mapa.set(llave, (mapa.get(llave) || 0) + Number(nota.monto_neto)); return mapa; }, new Map<string, number>())].map(([llave, montoNeto]) => { const separador = llave.lastIndexOf('|'); return { nombre: llave.slice(0, separador), moneda: llave.slice(separador + 1), montoNeto: Number(montoNeto.toFixed(2)) }; });
      const clientesAgrupados = [...actuales.reduce((mapa, nota) => {
        const cliente = nota.ficha_cliente.cliente_financiero;
        const montoClp = convertir(nota);
        if (montoClp === null) return mapa;
        const existente = mapa.get(cliente.id_cliente_financiero);
        mapa.set(cliente.id_cliente_financiero, {
          idCliente: cliente.id_cliente_financiero,
          nombre: cliente.nombre_razon_social_referencia,
          montoClp: redondear((existente?.montoClp || 0) + montoClp.toNumber()),
        });
        return mapa;
      }, new Map<number, { idCliente: number; nombre: string; montoClp: number }>()).values()];
      const totalClientesClp = clientesAgrupados.reduce((total, fila) => total + fila.montoClp, 0);
      const concentracionClientes = clientesAgrupados.sort((a, b) => b.montoClp - a.montoClp || a.nombre.localeCompare(b.nombre)).map((fila, indice) => ({ idCliente: fila.idCliente, cliente: fila.nombre, montoClp: fila.montoClp, participacionPorcentual: totalClientesClp > 0 ? redondear(fila.montoClp / totalClientesClp * 100) : null, posicion: indice + 1, destinoCliente: rutaCliente(actuales.find(nota => nota.ficha_cliente.cliente_financiero.id_cliente_financiero === fila.idCliente)!.ficha_cliente.cliente_financiero) }));
      const clientes = concentracionClientes;
      const ticketPorMoneda = porMoneda.map(fila => ({ moneda: fila.moneda, monto: Number((fila.monto / actuales.filter(nota => nota.moneda.codigo_moneda === fila.moneda).length).toFixed(2)) }));
      const filasProducto: Array<{ producto: string; segmento: string | null; unidades: number; ventaNetaClp: number | null }> = [];
      let ventasSinDetalle = 0;
      let ventasSinTipoCambio = 0;
      for (const nota of actuales) {
        const netoConvertido = convertir(nota);
        if (netoConvertido === null) ventasSinTipoCambio += 1;
        const detalle = (nota.cotizacion?.detalle_cotizacion || []).map(item => ({ producto: item.item_comercial.nombre_item, segmento: nombreSegmentoClienteM7(nota.ficha_cliente.cliente_financiero), cantidad: Number(item.cantidad_item), subtotal: Number(item.subtotal_item_estimado) }));
        const distribucion = distribuirVentaPorProductoM7(netoConvertido?.toNumber() ?? null, detalle);
        if (!distribucion.length) { ventasSinDetalle += 1; continue; }
        filasProducto.push(...distribucion.map(item => ({ producto: item.producto, segmento: item.segmento, unidades: item.cantidad, ventaNetaClp: item.ventaNetaClp })));
      }
      const productosAgrupados = [...filasProducto.reduce((mapa, fila) => { const llave = `${fila.segmento || 'SIN_CLASIFICAR'}|${fila.producto}`; const actual = mapa.get(llave) || { producto: fila.producto, segmento: fila.segmento, unidades: 0, ventaNetaClp: 0, tieneValor: false }; actual.unidades = redondear(actual.unidades + fila.unidades); if (fila.ventaNetaClp !== null) { actual.ventaNetaClp = redondear(actual.ventaNetaClp + fila.ventaNetaClp); actual.tieneValor = true; } mapa.set(llave, actual); return mapa; }, new Map<string, { producto: string; segmento: string | null; unidades: number; ventaNetaClp: number; tieneValor: boolean }>()).values()];
      const totalProductosClp = productosAgrupados.reduce((total, fila) => total + (fila.tieneValor ? fila.ventaNetaClp : 0), 0);
      const totalUnidades = productosAgrupados.reduce((total, fila) => total + fila.unidades, 0);
      const productosVendidos = productosAgrupados.map(({ tieneValor, ...fila }) => ({ ...fila, ventaNetaClp: tieneValor ? fila.ventaNetaClp : null, participacionValorPorcentual: tieneValor && totalProductosClp > 0 ? redondear(fila.ventaNetaClp / totalProductosClp * 100) : null, participacionUnidadesPorcentual: totalUnidades > 0 ? redondear(fila.unidades / totalUnidades * 100) : null })).sort((a, b) => (b.ventaNetaClp || 0) - (a.ventaNetaClp || 0) || b.unidades - a.unidades || a.producto.localeCompare(b.producto));
      const familias = [...productosVendidos.reduce((mapa, fila) => { const actual = mapa.get(fila.producto) || { familia: fila.producto, montoClp: 0, unidades: 0 }; actual.montoClp = redondear(actual.montoClp + (fila.ventaNetaClp || 0)); actual.unidades = redondear(actual.unidades + fila.unidades); mapa.set(fila.producto, actual); return mapa; }, new Map<string, { familia: string; montoClp: number; unidades: number }>()).values()].map(fila => ({ ...fila, participacionPorcentual: totalProductosClp > 0 ? redondear(fila.montoClp / totalProductosClp * 100) : null })).sort((a, b) => b.montoClp - a.montoClp || b.unidades - a.unidades);
      const detalleFamilias = `${filasProducto.length} detalle(s) estructurado(s); ${ventasSinDetalle} venta(s) sin detalle válido y ${ventasSinTipoCambio} sin tipo de cambio histórico válido, excluida(s) sólo del valor CLP y no de las unidades. El neto se prorratea por subtotal.`;
      const ventasPorFamilia = familias.length
        ? indicador(ventasSinDetalle || ventasSinTipoCambio ? 'PARCIALMENTE_DISPONIBLE' : 'VALIDO', familias, detalleFamilias)
        : indicador(actuales.length ? 'DATOS_INSUFICIENTES' : 'SIN_RESULTADOS', [], detalleFamilias);
      const participacionBase = universoActual.reduce((mapa, nota) => { const nombre = nombreSegmentoClienteM7(nota.ficha_cliente.cliente_financiero); const monto = convertir(nota); if (!nombre) return mapa; const actual = mapa.get(nombre) || { segmento: nombre, montoClp: 0, ventas: 0, excluidasSinTipoCambio: 0 }; actual.ventas += 1; if (monto === null) actual.excluidasSinTipoCambio += 1; else actual.montoClp = redondear(actual.montoClp + monto.toNumber()); mapa.set(nombre, actual); return mapa; }, new Map<string, { segmento: string; montoClp: number; ventas: number; excluidasSinTipoCambio: number }>()) ;
      const totalParticipacion = [...participacionBase.values()].reduce((total, fila) => total + fila.montoClp, 0);
      const participacionSegmentos = [...participacionBase.values()].map(fila => ({ ...fila, participacionPorcentual: totalParticipacion > 0 ? redondear(fila.montoClp / totalParticipacion * 100) : null })).sort((a, b) => b.montoClp - a.montoClp);
      const claveTemporal = (fecha: Date) => granularidad === 'dia' ? fechaIso(fecha) : claveMes(fecha);
      const serieTemporal = clavesPeriodoM7(periodo, granularidad).map(clave => {
        const ventasBucket = actuales.filter(nota => claveTemporal(nota.fecha_emision) === clave);
        const montosBucket = ventasBucket.map(convertir);
        const cotizacionesBucket = cohorteCompleta.filter(cotizacion => claveTemporal(cotizacion.fecha_emision) === clave && perteneceSegmentoM7(cotizacion.ficha_cliente.cliente_financiero, segmento));
        const convertidasBucket = cotizacionesBucket.filter(cotizacion => cotizacion.nota_venta && !['anulada', 'revertida', 'revertida_total'].includes(normalizarTexto(cotizacion.nota_venta.estado_nota_venta))).length;
        const costosBucket = costosPeriodo.filter(costo => claveTemporal(costo.fecha_costo) === clave);
        const tareasBucket = tareasPeriodo.filter(tarea => claveTemporal(tarea.fecha_tarea) === clave);
        const costosClpBucket = costosBucket.filter(costo => costo.moneda.codigo_moneda === 'CLP').reduce((total, costo) => total + Number(costo.monto_costo), 0) + tareasBucket.reduce((total, tarea) => total + Number(tarea.monto_calculado), 0);
        const hayCostosBucket = costosBucket.length > 0 || tareasBucket.length > 0;
        const costoComparable = segmento === 'TODOS' && hayCostosBucket && costosBucket.every(costo => costo.moneda.codigo_moneda === 'CLP') ? redondear(costosClpBucket) : null;
        const consolidado = consolidarBucketVentasM7(montosBucket.map(monto => monto?.toNumber() ?? null));
        return { periodo: clave, ...consolidado, cantidadVentas: ventasBucket.length, ticketPromedio: consolidado.ventasIncluidasClp && consolidado.ventaNetaClp !== null ? redondear(consolidado.ventaNetaClp / consolidado.ventasIncluidasClp) : null, cotizaciones: cotizacionesBucket.length, conversiones: convertidasBucket, tasaConversion: cotizacionesBucket.length ? redondear(convertidasBucket / cotizacionesBucket.length * 100) : null, costosDirectos: costoComparable, resultadoGerencial: consolidado.ventaNetaClp !== null && costoComparable !== null && consolidado.ventasExcluidasSinTipoCambio === 0 ? redondear(consolidado.ventaNetaClp - costoComparable) : null };
      });
      const costosClp = costosPeriodo.filter(costo => costo.moneda.codigo_moneda === 'CLP').reduce((total, costo) => total + Number(costo.monto_costo), 0) + tareasPeriodo.reduce((total, tarea) => total + Number(tarea.monto_calculado), 0);
      const costosComparables = segmento === 'TODOS' && (costosPeriodo.length > 0 || tareasPeriodo.length > 0) && costosPeriodo.every(costo => costo.moneda.codigo_moneda === 'CLP');
      const costoDirecto = costosComparables ? redondear(costosClp) : null;
      const resultadoPeriodo = totalClp !== null && costoDirecto !== null && excluidosSinTipoCambio === 0 ? redondear(totalClp - costoDirecto) : null;
      return {
        periodo: periodoSalida(periodo), segmento, estado: actuales.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const,
        montoNeto: !actuales.length ? indicador('SIN_RESULTADOS', { porMoneda: [], totalClp: null, ventasIncluidasClp: 0, ventasExcluidasSinTipoCambio: 0 }, `No existen ventas definitivas para ${segmento} en el período`) : totalClp === null ? indicador('DATOS_INSUFICIENTES', { porMoneda, totalClp: null, ventasIncluidasClp: 0, ventasExcluidasSinTipoCambio: excluidosSinTipoCambio }, 'No hay ventas con conversión histórica válida para consolidar CLP') : indicador(excluidosSinTipoCambio ? 'PARCIALMENTE_DISPONIBLE' : 'VALIDO', { porMoneda, totalClp, ventasIncluidasClp: cubiertos.length, ventasExcluidasSinTipoCambio: excluidosSinTipoCambio }, `Monto neto de ventas confirmadas o cerradas; ${excluidosSinTipoCambio} venta(s) en moneda extranjera excluida(s) por falta de tipo de cambio histórico válido`),
        cantidad: indicador(actuales.length ? 'VALIDO' : 'SIN_RESULTADOS', actuales.length, `Ventas definitivas del período para ${segmento}`), conversion, conversionSegmentos,
        ticketMedio: indicador(cubiertos.length ? (excluidosSinTipoCambio ? 'PARCIALMENTE_DISPONIBLE' : 'VALIDO') : 'NO_APLICA', { porMoneda: ticketPorMoneda, totalClp: totalClp === null || !cubiertos.length ? null : Number((totalClp / cubiertos.length).toFixed(2)) }, 'Monto neto consolidado dividido por ventas con valor CLP comparable; no usa cotizaciones, cobros ni facturación documental'),
        evolucion: agrupar(nota => fechaIso(nota.fecha_emision)),
        clientes,
        tiposCliente: agrupar(nota => nota.ficha_cliente.cliente_financiero.tipo_cliente_financiero.nombre_tipo_cliente_financiero),
        concentracionClientes: indicador(totalClientesClp > 0 ? (excluidosSinTipoCambio ? 'PARCIALMENTE_DISPONIBLE' : 'VALIDO') : 'NO_APLICA', concentracionClientes, totalClientesClp > 0 ? 'Participación sobre ventas netas comparables consolidadas en CLP' : 'No existe total comparable para calcular participación'),
        productos: indicador(productosVendidos.length ? (ventasSinDetalle || ventasSinTipoCambio ? 'PARCIALMENTE_DISPONIBLE' : 'VALIDO') : actuales.length ? 'DATOS_INSUFICIENTES' : 'SIN_RESULTADOS', productosVendidos, detalleFamilias),
        productosVendidos, ventasPorFamilia, participacionSegmentos,
        granularidad, serieTemporal,
        costosDirectos: indicador(costoDirecto === null ? 'DATOS_INSUFICIENTES' : 'VALIDO', costoDirecto, segmento === 'TODOS' ? 'Costos directos atribuibles del período; monedas sin equivalencia histórica impiden consolidar' : 'Los costos directos no se distribuyen artificialmente por segmento'),
        resultadoGerencial: indicador(resultadoPeriodo === null ? 'DATOS_INSUFICIENTES' : 'VALIDO', resultadoPeriodo, 'Venta neta comparable menos costos directos atribuibles; no es un Estado de Resultados contable'),
        brechaTaxonomiaB2B: 'Clasificación detallada B2B pendiente de taxonomía; se muestran productos reales sin inferir categorías desde texto libre.',
        comparacion,
      };
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, montoNeto: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), cantidad: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), conversion: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), ticketMedio: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), evolucion: [], clientes: [], tiposCliente: [], concentracionClientes: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), productos: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), ventasPorFamilia: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), comparacion: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible') };
    }
  }

  private async consultarCuentasCobrarCompleto(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const segmento = resolverSegmentoComercialM7(consulta.segmento);
    const fechaReferencia = new Date(`${fechaNegocio()}T00:00:00Z`);
    try {
      const notasUniverso = await prisma.nota_venta.findMany({ where: { estado_nota_venta: { notIn: retiradosCxC } }, include: { ...incluirNota, ficha_cliente: { include: { cliente_financiero: { include: { tipo_cliente_financiero: true } } } }, hito_cobro: true } });
      const notas = notasUniverso.filter(nota => perteneceSegmentoM7(nota.ficha_cliente.cliente_financiero, segmento));
      if (!notas.length) return { periodo: periodoSalida(periodo), estado: 'SIN_RESULTADOS' as const, saldo: indicador('SIN_RESULTADOS', null, 'No existen cuentas por cobrar vigentes'), morosidad: indicador('SIN_RESULTADOS', null, 'No existen obligaciones con saldo'), cartera: indicador('SIN_RESULTADOS', [], 'No existen obligaciones con saldo'), aging: indicador('NO_APLICA', null, 'No existe cartera para calcular antigüedad'), recaudacion: indicador('SIN_RESULTADOS', null, 'No existen pagos asociados'), detalleCobranza: indicador('SIN_RESULTADOS', { cantidadPagos: 0, pagos: [] }, 'No existen pagos asociados'), cumplimiento: indicador('DATOS_INSUFICIENTES', null, 'No existe base exigible reconstruible'), recuperacionMoraPrevia: indicador('DATOS_INSUFICIENTES', null, 'No existe histórico suficiente'), compromisosFuturos: indicador('NO_APLICA', [], 'No existen compromisos futuros') };
      const calculadas = notas.map(nota => ({ nota, calculo: calcularNota(nota) }));
      const pendientes = calculadas.filter(x => x.calculo.saldoPendiente > 0);
      const carteraCompleta = pendientes.map(({ nota, calculo }) => {
        const vencimiento = nota.fecha_vencimiento;
        const diasAtraso = vencimiento && vencimiento < fechaReferencia ? diasCalendario(vencimiento, fechaReferencia) : vencimiento ? 0 : null;
        const condicion = !vencimiento ? 'SIN_FECHA' : vencimiento < fechaReferencia ? 'VENCIDA' : vencimiento >= periodo.hastaExclusiva ? 'FUTURA' : 'VIGENTE';
        const equivalenteClp = equivalenteClpCxc(calculo.saldoPendiente, nota.moneda.codigo_moneda, nota.tipo_cambio_usado?.gt(0) ? Number(nota.tipo_cambio_usado) : null);
        return { idNota: nota.id_nota_venta, numeroNota: nota.numero_nota_venta, idCliente: nota.ficha_cliente.cliente_financiero.id_cliente_financiero, cliente: nota.ficha_cliente.cliente_financiero.nombre_razon_social_referencia, moneda: nota.moneda.codigo_moneda, saldo: calculo.saldoPendiente, equivalenteClp, fechaVencimiento: vencimiento ? fechaIso(vencimiento) : null, diasAtraso, condicion, estadoOwner: nota.estado_pago, destinoCliente: rutaCliente(nota.ficha_cliente.cliente_financiero) };
      });
      const numero = (valor: unknown) => valor === undefined ? null : Number(valor);
      const idCliente = numero(consulta.idCliente); const saldoMin = numero(consulta.saldoMin); const saldoMax = numero(consulta.saldoMax); const condicion = String(consulta.condicion || '').trim().toUpperCase(); const estadoOwner = String(consulta.estadoOwner || '').trim().toLowerCase();
      const cartera = carteraCompleta.filter(fila => (idCliente === null || fila.idCliente === idCliente) && (saldoMin === null || fila.saldo >= saldoMin) && (saldoMax === null || fila.saldo <= saldoMax) && (!condicion || fila.condicion === condicion) && (!estadoOwner || fila.estadoOwner.toLowerCase() === estadoOwner));
      const saldos = agruparMonto(carteraCompleta.map(x => ({ moneda: x.moneda, monto: x.saldo })));
      const morosas = carteraCompleta.filter(x => x.condicion === 'VENCIDA');
      const pagos = new Map<number, { idPago: number; idNota: number; idCliente: number; cliente: string; fecha: string; moneda: string; monto: number; destinoCliente: string }>();
      for (const { nota } of calculadas) for (const asignacion of nota.asignacion_pago_cliente) { const pago = asignacion.pago_cliente; const monto = efectoPago(pago).toNumber(); if (monto > 0 && pago.fecha_pago >= periodo.desde && pago.fecha_pago < periodo.hastaExclusiva) pagos.set(pago.id_pago_cliente, { idPago: pago.id_pago_cliente, idNota: nota.id_nota_venta, idCliente: nota.ficha_cliente.cliente_financiero.id_cliente_financiero, cliente: nota.ficha_cliente.cliente_financiero.nombre_razon_social_referencia, fecha: fechaIso(pago.fecha_pago), moneda: pago.moneda.codigo_moneda, monto, destinoCliente: rutaCliente(nota.ficha_cliente.cliente_financiero) }); }
      const ordenar = String(consulta.ordenar || 'vencimiento').toLowerCase(); const direccion = direccionOrden(consulta.direccion);
      const compromisos = cartera.filter(fila => fila.condicion === 'FUTURA').map(fila => ({ ...fila, monto: fila.saldo, naturaleza: 'COMPROMISO_FUTURO' as const }))
        .sort((a, b) => compararNullable(ordenar === 'monto' ? a.saldo : a.fechaVencimiento, ordenar === 'monto' ? b.saldo : b.fechaVencimiento, direccion) || a.idNota - b.idNota);
      const pagosLista = [...pagos.values()];
      const exigibles: Array<{ moneda: string; debido: number; pagado: number }> = [];
      const moraRecuperada: Array<{ moneda: string; monto: number; idNota: number; fechaVencimiento: string }> = [];
      const pagadas = calculadas.filter(item => item.calculo.saldoPendiente === 0).map(({ nota }) => {
        const pagosEfectivos = nota.asignacion_pago_cliente.filter(asignacion => efectoPago(asignacion.pago_cliente).gt(0));
        const final = pagosEfectivos.reduce<Date | null>((mayor, asignacion) => !mayor || asignacion.pago_cliente.fecha_pago > mayor ? asignacion.pago_cliente.fecha_pago : mayor, null);
        return { idNota: nota.id_nota_venta, numeroNota: nota.numero_nota_venta, estado: 'Pagado', fechaPagoFinal: final ? fechaIso(final) : null, fechaVencimiento: nota.fecha_vencimiento ? fechaIso(nota.fecha_vencimiento) : null, diasAtraso: final && nota.fecha_vencimiento && final > nota.fecha_vencimiento ? diasCalendario(nota.fecha_vencimiento, final) : null };
      });
      for (const { nota, calculo } of calculadas) {
        const moneda = nota.moneda.codigo_moneda;
        const hitosPeriodo = nota.hito_cobro.filter(hito => dentro(hito.fecha_programada_cobro, periodo));
        const debido = hitosPeriodo.length ? hitosPeriodo.reduce((suma, hito) => suma + Number(hito.monto_programado), 0) : nota.fecha_vencimiento && dentro(nota.fecha_vencimiento, periodo) ? calculo.montoComercialVigente : 0;
        const pagado = nota.asignacion_pago_cliente.filter(asignacion => dentro(asignacion.pago_cliente.fecha_pago, periodo)).reduce((suma, asignacion) => suma + Number(Prisma.Decimal.min(asignacion.monto_asignado, efectoPago(asignacion.pago_cliente))), 0);
        if (debido > 0) exigibles.push({ moneda, debido, pagado: Math.min(debido, pagado) });
        const fechaVencimiento = nota.fecha_vencimiento;
        if (fechaVencimiento && fechaVencimiento < periodo.desde && pagado > 0) moraRecuperada.push({ moneda, monto: pagado, idNota: nota.id_nota_venta, fechaVencimiento: fechaIso(fechaVencimiento) });
      }
      const cumplimientoPorMoneda = [...exigibles.reduce((mapa, fila) => { const actual = mapa.get(fila.moneda) || { moneda: fila.moneda, debido: 0, pagado: 0 }; actual.debido += fila.debido; actual.pagado += fila.pagado; mapa.set(fila.moneda, actual); return mapa; }, new Map<string, { moneda: string; debido: number; pagado: number }>()).values()].map(fila => ({ ...fila, cumplimientoPorcentual: fila.debido > 0 ? redondear(fila.pagado / fila.debido * 100) : null }));
      const deudaPorCliente = [...carteraCompleta.reduce((mapa, fila) => { const clave = `${fila.idCliente}|${fila.moneda}`; const actual = mapa.get(clave) || { idCliente: fila.idCliente, cliente: fila.cliente, moneda: fila.moneda, saldo: 0, destinoCliente: fila.destinoCliente }; actual.saldo += fila.saldo; mapa.set(clave, actual); return mapa; }, new Map<string, { idCliente: number; cliente: string; moneda: string; saldo: number; destinoCliente: string }>()).values()];
      const totalDeudaMoneda = new Map(agruparMonto(deudaPorCliente.map(fila => ({ moneda: fila.moneda, monto: fila.saldo }))).map(fila => [fila.moneda, fila.monto]));
      const concentracionDeuda = deudaPorCliente.map(fila => ({ ...fila, porcentaje: totalDeudaMoneda.get(fila.moneda) ? redondear(fila.saldo / totalDeudaMoneda.get(fila.moneda)! * 100) : null })).sort((a, b) => a.moneda.localeCompare(b.moneda) || b.saldo - a.saldo);
      return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, fechaReferencia: fechaIso(fechaReferencia), saldo: indicador('VALIDO', saldos, 'Saldo vigente según la fuente oficial de cuentas por cobrar'), morosidad: indicador('VALIDO', { cantidad: morosas.length, porMoneda: agruparMonto(morosas.map(x => ({ moneda: x.moneda, monto: x.saldo }))), obligaciones: morosas }, 'Obligaciones vencidas con saldo y días calendario exactos'), cartera: indicador('VALIDO', cartera, 'Cartera filtrada con criterios objetivos; SIN_FECHA no se convierte en cero días'), aging: indicador('PARCIALMENTE_DISPONIBLE', { obligaciones: cartera, rangos: null }, 'Se informan días exactos; no existen rangos oficiales confirmados para agrupar aging'), concentracionDeuda: indicador(concentracionDeuda.length ? 'VALIDO' : 'SIN_RESULTADOS', concentracionDeuda, 'Porcentaje del saldo pendiente que representa cada Cliente dentro de su moneda'), obligacionesPagadas: indicador(pagadas.length ? 'VALIDO' : 'SIN_RESULTADOS', pagadas, 'Una etiqueta de atraso sólo existe cuando el pago final fue posterior al vencimiento'), recaudacion: pagosLista.length ? indicador('VALIDO', agruparMonto(pagosLista), 'Pagos vigentes recibidos en el período') : indicador('SIN_RESULTADOS', null, 'No existen pagos efectivos en el período'), detalleCobranza: indicador(pagosLista.length ? 'VALIDO' : 'SIN_RESULTADOS', { cantidadPagos: pagosLista.length, pagos: pagosLista }, 'Detalle de pagos vigentes y vínculo al cliente'), cumplimiento: cumplimientoPorMoneda.length ? indicador('VALIDO', cumplimientoPorMoneda, 'Monto efectivamente pagado en el período dividido por monto exigible con vencimiento en el período') : indicador('NO_APLICA', [], 'No existían montos exigibles con vencimiento en el período'), recuperacionMoraPrevia: moraRecuperada.length ? indicador('VALIDO', { porMoneda: agruparMonto(moraRecuperada), pagos: moraRecuperada }, 'Pagos del período aplicados a obligaciones vencidas antes de comenzar el período') : indicador('SIN_RESULTADOS', [], 'No se recuperó mora previa durante el período'), compromisosFuturos: compromisos.length ? indicador('VALIDO', compromisos, 'Compromisos futuros de cuentas por cobrar; no representan cobros realizados') : indicador('NO_APLICA', [], 'No existen compromisos futuros con fecha válida') };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, saldo: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por cobrar no está disponible'), morosidad: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por cobrar no está disponible'), cartera: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por cobrar no está disponible'), aging: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por cobrar no está disponible'), recaudacion: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por cobrar no está disponible'), detalleCobranza: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por cobrar no está disponible'), cumplimiento: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por cobrar no está disponible'), recuperacionMoraPrevia: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por cobrar no está disponible'), compromisosFuturos: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por cobrar no está disponible') };
    }
  }

  private async consultarCuentasPagarCompleto(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const [obligaciones, monedas, proveedores] = await Promise.all([prisma.obligacion_proveedor_m5.findMany(), prisma.moneda.findMany(), prisma.proveedor.findMany()]);
      if (!obligaciones.length) return { periodo: periodoSalida(periodo), estado: 'DATOS_INSUFICIENTES' as const, saldo: indicador('DATOS_INSUFICIENTES', null, 'No existen obligaciones de cuentas por pagar'), estados: indicador('DATOS_INSUFICIENTES', null, 'Sin obligaciones que clasificar'), proveedores: [], categorias: indicador('DATOS_INSUFICIENTES', null, 'Sin documentos clasificados'), compromisosFuturos: indicador('NO_APLICA', [], 'No existen compromisos futuros') };
      const asociaciones = await prisma.asociacion_documento_oc_m5.findMany({ where: { id_documento_m5: { in: obligaciones.map(o => o.id_documento_m5) } } });
      const clasificaciones = await prisma.clasificacion_asociacion_m5.findMany({ where: { id_asociacion_m5: { in: asociaciones.map(a => a.id_asociacion_m5) } } });
      const fechaReferencia = new Date(`${fechaNegocio()}T00:00:00Z`);
      const codigos = new Map(monedas.map(m => [m.id_moneda, m.codigo_moneda])); const proveedoresPorId = new Map(proveedores.map(p => [p.id_proveedor, p]));
      const documentoPorAsociacion = new Map(asociaciones.map(a => [a.id_asociacion_m5, a.id_documento_m5]));
      const clasificacionesPorDocumento = new Map<number, typeof clasificaciones>();
      for (const clasificacion of clasificaciones) { const idDocumento = documentoPorAsociacion.get(clasificacion.id_asociacion_m5); if (idDocumento) clasificacionesPorDocumento.set(idDocumento, [...(clasificacionesPorDocumento.get(idDocumento) || []), clasificacion]); }
      const estadosLiquidados = new Set(['pagada', 'pagado', 'liquidada', 'liquidado', 'anulada', 'anulado', 'cancelada', 'cancelado']);
      const vigentesCompletas = obligaciones.filter(o => o.saldo_actual.gt(0) && !estadosLiquidados.has(normalizarTexto(o.estado_pago))).map(o => {
        const proveedor = proveedoresPorId.get(o.id_proveedor);
        const vencida = o.fecha_vencimiento < fechaReferencia;
        return { id: o.id_obligacion_m5, idDocumento: o.id_documento_m5, idProveedor: o.id_proveedor, proveedor: proveedor?.nombre_razon_social || 'Proveedor no disponible', moneda: codigos.get(o.id_moneda) || 'N/D', saldo: Number(o.saldo_actual), fechaEmision: fechaIso(o.fecha_emision), fechaVencimiento: fechaIso(o.fecha_vencimiento), diasAtraso: vencida ? diasCalendario(o.fecha_vencimiento, fechaReferencia) : 0, condicion: vencida ? 'VENCIDA' : o.fecha_vencimiento >= periodo.hastaExclusiva ? 'FUTURA' : 'VIGENTE', estadoPago: o.estado_pago, condicionTemporal: o.condicion_temporal };
      });
      const idProveedor = numeroConsulta(consulta.idProveedor); const saldoMin = numeroConsulta(consulta.saldoMin); const saldoMax = numeroConsulta(consulta.saldoMax);
      const condicion = String(consulta.condicion || '').trim().toUpperCase(); const estadoPago = normalizarTexto(String(consulta.estadoPago || ''));
      const ordenar = String(consulta.ordenar || 'vencimiento').toLowerCase(); const direccion = direccionOrden(consulta.direccion);
      const vigentes = vigentesCompletas.filter(fila => (idProveedor === null || fila.idProveedor === idProveedor) && (saldoMin === null || fila.saldo >= saldoMin) && (saldoMax === null || fila.saldo <= saldoMax) && (!condicion || fila.condicion === condicion) && (!estadoPago || normalizarTexto(fila.estadoPago) === estadoPago))
        .sort((a, b) => compararNullable(ordenar === 'monto' ? a.saldo : ordenar === 'proveedor' ? a.proveedor : a.fechaVencimiento, ordenar === 'monto' ? b.saldo : ordenar === 'proveedor' ? b.proveedor : b.fechaVencimiento, direccion) || a.id - b.id);
      const porProveedor = [...vigentes.reduce((mapa, fila) => { const clave = `${fila.proveedor}|${fila.moneda}`; mapa.set(clave, (mapa.get(clave) || 0) + fila.saldo); return mapa; }, new Map<string, number>())].map(([clave, saldo]) => { const [proveedor, moneda] = clave.split('|'); return { proveedor, moneda, saldo }; });
      const estados = [...vigentes.reduce((mapa, fila) => mapa.set(fila.condicionTemporal || 'Sin clasificación', (mapa.get(fila.condicionTemporal || 'Sin clasificación') || 0) + 1), new Map<string, number>())].map(([estado, cantidad]) => ({ estado, cantidad }));
      const categorias = [...vigentes.reduce((mapa, fila) => { const detalles = clasificacionesPorDocumento.get(fila.idDocumento) || []; const totalClasificado = detalles.reduce((suma, detalle) => suma + Number(detalle.monto), 0); for (const detalle of detalles) { const categoria = detalle.nombre_categoria_snapshot || 'Categoría sin nombre'; const saldo = totalClasificado > 0 ? fila.saldo * Number(detalle.monto) / totalClasificado : 0; mapa.set(`${categoria}|${fila.moneda}`, (mapa.get(`${categoria}|${fila.moneda}`) || 0) + saldo); } return mapa; }, new Map<string, number>())].map(([clave, saldo]) => { const [categoria, moneda] = clave.split('|'); return { categoria, moneda, saldo: Number(saldo.toFixed(2)) }; });
      const futuros = vigentes.filter(fila => fila.condicion === 'FUTURA').map(fila => ({ ...fila, monto: fila.saldo, naturaleza: 'COMPROMISO_FUTURO' as const }));
      return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, fechaReferencia: fechaIso(fechaReferencia), saldo: vigentes.length ? indicador('VALIDO', agruparMonto(vigentes.map(f => ({ moneda: f.moneda, monto: f.saldo }))), 'Saldo actual de obligaciones de cuentas por pagar') : indicador('NO_APLICA', [], 'No existen saldos pendientes'), cartera: indicador(vigentes.length ? 'VALIDO' : 'SIN_RESULTADOS', vigentes, 'Obligaciones con saldo aplicable, atraso exacto, filtros y orden objetivo'), aging: indicador(vigentes.length ? 'PARCIALMENTE_DISPONIBLE' : 'NO_APLICA', { obligaciones: vigentes, rangos: null }, 'Se informan días exactos; no existen rangos oficiales confirmados'), estados: indicador('VALIDO', estados, 'Estados derivados de la fuente oficial de cuentas por pagar'), proveedores: porProveedor, categorias: categorias.length ? indicador('VALIDO', categorias, 'Distribución proporcional basada en clasificaciones confirmadas') : indicador('DATOS_INSUFICIENTES', null, 'Las obligaciones vigentes no tienen clasificación confiable'), compromisosFuturos: futuros.length ? indicador('VALIDO', futuros, 'Obligaciones futuras de cuentas por pagar; no representan pagos realizados') : indicador('NO_APLICA', [], 'No existen compromisos futuros') };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, saldo: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por pagar no está disponible'), estados: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por pagar no está disponible'), proveedores: [], categorias: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por pagar no está disponible'), compromisosFuturos: indicador('FUENTE_NO_DISPONIBLE', null, 'La información de cuentas por pagar no está disponible') };
    }
  }

  private presentarProyeccionM7(fila: { id_proyeccion_financiera_m7: number; tipo: string; anio: number; mes: number; categoria: string; monto_proyectado: Prisma.Decimal; observacion: string | null; estado: string; moneda: { codigo_moneda: string } }) {
    return { id: fila.id_proyeccion_financiera_m7, tipo: fila.tipo, anio: fila.anio, mes: fila.mes, categoria: fila.categoria, moneda: fila.moneda.codigo_moneda, montoProyectado: Number(fila.monto_proyectado), observacion: fila.observacion, estado: fila.estado };
  }

  async consultarProyeccionesM7(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const filas = await prisma.proyeccion_financiera_m7.findMany({ where: { estado: 'activo', anio: { gte: periodo.desde.getUTCFullYear(), lte: new Date(periodo.hastaExclusiva.getTime() - 1).getUTCFullYear() } }, include: { moneda: true }, orderBy: [{ anio: 'asc' }, { mes: 'asc' }, { categoria: 'asc' }] });
    const activas = filas.filter(fila => { const mes = new Date(Date.UTC(fila.anio, fila.mes - 1, 1)); return mes < periodo.hastaExclusiva && new Date(Date.UTC(fila.anio, fila.mes, 1)) > periodo.desde; }).map(fila => this.presentarProyeccionM7(fila));
    const totales = [...activas.reduce((mapa, fila) => { const actual = mapa.get(fila.moneda) || { moneda: fila.moneda, ingresosProyectados: 0, egresosProyectados: 0 }; if (categoriasEntradaProyeccionM7.has(fila.categoria)) actual.ingresosProyectados += fila.montoProyectado; else actual.egresosProyectados += fila.montoProyectado; mapa.set(fila.moneda, actual); return mapa; }, new Map<string, { moneda: string; ingresosProyectados: number; egresosProyectados: number }>()).values()].map(fila => ({ ...fila, ingresosProyectados: redondear(fila.ingresosProyectados), egresosProyectados: redondear(fila.egresosProyectados), flujoProyectado: redondear(fila.ingresosProyectados - fila.egresosProyectados) }));
    return { periodo: periodoSalida(periodo), estado: activas.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, categorias: categoriasFlujoProyectadoM7, proyecciones: activas, totales };
  }

  async guardarProyeccionM7(entrada: Record<string, unknown>, actorId: bigint, id?: number) {
    const tipo = String(entrada.tipo || 'FLUJO_CAJA').toUpperCase(); const anio = Number(entrada.anio); const mes = Number(entrada.mes);
    const categoria = String(entrada.categoria || '').toUpperCase(); const moneda = String(entrada.moneda || '').toUpperCase(); const monto = new Prisma.Decimal(String(entrada.montoProyectado ?? ''));
    if (!['FLUJO_CAJA', 'ESTADO_RESULTADOS'].includes(tipo)) throw new ErrorAplicacion(400, 'Tipo de proyección inválido');
    if (!Number.isInteger(anio) || anio < 2000 || anio > 2200 || !Number.isInteger(mes) || mes < 1 || mes > 12) throw new ErrorAplicacion(400, 'Período de proyección inválido');
    if (tipo === 'FLUJO_CAJA' && !categoriasFlujoProyectadoM7.includes(categoria as typeof categoriasFlujoProyectadoM7[number])) throw new ErrorAplicacion(400, 'Categoría de flujo inválida');
    if (!moneda || !monto.isFinite() || monto.lt(0)) throw new ErrorAplicacion(400, 'Moneda y monto no negativo son obligatorios');
    const monedaOwner = await prisma.moneda.findUnique({ where: { codigo_moneda: moneda } }); if (!monedaOwner || monedaOwner.estado_moneda !== 'activo') throw new ErrorAplicacion(400, 'Moneda no disponible');
    const observacion = String(entrada.observacion || '').trim().slice(0, 1000) || null;
    const anterior = id ? await prisma.proyeccion_financiera_m7.findUnique({ where: { id_proyeccion_financiera_m7: id }, include: { moneda: true } }) : null;
    if (id && !anterior) throw new ErrorAplicacion(404, 'Proyección no encontrada');
    const fila = id
      ? await prisma.proyeccion_financiera_m7.update({ where: { id_proyeccion_financiera_m7: id }, data: { tipo, anio, mes, id_moneda: monedaOwner.id_moneda, categoria, monto_proyectado: monto, observacion, estado: 'activo', actualizado_por: actorId, fecha_actualizacion: new Date() }, include: { moneda: true } })
      : await prisma.proyeccion_financiera_m7.create({ data: { tipo, anio, mes, id_moneda: monedaOwner.id_moneda, categoria, monto_proyectado: monto, observacion, creado_por: actorId }, include: { moneda: true } });
    const salida = this.presentarProyeccionM7(fila);
    Object.defineProperty(salida, '__auditoriaM9', { value: { anterior: anterior ? this.presentarProyeccionM7(anterior) : undefined, nuevo: salida }, enumerable: false });
    return salida;
  }

  async desactivarProyeccionM7(id: number, actorId: bigint) {
    const anterior = await prisma.proyeccion_financiera_m7.findUnique({ where: { id_proyeccion_financiera_m7: id }, include: { moneda: true } }); if (!anterior) throw new ErrorAplicacion(404, 'Proyección no encontrada');
    const fila = await prisma.proyeccion_financiera_m7.update({ where: { id_proyeccion_financiera_m7: id }, data: { estado: 'inactivo', actualizado_por: actorId, fecha_actualizacion: new Date() }, include: { moneda: true } });
    const salida = this.presentarProyeccionM7(fila); Object.defineProperty(salida, '__auditoriaM9', { value: { anterior: this.presentarProyeccionM7(anterior), nuevo: salida }, enumerable: false }); return salida;
  }

  private async consultarLiquidezCompleto(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    let liquidezActual = indicador<unknown>('FUENTE_NO_DISPONIBLE', null, 'La fuente de movimientos financieros no está disponible');
    let flujoHistorico;
    try {
      const [movimientos, gastosCajaAprobados] = await Promise.all([
        prisma.movimiento_financiero.findMany({ where: { fecha_movimiento: { lt: periodo.hastaExclusiva }, estado_movimiento: { notIn: ['anulado', 'rechazado'] } }, include: { moneda: true, origen_movimiento_financiero: true }, orderBy: [{ fecha_movimiento: 'asc' }, { id_movimiento_financiero: 'asc' }] }),
        prisma.gasto_caja_chica_m5.findMany({ where: { fecha_gasto: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado: 'aprobado' }, select: { id_gasto_caja_chica_m5: true } }),
      ]);
      const granularidadEntrada = normalizarTexto(String(consulta.granularidad || 'dia'));
      if (!['dia', 'semana', 'mes'].includes(granularidadEntrada)) throw new ErrorAplicacion(400, 'Granularidad inválida; use dia, semana o mes');
      const granularidad = granularidadEntrada as 'dia' | 'semana' | 'mes';
      const categoria = String(consulta.categoria || '').trim(); const origen = String(consulta.origen || '').trim();
      const filtrados = movimientos.filter(m => (!categoria || m.tipo_movimiento_financiero === categoria) && (!origen || m.origen_movimiento_financiero.some(o => o.entidad_origen === origen)));
      const actuales = filtrados.filter(m => dentro(m.fecha_movimiento, periodo));
      const anteriores = filtrados.filter(m => m.fecha_movimiento >= periodo.anteriorDesde && m.fecha_movimiento < periodo.anteriorHastaExclusiva);
      const esAjuste = (m: typeof filtrados[number]) => normalizarTexto(m.tipo_movimiento_financiero).includes('ajuste') || m.origen_movimiento_financiero.some(origen => normalizarTexto(origen.entidad_origen).includes('ajuste'));
      const serie = (filas: typeof filtrados) => [...filas.reduce((mapa, m) => { const clave = `${inicioBucket(m.fecha_movimiento, granularidad)}|${m.moneda.codigo_moneda}`; const grupo = mapa.get(clave) || { fecha: inicioBucket(m.fecha_movimiento, granularidad), moneda: m.moneda.codigo_moneda, movimientos: [] as Array<{ monto: number; naturaleza: string; ajuste: boolean }> }; grupo.movimientos.push({ monto: Number(m.monto_movimiento), naturaleza: m.naturaleza_movimiento, ajuste: esAjuste(m) }); mapa.set(clave, grupo); return mapa; }, new Map<string, { fecha: string; moneda: string; movimientos: Array<{ monto: number; naturaleza: string; ajuste: boolean }> }>()).values()].map(fila => ({ fecha: fila.fecha, moneda: fila.moneda, ...calcularFlujoRealM7(fila.movimientos) })).sort((a, b) => a.fecha.localeCompare(b.fecha) || a.moneda.localeCompare(b.moneda));
      const totales = (filas: typeof filtrados) => [...filas.reduce((mapa, m) => { const grupo = mapa.get(m.moneda.codigo_moneda) || []; grupo.push({ monto: Number(m.monto_movimiento), naturaleza: m.naturaleza_movimiento, ajuste: esAjuste(m) }); mapa.set(m.moneda.codigo_moneda, grupo); return mapa; }, new Map<string, Array<{ monto: number; naturaleza: string; ajuste: boolean }>>())].map(([moneda, filasMoneda]) => ({ moneda, ...calcularFlujoRealM7(filasMoneda) }));
      const actualesTotales = totales(actuales); const anterioresTotales = new Map(totales(anteriores).map(f => [f.moneda, f]));
      const comparacion = actualesTotales.map(actual => { const anterior = anterioresTotales.get(actual.moneda) || { flujoReal: 0 }; const diferenciaAbsoluta = Number((actual.flujoReal - anterior.flujoReal).toFixed(2)); return { moneda: actual.moneda, actual: actual.flujoReal, anterior: anterior.flujoReal, diferenciaAbsoluta, variacionPorcentual: anterior.flujoReal === 0 ? null : Number((diferenciaAbsoluta / Math.abs(anterior.flujoReal) * 100).toFixed(2)), estadoVariacion: anterior.flujoReal === 0 ? 'NO_APLICA' : 'VALIDO' }; });
      const presentar = (m: typeof filtrados[number]) => ({ idMovimiento: m.id_movimiento_financiero, fecha: fechaIso(m.fecha_movimiento), categoria: m.tipo_movimiento_financiero || null, naturaleza: m.naturaleza_movimiento, esAjuste: esAjuste(m), moneda: m.moneda.codigo_moneda, monto: Number(m.monto_movimiento), origenes: m.origen_movimiento_financiero.map(o => ({ entidad: o.entidad_origen, id: o.id_registro_origen, descripcion: o.descripcion_origen })) });
      const idsCajaConMovimiento = new Set(movimientos.flatMap(m => m.origen_movimiento_financiero.filter(o => normalizarTexto(o.entidad_origen).includes('caja chica')).map(o => o.id_registro_origen)));
      const cajaSinMovimiento = gastosCajaAprobados.filter(gasto => !idsCajaConMovimiento.has(gasto.id_gasto_caja_chica_m5)).length;
      liquidezActual = indicador('DATOS_INSUFICIENTES', null, 'No existe saldo inicial registrado por cuenta bancaria y moneda; la suma histórica de movimientos no se presenta como saldo real');
      flujoHistorico = actuales.length ? indicador(cajaSinMovimiento ? 'PARCIALMENTE_DISPONIBLE' : 'VALIDO', { granularidad, filtros: { categoria: categoria || null, origen: origen || null }, serie: serie(actuales), totales: actualesTotales, comparacion, movimientos: actuales.map(presentar), cajaChica: { aprobados: gastosCajaAprobados.length, conMovimiento: gastosCajaAprobados.length - cajaSinMovimiento, sinMovimiento: cajaSinMovimiento } }, `Flujo ejecutado basado una sola vez en movimiento_financiero; ${cajaSinMovimiento} gasto(s) de Caja Chica aprobado(s) sin movimiento inequívoco fueron excluidos`) : indicador('SIN_RESULTADOS', { granularidad, filtros: { categoria: categoria || null, origen: origen || null }, serie: [], totales: [], comparacion: [], movimientos: [], cajaChica: { aprobados: gastosCajaAprobados.length, conMovimiento: 0, sinMovimiento: gastosCajaAprobados.length } }, 'No existen movimientos financieros para los filtros del período');
    } catch { flujoHistorico = indicador('FUENTE_NO_DISPONIBLE', null, 'La fuente de movimientos financieros no está disponible'); }
    try {
      const horizonte = Number(consulta.horizonteDias || 30);
      if (!Number.isInteger(horizonte) || horizonte < 1 || horizonte > 366) throw new ErrorAplicacion(400, 'Horizonte inválido');
      const inicio = new Date(`${fechaNegocio()}T00:00:00Z`); const fin = new Date(inicio); fin.setUTCDate(fin.getUTCDate() + horizonte);
      const consultaHorizonte = { desde: fechaIso(inicio), hasta: fechaIso(new Date(fin.getTime() - 86400000)) };
      const [cxc, cxp] = await Promise.all([this.consultarCuentasCobrarCompleto({ ...consultaHorizonte, segmento: 'TODOS' }), this.consultarCuentasPagarCompleto(consultaHorizonte)]);
      const ingresos = (((cxc.cartera as { valor?: Array<Record<string, unknown>> }).valor) || []).filter(fila => typeof fila.fechaVencimiento === 'string' && new Date(`${fila.fechaVencimiento}T00:00:00Z`) >= inicio && new Date(`${fila.fechaVencimiento}T00:00:00Z`) < fin).map(fila => ({ ...fila, monto: fila.saldo }));
      const egresos = (((cxp.cartera as { valor?: Array<Record<string, unknown>> } | undefined)?.valor) || []).filter(fila => typeof fila.fechaVencimiento === 'string' && new Date(`${fila.fechaVencimiento}T00:00:00Z`) >= inicio && new Date(`${fila.fechaVencimiento}T00:00:00Z`) < fin).map(fila => ({ ...fila, monto: fila.saldo }));
      const compromisos = [
        ...(ingresos || []).map((fila: Record<string, unknown>) => ({ fecha: fila.fechaVencimiento, moneda: fila.moneda, monto: fila.monto, direccion: 'ENTRADA', owner: 'M3', id: fila.idNota })),
        ...(egresos || []).map((fila: Record<string, unknown>) => ({ fecha: fila.fechaVencimiento, moneda: fila.moneda, monto: fila.monto, direccion: 'SALIDA', owner: 'M5', id: fila.id })),
      ].filter(fila => typeof fila.fecha === 'string' && typeof fila.moneda === 'string' && Number(fila.monto) > 0).sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)) || String(a.moneda).localeCompare(String(b.moneda)));
      const acumulados = new Map<string, number>();
      const serieCompromisos = compromisos.map(fila => { const moneda = String(fila.moneda); const cambio = fila.direccion === 'ENTRADA' ? Number(fila.monto) : -Number(fila.monto); acumulados.set(moneda, redondear((acumulados.get(moneda) || 0) + cambio)); return { ...fila, tipo: fila.direccion === 'ENTRADA' ? 'COBRO_CXC' : 'PAGO_CXP', referencia: fila.id, cambio, flujoComprometidoAcumulado: acumulados.get(moneda) }; });
      const totalesCompromisos = [...compromisos.reduce((mapa, fila) => { const moneda = String(fila.moneda); const actual = mapa.get(moneda) || { moneda, ingresosProyectados: 0, egresosProyectados: 0 }; if (fila.direccion === 'ENTRADA') actual.ingresosProyectados += Number(fila.monto); else actual.egresosProyectados += Number(fila.monto); mapa.set(moneda, actual); return mapa; }, new Map<string, { moneda: string; ingresosProyectados: number; egresosProyectados: number }>()).values()].map(fila => ({ ...fila, flujoProyectadoNeto: redondear(fila.ingresosProyectados - fila.egresosProyectados) }));
      const proyeccion = indicador(compromisos.length ? 'VALIDO' : 'SIN_RESULTADOS', { horizonteDias: horizonte, desde: fechaIso(inicio), hasta: fechaIso(new Date(fin.getTime() - 86400000)), ingresos, egresos, eventos: serieCompromisos, totales: totalesCompromisos }, 'Cobros y pagos comprometidos con saldo, monto, moneda y vencimiento reales; no se presenta saldo final porque falta un saldo inicial registrado');
      const presupuesto = await this.consultarProyeccionesM7(consulta);
      const reales = ((flujoHistorico as { valor?: { totales?: Array<{ moneda: string; flujoReal: number }> } }).valor?.totales || []);
      const proyectados = new Map(presupuesto.totales.map(fila => [fila.moneda, fila.flujoProyectado]));
      const finPeriodo = new Date(periodo.hastaExclusiva); finPeriodo.setUTCDate(finPeriodo.getUTCDate() - 1); const inicioYtd = new Date(Date.UTC(finPeriodo.getUTCFullYear(), 0, 1));
      const [movimientosYtd, presupuestoYtd] = await Promise.all([
        prisma.movimiento_financiero.findMany({ where: { fecha_movimiento: { gte: inicioYtd, lt: periodo.hastaExclusiva }, estado_movimiento: { notIn: ['anulado', 'rechazado'] } }, include: { moneda: true, origen_movimiento_financiero: true } }),
        this.consultarProyeccionesM7({ desde: fechaIso(inicioYtd), hasta: fechaIso(finPeriodo) }),
      ]);
      const realesYtd = new Map<string, number>(); for (const codigo of new Set(movimientosYtd.map(fila => fila.moneda.codigo_moneda))) { const items = movimientosYtd.filter(fila => fila.moneda.codigo_moneda === codigo).map(fila => ({ monto: Number(fila.monto_movimiento), naturaleza: fila.naturaleza_movimiento, ajuste: normalizarTexto(fila.tipo_movimiento_financiero).includes('ajuste') || fila.origen_movimiento_financiero.some(origen => normalizarTexto(origen.entidad_origen).includes('ajuste')) })); realesYtd.set(codigo, calcularFlujoRealM7(items).flujoReal); }
      const proyectadosYtd = new Map(presupuestoYtd.totales.map(fila => [fila.moneda, fila.flujoProyectado]));
      const monedasComparables = [...new Set([...reales.map(fila => fila.moneda), ...proyectados.keys(), ...realesYtd.keys(), ...proyectadosYtd.keys()])];
      const comparacionRealProyectado = monedasComparables.map(moneda => { const real = reales.find(fila => fila.moneda === moneda)?.flujoReal ?? 0; const proyectado = proyectados.get(moneda) ?? 0; const realAcumuladoYtd = realesYtd.get(moneda) ?? 0; const proyectadoAcumuladoYtd = proyectadosYtd.get(moneda) ?? 0; return { moneda, real, proyectado, ...calcularDesviacionFlujoM7(real, proyectado), realAcumuladoYtd, proyectadoAcumuladoYtd, desviacionAcumuladaYtd: calcularDesviacionFlujoM7(realAcumuladoYtd, proyectadoAcumuladoYtd).diferencia }; });
      return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, liquidezActual, flujoHistorico, proyeccion, presupuesto: indicador(presupuesto.estado, { categorias: presupuesto.categorias, proyecciones: presupuesto.proyecciones, totales: presupuesto.totales }, 'Presupuesto gerencial manual; permanece separado del flujo ejecutado y de los compromisos registrados'), realVsProyectado: indicador(comparacionRealProyectado.length ? 'VALIDO' : 'SIN_RESULTADOS', comparacionRealProyectado, 'Real menos presupuesto por moneda; porcentaje N/A cuando la base proyectada es cero'), ivaFlujo: indicador('NO_APLICA', null, 'El IVA documental no se convierte en caja ni compromiso sin movimiento u obligación tributaria fechada'), saldoInicial: indicador('FUENTE_NO_DISPONIBLE', null, 'No existe una fuente registrada de saldo inicial por cuenta bancaria, fecha de corte y moneda'), capaEstimada: indicador('NO_APLICA', null, 'Los compromisos registrados y el presupuesto manual se mantienen como capas independientes') };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, liquidezActual, flujoHistorico, proyeccion: indicador('FUENTE_NO_DISPONIBLE', null, 'No fue posible consultar compromisos futuros'), capaEstimada: indicador('NO_APLICA', null, 'No existe una estimación propietaria válida') };
    }
  }

  private presentarUmbralMargen(fila: {
    id_parametro_remuneracional: number; valor: Prisma.Decimal | null; vigencia_desde: Date; vigencia_hasta: Date | null; estado: string;
  }) {
    return { id: fila.id_parametro_remuneracional, codigo: codigoUmbralMargen, tipo: tipoUmbralMargen, nombre: 'Umbral de margen crítico', unidad: unidadUmbralMargen, valor: fila.valor === null ? null : Number(fila.valor), vigenciaDesde: fechaIso(fila.vigencia_desde), vigenciaHasta: fila.vigencia_hasta ? fechaIso(fila.vigencia_hasta) : null, estado: fila.estado };
  }

  private async resolverUmbralMargen(fecha: Date) {
    const filas = await prisma.parametro_remuneracional.findMany({
      where: { codigo: codigoUmbralMargen, estado: 'activo', vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }] },
      orderBy: { vigencia_desde: 'desc' },
    });
    if (filas.length === 0) return null;
    if (filas.length > 1) throw new ErrorAplicacion(409, 'Existe más de un umbral de margen efectivo para la fecha');
    const fila = filas[0];
    const valor = fila.valor === null ? Number.NaN : Number(fila.valor);
    if (fila.tipo !== tipoUmbralMargen || fila.unidad !== unidadUmbralMargen || !Number.isFinite(valor) || valor < 0 || valor > 100) throw new ErrorAplicacion(409, 'El umbral de margen efectivo tiene una configuración inválida');
    return { id: fila.id_parametro_remuneracional, valor, vigenciaDesde: fechaIso(fila.vigencia_desde), vigenciaHasta: fila.vigencia_hasta ? fechaIso(fila.vigencia_hasta) : null };
  }

  async consultarConfiguracionUmbralMargen() {
    const filas = await prisma.parametro_remuneracional.findMany({ where: { codigo: codigoUmbralMargen }, orderBy: { vigencia_desde: 'desc' } });
    const hoy = new Date(`${fechaNegocio()}T00:00:00Z`);
    const vigente = await this.resolverUmbralMargen(hoy);
    return { codigo: codigoUmbralMargen, tipo: tipoUmbralMargen, nombre: 'Umbral de margen crítico', unidad: unidadUmbralMargen, vigente, historial: filas.map(fila => this.presentarUmbralMargen(fila)) };
  }

  async configurarUmbralMargen(entrada: Record<string, unknown>) {
    const desde = fechaUtc(entrada.vigenciaDesde, 'Vigencia desde');
    if (entrada.valor === null || entrada.valor === undefined || String(entrada.valor).trim() === '') throw new ErrorAplicacion(400, 'El umbral es obligatorio');
    let valor: Prisma.Decimal;
    try { valor = new Prisma.Decimal(String(entrada.valor)); }
    catch { throw new ErrorAplicacion(400, 'El umbral debe ser un número válido'); }
    if (!valor.isFinite() || valor.lt(0) || valor.gt(100)) throw new ErrorAplicacion(400, 'El umbral debe estar entre 0 y 100');
    const fuente = entrada.fuente === undefined ? null : String(entrada.fuente).trim().slice(0, 200) || null;
    const referencia = entrada.referencia === undefined ? null : String(entrada.referencia).trim().slice(0, 300) || null;
    try {
      await prisma.$transaction(async tx => {
        const filas = await tx.parametro_remuneracional.findMany({ where: { codigo: codigoUmbralMargen }, orderBy: { vigencia_desde: 'asc' } });
        if (filas.some(fila => fila.tipo !== tipoUmbralMargen || fila.unidad !== unidadUmbralMargen)) throw new ErrorAplicacion(409, 'El código del umbral está ocupado por una configuración incompatible');
        if (filas.some(fila => fila.vigencia_desde.getTime() === desde.getTime())) throw new ErrorAplicacion(409, 'Ya existe una configuración del umbral para esa fecha');
        if (filas.some(fila => fila.estado === 'activo' && fila.vigencia_desde > desde)) throw new ErrorAplicacion(409, 'No se puede insertar una vigencia anterior a una configuración futura');
        const efectivas = filas.filter(fila => fila.estado === 'activo' && fila.vigencia_desde < desde && (fila.vigencia_hasta === null || fila.vigencia_hasta >= desde));
        if (efectivas.length > 1) throw new ErrorAplicacion(409, 'La configuración histórica del umbral es ambigua');
        if (efectivas.length === 1) {
          const hastaAnterior = new Date(desde); hastaAnterior.setUTCDate(hastaAnterior.getUTCDate() - 1);
          await tx.parametro_remuneracional.update({ where: { id_parametro_remuneracional: efectivas[0].id_parametro_remuneracional }, data: { vigencia_hasta: hastaAnterior } });
        }
        await tx.parametro_remuneracional.create({ data: { codigo: codigoUmbralMargen, tipo: tipoUmbralMargen, nombre: 'Umbral de margen crítico', descripcion: 'Umbral porcentual utilizado por M7 para orientar márgenes críticos', valor, unidad: unidadUmbralMargen, vigencia_desde: desde, vigencia_hasta: null, fuente, referencia, estado: 'activo' } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.consultarConfiguracionUmbralMargen();
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002', 'P2034'].includes(error.code)) throw new ErrorAplicacion(409, 'El umbral cambió concurrentemente');
      throw error;
    }
  }

  private async consultarMargenProyectosCompleto(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const fechaCorte = new Date(periodo.hastaExclusiva); fechaCorte.setUTCDate(fechaCorte.getUTCDate() - 1);
    try {
      const [proyectos, umbral] = await Promise.all([
        prisma.proyecto_financiero.findMany({
          include: {
            moneda: true,
            proyecto: true,
            nota_venta: { include: { moneda: true } },
            costo_proyecto: { include: { moneda: true }, orderBy: { fecha_costo: 'asc' } },
            tarea_remunerable: { where: { estado_validacion: 'validada' }, orderBy: { fecha_tarea: 'asc' } },
          },
          orderBy: { codigo_proyecto_financiero: 'asc' },
        }),
        this.resolverUmbralMargen(fechaCorte),
      ]);
      const usosNota = proyectos.reduce((mapa, proyecto) => {
        if (proyecto.id_nota_venta) mapa.set(proyecto.id_nota_venta, (mapa.get(proyecto.id_nota_venta) || 0) + 1);
        return mapa;
      }, new Map<number, number>());
      const resultado = proyectos.map(proyecto => {
        const nota = proyecto.nota_venta;
        const ingresoValido = Boolean(nota && usosNota.get(nota.id_nota_venta) === 1 && estadosVentaDefinitiva.includes(nota.estado_nota_venta) && dentro(nota.fecha_emision, periodo));
        const ingresos = ingresoValido && nota ? [{ origen: 'M2_NOTA_VENTA', referencia: `NV:${nota.id_nota_venta}`, moneda: nota.moneda.codigo_moneda, monto: Number(nota.monto_neto) }] : [];
        const costosRegistrados = proyecto.costo_proyecto.filter(costo => costo.estado_costo !== 'anulado' && dentro(costo.fecha_costo, periodo)).map(costo => ({ origen: costo.origen_costo || costo.categoria_costo || 'COSTO_PROYECTO', referencia: `COSTO:${costo.id_costo_proyecto}`, moneda: costo.moneda.codigo_moneda, monto: Number(costo.monto_costo) }));
        const costosProductivos = proyecto.tarea_remunerable.filter(tarea => dentro(tarea.fecha_tarea, periodo)).map(tarea => ({ origen: 'M6_REMUNERACION_PRODUCTIVA', referencia: `TAREA_REMUNERABLE:${tarea.id_tarea_remunerable}`, moneda: 'CLP', monto: Number(tarea.monto_calculado) }));
        const costos = [...costosRegistrados, ...costosProductivos];
        const moneda = ingresos[0]?.moneda || proyecto.moneda.codigo_moneda;
        const costosComparables = costos.filter(costo => costo.moneda === moneda);
        const ingreso = ingresos.length ? ingresos.reduce((suma, fila) => suma + fila.monto, 0) : null;
        const costoDirecto = costosComparables.length ? costosComparables.reduce((suma, fila) => suma + fila.monto, 0) : null;
        const margen = ingreso !== null && costoDirecto !== null ? Number((ingreso - costoDirecto).toFixed(2)) : null;
        const porcentaje = ingreso !== null && ingreso > 0 && margen !== null ? Number(((margen / ingreso) * 100).toFixed(2)) : null;
        const clasificacion = margen !== null && margen < 0 ? 'PERDIDA' : porcentaje === null ? 'NO_APLICA' : !umbral ? 'PENDIENTE_CONFIGURACION' : porcentaje <= umbral.valor ? 'MARGEN_CRITICO' : 'MARGEN_SOBRE_UMBRAL';
        const otrasMonedas = costos.some(costo => costo.moneda !== moneda);
        return {
          idProyecto: proyecto.id_proyecto_financiero,
          codigo: proyecto.codigo_proyecto_financiero,
          proyectoTerreno: proyecto.id_proyecto_terreno?.toString() || null,
          nombre: proyecto.proyecto?.proyecto_nombre_referencia || proyecto.codigo_proyecto_financiero,
          moneda,
          ingresosAtribuibles: ingreso,
          costosDirectosAtribuibles: costoDirecto,
          margenDirecto: margen,
          porcentajeMargen: porcentaje,
          clasificacion,
          desgloseIngresos: ingresos,
          desgloseCostos: costos,
          estado: margen === null ? 'DATOS_INSUFICIENTES' as const : 'VALIDO' as const,
          cobertura: indicador('DATOS_INSUFICIENTES', { fuentesIncluidas: ['Nota de Venta vinculada', 'Costo de proyecto', 'Remuneración productiva validada y agregada'], fuentesNoIncluidas: ['Inventario sin valorización inequívoca', 'Gastos generales sin imputación directa', 'Caja Chica sin relación explícita'], costosEnOtraMoneda: otrasMonedas }, 'Margen calculado sólo con fuentes directamente atribuibles; no representa costo completo del proyecto'),
        };
      }).filter(proyecto => proyecto.desgloseIngresos.length || proyecto.desgloseCostos.length);
      return {
        periodo: periodoSalida(periodo),
        estado: resultado.some(proyecto => proyecto.estado === 'VALIDO') ? 'VALIDO' as const : 'DATOS_INSUFICIENTES' as const,
        umbralMargen: umbral ? indicador('VALIDO', umbral, 'Umbral vigente M7 en porcentaje') : indicador('CONFIGURACION_PENDIENTE', null, 'No existe un umbral M7 vigente y válido; no se aplica valor por defecto'),
        proyectos: resultado,
        cobertura: indicador('DATOS_INSUFICIENTES', { completa: false }, 'Sólo se incluyen fuentes con atribución inequívoca al proyecto; los costos sin relación directa se excluyen'),
      };
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, umbralMargen: indicador('FUENTE_NO_DISPONIBLE', null, 'No fue posible consultar el mantenedor'), proyectos: [], cobertura: indicador('FUENTE_NO_DISPONIBLE', null, 'No fue posible consultar las fuentes de proyecto') };
    }
  }

  async consultarAnalisisVentas(consulta: Consulta, permisos?: string[]) {
    if (String(consulta.modo || '').toLowerCase() === 'comparar') {
      const segmento = resolverSegmentoComercialM7(consulta.segmento);
      const periodoA = resolverPeriodoM7({ desde: consulta.desdeA, hasta: consulta.hastaA }); const periodoB = resolverPeriodoM7({ desde: consulta.desdeB, hasta: consulta.hastaB });
      const diasA = diasPeriodoM7(periodoA); const diasB = diasPeriodoM7(periodoB);
      const granularidad: GranularidadVentasM7 = diasA <= 62 && diasB <= 62 ? 'dia' : 'mes';
      const consultaA = { desde: consulta.desdeA, hasta: consulta.hastaA, segmento, _granularidad: granularidad };
      const consultaB = { desde: consulta.desdeB, hasta: consulta.hastaB, segmento, _granularidad: granularidad };
      const [datosA, datosB] = await Promise.all([this.consultarAnalisisVentasCompleto(consultaA), this.consultarAnalisisVentasCompleto(consultaB)]);
      const filtrar = (datos: Record<string, unknown>) => {
        if (!permisos) return datos;
        const salida: Record<string, unknown> = { periodo: datos.periodo, segmento: datos.segmento, estado: datos.estado };
        if (permisos.includes('CU218')) for (const clave of ['conversion', 'conversionSegmentos']) salida[clave] = datos[clave];
        if (permisos.includes('CU219')) for (const clave of ['montoNeto', 'cantidad', 'ticketMedio', 'granularidad', 'serieTemporal']) salida[clave] = datos[clave];
        if (permisos.includes('CU220')) for (const clave of ['clientes', 'concentracionClientes', 'productos', 'productosVendidos']) salida[clave] = datos[clave];
        if (permisos.includes('CU238')) for (const clave of ['costosDirectos', 'resultadoGerencial']) salida[clave] = datos[clave];
        return salida;
      };
      const a = filtrar(datosA as Record<string, unknown>); const b = filtrar(datosB as Record<string, unknown>);
      const monto = (datos: Record<string, unknown>) => ((datos.montoNeto as any)?.valor || {}).totalClp;
      const montoA = monto(a); const montoB = monto(b);
      const valorA = typeof montoA === 'number' && Number.isFinite(montoA) ? montoA : null; const valorB = typeof montoB === 'number' && Number.isFinite(montoB) ? montoB : null;
      const mesesA = clavesPeriodoM7(periodoA, 'mes').length; const mesesB = clavesPeriodoM7(periodoB, 'mes').length;
      const unidadesA = granularidad === 'dia' ? diasA : mesesA; const unidadesB = granularidad === 'dia' ? diasB : mesesB;
      const promedioA = calcularPromedioTemporalVentasM7(valorA, unidadesA); const promedioB = calcularPromedioTemporalVentasM7(valorB, unidadesB);
      return {
        modo: 'comparar', segmento, direccion: 'Período B vs Período A', periodoA: a, periodoB: b,
        resumen: {
          diasA, diasB, mesesA, mesesB, granularidad,
          promedioA, promedioB,
          total: calcularComparacionPeriodosVentasM7(valorA, valorB), promedio: calcularComparacionPeriodosVentasM7(promedioA, promedioB),
          duracionComparable: diasA === diasB,
        },
        granularidad, serieComparativa: alinearSeriesPeriodosVentasM7((a.serieTemporal || []) as Array<Record<string, unknown>>, (b.serieTemporal || []) as Array<Record<string, unknown>>, granularidad),
      };
    }
    const datos = await this.consultarAnalisisVentasCompleto(consulta) as Record<string, unknown>;
    if (!permisos) return datos;
    const salida: Record<string, unknown> = { periodo: datos.periodo, segmento: datos.segmento, estado: datos.estado };
    if (permisos.includes('CU218')) for (const clave of ['conversion', 'conversionSegmentos']) salida[clave] = datos[clave];
    if (permisos.includes('CU219')) for (const clave of ['montoNeto', 'cantidad', 'ticketMedio', 'evolucion', 'comparacion', 'granularidad', 'serieTemporal']) salida[clave] = datos[clave];
    if (permisos.includes('CU219') && !consulta.desde && !consulta.hasta) {
      const historico = await this.consultarHistoricoPanelGeneral({ ...consulta, meses: 24 }, ['CU218', 'CU219', 'CU220']);
      salida.resumenTemporal = historico.resumenVentas;
    }
    if (permisos.includes('CU220')) for (const clave of ['clientes', 'tiposCliente', 'concentracionClientes', 'productos', 'productosVendidos', 'ventasPorFamilia', 'participacionSegmentos', 'brechaTaxonomiaB2B']) salida[clave] = datos[clave];
    if (permisos.includes('CU238')) for (const clave of ['costosDirectos', 'resultadoGerencial']) salida[clave] = datos[clave];
    return salida;
  }

  async consultarContextoCliente(idCliente: number, consulta: Consulta, permisos: string[]) {
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new ErrorAplicacion(400, 'Cliente inválido');
    const periodo = resolverPeriodoM7(consulta);
    const segmento = resolverSegmentoComercialM7(consulta.segmento);
    const cliente = await prisma.cliente_financiero.findUnique({ where: { id_cliente_financiero: idCliente }, include: { tipo_cliente_financiero: true, ficha_cliente: true } });
    if (!cliente || !cliente.ficha_cliente) throw new ErrorAplicacion(404, 'Cliente no encontrado');
    const bloques: Record<string, unknown> = {};
    if (permisos.includes('CU219') || permisos.includes('CU220')) {
      try {
        const notas = await prisma.nota_venta.findMany({ where: { id_ficha_cliente: cliente.ficha_cliente.id_ficha_cliente, fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_nota_venta: { in: estadosVentaDefinitiva } }, include: { moneda: true, cotizacion: { include: { detalle_cotizacion: { include: { item_comercial: true } } } } } });
        const ventas: Record<string, unknown> = { estado: notas.length ? 'VALIDO' : 'SIN_RESULTADOS' };
        if (permisos.includes('CU219')) {
          ventas.cantidad = notas.length;
          ventas.montoNeto = notas.length ? agruparMonto(notas.map(nota => ({ moneda: nota.moneda.codigo_moneda, monto: Number(nota.monto_neto) }))) : [];
        }
        if (permisos.includes('CU220')) {
          const detalles = notas.flatMap(nota => nota.cotizacion?.detalle_cotizacion.map(detalle => ({ tipo: detalle.item_comercial.tipo_item, monto: Number(detalle.subtotal_item_estimado) })) || []).filter(detalle => detalle.tipo);
          ventas.productosFamilias = detalles.length ? agruparMonto(detalles.map(detalle => ({ moneda: detalle.tipo!, monto: detalle.monto }))).map(fila => ({ tipo: fila.moneda, montoNeto: fila.monto })) : indicador('DATOS_INSUFICIENTES', null, 'No existe clasificación propietaria estructurada para estas Ventas');
        }
        ventas.destino = `/dashboard-m7/ventas?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}&segmento=${segmento}`;
        bloques.ventas = ventas;
      } catch { bloques.ventas = { estado: 'FUENTE_NO_DISPONIBLE', detalle: 'M2 no está disponible' }; }
    }
    if (permisos.includes('CU222') || permisos.includes('CU223')) {
      try {
        const notas = await prisma.nota_venta.findMany({ where: { id_ficha_cliente: cliente.ficha_cliente.id_ficha_cliente, estado_nota_venta: { notIn: retiradosCxC } }, include: incluirNota });
        const calculadas = notas.map(nota => ({ nota, calculo: calcularNota(nota) }));
        const cxc: Record<string, unknown> = { estado: notas.length ? 'VALIDO' : 'SIN_RESULTADOS' };
        if (permisos.includes('CU222')) {
          const pendientes = calculadas.filter(fila => fila.calculo.saldoPendiente > 0);
          cxc.saldo = agruparMonto(pendientes.map(fila => ({ moneda: fila.nota.moneda.codigo_moneda, monto: fila.calculo.saldoPendiente })));
          const morosas = pendientes.filter(fila => fila.calculo.esMorosa);
          cxc.morosidad = { cantidad: morosas.length, porMoneda: agruparMonto(morosas.map(fila => ({ moneda: fila.nota.moneda.codigo_moneda, monto: fila.calculo.saldoPendiente }))) };
        }
        if (permisos.includes('CU223')) {
          const pagos = new Map<number, { moneda: string; monto: number }>();
          for (const { nota } of calculadas) for (const asignacion of nota.asignacion_pago_cliente) if (asignacion.pago_cliente.fecha_pago >= periodo.desde && asignacion.pago_cliente.fecha_pago < periodo.hastaExclusiva) pagos.set(asignacion.id_pago_cliente, { moneda: asignacion.pago_cliente.moneda.codigo_moneda, monto: efectoPago(asignacion.pago_cliente).toNumber() });
          cxc.recaudacion = agruparMonto([...pagos.values()]);
        }
        cxc.destino = `/dashboard-m7/cuentas-cobrar?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}&segmento=${segmento}`;
        bloques.cuentasCobrar = cxc;
      } catch { bloques.cuentasCobrar = { estado: 'FUENTE_NO_DISPONIBLE', detalle: 'La información de cuentas por cobrar no está disponible' }; }
    }
    return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, cliente: { idCliente: cliente.id_cliente_financiero, nombre: cliente.nombre_razon_social_referencia, identificador: cliente.rut_cliente, tipoCliente: cliente.tipo_cliente_financiero.nombre_tipo_cliente_financiero, estado: cliente.estado_financiero }, destinoCliente: permisos.includes('CU09') ? rutaCliente(cliente) : null, bloques };
  }

  async consultarCuentasCobrar(consulta: Consulta, permisos?: string[]) {
    const datos = await this.consultarCuentasCobrarCompleto(consulta) as Record<string, unknown>;
    if (!permisos) return datos;
    const protegerCliente = (indicadorEntrada: unknown) => {
      if (!indicadorEntrada || typeof indicadorEntrada !== 'object') return indicadorEntrada;
      const copia = { ...(indicadorEntrada as Record<string, unknown>) }; const valor = copia.valor;
      const limpiar = (fila: Record<string, unknown>) => { const { destinoCliente, ...segura } = fila; const acciones = permisos.includes('CU09') && typeof destinoCliente === 'string' && destinoCliente.startsWith('/clientes/') ? [accion('Ver Cliente', destinoCliente)] : []; return { ...segura, ...(acciones.length ? { acciones } : {}) }; };
      if (Array.isArray(valor)) copia.valor = valor.map(fila => fila && typeof fila === 'object' ? limpiar(fila as Record<string, unknown>) : fila);
      else if (valor && typeof valor === 'object') { const objeto = { ...(valor as Record<string, unknown>) }; if (Array.isArray(objeto.obligaciones)) objeto.obligaciones = objeto.obligaciones.map(fila => limpiar(fila as Record<string, unknown>)); if (Array.isArray(objeto.pagos)) objeto.pagos = objeto.pagos.map(fila => limpiar(fila as Record<string, unknown>)); copia.valor = objeto; }
      return copia;
    };
    const salida: Record<string, unknown> = { periodo: datos.periodo, estado: datos.estado };
    if (permisos.includes('CU222')) for (const clave of ['fechaReferencia', 'saldo', 'morosidad', 'cartera', 'aging']) salida[clave] = protegerCliente(datos[clave]);
    if (permisos.includes('CU223')) for (const clave of ['recaudacion', 'detalleCobranza', 'cumplimiento', 'recuperacionMoraPrevia']) salida[clave] = protegerCliente(datos[clave]);
    if (permisos.includes('CU224')) for (const clave of ['concentracionDeuda', 'obligacionesPagadas']) salida[clave] = protegerCliente(datos[clave]);
    if (permisos.includes('CU225')) salida.compromisosFuturos = protegerCliente(datos.compromisosFuturos);
    return salida;
  }

  async consultarCuentasPagar(consulta: Consulta, permisos?: string[]) {
    const datos = await this.consultarCuentasPagarCompleto(consulta) as Record<string, unknown>;
    if (!permisos) return datos;
    const protegerProveedor = (indicadorEntrada: unknown) => {
      if (!indicadorEntrada || typeof indicadorEntrada !== 'object') return indicadorEntrada;
      const copia = { ...(indicadorEntrada as Record<string, unknown>) }; const valor = copia.valor;
      const decorar = (fila: Record<string, unknown>) => { const acciones: AccionNavegacion[] = []; if (permisos.includes('CU84') && Number.isInteger(Number(fila.idProveedor))) acciones.push(accion('Ver Proveedor', `/proveedores/${fila.idProveedor}`)); if (permisos.includes('CU106')) acciones.push(accion('Abrir cuentas por pagar', '/cuentas-por-pagar')); return { ...fila, ...(acciones.length ? { acciones } : {}) }; };
      if (Array.isArray(valor)) copia.valor = valor.map(fila => fila && typeof fila === 'object' ? decorar(fila as Record<string, unknown>) : fila);
      else if (valor && typeof valor === 'object') { const objeto = { ...(valor as Record<string, unknown>) }; if (Array.isArray(objeto.obligaciones)) objeto.obligaciones = objeto.obligaciones.map(fila => decorar(fila as Record<string, unknown>)); copia.valor = objeto; }
      return copia;
    };
    const salida: Record<string, unknown> = { periodo: datos.periodo, estado: datos.estado };
    if (permisos.includes('CU226')) for (const clave of ['fechaReferencia', 'saldo', 'cartera', 'aging', 'estados', 'proveedores', 'categorias']) salida[clave] = protegerProveedor(datos[clave]);
    if (permisos.includes('CU227')) salida.compromisosFuturos = protegerProveedor(datos.compromisosFuturos);
    return salida;
  }

  async consultarLiquidez(consulta: Consulta, permisos?: string[]) {
    const datos = await this.consultarLiquidezCompleto(consulta) as Record<string, unknown>;
    if (!permisos) return datos;
    const salida: Record<string, unknown> = { periodo: datos.periodo, estado: datos.estado };
    if (permisos.includes('CU228')) salida.liquidezActual = datos.liquidezActual;
    if (permisos.includes('CU229') || permisos.includes('CU230')) {
      const flujo = { ...(datos.flujoHistorico as Record<string, unknown>) }; const valor = flujo.valor;
      if (valor && typeof valor === 'object') { const contenido = { ...(valor as Record<string, unknown>) }; if (Array.isArray(contenido.movimientos)) contenido.movimientos = contenido.movimientos.map(filaEntrada => { const fila = filaEntrada as Record<string, unknown>; const acciones: AccionNavegacion[] = []; const origenes = Array.isArray(fila.origenes) ? fila.origenes as Array<Record<string, unknown>> : []; const visibles = origenes.map(origen => { const entidad = String(origen.entidad || ''); let permitido = false; if (entidad === 'pago_cliente' && permisos.includes('CU42')) { permitido = true; acciones.push(accion('Abrir pagos de Cliente', '/pagos')); } if (entidad === 'pago_proveedor' && permisos.includes('CU111')) { permitido = true; acciones.push(accion('Abrir pagos a Proveedores', '/pagos-proveedores')); } if (entidad === 'gasto_caja_chica' && permisos.includes('CU149')) { permitido = true; acciones.push(accion('Abrir Caja Chica', '/caja-chica')); } if (entidad === 'liquidacion_remuneracion' && permisos.includes('CU187')) { permitido = true; acciones.push(accion('Abrir pagos de remuneraciones', '/pagos-remuneraciones')); } return permitido ? origen : { entidad, descripcion: origen.descripcion ?? null, navegacionDisponible: false }; }); return { ...fila, origenes: visibles, ...(acciones.length ? { acciones: [...new Map(acciones.map(a => [a.destino, a])).values()] } : {}) }; }); flujo.valor = contenido; } salida.flujoHistorico = flujo;
    }
    if (permisos.includes('CU231')) {
      const proyeccion = { ...(datos.proyeccion as Record<string, unknown>) }; const valor = proyeccion.valor;
      if (valor && typeof valor === 'object') { const contenido = { ...(valor as Record<string, unknown>) }; if (Array.isArray(contenido.eventos)) contenido.eventos = contenido.eventos.map(entrada => { const evento = entrada as Record<string, unknown>; const acciones: AccionNavegacion[] = []; if (evento.owner === 'M3' && permisos.includes('CU222')) acciones.push(accion('Abrir cuentas por cobrar', '/dashboard-m7/cuentas-cobrar')); if (evento.owner === 'M5' && permisos.includes('CU226')) acciones.push(accion('Abrir cuentas por pagar', '/dashboard-m7/cuentas-pagar')); return { ...evento, ...(acciones.length ? { acciones } : {}) }; }); proyeccion.valor = contenido; }
      salida.proyeccion = proyeccion; for (const clave of ['presupuesto', 'realVsProyectado', 'ivaFlujo', 'saldoInicial', 'capaEstimada']) salida[clave] = datos[clave];
    }
    return salida;
  }

  async consultarRiesgoDeficit(consulta: Consulta, permisos: string[]) {
    const datos = await this.consultarLiquidezCompleto(consulta);
    const proyeccion = datos.proyeccion;
    const valor = proyeccion.valor as { eventos?: Array<{ fecha: string; moneda: string; liquidezProyectada: number }>; ingresos?: Array<Record<string, unknown>>; egresos?: Array<Record<string, unknown>> } | null;
    const serie = valor?.eventos?.filter(punto => /^\d{4}-\d{2}-\d{2}$/.test(punto.fecha) && typeof punto.moneda === 'string' && Number.isFinite(Number(punto.liquidezProyectada))) || [];
    const fechaCorte = new Date(`${fechaNegocio()}T00:00:00Z`);
    const parametros = await prisma.parametro_remuneracional.findMany({ where: { codigo: { startsWith: prefijoUmbralLiquidez }, tipo: 'DASHBOARD', unidad: 'MONTO', estado: 'activo', vigencia_desde: { lte: fechaCorte }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fechaCorte } }] }, orderBy: { valor: 'desc' } });
    const umbrales = parametros.filter(fila => fila.valor !== null).map(fila => ({ id: fila.id_parametro_remuneracional, nombre: fila.nombre, valor: Number(fila.valor) }));
    let alertas; let minimoProyectado;
    if (!serie.length) {
      alertas = indicador('DATOS_INSUFICIENTES', null, 'CU231 no dispone de una serie válida de liquidez proyectada');
      minimoProyectado = indicador('CONFIGURACION_PENDIENTE', null, 'No existe una serie absoluta válida para identificar el mínimo del horizonte');
    } else {
      const monedas = [...new Set(serie.map(punto => punto.moneda))];
      const cruces = monedas.flatMap(moneda => umbrales.flatMap(umbral => {
        const puntos = serie.filter(punto => punto.moneda === moneda).sort((a, b) => a.fecha.localeCompare(b.fecha));
        const indice = puntos.findIndex((punto, posicion) => punto.liquidezProyectada < umbral.valor && (posicion === 0 || puntos[posicion - 1].liquidezProyectada >= umbral.valor));
        return indice >= 0 ? [{ moneda, umbral: umbral.valor, nombre: umbral.nombre, primeraFechaCruce: puntos[indice].fecha, liquidezProyectada: puntos[indice].liquidezProyectada, mensaje: `La liquidez proyectada bajaría de ${umbral.valor}` }] : [];
      }));
      const minimos = monedas.map(moneda => serie.filter(punto => punto.moneda === moneda).sort((a, b) => Number(a.liquidezProyectada) - Number(b.liquidezProyectada) || a.fecha.localeCompare(b.fecha))[0]);
      alertas = umbrales.length ? indicador(cruces.length ? 'VALIDO' : 'SIN_RESULTADOS', cruces, 'Primer cruce descendente por umbral monetario configurable') : indicador('CONFIGURACION_PENDIENTE', null, 'No existen umbrales monetarios de liquidez vigentes');
      minimoProyectado = indicador('VALIDO', minimos, 'Menor saldo proyectado por moneda dentro del horizonte');
    }
    const factores: Array<Record<string, unknown>> = [];
    if (permisos.includes('CU225')) for (const fila of valor?.ingresos || []) factores.push({ ...fila, naturaleza: 'COBRO_M3', origen: 'M3' });
    if (permisos.includes('CU227')) for (const fila of valor?.egresos || []) factores.push({ ...fila, naturaleza: 'PAGO_M5', origen: 'M5' });
    const hayPermisoFactores = permisos.includes('CU225') || permisos.includes('CU227');
    return { periodo: datos.periodo, estado: alertas.estado === 'CONFIGURACION_PENDIENTE' ? 'CONFIGURACION_PENDIENTE' as const : 'VALIDO' as const, umbrales: indicador(umbrales.length ? 'VALIDO' : 'CONFIGURACION_PENDIENTE', umbrales, 'Umbrales monetarios vigentes del Mantenedor de Parámetros'), alertas, primerDeficit: alertas, minimoProyectado, factores: hayPermisoFactores ? indicador(factores.length ? 'VALIDO' : 'SIN_RESULTADOS', factores, 'Compromisos reales visibles según permisos de sus fuentes; no representan causalidad automática') : indicador('SIN_PERMISO', null, 'CU232 no concede acceso al detalle de cobros o pagos subyacentes'), criterio: 'Sin score, ranking ni recomendación automática' };
  }

  async consultarMargenProyectos(consulta: Consulta, permisos?: string[]) {
    const datos = await this.consultarMargenProyectosCompleto(consulta) as Record<string, unknown>;
    if (!permisos) return datos;
    const proyectos = (datos.proyectos as Array<Record<string, unknown>> || []).map(proyecto => {
      const salida: Record<string, unknown> = { idProyecto: proyecto.idProyecto, codigo: proyecto.codigo, proyectoTerreno: proyecto.proyectoTerreno, nombre: proyecto.nombre, moneda: proyecto.moneda, estado: proyecto.estado };
      if (permisos.includes('CU233')) for (const clave of ['margenDirecto', 'porcentajeMargen', 'clasificacion']) salida[clave] = proyecto[clave];
      if (permisos.includes('CU234')) for (const clave of ['ingresosAtribuibles', 'desgloseIngresos']) salida[clave] = proyecto[clave];
      if (permisos.includes('CU235')) for (const clave of ['costosDirectosAtribuibles', 'desgloseCostos']) salida[clave] = proyecto[clave];
      if (permisos.includes('CU233') || permisos.includes('CU235')) salida.cobertura = proyecto.cobertura;
      return salida;
    });
    return { periodo: datos.periodo, estado: datos.estado, umbralMargen: permisos.includes('CU233') ? datos.umbralMargen : undefined, proyectos, cobertura: datos.cobertura };
  }

  async consultarExposicionProyectos(consulta: Consulta, permisos: string[]) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const [margen, proyectos] = await Promise.all([
        this.consultarMargenProyectosCompleto(consulta),
        prisma.proyecto_financiero.findMany({ include: { moneda: true, proyecto: true, ficha_cliente: { include: { cliente_financiero: true } }, nota_venta: { include: incluirNota } }, orderBy: { codigo_proyecto_financiero: 'asc' } }),
      ]);
      const abiertos = proyectos.filter(proyecto => ['activo', 'abierto'].includes(proyecto.estado_financiero_proyecto.toLowerCase()));
      const usosNota = proyectos.reduce((mapa, proyecto) => { if (proyecto.id_nota_venta) mapa.set(proyecto.id_nota_venta, (mapa.get(proyecto.id_nota_venta) || 0) + 1); return mapa; }, new Map<number, number>());
      const margenPorProyecto = new Map(margen.proyectos.map(proyecto => [proyecto.idProyecto, proyecto]));
      const filas = abiertos.map(proyecto => {
        const atribucion = margenPorProyecto.get(proyecto.id_proyecto_financiero);
        const nota = proyecto.nota_venta;
        const notaInequivoca = Boolean(nota && usosNota.get(nota.id_nota_venta) === 1 && !retiradosCxC.includes(nota.estado_nota_venta));
        const calculo = notaInequivoca && nota ? calcularNota(nota) : null;
        const fuentesNoDisponibles = ['Inventario sin valorización inequívoca', 'Gastos generales sin imputación directa'];
        if (!notaInequivoca) fuentesNoDisponibles.push('CxC asociada no disponible con las fuentes actuales');
        const fila: Record<string, unknown> = { idProyecto: proyecto.id_proyecto_financiero, codigo: proyecto.codigo_proyecto_financiero, nombre: proyecto.proyecto?.proyecto_nombre_referencia || proyecto.codigo_proyecto_financiero, estadoFinanciero: proyecto.estado_financiero_proyecto, estadoOperacional: proyecto.proyecto?.proyecto_estado_operacional || null, moneda: atribucion?.moneda || proyecto.moneda.codigo_moneda, ingresosAtribuibles: atribucion?.ingresosAtribuibles ?? null, costosDirectosAtribuibles: atribucion?.costosDirectosAtribuibles ?? null, cobrado: calculo?.pagosEfectivos ?? null, pendienteCobrar: calculo?.saldoPendiente ?? null, destinoContexto: permisos.includes('CU237') ? `/dashboard-m7/proyectos/${proyecto.id_proyecto_financiero}?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}` : null, destinoCliente: permisos.includes('CU09') ? rutaCliente(proyecto.ficha_cliente.cliente_financiero) : null, cobertura: indicador('PARCIALMENTE_DISPONIBLE', { fuentesIncluidas: ['Proyecto financiero', ...(atribucion ? ['Atribuciones válidas de CU233-CU235'] : []), ...(notaInequivoca ? ['CxC M3 vinculada directamente'] : [])], fuentesNoDisponibles }, 'La exposición sólo incorpora relaciones inequívocas y no representa costo total del Proyecto') };
        if (permisos.includes('CU234')) fila.desgloseIngresos = atribucion?.desgloseIngresos || [];
        if (permisos.includes('CU235')) fila.desgloseCostos = atribucion?.desgloseCostos || [];
        return fila;
      });
      return { periodo: periodoSalida(periodo), estado: filas.length ? 'PARCIALMENTE_DISPONIBLE' as const : 'SIN_RESULTADOS' as const, proyectos: filas, criterio: 'Sólo Proyectos financieros con estado propietario activo o abierto; sin score ni prioridad automática' };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, proyectos: [], criterio: 'No fue posible consultar las fuentes de Proyecto' }; }
  }

  async consultarContextoProyecto(idProyecto: number, consulta: Consulta, permisos: string[]) {
    if (!Number.isInteger(idProyecto) || idProyecto <= 0) throw new ErrorAplicacion(400, 'Proyecto inválido');
    const periodo = resolverPeriodoM7(consulta);
    const proyecto = await prisma.proyecto_financiero.findUnique({ where: { id_proyecto_financiero: idProyecto }, include: { moneda: true, proyecto: true, ficha_cliente: { include: { cliente_financiero: true } } } });
    if (!proyecto) throw new ErrorAplicacion(404, 'Proyecto no encontrado');
    const bloques: Record<string, unknown> = {};
    if (['CU233', 'CU234', 'CU235', 'CU236'].some(permiso => permisos.includes(permiso))) {
      try {
        const exposicion = await this.consultarExposicionProyectos(consulta, permisos);
        const fila = exposicion.proyectos.find(item => item.idProyecto === idProyecto);
        bloques.financiero = fila ? { estado: exposicion.estado, ...fila, destino: '/dashboard-m7/margen-proyectos' } : { estado: 'DATOS_INSUFICIENTES', detalle: 'El Proyecto no tiene exposición abierta disponible en el período' };
      } catch { bloques.financiero = { estado: 'FUENTE_NO_DISPONIBLE', detalle: 'La fuente financiera no está disponible' }; }
    }
    if (proyecto.id_proyecto_terreno && (permisos.includes('CU199') || permisos.includes('CU204'))) {
      try {
        const terreno = await prisma.proyecto.findUnique({ where: { proyecto_proyecto_id: proyecto.id_proyecto_terreno }, include: { orden_trabajo: { include: { tareas_produccion: { select: { tarea_tarea_id: true, tarea_estado_de_tarea: true } } }, orderBy: { orden_trabajo_fecha_hora: 'desc' } } } });
        if (terreno) {
          const operacional: Record<string, unknown> = { estado: 'VALIDO', proyectoTerreno: terreno.proyecto_proyecto_id.toString(), codigo: terreno.proyecto_codigo_proyecto, nombre: terreno.proyecto_nombre_referencia, destinoTerreno: '/terreno/visitas' };
          if (permisos.includes('CU199')) { operacional.estadoOperacional = terreno.proyecto_estado_operacional; operacional.estadoProduccion = terreno.proyecto_estado_produccion; }
          if (permisos.includes('CU204')) operacional.ordenesTrabajo = terreno.orden_trabajo.map(orden => ({ idOrden: orden.orden_trabajo_id_orden.toString(), estado: orden.orden_trabajo_estado, fecha: orden.orden_trabajo_fecha_hora?.toISOString() || null, tareas: orden.tareas_produccion.length, destino: orden.tareas_produccion[0] ? `/terreno/tareas/${orden.tareas_produccion[0].tarea_tarea_id}/levantamiento` : '/terreno/visitas' }));
          bloques.operacional = operacional;
        }
      } catch { bloques.operacional = { estado: 'FUENTE_NO_DISPONIBLE', detalle: 'Terreno no está disponible' }; }
    }
    return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, proyecto: { idProyecto: proyecto.id_proyecto_financiero, codigo: proyecto.codigo_proyecto_financiero, nombre: proyecto.proyecto?.proyecto_nombre_referencia || proyecto.codigo_proyecto_financiero, estadoFinanciero: proyecto.estado_financiero_proyecto, moneda: proyecto.moneda.codigo_moneda }, destinoCliente: permisos.includes('CU09') ? rutaCliente(proyecto.ficha_cliente.cliente_financiero) : null, bloques };
  }

  async consultarCostoRemuneraciones(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const cargar = (desde: Date, hasta: Date) => prisma.remuneracion.findMany({
      where: { estado: 'cerrada', periodo: { fecha_inicio: { gte: desde, lt: hasta } } },
      select: { total_haberes: true, total_aportes_empleador: true, periodo: { select: { anio: true, mes: true, fecha_inicio: true } } },
      orderBy: [{ periodo: { fecha_inicio: 'asc' } }, { id_remuneracion: 'asc' }],
    });
    try {
      const [actuales, anteriores, atribuciones] = await Promise.all([
        cargar(periodo.desde, periodo.hastaExclusiva), cargar(periodo.anteriorDesde, periodo.anteriorHastaExclusiva),
        prisma.tarea_remunerable.findMany({ where: { estado_validacion: 'validada', id_proyecto_financiero: { not: null }, fecha_tarea: { gte: periodo.desde, lt: periodo.hastaExclusiva } }, select: { id_proyecto_financiero: true, monto_calculado: true, proyecto_financiero: { select: { codigo_proyecto_financiero: true } } } }),
      ]);
      const resumir = (filas: typeof actuales) => filas.reduce((total, fila) => {
        if (fila.total_haberes === null || fila.total_aportes_empleador === null) return total;
        return { cantidad: total.cantidad + 1, haberes: total.haberes.plus(fila.total_haberes), aportes: total.aportes.plus(fila.total_aportes_empleador) };
      }, { cantidad: 0, haberes: new Prisma.Decimal(0), aportes: new Prisma.Decimal(0) });
      const actual = resumir(actuales); const anterior = resumir(anteriores);
      const totalActual = actual.haberes.plus(actual.aportes); const totalAnterior = anterior.haberes.plus(anterior.aportes);
      const evolucion = [...actuales.reduce((mapa, fila) => {
        if (fila.total_haberes === null || fila.total_aportes_empleador === null) return mapa;
        const clave = `${fila.periodo.anio}-${String(fila.periodo.mes).padStart(2, '0')}`;
        mapa.set(clave, (mapa.get(clave) || new Prisma.Decimal(0)).plus(fila.total_haberes).plus(fila.total_aportes_empleador)); return mapa;
      }, new Map<string, Prisma.Decimal>())].map(([periodoClave, costoLaboral]) => ({ periodo: periodoClave, costoLaboral: costoLaboral.toDecimalPlaces(2).toNumber() }));
      const comparacion = !actual.cantidad ? indicador('NO_APLICA', null, 'No existe costo laboral oficial en el período actual') : !anterior.cantidad ? indicador('DATOS_INSUFICIENTES', null, 'No existe período comparable oficial') : totalAnterior.isZero() ? indicador('NO_APLICA', { anterior: 0, actual: totalActual.toNumber(), diferenciaAbsoluta: totalActual.toNumber(), variacionPorcentual: null }, 'La base comparadora es cero; la variación porcentual no aplica') : indicador('VALIDO', { anterior: totalAnterior.toNumber(), actual: totalActual.toNumber(), diferenciaAbsoluta: totalActual.minus(totalAnterior).toDecimalPlaces(2).toNumber(), variacionPorcentual: totalActual.minus(totalAnterior).div(totalAnterior).mul(100).toDecimalPlaces(2).toNumber() }, 'Comparación con el período inmediatamente anterior de igual duración');
      const porProyecto = [...atribuciones.reduce((mapa, fila) => { const id = fila.id_proyecto_financiero!; const previo = mapa.get(id) || { idProyecto: id, codigo: fila.proyecto_financiero?.codigo_proyecto_financiero || String(id), monto: new Prisma.Decimal(0) }; previo.monto = previo.monto.plus(fila.monto_calculado); mapa.set(id, previo); return mapa; }, new Map<number, { idProyecto: number; codigo: string; monto: Prisma.Decimal }>())].map(([, fila]) => ({ idProyecto: fila.idProyecto, codigo: fila.codigo, montoValidado: fila.monto.toDecimalPlaces(2).toNumber() }));
      return { periodo: periodoSalida(periodo), estado: actual.cantidad ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, costoLaboral: indicador(actual.cantidad ? 'VALIDO' : 'SIN_RESULTADOS', actual.cantidad ? totalActual.toDecimalPlaces(2).toNumber() : null, 'Suma agregada de haberes y aportes del empleador en remuneraciones oficiales cerradas'), composicion: indicador(actual.cantidad ? 'VALIDO' : 'SIN_RESULTADOS', actual.cantidad ? { haberes: actual.haberes.toNumber(), aportesEmpleador: actual.aportes.toNumber(), remuneracionesIncluidas: actual.cantidad } : null, 'Componentes agregados; no contiene personas ni liquidaciones individuales'), evolucion: indicador(evolucion.length ? 'VALIDO' : 'SIN_RESULTADOS', evolucion, 'Evolución por período oficial M6'), comparacion, atribucionProyecto: indicador(porProyecto.length ? 'PARCIALMENTE_DISPONIBLE' : 'DATOS_INSUFICIENTES', porProyecto.length ? porProyecto : null, 'Sólo tareas remunerables validadas con vínculo propietario a Proyecto; no representa el costo laboral total por Proyecto'), privacidad: 'Sin nombre, RUT, sueldo, líquido, previsión ni descuentos individuales' };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, costoLaboral: indicador('FUENTE_NO_DISPONIBLE', null, 'M6 no está disponible'), composicion: indicador('FUENTE_NO_DISPONIBLE', null, 'M6 no está disponible'), evolucion: indicador('FUENTE_NO_DISPONIBLE', null, 'M6 no está disponible'), comparacion: indicador('FUENTE_NO_DISPONIBLE', null, 'M6 no está disponible'), atribucionProyecto: indicador('FUENTE_NO_DISPONIBLE', null, 'M6 no está disponible') }; }
  }

  async consultarOrdenesTrabajo(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const ordenes = await prisma.orden_trabajo.findMany({ where: { orden_trabajo_fecha_hora: { gte: periodo.desde, lt: periodo.hastaExclusiva } }, include: { proyecto: true, tareas_produccion: { include: { ejecuciones: { include: { incidencias: true } } } }, tarea_remunerable: { where: { estado_validacion: 'validada' }, select: { monto_calculado: true } } }, orderBy: { orden_trabajo_fecha_hora: 'desc' } });
      const filas = ordenes.map(orden => {
        const estadosTarea = [...orden.tareas_produccion.reduce((mapa, tarea) => mapa.set(tarea.tarea_estado_de_tarea || 'sin_estado', (mapa.get(tarea.tarea_estado_de_tarea || 'sin_estado') || 0) + 1), new Map<string, number>())].map(([estado, cantidad]) => ({ estado, cantidad }));
        const ejecuciones = orden.tareas_produccion.flatMap(tarea => tarea.ejecuciones);
        const costo = orden.tarea_remunerable.reduce((total, tarea) => total.plus(tarea.monto_calculado), new Prisma.Decimal(0));
        return { idOrden: orden.orden_trabajo_id_orden.toString(), estado: orden.orden_trabajo_estado, fecha: orden.orden_trabajo_fecha_hora?.toISOString() || null, proyecto: orden.proyecto ? { id: orden.proyecto.proyecto_proyecto_id.toString(), codigo: orden.proyecto.proyecto_codigo_proyecto, nombre: orden.proyecto.proyecto_nombre_referencia, rutCliente: orden.proyecto.rut_cliente } : null, hitos: { tareas: orden.tareas_produccion.length, estadosTarea, ejecucionesTerminadas: ejecuciones.filter(item => item.estado_ejecucion === 'terminada').length, ejecucionesValidadas: ejecuciones.filter(item => item.estado_validacion_productiva === 'validada').length, incidencias: ejecuciones.reduce((total, item) => total + item.incidencias.length, 0) }, costoRemunerableValidado: orden.tarea_remunerable.length ? costo.toDecimalPlaces(2).toNumber() : null, progresoPorcentual: null, destinoOwner: orden.tareas_produccion[0] ? `/terreno/tareas/${orden.tareas_produccion[0].tarea_tarea_id}/levantamiento` : '/terreno/produccion' };
      });
      return { periodo: periodoSalida(periodo), estado: filas.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, ordenes: filas, progreso: indicador(filas.length ? 'PARCIALMENTE_DISPONIBLE' : 'SIN_RESULTADOS', filas.length ? filas.map(fila => ({ idOrden: fila.idOrden, estado: fila.estado, hitos: fila.hitos })) : null, 'Se muestran estados e hitos propietarios; no se inventa un porcentaje de avance'), cobertura: indicador('PARCIALMENTE_DISPONIBLE', { otCanonica: 'inventario.orden_trabajo', costos: 'Sólo tareas remunerables validadas' }, 'Contexto de sólo lectura; las asociaciones ausentes permanecen no disponibles') };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, ordenes: [], progreso: indicador('FUENTE_NO_DISPONIBLE', null, 'OT/Terreno no está disponible') }; }
  }

  async consultarCargaOperacional(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta); const hoy = new Date(`${fechaNegocio()}T00:00:00Z`);
    const horizonteEntrada = consulta.horizonteDias === undefined ? null : Number(consulta.horizonteDias);
    if (horizonteEntrada !== null && (!Number.isInteger(horizonteEntrada) || horizonteEntrada < 1 || horizonteEntrada > 90)) throw new ErrorAplicacion(400, 'El horizonte debe ser un entero entre 1 y 90 días');
    try {
      const tareas = await prisma.tarea.findMany({ where: { id_orden_trabajo: { not: null } }, include: { orden_trabajo: true }, orderBy: { tarea_tarea_id: 'asc' } });
      const abiertas = tareas.filter(tarea => tarea.orden_trabajo && ['pendiente', 'activa', 'en_progreso'].includes(normalizarTexto(tarea.orden_trabajo.orden_trabajo_estado)) && !['completada', 'terminada', 'cerrada', 'cancelada', 'anulada'].includes(normalizarTexto(tarea.tarea_estado_de_tarea)));
      const asignaciones = abiertas.length ? await prisma.tarea_usuario.findMany({ where: { tarea_usuario_tarea_id: { in: abiertas.map(tarea => tarea.tarea_tarea_id) } } }) : [];
      const asignadas = new Set(asignaciones.map(item => item.tarea_usuario_tarea_id.toString()));
      const hastaProximo = horizonteEntrada === null ? null : new Date(hoy.getTime() + horizonteEntrada * 86400000);
      const presentar = (tarea: typeof abiertas[number]) => ({ idTarea: tarea.tarea_tarea_id.toString(), titulo: tarea.tarea_titulo, estado: tarea.tarea_estado_de_tarea, urgencia: tarea.tarea_urgencia, idOrden: tarea.id_orden_trabajo?.toString() || null, fechaComprometida: tarea.tarea_horario_limite?.toISOString() || null, asignada: asignadas.has(tarea.tarea_tarea_id.toString()), destinoOwner: `/terreno/tareas/${tarea.tarea_tarea_id}/levantamiento` });
      const atrasadas = abiertas.filter(tarea => tarea.tarea_horario_limite && tarea.tarea_horario_limite < hoy);
      const proximas = hastaProximo ? abiertas.filter(tarea => tarea.tarea_horario_limite && tarea.tarea_horario_limite >= hoy && tarea.tarea_horario_limite < hastaProximo) : [];
      return { periodo: periodoSalida(periodo), estado: abiertas.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, abiertos: indicador(abiertas.length ? 'VALIDO' : 'SIN_RESULTADOS', abiertas.map(presentar), 'Tareas de OTs propietarias pendientes, activas o en progreso'), atrasados: indicador(atrasadas.length ? 'VALIDO' : 'SIN_RESULTADOS', atrasadas.map(presentar), 'Sólo tareas abiertas con horario límite propietario vencido'), proximos: horizonteEntrada === null ? indicador('CONFIGURACION_PENDIENTE', null, 'Indica horizonteDias para consultar próximos; no existe umbral de negocio por defecto') : indicador(proximas.length ? 'VALIDO' : 'SIN_RESULTADOS', proximas.map(presentar), `Horizonte solicitado de ${horizonteEntrada} día(s)`), asignacion: indicador(abiertas.length ? 'VALIDO' : 'SIN_RESULTADOS', { asignadas: abiertas.filter(tarea => asignadas.has(tarea.tarea_tarea_id.toString())).length, noAsignadas: abiertas.filter(tarea => !asignadas.has(tarea.tarea_tarea_id.toString())).length }, 'Asignación canónica terreno.tarea_usuario'), capacidad: indicador('NO_APLICA', null, 'No existe modelo propietario de capacidad porcentual'), criterio: 'Sin score ni prioridad automática' };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, abiertos: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), atrasados: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), proximos: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible') }; }
  }

  async consultarInstalaciones(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const servicios = await prisma.servicio_terreno.findMany({ where: { servicio_terreno_estado: 'cerrada', servicio_terreno_fecha_real: { gte: periodo.anteriorDesde, lt: periodo.hastaExclusiva } }, include: { obra: true }, orderBy: { servicio_terreno_fecha_real: 'asc' } });
      const instalaciones = servicios.filter(servicio => esServicioInstalacion(servicio.servicio_terreno_tipo_servicio));
      const actuales = instalaciones.filter(servicio => servicio.servicio_terreno_fecha_real && dentro(servicio.servicio_terreno_fecha_real, periodo));
      const anteriores = instalaciones.filter(servicio => servicio.servicio_terreno_fecha_real && servicio.servicio_terreno_fecha_real >= periodo.anteriorDesde && servicio.servicio_terreno_fecha_real < periodo.anteriorHastaExclusiva);
      const evolucion = [...actuales.reduce((mapa, servicio) => { const clave = servicio.servicio_terreno_fecha_real!.toISOString().slice(0, 7); mapa.set(clave, (mapa.get(clave) || 0) + 1); return mapa; }, new Map<string, number>())].map(([periodoClave, cantidad]) => ({ periodo: periodoClave, cantidad }));
      const ubicaciones = [...actuales.reduce((mapa, servicio) => { const region = servicio.obra?.obra_region?.trim() || null; const ciudad = servicio.obra?.obra_ciudad?.trim() || null; const comuna = servicio.obra?.obra_comuna?.trim() || null; const zona = region && /metropolitana/i.test(region) ? 'SANTIAGO' : region ? 'REGIONES' : 'SIN_UBICACION'; const clave = region || ciudad || comuna ? `${zona}|${region || 'SIN_REGION'}|${ciudad || 'SIN_CIUDAD'}|${comuna || 'SIN_COMUNA'}` : 'SIN_UBICACION|SIN_UBICACION|SIN_UBICACION|SIN_UBICACION'; mapa.set(clave, (mapa.get(clave) || 0) + 1); return mapa; }, new Map<string, number>())].map(([clave, cantidad]) => { const [zona, region, ciudad, comuna] = clave.split('|'); return { zona, region, ciudad, comuna, cantidad }; });
      const sinUbicacion = actuales.filter(servicio => !servicio.obra?.obra_region?.trim() || !servicio.obra?.obra_ciudad?.trim() || !servicio.obra?.obra_comuna?.trim()).length;
      const comparacion = anteriores.length === 0 ? indicador('NO_APLICA', { anterior: 0, actual: actuales.length, diferenciaAbsoluta: actuales.length, variacionPorcentual: null }, 'La base comparadora es cero; la variación porcentual no aplica') : indicador('VALIDO', { anterior: anteriores.length, actual: actuales.length, diferenciaAbsoluta: actuales.length - anteriores.length, variacionPorcentual: Number((((actuales.length - anteriores.length) / anteriores.length) * 100).toFixed(2)) }, 'Comparación con el período inmediatamente anterior de igual duración');
      const detalle = actuales.map(servicio => ({ idServicio: servicio.servicio_terreno_servicio_terreno_id.toString(), tipo: servicio.servicio_terreno_tipo_servicio, estado: servicio.servicio_terreno_estado, fecha: fechaIso(servicio.servicio_terreno_fecha_real!), zona: servicio.obra?.obra_region && /metropolitana/i.test(servicio.obra.obra_region) ? 'SANTIAGO' : servicio.obra?.obra_region ? 'REGIONES' : 'SIN_UBICACION', region: servicio.obra?.obra_region || null, ciudad: servicio.obra?.obra_ciudad || null, comuna: servicio.obra?.obra_comuna || null, destinoOwner: '/terreno/visitas' }));
      return { periodo: periodoSalida(periodo), estado: actuales.length ? (sinUbicacion ? 'PARCIALMENTE_DISPONIBLE' as const : 'VALIDO' as const) : 'SIN_RESULTADOS' as const, volumen: indicador(actuales.length ? 'VALIDO' : 'SIN_RESULTADOS', actuales.length, 'Servicios cerrados cuyo tipo propietario identifica exactamente una instalación'), evolucion: indicador(evolucion.length ? 'VALIDO' : 'SIN_RESULTADOS', evolucion, 'Volumen de instalaciones identificables por período'), comparacion, geografia: indicador(sinUbicacion ? 'PARCIALMENTE_DISPONIBLE' : actuales.length ? 'VALIDO' : 'SIN_RESULTADOS', ubicaciones, `${sinUbicacion} instalación(es) sin ubicación normalizada; no se infiere región desde texto libre`), instalaciones: detalle, cobertura: 'No incluye servicios cuyo tipo no permita identificar inequívocamente una instalación' };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, volumen: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), evolucion: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), geografia: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible') }; }
  }

  async consultarAtrasosInstalaciones(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const fechaReferencia = consulta.fechaReferencia ? fechaUtc(consulta.fechaReferencia, 'Fecha de referencia') : new Date(`${fechaNegocio()}T00:00:00Z`);
    const estadosTerminales = new Set(['completada', 'completado', 'terminada', 'terminado', 'cerrada', 'cerrado', 'cancelada', 'cancelado', 'anulada', 'anulado']);
    try {
      const tareas = await prisma.tarea.findMany({
        include: { servicio_terreno: true, orden_trabajo: { include: { proyecto: true } } },
        orderBy: { tarea_tarea_id: 'asc' },
      });
      const confirmadas = tareas.filter(tarea => tarea.servicio_terreno && esServicioInstalacion(tarea.servicio_terreno.servicio_terreno_tipo_servicio));
      const relacionNoConfirmada = tareas.length - confirmadas.length;
      const conEfecto = confirmadas.filter(tarea => !estadosTerminales.has(normalizarTexto(tarea.tarea_estado_de_tarea)) && !estadosTerminales.has(normalizarTexto(tarea.servicio_terreno?.servicio_terreno_estado)) && !estadosTerminales.has(normalizarTexto(tarea.orden_trabajo?.orden_trabajo_estado)));
      const finalizadasExcluidas = confirmadas.length - conEfecto.length;
      const calculables = conEfecto.filter(tarea => tarea.tarea_horario_limite instanceof Date && Number.isFinite(tarea.tarea_horario_limite.getTime()));
      const sinFecha = conEfecto.filter(tarea => !tarea.tarea_horario_limite || !Number.isFinite(tarea.tarea_horario_limite.getTime()));
      const presentar = (tarea: typeof calculables[number], atrasada: boolean) => ({
        idTarea: tarea.tarea_tarea_id.toString(), titulo: tarea.tarea_titulo, clasificacionTemporal: atrasada ? 'ATRASO_DERIVADO' : 'EN_PLAZO_DERIVADO',
        fechaLimite: tarea.tarea_horario_limite!.toISOString(), diasAtraso: atrasada ? diasCalendario(tarea.tarea_horario_limite!, fechaReferencia) : 0,
        estadoTarea: tarea.tarea_estado_de_tarea, idServicio: tarea.id_servicio_terreno?.toString() || null, estadoServicio: tarea.servicio_terreno?.servicio_terreno_estado || null,
        idOrden: tarea.id_orden_trabajo?.toString() || null, estadoOrden: tarea.orden_trabajo?.orden_trabajo_estado || null,
        idProyecto: tarea.orden_trabajo?.proyecto_id_proyecto?.toString() || null,
      });
      const atrasadas = calculables.filter(tarea => tarea.tarea_horario_limite! < fechaReferencia).map(tarea => presentar(tarea, true));
      const enPlazo = calculables.filter(tarea => tarea.tarea_horario_limite! >= fechaReferencia).map(tarea => presentar(tarea, false));
      const sinInformacion = sinFecha.map(tarea => ({ idTarea: tarea.tarea_tarea_id.toString(), titulo: tarea.tarea_titulo, estadoTarea: tarea.tarea_estado_de_tarea, idServicio: tarea.id_servicio_terreno?.toString() || null, idOrden: tarea.id_orden_trabajo?.toString() || null, diasAtraso: null }));
      const duraciones = confirmadas.filter(tarea => tarea.tarea_fecha_de_inicio && tarea.tarea_fecha_de_termino && tarea.tarea_fecha_de_termino >= tarea.tarea_fecha_de_inicio).map(tarea => ({ idTarea: tarea.tarea_tarea_id.toString(), inicioReal: fechaIso(tarea.tarea_fecha_de_inicio!), terminoReal: fechaIso(tarea.tarea_fecha_de_termino!), duracionDias: diasCalendario(tarea.tarea_fecha_de_inicio!, tarea.tarea_fecha_de_termino!) }));
      const resumen = { coberturaTemporalValida: calculables.length, atrasadas: atrasadas.length, enPlazo: enPlazo.length, sinFechaSuficiente: sinFecha.length, relacionInstalacionNoConfirmada: relacionNoConfirmada, finalizadasOAnuladasExcluidas: finalizadasExcluidas };
      return {
        periodo: periodoSalida(periodo), fechaReferencia: fechaIso(fechaReferencia), estado: 'PARCIALMENTE_DISPONIBLE' as const,
        resumen: indicador('PARCIALMENTE_DISPONIBLE', resumen, 'Cobertura parcial: sólo tareas vinculadas directamente a servicios cuyo tipo propietario identifica una instalación'),
        atrasos: indicador(atrasadas.length ? 'VALIDO' : 'SIN_RESULTADOS', atrasadas, 'Clasificación derivada de tarea_horario_limite vencido y estados propietarios no terminales; días calendario'),
        enPlazo: indicador(enPlazo.length ? 'VALIDO' : 'SIN_RESULTADOS', enPlazo, 'Tareas con fecha límite válida aún no vencida; no incluye tareas sin fecha'),
        sinInformacionTemporal: indicador(sinFecha.length ? 'DATOS_INSUFICIENTES' : 'SIN_RESULTADOS', sinInformacion, 'La ausencia de tarea_horario_limite no se interpreta como cero ni como trabajo en plazo'),
        relacionInstalacionNoConfirmada: indicador(relacionNoConfirmada ? 'PARCIALMENTE_DISPONIBLE' : 'SIN_RESULTADOS', { cantidad: relacionNoConfirmada }, 'Tareas excluidas porque no tienen relación directa con un servicio identificado exactamente como instalación'),
        duracion: duraciones.length ? indicador('VALIDO', duraciones, 'Término real menos inicio real informado en Terreno') : indicador('DATOS_INSUFICIENTES', null, 'No existen instalaciones cerradas con inicio y término reales'),
        tiempoCiclo: duraciones.length ? indicador('VALIDO', { cantidad: duraciones.length, promedioDias: redondear(duraciones.reduce((suma, fila) => suma + fila.duracionDias, 0) / duraciones.length) }, 'Promedio de duraciones reales cerradas') : indicador('DATOS_INSUFICIENTES', null, 'No existe base real para calcular tiempo de ciclo'),
        cobertura: indicador(sinFecha.length || relacionNoConfirmada ? 'PARCIALMENTE_DISPONIBLE' : 'VALIDO', resumen, 'Usa exclusivamente la fecha comprometida y el inicio/término reales registrados'),
        criterio: 'Sin score, prioridad, causalidad de incidencias ni escritura en Terreno/OT',
      };
    } catch {
      return { periodo: periodoSalida(periodo), fechaReferencia: fechaIso(fechaReferencia), estado: 'FUENTE_NO_DISPONIBLE' as const, resumen: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), atrasos: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), enPlazo: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), sinInformacionTemporal: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), duracion: indicador('DATOS_INSUFICIENTES', null, 'NO CALCULABLE'), tiempoCiclo: indicador('DATOS_INSUFICIENTES', null, 'NO CALCULABLE'), cobertura: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible') };
    }
  }

  async consultarIncidenciasRetrabajos(consulta: Consulta, permisos: string[] = []) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const registros = await prisma.incidencia_retrabajo_tarea.findMany({ where: { fecha_registro: { gte: periodo.anteriorDesde, lt: periodo.hastaExclusiva } }, include: { categoria: true, area_responsable: true, evidencias: { select: { evidencia_terreno_evidencia_terreno_id: true } }, ejecucion: { include: { ejecutor: true, tarea: { include: { orden_trabajo: { include: { proyecto: { include: { cliente: true } } } }, servicio_terreno: true } } } } }, orderBy: { fecha_registro: 'desc' } });
      const actuales = registros.filter(registro => dentro(registro.fecha_registro, periodo));
      const anteriores = registros.filter(registro => registro.fecha_registro >= periodo.anteriorDesde && registro.fecha_registro < periodo.anteriorHastaExclusiva);
      const estados = [...actuales.reduce((mapa, registro) => mapa.set(registro.estado, (mapa.get(registro.estado) || 0) + 1), new Map<string, number>())].map(([estado, cantidad]) => ({ estado, cantidad }));
      const resumenRevision = resumirIncidenciasRevisionM7(actuales.map(registro => ({ estadoRevision: registro.estado_revision, categoria: registro.categoria ? { codigo: registro.categoria.codigo, nombre: registro.categoria.nombre } : null })));
      const { estadosRevision, categorias } = resumenRevision;
      const hoy = new Date();
      const detalle = actuales.map(registro => {
        const tarea = registro.ejecucion.tarea; const proyecto = tarea?.orden_trabajo?.proyecto;
        return { id: registro.id_incidencia_retrabajo.toString(), referencia: `INC-${registro.id_incidencia_retrabajo.toString().padStart(5, '0')}`, tipo: 'Incidencia operacional', categoria: registro.categoria ? { codigo: registro.categoria.codigo, nombre: registro.categoria.nombre } : null, area: registro.area_responsable?.area_trabajo_nombre_area || registro.area_responsable?.area_trabajo_clasificacion || null, estado: registro.estado, estadoRevision: registro.estado_revision, descripcion: registro.descripcion, causaReferencia: registro.causa_referencia, fecha: registro.fecha_registro.toISOString(), antiguedadDias: diasCalendario(registro.fecha_registro, hoy), tieneEvidencia: registro.evidencias.length > 0, idTarea: registro.ejecucion.id_tarea.toString(), tarea: tarea?.tarea_titulo || `Tarea ${registro.ejecucion.id_tarea.toString()}`, idOrden: tarea?.id_orden_trabajo?.toString() || null, idServicio: tarea?.id_servicio_terreno?.toString() || null, proyecto: proyecto ? { id: proyecto.proyecto_proyecto_id.toString(), codigo: proyecto.proyecto_codigo_proyecto, nombre: proyecto.proyecto_nombre_referencia } : null, cliente: proyecto?.cliente ? { rut: proyecto.cliente.cliente_cliente_rut, nombre: proyecto.cliente.cliente_razon_social || proyecto.cliente.cliente_cliente_b2b_razon_social || [proyecto.cliente.cliente_cliente_b2c_primer_nombre, proyecto.cliente.cliente_cliente_b2c_primer_apellido].filter(Boolean).join(' ') || null } : null, responsableOwner: permisos.includes('CU213') ? { id: registro.ejecucion.id_usuario_ejecutor.toString(), nombre: [registro.ejecucion.ejecutor.usuario_nombre_completo_primer_nombre_usuario, registro.ejecucion.ejecutor.usuario_nombre_completo_primer_apellido_usuario].filter(Boolean).join(' ') || registro.ejecucion.ejecutor.usuario_username } : null, destinoOwner: permisos.includes('CU213') ? `/terreno/incidencias?incidencia=${registro.id_incidencia_retrabajo.toString()}` : null, destinoProyecto: proyecto && permisos.includes('CU237') ? `/dashboard-m7/proyectos/${proyecto.proyecto_proyecto_id.toString()}` : null, destinoCliente: proyecto?.cliente && permisos.includes('CU09') ? `/clientes/${encodeURIComponent(proyecto.cliente.cliente_cliente_rut)}` : null };
      });
      const vinculados = detalle.filter(item => item.idOrden || item.idServicio).length;
      const evolucion = [
        { periodo: `${periodo.anteriorDesde.toISOString().slice(0, 10)}..${new Date(periodo.anteriorHastaExclusiva.getTime() - 86400000).toISOString().slice(0, 10)}`, cantidad: anteriores.length },
        { periodo: `${periodo.etiquetaDesde}..${periodo.etiquetaHasta}`, cantidad: actuales.length },
      ];
      const aprobadas = detalle.filter(item => item.estadoRevision === 'aprobada');
      return { periodo: periodoSalida(periodo), estado: actuales.length ? (vinculados === actuales.length ? 'VALIDO' as const : 'PARCIALMENTE_DISPONIBLE' as const) : 'SIN_RESULTADOS' as const, cantidad: indicador(actuales.length ? 'VALIDO' : 'SIN_RESULTADOS', actuales.length, 'Incidencias registradas en Terreno'), calidadValidada: indicador(aprobadas.length ? 'VALIDO' : 'SIN_RESULTADOS', aprobadas.length, 'Sólo incidencias aprobadas se consideran fallas validadas'), estadosRevision: indicador(actuales.length ? 'VALIDO' : 'SIN_RESULTADOS', estadosRevision, 'Aprobadas, pendientes de revisión y rechazadas permanecen separadas'), categorias: indicador(categorias.length ? (categorias.reduce((total, fila) => total + fila.cantidad, 0) === actuales.length ? 'VALIDO' : 'PARCIALMENTE_DISPONIBLE') : 'DATOS_INSUFICIENTES', categorias, 'Clasificación basada exclusivamente en el catálogo de incidencias; no usa texto libre'), estados: indicador(estados.length ? 'VALIDO' : 'SIN_RESULTADOS', estados, 'Estado operacional registrado; pendiente/corregida/cerrada no se reinterpreta'), evolucion: indicador('VALIDO', evolucion, 'Comparación temporal de registros de incidencia/retrabajo'), registros: detalle, retrabajos: indicador(aprobadas.length ? 'VALIDO' : 'SIN_RESULTADOS', aprobadas.map(item => ({ referencia: item.referencia, categoria: item.categoria, idOrden: item.idOrden, idServicio: item.idServicio, destinoOwner: item.destinoOwner })), 'Indicador de calidad basado únicamente en incidencias aprobadas'), cobertura: indicador(vinculados === actuales.length && categorias.reduce((total, fila) => total + fila.cantidad, 0) === actuales.length ? 'VALIDO' : 'PARCIALMENTE_DISPONIBLE', { vinculados, sinVinculoOperacional: actuales.length - vinculados, sinCategoriaEstructurada: actuales.filter(item => !item.categoria).length }, 'Vínculos registrados por ejecución → tarea → OT/servicio/proyecto y catálogo estructurado'), privacidad: 'Sin rankings de trabajadores; el responsable asignado sólo es visible con el permiso de revisión' };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, cantidad: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), estados: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), registros: [] }; }
  }

  async registrarAjusteLiquidez(entrada: Record<string, unknown>, actor: { id: bigint; administrador: boolean }) {
    if (!actor.administrador) throw new ErrorAplicacion(403, 'Sólo un Administrador puede registrar ajustes manuales de liquidez');
    const naturaleza = normalizarTexto(String(entrada.naturaleza || entrada.tipo || ''));
    if (!['entrada', 'salida'].includes(naturaleza)) throw new ErrorAplicacion(400, 'Naturaleza permitida: entrada o salida');
    const monto = new Prisma.Decimal(String(entrada.monto || 0));
    if (!monto.isFinite() || monto.lte(0)) throw new ErrorAplicacion(400, 'El monto debe ser mayor que cero');
    const justificacion = String(entrada.justificacion || '').trim();
    if (!justificacion) throw new ErrorAplicacion(400, 'La justificación es obligatoria');
    const idMoneda = Number(entrada.idMoneda);
    if (!Number.isInteger(idMoneda) || idMoneda <= 0) throw new ErrorAplicacion(400, 'La moneda es obligatoria');
    const fecha = entrada.fecha ? fechaUtc(entrada.fecha, 'Fecha') : new Date();
    return prisma.$transaction(async tx => {
      if (!await tx.moneda.findUnique({ where: { id_moneda: idMoneda } })) throw new ErrorAplicacion(404, 'Moneda no encontrada');
      const movimiento = await tx.movimiento_financiero.create({ data: { id_moneda: idMoneda, fecha_movimiento: fecha, tipo_movimiento_financiero: 'AJUSTE_MANUAL_LIQUIDEZ', naturaleza_movimiento: naturaleza === 'entrada' ? 'ingreso' : 'egreso', motivo_movimiento: justificacion, monto_movimiento: monto.toDecimalPlaces(2), observacion: `Responsable M4: ${actor.id.toString()}` } });
      await tx.origen_movimiento_financiero.create({ data: { id_movimiento_financiero: movimiento.id_movimiento_financiero, entidad_origen: 'ajuste_manual_liquidez', id_registro_origen: movimiento.id_movimiento_financiero, descripcion_origen: justificacion } });
      await tx.evento_auditoria.create({ data: { id_usuario: actor.id, tipo_evento: 'AJUSTE_LIQUIDEZ', entidad_afectada: 'movimiento_financiero', id_registro_afectado: movimiento.id_movimiento_financiero, accion_realizada: naturaleza === 'entrada' ? 'AJUSTE_ENTRADA' : 'AJUSTE_SALIDA', descripcion_evento: justificacion } });
      return { idMovimiento: movimiento.id_movimiento_financiero, naturaleza: naturaleza.toUpperCase(), monto: Number(movimiento.monto_movimiento), fecha: movimiento.fecha_movimiento, responsable: actor.id.toString(), justificacion };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async consultarParametrosDeltaM7() {
    const filas = await prisma.parametro_remuneracional.findMany({ where: { OR: [{ codigo: { startsWith: prefijoUmbralLiquidez } }, { codigo: { startsWith: prefijoCostoInstalacion } }, { codigo: codigoDiasStockInmovil }] }, orderBy: [{ codigo: 'asc' }, { vigencia_desde: 'desc' }] });
    return { estado: filas.length ? 'VALIDO' as const : 'CONFIGURACION_PENDIENTE' as const, parametros: filas.map(fila => ({ id: fila.id_parametro_remuneracional, codigo: fila.codigo, nombre: fila.nombre, valor: fila.valor === null ? null : Number(fila.valor), unidad: fila.unidad, referencia: fila.referencia, vigenciaDesde: fechaIso(fila.vigencia_desde), vigenciaHasta: fila.vigencia_hasta ? fechaIso(fila.vigencia_hasta) : null, estado: fila.estado })) };
  }

  async consultarParametrosPorFamiliaM7(familia: 'UMBRAL_LIQUIDEZ' | 'COSTO_INSTALACION' | 'DIAS_STOCK_INMOVIL') {
    const todos = await this.consultarParametrosDeltaM7();
    const prefijo = familia === 'UMBRAL_LIQUIDEZ' ? prefijoUmbralLiquidez : familia === 'COSTO_INSTALACION' ? prefijoCostoInstalacion : codigoDiasStockInmovil;
    const parametros = todos.parametros.filter(fila => familia === 'DIAS_STOCK_INMOVIL' ? fila.codigo === prefijo : fila.codigo.startsWith(prefijo));
    return { estado: parametros.length ? 'VALIDO' as const : 'CONFIGURACION_PENDIENTE' as const, familia, parametros };
  }

  configurarUmbralLiquidezM7(entrada: Record<string, unknown>) { return this.configurarParametroDeltaM7({ ...entrada, familia: 'UMBRAL_LIQUIDEZ' }); }
  configurarCostoInstalacionM7(entrada: Record<string, unknown>) { return this.configurarParametroDeltaM7({ ...entrada, familia: 'COSTO_INSTALACION' }); }
  configurarDiasStockInmovilM7(entrada: Record<string, unknown>) { return this.configurarParametroDeltaM7({ ...entrada, familia: 'DIAS_STOCK_INMOVIL' }); }

  async configurarParametroDeltaM7(entrada: Record<string, unknown>) {
    const familia = String(entrada.familia || '').toUpperCase();
    const desde = fechaUtc(entrada.vigenciaDesde, 'Vigencia desde');
    const valor = new Prisma.Decimal(String(entrada.valor ?? ''));
    if (!valor.isFinite() || valor.lt(0)) throw new ErrorAplicacion(400, 'El valor debe ser numérico y no negativo');
    let codigo = ''; let nombre = ''; let unidad = ''; let referencia: string | null = null;
    if (familia === 'UMBRAL_LIQUIDEZ') { const etiqueta = String(entrada.etiqueta || entrada.valor || '').trim(); codigo = `${prefijoUmbralLiquidez}${slugParametro(etiqueta)}`; nombre = `Umbral de liquidez ${etiqueta}`; unidad = 'MONTO'; }
    else if (familia === 'COSTO_INSTALACION') { const ciudad = String(entrada.ciudad || '').trim(); const comuna = String(entrada.comuna || '').trim(); if (!ciudad || !comuna) throw new ErrorAplicacion(400, 'Ciudad y comuna son obligatorias'); codigo = `${prefijoCostoInstalacion}${slugParametro(`${ciudad}_${comuna}`)}`; nombre = `Costo instalación ${ciudad} / ${comuna}`; unidad = 'MONTO'; referencia = JSON.stringify({ ciudad, comuna }); }
    else if (familia === 'DIAS_STOCK_INMOVIL') { if (!valor.isInteger() || valor.lt(1)) throw new ErrorAplicacion(400, 'Los días deben ser un entero positivo'); codigo = codigoDiasStockInmovil; nombre = 'Días sin movimiento para stock inmóvil'; unidad = 'DIAS'; }
    else throw new ErrorAplicacion(400, 'Familia de parámetro M7 inválida');
    try {
      await prisma.$transaction(async tx => {
        const efectivas = await tx.parametro_remuneracional.findMany({ where: { codigo, estado: 'activo', vigencia_desde: { lt: desde }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } });
        if (efectivas.length > 1) throw new ErrorAplicacion(409, 'La vigencia histórica del parámetro es ambigua');
        if (efectivas.length === 1) { const hasta = new Date(desde); hasta.setUTCDate(hasta.getUTCDate() - 1); await tx.parametro_remuneracional.update({ where: { id_parametro_remuneracional: efectivas[0].id_parametro_remuneracional }, data: { vigencia_hasta: hasta } }); }
        await tx.parametro_remuneracional.create({ data: { codigo, tipo: 'DASHBOARD', nombre, descripcion: 'Parámetro operativo M7 mantenido sin hardcodear reglas', valor, unidad, vigencia_desde: desde, referencia, estado: 'activo' } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) { if (error instanceof ErrorAplicacion) throw error; if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002', 'P2034'].includes(error.code)) throw new ErrorAplicacion(409, 'El parámetro cambió concurrentemente'); throw error; }
    return this.consultarParametrosDeltaM7();
  }

  async consultarExposicionCreditoM7(consulta: Consulta) {
    // MIDAS: Crédito pertenece a M8; el Dashboard consume su contrato y no recalcula cupos.
    if (!this.creditoM8) return { estado: 'FUENTE_NO_DISPONIBLE' as const, exposicion: indicador('FUENTE_NO_DISPONIBLE', null, 'Información de Crédito no disponible'), owner: 'M8' };
    try { return { estado: 'VALIDO' as const, exposicion: indicador('VALIDO', await this.creditoM8.consultarExposicion(consulta), 'Información oficial de Crédito; el Dashboard no recalcula cupos ni crédito comprometido'), owner: 'M8' }; }
    catch { return { estado: 'FUENTE_NO_DISPONIBLE' as const, exposicion: indicador('FUENTE_NO_DISPONIBLE', null, 'Información de Crédito no disponible'), owner: 'M8' }; }
  }

  async consultarAlertasCreditoM7(consulta: Consulta) {
    if (!this.creditoM8) return { estado: 'FUENTE_NO_DISPONIBLE' as const, alertas: indicador('FUENTE_NO_DISPONIBLE', null, 'Alertas y restricciones de Crédito no disponibles'), owner: 'M8', criterio: 'La morosidad por sí sola no suspende automáticamente' };
    try { return { estado: 'VALIDO' as const, alertas: indicador('VALIDO', await this.creditoM8.consultarAlertas(consulta), 'Restricciones y alertas provenientes del módulo de Crédito'), owner: 'M8', criterio: 'La morosidad es antecedente, no decisión automática' }; }
    catch { return { estado: 'FUENTE_NO_DISPONIBLE' as const, alertas: indicador('FUENTE_NO_DISPONIBLE', null, 'Alertas y restricciones de Crédito no disponibles'), owner: 'M8' }; }
  }

  async consultarBloqueosEconomicosM7(consulta: Consulta) {
    if (!this.bloqueosOwner) return { estado: 'FUENTE_NO_DISPONIBLE' as const, bloqueos: indicador('FUENTE_NO_DISPONIBLE', null, 'La fuente operacional aún no publica bloqueos objetivos'), criterio: 'Un atraso no se convierte automáticamente en bloqueo' };
    try { return { estado: 'VALIDO' as const, bloqueos: indicador('VALIDO', await this.bloqueosOwner.consultarBloqueos(consulta), 'Bloqueos objetivos provenientes de la fuente operacional; sólo lectura') }; }
    catch { return { estado: 'FUENTE_NO_DISPONIBLE' as const, bloqueos: indicador('FUENTE_NO_DISPONIBLE', null, 'La fuente de bloqueos no está disponible') }; }
  }

  async consultarResumenIva(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const [ventas, compras] = await Promise.all([
        prisma.documento_tributario.findMany({ where: { fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_documento: { notIn: ['anulado', 'rechazado'] } }, include: { moneda: true } }),
        prisma.documento_compra_proveedor.findMany({ where: { fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_documento: { notIn: ['anulado', 'rechazado'] } }, include: { moneda: true } }),
      ]);
      const agrupar = (filas: Array<{ moneda: { codigo_moneda: string }; monto_impuesto: Prisma.Decimal }>) => sumarPorMoneda(filas.map(fila => ({ moneda: fila.moneda.codigo_moneda, monto: Number(fila.monto_impuesto) })));
      const ivaVentas = agrupar(ventas); const ivaCompras = agrupar(compras); const monedas = [...new Set([...ivaVentas, ...ivaCompras].map(fila => fila.moneda))];
      const estimado = monedas.map(moneda => ({ moneda, ivaVentas: ivaVentas.find(fila => fila.moneda === moneda)?.monto || 0, ivaCompras: ivaCompras.find(fila => fila.moneda === moneda)?.monto || 0 })).map(fila => ({ ...fila, ivaEstimado: redondear(fila.ivaVentas - fila.ivaCompras) }));
      return { periodo: periodoSalida(periodo), estado: estimado.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, ivaVentas, ivaCompras, ivaEstimado: estimado, naturaleza: 'IVA estimado; no constituye declaración oficial SII' };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, ivaEstimado: indicador('FUENTE_NO_DISPONIBLE', null, 'Documentos tributarios no disponibles') }; }
  }

  private async costosInstalacionVigentes(fecha: Date) {
    const filas = await prisma.parametro_remuneracional.findMany({ where: { codigo: { startsWith: prefijoCostoInstalacion }, tipo: 'DASHBOARD', unidad: 'MONTO', estado: 'activo', vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }] } });
    return filas.flatMap(fila => { try { const ubicacion = JSON.parse(fila.referencia || '{}') as { ciudad?: string; comuna?: string }; return ubicacion.ciudad && ubicacion.comuna && fila.valor !== null ? [{ id: fila.id_parametro_remuneracional, ciudad: ubicacion.ciudad, comuna: ubicacion.comuna, valor: Number(fila.valor) }] : []; } catch { return []; } });
  }

  async consultarCostosFabricacion(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta); const corte = new Date(periodo.hastaExclusiva.getTime() - 86400000);
    try {
      const [proyectos, precios, costosZona] = await Promise.all([
        prisma.proyecto_financiero.findMany({ where: { id_proyecto_terreno: { not: null } }, include: { proyecto: { include: { orden_trabajo: { include: { material_orden_trabajo: true, especificaciones_puerta: { include: { especificacion_servicio_terreno: { include: { servicio_terreno: { include: { obra: true } } } } } } } } } }, tarea_remunerable: { where: { estado_validacion: 'validada', fecha_tarea: { gte: periodo.desde, lt: periodo.hastaExclusiva } } } } }),
        prisma.historial_precio_material.findMany({ where: { estado_precio: 'vigente', fecha_vigencia_inicio: { lte: corte }, OR: [{ fecha_vigencia_fin: null }, { fecha_vigencia_fin: { gte: corte } }] }, orderBy: { fecha_vigencia_inicio: 'desc' } }),
        this.costosInstalacionVigentes(corte),
      ]);
      const precioPorSku = new Map<string, number>(); for (const precio of precios) if (!precioPorSku.has(precio.material_sku)) precioPorSku.set(precio.material_sku, Number(precio.precio_unitario_convertido || precio.precio_unitario));
      const filas = proyectos.map(proyecto => {
        const ordenes = proyecto.proyecto?.orden_trabajo || [];
        const materialesDetalle = ordenes.flatMap(orden => orden.material_orden_trabajo.flatMap(material => { const costo = precioPorSku.get(material.material_sku); const cantidad = Number(material.material_orden_trabajo_consumo_real ?? material.material_orden_trabajo_consumo_estimado ?? 0); return costo === undefined || cantidad <= 0 ? [] : [{ sku: material.material_sku, cantidad, costoUnitario: costo, costo: redondear(cantidad * costo), idOrden: orden.orden_trabajo_id_orden.toString() }]; }));
        const extras = proyecto.tarea_remunerable.map(tarea => ({ idTareaRemunerable: tarea.id_tarea_remunerable, monto: Number(tarea.monto_calculado) }));
        const ubicaciones = ordenes.flatMap(orden => orden.especificaciones_puerta?.especificacion_servicio_terreno.flatMap(vinculo => { const servicio = vinculo.servicio_terreno; return servicio && esServicioInstalacion(servicio.servicio_terreno_tipo_servicio) && servicio.obra ? [{ idServicio: servicio.servicio_terreno_servicio_terreno_id.toString(), fechaReal: servicio.servicio_terreno_fecha_real ? fechaIso(servicio.servicio_terreno_fecha_real) : null, region: servicio.obra.obra_region, ciudad: servicio.obra.obra_ciudad, comuna: servicio.obra.obra_comuna }] : []; }) || []);
        const instalaciones = ubicaciones.map(ubicacion => { const config = costosZona.find(item => normalizarTexto(item.ciudad) === normalizarTexto(ubicacion.ciudad) && normalizarTexto(item.comuna) === normalizarTexto(ubicacion.comuna)); return { ...ubicacion, costo: config?.valor ?? null, parametro: config?.id ?? null }; });
        const materiales = materialesDetalle.reduce((suma, item) => suma + item.costo, 0); const remuneracionesExtra = extras.reduce((suma, item) => suma + item.monto, 0); const costosInstalacion = instalaciones.every(item => item.costo !== null) ? instalaciones.reduce((suma, item) => suma + Number(item.costo), 0) : null;
        return { idProyecto: proyecto.id_proyecto_financiero, codigo: proyecto.codigo_proyecto_financiero, materiales: redondear(materiales), remuneracionesExtra: redondear(remuneracionesExtra), costoInstalacion: costosInstalacion === null ? null : redondear(costosInstalacion), costoFabricacion: costosInstalacion === null ? null : redondear(materiales + remuneracionesExtra + costosInstalacion), desglose: { materiales: materialesDetalle, remuneracionesExtra: extras, instalaciones }, estado: costosInstalacion === null ? 'PARCIALMENTE_DISPONIBLE' : 'VALIDO' };
      });
      return { periodo: periodoSalida(periodo), estado: filas.some(fila => fila.estado === 'PARCIALMENTE_DISPONIBLE') ? 'PARCIALMENTE_DISPONIBLE' as const : filas.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, proyectos: filas, formula: 'materiales atribuibles + remuneraciones extra atribuibles + costo de instalación configurado por ciudad/comuna' };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, proyectos: [] }; }
  }

  async consultarMargenInstalaciones(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const costos = await this.consultarCostosFabricacion(consulta);
    if (!('proyectos' in costos)) return costos;
    const ids = costos.proyectos.map(proyecto => proyecto.idProyecto);
    const proyectos = await prisma.proyecto_financiero.findMany({ where: { id_proyecto_financiero: { in: ids } }, include: { nota_venta: true } });
    const filas = costos.proyectos.flatMap(costo => {
      const proyecto = proyectos.find(item => item.id_proyecto_financiero === costo.idProyecto); const instalaciones = costo.desglose.instalaciones;
      if (!proyecto?.nota_venta || instalaciones.length !== 1 || instalaciones[0].costo === null || !instalaciones[0].fechaReal) return [];
      const fecha = new Date(`${instalaciones[0].fechaReal}T00:00:00Z`); if (!Number.isFinite(fecha.getTime())) return [];
      const precio = Number(proyecto.nota_venta.monto_neto); const costoInstalacion = Number(instalaciones[0].costo);
      return [{ idProyecto: costo.idProyecto, idServicio: instalaciones[0].idServicio, fecha: instalaciones[0].fechaReal, region: instalaciones[0].region, ciudad: instalaciones[0].ciudad, comuna: instalaciones[0].comuna, precio, costo: costoInstalacion, margen: redondear(precio - costoInstalacion) }];
    });
    const actuales = filas.filter(fila => dentro(new Date(`${fila.fecha}T00:00:00Z`), periodo));
    const anteriores = filas.filter(fila => { const fecha = new Date(`${fila.fecha}T00:00:00Z`); return fecha >= periodo.anteriorDesde && fecha < periodo.anteriorHastaExclusiva; });
    const agregar = (items: typeof filas) => items.length ? { cantidad: items.length, precioMedio: redondear(items.reduce((s, f) => s + f.precio, 0) / items.length), costoMedio: redondear(items.reduce((s, f) => s + f.costo, 0) / items.length), margenAgregado: redondear(items.reduce((s, f) => s + f.margen, 0)), margenMedio: redondear(items.reduce((s, f) => s + f.margen, 0) / items.length) } : null;
    const actual = agregar(actuales); const anterior = agregar(anteriores);
    const geografia = [...actuales.reduce((mapa, fila) => { const clave = `${fila.region || 'SIN_REGION'}|${fila.ciudad || 'SIN_CIUDAD'}|${fila.comuna || 'SIN_COMUNA'}`; const grupo = mapa.get(clave) || []; grupo.push(fila); mapa.set(clave, grupo); return mapa; }, new Map<string, typeof filas>())].map(([clave, items]) => { const [region, ciudad, comuna] = clave.split('|'); return { region, ciudad, comuna, ...agregar(items) }; });
    const comparacion = actual && anterior ? indicador('VALIDO', { actual, anterior, diferenciaMargenAgregado: redondear(actual.margenAgregado - anterior.margenAgregado), variacionMargenPorcentual: anterior.margenAgregado === 0 ? null : redondear((actual.margenAgregado - anterior.margenAgregado) / Math.abs(anterior.margenAgregado) * 100) }, 'Período inmediatamente anterior de igual duración') : indicador('DATOS_INSUFICIENTES', null, 'No existe una base atribuible en ambos períodos para comparar');
    return { periodo: costos.periodo, estado: actuales.length ? 'VALIDO' as const : 'DATOS_INSUFICIENTES' as const, instalaciones: actuales, agregados: actual, geografia, comparacion, cobertura: 'Sólo proyectos con una única instalación fechada y Nota de Venta inequívoca; no se prorratean ventas generales' };
  }

  async consultarInventarioValorizado(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta); const corte = new Date(periodo.hastaExclusiva.getTime() - 86400000);
    try {
      const [stocks, precios] = await Promise.all([
        prisma.inventario_bodega.findMany({ include: { bodega: true, material: { include: { material_categoria_general: true } } } }),
        prisma.historial_precio_material.findMany({ where: { estado_precio: 'vigente', fecha_vigencia_inicio: { lte: corte }, OR: [{ fecha_vigencia_fin: null }, { fecha_vigencia_fin: { gte: corte } }] }, orderBy: { fecha_vigencia_inicio: 'desc' } }),
      ]);
      const precioPorSku = new Map<string, number>(); for (const precio of precios) if (!precioPorSku.has(precio.material_sku)) precioPorSku.set(precio.material_sku, Number(precio.precio_unitario_convertido || precio.precio_unitario));
      const filas = stocks.map(stock => { const cantidad = Number(stock.inventario_bodega_cantidad_fisica || 0); const costoUnitario = precioPorSku.get(stock.material_sku) ?? null; return { sku: stock.material_sku, material: stock.material.material_nombre_material, bodega: stock.bodega.bodega_nombre_bodega, ubicacion: stock.bodega.bodega_direccion, categoria: stock.material.material_categoria_general?.material_categoria_general_nombre || null, stock: cantidad, costoUnitario, valor: costoUnitario === null ? null : redondear(cantidad * costoUnitario) }; });
      const calculables = filas.filter(fila => fila.valor !== null); const sinCosto = filas.filter(fila => fila.stock > 0 && fila.valor === null);
      return { periodo: periodoSalida(periodo), estado: sinCosto.length ? 'PARCIALMENTE_DISPONIBLE' as const : filas.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, valorTotal: calculables.length ? indicador('VALIDO', redondear(calculables.reduce((suma, fila) => suma + Number(fila.valor), 0)), 'Stock actual por costo unitario válido') : indicador(filas.length ? 'DATOS_INSUFICIENTES' : 'SIN_RESULTADOS', null, 'No hay costos unitarios válidos para valorizar'), inventario: filas, cobertura: { valorizados: calculables.length, sinCostoValido: sinCosto.length } };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, inventario: [] }; }
  }

  async consultarMaterialesProyectoOt(consulta: Consulta) {
    resolverPeriodoM7(consulta);
    try {
      const [asignados, comprados] = await Promise.all([
        prisma.material_orden_trabajo.findMany({ include: { material: true, orden_trabajo: { include: { proyecto: true } } } }),
        prisma.detalle_material_orden_compra_m5.findMany({ include: { material: true, orden_compra: { include: { proveedor: true } } } }),
      ]);
      return { estado: asignados.length || comprados.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, materialesBodegaAsignados: asignados.map(item => ({ sku: item.material_sku, material: item.material.material_nombre_material, cantidadEstimada: item.material_orden_trabajo_consumo_estimado === null ? null : Number(item.material_orden_trabajo_consumo_estimado), cantidadReal: item.material_orden_trabajo_consumo_real === null ? null : Number(item.material_orden_trabajo_consumo_real), idOrden: item.orden_trabajo_id_orden.toString(), idProyecto: item.orden_trabajo.proyecto_id_proyecto?.toString() || null, destinoOrden: '/terreno/produccion' })), materialesCompradosEspecificamente: comprados.filter(item => item.orden_compra.id_proyecto_financiero_contexto || item.orden_compra.id_orden_trabajo_contexto).map(item => ({ idCompra: item.id_ocs_m5, sku: item.material_sku, material: item.material.material_nombre_material, cantidadPedida: Number(item.cantidad_pedida), cantidadRecibida: Number(item.cantidad_recibida), idProyecto: item.orden_compra.id_proyecto_financiero_contexto, idOrden: item.orden_compra.id_orden_trabajo_contexto?.toString() || null, proveedor: item.orden_compra.proveedor.nombre_razon_social, destinoCompra: `/ordenes-compra-servicios/${item.id_ocs_m5}` })) };
    } catch { return { estado: 'FUENTE_NO_DISPONIBLE' as const, materialesBodegaAsignados: [], materialesCompradosEspecificamente: [] }; }
  }

  async consultarRiesgoStock(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const [stocks, entradas, demandas, reservas] = await Promise.all([
        prisma.inventario_bodega.findMany(),
        prisma.detalle_material_orden_compra_m5.findMany({ include: { material: true, orden_compra: true } }),
        prisma.material_orden_trabajo.findMany({ include: { orden_trabajo: true, material: true } }),
        prisma.reserva_inventario.findMany({ where: { reserva_inventario_estado_reserva: { notIn: ['liberada', 'cancelada'] } }, include: { material: true } }),
      ]);
      const stock = new Map<string, number>(); for (const fila of stocks) stock.set(fila.material_sku, (stock.get(fila.material_sku) || 0) + Number(fila.inventario_bodega_cantidad_fisica || 0) - Number(fila.inventario_bodega_cantidad_reservada || 0));
      const entrada = new Map<string, number>(); for (const fila of entradas.filter(item => item.cantidad_recibida.lt(item.cantidad_pedida))) entrada.set(fila.material_sku, (entrada.get(fila.material_sku) || 0) + Number(fila.cantidad_pedida.minus(fila.cantidad_recibida)));
      const demanda = new Map<string, number>(); for (const fila of reservas) if (fila.material_sku) demanda.set(fila.material_sku, (demanda.get(fila.material_sku) || 0) + Number(fila.reserva_inventario_cantidad_reservada || 0));
      const otsReservadas = new Set(reservas.filter(fila => fila.orden_trabajo_id_orden).map(fila => `${fila.orden_trabajo_id_orden}:${fila.material_sku}`));
      for (const fila of demandas.filter(item => !['completada', 'cancelada'].includes(normalizarTexto(item.orden_trabajo.orden_trabajo_estado)))) if (!otsReservadas.has(`${fila.orden_trabajo_id_orden}:${fila.material_sku}`)) demanda.set(fila.material_sku, (demanda.get(fila.material_sku) || 0) + Math.max(0, Number(fila.material_orden_trabajo_consumo_estimado || 0) - Number(fila.material_orden_trabajo_consumo_real || 0)));
      const skus = [...new Set([...stock.keys(), ...entrada.keys(), ...demanda.keys()])];
      const nombre = new Map([...entradas, ...demandas, ...reservas].map(item => [item.material_sku!, item.material?.material_nombre_material || item.material_sku]));
      const materiales = skus.map(sku => { const actual = redondear(stock.get(sku) || 0, 4); const esperada = redondear(entrada.get(sku) || 0, 4); const conocida = redondear(demanda.get(sku) || 0, 4); const disponible = redondear(actual + esperada, 4); return { sku, material: nombre.get(sku) || sku, stock: actual, entradasEsperadas: esperada, demandaConocida: conocida, disponibilidadFutura: disponible, faltante: redondear(Math.max(0, conocida - disponible), 4), riesgo: disponible < conocida }; });
      return { periodo: periodoSalida(periodo), estado: materiales.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, materiales, riesgos: materiales.filter(item => item.riesgo), criterio: 'Stock disponible + entradas esperadas comparado con demanda futura confirmada; sin score ni reserva automática' };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, materiales: [], riesgos: [] }; }
  }

  async consultarRotacionInventario(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta); const corte = new Date(`${fechaNegocio()}T00:00:00Z`);
    try {
      const parametro = await prisma.parametro_remuneracional.findFirst({ where: { codigo: codigoDiasStockInmovil, tipo: 'DASHBOARD', unidad: 'DIAS', estado: 'activo', vigencia_desde: { lte: corte }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: corte } }] }, orderBy: { vigencia_desde: 'desc' } });
      if (!parametro?.valor) return { periodo: periodoSalida(periodo), estado: 'CONFIGURACION_PENDIENTE' as const, stockInmovil: indicador('CONFIGURACION_PENDIENTE', null, 'Configure días sin movimiento para stock inmóvil') };
      const [movimientos, stocks] = await Promise.all([prisma.movimiento_inventario.findMany({ where: { movimiento_inventario_fecha_hora: { not: null } }, include: { movimiento_inventario_tipo_movimiento: true, material: true }, orderBy: { movimiento_inventario_fecha_hora: 'desc' } }), prisma.inventario_bodega.findMany({ include: { material: true } })]);
      const dias = Number(parametro.valor); const ultimo = new Map<string, Date>(); for (const movimiento of movimientos) if (movimiento.material_sku && movimiento.movimiento_inventario_fecha_hora && !ultimo.has(movimiento.material_sku)) ultimo.set(movimiento.material_sku, movimiento.movimiento_inventario_fecha_hora);
      const stock = new Map<string, { material: string | null; cantidad: number }>(); for (const fila of stocks) { const actual = stock.get(fila.material_sku) || { material: fila.material.material_nombre_material, cantidad: 0 }; actual.cantidad += Number(fila.inventario_bodega_cantidad_fisica || 0); stock.set(fila.material_sku, actual); }
      const inmovil = [...stock].flatMap(([sku, dato]) => { const fecha = ultimo.get(sku); const sinMovimiento = fecha ? diasCalendario(fecha, corte) : null; return dato.cantidad > 0 && (sinMovimiento === null || sinMovimiento >= dias) ? [{ sku, material: dato.material, stock: dato.cantidad, ultimoMovimiento: fecha?.toISOString() || null, diasSinMovimiento: sinMovimiento }] : []; });
      const salidas = movimientos.filter(m => dentro(m.movimiento_inventario_fecha_hora!, periodo) && /salida|consumo|egreso/i.test(m.movimiento_inventario_tipo_movimiento?.movimiento_inventario_tipo_movimiento_nombre || ''));
      const rotacion = salidas.length ? indicador('VALIDO', sumarPorMoneda(salidas.filter(m => m.material_sku).map(m => ({ moneda: m.material_sku!, monto: Number(m.movimiento_inventario_cantidad || 0) }))).map(f => ({ sku: f.moneda, cantidadSalida: f.monto })), 'Salidas reales clasificadas en Inventario durante el período') : indicador('DATOS_INSUFICIENTES', null, 'No existe histórico de salidas clasificadas suficiente para calcular rotación/cobertura');
      return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, parametroDias: dias, stockInmovil: indicador(inmovil.length ? 'VALIDO' : 'SIN_RESULTADOS', inmovil, 'Stock sin movimiento durante al menos los días configurados'), rotacion, cobertura: rotacion.estado === 'VALIDO' ? indicador('PARCIALMENTE_DISPONIBLE', null, 'La cobertura temporal requiere demanda futura fechada por material') : indicador('DATOS_INSUFICIENTES', null, 'Histórico insuficiente') };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, stockInmovil: indicador('FUENTE_NO_DISPONIBLE', null, 'Inventario no disponible') }; }
  }

  async consultarComprasRecepciones(consulta: Consulta, permisos: string[] = []) {
    resolverPeriodoM7(consulta);
    try {
      const detalles = await prisma.detalle_material_orden_compra_m5.findMany({ include: { material: true, orden_compra: { include: { proveedor: true } } }, orderBy: [{ fecha_esperada: 'asc' }, { id_detalle_material_oc_m5: 'asc' }] });
      const filas = detalles.filter(item => item.cantidad_recibida.lt(item.cantidad_pedida)).map(item => ({ idCompra: item.id_ocs_m5, proveedor: item.orden_compra.proveedor.nombre_razon_social, sku: item.material_sku, material: item.material.material_nombre_material, cantidadPedida: Number(item.cantidad_pedida), cantidadRecibida: Number(item.cantidad_recibida), cantidadPendiente: Number(item.cantidad_pedida.minus(item.cantidad_recibida)), fechaEsperada: item.fecha_esperada ? fechaIso(item.fecha_esperada) : item.orden_compra.fecha_esperada_recepcion ? fechaIso(item.orden_compra.fecha_esperada_recepcion) : null, idFichaCliente: item.orden_compra.id_ficha_cliente_contexto, idCotizacion: item.orden_compra.id_cotizacion_contexto, idProyecto: item.orden_compra.id_proyecto_financiero_contexto, idOrden: item.orden_compra.id_orden_trabajo_contexto?.toString() || null, acciones: permisos.includes('CU88') ? [accion('Abrir compra', `/ordenes-compra-servicios/${item.id_ocs_m5}`)] : [] }));
      return { estado: filas.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, ordenesPendientes: filas };
    } catch { return { estado: 'FUENTE_NO_DISPONIBLE' as const, ordenesPendientes: [] }; }
  }

  async consultarResumenResultados(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const consultaGeneral = { ...consulta, segmento: 'TODOS' };
    const hastaYtd = new Date(periodo.hastaExclusiva); hastaYtd.setUTCDate(hastaYtd.getUTCDate() - 1);
    const consultaYtd = { desde: `${hastaYtd.getUTCFullYear()}-01-01`, hasta: fechaIso(hastaYtd) };
    const [ventas, margen, ventasYtd, margenYtd, iva, historico] = await Promise.all([
      this.consultarAnalisisVentas(consultaGeneral), this.consultarMargenProyectos(consulta),
      this.consultarAnalisisVentas(consultaYtd), this.consultarMargenProyectos(consultaYtd),
      this.consultarResumenIva(consulta),
      this.consultarHistoricoPanelGeneral({ anio: hastaYtd.getUTCFullYear(), mes: hastaYtd.getUTCMonth() + 1, meses: 12 }, ['CU219', 'CU238']),
    ]);
    const ingresos = (ventas as any).montoNeto?.valor?.porMoneda as Array<{ moneda: string; monto: number }> | undefined;
    const costos = sumarPorMoneda(((margen as any).proyectos || []).flatMap((proyecto: any) => (proyecto.desgloseCostos || []).map((costo: any) => ({ moneda: costo.moneda, monto: costo.monto }))));
    const resultado = ingresos?.flatMap(fila => {
      const costo = costos.find(item => item.moneda === fila.moneda);
      return costo ? [{ moneda: fila.moneda, ingresos: fila.monto, costosDirectos: costo.monto, resultadoGerencial: Number((fila.monto - costo.monto).toFixed(2)) }] : [];
    }) || [];
    const consolidar = (ventasFuente: any, margenFuente: any) => {
      const ventasNetas = typeof ventasFuente?.montoNeto?.valor?.totalClp === 'number' ? ventasFuente.montoNeto.valor.totalClp as number : null;
      const desglose = (margenFuente?.proyectos || []).flatMap((proyecto: any) => proyecto.desgloseCostos || []);
      const costosClp = desglose.filter((costo: any) => costo.moneda === 'CLP');
      const costoVenta = costosClp.length ? redondear(costosClp.reduce((total: number, costo: any) => total + Number(costo.monto), 0)) : null;
      return { ...calcularEstadoResultadosM7({ ventasNetas, costoVenta, gastosOperacionales: null }), costosExcluidosSinConversion: desglose.filter((costo: any) => costo.moneda !== 'CLP').length };
    };
    const estadoResultados = consolidar(ventas, margen);
    const acumuladoYtd = consolidar(ventasYtd, margenYtd);
    const serieMensual = ((historico as any).meses || []).map((mes: any) => ({ periodo: mes.periodo, ...calcularEstadoResultadosM7({ ventasNetas: mes.ventasNetas, costoVenta: mes.costosDirectos, gastosOperacionales: null }) }));
    return {
      titulo: 'Resumen gerencial de resultados', tituloEstadoResultados: 'Estado de Resultados gerencial', periodo: periodoSalida(periodo), estado: ingresos?.length ? 'PARCIALMENTE_DISPONIBLE' as const : 'DATOS_INSUFICIENTES' as const,
      estadoResultados: indicador('PARCIALMENTE_DISPONIBLE', estadoResultados, 'Ventas y costos directos netos de IVA; EBITDA no calculable mientras falte una fuente completa de gastos operacionales'),
      acumuladoYtd: indicador('PARCIALMENTE_DISPONIBLE', acumuladoYtd, `Acumulado enero–${hastaYtd.getUTCMonth() + 1} de ${hastaYtd.getUTCFullYear()}, con la misma cobertura parcial`),
      serieMensual,
      ingresos: ingresos?.length ? indicador('VALIDO', ingresos, 'Ventas definitivas netas del período') : indicador((ventas as any).montoNeto?.estado || 'DATOS_INSUFICIENTES', null, 'No hay ingresos reconstruibles para el período'),
      costosDirectos: costos.length ? indicador('VALIDO', costos, 'Costos directamente atribuidos a proyectos, sin prorrateos') : indicador('DATOS_INSUFICIENTES', null, 'No hay costos directos reconstruibles; no se reemplazan por cero'),
      gastosRegistrados: indicador('DATOS_INSUFICIENTES', null, 'No existe una fuente estructurada completa que permita separar gastos operacionales netos del período sin duplicar costos directos o pagos de caja'),
      resultadoGerencial: resultado.length ? indicador('VALIDO', resultado, 'Diferencia gerencial entre ingresos y costos directos comparables por moneda') : indicador('DATOS_INSUFICIENTES', null, 'Faltan partidas comparables para derivar un resultado'),
      iva,
      devengado: indicador('FUENTE_NO_DISPONIBLE', null, 'DEVENGADO: FUENTE/DEFINICIÓN PENDIENTE; no se deriva de ventas, OT ni proyectos'),
      cobertura: indicador('DATOS_INSUFICIENTES', { completa: false, incluye: ['ventas definitivas netas', 'costos de proyecto atribuibles', 'mano de obra atribuible validada'], noDisponibles: ['gastos operacionales clasificados sin duplicación', 'devengado'], noIncluyeEbitda: ['intereses', 'impuestos', 'depreciaciones', 'amortizaciones'], costosExcluidosSinConversion: estadoResultados.costosExcluidosSinConversion }, 'Síntesis gerencial parcial; no es un Estado de Resultados contable oficial. Los egresos de caja no se usan como gastos.'),
    };
  }

  async consultarSituacionFinanciera(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const [cxc, cxp, liquidez] = await Promise.all([this.consultarCuentasCobrar(consulta), this.consultarCuentasPagar(consulta), this.consultarLiquidez(consulta)]);
    const saldoCxc = (cxc as any).saldo;
    const saldoCxp = (cxp as any).saldo;
    return {
      titulo: 'Situación financiera resumida', periodo: periodoSalida(periodo), fechaCorte: periodo.etiquetaHasta, estado: 'DATOS_INSUFICIENTES' as const,
      disponibilidades: indicador((liquidez as any).liquidezActual?.estado || 'DATOS_INSUFICIENTES', null, 'No existe saldo bancario o de apertura inequívoco'),
      cuentasPorCobrar: saldoCxc?.valor !== null && saldoCxc?.valor !== undefined ? indicador(saldoCxc.estado, saldoCxc.valor, 'Saldo vigente reconstruido desde cuentas por cobrar') : indicador('DATOS_INSUFICIENTES', null, 'Cuentas por cobrar no disponibles'),
      cuentasPorPagar: saldoCxp?.valor !== null && saldoCxp?.valor !== undefined ? indicador(saldoCxp.estado, saldoCxp.valor, 'Saldo vigente reconstruido desde cuentas por pagar') : indicador('DATOS_INSUFICIENTES', null, 'Cuentas por pagar no disponibles'),
      patrimonio: indicador('NO_APLICA', null, 'No existe una definición funcional que autorice derivar patrimonio como diferencia'),
      cobertura: indicador('DATOS_INSUFICIENTES', { completa: false, incluidas: ['Cuentas por cobrar', 'Cuentas por pagar'], noDisponibles: ['Disponibilidades', 'Patrimonio', 'Activos fijos', 'Inventario valorizado', 'Provisiones'] }, 'Síntesis gerencial reconstruible; no es un Balance General ni un estado financiero formal'),
    };
  }

  async descargarExcelVentas(entrada: Record<string, unknown>, permisos: string[]) {
    if (!permisos.includes('CU245')) throw new ErrorAplicacion(403, 'No tienes permiso para exportar información del Dashboard');
    const tipo = String(entrada.tipo || '').trim().toUpperCase() as TipoInformeVentasExcelM7;
    if (tipo !== 'VENTAS' && tipo !== 'COTIZACIONES') throw new ErrorAplicacion(400, 'Tipo de exportación inválido');
    const permisosLectura = tipo === 'VENTAS' ? ['CU219', 'CU220'] : ['CU218', 'CU220'];
    if (!permisosLectura.every(permiso => permisos.includes(permiso))) throw new ErrorAplicacion(403, 'No tienes permiso para consultar el detalle solicitado');

    const consulta = entrada.consulta && typeof entrada.consulta === 'object' && !Array.isArray(entrada.consulta) ? entrada.consulta as Consulta : {};
    const periodo = resolverPeriodoM7(consulta);
    const segmento = resolverSegmentoComercialM7(consulta.segmento);
    const generadoEn = new Date();
    const periodoArchivo = `${periodo.etiquetaDesde}_${periodo.etiquetaHasta}`;
    const nombreArchivo = `PuertasBlindadas_${tipo === 'VENTAS' ? 'Ventas' : 'Cotizaciones'}_${periodoArchivo}_${segmento}.xlsx`.replace(/[^A-Za-z0-9_.-]+/g, '_');
    const includeCliente = { include: { cliente_financiero: { include: { tipo_cliente_financiero: true } } } } as const;

    let filas: FilaVentaExcelM7[] | FilaCotizacionExcelM7[];
    if (tipo === 'VENTAS') {
      const notas = await prisma.nota_venta.findMany({
        where: { fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_nota_venta: { in: estadosVentaDefinitiva } },
        include: {
          moneda: true,
          ficha_cliente: includeCliente,
          cotizacion: { include: { detalle_cotizacion: { include: { item_comercial: true }, orderBy: { id_detalle_cotizacion: 'asc' } } } },
          proyecto_contexto: true,
          proyecto_financiero: { select: { id_proyecto_financiero: true, codigo_proyecto_financiero: true } },
        },
        orderBy: [{ fecha_emision: 'asc' }, { id_nota_venta: 'asc' }],
      });
      const ventas: FilaVentaExcelM7[] = [];
      for (const nota of notas.filter(fila => perteneceSegmentoM7(fila.ficha_cliente.cliente_financiero, segmento))) {
        const cliente = nota.ficha_cliente.cliente_financiero;
        const detalles = (nota.cotizacion?.detalle_cotizacion || []).map(detalle => ({
          detalle,
          producto: detalle.item_comercial.nombre_item,
          segmento: nombreSegmentoClienteM7(cliente),
          cantidad: Number(detalle.cantidad_item),
          subtotal: Number(detalle.subtotal_item_estimado),
        }));
        const detallesProrrateables = detalles.filter(detalle => detalle.producto.trim() && detalle.cantidad > 0);
        const montoOriginal = Number(nota.monto_neto);
        const montoClp = convertirVentaClpM7(montoOriginal, nota.moneda.codigo_moneda, nota.tipo_cambio_usado ? Number(nota.tipo_cambio_usado) : null);
        const prorrateoOriginal = distribuirVentaPorProductoM7(montoOriginal, detallesProrrateables);
        const prorrateoClp = distribuirVentaPorProductoM7(montoClp, detallesProrrateables);
        const asignaciones = new Map(detallesProrrateables.map((detalle, indice) => [detalle.detalle.id_detalle_cotizacion, { original: prorrateoOriginal[indice].ventaNetaClp, clp: prorrateoClp[indice].ventaNetaClp }]));
        const proyecto = nota.proyecto_contexto
          ? { id: nota.proyecto_contexto.proyecto_proyecto_id.toString(), codigo: nota.proyecto_contexto.proyecto_codigo_proyecto || '' }
          : nota.proyecto_financiero.length === 1
            ? { id: nota.proyecto_financiero[0].id_proyecto_financiero, codigo: nota.proyecto_financiero[0].codigo_proyecto_financiero }
            : { id: null, codigo: '' };
        for (let indice = 0; indice < detalles.length; indice += 1) {
          const detalle = detalles[indice].detalle;
          const asignacion = asignaciones.get(detalle.id_detalle_cotizacion);
          ventas.push({
            fechaVenta: nota.fecha_emision,
            idNotaVenta: nota.id_nota_venta,
            numeroNotaVenta: nota.numero_nota_venta,
            idCotizacion: nota.id_cotizacion,
            cliente: cliente.nombre_razon_social_referencia,
            rutCliente: cliente.rut_cliente || '',
            segmento: nombreSegmentoClienteM7(cliente) || 'SIN_CLASIFICAR',
            producto: detalles[indice].producto.trim(),
            descripcion: detalle.descripcion_item_cotizado || detalle.item_comercial.descripcion_item || detalle.item_comercial.nombre_item,
            cantidad: detalles[indice].cantidad,
            moneda: nota.moneda.codigo_moneda,
            ventaNetaOriginalItem: asignacion?.original ?? null,
            tipoCambioHistorico: nota.moneda.codigo_moneda === 'CLP' ? null : nota.tipo_cambio_usado && Number(nota.tipo_cambio_usado) > 0 ? Number(nota.tipo_cambio_usado) : null,
            ventaNetaClpItem: asignacion?.clp ?? null,
            ventaNetaOriginalNota: montoOriginal,
            estadoNotaVenta: nota.estado_nota_venta,
            idProyecto: proyecto.id,
            codigoProyecto: proyecto.codigo,
          });
        }
      }
      filas = ventas;
    } else {
      const cotizaciones = await prisma.cotizacion.findMany({
        where: { fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva } },
        include: {
          moneda: true,
          ficha_cliente: includeCliente,
          nota_venta: { select: { id_nota_venta: true } },
          detalle_cotizacion: { include: { item_comercial: true }, orderBy: { id_detalle_cotizacion: 'asc' } },
        },
        orderBy: [{ fecha_emision: 'asc' }, { id_cotizacion: 'asc' }],
      });
      filas = cotizaciones
        .filter(cotizacion => perteneceSegmentoM7(cotizacion.ficha_cliente.cliente_financiero, segmento))
        .flatMap(cotizacion => cotizacion.detalle_cotizacion.map(detalle => {
          const cliente = cotizacion.ficha_cliente.cliente_financiero;
          const cantidad = Number(detalle.cantidad_item);
          const subtotal = Number(detalle.subtotal_item_estimado);
          return {
            fechaEmision: cotizacion.fecha_emision,
            idCotizacion: cotizacion.id_cotizacion,
            cliente: cliente.nombre_razon_social_referencia,
            rutCliente: cliente.rut_cliente || '',
            segmento: nombreSegmentoClienteM7(cliente) || 'SIN_CLASIFICAR',
            producto: detalle.item_comercial.nombre_item,
            descripcion: detalle.descripcion_item_cotizado || detalle.item_comercial.descripcion_item || detalle.item_comercial.nombre_item,
            cantidad,
            valorUnitario: cantidad > 0 ? redondear(subtotal / cantidad) : null,
            subtotalDetalle: subtotal,
            moneda: cotizacion.moneda.codigo_moneda,
            montoNetoCotizacion: cotizacion.monto_neto === null ? null : Number(cotizacion.monto_neto),
            montoIvaCotizacion: cotizacion.monto_impuesto === null ? null : Number(cotizacion.monto_impuesto),
            montoTotalCotizacion: cotizacion.monto_total_estimado === null ? null : Number(cotizacion.monto_total_estimado),
            estadoCotizacion: cotizacion.estado_cotizacion,
            fechaVigencia: cotizacion.fecha_vigencia,
            convertidaNotaVenta: cotizacion.nota_venta ? 'Sí' : 'No',
            idNotaVenta: cotizacion.nota_venta?.id_nota_venta || null,
          } satisfies FilaCotizacionExcelM7;
        }));
    }

    const resultado = await crearInformeVentasExcelM7({
      tipo,
      periodo: `${periodo.etiquetaDesde} al ${periodo.etiquetaHasta}`,
      segmento,
      generadoEn,
      filas,
      nombreArchivo,
    });
    Object.defineProperty(resultado, '__auditoriaM9', { enumerable: false, value: { nuevo: { tipo, periodo: periodoSalida(periodo), segmento, filas: filas.length } } });
    return resultado;
  }

  async descargarPdfContextual(entrada: Record<string, unknown>, permisos: string[]) {
    if (!permisos.includes('CU245')) throw new ErrorAplicacion(403, 'No tienes permiso para descargar PDF de Dashboard');
    const origen = String(entrada.origen || '');
    const consulta = entrada.consulta && typeof entrada.consulta === 'object' && !Array.isArray(entrada.consulta) ? entrada.consulta as Consulta : {};
    const fuentes: Record<string, { permisos: string[]; titulo: string; cargar: () => Promise<unknown> }> = {
      panel: { permisos: ['CU215'], titulo: 'Panel General', cargar: () => this.consultarPanelGeneral(consulta, permisos) },
      ventas: { permisos: ['CU219', 'CU220'], titulo: 'Análisis de Ventas', cargar: () => this.consultarAnalisisVentas(consulta, permisos) },
      'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) },
      'cuentas-pagar': { permisos: ['CU226', 'CU227'], titulo: 'Cuentas por Pagar', cargar: () => this.consultarCuentasPagar(consulta, permisos) },
      liquidez: { permisos: ['CU230', 'CU231'], titulo: 'Liquidez y Flujo', cargar: () => this.consultarLiquidez(consulta, permisos) },
      margen: { permisos: ['CU233', 'CU234', 'CU235'], titulo: 'Margen Directo y Costos por Proyecto', cargar: () => this.consultarMargenProyectos(consulta, permisos) },
      resultados: { permisos: ['CU238'], titulo: 'Resumen gerencial de resultados', cargar: () => this.consultarResumenResultados(consulta) },
      situacion: { permisos: ['CU239'], titulo: 'Situación financiera resumida', cargar: () => this.consultarSituacionFinanciera(consulta) },
    };
    const fuente = fuentes[origen];
    if (!fuente) throw new ErrorAplicacion(400, 'Origen de Dashboard inválido');
    if (!fuente.permisos.some(permiso => permisos.includes(permiso))) throw new ErrorAplicacion(403, 'No tienes permiso para consultar el análisis de origen');
    const datos = await fuente.cargar();
    const periodo = resolverPeriodoM7(consulta);
    const generado = new Date();
    const etiquetasFiltro: Record<string, string> = { anio: 'Año', mes: 'Mes', desde: 'Desde', hasta: 'Hasta' };
    const filtros = Object.entries(consulta)
      .filter(([clave]) => clave in etiquetasFiltro)
      .map(([clave, valor]) => `${etiquetasFiltro[clave]}: ${String(valor)}`)
      .join(' | ') || 'Período vigente de la consulta';
    const historico = ['panel', 'ventas', 'liquidez'].includes(origen) ? await this.consultarHistoricoPanelGeneral({ ...consulta, meses: 12 }, permisos) : undefined;
    return crearInformeDashboardM7({ origen, tituloContextual: fuente.titulo, periodo, filtros, generadoEn: generado, datos, panel: origen === 'panel' ? datos : undefined, historico });
  }
}
