"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalPrivateStorageAdapter = exports.cargarConfiguracionStorageLocalPrivado = exports.modoServidorPersonalHabilitado = void 0;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const validaciones_1 = require("../validaciones");
const S3CompatibleStorageAdapter_1 = require("./S3CompatibleStorageAdapter");
const bandera = (valor) => /^(1|true|si)$/i.test(valor?.trim() || '');
const modoServidorPersonalHabilitado = (entorno = process.env) => bandera(entorno.DOCUMENTAL_PERSONAL_MODE);
exports.modoServidorPersonalHabilitado = modoServidorPersonalHabilitado;
const cargarConfiguracionStorageLocalPrivado = (entorno = process.env) => {
    const directorioRaiz = entorno.DOCUMENTAL_LOCAL_STORAGE_DIR?.trim() || '/app/data/documentos';
    if (!(0, node_path_1.isAbsolute)(directorioRaiz))
        throw new Error('DOCUMENTAL_LOCAL_STORAGE_DIR debe ser una ruta absoluta');
    if ((0, node_path_1.resolve)(directorioRaiz) === (0, node_path_1.resolve)('/'))
        throw new Error('DOCUMENTAL_LOCAL_STORAGE_DIR no puede apuntar a la raíz del sistema');
    const contenedor = (0, validaciones_1.validarContenedor)(entorno.DOCUMENTAL_LOCAL_CONTAINER?.trim() || 'documentos-locales');
    return { directorioRaiz: (0, node_path_1.resolve)(directorioRaiz), contenedor };
};
exports.cargarConfiguracionStorageLocalPrivado = cargarConfiguracionStorageLocalPrivado;
/**
 * Almacenamiento privado para una instalación personal de un solo servidor.
 * No publica rutas HTTP: todos los accesos pasan por el backend y conservan SHA-256.
 */
