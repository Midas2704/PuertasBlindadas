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
}
