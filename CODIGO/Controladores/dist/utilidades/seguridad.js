"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.futuro = exports.huella = exports.secreto = exports.politica = void 0;
exports.hashClave = hashClave;
exports.comprobarClave = comprobarClave;
exports.validarClave = validarClave;
const node_crypto_1 = require("node:crypto");
const ErrorAplicacion_1 = require("./ErrorAplicacion");
// Parámetros técnicos provisionales; no son reglas funcionales cerradas ni un mantenedor M4.
// acá mejor ser aburridos: la seguridad no necesita adornos
const parametro = (nombre, defecto) => {
    const valor = Number(process.env[nombre] ?? defecto);
    if (!Number.isInteger(valor) || valor <= 0)
        throw new Error(`Parámetro de seguridad inválido: ${nombre}`);
    return valor;
};
exports.politica = {
    longitud: parametro('M4_LONGITUD_MINIMA', 12), historial: parametro('M4_HISTORIAL', 5),
    vigenciaDias: parametro('M4_VIGENCIA_DIAS', 90), temporalMinutos: parametro('M4_TEMPORAL_MINUTOS', 60),
    sesionMinutos: parametro('M4_SESION_MINUTOS', 60), inactividadMinutos: parametro('M4_INACTIVIDAD_MINUTOS', 10), recuperacionMinutos: parametro('M4_RECUPERACION_MINUTOS', 20),
    intentos: parametro('M4_INTENTOS', 3), bloqueoMinutos: parametro('M4_BLOQUEO_MINUTOS', 10), bloqueos: parametro('M4_BLOQUEOS', 3),
};
const secreto = () => (0, node_crypto_1.randomBytes)(32).toString('base64url');
exports.secreto = secreto;
const huella = (valor) => (0, node_crypto_1.createHash)('sha256').update(valor).digest('hex');
exports.huella = huella;
const futuro = (minutos) => new Date(Date.now() + minutos * 60000);
exports.futuro = futuro;
const derivar = (clave, sal) => new Promise((resolver, rechazar) => {
    (0, node_crypto_1.scrypt)(clave, sal, 64, { N: 131072, r: 8, p: 1, maxmem: 256 * 1024 * 1024 }, (error, resultado) => error ? rechazar(error) : resolver(resultado));
});
async function hashClave(clave) {
    const sal = (0, node_crypto_1.randomBytes)(16).toString('hex');
    return `scrypt$131072$8$1$${sal}$${(await derivar(clave, sal)).toString('hex')}`;
}
async function comprobarClave(clave, hash) {
    if (typeof clave !== 'string' || clave.length > 256)
        return false;
    const partes = hash.split('$');
    if (partes.length !== 6 || partes.slice(0, 4).join('$') !== 'scrypt$131072$8$1')
        return false;
    const esperado = Buffer.from(partes[5], 'hex');
    const obtenido = await derivar(clave, partes[4]);
    return esperado.length === obtenido.length && (0, node_crypto_1.timingSafeEqual)(esperado, obtenido);
}
function validarClave(clave) {
    if (typeof clave !== 'string' || clave.length < exports.politica.longitud || clave.length > 256 || !clave.trim())
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `La contraseña debe tener entre ${exports.politica.longitud} y 256 caracteres`);
}
//# sourceMappingURL=seguridad.js.map