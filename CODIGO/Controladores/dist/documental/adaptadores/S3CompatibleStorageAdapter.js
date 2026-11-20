"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3CompatibleStorageAdapter = exports.normalizarErrorStorage = exports.ErrorStorage = void 0;
const node_stream_1 = require("node:stream");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const tipos_1 = require("../tipos");
const validaciones_1 = require("../validaciones");
class ErrorStorage extends Error {
    constructor(codigo, proveedor, reintentable, mensaje, estadoHttp) {
        super(mensaje);
        this.codigo = codigo;
        this.proveedor = proveedor;
        this.reintentable = reintentable;
        this.estadoHttp = estadoHttp;
        this.name = 'ErrorStorage';
    }
}
exports.ErrorStorage = ErrorStorage;
const datosError = (error) => {
    const dato = error && typeof error === 'object' ? error : {};
    const metadata = dato.$metadata && typeof dato.$metadata === 'object' ? dato.$metadata : {};
    return { nombre: String(dato.name || dato.code || ''), estado: Number(metadata.httpStatusCode || dato.statusCode || 0) || undefined };
};
const normalizarErrorStorage = (error, proveedor, operacion) => {
    if (error instanceof ErrorStorage)
        return error;
    if (error instanceof tipos_1.ErrorDocumental)
        return new ErrorStorage('INTEGRIDAD', proveedor, false, `${operacion}: entrada técnica inválida`, error.estadoHttp);
    const { nombre, estado } = datosError(error);
    if (nombre === 'AbortError' || nombre === 'TimeoutError' || estado === 408 || estado === 429 || (estado !== undefined && estado >= 500)) {
        return new ErrorStorage('TEMPORAL', proveedor, true, `${operacion}: servicio temporalmente no disponible`, estado);
    }
    if (estado === 401 || estado === 403 || /AccessDenied|InvalidAccessKey|SignatureDoesNotMatch/i.test(nombre)) {
        return new ErrorStorage('NO_AUTORIZADO', proveedor, false, `${operacion}: acceso no autorizado`, estado);
    }
    if (estado === 404 || /NoSuch(Key|Bucket|Upload)|NotFound/i.test(nombre)) {
        return new ErrorStorage('NO_ENCONTRADO', proveedor, false, `${operacion}: recurso no encontrado`, estado);
    }
    if (estado === 409 || /Conflict|OperationAborted/i.test(nombre)) {
        return new ErrorStorage('CONFLICTO_TRANSITORIO', proveedor, true, `${operacion}: conflicto transitorio de almacenamiento`, estado);
    }
    if (estado === 412 || /PreconditionFailed/i.test(nombre)) {
        return new ErrorStorage('CONFLICTO', proveedor, false, `${operacion}: conflicto de almacenamiento`, estado);
    }
    if (estado === 413 || /EntityTooLarge|TooManyParts|LimitExceeded/i.test(nombre)) {
        return new ErrorStorage('LIMITE', proveedor, false, `${operacion}: límite del proveedor excedido`, estado);
    }
    if (/IncompleteBody|BadDigest|InvalidDigest|ChecksumMismatch/i.test(nombre)) {
        return new ErrorStorage('INTEGRIDAD', proveedor, false, `${operacion}: contenido incompleto o inconsistente`, estado);
    }
    if (estado === 501 || /NotImplemented|Unsupported/i.test(nombre)) {
        return new ErrorStorage('NO_SOPORTADO', proveedor, false, `${operacion}: operación no soportada`, estado);
    }
    return new ErrorStorage('DESCONOCIDO', proveedor, false, `${operacion}: fallo de almacenamiento no clasificado`, estado);
};
exports.normalizarErrorStorage = normalizarErrorStorage;
class ContadorIntegridadStream extends node_stream_1.Transform {
    constructor(esperado, proveedor) {
        super();
        this.esperado = esperado;
        this.proveedor = proveedor;
        this.bytes = 0n;
    }
    _transform(fragmento, codificacion, callback) {
        const bytes = typeof fragmento === 'string' ? Buffer.byteLength(fragmento, codificacion) : fragmento.byteLength;
        this.bytes += BigInt(bytes);
        if (this.bytes > this.esperado)
            return callback(new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El stream excede el tamaño esperado'));
        callback(null, fragmento);
    }
}
class S3CompatibleStorageAdapter {
    constructor(configuracion, dependencias = {}) {
        this.configuracion = configuracion;
        this.proveedor = configuracion.proveedor;
        this.cliente = dependencias.cliente ?? new client_s3_1.S3Client({
            region: configuracion.region,
            endpoint: configuracion.endpoint,
            forcePathStyle: configuracion.forcePathStyle,
            credentials: configuracion.credenciales,
            maxAttempts: configuracion.maxIntentos,
        });
        this.firmarComando = dependencias.firmar ?? s3_request_presigner_1.getSignedUrl;
        this.ahora = dependencias.ahora ?? (() => new Date());
        this.capacidades = Object.freeze({
            cargaDirecta: true,
            cargaFirmadaPut: true,
            formularioFirmadoPost: false,
            multipart: true,
            versionadoProveedor: configuracion.proveedor === 'S3' && configuracion.s3VersionadoHabilitado,
            retencionProveedor: configuracion.proveedor === 'S3' && configuracion.s3ObjectLockHabilitado,
            legalHold: configuracion.proveedor === 'S3' && configuracion.s3ObjectLockHabilitado,
            cifradoClaveAdministrada: configuracion.proveedor === 'S3' && configuracion.s3KmsHabilitado,
            // S3 documenta If-None-Match:* para CopyObject. R2 exige una extensión propia aún no
            // incorporada ni validada contra proveedor real, por lo que permanece cerrado.
            copiaCondicionalDestino: configuracion.proveedor === 'S3',
            // R2 y S3 documentan If-None-Match:* para PutObject. La validación contra proveedor real
            // permanece como condición de activación; esta capacidad describe el contrato implementado.
            escrituraCondicionalDestino: true,
            lecturaCondicionalOrigen: true,
            // No se expone hasta validar la condición de CompleteMultipartUpload en ambos proveedores.
            multipartCondicionalDestino: false,
        });
    }
    validar(operacion, accion) {
        try {
            return accion();
        }
        catch (error) {
            throw (0, exports.normalizarErrorStorage)(error, this.proveedor, operacion);
        }
    }
    referencia(referencia) {
        return this.validar('validar referencia', () => {
            if (referencia.contenedor !== this.configuracion.bucket)
                throw new tipos_1.ErrorDocumental('CONTENEDOR_NO_AUTORIZADO', 'El contenedor no está autorizado', 403);
            const clave = referencia.clave.startsWith('tmp/') ? (0, validaciones_1.validarClaveTemporal)(referencia.clave) : (0, validaciones_1.validarClaveObjeto)(referencia.clave);
            return { Bucket: this.configuracion.bucket, Key: clave, VersionId: referencia.versionProveedor };
        });
    }
    expiracion(expiraEn) {
        return this.validar('validar expiración', () => {
            if (!(expiraEn instanceof Date) || !Number.isFinite(expiraEn.getTime()))
                throw new tipos_1.ErrorDocumental('EXPIRACION_INVALIDA', 'Expiración inválida');
            const segundos = Math.ceil((expiraEn.getTime() - this.ahora().getTime()) / 1000);
            if (segundos < 1 || segundos > this.configuracion.expiracionFirmaSegundos)
                throw new tipos_1.ErrorDocumental('EXPIRACION_INVALIDA', 'Expiración fuera del máximo configurado');
            return segundos;
        });
    }
    tamanoNumerico(tamano) {
        if (tamano > BigInt(Number.MAX_SAFE_INTEGER))
            throw new ErrorStorage('LIMITE', this.proveedor, false, 'El tamaño excede la precisión segura del runtime');
        return Number(tamano);
    }
    async enviar(comando, operacion) {
        const controlador = new AbortController();
        const temporizador = setTimeout(() => controlador.abort(), this.configuracion.timeoutMs);
        temporizador.unref?.();
        try {
            return await this.cliente.send(comando, { abortSignal: controlador.signal });
        }
        catch (error) {
            throw (0, exports.normalizarErrorStorage)(error, this.proveedor, operacion);
        }
        finally {
            clearTimeout(temporizador);
        }
    }
    integridad(resultado, tamanoAlternativo) {
        const tamano = resultado.ContentLength === undefined ? tamanoAlternativo : BigInt(resultado.ContentLength);
        if (tamano === undefined)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El proveedor no informó el tamaño del objeto');
        return {
            tamanoBytes: tamano,
            etag: resultado.ETag,
            mime: resultado.ContentType,
            versionProveedor: resultado.VersionId,
            metadatosProveedor: resultado.Metadata,
        };
    }
    protegerLectura(stream) {
        const salida = new node_stream_1.Transform({ transform(fragmento, _codificacion, callback) { callback(null, fragmento); } });
        const temporizador = setTimeout(() => salida.destroy(new ErrorStorage('TEMPORAL', this.proveedor, true, 'La lectura excedió el tiempo máximo')), this.configuracion.timeoutMs);
        temporizador.unref?.();
        const finalizar = () => clearTimeout(temporizador);
        stream.once('error', error => salida.destroy((0, exports.normalizarErrorStorage)(error, this.proveedor, 'leer objeto')));
        salida.once('close', finalizar);
        salida.once('end', finalizar);
        salida.once('error', finalizar);
        stream.pipe(salida);
        return salida;
    }
    async iniciarCarga(entrada) {
        const ref = this.referencia(entrada.referencia);
        const mime = this.validar('iniciar carga', () => (0, validaciones_1.validarMime)(entrada.mime));
        this.validar('iniciar carga', () => (0, validaciones_1.validarTamano)(entrada.tamanoEsperado));
        this.validar('iniciar carga', () => (0, validaciones_1.textoRequerido)(entrada.claveIdempotencia, 'Clave de idempotencia', 160));
        if (!entrada.multipart)
            return { referencia: entrada.referencia, idempotente: true };
        const resultado = await this.enviar(new client_s3_1.CreateMultipartUploadCommand({ ...ref, ContentType: mime }), 'iniciar multipart');
        if (!resultado.UploadId)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El proveedor no informó el identificador multipart');
        return { referencia: entrada.referencia, identificadorMultipart: resultado.UploadId, idempotente: false };
    }
    async subirStream(entrada) {
        const ref = this.referencia(entrada.referencia);
        const mime = this.validar('subir stream', () => (0, validaciones_1.validarMime)(entrada.mime));
        const tamano = this.validar('subir stream', () => (0, validaciones_1.validarTamano)(entrada.tamanoEsperado));
        if (entrada.sha256)
            this.validar('subir stream', () => (0, validaciones_1.validarSha256)(entrada.sha256));
        const contador = new ContadorIntegridadStream(tamano, this.proveedor);
        entrada.contenido.once('error', error => contador.destroy(error));
        entrada.contenido.pipe(contador);
        const resultado = await this.enviar(new client_s3_1.PutObjectCommand({ ...ref, Body: contador, ContentLength: this.tamanoNumerico(tamano), ContentType: mime }), 'subir stream');
        if (contador.bytes !== tamano)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El stream no coincide con el tamaño esperado');
        return this.integridad(resultado, tamano);
    }
    async crearObjetoExclusivo(entrada) {
        const ref = this.referencia(entrada.referencia);
        const mime = this.validar('crear objeto exclusivo', () => (0, validaciones_1.validarMime)(entrada.mime));
        const tamano = this.validar('crear objeto exclusivo', () => (0, validaciones_1.validarTamano)(entrada.tamanoEsperado));
        const claveIdempotencia = this.validar('crear objeto exclusivo', () => (0, validaciones_1.textoRequerido)(entrada.claveIdempotencia, 'Clave de idempotencia', 160));
        if (entrada.sha256)
            this.validar('crear objeto exclusivo', () => (0, validaciones_1.validarSha256)(entrada.sha256));
        if (tamano > 5000000000n)
            throw new ErrorStorage('LIMITE', this.proveedor, false, 'La creación condicional portable admite como máximo 5 GB');
        const contador = new ContadorIntegridadStream(tamano, this.proveedor);
        entrada.contenido.once('error', error => contador.destroy(error));
        entrada.contenido.pipe(contador);
        try {
            await this.enviar(new client_s3_1.PutObjectCommand({
                ...ref, Body: contador, ContentLength: this.tamanoNumerico(tamano), ContentType: mime,
                IfNoneMatch: '*', Metadata: { 'idempotencia-documental': claveIdempotencia },
            }), 'crear objeto exclusivo');
        }
        catch (error) {
            if (error instanceof ErrorStorage && error.codigo === 'CONFLICTO' && error.estadoHttp === 412) {
                throw new ErrorStorage('OBJETO_EXISTENTE', this.proveedor, false, 'crear objeto exclusivo: el destino ya existe', 412);
            }
            throw error;
        }
        if (contador.bytes !== tamano)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El stream no coincide con el tamaño esperado');
        const resultado = await this.consultarObjeto(entrada.referencia);
        if (resultado.tamanoBytes !== tamano)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El objeto creado no conserva el tamaño esperado');
        return resultado;
    }
    async firmarCarga(entrada) {
        const ref = this.referencia(entrada.referencia);
        const mime = this.validar('firmar carga', () => (0, validaciones_1.validarMime)(entrada.mime));
        const tamano = this.validar('firmar carga', () => (0, validaciones_1.validarTamano)(entrada.tamanoEsperado));
        const expiresIn = this.expiracion(entrada.expiraEn);
        try {
            const url = await this.firmarComando(this.cliente, new client_s3_1.PutObjectCommand({ ...ref, ContentLength: this.tamanoNumerico(tamano), ContentType: mime }), { expiresIn });
            return { url, expiraEn: entrada.expiraEn, headersObligatorios: { 'content-type': mime, 'content-length': String(tamano) } };
        }
        catch (error) {
            throw (0, exports.normalizarErrorStorage)(error, this.proveedor, 'firmar carga');
        }
    }
    async consultarObjeto(referencia) {
        const resultado = await this.enviar(new client_s3_1.HeadObjectCommand(this.referencia(referencia)), 'consultar objeto');
        return this.integridad(resultado);
    }
    async abrirLectura(referencia) {
        const resultado = await this.enviar(new client_s3_1.GetObjectCommand(this.referencia(referencia)), 'abrir lectura');
        if (resultado.Body instanceof node_stream_1.Readable)
            return this.protegerLectura(resultado.Body);
        const cuerpo = resultado.Body;
        if (cuerpo?.transformToWebStream)
            return this.protegerLectura(node_stream_1.Readable.fromWeb(cuerpo.transformToWebStream()));
        if (cuerpo?.[Symbol.asyncIterator])
            return this.protegerLectura(node_stream_1.Readable.from(cuerpo));
        throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El proveedor no entregó un stream legible');
    }
    async abrirLecturaCondicionada(entrada) {
        const etag = this.validar('abrir lectura condicionada', () => (0, validaciones_1.textoRequerido)(entrada.etag, 'ETag', 512));
        const resultado = await this.enviar(new client_s3_1.GetObjectCommand({ ...this.referencia(entrada.referencia), IfMatch: etag }), 'abrir lectura condicionada');
        if (resultado.Body instanceof node_stream_1.Readable)
            return this.protegerLectura(resultado.Body);
        const cuerpo = resultado.Body;
        if (cuerpo?.transformToWebStream)
            return this.protegerLectura(node_stream_1.Readable.fromWeb(cuerpo.transformToWebStream()));
        if (cuerpo?.[Symbol.asyncIterator])
            return this.protegerLectura(node_stream_1.Readable.from(cuerpo));
        throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El proveedor no entregó un stream legible');
    }
    async firmarDescarga(entrada) {
        const ref = this.referencia(entrada.referencia);
        const nombre = this.validar('firmar descarga', () => (0, validaciones_1.validarNombreArchivo)(entrada.nombreDescarga, 'Nombre de descarga'));
        const expiresIn = this.expiracion(entrada.expiraEn);
        const disposicion = `attachment; filename*=UTF-8''${encodeURIComponent(nombre)}`;
        try {
            const url = await this.firmarComando(this.cliente, new client_s3_1.GetObjectCommand({ ...ref, ResponseContentDisposition: disposicion, ResponseContentType: entrada.mimeRespuesta, ResponseCacheControl: entrada.cacheControlRespuesta }), { expiresIn });
            return { url, expiraEn: entrada.expiraEn, parametrosRespuestaFirmados: { 'content-disposition': disposicion, ...(entrada.mimeRespuesta ? { 'content-type': entrada.mimeRespuesta } : {}), ...(entrada.cacheControlRespuesta ? { 'cache-control': entrada.cacheControlRespuesta } : {}) } };
        }
        catch (error) {
            throw (0, exports.normalizarErrorStorage)(error, this.proveedor, 'firmar descarga');
        }
    }
    async copiarObjeto(entrada) {
        const origen = this.referencia(entrada.origen);
        const destino = this.referencia(entrada.destino);
        this.validar('copiar objeto', () => (0, validaciones_1.textoRequerido)(entrada.claveIdempotencia, 'Clave de idempotencia', 160));
        if (entrada.exigirDestinoAusente && !this.capacidades.copiaCondicionalDestino) {
            throw new ErrorStorage('NO_SOPORTADO', this.proveedor, false, 'El proveedor no tiene una copia condicional de destino validada');
        }
        const version = origen.VersionId ? `?versionId=${encodeURIComponent(origen.VersionId)}` : '';
        const copySource = `${encodeURIComponent(origen.Bucket)}/${origen.Key.split('/').map(encodeURIComponent).join('/')}${version}`;
        await this.enviar(new client_s3_1.CopyObjectCommand({ Bucket: destino.Bucket, Key: destino.Key, CopySource: copySource, CopySourceIfMatch: entrada.etagOrigen, IfNoneMatch: entrada.exigirDestinoAusente ? '*' : undefined }), 'copiar objeto');
        return this.consultarObjeto(entrada.destino);
    }
    async subirParteStream(entrada) {
        const ref = this.referencia(entrada.referencia);
        const uploadId = this.validar('subir parte', () => (0, validaciones_1.textoRequerido)(entrada.identificadorMultipart, 'Identificador multipart', 500));
        const tamano = this.validar('subir parte', () => (0, validaciones_1.validarTamano)(entrada.tamanoEsperado));
        if (!Number.isInteger(entrada.numero) || entrada.numero < 1 || entrada.numero > 10000)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'Número de parte multipart inválido');
        const contador = new ContadorIntegridadStream(tamano, this.proveedor);
        entrada.contenido.once('error', error => contador.destroy(error));
        entrada.contenido.pipe(contador);
        const resultado = await this.enviar(new client_s3_1.UploadPartCommand({ ...ref, UploadId: uploadId, PartNumber: entrada.numero, Body: contador, ContentLength: this.tamanoNumerico(tamano) }), 'subir parte');
        if (contador.bytes !== tamano || !resultado.ETag)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'La parte multipart quedó incompleta');
        return { numero: entrada.numero, etag: resultado.ETag, checksum: resultado.ChecksumSHA256 };
    }
    async firmarParteMultipart(entrada) {
        const ref = this.referencia(entrada.referencia);
        const uploadId = this.validar('firmar parte', () => (0, validaciones_1.textoRequerido)(entrada.identificadorMultipart, 'Identificador multipart', 500));
        const tamano = this.validar('firmar parte', () => (0, validaciones_1.validarTamano)(entrada.tamanoEsperado));
        if (!Number.isInteger(entrada.numero) || entrada.numero < 1 || entrada.numero > 10000)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'Número de parte multipart inválido');
        const expiresIn = this.expiracion(entrada.expiraEn);
        try {
            const url = await this.firmarComando(this.cliente, new client_s3_1.UploadPartCommand({ ...ref, UploadId: uploadId, PartNumber: entrada.numero, ContentLength: this.tamanoNumerico(tamano) }), { expiresIn });
            return { numero: entrada.numero, url, expiraEn: entrada.expiraEn, headersObligatorios: { 'content-length': String(tamano) } };
        }
        catch (error) {
            throw (0, exports.normalizarErrorStorage)(error, this.proveedor, 'firmar parte');
        }
    }
    async confirmarMultipart(entrada) {
        const ref = this.referencia(entrada.referencia);
        const uploadId = this.validar('confirmar multipart', () => (0, validaciones_1.textoRequerido)(entrada.identificadorMultipart, 'Identificador multipart', 500));
        if (entrada.sha256Esperado)
            this.validar('confirmar multipart', () => (0, validaciones_1.validarSha256)(entrada.sha256Esperado));
        if (!entrada.partes.length)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'Multipart requiere al menos una parte');
        const numeros = new Set();
        const partes = entrada.partes.map(parte => {
            if (!Number.isInteger(parte.numero) || parte.numero < 1 || parte.numero > 10000 || numeros.has(parte.numero) || !parte.etag.trim()) {
                throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'Listado de partes multipart inválido');
            }
            numeros.add(parte.numero);
            return { PartNumber: parte.numero, ETag: parte.etag, ChecksumSHA256: parte.checksum };
        }).sort((a, b) => a.PartNumber - b.PartNumber);
        await this.enviar(new client_s3_1.CompleteMultipartUploadCommand({ ...ref, UploadId: uploadId, MultipartUpload: { Parts: partes } }), 'confirmar multipart');
        return this.consultarObjeto(entrada.referencia);
    }
    async abortarMultipart(entrada) {
        const ref = this.referencia(entrada.referencia);
        const uploadId = this.validar('abortar multipart', () => (0, validaciones_1.textoRequerido)(entrada.identificadorMultipart, 'Identificador multipart', 500));
        await this.enviar(new client_s3_1.AbortMultipartUploadCommand({ ...ref, UploadId: uploadId }), 'abortar multipart');
    }
    async listarCargasIncompletas(entrada) {
        if (entrada.contenedor !== this.configuracion.bucket)
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El contenedor no está autorizado');
        const prefijo = entrada.prefijo ?? 'tmp/';
        if (!['tmp/', 'objects/', 'quarantine/'].includes(prefijo))
            throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'Prefijo multipart no autorizado');
        const cargas = [];
        let keyMarker;
        let uploadIdMarker;
        for (let pagina = 0; pagina < 100; pagina += 1) {
            const respuesta = await this.enviar(new client_s3_1.ListMultipartUploadsCommand({ Bucket: this.configuracion.bucket, Prefix: prefijo, KeyMarker: keyMarker, UploadIdMarker: uploadIdMarker }), 'listar multipart');
            for (const carga of respuesta.Uploads ?? []) {
                if (!carga.Key || !carga.UploadId)
                    continue;
                try {
                    const clave = carga.Key.startsWith('tmp/') ? (0, validaciones_1.validarClaveTemporal)(carga.Key) : (0, validaciones_1.validarClaveObjeto)(carga.Key);
                    cargas.push({ referencia: { contenedor: this.configuracion.bucket, clave }, identificadorMultipart: carga.UploadId, iniciadaEn: carga.Initiated });
                }
                catch { /* El proveedor puede contener objetos ajenos al prefijo documental estricto. */ }
            }
            if (!respuesta.IsTruncated)
                break;
            keyMarker = respuesta.NextKeyMarker;
            uploadIdMarker = respuesta.NextUploadIdMarker;
            if (!keyMarker && !uploadIdMarker)
                throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'Paginación multipart inválida');
        }
        return cargas;
    }
}
exports.S3CompatibleStorageAdapter = S3CompatibleStorageAdapter;
//# sourceMappingURL=S3CompatibleStorageAdapter.js.map