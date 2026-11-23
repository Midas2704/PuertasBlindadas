"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const db_1 = require("./db");
const cuentaRaiz_1 = require("./administracion/cuentaRaiz");
const sincronizarPermisosMidas_1 = require("./administracion/sincronizarPermisosMidas");
const puerto = Number(process.env.PORT || 3000);
const direccion = process.env.HOST || '127.0.0.1';
async function iniciar() {
    const sincronizacion = await db_1.prisma.$transaction(async (tx) => {
        const midas = await tx.usuario.findUnique({ where: { acceso_m4: cuentaRaiz_1.ACCESO_CUENTA_RAIZ }, select: { usuario_id_usuario: true } });
        if (!midas)
            throw new Error('La cuenta raíz MIDAS no existe');
        return (0, sincronizarPermisosMidas_1.sincronizarPermisosMidas)(tx, midas.usuario_id_usuario);
    });
    console.log(`MIDAS sincronizado: ${sincronizacion.existentes + sincronizacion.asignados.length}/${sincronizacion.catalogoAprobado} permisos registrados`);
    const servidor = (0, app_1.crearAplicacion)().listen(puerto, direccion, () => {
        console.log(`Finanzas disponible en http://${direccion}:${puerto} (sesiones y permisos M4)`);
    });
    servidor.on('error', error => { console.error(error.message); process.exitCode = 1; });
    for (const senal of ['SIGINT', 'SIGTERM']) {
        process.once(senal, () => { servidor.close(() => { void db_1.prisma.$disconnect().then(() => process.exit(0)); }); });
    }
}
void iniciar().catch(error => {
    console.error('No fue posible iniciar el backend:', error);
    void db_1.prisma.$disconnect().finally(() => process.exit(1));
});
//# sourceMappingURL=servidor.js.map