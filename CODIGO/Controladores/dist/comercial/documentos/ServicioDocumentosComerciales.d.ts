import { Prisma, PrismaClient } from '@prisma/client';
import { type AntivirusAdapter } from '../../documental/seguridad/AntivirusAdapter';
import type { StorageAdapter } from '../../documental/StorageAdapter';
import { type SnapshotDocumentoComercial } from './MotorPdfComercial';
type Json = Record<string, unknown>;
type ActorComercial = {
    id: bigint;
    permisos?: readonly string[];
};
type DependenciasDocumentales = {
    cliente?: PrismaClient;
    storage?: StorageAdapter;
    antivirus?: AntivirusAdapter;
    entorno?: NodeJS.ProcessEnv;
    ahora?: () => Date;
};
export declare class ServicioDocumentosComerciales {
    private readonly dependencias;
    private readonly cliente;
    private readonly entorno;
    private readonly ahora;
    constructor(dependencias?: DependenciasDocumentales);
    private modoPostgres;
    private storage;
    private antivirus;
    private modoPersonal;
    private contenedorStorage;
    estadoInfraestructura(): Promise<{
        motorPdf: string;
        almacenamientoPrivado: string;
        antivirus: string;
        plantillasPublicadas: {
            B2B: boolean;
            B2C: boolean;
        };
        modo: string;
        emisionDefinitiva: string;
        motivo: string;
    }>;
    listarPlantillas(): Promise<{
        capacidadEdicion: string;
        capacidadPublicacion: string;
        plantillas: {
            id: string;
            codigo: string;
            nombre: string;
            tipo: string;
            segmento: string;
            estado: string;
            revision: number;
            versiones: {
                id: string;
                numero: number;
                estado: string;
                esquema: Prisma.JsonValue;
                condicionVersionId: string | null;
                motivo: string;
                publicadoEn: string | null;
            }[];
        }[];
    }>;
    listarCartasB2C(): Promise<{
        capacidadEdicion: string;
        capacidadPublicacion: string;
        cartas: {
            id: string;
            codigo: string;
            titulo: string;
            contenidoBorrador: Prisma.JsonValue;
            estado: string;
            revision: number;
            actualizadoEn: string;
            versiones: {
                id: string;
                numero: number;
                estadoDocumental: string;
                documentoId: string | null;
                creadoEn: string;
                confirmadoEn: string | null;
                productos: number;
                fotografias: number;
                plantillaVersion: number;
            }[];
        }[];
    }>;
    previsualizarCotizacion(idCotizacion: number): Promise<{
        nombre: string;
        mime: string;
        contenido: string;
        sha256: string;
        tamanoBytes: number;
        paginas: number;
        estado: string;
        snapshot: SnapshotDocumentoComercial;
    }>;
    previsualizarCartaB2C(idCarta: bigint): Promise<{
        nombre: string;
        mime: string;
        contenido: string;
        sha256: string;
        tamanoBytes: number;
        paginas: number;
        estado: string;
        snapshot: SnapshotDocumentoComercial;
    }>;
    crearPlantilla(entrada: Json, actor: ActorComercial): Promise<{
        versiones: {
            estado: string;
            id_condicion_comercial_version: bigint | null;
            motivo: string;
            numero_version: number;
            publicado_por: bigint | null;
            publicado_en: Date | null;
            id_plantilla_documental: bigint;
            id_plantilla_documental_version: bigint;
            esquema_contenido: Prisma.JsonValue;
        }[];
    } & {
        codigo: string;
        estado: string;
        tipo_documento: string;
        revision: number;
        actualizado_en: Date;
        creado_por: bigint;
        nombre: string;
        creado_en: Date;
        segmento: string;
        id_plantilla_documental: bigint;
    }>;
    editarPlantilla(id: bigint, entrada: Json, actor: ActorComercial): Promise<{
        versiones: {
            estado: string;
            id_condicion_comercial_version: bigint | null;
            motivo: string;
            numero_version: number;
            publicado_por: bigint | null;
            publicado_en: Date | null;
            id_plantilla_documental: bigint;
            id_plantilla_documental_version: bigint;
            esquema_contenido: Prisma.JsonValue;
        }[];
    } & {
        codigo: string;
        estado: string;
        tipo_documento: string;
        revision: number;
        actualizado_en: Date;
        creado_por: bigint;
        nombre: string;
        creado_en: Date;
        segmento: string;
        id_plantilla_documental: bigint;
    }>;
    publicarPlantilla(id: bigint, entrada: Json, actor: ActorComercial): Promise<{
        estado: string;
        id_condicion_comercial_version: bigint | null;
        motivo: string;
        numero_version: number;
        publicado_por: bigint | null;
        publicado_en: Date | null;
        id_plantilla_documental: bigint;
        id_plantilla_documental_version: bigint;
        esquema_contenido: Prisma.JsonValue;
    }>;
    crearCartaB2C(entrada: Json, actor: ActorComercial): Promise<{
        codigo: string;
        estado: string;
        titulo: string;
        revision: number;
        actualizado_en: Date;
        creado_por: bigint;
        creado_en: Date;
        id_carta_comercial_b2c: bigint;
        contenido_borrador: Prisma.JsonValue;
    }>;
    editarCartaB2C(id: bigint, entrada: Json, _actor: ActorComercial): Promise<{
        codigo: string;
        estado: string;
        titulo: string;
        revision: number;
        actualizado_en: Date;
        creado_por: bigint;
        creado_en: Date;
        id_carta_comercial_b2c: bigint;
        contenido_borrador: Prisma.JsonValue;
    }>;
    private almacenarPdf;
    private limpiarObjetoNoConfirmado;
    publicarCartaB2C(idCarta: bigint, entrada: Json, actor: ActorComercial): Promise<{
        id_condicion_comercial_version: bigint | null;
        motivo: string;
        numero_version: number;
        creado_en: Date;
        clave_idempotencia: string;
        confirmado_en: Date | null;
        estado_documental: string;
        publicado_por: bigint;
        id_documento_logico: bigint | null;
        id_plantilla_documental_version: bigint;
        id_carta_comercial_b2c: bigint;
        id_carta_comercial_b2c_version: bigint;
        snapshot_publicacion: Prisma.JsonValue;
    }>;
    emitirCotizacion(idCotizacion: number, entrada: Json, actor: ActorComercial): Promise<{
        id_cotizacion: number;
        snapshot_comercial: Prisma.JsonValue | null;
        motivo: string;
        tipo_version: string | null;
        usuario_id_usuario: bigint | null;
        fecha: Date;
        clave_idempotencia: string | null;
        estado_documental: string | null;
        id_documento_logico: bigint | null;
        id_cotizacion_version: number;
        antecedentes: Prisma.JsonValue;
        numero_version_comercial: number | null;
    }>;
    prepararEmisionCotizacion(idCotizacion: number): Promise<void>;
    historialCotizacion(idCotizacion: number): Promise<{
        idVersion: number;
        numeroVersion: number | null;
        fechaEmision: Date;
        estadoDocumental: string | null;
        documento: {
            estado: string;
            archivo: {
                numeroVersion: number;
                estado: string;
                nombre: string;
                mime: string | null;
                tamanoBytes: bigint;
                sha256: string | null;
                creadoEn: Date;
                validadoEn: Date | null;
            } | null;
        } | null;
    }[]>;
    recuperarDocumentoCarta(idCarta: bigint, idVersion: bigint): Promise<{
        nombre: string;
        mime: string | null;
        contenido: string;
        sha256: string;
        tamanoBytes: number;
        numeroVersion: number;
        fecha: string;
    }>;
    recuperarDocumentoCotizacion(idCotizacion: number, idVersion: number): Promise<{
        nombre: string;
        mime: string | null;
        contenido: string;
        sha256: string;
        tamanoBytes: number;
        numeroVersion: number | null;
        fecha: string;
    }>;
    private snapshotCotizacion;
}
export {};
//# sourceMappingURL=ServicioDocumentosComerciales.d.ts.map