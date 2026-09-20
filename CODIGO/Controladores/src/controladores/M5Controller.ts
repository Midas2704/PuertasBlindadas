import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { diasHabilesEntre, fechaNegocio, fechaRegistro } from '../utilidades/finanzas';
import { validarYNormalizarRut } from '../utilidades/rut';
import { identificador, texto } from '../validaciones/solicitudes';

type Entrada = Record<string, unknown>;
type Transaccion = Prisma.TransactionClient;
export type SituacionProveedor = 'Vencida' | 'Por vencer' | 'Por pagar' | 'Sin deuda';

const TIPOS_PROVEEDOR = ['Insumos/Materiales', 'Servicios', 'Ambos'] as const;
const DIAS_POR_VENCER_M5 = 5; // TEMPORAL_M5_DB_PATCH: configuración propia de M5 aún no existe.
const camposIdentidad = ['idPais', 'id_pais', 'pais', 'idTipoIdentificador', 'id_tipo_identificador', 'tipoIdentificador', 'identificador', 'identificadorTributario', 'identificador_tributario', 'rut'];

const incluirDocumentos = {
  moneda: true,
  tipo_documento: true,
  asignacion_pago_proveedor: { include: { pago_proveedor: true } },
} satisfies Prisma.documento_compra_proveedorInclude;
type DocumentoProveedor = Prisma.documento_compra_proveedorGetPayload<{ include: typeof incluirDocumentos }>;

export interface ResumenFinancieroProveedor {
  saldoPendienteTotal: number;
  situacionFinanciera: SituacionProveedor;
  saldosPorMoneda: Array<{ moneda: string; saldoPendiente: number }>;
  obligaciones: Array<{
    id: number;
    numero: string;
    tipo: string;
    moneda: string;
    fechaEmision: Date;
    fechaVencimiento: Date | null;
    estadoPago: 'Pendiente' | 'Parcial' | 'Pagada';
    condicionTemporal: 'Por pagar' | 'Por vencer' | 'Vencida' | null;
    montoTotal: number;
    saldoPendiente: number;
  }>;
}

/** Única fuente para la etiqueta y el filtro financiero de CU80/CU83. */
export function calcularResumenFinancieroProveedor(documentos: DocumentoProveedor[], hoy = fechaNegocio()): ResumenFinancieroProveedor {
  const saldos = new Map<string, number>();
  const obligaciones = documentos.map(documento => {
    const retirado = documento.estado_documento.toLowerCase() === 'anulado';
    const montoTotal = Number(documento.monto_total);
    const pagado = retirado ? 0 : documento.asignacion_pago_proveedor.reduce((suma, asignacion) =>
      suma + (asignacion.pago_proveedor.estado_pago.toLowerCase() === 'anulado' ? 0 : Number(asignacion.monto_asignado)), 0);
    const saldoPendiente = retirado || documento.estado_documento.toLowerCase() === 'pagado' ? 0 : Math.max(0, montoTotal - pagado);
    const estadoPago = saldoPendiente <= 0 ? 'Pagada' : pagado > 0 ? 'Parcial' : 'Pendiente';
    let condicionTemporal: 'Por pagar' | 'Por vencer' | 'Vencida' | null = null;
    if (saldoPendiente > 0) {
      if (documento.fecha_vencimiento) {
        const dias = diasHabilesEntre(hoy, fechaRegistro(documento.fecha_vencimiento));
        condicionTemporal = dias < 0 ? 'Vencida' : dias <= DIAS_POR_VENCER_M5 ? 'Por vencer' : 'Por pagar';
      } else condicionTemporal = 'Por pagar';
      const moneda = documento.moneda.codigo_moneda;
      saldos.set(moneda, (saldos.get(moneda) || 0) + saldoPendiente);
    }
    return {
      id: documento.id_documento_compra_proveedor,
      numero: documento.numero_documento,
      tipo: documento.tipo_documento.nombre_tipo_documento,
      moneda: documento.moneda.codigo_moneda,
      fechaEmision: documento.fecha_emision,
      fechaVencimiento: documento.fecha_vencimiento,
      estadoPago: estadoPago as 'Pendiente' | 'Parcial' | 'Pagada',
      condicionTemporal,
      montoTotal,
      saldoPendiente,
    };
  });
  const situacionFinanciera: SituacionProveedor = obligaciones.some(item => item.condicionTemporal === 'Vencida') ? 'Vencida'
    : obligaciones.some(item => item.condicionTemporal === 'Por vencer') ? 'Por vencer'
      : obligaciones.some(item => item.saldoPendiente > 0) ? 'Por pagar' : 'Sin deuda';
  const saldosPorMoneda = [...saldos].map(([moneda, saldoPendiente]) => ({ moneda, saldoPendiente }));
  // El total usa monto_convertido cuando existe; para documentos sin conversión conserva su monto original.
  const saldoPendienteTotal = documentos.reduce((suma, documento, indice) => {
    const saldoOriginal = obligaciones[indice].saldoPendiente;
    const totalOriginal = Number(documento.monto_total);
    const convertido = documento.monto_convertido === null ? saldoOriginal : totalOriginal > 0 ? saldoOriginal * Number(documento.monto_convertido) / totalOriginal : 0;
    return suma + convertido;
  }, 0);
  return { saldoPendienteTotal, situacionFinanciera, saldosPorMoneda, obligaciones };
}

