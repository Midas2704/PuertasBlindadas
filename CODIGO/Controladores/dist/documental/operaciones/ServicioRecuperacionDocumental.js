"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioRecuperacionDocumental = void 0;
const tipos_1 = require("../tipos");
class ServicioRecuperacionDocumental {
    constructor(storage, consultarVersion, autorizar, vigenciaMaximaSegundos = 300) {
        this.storage = storage;
        this.consultarVersion = consultarVersion;
        this.autorizar = autorizar;
        this.vigenciaMaximaSegundos = vigenciaMaximaSegundos;
    }
    async firmar(entrada) {
        const version = await this.consultarVersion(entrada.idVersion);
        if (!version)
            throw new tipos_1.ErrorDocumental('VERSION_NO_ENCONTRADA', 'Versión documental no encontrada', 404);
        await this.autorizar(entrada.actor, version);
        if (version.proveedor_logico !== this.storage.proveedor)
            throw new tipos_1.ErrorDocumental('PROVEEDOR_NO_COINCIDE', 'La versión pertenece a otro proveedor de almacenamiento', 409);
        const antivirus = version.resultado_validaciones?.antivirus?.estado;
        if (version.estado !== 'DISPONIBLE' || !version.sha256 || !version.mime_detectado || antivirus !== 'LIMPIO')
            throw new tipos_1.ErrorDocumental('VERSION_NO_RECUPERABLE', 'La versión no superó todos los controles de disponibilidad', 409);
        if (!this.storage.firmarDescarga)
            throw new tipos_1.ErrorDocumental('DESCARGA_NO_SOPORTADA', 'El proveedor no permite descarga firmada', 503);
        const segundos = Math.max(1, Math.min(entrada.vigenciaSegundos ?? 120, this.vigenciaMaximaSegundos));
        const firmada = await this.storage.firmarDescarga({ referencia: { contenedor: version.contenedor_logico, clave: version.clave_objeto }, expiraEn: new Date(Date.now() + segundos * 1000), nombreDescarga: version.nombre_seguro, mimeRespuesta: version.mime_detectado, cacheControlRespuesta: 'private, no-store' });
        return { ...firmada, headersRespuestaRequeridos: { ...firmada.headersRespuestaRequeridos, 'x-content-type-options': 'nosniff' } };
    }
}
exports.ServicioRecuperacionDocumental = ServicioRecuperacionDocumental;
//# sourceMappingURL=ServicioRecuperacionDocumental.js.map