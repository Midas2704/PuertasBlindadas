import { Prisma } from '@prisma/client';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';

export type EstadoCotejoM11 = 'COINCIDE' | 'DISCREPANCIA' | 'INFORMACION_INSUFICIENTE';

type Json = Record<string, unknown>;
type DetalleAcreditable = { id_detalle_cotizacion: number; id_cotizacion: number };
type LineaOferta = {
  idDetalleCotizacion?: number | null;
  idProductoComercial?: number | null;
  idVersionProducto?: number | null;
  codigo?: string | null;
  nombre?: string | null;
  cantidad?: number | null;
  precioUnitario?: number | null;
};

export type LineaOrdenCompraM11 = {
  numeroLinea: number;
  idDetalleCotizacion: number | null;
  referenciaComercial: string | null;
  concepto: string | null;
  especificaciones: Prisma.InputJsonValue | null;
  cantidad: Prisma.Decimal | null;
  idMoneda: number | null;
  precioUnitario: Prisma.Decimal | null;
  subtotal: Prisma.Decimal | null;
  estadoCotejo: EstadoCotejoM11;
  resultadoCotejo: Prisma.InputJsonValue;
};

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
const lineasSnapshot = (snapshot: unknown): LineaOferta[] => {
  const productos = objeto(snapshot).productos;
  if (!Array.isArray(productos)) return [];
  return productos.filter(item => item && typeof item === 'object' && !Array.isArray(item)).map(item => item as LineaOferta);
};
const iguales = (a: Prisma.Decimal, b: unknown) => {
  try { return a.eq(new Prisma.Decimal(String(b))); } catch { return false; }
};

/**
 * Compara exclusivamente identidades estables y valores presentes en OC y snapshot.
 * Nunca busca por similitud textual, importe total ni posición de la línea.
 */
export function prepararTrazabilidadOrdenCompraM11(
  entrada: unknown,
  idCotizacion: number,
  detalles: DetalleAcreditable[],
  snapshotOferta: unknown,
  monedaOfertaId: number,
) {
  if (entrada === undefined || entrada === null) return { estado: 'INFORMACION_INSUFICIENTE' as const, lineas: [] as LineaOrdenCompraM11[], resumen: { motivo: 'OC sin líneas individualizadas' } };
  if (!Array.isArray(entrada) || entrada.length > 500) throw new ErrorAplicacion(400, 'Las líneas de la Orden de Compra deben ser una lista de hasta 500 partidas');
  const idsDetalle = new Set(detalles.filter(detalle => detalle.id_cotizacion === idCotizacion).map(detalle => detalle.id_detalle_cotizacion));
  const oferta = lineasSnapshot(snapshotOferta);
  const numeros = new Set<number>();
  const lineas = entrada.map((valor, indice): LineaOrdenCompraM11 => {
    if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new ErrorAplicacion(400, `Línea de OC ${indice + 1} inválida`);
    const item = valor as Json;
    const numeroLinea = enteroOpcional(item.numeroLinea, 'Número de línea') ?? indice + 1;
    if (numeros.has(numeroLinea)) throw new ErrorAplicacion(400, `La línea ${numeroLinea} está duplicada`);
    numeros.add(numeroLinea);
    const idDetalleCotizacion = enteroOpcional(item.idDetalleCotizacion, 'Detalle de cotización');
    if (idDetalleCotizacion !== null && !idsDetalle.has(idDetalleCotizacion)) throw new ErrorAplicacion(400, `La línea ${numeroLinea} referencia un detalle ajeno a la cotización`);
    const referenciaComercial = textoOpcional(item.referenciaComercial, 120);
    const concepto = textoOpcional(item.concepto, 2000);
    const cantidad = decimalOpcional(item.cantidad, 'Cantidad');
    const idMoneda = enteroOpcional(item.idMoneda, 'Moneda');
    const precioUnitario = decimalOpcional(item.precioUnitario, 'Precio unitario', true);
    const subtotal = decimalOpcional(item.subtotal, 'Subtotal', true) ?? (cantidad && precioUnitario ? cantidad.mul(precioUnitario).toDecimalPlaces(2) : null);
    const especificaciones = item.especificaciones === undefined || item.especificaciones === null ? null : objeto(item.especificaciones) as Prisma.InputJsonValue;
    const faltantes: string[] = [];
    if (idDetalleCotizacion === null) faltantes.push('identidad_comercial_acreditada');
    if (cantidad === null) faltantes.push('cantidad_oc');
    if (precioUnitario === null) faltantes.push('precio_unitario_oc');
    if (idMoneda === null) faltantes.push('moneda_oc');
    const lineaOferta = idDetalleCotizacion === null ? undefined : oferta.find(linea => Number(linea.idDetalleCotizacion) === idDetalleCotizacion);
    if (idDetalleCotizacion !== null && !lineaOferta) faltantes.push('detalle_en_oferta_aceptada');
    if (lineaOferta && (lineaOferta.cantidad === null || lineaOferta.cantidad === undefined)) faltantes.push('cantidad_oferta');
    if (lineaOferta && (lineaOferta.precioUnitario === null || lineaOferta.precioUnitario === undefined)) faltantes.push('precio_unitario_oferta');
    const discrepancias: Array<{ campo: string; oc: unknown; oferta: unknown }> = [];
    if (lineaOferta && cantidad && lineaOferta.cantidad !== null && lineaOferta.cantidad !== undefined && !iguales(cantidad, lineaOferta.cantidad)) discrepancias.push({ campo: 'cantidad', oc: cantidad.toString(), oferta: lineaOferta.cantidad });
    if (lineaOferta && precioUnitario && lineaOferta.precioUnitario !== null && lineaOferta.precioUnitario !== undefined && !iguales(precioUnitario, lineaOferta.precioUnitario)) discrepancias.push({ campo: 'precio_unitario', oc: precioUnitario.toString(), oferta: lineaOferta.precioUnitario });
    if (idMoneda !== null && idMoneda !== monedaOfertaId) discrepancias.push({ campo: 'moneda', oc: idMoneda, oferta: monedaOfertaId });
    const estadoCotejo: EstadoCotejoM11 = discrepancias.length ? 'DISCREPANCIA' : faltantes.length ? 'INFORMACION_INSUFICIENTE' : 'COINCIDE';
    return { numeroLinea, idDetalleCotizacion, referenciaComercial, concepto, especificaciones, cantidad, idMoneda, precioUnitario, subtotal, estadoCotejo,
      resultadoCotejo: { faltantes, discrepancias, identidad: lineaOferta ? { idDetalleCotizacion, codigo: lineaOferta.codigo ?? null, nombre: lineaOferta.nombre ?? null, idProductoComercial: lineaOferta.idProductoComercial ?? null, idVersionProducto: lineaOferta.idVersionProducto ?? null } : null } as Prisma.InputJsonValue };
  });
  const estado: EstadoCotejoM11 = lineas.some(linea => linea.estadoCotejo === 'DISCREPANCIA') ? 'DISCREPANCIA'
    : lineas.length && lineas.every(linea => linea.estadoCotejo === 'COINCIDE') ? 'COINCIDE' : 'INFORMACION_INSUFICIENTE';
  return { estado, lineas, resumen: { totalLineas: lineas.length, coinciden: lineas.filter(x => x.estadoCotejo === 'COINCIDE').length, discrepancias: lineas.filter(x => x.estadoCotejo === 'DISCREPANCIA').length, insuficientes: lineas.filter(x => x.estadoCotejo === 'INFORMACION_INSUFICIENTE').length } };
}
