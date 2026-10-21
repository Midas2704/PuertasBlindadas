import { Prisma } from '@prisma/client';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';

export type EstadoCotejoM11 = 'COINCIDE' | 'DISCREPANCIA' | 'INFORMACION_INSUFICIENTE';
type Json = Record<string, unknown>;
type DetalleAcreditable = { id_detalle_cotizacion: number; id_cotizacion: number };
type LineaOferta = { tipo: 'PRODUCTO' | 'SERVICIO'; idDetalleCotizacion: number | null; referenciaComercial: string | null; idProductoComercial?: number | null; idVersionProducto?: number | null; codigo?: string | null; nombre?: string | null; cantidad?: number | null; precioUnitario?: number | null };

export type LineaOrdenCompraM11 = {
  numeroLinea: number; idDetalleCotizacion: number | null; referenciaComercial: string | null; concepto: string | null;
  especificaciones: Prisma.InputJsonValue | null; cantidad: Prisma.Decimal | null; idMoneda: number | null;
  precioUnitario: Prisma.Decimal | null; subtotal: Prisma.Decimal | null; estadoCotejo: EstadoCotejoM11;
  resultadoCotejo: Prisma.InputJsonValue; correspondenciaTecnicaAcreditada: boolean; cantidadAcreditada: number | null;
};
type UnidadTecnicaM11 = { detalle: number; idUnidad: string | number | bigint; idOrdenTrabajo: string | number | bigint };

const objeto = (valor: unknown): Json => valor && typeof valor === 'object' && !Array.isArray(valor) ? valor as Json : {};
const textoOpcional = (valor: unknown, maximo: number) => {
  if (valor === undefined || valor === null || valor === '') return null;
  if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > maximo) throw new ErrorAplicacion(400, 'La línea de OC contiene texto inválido');
  return valor.trim();
};
const enteroOpcional = (valor: unknown, nombre: string) => {
  if (valor === undefined || valor === null || valor === '') return null;
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) throw new ErrorAplicacion(400, `${nombre} inválido`);
  return numero;
};
const decimalOpcional = (valor: unknown, nombre: string, admiteCero = false) => {
  if (valor === undefined || valor === null || valor === '') return null;
  const numero = new Prisma.Decimal(String(valor));
  if (!numero.isFinite() || (admiteCero ? numero.lt(0) : numero.lte(0))) throw new ErrorAplicacion(400, `${nombre} inválido`);
  return numero.toDecimalPlaces(2);
};
const textoEstable = (valor: unknown) => typeof valor === 'string' && valor.trim() ? valor.trim() : null;
const lineasSnapshot = (snapshot: unknown): LineaOferta[] => {
  const raiz = objeto(snapshot);
  const productos = Array.isArray(raiz.productos) ? raiz.productos : [];
  const servicios = Array.isArray(raiz.servicios) ? raiz.servicios : [];
  return [
    ...productos.filter(item => item && typeof item === 'object' && !Array.isArray(item)).map(item => {
      const linea = item as Json;
      return { ...linea, tipo: 'PRODUCTO' as const, idDetalleCotizacion: Number.isInteger(Number(linea.idDetalleCotizacion)) ? Number(linea.idDetalleCotizacion) : null, referenciaComercial: null } as LineaOferta;
    }),
    ...servicios.filter(item => item && typeof item === 'object' && !Array.isArray(item)).map(item => {
      const linea = item as Json;
      return { ...linea, tipo: 'SERVICIO' as const, idDetalleCotizacion: null, referenciaComercial: textoEstable(linea.codigo) } as LineaOferta;
    }),
  ];
};
const iguales = (a: Prisma.Decimal, b: unknown) => { try { return a.eq(new Prisma.Decimal(String(b))); } catch { return false; } };
const claveOferta = (linea: LineaOferta) => linea.tipo === 'PRODUCTO' && linea.idDetalleCotizacion !== null
  ? `DETALLE:${linea.idDetalleCotizacion}` : linea.tipo === 'SERVICIO' && linea.referenciaComercial ? `REFERENCIA:${linea.referenciaComercial}` : null;

