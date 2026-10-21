import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';

type Entrada = Record<string, unknown>;
export type LineaCantidadM11 = { idLinea: string; cantidad: number; moneda?: string | null; monto?: number | null; compartido?: boolean };
type LineaCantidad = LineaCantidadM11;
export type FuenteSalidaAcreditadaM11 = { acreditada: true; owner: string; referencia: string; lineas: LineaCantidad[] } | null;

const requerido = (valor: unknown, nombre: string, maximo = 4000) => {
  if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > maximo) throw new ErrorAplicacion(400, `${nombre} es obligatorio`);
  return valor.trim();
};
const idPositivo = (valor: unknown, nombre: string) => {
  const numero = Number(valor);
  if (!Number.isSafeInteger(numero) || numero <= 0) throw new ErrorAplicacion(400, `${nombre} inválido`);
  return numero;
};
const normalizarJson = (valor: unknown): Prisma.InputJsonValue => {
  if (valor === null || valor === undefined) return null as unknown as Prisma.InputJsonValue;
  if (typeof valor === 'bigint') return valor.toString();
  if (valor instanceof Date) return valor.toISOString();
  if (Prisma.Decimal.isDecimal(valor)) return valor.toString();
  if (Array.isArray(valor)) return valor.map(normalizarJson);
  if (typeof valor === 'object') return Object.fromEntries(Object.entries(valor).map(([clave, item]) => [clave, normalizarJson(item)]));
  return valor as string | number | boolean;
};
const json = normalizarJson;
const auditable = <T extends object>(salida: T, anterior: Prisma.InputJsonValue | undefined, nuevo: Prisma.InputJsonValue) => {
  Object.defineProperty(salida, '__auditoriaM9', { enumerable: false, value: { anterior, nuevo } });
  return salida;
};

export function conciliarDosEtapasM11(ordenadas: LineaCantidad[], salida: FuenteSalidaAcreditadaM11, facturadas: LineaCantidad[] | null) {
  if (!salida) return {
    estado: 'DATOS_INSUFICIENTES' as const,
    etapaA: { estado: 'DATOS_INSUFICIENTES' as const, motivo: 'El owner de Despacho no aporta una salida física acreditada; GDE y OT no sustituyen esta fuente', diferencias: [] },
    etapaB: { estado: 'DATOS_INSUFICIENTES' as const, motivo: 'Sin salida física acreditada no procede comparar facturación', diferencias: [] },
    hallazgos: [],
  };
  const fisicas = new Map(salida.lineas.map(linea => [linea.idLinea, linea]));
  const diferenciasA: Array<Record<string, unknown>> = ordenadas.flatMap(linea => {
    const fisica = fisicas.get(linea.idLinea);
    if (!fisica) return [{ etapa: 'ORDEN_VS_SALIDA', idLinea: linea.idLinea, tipo: 'SALIDA_FALTANTE', ordenado: linea.cantidad, salida: 0, fuente: salida.referencia }];
    if (fisica.cantidad === linea.cantidad) return [];
    return [{ etapa: 'ORDEN_VS_SALIDA', idLinea: linea.idLinea, tipo: fisica.cantidad > linea.cantidad ? 'EXCESO_SALIDA' : 'SALIDA_PARCIAL', ordenado: linea.cantidad, salida: fisica.cantidad, fuente: salida.referencia }];
  });
  for (const fisica of salida.lineas) if (!ordenadas.some(linea => linea.idLinea === fisica.idLinea)) diferenciasA.push({ etapa: 'ORDEN_VS_SALIDA', idLinea: fisica.idLinea, tipo: 'SALIDA_SIN_LINEA_ORDENADA', ordenado: 0, salida: fisica.cantidad, fuente: salida.referencia });
  if (!facturadas) return {
    estado: diferenciasA.length ? 'DISCREPANCIA' as const : 'DATOS_INSUFICIENTES' as const,
    etapaA: { estado: diferenciasA.length ? 'DISCREPANCIA' as const : 'CONFIRMADO' as const, fuente: { owner: salida.owner, referencia: salida.referencia }, diferencias: diferenciasA },
    etapaB: { estado: 'DATOS_INSUFICIENTES' as const, motivo: 'No existen líneas de facturación acreditadas para comparar', diferencias: [] },
    hallazgos: diferenciasA,
  };
  const facturas = new Map(facturadas.filter(linea => !linea.compartido).map(linea => [linea.idLinea, linea]));
  const compartidas = facturadas.filter(linea => linea.compartido).map(linea => linea.idLinea);
  const diferenciasB: Array<Record<string, unknown>> = salida.lineas.flatMap(fisica => {
    if (compartidas.includes(fisica.idLinea)) return [];
    const factura = facturas.get(fisica.idLinea);
    if (!factura) return [{ etapa: 'SALIDA_VS_FACTURACION', idLinea: fisica.idLinea, tipo: 'FACTURACION_FALTANTE', salida: fisica.cantidad, facturado: 0 }];
    if (fisica.moneda && factura.moneda && fisica.moneda !== factura.moneda) return [{ etapa: 'SALIDA_VS_FACTURACION', idLinea: fisica.idLinea, tipo: 'MONEDA_INCOMPATIBLE', salida: fisica.cantidad, facturado: factura.cantidad }];
    if (factura.cantidad === fisica.cantidad) return [];
    return [{ etapa: 'SALIDA_VS_FACTURACION', idLinea: fisica.idLinea, tipo: factura.cantidad > fisica.cantidad ? 'FACTURACION_EXCESIVA' : 'FACTURACION_PARCIAL', salida: fisica.cantidad, facturado: factura.cantidad }];
  });
  const insuficienteB = compartidas.length > 0;
  return {
    estado: diferenciasA.length || diferenciasB.length ? 'DISCREPANCIA' as const : insuficienteB ? 'PARCIAL' as const : 'CONFIRMADO' as const,
    etapaA: { estado: diferenciasA.length ? 'DISCREPANCIA' as const : 'CONFIRMADO' as const, fuente: { owner: salida.owner, referencia: salida.referencia }, diferencias: diferenciasA },
    etapaB: { estado: diferenciasB.length ? 'DISCREPANCIA' as const : insuficienteB ? 'DATOS_INSUFICIENTES' as const : 'CONFIRMADO' as const, documentosCompartidosSinDistribucion: compartidas, diferencias: diferenciasB },
    hallazgos: [...diferenciasA, ...diferenciasB],
  };
}

