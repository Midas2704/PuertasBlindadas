import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { calcularNota, efectoPago, fechaNegocio, incluirNota } from '../utilidades/finanzas';

type Consulta = Record<string, unknown>;
export type EstadoIndicadorM7 = 'VALIDO' | 'DATOS_INSUFICIENTES' | 'FUENTE_NO_DISPONIBLE' | 'DESACTUALIZADO' | 'NO_APLICA' | 'CONFIGURACION_PENDIENTE';

type Periodo = { desde: Date; hastaExclusiva: Date; anteriorDesde: Date; anteriorHastaExclusiva: Date; etiquetaDesde: string; etiquetaHasta: string };
const estadosVentaDefinitiva = ['confirmada', 'cerrada'];
const retiradosCxC = ['anulada', 'revertida', 'revertida_total', 'provisional'];

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

const indicador = <T>(estado: EstadoIndicadorM7, valor: T | null, detalle: string, actualizadoEn: Date | null = new Date()) => ({ estado, valor, detalle, actualizadoEn });
const agruparMonto = (filas: Array<{ moneda: string; monto: number }>) => [...filas.reduce((mapa, fila) => mapa.set(fila.moneda, (mapa.get(fila.moneda) || 0) + fila.monto), new Map<string, number>())].map(([moneda, monto]) => ({ moneda, monto }));
const periodoSalida = (periodo: Periodo) => ({ desde: periodo.etiquetaDesde, hasta: periodo.etiquetaHasta });

export class M7Controller {
  async consultarPanelGeneral(consulta: Consulta, permisos: string[]) {
    const periodo = resolverPeriodoM7(consulta);
    const definiciones = [
      ['ventas', 'CU216', () => this.consultarAnalisisVentas(consulta)],
      ['cuentasCobrar', 'CU217', () => this.consultarCuentasCobrar(consulta)],
      ['cuentasPagar', 'CU218', () => this.consultarCuentasPagar(consulta)],
      ['liquidez', 'CU219', () => this.consultarLiquidez(consulta)],
    ] as const;
    const visibles = definiciones.filter(([, permiso]) => permisos.includes(permiso));
    const resultados = await Promise.all(visibles.map(async ([clave, permiso, cargar]) => {
      try { return [clave, { permiso, ...(await cargar()) }] as const; }
      catch { return [clave, { permiso, periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const }] as const; }
    }));
    return { periodo: periodoSalida(periodo), bloques: Object.fromEntries(resultados), bloquesOcultos: definiciones.filter(([, permiso]) => !permisos.includes(permiso)).map(([clave]) => clave) };
  }

