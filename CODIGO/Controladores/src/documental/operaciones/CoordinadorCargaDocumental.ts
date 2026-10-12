import type { StorageAdapter, ReferenciaObjetoStorage } from '../StorageAdapter';
import type { ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';
import type { AntivirusAdapter, ResultadoAntivirus } from '../seguridad/AntivirusAdapter';
import { validarIntegridadContenido, type PoliticaTecnicaContenido, type ResultadoIntegridadContenido } from '../seguridad/IntegridadContenido';
import { ErrorDocumental, type EstadoIntencion, type RegistrarVersionEntrada } from '../tipos';

export interface IntencionConfirmable {
  id_publico: string;
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
  consultarVersionPorObjeto(proveedor: string, contenedor: string, clave: string): Promise<{ id_version_documento: bigint; estado: string } | null>;
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
    let intencion = await this.repositorio.consultarIntencion(entrada.idIntencion);
    if (intencion.usuario_solicitante !== entrada.actor.id) throw new ErrorDocumental('ACTOR_NO_COINCIDE', 'La intención pertenece a otro actor', 403);
    await this.autorizarConfirmacion({ actor: entrada.actor, idDocumento: entrada.idDocumento, clasificacion: intencion.clasificacion, usuarioSolicitante: intencion.usuario_solicitante });
    if (intencion.expira_en <= new Date()) throw new ErrorDocumental('INTENCION_EXPIRADA', 'La intención de carga expiró', 409);
    const politica = this.configuracion.politicasPorClasificacion[intencion.clasificacion];
    if (!politica) throw new ErrorDocumental('POLITICA_TECNICA_NO_CONFIGURADA', 'No existe una política técnica aprobada para esta clasificación', 503);

    const claveDisponible = `${this.configuracion.prefijoDisponible}/${intencion.id_publico}`;
    const claveCuarentena = `${this.configuracion.prefijoCuarentena}/${intencion.id_publico}`;
    const existente = await this.repositorio.consultarVersionPorObjeto(this.configuracion.proveedor, this.configuracion.contenedorDefinitivo, claveDisponible)
      ?? await this.repositorio.consultarVersionPorObjeto(this.configuracion.proveedor, this.configuracion.contenedorDefinitivo, claveCuarentena);
    if (existente) return { versionId: existente.id_version_documento, estado: existente.estado as 'DISPONIBLE' | 'CUARENTENA', integridad: {} as ResultadoIntegridadContenido, antivirus: { estado: existente.estado === 'DISPONIBLE' ? 'LIMPIO' : 'NO_DISPONIBLE' }, idempotente: true };

    if (intencion.estado === 'PENDIENTE') intencion = await this.repositorio.cambiarEstadoIntencion(intencion.id_publico, intencion.revision, 'SUBIENDO');
    if (intencion.estado === 'SUBIENDO') intencion = await this.repositorio.cambiarEstadoIntencion(intencion.id_publico, intencion.revision, 'VALIDANDO');
    if (intencion.estado !== 'VALIDANDO') throw new ErrorDocumental('INTENCION_NO_CONFIRMABLE', `La intención está en estado ${intencion.estado}`, 409);

    const origen: ReferenciaObjetoStorage = { contenedor: this.configuracion.contenedorTemporal, clave: intencion.clave_temporal };
    const metadata = await this.storage.consultarObjeto(origen);
    if (metadata.tamanoBytes !== intencion.tamano_esperado) throw new ErrorDocumental('TAMANO_STORAGE_NO_COINCIDE', 'El tamaño almacenado no coincide con la intención', 409);
    const integridad = await validarIntegridadContenido({ contenido: await this.storage.abrirLectura(origen), mimeDeclarado: intencion.mime_declarado, tamanoEsperado: intencion.tamano_esperado, sha256Esperado: entrada.sha256Esperado, politica });
    let antivirus: ResultadoAntivirus = { estado: 'ARCHIVO_NO_SOPORTADO', codigo: 'INTEGRIDAD_RECHAZADA' };
    if (integridad.valido) antivirus = await this.antivirus.escanear(await this.storage.abrirLectura(origen));
    const disponible = integridad.valido && antivirus.estado === 'LIMPIO';
    const claveDestino = disponible ? claveDisponible : claveCuarentena;
    const destino: ReferenciaObjetoStorage = { contenedor: this.configuracion.contenedorDefinitivo, clave: claveDestino };
    let destinoYaExiste = false;
    try {
      await this.storage.consultarObjeto(destino);
      destinoYaExiste = true;
    } catch (error) {
      if (!(error && typeof error === 'object' && 'codigo' in error && error.codigo === 'NO_ENCONTRADO')) throw error;
    }
    if (!destinoYaExiste) await this.storage.copiarObjeto({ origen, destino, claveIdempotencia: `promocion:${intencion.id_publico}:${disponible ? 'ok' : 'cuarentena'}` });

    // La promoción aprobada se relee y compara por SHA-256. Un rechazo por límite se verifica sólo por HEAD:
    // su hash parcial nunca se persiste como si representara el archivo completo.
    const hashCompleto = !integridad.codigos.includes('TAMANO_SUPERA_LIMITE');
    let promocionIntegra = false;
    if (hashCompleto) {
      const verificacion = await validarIntegridadContenido({ contenido: await this.storage.abrirLectura(destino), mimeDeclarado: intencion.mime_declarado, tamanoEsperado: metadata.tamanoBytes, sha256Esperado: integridad.sha256, politica: { ...politica, maximoBytes: metadata.tamanoBytes, mimesPermitidos: politica.mimesPermitidos } });
      promocionIntegra = verificacion.sha256 === integridad.sha256 && verificacion.tamanoBytes === metadata.tamanoBytes;
    } else {
      promocionIntegra = (await this.storage.consultarObjeto(destino)).tamanoBytes === metadata.tamanoBytes;
    }
    if (!promocionIntegra) throw new ErrorDocumental(destinoYaExiste ? 'DESTINO_OCUPADO' : 'PROMOCION_NO_INTEGRA', destinoYaExiste ? 'La clave definitiva ya existe con otros bytes' : 'La copia promovida no conserva los bytes originales', destinoYaExiste ? 409 : 502);

    const estado = disponible ? 'DISPONIBLE' : 'CUARENTENA';
    const version = await this.repositorio.registrarVersionYFinalizarIntencion({
      idIntencionPublico: intencion.id_publico,
      revisionIntencion: intencion.revision,
      estadoIntencion: estado,
      codigoError: disponible ? null : (integridad.codigos[0] ?? `ANTIVIRUS_${antivirus.estado}`),
      version: {
        idDocumento: entrada.idDocumento, proveedor: this.configuracion.proveedor, contenedor: destino.contenedor, claveObjeto: destino.clave,
        nombreOriginal: intencion.nombre_declarado, nombreSeguro: nombreSeguro(intencion.nombre_declarado), mimeDeclarado: intencion.mime_declarado,
        mimeDetectado: integridad.mimeDetectado, tamanoBytes: metadata.tamanoBytes, sha256: hashCompleto ? integridad.sha256 : null, estado,
        validadoEn: new Date(), resultadoValidaciones: { integridad: integridad.codigos, mimeDeclaradoCoincide: integridad.mimeDeclaradoCoincide, antivirus },
      },
    }, { id: entrada.actor.id });
    return { versionId: version.id_version_documento, estado, integridad, antivirus, idempotente: false };
  }
}
