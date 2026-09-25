import { prisma } from '../db';
import { Prisma } from '@prisma/client';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { normalizarRut, validarYNormalizarRut, variantesRut } from '../utilidades/rut';
import { identificador, numeroNoNegativo, texto } from '../validaciones/solicitudes';

type Direccion = 'asc' | 'desc';

const nombreCompleto = (empleado: {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string | null;
}) => [empleado.nombres, empleado.apellido_paterno, empleado.apellido_materno].filter(Boolean).join(' ');

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

export class M6Controller {
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
      },
      select: {
        id_empleado: true,
        rut_empleado: true,
        nombres: true,
        apellido_paterno: true,
        apellido_materno: true,
        estado_laboral: true,
        cargo: { select: { nombre_cargo: true } },
      },
      orderBy,
    });

    return empleados.map((empleado) => ({
      id: empleado.id_empleado,
      rut: empleado.rut_empleado,
      nombreCompleto: nombreCompleto(empleado),
      estado: empleado.estado_laboral,
      cargoActual: empleado.cargo?.nombre_cargo || null,
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
    };
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
        correo_particular: true,
        telefono_particular: true,
        direccion_particular: true,
        tipo_correo: true,
        consentimiento_electronico: true,
        canal_documental: true,
        cargo: { select: { nombre_cargo: true } },
        afp: { select: { nombre_afp: true } },
        prevision_salud: { select: { nombre_prevision_salud: true } },
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
      seguroCesantia: empleado.seguro_cesantia,
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
        if (!await tx.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
        if (typeof idCargo === 'number' && !await tx.cargo.count({ where: { id_cargo: idCargo, estado_cargo: 'activo' } })) throw new ErrorAplicacion(404, 'Cargo activo no encontrado');
        if (typeof idAfp === 'number' && !await tx.afp.count({ where: { id_afp: idAfp, estado_afp: 'activo' } })) throw new ErrorAplicacion(404, 'AFP activa no encontrada');
        if (typeof idSalud === 'number' && !await tx.prevision_salud.count({ where: { id_prevision_salud: idSalud, estado_prevision_salud: 'activo' } })) throw new ErrorAplicacion(404, 'Institución de salud activa no encontrada');
        await tx.empleado.update({ where: { id_empleado: idEmpleado }, data });
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
          id_empleado: idEmpleado, id_esquema: idEsquema, activa: true,
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
    const actual = await prisma.asignacion_esquema_remuneracional.findFirst({ where: { id_asignacion_esquema: idAsignacion, id_empleado: idEmpleado } });
    if (!actual) throw new ErrorAplicacion(404, 'Asignación de esquema no encontrada');
    if (hasta < actual.vigencia_desde) throw new ErrorAplicacion(400, 'La fecha de término no puede ser anterior al inicio');
    await prisma.asignacion_esquema_remuneracional.update({ where: { id_asignacion_esquema: idAsignacion }, data: { vigencia_hasta: hasta, activa: false } });
    return this.listarAsignacionesEsquemaEmpleado(idEmpleado);
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
        const conflicto = await tx.asignacion_concepto_remuneracion_empleado.count({ where: { id_empleado: idEmpleado, id_concepto: idConcepto, activa: true, vigencia_desde: hasta ? { lte: hasta } : undefined, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: desde } }] } });
        if (conflicto) throw new ErrorAplicacion(409, 'La asignación del haber se superpone con otra vigencia');
        await tx.asignacion_concepto_remuneracion_empleado.create({ data: { id_empleado: idEmpleado, id_concepto: idConcepto, vigencia_desde: desde, vigencia_hasta: hasta, valor_aplicable: valor } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
      return this.listarAsignacionesHaberEmpleado(idEmpleado);
    } catch (error) { this.conflictoConcurrente(error, 'La asignación del haber cambió concurrentemente'); }
  }

  async finalizarAsignacionHaberEmpleado(idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown>) {
    const hasta = fechaEntrada(entrada.vigenciaHasta, 'Vigencia hasta')!;
    const actual = await prisma.asignacion_concepto_remuneracion_empleado.findFirst({ where: { id_asignacion_concepto: idAsignacion, id_empleado: idEmpleado } });
    if (!actual) throw new ErrorAplicacion(404, 'Asignación de haber no encontrada');
    if (hasta < actual.vigencia_desde) throw new ErrorAplicacion(400, 'La fecha de término no puede ser anterior al inicio');
    await prisma.asignacion_concepto_remuneracion_empleado.update({ where: { id_asignacion_concepto: idAsignacion }, data: { vigencia_hasta: hasta, activa: false } });
    return this.listarAsignacionesHaberEmpleado(idEmpleado);
  }

  async obtenerConfiguracionDocumental(idEmpleado: number) {
    const empleado = await prisma.empleado.findUnique({ where: { id_empleado: idEmpleado }, include: { cuenta_m4: { select: { usuario_correo: true } }, usuario: { select: { usuario_correo: true } } } });
    if (!empleado) throw new ErrorAplicacion(404, 'Empleado no encontrado');
    const correoCorporativo = empleado.cuenta_m4?.usuario_correo || empleado.usuario.find((item) => item.usuario_correo)?.usuario_correo || null;
    return { consentimientoElectronico: empleado.consentimiento_electronico, canalDocumental: empleado.canal_documental, correoParticular: empleado.correo_particular, correoCorporativo, canalesDisponibles: [...(empleado.correo_particular ? ['correo_particular'] : []), ...(correoCorporativo ? ['correo_corporativo'] : [])] };
  }

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
    empleado: true,
    componentes: { include: { concepto: true }, orderBy: { creado_en: 'asc' as const } },
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

  private presentarRemuneracion(item: any) {
    return {
      id: item.id_remuneracion, estado: item.estado,
      periodo: { id: item.periodo.id_periodo_remuneracion, anio: item.periodo.anio, mes: item.periodo.mes, fechaInicio: item.periodo.fecha_inicio, fechaFin: item.periodo.fecha_fin },
      empleado: { id: item.empleado.id_empleado, rut: item.empleado.rut_empleado, nombre: nombreCompleto(item.empleado) },
      componentes: item.componentes.map((componente: any) => this.presentarComponente(componente)),
    };
  }

  async obtenerRemuneracion(idRemuneracion: number) {
    const item = await prisma.remuneracion.findUnique({ where: { id_remuneracion: idRemuneracion }, include: this.incluirRemuneracion });
    if (!item) throw new ErrorAplicacion(404, 'Remuneración no encontrada');
    return this.presentarRemuneracion(item);
  }

  async obtenerOCrearContextoRemuneracion(entrada: Record<string, unknown>, idUsuario: bigint) {
    const idEmpleado = enteroPositivo(entrada.idEmpleado, 'Empleado');
    const anio = Number(entrada.anio); const mes = Number(entrada.mes);
    if (!Number.isInteger(anio) || anio < 2000 || anio > 2200 || !Number.isInteger(mes) || mes < 1 || mes > 12) throw new ErrorAplicacion(400, 'Año y mes válidos son obligatorios');
    const fechaInicio = new Date(Date.UTC(anio, mes - 1, 1)); const fechaFin = new Date(Date.UTC(anio, mes, 0));
    try {
      const id = await prisma.$transaction(async (tx) => {
        if (!await tx.empleado.count({ where: { id_empleado: idEmpleado } })) throw new ErrorAplicacion(404, 'Empleado no encontrado');
        const periodo = await tx.periodo_remuneracion.upsert({ where: { anio_mes: { anio, mes } }, create: { anio, mes, fecha_inicio: fechaInicio, fecha_fin: fechaFin }, update: {} });
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
    return remuneracion;
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
        const actual = await tx.componente_remuneracion.findUnique({ where: { id_componente_remuneracion: idComponente }, include: { remuneracion: true } });
        if (!actual || !tipos.includes(actual.tipo)) throw new ErrorAplicacion(404, 'Componente no encontrado');
        if (actual.remuneracion.estado !== 'abierta') throw new ErrorAplicacion(409, 'La remuneración no está ABIERTA');
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
}