class LocalPrivateStorageAdapter {
    constructor(configuracion) {
        this.configuracion = configuracion;
        this.proveedor = 'LOCAL_PRIVADO';
        this.capacidades = Object.freeze({
            cargaDirecta: true,
            cargaFirmadaPut: false,
            formularioFirmadoPost: false,
            multipart: false,
            versionadoProveedor: false,
            retencionProveedor: false,
            legalHold: false,
            cifradoClaveAdministrada: false,
            copiaCondicionalDestino: false,
            escrituraCondicionalDestino: true,
            lecturaCondicionalOrigen: false,
            multipartCondicionalDestino: false,
        });
    }
    ruta(referencia) {
        const contenedor = (0, validaciones_1.validarContenedor)(referencia.contenedor);
        if (contenedor !== this.configuracion.contenedor) {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('NO_AUTORIZADO', this.proveedor, false, 'El contenedor local no está autorizado');
        }
        const clave = (0, validaciones_1.validarClaveObjeto)(referencia.clave);
        const ruta = (0, node_path_1.resolve)((0, node_path_1.join)(this.configuracion.directorioRaiz, contenedor, ...clave.split('/')));
        const base = (0, node_path_1.resolve)((0, node_path_1.join)(this.configuracion.directorioRaiz, contenedor));
        if (!ruta.startsWith(`${base}\\`) && !ruta.startsWith(`${base}/`)) {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('NO_AUTORIZADO', this.proveedor, false, 'La ruta local quedó fuera del contenedor privado');
        }
        return ruta;
    }
    async iniciarCarga(entrada) {
        this.ruta(entrada.referencia);
        (0, validaciones_1.validarMime)(entrada.mime);
        (0, validaciones_1.validarTamano)(entrada.tamanoEsperado);
        return { referencia: entrada.referencia, idempotente: true };
    }
    async crearObjetoExclusivo(entrada) {
        const ruta = this.ruta(entrada.referencia);
        const mime = (0, validaciones_1.validarMime)(entrada.mime);
        const esperado = (0, validaciones_1.validarTamano)(entrada.tamanoEsperado);
        const shaEsperado = (0, validaciones_1.validarSha256)(entrada.sha256, true);
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(ruta), { recursive: true, mode: 0o700 });
        let manejador;
        try {
            manejador = await (0, promises_1.open)(ruta, 'wx', 0o600);
        }
        catch (error) {
            if (error.code === 'EEXIST') {
                throw new S3CompatibleStorageAdapter_1.ErrorStorage('OBJETO_EXISTENTE', this.proveedor, false, 'El objeto local ya existe');
            }
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('DESCONOCIDO', this.proveedor, false, 'No fue posible crear el objeto local');
        }
        const hash = (0, node_crypto_1.createHash)('sha256');
        let total = 0n;
        try {
            for await (const fragmento of entrada.contenido) {
                const bloque = Buffer.isBuffer(fragmento) ? fragmento : Buffer.from(fragmento);
                total += BigInt(bloque.length);
                if (total > esperado)
                    throw new S3CompatibleStorageAdapter_1.ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El contenido excede el tamaño esperado');
                hash.update(bloque);
                let desplazamiento = 0;
                while (desplazamiento < bloque.length) {
                    const { bytesWritten } = await manejador.write(bloque, desplazamiento);
                    if (bytesWritten < 1)
                        throw new S3CompatibleStorageAdapter_1.ErrorStorage('INTEGRIDAD', this.proveedor, false, 'La escritura local quedó incompleta');
                    desplazamiento += bytesWritten;
                }
            }
            const sha256 = hash.digest('hex');
            if (total !== esperado || sha256 !== shaEsperado) {
                throw new S3CompatibleStorageAdapter_1.ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El contenido local no coincide con su tamaño o SHA-256');
            }
            await manejador.sync();
            await manejador.chmod(0o600);
            return { tamanoBytes: total, sha256Verificado: sha256, mime };
        }
        catch (error) {
            await manejador.close().catch(() => undefined);
            await (0, promises_1.unlink)(ruta).catch(() => undefined);
            throw error;
        }
        finally {
            await manejador.close().catch(() => undefined);
        }
    }
    async consultarObjeto(referencia) {
        const ruta = this.ruta(referencia);
        try {
            const datos = await (0, promises_1.lstat)(ruta);
            if (!datos.isFile() || datos.isSymbolicLink())
                throw new Error('NO_ES_ARCHIVO_REGULAR');
            const hash = (0, node_crypto_1.createHash)('sha256');
            for await (const fragmento of (0, node_fs_1.createReadStream)(ruta))
                hash.update(fragmento);
            return { tamanoBytes: BigInt(datos.size), sha256Verificado: hash.digest('hex'), mime: 'application/pdf' };
        }
        catch (error) {
            if (error.code === 'ENOENT')
                throw new S3CompatibleStorageAdapter_1.ErrorStorage('NO_ENCONTRADO', this.proveedor, false, 'Objeto local no encontrado', 404);
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El objeto local no es un archivo regular válido');
        }
    }
    async abrirLectura(referencia) {
        const ruta = this.ruta(referencia);
        try {
            const datos = await (0, promises_1.lstat)(ruta);
            if (!datos.isFile() || datos.isSymbolicLink())
                throw new Error('NO_ES_ARCHIVO_REGULAR');
            return (0, node_fs_1.createReadStream)(ruta);
        }
        catch (error) {
            if (error.code === 'ENOENT')
                throw new S3CompatibleStorageAdapter_1.ErrorStorage('NO_ENCONTRADO', this.proveedor, false, 'Objeto local no encontrado', 404);
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El objeto local no es un archivo regular válido');
        }
    }
    async eliminarVersionPermitida(referencia) {
        const ruta = this.ruta(referencia);
        await (0, promises_1.unlink)(ruta).catch(error => {
            if (error.code !== 'ENOENT')
                throw error;
        });
    }
}
exports.LocalPrivateStorageAdapter = LocalPrivateStorageAdapter;
//# sourceMappingURL=LocalPrivateStorageAdapter.js.map