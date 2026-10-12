import type { StorageAdapter, ReferenciaObjetoStorage, IntegridadStorage } from '../StorageAdapter';
import type { ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';
import { escanearConIntegridad, type AntivirusAdapter, type ResultadoAntivirus } from '../seguridad/AntivirusAdapter';
import { validarIntegridadContenido, type PoliticaTecnicaContenido, type ResultadoIntegridadContenido } from '../seguridad/IntegridadContenido';
import { ErrorDocumental, type EstadoIntencion, type RegistrarVersionEntrada } from '../tipos';

export interface IntencionConfirmable {
  id_publico: string;
  id_documento_logico: bigint | null;
  usuario_solicitante: bigint;
  clasificacion: string;
  nombre_declarado: string;
  mime_declarado: string;
  tamano_esperado: bigint;
  clave_temporal: string;
  estado: string;
  revision: number;
  expira_en: Date;
}

export interface RepositorioConfirmacionDocumental {
  consultarIntencion(idPublico: string): Promise<IntencionConfirmable>;
  cambiarEstadoIntencion(idPublico: string, revision: number, siguiente: EstadoIntencion, opciones?: { codigoError?: string | null; confirmadoEn?: Date | null; incrementarReintento?: boolean }): Promise<IntencionConfirmable>;
  consultarVersionPorObjeto(proveedor: string, contenedor: string, clave: string): Promise<{ id_version_documento: bigint; id_documento_logico: bigint; estado: string; tamano_bytes: bigint; sha256: string | null; mime_detectado: string | null; resultado_validaciones: unknown } | null>;
  registrarVersionYFinalizarIntencion(entrada: { idIntencionPublico: string; revisionIntencion: number; version: RegistrarVersionEntrada; estadoIntencion: 'DISPONIBLE' | 'CUARENTENA'; codigoError?: string | null }, actor: { id: bigint }): Promise<{ id_version_documento: bigint; estado: string }>;
}

export interface ConfiguracionCoordinadorDocumental {
  proveedor: 'R2' | 'S3';
  contenedorTemporal: string;
  contenedorDefinitivo: string;
  prefijoDisponible: string;
  prefijoCuarentena: string;
  politicasPorClasificacion: Readonly<Record<string, PoliticaTecnicaContenido>>;
}

export interface ResultadoConfirmacionDocumental {
  versionId: bigint;
  estado: 'DISPONIBLE' | 'CUARENTENA';
  integridad: ResultadoIntegridadContenido;
  antivirus: ResultadoAntivirus;
  idempotente: boolean;
}

const nombreSeguro = (nombre: string) => nombre.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '_').slice(0, 180) || 'documento';

/** Orquesta storage y PostgreSQL sin fingir atomicidad distribuida: claves deterministas + reintento recuperable. */
export class CoordinadorCargaDocumental {
  constructor(
    private readonly repositorio: RepositorioConfirmacionDocumental,
    private readonly storage: StorageAdapter,
    private readonly antivirus: AntivirusAdapter,
    private readonly autorizarConfirmacion: (entrada: { actor: ActorBackendDocumental; idDocumento: bigint; clasificacion: string; usuarioSolicitante: bigint }) => Promise<void>,
    private readonly configuracion: ConfiguracionCoordinadorDocumental,
  ) {}

