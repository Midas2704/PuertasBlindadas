import type { RequestHandler } from 'express';
export type EstadoDemostracion = 'PENDIENTE' | 'EN_EJECUCION' | 'CORRECTO' | 'RECHAZADO' | 'ERROR' | 'ROLLBACK';
export type CapaDemostracion = 'INTERACCION' | 'VISTA_REACT' | 'CLIENTE_API' | 'RUTA_BACKEND' | 'SEGURIDAD_M4' | 'CONTROLADOR' | 'REGLAS_NEGOCIO' | 'PRISMA' | 'POSTGRESQL' | 'AUDITORIA_M9' | 'RESPUESTA' | 'ACTUALIZACION_VISTA';
export interface EventoDemostracion {
    id: string;
    secuencia: number;
    solicitudId: string;
    ocurridoEn: string;
    capa: CapaDemostracion;
    estado: EstadoDemostracion;
    modulo: string;
    operacion: string;
    titulo: string;
    detalle?: string;
    duracionMs?: number;
    metodo?: string;
    ruta?: string;
    vista?: string;
    controlador?: string;
    permiso?: string;
    codigo?: string;
    resultado?: string;
    tabla?: string;
    accionDatos?: string;
}
interface ContextoTraza {
    solicitudId: string;
    metodo: string;
    ruta: string;
    vista: string;
    operacion: string;
    modulo: string;
    controlador: string;
    permiso: string;
    inicio: number;
}
export declare const contextoDemostracion: {
    habilitado: () => boolean;
    actual: () => ContextoTraza | undefined;
    middleware(): RequestHandler;
    prepararOperacion(operacion: string): void;
};
export declare function emitirEtapa(capa: CapaDemostracion, estado: EstadoDemostracion, titulo: string, opciones?: Partial<EventoDemostracion>): void;
export declare function medirEtapa<T>(capa: CapaDemostracion, titulo: string, accion: () => Promise<T>, opciones?: Partial<EventoDemostracion>): Promise<T>;
export declare function crearRutasDemostracion(): import("express-serve-static-core").Router;
export declare const pruebasDemostracion: {
    limpiar: () => void;
    eventos: () => {
        id: string;
        secuencia: number;
        solicitudId: string;
        ocurridoEn: string;
        capa: CapaDemostracion;
        estado: EstadoDemostracion;
        modulo: string;
        operacion: string;
        titulo: string;
        detalle?: string;
        duracionMs?: number;
        metodo?: string;
        ruta?: string;
        vista?: string;
        controlador?: string;
        permiso?: string;
        codigo?: string;
        resultado?: string;
        tabla?: string;
        accionDatos?: string;
    }[];
    ejecutarEnContexto: <T>(entrada: Partial<ContextoTraza>, accion: () => T) => T;
    textoSeguro: (valor: unknown, maximo?: number) => string;
};
export {};
//# sourceMappingURL=ServicioDemostracion.d.ts.map