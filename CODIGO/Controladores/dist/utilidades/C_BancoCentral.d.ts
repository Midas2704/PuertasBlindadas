export interface BancoCentral {
    obtenerTipoCambio(moneda: string, fecha?: string): Promise<number>;
}
type FetchLike = (input: string, init?: RequestInit) => Promise<{
    ok: boolean;
    status: number;
    text(): Promise<string>;
}>;
/** Adaptador técnico: la integración externa queda fuera de los controladores de negocio y de Prisma. */
export declare class C_BancoCentral implements BancoCentral {
    private readonly fetcher;
    private readonly endpoint;
    constructor(fetcher?: FetchLike, endpoint?: string | undefined);
    obtenerTipoCambio(moneda: string, fecha?: string): Promise<number>;
}
export {};
//# sourceMappingURL=C_BancoCentral.d.ts.map