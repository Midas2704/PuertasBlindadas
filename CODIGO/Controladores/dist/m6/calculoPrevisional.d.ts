import { Prisma } from '@prisma/client';
type Tx = Prisma.TransactionClient;
type ComponenteLegal = {
    tipo: 'DEDUCCION_PREVISIONAL' | 'IMPUESTO_RENTA' | 'APORTE_EMPLEADOR_AUTOMATICO';
    descripcion: string;
    monto: Prisma.Decimal;
    claveNegocio: string;
    referenciaOrigen: string;
    versionOrigen: string;
};
type EntradaCalculo = {
    idEmpleado: number;
    fechaInicio: Date;
    fechaFin: Date;
    baseImponible: Prisma.Decimal;
    afp: string | null;
    salud: {
        nombre: string;
        tipo: string | null;
    } | null;
    seguroCesantia: boolean;
    fundamentoExclusionCesantia: string | null;
};
export declare function calcularPrevisionLegal(tx: Tx, entrada: EntradaCalculo): Promise<{
    componentes: ComponenteLegal[];
    baseImponible: Prisma.Decimal;
    baseTributable: Prisma.Decimal;
    descuentosPrevisionales: Prisma.Decimal;
    impuesto: Prisma.Decimal;
    aportesEmpleador: Prisma.Decimal;
    snapshot: {
        afp: string;
        salud: {
            nombre: string;
            tipo: string | null;
            plan: Record<string, unknown> | null;
        };
        seguroCesantia: {
            incluido: boolean;
            fundamentoExclusion: string | null;
            tipoVinculo: string;
        };
        baseImponible: string;
        baseTributable: string;
        basesConTope: {
            afp: string;
            salud: string;
            cesantia: string;
            ley16744: string;
        };
        parametros: {
            id: number;
            codigo: string;
            valor: string;
            unidad: string | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
        }[];
        impuesto: {
            tramoId: number;
            factor: string;
            rebaja: string;
            limiteDesde: string;
            limiteHasta: string | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
        };
    };
}>;
export {};
//# sourceMappingURL=calculoPrevisional.d.ts.map