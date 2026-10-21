import { prepararPago } from '../utilidades/pago';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { formalizarProyectoCotizacion, validarCoherenciaContextualM12 } from '../comercial/ServicioObraProyectoComercial';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { calcularNota, consolidarNotasClp, estadoVisibleNota, fechaNegocio, incluirCotizacion, incluirNota, resumirNotas } from '../utilidades/finanzas';
import { identificador, numeroNoNegativo, texto } from '../validaciones/solicitudes';
import { BancoCentral, C_BancoCentral } from '../utilidades/C_BancoCentral';
import { registrarCompromisoCredito, validarCreditoParaFormalizacion } from '../utilidades/creditoM8';
import { validarYNormalizarRut, variantesRut } from '../utilidades/rut';
import { normalizarUbicacion, resolverCoberturaDesdeTarifas, type SegmentoComercial, type TarifaResoluble } from '../comercial/contratosCatalogoComercial';
import { exigirCotejoAcreditadoM11, prepararCorrespondenciasTecnicasM11, prepararTrazabilidadOrdenCompraM11, validarCondicionesEconomicasOfertaM11 } from '../comercial/ServicioTrazabilidadComercialM11';
import { ServicioDocumentalM11 } from '../comercial/ServicioDocumentalM11';

type Entrada = Record<string, any>; // viene del contrato HTTP antiguo; los datos se validan antes de guardar
const ESTADOS_FAMILIA_COMERCIAL = ['ACTIVA', 'INACTIVA'] as const;
const ESTADOS_PRODUCTO_COMERCIAL = ['BORRADOR', 'VINCULADO', 'INACTIVO'] as const;
const ESTADOS_TAREA_FABRICACION = ['ACTIVA', 'INACTIVA'] as const;
const CAMPOS_TECNICOS_PRODUCTO = ['tipoEstructura','materialesPrincipales','revestimientos','terminaciones','cerradurasCompatibles','caracteristicasSeguridad','dimensionesReferenciales','requisitosTecnicos','opcionales','observacionesTecnicas'] as const;
const CAMPOS_MEDIDAS_RECTIFICACION = ['marcoAncho','marcoAlto','marcoEspesor','vanoVerticalAncho','vanoVerticalAlto','vanoVerticalEspesor','vanoHorizontalAncho','vanoHorizontalAlto','vanoHorizontalEspesor','alojamientoVerticalAlto','alojamientoVerticalAncho','alojamientoVerticalEspesor','alojamientoHorizontalAlto','alojamientoHorizontalAncho','alojamientoHorizontalEspesor','alojamientoVertical','medidaMarcoAncho','medidaMarcoAlto','medidaMarcoEspesor'] as const;
const MEDIDAS_OBLIGATORIAS_HEREDADAS = ['marcoAncho','marcoAlto'] as const;

const codigoCatalogo = (valor: unknown, maximo: number, nombre: string) => {
  const codigo = texto(valor, maximo).toLocaleUpperCase('es-CL');
  if (!new RegExp(`^[A-Z0-9][A-Z0-9._-]{1,${maximo - 1}}$`).test(codigo)) throw new ErrorAplicacion(400, `${nombre} debe usar letras, números, punto, guion o guion bajo`);
  return codigo;
};
const motivoObligatorio = (valor: unknown) => {
  const motivo = texto(valor, 2000);
  if (!motivo) throw new ErrorAplicacion(400, 'El motivo es obligatorio');
  return motivo;
};
const revisionEntrada = (valor: unknown) => {
  const revision = identificador(valor);
  return revision;
};
const caracteristicasTecnicas = (valor: unknown): Prisma.InputJsonObject => {
  if (valor === undefined || valor === null) return {};
  if (typeof valor !== 'object' || Array.isArray(valor)) throw new ErrorAplicacion(400, 'Las características técnicas deben ser un objeto');
  const entrada = valor as Record<string, unknown>;
  if (Object.keys(entrada).some(campo => !CAMPOS_TECNICOS_PRODUCTO.includes(campo as typeof CAMPOS_TECNICOS_PRODUCTO[number]))) throw new ErrorAplicacion(400, 'Existe una característica técnica no admitida');
  const salida: Record<string, string> = {};
  for (const campo of CAMPOS_TECNICOS_PRODUCTO) {
    const contenido = entrada[campo];
    if (contenido === undefined || contenido === null || contenido === '') continue;
    if (typeof contenido !== 'string' || contenido.length > 4000) throw new ErrorAplicacion(400, `La característica ${campo} no es válida`);
    salida[campo] = contenido.trim();
  }
  return salida as Prisma.InputJsonObject;
};
const caracteristicasDestacadas = (valor: unknown): Prisma.InputJsonArray => {
  if (valor === undefined || valor === null) return [];
  if (!Array.isArray(valor) || valor.length > 20) throw new ErrorAplicacion(400, 'Las características destacadas deben ser una lista de hasta 20 elementos');
  return valor.map(item => {
    if (typeof item !== 'string' || !item.trim() || item.length > 250) throw new ErrorAplicacion(400, 'Característica destacada inválida');
    return item.trim();
  });
};
const fechaComercial = (valor: unknown) => {
  const fecha = texto(valor, 20);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || !Number.isFinite(Date.parse(`${fecha}T00:00:00Z`))) throw new ErrorAplicacion(400, 'Fecha de vigencia inválida');
  return new Date(`${fecha}T00:00:00Z`);
};
const minutosOpcionales = (valor: unknown, nombre = 'Tiempo estimado') => {
  if (valor === undefined || valor === null || valor === '') return null;
  const minutos = Number(valor);
  if (!Number.isInteger(minutos) || minutos <= 0 || minutos > 525600) throw new ErrorAplicacion(400, `${nombre} debe ser un número entero mayor a cero`);
  return minutos;
};
const idEdicion = (valor: unknown) => typeof valor === 'string' && /^[0-9a-f-]{36}$/i.test(valor) ? valor : randomUUID();

type TareaEtapaFabricacion = {
  id: string;
  idTareaFabricacion: number | null;
  nombre: string;
  descripcion: string | null;
  instrucciones: string | null;
  tiempoEstimadoMin: number | null;
};
type EtapaFabricacion = {
  id: string;
  orden: number;
  idAreaTrabajo: string;
  nombreArea: string;
  nombre: string;
  descripcion: string | null;
  instrucciones: string | null;
  tiempoEstimadoMin: number | null;
  tareas: TareaEtapaFabricacion[];
};
type PlanUnidadCotizada = {
  idDetalleCotizacion: number;
  numeroUnidad: number;
  idProductoComercial: number;
  idFamiliaProducto: number;
  idVersionPlantilla: number;
  producto: string;
  familia: string;
  etapas: Entrada[];
};
const auditableM9 = <T extends object>(resultado: T, anterior?: Prisma.InputJsonValue, nuevo?: Prisma.InputJsonValue) => {
  Object.defineProperty(resultado, '__auditoriaM9', { enumerable: false, value: { anterior, nuevo } });
  return resultado;
};
async function resolverObraContexto(tx: Prisma.TransactionClient, valor: unknown, anterior: bigint | null = null, motivoCambio?: unknown) {
  if (valor === undefined) return anterior;
  if (valor === null || valor === '') return null;
  const idObra = BigInt(identificador(valor));
  const obra = await tx.obra.findUnique({ where: { obra_obra_id: idObra } });
  if (!obra) throw new ErrorAplicacion(400, 'La Obra seleccionada no existe');
  if (['inactiva', 'cerrada', 'eliminada'].includes(String(obra.obra_estado).toLowerCase())) throw new ErrorAplicacion(409, 'La Obra seleccionada no admite nuevas vinculaciones');
  if (anterior && anterior !== idObra && !texto(motivoCambio, 2000)) throw new ErrorAplicacion(400, 'Cambiar la Obra de un borrador requiere motivo y revisión humana');
  return idObra;
}
function importes(base: Prisma.Decimal, tipo: unknown, valor: unknown, exento: unknown) {
  if (typeof exento !== 'boolean') throw new ErrorAplicacion(400, 'Indica IVA o exención');
  const descuento = new Prisma.Decimal(numeroNoNegativo(valor ?? 0, 'Descuento'));
  if (tipo && !['porcentaje', 'monto_fijo', 'fijo'].includes(String(tipo))) throw new ErrorAplicacion(400, 'Tipo de descuento inválido');
  if ((tipo === 'porcentaje' && descuento.gt(100)) || (tipo !== 'porcentaje' && descuento.gt(base))) throw new ErrorAplicacion(400, 'Descuento fuera de límites');
  const montoDescuento = !tipo ? new Prisma.Decimal(0) : tipo === 'porcentaje' ? base.mul(descuento).div(100) : descuento;
  const neto = base.minus(montoDescuento).toDecimalPlaces(2);
  const impuesto = exento ? new Prisma.Decimal(0) : neto.mul('0.19').toDecimalPlaces(2);
  return { neto, impuesto, total: neto.plus(impuesto), descuento: montoDescuento.toDecimalPlaces(2) };
}

const CORREO_COMERCIAL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
async function sincronizarContactosB2B(tx: Prisma.TransactionClient, idCotizacion: number, entrada: Entrada, segmento: SegmentoComercial|null, actorId?: bigint) {
  if (entrada.contactos_b2b === undefined) return;
  if (segmento !== 'B2B') {
    if (Array.isArray(entrada.contactos_b2b) && entrada.contactos_b2b.length === 0) return;
    throw new ErrorAplicacion(409, 'Sólo una cotización B2B puede guardar contactos propios');
  }
  if (!actorId) throw new ErrorAplicacion(401, 'Los contactos de la cotización requieren un actor autenticado');
  if (!Array.isArray(entrada.contactos_b2b) || entrada.contactos_b2b.length > 20) throw new ErrorAplicacion(400, 'Los contactos B2B deben ser una lista de hasta 20 registros');
  const permitirIncompleto = entrada.permitir_borrador_incompleto === true;
  if (!permitirIncompleto && !entrada.contactos_b2b.length) throw new ErrorAplicacion(400, 'La cotización B2B requiere al menos un contacto propio');
  const principales = entrada.contactos_b2b.filter((item:Entrada) => item.es_principal === true).length;
  if (entrada.contactos_b2b.length && principales !== 1) throw new ErrorAplicacion(400, 'Debe existir exactamente un contacto principal');
  const existentes = await tx.contacto_cotizacion_b2b.findMany({ where:{ id_cotizacion:idCotizacion } });
  const idsExistentes = new Map(existentes.map(item => [item.id_contacto_cotizacion_b2b.toString(),item]));
  const conservados = new Set<string>();
  for (const item of entrada.contactos_b2b as Entrada[]) {
    const nombre = texto(item.nombre,120); const correo = texto(item.correo,254).toLowerCase(); const telefono = texto(item.telefono,40);
    if (!nombre || (!correo && !telefono)) throw new ErrorAplicacion(400, 'Cada contacto debe incluir nombre y correo o teléfono');
    if (correo && !CORREO_COMERCIAL.test(correo)) throw new ErrorAplicacion(400, 'El correo de contacto no es válido');
    const tipo = texto(item.tipo_contacto || 'COMERCIAL',30).toUpperCase();
    if (!['COMERCIAL','TECNICO','OBRA','FACTURACION','OTRO'].includes(tipo)) throw new ErrorAplicacion(400, 'Tipo de contacto no válido');
    const id = item.id_contacto_cotizacion_b2b ? BigInt(identificador(item.id_contacto_cotizacion_b2b)) : null;
    const actual = id ? idsExistentes.get(id.toString()) : undefined;
    if (id && !actual) throw new ErrorAplicacion(409, 'El contacto no pertenece a esta cotización');
    if (actual && item.revision !== undefined && identificador(item.revision) !== actual.revision) throw new ErrorAplicacion(409, 'El contacto fue modificado por otra sesión');
    const datos = { nombre, apellido:texto(item.apellido,120)||null, cargo:texto(item.cargo,120)||null, empresa_relacionada:texto(item.empresa_relacionada,200)||null, correo:correo||null, telefono:telefono||null, tipo_contacto:tipo, es_principal:item.es_principal===true, observaciones:texto(item.observaciones,2000)||null, estado:'ACTIVO' };
    const guardado = actual
      ? await tx.contacto_cotizacion_b2b.update({ where:{id_contacto_cotizacion_b2b:actual.id_contacto_cotizacion_b2b}, data:{...datos,revision:{increment:1},actualizado_en:new Date()} })
      : await tx.contacto_cotizacion_b2b.create({ data:{...datos,id_cotizacion:idCotizacion,creado_por:actorId} });
    conservados.add(guardado.id_contacto_cotizacion_b2b.toString());
  }
  for (const anterior of existentes) if (anterior.estado==='ACTIVO' && !conservados.has(anterior.id_contacto_cotizacion_b2b.toString())) await tx.contacto_cotizacion_b2b.update({ where:{id_contacto_cotizacion_b2b:anterior.id_contacto_cotizacion_b2b}, data:{estado:'INACTIVO',es_principal:false,revision:{increment:1},actualizado_en:new Date()} });
}

async function construirCosteoCotizacion(
  transaccion: Prisma.TransactionClient,
  productos: Entrada[],
  monedaCostos: { id_moneda: number },
  margen: number,
  permitirAjustes = false,
) {
  const detalles: Prisma.detalle_cotizacionCreateWithoutCotizacionInput[] = [];
  let costoTotal = new Prisma.Decimal(0);
  for (const producto of productos) {
    const item = producto.id_item_comercial
      ? await transaccion.item_comercial.findFirst({ where: { id_item_comercial: identificador(producto.id_item_comercial), estado_item: 'activo' } })
      : await transaccion.item_comercial.findFirst({ where: { nombre_item: texto(producto.tipo_producto), estado_item: 'activo' } });
    if (!item) throw new ErrorAplicacion(400, 'Selecciona un producto activo del catálogo');
    const medidas = texto(producto.medidas, 100).split(/[xX]/).map(valor => Number(valor));
    if (medidas.length !== 3 || medidas.some(valor => !Number.isFinite(valor) || valor <= 0)) throw new ErrorAplicacion(400, 'Completa las tres medidas del producto');
    const cantidadProducto = numeroNoNegativo(producto.cantidad ?? 1, 'Cantidad de producto');
    if (!Number.isInteger(cantidadProducto) || cantidadProducto <= 0) throw new ErrorAplicacion(400, 'La cantidad de producto debe ser un entero mayor a cero');
    if (!Array.isArray(producto.materiales) || !producto.materiales.length) throw new ErrorAplicacion(400, 'Selecciona los materiales');
    let costoProducto = new Prisma.Decimal(0);
    const materiales: Prisma.detalle_costo_material_cotizacionCreateWithoutDetalle_cotizacionInput[] = [];
    for (const material of producto.materiales as Entrada[]) {
      const origen = await transaccion.historial_precio_material.findUnique({ where: { id_historial_precio_material: identificador(material.id_historial_precio_material) } });
      if (!origen || origen.estado_precio !== 'vigente' || origen.id_moneda !== monedaCostos.id_moneda) throw new ErrorAplicacion(400, 'Los materiales de la Cotización deben tener un costo vigente en CLP');
      const cantidadMaterial = numeroNoNegativo(material.cantidad, 'Cantidad de material');
      if (cantidadMaterial <= 0) throw new ErrorAplicacion(400, 'La cantidad de material debe ser mayor a cero');
      const tieneAjuste = permitirAjustes && material.costo_ajustado !== undefined;
      const precioUsado = tieneAjuste ? new Prisma.Decimal(numeroNoNegativo(material.costo_ajustado, 'Costo ajustado')) : origen.precio_unitario;
      const subtotal = precioUsado.mul(cantidadMaterial).mul(cantidadProducto).toDecimalPlaces(2);
      costoProducto = costoProducto.plus(subtotal);
      materiales.push({
        historial_precio_material: { connect: { id_historial_precio_material: origen.id_historial_precio_material } },
        cantidad_material_estimada: cantidadMaterial, precio_unitario_usado: precioUsado, subtotal_material_estimado: subtotal,
        observacion: tieneAjuste ? `Costo original ${origen.precio_unitario.toString()}; ajuste autorizado` : undefined,
      });
    }
    costoTotal = costoTotal.plus(costoProducto);
    detalles.push({
      item_comercial: { connect: { id_item_comercial: item.id_item_comercial } }, cantidad_item: cantidadProducto,
      descripcion_item_cotizado: texto(producto.descripcion, 500) || `${item.nombre_item} (${producto.medidas})`,
      observacion_medidas: texto(producto.observaciones, 2000), medida_alto_referencial: medidas[0],
      medida_ancho_referencial: medidas[1], medida_espesor_referencial: medidas[2],
      subtotal_item_estimado: costoProducto.div(new Prisma.Decimal(1).minus(new Prisma.Decimal(margen).div(100))).toDecimalPlaces(2),
      detalle_costo_material_cotizacion: { create: materiales },
    });
  }
  const precioSugerido = costoTotal.div(new Prisma.Decimal(1).minus(new Prisma.Decimal(margen).div(100))).toDecimalPlaces(2);
  return { costoTotal, precioSugerido, detalles };
}

type ContratoComercialCotizacion = {
  segmento: SegmentoComercial;
  completo: boolean;
  precioBase: Prisma.Decimal;
  instalacion: {
    requiere: 'SI'|'NO'|'POR_DEFINIR';
    estado: 'DISPONIBLE'|'NO_DISPONIBLE'|'REQUIERE_EVALUACION'|'NO_APLICA';
    idTarifa: bigint|null;
    precio: Prisma.Decimal|null;
  };
  idCondicion: bigint|null;
  servicios: Prisma.detalle_servicio_cotizacionCreateWithoutCotizacionInput[];
};

const segmentoCotizacion = (valor: unknown): SegmentoComercial | null => {
  if (valor === undefined || valor === null || valor === '') return null;
  const normalizado = String(valor).toUpperCase();
  if (normalizado !== 'B2B' && normalizado !== 'B2C') throw new ErrorAplicacion(400, 'El segmento comercial debe ser B2B o B2C');
  return normalizado;
};

