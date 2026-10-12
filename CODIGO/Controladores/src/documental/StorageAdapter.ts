import type { Readable } from 'node:stream';

export type CodigoErrorStorage = 'NO_AUTORIZADO' | 'NO_ENCONTRADO' | 'CONFLICTO' | 'INTEGRIDAD' | 'NO_SOPORTADO' | 'LIMITE' | 'TEMPORAL' | 'DESCONOCIDO';

export interface ErrorStorageNormalizado extends Error {
  codigo: CodigoErrorStorage;
  proveedor: string;
  reintentable: boolean;
  estadoHttp?: number;
}

export interface CapacidadesStorage {
  cargaDirecta: boolean;
  cargaFirmadaPut: boolean;
  formularioFirmadoPost: boolean;
  multipart: boolean;
  versionadoProveedor: boolean;
  retencionProveedor: boolean;
  legalHold: boolean;
  cifradoClaveAdministrada: boolean;
}

export interface ReferenciaObjetoStorage {
  contenedor: string;
  clave: string;
  versionProveedor?: string;
}

export interface IntegridadStorage {
  tamanoBytes: bigint;
  etag?: string;
  sha256Verificado?: string;
  mime?: string;
  versionProveedor?: string;
  metadatosProveedor?: Readonly<Record<string, string>>;
}

export interface UrlFirmadaStorage {
  url: string;
  expiraEn: Date;
  headersObligatorios?: Readonly<Record<string, string>>;
}

export interface CargaIniciadaStorage {
  referencia: ReferenciaObjetoStorage;
  identificadorMultipart?: string;
  idempotente: boolean;
}

export interface ParteMultipartStorage { numero: number; etag: string; checksum?: string }
export interface CargaIncompletaStorage { referencia: ReferenciaObjetoStorage; identificadorMultipart: string; iniciadaEn?: Date }
export interface ParteMultipartFirmadaStorage { numero: number; url: string; expiraEn: Date; headersObligatorios?: Readonly<Record<string, string>> }

/** Puerto técnico. En 4.2 no existe ninguna implementación ni cliente de proveedor. */
export interface StorageAdapter {
  readonly proveedor: string;
  readonly capacidades: Readonly<CapacidadesStorage>;
  iniciarCarga(entrada: { referencia: ReferenciaObjetoStorage; mime: string; tamanoEsperado: bigint; claveIdempotencia: string; multipart?: boolean }): Promise<CargaIniciadaStorage>;
  subirStream?(entrada: { referencia: ReferenciaObjetoStorage; contenido: Readable; mime: string; tamanoEsperado: bigint; sha256?: string }): Promise<IntegridadStorage>;
  firmarCarga?(entrada: { referencia: ReferenciaObjetoStorage; mime: string; tamanoEsperado: bigint; expiraEn: Date }): Promise<UrlFirmadaStorage>;
  consultarObjeto(referencia: ReferenciaObjetoStorage): Promise<IntegridadStorage>;
  abrirLectura?(referencia: ReferenciaObjetoStorage): Promise<Readable>;
  firmarDescarga?(entrada: { referencia: ReferenciaObjetoStorage; expiraEn: Date; nombreDescarga: string }): Promise<UrlFirmadaStorage>;
  copiarObjeto?(entrada: { origen: ReferenciaObjetoStorage; destino: ReferenciaObjetoStorage; claveIdempotencia: string }): Promise<IntegridadStorage>;
  subirParteStream?(entrada: { referencia: ReferenciaObjetoStorage; identificadorMultipart: string; numero: number; contenido: Readable; tamanoEsperado: bigint }): Promise<ParteMultipartStorage>;
  firmarParteMultipart?(entrada: { referencia: ReferenciaObjetoStorage; identificadorMultipart: string; numero: number; tamanoEsperado: bigint; expiraEn: Date }): Promise<ParteMultipartFirmadaStorage>;
  confirmarMultipart?(entrada: { referencia: ReferenciaObjetoStorage; identificadorMultipart: string; partes: readonly ParteMultipartStorage[]; sha256Esperado?: string }): Promise<IntegridadStorage>;
  abortarMultipart?(entrada: { referencia: ReferenciaObjetoStorage; identificadorMultipart: string }): Promise<void>;
  listarCargasIncompletas?(entrada: { contenedor: string; prefijo?: string }): Promise<readonly CargaIncompletaStorage[]>;
  eliminarVersionPermitida?(referencia: ReferenciaObjetoStorage): Promise<void>;
}
