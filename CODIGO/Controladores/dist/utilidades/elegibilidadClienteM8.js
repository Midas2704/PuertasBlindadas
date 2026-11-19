"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fichaActivaParaCreditoM8 = void 0;
const fichaActivaParaCreditoM8 = (ficha) => ficha.estado_ficha.trim().toLowerCase() === 'activa' &&
    ficha.cliente_financiero.estado_financiero.trim().toLowerCase() === 'activo';
exports.fichaActivaParaCreditoM8 = fichaActivaParaCreditoM8;
//# sourceMappingURL=elegibilidadClienteM8.js.map