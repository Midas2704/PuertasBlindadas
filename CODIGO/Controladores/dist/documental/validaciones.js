"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nuevaClaveObjeto = exports.nuevaClaveTemporal = exports.validarContenedor = exports.validarClaveObjeto = exports.validarClaveTemporal = exports.validarSha256 = exports.validarTamano = exports.validarMime = exports.validarNombreArchivo = exports.textoRequerido = void 0;
const node_crypto_1 = require("node:crypto");
const tipos_1 = require("./tipos");
const PATRON_UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
const CLAVE_TEMPORAL = new RegExp(`^tmp/${PATRON_UUID}$`);
const CLAVE_OBJETO = new RegExp(`^(objects|quarantine)/${PATRON_UUID}$`);
const MIME = /^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/i;
const SHA256 = /^[0-9a-f]{64}$/;
const CONTENEDOR = /^[a-z0-9][a-z0-9._-]{2,62}$/;
const CONTROL_O_RUTA = /[\u0000-\u001f\u007f/\\]/;
const textoRequerido = (valor, campo, maximo) => {
    const texto = String(valor ?? '').trim();
    if (!texto || texto.length > maximo)
        throw new tipos_1.ErrorDocumental('METADATO_INVALIDO', `${campo} es obligatorio y admite hasta ${maximo} caracteres`);
    return texto;
};
exports.textoRequerido = textoRequerido;
const validarNombreArchivo = (valor, campo = 'Nombre de archivo') => {
    const nombre = (0, exports.textoRequerido)(valor, campo, 255);
    if (CONTROL_O_RUTA.test(nombre) || nombre === '.' || nombre === '..')
        throw new tipos_1.ErrorDocumental('NOMBRE_ARCHIVO_INVALIDO', `${campo} no puede contener rutas ni caracteres de control`);
    return nombre;
};
exports.validarNombreArchivo = validarNombreArchivo;
const validarMime = (valor) => {
    const mime = (0, exports.textoRequerido)(valor, 'MIME', 150).toLowerCase();
    if (!MIME.test(mime))
        throw new tipos_1.ErrorDocumental('MIME_INVALIDO', 'El tipo MIME declarado no es válido');
    return mime;
};
exports.validarMime = validarMime;
const validarTamano = (valor) => {
    const tamano = typeof valor === 'bigint' ? valor : BigInt(valor);
    if (tamano <= 0n)
        throw new tipos_1.ErrorDocumental('TAMANO_INVALIDO', 'El tamaño debe ser mayor que cero');
    return tamano;
};
exports.validarTamano = validarTamano;
const validarSha256 = (valor, obligatorio = false) => {
    if (!valor && !obligatorio)
        return null;
    const hash = String(valor || '').toLowerCase();
    if (!SHA256.test(hash))
        throw new tipos_1.ErrorDocumental('HASH_INVALIDO', 'SHA-256 debe contener exactamente 64 caracteres hexadecimales');
    return hash;
};
exports.validarSha256 = validarSha256;
const validarClaveTemporal = (valor) => {
    const clave = (0, exports.textoRequerido)(valor, 'Clave temporal', 700).toLowerCase();
    if (!CLAVE_TEMPORAL.test(clave))
        throw new tipos_1.ErrorDocumental('CLAVE_NO_OPACA', 'La clave temporal debe usar exclusivamente tmp/<uuid>');
    return clave;
};
exports.validarClaveTemporal = validarClaveTemporal;
const validarClaveObjeto = (valor) => {
    const clave = (0, exports.textoRequerido)(valor, 'Clave de objeto', 700).toLowerCase();
    if (!CLAVE_OBJETO.test(clave))
        throw new tipos_1.ErrorDocumental('CLAVE_NO_OPACA', 'La clave de objeto debe usar exclusivamente objects/<uuid> o quarantine/<uuid>');
    return clave;
};
exports.validarClaveObjeto = validarClaveObjeto;
const validarContenedor = (valor) => {
    const contenedor = (0, exports.textoRequerido)(valor, 'Contenedor lógico', 80).toLowerCase();
    if (!CONTENEDOR.test(contenedor))
        throw new tipos_1.ErrorDocumental('CONTENEDOR_INVALIDO', 'El contenedor lógico no cumple el formato portable');
    return contenedor;
};
exports.validarContenedor = validarContenedor;
const nuevaClaveTemporal = () => `tmp/${(0, node_crypto_1.randomUUID)()}`;
exports.nuevaClaveTemporal = nuevaClaveTemporal;
const nuevaClaveObjeto = (cuarentena = false) => `${cuarentena ? 'quarantine' : 'objects'}/${(0, node_crypto_1.randomUUID)()}`;
exports.nuevaClaveObjeto = nuevaClaveObjeto;
//# sourceMappingURL=validaciones.js.map