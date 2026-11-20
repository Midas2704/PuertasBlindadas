"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitesFiltroChile = exports.inicioDiaChile = void 0;
/** Filtros M9: los YYYY-MM-DD del usuario representan días civiles de Chile. */
const zona = 'America/Santiago';
const unDia = 24 * 60 * 60 * 1000;
const formateador = new Intl.DateTimeFormat('en-US', {
    timeZone: zona, year: 'numeric', month: '2-digit', day: '2-digit',
});
const fechaCivil = (epoch) => {
    const piezas = formateador.formatToParts(new Date(epoch));
    const valor = (tipo) => piezas.find(pieza => pieza.type === tipo)?.value;
    return `${valor('year')}-${valor('month')}-${valor('day')}`;
};
const fechaISOValida = (valor) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor))
        return false;
    const [anio, mes, dia] = valor.split('-').map(Number);
    const utc = new Date(Date.UTC(anio, mes - 1, dia));
    return utc.getUTCFullYear() === anio && utc.getUTCMonth() + 1 === mes && utc.getUTCDate() === dia;
};
const diaSiguiente = (valor) => {
    const [anio, mes, dia] = valor.split('-').map(Number);
    return new Date(Date.UTC(anio, mes - 1, dia + 1)).toISOString().slice(0, 10);
};
/** Primer instante UTC cuya fecha civil en Santiago es el día solicitado. */
const inicioDiaChile = (dia) => {
    if (!fechaISOValida(dia))
        throw new RangeError('Fecha de auditoría inválida');
    const [anio, mes, fecha] = dia.split('-').map(Number);
    const centro = Date.UTC(anio, mes - 1, fecha);
    let minimo = centro - unDia;
    let maximo = centro + unDia;
    while (minimo < maximo) {
        const mitad = minimo + Math.floor((maximo - minimo) / 2);
        if (fechaCivil(mitad) < dia)
            minimo = mitad + 1;
        else
            maximo = mitad;
    }
    if (fechaCivil(minimo) !== dia)
        throw new RangeError('Día civil inexistente en Chile');
    return new Date(minimo);
};
exports.inicioDiaChile = inicioDiaChile;
const fechaDeFiltro = (valor) => {
    const fecha = new Date(valor);
    if (!Number.isFinite(fecha.getTime()))
        throw new RangeError('Fecha de auditoría inválida');
    return fecha;
};
const limitesFiltroChile = ({ desde, hasta }) => {
    const gte = desde ? (/^\d{4}-\d{2}-\d{2}$/.test(desde) ? (0, exports.inicioDiaChile)(desde) : fechaDeFiltro(desde)) : undefined;
    const finCivil = Boolean(hasta && /^\d{4}-\d{2}-\d{2}$/.test(hasta));
    const lt = finCivil && hasta ? (0, exports.inicioDiaChile)(diaSiguiente(hasta)) : undefined;
    const lte = hasta && !finCivil ? fechaDeFiltro(hasta) : undefined;
    if (gte && ((lt && gte >= lt) || (lte && gte > lte)))
        throw new RangeError('Rango de fecha inválido');
    return { ...(gte ? { gte } : {}), ...(lt ? { lt } : {}), ...(lte ? { lte } : {}) };
};
exports.limitesFiltroChile = limitesFiltroChile;
//# sourceMappingURL=fechasFiltroChile.js.map