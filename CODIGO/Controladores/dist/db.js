"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const ServicioDemostracion_1 = require("./demostracion/ServicioDemostracion");
if (!process.env.DATABASE_URL)
    throw new Error('Configura DATABASE_URL en Controladores/.env');
// El adaptador configura la conexión; toda consulta atraviesa Prisma.
// no borrar: lo usa toda la aplicación
const clienteBase = new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL }) });
exports.prisma = clienteBase.$extends({
    query: {
        $allModels: {
            async $allOperations({ model, operation, args, query }) {
                const modelo = client_1.Prisma.dmmf.datamodel.models.find(candidato => candidato.name === model);
                const tabla = modelo?.dbName || model;
                return (0, ServicioDemostracion_1.medirEtapa)('PRISMA', `Prisma ${model}.${operation}`, () => (0, ServicioDemostracion_1.medirEtapa)('POSTGRESQL', `Tabla ${tabla}`, () => query(args), { detalle: `${operation} sobre ${tabla}`, tabla, accionDatos: operation }), { detalle: `${model}.${operation}`, tabla, accionDatos: operation });
            },
        },
    },
});
//# sourceMappingURL=db.js.map