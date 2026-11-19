import 'dotenv/config';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { medirEtapa } from './demostracion/ServicioDemostracion';
if (!process.env.DATABASE_URL) throw new Error('Configura DATABASE_URL en Controladores/.env');
// El adaptador configura la conexión; toda consulta atraviesa Prisma.
// no borrar: lo usa toda la aplicación
const clienteBase = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
export const prisma = clienteBase.$extends({
  query: {
    $allModels: {
      async $allOperations({model, operation, args, query}) {
        const modelo = Prisma.dmmf.datamodel.models.find(candidato => candidato.name === model);
        const tabla = modelo?.dbName || model;
        return medirEtapa('PRISMA', `Prisma ${model}.${operation}`, () =>
          medirEtapa('POSTGRESQL', `Tabla ${tabla}`, () => query(args), {detalle:`${operation} sobre ${tabla}`, tabla, accionDatos:operation}),
        {detalle:`${model}.${operation}`, tabla, accionDatos:operation});
      },
    },
  },
});
