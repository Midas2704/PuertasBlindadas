import { Prisma } from '@prisma/client';
import { ProductorAuditoriaM9 } from '../m9/contratoProductor';
export interface ResumenSincronizacionMidas {
    usuarioId: string;
    catalogoAprobado: number;
    existentes: number;
    asignados: string[];
    excluidos: string[];
}
/**
 * Sincroniza la cuenta raíz identificada por acceso_m4 estable con todo el catálogo
 * registrado, incluso capacidades pendientes o inactivas. La asignación no vuelve
 * operativa una capacidad sin contrato backend, pero garantiza que Midas no tenga
 * que ser actualizado manualmente cuando se incorpore un CU nuevo.
 */
export declare function sincronizarPermisosMidas(tx: Prisma.TransactionClient, actorId: bigint, productorM9?: ProductorAuditoriaM9): Promise<ResumenSincronizacionMidas>;
//# sourceMappingURL=sincronizarPermisosMidas.d.ts.map