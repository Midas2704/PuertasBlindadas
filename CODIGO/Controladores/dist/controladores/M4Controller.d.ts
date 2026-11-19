import { Prisma } from '@prisma/client';
import { CorreoRecuperacion } from '../utilidades/correo';
type Entrada = Record<string, unknown>;
export interface ContextoSesion {
    direccion?: string;
    agente?: string;
    secretoSesion?: string;
}
declare const incluirAccesos: {
    perfil: {
        include: {
            perfil_permiso: {
                include: {
                    permiso: true;
                };
            };
        };
    };
    particulares: {
        include: {
            permiso: true;
        };
    };
    seguridad: true;
    empleado_seguridad: true;
};
type Cuenta = Prisma.usuarioGetPayload<{
    include: typeof incluirAccesos;
}>;
export interface ActorAutenticado {
    id: bigint;
    sesion: string;
    permisos: string[];
    configuracion: string;
    administrador: boolean;
    administradorOriginal?: boolean;
    cambiarClave: boolean;
    nombre: string;
    acceso: string;
    alcanceEmpleadoId?: number | null;
}
export declare const esAdministradorRaiz: (cuenta: Pick<Cuenta, "administrador_original">) => boolean;
export declare const esAdministradorEfectivo: (cuenta: Pick<Cuenta, "administrador_original" | "usuario_es_administrador">) => boolean;
export declare const configuracionEfectiva: (cuenta: Pick<Cuenta, "administrador_original" | "perfil">) => string;
export declare const permisosEfectivos: (cuenta: Cuenta, catalogoRaiz?: string[]) => string[];
/** La autorización raíz no depende de materializar asignaciones particulares. */
export declare const requiereSincronizacionMidas: () => boolean;
/** El perfil propone permisos iniciales; no constituye un límite para personalizaciones autorizadas. */
export declare const perfilPermitePersonalizacion: (perfil: {
    activo_m4: boolean;
} | null | undefined) => boolean;
/** Único controlador funcional M4 (CU59–CU74). Ningún otro módulo lo invoca. */
export declare class M4Controller {
    private readonly correo;
    constructor(correo?: CorreoRecuperacion);
    private transaccion;
    private cuenta;
    private invalidar;
    private credencial;
    private nuevaClave;
    private reiniciarSeguridad;
    private presentar;
    autorizar(operacion: string, contexto: ContextoSesion, adicionales?: string[]): Promise<ActorAutenticado>;
    iniciarSesion(entrada: Entrada, contexto: ContextoSesion): Promise<{
        fallo: number;
        mensaje: string;
        codigo?: undefined;
        token?: undefined;
        usuario?: undefined;
    } | {
        fallo: number;
        mensaje: string;
        codigo: string;
        token?: undefined;
        usuario?: undefined;
    } | {
        token: string;
        usuario: {
            administradorOriginal: boolean;
            cambiarClave: boolean;
            id: string;
            acceso: string;
            nombre: string;
            correo: string | null;
            estado: string | null;
            configuracion: string;
            configuracionParticular: boolean;
            administrador: boolean;
            original: boolean;
            bloqueada: boolean;
            bloqueoHasta: Date | null | undefined;
            permisos: string[];
            permisosParticulares: string[];
            permisosPerfil: string[];
            rutEmpleado: string | null;
        };
        fallo?: undefined;
        mensaje?: undefined;
        codigo?: undefined;
    }>;
    cambiarClave(actor: ActorAutenticado, entrada: Entrada): Promise<{
        mensaje: string;
    }>;
    cerrarSesion(actor: ActorAutenticado): Promise<{
        mensaje: string;
    }>;
    usuarios(): Promise<any>;
    catalogosUsuarios(): Promise<{
        empleados: {
            rut_empleado: string;
            nombres: string;
            apellido_paterno: string;
        }[];
        configuraciones: {
            codigo_m4: string | null;
            admite_particulares: boolean;
            perfil_nombre_perfil: string | null;
        }[];
        permisos: import("../seguridad/catalogoPermisosFuncional").PermisoFuncionalM4[];
        dependencias: {
            permiso: string;
            requiere: string;
        }[];
    }>;
    private validarPermisos;
    registrarUsuario(actor: ActorAutenticado, entrada: Entrada): Promise<{
        mensaje: string;
        id: string;
        claveTemporal: string;
    }>;
    private continuidad;
    modificarUsuario(operacion: string, actor: ActorAutenticado, entrada: Entrada): Promise<{
        claveTemporal?: string | undefined;
        mensaje: string;
    }>;
    solicitarRecuperacion(entrada: Entrada): Promise<{
        mensaje: string;
    }>;
    validarRecuperacion(entrada: Entrada): Promise<{
        valido: boolean;
    }>;
    recuperarClave(entrada: Entrada): Promise<{
        mensaje: string;
    }>;
    consultarSesiones(actor: ActorAutenticado): Promise<{
        activa: boolean;
        usuario: {
            usuario_id_usuario: bigint;
            acceso_m4: string | null;
        };
    }[]>;
    cerrarSesionAdministrativa(actor: ActorAutenticado, entrada: Entrada): Promise<{
        mensaje: string;
    }>;
}
export {};
//# sourceMappingURL=M4Controller.d.ts.map