"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioDocumentalM11 = void 0;
exports.validarCorrectorDteAcreditadoM11 = validarCorrectorDteAcreditadoM11;
exports.conciliarDosEtapasM11 = conciliarDosEtapasM11;
const client_1 = require("@prisma/client");
const db_1 = require("../db");
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const pdfOperacional_1 = require("../utilidades/pdfOperacional");
const requerido = (valor, nombre, maximo = 4000) => {
    if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > maximo)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${nombre} es obligatorio`);
    return valor.trim();
};
const idPositivo = (valor, nombre) => {
    const numero = Number(valor);
    if (!Number.isSafeInteger(numero) || numero <= 0)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${nombre} inválido`);
    return numero;
};
const normalizarJson = (valor) => {
    if (valor === null || valor === undefined)
        return null;
    if (typeof valor === 'bigint')
        return valor.toString();
    if (valor instanceof Date)
        return valor.toISOString();
    if (client_1.Prisma.Decimal.isDecimal(valor))
        return valor.toString();
    if (Array.isArray(valor))
        return valor.map(normalizarJson);
    if (typeof valor === 'object')
        return Object.fromEntries(Object.entries(valor).map(([clave, item]) => [clave, normalizarJson(item)]));
    return valor;
};
const json = normalizarJson;
const auditable = (salida, anterior, nuevo) => {
    Object.defineProperty(salida, '__auditoriaM9', { enumerable: false, value: { anterior, nuevo } });
    return salida;
};
function validarCorrectorDteAcreditadoM11(original, corrector, ancestrosOriginal) {
    if (corrector.id_documento_referencia !== original.id_documento_tributario)
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'El vínculo corrector no está acreditado por una relación documental existente; se requiere el contrato de la fuente tributaria', 'M11_CONTRATO_CORRECCION_DTE_PENDIENTE');
    if (ancestrosOriginal.includes(corrector.id_documento_tributario))
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La relación documental contiene un ciclo y no puede acreditarse', 'M11_CICLO_DOCUMENTAL');
    // El catálogo vigente sólo declara actividad y aplicación a ventas. No existe
    // una matriz o contrato aprobado que acredite qué tipo DTE corrige a otro.
    throw new ErrorAplicacion_1.ErrorAplicacion(409, 'No existe una matriz o contrato aprobado que acredite la compatibilidad entre el tipo documental original y el corrector', 'M11_TIPO_CORRECTOR_NO_ACREDITADO');
}
function conciliarDosEtapasM11(ordenadas, salida, facturadas) {
    if (!salida)
        return {
            estado: 'DATOS_INSUFICIENTES',
            etapaA: { estado: 'DATOS_INSUFICIENTES', motivo: 'El owner de Despacho no aporta una salida física acreditada; GDE y OT no sustituyen esta fuente', diferencias: [] },
            etapaB: { estado: 'DATOS_INSUFICIENTES', motivo: 'Sin salida física acreditada no procede comparar facturación', diferencias: [] },
            hallazgos: [],
        };
    const fisicas = new Map(salida.lineas.map(linea => [linea.idLinea, linea]));
    const diferenciasA = ordenadas.flatMap(linea => {
        const fisica = fisicas.get(linea.idLinea);
        if (!fisica)
            return [{ etapa: 'ORDEN_VS_SALIDA', idLinea: linea.idLinea, tipo: 'SALIDA_FALTANTE', ordenado: linea.cantidad, salida: 0, fuente: salida.referencia }];
        if (fisica.cantidad === linea.cantidad)
            return [];
        return [{ etapa: 'ORDEN_VS_SALIDA', idLinea: linea.idLinea, tipo: fisica.cantidad > linea.cantidad ? 'EXCESO_SALIDA' : 'SALIDA_PARCIAL', ordenado: linea.cantidad, salida: fisica.cantidad, fuente: salida.referencia }];
    });
    for (const fisica of salida.lineas)
        if (!ordenadas.some(linea => linea.idLinea === fisica.idLinea))
            diferenciasA.push({ etapa: 'ORDEN_VS_SALIDA', idLinea: fisica.idLinea, tipo: 'SALIDA_SIN_LINEA_ORDENADA', ordenado: 0, salida: fisica.cantidad, fuente: salida.referencia });
    if (!facturadas)
        return {
            estado: diferenciasA.length ? 'DISCREPANCIA' : 'DATOS_INSUFICIENTES',
            etapaA: { estado: diferenciasA.length ? 'DISCREPANCIA' : 'CONFIRMADO', fuente: { owner: salida.owner, referencia: salida.referencia }, diferencias: diferenciasA },
            etapaB: { estado: 'DATOS_INSUFICIENTES', motivo: 'No existen líneas de facturación acreditadas para comparar', diferencias: [] },
            hallazgos: diferenciasA,
        };
    const facturas = new Map(facturadas.filter(linea => !linea.compartido).map(linea => [linea.idLinea, linea]));
    const compartidas = facturadas.filter(linea => linea.compartido).map(linea => linea.idLinea);
    const diferenciasB = salida.lineas.flatMap(fisica => {
        if (compartidas.includes(fisica.idLinea))
            return [];
        const factura = facturas.get(fisica.idLinea);
        if (!factura)
            return [{ etapa: 'SALIDA_VS_FACTURACION', idLinea: fisica.idLinea, tipo: 'FACTURACION_FALTANTE', salida: fisica.cantidad, facturado: 0 }];
        if (fisica.moneda && factura.moneda && fisica.moneda !== factura.moneda)
            return [{ etapa: 'SALIDA_VS_FACTURACION', idLinea: fisica.idLinea, tipo: 'MONEDA_INCOMPATIBLE', salida: fisica.cantidad, facturado: factura.cantidad }];
        if (factura.cantidad === fisica.cantidad)
            return [];
        return [{ etapa: 'SALIDA_VS_FACTURACION', idLinea: fisica.idLinea, tipo: factura.cantidad > fisica.cantidad ? 'FACTURACION_EXCESIVA' : 'FACTURACION_PARCIAL', salida: fisica.cantidad, facturado: factura.cantidad }];
    });
    const insuficienteB = compartidas.length > 0;
    return {
        estado: diferenciasA.length || diferenciasB.length ? 'DISCREPANCIA' : insuficienteB ? 'PARCIAL' : 'CONFIRMADO',
        etapaA: { estado: diferenciasA.length ? 'DISCREPANCIA' : 'CONFIRMADO', fuente: { owner: salida.owner, referencia: salida.referencia }, diferencias: diferenciasA },
        etapaB: { estado: diferenciasB.length ? 'DISCREPANCIA' : insuficienteB ? 'DATOS_INSUFICIENTES' : 'CONFIRMADO', documentosCompartidosSinDistribucion: compartidas, diferencias: diferenciasB },
        hallazgos: [...diferenciasA, ...diferenciasB],
    };
}
class ServicioDocumentalM11 {
    async consultarCadena(idCotizacion) {
        const oc = await db_1.prisma.orden_compra_b2b.findUnique({ where: { id_cotizacion: idCotizacion }, include: { lineas: { orderBy: { numero_linea: 'asc' } }, cotizacion: { include: { nota_venta: { include: { guia_despacho: { orderBy: { fecha_emision: 'asc' } }, documento_tributario_nota_venta: { include: { documento_tributario: { include: { moneda: true, tipo_documento: true } } } } } } } } } });
        if (!oc)
            throw new ErrorAplicacion_1.ErrorAplicacion(404, 'La cotización no posee una Orden de Compra B2B registrada');
        const nota = oc.cotizacion.nota_venta;
        const guias = nota?.guia_despacho ?? [];
        const documentos = nota?.documento_tributario_nota_venta.map(vinculo => vinculo.documento_tributario) ?? [];
        return {
            idCotizacion, ordenCompra: { id: oc.id_orden_compra_b2b, folio: oc.folio, respaldo: oc.respaldo, estado: 'DOCUMENTO_EXISTENTE', relacion: 'RELACION_ACREDITADA', lineas: oc.lineas },
            notaVenta: nota ? { id: nota.id_nota_venta, numero: nota.numero_nota_venta, relacion: 'RELACION_ACREDITADA' } : null,
            guias: guias.map(guia => ({ id: guia.id_guia_despacho, folio: guia.folio, fecha: guia.fecha_emision, estado: 'DOCUMENTO_EXISTENTE', relacion: 'RELACION_ACREDITADA', salidaFisica: 'NO_ACREDITADA' })),
            documentosTributarios: documentos.map(documento => ({ id: documento.id_documento_tributario, folio: documento.folio_documento, tipo: documento.tipo_documento.nombre_tipo_documento, moneda: documento.moneda.codigo_moneda, monto: documento.monto_total, respaldo: documento.respaldo_documento, estado: 'DOCUMENTO_EXISTENTE', relacion: 'RELACION_ACREDITADA_A_NOTA_VENTA' })),
            relacionesDirectasGuiaDte: [],
            eslabones: { guiaDespacho: guias.length ? 'CONFIRMADO' : 'DOCUMENTO_FALTANTE', facturacion: documentos.length ? 'CONFIRMADO' : 'DOCUMENTO_FALTANTE', guiaDteDirecto: 'INFORMACION_INSUFICIENTE', salidaFisica: 'INFORMACION_INSUFICIENTE' },
            advertenciaRelacionDocumental: 'Compartir Nota de Venta no acredita una relación directa entre GDE y DTE',
            advertenciaFisica: 'Una GDE emitida o una OT terminada no acredita salida física real',
        };
    }
    async consultarConciliacion(idCotizacion) {
        const cadena = await this.consultarCadena(idCotizacion);
        const ordenadas = cadena.ordenCompra.lineas.filter(linea => linea.cantidad !== null).map(linea => ({ idLinea: linea.id_linea_orden_compra_b2b.toString(), cantidad: Number(linea.cantidad), moneda: linea.id_moneda?.toString() }));
        const resultado = conciliarDosEtapasM11(ordenadas, null, null);
        const hallazgos = await db_1.prisma.hallazgo_discrepancia_m11.findMany({ where: { id_orden_compra_b2b: cadena.ordenCompra.id }, include: { resoluciones: { orderBy: { creado_en: 'asc' } } }, orderBy: { creado_en: 'desc' } });
        return { ...resultado, cadena, hallazgos, fuenteFisica: { estado: 'DATOS_INSUFICIENTES', contrato: 'CT-07', detalle: 'No existe una fuente persistida del owner de Despacho que acredite salidas físicas' } };
    }
    /** Sólo persiste discrepancias provenientes de una fuente física acreditada; la insuficiencia nunca se convierte en hallazgo. */
    async registrarHallazgosAcreditados(idOrdenCompra, resultado, actorId) {
        if (resultado.estado === 'DATOS_INSUFICIENTES' || !resultado.hallazgos.length)
            return [];
        const fuente = 'fuente' in resultado.etapaA ? resultado.etapaA.fuente : null;
        if (!fuente || typeof fuente !== 'object' || !('referencia' in fuente))
            throw new ErrorAplicacion_1.ErrorAplicacion(409, 'No existe evidencia física acreditada para persistir discrepancias');
        return db_1.prisma.$transaction(async (tx) => {
            const guardados = [];
            for (const hallazgo of resultado.hallazgos) {
                const etapa = String(hallazgo.etapa);
                const tipo = String(hallazgo.tipo);
                const idLinea = String(hallazgo.idLinea);
                const clave = `M11:${idOrdenCompra}:${etapa}:${tipo}:${idLinea}:${String(fuente.referencia)}`;
                guardados.push(await tx.hallazgo_discrepancia_m11.upsert({
                    where: { clave_idempotencia: clave }, update: {},
                    create: { id_orden_compra_b2b: idOrdenCompra, id_linea_orden_compra_b2b: /^\d+$/.test(idLinea) ? BigInt(idLinea) : null, etapa, tipo_discrepancia: tipo, referencias_origen: json(fuente), evidencia: json(hallazgo), contexto: json(resultado), detectado_por: actorId, clave_idempotencia: clave },
                }));
            }
            return guardados;
        });
    }
    async gestionarCorreccion(entrada, actorId) {
        const tipo = requerido(entrada.tipoDocumento, 'Tipo documental', 20).toUpperCase();
        const motivo = requerido(entrada.motivo, 'Motivo');
        const respaldo = (0, pdfOperacional_1.respaldoOperacional)(entrada.respaldo, 'Respaldo documental');
        const clave = requerido(entrada.claveIdempotencia, 'Clave de idempotencia', 120);
        return db_1.prisma.$transaction(async (tx) => {
            const repetida = await tx.correccion_documental_m11.findUnique({ where: { clave_idempotencia: clave } });
            if (repetida)
                return repetida;
            if (tipo === 'DTE') {
                const idOriginal = idPositivo(entrada.idDocumentoOriginal, 'Documento original');
                const idCorrector = idPositivo(entrada.idDocumentoCorrector, 'Documento corrector');
                if (idOriginal === idCorrector)
                    throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El original y el corrector deben ser documentos distintos');
                const incluirCiclo = { documento_tributario_nota_venta: { select: { id_nota_venta: true } }, tipo_documento: { select: { aplica_venta: true, estado_tipo_documento: true } } };
                const [original, corrector] = await Promise.all([tx.documento_tributario.findUnique({ where: { id_documento_tributario: idOriginal }, include: incluirCiclo }), tx.documento_tributario.findUnique({ where: { id_documento_tributario: idCorrector }, include: incluirCiclo })]);
                if (!original || !corrector)
                    throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Documento original o corrector no encontrado');
                if (original.id_ficha_cliente !== corrector.id_ficha_cliente)
                    throw new ErrorAplicacion_1.ErrorAplicacion(409, 'El corrector no corresponde al mismo cliente del original');
                const notasOriginal = new Set([original.id_nota_venta, ...original.documento_tributario_nota_venta.map(v => v.id_nota_venta)].filter((id) => id !== null));
                const mismoCiclo = [corrector.id_nota_venta, ...corrector.documento_tributario_nota_venta.map(v => v.id_nota_venta)].some(id => id !== null && notasOriginal.has(id));
                if (!mismoCiclo)
                    throw new ErrorAplicacion_1.ErrorAplicacion(409, 'El documento corrector no pertenece al mismo ciclo comercial acreditado');
                let cursor = original.id_documento_referencia;
                const ancestros = [];
                while (cursor) {
                    if (ancestros.includes(cursor))
                        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La cadena original ya contiene un ciclo documental', 'M11_CICLO_DOCUMENTAL');
                    ancestros.push(cursor);
                    cursor = (await tx.documento_tributario.findUnique({ where: { id_documento_tributario: cursor }, select: { id_documento_referencia: true } }))?.id_documento_referencia ?? null;
                }
                validarCorrectorDteAcreditadoM11(original, corrector, ancestros);
                const correccion = await tx.correccion_documental_m11.create({ data: { tipo_documento: 'DTE', id_documento_original: idOriginal, id_documento_corrector: idCorrector, actuacion: 'VINCULAR_CORRECTOR_EXISTENTE', motivo, respaldo, actor_id: actorId, clave_idempotencia: clave, snapshot_anterior: json(original), snapshot_resultado: json({ idDocumentoCorrector: idCorrector, idDocumentoReferencia: idOriginal }) } });
                return auditable(correccion, json({ idOriginal, idCorrector, referenciaAnterior: corrector.id_documento_referencia }), json({ idOriginal, idCorrector, referencia: idOriginal }));
            }
            if (tipo === 'GDE') {
                const idGuia = idPositivo(entrada.idGuiaOriginal, 'Guía original');
                const guia = await tx.guia_despacho.findUnique({ where: { id_guia_despacho: idGuia } });
                if (!guia)
                    throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Guía de Despacho original no encontrada');
                throw new ErrorAplicacion_1.ErrorAplicacion(409, 'No existe un contrato acreditado para registrar una GDE correctora externa; el original permanece inmutable', 'M11_CONTRATO_CORRECCION_GDE_PENDIENTE');
            }
            if (tipo === 'OC') {
                const idOrden = idPositivo(entrada.idOrdenCompraOriginal, 'Orden de Compra original');
                const orden = await tx.orden_compra_b2b.findUnique({ where: { id_orden_compra_b2b: idOrden }, include: { lineas: { orderBy: { numero_linea: 'asc' } } } });
                if (!orden)
                    throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Orden de Compra original no encontrada');
                const antecedentesCorregidos = entrada.antecedentesCorregidos;
                if (!antecedentesCorregidos || typeof antecedentesCorregidos !== 'object' || Array.isArray(antecedentesCorregidos))
                    throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Los antecedentes corregidos de la OC son obligatorios');
                const correccion = await tx.correccion_documental_m11.create({ data: { tipo_documento: 'OC', id_orden_compra_original: idOrden, actuacion: 'REGISTRAR_CORRECCION_OC_SIN_SOBRESCRIBIR', motivo, respaldo, actor_id: actorId, clave_idempotencia: clave, snapshot_anterior: json(orden), snapshot_resultado: json(antecedentesCorregidos) } });
                return auditable(correccion, json(orden), json(antecedentesCorregidos));
            }
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Tipo documental no habilitado para corrección');
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
    }
    async consultarHistorial(tipoDocumento, idDocumento) {
        const tipo = tipoDocumento.toUpperCase();
        if (tipo === 'OC') {
            const original = await db_1.prisma.orden_compra_b2b.findUnique({ where: { id_orden_compra_b2b: idDocumento }, include: { lineas: { orderBy: { numero_linea: 'asc' } } } });
            if (!original)
                throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Orden de Compra no encontrada');
            const correcciones = await db_1.prisma.correccion_documental_m11.findMany({ where: { tipo_documento: 'OC', id_orden_compra_original: idDocumento }, orderBy: { creado_en: 'asc' } });
            return { tipo, original, correcciones };
        }
        if (tipo === 'GDE') {
            const original = await db_1.prisma.guia_despacho.findUnique({ where: { id_guia_despacho: idDocumento } });
            if (!original)
                throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Guía no encontrada');
            const correcciones = await db_1.prisma.correccion_documental_m11.findMany({ where: { tipo_documento: 'GDE', id_guia_original: idDocumento }, orderBy: { creado_en: 'asc' } });
            return { tipo, original, correcciones };
        }
        if (tipo !== 'DTE')
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Tipo documental inválido');
        const documentos = [];
        let actual = await db_1.prisma.documento_tributario.findUnique({ where: { id_documento_tributario: idDocumento } });
        if (!actual)
            throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Documento tributario no encontrado');
        const visitados = new Set();
        while (actual && !visitados.has(actual.id_documento_tributario)) {
            visitados.add(actual.id_documento_tributario);
            documentos.unshift(actual);
            actual = actual.id_documento_referencia ? await db_1.prisma.documento_tributario.findUnique({ where: { id_documento_tributario: actual.id_documento_referencia } }) : null;
        }
        let frontera = documentos.map(documento => documento.id_documento_tributario);
        while (frontera.length) {
            const hijos = await db_1.prisma.documento_tributario.findMany({ where: { id_documento_referencia: { in: frontera }, id_documento_tributario: { notIn: [...visitados] } } });
            if (!hijos.length)
                break;
            for (const hijo of hijos) {
                visitados.add(hijo.id_documento_tributario);
                documentos.push(hijo);
            }
            frontera = hijos.map(hijo => hijo.id_documento_tributario);
        }
        const correcciones = await db_1.prisma.correccion_documental_m11.findMany({ where: { tipo_documento: 'DTE', OR: [{ id_documento_original: { in: [...visitados] } }, { id_documento_corrector: { in: [...visitados] } }] }, orderBy: { creado_en: 'asc' } });
        return { tipo, original: documentos[0], cadena: documentos, correcciones };
    }
    async resolverHallazgo(idHallazgo, entrada, actorId) {
        const decision = requerido(entrada.decision, 'Decisión', 120);
        const motivo = requerido(entrada.motivo, 'Motivo');
        const respaldo = (0, pdfOperacional_1.respaldoOperacional)(entrada.respaldo, 'Respaldo de la decisión');
        const resultado = requerido(entrada.resultado, 'Resultado');
        const clave = requerido(entrada.claveIdempotencia, 'Clave de idempotencia', 120);
        const revision = idPositivo(entrada.revision, 'Revisión');
        return db_1.prisma.$transaction(async (tx) => {
            const repetida = await tx.resolucion_hallazgo_m11.findUnique({ where: { clave_idempotencia: clave } });
            if (repetida)
                return repetida;
            const hallazgo = await tx.hallazgo_discrepancia_m11.findUnique({ where: { id_hallazgo_discrepancia_m11: idHallazgo } });
            if (!hallazgo)
                throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Hallazgo no encontrado');
            if (hallazgo.estado !== 'PENDIENTE' || hallazgo.revision !== revision)
                throw new ErrorAplicacion_1.ErrorAplicacion(409, 'El hallazgo cambió durante la revisión');
            const resolucion = await tx.resolucion_hallazgo_m11.create({ data: { id_hallazgo: idHallazgo, decision, motivo, respaldo, resultado, actor_id: actorId, clave_idempotencia: clave } });
            return auditable({ ...resolucion, estadoHallazgo: 'PENDIENTE', cierreAplicado: false, detalle: 'La decisión queda registrada; no existe un contrato aprobado para cerrar o ejecutar automáticamente el hallazgo' }, json({ idHallazgo: idHallazgo.toString(), estado: 'PENDIENTE', revision }), json({ idHallazgo: idHallazgo.toString(), estado: 'PENDIENTE', decision, resultado, cierreAplicado: false }));
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
    }
}
exports.ServicioDocumentalM11 = ServicioDocumentalM11;
//# sourceMappingURL=ServicioDocumentalM11.js.map