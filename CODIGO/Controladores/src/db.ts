import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
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
        return medirEtapa('PRISMA', `Prisma ${model}.${operation}`, () =>
          medirEtapa('POSTGRESQL', 'PostgreSQL confirma la operación', () => query(args), {detalle:`${model}.${operation}`}),
        {detalle:`${model}.${operation}`});
      },
    },
  },
});
