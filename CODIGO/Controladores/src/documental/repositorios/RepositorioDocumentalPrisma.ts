import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../../db';
import {
  ActorDocumental, AsociarProductoEntrada, CrearDocumentoEntrada, CrearIntencionEntrada,
  ErrorDocumental, EstadoDocumento, EstadoIntencion, EstadoOutbox, EstadoVersion,
  RegistrarEventoDocumentalEntrada, RegistrarVersionEntrada, TipoVariante,
} from '../tipos';
import { exigirTransicionDocumento, exigirTransicionIntencion, exigirTransicionOutbox, exigirTransicionVersion } from '../estados';
import {
  textoRequerido, validarClaveObjeto, validarClaveTemporal, validarContenedor, validarMime,
  validarNombreArchivo, validarSha256, validarTamano,
} from '../validaciones';

type ClienteTx = Prisma.TransactionClient;

const esConflictoUnico = (error: unknown) => error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
const esConflictoSerializable = (error: unknown) => {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false;
  if (error.code === 'P2034') return true;
  // Con driver adapters Prisma encapsula SQLSTATE 40001 como P2010.
  return error.code === 'P2010' && error.message.includes('40001');
};

const jsonPrisma = (valor: Record<string, unknown> | null | undefined): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined =>
  valor === null ? Prisma.JsonNull : valor as Prisma.InputJsonValue | undefined;

export class RepositorioDocumentalPrisma {
  constructor(private readonly cliente: PrismaClient = prisma) {}

