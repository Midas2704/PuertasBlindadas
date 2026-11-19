"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clienteAceptableB2B = clienteAceptableB2B;
const normalizar = (valor) => typeof valor === 'string' ? valor.trim().toUpperCase() : '';
function clienteAceptableB2B(d) {
    return normalizar(d.segmentoCotizacion) === 'B2B'
        && normalizar(d.tipoCliente) === 'B2B'
        && normalizar(d.estadoCliente) === 'ACTIVO'
        && normalizar(d.estadoFicha) === 'ACTIVA';
}
//# sourceMappingURL=validarAceptacionB2B.js.map