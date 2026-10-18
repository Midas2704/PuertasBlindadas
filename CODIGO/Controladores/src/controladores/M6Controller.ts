import { prisma } from '../db';
import { Prisma } from '@prisma/client';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { normalizarRut, validarYNormalizarRut, variantesRut } from '../utilidades/rut';
import { identificador, numeroNoNegativo, texto } from '../validaciones/solicitudes';
import { FuentePagoRemuneracion, FuentePagoRemuneracionPrisma } from '../servicios/FuentePagoRemuneracion';
import { OrigenPagoRemuneracion, RepositorioPagoRemuneracionPrisma } from '../servicios/RepositorioPagoRemuneracion';
import { archivoCalculoPreliminarM6, archivoComprobanteAnticipoM6, archivoLiquidacionM6, archivoPeriodoRemuneracionesM6 } from '../m6/documentosRemuneracionPdf';
import { CorreoDesarrollo, CorreoDocumental } from '../utilidades/correo';
import { AuditoriaDocumental, AuditoriaDocumentalLegacyPrisma, CondicionDocumento } from '../servicios/AuditoriaDocumental';
import { calcularPrevisionLegal } from '../m6/calculoPrevisional';
import { archivoCsvAdministrativo } from '../utilidades/csv';
import { resumirIncidenciasTerreno, resumirOperacionTerreno, type OtDashboard, type TareaDashboard } from '../m6/dashboardTerreno';

interface ActorDocumentoM6 { id: bigint; alcanceEmpleadoId?: number | null }
interface ActorTerrenoM6 { id: bigint; administrador: boolean; permisos?: string[]; alcanceEmpleadoId?: number | null }
interface ActorIncidenciaM6 { id: bigint; permisos: string[] }

type Direccion = 'asc' | 'desc';

const nombreCompleto = (empleado: {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string | null;
}) => [empleado.nombres, empleado.apellido_paterno, empleado.apellido_materno].filter(Boolean).join(' ');

const nombreUsuario = (usuario: { usuario_username: string | null; usuario_nombre_completo_primer_nombre_usuario: string | null; usuario_nombre_completo_primer_apellido_usuario: string | null } | null) => usuario ? [usuario.usuario_nombre_completo_primer_nombre_usuario, usuario.usuario_nombre_completo_primer_apellido_usuario].filter(Boolean).join(' ') || usuario.usuario_username || 'Usuario' : null;
const conAuditoriaIncidencia = <T extends object>(salida: T, anterior: Record<string, unknown> | undefined, nuevo: Record<string, unknown>) => { Object.defineProperty(salida, '__auditoriaM9', { enumerable: false, value: { anterior, nuevo } }); return salida; };
const conAuditoriaRectificacion = <T extends object>(salida: T, anterior: Record<string, unknown> | undefined, nuevo: Record<string, unknown>) => { Object.defineProperty(salida, '__auditoriaM9', { enumerable: false, value: { anterior, nuevo } }); return salida; };
const leerEvidenciaIncidencia = (valor: unknown) => {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) return null;
  const evidencia = valor as Record<string, unknown>;
  const contenido = String(evidencia.contenido || '');
  const coincidencia = /^data:([a-z0-9.+/-]+);base64,([A-Za-z0-9+/=]+)$/i.exec(contenido);
  if (!coincidencia) throw new ErrorAplicacion(400, 'La evidencia debe ser un archivo válido');
  const permitidos = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
  if (!permitidos.has(coincidencia[1].toLowerCase())) throw new ErrorAplicacion(400, 'Formato de evidencia no permitido');
  const datos = Buffer.from(coincidencia[2], 'base64');
  if (!datos.length || datos.length > 5 * 1024 * 1024) throw new ErrorAplicacion(400, 'La evidencia debe pesar entre 1 byte y 5 MB');
  return { datos, tipo: coincidencia[1].toLowerCase(), nombre: texto(evidencia.nombre, 255) || 'evidencia', observacion: texto(evidencia.observacion, 1000) || null };
};
export function validarRevisionIncidenciaM6(entrada: { estadoRevision: string; idCreador: bigint | null; idRevisor: bigint; idCategoria: number | null; cantidadEvidencias: number; decision: 'aprobada' | 'rechazada' }) {
  if (entrada.estadoRevision !== 'pendiente_revision') throw new ErrorAplicacion(409, 'La incidencia ya fue revisada');
  if (entrada.idCreador === entrada.idRevisor) throw new ErrorAplicacion(409, 'El creador no puede aprobar ni rechazar su propia incidencia');
  if (!entrada.idCategoria) throw new ErrorAplicacion(409, 'La incidencia requiere categoría estructurada antes de revisión');
  if (entrada.decision === 'aprobada' && !entrada.cantidadEvidencias) throw new ErrorAplicacion(409, 'Aprobación requiere evidencia');
}

export function validarTransicionResolucionIncidenciaM6(entrada:{accion:'corregir'|'cerrar';estado:string;estadoRevision:string;confirmado?:boolean}) {
  if(entrada.estadoRevision!=='aprobada')throw new ErrorAplicacion(409,'Sólo una incidencia aprobada puede avanzar a corrección o cierre');
  const esperado=entrada.accion==='corregir'?'pendiente':'corregida';
  if(entrada.estado!==esperado)throw new ErrorAplicacion(409,'La transición de resolución no es válida');
  if(entrada.accion==='cerrar'&&entrada.confirmado!==true)throw new ErrorAplicacion(400,'La validación de cierre debe confirmarse');
}

export function clasificarResultadoInstalacion(estadoVisita: string | null, resultado: string | null) {
  const estado = (estadoVisita || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const textoResultado = (resultado || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (/reprogram/.test(textoResultado)) return 'REPROGRAMACION_NECESARIA';
  if (/parcial/.test(textoResultado)) return 'PARCIALMENTE_REALIZADA';
  if (/no ejecut|no realizada|cancelad/.test(textoResultado) || /cancelad|no ejecut/.test(estado)) return 'VISITA_NO_EJECUTADA';
  if (/instalacion completada|instalacion realizada/.test(textoResultado)) return 'INSTALACION_COMPLETADA';
  if (resultado) return 'RESULTADO_REGISTRADO';
  return 'PENDIENTE';
}

const fechaEntrada = (valor: unknown, nombre: string, obligatoria = true) => {
  if ((valor === undefined || valor === null || valor === '') && !obligatoria) return null;
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
    throw new ErrorAplicacion(400, `${nombre} inválida`);
  }
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== valor) {
    throw new ErrorAplicacion(400, `${nombre} inválida`);
  }
  return fecha;
};

const decimalOpcional = (valor: unknown, nombre: string) => {
  if (valor === undefined || valor === null || valor === '') return null;
  const numero = numeroNoNegativo(valor, nombre);
  return new Prisma.Decimal(numero);
};

const enteroPositivo = (valor: unknown, nombre: string) => {
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) throw new ErrorAplicacion(400, `${nombre} debe ser un entero positivo`);
  return numero;
};

const normalizarUnidad = (valor: unknown) => {
  const base = texto(valor, 30).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\./g, '').replace(/\s+/g, ' ').trim().toUpperCase();
  if (!base) return null;
  if (['UN', 'UND', 'UNID', 'UNIDAD', 'UNIDADES'].includes(base)) return 'UNIDAD';
  if (['H', 'HR', 'HRS', 'HORA', 'HORAS'].includes(base)) return 'HORA';
  return base;
};

const decimalMonetario = (valor: unknown, nombre: string, positivo = false) => {
  const cadena = typeof valor === 'number' ? String(valor) : typeof valor === 'string' ? valor.trim() : '';
  if (!/^\d+(?:\.\d{1,4})?$/.test(cadena)) throw new ErrorAplicacion(400, `${nombre} debe ser un monto no negativo con hasta cuatro decimales`);
  const decimal = new Prisma.Decimal(cadena);
  if (!decimal.isFinite() || decimal.isNegative() || (positivo && decimal.isZero())) throw new ErrorAplicacion(400, `${nombre} inválido`);
  return decimal;
};

const horaEntrada = (valor: unknown, nombre: string) => {
  if (valor === undefined || valor === null || valor === '') return null;
  if (typeof valor !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(valor)) throw new ErrorAplicacion(400, `${nombre} inválido`);
  return new Date(`1970-01-01T${valor}:00.000Z`);
};

const esConflictoSerializable = (error: unknown) => {
  const detalle = error as { code?: string; cause?: { originalCode?: string; kind?: string } };
  return detalle.code === 'P2034' || detalle.cause?.originalCode === '40001' || detalle.cause?.kind === 'TransactionWriteConflict';
};

export class M6Controller {
  private readonly fuentePagoRemuneracion: FuentePagoRemuneracion;

  constructor(
    fuentePagoRemuneracion?: FuentePagoRemuneracion,
    private readonly repositorioPago = new RepositorioPagoRemuneracionPrisma(),
    private readonly correoDocumental: CorreoDocumental = new CorreoDesarrollo(),
    private readonly auditoriaDocumental: AuditoriaDocumental = new AuditoriaDocumentalLegacyPrisma(),
  ) {
    this.fuentePagoRemuneracion = fuentePagoRemuneracion ?? new FuentePagoRemuneracionPrisma(this.repositorioPago);
  }

  async crearEmpleado(entrada: Record<string, unknown>) {
    const rut = validarYNormalizarRut(entrada.rut);
    const nombres = texto(entrada.nombres, 120);
    const apellidoPaterno = texto(entrada.apellidoPaterno, 80);
    const apellidoMaterno = texto(entrada.apellidoMaterno, 80) || null;
    if (!rut || !nombres || !apellidoPaterno) {
      throw new ErrorAplicacion(400, 'RUT, nombres y apellido paterno son obligatorios');
    }
    try {
      const empleado = await prisma.empleado.create({
        data: {
          rut_empleado: rut,
          nombres,
          apellido_paterno: apellidoPaterno,
          apellido_materno: apellidoMaterno,
          estado_laboral: 'activo',
        },
        select: { id_empleado: true },
      });
      return this.obtenerEmpleado(empleado.id_empleado);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ErrorAplicacion(409, 'Ya existe un empleado con ese RUT');
      }
      throw error;
    }
  }

  async listarEmpleados(consulta: Record<string, unknown>) {
    const busqueda = texto(consulta.busqueda, 120);
    const rutBuscado = normalizarRut(busqueda);
    const variantesRutBuscado = rutBuscado ? variantesRut(rutBuscado) : [];
    const estado = texto(consulta.estado || 'todos', 30).toLowerCase();
    const ordenar = texto(consulta.ordenar || 'nombre', 20);
    const direccion = texto(consulta.direccion || 'asc', 4).toLowerCase() as Direccion;
    const area = texto(consulta.area, 30);
    if (!['todos', 'activo', 'inactivo', 'desvinculado', 'suspendido'].includes(estado)) {
      throw new ErrorAplicacion(400, 'Estado de empleado inválido');
    }
    if (!['nombre', 'rut', 'estado', 'cargo'].includes(ordenar) || !['asc', 'desc'].includes(direccion)) {
      throw new ErrorAplicacion(400, 'Ordenamiento de empleados inválido');
    }

    const orderBy = ordenar === 'rut'
      ? [{ rut_empleado: direccion }]
      : ordenar === 'estado'
        ? [{ estado_laboral: direccion }, { apellido_paterno: 'asc' as const }]
        : ordenar === 'cargo'
          ? [{ cargo: { nombre_cargo: direccion } }, { apellido_paterno: 'asc' as const }]
          : [{ apellido_paterno: direccion }, { apellido_materno: direccion }, { nombres: direccion }];

    const empleados = await prisma.empleado.findMany({
      where: {
        estado_laboral: estado === 'todos' ? undefined : estado,
        OR: busqueda ? [
          { rut_empleado: { contains: busqueda, mode: 'insensitive' } },
          ...variantesRutBuscado.map((rut) => ({ rut_empleado: { contains: rut, mode: 'insensitive' as const } })),
          { nombres: { contains: busqueda, mode: 'insensitive' } },
          { apellido_paterno: { contains: busqueda, mode: 'insensitive' } },
          { apellido_materno: { contains: busqueda, mode: 'insensitive' } },
        ] : undefined,
        asignaciones_area_trabajo: area === 'sin-asignar'
          ? { none: { vigencia_hasta: null } }
          : area ? { some: { id_area_trabajo: BigInt(enteroPositivo(area, 'Área')), vigencia_hasta: null } } : undefined,
      },
      select: {
        id_empleado: true,
        rut_empleado: true,
        nombres: true,
        apellido_paterno: true,
        apellido_materno: true,
        estado_laboral: true,
        cargo: { select: { nombre_cargo: true } },
        asignaciones_area_trabajo: { where: { vigencia_hasta: null }, take: 1, select: { area: { select: { area_trabajo_id_area: true, area_trabajo_nombre_area: true } } } },
      },
      orderBy,
    });

    return empleados.map((empleado) => ({
      id: empleado.id_empleado,
      rut: empleado.rut_empleado,
      nombreCompleto: nombreCompleto(empleado),
      estado: empleado.estado_laboral,
      cargoActual: empleado.cargo?.nombre_cargo || null,
      areaActual: empleado.asignaciones_area_trabajo[0] ? { id: empleado.asignaciones_area_trabajo[0].area.area_trabajo_id_area.toString(), nombre: empleado.asignaciones_area_trabajo[0].area.area_trabajo_nombre_area } : null,
    }));
  }

  async obtenerEmpleado(id: number) {
    const empleado = await prisma.empleado.findUnique({
      where: { id_empleado: id },
      select: {
        id_empleado: true,
        rut_empleado: true,
        nombres: true,
        apellido_paterno: true,
        apellido_materno: true,
        fecha_nacimiento: true,
        estado_laboral: true,
        cargo: { select: { nombre_cargo: true } },
        asignaciones_area_trabajo: { where: { vigencia_hasta: null }, take: 1, select: { area: { select: { area_trabajo_id_area: true, area_trabajo_nombre_area: true } } } },
      },
    });
    if (!empleado) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    return {
      id: empleado.id_empleado,
      rut: empleado.rut_empleado,
      nombres: empleado.nombres,
      apellidoPaterno: empleado.apellido_paterno,
      apellidoMaterno: empleado.apellido_materno,
      nombreCompleto: nombreCompleto(empleado),
      fechaNacimiento: empleado.fecha_nacimiento,
      estado: empleado.estado_laboral,
      cargoActual: empleado.cargo?.nombre_cargo || null,
      areaActual: empleado.asignaciones_area_trabajo[0] ? { id: empleado.asignaciones_area_trabajo[0].area.area_trabajo_id_area.toString(), nombre: empleado.asignaciones_area_trabajo[0].area.area_trabajo_nombre_area } : null,
    };
  }

  async listarAreasTrabajo(incluirInactivas = true) {
    const areas = await prisma.area_trabajo.findMany({
      where: incluirInactivas ? undefined : { area_trabajo_activo: true },
      include: { configuracion: true, asignaciones_empleados: { where: { vigencia_hasta: null, empleado: { estado_laboral: 'activo' } }, select: { id_asignacion_area_empleado: true } } },
      orderBy: { area_trabajo_nombre_area: 'asc' },
    });
    return areas.map(area => ({
      id: area.area_trabajo_id_area.toString(),
      nombre: area.area_trabajo_nombre_area || `Área ${area.area_trabajo_id_area.toString()}`,
      descripcion: area.configuracion?.descripcion || '',
      activa: area.area_trabajo_activo === true,
      empleadosActivos: area.asignaciones_empleados.length,
    }));
  }

  async crearAreaTrabajo(entrada: Record<string, unknown>) {
    const nombre = texto(entrada.nombre, 150);
    const descripcion = texto(entrada.descripcion, 150) || null;
    if (!nombre) throw new ErrorAplicacion(400, 'El nombre del área es obligatorio');
    try {
      await prisma.$transaction(async tx => {
        const existentes = await tx.area_trabajo.findMany({ select: { area_trabajo_nombre_area: true } });
        if (existentes.some(area => area.area_trabajo_nombre_area?.trim().toLocaleLowerCase('es') === nombre.toLocaleLowerCase('es'))) throw new ErrorAplicacion(409, 'Ya existe un área con ese nombre');
        const area = await tx.area_trabajo.create({ data: { area_trabajo_nombre_area: nombre, area_trabajo_activo: true } });
        await tx.configuracion_area_trabajo.create({ data: { id_area_trabajo: area.area_trabajo_id_area, descripcion } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      if (esConflictoSerializable(error) || error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe un área con ese nombre');
      throw error;
    }
    return this.listarAreasTrabajo();
  }

  async actualizarAreaTrabajo(id: bigint, entrada: Record<string, unknown>) {
    const actual = await prisma.area_trabajo.findUnique({ where: { area_trabajo_id_area: id } });
    if (!actual) throw new ErrorAplicacion(404, 'Área de trabajo no encontrada');
    const nombre = entrada.nombre === undefined ? actual.area_trabajo_nombre_area : texto(entrada.nombre, 150);
    const descripcion = entrada.descripcion === undefined ? undefined : texto(entrada.descripcion, 150) || null;
    if (!nombre) throw new ErrorAplicacion(400, 'El nombre del área es obligatorio');
    try {
      await prisma.$transaction(async tx => {
        const existentes = await tx.area_trabajo.findMany({ where: { area_trabajo_id_area: { not: id } }, select: { area_trabajo_nombre_area: true } });
        if (existentes.some(area => area.area_trabajo_nombre_area?.trim().toLocaleLowerCase('es') === nombre.toLocaleLowerCase('es'))) throw new ErrorAplicacion(409, 'Ya existe un área con ese nombre');
        await tx.area_trabajo.update({ where: { area_trabajo_id_area: id }, data: { area_trabajo_nombre_area: nombre } });
        if (descripcion !== undefined) await tx.configuracion_area_trabajo.upsert({ where: { id_area_trabajo: id }, create: { id_area_trabajo: id, descripcion }, update: { descripcion, revision: { increment: 1 } } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      if (esConflictoSerializable(error) || error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe un área con ese nombre');
      throw error;
    }
    return this.listarAreasTrabajo();
  }

  async cambiarEstadoAreaTrabajo(id: bigint, activa: boolean) {
    const resultado = await prisma.area_trabajo.updateMany({ where: { area_trabajo_id_area: id }, data: { area_trabajo_activo: activa } });
    if (!resultado.count) throw new ErrorAplicacion(404, 'Área de trabajo no encontrada');
    return this.listarAreasTrabajo();
  }

  async listarEmpleadosArea(idArea: bigint) {
    const area = await prisma.area_trabajo.findUnique({ where: { area_trabajo_id_area: idArea }, select: { area_trabajo_id_area: true } });
    if (!area) throw new ErrorAplicacion(404, 'Área de trabajo no encontrada');
    const asignaciones = await prisma.asignacion_area_empleado.findMany({
      where: { id_area_trabajo: idArea, vigencia_hasta: null, empleado: { estado_laboral: 'activo' } },
      include: { empleado: { include: { cargo: true } } },
      orderBy: [{ empleado: { apellido_paterno: 'asc' } }, { empleado: { nombres: 'asc' } }],
    });
    return asignaciones.map(item => ({ id: item.empleado.id_empleado, rut: item.empleado.rut_empleado, nombreCompleto: nombreCompleto(item.empleado), cargoActual: item.empleado.cargo?.nombre_cargo || null }));
  }

  async obtenerHistorialAreaEmpleado(idEmpleado: number) {
    const existe = await prisma.empleado.findUnique({ where: { id_empleado: idEmpleado }, select: { id_empleado: true } });
    if (!existe) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    const filas = await prisma.asignacion_area_empleado.findMany({
      where: { id_empleado: idEmpleado }, include: { area: true, asignador: true, finalizador: true }, orderBy: { vigencia_desde: 'desc' },
    });
    return filas.map(item => ({ id: item.id_asignacion_area_empleado, area: { id: item.id_area_trabajo.toString(), nombre: item.area.area_trabajo_nombre_area }, vigenciaDesde: item.vigencia_desde, vigenciaHasta: item.vigencia_hasta, motivo: item.motivo, asignadoPor: nombreUsuario(item.asignador), finalizadoPor: nombreUsuario(item.finalizador) }));
  }

  async asignarAreaEmpleado(idEmpleado: number, entrada: Record<string, unknown>, actorId: bigint) {
    const idArea = BigInt(enteroPositivo(entrada.idArea, 'Área'));
    const motivo = texto(entrada.motivo, 1000);
    if (!motivo) throw new ErrorAplicacion(400, 'El motivo del cambio es obligatorio');
    try {
      await prisma.$transaction(async tx => {
        const [empleado, area, vigente] = await Promise.all([
          tx.empleado.findUnique({ where: { id_empleado: idEmpleado }, select: { estado_laboral: true } }),
          tx.area_trabajo.findUnique({ where: { area_trabajo_id_area: idArea }, select: { area_trabajo_activo: true } }),
          tx.asignacion_area_empleado.findFirst({ where: { id_empleado: idEmpleado, vigencia_hasta: null } }),
        ]);
        if (!empleado) throw new ErrorAplicacion(404, 'Empleado no encontrado');
        if (empleado.estado_laboral !== 'activo') throw new ErrorAplicacion(409, 'Sólo los empleados activos pueden asignarse a producción');
        if (!area) throw new ErrorAplicacion(404, 'Área de trabajo no encontrada');
        if (area.area_trabajo_activo !== true) throw new ErrorAplicacion(409, 'No se permiten nuevas asignaciones a un área inactiva');
        if (vigente?.id_area_trabajo === idArea) throw new ErrorAplicacion(409, 'El empleado ya pertenece a esta área');
        const ahora = new Date();
        if (vigente) await tx.asignacion_area_empleado.update({ where: { id_asignacion_area_empleado: vigente.id_asignacion_area_empleado }, data: { vigencia_hasta: ahora, finalizado_por: actorId } });
        await tx.asignacion_area_empleado.create({ data: { id_empleado: idEmpleado, id_area_trabajo: idArea, vigencia_desde: ahora, motivo, asignado_por: actorId } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      if (esConflictoSerializable(error) || error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'La asignación cambió concurrentemente; vuelve a intentarlo');
      throw error;
    }
    return this.obtenerHistorialAreaEmpleado(idEmpleado);
  }

  async obtenerHistorialRemuneracional(idEmpleado: number, consulta: Record<string, unknown> = {}) {
    const empleado = await prisma.empleado.findUnique({ where: { id_empleado: idEmpleado }, select: { id_empleado: true, rut_empleado: true, nombres: true, apellido_paterno: true, apellido_materno: true } });
    if (!empleado) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    const anio = consulta.anio === undefined || consulta.anio === '' ? null : Number(consulta.anio);
    if (anio !== null && (!Number.isInteger(anio) || anio < 1900 || anio > 9999)) throw new ErrorAplicacion(400, 'Año inválido');
    const desde = fechaEntrada(consulta.desde, 'Fecha desde', false);
    const hasta = fechaEntrada(consulta.hasta, 'Fecha hasta', false);
    if (desde && hasta && desde > hasta) throw new ErrorAplicacion(400, 'El rango de fechas es inválido');
    const tipoEvento = texto(consulta.tipoEvento || 'TODOS', 30).toUpperCase();
    if (!['TODOS', 'REMUNERACION', 'PAGO', 'AJUSTE', 'REVERSION', 'DOCUMENTO'].includes(tipoEvento)) throw new ErrorAplicacion(400, 'Tipo de evento inválido');
    const periodoWhere: Prisma.periodo_remuneracionWhereInput = {
      ...(anio === null ? {} : { anio }),
      ...(desde ? { fecha_fin: { gte: desde } } : {}),
      ...(hasta ? { fecha_inicio: { lte: hasta } } : {}),
    };
    const remuneraciones = await prisma.remuneracion.findMany({
      where: { id_empleado: idEmpleado, periodo: periodoWhere },
      include: {
        periodo: true,
        componentes: { include: { concepto: true }, orderBy: { id_componente_remuneracion: 'asc' } },
        ajustes_posteriores: { include: { regularizacion: true }, orderBy: { creado_en: 'asc' } },
        creador: true, calculador: true, cerrador: true, reemplazada_por: true,
      },
      orderBy: [{ periodo: { anio: 'desc' } }, { periodo: { mes: 'desc' } }, { creado_en: 'asc' }],
    });
    const anticipos = await prisma.anticipo_remuneracion.findMany({ where: { id_empleado: idEmpleado, periodo: periodoWhere }, include: { periodo: true }, orderBy: { creado_en: 'asc' } });
    const idsRemuneraciones = remuneraciones.map(item => item.id_remuneracion);
    const ajustes = remuneraciones.flatMap(item => item.ajustes_posteriores);
    const idsRegularizaciones = ajustes.flatMap(item => item.regularizacion ? [item.regularizacion.id_regularizacion] : []);
    const idsAnticipos = anticipos.map(item => item.id_anticipo);
    const pagos = await this.repositorioPago.listarPorOrigenes(prisma, [
      ...idsRemuneraciones.map(id => this.repositorioPago.remuneracion(id)),
      ...idsRegularizaciones.map(id => this.repositorioPago.regularizacion(id)),
      ...idsAnticipos.map(id => this.repositorioPago.anticipo(id)),
    ]);
    const idsUsuarios = [...new Set(
      remuneraciones
        .flatMap(item => [item.creado_por, item.calculado_por, item.cerrado_por])
        .concat(pagos.flatMap(item => [item.creado_por, item.confirmado_por, item.anulado_por, ...item.reversiones.map(reversion => reversion.registrado_por)]))
        .filter((id): id is bigint => id !== null)
        .map(id => id.toString()),
    )];
    const usuarios = await prisma.usuario.findMany({ where: { usuario_id_usuario: { in: idsUsuarios.map(id => BigInt(id)) } }, select: { usuario_id_usuario: true, usuario_username: true, usuario_nombre_completo_primer_nombre_usuario: true } });
    const nombresUsuario = new Map(usuarios.map(item => [item.usuario_id_usuario.toString(), item.usuario_nombre_completo_primer_nombre_usuario || item.usuario_username]));
    const idsPeriodos = [...new Set(remuneraciones.map(item => item.id_periodo_remuneracion))];
    const documentos = await this.auditoriaDocumental.listarEventosHistorial(prisma, idsRemuneraciones, idsPeriodos);
    const numero = (valor: Prisma.Decimal | null) => valor === null ? null : Number(valor);
    const presentarPagoHistorial = (pago: (typeof pagos)[number]) => {
      const totalRevertido = pago.reversiones.reduce((total, item) => total.add(item.monto), new Prisma.Decimal(0));
      const montoEfectivo = pago.estado === 'CONFIRMADO' ? Prisma.Decimal.max(new Prisma.Decimal(0), pago.monto.sub(totalRevertido)) : new Prisma.Decimal(0);
      const eventos = [
        { tipo: 'PAGO', accion: 'Pago preparado', fecha: pago.creado_en, monto: Number(pago.monto), usuario: nombresUsuario.get(pago.creado_por.toString()) || null, motivo: null },
        ...(pago.confirmado_en ? [{ tipo: 'PAGO', accion: 'Pago confirmado', fecha: pago.confirmado_en, monto: Number(pago.monto), usuario: pago.confirmado_por ? nombresUsuario.get(pago.confirmado_por.toString()) || null : null, motivo: null }] : []),
        ...pago.reversiones.map(item => ({ tipo: 'REVERSION', accion: 'Reversión de pago', fecha: item.registrado_en, monto: -Number(item.monto), usuario: nombresUsuario.get(item.registrado_por.toString()) || null, motivo: item.motivo })),
        ...(pago.anulado_en ? [{ tipo: 'PAGO', accion: 'Pago anulado', fecha: pago.anulado_en, monto: Number(pago.monto), usuario: pago.anulado_por ? nombresUsuario.get(pago.anulado_por.toString()) || null : null, motivo: pago.motivo_anulacion }] : []),
      ];
      return { id: pago.id_pago_remuneracion, origenTipo: pago.origen_tipo, origenId: pago.origen_id, estado: pago.estado, montoOriginal: Number(pago.monto), montoRevertido: Number(totalRevertido), montoEfectivo: Number(montoEfectivo), medioPago: pago.medio_pago.nombre_medio_pago, respaldo: pago.respaldo, referencia: pago.referencia, eventos, auditoria: { entidadTipo: 'PAGO_REMUNERACION', entidadReferencia: String(pago.id_pago_remuneracion) } };
    };
    const pagosPresentados = pagos.map(presentarPagoHistorial);
    const periodos = new Map<string, any>();
    const asegurarPeriodo = (periodo: { anio: number; mes: number; fecha_inicio: Date; fecha_fin: Date }) => {
      const clave = `${periodo.anio}-${String(periodo.mes).padStart(2, '0')}`;
      if (!periodos.has(clave)) periodos.set(clave, { clave, anio: periodo.anio, mes: periodo.mes, fechaInicio: periodo.fecha_inicio, fechaFin: periodo.fecha_fin, remuneraciones: [], anticipos: [], pagos: [], ajustes: [], documentos: [], resumen: { liquido: 0, pagadoEfectivo: 0, pendiente: 0, ajustes: 0 } });
      return periodos.get(clave);
    };
    const porPeriodo = new Map<string, typeof remuneraciones>();
    for (const remuneracion of remuneraciones) {
      const clave = `${remuneracion.periodo.anio}-${remuneracion.periodo.mes}`;
      porPeriodo.set(clave, [...(porPeriodo.get(clave) || []), remuneracion]);
    }
    for (const remuneracion of remuneraciones) {
      const periodo = asegurarPeriodo(remuneracion.periodo);
      const versiones = porPeriodo.get(`${remuneracion.periodo.anio}-${remuneracion.periodo.mes}`) || [];
      const version = versiones.findIndex(item => item.id_remuneracion === remuneracion.id_remuneracion) + 1;
      const pagosRemuneracion = pagosPresentados.filter(item => item.origenTipo === 'REMUNERACION' && item.origenId === remuneracion.id_remuneracion);
      const snapshot = remuneracion.snapshot_previsional && typeof remuneracion.snapshot_previsional === 'object' ? remuneracion.snapshot_previsional : null;
      periodo.remuneraciones.push({ id: remuneracion.id_remuneracion, version, vigente: !remuneracion.reemplazada_por, reemplazaA: remuneracion.reemplaza_a_id ? `Versión ${Math.max(1, version - 1)}` : null, estado: remuneracion.estado, creadoEn: remuneracion.creado_en, calculadoEn: remuneracion.calculado_en, cerradoEn: remuneracion.cerrado_en, actores: { creador: nombresUsuario.get(remuneracion.creado_por.toString()) || null, calculador: remuneracion.calculado_por ? nombresUsuario.get(remuneracion.calculado_por.toString()) || null : null, cerrador: remuneracion.cerrado_por ? nombresUsuario.get(remuneracion.cerrado_por.toString()) || null : null }, totales: { haberes: numero(remuneracion.total_haberes), deduccionesTrabajador: numero(remuneracion.total_deducciones), descuentosPrevisionales: numero(remuneracion.total_descuentos_previsionales), impuesto: numero(remuneracion.total_impuesto), otrasDeducciones: numero(remuneracion.total_otras_deducciones), aportesEmpleador: numero(remuneracion.total_aportes_empleador), liquido: numero(remuneracion.liquido_preliminar), costoEmpresa: numero(remuneracion.costo_empresa), baseImponible: numero(remuneracion.base_imponible), baseTributable: numero(remuneracion.base_tributable) }, componentes: remuneracion.componentes.map(item => this.presentarComponente(item)), snapshotPrevisional: snapshot, pagos: pagosRemuneracion });
      if (remuneracion.estado !== 'reemplazada') { periodo.resumen.liquido += Number(remuneracion.liquido_preliminar || 0); periodo.resumen.pagadoEfectivo += pagosRemuneracion.reduce((total, item) => total + item.montoEfectivo, 0); }
      for (const ajuste of remuneracion.ajustes_posteriores) {
        const pagoRegularizacion = ajuste.regularizacion ? pagosPresentados.filter(item => item.origenTipo === 'REGULARIZACION' && item.origenId === ajuste.regularizacion!.id_regularizacion) : [];
        const presentado = { id: ajuste.id_ajuste_posterior, remuneracionId: ajuste.id_remuneracion, fechaHallazgo: ajuste.fecha_hallazgo, direccion: ajuste.direccion, monto: Number(ajuste.monto), motivo: ajuste.motivo, tratamiento: ajuste.tratamiento, periodoOrigenId: ajuste.id_periodo_origen, periodoAplicableId: ajuste.id_periodo_aplicable, regularizacion: ajuste.regularizacion ? { id: ajuste.regularizacion.id_regularizacion, monto: Number(ajuste.regularizacion.monto), estado: ajuste.regularizacion.estado, creadoEn: ajuste.regularizacion.creado_en, cerradoEn: ajuste.regularizacion.cerrado_en, pagos: pagoRegularizacion } : null };
        periodo.ajustes.push(presentado); periodo.resumen.ajustes += ajuste.direccion === 'NEGATIVO' ? -Number(ajuste.monto) : Number(ajuste.monto);
      }
    }
    for (const anticipo of anticipos) { const periodo = asegurarPeriodo(anticipo.periodo); const pagosAnticipo = pagosPresentados.filter(item => item.origenTipo === 'ANTICIPO' && item.origenId === anticipo.id_anticipo); periodo.anticipos.push({ id: anticipo.id_anticipo, modalidad: anticipo.modalidad, valorIngresado: Number(anticipo.valor_ingresado), montoFinal: numero(anticipo.monto_final), estadoValorizacion: anticipo.estado_valorizacion, creadoEn: anticipo.creado_en, pagos: pagosAnticipo }); }
    for (const periodo of periodos.values()) { periodo.pagos = pagosPresentados.filter(item => periodo.remuneraciones.some((remuneracion: any) => item.origenTipo === 'REMUNERACION' && item.origenId === remuneracion.id) || periodo.anticipos.some((anticipo: any) => item.origenTipo === 'ANTICIPO' && item.origenId === anticipo.id) || periodo.ajustes.some((ajuste: any) => item.origenTipo === 'REGULARIZACION' && item.origenId === ajuste.regularizacion?.id)); periodo.resumen.pendiente = Math.max(0, periodo.resumen.liquido - periodo.resumen.pagadoEfectivo); }
    for (const documento of documentos) { const periodo = documento.entidad === 'PERIODO_REMUNERACION' ? [...periodos.values()].find(item => idsPeriodos.includes(documento.entidadId) && remuneraciones.some(rem => rem.id_periodo_remuneracion === documento.entidadId && rem.periodo.anio === item.anio && rem.periodo.mes === item.mes)) : [...periodos.values()].find(item => item.remuneraciones.some((rem: any) => rem.id === documento.entidadId)); if (periodo) periodo.documentos.push(documento); }
    const salida = [...periodos.values()].sort((a, b) => b.anio - a.anio || b.mes - a.mes).map(periodo => ({ ...periodo, remuneraciones: tipoEvento === 'TODOS' || tipoEvento === 'REMUNERACION' ? periodo.remuneraciones : [], pagos: tipoEvento === 'TODOS' || ['PAGO', 'REVERSION'].includes(tipoEvento) ? periodo.pagos : [], ajustes: tipoEvento === 'TODOS' || tipoEvento === 'AJUSTE' ? periodo.ajustes : [], documentos: tipoEvento === 'TODOS' || tipoEvento === 'DOCUMENTO' ? periodo.documentos : [], anticipos: tipoEvento === 'TODOS' || tipoEvento === 'PAGO' ? periodo.anticipos : [] }));
    return { empleado: { id: empleado.id_empleado, rut: empleado.rut_empleado, nombreCompleto: nombreCompleto(empleado) }, filtros: { anio, desde, hasta, tipoEvento }, periodos: salida };
  }

  async catalogosLaborales() {
    const tiposVinculo = await prisma.tipo_vinculo_laboral.findMany({
      where: { estado_tipo_vinculo_laboral: 'activo' },
      orderBy: { nombre_tipo_vinculo_laboral: 'asc' },
      select: { id_tipo_vinculo_laboral: true, nombre_tipo_vinculo_laboral: true },
    });
    return { tiposVinculo: tiposVinculo.map((tipo) => ({ id: tipo.id_tipo_vinculo_laboral, nombre: tipo.nombre_tipo_vinculo_laboral })) };
  }

  async actualizarDatosBaseEmpleado(id: number, entrada: Record<string, unknown>) {
    const actual = await prisma.empleado.findUnique({ where: { id_empleado: id } });
    if (!actual) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    const estados = ['activo', 'inactivo', 'desvinculado', 'suspendido'];
    const data: Prisma.empleadoUncheckedUpdateInput = {};
    if (entrada.nombres !== undefined) {
      const valor = texto(entrada.nombres, 120);
      if (!valor) throw new ErrorAplicacion(400, 'Los nombres son obligatorios');
      data.nombres = valor;
    }
    if (entrada.apellidoPaterno !== undefined) {
      const valor = texto(entrada.apellidoPaterno, 80);
      if (!valor) throw new ErrorAplicacion(400, 'El apellido paterno es obligatorio');
      data.apellido_paterno = valor;
    }
    if (entrada.apellidoMaterno !== undefined) data.apellido_materno = texto(entrada.apellidoMaterno, 80) || null;
    if (entrada.fechaNacimiento !== undefined) data.fecha_nacimiento = fechaEntrada(entrada.fechaNacimiento, 'Fecha de nacimiento', false);
    if (entrada.estado !== undefined) {
      const estado = texto(entrada.estado, 30).toLowerCase();
      if (!estados.includes(estado)) throw new ErrorAplicacion(400, 'Estado laboral inválido');
      data.estado_laboral = estado;
    }
    await prisma.empleado.update({ where: { id_empleado: id }, data });
    return this.obtenerEmpleado(id);
  }

  private presentarRelacion(relacion: {
    id_relacion_laboral_empleado: number;
    fecha_inicio: Date;
    fecha_termino: Date | null;
    estado: string;
    id_tipo_vinculo_laboral: number | null;
    jornada: string | null;
    tipo_vinculo_laboral: { nombre_tipo_vinculo_laboral: string } | null;
  }) {
    return {
      id: relacion.id_relacion_laboral_empleado,
      fechaInicio: relacion.fecha_inicio,
      fechaTermino: relacion.fecha_termino,
      estado: relacion.estado,
      idTipoVinculo: relacion.id_tipo_vinculo_laboral,
      tipoVinculo: relacion.tipo_vinculo_laboral?.nombre_tipo_vinculo_laboral || null,
      jornada: relacion.jornada,
    };
  }

  async listarRelacionesLaborales(idEmpleado: number) {
    if (!await prisma.empleado.count({ where: { id_empleado: idEmpleado } })) {
      throw new ErrorAplicacion(404, 'Empleado no encontrado');
    }
    const relaciones = await prisma.relacion_laboral_empleado.findMany({
      where: { id_empleado: idEmpleado },
      include: { tipo_vinculo_laboral: { select: { nombre_tipo_vinculo_laboral: true } } },
      orderBy: [{ fecha_inicio: 'desc' }, { id_relacion_laboral_empleado: 'desc' }],
    });
    return relaciones.map((relacion) => this.presentarRelacion(relacion));
  }

  private async validarPeriodosCerradosParaIntervalos(tx: Prisma.TransactionClient, intervalos: Array<{ inicio: Date; termino: Date | null }>) {
    const afectados = await tx.periodo_remuneracion.findFirst({
      where: {
        cerrado_en: { not: null },
        OR: intervalos.map(({ inicio, termino }) => ({
          fecha_fin: { gte: inicio },
          ...(termino ? { fecha_inicio: { lte: termino } } : {}),
        })),
      },
      select: { anio: true, mes: true },
    });
    if (afectados) {
      throw new ErrorAplicacion(409, `La relación laboral afecta el período de remuneración cerrado ${afectados.anio}-${String(afectados.mes).padStart(2, '0')}`, 'PERIODO_REMUNERACION_CERRADO');
    }
  }

  async crearRelacionLaboral(idEmpleado: number, entrada: Record<string, unknown>) {
    const fechaInicio = fechaEntrada(entrada.fechaInicio, 'Fecha de inicio')!;
    const fechaTermino = fechaEntrada(entrada.fechaTermino, 'Fecha de término', false);
    if (fechaTermino && fechaTermino < fechaInicio) throw new ErrorAplicacion(400, 'La fecha de término no puede ser anterior al inicio');
    const idTipoVinculo = entrada.idTipoVinculo === undefined || entrada.idTipoVinculo === '' ? null : identificador(entrada.idTipoVinculo);
    const jornada = texto(entrada.jornada, 80) || null;
    try {
      await prisma.$transaction(async (tx) => {
        if (!await tx.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
        if (idTipoVinculo && !await tx.tipo_vinculo_laboral.count({ where: { id_tipo_vinculo_laboral: idTipoVinculo, estado_tipo_vinculo_laboral: 'activo' } })) {
          throw new ErrorAplicacion(404, 'Tipo de vínculo laboral activo no encontrado');
        }
        const estado = fechaTermino ? 'terminada' : 'vigente';
        await this.validarPeriodosCerradosParaIntervalos(tx, [{ inicio: fechaInicio, termino: fechaTermino }]);
        await tx.relacion_laboral_empleado.create({ data: { id_empleado: idEmpleado, fecha_inicio: fechaInicio, fecha_termino: fechaTermino, estado, id_tipo_vinculo_laboral: idTipoVinculo, jornada } });
        if (estado === 'vigente') await tx.empleado.update({ where: { id_empleado: idEmpleado }, data: { estado_laboral: 'activo' } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarRelacionesLaborales(idEmpleado);
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002', 'P2034'].includes(error.code)) {
        throw new ErrorAplicacion(409, 'El empleado ya tiene una relación laboral vigente o cambió concurrentemente');
      }
      throw error;
    }
  }

  async actualizarRelacionLaboral(idEmpleado: number, idRelacion: number, entrada: Record<string, unknown>) {
    try {
      await prisma.$transaction(async (tx) => {
        const relacion = await tx.relacion_laboral_empleado.findFirst({ where: { id_relacion_laboral_empleado: idRelacion, id_empleado: idEmpleado } });
        if (!relacion) throw new ErrorAplicacion(404, 'Relación laboral no encontrada');
        const fechaInicio = entrada.fechaInicio === undefined ? relacion.fecha_inicio : fechaEntrada(entrada.fechaInicio, 'Fecha de inicio')!;
        const fechaTermino = entrada.fechaTermino === undefined ? relacion.fecha_termino : fechaEntrada(entrada.fechaTermino, 'Fecha de término');
        if (fechaTermino && fechaTermino < fechaInicio) throw new ErrorAplicacion(400, 'La fecha de término no puede ser anterior al inicio');
        if (relacion.estado === 'terminada' && entrada.fechaTermino === null) throw new ErrorAplicacion(409, 'Una relación terminada no se reactiva; registra un nuevo período');
        const idTipoVinculo = entrada.idTipoVinculo === undefined ? relacion.id_tipo_vinculo_laboral : entrada.idTipoVinculo === '' || entrada.idTipoVinculo === null ? null : identificador(entrada.idTipoVinculo);
        if (idTipoVinculo && !await tx.tipo_vinculo_laboral.count({ where: { id_tipo_vinculo_laboral: idTipoVinculo, estado_tipo_vinculo_laboral: 'activo' } })) {
          throw new ErrorAplicacion(404, 'Tipo de vínculo laboral activo no encontrado');
        }
        const jornada = entrada.jornada === undefined ? relacion.jornada : texto(entrada.jornada, 80) || null;
        const estado = fechaTermino ? 'terminada' : relacion.estado;
        if (entrada.fechaInicio !== undefined || entrada.fechaTermino !== undefined) {
          await this.validarPeriodosCerradosParaIntervalos(tx, [
            { inicio: relacion.fecha_inicio, termino: relacion.fecha_termino },
            { inicio: fechaInicio, termino: fechaTermino },
          ]);
        }
        await tx.relacion_laboral_empleado.update({ where: { id_relacion_laboral_empleado: idRelacion }, data: { fecha_inicio: fechaInicio, fecha_termino: fechaTermino, estado, id_tipo_vinculo_laboral: idTipoVinculo, jornada } });
        if (estado === 'terminada') {
          const vigentes = await tx.relacion_laboral_empleado.count({ where: { id_empleado: idEmpleado, estado: 'vigente', fecha_termino: null } });
          if (!vigentes) await tx.empleado.update({ where: { id_empleado: idEmpleado }, data: { estado_laboral: 'desvinculado' } });
        }
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarRelacionesLaborales(idEmpleado);
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') throw new ErrorAplicacion(409, 'La relación laboral cambió concurrentemente');
      throw error;
    }
  }

  async catalogosRemuneracionales() {
    const [cargos, afps, institucionesSalud] = await Promise.all([
      prisma.cargo.findMany({ where: { estado_cargo: 'activo' }, orderBy: { nombre_cargo: 'asc' }, select: { id_cargo: true, nombre_cargo: true } }),
      prisma.afp.findMany({ where: { estado_afp: 'activo' }, orderBy: { nombre_afp: 'asc' }, select: { id_afp: true, nombre_afp: true } }),
      prisma.prevision_salud.findMany({ where: { estado_prevision_salud: 'activo' }, orderBy: { nombre_prevision_salud: 'asc' }, select: { id_prevision_salud: true, nombre_prevision_salud: true, tipo_prevision_salud: true } }),
    ]);
    return {
      cargos: cargos.map((cargo) => ({ id: cargo.id_cargo, nombre: cargo.nombre_cargo })),
      afps: afps.map((afp) => ({ id: afp.id_afp, nombre: afp.nombre_afp })),
      institucionesSalud: institucionesSalud.map((salud) => ({ id: salud.id_prevision_salud, nombre: salud.nombre_prevision_salud, tipo: salud.tipo_prevision_salud })),
    };
  }

  async obtenerPerfilRemuneracional(idEmpleado: number) {
    const empleado = await prisma.empleado.findUnique({
      where: { id_empleado: idEmpleado },
      select: {
        id_empleado: true,
        id_cargo: true,
        sueldo_base: true,
        fecha_aplicacion_sueldo_base: true,
        id_afp: true,
        id_prevision_salud: true,
        seguro_cesantia: true,
        seguro_cesantia_fundamento_exclusion: true,
        correo_particular: true,
        telefono_particular: true,
        direccion_particular: true,
        tipo_correo: true,
        consentimiento_electronico: true,
        canal_documental: true,
        cargo: { select: { nombre_cargo: true } },
        afp: { select: { nombre_afp: true } },
        prevision_salud: { select: { nombre_prevision_salud: true, tipo_prevision_salud: true } },
        cotizaciones_salud_m6: { where: { activa: true }, orderBy: { vigencia_desde: 'desc' }, take: 1 },
      },
    });
    if (!empleado) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    return {
      idEmpleado: empleado.id_empleado,
      idCargo: empleado.id_cargo,
      cargo: empleado.cargo?.nombre_cargo || null,
      sueldoBaseActual: empleado.sueldo_base === null ? null : Number(empleado.sueldo_base),
      fechaAplicacionSueldoBase: empleado.fecha_aplicacion_sueldo_base,
      idAfp: empleado.id_afp,
      afp: empleado.afp?.nombre_afp || null,
      idInstitucionSalud: empleado.id_prevision_salud,
      institucionSalud: empleado.prevision_salud?.nombre_prevision_salud || null,
      tipoInstitucionSalud: empleado.prevision_salud?.tipo_prevision_salud || null,
      seguroCesantia: empleado.seguro_cesantia,
      fundamentoExclusionCesantia: empleado.seguro_cesantia_fundamento_exclusion,
      cotizacionSalud: empleado.cotizaciones_salud_m6[0] ? { valor: Number(empleado.cotizaciones_salud_m6[0].valor), unidad: empleado.cotizaciones_salud_m6[0].unidad, vigenciaDesde: empleado.cotizaciones_salud_m6[0].vigencia_desde, vigenciaHasta: empleado.cotizaciones_salud_m6[0].vigencia_hasta } : null,
      correoParticular: empleado.correo_particular,
      telefonoParticular: empleado.telefono_particular,
      direccionParticular: empleado.direccion_particular,
      tipoCorreo: empleado.tipo_correo,
      consentimientoElectronico: empleado.consentimiento_electronico,
      canalDocumental: empleado.canal_documental,
    };
  }

  async actualizarPerfilRemuneracional(idEmpleado: number, entrada: Record<string, unknown>) {
    const data: Prisma.empleadoUncheckedUpdateInput = {};
    const idOpcional = (valor: unknown) => valor === undefined ? undefined : valor === null || valor === '' ? null : identificador(valor);
    const idCargo = idOpcional(entrada.idCargo);
    const idAfp = idOpcional(entrada.idAfp);
    const idSalud = idOpcional(entrada.idInstitucionSalud);
    if (idCargo !== undefined) data.id_cargo = idCargo;
    if (idAfp !== undefined) data.id_afp = idAfp;
    if (idSalud !== undefined) data.id_prevision_salud = idSalud;
    if (entrada.sueldoBaseActual !== undefined) data.sueldo_base = entrada.sueldoBaseActual === null || entrada.sueldoBaseActual === '' ? null : numeroNoNegativo(entrada.sueldoBaseActual, 'Sueldo base');
    if (entrada.fechaAplicacionSueldoBase !== undefined) data.fecha_aplicacion_sueldo_base = fechaEntrada(entrada.fechaAplicacionSueldoBase, 'Fecha de aplicación del sueldo base', false);
    if (entrada.seguroCesantia !== undefined) {
      if (typeof entrada.seguroCesantia !== 'boolean') throw new ErrorAplicacion(400, 'Seguro de cesantía inválido');
      data.seguro_cesantia = entrada.seguroCesantia;
    }
    if (entrada.fundamentoExclusionCesantia !== undefined) data.seguro_cesantia_fundamento_exclusion = texto(entrada.fundamentoExclusionCesantia, 1000) || null;
    if (entrada.correoParticular !== undefined) {
      const correo = texto(entrada.correoParticular, 254) || null;
      if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) throw new ErrorAplicacion(400, 'Correo particular inválido');
      data.correo_particular = correo;
    }
    if (entrada.telefonoParticular !== undefined) data.telefono_particular = texto(entrada.telefonoParticular, 30) || null;
    if (entrada.direccionParticular !== undefined) data.direccion_particular = texto(entrada.direccionParticular, 500) || null;
    if (entrada.tipoCorreo !== undefined) data.tipo_correo = texto(entrada.tipoCorreo, 30) || null;
    if (entrada.consentimientoElectronico !== undefined) {
      if (entrada.consentimientoElectronico !== null && typeof entrada.consentimientoElectronico !== 'boolean') throw new ErrorAplicacion(400, 'Consentimiento electrónico inválido');
      data.consentimiento_electronico = entrada.consentimientoElectronico as boolean | null;
    }
    if (entrada.canalDocumental !== undefined) data.canal_documental = texto(entrada.canalDocumental, 30) || null;

    try {
      await prisma.$transaction(async (tx) => {
        const empleadoActual = await tx.empleado.findUnique({ where: { id_empleado: idEmpleado }, select: { id_prevision_salud: true } });
        if (!empleadoActual) throw new ErrorAplicacion(404, 'Empleado no encontrado');
        if (typeof idCargo === 'number' && !await tx.cargo.count({ where: { id_cargo: idCargo, estado_cargo: 'activo' } })) throw new ErrorAplicacion(404, 'Cargo activo no encontrado');
        if (typeof idAfp === 'number' && !await tx.afp.count({ where: { id_afp: idAfp, estado_afp: 'activo' } })) throw new ErrorAplicacion(404, 'AFP activa no encontrada');
        const idSaludEfectivo = idSalud === undefined ? empleadoActual.id_prevision_salud : idSalud;
        const institucionSalud = typeof idSaludEfectivo === 'number'
          ? await tx.prevision_salud.findFirst({ where: { id_prevision_salud: idSaludEfectivo, estado_prevision_salud: 'activo' }, select: { tipo_prevision_salud: true } })
          : null;
        if (typeof idSalud === 'number' && !institucionSalud) throw new ErrorAplicacion(404, 'Institución de salud activa no encontrada');
        if (data.seguro_cesantia === false && !String(data.seguro_cesantia_fundamento_exclusion || '').trim()) throw new ErrorAplicacion(400, 'La exclusión del Seguro de Cesantía requiere fundamento');
        if (data.seguro_cesantia === true) data.seguro_cesantia_fundamento_exclusion = null;
        await tx.empleado.update({ where: { id_empleado: idEmpleado }, data });
        const configuraSalud = [entrada.cotizacionSaludValor, entrada.cotizacionSaludUnidad, entrada.cotizacionSaludVigenciaDesde].some(valor => valor !== undefined);
        const esIsapre = String(institucionSalud?.tipo_prevision_salud || '').toUpperCase() === 'ISAPRE';
        if (!esIsapre) {
          if (configuraSalud && [entrada.cotizacionSaludValor, entrada.cotizacionSaludUnidad, entrada.cotizacionSaludVigenciaDesde].some(valor => valor !== undefined && valor !== null && valor !== '')) {
            throw new ErrorAplicacion(400, 'La cotización pactada sólo corresponde a una Isapre');
          }
          await tx.cotizacion_salud_empleado.updateMany({ where: { id_empleado: idEmpleado, activa: true }, data: { activa: false } });
        }
        if (configuraSalud && esIsapre) {
          const valor = decimalMonetario(entrada.cotizacionSaludValor, 'Cotización de salud', true);
          const unidad = texto(entrada.cotizacionSaludUnidad, 20).toUpperCase();
          const vigenciaDesde = fechaEntrada(entrada.cotizacionSaludVigenciaDesde, 'Vigencia de cotización de salud')!;
          if (!['PORCENTAJE', 'UF', 'CLP'].includes(unidad)) throw new ErrorAplicacion(400, 'Unidad de cotización de salud inválida');
          if (unidad === 'PORCENTAJE' && valor.gt(1)) throw new ErrorAplicacion(400, 'El porcentaje debe informarse como factor decimal');
          const anterior = await tx.cotizacion_salud_empleado.findFirst({ where: { id_empleado: idEmpleado, activa: true, vigencia_desde: { lt: vigenciaDesde }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: vigenciaDesde } }] }, orderBy: { vigencia_desde: 'desc' } });
          if (anterior) await tx.cotizacion_salud_empleado.update({ where: { id_cotizacion_salud: anterior.id_cotizacion_salud }, data: { vigencia_hasta: new Date(vigenciaDesde.getTime() - 86400000) } });
          await tx.cotizacion_salud_empleado.upsert({ where: { id_empleado_vigencia_desde: { id_empleado: idEmpleado, vigencia_desde: vigenciaDesde } }, create: { id_empleado: idEmpleado, valor, unidad, vigencia_desde: vigenciaDesde }, update: { valor, unidad, activa: true } });
        }
      });
      return this.obtenerPerfilRemuneracional(idEmpleado);
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') throw new ErrorAplicacion(409, 'El catálogo seleccionado ya no está disponible');
      throw error;
    }
  }

  private intervalo(entrada: Record<string, unknown>) {
    const desde = fechaEntrada(entrada.vigenciaDesde, 'Vigencia desde')!;
    const hasta = fechaEntrada(entrada.vigenciaHasta, 'Vigencia hasta', false);
    if (hasta && hasta < desde) throw new ErrorAplicacion(400, 'La vigencia hasta no puede ser anterior a la vigencia desde');
    return { desde, hasta };
  }

  private conflictoConcurrente(error: unknown, mensaje: string): never {
    if (error instanceof ErrorAplicacion) throw error;
    if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002', 'P2034'].includes(error.code)) throw new ErrorAplicacion(409, mensaje);
    throw error;
  }

  async catalogosAsignacionEsquemas() {
    const esquemas = await prisma.esquema_remuneracional.findMany({
      where: { estado: 'activo' }, orderBy: [{ nombre: 'asc' }],
      select: { id_esquema_remuneracional: true, codigo: true, nombre: true, vigencia_desde: true, vigencia_hasta: true },
    });
    return esquemas.map((item) => ({ id: item.id_esquema_remuneracional, codigo: item.codigo, nombre: item.nombre, vigenciaDesde: item.vigencia_desde, vigenciaHasta: item.vigencia_hasta }));
  }

  async listarAsignacionesEsquemaEmpleado(idEmpleado: number) {
    if (!await prisma.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    const filas = await prisma.asignacion_esquema_remuneracional.findMany({
      where: { id_empleado: idEmpleado }, include: { esquema: true }, orderBy: [{ vigencia_desde: 'desc' }, { id_asignacion_esquema: 'desc' }],
    });
    return filas.map((fila) => ({ id: fila.id_asignacion_esquema, idEsquema: fila.id_esquema, esquema: fila.esquema.nombre, origen: 'INDIVIDUAL', vigenciaDesde: fila.vigencia_desde, vigenciaHasta: fila.vigencia_hasta, activa: fila.activa }));
  }

  async asignarEsquemaEmpleado(idEmpleado: number, entrada: Record<string, unknown>) {
    const idEsquema = identificador(entrada.idEsquema);
    const { desde, hasta } = this.intervalo(entrada);
    try {
      await prisma.$transaction(async (tx) => {
        if (!await tx.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
        const esquema = await tx.esquema_remuneracional.findFirst({ where: { id_esquema_remuneracional: idEsquema, estado: 'activo' } });
        if (!esquema) throw new ErrorAplicacion(404, 'Esquema activo no encontrado');
        if (desde < esquema.vigencia_desde || esquema.vigencia_hasta && (!hasta || hasta > esquema.vigencia_hasta)) throw new ErrorAplicacion(400, 'La asignación debe quedar dentro de la vigencia del esquema');
        const conflicto = await tx.asignacion_esquema_remuneracional.count({ where: {
          id_empleado: idEmpleado, id_esquema: idEsquema,
          vigencia_desde: hasta ? { lte: hasta } : undefined,
          OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }],
        } });
        if (conflicto) throw new ErrorAplicacion(409, 'La asignación se superpone con otra vigencia del mismo esquema');
        await tx.asignacion_esquema_remuneracional.create({ data: { id_empleado: idEmpleado, id_esquema: idEsquema, vigencia_desde: desde, vigencia_hasta: hasta } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarAsignacionesEsquemaEmpleado(idEmpleado);
    } catch (error) { this.conflictoConcurrente(error, 'La asignación de esquema cambió concurrentemente'); }
  }

  async finalizarAsignacionEsquemaEmpleado(idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown>) {
    const hasta = fechaEntrada(entrada.vigenciaHasta, 'Vigencia hasta')!;
    try {
      await prisma.$transaction(async (tx) => {
        const actual = await tx.asignacion_esquema_remuneracional.findFirst({ where: { id_asignacion_esquema: idAsignacion, id_empleado: idEmpleado } });
        if (!actual) throw new ErrorAplicacion(404, 'Asignación de esquema no encontrada');
        if (!actual.activa) throw new ErrorAplicacion(409, 'La asignación de esquema ya fue finalizada');
        if (hasta < actual.vigencia_desde) throw new ErrorAplicacion(400, 'La fecha de término no puede ser anterior al inicio');
        const actualizada = await tx.asignacion_esquema_remuneracional.updateMany({ where: { id_asignacion_esquema: idAsignacion, id_empleado: idEmpleado, activa: true }, data: { vigencia_hasta: hasta, activa: false } });
        if (actualizada.count !== 1) throw new ErrorAplicacion(409, 'La asignación de esquema fue finalizada o modificada concurrentemente');
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarAsignacionesEsquemaEmpleado(idEmpleado);
    } catch (error) { this.conflictoConcurrente(error, 'La asignación de esquema fue finalizada o modificada concurrentemente'); }
  }

  async catalogoHaberes() {
    const filas = await prisma.concepto_remuneracion.findMany({ where: { naturaleza_concepto: 'haber', estado_concepto: 'activo' }, orderBy: { nombre_concepto: 'asc' } });
    return filas.map((fila) => ({ id: fila.id_concepto_remuneracion, codigo: fila.codigo_m6, nombre: fila.nombre_concepto }));
  }

  async listarAsignacionesHaberEmpleado(idEmpleado: number) {
    if (!await prisma.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    const filas = await prisma.asignacion_concepto_remuneracion_empleado.findMany({ where: { id_empleado: idEmpleado }, include: { concepto: true }, orderBy: { vigencia_desde: 'desc' } });
    return filas.map((fila) => ({ id: fila.id_asignacion_concepto, idConcepto: fila.id_concepto, concepto: fila.concepto.nombre_concepto, vigenciaDesde: fila.vigencia_desde, vigenciaHasta: fila.vigencia_hasta, valorAplicable: fila.valor_aplicable === null ? null : Number(fila.valor_aplicable), activa: fila.activa }));
  }

  async asignarHaberEmpleado(idEmpleado: number, entrada: Record<string, unknown>) {
    const idConcepto = identificador(entrada.idConcepto);
    const { desde, hasta } = this.intervalo(entrada);
    const valor = entrada.valorAplicable === undefined || entrada.valorAplicable === '' || entrada.valorAplicable === null ? null : numeroNoNegativo(entrada.valorAplicable, 'Valor aplicable');
    try {
      await prisma.$transaction(async (tx) => {
        if (!await tx.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
        const concepto = await tx.concepto_remuneracion.findUnique({ where: { id_concepto_remuneracion: idConcepto } });
        if (!concepto || concepto.estado_concepto !== 'activo') throw new ErrorAplicacion(404, 'Concepto activo no encontrado');
        if (concepto.naturaleza_concepto !== 'haber') throw new ErrorAplicacion(400, 'CU160 sólo permite conceptos HABER');
        const conflicto = await tx.asignacion_concepto_remuneracion_empleado.count({ where: { id_empleado: idEmpleado, id_concepto: idConcepto, vigencia_desde: hasta ? { lte: hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } });
        if (conflicto) throw new ErrorAplicacion(409, 'La asignación del haber se superpone con otra vigencia');
        await tx.asignacion_concepto_remuneracion_empleado.create({ data: { id_empleado: idEmpleado, id_concepto: idConcepto, vigencia_desde: desde, vigencia_hasta: hasta, valor_aplicable: valor } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarAsignacionesHaberEmpleado(idEmpleado);
    } catch (error) { this.conflictoConcurrente(error, 'La asignación del haber cambió concurrentemente'); }
  }

  async finalizarAsignacionHaberEmpleado(idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown>) {
    const hasta = fechaEntrada(entrada.vigenciaHasta, 'Vigencia hasta')!;
    try {
      await prisma.$transaction(async (tx) => {
        const actual = await tx.asignacion_concepto_remuneracion_empleado.findFirst({ where: { id_asignacion_concepto: idAsignacion, id_empleado: idEmpleado, concepto: { naturaleza_concepto: 'haber' } } });
        if (!actual) throw new ErrorAplicacion(404, 'Asignación de haber no encontrada');
        if (!actual.activa) throw new ErrorAplicacion(409, 'La asignación de haber ya fue finalizada');
        if (hasta < actual.vigencia_desde) throw new ErrorAplicacion(400, 'La fecha de término no puede ser anterior al inicio');
        const actualizada = await tx.asignacion_concepto_remuneracion_empleado.updateMany({ where: { id_asignacion_concepto: idAsignacion, id_empleado: idEmpleado, activa: true }, data: { vigencia_hasta: hasta, activa: false } });
        if (actualizada.count !== 1) throw new ErrorAplicacion(409, 'La asignación de haber fue finalizada o modificada concurrentemente');
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarAsignacionesHaberEmpleado(idEmpleado);
    } catch (error) { this.conflictoConcurrente(error, 'La asignación de haber fue finalizada o modificada concurrentemente'); }
  }

  private async configuracionDocumental(tx: Prisma.TransactionClient | typeof prisma, idEmpleado: number) {
    const empleado = await tx.empleado.findUnique({ where: { id_empleado: idEmpleado }, include: { cuenta_m4: { select: { usuario_correo: true } }, usuario: { select: { usuario_correo: true } } } });
    if (!empleado) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    const correoCorporativo = empleado.cuenta_m4?.usuario_correo || empleado.usuario.find((item) => item.usuario_correo)?.usuario_correo || null;
    return { consentimientoElectronico: empleado.consentimiento_electronico, canalDocumental: empleado.canal_documental, correoParticular: empleado.correo_particular, correoCorporativo, canalesDisponibles: [...(empleado.correo_particular ? ['correo_particular'] : []), ...(correoCorporativo ? ['correo_corporativo'] : [])] };
  }

  async obtenerConfiguracionDocumental(idEmpleado: number) { return this.configuracionDocumental(prisma, idEmpleado); }

  async actualizarConfiguracionDocumental(idEmpleado: number, entrada: Record<string, unknown>) {
    const actual = await this.obtenerConfiguracionDocumental(idEmpleado);
    if (typeof entrada.consentimientoElectronico !== 'boolean') throw new ErrorAplicacion(400, 'El consentimiento debe indicarse explícitamente');
    const canalEntrada = texto(entrada.canalDocumental, 30).toLowerCase();
    if (canalEntrada && !['correo_particular', 'correo_corporativo'].includes(canalEntrada)) throw new ErrorAplicacion(400, 'Canal documental inválido');
    const canal = entrada.consentimientoElectronico === true ? canalEntrada : null;
    if (entrada.consentimientoElectronico === true && !canal) throw new ErrorAplicacion(400, 'Selecciona un canal electrónico disponible');
    if (canal === 'correo_particular' && !actual.correoParticular) throw new ErrorAplicacion(409, 'El empleado no tiene correo particular');
    if (canal === 'correo_corporativo' && !actual.correoCorporativo) throw new ErrorAplicacion(409, 'El empleado no tiene correo corporativo');
    await prisma.empleado.update({ where: { id_empleado: idEmpleado }, data: { consentimiento_electronico: entrada.consentimientoElectronico, canal_documental: canal, tipo_correo: canal === 'correo_particular' ? 'particular' : canal === 'correo_corporativo' ? 'corporativo' : null } });
    return this.obtenerConfiguracionDocumental(idEmpleado);
  }

  async listarEsquemas() {
    const filas = await prisma.esquema_remuneracional.findMany({ include: { asignaciones: { where: { id_cargo: { not: null } }, include: { cargo: true } } }, orderBy: { nombre: 'asc' } });
    return filas.map((fila) => ({ id: fila.id_esquema_remuneracional, codigo: fila.codigo, nombre: fila.nombre, descripcion: fila.descripcion, estado: fila.estado, vigenciaDesde: fila.vigencia_desde, vigenciaHasta: fila.vigencia_hasta, cargos: fila.asignaciones.map((item) => ({ idAsignacion: item.id_asignacion_esquema, idCargo: item.id_cargo, cargo: item.cargo?.nombre_cargo, vigenciaDesde: item.vigencia_desde, vigenciaHasta: item.vigencia_hasta, activa: item.activa })) }));
  }

  async catalogoCargosEsquemas() {
    const cargos = await prisma.cargo.findMany({ where: { estado_cargo: 'activo' }, orderBy: { nombre_cargo: 'asc' } });
    return cargos.map((cargo) => ({ id: cargo.id_cargo, nombre: cargo.nombre_cargo }));
  }

  async crearEsquema(entrada: Record<string, unknown>) {
    const codigo = texto(entrada.codigo, 40).toUpperCase(); const nombre = texto(entrada.nombre, 120); const descripcion = texto(entrada.descripcion, 500) || null; const { desde, hasta } = this.intervalo(entrada);
    if (!codigo || !nombre) throw new ErrorAplicacion(400, 'Código y nombre son obligatorios');
    try { await prisma.esquema_remuneracional.create({ data: { codigo, nombre, descripcion, vigencia_desde: desde, vigencia_hasta: hasta } }); return this.listarEsquemas(); }
    catch (error) { this.conflictoConcurrente(error, 'Ya existe un esquema con ese código o nombre'); }
  }

  async actualizarEsquema(idEsquema: number, entrada: Record<string, unknown>) {
    const actual = await prisma.esquema_remuneracional.findUnique({ where: { id_esquema_remuneracional: idEsquema } });
    if (!actual) throw new ErrorAplicacion(404, 'Esquema no encontrado');
    const data: Prisma.esquema_remuneracionalUpdateInput = {};
    if (entrada.nombre !== undefined) { const nombre = texto(entrada.nombre, 120); if (!nombre) throw new ErrorAplicacion(400, 'Nombre obligatorio'); data.nombre = nombre; }
    if (entrada.descripcion !== undefined) data.descripcion = texto(entrada.descripcion, 500) || null;
    if (entrada.estado !== undefined) { const estado = texto(entrada.estado, 20).toLowerCase(); if (!['activo', 'inactivo'].includes(estado)) throw new ErrorAplicacion(400, 'Estado inválido'); data.estado = estado; }
    if (entrada.vigenciaDesde !== undefined) data.vigencia_desde = fechaEntrada(entrada.vigenciaDesde, 'Vigencia desde')!;
    if (entrada.vigenciaHasta !== undefined) data.vigencia_hasta = fechaEntrada(entrada.vigenciaHasta, 'Vigencia hasta', false);
    const desde = data.vigencia_desde instanceof Date ? data.vigencia_desde : actual.vigencia_desde;
    const hasta = data.vigencia_hasta === undefined ? actual.vigencia_hasta : data.vigencia_hasta instanceof Date ? data.vigencia_hasta : null;
    if (hasta && hasta < desde) throw new ErrorAplicacion(400, 'La vigencia hasta no puede ser anterior a la vigencia desde');
    try { await prisma.esquema_remuneracional.update({ where: { id_esquema_remuneracional: idEsquema }, data }); return this.listarEsquemas(); }
    catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') throw new ErrorAplicacion(404, 'Esquema no encontrado'); this.conflictoConcurrente(error, 'El esquema ya existe'); }
  }

  async asignarEsquemaCargo(idEsquema: number, entrada: Record<string, unknown>) {
    const idCargo = identificador(entrada.idCargo); const { desde, hasta } = this.intervalo(entrada);
    try {
      await prisma.$transaction(async (tx) => {
        const esquema = await tx.esquema_remuneracional.findUnique({ where: { id_esquema_remuneracional: idEsquema } });
        if (!esquema) throw new ErrorAplicacion(404, 'Esquema no encontrado');
        if (desde < esquema.vigencia_desde || esquema.vigencia_hasta && (!hasta || hasta > esquema.vigencia_hasta)) throw new ErrorAplicacion(400, 'El default debe quedar dentro de la vigencia del esquema');
        if (!await tx.cargo.count({ where: { id_cargo: idCargo, estado_cargo: 'activo' } })) throw new ErrorAplicacion(404, 'Cargo activo no encontrado');
        const conflicto = await tx.asignacion_esquema_remuneracional.count({ where: { id_cargo: idCargo, id_esquema: idEsquema, activa: true, vigencia_desde: hasta ? { lte: hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } });
        if (conflicto) throw new ErrorAplicacion(409, 'El default por cargo se superpone con otra vigencia del mismo esquema');
        await tx.asignacion_esquema_remuneracional.create({ data: { id_cargo: idCargo, id_esquema: idEsquema, vigencia_desde: desde, vigencia_hasta: hasta } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); return this.listarEsquemas();
    } catch (error) { this.conflictoConcurrente(error, 'La asignación por cargo cambió concurrentemente'); }
  }

  async listarTarifasEsquema(idEsquema: number, fecha?: unknown) {
    if (!await prisma.esquema_remuneracional.count({ where: { id_esquema_remuneracional: idEsquema } })) throw new ErrorAplicacion(404, 'Esquema no encontrado');
    const efectiva = fecha ? fechaEntrada(fecha, 'Fecha')! : null;
    const filas = await prisma.tarifa_esquema_remuneracional.findMany({ where: { id_esquema: idEsquema, estado_revision: efectiva ? 'activa' : undefined, vigencia_desde: efectiva ? { lte: efectiva } : undefined, OR: efectiva ? [{ vigencia_hasta: null }, { vigencia_hasta: { gte: efectiva } }] : undefined }, orderBy: [{ es_excepcion: 'desc' }, { vigencia_desde: 'desc' }] });
    const presentadas = filas.map((fila) => ({ id: fila.id_tarifa_esquema, modalidad: fila.modalidad, valor: fila.valor === null ? null : Number(fila.valor), reglaTipo: fila.regla_tipo, referencia: fila.referencia, unidad: fila.unidad, tipoAplicacion: fila.tipo_aplicacion, vigenciaDesde: fila.vigencia_desde, vigenciaHasta: fila.vigencia_hasta, esExcepcion: fila.es_excepcion, estadoRevision: fila.estado_revision, causaBloqueo: fila.causa_bloqueo }));
    return efectiva ? presentadas.slice(0, 1) : presentadas;
  }

  async crearTarifaEsquema(idEsquema: number, entrada: Record<string, unknown>) {
    const modalidad = texto(entrada.modalidad, 20).toUpperCase(); if (!['FIJO', 'PORCENTAJE', 'REGLA'].includes(modalidad)) throw new ErrorAplicacion(400, 'Modalidad inválida');
    const valor = entrada.valor === undefined || entrada.valor === null || entrada.valor === '' ? null : numeroNoNegativo(entrada.valor, 'Valor');
    const reglaTipo = texto(entrada.reglaTipo, 40).toUpperCase() || null; const referencia = texto(entrada.referencia, 120) || null; const unidad = normalizarUnidad(entrada.unidad); const tipoAplicacion = texto(entrada.tipoAplicacion, 20).toLowerCase() || null; const esExcepcion = entrada.esExcepcion === true; const { desde, hasta } = this.intervalo(entrada);
    if (tipoAplicacion && !['global', 'por_unidad'].includes(tipoAplicacion)) throw new ErrorAplicacion(400, 'Tipo de aplicación de tarifa inválido');
    if (tipoAplicacion === 'global' && unidad) throw new ErrorAplicacion(400, 'Una tarifa global no utiliza unidad');
    if (tipoAplicacion === 'por_unidad' && !unidad) throw new ErrorAplicacion(400, 'Una tarifa por unidad requiere unidad');
    try {
      await prisma.$transaction(async (tx) => {
        if (!await tx.esquema_remuneracional.count({ where: { id_esquema_remuneracional: idEsquema } })) throw new ErrorAplicacion(404, 'Esquema no encontrado');
        const conflicto = await tx.tarifa_esquema_remuneracional.count({ where: { id_esquema: idEsquema, es_excepcion: esExcepcion, vigencia_desde: hasta ? { lte: hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } });
        if (conflicto) throw new ErrorAplicacion(409, 'La configuración se superpone con otra vigencia equivalente');
        await tx.tarifa_esquema_remuneracional.create({ data: { id_esquema: idEsquema, modalidad, valor, regla_tipo: reglaTipo, referencia, unidad, tipo_aplicacion: tipoAplicacion, vigencia_desde: desde, vigencia_hasta: hasta, es_excepcion: esExcepcion } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); return this.listarTarifasEsquema(idEsquema);
    } catch (error) { this.conflictoConcurrente(error, 'La tarifa cambió concurrentemente'); }
  }

  async revisarTarifaEsquema(idEsquema: number, idTarifa: number) {
    const tarifa = await prisma.tarifa_esquema_remuneracional.findFirst({ where: { id_tarifa_esquema: idTarifa, id_esquema: idEsquema } });
    if (!tarifa) throw new ErrorAplicacion(404, 'Tarifa no encontrada');
    let causa: string | null = null;
    if (['FIJO', 'PORCENTAJE'].includes(tarifa.modalidad) && tarifa.valor === null) causa = 'La modalidad requiere un valor';
    if (tarifa.modalidad === 'REGLA' && (!tarifa.regla_tipo || !tarifa.referencia)) causa = 'La regla requiere tipo y referencia controlada';
    await prisma.tarifa_esquema_remuneracional.update({ where: { id_tarifa_esquema: idTarifa }, data: { estado_revision: causa ? 'bloqueada' : 'activa', causa_bloqueo: causa } });
    return this.listarTarifasEsquema(idEsquema);
  }

  async listarHaberes() {
    const conceptos = await prisma.concepto_remuneracion.findMany({ where: { naturaleza_concepto: 'haber' }, include: { configuraciones_m6: { orderBy: { vigencia_desde: 'desc' } } }, orderBy: { nombre_concepto: 'asc' } });
    return conceptos.map((item) => ({ id: item.id_concepto_remuneracion, codigo: item.codigo_m6, nombre: item.nombre_concepto, descripcion: item.descripcion_concepto, estado: item.estado_concepto, configuraciones: item.configuraciones_m6.map((config) => ({ id: config.id_configuracion_concepto, modalidad: config.modalidad, valor: config.valor === null ? null : Number(config.valor), reglaTipo: config.regla_tipo, vigenciaDesde: config.vigencia_desde, vigenciaHasta: config.vigencia_hasta, esExcepcion: config.es_excepcion, activa: config.activa })) }));
  }

  async crearHaber(entrada: Record<string, unknown>) {
    const codigo = texto(entrada.codigo, 40).toUpperCase(); const nombre = texto(entrada.nombre, 100); const descripcion = texto(entrada.descripcion, 500) || null; const modalidad = texto(entrada.modalidad, 20).toUpperCase();
    if (!codigo || !nombre || !['FIJO', 'PORCENTAJE', 'REGLA'].includes(modalidad)) throw new ErrorAplicacion(400, 'Código, nombre y modalidad HABER válidos son obligatorios');
    const valor = entrada.valor === undefined || entrada.valor === null || entrada.valor === '' ? null : numeroNoNegativo(entrada.valor, 'Valor'); const reglaTipo = texto(entrada.reglaTipo, 40).toUpperCase() || null; const { desde, hasta } = this.intervalo(entrada);
    if (['FIJO', 'PORCENTAJE'].includes(modalidad) && valor === null) throw new ErrorAplicacion(400, 'La modalidad requiere valor');
    if (modalidad === 'REGLA' && !reglaTipo) throw new ErrorAplicacion(400, 'La modalidad REGLA requiere metadata controlada');
    try {
      await prisma.$transaction(async (tx) => { const concepto = await tx.concepto_remuneracion.create({ data: { codigo_m6: codigo, nombre_concepto: nombre, descripcion_concepto: descripcion, naturaleza_concepto: 'haber' } }); await tx.configuracion_concepto_remuneracion.create({ data: { id_concepto: concepto.id_concepto_remuneracion, modalidad, valor, regla_tipo: reglaTipo, vigencia_desde: desde, vigencia_hasta: hasta } }); });
      return this.listarHaberes();
    } catch (error) { this.conflictoConcurrente(error, 'Ya existe un concepto con ese código o nombre'); }
  }

  async actualizarHaber(idConcepto: number, entrada: Record<string, unknown>) {
    const actual = await prisma.concepto_remuneracion.findUnique({ where: { id_concepto_remuneracion: idConcepto } });
    if (!actual || actual.naturaleza_concepto !== 'haber') throw new ErrorAplicacion(404, 'HABER no encontrado');
    const data: Prisma.concepto_remuneracionUpdateInput = {};
    if (entrada.nombre !== undefined) { const nombre = texto(entrada.nombre, 100); if (!nombre) throw new ErrorAplicacion(400, 'Nombre obligatorio'); data.nombre_concepto = nombre; }
    if (entrada.descripcion !== undefined) data.descripcion_concepto = texto(entrada.descripcion, 500) || null;
    if (entrada.estado !== undefined) { const estado = texto(entrada.estado, 20).toLowerCase(); if (!['activo', 'inactivo'].includes(estado)) throw new ErrorAplicacion(400, 'Estado inválido'); data.estado_concepto = estado; }
    await prisma.concepto_remuneracion.update({ where: { id_concepto_remuneracion: idConcepto }, data }); return this.listarHaberes();
  }

  async crearConfiguracionHaber(idConcepto: number, entrada: Record<string, unknown>) {
    const concepto = await prisma.concepto_remuneracion.findUnique({ where: { id_concepto_remuneracion: idConcepto } }); if (!concepto || concepto.naturaleza_concepto !== 'haber') throw new ErrorAplicacion(404, 'HABER no encontrado');
    const modalidad = texto(entrada.modalidad, 20).toUpperCase(); if (!['FIJO', 'PORCENTAJE', 'REGLA'].includes(modalidad)) throw new ErrorAplicacion(400, 'Modalidad inválida');
    const valor = entrada.valor === undefined || entrada.valor === null || entrada.valor === '' ? null : numeroNoNegativo(entrada.valor, 'Valor'); const reglaTipo = texto(entrada.reglaTipo, 40).toUpperCase() || null; const esExcepcion = entrada.esExcepcion === true; const { desde, hasta } = this.intervalo(entrada);
    if (['FIJO', 'PORCENTAJE'].includes(modalidad) && valor === null) throw new ErrorAplicacion(400, 'La modalidad requiere valor'); if (modalidad === 'REGLA' && !reglaTipo) throw new ErrorAplicacion(400, 'REGLA requiere metadata controlada');
    try {
      await prisma.$transaction(async (tx) => { const conflicto = await tx.configuracion_concepto_remuneracion.count({ where: { id_concepto: idConcepto, es_excepcion: esExcepcion, activa: true, vigencia_desde: hasta ? { lte: hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } }); if (conflicto) throw new ErrorAplicacion(409, 'La configuración del HABER se superpone con otra vigencia equivalente'); await tx.configuracion_concepto_remuneracion.create({ data: { id_concepto: idConcepto, modalidad, valor, regla_tipo: reglaTipo, vigencia_desde: desde, vigencia_hasta: hasta, es_excepcion: esExcepcion } }); }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); return this.listarHaberes();
    } catch (error) { this.conflictoConcurrente(error, 'La configuración del HABER cambió concurrentemente'); }
  }

  async resolverConfiguracionHaber(idConcepto: number, fecha: unknown) {
    const dia = fechaEntrada(fecha, 'Fecha')!;
    const configuracion = await prisma.configuracion_concepto_remuneracion.findFirst({ where: { id_concepto: idConcepto, activa: true, vigencia_desde: { lte: dia }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: dia } }] }, orderBy: [{ es_excepcion: 'desc' }, { vigencia_desde: 'desc' }] });
    if (!configuracion) throw new ErrorAplicacion(404, 'No existe configuración HABER aplicable para la fecha');
    return { id: configuracion.id_configuracion_concepto, modalidad: configuracion.modalidad, valor: configuracion.valor === null ? null : Number(configuracion.valor), reglaTipo: configuracion.regla_tipo, vigenciaDesde: configuracion.vigencia_desde, vigenciaHasta: configuracion.vigencia_hasta, esExcepcion: configuracion.es_excepcion };
  }

  private presentarParametro(item: {
    id_parametro_remuneracional: number; codigo: string; tipo: string; nombre: string; descripcion: string | null;
    valor: Prisma.Decimal | null; unidad: string | null; vigencia_desde: Date; vigencia_hasta: Date | null;
    fuente: string | null; referencia: string | null; estado: string;
  }) {
    return { id: item.id_parametro_remuneracional, codigo: item.codigo, tipo: item.tipo, nombre: item.nombre, descripcion: item.descripcion, valor: item.valor === null ? null : Number(item.valor), unidad: item.unidad, vigenciaDesde: item.vigencia_desde, vigenciaHasta: item.vigencia_hasta, fuente: item.fuente, referencia: item.referencia, estado: item.estado };
  }

  async listarParametrosRemuneracionales(tipo?: unknown) {
    const filtro = texto(tipo, 30).toUpperCase();
    const permitidos = ['LEGAL', 'PREVISIONAL', 'TRIBUTARIO'];
    if (filtro && !permitidos.includes(filtro)) throw new ErrorAplicacion(400, 'Tipo de parámetro inválido');
    const filas = await prisma.parametro_remuneracional.findMany({ where: { tipo: filtro || { in: permitidos } }, orderBy: [{ codigo: 'asc' }, { vigencia_desde: 'desc' }] });
    return filas.map((item) => this.presentarParametro(item));
  }

  private async crearParametroTipado(entrada: Record<string, unknown>, tipos: string[]) {
    const codigo = texto(entrada.codigo, 50).toUpperCase();
    const tipoEntrada = texto(entrada.tipo, 30).toUpperCase();
    const tipo = tipos.length === 1 ? tipos[0] : tipoEntrada;
    const nombre = texto(entrada.nombre, 120);
    const descripcion = texto(entrada.descripcion, 1000) || null;
    const valor = decimalOpcional(entrada.valor, 'Valor');
    const unidad = texto(entrada.unidad, 30).toUpperCase() || null;
    const fuente = texto(entrada.fuente, 200) || null;
    const referencia = texto(entrada.referencia, 300) || null;
    const estado = texto(entrada.estado || 'pendiente', 20).toLowerCase();
    const { desde, hasta } = this.intervalo(entrada);
    if (!codigo || !nombre || !tipos.includes(tipo)) throw new ErrorAplicacion(400, 'Código, tipo y nombre válidos son obligatorios');
    if (!['pendiente', 'activo', 'inactivo'].includes(estado)) throw new ErrorAplicacion(400, 'Estado de parámetro inválido');
    if (estado === 'activo' && valor === null && tipo !== 'PRORRATEO') throw new ErrorAplicacion(400, 'Un parámetro activo requiere valor');
    try {
      await prisma.$transaction(async (tx) => {
        const conflicto = await tx.parametro_remuneracional.count({ where: { codigo, estado: { not: 'inactivo' }, vigencia_desde: hasta ? { lte: hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } });
        if (conflicto) throw new ErrorAplicacion(409, 'La vigencia del parámetro se superpone con otra configuración');
        await tx.parametro_remuneracional.create({ data: { codigo, tipo, nombre, descripcion, valor, unidad, vigencia_desde: desde, vigencia_hasta: hasta, fuente, referencia, estado } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return tipo === 'PRORRATEO' ? this.listarConfiguracionProrrateo() : this.listarParametrosRemuneracionales();
    } catch (error) { this.conflictoConcurrente(error, 'El parámetro cambió concurrentemente'); }
  }

  async crearParametroRemuneracional(entrada: Record<string, unknown>) {
    return this.crearParametroTipado(entrada, ['LEGAL', 'PREVISIONAL', 'TRIBUTARIO']);
  }

  async actualizarParametroRemuneracional(id: number, entrada: Record<string, unknown>) {
    const actual = await prisma.parametro_remuneracional.findUnique({ where: { id_parametro_remuneracional: id } });
    if (!actual || actual.tipo === 'PRORRATEO') throw new ErrorAplicacion(404, 'Parámetro remuneracional no encontrado');
    const data: Prisma.parametro_remuneracionalUpdateInput = {};
    if (entrada.nombre !== undefined) { const nombre = texto(entrada.nombre, 120); if (!nombre) throw new ErrorAplicacion(400, 'Nombre obligatorio'); data.nombre = nombre; }
    if (entrada.descripcion !== undefined) data.descripcion = texto(entrada.descripcion, 1000) || null;
    if (entrada.fuente !== undefined) data.fuente = texto(entrada.fuente, 200) || null;
    if (entrada.referencia !== undefined) data.referencia = texto(entrada.referencia, 300) || null;
    if (entrada.estado !== undefined) { const estado = texto(entrada.estado, 20).toLowerCase(); if (!['pendiente', 'activo', 'inactivo'].includes(estado)) throw new ErrorAplicacion(400, 'Estado inválido'); if (estado === 'activo' && actual.valor === null) throw new ErrorAplicacion(400, 'Un parámetro activo requiere valor'); data.estado = estado; }
    try {
      await prisma.$transaction(async (tx) => {
        if (data.estado === 'activo') {
          const conflicto = await tx.parametro_remuneracional.count({ where: { id_parametro_remuneracional: { not: id }, codigo: actual.codigo, estado: { not: 'inactivo' }, vigencia_desde: actual.vigencia_hasta ? { lte: actual.vigencia_hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: actual.vigencia_desde } }] } });
          if (conflicto) throw new ErrorAplicacion(409, 'La vigencia del parámetro se superpone con otra configuración');
        }
        await tx.parametro_remuneracional.update({ where: { id_parametro_remuneracional: id }, data });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarParametrosRemuneracionales();
    } catch (error) { this.conflictoConcurrente(error, 'El parámetro cambió concurrentemente'); }
  }

  async resolverParametroRemuneracional(codigoEntrada: unknown, fecha: unknown) {
    const codigo = texto(codigoEntrada, 50).toUpperCase(); const dia = fechaEntrada(fecha, 'Fecha')!;
    const filas = await prisma.parametro_remuneracional.findMany({ where: { codigo, tipo: { in: ['LEGAL', 'PREVISIONAL', 'TRIBUTARIO'] }, estado: 'activo', vigencia_desde: { lte: dia }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: dia } }] } });
    if (filas.length === 0) throw new ErrorAplicacion(404, 'No existe parámetro efectivo para la fecha');
    if (filas.length !== 1) throw new ErrorAplicacion(409, 'La vigencia del parámetro es ambigua');
    return this.presentarParametro(filas[0]);
  }

  async listarTramosImpuestoRenta(fecha?: unknown) {
    const dia = fecha ? fechaEntrada(fecha, 'Fecha')! : null;
    const filas = await prisma.tramo_impuesto_renta.findMany({ where: dia ? { estado: 'activo', vigencia_desde: { lte: dia }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: dia } }] } : undefined, orderBy: [{ vigencia_desde: 'desc' }, { orden: 'asc' }] });
    if (dia && new Set(filas.map((item) => `${item.vigencia_desde.toISOString()}|${item.vigencia_hasta?.toISOString() || ''}`)).size > 1) throw new ErrorAplicacion(409, 'Existe más de un conjunto tributario efectivo para la fecha');
    return filas.map((item) => ({ id: item.id_tramo_impuesto_renta, vigenciaDesde: item.vigencia_desde, vigenciaHasta: item.vigencia_hasta, orden: item.orden, limiteDesde: Number(item.limite_desde), limiteHasta: item.limite_hasta === null ? null : Number(item.limite_hasta), factor: Number(item.factor), rebaja: Number(item.rebaja), unidad: item.unidad, fuente: item.fuente, referencia: item.referencia, estado: item.estado }));
  }

  async crearTramoImpuestoRenta(entrada: Record<string, unknown>) {
    const { desde, hasta } = this.intervalo(entrada); const orden = enteroPositivo(entrada.orden, 'Orden');
    const limiteDesde = decimalOpcional(entrada.limiteDesde, 'Límite desde'); const limiteHasta = decimalOpcional(entrada.limiteHasta, 'Límite hasta');
    const factor = decimalOpcional(entrada.factor, 'Factor'); const rebaja = decimalOpcional(entrada.rebaja, 'Rebaja'); const unidad = texto(entrada.unidad, 30).toUpperCase();
    if (limiteDesde === null || factor === null || rebaja === null || !unidad) throw new ErrorAplicacion(400, 'Límites, factor, rebaja y unidad son obligatorios');
    if (limiteHasta && limiteHasta.lt(limiteDesde)) throw new ErrorAplicacion(400, 'El límite hasta no puede ser menor al límite desde');
    try {
      await prisma.$transaction(async (tx) => {
        const coincidentes = await tx.tramo_impuesto_renta.findMany({ where: { estado: 'activo', vigencia_desde: hasta ? { lte: hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } });
        const mismaFecha = (valor: Date | null, esperado: Date | null) => valor?.getTime() === esperado?.getTime();
        if (coincidentes.some((item) => item.vigencia_desde.getTime() !== desde.getTime() || !mismaFecha(item.vigencia_hasta, hasta))) throw new ErrorAplicacion(409, 'La vigencia se superpone con otro conjunto tributario');
        const conjunto = coincidentes;
        const finNuevo = limiteHasta ? Number(limiteHasta) : Number.POSITIVE_INFINITY; const inicioNuevo = Number(limiteDesde);
        if (conjunto.some((item) => inicioNuevo <= (item.limite_hasta === null ? Number.POSITIVE_INFINITY : Number(item.limite_hasta)) && Number(item.limite_desde) <= finNuevo)) throw new ErrorAplicacion(409, 'El tramo se superpone con otro del mismo conjunto');
        await tx.tramo_impuesto_renta.create({ data: { vigencia_desde: desde, vigencia_hasta: hasta, orden, limite_desde: limiteDesde, limite_hasta: limiteHasta, factor, rebaja, unidad, fuente: texto(entrada.fuente, 200) || null, referencia: texto(entrada.referencia, 300) || null } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarTramosImpuestoRenta();
    } catch (error) { this.conflictoConcurrente(error, 'Los tramos cambiaron concurrentemente'); }
  }

  async listarConceptosDeduccionAporte() {
    const filas = await prisma.concepto_remuneracion.findMany({ where: { naturaleza_concepto: { in: ['descuento', 'aporte_empleador'] } }, include: { configuraciones_m6: { orderBy: { vigencia_desde: 'desc' } } }, orderBy: { nombre_concepto: 'asc' } });
    return filas.map((item) => ({ id: item.id_concepto_remuneracion, codigo: item.codigo_m6, nombre: item.nombre_concepto, descripcion: item.descripcion_concepto, naturaleza: item.naturaleza_concepto === 'descuento' ? 'DEDUCCION' : 'APORTE_EMPLEADOR', estado: item.estado_concepto, configuraciones: item.configuraciones_m6.map((config) => ({ id: config.id_configuracion_concepto, modalidad: config.modalidad, valor: config.valor === null ? null : Number(config.valor), reglaTipo: config.regla_tipo, vigenciaDesde: config.vigencia_desde, vigenciaHasta: config.vigencia_hasta, activa: config.activa })) }));
  }

  async crearConceptoDeduccionAporte(entrada: Record<string, unknown>) {
    const codigo = texto(entrada.codigo, 40).toUpperCase(); const nombre = texto(entrada.nombre, 100); const naturalezaEntrada = texto(entrada.naturaleza, 30).toUpperCase();
    const naturaleza = naturalezaEntrada === 'DEDUCCION' ? 'descuento' : naturalezaEntrada === 'APORTE_EMPLEADOR' ? 'aporte_empleador' : '';
    const modalidad = texto(entrada.modalidad, 20).toUpperCase(); const valor = decimalOpcional(entrada.valor, 'Valor'); const reglaTipo = texto(entrada.reglaTipo, 40).toUpperCase() || null; const { desde, hasta } = this.intervalo(entrada);
    if (!codigo || !nombre || !naturaleza || modalidad && !['FIJO', 'PORCENTAJE', 'REGLA'].includes(modalidad)) throw new ErrorAplicacion(400, 'Código, nombre y naturaleza válidos son obligatorios');
    if (['FIJO', 'PORCENTAJE'].includes(modalidad) && valor === null) throw new ErrorAplicacion(400, 'La modalidad requiere valor');
    if (modalidad === 'REGLA' && !reglaTipo) throw new ErrorAplicacion(400, 'La regla requiere metadata controlada');
    try {
      await prisma.$transaction(async (tx) => {
        const concepto = await tx.concepto_remuneracion.create({ data: { codigo_m6: codigo, nombre_concepto: nombre, descripcion_concepto: texto(entrada.descripcion, 1000) || null, naturaleza_concepto: naturaleza } });
        if (modalidad) await tx.configuracion_concepto_remuneracion.create({ data: { id_concepto: concepto.id_concepto_remuneracion, modalidad, valor, regla_tipo: reglaTipo, vigencia_desde: desde, vigencia_hasta: hasta } });
      });
      return this.listarConceptosDeduccionAporte();
    } catch (error) { this.conflictoConcurrente(error, 'Ya existe un concepto con ese código o nombre'); }
  }

  async actualizarConceptoDeduccionAporte(id: number, entrada: Record<string, unknown>) {
    const actual = await prisma.concepto_remuneracion.findUnique({ where: { id_concepto_remuneracion: id } });
    if (!actual || !['descuento', 'aporte_empleador'].includes(actual.naturaleza_concepto)) throw new ErrorAplicacion(404, 'Concepto de deducción o aporte no encontrado');
    const data: Prisma.concepto_remuneracionUpdateInput = {};
    if (entrada.nombre !== undefined) { const nombre = texto(entrada.nombre, 100); if (!nombre) throw new ErrorAplicacion(400, 'Nombre obligatorio'); data.nombre_concepto = nombre; }
    if (entrada.descripcion !== undefined) data.descripcion_concepto = texto(entrada.descripcion, 1000) || null;
    if (entrada.estado !== undefined) { const estado = texto(entrada.estado, 20).toLowerCase(); if (!['activo', 'inactivo'].includes(estado)) throw new ErrorAplicacion(400, 'Estado inválido'); data.estado_concepto = estado; }
    await prisma.concepto_remuneracion.update({ where: { id_concepto_remuneracion: id }, data });
    return this.listarConceptosDeduccionAporte();
  }

  async listarConfiguracionProrrateo(fecha?: unknown) {
    const dia = fecha ? fechaEntrada(fecha, 'Fecha')! : null;
    const filas = await prisma.parametro_remuneracional.findMany({ where: { tipo: 'PRORRATEO', ...(dia ? { estado: { not: 'inactivo' }, vigencia_desde: { lte: dia }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: dia } }] } : {}) }, orderBy: [{ codigo: 'asc' }, { vigencia_desde: 'desc' }] });
    return filas.map((item) => this.presentarParametro(item));
  }

  async crearConfiguracionProrrateo(entrada: Record<string, unknown>) {
    return this.crearParametroTipado({ ...entrada, tipo: 'PRORRATEO' }, ['PRORRATEO']);
  }

  async listarPoliticasConservacion(fecha?: unknown) {
    const dia = fecha ? fechaEntrada(fecha, 'Fecha')! : null;
    const filas = await prisma.configuracion_conservacion_documental.findMany({ where: dia ? { estado: { not: 'inactiva' }, vigencia_desde: { lte: dia }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: dia } }] } : undefined, orderBy: { vigencia_desde: 'desc' } });
    return filas.map((item) => ({ id: item.id_configuracion_conservacion, estado: item.estado, criterioDescriptivo: item.criterio_descriptivo, fuente: item.fuente, referencia: item.referencia, vigenciaDesde: item.vigencia_desde, vigenciaHasta: item.vigencia_hasta, ejecutaTratamiento: false }));
  }

  async crearPoliticaConservacion(entrada: Record<string, unknown>) {
    const estado = texto(entrada.estado || 'pendiente', 20).toLowerCase(); const criterio = texto(entrada.criterioDescriptivo, 2000) || null; const { desde, hasta } = this.intervalo(entrada);
    if (!['pendiente', 'configurada', 'inactiva'].includes(estado)) throw new ErrorAplicacion(400, 'Estado de política inválido');
    if (estado === 'configurada' && !criterio) throw new ErrorAplicacion(400, 'Una política configurada requiere un criterio descriptivo');
    try {
      await prisma.$transaction(async (tx) => {
        const conflicto = await tx.configuracion_conservacion_documental.count({ where: { estado: { not: 'inactiva' }, vigencia_desde: hasta ? { lte: hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } });
        if (conflicto) throw new ErrorAplicacion(409, 'La política se superpone con otra vigencia');
        await tx.configuracion_conservacion_documental.create({ data: { estado, criterio_descriptivo: criterio, fuente: texto(entrada.fuente, 200) || null, referencia: texto(entrada.referencia, 300) || null, vigencia_desde: desde, vigencia_hasta: hasta } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarPoliticasConservacion();
    } catch (error) { this.conflictoConcurrente(error, 'La política documental cambió concurrentemente'); }
  }

  async listarMediosPagoM6(soloActivos = false) {
    const filas = await prisma.medio_pago.findMany({ where: soloActivos ? { estado_medio_pago: 'activo', codigo_medio_pago: { not: null }, requiere_respaldo: { not: null } } : undefined, orderBy: { nombre_medio_pago: 'asc' } });
    return filas.map((item) => ({ id: item.id_medio_pago, codigo: item.codigo_medio_pago, nombre: item.nombre_medio_pago, descripcion: item.descripcion_medio_pago, estado: item.estado_medio_pago, requiereRespaldo: item.requiere_respaldo }));
  }

  async crearMedioPagoM6(entrada: Record<string, unknown>) {
    const codigo = texto(entrada.codigo, 40).toUpperCase(); const nombre = texto(entrada.nombre, 80);
    if (!codigo || !nombre || typeof entrada.requiereRespaldo !== 'boolean') throw new ErrorAplicacion(400, 'Código, nombre y requisito de respaldo son obligatorios');
    try {
      await prisma.medio_pago.create({ data: { codigo_medio_pago: codigo, nombre_medio_pago: nombre, descripcion_medio_pago: texto(entrada.descripcion, 1000) || null, requiere_respaldo: entrada.requiereRespaldo } });
      return this.listarMediosPagoM6();
    } catch (error) { this.conflictoConcurrente(error, 'Ya existe un medio de pago con ese código o nombre'); }
  }

  async actualizarMedioPagoM6(id: number, entrada: Record<string, unknown>) {
    const actual = await prisma.medio_pago.findUnique({ where: { id_medio_pago: id } }); if (!actual) throw new ErrorAplicacion(404, 'Medio de pago no encontrado');
    const data: Prisma.medio_pagoUpdateInput = {};
    if (entrada.codigo !== undefined) { const codigo = texto(entrada.codigo, 40).toUpperCase(); if (!codigo) throw new ErrorAplicacion(400, 'Código obligatorio'); data.codigo_medio_pago = codigo; }
    if (entrada.nombre !== undefined) { const nombre = texto(entrada.nombre, 80); if (!nombre) throw new ErrorAplicacion(400, 'Nombre obligatorio'); data.nombre_medio_pago = nombre; }
    if (entrada.descripcion !== undefined) data.descripcion_medio_pago = texto(entrada.descripcion, 1000) || null;
    if (entrada.requiereRespaldo !== undefined) { if (typeof entrada.requiereRespaldo !== 'boolean') throw new ErrorAplicacion(400, 'Requisito de respaldo inválido'); data.requiere_respaldo = entrada.requiereRespaldo; }
    if (entrada.estado !== undefined) { const estado = texto(entrada.estado, 20).toLowerCase(); if (!['activo', 'inactivo'].includes(estado)) throw new ErrorAplicacion(400, 'Estado inválido'); data.estado_medio_pago = estado; }
    try { await prisma.medio_pago.update({ where: { id_medio_pago: id }, data }); return this.listarMediosPagoM6(); }
    catch (error) { this.conflictoConcurrente(error, 'Ya existe un medio de pago con ese código o nombre'); }
  }

  private incluirHecho = {
    tarea: true,
    ejecutor: { include: { empleado_seguridad: true, empleado: true } },
    incidencias: { include: { decision_remuneracional: true }, orderBy: { fecha_registro: 'asc' as const } },
    tratamiento_remuneracional: { include: { esquema: true, tarifa: true } },
  };

  private presentarHecho(ejecucion: any) {
    const tratamiento = ejecucion.tratamiento_remuneracional;
    const empleadoSeguridad = ejecucion.ejecutor.empleado_seguridad;
    const empleadoLegacy = ejecucion.ejecutor.empleado;
    const mapeoAmbiguo = empleadoSeguridad && empleadoLegacy && empleadoSeguridad.id_empleado !== empleadoLegacy.id_empleado;
    const empleado = mapeoAmbiguo ? null : empleadoSeguridad || empleadoLegacy;
    return {
      idEjecucion: ejecucion.id_ejecucion_tarea.toString(), idTarea: ejecucion.id_tarea.toString(),
      tarea: ejecucion.tarea.tarea_titulo || `Tarea ${ejecucion.id_tarea.toString()}`, fecha: ejecucion.fecha_ejecucion,
      estadoOperacional: ejecucion.estado_ejecucion, validacionProductiva: ejecucion.estado_validacion_productiva,
      cantidad: ejecucion.cantidad === null ? null : Number(ejecucion.cantidad), unidad: ejecucion.unidad,
      ejecutor: { id: ejecucion.ejecutor.usuario_id_usuario.toString(), nombre: [ejecucion.ejecutor.usuario_nombre_completo_primer_nombre_usuario, ejecucion.ejecutor.usuario_nombre_completo_primer_apellido_usuario].filter(Boolean).join(' ') || ejecucion.ejecutor.usuario_username || 'Usuario operacional' },
      empleado: empleado ? { id: empleado.id_empleado, rut: empleado.rut_empleado, nombre: nombreCompleto(empleado) } : null,
      mapeoAmbiguo,
      retrabajos: ejecucion.incidencias.map((incidencia: any) => ({ id: incidencia.id_incidencia_retrabajo.toString(), descripcion: incidencia.descripcion, causaReferencia: incidencia.causa_referencia, causaPendiente: incidencia.causa_referencia === null, estado: incidencia.estado, responsabilidad: incidencia.responsabilidad, fecha: incidencia.fecha_registro, decision: incidencia.decision_remuneracional ? { decision: incidencia.decision_remuneracional.decision, motivo: incidencia.decision_remuneracional.motivo, idUsuarioResolutor: incidencia.decision_remuneracional.id_usuario_resolutor.toString(), fecha: incidencia.decision_remuneracional.fecha_resolucion } : null })),
      tratamiento: tratamiento ? {
        id: tratamiento.id_tratamiento_remuneracional, estadoRemunerabilidad: tratamiento.estado_remunerabilidad,
        estadoValorizacion: tratamiento.estado_valorizacion, motivo: tratamiento.motivo,
        esquema: tratamiento.esquema ? { id: tratamiento.esquema.id_esquema_remuneracional, codigo: tratamiento.esquema.codigo, nombre: tratamiento.esquema.nombre } : null,
        tarifa: tratamiento.tarifa ? { id: tratamiento.tarifa.id_tarifa_esquema, modalidad: tratamiento.tarifa.modalidad, valor: tratamiento.tarifa.valor === null ? null : Number(tratamiento.tarifa.valor), unidad: tratamiento.tarifa.unidad, tipoAplicacion: tratamiento.tarifa.tipo_aplicacion } : null,
        valorPropuesto: tratamiento.valor_propuesto === null ? null : Number(tratamiento.valor_propuesto),
      } : null,
    };
  }

  async listarHechosRemunerables() {
    const ejecuciones = await prisma.ejecucion_tarea.findMany({ where: { estado_ejecucion: 'terminada', estado_validacion_productiva: 'validada' }, include: this.incluirHecho, orderBy: { fecha_ejecucion: 'desc' } });
    return ejecuciones.map((ejecucion) => this.presentarHecho(ejecucion));
  }

  async obtenerHechoRemunerable(idEjecucion: bigint) {
    const ejecucion = await prisma.ejecucion_tarea.findFirst({ where: { id_ejecucion_tarea: idEjecucion, estado_ejecucion: 'terminada', estado_validacion_productiva: 'validada' }, include: this.incluirHecho });
    if (!ejecucion) throw new ErrorAplicacion(404, 'Ejecución terminada y validada no encontrada');
    return this.presentarHecho(ejecucion);
  }

  async revisarHechoRemunerable(idEjecucion: bigint) {
    try {
      await prisma.$transaction(async (tx) => {
        const ejecucion = await tx.ejecucion_tarea.findUnique({ where: { id_ejecucion_tarea: idEjecucion }, include: { ejecutor: { include: { empleado_seguridad: true, empleado: true } }, incidencias: { where: { estado: 'pendiente' }, include: { decision_remuneracional: true }, orderBy: { fecha_registro: 'asc' } }, tratamiento_remuneracional: true } });
        if (!ejecucion || ejecucion.estado_ejecucion !== 'terminada' || ejecucion.estado_validacion_productiva !== 'validada') throw new ErrorAplicacion(409, 'La ejecución no está terminada y validada productivamente');
        const seguridad = ejecucion.ejecutor.empleado_seguridad; const legacy = ejecucion.ejecutor.empleado;
        let empleado = seguridad || legacy; let estadoRemunerabilidad = 'remunerable'; let estadoValorizacion = 'pendiente'; let motivo: string | null = null;
        let idEsquema: number | null = null; let idTarifa: number | null = null; let valorPropuesto: Prisma.Decimal | null = null;
        if (seguridad && legacy && seguridad.id_empleado !== legacy.id_empleado) { empleado = null; estadoRemunerabilidad = 'conflicto'; motivo = 'Las asociaciones Usuario→Empleado son incompatibles'; }
        else if (!empleado) { estadoRemunerabilidad = 'pendiente'; motivo = 'Pendiente de correspondencia Usuario→Empleado'; }
        if (empleado) {
          const fecha = ejecucion.fecha_ejecucion;
          let asignaciones = await tx.asignacion_esquema_remuneracional.findMany({ where: { id_empleado: empleado.id_empleado, activa: true, vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }], esquema: { estado: 'activo', vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }] } } });
          if (!asignaciones.length && empleado.id_cargo) asignaciones = await tx.asignacion_esquema_remuneracional.findMany({ where: { id_cargo: empleado.id_cargo, activa: true, vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }], esquema: { estado: 'activo', vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }] } } });
          if (!asignaciones.length) motivo = motivo || 'No existe esquema aplicable para la fecha de ejecución';
          else if (asignaciones.length > 1) { estadoValorizacion = 'conflicto'; motivo = 'Existen múltiples esquemas aplicables'; }
          else {
            idEsquema = asignaciones[0].id_esquema;
            const tarifas = await tx.tarifa_esquema_remuneracional.findMany({ where: { id_esquema: idEsquema, estado_revision: 'activa', vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }] } });
            if (!tarifas.length) motivo = motivo || 'No existe tarifa activa para la fecha de ejecución';
            else if (tarifas.length > 1) { estadoValorizacion = 'conflicto'; motivo = 'Existen múltiples tarifas aplicables'; }
            else {
              const tarifa = tarifas[0]; idTarifa = tarifa.id_tarifa_esquema;
              if (tarifa.modalidad === 'REGLA') motivo = 'La tarifa REGLA no tiene semántica ejecutable';
              else if (tarifa.modalidad === 'PORCENTAJE') motivo = 'La tarifa porcentual no tiene base de cálculo disponible';
              else if (tarifa.valor === null) motivo = 'La tarifa no tiene valor configurado';
              else if (tarifa.tipo_aplicacion === null) motivo = 'La tarifa no define si su aplicación es global o por unidad';
              else if (tarifa.tipo_aplicacion === 'por_unidad' && (!normalizarUnidad(ejecucion.unidad) || ejecucion.cantidad === null || normalizarUnidad(tarifa.unidad) !== normalizarUnidad(ejecucion.unidad))) motivo = 'La cantidad o unidad operacional no coincide con la tarifa';
              else { valorPropuesto = tarifa.tipo_aplicacion === 'por_unidad' ? tarifa.valor.mul(ejecucion.cantidad!) : tarifa.valor; estadoValorizacion = 'valorizado'; motivo = null; }
            }
          }
        }
        if (ejecucion.incidencias.some((incidencia) => !incidencia.decision_remuneracional)) { estadoRemunerabilidad = 'pendiente'; motivo = 'Retrabajo pendiente de decisión remuneracional'; }
        await tx.tratamiento_remuneracional_ejecucion.upsert({ where: { id_ejecucion_tarea: idEjecucion }, create: { id_ejecucion_tarea: idEjecucion, id_empleado: empleado?.id_empleado, estado_remunerabilidad: estadoRemunerabilidad, estado_valorizacion: estadoValorizacion, motivo, id_esquema: idEsquema, id_tarifa: idTarifa, valor_propuesto: valorPropuesto }, update: { id_empleado: empleado?.id_empleado, estado_remunerabilidad: estadoRemunerabilidad, estado_valorizacion: estadoValorizacion, motivo, id_esquema: idEsquema, id_tarifa: idTarifa, valor_propuesto: valorPropuesto } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerHechoRemunerable(idEjecucion);
    } catch (error) { this.conflictoConcurrente(error, 'El tratamiento cambió concurrentemente'); }
  }

  async listarRetrabajosPendientes() {
    const incidencias = await prisma.incidencia_retrabajo_tarea.findMany({ where: { estado: 'pendiente', decision_remuneracional: { is: null }, ejecucion: { estado_ejecucion: 'terminada', estado_validacion_productiva: 'validada' } }, include: { ejecucion: { include: this.incluirHecho } }, orderBy: { fecha_registro: 'asc' } });
    return incidencias.map((incidencia) => ({ ...this.presentarHecho(incidencia.ejecucion), incidencia: { id: incidencia.id_incidencia_retrabajo.toString(), descripcion: incidencia.descripcion, causaReferencia: incidencia.causa_referencia, causaPendiente: incidencia.causa_referencia === null, responsabilidad: incidencia.responsabilidad, fecha: incidencia.fecha_registro } }));
  }

  async resolverRetrabajo(idIncidencia: bigint, entrada: Record<string, unknown>, idUsuarioResolutor: bigint) {
    const decision = texto(entrada.decision, 30).toLowerCase(); const motivo = texto(entrada.motivo, 1000);
    if (!['remunerable', 'no_remunerable'].includes(decision)) throw new ErrorAplicacion(400, 'La decisión debe ser REMUNERABLE o NO REMUNERABLE');
    if (!motivo) throw new ErrorAplicacion(400, 'La justificación es obligatoria');
    const incidencia = await prisma.incidencia_retrabajo_tarea.findUnique({ where: { id_incidencia_retrabajo: idIncidencia } });
    if (!incidencia) throw new ErrorAplicacion(404, 'Retrabajo no encontrado');
    await this.revisarHechoRemunerable(incidencia.id_ejecucion_tarea);
    try {
      await prisma.$transaction(async (tx) => {
        const actual = await tx.tratamiento_remuneracional_ejecucion.findUnique({ where: { id_ejecucion_tarea: incidencia.id_ejecucion_tarea } });
        if (!actual) throw new ErrorAplicacion(409, 'La ejecución no tiene tratamiento remuneracional');
        const previa = await tx.decision_remuneracional_retrabajo.findUnique({ where: { id_incidencia_retrabajo: idIncidencia } });
        if (previa && previa.decision !== decision) throw new ErrorAplicacion(409, 'El retrabajo ya tiene una decisión remuneracional incompatible');
        await tx.decision_remuneracional_retrabajo.upsert({ where: { id_incidencia_retrabajo: idIncidencia }, create: { id_incidencia_retrabajo: idIncidencia, id_tratamiento_remuneracional: actual.id_tratamiento_remuneracional, decision, motivo, id_usuario_resolutor: idUsuarioResolutor }, update: { decision, motivo, id_usuario_resolutor: idUsuarioResolutor, fecha_resolucion: new Date() } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.revisarHechoRemunerable(incidencia.id_ejecucion_tarea);
    } catch (error) { this.conflictoConcurrente(error, 'El retrabajo cambió concurrentemente'); }
  }

  private incluirRemuneracion = {
    periodo: true,
    empleado: { include: { cargo: true, asignaciones_esquema_remuneracional: { include: { esquema: true }, orderBy: { vigencia_desde: 'desc' as const } } } },
    componentes: { include: { concepto: true }, orderBy: { creado_en: 'asc' as const } },
    ajustes_posteriores: { include: { regularizacion: true }, orderBy: { creado_en: 'asc' as const } },
  };

  private presentarComponente(item: any) {
    return {
      id: item.id_componente_remuneracion, tipo: item.tipo, modalidad: item.modalidad,
      descripcion: item.descripcion, monto: item.monto === null ? null : Number(item.monto), direccion: item.direccion,
      fuenteTipo: item.fuente_tipo, claveNegocio: item.clave_negocio, referenciaOrigen: item.referencia_origen,
      versionOrigen: item.version_origen, fechaOrigen: item.fecha_origen, estadoRevision: item.estado_revision,
      motivo: item.motivo, idComponenteOrigen: item.id_componente_origen, tipoRelacion: item.tipo_relacion,
      creadoPor: item.creado_por.toString(), revisadoPor: item.revisado_por?.toString() || null,
      fechaRevision: item.fecha_revision, creadoEn: item.creado_en,
      concepto: item.concepto ? { id: item.concepto.id_concepto_remuneracion, codigo: item.concepto.codigo_m6, nombre: item.concepto.nombre_concepto } : null,
    };
  }

  private presentarRemuneracion(item: any, estadoPago = { fuenteDisponible: true, tienePago: false }) {
    return {
      id: item.id_remuneracion, estado: item.estado,
      periodo: { id: item.periodo.id_periodo_remuneracion, anio: item.periodo.anio, mes: item.periodo.mes, fechaInicio: item.periodo.fecha_inicio, fechaFin: item.periodo.fecha_fin, cerradoEn: item.periodo.cerrado_en },
      empleado: { id: item.empleado.id_empleado, rut: item.empleado.rut_empleado, nombre: nombreCompleto(item.empleado) },
      calculadoEn: item.calculado_en, cerradoEn: item.cerrado_en, reemplazaAId: item.reemplaza_a_id,
      reapertura: { solicitadaEn: item.reapertura_solicitada_en, solicitadaPor: item.reapertura_solicitada_por?.toString() || null, motivo: item.reapertura_motivo, aprobadaEn: item.reapertura_aprobada_en, aprobadaPor: item.reapertura_aprobada_por?.toString() || null },
      totales: { haberes: item.total_haberes === null ? null : Number(item.total_haberes), deducciones: item.total_deducciones === null ? null : Number(item.total_deducciones), descuentosPrevisionales: item.total_descuentos_previsionales === null ? null : Number(item.total_descuentos_previsionales), impuesto: item.total_impuesto === null ? null : Number(item.total_impuesto), otrasDeducciones: item.total_otras_deducciones === null ? null : Number(item.total_otras_deducciones), aportesEmpleador: item.total_aportes_empleador === null ? null : Number(item.total_aportes_empleador), costoEmpresa: item.costo_empresa === null ? null : Number(item.costo_empresa), baseImponible: item.base_imponible === null ? null : Number(item.base_imponible), baseTributable: item.base_tributable === null ? null : Number(item.base_tributable), liquidoPreliminar: item.liquido_preliminar === null ? null : Number(item.liquido_preliminar) },
      componentes: item.componentes.map((componente: any) => this.presentarComponente(componente)),
      condicionPago: estadoPago,
      ajustesPosteriores: (item.ajustes_posteriores || []).map((ajuste: any) => ({
        id: ajuste.id_ajuste_posterior, fechaHallazgo: ajuste.fecha_hallazgo, monto: Number(ajuste.monto),
        direccion: ajuste.direccion, motivo: ajuste.motivo, tratamiento: ajuste.tratamiento,
        idPeriodoOrigen: ajuste.id_periodo_origen, idPeriodoAplicable: ajuste.id_periodo_aplicable,
        estado: ajuste.estado, motivoTratamiento: ajuste.motivo_tratamiento,
        requiereResolucionHumana: ajuste.requiere_resolucion_humana, postergadoEn: ajuste.postergado_en,
        regularizacion: ajuste.regularizacion ? { id: ajuste.regularizacion.id_regularizacion, monto: Number(ajuste.regularizacion.monto), motivo: ajuste.regularizacion.motivo, estado: ajuste.regularizacion.estado, cerradoEn: ajuste.regularizacion.cerrado_en } : null,
      })),
    };
  }

  private periodoEntrada(anioEntrada: unknown, mesEntrada: unknown) {
    const anio = Number(anioEntrada); const mes = Number(mesEntrada);
    if (!Number.isInteger(anio) || anio < 2000 || anio > 2200 || !Number.isInteger(mes) || mes < 1 || mes > 12) throw new ErrorAplicacion(400, 'Año y mes válidos son obligatorios');
    return { anio, mes, fechaInicio: new Date(Date.UTC(anio, mes - 1, 1)), fechaFin: new Date(Date.UTC(anio, mes, 0)) };
  }

  private async poblacionExigible(tx: Prisma.TransactionClient, fechaInicio: Date, fechaFin: Date) {
    const relaciones = await tx.relacion_laboral_empleado.findMany({
      where: { fecha_inicio: { lte: fechaFin }, OR: [{ fecha_termino: null }, { fecha_termino: { gte: fechaInicio } }] },
      include: { empleado: true }, orderBy: [{ id_empleado: 'asc' }, { fecha_inicio: 'asc' }],
    });
    const agrupada = new Map<number, { empleado: any; relaciones: any[] }>();
    for (const relacion of relaciones) {
      const item = agrupada.get(relacion.id_empleado) || { empleado: relacion.empleado, relaciones: [] };
      item.relaciones.push(relacion); agrupada.set(relacion.id_empleado, item);
    }
    return [...agrupada.values()];
  }

  private async bloqueosRemuneracion(tx: Prisma.TransactionClient, remuneracion: any) {
    const bloqueos: { codigo: string; detalle: string }[] = []; const advertencias: { codigo: string; detalle: string }[] = [];
    if (remuneracion.empleado.sueldo_base === null) bloqueos.push({ codigo: 'SUELDO_BASE_FALTANTE', detalle: 'El empleado no tiene sueldo base vigente' });
    if (remuneracion.empleado.sueldo_base !== null && (!remuneracion.empleado.fecha_aplicacion_sueldo_base || remuneracion.empleado.fecha_aplicacion_sueldo_base > remuneracion.periodo.fecha_fin)) bloqueos.push({ codigo: 'VIGENCIA_SUELDO_BASE_NO_RESUELTA', detalle: 'No existe vigencia de sueldo base aplicable al período' });
    const pendientes = remuneracion.componentes.filter((item: any) => ['propuesto', 'conflicto', 'pendiente_valorizacion'].includes(item.estado_revision));
    for (const item of pendientes) bloqueos.push({ codigo: 'COMPONENTE_PENDIENTE', detalle: `${item.descripcion} (${item.estado_revision})` });
    const tratamientos = await tx.tratamiento_remuneracional_ejecucion.findMany({ where: { id_empleado: remuneracion.id_empleado, ejecucion: { fecha_ejecucion: { gte: remuneracion.periodo.fecha_inicio, lte: remuneracion.periodo.fecha_fin } } }, include: { ejecucion: true, decisiones_retrabajo: true } });
    for (const item of tratamientos) {
      if (item.estado_remunerabilidad === 'pendiente' || item.estado_valorizacion === 'pendiente' || item.estado_valorizacion === 'conflicto') bloqueos.push({ codigo: 'HECHO_TERRENO_PENDIENTE', detalle: `La ejecución ${item.id_ejecucion_tarea.toString()} no está resuelta` });
      if (item.estado_remunerabilidad === 'remunerable' && item.valor_propuesto === null) bloqueos.push({ codigo: 'HECHO_TERRENO_SIN_VALOR', detalle: `La ejecución ${item.id_ejecucion_tarea.toString()} no tiene valor` });
    }
    const relaciones = await tx.relacion_laboral_empleado.count({ where: { id_empleado: remuneracion.id_empleado, fecha_inicio: { lte: remuneracion.periodo.fecha_fin }, OR: [{ fecha_termino: null }, { fecha_termino: { gte: remuneracion.periodo.fecha_inicio } }] } });
    if (relaciones === 0) bloqueos.push({ codigo: 'RELACION_LABORAL_NO_APLICABLE', detalle: 'El empleado no tiene relación laboral aplicable al período' });
    if (relaciones > 1) advertencias.push({ codigo: 'MULTIPLES_RELACIONES_MES', detalle: 'El empleado presenta más de una relación laboral aplicable' });
    if (!remuneracion.empleado.id_afp) advertencias.push({ codigo: 'AFP_NO_INFORMADA', detalle: 'AFP no informada; no se calculó una deducción previsional' });
    if (!remuneracion.empleado.id_prevision_salud) advertencias.push({ codigo: 'SALUD_NO_INFORMADA', detalle: 'Previsión de salud no informada; no se calculó una deducción de salud' });
    return { bloqueos, advertencias };
  }

  async consultarPeriodoRemuneracion(anioEntrada: unknown, mesEntrada: unknown) {
    const { anio, mes, fechaInicio, fechaFin } = this.periodoEntrada(anioEntrada, mesEntrada);
    return prisma.$transaction(async (tx) => {
      const periodo = await tx.periodo_remuneracion.findUnique({ where: { anio_mes: { anio, mes } } });
      const poblacion = await this.poblacionExigible(tx, fechaInicio, fechaFin);
      const remuneraciones = periodo ? await tx.remuneracion.findMany({ where: { id_periodo_remuneracion: periodo.id_periodo_remuneracion }, include: this.incluirRemuneracion, orderBy: { id_remuneracion: 'desc' } }) : [];
      const actuales = new Map<number, any>(); for (const item of remuneraciones) if (item.estado !== 'reemplazada' && !actuales.has(item.id_empleado)) actuales.set(item.id_empleado, item);
      const empleados = [];
      for (const item of poblacion) {
        const actual = actuales.get(item.empleado.id_empleado); const revision = actual ? await this.bloqueosRemuneracion(tx, actual) : { bloqueos: [{ codigo: 'REMUNERACION_NO_CREADA', detalle: 'No existe remuneración actual para el período' }], advertencias: [] };
        empleados.push({ idEmpleado: item.empleado.id_empleado, rut: item.empleado.rut_empleado, nombre: nombreCompleto(item.empleado), estadoLaboral: item.empleado.estado_laboral, relaciones: item.relaciones.map((r: any) => ({ id: r.id_relacion_laboral_empleado, fechaInicio: r.fecha_inicio, fechaTermino: r.fecha_termino, estado: r.estado })), remuneracion: actual ? this.presentarRemuneracion(actual) : null, ...revision });
      }
      return { periodo: periodo ? { id: periodo.id_periodo_remuneracion, anio, mes, fechaInicio, fechaFin, cerradoEn: periodo.cerrado_en } : { id: null, anio, mes, fechaInicio, fechaFin, cerradoEn: null }, resumen: { exigibles: empleados.length, sinRemuneracion: empleados.filter(x => !x.remuneracion).length, abiertas: empleados.filter(x => x.remuneracion?.estado === 'abierta').length, cerradas: empleados.filter(x => x.remuneracion?.estado === 'cerrada').length, conBloqueos: empleados.filter(x => x.bloqueos.length).length }, empleados };
    });
  }

  async obtenerRemuneracion(idRemuneracion: number) {
    return prisma.$transaction(async tx => {
      const item = await tx.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: this.incluirRemuneracion });
      if (!item) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
      return this.presentarRemuneracion(item, await this.estadoPagoRemuneracion(tx, idRemuneracion));
    });
  }

  async obtenerOCrearContextoRemuneracion(entrada: Record<string, unknown>, idUsuario: bigint) {
    const idEmpleado = enteroPositivo(entrada.idEmpleado, 'Empleado');
    const { anio, mes, fechaInicio, fechaFin } = this.periodoEntrada(entrada.anio, entrada.mes);
    try {
      const id = await prisma.$transaction(async (tx) => {
        if (!await tx.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
        const periodo = await tx.periodo_remuneracion.upsert({ where: { anio_mes: { anio, mes } }, create: { anio, mes, fecha_inicio: fechaInicio, fecha_fin: fechaFin }, update: {} });
        if (periodo.cerrado_en) throw new ErrorAplicacion(409, 'El período global está CERRADO');
        const vigente = await tx.remuneracion.findFirst({
          where: { id_periodo_remuneracion: periodo.id_periodo_remuneracion, id_empleado: idEmpleado, estado: { not: 'reemplazada' } },
          orderBy: { id_remuneracion: 'desc' },
        });
        const remuneracion = vigente || await tx.remuneracion.create({ data: { id_periodo_remuneracion: periodo.id_periodo_remuneracion, id_empleado: idEmpleado, creado_por: idUsuario } });
        return remuneracion.id_remuneracion;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRemuneracion(id);
    } catch (error) { this.conflictoConcurrente(error, 'El contexto individual cambió concurrentemente'); }
  }

  private async remuneracionAbierta(tx: Prisma.TransactionClient, idRemuneracion: number) {
    const remuneracion = await tx.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: { periodo: true } });
    if (!remuneracion) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
    if (remuneracion.estado !== 'abierta') throw new ErrorAplicacion(409, 'La remuneración no está ABIERTA');
    if (remuneracion.periodo.cerrado_en) throw new ErrorAplicacion(409, 'El período global está CERRADO');
    return remuneracion;
  }

  private mismoAutomatico(actual: any, candidato: any) {
    const mismoDecimal = (a: Prisma.Decimal | null, b: Prisma.Decimal | null | undefined) => a === null || b === null || b === undefined ? a === (b ?? null) : a.equals(b);
    const mismaFecha = (a: Date | null, b: Date | string | null | undefined) => (a?.toISOString().slice(0, 10) || null) === (b ? new Date(b).toISOString().slice(0, 10) : null);
    return actual.id_concepto === (candidato.id_concepto ?? null)
      && actual.descripcion === candidato.descripcion
      && mismoDecimal(actual.monto, candidato.monto)
      && actual.referencia_origen === (candidato.referencia_origen ?? null)
      && actual.version_origen === (candidato.version_origen ?? null)
      && mismaFecha(actual.fecha_origen, candidato.fecha_origen);
  }

  private async sincronizarAutomaticos(tx: Prisma.TransactionClient, idRemuneracion: number, candidatos: Prisma.componente_remuneracionCreateManyInput[], tipos: string[]) {
    const existentes = await tx.componente_remuneracion.findMany({
      where: { id_remuneracion: idRemuneracion, tipo: { in: tipos }, fuente_tipo: 'AUTOMATICA' },
      include: { _count: { select: { componentes_derivados: true } } },
    });
    const porClave = new Map(existentes.map(item => [`${item.tipo}|${item.clave_negocio || ''}`, item]));
    const conservados = new Set<number>();
    for (const original of candidatos) {
      const candidato = { ...original };
      const anterior = porClave.get(`${candidato.tipo}|${candidato.clave_negocio || ''}`);
      if (anterior && this.mismoAutomatico(anterior, candidato)) {
        conservados.add(anterior.id_componente_remuneracion);
        continue;
      }
      if (anterior && candidato.tipo === 'DEDUCCION_AUTOMATICA' && candidato.clave_negocio?.startsWith('ANTICIPO:') && anterior._count.componentes_derivados === 0) {
        await tx.componente_remuneracion.update({
          where: { id_componente_remuneracion: anterior.id_componente_remuneracion },
          data: { monto: candidato.monto, referencia_origen: candidato.referencia_origen, estado_revision: 'aprobado', motivo: null, revisado_por: candidato.revisado_por, fecha_revision: candidato.fecha_revision },
        });
        conservados.add(anterior.id_componente_remuneracion);
        continue;
      }
      if (anterior && ['DEDUCCION_PREVISIONAL', 'IMPUESTO_RENTA', 'APORTE_EMPLEADOR_AUTOMATICO'].includes(String(candidato.tipo)) && anterior._count.componentes_derivados === 0) {
        await tx.componente_remuneracion.update({
          where: { id_componente_remuneracion: anterior.id_componente_remuneracion },
          data: { descripcion: candidato.descripcion, monto: candidato.monto, referencia_origen: candidato.referencia_origen, version_origen: candidato.version_origen, estado_revision: 'aprobado', motivo: null, revisado_por: candidato.revisado_por, fecha_revision: candidato.fecha_revision },
        });
        conservados.add(anterior.id_componente_remuneracion);
        continue;
      }
      if (anterior) {
        const descartable = ['propuesto', 'conflicto', 'pendiente_valorizacion'].includes(anterior.estado_revision)
          && anterior.revisado_por === null && anterior.fecha_revision === null && anterior._count.componentes_derivados === 0;
        if (descartable) {
          await tx.componente_remuneracion.delete({ where: { id_componente_remuneracion: anterior.id_componente_remuneracion } });
        } else {
          await tx.componente_remuneracion.update({
            where: { id_componente_remuneracion: anterior.id_componente_remuneracion },
            data: {
              fuente_tipo: 'AUTOMATICA_HISTORICA',
              estado_revision: anterior.estado_revision === 'aprobado' ? 'reemplazado' : anterior.estado_revision,
              motivo: anterior.motivo || 'Antecedente automático preservado porque su fuente cambió',
            },
          });
          candidato.estado_revision = 'conflicto';
          candidato.motivo = 'La fuente cambió después de existir un antecedente automático revisado';
          candidato.revisado_por = null;
          candidato.fecha_revision = null;
          candidato.id_componente_origen = anterior.id_componente_remuneracion;
          candidato.tipo_relacion = 'NUEVA_VERSION';
        }
      }
      await tx.componente_remuneracion.create({ data: candidato as Prisma.componente_remuneracionUncheckedCreateInput });
    }
    for (const anterior of existentes.filter(item => !conservados.has(item.id_componente_remuneracion) && !candidatos.some(candidato => `${candidato.tipo}|${candidato.clave_negocio || ''}` === `${item.tipo}|${item.clave_negocio || ''}`))) {
      const descartable = ['propuesto', 'conflicto', 'pendiente_valorizacion'].includes(anterior.estado_revision)
        && anterior.revisado_por === null && anterior.fecha_revision === null && anterior._count.componentes_derivados === 0;
      if (descartable) await tx.componente_remuneracion.delete({ where: { id_componente_remuneracion: anterior.id_componente_remuneracion } });
      else await tx.componente_remuneracion.update({ where: { id_componente_remuneracion: anterior.id_componente_remuneracion }, data: { fuente_tipo: 'AUTOMATICA_HISTORICA', estado_revision: anterior.estado_revision === 'aprobado' ? 'conflicto' : anterior.estado_revision, motivo: anterior.motivo || 'La fuente automática dejó de aplicar; requiere revisión' } });
    }
  }

  private async calcularEnTransaccion(tx: Prisma.TransactionClient, idRemuneracion: number, idUsuario: bigint) {
    const actual = await this.remuneracionAbierta(tx, idRemuneracion);
    const remuneracion = await tx.remuneracion.findUniqueOrThrow({ where: { id_remuneracion: idRemuneracion }, include: { periodo: true, empleado: { include: { afp: true, prevision_salud: true } }, componentes: { include: { concepto: true } } } });
    const componentes: Prisma.componente_remuneracionCreateManyInput[] = [];
    const agregar = (data: Omit<Prisma.componente_remuneracionCreateManyInput, 'id_remuneracion' | 'creado_por'>) => componentes.push({ ...data, id_remuneracion: idRemuneracion, creado_por: idUsuario });
    if (remuneracion.empleado.sueldo_base !== null && remuneracion.empleado.fecha_aplicacion_sueldo_base && remuneracion.empleado.fecha_aplicacion_sueldo_base <= remuneracion.periodo.fecha_fin) {
      agregar({ tipo: 'SUELDO_BASE', descripcion: 'Sueldo base vigente', monto: remuneracion.empleado.sueldo_base, fuente_tipo: 'AUTOMATICA', clave_negocio: 'SUELDO_BASE', referencia_origen: `EMPLEADO:${remuneracion.id_empleado}`, version_origen: remuneracion.empleado.fecha_aplicacion_sueldo_base.toISOString().slice(0, 10), fecha_origen: remuneracion.empleado.fecha_aplicacion_sueldo_base, estado_revision: 'aprobado', revisado_por: idUsuario, fecha_revision: new Date() });
    }
    const asignaciones = await tx.asignacion_concepto_remuneracion_empleado.findMany({
      where: { id_empleado: remuneracion.id_empleado, vigencia_desde: { lte: remuneracion.periodo.fecha_fin }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: remuneracion.periodo.fecha_inicio } }], concepto: { naturaleza_concepto: 'haber' } },
      include: { concepto: { include: { configuraciones_m6: { where: { activa: true, vigencia_desde: { lte: remuneracion.periodo.fecha_fin }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: remuneracion.periodo.fecha_inicio } }] } } } } },
    });
    for (const item of asignaciones) {
      const configuraciones = item.concepto.configuraciones_m6; let monto: Prisma.Decimal | null = item.valor_aplicable; let referencia = `ASIGNACION:${item.id_asignacion_concepto}`; let motivo: string | null = null;
      if (monto === null) {
        if (configuraciones.length > 1) motivo = 'Configuración ambigua para el período';
        else if (configuraciones.length === 0) motivo = 'No existe un valor determinístico aplicable';
        else {
          const config = configuraciones[0]; referencia = `CONFIGURACION:${config.id_configuracion_concepto}`;
          if (config.modalidad === 'FIJO' && config.valor !== null) monto = config.valor;
          else if (config.modalidad === 'PORCENTAJE') motivo = 'El HABER porcentual no tiene una base de cálculo explícita';
          else if (config.modalidad === 'REGLA') motivo = 'El HABER basado en regla no tiene semántica ejecutable';
          else motivo = 'No existe un valor determinístico aplicable';
        }
      }
      const pendiente = monto === null;
      agregar({ id_concepto: item.id_concepto, tipo: 'HABER_AUTOMATICO', descripcion: item.concepto.nombre_concepto, monto, fuente_tipo: 'AUTOMATICA', clave_negocio: `CONCEPTO:${item.id_concepto}`, referencia_origen: referencia, estado_revision: pendiente ? 'pendiente_valorizacion' : 'aprobado', motivo: pendiente ? motivo : null, revisado_por: pendiente ? null : idUsuario, fecha_revision: pendiente ? null : new Date() });
    }
    const deduccionesRecurrentes = await tx.asignacion_concepto_remuneracion_empleado.findMany({
      where: { id_empleado: remuneracion.id_empleado, vigencia_desde: { lte: remuneracion.periodo.fecha_fin }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: remuneracion.periodo.fecha_inicio } }], concepto: { naturaleza_concepto: 'descuento' } },
      include: { concepto: { include: { configuraciones_m6: { where: { activa: true, vigencia_desde: { lte: remuneracion.periodo.fecha_fin }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: remuneracion.periodo.fecha_inicio } }] } } } } },
    });
    for (const item of deduccionesRecurrentes) {
      const configuraciones = item.concepto.configuraciones_m6; let monto: Prisma.Decimal | null = item.valor_aplicable; let referencia = `ASIGNACION:${item.id_asignacion_concepto}`;
      if (monto === null && configuraciones.length === 1 && configuraciones[0].modalidad === 'FIJO' && configuraciones[0].valor !== null) { monto = configuraciones[0].valor; referencia = `CONFIGURACION:${configuraciones[0].id_configuracion_concepto}`; }
      const pendiente = monto === null || configuraciones.length > 1;
      agregar({ id_concepto: item.id_concepto, tipo: 'DEDUCCION_AUTOMATICA', descripcion: item.concepto.nombre_concepto, monto, fuente_tipo: 'AUTOMATICA', clave_negocio: `DEDUCCION:${item.id_asignacion_concepto}`, referencia_origen: referencia, estado_revision: pendiente ? 'pendiente_valorizacion' : 'aprobado', motivo: configuraciones.length > 1 ? 'Configuración ambigua para el período' : monto === null ? 'La deducción no tiene un valor FIJO determinístico' : null, revisado_por: pendiente ? null : idUsuario, fecha_revision: pendiente ? null : new Date() });
    }
    const hechos = await tx.tratamiento_remuneracional_ejecucion.findMany({ where: { id_empleado: remuneracion.id_empleado, estado_remunerabilidad: 'remunerable', estado_valorizacion: 'valorizado', valor_propuesto: { not: null }, ejecucion: { fecha_ejecucion: { gte: remuneracion.periodo.fecha_inicio, lte: remuneracion.periodo.fecha_fin } } }, include: { ejecucion: true, tarifa: true } });
    for (const hecho of hechos) {
      let monto = hecho.valor_propuesto; let motivo: string | null = null;
      if (hecho.id_tarifa) {
        const tarifa = hecho.tarifa;
        if (!tarifa || tarifa.estado_revision !== 'activa' || tarifa.modalidad !== 'FIJO' || tarifa.valor === null || tarifa.tipo_aplicacion === null) {
          monto = null; motivo = 'La tarifa usada por el tratamiento ya no es determinística';
        } else if (tarifa.tipo_aplicacion === 'por_unidad') {
          if (hecho.ejecucion.cantidad === null || normalizarUnidad(tarifa.unidad) !== normalizarUnidad(hecho.ejecucion.unidad)) {
            monto = null; motivo = 'La tarifa vigente no coincide con la cantidad o unidad del hecho Terreno';
          } else monto = tarifa.valor.mul(hecho.ejecucion.cantidad);
        } else monto = tarifa.valor;
      }
      agregar({ tipo: 'HECHO_TERRENO', descripcion: `Hecho Terreno ${hecho.id_ejecucion_tarea.toString()}`, monto, fuente_tipo: 'AUTOMATICA', clave_negocio: `EJECUCION:${hecho.id_ejecucion_tarea.toString()}`, referencia_origen: `TRATAMIENTO:${hecho.id_tratamiento_remuneracional}`, version_origen: hecho.id_tarifa ? `TARIFA:${hecho.id_tarifa}` : null, fecha_origen: hecho.ejecucion.fecha_ejecucion, estado_revision: monto === null ? 'pendiente_valorizacion' : 'aprobado', motivo, revisado_por: monto === null ? null : idUsuario, fecha_revision: monto === null ? null : new Date() });
    }
    const anticipos = await tx.anticipo_remuneracion.findMany({
      where: { id_empleado: remuneracion.id_empleado, id_periodo_remuneracion: remuneracion.id_periodo_remuneracion, monto_final: { not: null } },
    });
    const pagosAnticipo = await this.repositorioPago.pagosEfectivosAnticipos(tx, anticipos.map(item => item.id_anticipo));
    const anticiposPagados = new Set(pagosAnticipo.map(item => item.idAnticipo));
    for (const anticipo of anticipos.filter(item => anticiposPagados.has(item.id_anticipo))) {
      const pagoAnticipo = pagosAnticipo.find(item => item.idAnticipo === anticipo.id_anticipo)!;
      agregar({ tipo: 'DEDUCCION_AUTOMATICA', descripcion: 'Anticipo efectivamente pagado neto de reversiones', monto: pagoAnticipo.montoEfectivo, fuente_tipo: 'AUTOMATICA', clave_negocio: `ANTICIPO:${anticipo.id_anticipo}`, referencia_origen: `PAGO_ANTICIPO:${pagoAnticipo.idPago}`, estado_revision: 'aprobado', revisado_por: idUsuario, fecha_revision: new Date() });
    }
    await this.sincronizarAutomaticos(tx, idRemuneracion, componentes, ['SUELDO_BASE', 'HABER_AUTOMATICO', 'HECHO_TERRENO', 'DEDUCCION_AUTOMATICA']);
    let baseImponible = new Prisma.Decimal(0);
    const componentesBase = await tx.componente_remuneracion.findMany({ where: { id_remuneracion: idRemuneracion, estado_revision: 'aprobado', monto: { not: null } } });
    for (const item of componentesBase.filter(x => x.direccion !== 'NEGATIVO' && !['DEDUCCION_AUTOMATICA', 'DEDUCCION_PREVISIONAL', 'APORTE_EMPLEADOR_AUTOMATICO', 'IMPUESTO_RENTA'].includes(x.tipo))) baseImponible = baseImponible.add(item.monto!);
    const legal = await calcularPrevisionLegal(tx, { idEmpleado: remuneracion.id_empleado, fechaInicio: remuneracion.periodo.fecha_inicio, fechaFin: remuneracion.periodo.fecha_fin, baseImponible, afp: remuneracion.empleado.afp?.nombre_afp || null, salud: remuneracion.empleado.prevision_salud ? { nombre: remuneracion.empleado.prevision_salud.nombre_prevision_salud, tipo: remuneracion.empleado.prevision_salud.tipo_prevision_salud } : null, seguroCesantia: remuneracion.empleado.seguro_cesantia, fundamentoExclusionCesantia: remuneracion.empleado.seguro_cesantia_fundamento_exclusion });
    const componentesLegales: Prisma.componente_remuneracionCreateManyInput[] = legal.componentes.map(item => ({ id_remuneracion: idRemuneracion, creado_por: idUsuario, tipo: item.tipo, descripcion: item.descripcion, monto: item.monto, fuente_tipo: 'AUTOMATICA', clave_negocio: item.claveNegocio, referencia_origen: item.referenciaOrigen, version_origen: item.versionOrigen, estado_revision: 'aprobado', revisado_por: idUsuario, fecha_revision: new Date() }));
    await this.sincronizarAutomaticos(tx, idRemuneracion, componentesLegales, ['DEDUCCION_PREVISIONAL', 'IMPUESTO_RENTA', 'APORTE_EMPLEADOR_AUTOMATICO']);
    const todos = await tx.componente_remuneracion.findMany({ where: { id_remuneracion: idRemuneracion } });
    let haberes = new Prisma.Decimal(0), deducciones = new Prisma.Decimal(0), aportes = new Prisma.Decimal(0);
    for (const item of todos.filter(x => x.estado_revision === 'aprobado' && x.monto !== null)) {
      if (item.tipo === 'APORTE_EMPLEADOR_AUTOMATICO') aportes = aportes.add(item.monto!);
      else if (item.tipo === 'DEDUCCION_AUTOMATICA' || item.tipo === 'DEDUCCION_PREVISIONAL' || item.tipo === 'IMPUESTO_RENTA' || item.direccion === 'NEGATIVO') deducciones = deducciones.add(item.monto!);
      else haberes = haberes.add(item.monto!);
    }
    const recargada = await tx.remuneracion.findUniqueOrThrow({ where: { id_remuneracion: idRemuneracion }, include: { periodo: true, empleado: true, componentes: { include: { concepto: true } } } });
    const revision = await this.bloqueosRemuneracion(tx, recargada); const liquido = haberes.sub(deducciones);
    if (liquido.isNegative()) revision.bloqueos.push({ codigo: 'LIQUIDO_NEGATIVO', detalle: 'Las deducciones superan los haberes' });
    const otrasDeducciones = deducciones.sub(legal.descuentosPrevisionales).sub(legal.impuesto);
    await tx.remuneracion.update({ where: { id_remuneracion: actual.id_remuneracion }, data: { calculado_en: new Date(), calculado_por: idUsuario, total_haberes: haberes, total_deducciones: deducciones, total_descuentos_previsionales: legal.descuentosPrevisionales, total_impuesto: legal.impuesto, total_otras_deducciones: otrasDeducciones, total_aportes_empleador: aportes, costo_empresa: haberes.add(aportes), snapshot_previsional: legal.snapshot as Prisma.InputJsonValue, base_imponible: legal.baseImponible, base_tributable: legal.baseTributable, liquido_preliminar: revision.bloqueos.length ? null : liquido } });
    return revision;
  }

  async calcularRemuneracion(entrada: Record<string, unknown>, idUsuario: bigint) {
    const idEmpleado = enteroPositivo(entrada.idEmpleado, 'Empleado'); const { fechaInicio, fechaFin } = this.periodoEntrada(entrada.anio, entrada.mes);
    if (!await prisma.relacion_laboral_empleado.count({ where: { id_empleado: idEmpleado, fecha_inicio: { lte: fechaFin }, OR: [{ fecha_termino: null }, { fecha_termino: { gte: fechaInicio } }] } })) throw new ErrorAplicacion(409, 'El empleado no es exigible en el período');
    const contexto = await this.obtenerOCrearContextoRemuneracion(entrada, idUsuario);
    try {
      const revision = await prisma.$transaction(tx => this.calcularEnTransaccion(tx, contexto.id, idUsuario), { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return { remuneracion: await this.obtenerRemuneracion(contexto.id), ...revision };
    } catch (error) { this.conflictoConcurrente(error, 'El cálculo preliminar cambió concurrentemente'); }
  }

  async cerrarRemuneracion(idRemuneracion: number, idUsuario: bigint) {
    try {
      const revision = await prisma.$transaction(async tx => {
        const resultado = await this.calcularEnTransaccion(tx, idRemuneracion, idUsuario);
        if (resultado.bloqueos.length) throw new ErrorAplicacion(409, 'La remuneración mantiene bloqueos de cálculo', 'REMUNERACION_CON_BLOQUEOS');
        const actualizada = await tx.remuneracion.updateMany({ where: { id_remuneracion: idRemuneracion, estado: 'abierta' }, data: { estado: 'cerrada', cerrado_en: new Date(), cerrado_por: idUsuario } });
        if (actualizada.count !== 1) throw new ErrorAplicacion(409, 'La remuneración cambió concurrentemente');
        return resultado;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return { remuneracion: await this.obtenerRemuneracion(idRemuneracion), liquidacion: await this.obtenerLiquidacionRemuneracion(idRemuneracion), ...revision };
    } catch (error) { this.conflictoConcurrente(error, 'El cierre individual cambió concurrentemente'); }
  }

  async obtenerLiquidacionRemuneracion(idRemuneracion: number) {
    const item = await prisma.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: this.incluirRemuneracion });
    if (!item) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
    if (item.estado !== 'cerrada') throw new ErrorAplicacion(409, 'La liquidación sólo se deriva de una remuneración CERRADA');
    return { tipo: 'LIQUIDACION_DERIVADA', documentoGenerado: false, remuneracion: this.presentarRemuneracion(item) };
  }

  async cerrarPeriodoRemuneracion(anioEntrada: unknown, mesEntrada: unknown, idUsuario: bigint) {
    const { anio, mes, fechaInicio, fechaFin } = this.periodoEntrada(anioEntrada, mesEntrada);
    try {
      const idPeriodo = await prisma.$transaction(async tx => {
        const periodo = await tx.periodo_remuneracion.upsert({ where: { anio_mes: { anio, mes } }, create: { anio, mes, fecha_inicio: fechaInicio, fecha_fin: fechaFin }, update: {} });
        if (periodo.cerrado_en) return periodo.id_periodo_remuneracion;
        const exigibles = await this.poblacionExigible(tx, fechaInicio, fechaFin); const ids = exigibles.map(x => x.empleado.id_empleado);
        const actuales = await tx.remuneracion.findMany({ where: { id_periodo_remuneracion: periodo.id_periodo_remuneracion, id_empleado: { in: ids }, estado: { not: 'reemplazada' } } });
        if (actuales.length !== ids.length || actuales.some(x => x.estado !== 'cerrada')) throw new ErrorAplicacion(409, 'Todas las remuneraciones exigibles deben estar CERRADAS');
        const cierre = await tx.periodo_remuneracion.updateMany({ where: { id_periodo_remuneracion: periodo.id_periodo_remuneracion, cerrado_en: null }, data: { cerrado_en: new Date(), cerrado_por: idUsuario } });
        if (cierre.count !== 1) throw new ErrorAplicacion(409, 'El período cambió concurrentemente');
        return periodo.id_periodo_remuneracion;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return { ...(await this.consultarPeriodoRemuneracion(anio, mes)), idPeriodo };
    } catch (error) { this.conflictoConcurrente(error, 'El cierre global cambió concurrentemente'); }
  }

  private async estadoPagoRemuneracion(tx: Prisma.TransactionClient, _idRemuneracion: number) {
    return this.fuentePagoRemuneracion.consultarEstado(tx, _idRemuneracion);
  }

  async solicitarReaperturaRemuneracion(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const motivo = texto(entrada.motivo, 1000); if (!motivo) throw new ErrorAplicacion(400, 'El motivo de reapertura es obligatorio');
    try {
      await prisma.$transaction(async tx => {
        const actual = await tx.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: { periodo: true } });
        if (!actual) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
        if (actual.periodo.cerrado_en) throw new ErrorAplicacion(409, 'La reapertura de un período global cerrado está pendiente de definición', 'PERIODO_CERRADO_REAPERTURA_PENDIENTE_DE_DEFINICION');
        if (actual.estado !== 'cerrada' || actual.reapertura_solicitada_en) throw new ErrorAplicacion(409, 'Sólo una remuneración CERRADA sin solicitud vigente puede solicitar reapertura');
        if ((await this.estadoPagoRemuneracion(tx, idRemuneracion)).tienePago) throw new ErrorAplicacion(409, 'La remuneración ya tiene pago registrado');
        await tx.remuneracion.update({ where: { id_remuneracion: idRemuneracion }, data: { reapertura_solicitada_en: new Date(), reapertura_solicitada_por: idUsuario, reapertura_motivo: motivo } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRemuneracion(idRemuneracion);
    } catch (error) { this.conflictoConcurrente(error, 'La solicitud de reapertura cambió concurrentemente'); }
  }

  async aprobarReaperturaRemuneracion(idRemuneracion: number, idUsuario: bigint) {
    try {
      const nuevoId = await prisma.$transaction(async tx => {
        const actual = await tx.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: { periodo: true } });
        if (!actual) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
        if (actual.periodo.cerrado_en) throw new ErrorAplicacion(409, 'La reapertura de un período global cerrado está pendiente de definición', 'PERIODO_CERRADO_REAPERTURA_PENDIENTE_DE_DEFINICION');
        if (actual.estado !== 'cerrada' || !actual.reapertura_solicitada_en || !actual.reapertura_solicitada_por) throw new ErrorAplicacion(409, 'No existe una solicitud de reapertura aprobable');
        if (actual.reapertura_solicitada_por === idUsuario) throw new ErrorAplicacion(409, 'El aprobador debe ser distinto del solicitante');
        if ((await this.estadoPagoRemuneracion(tx, idRemuneracion)).tienePago) throw new ErrorAplicacion(409, 'La remuneración ya tiene pago registrado');
        const cambio = await tx.remuneracion.updateMany({ where: { id_remuneracion: idRemuneracion, estado: 'cerrada', reapertura_aprobada_en: null }, data: { estado: 'reemplazada', reapertura_aprobada_en: new Date(), reapertura_aprobada_por: idUsuario } });
        if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La reapertura cambió concurrentemente');
        const nueva = await tx.remuneracion.create({ data: { id_periodo_remuneracion: actual.id_periodo_remuneracion, id_empleado: actual.id_empleado, reemplaza_a_id: actual.id_remuneracion, creado_por: idUsuario } });
        return nueva.id_remuneracion;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRemuneracion(nuevoId);
    } catch (error) { this.conflictoConcurrente(error, 'La reapertura cambió concurrentemente'); }
  }

  async proponerComponenteExcepcional(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const modalidad = texto(entrada.modalidad || 'MONTO', 30).toUpperCase(); const descripcion = texto(entrada.descripcion, 1000);
    if (!descripcion || !['MONTO', 'REGLA_TEMPORAL'].includes(modalidad)) throw new ErrorAplicacion(400, 'Descripción y modalidad válida son obligatorias');
    const monto = modalidad === 'MONTO' ? decimalMonetario(entrada.monto, 'Monto', true) : null;
    const referencia = texto(entrada.referenciaOrigen, 200) || null;
    if (modalidad === 'REGLA_TEMPORAL' && !referencia) throw new ErrorAplicacion(400, 'La regla temporal requiere una referencia controlada');
    try {
      await prisma.$transaction(async (tx) => {
        await this.remuneracionAbierta(tx, idRemuneracion);
        await tx.componente_remuneracion.create({ data: { id_remuneracion: idRemuneracion, tipo: 'EXCEPCIONAL_POSITIVO', modalidad, descripcion, monto, fuente_tipo: modalidad === 'MONTO' ? 'MANUAL' : 'REGLA_TEMPORAL', referencia_origen: referencia, estado_revision: modalidad === 'MONTO' ? 'propuesto' : 'pendiente_valorizacion', motivo: texto(entrada.motivo, 1000) || null, creado_por: idUsuario } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRemuneracion(idRemuneracion);
    } catch (error) { this.conflictoConcurrente(error, 'El componente excepcional cambió concurrentemente'); }
  }

  private async resolverComponente(idComponente: number, tipos: string[], entrada: Record<string, unknown>, idUsuario: bigint, resolverGrupo = false) {
    const decision = texto(entrada.decision, 20).toLowerCase(); const motivo = texto(entrada.motivo, 1000) || null;
    if (!['aprobar', 'rechazar'].includes(decision)) throw new ErrorAplicacion(400, 'La decisión debe ser aprobar o rechazar');
    if (decision === 'rechazar' && !motivo) throw new ErrorAplicacion(400, 'El rechazo requiere motivo');
    try {
      const idRemuneracion = await prisma.$transaction(async (tx) => {
        const actual = await tx.componente_remuneracion.findUnique({ where: { id_componente_remuneracion: idComponente }, include: { remuneracion: { include: { periodo: true } } } });
        if (!actual || !tipos.includes(actual.tipo)) throw new ErrorAplicacion(404, 'Componente no encontrado');
        if (actual.remuneracion.estado !== 'abierta') throw new ErrorAplicacion(409, 'La remuneración no está ABIERTA');
        if (actual.remuneracion.periodo.cerrado_en) throw new ErrorAplicacion(409, 'El período global está CERRADO');
        if (!['propuesto', 'conflicto', 'pendiente_valorizacion'].includes(actual.estado_revision)) throw new ErrorAplicacion(409, 'El componente ya fue resuelto');
        if (decision === 'aprobar' && actual.estado_revision === 'pendiente_valorizacion') throw new ErrorAplicacion(409, 'El componente aún está pendiente de valorización');
        if (decision === 'aprobar' && actual.estado_revision === 'conflicto' && !motivo) throw new ErrorAplicacion(400, 'La resolución del conflicto requiere fundamento');
        const actualizado = await tx.componente_remuneracion.updateMany({ where: { id_componente_remuneracion: idComponente, estado_revision: actual.estado_revision }, data: { estado_revision: decision === 'aprobar' ? 'aprobado' : 'rechazado', motivo, revisado_por: idUsuario, fecha_revision: new Date() } });
        if (actualizado.count !== 1) throw new ErrorAplicacion(409, 'El componente cambió concurrentemente');
        if (decision === 'aprobar' && resolverGrupo && actual.clave_negocio) {
          await tx.componente_remuneracion.updateMany({ where: { id_remuneracion: actual.id_remuneracion, tipo: actual.tipo, clave_negocio: actual.clave_negocio, id_componente_remuneracion: { not: idComponente }, estado_revision: { in: ['propuesto', 'conflicto'] } }, data: { estado_revision: 'rechazado', motivo: motivo || 'Descartado al resolver el conflicto', revisado_por: idUsuario, fecha_revision: new Date() } });
          await tx.componente_remuneracion.updateMany({ where: { id_remuneracion: actual.id_remuneracion, tipo: actual.tipo, clave_negocio: actual.clave_negocio, id_componente_remuneracion: { not: idComponente }, estado_revision: 'aprobado' }, data: { estado_revision: 'reemplazado' } });
        }
        return actual.id_remuneracion;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRemuneracion(idRemuneracion);
    } catch (error) { this.conflictoConcurrente(error, 'El componente cambió concurrentemente'); }
  }

  async resolverComponenteExcepcional(idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    return this.resolverComponente(idComponente, ['EXCEPCIONAL_POSITIVO'], entrada, idUsuario);
  }

  async proponerVariableRemuneracion(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const clase = texto(entrada.clase, 30).toUpperCase(); const tipo = clase === 'ADMINISTRATIVA' ? 'VARIABLE_ADMINISTRATIVA' : clase === 'COMERCIAL' ? 'VARIABLE_COMERCIAL' : '';
    const fuente = texto(entrada.fuenteTipo || 'MANUAL', 30).toUpperCase(); const clave = texto(entrada.claveNegocio, 120).toUpperCase(); const descripcion = texto(entrada.descripcion, 1000);
    if (!tipo || !['MANUAL', 'AUTOMATICA'].includes(fuente) || !clave || !descripcion) throw new ErrorAplicacion(400, 'Clase, fuente, clave y descripción válidas son obligatorias');
    const monto = decimalMonetario(entrada.monto, 'Monto'); const fechaOrigen = fechaEntrada(entrada.fechaOrigen, 'Fecha de origen', false);
    try {
      await prisma.$transaction(async (tx) => {
        await this.remuneracionAbierta(tx, idRemuneracion);
        const previos = await tx.componente_remuneracion.findMany({ where: { id_remuneracion: idRemuneracion, tipo, clave_negocio: clave, estado_revision: { in: ['propuesto', 'aprobado', 'conflicto'] } } });
        if (previos.some((item) => item.fuente_tipo === fuente && item.monto?.equals(monto))) throw new ErrorAplicacion(409, 'La variable ya fue registrada');
        if (previos.length) await tx.componente_remuneracion.updateMany({ where: { id_componente_remuneracion: { in: previos.filter((item) => item.estado_revision !== 'aprobado').map((item) => item.id_componente_remuneracion) } }, data: { estado_revision: 'conflicto' } });
        await tx.componente_remuneracion.create({ data: { id_remuneracion: idRemuneracion, tipo, descripcion, monto, fuente_tipo: fuente, clave_negocio: clave, referencia_origen: texto(entrada.referenciaOrigen, 200) || null, version_origen: texto(entrada.versionOrigen, 100) || null, fecha_origen: fechaOrigen, estado_revision: previos.length ? 'conflicto' : 'propuesto', motivo: texto(entrada.motivo, 1000) || null, id_componente_origen: previos[0]?.id_componente_remuneracion, tipo_relacion: previos.length ? 'CANDIDATO_CONFLICTO' : null, creado_por: idUsuario } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRemuneracion(idRemuneracion);
    } catch (error) { this.conflictoConcurrente(error, 'La variable cambió concurrentemente'); }
  }

  async resolverVariableRemuneracion(idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    return this.resolverComponente(idComponente, ['VARIABLE_ADMINISTRATIVA', 'VARIABLE_COMERCIAL'], entrada, idUsuario, true);
  }

  async registrarValorExterno(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const fuente = texto(entrada.fuenteTipo, 30).toUpperCase(); const referencia = texto(entrada.referenciaOrigen, 200); const version = texto(entrada.versionOrigen, 100); const clave = texto(entrada.claveNegocio, 120).toUpperCase(); const descripcion = texto(entrada.descripcion, 1000);
    if (!fuente || !referencia || !version || !clave || !descripcion) throw new ErrorAplicacion(400, 'Fuente, referencia, versión, clave y descripción son obligatorias');
    const monto = decimalMonetario(entrada.monto, 'Monto'); const fechaOrigen = fechaEntrada(entrada.fechaOrigen, 'Fecha de origen')!;
    try {
      await prisma.$transaction(async (tx) => {
        await this.remuneracionAbierta(tx, idRemuneracion);
        const previos = await tx.componente_remuneracion.findMany({ where: { id_remuneracion: idRemuneracion, tipo: 'VALOR_EXTERNO', clave_negocio: clave, estado_revision: { in: ['propuesto', 'aprobado', 'conflicto'] } }, orderBy: { creado_en: 'desc' } });
        if (previos.length) await tx.componente_remuneracion.updateMany({ where: { id_componente_remuneracion: { in: previos.filter((item) => item.estado_revision !== 'aprobado').map((item) => item.id_componente_remuneracion) } }, data: { estado_revision: 'conflicto' } });
        await tx.componente_remuneracion.create({ data: { id_remuneracion: idRemuneracion, tipo: 'VALOR_EXTERNO', descripcion, monto, fuente_tipo: fuente, clave_negocio: clave, referencia_origen: referencia, version_origen: version, fecha_origen: fechaOrigen, estado_revision: previos.length ? 'conflicto' : 'propuesto', id_componente_origen: previos[0]?.id_componente_remuneracion, tipo_relacion: previos.length ? 'NUEVA_VERSION' : null, creado_por: idUsuario } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRemuneracion(idRemuneracion);
    } catch (error) { this.conflictoConcurrente(error, 'El valor externo cambió concurrentemente'); }
  }

  async proponerAjusteManual(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const idOrigen = enteroPositivo(entrada.idComponenteOrigen, 'Componente de origen'); const direccion = texto(entrada.direccion, 20).toUpperCase(); const descripcion = texto(entrada.descripcion, 1000); const motivo = texto(entrada.motivo, 1000);
    if (!['POSITIVO', 'NEGATIVO'].includes(direccion) || !descripcion || !motivo) throw new ErrorAplicacion(400, 'Dirección, descripción y motivo son obligatorios');
    const monto = decimalMonetario(entrada.monto, 'Monto del ajuste', true);
    try {
      await prisma.$transaction(async (tx) => {
        await this.remuneracionAbierta(tx, idRemuneracion);
        const origen = await tx.componente_remuneracion.findUnique({ where: { id_componente_remuneracion: idOrigen } });
        if (!origen || origen.id_remuneracion !== idRemuneracion || origen.tipo !== 'VALOR_EXTERNO') throw new ErrorAplicacion(404, 'Valor externo de origen no encontrado');
        await tx.componente_remuneracion.create({ data: { id_remuneracion: idRemuneracion, tipo: 'AJUSTE_MANUAL', descripcion, monto, direccion, fuente_tipo: 'MANUAL', clave_negocio: origen.clave_negocio, estado_revision: 'propuesto', motivo, id_componente_origen: idOrigen, tipo_relacion: 'AJUSTA', creado_por: idUsuario } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRemuneracion(idRemuneracion);
    } catch (error) { this.conflictoConcurrente(error, 'El ajuste cambió concurrentemente'); }
  }

  async resolverValorOAjuste(idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const actual = await prisma.componente_remuneracion.findUnique({ where: { id_componente_remuneracion: idComponente }, select: { tipo: true } });
    if (!actual || !['VALOR_EXTERNO', 'AJUSTE_MANUAL'].includes(actual.tipo)) throw new ErrorAplicacion(404, 'Valor externo o ajuste no encontrado');
    return this.resolverComponente(idComponente, [actual.tipo], entrada, idUsuario, actual.tipo === 'VALOR_EXTERNO');
  }

  async obtenerContextoProrrateo(idRemuneracion: number) {
    const remuneracion = await prisma.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: { periodo: true, empleado: { include: { relaciones_laborales: { orderBy: { fecha_inicio: 'asc' } } } }, componentes: { where: { tipo: 'PRORRATEO' }, include: { concepto: true }, orderBy: { creado_en: 'asc' } } } });
    if (!remuneracion) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
    const parametros = await prisma.parametro_remuneracional.findMany({ where: { tipo: 'PRORRATEO', estado: { not: 'inactivo' }, vigencia_desde: { lte: remuneracion.periodo.fecha_fin }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: remuneracion.periodo.fecha_inicio } }] }, orderBy: { vigencia_desde: 'desc' } });
    const relaciones = remuneracion.empleado.relaciones_laborales.filter((item) => item.fecha_inicio <= remuneracion.periodo.fecha_fin && (!item.fecha_termino || item.fecha_termino >= remuneracion.periodo.fecha_inicio));
    return { remuneracion: await this.obtenerRemuneracion(idRemuneracion), configuracion: parametros.length === 1 ? this.presentarParametro(parametros[0]) : null, estadoPropuesta: parametros.length === 0 ? 'sin_configuracion' : parametros.length > 1 ? 'conflicto_configuracion' : 'pendiente_formula', montoCalculado: null, relacionesLaborales: relaciones.map((item) => ({ id: item.id_relacion_laboral_empleado, fechaInicio: item.fecha_inicio, fechaTermino: item.fecha_termino, estado: item.estado })) };
  }

  async proponerProrrateoIndividual(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const monto = decimalMonetario(entrada.monto, 'Monto propuesto'); const fundamento = texto(entrada.fundamento, 1000);
    if (!fundamento) throw new ErrorAplicacion(400, 'El fundamento es obligatorio');
    try {
      await prisma.$transaction(async (tx) => {
        const remuneracion = await this.remuneracionAbierta(tx, idRemuneracion);
        const parametros = await tx.parametro_remuneracional.findMany({ where: { tipo: 'PRORRATEO', estado: { not: 'inactivo' }, vigencia_desde: { lte: remuneracion.periodo.fecha_fin }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: remuneracion.periodo.fecha_inicio } }] } });
        await tx.componente_remuneracion.create({ data: { id_remuneracion: idRemuneracion, tipo: 'PRORRATEO', descripcion: 'Excepción individual de prorrateo', monto, fuente_tipo: 'EXCEPCION_INDIVIDUAL', referencia_origen: parametros.length === 1 ? `PARAMETRO:${parametros[0].id_parametro_remuneracional}` : null, estado_revision: 'propuesto', motivo: fundamento, creado_por: idUsuario } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerContextoProrrateo(idRemuneracion);
    } catch (error) { this.conflictoConcurrente(error, 'La propuesta de prorrateo cambió concurrentemente'); }
  }

  async resolverProrrateoIndividual(idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    return this.resolverComponente(idComponente, ['PRORRATEO'], entrada, idUsuario);
  }

  private claveIdempotencia(valor: unknown) {
    const clave = texto(valor, 100);
    if (!clave) throw new ErrorAplicacion(400, 'La clave de idempotencia es obligatoria');
    return clave;
  }

  async crearAjustePosterior(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const direccion = texto(entrada.direccion, 20).toUpperCase();
    const monto = decimalMonetario(entrada.monto, 'Monto del ajuste posterior', true);
    const motivo = texto(entrada.motivo, 1000);
    const fechaHallazgo = fechaEntrada(entrada.fechaHallazgo, 'Fecha del hallazgo')!;
    const clave = this.claveIdempotencia(entrada.claveIdempotencia);
    const motivoTratamiento = texto(entrada.motivoTratamientoPosterior, 1000) || null;
    if (!['POSITIVO', 'NEGATIVO'].includes(direccion) || !motivo) throw new ErrorAplicacion(400, 'Dirección y motivo son obligatorios');
    try {
      const id = await prisma.$transaction(async tx => {
        const existente = await tx.ajuste_posterior_remuneracion.findUnique({ where: { clave_idempotencia: clave } });
        if (existente) return existente.id_ajuste_posterior;
        const remuneracion = await tx.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: { periodo: true } });
        if (!remuneracion) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
        if (remuneracion.estado !== 'cerrada') throw new ErrorAplicacion(409, 'El ajuste posterior exige una remuneración oficial CERRADA');
        const pago = await this.estadoPagoRemuneracion(tx, idRemuneracion);
        if (!pago.tienePago && !motivoTratamiento) throw new ErrorAplicacion(409, 'La remuneración cerrada no pagada debe corregirse por CU182 o justificar su tratamiento posterior', 'REMUNERACION_CERRADA_NO_PAGADA');
        const hoy = new Date();
        const relacionActual = await tx.relacion_laboral_empleado.count({ where: { id_empleado: remuneracion.id_empleado, fecha_inicio: { lte: hoy }, OR: [{ fecha_termino: null }, { fecha_termino: { gte: hoy } }] } });
        const resolucionHumana = direccion === 'NEGATIVO' && relacionActual === 0;
        const ajuste = await tx.ajuste_posterior_remuneracion.create({ data: {
          id_remuneracion: idRemuneracion, id_empleado: remuneracion.id_empleado,
          id_periodo_origen: remuneracion.id_periodo_remuneracion, fecha_hallazgo: fechaHallazgo,
          monto, direccion, motivo, clave_idempotencia: clave, motivo_tratamiento: motivoTratamiento,
          tratamiento: resolucionHumana ? 'RESOLUCION_HUMANA' : 'PENDIENTE',
          requiere_resolucion_humana: resolucionHumana, creado_por: idUsuario,
        } });
        return ajuste.id_ajuste_posterior;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerAjustePosterior(id);
    } catch (error) { this.conflictoConcurrente(error, 'El ajuste posterior cambió concurrentemente'); }
  }

  async obtenerAjustePosterior(idAjuste: number) {
    const ajuste = await prisma.ajuste_posterior_remuneracion.findUnique({ where: { id_ajuste_posterior: idAjuste }, include: { regularizacion: true } });
    if (!ajuste) throw new ErrorAplicacion(404, 'Ajuste posterior no encontrado');
    return { id: ajuste.id_ajuste_posterior, idRemuneracion: ajuste.id_remuneracion, idEmpleado: ajuste.id_empleado, idPeriodoOrigen: ajuste.id_periodo_origen, fechaHallazgo: ajuste.fecha_hallazgo, monto: Number(ajuste.monto), direccion: ajuste.direccion, motivo: ajuste.motivo, tratamiento: ajuste.tratamiento, idPeriodoAplicable: ajuste.id_periodo_aplicable, estado: ajuste.estado, motivoTratamiento: ajuste.motivo_tratamiento, requiereResolucionHumana: ajuste.requiere_resolucion_humana, postergadoEn: ajuste.postergado_en, regularizacion: ajuste.regularizacion ? { id: ajuste.regularizacion.id_regularizacion, monto: Number(ajuste.regularizacion.monto), motivo: ajuste.regularizacion.motivo, estado: ajuste.regularizacion.estado, cerradoEn: ajuste.regularizacion.cerrado_en } : null };
  }

  async postergarAjustePosterior(idAjuste: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const motivo = texto(entrada.motivo, 1000); if (!motivo) throw new ErrorAplicacion(400, 'El motivo de postergación es obligatorio');
    const { anio, mes, fechaInicio, fechaFin } = this.periodoEntrada(entrada.anio, entrada.mes);
    try {
      await prisma.$transaction(async tx => {
        const periodo = await tx.periodo_remuneracion.upsert({ where: { anio_mes: { anio, mes } }, create: { anio, mes, fecha_inicio: fechaInicio, fecha_fin: fechaFin }, update: {} });
        const cambio = await tx.ajuste_posterior_remuneracion.updateMany({ where: { id_ajuste_posterior: idAjuste, postergado_en: null }, data: { tratamiento: 'POSTERGADO', id_periodo_aplicable: periodo.id_periodo_remuneracion, motivo_tratamiento: motivo, postergado_por: idUsuario, postergado_en: new Date() } });
        if (cambio.count !== 1) throw new ErrorAplicacion(409, 'El ajuste ya fue postergado o cambió concurrentemente');
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerAjustePosterior(idAjuste);
    } catch (error) { this.conflictoConcurrente(error, 'La postergación cambió concurrentemente'); }
  }

  async crearRegularizacionExtraordinaria(idAjuste: number, idUsuario: bigint) {
    try {
      const id = await prisma.$transaction(async tx => {
        const ajuste = await tx.ajuste_posterior_remuneracion.findUnique({ where: { id_ajuste_posterior: idAjuste }, include: { regularizacion: true } });
        if (!ajuste) throw new ErrorAplicacion(404, 'Ajuste posterior no encontrado');
        if (ajuste.direccion !== 'POSITIVO') throw new ErrorAplicacion(409, 'Sólo un ajuste POSITIVO puede originar una regularización');
        if (ajuste.regularizacion) return ajuste.regularizacion.id_regularizacion;
        const regularizacion = await tx.regularizacion_extraordinaria.create({ data: { id_ajuste_posterior: idAjuste, monto: ajuste.monto, motivo: ajuste.motivo, creado_por: idUsuario } });
        await tx.ajuste_posterior_remuneracion.update({ where: { id_ajuste_posterior: idAjuste }, data: { tratamiento: 'REGULARIZACION' } });
        return regularizacion.id_regularizacion;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRegularizacion(id);
    } catch (error) { this.conflictoConcurrente(error, 'La regularización cambió concurrentemente'); }
  }

  async obtenerRegularizacion(idRegularizacion: number) {
    const item = await prisma.regularizacion_extraordinaria.findUnique({ where: { id_regularizacion: idRegularizacion }, include: { ajuste: true } });
    if (!item) throw new ErrorAplicacion(404, 'Regularización no encontrada');
    const pagada = await this.repositorioPago.tienePagoEfectivo(prisma, this.repositorioPago.regularizacion(idRegularizacion));
    return { id: item.id_regularizacion, idAjustePosterior: item.id_ajuste_posterior, idRemuneracion: item.ajuste.id_remuneracion, idEmpleado: item.ajuste.id_empleado, idPeriodoOrigen: item.ajuste.id_periodo_origen, monto: Number(item.monto), motivo: item.motivo, estado: item.estado, cerradoEn: item.cerrado_en, pagada };
  }

  async actualizarRegularizacion(idRegularizacion: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const monto = decimalMonetario(entrada.monto, 'Monto de regularización', true); const motivo = texto(entrada.motivo, 1000);
    if (!motivo) throw new ErrorAplicacion(400, 'El motivo es obligatorio');
    try {
      await prisma.$transaction(async tx => {
        if (await this.repositorioPago.tienePagoEfectivo(tx, this.repositorioPago.regularizacion(idRegularizacion))) throw new ErrorAplicacion(409, 'La regularización pagada es inmutable');
        const cambio = await tx.regularizacion_extraordinaria.updateMany({ where: { id_regularizacion: idRegularizacion, estado: 'ABIERTA' }, data: { monto, motivo, actualizado_por: idUsuario, actualizado_en: new Date() } });
        if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La regularización no está editable');
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerRegularizacion(idRegularizacion);
    } catch (error) { this.conflictoConcurrente(error, 'La regularización cambió concurrentemente'); }
  }

  async cerrarRegularizacion(idRegularizacion: number, idUsuario: bigint) {
    const cambio = await prisma.regularizacion_extraordinaria.updateMany({ where: { id_regularizacion: idRegularizacion, estado: 'ABIERTA', monto: { gt: 0 } }, data: { estado: 'CERRADA', cerrado_por: idUsuario, cerrado_en: new Date() } });
    if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La regularización no puede cerrarse');
    return this.obtenerRegularizacion(idRegularizacion);
  }

  async registrarAnticipo(entrada: Record<string, unknown>, idUsuario: bigint) {
    const idEmpleado = enteroPositivo(entrada.idEmpleado, 'Empleado'); const modalidad = texto(entrada.modalidad, 20).toUpperCase();
    if (!['MONTO', 'PORCENTAJE'].includes(modalidad)) throw new ErrorAplicacion(400, 'Modalidad inválida');
    const valor = decimalMonetario(entrada.valor, 'Valor del anticipo', true); const clave = this.claveIdempotencia(entrada.claveIdempotencia);
    const codigoBase = modalidad === 'PORCENTAJE' ? texto(entrada.codigoBasePorcentaje, 50).toUpperCase() || null : null;
    const { anio, mes, fechaInicio, fechaFin } = this.periodoEntrada(entrada.anio, entrada.mes);
    try {
      const id = await prisma.$transaction(async tx => {
        const existente = await tx.anticipo_remuneracion.findUnique({ where: { clave_idempotencia: clave } }); if (existente) return existente.id_anticipo;
        if (!await tx.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
        const periodo = await tx.periodo_remuneracion.upsert({ where: { anio_mes: { anio, mes } }, create: { anio, mes, fecha_inicio: fechaInicio, fecha_fin: fechaFin }, update: {} });
        if (periodo.cerrado_en) throw new ErrorAplicacion(409, 'El período global está CERRADO');
        const cerrada = await tx.remuneracion.count({ where: { id_periodo_remuneracion: periodo.id_periodo_remuneracion, id_empleado: idEmpleado, estado: 'cerrada' } });
        if (cerrada) throw new ErrorAplicacion(409, 'La remuneración del período ya está CERRADA', 'REMUNERACION_CERRADA_ANTICIPO');
        // CU167 no define una semántica de parámetro para la base porcentual del anticipo.
        // El código se conserva como antecedente, pero no se ejecuta una fórmula hasta contar con esa configuración explícita.
        const montoFinal: Prisma.Decimal | null = modalidad === 'MONTO' ? valor : null;
        const anticipo = await tx.anticipo_remuneracion.create({ data: { id_empleado: idEmpleado, id_periodo_remuneracion: periodo.id_periodo_remuneracion, modalidad, valor_ingresado: valor, codigo_base_porcentaje: codigoBase, monto_final: montoFinal, estado_valorizacion: montoFinal ? 'VALORIZADO' : 'PENDIENTE_VALORIZACION', clave_idempotencia: clave, creado_por: idUsuario } });
        return anticipo.id_anticipo;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerAnticipo(id);
    } catch (error) { this.conflictoConcurrente(error, 'El anticipo cambió concurrentemente'); }
  }

  async obtenerAnticipo(idAnticipo: number) {
    const item = await prisma.anticipo_remuneracion.findUnique({ where: { id_anticipo: idAnticipo }, include: { empleado: true, periodo: true } });
    if (!item) throw new ErrorAplicacion(404, 'Anticipo no encontrado');
    const pago = await this.repositorioPago.buscarPagoEfectivo(prisma, this.repositorioPago.anticipo(idAnticipo));
    return { id: item.id_anticipo, empleado: { id: item.id_empleado, nombre: nombreCompleto(item.empleado) }, periodo: { id: item.id_periodo_remuneracion, anio: item.periodo.anio, mes: item.periodo.mes }, modalidad: item.modalidad, valorIngresado: Number(item.valor_ingresado), codigoBasePorcentaje: item.codigo_base_porcentaje, montoFinal: item.monto_final === null ? null : Number(item.monto_final), estadoValorizacion: item.estado_valorizacion, pagado: Boolean(pago) };
  }

  private async montoPagableOriginal(tx: Prisma.TransactionClient, origen: OrigenPagoRemuneracion) {
    if (origen.clase === 'remuneracion') {
      const item = await tx.remuneracion.findUnique({ where: { id_remuneracion: origen.id }, include: { periodo: true } });
      if (!item) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
      if (item.estado !== 'cerrada') throw new ErrorAplicacion(409, 'Sólo puede pagarse una remuneración CERRADA y actual');
      if (item.liquido_preliminar === null || item.liquido_preliminar.lte(0)) throw new ErrorAplicacion(409, 'La remuneración no tiene saldo positivo pagable');
      return item.liquido_preliminar;
    }
    if (origen.clase === 'regularizacion') {
      const item = await tx.regularizacion_extraordinaria.findUnique({ where: { id_regularizacion: origen.id } });
      if (!item) throw new ErrorAplicacion(404, 'Regularización no encontrada');
      if (item.estado !== 'CERRADA' || item.monto.lte(0)) throw new ErrorAplicacion(409, 'Sólo puede pagarse una regularización CERRADA y positiva');
      return item.monto;
    }
    if (origen.clase === 'anticipo') {
      const item = await tx.anticipo_remuneracion.findUnique({ where: { id_anticipo: origen.id }, include: { periodo: true } });
      if (!item) throw new ErrorAplicacion(404, 'Anticipo no encontrado');
      if (item.monto_final === null || item.estado_valorizacion !== 'VALORIZADO') throw new ErrorAplicacion(409, 'El anticipo está PENDIENTE DE VALORIZACIÓN');
      if (item.periodo.cerrado_en) throw new ErrorAplicacion(409, 'El período global está CERRADO');
      if (await tx.remuneracion.count({ where: { id_periodo_remuneracion: item.id_periodo_remuneracion, id_empleado: item.id_empleado, estado: 'cerrada' } })) throw new ErrorAplicacion(409, 'La remuneración del período ya está CERRADA', 'REMUNERACION_CERRADA_ANTICIPO');
      return item.monto_final;
    }
    if (origen.clase === 'boleta_honorarios') {
      const item = await tx.boleta_honorarios.findUnique({ where: { id_boleta_honorarios: origen.id }, include: { prestador: true } });
      if (!item) throw new ErrorAplicacion(404, 'Boleta de honorarios no encontrada');
      if (item.estado_documental !== 'CONFIRMADA' || item.liquido === null || item.retencion === null || item.tasa_aplicada === null || item.bruto.lte(0) || !item.bruto.equals(item.liquido.plus(item.retencion)) || !item.prestador.identificador.trim()) throw new ErrorAplicacion(409, 'La boleta no está CONFIRMADA con antecedentes económicos coherentes');
      return item.liquido;
    }
    throw new ErrorAplicacion(400, 'Origen de pago inválido');
  }

  private presentarPago(item: any) {
    const origen = this.repositorioPago.origenDesdePago(item);
    const reversiones = item.reversiones || [];
    const totalRevertido = reversiones.reduce((suma: Prisma.Decimal, reversion: any) => suma.plus(reversion.monto), new Prisma.Decimal(0));
    const montoEfectivo = item.estado === 'CONFIRMADO' ? item.monto.minus(totalRevertido) : new Prisma.Decimal(0);
    return { id: item.id_pago_remuneracion, origenTipo: this.repositorioPago.tipoPublico(origen), origenId: origen.id, monto: Number(item.monto), medio: item.medio_pago ? { id: item.medio_pago.id_medio_pago, codigo: item.medio_pago.codigo_medio_pago, nombre: item.medio_pago.nombre_medio_pago } : null, respaldo: item.respaldo, referencia: item.referencia, estado: item.estado, creadoPor: item.creado_por.toString(), creadoEn: item.creado_en, confirmadoPor: item.confirmado_por?.toString() || null, confirmadoEn: item.confirmado_en, motivoAnulacion: item.motivo_anulacion, anuladoPor: item.anulado_por?.toString() || null, anuladoEn: item.anulado_en, reversiones: reversiones.map((r: any) => ({ id: r.id_reversion_pago_remuneracion, monto: Number(r.monto), motivo: r.motivo, registradoPor: r.registrado_por.toString(), registradoEn: r.registrado_en })), totalRevertido: Number(totalRevertido), montoEfectivo: Number(montoEfectivo) };
  }

  private async prepararPagoRemuneracion(origen: OrigenPagoRemuneracion, entrada: Record<string, unknown>, idUsuario: bigint) {
    const monto = decimalMonetario(entrada.monto, 'Monto del pago', true); const idMedio = enteroPositivo(entrada.idMedioPago, 'Medio de pago'); const clave = this.claveIdempotencia(entrada.claveIdempotencia);
    const respaldo = texto(entrada.respaldo, 2000) || null; const referencia = texto(entrada.referencia, 200) || null;
    try {
      const id = await prisma.$transaction(async tx => {
        const existente = await this.repositorioPago.buscarPorClave(tx, clave); if (existente) return existente.id_pago_remuneracion;
        await this.montoPagableOriginal(tx, origen);
        const medio = await tx.medio_pago.findUnique({ where: { id_medio_pago: idMedio } });
        if (!medio || medio.estado_medio_pago !== 'activo' || !medio.codigo_medio_pago || medio.requiere_respaldo === null) throw new ErrorAplicacion(409, 'El medio de pago no tiene configuración M6 válida');
        if (medio.requiere_respaldo && !respaldo) throw new ErrorAplicacion(400, 'El medio de pago exige respaldo');
        const pago = await this.repositorioPago.crearPreparado(tx, origen, { monto, idMedioPago: idMedio, respaldo, referencia, claveIdempotencia: clave, creadoPor: idUsuario });
        return pago.id_pago_remuneracion;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerPagoRemuneracion(id);
    } catch (error) { this.conflictoConcurrente(error, 'La preparación del pago cambió concurrentemente'); }
  }

  async obtenerPagoRemuneracion(idPago: number) {
    const item = await this.repositorioPago.obtener(prisma, idPago, true);
    if (!item) throw new ErrorAplicacion(404, 'Pago de remuneración no encontrado');
    const presentado = this.presentarPago(item);
    const origen = await this.resumenOrigenPago(this.repositorioPago.origenDesdePago(item));
    const usuariosIds = [item.creado_por, item.confirmado_por, item.anulado_por, ...(item.reversiones || []).map((r: any) => r.registrado_por)].filter((id): id is bigint => id !== null);
    const usuarios = await prisma.usuario.findMany({ where: { usuario_id_usuario: { in: usuariosIds } } });
    const nombres = new Map(usuarios.map(usuario => [usuario.usuario_id_usuario.toString(), usuario.usuario_nombre_completo_primer_nombre_usuario || usuario.usuario_username]));
    return { ...presentado, origen, actores: { creador: nombres.get(item.creado_por.toString()) || null, confirmador: item.confirmado_por ? nombres.get(item.confirmado_por.toString()) || null : null, anulador: item.anulado_por ? nombres.get(item.anulado_por.toString()) || null : null }, reversiones: presentado.reversiones.map((r: any) => ({ ...r, usuario: nombres.get(r.registradoPor) || null })) };
  }

  private async resumenOrigenPago(origen: OrigenPagoRemuneracion) {
    if (origen.clase === 'remuneracion') { const item = await prisma.remuneracion.findUnique({ where: { id_remuneracion: origen.id }, include: { empleado: true, periodo: true } }); return item ? { tipo: 'REMUNERACION', id: origen.id, descripcion: `${nombreCompleto(item.empleado)} · ${item.periodo.mes}/${item.periodo.anio}` } : null; }
    if (origen.clase === 'anticipo') { const item = await prisma.anticipo_remuneracion.findUnique({ where: { id_anticipo: origen.id }, include: { empleado: true, periodo: true } }); return item ? { tipo: 'ANTICIPO', id: origen.id, descripcion: `${nombreCompleto(item.empleado)} · ${item.periodo.mes}/${item.periodo.anio}` } : null; }
    if (origen.clase === 'regularizacion') { const item = await prisma.regularizacion_extraordinaria.findUnique({ where: { id_regularizacion: origen.id }, include: { ajuste: true } }); if (!item) return null; const empleado = await prisma.empleado.findUnique({ where: { id_empleado: item.ajuste.id_empleado } }); return { tipo: 'REGULARIZACION', id: origen.id, descripcion: `${empleado ? nombreCompleto(empleado) : `Empleado #${item.ajuste.id_empleado}`} · ajuste #${item.id_ajuste_posterior}` }; }
    const item = await prisma.boleta_honorarios.findUnique({ where: { id_boleta_honorarios: origen.id }, include: { prestador: true } });
    return item ? { tipo: 'BOLETA_HONORARIOS', id: origen.id, descripcion: `${item.prestador.nombre_razon_social} · folio ${item.folio}` } : null;
  }

  async actualizarPagoRemuneracion(idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint) {
    const actual = await this.repositorioPago.obtener(prisma, idPago); if (!actual) throw new ErrorAplicacion(404, 'Pago de remuneración no encontrado');
    if (actual.estado !== 'PREPARADO') throw new ErrorAplicacion(409, 'Sólo un pago PREPARADO puede corregirse');
    const monto = entrada.monto === undefined ? actual.monto : decimalMonetario(entrada.monto, 'Monto del pago', true);
    const idMedio = entrada.idMedioPago === undefined ? actual.id_medio_pago : enteroPositivo(entrada.idMedioPago, 'Medio de pago');
    const respaldo = entrada.respaldo === undefined ? actual.respaldo : texto(entrada.respaldo, 2000) || null;
    const referencia = entrada.referencia === undefined ? actual.referencia : texto(entrada.referencia, 200) || null;
    const medio = await prisma.medio_pago.findUnique({ where: { id_medio_pago: idMedio } });
    if (!medio || medio.estado_medio_pago !== 'activo' || !medio.codigo_medio_pago || medio.requiere_respaldo === null) throw new ErrorAplicacion(409, 'El medio de pago no tiene configuración M6 válida');
    if (medio.requiere_respaldo && !respaldo) throw new ErrorAplicacion(400, 'El medio de pago exige respaldo');
    await this.repositorioPago.actualizarPreparado(prisma, idPago, { monto, idMedioPago: idMedio, respaldo, referencia });
    const detalle = await this.obtenerPagoRemuneracion(idPago);
    const anterior = { monto: Number(actual.monto), medioPagoId: actual.id_medio_pago, respaldo: actual.respaldo, referencia: actual.referencia };
    const nuevo = { monto: Number(monto), medioPagoId: idMedio, respaldo, referencia };
    Object.defineProperty(detalle, '__auditoriaM9', { value: { anterior, nuevo, actor: idUsuario?.toString() }, enumerable: false });
    return detalle;
  }

  async confirmarPagoRemuneracion(idPago: number, idUsuario: bigint) {
    try {
      await prisma.$transaction(async tx => {
        const pago: any = await this.repositorioPago.obtener(tx, idPago, true);
        if (!pago) throw new ErrorAplicacion(404, 'Pago de remuneración no encontrado');
        if (pago.estado === 'CONFIRMADO') return;
        if (pago.estado !== 'PREPARADO') throw new ErrorAplicacion(409, 'El pago no está PREPARADO');
        if (pago.medio_pago.estado_medio_pago !== 'activo' || !pago.medio_pago.codigo_medio_pago || pago.medio_pago.requiere_respaldo === null) throw new ErrorAplicacion(409, 'El medio de pago no tiene configuración M6 válida');
        if (pago.medio_pago.requiere_respaldo && !pago.respaldo) throw new ErrorAplicacion(400, 'El medio de pago exige respaldo');
        const origen = this.repositorioPago.origenDesdePago(pago);
        await this.repositorioPago.bloquearOrigen(tx, origen);
        const montoOriginal = await this.montoPagableOriginal(tx, origen);
        const economia = await this.repositorioPago.estadoEconomicoOrigen(tx, origen, montoOriginal);
        if (economia.saldoPendiente === null || economia.saldoPendiente.lte(0) || !pago.monto.equals(economia.saldoPendiente)) throw new ErrorAplicacion(409, 'El monto preparado no coincide con el saldo económico pendiente del origen');
        const cambio = await this.repositorioPago.confirmarPreparado(tx, idPago, idUsuario);
        if (cambio.count !== 1) throw new ErrorAplicacion(409, 'El pago cambió concurrentemente');
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerPagoRemuneracion(idPago);
    } catch (error) { this.conflictoConcurrente(error, 'El pago cambió concurrentemente o el origen ya fue pagado'); }
  }

  async listarPagosRemuneracion() {
    const items = await this.repositorioPago.listar(prisma);
    return items.map(item => this.presentarPago(item));
  }

  async prepararPagoAnticipo(idAnticipo: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    return this.prepararPagoRemuneracion(this.repositorioPago.anticipo(idAnticipo), entrada, idUsuario);
  }

  async prepararPagoFinal(entrada: Record<string, unknown>, idUsuario: bigint) {
    const tipo = texto(entrada.origenTipo, 30).toUpperCase();
    if (!['REMUNERACION', 'REGULARIZACION'].includes(tipo)) throw new ErrorAplicacion(400, 'CU186 sólo paga remuneraciones o regularizaciones');
    const id = enteroPositivo(entrada.origenId, 'Origen');
    const origen = tipo === 'REMUNERACION' ? this.repositorioPago.remuneracion(id) : this.repositorioPago.regularizacion(id);
    return this.prepararPagoRemuneracion(origen, entrada, idUsuario);
  }

  private async exigirTipoPago(idPago: number, permitidos: string[]) {
    const pago = await this.repositorioPago.obtener(prisma, idPago);
    if (!pago) throw new ErrorAplicacion(404, 'Pago de remuneración no encontrado');
    const origen = this.repositorioPago.origenDesdePago(pago);
    if (!permitidos.includes(this.repositorioPago.tipoPublico(origen))) throw new ErrorAplicacion(403, 'El pago no pertenece al caso de uso autorizado');
  }

  async actualizarPagoAnticipo(idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint) { await this.exigirTipoPago(idPago, ['ANTICIPO']); return this.actualizarPagoRemuneracion(idPago, entrada, idUsuario); }
  async confirmarPagoAnticipo(idPago: number, idUsuario: bigint) { await this.exigirTipoPago(idPago, ['ANTICIPO']); return this.confirmarPagoRemuneracion(idPago, idUsuario); }
  async actualizarPagoFinal(idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint) { await this.exigirTipoPago(idPago, ['REMUNERACION', 'REGULARIZACION']); return this.actualizarPagoRemuneracion(idPago, entrada, idUsuario); }
  async confirmarPagoFinal(idPago: number, idUsuario: bigint) { await this.exigirTipoPago(idPago, ['REMUNERACION', 'REGULARIZACION']); return this.confirmarPagoRemuneracion(idPago, idUsuario); }

  async listarPrestadoresHonorarios() {
    const items = await prisma.prestador_honorarios.findMany({ orderBy: [{ nombre_razon_social: 'asc' }, { identificador: 'asc' }] });
    return items.map(item => ({ id: item.id_prestador_honorarios, identificador: item.identificador, nombre: item.nombre_razon_social, contacto: item.contacto, estado: item.estado }));
  }

  async crearPrestadorHonorarios(entrada: Record<string, unknown>) {
    const identificador = texto(entrada.identificador, 30);
    const nombre = texto(entrada.nombreRazonSocial, 160);
    const contacto = texto(entrada.contacto, 2000) || null;
    const estado = texto(entrada.estado || 'ACTIVO', 20).toUpperCase();
    if (!identificador || !nombre) throw new ErrorAplicacion(400, 'Identificador y nombre o razón social son obligatorios');
    if (!['ACTIVO', 'INACTIVO'].includes(estado)) throw new ErrorAplicacion(400, 'Estado de prestador inválido');
    try {
      const item = await prisma.prestador_honorarios.create({ data: { identificador, nombre_razon_social: nombre, contacto, estado } });
      return { id: item.id_prestador_honorarios, identificador: item.identificador, nombre: item.nombre_razon_social, contacto: item.contacto, estado: item.estado };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe un prestador con ese identificador');
      throw error;
    }
  }

  private async presentarBoletaHonorarios(item: any) {
    const origen = this.repositorioPago.boletaHonorarios(item.id_boleta_honorarios);
    const economia = await this.repositorioPago.estadoEconomicoOrigen(prisma, origen, item.liquido ?? undefined);
    const montoEfectivo = Number(economia.montoEfectivo);
    const saldoPendiente = economia.saldoPendiente === null ? null : Number(economia.saldoPendiente);
    const condicionEconomica = item.estado_documental === 'PENDIENTE_CONFIRMACION'
      ? 'PENDIENTE_TRIBUTARIA'
      : saldoPendiente === 0 ? 'PAGADA' : montoEfectivo > 0 ? 'PAGO_PARCIAL' : 'PENDIENTE_PAGO';
    return {
      id: item.id_boleta_honorarios,
      prestador: { id: item.id_prestador, identificador: item.prestador.identificador, nombre: item.prestador.nombre_razon_social, contacto: item.prestador.contacto, estado: item.prestador.estado },
      folio: item.folio,
      fechaEmision: item.fecha_emision,
      bruto: Number(item.bruto),
      modalidadTributaria: item.modalidad_tributaria,
      tasaAplicada: item.tasa_aplicada === null ? null : Number(item.tasa_aplicada),
      retencion: item.retencion === null ? null : Number(item.retencion),
      liquido: item.liquido === null ? null : Number(item.liquido),
      estadoDocumental: item.estado_documental,
      respaldo: item.respaldo,
      referencia: item.referencia,
      economia: { montoOriginal: economia.montoOriginal === null ? null : Number(economia.montoOriginal), montoEfectivo, saldoPendiente, condicion: condicionEconomica },
    };
  }

  async listarBoletasHonorarios(consulta: Record<string, unknown>) {
    const estado = texto(consulta.estado || 'TODOS', 30).toUpperCase();
    if (!['TODOS', 'PENDIENTE_CONFIRMACION', 'CONFIRMADA'].includes(estado)) throw new ErrorAplicacion(400, 'Estado documental inválido');
    const busqueda = texto(consulta.busqueda, 160);
    const idPrestador = consulta.idPrestador === undefined || consulta.idPrestador === '' ? null : enteroPositivo(consulta.idPrestador, 'Prestador');
    const fechaDesde = fechaEntrada(consulta.fechaDesde, 'Fecha desde', false);
    const fechaHasta = fechaEntrada(consulta.fechaHasta, 'Fecha hasta', false);
    if (fechaDesde && fechaHasta && fechaHasta < fechaDesde) throw new ErrorAplicacion(400, 'El rango de fechas es inválido');
    const where: Prisma.boleta_honorariosWhereInput = {
      estado_documental: estado === 'TODOS' ? undefined : estado,
      id_prestador: idPrestador ?? undefined,
      fecha_emision: fechaDesde || fechaHasta ? { gte: fechaDesde ?? undefined, lte: fechaHasta ?? undefined } : undefined,
      OR: busqueda ? [
        { folio: { contains: busqueda, mode: 'insensitive' } },
        { prestador: { is: { nombre_razon_social: { contains: busqueda, mode: 'insensitive' } } } },
        { prestador: { is: { identificador: { contains: busqueda, mode: 'insensitive' } } } },
      ] : undefined,
    };
    const items = await prisma.boleta_honorarios.findMany({ where, include: { prestador: true }, orderBy: [{ fecha_emision: 'desc' }, { id_boleta_honorarios: 'desc' }] });
    return Promise.all(items.map(item => this.presentarBoletaHonorarios(item)));
  }

  async obtenerBoletaHonorarios(id: number) {
    const item = await prisma.boleta_honorarios.findUnique({ where: { id_boleta_honorarios: id }, include: { prestador: true } });
    if (!item) throw new ErrorAplicacion(404, 'Boleta de honorarios no encontrada');
    return this.presentarBoletaHonorarios(item);
  }

  private async datosBoletaPendiente(entrada: Record<string, unknown>) {
    const idPrestador = enteroPositivo(entrada.idPrestador, 'Prestador');
    const folio = texto(entrada.folio, 80);
    const fechaEmision = fechaEntrada(entrada.fechaEmision, 'Fecha de emisión')!;
    const bruto = decimalMonetario(entrada.bruto, 'Bruto', true);
    const modalidadTributaria = texto(entrada.modalidadTributaria, 40);
    const respaldo = texto(entrada.respaldo, 2000) || null;
    const referencia = texto(entrada.referencia, 200) || null;
    if (!folio) throw new ErrorAplicacion(400, 'El folio es obligatorio');
    if (!modalidadTributaria) throw new ErrorAplicacion(400, 'La modalidad tributaria es obligatoria');
    if (!await prisma.prestador_honorarios.findUnique({ where: { id_prestador_honorarios: idPrestador } })) throw new ErrorAplicacion(404, 'Prestador de honorarios no encontrado');
    return { id_prestador: idPrestador, folio, fecha_emision: fechaEmision, bruto, modalidad_tributaria: modalidadTributaria, respaldo, referencia };
  }

  async crearBoletaHonorarios(entrada: Record<string, unknown>) {
    const data = await this.datosBoletaPendiente(entrada);
    try {
      const item = await prisma.boleta_honorarios.create({ data: { ...data, tasa_aplicada: null, retencion: null, liquido: null, estado_documental: 'PENDIENTE_CONFIRMACION' }, include: { prestador: true } });
      return this.presentarBoletaHonorarios(item);
    } catch (error) { this.conflictoConcurrente(error, 'Ya existe una boleta con ese folio para el prestador'); }
  }

  async actualizarBoletaHonorarios(id: number, entrada: Record<string, unknown>) {
    const actual = await prisma.boleta_honorarios.findUnique({ where: { id_boleta_honorarios: id } });
    if (!actual) throw new ErrorAplicacion(404, 'Boleta de honorarios no encontrada');
    if (actual.estado_documental !== 'PENDIENTE_CONFIRMACION') throw new ErrorAplicacion(409, 'Sólo una boleta PENDIENTE_CONFIRMACION puede editarse');
    const data = await this.datosBoletaPendiente(entrada);
    try {
      const cambio = await prisma.boleta_honorarios.updateMany({ where: { id_boleta_honorarios: id, estado_documental: 'PENDIENTE_CONFIRMACION' }, data });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La boleta cambió concurrentemente');
      return this.obtenerBoletaHonorarios(id);
    } catch (error) { this.conflictoConcurrente(error, 'La boleta cambió concurrentemente o el folio está duplicado'); }
  }

  private async calcularTributacionBoletaHonorarios(
    cliente: Pick<Prisma.TransactionClient, 'parametro_remuneracional'>,
    boleta: { bruto: Prisma.Decimal; modalidad_tributaria: string; fecha_emision: Date },
  ) {
    const modalidades = ['CON_RETENCION_RECEPTOR', 'SIN_RETENCION_PPM_EMISOR'];
    if (!modalidades.includes(boleta.modalidad_tributaria)) throw new ErrorAplicacion(400, 'Modalidad tributaria de boleta inválida');
    if (!boleta.bruto.isFinite() || boleta.bruto.lte(0)) throw new ErrorAplicacion(400, 'El bruto de la boleta debe ser mayor que cero');
    const parametros = await cliente.parametro_remuneracional.findMany({
      where: {
        codigo: 'BH_TASA_RETENCION_PPM',
        estado: 'activo',
        vigencia_desde: { lte: boleta.fecha_emision },
        OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: boleta.fecha_emision } }],
      },
    });
    if (parametros.length === 0) throw new ErrorAplicacion(409, 'No existe una tasa de retención/PPM vigente para la fecha de emisión');
    if (parametros.length !== 1) throw new ErrorAplicacion(409, 'Existe más de una tasa de retención/PPM vigente para la fecha de emisión');
    const parametro = parametros[0];
    if (parametro.codigo !== 'BH_TASA_RETENCION_PPM' || parametro.unidad !== 'FACTOR_DECIMAL' || parametro.valor === null) {
      throw new ErrorAplicacion(409, 'El parámetro tributario vigente no tiene el código, unidad o valor esperado');
    }
    const tasa = new Prisma.Decimal(parametro.valor);
    if (!tasa.isFinite() || tasa.isNegative()) throw new ErrorAplicacion(409, 'La tasa tributaria vigente es inválida');
    const retencion = boleta.modalidad_tributaria === 'CON_RETENCION_RECEPTOR'
      ? boleta.bruto.mul(tasa).toDecimalPlaces(0, Prisma.Decimal.ROUND_HALF_UP)
      : new Prisma.Decimal(0);
    const liquido = boleta.bruto.minus(retencion);
    if (liquido.lte(0)) throw new ErrorAplicacion(409, 'La tasa tributaria vigente produce un líquido inválido');
    return { tasa, retencion, liquido };
  }

  async previsualizarConfirmacionBoletaHonorarios(id: number) {
    const boleta = await prisma.boleta_honorarios.findUnique({ where: { id_boleta_honorarios: id } });
    if (!boleta) throw new ErrorAplicacion(404, 'Boleta de honorarios no encontrada');
    if (boleta.estado_documental !== 'PENDIENTE_CONFIRMACION') throw new ErrorAplicacion(409, 'Sólo una boleta PENDIENTE_CONFIRMACION puede confirmarse');
    const calculo = await this.calcularTributacionBoletaHonorarios(prisma, boleta);
    return { id, modalidadTributaria: boleta.modalidad_tributaria, bruto: Number(boleta.bruto), tasaAplicada: Number(calculo.tasa), retencion: Number(calculo.retencion), liquido: Number(calculo.liquido) };
  }

  async confirmarBoletaHonorarios(id: number) {
    try {
      await prisma.$transaction(async tx => {
        const boleta = await tx.boleta_honorarios.findUnique({ where: { id_boleta_honorarios: id } });
        if (!boleta) throw new ErrorAplicacion(404, 'Boleta de honorarios no encontrada');
        if (boleta.estado_documental !== 'PENDIENTE_CONFIRMACION') throw new ErrorAplicacion(409, 'Sólo una boleta PENDIENTE_CONFIRMACION puede confirmarse');
        const calculo = await this.calcularTributacionBoletaHonorarios(tx, boleta);
        const cambio = await tx.boleta_honorarios.updateMany({
          where: { id_boleta_honorarios: id, estado_documental: 'PENDIENTE_CONFIRMACION' },
          data: { tasa_aplicada: calculo.tasa, retencion: calculo.retencion, liquido: calculo.liquido, estado_documental: 'CONFIRMADA' },
        });
        if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La boleta cambió concurrentemente');
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.obtenerBoletaHonorarios(id);
    } catch (error) { this.conflictoConcurrente(error, 'La confirmación de la boleta cambió concurrentemente'); }
  }

  async consultarRetencionesHonorariosMensuales(anioEntrada: unknown, mesEntrada: unknown) {
    const { anio, mes, fechaInicio, fechaFin } = this.periodoEntrada(anioEntrada, mesEntrada);
    const resultado = await prisma.boleta_honorarios.aggregate({
      where: { estado_documental: 'CONFIRMADA', fecha_emision: { gte: fechaInicio, lte: fechaFin } },
      _sum: { retencion: true },
      _count: { _all: true },
    });
    return { anio, mes, totalRetenciones: Number(resultado._sum.retencion ?? 0), cantidadBoletas: resultado._count._all };
  }

  async listarBoletasHonorariosConfirmadas() {
    const items = await prisma.boleta_honorarios.findMany({ where: { estado_documental: 'CONFIRMADA' }, include: { prestador: true }, orderBy: { fecha_emision: 'desc' } });
    return Promise.all(items.map(async item => { const economia = await this.repositorioPago.estadoEconomicoOrigen(prisma, this.repositorioPago.boletaHonorarios(item.id_boleta_honorarios), item.liquido!); return { id: item.id_boleta_honorarios, folio: item.folio, fechaEmision: item.fecha_emision, prestador: { id: item.id_prestador, identificador: item.prestador.identificador, nombre: item.prestador.nombre_razon_social }, bruto: Number(item.bruto), retencion: Number(item.retencion), liquido: Number(item.liquido), estadoDocumental: item.estado_documental, montoEfectivo: Number(economia.montoEfectivo), saldoPendiente: Number(economia.saldoPendiente), pendiente: economia.saldoPendiente!.gt(0) }; }));
  }

  async prepararPagoHonorarios(idBoleta: number, entrada: Record<string, unknown>, idUsuario: bigint) { return this.prepararPagoRemuneracion(this.repositorioPago.boletaHonorarios(idBoleta), entrada, idUsuario); }
  async actualizarPagoHonorarios(idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint) { await this.exigirTipoPago(idPago, ['BOLETA_HONORARIOS']); return this.actualizarPagoRemuneracion(idPago, entrada, idUsuario); }
  async confirmarPagoHonorarios(idPago: number, idUsuario: bigint) { await this.exigirTipoPago(idPago, ['BOLETA_HONORARIOS']); return this.confirmarPagoRemuneracion(idPago, idUsuario); }

  async anularPagoRemuneracion(idPago: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const motivo = texto(entrada.motivo, 1000); if (!motivo) throw new ErrorAplicacion(400, 'El motivo de anulación es obligatorio');
    try { await prisma.$transaction(async tx => { const pago = await this.repositorioPago.obtener(tx, idPago); if (!pago) throw new ErrorAplicacion(404, 'Pago no encontrado'); if (pago.estado !== 'CONFIRMADO') throw new ErrorAplicacion(409, 'Sólo un pago CONFIRMADO puede anularse'); if (pago.reversiones.length) throw new ErrorAplicacion(409, 'Un pago con reversiones no puede anularse sin una regla explícita'); const cambio = await this.repositorioPago.anularConfirmado(tx, idPago, motivo, idUsuario); if (cambio.count !== 1) throw new ErrorAplicacion(409, 'El pago cambió concurrentemente'); }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); return this.obtenerPagoRemuneracion(idPago); } catch (error) { this.conflictoConcurrente(error, 'La anulación cambió concurrentemente'); }
  }

  async registrarReversionPagoRemuneracion(idPago: number, entrada: Record<string, unknown>, idUsuario: bigint) {
    const monto = decimalMonetario(entrada.monto, 'Monto de reversión', true); const motivo = texto(entrada.motivo, 1000); if (!motivo) throw new ErrorAplicacion(400, 'El motivo de reversión es obligatorio');
    try { await prisma.$transaction(async tx => { const pago = await this.repositorioPago.obtener(tx, idPago); if (!pago) throw new ErrorAplicacion(404, 'Pago no encontrado'); if (pago.estado !== 'CONFIRMADO') throw new ErrorAplicacion(409, 'Sólo un pago CONFIRMADO admite reversión'); const total = pago.reversiones.reduce((suma, item) => suma.plus(item.monto), new Prisma.Decimal(0)); if (total.plus(monto).gt(pago.monto)) throw new ErrorAplicacion(409, 'La suma de reversiones excede el monto del pago'); await this.repositorioPago.registrarReversion(tx, idPago, monto, motivo, idUsuario); }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); return this.obtenerPagoRemuneracion(idPago); } catch (error) { this.conflictoConcurrente(error, 'La reversión cambió concurrentemente o excede el pago'); }
  }

  private exigirAlcanceDocumento(actor: ActorDocumentoM6, idEmpleado: number) {
    if (actor.alcanceEmpleadoId === null) throw new ErrorAplicacion(403, 'La cuenta no está vinculada a un empleado para autoservicio documental');
    if (actor.alcanceEmpleadoId !== undefined && actor.alcanceEmpleadoId !== null && actor.alcanceEmpleadoId !== idEmpleado) {
      throw new ErrorAplicacion(403, 'Sólo puedes acceder a tus propios documentos de remuneración');
    }
  }

  private archivoLiquidacion(item: any) {
    return archivoLiquidacionM6(item);
  }

  private async cargarLiquidacion(tx: Prisma.TransactionClient, idRemuneracion: number) {
    const item = await tx.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: this.incluirRemuneracion });
    if (!item) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
    // MIDAS: una liquidación reemplazada sigue siendo un documento histórico consultable.
    if (!['cerrada', 'reemplazada'].includes(item.estado)) throw new ErrorAplicacion(409, 'La remuneración no posee una liquidación oficial');
    return item;
  }

  private async cargarComprobanteAnticipo(tx: Prisma.TransactionClient, idAnticipo: number) {
    const item = await tx.anticipo_remuneracion.findUnique({ where: { id_anticipo: idAnticipo }, include: { empleado: true, periodo: true } });
    if (!item) throw new ErrorAplicacion(404, 'Anticipo no encontrado');
    const pagos = await this.repositorioPago.pagosConfirmadosAnticipo(tx, idAnticipo);
    if (!pagos.length) throw new ErrorAplicacion(409, 'El anticipo no posee un pago confirmado para emitir comprobante oficial');
    return { item, pagos };
  }

  private archivoComprobanteAnticipo(item: any, pagos: any[]) {
    return archivoComprobanteAnticipoM6(item, pagos);
  }

  async listarDocumentosRemuneracion(consulta: Record<string, unknown>, actor: ActorDocumentoM6) {
    if (actor.alcanceEmpleadoId === null) throw new ErrorAplicacion(403, 'La cuenta no está vinculada a un empleado para autoservicio documental');
    const idEmpleadoEntrada = consulta.idEmpleado === undefined || consulta.idEmpleado === '' ? null : enteroPositivo(consulta.idEmpleado, 'Empleado');
    const idEmpleado = actor.alcanceEmpleadoId ?? idEmpleadoEntrada;
    if (actor.alcanceEmpleadoId !== null && actor.alcanceEmpleadoId !== undefined && idEmpleadoEntrada && idEmpleadoEntrada !== actor.alcanceEmpleadoId) this.exigirAlcanceDocumento(actor, idEmpleadoEntrada);
    const anio = consulta.anio === undefined || consulta.anio === '' ? null : Number(consulta.anio);
    const mes = consulta.mes === undefined || consulta.mes === '' ? null : Number(consulta.mes);
    const remuneraciones = await prisma.remuneracion.findMany({
      where: { estado: { in: ['cerrada', 'reemplazada'] }, id_empleado: idEmpleado ?? undefined, periodo: { anio: anio ?? undefined, mes: mes ?? undefined } },
      include: { empleado: true, periodo: true }, orderBy: [{ periodo: { anio: 'desc' } }, { periodo: { mes: 'desc' } }, { id_remuneracion: 'desc' }],
    });
    const anticipos = await prisma.anticipo_remuneracion.findMany({
      where: { id_empleado: idEmpleado ?? undefined, periodo: { anio: anio ?? undefined, mes: mes ?? undefined }, id_anticipo: { in: await this.repositorioPago.idsAnticiposConPagoConfirmado(prisma) } },
      include: { empleado: true, periodo: true }, orderBy: { creado_en: 'desc' },
    });
    return [
      ...remuneraciones.map((item) => ({ tipo: 'LIQUIDACION', id: item.id_remuneracion, idEmpleado: item.id_empleado, empleado: nombreCompleto(item.empleado), periodo: { anio: item.periodo.anio, mes: item.periodo.mes }, oficial: true, vigente: item.estado === 'cerrada', condicion: item.estado === 'cerrada' ? 'VIGENTE' : 'HISTORICA_REEMPLAZADA' })),
      ...anticipos.map((item) => ({ tipo: 'COMPROBANTE_ANTICIPO', id: item.id_anticipo, idEmpleado: item.id_empleado, empleado: nombreCompleto(item.empleado), periodo: { anio: item.periodo.anio, mes: item.periodo.mes }, oficial: true, vigente: true, condicion: 'PAGO_CONFIRMADO' })),
    ];
  }

  async descargarDocumentoRemuneracion(tipoEntrada: unknown, id: number, actor: ActorDocumentoM6) {
    const tipo = texto(tipoEntrada, 40).toUpperCase();
    if (tipo === 'LIQUIDACION') {
      const item = await this.cargarLiquidacion(prisma, id); this.exigirAlcanceDocumento(actor, item.id_empleado);
      return this.archivoLiquidacion(item);
    }
    if (tipo === 'COMPROBANTE_ANTICIPO') {
      const { item, pagos } = await this.cargarComprobanteAnticipo(prisma, id); this.exigirAlcanceDocumento(actor, item.id_empleado);
      return this.archivoComprobanteAnticipo(item, pagos);
    }
    throw new ErrorAplicacion(400, 'Tipo de documento no soportado');
  }

  async reenviarDocumentoRemuneracion(tipoEntrada: unknown, idEntrada: number, actor: ActorDocumentoM6) {
    const tipo = texto(tipoEntrada, 40).toUpperCase();
    let idDocumentoResuelto = idEntrada;
    try {
      return await prisma.$transaction(async (tx) => {
        let id = idEntrada; let idEmpleado: number; let archivo: { nombre: string; mime: string; contenido: string };
        if (tipo === 'LIQUIDACION') {
          await this.repositorioPago.bloquearRemuneracion(tx, idEntrada);
          let item = await this.cargarLiquidacion(tx, idEntrada);
          if (item.estado === 'reemplazada') {
            // MIDAS: el reenvío parte del histórico solicitado, pero entrega la liquidación oficial vigente.
            const vigente = await tx.remuneracion.findFirst({ where: { id_empleado: item.id_empleado, id_periodo_remuneracion: item.id_periodo_remuneracion, estado: 'cerrada' }, include: this.incluirRemuneracion, orderBy: { id_remuneracion: 'desc' } });
            if (!vigente) throw new ErrorAplicacion(409, 'No existe una liquidación oficial vigente para reenviar');
            item = vigente; id = item.id_remuneracion;
            await this.repositorioPago.bloquearRemuneracion(tx, id);
          }
          idEmpleado = item.id_empleado; archivo = this.archivoLiquidacion(item);
        } else if (tipo === 'COMPROBANTE_ANTICIPO') {
          const comprobante = await this.cargarComprobanteAnticipo(tx, id); idEmpleado = comprobante.item.id_empleado; archivo = this.archivoComprobanteAnticipo(comprobante.item, comprobante.pagos);
        } else throw new ErrorAplicacion(400, 'Tipo de documento no soportado');
        idDocumentoResuelto = id;
        this.exigirAlcanceDocumento(actor, idEmpleado);
        const configuracion = await this.configuracionDocumental(tx, idEmpleado);
        if (configuracion.consentimientoElectronico !== true || !configuracion.canalDocumental) throw new ErrorAplicacion(409, 'El empleado no posee consentimiento y canal documental vigentes');
        const destinatario = configuracion.canalDocumental === 'correo_particular' ? configuracion.correoParticular : configuracion.correoCorporativo;
        if (!destinatario) throw new ErrorAplicacion(409, 'El canal documental no posee un correo disponible');
        await this.correoDocumental.enviarDocumento(destinatario, 'Documento oficial de remuneración', archivo);
        const evento = await this.auditoriaDocumental.registrar(tx, { actorId: actor.id, tipoDocumento: tipo, idDocumento: id, accion: 'REENVIO_DOCUMENTO_OFICIAL', condicion: 'ACEPTADO_POR_TRANSPORTE', metadata: { canal: configuracion.canalDocumental, destinatarioLogico: configuracion.canalDocumental, nombre: archivo.nombre } });
        return { enviado: true, entregado: false, idDocumento: id, referenciaEvento: evento.referenciaEvento };
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 30000 });
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      await this.auditoriaDocumental.registrar(prisma, { actorId: actor.id, tipoDocumento: tipo, idDocumento: idDocumentoResuelto, accion: 'REENVIO_DOCUMENTO_OFICIAL', condicion: 'FALLIDO', metadata: { errorIntegracion: (error as Error).message } }).catch(() => undefined);
      throw new ErrorAplicacion(503, `No fue posible enviar el documento: ${(error as Error).message}`);
    }
  }

  async registrarEntregaDocumento(entrada: Record<string, unknown>, actor: ActorDocumentoM6) {
    if (actor.alcanceEmpleadoId !== undefined) throw new ErrorAplicacion(403, 'La entrega documental manual requiere un usuario interno');
    const tipo = texto(entrada.tipo, 40).toUpperCase(); const id = enteroPositivo(entrada.id, 'Documento');
    const canal = texto(entrada.canal, 30).toLowerCase(); const resultado = texto(entrada.resultado, 30).toLowerCase();
    if (!['correo_particular', 'correo_corporativo', 'presencial', 'otro'].includes(canal)) throw new ErrorAplicacion(400, 'Canal de entrega inválido');
    if (!['entregado', 'rechazado', 'pendiente'].includes(resultado)) throw new ErrorAplicacion(400, 'Resultado de entrega inválido');
    if (tipo === 'LIQUIDACION') await this.cargarLiquidacion(prisma, id);
    else if (tipo === 'COMPROBANTE_ANTICIPO') await this.cargarComprobanteAnticipo(prisma, id);
    else throw new ErrorAplicacion(400, 'Tipo de documento no soportado');
    const condicion = resultado.toUpperCase() as CondicionDocumento;
    const evento = await this.auditoriaDocumental.registrar(prisma, { actorId: actor.id, tipoDocumento: tipo, idDocumento: id, accion: 'REGISTRO_ENTREGA_DOCUMENTAL', condicion, metadata: { canal, destinatarioLogico: texto(entrada.destinatarioLogico, 80) || 'empleado' } });
    return { referenciaEvento: evento.referenciaEvento, resultado: condicion };
  }

  async consultarEntregaDocumento(tipoEntrada: unknown, id: number, actor: ActorDocumentoM6) {
    if (actor.alcanceEmpleadoId !== undefined) throw new ErrorAplicacion(403, 'La consulta de entregas requiere un usuario interno');
    const tipo = texto(tipoEntrada, 40).toUpperCase();
    if (!['LIQUIDACION', 'COMPROBANTE_ANTICIPO'].includes(tipo)) throw new ErrorAplicacion(400, 'Tipo de documento no soportado');
    const condicion = await this.auditoriaDocumental.ultimaCondicionEntrega(prisma, tipo, id);
    if (!condicion) return { enviado: false, entregado: false, condicion: null };
    return { enviado: ['ACEPTADO_POR_TRANSPORTE', 'ENTREGADO'].includes(condicion.resultado), entregado: condicion.resultado === 'ENTREGADO', condicion };
  }

  async exportarCalculoPreliminar(idRemuneracion: number, actor: ActorDocumentoM6) {
    return prisma.$transaction(async (tx) => {
      const item = await tx.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: this.incluirRemuneracion });
      if (!item) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
      if (item.estado !== 'abierta') throw new ErrorAplicacion(409, 'Sólo una remuneración ABIERTA puede exportarse como cálculo preliminar');
      this.exigirAlcanceDocumento(actor, item.id_empleado);
      const revision = await this.bloqueosRemuneracion(tx, item);
      const archivo = archivoCalculoPreliminarM6(item, revision);
      await this.auditoriaDocumental.registrar(tx, { actorId: actor.id, tipoDocumento: 'REMUNERACION', idDocumento: idRemuneracion, accion: 'EXPORTACION_PRELIMINAR', condicion: 'GENERADO', metadata: { oficial: false, nombre: archivo.nombre } });
      return archivo;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
  }

  async exportarRemuneracionesOficiales(consulta: Record<string, unknown>, actor: ActorDocumentoM6) {
    if (actor.alcanceEmpleadoId === null) throw new ErrorAplicacion(403, 'La cuenta no está vinculada a un empleado para autoservicio documental');
    const { anio, mes } = this.periodoEntrada(consulta.anio, consulta.mes);
    const idEmpleadoEntrada = consulta.idEmpleado === undefined || consulta.idEmpleado === '' ? null : enteroPositivo(consulta.idEmpleado, 'Empleado');
    const idEmpleado = actor.alcanceEmpleadoId ?? idEmpleadoEntrada;
    if (actor.alcanceEmpleadoId !== null && actor.alcanceEmpleadoId !== undefined && idEmpleadoEntrada && idEmpleadoEntrada !== actor.alcanceEmpleadoId) this.exigirAlcanceDocumento(actor, idEmpleadoEntrada);
    return prisma.$transaction(async (tx) => {
      // MIDAS: el informe oficial incluye la versión vigente; los reemplazos quedan en la consulta histórica.
      const items = await tx.remuneracion.findMany({ where: { estado: 'cerrada', id_empleado: idEmpleado ?? undefined, periodo: { anio, mes } }, include: this.incluirRemuneracion, orderBy: [{ empleado: { apellido_paterno: 'asc' } }, { id_remuneracion: 'desc' }] });
      if (!items.length) throw new ErrorAplicacion(404, 'No existen remuneraciones oficiales vigentes para los filtros');
      const archivo = archivoPeriodoRemuneracionesM6(items, anio, mes);
      await this.auditoriaDocumental.registrar(tx, { actorId: actor.id, tipoDocumento: 'PERIODO_REMUNERACION', idDocumento: items[0].id_periodo_remuneracion, accion: 'EXPORTACION_OFICIAL', condicion: 'GENERADO', metadata: { oficial: true, anio, mes, idEmpleado, cantidad: items.length, nombre: archivo.nombre } });
      return archivo;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead });
  }

  private readonly incluirVisitaTerreno = {
    usuario: true,
    obra: { include: { cliente: true, especificaciones_puerta: true } },
  } as const;

  private presentarUsuarioTerreno(usuario: any) {
    if (!usuario) return null;
    const nombre = [usuario.usuario_nombre_completo_primer_nombre_usuario, usuario.usuario_nombre_completo_segundo_nombre_usuario, usuario.usuario_nombre_completo_primer_apellido_usuario, usuario.usuario_nombre_completo_segundo_apellido_usuario].filter(Boolean).join(' ');
    return { id: usuario.usuario_id_usuario.toString(), acceso: usuario.acceso_m4 || usuario.usuario_username || null, nombre: nombre || usuario.usuario_username || `Usuario ${usuario.usuario_id_usuario.toString()}` };
  }

  private presentarObraTerreno(obra: any) {
    if (!obra) return null;
    const especificacion = obra.especificaciones_puerta;
    return {
      id: obra.obra_obra_id.toString(), nombre: obra.obra_nombre_obra, referencia: obra.obra_referencia,
      direccion: obra.obra_direccion_obra, comuna: obra.obra_comuna, region: obra.obra_region, estado: obra.obra_estado,
      cliente: obra.cliente ? { rut: obra.cliente.cliente_cliente_rut, nombre: obra.cliente.cliente_razon_social || obra.cliente.cliente_cliente_b2b_razon_social || null } : null,
      especificacion: especificacion ? { id: especificacion.especificacion_puerta_especificacion_puerta_id.toString(), modelo: especificacion.especificacion_puerta_modelo_puerta, zona: especificacion.especificacion_puerta_zona, observaciones: especificacion.especificacion_puerta_observaciones } : null,
    };
  }

  private presentarVisitaTerreno(visita: any) {
    return {
      id: visita.servicio_terreno_servicio_terreno_id.toString(), tipoServicio: visita.servicio_terreno_tipo_servicio,
      fecha: visita.servicio_terreno_fecha_real, bloqueHorario: visita.servicio_terreno_bloque_horario,
      prioridad: visita.servicio_terreno_prioridad, estado: visita.servicio_terreno_estado,
      observaciones: visita.servicio_terreno_observaciones, responsable: this.presentarUsuarioTerreno(visita.usuario),
      obra: this.presentarObraTerreno(visita.obra),
    };
  }

  private presentarDetalleVisitaTerreno(visita: any) {
    const tareas = Array.isArray(visita.tarea) ? visita.tarea : [];
    const cierresPorTarea = tareas.flatMap((tarea: any) => Array.isArray(tarea.formulario_de_cierre) ? tarea.formulario_de_cierre : []);
    const cierresPorEvidencia = (Array.isArray(visita.evidencia_terreno) ? visita.evidencia_terreno : []).map((evidencia: any) => evidencia.formulario_de_cierre).filter(Boolean);
    const cierres = new Map<string, any>();
    for (const cierre of [...cierresPorTarea, ...cierresPorEvidencia]) cierres.set(cierre.formulario_de_cierre_formulario_de_cierre_id.toString(), cierre);
    const ultimoCierre = [...cierres.values()].sort((a: any, b: any) => a.formulario_de_cierre_formulario_de_cierre_id > b.formulario_de_cierre_formulario_de_cierre_id ? -1 : 1)[0] || null;
    const ordenes = new Map<string, { id: string; estado: string | null }>();
    for (const tarea of tareas) {
      if (!tarea.orden_trabajo) continue;
      const id = tarea.orden_trabajo.orden_trabajo_id_orden.toString();
      ordenes.set(id, { id, estado: tarea.orden_trabajo.orden_trabajo_estado });
    }
    return {
      ...this.presentarVisitaTerreno(visita),
      resultadoRegistrado: ultimoCierre ? {
        id: ultimoCierre.formulario_de_cierre_formulario_de_cierre_id.toString(),
        resultado: ultimoCierre.formulario_de_cierre_resultado_finalizado,
        observaciones: ultimoCierre.formulario_de_cierre_detalle_de_observaciones,
      } : null,
      ordenesRelacionadas: [...ordenes.values()],
    };
  }

  async crearVisitaTerreno(entrada: Record<string, unknown>) {
    const idObra = BigInt(identificador(entrada.idObra));
    const tipoServicio = texto(entrada.tipoServicio, 50);
    if (!tipoServicio) throw new ErrorAplicacion(400, 'Tipo de servicio es obligatorio');
    const obra = await prisma.obra.findUnique({ where: { obra_obra_id: idObra } });
    if (!obra) throw new ErrorAplicacion(404, 'Obra no encontrada');
    const visita = await prisma.servicio_terreno.create({
      data: {
        id_obra: idObra, servicio_terreno_tipo_servicio: tipoServicio,
        servicio_terreno_fecha_real: fechaEntrada(entrada.fecha, 'Fecha', false),
        servicio_terreno_bloque_horario: horaEntrada(entrada.bloqueHorario, 'Bloque horario'),
        servicio_terreno_prioridad: texto(entrada.prioridad, 80) || null,
        servicio_terreno_observaciones: texto(entrada.observaciones, 1000) || null,
        servicio_terreno_estado: 'pendiente',
      },
      include: this.incluirVisitaTerreno,
    });
    return this.presentarVisitaTerreno(visita);
  }

  async listarObrasTerreno() {
    const obras = await prisma.obra.findMany({ include: { cliente: true, especificaciones_puerta: true }, orderBy: { obra_obra_id: 'desc' } });
    return obras.map((obra) => this.presentarObraTerreno(obra));
  }

  async listarVisitasTerreno() {
    const visitas = await prisma.servicio_terreno.findMany({ include: this.incluirVisitaTerreno, orderBy: { servicio_terreno_servicio_terreno_id: 'desc' } });
    return visitas.map((visita) => this.presentarVisitaTerreno(visita));
  }

  async obtenerVisitaTerreno(id: number) {
    const visita = await prisma.servicio_terreno.findUnique({
      where: { servicio_terreno_servicio_terreno_id: BigInt(id) },
      include: {
        ...this.incluirVisitaTerreno,
        tarea: {
          include: {
            orden_trabajo: true,
            formulario_de_cierre: { orderBy: { formulario_de_cierre_formulario_de_cierre_id: 'desc' } },
          },
        },
        evidencia_terreno: { include: { formulario_de_cierre: true } },
      },
    });
    if (!visita) throw new ErrorAplicacion(404, 'Visita no encontrada');
    return this.presentarDetalleVisitaTerreno(visita);
  }

  async listarInstalacionesTerreno() {
    const tareas = await prisma.tarea.findMany({
      where: {
        id_orden_trabajo: { not: null }, id_servicio_terreno: { not: null },
        servicio_terreno: { is: { servicio_terreno_tipo_servicio: { contains: 'instal', mode: 'insensitive' } } },
      },
      include: {
        servicio_terreno: { include: { ...this.incluirVisitaTerreno, checklist_de_materiales: true } },
        orden_trabajo: { include: { unidad_fisica_comercial: { include: { producto: { include: { familia: true } }, cierre_produccion: true } } } },
        formulario_de_cierre: { orderBy: { formulario_de_cierre_formulario_de_cierre_id: 'desc' } },
        ejecuciones: { include: { incidencias: { include: { categoria: true, area_responsable: true, evidencias: true } } }, orderBy: { fecha_ejecucion: 'desc' } },
      },
      orderBy: [{ tarea_fecha_de_visita: 'desc' }, { tarea_tarea_id: 'desc' }],
    });
    const instalaciones = new Map<string, any>();
    for (const tarea of tareas) {
      if (!tarea.servicio_terreno || !tarea.orden_trabajo) continue;
      const idVisita = tarea.servicio_terreno.servicio_terreno_servicio_terreno_id.toString();
      const idOrden = tarea.orden_trabajo.orden_trabajo_id_orden.toString();
      const clave = `${idVisita}:${idOrden}`;
      const existente = instalaciones.get(clave);
      const cierre = tarea.formulario_de_cierre[0] || null;
      const unidad = tarea.orden_trabajo.unidad_fisica_comercial;
      const incidencias = tarea.ejecuciones.flatMap((ejecucion) => ejecucion.incidencias.map((incidencia) => ({
        id: incidencia.id_incidencia_retrabajo.toString(), descripcion: incidencia.descripcion, estado: incidencia.estado,
        estadoRevision: incidencia.estado_revision, categoria: incidencia.categoria?.nombre || null,
        areaSenalada: incidencia.area_responsable?.area_trabajo_nombre_area || null, evidencias: incidencia.evidencias.length,
      })));
      const base = existente || {
        id: clave, idVisita, idOrdenTrabajo: idOrden,
        puerta: unidad ? { idUnidad: unidad.id_unidad_fisica_ot.toString(), numeroUnidad: unidad.numero_unidad, producto: unidad.producto.nombre_comercial, codigo: unidad.producto.codigo_comercial, familia: unidad.producto.familia.nombre } : null,
        cliente: tarea.servicio_terreno.obra?.cliente ? { rut: tarea.servicio_terreno.obra.cliente.cliente_cliente_rut, nombre: tarea.servicio_terreno.obra.cliente.cliente_razon_social || tarea.servicio_terreno.obra.cliente.cliente_cliente_b2b_razon_social || null } : null,
        obra: this.presentarObraTerreno(tarea.servicio_terreno.obra), visita: this.presentarVisitaTerreno(tarea.servicio_terreno),
        fabricacion: { estado: unidad?.estado || tarea.orden_trabajo.orden_trabajo_estado || null, finalizada: Boolean(unidad?.cierre_produccion) },
        preparacion: { checklist: tarea.servicio_terreno.checklist_de_materiales ? { id: tarea.servicio_terreno.checklist_de_materiales.checklist_de_materiales_checklist_de_materials_id.toString(), item: tarea.servicio_terreno.checklist_de_materiales.checklist_de_materiales_item, marcado: tarea.servicio_terreno.checklist_de_materiales.checklist_de_materiales_es_marcado, noMarcado: tarea.servicio_terreno.checklist_de_materiales.checklist_de_materiales_es_no_marcado, detalleMarcado: tarea.servicio_terreno.checklist_de_materiales.checklist_de_materiales_marcado, detalleNoMarcado: tarea.servicio_terreno.checklist_de_materiales.checklist_de_materiales_no_marcado } : null, direccionDisponible: Boolean(tarea.servicio_terreno.obra?.obra_direccion_obra), responsableAsignado: Boolean(tarea.servicio_terreno.id_usuario), visitaProgramada: Boolean(tarea.servicio_terreno.servicio_terreno_fecha_real) },
        tareas: [], incidencias: [], resultado: null,
        entrega: { estado: 'NO_REGISTRADA', detalle: 'Entrega no registrada' },
      };
      base.tareas.push({ id: tarea.tarea_tarea_id.toString(), titulo: tarea.tarea_titulo, estado: tarea.tarea_estado_de_tarea });
      base.incidencias.push(...incidencias);
      if (cierre && (!base.resultado || BigInt(cierre.formulario_de_cierre_formulario_de_cierre_id) > BigInt(base.resultado.id))) {
        const resultado = cierre.formulario_de_cierre_resultado_finalizado;
        base.resultado = { id: cierre.formulario_de_cierre_formulario_de_cierre_id.toString(), resultado, observaciones: cierre.formulario_de_cierre_detalle_de_observaciones, clasificacion: clasificarResultadoInstalacion(tarea.servicio_terreno.servicio_terreno_estado, resultado) };
      }
      instalaciones.set(clave, base);
    }
    return [...instalaciones.values()].map((instalacion) => ({ ...instalacion, clasificacion: instalacion.resultado?.clasificacion || clasificarResultadoInstalacion(instalacion.visita.estado, null) }));
  }

  async listarUsuariosTerreno() {
    const usuarios = await prisma.usuario.findMany({ orderBy: [{ usuario_nombre_completo_primer_apellido_usuario: 'asc' }, { usuario_username: 'asc' }] });
    return usuarios.map((usuario) => this.presentarUsuarioTerreno(usuario));
  }

  async asignarResponsableVisita(id: number, entrada: Record<string, unknown>) {
    const idUsuario = BigInt(identificador(entrada.idUsuario));
    const [visita, usuario] = await Promise.all([
      prisma.servicio_terreno.findUnique({ where: { servicio_terreno_servicio_terreno_id: BigInt(id) } }),
      prisma.usuario.findUnique({ where: { usuario_id_usuario: idUsuario } }),
    ]);
    if (!visita) throw new ErrorAplicacion(404, 'Visita no encontrada');
    if (!usuario) throw new ErrorAplicacion(404, 'Usuario responsable no encontrado');
    await prisma.servicio_terreno.update({ where: { servicio_terreno_servicio_terreno_id: BigInt(id) }, data: { id_usuario: idUsuario } });
    return this.obtenerVisitaTerreno(id);
  }

  async listarMisTareasTerreno(idUsuario: bigint) {
    const asignaciones = await prisma.tarea_usuario.findMany({ where: { tarea_usuario_usuario_id: idUsuario }, select: { tarea_usuario_tarea_id: true } });
    if (!asignaciones.length) return [];
    const tareas = await prisma.tarea.findMany({
      where: { tarea_tarea_id: { in: asignaciones.map((item) => item.tarea_usuario_tarea_id) } },
      include: {
        servicio_terreno: { include: this.incluirVisitaTerreno },
        especificaciones_puerta: true,
        origen_planificacion_ot: { include: { estado_operacional: true } },
      },
      orderBy: [{ tarea_fecha_de_visita: 'asc' }, { tarea_tarea_id: 'asc' }],
    });
    return tareas.map((tarea) => ({
      id: tarea.tarea_tarea_id.toString(), titulo: tarea.tarea_titulo, descripcion: tarea.tarea_descripcion,
      estado: tarea.origen_planificacion_ot?.estado_operacional?.estado || tarea.tarea_estado_de_tarea, urgencia: tarea.tarea_urgencia,
      fecha: tarea.tarea_fecha_de_visita || tarea.tarea_fecha_de_inicio, bloqueHorario: tarea.tarea_bloque_horario,
      visita: tarea.servicio_terreno ? this.presentarVisitaTerreno(tarea.servicio_terreno) : null,
      especificacion: tarea.especificaciones_puerta ? { id: tarea.especificaciones_puerta.especificacion_puerta_especificacion_puerta_id.toString(), modelo: tarea.especificaciones_puerta.especificacion_puerta_modelo_puerta, zona: tarea.especificaciones_puerta.especificacion_puerta_zona } : null,
    }));
  }

  private readonly incluirLevantamientoTerreno = {
    especificaciones_puerta: { include: { medidas_puerta: { orderBy: { medidas_puerta_medidas_id: 'asc' as const } }, historial_cambio_orden_trabajo: { orderBy: { historial_cambio_orden_trabajo_id_cambio: 'asc' as const } }, orden_trabajo: { include: { tareas_produccion: { orderBy: { tarea_tarea_id: 'asc' as const } } }, orderBy: { orden_trabajo_id_orden: 'desc' as const } } } },
    servicio_terreno: {
      include: {
        obra: { include: { cliente: true, especificaciones_puerta: { include: { medidas_puerta: { orderBy: { medidas_puerta_medidas_id: 'asc' as const } }, historial_cambio_orden_trabajo: { orderBy: { historial_cambio_orden_trabajo_id_cambio: 'asc' as const } }, orden_trabajo: { include: { tareas_produccion: { orderBy: { tarea_tarea_id: 'asc' as const } } }, orderBy: { orden_trabajo_id_orden: 'desc' as const } } } } } },
        especificacion_servicio_terreno: { include: { especificaciones_puerta: { include: { medidas_puerta: { orderBy: { medidas_puerta_medidas_id: 'asc' as const } }, historial_cambio_orden_trabajo: { orderBy: { historial_cambio_orden_trabajo_id_cambio: 'asc' as const } }, orden_trabajo: { include: { tareas_produccion: { orderBy: { tarea_tarea_id: 'asc' as const } } }, orderBy: { orden_trabajo_id_orden: 'desc' as const } } } } } },
      },
    },
  };

  private readonly camposTextoLevantamiento: Record<string, string> = {
    modeloPuerta: 'especificacion_puerta_modelo_puerta', zona: 'especificacion_puerta_zona', sentidoApertura: 'especificacion_puerta_sentido_apertura',
    materialidadVano: 'especificacion_puerta_materialidad_vano', materialidadMarcoActual: 'especificacion_puerta_materialidad_marco_actual', solucionMarco: 'especificacion_puerta_solucion_marco',
    hojaPasiva: 'especificacion_puerta_hoja_pasiva', hojaActiva: 'especificacion_puerta_hoja_activa', disenoPuerta: 'especificacion_puerta_diseno_puerta',
    observacionesDiseno: 'especificacion_puerta_observaciones_de_diseno', bisagras: 'especificacion_puerta_bisagras', observaciones: 'especificacion_puerta_observaciones',
  };

  private readonly camposMedidasLevantamiento: Record<string, string> = {
    marcoAncho: 'medidas_puerta_medidas_marco_ancho', marcoAlto: 'medidas_puerta_medidas_marco_alto', marcoEspesor: 'medidas_puerta_medidas_marco_espesor',
    vanoVerticalAncho: 'medidas_puerta_medidas_vano_vertical_ancho', vanoVerticalAlto: 'medidas_puerta_medidas_vano_vertical_alto', vanoVerticalEspesor: 'medidas_puerta_medidas_vano_vertical_espesor',
    vanoHorizontalAncho: 'medidas_puerta_medidas_vano_horizontal_ancho', vanoHorizontalAlto: 'medidas_puerta_medidas_vano_horizontal_alto', vanoHorizontalEspesor: 'medidas_puerta_medidas_vano_horizontal_espesor',
    alojamientoVerticalAlto: 'medidas_puerta_medidas_alojamiento_vertical_alto', alojamientoVerticalAncho: 'medidas_puerta_medidas_alojamiento_vertical_ancho', alojamientoVerticalEspesor: 'medidas_puerta_medidas_alojamiento_vertical_espesor',
    alojamientoHorizontalAlto: 'medidas_puerta_medidas_alojamiento_horizontal_alto', alojamientoHorizontalAncho: 'medidas_puerta_medidas_alojamiento_horizontal_ancho', alojamientoHorizontalEspesor: 'medidas_puerta_medidas_alojamiento_horizontal_espesor',
    alojamientoVertical: 'medidas_puerta_alojamiento_vertical', medidaMarcoAncho: 'medidas_puerta_medidas_de_marco_ancho', medidaMarcoAlto: 'medidas_puerta_medidas_de_marco_alto', medidaMarcoEspesor: 'medidas_puerta_medidas_de_marco_espesor',
  };

  private medidasObligatoriasOt(contenido: Prisma.JsonValue): string[] {
    if (!contenido || typeof contenido !== 'object' || Array.isArray(contenido)) return ['marcoAncho','marcoAlto'];
    const configuradas = (contenido as Prisma.JsonObject).medidasObligatorias;
    if (!Array.isArray(configuradas)) return ['marcoAncho','marcoAlto'];
    const validas = configuradas.filter((campo): campo is string => typeof campo === 'string' && Object.prototype.hasOwnProperty.call(this.camposMedidasLevantamiento,campo));
    return validas.length ? [...new Set(validas)] : ['marcoAncho','marcoAlto'];
  }

  private async resolverLevantamientoTerreno(id: number, actor: ActorTerrenoM6, cliente: Prisma.TransactionClient | typeof prisma = prisma) {
    const tarea = await cliente.tarea.findUnique({ where: { tarea_tarea_id: BigInt(id) }, include: this.incluirLevantamientoTerreno });
    if (!tarea) throw new ErrorAplicacion(404, 'Tarea no encontrada');
    if (!actor.administrador) {
      const asignacion = await cliente.tarea_usuario.findFirst({ where: { tarea_usuario_tarea_id: tarea.tarea_tarea_id, tarea_usuario_usuario_id: actor.id } });
      if (!asignacion) throw new ErrorAplicacion(403, 'La tarea no está asignada al usuario autenticado');
    }
    const visita = tarea.servicio_terreno;
    if (!visita) throw new ErrorAplicacion(409, 'La tarea no tiene una visita asociada');
    if (!visita.obra) throw new ErrorAplicacion(409, 'La visita no tiene una obra asociada');
    const asociadas = visita.especificacion_servicio_terreno.map((item) => item.especificaciones_puerta);
    const especificacion = visita.obra.especificaciones_puerta || tarea.especificaciones_puerta || (asociadas.length === 1 ? asociadas[0] : null);
    if (!especificacion) throw new ErrorAplicacion(409, asociadas.length > 1 ? 'La visita tiene más de una puerta y la tarea no identifica cuál levantar' : 'No existe una puerta asociada a la tarea, visita u obra');
    const medidaVigente = especificacion.id_medidas === null
      ? especificacion.medidas_puerta[0] || null
      : especificacion.medidas_puerta.find((medida) => medida.medidas_puerta_medidas_id === especificacion.id_medidas) || null;
    if (especificacion.id_medidas !== null && !medidaVigente) throw new ErrorAplicacion(409, 'La medida vigente del levantamiento no pertenece a la puerta asociada');
    return { tarea, visita, obra: visita.obra, especificacion, medidas: medidaVigente };
  }

  private presentarLevantamientoTerreno(contexto: Awaited<ReturnType<M6Controller['resolverLevantamientoTerreno']>>) {
    const { tarea, visita, obra, especificacion, medidas } = contexto;
    return {
      tarea: { id: tarea.tarea_tarea_id.toString(), titulo: tarea.tarea_titulo, estado: tarea.tarea_estado_de_tarea, fechaActualizacion: tarea.tarea_fecha_de_ultima_actualizacion },
      visita: { id: visita.servicio_terreno_servicio_terreno_id.toString(), tipoServicio: visita.servicio_terreno_tipo_servicio },
      obra: this.presentarObraTerreno(obra),
      especificacion: {
        id: especificacion.especificacion_puerta_especificacion_puerta_id.toString(),
        modeloPuerta: especificacion.especificacion_puerta_modelo_puerta, zona: especificacion.especificacion_puerta_zona,
        sentidoApertura: especificacion.especificacion_puerta_sentido_apertura, materialidadVano: especificacion.especificacion_puerta_materialidad_vano,
        materialidadMarcoActual: especificacion.especificacion_puerta_materialidad_marco_actual, solucionMarco: especificacion.especificacion_puerta_solucion_marco,
        hojaPasiva: especificacion.especificacion_puerta_hoja_pasiva, hojaActiva: especificacion.especificacion_puerta_hoja_activa,
        disenoPuerta: especificacion.especificacion_puerta_diseno_puerta, observacionesDiseno: especificacion.especificacion_puerta_observaciones_de_diseno,
        cubrejuntas: especificacion.especificacion_puerta_cubrejuntas, bisagras: especificacion.especificacion_puerta_bisagras,
        observaciones: especificacion.especificacion_puerta_observaciones,
      },
      medidas: medidas ? {
        id: medidas.medidas_puerta_medidas_id.toString(), marcoAncho: medidas.medidas_puerta_medidas_marco_ancho?.toString() || null,
        marcoAlto: medidas.medidas_puerta_medidas_marco_alto?.toString() || null, marcoEspesor: medidas.medidas_puerta_medidas_marco_espesor?.toString() || null,
        vanoVerticalAncho: medidas.medidas_puerta_medidas_vano_vertical_ancho?.toString() || null, vanoVerticalAlto: medidas.medidas_puerta_medidas_vano_vertical_alto?.toString() || null,
        vanoVerticalEspesor: medidas.medidas_puerta_medidas_vano_vertical_espesor?.toString() || null, vanoHorizontalAncho: medidas.medidas_puerta_medidas_vano_horizontal_ancho?.toString() || null,
        vanoHorizontalAlto: medidas.medidas_puerta_medidas_vano_horizontal_alto?.toString() || null, vanoHorizontalEspesor: medidas.medidas_puerta_medidas_vano_horizontal_espesor?.toString() || null,
        alojamientoVerticalAlto: medidas.medidas_puerta_medidas_alojamiento_vertical_alto?.toString() || null, alojamientoVerticalAncho: medidas.medidas_puerta_medidas_alojamiento_vertical_ancho?.toString() || null,
        alojamientoVerticalEspesor: medidas.medidas_puerta_medidas_alojamiento_vertical_espesor?.toString() || null, alojamientoHorizontalAlto: medidas.medidas_puerta_medidas_alojamiento_horizontal_alto?.toString() || null,
        alojamientoHorizontalAncho: medidas.medidas_puerta_medidas_alojamiento_horizontal_ancho?.toString() || null, alojamientoHorizontalEspesor: medidas.medidas_puerta_medidas_alojamiento_horizontal_espesor?.toString() || null,
        alojamientoVertical: medidas.medidas_puerta_alojamiento_vertical?.toString() || null, medidaMarcoAncho: medidas.medidas_puerta_medidas_de_marco_ancho?.toString() || null,
        medidaMarcoAlto: medidas.medidas_puerta_medidas_de_marco_alto?.toString() || null, medidaMarcoEspesor: medidas.medidas_puerta_medidas_de_marco_espesor?.toString() || null,
      } : null,
      historial: especificacion.historial_cambio_orden_trabajo.map((cambio) => ({
        id: cambio.historial_cambio_orden_trabajo_id_cambio.toString(), versionAnterior: cambio.historial_cambio_orden_trabajo_version_antigua,
        versionNueva: cambio.historial_cambio_orden_trabajo_version_nueva, fecha: cambio.historial_cambio_orden_trabajo_fecha_hora,
        descripcion: cambio.historial_cambio_orden_trabajo_descripcion,
      })),
      ordenTrabajo: especificacion.orden_trabajo[0] ? {
        id: especificacion.orden_trabajo[0].orden_trabajo_id_orden.toString(), estado: especificacion.orden_trabajo[0].orden_trabajo_estado,
        fecha: especificacion.orden_trabajo[0].orden_trabajo_fecha_hora, idEspecificacion: especificacion.especificacion_puerta_especificacion_puerta_id.toString(),
        proyecto: especificacion.orden_trabajo[0].proyecto_id_proyecto?.toString() || null, area: especificacion.orden_trabajo[0].area_trabajo_id_area?.toString() || null,
        usuario: especificacion.orden_trabajo[0].usuario_id_usuario?.toString() || null,
        tareasProduccion: especificacion.orden_trabajo[0].tareas_produccion.map((item) => ({
          id: item.tarea_tarea_id.toString(), titulo: item.tarea_titulo, descripcion: item.tarea_descripcion,
          instrucciones: item.tarea_instrucciones_de_oficina, estado: item.tarea_estado_de_tarea,
          idOrdenTrabajo: item.id_orden_trabajo?.toString() || null, idEspecificacion: item.id_especificacion_puerta?.toString() || null,
        })),
      } : null,
    };
  }

  async obtenerLevantamientoTerreno(id: number, actor: ActorTerrenoM6) {
    return this.presentarLevantamientoTerreno(await this.resolverLevantamientoTerreno(id, actor));
  }

  async guardarLevantamientoTerreno(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6) {
    const especificacionEntrada = entrada.especificacion && typeof entrada.especificacion === 'object' ? entrada.especificacion as Record<string, unknown> : {};
    const medidasEntrada = entrada.medidas && typeof entrada.medidas === 'object' ? entrada.medidas as Record<string, unknown> : {};
    try {
      return await prisma.$transaction(async (tx) => {
        const contexto = await this.resolverLevantamientoTerreno(id, actor, tx);
        const datosEspecificacion: Record<string, unknown> = {};
        for (const [campo, columna] of Object.entries(this.camposTextoLevantamiento)) if (Object.prototype.hasOwnProperty.call(especificacionEntrada, campo)) datosEspecificacion[columna] = texto(especificacionEntrada[campo], campo === 'observaciones' || campo === 'observacionesDiseno' ? 2000 : 200) || null;
        if (Object.prototype.hasOwnProperty.call(especificacionEntrada, 'cubrejuntas')) {
          const valor = especificacionEntrada.cubrejuntas;
          if (valor !== null && typeof valor !== 'boolean') throw new ErrorAplicacion(400, 'Cubrejuntas debe ser verdadero, falso o vacío');
          datosEspecificacion.especificacion_puerta_cubrejuntas = valor;
        }
        if (Object.keys(datosEspecificacion).length) await tx.especificaciones_puerta.update({ where: { especificacion_puerta_especificacion_puerta_id: contexto.especificacion.especificacion_puerta_especificacion_puerta_id }, data: datosEspecificacion });
        const datosMedidas: Record<string, unknown> = {};
        for (const [campo, columna] of Object.entries(this.camposMedidasLevantamiento)) if (Object.prototype.hasOwnProperty.call(medidasEntrada, campo)) datosMedidas[columna] = decimalOpcional(medidasEntrada[campo], campo);
        if (Object.keys(datosMedidas).length) {
          const idEspecificacion = contexto.especificacion.especificacion_puerta_especificacion_puerta_id;
          const existente = contexto.medidas;
          const medida = existente
            ? await tx.medidas_puerta.update({ where: { medidas_puerta_medidas_id: existente.medidas_puerta_medidas_id }, data: datosMedidas })
            : await tx.medidas_puerta.create({ data: { ...datosMedidas, id_especificacion_puerta: idEspecificacion } });
          if (contexto.especificacion.id_medidas !== medida.medidas_puerta_medidas_id) await tx.especificaciones_puerta.update({ where: { especificacion_puerta_especificacion_puerta_id: idEspecificacion }, data: { id_medidas: medida.medidas_puerta_medidas_id } });
        }
        await tx.tarea.update({ where: { tarea_tarea_id: contexto.tarea.tarea_tarea_id }, data: { tarea_fecha_de_ultima_actualizacion: new Date() } });
        return this.presentarLevantamientoTerreno(await this.resolverLevantamientoTerreno(id, actor, tx));
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') throw new ErrorAplicacion(409, 'El levantamiento fue modificado concurrentemente; vuelve a intentarlo');
      throw error;
    }
  }

  async corregirLevantamientoTerreno(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6, estadosOrdenTrabajoPermitidos?: string[]) {
    const motivo = texto(entrada.motivo, 1000);
    if (!motivo) throw new ErrorAplicacion(400, 'El motivo de la corrección es obligatorio');
    const especificacionEntrada = entrada.especificacion && typeof entrada.especificacion === 'object' ? entrada.especificacion as Record<string, unknown> : {};
    const medidasEntrada = entrada.medidas && typeof entrada.medidas === 'object' ? entrada.medidas as Record<string, unknown> : {};
    try {
      return await prisma.$transaction(async (tx) => {
        const contexto = await this.resolverLevantamientoTerreno(id, actor, tx);
        if (!contexto.medidas) throw new ErrorAplicacion(409, 'La tarea todavía no tiene un levantamiento técnico registrado');
        if (estadosOrdenTrabajoPermitidos && !contexto.especificacion.orden_trabajo.some((orden) => estadosOrdenTrabajoPermitidos.includes(orden.orden_trabajo_estado || ''))) throw new ErrorAplicacion(409, 'La Orden de Trabajo ya no admite ajustes técnicos antes de su liberación');
        const datosEspecificacion: Record<string, unknown> = {};
        const camposModificados: string[] = [];
        for (const [campo, columna] of Object.entries(this.camposTextoLevantamiento)) if (Object.prototype.hasOwnProperty.call(especificacionEntrada, campo)) {
          const valor = texto(especificacionEntrada[campo], campo === 'observaciones' || campo === 'observacionesDiseno' ? 2000 : 200) || null;
          if ((contexto.especificacion as unknown as Record<string, unknown>)[columna] !== valor) { datosEspecificacion[columna] = valor; camposModificados.push(campo); }
        }
        if (Object.prototype.hasOwnProperty.call(especificacionEntrada, 'cubrejuntas')) {
          const valor = especificacionEntrada.cubrejuntas;
          if (valor !== null && typeof valor !== 'boolean') throw new ErrorAplicacion(400, 'Cubrejuntas debe ser verdadero, falso o vacío');
          if (contexto.especificacion.especificacion_puerta_cubrejuntas !== valor) { datosEspecificacion.especificacion_puerta_cubrejuntas = valor; camposModificados.push('cubrejuntas'); }
        }
        const datosMedidas: Record<string, unknown> = {};
        for (const [campo, columna] of Object.entries(this.camposMedidasLevantamiento)) if (Object.prototype.hasOwnProperty.call(medidasEntrada, campo)) {
          const valor = decimalOpcional(medidasEntrada[campo], campo);
          const actual = contexto.medidas ? (contexto.medidas as unknown as Record<string, unknown>)[columna] as Prisma.Decimal | null : null;
          if ((actual?.toString() || null) !== (valor?.toString() || null)) { datosMedidas[columna] = valor; camposModificados.push(campo); }
        }
        if (!camposModificados.length) throw new ErrorAplicacion(400, 'Debes indicar al menos un campo para corregir');
        const versiones = contexto.especificacion.historial_cambio_orden_trabajo.flatMap((cambio) => [cambio.historial_cambio_orden_trabajo_version_antigua, cambio.historial_cambio_orden_trabajo_version_nueva]).map((version) => /^v(\d+)$/.exec(version || '')).filter(Boolean).map((coincidencia) => Number(coincidencia![1]));
        const numeroAnterior = versiones.length ? Math.max(...versiones) : 1;
        const cambio = await tx.historial_cambio_orden_trabajo.create({ data: {
          id_especificaciones_puerta: contexto.especificacion.especificacion_puerta_especificacion_puerta_id,
          historial_cambio_orden_trabajo_version_antigua: `v${numeroAnterior}`,
          historial_cambio_orden_trabajo_version_nueva: `v${numeroAnterior + 1}`,
          historial_cambio_orden_trabajo_fecha_hora: new Date(),
          historial_cambio_orden_trabajo_descripcion: `${motivo} | Campos modificados: ${camposModificados.join(', ')}`,
        } });
        if (Object.keys(datosMedidas).length) {
          const base = contexto.medidas;
          const datosBase = base ? Object.fromEntries(Object.values(this.camposMedidasLevantamiento).map((columna) => [columna, (base as unknown as Record<string, unknown>)[columna]])) : {};
          const nueva = await tx.medidas_puerta.create({ data: { ...datosBase, ...datosMedidas, id_especificacion_puerta: contexto.especificacion.especificacion_puerta_especificacion_puerta_id, id_cambio: cambio.historial_cambio_orden_trabajo_id_cambio } });
          datosEspecificacion.id_medidas = nueva.medidas_puerta_medidas_id;
        }
        if (Object.keys(datosEspecificacion).length) await tx.especificaciones_puerta.update({ where: { especificacion_puerta_especificacion_puerta_id: contexto.especificacion.especificacion_puerta_especificacion_puerta_id }, data: datosEspecificacion });
        await tx.tarea.update({ where: { tarea_tarea_id: contexto.tarea.tarea_tarea_id }, data: { tarea_fecha_de_ultima_actualizacion: new Date() } });
        return this.presentarLevantamientoTerreno(await this.resolverLevantamientoTerreno(id, actor, tx));
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') throw new ErrorAplicacion(409, 'El levantamiento fue corregido concurrentemente; vuelve a intentarlo');
      throw error;
    }
  }

  async generarOrdenTrabajoLevantamiento(id: number, actor: ActorTerrenoM6) {
    let idEspecificacion: bigint | null = null;
    try {
      return await prisma.$transaction(async (tx) => {
        const contexto = await this.resolverLevantamientoTerreno(id, actor, tx);
        if (!contexto.medidas) throw new ErrorAplicacion(409, 'La tarea todavía no tiene un levantamiento técnico registrado');
        idEspecificacion = contexto.especificacion.especificacion_puerta_especificacion_puerta_id;
        const existente = await tx.orden_trabajo.findFirst({
          where: { especificaciones_puerta_id_especificacion_puerta: idEspecificacion },
          orderBy: { orden_trabajo_id_orden: 'asc' },
        });
        if (!existente) await tx.orden_trabajo.create({ data: {
          orden_trabajo_fecha_hora: new Date(), orden_trabajo_estado: 'pendiente',
          especificaciones_puerta_id_especificacion_puerta: idEspecificacion,
          proyecto_id_proyecto: null, area_trabajo_id_area: null, usuario_id_usuario: null,
        } });
        return this.presentarLevantamientoTerreno(await this.resolverLevantamientoTerreno(id, actor, tx));
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (esConflictoSerializable(error)) {
        if (idEspecificacion !== null) {
          const existente = await prisma.orden_trabajo.findFirst({ where: { especificaciones_puerta_id_especificacion_puerta: idEspecificacion } });
          if (existente) return this.presentarLevantamientoTerreno(await this.resolverLevantamientoTerreno(id, actor));
        }
        throw new ErrorAplicacion(409, 'La Orden de Trabajo fue generada concurrentemente; vuelve a consultar');
      }
      throw error;
    }
  }

  private readonly estadosEditablesRectificacion = ['PENDIENTE_RECTIFICACION','RECTIFICACION_ASIGNADA','RECTIFICACION_EN_PROCESO','RECTIFICACION_DEVUELTA'];

  private estadoVisibleOrden(unidad: { estado:string; orden_trabajo:{ orden_trabajo_estado:string|null }; rectificacion:{ estado:string }|null }) {
    if (unidad.orden_trabajo.orden_trabajo_estado === 'completada') return 'FINALIZADA';
    if (unidad.estado === 'LIBERADA') return 'LIBERADA';
    if (unidad.orden_trabajo.orden_trabajo_estado === 'en_progreso') return 'EN_PRODUCCION';
    return unidad.rectificacion?.estado || unidad.estado;
  }

  private puedeGestionarTodasLasRectificaciones(actor:ActorTerrenoM6) {
    return actor.administrador || Boolean(actor.permisos?.some(permiso=>permiso==='CU205'||permiso==='CU207'||permiso==='CU209'));
  }

  private verificarAccesoRectificacion(unidad:{rectificacion:{id_empleado_rectificador:number|null}|null},actor:ActorTerrenoM6) {
    if (this.puedeGestionarTodasLasRectificaciones(actor)) return;
    if (!actor.alcanceEmpleadoId || unidad.rectificacion?.id_empleado_rectificador !== actor.alcanceEmpleadoId) throw new ErrorAplicacion(403,'La Orden de Trabajo no está asignada al empleado autenticado');
  }

  private readonly incluirGestionOrdenTrabajo = {
    orden_trabajo:true,
    creador:true,
    historial:{include:{usuario:true},orderBy:{fecha_evento:'desc' as const}},
    liberacion:{include:{actor:true}},
    cierre_produccion:{include:{actor:true}},
    etapas_adicionales:{include:{area:true},orderBy:{orden:'asc' as const}},
    historial_produccion:{include:{actor:true,empleado_involucrado:true},orderBy:{fecha_evento:'desc' as const}},
    tareas_ejecutables:{include:{estado_operacional:{include:{area:true,empleado_responsable:true}},tarea:{include:{
      usuario:true,
      servicio_terreno:{include:{usuario:true,obra:{include:{cliente:true,especificaciones_puerta:true}}}},
      formulario_de_cierre:true,
      ejecuciones:{include:{ejecutor:true,incidencias:{include:{categoria:true,area_responsable:true,creador:true,revisor:true,evidencias:true}}},orderBy:{fecha_ejecucion:'desc' as const}},
    }},etapa_adicional:true},orderBy:[{orden_etapa:'asc' as const},{orden_tarea:'asc' as const}]},
    producto:{include:{familia:true}},
    version_plantilla:true,
    detalle:true,
    cotizacion:{include:{ficha_cliente:{include:{cliente_financiero:true}},nota_venta:true}},
    rectificacion:{include:{
      empleado_rectificador:true,
      actualizador:true,
      especificacion:{include:{medidas_puerta:{orderBy:{medidas_puerta_medidas_id:'asc' as const}}}},
      versiones:{include:{enviador:true,decision:{include:{actor:true}}},orderBy:{numero_version:'desc' as const}},
      historial:{include:{usuario:true},orderBy:{fecha_evento:'desc' as const}},
    }},
  };

  private presentarGestionOrdenTrabajo(unidad:any) {
    const rectificacion=unidad.rectificacion;
    const especificacion=rectificacion?.especificacion;
    const medida=especificacion ? (especificacion.medidas_puerta.find((item:any)=>item.medidas_puerta_medidas_id===especificacion.id_medidas)||null) : null;
    const medidaSalida=medida?Object.fromEntries(Object.entries(this.camposMedidasLevantamiento).map(([campo,columna])=>[campo,medida[columna]?.toString()||null])):null;
    const planificacion=unidad.planificacion_actual as {etapas?:Array<any>};
    const empleadosProduccion=[...new Set([...(planificacion?.etapas||[]).flatMap(etapa=>(etapa.tareas||[]).map((tarea:any)=>tarea.idEmpleado).filter(Boolean)),...(unidad.tareas_ejecutables||[]).map((item:any)=>item.estado_operacional?.id_empleado_responsable).filter(Boolean)])];
    const incidencias=new Map<string,any>();
    const visitas=new Map<string,any>();
    const tareasProduccion=(unidad.tareas_ejecutables||[]).map((item:any)=>{
      const ejecuciones=(item.tarea.ejecuciones||[]).map((e:any)=>{
        for(const incidencia of e.incidencias||[]){
          const id=incidencia.id_incidencia_retrabajo.toString();
          incidencias.set(id,{id,descripcion:incidencia.descripcion,causa:incidencia.causa_referencia,estado:incidencia.estado,estadoRevision:incidencia.estado_revision,responsabilidad:incidencia.responsabilidad,fecha:incidencia.fecha_registro,categoria:incidencia.categoria?.nombre||null,areaSenalada:incidencia.area_responsable?.area_trabajo_nombre_area||null,participante:nombreUsuario(e.ejecutor),responsabilidadConfirmada:incidencia.estado_revision==='aprobada'?incidencia.responsabilidad:null,creadoPor:nombreUsuario(incidencia.creador),revisadoPor:incidencia.revisor?nombreUsuario(incidencia.revisor):null,observacionRevision:incidencia.observacion_revision,evidencias:(incidencia.evidencias||[]).map((evidencia:any)=>({id:evidencia.evidencia_terreno_evidencia_terreno_id.toString(),tipo:evidencia.evidencia_terreno_tipo_evidencia,fecha:evidencia.evidencia_terreno_fecha_captura})),tarea:{id:item.tarea.tarea_tarea_id.toString(),titulo:item.tarea.tarea_titulo}});
        }
        return{id:e.id_ejecucion_tarea.toString(),estado:e.estado_ejecucion,validacion:e.estado_validacion_productiva,fecha:e.fecha_ejecucion,ejecutor:nombreUsuario(e.ejecutor)};
      });
      const visita=item.tarea.servicio_terreno;
      if(visita){
        const cierres=(item.tarea.formulario_de_cierre||[]).sort((a:any,b:any)=>a.formulario_de_cierre_formulario_de_cierre_id>b.formulario_de_cierre_formulario_de_cierre_id?-1:1);
        visitas.set(visita.servicio_terreno_servicio_terreno_id.toString(),{...this.presentarVisitaTerreno(visita),resultadoRegistrado:cierres[0]?{id:cierres[0].formulario_de_cierre_formulario_de_cierre_id.toString(),resultado:cierres[0].formulario_de_cierre_resultado_finalizado,observaciones:cierres[0].formulario_de_cierre_detalle_de_observaciones}:null,ordenesRelacionadas:[{id:unidad.id_orden_trabajo.toString(),estado:unidad.orden_trabajo?.orden_trabajo_estado||null}]});
      }
      const resultadoValidado=ejecuciones.find((ejecucion:any)=>ejecucion.validacion==='validada')||null;
      return{id:item.id_tarea.toString(),idEjecutable:item.id_tarea_ejecutable_ot.toString(),titulo:item.tarea.tarea_titulo,origen:item.origen,ordenEtapa:item.orden_etapa,ordenTarea:item.orden_tarea,idEtapaPlanificacion:item.id_etapa_planificacion,idEtapaAdicional:item.id_etapa_adicional_ot?.toString()||null,etapaAdicional:item.etapa_adicional?.nombre||null,estado:item.estado_operacional?.estado||'PENDIENTE',revision:item.estado_operacional?.revision||0,prioridad:item.estado_operacional?.prioridad||null,tiempoEstimadoMin:item.estado_operacional?.tiempo_estimado_min||null,instrucciones:item.estado_operacional?.instrucciones||item.tarea.tarea_instrucciones_de_oficina,observaciones:item.estado_operacional?.observaciones||null,fechaPlanificada:item.estado_operacional?.fecha_planificada||null,fechaInicio:item.tarea.tarea_fecha_de_inicio_en_terreno||item.tarea.tarea_fecha_de_inicio||null,fechaTermino:item.tarea.tarea_fecha_de_termino||null,area:item.estado_operacional?{id:item.estado_operacional.id_area_trabajo.toString(),nombre:item.estado_operacional.area.area_trabajo_nombre_area||`Área ${item.estado_operacional.id_area_trabajo}`}:null,responsable:item.estado_operacional?.empleado_responsable?{id:item.estado_operacional.empleado_responsable.id_empleado,nombre:nombreCompleto(item.estado_operacional.empleado_responsable)}:null,ejecuciones,resultadoValidado};
    });
    const grupos=new Map<number,{orden:number,nombre:string,total:number,cerradas:number}>();for(const tarea of tareasProduccion){const nombreEtapa=tarea.etapaAdicional||(planificacion?.etapas||[]).find((etapa:any)=>etapa.orden===tarea.ordenEtapa||etapa.id===tarea.idEtapaPlanificacion)?.nombre||`Etapa ${tarea.ordenEtapa}`;const actual=grupos.get(tarea.ordenEtapa)||{orden:tarea.ordenEtapa,nombre:nombreEtapa,total:0,cerradas:0};actual.total++;if(tarea.estado==='CERRADA')actual.cerradas++;grupos.set(tarea.ordenEtapa,actual);}const cerradas=tareasProduccion.filter((t:any)=>t.estado==='CERRADA').length;const avance={total:tareasProduccion.length,pendientes:tareasProduccion.filter((t:any)=>t.estado==='PENDIENTE'||t.estado==='ASIGNADA').length,enEjecucion:tareasProduccion.filter((t:any)=>t.estado==='EN_EJECUCION'||t.estado==='PENDIENTE_VALIDACION').length,cerradas,porcentaje:tareasProduccion.length?Math.round(cerradas*100/tareasProduccion.length):0,etapas:[...grupos.values()]};
    for(const tarea of tareasProduccion){
      (tarea as any).cambiosResponsable=(unidad.historial_produccion||[]).filter((evento:any)=>evento.id_tarea_ejecutable_ot?.toString()===tarea.idEjecutable&&evento.evento==='RESPONSABLE_REASIGNADO').map((evento:any)=>({fecha:evento.fecha_evento,usuario:nombreUsuario(evento.actor),empleado:evento.empleado_involucrado?nombreCompleto(evento.empleado_involucrado):null,motivo:evento.motivo}));
      (tarea as any).correcciones=[...incidencias.values()].filter((incidencia:any)=>incidencia.tarea.id===tarea.id);
    }
    const historialOperacional=[
      ...((unidad.historial||[]).some((evento:any)=>/CREAD/.test(evento.evento))?[]:[{id:`creacion-${unidad.id_unidad_fisica_ot}`,tipo:'OT_CREADA',detalle:'Orden de Trabajo creada',fecha:unidad.creado_en,usuario:nombreUsuario(unidad.creador)}]),
      ...(unidad.historial||[]).map((evento:any)=>({id:`unidad-${evento.id_historial_unidad_fisica_ot}`,tipo:evento.evento,detalle:evento.motivo,fecha:evento.fecha_evento,usuario:nombreUsuario(evento.usuario)})),
      ...(rectificacion?.historial||[]).map((evento:any)=>({id:`rect-${evento.id_historial_rectificacion}`,tipo:evento.tipo_modificacion,detalle:evento.motivo,fecha:evento.fecha_evento,usuario:nombreUsuario(evento.usuario)})),
      ...(unidad.historial_produccion||[]).map((evento:any)=>({id:`prod-${evento.id_historial_cambio}`,tipo:evento.evento,detalle:evento.motivo,fecha:evento.fecha_evento,usuario:nombreUsuario(evento.actor)})),
      ...tareasProduccion.flatMap((tarea:any)=>tarea.ejecuciones.map((ejecucion:any)=>({id:`ejec-${ejecucion.id}`,tipo:ejecucion.validacion==='validada'?'RESULTADO_VALIDADO':'EJECUCION_REGISTRADA',detalle:`${tarea.titulo} · ${ejecucion.estado}`,fecha:ejecucion.fecha,usuario:ejecucion.ejecutor}))),
    ].filter(evento=>evento.fecha).sort((a,b)=>new Date(b.fecha).getTime()-new Date(a.fecha).getTime());
    return {
      idOrdenTrabajo:unidad.id_orden_trabajo.toString(),idUnidad:unidad.id_unidad_fisica_ot.toString(),estado:this.estadoVisibleOrden(unidad),fechaCreacion:unidad.creado_en,
      cotizacion:{id:unidad.id_cotizacion,cliente:unidad.cotizacion.ficha_cliente.cliente_financiero.nombre_razon_social_referencia,fecha:unidad.cotizacion.fecha_emision,notaVenta:unidad.cotizacion.nota_venta?.numero_nota_venta||null},
      producto:{id:unidad.id_extension_producto_comercial,nombre:unidad.producto.nombre_comercial,codigo:unidad.producto.codigo_comercial,familia:unidad.producto.familia.nombre,numeroUnidad:unidad.numero_unidad,caracteristicas:unidad.producto.caracteristicas_tecnicas},
      referencia:{alto:unidad.detalle.medida_alto_referencial?.toString()||null,ancho:unidad.detalle.medida_ancho_referencial?.toString()||null,espesor:unidad.detalle.medida_espesor_referencial?.toString()||null,descripcion:unidad.detalle.descripcion_item_cotizado},
      rectificacion:rectificacion?{id:rectificacion.id_rectificacion_ot.toString(),revision:rectificacion.revision,estado:rectificacion.estado,fechaAsignacion:rectificacion.fecha_asignacion,fechaInicio:rectificacion.fecha_inicio,fechaRectificacion:rectificacion.fecha_rectificacion,observacionesTecnicas:rectificacion.observaciones_tecnicas,caracteristicasParticulares:rectificacion.caracteristicas_particulares,necesitaTareasAdicionales:rectificacion.necesita_tareas_adicionales,comentariosFabricacion:rectificacion.comentarios_fabricacion,comentariosInstalacion:rectificacion.comentarios_instalacion,registradoPor:nombreUsuario(rectificacion.actualizador),empleado:rectificacion.empleado_rectificador?{id:rectificacion.empleado_rectificador.id_empleado,nombre:nombreCompleto(rectificacion.empleado_rectificador),rut:rectificacion.empleado_rectificador.rut_empleado}:null}:null,
      especificacion:especificacion?{id:especificacion.especificacion_puerta_especificacion_puerta_id.toString(),modeloPuerta:especificacion.especificacion_puerta_modelo_puerta,zona:especificacion.especificacion_puerta_zona,sentidoApertura:especificacion.especificacion_puerta_sentido_apertura,materialidadVano:especificacion.especificacion_puerta_materialidad_vano,materialidadMarcoActual:especificacion.especificacion_puerta_materialidad_marco_actual,solucionMarco:especificacion.especificacion_puerta_solucion_marco,hojaPasiva:especificacion.especificacion_puerta_hoja_pasiva,hojaActiva:especificacion.especificacion_puerta_hoja_activa,disenoPuerta:especificacion.especificacion_puerta_diseno_puerta,observacionesDiseno:especificacion.especificacion_puerta_observaciones_de_diseno,cubrejuntas:especificacion.especificacion_puerta_cubrejuntas,bisagras:especificacion.especificacion_puerta_bisagras,observaciones:especificacion.especificacion_puerta_observaciones}:null,
      medidas:medidaSalida,medidasObligatorias:this.medidasObligatoriasOt(unidad.version_plantilla.contenido),planificacion:unidad.planificacion_actual,planificacionInicial:unidad.planificacion_inicial,empleadosProduccion,
      versiones:(rectificacion?.versiones||[]).map((version:any)=>({id:version.id_version_rectificacion.toString(),numero:version.numero_version,fecha:version.enviado_en,enviadoPor:nombreUsuario(version.enviador),datos:version.datos_rectificacion,planificacion:version.planificacion,decision:version.decision?{tipo:version.decision.decision,motivo:version.decision.motivo,observacionesTecnicas:version.decision.observaciones_tecnicas,fecha:version.decision.decidido_en,usuario:nombreUsuario(version.decision.actor)}:null})),
      liberacion:unidad.liberacion?{id:unidad.liberacion.id_liberacion_ot.toString(),fecha:unidad.liberacion.liberado_en,usuario:nombreUsuario(unidad.liberacion.actor)}:null,
      historial:(rectificacion?.historial||[]).map((evento:any)=>({id:evento.id_historial_rectificacion.toString(),entidad:evento.entidad,tipo:evento.tipo_modificacion,anterior:evento.valor_anterior,nuevo:evento.valor_nuevo,motivo:evento.motivo,fecha:evento.fecha_evento,usuario:nombreUsuario(evento.usuario)})),
      tareasProduccion,avance,visitasRelacionadas:[...visitas.values()],incidencias:[...incidencias.values()],historialOperacional,etapasAdicionales:(unidad.etapas_adicionales||[]).map((etapa:any)=>({id:etapa.id_etapa_adicional_ot.toString(),nombre:etapa.nombre,descripcion:etapa.descripcion,orden:etapa.orden,idArea:etapa.id_area_trabajo.toString(),area:etapa.area.area_trabajo_nombre_area,motivo:etapa.motivo})),
      historialProduccion:(unidad.historial_produccion||[]).map((evento:any)=>({id:evento.id_historial_cambio.toString(),entidad:evento.entidad,tipo:evento.evento,anterior:evento.valor_anterior,nuevo:evento.valor_nuevo,motivo:evento.motivo,fecha:evento.fecha_evento,usuario:nombreUsuario(evento.actor),empleado:evento.empleado_involucrado?nombreCompleto(evento.empleado_involucrado):null})),
      cierre:unidad.cierre_produccion?{fecha:unidad.cierre_produccion.finalizado_en,usuario:nombreUsuario(unidad.cierre_produccion.actor),observaciones:unidad.cierre_produccion.observaciones,resumen:unidad.cierre_produccion.resumen_tareas}:null,
    };
  }

  async listarOrdenesTrabajoRectificacion(consulta:Record<string,unknown>,actor:ActorTerrenoM6) {
    const where:Prisma.unidad_fisica_orden_trabajoWhereInput={};
    const busqueda=texto(consulta.busqueda,80);if(busqueda){if(!/^\d+$/.test(busqueda))return[];where.id_orden_trabajo=BigInt(busqueda);}
    if(consulta.cotizacion!==undefined&&consulta.cotizacion!=='')where.id_cotizacion=identificador(consulta.cotizacion);
    const cliente=texto(consulta.cliente,150);if(cliente)where.cotizacion={ficha_cliente:{cliente_financiero:{nombre_razon_social_referencia:{contains:cliente,mode:'insensitive'}}}};
    const producto=texto(consulta.producto,150);if(producto)where.producto={OR:[{nombre_comercial:{contains:producto,mode:'insensitive'}},{codigo_comercial:{contains:producto,mode:'insensitive'}}]};
    const idEmpleadoFiltro=consulta.empleado!==undefined&&consulta.empleado!==''?identificador(consulta.empleado):null;
    if(!this.puedeGestionarTodasLasRectificaciones(actor)){if(!actor.alcanceEmpleadoId)return[];where.rectificacion={is:{id_empleado_rectificador:actor.alcanceEmpleadoId}};}
    else if(idEmpleadoFiltro)where.rectificacion={is:{id_empleado_rectificador:idEmpleadoFiltro}};
    const desde=consulta.desde?fechaEntrada(consulta.desde,'Fecha desde'):null;const hasta=consulta.hasta?fechaEntrada(consulta.hasta,'Fecha hasta'):null;
    if(desde||hasta)where.creado_en={...(desde?{gte:desde}:{}),...(hasta?{lt:new Date(hasta.getTime()+86400000)}:{})};
    const unidades=await prisma.unidad_fisica_orden_trabajo.findMany({where,include:this.incluirGestionOrdenTrabajo,orderBy:{creado_en:'desc'}});
    const estado=texto(consulta.estado,60).toUpperCase();const grupoRectificacion=['PENDIENTE_RECTIFICACION','RECTIFICACION_ASIGNADA','RECTIFICACION_EN_PROCESO'];const presentadas=unidades.map(unidad=>this.presentarGestionOrdenTrabajo(unidad)).filter(item=>!estado||(estado==='PENDIENTE_RECTIFICACION'?grupoRectificacion.includes(item.estado):item.estado===estado));const idsEmpleados=[...new Set(presentadas.flatMap(item=>item.empleadosProduccion))];const responsables=idsEmpleados.length?await prisma.empleado.findMany({where:{id_empleado:{in:idsEmpleados}},select:{id_empleado:true,nombres:true,apellido_paterno:true,apellido_materno:true}}):[];const nombres=new Map(responsables.map(empleado=>[empleado.id_empleado,nombreCompleto(empleado)]));return presentadas.map(item=>({...item,responsablesProduccion:item.empleadosProduccion.map(id=>({id,nombre:nombres.get(id)||`Empleado ${id}`}))}));
  }

  async obtenerOrdenTrabajoRectificacion(idOrden:number,actor:ActorTerrenoM6) {
    const unidad=await prisma.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:this.incluirGestionOrdenTrabajo});
    if(!unidad)throw new ErrorAplicacion(404,'Orden de Trabajo del flujo comercial no encontrada');this.verificarAccesoRectificacion(unidad,actor);
    const areas=await prisma.area_trabajo.findMany({where:{area_trabajo_activo:true},select:{area_trabajo_id_area:true,area_trabajo_nombre_area:true},orderBy:{area_trabajo_nombre_area:'asc'}});
    const areaTerreno=await prisma.area_trabajo.findFirst({where:{area_trabajo_activo:true,OR:[{area_trabajo_nombre_area:{contains:'terreno',mode:'insensitive'}},{area_trabajo_clasificacion:{contains:'terreno',mode:'insensitive'}}]}});
    const empleados=areaTerreno?await prisma.asignacion_area_empleado.findMany({where:{id_area_trabajo:areaTerreno.area_trabajo_id_area,vigencia_hasta:null,empleado:{estado_laboral:'activo'}},include:{empleado:true},orderBy:{empleado:{apellido_paterno:'asc'}}}):[];
    const asignacionesActivas=await prisma.asignacion_area_empleado.findMany({where:{vigencia_hasta:null,empleado:{estado_laboral:'activo'},area:{area_trabajo_activo:true}},include:{empleado:true},orderBy:{empleado:{apellido_paterno:'asc'}}});
    const tareas=await prisma.catalogo_tarea_fabricacion.findMany({where:{estado:'ACTIVA'},orderBy:{nombre:'asc'}});
    return {...this.presentarGestionOrdenTrabajo(unidad),catalogos:{areas:areas.map(area=>({id:area.area_trabajo_id_area.toString(),nombre:area.area_trabajo_nombre_area||`Área ${area.area_trabajo_id_area}`})),empleadosTerreno:empleados.map(item=>({id:item.empleado.id_empleado,nombre:nombreCompleto(item.empleado),rut:item.empleado.rut_empleado})),empleadosPorArea:asignacionesActivas.map(item=>({id:item.empleado.id_empleado,nombre:nombreCompleto(item.empleado),idArea:item.id_area_trabajo.toString()})),tareas:tareas.map(tarea=>({id:tarea.id_tarea_fabricacion,nombre:tarea.nombre,descripcion:tarea.descripcion,idArea:tarea.id_area_trabajo.toString(),tiempoEstimadoMin:tarea.tiempo_estimado_min}))}};
  }

  async asignarRectificadorOrdenTrabajo(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6) {
    const idEmpleado=identificador(entrada.idEmpleado);const motivo=texto(entrada.motivo,1000);if(!motivo)throw new ErrorAplicacion(400,'El motivo de la asignación es obligatorio');
    return prisma.$transaction(async tx=>{
      const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{rectificacion:true}});if(!unidad)throw new ErrorAplicacion(404,'Orden de Trabajo no encontrada');
      const asignacion=await tx.asignacion_area_empleado.findFirst({where:{id_empleado:idEmpleado,vigencia_hasta:null,empleado:{estado_laboral:'activo'},area:{area_trabajo_activo:true,OR:[{area_trabajo_nombre_area:{contains:'terreno',mode:'insensitive'}},{area_trabajo_clasificacion:{contains:'terreno',mode:'insensitive'}}]}},include:{empleado:true}});if(!asignacion)throw new ErrorAplicacion(409,'El empleado debe estar activo y asignado actualmente al área Terreno');
      if(unidad.rectificacion&&!this.estadosEditablesRectificacion.includes(unidad.rectificacion.estado))throw new ErrorAplicacion(409,'La rectificación enviada ya no admite reasignación silenciosa');
      const anterior=unidad.rectificacion?.id_empleado_rectificador||null;
      const rectificacion=unidad.rectificacion?await tx.rectificacion_orden_trabajo.update({where:{id_rectificacion_ot:unidad.rectificacion.id_rectificacion_ot},data:{id_empleado_rectificador:idEmpleado,estado:'RECTIFICACION_ASIGNADA',fecha_asignacion:new Date(),asignado_por:actor.id,actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}}):await tx.rectificacion_orden_trabajo.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_empleado_rectificador:idEmpleado,estado:'RECTIFICACION_ASIGNADA',fecha_asignacion:new Date(),asignado_por:actor.id,actualizado_por:actor.id}});
      await tx.unidad_fisica_orden_trabajo.update({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot},data:{estado:'RECTIFICACION_ASIGNADA',actualizado_en:new Date()}});await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{orden_trabajo_estado:'RECTIFICACION_ASIGNADA'}});
      await tx.historial_rectificacion_orden_trabajo.create({data:{id_rectificacion_ot:rectificacion.id_rectificacion_ot,entidad:'ASIGNACION',tipo_modificacion:'RECTIFICADOR_ASIGNADO',valor_anterior:{idEmpleado:anterior},valor_nuevo:{idEmpleado,nombre:nombreCompleto(asignacion.empleado)},motivo,usuario_id_usuario:actor.id}});
      return conAuditoriaRectificacion({mensaje:'Rectificador asignado',idOrdenTrabajo:idOrden,idEmpleado,estado:'RECTIFICACION_ASIGNADA'}, {idEmpleado:anterior},{idEmpleado,estado:'RECTIFICACION_ASIGNADA'});
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  private async normalizarPlanificacionRectificacion(tx:Prisma.TransactionClient,valor:unknown) {
    if(!valor||typeof valor!=='object'||Array.isArray(valor))throw new ErrorAplicacion(400,'Planificación inválida');const plan=valor as Record<string,any>;
    if(!Array.isArray(plan.etapas)||!plan.etapas.length)throw new ErrorAplicacion(400,'La planificación requiere al menos una etapa');
    const paresEmpleado:Array<{idEmpleado:number;idArea:bigint}>=[];const referenciasTarea:Array<{id:number;idArea:bigint}>=[];
    const etapas=plan.etapas.map((etapa:any,indice:number)=>{if(!etapa||typeof etapa!=='object'||!Array.isArray(etapa.tareas))throw new ErrorAplicacion(400,`Etapa ${indice+1} inválida`);const idArea=BigInt(identificador(etapa.idAreaTrabajo));const nombre=texto(etapa.nombre,150);if(!nombre)throw new ErrorAplicacion(400,`Etapa ${indice+1} sin nombre`);const tareas=etapa.tareas.map((tarea:any,posicion:number)=>{const nombreTarea=texto(tarea?.nombre,150);if(!nombreTarea)throw new ErrorAplicacion(400,`Tarea ${posicion+1} sin nombre`);const idEmpleado=tarea.idEmpleado?identificador(tarea.idEmpleado):null;const idCatalogo=tarea.idTareaFabricacion?identificador(tarea.idTareaFabricacion):null;if(idEmpleado)paresEmpleado.push({idEmpleado,idArea});if(idCatalogo)referenciasTarea.push({id:idCatalogo,idArea});return{id:typeof tarea.id==='string'?tarea.id:`tarea-${indice+1}-${posicion+1}`,orden:posicion+1,idTareaFabricacion:idCatalogo,nombre:nombreTarea,descripcion:texto(tarea.descripcion,4000)||null,instrucciones:texto(tarea.instrucciones,4000)||null,tiempoEstimadoMin:tarea.tiempoEstimadoMin===null||tarea.tiempoEstimadoMin===undefined||tarea.tiempoEstimadoMin===''?null:enteroPositivo(tarea.tiempoEstimadoMin,'Tiempo estimado'),idEmpleado};});return{id:typeof etapa.id==='string'?etapa.id:`etapa-${indice+1}`,orden:indice+1,idAreaTrabajo:idArea.toString(),nombre,descripcion:texto(etapa.descripcion,4000)||null,instrucciones:texto(etapa.instrucciones,4000)||null,tiempoEstimadoMin:etapa.tiempoEstimadoMin===null||etapa.tiempoEstimadoMin===undefined||etapa.tiempoEstimadoMin===''?null:enteroPositivo(etapa.tiempoEstimadoMin,'Tiempo estimado'),tareas};});
    if(!etapas.some(etapa=>etapa.tareas.length))throw new ErrorAplicacion(400,'La planificación no puede quedar sin tareas');const idsArea=[...new Set(etapas.map(etapa=>etapa.idAreaTrabajo))];const areas=await tx.area_trabajo.count({where:{area_trabajo_id_area:{in:idsArea.map(BigInt)},area_trabajo_activo:true}});if(areas!==idsArea.length)throw new ErrorAplicacion(409,'La planificación contiene áreas inactivas');
    for(const referencia of referenciasTarea){if(!await tx.catalogo_tarea_fabricacion.findFirst({where:{id_tarea_fabricacion:referencia.id,estado:'ACTIVA',id_area_trabajo:referencia.idArea}}))throw new ErrorAplicacion(409,'Una tarea de catálogo ya no está activa en el área seleccionada');}
    for(const par of paresEmpleado){if(!await tx.asignacion_area_empleado.findFirst({where:{id_empleado:par.idEmpleado,id_area_trabajo:par.idArea,vigencia_hasta:null,empleado:{estado_laboral:'activo'}}}))throw new ErrorAplicacion(409,'Un responsable de tarea ya no está activo en el área seleccionada');}
    return {etapas};
  }

  async guardarRectificacionOrdenTrabajo(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6) {
    const motivo=texto(entrada.motivo,1000);if(!motivo)throw new ErrorAplicacion(400,'El motivo del registro o modificación es obligatorio');
    return prisma.$transaction(async tx=>{
      const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{rectificacion:{include:{especificacion:{include:{medidas_puerta:true}}}}}});if(!unidad||!unidad.rectificacion)throw new ErrorAplicacion(409,'Asigna un empleado rectificador antes de registrar información');this.verificarAccesoRectificacion(unidad,actor);const rect=unidad.rectificacion;if(!this.estadosEditablesRectificacion.includes(rect.estado))throw new ErrorAplicacion(409,'La versión enviada no puede editarse silenciosamente');const revision=identificador(entrada.revision);if(revision!==rect.revision)throw new ErrorAplicacion(409,'La rectificación fue modificada por otro usuario; recarga la ficha');
      const especificacionEntrada=entrada.especificacion&&typeof entrada.especificacion==='object'?entrada.especificacion as Record<string,unknown>:{};const medidasEntrada=entrada.medidas&&typeof entrada.medidas==='object'?entrada.medidas as Record<string,unknown>:{};
      let especificacion=rect.especificacion;if(!especificacion){especificacion=await tx.especificaciones_puerta.create({data:{especificacion_puerta_modelo_puerta:texto(especificacionEntrada.modeloPuerta,200)||null},include:{medidas_puerta:true}});await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{especificaciones_puerta_id_especificacion_puerta:especificacion.especificacion_puerta_especificacion_puerta_id}});}
      const especificacionActual=especificacion;
      const datosEspecificacion:Record<string,unknown>={};for(const[campo,columna]of Object.entries(this.camposTextoLevantamiento))if(Object.prototype.hasOwnProperty.call(especificacionEntrada,campo))datosEspecificacion[columna]=texto(especificacionEntrada[campo],campo==='observaciones'||campo==='observacionesDiseno'?2000:200)||null;if(Object.prototype.hasOwnProperty.call(especificacionEntrada,'cubrejuntas')){const valor=especificacionEntrada.cubrejuntas;if(valor!==null&&typeof valor!=='boolean')throw new ErrorAplicacion(400,'Cubrejuntas inválido');datosEspecificacion.especificacion_puerta_cubrejuntas=valor;}if(Object.keys(datosEspecificacion).length)await tx.especificaciones_puerta.update({where:{especificacion_puerta_especificacion_puerta_id:especificacionActual.especificacion_puerta_especificacion_puerta_id},data:datosEspecificacion});
      const actual=especificacionActual.id_medidas?especificacionActual.medidas_puerta.find(item=>item.medidas_puerta_medidas_id===especificacionActual.id_medidas)||null:null;const datosMedidas:Record<string,unknown>={};for(const[campo,columna]of Object.entries(this.camposMedidasLevantamiento))datosMedidas[columna]=Object.prototype.hasOwnProperty.call(medidasEntrada,campo)?decimalOpcional(medidasEntrada[campo],campo):(actual as any)?.[columna]??null;let nuevaMedida=actual;if(Object.keys(medidasEntrada).length){const cambio=await tx.historial_cambio_orden_trabajo.create({data:{id_especificaciones_puerta:especificacionActual.especificacion_puerta_especificacion_puerta_id,historial_cambio_orden_trabajo_version_antigua:`r${rect.revision}`,historial_cambio_orden_trabajo_version_nueva:`r${rect.revision+1}`,historial_cambio_orden_trabajo_fecha_hora:new Date(),historial_cambio_orden_trabajo_descripcion:motivo}});nuevaMedida=await tx.medidas_puerta.create({data:{...datosMedidas,id_especificacion_puerta:especificacionActual.especificacion_puerta_especificacion_puerta_id,id_cambio:cambio.historial_cambio_orden_trabajo_id_cambio}});await tx.especificaciones_puerta.update({where:{especificacion_puerta_especificacion_puerta_id:especificacionActual.especificacion_puerta_especificacion_puerta_id},data:{id_medidas:nuevaMedida.medidas_puerta_medidas_id}});}
      const planificacion=entrada.planificacion===undefined?unidad.planificacion_actual:await this.normalizarPlanificacionRectificacion(tx,entrada.planificacion);const anterior={estado:rect.estado,revision:rect.revision,planificacion:unidad.planificacion_actual,idMedidas:actual?.medidas_puerta_medidas_id.toString()||null};const fecha=fechaEntrada(entrada.fechaRectificacion,'Fecha de rectificación',false);
      const actualizada=await tx.rectificacion_orden_trabajo.updateMany({where:{id_rectificacion_ot:rect.id_rectificacion_ot,revision:rect.revision},data:{id_especificacion_puerta:especificacionActual.especificacion_puerta_especificacion_puerta_id,estado:'RECTIFICACION_EN_PROCESO',fecha_inicio:rect.fecha_inicio||new Date(),fecha_rectificacion:fecha,observaciones_tecnicas:texto(entrada.observacionesTecnicas,5000)||null,caracteristicas_particulares:(entrada.caracteristicasParticulares&&typeof entrada.caracteristicasParticulares==='object'?entrada.caracteristicasParticulares:{}) as Prisma.InputJsonValue,necesita_tareas_adicionales:entrada.necesitaTareasAdicionales===true,comentarios_fabricacion:texto(entrada.comentariosFabricacion,5000)||null,comentarios_instalacion:texto(entrada.comentariosInstalacion,5000)||null,actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}});if(actualizada.count!==1)throw new ErrorAplicacion(409,'La rectificación fue modificada concurrentemente');
      await tx.unidad_fisica_orden_trabajo.update({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot},data:{estado:'RECTIFICACION_EN_PROCESO',planificacion_actual:planificacion as Prisma.InputJsonValue,revision:{increment:1},actualizado_en:new Date()}});await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{orden_trabajo_estado:'RECTIFICACION_EN_PROCESO'}});
      const nuevo={estado:'RECTIFICACION_EN_PROCESO',revision:rect.revision+1,planificacion,idMedidas:nuevaMedida?.medidas_puerta_medidas_id.toString()||null};await tx.historial_rectificacion_orden_trabajo.create({data:{id_rectificacion_ot:rect.id_rectificacion_ot,entidad:'RECTIFICACION',tipo_modificacion:'BORRADOR_ACTUALIZADO',valor_anterior:anterior as Prisma.InputJsonValue,valor_nuevo:nuevo as Prisma.InputJsonValue,motivo,usuario_id_usuario:actor.id}});return conAuditoriaRectificacion({mensaje:'Rectificación guardada',idOrdenTrabajo:idOrden,estado:'RECTIFICACION_EN_PROCESO',revision:rect.revision+1},anterior,nuevo);
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  async enviarRectificacionAprobacion(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6) {
    const motivo=texto(entrada.motivo,1000)||'Envío a aprobación técnica';
    return prisma.$transaction(async tx=>{
      const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{version_plantilla:true,rectificacion:{include:{especificacion:{include:{medidas_puerta:true}},versiones:true}}}});if(!unidad||!unidad.rectificacion)throw new ErrorAplicacion(409,'La OT no tiene rectificación registrada');this.verificarAccesoRectificacion(unidad,actor);const rect=unidad.rectificacion;if(rect.estado!=='RECTIFICACION_EN_PROCESO')throw new ErrorAplicacion(409,'La rectificación debe estar en proceso antes de enviarse');if(identificador(entrada.revision)!==rect.revision)throw new ErrorAplicacion(409,'La rectificación cambió; recarga antes de enviar');if(!rect.id_empleado_rectificador||!rect.fecha_rectificacion||!rect.especificacion)throw new ErrorAplicacion(409,'Completa empleado, fecha y especificación técnica');const medida=rect.especificacion.medidas_puerta.find(item=>item.medidas_puerta_medidas_id===rect.especificacion!.id_medidas);if(!medida)throw new ErrorAplicacion(409,'Registra medidas reales antes de enviar');
      const configuradas=this.medidasObligatoriasOt(unidad.version_plantilla.contenido);const faltantes=configuradas.filter(campo=>{const columna=this.camposMedidasLevantamiento[campo];return(medida as any)[columna]===null;});if(faltantes.length)throw new ErrorAplicacion(409,`Faltan medidas obligatorias: ${faltantes.join(', ')}`);const plan=unidad.planificacion_actual as any;if(!Array.isArray(plan?.etapas)||!plan.etapas.length||!plan.etapas.some((etapa:any)=>Array.isArray(etapa.tareas)&&etapa.tareas.length))throw new ErrorAplicacion(409,'La planificación actual no contiene tareas válidas');
      const numeroVersion=rect.versiones.reduce((max,item)=>Math.max(max,item.numero_version),0)+1;const datos={fechaRectificacion:rect.fecha_rectificacion,idEmpleadoRectificador:rect.id_empleado_rectificador,idEspecificacion:rect.id_especificacion_puerta,idMedidas:medida.medidas_puerta_medidas_id.toString(),medidasObligatorias:configuradas,registradoPor:rect.actualizado_por.toString(),especificacion:{modeloPuerta:rect.especificacion.especificacion_puerta_modelo_puerta,zona:rect.especificacion.especificacion_puerta_zona,sentidoApertura:rect.especificacion.especificacion_puerta_sentido_apertura,materialidadVano:rect.especificacion.especificacion_puerta_materialidad_vano,solucionMarco:rect.especificacion.especificacion_puerta_solucion_marco},medidas:Object.fromEntries(Object.entries(this.camposMedidasLevantamiento).map(([campo,columna])=>[campo,(medida as any)[columna]?.toString()||null])),observacionesTecnicas:rect.observaciones_tecnicas,caracteristicasParticulares:rect.caracteristicas_particulares,necesitaTareasAdicionales:rect.necesita_tareas_adicionales,comentariosFabricacion:rect.comentarios_fabricacion,comentariosInstalacion:rect.comentarios_instalacion};await tx.version_rectificacion_orden_trabajo.create({data:{id_rectificacion_ot:rect.id_rectificacion_ot,numero_version:numeroVersion,datos_rectificacion:datos as Prisma.InputJsonValue,planificacion:unidad.planificacion_actual as Prisma.InputJsonValue,enviado_por:actor.id}});
      await tx.rectificacion_orden_trabajo.update({where:{id_rectificacion_ot:rect.id_rectificacion_ot},data:{estado:'PENDIENTE_APROBACION_TECNICA',actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}});await tx.unidad_fisica_orden_trabajo.update({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot},data:{estado:'PENDIENTE_APROBACION_TECNICA',actualizado_en:new Date()}});await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{orden_trabajo_estado:'PENDIENTE_APROBACION_TECNICA'}});const anterior={estado:rect.estado,revision:rect.revision};const nuevo={estado:'PENDIENTE_APROBACION_TECNICA',revision:rect.revision+1,numeroVersion};await tx.historial_rectificacion_orden_trabajo.create({data:{id_rectificacion_ot:rect.id_rectificacion_ot,entidad:'RECTIFICACION',tipo_modificacion:'ENVIADA_APROBACION_TECNICA',valor_anterior:anterior,valor_nuevo:nuevo,motivo,usuario_id_usuario:actor.id}});return conAuditoriaRectificacion({mensaje:'Rectificación enviada a aprobación técnica',idOrdenTrabajo:idOrden,estado:nuevo.estado,numeroVersion},anterior,nuevo);
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  private async verificarSeparacionAprobacion(tx:Prisma.TransactionClient,rectificacion:{id_empleado_rectificador:number|null;actualizado_por:bigint},version:{enviado_por:bigint},actor:ActorTerrenoM6) {
    if(version.enviado_por===actor.id||rectificacion.actualizado_por===actor.id)throw new ErrorAplicacion(403,'Quien registró o envió la rectificación no puede aprobarla');
    if(rectificacion.id_empleado_rectificador===null)return;
    const cuenta=await tx.usuario.findUnique({where:{usuario_id_usuario:actor.id},include:{empleado_seguridad:true,empleado:true}});
    const ids=[cuenta?.empleado_seguridad?.id_empleado,cuenta?.empleado?.id_empleado].filter((id):id is number=>typeof id==='number');
    if(ids.includes(rectificacion.id_empleado_rectificador))throw new ErrorAplicacion(403,'El empleado que realizó la rectificación no puede aprobarla');
  }

  async aprobarRectificacionOrdenTrabajo(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6) {
    const idVersion=BigInt(identificador(entrada.idVersion));const observaciones=texto(entrada.observacionesTecnicas,5000)||null;
    return prisma.$transaction(async tx=>{
      const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{rectificacion:{include:{versiones:{include:{decision:true},orderBy:{numero_version:'desc'}}}}}});if(!unidad?.rectificacion)throw new ErrorAplicacion(404,'Rectificación no encontrada');const rect=unidad.rectificacion;const version=rect.versiones[0];if(!version||version.id_version_rectificacion!==idVersion)throw new ErrorAplicacion(409,'Sólo puede aprobarse la versión vigente enviada');
      if(version.decision){if(version.decision.decision==='APROBADA'&&rect.estado==='RECTIFICACION_APROBADA')return conAuditoriaRectificacion({mensaje:'La versión ya estaba aprobada',idOrdenTrabajo:idOrden,estado:rect.estado,numeroVersion:version.numero_version},{estado:rect.estado},{estado:rect.estado});throw new ErrorAplicacion(409,'La versión ya fue revisada');}
      if(rect.estado!=='PENDIENTE_APROBACION_TECNICA'||unidad.estado!=='PENDIENTE_APROBACION_TECNICA')throw new ErrorAplicacion(409,'La rectificación no está pendiente de aprobación técnica');await this.verificarSeparacionAprobacion(tx,rect,version,actor);
      await tx.decision_rectificacion_orden_trabajo.create({data:{id_rectificacion_ot:rect.id_rectificacion_ot,id_version_rectificacion:version.id_version_rectificacion,decision:'APROBADA',observaciones_tecnicas:observaciones,decidido_por:actor.id}});
      const cambio=await tx.rectificacion_orden_trabajo.updateMany({where:{id_rectificacion_ot:rect.id_rectificacion_ot,estado:'PENDIENTE_APROBACION_TECNICA',revision:rect.revision},data:{estado:'RECTIFICACION_APROBADA',actualizado_en:new Date(),revision:{increment:1}}});if(cambio.count!==1)throw new ErrorAplicacion(409,'La rectificación fue revisada concurrentemente');await tx.unidad_fisica_orden_trabajo.update({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot},data:{estado:'RECTIFICACION_APROBADA',actualizado_en:new Date()}});await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{orden_trabajo_estado:'RECTIFICACION_APROBADA'}});const anterior={estado:'PENDIENTE_APROBACION_TECNICA',numeroVersion:version.numero_version};const nuevo={estado:'RECTIFICACION_APROBADA',numeroVersion:version.numero_version};await tx.historial_rectificacion_orden_trabajo.create({data:{id_rectificacion_ot:rect.id_rectificacion_ot,entidad:'REVISION_TECNICA',tipo_modificacion:'RECTIFICACION_APROBADA',valor_anterior:anterior,valor_nuevo:nuevo,motivo:observaciones,usuario_id_usuario:actor.id}});return conAuditoriaRectificacion({mensaje:'Rectificación aprobada; la OT aún no está liberada',idOrdenTrabajo:idOrden,estado:nuevo.estado,numeroVersion:version.numero_version},anterior,nuevo);
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  async devolverRectificacionOrdenTrabajo(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6) {
    const idVersion=BigInt(identificador(entrada.idVersion));const motivo=texto(entrada.motivo,2000);const observaciones=texto(entrada.observacionesTecnicas,5000);if(!motivo||!observaciones)throw new ErrorAplicacion(400,'El motivo y las observaciones técnicas son obligatorios');
    return prisma.$transaction(async tx=>{
      const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{rectificacion:{include:{versiones:{include:{decision:true},orderBy:{numero_version:'desc'}}}}}});if(!unidad?.rectificacion)throw new ErrorAplicacion(404,'Rectificación no encontrada');const rect=unidad.rectificacion;const version=rect.versiones[0];if(!version||version.id_version_rectificacion!==idVersion)throw new ErrorAplicacion(409,'Sólo puede devolverse la versión vigente enviada');if(version.decision){if(version.decision.decision==='DEVUELTA'&&rect.estado==='RECTIFICACION_DEVUELTA')return conAuditoriaRectificacion({mensaje:'La versión ya estaba devuelta',idOrdenTrabajo:idOrden,estado:rect.estado,numeroVersion:version.numero_version},{estado:rect.estado},{estado:rect.estado});throw new ErrorAplicacion(409,'La versión ya fue revisada');}if(rect.estado!=='PENDIENTE_APROBACION_TECNICA')throw new ErrorAplicacion(409,'La rectificación no está pendiente de revisión');
      await tx.decision_rectificacion_orden_trabajo.create({data:{id_rectificacion_ot:rect.id_rectificacion_ot,id_version_rectificacion:version.id_version_rectificacion,decision:'DEVUELTA',motivo,observaciones_tecnicas:observaciones,decidido_por:actor.id}});const cambio=await tx.rectificacion_orden_trabajo.updateMany({where:{id_rectificacion_ot:rect.id_rectificacion_ot,estado:'PENDIENTE_APROBACION_TECNICA',revision:rect.revision},data:{estado:'RECTIFICACION_DEVUELTA',actualizado_en:new Date(),revision:{increment:1}}});if(cambio.count!==1)throw new ErrorAplicacion(409,'La rectificación fue revisada concurrentemente');await tx.unidad_fisica_orden_trabajo.update({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot},data:{estado:'RECTIFICACION_DEVUELTA',actualizado_en:new Date()}});await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{orden_trabajo_estado:'RECTIFICACION_DEVUELTA'}});const anterior={estado:'PENDIENTE_APROBACION_TECNICA',numeroVersion:version.numero_version};const nuevo={estado:'RECTIFICACION_DEVUELTA',numeroVersion:version.numero_version,motivo,observaciones};await tx.historial_rectificacion_orden_trabajo.create({data:{id_rectificacion_ot:rect.id_rectificacion_ot,entidad:'REVISION_TECNICA',tipo_modificacion:'RECTIFICACION_DEVUELTA',valor_anterior:anterior,valor_nuevo:nuevo,motivo,usuario_id_usuario:actor.id}});return conAuditoriaRectificacion({mensaje:'Rectificación devuelta para corrección',idOrdenTrabajo:idOrden,estado:nuevo.estado,numeroVersion:version.numero_version},anterior,nuevo);
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  async liberarOrdenTrabajoRectificada(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6) {
    const idVersion=BigInt(identificador(entrada.idVersion));
    return prisma.$transaction(async tx=>{
      const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{rectificacion:{include:{versiones:{include:{decision:true},orderBy:{numero_version:'desc'}}}},liberacion:true}});if(!unidad?.rectificacion)throw new ErrorAplicacion(404,'Rectificación no encontrada');const rect=unidad.rectificacion;const version=rect.versiones[0];if(!version||version.id_version_rectificacion!==idVersion)throw new ErrorAplicacion(409,'La versión aprobada ya no es la vigente');
      if(unidad.liberacion){
        if(unidad.liberacion.id_version_rectificacion===idVersion)return conAuditoriaRectificacion({mensaje:'La OT ya estaba liberada',idOrdenTrabajo:idOrden,estado:'LIBERADA',tareas:await tx.tarea_ejecutable_unidad_ot.count({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot}})},{estado:'LIBERADA'},{estado:'LIBERADA'});
        if(rect.estado!=='RECTIFICACION_APROBADA'||unidad.estado!=='RECTIFICACION_APROBADA'||version.decision?.decision!=='APROBADA')throw new ErrorAplicacion(409,'La revisión técnica vigente debe estar aprobada antes de aplicarse');
        const aplicada=await tx.aplicacion_revision_tecnica_ot.findUnique({where:{id_version_rectificacion:idVersion}});
        if(!aplicada)await tx.aplicacion_revision_tecnica_ot.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_version_rectificacion:idVersion,aplicado_por:actor.id}});
        await tx.unidad_fisica_orden_trabajo.update({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot},data:{estado:'LIBERADA',actualizado_en:new Date(),revision:{increment:1}}});
        await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{orden_trabajo_estado:'en_progreso'}});
        await tx.historial_cambio_produccion_ot.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_version_rectificacion:idVersion,entidad:'REVISION_TECNICA',evento:'REVISION_TECNICA_APLICADA',valor_anterior:{idVersion:unidad.liberacion.id_version_rectificacion.toString()},valor_nuevo:{idVersion:idVersion.toString()},motivo:'Aplicación productiva de revisión técnica aprobada',usuario_id_usuario:actor.id}});
        return conAuditoriaRectificacion({mensaje:'Revisión técnica aprobada aplicada; producción habilitada',idOrdenTrabajo:idOrden,estado:'LIBERADA'},{estado:'RECTIFICACION_APROBADA'},{estado:'LIBERADA',idVersion:idVersion.toString()});
      }
      if(rect.estado!=='RECTIFICACION_APROBADA'||unidad.estado!=='RECTIFICACION_APROBADA'||version.decision?.decision!=='APROBADA')throw new ErrorAplicacion(409,'La OT requiere una versión vigente aprobada antes de liberarse');
      const plan=version.planificacion as any;if(!Array.isArray(plan?.etapas)||!plan.etapas.length)throw new ErrorAplicacion(409,'La versión aprobada no contiene etapas válidas');const tareas:Array<{etapa:any;tarea:any;ordenEtapa:number;ordenTarea:number}>=[];for(const[ie,etapa]of plan.etapas.entries()){if(!etapa||!etapa.idAreaTrabajo||!Array.isArray(etapa.tareas)||!etapa.tareas.length)throw new ErrorAplicacion(409,'Cada etapa requiere un área y al menos una tarea');for(const[it,tarea]of etapa.tareas.entries()){if(!texto(tarea?.nombre,150))throw new ErrorAplicacion(409,'La planificación aprobada contiene una tarea sin nombre');tareas.push({etapa,tarea,ordenEtapa:ie+1,ordenTarea:it+1});}}const idsArea:bigint[]=[...new Set<bigint>(plan.etapas.map((etapa:any)=>BigInt(identificador(etapa.idAreaTrabajo))) as bigint[])];if(await tx.area_trabajo.count({where:{area_trabajo_id_area:{in:idsArea},area_trabajo_activo:true}})!==idsArea.length)throw new ErrorAplicacion(409,'La planificación aprobada contiene áreas inactivas');
      for(const item of tareas)if(item.tarea.idEmpleado&&!await tx.asignacion_area_empleado.findFirst({where:{id_empleado:identificador(item.tarea.idEmpleado),id_area_trabajo:BigInt(item.etapa.idAreaTrabajo),vigencia_hasta:null,empleado:{estado_laboral:'activo'}}}))throw new ErrorAplicacion(409,'Existe un responsable que ya no está activo en el área planificada');
      for(const item of tareas){const creada=await tx.tarea.create({data:{tarea_titulo:texto(item.tarea.nombre,200),tarea_descripcion:texto(item.tarea.descripcion,2000)||null,tarea_instrucciones_de_oficina:texto(item.tarea.instrucciones,2000)||null,tarea_estado_de_tarea:'pendiente',tarea_fecha_de_creacion:new Date(),id_especificacion_puerta:rect.id_especificacion_puerta,id_orden_trabajo:unidad.id_orden_trabajo}});const idEmpleado=item.tarea.idEmpleado?identificador(item.tarea.idEmpleado):null;const ejecutable=await tx.tarea_ejecutable_unidad_ot.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_version_rectificacion:version.id_version_rectificacion,id_tarea:creada.tarea_tarea_id,id_etapa_planificacion:typeof item.etapa.id==='string'?item.etapa.id:`etapa-${item.ordenEtapa}`,id_tarea_planificacion:typeof item.tarea.id==='string'?item.tarea.id:`tarea-${item.ordenEtapa}-${item.ordenTarea}`,orden_etapa:item.ordenEtapa,orden_tarea:item.ordenTarea,id_empleado_planificado:idEmpleado}});await tx.estado_tarea_produccion_ot.create({data:{id_tarea_ejecutable_ot:ejecutable.id_tarea_ejecutable_ot,id_area_trabajo:BigInt(identificador(item.etapa.idAreaTrabajo)),id_empleado_responsable:idEmpleado,estado:idEmpleado?'ASIGNADA':'PENDIENTE',tiempo_estimado_min:item.tarea.tiempoEstimadoMin?identificador(item.tarea.tiempoEstimadoMin):null,instrucciones:texto(item.tarea.instrucciones,4000)||null,actualizado_por:actor.id}});if(idEmpleado){const empleado=await tx.empleado.findUnique({where:{id_empleado:idEmpleado},include:{cuenta_m4:true,usuario:true}});const cuenta=empleado?.cuenta_m4||empleado?.usuario[0];if(cuenta)await tx.tarea_usuario.create({data:{tarea_usuario_tarea_id:creada.tarea_tarea_id,tarea_usuario_usuario_id:cuenta.usuario_id_usuario}});}}
      await tx.liberacion_orden_trabajo.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_version_rectificacion:version.id_version_rectificacion,liberado_por:actor.id}});const cambio=await tx.unidad_fisica_orden_trabajo.updateMany({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,estado:'RECTIFICACION_APROBADA'},data:{estado:'LIBERADA',actualizado_en:new Date(),revision:{increment:1}}});if(cambio.count!==1)throw new ErrorAplicacion(409,'La OT fue liberada concurrentemente');await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{orden_trabajo_estado:'en_progreso'}});const anterior={estado:'RECTIFICACION_APROBADA',numeroVersion:version.numero_version};const nuevo={estado:'LIBERADA',numeroVersion:version.numero_version,tareas:tareas.length};await tx.historial_rectificacion_orden_trabajo.create({data:{id_rectificacion_ot:rect.id_rectificacion_ot,entidad:'ORDEN_TRABAJO',tipo_modificacion:'LIBERADA_A_PRODUCCION',valor_anterior:anterior,valor_nuevo:nuevo,motivo:'Liberación técnica de versión aprobada',usuario_id_usuario:actor.id}});return conAuditoriaRectificacion({mensaje:'OT liberada a producción',idOrdenTrabajo:idOrden,estado:'LIBERADA',tareas:tareas.length},anterior,nuevo);
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  async ajustarOrdenTrabajoTerreno(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6) {
    return this.corregirLevantamientoTerreno(id, entrada, actor, ['pendiente', 'activa']);
  }

  async liberarOrdenTrabajoTerreno(id: number, idOrden: number, actor: ActorTerrenoM6) {
    try {
      return await prisma.$transaction(async (tx) => {
        const contexto = await this.resolverLevantamientoTerreno(id, actor, tx);
        if (!contexto.medidas || contexto.especificacion.id_medidas === null) throw new ErrorAplicacion(409, 'La Orden de Trabajo requiere una medida vigente antes de liberarse');
        const orden = await tx.orden_trabajo.findUnique({ where: { orden_trabajo_id_orden: BigInt(idOrden) } });
        if (!orden) throw new ErrorAplicacion(404, 'Orden de Trabajo no encontrada');
        if (await tx.unidad_fisica_orden_trabajo.findUnique({ where: { id_orden_trabajo: orden.orden_trabajo_id_orden } })) throw new ErrorAplicacion(409, 'Las OT provenientes de cotizaciones requieren aprobación técnica antes de liberarse');
        if (orden.especificaciones_puerta_id_especificacion_puerta !== contexto.especificacion.especificacion_puerta_especificacion_puerta_id) throw new ErrorAplicacion(409, 'La Orden de Trabajo no pertenece al levantamiento indicado');
        const estado = orden.orden_trabajo_estado || '';
        if (!['pendiente', 'activa'].includes(estado)) throw new ErrorAplicacion(409, ['en_progreso', 'completada', 'cancelada'].includes(estado) ? `La Orden de Trabajo en estado ${estado} no puede liberarse nuevamente` : 'La Orden de Trabajo tiene un estado no reconocido');
        const actualizada = await tx.orden_trabajo.updateMany({
          where: { orden_trabajo_id_orden: orden.orden_trabajo_id_orden, orden_trabajo_estado: estado },
          data: { orden_trabajo_estado: 'en_progreso' },
        });
        if (actualizada.count !== 1) throw new ErrorAplicacion(409, 'La Orden de Trabajo fue liberada o modificada concurrentemente');
        return this.presentarLevantamientoTerreno(await this.resolverLevantamientoTerreno(id, actor, tx));
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (esConflictoSerializable(error)) throw new ErrorAplicacion(409, 'La Orden de Trabajo fue liberada o modificada concurrentemente');
      throw error;
    }
  }

  async generarTareasProduccion(id: number, idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6) {
    if (!Array.isArray(entrada.tareas) || entrada.tareas.length === 0) throw new ErrorAplicacion(400, 'Debes ingresar al menos una tarea de producción');
    const tareas = entrada.tareas.map((valor, indice) => {
      if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new ErrorAplicacion(400, `Tarea ${indice + 1} inválida`);
      const item = valor as Record<string, unknown>;
      const camposNoPermitidos = ['idUsuario', 'trabajador', 'responsable', 'tarifa', 'materiales', 'fecha', 'prioridad', 'urgencia'];
      if (camposNoPermitidos.some((campo) => Object.prototype.hasOwnProperty.call(item, campo))) throw new ErrorAplicacion(400, `Tarea ${indice + 1} contiene campos que pertenecen a otro flujo`);
      const titulo = texto(item.titulo, 200);
      if (!titulo) throw new ErrorAplicacion(400, `El título de la tarea ${indice + 1} es obligatorio`);
      return { titulo, descripcion: texto(item.descripcion, 2000) || null, instrucciones: texto(item.instrucciones, 2000) || null };
    });
    const idOrdenTrabajo = BigInt(idOrden);
    try {
      return await prisma.$transaction(async (tx) => {
        const contexto = await this.resolverLevantamientoTerreno(id, actor, tx);
        const orden = await tx.orden_trabajo.findUnique({ where: { orden_trabajo_id_orden: idOrdenTrabajo } });
        if (!orden) throw new ErrorAplicacion(404, 'Orden de Trabajo no encontrada');
        const unidadComercial=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:idOrdenTrabajo}});
        if(unidadComercial&&unidadComercial.estado!=='LIBERADA')throw new ErrorAplicacion(409,'La OT requiere rectificación aprobada y liberación técnica antes de generar tareas productivas');
        if (orden.orden_trabajo_estado !== 'en_progreso') throw new ErrorAplicacion(409, 'La Orden de Trabajo debe estar liberada para generar tareas de producción');
        const idEspecificacion = orden.especificaciones_puerta_id_especificacion_puerta;
        if (idEspecificacion === null) throw new ErrorAplicacion(409, 'La Orden de Trabajo no tiene una especificación asociada');
        if (idEspecificacion !== contexto.especificacion.especificacion_puerta_especificacion_puerta_id) throw new ErrorAplicacion(409, 'La Orden de Trabajo no pertenece al levantamiento indicado');
        const existentes = await tx.tarea.findMany({ where: { id_orden_trabajo: idOrdenTrabajo }, orderBy: { tarea_tarea_id: 'asc' } });
        if (!existentes.length) {
          const ahora = new Date();
          await tx.tarea.createMany({ data: tareas.map((item) => ({
            tarea_titulo: item.titulo, tarea_descripcion: item.descripcion, tarea_instrucciones_de_oficina: item.instrucciones,
            tarea_estado_de_tarea: 'pendiente', tarea_fecha_de_creacion: ahora, tarea_fecha_de_ultima_actualizacion: ahora,
            id_orden_trabajo: idOrdenTrabajo, id_especificacion_puerta: idEspecificacion, id_usuario: null, id_servicio_terreno: null,
          })) });
        }
        return this.presentarLevantamientoTerreno(await this.resolverLevantamientoTerreno(id, actor, tx));
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) {
      if (esConflictoSerializable(error)) {
        const contexto = await this.resolverLevantamientoTerreno(id, actor);
        const existentes = await prisma.tarea.count({ where: { id_orden_trabajo: idOrdenTrabajo } });
        if (existentes) return this.presentarLevantamientoTerreno(contexto);
        throw new ErrorAplicacion(409, 'Las tareas de producción fueron generadas concurrentemente; vuelve a consultar');
      }
      throw error;
    }
  }

  private async obtenerTareaProduccion(id: number, cliente: Prisma.TransactionClient | typeof prisma = prisma) {
    const tarea = await cliente.tarea.findUnique({
      where: { tarea_tarea_id: BigInt(id) },
      include: { orden_trabajo: true, especificaciones_puerta: true },
    });
    if (!tarea || !tarea.orden_trabajo) throw new ErrorAplicacion(404, 'Tarea de producción no encontrada');
    const unidadComercial=await cliente.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:tarea.orden_trabajo.orden_trabajo_id_orden}});
    if(unidadComercial&&unidadComercial.estado!=='LIBERADA')throw new ErrorAplicacion(409,'La OT comercial todavía no está liberada para producción');
    if (tarea.orden_trabajo.orden_trabajo_estado !== 'en_progreso') throw new ErrorAplicacion(409, 'La Orden de Trabajo debe estar liberada');
    return tarea;
  }

  private async presentarTareaProduccion(tarea: any, cliente: Prisma.TransactionClient | typeof prisma = prisma) {
    const asignaciones = await cliente.tarea_usuario.findMany({ where: { tarea_usuario_tarea_id: tarea.tarea_tarea_id }, orderBy: { tarea_usuario_usuario_id: 'asc' } });
    const usuarios = asignaciones.length ? await cliente.usuario.findMany({ where: { usuario_id_usuario: { in: asignaciones.map((item) => item.tarea_usuario_usuario_id) } } }) : [];
    const origen=await cliente.tarea_ejecutable_unidad_ot.findUnique({where:{id_tarea:tarea.tarea_tarea_id},include:{estado_operacional:{include:{area:true,empleado_responsable:true}},etapa_adicional:true}});
    const operativo=origen?.estado_operacional;
    return {
      id: tarea.tarea_tarea_id.toString(), titulo: tarea.tarea_titulo, descripcion: tarea.tarea_descripcion,
      instrucciones: tarea.tarea_instrucciones_de_oficina, estado: tarea.tarea_estado_de_tarea, prioridad: tarea.tarea_urgencia,
      idOrdenTrabajo: tarea.id_orden_trabajo?.toString() || null, idEspecificacion: tarea.id_especificacion_puerta?.toString() || null,
      asignados: usuarios.map((usuario) => this.presentarUsuarioTerreno(usuario)),
      produccion:origen?{idEjecutable:origen.id_tarea_ejecutable_ot.toString(),origen:origen.origen,ordenEtapa:origen.orden_etapa,ordenTarea:origen.orden_tarea,idEtapaPlanificacion:origen.id_etapa_planificacion,idEtapaAdicional:origen.id_etapa_adicional_ot?.toString()||null,etapaAdicional:origen.etapa_adicional?.nombre||null,estado:operativo?.estado||'PENDIENTE',revision:operativo?.revision||0,prioridad:operativo?.prioridad||null,tiempoEstimadoMin:operativo?.tiempo_estimado_min||null,instrucciones:operativo?.instrucciones||tarea.tarea_instrucciones_de_oficina,observaciones:operativo?.observaciones||null,fechaPlanificada:operativo?.fecha_planificada||null,area:operativo?{id:operativo.id_area_trabajo.toString(),nombre:operativo.area.area_trabajo_nombre_area||`Área ${operativo.id_area_trabajo}`} : null,responsable:operativo?.empleado_responsable?{id:operativo.empleado_responsable.id_empleado,nombre:nombreCompleto(operativo.empleado_responsable),rut:operativo.empleado_responsable.rut_empleado}:null}:null,
    };
  }

  async listarTareasProduccion(idOrden: number) {
    const tareas = await prisma.tarea.findMany({ where: { id_orden_trabajo: BigInt(idOrden) }, include: { orden_trabajo: true }, orderBy: { tarea_tarea_id: 'asc' } });
    return Promise.all(tareas.map((tarea) => this.presentarTareaProduccion(tarea)));
  }

  async asignarTareaProduccion(id: number, entrada: Record<string, unknown>, actor:ActorTerrenoM6) {
    const motivo=texto(entrada.motivo,1000);if(!motivo)throw new ErrorAplicacion(400,'El motivo de la reasignación es obligatorio');
    let idEmpleado=entrada.idEmpleado===null||entrada.idEmpleado===''?null:entrada.idEmpleado===undefined?undefined:identificador(entrada.idEmpleado);
    return prisma.$transaction(async (tx) => {
      const tarea = await this.obtenerTareaProduccion(id, tx);
      const origen=await tx.tarea_ejecutable_unidad_ot.findUnique({where:{id_tarea:tarea.tarea_tarea_id},include:{estado_operacional:true}});if(!origen?.estado_operacional)throw new ErrorAplicacion(409,'La tarea no pertenece al flujo productivo versionado');const actual=origen.estado_operacional;
      if(actual.estado==='CERRADA')throw new ErrorAplicacion(409,'Una tarea cerrada no puede reasignarse');
      if(idEmpleado===undefined&&Array.isArray(entrada.idsUsuarios)&&entrada.idsUsuarios.length===1){const cuenta=await tx.usuario.findUnique({where:{usuario_id_usuario:BigInt(identificador(entrada.idsUsuarios[0]))},include:{empleado_seguridad:true,empleado:true}});idEmpleado=cuenta?.empleado_seguridad?.id_empleado??cuenta?.empleado?.id_empleado;if(idEmpleado===undefined)throw new ErrorAplicacion(409,'La cuenta seleccionada no está vinculada a un empleado');}
      const revision=entrada.revision===undefined?actual.revision:identificador(entrada.revision);if(revision!==actual.revision)throw new ErrorAplicacion(409,'La tarea fue modificada por otro usuario; recarga la ficha');
      let empleado:any=null;if(idEmpleado!==undefined&&idEmpleado!==null){const asignacion=await tx.asignacion_area_empleado.findFirst({where:{id_empleado:idEmpleado,id_area_trabajo:actual.id_area_trabajo,vigencia_hasta:null,empleado:{estado_laboral:'activo'},area:{area_trabajo_activo:true}},include:{empleado:{include:{cuenta_m4:true,usuario:true}}}});if(!asignacion)throw new ErrorAplicacion(409,'El empleado debe estar activo y pertenecer actualmente al área de la tarea');empleado=asignacion.empleado;}
      const cambio=await tx.estado_tarea_produccion_ot.updateMany({where:{id_estado_tarea_produccion:actual.id_estado_tarea_produccion,revision:actual.revision,estado:{not:'CERRADA'}},data:{id_empleado_responsable:idEmpleado===undefined?actual.id_empleado_responsable:idEmpleado,estado:(idEmpleado===undefined?actual.id_empleado_responsable:idEmpleado)?'ASIGNADA':'PENDIENTE',actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}});if(cambio.count!==1)throw new ErrorAplicacion(409,'La tarea fue reasignada concurrentemente');
      await tx.tarea_usuario.deleteMany({ where: { tarea_usuario_tarea_id: tarea.tarea_tarea_id } });
      const cuenta=empleado?(empleado.cuenta_m4||empleado.usuario[0]):null;if(cuenta)await tx.tarea_usuario.create({data:{tarea_usuario_tarea_id:tarea.tarea_tarea_id,tarea_usuario_usuario_id:cuenta.usuario_id_usuario}});
      await tx.historial_cambio_produccion_ot.create({data:{id_unidad_fisica_ot:origen.id_unidad_fisica_ot,id_tarea_ejecutable_ot:origen.id_tarea_ejecutable_ot,entidad:'TAREA',evento:'RESPONSABLE_REASIGNADO',valor_anterior:{idEmpleado:actual.id_empleado_responsable},valor_nuevo:{idEmpleado:idEmpleado===undefined?actual.id_empleado_responsable:idEmpleado,nombre:empleado?nombreCompleto(empleado):null},motivo,id_empleado_involucrado:idEmpleado===undefined?actual.id_empleado_responsable:idEmpleado,usuario_id_usuario:actor.id}});
      const actualizada = await tx.tarea.findUnique({where:{tarea_tarea_id:tarea.tarea_tarea_id},include:{orden_trabajo:true,especificaciones_puerta:true}});
      return this.presentarTareaProduccion(actualizada, tx);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async modificarTareaProduccion(id:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6){
    const motivo=texto(entrada.motivo,1000);if(!motivo)throw new ErrorAplicacion(400,'El motivo del ajuste es obligatorio');
    return prisma.$transaction(async tx=>{const tarea=await this.obtenerTareaProduccion(id,tx);const origen=await tx.tarea_ejecutable_unidad_ot.findUnique({where:{id_tarea:tarea.tarea_tarea_id},include:{estado_operacional:true}});if(!origen?.estado_operacional)throw new ErrorAplicacion(409,'La tarea no pertenece al flujo productivo versionado');const actual=origen.estado_operacional;if(actual.estado==='CERRADA')throw new ErrorAplicacion(409,'Una tarea cerrada no puede editarse; crea una tarea correctiva');const revision=identificador(entrada.revision);if(revision!==actual.revision)throw new ErrorAplicacion(409,'La tarea fue modificada por otro usuario; recarga la ficha');
      const prioridad=Object.prototype.hasOwnProperty.call(entrada,'prioridad')?texto(entrada.prioridad,30)||null:actual.prioridad;const tiempo=Object.prototype.hasOwnProperty.call(entrada,'tiempoEstimadoMin')?(entrada.tiempoEstimadoMin?enteroPositivo(entrada.tiempoEstimadoMin,'Tiempo estimado'):null):actual.tiempo_estimado_min;const instrucciones=Object.prototype.hasOwnProperty.call(entrada,'instrucciones')?texto(entrada.instrucciones,4000)||null:actual.instrucciones;const observaciones=Object.prototype.hasOwnProperty.call(entrada,'observaciones')?texto(entrada.observaciones,4000)||null:actual.observaciones;const fechaPlanificada=Object.prototype.hasOwnProperty.call(entrada,'fechaPlanificada')?(entrada.fechaPlanificada?fechaEntrada(entrada.fechaPlanificada,'Fecha planificada'):null):actual.fecha_planificada;
      const cambio=await tx.estado_tarea_produccion_ot.updateMany({where:{id_estado_tarea_produccion:actual.id_estado_tarea_produccion,revision:actual.revision,estado:{not:'CERRADA'}},data:{prioridad,tiempo_estimado_min:tiempo,instrucciones,observaciones,fecha_planificada:fechaPlanificada,actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}});if(cambio.count!==1)throw new ErrorAplicacion(409,'La tarea fue modificada concurrentemente');await tx.tarea.update({where:{tarea_tarea_id:tarea.tarea_tarea_id},data:{tarea_urgencia:prioridad,tarea_instrucciones_de_oficina:instrucciones,tarea_fecha_de_ultima_actualizacion:new Date()}});const anterior={prioridad:actual.prioridad,tiempoEstimadoMin:actual.tiempo_estimado_min,instrucciones:actual.instrucciones,observaciones:actual.observaciones,fechaPlanificada:actual.fecha_planificada};const nuevo={prioridad,tiempoEstimadoMin:tiempo,instrucciones,observaciones,fechaPlanificada};await tx.historial_cambio_produccion_ot.create({data:{id_unidad_fisica_ot:origen.id_unidad_fisica_ot,id_tarea_ejecutable_ot:origen.id_tarea_ejecutable_ot,entidad:'TAREA',evento:'AJUSTE_OPERATIVO',valor_anterior:anterior,valor_nuevo:nuevo,motivo,usuario_id_usuario:actor.id}});return this.presentarTareaProduccion(await tx.tarea.findUnique({where:{tarea_tarea_id:tarea.tarea_tarea_id},include:{orden_trabajo:true}}),tx);},{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  private presentarEjecucion(ejecucion: any) {
    return {
      id: ejecucion.id_ejecucion_tarea.toString(), idTarea: ejecucion.id_tarea.toString(), idUsuarioEjecutor: ejecucion.id_usuario_ejecutor.toString(),
      fecha: ejecucion.fecha_ejecucion, estado: ejecucion.estado_ejecucion, validacion: ejecucion.estado_validacion_productiva,
      cantidad: ejecucion.cantidad?.toString() || null, unidad: ejecucion.unidad,
      tarea: ejecucion.tarea ? { id: ejecucion.tarea.tarea_tarea_id.toString(), titulo: ejecucion.tarea.tarea_titulo, idOrdenTrabajo: ejecucion.tarea.id_orden_trabajo?.toString() || null } : undefined,
      ejecutor: this.presentarUsuarioTerreno(ejecucion.ejecutor),
      empleadoEjecutor:ejecucion.atribucion_productiva?.empleado_ejecutor?{id:ejecucion.atribucion_productiva.empleado_ejecutor.id_empleado,nombre:nombreCompleto(ejecucion.atribucion_productiva.empleado_ejecutor)}:null,
      registradoPor:ejecucion.atribucion_productiva?.registrador?nombreUsuario(ejecucion.atribucion_productiva.registrador):null,
    };
  }

  async iniciarTareaProduccion(id:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6){return prisma.$transaction(async tx=>{const tarea=await this.obtenerTareaProduccion(id,tx);const origen=await tx.tarea_ejecutable_unidad_ot.findUnique({where:{id_tarea:tarea.tarea_tarea_id},include:{estado_operacional:true}});if(!origen?.estado_operacional)throw new ErrorAplicacion(409,'La tarea no pertenece al flujo productivo versionado');const actual=origen.estado_operacional;if(actual.estado==='CERRADA'||actual.estado==='PENDIENTE_VALIDACION')throw new ErrorAplicacion(409,'La tarea no puede iniciarse en su estado actual');if(actual.estado==='EN_EJECUCION')return this.presentarTareaProduccion(tarea,tx);const anteriores=await tx.tarea_ejecutable_unidad_ot.findMany({where:{id_unidad_fisica_ot:origen.id_unidad_fisica_ot,OR:[{orden_etapa:{lt:origen.orden_etapa}},{orden_etapa:origen.orden_etapa,orden_tarea:{lt:origen.orden_tarea}}]},include:{estado_operacional:true}});if(anteriores.some(item=>item.estado_operacional?.estado!=='CERRADA'))throw new ErrorAplicacion(409,'Debes cerrar las tareas anteriores antes de iniciar esta etapa');let idEmpleado=entrada.idEmpleadoEjecutor?identificador(entrada.idEmpleadoEjecutor):null;if(idEmpleado===null){const cuenta=await tx.usuario.findUnique({where:{usuario_id_usuario:actor.id},include:{empleado_seguridad:true,empleado:true}});idEmpleado=cuenta?.empleado_seguridad?.id_empleado??cuenta?.empleado?.id_empleado??null;}if(idEmpleado===null)throw new ErrorAplicacion(400,'Debe identificar al empleado que inicia el trabajo');if(!await tx.asignacion_area_empleado.findFirst({where:{id_empleado:idEmpleado,id_area_trabajo:actual.id_area_trabajo,vigencia_hasta:null,empleado:{estado_laboral:'activo'}}}))throw new ErrorAplicacion(409,'El ejecutor debe estar activo en el área de la tarea');if(actual.id_empleado_responsable&&actual.id_empleado_responsable!==idEmpleado&&!actor.administrador)throw new ErrorAplicacion(403,'Sólo un encargado autorizado puede iniciar la tarea para otro responsable');const cambio=await tx.estado_tarea_produccion_ot.updateMany({where:{id_estado_tarea_produccion:actual.id_estado_tarea_produccion,revision:actual.revision,estado:{in:['PENDIENTE','ASIGNADA']}},data:{estado:'EN_EJECUCION',actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}});if(cambio.count!==1)throw new ErrorAplicacion(409,'La tarea fue iniciada o modificada concurrentemente');await tx.tarea.update({where:{tarea_tarea_id:tarea.tarea_tarea_id},data:{tarea_estado_de_tarea:'en_ejecucion',tarea_fecha_de_ultima_actualizacion:new Date()}});await tx.historial_cambio_produccion_ot.create({data:{id_unidad_fisica_ot:origen.id_unidad_fisica_ot,id_tarea_ejecutable_ot:origen.id_tarea_ejecutable_ot,entidad:'TAREA',evento:'TAREA_INICIADA',valor_anterior:{estado:actual.estado},valor_nuevo:{estado:'EN_EJECUCION'},motivo:texto(entrada.motivo,1000)||'Inicio de ejecución productiva',id_empleado_involucrado:idEmpleado,usuario_id_usuario:actor.id}});return this.presentarTareaProduccion(await tx.tarea.findUnique({where:{tarea_tarea_id:tarea.tarea_tarea_id},include:{orden_trabajo:true}}),tx);},{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});}

  async registrarEjecucionTarea(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6) {
    const idEmpleadoEntrada=entrada.idEmpleadoEjecutor===undefined||entrada.idEmpleadoEjecutor===''?null:identificador(entrada.idEmpleadoEjecutor);
    const tieneCantidad = entrada.cantidad !== undefined && entrada.cantidad !== null && entrada.cantidad !== '';
    const tieneUnidad = Boolean(texto(entrada.unidad, 30));
    if (tieneCantidad !== tieneUnidad) throw new ErrorAplicacion(400, 'Cantidad y unidad deben informarse juntas');
    const cantidad = tieneCantidad ? decimalOpcional(entrada.cantidad, 'Cantidad') : null;
    const unidad = tieneUnidad ? texto(entrada.unidad, 30) : null;
    return prisma.$transaction(async (tx) => {
      const tarea = await this.obtenerTareaProduccion(id, tx);
      const origen=await tx.tarea_ejecutable_unidad_ot.findUnique({where:{id_tarea:tarea.tarea_tarea_id},include:{estado_operacional:true}});if(!origen?.estado_operacional){const idUsuario=entrada.idUsuario?BigInt(identificador(entrada.idUsuario)):actor.id;if(!actor.administrador&&idUsuario!==actor.id)throw new ErrorAplicacion(403,'Sólo un administrador puede registrar la ejecución de otro usuario');const asignacion=await tx.tarea_usuario.findFirst({where:{tarea_usuario_tarea_id:tarea.tarea_tarea_id,tarea_usuario_usuario_id:idUsuario}});if(!asignacion)throw new ErrorAplicacion(409,'El usuario no está asignado a la tarea histórica');const ejecucion=await tx.ejecucion_tarea.create({data:{id_tarea:tarea.tarea_tarea_id,id_usuario_ejecutor:idUsuario,fecha_ejecucion:new Date(),estado_ejecucion:'terminada',estado_validacion_productiva:'pendiente',cantidad,unidad},include:{tarea:true,ejecutor:true}});return this.presentarEjecucion(ejecucion);}if(origen.estado_operacional.estado==='CERRADA')throw new ErrorAplicacion(409,'La tarea ya está cerrada');
      let idEmpleado=idEmpleadoEntrada;if(idEmpleado===null){const cuenta=await tx.usuario.findUnique({where:{usuario_id_usuario:actor.id},include:{empleado_seguridad:true,empleado:true}});idEmpleado=cuenta?.empleado_seguridad?.id_empleado??cuenta?.empleado?.id_empleado??null;}if(idEmpleado===null)throw new ErrorAplicacion(400,'Debe identificar al empleado que realizó el trabajo');const empleado=await tx.asignacion_area_empleado.findFirst({where:{id_empleado:idEmpleado,id_area_trabajo:origen.estado_operacional.id_area_trabajo,vigencia_hasta:null,empleado:{estado_laboral:'activo'}},include:{empleado:true}});if(!empleado)throw new ErrorAplicacion(409,'El ejecutor debe ser un empleado activo del área de la tarea');if(origen.estado_operacional.id_empleado_responsable&&origen.estado_operacional.id_empleado_responsable!==idEmpleado&&!actor.administrador)throw new ErrorAplicacion(403,'La ejecución de otro responsable requiere un encargado autorizado');
      const anteriores=await tx.tarea_ejecutable_unidad_ot.findMany({where:{id_unidad_fisica_ot:origen.id_unidad_fisica_ot,OR:[{orden_etapa:{lt:origen.orden_etapa}},{orden_etapa:origen.orden_etapa,orden_tarea:{lt:origen.orden_tarea}}]},include:{estado_operacional:true}});if(anteriores.some(item=>item.estado_operacional?.estado!=='CERRADA'))throw new ErrorAplicacion(409,'Debes cerrar las tareas anteriores antes de ejecutar esta etapa');
      const ejecucion = await tx.ejecucion_tarea.create({ data: { id_tarea: tarea.tarea_tarea_id, id_usuario_ejecutor: actor.id, fecha_ejecucion: new Date(), estado_ejecucion: 'terminada', estado_validacion_productiva: 'pendiente', cantidad, unidad }, include: { tarea: true, ejecutor: true } });
      await tx.atribucion_ejecucion_tarea_ot.create({data:{id_ejecucion_tarea:ejecucion.id_ejecucion_tarea,id_empleado_ejecutor:idEmpleado,registrado_por:actor.id}});await tx.estado_tarea_produccion_ot.update({where:{id_tarea_ejecutable_ot:origen.id_tarea_ejecutable_ot},data:{estado:'PENDIENTE_VALIDACION',actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}});
      return this.presentarEjecucion(ejecucion);
    });
  }

  async listarEjecucionesPendientes() {
    const ejecuciones = await prisma.ejecucion_tarea.findMany({ where: { estado_ejecucion: 'terminada', estado_validacion_productiva: 'pendiente' }, include: { tarea: true, ejecutor: true,atribucion_productiva:{include:{empleado_ejecutor:true,registrador:true}} }, orderBy: { fecha_ejecucion: 'asc' } });
    return ejecuciones.map((item) => this.presentarEjecucion(item));
  }

  async validarEjecucionProductiva(id: number, entrada: Record<string, unknown>,actor:ActorTerrenoM6) {
    const decision = texto(entrada.decision, 20).toLowerCase();
    if (!['validada', 'rechazada', 'devuelta'].includes(decision)) throw new ErrorAplicacion(400, 'Decisión productiva inválida');
    return prisma.$transaction(async (tx) => {
      const cambio = await tx.ejecucion_tarea.updateMany({ where: { id_ejecucion_tarea: BigInt(id), estado_ejecucion: 'terminada', estado_validacion_productiva: 'pendiente' }, data: { estado_validacion_productiva: decision } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La ejecución no existe, no está terminada o ya fue revisada');
      const ejecucion = await tx.ejecucion_tarea.findUnique({ where: { id_ejecucion_tarea: BigInt(id) }, include: { tarea: true, ejecutor: true } });
      if(ejecucion){const origen=await tx.tarea_ejecutable_unidad_ot.findUnique({where:{id_tarea:ejecucion.id_tarea},include:{estado_operacional:true}});if(origen?.estado_operacional){const estado=decision==='validada'?'PENDIENTE_VALIDACION':origen.estado_operacional.id_empleado_responsable?'ASIGNADA':'PENDIENTE';await tx.estado_tarea_produccion_ot.update({where:{id_tarea_ejecutable_ot:origen.id_tarea_ejecutable_ot},data:{estado,actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}});}}
      return this.presentarEjecucion(ejecucion);
    });
  }

  async agregarEtapaProduccion(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6){
    const nombre=texto(entrada.nombre,150),descripcion=texto(entrada.descripcion,4000)||null,motivo=texto(entrada.motivo,1000),clave=texto(entrada.claveIdempotencia,120);if(!nombre||!motivo||!clave)throw new ErrorAplicacion(400,'Nombre, motivo y clave de idempotencia son obligatorios');const idArea=BigInt(identificador(entrada.idAreaTrabajo));const orden=enteroPositivo(entrada.orden,'Orden de etapa');
    return prisma.$transaction(async tx=>{const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{cierre_produccion:true}});if(!unidad)throw new ErrorAplicacion(404,'Orden de Trabajo no encontrada');if(unidad.cierre_produccion||unidad.estado!=='LIBERADA')throw new ErrorAplicacion(409,'La OT debe estar liberada y abierta para agregar etapas');const existente=await tx.etapa_adicional_orden_trabajo.findUnique({where:{clave_idempotencia:clave}});if(existente){if(existente.id_unidad_fisica_ot!==unidad.id_unidad_fisica_ot)throw new ErrorAplicacion(409,'La clave de idempotencia ya fue utilizada');return{mensaje:'La etapa ya había sido incorporada',idEtapa:existente.id_etapa_adicional_ot.toString()};}const area=await tx.area_trabajo.findFirst({where:{area_trabajo_id_area:idArea,area_trabajo_activo:true}});if(!area)throw new ErrorAplicacion(409,'El área seleccionada no está activa');const cerradas=await tx.tarea_ejecutable_unidad_ot.findMany({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,estado_operacional:{is:{estado:'CERRADA'}}},select:{orden_etapa:true}});const maxCerrada=Math.max(0,...cerradas.map(item=>item.orden_etapa));if(orden<=maxCerrada)throw new ErrorAplicacion(409,'No se puede insertar una etapa antes de etapas ya cerradas');if(await tx.tarea_ejecutable_unidad_ot.count({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,orden_etapa:orden}}))throw new ErrorAplicacion(409,'La posición ya está ocupada; use una posición posterior sin reordenar etapas existentes');const etapa=await tx.etapa_adicional_orden_trabajo.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_area_trabajo:idArea,nombre,descripcion,orden,motivo,clave_idempotencia:clave,creado_por:actor.id}});await tx.historial_cambio_produccion_ot.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,entidad:'ETAPA',evento:'ETAPA_INCORPORADA',valor_nuevo:{id:etapa.id_etapa_adicional_ot.toString(),nombre,orden,idAreaTrabajo:idArea.toString()},motivo,usuario_id_usuario:actor.id}});return{mensaje:'Etapa incorporada',idEtapa:etapa.id_etapa_adicional_ot.toString()};},{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  async agregarTareaProduccion(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6){
    const motivo=texto(entrada.motivo,1000),clave=texto(entrada.claveIdempotencia,120);if(!motivo||!clave)throw new ErrorAplicacion(400,'Motivo y clave de idempotencia son obligatorios');const idCatalogo=entrada.idTareaFabricacion?identificador(entrada.idTareaFabricacion):null;const idEtapaAdicional=entrada.idEtapaAdicional?BigInt(identificador(entrada.idEtapaAdicional)):null;const idEtapaPlan=texto(entrada.idEtapaPlanificacion,120);const idTareaOrigen=entrada.idTareaOrigenCorrectiva?BigInt(identificador(entrada.idTareaOrigenCorrectiva)):null;
    return prisma.$transaction(async tx=>{const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{cierre_produccion:true,rectificacion:{include:{versiones:{include:{decision:true},orderBy:{numero_version:'desc'}}}}}});if(!unidad?.rectificacion)throw new ErrorAplicacion(404,'Orden de Trabajo no encontrada');if(unidad.cierre_produccion||unidad.estado!=='LIBERADA')throw new ErrorAplicacion(409,'La OT debe estar liberada y abierta para agregar tareas');const repetida=await tx.tarea_ejecutable_unidad_ot.findUnique({where:{clave_idempotencia:clave}});if(repetida){if(repetida.id_unidad_fisica_ot!==unidad.id_unidad_fisica_ot)throw new ErrorAplicacion(409,'La clave de idempotencia ya fue utilizada');return this.presentarTareaProduccion(await tx.tarea.findUnique({where:{tarea_tarea_id:repetida.id_tarea},include:{orden_trabajo:true}}),tx);}const version=unidad.rectificacion.versiones.find(v=>v.decision?.decision==='APROBADA');if(!version)throw new ErrorAplicacion(409,'La OT no tiene una revisión técnica aprobada vigente');let idArea:bigint,ordenEtapa:number,idEtapa:string,origen='TAREA_ADICIONAL';if(idEtapaAdicional){const etapa=await tx.etapa_adicional_orden_trabajo.findFirst({where:{id_etapa_adicional_ot:idEtapaAdicional,id_unidad_fisica_ot:unidad.id_unidad_fisica_ot}});if(!etapa)throw new ErrorAplicacion(404,'Etapa adicional no encontrada');idArea=etapa.id_area_trabajo;ordenEtapa=etapa.orden;idEtapa=`adicional-${etapa.id_etapa_adicional_ot}`;origen='ETAPA_ADICIONAL';}else{const referencia=await tx.tarea_ejecutable_unidad_ot.findFirst({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_etapa_planificacion:idEtapaPlan},include:{estado_operacional:true}});if(!referencia?.estado_operacional)throw new ErrorAplicacion(404,'Etapa planificada no encontrada');idArea=referencia.estado_operacional.id_area_trabajo;ordenEtapa=referencia.orden_etapa;idEtapa=referencia.id_etapa_planificacion;}
      const catalogo=idCatalogo?await tx.catalogo_tarea_fabricacion.findFirst({where:{id_tarea_fabricacion:idCatalogo,id_area_trabajo:idArea,estado:'ACTIVA'}}):null;if(idCatalogo&&!catalogo)throw new ErrorAplicacion(409,'La tarea de catálogo no está activa en el área de la etapa');const nombre=catalogo?.nombre||texto(entrada.nombre,150);if(!nombre)throw new ErrorAplicacion(400,'Debe seleccionar una tarea de catálogo o indicar un nombre particular');const idEmpleado=entrada.idEmpleado?identificador(entrada.idEmpleado):null;if(idEmpleado&&!await tx.asignacion_area_empleado.findFirst({where:{id_empleado:idEmpleado,id_area_trabajo:idArea,vigencia_hasta:null,empleado:{estado_laboral:'activo'}}}))throw new ErrorAplicacion(409,'El responsable debe estar activo en el área de la tarea');if(idTareaOrigen){const original=await tx.tarea_ejecutable_unidad_ot.findFirst({where:{id_tarea_ejecutable_ot:idTareaOrigen,id_unidad_fisica_ot:unidad.id_unidad_fisica_ot},include:{estado_operacional:true}});if(!original||original.estado_operacional?.estado!=='CERRADA')throw new ErrorAplicacion(409,'Una tarea correctiva debe relacionarse con una tarea cerrada de la misma OT');origen='CORRECTIVA';}
      const ultima=await tx.tarea_ejecutable_unidad_ot.aggregate({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,orden_etapa:ordenEtapa},_max:{orden_tarea:true}});const ordenTarea=(ultima._max.orden_tarea||0)+1;const instrucciones=texto(entrada.instrucciones,4000)||catalogo?.descripcion||null;const tiempo=entrada.tiempoEstimadoMin?enteroPositivo(entrada.tiempoEstimadoMin,'Tiempo estimado'):catalogo?.tiempo_estimado_min||null;const tarea=await tx.tarea.create({data:{tarea_titulo:nombre,tarea_descripcion:texto(entrada.descripcion,2000)||catalogo?.descripcion||null,tarea_instrucciones_de_oficina:instrucciones,tarea_urgencia:texto(entrada.prioridad,30)||null,tarea_estado_de_tarea:'pendiente',tarea_fecha_de_creacion:new Date(),id_especificacion_puerta:unidad.rectificacion.id_especificacion_puerta,id_orden_trabajo:unidad.id_orden_trabajo}});const ejecutable=await tx.tarea_ejecutable_unidad_ot.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_version_rectificacion:version.id_version_rectificacion,id_tarea:tarea.tarea_tarea_id,id_etapa_planificacion:idEtapa,id_tarea_planificacion:`adicional-${clave}`.slice(0,120),orden_etapa:ordenEtapa,orden_tarea:ordenTarea,id_empleado_planificado:null,origen,id_etapa_adicional_ot:idEtapaAdicional,clave_idempotencia:clave,id_tarea_origen_correctiva:idTareaOrigen}});await tx.estado_tarea_produccion_ot.create({data:{id_tarea_ejecutable_ot:ejecutable.id_tarea_ejecutable_ot,id_area_trabajo:idArea,id_empleado_responsable:idEmpleado,estado:idEmpleado?'ASIGNADA':'PENDIENTE',prioridad:texto(entrada.prioridad,30)||null,tiempo_estimado_min:tiempo,instrucciones,observaciones:texto(entrada.observaciones,4000)||null,fecha_planificada:entrada.fechaPlanificada?fechaEntrada(entrada.fechaPlanificada,'Fecha planificada'):null,actualizado_por:actor.id}});await tx.historial_cambio_produccion_ot.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_tarea_ejecutable_ot:ejecutable.id_tarea_ejecutable_ot,id_version_rectificacion:version.id_version_rectificacion,entidad:'TAREA',evento:origen==='CORRECTIVA'?'TAREA_CORRECTIVA_INCORPORADA':'TAREA_INCORPORADA',valor_nuevo:{nombre,origen,ordenEtapa,ordenTarea,idEmpleado},motivo,id_empleado_involucrado:idEmpleado,usuario_id_usuario:actor.id}});return this.presentarTareaProduccion(await tx.tarea.findUnique({where:{tarea_tarea_id:tarea.tarea_tarea_id},include:{orden_trabajo:true}}),tx);},{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  async cerrarTareaProduccion(id:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6){const motivo=texto(entrada.motivo,1000);if(!motivo)throw new ErrorAplicacion(400,'La observación o motivo de cierre es obligatorio');return prisma.$transaction(async tx=>{const tarea=await this.obtenerTareaProduccion(id,tx);const origen=await tx.tarea_ejecutable_unidad_ot.findUnique({where:{id_tarea:tarea.tarea_tarea_id},include:{estado_operacional:true}});if(!origen?.estado_operacional)throw new ErrorAplicacion(409,'La tarea no pertenece al flujo productivo versionado');const actual=origen.estado_operacional;if(actual.estado==='CERRADA')return{mensaje:'La tarea ya estaba cerrada',idTarea:id};const ejecuciones=await tx.ejecucion_tarea.findMany({where:{id_tarea:tarea.tarea_tarea_id}});if(!ejecuciones.some(e=>e.estado_validacion_productiva==='validada'))throw new ErrorAplicacion(409,'La tarea requiere al menos una ejecución validada antes del cierre');if(ejecuciones.some(e=>e.estado_validacion_productiva==='pendiente'))throw new ErrorAplicacion(409,'La tarea tiene ejecuciones pendientes de validación');const cambio=await tx.estado_tarea_produccion_ot.updateMany({where:{id_estado_tarea_produccion:actual.id_estado_tarea_produccion,revision:actual.revision,estado:{not:'CERRADA'}},data:{estado:'CERRADA',actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}});if(cambio.count!==1)throw new ErrorAplicacion(409,'La tarea fue cerrada o modificada concurrentemente');await tx.tarea.update({where:{tarea_tarea_id:tarea.tarea_tarea_id},data:{tarea_estado_de_tarea:'cerrada',tarea_fecha_de_ultima_actualizacion:new Date()}});await tx.historial_cambio_produccion_ot.create({data:{id_unidad_fisica_ot:origen.id_unidad_fisica_ot,id_tarea_ejecutable_ot:origen.id_tarea_ejecutable_ot,entidad:'TAREA',evento:'TAREA_CERRADA',valor_anterior:{estado:actual.estado},valor_nuevo:{estado:'CERRADA',ejecucionesValidadas:ejecuciones.filter(e=>e.estado_validacion_productiva==='validada').map(e=>e.id_ejecucion_tarea.toString())},motivo,id_empleado_involucrado:actual.id_empleado_responsable,usuario_id_usuario:actor.id}});return{mensaje:'Tarea cerrada',idTarea:id,estado:'CERRADA'};},{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});}

  async solicitarCorreccionTecnicaProduccion(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6){const motivo=texto(entrada.motivo,2000);const propuesta=entrada.medidaPropuesta;if(!motivo||!propuesta||typeof propuesta!=='object'||Array.isArray(propuesta))throw new ErrorAplicacion(400,'Motivo y medida propuesta son obligatorios');return prisma.$transaction(async tx=>{const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{cierre_produccion:true,rectificacion:{include:{versiones:{include:{decision:true},orderBy:{numero_version:'desc'}}}}}});if(!unidad?.rectificacion)throw new ErrorAplicacion(404,'Orden de Trabajo no encontrada');if(unidad.cierre_produccion||unidad.estado!=='LIBERADA')throw new ErrorAplicacion(409,'Sólo una OT liberada y abierta admite corrección técnica');const version=unidad.rectificacion.versiones.find(v=>v.decision?.decision==='APROBADA');if(!version)throw new ErrorAplicacion(409,'No existe una versión técnica aprobada como base');const datos=version.datos_rectificacion as any;const solicitud=await tx.solicitud_correccion_tecnica_ot.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_version_base:version.id_version_rectificacion,medida_original:datos?.medidas||{},medida_propuesta:propuesta as Prisma.InputJsonValue,motivo,solicitado_por:actor.id}});await tx.rectificacion_orden_trabajo.update({where:{id_rectificacion_ot:unidad.rectificacion.id_rectificacion_ot},data:{estado:'RECTIFICACION_DEVUELTA',actualizado_por:actor.id,actualizado_en:new Date(),revision:{increment:1}}});await tx.unidad_fisica_orden_trabajo.update({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot},data:{estado:'RECTIFICACION_DEVUELTA',actualizado_en:new Date(),revision:{increment:1}}});await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{orden_trabajo_estado:'RECTIFICACION_DEVUELTA'}});await tx.historial_cambio_produccion_ot.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_version_rectificacion:version.id_version_rectificacion,entidad:'REVISION_TECNICA',evento:'CORRECCION_TECNICA_SOLICITADA',valor_anterior:{medidas:datos?.medidas||{},version:version.numero_version},valor_nuevo:{medidas:propuesta,idSolicitud:solicitud.id_solicitud_correccion.toString()},motivo,usuario_id_usuario:actor.id}});return conAuditoriaRectificacion({mensaje:'Corrección técnica registrada; la producción quedó bloqueada hasta nueva aprobación y aplicación',idSolicitud:solicitud.id_solicitud_correccion.toString(),estado:'RECTIFICACION_DEVUELTA'},{estado:'LIBERADA',version:version.numero_version},{estado:'RECTIFICACION_DEVUELTA'});},{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});}

  async finalizarOrdenTrabajoProduccion(idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6){const observaciones=texto(entrada.observaciones,4000)||null;return prisma.$transaction(async tx=>{const unidad=await tx.unidad_fisica_orden_trabajo.findUnique({where:{id_orden_trabajo:BigInt(idOrden)},include:{cierre_produccion:true,liberacion:true,etapas_adicionales:true,rectificacion:{include:{versiones:{include:{decision:true},orderBy:{numero_version:'desc'}}}},tareas_ejecutables:{include:{estado_operacional:true,tarea:{include:{ejecuciones:{include:{incidencias:true}}}}}}}});if(!unidad?.rectificacion||!unidad.liberacion)throw new ErrorAplicacion(409,'La OT no cuenta con liberación técnica');if(unidad.cierre_produccion)return{mensaje:'La OT ya estaba finalizada',idOrdenTrabajo:idOrden,estado:'FINALIZADA'};if(unidad.estado!=='LIBERADA')throw new ErrorAplicacion(409,'La OT debe estar liberada y sin correcciones técnicas pendientes');const version=unidad.rectificacion.versiones[0];if(!version||version.decision?.decision!=='APROBADA')throw new ErrorAplicacion(409,'La rectificación técnica vigente no está aprobada');if(!unidad.tareas_ejecutables.length)throw new ErrorAplicacion(409,'La OT no tiene tareas ejecutables');if(unidad.etapas_adicionales.some(etapa=>!unidad.tareas_ejecutables.some(tarea=>tarea.id_etapa_adicional_ot===etapa.id_etapa_adicional_ot)))throw new ErrorAplicacion(409,'Existen etapas adicionales sin tareas productivas');if(unidad.tareas_ejecutables.some(t=>t.estado_operacional?.estado!=='CERRADA'))throw new ErrorAplicacion(409,'Todas las tareas obligatorias y adicionales deben estar cerradas');const ejecuciones=unidad.tareas_ejecutables.flatMap(t=>t.tarea.ejecuciones);if(ejecuciones.some(e=>e.estado_validacion_productiva==='pendiente'))throw new ErrorAplicacion(409,'Existen ejecuciones pendientes de validación');if(ejecuciones.some(e=>e.incidencias.some(i=>i.estado==='pendiente'||i.estado_revision==='pendiente_revision')))throw new ErrorAplicacion(409,'Existen incidencias productivas bloqueantes');const resumen={total:unidad.tareas_ejecutables.length,cerradas:unidad.tareas_ejecutables.length,ejecucionesValidadas:ejecuciones.filter(e=>e.estado_validacion_productiva==='validada').length};await tx.cierre_orden_trabajo_produccion.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_version_rectificacion:version.id_version_rectificacion,resumen_tareas:resumen,observaciones,estado_anterior:'LIBERADA',estado_final:'FINALIZADA',finalizado_por:actor.id}});await tx.unidad_fisica_orden_trabajo.update({where:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot},data:{estado:'FINALIZADA',actualizado_en:new Date(),revision:{increment:1}}});await tx.orden_trabajo.update({where:{orden_trabajo_id_orden:unidad.id_orden_trabajo},data:{orden_trabajo_estado:'completada'}});await tx.historial_cambio_produccion_ot.create({data:{id_unidad_fisica_ot:unidad.id_unidad_fisica_ot,id_version_rectificacion:version.id_version_rectificacion,entidad:'ORDEN_TRABAJO',evento:'ORDEN_TRABAJO_FINALIZADA',valor_anterior:{estado:'LIBERADA'},valor_nuevo:{estado:'FINALIZADA',resumen},motivo:observaciones||'Cierre productivo explícito',usuario_id_usuario:actor.id}});return conAuditoriaRectificacion({mensaje:'Orden de Trabajo finalizada',idOrdenTrabajo:idOrden,estado:'FINALIZADA',resumen},{estado:'LIBERADA'},{estado:'FINALIZADA',resumen});},{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});}

  async obtenerPreparacionSalida(id: number) {
    const visita = await prisma.servicio_terreno.findUnique({ where: { servicio_terreno_servicio_terreno_id: BigInt(id) }, include: { ...this.incluirVisitaTerreno, checklist_de_materiales: true } });
    if (!visita) throw new ErrorAplicacion(404, 'Visita no encontrada');
    const idEspecificacion = visita.obra?.especificaciones_puerta?.especificacion_puerta_especificacion_puerta_id || null;
    const ordenes = idEspecificacion === null ? [] : await prisma.orden_trabajo.findMany({
      where: { especificaciones_puerta_id_especificacion_puerta: idEspecificacion },
      include: { reserva_inventario: { include: { preparacion_pedido: { include: { preparacion_pedido_estado: { orderBy: { preparacion_pedido_estado_id_estado_preparacion: 'asc' } } } } } } },
      orderBy: { orden_trabajo_id_orden: 'desc' },
    });
    return {
      visita: this.presentarVisitaTerreno(visita),
      checklist: visita.checklist_de_materiales ? {
        id: visita.checklist_de_materiales.checklist_de_materiales_checklist_de_materials_id.toString(), item: visita.checklist_de_materiales.checklist_de_materiales_item,
        inicio: visita.checklist_de_materiales.checklist_de_materiales_tipo_inicio_tarea, cierre: visita.checklist_de_materiales.checklist_de_materiales_tipo_cierre_tarea,
        marcado: visita.checklist_de_materiales.checklist_de_materiales_es_marcado, detalleMarcado: visita.checklist_de_materiales.checklist_de_materiales_marcado,
        noMarcado: visita.checklist_de_materiales.checklist_de_materiales_es_no_marcado, detalleNoMarcado: visita.checklist_de_materiales.checklist_de_materiales_no_marcado,
      } : null,
      ordenesTrabajo: ordenes.map((orden) => ({ id: orden.orden_trabajo_id_orden.toString(), estado: orden.orden_trabajo_estado, reservas: orden.reserva_inventario.map((reserva) => ({
        id: reserva.reserva_inventario_id_reserva.toString(), materialSku: reserva.material_sku, cantidad: reserva.reserva_inventario_cantidad_reservada?.toString() || null,
        estado: reserva.reserva_inventario_estado_reserva, fechaReserva: reserva.reserva_inventario_fecha_reserva,
        preparaciones: reserva.preparacion_pedido.map((preparacion) => ({ id: preparacion.preparacion_pedido_id_preparacion.toString(), observacion: preparacion.preparacion_pedido_observacion, estados: preparacion.preparacion_pedido_estado.map((estado) => ({ nombre: estado.pedido_preparacion_estado_nombre_estado, fecha: estado.pedido_preparacion_estado_timestamp_accion })) })),
      })) })),
    };
  }

  async actualizarChecklistSalida(id: number, entrada: Record<string, unknown>) {
    const visita = await prisma.servicio_terreno.findUnique({ where: { servicio_terreno_servicio_terreno_id: BigInt(id) } });
    if (!visita) throw new ErrorAplicacion(404, 'Visita no encontrada');
    if (visita.id_checklist_de_materials === null) throw new ErrorAplicacion(409, 'La visita no tiene un checklist existente que pueda actualizarse');
    const datos: Record<string, unknown> = {};
    if (typeof entrada.marcado === 'boolean') datos.checklist_de_materiales_es_marcado = entrada.marcado;
    if (typeof entrada.noMarcado === 'boolean') datos.checklist_de_materiales_es_no_marcado = entrada.noMarcado;
    if (Object.prototype.hasOwnProperty.call(entrada, 'detalleMarcado')) datos.checklist_de_materiales_marcado = texto(entrada.detalleMarcado, 1000) || null;
    if (Object.prototype.hasOwnProperty.call(entrada, 'detalleNoMarcado')) datos.checklist_de_materiales_no_marcado = texto(entrada.detalleNoMarcado, 1000) || null;
    if (!Object.keys(datos).length) throw new ErrorAplicacion(400, 'No se informaron cambios de checklist');
    await prisma.checklist_de_materiales.update({ where: { checklist_de_materiales_checklist_de_materials_id: visita.id_checklist_de_materials }, data: datos });
    return this.obtenerPreparacionSalida(id);
  }

  async registrarResultadoVisita(id: number, entrada: Record<string, unknown>) {
    const finalizada = entrada.finalizada === true;
    const resultado = texto(entrada.resultado, 1000);
    const observaciones = texto(entrada.observaciones, 2000) || null;
    if (!resultado) throw new ErrorAplicacion(400, 'El resultado del servicio es obligatorio');
    return prisma.$transaction(async (tx) => {
      const visita = await tx.servicio_terreno.findUnique({ where: { servicio_terreno_servicio_terreno_id: BigInt(id) } });
      if (!visita) throw new ErrorAplicacion(404, 'Visita no encontrada');
      let idTarea: bigint | null = null;
      if (entrada.idTarea !== undefined && entrada.idTarea !== null && entrada.idTarea !== '') {
        idTarea = BigInt(identificador(entrada.idTarea));
        if (!await tx.tarea.count({ where: { tarea_tarea_id: idTarea, id_servicio_terreno: visita.servicio_terreno_servicio_terreno_id } })) throw new ErrorAplicacion(409, 'La tarea no pertenece a la visita');
      }
      const formulario = await tx.formulario_de_cierre.create({ data: {
        id_tarea: idTarea, formulario_de_cierre_detalle_de_observaciones: observaciones,
        formulario_de_cierre_resultado_finalizado: resultado,
        formulario_de_cierre_sentido_de_apertura_correcto: typeof entrada.sentidoAperturaCorrecto === 'boolean' ? entrada.sentidoAperturaCorrecto : null,
        formulario_de_cierre_pilastras_incluidas_y_ajustadas: typeof entrada.pilastrasAjustadas === 'boolean' ? entrada.pilastrasAjustadas : null,
        formulario_de_cierre_cilindro_correcto: typeof entrada.cilindroCorrecto === 'boolean' ? entrada.cilindroCorrecto : null,
        formulario_de_cierre_ausencia_de_rayones_o_danos: typeof entrada.sinDanos === 'boolean' ? entrada.sinDanos : null,
      } });
      if (entrada.evidencia && typeof entrada.evidencia === 'object' && !Array.isArray(entrada.evidencia)) {
        const evidencia = entrada.evidencia as Record<string, unknown>;
        await tx.evidencia_terreno.create({ data: {
          id_formulario_de_cierre: formulario.formulario_de_cierre_formulario_de_cierre_id, id_servicio_terreno: visita.servicio_terreno_servicio_terreno_id,
          evidencia_terreno_tipo_evidencia: texto(evidencia.tipo, 100) || null, evidencia_terreno_observacion: texto(evidencia.observacion, 1000) || null,
          evidencia_terreno_fecha_captura: new Date(), evidencia_terreno_estado_evidencia: 'registrada',
        } });
      }
      await tx.servicio_terreno.update({ where: { servicio_terreno_servicio_terreno_id: visita.servicio_terreno_servicio_terreno_id }, data: { servicio_terreno_estado: finalizada ? 'cerrada' : 'pendiente', servicio_terreno_observaciones: observaciones ?? visita.servicio_terreno_observaciones } });
      return { idFormulario: formulario.formulario_de_cierre_formulario_de_cierre_id.toString(), estadoVisita: finalizada ? 'cerrada' : 'pendiente' };
    });
  }

  async catalogosIncidenciaOperativa(consulta: Record<string, unknown> = {}) {
    const busqueda = String(consulta.busqueda || '').trim().slice(0, 100);
    const clienteRut = String(consulta.clienteRut || '').trim();
    if (clienteRut.length > 12) throw new ErrorAplicacion(400, 'Cliente inválido');
    const filtroCliente = busqueda ? { OR: [
      { cliente_cliente_rut: { contains: busqueda, mode: 'insensitive' as const } },
      { cliente_razon_social: { contains: busqueda, mode: 'insensitive' as const } },
      { cliente_cliente_b2b_razon_social: { contains: busqueda, mode: 'insensitive' as const } },
      { cliente_cliente_b2c_primer_nombre: { contains: busqueda, mode: 'insensitive' as const } },
      { cliente_cliente_b2c_primer_apellido: { contains: busqueda, mode: 'insensitive' as const } },
    ] } : undefined;
    const [categorias, areas, clientes, ordenes] = await Promise.all([
      prisma.categoria_incidencia_terreno.findMany({ where: { activa: true }, orderBy: { nombre: 'asc' } }),
      prisma.area_trabajo.findMany({ where: { area_trabajo_activo: { not: false } }, orderBy: { area_trabajo_nombre_area: 'asc' } }),
      prisma.cliente.findMany({
        where: filtroCliente,
        select: { cliente_cliente_rut: true, cliente_razon_social: true, cliente_cliente_b2b_razon_social: true, cliente_cliente_b2c_primer_nombre: true, cliente_cliente_b2c_primer_apellido: true },
        orderBy: [{ cliente_razon_social: 'asc' }, { cliente_cliente_rut: 'asc' }], take: 50,
      }),
      clienteRut ? prisma.orden_trabajo.findMany({
        where: { proyecto: { rut_cliente: clienteRut }, tareas_produccion: { some: { ejecuciones: { some: {} } } } },
        select: {
          orden_trabajo_id_orden: true, orden_trabajo_estado: true, orden_trabajo_fecha_hora: true,
          proyecto: { select: { proyecto_codigo_proyecto: true, proyecto_nombre_referencia: true, rut_cliente: true } },
          tareas_produccion: { select: { tarea_tarea_id: true, tarea_titulo: true, ejecuciones: { select: { id_ejecucion_tarea: true, fecha_ejecucion: true, estado_ejecucion: true }, orderBy: { fecha_ejecucion: 'desc' } } } },
        }, orderBy: { orden_trabajo_id_orden: 'desc' },
      }) : [],
    ]);
    const nombreCliente = (cliente: typeof clientes[number]) => cliente.cliente_razon_social || cliente.cliente_cliente_b2b_razon_social || [cliente.cliente_cliente_b2c_primer_nombre, cliente.cliente_cliente_b2c_primer_apellido].filter(Boolean).join(' ') || 'Cliente sin nombre registrado';
    return {
      categorias: categorias.map(categoria => ({ id: categoria.id_categoria_incidencia, codigo: categoria.codigo, nombre: categoria.nombre })),
      areas: areas.map(area => ({ id: area.area_trabajo_id_area.toString(), nombre: area.area_trabajo_nombre_area || area.area_trabajo_clasificacion || `Área ${area.area_trabajo_id_area.toString()}` })),
      clientes: clientes.map(cliente => ({ id: cliente.cliente_cliente_rut, nombre: nombreCliente(cliente), etiqueta: `${nombreCliente(cliente)} · ${cliente.cliente_cliente_rut}` })),
      ordenes: ordenes.flatMap(orden => orden.tareas_produccion.flatMap(tarea => tarea.ejecuciones.map(ejecucion => ({
        idOrdenTrabajo: orden.orden_trabajo_id_orden.toString(), idEjecucion: ejecucion.id_ejecucion_tarea.toString(), idTarea: tarea.tarea_tarea_id.toString(),
        etiqueta: `OT-${orden.orden_trabajo_id_orden.toString()} · ${tarea.tarea_titulo || orden.proyecto?.proyecto_nombre_referencia || orden.proyecto?.proyecto_codigo_proyecto || 'Tarea sin descripción'}`,
        estadoOrden: orden.orden_trabajo_estado, estadoEjecucion: ejecucion.estado_ejecucion, fechaEjecucion: ejecucion.fecha_ejecucion,
      })))),
    };
  }

  async registrarIncidenciaRetrabajo(idEjecucion: number, entrada: Record<string, unknown>, actor: ActorIncidenciaM6) {
    const descripcion = texto(entrada.descripcion, 2000); if (!descripcion) throw new ErrorAplicacion(400, 'La descripción es obligatoria');
    const idCategoria = Number(entrada.idCategoria); if (!Number.isInteger(idCategoria) || idCategoria <= 0) throw new ErrorAplicacion(400, 'La categoría es obligatoria');
    const areaTexto = entrada.idArea === undefined || entrada.idArea === null || entrada.idArea === '' ? '' : String(entrada.idArea);
    if (areaTexto && !/^\d+$/.test(areaTexto)) throw new ErrorAplicacion(400, 'Área responsable inválida');
    const idArea = areaTexto ? BigInt(areaTexto) : null;
    const evidencia = leerEvidenciaIncidencia(entrada.evidencia);
    const salida = await prisma.$transaction(async tx => {
      const clienteRut = entrada.clienteRut === undefined ? '' : String(entrada.clienteRut).trim();
      const idOrdenTexto = entrada.idOrdenTrabajo === undefined ? '' : String(entrada.idOrdenTrabajo).trim();
      if (Boolean(clienteRut) !== Boolean(idOrdenTexto)) throw new ErrorAplicacion(400, 'Cliente y orden de trabajo deben informarse juntos');
      if (idOrdenTexto && !/^\d+$/.test(idOrdenTexto)) throw new ErrorAplicacion(400, 'Orden de trabajo inválida');
      const [ejecucion, categoria, area] = await Promise.all([
        tx.ejecucion_tarea.findUnique({ where: { id_ejecucion_tarea: BigInt(idEjecucion) }, include: { tarea: { include: { orden_trabajo: { include: { proyecto: true } } } } } }),
        tx.categoria_incidencia_terreno.findFirst({ where: { id_categoria_incidencia: idCategoria, activa: true } }),
        idArea === null ? null : tx.area_trabajo.findFirst({ where: { area_trabajo_id_area: idArea, area_trabajo_activo: { not: false } } }),
      ]);
      if (!ejecucion) throw new ErrorAplicacion(404, 'Ejecución no encontrada');
      if (clienteRut) {
        const orden = ejecucion.tarea.orden_trabajo;
        if (!orden || orden.orden_trabajo_id_orden !== BigInt(idOrdenTexto) || orden.proyecto?.rut_cliente !== clienteRut) throw new ErrorAplicacion(409, 'La ejecución no pertenece a la orden de trabajo y cliente seleccionados');
      }
      if (!categoria) throw new ErrorAplicacion(400, 'Categoría de incidencia no disponible');
      if (idArea !== null && !area) throw new ErrorAplicacion(400, 'Área responsable no disponible');
      const incidencia = await tx.incidencia_retrabajo_tarea.create({ data: { id_ejecucion_tarea: ejecucion.id_ejecucion_tarea, descripcion, causa_referencia: texto(entrada.causaReferencia, 500) || null, responsabilidad: texto(entrada.responsabilidad, 120) || null, estado: 'pendiente', fecha_registro: new Date(), id_categoria_incidencia: categoria.id_categoria_incidencia, id_area_responsable: idArea, id_usuario_creador: actor.id, estado_revision: 'pendiente_revision' } });
      if (evidencia) await tx.evidencia_terreno.create({ data: { id_incidencia_retrabajo: incidencia.id_incidencia_retrabajo, evidencia_terreno_tipo_evidencia: evidencia.tipo, evidencia_terreno_imagen_o_vector: evidencia.datos, evidencia_terreno_metadata_dispositivo: evidencia.nombre, evidencia_terreno_observacion: evidencia.observacion, evidencia_terreno_fecha_captura: new Date(), evidencia_terreno_estado_evidencia: 'registrada' } });
      return { id: incidencia.id_incidencia_retrabajo.toString(), idEjecucion: incidencia.id_ejecucion_tarea.toString(), descripcion: incidencia.descripcion, categoria: { id: categoria.id_categoria_incidencia, codigo: categoria.codigo, nombre: categoria.nombre }, area: area ? { id: area.area_trabajo_id_area.toString(), nombre: area.area_trabajo_nombre_area || area.area_trabajo_clasificacion } : null, causaReferencia: incidencia.causa_referencia, responsabilidad: incidencia.responsabilidad, estado: incidencia.estado, estadoRevision: incidencia.estado_revision, tieneEvidencia: Boolean(evidencia), fecha: incidencia.fecha_registro };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    return conAuditoriaIncidencia(salida, undefined, { id: salida.id, estado: salida.estado, estadoRevision: salida.estadoRevision, categoria: salida.categoria.codigo, area: salida.area?.id || null, tieneEvidencia: salida.tieneEvidencia });
  }

  async listarIncidenciasOperativas(consulta:Record<string,unknown>={}) {
    const pagina=Math.max(1,Number(consulta.pagina)||1);
    const tamano=Math.min(50,Math.max(5,Number(consulta.tamano)||10));
    const where:Prisma.incidencia_retrabajo_tareaWhereInput={};
    const fecha=texto(consulta.fecha,10);
    if(fecha){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(fecha))throw new ErrorAplicacion(400,'Fecha de incidencia inválida');
      const desde=new Date(`${fecha}T00:00:00.000Z`);const hasta=new Date(desde);hasta.setUTCDate(hasta.getUTCDate()+1);where.fecha_registro={gte:desde,lt:hasta};
    }
    const categoria=Number(consulta.categoria);if(Number.isInteger(categoria)&&categoria>0)where.id_categoria_incidencia=categoria;
    const area=String(consulta.area||'').trim();if(area){if(!/^\d+$/.test(area))throw new ErrorAplicacion(400,'Área inválida');where.id_area_responsable=BigInt(area);}
    const ot=String(consulta.ot||'').trim();if(ot){if(!/^\d+$/.test(ot))throw new ErrorAplicacion(400,'Orden de Trabajo inválida');where.ejecucion={tarea:{id_orden_trabajo:BigInt(ot)}};}
    const revision=texto(consulta.estadoRevision,30);if(revision&&revision!=='TODOS'){if(!['pendiente_revision','aprobada','rechazada'].includes(revision))throw new ErrorAplicacion(400,'Estado de revisión inválido');where.estado_revision=revision;}
    const resolucion=texto(consulta.estadoResolucion,20);if(resolucion&&resolucion!=='TODOS'){if(!['pendiente','corregida','cerrada'].includes(resolucion))throw new ErrorAplicacion(400,'Estado de resolución inválido');where.estado=resolucion;}
    const busqueda=texto(consulta.busqueda,100);if(busqueda){
      const idReferencia=/^(?:INC-)?0*(\d+)$/i.exec(busqueda)?.[1];
      where.OR=[
        {descripcion:{contains:busqueda,mode:'insensitive'}},{causa_referencia:{contains:busqueda,mode:'insensitive'}},{responsabilidad:{contains:busqueda,mode:'insensitive'}},
        {ejecucion:{tarea:{tarea_titulo:{contains:busqueda,mode:'insensitive'}}}},
        ...(idReferencia?[{id_incidencia_retrabajo:BigInt(idReferencia)}]:[]),
      ];
    }
    const include={
      categoria:true,area_responsable:true,creador:true,revisor:true,
      evidencias:{select:{evidencia_terreno_evidencia_terreno_id:true,evidencia_terreno_tipo_evidencia:true,evidencia_terreno_metadata_dispositivo:true,evidencia_terreno_fecha_captura:true,evidencia_terreno_estado_evidencia:true}},
      ejecucion:{include:{
        ejecutor:true,
        atribucion_productiva:{include:{empleado_ejecutor:true}},
        tarea:{include:{
          servicio_terreno:true,
          orden_trabajo:{include:{
            proyecto:{include:{cliente:true}},
            unidad_fisica_comercial:{include:{producto:true,familia:true}},
          }},
        }},
      }},
    } as const;
    const [total,filas,baseIndicadores]=await prisma.$transaction([
      prisma.incidencia_retrabajo_tarea.count({where}),
      prisma.incidencia_retrabajo_tarea.findMany({where,include,orderBy:{fecha_registro:'desc'},skip:(pagina-1)*tamano,take:tamano}),
      prisma.incidencia_retrabajo_tarea.findMany({where,select:{estado:true,estado_revision:true,categoria:{select:{codigo:true,nombre:true}},area_responsable:{select:{area_trabajo_id_area:true,area_trabajo_nombre_area:true,area_trabajo_clasificacion:true}}}}),
    ]);
    const contar=(valores:(string|null)[])=>[...valores.reduce((mapa,valor)=>mapa.set(valor||'SIN_INFORMACION',(mapa.get(valor||'SIN_INFORMACION')||0)+1),new Map<string,number>())].map(([nombre,cantidad])=>({nombre,cantidad}));
    const items=filas.map(i=>{
      const tarea=i.ejecucion.tarea;const orden=tarea?.orden_trabajo;const unidad=orden?.unidad_fisica_comercial;const proyecto=orden?.proyecto;const cliente=proyecto?.cliente;
      const participante=i.ejecucion.atribucion_productiva?.empleado_ejecutor;
      const evidencias=i.evidencias.map(e=>({id:e.evidencia_terreno_evidencia_terreno_id.toString(),tipo:e.evidencia_terreno_tipo_evidencia,nombre:e.evidencia_terreno_metadata_dispositivo,fecha:e.evidencia_terreno_fecha_captura,estado:e.evidencia_terreno_estado_evidencia,registrador:null}));
      const trazabilidad=[{tipo:'CREACION',fecha:i.fecha_registro,usuario:nombreUsuario(i.creador),detalle:'Incidencia registrada'},...evidencias.filter(e=>e.fecha).map(e=>({tipo:'EVIDENCIA',fecha:e.fecha,usuario:null,detalle:`Evidencia agregada: ${e.nombre||e.id}`})),...(i.fecha_revision?[{tipo:i.estado_revision==='aprobada'?'APROBACION':'RECHAZO',fecha:i.fecha_revision,usuario:nombreUsuario(i.revisor),detalle:i.observacion_revision||'Decisión gerencial registrada'}]:[])].sort((a,b)=>new Date(b.fecha!).getTime()-new Date(a.fecha!).getTime());
      return{id:i.id_incidencia_retrabajo.toString(),referencia:`INC-${i.id_incidencia_retrabajo.toString().padStart(5,'0')}`,descripcion:i.descripcion,categoria:i.categoria?{id:i.categoria.id_categoria_incidencia,codigo:i.categoria.codigo,nombre:i.categoria.nombre}:null,area:i.area_responsable?{id:i.area_responsable.area_trabajo_id_area.toString(),nombre:i.area_responsable.area_trabajo_nombre_area||i.area_responsable.area_trabajo_clasificacion}:null,causaReferencia:i.causa_referencia,responsabilidad:i.responsabilidad,responsableSeguimiento:null,responsableOwner:{id:i.ejecucion.id_usuario_ejecutor.toString(),nombre:nombreUsuario(i.ejecucion.ejecutor)},participantes:[participante?{tipo:'EMPLEADO_EJECUTOR',id:String(participante.id_empleado),nombre:nombreCompleto(participante)}:{tipo:'USUARIO_REGISTRADOR_EJECUCION',id:i.ejecucion.id_usuario_ejecutor.toString(),nombre:nombreUsuario(i.ejecucion.ejecutor)}],estado:i.estado,estadoRevision:i.estado_revision,fecha:i.fecha_registro,creador:{id:i.id_usuario_creador?.toString()||null,nombre:nombreUsuario(i.creador)},revision:i.id_usuario_revisor?{idUsuario:i.id_usuario_revisor.toString(),nombre:nombreUsuario(i.revisor),fecha:i.fecha_revision,observacion:i.observacion_revision}:null,evidencias,trazabilidad,origen:tarea?.id_servicio_terreno?{tipo:/postventa/i.test(tarea.servicio_terreno?.servicio_terreno_tipo_servicio||'')?'VISITA_POSTVENTA':'VISITA_TERRENO',id:tarea.id_servicio_terreno.toString(),descripcion:tarea.servicio_terreno?.servicio_terreno_tipo_servicio||null}:{tipo:'EJECUCION_PRODUCCION',id:i.ejecucion.id_ejecucion_tarea.toString(),descripcion:tarea?.tarea_titulo||null},ejecucion:{id:i.id_ejecucion_tarea.toString(),tarea:tarea?{id:tarea.tarea_tarea_id.toString(),titulo:tarea.tarea_titulo,idOrdenTrabajo:tarea.id_orden_trabajo?.toString()||null,idServicio:tarea.id_servicio_terreno?.toString()||null,proyecto:proyecto?{id:proyecto.proyecto_proyecto_id.toString(),codigo:proyecto.proyecto_codigo_proyecto,nombre:proyecto.proyecto_nombre_referencia}:null}:null},cliente:cliente?{rut:cliente.cliente_cliente_rut,nombre:cliente.cliente_razon_social||cliente.cliente_cliente_b2b_razon_social||[cliente.cliente_cliente_b2c_primer_nombre,cliente.cliente_cliente_b2c_primer_apellido].filter(Boolean).join(' ')||null}:null,puerta:unidad?{numeroUnidad:unidad.numero_unidad,producto:unidad.producto.nombre_comercial,codigo:unidad.producto.codigo_comercial,familia:unidad.familia.nombre}:null,accionesCorrectivas:{disponibles:false,detalle:'El modelo actual sólo conserva el estado operativo pendiente, corregida o cerrada; no registra múltiples acciones correctivas.'}};
    });
    const categoriasIndicador=contar(baseIndicadores.map(i=>i.categoria?.nombre||null));const areasIndicador=contar(baseIndicadores.map(i=>i.area_responsable?.area_trabajo_nombre_area||i.area_responsable?.area_trabajo_clasificacion||null));
    return{items,paginacion:{pagina,tamano,total,totalPaginas:Math.max(1,Math.ceil(total/tamano))},indicadores:{registradas:total,pendientesRevision:baseIndicadores.filter(i=>i.estado_revision==='pendiente_revision').length,aprobadas:baseIndicadores.filter(i=>i.estado_revision==='aprobada').length,rechazadas:baseIndicadores.filter(i=>i.estado_revision==='rechazada').length,pendientesResolucion:baseIndicadores.filter(i=>i.estado!=='cerrada').length,resueltas:baseIndicadores.filter(i=>i.estado==='cerrada').length,categorias:categoriasIndicador,areas:areasIndicador},fuentes:{estadoResolucion:'Estado operativo existente: pendiente, corregida o cerrada',accionesCorrectivas:'NO_DISPONIBLE',responsableSeguimiento:'NO_DISPONIBLE'}};
  }

  async obtenerEvidenciaIncidencia(idIncidencia: number, idEvidencia: number) {
    const evidencia = await prisma.evidencia_terreno.findFirst({ where: { evidencia_terreno_evidencia_terreno_id: BigInt(idEvidencia), id_incidencia_retrabajo: BigInt(idIncidencia) } });
    if (!evidencia?.evidencia_terreno_imagen_o_vector) throw new ErrorAplicacion(404, 'Evidencia no encontrada');
    const tipo = evidencia.evidencia_terreno_tipo_evidencia || 'application/octet-stream';
    return { nombre: evidencia.evidencia_terreno_metadata_dispositivo || `evidencia-${idEvidencia}`, tipo, contenido: `data:${tipo};base64,${Buffer.from(evidencia.evidencia_terreno_imagen_o_vector).toString('base64')}` };
  }

  async adjuntarEvidenciaIncidencia(id: number, entrada: Record<string, unknown>, actor: ActorIncidenciaM6) {
    const evidencia = leerEvidenciaIncidencia(entrada.evidencia); if (!evidencia) throw new ErrorAplicacion(400, 'La evidencia es obligatoria');
    const salida = await prisma.$transaction(async tx => {
      const incidencia = await tx.incidencia_retrabajo_tarea.findUnique({ where: { id_incidencia_retrabajo: BigInt(id) } });
      if (!incidencia) throw new ErrorAplicacion(404, 'Incidencia no encontrada');
      if (incidencia.id_usuario_creador !== actor.id && !actor.permisos.includes('CU213')) throw new ErrorAplicacion(403, 'Sólo el creador o un revisor autorizado puede adjuntar evidencia');
      if (incidencia.estado_revision !== 'pendiente_revision') throw new ErrorAplicacion(409, 'No se puede agregar evidencia después de la revisión');
      const creada = await tx.evidencia_terreno.create({ data: { id_incidencia_retrabajo: incidencia.id_incidencia_retrabajo, evidencia_terreno_tipo_evidencia: evidencia.tipo, evidencia_terreno_imagen_o_vector: evidencia.datos, evidencia_terreno_metadata_dispositivo: evidencia.nombre, evidencia_terreno_observacion: evidencia.observacion, evidencia_terreno_fecha_captura: new Date(), evidencia_terreno_estado_evidencia: 'registrada' } });
      return { id: incidencia.id_incidencia_retrabajo.toString(), idEvidencia: creada.evidencia_terreno_evidencia_terreno_id.toString(), tieneEvidencia: true };
    });
    return conAuditoriaIncidencia(salida, undefined, { id: salida.id, evidenciaAgregada: salida.idEvidencia });
  }

  async actualizarIncidenciaOperativa(id: number, entrada: Record<string, unknown>) {
    const accion = texto(entrada.accion, 20).toLowerCase();
    if (!['corregir', 'cerrar', 'clasificar'].includes(accion)) throw new ErrorAplicacion(400, 'Acción de incidencia inválida');
    return prisma.$transaction(async (tx) => {
      const actual = await tx.incidencia_retrabajo_tarea.findUnique({ where: { id_incidencia_retrabajo: BigInt(id) } });
      if (!actual) throw new ErrorAplicacion(404, 'Incidencia no encontrada');
      if (accion === 'clasificar') {
        if (actual.estado_revision !== 'pendiente_revision') throw new ErrorAplicacion(409, 'No se puede reclasificar una incidencia ya revisada');
        const idCategoria = Number(entrada.idCategoria); if (!Number.isInteger(idCategoria) || idCategoria <= 0) throw new ErrorAplicacion(400, 'La categoría es obligatoria');
        const areaTexto = entrada.idArea === undefined || entrada.idArea === null || entrada.idArea === '' ? '' : String(entrada.idArea); if (areaTexto && !/^\d+$/.test(areaTexto)) throw new ErrorAplicacion(400, 'Área responsable inválida'); const idArea = areaTexto ? BigInt(areaTexto) : null;
        const [categoria, area] = await Promise.all([tx.categoria_incidencia_terreno.findFirst({ where: { id_categoria_incidencia: idCategoria, activa: true } }), idArea ? tx.area_trabajo.findFirst({ where: { area_trabajo_id_area: idArea, area_trabajo_activo: { not: false } } }) : null]);
        if (!categoria || idArea && !area) throw new ErrorAplicacion(400, 'Categoría o área no disponible');
        await tx.incidencia_retrabajo_tarea.update({ where: { id_incidencia_retrabajo: actual.id_incidencia_retrabajo }, data: { id_categoria_incidencia: idCategoria, id_area_responsable: idArea } });
        return conAuditoriaIncidencia({ id: actual.id_incidencia_retrabajo.toString(), estado: actual.estado, categoria: categoria.codigo, idArea: idArea?.toString() || null }, { categoria: actual.id_categoria_incidencia, idArea: actual.id_area_responsable?.toString() || null }, { categoria: categoria.codigo, idArea: idArea?.toString() || null });
      }
      const esperado = accion === 'corregir' ? 'pendiente' : 'corregida'; const siguiente = accion === 'corregir' ? 'corregida' : 'cerrada';
      validarTransicionResolucionIncidenciaM6({accion:accion as 'corregir'|'cerrar',estado:actual.estado,estadoRevision:actual.estado_revision,confirmado:entrada.confirmado===true});
      const causa = texto(entrada.causaReferencia, 500) || actual.causa_referencia; const responsabilidad = texto(entrada.responsabilidad, 120) || actual.responsabilidad;
      if (accion === 'corregir' && (!actual.descripcion.trim() || (!causa && !responsabilidad))) throw new ErrorAplicacion(400, 'La corrección requiere contexto, causa o responsabilidad');
      const cambio = await tx.incidencia_retrabajo_tarea.updateMany({ where: { id_incidencia_retrabajo: actual.id_incidencia_retrabajo, estado: esperado }, data: { estado: siguiente, causa_referencia: causa, responsabilidad } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La incidencia cambió concurrentemente o la transición no es válida');
      return conAuditoriaIncidencia({ id: actual.id_incidencia_retrabajo.toString(), estado: siguiente, causaReferencia: causa, responsabilidad }, { estado: actual.estado, causaReferencia: actual.causa_referencia, responsabilidad: actual.responsabilidad }, { estado: siguiente, causaReferencia: causa, responsabilidad });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async resolverIncidenciaOperativa(id: number, decision: 'aprobada' | 'rechazada', entrada: Record<string, unknown>, actor: ActorIncidenciaM6) {
    return prisma.$transaction(async tx => {
      const actual = await tx.incidencia_retrabajo_tarea.findUnique({ where: { id_incidencia_retrabajo: BigInt(id) }, include: { evidencias: { select: { evidencia_terreno_evidencia_terreno_id: true } } } });
      if (!actual) throw new ErrorAplicacion(404, 'Incidencia no encontrada');
      validarRevisionIncidenciaM6({ estadoRevision: actual.estado_revision, idCreador: actual.id_usuario_creador, idRevisor: actor.id, idCategoria: actual.id_categoria_incidencia, cantidadEvidencias: actual.evidencias.length, decision });
      const observacion = texto(entrada.observacion, 2000) || null;
      const cambio = await tx.incidencia_retrabajo_tarea.updateMany({ where: { id_incidencia_retrabajo: actual.id_incidencia_retrabajo, estado_revision: 'pendiente_revision' }, data: { estado_revision: decision, id_usuario_revisor: actor.id, fecha_revision: new Date(), observacion_revision: observacion } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La incidencia cambió concurrentemente');
      return conAuditoriaIncidencia({ id: actual.id_incidencia_retrabajo.toString(), estadoRevision: decision, observacion, idRevisor: actor.id.toString() }, { estadoRevision: actual.estado_revision }, { estadoRevision: decision, observacion, idRevisor: actor.id.toString() });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async catalogoDeduccionesEmpleado() {
    return (await prisma.concepto_remuneracion.findMany({ where: { naturaleza_concepto: 'descuento', estado_concepto: 'activo' }, orderBy: { nombre_concepto: 'asc' } })).map((c) => ({ id: c.id_concepto_remuneracion, codigo: c.codigo_m6, nombre: c.nombre_concepto }));
  }

  async listarDeduccionesEmpleado(idEmpleado: number) {
    if (!await prisma.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    return (await prisma.asignacion_concepto_remuneracion_empleado.findMany({ where: { id_empleado: idEmpleado, concepto: { naturaleza_concepto: 'descuento' } }, include: { concepto: true }, orderBy: { vigencia_desde: 'desc' } })).map((a) => ({ id: a.id_asignacion_concepto, idConcepto: a.id_concepto, concepto: a.concepto.nombre_concepto, vigenciaDesde: a.vigencia_desde, vigenciaHasta: a.vigencia_hasta, valorAplicable: a.valor_aplicable?.toString() || null, fundamento: a.fundamento, autorizacionReferencia: a.autorizacion_referencia, activa: a.activa }));
  }

  async asignarDeduccionEmpleado(idEmpleado: number, entrada: Record<string, unknown>) {
    const idConcepto = identificador(entrada.idConcepto); const { desde, hasta } = this.intervalo(entrada);
    const valor = decimalOpcional(entrada.valorAplicable, 'Valor aplicable'); const fundamento = texto(entrada.fundamento, 2000); const autorizacion = texto(entrada.autorizacionReferencia, 200);
    if (!fundamento || !autorizacion) throw new ErrorAplicacion(400, 'Fundamento y autorización son obligatorios');
    try { await prisma.$transaction(async (tx) => {
      if (!await tx.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
      const concepto = await tx.concepto_remuneracion.findUnique({ where: { id_concepto_remuneracion: idConcepto } });
      if (!concepto || concepto.estado_concepto !== 'activo' || concepto.naturaleza_concepto !== 'descuento') throw new ErrorAplicacion(400, 'CU214 sólo permite conceptos DEDUCCION activos');
      const conflicto = await tx.asignacion_concepto_remuneracion_empleado.count({ where: { id_empleado: idEmpleado, id_concepto: idConcepto, vigencia_desde: hasta ? { lte: hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } });
      if (conflicto) throw new ErrorAplicacion(409, 'La deducción se superpone con otra vigencia');
      await tx.asignacion_concepto_remuneracion_empleado.create({ data: { id_empleado: idEmpleado, id_concepto: idConcepto, vigencia_desde: desde, vigencia_hasta: hasta, valor_aplicable: valor, fundamento, autorizacion_referencia: autorizacion } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); return this.listarDeduccionesEmpleado(idEmpleado); } catch (error) { this.conflictoConcurrente(error, 'La deducción cambió concurrentemente'); }
  }

  async finalizarDeduccionEmpleado(idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown>) {
    const hasta = fechaEntrada(entrada.vigenciaHasta, 'Vigencia hasta')!;
    try {
      await prisma.$transaction(async (tx) => {
        const actual = await tx.asignacion_concepto_remuneracion_empleado.findFirst({ where: { id_asignacion_concepto: idAsignacion, id_empleado: idEmpleado, concepto: { naturaleza_concepto: 'descuento' } } });
        if (!actual) throw new ErrorAplicacion(404, 'Deducción no encontrada');
        if (!actual.activa) throw new ErrorAplicacion(409, 'La deducción ya fue finalizada');
        if (hasta < actual.vigencia_desde) throw new ErrorAplicacion(400, 'La fecha de término no puede ser anterior al inicio');
        const actualizada = await tx.asignacion_concepto_remuneracion_empleado.updateMany({ where: { id_asignacion_concepto: idAsignacion, id_empleado: idEmpleado, activa: true }, data: { vigencia_hasta: hasta, activa: false } });
        if (actualizada.count !== 1) throw new ErrorAplicacion(409, 'La deducción fue finalizada o modificada concurrentemente');
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarDeduccionesEmpleado(idEmpleado);
    } catch (error) { this.conflictoConcurrente(error, 'La deducción fue finalizada o modificada concurrentemente'); }
  }

  async consultarDashboardTerreno(consulta: Record<string, unknown>, actor: ActorTerrenoM6) {
    const permisos = new Set(actor.permisos || []);
    const autorizado = (...codigos: string[]) => actor.administrador || codigos.some((codigo) => permisos.has(codigo));
    const desde = consulta.desde ? fechaEntrada(consulta.desde, 'Fecha desde')! : new Date(Date.now() - 30 * 86_400_000);
    const hastaBase = consulta.hasta ? fechaEntrada(consulta.hasta, 'Fecha hasta')! : new Date();
    const hasta = new Date(hastaBase.getTime() + 86_400_000);
    if (desde > hastaBase) throw new ErrorAplicacion(400, 'La fecha desde no puede ser posterior a la fecha hasta');
    const idArea = consulta.area ? BigInt(identificador(consulta.area)) : null;
    const idResponsable = consulta.responsable ? identificador(consulta.responsable) : null;
    const estadoFiltro = texto(consulta.estado, 60).toUpperCase();
    const tipoActividad = texto(consulta.tipoActividad, 60).toUpperCase();
    const hoyChile = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

    const puedeOt = autorizado('CU202', 'CU205', 'CU207', 'CU209');
    const puedeVisitas = autorizado('CU199', 'CU200', 'CU210', 'CU211');
    const puedeIncidencias = autorizado('CU212', 'CU213');
    const whereOt: Prisma.unidad_fisica_orden_trabajoWhereInput = {};
    if (puedeOt && !this.puedeGestionarTodasLasRectificaciones(actor)) {
      if (!actor.alcanceEmpleadoId) Object.assign(whereOt, { id_unidad_fisica_ot: BigInt(-1) });
      else whereOt.rectificacion = { is: { id_empleado_rectificador: actor.alcanceEmpleadoId } };
    }

    const [unidades, tareasDb, visitasDb, instalacionesDb, incidenciasDb] = await Promise.all([
      puedeOt ? prisma.unidad_fisica_orden_trabajo.findMany({
        where: whereOt,
        select: {
          id_unidad_fisica_ot: true, id_orden_trabajo: true, estado: true, creado_en: true,
          orden_trabajo: { select: { orden_trabajo_estado: true } },
          rectificacion: { select: { estado: true, fecha_rectificacion: true, versiones: { select: { enviado_en: true, decision: { select: { decidido_en: true } } }, orderBy: { numero_version: 'desc' }, take: 1 } } },
          liberacion: { select: { liberado_en: true } }, cierre_produccion: { select: { finalizado_en: true } },
        }, orderBy: { creado_en: 'desc' },
      }) : Promise.resolve([]),
      puedeOt ? prisma.tarea_ejecutable_unidad_ot.findMany({
        where: { unidad: whereOt, ...(idArea || idResponsable ? { estado_operacional: { is: { ...(idArea ? { id_area_trabajo: idArea } : {}), ...(idResponsable ? { id_empleado_responsable: idResponsable } : {}) } } } : {}) },
        select: {
          id_tarea_ejecutable_ot: true, id_unidad_fisica_ot: true, id_tarea_origen_correctiva: true,
          estado_operacional: { select: { estado: true, area: { select: { area_trabajo_id_area: true, area_trabajo_nombre_area: true } }, empleado_responsable: { select: { id_empleado: true, nombres: true, apellido_paterno: true, apellido_materno: true } } } },
          tarea: { select: { ejecuciones: { select: { estado_validacion_productiva: true } } } },
        }, orderBy: [{ id_unidad_fisica_ot: 'asc' }, { orden_etapa: 'asc' }, { orden_tarea: 'asc' }],
      }) : Promise.resolve([]),
      puedeVisitas ? prisma.servicio_terreno.findMany({
        where: { OR: [{ servicio_terreno_fecha_real: { gte: desde, lt: hasta } }, { servicio_terreno_fecha_real: null }], ...(tipoActividad ? { servicio_terreno_tipo_servicio: { contains: tipoActividad, mode: 'insensitive' } } : {}) },
        select: { servicio_terreno_servicio_terreno_id: true, servicio_terreno_tipo_servicio: true, servicio_terreno_fecha_real: true, servicio_terreno_estado: true, obra: { select: { obra_nombre_obra: true } } },
        orderBy: [{ servicio_terreno_fecha_real: 'asc' }, { servicio_terreno_servicio_terreno_id: 'asc' }],
      }) : Promise.resolve([]),
      puedeVisitas ? prisma.tarea.findMany({
        where: { id_orden_trabajo: { not: null }, id_servicio_terreno: { not: null }, servicio_terreno: { is: { servicio_terreno_tipo_servicio: { contains: 'instal', mode: 'insensitive' }, servicio_terreno_fecha_real: { gte: desde, lt: hasta } } } },
        select: { id_orden_trabajo: true, id_servicio_terreno: true, servicio_terreno: { select: { servicio_terreno_estado: true } }, formulario_de_cierre: { select: { formulario_de_cierre_resultado_finalizado: true }, orderBy: { formulario_de_cierre_formulario_de_cierre_id: 'desc' }, take: 1 } },
      }) : Promise.resolve([]),
      puedeIncidencias ? prisma.incidencia_retrabajo_tarea.findMany({
        where: { fecha_registro: { gte: desde, lt: hasta }, ...(idArea ? { id_area_responsable: idArea } : {}) },
        select: { id_incidencia_retrabajo: true, estado: true, estado_revision: true, fecha_registro: true, categoria: { select: { nombre: true } }, area_responsable: { select: { area_trabajo_nombre_area: true } } },
        orderBy: { fecha_registro: 'asc' },
      }) : Promise.resolve([]),
    ]);

    const ots: OtDashboard[] = unidades.map((unidad: any) => ({ id: unidad.id_orden_trabajo.toString(), estadoUnidad: unidad.estado, estadoOrden: unidad.orden_trabajo.orden_trabajo_estado, estadoRectificacion: unidad.rectificacion?.estado || null, creada: unidad.creado_en, rectificada: unidad.rectificacion?.fecha_rectificacion || null, enviada: unidad.rectificacion?.versiones[0]?.enviado_en || null, decidida: unidad.rectificacion?.versiones[0]?.decision?.decidido_en || null, liberada: unidad.liberacion?.liberado_en || null, cerrada: unidad.cierre_produccion?.finalizado_en || null }));
    const tareas: TareaDashboard[] = tareasDb.map((item: any) => ({ id: item.id_tarea_ejecutable_ot.toString(), idOt: item.id_unidad_fisica_ot.toString(), estado: item.estado_operacional?.estado || 'PENDIENTE', areaId: item.estado_operacional?.area?.area_trabajo_id_area?.toString() || null, area: item.estado_operacional?.area?.area_trabajo_nombre_area || null, responsableId: item.estado_operacional?.empleado_responsable?.id_empleado || null, responsable: item.estado_operacional?.empleado_responsable ? nombreCompleto(item.estado_operacional.empleado_responsable) : null, ejecuciones: item.tarea.ejecuciones.map((ejecucion: any) => ({ validacion: ejecucion.estado_validacion_productiva })), esCorrectiva: item.id_tarea_origen_correctiva !== null }));
    const otsConProduccion = new Set(tareas.filter((tarea) => !['PENDIENTE', 'ASIGNADA'].includes(tarea.estado.toUpperCase())).map((tarea) => tarea.idOt));
    ots.forEach((ot) => { if (ot.estadoUnidad === 'LIBERADA' && otsConProduccion.has(ot.id) && !ot.cerrada) ot.estadoUnidad = 'EN_PRODUCCION'; });
    const operacion = resumirOperacionTerreno(ots, tareas);
    if (estadoFiltro) operacion.ordenes.estados = operacion.ordenes.estados.filter((item) => item.codigo === estadoFiltro);

    const visitas = visitasDb.map((visita: any) => ({ id: visita.servicio_terreno_servicio_terreno_id.toString(), tipo: visita.servicio_terreno_tipo_servicio || 'Visita', fecha: visita.servicio_terreno_fecha_real, estado: visita.servicio_terreno_estado || 'sin_estado', obra: visita.obra?.obra_nombre_obra || null }));
    const esFinalizada = (estado: string) => /finaliz|complet|realiz/.test(estado.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
    const esReprogramada = (estado: string) => /reprogram/.test(estado.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase());
    const resumenVisitas = { total: visitas.length, hoy: visitas.filter((v) => v.fecha?.toISOString().slice(0, 10) === hoyChile).length, proximas: visitas.filter((v) => v.fecha && v.fecha.toISOString().slice(0, 10) > hoyChile && !esFinalizada(v.estado)).length, sinProgramar: visitas.filter((v) => !v.fecha).length, pendientes: visitas.filter((v) => !esFinalizada(v.estado) && !esReprogramada(v.estado)).length, finalizadas: visitas.filter((v) => esFinalizada(v.estado)).length, reprogramadas: visitas.filter((v) => esReprogramada(v.estado)).length, proximasActividades: visitas.filter((v) => v.fecha && v.fecha.toISOString().slice(0, 10) >= hoyChile).slice(0, 5) };
    const instalacionesUnicas = [...new Map(instalacionesDb.map((item: any) => [`${item.id_servicio_terreno}:${item.id_orden_trabajo}`, item])).values()] as any[];
    const clasificaciones = instalacionesUnicas.map((item) => clasificarResultadoInstalacion(item.servicio_terreno?.servicio_terreno_estado || null, item.formulario_de_cierre[0]?.formulario_de_cierre_resultado_finalizado || null));
    const instalaciones = { total: clasificaciones.length, programadas: clasificaciones.filter((c) => c === 'PENDIENTE').length, pendientes: clasificaciones.filter((c) => c === 'PENDIENTE').length, completadas: clasificaciones.filter((c) => c === 'INSTALACION_COMPLETADA').length, parciales: clasificaciones.filter((c) => c === 'PARCIALMENTE_REALIZADA').length, noEjecutadas: clasificaciones.filter((c) => c === 'VISITA_NO_EJECUTADA').length, reprogramaciones: clasificaciones.filter((c) => c === 'REPROGRAMACION_NECESARIA').length };

    const incidencias = resumirIncidenciasTerreno(incidenciasDb.map((item: any) => ({ estado: item.estado, estadoRevision: item.estado_revision, categoria: item.categoria?.nombre || null, area: item.area_responsable?.area_trabajo_nombre_area || null, periodo: item.fecha_registro.toISOString().slice(0, 7) })));

    return { filtros: { desde: desde.toISOString().slice(0, 10), hasta: hastaBase.toISOString().slice(0, 10), estado: estadoFiltro || null, area: idArea?.toString() || null, responsable: idResponsable, tipoActividad: tipoActividad || null }, alcance: { ordenes: 'ESTADO_ACTUAL', fabricacion: 'ESTADO_ACTUAL', visitas: 'EVENTOS_DEL_PERIODO', instalaciones: 'EVENTOS_DEL_PERIODO', incidencias: 'EVENTOS_DEL_PERIODO' }, permisos: { ordenes: puedeOt, visitas: puedeVisitas, incidencias: puedeIncidencias, responsables: autorizado('CU207', 'CU209') }, ...operacion, responsables: autorizado('CU207', 'CU209') ? operacion.responsables : null, visitas: puedeVisitas ? resumenVisitas : null, instalaciones: puedeVisitas ? instalaciones : null, incidencias: puedeIncidencias ? incidencias : null };
  }

  async exportarReporteTerreno(consulta: Record<string, unknown>, actor: ActorTerrenoM6) {
    const panel = await this.consultarDashboardTerreno(consulta, actor);
    const filas: Array<{ seccion: string; indicador: string; valor: string | number; alcance: string }> = [];
    if (panel.permisos.ordenes) {
      filas.push({ seccion: 'Órdenes de trabajo', indicador: 'Total de OT visibles', valor: panel.ordenes.total, alcance: panel.alcance.ordenes });
      panel.ordenes.estados.forEach((item) => filas.push({ seccion: 'Órdenes de trabajo', indicador: item.nombre, valor: item.cantidad, alcance: panel.alcance.ordenes }));
      panel.areas.forEach((item) => filas.push({ seccion: 'Producción por área', indicador: `${item.nombre} · tareas asignadas`, valor: item.asignadas, alcance: panel.alcance.fabricacion }));
    }
    if (panel.visitas) Object.entries(panel.visitas).filter(([, valor]) => typeof valor === 'number').forEach(([indicador, valor]) => filas.push({ seccion: 'Visitas', indicador, valor: valor as number, alcance: panel.alcance.visitas }));
    if (panel.instalaciones) Object.entries(panel.instalaciones).forEach(([indicador, valor]) => filas.push({ seccion: 'Instalaciones', indicador, valor, alcance: panel.alcance.instalaciones }));
    if (panel.incidencias) Object.entries(panel.incidencias).filter(([, valor]) => typeof valor === 'number').forEach(([indicador, valor]) => filas.push({ seccion: 'Incidencias', indicador, valor: valor as number, alcance: panel.alcance.incidencias }));
    if (!filas.length) throw new ErrorAplicacion(409, 'No existe cobertura autorizada para exportar el reporte');
    return archivoCsvAdministrativo(`reporte-terreno-${panel.filtros.desde}-${panel.filtros.hasta}.csv`, filas, [
      { encabezado: 'Sección', valor: (fila) => fila.seccion }, { encabezado: 'Indicador', valor: (fila) => fila.indicador }, { encabezado: 'Valor', valor: (fila) => fila.valor }, { encabezado: 'Alcance', valor: (fila) => fila.alcance },
    ], ';');
  }
}
