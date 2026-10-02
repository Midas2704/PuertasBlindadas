import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { calcularNota, efectoPago, fechaNegocio, incluirNota } from '../utilidades/finanzas';
import { archivoPdf } from '../utilidades/pdf';

type Consulta = Record<string, unknown>;
export type EstadoIndicadorM7 = 'VALIDO' | 'SIN_RESULTADOS' | 'DATOS_INSUFICIENTES' | 'FUENTE_NO_DISPONIBLE' | 'DESACTUALIZADO' | 'PARCIALMENTE_DISPONIBLE' | 'SIN_PERMISO' | 'ERROR_CALCULO' | 'NO_APLICA' | 'CONFIGURACION_PENDIENTE';

type Periodo = { desde: Date; hastaExclusiva: Date; anteriorDesde: Date; anteriorHastaExclusiva: Date; etiquetaDesde: string; etiquetaHasta: string };
const estadosVentaDefinitiva = ['confirmada', 'cerrada'];
const retiradosCxC = ['anulada', 'revertida', 'revertida_total', 'provisional'];
const codigoUmbralMargen = 'M7_MARGEN_CRITICO';
const tipoUmbralMargen = 'DASHBOARD';
const unidadUmbralMargen = 'PORCENTAJE';

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
const lineasPdf = (valor: unknown, prefijo = '', profundidad = 0): string[] => {
  if (profundidad > 4) return [`${prefijo}: detalle disponible en pantalla`];
  if (valor === null || valor === undefined) return [`${prefijo}: No disponible`];
  if (typeof valor !== 'object') return [`${prefijo}: ${String(valor)}`];
  if (Array.isArray(valor)) {
    if (!valor.length) return [`${prefijo}: Sin registros`];
    return valor.slice(0, 40).flatMap((item, indice) => lineasPdf(item, `${prefijo} ${indice + 1}`.trim(), profundidad + 1));
  }
  return Object.entries(valor as Record<string, unknown>)
    .filter(([clave]) => clave !== 'actualizadoEn' && clave !== 'permiso')
    .flatMap(([clave, contenido]) => lineasPdf(contenido, prefijo ? `${prefijo} / ${clave}` : clave, profundidad + 1));
};

export class M7Controller {
  async consultarPanelGeneral(consulta: Consulta, permisos: string[]) {
    const periodo = resolverPeriodoM7(consulta);
    const definiciones = [
      ['centroAtencion', ['CU216'], () => this.consultarCentroAtencion(consulta, permisos)],
      ['cotizacionesPendientes', ['CU217'], () => this.consultarCotizacionesPendientes(consulta)],
      ['ventas', ['CU219', 'CU220'], () => this.consultarAnalisisVentas(consulta, permisos)],
      ['cuentasCobrar', ['CU222', 'CU223', 'CU225'], () => this.consultarCuentasCobrar(consulta, permisos)],
      ['cuentasPagar', ['CU226', 'CU227'], () => this.consultarCuentasPagar(consulta, permisos)],
      ['liquidez', ['CU230', 'CU231'], () => this.consultarLiquidez(consulta, permisos)],
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
    ] as const;
    const visibles = definiciones.filter(([, requeridos]) => requeridos.some(permiso => permisos.includes(permiso)));
    const resultados = await Promise.all(visibles.map(async ([clave, requeridos, cargar]) => {
      try { return [clave, { permisos: requeridos.filter(permiso => permisos.includes(permiso)), ...(await cargar()) }] as const; }
      catch { return [clave, { permisos: requeridos.filter(permiso => permisos.includes(permiso)), periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const }] as const; }
    }));
    return { periodo: periodoSalida(periodo), bloques: Object.fromEntries(resultados), bloquesOcultos: definiciones.filter(([, requeridos]) => !requeridos.some(permiso => permisos.includes(permiso))).map(([clave]) => clave) };
  }