const valorEntrada = (entrada: Entrada, ...claves: string[]) => claves.find(clave => entrada[clave] !== undefined) ? entrada[claves.find(clave => entrada[clave] !== undefined)!] : undefined;
const tipoProveedor = (valor: unknown) => {
  const tipo = texto(valor, 30);
  if (!TIPOS_PROVEEDOR.includes(tipo as typeof TIPOS_PROVEEDOR[number])) throw new ErrorAplicacion(400, 'Tipo de proveedor permitido: Insumos/Materiales, Servicios o Ambos');
  return tipo;
};
const motivoObligatorio = (valor: unknown) => {
  const motivo = texto(valor, 500);
  if (!motivo) throw new ErrorAplicacion(400, 'El motivo es obligatorio');
  return motivo;
};
const contacto = (valor: unknown, maximo: number) => valor === null || valor === '' ? null : texto(valor, maximo) || null;

export class M5Controller {
  private async identidad(tx: Transaccion, entrada: Entrada, actual?: { id_pais: number | null; id_tipo_identificador: number; identificador_tributario: string }) {
    const idPais = valorEntrada(entrada, 'idPais', 'id_pais', 'pais');
    const idTipo = valorEntrada(entrada, 'idTipoIdentificador', 'id_tipo_identificador', 'tipoIdentificador');
    const identificadorEntrada = valorEntrada(entrada, 'identificador', 'identificadorTributario', 'identificador_tributario', 'rut');
    const paisResuelto = idPais === undefined && actual ? actual.id_pais : identificador(idPais);
    if (paisResuelto === null || paisResuelto === undefined) throw new ErrorAplicacion(400, 'El país es obligatorio para definir la identidad fiscal');
    const pais = await tx.pais.findUnique({ where: { id_pais: paisResuelto } });
    const tipo = await tx.tipo_identificador.findUnique({ where: { id_tipo_identificador: idTipo === undefined && actual ? actual.id_tipo_identificador : identificador(idTipo) } });
    if (!pais || pais.estado_pais !== 'activo') throw new ErrorAplicacion(400, 'País no válido o inactivo');
    if (!tipo || tipo.estado_tipo_identificador !== 'activo') throw new ErrorAplicacion(400, 'Tipo de identificación fiscal no válido o inactivo');
    let identificadorFiscal = texto(identificadorEntrada === undefined && actual ? actual.identificador_tributario : identificadorEntrada, 50);
    if (!identificadorFiscal) throw new ErrorAplicacion(400, 'El identificador fiscal es obligatorio');
    const esRutChileno = pais.codigo_iso_pais?.toUpperCase() === 'CL' && /\brut\b/i.test(tipo.nombre_tipo_identificador);
    if (esRutChileno) identificadorFiscal = validarYNormalizarRut(identificadorFiscal)!;
    return { pais, tipo, identificadorFiscal };
  }

  private async duplicado(tx: Transaccion, identidad: { pais: { id_pais: number }; tipo: { id_tipo_identificador: number }; identificadorFiscal: string }, excluir?: number) {
    return tx.proveedor.findFirst({ where: {
      id_proveedor: excluir ? { not: excluir } : undefined,
      id_pais: identidad.pais.id_pais,
      id_tipo_identificador: identidad.tipo.id_tipo_identificador,
      identificador_tributario: { equals: identidad.identificadorFiscal, mode: 'insensitive' },
    } });
  }

  async catalogosProveedores() {
    const [paises, tiposIdentificador] = await Promise.all([
      prisma.pais.findMany({ where: { estado_pais: 'activo' }, orderBy: { nombre_pais: 'asc' } }),
      prisma.tipo_identificador.findMany({ where: { estado_tipo_identificador: 'activo' }, orderBy: { nombre_tipo_identificador: 'asc' } }),
    ]);
    return { paises, tiposIdentificador, tiposProveedor: TIPOS_PROVEEDOR };
  }

