import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { diasHabilesEntre, fechaNegocio, fechaRegistro } from '../utilidades/finanzas';
import { validarYNormalizarRut } from '../utilidades/rut';
import { identificador, texto } from '../validaciones/solicitudes';
import { BancoCentral, C_BancoCentral } from '../utilidades/C_BancoCentral';

type Entrada = Record<string, unknown>;
type Transaccion = Prisma.TransactionClient;
export type SituacionProveedor = 'Vencida' | 'Por vencer' | 'Por pagar' | 'Sin deuda';
export type TipoComputoPago = 'DIAS_CORRIDOS' | 'DIAS_HABILES';

export function sumarDiasHabilesChile(fecha: string, dias: number, feriados = new Set<string>()) {
  const cursor = new Date(`${fecha}T00:00:00Z`);
  let restantes = dias;
  while (restantes > 0) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const clave = cursor.toISOString().slice(0, 10);
    if (cursor.getUTCDay() !== 0 && cursor.getUTCDay() !== 6 && !feriados.has(clave)) restantes--;
  }
  return cursor.toISOString().slice(0, 10);
}

const TIPOS_PROVEEDOR = ['Insumos/Materiales', 'Servicios', 'Ambos'] as const;
const UMBRAL_INICIAL_M5 = 5;
const camposIdentidad = ['idPais', 'id_pais', 'pais', 'idTipoIdentificador', 'id_tipo_identificador', 'tipoIdentificador', 'identificador', 'identificadorTributario', 'identificador_tributario', 'rut'];

const incluirDocumentos = {
  moneda: true,
  tipo_documento: true,
  asignacion_pago_proveedor: { include: { pago_proveedor: true } },
} satisfies Prisma.documento_compra_proveedorInclude;
type DocumentoProveedor = Prisma.documento_compra_proveedorGetPayload<{ include: typeof incluirDocumentos }>;

