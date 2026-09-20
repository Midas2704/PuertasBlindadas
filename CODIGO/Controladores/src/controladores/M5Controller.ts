import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { diasHabilesEntre, fechaNegocio, fechaRegistro } from '../utilidades/finanzas';
import { validarYNormalizarRut } from '../utilidades/rut';
import { identificador, texto } from '../validaciones/solicitudes';

type Entrada = Record<string, unknown>;
type Transaccion = Prisma.TransactionClient;
export type SituacionProveedor = 'Vencida' | 'Por vencer' | 'Por pagar' | 'Sin deuda';
export type TipoComputoPago = 'DIAS_CORRIDOS' | 'DIAS_HABILES';

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
const direccionOrden = (valor: unknown) => {
  const direccion = texto(valor || 'desc', 10).toLowerCase();
  if (!['asc', 'desc'].includes(direccion)) throw new ErrorAplicacion(400, 'Dirección permitida: asc o desc');
  return direccion as 'asc' | 'desc';
};
const montoPositivo = (valor: unknown) => {
  const monto = Number(valor);
  if (!Number.isFinite(monto) || monto <= 0) throw new ErrorAplicacion(400, 'El monto autorizado debe ser numérico y mayor que cero');
  return new Prisma.Decimal(monto).toDecimalPlaces(2);
};
const condicionPago = (diasEntrada: unknown, tipoEntrada: unknown) => {
  const dias = Number(diasEntrada);
  const tipo = texto(tipoEntrada, 20).toUpperCase();
  if (!Number.isInteger(dias) || dias < 0) throw new ErrorAplicacion(400, 'La cantidad de días debe ser un entero mayor o igual que cero');
  if (!['DIAS_CORRIDOS', 'DIAS_HABILES'].includes(tipo)) throw new ErrorAplicacion(400, 'Tipo de cómputo permitido: DIAS_CORRIDOS o DIAS_HABILES');
  return { dias, tipoComputo: tipo as TipoComputoPago };
};

function pascua(anio: number) {
  const a = anio % 19; const b = Math.floor(anio / 100); const c = anio % 100;
  const d = Math.floor(b / 4); const e = b % 4; const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3); const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4); const k = c % 4; const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451); const mes = Math.floor((h + l - 7 * m + 114) / 31);
  return new Date(Date.UTC(anio, mes - 1, (h + l - 7 * m + 114) % 31 + 1));
}

/** Calendario laboral chileno mínimo y determinista para vencimientos prospectivos de M5. */
export function esDiaHabilChile(fecha: Date) {
  const diaSemana = fecha.getUTCDay();
  if (diaSemana === 0 || diaSemana === 6) return false;
  const mesDia = `${String(fecha.getUTCMonth() + 1).padStart(2, '0')}-${String(fecha.getUTCDate()).padStart(2, '0')}`;
  const fijos = new Set(['01-01', '05-01', '05-21', '06-20', '07-16', '08-15', '09-18', '09-19', '10-12', '10-31', '11-01', '12-08', '12-25']);
  if (fijos.has(mesDia)) return false;
  const domingoPascua = pascua(fecha.getUTCFullYear());
  const diferencia = Math.round((fecha.getTime() - domingoPascua.getTime()) / 86400000);
  return diferencia !== -2 && diferencia !== -1;
}

export function calcularFechaVencimientoProveedor(fechaBase: Date, dias: number, tipoComputo: TipoComputoPago) {
  const condicion = condicionPago(dias, tipoComputo);
  const fecha = new Date(Date.UTC(fechaBase.getUTCFullYear(), fechaBase.getUTCMonth(), fechaBase.getUTCDate()));
  if (condicion.tipoComputo === 'DIAS_CORRIDOS') {
    fecha.setUTCDate(fecha.getUTCDate() + condicion.dias);
    return fecha;
  }
  let restantes = condicion.dias;
  while (restantes > 0) {
    fecha.setUTCDate(fecha.getUTCDate() + 1);
    if (esDiaHabilChile(fecha)) restantes--;
  }
  return fecha;
}

export function calcularResumenOcs(montoAutorizado: Prisma.Decimal | number) {
  const monto = Number(montoAutorizado);
  // TEMPORAL_M5_DB_PATCH: CU91+ incorporará asociaciones reales para calcular consumo.
  const montoDocumentado = 0;
  return { montoAutorizado: monto, montoDocumentado, saldoDisponible: Math.max(0, monto - montoDocumentado) };
}