export class ServicioDocumentalM11 {
  async consultarCadena(idCotizacion: number) {
    const oc = await prisma.orden_compra_b2b.findUnique({ where: { id_cotizacion: idCotizacion }, include: { lineas: { orderBy: { numero_linea: 'asc' } }, cotizacion: { include: { nota_venta: { include: { guia_despacho: { orderBy: { fecha_emision: 'asc' } }, documento_tributario_nota_venta: { include: { documento_tributario: { include: { moneda: true, tipo_documento: true } } } } } } } } } });
    if (!oc) throw new ErrorAplicacion(404, 'La cotización no posee una Orden de Compra B2B registrada');
    const nota = oc.cotizacion.nota_venta;
    const guias = nota?.guia_despacho ?? [];
    const documentos = nota?.documento_tributario_nota_venta.map(vinculo => vinculo.documento_tributario) ?? [];
    return {
      idCotizacion, ordenCompra: { id: oc.id_orden_compra_b2b, folio: oc.folio, estado: 'DOCUMENTO_EXISTENTE', relacion: 'RELACION_ACREDITADA', lineas: oc.lineas },
      notaVenta: nota ? { id: nota.id_nota_venta, numero: nota.numero_nota_venta, relacion: 'RELACION_ACREDITADA' } : null,
      guias: guias.map(guia => ({ id: guia.id_guia_despacho, folio: guia.folio, fecha: guia.fecha_emision, estado: 'DOCUMENTO_EXISTENTE', relacion: 'RELACION_ACREDITADA', salidaFisica: 'NO_ACREDITADA' })),
      documentosTributarios: documentos.map(documento => ({ id: documento.id_documento_tributario, folio: documento.folio_documento, tipo: documento.tipo_documento.nombre_tipo_documento, moneda: documento.moneda.codigo_moneda, monto: documento.monto_total, estado: 'DOCUMENTO_EXISTENTE', relacion: 'RELACION_ACREDITADA' })),
      eslabones: { guiaDespacho: guias.length ? 'CONFIRMADO' : 'DOCUMENTO_FALTANTE', facturacion: documentos.length ? 'CONFIRMADO' : 'DOCUMENTO_FALTANTE', salidaFisica: 'INFORMACION_INSUFICIENTE' },
      advertenciaFisica: 'Una GDE emitida o una OT terminada no acredita salida física real',
    };
  }

