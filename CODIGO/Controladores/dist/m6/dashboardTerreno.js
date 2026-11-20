"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estadoVisibleOtDashboard = exports.promedioDias = void 0;
exports.resumirOperacionTerreno = resumirOperacionTerreno;
exports.resumirIncidenciasTerreno = resumirIncidenciasTerreno;
const diferenciaDias = (inicio, fin) => inicio && fin && fin.getTime() >= inicio.getTime() ? (fin.getTime() - inicio.getTime()) / 86400000 : null;
const promedioDias = (pares) => {
    const valores = pares.map(([inicio, fin]) => diferenciaDias(inicio, fin)).filter((valor) => valor !== null);
    return { valorDias: valores.length ? Math.round((valores.reduce((suma, valor) => suma + valor, 0) / valores.length) * 10) / 10 : null, muestras: valores.length };
};
exports.promedioDias = promedioDias;
const estadoVisibleOtDashboard = (ot) => {
    if (ot.cerrada || ot.estadoOrden === 'completada')
        return 'FINALIZADA';
    if (ot.estadoOrden === 'en_progreso' && ot.estadoUnidad !== 'LIBERADA')
        return 'EN_PRODUCCION';
    if (ot.estadoUnidad === 'LIBERADA')
        return 'LIBERADA';
    return ot.estadoRectificacion || ot.estadoUnidad;
};
exports.estadoVisibleOtDashboard = estadoVisibleOtDashboard;
const nombresEstado = {
    PENDIENTE_RECTIFICACION: 'Pendientes de rectificación', RECTIFICACION_ASIGNADA: 'Pendientes de rectificación', RECTIFICACION_EN_PROCESO: 'Pendientes de rectificación',
    RECTIFICACION_ENVIADA: 'Pendientes de aprobación técnica', PENDIENTE_APROBACION: 'Pendientes de aprobación técnica', PENDIENTE_APROBACION_TECNICA: 'Pendientes de aprobación técnica', RECTIFICACION_DEVUELTA: 'Rectificaciones devueltas',
    RECTIFICACION_APROBADA: 'Aprobadas no liberadas', LIBERADA: 'Liberadas a producción', EN_PRODUCCION: 'En producción', FINALIZADA: 'Finalizadas',
};
const codigoAgrupado = (estado) => {
    if (['PENDIENTE_RECTIFICACION', 'RECTIFICACION_ASIGNADA', 'RECTIFICACION_EN_PROCESO'].includes(estado))
        return 'PENDIENTE_RECTIFICACION';
    if (['RECTIFICACION_ENVIADA', 'PENDIENTE_APROBACION', 'PENDIENTE_APROBACION_TECNICA'].includes(estado))
        return 'PENDIENTE_APROBACION_TECNICA';
    return estado;
};
function resumirOperacionTerreno(ots, tareas) {
    const unicas = [...new Map(ots.map((ot) => [ot.id, ot])).values()];
    const conteos = new Map();
    for (const ot of unicas) {
        const codigo = codigoAgrupado((0, exports.estadoVisibleOtDashboard)(ot));
        conteos.set(codigo, (conteos.get(codigo) || 0) + 1);
    }
    const ordenEstados = ['PENDIENTE_RECTIFICACION', 'PENDIENTE_APROBACION_TECNICA', 'RECTIFICACION_DEVUELTA', 'RECTIFICACION_APROBADA', 'LIBERADA', 'EN_PRODUCCION', 'FINALIZADA'];
    const estadosOt = ordenEstados.map((codigo) => ({ codigo, nombre: nombresEstado[codigo], cantidad: conteos.get(codigo) || 0 }));
    const estadosTarea = (estado) => estado.toUpperCase();
    const cerradas = tareas.filter((tarea) => estadosTarea(tarea.estado) === 'CERRADA').length;
    const pendientes = tareas.filter((tarea) => ['PENDIENTE', 'ASIGNADA'].includes(estadosTarea(tarea.estado))).length;
    const enEjecucion = tareas.filter((tarea) => estadosTarea(tarea.estado) === 'EN_EJECUCION').length;
    const pendientesValidacion = tareas.filter((tarea) => estadosTarea(tarea.estado) === 'PENDIENTE_VALIDACION' || tarea.ejecuciones.some((e) => e.validacion.toLowerCase() === 'pendiente')).length;
    const validadas = tareas.filter((tarea) => tarea.ejecuciones.some((e) => e.validacion.toLowerCase() === 'validada')).length;
    const puertasFabricacion = new Set(tareas.filter((tarea) => estadosTarea(tarea.estado) !== 'CERRADA').map((tarea) => tarea.idOt)).size;
    const puertasFinalizadas = unicas.filter((ot) => (0, exports.estadoVisibleOtDashboard)(ot) === 'FINALIZADA').length;
    const areasMap = new Map();
    for (const tarea of tareas) {
        if (!tarea.areaId || !tarea.area)
            continue;
        const area = areasMap.get(tarea.areaId) || { id: tarea.areaId, nombre: tarea.area, asignadas: 0, pendientes: 0, enEjecucion: 0, cerradas: 0, puertas: new Set() };
        area.asignadas += 1;
        area.puertas.add(tarea.idOt);
        const estado = estadosTarea(tarea.estado);
        if (['PENDIENTE', 'ASIGNADA'].includes(estado))
            area.pendientes += 1;
        if (['EN_EJECUCION', 'PENDIENTE_VALIDACION'].includes(estado))
            area.enEjecucion += 1;
        if (estado === 'CERRADA')
            area.cerradas += 1;
        areasMap.set(tarea.areaId, area);
    }
    const areas = [...areasMap.values()].map(({ puertas, ...area }) => ({ ...area, puertas: puertas.size })).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    const responsablesMap = new Map();
    for (const tarea of tareas) {
        if (!tarea.responsableId || !tarea.responsable)
            continue;
        const item = responsablesMap.get(tarea.responsableId) || { id: tarea.responsableId, nombre: tarea.responsable, area: tarea.area, abiertas: 0, enEjecucion: 0, cerradas: 0 };
        const estado = estadosTarea(tarea.estado);
        if (estado === 'CERRADA')
            item.cerradas += 1;
        else
            item.abiertas += 1;
        if (['EN_EJECUCION', 'PENDIENTE_VALIDACION'].includes(estado))
            item.enEjecucion += 1;
        responsablesMap.set(tarea.responsableId, item);
    }
    return {
        ordenes: { total: unicas.length, estados: estadosOt },
        fabricacion: { puertasEnFabricacion: puertasFabricacion, puertasFinalizadas, tareasRequeridas: tareas.length, tareasPendientes: pendientes, tareasEnEjecucion: enEjecucion, ejecucionesPendientesValidacion: pendientesValidacion, tareasValidadas: validadas, tareasCerradas: cerradas, correccionesPendientes: tareas.filter((tarea) => tarea.esCorrectiva && estadosTarea(tarea.estado) !== 'CERRADA').length, porcentajeAvance: tareas.length ? Math.round(cerradas * 1000 / tareas.length) / 10 : null },
        areas,
        responsables: [...responsablesMap.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
        tiempos: [
            { codigo: 'CREACION_RECTIFICACION', nombre: 'Creación a rectificación', ...(0, exports.promedioDias)(unicas.map((ot) => [ot.creada, ot.rectificada])) },
            { codigo: 'ENVIO_APROBACION', nombre: 'Envío a decisión técnica', ...(0, exports.promedioDias)(unicas.map((ot) => [ot.enviada, ot.decidida])) },
            { codigo: 'LIBERACION_CIERRE', nombre: 'Liberación a cierre', ...(0, exports.promedioDias)(unicas.map((ot) => [ot.liberada, ot.cerrada])) },
            { codigo: 'DURACION_PRODUCCION', nombre: 'Duración registrada de producción', valorDias: null, muestras: 0 },
            { codigo: 'ESPERA_VALIDACION', nombre: 'Espera por validación', valorDias: null, muestras: 0 },
        ],
    };
}
function resumirIncidenciasTerreno(items) {
    const aprobadas = items.filter((item) => item.estadoRevision === 'aprobada');
    const agrupar = (valores) => [...valores.reduce((mapa, valor) => mapa.set(valor, (mapa.get(valor) || 0) + 1), new Map())].map(([nombre, cantidad]) => ({ nombre, cantidad }));
    return { total: items.length, pendientesRevision: items.filter((item) => item.estadoRevision === 'pendiente_revision').length, aprobadas: aprobadas.length, rechazadas: items.filter((item) => item.estadoRevision === 'rechazada').length, pendientesResolucion: aprobadas.filter((item) => item.estado === 'pendiente').length, corregidas: aprobadas.filter((item) => item.estado === 'corregida').length, cerradas: aprobadas.filter((item) => item.estado === 'cerrada').length, fallasConfirmadas: aprobadas.length, porCategoria: agrupar(aprobadas.map((item) => item.categoria || 'Sin categoría')), porArea: agrupar(aprobadas.map((item) => item.area || 'Sin área validada')), porPeriodo: agrupar(aprobadas.map((item) => item.periodo)) };
}
//# sourceMappingURL=dashboardTerreno.js.map