export function ocsTieneEfectosFinancieros(_idOcs: number) {
  // TEMPORAL_M5_DB_PATCH: aún no existen relaciones OCS-documento u OCS-obligación.
  return false;
}

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
    const ordenar = texto(consulta.ordenar, 30);
    const direccion = direccionOrden(consulta.direccion || 'asc');
    if (!['activo', 'inactivo', 'todos'].includes(estado)) throw new ErrorAplicacion(400, 'Estado permitido: Activo, Inactivo o Todos');
    const situaciones: Record<string, SituacionProveedor | undefined> = { vencida: 'Vencida', 'por vencer': 'Por vencer', por_vencer: 'Por vencer', 'por pagar': 'Por pagar', por_pagar: 'Por pagar', 'sin deuda': 'Sin deuda', sin_deuda: 'Sin deuda', todos: undefined };
    if (!(situacion in situaciones)) throw new ErrorAplicacion(400, 'Situación permitida: Vencida, Por vencer, Por pagar, Sin deuda o Todos');
    if (ordenar && !['razonSocial', 'identificador', 'saldoPendiente'].includes(ordenar)) throw new ErrorAplicacion(400, 'Orden permitido: razonSocial, identificador o saldoPendiente');
    const proveedores = await prisma.proveedor.findMany({
      where: estado === 'todos' ? {} : { estado_proveedor: estado },
      include: { pais: true, tipo_identificador: true, documento_compra_proveedor: { include: incluirDocumentos } },
      orderBy: [{ nombre_razon_social: 'asc' }, { id_proveedor: 'asc' }],
    });
    const identificadorBuscado = busqueda.replace(/[.\s-]/g, '');
    const resultado = proveedores.map(proveedor => {
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
    if (!ordenar) return resultado;
    const factor = direccion === 'asc' ? 1 : -1;
    return resultado.sort((a, b) => {
      let comparacion = 0;
      if (ordenar === 'razonSocial') comparacion = a.razonSocial.localeCompare(b.razonSocial, 'es-CL', { sensitivity: 'base' });
      if (ordenar === 'identificador') comparacion = a.identificadorFiscal.localeCompare(b.identificadorFiscal, 'es-CL', { numeric: true, sensitivity: 'base' });
      if (ordenar === 'saldoPendiente') comparacion = a.saldoPendienteTotal - b.saldoPendienteTotal;
      return comparacion === 0 ? a.idProveedor - b.idProveedor : comparacion * factor;
    });
  }

  async abrirFichaProveedor(id: number, consulta: Record<string, unknown> = {}) {
    const tipoAntecedente = texto(consulta.tipoAntecedente || 'todos', 30).toLowerCase();
    const estadoAntecedente = texto(consulta.estadoAntecedente, 30).toLowerCase();
    const direccion = direccionOrden(consulta.direccion || 'desc');
    if (!['todos', 'historial', 'documentos', 'pagos'].includes(tipoAntecedente)) throw new ErrorAplicacion(400, 'Tipo de antecedente permitido: historial, documentos, pagos o todos');
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
    const factor = direccion === 'asc' ? 1 : -1;
    const ordenarFecha = <T>(items: T[], fecha: (item: T) => Date) => items.sort((a, b) => factor * (fecha(a).getTime() - fecha(b).getTime()));
    const historialCondicion = proveedor.historial_proveedor_m5.find(item => item.campo === 'condicion_pago');
    const historial = tipoAntecedente === 'todos' || tipoAntecedente === 'historial'
      ? ordenarFecha(proveedor.historial_proveedor_m5.map(item => ({ id: item.id_historial_proveedor_m5, campo: item.campo, valorAnterior: item.valor_anterior, valorNuevo: item.valor_nuevo, motivo: item.motivo, fechaHora: item.fecha_hora, usuario: item.usuario.acceso_m4 || item.usuario.usuario_username || item.usuario_id_usuario.toString() })), item => item.fechaHora)
      : [];
    const documentos = tipoAntecedente === 'todos' || tipoAntecedente === 'documentos'
      ? ordenarFecha(resumenFinanciero.obligaciones.filter(item => !estadoAntecedente || item.estadoPago.toLowerCase() === estadoAntecedente), item => item.fechaEmision)
      : [];
    const pagos = tipoAntecedente === 'todos' || tipoAntecedente === 'pagos'
      ? ordenarFecha(proveedor.pago_proveedor.map(pago => ({ id: pago.id_pago_proveedor, fecha: pago.fecha_pago, monto: Number(pago.monto_pago), moneda: pago.moneda.codigo_moneda, estado: pago.estado_pago })).filter(item => !estadoAntecedente || item.estado.toLowerCase() === estadoAntecedente), item => item.fecha)
      : [];
    return {
      identidad: { idProveedor: proveedor.id_proveedor, pais: proveedor.pais?.nombre_pais || 'País no informado', idPais: proveedor.id_pais, tipoIdentificador: proveedor.tipo_identificador.nombre_tipo_identificador, idTipoIdentificador: proveedor.id_tipo_identificador, identificadorFiscal: proveedor.identificador_tributario, razonSocial: proveedor.nombre_razon_social, tipoProveedor: proveedor.tipo_proveedor_m5 },
      contacto: { nombre: proveedor.contacto_proveedor, correo: proveedor.correo_proveedor, telefono: proveedor.telefono_proveedor, direccion: proveedor.direccion_proveedor, correosAdicionales: proveedor.proveedor_contacto_correo.map(item => item.proveedor_contacto_correo), telefonosAdicionales: proveedor.proveedor_contacto_telefono.map(item => item.proveedor_contacto_telefono) },
      estado: proveedor.estado_proveedor,
      condicionPago: proveedor.condicion_pago_dias_m5 === null || !proveedor.condicion_pago_tipo_m5 ? null : { dias: proveedor.condicion_pago_dias_m5, tipoComputo: proveedor.condicion_pago_tipo_m5, ultimaActualizacion: historialCondicion?.fecha_hora || null },
      resumenFinanciero,
      historial,
      antecedentes: { documentos, pagos },
    };
  }

  async actualizarCondicionPagoProveedor(id: number, entrada: Entrada, usuario: bigint) {
    const nueva = condicionPago(valorEntrada(entrada, 'dias', 'cantidadDias'), valorEntrada(entrada, 'tipoComputo', 'tipo_computo'));
    return prisma.$transaction(async tx => {
      const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: id } });
      if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
      const anterior = proveedor.condicion_pago_dias_m5 === null || !proveedor.condicion_pago_tipo_m5 ? null : { dias: proveedor.condicion_pago_dias_m5, tipoComputo: proveedor.condicion_pago_tipo_m5 };
      if (anterior?.dias === nueva.dias && anterior.tipoComputo === nueva.tipoComputo) throw new ErrorAplicacion(400, 'La condición de pago no presenta cambios');
      await tx.proveedor.update({ where: { id_proveedor: id }, data: { condicion_pago_dias_m5: nueva.dias, condicion_pago_tipo_m5: nueva.tipoComputo } });
      const historial = await tx.historial_proveedor_m5.create({ data: { id_proveedor: id, campo: 'condicion_pago', valor_anterior: anterior ? JSON.stringify(anterior) : null, valor_nuevo: JSON.stringify(nueva), usuario_id_usuario: usuario } });
      return { mensaje: 'Condición de pago actualizada', condicionPago: { ...nueva, ultimaActualizacion: historial.fecha_hora } };
    });
  }

  private presentarOcs(orden: Prisma.orden_compra_servicio_m5GetPayload<{ include: { proveedor: true; usuario_creador: true; historial: { include: { usuario: true } } } }>) {
    return {
      id: orden.id_orden_compra_servicio_m5,
      proveedor: { id: orden.proveedor.id_proveedor, razonSocial: orden.proveedor.nombre_razon_social, estado: orden.proveedor.estado_proveedor },
      estado: orden.estado_ocs,
      ...calcularResumenOcs(orden.monto_autorizado),
      referencia: orden.referencia,
      periodo: orden.periodo,
      descripcion: orden.descripcion,
      fechaCreacion: orden.fecha_creacion,
      fechaActualizacion: orden.fecha_actualizacion,
      creadoPor: { id: orden.creado_por.toString(), nombre: orden.usuario_creador.acceso_m4 || orden.usuario_creador.usuario_username || orden.creado_por.toString() },
      historial: orden.historial.map(item => ({ id: item.id_historial_ocs_m5, campo: item.campo, valorAnterior: item.valor_anterior, valorNuevo: item.valor_nuevo, fechaHora: item.fecha_hora, usuario: item.usuario.acceso_m4 || item.usuario.usuario_username || item.usuario_id_usuario.toString() })),
    };
  }

  private readonly incluirOcs = { proveedor: true, usuario_creador: true, historial: { include: { usuario: true }, orderBy: { fecha_hora: 'desc' as const } } };

  async listarOrdenesCompraServicios() {
    const ordenes = await prisma.orden_compra_servicio_m5.findMany({ include: this.incluirOcs, orderBy: [{ fecha_creacion: 'desc' }, { id_orden_compra_servicio_m5: 'desc' }] });
    return ordenes.map(orden => this.presentarOcs(orden));
  }

  async obtenerOrdenCompraServicio(id: number) {
    const orden = await prisma.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: id }, include: this.incluirOcs });
    if (!orden) throw new ErrorAplicacion(404, 'Orden de compra de servicios no encontrada');
    return this.presentarOcs(orden);
  }

  async crearOrdenCompraServicio(entrada: Entrada, usuario: bigint) {
    const idProveedor = identificador(valorEntrada(entrada, 'idProveedor', 'id_proveedor'));
    const montoAutorizado = montoPositivo(valorEntrada(entrada, 'montoAutorizado', 'monto_autorizado'));
    return prisma.$transaction(async tx => {
      const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: idProveedor } });
      if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
      if (proveedor.estado_proveedor !== 'activo') throw new ErrorAplicacion(409, 'Sólo puede utilizarse un proveedor Activo para una OCS');
      const orden = await tx.orden_compra_servicio_m5.create({ data: {
        id_proveedor: idProveedor,
        monto_autorizado: montoAutorizado,
        estado_ocs: 'abierta',
        referencia: contacto(entrada.referencia, 150),
        periodo: contacto(entrada.periodo, 50),
        descripcion: contacto(entrada.descripcion, 1000),
        creado_por: usuario,
      } });
      await tx.historial_orden_compra_servicio_m5.create({ data: { id_ocs_m5: orden.id_orden_compra_servicio_m5, campo: 'creacion', valor_anterior: null, valor_nuevo: JSON.stringify({ idProveedor, montoAutorizado: Number(montoAutorizado), estado: 'abierta' }), usuario_id_usuario: usuario } });
      const completa = await tx.orden_compra_servicio_m5.findUniqueOrThrow({ where: { id_orden_compra_servicio_m5: orden.id_orden_compra_servicio_m5 }, include: this.incluirOcs });
      return this.presentarOcs(completa);
    });
  }

  async modificarOrdenCompraServicio(id: number, entrada: Entrada, usuario: bigint) {
    if (['id', 'idOcs', 'creadoPor', 'creado_por', 'fechaCreacion', 'fecha_creacion', 'estado', 'estado_ocs'].some(campo => entrada[campo] !== undefined)) throw new ErrorAplicacion(400, 'No puede modificarse ID, creador, fecha de creación ni estado mediante CU90');
    return prisma.$transaction(async tx => {
      const actual = await tx.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: id } });
      if (!actual) throw new ErrorAplicacion(404, 'Orden de compra de servicios no encontrada');
      if (ocsTieneEfectosFinancieros(id)) throw new ErrorAplicacion(409, 'La OCS ya tiene efectos financieros; debe utilizarse el flujo de ajuste CU91');
      const data: Prisma.orden_compra_servicio_m5UncheckedUpdateInput = { fecha_actualizacion: new Date() };
      const cambios: Prisma.historial_orden_compra_servicio_m5CreateManyInput[] = [];
      if (entrada.idProveedor !== undefined || entrada.id_proveedor !== undefined) {
        const idProveedor = identificador(valorEntrada(entrada, 'idProveedor', 'id_proveedor'));
        const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: idProveedor } });
        if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
        if (proveedor.estado_proveedor !== 'activo') throw new ErrorAplicacion(409, 'Sólo puede utilizarse un proveedor Activo para una OCS');
        if (idProveedor !== actual.id_proveedor) { data.id_proveedor = idProveedor; cambios.push({ id_ocs_m5: id, campo: 'proveedor', valor_anterior: String(actual.id_proveedor), valor_nuevo: String(idProveedor), usuario_id_usuario: usuario }); }
      }
      if (entrada.montoAutorizado !== undefined || entrada.monto_autorizado !== undefined) {
        const monto = montoPositivo(valorEntrada(entrada, 'montoAutorizado', 'monto_autorizado'));
        if (!monto.equals(actual.monto_autorizado)) { data.monto_autorizado = monto; cambios.push({ id_ocs_m5: id, campo: 'monto_autorizado', valor_anterior: actual.monto_autorizado.toString(), valor_nuevo: monto.toString(), usuario_id_usuario: usuario }); }
      }
      for (const [campo, maximo] of [['referencia', 150], ['periodo', 50], ['descripcion', 1000]] as const) if (entrada[campo] !== undefined) {
        const nuevo = contacto(entrada[campo], maximo);
        if (nuevo !== actual[campo]) { data[campo] = nuevo; cambios.push({ id_ocs_m5: id, campo, valor_anterior: actual[campo], valor_nuevo: nuevo, usuario_id_usuario: usuario }); }
      }
      if (!cambios.length) throw new ErrorAplicacion(400, 'La OCS no presenta cambios');
      await tx.orden_compra_servicio_m5.update({ where: { id_orden_compra_servicio_m5: id }, data });
      await tx.historial_orden_compra_servicio_m5.createMany({ data: cambios });
      const completa = await tx.orden_compra_servicio_m5.findUniqueOrThrow({ where: { id_orden_compra_servicio_m5: id }, include: this.incluirOcs });
      return this.presentarOcs(completa);
    });
  }
}
