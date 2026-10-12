export type OperacionAuditoriaDocumental = 'CARGA_SOLICITADA' | 'CARGA_CONFIRMADA' | 'VALIDACION_RECHAZADA' | 'CUARENTENA_APLICADA' | 'DESCARGA_AUTORIZADA' | 'DESCARGA_DENEGADA' | 'REEMPLAZO' | 'ARCHIVADO' | 'CAMBIO_ASOCIACION';

export interface EventoAuditoriaDocumental {
  idempotencia: string;
  operacion: OperacionAuditoriaDocumental;
  actorId: bigint;
  documentoId?: bigint;
  versionId?: bigint;
  entidadTipo?: 'PRODUCTO_COMERCIAL';
  entidadId?: string;
  resultado: 'EXITO' | 'RECHAZADO' | 'ERROR';
  motivoCodigo?: string;
  ocurridoEn: Date;
}

/** Punto de integración: el adaptador M9 sólo podrá activarse tras aprobar productor y operaciones en su catálogo. */
export interface AuditoriaDocumentalPort {
  publicar(evento: EventoAuditoriaDocumental): Promise<{ aceptado: boolean; idempotente: boolean }>;
}

export function validarEventoAuditoria(evento: EventoAuditoriaDocumental): void {
  const serializado = JSON.stringify(evento, (_clave, valor) => typeof valor === 'bigint' ? valor.toString() : valor);
  if (/https?:\/\/|token|secret|authorization|base64/i.test(serializado)) throw new Error('AUDITORIA_CONTIENE_DATO_PROHIBIDO');
}
