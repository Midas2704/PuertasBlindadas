"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transicionLimiteGlobalM8 = transicionLimiteGlobalM8;
const ErrorAplicacion_1 = require("./ErrorAplicacion");
/** La tabla usa fechas civiles UTC (@db.Date), no horas. */
function transicionLimiteGlobalM8(vigenciaActual, vigenciaNueva) {
    const anterior = vigenciaActual.getTime();
    const nueva = vigenciaNueva.getTime();
    if (!Number.isFinite(anterior) || !Number.isFinite(nueva)) {
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Vigencia inválida');
    }
    if (anterior > nueva) {
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Vigencia superpuesta: la nueva fecha precede al límite vigente');
    }
    if (anterior === nueva)
        return { tipo: 'sustitucion_mismo_dia' };
    const cierre = new Date(vigenciaNueva);
    cierre.setUTCDate(cierre.getUTCDate() - 1);
    return { tipo: 'cierre_anterior', cierre };
}
//# sourceMappingURL=transicionLimiteGlobalM8.js.map