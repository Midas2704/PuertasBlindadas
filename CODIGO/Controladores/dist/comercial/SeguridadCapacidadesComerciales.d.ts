export type OperacionSeguraComercial = 'CONSULTAR_PRODUCTOS' | 'CREAR_PRODUCTOS' | 'EDITAR_PRODUCTOS' | 'PUBLICAR_PRODUCTOS' | 'CONSULTAR_VERSIONES' | 'CREAR_PRECIO' | 'VERSIONAR_PRECIO' | 'DESACTIVAR_PRECIO' | 'CREAR_SERVICIO' | 'VERSIONAR_PRECIO_SERVICIO' | 'DESACTIVAR_SERVICIO' | 'CREAR_OPCIONAL' | 'EDITAR_OPCIONAL' | 'MODIFICAR_COMPATIBILIDAD' | 'VERSIONAR_PRECIO_OPCIONAL' | 'DESACTIVAR_OPCIONAL' | 'CREAR_TARIFA' | 'VERSIONAR_TARIFA' | 'REGISTRAR_EXCLUSION_COMUNAL' | 'DESACTIVAR_TARIFA' | 'CREAR_CONDICION' | 'VERSIONAR_CONDICION' | 'PUBLICAR_CONDICION' | 'DESACTIVAR_CONDICION' | 'EDITAR_PLANTILLA_DOCUMENTAL' | 'PUBLICAR_PLANTILLA_DOCUMENTAL' | 'EDITAR_CARTA_B2C' | 'PUBLICAR_CARTA_B2C';
export type EstadoAutorizacionComercial = 'APROBADO_EXISTENTE' | 'APROBADO_C2_6' | 'PENDIENTE_APROBACION';
export interface CapacidadComercialM4 {
    operacion: OperacionSeguraComercial;
    moduloPropietario: 'M2';
    cuExistente: string | null;
    cuPropuesto: string | null;
    tipoAcceso: 'CONSULTA' | 'ESCRITURA' | 'PUBLICACION';
    alcance: string;
    requiereAuditoria: boolean;
    estadoAutorizacion: EstadoAutorizacionComercial;
}
/** Catálogo aprobado. La presencia aquí no asigna capacidades a perfiles ni usuarios. */
export declare const MATRIZ_CAPACIDADES_COMERCIALES: readonly CapacidadComercialM4[];
export interface ActorComercialM4 {
    id: bigint;
    sesion: string;
    permisos: readonly string[];
    administrador: boolean;
}
/** El estado de aprobación prima sobre los permisos declarados por el actor; administrador no lo elude. */
export declare class AutorizadorCapacidadComercial {
    exigir(actor: ActorComercialM4, operacion: OperacionSeguraComercial): Promise<void>;
}
/** Valida contratos futuros sin escribir ni convertir la operación en disponible. */
export declare function validarSolicitudEscrituraComercial(operacion: OperacionSeguraComercial, entrada: unknown): Readonly<{
    operacion: OperacionSeguraComercial;
    revision: number | undefined;
    claveIdempotencia: string;
    motivo: string;
}>;
export interface RepositorioEscrituraComercialPreparado {
    ejecutar(operacion: OperacionSeguraComercial, entrada: unknown, actorId: bigint): Promise<unknown>;
}
/** No está conectado a rutas. Cuando el CU sea aprobado, conserva autorización backend antes de toda escritura. */
export declare class ServicioEscrituraComercialPreparada {
    private readonly autorizador;
    private readonly repositorio;
    constructor(autorizador: AutorizadorCapacidadComercial, repositorio: RepositorioEscrituraComercialPreparado);
    ejecutar(operacion: OperacionSeguraComercial, entrada: unknown, actor: ActorComercialM4): Promise<unknown>;
}
//# sourceMappingURL=SeguridadCapacidadesComerciales.d.ts.map