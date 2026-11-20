import { ErrorAplicacion } from './ErrorAplicacion';

/** La tabla usa fechas civiles UTC (@db.Date), no horas. */
export function transicionLimiteGlobalM8(vigenciaActual: Date, vigenciaNueva: Date):
  { tipo: 'sustitucion_mismo_dia' } | { tipo: 'cierre_anterior'; cierre: Date } {
  const anterior = vigenciaActual.getTime();
  const nueva = vigenciaNueva.getTime();
  if (!Number.isFinite(anterior) || !Number.isFinite(nueva)) {
    throw new ErrorAplicacion(400, 'Vigencia inválida');
  }
  if (anterior > nueva) {
    throw new ErrorAplicacion(409, 'Vigencia superpuesta: la nueva fecha precede al límite vigente');
  }
  if (anterior === nueva) return { tipo: 'sustitucion_mismo_dia' };
  const cierre = new Date(vigenciaNueva);
  cierre.setUTCDate(cierre.getUTCDate() - 1);
  return { tipo: 'cierre_anterior', cierre };
}
