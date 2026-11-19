"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.manifiestoDemoValido = manifiestoDemoValido;
exports.seleccionarParHistoricoDemo = seleccionarParHistoricoDemo;
exports.conciliarHistoricosDemoEnCalculo = conciliarHistoricosDemoEnCalculo;
function manifiestoDemoValido(descripcion) {
    if (!descripcion)
        return false;
    try {
        const m = JSON.parse(descripcion);
        return m.version === 2 && m.meses === 36 && m.semilla === 2704 && m.corte === '2026-10-21';
    }
    catch {
        return false;
    }
}
/**
 * Decide sin escribir. Exige un par exacto y no ambiguo de componentes
 * originados por la seed y la existencia de sus sustitutos aprobados.
 */
function seleccionarParHistoricoDemo(anio, mes, componentesDemo, vigentes) {
    if (anio !== 2026 || mes !== 10 || componentesDemo.length !== 2)
        return [];
    const prefijo = 'DEMO-UI:';
    if (componentesDemo.some(c => !c.clave_negocio?.startsWith(prefijo)))
        return [];
    const llave = /^DEMO-UI:(SUELDO|DEDUCCION):(\d{4}-\d{2}):([1-9]\d*)$/;
    const pares = new Map();
    let indice = null;
    for (const c of componentesDemo) {
        const match = llave.exec(c.clave_negocio || '');
        if (!match || match[2] !== '2026-10' || (indice !== null && indice !== match[3]))
            return [];
        indice = match[3];
        const sueldo = match[1] === 'SUELDO';
        if (c.tipo !== (sueldo ? 'SUELDO_BASE' : 'DEDUCCION_AUTOMATICA') ||
            c.descripcion !== (sueldo ? 'DEMO-UI sueldo' : 'DEMO-UI deduccion') ||
            c.fuente_tipo !== 'AUTOMATICA_HISTORICA' ||
            c.estado_revision !== 'conflicto' ||
            c.monto === null ||
            c.referencia_origen !== null ||
            c.version_origen !== null ||
            c.fecha_origen !== null ||
            c.id_componente_origen !== null ||
            c.tipo_relacion !== null ||
            c.motivo !== 'La fuente automática dejó de aplicar; requiere revisión' ||
            pares.has(match[1]))
            return [];
        pares.set(match[1], c);
    }
    if (!pares.has('SUELDO') || !pares.has('DEDUCCION'))
        return [];
    const aprobados = vigentes.filter(c => c.fuente_tipo === 'AUTOMATICA' && c.estado_revision === 'aprobado' && c.monto !== null);
    const sueldos = aprobados.filter(c => c.tipo === 'SUELDO_BASE' && c.clave_negocio === 'SUELDO_BASE');
    const previsionales = aprobados.filter(c => c.tipo === 'DEDUCCION_PREVISIONAL');
    const impuestos = aprobados.filter(c => c.tipo === 'IMPUESTO_RENTA' && c.clave_negocio === 'IMPUESTO_UNICO_SEGUNDA_CATEGORIA');
    if (sueldos.length !== 1 || previsionales.length === 0 || impuestos.length !== 1)
        return [];
    return componentesDemo.map(c => c.id_componente_remuneracion).sort((a, b) => a - b);
}
/**
 * Opera DENTRO de la transacción serializable ya abierta por M6.
 * Jamás altera remuneraciones cerradas, con pagos ni sin manifiesto DEMO.
 */
async function conciliarHistoricosDemoEnCalculo(tx, idRemuneracion) {
    const rem = await tx.remuneracion.findUnique({
        where: { id_remuneracion: idRemuneracion },
        include: { periodo: true },
    });
    if (!rem || rem.estado !== 'abierta' || rem.periodo.cerrado_en || rem.periodo.anio !== 2026 || rem.periodo.mes !== 10)
        return 0;
    const bd = await tx.$queryRaw `SELECT current_database() AS nombre`;
    if (bd[0]?.nombre !== 'pblindadas_finanzas')
        return 0;
    const manifiestos = await tx.parametro_remuneracional.findMany({
        where: { codigo: 'DEMO_UI_MANIFIESTO_V2' },
        select: { descripcion: true },
    });
    if (manifiestos.length !== 1 || !manifiestoDemoValido(manifiestos[0].descripcion))
        return 0;
    // Incluso un pago reversado requiere revisión humana: no se modifica.
    const pagos = await tx.pago_remuneracion.count({
        where: { origen_tipo: 'REMUNERACION', origen_id: idRemuneracion },
    });
    if (pagos !== 0)
        return 0;
    const demo = await tx.componente_remuneracion.findMany({
        where: { id_remuneracion: idRemuneracion, clave_negocio: { startsWith: 'DEMO-UI:' } },
    });
    const vigentes = await tx.componente_remuneracion.findMany({
        where: { id_remuneracion: idRemuneracion, fuente_tipo: 'AUTOMATICA', estado_revision: 'aprobado' },
    });
    const ids = seleccionarParHistoricoDemo(rem.periodo.anio, rem.periodo.mes, demo, vigentes);
    if (ids.length !== 2)
        return 0;
    const resultado = await tx.componente_remuneracion.updateMany({
        where: {
            id_remuneracion: idRemuneracion,
            id_componente_remuneracion: { in: ids },
            fuente_tipo: 'AUTOMATICA_HISTORICA',
            estado_revision: 'conflicto',
        },
        data: {
            estado_revision: 'reemplazado',
            motivo: 'Conciliación automática DEMO-UI (octubre 2026): antecedente ficticio sustituido por cálculo M6; monto y origen preservados.',
        },
    });
    if (resultado.count !== 2)
        throw new Error('La conciliación DEMO-UI cambió concurrentemente; se revierte el cálculo');
    return resultado.count;
}
//# sourceMappingURL=conciliacionHistoricaDemo.js.map