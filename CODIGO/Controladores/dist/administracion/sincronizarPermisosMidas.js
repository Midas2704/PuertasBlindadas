"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sincronizarPermisosMidas = sincronizarPermisosMidas;
const cuentaRaiz_1 = require("./cuentaRaiz");
const M9Controller_1 = require("../controladores/M9Controller");
const contratoProductor_1 = require("../m9/contratoProductor");
const RepositorioAuditoriaM9_1 = require("../m9/RepositorioAuditoriaM9");
const seguridad_1 = require("../m9/seguridad");
/**
 * Sincroniza la cuenta raíz identificada por acceso_m4 estable con todo el catálogo
 * registrado, incluso capacidades pendientes o inactivas. La asignación no vuelve
 * operativa una capacidad sin contrato backend, pero garantiza que Midas no tenga
 * que ser actualizado manualmente cuando se incorpore un CU nuevo.
 */
async function sincronizarPermisosMidas(tx, actorId, productorM9 = new contratoProductor_1.ProductorAuditoriaM9(new M9Controller_1.M9Controller({ repositorio: new RepositorioAuditoriaM9_1.RepositorioAuditoriaM9Prisma(tx) }))) {
    const cuenta = await tx.usuario.findUnique({ where: { acceso_m4: cuentaRaiz_1.ACCESO_CUENTA_RAIZ } });
    // acceso_m4 es único y constituye la identidad permanente de MIDAS. El
    // arranque no depende de campos de perfil que puedan quedar desalineados.
    if (!cuenta)
        throw new Error('La cuenta interna Midas no pudo identificarse por su acceso permanente');
    const excluidos = [];
    const catalogo = await tx.permiso.findMany({
        where: { codigo_m4: { not: null } },
        orderBy: { codigo_m4: 'asc' },
    });
    const actuales = await tx.usuario_permiso_particular.findMany({
        where: { id_usuario: cuenta.usuario_id_usuario }, include: { permiso: true },
    });
    const idsActuales = new Set(actuales.map(item => item.id_permiso.toString()));
    const faltantes = catalogo.filter(item => !idsActuales.has(item.permiso_id_permiso.toString()));
    if (faltantes.length) {
        await tx.usuario_permiso_particular.createMany({
            data: faltantes.map(item => ({ id_usuario: cuenta.usuario_id_usuario, id_permiso: item.permiso_id_permiso })),
            skipDuplicates: true,
        });
    }
    const resumen = { usuarioId: cuenta.usuario_id_usuario.toString(), catalogoAprobado: catalogo.length, existentes: actuales.length, asignados: faltantes.map(p => p.codigo_m4), excluidos };
    if (faltantes.length) {
        const nuevo = { actorId: actorId.toString(), permisosAsignados: resumen.asignados, totalCatalogo: catalogo.length, configuracionParticularActivada: false, alcance: 'TODOS_LOS_CU_REGISTRADOS' };
        const actor = { id: actorId, sesion: 'sincronizacion-midas', permisos: [], configuracion: 'gerencia', administrador: true, cambiarClave: false, nombre: 'Sincronización Midas', acceso: 'interno' };
        const identidad = (0, seguridad_1.hashM9)({ usuarioId: resumen.usuarioId, permisosAsignados: resumen.asignados, totalCatalogo: catalogo.length, configuracionParticularActivada: false });
        await productorM9.ejecutar('sincronizarPermisosMidas', actor, {
            parametros: { id: resumen.usuarioId }, cuerpo: { motivo: 'Sincronización de todas las capacidades M4 registradas para la cuenta raíz' }, idSolicitud: `MIDAS-PERMISOS-${identidad}`,
        }, async () => ({ ...resumen, __auditoriaM9: { nuevo } }));
    }
    return resumen;
}
//# sourceMappingURL=sincronizarPermisosMidas.js.map