"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.M9Controller = void 0;
const node_crypto_1 = require("node:crypto");
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const informeAuditoriaPdf_1 = require("../m9/informeAuditoriaPdf");
const exportacionAuditoriaCsv_1 = require("../m9/exportacionAuditoriaCsv");
const observabilidad_1 = require("../m9/observabilidad");
const puertos_1 = require("../m9/puertos");
const RepositorioAuditoriaM9_1 = require("../m9/RepositorioAuditoriaM9");
const fechasFiltroChile_1 = require("../m9/fechasFiltroChile");
const RepositorioRetryM9_1 = require("../m9/RepositorioRetryM9");
const politicas_1 = require("../m9/politicas");
const seguridad_1 = require("../m9/seguridad");
const tipos_1 = require("../m9/tipos");
const materialContenido = (evento) => evento;
const materialIntegridad = (evento) => evento;
const textoOpcional = (valor, maximo) => valor === undefined || valor === null || valor === '' ? null : (0, seguridad_1.textoSeguro)(valor, 'Texto', maximo);
class M9Controller {
    constructor(dependencias = {}) {
        this.repositorio = dependencias.repositorio ?? new RepositorioAuditoriaM9_1.RepositorioAuditoriaM9Prisma();
        this.reloj = dependencias.reloj ?? new puertos_1.RelojSistemaM9();
        this.diagnosticos = dependencias.diagnosticos ?? new puertos_1.DiagnosticosMemoriaM9();
        this.pendientes = dependencias.pendientes ?? new RepositorioRetryM9_1.RepositorioRetryM9Prisma();
        this.retry = dependencias.retry ?? new puertos_1.RetryMemoriaM9();
        this.senales = dependencias.senales ?? new puertos_1.SenalesMemoriaM9();
        this.observabilidad = dependencias.observabilidad ?? new observabilidad_1.ObservabilidadM9();
        this.configuracion = dependencias.configuracion ?? tipos_1.CONFIGURACION_M9;
        this.politicas = dependencias.politicas ?? new politicas_1.MotorPoliticasM9(new politicas_1.RepositorioPoliticasPrismaM9());
    }
    diagnosticar(codigo, entrada) {
        this.diagnosticos.registrar({ codigo, fecha: this.reloj.ahora(), productor: entrada?.productor, identidadLogica: entrada?.identidadLogica });
    }
    async normalizar(entrada, omitirOrden = false) {
        (0, seguridad_1.validarSinSecretos)(entrada);
        if (entrada.capacidad !== 'EMITIR_EVENTO_M9')
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Capacidad técnica insuficiente', 'M9_MINIMO_PRIVILEGIO');
        const identidadLogica = (0, seguridad_1.textoSeguro)(entrada.identidadLogica, 'Identidad lógica', 160);
        const versionContrato = (0, seguridad_1.textoSeguro)(entrada.versionContrato, 'Versión', 20);
        if (!this.configuracion.versionesSoportadas.includes(versionContrato))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Versión de contrato no soportada', 'M9_VERSION_INVALIDA');
        const productor = (0, seguridad_1.textoSeguro)(entrada.productor, 'Productor', 80);
        const modulo = (0, seguridad_1.textoSeguro)(entrada.modulo, 'Módulo', 40);
        const operacion = (0, seguridad_1.textoSeguro)(entrada.operacion, 'Operación', 100);
        if (!entrada.ejecutor || !['HUMANO', 'SISTEMA'].includes(entrada.ejecutor.tipo))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Ejecutor inválido', 'M9_NUCLEO_INCOMPLETO');
        const fechaOcurrencia = (0, seguridad_1.fechaConZona)((0, seguridad_1.textoSeguro)(entrada.ocurridoEn, 'Ocurrencia', 60), (0, seguridad_1.textoSeguro)(entrada.zonaHoraria, 'Zona horaria', 80));
        if (entrada.motivoRequerido && !entrada.motivo?.trim())
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El motivo es obligatorio', 'M9_MOTIVO_REQUERIDO');
        if (entrada.secuencia !== undefined && (!Number.isSafeInteger(entrada.secuencia) || entrada.secuencia < 0))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Secuencia inválida', 'M9_SECUENCIA_INVALIDA');
        if (entrada.eventoOrigenId && entrada.eventoCorrectivoId)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Un evento no puede ser derivado y correctivo simultáneamente', 'M9_REFERENCIA_INVALIDA');
        if (entrada.eventoOrigenId && !await this.repositorio.porId(entrada.eventoOrigenId))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Evento origen inexistente', 'M9_REFERENCIA_INVALIDA');
        if (entrada.eventoCorrectivoId && !await this.repositorio.porId(entrada.eventoCorrectivoId))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Evento original inexistente', 'M9_REFERENCIA_INVALIDA');
        const entidadTipo = entrada.referencia ? (0, seguridad_1.textoSeguro)(entrada.referencia.tipo, 'Tipo de entidad', 80) : null;
        const entidadReferencia = entrada.referencia ? (0, seguridad_1.textoSeguro)(entrada.referencia.id, 'Referencia', 160) : null;
        if (entrada.secuencia !== undefined && !omitirOrden) {
            const ultima = await this.repositorio.ultimaSecuencia(productor, entidadTipo, entidadReferencia);
            if (ultima !== null && entrada.secuencia <= ultima)
                throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Evento fuera de orden', 'M9_EVENTO_FUERA_DE_ORDEN');
        }
        const delta = (0, seguridad_1.deltaMinimo)(entrada.anterior, entrada.nuevo);
        const metadatos = entrada.metadatos ? Object.fromEntries(Object.entries(entrada.metadatos).filter(([clave]) => this.configuracion.metadatosPermitidos.includes(clave))) : null;
        const base = {
            identidadLogica, versionContrato, fechaOcurrencia, zonaHoraria: entrada.zonaHoraria,
            ejecutorTipo: entrada.ejecutor.tipo, ejecutorReferencia: textoOpcional(entrada.ejecutor.referencia, 120),
            productor, modulo, operacion, resultado: (0, seguridad_1.normalizarResultado)(entrada.resultado), entidadTipo, entidadReferencia,
            secuencia: entrada.secuencia ?? null, anterior: delta.anterior, nuevo: delta.nuevo,
            motivo: textoOpcional(entrada.motivo, this.configuracion.maximoTexto), causa: textoOpcional(entrada.causa, this.configuracion.maximoTexto),
            eventoOrigenId: entrada.eventoOrigenId ?? null, eventoCorrectivoId: entrada.eventoCorrectivoId ?? null,
            contextoTerminal: entrada.contextoTerminal === true, eventoPrivacidad: entrada.eventoPrivacidad === true,
            metadatos: Object.keys(metadatos ?? {}).length ? metadatos : null,
        };
        const hashContenido = (0, seguridad_1.hashM9)(materialContenido(base));
        const conPersistencia = { ...base, fechaPersistencia: this.reloj.ahora(), hashContenido };
        return { ...conPersistencia, hashIntegridad: (0, seguridad_1.hashM9)(materialIntegridad(conPersistencia)) };
    }
    async recibir(entrada) {
        const inicio = Date.now();
        this.observabilidad.incrementar('recibidos');
        if (entrada?.productor)
            this.observabilidad.productor(entrada.productor, 'recibidos');
        let normalizado;
        try {
            (0, seguridad_1.validarSinSecretos)(entrada);
            const identidad = (0, seguridad_1.textoSeguro)(entrada.identidadLogica, 'Identidad lógica', 160);
            const existente = await this.repositorio.porIdentidad(identidad);
            normalizado = await this.normalizar(entrada, Boolean(existente));
            if (existente) {
                if (existente.hashContenido !== normalizado.hashContenido)
                    throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Identidad lógica duplicada con contenido distinto', 'M9_DUPLICADO_CONFLICTIVO');
                return { estado: 'PERSISTIDO', evento: this.verificarIntegridad(existente), reintento: true };
            }
        }
        catch (error) {
            this.observabilidad.incrementar('rechazados');
            this.diagnosticar(error instanceof ErrorAplicacion_1.ErrorAplicacion ? error.codigo : 'M9_EVENTO_INVALIDO', entrada);
            throw error;
        }
        finally {
            this.observabilidad.latencia('ingesta', Date.now() - inicio);
        }
        const inicioPersistencia = Date.now();
        try {
            const evento = await this.repositorio.crear(normalizado);
            this.observabilidad.incrementar('persistidos');
            this.observabilidad.productor(normalizado.productor, 'persistidos');
            return { estado: 'PERSISTIDO', evento: this.verificarIntegridad(evento), reintento: false };
        }
        catch {
            this.observabilidad.incrementar('fallosPersistencia');
            this.observabilidad.productor(normalizado.productor, 'fallos');
            this.diagnosticar('M9_FALLO_PERSISTENCIA', entrada);
            if (entrada.critico) {
                this.senales.emitir({ tipo: 'FALLO_CRITICO', productor: normalizado.productor, identidadLogica: normalizado.identidadLogica });
                throw new ErrorAplicacion_1.ErrorAplicacion(503, 'No fue posible confirmar la evidencia crítica', 'M9_FALLO_CRITICO');
            }
            await this.pendientes.guardar({ identidadLogica: normalizado.identidadLogica, versionContrato: normalizado.versionContrato, ocurridoEn: entrada.ocurridoEn, zonaHoraria: normalizado.zonaHoraria, productor: normalizado.productor, modulo: normalizado.modulo, operacion: normalizado.operacion, resultado: normalizado.resultado, creadoEn: this.reloj.ahora(), intentos: 0, evento: normalizado });
            return { estado: 'PENDIENTE', evento: null, reintento: false };
        }
        finally {
            this.observabilidad.latencia('persistencia', Date.now() - inicioPersistencia);
        }
    }
    verificarIntegridad(evento) {
        if (this.estadoIntegridad(evento) === 'COMPROMETIDA')
            throw new ErrorAplicacion_1.ErrorAplicacion(500, 'Integridad de evidencia comprometida', 'M9_INTEGRIDAD_INVALIDA');
        return evento;
    }
    estadoIntegridad(evento) {
        const { id: _id, hashIntegridad, ...sinId } = evento;
        return (0, seguridad_1.hashM9)(materialIntegridad(sinId)) === hashIntegridad ? 'VERIFICADA' : 'COMPROMETIDA';
    }
    verificarScope(scope, filtros) {
        (0, seguridad_1.textoSeguro)(scope?.solicitante, 'Solicitante', 120);
        if (filtros?.modulo && scope.modulos && !scope.modulos.includes(filtros.modulo))
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Módulo fuera del scope', 'M9_SCOPE_DENEGADO');
        if (filtros?.productor && scope.productores && !scope.productores.includes(filtros.productor))
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Productor fuera del scope', 'M9_SCOPE_DENEGADO');
    }
    presentar(evento, scope, integridad = 'VERIFICADA') {
        const ocultarPrivacidad = evento.eventoPrivacidad && !scope.permitirPrivacidad;
        const evidenciaConfiable = integridad === 'VERIFICADA';
        const cambios = evidenciaConfiable && scope.permitirCambios && !ocultarPrivacidad ? { anterior: evento.anterior, nuevo: evento.nuevo } : null;
        const base = {
            id: evento.id, identidadLogica: evento.identidadLogica, versionContrato: evento.versionContrato,
            ocurrencia: evento.fechaOcurrencia.toISOString(), persistencia: evento.fechaPersistencia.toISOString(), zonaHoraria: evento.zonaHoraria,
            ejecutor: ocultarPrivacidad ? { tipo: evento.ejecutorTipo, referencia: '***' } : { tipo: evento.ejecutorTipo, referencia: evento.ejecutorReferencia },
            productor: evento.productor, modulo: evento.modulo, operacion: evento.operacion, resultado: evento.resultado,
            referencia: { tipo: evento.entidadTipo, id: ocultarPrivacidad ? '***' : evento.entidadReferencia },
            cambios, motivo: evidenciaConfiable && scope.permitirMotivos && !ocultarPrivacidad ? evento.motivo : null,
            causa: evidenciaConfiable && scope.permitirMotivos && !ocultarPrivacidad ? evento.causa : null,
            eventoOrigenId: evento.eventoOrigenId, eventoCorrectivoId: evento.eventoCorrectivoId,
            eventoPrivacidad: evento.eventoPrivacidad, integridad,
            advertenciaIntegridad: evidenciaConfiable ? null : 'La evidencia histórica no supera la verificación criptográfica. Su contenido funcional no se presenta como confiable.',
        };
        return (0, seguridad_1.enmascarar)(base, scope.camposOcultos ?? []);
    }
    async proyectarForense(evento) {
        const integridad = this.estadoIntegridad(evento);
        const proyectado = await this.politicas.proyectar(evento);
        return proyectado ? { evento: proyectado, integridad } : null;
    }
    normalizarFiltros(filtros) {
        const pagina = filtros.pagina ?? 1, tamano = filtros.tamano ?? 50;
        if (!Number.isSafeInteger(pagina) || pagina < 1 || !Number.isSafeInteger(tamano) || tamano < 1 || tamano > this.configuracion.maximoPagina)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Paginación inválida', 'M9_FILTRO_INVALIDO');
        try {
            (0, fechasFiltroChile_1.limitesFiltroChile)(filtros);
        }
        catch {
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Rango de fecha inválido', 'M9_FILTRO_INVALIDO');
        }
        return { ...filtros, pagina, tamano };
    }
    async resolverConsulta(filtros, scope) {
        this.verificarScope(scope, filtros);
        const normalizados = this.normalizarFiltros(filtros);
        const todos = await this.repositorio.listarTodo(normalizados, scope.modulos, scope.productores);
        const visibles = (await Promise.all(todos.map(evento => this.proyectarForense(evento)))).filter((evento) => evento !== null);
        const inicio = (normalizados.pagina - 1) * normalizados.tamano, pagina = visibles.slice(inicio, inicio + normalizados.tamano);
        return { total: visibles.length, pagina: normalizados.pagina, tamano: normalizados.tamano, eventos: pagina.map(item => this.presentar(item.evento, scope, item.integridad)) };
    }
    async terminal(operacion, scope, resultado, metadatos) {
        return this.recibir({ identidadLogica: `M9:${operacion}:${(0, node_crypto_1.randomUUID)()}`, versionContrato: '1.0', ocurridoEn: this.reloj.ahora().toISOString(), zonaHoraria: 'UTC', ejecutor: { tipo: 'SISTEMA', referencia: scope.solicitante }, productor: 'M9', modulo: 'M9', operacion, resultado, metadatos, contextoTerminal: true, capacidad: 'EMITIR_EVENTO_M9', critico: true });
    }
    async consultar(filtros, scope) {
        const inicio = Date.now();
        try {
            const resultado = await this.resolverConsulta(filtros, scope);
            await this.terminal('CONSULTA_EVIDENCIA', scope, 'EXITOSO', { correlationId: (0, seguridad_1.hashM9)({ filtros, scope: { modulos: scope.modulos, productores: scope.productores } }) });
            return resultado;
        }
        finally {
            this.observabilidad.latencia('consulta', Date.now() - inicio);
        }
    }
    async detalle(id, scope) {
        this.verificarScope(scope);
        const original = await this.repositorio.porId(id);
        const evaluado = original ? await this.proyectarForense(original) : null;
        const evento = evaluado?.evento ?? null;
        if (!evento || scope.modulos && !scope.modulos.includes(evento.modulo) || scope.productores && !scope.productores.includes(evento.productor))
            throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Evidencia no encontrada', 'M9_NO_ENCONTRADO');
        const origenes = [];
        let cursor = evento;
        while (cursor?.eventoOrigenId) {
            cursor = await this.repositorio.porId(cursor.eventoOrigenId);
            if (cursor)
                origenes.unshift(cursor);
        }
        const derivados = await this.repositorio.relacionados(evento.id, 'origen');
        const correctivos = await this.repositorio.relacionados(evento.id, 'correctivo');
        const dentroScope = (item) => (!scope.modulos || scope.modulos.includes(item.modulo)) && (!scope.productores || scope.productores.includes(item.productor));
        await this.terminal('APERTURA_DETALLE', scope, 'EXITOSO', { correlationId: (0, seguridad_1.hashM9)({ id }) });
        const cadenaProyectada = (await Promise.all([...origenes, original, ...derivados].filter(dentroScope).map(item => this.proyectarForense(item)))).filter((item) => item !== null);
        const correctivosProyectados = (await Promise.all(correctivos.filter(dentroScope).map(item => this.proyectarForense(item)))).filter((item) => item !== null);
        return { evento: this.presentar(evento, scope, evaluado.integridad), cadena: cadenaProyectada.map(item => this.presentar(item.evento, scope, item.integridad)), correctivos: correctivosProyectados.map(item => this.presentar(item.evento, scope, item.integridad)) };
    }
    async exportar(formato, filtros, scope) {
        if (!['CSV', 'PDF'].includes(formato))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Formato de exportación no soportado', 'M9_FORMATO_INVALIDO');
        this.verificarScope(scope, filtros);
        try {
            const normalizados = this.normalizarFiltros(filtros);
            const originales = await this.repositorio.listarTodo(normalizados, scope.modulos, scope.productores);
            const eventos = (await Promise.all(originales.map(evento => this.proyectarForense(evento)))).filter((evento) => evento !== null);
            const congelado = { total: eventos.length, eventos: eventos.map(item => this.presentar(item.evento, scope, item.integridad)) };
            const metadatos = { correlationId: (0, seguridad_1.hashM9)({ filtros, total: congelado.total, formato }) };
            let archivo;
            if (formato === 'CSV') {
                archivo = (0, exportacionAuditoriaCsv_1.archivoAuditoriaM9Csv)(congelado.eventos);
            }
            else {
                archivo = (0, informeAuditoriaPdf_1.crearInformeAuditoriaM9)(congelado.eventos, filtros, scope, this.reloj.ahora());
            }
            await this.terminal('EXPORTACION_EVIDENCIA', scope, 'EXITOSO', metadatos);
            return { ...archivo, total: congelado.total, conjunto: metadatos.correlationId };
        }
        catch (error) {
            this.diagnosticar('M9_EXPORTACION_FALLIDA');
            try {
                await this.terminal('EXPORTACION_EVIDENCIA', scope, 'FALLIDO', { correlationId: (0, seguridad_1.hashM9)({ formato, filtros }) });
            }
            catch { /* el error original conserva prioridad */ }
            throw error;
        }
    }
    async resumenAnalitico(scope) {
        this.verificarScope(scope);
        const resumen = await this.repositorio.resumen(scope.modulos, scope.productores);
        return { estado: 'DISPONIBLE', ...resumen };
    }
    async diagnosticarPendientes(maximoEdadMs) {
        if (!Number.isFinite(maximoEdadMs) || maximoEdadMs < 0)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Umbral externo inválido', 'M9_CONFIG_INVALIDA');
        const ahora = this.reloj.ahora().getTime(), pendientes = await this.pendientes.listar();
        const envejecidos = pendientes.filter(item => ahora - item.creadoEn.getTime() >= maximoEdadMs);
        for (const item of envejecidos)
            this.senales.emitir({ tipo: 'PENDIENTE_ENVEJECIDO', productor: item.productor, identidadLogica: item.identidadLogica });
        return { cantidad: pendientes.length, envejecidos: envejecidos.length, antiguedadMaximaMs: pendientes.length ? Math.max(...pendientes.map(item => ahora - item.creadoEn.getTime())) : null };
    }
    async reintentarPendientes(limite = 50, proximoIntentoEn) {
        if (!Number.isSafeInteger(limite) || limite < 1 || limite > 500)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Límite de retry inválido', 'M9_CONFIG_INVALIDA');
        const ahora = this.reloj.ahora(), pendientes = await this.pendientes.elegibles(ahora, limite);
        let exitosos = 0, fallidos = 0;
        for (const pendiente of pendientes) {
            const leaseHasta = new Date(ahora.getTime() + (this.configuracion.retryLeaseMs ?? tipos_1.CONFIGURACION_M9.retryLeaseMs));
            if (!await this.pendientes.reclamar(pendiente.id, ahora, leaseHasta))
                continue;
            if (!pendiente.evento) {
                await this.pendientes.registrarResultado(pendiente.id, 'FALLIDO', ahora, 'M9_PAYLOAD_PENDIENTE_INVALIDO', proximoIntentoEn);
                fallidos++;
                continue;
            }
            try {
                const existente = await this.repositorio.porIdentidad(pendiente.identidadLogica);
                if (!existente) {
                    const base = { ...pendiente.evento, fechaPersistencia: ahora };
                    const { hashIntegridad: _ignorar, ...material } = base;
                    await this.repositorio.crear({ ...base, hashIntegridad: (0, seguridad_1.hashM9)(materialIntegridad(material)) });
                }
                await this.pendientes.registrarResultado(pendiente.id, 'EXITOSO', ahora);
                exitosos++;
            }
            catch (error) {
                await this.pendientes.registrarResultado(pendiente.id, 'FALLIDO', ahora, error instanceof ErrorAplicacion_1.ErrorAplicacion ? error.codigo : 'M9_RETRY_FALLIDO', proximoIntentoEn);
                fallidos++;
            }
        }
        return { procesados: pendientes.length, exitosos, fallidos };
    }
    async tratarPorPolitica(eventoId, categoriaCodigo, fecha = this.reloj.ahora()) {
        const evento = await this.repositorio.porId(eventoId);
        if (!evento)
            throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Evidencia no encontrada', 'M9_NO_ENCONTRADO');
        const resultado = await this.politicas.tratar(evento, (0, seguridad_1.textoSeguro)(categoriaCodigo, 'Categoría', 100), fecha);
        if (['APLICADO', 'BLOQUEADO'].includes(resultado.estado))
            await this.terminal('TRATAMIENTO_PRIVACIDAD', { solicitante: 'M9-POLICY' }, 'EXITOSO', { correlationId: (0, seguridad_1.hashM9)({ eventoId, politica: resultado.politica?.id, estado: resultado.estado }) });
        return resultado;
    }
    async estadoObservabilidad(maximoEdadMs) {
        const [pending, retry, almacenamiento] = await Promise.all([this.diagnosticarPendientes(maximoEdadMs), this.retry.resumen(), this.repositorio.cantidad()]);
        return { metricas: this.observabilidad.snapshot(), pendientes: pending, retry, almacenamiento: { eventos: almacenamiento }, senales: this.senales.listar(), diagnosticos: this.diagnosticos.listar() };
    }
}
exports.M9Controller = M9Controller;
//# sourceMappingURL=M9Controller.js.map