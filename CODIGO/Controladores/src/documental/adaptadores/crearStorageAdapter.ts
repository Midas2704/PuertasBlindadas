import { S3Client } from '@aws-sdk/client-s3';
import type { StorageAdapter } from '../StorageAdapter';
import { cargarConfiguracionStorage, type ConfiguracionStorage } from './configuracionStorage';
import { S3CompatibleStorageAdapter, type DependenciasS3Compatible } from './S3CompatibleStorageAdapter';

export const crearStorageAdapter = (
  configuracion: ConfiguracionStorage,
  dependencias: DependenciasS3Compatible = {},
): StorageAdapter => new S3CompatibleStorageAdapter(configuracion, dependencias);

/** Construye el adaptador, pero no realiza conexiones ni operaciones remotas. */
export const crearStorageAdapterDesdeEntorno = (
  entorno: NodeJS.ProcessEnv = process.env,
  dependencias: DependenciasS3Compatible = {},
): StorageAdapter => crearStorageAdapter(cargarConfiguracionStorage(entorno), dependencias);

export { S3CompatibleStorageAdapter, S3Client };
export type { ConfiguracionStorage, DependenciasS3Compatible };
