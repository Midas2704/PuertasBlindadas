import { ErrorDocumental, EstadoDocumento, EstadoIntencion, EstadoOutbox, EstadoVersion } from './tipos';

const transicionesDocumento: Record<EstadoDocumento, readonly EstadoDocumento[]> = {
  ACTIVO: ['INACTIVO', 'ARCHIVADO'],
  INACTIVO: ['ACTIVO', 'ARCHIVADO'],
  ARCHIVADO: [],
};

const transicionesVersion: Record<EstadoVersion, readonly EstadoVersion[]> = {
  PENDIENTE: ['SUBIENDO', 'ERROR'],
  SUBIENDO: ['VALIDANDO', 'ERROR'],
  VALIDANDO: ['DISPONIBLE', 'ERROR', 'CUARENTENA'],
  DISPONIBLE: ['REEMPLAZADO', 'ARCHIVADO'],
  ERROR: ['PENDIENTE'],
  CUARENTENA: ['VALIDANDO', 'ARCHIVADO'],
  REEMPLAZADO: ['ARCHIVADO'],
  ARCHIVADO: [],
};

const transicionesIntencion: Record<EstadoIntencion, readonly EstadoIntencion[]> = {
  PENDIENTE: ['SUBIENDO', 'ERROR', 'CANCELADA', 'EXPIRADA'],
  SUBIENDO: ['VALIDANDO', 'ERROR', 'CANCELADA', 'EXPIRADA'],
  VALIDANDO: ['DISPONIBLE', 'ERROR', 'CUARENTENA'],
  DISPONIBLE: [],
  ERROR: ['PENDIENTE'],
  CUARENTENA: ['VALIDANDO'],
  EXPIRADA: [],
  CANCELADA: [],
};

const transicionesOutbox: Record<EstadoOutbox, readonly EstadoOutbox[]> = {
  PENDIENTE: ['PROCESANDO', 'DESCARTADO'],
  PROCESANDO: ['PROCESADO', 'ERROR'],
  PROCESADO: [],
  ERROR: ['PENDIENTE', 'DESCARTADO'],
  DESCARTADO: [],
};

function exigir<T extends string>(mapa: Record<T, readonly T[]>, actual: T, siguiente: T, entidad: string) {
  if (actual === siguiente || !mapa[actual]?.includes(siguiente)) {
    throw new ErrorDocumental('TRANSICION_INVALIDA', `Transición ${entidad} no permitida: ${actual} -> ${siguiente}`, 409);
  }
}

export const exigirTransicionDocumento = (actual: EstadoDocumento, siguiente: EstadoDocumento) => exigir(transicionesDocumento, actual, siguiente, 'de documento');
export const exigirTransicionVersion = (actual: EstadoVersion, siguiente: EstadoVersion) => exigir(transicionesVersion, actual, siguiente, 'de versión');
export const exigirTransicionIntencion = (actual: EstadoIntencion, siguiente: EstadoIntencion) => exigir(transicionesIntencion, actual, siguiente, 'de intención');
export const exigirTransicionOutbox = (actual: EstadoOutbox, siguiente: EstadoOutbox) => exigir(transicionesOutbox, actual, siguiente, 'de outbox');

export const matrizTransicionesDocumentales = Object.freeze({
  documento: transicionesDocumento,
  version: transicionesVersion,
  intencion: transicionesIntencion,
  outbox: transicionesOutbox,
});
