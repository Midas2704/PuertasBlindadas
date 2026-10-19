import { Prisma } from '@prisma/client';
import { ACCESO_CUENTA_RAIZ } from './cuentaRaiz';

export interface ResumenSincronizacionMidas {
  usuarioId: string;
  catalogoAprobado: number;
  existentes: number;
  asignados: string[];
  excluidos: string[];
}

/**
 * Sincroniza la cuenta raíz identificada por acceso_m4 estable con todo el catálogo
 * activo y aprobado. CU377 permanece excluido mientras no exista aprobación formal.
 */
export async function sincronizarPermisosMidas(
  tx: Prisma.TransactionClient,
  actorId: bigint,
): Promise<ResumenSincronizacionMidas> {
  const cuenta = await tx.usuario.findUnique({ where: { acceso_m4: ACCESO_CUENTA_RAIZ } });
  if (!cuenta || !cuenta.administrador_original) throw new Error('La cuenta interna Midas no pudo identificarse inequívocamente');

  const excluidos = ['CU377'];
  const catalogo = await tx.permiso.findMany({
    where: { activo_m4: true, codigo_m4: { not: null, notIn: excluidos } },
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
  if (faltantes.length || activarConfiguracionParticular) {
    const ahora = new Date();
    const identidad = `M4:MIDAS:PERMISOS:${cuenta.usuario_id_usuario}:${ahora.toISOString()}`;
    const nuevo = { actorId: actorId.toString(), permisosAsignados: faltantes.map(p => p.codigo_m4), totalCatalogo: catalogo.length, configuracionParticularActivada: activarConfiguracionParticular };
    const canonico = JSON.stringify(nuevo);
    const { createHash } = await import('node:crypto');
    const hash = createHash('sha256').update(canonico).digest('hex');
    await tx.evento_auditoria_m9.create({ data: {
      identidad_logica: identidad, version_contrato: '1.0', fecha_ocurrencia: ahora, zona_horaria: 'UTC', fecha_persistencia: ahora,
      ejecutor_tipo: 'HUMANO', ejecutor_referencia: actorId.toString(), productor: 'M4', modulo_origen: 'M4',
      operacion: 'SINCRONIZAR_PERMISOS_MIDAS', resultado: 'EXITOSO', entidad_tipo: 'USUARIO',
      entidad_referencia: cuenta.usuario_id_usuario.toString(), valores_nuevos: nuevo,
      motivo: 'Sincronización explícita de capacidades M4 aprobadas', hash_contenido: hash, hash_integridad: hash,
    } });
  }
  return { usuarioId: cuenta.usuario_id_usuario.toString(), catalogoAprobado: catalogo.length, existentes: actuales.length, asignados: faltantes.map(p => p.codigo_m4!), excluidos };
}
