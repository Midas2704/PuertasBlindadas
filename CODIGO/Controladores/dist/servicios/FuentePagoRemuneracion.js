"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuentePagoRemuneracionPrisma = exports.FuentePagoRemuneracionNoImplementada = void 0;
const RepositorioPagoRemuneracion_1 = require("./RepositorioPagoRemuneracion");
class FuentePagoRemuneracionNoImplementada {
    async consultarEstado(_tx, _idRemuneracion) {
        return { fuenteDisponible: false, tienePago: false };
    }
}
exports.FuentePagoRemuneracionNoImplementada = FuentePagoRemuneracionNoImplementada;
class FuentePagoRemuneracionPrisma {
    constructor(repositorio = new RepositorioPagoRemuneracion_1.RepositorioPagoRemuneracionPrisma()) {
        this.repositorio = repositorio;
    }
    async consultarEstado(tx, idRemuneracion) {
        const tienePago = await this.repositorio.tienePagoEfectivo(tx, this.repositorio.remuneracion(idRemuneracion));
        return { fuenteDisponible: true, tienePago };
    }
}
exports.FuentePagoRemuneracionPrisma = FuentePagoRemuneracionPrisma;
//# sourceMappingURL=FuentePagoRemuneracion.js.map