  async confirmar(entrada: { idIntencion: string; idDocumento: bigint; actor: ActorBackendDocumental; sha256Esperado?: string }): Promise<ResultadoConfirmacionDocumental> {
    if (!this.storage.abrirLectura || !this.storage.copiarObjeto) throw new ErrorDocumental('STORAGE_SIN_CAPACIDAD', 'El proveedor no permite validar y promover contenido', 503);
    if (!this.storage.capacidades.copiaCondicionalDestino) throw new ErrorDocumental('PROMOCION_CONDICIONAL_NO_VALIDADA', 'La activación permanece bloqueada: el proveedor no garantiza una creación condicional del destino', 503);
    if (this.storage.proveedor !== this.configuracion.proveedor) throw new ErrorDocumental('PROVEEDOR_NO_COINCIDE', 'El proveedor configurado no corresponde al adaptador activo', 503);
    let intencion = await this.repositorio.consultarIntencion(entrada.idIntencion);
    if (intencion.usuario_solicitante !== entrada.actor.id) throw new ErrorDocumental('ACTOR_NO_COINCIDE', 'La intención pertenece a otro actor', 403);
    if (intencion.id_documento_logico === null) throw new ErrorDocumental('INTENCION_LEGACY_NO_CONFIRMABLE', 'La intención no está vinculada a un documento', 409);
    if (intencion.id_documento_logico !== entrada.idDocumento) throw new ErrorDocumental('INTENCION_DOCUMENTO_NO_COINCIDE', 'La intención no pertenece al documento solicitado', 409);
    await this.autorizarConfirmacion({ actor: entrada.actor, idDocumento: intencion.id_documento_logico, clasificacion: intencion.clasificacion, usuarioSolicitante: intencion.usuario_solicitante });
    if (intencion.expira_en <= new Date()) throw new ErrorDocumental('INTENCION_EXPIRADA', 'La intención de carga expiró', 409);
    const politica = this.configuracion.politicasPorClasificacion[intencion.clasificacion];
    if (!politica) throw new ErrorDocumental('POLITICA_TECNICA_NO_CONFIGURADA', 'No existe una política técnica aprobada para esta clasificación', 503);

    const claveDisponible = `${this.configuracion.prefijoDisponible}/${intencion.id_publico}`;
    const claveCuarentena = `${this.configuracion.prefijoCuarentena}/${intencion.id_publico}`;
    const existente = await this.repositorio.consultarVersionPorObjeto(this.configuracion.proveedor, this.configuracion.contenedorDefinitivo, claveDisponible)
      ?? await this.repositorio.consultarVersionPorObjeto(this.configuracion.proveedor, this.configuracion.contenedorDefinitivo, claveCuarentena);
    if (existente) {
      if (existente.id_documento_logico !== entrada.idDocumento || !['DISPONIBLE', 'CUARENTENA'].includes(existente.estado)) throw new ErrorDocumental('VERSION_IDEMPOTENTE_INCONSISTENTE', 'La versión recuperada no corresponde a la intención', 409);
      const validaciones = existente.resultado_validaciones as { integridad?: string[]; mimeDeclaradoCoincide?: boolean; antivirus?: ResultadoAntivirus } | null;
      return { versionId: existente.id_version_documento, estado: existente.estado as 'DISPONIBLE' | 'CUARENTENA', integridad: { valido: (validaciones?.integridad?.length ?? 1) === 0, tamanoBytes: existente.tamano_bytes, sha256: existente.sha256 ?? '', mimeDetectado: existente.mime_detectado as ResultadoIntegridadContenido['mimeDetectado'], mimeDeclaradoCoincide: validaciones?.mimeDeclaradoCoincide === true, codigos: validaciones?.integridad ?? ['VALIDACION_NO_RECUPERABLE'] }, antivirus: validaciones?.antivirus ?? { estado: 'NO_DISPONIBLE' }, idempotente: true };
    }

    if (intencion.estado === 'PENDIENTE') intencion = await this.repositorio.cambiarEstadoIntencion(intencion.id_publico, intencion.revision, 'SUBIENDO');
    if (intencion.estado === 'SUBIENDO') intencion = await this.repositorio.cambiarEstadoIntencion(intencion.id_publico, intencion.revision, 'VALIDANDO');
    if (intencion.estado !== 'VALIDANDO') throw new ErrorDocumental('INTENCION_NO_CONFIRMABLE', `La intención está en estado ${intencion.estado}`, 409);

    const temporal: ReferenciaObjetoStorage = { contenedor: this.configuracion.contenedorTemporal, clave: intencion.clave_temporal };
    const trabajo: ReferenciaObjetoStorage = { contenedor: this.configuracion.contenedorDefinitivo, clave: claveCuarentena };
    let metadataTrabajo: IntegridadStorage;
    try { metadataTrabajo = await this.storage.consultarObjeto(trabajo); }
    catch (error) {
      if (!(error && typeof error === 'object' && 'codigo' in error && error.codigo === 'NO_ENCONTRADO')) throw error;
      const metadataTemporal = await this.storage.consultarObjeto(temporal);
      if (metadataTemporal.tamanoBytes !== intencion.tamano_esperado) throw new ErrorDocumental('TAMANO_STORAGE_NO_COINCIDE', 'El tamaño almacenado no coincide con la intención', 409);
      if (!metadataTemporal.etag) throw new ErrorDocumental('TOKEN_CONCURRENCIA_NO_DISPONIBLE', 'El proveedor no entregó un token para congelar la carga temporal', 503);
      metadataTrabajo = await this.storage.copiarObjeto({ origen: temporal, destino: trabajo, claveIdempotencia: `trabajo:${intencion.id_publico}`, etagOrigen: metadataTemporal.etag });
    }
    if (metadataTrabajo.tamanoBytes !== intencion.tamano_esperado) throw new ErrorDocumental('COPIA_TRABAJO_INCONSISTENTE', 'La copia de trabajo no conserva el tamaño esperado', 409);
    const integridad = await validarIntegridadContenido({ contenido: await this.storage.abrirLectura(trabajo), mimeDeclarado: intencion.mime_declarado, tamanoEsperado: intencion.tamano_esperado, sha256Esperado: entrada.sha256Esperado, politica });
    let antivirus: ResultadoAntivirus = { estado: 'ARCHIVO_NO_SOPORTADO', codigo: 'INTEGRIDAD_RECHAZADA' };
    if (integridad.valido) {
      const escaneo = await escanearConIntegridad(this.antivirus, await this.storage.abrirLectura(trabajo));
      antivirus = escaneo.resultado;
      if (!escaneo.completo || escaneo.sha256 !== integridad.sha256 || escaneo.tamanoBytes !== integridad.tamanoBytes) antivirus = { estado: 'ERROR_ESCANEO', motor: this.antivirus.nombre, codigo: 'BYTES_ESCANEADOS_NO_COINCIDEN' };
    }
    const disponible = integridad.valido && antivirus.estado === 'LIMPIO';
    const destino: ReferenciaObjetoStorage = { contenedor: this.configuracion.contenedorDefinitivo, clave: disponible ? claveDisponible : claveCuarentena };
    const metadataTrabajoActual = await this.storage.consultarObjeto(trabajo);
    if (metadataTrabajoActual.tamanoBytes !== metadataTrabajo.tamanoBytes || (metadataTrabajo.etag && metadataTrabajoActual.etag !== metadataTrabajo.etag)) throw new ErrorDocumental('COPIA_TRABAJO_MODIFICADA', 'La copia de trabajo cambió durante la validación', 409);
    if (disponible && !metadataTrabajoActual.etag) throw new ErrorDocumental('TOKEN_CONCURRENCIA_NO_DISPONIBLE', 'El proveedor no entregó un token para promover de forma segura', 503);
    let destinoPreexistente = false;
    if (disponible) try {
      await this.storage.copiarObjeto({ origen: trabajo, destino, claveIdempotencia: `promocion:${intencion.id_publico}`, etagOrigen: metadataTrabajoActual.etag, exigirDestinoAusente: true });
    } catch (error) {
      if (!(error && typeof error === 'object' && 'codigo' in error && error.codigo === 'CONFLICTO')) throw error;
      // Un reintento posterior a una caída de PostgreSQL puede encontrar la clave reservada.
      // Sólo converge si la relectura completa demuestra que contiene exactamente los mismos bytes.
      destinoPreexistente = true;
    }

    // La promoción aprobada se relee y compara por SHA-256. Un rechazo por límite se verifica sólo por HEAD:
    // su hash parcial nunca se persiste como si representara el archivo completo.
    const hashCompleto = !integridad.codigos.includes('TAMANO_SUPERA_LIMITE');
    let promocionIntegra = false;
    if (hashCompleto) {
      const verificacion = await validarIntegridadContenido({ contenido: await this.storage.abrirLectura(destino), mimeDeclarado: intencion.mime_declarado, tamanoEsperado: metadataTrabajo.tamanoBytes, sha256Esperado: integridad.sha256, politica: { ...politica, maximoBytes: metadataTrabajo.tamanoBytes, mimesPermitidos: politica.mimesPermitidos } });
      promocionIntegra = verificacion.sha256 === integridad.sha256 && verificacion.tamanoBytes === metadataTrabajo.tamanoBytes;
    } else {
      promocionIntegra = metadataTrabajoActual.tamanoBytes === metadataTrabajo.tamanoBytes;
    }
    if (!promocionIntegra) throw new ErrorDocumental(destinoPreexistente ? 'DESTINO_OCUPADO' : 'PROMOCION_NO_INTEGRA', destinoPreexistente ? 'La clave definitiva ya existe con otros bytes' : 'La copia promovida no conserva los bytes originales', destinoPreexistente ? 409 : 502);

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
