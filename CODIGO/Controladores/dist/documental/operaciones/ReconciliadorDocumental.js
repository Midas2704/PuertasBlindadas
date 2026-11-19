"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReconciliadorDocumental = void 0;
/** Sólo diagnostica. No elimina, mueve ni repara objetos automáticamente. */
class ReconciliadorDocumental {
    constructor(storage) {
        this.storage = storage;
    }
    async diagnosticar(entrada) {
        const ahora = entrada.ahora ?? new Date();
        const hallazgos = [];
        for (const version of entrada.versiones.filter(item => item.estado === 'DISPONIBLE')) {
            try {
                const objeto = await this.storage.consultarObjeto({ contenedor: version.contenedor, clave: version.clave });
                if (objeto.tamanoBytes !== version.tamano)
                    hallazgos.push({ tipo: 'TAMANO_DIVERGENTE', referencia: version.id.toString() });
            }
            catch {
                hallazgos.push({ tipo: 'OBJETO_FALTANTE', referencia: version.id.toString() });
            }
        }
        for (const intencion of entrada.intenciones)
            if (!['DISPONIBLE', 'CUARENTENA', 'EXPIRADA', 'CANCELADA'].includes(intencion.estado) && intencion.expiraEn <= ahora)
                hallazgos.push({ tipo: 'INTENCION_EXPIRADA', referencia: intencion.id });
        for (const evento of entrada.eventos)
            if (['PENDIENTE', 'PROCESANDO'].includes(evento.estado) && ahora.getTime() - evento.creadoEn.getTime() > 300000)
                hallazgos.push({ tipo: 'EVENTO_ATASCADO', referencia: evento.id.toString() });
        if (entrada.contenedorTemporal && this.storage.listarCargasIncompletas) {
            const cargas = await this.storage.listarCargasIncompletas({ contenedor: entrada.contenedorTemporal });
            for (const carga of cargas)
                hallazgos.push({ tipo: 'MULTIPART_ABANDONADO', referencia: carga.identificadorMultipart });
        }
        hallazgos.push({ tipo: 'HUERFANOS_NO_EVALUABLES', referencia: 'storage', detalle: 'El contrato actual no lista objetos finales; no se ejecuta limpieza destructiva.' });
        return hallazgos;
    }
}
exports.ReconciliadorDocumental = ReconciliadorDocumental;
//# sourceMappingURL=ReconciliadorDocumental.js.map