  async crearProveedor(entrada: Entrada) {
    const razonSocial = texto(valorEntrada(entrada, 'razonSocial', 'nombre_razon_social'), 150);
    if (!razonSocial) throw new ErrorAplicacion(400, 'La razón social es obligatoria');
    const tipo = tipoProveedor(valorEntrada(entrada, 'tipoProveedor', 'tipo_proveedor'));
    try {
      return await prisma.$transaction(async tx => {
        const identidad = await this.identidad(tx, entrada);
        const existente = await this.duplicado(tx, identidad);
        if (existente) throw new ErrorAplicacion(409, existente.estado_proveedor === 'inactivo' ? 'El proveedor ya existe y está Inactivo; reactívalo mediante CU79' : 'Ya existe un proveedor con esa identidad fiscal');
        const proveedor = await tx.proveedor.create({ data: {
          id_pais: identidad.pais.id_pais,
          id_tipo_identificador: identidad.tipo.id_tipo_identificador,
          identificador_tributario: identidad.identificadorFiscal,
          nombre_razon_social: razonSocial,
          tipo_proveedor_m5: tipo,
          contacto_proveedor: contacto(entrada.contacto, 150),
          correo_proveedor: contacto(entrada.correo, 150),
          telefono_proveedor: contacto(entrada.telefono, 30),
          direccion_proveedor: contacto(entrada.direccion, 500),
          estado_proveedor: 'activo',
        }, include: { pais: true, tipo_identificador: true } });
        return { mensaje: 'Proveedor registrado', proveedor };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe un proveedor con esa identidad fiscal');
      throw error;
    }
  }

  async actualizarProveedor(id: number, entrada: Entrada, usuario: bigint) {
    if (camposIdentidad.some(campo => entrada[campo] !== undefined)) throw new ErrorAplicacion(400, 'La identidad fiscal sólo puede modificarse mediante CU77');
    return prisma.$transaction(async tx => {
      const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: id } });
      if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
      const data: Prisma.proveedorUpdateInput = {};
      const historial: Prisma.historial_proveedor_m5CreateManyInput[] = [];
      if (entrada.razonSocial !== undefined || entrada.nombre_razon_social !== undefined) {
        const nueva = texto(valorEntrada(entrada, 'razonSocial', 'nombre_razon_social'), 150);
        if (!nueva) throw new ErrorAplicacion(400, 'La razón social es obligatoria');
        if (nueva !== proveedor.nombre_razon_social) {
          const motivo = motivoObligatorio(entrada.motivo);
          data.nombre_razon_social = nueva;
          historial.push({ id_proveedor: id, campo: 'razon_social', valor_anterior: proveedor.nombre_razon_social, valor_nuevo: nueva, motivo, usuario_id_usuario: usuario });
        }
      }
      if (entrada.tipoProveedor !== undefined || entrada.tipo_proveedor !== undefined) {
        const nuevo = tipoProveedor(valorEntrada(entrada, 'tipoProveedor', 'tipo_proveedor'));
        if (nuevo !== proveedor.tipo_proveedor_m5) {
          data.tipo_proveedor_m5 = nuevo;
          historial.push({ id_proveedor: id, campo: 'tipo_proveedor', valor_anterior: proveedor.tipo_proveedor_m5, valor_nuevo: nuevo, motivo: texto(entrada.motivo, 500) || null, usuario_id_usuario: usuario });
        }
      }
      const contactos = [['contacto', 'contacto_proveedor', 150], ['correo', 'correo_proveedor', 150], ['telefono', 'telefono_proveedor', 30], ['direccion', 'direccion_proveedor', 500]] as const;
      for (const [origen, destino, maximo] of contactos) if (entrada[origen] !== undefined) data[destino] = contacto(entrada[origen], maximo);
      if (!Object.keys(data).length) throw new ErrorAplicacion(400, 'No hay cambios para guardar');
      const actualizado = await tx.proveedor.update({ where: { id_proveedor: id }, data, include: { pais: true, tipo_identificador: true } });
      if (historial.length) await tx.historial_proveedor_m5.createMany({ data: historial });
      return { mensaje: 'Proveedor actualizado', proveedor: actualizado };
    });
  }

  async corregirIdentidadProveedor(id: number, entrada: Entrada, usuario: bigint) {
    const motivo = motivoObligatorio(entrada.motivo);
    try {
      return await prisma.$transaction(async tx => {
        const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: id }, include: { pais: true, tipo_identificador: true } });
        if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
        const identidad = await this.identidad(tx, entrada, proveedor);
        if (await this.duplicado(tx, identidad, id)) throw new ErrorAplicacion(409, 'La identidad fiscal resultante ya pertenece a otro proveedor');
        const cambios = [
          ['pais', proveedor.pais?.nombre_pais ?? null, identidad.pais.nombre_pais, proveedor.id_pais !== identidad.pais.id_pais],
          ['tipo_identificador', proveedor.tipo_identificador.nombre_tipo_identificador, identidad.tipo.nombre_tipo_identificador, proveedor.id_tipo_identificador !== identidad.tipo.id_tipo_identificador],
          ['identificador_fiscal', proveedor.identificador_tributario, identidad.identificadorFiscal, proveedor.identificador_tributario !== identidad.identificadorFiscal],
        ] as const;
        const modificados = cambios.filter(([, , , cambio]) => cambio);
        if (!modificados.length) throw new ErrorAplicacion(400, 'La identidad fiscal no presenta cambios');
        const actualizado = await tx.proveedor.update({ where: { id_proveedor: id }, data: { id_pais: identidad.pais.id_pais, id_tipo_identificador: identidad.tipo.id_tipo_identificador, identificador_tributario: identidad.identificadorFiscal }, include: { pais: true, tipo_identificador: true } });
        await tx.historial_proveedor_m5.createMany({ data: modificados.map(([campo, anterior, nuevo]) => ({ id_proveedor: id, campo, valor_anterior: anterior, valor_nuevo: nuevo, motivo, usuario_id_usuario: usuario })) });
        return { mensaje: 'Identidad fiscal corregida', proveedor: actualizado };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'La identidad fiscal resultante ya pertenece a otro proveedor');
      throw error;
    }
  }

  private async obtenerBloqueosDesactivacionProveedor(tx: Transaccion, id: number) {
    // documento_compra_proveedor + asignaciones no anuladas permiten calcular deuda externa pendiente.
    const documentos = await tx.documento_compra_proveedor.findMany({ where: { id_proveedor: id }, include: incluirDocumentos });
    const pendientes = calcularResumenFinancieroProveedor(documentos).obligaciones.filter(item => item.saldoPendiente > 0);
    // TEMPORAL_M5_DB_PATCH_PENDIENTE: factura_compra no tiene estado, vencimiento ni vínculo de pago confiable.
    // TEMPORAL_M5_DB_PATCH_PENDIENTE: pagos sueltos, lotes, materiales y alertas representan hechos o tareas internas,
    // no una relación externa abierta demostrable. Tampoco existe aún una OC consultable ni saldo a favor de proveedor.
    return pendientes.map(item => ({ tipo: 'documento_comercial', id: item.id, referencia: item.numero, saldoPendiente: item.saldoPendiente }));
  }

  async cambiarEstadoProveedor(id: number, estado: 'activo' | 'inactivo', confirmado: boolean, usuario: bigint) {
    if (!confirmado) throw new ErrorAplicacion(400, 'Debes confirmar la operación');
    return prisma.$transaction(async tx => {
      const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: id } });
      if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
      const estadoRequerido = estado === 'activo' ? 'inactivo' : 'activo';
      if (proveedor.estado_proveedor !== estadoRequerido) throw new ErrorAplicacion(409, estado === 'activo' ? 'Sólo puede reactivarse un proveedor Inactivo' : 'Sólo puede desactivarse un proveedor Activo');
      if (estado === 'inactivo') {
        const bloqueos = await this.obtenerBloqueosDesactivacionProveedor(tx, id);
        if (bloqueos.length) throw new ErrorAplicacion(409, `No se puede desactivar: existen ${bloqueos.length} procesos externos pendientes`, 'PROVEEDOR_CON_PROCESOS_ABIERTOS');
      }
      await tx.proveedor.update({ where: { id_proveedor: id }, data: { estado_proveedor: estado } });
      await tx.historial_proveedor_m5.create({ data: { id_proveedor: id, campo: 'estado', valor_anterior: proveedor.estado_proveedor, valor_nuevo: estado, usuario_id_usuario: usuario } });
      return { mensaje: estado === 'activo' ? 'Proveedor reactivado' : 'Proveedor desactivado', idProveedor: id, estado };
    });
  }

  async listarProveedores(consulta: Record<string, unknown>) {
    const busqueda = texto(consulta.busqueda, 150).toLocaleLowerCase('es-CL');
    const estado = texto(consulta.estado || 'activo', 20).toLowerCase();
    const situacion = texto(consulta.situacion || 'todos', 30).toLowerCase();
    if (!['activo', 'inactivo', 'todos'].includes(estado)) throw new ErrorAplicacion(400, 'Estado permitido: Activo, Inactivo o Todos');
    const situaciones: Record<string, SituacionProveedor | undefined> = { vencida: 'Vencida', 'por vencer': 'Por vencer', por_vencer: 'Por vencer', 'por pagar': 'Por pagar', por_pagar: 'Por pagar', 'sin deuda': 'Sin deuda', sin_deuda: 'Sin deuda', todos: undefined };
    if (!(situacion in situaciones)) throw new ErrorAplicacion(400, 'Situación permitida: Vencida, Por vencer, Por pagar, Sin deuda o Todos');
    const proveedores = await prisma.proveedor.findMany({
      where: estado === 'todos' ? {} : { estado_proveedor: estado },
      include: { pais: true, tipo_identificador: true, documento_compra_proveedor: { include: incluirDocumentos } },
      orderBy: [{ nombre_razon_social: 'asc' }, { id_proveedor: 'asc' }],
    });
    const identificadorBuscado = busqueda.replace(/[.\s-]/g, '');
    return proveedores.map(proveedor => {
      const resumen = calcularResumenFinancieroProveedor(proveedor.documento_compra_proveedor);
      return {
        idProveedor: proveedor.id_proveedor,
        identificadorFiscal: proveedor.identificador_tributario,
        razonSocial: proveedor.nombre_razon_social,
        pais: proveedor.pais?.nombre_pais || 'País no informado',
        tipoIdentificador: proveedor.tipo_identificador.nombre_tipo_identificador,
        tipoProveedor: proveedor.tipo_proveedor_m5,
        estado: proveedor.estado_proveedor,
        ...resumen,
        obligaciones: undefined,
      };
    }).filter(proveedor => (!busqueda || proveedor.razonSocial.toLocaleLowerCase('es-CL').includes(busqueda) || proveedor.identificadorFiscal.replace(/[.\s-]/g, '').toLowerCase().includes(identificadorBuscado))
      && (!situaciones[situacion] || proveedor.situacionFinanciera === situaciones[situacion]));
  }

  async abrirFichaProveedor(id: number) {
    const proveedor = await prisma.proveedor.findUnique({ where: { id_proveedor: id }, include: {
      pais: true,
      tipo_identificador: true,
      documento_compra_proveedor: { include: incluirDocumentos, orderBy: { fecha_emision: 'desc' } },
      pago_proveedor: { include: { moneda: true }, orderBy: { fecha_pago: 'desc' } },
      historial_proveedor_m5: { include: { usuario: true }, orderBy: { fecha_hora: 'desc' } },
      proveedor_contacto_correo: true,
      proveedor_contacto_telefono: true,
    } });
    if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
    const resumenFinanciero = calcularResumenFinancieroProveedor(proveedor.documento_compra_proveedor);
    return {
      identidad: { idProveedor: proveedor.id_proveedor, pais: proveedor.pais?.nombre_pais || 'País no informado', idPais: proveedor.id_pais, tipoIdentificador: proveedor.tipo_identificador.nombre_tipo_identificador, idTipoIdentificador: proveedor.id_tipo_identificador, identificadorFiscal: proveedor.identificador_tributario, razonSocial: proveedor.nombre_razon_social, tipoProveedor: proveedor.tipo_proveedor_m5 },
      contacto: { nombre: proveedor.contacto_proveedor, correo: proveedor.correo_proveedor, telefono: proveedor.telefono_proveedor, direccion: proveedor.direccion_proveedor, correosAdicionales: proveedor.proveedor_contacto_correo.map(item => item.proveedor_contacto_correo), telefonosAdicionales: proveedor.proveedor_contacto_telefono.map(item => item.proveedor_contacto_telefono) },
      estado: proveedor.estado_proveedor,
      condicionPago: proveedor.condicion_pago_m5 || null,
      resumenFinanciero,
      historial: proveedor.historial_proveedor_m5.map(item => ({ id: item.id_historial_proveedor_m5, campo: item.campo, valorAnterior: item.valor_anterior, valorNuevo: item.valor_nuevo, motivo: item.motivo, fechaHora: item.fecha_hora, usuario: item.usuario.acceso_m4 || item.usuario.usuario_username || item.usuario_id_usuario.toString() })),
      antecedentes: { documentos: resumenFinanciero.obligaciones, pagos: proveedor.pago_proveedor.map(pago => ({ id: pago.id_pago_proveedor, fecha: pago.fecha_pago, monto: Number(pago.monto_pago), moneda: pago.moneda.codigo_moneda, estado: pago.estado_pago })) },
    };
  }
}
