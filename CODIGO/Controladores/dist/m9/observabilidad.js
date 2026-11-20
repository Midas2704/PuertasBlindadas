"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilidadM9 = void 0;
class ObservabilidadM9 {
    constructor() {
        this.contadores = { recibidos: 0, persistidos: 0, rechazados: 0, fallosPersistencia: 0 };
        this.latencias = { ingesta: [], persistencia: [], consulta: [] };
        this.productores = new Map();
    }
    incrementar(clave) { this.contadores[clave]++; }
    latencia(clave, valor) { this.latencias[clave].push(Math.max(0, valor)); }
    productor(nombre, tipo) {
        const actual = this.productores.get(nombre) ?? { recibidos: 0, persistidos: 0, fallos: 0 };
        actual[tipo]++;
        this.productores.set(nombre, actual);
    }
    snapshot() {
        const promedio = (valores) => valores.length ? valores.reduce((suma, valor) => suma + valor, 0) / valores.length : null;
        return { ...this.contadores, latenciaMs: { ingesta: promedio(this.latencias.ingesta), persistencia: promedio(this.latencias.persistencia), consulta: promedio(this.latencias.consulta) }, productores: Object.fromEntries(this.productores) };
    }
}
exports.ObservabilidadM9 = ObservabilidadM9;
//# sourceMappingURL=observabilidad.js.map