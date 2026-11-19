"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cargarConfiguracionSeguridadDocumental = cargarConfiguracionSeguridadDocumental;
exports.crearAntivirusAdapterDesdeEntorno = crearAntivirusAdapterDesdeEntorno;
const IntegridadContenido_1 = require("./IntegridadContenido");
const AntivirusAdapter_1 = require("./AntivirusAdapter");
const ENTERO = /^\d+$/;
function cargarConfiguracionSeguridadDocumental(entorno = process.env) {
    let crudo = {};
    if (entorno.DOCUMENTAL_POLITICAS_TECNICAS_JSON?.trim()) {
        try {
            crudo = JSON.parse(entorno.DOCUMENTAL_POLITICAS_TECNICAS_JSON);
        }
        catch {
            throw new Error('DOCUMENTAL_POLITICAS_TECNICAS_JSON no contiene JSON válido');
        }
    }
    if (!crudo || typeof crudo !== 'object' || Array.isArray(crudo))
        throw new Error('Las políticas técnicas deben ser un objeto por clasificación');
    const politicas = {};
    for (const [clasificacion, valor] of Object.entries(crudo)) {
        if (!valor || typeof valor !== 'object' || Array.isArray(valor))
            throw new Error(`Política inválida para ${clasificacion}`);
        const dato = valor;
        const minimo = String(dato.minimoBytes ?? '');
        const maximo = String(dato.maximoBytes ?? '');
        if (!ENTERO.test(minimo) || !ENTERO.test(maximo) || BigInt(minimo) < 1n || BigInt(maximo) < BigInt(minimo))
            throw new Error(`Límites inválidos para ${clasificacion}`);
        if (!Array.isArray(dato.mimesPermitidos) || dato.mimesPermitidos.some(mime => !IntegridadContenido_1.MIME_DOCUMENTALES_SOPORTADOS.includes(mime)))
            throw new Error(`MIME permitidos inválidos para ${clasificacion}`);
        politicas[clasificacion.toUpperCase()] = { minimoBytes: BigInt(minimo), maximoBytes: BigInt(maximo), mimesPermitidos: dato.mimesPermitidos };
    }
    const host = entorno.DOCUMENTAL_CLAMAV_HOST?.trim();
    if (!host)
        return { politicasPorClasificacion: politicas, clamav: null };
    const puerto = Number(entorno.DOCUMENTAL_CLAMAV_PORT ?? '3310');
    const timeoutMs = Number(entorno.DOCUMENTAL_CLAMAV_TIMEOUT_MS ?? '30000');
    const maximoBytes = entorno.DOCUMENTAL_CLAMAV_MAX_BYTES ?? '';
    if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535 || !Number.isInteger(timeoutMs) || timeoutMs < 1000 || !ENTERO.test(maximoBytes) || BigInt(maximoBytes) < 1n)
        throw new Error('Configuración ClamAV inválida');
    return { politicasPorClasificacion: politicas, clamav: { host, puerto, timeoutMs, maximoBytes: BigInt(maximoBytes) } };
}
/** Construye el adaptador real sólo con activación explícita y configuración completa. */
function crearAntivirusAdapterDesdeEntorno(entorno = process.env) {
    if (entorno.DOCUMENTAL_ANTIVIRUS_ENABLED?.trim().toLowerCase() !== 'true')
        return new AntivirusAdapter_1.AntivirusNoDisponible();
    const configuracion = cargarConfiguracionSeguridadDocumental(entorno);
    return configuracion.clamav ? new AntivirusAdapter_1.ClamAvDaemonAdapter(configuracion.clamav) : new AntivirusAdapter_1.AntivirusNoDisponible();
}
//# sourceMappingURL=configuracionSeguridadDocumental.js.map