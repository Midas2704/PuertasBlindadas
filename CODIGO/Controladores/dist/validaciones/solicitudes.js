"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.identificador = identificador;
exports.texto = texto;
exports.numeroNoNegativo = numeroNoNegativo;
exports.validarFiltros = validarFiltros;
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
function identificador(valor) {
    // si llega hasta acá, todavía falta revisar que sea un id usable
    if (!/^\d+$/.test(String(valor)))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Identificador inválido');
    const numero = Number(valor);
    if (!Number.isSafeInteger(numero) || numero <= 0)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Identificador inválido');
    return numero;
}
function texto(valor, maximo = 150) {
    if (valor === undefined || valor === null)
        return '';
    if (typeof valor !== 'string' || valor.length > maximo)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Texto inválido o demasiado largo');
    return valor.trim();
}
function numeroNoNegativo(valor, nombre) {
    if (valor === null || valor === undefined || valor === '' || !['string', 'number'].includes(typeof valor))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${nombre} es obligatorio`);
    const numero = Number(valor);
    if (!Number.isFinite(numero) || numero < 0)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${nombre} debe ser un número válido no negativo`);
    return numero;
}
function fechaConsulta(valor, nombre, finDelDia = false) {
    const entrada = texto(valor, 10);
    if (!entrada)
        return undefined;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entrada))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${nombre} debe tener formato AAAA-MM-DD`);
    const fecha = new Date(`${entrada}T${finDelDia ? '23:59:59.999' : '00:00:00.000'}Z`);
    if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== entrada)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${nombre} no es una fecha válida`);
    return fecha;
}
function validarFiltros(consulta) {
    const estado = texto(consulta.estado || 'activos');
    if (!['activos', 'inactivos', 'todos'].includes(estado))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Estado permitido: activos, inactivos o todos');
    for (const clave of ['deuda', 'morosos']) {
        if (consulta[clave] !== undefined && !['true', 'false'].includes(String(consulta[clave])))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, `Filtro ${clave} inválido`);
    }
    const ordenar = texto(consulta.ordenar || 'nombre');
    const direccion = texto(consulta.direccion || 'asc');
    if (!['nombre', 'rut', 'saldo', 'ultimaActividad'].includes(ordenar) || !['asc', 'desc'].includes(direccion))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Ordenamiento inválido');
    const segmento = texto(consulta.segmento).toUpperCase();
    if (segmento && !['B2B', 'B2C'].includes(segmento))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Segmento permitido: B2B o B2C');
    const situacion = texto(consulta.situacion).toLowerCase();
    if (situacion && !['al_dia', 'deuda_vigente', 'moroso'].includes(situacion))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Situación financiera inválida');
    const fechaDesde = fechaConsulta(consulta.fechaDesde, 'Fecha desde');
    const fechaHasta = fechaConsulta(consulta.fechaHasta, 'Fecha hasta', true);
    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El período de actividad es inválido');
    return { busqueda: texto(consulta.busqueda ?? consulta.search), estado: estado, segmento: segmento ? segmento : undefined, deuda: consulta.deuda === 'true', morosos: consulta.morosos === 'true', situacion: situacion ? situacion : undefined, fechaDesde, fechaHasta, ordenar: ordenar, direccion: direccion };
}
//# sourceMappingURL=solicitudes.js.map