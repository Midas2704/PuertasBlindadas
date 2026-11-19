"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorDocumental = exports.PROVEEDORES_DOCUMENTALES = exports.TIPOS_DOCUMENTO_PRODUCTO = exports.TIPOS_VARIANTE = exports.ESTADOS_OUTBOX = exports.ESTADOS_INTENCION = exports.ESTADOS_VERSION = exports.ESTADOS_DOCUMENTO = void 0;
exports.ESTADOS_DOCUMENTO = ['ACTIVO', 'INACTIVO', 'ARCHIVADO'];
exports.ESTADOS_VERSION = ['PENDIENTE', 'SUBIENDO', 'VALIDANDO', 'DISPONIBLE', 'ERROR', 'CUARENTENA', 'REEMPLAZADO', 'ARCHIVADO'];
exports.ESTADOS_INTENCION = ['PENDIENTE', 'SUBIENDO', 'VALIDANDO', 'DISPONIBLE', 'ERROR', 'CUARENTENA', 'EXPIRADA', 'CANCELADA'];
exports.ESTADOS_OUTBOX = ['PENDIENTE', 'PROCESANDO', 'PROCESADO', 'ERROR', 'DESCARTADO'];
exports.TIPOS_VARIANTE = ['MINIATURA', 'VISTA_PREVIA', 'PDF_OPTIMIZADA'];
exports.TIPOS_DOCUMENTO_PRODUCTO = ['FOTOGRAFIA_COMERCIAL', 'DIAGRAMA_TECNICO', 'FICHA_TECNICA', 'CATALOGO', 'OTRO_AUTORIZADO'];
exports.PROVEEDORES_DOCUMENTALES = ['R2', 'S3'];
class ErrorDocumental extends Error {
    constructor(codigo, mensaje, estadoHttp = 400) {
        super(mensaje);
        this.codigo = codigo;
        this.estadoHttp = estadoHttp;
        this.name = 'ErrorDocumental';
    }
}
exports.ErrorDocumental = ErrorDocumental;
//# sourceMappingURL=tipos.js.map