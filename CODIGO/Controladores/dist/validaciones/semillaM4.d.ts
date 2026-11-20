export declare const codigosExcluidosSemillaM4: Set<string>;
type ConfiguracionCatalogoM4 = {
    iniciales: readonly string[];
    dependencias: Readonly<Record<string, readonly string[]>>;
    perfiles: readonly (readonly string[])[];
};
/**
 * Construye el catálogo que debe existir antes de persistir dependencias y
 * perfiles. Una entrada de dependencias sin aristas (por ejemplo CU377) no
 * obliga a crear el permiso.
 */
export declare function construirCatalogoSemillaM4({ iniciales, dependencias, perfiles }: ConfiguracionCatalogoM4): string[];
export declare function exigirIdPermisoSemillaM4(permisos: ReadonlyMap<string, bigint>, codigo: string, contexto: string): bigint;
export {};
//# sourceMappingURL=semillaM4.d.ts.map