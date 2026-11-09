import { Prisma } from '@prisma/client';
import { ACCESO_CUENTA_RAIZ } from './cuentaRaiz';
import { M9Controller } from '../controladores/M9Controller';
import type { ActorAutenticado } from '../controladores/M4Controller';
import { ProductorAuditoriaM9 } from '../m9/contratoProductor';
import { RepositorioAuditoriaM9Prisma } from '../m9/RepositorioAuditoriaM9';
import { hashM9 } from '../m9/seguridad';

export interface ResumenSincronizacionMidas {
  usuarioId: string;
  catalogoAprobado: number;
  existentes: number;
  asignados: string[];
  excluidos: string[];
}

/**
 * Sincroniza la cuenta raíz identificada por acceso_m4 estable con todo el catálogo
 * registrado, incluso capacidades pendientes o inactivas. La asignación no vuelve
 * operativa una capacidad sin contrato backend, pero garantiza que Midas no tenga
 * que ser actualizado manualmente cuando se incorpore un CU nuevo.
 */
export async function sincronizarPermisosMidas(
  tx: Prisma.TransactionClient,
  actorId: bigint,
  productorM9 = new ProductorAuditoriaM9(new M9Controller({ repositorio: new RepositorioAuditoriaM9Prisma(tx) })),
): Promise<ResumenSincronizacionMidas> {
  const cuenta = await tx.usuario.findUnique({ where: { acceso_m4: ACCESO_CUENTA_RAIZ } });
  if (!cuenta || !cuenta.administrador_original) throw new Error('La cuenta interna Midas no pudo identificarse inequívocamente');

  const excluidos: string[] = [];
  const catalogo = await tx.permiso.findMany({
    where: { codigo_m4: { not: null } },
    orderBy: { codigo_m4: 'asc' },
  });
  const actuales = await tx.usuario_permiso_particular.findMany({
    where: { id_usuario: cuenta.usuario_id_usuario }, include: { permiso: true },
  });
  const idsActuales = new Set(actuales.map(item => item.id_permiso.toString()));
  const faltantes = catalogo.filter(item => !idsActuales.has(item.permiso_id_permiso.toString()));
  const activarConfiguracionParticular = !cuenta.configuracion_particular;
  if (faltantes.length) {
    await tx.usuario_permiso_particular.createMany({
      data: faltantes.map(item => ({ id_usuario: cuenta.usuario_id_usuario, id_permiso: item.permiso_id_permiso })),
      skipDuplicates: true,
    });
  }
  if (faltantes.length || activarConfiguracionParticular) {
    await tx.usuario.update({
      where: { usuario_id_usuario: cuenta.usuario_id_usuario },
      data: { configuracion_particular: true, version_seguridad: { increment: 1 } },
    });
  }
  const resumen = { usuarioId: cuenta.usuario_id_usuario.toString(), catalogoAprobado: catalogo.length, existentes: actuales.length, asignados: faltantes.map(p => p.codigo_m4!), excluidos };
  if (faltantes.length || activarConfiguracionParticular) {
    const nuevo = { actorId: actorId.toString(), permisosAsignados: resumen.asignados, totalCatalogo: catalogo.length, configuracionParticularActivada: activarConfiguracionParticular, alcance: 'TODOS_LOS_CU_REGISTRADOS' };
    const actor: ActorAutenticado = { id:actorId, sesion:'sincronizacion-midas', permisos:[], configuracion:'gerencia', administrador:true, cambiarClave:false, nombre:'Sincronización Midas', acceso:'interno' };
    const identidad = hashM9({ usuarioId:resumen.usuarioId, permisosAsignados:resumen.asignados, totalCatalogo:catalogo.length, configuracionParticularActivada:activarConfiguracionParticular });
    await productorM9.ejecutar('sincronizarPermisosMidas', actor, {
      parametros:{ id:resumen.usuarioId }, cuerpo:{ motivo:'Sincronización de todas las capacidades M4 registradas para la cuenta raíz' }, idSolicitud:`MIDAS-PERMISOS-${identidad}`,
    }, async () => ({ ...resumen, __auditoriaM9:{ nuevo } }));
  }
  return resumen;
}
