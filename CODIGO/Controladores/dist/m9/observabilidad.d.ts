export declare class ObservabilidadM9 {
    private contadores;
    private latencias;
    private productores;
    incrementar(clave: keyof typeof this.contadores): void;
    latencia(clave: keyof typeof this.latencias, valor: number): void;
    productor(nombre: string, tipo: 'recibidos' | 'persistidos' | 'fallos'): void;
    snapshot(): {
        latenciaMs: {
            ingesta: number | null;
            persistencia: number | null;
            consulta: number | null;
        };
        productores: {
            [k: string]: {
                recibidos: number;
                persistidos: number;
                fallos: number;
            };
        };
        recibidos: number;
        persistidos: number;
        rechazados: number;
        fallosPersistencia: number;
    };
}
//# sourceMappingURL=observabilidad.d.ts.map