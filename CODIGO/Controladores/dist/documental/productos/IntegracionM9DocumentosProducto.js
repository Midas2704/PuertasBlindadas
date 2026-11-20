"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PuenteM9DocumentosProducto = exports.MATRIZ_EVENTOS_M9_DOCUMENTALES = exports.EVENTOS_DOCUMENTALES_PROPUESTOS = void 0;
const tipos_1 = require("../tipos");
exports.EVENTOS_DOCUMENTALES_PROPUESTOS = [
    'DOCUMENTO_CONSULTADO', 'DOCUMENTO_CARGA_INICIADA', 'DOCUMENTO_CARGA_CONFIRMADA',
    'DOCUMENTO_RECHAZADO', 'DOCUMENTO_CUARENTENA', 'DOCUMENTO_DISPONIBLE', 'DOCUMENTO_DESCARGADO',
    'DOCUMENTO_REEMPLAZADO', 'DOCUMENTO_ASOCIADO_PRODUCTO', 'DOCUMENTO_IMAGEN_PRINCIPAL_CAMBIADA',
    'DOCUMENTO_USO_COMERCIAL_MODIFICADO', 'DOCUMENTO_INTEGRIDAD_FALLIDA',
];
/** Propuesta de catálogo; no registra ni publica eventos por sí misma. */
exports.MATRIZ_EVENTOS_M9_DOCUMENTALES = exports.EVENTOS_DOCUMENTALES_PROPUESTOS.map(tipo => ({
    tipo,
    productorPropuesto: 'M2',
    operacion: tipo,
    criticidad: /INTEGRIDAD|CUARENTENA|RECHAZADO/.test(tipo) ? 'ALTA' : /CARGA|DESCARGADO|REEMPLAZADO|ASOCIADO|PRINCIPAL|USO/.test(tipo) ? 'MEDIA' : 'BAJA',
    requiereIdempotencia: tipo !== 'DOCUMENTO_CONSULTADO',
    justificacion: tipo === 'DOCUMENTO_CONSULTADO' ? 'Evaluar trazabilidad acotada sin registrar cada lectura indiscriminadamente.' : 'Trazabilidad funcional de una mutación o resultado documental relevante.',
    campos: Object.freeze(['ACTOR', 'ENTIDAD', 'DOCUMENTO', 'VERSION', 'RESULTADO']),
    estadoAprobacion: 'PENDIENTE_APROBACION',
}));
const contieneDatoProhibido = (evento) => /https?:\/\/|token|secret|authorization|base64|password/i.test(JSON.stringify(evento));
/** Puente inactivo por defecto. Sólo publica tipos entregados explícitamente por un catálogo M9 aprobado. */
class PuenteM9DocumentosProducto {
    constructor(publicador, eventosAprobados = new Set()) {
        this.publicador = publicador;
        this.eventosAprobados = eventosAprobados;
    }
    async publicar(evento) {
        if (contieneDatoProhibido(evento))
            throw new tipos_1.ErrorDocumental('EVENTO_M9_DATO_PROHIBIDO', 'El evento contiene datos no permitidos', 400);
        if (!this.eventosAprobados.has(evento.tipo))
            throw new tipos_1.ErrorDocumental('EVENTO_M9_NO_APROBADO', 'El evento documental permanece pendiente de aprobación M9', 403);
        return this.publicador.publicar(evento);
    }
}
exports.PuenteM9DocumentosProducto = PuenteM9DocumentosProducto;
//# sourceMappingURL=IntegracionM9DocumentosProducto.js.map