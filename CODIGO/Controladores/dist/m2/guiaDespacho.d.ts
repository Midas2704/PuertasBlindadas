import { Prisma } from '@prisma/client';
type GuiaModificable = {
    estado: string;
};
export declare function prepararModificacionGuia(guia: GuiaModificable, entrada: Record<string, unknown>): {
    folio: string;
    antecedentes?: undefined;
} | {
    folio: string;
    antecedentes: Prisma.InputJsonObject;
};
export {};
//# sourceMappingURL=guiaDespacho.d.ts.map