  async consultarCentroAtencion(consulta: Consulta, permisos: string[]) {
    const periodo = resolverPeriodoM7(consulta);
    const excepciones: Array<Record<string, unknown>> = [];
    const cobertura: Array<{ familia: string; estado: EstadoIndicadorM7; detalle: string }> = [];
    const familias: Array<{ familia: string; permiso: string; cargar: () => Promise<void> }> = [
      {
        familia: 'CUENTAS_POR_COBRAR', permiso: 'CU222', cargar: async () => {
          const datos = await this.consultarCuentasCobrarCompleto(consulta);
          if (datos.morosidad.estado === 'FUENTE_NO_DISPONIBLE') throw new Error('CxC no disponible');
          const valor = datos.morosidad.valor as { cantidad: number; porMoneda: Array<{ moneda: string; monto: number }> } | null;
          if (valor?.cantidad) excepciones.push({ familia: 'CUENTAS_POR_COBRAR', ocurrio: 'Existen cuentas por cobrar vencidas con saldo', magnitud: valor, calidad: datos.morosidad.estado, destino: `/dashboard-m7/cuentas-cobrar?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`, origen: 'M3' });
          cobertura.push({ familia: 'CUENTAS_POR_COBRAR', estado: datos.morosidad.estado, detalle: datos.morosidad.detalle });
        },
      },
      {
        familia: 'CUENTAS_POR_PAGAR', permiso: 'CU226', cargar: async () => {
          const datos = await this.consultarCuentasPagarCompleto(consulta);
          if (datos.estados.estado === 'FUENTE_NO_DISPONIBLE') throw new Error('CxP no disponible');
          const estados = (datos.estados.valor || []) as Array<{ estado: string; cantidad: number }>;
          const vencidas = estados.filter(fila => /vencid/i.test(fila.estado)).reduce((total, fila) => total + fila.cantidad, 0);
          if (vencidas) excepciones.push({ familia: 'CUENTAS_POR_PAGAR', ocurrio: 'Existen obligaciones de proveedor vencidas', magnitud: { cantidad: vencidas }, calidad: datos.estados.estado, destino: `/dashboard-m7/cuentas-pagar?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`, origen: 'M5' });
          cobertura.push({ familia: 'CUENTAS_POR_PAGAR', estado: datos.estados.estado, detalle: datos.estados.detalle });
        },
      },
      {
        familia: 'MARGEN_PROYECTO', permiso: 'CU233', cargar: async () => {
          const datos = await this.consultarMargenProyectosCompleto(consulta);
          if (datos.estado === 'FUENTE_NO_DISPONIBLE') throw new Error('Margen no disponible');
          for (const proyecto of datos.proyectos.filter(fila => ['PERDIDA', 'MARGEN_CRITICO'].includes(fila.clasificacion))) excepciones.push({ familia: 'MARGEN_PROYECTO', ocurrio: proyecto.clasificacion === 'PERDIDA' ? 'Proyecto con margen directo negativo' : 'Proyecto bajo el umbral de margen configurado', magnitud: { idProyecto: proyecto.idProyecto, codigo: proyecto.codigo, moneda: proyecto.moneda, margenDirecto: proyecto.margenDirecto, porcentajeMargen: proyecto.porcentajeMargen }, calidad: proyecto.estado, destino: `/dashboard-m7/margen-proyectos?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`, origen: 'M2/M5/M6' });
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
    ];
    const autorizadas = familias.filter(familia => permisos.includes(familia.permiso));
    for (const familia of autorizadas) {
      try { await familia.cargar(); }
      catch { cobertura.push({ familia: familia.familia, estado: 'FUENTE_NO_DISPONIBLE', detalle: 'La fuente de esta familia no está disponible' }); }
    }
    const fuentesCaidas = cobertura.some(familia => familia.estado === 'FUENTE_NO_DISPONIBLE');
    return { periodo: periodoSalida(periodo), estado: fuentesCaidas ? 'PARCIALMENTE_DISPONIBLE' as const : excepciones.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, excepciones, cobertura, criterioOrden: 'Familia y magnitud objetiva; no existe score ni recomendación automática' };
  }

  async consultarCotizacionesPendientes(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const hoy = new Date(`${fechaNegocio()}T00:00:00Z`);
    try {
      const cotizaciones = await prisma.cotizacion.findMany({
        where: { estado_cotizacion: 'emitida', fecha_vigencia: { gte: hoy }, fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva }, nota_venta: null },
        include: { moneda: true, ficha_cliente: { include: { cliente_financiero: true } } },
        orderBy: [{ fecha_vigencia: 'asc' }, { id_cotizacion: 'asc' }],
      });
      const filas = cotizaciones.map(cotizacion => ({ idCotizacion: cotizacion.id_cotizacion, idCliente: cotizacion.ficha_cliente.cliente_financiero.id_cliente_financiero, cliente: cotizacion.ficha_cliente.cliente_financiero.nombre_razon_social_referencia, moneda: cotizacion.moneda.codigo_moneda, montoPotencial: cotizacion.monto_neto?.gt(0) ? Number(cotizacion.monto_neto) : null, fechaEmision: fechaIso(cotizacion.fecha_emision), fechaVigencia: cotizacion.fecha_vigencia ? fechaIso(cotizacion.fecha_vigencia) : null, destinoCotizacion: `/cotizacion/nueva?borrador=${cotizacion.id_cotizacion}`, destinoCliente: rutaCliente(cotizacion.ficha_cliente.cliente_financiero) }));
      const conMonto = filas.filter(fila => fila.montoPotencial !== null) as Array<typeof filas[number] & { montoPotencial: number }>;
      const montos = conMonto.map(fila => ({ moneda: fila.moneda, monto: fila.montoPotencial }));
      return { periodo: periodoSalida(periodo), estado: filas.length ? 'VALIDO' as const : 'SIN_RESULTADOS' as const, cantidad: indicador(filas.length ? 'VALIDO' : 'SIN_RESULTADOS', filas.length, 'Cotizaciones emitidas, vigentes y aún no formalizadas como Venta'), montoPotencial: conMonto.length ? indicador(conMonto.length === filas.length ? 'VALIDO' : 'PARCIALMENTE_DISPONIBLE', agruparMonto(montos), `MONTO POTENCIAL; ${filas.length - conMonto.length} cotización(es) sin monto neto válido fueron excluidas del agregado`) : indicador('DATOS_INSUFICIENTES', null, 'MONTO POTENCIAL no disponible: las cotizaciones no tienen monto neto válido'), cotizaciones: filas, naturaleza: 'MONTO POTENCIAL; no representa Venta, ingreso, cobro, caja futura, forecast ni probabilidad de cierre' };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, cantidad: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), montoPotencial: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), cotizaciones: [], naturaleza: 'MONTO POTENCIAL' };
    }
  }

  private async consultarAnalisisVentasCompleto(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const incluir = { moneda: true, ficha_cliente: { include: { cliente_financiero: { include: { tipo_cliente_financiero: true } } } }, cotizacion: { include: { detalle_cotizacion: { include: { item_comercial: true } } } } } as const;
      const [actuales, anteriores] = await Promise.all([
        prisma.nota_venta.findMany({ where: { fecha_emision: { gte: periodo.desde, lt: periodo.hastaExclusiva }, estado_nota_venta: { in: estadosVentaDefinitiva } }, include: incluir, orderBy: { fecha_emision: 'asc' } }),
        prisma.nota_venta.findMany({ where: { fecha_emision: { gte: periodo.anteriorDesde, lt: periodo.anteriorHastaExclusiva }, estado_nota_venta: { in: estadosVentaDefinitiva } }, include: incluir }),
      ]);
      if (!actuales.length) return { periodo: periodoSalida(periodo), estado: 'SIN_RESULTADOS' as const, montoNeto: indicador('SIN_RESULTADOS', null, 'No existen ventas definitivas en el período'), cantidad: indicador('SIN_RESULTADOS', 0, 'No existen ventas definitivas en el período'), ticketMedio: indicador('NO_APLICA', null, 'No hay Ventas válidas para calcular ticket medio'), evolucion: [], clientes: [], tiposCliente: [], concentracionClientes: indicador('NO_APLICA', null, 'No hay Ventas válidas para calcular participación'), productos: indicador('DATOS_INSUFICIENTES', null, 'Sin detalle comercial fiable'), comparacion: indicador('NO_APLICA', null, 'No existe base actual para comparar') };
      const filas = actuales.map(nota => ({ moneda: nota.moneda.codigo_moneda, monto: Number(nota.monto_neto), nota }));
      const porMoneda = agruparMonto(filas);
      const convertir = (nota: typeof actuales[number]) => nota.moneda.codigo_moneda === 'CLP' ? nota.monto_neto : nota.tipo_cambio_usado?.gt(0) ? nota.monto_neto.mul(nota.tipo_cambio_usado) : null;
      const convertidos = actuales.map(convertir);
      let totalClp: number | null = 0;
      for (const monto of convertidos) totalClp = monto && totalClp !== null ? new Prisma.Decimal(totalClp).plus(monto).toDecimalPlaces(2).toNumber() : null;
      const totalAnterior = anteriores.map(convertir as (nota: typeof anteriores[number]) => Prisma.Decimal | null);
      let anteriorClp: number | null = 0;
      for (const monto of totalAnterior) anteriorClp = monto && anteriorClp !== null ? new Prisma.Decimal(anteriorClp).plus(monto).toDecimalPlaces(2).toNumber() : null;
      const comparacion = anteriorClp === 0 ? indicador('NO_APLICA', { anteriorClp: 0, actualClp: totalClp, diferenciaAbsolutaClp: totalClp }, 'El período anterior tiene base cero; la variación porcentual no aplica') : totalClp === null || anteriorClp === null ? indicador('DATOS_INSUFICIENTES', null, 'Falta conversión histórica para comparar monedas') : indicador('VALIDO', { anteriorClp, actualClp: totalClp, diferenciaAbsolutaClp: Number((totalClp - anteriorClp).toFixed(2)), variacionPorcentual: Number((((totalClp - anteriorClp) / anteriorClp) * 100).toFixed(2)) }, 'Comparación contra un período inmediatamente anterior de igual duración');
      const agrupar = (clave: (nota: typeof actuales[number]) => string) => [...actuales.reduce((mapa, nota) => { const llave = `${clave(nota)}|${nota.moneda.codigo_moneda}`; mapa.set(llave, (mapa.get(llave) || 0) + Number(nota.monto_neto)); return mapa; }, new Map<string, number>())].map(([llave, montoNeto]) => { const separador = llave.lastIndexOf('|'); return { nombre: llave.slice(0, separador), moneda: llave.slice(separador + 1), montoNeto: Number(montoNeto.toFixed(2)) }; });
      const clientesAgrupados = [...actuales.reduce((mapa, nota) => {
        const cliente = nota.ficha_cliente.cliente_financiero;
        const moneda = nota.moneda.codigo_moneda;
        const llave = `${cliente.id_cliente_financiero}|${moneda}`;
        const existente = mapa.get(llave);
        mapa.set(llave, {
          idCliente: cliente.id_cliente_financiero,
          nombre: cliente.nombre_razon_social_referencia,
          moneda,
          montoNeto: Number(((existente?.montoNeto || 0) + Number(nota.monto_neto)).toFixed(2)),
        });
        return mapa;
      }, new Map<string, { idCliente: number; nombre: string; moneda: string; montoNeto: number }>()).values()];
      const clientes = clientesAgrupados.map(({ idCliente, ...fila }) => ({ ...fila, destinoCliente: rutaCliente(actuales.find(nota => nota.ficha_cliente.cliente_financiero.id_cliente_financiero === idCliente)!.ficha_cliente.cliente_financiero) }));
      const concentracion = clientesAgrupados.map(fila => ({ idCliente: fila.idCliente, cliente: fila.nombre, moneda: fila.moneda, montoNeto: fila.montoNeto }))
        .sort((a, b) => a.moneda.localeCompare(b.moneda) || b.montoNeto - a.montoNeto || a.cliente.localeCompare(b.cliente));
      const totalesMoneda = new Map(porMoneda.map(fila => [fila.moneda, fila.monto]));
      const posiciones = new Map<string, number>();
      const concentracionClientes = concentracion.map(fila => { const posicion = (posiciones.get(fila.moneda) || 0) + 1; posiciones.set(fila.moneda, posicion); const total = totalesMoneda.get(fila.moneda) || 0; return { ...fila, participacionPorcentual: total > 0 ? Number((fila.montoNeto / total * 100).toFixed(2)) : null, posicion, destinoCliente: rutaCliente(actuales.find(nota => nota.ficha_cliente.cliente_financiero.id_cliente_financiero === fila.idCliente)!.ficha_cliente.cliente_financiero) }; });
      const ticketPorMoneda = porMoneda.map(fila => ({ moneda: fila.moneda, monto: Number((fila.monto / actuales.filter(nota => nota.moneda.codigo_moneda === fila.moneda).length).toFixed(2)) }));
      const detalles = actuales.flatMap(nota => nota.cotizacion?.detalle_cotizacion.map(detalle => ({ nombre: detalle.item_comercial.nombre_item, tipo: detalle.item_comercial.tipo_item || 'Sin tipo', monto: Number(detalle.subtotal_item_estimado) })) || []);
      return {
        periodo: periodoSalida(periodo), estado: 'VALIDO' as const,
        montoNeto: totalClp === null ? indicador('DATOS_INSUFICIENTES', { porMoneda, totalClp: null }, 'Montos por moneda disponibles; falta conversión histórica para consolidar CLP') : indicador('VALIDO', { porMoneda, totalClp }, 'Monto neto de ventas confirmadas o cerradas'),
        cantidad: indicador('VALIDO', actuales.length, 'Ventas definitivas del período'),
        ticketMedio: indicador('VALIDO', { porMoneda: ticketPorMoneda, totalClp: totalClp === null ? null : Number((totalClp / actuales.length).toFixed(2)) }, 'Monto neto de Ventas válidas dividido por su cantidad; no usa cotizaciones, cobros ni facturación documental'),
        evolucion: agrupar(nota => fechaIso(nota.fecha_emision)),
        clientes,
        tiposCliente: agrupar(nota => nota.ficha_cliente.cliente_financiero.tipo_cliente_financiero.nombre_tipo_cliente_financiero),
        concentracionClientes: indicador(porMoneda.some(fila => fila.monto > 0) ? 'VALIDO' : 'NO_APLICA', concentracionClientes, porMoneda.some(fila => fila.monto > 0) ? 'Participación objetiva por Cliente dentro de cada moneda, ordenada por monto neto' : 'El total neto es cero; la participación porcentual no aplica'),
        productos: detalles.length ? indicador('VALIDO', agruparMonto(detalles.map(d => ({ moneda: d.tipo, monto: d.monto }))).map(d => ({ tipo: d.moneda, montoNeto: d.monto })), 'Sólo detalle estructurado de cotizaciones') : indicador('DATOS_INSUFICIENTES', null, 'Las ventas del período no tienen detalle estructurado fiable'),
        comparacion,
      };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, montoNeto: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), cantidad: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), ticketMedio: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), evolucion: [], clientes: [], tiposCliente: [], concentracionClientes: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), productos: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible'), comparacion: indicador('FUENTE_NO_DISPONIBLE', null, 'M2 no está disponible') };
    }
  }

  private async consultarCuentasCobrarCompleto(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const fechaReferencia = new Date(`${fechaNegocio()}T00:00:00Z`);
    try {
      const notas = await prisma.nota_venta.findMany({ where: { estado_nota_venta: { notIn: retiradosCxC } }, include: { ...incluirNota, ficha_cliente: { include: { cliente_financiero: true } }, hito_cobro: true } });
      if (!notas.length) return { periodo: periodoSalida(periodo), estado: 'SIN_RESULTADOS' as const, saldo: indicador('SIN_RESULTADOS', null, 'No existen cuentas por cobrar vigentes'), morosidad: indicador('SIN_RESULTADOS', null, 'No existen obligaciones con saldo'), cartera: indicador('SIN_RESULTADOS', [], 'No existen obligaciones con saldo'), aging: indicador('NO_APLICA', null, 'No existe cartera para calcular antigüedad'), recaudacion: indicador('SIN_RESULTADOS', null, 'No existen pagos asociados'), detalleCobranza: indicador('SIN_RESULTADOS', { cantidadPagos: 0, pagos: [] }, 'No existen pagos asociados'), cumplimiento: indicador('DATOS_INSUFICIENTES', null, 'No existe base exigible reconstruible'), recuperacionMoraPrevia: indicador('DATOS_INSUFICIENTES', null, 'No existe histórico suficiente'), compromisosFuturos: indicador('NO_APLICA', [], 'No existen compromisos futuros') };
      const calculadas = notas.map(nota => ({ nota, calculo: calcularNota(nota) }));
      const pendientes = calculadas.filter(x => x.calculo.saldoPendiente > 0);
      const carteraCompleta = pendientes.map(({ nota, calculo }) => {
        const vencimiento = nota.fecha_vencimiento;
        const diasAtraso = vencimiento && vencimiento < fechaReferencia ? diasCalendario(vencimiento, fechaReferencia) : vencimiento ? 0 : null;
        const condicion = !vencimiento ? 'SIN_FECHA' : vencimiento < fechaReferencia ? 'VENCIDA' : vencimiento >= periodo.hastaExclusiva ? 'FUTURA' : 'VIGENTE';
        return { idNota: nota.id_nota_venta, numeroNota: nota.numero_nota_venta, idCliente: nota.ficha_cliente.cliente_financiero.id_cliente_financiero, cliente: nota.ficha_cliente.cliente_financiero.nombre_razon_social_referencia, moneda: nota.moneda.codigo_moneda, saldo: calculo.saldoPendiente, fechaVencimiento: vencimiento ? fechaIso(vencimiento) : null, diasAtraso, condicion, estadoOwner: nota.estado_pago, destinoCliente: rutaCliente(nota.ficha_cliente.cliente_financiero) };
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
      return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, fechaReferencia: fechaIso(fechaReferencia), saldo: indicador('VALIDO', saldos, 'Saldo vigente calculado con la fórmula propietaria M3'), morosidad: indicador('VALIDO', { cantidad: morosas.length, porMoneda: agruparMonto(morosas.map(x => ({ moneda: x.moneda, monto: x.saldo }))), obligaciones: morosas }, 'Obligaciones vencidas con saldo y días calendario exactos'), cartera: indicador('VALIDO', cartera, 'Cartera filtrada con criterios objetivos; SIN_FECHA no se convierte en cero días'), aging: indicador('PARCIALMENTE_DISPONIBLE', { obligaciones: cartera, rangos: null }, 'Se informan días exactos; no existen rangos oficiales confirmados para agrupar aging'), recaudacion: pagosLista.length ? indicador('VALIDO', agruparMonto(pagosLista), 'Pagos con efecto M3 vigente recibidos en el período') : indicador('SIN_RESULTADOS', null, 'No existen pagos efectivos en el período'), detalleCobranza: indicador(pagosLista.length ? 'VALIDO' : 'SIN_RESULTADOS', { cantidadPagos: pagosLista.length, pagos: pagosLista }, 'Detalle de pagos con efecto M3 vigente y vínculo a Cliente'), cumplimiento: indicador('DATOS_INSUFICIENTES', null, 'No existe una base histórica inequívoca de obligaciones exigibles al inicio del período; no se calcula una tasa genérica'), recuperacionMoraPrevia: indicador('DATOS_INSUFICIENTES', null, 'La fuente actual no reconstruye inequívocamente el saldo vencido al inicio del período'), compromisosFuturos: compromisos.length ? indicador('VALIDO', compromisos, 'Compromisos futuros M3 con saldo vigente; no representan cobros realizados') : indicador('NO_APLICA', [], 'No existen compromisos futuros con fecha válida') };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, saldo: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), morosidad: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), cartera: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), aging: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), recaudacion: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), detalleCobranza: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), cumplimiento: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), recuperacionMoraPrevia: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible'), compromisosFuturos: indicador('FUENTE_NO_DISPONIBLE', null, 'M3 no está disponible') };
    }
  }

  private async consultarCuentasPagarCompleto(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const [obligaciones, monedas, proveedores] = await Promise.all([prisma.obligacion_proveedor_m5.findMany(), prisma.moneda.findMany(), prisma.proveedor.findMany()]);
      if (!obligaciones.length) return { periodo: periodoSalida(periodo), estado: 'DATOS_INSUFICIENTES' as const, saldo: indicador('DATOS_INSUFICIENTES', null, 'No existen obligaciones M5'), estados: indicador('DATOS_INSUFICIENTES', null, 'Sin obligaciones que clasificar'), proveedores: [], categorias: indicador('DATOS_INSUFICIENTES', null, 'Sin documentos clasificados'), compromisosFuturos: indicador('NO_APLICA', [], 'No existen compromisos futuros') };
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
      return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, fechaReferencia: fechaIso(fechaReferencia), saldo: vigentes.length ? indicador('VALIDO', agruparMonto(vigentes.map(f => ({ moneda: f.moneda, monto: f.saldo }))), 'Saldo actual de obligaciones M5') : indicador('NO_APLICA', [], 'No existen saldos pendientes'), cartera: indicador(vigentes.length ? 'VALIDO' : 'SIN_RESULTADOS', vigentes, 'Obligaciones M5 con saldo aplicable, atraso exacto, filtros y orden objetivo'), aging: indicador(vigentes.length ? 'PARCIALMENTE_DISPONIBLE' : 'NO_APLICA', { obligaciones: vigentes, rangos: null }, 'Se informan días exactos; no existen rangos oficiales confirmados'), estados: indicador('VALIDO', estados, 'Estados derivados con reglas M5'), proveedores: porProveedor, categorias: categorias.length ? indicador('VALIDO', categorias, 'Distribución proporcional basada en clasificaciones M5 confirmadas') : indicador('DATOS_INSUFICIENTES', null, 'Las obligaciones vigentes no tienen clasificación M5 fiable'), compromisosFuturos: futuros.length ? indicador('VALIDO', futuros, 'Obligaciones futuras M5 con saldo vigente; no representan pagos realizados') : indicador('NO_APLICA', [], 'No existen compromisos futuros') };
    } catch {
      return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, saldo: indicador('FUENTE_NO_DISPONIBLE', null, 'M5 no está disponible'), estados: indicador('FUENTE_NO_DISPONIBLE', null, 'M5 no está disponible'), proveedores: [], categorias: indicador('FUENTE_NO_DISPONIBLE', null, 'M5 no está disponible'), compromisosFuturos: indicador('FUENTE_NO_DISPONIBLE', null, 'M5 no está disponible') };
    }
  }

  private async consultarLiquidezCompleto(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const liquidezActual = indicador('CONFIGURACION_PENDIENTE', null, 'No existe una fuente inequívoca de saldo de apertura o saldo bancario actual');
    let flujoHistorico;
    try {
      const movimientos = await prisma.movimiento_financiero.findMany({ where: { fecha_movimiento: { gte: periodo.anteriorDesde, lt: periodo.hastaExclusiva }, estado_movimiento: { notIn: ['anulado', 'rechazado'] } }, include: { moneda: true, origen_movimiento_financiero: true }, orderBy: [{ fecha_movimiento: 'asc' }, { id_movimiento_financiero: 'asc' }] });
      flujoHistorico = movimientos.length ? indicador('VALIDO', agruparMonto(movimientos.map(m => ({ moneda: `${m.moneda.codigo_moneda}:${m.naturaleza_movimiento}`, monto: Number(m.monto_movimiento) }))).map(f => { const [moneda, naturaleza] = f.moneda.split(':'); return { moneda, naturaleza, monto: f.monto }; }), 'Movimientos financieros registrados en el período') : indicador('DATOS_INSUFICIENTES', null, 'No existen movimientos financieros registrados en el período');
      const granularidadEntrada = normalizarTexto(String(consulta.granularidad || 'dia'));
      if (!['dia', 'semana', 'mes'].includes(granularidadEntrada)) throw new ErrorAplicacion(400, 'Granularidad inválida; use dia, semana o mes');
      const granularidad = granularidadEntrada as 'dia' | 'semana' | 'mes';
      const categoria = String(consulta.categoria || '').trim(); const origen = String(consulta.origen || '').trim();
      const filtrados = movimientos.filter(m => (!categoria || m.tipo_movimiento_financiero === categoria) && (!origen || m.origen_movimiento_financiero.some(o => o.entidad_origen === origen)));
      const actuales = filtrados.filter(m => dentro(m.fecha_movimiento, periodo));
      const anteriores = filtrados.filter(m => m.fecha_movimiento >= periodo.anteriorDesde && m.fecha_movimiento < periodo.anteriorHastaExclusiva);
      const serie = (filas: typeof filtrados) => [...filas.reduce((mapa, m) => { const clave = `${inicioBucket(m.fecha_movimiento, granularidad)}|${m.moneda.codigo_moneda}`; const actual = mapa.get(clave) || { fecha: inicioBucket(m.fecha_movimiento, granularidad), moneda: m.moneda.codigo_moneda, entradas: 0, salidas: 0, ajustes: 0 }; const monto = Number(m.monto_movimiento); if (normalizarTexto(m.naturaleza_movimiento) === 'ingreso') actual.entradas += monto; else if (normalizarTexto(m.naturaleza_movimiento) === 'egreso') actual.salidas += monto; else actual.ajustes += monto; mapa.set(clave, actual); return mapa; }, new Map<string, { fecha: string; moneda: string; entradas: number; salidas: number; ajustes: number }>()).values()].map(fila => ({ ...fila, entradas: Number(fila.entradas.toFixed(2)), salidas: Number(fila.salidas.toFixed(2)), ajustes: Number(fila.ajustes.toFixed(2)), flujoNeto: Number((fila.entradas - fila.salidas + fila.ajustes).toFixed(2)) })).sort((a, b) => a.fecha.localeCompare(b.fecha) || a.moneda.localeCompare(b.moneda));
      const totales = (filas: typeof filtrados) => [...filas.reduce((mapa, m) => { const codigo = m.moneda.codigo_moneda; const actual = mapa.get(codigo) || { moneda: codigo, entradas: 0, salidas: 0, ajustes: 0 }; const monto = Number(m.monto_movimiento); if (normalizarTexto(m.naturaleza_movimiento) === 'ingreso') actual.entradas += monto; else if (normalizarTexto(m.naturaleza_movimiento) === 'egreso') actual.salidas += monto; else actual.ajustes += monto; mapa.set(codigo, actual); return mapa; }, new Map<string, { moneda: string; entradas: number; salidas: number; ajustes: number }>()).values()].map(fila => ({ ...fila, flujoNeto: Number((fila.entradas - fila.salidas + fila.ajustes).toFixed(2)) }));
      const actualesTotales = totales(actuales); const anterioresTotales = new Map(totales(anteriores).map(f => [f.moneda, f]));
      const comparacion = actualesTotales.map(actual => { const anterior = anterioresTotales.get(actual.moneda) || { flujoNeto: 0 }; const diferenciaAbsoluta = Number((actual.flujoNeto - anterior.flujoNeto).toFixed(2)); return { moneda: actual.moneda, actual: actual.flujoNeto, anterior: anterior.flujoNeto, diferenciaAbsoluta, variacionPorcentual: anterior.flujoNeto === 0 ? null : Number((diferenciaAbsoluta / Math.abs(anterior.flujoNeto) * 100).toFixed(2)), estadoVariacion: anterior.flujoNeto === 0 ? 'NO_APLICA' : 'VALIDO' }; });
      const presentar = (m: typeof filtrados[number]) => ({ idMovimiento: m.id_movimiento_financiero, fecha: fechaIso(m.fecha_movimiento), categoria: m.tipo_movimiento_financiero || null, naturaleza: m.naturaleza_movimiento, moneda: m.moneda.codigo_moneda, monto: Number(m.monto_movimiento), origenes: m.origen_movimiento_financiero.map(o => ({ entidad: o.entidad_origen, id: o.id_registro_origen, descripcion: o.descripcion_origen })) });
      flujoHistorico = actuales.length ? indicador('VALIDO', { granularidad, filtros: { categoria: categoria || null, origen: origen || null }, serie: serie(actuales), totales: actualesTotales, comparacion, movimientos: actuales.map(presentar) }, 'Flujo registrado, agregado en tiempo real y comparado con un período anterior de igual duración') : indicador('DATOS_INSUFICIENTES', { granularidad, filtros: { categoria: categoria || null, origen: origen || null }, serie: [], totales: [], comparacion: [], movimientos: [] }, 'No existen movimientos financieros registrados para los filtros del período');
    } catch { flujoHistorico = indicador('FUENTE_NO_DISPONIBLE', null, 'La fuente de movimientos financieros no está disponible'); }
    try {
      const [cxc, cxp] = await Promise.all([this.consultarCuentasCobrarCompleto(consulta), this.consultarCuentasPagarCompleto(consulta)]);
      const ingresos = cxc.compromisosFuturos.estado === 'VALIDO' ? cxc.compromisosFuturos.valor : [];
      const egresos = cxp.compromisosFuturos.estado === 'VALIDO' ? cxp.compromisosFuturos.valor : [];
      const compromisos = [
        ...(ingresos || []).map((fila: Record<string, unknown>) => ({ fecha: fila.fechaVencimiento, moneda: fila.moneda, monto: fila.monto, direccion: 'ENTRADA', owner: 'M3', id: fila.idNota })),
        ...(egresos || []).map((fila: Record<string, unknown>) => ({ fecha: fila.fechaVencimiento, moneda: fila.moneda, monto: fila.monto, direccion: 'SALIDA', owner: 'M5', id: fila.id })),
      ].filter(fila => typeof fila.fecha === 'string' && typeof fila.moneda === 'string' && Number(fila.monto) > 0).sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)) || String(a.moneda).localeCompare(String(b.moneda)));
      const acumulados = new Map<string, number>();
      const serieCompromisos = compromisos.map(fila => { const moneda = String(fila.moneda); const cambio = fila.direccion === 'ENTRADA' ? Number(fila.monto) : -Number(fila.monto); acumulados.set(moneda, Number(((acumulados.get(moneda) || 0) + cambio).toFixed(2))); return { ...fila, cambio, acumuladoCompromisos: acumulados.get(moneda) }; });
      const saldoProyectado = indicador('DATOS_INSUFICIENTES', null, 'No existe saldo de apertura válido; los compromisos no se convierten en saldo absoluto');
      const proyeccion = compromisos.length ? indicador('PARCIALMENTE_DISPONIBLE', { ingresos, egresos, compromisos, serieCompromisos, saldoProyectado }, 'Compromisos futuros confirmados; el acumulado expresa variación, no liquidez ni saldo proyectado') : indicador('NO_APLICA', { ingresos: [], egresos: [], compromisos: [], serieCompromisos: [], saldoProyectado }, 'No existen compromisos fechados para proyectar y tampoco existe saldo de apertura');
      return { periodo: periodoSalida(periodo), estado: flujoHistorico.estado === 'FUENTE_NO_DISPONIBLE' ? 'FUENTE_NO_DISPONIBLE' as const : 'CONFIGURACION_PENDIENTE' as const, liquidezActual, flujoHistorico, proyeccion, capaEstimada: indicador('NO_APLICA', null, 'No existe una estimación propietaria con base, fecha y monto válidos') };
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
    const datos = await this.consultarAnalisisVentasCompleto(consulta) as Record<string, unknown>;
    if (!permisos) return datos;
    const salida: Record<string, unknown> = { periodo: datos.periodo, estado: datos.estado };
    if (permisos.includes('CU219')) for (const clave of ['montoNeto', 'cantidad', 'ticketMedio', 'evolucion', 'comparacion']) salida[clave] = datos[clave];
    if (permisos.includes('CU220')) for (const clave of ['clientes', 'tiposCliente', 'concentracionClientes', 'productos']) salida[clave] = datos[clave];
    return salida;
  }

  async consultarContextoCliente(idCliente: number, consulta: Consulta, permisos: string[]) {
    if (!Number.isInteger(idCliente) || idCliente <= 0) throw new ErrorAplicacion(400, 'Cliente inválido');
    const periodo = resolverPeriodoM7(consulta);
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
        ventas.destino = `/dashboard-m7/ventas?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`;
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
        cxc.destino = `/dashboard-m7/cuentas-cobrar?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`;
        bloques.cuentasCobrar = cxc;
      } catch { bloques.cuentasCobrar = { estado: 'FUENTE_NO_DISPONIBLE', detalle: 'M3 no está disponible' }; }
    }
    return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, cliente: { idCliente: cliente.id_cliente_financiero, nombre: cliente.nombre_razon_social_referencia, identificador: cliente.rut_cliente, tipoCliente: cliente.tipo_cliente_financiero.nombre_tipo_cliente_financiero, estado: cliente.estado_financiero }, destinoCliente: rutaCliente(cliente), bloques };
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
    if (permisos.includes('CU230')) {
      const flujo = { ...(datos.flujoHistorico as Record<string, unknown>) }; const valor = flujo.valor;
      if (valor && typeof valor === 'object') { const contenido = { ...(valor as Record<string, unknown>) }; if (Array.isArray(contenido.movimientos)) contenido.movimientos = contenido.movimientos.map(filaEntrada => { const fila = filaEntrada as Record<string, unknown>; const acciones: AccionNavegacion[] = []; const origenes = Array.isArray(fila.origenes) ? fila.origenes as Array<Record<string, unknown>> : []; const visibles = origenes.map(origen => { const entidad = String(origen.entidad || ''); let permitido = false; if (entidad === 'pago_cliente' && permisos.includes('CU42')) { permitido = true; acciones.push(accion('Abrir pagos de Cliente', '/pagos')); } if (entidad === 'pago_proveedor' && permisos.includes('CU111')) { permitido = true; acciones.push(accion('Abrir pagos a Proveedores', '/pagos-proveedores')); } if (entidad === 'gasto_caja_chica' && permisos.includes('CU149')) { permitido = true; acciones.push(accion('Abrir Caja Chica', '/caja-chica')); } if (entidad === 'liquidacion_remuneracion' && permisos.includes('CU187')) { permitido = true; acciones.push(accion('Abrir pagos de remuneraciones', '/pagos-remuneraciones')); } return permitido ? origen : { entidad, descripcion: origen.descripcion ?? null, navegacionDisponible: false }; }); return { ...fila, origenes: visibles, ...(acciones.length ? { acciones: [...new Map(acciones.map(a => [a.destino, a])).values()] } : {}) }; }); flujo.valor = contenido; } salida.flujoHistorico = flujo;
    }
    if (permisos.includes('CU231')) salida.proyeccion = datos.proyeccion;
    return salida;
  }

  async consultarRiesgoDeficit(consulta: Consulta, permisos: string[]) {
    const datos = await this.consultarLiquidezCompleto(consulta);
    const proyeccion = datos.proyeccion;
    const valor = proyeccion.valor as { saldoProyectado?: { estado: EstadoIndicadorM7; valor: Array<{ fecha: string; moneda: string; saldo: number }> | null }; ingresos?: Array<Record<string, unknown>>; egresos?: Array<Record<string, unknown>> } | null;
    const serie = valor?.saldoProyectado?.estado === 'VALIDO' ? valor.saldoProyectado.valor?.filter(punto => /^\d{4}-\d{2}-\d{2}$/.test(punto.fecha) && typeof punto.moneda === 'string' && Number.isFinite(Number(punto.saldo))) || [] : [];
    let primerDeficit; let minimoProyectado;
    if (!serie.length) {
      primerDeficit = indicador('CONFIGURACION_PENDIENTE', null, 'CU231 no dispone de saldo de apertura ni de una serie válida de saldo proyectado');
      minimoProyectado = indicador('CONFIGURACION_PENDIENTE', null, 'No existe una serie absoluta válida para identificar el mínimo del horizonte');
    } else {
      const monedas = [...new Set(serie.map(punto => punto.moneda))];
      const primeros = monedas.map(moneda => serie.filter(punto => punto.moneda === moneda && Number(punto.saldo) < 0).sort((a, b) => a.fecha.localeCompare(b.fecha))[0]).filter(Boolean);
      const minimos = monedas.map(moneda => serie.filter(punto => punto.moneda === moneda).sort((a, b) => Number(a.saldo) - Number(b.saldo) || a.fecha.localeCompare(b.fecha))[0]);
      primerDeficit = primeros.length ? indicador('VALIDO', primeros, 'Primer saldo negativo por moneda dentro del horizonte válido de CU231') : indicador('SIN_RESULTADOS', [], 'Sin déficit dentro del horizonte');
      minimoProyectado = indicador('VALIDO', minimos, 'Menor saldo proyectado por moneda dentro del horizonte');
    }
    const factores: Array<Record<string, unknown>> = [];
    if (permisos.includes('CU225')) for (const fila of valor?.ingresos || []) factores.push({ ...fila, naturaleza: 'COBRO_M3', origen: 'M3' });
    if (permisos.includes('CU227')) for (const fila of valor?.egresos || []) factores.push({ ...fila, naturaleza: 'PAGO_M5', origen: 'M5' });
    const hayPermisoFactores = permisos.includes('CU225') || permisos.includes('CU227');
    return { periodo: datos.periodo, estado: primerDeficit.estado === 'CONFIGURACION_PENDIENTE' ? 'CONFIGURACION_PENDIENTE' as const : 'VALIDO' as const, primerDeficit, minimoProyectado, factores: hayPermisoFactores ? indicador(factores.length ? 'VALIDO' : 'SIN_RESULTADOS', factores, 'Compromisos reales visibles según permisos de sus fuentes; no representan causalidad automática') : indicador('SIN_PERMISO', null, 'CU232 no concede acceso al detalle de cobros o pagos subyacentes'), criterio: 'Sin score, ranking ni recomendación automática' };
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
        const fila: Record<string, unknown> = { idProyecto: proyecto.id_proyecto_financiero, codigo: proyecto.codigo_proyecto_financiero, nombre: proyecto.proyecto?.proyecto_nombre_referencia || proyecto.codigo_proyecto_financiero, estadoFinanciero: proyecto.estado_financiero_proyecto, estadoOperacional: proyecto.proyecto?.proyecto_estado_operacional || null, moneda: atribucion?.moneda || proyecto.moneda.codigo_moneda, ingresosAtribuibles: atribucion?.ingresosAtribuibles ?? null, costosDirectosAtribuibles: atribucion?.costosDirectosAtribuibles ?? null, cobrado: calculo?.pagosEfectivos ?? null, pendienteCobrar: calculo?.saldoPendiente ?? null, destinoContexto: `/dashboard-m7/proyectos/${proyecto.id_proyecto_financiero}?anio=${periodo.desde.getUTCFullYear()}&mes=${periodo.desde.getUTCMonth() + 1}`, destinoCliente: rutaCliente(proyecto.ficha_cliente.cliente_financiero), cobertura: indicador('PARCIALMENTE_DISPONIBLE', { fuentesIncluidas: ['Proyecto financiero', ...(atribucion ? ['Atribuciones válidas de CU233-CU235'] : []), ...(notaInequivoca ? ['CxC M3 vinculada directamente'] : [])], fuentesNoDisponibles }, 'La exposición sólo incorpora relaciones inequívocas y no representa costo total del Proyecto') };
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
    return { periodo: periodoSalida(periodo), estado: 'VALIDO' as const, proyecto: { idProyecto: proyecto.id_proyecto_financiero, codigo: proyecto.codigo_proyecto_financiero, nombre: proyecto.proyecto?.proyecto_nombre_referencia || proyecto.codigo_proyecto_financiero, estadoFinanciero: proyecto.estado_financiero_proyecto, moneda: proyecto.moneda.codigo_moneda }, destinoCliente: rutaCliente(proyecto.ficha_cliente.cliente_financiero), bloques };
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
      const ubicaciones = [...actuales.reduce((mapa, servicio) => { const region = servicio.obra?.obra_region?.trim() || null; const comuna = servicio.obra?.obra_comuna?.trim() || null; const clave = region || comuna ? `${region || 'SIN_REGION'}|${comuna || 'SIN_COMUNA'}` : 'SIN_UBICACION|SIN_UBICACION'; mapa.set(clave, (mapa.get(clave) || 0) + 1); return mapa; }, new Map<string, number>())].map(([clave, cantidad]) => { const [region, comuna] = clave.split('|'); return { region, comuna, cantidad }; });
      const sinUbicacion = actuales.filter(servicio => !servicio.obra?.obra_region?.trim() && !servicio.obra?.obra_comuna?.trim()).length;
      const comparacion = anteriores.length === 0 ? indicador('NO_APLICA', { anterior: 0, actual: actuales.length, diferenciaAbsoluta: actuales.length, variacionPorcentual: null }, 'La base comparadora es cero; la variación porcentual no aplica') : indicador('VALIDO', { anterior: anteriores.length, actual: actuales.length, diferenciaAbsoluta: actuales.length - anteriores.length, variacionPorcentual: Number((((actuales.length - anteriores.length) / anteriores.length) * 100).toFixed(2)) }, 'Comparación con el período inmediatamente anterior de igual duración');
      const detalle = actuales.map(servicio => ({ idServicio: servicio.servicio_terreno_servicio_terreno_id.toString(), tipo: servicio.servicio_terreno_tipo_servicio, estado: servicio.servicio_terreno_estado, fecha: fechaIso(servicio.servicio_terreno_fecha_real!), region: servicio.obra?.obra_region || null, comuna: servicio.obra?.obra_comuna || null, destinoOwner: '/terreno/visitas' }));
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
      const resumen = { coberturaTemporalValida: calculables.length, atrasadas: atrasadas.length, enPlazo: enPlazo.length, sinFechaSuficiente: sinFecha.length, relacionInstalacionNoConfirmada: relacionNoConfirmada, finalizadasOAnuladasExcluidas: finalizadasExcluidas };
      return {
        periodo: periodoSalida(periodo), fechaReferencia: fechaIso(fechaReferencia), estado: 'PARCIALMENTE_DISPONIBLE' as const,
        resumen: indicador('PARCIALMENTE_DISPONIBLE', resumen, 'Cobertura parcial: sólo tareas vinculadas directamente a servicios cuyo tipo propietario identifica una instalación'),
        atrasos: indicador(atrasadas.length ? 'VALIDO' : 'SIN_RESULTADOS', atrasadas, 'Clasificación derivada de tarea_horario_limite vencido y estados propietarios no terminales; días calendario'),
        enPlazo: indicador(enPlazo.length ? 'VALIDO' : 'SIN_RESULTADOS', enPlazo, 'Tareas con fecha límite válida aún no vencida; no incluye tareas sin fecha'),
        sinInformacionTemporal: indicador(sinFecha.length ? 'DATOS_INSUFICIENTES' : 'SIN_RESULTADOS', sinInformacion, 'La ausencia de tarea_horario_limite no se interpreta como cero ni como trabajo en plazo'),
        relacionInstalacionNoConfirmada: indicador(relacionNoConfirmada ? 'PARCIALMENTE_DISPONIBLE' : 'SIN_RESULTADOS', { cantidad: relacionNoConfirmada }, 'Tareas excluidas porque no tienen relación directa con un servicio identificado exactamente como instalación'),
        duracion: indicador('DATOS_INSUFICIENTES', null, 'NO CALCULABLE: no existe una pareja propietaria de inicio real y término real'),
        tiempoCiclo: indicador('DATOS_INSUFICIENTES', null, 'NO CALCULABLE: el owner no define inequívocamente los eventos inicial y final del ciclo'),
        cobertura: indicador('PARCIALMENTE_DISPONIBLE', resumen, 'CU252 parcial; no usa creación, actualización, OT ni ejecución como sustitutos de inicio o término'),
        criterio: 'Sin score, prioridad, causalidad de incidencias ni escritura en Terreno/OT',
      };
    } catch {
      return { periodo: periodoSalida(periodo), fechaReferencia: fechaIso(fechaReferencia), estado: 'FUENTE_NO_DISPONIBLE' as const, resumen: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), atrasos: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), enPlazo: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), sinInformacionTemporal: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), duracion: indicador('DATOS_INSUFICIENTES', null, 'NO CALCULABLE'), tiempoCiclo: indicador('DATOS_INSUFICIENTES', null, 'NO CALCULABLE'), cobertura: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible') };
    }
  }

  async consultarIncidenciasRetrabajos(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    try {
      const registros = await prisma.incidencia_retrabajo_tarea.findMany({ where: { fecha_registro: { gte: periodo.anteriorDesde, lt: periodo.hastaExclusiva } }, include: { ejecucion: { include: { tarea: { include: { orden_trabajo: true, servicio_terreno: true } } } } }, orderBy: { fecha_registro: 'desc' } });
      const actuales = registros.filter(registro => dentro(registro.fecha_registro, periodo));
      const anteriores = registros.filter(registro => registro.fecha_registro >= periodo.anteriorDesde && registro.fecha_registro < periodo.anteriorHastaExclusiva);
      const estados = [...actuales.reduce((mapa, registro) => mapa.set(registro.estado, (mapa.get(registro.estado) || 0) + 1), new Map<string, number>())].map(([estado, cantidad]) => ({ estado, cantidad }));
      const detalle = actuales.map(registro => ({ id: registro.id_incidencia_retrabajo.toString(), estado: registro.estado, descripcion: registro.descripcion, causaReferencia: registro.causa_referencia, fecha: registro.fecha_registro.toISOString(), idTarea: registro.ejecucion.id_tarea.toString(), idOrden: registro.ejecucion.tarea?.id_orden_trabajo?.toString() || null, idServicio: registro.ejecucion.tarea?.id_servicio_terreno?.toString() || null, destinoOwner: registro.ejecucion.tarea?.id_servicio_terreno ? '/terreno/incidencias' : registro.ejecucion.tarea?.id_orden_trabajo ? '/terreno/produccion' : null }));
      const vinculados = detalle.filter(item => item.idOrden || item.idServicio).length;
      const evolucion = [
        { periodo: `${periodo.anteriorDesde.toISOString().slice(0, 10)}..${new Date(periodo.anteriorHastaExclusiva.getTime() - 86400000).toISOString().slice(0, 10)}`, cantidad: anteriores.length },
        { periodo: `${periodo.etiquetaDesde}..${periodo.etiquetaHasta}`, cantidad: actuales.length },
      ];
      return { periodo: periodoSalida(periodo), estado: actuales.length ? (vinculados === actuales.length ? 'VALIDO' as const : 'PARCIALMENTE_DISPONIBLE' as const) : 'SIN_RESULTADOS' as const, cantidad: indicador(actuales.length ? 'VALIDO' : 'SIN_RESULTADOS', actuales.length, 'Registros del productor canónico terreno.incidencia_retrabajo_tarea'), estados: indicador(estados.length ? 'VALIDO' : 'SIN_RESULTADOS', estados, 'Estados propietarios; pendiente/corregida/cerrada no se reinterpretan'), evolucion: indicador('VALIDO', evolucion, 'Comparación temporal de registros de incidencia/retrabajo'), registros: detalle, retrabajos: indicador(actuales.length ? 'PARCIALMENTE_DISPONIBLE' : 'SIN_RESULTADOS', actuales.length ? detalle.map(item => ({ referencia: item.id, idOrden: item.idOrden, idServicio: item.idServicio })) : [], 'El productor reúne incidencia y retrabajo en una misma entidad; no se inventa una clasificación separada'), cobertura: indicador(vinculados === actuales.length ? 'VALIDO' : 'PARCIALMENTE_DISPONIBLE', { vinculados, sinVinculoOperacional: actuales.length - vinculados }, 'Vínculo únicamente por ejecución → tarea → OT/servicio'), privacidad: 'Sin ranking ni identificación del trabajador' };
    } catch { return { periodo: periodoSalida(periodo), estado: 'FUENTE_NO_DISPONIBLE' as const, cantidad: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), estados: indicador('FUENTE_NO_DISPONIBLE', null, 'Terreno no está disponible'), registros: [] }; }
  }

  async consultarResumenResultados(consulta: Consulta) {
    const periodo = resolverPeriodoM7(consulta);
    const [ventas, margen] = await Promise.all([this.consultarAnalisisVentas(consulta), this.consultarMargenProyectos(consulta)]);
    const ingresos = (ventas as any).montoNeto?.valor?.porMoneda as Array<{ moneda: string; monto: number }> | undefined;
    const costos = sumarPorMoneda(((margen as any).proyectos || []).flatMap((proyecto: any) => proyecto.desgloseCostos.map((costo: any) => ({ moneda: costo.moneda, monto: costo.monto }))));
    const resultado = ingresos?.flatMap(fila => {
      const costo = costos.find(item => item.moneda === fila.moneda);
      return costo ? [{ moneda: fila.moneda, ingresos: fila.monto, costosDirectos: costo.monto, resultadoGerencial: Number((fila.monto - costo.monto).toFixed(2)) }] : [];
    }) || [];
    return {
      titulo: 'Resumen gerencial de resultados', periodo: periodoSalida(periodo), estado: ingresos?.length ? 'DATOS_INSUFICIENTES' as const : 'FUENTE_NO_DISPONIBLE' as const,
      ingresos: ingresos?.length ? indicador('VALIDO', ingresos, 'Ventas definitivas netas del período') : indicador((ventas as any).montoNeto?.estado || 'DATOS_INSUFICIENTES', null, 'No hay ingresos reconstruibles para el período'),
      costosDirectos: costos.length ? indicador('VALIDO', costos, 'Costos directamente atribuidos a proyectos, sin prorrateos') : indicador('DATOS_INSUFICIENTES', null, 'No hay costos directos reconstruibles; no se reemplazan por cero'),
      gastosRegistrados: indicador('DATOS_INSUFICIENTES', null, 'No existe una fuente completa que permita separar gastos del período sin duplicar costos o flujo de caja'),
      resultadoGerencial: resultado.length ? indicador('VALIDO', resultado, 'Diferencia gerencial entre ingresos y costos directos comparables por moneda') : indicador('DATOS_INSUFICIENTES', null, 'Faltan partidas comparables para derivar un resultado'),
      cobertura: indicador('DATOS_INSUFICIENTES', { completa: false, noIncluye: ['depreciaciones', 'provisiones', 'impuestos no producidos por el owner', 'cierre contable'] }, 'Síntesis operativa parcial; no es un Estado de Resultados contable formal'),
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
      cuentasPorCobrar: saldoCxc?.valor !== null && saldoCxc?.valor !== undefined ? indicador(saldoCxc.estado, saldoCxc.valor, 'Saldo vigente reconstruido por M3') : indicador('DATOS_INSUFICIENTES', null, 'Cuentas por cobrar no disponibles'),
      cuentasPorPagar: saldoCxp?.valor !== null && saldoCxp?.valor !== undefined ? indicador(saldoCxp.estado, saldoCxp.valor, 'Saldo vigente reconstruido por M5') : indicador('DATOS_INSUFICIENTES', null, 'Cuentas por pagar no disponibles'),
      patrimonio: indicador('NO_APLICA', null, 'No existe una definición funcional que autorice derivar patrimonio como diferencia'),
      cobertura: indicador('DATOS_INSUFICIENTES', { completa: false, incluidas: ['Cuentas por cobrar', 'Cuentas por pagar'], noDisponibles: ['Disponibilidades', 'Patrimonio', 'Activos fijos', 'Inventario valorizado', 'Provisiones'] }, 'Síntesis gerencial reconstruible; no es un Balance General ni un estado financiero formal'),
    };
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
    const filtros = Object.entries(consulta).filter(([clave]) => ['anio', 'mes', 'desde', 'hasta'].includes(clave)).map(([clave, valor]) => `${clave}=${String(valor)}`).join(', ') || 'Período vigente de la consulta';
    return archivoPdf(`dashboard-${origen}-${periodo.etiquetaDesde}-${periodo.etiquetaHasta}.pdf`, [
      fuente.titulo,
      `Puertas Blindadas | Dashboard financiero`,
      `Generado: ${generado.toISOString()}`,
      `Periodo: ${periodo.etiquetaDesde} a ${periodo.etiquetaHasta}`,
      `Filtros: ${filtros}`,
      '',
      ...lineasPdf(datos),
    ]);
  }
}
