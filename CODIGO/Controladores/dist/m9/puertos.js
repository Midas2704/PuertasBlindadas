"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SenalesMemoriaM9 = exports.RetryMemoriaM9 = exports.PendientesMemoriaM9 = exports.DiagnosticosMemoriaM9 = exports.RelojFijoM9 = exports.RelojSistemaM9 = void 0;
class RelojSistemaM9 {
    ahora() { return new Date(); }
}
exports.RelojSistemaM9 = RelojSistemaM9;
class RelojFijoM9 {
    constructor(instante) {
        this.instante = instante;
    }
    ahora() { return new Date(this.instante); }
    fijar(instante) { this.instante = new Date(instante); }
}
exports.RelojFijoM9 = RelojFijoM9;
class DiagnosticosMemoriaM9 {
    constructor() {
        this.items = [];
    }
    registrar(item) { this.items.push({ ...item }); }
    listar() { return this.items.map(item => ({ ...item })); }
}
exports.DiagnosticosMemoriaM9 = DiagnosticosMemoriaM9;
class PendientesMemoriaM9 {
    constructor() {
        this.items = [];
    }
    async guardar(item) {
        if (!this.items.some(actual => actual.identidadLogica === item.identidadLogica))
            this.items.push({ ...item, id: this.items.length + 1, estado: 'PENDIENTE', proximoIntentoEn: new Date(item.creadoEn), resueltoEn: null, ultimoErrorCodigo: null, ultimoErrorEn: null });
    }
    async listar() { return this.items.map(item => ({ ...item })); }
    async elegibles(ahora, limite) { return this.items.filter(item => item.estado !== 'RESUELTO' && item.proximoIntentoEn <= ahora).slice(0, limite).map(item => ({ ...item })); }
    async reclamar(id, ahora, leaseHasta) { const item = this.items.find(actual => actual.id === id && actual.estado !== 'RESUELTO' && actual.proximoIntentoEn <= ahora); if (!item)
        return false; item.estado = 'REINTENTANDO'; item.proximoIntentoEn = new Date(leaseHasta); return true; }
    async registrarResultado(id, resultado, fecha, errorCodigo, proximoIntentoEn) {
        const item = this.items.find(actual => actual.id === id);
        if (!item)
            return;
        item.intentos++;
        item.ultimoErrorCodigo = resultado === 'FALLIDO' ? errorCodigo ?? 'M9_RETRY_FALLIDO' : null;
        item.ultimoErrorEn = resultado === 'FALLIDO' ? new Date(fecha) : null;
        if (resultado === 'EXITOSO') {
            item.estado = 'RESUELTO';
            item.resueltoEn = new Date(fecha);
        }
        else {
            item.estado = 'PENDIENTE';
            item.proximoIntentoEn = new Date(proximoIntentoEn ?? fecha);
        }
    }
}
exports.PendientesMemoriaM9 = PendientesMemoriaM9;
class RetryMemoriaM9 {
    constructor(estado = { exitosos: 0, fallidos: 0 }) {
        this.estado = estado;
    }
    async resumen() { return { ...this.estado }; }
    fijar(estado) { this.estado = { ...estado }; }
}
exports.RetryMemoriaM9 = RetryMemoriaM9;
class SenalesMemoriaM9 {
    constructor() {
        this.senales = [];
    }
    emitir(senal) { this.senales.push({ ...senal }); }
    listar() { return this.senales.map(senal => ({ ...senal })); }
}
exports.SenalesMemoriaM9 = SenalesMemoriaM9;
//# sourceMappingURL=puertos.js.map