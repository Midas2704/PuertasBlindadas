"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresDocumentosComercialesStorage = void 0;
/**
 * Almacenamiento transitorio académico, respaldado exclusivamente por PostgreSQL.
 * Se usa SOLO desde ServicioDocumentosComerciales al habilitar DOCUMENTAL_POSTGRES_PDF_MODE.
 * No requiere S3, R2, volumen de archivos ni antivirus externo.
 * Conserva lectura y validación SHA-256 de PDFs inmutables.
 */
const node_crypto_1 = require("node:crypto");
const node_stream_1 = require("node:stream");
const validaciones_1 = require("../validaciones");
const S3CompatibleStorageAdapter_1 = require("./S3CompatibleStorageAdapter");
const MAX_PDF_BYTES = 20 * 1024 * 1024;
const CONTENEDOR = 'documentos-postgres';
class PostgresDocumentosComercialesStorage {
    constructor(db) {
        this.db = db;
        this.proveedor = 'POSTGRES';
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
    validar(referencia) {
        const contenedor = (0, validaciones_1.validarContenedor)(referencia.contenedor);
        if (contenedor !== CONTENEDOR) {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('NO_AUTORIZADO', this.proveedor, false, 'Contenedor PostgreSQL no autorizado');
        }
        return { contenedor, clave: (0, validaciones_1.validarClaveObjeto)(referencia.clave) };
    }
    async iniciarCarga(entrada) {
        this.validar(entrada.referencia);
        if ((0, validaciones_1.validarMime)(entrada.mime) !== 'application/pdf') {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('NO_SOPORTADO', this.proveedor, false, 'Este adaptador admite solo PDF');
        }
        if ((0, validaciones_1.validarTamano)(entrada.tamanoEsperado) > BigInt(MAX_PDF_BYTES)) {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('LIMITE', this.proveedor, false, 'PDF supera 20 MiB');
        }
        return { referencia: entrada.referencia, idempotente: true };
    }
    async crearObjetoExclusivo(entrada) {
        const ref = this.validar(entrada.referencia);
        const mime = (0, validaciones_1.validarMime)(entrada.mime);
        if (mime !== 'application/pdf')
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('NO_SOPORTADO', this.proveedor, false, 'Solo PDF');
        const esperado = (0, validaciones_1.validarTamano)(entrada.tamanoEsperado);
        const hashEsperado = (0, validaciones_1.validarSha256)(entrada.sha256, true);
        if (esperado > BigInt(MAX_PDF_BYTES))
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('LIMITE', this.proveedor, false, 'PDF supera 20 MiB');
        const trozos = [];
        const sha = (0, node_crypto_1.createHash)('sha256');
        let total = 0;
        for await (const fragmento of entrada.contenido) {
            const bloque = Buffer.isBuffer(fragmento) ? fragmento : Buffer.from(fragmento);
            total += bloque.length;
            if (total > MAX_PDF_BYTES || BigInt(total) > esperado) {
                throw new S3CompatibleStorageAdapter_1.ErrorStorage('LIMITE', this.proveedor, false, 'PDF excede tamaño declarado');
            }
            sha.update(bloque);
            trozos.push(bloque);
        }
        const contenido = Buffer.concat(trozos);
        const obtenido = sha.digest('hex');
        if (BigInt(total) !== esperado || obtenido !== hashEsperado || contenido.subarray(0, 5).toString('ascii') !== '%PDF-') {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('INTEGRIDAD', this.proveedor, false, 'PDF no superó validación de tamaño, hash o cabecera');
        }
        // Se inserta con clave opaca e inmutable. El esquema SQL valida el tamaño por octet_length().
        // Usar Uint8Array permite a Prisma/adapter-pg tipar el parámetro como bytea.
        const afectados = await this.db.$executeRaw `
      INSERT INTO finanzas.documento_pdf_postgres
        (contenedor, clave, mime, tamano_bytes, sha256, contenido)
      VALUES (${ref.contenedor}, ${ref.clave}, ${mime}, ${esperado}, ${obtenido}, ${new Uint8Array(contenido)})
      ON CONFLICT (contenedor, clave) DO NOTHING
    `;
        if (afectados !== 1) {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('OBJETO_EXISTENTE', this.proveedor, false, 'PDF con clave opaca ya existente');
        }
        return { tamanoBytes: esperado, sha256Verificado: obtenido, mime };
    }
    async fila(ref) {
        const referencia = this.validar(ref);
        const filas = await this.db.$queryRaw `
      SELECT contenido, tamano_bytes, sha256, mime
      FROM finanzas.documento_pdf_postgres
      WHERE contenedor = ${referencia.contenedor} AND clave = ${referencia.clave}
    `;
        if (filas.length !== 1) {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('NO_ENCONTRADO', this.proveedor, false, 'PDF no encontrado en PostgreSQL', 404);
        }
        return filas[0];
    }
    async consultarObjeto(ref) {
        const fila = await this.fila(ref);
        const contenido = Buffer.from(fila.contenido);
        const digest = (0, node_crypto_1.createHash)('sha256').update(contenido).digest('hex');
        if (BigInt(contenido.length) !== fila.tamano_bytes || digest !== fila.sha256) {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('INTEGRIDAD', this.proveedor, false, 'PDF PostgreSQL tiene checksum o longitud inconsistente');
        }
        return { tamanoBytes: fila.tamano_bytes, sha256Verificado: digest, mime: fila.mime };
    }
    async abrirLectura(ref) {
        const fila = await this.fila(ref);
        const contenido = Buffer.from(fila.contenido);
        if (BigInt(contenido.length) !== fila.tamano_bytes || (0, node_crypto_1.createHash)('sha256').update(contenido).digest('hex') !== fila.sha256) {
            throw new S3CompatibleStorageAdapter_1.ErrorStorage('INTEGRIDAD', this.proveedor, false, 'PDF PostgreSQL falló integridad de lectura');
        }
        return node_stream_1.Readable.from([contenido]);
    }
    async eliminarVersionPermitida(ref) {
        const referencia = this.validar(ref);
        // Solo limpia archivos huérfanos de una emisión fallida; nunca elimina PDFs referenciados.
        await this.db.$executeRaw `
      DELETE FROM finanzas.documento_pdf_postgres p
      WHERE p.contenedor = ${referencia.contenedor}
        AND p.clave = ${referencia.clave}
        AND NOT EXISTS (
          SELECT 1 FROM finanzas.version_documento v
          WHERE v.proveedor_logico = 'POSTGRES'
            AND v.contenedor_logico = p.contenedor
            AND v.clave_objeto = p.clave
        )
    `;
    }
}
exports.PostgresDocumentosComercialesStorage = PostgresDocumentosComercialesStorage;
//# sourceMappingURL=PostgresDocumentosComercialesStorage.js.map