const incluirOcs = {
  proveedor: true,
  usuario_creador: true,
  historial: { include: { usuario: true }, orderBy: { fecha_hora: 'desc' as const } },
  ajustes: { include: { usuario_solicitante: true, usuario_confirmante: true }, orderBy: { fecha_solicitud: 'desc' as const } },
  efectos_financieros: true,
} satisfies Prisma.orden_compra_servicio_m5Include;
type OrdenCompraServicio = Prisma.orden_compra_servicio_m5GetPayload<{ include: typeof incluirOcs }>;

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
export function calcularResumenFinancieroProveedor(documentos: DocumentoProveedor[], hoy = fechaNegocio(), umbral = UMBRAL_INICIAL_M5): ResumenFinancieroProveedor {
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
        condicionTemporal = dias < 0 ? 'Vencida' : dias <= umbral ? 'Por vencer' : 'Por pagar';
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
const fechaEntrada = (valor: unknown, nombre: string) => {
  const cadena = texto(valor, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(cadena) || Number.isNaN(new Date(`${cadena}T00:00:00Z`).getTime())) throw new ErrorAplicacion(400, `${nombre} inválida`);
  return new Date(`${cadena}T00:00:00Z`);
};
const folioNormalizado = (valor: unknown) => {
  const folio = texto(valor, 80).trim().replace(/\s+/g, ' ');
  if (!folio) throw new ErrorAplicacion(400, 'El folio o número es obligatorio');
  return { folio, normalizado: folio.toLocaleUpperCase('es-CL') };
};
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

export function calcularEstadoPagoObligacion(saldoInicial: Prisma.Decimal | number, saldoActual: Prisma.Decimal | number) {
  const inicial = Number(saldoInicial); const actual = Number(saldoActual);
  if (actual <= 0) return 'Pagada' as const;
  if (actual < inicial) return 'Parcial' as const;
  return 'Pendiente' as const;
}

export function calcularCondicionTemporalObligacion(obligacion: { saldo_actual: Prisma.Decimal | number; fecha_vencimiento: Date }, umbral: number, hoy = fechaNegocio()) {
  if (Number(obligacion.saldo_actual) <= 0) return null;
  const vencimiento = fechaRegistro(obligacion.fecha_vencimiento);
  if (vencimiento < hoy) return 'Vencida' as const;
  const cursor = new Date(`${hoy}T00:00:00Z`); const limite = new Date(`${vencimiento}T00:00:00Z`); let dias = 0;
  while (cursor < limite) { if (esDiaHabilChile(cursor)) dias++; cursor.setUTCDate(cursor.getUTCDate() + 1); }
  return dias <= umbral ? 'Por vencer' as const : 'Por pagar' as const;
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

export function calcularResumenOcs(montoAutorizado: Prisma.Decimal | number, efectos: Array<{ monto_documentado: Prisma.Decimal | number }> = []) {
  const monto = Number(montoAutorizado);
  const montoDocumentado = efectos.reduce((suma, efecto) => suma + Number(efecto.monto_documentado), 0);
  return { montoAutorizado: monto, montoDocumentado, saldoDisponible: Math.max(0, monto - montoDocumentado) };
}

export async function ocsTieneEfectosFinancieros(tx: Transaccion, idOcs: number) {
  return await tx.efecto_financiero_ocs_m5.count({ where: { id_ocs_m5: idOcs } }) > 0;
}

export function evaluarCierreOcs(montoAutorizado: Prisma.Decimal | number, montoDocumentado: Prisma.Decimal | number, declaracionFinal = false, justificacion = '') {
  const autorizado = Number(montoAutorizado);
  const documentado = Number(montoDocumentado);
  if (Math.abs(documentado - autorizado) < 0.005) return { puedeCerrar: true, automatico: true, tipo: 'monto_exacto' as const };
  if (documentado < autorizado) {
    if (!declaracionFinal) return { puedeCerrar: false, automatico: false, tipo: 'requiere_declaracion_final' as const };
    if (!texto(justificacion, 1000)) return { puedeCerrar: false, automatico: false, tipo: 'requiere_justificacion' as const };
    return { puedeCerrar: true, automatico: false, tipo: 'final_bajo_autorizado' as const };
  }
  // TEMPORAL_M5_DB_PATCH: CU99/CU100 conectarán aquí la aprobación real del excedente.
  return { puedeCerrar: false, automatico: false, tipo: 'excedente_pendiente_aprobacion' as const };
}

export class M5Controller {
  constructor(private readonly bancoCentral: BancoCentral = new C_BancoCentral()) {}
  private async umbralM5(tx: Transaccion | typeof prisma = prisma) {
    return (await tx.config_umbral_por_vencer_m5.findFirst({ orderBy: [{ fecha_hora: 'desc' }, { id_config_umbral_m5: 'desc' }] }))?.dias_habiles ?? UMBRAL_INICIAL_M5;
  }

  private async resumenObligacionesM5(idsProveedores: number[]) {
    const [obligaciones, monedas, umbral] = await Promise.all([
      prisma.obligacion_proveedor_m5.findMany({ where: { id_proveedor: { in: idsProveedores } } }), prisma.moneda.findMany(), this.umbralM5(),
    ]);
    const codigos = new Map(monedas.map(moneda => [moneda.id_moneda, moneda.codigo_moneda]));
    const resultado = new Map<number, ResumenFinancieroProveedor>();
    for (const id of idsProveedores) {
      const propias = obligaciones.filter(item => item.id_proveedor === id).map(item => {
        const estadoPago = calcularEstadoPagoObligacion(item.saldo_inicial, item.saldo_actual); const condicionTemporal = calcularCondicionTemporalObligacion(item, umbral);
        return { id: item.id_obligacion_m5, numero: `M5-${item.id_documento_m5}`, tipo: 'Obligación M5', moneda: codigos.get(item.id_moneda) || 'No disponible', fechaEmision: item.fecha_emision, fechaVencimiento: item.fecha_vencimiento, estadoPago, condicionTemporal, montoTotal: Number(item.monto_original), saldoPendiente: Number(item.saldo_actual) };
      });
      if (!propias.length) continue;
      const saldos = new Map<string, number>(); let totalClp = 0;
      for (const item of propias.filter(item => item.saldoPendiente > 0)) saldos.set(item.moneda, (saldos.get(item.moneda) || 0) + item.saldoPendiente);
      for (const obligacion of obligaciones.filter(item => item.id_proveedor === id && item.saldo_actual.gt(0))) { const codigo = codigos.get(obligacion.id_moneda); if (codigo === 'CLP') totalClp += Number(obligacion.saldo_actual); else if (obligacion.tipo_cambio) totalClp += Number(obligacion.saldo_actual.mul(obligacion.tipo_cambio)); }
      const situacionFinanciera: SituacionProveedor = propias.some(item => item.condicionTemporal === 'Vencida') ? 'Vencida' : propias.some(item => item.condicionTemporal === 'Por vencer') ? 'Por vencer' : propias.some(item => item.condicionTemporal === 'Por pagar') ? 'Por pagar' : 'Sin deuda';
      resultado.set(id, { saldoPendienteTotal: totalClp, situacionFinanciera, saldosPorMoneda: [...saldos].map(([moneda,saldoPendiente]) => ({ moneda,saldoPendiente })), obligaciones: propias });
    }
    return resultado;
  }

  async listarCuentasPorPagar(consulta: Record<string, unknown>) {
    const estadoTemporal = texto(valorEntrada(consulta, 'estadoTemporal', 'estado_temporal') || 'todos', 20).toLowerCase();
    const estadoPago = texto(valorEntrada(consulta, 'estadoPago', 'estado_pago') || 'todos', 20).toLowerCase();
    const idProveedor = consulta.proveedor === undefined ? undefined : identificador(consulta.proveedor);
    const busqueda = texto(consulta.busqueda, 120).toLocaleLowerCase('es-CL');
    const ordenar = texto(consulta.ordenar || 'fechaVencimiento', 30); const direccion = direccionOrden(consulta.direccion || 'asc');
    const temporales: Record<string,string|null> = { todos:null, por_pagar:'Por pagar', 'por pagar':'Por pagar', por_vencer:'Por vencer', 'por vencer':'Por vencer', vencida:'Vencida' };
    const pagos: Record<string,string|null> = { todos:null, pendiente:'Pendiente', parcial:'Parcial', pagada:'Pagada' };
    if (!(estadoTemporal in temporales)) throw new ErrorAplicacion(400, 'Estado temporal inválido');
    if (!(estadoPago in pagos)) throw new ErrorAplicacion(400, 'Estado de pago inválido');
    if (!['proveedor','fechaEmision','fechaVencimiento','saldoPendiente','montoOriginal'].includes(ordenar)) throw new ErrorAplicacion(400, 'Ordenamiento inválido');
    const obligaciones = await prisma.obligacion_proveedor_m5.findMany({ where: { id_proveedor: idProveedor } });
    const [proveedores, documentos, monedas, tipos, umbral] = await Promise.all([
      prisma.proveedor.findMany({ where: { id_proveedor: { in: obligaciones.map(o => o.id_proveedor) } } }), prisma.documento_proveedor_m5.findMany({ where: { id_documento_m5: { in: obligaciones.map(o => o.id_documento_m5) } } }), prisma.moneda.findMany(), prisma.tipo_documento.findMany(), this.umbralM5(),
    ]);
    const lista = obligaciones.map(obligacion => {
      const proveedor = proveedores.find(p => p.id_proveedor === obligacion.id_proveedor)!; const documento = documentos.find(d => d.id_documento_m5 === obligacion.id_documento_m5)!; const moneda = monedas.find(m => m.id_moneda === obligacion.id_moneda)!; const tipo = tipos.find(t => t.id_tipo_documento === documento.id_tipo_documento);
      return { id: obligacion.id_obligacion_m5, proveedor: { id: proveedor.id_proveedor, razonSocial: proveedor.nombre_razon_social, identificadorFiscal: proveedor.identificador_tributario }, documento: { id: documento.id_documento_m5, folio: documento.folio, tipo: tipo?.nombre_tipo_documento || 'No disponible' }, moneda: moneda.codigo_moneda, montoOriginal: Number(obligacion.monto_original), saldoActual: Number(obligacion.saldo_actual), fechaEmision: obligacion.fecha_emision, fechaVencimiento: obligacion.fecha_vencimiento, condicionTemporal: calcularCondicionTemporalObligacion(obligacion, umbral), estadoPago: calcularEstadoPagoObligacion(obligacion.saldo_inicial, obligacion.saldo_actual), tipoCambio: obligacion.tipo_cambio ? Number(obligacion.tipo_cambio) : null, requiereAtencion: Number(obligacion.saldo_actual) > 0 && ['Por vencer','Vencida'].includes(calcularCondicionTemporalObligacion(obligacion, umbral) || '') };
    }).filter(item => (!temporales[estadoTemporal] || item.condicionTemporal === temporales[estadoTemporal]) && (!pagos[estadoPago] || item.estadoPago === pagos[estadoPago]) && (!busqueda || item.proveedor.razonSocial.toLocaleLowerCase('es-CL').includes(busqueda) || item.proveedor.identificadorFiscal.toLocaleLowerCase('es-CL').includes(busqueda) || item.documento.folio.toLocaleLowerCase('es-CL').includes(busqueda)));
    const factor = direccion === 'asc' ? 1 : -1;
    return lista.sort((a,b) => { let c=0; if(ordenar==='proveedor')c=a.proveedor.razonSocial.localeCompare(b.proveedor.razonSocial,'es-CL',{sensitivity:'base'}); if(ordenar==='fechaEmision')c=a.fechaEmision.getTime()-b.fechaEmision.getTime(); if(ordenar==='fechaVencimiento')c=a.fechaVencimiento.getTime()-b.fechaVencimiento.getTime(); if(ordenar==='saldoPendiente')c=a.saldoActual-b.saldoActual; if(ordenar==='montoOriginal')c=a.montoOriginal-b.montoOriginal; return c===0?a.id-b.id:c*factor; });
  }

  async consultarUmbralM5() {
    const vigente = await prisma.config_umbral_por_vencer_m5.findFirst({ orderBy: [{ fecha_hora: 'desc' }, { id_config_umbral_m5: 'desc' }] });
    return { diasHabiles: vigente?.dias_habiles ?? UMBRAL_INICIAL_M5, fechaHora: vigente?.fecha_hora || null, usuario: vigente?.usuario_id_usuario.toString() || null };
  }

  async configurarUmbralM5(entrada: Entrada, usuario: bigint) {
    const dias = Number(valorEntrada(entrada, 'diasHabiles', 'dias_habiles'));
    if (!Number.isInteger(dias) || dias < 0) throw new ErrorAplicacion(400, 'El umbral debe ser un entero mayor o igual que cero');
    const anterior = await this.consultarUmbralM5();
    const registro = await prisma.config_umbral_por_vencer_m5.create({ data: { dias_habiles: dias, usuario_id_usuario: usuario } });
    return { valorAnterior: anterior.diasHabiles, valorNuevo: registro.dias_habiles, usuario: usuario.toString(), fechaHora: registro.fecha_hora };
  }
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
    const resumenesM5 = await this.resumenObligacionesM5(proveedores.map(proveedor => proveedor.id_proveedor));
    const identificadorBuscado = busqueda.replace(/[.\s-]/g, '');
    const resultado = proveedores.map(proveedor => {
      // TEMPORAL_M5_DB_PATCH: si ya existe obligación M5, Legacy queda sólo como antecedente y no se suma dos veces.
      const resumen = resumenesM5.get(proveedor.id_proveedor) || calcularResumenFinancieroProveedor(proveedor.documento_compra_proveedor);
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
    const resumenFinanciero = (await this.resumenObligacionesM5([id])).get(id) || calcularResumenFinancieroProveedor(proveedor.documento_compra_proveedor);
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

  private presentarOcs(orden: OrdenCompraServicio) {
    return {
      id: orden.id_orden_compra_servicio_m5,
      proveedor: { id: orden.proveedor.id_proveedor, razonSocial: orden.proveedor.nombre_razon_social, estado: orden.proveedor.estado_proveedor },
      estado: orden.estado_ocs,
      ...calcularResumenOcs(orden.monto_autorizado, orden.efectos_financieros),
      tieneEfectosFinancieros: orden.efectos_financieros.length > 0,
      montoAutorizadoOriginal: Number(orden.monto_autorizado_original),
      idMoneda: orden.id_moneda,
      referencia: orden.referencia,
      periodo: orden.periodo,
      descripcion: orden.descripcion,
      fechaCreacion: orden.fecha_creacion,
      fechaActualizacion: orden.fecha_actualizacion,
      creadoPor: { id: orden.creado_por.toString(), nombre: orden.usuario_creador.acceso_m4 || orden.usuario_creador.usuario_username || orden.creado_por.toString() },
      historial: orden.historial.map(item => ({ id: item.id_historial_ocs_m5, campo: item.campo, valorAnterior: item.valor_anterior, valorNuevo: item.valor_nuevo, motivo: item.motivo, fechaHora: item.fecha_hora, usuario: item.usuario.acceso_m4 || item.usuario.usuario_username || item.usuario_id_usuario.toString() })),
      ajustes: orden.ajustes.map(item => ({ id: item.id_ajuste_ocs_m5, campo: item.campo, valorAnterior: item.valor_anterior, valorPropuesto: item.valor_propuesto, motivo: item.motivo, estado: item.estado, fechaSolicitud: item.fecha_solicitud, solicitadoPor: item.usuario_solicitante.acceso_m4 || item.usuario_solicitante.usuario_username || item.solicitado_por.toString(), fechaConfirmacion: item.fecha_confirmacion, confirmadoPor: item.usuario_confirmante ? item.usuario_confirmante.acceso_m4 || item.usuario_confirmante.usuario_username || item.confirmado_por?.toString() : null })),
    };
  }

  async listarOrdenesCompraServicios() {
    const ordenes = await prisma.orden_compra_servicio_m5.findMany({ include: incluirOcs, orderBy: [{ fecha_creacion: 'desc' }, { id_orden_compra_servicio_m5: 'desc' }] });
    return ordenes.map(orden => this.presentarOcs(orden));
  }

  async obtenerOrdenCompraServicio(id: number) {
    const orden = await prisma.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: id }, include: incluirOcs });
    if (!orden) throw new ErrorAplicacion(404, 'Orden de compra de servicios no encontrada');
    return this.presentarOcs(orden);
  }

  async crearOrdenCompraServicio(entrada: Entrada, usuario: bigint) {
    const idProveedor = identificador(valorEntrada(entrada, 'idProveedor', 'id_proveedor'));
    const montoAutorizado = montoPositivo(valorEntrada(entrada, 'montoAutorizado', 'monto_autorizado'));
    const idMoneda = entrada.idMoneda === undefined && entrada.id_moneda === undefined ? null : identificador(valorEntrada(entrada, 'idMoneda', 'id_moneda'));
    return prisma.$transaction(async tx => {
      const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: idProveedor } });
      if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
      if (proveedor.estado_proveedor !== 'activo') throw new ErrorAplicacion(409, 'Sólo puede utilizarse un proveedor Activo para una OCS');
      if (idMoneda && !await tx.moneda.findFirst({ where: { id_moneda: idMoneda, estado_moneda: 'activo' } })) throw new ErrorAplicacion(404, 'Moneda activa no encontrada');
      const orden = await tx.orden_compra_servicio_m5.create({ data: {
        id_proveedor: idProveedor,
        monto_autorizado: montoAutorizado,
        monto_autorizado_original: montoAutorizado,
        estado_ocs: 'abierta',
        referencia: contacto(entrada.referencia, 150),
        periodo: contacto(entrada.periodo, 50),
        descripcion: contacto(entrada.descripcion, 1000),
        creado_por: usuario,
        id_moneda: idMoneda,
      } });
      await tx.historial_orden_compra_servicio_m5.create({ data: { id_ocs_m5: orden.id_orden_compra_servicio_m5, campo: 'creacion', valor_anterior: null, valor_nuevo: JSON.stringify({ idProveedor, montoAutorizado: Number(montoAutorizado), estado: 'abierta' }), usuario_id_usuario: usuario } });
      const completa = await tx.orden_compra_servicio_m5.findUniqueOrThrow({ where: { id_orden_compra_servicio_m5: orden.id_orden_compra_servicio_m5 }, include: incluirOcs });
      return this.presentarOcs(completa);
    });
  }

  async modificarOrdenCompraServicio(id: number, entrada: Entrada, usuario: bigint) {
    if (['id', 'idOcs', 'creadoPor', 'creado_por', 'fechaCreacion', 'fecha_creacion', 'estado', 'estado_ocs'].some(campo => entrada[campo] !== undefined)) throw new ErrorAplicacion(400, 'No puede modificarse ID, creador, fecha de creación ni estado mediante CU90');
    return prisma.$transaction(async tx => {
      const actual = await tx.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: id } });
      if (!actual) throw new ErrorAplicacion(404, 'Orden de compra de servicios no encontrada');
      if (actual.estado_ocs !== 'abierta') throw new ErrorAplicacion(409, 'Sólo puede editarse directamente una OCS Abierta');
      if (await ocsTieneEfectosFinancieros(tx, id)) throw new ErrorAplicacion(409, 'La OCS ya tiene efectos financieros; debe utilizarse el flujo de ajuste CU91');
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
      const completa = await tx.orden_compra_servicio_m5.findUniqueOrThrow({ where: { id_orden_compra_servicio_m5: id }, include: incluirOcs });
      return this.presentarOcs(completa);
    });
  }

  private campoAjuste(valor: unknown) {
    const campo = texto(valor, 80);
    const equivalencias: Record<string, string> = { montoAutorizado: 'monto_autorizado', idProveedor: 'id_proveedor' };
    const normalizado = equivalencias[campo] || campo;
    if (!['monto_autorizado', 'id_proveedor', 'referencia', 'periodo', 'descripcion'].includes(normalizado)) throw new ErrorAplicacion(400, 'Campo de ajuste no permitido');
    return normalizado;
  }

  private async resolverValorAjuste(tx: Transaccion, orden: Prisma.orden_compra_servicio_m5GetPayload<Record<string, never>>, campo: string, valor: unknown) {
    if (campo === 'monto_autorizado') return montoPositivo(valor).toString();
    if (campo === 'id_proveedor') {
      const idProveedor = identificador(valor);
      const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: idProveedor } });
      if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
      if (proveedor.estado_proveedor !== 'activo') throw new ErrorAplicacion(409, 'Sólo puede utilizarse un proveedor Activo para una OCS');
      return String(idProveedor);
    }
    const maximo = campo === 'referencia' ? 150 : campo === 'periodo' ? 50 : 1000;
    return contacto(valor, maximo);
  }

  private valorActualAjuste(orden: Prisma.orden_compra_servicio_m5GetPayload<Record<string, never>>, campo: string) {
    if (campo === 'monto_autorizado') return orden.monto_autorizado.toString();
    if (campo === 'id_proveedor') return String(orden.id_proveedor);
    return orden[campo as 'referencia' | 'periodo' | 'descripcion'];
  }

  async prepararAjusteOrdenCompraServicio(id: number, entrada: Entrada, usuario: bigint) {
    const campo = this.campoAjuste(entrada.campo);
    const motivo = motivoObligatorio(entrada.motivo);
    const valorEntradaAjuste = valorEntrada(entrada, 'valorPropuesto', 'valor_propuesto', 'valor');
    return prisma.$transaction(async tx => {
      const orden = await tx.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: id } });
      if (!orden) throw new ErrorAplicacion(404, 'Orden de compra de servicios no encontrada');
      if (orden.estado_ocs !== 'abierta') throw new ErrorAplicacion(409, 'Sólo puede ajustarse una OCS Abierta');
      if (!await ocsTieneEfectosFinancieros(tx, id)) throw new ErrorAplicacion(409, 'La OCS no tiene efectos financieros y debe modificarse mediante CU90');
      if (await tx.ajuste_orden_compra_servicio_m5.findFirst({ where: { id_ocs_m5: id, campo, estado: 'pendiente' } })) throw new ErrorAplicacion(409, 'Ya existe un ajuste pendiente para este campo');
      const anterior = this.valorActualAjuste(orden, campo);
      const propuesto = await this.resolverValorAjuste(tx, orden, campo, valorEntradaAjuste);
      if (anterior === propuesto) throw new ErrorAplicacion(400, 'El ajuste no presenta cambios');
      const ajuste = await tx.ajuste_orden_compra_servicio_m5.create({ data: { id_ocs_m5: id, campo, valor_anterior: anterior, valor_propuesto: propuesto, motivo, solicitado_por: usuario } });
      await tx.historial_orden_compra_servicio_m5.create({ data: { id_ocs_m5: id, campo: 'solicitud_ajuste', valor_anterior: anterior, valor_nuevo: propuesto, motivo, usuario_id_usuario: usuario } });
      return { id: ajuste.id_ajuste_ocs_m5, idOcs: id, campo, valorAnterior: anterior, valorPropuesto: propuesto, motivo, estado: ajuste.estado, solicitadoPor: usuario.toString(), fechaSolicitud: ajuste.fecha_solicitud };
    });
  }

  async confirmarAjusteOrdenCompraServicio(id: number, ajusteId: number, usuario: bigint) {
    return prisma.$transaction(async tx => {
      const ajuste = await tx.ajuste_orden_compra_servicio_m5.findFirst({ where: { id_ajuste_ocs_m5: ajusteId, id_ocs_m5: id } });
      if (!ajuste) throw new ErrorAplicacion(404, 'Solicitud de ajuste no encontrada');
      if (ajuste.estado !== 'pendiente') throw new ErrorAplicacion(409, 'La solicitud de ajuste ya fue resuelta');
      const orden = await tx.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: id } });
      if (!orden) throw new ErrorAplicacion(404, 'Orden de compra de servicios no encontrada');
      if (orden.estado_ocs !== 'abierta') throw new ErrorAplicacion(409, 'Sólo puede confirmarse un ajuste sobre una OCS Abierta');
      const data: Prisma.orden_compra_servicio_m5UncheckedUpdateInput = { fecha_actualizacion: new Date() };
      if (ajuste.campo === 'monto_autorizado') data.monto_autorizado = montoPositivo(ajuste.valor_propuesto);
      else if (ajuste.campo === 'id_proveedor') {
        const idProveedor = identificador(ajuste.valor_propuesto);
        const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: idProveedor } });
        if (!proveedor || proveedor.estado_proveedor !== 'activo') throw new ErrorAplicacion(409, 'El proveedor propuesto ya no está Activo');
        data.id_proveedor = idProveedor;
      } else data[ajuste.campo as 'referencia' | 'periodo' | 'descripcion'] = ajuste.valor_propuesto;
      await tx.orden_compra_servicio_m5.update({ where: { id_orden_compra_servicio_m5: id }, data });
      const confirmado = await tx.ajuste_orden_compra_servicio_m5.update({ where: { id_ajuste_ocs_m5: ajusteId }, data: { estado: 'confirmado', confirmado_por: usuario, fecha_confirmacion: new Date() } });
      await tx.historial_orden_compra_servicio_m5.create({ data: { id_ocs_m5: id, campo: `ajuste_${ajuste.campo}`, valor_anterior: ajuste.valor_anterior, valor_nuevo: ajuste.valor_propuesto, motivo: ajuste.motivo, usuario_id_usuario: usuario } });
      return { mensaje: 'Ajuste confirmado', id: ajusteId, idOcs: id, estado: confirmado.estado, confirmadoPor: usuario.toString(), fechaConfirmacion: confirmado.fecha_confirmacion };
    });
  }

  async anularOrdenCompraServicio(id: number, entrada: Entrada, usuario: bigint) {
    const motivo = motivoObligatorio(entrada.motivo);
    return prisma.$transaction(async tx => {
      const orden = await tx.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: id } });
      if (!orden) throw new ErrorAplicacion(404, 'Orden de compra de servicios no encontrada');
      if (orden.estado_ocs !== 'abierta') throw new ErrorAplicacion(409, 'Sólo puede anularse una OCS Abierta');
      if (await ocsTieneEfectosFinancieros(tx, id)) throw new ErrorAplicacion(409, 'La OCS tiene efectos financieros y no puede anularse directamente; utiliza el ajuste trazable cuando corresponda');
      await tx.orden_compra_servicio_m5.update({ where: { id_orden_compra_servicio_m5: id }, data: { estado_ocs: 'anulada', fecha_actualizacion: new Date() } });
      await tx.historial_orden_compra_servicio_m5.create({ data: { id_ocs_m5: id, campo: 'estado', valor_anterior: 'abierta', valor_nuevo: 'anulada', motivo, usuario_id_usuario: usuario } });
      return { mensaje: 'Orden de compra de servicios anulada', id, estado: 'anulada' };
    });
  }

  async cerrarOrdenCompraServicio(id: number, entrada: Entrada, usuario: bigint) {
    return prisma.$transaction(async tx => {
      const orden = await tx.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: id }, include: { efectos_financieros: true } });
      if (!orden) throw new ErrorAplicacion(404, 'Orden de compra de servicios no encontrada');
      if (orden.estado_ocs !== 'abierta') throw new ErrorAplicacion(409, 'Sólo puede cerrarse una OCS Abierta');
      const montoDocumentado = calcularResumenOcs(orden.monto_autorizado, orden.efectos_financieros).montoDocumentado;
      const evaluacion = evaluarCierreOcs(orden.monto_autorizado, montoDocumentado, entrada.declaracionFinal === true, texto(entrada.justificacion, 1000));
      if (!evaluacion.puedeCerrar) {
        if (evaluacion.tipo === 'excedente_pendiente_aprobacion') throw new ErrorAplicacion(409, 'La OCS tiene un excedente pendiente de aprobación y no puede cerrarse');
        throw new ErrorAplicacion(400, evaluacion.tipo === 'requiere_declaracion_final' ? 'Debes declarar que corresponde a la facturación final' : 'La justificación es obligatoria para cerrar bajo el monto autorizado');
      }
      const justificacion = evaluacion.automatico ? null : texto(entrada.justificacion, 1000);
      await tx.orden_compra_servicio_m5.update({ where: { id_orden_compra_servicio_m5: id }, data: { estado_ocs: 'cerrada', fecha_actualizacion: new Date() } });
      await tx.historial_orden_compra_servicio_m5.create({ data: { id_ocs_m5: id, campo: 'estado', valor_anterior: 'abierta', valor_nuevo: JSON.stringify({ estado: 'cerrada', tipoCierre: evaluacion.tipo, montoDocumentado }), motivo: justificacion, usuario_id_usuario: usuario } });
      return { mensaje: 'Orden de compra de servicios cerrada', id, estado: 'cerrada', tipoCierre: evaluacion.tipo, montoAutorizado: Number(orden.monto_autorizado), montoDocumentado };
    });
  }

  async reabrirOrdenCompraServicio(id: number, confirmado: boolean, usuario: bigint) {
    if (!confirmado) throw new ErrorAplicacion(400, 'Debes confirmar la reapertura');
    return prisma.$transaction(async tx => {
      const orden = await tx.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: id } });
      if (!orden) throw new ErrorAplicacion(404, 'Orden de compra de servicios no encontrada');
      if (orden.estado_ocs !== 'cerrada') throw new ErrorAplicacion(409, 'Sólo puede reabrirse una OCS Cerrada');
      await tx.orden_compra_servicio_m5.update({ where: { id_orden_compra_servicio_m5: id }, data: { estado_ocs: 'abierta', fecha_actualizacion: new Date() } });
      await tx.historial_orden_compra_servicio_m5.create({ data: { id_ocs_m5: id, campo: 'estado', valor_anterior: 'cerrada', valor_nuevo: 'abierta', usuario_id_usuario: usuario } });
      return { mensaje: 'Orden de compra de servicios reabierta', id, estado: 'abierta' };
    });
  }

  private presentarDocumentoProveedor(documento: DocumentoProveedor & { proveedor: { id_proveedor: number; nombre_razon_social: string }; tipo_documento: { nombre_tipo_documento: string }; moneda: { codigo_moneda: string } }) {
    const resumen = calcularResumenFinancieroProveedor([documento]).obligaciones[0];
    return {
      id: `legacy-${documento.id_documento_compra_proveedor}`,
      fuente: 'documento_compra_proveedor',
      proveedor: { id: documento.proveedor.id_proveedor, razonSocial: documento.proveedor.nombre_razon_social },
      tipoDocumento: documento.tipo_documento.nombre_tipo_documento,
      numero: documento.numero_documento,
      fechaEmision: documento.fecha_emision,
      fechaVencimiento: documento.fecha_vencimiento,
      moneda: documento.moneda.codigo_moneda,
      montoTotal: Number(documento.monto_total),
      estadoDocumental: documento.estado_documento,
      saldoPendiente: resumen.saldoPendiente,
      estadoPagoCalculado: resumen.estadoPago,
      clasificacionM5: 'No disponible',
      asociacionOrdenCompra: 'Sin asociación',
      observacion: documento.observacion,
    };
  }

  private async documentoM5(id: number, tx: Transaccion | typeof prisma = prisma) {
    const documento = await tx.documento_proveedor_m5.findUnique({ where: { id_documento_m5: id } });
    if (!documento) throw new ErrorAplicacion(404, 'Documento M5 de proveedor no encontrado');
    return documento;
  }

  private async presentarDocumentoM5(documento: Prisma.documento_proveedor_m5GetPayload<Record<string, never>>) {
    const [proveedor, tipo, moneda, asociaciones, obligacion, propuesta] = await Promise.all([
      prisma.proveedor.findUnique({ where: { id_proveedor: documento.id_proveedor } }),
      prisma.tipo_documento.findUnique({ where: { id_tipo_documento: documento.id_tipo_documento } }),
      prisma.moneda.findUnique({ where: { id_moneda: documento.id_moneda } }),
      prisma.asociacion_documento_oc_m5.findMany({ where: { id_documento_m5: documento.id_documento_m5 }, orderBy: { id_asociacion_m5: 'asc' } }),
      prisma.obligacion_proveedor_m5.findUnique({ where: { id_documento_m5: documento.id_documento_m5 } }),
      prisma.propuesta_imputacion_m5.findFirst({ where: { id_documento_m5: documento.id_documento_m5 }, orderBy: { id_propuesta_imputacion_m5: 'desc' } }),
    ]);
    const clasificaciones = await prisma.clasificacion_asociacion_m5.findMany({ where: { id_asociacion_m5: { in: asociaciones.map(item => item.id_asociacion_m5) } } });
    const categorias = await prisma.categoria_egreso_m5.findMany({ where: { id_categoria_egreso_m5: { in: clasificaciones.map(item => item.id_categoria_egreso_m5) } } });
    const listo = documento.clase === 'definitivo' && asociaciones.length > 0 && !!documento.fecha_vencimiento
      && asociaciones.every(a => a.estado_excedente !== 'pendiente' && a.estado_excedente !== 'rechazado')
      && asociaciones.every(a => clasificaciones.filter(c => c.id_asociacion_m5 === a.id_asociacion_m5).reduce((s, c) => s.plus(c.monto), new Prisma.Decimal(0)).equals(a.monto_asignado))
      && propuesta?.estado === 'confirmado' && (moneda?.codigo_moneda === 'CLP' || !!documento.tipo_cambio);
    return {
      id: `m5-${documento.id_documento_m5}`, idM5: documento.id_documento_m5, fuente: 'documento_proveedor_m5', clase: documento.clase,
      proveedor: { id: documento.id_proveedor, razonSocial: proveedor?.nombre_razon_social || 'Proveedor no disponible' }, tipoDocumento: tipo?.nombre_tipo_documento || 'No disponible',
      numero: documento.folio, fechaEmision: documento.fecha_emision, fechaVencimiento: documento.fecha_vencimiento, moneda: moneda?.codigo_moneda || 'No disponible', montoTotal: Number(documento.monto_total),
      estadoDocumental: documento.estado, saldoPendiente: obligacion ? Number(obligacion.saldo_actual) : 0, clasificacionM5: documento.clase, asociacionOrdenCompra: asociaciones.length ? asociaciones.map(a => a.tipo_orden === 'OCS' ? `OCS-${a.id_ocs_m5}` : a.tipo_orden).join(', ') : 'Sin asociación',
      descripcion: documento.descripcion, asociaciones: asociaciones.map(a => ({ id: a.id_asociacion_m5, tipoOrden: a.tipo_orden, idOcs: a.id_ocs_m5, montoAsignado: Number(a.monto_asignado), estadoDiferencia: a.estado_diferencia, estadoExcedente: a.estado_excedente, montoExcedente: Number(a.monto_excedente), esFinal: a.es_documento_final })),
      clasificaciones: clasificaciones.map(c => ({ id: c.id_clasificacion_m5, idAsociacion: c.id_asociacion_m5, idCategoria: c.id_categoria_egreso_m5, categoria: categorias.find(k => k.id_categoria_egreso_m5 === c.id_categoria_egreso_m5)?.nombre || 'No disponible', monto: Number(c.monto) })),
      propuestaImputacion: propuesta ? { id: propuesta.id_propuesta_imputacion_m5, estado: propuesta.estado, preparadoPor: propuesta.preparado_por.toString() } : null,
      progreso: { asociaciones: asociaciones.length > 0, vencimiento: !!documento.fecha_vencimiento, clasificacion: clasificaciones.length > 0, imputacion: propuesta?.estado || 'pendiente', moneda: moneda?.codigo_moneda === 'CLP' || !!documento.tipo_cambio, listoObligacion: listo }, obligacion,
    };
  }

  private async registrarDocumentoM5(clase: 'preliminar' | 'definitivo', entrada: Entrada, usuario: bigint) {
    const idProveedor = identificador(valorEntrada(entrada, 'idProveedor', 'id_proveedor'));
    const idTipoDocumento = identificador(valorEntrada(entrada, 'idTipoDocumento', 'id_tipo_documento'));
    const idMoneda = identificador(valorEntrada(entrada, 'idMoneda', 'id_moneda'));
    const monto = montoPositivo(valorEntrada(entrada, 'montoTotal', 'monto_total'));
    const folio = folioNormalizado(valorEntrada(entrada, 'folio', 'numero'));
    const fechaEmision = fechaEntrada(valorEntrada(entrada, 'fechaEmision', 'fecha_emision'), 'Fecha de emisión');
    const excepcionTipo = contacto(valorEntrada(entrada, 'excepcionSinOcTipo', 'excepcion_sin_oc_tipo'), 40);
    const excepciones = ['comision_bancaria', 'arancel', 'tasa', 'cargo_financiero', 'cargo_aduanero', 'cargo_regulatorio'];
    if (excepcionTipo && !excepciones.includes(excepcionTipo)) throw new ErrorAplicacion(400, 'Tipo de excepción sin OC no permitido');
    const excepcionDescripcion = excepcionTipo ? motivoObligatorio(valorEntrada(entrada, 'excepcionSinOcDescripcion', 'excepcion_sin_oc_descripcion')) : null;
    try {
      const documento = await prisma.$transaction(async tx => {
        const [proveedor, tipo, moneda] = await Promise.all([
          tx.proveedor.findUnique({ where: { id_proveedor: idProveedor } }), tx.tipo_documento.findUnique({ where: { id_tipo_documento: idTipoDocumento } }), tx.moneda.findUnique({ where: { id_moneda: idMoneda } }),
        ]);
        if (!proveedor) throw new ErrorAplicacion(404, 'Proveedor no encontrado');
        if (proveedor.estado_proveedor !== 'activo') throw new ErrorAplicacion(409, 'El proveedor no está habilitado operacionalmente');
        if (!tipo) throw new ErrorAplicacion(404, 'Tipo de documento no encontrado');
        if (!moneda || moneda.estado_moneda !== 'activo') throw new ErrorAplicacion(404, 'Moneda activa no encontrada');
        if (clase === 'definitivo' && await tx.documento_proveedor_m5.findFirst({ where: { id_proveedor: idProveedor, id_tipo_documento: idTipoDocumento, folio_normalizado: folio.normalizado, clase } })) throw new ErrorAplicacion(409, 'Ya existe un documento definitivo con el mismo proveedor, tipo y folio');
        const creado = await tx.documento_proveedor_m5.create({ data: { id_proveedor: idProveedor, clase, id_tipo_documento: idTipoDocumento, folio: folio.folio, folio_normalizado: folio.normalizado, fecha_emision: fechaEmision, id_moneda: idMoneda, monto_total: monto, respaldo: contacto(entrada.respaldo, 1000), descripcion: contacto(entrada.descripcion, 1000), excepcion_sin_oc_tipo: excepcionTipo, excepcion_sin_oc_descripcion: excepcionDescripcion, creado_por: usuario } });
        if (excepcionTipo) await tx.asociacion_documento_oc_m5.create({ data: { id_documento_m5: creado.id_documento_m5, tipo_orden: 'EXCEPCION', monto_asignado: monto, estado_diferencia: 'exacta', monto_disponible_snapshot: monto } });
        return creado;
      });
      if (clase === 'definitivo') {
        const moneda = await prisma.moneda.findUniqueOrThrow({ where: { id_moneda: idMoneda } });
        if (moneda.codigo_moneda !== 'CLP') try {
          const tasa = await this.bancoCentral.obtenerTipoCambio(moneda.codigo_moneda, fechaRegistro(fechaEmision));
          await prisma.documento_proveedor_m5.update({ where: { id_documento_m5: documento.id_documento_m5 }, data: { tipo_cambio: tasa, tipo_cambio_origen: 'C_BancoCentral', tipo_cambio_fecha: new Date() } });
        } catch { /* Se conserva en preparación hasta CU104. */ }
      }
      return this.presentarDocumentoM5(await prisma.documento_proveedor_m5.findUniqueOrThrow({ where: { id_documento_m5: documento.id_documento_m5 } }));
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe un documento definitivo con el mismo proveedor, tipo y folio');
      throw error;
    }
  }

  registrarDocumentoPreliminar(entrada: Entrada, usuario: bigint) { return this.registrarDocumentoM5('preliminar', entrada, usuario); }
  registrarDocumentoDefinitivo(entrada: Entrada, usuario: bigint) { return this.registrarDocumentoM5('definitivo', entrada, usuario); }

  async asociarDocumentoOrdenes(id: number, entrada: Entrada) {
    const asociaciones = Array.isArray(entrada.asociaciones) ? entrada.asociaciones as Entrada[] : [];
    if (!asociaciones.length) throw new ErrorAplicacion(400, 'Debes indicar al menos una Orden de Compra');
    const tipos = new Set(asociaciones.map(item => texto(valorEntrada(item, 'tipoOrden', 'tipo_orden'), 10).toUpperCase()));
    if (tipos.size !== 1) throw new ErrorAplicacion(409, 'No se pueden mezclar OCS y OCI en un mismo documento');
    if (tipos.has('OCI')) throw new ErrorAplicacion(409, 'TEMPORAL_M5_DB_PATCH_PENDIENTE: integración OCI aún no disponible');
    if (!tipos.has('OCS')) throw new ErrorAplicacion(400, 'Tipo de Orden de Compra inválido');
    return prisma.$transaction(async tx => {
      const documento = await this.documentoM5(id, tx);
      if (documento.estado !== 'borrador') throw new ErrorAplicacion(409, 'El documento ya fue confirmado');
      const entradas = asociaciones.map(item => ({ idOcs: identificador(valorEntrada(item, 'idOcs', 'id_ocs')), monto: montoPositivo(valorEntrada(item, 'montoAsignado', 'monto_asignado')) }));
      const total = entradas.reduce((s, item) => s.plus(item.monto), new Prisma.Decimal(0));
      if (!total.equals(documento.monto_total)) throw new ErrorAplicacion(400, 'La distribución entre Órdenes de Compra debe ser exactamente igual al monto del documento');
      const ordenes = await tx.orden_compra_servicio_m5.findMany({ where: { id_orden_compra_servicio_m5: { in: entradas.map(item => item.idOcs) } }, include: { efectos_financieros: true } });
      if (ordenes.length !== entradas.length) throw new ErrorAplicacion(404, 'Una OCS no existe');
      for (const orden of ordenes) {
        if (orden.id_proveedor !== documento.id_proveedor || orden.estado_ocs !== 'abierta') throw new ErrorAplicacion(409, 'La OCS no está disponible o no corresponde al proveedor');
        if (!orden.id_moneda) throw new ErrorAplicacion(409, 'La OCS no tiene moneda verificable y no puede compararse de forma segura');
        if (orden.id_moneda !== documento.id_moneda) throw new ErrorAplicacion(409, 'La moneda del documento no coincide con la OCS');
      }
      await tx.clasificacion_asociacion_m5.deleteMany({ where: { id_asociacion_m5: { in: (await tx.asociacion_documento_oc_m5.findMany({ where: { id_documento_m5: id } })).map(a => a.id_asociacion_m5) } } });
      await tx.asociacion_documento_oc_m5.deleteMany({ where: { id_documento_m5: id } });
      for (const item of entradas) {
        const orden = ordenes.find(o => o.id_orden_compra_servicio_m5 === item.idOcs)!;
        const consumido = orden.efectos_financieros.reduce((s, e) => s.plus(e.monto_documentado), new Prisma.Decimal(0));
        const disponible = Prisma.Decimal.max(0, orden.monto_autorizado.minus(consumido));
        const excedente = Prisma.Decimal.max(0, item.monto.minus(disponible));
        await tx.asociacion_documento_oc_m5.create({ data: { id_documento_m5: id, tipo_orden: 'OCS', id_ocs_m5: item.idOcs, monto_asignado: item.monto, monto_disponible_snapshot: disponible, estado_diferencia: excedente.gt(0) ? 'excedente' : item.monto.equals(disponible) ? 'exacta' : 'parcial', monto_excedente: excedente, estado_excedente: excedente.gt(0) ? 'pendiente' : 'no_aplica' } });
      }
      return { mensaje: 'Asociaciones guardadas', cantidad: entradas.length };
    });
  }

  async resolverDiferenciaDocumento(id: number, asociacionId: number, entrada: Entrada, usuario: bigint) {
    return prisma.$transaction(async tx => {
      await this.documentoM5(id, tx);
      const asociacion = await tx.asociacion_documento_oc_m5.findFirst({ where: { id_asociacion_m5: asociacionId, id_documento_m5: id } });
      if (!asociacion) throw new ErrorAplicacion(404, 'Asociación documental no encontrada');
      const esFinal = entrada.esFinal === true || entrada.es_documento_final === true;
      const justificacion = contacto(entrada.justificacion, 1000);
      if ((esFinal || asociacion.monto_excedente.gt(0)) && !justificacion) throw new ErrorAplicacion(400, 'La justificación es obligatoria');
      const data: Prisma.asociacion_documento_oc_m5UpdateInput = { es_documento_final: esFinal, justificacion };
      if (asociacion.monto_excedente.gt(0)) Object.assign(data, { estado_diferencia: 'excedente', estado_excedente: 'pendiente', excedente_solicitado_por: usuario, excedente_fecha_solicitud: new Date() });
      else data.estado_diferencia = esFinal ? 'final_bajo_autorizado' : asociacion.estado_diferencia;
      return tx.asociacion_documento_oc_m5.update({ where: { id_asociacion_m5: asociacionId }, data });
    });
  }

  async resolverExcedenteDocumento(id: number, asociacionId: number, entrada: Entrada, usuario: bigint, perfil: string) {
    return prisma.$transaction(async tx => {
      await this.documentoM5(id, tx);
      const asociacion = await tx.asociacion_documento_oc_m5.findFirst({ where: { id_asociacion_m5: asociacionId, id_documento_m5: id } });
      if (!asociacion) throw new ErrorAplicacion(404, 'Diferencia documental no encontrada');
      if (asociacion.estado_excedente !== 'pendiente') throw new ErrorAplicacion(409, 'El excedente no está pendiente');
      if (perfil === 'contador' && asociacion.excedente_solicitado_por === usuario) throw new ErrorAplicacion(403, 'Contador no puede aprobar un excedente que originó');
      const aprobar = entrada.aprobar === true;
      return tx.asociacion_documento_oc_m5.update({ where: { id_asociacion_m5: asociacionId }, data: { estado_excedente: aprobar ? 'aprobado' : 'rechazado', excedente_aprobado_por: usuario, excedente_fecha_resolucion: new Date() } });
    });
  }

  async determinarVencimientoDocumento(id: number, entrada: Entrada) {
    return prisma.$transaction(async tx => {
      const documento = await this.documentoM5(id, tx);
      if (documento.clase !== 'definitivo' || documento.estado !== 'borrador') throw new ErrorAplicacion(409, 'El vencimiento sólo se determina para un documento definitivo en preparación');
      const proveedor = await tx.proveedor.findUniqueOrThrow({ where: { id_proveedor: documento.id_proveedor } });
      if (proveedor.condicion_pago_dias_m5 === null || !proveedor.condicion_pago_tipo_m5) throw new ErrorAplicacion(409, 'El proveedor no tiene condición de pago vigente');
      const emision = fechaRegistro(documento.fecha_emision); const dias = proveedor.condicion_pago_dias_m5;
      let propuesta: string;
      if (proveedor.condicion_pago_tipo_m5 === 'DIAS_HABILES') {
        const feriados = new Set((await tx.feriado_chile_m5.findMany()).map(item => fechaRegistro(item.fecha)));
        propuesta = sumarDiasHabilesChile(emision, dias, feriados);
      } else { const fecha = new Date(`${emision}T00:00:00Z`); fecha.setUTCDate(fecha.getUTCDate() + dias); propuesta = fecha.toISOString().slice(0, 10); }
      const real = entrada.fechaVencimiento || entrada.fecha_vencimiento ? texto(valorEntrada(entrada, 'fechaVencimiento', 'fecha_vencimiento'), 10) : propuesta;
      const cargaHistorica = entrada.cargaHistorica === true || entrada.carga_historica === true;
      const justificacion = contacto(entrada.justificacion, 1000);
      if (real !== propuesta && !justificacion) throw new ErrorAplicacion(400, 'Una fecha distinta de la propuesta exige justificación');
      if (real < emision && (!cargaHistorica || !justificacion)) throw new ErrorAplicacion(400, 'El vencimiento anterior a la emisión sólo se permite como carga histórica justificada');
      fechaEntrada(real, 'Fecha de vencimiento');
      await tx.documento_proveedor_m5.update({ where: { id_documento_m5: id }, data: { fecha_vencimiento: new Date(`${real}T00:00:00Z`), condicion_pago_dias_snapshot: dias, condicion_pago_tipo_snapshot: proveedor.condicion_pago_tipo_m5, vencimiento_justificacion: justificacion, carga_historica: cargaHistorica } });
      return { fechaPropuesta: propuesta, fechaVencimiento: real, condicionSnapshot: { dias, tipo: proveedor.condicion_pago_tipo_m5 } };
    });
  }

  async clasificarDocumento(id: number, entrada: Entrada) {
    const distribuciones = Array.isArray(entrada.distribuciones) ? entrada.distribuciones as Entrada[] : [];
    return prisma.$transaction(async tx => {
      await this.documentoM5(id, tx);
      const asociaciones = await tx.asociacion_documento_oc_m5.findMany({ where: { id_documento_m5: id } });
      const ids = new Set(asociaciones.map(a => a.id_asociacion_m5));
      const datos = distribuciones.map(item => ({ idAsociacion: identificador(valorEntrada(item, 'idAsociacion', 'id_asociacion')), idCategoria: identificador(valorEntrada(item, 'idCategoria', 'id_categoria')), monto: montoPositivo(item.monto) }));
      if (!datos.length || datos.some(item => !ids.has(item.idAsociacion))) throw new ErrorAplicacion(404, 'Asociación documental no encontrada');
      const categorias = await tx.categoria_egreso_m5.findMany({ where: { id_categoria_egreso_m5: { in: datos.map(d => d.idCategoria) }, activo: true } });
      if (new Set(datos.map(d => d.idCategoria)).size !== categorias.length) throw new ErrorAplicacion(404, 'Categoría de egreso activa no encontrada');
      for (const asociacion of asociaciones) if (!datos.filter(d => d.idAsociacion === asociacion.id_asociacion_m5).reduce((s, d) => s.plus(d.monto), new Prisma.Decimal(0)).equals(asociacion.monto_asignado)) throw new ErrorAplicacion(400, 'La clasificación debe cuadrar exactamente con cada asociación');
      await tx.clasificacion_asociacion_m5.deleteMany({ where: { id_asociacion_m5: { in: [...ids] } } });
      await tx.clasificacion_asociacion_m5.createMany({ data: datos.map(d => ({ id_asociacion_m5: d.idAsociacion, id_categoria_egreso_m5: d.idCategoria, monto: d.monto })) });
      return { mensaje: 'Clasificación guardada', cantidad: datos.length };
    });
  }

  async prepararImputacionDocumento(id: number, entrada: Entrada, usuario: bigint) {
    const distribuciones = Array.isArray(entrada.distribuciones) ? entrada.distribuciones as Entrada[] : [];
    return prisma.$transaction(async tx => {
      await this.documentoM5(id, tx);
      const clasificaciones = await tx.clasificacion_asociacion_m5.findMany({ where: { id_asociacion_m5: { in: (await tx.asociacion_documento_oc_m5.findMany({ where: { id_documento_m5: id } })).map(a => a.id_asociacion_m5) } } });
      const datos = distribuciones.map(item => ({ idClasificacion: identificador(valorEntrada(item, 'idClasificacion', 'id_clasificacion')), destino: texto(item.destino, 20).toLowerCase(), idProyecto: item.idProyecto ? BigInt(String(item.idProyecto)) : null, idOt: item.idOrdenTrabajo ? BigInt(String(item.idOrdenTrabajo)) : null, monto: montoPositivo(item.monto) }));
      for (const clasificacion of clasificaciones) if (!datos.filter(d => d.idClasificacion === clasificacion.id_clasificacion_m5).reduce((s, d) => s.plus(d.monto), new Prisma.Decimal(0)).equals(clasificacion.monto)) throw new ErrorAplicacion(400, 'La imputación debe cuadrar exactamente con cada clasificación');
      for (const item of datos) {
        if (!['general','proyecto'].includes(item.destino)) throw new ErrorAplicacion(400, 'Destino de imputación inválido');
        if (item.destino === 'proyecto') {
          const proyecto = item.idProyecto ? await tx.proyecto.findUnique({ where: { proyecto_proyecto_id: item.idProyecto } }) : null;
          if (!proyecto) throw new ErrorAplicacion(404, 'Proyecto no encontrado');
          if (proyecto.proyecto_estado_operacional?.toLowerCase() !== 'activo') throw new ErrorAplicacion(409, 'El proyecto no está activo');
          if (item.idOt) { const ot = await tx.orden_trabajo.findUnique({ where: { orden_trabajo_id_orden: item.idOt } }); if (!ot) throw new ErrorAplicacion(404, 'Orden de Trabajo no encontrada'); if (ot.proyecto_id_proyecto !== item.idProyecto) throw new ErrorAplicacion(400, 'La Orden de Trabajo no pertenece al Proyecto'); }
        } else if (item.idProyecto || item.idOt) throw new ErrorAplicacion(400, 'Gasto general no admite Proyecto ni Orden de Trabajo');
      }
      const anterior = await tx.propuesta_imputacion_m5.findFirst({ where: { id_documento_m5: id, estado: 'pendiente' } });
      if (anterior) { await tx.detalle_imputacion_m5.deleteMany({ where: { id_propuesta_imputacion_m5: anterior.id_propuesta_imputacion_m5 } }); await tx.propuesta_imputacion_m5.delete({ where: { id_propuesta_imputacion_m5: anterior.id_propuesta_imputacion_m5 } }); }
      const propuesta = await tx.propuesta_imputacion_m5.create({ data: { id_documento_m5: id, preparado_por: usuario } });
      await tx.detalle_imputacion_m5.createMany({ data: datos.map(d => ({ id_propuesta_imputacion_m5: propuesta.id_propuesta_imputacion_m5, id_clasificacion_m5: d.idClasificacion, destino: d.destino, id_proyecto: d.idProyecto, id_orden_trabajo: d.idOt, monto: d.monto })) });
      return { id: propuesta.id_propuesta_imputacion_m5, estado: propuesta.estado };
    });
  }

  async confirmarImputacionDocumento(id: number, propuestaId: number, usuario: bigint) {
    const propuesta = await prisma.propuesta_imputacion_m5.findFirst({ where: { id_propuesta_imputacion_m5: propuestaId, id_documento_m5: id, estado: 'pendiente' } });
    if (!propuesta) throw new ErrorAplicacion(409, 'Propuesta de imputación no disponible');
    return prisma.propuesta_imputacion_m5.update({ where: { id_propuesta_imputacion_m5: propuestaId }, data: { estado: 'confirmado', confirmado_por: usuario, fecha_confirmacion: new Date() } });
  }

  async registrarTipoCambioManual(id: number, entrada: Entrada, usuario: bigint) {
    const tasa = montoPositivo(valorEntrada(entrada, 'tipoCambio', 'tipo_cambio'));
    const justificacion = motivoObligatorio(entrada.justificacion); const origen = texto(entrada.origen, 40);
    if (!origen) throw new ErrorAplicacion(400, 'El origen o contexto de la tasa es obligatorio');
    const documento = await this.documentoM5(id);
    const moneda = await prisma.moneda.findUniqueOrThrow({ where: { id_moneda: documento.id_moneda } });
    if (moneda.codigo_moneda === 'CLP') throw new ErrorAplicacion(400, 'CLP no requiere tipo de cambio');
    return prisma.documento_proveedor_m5.update({ where: { id_documento_m5: id }, data: { tipo_cambio: tasa, tipo_cambio_origen: `manual:${origen}`, tipo_cambio_justificacion: justificacion, tipo_cambio_usuario: usuario, tipo_cambio_fecha: new Date() } });
  }

  async generarObligacionDocumento(id: number, usuario: bigint) {
    return prisma.$transaction(async tx => {
      const documento = await this.documentoM5(id, tx);
      if (documento.clase !== 'definitivo' || documento.estado !== 'borrador') throw new ErrorAplicacion(409, 'Documento definitivo no disponible para generar obligación');
      if (await tx.obligacion_proveedor_m5.findUnique({ where: { id_documento_m5: id } })) throw new ErrorAplicacion(409, 'El documento ya tiene obligación');
      const proveedor = await tx.proveedor.findUniqueOrThrow({ where: { id_proveedor: documento.id_proveedor } });
      if (proveedor.estado_proveedor !== 'activo') throw new ErrorAplicacion(409, 'El proveedor no está habilitado');
      const asociaciones = await tx.asociacion_documento_oc_m5.findMany({ where: { id_documento_m5: id } });
      if (!asociaciones.length || !asociaciones.reduce((s, a) => s.plus(a.monto_asignado), new Prisma.Decimal(0)).equals(documento.monto_total)) throw new ErrorAplicacion(409, 'La asociación documental no está completa');
      if (asociaciones.some(a => a.tipo_orden === 'OCI')) throw new ErrorAplicacion(409, 'La integración OCI aún no puede validarse');
      if (asociaciones.some(a => ['pendiente','rechazado'].includes(a.estado_excedente))) throw new ErrorAplicacion(409, 'Existe un excedente sin aprobación');
      if (!documento.fecha_vencimiento) throw new ErrorAplicacion(409, 'Falta determinar vencimiento');
      const clasificaciones = await tx.clasificacion_asociacion_m5.findMany({ where: { id_asociacion_m5: { in: asociaciones.map(a => a.id_asociacion_m5) } } });
      for (const a of asociaciones) if (!clasificaciones.filter(c => c.id_asociacion_m5 === a.id_asociacion_m5).reduce((s,c) => s.plus(c.monto), new Prisma.Decimal(0)).equals(a.monto_asignado)) throw new ErrorAplicacion(409, 'La clasificación no está completa');
      if (!await tx.propuesta_imputacion_m5.findFirst({ where: { id_documento_m5: id, estado: 'confirmado' } })) throw new ErrorAplicacion(409, 'La imputación no está confirmada');
      const moneda = await tx.moneda.findUniqueOrThrow({ where: { id_moneda: documento.id_moneda } });
      if (moneda.codigo_moneda !== 'CLP' && !documento.tipo_cambio) throw new ErrorAplicacion(409, 'Se requiere referencia cambiaria confirmada');
      const condicion = calcularCondicionTemporalObligacion({ saldo_actual: documento.monto_total, fecha_vencimiento: documento.fecha_vencimiento }, await this.umbralM5(tx))!;
      const obligacion = await tx.obligacion_proveedor_m5.create({ data: { id_documento_m5: id, id_proveedor: documento.id_proveedor, monto_original: documento.monto_total, id_moneda: documento.id_moneda, saldo_inicial: documento.monto_total, saldo_actual: documento.monto_total, fecha_emision: documento.fecha_emision, fecha_vencimiento: documento.fecha_vencimiento, estado_pago: 'Pendiente', condicion_temporal: condicion, condicion_pago_dias_snapshot: documento.condicion_pago_dias_snapshot, condicion_pago_tipo_snapshot: documento.condicion_pago_tipo_snapshot, tipo_cambio: documento.tipo_cambio, tipo_cambio_origen: documento.tipo_cambio_origen, generado_por: usuario } });
      for (const asociacion of asociaciones.filter(a => a.tipo_orden === 'OCS')) {
        const orden = await tx.orden_compra_servicio_m5.findUnique({ where: { id_orden_compra_servicio_m5: asociacion.id_ocs_m5! }, include: { efectos_financieros: true } });
        if (!orden || orden.id_proveedor !== documento.id_proveedor || orden.id_moneda !== documento.id_moneda || orden.estado_ocs !== 'abierta') throw new ErrorAplicacion(409, 'La OCS cambió y ya no está disponible');
        await tx.efecto_financiero_ocs_m5.create({ data: { id_ocs_m5: orden.id_orden_compra_servicio_m5, tipo_efecto: 'documento_definitivo', referencia: `DOC-M5-${id}`, monto_documentado: asociacion.monto_asignado } });
        const total = orden.efectos_financieros.reduce((s,e) => s.plus(e.monto_documentado), asociacion.monto_asignado);
        const evaluacion = evaluarCierreOcs(orden.monto_autorizado, total, asociacion.es_documento_final, asociacion.justificacion || '');
        if (evaluacion.puedeCerrar) { await tx.orden_compra_servicio_m5.update({ where: { id_orden_compra_servicio_m5: orden.id_orden_compra_servicio_m5 }, data: { estado_ocs: 'cerrada', fecha_actualizacion: new Date() } }); await tx.historial_orden_compra_servicio_m5.create({ data: { id_ocs_m5: orden.id_orden_compra_servicio_m5, campo: 'estado', valor_anterior: 'abierta', valor_nuevo: 'cerrada', motivo: asociacion.justificacion, usuario_id_usuario: usuario } }); }
      }
      await tx.documento_proveedor_m5.update({ where: { id_documento_m5: id }, data: { estado: 'confirmado', confirmado_por: usuario, fecha_confirmacion: new Date() } });
      return { id: obligacion.id_obligacion_m5, idDocumento: id, montoOriginal: Number(obligacion.monto_original), saldoInicial: Number(obligacion.saldo_inicial), saldoActual: Number(obligacion.saldo_actual), estadoPago: obligacion.estado_pago, condicionTemporal: obligacion.condicion_temporal };
    });
  }

  private async operacionPagoM5(id: number, tx: Transaccion | typeof prisma = prisma) {
    const operacion = await tx.operacion_pago_proveedor_m5.findUnique({ where: { id_operacion_pago_m5: id } });
    if (!operacion) throw new ErrorAplicacion(404, 'Operación de pago no encontrada');
    return operacion;
  }

  private async presentarOperacionPago(id: number, tx: Transaccion | typeof prisma = prisma) {
    const operacion = await this.operacionPagoM5(id, tx);
    const movimientos = await tx.movimiento_pago_proveedor_m5.findMany({ where: { id_operacion_pago_m5: id }, orderBy: { id_movimiento_pago_m5: 'asc' } });
    const [proveedor, obligaciones, medios, monedas, asociaciones] = await Promise.all([
      tx.proveedor.findUniqueOrThrow({ where: { id_proveedor: operacion.id_proveedor } }),
      tx.obligacion_proveedor_m5.findMany({ where: { id_obligacion_m5: { in: movimientos.map(m => m.id_obligacion_m5) } } }),
      tx.medio_pago.findMany({ where: { id_medio_pago: { in: movimientos.map(m => m.id_medio_pago) } } }),
      tx.moneda.findMany({ where: { id_moneda: { in: movimientos.map(m => m.id_moneda) } } }),
      tx.asociacion_respaldo_pago_m5.findMany({ where: { OR: [{ id_operacion_pago_m5: id }, { id_movimiento_pago_m5: { in: movimientos.map(m => m.id_movimiento_pago_m5) } }] } }),
    ]);
    const total = movimientos.reduce((suma, movimiento) => suma.plus(movimiento.monto_aplicado), new Prisma.Decimal(0));
    return {
      id: operacion.id_operacion_pago_m5, estado: operacion.estado, fechaEfectivaPago: operacion.fecha_efectiva_pago,
      proveedor: { id: proveedor.id_proveedor, razonSocial: proveedor.nombre_razon_social, identificadorFiscal: proveedor.identificador_tributario, estado: proveedor.estado_proveedor },
      total: Number(total), totalConfirmado: operacion.total_confirmado === null ? null : Number(operacion.total_confirmado),
      tieneRespaldo: asociaciones.some(a => a.id_operacion_pago_m5 === id),
      movimientos: movimientos.map(movimiento => {
        const obligacion = obligaciones.find(o => o.id_obligacion_m5 === movimiento.id_obligacion_m5)!;
        const propuesto = movimientos.filter(m => m.id_obligacion_m5 === movimiento.id_obligacion_m5).reduce((suma, m) => suma.plus(m.monto_aplicado), new Prisma.Decimal(0));
        return { id: movimiento.id_movimiento_pago_m5, idObligacion: movimiento.id_obligacion_m5, idMedioPago: movimiento.id_medio_pago, medioPago: medios.find(m => m.id_medio_pago === movimiento.id_medio_pago)?.nombre_medio_pago, moneda: monedas.find(m => m.id_moneda === movimiento.id_moneda)?.codigo_moneda, montoAplicado: Number(movimiento.monto_aplicado), saldoActual: Number(obligacion.saldo_actual), conflictoSaldo: propuesto.gt(obligacion.saldo_actual), tasaReferencia: movimiento.tasa_referencia === null ? null : Number(movimiento.tasa_referencia), fuenteTasa: movimiento.fuente_tasa, tasaBancariaEfectiva: movimiento.tasa_bancaria_efectiva === null ? null : Number(movimiento.tasa_bancaria_efectiva), equivalenteClp: movimiento.equivalente_clp === null ? null : Number(movimiento.equivalente_clp), tasaManual: movimiento.tasa_manual, estado: movimiento.estado, tieneRespaldo: asociaciones.some(a => a.id_movimiento_pago_m5 === movimiento.id_movimiento_pago_m5) };
      }),
      creadoPor: operacion.creado_por.toString(), fechaCreacion: operacion.fecha_creacion, preparadoPor: operacion.preparado_por?.toString() || null, fechaPreparacion: operacion.fecha_preparacion, confirmadoPor: operacion.confirmado_por?.toString() || null, fechaConfirmacion: operacion.fecha_confirmacion,
    };
  }

  async buscarProveedoresParaPago(consulta: Record<string, unknown>) {
    const busqueda = texto(consulta.busqueda, 120);
    const proveedores = await prisma.proveedor.findMany({
      where: { estado_proveedor: 'activo', OR: busqueda ? [{ nombre_razon_social: { contains: busqueda, mode: 'insensitive' } }, { identificador_tributario: { contains: busqueda, mode: 'insensitive' } }] : undefined },
      orderBy: [{ nombre_razon_social: 'asc' }, { id_proveedor: 'asc' }],
    });
    const obligaciones = await prisma.obligacion_proveedor_m5.findMany({ where: { id_proveedor: { in: proveedores.map(p => p.id_proveedor) }, saldo_actual: { gt: 0 } }, orderBy: [{ fecha_vencimiento: 'asc' }, { id_obligacion_m5: 'asc' }] });
    const monedas = await prisma.moneda.findMany({ where: { id_moneda: { in: obligaciones.map(o => o.id_moneda) } } });
    return proveedores.map(proveedor => ({ id: proveedor.id_proveedor, razonSocial: proveedor.nombre_razon_social, identificadorFiscal: proveedor.identificador_tributario, obligaciones: obligaciones.filter(o => o.id_proveedor === proveedor.id_proveedor).map(o => ({ id: o.id_obligacion_m5, moneda: monedas.find(m => m.id_moneda === o.id_moneda)?.codigo_moneda, saldoActual: Number(o.saldo_actual), montoOriginal: Number(o.monto_original), fechaVencimiento: o.fecha_vencimiento })) })).filter(proveedor => proveedor.obligaciones.length > 0);
  }

  async catalogosPagosProveedores() {
    const [medios, monedas] = await Promise.all([prisma.medio_pago.findMany({ where: { estado_medio_pago: 'activo' }, orderBy: { nombre_medio_pago: 'asc' } }), prisma.moneda.findMany({ where: { estado_moneda: 'activo' }, orderBy: { codigo_moneda: 'asc' } })]);
    return { medios: medios.map(m => ({ id: m.id_medio_pago, nombre: m.nombre_medio_pago })), monedas: monedas.map(m => ({ id: m.id_moneda, codigo: m.codigo_moneda, simbolo: m.simbolo_moneda })) };
  }

  async crearOperacionPago(entrada: Entrada, usuario: bigint) {
    const idProveedor = identificador(valorEntrada(entrada, 'idProveedor', 'id_proveedor'));
    const proveedor = await prisma.proveedor.findUnique({ where: { id_proveedor: idProveedor } });
    if (!proveedor || proveedor.estado_proveedor !== 'activo') throw new ErrorAplicacion(409, 'El proveedor no está habilitado para iniciar pagos');
    if (!await prisma.obligacion_proveedor_m5.findFirst({ where: { id_proveedor: idProveedor, saldo_actual: { gt: 0 } } })) throw new ErrorAplicacion(409, 'El proveedor no tiene obligaciones pendientes');
    const fecha = valorEntrada(entrada, 'fechaEfectivaPago', 'fecha_pago');
    return this.presentarOperacionPago((await prisma.operacion_pago_proveedor_m5.create({ data: { id_proveedor: idProveedor, creado_por: usuario, fecha_efectiva_pago: fecha ? fechaEntrada(fecha, 'Fecha efectiva de pago') : null } })).id_operacion_pago_m5);
  }

  async listarBorradoresPago() {
    const operaciones = await prisma.operacion_pago_proveedor_m5.findMany({ where: { estado: { in: ['borrador','preparada'] } }, orderBy: [{ fecha_creacion: 'desc' }, { id_operacion_pago_m5: 'desc' }] });
    return Promise.all(operaciones.map(operacion => this.presentarOperacionPago(operacion.id_operacion_pago_m5)));
  }

  async obtenerOperacionPago(id: number) { return this.presentarOperacionPago(id); }

  private async datosMovimientoPago(idOperacion: number, entrada: Entrada, excluir?: number) {
    const operacion = await this.operacionPagoM5(idOperacion);
    if (operacion.estado !== 'borrador') throw new ErrorAplicacion(409, 'Sólo se editan operaciones en borrador');
    const idObligacion = identificador(valorEntrada(entrada, 'idObligacion', 'id_obligacion_m5'));
    const idMedio = identificador(valorEntrada(entrada, 'idMedioPago', 'id_medio_pago'));
    const monto = montoPositivo(valorEntrada(entrada, 'montoAplicado', 'monto'));
    const [obligacion, medio, moneda, movimientos] = await Promise.all([
      prisma.obligacion_proveedor_m5.findUnique({ where: { id_obligacion_m5: idObligacion } }), prisma.medio_pago.findUnique({ where: { id_medio_pago: idMedio } }),
      prisma.obligacion_proveedor_m5.findUnique({ where: { id_obligacion_m5: idObligacion } }).then(o => o ? prisma.moneda.findUnique({ where: { id_moneda: o.id_moneda } }) : null),
      prisma.movimiento_pago_proveedor_m5.findMany({ where: { id_operacion_pago_m5: idOperacion, id_obligacion_m5: idObligacion, id_movimiento_pago_m5: excluir ? { not: excluir } : undefined } }),
    ]);
    if (!obligacion || obligacion.id_proveedor !== operacion.id_proveedor || obligacion.saldo_actual.lte(0)) throw new ErrorAplicacion(409, 'La obligación no es elegible para este proveedor');
    if (!medio || medio.estado_medio_pago !== 'activo') throw new ErrorAplicacion(409, 'Selecciona un medio de pago activo');
    if (movimientos.reduce((suma, actual) => suma.plus(actual.monto_aplicado), monto).gt(obligacion.saldo_actual)) throw new ErrorAplicacion(409, 'La suma de movimientos supera el saldo actual de la obligación');
    const tasaBancariaEntrada = valorEntrada(entrada, 'tasaBancariaEfectiva', 'tasa_bancaria_efectiva');
    const tasaBancaria = tasaBancariaEntrada === undefined || tasaBancariaEntrada === null || tasaBancariaEntrada === '' ? null : montoPositivo(tasaBancariaEntrada);
    let tasaReferencia: Prisma.Decimal | null = null; let fuenteTasa: string | null = null;
    if (moneda?.codigo_moneda !== 'CLP' && operacion.fecha_efectiva_pago) {
      try { tasaReferencia = new Prisma.Decimal(await this.bancoCentral.obtenerTipoCambio(moneda!.codigo_moneda, fechaRegistro(operacion.fecha_efectiva_pago))); fuenteTasa = 'C_BancoCentral'; } catch (error) { if (!(error instanceof ErrorAplicacion)) throw error; }
    }
    const tasaClp = tasaBancaria || tasaReferencia;
    return { id_operacion_pago_m5: idOperacion, id_obligacion_m5: idObligacion, id_medio_pago: idMedio, id_moneda: obligacion.id_moneda, monto_aplicado: monto, tasa_referencia: tasaReferencia, fuente_tasa: fuenteTasa, fecha_tasa: tasaReferencia ? operacion.fecha_efectiva_pago : null, tasa_bancaria_efectiva: tasaBancaria, equivalente_clp: moneda?.codigo_moneda === 'CLP' ? monto : tasaClp ? monto.mul(tasaClp).toDecimalPlaces(2) : null };
  }

  async agregarMovimientoPago(idOperacion: number, entrada: Entrada) {
    const datos = await this.datosMovimientoPago(idOperacion, entrada);
    const movimiento = await prisma.movimiento_pago_proveedor_m5.create({ data: datos });
    return this.presentarOperacionPago(movimiento.id_operacion_pago_m5);
  }

  async actualizarMovimientoPago(idOperacion: number, idMovimiento: number, entrada: Entrada) {
    const actual = await prisma.movimiento_pago_proveedor_m5.findFirst({ where: { id_movimiento_pago_m5: idMovimiento, id_operacion_pago_m5: idOperacion } });
    if (!actual) throw new ErrorAplicacion(404, 'Movimiento no encontrado');
    const datos = await this.datosMovimientoPago(idOperacion, entrada, idMovimiento);
    await prisma.movimiento_pago_proveedor_m5.update({ where: { id_movimiento_pago_m5: idMovimiento }, data: { ...datos, tasa_manual: false, tasa_manual_justificacion: null, tasa_manual_usuario: null, tasa_manual_fecha: null } });
    return this.presentarOperacionPago(idOperacion);
  }

  async adjuntarRespaldoPago(idOperacion: number, entrada: Entrada, usuario: bigint) {
    const operacion = await this.operacionPagoM5(idOperacion);
    if (operacion.estado !== 'borrador') throw new ErrorAplicacion(409, 'Sólo se adjuntan respaldos a un borrador');
    const nombre = texto(valorEntrada(entrada, 'nombreArchivo', 'nombre'), 255); const contenido = texto(entrada.contenido, 4500000);
    if (!nombre || !contenido) throw new ErrorAplicacion(400, 'Nombre y contenido del respaldo son obligatorios');
    const ids = Array.isArray(entrada.movimientos) ? entrada.movimientos.map(identificador) : [];
    const movimientos = await prisma.movimiento_pago_proveedor_m5.findMany({ where: { id_movimiento_pago_m5: { in: ids }, id_operacion_pago_m5: idOperacion } });
    if (movimientos.length !== new Set(ids).size) throw new ErrorAplicacion(400, 'Uno de los movimientos no pertenece a la operación');
    const asociarOperacion = entrada.operacion !== false;
    if (!asociarOperacion && !ids.length) throw new ErrorAplicacion(400, 'Selecciona la operación o al menos un movimiento');
    await prisma.$transaction(async tx => {
      const respaldo = await tx.respaldo_pago_proveedor_m5.create({ data: { nombre_archivo: nombre, contenido, creado_por: usuario } });
      await tx.asociacion_respaldo_pago_m5.createMany({ data: [...(asociarOperacion ? [{ id_respaldo_pago_m5: respaldo.id_respaldo_pago_m5, id_operacion_pago_m5: idOperacion }] : []), ...ids.map(id => ({ id_respaldo_pago_m5: respaldo.id_respaldo_pago_m5, id_movimiento_pago_m5: id }))] });
    });
    return this.presentarOperacionPago(idOperacion);
  }

  async registrarTipoCambioManualPago(idOperacion: number, idMovimiento: number, entrada: Entrada, usuario: bigint, perfil: string) {
    if (!['gerencia','contador'].includes(perfil)) throw new ErrorAplicacion(403, 'Sólo Gerencia o Contador pueden ingresar una tasa manual');
    const operacion = await this.operacionPagoM5(idOperacion); if (operacion.estado !== 'borrador') throw new ErrorAplicacion(409, 'La operación ya no admite cambios');
    const movimiento = await prisma.movimiento_pago_proveedor_m5.findFirst({ where: { id_movimiento_pago_m5: idMovimiento, id_operacion_pago_m5: idOperacion } });
    if (!movimiento) throw new ErrorAplicacion(404, 'Movimiento no encontrado');
    const moneda = await prisma.moneda.findUniqueOrThrow({ where: { id_moneda: movimiento.id_moneda } }); if (moneda.codigo_moneda === 'CLP') throw new ErrorAplicacion(400, 'CLP no requiere tipo de cambio');
    const tasa = montoPositivo(valorEntrada(entrada, 'tasaReferencia', 'tasa')); const justificacion = motivoObligatorio(entrada.justificacion);
    const bancariaEntrada = valorEntrada(entrada, 'tasaBancariaEfectiva', 'tasa_bancaria_efectiva'); const bancaria = bancariaEntrada === undefined || bancariaEntrada === null || bancariaEntrada === '' ? null : montoPositivo(bancariaEntrada);
    await prisma.movimiento_pago_proveedor_m5.update({ where: { id_movimiento_pago_m5: idMovimiento }, data: { tasa_referencia: tasa, fuente_tasa: 'manual', fecha_tasa: operacion.fecha_efectiva_pago, tasa_manual: true, tasa_manual_justificacion: justificacion, tasa_manual_usuario: usuario, tasa_manual_fecha: new Date(), tasa_bancaria_efectiva: bancaria, equivalente_clp: movimiento.monto_aplicado.mul(bancaria || tasa).toDecimalPlaces(2) } });
    return this.presentarOperacionPago(idOperacion);
  }

  private async validarOperacionPago(tx: Transaccion, idOperacion: number) {
    const operacion = await this.operacionPagoM5(idOperacion, tx);
    if (!['borrador','preparada'].includes(operacion.estado)) throw new ErrorAplicacion(409, 'La operación ya no está disponible');
    if (!operacion.fecha_efectiva_pago) throw new ErrorAplicacion(409, 'Falta la fecha efectiva de pago');
    const proveedor = await tx.proveedor.findUnique({ where: { id_proveedor: operacion.id_proveedor } }); if (!proveedor || proveedor.estado_proveedor !== 'activo') throw new ErrorAplicacion(409, 'El proveedor ya no está habilitado');
    const movimientos = await tx.movimiento_pago_proveedor_m5.findMany({ where: { id_operacion_pago_m5: idOperacion } }); if (!movimientos.length) throw new ErrorAplicacion(409, 'La operación requiere al menos un movimiento');
    const [obligaciones, medios, monedas, respaldos] = await Promise.all([tx.obligacion_proveedor_m5.findMany({ where: { id_obligacion_m5: { in: movimientos.map(m => m.id_obligacion_m5) } } }), tx.medio_pago.findMany({ where: { id_medio_pago: { in: movimientos.map(m => m.id_medio_pago) } } }), tx.moneda.findMany({ where: { id_moneda: { in: movimientos.map(m => m.id_moneda) } } }), tx.asociacion_respaldo_pago_m5.findMany({ where: { OR: [{ id_operacion_pago_m5: idOperacion }, { id_movimiento_pago_m5: { in: movimientos.map(m => m.id_movimiento_pago_m5) } }] } })]);
    if (!respaldos.some(r => r.id_operacion_pago_m5 === idOperacion)) throw new ErrorAplicacion(409, 'La operación requiere respaldo');
    for (const movimiento of movimientos) {
      const obligacion = obligaciones.find(o => o.id_obligacion_m5 === movimiento.id_obligacion_m5); const medio = medios.find(m => m.id_medio_pago === movimiento.id_medio_pago); const moneda = monedas.find(m => m.id_moneda === movimiento.id_moneda);
      if (!obligacion || obligacion.id_proveedor !== operacion.id_proveedor || obligacion.saldo_actual.lte(0)) throw new ErrorAplicacion(409, 'Una obligación ya no está disponible');
      if (!medio || medio.estado_medio_pago !== 'activo') throw new ErrorAplicacion(409, 'Un medio de pago ya no está activo');
      if (!respaldos.some(r => r.id_movimiento_pago_m5 === movimiento.id_movimiento_pago_m5)) throw new ErrorAplicacion(409, 'Todos los movimientos requieren respaldo');
      if (moneda?.codigo_moneda !== 'CLP' && (!movimiento.tasa_referencia || !movimiento.equivalente_clp)) throw new ErrorAplicacion(409, 'Falta resolver la tasa de un movimiento en moneda extranjera');
    }
    const porObligacion = new Map<number, Prisma.Decimal>(); for (const movimiento of movimientos) porObligacion.set(movimiento.id_obligacion_m5, (porObligacion.get(movimiento.id_obligacion_m5) || new Prisma.Decimal(0)).plus(movimiento.monto_aplicado));
    for (const [id, monto] of porObligacion) if (monto.gt(obligaciones.find(o => o.id_obligacion_m5 === id)!.saldo_actual)) throw new ErrorAplicacion(409, 'La operación supera el saldo actual de una obligación');
    return { operacion, movimientos, obligaciones, porObligacion, total: movimientos.reduce((suma, m) => suma.plus(m.monto_aplicado), new Prisma.Decimal(0)) };
  }

  async prepararOperacionPago(id: number, usuario: bigint) {
    await prisma.$transaction(async tx => { await this.validarOperacionPago(tx, id); await tx.operacion_pago_proveedor_m5.update({ where: { id_operacion_pago_m5: id }, data: { estado: 'preparada', preparado_por: usuario, fecha_preparacion: new Date() } }); });
    return this.presentarOperacionPago(id);
  }

  async guardarBorradorPago(id: number, entrada: Entrada) {
    const operacion = await this.operacionPagoM5(id); if (operacion.estado !== 'borrador') throw new ErrorAplicacion(409, 'Sólo se guarda una operación en borrador');
    const fecha = valorEntrada(entrada, 'fechaEfectivaPago', 'fecha_pago');
    if (fecha !== undefined) {
      const nuevaFecha = fecha ? fechaEntrada(fecha, 'Fecha efectiva de pago') : null;
      await prisma.operacion_pago_proveedor_m5.update({ where: { id_operacion_pago_m5: id }, data: { fecha_efectiva_pago: nuevaFecha } });
      if (nuevaFecha && fechaRegistro(nuevaFecha) !== (operacion.fecha_efectiva_pago ? fechaRegistro(operacion.fecha_efectiva_pago) : null)) {
        const movimientos = await prisma.movimiento_pago_proveedor_m5.findMany({ where: { id_operacion_pago_m5: id } }); const monedas = await prisma.moneda.findMany({ where: { id_moneda: { in: movimientos.map(m => m.id_moneda) } } });
        for (const movimiento of movimientos.filter(m => monedas.find(moneda => moneda.id_moneda === m.id_moneda)?.codigo_moneda !== 'CLP')) {
          try { const tasa = new Prisma.Decimal(await this.bancoCentral.obtenerTipoCambio(monedas.find(moneda => moneda.id_moneda === movimiento.id_moneda)!.codigo_moneda, fechaRegistro(nuevaFecha))); await prisma.movimiento_pago_proveedor_m5.update({ where: { id_movimiento_pago_m5: movimiento.id_movimiento_pago_m5 }, data: { tasa_referencia: tasa, fuente_tasa: 'C_BancoCentral', fecha_tasa: nuevaFecha, tasa_manual: false, tasa_manual_justificacion: null, tasa_manual_usuario: null, tasa_manual_fecha: null, tasa_bancaria_efectiva: null, equivalente_clp: movimiento.monto_aplicado.mul(tasa).toDecimalPlaces(2) } }); }
          catch (error) { if (!(error instanceof ErrorAplicacion)) throw error; await prisma.movimiento_pago_proveedor_m5.update({ where: { id_movimiento_pago_m5: movimiento.id_movimiento_pago_m5 }, data: { tasa_referencia: null, fuente_tasa: null, fecha_tasa: null, tasa_manual: false, tasa_manual_justificacion: null, tasa_manual_usuario: null, tasa_manual_fecha: null, tasa_bancaria_efectiva: null, equivalente_clp: null } }); }
        }
      }
    }
    return this.presentarOperacionPago(id);
  }

  async retomarOperacionPago(id: number) { const operacion = await this.operacionPagoM5(id); if (operacion.estado !== 'borrador') throw new ErrorAplicacion(409, 'Sólo se retoman operaciones en borrador'); return this.presentarOperacionPago(id); }

  async descartarOperacionPago(id: number, usuario: bigint) {
    const operacion = await this.operacionPagoM5(id); if (operacion.estado !== 'borrador') throw new ErrorAplicacion(409, 'Sólo se descartan operaciones en borrador');
    await prisma.operacion_pago_proveedor_m5.update({ where: { id_operacion_pago_m5: id }, data: { estado: 'descartada', descartado_por: usuario, fecha_descarte: new Date() } }); return this.presentarOperacionPago(id);
  }

  async confirmarOperacionPago(id: number, usuario: bigint) {
    try {
      await prisma.$transaction(async tx => {
        const validacion = await this.validarOperacionPago(tx, id); if (validacion.operacion.estado !== 'preparada') throw new ErrorAplicacion(409, 'La operación debe estar preparada antes de confirmar');
        for (const [idObligacion, monto] of validacion.porObligacion) {
          const resultado = await tx.obligacion_proveedor_m5.updateMany({ where: { id_obligacion_m5: idObligacion, saldo_actual: { gte: monto } }, data: { saldo_actual: { decrement: monto } } });
          if (resultado.count !== 1) throw new ErrorAplicacion(409, 'El saldo cambió y la operación completa debe revisarse');
          const obligacion = await tx.obligacion_proveedor_m5.findUniqueOrThrow({ where: { id_obligacion_m5: idObligacion } }); const estado = calcularEstadoPagoObligacion(obligacion.saldo_inicial, obligacion.saldo_actual); const condicion = calcularCondicionTemporalObligacion(obligacion, await this.umbralM5(tx));
          await tx.obligacion_proveedor_m5.update({ where: { id_obligacion_m5: idObligacion }, data: { estado_pago: estado, ...(condicion ? { condicion_temporal: condicion } : {}) } });
        }
        await tx.movimiento_pago_proveedor_m5.updateMany({ where: { id_operacion_pago_m5: id }, data: { estado: 'Vigente' } });
        await tx.operacion_pago_proveedor_m5.update({ where: { id_operacion_pago_m5: id }, data: { estado: 'confirmada', confirmado_por: usuario, fecha_confirmacion: new Date(), total_confirmado: validacion.total } });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) { if (error instanceof ErrorAplicacion) throw error; if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') throw new ErrorAplicacion(409, 'Conflicto concurrente: vuelve a revisar los saldos'); throw error; }
    return this.presentarOperacionPago(id);
  }

  async catalogosDocumentosProveedor() {
    const [proveedores, tipos, monedas, categorias, ordenes, proyectos, ots] = await Promise.all([
      prisma.proveedor.findMany({ where: { estado_proveedor: 'activo' }, orderBy: { nombre_razon_social: 'asc' } }), prisma.tipo_documento.findMany({ orderBy: { nombre_tipo_documento: 'asc' } }), prisma.moneda.findMany({ where: { estado_moneda: 'activo' } }), prisma.categoria_egreso_m5.findMany({ where: { activo: true }, orderBy: { nombre: 'asc' } }), prisma.orden_compra_servicio_m5.findMany({ where: { estado_ocs: 'abierta', id_moneda: { not: null } } }), prisma.proyecto.findMany({ where: { proyecto_estado_operacional: 'activo' } }), prisma.orden_trabajo.findMany(),
    ]);
    return { proveedores: proveedores.map(p => ({ id: p.id_proveedor, nombre: p.nombre_razon_social })), tipos: tipos.map(t => ({ id: t.id_tipo_documento, nombre: t.nombre_tipo_documento })), monedas: monedas.map(m => ({ id: m.id_moneda, codigo: m.codigo_moneda })), categorias, ordenes: ordenes.map(o => ({ id: o.id_orden_compra_servicio_m5, idProveedor: o.id_proveedor, idMoneda: o.id_moneda, monto: Number(o.monto_autorizado), referencia: o.referencia })), proyectos: proyectos.map(p => ({ id: p.proyecto_proyecto_id.toString(), nombre: p.proyecto_nombre_referencia || p.proyecto_codigo_proyecto || p.proyecto_proyecto_id.toString() })), ordenesTrabajo: ots.map(o => ({ id: o.orden_trabajo_id_orden.toString(), idProyecto: o.proyecto_id_proyecto?.toString() || null })) };
  }

  async listarDocumentosProveedor(consulta: Record<string, unknown>) {
    const idProveedor = consulta.idProveedor === undefined && consulta.proveedor === undefined ? undefined : identificador(valorEntrada(consulta, 'idProveedor', 'proveedor'));
    const busqueda = texto(valorEntrada(consulta, 'busqueda', 'numero'), 100);
    const estado = texto(consulta.estado, 30);
    const documentos = await prisma.documento_compra_proveedor.findMany({
      where: {
        id_proveedor: idProveedor,
        numero_documento: busqueda ? { contains: busqueda, mode: 'insensitive' } : undefined,
        estado_documento: estado ? { equals: estado, mode: 'insensitive' } : undefined,
      },
      include: { ...incluirDocumentos, proveedor: true },
      orderBy: [{ fecha_emision: 'desc' }, { id_documento_compra_proveedor: 'desc' }],
    });
    const m5 = await prisma.documento_proveedor_m5.findMany({ where: { id_proveedor: idProveedor, folio: busqueda ? { contains: busqueda, mode: 'insensitive' } : undefined, estado: estado ? { equals: estado, mode: 'insensitive' } : undefined }, orderBy: [{ fecha_emision: 'desc' }, { id_documento_m5: 'desc' }] });
    return [...await Promise.all(m5.map(documento => this.presentarDocumentoM5(documento))), ...documentos.map(documento => this.presentarDocumentoProveedor(documento))].sort((a,b) => new Date(b.fechaEmision).getTime() - new Date(a.fechaEmision).getTime());
  }

  async obtenerDocumentoProveedor(referencia: number | string) {
    const valor = String(referencia);
    if (valor.startsWith('m5-')) return this.presentarDocumentoM5(await this.documentoM5(identificador(valor.slice(3))));
    const id = valor.startsWith('legacy-') ? identificador(valor.slice(7)) : identificador(valor);
    const documento = await prisma.documento_compra_proveedor.findUnique({ where: { id_documento_compra_proveedor: id }, include: { ...incluirDocumentos, proveedor: true } });
    if (!documento) throw new ErrorAplicacion(404, 'Documento de proveedor no encontrado');
    return this.presentarDocumentoProveedor(documento);
  }
}
