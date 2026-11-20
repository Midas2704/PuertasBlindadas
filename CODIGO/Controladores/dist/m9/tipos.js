"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIGURACION_M9 = void 0;
exports.CONFIGURACION_M9 = {
    versionesSoportadas: ['1.0'],
    metadatosPermitidos: ['correlationId', 'requestId', 'sourceVersion', 'traceId'],
    maximoPagina: 200,
    maximoTexto: 4000,
    retryLeaseMs: Number(process.env.M9_RETRY_LEASE_MS ?? 30000),
};
//# sourceMappingURL=tipos.js.map