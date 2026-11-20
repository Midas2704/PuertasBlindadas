"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceptorPostM9 = void 0;
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const seguridad_1 = require("./seguridad");
const compactar = (valor) => Object.fromEntries(Object.entries(valor).filter(([, contenido]) => contenido !== undefined));
const datosOwner = (entrada) => compactar({ finalidadRef: entrada.finalidadRef, baseRef: entrada.baseRef, politicaRef: entrada.politicaRef });
class ReceptorPostM9 {
    constructor(m9) {
        this.m9 = m9;
    }
    async recibirDerecho(entrada) {
        (0, seguridad_1.validarSinSecretos)(entrada);
        if (!entrada.owner.trim() || !entrada.referenciaOwner.trim())
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Owner o referencia ausente', 'M9_OWNER_INVALIDO');
        if (entrada.tipo === 'RESOLUCION' && (!entrada.decision || !entrada.fundamentoRef?.trim()))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La resolución debe venir decidida y fundada por el owner', 'M9_DEPENDENCIA_OWNER');
        const nuevo = compactar({ tipo: entrada.tipo, estado: entrada.estado, fechaAcuse: entrada.fechaAcuse, fechaInicio: entrada.fechaInicio, fechaFin: entrada.fechaFin, plazoRef: entrada.plazoRef, decision: entrada.decision, fundamentoRef: entrada.fundamentoRef, receptores: entrada.receptores, ...datosOwner(entrada) });
        return this.m9.recibir({ identidadLogica: entrada.identidadLogica, versionContrato: '1.0', ocurridoEn: entrada.ocurridoEn, zonaHoraria: entrada.zonaHoraria, ejecutor: { tipo: 'SISTEMA', referencia: entrada.owner }, productor: 'M9', modulo: 'M9', operacion: `DERECHO_${entrada.tipo}`, resultado: 'EXITOSO', referencia: { tipo: 'DERECHO_OWNER', id: entrada.referenciaOwner }, nuevo, eventoPrivacidad: true, contextoTerminal: true, capacidad: 'EMITIR_EVENTO_M9', critico: true });
    }
    async recibirIncidente(entrada) {
        (0, seguridad_1.validarSinSecretos)(entrada);
        if (!entrada.clasificadoPorOwner)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'M9 no clasifica incidentes', 'M9_DEPENDENCIA_OWNER');
        const nuevo = compactar({ naturaleza: entrada.naturaleza, efectos: entrada.efectos, categorias: entrada.categorias, volumenAproximado: entrada.volumenAproximado, medidas: entrada.medidas, comunicacionRef: entrada.comunicacionRef, tratamientoAdicionalRef: entrada.tratamientoAdicionalRef, ...datosOwner(entrada) });
        return this.m9.recibir({ identidadLogica: entrada.identidadLogica, versionContrato: '1.0', ocurridoEn: entrada.ocurridoEn, zonaHoraria: entrada.zonaHoraria, ejecutor: { tipo: 'SISTEMA', referencia: entrada.owner }, productor: 'M9', modulo: 'M9', operacion: 'INCIDENTE_CLASIFICADO_OWNER', resultado: 'EXITOSO', referencia: { tipo: 'INCIDENTE_OWNER', id: entrada.referenciaOwner }, nuevo, eventoPrivacidad: true, contextoTerminal: true, capacidad: 'EMITIR_EVENTO_M9', critico: true });
    }
    estadoContextoFinalidad(entrada) {
        return entrada.finalidadRef || entrada.baseRef || entrada.politicaRef ? { estado: 'INFORMADO_POR_OWNER', ...datosOwner(entrada) } : { estado: 'DEPENDENCIA_OWNER', finalidadRef: null, baseRef: null, politicaRef: null };
    }
}
exports.ReceptorPostM9 = ReceptorPostM9;
//# sourceMappingURL=contratosPostM9.js.map