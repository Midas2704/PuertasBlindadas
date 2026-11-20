"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../db");
const seedMinimaOperativa_1 = require("./seedMinimaOperativa");
const modo = String(process.argv[2] || 'audit');
(0, seedMinimaOperativa_1.ejecutarSeedMinima)(db_1.prisma, modo)
    .then(resultado => console.log(JSON.stringify(resultado, (_clave, valor) => typeof valor === 'bigint' ? valor.toString() : valor, 2)))
    .catch(error => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
})
    .finally(() => db_1.prisma.$disconnect());
//# sourceMappingURL=seedMinimaOperativaCli.js.map