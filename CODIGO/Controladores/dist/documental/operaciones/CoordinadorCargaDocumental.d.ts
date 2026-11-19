import type { StorageAdapter } from '../StorageAdapter';
import type { ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';
import { type AntivirusAdapter, type ResultadoAntivirus } from '../seguridad/AntivirusAdapter';
import { type PoliticaTecnicaContenido, type ResultadoIntegridadContenido } from '../seguridad/IntegridadContenido';
import { type EstadoIntencion, type RegistrarVersionEntrada } from '../tipos';
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
    cambiarEstadoIntencion(idPublico: string, revision: number, siguiente: EstadoIntencion, opciones?: {
        codigoError?: string | null;
        confirmadoEn?: Date | null;
        incrementarReintento?: boolean;
    }): Promise<IntencionConfirmable>;
    consultarVersionPorObjeto(proveedor: string, contenedor: string, clave: string): Promise<{
        id_version_documento: bigint;
        id_documento_logico: bigint;
        estado: string;
        tamano_bytes: bigint;
        sha256: string | null;
        mime_detectado: string | null;
        resultado_validaciones: unknown;
    } | null>;
    registrarVersionYFinalizarIntencion(entrada: {
        idIntencionPublico: string;
        revisionIntencion: number;
        version: RegistrarVersionEntrada;
        estadoIntencion: 'DISPONIBLE' | 'CUARENTENA';
        codigoError?: string | null;
    }, actor: {
        id: bigint;
    }): Promise<{
        id_version_documento: bigint;
        estado: string;
    }>;
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
/** Orquesta storage y PostgreSQL sin fingir atomicidad distribuida: claves deterministas + reintento recuperable. */
export declare class CoordinadorCargaDocumental {
    private readonly repositorio;
    private readonly storage;
    private readonly antivirus;
    private readonly autorizarConfirmacion;
    private readonly configuracion;
    constructor(repositorio: RepositorioConfirmacionDocumental, storage: StorageAdapter, antivirus: AntivirusAdapter, autorizarConfirmacion: (entrada: {
        actor: ActorBackendDocumental;
        idDocumento: bigint;
        clasificacion: string;
        usuarioSolicitante: bigint;
    }) => Promise<void>, configuracion: ConfiguracionCoordinadorDocumental);
    confirmar(entrada: {
        idIntencion: string;
        idDocumento: bigint;
        actor: ActorBackendDocumental;
        sha256Esperado?: string;
    }): Promise<ResultadoConfirmacionDocumental>;
}
//# sourceMappingURL=CoordinadorCargaDocumental.d.ts.map