import { ErrorDocumental } from '../tipos';

export const EVENTOS_DOCUMENTALES_PROPUESTOS = [
  'DOCUMENTO_CONSULTADO','DOCUMENTO_CARGA_INICIADA','DOCUMENTO_CARGA_CONFIRMADA',
  'DOCUMENTO_RECHAZADO','DOCUMENTO_CUARENTENA','DOCUMENTO_DISPONIBLE','DOCUMENTO_DESCARGADO',
  'DOCUMENTO_REEMPLAZADO','DOCUMENTO_ASOCIADO_PRODUCTO','DOCUMENTO_IMAGEN_PRINCIPAL_CAMBIADA',
  'DOCUMENTO_USO_COMERCIAL_MODIFICADO','DOCUMENTO_INTEGRIDAD_FALLIDA',
] as const;

export type EventoDocumentalPropuesto = typeof EVENTOS_DOCUMENTALES_PROPUESTOS[number];

export interface DefinicionEventoM9Documental {
  tipo: EventoDocumentalPropuesto;
  productorPropuesto: 'M2';
  operacion: string;
  criticidad: 'BAJA' | 'MEDIA' | 'ALTA';
  requiereIdempotencia: boolean;
  justificacion: string;
  campos: readonly ('ACTOR' | 'ENTIDAD' | 'DOCUMENTO' | 'VERSION' | 'RESULTADO')[];
  estadoAprobacion: 'PENDIENTE_APROBACION';
}

/** Propuesta de catálogo; no registra ni publica eventos por sí misma. */
export const MATRIZ_EVENTOS_M9_DOCUMENTALES: readonly DefinicionEventoM9Documental[] = EVENTOS_DOCUMENTALES_PROPUESTOS.map(tipo => ({
  tipo,
  productorPropuesto: 'M2',
  operacion: tipo,
  criticidad: /INTEGRIDAD|CUARENTENA|RECHAZADO/.test(tipo) ? 'ALTA' : /CARGA|DESCARGADO|REEMPLAZADO|ASOCIADO|PRINCIPAL|USO/.test(tipo) ? 'MEDIA' : 'BAJA',
  requiereIdempotencia: tipo !== 'DOCUMENTO_CONSULTADO',
  justificacion: tipo === 'DOCUMENTO_CONSULTADO' ? 'Evaluar trazabilidad acotada sin registrar cada lectura indiscriminadamente.' : 'Trazabilidad funcional de una mutación o resultado documental relevante.',
  campos: Object.freeze(['ACTOR','ENTIDAD','DOCUMENTO','VERSION','RESULTADO'] as const),
  estadoAprobacion: 'PENDIENTE_APROBACION',
}));

export interface EventoM9DocumentalPreparado {
  tipo: EventoDocumentalPropuesto;
  idempotencia: string;
  actorId: string;
  productoId: number;
  documentoId?: string;
  versionId?: string;
  resultado: 'EXITO' | 'RECHAZADO' | 'ERROR';
  ocurridoEn: string;
  criticidad: 'BAJA' | 'MEDIA' | 'ALTA';
}

export interface PublicadorM9DocumentalAprobado {
  publicar(evento: EventoM9DocumentalPreparado): Promise<{ aceptado: boolean; idempotente: boolean }>;
}

const contieneDatoProhibido = (evento: EventoM9DocumentalPreparado) => /https?:\/\/|token|secret|authorization|base64|password/i.test(JSON.stringify(evento));

/** Puente inactivo por defecto. Sólo publica tipos entregados explícitamente por un catálogo M9 aprobado. */
export class PuenteM9DocumentosProducto {
  constructor(private readonly publicador: PublicadorM9DocumentalAprobado, private readonly eventosAprobados: ReadonlySet<EventoDocumentalPropuesto> = new Set()) {}

  async publicar(evento: EventoM9DocumentalPreparado) {
    if (contieneDatoProhibido(evento)) throw new ErrorDocumental('EVENTO_M9_DATO_PROHIBIDO', 'El evento contiene datos no permitidos', 400);
    if (!this.eventosAprobados.has(evento.tipo)) throw new ErrorDocumental('EVENTO_M9_NO_APROBADO', 'El evento documental permanece pendiente de aprobación M9', 403);
    return this.publicador.publicar(evento);
  }
}
