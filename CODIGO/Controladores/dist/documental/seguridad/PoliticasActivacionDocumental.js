"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cargarPoliticasActivacionDocumental = cargarPoliticasActivacionDocumental;
const IntegridadContenido_1 = require("./IntegridadContenido");
const enteroPositivo = (valor, campo) => {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 1)
        throw new Error(`Política documental incompleta: ${campo}`);
    return numero;
};
/**
 * Configuración fail-closed para una activación futura. No contiene valores empresariales
 * predeterminados: cada clasificación debe ser aprobada y entregada explícitamente.
 */
function cargarPoliticasActivacionDocumental(entorno = process.env) {
    const texto = entorno.DOCUMENTAL_POLITICAS_ACTIVACION_JSON?.trim();
    if (!texto)
        throw new Error('Falta DOCUMENTAL_POLITICAS_ACTIVACION_JSON');
    let crudo;
    try {
        crudo = JSON.parse(texto);
    }
    catch {
        throw new Error('DOCUMENTAL_POLITICAS_ACTIVACION_JSON no contiene JSON válido');
    }
    if (!crudo || typeof crudo !== 'object' || Array.isArray(crudo))
        throw new Error('Las políticas de activación deben ser un objeto');
    const salida = {};
    for (const [clave, valor] of Object.entries(crudo)) {
        if (!valor || typeof valor !== 'object' || Array.isArray(valor))
            throw new Error(`Política inválida para ${clave}`);
        const dato = valor;
        const clasificacion = clave.trim().toUpperCase();
        if (!clasificacion)
            throw new Error('Clasificación documental vacía');
        const minimoBytes = BigInt(enteroPositivo(dato.minimoBytes, `${clasificacion}.minimoBytes`));
        const maximoBytes = BigInt(enteroPositivo(dato.maximoBytes, `${clasificacion}.maximoBytes`));
        if (maximoBytes < minimoBytes)
            throw new Error(`Límites inválidos para ${clasificacion}`);
        if (!Array.isArray(dato.mimesPermitidos) || dato.mimesPermitidos.length === 0 || dato.mimesPermitidos.some(mime => !IntegridadContenido_1.MIME_DOCUMENTALES_SOPORTADOS.includes(mime))) {
            throw new Error(`MIME permitidos inválidos para ${clasificacion}`);
        }
        if (dato.antivirusObligatorio !== true)
            throw new Error(`Antivirus obligatorio no aprobado para ${clasificacion}`);
        salida[clasificacion] = Object.freeze({
            clasificacion, minimoBytes, maximoBytes,
            mimesPermitidos: Object.freeze([...dato.mimesPermitidos]),
            timeoutMs: enteroPositivo(dato.timeoutMs, `${clasificacion}.timeoutMs`),
            concurrenciaMaxima: enteroPositivo(dato.concurrenciaMaxima, `${clasificacion}.concurrenciaMaxima`),
            cantidadMaximaPorOperacion: enteroPositivo(dato.cantidadMaximaPorOperacion, `${clasificacion}.cantidadMaximaPorOperacion`),
            expiracionIntencionSegundos: enteroPositivo(dato.expiracionIntencionSegundos, `${clasificacion}.expiracionIntencionSegundos`),
            expiracionUrlFirmadaSegundos: enteroPositivo(dato.expiracionUrlFirmadaSegundos, `${clasificacion}.expiracionUrlFirmadaSegundos`),
            antivirusObligatorio: true,
        });
    }
    if (!salida.COMERCIAL)
        throw new Error('Falta política de activación COMERCIAL');
    return Object.freeze(salida);
}
//# sourceMappingURL=PoliticasActivacionDocumental.js.map