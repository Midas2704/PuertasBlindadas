"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordinadorDocumentosProducto = void 0;
const tipos_1 = require("../tipos");
/**
 * Coordinación interna preparada para M2. No registra rutas y las acciones de carga siguen
 * cerradas por M4 hasta que existan CU explícitamente aprobados.
 */
class CoordinadorDocumentosProducto {
    constructor(autorizador, coordinadorCarga, asociaciones) {
        this.autorizador = autorizador;
        this.coordinadorCarga = coordinadorCarga;
        this.asociaciones = asociaciones;
    }
    async confirmarYAsociar(entrada) {
        if (entrada.clasificacion !== 'COMERCIAL')
            throw new tipos_1.ErrorDocumental('CLASIFICACION_DOCUMENTAL_NO_AUTORIZADA', 'La coordinación de productos acepta únicamente documentos comerciales', 403);
        const contexto = { idProducto: entrada.idProducto, idDocumento: entrada.idDocumento };
        await this.autorizador.exigir(entrada.actor, 'CONFIRMAR_CARGA', contexto);
        const confirmacion = await this.coordinadorCarga.confirmar({ idIntencion: entrada.idIntencion, idDocumento: entrada.idDocumento, actor: entrada.actor, sha256Esperado: entrada.sha256Esperado });
        if (confirmacion.estado !== 'DISPONIBLE' || confirmacion.antivirus.estado !== 'LIMPIO' || !confirmacion.integridad.valido) {
            throw new tipos_1.ErrorDocumental('DOCUMENTO_NO_ASOCIABLE', 'Sólo una versión íntegra, limpia y disponible puede asociarse', 409);
        }
        await this.autorizador.exigir(entrada.actor, 'ASOCIAR_PRODUCTO', contexto);
        let asociacion;
        try {
            asociacion = await this.asociaciones.asociarProducto({ idProducto: entrada.idProducto, idDocumento: entrada.idDocumento, ...entrada.asociacion }, { id: entrada.actor.id });
        }
        catch (error) {
            // La versión ya confirmada nunca se elimina como compensación. El evento técnico deja una
            // intención de reconciliación idempotente cuando PostgreSQL aún permite registrar el fallo.
            try {
                await this.asociaciones.registrarEvento?.({
                    tipoEvento: 'ASOCIACION_PRODUCTO_PENDIENTE',
                    claveIdempotencia: `asociacion-pendiente:${entrada.idIntencion}:${entrada.idProducto}:${entrada.asociacion.tipoDocumento}`,
                    idDocumento: entrada.idDocumento,
                    idVersion: confirmacion.versionId,
                    payloadTecnico: { idProducto: entrada.idProducto, tipoDocumento: entrada.asociacion.tipoDocumento },
                });
            }
            catch { /* El reintento determinista y la reconciliación de versiones siguen disponibles. */ }
            throw error;
        }
        return { confirmacion, asociacion };
    }
}
exports.CoordinadorDocumentosProducto = CoordinadorDocumentosProducto;
//# sourceMappingURL=CoordinadorDocumentosProducto.js.map