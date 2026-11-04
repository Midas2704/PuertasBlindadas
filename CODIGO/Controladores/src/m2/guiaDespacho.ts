import { Prisma } from '@prisma/client';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { texto } from '../validaciones/solicitudes';

type GuiaModificable = { estado: string };

export function prepararModificacionGuia(guia: GuiaModificable, entrada: Record<string, unknown>) {
  if (['cerrada','finalizada','anulada'].includes(String(guia.estado).toLowerCase())) throw new ErrorAplicacion(409, 'La Guía de Despacho ya no permite modificaciones');
  const folio = texto(entrada.folio, 80); if (!folio) throw new ErrorAplicacion(400, 'El folio es obligatorio');
  const camposProtegidos = ['id_guia_despacho','id_nota_venta','fecha_emision','estado'];
  if (camposProtegidos.some(campo => Object.prototype.hasOwnProperty.call(entrada,campo))) throw new ErrorAplicacion(400, 'La solicitud intenta modificar campos protegidos de la Guía de Despacho');
  const antecedentes = entrada.antecedentes;
  if (antecedentes === undefined) return { folio };
  if (typeof antecedentes !== 'object' || antecedentes === null || Array.isArray(antecedentes)) throw new ErrorAplicacion(400, 'Antecedentes inválidos');
  try { return { folio, antecedentes:JSON.parse(JSON.stringify(antecedentes)) as Prisma.InputJsonObject }; }
  catch { throw new ErrorAplicacion(400, 'Antecedentes inválidos'); }
}
