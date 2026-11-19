"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estaVigente = exports.fechaComercial = exports.variantesRegionNormalizada = exports.normalizarRegion = exports.normalizarUbicacion = void 0;
exports.resolverCoberturaDesdeTarifas = resolverCoberturaDesdeTarifas;
const normalizarUbicacion = (valor) => String(valor ?? '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().replace(/\s+/g, ' ').toUpperCase();
exports.normalizarUbicacion = normalizarUbicacion;
/** Canoniza nombres oficiales y abreviados sin perder compatibilidad con tarifas históricas. */
const normalizarRegion = (valor) => {
    const original = (0, exports.normalizarUbicacion)(valor);
    if (['RM', 'REGION METROPOLITANA', 'REGION METROPOLITANA DE SANTIAGO', 'METROPOLITANA DE SANTIAGO'].includes(original))
        return 'METROPOLITANA';
    return original.replace(/^REGION\s+(?:DE(?:L)?\s+)?/, '');
};
exports.normalizarRegion = normalizarRegion;
const variantesRegionNormalizada = (valor) => {
    const original = (0, exports.normalizarUbicacion)(valor);
    const canonica = (0, exports.normalizarRegion)(valor);
    const variantes = [original, canonica, `REGION DE ${canonica}`];
    if (canonica === 'METROPOLITANA')
        variantes.push('RM', 'REGION METROPOLITANA', 'REGION METROPOLITANA DE SANTIAGO', 'METROPOLITANA DE SANTIAGO');
    return [...new Set(variantes)];
};
exports.variantesRegionNormalizada = variantesRegionNormalizada;
const fechaComercial = (valor, defecto = new Date()) => {
    const texto = typeof valor === 'string' ? valor.trim() : '';
    const fecha = texto ? new Date(`${texto.slice(0, 10)}T12:00:00.000Z`) : defecto;
    if (!Number.isFinite(fecha.getTime()))
        throw new Error('La fecha comercial no es válida');
    return fecha;
};
exports.fechaComercial = fechaComercial;
const estaVigente = (desde, hasta, fecha) => desde <= fecha && (hasta === null || hasta >= fecha);
exports.estaVigente = estaVigente;
/** La coincidencia comunal, incluso una exclusión, prevalece sobre el fallback regional. */
function resolverCoberturaDesdeTarifas(tarifas, region, comuna) {
    const regionNormalizada = (0, exports.normalizarRegion)(region);
    const comunaNormalizada = (0, exports.normalizarUbicacion)(comuna) || null;
    const candidatas = tarifas.filter(item => (0, exports.normalizarRegion)(item.regionNormalizada) === regionNormalizada);
    const exacta = comunaNormalizada
        ? candidatas.find(item => item.comunaNormalizada === comunaNormalizada && item.alcance === 'COMUNA')
        : undefined;
    const elegida = exacta ?? candidatas.find(item => item.alcance === 'REGION' && item.comunaNormalizada === null);
    const origen = exacta ? 'COMUNA' : elegida ? 'REGION' : 'NINGUNO';
    if (!elegida)
        return { estado: 'SIN_COBERTURA', origen, tarifa: null, mensaje: 'No existe cobertura comercial configurada para la ubicación' };
    if (elegida.estadoCobertura === 'NO_DISPONIBLE')
        return { estado: 'NO_DISPONIBLE', origen, tarifa: elegida, mensaje: 'Instalación no disponible para la ubicación' };
    if (elegida.estadoCobertura === 'REQUIERE_EVALUACION')
        return { estado: 'REQUIERE_EVALUACION', origen, tarifa: elegida, mensaje: 'Instalación sujeta a evaluación comercial' };
    if (elegida.estadoCobertura !== 'DISPONIBLE' || elegida.precio === null || !elegida.moneda) {
        return { estado: 'SIN_COBERTURA', origen, tarifa: elegida, mensaje: 'La cobertura no posee una tarifa comercial vigente' };
    }
    return { estado: 'VIGENTE', origen, tarifa: elegida, mensaje: 'Tarifa comercial vigente' };
}
//# sourceMappingURL=contratosCatalogoComercial.js.map