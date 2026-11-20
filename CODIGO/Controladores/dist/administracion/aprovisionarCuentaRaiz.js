"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db_1 = require("../db");
const cuentaRaiz_1 = require("./cuentaRaiz");
async function ejecutar() {
    const clave = process.env.M4_CLAVE_RAIZ;
    if (!clave)
        throw new Error('Configura M4_CLAVE_RAIZ en el entorno del backend');
    await db_1.prisma.$transaction(tx => (0, cuentaRaiz_1.asegurarCuentaRaiz)(tx, { claveInicial: clave, correo: process.env.M4_CORREO_RAIZ, sincronizarClave: true }), { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable, timeout: 30000 });
    console.log(`Cuenta raíz ${cuentaRaiz_1.ACCESO_CUENTA_RAIZ} aprovisionada correctamente.`);
}
ejecutar().catch(error => {
    console.error(error instanceof Error ? error.message : 'No fue posible aprovisionar la cuenta raíz');
    process.exitCode = 1;
}).finally(() => db_1.prisma.$disconnect());
//# sourceMappingURL=aprovisionarCuentaRaiz.js.map