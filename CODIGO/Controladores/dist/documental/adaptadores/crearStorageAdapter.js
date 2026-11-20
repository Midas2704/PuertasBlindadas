"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Client = exports.S3CompatibleStorageAdapter = exports.LocalPrivateStorageAdapter = exports.crearStorageAdapterDesdeEntorno = exports.crearStorageAdapter = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
Object.defineProperty(exports, "S3Client", { enumerable: true, get: function () { return client_s3_1.S3Client; } });
const configuracionStorage_1 = require("./configuracionStorage");
const S3CompatibleStorageAdapter_1 = require("./S3CompatibleStorageAdapter");
Object.defineProperty(exports, "S3CompatibleStorageAdapter", { enumerable: true, get: function () { return S3CompatibleStorageAdapter_1.S3CompatibleStorageAdapter; } });
const LocalPrivateStorageAdapter_1 = require("./LocalPrivateStorageAdapter");
Object.defineProperty(exports, "LocalPrivateStorageAdapter", { enumerable: true, get: function () { return LocalPrivateStorageAdapter_1.LocalPrivateStorageAdapter; } });
const crearStorageAdapter = (configuracion, dependencias = {}) => new S3CompatibleStorageAdapter_1.S3CompatibleStorageAdapter(configuracion, dependencias);
exports.crearStorageAdapter = crearStorageAdapter;
/** Construye el adaptador, pero no realiza conexiones ni operaciones remotas. */
const crearStorageAdapterDesdeEntorno = (entorno = process.env, dependencias = {}) => (0, LocalPrivateStorageAdapter_1.modoServidorPersonalHabilitado)(entorno)
    ? new LocalPrivateStorageAdapter_1.LocalPrivateStorageAdapter((0, LocalPrivateStorageAdapter_1.cargarConfiguracionStorageLocalPrivado)(entorno))
    : (0, exports.crearStorageAdapter)((0, configuracionStorage_1.cargarConfiguracionStorage)(entorno), dependencias);
exports.crearStorageAdapterDesdeEntorno = crearStorageAdapterDesdeEntorno;
//# sourceMappingURL=crearStorageAdapter.js.map