async function validarContratoComercialCotizacion(
  tx: Prisma.TransactionClient,
  entrada: Entrada,
  productos: Entrada[],
  detalles: Prisma.detalle_cotizacionCreateWithoutCotizacionInput[],
  idMoneda: number,
  fecha: Date,
): Promise<ContratoComercialCotizacion|null> {
  const segmento = segmentoCotizacion(entrada.segmento_comercial);
  if (!segmento) return null;
  const permitirIncompleto = entrada.permitir_borrador_incompleto === true;
  let completo = true;
  let precioBase = new Prisma.Decimal(0);
  const servicios: Prisma.detalle_servicio_cotizacionCreateWithoutCotizacionInput[] = [];
  for (let indice = 0; indice < productos.length; indice++) {
    const producto = productos[indice];
    const idProducto = identificador(producto.id_producto_comercial);
    const idVersion = identificador(producto.id_producto_comercial_version);
    const idPrecio = producto.id_precio_producto_comercial ? BigInt(identificador(producto.id_precio_producto_comercial)) : null;
    const catalogado = await tx.extension_producto_comercial.findFirst({
      where: { id_extension_producto_comercial: idProducto, estado: 'VINCULADO', id_item_comercial: identificador(producto.id_item_comercial) },
      include: { versiones: { where: { id_producto_comercial_version: idVersion } } },
    });
    if (!catalogado || catalogado.versiones.length !== 1 || catalogado.numero_version_vigente !== catalogado.versiones[0].numero_version) throw new ErrorAplicacion(409, 'El producto o su versión comercial ya no están publicados');
    const precio = idPrecio ? await tx.precio_producto_comercial.findFirst({ where: {
      id_precio_producto_comercial: idPrecio, id_extension_producto_comercial: idProducto,
      segmento_comercial: segmento, id_moneda: idMoneda, estado: 'ACTIVO', vigencia_desde: { lte: fecha },
      OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }],
    } }) : null;
    if (!precio && !permitirIncompleto) throw new ErrorAplicacion(409, 'El producto no tiene un precio comercial vigente para el segmento y moneda seleccionados');
    if (!precio) {
      completo = false;
      Object.assign(detalles[indice], { producto_comercial:{connect:{id_extension_producto_comercial:idProducto}}, producto_version:{connect:{id_producto_comercial_version:idVersion}}, tipo_linea_comercial:'PRODUCTO', descuento_elegible:true, snapshot_comercial:{segmento,idProducto,idVersion,numeroVersion:catalogado.versiones[0].numero_version,estadoPrecio:'SIN_PRECIO',opcionales:[]} });
      continue;
    }
    const opcionalesEntrada = Array.isArray(producto.opcionales) ? producto.opcionales : [];
    const opcionalesSnapshot: Prisma.InputJsonValue[] = [];
    let totalOpcionales = new Prisma.Decimal(0);
    const usados = new Set<string>();
    for (const seleccion of opcionalesEntrada) {
      const idCompatibilidad = BigInt(identificador(seleccion.id_compatibilidad_opcional));
      if (usados.has(idCompatibilidad.toString())) throw new ErrorAplicacion(400, 'No repitas un opcional en el mismo producto');
      usados.add(idCompatibilidad.toString());
      const idPrecioOpcional = seleccion.id_precio_opcional_comercial ? BigInt(identificador(seleccion.id_precio_opcional_comercial)) : null;
      const cantidad = identificador(seleccion.cantidad ?? 1);
      const compatibilidad = await tx.compatibilidad_opcional_producto.findFirst({ where: {
        id_compatibilidad_opcional: idCompatibilidad, id_extension_producto_comercial: idProducto, estado: 'ACTIVA',
        ...(segmento === 'B2B' ? { habilitado_b2b: true } : { habilitado_b2c: true }),
      }, include: { opcional: true } });
      const precioOpcional = compatibilidad && idPrecioOpcional ? await tx.precio_opcional_comercial.findFirst({ where: {
        id_precio_opcional_comercial: idPrecioOpcional, id_opcional_comercial: compatibilidad.id_opcional_comercial,
        segmento_comercial: segmento, id_moneda: idMoneda, estado: 'ACTIVO', vigencia_desde: { lte: fecha },
        OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }],
      } }) : null;
      if (!compatibilidad || compatibilidad.opcional.estado !== 'ACTIVO' || !precioOpcional) throw new ErrorAplicacion(409, 'Un opcional dejó de ser compatible o no tiene precio vigente');
      totalOpcionales = totalOpcionales.plus(precioOpcional.monto.mul(cantidad));
      opcionalesSnapshot.push({ idOpcional: compatibilidad.id_opcional_comercial.toString(), idCompatibilidad: idCompatibilidad.toString(), idPrecio: idPrecioOpcional!.toString(), codigo: compatibilidad.opcional.codigo, nombre: compatibilidad.opcional.nombre, cantidad, precioUnitario: precioOpcional.monto.toString(), versionPrecio: precioOpcional.revision });
    }
    const cantidadProducto = new Prisma.Decimal(String(producto.cantidad));
    const unitario = precio.monto.plus(totalOpcionales);
    const subtotal = unitario.mul(cantidadProducto).toDecimalPlaces(2);
    precioBase = precioBase.plus(subtotal);
    Object.assign(detalles[indice], {
      producto_comercial: { connect: { id_extension_producto_comercial: idProducto } },
      producto_version: { connect: { id_producto_comercial_version: idVersion } },
      precio_comercial: { connect: { id_precio_producto_comercial: idPrecio } },
      tipo_linea_comercial: 'PRODUCTO', precio_lista_aplicado: precio.monto,
      precio_unitario_autorizado: unitario, descuento_elegible: true, subtotal_item_estimado: subtotal,
      snapshot_comercial: { segmento, idProducto, idVersion, numeroVersion: catalogado.versiones[0].numero_version, idPrecio: idPrecio!.toString(), precioLista: precio.monto.toString(), precioUnitario: unitario.toString(), monedaId: idMoneda, opcionales: opcionalesSnapshot },
    });
  }

  const serviciosEntrada = entrada.servicios === undefined ? [] : entrada.servicios;
  if (!Array.isArray(serviciosEntrada) || serviciosEntrada.length > 30) throw new ErrorAplicacion(400, 'Los servicios deben ser una lista de hasta 30 partidas');
  if (serviciosEntrada.length && segmento !== 'B2B') throw new ErrorAplicacion(409, 'Las partidas de servicios de C3.3 sólo están habilitadas para B2B');
  for (const linea of serviciosEntrada as Entrada[]) {
    const idServicio = BigInt(identificador(linea.id_servicio_comercial));
    const idPrecio = BigInt(identificador(linea.id_precio_servicio_comercial));
    const cantidad = new Prisma.Decimal(numeroNoNegativo(linea.cantidad ?? 1, 'Cantidad de servicio'));
    if (cantidad.lte(0)) throw new ErrorAplicacion(400, 'La cantidad del servicio debe ser mayor a cero');
    const tipoLinea = texto(linea.tipo_linea_comercial,30).toUpperCase();
    if (!['FLETE','DESPACHO','TRANSPORTE','CARGA_DESCARGA','SERVICIO_ADICIONAL'].includes(tipoLinea)) throw new ErrorAplicacion(400, 'Tipo de partida de servicio no autorizado');
    const precioServicio = await tx.precio_servicio_comercial.findFirst({ where:{
      id_precio_servicio_comercial:idPrecio,id_servicio_comercial:idServicio,segmento_comercial:'B2B',id_moneda:idMoneda,estado:'ACTIVO',vigencia_desde:{lte:fecha},OR:[{vigencia_hasta:null},{vigencia_hasta:{gte:fecha}}],
    }, include:{servicio:true} });
    if (!precioServicio || precioServicio.servicio.estado!=='ACTIVO' || !precioServicio.servicio.habilitado_b2b) throw new ErrorAplicacion(409, 'El servicio no tiene un precio B2B vigente para la moneda seleccionada');
    const subtotal = precioServicio.monto.mul(cantidad).toDecimalPlaces(2);
    precioBase = precioBase.plus(subtotal);
    servicios.push({
      servicio:{connect:{id_servicio_comercial:idServicio}}, precio:{connect:{id_precio_servicio_comercial:idPrecio}},
      cantidad, descripcion_cotizada:texto(linea.descripcion,500)||precioServicio.servicio.nombre,
      subtotal, tipo_linea_comercial:tipoLinea,
      precio_unitario_autorizado:precioServicio.monto, descuento_elegible:linea.descuento_elegible!==false,
      unidad_cobro_cotizada:precioServicio.servicio.unidad_cobro,
      snapshot_comercial:{segmento:'B2B',tipoLinea,idServicio:idServicio.toString(),codigo:precioServicio.servicio.codigo,nombre:precioServicio.servicio.nombre,descripcion:texto(linea.descripcion,500)||precioServicio.servicio.descripcion,idPrecio:idPrecio.toString(),versionPrecio:precioServicio.revision,precioUnitario:precioServicio.monto.toString(),monedaId:idMoneda,unidad:precioServicio.servicio.unidad_cobro},
    });
  }

  const requiere = String(entrada.requiere_instalacion || 'NO').toUpperCase();
  if (!['SI','NO','POR_DEFINIR'].includes(requiere)) throw new ErrorAplicacion(400, 'Indica si la cotización requiere instalación');
  let estado: ContratoComercialCotizacion['instalacion']['estado'] = requiere === 'NO' ? 'NO_APLICA' : 'REQUIERE_EVALUACION';
  let idTarifa: bigint|null = null;
  let precioInstalacion: Prisma.Decimal|null = null;
  if (requiere === 'SI') {
    const region = texto(entrada.region_instalacion, 120);
    const comuna = texto(entrada.comuna_instalacion, 120) || null;
    if (!region) throw new ErrorAplicacion(400, 'La región es obligatoria cuando se solicita instalación');
    const candidatas = await tx.tarifa_instalacion_comercial.findMany({ where: {
      region_normalizada: normalizarUbicacion(region), estado: 'ACTIVA', vigencia_desde: { lte: fecha },
      OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }],
    }, include: { moneda: true }, orderBy: { vigencia_desde: 'desc' } });
    const resolucion = resolverCoberturaDesdeTarifas(candidatas.map((item):TarifaResoluble => ({ id:item.id_tarifa_instalacion_comercial.toString(), alcance:item.alcance_geografico, regionNormalizada:item.region_normalizada, comunaNormalizada:item.comuna_normalizada, estadoCobertura:item.estado_cobertura, precio:item.precio_comercial?.toNumber() ?? null, moneda:item.moneda?.codigo_moneda ?? null, vigenciaDesde:item.vigencia_desde.toISOString().slice(0,10), vigenciaHasta:item.vigencia_hasta?.toISOString().slice(0,10) ?? null, condiciones:item.condiciones })), region, comuna);
    if (resolucion.estado === 'NO_DISPONIBLE' && !permitirIncompleto) throw new ErrorAplicacion(409, 'La instalación no está disponible para la ubicación seleccionada');
    if (resolucion.estado === 'SIN_COBERTURA' && !permitirIncompleto) throw new ErrorAplicacion(409, 'No existe cobertura comercial configurada para la ubicación seleccionada');
    if (resolucion.estado === 'NO_DISPONIBLE' || resolucion.estado === 'SIN_COBERTURA') completo = false;
    estado = resolucion.estado === 'VIGENTE' ? 'DISPONIBLE' : 'REQUIERE_EVALUACION';
    if (resolucion.tarifa) idTarifa = BigInt(resolucion.tarifa.id);
    if (resolucion.estado === 'VIGENTE') {
      const tarifa = candidatas.find(item => item.id_tarifa_instalacion_comercial === idTarifa);
      if (!tarifa || tarifa.id_moneda !== idMoneda || tarifa.precio_comercial === null) throw new ErrorAplicacion(409, 'La tarifa de instalación no corresponde a la moneda seleccionada');
      precioInstalacion = tarifa.precio_comercial;
      precioBase = precioBase.plus(precioInstalacion);
    }
  }
  let idCondicion: bigint|null = null;
  if (entrada.id_condicion_comercial_version) {
    idCondicion = BigInt(identificador(entrada.id_condicion_comercial_version));
    const condicion = await tx.condicion_comercial_version.findFirst({ where: { id_condicion_comercial_version:idCondicion, estado:'PUBLICADA', vigencia_desde:{lte:fecha}, OR:[{vigencia_hasta:null},{vigencia_hasta:{gte:fecha}}], condicion:{segmento,estado:'ACTIVA'} } });
    if (!condicion) throw new ErrorAplicacion(409, 'La condición comercial seleccionada no está publicada o vigente');
  }
  return { segmento, completo, precioBase: precioBase.toDecimalPlaces(2), instalacion:{ requiere:requiere as 'SI'|'NO'|'POR_DEFINIR', estado, idTarifa, precio:precioInstalacion }, idCondicion, servicios };
}

async function sincronizarAlternativasB2C(
  tx: Prisma.TransactionClient,
  idCotizacion: number,
  entrada: Entrada,
  contrato: ContratoComercialCotizacion|null,
  idMoneda: number,
  actorId?: bigint,
) {
  if (entrada.alternativas_b2c === undefined) return;
  if (!Array.isArray(entrada.alternativas_b2c) || entrada.alternativas_b2c.length > 8) throw new ErrorAplicacion(400, 'Las alternativas B2C deben ser una lista de hasta 8 modelos');
  if (contrato?.segmento !== 'B2C') {
    if (entrada.alternativas_b2c.length) throw new ErrorAplicacion(409, 'Sólo una cotización B2C puede guardar alternativas');
    return;
  }
  if (!actorId) throw new ErrorAplicacion(401, 'La persistencia de alternativas requiere un actor autenticado');
  let grupo = await tx.grupo_alternativas_b2c.findFirst({ where:{ id_cotizacion:idCotizacion, numero_grupo:1 }, include:{ alternativas:{ include:{ opcionales:true } } } });
  if (!grupo && entrada.alternativas_b2c.length) grupo = await tx.grupo_alternativas_b2c.create({ data:{ id_cotizacion:idCotizacion, numero_grupo:1, titulo:'Alternativas comerciales', estado:'ABIERTO' }, include:{ alternativas:{ include:{ opcionales:true } } } });
  if (!grupo) return;
  if (grupo.estado !== 'ABIERTO') throw new ErrorAplicacion(409, 'Las alternativas de este borrador ya fueron decididas');
  const existentes = new Map(grupo.alternativas.map(item => [item.id_alternativa_b2c.toString(),item]));
  const conservadas = new Set<string>();
  const fecha = new Date(`${fechaNegocio()}T00:00:00Z`);
  for (let indice=0; indice<entrada.alternativas_b2c.length; indice++) {
    const seleccion = entrada.alternativas_b2c[indice] as Entrada;
    const idProducto=identificador(seleccion.id_producto_comercial), idVersion=identificador(seleccion.id_producto_comercial_version);
    const idPrecio=BigInt(identificador(seleccion.id_precio_producto_comercial));
    const cantidad=identificador(seleccion.cantidad??1);
    const producto=await tx.extension_producto_comercial.findFirst({where:{id_extension_producto_comercial:idProducto,estado:'VINCULADO',numero_version_vigente:{not:null}},include:{versiones:{where:{id_producto_comercial_version:idVersion}}}});
    const precio=await tx.precio_producto_comercial.findFirst({where:{id_precio_producto_comercial:idPrecio,id_extension_producto_comercial:idProducto,segmento_comercial:'B2C',id_moneda:idMoneda,estado:'ACTIVO',vigencia_desde:{lte:fecha},OR:[{vigencia_hasta:null},{vigencia_hasta:{gte:fecha}}]}});
    if(!producto||producto.versiones.length!==1||producto.numero_version_vigente!==producto.versiones[0].numero_version||!precio)throw new ErrorAplicacion(409,'Una alternativa usa un producto, versión o precio B2C que dejó de estar vigente');
    const opcionalesEntrada=Array.isArray(seleccion.opcionales)?seleccion.opcionales as Entrada[]:[];
    const opcionales:Array<{idCompatibilidad:bigint;idPrecio:bigint;cantidad:number;precio:Prisma.Decimal;snapshot:Prisma.InputJsonObject}>=[];
    let subtotalOpcionales=new Prisma.Decimal(0);const idsOpcionales=new Set<string>();
    for(const opcionalEntrada of opcionalesEntrada){
      const idCompatibilidad=BigInt(identificador(opcionalEntrada.id_compatibilidad_opcional)),idPrecioOpcional=BigInt(identificador(opcionalEntrada.id_precio_opcional_comercial)),cantidadOpcional=identificador(opcionalEntrada.cantidad??1);
      if(idsOpcionales.has(idCompatibilidad.toString()))throw new ErrorAplicacion(400,'No repitas un opcional dentro de una alternativa');idsOpcionales.add(idCompatibilidad.toString());
      const compatibilidad=await tx.compatibilidad_opcional_producto.findFirst({where:{id_compatibilidad_opcional:idCompatibilidad,id_extension_producto_comercial:idProducto,habilitado_b2c:true,estado:'ACTIVA'},include:{opcional:true}});
      const precioOpcional=compatibilidad?await tx.precio_opcional_comercial.findFirst({where:{id_precio_opcional_comercial:idPrecioOpcional,id_opcional_comercial:compatibilidad.id_opcional_comercial,segmento_comercial:'B2C',id_moneda:idMoneda,estado:'ACTIVO',vigencia_desde:{lte:fecha},OR:[{vigencia_hasta:null},{vigencia_hasta:{gte:fecha}}]}}):null;
      if(!compatibilidad||compatibilidad.opcional.estado!=='ACTIVO'||!precioOpcional)throw new ErrorAplicacion(409,'Un opcional de la alternativa no es compatible o no tiene precio B2C vigente');
      subtotalOpcionales=subtotalOpcionales.plus(precioOpcional.monto.mul(cantidadOpcional));
      opcionales.push({idCompatibilidad,idPrecio:idPrecioOpcional,cantidad:cantidadOpcional,precio:precioOpcional.monto,snapshot:{codigo:compatibilidad.opcional.codigo,nombre:compatibilidad.opcional.nombre,versionPrecio:precioOpcional.revision}});
    }
    const base=precio.monto.plus(subtotalOpcionales).mul(cantidad).plus(contrato.instalacion.precio??0);
    const montos=importes(base,entrada.descuento_tipo,entrada.descuento_valor,entrada.exento_iva);
    const snapshot:Prisma.InputJsonObject={modelo:producto.nombre_comercial,codigo:producto.codigo_comercial,numeroVersion:producto.versiones[0].numero_version,configuracion:typeof seleccion.configuracion==='object'&&seleccion.configuracion&&!Array.isArray(seleccion.configuracion)?seleccion.configuracion as Prisma.InputJsonObject:{},fotografiaDocumentoId:null};
    const idExistente=seleccion.id_alternativa_b2c?String(seleccion.id_alternativa_b2c):null;const actual=idExistente?existentes.get(idExistente):undefined;
    if(idExistente&&!actual)throw new ErrorAplicacion(409,'La alternativa no pertenece al borrador actual');
    if(actual&&actual.estado!=='PROPUESTA')throw new ErrorAplicacion(409,'Una alternativa decidida no puede sobrescribirse');
    const datos={numero_alternativa:indice+1,id_extension_producto_comercial:idProducto,id_producto_comercial_version:idVersion,id_precio_producto_comercial:idPrecio,id_moneda:idMoneda,id_condicion_comercial_version:contrato.idCondicion,id_tarifa_instalacion_comercial:contrato.instalacion.idTarifa,cantidad,configuracion_snapshot:snapshot,precio_unitario:precio.monto,precio_instalacion:contrato.instalacion.precio,monto_neto:montos.neto,monto_impuesto:montos.impuesto,monto_total:montos.total};
    const alternativa=actual?await tx.alternativa_b2c.update({where:{id_alternativa_b2c:actual.id_alternativa_b2c},data:{...datos,revision:{increment:1}}}):await tx.alternativa_b2c.create({data:{...datos,id_grupo_alternativas_b2c:grupo.id_grupo_alternativas_b2c}});
    conservadas.add(alternativa.id_alternativa_b2c.toString());
    await tx.alternativa_b2c_opcional.deleteMany({where:{id_alternativa_b2c:alternativa.id_alternativa_b2c}});
    if(opcionales.length)await tx.alternativa_b2c_opcional.createMany({data:opcionales.map(o=>({id_alternativa_b2c:alternativa.id_alternativa_b2c,id_compatibilidad_opcional:o.idCompatibilidad,id_precio_opcional_comercial:o.idPrecio,cantidad:o.cantidad,precio_unitario:o.precio,snapshot_opcional:o.snapshot}))});
  }
  for(const anterior of grupo.alternativas){if(anterior.estado==='PROPUESTA'&&!conservadas.has(anterior.id_alternativa_b2c.toString())){const motivo='Retirada al actualizar el borrador';await tx.alternativa_b2c.update({where:{id_alternativa_b2c:anterior.id_alternativa_b2c},data:{estado:'RETIRADA',decidida_en:new Date(),decidida_por:actorId,motivo_decision:motivo,revision:{increment:1}}});await tx.historial_decision_alternativa_b2c.create({data:{id_alternativa_b2c:anterior.id_alternativa_b2c,estado_anterior:'PROPUESTA',estado_nuevo:'RETIRADA',motivo,actor_id:actorId}});}}
  await tx.grupo_alternativas_b2c.update({where:{id_grupo_alternativas_b2c:grupo.id_grupo_alternativas_b2c},data:{revision:{increment:1},actualizado_en:new Date()}});
}

const MOTIVO_TIPO_CAMBIO_COTIZACION = 'Conversión USD/CLP de Cotización';
const convertirDesdeClp = (monto: Prisma.Decimal, tipoCambio: Prisma.Decimal | null) =>
  tipoCambio ? monto.div(tipoCambio).toDecimalPlaces(2) : monto.toDecimalPlaces(2);

async function guardarTipoCambioCotizacion(transaccion: Prisma.TransactionClient, idCotizacion: number, tipoCambio: Prisma.Decimal | null) {
  if (!tipoCambio) return;
  await transaccion.cotizacion_version.create({ data: {
    id_cotizacion: idCotizacion, motivo: MOTIVO_TIPO_CAMBIO_COTIZACION,
    antecedentes: { monedaBase: 'CLP', monedaCotizacion: 'USD', tipoCambio: tipoCambio.toString(), fecha: fechaNegocio() },
  } });
}

async function obtenerTipoCambioCotizacion(transaccion: Prisma.TransactionClient, idCotizacion: number, codigoMoneda: string, respaldo?: unknown) {
  if (codigoMoneda === 'CLP') return null;
  const version = await transaccion.cotizacion_version.findFirst({
    where: { id_cotizacion: idCotizacion, motivo: MOTIVO_TIPO_CAMBIO_COTIZACION },
    orderBy: { id_cotizacion_version: 'desc' },
  });
  const antecedente = version?.antecedentes as { tipoCambio?: unknown } | undefined;
  const valor = antecedente?.tipoCambio;
  if ((typeof valor === 'string' || typeof valor === 'number') && new Prisma.Decimal(valor).gt(0)) return new Prisma.Decimal(valor);
  if ((typeof respaldo === 'string' || typeof respaldo === 'number') && new Prisma.Decimal(respaldo).gt(0)) return new Prisma.Decimal(respaldo);
  throw new ErrorAplicacion(409, 'La Cotización USD no conserva un tipo de cambio histórico válido');
}

/** M2 CU12–CU41. Compatibilidad del frontend existente; no sustituye la implementación completa de los CU. */
export class M2Controller {
  private readonly documentalM11 = new ServicioDocumentalM11();
  constructor(private readonly bancoCentral: BancoCentral = new C_BancoCentral()) {}
  private async resolverTipoCambioCotizacion(codigoMoneda: string, entrada: Entrada) {
    if (codigoMoneda === 'CLP') return null;
    try {
      const tipoCambio = new Prisma.Decimal(await this.bancoCentral.obtenerTipoCambio('USD', fechaNegocio()));
      if (!tipoCambio.isFinite() || tipoCambio.lte(0)) throw new ErrorAplicacion(502, 'Banco Central entregó un tipo de cambio inválido');
      return tipoCambio;
    } catch (error) {
      if (entrada.tipoCambioManual !== true) throw error;
      const tipoCambio = new Prisma.Decimal(numeroNoNegativo(entrada.tipoCambio, 'Tipo de cambio manual'));
      if (!tipoCambio.isFinite() || tipoCambio.lte(0)) throw new ErrorAplicacion(400, 'El tipo de cambio USD/CLP debe ser mayor a cero');
      return tipoCambio;
    }
  }
  async enTransaccion<T>(accion: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return prisma.$transaction(accion,{isolationLevel:Prisma.TransactionIsolationLevel.Serializable,timeout:30000});
  }

  private aplicarAjusteProductoPlantilla(etapasBase: Entrada[], ajuste: Prisma.JsonValue | null): Entrada[] {
    const cambios = ajuste && typeof ajuste === 'object' && !Array.isArray(ajuste) ? ajuste as Prisma.JsonObject : null;
    const reemplazo = cambios?.etapas;
    if (Array.isArray(reemplazo)) return structuredClone(reemplazo) as Entrada[];
    return structuredClone(etapasBase);
  }

