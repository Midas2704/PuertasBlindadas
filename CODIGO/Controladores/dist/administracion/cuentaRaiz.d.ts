import { Prisma } from '@prisma/client';
export declare const ACCESO_CUENTA_RAIZ = "20776101-k";
interface OpcionesCuentaRaiz {
    claveInicial?: string;
    correo?: string;
    generarClaveSiFalta?: boolean;
    sincronizarClave?: boolean;
}
/** Aprovisionamiento idempotente de la única cuenta raíz funcional. */
export declare function asegurarCuentaRaiz(tx: Prisma.TransactionClient, opciones?: OpcionesCuentaRaiz): Promise<{
    cuenta: {
        gerencia: string | null;
        secretaria: string | null;
        usuario_id_usuario: bigint;
        perfil_id_perfil: bigint | null;
        acceso_m4: string | null;
        empleado_m4: string | null;
        configuracion_particular: boolean;
        administrador_original: boolean;
        version_seguridad: number;
        usuario_fecha_de_ultima_edicion: Date | null;
        usuario_rut_usuario: string | null;
        usuario_fecha_de_creacion: Date | null;
        usuario_correo: string | null;
        usuario_username: string | null;
        usuario_estado_cuenta: string | null;
        usuario_fecha_ultima_conexion: Date | null;
        usuario_nombre_completo_primer_nombre_usuario: string | null;
        usuario_nombre_completo_segundo_nombre_usuario: string | null;
        usuario_nombre_completo_primer_apellido_usuario: string | null;
        usuario_nombre_completo_segundo_apellido_usuario: string | null;
        usuario_es_gerencia: boolean | null;
        usuario_es_tecnico: boolean | null;
        tecnico: string | null;
        usuario_es_jop: boolean | null;
        jop: string | null;
        usuario_es_administrador: boolean | null;
        administrador: string | null;
        usuario_es_secretaria: boolean | null;
        empleado_rut_empleado: string | null;
    };
    claveCreada: string | undefined;
}>;
export {};
//# sourceMappingURL=cuentaRaiz.d.ts.map