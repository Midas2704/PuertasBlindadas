"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cargarPoliticasActivacionDocumental = exports.crearAntivirusAdapterDesdeEntorno = exports.cargarConfiguracionSeguridadDocumental = exports.AutorizadorDocumental = exports.ClamAvDaemonAdapter = exports.AntivirusNoDisponible = exports.validarIntegridadContenido = exports.ReconciliadorDocumental = exports.ProcesadorOutboxDocumental = exports.ServicioRecuperacionDocumental = exports.CoordinadorCargaDocumental = exports.S3CompatibleStorageAdapter = exports.ErrorStorage = exports.ErrorConfiguracionStorage = exports.cargarConfiguracionStorage = exports.crearStorageAdapterDesdeEntorno = exports.crearStorageAdapter = exports.ServicioDocumental = void 0;
const RepositorioDocumentalPrisma_1 = require("./repositorios/RepositorioDocumentalPrisma");
/**
 * Fachada de metadatos implementada en 4.2. Las operaciones seguras de 4.4 permanecen
 * como componentes internos: no se exponen por HTTP hasta aprobar CU y catálogo M9.
 */
class ServicioDocumental {
    constructor(repositorio = new RepositorioDocumentalPrisma_1.RepositorioDocumentalPrisma(), almacenamiento) {
        this.repositorio = repositorio;
        this.almacenamiento = almacenamiento;
    }
    /** Sólo expone capacidades técnicas; 4.3 no coordina todavía carga con estados persistentes. */
    capacidadesStorage() { return this.almacenamiento?.capacidades ?? null; }
    crearDocumento(entrada, actor) { return this.repositorio.crearDocumento(entrada, actor); }
    consultarDocumento(id) { return this.repositorio.consultarDocumento(id); }
    cambiarEstadoDocumento(id, revision, estado, motivo) { return this.repositorio.cambiarEstadoDocumento(id, revision, estado, motivo); }
    crearIntencion(entrada, actor) { return this.repositorio.crearIntencion(entrada, actor); }
    consultarIntencion(idPublico) { return this.repositorio.consultarIntencion(idPublico); }
    cambiarEstadoIntencion(idPublico, revision, estado, opciones) { return this.repositorio.cambiarEstadoIntencion(idPublico, revision, estado, opciones); }
    registrarVersion(entrada, actor) { return this.repositorio.registrarVersion(entrada, actor); }
    cambiarEstadoVersion(id, revision, estado) { return this.repositorio.cambiarEstadoVersion(id, revision, estado); }
    registrarVariante(idOriginal, idDerivada, tipo, parametros) { return this.repositorio.registrarVariante(idOriginal, idDerivada, tipo, parametros); }
    asociarProducto(entrada, actor) { return this.repositorio.asociarProducto(entrada, actor); }
    listarAsociacionesProducto(idProducto) { return this.repositorio.listarAsociacionesProducto(idProducto); }
    registrarEvento(entrada) { return this.repositorio.registrarEvento(entrada); }
    cambiarEstadoEvento(id, estado, codigoError, leaseToken) { return this.repositorio.cambiarEstadoEvento(id, estado, codigoError, leaseToken); }
}
exports.ServicioDocumental = ServicioDocumental;
var crearStorageAdapter_1 = require("./adaptadores/crearStorageAdapter");
Object.defineProperty(exports, "crearStorageAdapter", { enumerable: true, get: function () { return crearStorageAdapter_1.crearStorageAdapter; } });
Object.defineProperty(exports, "crearStorageAdapterDesdeEntorno", { enumerable: true, get: function () { return crearStorageAdapter_1.crearStorageAdapterDesdeEntorno; } });
var configuracionStorage_1 = require("./adaptadores/configuracionStorage");
Object.defineProperty(exports, "cargarConfiguracionStorage", { enumerable: true, get: function () { return configuracionStorage_1.cargarConfiguracionStorage; } });
Object.defineProperty(exports, "ErrorConfiguracionStorage", { enumerable: true, get: function () { return configuracionStorage_1.ErrorConfiguracionStorage; } });
var S3CompatibleStorageAdapter_1 = require("./adaptadores/S3CompatibleStorageAdapter");
Object.defineProperty(exports, "ErrorStorage", { enumerable: true, get: function () { return S3CompatibleStorageAdapter_1.ErrorStorage; } });
Object.defineProperty(exports, "S3CompatibleStorageAdapter", { enumerable: true, get: function () { return S3CompatibleStorageAdapter_1.S3CompatibleStorageAdapter; } });
var CoordinadorCargaDocumental_1 = require("./operaciones/CoordinadorCargaDocumental");
Object.defineProperty(exports, "CoordinadorCargaDocumental", { enumerable: true, get: function () { return CoordinadorCargaDocumental_1.CoordinadorCargaDocumental; } });
var ServicioRecuperacionDocumental_1 = require("./operaciones/ServicioRecuperacionDocumental");
Object.defineProperty(exports, "ServicioRecuperacionDocumental", { enumerable: true, get: function () { return ServicioRecuperacionDocumental_1.ServicioRecuperacionDocumental; } });
var ProcesadorOutboxDocumental_1 = require("./operaciones/ProcesadorOutboxDocumental");
Object.defineProperty(exports, "ProcesadorOutboxDocumental", { enumerable: true, get: function () { return ProcesadorOutboxDocumental_1.ProcesadorOutboxDocumental; } });
var ReconciliadorDocumental_1 = require("./operaciones/ReconciliadorDocumental");
Object.defineProperty(exports, "ReconciliadorDocumental", { enumerable: true, get: function () { return ReconciliadorDocumental_1.ReconciliadorDocumental; } });
var IntegridadContenido_1 = require("./seguridad/IntegridadContenido");
Object.defineProperty(exports, "validarIntegridadContenido", { enumerable: true, get: function () { return IntegridadContenido_1.validarIntegridadContenido; } });
var AntivirusAdapter_1 = require("./seguridad/AntivirusAdapter");
Object.defineProperty(exports, "AntivirusNoDisponible", { enumerable: true, get: function () { return AntivirusAdapter_1.AntivirusNoDisponible; } });
Object.defineProperty(exports, "ClamAvDaemonAdapter", { enumerable: true, get: function () { return AntivirusAdapter_1.ClamAvDaemonAdapter; } });
var AutorizacionDocumental_1 = require("./seguridad/AutorizacionDocumental");
Object.defineProperty(exports, "AutorizadorDocumental", { enumerable: true, get: function () { return AutorizacionDocumental_1.AutorizadorDocumental; } });
var configuracionSeguridadDocumental_1 = require("./seguridad/configuracionSeguridadDocumental");
Object.defineProperty(exports, "cargarConfiguracionSeguridadDocumental", { enumerable: true, get: function () { return configuracionSeguridadDocumental_1.cargarConfiguracionSeguridadDocumental; } });
Object.defineProperty(exports, "crearAntivirusAdapterDesdeEntorno", { enumerable: true, get: function () { return configuracionSeguridadDocumental_1.crearAntivirusAdapterDesdeEntorno; } });
var PoliticasActivacionDocumental_1 = require("./seguridad/PoliticasActivacionDocumental");
Object.defineProperty(exports, "cargarPoliticasActivacionDocumental", { enumerable: true, get: function () { return PoliticasActivacionDocumental_1.cargarPoliticasActivacionDocumental; } });
__exportStar(require("./tipos"), exports);
//# sourceMappingURL=ServicioDocumental.js.map