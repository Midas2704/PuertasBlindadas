import 'dotenv/config';
import type { Prisma } from '@prisma/client';
import { crearAplicacion } from './app';
import { prisma } from './db';
import { ACCESO_CUENTA_RAIZ } from './administracion/cuentaRaiz';
import { sincronizarPermisosMidas } from './administracion/sincronizarPermisosMidas';
const puerto = Number(process.env.PORT || 3000);
const direccion = process.env.HOST || '127.0.0.1';

async function iniciar() {
  const sincronizacion = await prisma.$transaction(async tx => {
    const midas = await tx.usuario.findUnique({ where:{ acceso_m4:ACCESO_CUENTA_RAIZ }, select:{ usuario_id_usuario:true } });
    if (!midas) throw new Error('La cuenta raíz MIDAS no existe');
    return sincronizarPermisosMidas(tx as unknown as Prisma.TransactionClient, midas.usuario_id_usuario);
  });
  console.log(`MIDAS sincronizado: ${sincronizacion.existentes + sincronizacion.asignados.length}/${sincronizacion.catalogoAprobado} permisos registrados`);

  const servidor = crearAplicacion().listen(puerto, direccion, () => {
    console.log(`Finanzas disponible en http://${direccion}:${puerto} (sesiones y permisos M4)`);
  });
  servidor.on('error', error => { console.error(error.message); process.exitCode = 1; });
  for (const senal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(senal, () => { servidor.close(() => { void prisma.$disconnect().then(() => process.exit(0)); }); });
  }
}

void iniciar().catch(error => {
  console.error('No fue posible iniciar el backend:', error);
  void prisma.$disconnect().finally(() => process.exit(1));
});
