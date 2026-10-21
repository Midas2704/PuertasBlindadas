import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { identificador, texto } from '../validaciones/solicitudes';

type Entrada = Record<string, any>;

export type EstadoReferenciaM12 = 'REFERENCIA_CONFIRMADA' | 'REFERENCIA_NO_ENCONTRADA' | 'FUENTE_NO_DISPONIBLE' | 'IDENTIDAD_AMBIGUA';
export type ResultadoCoherenciaM12 = {
  estado: EstadoReferenciaM12;
  compatible: boolean;
  motivo: string;
  requiereRevisionHumana: boolean;
};

export const resolverEstadoReferenciaM12 = (cantidad: number, coincidenciasExactas = 0): EstadoReferenciaM12 => {
  if (cantidad <= 0) return 'REFERENCIA_NO_ENCONTRADA';
  if (cantidad === 1 && coincidenciasExactas === 1) return 'REFERENCIA_CONFIRMADA';
  return 'IDENTIDAD_AMBIGUA';
};

export const exigirConfirmacionHumanaObraDistintaM12 = (cantidadCandidatas: number, declaracion: unknown) => {
  if (cantidadCandidatas > 0 && declaracion !== 'IDENTIDAD_DISTINTA_REVISADA') {
    throw new ErrorAplicacion(409, 'Existen Obras candidatas. Confirma expresamente que revisaste las coincidencias y solicitas registrar una identidad distinta');
  }
};

export const filtroCotizacionesContextualesM12 = (entrada: { idObra?: bigint | null; idProyecto?: bigint | null; idCotizacion?: number | null }): Prisma.cotizacionWhereInput => {
  if (entrada.idCotizacion) return { id_cotizacion: entrada.idCotizacion };
  if (entrada.idProyecto) return { proyecto_originado: { is: { proyecto_proyecto_id: entrada.idProyecto } } };
  if (entrada.idObra) return { id_obra_contexto: entrada.idObra };
  return { id_cotizacion: -1 };
};

export const estadoIdentidadContextualM12 = (entrada: { obraEncontrada: boolean; proyectosEncontrados: number; clientesEncontrados?: number; vinculoAmbiguo?: boolean }): EstadoReferenciaM12 => {
  if (entrada.vinculoAmbiguo) return 'IDENTIDAD_AMBIGUA';
  return entrada.obraEncontrada || entrada.proyectosEncontrados > 0 ? 'REFERENCIA_CONFIRMADA' : 'REFERENCIA_NO_ENCONTRADA';
};

type ContactoContextualM12 = { id_contacto_cotizacion_b2b: bigint; nombre: string; apellido: string | null; cargo: string | null; correo: string | null; telefono: string | null; tipo_contacto: string; es_principal: boolean; estado: string };
export const presentarContactosContextualesM12 = (contactos: ContactoContextualM12[]) => contactos.map(contacto => ({
  id: contacto.id_contacto_cotizacion_b2b.toString(), nombre: contacto.nombre, apellido: contacto.apellido,
  cargo: contacto.cargo, correo: contacto.correo, telefono: contacto.telefono, funcion: contacto.tipo_contacto,
  principal: contacto.es_principal, estado: contacto.estado, vigencia: null, vigenciaEstado: 'NO_ACREDITADA' as const,
  procedencia: 'finanzas.contacto_cotizacion_b2b',
}));

export const fuenteAutorizadaM12 = (origen: 'M2'|'TERRENO'|'INVENTARIO'|'M3'|'M7', permisos: readonly string[]) => {
  const existentes: Record<typeof origen, readonly string[]> = {
    M2: ['CU20'], TERRENO: ['CU199'], INVENTARIO: ['CU202','CU205','CU207','CU209'], M3: ['CU49','CU55'], M7: ['CU237'],
  };
  return existentes[origen].some(codigo => permisos.includes(codigo));
};

