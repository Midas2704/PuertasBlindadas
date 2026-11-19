"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const db_1 = require("./db");
const puerto = Number(process.env.PORT || 3000);
const direccion = process.env.HOST || '127.0.0.1';
const servidor = (0, app_1.crearAplicacion)().listen(puerto, direccion, () => {
    // mensaje de arranque para quien está levantando el proyecto a mano
    console.log(`Finanzas disponible en http://${direccion}:${puerto} (sesiones y permisos M4)`);
});
servidor.on('error', error => { console.error(error.message); process.exitCode = 1; });
for (const senal of ['SIGINT', 'SIGTERM']) {
    process.once(senal, () => { servidor.close(() => { void db_1.prisma.$disconnect().then(() => process.exit(0)); }); });
}
//# sourceMappingURL=servidor.js.map