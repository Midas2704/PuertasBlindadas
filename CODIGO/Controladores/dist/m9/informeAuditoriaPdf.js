"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ejecutorInformeM9 = exports.referenciaInformeM9 = exports.fechaInformeM9 = exports.humanizarM9 = void 0;
exports.crearInformeAuditoriaM9 = crearInformeAuditoriaM9;
const pdf_1 = require("../utilidades/pdf");
const etiquetas = {
    AUDITORIA: 'Auditoría', CONSULTA: 'Consulta', EVIDENCIA: 'evidencia', EXPORTACION: 'Exportación',
    DASHBOARD: 'Dashboard', CONFIRMADA: 'confirmada', MODULO: 'módulo', CREACION: 'creación',
    ACTUALIZACION: 'actualización', ELIMINACION: 'eliminación', CREDITO: 'crédito', RECHAZADO: 'Rechazado',
    EXITOSO: 'Exitoso', FALLIDO: 'Fallido', SISTEMA: 'Sistema', HUMANO: 'Usuario',
};
const humanizarM9 = (valor) => {
    const original = String(valor ?? '').trim();
    if (!original)
        return '—';
    const frases = {
        CONSULTA_EVIDENCIA: 'Consulta de evidencia',
        EXPORTACION_DASHBOARD_CONFIRMADA: 'Exportación de Dashboard confirmada',
    };
    if (frases[original.toUpperCase()])
        return frases[original.toUpperCase()];
    const escenario = original.match(/^DEMO[-_]UI[-_]ESCENARIO[-_](\d+)$/i);
    if (escenario)
        return `Escenario de demostración ${escenario[1]}`;
    return original.replace(/[-_]+/g, ' ').split(/\s+/).filter(Boolean).map((palabra, indice) => {
        const clave = palabra.toUpperCase();
        const traducida = etiquetas[clave] || palabra.toLocaleLowerCase('es-CL');
        return indice === 0 ? traducida.charAt(0).toLocaleUpperCase('es-CL') + traducida.slice(1) : traducida;
    }).join(' ');
};
exports.humanizarM9 = humanizarM9;
const fechaInformeM9 = (valor, incluirHora = true) => {
    const fecha = new Date(String(valor ?? ''));
    if (Number.isNaN(fecha.getTime()))
        return '—';
    return new Intl.DateTimeFormat('es-CL', incluirHora
        ? { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'America/Santiago' }
        : { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(fecha).replace(',', '');
};
exports.fechaInformeM9 = fechaInformeM9;
const solicitanteInforme = (scope) => {
    const solicitante = String(scope.solicitante || '').trim();
    if (!solicitante)
        return 'Sistema';
    return /^\d+$/.test(solicitante) ? `Usuario #${solicitante}` : (0, exports.humanizarM9)(solicitante);
};
const referenciaInformeM9 = (evento) => {
    // MIDAS: respetamos el enmascarado resuelto por M9; presentación nunca recupera datos restringidos.
    const tipo = evento.referencia?.tipo, id = evento.referencia?.id;
    if (id === null || id === undefined || id === '' || id === '***')
        return id === '***' ? 'Restringida' : '—';
    return tipo ? `${(0, exports.humanizarM9)(tipo)} ${String(id)}` : String(id);
};
exports.referenciaInformeM9 = referenciaInformeM9;
const ejecutorInformeM9 = (evento) => {
    const tipo = String(evento.ejecutor?.tipo || '').toUpperCase(), referencia = String(evento.ejecutor?.referencia ?? '').trim();
    if (referencia === '***')
        return 'Restringido';
    if (tipo === 'SISTEMA')
        return referencia && referencia.toUpperCase() !== 'SISTEMA' ? `Sistema (${(0, exports.humanizarM9)(referencia)})` : 'Sistema';
    if (/^\d+$/.test(referencia))
        return `Usuario #${referencia}`;
    const pareceClaveTecnica = /^[A-Z0-9_-]+$/.test(referencia);
    return referencia ? (pareceClaveTecnica ? (0, exports.humanizarM9)(referencia) : referencia) : tipo === 'HUMANO' ? 'Usuario' : 'Sistema';
};
exports.ejecutorInformeM9 = ejecutorInformeM9;
const tonoResultado = (resultado) => resultado === 'EXITOSO' ? 'exitoso' : resultado === 'RECHAZADO' ? 'rechazado' : resultado === 'FALLIDO' ? 'fallido' : 'neutro';
const filtrosInforme = (filtros) => {
    const definiciones = [
        ['modulo', 'Módulo', exports.humanizarM9], ['resultado', 'Resultado', exports.humanizarM9], ['buscar', 'Búsqueda', valor => String(valor)],
        ['desde', 'Desde', valor => (0, exports.fechaInformeM9)(valor, false)], ['hasta', 'Hasta', valor => (0, exports.fechaInformeM9)(valor, false)],
        ['productor', 'Productor', exports.humanizarM9], ['operacion', 'Operación', exports.humanizarM9], ['ejecutor', 'Ejecutor', exports.humanizarM9],
        ['entidadTipo', 'Tipo de entidad', exports.humanizarM9], ['entidadReferencia', 'Referencia', valor => String(valor)],
        ['identidadLogica', 'Identidad lógica', valor => String(valor)],
    ];
    return definiciones.flatMap(([clave, etiqueta, presentar]) => filtros[clave] === undefined || filtros[clave] === null || filtros[clave] === '' ? [] : [{ etiqueta, valor: presentar(filtros[clave]) }]);
};
function crearInformeAuditoriaM9(eventosEntrada, filtros, scope, generadoEn) {
    // MIDAS: el informe trabaja con eventos ya filtrados y autorizados, sin volver a consultar evidencia.
    const eventos = eventosEntrada.map(evento => ({ ...evento, resultadoNormalizado: String(evento.resultado || '').toUpperCase(), moduloNormalizado: String(evento.modulo || 'SIN_MODULO').toUpperCase() }));
    const resultadosBase = ['EXITOSO', 'RECHAZADO', 'FALLIDO'];
    const plurales = { EXITOSO: 'Exitosos', RECHAZADO: 'Rechazados', FALLIDO: 'Fallidos' };
    const resultados = resultadosBase.map(resultado => {
        const cantidad = eventos.filter(evento => evento.resultadoNormalizado === resultado).length;
        return { etiqueta: plurales[resultado], cantidad, porcentaje: eventos.length ? cantidad / eventos.length * 100 : 0, tono: tonoResultado(resultado) };
    });
    const modulos = [...eventos.reduce((mapa, evento) => mapa.set(evento.moduloNormalizado, (mapa.get(evento.moduloNormalizado) || 0) + 1), new Map())]
        .map(([etiqueta, cantidad]) => ({ etiqueta, cantidad })).sort((a, b) => a.etiqueta.localeCompare(b.etiqueta, 'es', { numeric: true }));
    const filtrosPresentados = filtrosInforme(filtros);
    const comprometidos = eventos.filter(evento => String(evento.integridad || '').toUpperCase() === 'COMPROMETIDA').length;
    if (comprometidos)
        filtrosPresentados.push({ etiqueta: 'Advertencia forense', valor: `${comprometidos} evidencia(s) con integridad comprometida; se incluyen marcadas y sin contenido funcional confiable.` });
    const periodo = filtros.desde || filtros.hasta ? `${filtros.desde ? (0, exports.fechaInformeM9)(filtros.desde, false) : 'Inicio'} a ${filtros.hasta ? (0, exports.fechaInformeM9)(filtros.hasta, false) : 'Actualidad'}` : 'Todos los eventos visibles';
    const tarjetas = [
        { etiqueta: 'Total de eventos', valor: String(eventos.length), tono: 'neutro' },
        ...resultados.map(resultado => ({ etiqueta: resultado.etiqueta, valor: String(resultado.cantidad), detalle: `${resultado.porcentaje.toFixed(1).replace('.', ',')}%`, tono: resultado.tono })),
        { etiqueta: 'Módulos involucrados', valor: String(modulos.length), tono: 'neutro' },
        ...(comprometidos ? [{ etiqueta: 'Integridad comprometida', valor: String(comprometidos), tono: 'fallido' }] : []),
    ];
    const informe = {
        titulo: 'Informe de Auditoría', subtitulo: 'Puertas Blindadas - Módulo de Auditoría M9', generado: (0, exports.fechaInformeM9)(generadoEn), periodo,
        solicitante: solicitanteInforme(scope), total: eventos.length, filtros: filtrosPresentados, tarjetas, modulos, resultados,
        tabla: {
            columnas: [
                { clave: 'fecha', etiqueta: 'Fecha y hora', ancho: 75 }, { clave: 'modulo', etiqueta: 'Módulo', ancho: 35 },
                { clave: 'operacion', etiqueta: 'Operación', ancho: 100 }, { clave: 'resultado', etiqueta: 'Resultado', ancho: 50 },
                { clave: 'integridad', etiqueta: 'Integridad', ancho: 75 }, { clave: 'referencia', etiqueta: 'Referencia', ancho: 70 }, { clave: 'ejecutor', etiqueta: 'Ejecutor', ancho: 106 },
            ],
            filas: eventos.map(evento => ({ fecha: (0, exports.fechaInformeM9)(evento.ocurrencia), modulo: (0, exports.humanizarM9)(evento.modulo), operacion: (0, exports.humanizarM9)(evento.operacion), resultado: (0, exports.humanizarM9)(evento.resultado), integridad: (0, exports.humanizarM9)(evento.integridad), referencia: (0, exports.referenciaInformeM9)(evento), ejecutor: (0, exports.ejecutorInformeM9)(evento), tonoResultado: String(evento.integridad).toUpperCase() === 'COMPROMETIDA' ? 'fallido' : tonoResultado(evento.resultadoNormalizado) })),
        },
        pie: comprometidos ? 'ADVERTENCIA: el informe contiene evidencia marcada con integridad comprometida.' : 'Documento generado por el Sistema Financiero Puertas Blindadas',
    };
    return (0, pdf_1.archivoPdfInforme)('auditoria-m9.pdf', informe);
}
//# sourceMappingURL=informeAuditoriaPdf.js.map