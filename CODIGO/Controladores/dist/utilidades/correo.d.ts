export interface CorreoRecuperacion {
    enviar(destinatario: string, enlace: string): Promise<void>;
}
export interface CorreoDocumental {
    enviarDocumento(destinatario: string, asunto: string, archivo: {
        nombre: string;
        mime: string;
        contenido: string;
    }): Promise<void>;
}
/** Sustituible por el proveedor pendiente. El buzón local no es una ruta HTTP. */
export declare class CorreoDesarrollo implements CorreoRecuperacion, CorreoDocumental {
    enviar(destinatario: string, enlace: string): Promise<void>;
    enviarDocumento(destinatario: string, asunto: string, archivo: {
        nombre: string;
        mime: string;
        contenido: string;
    }): Promise<void>;
}
//# sourceMappingURL=correo.d.ts.map