  async consultarConciliacion(idCotizacion: number) {
    const cadena = await this.consultarCadena(idCotizacion);
    const ordenadas: LineaCantidad[] = cadena.ordenCompra.lineas.filter(linea => linea.cantidad !== null).map(linea => ({ idLinea: linea.id_linea_orden_compra_b2b.toString(), cantidad: Number(linea.cantidad), moneda: linea.id_moneda?.toString() }));
    const resultado = conciliarDosEtapasM11(ordenadas, null, null);
    const hallazgos = await prisma.hallazgo_discrepancia_m11.findMany({ where: { id_orden_compra_b2b: cadena.ordenCompra.id }, include: { resoluciones: { orderBy: { creado_en: 'asc' } } }, orderBy: { creado_en: 'desc' } });
    return { ...resultado, cadena, hallazgos, fuenteFisica: { estado: 'DATOS_INSUFICIENTES', contrato: 'CT-07', detalle: 'No existe una fuente persistida del owner de Despacho que acredite salidas físicas' } };
  }

  /** Sólo persiste discrepancias provenientes de una fuente física acreditada; la insuficiencia nunca se convierte en hallazgo. */
  async registrarHallazgosAcreditados(idOrdenCompra: number, resultado: ReturnType<typeof conciliarDosEtapasM11>, actorId?: bigint) {
    if (resultado.estado === 'DATOS_INSUFICIENTES' || !resultado.hallazgos.length) return [];
    const fuente = 'fuente' in resultado.etapaA ? resultado.etapaA.fuente : null;
    if (!fuente || typeof fuente !== 'object' || !('referencia' in fuente)) throw new ErrorAplicacion(409, 'No existe evidencia física acreditada para persistir discrepancias');
    return prisma.$transaction(async tx => {
      const guardados = [];
      for (const hallazgo of resultado.hallazgos) {
        const etapa = String(hallazgo.etapa); const tipo = String(hallazgo.tipo); const idLinea = String(hallazgo.idLinea);
        const clave = `M11:${idOrdenCompra}:${etapa}:${tipo}:${idLinea}:${String(fuente.referencia)}`;
        guardados.push(await tx.hallazgo_discrepancia_m11.upsert({
          where: { clave_idempotencia: clave }, update: {},
          create: { id_orden_compra_b2b: idOrdenCompra, id_linea_orden_compra_b2b: /^\d+$/.test(idLinea) ? BigInt(idLinea) : null, etapa, tipo_discrepancia: tipo, referencias_origen: json(fuente), evidencia: json(hallazgo), contexto: json(resultado), detectado_por: actorId, clave_idempotencia: clave },
        }));
      }
      return guardados;
    });
  }

