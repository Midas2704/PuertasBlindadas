"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioDocumentalPrisma = void 0;
const client_1 = require("@prisma/client");
const node_crypto_1 = require("node:crypto");
const db_1 = require("../../db");
const tipos_1 = require("../tipos");
const estados_1 = require("../estados");
const validaciones_1 = require("../validaciones");
const esConflictoUnico = (error) => error instanceof client_1.Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
const esConflictoSerializable = (error) => {
    if (!(error instanceof client_1.Prisma.PrismaClientKnownRequestError))
        return false;
    if (error.code === 'P2034')
        return true;
    // Con driver adapters Prisma encapsula SQLSTATE 40001 como P2010.
    return error.code === 'P2010' && error.message.includes('40001');
};
const jsonPrisma = (valor) => valor === null ? client_1.Prisma.JsonNull : valor;
class RepositorioDocumentalPrisma {
    constructor(cliente = db_1.prisma) {
        this.cliente = cliente;
    }
    async transaccionReintentable(accion, intentos = 3) {
        for (let intento = 1; intento <= intentos; intento += 1) {
            try {
                return await this.cliente.$transaction(accion, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable, timeout: 30000 });
            }
            catch (error) {
                if (!esConflictoSerializable(error) || intento === intentos)
                    throw error;
            }
        }
        throw new tipos_1.ErrorDocumental('CONCURRENCIA', 'No fue posible completar la operación documental concurrente', 409);
    }
    async politicaValida(tx, id) {
        if (id === null || id === undefined)
            return null;
        const politica = await tx.configuracion_conservacion_documental.findUnique({ where: { id_configuracion_conservacion: id } });
        const hoy = new Date();
        hoy.setUTCHours(0, 0, 0, 0);
        if (!politica || politica.estado !== 'configurada' || politica.vigencia_desde > hoy || (politica.vigencia_hasta && politica.vigencia_hasta < hoy)) {
            throw new tipos_1.ErrorDocumental('POLITICA_NO_VIGENTE', 'La política descriptiva indicada no está configurada y vigente', 409);
        }
        return politica;
    }
    async crearDocumento(entrada, actor) {
        const titulo = (0, validaciones_1.textoRequerido)(entrada.titulo, 'Título', 200);
        const clasificacion = (0, validaciones_1.textoRequerido)(entrada.clasificacion, 'Clasificación', 60).toUpperCase();
        return this.transaccionReintentable(async (tx) => {
            await this.politicaValida(tx, entrada.idConfiguracionConservacion);
            const documento = await tx.documento_logico.create({ data: {
                    titulo, clasificacion, es_historico: entrada.esHistorico === true,
                    id_configuracion_conservacion: entrada.idConfiguracionConservacion ?? null, creado_por: actor.id,
                } });
            await tx.evento_operacional_documental.create({ data: {
                    tipo_evento: 'DOCUMENTO_CREADO', id_documento_logico: documento.id_documento_logico,
                    clave_idempotencia: `documento:${documento.id_documento_logico}:creado`,
                    payload_tecnico: { clasificacion, historico: documento.es_historico },
                } });
            return documento;
        });
    }
    async consultarDocumento(id) {
        const documento = await this.cliente.documento_logico.findUnique({
            where: { id_documento_logico: id },
            include: { versiones: { orderBy: { numero_version: 'desc' } }, asociaciones_producto: { orderBy: { orden_presentacion: 'asc' } } },
        });
        if (!documento)
            throw new tipos_1.ErrorDocumental('DOCUMENTO_NO_ENCONTRADO', 'Documento lógico no encontrado', 404);
        return documento;
    }
    async cambiarEstadoDocumento(id, revision, siguiente, motivo) {
        return this.transaccionReintentable(async (tx) => {
            const actual = await tx.documento_logico.findUnique({ where: { id_documento_logico: id } });
            if (!actual)
                throw new tipos_1.ErrorDocumental('DOCUMENTO_NO_ENCONTRADO', 'Documento lógico no encontrado', 404);
            (0, estados_1.exigirTransicionDocumento)(actual.estado, siguiente);
            const desactivado = siguiente === 'ACTIVO' ? null : new Date();
            const resultado = await tx.documento_logico.updateMany({
                where: { id_documento_logico: id, revision },
                data: { estado: siguiente, revision: { increment: 1 }, actualizado_en: new Date(), desactivado_en: desactivado, motivo_desactivacion: siguiente === 'ACTIVO' ? null : (0, validaciones_1.textoRequerido)(motivo, 'Motivo', 2000) },
            });
            if (resultado.count !== 1)
                throw new tipos_1.ErrorDocumental('REVISION_DESACTUALIZADA', 'El documento cambió concurrentemente', 409);
            return tx.documento_logico.findUniqueOrThrow({ where: { id_documento_logico: id } });
        });
    }
    intencionCoincide(actual, datos) {
        return actual.id_documento_logico === datos.idDocumento && actual.clasificacion === datos.clasificacion && actual.nombre_declarado === datos.nombre && actual.mime_declarado === datos.mime && actual.tamano_esperado === datos.tamano && actual.clave_temporal === datos.clave;
    }
    async crearIntencion(entrada, actor) {
        const datos = {
            idDocumento: entrada.idDocumento,
            clasificacion: (0, validaciones_1.textoRequerido)(entrada.clasificacion, 'Clasificación', 60).toUpperCase(),
            nombre: (0, validaciones_1.validarNombreArchivo)(entrada.nombreDeclarado), mime: (0, validaciones_1.validarMime)(entrada.mimeDeclarado),
            tamano: (0, validaciones_1.validarTamano)(entrada.tamanoEsperado), clave: (0, validaciones_1.validarClaveTemporal)(entrada.claveTemporal),
            idempotencia: (0, validaciones_1.textoRequerido)(entrada.claveIdempotencia, 'Clave de idempotencia', 160),
        };
        const documento = await this.cliente.documento_logico.findUnique({ where: { id_documento_logico: datos.idDocumento } });
        if (!documento || documento.estado !== 'ACTIVO')
            throw new tipos_1.ErrorDocumental('DOCUMENTO_NO_DISPONIBLE', 'El documento de la intención no existe o no está activo', 409);
        if (documento.clasificacion !== datos.clasificacion)
            throw new tipos_1.ErrorDocumental('CLASIFICACION_NO_COINCIDE', 'La clasificación de la intención no corresponde al documento', 409);
        if (!(entrada.expiraEn instanceof Date) || !Number.isFinite(entrada.expiraEn.getTime()) || entrada.expiraEn <= new Date())
            throw new tipos_1.ErrorDocumental('EXPIRACION_INVALIDA', 'La intención debe expirar en el futuro');
        const existente = await this.cliente.intencion_carga_documental.findUnique({ where: { usuario_solicitante_clave_idempotencia: { usuario_solicitante: actor.id, clave_idempotencia: datos.idempotencia } } });
        if (existente) {
            if (!this.intencionCoincide(existente, datos))
                throw new tipos_1.ErrorDocumental('IDEMPOTENCIA_CONFLICTIVA', 'La clave de idempotencia ya fue usada con otros metadatos', 409);
            return existente;
        }
        try {
            return await this.cliente.intencion_carga_documental.create({ data: {
                    id_documento_logico: datos.idDocumento, usuario_solicitante: actor.id, clasificacion: datos.clasificacion, nombre_declarado: datos.nombre,
                    mime_declarado: datos.mime, tamano_esperado: datos.tamano, clave_temporal: datos.clave,
                    clave_idempotencia: datos.idempotencia, expira_en: entrada.expiraEn,
                } });
        }
        catch (error) {
            if (!esConflictoUnico(error))
                throw error;
            const concurrente = await this.cliente.intencion_carga_documental.findUnique({ where: { usuario_solicitante_clave_idempotencia: { usuario_solicitante: actor.id, clave_idempotencia: datos.idempotencia } } });
            if (!concurrente || !this.intencionCoincide(concurrente, datos))
                throw new tipos_1.ErrorDocumental('IDEMPOTENCIA_CONFLICTIVA', 'Solicitud documental duplicada incompatible', 409);
            return concurrente;
        }
    }
    async consultarIntencion(idPublico) {
        const intencion = await this.cliente.intencion_carga_documental.findUnique({ where: { id_publico: idPublico } });
        if (!intencion)
            throw new tipos_1.ErrorDocumental('INTENCION_NO_ENCONTRADA', 'Intención de carga no encontrada', 404);
        return intencion;
    }
    async cambiarEstadoIntencion(idPublico, revision, siguiente, opciones = {}) {
        return this.transaccionReintentable(async (tx) => {
            const actual = await tx.intencion_carga_documental.findUnique({ where: { id_publico: idPublico } });
            if (!actual)
                throw new tipos_1.ErrorDocumental('INTENCION_NO_ENCONTRADA', 'Intención de carga no encontrada', 404);
            (0, estados_1.exigirTransicionIntencion)(actual.estado, siguiente);
            const cambio = await tx.intencion_carga_documental.updateMany({ where: { id_publico: idPublico, revision }, data: {
                    estado: siguiente, revision: { increment: 1 }, codigo_error: opciones.codigoError ? (0, validaciones_1.textoRequerido)(opciones.codigoError, 'Código de error', 100) : null,
                    confirmado_en: siguiente === 'DISPONIBLE' ? opciones.confirmadoEn ?? new Date() : undefined,
                    cantidad_reintentos: opciones.incrementarReintento ? { increment: 1 } : undefined,
                } });
            if (cambio.count !== 1)
                throw new tipos_1.ErrorDocumental('REVISION_DESACTUALIZADA', 'La intención cambió concurrentemente', 409);
            return tx.intencion_carga_documental.findUniqueOrThrow({ where: { id_publico: idPublico } });
        });
    }
    async registrarVersion(entrada, actor) {
        const proveedor = entrada.proveedor;
        const contenedor = (0, validaciones_1.validarContenedor)(entrada.contenedor);
        const clave = (0, validaciones_1.validarClaveObjeto)(entrada.claveObjeto);
        const nombreOriginal = (0, validaciones_1.validarNombreArchivo)(entrada.nombreOriginal, 'Nombre original');
        const nombreSeguro = (0, validaciones_1.validarNombreArchivo)(entrada.nombreSeguro, 'Nombre seguro');
        const mimeDeclarado = (0, validaciones_1.validarMime)(entrada.mimeDeclarado);
        const mimeDetectado = entrada.mimeDetectado ? (0, validaciones_1.validarMime)(entrada.mimeDetectado) : null;
        const tamano = (0, validaciones_1.validarTamano)(entrada.tamanoBytes);
        const estado = entrada.estado ?? 'PENDIENTE';
        const sha256 = (0, validaciones_1.validarSha256)(entrada.sha256, estado === 'DISPONIBLE');
        if (estado === 'DISPONIBLE' && (!mimeDetectado || !entrada.validadoEn))
            throw new tipos_1.ErrorDocumental('VALIDACION_INCOMPLETA', 'Una versión disponible requiere MIME detectado, hash y fecha de validación');
        return this.transaccionReintentable(async (tx) => {
            await tx.$queryRaw `SELECT "id_documento_logico" FROM "finanzas"."documento_logico" WHERE "id_documento_logico" = ${entrada.idDocumento} FOR UPDATE`;
            const documento = await tx.documento_logico.findUnique({ where: { id_documento_logico: entrada.idDocumento } });
            if (!documento || documento.estado === 'ARCHIVADO')
                throw new tipos_1.ErrorDocumental('DOCUMENTO_NO_DISPONIBLE', 'Documento lógico inexistente o archivado', 409);
            const ultima = await tx.version_documento.aggregate({ where: { id_documento_logico: entrada.idDocumento }, _max: { numero_version: true } });
            const numero = (ultima._max.numero_version ?? 0) + 1;
            const version = await tx.version_documento.create({ data: {
                    id_documento_logico: entrada.idDocumento, numero_version: numero, proveedor_logico: proveedor,
                    contenedor_logico: contenedor, clave_objeto: clave, version_proveedor: entrada.versionProveedor ?? null,
                    nombre_original: nombreOriginal, nombre_seguro: nombreSeguro, mime_declarado: mimeDeclarado,
                    mime_detectado: mimeDetectado, tamano_bytes: tamano, sha256, estado, creado_por: actor.id,
                    validado_en: entrada.validadoEn ?? null, id_version_reemplazada: entrada.idVersionReemplazada ?? null,
                    resultado_validaciones: jsonPrisma(entrada.resultadoValidaciones),
                } });
            await tx.documento_logico.update({ where: { id_documento_logico: entrada.idDocumento }, data: { numero_version_actual: numero, revision: { increment: 1 }, actualizado_en: new Date() } });
            await tx.evento_operacional_documental.create({ data: {
                    tipo_evento: 'VERSION_REGISTRADA', id_documento_logico: entrada.idDocumento, id_version_documento: version.id_version_documento,
                    clave_idempotencia: `version:${version.id_version_documento}:registrada`, payload_tecnico: { numero, proveedor },
                } });
            return version;
        });
    }
    async consultarVersionPorObjeto(proveedor, contenedor, clave) {
        return this.cliente.version_documento.findUnique({
            where: { proveedor_logico_contenedor_logico_clave_objeto: {
                    proveedor_logico: (0, validaciones_1.textoRequerido)(proveedor, 'Proveedor', 20).toUpperCase(),
                    contenedor_logico: (0, validaciones_1.validarContenedor)(contenedor), clave_objeto: (0, validaciones_1.validarClaveObjeto)(clave),
                } },
        });
    }
    /** Registra versión, actualiza documento, finaliza intención y emite outbox en una sola transacción DB. */
    async registrarVersionYFinalizarIntencion(entrada, actor) {
        const v = entrada.version;
        const contenedor = (0, validaciones_1.validarContenedor)(v.contenedor);
        const clave = (0, validaciones_1.validarClaveObjeto)(v.claveObjeto);
        const nombreOriginal = (0, validaciones_1.validarNombreArchivo)(v.nombreOriginal, 'Nombre original');
        const nombreSeguro = (0, validaciones_1.validarNombreArchivo)(v.nombreSeguro, 'Nombre seguro');
        const mimeDeclarado = (0, validaciones_1.validarMime)(v.mimeDeclarado);
        const mimeDetectado = v.mimeDetectado ? (0, validaciones_1.validarMime)(v.mimeDetectado) : null;
        const tamano = (0, validaciones_1.validarTamano)(v.tamanoBytes);
        const estadoVersion = v.estado ?? entrada.estadoIntencion;
        const sha256 = (0, validaciones_1.validarSha256)(v.sha256, estadoVersion === 'DISPONIBLE');
        if (estadoVersion === 'DISPONIBLE' && (!mimeDetectado || !v.validadoEn))
            throw new tipos_1.ErrorDocumental('VALIDACION_INCOMPLETA', 'Una versión disponible requiere MIME detectado, hash y fecha de validación');
        return this.transaccionReintentable(async (tx) => {
            await tx.$queryRaw `SELECT "id_intencion_carga" FROM "finanzas"."intencion_carga_documental" WHERE "id_publico" = ${entrada.idIntencionPublico}::uuid FOR UPDATE`;
            const intencion = await tx.intencion_carga_documental.findUnique({ where: { id_publico: entrada.idIntencionPublico } });
            if (!intencion)
                throw new tipos_1.ErrorDocumental('INTENCION_NO_ENCONTRADA', 'Intención de carga no encontrada', 404);
            if (intencion.id_documento_logico === null)
                throw new tipos_1.ErrorDocumental('INTENCION_LEGACY_NO_CONFIRMABLE', 'La intención histórica no está vinculada a un documento', 409);
            if (intencion.id_documento_logico !== v.idDocumento)
                throw new tipos_1.ErrorDocumental('INTENCION_DOCUMENTO_NO_COINCIDE', 'La intención no pertenece al documento solicitado', 409);
            const existente = await tx.version_documento.findUnique({ where: { proveedor_logico_contenedor_logico_clave_objeto: { proveedor_logico: v.proveedor, contenedor_logico: contenedor, clave_objeto: clave } } });
            if (existente && ['DISPONIBLE', 'CUARENTENA'].includes(intencion.estado))
                return existente;
            if (intencion.revision !== entrada.revisionIntencion)
                throw new tipos_1.ErrorDocumental('REVISION_DESACTUALIZADA', 'La intención cambió concurrentemente', 409);
            (0, estados_1.exigirTransicionIntencion)(intencion.estado, entrada.estadoIntencion);
            await tx.$queryRaw `SELECT "id_documento_logico" FROM "finanzas"."documento_logico" WHERE "id_documento_logico" = ${v.idDocumento} FOR UPDATE`;
            const documento = await tx.documento_logico.findUnique({ where: { id_documento_logico: v.idDocumento } });
            if (!documento || documento.estado === 'ARCHIVADO')
                throw new tipos_1.ErrorDocumental('DOCUMENTO_NO_DISPONIBLE', 'Documento lógico inexistente o archivado', 409);
            if (documento.clasificacion !== intencion.clasificacion)
                throw new tipos_1.ErrorDocumental('CLASIFICACION_NO_COINCIDE', 'La intención y el documento tienen clasificaciones distintas', 409);
            const ultima = await tx.version_documento.aggregate({ where: { id_documento_logico: v.idDocumento }, _max: { numero_version: true } });
            const numero = (ultima._max.numero_version ?? 0) + 1;
            const version = await tx.version_documento.create({ data: {
                    id_documento_logico: v.idDocumento, numero_version: numero, proveedor_logico: v.proveedor,
                    contenedor_logico: contenedor, clave_objeto: clave, version_proveedor: v.versionProveedor ?? null,
                    nombre_original: nombreOriginal, nombre_seguro: nombreSeguro, mime_declarado: mimeDeclarado,
                    mime_detectado: mimeDetectado, tamano_bytes: tamano, sha256, estado: estadoVersion, creado_por: actor.id,
                    validado_en: v.validadoEn ?? null, id_version_reemplazada: v.idVersionReemplazada ?? null,
                    resultado_validaciones: jsonPrisma(v.resultadoValidaciones),
                } });
            await tx.documento_logico.update({ where: { id_documento_logico: v.idDocumento }, data: { numero_version_actual: numero, revision: { increment: 1 }, actualizado_en: new Date() } });
            await tx.intencion_carga_documental.update({ where: { id_publico: entrada.idIntencionPublico }, data: {
                    estado: entrada.estadoIntencion, revision: { increment: 1 }, confirmado_en: entrada.estadoIntencion === 'DISPONIBLE' ? new Date() : null,
                    codigo_error: entrada.codigoError ? (0, validaciones_1.textoRequerido)(entrada.codigoError, 'Código de error', 100) : null,
                } });
            await tx.evento_operacional_documental.create({ data: {
                    tipo_evento: entrada.estadoIntencion === 'DISPONIBLE' ? 'CARGA_CONFIRMADA' : 'CUARENTENA_APLICADA',
                    id_documento_logico: v.idDocumento, id_version_documento: version.id_version_documento,
                    clave_idempotencia: `intencion:${entrada.idIntencionPublico}:resultado`,
                    payload_tecnico: { resultado: entrada.estadoIntencion, codigo: entrada.codigoError ?? null },
                } });
            return version;
        });
    }
    async cambiarEstadoVersion(id, revision, siguiente) {
        return this.transaccionReintentable(async (tx) => {
            const actual = await tx.version_documento.findUnique({ where: { id_version_documento: id } });
            if (!actual)
                throw new tipos_1.ErrorDocumental('VERSION_NO_ENCONTRADA', 'Versión documental no encontrada', 404);
            (0, estados_1.exigirTransicionVersion)(actual.estado, siguiente);
            const cambio = await tx.version_documento.updateMany({ where: { id_version_documento: id, revision }, data: { estado: siguiente, revision: { increment: 1 } } });
            if (cambio.count !== 1)
                throw new tipos_1.ErrorDocumental('REVISION_DESACTUALIZADA', 'La versión cambió concurrentemente', 409);
            return tx.version_documento.findUniqueOrThrow({ where: { id_version_documento: id } });
        });
    }
    async registrarVariante(idOriginal, idDerivada, tipo, parametros) {
        if (idOriginal === idDerivada)
            throw new tipos_1.ErrorDocumental('VARIANTE_CICLICA', 'Original y derivada deben ser versiones distintas', 409);
        return this.transaccionReintentable(async (tx) => {
            const versiones = await tx.version_documento.findMany({ where: { id_version_documento: { in: [idOriginal, idDerivada] } } });
            if (versiones.length !== 2)
                throw new tipos_1.ErrorDocumental('VERSION_NO_ENCONTRADA', 'Original o derivada no existe', 404);
            if (versiones[0].id_documento_logico !== versiones[1].id_documento_logico)
                throw new tipos_1.ErrorDocumental('VARIANTE_INCONSISTENTE', 'Original y derivada deben pertenecer al mismo documento lógico', 409);
            return tx.variante_documento.create({ data: { id_version_original: idOriginal, id_version_derivada: idDerivada, tipo_variante: tipo, parametros_tecnicos: jsonPrisma(parametros) } });
        });
    }
    async asociarProducto(entrada, actor) {
        const orden = entrada.ordenPresentacion ?? 0;
        if (!Number.isInteger(orden) || orden < 0)
            throw new tipos_1.ErrorDocumental('ORDEN_INVALIDO', 'El orden de presentación debe ser un entero no negativo');
        if (entrada.esImagenPrincipal && entrada.tipoDocumento !== 'FOTOGRAFIA_COMERCIAL')
            throw new tipos_1.ErrorDocumental('PRINCIPAL_INVALIDA', 'Sólo una fotografía comercial puede ser imagen principal');
        try {
            return await this.transaccionReintentable(async (tx) => {
                const [producto, documento] = await Promise.all([
                    tx.extension_producto_comercial.findUnique({ where: { id_extension_producto_comercial: entrada.idProducto } }),
                    tx.documento_logico.findUnique({ where: { id_documento_logico: entrada.idDocumento } }),
                ]);
                if (!producto)
                    throw new tipos_1.ErrorDocumental('PRODUCTO_NO_ENCONTRADO', 'Producto comercial no encontrado', 404);
                if (!documento || documento.estado !== 'ACTIVO')
                    throw new tipos_1.ErrorDocumental('DOCUMENTO_NO_DISPONIBLE', 'El documento no existe o no está activo', 409);
                if (documento.clasificacion !== 'COMERCIAL')
                    throw new tipos_1.ErrorDocumental('CLASIFICACION_DOCUMENTAL_NO_AUTORIZADA', 'Sólo documentos comerciales pueden asociarse a productos', 403);
                const asociacion = await tx.producto_comercial_documento.create({ data: {
                        id_extension_producto_comercial: entrada.idProducto, id_documento_logico: entrada.idDocumento,
                        tipo_documento: entrada.tipoDocumento, orden_presentacion: orden, es_imagen_principal: entrada.esImagenPrincipal ?? false,
                        habilitado_b2b: entrada.habilitadoB2b ?? false, habilitado_b2c: entrada.habilitadoB2c ?? false, usuario_responsable: actor.id,
                    } });
                const claveEvento = `producto:${entrada.idProducto}:documento:${entrada.idDocumento}:${entrada.tipoDocumento}`;
                await tx.evento_operacional_documental.upsert({
                    where: { clave_idempotencia: claveEvento }, update: {}, create: {
                        tipo_evento: 'DOCUMENTO_ASOCIADO_PRODUCTO', id_documento_logico: entrada.idDocumento,
                        clave_idempotencia: claveEvento, payload_tecnico: { idProducto: entrada.idProducto, tipoDocumento: entrada.tipoDocumento },
                    },
                });
                return asociacion;
            });
        }
        catch (error) {
            if (!esConflictoUnico(error))
                throw error;
            const existente = await this.cliente.producto_comercial_documento.findUnique({
                where: { id_extension_producto_comercial_id_documento_logico_tipo_documento: {
                        id_extension_producto_comercial: entrada.idProducto,
                        id_documento_logico: entrada.idDocumento,
                        tipo_documento: entrada.tipoDocumento,
                    } },
            });
            if (!existente)
                throw error;
            if (existente.orden_presentacion !== orden
                || existente.es_imagen_principal !== (entrada.esImagenPrincipal ?? false)
                || existente.habilitado_b2b !== (entrada.habilitadoB2b ?? false)
                || existente.habilitado_b2c !== (entrada.habilitadoB2c ?? false)) {
                throw new tipos_1.ErrorDocumental('IDEMPOTENCIA_CONFLICTIVA', 'La asociación ya existe con una configuración diferente', 409);
            }
            return existente;
        }
    }
    async listarAsociacionesProducto(idProducto) {
        return this.cliente.producto_comercial_documento.findMany({ where: { id_extension_producto_comercial: idProducto }, include: { documento: { include: { versiones: { orderBy: { numero_version: 'desc' } } } } }, orderBy: [{ orden_presentacion: 'asc' }, { asociado_en: 'asc' }] });
    }
    /** Consulta acotada para el servicio comercial. No selecciona claves de objeto, proveedor ni hash. */
    async consultarDocumentosProducto(idProducto, incluirHistorial, limiteVersiones = 50) {
        const limite = Math.min(Math.max(Math.trunc(limiteVersiones), 1), 50);
        return this.cliente.extension_producto_comercial.findUnique({
            where: { id_extension_producto_comercial: idProducto },
            select: {
                id_extension_producto_comercial: true,
                estado: true,
                documentos: {
                    where: { estado: 'ACTIVO', documento: { estado: 'ACTIVO', clasificacion: 'COMERCIAL' } },
                    orderBy: [{ orden_presentacion: 'asc' }, { asociado_en: 'asc' }],
                    take: 200,
                    select: {
                        id_producto_comercial_documento: true, tipo_documento: true, orden_presentacion: true,
                        es_imagen_principal: true, habilitado_b2b: true, habilitado_b2c: true, asociado_en: true,
                        documento: {
                            select: {
                                id_documento_logico: true, titulo: true, clasificacion: true,
                                numero_version_actual: true, creado_en: true, actualizado_en: true,
                                versiones: {
                                    orderBy: { numero_version: 'desc' }, take: incluirHistorial ? limite : 1,
                                    select: {
                                        id_version_documento: true, numero_version: true, estado: true,
                                        nombre_seguro: true, mime_detectado: true, tamano_bytes: true,
                                        creado_en: true, validado_en: true,
                                        creador: { select: { usuario_username: true } },
                                        variantes_origen: {
                                            where: { tipo_variante: { in: ['MINIATURA', 'VISTA_PREVIA'] } },
                                            select: { tipo_variante: true, version_derivada: { select: { id_version_documento: true, estado: true } } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async registrarEvento(entrada) {
        const tipo = (0, validaciones_1.textoRequerido)(entrada.tipoEvento, 'Tipo de evento', 80).toUpperCase();
        const clave = (0, validaciones_1.textoRequerido)(entrada.claveIdempotencia, 'Clave de idempotencia', 180);
        try {
            return await this.cliente.evento_operacional_documental.create({ data: {
                    tipo_evento: tipo, clave_idempotencia: clave, id_documento_logico: entrada.idDocumento ?? null,
                    id_version_documento: entrada.idVersion ?? null, payload_tecnico: jsonPrisma(entrada.payloadTecnico), proximo_intento_en: entrada.proximoIntentoEn ?? null,
                } });
        }
        catch (error) {
            if (!esConflictoUnico(error))
                throw error;
            return this.cliente.evento_operacional_documental.findUniqueOrThrow({ where: { clave_idempotencia: clave } });
        }
    }
    async cambiarEstadoEvento(id, siguiente, codigoError, leaseToken) {
        return this.transaccionReintentable(async (tx) => {
            const actual = await tx.evento_operacional_documental.findUnique({ where: { id_evento_operacional: id } });
            if (!actual)
                throw new tipos_1.ErrorDocumental('EVENTO_NO_ENCONTRADO', 'Evento operacional no encontrado', 404);
            if (siguiente === 'PROCESANDO')
                throw new tipos_1.ErrorDocumental('EVENTO_DEBE_RECLAMARSE', 'Los eventos se procesan únicamente mediante un lease atómico', 409);
            (0, estados_1.exigirTransicionOutbox)(actual.estado, siguiente);
            const ahora = new Date();
            if (actual.estado === 'PROCESANDO' && (!leaseToken || actual.lease_token !== leaseToken || !actual.lease_hasta || actual.lease_hasta <= ahora))
                throw new tipos_1.ErrorDocumental('LEASE_NO_POSEIDO', 'El worker no posee un lease vigente para este evento', 409);
            const propiedad = actual.estado === 'PROCESANDO'
                ? { estado: 'PROCESANDO', lease_token: leaseToken, lease_hasta: { gt: ahora } }
                : { estado: actual.estado, lease_token: null, lease_hasta: null };
            const cambio = await tx.evento_operacional_documental.updateMany({ where: { id_evento_operacional: id, ...propiedad }, data: {
                    estado: siguiente,
                    procesado_en: siguiente === 'PROCESADO' ? new Date() : null,
                    codigo_error: codigoError ? (0, validaciones_1.textoRequerido)(codigoError, 'Código de error', 100) : null,
                    lease_token: null, lease_hasta: null,
                } });
            if (cambio.count !== 1)
                throw new tipos_1.ErrorDocumental('EVENTO_CONFLICTO', 'El evento cambió concurrentemente', 409);
            return tx.evento_operacional_documental.findUniqueOrThrow({ where: { id_evento_operacional: id } });
        });
    }
    async reclamarSiguienteEvento(fecha, leaseHasta) {
        return this.transaccionReintentable(async (tx) => {
            const leaseToken = (0, node_crypto_1.randomUUID)();
            const candidatos = await tx.$queryRaw `
        SELECT "id_evento_operacional"
        FROM "finanzas"."evento_operacional_documental"
        WHERE (
          ("estado" = 'PENDIENTE' AND ("proximo_intento_en" IS NULL OR "proximo_intento_en" <= ${fecha}))
          OR ("estado" = 'PROCESANDO' AND "lease_hasta" <= ${fecha})
        )
        ORDER BY "creado_en", "id_evento_operacional"
        FOR UPDATE SKIP LOCKED
        LIMIT 1`;
            const candidato = candidatos[0];
            if (!candidato)
                return null;
            return tx.evento_operacional_documental.update({ where: { id_evento_operacional: candidato.id_evento_operacional }, data: {
                    estado: 'PROCESANDO', cantidad_intentos: { increment: 1 }, lease_token: leaseToken, lease_hasta: leaseHasta, codigo_error: null,
                } });
        });
    }
    async reprogramarEventosFallidos(fecha, limite = 100) {
        const ids = await this.cliente.evento_operacional_documental.findMany({
            where: { estado: 'ERROR', OR: [{ proximo_intento_en: null }, { proximo_intento_en: { lte: fecha } }] },
            orderBy: { creado_en: 'asc' }, take: Math.max(1, Math.min(limite, 1000)), select: { id_evento_operacional: true },
        });
        let actualizados = 0;
        for (const item of ids) {
            const resultado = await this.cliente.evento_operacional_documental.updateMany({ where: { id_evento_operacional: item.id_evento_operacional, estado: 'ERROR' }, data: { estado: 'PENDIENTE', proximo_intento_en: fecha } });
            actualizados += resultado.count;
        }
        return actualizados;
    }
}
exports.RepositorioDocumentalPrisma = RepositorioDocumentalPrisma;
//# sourceMappingURL=RepositorioDocumentalPrisma.js.map