"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorAplicacion = void 0;
class ErrorAplicacion extends Error {
    constructor(estado, mensaje, codigo = 'SOLICITUD_INVALIDA') {
        super(mensaje);
        this.estado = estado;
        this.codigo = codigo;
    }
}
exports.ErrorAplicacion = ErrorAplicacion;
//# sourceMappingURL=ErrorAplicacion.js.map