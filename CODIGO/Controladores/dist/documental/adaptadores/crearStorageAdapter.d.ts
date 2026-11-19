import { S3Client } from '@aws-sdk/client-s3';
import type { StorageAdapter } from '../StorageAdapter';
import { type ConfiguracionStorage } from './configuracionStorage';
import { S3CompatibleStorageAdapter, type DependenciasS3Compatible } from './S3CompatibleStorageAdapter';
import { LocalPrivateStorageAdapter } from './LocalPrivateStorageAdapter';
export declare const crearStorageAdapter: (configuracion: ConfiguracionStorage, dependencias?: DependenciasS3Compatible) => StorageAdapter;
/** Construye el adaptador, pero no realiza conexiones ni operaciones remotas. */
export declare const crearStorageAdapterDesdeEntorno: (entorno?: NodeJS.ProcessEnv, dependencias?: DependenciasS3Compatible) => StorageAdapter;
export { LocalPrivateStorageAdapter, S3CompatibleStorageAdapter, S3Client };
export type { ConfiguracionStorage, DependenciasS3Compatible };
//# sourceMappingURL=crearStorageAdapter.d.ts.map