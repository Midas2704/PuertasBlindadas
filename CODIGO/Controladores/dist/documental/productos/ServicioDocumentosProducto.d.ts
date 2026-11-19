import { RepositorioDocumentalPrisma } from '../repositorios/RepositorioDocumentalPrisma';
import { AutorizadorDocumental, type ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';
import type { AccionDocumental } from '../seguridad/AutorizacionDocumental';
import { type TipoDocumentoProducto } from '../tipos';
import type { CapacidadesDocumentalesProductoDto, MetadatosDocumentalesProductoDto, TipoDocumentoComercialDto } from './tipos';
declare const TIPO_DTO: Record<TipoDocumentoProducto, TipoDocumentoComercialDto>;
export interface EstadoDependenciasDocumentalesProducto {
    politicaComercial: boolean;
    storage: boolean;
    antivirus: boolean;
}
/** Servicio interno: no registra rutas, no firma URLs y no accede al storage. */
export declare class ServicioDocumentosProducto {
    private readonly repositorio;
    private readonly autorizador;
    private readonly dependencias;
    constructor(repositorio: Pick<RepositorioDocumentalPrisma, 'consultarDocumentosProducto'>, autorizador: AutorizadorDocumental, dependencias?: EstadoDependenciasDocumentalesProducto);
    consultarCapacidades(idProducto: number, actor: ActorBackendDocumental): Promise<CapacidadesDocumentalesProductoDto>;
    exigirOperacionBinaria(idProducto: number, accion: Extract<AccionDocumental, 'CREAR_INTENCION' | 'CONFIRMAR_CARGA' | 'REEMPLAZAR' | 'SOLICITAR_VISTA_PREVIA' | 'DESCARGAR'>, actor: ActorBackendDocumental): Promise<never>;
    listar(idProducto: number, actor: ActorBackendDocumental): Promise<MetadatosDocumentalesProductoDto>;
    listarParaSegmento(idProducto: number, segmento: 'B2B' | 'B2C', actor: ActorBackendDocumental): Promise<MetadatosDocumentalesProductoDto>;
    consultarVersiones(idProducto: number, idDocumento: bigint, actor: ActorBackendDocumental): Promise<readonly import("./tipos").VersionDocumentoComercialDto[]>;
    private mapear;
}
export { TIPO_DTO as MAPEO_TIPO_DOCUMENTAL_COMERCIAL };
//# sourceMappingURL=ServicioDocumentosProducto.d.ts.map