  async gestionarCorreccion(entrada: Entrada, actorId: bigint) {
    const tipo = requerido(entrada.tipoDocumento, 'Tipo documental', 20).toUpperCase();
    const motivo = requerido(entrada.motivo, 'Motivo'); const respaldo = requerido(entrada.respaldo, 'Respaldo', 4500000);
    const clave = requerido(entrada.claveIdempotencia, 'Clave de idempotencia', 120);
    return prisma.$transaction(async tx => {
      const repetida = await tx.correccion_documental_m11.findUnique({ where: { clave_idempotencia: clave } });
      if (repetida) return repetida;
      if (tipo === 'DTE') {
        const idOriginal = idPositivo(entrada.idDocumentoOriginal, 'Documento original'); const idCorrector = idPositivo(entrada.idDocumentoCorrector, 'Documento corrector');
        if (idOriginal === idCorrector) throw new ErrorAplicacion(400, 'El original y el corrector deben ser documentos distintos');
        const incluirCiclo = { documento_tributario_nota_venta: { select: { id_nota_venta: true } } } as const;
        const [original, corrector] = await Promise.all([tx.documento_tributario.findUnique({ where: { id_documento_tributario: idOriginal }, include: incluirCiclo }), tx.documento_tributario.findUnique({ where: { id_documento_tributario: idCorrector }, include: incluirCiclo })]);
        if (!original || !corrector) throw new ErrorAplicacion(404, 'Documento original o corrector no encontrado');
        if (original.id_ficha_cliente !== corrector.id_ficha_cliente) throw new ErrorAplicacion(409, 'El corrector no corresponde al mismo cliente del original');
        const notasOriginal = new Set([original.id_nota_venta, ...original.documento_tributario_nota_venta.map(v => v.id_nota_venta)].filter((id): id is number => id !== null));
        const mismoCiclo = [corrector.id_nota_venta, ...corrector.documento_tributario_nota_venta.map(v => v.id_nota_venta)].some(id => id !== null && notasOriginal.has(id));
        if (!mismoCiclo) throw new ErrorAplicacion(409, 'El documento corrector no pertenece al mismo ciclo comercial acreditado');
        if (corrector.id_documento_referencia && corrector.id_documento_referencia !== idOriginal) throw new ErrorAplicacion(409, 'El documento corrector ya referencia otro original');
        let cursor = original.id_documento_referencia; const visitados = new Set([idCorrector]);
        while (cursor) { if (visitados.has(cursor)) throw new ErrorAplicacion(409, 'La relación produciría un ciclo documental'); visitados.add(cursor); cursor = (await tx.documento_tributario.findUnique({ where: { id_documento_tributario: cursor }, select: { id_documento_referencia: true } }))?.id_documento_referencia ?? null; }
        await tx.documento_tributario.update({ where: { id_documento_tributario: idCorrector }, data: { id_documento_referencia: idOriginal } });
        const correccion = await tx.correccion_documental_m11.create({ data: { tipo_documento: 'DTE', id_documento_original: idOriginal, id_documento_corrector: idCorrector, actuacion: 'VINCULAR_CORRECTOR_EXISTENTE', motivo, respaldo, actor_id: actorId, clave_idempotencia: clave, snapshot_anterior: json(original), snapshot_resultado: json({ idDocumentoCorrector: idCorrector, idDocumentoReferencia: idOriginal }) } });
        return auditable(correccion, json({ idOriginal, idCorrector, referenciaAnterior: corrector.id_documento_referencia }), json({ idOriginal, idCorrector, referencia: idOriginal }));
      }
      if (tipo === 'GDE') {
        const idGuia = idPositivo(entrada.idGuiaOriginal, 'Guía original');
        const guia = await tx.guia_despacho.findUnique({ where: { id_guia_despacho: idGuia } });
        if (!guia) throw new ErrorAplicacion(404, 'Guía de Despacho original no encontrada');
        if (['cerrada','finalizada','anulada'].includes(guia.estado.toLowerCase())) throw new ErrorAplicacion(409, 'El estado de la Guía no admite esta corrección');
        const folio = requerido(entrada.folio, 'Folio corrector', 80);
        if (folio === guia.folio) throw new ErrorAplicacion(409, 'La guía correctora debe tener una identidad documental distinta');
        const antecedentes = entrada.antecedentes === undefined ? guia.antecedentes : entrada.antecedentes;
        if (antecedentes !== null && (typeof antecedentes !== 'object' || Array.isArray(antecedentes))) throw new ErrorAplicacion(400, 'Antecedentes inválidos');
        const correctora = await tx.guia_despacho.create({ data: { id_nota_venta: guia.id_nota_venta, folio, fecha_emision: new Date(), estado: 'emitida', antecedentes: antecedentes === null ? Prisma.JsonNull : antecedentes as Prisma.InputJsonValue } });
        const correccion = await tx.correccion_documental_m11.create({ data: { tipo_documento: 'GDE', id_guia_original: idGuia, id_guia_correctora: correctora.id_guia_despacho, actuacion: 'REGISTRAR_GUIA_CORRECTORA', motivo, respaldo, actor_id: actorId, clave_idempotencia: clave, snapshot_anterior: json(guia), snapshot_resultado: json(correctora) } });
        return auditable(correccion, json(guia), json(correctora));
      }
      if (tipo === 'OC') {
        const idOrden = idPositivo(entrada.idOrdenCompraOriginal, 'Orden de Compra original');
        const orden = await tx.orden_compra_b2b.findUnique({ where: { id_orden_compra_b2b: idOrden }, include: { lineas: { orderBy: { numero_linea: 'asc' } } } });
        if (!orden) throw new ErrorAplicacion(404, 'Orden de Compra original no encontrada');
        const antecedentesCorregidos = entrada.antecedentesCorregidos;
        if (!antecedentesCorregidos || typeof antecedentesCorregidos !== 'object' || Array.isArray(antecedentesCorregidos)) throw new ErrorAplicacion(400, 'Los antecedentes corregidos de la OC son obligatorios');
        const correccion = await tx.correccion_documental_m11.create({ data: { tipo_documento: 'OC', id_orden_compra_original: idOrden, actuacion: 'REGISTRAR_CORRECCION_OC_SIN_SOBRESCRIBIR', motivo, respaldo, actor_id: actorId, clave_idempotencia: clave, snapshot_anterior: json(orden), snapshot_resultado: json(antecedentesCorregidos) } });
        return auditable(correccion, json(orden), json(antecedentesCorregidos));
      }
      throw new ErrorAplicacion(400, 'Tipo documental no habilitado para corrección');
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async consultarHistorial(tipoDocumento: string, idDocumento: number) {
    const tipo = tipoDocumento.toUpperCase();
    if (tipo === 'OC') {
      const original = await prisma.orden_compra_b2b.findUnique({ where: { id_orden_compra_b2b: idDocumento }, include: { lineas: { orderBy: { numero_linea: 'asc' } } } });
      if (!original) throw new ErrorAplicacion(404, 'Orden de Compra no encontrada');
      const correcciones = await prisma.correccion_documental_m11.findMany({ where: { tipo_documento: 'OC', id_orden_compra_original: idDocumento }, orderBy: { creado_en: 'asc' } });
      return { tipo, original, correcciones };
    }
    if (tipo === 'GDE') {
      const original = await prisma.guia_despacho.findUnique({ where: { id_guia_despacho: idDocumento } });
      if (!original) throw new ErrorAplicacion(404, 'Guía no encontrada');
      const correcciones = await prisma.correccion_documental_m11.findMany({ where: { tipo_documento: 'GDE', id_guia_original: idDocumento }, orderBy: { creado_en: 'asc' } });
      return { tipo, original, correcciones };
    }
    if (tipo !== 'DTE') throw new ErrorAplicacion(400, 'Tipo documental inválido');
    const documentos: Array<NonNullable<Awaited<ReturnType<typeof prisma.documento_tributario.findUnique>>>> = [];
    let actual: Awaited<ReturnType<typeof prisma.documento_tributario.findUnique>> = await prisma.documento_tributario.findUnique({ where: { id_documento_tributario: idDocumento } });
    if (!actual) throw new ErrorAplicacion(404, 'Documento tributario no encontrado');
    const visitados = new Set<number>();
    while (actual && !visitados.has(actual.id_documento_tributario)) { visitados.add(actual.id_documento_tributario); documentos.unshift(actual); actual = actual.id_documento_referencia ? await prisma.documento_tributario.findUnique({ where: { id_documento_tributario: actual.id_documento_referencia } }) : null; }
    let frontera = documentos.map(documento => documento.id_documento_tributario);
    while (frontera.length) { const hijos = await prisma.documento_tributario.findMany({ where: { id_documento_referencia: { in: frontera }, id_documento_tributario: { notIn: [...visitados] } } }); if (!hijos.length) break; for (const hijo of hijos) { visitados.add(hijo.id_documento_tributario); documentos.push(hijo); } frontera = hijos.map(hijo => hijo.id_documento_tributario); }
    const correcciones = await prisma.correccion_documental_m11.findMany({ where: { tipo_documento: 'DTE', OR: [{ id_documento_original: { in: [...visitados] } }, { id_documento_corrector: { in: [...visitados] } }] }, orderBy: { creado_en: 'asc' } });
    return { tipo, original: documentos[0], cadena: documentos, correcciones };
  }

  async resolverHallazgo(idHallazgo: bigint, entrada: Entrada, actorId: bigint) {
    const decision = requerido(entrada.decision, 'Decisión', 120); const motivo = requerido(entrada.motivo, 'Motivo');
    const respaldo = requerido(entrada.respaldo, 'Respaldo', 4500000); const resultado = requerido(entrada.resultado, 'Resultado');
    const clave = requerido(entrada.claveIdempotencia, 'Clave de idempotencia', 120); const revision = idPositivo(entrada.revision, 'Revisión');
    return prisma.$transaction(async tx => {
      const repetida = await tx.resolucion_hallazgo_m11.findUnique({ where: { clave_idempotencia: clave } }); if (repetida) return repetida;
      const hallazgo = await tx.hallazgo_discrepancia_m11.findUnique({ where: { id_hallazgo_discrepancia_m11: idHallazgo } });
      if (!hallazgo) throw new ErrorAplicacion(404, 'Hallazgo no encontrado');
      if (hallazgo.estado !== 'PENDIENTE' || hallazgo.revision !== revision) throw new ErrorAplicacion(409, 'El hallazgo ya fue resuelto o cambió durante la revisión');
      const cambio = await tx.hallazgo_discrepancia_m11.updateMany({ where: { id_hallazgo_discrepancia_m11: idHallazgo, estado: 'PENDIENTE', revision }, data: { estado: 'RESUELTO', revision: { increment: 1 }, actualizado_en: new Date() } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'El hallazgo cambió durante la resolución');
      const resolucion = await tx.resolucion_hallazgo_m11.create({ data: { id_hallazgo: idHallazgo, decision, motivo, respaldo, resultado, actor_id: actorId, clave_idempotencia: clave } });
      return auditable(resolucion, json({ idHallazgo: idHallazgo.toString(), estado: 'PENDIENTE', revision }), json({ idHallazgo: idHallazgo.toString(), estado: 'RESUELTO', decision, resultado }));
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }
}