  async consultarAnalisisVentas(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const incluir = { moneda: true, ficha_cliente: { include: { cliente_financiero: { include: { tipo_cliente_financiero: true } } } }, cotizacion: { include: { detalle_cotizacion: { include: { item_comercial: true } } } } } as const;
      const [actuales, anteriores] = await Promise.all([
        prisma.nota_venta.findMany({ where: { fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_nota_venta: { in: estadosVentaDefinitiva } }, include: incluir, orderBy: { fecha_emision: 'asc' } }),
        prisma.nota_venta.findMany({ where: { fecha_emision: { gte: periodo.anteriorDesde, lt: periodo.anteriorHastaExclusiva }, estado_nota_venta: { in: estadosVentaDefinitiva } }, include: incluir }),
      ]);
      if (!actuales.length) return { periodo: periodoSalida(periodo), estado: 'DATOS_INSUFICIENTES' as const, montoNeto: indicador('DATOS_INSUFICIENTES', null, 'No existen ventas definitivas en el período'), cantidad: indicador('DATOS_INSUFICIENTES', null, 'Sin base para contar ventas'), evolucion: [], clientes: [], tiposCliente: [], productos: indicador('DATOS_INSUFICIENTES', null, 'Sin detalle comercial fiable'), comparacion: indicador('NO_APLICA', null, 'No existe base actual para comparar') };
      const filas = actuales.map(nota => ({ moneda: nota.moneda.codigo_moneda, monto: Number(nota.monto_neto), nota }));
      const porMoneda = agruparMonto(filas);
      const convertir = (nota: typeof actuales[number]) => nota.moneda.codigo_moneda === 'CLP' ? nota.monto_neto : nota.tipo_cambio_usado?.gt(0) ? nota.monto_neto.mul(nota.tipo_cambio_usado) : null;
      const convertidos = actuales.map(convertir);
      let totalClp: number | null = 0;
      for (const monto of convertidos) totalClp = monto && totalClp !== null ? new Prisma.Decimal(totalClp).plus(monto).toDecimalPlaces(2).toNumber() : null;
      const totalAnterior = anteriores.map(convertir as (nota: typeof anteriores[number]) => Prisma.Decimal | null);
      let anteriorClp: number | null = 0;
      for (const monto of totalAnterior) anteriorClp = monto && anteriorClp !== null ? new Prisma.Decimal(anteriorClp).plus(monto).toDecimalPlaces(2).toNumber() : null;
      const comparacion = anteriorClp === 0 ? indicador('NO_APLICA', null, 'El período anterior tiene base cero') : totalClp === null || anteriorClp === null ? indicador('DATOS_INSUFICIENTES', null, 'Falta conversión histórica para comparar monedas') : indicador('VALIDO', { anteriorClp, actualClp: totalClp, variacionPorcentual: Number((((totalClp - anteriorClp) / anteriorClp) * 100).toFixed(2)) }, 'Comparación contra un período inmediatamente anterior de igual duración');
      const agrupar = (clave: (nota: typeof actuales[number]) => string) => [...actuales.reduce((mapa, nota) => { const llave = clave(nota); mapa.set(llave, (mapa.get(llave) || 0) + Number(nota.monto_neto)); return mapa; }, new Map<string, number>())].map(([nombre, montoNeto]) => ({ nombre, montoNeto }));
      const detalles = actuales.flatMap(nota => nota.cotizacion?.detalle_cotizacion.map(detalle => ({ nombre: detalle.item_comercial.nombre_item, tipo: detalle.item_comercial.tipo_item || 'Sin tipo', monto: Number(detalle.subtotal_item_estimado) })) || []);
      return {
        periodo: periodoSalida(periodo), estado: 'VALIDO' as const,
        montoNeto: totalClp === null ? indicador('DATOS_INSUFICIENTES', { porMoneda, totalClp: null }, 'Montos por moneda disponibles; falta conversión histórica para consolidar CLP') : indicador('VALIDO', { porMoneda, totalClp }, 'Monto neto de ventas confirmadas o cerradas'),
        cantidad: indicador('VALIDO', actuales.length, 'Ventas definitivas del período'),
        evolucion: agrupar(nota => fechaIso(nota.fecha_emision)),
        clientes: agrupar(nota => nota.ficha_cliente.cliente_financiero.nombre_razon_social_referencia),
        tiposCliente: agrupar(nota => nota.ficha_cliente.cliente_financiero.tipo_cliente_financiero.nombre_tipo_cliente_financiero),
        productos: detalles.length ? indicador('VALIDO', agruparMonto(detalles.map(d => ({ moneda: d.tipo, monto: d.monto }))).map(d => ({ tipo: d.moneda, montoNeto: d.monto })), 'Sólo detalle estructurado de cotizaciones') : indicador('DATOS_INSUFICIENTES', null, 'Las ventas del período no tienen detalle estructurado fiable'),
        comparacion,
      };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, montoNeto: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), cantidad: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), evolucion: [], clientes: [], tiposCliente: [], productos: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), comparacion: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible') };
    }
  }

  async consultarCuentasCobrar(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const notas = await prisma.nota_venta.findMany({ where: { estado_nota_venta: { notIn: retiradosCxC } }, include: { ...incluirNota, ficha_cliente: { include: { cliente_financiero: true } }, hito_cobro: true } });
      if (!notas.length) return { periodo: periodoSalida(periodo), estado: 'DATOS_INSUFICIENTES' as const, saldo: indicador('DATOS_INSUFICIENTES', null, 'No existen cuentas por cobrar vigentes'), morosidad: indicador('DATOS_INSUFICIENTES', null, 'Sin base de obligaciones'), recaudacion: indicador('DATOS_INSUFICIENTES', null, 'Sin pagos asociados'), compromisosFuturos: indicador('NO_APLICA', [], 'No existen compromisos futuros') };
      const calculadas = notas.map(nota => ({ nota, calculo: calcularNota(nota) }));
      const saldos = agruparMonto(calculadas.filter(x => x.calculo.saldoPendiente > 0).map(x => ({ moneda: x.nota.moneda.codigo_moneda, monto: x.calculo.saldoPendiente })));
      const morosas = calculadas.filter(x => x.calculo.esMorosa && x.calculo.saldoPendiente > 0);
      const pagos = new Map<number, { moneda: string; monto: number }>();
      for (const { nota } of calculadas) for (const asignacion of nota.asignacion_pago_cliente) { const pago = asignacion.pago_cliente; if (pago.fecha_pago >= periodo.desde && pago.fecha_pago < periodo.hastaExclusiva) pagos.set(pago.id_pago_cliente, { moneda: pago.moneda.codigo_moneda, monto: efectoPago(pago).toNumber() }); }
      const compromisos = calculadas.filter(x => x.calculo.saldoPendiente > 0 && x.nota.fecha_vencimiento && x.nota.fecha_vencimiento >= periodo.hastaExclusiva).map(x => ({ idNota: x.nota.id_nota_venta, cliente: x.nota.ficha_cliente.cliente_financiero.nombre_razon_social_referencia, fecha: fechaIso(x.nota.fecha_vencimiento!), moneda: x.nota.moneda.codigo_moneda, monto: x.calculo.saldoPendiente }));
      return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, saldo: indicador('VALIDO', saldos, 'Saldo vigente calculado con la fórmula propietaria M3'), morosidad: indicador('VALIDO', { cantidad: morosas.length, porMoneda: agruparMonto(morosas.map(x => ({ moneda: x.nota.moneda.codigo_moneda, monto: x.calculo.saldoPendiente }))) }, 'Obligaciones vencidas con saldo'), recaudacion: pagos.size ? indicador('VALIDO', agruparMonto([...pagos.values()]), 'Pagos efectivos recibidos en el período') : indicador('DATOS_INSUFICIENTES', null, 'No existen pagos efectivos en el período'), compromisosFuturos: compromisos.length ? indicador('VALIDO', compromisos, 'Saldos con vencimiento posterior al período') : indicador('NO_APLICA', [], 'No existen compromisos futuros con fecha válida') };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, saldo: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), morosidad: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), recaudacion: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), compromisosFuturos: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible') };
    }
  }

  async consultarCuentasPagar(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const [obligaciones, monedas, proveedores] = await Promise.all([prisma.obligacion_proveedor_m5.findMany(), prisma.moneda.findMany(), prisma.proveedor.findMany()]);
      if (!obligaciones.length) return { periodo: periodoSalida(periodo), estado: 'DATOS_INSUFICIENTES' as const, saldo: indicador('DATOS_INSUFICIENTES', null, 'No existen obligaciones M5'), estados: indicador('DATOS_INSUFICIENTES', null, 'Sin obligaciones que clasificar'), proveedores: [], categorias: indicador('DATOS_INSUFICIENTES', null, 'Sin documentos clasificados'), compromisosFuturos: indicador('NO_APLICA', [], 'No existen compromisos futuros') };
      const asociaciones = await prisma.asociacion_documento_oc_m5.findMany({ where: { id_documento_m5: { in: obligaciones.map(o => o.id_documento_m5) } } });
      const clasificaciones = await prisma.clasificacion_asociacion_m5.findMany({ where: { id_asociacion_m5: { in: asociaciones.map(a => a.id_asociacion_m5) } } });
      const codigos = new Map(monedas.map(m => [m.id_moneda, m.codigo_moneda])); const nombres = new Map(proveedores.map(p => [p.id_proveedor, p.nombre_razon_social]));
      const documentoPorAsociacion = new Map(asociaciones.map(a => [a.id_asociacion_m5, a.id_documento_m5]));
      const clasificacionesPorDocumento = new Map<number, typeof clasificaciones>();
      for (const clasificacion of clasificaciones) { const idDocumento = documentoPorAsociacion.get(clasificacion.id_asociacion_m5); if (idDocumento) clasificacionesPorDocumento.set(idDocumento, [...(clasificacionesPorDocumento.get(idDocumento) || []), clasificacion]); }
      const vigentes = obligaciones.filter(o => o.saldo_actual.gt(0)).map(o => ({ id: o.id_obligacion_m5, idDocumento: o.id_documento_m5, proveedor: nombres.get(o.id_proveedor) || 'Proveedor no disponible', moneda: codigos.get(o.id_moneda) || 'N/D', saldo: Number(o.saldo_actual), fechaVencimiento: fechaIso(o.fecha_vencimiento), estadoPago: o.estado_pago, condicionTemporal: o.condicion_temporal }));
      const porProveedor = [...vigentes.reduce((mapa, fila) => { const clave = `${fila.proveedor}|${fila.moneda}`; mapa.set(clave, (mapa.get(clave) || 0) + fila.saldo); return mapa; }, new Map<string, number>())].map(([clave, saldo]) => { const [proveedor, moneda] = clave.split('|'); return { proveedor, moneda, saldo }; });
      const estados = [...vigentes.reduce((mapa, fila) => mapa.set(fila.condicionTemporal || 'Sin clasificación', (mapa.get(fila.condicionTemporal || 'Sin clasificación') || 0) + 1), new Map<string, number>())].map(([estado, cantidad]) => ({ estado, cantidad }));
      const categorias = [...vigentes.reduce((mapa, fila) => { const detalles = clasificacionesPorDocumento.get(fila.idDocumento) || []; const totalClasificado = detalles.reduce((suma, detalle) => suma + Number(detalle.monto), 0); for (const detalle of detalles) { const categoria = detalle.nombre_categoria_snapshot || 'Categoría sin nombre'; const saldo = totalClasificado > 0 ? fila.saldo * Number(detalle.monto) / totalClasificado : 0; mapa.set(`${categoria}|${fila.moneda}`, (mapa.get(`${categoria}|${fila.moneda}`) || 0) + saldo); } return mapa; }, new Map<string, number>())].map(([clave, saldo]) => { const [categoria, moneda] = clave.split('|'); return { categoria, moneda, saldo: Number(saldo.toFixed(2)) }; });
      const futuros = vigentes.filter(fila => new Date(`${fila.fechaVencimiento}T00:00:00Z`) >= periodo.hastaExclusiva);
      return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, saldo: vigentes.length ? indicador('VALIDO', agruparMonto(vigentes.map(f => ({ moneda: f.moneda, monto: f.saldo }))), 'Saldo actual de obligaciones M5') : indicador('NO_APLICA', [], 'No existen saldos pendientes'), estados: indicador('VALIDO', estados, 'Estados derivados con reglas M5'), proveedores: porProveedor, categorias: categorias.length ? indicador('VALIDO', categorias, 'Distribución proporcional basada en clasificaciones M5 confirmadas') : indicador('DATOS_INSUFICIENTES', null, 'Las obligaciones vigentes no tienen clasificación M5 fiable'), compromisosFuturos: futuros.length ? indicador('VALIDO', futuros, 'Obligaciones con monto y vencimiento posterior al período') : indicador('NO_APLICA', [], 'No existen compromisos futuros') };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, saldo: indicador('FUENTE_NO_DISPONIBLE', null, 'M5 no está disponible'), estados: indicador('FUENTE_NO_DISPONIBLE', null, 'M5 no está disponible'), proveedores: [], categorias: indicador('FUENTE_NO_DISPONIBLE', null, 'M5 no está disponible'), compromisosFuturos: indicador('FUENTE_NO_DISPONIBLE', null, 'M5 no está disponible') };
    }
  }

  async consultarLiquidez(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const liquidezActual = indicador('CONFIGURACION_PENDIENTE', null, 'No existe una fuente inequívoca de saldo de apertura o saldo bancario actual');
    let flujoHistorico;
    try {
      const movimientos = await prisma.movimiento_financiero.findMany({ where: { fecha_movimiento: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_movimiento: { notIn: ['anulado', 'rechazado'] } }, include: { moneda: true }, orderBy: { fecha_movimiento: 'asc' } });
      flujoHistorico = movimientos.length ? indicador('VALIDO', agruparMonto(movimientos.map(m => ({ moneda: `${m.moneda.codigo_moneda}:${m.naturaleza_movimiento}`, monto: Number(m.monto_movimiento) }))).map(f => { const [moneda, naturaleza] = f.moneda.split(':'); return { moneda, naturaleza, monto: f.monto }; }), 'Movimientos financieros registrados en el período') : indicador('DATOS_INSUFICIENTES', null, 'No existen movimientos financieros registrados en el período');
    } catch { flujoHistorico = indicador('FUENTE_NO_DISPONIBLE', null, 'La fuente de movimientos financieros no está disponible'); }
    try {
      const [cxc, cxp] = await Promise.all([this.consultarCuentasCobrar(consulta), this.consultarCuentasPagar(consulta)]);
      const ingresos = cxc.compromisosFuturos.estado === 'VALIDO' ? cxc.compromisosFuturos.valor : [];
      const egresos = cxp.compromisosFuturos.estado === 'VALIDO' ? cxp.compromisosFuturos.valor : [];
      const proyeccion = (ingresos?.length || egresos?.length) ? indicador('VALIDO', { ingresos, egresos }, 'Proyección basada sólo en compromisos con monto y fecha válidos') : indicador('NO_APLICA', { ingresos: [], egresos: [] }, 'No existen compromisos fechados para proyectar');
      return { periodo: periodoSalida(periodo), estado: flujoHistorico.estado === 'FUENTE_NO_DISPONIBLE' ? 'FUENTE_NO_DISPONIBLE' as const : 'CONFIGURACION_PENDIENTE' as const, liquidezActual, flujoHistorico, proyeccion, capaEstimada: indicador('NO_APLICA', null, 'No existe una estimación propietaria con base, fecha y monto válidos') };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, liquidezActual, flujoHistorico, proyeccion: indicador('FUENTE_NO_DISPONIBLE', null, 'No fue posible consultar compromisos futuros'), capaEstimada: indicador('NO_APLICA', null, 'No existe una estimación propietaria válida') };
    }
  }
}