/** CUT463: valida referencias ya acreditadas; nunca crea, fusiona ni reasigna entidades. */
export const validarCoherenciaContextualM12 = (entrada: {
  fuenteDisponible?: boolean;
  requiereObra?: boolean;
  idObra?: string | null;
  idObraProyecto?: string | null;
  idProyecto?: string | null;
  idProyectoOrdenTrabajo?: string | null;
}): ResultadoCoherenciaM12 => {
  if (entrada.fuenteDisponible === false) return { estado: 'FUENTE_NO_DISPONIBLE', compatible: false, motivo: 'La fuente propietaria no está disponible', requiereRevisionHumana: false };
  if (entrada.requiereObra && !entrada.idObra) return { estado: 'REFERENCIA_NO_ENCONTRADA', compatible: false, motivo: 'El proceso requiere una Obra acreditada', requiereRevisionHumana: true };
  if (entrada.idProyecto && entrada.idProyectoOrdenTrabajo && entrada.idProyecto !== entrada.idProyectoOrdenTrabajo) return { estado: 'IDENTIDAD_AMBIGUA', compatible: false, motivo: 'La Orden de Trabajo pertenece a otro Proyecto', requiereRevisionHumana: true };
  if (entrada.idObra && entrada.idObraProyecto && entrada.idObra !== entrada.idObraProyecto) return { estado: 'IDENTIDAD_AMBIGUA', compatible: false, motivo: 'El Proyecto ya está vinculado a otra Obra', requiereRevisionHumana: true };
  return { estado: 'REFERENCIA_CONFIRMADA', compatible: true, motivo: entrada.idObra ? 'Las referencias contextuales son coherentes' : 'El proceso no exige una Obra', requiereRevisionHumana: false };
};

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
    const presentadas = obras.map(obra => presentar(obra, clave));
    const exactas = presentadas.filter(obra => obra.coincidencia === 'EXACTA').length;
    return {
      obras: presentadas,
      requiereSeleccionExplicita: resolverEstadoReferenciaM12(obras.length, exactas) === 'IDENTIDAD_AMBIGUA',
      estadoReferencia: resolverEstadoReferenciaM12(obras.length, exactas),
      procedencia: 'terreno.obra',
    };
  }

  /** CUT462: lectura diferenciada de Cliente, Proyecto y Obra, sin efectos secundarios. */
  async resolverIdentidades(consulta: Entrada) {
    const idObra = consulta.idObra ? BigInt(identificador(consulta.idObra)) : null;
    const idProyecto = consulta.idProyecto ? BigInt(identificador(consulta.idProyecto)) : null;
    const idCotizacion = consulta.idCotizacion ? identificador(consulta.idCotizacion) : null;
    if ([idObra, idProyecto, idCotizacion].filter(Boolean).length !== 1) throw new ErrorAplicacion(400, 'Indica exactamente una Obra, Proyecto o Cotización');

    try {
      let obraObjetivo = idObra;
      let proyectoObjetivo = idProyecto;
      if (idCotizacion) {
        const cotizacion = await prisma.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, select: { id_obra_contexto: true, proyecto_originado: { select: { proyecto_proyecto_id: true } } } });
        if (!cotizacion) return { estado: 'REFERENCIA_NO_ENCONTRADA' as const, procedencia: 'finanzas.cotizacion', cliente: null, obra: null, proyectos: [] };
        obraObjetivo = cotizacion.id_obra_contexto;
        proyectoObjetivo = cotizacion.proyecto_originado?.proyecto_proyecto_id ?? null;
        if (!obraObjetivo && !proyectoObjetivo) return { estado: 'REFERENCIA_NO_ENCONTRADA' as const, procedencia: 'finanzas.cotizacion', cliente: null, obra: null, proyectos: [] };
      }

      if (proyectoObjetivo && !obraObjetivo) {
        const vinculos = await prisma.proyecto_obra.findMany({ where: { id_proyecto: proyectoObjetivo }, select: { id_obra: true, es_principal: true } });
        if (vinculos.length > 1 && !vinculos.some(v => v.es_principal)) return { estado: 'IDENTIDAD_AMBIGUA' as const, procedencia: 'terreno.proyecto_obra', cliente: null, obra: null, proyectos: [] };
        obraObjetivo = vinculos.find(v => v.es_principal)?.id_obra ?? vinculos[0]?.id_obra ?? null;
      }

      const obra = obraObjetivo ? await prisma.obra.findUnique({ where: { obra_obra_id: obraObjetivo } }) : null;
      const proyectos = await prisma.proyecto.findMany({
        where: proyectoObjetivo ? { proyecto_proyecto_id: proyectoObjetivo } : obraObjetivo ? { obras: { some: { id_obra: obraObjetivo } } } : { proyecto_proyecto_id: BigInt(-1) },
        include: {
          obras: { include: { obra: true } },
          cotizacion_origen: { include: { ficha_cliente: { include: { cliente_financiero: true } } } },
        },
        orderBy: { proyecto_proyecto_id: 'asc' },
      });
      const cotizacionesContexto = await prisma.cotizacion.findMany({
        where: filtroCotizacionesContextualesM12({ idObra: obraObjetivo, idProyecto: proyectoObjetivo, idCotizacion }),
        include: { ficha_cliente: { include: { cliente_financiero: true } } },
        orderBy: { id_cotizacion: 'asc' },
      });
      const clientes = [...cotizacionesContexto, ...proyectos.flatMap(p => p.cotizacion_origen ? [p.cotizacion_origen] : [])]
        .map(c => c.ficha_cliente.cliente_financiero)
        .filter((cliente, indice, todos) => todos.findIndex(c => c.id_cliente_financiero === cliente.id_cliente_financiero) === indice);
      const estado = estadoIdentidadContextualM12({ obraEncontrada: Boolean(obra), proyectosEncontrados: proyectos.length, clientesEncontrados: clientes.length });
      return {
        estado,
        alcanceConsulta: idProyecto ? 'PROYECTO' : idCotizacion ? 'COTIZACION' : 'OBRA',
        procedencia: 'terreno.obra + terreno.proyecto + finanzas.cotizacion',
        cliente: clientes.length === 1 ? {
          id: clientes[0].id_cliente_financiero,
          rut: clientes[0].rut_cliente,
          nombre: clientes[0].nombre_razon_social_referencia,
          estado: clientes[0].estado_financiero,
          procedencia: 'finanzas.cliente_financiero',
        } : null,
        clientes: clientes.map(cliente => ({
          id: cliente.id_cliente_financiero,
          rut: cliente.rut_cliente,
          nombre: cliente.nombre_razon_social_referencia,
          estado: cliente.estado_financiero,
          procedencia: 'finanzas.cliente_financiero',
        })),
        obra: obra ? presentar(obra) : null,
        proyectos: proyectos.map(proyecto => ({
          id: proyecto.proyecto_proyecto_id.toString(),
          codigo: proyecto.proyecto_codigo_proyecto,
          nombre: proyecto.proyecto_nombre_referencia,
          estadoOperacional: proyecto.proyecto_estado_operacional,
          estadoProduccion: proyecto.proyecto_estado_produccion,
          idCotizacionOrigen: proyecto.id_cotizacion_origen,
          obras: proyecto.obras.map(v => ({ id: v.id_obra.toString(), principal: v.es_principal, origen: v.origen })),
          procedencia: 'terreno.proyecto',
        })),
      };
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      return { estado: 'FUENTE_NO_DISPONIBLE' as const, procedencia: 'terreno/finanzas', cliente: null, obra: null, proyectos: [] };
    }
  }

  /** CUT464: compone referencias mínimas desde cada owner; no replica sus históricos. */
  async consultarAntecedentes(consulta: Entrada, permisos: readonly string[]) {
    const identidad = await this.resolverIdentidades(consulta);
    if (identidad.estado === 'FUENTE_NO_DISPONIBLE' || identidad.estado === 'REFERENCIA_NO_ENCONTRADA') return { identidad, fuentes: [] };
    const idObra = identidad.obra?.id ? BigInt(identidad.obra.id) : null;
    const idsProyecto = identidad.proyectos.map(proyecto => BigInt(proyecto.id));
    const idProyectoConsultado = consulta.idProyecto ? BigInt(identificador(consulta.idProyecto)) : null;
    const idCotizacionConsultada = consulta.idCotizacion ? identificador(consulta.idCotizacion) : null;
    const alcanceProyecto = Boolean(idProyectoConsultado);
    const fuente = async (origen: string, autorizado: boolean, consultar: () => Promise<unknown[]>) => {
      if (!autorizado) return { origen, disponibilidad: 'ACCESO_RESTRINGIDO', alcanceAutorizado: false, antecedentes: [] };
      try {
        const antecedentes = await consultar();
        return { origen, disponibilidad: antecedentes.length ? 'DISPONIBLE' : 'SIN_ANTECEDENTES', alcanceAutorizado: true, antecedentes };
      } catch {
        return { origen, disponibilidad: 'FUENTE_NO_DISPONIBLE', alcanceAutorizado: true, antecedentes: [] };
      }
    };
    const [m2, terreno, inventario, m3, m7] = await Promise.all([
      fuente('M2', fuenteAutorizadaM12('M2', permisos), async () => {
        const cotizaciones = await prisma.cotizacion.findMany({
          where: filtroCotizacionesContextualesM12({ idObra, idProyecto: idProyectoConsultado, idCotizacion: idCotizacionConsultada }),
          select: { id_cotizacion: true, fecha_emision: true, estado_cotizacion: true, proyecto_originado: { select: { proyecto_proyecto_id: true } }, nota_venta: { select: { id_nota_venta: true, fecha_emision: true, estado_nota_venta: true } }, contactos_b2b: { select: { id_contacto_cotizacion_b2b: true, nombre: true, apellido: true, cargo: true, correo: true, telefono: true, tipo_contacto: true, es_principal: true, estado: true } } },
        });
        return cotizaciones.map(c => ({
          referencia: `COTIZACION:${c.id_cotizacion}`,
          proyecto: c.proyecto_originado?.proyecto_proyecto_id.toString() ?? null,
          obra: idObra?.toString() ?? null,
          fecha: c.fecha_emision,
          estado: c.estado_cotizacion,
          notaVenta: c.nota_venta ? { referencia: `NV:${c.nota_venta.id_nota_venta}`, fecha: c.nota_venta.fecha_emision, estado: c.nota_venta.estado_nota_venta } : null,
          ...(alcanceProyecto ? { contactos: presentarContactosContextualesM12(c.contactos_b2b) } : {}),
        }));
      }),
      fuente('TERRENO', fuenteAutorizadaM12('TERRENO', permisos), async () => idObra ? (await prisma.servicio_terreno.findMany({ where: { id_obra: idObra }, select: { servicio_terreno_servicio_terreno_id: true, servicio_terreno_tipo_servicio: true, servicio_terreno_fecha_real: true, servicio_terreno_estado: true } })).map(s => ({ referencia: `SERVICIO_TERRENO:${s.servicio_terreno_servicio_terreno_id}`, proyecto: null, obra: idObra.toString(), fecha: s.servicio_terreno_fecha_real, estado: s.servicio_terreno_estado, tipo: s.servicio_terreno_tipo_servicio })) : []),
      fuente('INVENTARIO', fuenteAutorizadaM12('INVENTARIO', permisos), async () => idsProyecto.length ? (await prisma.orden_trabajo.findMany({ where: { proyecto_id_proyecto: { in: idsProyecto } }, select: { orden_trabajo_id_orden: true, orden_trabajo_fecha_hora: true, orden_trabajo_estado: true, proyecto_id_proyecto: true } })).map(ot => ({ referencia: `OT:${ot.orden_trabajo_id_orden}`, proyecto: ot.proyecto_id_proyecto?.toString() ?? null, obra: idObra?.toString() ?? null, fecha: ot.orden_trabajo_fecha_hora, estado: ot.orden_trabajo_estado })) : []),
      fuente('M3', fuenteAutorizadaM12('M3', permisos), async () => idsProyecto.length ? (await prisma.asignacion_pago_cliente.findMany({ where: { nota_venta: { proyecto_contexto: { is: { proyecto_proyecto_id: { in: idsProyecto } } } } }, select: { id_asignacion_pago_cliente: true, fecha_asignacion: true, id_nota_venta: true, monto_asignado: true, nota_venta: { select: { id_proyecto_contexto: true } } } })).map(p => ({ referencia: `ASIGNACION_PAGO:${p.id_asignacion_pago_cliente}`, proyecto: p.nota_venta.id_proyecto_contexto?.toString() ?? null, obra: idObra?.toString() ?? null, fecha: p.fecha_asignacion, notaVenta: p.id_nota_venta, monto: p.monto_asignado.toString() })) : []),
      fuente('M7', fuenteAutorizadaM12('M7', permisos), async () => idsProyecto.length ? (await prisma.proyecto_financiero.findMany({ where: { id_proyecto_terreno: { in: idsProyecto } }, select: { id_proyecto_financiero: true, id_proyecto_terreno: true, estado_financiero_proyecto: true, fecha_inicio_financiera: true } })).map(p => ({ referencia: `PROYECTO_FINANCIERO:${p.id_proyecto_financiero}`, proyecto: p.id_proyecto_terreno?.toString() ?? null, obra: idObra?.toString() ?? null, fecha: p.fecha_inicio_financiera, estado: p.estado_financiero_proyecto })) : []),
    ]);
    const m5 = { origen: 'M5', disponibilidad: 'FUENTE_NO_DISPONIBLE', alcanceAutorizado: false, antecedentes: [], motivo: 'No existe un contrato owner aprobado para consultar costos M5 desde M12' };
    const fuentes = [m2, terreno, inventario, m3, m5, m7];
    const proyectos = identidad.proyectos.map(proyecto => ({
      proyecto,
      antecedentes: fuentes.flatMap(f => f.antecedentes
        .filter((antecedente: any) => antecedente.proyecto === proyecto.id)
        .map(antecedente => ({ origen: f.origen, ...(antecedente as Record<string, unknown>) }))),
    }));
    const contextoObra = fuentes.flatMap(f => f.antecedentes
      .filter((antecedente: any) => antecedente.proyecto === null)
      .map(antecedente => ({ origen: f.origen, ...(antecedente as Record<string, unknown>) })));
    return { identidad, fuentes, proyectos, contextoObra };
  }

  async registrar(entrada: Entrada, actorId: bigint) {
    const clave = claveUbicacionObra(entrada);
    const existente = await prisma.obra.findUnique({ where: { clave_ubicacion_normalizada: clave } });
    if (existente) throw new ErrorAplicacion(409, `Ya existe una Obra con esa ubicación (ID ${existente.obra_obra_id.toString()}); selecciónala explícitamente`);
    const candidatas = await this.buscar(entrada);
    exigirConfirmacionHumanaObraDistintaM12(candidatas.obras.length, entrada.declaracionRevisionCoincidencias);
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
      const cotizacion = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: { ficha_cliente: { include: { cliente_financiero: true } }, proyecto_originado: { include: { obras: true } } } });
      if (!cotizacion) throw new ErrorAplicacion(404, 'Cotización no encontrada');
      if (cotizacion.estado_cotizacion !== 'borrador') throw new ErrorAplicacion(409, 'Sólo un borrador puede cambiar su Obra vinculada');
      if (cotizacion.revision !== revision) throw new ErrorAplicacion(409, 'La Cotización fue modificada por otra sesión');
      const motivo = texto(entrada.motivo, 2000);
      if (cotizacion.id_obra_contexto && cotizacion.id_obra_contexto !== idObra && !motivo) throw new ErrorAplicacion(400, 'Cambiar la Obra requiere motivo y revisión humana');
      const obra = await tx.obra.findUnique({ where: { obra_obra_id: idObra } });
      if (!obra || ['inactiva', 'cerrada', 'eliminada'].includes(String(obra.obra_estado).toLowerCase())) throw new ErrorAplicacion(409, 'La Obra no está disponible para nuevas vinculaciones');
      const obraProyecto = cotizacion.proyecto_originado?.obras.find(vinculo => vinculo.es_principal)?.id_obra ?? null;
      const coherencia = validarCoherenciaContextualM12({ idObra: idObra.toString(), idObraProyecto: obraProyecto?.toString() ?? null, idProyecto: cotizacion.proyecto_originado?.proyecto_proyecto_id.toString() ?? null });
      if (!coherencia.compatible) throw new ErrorAplicacion(409, coherencia.motivo);
      const rutCotizacion = cotizacion.ficha_cliente.cliente_financiero.rut_cliente;
      if (obra.rut_cliente && rutCotizacion && obra.rut_cliente !== rutCotizacion) throw new ErrorAplicacion(409, 'La Obra pertenece a otro cliente; requiere revisión explícita');
      const actualizada = await tx.cotizacion.update({ where: { id_cotizacion: idCotizacion }, data: { id_obra_contexto: idObra, revision: { increment: 1 } } });
      return Object.assign({ idCotizacion, idObra: idObra.toString(), revision: actualizada.revision, actor: actorId.toString() }, { __auditoriaM9: { anterior: { idObra: cotizacion.id_obra_contexto?.toString() ?? null }, nuevo: { idObra: idObra.toString(), revision: actualizada.revision, motivo: motivo || null } } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
}

export async function formalizarProyectoCotizacion(tx: Prisma.TransactionClient, idCotizacion: number) {
  const cotizacion = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: { ficha_cliente: { include: { cliente_financiero: true } } } });
  if (!cotizacion) throw new ErrorAplicacion(404, 'Cotización no encontrada');
  const existente = await tx.proyecto.findUnique({ where: { id_cotizacion_origen: idCotizacion }, include: { obras: true } });
  if (existente) {
    const obraExistente = existente.obras.find(vinculo => vinculo.es_principal)?.id_obra ?? null;
    const coherencia = validarCoherenciaContextualM12({ idObra: cotizacion.id_obra_contexto?.toString() ?? null, idObraProyecto: obraExistente?.toString() ?? null, idProyecto: existente.proyecto_proyecto_id.toString() });
    if (!coherencia.compatible) throw new ErrorAplicacion(409, coherencia.motivo);
    return existente;
  }
  const coherencia = validarCoherenciaContextualM12({ requiereObra: false, idObra: cotizacion.id_obra_contexto?.toString() ?? null });
  if (!coherencia.compatible) throw new ErrorAplicacion(409, coherencia.motivo);
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
