export type AccionDocumental = 'CONSULTAR_METADATA' | 'CONSULTAR_VERSIONES' | 'CONSULTAR_HISTORIAL' | 'SOLICITAR_VISTA_PREVIA' | 'CREAR_INTENCION' | 'CONFIRMAR_CARGA' | 'DESCARGAR' | 'REEMPLAZAR' | 'ASOCIAR_PRODUCTO' | 'DEFINIR_IMAGEN_PRINCIPAL' | 'ORDENAR_GALERIA' | 'DEFINIR_USO_B2B_B2C' | 'ARCHIVAR_DOCUMENTO' | 'ARCHIVAR' | 'GESTIONAR_CUARENTENA' | 'ADMINISTRAR_CONSERVACION';
export interface ActorBackendDocumental {
    id: bigint;
    sesion: string;
    permisos: readonly string[];
    administrador: boolean;
    alcanceEmpleadoId?: number | null;
}
export interface ContextoAutorizacionDocumental {
    idDocumento?: bigint;
    idProducto?: number;
    usuarioSolicitante?: bigint;
}
export type VerificadorAlcanceDocumental = (actor: ActorBackendDocumental, contexto: ContextoAutorizacionDocumental) => Promise<boolean>;
/** CU377 y cualquier acción sin permiso aprobado permanecen cerrados por defecto. */
export declare class AutorizadorDocumental {
    private readonly verificarAlcance;
    constructor(verificarAlcance: VerificadorAlcanceDocumental);
    puede(actor: ActorBackendDocumental, accion: AccionDocumental, contexto: ContextoAutorizacionDocumental): Promise<boolean>;
    exigir(actor: ActorBackendDocumental, accion: AccionDocumental, contexto: ContextoAutorizacionDocumental): Promise<void>;
}
//# sourceMappingURL=AutorizacionDocumental.d.ts.map