"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarEventoAuditoria = validarEventoAuditoria;
function validarEventoAuditoria(evento) {
    const serializado = JSON.stringify(evento, (_clave, valor) => typeof valor === 'bigint' ? valor.toString() : valor);
    if (/https?:\/\/|token|secret|authorization|base64/i.test(serializado))
        throw new Error('AUDITORIA_CONTIENE_DATO_PROHIBIDO');
}
//# sourceMappingURL=AuditoriaDocumental.js.map