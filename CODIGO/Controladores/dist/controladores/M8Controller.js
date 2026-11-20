"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.M8Controller = exports.validarMontoLimiteGlobalM8 = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../db");
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const finanzas_1 = require("../utilidades/finanzas");
const creditoM8_1 = require("../utilidades/creditoM8");
const exportacionCreditoCsv_1 = require("../m8/exportacionCreditoCsv");
const transicionLimiteGlobalM8_1 = require("../utilidades/transicionLimiteGlobalM8");
const elegibilidadClienteM8_1 = require("../utilidades/elegibilidadClienteM8");
const estados = ['BORRADOR', 'PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA'];
const tipos = ['INICIAL', 'EXCEPCION'];
const hoy = () => new Date(new Date().toISOString().slice(0, 10) + 'T00:00:00Z');
const iso = (f) => f?.toISOString().slice(0, 10) ?? null;
const texto = (v, max = 4000) => { if (v === undefined || v === null)
    return ''; if (typeof v !== 'string' || v.trim().length > max)
    throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Texto inválido'); return v.trim(); };
const entero = (v, n) => { const x = Number(v); if (!Number.isSafeInteger(x) || x < 1)
    throw new ErrorAplicacion_1.ErrorAplicacion(400, `${n} inválido`); return x; };
const monto = (v, n, cero = false) => { try {
    if (v === undefined || v === null || typeof v === 'string' && !v.trim())
        throw 0;
    const x = new client_1.Prisma.Decimal(String(v));
    if (!x.isFinite() || (cero ? x.lt(0) : x.lte(0)))
        throw 0;
    return x.toDecimalPlaces(2);
}
catch {
    throw new ErrorAplicacion_1.ErrorAplicacion(400, `${n} debe ser ${cero ? 'no negativo' : 'mayor a cero'}`);
} };
const validarMontoLimiteGlobalM8 = (valor) => monto(valor, 'Límite global', true);
exports.validarMontoLimiteGlobalM8 = validarMontoLimiteGlobalM8;
const fecha = (v, n) => { const s = texto(v, 10), f = new Date(`${s}T00:00:00Z`); if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || iso(f) !== s)
    throw new ErrorAplicacion_1.ErrorAplicacion(400, `${n} inválida`); return f; };
const autorizar = (a, p) => { if (!a?.permisos?.includes(p))
    throw new ErrorAplicacion_1.ErrorAplicacion(403, `No tienes permiso ${p}`); };
