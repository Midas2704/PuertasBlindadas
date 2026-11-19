import type { ContextoSesion, ActorAutenticado } from '../controladores/M4Controller';
export type ContextoAutorizacion = ContextoSesion;
export interface Autorizacion {
    autorizar(operacion: string, contexto: ContextoAutorizacion): Promise<ActorAutenticado | void>;
}
//# sourceMappingURL=autorizacion.d.ts.map