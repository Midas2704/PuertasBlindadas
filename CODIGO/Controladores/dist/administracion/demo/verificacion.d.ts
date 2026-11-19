import { PrismaClient } from '@prisma/client';
/** Read-only invariants over DEMO ownership predicates. Never repairs data. */
export declare function comprobarIntegridadDemo(db: PrismaClient, corte: Date): Promise<{
    estado: string;
    notas: number;
    obligaciones: number;
    stock: number;
    remuneraciones: number;
    compromisos: number;
}>;
//# sourceMappingURL=verificacion.d.ts.map