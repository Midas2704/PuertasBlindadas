"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.humanizarCsv = exports.fechaCsv = exports.archivoCsvAdministrativo = exports.crearCsvAdministrativo = void 0;
const textoCelda = (valor) => {
    if (valor === null || valor === undefined)
        return '';
    if (typeof valor === 'boolean')
        return valor ? 'Sí' : 'No';
    if (typeof valor === 'number' || typeof valor === 'bigint')
        return String(valor);
    const texto = String(valor);
    // MIDAS: neutralizamos fórmulas sólo en texto; los montos negativos reales siguen siendo números.
    return /^[\s\u00A0]*[=+\-@]/.test(texto) ? `'${texto}` : texto;
};
const escapar = (valor, separador) => {
    const texto = textoCelda(valor).replace(/\r\n|\r|\n/g, ' ').replace(/"/g, '""');
    return texto.includes(separador) || texto.includes('"') ? `"${texto}"` : texto;
};
// MIDAS: el BOM mantiene tildes y eñes al abrir el archivo directamente en una planilla.
const crearCsvAdministrativo = (filas, columnas, separador = ',') => {
    const lineas = [
        columnas.map(columna => escapar(columna.encabezado, separador)).join(separador),
        ...filas.map(fila => columnas.map(columna => escapar(columna.valor(fila), separador)).join(separador)),
    ];
    return `\uFEFF${lineas.join('\r\n')}`;
};
exports.crearCsvAdministrativo = crearCsvAdministrativo;
const archivoCsvAdministrativo = (nombre, filas, columnas, separador = ',') => {
    const csv = (0, exports.crearCsvAdministrativo)(filas, columnas, separador);
    return { nombre, tipo: 'text/csv;charset=utf-8', mime: 'text/csv;charset=utf-8', contenido: `data:text/csv;base64,${Buffer.from(csv, 'utf8').toString('base64')}` };
};
exports.archivoCsvAdministrativo = archivoCsvAdministrativo;
const fechaCsv = (valor, conHora = false) => {
    if (!valor)
        return '';
    const fecha = valor instanceof Date ? valor : new Date(String(valor));
    if (Number.isNaN(fecha.getTime()))
        return '';
    const opciones = conHora
        ? { timeZone: 'America/Santiago', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }
        : { timeZone: 'UTC', day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('es-CL', opciones).format(fecha).replace(',', '');
};
exports.fechaCsv = fechaCsv;
const humanizarCsv = (valor) => {
    const texto = String(valor ?? '').trim();
    if (!texto)
        return '';
    const conocidos = {
        EXCEPCION: 'Excepción', CONFIGURACION_PENDIENTE: 'Configuración pendiente',
        CONDICIONADO_F047_NO_IMPLEMENTADO: 'Condicionado: capacidad próxima no implementada',
    };
    return conocidos[texto.toUpperCase()] || texto.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').toLocaleLowerCase('es-CL').replace(/^\p{L}/u, letra => letra.toLocaleUpperCase('es-CL'));
};
exports.humanizarCsv = humanizarCsv;
//# sourceMappingURL=csv.js.map