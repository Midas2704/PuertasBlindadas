"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.matrizTransicionesDocumentales = exports.exigirTransicionOutbox = exports.exigirTransicionIntencion = exports.exigirTransicionVersion = exports.exigirTransicionDocumento = void 0;
const tipos_1 = require("./tipos");
const transicionesDocumento = {
    ACTIVO: ['INACTIVO', 'ARCHIVADO'],
    INACTIVO: ['ACTIVO', 'ARCHIVADO'],
    ARCHIVADO: [],
};
const transicionesVersion = {
    PENDIENTE: ['SUBIENDO', 'ERROR'],
    SUBIENDO: ['VALIDANDO', 'ERROR'],
    VALIDANDO: ['DISPONIBLE', 'ERROR', 'CUARENTENA'],
    DISPONIBLE: ['REEMPLAZADO', 'ARCHIVADO'],
    ERROR: ['PENDIENTE'],
    CUARENTENA: ['VALIDANDO', 'ARCHIVADO'],
    REEMPLAZADO: ['ARCHIVADO'],
    ARCHIVADO: [],
};
const transicionesIntencion = {
    PENDIENTE: ['SUBIENDO', 'ERROR', 'CANCELADA', 'EXPIRADA'],
    SUBIENDO: ['VALIDANDO', 'ERROR', 'CANCELADA', 'EXPIRADA'],
    VALIDANDO: ['DISPONIBLE', 'ERROR', 'CUARENTENA'],
    DISPONIBLE: [],
    ERROR: ['PENDIENTE'],
    CUARENTENA: ['VALIDANDO'],
    EXPIRADA: [],
    CANCELADA: [],
};
const transicionesOutbox = {
    PENDIENTE: ['PROCESANDO', 'DESCARTADO'],
    PROCESANDO: ['PROCESADO', 'ERROR'],
    PROCESADO: [],
    ERROR: ['PENDIENTE', 'DESCARTADO'],
    DESCARTADO: [],
};
function exigir(mapa, actual, siguiente, entidad) {
    if (actual === siguiente || !mapa[actual]?.includes(siguiente)) {
        throw new tipos_1.ErrorDocumental('TRANSICION_INVALIDA', `Transición ${entidad} no permitida: ${actual} -> ${siguiente}`, 409);
    }
}
const exigirTransicionDocumento = (actual, siguiente) => exigir(transicionesDocumento, actual, siguiente, 'de documento');
exports.exigirTransicionDocumento = exigirTransicionDocumento;
const exigirTransicionVersion = (actual, siguiente) => exigir(transicionesVersion, actual, siguiente, 'de versión');
exports.exigirTransicionVersion = exigirTransicionVersion;
const exigirTransicionIntencion = (actual, siguiente) => exigir(transicionesIntencion, actual, siguiente, 'de intención');
exports.exigirTransicionIntencion = exigirTransicionIntencion;
const exigirTransicionOutbox = (actual, siguiente) => exigir(transicionesOutbox, actual, siguiente, 'de outbox');
exports.exigirTransicionOutbox = exigirTransicionOutbox;
exports.matrizTransicionesDocumentales = Object.freeze({
    documento: transicionesDocumento,
    version: transicionesVersion,
    intencion: transicionesIntencion,
    outbox: transicionesOutbox,
});
//# sourceMappingURL=estados.js.map