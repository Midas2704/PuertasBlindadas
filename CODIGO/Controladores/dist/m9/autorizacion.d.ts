import type { ActorAutenticado } from '../controladores/M4Controller';
import type { ScopeM9 } from './tipos';
export declare function scopeM9DesdeActor(actor: ActorAutenticado): ScopeM9;
export declare function navegacionOwner(actor: ActorAutenticado, referencia?: {
    tipo: string | null;
    id: string | null;
}): {
    ruta: string;
    permiso: string;
} | null;
//# sourceMappingURL=autorizacion.d.ts.map