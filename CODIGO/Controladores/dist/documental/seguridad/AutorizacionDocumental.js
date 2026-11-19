"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutorizadorDocumental = void 0;
const tipos_1 = require("../tipos");
const PERMISOS_APROBADOS_POR_ACCION = {
    CONSULTAR_METADATA: 'CU360',
    CONSULTAR_VERSIONES: 'CU367',
    CONSULTAR_HISTORIAL: 'CU367',
    CREAR_INTENCION: 'CU373', CONFIRMAR_CARGA: 'CU373', REEMPLAZAR: 'CU373',
    ASOCIAR_PRODUCTO: 'CU374', DEFINIR_IMAGEN_PRINCIPAL: 'CU374', ORDENAR_GALERIA: 'CU374', DEFINIR_USO_B2B_B2C: 'CU374',
    SOLICITAR_VISTA_PREVIA: 'CU375', DESCARGAR: 'CU376',
};
/** CU377 y cualquier acción sin permiso aprobado permanecen cerrados por defecto. */
class AutorizadorDocumental {
    constructor(verificarAlcance) {
        this.verificarAlcance = verificarAlcance;
    }
    async puede(actor, accion, contexto) {
        try {
            await this.exigir(actor, accion, contexto);
            return true;
        }
        catch (error) {
            if (error instanceof tipos_1.ErrorDocumental && [401, 403].includes(error.estadoHttp))
                return false;
            throw error;
        }
    }
    async exigir(actor, accion, contexto) {
        if (!actor.id || !actor.sesion)
            throw new tipos_1.ErrorDocumental('ACTOR_NO_AUTENTICADO', 'Se requiere una sesión backend autenticada', 401);
        const permiso = PERMISOS_APROBADOS_POR_ACCION[accion];
        if (!permiso)
            throw new tipos_1.ErrorDocumental('PERMISO_DOCUMENTAL_NO_DEFINIDO', `La acción ${accion} permanece cerrada hasta que M4 apruebe su CU`, 403);
        if (!actor.permisos.includes(permiso))
            throw new tipos_1.ErrorDocumental('ACCESO_DOCUMENTAL_DENEGADO', 'El actor no posee el permiso documental requerido', 403);
        if (!(await this.verificarAlcance(actor, contexto)))
            throw new tipos_1.ErrorDocumental('ALCANCE_DOCUMENTAL_DENEGADO', 'La entidad solicitada queda fuera del alcance autorizado', 403);
    }
}
exports.AutorizadorDocumental = AutorizadorDocumental;
//# sourceMappingURL=AutorizacionDocumental.js.map