  private async resolverPuertasCotizacion(tx: Prisma.TransactionClient, idCotizacion: number) {
    const cotizacion = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: incluirCotizacion });
    if (!cotizacion) throw new ErrorAplicacion(404, 'Cotización no encontrada');
    const idsItem = [...new Set(cotizacion.detalle_cotizacion.map(detalle => detalle.id_item_comercial))];
    const productos = await tx.extension_producto_comercial.findMany({
      where: { id_item_comercial: { in: idsItem }, estado: { not: 'INACTIVO' } },
      include: {
        familia: { include: { plantilla_fabricacion: { include: { versiones: true } } } },
        ajuste_plantilla_fabricacion: true,
      },
    });
    const porItem = new Map(productos.map(producto => [producto.id_item_comercial!, producto]));
    const unidades: PlanUnidadCotizada[] = [];
    for (const detalle of cotizacion.detalle_cotizacion) {
      const producto = porItem.get(detalle.id_item_comercial);
      if (!producto) continue;
      const cantidad = detalle.cantidad_item.toNumber();
      if (!Number.isInteger(cantidad) || cantidad <= 0) throw new ErrorAplicacion(409, `La cantidad de ${producto.nombre_comercial} debe ser un entero positivo para generar sus OT`);
      const plantilla = producto.familia.plantilla_fabricacion;
      const version = plantilla?.numero_version_vigente ? plantilla.versiones.find(item => item.numero_version === plantilla.numero_version_vigente) : null;
      if (!plantilla || !version) throw new ErrorAplicacion(409, `El producto ${producto.codigo_comercial} · ${producto.nombre_comercial} requiere una plantilla de fabricación publicada`);
      const contenido = version.contenido as Prisma.JsonObject;
      const etapasBase = Array.isArray(contenido.etapas) ? contenido.etapas as Entrada[] : [];
      const ajuste = producto.ajuste_plantilla_fabricacion?.estado === 'PUBLICADO' && producto.ajuste_plantilla_fabricacion.id_version_plantilla_base === version.id_version_plantilla ? producto.ajuste_plantilla_fabricacion.cambios : null;
      const etapas = this.aplicarAjusteProductoPlantilla(etapasBase, ajuste);
      if (!etapas.length) throw new ErrorAplicacion(409, `La plantilla vigente de ${producto.nombre_comercial} no contiene etapas`);
      for (let numeroUnidad = 1; numeroUnidad <= cantidad; numeroUnidad++) unidades.push({ idDetalleCotizacion: detalle.id_detalle_cotizacion, numeroUnidad, idProductoComercial: producto.id_extension_producto_comercial, idFamiliaProducto: producto.id_familia_producto_comercial, idVersionPlantilla: version.id_version_plantilla, producto: producto.nombre_comercial, familia: producto.familia.nombre, etapas: structuredClone(etapas) });
    }
    return { cotizacion, unidades };
  }

  private async normalizarPlanificacionesOt(tx: Prisma.TransactionClient, idCotizacion: number, entrada?: unknown) {
    const base = await this.resolverPuertasCotizacion(tx, idCotizacion);
    if (entrada === undefined) return base;
    if (!Array.isArray(entrada) || entrada.length !== base.unidades.length) throw new ErrorAplicacion(400, `La planificación debe contener exactamente ${base.unidades.length} puertas`);
    const esperadas = new Map(base.unidades.map(unidad => [`${unidad.idDetalleCotizacion}:${unidad.numeroUnidad}`, unidad]));
    const normalizadas: PlanUnidadCotizada[] = [];
    const asignacionesEmpleado: Array<{ idEmpleado:number; idArea:bigint }> = [];
    for (const valor of entrada) {
      if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new ErrorAplicacion(400, 'Planificación de puerta inválida');
      const unidadEntrada = valor as Entrada;
      const idDetalle = identificador(unidadEntrada.idDetalleCotizacion);
      const numeroUnidad = identificador(unidadEntrada.numeroUnidad);
      const esperada = esperadas.get(`${idDetalle}:${numeroUnidad}`);
      if (!esperada) throw new ErrorAplicacion(400, 'La planificación contiene una puerta que no pertenece a la Cotización');
      if (identificador(unidadEntrada.idVersionPlantilla) !== esperada.idVersionPlantilla) throw new ErrorAplicacion(409, `La plantilla de ${esperada.producto}, unidad ${numeroUnidad}, cambió; vuelve a abrir la planificación`);
      if (!Array.isArray(unidadEntrada.etapas) || !unidadEntrada.etapas.length || unidadEntrada.etapas.length > 80) throw new ErrorAplicacion(400, `La puerta ${esperada.producto} #${numeroUnidad} requiere al menos una etapa`);
      let totalTareas = 0;
      const etapas = unidadEntrada.etapas.map((etapaValor:unknown, indice:number) => {
        if (!etapaValor || typeof etapaValor !== 'object' || Array.isArray(etapaValor)) throw new ErrorAplicacion(400, `Etapa ${indice + 1} inválida`);
        const etapa = etapaValor as Entrada; const idArea = BigInt(identificador(etapa.idAreaTrabajo)); const nombre = texto(etapa.nombre,150);
        if (!nombre) throw new ErrorAplicacion(400, `La etapa ${indice + 1} requiere nombre`);
        if (!Array.isArray(etapa.tareas) || etapa.tareas.length > 100) throw new ErrorAplicacion(400, `Tareas de etapa ${indice + 1} inválidas`);
        totalTareas += etapa.tareas.length;
        const tareas = etapa.tareas.map((tareaValor:unknown, posicion:number) => {
          if (!tareaValor || typeof tareaValor !== 'object' || Array.isArray(tareaValor)) throw new ErrorAplicacion(400, `Tarea ${posicion + 1} inválida`);
          const tarea = tareaValor as Entrada; const nombreTarea = texto(tarea.nombre,150); if (!nombreTarea) throw new ErrorAplicacion(400, `La tarea ${posicion + 1} requiere nombre`);
          const idEmpleado = tarea.idEmpleado ? identificador(tarea.idEmpleado) : null; if (idEmpleado) asignacionesEmpleado.push({ idEmpleado, idArea });
          return { id: idEdicion(tarea.id), orden: posicion + 1, idTareaFabricacion: tarea.idTareaFabricacion ? identificador(tarea.idTareaFabricacion) : null, nombre: nombreTarea, descripcion: texto(tarea.descripcion,4000)||null, instrucciones: texto(tarea.instrucciones,4000)||null, tiempoEstimadoMin: minutosOpcionales(tarea.tiempoEstimadoMin,'Tiempo estimado de tarea'), idEmpleado };
        });
        return { id: idEdicion(etapa.id), orden: indice + 1, idAreaTrabajo: idArea.toString(), nombre, descripcion: texto(etapa.descripcion,4000)||null, instrucciones: texto(etapa.instrucciones,4000)||null, tiempoEstimadoMin: minutosOpcionales(etapa.tiempoEstimadoMin,'Tiempo estimado de etapa'), tareas };
      });
      if (!totalTareas) throw new ErrorAplicacion(400, `La puerta ${esperada.producto} #${numeroUnidad} no puede generar una OT vacía`);
      normalizadas.push({ ...esperada, etapas }); esperadas.delete(`${idDetalle}:${numeroUnidad}`);
    }
    if (esperadas.size) throw new ErrorAplicacion(400, 'Faltan puertas en la planificación');
    const idsArea = [...new Set(normalizadas.flatMap(unidad => unidad.etapas.map(etapa => BigInt(etapa.idAreaTrabajo).toString())))];
    const areas = await tx.area_trabajo.findMany({ where: { area_trabajo_id_area: { in: idsArea.map(BigInt) }, area_trabajo_activo: true }, select: { area_trabajo_id_area: true } });
    if (areas.length !== idsArea.length) throw new ErrorAplicacion(409, 'La planificación contiene un área inactiva o inexistente');
    if (asignacionesEmpleado.length) {
      const pares = await Promise.all(asignacionesEmpleado.map(par => tx.asignacion_area_empleado.findFirst({ where: { id_empleado: par.idEmpleado, id_area_trabajo: par.idArea, vigencia_hasta: null, empleado: { estado_laboral: 'activo' } }, select: { id_asignacion_area_empleado: true } })));
      if (pares.some(par => !par)) throw new ErrorAplicacion(409, 'Un empleado seleccionado ya no está activo en el área indicada');
    }
    return { cotizacion: base.cotizacion, unidades: normalizadas };
  }

  async obtenerPlanificacionAprobacionCotizacion(idCotizacion:number) {
    const resultado = await this.enTransaccion(tx => this.normalizarPlanificacionesOt(tx,idCotizacion));
    const idsArea = [...new Set(resultado.unidades.flatMap(unidad => unidad.etapas.map(etapa => String(etapa.idAreaTrabajo))))];
    const [asignaciones,areas] = await Promise.all([
      prisma.asignacion_area_empleado.findMany({ where: { id_area_trabajo: { in: idsArea.map(BigInt) }, vigencia_hasta: null, empleado: { estado_laboral: 'activo' } }, include: { empleado: true }, orderBy: [{ empleado: { apellido_paterno:'asc' } },{ empleado:{ nombres:'asc' } }] }),
      prisma.area_trabajo.findMany({where:{area_trabajo_activo:true},select:{area_trabajo_id_area:true,area_trabajo_nombre_area:true},orderBy:{area_trabajo_nombre_area:'asc'}}),
    ]);
    const empleadosPorArea:Record<string,Array<{id:number;nombre:string;rut:string}>>={};
    for(const asignacion of asignaciones){const clave=asignacion.id_area_trabajo.toString();(empleadosPorArea[clave]??=[]).push({id:asignacion.empleado.id_empleado,nombre:[asignacion.empleado.nombres,asignacion.empleado.apellido_paterno,asignacion.empleado.apellido_materno].filter(Boolean).join(' '),rut:asignacion.empleado.rut_empleado});}
    const ofertas = await prisma.cotizacion_version.findMany({
      where:{id_cotizacion:idCotizacion,numero_version_comercial:{not:null},tipo_version:'EMISION',estado_documental:'DISPONIBLE',id_documento_logico:{not:null}},
      orderBy:{numero_version_comercial:'desc'},
      select:{id_cotizacion_version:true,numero_version_comercial:true,fecha:true,motivo:true,estado_documental:true},
    });
    return { cotizacion:{ id:resultado.cotizacion.id_cotizacion, cliente:resultado.cotizacion.ficha_cliente.cliente_financiero.nombre_razon_social_referencia, fechaVigencia:resultado.cotizacion.fecha_vigencia,idMoneda:resultado.cotizacion.id_moneda,moneda:resultado.cotizacion.moneda.codigo_moneda }, ofertas:ofertas.map(oferta=>({id:oferta.id_cotizacion_version,numero:oferta.numero_version_comercial,fecha:oferta.fecha,motivo:oferta.motivo,estadoDocumental:oferta.estado_documental})), totalOt:resultado.unidades.length, planificaciones:resultado.unidades, empleadosPorArea, areas:areas.map(area=>({id:area.area_trabajo_id_area.toString(),nombre:area.area_trabajo_nombre_area||`Área ${area.area_trabajo_id_area}`})) };
  }

  private async crearOrdenesTrabajoCotizacion(tx:Prisma.TransactionClient,idCotizacion:number,entrada:unknown,usuario:bigint,idProyecto?:bigint){
    if (entrada === undefined) {
      const base = await this.resolverPuertasCotizacion(tx,idCotizacion);
      if (base.unidades.length) throw new ErrorAplicacion(400, 'Debes revisar y confirmar la planificación de todas las puertas antes de aprobar la Cotización');
      return [];
    }
    const resultado=await this.normalizarPlanificacionesOt(tx,idCotizacion,entrada);
    if(idProyecto){
      const proyecto=await tx.proyecto.findUnique({where:{proyecto_proyecto_id:idProyecto},select:{id_cotizacion_origen:true}});
      const coherencia=validarCoherenciaContextualM12({idProyecto:idProyecto.toString(),proyectoEncontrado:Boolean(proyecto),idCotizacion:String(idCotizacion),idCotizacionOrigenProyecto:proyecto?.id_cotizacion_origen?.toString()??null});
      if(!coherencia.compatible)throw new ErrorAplicacion(409,coherencia.motivo);
    }
    const creadas:Array<{idOrdenTrabajo:string;idUnidad:string;detalle:number;unidad:number;version:number}>=[];
    for(const unidad of resultado.unidades){
      const orden=await tx.orden_trabajo.create({data:{orden_trabajo_fecha_hora:new Date(),orden_trabajo_estado:'PENDIENTE_RECTIFICACION',especificaciones_puerta_id_especificacion_puerta:null,proyecto_id_proyecto:idProyecto??null,area_trabajo_id_area:null,usuario_id_usuario:null}});
      const planificacion={etapas:unidad.etapas};
      const registro=await tx.unidad_fisica_orden_trabajo.create({data:{id_cotizacion:idCotizacion,id_detalle_cotizacion:unidad.idDetalleCotizacion,id_extension_producto_comercial:unidad.idProductoComercial,id_familia_producto_comercial:unidad.idFamiliaProducto,numero_unidad:unidad.numeroUnidad,id_version_plantilla:unidad.idVersionPlantilla,id_orden_trabajo:orden.orden_trabajo_id_orden,planificacion_inicial:planificacion as Prisma.InputJsonValue,planificacion_actual:planificacion as Prisma.InputJsonValue,creado_por:usuario}});
      await tx.historial_unidad_fisica_ot.create({data:{id_unidad_fisica_ot:registro.id_unidad_fisica_ot,evento:'CREACION_DESDE_COTIZACION',valor_nuevo:{idCotizacion,idDetalle:unidad.idDetalleCotizacion,numeroUnidad:unidad.numeroUnidad,idOrdenTrabajo:orden.orden_trabajo_id_orden.toString(),idVersionPlantilla:unidad.idVersionPlantilla,estado:'PENDIENTE_RECTIFICACION'},usuario_id_usuario:usuario}});
      creadas.push({idOrdenTrabajo:orden.orden_trabajo_id_orden.toString(),idUnidad:registro.id_unidad_fisica_ot.toString(),detalle:unidad.idDetalleCotizacion,unidad:unidad.numeroUnidad,version:unidad.idVersionPlantilla});
    }
    return creadas;
  }

  async consolidarB2C(idCotizacion:number, entrada:Entrada, responsable:bigint) {
    return this.enTransaccion(async tx=>{
      const cotizacion=await tx.cotizacion.findUnique({where:{id_cotizacion:idCotizacion},include:{...incluirCotizacion,nota_venta:true}});
      if(!cotizacion || cotizacion.estado_cotizacion!=='emitida' || !cotizacion.fecha_vigencia || cotizacion.fecha_vigencia.toISOString().slice(0,10)<fechaNegocio() || cotizacion.nota_venta) throw new ErrorAplicacion(409,'Cotización no emitida/vigente o ya consolidada');
      const cliente=cotizacion.ficha_cliente.cliente_financiero;
      if(cotizacion.segmento_comercial && cotizacion.segmento_comercial!=='B2C') throw new ErrorAplicacion(409,'La Cotización no pertenece al segmento B2C');
      const tipo=await tx.tipo_cliente_financiero.findUnique({where:{id_tipo_cliente_financiero:cliente.id_tipo_cliente_financiero}});
      if(tipo?.nombre_tipo_cliente_financiero!=='B2C' || cliente.estado_financiero!=='activo' || cliente.nivel_formalizacion!=='formal') throw new ErrorAplicacion(409,'La consolidación exige cliente B2C activo y formalizado');
      if(cotizacion.monto_neto===null || cotizacion.monto_impuesto===null || cotizacion.monto_total_estimado===null || cotizacion.monto_total_estimado.lte(0)) throw new ErrorAplicacion(409,'Completa las condiciones comerciales antes de consolidar');
      // Midas: nota y pago salen juntos de esta transacción, o no sale ninguno
      const tipoCambio=await obtenerTipoCambioCotizacion(tx,idCotizacion,cotizacion.moneda.codigo_moneda,entrada.tipoCambio);
      const proyecto=await formalizarProyectoCotizacion(tx,idCotizacion);
      const nota=await tx.nota_venta.create({data:{numero_nota_venta:`B2C-${randomUUID()}`,id_cotizacion:idCotizacion,id_ficha_cliente:cotizacion.id_ficha_cliente,id_moneda:cotizacion.id_moneda,id_proyecto_contexto:proyecto.proyecto_proyecto_id,fecha_emision:new Date(`${fechaNegocio()}T00:00:00Z`),monto_neto:cotizacion.monto_neto,monto_impuesto:cotizacion.monto_impuesto,monto_total:cotizacion.monto_total_estimado,tipo_cambio_usado:tipoCambio,monto_convertido:tipoCambio?cotizacion.monto_total_estimado.mul(tipoCambio).toDecimalPlaces(2):null,exento_iva:cotizacion.exento_iva,estado_nota_venta:'emitida'},include:incluirNota});
      await tx.proyecto_financiero.create({data:{id_ficha_cliente:cotizacion.id_ficha_cliente,id_nota_venta:nota.id_nota_venta,id_proyecto_terreno:proyecto.proyecto_proyecto_id,id_moneda:cotizacion.id_moneda,codigo_proyecto_financiero:`COT-${idCotizacion}`,fecha_inicio_financiera:new Date(`${fechaNegocio()}T00:00:00Z`),estado_financiero_proyecto:'activo',monto_venta_estimado:cotizacion.monto_neto,monto_costo_estimado:cotizacion.subtotal_costos_estimados}});
      const idDocumento=entrada.idDocumento?identificador(entrada.idDocumento):null;
      const documento=idDocumento?await tx.documento_tributario.findUnique({where:{id_documento_tributario:idDocumento}}):null;
      if(idDocumento&&(!documento || documento.id_ficha_cliente!==nota.id_ficha_cliente))throw new ErrorAplicacion(400,'Selecciona un documento tributario existente del mismo cliente');
      const catalogo={medios:await tx.medio_pago.findMany({where:{estado_medio_pago:'activo'}}),categorias:await tx.categoria_pago.findMany({where:{activo:true}}),cuotas:await tx.config_cuotas_tarjeta.findMany({where:{activo:true}})};
      const datosPago=tipoCambio?{...entrada,tipoCambio:tipoCambio.toString()}:entrada;
      const pago=await tx.pago_cliente.create({data:prepararPago(nota,datosPago,catalogo,idDocumento,responsable.toString())});
      const actual=await tx.nota_venta.findUniqueOrThrow({where:{id_nota_venta:nota.id_nota_venta},include:incluirNota});
      await tx.nota_venta.update({where:{id_nota_venta:nota.id_nota_venta},data:{estado_pago:calcularNota(actual).estadoPago}});
      const ordenesTrabajo=await this.crearOrdenesTrabajoCotizacion(tx,idCotizacion,entrada.planificaciones,responsable,proyecto.proyecto_proyecto_id);
      await tx.cotizacion.update({where:{id_cotizacion:idCotizacion},data:{estado_cotizacion:'aprobada'}});
      return auditableM9({mensaje:'Venta B2C consolidada con su primer pago y OT pendientes de rectificación',idNota:nota.id_nota_venta,idPago:pago.id_pago_cliente,idProyecto:proyecto.proyecto_proyecto_id.toString(),idObra:cotizacion.id_obra_contexto?.toString()??null,ordenesTrabajo},undefined,{idCotizacion,idNota:nota.id_nota_venta,idProyecto:proyecto.proyecto_proyecto_id.toString(),idObra:cotizacion.id_obra_contexto?.toString()??null,ordenesTrabajo});
    });
  }

  async aprobarCotizacionB2B(idCotizacion: number, entrada: Entrada, usuario: bigint) {
    return this.enTransaccion(async tx => {
      const cot = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: { nota_venta: true, orden_compra_b2b: true, moneda: true, detalle_cotizacion:{select:{id_detalle_cotizacion:true,id_cotizacion:true}} } });
      if (!cot || cot.estado_cotizacion !== 'emitida' || cot.nota_venta) throw new ErrorAplicacion(409, 'La Cotización no está disponible para aceptación');
      if (cot.segmento_comercial && cot.segmento_comercial !== 'B2B') throw new ErrorAplicacion(409, 'La Cotización no pertenece al segmento B2B');
      if (!cot.fecha_vigencia || cot.fecha_vigencia.toISOString().slice(0, 10) < fechaNegocio()) throw new ErrorAplicacion(409, 'La Cotización está vencida; no se puede aceptar');
      const folio = texto(entrada.folioOrdenCompra, 100); const respaldo = texto(entrada.respaldoOrdenCompra, 4500000);
      if (!folio || !respaldo) throw new ErrorAplicacion(400, 'El folio y respaldo de la Orden de Compra son obligatorios');
      if(entrada.idVersionOfertaAceptada === undefined || entrada.idVersionOfertaAceptada === null || entrada.idVersionOfertaAceptada === '') throw new ErrorAplicacion(400,'Debes identificar la versión documental de la oferta aceptada');
      const idVersionOferta = identificador(entrada.idVersionOfertaAceptada);
      const ofertaAceptada = await tx.cotizacion_version.findFirst({where:{id_cotizacion_version:idVersionOferta,id_cotizacion:idCotizacion,numero_version_comercial:{not:null},tipo_version:'EMISION',estado_documental:'DISPONIBLE',id_documento_logico:{not:null}}});
      if(!ofertaAceptada)throw new ErrorAplicacion(400,'La oferta aceptada no pertenece a esta negociación o no posee documento confirmado');
      const cotejo=prepararTrazabilidadOrdenCompraM11(entrada.lineasOrdenCompra,idCotizacion,cot.detalle_cotizacion,ofertaAceptada?.snapshot_comercial,cot.id_moneda);
      const economia=validarCondicionesEconomicasOfertaM11(ofertaAceptada.snapshot_comercial,{moneda:cot.moneda.codigo_moneda,neto:cot.monto_neto,impuesto:cot.monto_impuesto,total:cot.monto_total_estimado});
      exigirCotejoAcreditadoM11(cotejo,economia);
      const oc = await tx.orden_compra_b2b.create({ data: { id_cotizacion: idCotizacion, id_version_oferta_aceptada:idVersionOferta, folio, respaldo, fecha: new Date(`${fechaNegocio()}T00:00:00Z`),estado_cotejo:cotejo.estado,resultado_cotejo:cotejo.resumen as Prisma.InputJsonValue,lineas:{create:cotejo.lineas.map(linea=>({numero_linea:linea.numeroLinea,id_detalle_cotizacion:linea.idDetalleCotizacion,referencia_comercial:linea.referenciaComercial,concepto:linea.concepto,especificaciones:linea.especificaciones??undefined,cantidad:linea.cantidad,id_moneda:linea.idMoneda,precio_unitario:linea.precioUnitario,subtotal:linea.subtotal,estado_cotejo:linea.estadoCotejo,resultado_cotejo:linea.resultadoCotejo}))} },include:{lineas:true,version_oferta_aceptada:{select:{id_cotizacion_version:true,numero_version_comercial:true,fecha:true,estado_documental:true}}} });
      let tipoCambio:Prisma.Decimal|null;
      try{tipoCambio=await obtenerTipoCambioCotizacion(tx,idCotizacion,cot.moneda.codigo_moneda,entrada.tipoCambio);}catch(error){
        if(!(error instanceof ErrorAplicacion)||cot.moneda.codigo_moneda!=='USD')throw error;
        tipoCambio=await this.resolverTipoCambioCotizacion(cot.moneda.codigo_moneda,entrada);
      }
      const montoTotal=cot.monto_total_estimado || new Prisma.Decimal(0);
      const montoFinanciado = entrada.financiada === true ? new Prisma.Decimal(String(entrada.montoFinanciado ?? montoTotal)) : null;
      let autorizacionCredito: Awaited<ReturnType<typeof validarCreditoParaFormalizacion>> | null = null;
      if (montoFinanciado) {
        if (!montoFinanciado.isFinite() || montoFinanciado.lte(0) || montoFinanciado.gt(montoTotal)) throw new ErrorAplicacion(400, 'El monto financiado debe ser positivo y no superar el total');
        autorizacionCredito = await validarCreditoParaFormalizacion(tx, { idFicha: cot.id_ficha_cliente, montoFinanciado, idCotizacion, idSolicitudExcepcion: entrada.idSolicitudExcepcion ? identificador(entrada.idSolicitudExcepcion) : undefined });
        if (autorizacionCredito.resultado !== 'AUTORIZADO') throw new ErrorAplicacion(409, `${autorizacionCredito.resultado}: ${autorizacionCredito.motivos.join(', ')}`);
      }
      const proyecto=await formalizarProyectoCotizacion(tx,idCotizacion);
      const nota = await tx.nota_venta.create({ data: { numero_nota_venta: `B2B-${randomUUID()}`, id_cotizacion: idCotizacion, id_ficha_cliente: cot.id_ficha_cliente, id_moneda: cot.id_moneda, id_proyecto_contexto:proyecto.proyecto_proyecto_id, fecha_emision: new Date(`${fechaNegocio()}T00:00:00Z`), monto_neto: cot.monto_neto || 0, monto_impuesto: cot.monto_impuesto || 0, monto_total: montoTotal, tipo_cambio_usado: tipoCambio, monto_convertido: tipoCambio?montoTotal.mul(tipoCambio).toDecimalPlaces(2):null, exento_iva: cot.exento_iva, estado_nota_venta: 'emitida', estado_pago: 'pendiente' } });
      await tx.proyecto_financiero.create({data:{id_ficha_cliente:cot.id_ficha_cliente,id_nota_venta:nota.id_nota_venta,id_proyecto_terreno:proyecto.proyecto_proyecto_id,id_moneda:cot.id_moneda,codigo_proyecto_financiero:`COT-${idCotizacion}`,fecha_inicio_financiera:new Date(`${fechaNegocio()}T00:00:00Z`),estado_financiero_proyecto:'activo',monto_venta_estimado:cot.monto_neto,monto_costo_estimado:cot.subtotal_costos_estimados}});
      if (montoFinanciado) await registrarCompromisoCredito(tx, { idFicha: cot.id_ficha_cliente, idNota: nota.id_nota_venta, montoFinanciado, idSolicitudExcepcion: autorizacionCredito?.idSolicitudExcepcion });
      const ordenesTrabajo=await this.crearOrdenesTrabajoCotizacion(tx,idCotizacion,entrada.planificaciones,usuario,proyecto.proyecto_proyecto_id);
      const candidatasCorrespondencia=prepararCorrespondenciasTecnicasM11(cotejo.lineas,ordenesTrabajo);
      const correspondencias=candidatasCorrespondencia.flatMap(candidata=>{const linea=oc.lineas.find(item=>item.numero_linea===candidata.numeroLinea);return linea?[{id_linea_orden_compra_b2b:linea.id_linea_orden_compra_b2b,id_unidad_fisica_ot:BigInt(candidata.idUnidad),estado:'ACREDITADA',evidencia:{fuente:'COBERTURA_EXACTA_OC_OFERTA_UNIDAD',idCotizacion,idDetalleCotizacion:candidata.idDetalleCotizacion,numeroLinea:candidata.numeroLinea,idOrdenTrabajo:candidata.idOrdenTrabajo} as Prisma.InputJsonValue}]:[];});
      if(correspondencias.length)await tx.correspondencia_linea_oc_item_tecnico.createMany({data:correspondencias,skipDuplicates:true});
      await tx.cotizacion.update({ where: { id_cotizacion: idCotizacion }, data: { estado_cotizacion: 'aprobada' } });
      return auditableM9({ mensaje: 'Orden de Compra, Nota de Venta y OT generadas', idNota: nota.id_nota_venta, idProyecto:proyecto.proyecto_proyecto_id.toString(), idObra:cot.id_obra_contexto?.toString()??null, ordenCompra: oc, cotejo:{estado:cotejo.estado,...cotejo.resumen},correspondenciasTecnicas:correspondencias.length, ordenesTrabajo },undefined,{idCotizacion,idNota:nota.id_nota_venta,idProyecto:proyecto.proyecto_proyecto_id.toString(),idObra:cot.id_obra_contexto?.toString()??null,idVersionOfertaAceptada:idVersionOferta,cotejo:cotejo.estado,lineasOrdenCompra:cotejo.lineas.length,correspondenciasTecnicas:correspondencias.length,ordenesTrabajo});
    });
  }

  async consultarTrazabilidadComercialM11(idCotizacion:number){
    const cotizacion=await prisma.cotizacion.findUnique({
      where:{id_cotizacion:idCotizacion},
      select:{
        id_cotizacion:true,
        segmento_comercial:true,
        cotizacion_version:{
          where:{numero_version_comercial:{not:null}},
          orderBy:{numero_version_comercial:'asc'},
          select:{id_cotizacion_version:true,numero_version_comercial:true,fecha:true,motivo:true,estado_documental:true,id_documento_logico:true},
        },
        orden_compra_b2b:{
          include:{
            version_oferta_aceptada:{select:{id_cotizacion_version:true,numero_version_comercial:true,fecha:true,estado_documental:true,id_documento_logico:true}},
            lineas:{
              orderBy:{numero_linea:'asc'},
              include:{
                moneda:{select:{codigo_moneda:true}},
                correspondencias_tecnicas:{include:{unidad:{select:{id_unidad_fisica_ot:true,id_detalle_cotizacion:true,numero_unidad:true,id_orden_trabajo:true,estado:true}}}},
              },
            },
          },
        },
      },
    });
    if(!cotizacion)throw new ErrorAplicacion(404,'Cotización no encontrada');
    return cotizacion;
  }
  consultarCadenaDocumentalM11(idCotizacion: number) { return this.documentalM11.consultarCadena(idCotizacion); }
  consultarConciliacionDocumentalM11(idCotizacion: number) { return this.documentalM11.consultarConciliacion(idCotizacion); }
  gestionarCorreccionDocumentalM11(entrada: Entrada, actorId: bigint) { return this.documentalM11.gestionarCorreccion(entrada, actorId); }
  consultarHistorialCorreccionM11(tipo: string, idDocumento: number) { return this.documentalM11.consultarHistorial(tipo, idDocumento); }
  resolverHallazgoDocumentalM11(idHallazgo: number, entrada: Entrada, actorId: bigint) { return this.documentalM11.resolverHallazgo(BigInt(idHallazgo), entrada, actorId); }

  async registrarClienteDesdeCotizacion(entrada: Entrada) {
    const nombre = texto(entrada.nombre, 150); const tipo = texto(entrada.tipo || 'B2C', 30).toUpperCase();
    const rutEntrada = texto(entrada.rut, 15);
    const rut = rutEntrada ? validarYNormalizarRut(rutEntrada) : null;
    if (!nombre || !['B2B','B2C'].includes(tipo)) throw new ErrorAplicacion(400, 'Nombre y tipo de cliente son obligatorios');
    if (tipo === 'B2B' && !rut) throw new ErrorAplicacion(400, 'El RUT es obligatorio para clientes B2B');
    if (tipo === 'B2C' && !texto(entrada.telefono, 30)) throw new ErrorAplicacion(400, 'El teléfono es obligatorio para clientes B2C provisionales');
    if (tipo === 'B2B' && !texto(entrada.contacto, 150)) throw new ErrorAplicacion(400, 'El contacto es obligatorio para clientes B2B');
    if (entrada.confirmado !== true) throw new ErrorAplicacion(400, 'Confirma el registro del cliente');
    return prisma.$transaction(async tx => {
      const tipoCliente = await tx.tipo_cliente_financiero.findFirst({ where: { nombre_tipo_cliente_financiero: { equals: tipo, mode: 'insensitive' } } });
      if (!tipoCliente) throw new ErrorAplicacion(400, 'Tipo de cliente no configurado');
      if (rut && await tx.cliente_financiero.findFirst({ where: { rut_cliente: { in: variantesRut(rut), mode: 'insensitive' } } })) throw new ErrorAplicacion(409, 'El cliente ya existe');
      if (rut) await tx.cliente.upsert({ where: { cliente_cliente_rut: rut }, update: { cliente_razon_social: nombre, cliente_contacto_principal: texto(entrada.contacto,150) || undefined, cliente_correo: texto(entrada.correo,150) || undefined, cliente_telefono: texto(entrada.telefono,30) || undefined }, create: { cliente_cliente_rut: rut, cliente_razon_social: nombre, cliente_contacto_principal: texto(entrada.contacto,150) || null, cliente_correo: texto(entrada.correo,150) || null, cliente_telefono: texto(entrada.telefono,30) || null, cliente_es_cliente_b2b: tipo === 'B2B', cliente_es_cliente_b2c: tipo === 'B2C' } });
      const cliente = await tx.cliente_financiero.create({ data: { rut_cliente: rut, id_tipo_cliente_financiero: tipoCliente.id_tipo_cliente_financiero, nombre_razon_social_referencia: nombre, contacto_financiero: texto(entrada.contacto,150) || null, correo_financiero: texto(entrada.correo,150) || null, telefono_financiero: texto(entrada.telefono,30) || null, estado_financiero: 'activo', nivel_formalizacion: rut ? 'formal' : 'provisional', ficha_cliente: { create: {} } }, include: { ficha_cliente: true } });
      const idCotizacion = entrada.idCotizacion ? identificador(entrada.idCotizacion) : null;
      if (idCotizacion) {
        const cotizacion = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion } });
        if (!cotizacion || cotizacion.estado_cotizacion !== 'borrador') throw new ErrorAplicacion(409, 'La Cotización debe estar en elaboración');
        await tx.cotizacion.update({ where: { id_cotizacion: idCotizacion }, data: { id_ficha_cliente: cliente.ficha_cliente!.id_ficha_cliente } });
      }
      return { mensaje: 'Cliente registrado desde Cotización', cliente, idCotizacion };
    });
  }

  async emitirCotizacion(idCotizacion: number) {
    return prisma.$transaction(async tx => {
      const cot = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: { detalle_cotizacion: true, contactos_b2b:{where:{estado:'ACTIVO'}}, ficha_cliente:{include:{cliente_financiero:{include:{tipo_cliente_financiero:true}}}} } });
      if (!cot || cot.estado_cotizacion !== 'borrador') throw new ErrorAplicacion(409, 'Sólo se puede emitir un borrador disponible');
      if (!cot.id_ficha_cliente || !cot.fecha_vigencia || !cot.monto_total_estimado || cot.monto_total_estimado.lte(0) || !cot.detalle_cotizacion.length) throw new ErrorAplicacion(409, 'La Cotización está incompleta');
      if (cot.segmento_comercial) {
        const tipoCliente=cot.ficha_cliente.cliente_financiero.tipo_cliente_financiero.nombre_tipo_cliente_financiero.toUpperCase();
        if(tipoCliente!==cot.segmento_comercial) throw new ErrorAplicacion(409,'El cliente no corresponde al segmento persistido de la Cotización');
        if(cot.segmento_comercial==='B2B'&&(!cot.ficha_cliente.cliente_financiero.rut_cliente||cot.ficha_cliente.cliente_financiero.nivel_formalizacion!=='formal')) throw new ErrorAplicacion(409,'La emisión B2B requiere un cliente formal con RUT');
        if(cot.segmento_comercial==='B2B'&&(cot.contactos_b2b.length<1||cot.contactos_b2b.filter(contacto=>contacto.es_principal).length!==1)) throw new ErrorAplicacion(409,'La emisión B2B requiere exactamente un contacto principal propio de la cotización');
        if(cot.detalle_cotizacion.some(detalle=>detalle.tipo_linea_comercial==='PRODUCTO'&&(!detalle.id_extension_producto_comercial||!detalle.id_producto_comercial_version||!detalle.id_precio_producto_comercial||!detalle.precio_unitario_autorizado))) throw new ErrorAplicacion(409,'La Cotización contiene productos comerciales incompletos');
        if(cot.requiere_instalacion==='SI'&&cot.estado_cobertura_instalacion!=='DISPONIBLE'&&cot.estado_cobertura_instalacion!=='REQUIERE_EVALUACION') throw new ErrorAplicacion(409,'La cobertura de instalación es inconsistente');
      }
      const emitida=await tx.cotizacion.update({ where: { id_cotizacion: idCotizacion }, data: { estado_cotizacion: 'emitida' } });
      return auditableM9(emitida,{estado:'borrador'},{estado:'emitida',revision:emitida.revision});
    });
  }

  async seleccionarAlternativaB2C(idCotizacion:number, entrada:Entrada, actorId:bigint) {
    const idAlternativa=BigInt(identificador(entrada.idAlternativa)); const revision=identificador(entrada.revision); const motivo=motivoObligatorio(entrada.motivo);
    return prisma.$transaction(async tx=>{
      const grupo=await tx.grupo_alternativas_b2c.findFirst({where:{id_cotizacion:idCotizacion,estado:'ABIERTO'},include:{alternativas:true}});
      if(!grupo)throw new ErrorAplicacion(409,'La cotización no posee un grupo de alternativas abierto');
      if(grupo.revision!==revision)throw new ErrorAplicacion(409,'La selección fue modificada por otra sesión','REVISION_DESACTUALIZADA');
      const alternativa=grupo.alternativas.find(a=>a.id_alternativa_b2c===idAlternativa);
      if(!alternativa||alternativa.estado!=='PROPUESTA')throw new ErrorAplicacion(409,'La alternativa no está disponible para selección');
      if(grupo.id_alternativa_seleccionada===idAlternativa)return auditableM9(grupo,{seleccion:idAlternativa.toString()},{seleccion:idAlternativa.toString(),idempotente:true});
      const actualizado=await tx.grupo_alternativas_b2c.update({where:{id_grupo_alternativas_b2c:grupo.id_grupo_alternativas_b2c},data:{id_alternativa_seleccionada:idAlternativa,seleccionada_en:new Date(),seleccionada_por:actorId,revision:{increment:1},actualizado_en:new Date()}});
      await tx.historial_seleccion_alternativa_b2c.create({data:{id_grupo_alternativas_b2c:grupo.id_grupo_alternativas_b2c,id_alternativa_anterior:grupo.id_alternativa_seleccionada,id_alternativa_nueva:idAlternativa,motivo,actor_id:actorId,revision_grupo:actualizado.revision}});
      return auditableM9(actualizado,{seleccion:grupo.id_alternativa_seleccionada?.toString()??null},{seleccion:idAlternativa.toString(),revision:actualizado.revision});
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  async rechazarAlternativaB2C(idCotizacion:number, entrada:Entrada, actorId:bigint) {
    const idAlternativa=BigInt(identificador(entrada.idAlternativa)); const revision=identificador(entrada.revision); const motivo=motivoObligatorio(entrada.motivo);
    return prisma.$transaction(async tx=>{
      const alternativa=await tx.alternativa_b2c.findUnique({where:{id_alternativa_b2c:idAlternativa},include:{grupo:true}});
      if(!alternativa||alternativa.grupo.id_cotizacion!==idCotizacion)throw new ErrorAplicacion(404,'Alternativa no encontrada en la cotización');
      if(alternativa.revision!==revision||alternativa.estado!=='PROPUESTA')throw new ErrorAplicacion(409,'La alternativa ya fue decidida o cambió de revisión');
      const actualizada=await tx.alternativa_b2c.update({where:{id_alternativa_b2c:idAlternativa},data:{estado:'RECHAZADA',decidida_en:new Date(),decidida_por:actorId,motivo_decision:motivo,revision:{increment:1}}});
      await tx.historial_decision_alternativa_b2c.create({data:{id_alternativa_b2c:idAlternativa,estado_anterior:'PROPUESTA',estado_nuevo:'RECHAZADA',motivo,actor_id:actorId}});
      if(alternativa.grupo.id_alternativa_seleccionada===idAlternativa){const grupo=await tx.grupo_alternativas_b2c.update({where:{id_grupo_alternativas_b2c:alternativa.id_grupo_alternativas_b2c},data:{id_alternativa_seleccionada:null,seleccionada_en:null,seleccionada_por:null,revision:{increment:1},actualizado_en:new Date()}});await tx.historial_seleccion_alternativa_b2c.create({data:{id_grupo_alternativas_b2c:grupo.id_grupo_alternativas_b2c,id_alternativa_anterior:idAlternativa,id_alternativa_nueva:null,motivo,actor_id:actorId,revision_grupo:grupo.revision}});}
      return auditableM9(actualizada,{estado:'PROPUESTA'},{estado:'RECHAZADA',revision:actualizada.revision});
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  async aceptarAlternativaB2C(idCotizacion:number, entrada:Entrada, actorId:bigint) {
    const revisionGrupo=identificador(entrada.revisionGrupo); const clave=texto(entrada.claveIdempotencia,160); const motivo=motivoObligatorio(entrada.motivo);
    if(!/^[A-Za-z0-9._:-]{8,160}$/.test(clave))throw new ErrorAplicacion(400,'Clave de idempotencia inválida');
    return prisma.$transaction(async tx=>{
      const creada=await tx.idempotencia_operacion_comercial.createMany({data:{clave,operacion:'ACEPTAR_ALTERNATIVA_B2C',actor_id:actorId},skipDuplicates:true});
      if(!creada.count){const previa=await tx.idempotencia_operacion_comercial.findUnique({where:{clave}});if(!previa||previa.operacion!=='ACEPTAR_ALTERNATIVA_B2C'||previa.actor_id!==actorId)throw new ErrorAplicacion(409,'La clave pertenece a otra operación');if(previa.respuesta!==null)return previa.respuesta;throw new ErrorAplicacion(409,'La aceptación se encuentra en proceso');}
      const cot=await tx.cotizacion.findUnique({where:{id_cotizacion:idCotizacion},include:{cotizacion_version:true,grupos_alternativas_b2c:{include:{alternativas:true}},detalle_cotizacion:true}});
      if(!cot||cot.segmento_comercial!=='B2C')throw new ErrorAplicacion(409,'La aceptación requiere una cotización B2C');
      if(cot.estado_cotizacion!=='emitida')throw new ErrorAplicacion(409,'La cotización debe estar emitida antes de aceptar una alternativa');
      if(!cot.cotizacion_version.some(v=>v.estado_documental==='DISPONIBLE'&&v.id_documento_logico!==null))throw new ErrorAplicacion(409,'La aceptación requiere un PDF documental confirmado');
      const grupo=cot.grupos_alternativas_b2c.find(g=>g.estado==='ABIERTO');
      if(!grupo||grupo.revision!==revisionGrupo||!grupo.id_alternativa_seleccionada)throw new ErrorAplicacion(409,'Selecciona una alternativa vigente y recarga su revisión');
      const alternativa=grupo.alternativas.find(a=>a.id_alternativa_b2c===grupo.id_alternativa_seleccionada);
      if(!alternativa||alternativa.estado!=='PROPUESTA')throw new ErrorAplicacion(409,'La alternativa seleccionada no está disponible');
      const compatibles=cot.detalle_cotizacion.filter(d=>d.tipo_linea_comercial==='PRODUCTO'&&d.id_extension_producto_comercial===alternativa.id_extension_producto_comercial&&d.id_producto_comercial_version===alternativa.id_producto_comercial_version&&d.id_precio_producto_comercial===alternativa.id_precio_producto_comercial&&d.id_alternativa_b2c_aceptada===null);
      if(compatibles.length!==1)throw new ErrorAplicacion(409,'La alternativa aceptada debe corresponder exactamente a una partida física ya emitida; requiere rectificación comercial');
      const aceptada=await tx.alternativa_b2c.update({where:{id_alternativa_b2c:alternativa.id_alternativa_b2c},data:{estado:'ACEPTADA',decidida_en:new Date(),decidida_por:actorId,motivo_decision:motivo,revision:{increment:1}}});
      const snapshotAnterior=compatibles[0].snapshot_comercial&&typeof compatibles[0].snapshot_comercial==='object'&&!Array.isArray(compatibles[0].snapshot_comercial)?compatibles[0].snapshot_comercial as Prisma.JsonObject:{};
      await tx.detalle_cotizacion.update({where:{id_detalle_cotizacion:compatibles[0].id_detalle_cotizacion},data:{
        id_alternativa_b2c_aceptada:alternativa.id_alternativa_b2c,
        cantidad_item:alternativa.cantidad,
        precio_unitario_autorizado:alternativa.precio_unitario,
        subtotal_item_estimado:alternativa.monto_neto,
        snapshot_comercial:{...snapshotAnterior,alternativaAceptada:{id:alternativa.id_alternativa_b2c.toString(),numero:alternativa.numero_alternativa,cantidad:alternativa.cantidad.toString(),precioUnitario:alternativa.precio_unitario.toString(),montoNeto:alternativa.monto_neto.toString(),montoImpuesto:alternativa.monto_impuesto.toString(),montoTotal:alternativa.monto_total.toString(),configuracion:alternativa.configuracion_snapshot}} as Prisma.InputJsonValue,
        revision:{increment:1},
      }});
      await tx.cotizacion.update({where:{id_cotizacion:idCotizacion},data:{monto_neto:alternativa.monto_neto,monto_impuesto:alternativa.monto_impuesto,monto_total_estimado:alternativa.monto_total,precio_sugerido:alternativa.monto_neto,revision:{increment:1}}});
      await tx.historial_decision_alternativa_b2c.create({data:{id_alternativa_b2c:aceptada.id_alternativa_b2c,estado_anterior:'PROPUESTA',estado_nuevo:'ACEPTADA',motivo,actor_id:actorId}});
      for(const otra of grupo.alternativas.filter(a=>a.estado==='PROPUESTA'&&a.id_alternativa_b2c!==aceptada.id_alternativa_b2c)){await tx.alternativa_b2c.update({where:{id_alternativa_b2c:otra.id_alternativa_b2c},data:{estado:'RECHAZADA',decidida_en:new Date(),decidida_por:actorId,motivo_decision:'No seleccionada al aceptar la alternativa contratada',revision:{increment:1}}});await tx.historial_decision_alternativa_b2c.create({data:{id_alternativa_b2c:otra.id_alternativa_b2c,estado_anterior:'PROPUESTA',estado_nuevo:'RECHAZADA',motivo:'No seleccionada al aceptar la alternativa contratada',actor_id:actorId}});}
      const grupoFinal=await tx.grupo_alternativas_b2c.update({where:{id_grupo_alternativas_b2c:grupo.id_grupo_alternativas_b2c},data:{estado:'DECIDIDO',revision:{increment:1},actualizado_en:new Date()}});
      const salida={idCotizacion,idAlternativa:aceptada.id_alternativa_b2c.toString(),idDetalle:compatibles[0].id_detalle_cotizacion,revisionGrupo:grupoFinal.revision};
      await tx.idempotencia_operacion_comercial.update({where:{clave},data:{respuesta:salida,completado_en:new Date()}});
      return auditableM9(salida,undefined,{alternativa:salida.idAlternativa,detalle:salida.idDetalle});
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  async reactivarCotizacion(idCotizacion: number, entrada: Entrada) {
    const fecha = texto(entrada.fechaVigencia, 20); if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || fecha <= fechaNegocio()) throw new ErrorAplicacion(400, 'La nueva vigencia debe ser posterior a hoy');
    return prisma.$transaction(async tx => {
      const cot = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion } }); if (!cot || cot.estado_cotizacion !== 'vencida') throw new ErrorAplicacion(409, 'La Cotización no está vencida');
      await tx.cotizacion_version.create({ data: { id_cotizacion: idCotizacion, motivo: 'Reactivación de Cotización vencida', antecedentes: { fechaAnterior: cot.fecha_vigencia?.toISOString() || null } } });
      return tx.cotizacion.update({ where: { id_cotizacion: idCotizacion }, data: { fecha_vigencia: new Date(`${fecha}T00:00:00Z`), estado_cotizacion: 'emitida' } });
    });
  }

  async formalizarClienteB2C(entrada: Entrada) {
    const id = identificador(entrada.idCliente); const rut = validarYNormalizarRut(texto(entrada.rut,15));
    const nombre = texto(entrada.nombre,150); const telefono = texto(entrada.telefono,30);
    if (!rut) throw new ErrorAplicacion(400, 'El RUT es obligatorio para formalizar');
    if (!nombre || !telefono) throw new ErrorAplicacion(400, 'Nombre y teléfono son obligatorios para formalizar');
    return prisma.$transaction(async tx => {
      const cliente = await tx.cliente_financiero.findUnique({ where: { id_cliente_financiero: id }, include: { tipo_cliente_financiero: true, ficha_cliente: true } });
      if (!cliente || cliente.tipo_cliente_financiero.nombre_tipo_cliente_financiero.toUpperCase() !== 'B2C' || cliente.nivel_formalizacion !== 'provisional') throw new ErrorAplicacion(409, 'El cliente no está disponible para formalización B2C');
      const idCotizacion = entrada.idCotizacion ? identificador(entrada.idCotizacion) : undefined;
      if (idCotizacion) { const cotizacion = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion } }); if (!cotizacion || cotizacion.estado_cotizacion !== 'borrador' || cotizacion.id_ficha_cliente !== cliente.ficha_cliente?.id_ficha_cliente) throw new ErrorAplicacion(409, 'La Cotización ya no está disponible o no pertenece al cliente'); }
      const existente = await tx.cliente_financiero.findFirst({ where: { rut_cliente: { in: variantesRut(rut), mode: 'insensitive' }, id_cliente_financiero: { not: id } } }); if (existente) throw new ErrorAplicacion(409, 'El RUT ya está asociado a otro cliente');
      await tx.cliente.upsert({ where: { cliente_cliente_rut: rut }, update: { cliente_razon_social: nombre, cliente_contacto_principal: texto(entrada.contacto,150) || undefined, cliente_correo: texto(entrada.correo,150) || undefined, cliente_telefono: telefono }, create: { cliente_cliente_rut: rut, cliente_razon_social: nombre, cliente_contacto_principal: texto(entrada.contacto,150) || null, cliente_correo: texto(entrada.correo,150) || null, cliente_telefono: telefono, cliente_es_cliente_b2c: true, cliente_es_cliente_b2b: false } });
      const actualizado = await tx.cliente_financiero.update({ where: { id_cliente_financiero: id }, data: { rut_cliente: rut, nivel_formalizacion: 'formal', nombre_razon_social_referencia: nombre, correo_financiero: texto(entrada.correo,150) || undefined, telefono_financiero: telefono, contacto_financiero: texto(entrada.contacto,150) || undefined } });
      return { mensaje: 'Cliente B2C formalizado', cliente: actualizado, idCotizacion };
    });
  }

  async configurarEtapasCobro(idNota: number, entrada: Entrada) {
    if (!Array.isArray(entrada.etapas) || !entrada.etapas.length) throw new ErrorAplicacion(400, 'Define al menos una etapa de cobro');
    return prisma.$transaction(async tx => {
      const nota = await tx.nota_venta.findUnique({ where: { id_nota_venta: idNota } }); if (!nota) throw new ErrorAplicacion(404, 'Nota de Venta no encontrada');
      await tx.hito_cobro.deleteMany({ where: { id_nota_venta: idNota } });
      const permitidas = ['anticipo', 'abono parcial', 'pago final'];
      const etapas = (entrada.etapas as Entrada[]).map(e => { const descripcion=texto(e.descripcion,150); const fecha=texto(e.fecha,20); const monto=numeroNoNegativo(e.monto,'Monto etapa'); if(!descripcion || !permitidas.includes(descripcion.toLowerCase()) || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new ErrorAplicacion(400,'Etapa inválida: usa Anticipo, Abono parcial o Pago final'); return { id_nota_venta:idNota, descripcion_hito:descripcion, fecha_programada_cobro:new Date(`${fecha}T00:00:00Z`), monto_programado:monto }; });
      if (new Set(etapas.map(e => e.descripcion_hito.toLowerCase())).size !== etapas.length) throw new ErrorAplicacion(400, 'No repitas una etapa de cobro');
      return tx.hito_cobro.createMany({ data: etapas });
    });
  }
  async registrarReversion(tx:Prisma.TransactionClient,idNota:number,entrada:Entrada,responsable:string) {
    const nota=await tx.nota_venta.findUnique({where:{id_nota_venta:idNota},include:incluirNota});
    if(!nota || !nota.asignacion_pago_cliente.length || ['anulada','cerrada','revertida_total'].includes(nota.estado_nota_venta)) throw new ErrorAplicacion(409,'La reversión requiere una NV vigente con pagos asociados');
    const monto=new Prisma.Decimal(numeroNoNegativo(entrada.monto,'Monto a revertir'));const actual=calcularNota(nota);
    if(monto.lte(0)||monto.gt(actual.montoComercialVigente)||!monto.eq(numeroNoNegativo(entrada.montoDocumento,'Monto indicado en la Nota de Crédito'))) throw new ErrorAplicacion(400,'Monto de reversión inconsistente con la Nota de Crédito');
    const motivo=texto(entrada.motivo,2000),folio=texto(entrada.folio,100);
    if(!motivo||!folio||entrada.confirmacionMontoPdf!==true)throw new ErrorAplicacion(400,'Completa motivo, folio y revisión del monto del PDF');
    const respaldo=texto(entrada.respaldoPdf,4500000);
    if(!respaldo.startsWith('data:application/pdf;base64,'))throw new ErrorAplicacion(400,'Adjunta la Nota de Crédito PDF');
    const bytes=Buffer.from(respaldo.split(',')[1] || '', 'base64');
    if(bytes.length>3000000 || !bytes.subarray(0,5).equals(Buffer.from('%PDF-')) || !bytes.subarray(-1024).includes(Buffer.from('%%EOF'))) throw new ErrorAplicacion(400,'Archivo PDF no válido');
    const reversion=await tx.reversion_nota_venta.create({data:{id_nota_venta:idNota,monto,motivo,folio_nota_credito:folio,respaldo_pdf:respaldo,responsable}});
    await tx.nota_venta.update({where:{id_nota_venta:idNota},data:{estado_nota_venta:monto.eq(actual.montoComercialVigente)?'revertida_total':'revertida_parcial'}});
    return reversion;
  }
  async listarInventario() {
    const materiales = await prisma.historial_precio_material.findMany({ where: { estado_precio: 'vigente' }, include: { material: true, moneda: true } });
    return materiales.map(material => ({ id_historial_precio_material: material.id_historial_precio_material,
      sku: material.material_sku, nombre: material.material.material_nombre_material,
      precio_unitario: material.precio_unitario.toNumber(), moneda: material.moneda.codigo_moneda,
    }));
  }
  async listarProductos() { return prisma.item_comercial.findMany({ where: { estado_item: 'activo' } }); }
  async listarFamiliasProductoComercial(consulta: Entrada = {}) {
    const busqueda = texto(consulta.busqueda, 150);
    const estado = texto(consulta.estado || 'TODAS', 20).toUpperCase();
    if (estado !== 'TODAS' && !ESTADOS_FAMILIA_COMERCIAL.includes(estado as typeof ESTADOS_FAMILIA_COMERCIAL[number])) throw new ErrorAplicacion(400, 'Estado de familia inválido');
    return prisma.familia_producto_comercial.findMany({
      where: {
        ...(estado === 'TODAS' ? {} : { estado }),
        ...(busqueda ? { OR: [{ codigo: { contains: busqueda, mode: 'insensitive' } }, { nombre: { contains: busqueda, mode: 'insensitive' } }] } : {}),
      },
      include: { _count: { select: { productos: true } } }, orderBy: [{ estado: 'asc' }, { nombre: 'asc' }],
    });
  }
  async crearFamiliaProductoComercial(entrada: Entrada, usuario: bigint) {
    const codigo = codigoCatalogo(entrada.codigo, 40, 'El código de familia');
    const nombre = texto(entrada.nombre, 150); if (!nombre) throw new ErrorAplicacion(400, 'El nombre de la familia es obligatorio');
    const descripcion = texto(entrada.descripcion, 2000) || null;
    try {
      const creada = await prisma.$transaction(async tx => {
        const familia = await tx.familia_producto_comercial.create({ data: { codigo, nombre, descripcion, creado_por: usuario, actualizado_por: usuario } });
        await tx.historial_familia_producto_comercial.create({ data: { id_familia_producto_comercial: familia.id_familia_producto_comercial, evento: 'CREACION', valor_nuevo: { codigo, nombre, descripcion, estado: familia.estado }, usuario_id_usuario: usuario } });
        return familia;
      });
      return auditableM9(creada, undefined, { id: creada.id_familia_producto_comercial, codigo, nombre, estado: creada.estado });
    } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe una familia con ese código'); throw error; }
  }
  async actualizarFamiliaProductoComercial(id: number, entrada: Entrada, usuario: bigint) {
    const revision = revisionEntrada(entrada.revision);
    return prisma.$transaction(async tx => {
      const actual = await tx.familia_producto_comercial.findUnique({ where: { id_familia_producto_comercial: id } });
      if (!actual) throw new ErrorAplicacion(404, 'Familia comercial no encontrada');
      const codigo = entrada.codigo === undefined ? actual.codigo : codigoCatalogo(entrada.codigo, 40, 'El código de familia');
      const nombre = entrada.nombre === undefined ? actual.nombre : texto(entrada.nombre, 150); if (!nombre) throw new ErrorAplicacion(400, 'El nombre de la familia es obligatorio');
      const descripcion = entrada.descripcion === undefined ? actual.descripcion : texto(entrada.descripcion, 2000) || null;
      try {
        const cambio = await tx.familia_producto_comercial.updateMany({ where: { id_familia_producto_comercial: id, revision }, data: { codigo, nombre, descripcion, actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
        if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La familia cambió mientras la editabas; vuelve a cargarla');
        const actualizada = await tx.familia_producto_comercial.findUniqueOrThrow({ where: { id_familia_producto_comercial: id } });
        await tx.historial_familia_producto_comercial.create({ data: { id_familia_producto_comercial: id, evento: 'MODIFICACION', valor_anterior: { codigo: actual.codigo, nombre: actual.nombre, descripcion: actual.descripcion }, valor_nuevo: { codigo, nombre, descripcion }, motivo: texto(entrada.motivo, 2000) || null, usuario_id_usuario: usuario } });
        return auditableM9(actualizada, { codigo: actual.codigo, nombre: actual.nombre }, { codigo, nombre });
      } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe una familia con ese código'); throw error; }
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
  async cambiarEstadoFamiliaProductoComercial(id: number, activar: boolean, entrada: Entrada, usuario: bigint) {
    const revision = revisionEntrada(entrada.revision); const motivo = motivoObligatorio(entrada.motivo); const estado = activar ? 'ACTIVA' : 'INACTIVA';
    return prisma.$transaction(async tx => {
      const actual = await tx.familia_producto_comercial.findUnique({ where: { id_familia_producto_comercial: id } });
      if (!actual) throw new ErrorAplicacion(404, 'Familia comercial no encontrada');
      if (actual.estado === estado) throw new ErrorAplicacion(409, `La familia ya está ${estado.toLowerCase()}`);
      if (!activar && await tx.extension_producto_comercial.count({ where: { id_familia_producto_comercial: id, estado: { not: 'INACTIVO' } } })) throw new ErrorAplicacion(409, 'No se puede desactivar una familia con productos activos');
      const cambio = await tx.familia_producto_comercial.updateMany({ where: { id_familia_producto_comercial: id, revision }, data: { estado, actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La familia cambió mientras la editabas; vuelve a cargarla');
      const actualizada = await tx.familia_producto_comercial.findUniqueOrThrow({ where: { id_familia_producto_comercial: id } });
      await tx.historial_familia_producto_comercial.create({ data: { id_familia_producto_comercial: id, evento: activar ? 'REACTIVACION' : 'DESACTIVACION', valor_anterior: { estado: actual.estado }, valor_nuevo: { estado }, motivo, usuario_id_usuario: usuario } });
      return auditableM9(actualizada, { estado: actual.estado }, { estado });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
  async historialFamiliaProductoComercial(id: number) {
    const familia = await prisma.familia_producto_comercial.findUnique({ where: { id_familia_producto_comercial: id }, include: { productos: { select: { id_extension_producto_comercial: true, codigo_comercial: true, nombre_comercial: true, estado: true } }, historial: { include: { usuario: { select: { usuario_id_usuario: true, usuario_username: true } } }, orderBy: { fecha_evento: 'desc' } } } });
    if (!familia) throw new ErrorAplicacion(404, 'Familia comercial no encontrada');
    return familia;
  }
  async listarProductosComerciales(consulta: Entrada = {}) {
    const busqueda = texto(consulta.busqueda, 200); const estado = texto(consulta.estado || 'TODOS', 20).toUpperCase();
    if (estado !== 'TODOS' && !ESTADOS_PRODUCTO_COMERCIAL.includes(estado as typeof ESTADOS_PRODUCTO_COMERCIAL[number])) throw new ErrorAplicacion(400, 'Estado de producto inválido');
    const idFamilia = consulta.familia ? identificador(consulta.familia) : undefined;
    return prisma.extension_producto_comercial.findMany({ where: { ...(estado === 'TODOS' ? {} : { estado }), ...(idFamilia ? { id_familia_producto_comercial: idFamilia } : {}), ...(busqueda ? { OR: [{ codigo_comercial: { contains: busqueda, mode: 'insensitive' } }, { nombre_comercial: { contains: busqueda, mode: 'insensitive' } }] } : {}) }, include: { familia: true, item_comercial: true, producto_terminado: true }, orderBy: [{ estado: 'asc' }, { nombre_comercial: 'asc' }] });
  }
  private datosProductoComercial(entrada: Entrada, actual?: Entrada) {
    const codigo_comercial = entrada.codigoComercial === undefined ? actual?.codigo_comercial : codigoCatalogo(entrada.codigoComercial, 60, 'El código comercial');
    const nombre_comercial = entrada.nombreComercial === undefined ? actual?.nombre_comercial : texto(entrada.nombreComercial, 200);
    if (!nombre_comercial) throw new ErrorAplicacion(400, 'El nombre comercial es obligatorio');
    const id_familia_producto_comercial = entrada.idFamilia === undefined ? actual?.id_familia_producto_comercial : identificador(entrada.idFamilia);
    return {
      codigo_comercial, nombre_comercial, id_familia_producto_comercial,
      subfamilia: entrada.subfamilia === undefined ? actual?.subfamilia : texto(entrada.subfamilia, 120) || null,
      tipo_producto: entrada.tipoProducto === undefined ? actual?.tipo_producto : texto(entrada.tipoProducto, 100) || null,
      descripcion_general: entrada.descripcionGeneral === undefined ? actual?.descripcion_general : texto(entrada.descripcionGeneral, 8000) || null,
      descripcion_b2b: entrada.descripcionB2b === undefined ? actual?.descripcion_b2b : texto(entrada.descripcionB2b, 8000) || null,
      descripcion_b2c: entrada.descripcionB2c === undefined ? actual?.descripcion_b2c : texto(entrada.descripcionB2c, 8000) || null,
      observaciones: entrada.observaciones === undefined ? actual?.observaciones : texto(entrada.observaciones, 4000) || null,
      garantia_referencial: entrada.garantiaReferencial === undefined ? actual?.garantia_referencial : texto(entrada.garantiaReferencial, 4000) || null,
      condiciones_particulares: entrada.condicionesParticulares === undefined ? actual?.condiciones_particulares : texto(entrada.condicionesParticulares, 4000) || null,
      caracteristicas_destacadas: entrada.caracteristicasDestacadas === undefined ? actual?.caracteristicas_destacadas : caracteristicasDestacadas(entrada.caracteristicasDestacadas),
      caracteristicas_tecnicas: entrada.caracteristicasTecnicas === undefined ? actual?.caracteristicas_tecnicas : caracteristicasTecnicas(entrada.caracteristicasTecnicas),
    };
  }
  async crearProductoComercial(entrada: Entrada, usuario: bigint) {
    const datos = this.datosProductoComercial(entrada);
    try {
      const creado = await prisma.$transaction(async tx => {
        const familia = await tx.familia_producto_comercial.findFirst({ where: { id_familia_producto_comercial: datos.id_familia_producto_comercial, estado: 'ACTIVA' } });
        if (!familia) throw new ErrorAplicacion(409, 'Selecciona una familia activa');
        const producto = await tx.extension_producto_comercial.create({ data: { ...datos, creado_por: usuario, actualizado_por: usuario } });
        await tx.historial_producto_comercial.create({ data: { id_extension_producto_comercial: producto.id_extension_producto_comercial, evento: 'CREACION', valor_nuevo: { codigo: producto.codigo_comercial, nombre: producto.nombre_comercial, estado: producto.estado }, usuario_id_usuario: usuario } });
        return producto;
      });
      return auditableM9(creado, undefined, { id: creado.id_extension_producto_comercial, codigo: creado.codigo_comercial, nombre: creado.nombre_comercial, estado: creado.estado });
    } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe un producto con ese código comercial'); throw error; }
  }
  async actualizarProductoComercial(id: number, entrada: Entrada, usuario: bigint) {
    const revision = revisionEntrada(entrada.revision);
    try { return await prisma.$transaction(async tx => {
      const actual = await tx.extension_producto_comercial.findUnique({ where: { id_extension_producto_comercial: id } });
      if (!actual) throw new ErrorAplicacion(404, 'Producto comercial no encontrado');
      if (actual.estado === 'INACTIVO') throw new ErrorAplicacion(409, 'Reactiva el producto antes de modificarlo');
      const datos = this.datosProductoComercial(entrada, actual);
      const familia = await tx.familia_producto_comercial.findFirst({ where: { id_familia_producto_comercial: datos.id_familia_producto_comercial, estado: 'ACTIVA' } });
      if (!familia) throw new ErrorAplicacion(409, 'Selecciona una familia activa');
      const cambio = await tx.extension_producto_comercial.updateMany({ where: { id_extension_producto_comercial: id, revision }, data: { ...datos, actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'El producto cambió mientras lo editabas; vuelve a cargarlo');
      const actualizado = await tx.extension_producto_comercial.findUniqueOrThrow({ where: { id_extension_producto_comercial: id } });
      await tx.historial_producto_comercial.create({ data: { id_extension_producto_comercial: id, evento: 'MODIFICACION_BORRADOR', valor_anterior: { revision: actual.revision, codigo: actual.codigo_comercial, nombre: actual.nombre_comercial }, valor_nuevo: { revision: actualizado.revision, codigo: actualizado.codigo_comercial, nombre: actualizado.nombre_comercial }, motivo: texto(entrada.motivo, 2000) || null, usuario_id_usuario: usuario } });
      return auditableM9(actualizado, { revision: actual.revision, codigo: actual.codigo_comercial, nombre: actual.nombre_comercial }, { revision: actualizado.revision, codigo: actualizado.codigo_comercial, nombre: actualizado.nombre_comercial });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); } catch (error) { if (error instanceof ErrorAplicacion) throw error; if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002','P2034'].includes(error.code)) throw new ErrorAplicacion(409, 'El producto cambió concurrentemente o el código ya está en uso'); throw error; }
  }
  async cambiarEstadoProductoComercial(id: number, activar: boolean, entrada: Entrada, usuario: bigint) {
    const revision = revisionEntrada(entrada.revision); const motivo = motivoObligatorio(entrada.motivo);
    return prisma.$transaction(async tx => {
      const actual = await tx.extension_producto_comercial.findUnique({ where: { id_extension_producto_comercial: id } }); if (!actual) throw new ErrorAplicacion(404, 'Producto comercial no encontrado');
      const estado = activar ? (actual.id_item_comercial ? 'VINCULADO' : 'BORRADOR') : 'INACTIVO';
      if (actual.estado === estado) throw new ErrorAplicacion(409, `El producto ya está ${estado.toLowerCase()}`);
      const cambio = await tx.extension_producto_comercial.updateMany({ where: { id_extension_producto_comercial: id, revision }, data: { estado, actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'El producto cambió mientras lo editabas; vuelve a cargarlo');
      const actualizado = await tx.extension_producto_comercial.findUniqueOrThrow({ where: { id_extension_producto_comercial: id } });
      await tx.historial_producto_comercial.create({ data: { id_extension_producto_comercial: id, evento: activar ? 'REACTIVACION' : 'DESACTIVACION', valor_anterior: { estado: actual.estado }, valor_nuevo: { estado }, motivo, usuario_id_usuario: usuario } });
      return auditableM9(actualizado, { estado: actual.estado }, { estado });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
  async vincularProductoComercial(id: number, entrada: Entrada, usuario: bigint) {
    const revision = revisionEntrada(entrada.revision); const motivo = motivoObligatorio(entrada.motivo);
    const idItem = entrada.idItemComercial === null || entrada.idItemComercial === '' ? null : identificador(entrada.idItemComercial);
    const idInventario = entrada.idProductoTerminado === null || entrada.idProductoTerminado === '' ? null : BigInt(identificador(entrada.idProductoTerminado));
    try { return await prisma.$transaction(async tx => {
      const actual = await tx.extension_producto_comercial.findUnique({ where: { id_extension_producto_comercial: id } }); if (!actual) throw new ErrorAplicacion(404, 'Producto comercial no encontrado');
      if (actual.estado === 'INACTIVO') throw new ErrorAplicacion(409, 'Reactiva el producto antes de administrar sus vínculos');
      if (idItem && !await tx.item_comercial.findFirst({ where: { id_item_comercial: idItem, estado_item: 'activo' } })) throw new ErrorAplicacion(409, 'El ítem comercial no existe o no está activo');
      if (idInventario && !await tx.producto_terminado.findFirst({ where: { producto_terminado_id_producto: idInventario, producto_terminado_activo: { not: false } } })) throw new ErrorAplicacion(409, 'El producto terminado no existe o no está activo');
      const estado = idItem ? 'VINCULADO' : 'BORRADOR';
      const cambio = await tx.extension_producto_comercial.updateMany({ where: { id_extension_producto_comercial: id, revision }, data: { id_item_comercial: idItem, producto_terminado_id_producto: idInventario, estado, actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'El producto cambió mientras lo editabas; vuelve a cargarlo');
      const actualizado = await tx.extension_producto_comercial.findUniqueOrThrow({ where: { id_extension_producto_comercial: id } });
      const anterior = { idItemComercial: actual.id_item_comercial, idProductoTerminado: actual.producto_terminado_id_producto?.toString() || null, estado: actual.estado };
      const nuevo = { idItemComercial: idItem, idProductoTerminado: idInventario?.toString() || null, estado };
      await tx.historial_producto_comercial.create({ data: { id_extension_producto_comercial: id, evento: 'CAMBIO_VINCULACION', valor_anterior: anterior, valor_nuevo: nuevo, motivo, usuario_id_usuario: usuario } });
      return auditableM9(actualizado, anterior, nuevo);
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); } catch (error) { if (error instanceof ErrorAplicacion) throw error; if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'El registro de Terreno o Inventario ya está vinculado a otra ficha comercial'); if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') throw new ErrorAplicacion(409, 'La vinculación cambió concurrentemente'); throw error; }
  }
  async publicarVersionProductoComercial(id: number, entrada: Entrada, usuario: bigint) {
    const revision = revisionEntrada(entrada.revision); const motivo = motivoObligatorio(entrada.motivo); const vigencia = fechaComercial(entrada.vigenciaDesde);
    try { return await prisma.$transaction(async tx => {
      const producto = await tx.extension_producto_comercial.findUnique({ where: { id_extension_producto_comercial: id }, include: { familia: true, item_comercial: true } });
      if (!producto) throw new ErrorAplicacion(404, 'Producto comercial no encontrado');
      if (producto.estado !== 'VINCULADO' || !producto.id_item_comercial || producto.item_comercial?.estado_item !== 'activo') throw new ErrorAplicacion(409, 'Sólo un producto vinculado a un ítem operativo activo puede publicarse');
      if (producto.familia.estado !== 'ACTIVA') throw new ErrorAplicacion(409, 'La familia debe estar activa para publicar');
      const numero = (await tx.producto_comercial_version.aggregate({ where: { id_extension_producto_comercial: id }, _max: { numero_version: true } }))._max.numero_version ?? 0;
      const version = await tx.producto_comercial_version.create({ data: { id_extension_producto_comercial: id, numero_version: numero + 1, codigo_comercial: producto.codigo_comercial, nombre_comercial: producto.nombre_comercial, id_familia_producto_comercial: producto.id_familia_producto_comercial, codigo_familia: producto.familia.codigo, nombre_familia: producto.familia.nombre, subfamilia: producto.subfamilia, tipo_producto: producto.tipo_producto, descripcion_general: producto.descripcion_general, descripcion_b2b: producto.descripcion_b2b, descripcion_b2c: producto.descripcion_b2c, observaciones: producto.observaciones, garantia_referencial: producto.garantia_referencial, condiciones_particulares: producto.condiciones_particulares, caracteristicas_destacadas: producto.caracteristicas_destacadas as Prisma.InputJsonValue, caracteristicas_tecnicas: producto.caracteristicas_tecnicas as Prisma.InputJsonValue, id_item_comercial: producto.id_item_comercial, producto_terminado_id_producto: producto.producto_terminado_id_producto, vigencia_desde: vigencia, motivo, usuario_id_usuario: usuario } });
      const cambio = await tx.extension_producto_comercial.updateMany({ where: { id_extension_producto_comercial: id, revision }, data: { numero_version_vigente: version.numero_version, actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'El producto cambió mientras se publicaba; vuelve a cargarlo');
      await tx.historial_producto_comercial.create({ data: { id_extension_producto_comercial: id, evento: 'PUBLICACION_VERSION', valor_anterior: { version: producto.numero_version_vigente }, valor_nuevo: { version: version.numero_version, vigenciaDesde: vigencia.toISOString().slice(0, 10) }, motivo, usuario_id_usuario: usuario } });
      return auditableM9(version, { version: producto.numero_version_vigente }, { version: version.numero_version, vigenciaDesde: vigencia.toISOString().slice(0, 10) });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }); } catch (error) { if (error instanceof ErrorAplicacion) throw error; if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002','P2034'].includes(error.code)) throw new ErrorAplicacion(409, 'Otra publicación modificó el producto; vuelve a cargarlo'); throw error; }
  }
  async obtenerProductoComercial(id: number, incluirHistorial = false) {
    const producto = await prisma.extension_producto_comercial.findUnique({ where: { id_extension_producto_comercial: id }, include: { familia: true, item_comercial: true, producto_terminado: true, versiones: { orderBy: { numero_version: 'desc' } }, ...(incluirHistorial ? { historial: { include: { usuario: { select: { usuario_id_usuario: true, usuario_username: true } } }, orderBy: { fecha_evento: 'desc' as const } } } : {}) } });
    if (!producto) throw new ErrorAplicacion(404, 'Producto comercial no encontrado');
    return producto;
  }
  async catalogosVinculacionProductoComercial() {
    const [items, productos] = await Promise.all([
      prisma.item_comercial.findMany({ select: { id_item_comercial: true, nombre_item: true, tipo_item: true, estado_item: true }, orderBy: { nombre_item: 'asc' } }),
      prisma.producto_terminado.findMany({ select: { producto_terminado_id_producto: true, producto_terminado_codigo_producto: true, producto_terminado_nombre_producto: true, producto_terminado_tipo_producto: true, producto_terminado_activo: true }, orderBy: { producto_terminado_nombre_producto: 'asc' } }),
    ]);
    return { itemsTerreno: items, productosInventario: productos.map(producto => ({ ...producto, producto_terminado_id_producto: producto.producto_terminado_id_producto.toString() })) };
  }
  async listarTareasFabricacion(consulta: Entrada = {}) {
    const estado = texto(consulta.estado || 'TODAS', 20).toUpperCase();
    if (![...ESTADOS_TAREA_FABRICACION, 'TODAS'].includes(estado as typeof ESTADOS_TAREA_FABRICACION[number] | 'TODAS')) throw new ErrorAplicacion(400, 'Estado de tarea inválido');
    const idArea = consulta.idArea ? BigInt(identificador(consulta.idArea)) : null;
    const busqueda = texto(consulta.busqueda, 150);
    return prisma.catalogo_tarea_fabricacion.findMany({
      where: {
        ...(estado === 'TODAS' ? {} : { estado }),
        ...(idArea ? { id_area_trabajo: idArea } : {}),
        ...(busqueda ? { OR: [{ nombre: { contains: busqueda, mode: 'insensitive' } }, { descripcion: { contains: busqueda, mode: 'insensitive' } }] } : {}),
      },
      include: { area: { select: { area_trabajo_id_area: true, area_trabajo_nombre_area: true, area_trabajo_activo: true } } },
      orderBy: [{ estado: 'asc' }, { nombre: 'asc' }],
    });
  }
  async crearTareaFabricacion(entrada: Entrada, usuario: bigint) {
    const nombre = texto(entrada.nombre, 150);
    if (!nombre) throw new ErrorAplicacion(400, 'El nombre de la tarea es obligatorio');
    const idArea = BigInt(identificador(entrada.idArea));
    const area = await prisma.area_trabajo.findFirst({ where: { area_trabajo_id_area: idArea, area_trabajo_activo: true } });
    if (!area) throw new ErrorAplicacion(400, 'Selecciona un área activa');
    try {
      const creada = await prisma.catalogo_tarea_fabricacion.create({ data: { nombre, descripcion: texto(entrada.descripcion, 4000) || null, id_area_trabajo: idArea, tiempo_estimado_min: minutosOpcionales(entrada.tiempoEstimadoMin), creado_por: usuario, actualizado_por: usuario }, include: { area: true } });
      return auditableM9(creada, undefined, { id: creada.id_tarea_fabricacion, nombre, idArea: idArea.toString(), estado: creada.estado });
    } catch (error) { if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe una tarea con ese nombre en el área'); throw error; }
  }
  async actualizarTareaFabricacion(id: number, entrada: Entrada, usuario: bigint) {
    const nombre = texto(entrada.nombre, 150);
    if (!nombre) throw new ErrorAplicacion(400, 'El nombre de la tarea es obligatorio');
    const revision = revisionEntrada(entrada.revision);
    const idArea = BigInt(identificador(entrada.idArea));
    try {
      return await prisma.$transaction(async tx => {
        const actual = await tx.catalogo_tarea_fabricacion.findUnique({ where: { id_tarea_fabricacion: id } });
        if (!actual) throw new ErrorAplicacion(404, 'Tarea de fabricación no encontrada');
        const area = await tx.area_trabajo.findFirst({ where: { area_trabajo_id_area: idArea, area_trabajo_activo: true } });
        if (!area) throw new ErrorAplicacion(400, 'Selecciona un área activa');
        const cambio = await tx.catalogo_tarea_fabricacion.updateMany({ where: { id_tarea_fabricacion: id, revision }, data: { nombre, descripcion: texto(entrada.descripcion, 4000) || null, id_area_trabajo: idArea, tiempo_estimado_min: minutosOpcionales(entrada.tiempoEstimadoMin), actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
        if (!cambio.count) throw new ErrorAplicacion(409, 'La tarea fue modificada por otra persona; vuelve a cargarla');
        const actualizada = await tx.catalogo_tarea_fabricacion.findUniqueOrThrow({ where: { id_tarea_fabricacion: id }, include: { area: true } });
        return auditableM9(actualizada, { nombre: actual.nombre, idArea: actual.id_area_trabajo.toString(), tiempoEstimadoMin: actual.tiempo_estimado_min }, { nombre, idArea: idArea.toString(), tiempoEstimadoMin: actualizada.tiempo_estimado_min });
      });
    } catch (error) { if (error instanceof ErrorAplicacion) throw error; if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ErrorAplicacion(409, 'Ya existe una tarea con ese nombre en el área'); throw error; }
  }
  async cambiarEstadoTareaFabricacion(id: number, activar: boolean, entrada: Entrada, usuario: bigint) {
    const revision = revisionEntrada(entrada.revision);
    const estado = activar ? 'ACTIVA' : 'INACTIVA';
    const cambio = await prisma.catalogo_tarea_fabricacion.updateMany({ where: { id_tarea_fabricacion: id, revision }, data: { estado, actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
    if (!cambio.count) {
      if (!await prisma.catalogo_tarea_fabricacion.count({ where: { id_tarea_fabricacion: id } })) throw new ErrorAplicacion(404, 'Tarea de fabricación no encontrada');
      throw new ErrorAplicacion(409, 'La tarea fue modificada por otra persona; vuelve a cargarla');
    }
    const actualizada = await prisma.catalogo_tarea_fabricacion.findUniqueOrThrow({ where: { id_tarea_fabricacion: id }, include: { area: true } });
    return auditableM9(actualizada, undefined, { estado });
  }
  private async normalizarPlantillaFabricacion(entrada: Entrada, tx: Prisma.TransactionClient): Promise<{ etapas: EtapaFabricacion[]; medidasObligatorias: string[] }> {
    if (!Array.isArray(entrada.etapas) || entrada.etapas.length > 60) throw new ErrorAplicacion(400, 'La plantilla debe contener una lista de hasta 60 etapas');
    const etapasEntrada = entrada.etapas as Entrada[];
    const idsArea = [...new Set(etapasEntrada.map(etapa => BigInt(identificador(etapa.idArea)).toString()))];
    const areas = idsArea.length ? await tx.area_trabajo.findMany({ where: { area_trabajo_id_area: { in: idsArea.map(BigInt) }, area_trabajo_activo: true } }) : [];
    const mapaAreas = new Map(areas.map(area => [area.area_trabajo_id_area.toString(), area]));
    if (mapaAreas.size !== idsArea.length) throw new ErrorAplicacion(400, 'Todas las etapas deben pertenecer a áreas activas');
    const idsCatalogo = [...new Set(etapasEntrada.flatMap(etapa => Array.isArray(etapa.tareas) ? (etapa.tareas as Entrada[]).map(tarea => tarea.idTareaFabricacion ? identificador(tarea.idTareaFabricacion) : null) : []).filter((id): id is number => id !== null))];
    const catalogadas = idsCatalogo.length ? await tx.catalogo_tarea_fabricacion.findMany({ where: { id_tarea_fabricacion: { in: idsCatalogo }, estado: 'ACTIVA' } }) : [];
    const mapaTareas = new Map(catalogadas.map(tarea => [tarea.id_tarea_fabricacion, tarea]));
    if (mapaTareas.size !== idsCatalogo.length) throw new ErrorAplicacion(400, 'Existe una tarea catalogada inexistente o inactiva');
    const etapas: EtapaFabricacion[] = etapasEntrada.map((etapa, indice) => {
      const idAreaTrabajo = BigInt(identificador(etapa.idArea)).toString();
      const area = mapaAreas.get(idAreaTrabajo)!;
      const nombre = texto(etapa.nombre, 150);
      if (!nombre) throw new ErrorAplicacion(400, `El nombre de la etapa ${indice + 1} es obligatorio`);
      if (!Array.isArray(etapa.tareas) || etapa.tareas.length > 100) throw new ErrorAplicacion(400, `Las tareas de la etapa ${indice + 1} no son válidas`);
      const tareas = (etapa.tareas as Entrada[]).map((tarea, posicion): TareaEtapaFabricacion => {
        const idCatalogo = tarea.idTareaFabricacion ? identificador(tarea.idTareaFabricacion) : null;
        const catalogada = idCatalogo ? mapaTareas.get(idCatalogo) : null;
        if (catalogada && catalogada.id_area_trabajo.toString() !== idAreaTrabajo) throw new ErrorAplicacion(400, `La tarea ${catalogada.nombre} no pertenece al área de su etapa`);
        const nombreTarea = catalogada?.nombre || texto(tarea.nombre, 150);
        if (!nombreTarea) throw new ErrorAplicacion(400, `La tarea particular ${posicion + 1} de la etapa ${indice + 1} requiere nombre`);
        return { id: idEdicion(tarea.id), idTareaFabricacion: idCatalogo, nombre: nombreTarea, descripcion: catalogada?.descripcion || texto(tarea.descripcion, 4000) || null, instrucciones: texto(tarea.instrucciones, 4000) || null, tiempoEstimadoMin: minutosOpcionales(tarea.tiempoEstimadoMin ?? catalogada?.tiempo_estimado_min, 'Tiempo estimado de tarea') };
      });
      return { id: idEdicion(etapa.id), orden: indice + 1, idAreaTrabajo, nombreArea: area.area_trabajo_nombre_area || `Área ${idAreaTrabajo}`, nombre, descripcion: texto(etapa.descripcion, 4000) || null, instrucciones: texto(etapa.instrucciones, 4000) || null, tiempoEstimadoMin: minutosOpcionales(etapa.tiempoEstimadoMin, 'Tiempo estimado de etapa'), tareas };
    });
    const medidasEntrada = entrada.medidasObligatorias === undefined ? [...MEDIDAS_OBLIGATORIAS_HEREDADAS] : entrada.medidasObligatorias;
    if (!Array.isArray(medidasEntrada) || !medidasEntrada.length || medidasEntrada.length > CAMPOS_MEDIDAS_RECTIFICACION.length) throw new ErrorAplicacion(400, 'Selecciona al menos una medida obligatoria para la rectificación');
    if (medidasEntrada.some(campo => typeof campo !== 'string' || !CAMPOS_MEDIDAS_RECTIFICACION.includes(campo as typeof CAMPOS_MEDIDAS_RECTIFICACION[number]))) throw new ErrorAplicacion(400, 'La plantilla contiene una medida obligatoria no admitida');
    const medidasObligatorias = [...new Set(medidasEntrada as string[])];
    if (medidasObligatorias.length !== medidasEntrada.length) throw new ErrorAplicacion(400, 'Las medidas obligatorias no pueden repetirse');
    return { etapas, medidasObligatorias };
  }
  async obtenerPlantillaFabricacionFamilia(idFamilia: number, incluirHistorial = false) {
    const familia = await prisma.familia_producto_comercial.findUnique({ where: { id_familia_producto_comercial: idFamilia }, select: { id_familia_producto_comercial: true, codigo: true, nombre: true, estado: true } });
    if (!familia) throw new ErrorAplicacion(404, 'Familia comercial no encontrada');
    const plantilla = await prisma.plantilla_fabricacion_familia.findUnique({ where: { id_familia_producto_comercial: idFamilia }, include: { ...(incluirHistorial ? { versiones: { orderBy: { numero_version: 'desc' as const }, include: { publicador: { select: { usuario_username: true } } } } } : {}) } });
    return { familia, plantilla: plantilla || null };
  }
  async guardarBorradorPlantillaFabricacion(idFamilia: number, entrada: Entrada, usuario: bigint) {
    return prisma.$transaction(async tx => {
      const familia = await tx.familia_producto_comercial.findFirst({ where: { id_familia_producto_comercial: idFamilia, estado: 'ACTIVA' } });
      if (!familia) throw new ErrorAplicacion(404, 'Familia comercial activa no encontrada');
      const borrador = await this.normalizarPlantillaFabricacion(entrada, tx);
      const existente = await tx.plantilla_fabricacion_familia.findUnique({ where: { id_familia_producto_comercial: idFamilia } });
      if (!existente) {
        const creada = await tx.plantilla_fabricacion_familia.create({ data: { id_familia_producto_comercial: idFamilia, borrador: borrador as unknown as Prisma.InputJsonValue, creado_por: usuario, actualizado_por: usuario } });
        return auditableM9(creada, undefined, { familia: idFamilia, etapas: borrador.etapas.length, revision: creada.revision });
      }
      const revision = revisionEntrada(entrada.revision);
      const cambio = await tx.plantilla_fabricacion_familia.updateMany({ where: { id_plantilla_fabricacion: existente.id_plantilla_fabricacion, revision }, data: { borrador: borrador as unknown as Prisma.InputJsonValue, actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
      if (!cambio.count) throw new ErrorAplicacion(409, 'El borrador fue modificado por otra persona; vuelve a cargarlo');
      const actualizada = await tx.plantilla_fabricacion_familia.findUniqueOrThrow({ where: { id_plantilla_fabricacion: existente.id_plantilla_fabricacion } });
      return auditableM9(actualizada, { revision: existente.revision }, { etapas: borrador.etapas.length, revision: actualizada.revision });
    });
  }
  async publicarPlantillaFabricacion(idFamilia: number, entrada: Entrada, usuario: bigint) {
    const motivo = motivoObligatorio(entrada.motivo);
    try {
      return await prisma.$transaction(async tx => {
        const plantilla = await tx.plantilla_fabricacion_familia.findUnique({ where: { id_familia_producto_comercial: idFamilia } });
        if (!plantilla) throw new ErrorAplicacion(404, 'Guarda primero un borrador de la plantilla');
        const revision = revisionEntrada(entrada.revision);
        if (plantilla.revision !== revision) throw new ErrorAplicacion(409, 'El borrador cambió antes de publicarse; vuelve a cargarlo');
        const borrador = plantilla.borrador as { etapas?: unknown[] };
        if (!Array.isArray(borrador.etapas) || !borrador.etapas.length) throw new ErrorAplicacion(400, 'La plantilla debe tener al menos una etapa antes de publicarse');
        const numeroVersion = (plantilla.numero_version_vigente || 0) + 1;
        const contenido = { ...(plantilla.borrador as Prisma.JsonObject), familia: { id: idFamilia }, numeroVersion } as Prisma.InputJsonObject;
        const version = await tx.version_plantilla_fabricacion.create({ data: { id_plantilla_fabricacion: plantilla.id_plantilla_fabricacion, numero_version: numeroVersion, contenido, motivo, publicado_por: usuario } });
        const cambio = await tx.plantilla_fabricacion_familia.updateMany({ where: { id_plantilla_fabricacion: plantilla.id_plantilla_fabricacion, revision }, data: { numero_version_vigente: numeroVersion, actualizado_por: usuario, actualizado_en: new Date(), revision: { increment: 1 } } });
        if (!cambio.count) throw new ErrorAplicacion(409, 'El borrador cambió antes de publicarse; vuelve a cargarlo');
        return auditableM9(version, { version: plantilla.numero_version_vigente }, { version: numeroVersion, etapas: borrador.etapas.length });
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    } catch (error) { if (error instanceof ErrorAplicacion) throw error; if (error instanceof Prisma.PrismaClientKnownRequestError && ['P2002', 'P2034'].includes(error.code)) throw new ErrorAplicacion(409, 'Otra publicación actualizó la plantilla; vuelve a cargarla'); throw error; }
  }
  async listarMonedas() { return prisma.moneda.findMany({ where: { estado_moneda: 'activo', codigo_moneda: { in: ['CLP', 'USD'] } } }); }
  async consultarResumen() {
    const [notas, cotizacionesPendientes] = await Promise.all([
      prisma.nota_venta.findMany({ include: incluirNota }),
      prisma.cotizacion.count({ where: { estado_cotizacion: { in: ['borrador', 'emitida'] } } }),
    ]);
    const saldosPorMoneda = resumirNotas(notas);
    const consolidadoClp = consolidarNotasClp(notas);
    return { ingresosTotales: consolidadoClp.montoComercialVigente, cotizacionesPendientes, saldosPorMoneda, consolidadoClp };
  }
  async consultarBandeja(historial = false) {
    const [cotizaciones, notas, stocks, entradas] = await Promise.all([
      prisma.cotizacion.findMany({ where: { estado_cotizacion: { in: historial ? ['aprobada', 'anulada', 'rechazada', 'descartada', 'vencida'] : ['borrador', 'emitida'] } }, include: incluirCotizacion, orderBy: { fecha_emision: 'desc' } }),
      prisma.nota_venta.findMany({ where: { estado_nota_venta: { in: historial ? ['confirmada', 'anulada', 'cerrada', 'revertida_parcial', 'revertida_total'] : ['emitida'] } }, include: { ...incluirNota, ficha_cliente: { include: { cliente_financiero: true } } }, orderBy: { fecha_emision: 'desc' } }),
      prisma.inventario_bodega.findMany(),
      prisma.detalle_material_orden_compra_m5.findMany(),
    ]);
    const disponibilidad = new Map<string, number>();
    for (const stock of stocks) disponibilidad.set(stock.material_sku, (disponibilidad.get(stock.material_sku) || 0) + Number(stock.inventario_bodega_cantidad_fisica || 0) - Number(stock.inventario_bodega_cantidad_reservada || 0));
    for (const entrada of entradas.filter(item => item.cantidad_recibida.lt(item.cantidad_pedida))) disponibilidad.set(entrada.material_sku, (disponibilidad.get(entrada.material_sku) || 0) + Number(entrada.cantidad_pedida.minus(entrada.cantidad_recibida)));
    const cotizacionesConStock = cotizaciones.map(cotizacion => {
      const requeridos = new Map<string, { material: string | null; cantidad: number }>();
      for (const detalle of cotizacion.detalle_cotizacion) for (const costo of detalle.detalle_costo_material_cotizacion) { const sku = costo.historial_precio_material.material_sku; const actual = requeridos.get(sku) || { material: costo.historial_precio_material.material.material_nombre_material, cantidad: 0 }; actual.cantidad += Number(costo.cantidad_material_estimada); requeridos.set(sku, actual); }
      const materialesRevisar = [...requeridos].flatMap(([sku, dato]) => (disponibilidad.get(sku) || 0) < dato.cantidad ? [{ sku, material: dato.material, requerido: dato.cantidad, disponibilidadFutura: disponibilidad.get(sku) || 0 }] : []);
      return { ...cotizacion, advertenciaStock: materialesRevisar.length ? { etiqueta: 'Revisar stock', materiales: materialesRevisar, bloqueaAprobacion: false } : null };
    });
    return { cotizaciones: cotizacionesConStock, notas_venta: notas.map(nota => { const calculo=calcularNota(nota); return { ...nota, estado_pago: calculo.estadoPago, estadoNotaVentaVisible: estadoVisibleNota(nota,calculo.estadoPago), ...calculo }; }) };
  }

  async guardarCotizacion(entrada: Entrada, actorId?: bigint) {
    const rutEntrada = texto(entrada.rut_cliente);
    const rut = rutEntrada ? validarYNormalizarRut(rutEntrada) : null;
    const idFichaCliente = entrada.id_ficha_cliente ? identificador(entrada.id_ficha_cliente) : null;
    if (!rut && !idFichaCliente) throw new ErrorAplicacion(400, 'Selecciona un cliente');
    const fechaVigencia = texto(entrada.fecha_vigencia);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaVigencia) || !Number.isFinite(Date.parse(fechaVigencia)) || fechaVigencia <= fechaNegocio()) throw new ErrorAplicacion(400, 'La vigencia debe ser posterior a hoy');
    const margen = numeroNoNegativo(entrada.margen_esperado, 'Margen');
    if (margen >= 100) throw new ErrorAplicacion(400, 'El margen debe ser menor a 100 para calcular el precio');
    if (!Array.isArray(entrada.productos) || !entrada.productos.length) throw new ErrorAplicacion(400, 'Incluye al menos un producto');
    const idMonedaObjetivo=identificador(entrada.id_moneda);
    const monedaObjetivo=await prisma.moneda.findUnique({where:{id_moneda:idMonedaObjetivo}});
    if(!monedaObjetivo||monedaObjetivo.estado_moneda!=='activo'||!['CLP','USD'].includes(monedaObjetivo.codigo_moneda))throw new ErrorAplicacion(400,'Moneda no habilitada');
    const tipoCambio=await this.resolverTipoCambioCotizacion(monedaObjetivo.codigo_moneda,entrada);
    return prisma.$transaction(async transaccion => {
      const fichaDirecta = idFichaCliente ? await transaccion.ficha_cliente.findUnique({ where: { id_ficha_cliente: idFichaCliente }, include: { cliente_financiero: true } }) : null;
      const coincidencias = fichaDirecta ? [] : await transaccion.cliente_financiero.findMany({ where: { rut_cliente: { in: variantesRut(rut!), mode: 'insensitive' } }, include: { ficha_cliente: true } });
      if (coincidencias.length > 1) throw new ErrorAplicacion(409, 'Hay identidades heredadas duplicadas; revisa el cliente antes de continuar');
      const cliente = fichaDirecta?.cliente_financiero || coincidencias[0];
      if (!cliente || cliente.estado_financiero !== 'activo') throw new ErrorAplicacion(400, 'Cliente no disponible');
      const ficha = fichaDirecta || (cliente as any).ficha_cliente || await transaccion.ficha_cliente.create({ data: { id_cliente_financiero: cliente.id_cliente_financiero } });
      const segmento = segmentoCotizacion(entrada.segmento_comercial);
      if (segmento) {
        const tipoCliente = await transaccion.tipo_cliente_financiero.findUnique({ where: { id_tipo_cliente_financiero: cliente.id_tipo_cliente_financiero } });
        if (tipoCliente?.nombre_tipo_cliente_financiero.toUpperCase() !== segmento) throw new ErrorAplicacion(409, 'El cliente no corresponde al segmento comercial seleccionado');
        if (segmento === 'B2B' && (!cliente.rut_cliente || cliente.nivel_formalizacion !== 'formal')) throw new ErrorAplicacion(409, 'La cotización B2B requiere un cliente formal con RUT');
      }
      const monedaLocal=await transaccion.moneda.findUnique({where:{codigo_moneda:'CLP'}});
      if(!monedaLocal||monedaLocal.estado_moneda!=='activo')throw new ErrorAplicacion(409,'La moneda local CLP no está disponible para costear materiales');
      const productosEntrada = entrada.productos as Entrada[];
      const { costoTotal, precioSugerido: sugeridoClp, detalles } = await construirCosteoCotizacion(transaccion, productosEntrada, monedaLocal, margen);
      const fechaContrato = new Date(`${fechaNegocio()}T00:00:00Z`);
      const contrato = await validarContratoComercialCotizacion(transaccion, entrada, productosEntrada, detalles, monedaObjetivo.id_moneda, fechaContrato);
      const idObraContexto = await resolverObraContexto(transaccion, entrada.id_obra_contexto);
      const sugerido=convertirDesdeClp(sugeridoClp,tipoCambio);
      const detallesConvertidos=contrato?detalles:detalles.map(detalle=>({...detalle,subtotal_item_estimado:convertirDesdeClp(new Prisma.Decimal(detalle.subtotal_item_estimado as Prisma.Decimal),tipoCambio)}));
      const baseCotizacion=contrato?.completo ? contrato.precioBase : sugerido;
      const montos = importes(baseCotizacion, entrada.descuento_tipo, entrada.descuento_valor, entrada.exento_iva);
      const cotizacion=await transaccion.cotizacion.create({ data: {
        id_ficha_cliente: ficha.id_ficha_cliente, id_moneda: monedaObjetivo.id_moneda,
        fecha_emision: new Date(`${fechaNegocio()}T00:00:00Z`), fecha_vigencia: new Date(`${fechaVigencia}T00:00:00Z`),
        subtotal_costos_estimados: costoTotal, margen_esperado: margen, precio_sugerido: baseCotizacion,
        monto_neto: montos.neto, monto_impuesto: montos.impuesto, monto_total_estimado: montos.total,
        descuento_tipo: entrada.descuento_tipo || null, descuento_valor: entrada.descuento_valor || 0,
        exento_iva: entrada.exento_iva, estado_cotizacion: 'borrador', detalle_cotizacion: { create: detallesConvertidos }, detalles_servicio:{create:contrato?.servicios??[]},
        ...(contrato ? { segmento_comercial:contrato.segmento, nombre_proyecto:texto(entrada.nombre_proyecto,200)||null, referencia_comercial:texto(entrada.referencia_comercial,200)||null, alcance_comercial:texto(entrada.alcance_comercial,30)||null, requiere_instalacion:contrato.instalacion.requiere, direccion_instalacion:texto(entrada.direccion_instalacion,500)||null, region_instalacion:texto(entrada.region_instalacion,120)||null, ciudad_instalacion:texto(entrada.ciudad_instalacion,120)||null, comuna_instalacion:texto(entrada.comuna_instalacion,120)||null, estado_cobertura_instalacion:contrato.instalacion.estado, id_tarifa_instalacion_comercial:contrato.instalacion.idTarifa, precio_instalacion_aplicado:contrato.instalacion.precio, id_condicion_comercial_version:contrato.idCondicion, responsable_comercial:actorId, id_obra_contexto:idObraContexto } : {}),
      } });
      await guardarTipoCambioCotizacion(transaccion,cotizacion.id_cotizacion,tipoCambio);
      await sincronizarContactosB2B(transaccion,cotizacion.id_cotizacion,entrada,contrato?.segmento ?? null,actorId);
      await sincronizarAlternativasB2C(transaccion,cotizacion.id_cotizacion,entrada,contrato,monedaObjetivo.id_moneda,actorId);
      const guardada=await transaccion.cotizacion.findUniqueOrThrow({where:{id_cotizacion:cotizacion.id_cotizacion},include:incluirCotizacion});
      return auditableM9(guardada,undefined,{idCotizacion:guardada.id_cotizacion,segmento:guardada.segmento_comercial,revision:guardada.revision,alternativas:guardada.grupos_alternativas_b2c.flatMap(g=>g.alternativas).length,contactosB2b:guardada.contactos_b2b.length,partidasServicio:guardada.detalles_servicio.length});
    });
  }

  async editarCotizacion(idCotizacion: number, entrada: Entrada, actorId?: bigint) {
    const margen = numeroNoNegativo(entrada.margen_esperado, 'Margen');
    if (margen >= 100) throw new ErrorAplicacion(400, 'El margen debe ser menor a 100');
    if (!Array.isArray(entrada.materiales) && !Array.isArray(entrada.productos)) throw new ErrorAplicacion(400, 'Materiales o productos inválidos');
    let tipoCambioEdicion: Prisma.Decimal|null|undefined;
    if(Array.isArray(entrada.productos)){
      const referencia=await prisma.cotizacion.findUnique({where:{id_cotizacion:idCotizacion},select:{id_moneda:true}});
      if(!referencia)throw new ErrorAplicacion(404,'Cotización no encontrada');
      const idMonedaObjetivo=entrada.id_moneda?identificador(entrada.id_moneda):referencia.id_moneda;
      const monedaObjetivo=await prisma.moneda.findUnique({where:{id_moneda:idMonedaObjetivo}});
      if(!monedaObjetivo||monedaObjetivo.estado_moneda!=='activo'||!['CLP','USD'].includes(monedaObjetivo.codigo_moneda))throw new ErrorAplicacion(400,'Moneda no habilitada');
      tipoCambioEdicion=await this.resolverTipoCambioCotizacion(monedaObjetivo.codigo_moneda,entrada);
    }
    return prisma.$transaction(async transaccion => {
      const cotizacion = await transaccion.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: incluirCotizacion });
      if (!cotizacion) throw new ErrorAplicacion(404, 'Cotización no encontrada');
      if (cotizacion.estado_cotizacion !== 'borrador') throw new ErrorAplicacion(409, 'Sólo se puede editar un Borrador; las condiciones emitidas se conservan');
      if (entrada.revision !== undefined && identificador(entrada.revision) !== cotizacion.revision) throw new ErrorAplicacion(409, 'El borrador fue actualizado por otra sesión; recarga antes de guardar');

      if (Array.isArray(entrada.productos)) {
        const fechaVigencia = texto(entrada.fecha_vigencia || cotizacion.fecha_vigencia?.toISOString().slice(0, 10), 20);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaVigencia) || fechaVigencia < fechaNegocio()) throw new ErrorAplicacion(400, 'La vigencia no puede estar vencida');
        const idFicha = entrada.id_ficha_cliente ? identificador(entrada.id_ficha_cliente) : cotizacion.id_ficha_cliente;
        const ficha = await transaccion.ficha_cliente.findUnique({ where: { id_ficha_cliente: idFicha }, include: { cliente_financiero: true } });
        if (!ficha || ficha.cliente_financiero.estado_financiero !== 'activo') throw new ErrorAplicacion(400, 'Cliente no disponible');
        const segmento = segmentoCotizacion(entrada.segmento_comercial ?? cotizacion.segmento_comercial);
        if (segmento) {
          if (cotizacion.segmento_comercial && cotizacion.segmento_comercial !== segmento) throw new ErrorAplicacion(409, 'El segmento persistido del borrador no puede sustituirse silenciosamente');
          const tipoCliente = await transaccion.tipo_cliente_financiero.findUnique({ where:{ id_tipo_cliente_financiero:ficha.cliente_financiero.id_tipo_cliente_financiero } });
          if (tipoCliente?.nombre_tipo_cliente_financiero.toUpperCase() !== segmento) throw new ErrorAplicacion(409, 'El cliente no corresponde al segmento comercial seleccionado');
          if (segmento === 'B2B' && (!ficha.cliente_financiero.rut_cliente || ficha.cliente_financiero.nivel_formalizacion !== 'formal')) throw new ErrorAplicacion(409, 'La cotización B2B requiere un cliente formal con RUT');
        }
        const idMoneda = entrada.id_moneda ? identificador(entrada.id_moneda) : cotizacion.id_moneda;
        const moneda = await transaccion.moneda.findUnique({ where: { id_moneda: idMoneda } });
        if (!moneda || moneda.estado_moneda !== 'activo' || !['CLP', 'USD'].includes(moneda.codigo_moneda)) throw new ErrorAplicacion(400, 'Moneda no habilitada');

        const monedaLocal=await transaccion.moneda.findUnique({where:{codigo_moneda:'CLP'}});
        if(!monedaLocal||monedaLocal.estado_moneda!=='activo')throw new ErrorAplicacion(409,'La moneda local CLP no está disponible para costear materiales');
        const productosEntrada=entrada.productos as Entrada[];
        const { costoTotal, precioSugerido: calculadoClp, detalles } = await construirCosteoCotizacion(transaccion, productosEntrada, monedaLocal, margen, true);
        const contrato = await validarContratoComercialCotizacion(transaccion,{...entrada,segmento_comercial:segmento},productosEntrada,detalles,idMoneda,new Date(`${fechaNegocio()}T00:00:00Z`));
        const idObraContexto = await resolverObraContexto(transaccion, entrada.id_obra_contexto, cotizacion.id_obra_contexto, entrada.motivo_cambio_obra);
        const calculado=convertirDesdeClp(calculadoClp,tipoCambioEdicion??null);
        const nuevosDetalles=contrato?detalles:detalles.map(detalle=>({...detalle,subtotal_item_estimado:convertirDesdeClp(new Prisma.Decimal(detalle.subtotal_item_estimado as Prisma.Decimal),tipoCambioEdicion??null)}));
        const precioDefinido = contrato?.completo ? contrato.precioBase : (entrada.precio_sugerido === undefined ? calculado : new Prisma.Decimal(numeroNoNegativo(entrada.precio_sugerido, 'Precio definido')));
        const descuentoTipo = entrada.descuento_tipo || null;
        const descuentoValor = entrada.descuento_valor ?? 0;
        const exento = typeof entrada.exento_iva === 'boolean' ? entrada.exento_iva : cotizacion.exento_iva;
        const montos = importes(precioDefinido, descuentoTipo, descuentoValor, exento);
        await transaccion.detalle_costo_material_cotizacion.deleteMany({ where: { detalle_cotizacion: { id_cotizacion: idCotizacion } } });
        await transaccion.detalle_cotizacion.deleteMany({ where: { id_cotizacion: idCotizacion } });
        await transaccion.detalle_servicio_cotizacion.deleteMany({where:{id_cotizacion:idCotizacion}});
        await transaccion.cotizacion.update({ where: { id_cotizacion: idCotizacion }, data: { id_ficha_cliente: idFicha, id_moneda: idMoneda, fecha_vigencia: new Date(`${fechaVigencia}T00:00:00Z`), margen_esperado: margen, subtotal_costos_estimados: costoTotal, precio_sugerido: precioDefinido, monto_neto: montos.neto, monto_impuesto: montos.impuesto, monto_total_estimado: montos.total, descuento_tipo: descuentoTipo as string | null, descuento_valor: numeroNoNegativo(descuentoValor, 'Descuento'), exento_iva: exento, observacion: texto(entrada.observacion, 2000) || null, revision:{increment:1}, detalle_cotizacion: { create: nuevosDetalles }, detalles_servicio:{create:contrato?.servicios??[]}, ...(contrato ? { segmento_comercial:contrato.segmento, nombre_proyecto:texto(entrada.nombre_proyecto,200)||null, referencia_comercial:texto(entrada.referencia_comercial,200)||null, alcance_comercial:texto(entrada.alcance_comercial,30)||null, requiere_instalacion:contrato.instalacion.requiere, direccion_instalacion:texto(entrada.direccion_instalacion,500)||null, region_instalacion:texto(entrada.region_instalacion,120)||null, ciudad_instalacion:texto(entrada.ciudad_instalacion,120)||null, comuna_instalacion:texto(entrada.comuna_instalacion,120)||null, estado_cobertura_instalacion:contrato.instalacion.estado, id_tarifa_instalacion_comercial:contrato.instalacion.idTarifa, precio_instalacion_aplicado:contrato.instalacion.precio, id_condicion_comercial_version:contrato.idCondicion, responsable_comercial:actorId ?? cotizacion.responsable_comercial, id_obra_contexto:idObraContexto } : {}) } });
        await guardarTipoCambioCotizacion(transaccion,idCotizacion,tipoCambioEdicion??null);
        await sincronizarContactosB2B(transaccion,idCotizacion,entrada,contrato?.segmento ?? segmento,actorId ?? undefined);
        await sincronizarAlternativasB2C(transaccion,idCotizacion,entrada,contrato,idMoneda,actorId);
        const guardada=await transaccion.cotizacion.findUniqueOrThrow({where:{id_cotizacion:idCotizacion},include:incluirCotizacion});
        return auditableM9(guardada,{revision:cotizacion.revision,contactosB2b:cotizacion.contactos_b2b.length,partidasServicio:cotizacion.detalles_servicio.length},{revision:guardada.revision,segmento:guardada.segmento_comercial,alternativas:guardada.grupos_alternativas_b2c.flatMap(g=>g.alternativas).length,contactosB2b:guardada.contactos_b2b.length,partidasServicio:guardada.detalles_servicio.length});
      }

      const detalles = cotizacion.detalle_cotizacion;
      const primero = detalles[0];
      const idsMaterialesCotizacion = new Set(detalles.flatMap(detalle => detalle.detalle_costo_material_cotizacion.map(material => material.id_detalle_costo_material_cotizacion)));
      const cantidades = new Map<number, number>();
      for (const material of entrada.materiales) {
        const id = identificador(material.id_detalle_costo_material_cotizacion);
        if (cantidades.has(id) || !idsMaterialesCotizacion.has(id)) throw new ErrorAplicacion(400, 'Material ajeno o duplicado');
        const cantidad = numeroNoNegativo(material.cantidad, 'Cantidad');
        if (!cantidad) throw new ErrorAplicacion(400, 'La cantidad debe ser mayor a cero');
        cantidades.set(id, cantidad);
      }
      let costoTotal = new Prisma.Decimal(0);
      let sugerido = new Prisma.Decimal(0);
      const monedaLocal=await transaccion.moneda.findUnique({where:{codigo_moneda:'CLP'}});
      if(!monedaLocal)throw new ErrorAplicacion(409,'La moneda local CLP no está disponible para costear materiales');
      const tipoCambio=await obtenerTipoCambioCotizacion(transaccion,idCotizacion,cotizacion.moneda.codigo_moneda);
      for (const detalle of detalles) {
        let costo = new Prisma.Decimal(0);
        if (!detalle.detalle_costo_material_cotizacion.length) throw new ErrorAplicacion(409, 'El borrador no tiene un costeo completo; requiere la edición ampliada de M2');
        for (const material of detalle.detalle_costo_material_cotizacion) {
          if(material.historial_precio_material.id_moneda!==monedaLocal.id_moneda)throw new ErrorAplicacion(409,'El borrador debe actualizar sus materiales a costos locales CLP');
          const cantidad = cantidades.get(material.id_detalle_costo_material_cotizacion) ?? material.cantidad_material_estimada;
          const override = material.id_detalle_costo_material_cotizacion === identificador(entrada.materiales.find((m: Entrada) => m.id_detalle_costo_material_cotizacion)?.id_detalle_costo_material_cotizacion || material.id_detalle_costo_material_cotizacion)
            ? entrada.materiales.find((m: Entrada) => m.id_detalle_costo_material_cotizacion === material.id_detalle_costo_material_cotizacion)?.costo_ajustado
            : undefined;
          const precioUsado = override === undefined ? material.precio_unitario_usado : new Prisma.Decimal(numeroNoNegativo(override, 'Costo ajustado'));
          const subtotal = precioUsado.mul(cantidad).mul(detalle.cantidad_item).toDecimalPlaces(2);
          costo = costo.plus(subtotal);
          if (cantidades.has(material.id_detalle_costo_material_cotizacion)) await transaccion.detalle_costo_material_cotizacion.update({ where: { id_detalle_costo_material_cotizacion: material.id_detalle_costo_material_cotizacion }, data: { cantidad_material_estimada: cantidad, precio_unitario_usado: precioUsado, subtotal_material_estimado: subtotal, ...(override === undefined ? {} : { observacion: `Costo original ${material.precio_unitario_usado.toString()}; ajuste autorizado` }) } });
        }
        const subtotalClp = costo.div(new Prisma.Decimal(1).minus(new Prisma.Decimal(margen).div(100))).toDecimalPlaces(2);
        const subtotal=convertirDesdeClp(subtotalClp,tipoCambio);
        costoTotal = costoTotal.plus(costo);
        sugerido = sugerido.plus(subtotal);
        await transaccion.detalle_cotizacion.update({ where: { id_detalle_cotizacion: detalle.id_detalle_cotizacion }, data: { subtotal_item_estimado: subtotal, ...(detalle === primero ? { observacion_medidas: texto(entrada.observacion, 2000) } : {}) } });
      }
      const precioDefinido = entrada.precio_sugerido === undefined ? sugerido : new Prisma.Decimal(numeroNoNegativo(entrada.precio_sugerido, 'Precio definido'));
      if (precioDefinido.lte(0)) throw new ErrorAplicacion(400, 'El precio definido debe ser positivo');
      const montos = importes(precioDefinido, cotizacion.descuento_tipo, cotizacion.descuento_valor?.toNumber(), cotizacion.exento_iva);
      return transaccion.cotizacion.update({ where: { id_cotizacion: idCotizacion }, data: { margen_esperado: margen, subtotal_costos_estimados: costoTotal, precio_sugerido: precioDefinido, monto_neto: montos.neto, monto_impuesto: montos.impuesto, monto_total_estimado: montos.total } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async crearVentaDirecta(entrada: Entrada) {
    const idFicha = identificador(entrada.id_cliente);
    const base = numeroNoNegativo(entrada.monto_neto, 'Monto neto');
    if (!base) throw new ErrorAplicacion(400, 'El monto debe ser mayor a cero');
    const montos = importes(new Prisma.Decimal(base), entrada.descuento?.tipo, entrada.descuento?.valor, entrada.exento_iva);
    const codigoMoneda = texto(entrada.moneda).toUpperCase() || 'CLP';
    let tipoCambio: Prisma.Decimal | null = null;
    if (codigoMoneda === 'USD') {
      try {
        tipoCambio = new Prisma.Decimal(await this.bancoCentral.obtenerTipoCambio('USD', fechaNegocio()));
      } catch (error) {
        if (entrada.tipoCambioManual !== true) throw error;
        tipoCambio = new Prisma.Decimal(numeroNoNegativo(entrada.tipoCambio, 'Tipo de cambio manual'));
      }
      if (!tipoCambio.isFinite() || tipoCambio.lte(0)) throw new ErrorAplicacion(400, 'El tipo de cambio USD/CLP debe ser mayor a cero');
    }
    return prisma.$transaction(async transaccion => {
      const ficha = await transaccion.ficha_cliente.findUnique({ where: { id_ficha_cliente: idFicha }, include: { cliente_financiero: true } });
      if (!ficha || ficha.cliente_financiero.estado_financiero !== 'activo' || ficha.cliente_financiero.nivel_formalizacion !== 'formal') throw new ErrorAplicacion(400, 'La venta directa requiere cliente activo y formal');
      const moneda = await transaccion.moneda.findUnique({ where: { codigo_moneda: codigoMoneda } });
      if (!moneda || moneda.estado_moneda !== 'activo' || !['CLP', 'USD'].includes(moneda.codigo_moneda)) throw new ErrorAplicacion(400, 'Moneda no habilitada');
      const detalle = Array.isArray(entrada.detalle) ? entrada.detalle.map((linea: Entrada) => ({ tipo: texto(linea.tipo, 40), descripcion: texto(linea.descripcion, 500), cantidad: numeroNoNegativo(linea.cantidad ?? 1, 'Cantidad'), valor: numeroNoNegativo(linea.valor, 'Valor'), idItemComercial: linea.idItemComercial ? identificador(linea.idItemComercial) : undefined, idProyecto: linea.idProyecto ? identificador(linea.idProyecto) : undefined })) : [];
      if (!detalle.length || detalle.some(linea => !['producto','servicio','reparacion','trabajo posterior','adicional'].includes(linea.tipo.toLowerCase()) || !linea.descripcion || linea.cantidad <= 0 || linea.valor <= 0)) throw new ErrorAplicacion(400, 'Incluye al menos una línea comercial válida');
      const sumaDetalle = detalle.reduce((suma, linea) => suma + linea.cantidad * linea.valor, 0);
      if (detalle.length && Math.abs(sumaDetalle - base) > 0.01) throw new ErrorAplicacion(400, 'El monto neto no coincide con el detalle comercial');
      const idsItem = [...new Set(detalle.flatMap(linea => linea.idItemComercial ? [linea.idItemComercial] : []))];
      if (idsItem.length && await transaccion.item_comercial.count({ where: { id_item_comercial: { in: idsItem }, estado_item: 'activo' } }) !== idsItem.length) throw new ErrorAplicacion(400, 'Uno de los ítems comerciales no existe o está inactivo');
      const idsProyecto = [...new Set(detalle.flatMap(linea => linea.idProyecto ? [linea.idProyecto] : []))];
      if (idsProyecto.length) { const proyectos = await transaccion.proyecto.findMany({ where: { proyecto_proyecto_id: { in: idsProyecto.map(BigInt) } }, select: { proyecto_proyecto_id: true, proyecto_estado_operacional: true } }); if (proyectos.length !== idsProyecto.length || proyectos.some(proyecto => proyecto.proyecto_estado_operacional?.toLowerCase() !== 'activo')) throw new ErrorAplicacion(409, 'El proyecto seleccionado no existe o no está activo'); }
      const proyectoContexto = idsProyecto.length === 1 ? BigInt(idsProyecto[0]) : undefined;
      return transaccion.nota_venta.create({ data: {
        id_ficha_cliente: idFicha, id_moneda: moneda.id_moneda, numero_nota_venta: `NVD-${randomUUID()}`,
        fecha_emision: new Date(`${fechaNegocio()}T00:00:00Z`), monto_neto: montos.neto, monto_impuesto: montos.impuesto,
        monto_total: montos.total, tipo_cambio_usado: tipoCambio, monto_convertido: tipoCambio ? montos.total.mul(tipoCambio).toDecimalPlaces(2) : null,
        descuento_aplicado: montos.descuento, exento_iva: entrada.exento_iva,
        estado_nota_venta: 'emitida', estado_pago: 'pendiente', id_proyecto_contexto: proyectoContexto, observacion: JSON.stringify({ detalleComercial: detalle, persistencia: 'auxiliar_hasta_detalle_nv_estructurado' }),
      } });
    });
  }
  async confirmarNotaVenta(idNota:number){
    return prisma.$transaction(async transaccion=>{
      const nota=await transaccion.nota_venta.findUnique({where:{id_nota_venta:idNota}});
      if(!nota)throw new ErrorAplicacion(404,'Nota de Venta no encontrada');
      if(nota.estado_nota_venta!=='emitida')throw new ErrorAplicacion(409,'Sólo se puede confirmar una Nota de Venta emitida');
      const documento=await transaccion.nota_venta.update({
        where:{id_nota_venta:idNota},data:{estado_nota_venta:'confirmada'},
        include:{...incluirNota,ficha_cliente:{include:{cliente_financiero:true}}},
      });
      return {mensaje:'Nota de Venta confirmada',documento};
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }
  async anularVenta(idNota: number, entrada: Entrada) {
    return prisma.$transaction(async transaccion => {
      const nota = await transaccion.nota_venta.findUnique({ where: { id_nota_venta: idNota }, include: { asignacion_pago_cliente: true, aplicacion_saldo_favor: true } });
      if (!nota) throw new ErrorAplicacion(404, 'Nota de Venta no encontrada');
      if (nota.asignacion_pago_cliente.length || nota.aplicacion_saldo_favor.length) throw new ErrorAplicacion(409, 'Tiene pagos asociados: utiliza la reversión comercial desde el detalle de la Nota de Venta');
      if (!['emitida', 'confirmada'].includes(nota.estado_nota_venta)) throw new ErrorAplicacion(409, 'Nota de Venta no disponible para anular');
      await transaccion.nota_venta.update({ where: { id_nota_venta: idNota }, data: {
        estado_nota_venta: 'anulada', fecha_anulacion: new Date(), motivo_anulacion: texto(entrada.motivo || 'Anulación confirmada desde la Vista', 2000),
      } });
      return { message: 'Nota de Venta anulada; antecedentes históricos conservados' };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
  async registrarDocumento(entrada: Entrada) {
    const folio = texto(entrada.folio, 80); const tipoEntrada = texto(entrada.tipo_documento,80);
    if (!folio || !tipoEntrada) throw new ErrorAplicacion(400, 'Tipo y folio son obligatorios');
    return prisma.$transaction(async transaccion => {
      if (entrada.tipo_documento === 'guia_despacho') {
        const idNota = identificador(entrada.id_nota_venta);
        const nota = await transaccion.nota_venta.findUnique({ where: { id_nota_venta: idNota } });
        if (!nota || ['anulada', 'revertida_total', 'provisional'].includes(nota.estado_nota_venta)) throw new ErrorAplicacion(409, 'Nota de Venta no disponible');
        const documento = await transaccion.guia_despacho.create({ data: { id_nota_venta: idNota, folio, fecha_emision: new Date() } });
        return { message: 'Guía vinculada', documento };
      }

      const idsRecibidos = Array.isArray(entrada.ids_notas_venta) ? entrada.ids_notas_venta : [entrada.id_nota_venta];
      const idsNotas = [...new Set(idsRecibidos.map(identificador))];
      const notas = await transaccion.nota_venta.findMany({ where: { id_nota_venta: { in: idsNotas } } });
      if (!idsNotas.length || notas.length !== idsNotas.length || notas.some(nota => ['anulada','revertida_total','provisional'].includes(nota.estado_nota_venta))) throw new ErrorAplicacion(409, 'Una de las Notas de Venta no está disponible');
      const primera = notas[0]!;
      if (notas.some(nota => nota.id_ficha_cliente !== primera.id_ficha_cliente || nota.id_moneda !== primera.id_moneda)) throw new ErrorAplicacion(409, 'Las Notas de Venta deben pertenecer al mismo cliente y moneda');

      const nombreTipo = texto(entrada.nombre_tipo_documento || tipoEntrada,80);
      const tipo = entrada.id_tipo_documento
        ? await transaccion.tipo_documento.findFirst({ where: { id_tipo_documento: identificador(entrada.id_tipo_documento), estado_tipo_documento: 'activo', aplica_venta: true } })
        : await transaccion.tipo_documento.findFirst({ where: { nombre_tipo_documento: { equals: nombreTipo === 'factura' ? 'Factura Electrónica' : nombreTipo, mode: 'insensitive' }, estado_tipo_documento: 'activo', aplica_venta: true } });
      if (!tipo) throw new ErrorAplicacion(409, 'Selecciona un tipo de documento de venta configurado');
      const fechaEmision = texto(entrada.fecha_emision,20); const fechaVencimiento = texto(entrada.fecha_vencimiento,20);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaEmision) || !Number.isFinite(Date.parse(fechaEmision))) throw new ErrorAplicacion(400, 'Fecha de emisión inválida');
      if (tipo.requiere_vencimiento && (!/^\d{4}-\d{2}-\d{2}$/.test(fechaVencimiento) || !Number.isFinite(Date.parse(fechaVencimiento)))) throw new ErrorAplicacion(400, 'Fecha de vencimiento obligatoria o inválida');
      const neto = new Prisma.Decimal(numeroNoNegativo(entrada.monto_neto,'Monto neto')); const impuesto = new Prisma.Decimal(numeroNoNegativo(entrada.monto_impuesto,'Monto impuesto')); const total = new Prisma.Decimal(numeroNoNegativo(entrada.monto_total,'Monto total'));
      if (!total.gt(0) || !neto.plus(impuesto).eq(total)) throw new ErrorAplicacion(400, 'Los montos del documento no son coherentes');
      const respaldo = texto(entrada.respaldo,4500000); if (!respaldo) throw new ErrorAplicacion(400, 'El respaldo del documento externo es obligatorio');
      const documento = await transaccion.documento_tributario.create({ data: {
        id_ficha_cliente: primera.id_ficha_cliente, id_nota_venta: primera.id_nota_venta, id_tipo_documento: tipo.id_tipo_documento,
        id_moneda: primera.id_moneda, folio_documento: folio, fecha_emision: new Date(`${fechaEmision}T00:00:00Z`), fecha_vencimiento: fechaVencimiento ? new Date(`${fechaVencimiento}T00:00:00Z`) : null,
        monto_neto: neto, monto_impuesto: impuesto, monto_total: total, respaldo_documento: respaldo, observacion: texto(entrada.observacion,2000) || null,
        documento_tributario_nota_venta: { create: idsNotas.map(id_nota_venta => ({ id_nota_venta })) },
      } });
      return { message: 'Documento tributario externo registrado y vinculado', documento };
    });
  }
  async modificarGuia(idGuia: number, entrada: Entrada) {
    const guia = await prisma.guia_despacho.findUnique({ where: { id_guia_despacho: idGuia } });
    if (!guia) throw new ErrorAplicacion(404, 'Guía de Despacho no encontrada');
    void entrada;
    throw new ErrorAplicacion(409, 'La Guía de Despacho es históricamente inmutable; la corrección requiere CU458 y una fuente documental acreditada', 'M11_GUIA_INMUTABLE');
  }
  async definirCondicionesCobro(idNota: number, entrada: Entrada) {
    const fecha = texto(entrada.fechaVencimiento, 20); if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) throw new ErrorAplicacion(400, 'Fecha de vencimiento inválida');
    return prisma.$transaction(async tx => { const nota = await tx.nota_venta.findUnique({ where: { id_nota_venta: idNota } }); if (!nota) throw new ErrorAplicacion(404, 'Nota de Venta no encontrada'); const condiciones = Array.isArray(entrada.condiciones) ? entrada.condiciones as Entrada[] : []; if (condiciones.some(c => !texto(c.descripcion, 200))) throw new ErrorAplicacion(400, 'Cada condición necesita una descripción'); await tx.condicion_cobro_nv.deleteMany({ where: { id_nota_venta: idNota } }); if (condiciones.length) await tx.condicion_cobro_nv.createMany({ data: condiciones.map(c => ({ id_nota_venta: idNota, descripcion: texto(c.descripcion, 200), monto_referencia: c.monto === undefined ? undefined : numeroNoNegativo(c.monto, 'Monto condición'), porcentaje_referencia: c.porcentaje === undefined ? undefined : numeroNoNegativo(c.porcentaje, 'Porcentaje condición'), evento_referencia: texto(c.evento, 150) || null })) }); return tx.nota_venta.update({ where: { id_nota_venta: idNota }, data: { fecha_vencimiento: new Date(`${fecha}T00:00:00Z`) } }); });
  }
  async configurarUmbral(entrada: Entrada) {
    const dias = Number(entrada.diasHabiles); if (!Number.isInteger(dias) || dias < 0) throw new ErrorAplicacion(400, 'El umbral debe ser un número de días válido');
    return prisma.$transaction(async tx => {
      const vigente = await tx.config_umbral_por_vencer.findFirst({ orderBy: { fecha: 'desc' } });
      return vigente ? tx.config_umbral_por_vencer.update({ where: { id_configuracion: vigente.id_configuracion }, data: { dias_habiles: dias, fecha: new Date() } }) : tx.config_umbral_por_vencer.create({ data: { dias_habiles: dias } });
    });
  }
  async consultarUmbral() {
    return prisma.$transaction(async tx => {
      const vigente = await tx.config_umbral_por_vencer.findFirst({ orderBy: { fecha: 'desc' } });
      return vigente || tx.config_umbral_por_vencer.create({ data: { dias_habiles: 5 } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
  async descartarBorrador(idCotizacion: number) {
    const resultado = await prisma.cotizacion.updateMany({ where: { id_cotizacion: idCotizacion, estado_cotizacion: 'borrador' }, data: { estado_cotizacion: 'descartada' } });
    if (!resultado.count) throw new ErrorAplicacion(409, 'Sólo se puede descartar una cotización en Borrador');
    return { message: 'Borrador descartado' };
  }
  operacionPendiente(operacion: string): never {
    const explicaciones: Record<string, string> = {
      aprobarCotizacion: 'Para B2C utiliza Consolidar con primer pago; para B2B utiliza la aceptación con Orden de Compra disponible en el detalle',
      aprobarVenta: 'La aprobación genérica antigua no corresponde al flujo I2; la Nota de Venta emitida ya está registrada',
      tipoCambio: 'La conversión corresponde al pago en M3; la fuente del tipo de cambio sigue pendiente',
    };
    throw new ErrorAplicacion(501, explicaciones[operacion] || 'Operación pendiente de implementación por etapa', 'ETAPA_PENDIENTE');
  }
}
