"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordinadorCargaDocumental = void 0;
const AntivirusAdapter_1 = require("../seguridad/AntivirusAdapter");
const IntegridadContenido_1 = require("../seguridad/IntegridadContenido");
const tipos_1 = require("../tipos");
const nombreSeguro = (nombre) => nombre.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 180) || 'documento';
/** Orquesta storage y PostgreSQL sin fingir atomicidad distribuida: claves deterministas + reintento recuperable. */
class CoordinadorCargaDocumental {
    constructor(repositorio, storage, antivirus, autorizarConfirmacion, configuracion) {
        this.repositorio = repositorio;
        this.storage = storage;
        this.antivirus = antivirus;
        this.autorizarConfirmacion = autorizarConfirmacion;
        this.configuracion = configuracion;
    }
    async confirmar(entrada) {
        if (!this.storage.abrirLecturaCondicionada || !this.storage.crearObjetoExclusivo)
            throw new tipos_1.ErrorDocumental('STORAGE_SIN_CAPACIDAD', 'El proveedor no permite leer y crear objetos de forma condicional', 503);
        if (!this.storage.capacidades.escrituraCondicionalDestino || !this.storage.capacidades.lecturaCondicionalOrigen)
            throw new tipos_1.ErrorDocumental('PROMOCION_CONDICIONAL_NO_VALIDADA', 'La activación permanece bloqueada: el proveedor no garantiza lectura estable y creación exclusiva', 503);
        if (this.storage.proveedor !== this.configuracion.proveedor)
            throw new tipos_1.ErrorDocumental('PROVEEDOR_NO_COINCIDE', 'El proveedor configurado no corresponde al adaptador activo', 503);
        let intencion = await this.repositorio.consultarIntencion(entrada.idIntencion);
        if (intencion.usuario_solicitante !== entrada.actor.id)
            throw new tipos_1.ErrorDocumental('ACTOR_NO_COINCIDE', 'La intención pertenece a otro actor', 403);
        if (intencion.id_documento_logico === null)
            throw new tipos_1.ErrorDocumental('INTENCION_LEGACY_NO_CONFIRMABLE', 'La intención no está vinculada a un documento', 409);
        if (intencion.id_documento_logico !== entrada.idDocumento)
            throw new tipos_1.ErrorDocumental('INTENCION_DOCUMENTO_NO_COINCIDE', 'La intención no pertenece al documento solicitado', 409);
        await this.autorizarConfirmacion({ actor: entrada.actor, idDocumento: intencion.id_documento_logico, clasificacion: intencion.clasificacion, usuarioSolicitante: intencion.usuario_solicitante });
        if (intencion.expira_en <= new Date())
            throw new tipos_1.ErrorDocumental('INTENCION_EXPIRADA', 'La intención de carga expiró', 409);
        const politica = this.configuracion.politicasPorClasificacion[intencion.clasificacion];
        if (!politica)
            throw new tipos_1.ErrorDocumental('POLITICA_TECNICA_NO_CONFIGURADA', 'No existe una política técnica aprobada para esta clasificación', 503);
        const claveDisponible = `${this.configuracion.prefijoDisponible}/${intencion.id_publico}`;
        const claveCuarentena = `${this.configuracion.prefijoCuarentena}/${intencion.id_publico}`;
        const existente = await this.repositorio.consultarVersionPorObjeto(this.configuracion.proveedor, this.configuracion.contenedorDefinitivo, claveDisponible)
            ?? await this.repositorio.consultarVersionPorObjeto(this.configuracion.proveedor, this.configuracion.contenedorDefinitivo, claveCuarentena);
        if (existente) {
            if (existente.id_documento_logico !== entrada.idDocumento || !['DISPONIBLE', 'CUARENTENA'].includes(existente.estado))
                throw new tipos_1.ErrorDocumental('VERSION_IDEMPOTENTE_INCONSISTENTE', 'La versión recuperada no corresponde a la intención', 409);
            const validaciones = existente.resultado_validaciones;
            return { versionId: existente.id_version_documento, estado: existente.estado, integridad: { valido: (validaciones?.integridad?.length ?? 1) === 0, tamanoBytes: existente.tamano_bytes, sha256: existente.sha256 ?? '', mimeDetectado: existente.mime_detectado, mimeDeclaradoCoincide: validaciones?.mimeDeclaradoCoincide === true, codigos: validaciones?.integridad ?? ['VALIDACION_NO_RECUPERABLE'] }, antivirus: validaciones?.antivirus ?? { estado: 'NO_DISPONIBLE' }, idempotente: true };
        }
        if (intencion.estado === 'PENDIENTE')
            intencion = await this.repositorio.cambiarEstadoIntencion(intencion.id_publico, intencion.revision, 'SUBIENDO');
        if (intencion.estado === 'SUBIENDO')
            intencion = await this.repositorio.cambiarEstadoIntencion(intencion.id_publico, intencion.revision, 'VALIDANDO');
        if (intencion.estado !== 'VALIDANDO')
            throw new tipos_1.ErrorDocumental('INTENCION_NO_CONFIRMABLE', `La intención está en estado ${intencion.estado}`, 409);
        const temporal = { contenedor: this.configuracion.contenedorTemporal, clave: intencion.clave_temporal };
        const trabajo = { contenedor: this.configuracion.contenedorDefinitivo, clave: claveCuarentena };
        const claveIdempotenciaTrabajo = `trabajo:${intencion.id_publico}`;
        const exigirPropiedad = (metadata, clave, codigo) => {
            if (metadata.metadatosProveedor?.['idempotencia-documental'] !== clave) {
                throw new tipos_1.ErrorDocumental(codigo, 'La clave ya existe, pero no acredita pertenecer a esta operación documental', 409);
            }
        };
        let metadataTrabajo;
        try {
            metadataTrabajo = await this.storage.consultarObjeto(trabajo);
            exigirPropiedad(metadataTrabajo, claveIdempotenciaTrabajo, 'COPIA_TRABAJO_OCUPADA');
        }
        catch (error) {
            if (!(error && typeof error === 'object' && 'codigo' in error && error.codigo === 'NO_ENCONTRADO'))
                throw error;
            const metadataTemporal = await this.storage.consultarObjeto(temporal);
            if (metadataTemporal.tamanoBytes !== intencion.tamano_esperado)
                throw new tipos_1.ErrorDocumental('TAMANO_STORAGE_NO_COINCIDE', 'El tamaño almacenado no coincide con la intención', 409);
            if (!metadataTemporal.etag)
                throw new tipos_1.ErrorDocumental('TOKEN_CONCURRENCIA_NO_DISPONIBLE', 'El proveedor no entregó un token para congelar la carga temporal', 503);
            try {
                metadataTrabajo = await this.storage.crearObjetoExclusivo({
                    referencia: trabajo,
                    contenido: await this.storage.abrirLecturaCondicionada({ referencia: temporal, etag: metadataTemporal.etag }),
                    mime: intencion.mime_declarado,
                    tamanoEsperado: intencion.tamano_esperado,
                    claveIdempotencia: claveIdempotenciaTrabajo,
                });
            }
            catch (errorCreacion) {
                if (!(errorCreacion && typeof errorCreacion === 'object' && 'codigo' in errorCreacion && errorCreacion.codigo === 'OBJETO_EXISTENTE'))
                    throw errorCreacion;
                metadataTrabajo = await this.storage.consultarObjeto(trabajo);
            }
            exigirPropiedad(metadataTrabajo, claveIdempotenciaTrabajo, 'COPIA_TRABAJO_OCUPADA');
        }
        if (metadataTrabajo.tamanoBytes !== intencion.tamano_esperado)
            throw new tipos_1.ErrorDocumental('COPIA_TRABAJO_INCONSISTENTE', 'La copia de trabajo no conserva el tamaño esperado', 409);
        if (!metadataTrabajo.etag)
            throw new tipos_1.ErrorDocumental('TOKEN_CONCURRENCIA_NO_DISPONIBLE', 'La copia de trabajo no tiene un token de concurrencia', 503);
        const integridad = await (0, IntegridadContenido_1.validarIntegridadContenido)({ contenido: await this.storage.abrirLecturaCondicionada({ referencia: trabajo, etag: metadataTrabajo.etag }), mimeDeclarado: intencion.mime_declarado, tamanoEsperado: intencion.tamano_esperado, sha256Esperado: entrada.sha256Esperado, politica });
        let antivirus = { estado: 'ARCHIVO_NO_SOPORTADO', codigo: 'INTEGRIDAD_RECHAZADA' };
        if (integridad.valido) {
            const escaneo = await (0, AntivirusAdapter_1.escanearConIntegridad)(this.antivirus, await this.storage.abrirLecturaCondicionada({ referencia: trabajo, etag: metadataTrabajo.etag }));
            antivirus = escaneo.resultado;
            if (!escaneo.completo || escaneo.sha256 !== integridad.sha256 || escaneo.tamanoBytes !== integridad.tamanoBytes)
                antivirus = { estado: 'ERROR_ESCANEO', motor: this.antivirus.nombre, codigo: 'BYTES_ESCANEADOS_NO_COINCIDEN' };
        }
        const disponible = integridad.valido && antivirus.estado === 'LIMPIO';
        const destino = { contenedor: this.configuracion.contenedorDefinitivo, clave: disponible ? claveDisponible : claveCuarentena };
        const metadataTrabajoActual = await this.storage.consultarObjeto(trabajo);
        if (metadataTrabajoActual.tamanoBytes !== metadataTrabajo.tamanoBytes || (metadataTrabajo.etag && metadataTrabajoActual.etag !== metadataTrabajo.etag))
            throw new tipos_1.ErrorDocumental('COPIA_TRABAJO_MODIFICADA', 'La copia de trabajo cambió durante la validación', 409);
        if (disponible && !metadataTrabajoActual.etag)
            throw new tipos_1.ErrorDocumental('TOKEN_CONCURRENCIA_NO_DISPONIBLE', 'El proveedor no entregó un token para promover de forma segura', 503);
        let destinoPreexistente = false;
        let metadataDestino = metadataTrabajoActual;
        const claveIdempotenciaDestino = `promocion:${intencion.id_publico}`;
        if (disponible)
            try {
                metadataDestino = await this.storage.crearObjetoExclusivo({
                    referencia: destino,
                    contenido: await this.storage.abrirLecturaCondicionada({ referencia: trabajo, etag: metadataTrabajoActual.etag }),
                    mime: intencion.mime_declarado,
                    tamanoEsperado: metadataTrabajoActual.tamanoBytes,
                    claveIdempotencia: claveIdempotenciaDestino,
                    sha256: integridad.sha256,
                });
            }
            catch (error) {
                if (!(error && typeof error === 'object' && 'codigo' in error && error.codigo === 'OBJETO_EXISTENTE'))
                    throw error;
                // Un reintento posterior a una caída de PostgreSQL puede encontrar la clave reservada.
                // Sólo converge si la relectura completa demuestra que contiene exactamente los mismos bytes.
                destinoPreexistente = true;
                metadataDestino = await this.storage.consultarObjeto(destino);
            }
        if (disponible)
            exigirPropiedad(metadataDestino, claveIdempotenciaDestino, 'DESTINO_OCUPADO');
        if (!metadataDestino.etag)
            throw new tipos_1.ErrorDocumental('TOKEN_CONCURRENCIA_NO_DISPONIBLE', 'El objeto conservado no tiene un token de concurrencia', 503);
        // La promoción aprobada se relee y compara por SHA-256. Un rechazo por límite se verifica sólo por HEAD:
        // su hash parcial nunca se persiste como si representara el archivo completo.
        const hashCompleto = !integridad.codigos.includes('TAMANO_SUPERA_LIMITE');
        let promocionIntegra = false;
        if (hashCompleto) {
            const verificacion = await (0, IntegridadContenido_1.validarIntegridadContenido)({ contenido: await this.storage.abrirLecturaCondicionada({ referencia: destino, etag: metadataDestino.etag }), mimeDeclarado: intencion.mime_declarado, tamanoEsperado: metadataTrabajo.tamanoBytes, sha256Esperado: integridad.sha256, politica: { ...politica, maximoBytes: metadataTrabajo.tamanoBytes, mimesPermitidos: politica.mimesPermitidos } });
            promocionIntegra = verificacion.sha256 === integridad.sha256 && verificacion.tamanoBytes === metadataTrabajo.tamanoBytes;
        }
        else {
            promocionIntegra = metadataTrabajoActual.tamanoBytes === metadataTrabajo.tamanoBytes;
        }
        const metadataDestinoFinal = await this.storage.consultarObjeto(destino);
        if (metadataDestinoFinal.tamanoBytes !== metadataDestino.tamanoBytes || metadataDestinoFinal.etag !== metadataDestino.etag)
            promocionIntegra = false;
        if (!promocionIntegra)
            throw new tipos_1.ErrorDocumental(destinoPreexistente ? 'DESTINO_OCUPADO' : 'PROMOCION_NO_INTEGRA', destinoPreexistente ? 'La clave definitiva ya existe con otros bytes' : 'La copia promovida no conserva los bytes originales', destinoPreexistente ? 409 : 502);
        const estado = disponible ? 'DISPONIBLE' : 'CUARENTENA';
        const version = await this.repositorio.registrarVersionYFinalizarIntencion({
            idIntencionPublico: intencion.id_publico,
            revisionIntencion: intencion.revision,
            estadoIntencion: estado,
            codigoError: disponible ? null : (integridad.codigos[0] ?? `ANTIVIRUS_${antivirus.estado}`),
            version: {
                idDocumento: entrada.idDocumento, proveedor: this.configuracion.proveedor, contenedor: destino.contenedor, claveObjeto: destino.clave,
                nombreOriginal: intencion.nombre_declarado, nombreSeguro: nombreSeguro(intencion.nombre_declarado), mimeDeclarado: intencion.mime_declarado,
                mimeDetectado: integridad.mimeDetectado, tamanoBytes: metadataTrabajo.tamanoBytes, sha256: hashCompleto ? integridad.sha256 : null, estado,
                validadoEn: new Date(), resultadoValidaciones: { integridad: integridad.codigos, mimeDeclaradoCoincide: integridad.mimeDeclaradoCoincide, antivirus },
            },
        }, { id: entrada.actor.id });
        return { versionId: version.id_version_documento, estado, integridad, antivirus, idempotente: false };
    }
}
exports.CoordinadorCargaDocumental = CoordinadorCargaDocumental;
//# sourceMappingURL=CoordinadorCargaDocumental.js.map