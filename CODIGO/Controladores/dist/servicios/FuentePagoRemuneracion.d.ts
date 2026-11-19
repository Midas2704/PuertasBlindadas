import { Prisma } from '@prisma/client';
import { RepositorioPagoRemuneracionPrisma } from './RepositorioPagoRemuneracion';
export type EstadoPagoRemuneracion = {
    fuenteDisponible: boolean;
    tienePago: boolean;
};
export interface FuentePagoRemuneracion {
    consultarEstado(tx: Prisma.TransactionClient, idRemuneracion: number): Promise<EstadoPagoRemuneracion>;
}
export declare class FuentePagoRemuneracionNoImplementada implements FuentePagoRemuneracion {
    consultarEstado(_tx: Prisma.TransactionClient, _idRemuneracion: number): Promise<EstadoPagoRemuneracion>;
}
export declare class FuentePagoRemuneracionPrisma implements FuentePagoRemuneracion {
    private readonly repositorio;
    constructor(repositorio?: RepositorioPagoRemuneracionPrisma);
    consultarEstado(tx: Prisma.TransactionClient, idRemuneracion: number): Promise<EstadoPagoRemuneracion>;
}
//# sourceMappingURL=FuentePagoRemuneracion.d.ts.map