export function validarCondicionesEconomicasOfertaM11(snapshotOferta: unknown, actual: { moneda: string; neto: unknown; impuesto: unknown; total: unknown }) {
  const snapshot = objeto(snapshotOferta);
  const faltantes: string[] = [];
  const discrepancias: Array<{ campo: string; actual: unknown; oferta: unknown }> = [];
  const moneda = textoEstable(snapshot.moneda);
  if (!moneda) faltantes.push('moneda_oferta'); else if (moneda !== actual.moneda) discrepancias.push({ campo: 'moneda', actual: actual.moneda, oferta: moneda });
  for (const campo of ['neto', 'impuesto', 'total'] as const) {
    if (snapshot[campo] === null || snapshot[campo] === undefined) faltantes.push(`${campo}_oferta`);
    else {
      try { if (!new Prisma.Decimal(String(actual[campo])).eq(new Prisma.Decimal(String(snapshot[campo])))) discrepancias.push({ campo, actual: actual[campo] ?? null, oferta: snapshot[campo] }); }
      catch { discrepancias.push({ campo, actual: actual[campo] ?? null, oferta: snapshot[campo] }); }
    }
  }
  const estado: EstadoCotejoM11 = discrepancias.length ? 'DISCREPANCIA' : faltantes.length ? 'INFORMACION_INSUFICIENTE' : 'COINCIDE';
  return { estado, faltantes, discrepancias };
}

export function exigirCotejoAcreditadoM11(cotejo: { estado: EstadoCotejoM11; resumen: unknown }, economia: ReturnType<typeof validarCondicionesEconomicasOfertaM11>) {
  if (cotejo.estado === 'COINCIDE' && economia.estado === 'COINCIDE') return;
  const discrepancia = cotejo.estado === 'DISCREPANCIA' || economia.estado === 'DISCREPANCIA';
  throw new ErrorAplicacion(409, discrepancia
    ? 'La Orden de Compra presenta discrepancias con la versión de oferta aceptada; no se formalizó la venta'
    : 'Faltan antecedentes para acreditar la aceptación de la versión ofertada; no se formalizó la venta', 'M11_COTEJO_NO_ACREDITADO');
}

