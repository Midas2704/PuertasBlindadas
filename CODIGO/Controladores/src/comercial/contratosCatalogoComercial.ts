export type SegmentoComercial = 'B2B' | 'B2C';
export type EstadoConsultaComercial = 'VIGENTE' | 'SIN_PRECIO' | 'SIN_COBERTURA' | 'REQUIERE_EVALUACION' | 'NO_DISPONIBLE';

export type TarifaResoluble = {
  id: string;
  alcance: string;
  regionNormalizada: string;
  comunaNormalizada: string | null;
  estadoCobertura: string;
  precio: number | null;
  moneda: string | null;
  vigenciaDesde: string;
  vigenciaHasta: string | null;
  condiciones?: string | null;
};

export type ResolucionCobertura = {
  estado: EstadoConsultaComercial;
  origen: 'COMUNA' | 'REGION' | 'NINGUNO';
  tarifa: TarifaResoluble | null;
  mensaje: string;
};

export const normalizarUbicacion = (valor: unknown) => String(valor ?? '')
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ').toUpperCase();

export const fechaComercial = (valor: unknown, defecto = new Date()) => {
  const texto = typeof valor === 'string' ? valor.trim() : '';
  const fecha = texto ? new Date(`${texto.slice(0, 10)}T12:00:00.000Z`) : defecto;
  if (!Number.isFinite(fecha.getTime())) throw new Error('La fecha comercial no es válida');
  return fecha;
};

export const estaVigente = (desde: Date, hasta: Date | null, fecha: Date) =>
  desde <= fecha && (hasta === null || hasta >= fecha);

/** La coincidencia comunal, incluso una exclusión, prevalece sobre el fallback regional. */
export function resolverCoberturaDesdeTarifas(
  tarifas: TarifaResoluble[], region: string, comuna: string | null | undefined,
): ResolucionCobertura {
  const regionNormalizada = normalizarUbicacion(region);
  const comunaNormalizada = normalizarUbicacion(comuna) || null;
  const candidatas = tarifas.filter(item => item.regionNormalizada === regionNormalizada);
  const exacta = comunaNormalizada
    ? candidatas.find(item => item.comunaNormalizada === comunaNormalizada && item.alcance === 'COMUNA')
    : undefined;
  const elegida = exacta ?? candidatas.find(item => item.alcance === 'REGION' && item.comunaNormalizada === null);
  const origen = exacta ? 'COMUNA' : elegida ? 'REGION' : 'NINGUNO';
  if (!elegida) return { estado: 'SIN_COBERTURA', origen, tarifa: null, mensaje: 'No existe cobertura comercial configurada para la ubicación' };
  if (elegida.estadoCobertura === 'NO_DISPONIBLE') return { estado: 'NO_DISPONIBLE', origen, tarifa: elegida, mensaje: 'Instalación no disponible para la ubicación' };
  if (elegida.estadoCobertura === 'REQUIERE_EVALUACION') return { estado: 'REQUIERE_EVALUACION', origen, tarifa: elegida, mensaje: 'Instalación sujeta a evaluación comercial' };
  if (elegida.estadoCobertura !== 'DISPONIBLE' || elegida.precio === null || !elegida.moneda) {
    return { estado: 'SIN_COBERTURA', origen, tarifa: elegida, mensaje: 'La cobertura no posee una tarifa comercial vigente' };
  }
  return { estado: 'VIGENTE', origen, tarifa: elegida, mensaje: 'Tarifa comercial vigente' };
}
