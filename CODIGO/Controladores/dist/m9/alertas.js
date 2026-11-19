"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.umbralDecimalM9 = exports.MotorAlertasM9 = exports.ConfiguracionAlertasPrismaM9 = exports.ConfiguracionAlertasMemoriaM9 = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../db");
class ConfiguracionAlertasMemoriaM9 {
    constructor(configuraciones = []) {
        this.configuraciones = configuraciones;
    }
    async vigentes() { return this.configuraciones.map(item => ({ ...item })); }
}
exports.ConfiguracionAlertasMemoriaM9 = ConfiguracionAlertasMemoriaM9;
class ConfiguracionAlertasPrismaM9 {
    async vigentes(fecha) { const filas = await db_1.prisma.configuracion_alerta_m9.findMany({ where: { activa: true, vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }] } }); return filas.map(f => ({ codigo: f.codigo, metrica: f.metrica, operador: f.operador, umbral: Number(f.umbral) })); }
}
exports.ConfiguracionAlertasPrismaM9 = ConfiguracionAlertasPrismaM9;
const cumple = (valor, item) => ({ GT: valor > item.umbral, GTE: valor >= item.umbral, LT: valor < item.umbral, LTE: valor <= item.umbral, EQ: valor === item.umbral })[item.operador];
class MotorAlertasM9 {
    constructor(fuente, senales) {
        this.fuente = fuente;
        this.senales = senales;
    }
    async evaluar(metricas, fecha = new Date()) {
        const activadas = [];
        for (const config of await this.fuente.vigentes(fecha)) {
            const valor = metricas[config.metrica];
            if (valor !== undefined && Number.isFinite(valor) && cumple(valor, config)) {
                const senal = { tipo: 'ALERTA_TECNICA', productor: 'M9', codigoConfiguracion: config.codigo, metrica: config.metrica };
                this.senales.emitir(senal);
                activadas.push(senal);
            }
        }
        return activadas;
    }
}
exports.MotorAlertasM9 = MotorAlertasM9;
// Referencia explícita para que la configuración pueda usar Decimal sin conversiones flotantes al persistir.
const umbralDecimalM9 = (valor) => new client_1.Prisma.Decimal(valor);
exports.umbralDecimalM9 = umbralDecimalM9;
//# sourceMappingURL=alertas.js.map