const incluirSolicitud = { ficha_cliente: { include: { cliente_financiero: { include: { tipo_cliente_financiero: true } } } }, solicitante: true, cotizacion: { include: { moneda: true } }, nota_venta: { include: { moneda: true } }, resolucion: true };
class M8Controller {
    presentar(s) { const c = s.ficha_cliente.cliente_financiero, nombre = s.solicitante ? [s.solicitante.usuario_nombre_completo_primer_nombre_usuario, s.solicitante.usuario_nombre_completo_primer_apellido_usuario].filter(Boolean).join(' ') || s.solicitante.usuario_username : null; return { id: s.id_solicitud_crediticia, tipo: s.tipo_solicitud, estado: s.estado_solicitud, fechaCreacion: s.fecha_creacion.toISOString(), fechaActualizacion: s.fecha_actualizacion.toISOString(), motivo: s.motivo_solicitud, condicionesSolicitadas: s.condiciones_solicitadas, antecedentes: s.antecedentes_resumen, solicitante: s.solicitante ? { id: s.solicitante.usuario_id_usuario.toString(), nombre: nombre || 'Usuario sin nombre' } : null, cliente: { idFicha: s.id_ficha_cliente, idCliente: c.id_cliente_financiero, nombre: c.nombre_razon_social_referencia, rut: c.rut_cliente, clasificacion: c.tipo_cliente_financiero.nombre_tipo_cliente_financiero, estadoContexto: c.estado_financiero === 'activo' && s.ficha_cliente.estado_ficha === 'activa' ? 'DISPONIBLE' : 'PARCIALMENTE_DISPONIBLE', destino: c.rut_cliente ? `/clientes/${encodeURIComponent(c.rut_cliente)}` : '/clientes' }, contextoComercial: { estado: s.cotizacion || s.nota_venta ? 'DISPONIBLE' : 'SIN_REFERENCIA', cotizacion: s.cotizacion ? { id: s.cotizacion.id_cotizacion, estado: s.cotizacion.estado_cotizacion, monto: s.cotizacion.monto_total_estimado === null ? null : Number(s.cotizacion.monto_total_estimado), moneda: s.cotizacion.moneda.codigo_moneda, destino: `/cotizacion/nueva?borrador=${s.cotizacion.id_cotizacion}` } : null, notaVenta: s.nota_venta ? { id: s.nota_venta.id_nota_venta, numero: s.nota_venta.numero_nota_venta, estado: s.nota_venta.estado_nota_venta, monto: Number(s.nota_venta.monto_total), moneda: s.nota_venta.moneda.codigo_moneda, destino: c.rut_cliente ? `/clientes/${encodeURIComponent(c.rut_cliente)}` : '/clientes' } : null, referencia: s.referencia_contexto }, resolucion: s.resolucion ? { decision: s.resolucion.decision, motivo: s.resolucion.motivo, condiciones: s.resolucion.condiciones_aprobadas, fecha: s.resolucion.fecha_resolucion.toISOString() } : null }; }
    async listarSolicitudes(q, a) { autorizar(a, 'CU259'); const e = texto(q.estado, 20).toUpperCase(), t = texto(q.tipo, 20).toUpperCase(), ficha = q.idFicha ?? q.cliente, desde = q.desde ? fecha(q.desde, 'Fecha desde') : null, hasta = q.hasta ? fecha(q.hasta, 'Fecha hasta') : null; if (e && !estados.includes(e))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Estado inválido'); if (t && !tipos.includes(t))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Tipo inválido'); const s = await db_1.prisma.solicitud_crediticia_m8.findMany({ where: { ...(e ? { estado_solicitud: e } : {}), ...(t ? { tipo_solicitud: t } : {}), ...(ficha ? { id_ficha_cliente: entero(ficha, 'Cliente') } : {}), ...(desde || hasta ? { fecha_creacion: { ...(desde ? { gte: desde } : {}), ...(hasta ? { lte: new Date(hasta.getTime() + 86399999) } : {}) } } : {}) }, include: incluirSolicitud, orderBy: [{ fecha_actualizacion: 'desc' }, { id_solicitud_crediticia: 'desc' }] }); return { total: s.length, solicitudes: s.map(x => this.presentar(x)), filtros: { estado: e || null, tipo: t || null } }; }
    async listarClientesB2B(q, a) { if (!a.permisos.includes('CU260') && !a.permisos.includes('CU261'))
        throw new ErrorAplicacion_1.ErrorAplicacion(403, 'No tienes permiso para crear solicitudes de crédito'); const busqueda = texto(q.busqueda, 120); const clientes = await db_1.prisma.cliente_financiero.findMany({ where: { estado_financiero: 'activo', tipo_cliente_financiero: { nombre_tipo_cliente_financiero: { equals: 'B2B', mode: 'insensitive' } }, ficha_cliente: { is: { estado_ficha: 'activa' } }, ...(busqueda ? { OR: [{ nombre_razon_social_referencia: { contains: busqueda, mode: 'insensitive' } }, { rut_cliente: { contains: busqueda, mode: 'insensitive' } }, { rut_cliente: { contains: busqueda.replace(/[.\s]/g, ''), mode: 'insensitive' } }] } : {}) }, select: { id_cliente_financiero: true, rut_cliente: true, nombre_razon_social_referencia: true, ficha_cliente: { select: { id_ficha_cliente: true } } }, orderBy: [{ nombre_razon_social_referencia: 'asc' }, { id_cliente_financiero: 'asc' }], take: 30 }); return clientes.map(cliente => ({ idCliente: cliente.id_cliente_financiero, idFichaCliente: cliente.ficha_cliente.id_ficha_cliente, razonSocial: cliente.nombre_razon_social_referencia, rut: cliente.rut_cliente })); }
    async obtenerSolicitud(id, a) { autorizar(a, 'CU259'); const s = await db_1.prisma.solicitud_crediticia_m8.findUnique({ where: { id_solicitud_crediticia: id }, include: incluirSolicitud }); if (!s)
        throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Solicitud no encontrada'); return this.presentar(s); }
    async crearSolicitud(tipo, e, a) { autorizar(a, tipo === 'INICIAL' ? 'CU260' : 'CU261'); const id = entero(e.idFichaCliente, 'Cliente'); const ficha = await (0, creditoM8_1.fichaB2B)(db_1.prisma, id); if (!(0, elegibilidadClienteM8_1.fichaActivaParaCreditoM8)(ficha))
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Cliente o ficha inactivos: no se puede solicitar crédito'); if (tipo === 'INICIAL' && await db_1.prisma.condicion_crediticia_m8.findFirst({ where: { id_ficha_cliente: id, credito_habilitado: true } }))
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'El Cliente ya tiene Crédito habilitado'); const cot = e.idCotizacion ? entero(e.idCotizacion, 'Cotización') : null, nv = e.idNotaVenta ? entero(e.idNotaVenta, 'Nota de Venta') : null, mot = texto(e.motivo); if (tipo === 'EXCEPCION' && !cot && !nv)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La excepción debe vincularse a una operación M2'); if (tipo === 'EXCEPCION' && !mot)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El motivo extraordinario es obligatorio'); if (cot && !await db_1.prisma.cotizacion.findFirst({ where: { id_cotizacion: cot, id_ficha_cliente: id } }))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La Cotización no pertenece al Cliente'); if (nv && !await db_1.prisma.nota_venta.findFirst({ where: { id_nota_venta: nv, id_ficha_cliente: id } }))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La Nota de Venta no pertenece al Cliente'); const s = await db_1.prisma.solicitud_crediticia_m8.create({ data: { id_ficha_cliente: id, tipo_solicitud: tipo, id_usuario_solicitante: a.id, id_cotizacion: cot, id_nota_venta: nv, motivo_solicitud: mot || null, condiciones_solicitadas: texto(e.condiciones) || null, antecedentes_resumen: texto(e.antecedentes) || null, referencia_contexto: texto(e.referencia, 120) || null }, include: incluirSolicitud }); return this.presentar(s); }
    async enviarSolicitud(id, a) { const s = await db_1.prisma.solicitud_crediticia_m8.findUnique({ where: { id_solicitud_crediticia: id } }); if (!s)
        throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Solicitud no encontrada'); autorizar(a, s.tipo_solicitud === 'INICIAL' ? 'CU260' : 'CU261'); if (s.estado_solicitud !== 'BORRADOR')
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Sólo un borrador puede enviarse'); const ficha = await (0, creditoM8_1.fichaB2B)(db_1.prisma, s.id_ficha_cliente); if (!(0, elegibilidadClienteM8_1.fichaActivaParaCreditoM8)(ficha))
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Cliente o ficha inactivos: no se puede enviar la solicitud'); return db_1.prisma.solicitud_crediticia_m8.update({ where: { id_solicitud_crediticia: id }, data: { estado_solicitud: 'PENDIENTE' } }); }
    async cancelarSolicitud(id, e, a) { autorizar(a, 'CU262'); const mot = texto(e.motivo); if (!mot)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El motivo es obligatorio'); const s = await db_1.prisma.solicitud_crediticia_m8.findUnique({ where: { id_solicitud_crediticia: id } }); if (!s)
        throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Solicitud no encontrada'); if (!['BORRADOR', 'PENDIENTE'].includes(s.estado_solicitud))
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La solicitud ya tiene una decisión'); return db_1.prisma.solicitud_crediticia_m8.update({ where: { id_solicitud_crediticia: id }, data: { estado_solicitud: 'CANCELADA', antecedentes_resumen: [s.antecedentes_resumen, `Cancelación: ${mot}`].filter(Boolean).join('\n') } }); }
    async resolverSolicitud(id, e, a) { const s = await db_1.prisma.solicitud_crediticia_m8.findUnique({ where: { id_solicitud_crediticia: id } }); if (!s)
        throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Solicitud no encontrada'); autorizar(a, s.tipo_solicitud === 'INICIAL' ? 'CU263' : 'CU264'); const d = texto(e.decision, 20).toUpperCase(), mot = texto(e.motivo); if (!['APROBADA', 'RECHAZADA'].includes(d) || !mot)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Decisión y motivo son obligatorios'); if (s.estado_solicitud !== 'PENDIENTE')
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Sólo una solicitud Pendiente puede resolverse'); if (d === 'APROBADA') {
        const ficha = await (0, creditoM8_1.fichaB2B)(db_1.prisma, s.id_ficha_cliente);
        if (!(0, elegibilidadClienteM8_1.fichaActivaParaCreditoM8)(ficha))
            throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Cliente o ficha inactivos: no se puede aprobar crédito');
    } let cupo = null, desde = null, hasta = null; if (s.tipo_solicitud === 'INICIAL' && d === 'APROBADA') {
        cupo = monto(e.montoCupo, 'Cupo');
        desde = fecha(e.vigenciaDesde, 'Vigencia desde');
        hasta = fecha(e.vigenciaHasta, 'Vigencia hasta');
        if (hasta < desde)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Vigencia inválida');
    } return db_1.prisma.$transaction(async (tx) => { await tx.resolucion_solicitud_crediticia_m8.create({ data: { id_solicitud_crediticia: id, decision: d, motivo: mot, monto_cupo_aprobado: cupo, vigencia_desde: desde, vigencia_hasta: hasta, condiciones_aprobadas: texto(e.condiciones) || null, id_usuario_responsable: a.id } }); await tx.solicitud_crediticia_m8.update({ where: { id_solicitud_crediticia: id }, data: { estado_solicitud: d } }); if (s.tipo_solicitud === 'INICIAL' && d === 'APROBADA')
        await tx.condicion_crediticia_m8.upsert({ where: { id_ficha_cliente: s.id_ficha_cliente }, update: { credito_habilitado: true, monto_cupo: cupo, vigencia_desde: desde, vigencia_hasta: hasta }, create: { id_ficha_cliente: s.id_ficha_cliente, credito_habilitado: true, monto_cupo: cupo, vigencia_desde: desde, vigencia_hasta: hasta } }); await tx.evento_credito_m8.create({ data: { id_ficha_cliente: s.id_ficha_cliente, tipo_evento: `${s.tipo_solicitud}_${d}`, motivo: mot, valor_nuevo: cupo?.toString(), id_referencia: id, id_usuario: a.id } }); return { id, decision: d, ventaM2Modificada: false }; }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable }); }
    async modificarCupo(id, e, a) { autorizar(a, 'CU265'); const mot = texto(e.motivo); if (!mot)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El motivo es obligatorio'); const cupo = monto(e.montoCupo, 'Cupo', true), desde = fecha(e.vigenciaDesde, 'Vigencia desde'), hasta = fecha(e.vigenciaHasta, 'Vigencia hasta'); if (hasta < desde)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Vigencia inválida'); return db_1.prisma.$transaction(async (tx) => { const actual = await tx.condicion_crediticia_m8.findUnique({ where: { id_ficha_cliente: id } }); if (!actual?.credito_habilitado)
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Cliente sin Crédito habilitado'); await tx.condicion_crediticia_m8.update({ where: { id_ficha_cliente: id }, data: { monto_cupo: cupo, vigencia_desde: desde, vigencia_hasta: hasta } }); await tx.evento_credito_m8.create({ data: { id_ficha_cliente: id, tipo_evento: 'CUPO_VIGENCIA_MODIFICADOS', motivo: mot, valor_anterior: JSON.stringify({ cupo: actual.monto_cupo?.toString(), desde: iso(actual.vigencia_desde), hasta: iso(actual.vigencia_hasta) }), valor_nuevo: JSON.stringify({ cupo: cupo.toString(), desde: iso(desde), hasta: iso(hasta) }), id_usuario: a.id } }); return { idFicha: id, cupo: Number(cupo), utilizado: Number(await (0, creditoM8_1.exposicionCredito)(tx, id)), sobreCupo: (await (0, creditoM8_1.exposicionCredito)(tx, id)).gt(cupo) }; }); }
    async suspension(id, susp, e, a) { autorizar(a, susp ? 'CU266' : 'CU267'); const mot = texto(e.motivo); if (!mot)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El motivo es obligatorio'); return db_1.prisma.$transaction(async (tx) => { const c = await tx.condicion_crediticia_m8.findUnique({ where: { id_ficha_cliente: id } }); if (!c?.credito_habilitado)
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Cliente sin Crédito habilitado'); if (c.suspendido === susp)
        throw new ErrorAplicacion_1.ErrorAplicacion(409, susp ? 'El Crédito ya está suspendido' : 'El Crédito ya está activo'); await tx.condicion_crediticia_m8.update({ where: { id_ficha_cliente: id }, data: susp ? { suspendido: true, motivo_suspension: mot, fecha_suspension: new Date() } : { suspendido: false, motivo_suspension: null, fecha_reactivacion: new Date() } }); await tx.evento_credito_m8.create({ data: { id_ficha_cliente: id, tipo_evento: susp ? 'SUSPENSION' : 'REACTIVACION', motivo: mot, valor_anterior: String(c.suspendido), valor_nuevo: String(susp), id_usuario: a.id } }); return { idFicha: id, suspendido: susp, motivo: mot }; }); }
    suspenderCredito(id, e, a) { return this.suspension(id, true, e, a); }
    reactivarCredito(id, e, a) { return this.suspension(id, false, e, a); }
    async configurarLimiteGlobal(e, a) {
        autorizar(a, 'CU268');
        const valor = (0, exports.validarMontoLimiteGlobalM8)(e.montoLimite), desde = fecha(e.vigenciaDesde, 'Vigencia desde'), mot = texto(e.motivo);
        if (!mot)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El motivo es obligatorio');
        return db_1.prisma.$transaction(async (tx) => {
            const actuales = await tx.limite_global_credito_m8.findMany({ where: { vigencia_hasta: null, sustituido_en: null } });
            if (actuales.length > 1)
                throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Existen múltiples límites globales abiertos; requiere revisión');
            for (const x of actuales) {
                const cambio = (0, transicionLimiteGlobalM8_1.transicionLimiteGlobalM8)(x.vigencia_desde, desde);
                if (cambio.tipo === 'sustitucion_mismo_dia') {
                    // Mantener importe, motivo, autor y fecha originales en la versión histórica.
                    await tx.limite_global_credito_m8.update({ where: { id_limite_global: x.id_limite_global }, data: { sustituido_en: new Date() } });
                }
                else {
                    await tx.limite_global_credito_m8.update({ where: { id_limite_global: x.id_limite_global }, data: { vigencia_hasta: cambio.cierre } });
                }
            }
            if (!actuales.length) {
                // Impedir insertar una vigencia abierta que se cruce con períodos históricos.
                const ultimo = await tx.limite_global_credito_m8.findFirst({ where: { sustituido_en: null }, orderBy: { vigencia_desde: 'desc' } });
                if (ultimo && (!ultimo.vigencia_hasta || ultimo.vigencia_hasta >= desde))
                    throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Vigencia superpuesta con un período histórico');
            }
            return tx.limite_global_credito_m8.create({ data: { monto_limite: valor, vigencia_desde: desde, motivo: mot, id_responsable: a.id } });
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
    }
    async consultarExposicion(_q = {}) { const [l, u, ag] = await Promise.all([(0, creditoM8_1.limiteCreditoVigente)(db_1.prisma), (0, creditoM8_1.exposicionCredito)(db_1.prisma), db_1.prisma.condicion_crediticia_m8.aggregate({ where: { credito_habilitado: true }, _sum: { monto_cupo: true } })]), ct = ag._sum.monto_cupo ?? new client_1.Prisma.Decimal(0); return { estado: l ? 'DISPONIBLE' : 'CONFIGURACION_PENDIENTE', limiteGlobal: l ? Number(l.monto_limite) : null, exposicionUtilizada: Number(u), capacidadDisponible: l ? Number(l.monto_limite.minus(u)) : null, cupoTotalAgregado: Number(ct), cupoUtilizadoAgregado: Number(u), cupoDisponibleAgregado: Number(ct.minus(u)), avisoCapacidadProxima: 'CONDICIONADO_F047_NO_IMPLEMENTADO' }; }
    async consultarAlertas(_q = {}) { const cs = await db_1.prisma.condicion_crediticia_m8.findMany({ include: { ficha_cliente: { include: { cliente_financiero: true } } } }), alertas = []; for (const c of cs) {
        const u = await (0, creditoM8_1.exposicionCredito)(db_1.prisma, c.id_ficha_cliente);
        if (c.suspendido)
            alertas.push({ idFicha: c.id_ficha_cliente, tipo: 'SUSPENDIDO' });
        if (c.monto_cupo && u.gt(c.monto_cupo))
            alertas.push({ idFicha: c.id_ficha_cliente, tipo: 'SOBRE_CUPO', monto: Number(u.minus(c.monto_cupo)) });
        if (c.vigencia_hasta && c.vigencia_hasta < hoy())
            alertas.push({ idFicha: c.id_ficha_cliente, tipo: 'VIGENCIA_EXPIRADA' });
    } return { alertas, criterio: 'Sin scoring ni F047; morosidad no suspende automáticamente' }; }
    async situacionCliente(id, a, perm = 'CU270') { autorizar(a, perm); const f = await (0, creditoM8_1.fichaB2B)(db_1.prisma, id), c = await db_1.prisma.condicion_crediticia_m8.findUnique({ where: { id_ficha_cliente: id } }), u = await (0, creditoM8_1.exposicionCredito)(db_1.prisma, id), cupo = c?.monto_cupo ?? new client_1.Prisma.Decimal(0), notas = await db_1.prisma.nota_venta.findMany({ where: { id_ficha_cliente: id, fecha_vencimiento: { lt: hoy() }, estado_nota_venta: { notIn: ['anulada', 'revertida_total'] } }, include: finanzas_1.incluirNota }), morosas = notas.filter(n => (0, finanzas_1.calcularNota)(n).saldoPendiente > 0); return { cliente: { idFicha: id, nombre: f.cliente_financiero.nombre_razon_social_referencia, rut: f.cliente_financiero.rut_cliente }, habilitado: c?.credito_habilitado ?? false, cupo: c?.monto_cupo ? Number(c.monto_cupo) : null, utilizado: Number(u), disponible: c?.monto_cupo ? Number(cupo.minus(u)) : null, vigencia: { desde: iso(c?.vigencia_desde ?? null), hasta: iso(c?.vigencia_hasta ?? null) }, suspension: { suspendido: c?.suspendido ?? false, motivo: a.permisos.includes('CU271') ? c?.motivo_suspension ?? null : null }, sobreCupo: Boolean(c?.monto_cupo && u.gt(c.monto_cupo)), morosidad: { estado: 'DISPONIBLE', cantidad: morosas.length, decisionAutomatica: false }, costoReal: { estado: 'FUENTE_NO_DISPONIBLE', valor: null, contrato: 'F038' } }; }
    async historialCliente(id, a) { autorizar(a, 'CU271'); await (0, creditoM8_1.fichaB2B)(db_1.prisma, id); const [eventos, solicitudes] = await Promise.all([db_1.prisma.evento_credito_m8.findMany({ where: { id_ficha_cliente: id }, include: { responsable: true }, orderBy: { fecha_evento: 'desc' } }), db_1.prisma.solicitud_crediticia_m8.findMany({ where: { id_ficha_cliente: id }, include: { resolucion: true }, orderBy: { fecha_creacion: 'desc' } })]); return { eventos: eventos.map(e => ({ tipo: e.tipo_evento, motivo: e.motivo, anterior: e.valor_anterior, nuevo: e.valor_nuevo, fecha: e.fecha_evento.toISOString(), responsable: e.responsable.usuario_username })), solicitudes: solicitudes.map(s => ({ id: s.id_solicitud_crediticia, tipo: s.tipo_solicitud, estado: s.estado_solicitud, decision: s.resolucion?.decision ?? null })) }; }
    async composicionCliente(id, a) { autorizar(a, 'CU274'); const cs = await db_1.prisma.compromiso_credito_m8.findMany({ where: { id_ficha_cliente: id }, include: { nota_venta: true, reducciones: true, solicitud_excepcion: { include: { resolucion: true } } }, orderBy: { fecha_formalizacion: 'desc' } }); return { compromisos: cs.map(c => ({ id: c.id_compromiso, operacion: { idNota: c.id_nota_venta, numero: c.nota_venta.numero_nota_venta }, montoOriginal: Number(c.monto_original), montoPendiente: Number(c.monto_pendiente), estado: c.estado, condiciones: c.condiciones, excepcion: c.solicitud_excepcion ? { id: c.solicitud_excepcion.id_solicitud_crediticia, condiciones: c.solicitud_excepcion.resolucion?.condiciones_aprobadas } : null, reducciones: c.reducciones.map(r => ({ idPago: r.id_pago_cliente, monto: Number(r.monto_reduccion), fecha: r.fecha_reduccion.toISOString() })) })), totalPendiente: Number(cs.reduce((s, c) => s.plus(c.monto_pendiente), new client_1.Prisma.Decimal(0))) }; }
    async calcularDistribucion() { const cs = await db_1.prisma.condicion_crediticia_m8.findMany({ where: { credito_habilitado: true }, include: { ficha_cliente: { include: { cliente_financiero: true } } } }), total = await (0, creditoM8_1.exposicionCredito)(db_1.prisma), clientes = []; for (const c of cs) {
        const u = await (0, creditoM8_1.exposicionCredito)(db_1.prisma, c.id_ficha_cliente), p = await db_1.prisma.solicitud_crediticia_m8.count({ where: { id_ficha_cliente: c.id_ficha_cliente, estado_solicitud: 'PENDIENTE' } });
        clientes.push({ idFicha: c.id_ficha_cliente, cliente: c.ficha_cliente.cliente_financiero.nombre_razon_social_referencia, exposicion: Number(u), concentracion: total.gt(0) ? Number(u.div(total).mul(100).toDecimalPlaces(2)) : 0, sobreCupo: Boolean(c.monto_cupo && u.gt(c.monto_cupo)), suspendido: c.suspendido, solicitudesPendientes: p });
    } return { exposicionTotal: Number(total), clientes }; }
    async consultarResumenDashboardM7(_q = {}) { const [resumen, alertas, distribucion, totalSolicitudes, totalCompromisos] = await Promise.all([this.consultarExposicion(), this.consultarAlertas(), this.calcularDistribucion(), db_1.prisma.solicitud_crediticia_m8.count(), db_1.prisma.compromiso_credito_m8.count()]); const clientes = distribucion.clientes; return { ...resumen, totalSolicitudes, totalCompromisos, clientesSobreLimite: clientes.filter(cliente => cliente.sobreCupo), clientesSuspendidos: clientes.filter(cliente => cliente.suspendido), alertas: alertas.alertas, concentracion: { exposicionTotal: distribucion.exposicionTotal, clientes } }; }
    async distribucion(a) { autorizar(a, 'CU273'); return this.calcularDistribucion(); }
    async validarFormalizacion(e, a) { autorizar(a, 'CU269'); return db_1.prisma.$transaction(tx => (0, creditoM8_1.validarCreditoParaFormalizacion)(tx, { idFicha: entero(e.idFichaCliente, 'Cliente'), montoFinanciado: monto(e.montoFinanciado, 'Monto financiado'), idCotizacion: e.idCotizacion ? entero(e.idCotizacion, 'Cotización') : undefined, idSolicitudExcepcion: e.idSolicitudExcepcion ? entero(e.idSolicitudExcepcion, 'Excepción') : undefined }), { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable }); }
    async exportar(origen, q, a) { autorizar(a, 'CU272'); let filas = []; if (origen === 'solicitudes')
        filas = (await this.listarSolicitudes(q, { ...a, permisos: [...a.permisos, 'CU259'] })).solicitudes;
    else if (origen === 'cliente')
        filas = [await this.situacionCliente(entero(q.idFicha, 'Cliente'), { ...a, permisos: [...a.permisos, 'CU270'] })];
    else if (origen === 'credito')
        filas = [await this.consultarExposicion()];
    else
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Origen inválido'); return { ...(0, exportacionCreditoCsv_1.archivoCreditoM8Csv)(origen, filas), total: filas.length }; }
}
exports.M8Controller = M8Controller;
//# sourceMappingURL=M8Controller.js.map