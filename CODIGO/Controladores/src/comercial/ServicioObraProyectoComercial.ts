import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { identificador, texto } from '../validaciones/solicitudes';

type Entrada = Record<string, any>;

const sinDiacriticos = (valor: string) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
export const normalizarParteUbicacion = (valor: unknown) => sinDiacriticos(String(valor ?? '').trim().toUpperCase())
  .replace(/[^A-Z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

export const claveUbicacionObra = (entrada: Entrada) => {
  const partes = [entrada.region, entrada.comuna, entrada.ciudad, entrada.direccion, entrada.edificio, entrada.unidad]
    .map(normalizarParteUbicacion);
  if (!partes[0] || !partes[1] || !partes[3]) throw new ErrorAplicacion(400, 'Región, comuna y dirección son obligatorias para identificar una Obra');
  return partes.join('|').slice(0, 700);
};

const presentar = (obra: any, claveBuscada?: string) => ({
  id: obra.obra_obra_id.toString(), nombre: obra.obra_nombre_obra, referencia: obra.obra_referencia,
  direccion: obra.obra_direccion_obra, region: obra.obra_region, ciudad: obra.obra_ciudad,
  comuna: obra.obra_comuna, edificio: obra.obra_edificio, unidad: obra.obra_unidad,
  estado: obra.obra_estado, revision: obra.revision_comercial,
  coincidencia: claveBuscada && obra.clave_ubicacion_normalizada === claveBuscada ? 'EXACTA' : 'POSIBLE',
});

export class ServicioObraProyectoComercial {
  async buscar(consulta: Entrada) {
    const direccion = texto(consulta.direccion, 500); const region = texto(consulta.region, 120);
    const comuna = texto(consulta.comuna, 120); const termino = texto(consulta.busqueda, 200);
    if (!direccion && !region && !comuna && !termino) throw new ErrorAplicacion(400, 'Indica dirección, región, comuna o texto de búsqueda');
    const obras = await prisma.obra.findMany({
      where: {
        ...(region ? { obra_region: { contains: region, mode: 'insensitive' as const } } : {}),
        ...(comuna ? { obra_comuna: { contains: comuna, mode: 'insensitive' as const } } : {}),
        ...(direccion ? { obra_direccion_obra: { contains: direccion, mode: 'insensitive' as const } } : {}),
        ...(termino ? { OR: [
          { obra_nombre_obra: { contains: termino, mode: 'insensitive' as const } },
          { obra_referencia: { contains: termino, mode: 'insensitive' as const } },
          { obra_direccion_obra: { contains: termino, mode: 'insensitive' as const } },
        ] } : {}),
      }, orderBy: [{ obra_estado: 'asc' }, { obra_obra_id: 'desc' }], take: 30,
    });
    let clave: string | undefined;
    try { clave = direccion && region && comuna ? claveUbicacionObra(consulta) : undefined; } catch { clave = undefined; }
    return { obras: obras.map(obra => presentar(obra, clave)), requiereSeleccionExplicita: obras.length > 1 };
  }

  async registrar(entrada: Entrada, actorId: bigint) {
    const clave = claveUbicacionObra(entrada);
    const existente = await prisma.obra.findUnique({ where: { clave_ubicacion_normalizada: clave } });
    if (existente) throw new ErrorAplicacion(409, `Ya existe una Obra con esa ubicación (ID ${existente.obra_obra_id.toString()}); selecciónala explícitamente`);
    const candidatas = await this.buscar(entrada);
    if (candidatas.obras.length && entrada.confirmarCoincidenciaAmbigua !== true) {
      throw new ErrorAplicacion(409, 'Existen Obras parecidas. Revisa y confirma expresamente que se trata de una ubicación distinta');
    }
    const rut = texto(entrada.rutCliente, 12) || null;
    const cliente = rut ? await prisma.cliente.findUnique({ where: { cliente_cliente_rut: rut }, select: { cliente_cliente_rut: true } }) : null;
    const obra = await prisma.obra.create({ data: {
      obra_nombre_obra: texto(entrada.nombre, 200) || texto(entrada.direccion, 500),
      obra_direccion_obra: texto(entrada.direccion, 500), obra_region: texto(entrada.region, 120),
      obra_ciudad: texto(entrada.ciudad, 120) || null, obra_comuna: texto(entrada.comuna, 120),
      obra_edificio: texto(entrada.edificio, 150) || null, obra_unidad: texto(entrada.unidad, 100) || null,
      obra_referencia: texto(entrada.referencia, 200) || null, obra_observaciones: texto(entrada.observaciones, 2000) || null,
      obra_tipo_obra: 'EJECUCION_COMERCIAL', obra_estado: 'activa', obra_fecha_de_creacion: new Date(),
      obra_fecha_de_ultima_edicion: new Date(), clave_ubicacion_normalizada: clave,
      rut_cliente: cliente?.cliente_cliente_rut || null,
    } });
    return Object.assign(presentar(obra, clave), { creadoPor: actorId.toString(), __auditoriaM9: { nuevo: { idObra: obra.obra_obra_id.toString(), claveUbicacion: clave } } });
  }

  async vincularCotizacion(idCotizacion: number, entrada: Entrada, actorId: bigint) {
    const idObra = BigInt(identificador(entrada.idObra)); const revision = identificador(entrada.revision);
    return prisma.$transaction(async tx => {
      const cotizacion = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: { ficha_cliente: { include: { cliente_financiero: true } } } });
      if (!cotizacion) throw new ErrorAplicacion(404, 'Cotización no encontrada');
      if (cotizacion.estado_cotizacion !== 'borrador') throw new ErrorAplicacion(409, 'Sólo un borrador puede cambiar su Obra vinculada');
      if (cotizacion.revision !== revision) throw new ErrorAplicacion(409, 'La Cotización fue modificada por otra sesión');
      const obra = await tx.obra.findUnique({ where: { obra_obra_id: idObra } });
      if (!obra || ['inactiva', 'cerrada', 'eliminada'].includes(String(obra.obra_estado).toLowerCase())) throw new ErrorAplicacion(409, 'La Obra no está disponible para nuevas vinculaciones');
      const rutCotizacion = cotizacion.ficha_cliente.cliente_financiero.rut_cliente;
      if (obra.rut_cliente && rutCotizacion && obra.rut_cliente !== rutCotizacion) throw new ErrorAplicacion(409, 'La Obra pertenece a otro cliente; requiere revisión explícita');
      const actualizada = await tx.cotizacion.update({ where: { id_cotizacion: idCotizacion }, data: { id_obra_contexto: idObra, revision: { increment: 1 } } });
      return Object.assign({ idCotizacion, idObra: idObra.toString(), revision: actualizada.revision, actor: actorId.toString() }, { __auditoriaM9: { anterior: { idObra: cotizacion.id_obra_contexto?.toString() ?? null }, nuevo: { idObra: idObra.toString(), revision: actualizada.revision } } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
}

export async function formalizarProyectoCotizacion(tx: Prisma.TransactionClient, idCotizacion: number) {
  const cotizacion = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: { ficha_cliente: { include: { cliente_financiero: true } } } });
  if (!cotizacion) throw new ErrorAplicacion(404, 'Cotización no encontrada');
  const existente = await tx.proyecto.findUnique({ where: { id_cotizacion_origen: idCotizacion }, include: { obras: true } });
  if (existente) {
    const obraExistente = existente.obras.find(vinculo => vinculo.es_principal)?.id_obra ?? null;
    if (obraExistente !== (cotizacion.id_obra_contexto ?? null)) throw new ErrorAplicacion(409, 'El Proyecto ya fue formalizado con otra Obra; requiere control de cambios');
    return existente;
  }
  const hoy = new Date();
  const rutFinanciero = cotizacion.ficha_cliente.cliente_financiero.rut_cliente || null;
  const clienteTerreno = rutFinanciero
    ? await tx.cliente.findUnique({ where: { cliente_cliente_rut: rutFinanciero }, select: { cliente_cliente_rut: true } })
    : null;
  const proyecto = await tx.proyecto.create({ data: {
    proyecto_codigo_proyecto: `COT-${idCotizacion}`,
    proyecto_nombre_referencia: cotizacion.nombre_proyecto || cotizacion.referencia_comercial || `Pedido Cotización ${idCotizacion}`,
    proyecto_fecha_ingreso: hoy, proyecto_estado_operacional: 'FORMALIZADO', proyecto_estado_produccion: 'PENDIENTE',
    // Finanzas y Terreno mantienen maestros distintos. La relación opcional sólo se
    // persiste cuando el cliente compartido existe; nunca se fabrica una FK por RUT.
    rut_cliente: clienteTerreno?.cliente_cliente_rut ?? null, id_cotizacion_origen: idCotizacion,
  } });
  if (cotizacion.id_obra_contexto) await tx.proyecto_obra.create({ data: { id_proyecto: proyecto.proyecto_proyecto_id, id_obra: cotizacion.id_obra_contexto, es_principal: true, origen: 'COTIZACION' } });
  return proyecto;
}
