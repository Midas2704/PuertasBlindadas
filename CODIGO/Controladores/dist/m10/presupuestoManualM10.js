"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresupuestoManualM10 = exports.CATEGORIAS_FLUJO_M10 = exports.CATEGORIAS_RESULTADOS_M10 = void 0;
exports.validarPresupuestoManualM10 = validarPresupuestoManualM10;
exports.compararVersionesPresupuestoM10 = compararVersionesPresupuestoM10;
const client_1 = require("@prisma/client");
const db_1 = require("../db");
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
exports.CATEGORIAS_RESULTADOS_M10 = ['VENTAS_NETAS', 'COSTOS_DIRECTOS', 'GASTOS_OPERACIONALES'];
exports.CATEGORIAS_FLUJO_M10 = ['INGRESOS_OPERACIONALES', 'OTROS_INGRESOS', 'PROVEEDORES', 'REMUNERACIONES', 'IMPUESTOS', 'OTROS_EGRESOS'];
const entero = (valor, nombre) => {
    const numero = Number(valor);
    if (!Number.isSafeInteger(numero))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${nombre} invalido`);
    return numero;
};
function validarPresupuestoManualM10(entrada) {
    const anio = entero(entrada.anio, 'Ano');
    if (anio < 2000 || anio > 2200)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Ano fuera de rango');
    const ambito = String(entrada.ambito || 'GENERAL').trim().toUpperCase();
    if (!/^[A-Z0-9_]{1,40}$/.test(ambito))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Ambito invalido');
    const moneda = String(entrada.moneda || 'CLP').trim().toUpperCase();
    if (!/^[A-Z]{3,10}$/.test(moneda))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Moneda invalida');
    if (moneda !== 'CLP')
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El presupuesto M10 se mantiene en CLP hasta contar con un contrato FX presupuestario validado');
    const revisionEsperada = entrada.revisionEsperada === undefined ? null : entero(entrada.revisionEsperada, 'Revision esperada');
    const motivo = String(entrada.motivo || '').trim();
    if (motivo.length > 1000)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El motivo supera 1000 caracteres');
    if (!Array.isArray(entrada.meses) || entrada.meses.length !== 12)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El presupuesto debe contener exactamente los 12 meses');
    const vistos = new Set();
    const partidas = [];
    for (const valor of entrada.meses) {
        if (!valor || typeof valor !== 'object' || Array.isArray(valor))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Mes presupuestario invalido');
        const fila = valor;
        const mes = entero(fila.mes, 'Mes');
        if (mes < 1 || mes > 12 || vistos.has(mes))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Los meses deben ser unicos entre 1 y 12');
        vistos.add(mes);
        for (const [tipo, categorias] of [['RESULTADOS', exports.CATEGORIAS_RESULTADOS_M10], ['FLUJO_CAJA', exports.CATEGORIAS_FLUJO_M10]]) {
            const fuente = fila[tipo === 'RESULTADOS' ? 'resultados' : 'flujoCaja'];
            if (!fuente || typeof fuente !== 'object' || Array.isArray(fuente))
                throw new ErrorAplicacion_1.ErrorAplicacion(400, `Faltan partidas de ${tipo} para el mes ${mes}`);
            for (const categoria of categorias) {
                const crudo = fuente[categoria];
                let monto;
                try {
                    monto = new client_1.Prisma.Decimal(String(crudo));
                }
                catch {
                    throw new ErrorAplicacion_1.ErrorAplicacion(400, `Monto invalido en ${categoria}, mes ${mes}`);
                }
                if (!monto.isFinite() || monto.lt(0))
                    throw new ErrorAplicacion_1.ErrorAplicacion(400, `Monto no negativo obligatorio en ${categoria}, mes ${mes}`);
                partidas.push({ mes, tipo, categoria, monto: monto.toDecimalPlaces(2) });
            }
        }
    }
    return { anio, ambito, moneda, revisionEsperada, motivo: motivo || null, partidas };
}
const variacion = (actual, base) => base === 0 ? null : Number((((actual - base) / Math.abs(base)) * 100).toFixed(2));
function compararVersionesPresupuestoM10(versionA, versionB) {
    const detallesA = new Map((versionA.detalles || []).map((item) => [`${item.mes}:${item.tipo}:${item.categoria}`, Number(item.monto)]));
    const detallesB = new Map((versionB.detalles || []).map((item) => [`${item.mes}:${item.tipo}:${item.categoria}`, Number(item.monto)]));
    const claves = [...new Set([...detallesA.keys(), ...detallesB.keys()])].sort();
    return claves.map(clave => {
        const [mes, tipo, categoria] = String(clave).split(':');
        const base = detallesA.get(clave) ?? 0;
        const actual = detallesB.get(clave) ?? 0;
        return { mes: Number(mes), tipo, categoria, versionA: base, versionB: actual, diferencia: Number((actual - base).toFixed(2)), variacionPorcentual: variacion(actual, base) };
    });
}
const presentar = (presupuesto) => ({
    id: String(presupuesto.id_presupuesto_manual_m10), anio: presupuesto.anio, ambito: presupuesto.ambito,
    moneda: presupuesto.moneda.codigo_moneda, estado: presupuesto.estado, revision: presupuesto.revision,
    versiones: (presupuesto.versiones || []).map((version) => ({
        id: String(version.id_version_presupuesto_m10), numero: version.numero_version, tipo: version.tipo_version,
        revisionBase: version.revision_base, motivo: version.motivo, creadoEn: version.fecha_creacion,
        meses: Array.from({ length: 12 }, (_, indice) => {
            const mes = indice + 1;
            const detalles = (version.detalles || []).filter((item) => item.mes === mes);
            const bloque = (tipo) => Object.fromEntries(detalles.filter((item) => item.tipo === tipo).map((item) => [item.categoria, Number(item.monto)]));
            return { mes, resultados: bloque('RESULTADOS'), flujoCaja: bloque('FLUJO_CAJA') };
        }),
    })),
});
class PresupuestoManualM10 {
    async consultar(consulta) {
        const anio = consulta.anio === undefined ? undefined : entero(consulta.anio, 'Ano');
        const id = consulta.id === undefined ? undefined : BigInt(String(consulta.id));
        const filas = await db_1.prisma.presupuesto_manual_m10.findMany({ where: { ...(id ? { id_presupuesto_manual_m10: id } : {}), ...(anio ? { anio } : {}), estado: 'activo' }, include: { moneda: true, versiones: { include: { detalles: true }, orderBy: { numero_version: 'asc' } } }, orderBy: [{ anio: 'desc' }, { id_presupuesto_manual_m10: 'asc' }] });
        return { estado: filas.length ? 'VALIDO' : 'SIN_RESULTADOS', presupuestos: filas.map(presentar), conceptos: { real: 'Consultado dinamicamente desde sus fuentes owner', proyeccion: 'Proyeccion automatica independiente', presupuesto: 'Version manual inmutable' } };
    }
    async guardar(entrada, actorId, id) {
        const datos = validarPresupuestoManualM10(entrada);
        const moneda = await db_1.prisma.moneda.findUnique({ where: { codigo_moneda: datos.moneda } });
        if (!moneda || moneda.estado_moneda !== 'activo')
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Moneda no disponible');
        try {
            return await db_1.prisma.$transaction(async (tx) => {
                const existente = id ? await tx.presupuesto_manual_m10.findUnique({ where: { id_presupuesto_manual_m10: id }, include: { moneda: true, versiones: { include: { detalles: true }, orderBy: { numero_version: 'asc' } } } }) : null;
                if (id && !existente)
                    throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Presupuesto no encontrado');
                if (existente && (existente.anio !== datos.anio || existente.ambito !== datos.ambito || existente.id_moneda !== moneda.id_moneda))
                    throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La identidad anual y monetaria del presupuesto no puede cambiarse');
                if (existente && datos.revisionEsperada !== existente.revision)
                    throw new ErrorAplicacion_1.ErrorAplicacion(409, 'El presupuesto cambio concurrentemente; vuelve a cargarlo');
                if (existente && !datos.motivo)
                    throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El motivo es obligatorio para crear una revision');
                if (!existente) {
                    const duplicado = await tx.presupuesto_manual_m10.findUnique({ where: { anio_ambito_id_moneda: { anio: datos.anio, ambito: datos.ambito, id_moneda: moneda.id_moneda } } });
                    if (duplicado)
                        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Ya existe un presupuesto para ese ano, ambito y moneda');
                }
                const presupuesto = existente || await tx.presupuesto_manual_m10.create({ data: { anio: datos.anio, ambito: datos.ambito, id_moneda: moneda.id_moneda, creado_por: actorId } });
                const numero = existente ? existente.revision + 1 : 1;
                const version = await tx.version_presupuesto_m10.create({ data: { id_presupuesto_manual_m10: presupuesto.id_presupuesto_manual_m10, numero_version: numero, tipo_version: numero === 1 ? 'ORIGINAL' : 'REVISION', revision_base: existente?.revision || 0, motivo: datos.motivo, creado_por: actorId, detalles: { create: datos.partidas.map(item => ({ mes: item.mes, tipo: item.tipo, categoria: item.categoria, monto: item.monto })) } }, include: { detalles: true } });
                const actualizado = existente ? await tx.presupuesto_manual_m10.update({ where: { id_presupuesto_manual_m10: presupuesto.id_presupuesto_manual_m10, revision: existente.revision }, data: { revision: { increment: 1 }, fecha_actualizacion: new Date() }, include: { moneda: true, versiones: { include: { detalles: true }, orderBy: { numero_version: 'asc' } } } }) : await tx.presupuesto_manual_m10.findUniqueOrThrow({ where: { id_presupuesto_manual_m10: presupuesto.id_presupuesto_manual_m10 }, include: { moneda: true, versiones: { include: { detalles: true }, orderBy: { numero_version: 'asc' } } } });
                const salida = presentar(actualizado);
                Object.defineProperty(salida, '__auditoriaM9', { enumerable: false, value: { anterior: existente ? { id: String(existente.id_presupuesto_manual_m10), revision: existente.revision } : undefined, nuevo: { id: salida.id, anio: salida.anio, ambito: salida.ambito, moneda: salida.moneda, revision: salida.revision, version: String(version.id_version_presupuesto_m10) } } });
                return salida;
            }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
        }
        catch (error) {
            if (error instanceof ErrorAplicacion_1.ErrorAplicacion)
                throw error;
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError && ['P2002', 'P2025', 'P2034'].includes(error.code))
                throw new ErrorAplicacion_1.ErrorAplicacion(409, 'El presupuesto fue modificado concurrentemente');
            throw error;
        }
    }
    async compararVersiones(id, consulta) {
        const numeroA = entero(consulta.versionA, 'Version A');
        const numeroB = entero(consulta.versionB, 'Version B');
        const presupuesto = await db_1.prisma.presupuesto_manual_m10.findUnique({ where: { id_presupuesto_manual_m10: id }, include: { versiones: { include: { detalles: true } } } });
        if (!presupuesto)
            throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Presupuesto no encontrado');
        const versionA = presupuesto.versiones.find(version => version.numero_version === numeroA);
        const versionB = presupuesto.versiones.find(version => version.numero_version === numeroB);
        if (!versionA || !versionB)
            throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Version presupuestaria no encontrada');
        return { presupuestoId: String(id), versionA: numeroA, versionB: numeroB, diferencias: compararVersionesPresupuestoM10(versionA, versionB) };
    }
}
exports.PresupuestoManualM10 = PresupuestoManualM10;
//# sourceMappingURL=presupuestoManualM10.js.map