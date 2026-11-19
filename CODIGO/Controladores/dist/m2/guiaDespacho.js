"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepararModificacionGuia = prepararModificacionGuia;
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const solicitudes_1 = require("../validaciones/solicitudes");
function prepararModificacionGuia(guia, entrada) {
    if (['cerrada', 'finalizada', 'anulada'].includes(String(guia.estado).toLowerCase()))
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La Guía de Despacho ya no permite modificaciones');
    const folio = (0, solicitudes_1.texto)(entrada.folio, 80);
    if (!folio)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El folio es obligatorio');
    const camposProtegidos = ['id_guia_despacho', 'id_nota_venta', 'fecha_emision', 'estado'];
    if (camposProtegidos.some(campo => Object.prototype.hasOwnProperty.call(entrada, campo)))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La solicitud intenta modificar campos protegidos de la Guía de Despacho');
    const antecedentes = entrada.antecedentes;
    if (antecedentes === undefined)
        return { folio };
    if (typeof antecedentes !== 'object' || antecedentes === null || Array.isArray(antecedentes))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Antecedentes inválidos');
    try {
        return { folio, antecedentes: JSON.parse(JSON.stringify(antecedentes)) };
    }
    catch {
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Antecedentes inválidos');
    }
}
//# sourceMappingURL=guiaDespacho.js.map