/** Compara identidades estables y exige cobertura uno a uno de toda la oferta aceptada. */
export function prepararTrazabilidadOrdenCompraM11(entrada: unknown, idCotizacion: number, detalles: DetalleAcreditable[], snapshotOferta: unknown, monedaOfertaId: number) {
  if (!Array.isArray(entrada) || !entrada.length || entrada.length > 500) {
    if (entrada !== undefined && entrada !== null && !Array.isArray(entrada)) throw new ErrorAplicacion(400, 'Las líneas de la Orden de Compra deben ser una lista de hasta 500 partidas');
    return { estado: 'INFORMACION_INSUFICIENTE' as const, lineas: [] as LineaOrdenCompraM11[], resumen: { motivo: 'OC sin líneas individualizadas', faltantesOferta: [] as string[], lineasAdicionales: [] as number[] } };
  }
  const idsDetalle = new Set(detalles.filter(detalle => detalle.id_cotizacion === idCotizacion).map(detalle => detalle.id_detalle_cotizacion));
  const oferta = lineasSnapshot(snapshotOferta);
  const ofertaPorClave = new Map<string, LineaOferta>();
  const clavesOfertaDuplicadas = new Set<string>();
  for (const linea of oferta) { const clave = claveOferta(linea); if (!clave) continue; if (ofertaPorClave.has(clave)) clavesOfertaDuplicadas.add(clave); else ofertaPorClave.set(clave, linea); }
  const numeros = new Set<number>(); const referencias = new Set<string>(); const clavesOc = new Set<string>(); const lineasAdicionales: number[] = [];
  const lineas = entrada.map((valor, indice): LineaOrdenCompraM11 => {
    if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new ErrorAplicacion(400, `Línea de OC ${indice + 1} inválida`);
    const item = valor as Json; const numeroLinea = enteroOpcional(item.numeroLinea, 'Número de línea') ?? indice + 1;
    if (numeros.has(numeroLinea)) throw new ErrorAplicacion(400, `La línea ${numeroLinea} está duplicada`); numeros.add(numeroLinea);
    const idDetalleCotizacion = enteroOpcional(item.idDetalleCotizacion, 'Detalle de cotización');
    if (idDetalleCotizacion !== null && !idsDetalle.has(idDetalleCotizacion)) throw new ErrorAplicacion(400, `La línea ${numeroLinea} referencia un detalle ajeno a la cotización`);
    const referenciaComercial = textoOpcional(item.referenciaComercial, 120); const concepto = textoOpcional(item.concepto, 2000);
    const cantidad = decimalOpcional(item.cantidad, 'Cantidad'); const idMoneda = enteroOpcional(item.idMoneda, 'Moneda');
    const precioUnitario = decimalOpcional(item.precioUnitario, 'Precio unitario', true);
    const subtotalExplicito = decimalOpcional(item.subtotal, 'Subtotal', true);
    const subtotalCalculado = cantidad && precioUnitario ? cantidad.mul(precioUnitario).toDecimalPlaces(2) : null;
    const subtotal = subtotalExplicito ?? subtotalCalculado;
    const especificaciones = item.especificaciones === undefined || item.especificaciones === null ? null : objeto(item.especificaciones) as Prisma.InputJsonValue;
    const faltantes: string[] = []; const discrepancias: Array<{ campo: string; oc: unknown; oferta: unknown }> = [];
    if (referenciaComercial && referencias.has(referenciaComercial)) discrepancias.push({ campo: 'referencia_comercial_duplicada', oc: referenciaComercial, oferta: null });
    if (referenciaComercial) referencias.add(referenciaComercial);
    const clave = idDetalleCotizacion !== null ? `DETALLE:${idDetalleCotizacion}` : referenciaComercial ? `REFERENCIA:${referenciaComercial}` : null;
    if (!clave) faltantes.push('identidad_comercial_acreditada');
    if (clave && clavesOc.has(clave)) discrepancias.push({ campo: 'identidad_comercial_duplicada', oc: clave, oferta: null });
    if (clave) clavesOc.add(clave);
    if (cantidad === null) faltantes.push('cantidad_oc'); if (precioUnitario === null) faltantes.push('precio_unitario_oc'); if (idMoneda === null) faltantes.push('moneda_oc');
    const lineaOferta = clave && !clavesOfertaDuplicadas.has(clave) ? ofertaPorClave.get(clave) : undefined;
    if (clave && clavesOfertaDuplicadas.has(clave)) faltantes.push('identidad_duplicada_en_oferta');
    else if (clave && !lineaOferta && oferta.length === 0) faltantes.push('oferta_aceptada_sin_lineas_acreditables');
    else if (clave && !lineaOferta) { discrepancias.push({ campo: 'linea_adicional_no_respaldada', oc: clave, oferta: null }); lineasAdicionales.push(numeroLinea); }
    if (lineaOferta && (lineaOferta.cantidad === null || lineaOferta.cantidad === undefined)) faltantes.push('cantidad_oferta');
    if (lineaOferta && (lineaOferta.precioUnitario === null || lineaOferta.precioUnitario === undefined)) faltantes.push('precio_unitario_oferta');
    if (lineaOferta && cantidad && lineaOferta.cantidad !== null && lineaOferta.cantidad !== undefined && !iguales(cantidad, lineaOferta.cantidad)) discrepancias.push({ campo: 'cantidad', oc: cantidad.toString(), oferta: lineaOferta.cantidad });
    if (lineaOferta && precioUnitario && lineaOferta.precioUnitario !== null && lineaOferta.precioUnitario !== undefined && !iguales(precioUnitario, lineaOferta.precioUnitario)) discrepancias.push({ campo: 'precio_unitario', oc: precioUnitario.toString(), oferta: lineaOferta.precioUnitario });
    if (subtotalExplicito && subtotalCalculado && !subtotalExplicito.eq(subtotalCalculado)) discrepancias.push({ campo: 'subtotal', oc: subtotalExplicito.toString(), oferta: subtotalCalculado.toString() });
    if (idMoneda !== null && idMoneda !== monedaOfertaId) discrepancias.push({ campo: 'moneda', oc: idMoneda, oferta: monedaOfertaId });
    const estadoCotejo: EstadoCotejoM11 = discrepancias.length ? 'DISCREPANCIA' : faltantes.length ? 'INFORMACION_INSUFICIENTE' : 'COINCIDE';
    const cantidadAcreditada = estadoCotejo === 'COINCIDE' && cantidad?.isInteger() ? cantidad.toNumber() : null;
    return { numeroLinea, idDetalleCotizacion, referenciaComercial, concepto, especificaciones, cantidad, idMoneda, precioUnitario, subtotal, estadoCotejo,
      resultadoCotejo: { faltantes, discrepancias, identidad: lineaOferta ? { tipo: lineaOferta.tipo, idDetalleCotizacion, referenciaComercial: lineaOferta.referenciaComercial, codigo: lineaOferta.codigo ?? null, nombre: lineaOferta.nombre ?? null, idProductoComercial: lineaOferta.idProductoComercial ?? null, idVersionProducto: lineaOferta.idVersionProducto ?? null } : null } as Prisma.InputJsonValue,
      correspondenciaTecnicaAcreditada: estadoCotejo === 'COINCIDE' && lineaOferta?.tipo === 'PRODUCTO' && idDetalleCotizacion !== null && cantidadAcreditada !== null, cantidadAcreditada };
  });
  const faltantesOferta = [...ofertaPorClave.keys()].filter(clave => !clavesOc.has(clave)); const ofertaSinIdentidad = oferta.filter(linea => !claveOferta(linea)).length;
  const discrepanciaExplicita = lineasAdicionales.length > 0 || lineas.some(linea => linea.estadoCotejo === 'DISCREPANCIA');
  const hayInsuficiencia = ofertaSinIdentidad > 0 || clavesOfertaDuplicadas.size > 0 || lineas.some(linea => linea.estadoCotejo === 'INFORMACION_INSUFICIENTE');
  const estado: EstadoCotejoM11 = discrepanciaExplicita ? 'DISCREPANCIA' : hayInsuficiencia ? 'INFORMACION_INSUFICIENTE' : faltantesOferta.length ? 'DISCREPANCIA' : 'COINCIDE';
  return { estado, lineas, resumen: { totalLineas: lineas.length, totalLineasOferta: oferta.length, coinciden: lineas.filter(x => x.estadoCotejo === 'COINCIDE').length,
    discrepancias: lineas.filter(x => x.estadoCotejo === 'DISCREPANCIA').length, insuficientes: lineas.filter(x => x.estadoCotejo === 'INFORMACION_INSUFICIENTE').length,
    faltantesOferta, lineasAdicionales, identidadesDuplicadasOferta: [...clavesOfertaDuplicadas], ofertaSinIdentidad } };
}

export function prepararCorrespondenciasTecnicasM11(lineas: LineaOrdenCompraM11[], unidades: UnidadTecnicaM11[]) {
  const resultado: Array<{ numeroLinea: number; idDetalleCotizacion: number; idUnidad: string | number | bigint; idOrdenTrabajo: string | number | bigint }> = [];
  for (const linea of lineas) {
    if (!linea.correspondenciaTecnicaAcreditada || linea.idDetalleCotizacion === null || linea.cantidadAcreditada === null) continue;
    const candidatas = unidades.filter(unidad => unidad.detalle === linea.idDetalleCotizacion);
    if (candidatas.length !== linea.cantidadAcreditada) continue;
    for (const unidad of candidatas) resultado.push({ numeroLinea: linea.numeroLinea, idDetalleCotizacion: linea.idDetalleCotizacion, idUnidad: unidad.idUnidad, idOrdenTrabajo: unidad.idOrdenTrabajo });
  }
  return resultado;
}
