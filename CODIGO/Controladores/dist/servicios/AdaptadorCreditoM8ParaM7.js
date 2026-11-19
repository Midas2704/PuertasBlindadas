"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptadorCreditoM8ParaM7 = void 0;
/** Publica en M7 los resultados calculados por el owner M8, sin reinterpretarlos. */
class AdaptadorCreditoM8ParaM7 {
    constructor(credito) {
        this.credito = credito;
    }
    consultarExposicion(consulta) {
        return this.credito.consultarResumenDashboardM7(consulta);
    }
    consultarAlertas(consulta) {
        return this.credito.consultarAlertas(consulta);
    }
}
exports.AdaptadorCreditoM8ParaM7 = AdaptadorCreditoM8ParaM7;
//# sourceMappingURL=AdaptadorCreditoM8ParaM7.js.map