  private async transaccionReintentable<T>(accion: (tx: ClienteTx) => Promise<T>, intentos = 3): Promise<T> {
    for (let intento = 1; intento <= intentos; intento += 1) {
      try {
        return await this.cliente.$transaction(accion, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 30000 });
      } catch (error) {
        if (!esConflictoSerializable(error) || intento === intentos) throw error;
      }
    }
    throw new ErrorDocumental('CONCURRENCIA', 'No fue posible completar la operación documental concurrente', 409);
  }

  private async politicaValida(tx: ClienteTx, id: number | null | undefined) {
    if (id === null || id === undefined) return null;
    const politica = await tx.configuracion_conservacion_documental.findUnique({ where: { id_configuracion_conservacion: id } });
    const hoy = new Date(); hoy.setUTCHours(0, 0, 0, 0);
    if (!politica || politica.estado !== 'configurada' || politica.vigencia_desde > hoy || (politica.vigencia_hasta && politica.vigencia_hasta < hoy)) {
      throw new ErrorDocumental('POLITICA_NO_VIGENTE', 'La política descriptiva indicada no está configurada y vigente', 409);
    }
    return politica;
  }

  async crearDocumento(entrada: CrearDocumentoEntrada, actor: ActorDocumental) {
    const titulo = textoRequerido(entrada.titulo, 'Título', 200);
    const clasificacion = textoRequerido(entrada.clasificacion, 'Clasificación', 60).toUpperCase();
    return this.transaccionReintentable(async tx => {
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

  async consultarDocumento(id: bigint) {
    const documento = await this.cliente.documento_logico.findUnique({
      where: { id_documento_logico: id },
      include: { versiones: { orderBy: { numero_version: 'desc' } }, asociaciones_producto: { orderBy: { orden_presentacion: 'asc' } } },
    });
    if (!documento) throw new ErrorDocumental('DOCUMENTO_NO_ENCONTRADO', 'Documento lógico no encontrado', 404);
    return documento;
  }

  async cambiarEstadoDocumento(id: bigint, revision: number, siguiente: EstadoDocumento, motivo?: string) {
    return this.transaccionReintentable(async tx => {
      const actual = await tx.documento_logico.findUnique({ where: { id_documento_logico: id } });
      if (!actual) throw new ErrorDocumental('DOCUMENTO_NO_ENCONTRADO', 'Documento lógico no encontrado', 404);
      exigirTransicionDocumento(actual.estado as EstadoDocumento, siguiente);
      const desactivado = siguiente === 'ACTIVO' ? null : new Date();
      const resultado = await tx.documento_logico.updateMany({
        where: { id_documento_logico: id, revision },
        data: { estado: siguiente, revision: { increment: 1 }, actualizado_en: new Date(), desactivado_en: desactivado, motivo_desactivacion: siguiente === 'ACTIVO' ? null : textoRequerido(motivo, 'Motivo', 2000) },
      });
      if (resultado.count !== 1) throw new ErrorDocumental('REVISION_DESACTUALIZADA', 'El documento cambió concurrentemente', 409);
      return tx.documento_logico.findUniqueOrThrow({ where: { id_documento_logico: id } });
    });
  }

  private intencionCoincide(actual: { clasificacion: string; nombre_declarado: string; mime_declarado: string; tamano_esperado: bigint; clave_temporal: string }, datos: { clasificacion: string; nombre: string; mime: string; tamano: bigint; clave: string }) {
    return actual.clasificacion === datos.clasificacion && actual.nombre_declarado === datos.nombre && actual.mime_declarado === datos.mime && actual.tamano_esperado === datos.tamano && actual.clave_temporal === datos.clave;
  }

  async crearIntencion(entrada: CrearIntencionEntrada, actor: ActorDocumental) {
    const datos = {
      clasificacion: textoRequerido(entrada.clasificacion, 'Clasificación', 60).toUpperCase(),
      nombre: validarNombreArchivo(entrada.nombreDeclarado), mime: validarMime(entrada.mimeDeclarado),
      tamano: validarTamano(entrada.tamanoEsperado), clave: validarClaveTemporal(entrada.claveTemporal),
      idempotencia: textoRequerido(entrada.claveIdempotencia, 'Clave de idempotencia', 160),
    };
    if (!(entrada.expiraEn instanceof Date) || !Number.isFinite(entrada.expiraEn.getTime()) || entrada.expiraEn <= new Date()) throw new ErrorDocumental('EXPIRACION_INVALIDA', 'La intención debe expirar en el futuro');
    const existente = await this.cliente.intencion_carga_documental.findUnique({ where: { usuario_solicitante_clave_idempotencia: { usuario_solicitante: actor.id, clave_idempotencia: datos.idempotencia } } });
    if (existente) {
      if (!this.intencionCoincide(existente, datos)) throw new ErrorDocumental('IDEMPOTENCIA_CONFLICTIVA', 'La clave de idempotencia ya fue usada con otros metadatos', 409);
      return existente;
    }
    try {
      return await this.cliente.intencion_carga_documental.create({ data: {
        usuario_solicitante: actor.id, clasificacion: datos.clasificacion, nombre_declarado: datos.nombre,
        mime_declarado: datos.mime, tamano_esperado: datos.tamano, clave_temporal: datos.clave,
        clave_idempotencia: datos.idempotencia, expira_en: entrada.expiraEn,
      } });
    } catch (error) {
      if (!esConflictoUnico(error)) throw error;
      const concurrente = await this.cliente.intencion_carga_documental.findUnique({ where: { usuario_solicitante_clave_idempotencia: { usuario_solicitante: actor.id, clave_idempotencia: datos.idempotencia } } });
      if (!concurrente || !this.intencionCoincide(concurrente, datos)) throw new ErrorDocumental('IDEMPOTENCIA_CONFLICTIVA', 'Solicitud documental duplicada incompatible', 409);
      return concurrente;
    }
  }

  async consultarIntencion(idPublico: string) {
    const intencion = await this.cliente.intencion_carga_documental.findUnique({ where: { id_publico: idPublico } });
    if (!intencion) throw new ErrorDocumental('INTENCION_NO_ENCONTRADA', 'Intención de carga no encontrada', 404);
    return intencion;
  }

  async cambiarEstadoIntencion(idPublico: string, revision: number, siguiente: EstadoIntencion, opciones: { codigoError?: string | null; confirmadoEn?: Date | null; incrementarReintento?: boolean } = {}) {
    return this.transaccionReintentable(async tx => {
      const actual = await tx.intencion_carga_documental.findUnique({ where: { id_publico: idPublico } });
      if (!actual) throw new ErrorDocumental('INTENCION_NO_ENCONTRADA', 'Intención de carga no encontrada', 404);
      exigirTransicionIntencion(actual.estado as EstadoIntencion, siguiente);
      const cambio = await tx.intencion_carga_documental.updateMany({ where: { id_publico: idPublico, revision }, data: {
        estado: siguiente, revision: { increment: 1 }, codigo_error: opciones.codigoError ? textoRequerido(opciones.codigoError, 'Código de error', 100) : null,
        confirmado_en: siguiente === 'DISPONIBLE' ? opciones.confirmadoEn ?? new Date() : undefined,
        cantidad_reintentos: opciones.incrementarReintento ? { increment: 1 } : undefined,
      } });
      if (cambio.count !== 1) throw new ErrorDocumental('REVISION_DESACTUALIZADA', 'La intención cambió concurrentemente', 409);
      return tx.intencion_carga_documental.findUniqueOrThrow({ where: { id_publico: idPublico } });
    });
  }

  async registrarVersion(entrada: RegistrarVersionEntrada, actor: ActorDocumental) {
    const proveedor = entrada.proveedor;
    const contenedor = validarContenedor(entrada.contenedor);
    const clave = validarClaveObjeto(entrada.claveObjeto);
    const nombreOriginal = validarNombreArchivo(entrada.nombreOriginal, 'Nombre original');
    const nombreSeguro = validarNombreArchivo(entrada.nombreSeguro, 'Nombre seguro');
    const mimeDeclarado = validarMime(entrada.mimeDeclarado);
    const mimeDetectado = entrada.mimeDetectado ? validarMime(entrada.mimeDetectado) : null;
    const tamano = validarTamano(entrada.tamanoBytes);
    const estado = entrada.estado ?? 'PENDIENTE';
    const sha256 = validarSha256(entrada.sha256, estado === 'DISPONIBLE');
    if (estado === 'DISPONIBLE' && (!mimeDetectado || !entrada.validadoEn)) throw new ErrorDocumental('VALIDACION_INCOMPLETA', 'Una versión disponible requiere MIME detectado, hash y fecha de validación');
    return this.transaccionReintentable(async tx => {
      await tx.$queryRaw`SELECT "id_documento_logico" FROM "finanzas"."documento_logico" WHERE "id_documento_logico" = ${entrada.idDocumento} FOR UPDATE`;
      const documento = await tx.documento_logico.findUnique({ where: { id_documento_logico: entrada.idDocumento } });
      if (!documento || documento.estado === 'ARCHIVADO') throw new ErrorDocumental('DOCUMENTO_NO_DISPONIBLE', 'Documento lógico inexistente o archivado', 409);
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

  async cambiarEstadoVersion(id: bigint, revision: number, siguiente: EstadoVersion) {
    return this.transaccionReintentable(async tx => {
      const actual = await tx.version_documento.findUnique({ where: { id_version_documento: id } });
      if (!actual) throw new ErrorDocumental('VERSION_NO_ENCONTRADA', 'Versión documental no encontrada', 404);
      exigirTransicionVersion(actual.estado as EstadoVersion, siguiente);
      const cambio = await tx.version_documento.updateMany({ where: { id_version_documento: id, revision }, data: { estado: siguiente, revision: { increment: 1 } } });
      if (cambio.count !== 1) throw new ErrorDocumental('REVISION_DESACTUALIZADA', 'La versión cambió concurrentemente', 409);
      return tx.version_documento.findUniqueOrThrow({ where: { id_version_documento: id } });
    });
  }

  async registrarVariante(idOriginal: bigint, idDerivada: bigint, tipo: TipoVariante, parametros?: Record<string, unknown> | null) {
    if (idOriginal === idDerivada) throw new ErrorDocumental('VARIANTE_CICLICA', 'Original y derivada deben ser versiones distintas', 409);
    return this.transaccionReintentable(async tx => {
      const versiones = await tx.version_documento.findMany({ where: { id_version_documento: { in: [idOriginal, idDerivada] } } });
      if (versiones.length !== 2) throw new ErrorDocumental('VERSION_NO_ENCONTRADA', 'Original o derivada no existe', 404);
      if (versiones[0]!.id_documento_logico !== versiones[1]!.id_documento_logico) throw new ErrorDocumental('VARIANTE_INCONSISTENTE', 'Original y derivada deben pertenecer al mismo documento lógico', 409);
      return tx.variante_documento.create({ data: { id_version_original: idOriginal, id_version_derivada: idDerivada, tipo_variante: tipo, parametros_tecnicos: jsonPrisma(parametros) } });
    });
  }

  async asociarProducto(entrada: AsociarProductoEntrada, actor: ActorDocumental) {
    const orden = entrada.ordenPresentacion ?? 0;
    if (!Number.isInteger(orden) || orden < 0) throw new ErrorDocumental('ORDEN_INVALIDO', 'El orden de presentación debe ser un entero no negativo');
    if (entrada.esImagenPrincipal && entrada.tipoDocumento !== 'FOTOGRAFIA_COMERCIAL') throw new ErrorDocumental('PRINCIPAL_INVALIDA', 'Sólo una fotografía comercial puede ser imagen principal');
    return this.transaccionReintentable(async tx => {
      const [producto, documento] = await Promise.all([
        tx.extension_producto_comercial.findUnique({ where: { id_extension_producto_comercial: entrada.idProducto } }),
        tx.documento_logico.findUnique({ where: { id_documento_logico: entrada.idDocumento } }),
      ]);
      if (!producto) throw new ErrorDocumental('PRODUCTO_NO_ENCONTRADO', 'Producto comercial no encontrado', 404);
      if (!documento || documento.estado !== 'ACTIVO') throw new ErrorDocumental('DOCUMENTO_NO_DISPONIBLE', 'El documento no existe o no está activo', 409);
      const asociacion = await tx.producto_comercial_documento.create({ data: {
        id_extension_producto_comercial: entrada.idProducto, id_documento_logico: entrada.idDocumento,
        tipo_documento: entrada.tipoDocumento, orden_presentacion: orden, es_imagen_principal: entrada.esImagenPrincipal ?? false,
        habilitado_b2b: entrada.habilitadoB2b ?? false, habilitado_b2c: entrada.habilitadoB2c ?? false, usuario_responsable: actor.id,
      } });
      await tx.evento_operacional_documental.create({ data: {
        tipo_evento: 'DOCUMENTO_ASOCIADO_PRODUCTO', id_documento_logico: entrada.idDocumento,
        clave_idempotencia: `producto:${entrada.idProducto}:documento:${entrada.idDocumento}:${entrada.tipoDocumento}`,
        payload_tecnico: { idProducto: entrada.idProducto, tipoDocumento: entrada.tipoDocumento },
      } });
      return asociacion;
    });
  }

  async listarAsociacionesProducto(idProducto: number) {
    return this.cliente.producto_comercial_documento.findMany({ where: { id_extension_producto_comercial: idProducto }, include: { documento: { include: { versiones: { orderBy: { numero_version: 'desc' } } } } }, orderBy: [{ orden_presentacion: 'asc' }, { asociado_en: 'asc' }] });
  }

  async registrarEvento(entrada: RegistrarEventoDocumentalEntrada) {
    const tipo = textoRequerido(entrada.tipoEvento, 'Tipo de evento', 80).toUpperCase();
    const clave = textoRequerido(entrada.claveIdempotencia, 'Clave de idempotencia', 180);
    try {
      return await this.cliente.evento_operacional_documental.create({ data: {
        tipo_evento: tipo, clave_idempotencia: clave, id_documento_logico: entrada.idDocumento ?? null,
        id_version_documento: entrada.idVersion ?? null, payload_tecnico: jsonPrisma(entrada.payloadTecnico), proximo_intento_en: entrada.proximoIntentoEn ?? null,
      } });
    } catch (error) {
      if (!esConflictoUnico(error)) throw error;
      return this.cliente.evento_operacional_documental.findUniqueOrThrow({ where: { clave_idempotencia: clave } });
    }
  }

  async cambiarEstadoEvento(id: bigint, siguiente: EstadoOutbox, codigoError?: string | null) {
    return this.transaccionReintentable(async tx => {
      const actual = await tx.evento_operacional_documental.findUnique({ where: { id_evento_operacional: id } });
      if (!actual) throw new ErrorDocumental('EVENTO_NO_ENCONTRADO', 'Evento operacional no encontrado', 404);
      exigirTransicionOutbox(actual.estado as EstadoOutbox, siguiente);
      return tx.evento_operacional_documental.update({ where: { id_evento_operacional: id }, data: {
        estado: siguiente, cantidad_intentos: siguiente === 'PROCESANDO' ? { increment: 1 } : undefined,
        procesado_en: siguiente === 'PROCESADO' ? new Date() : null,
        codigo_error: codigoError ? textoRequerido(codigoError, 'Código de error', 100) : null,
      } });
    });
  }
}
