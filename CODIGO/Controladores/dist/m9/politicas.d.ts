import { EventoPersistidoM9 } from './tipos';
export type AccionPoliticaM9 = 'NONE' | 'ANONYMIZE' | 'PURGE' | 'BLOCK';
export type CategoriaM9 = {
    id: number;
    codigo: string;
    ownership: string;
    descripcion: string | null;
};
export type PoliticaM9 = {
    id: number;
    categoriaId: number;
    version: number;
    accion: AccionPoliticaM9;
    modulo: string | null;
    entidad: string | null;
    estrategiaRef: string | null;
    permiteCorrelacion: boolean;
    preservarMinimo: boolean;
    finalidadRef: string | null;
    baseRef: string | null;
    politicaOwnerRef: string | null;
    desde: Date;
    hasta: Date | null;
};
export type TratamientoM9 = {
    eventoId: number;
    politicaId: number;
    accion: AccionPoliticaM9;
    estado: 'APLICADO' | 'BLOQUEADO' | 'DEPENDENCIA_OWNER';
    correlacionAnonima: string | null;
    aplicadoEn: Date;
};
export interface EstrategiaAnonimizacionM9 {
    nombre: string;
    aplicar(evento: EventoPersistidoM9, permitirCorrelacion: boolean): {
        evento: EventoPersistidoM9;
        correlacionAnonima?: string;
    };
}
export interface RepositorioPoliticasM9 {
    categoria(codigo: string): Promise<CategoriaM9 | null>;
    politicaAplicable(categoriaId: number, fecha: Date): Promise<PoliticaM9[]>;
    guardarTratamiento(item: TratamientoM9): Promise<void>;
    tratamientoVigente(eventoId: number): Promise<{
        tratamiento: TratamientoM9;
        politica: PoliticaM9;
    } | null>;
}
export declare class RepositorioPoliticasMemoriaM9 implements RepositorioPoliticasM9 {
    private categorias;
    private politicas;
    private tratamientos;
    constructor(categorias?: CategoriaM9[], politicas?: PoliticaM9[]);
    categoria(codigo: string): Promise<CategoriaM9 | null>;
    politicaAplicable(categoriaId: number, fecha: Date): Promise<PoliticaM9[]>;
    guardarTratamiento(item: TratamientoM9): Promise<void>;
    tratamientoVigente(eventoId: number): Promise<{
        tratamiento: {
            eventoId: number;
            politicaId: number;
            accion: AccionPoliticaM9;
            estado: "APLICADO" | "BLOQUEADO" | "DEPENDENCIA_OWNER";
            correlacionAnonima: string | null;
            aplicadoEn: Date;
        };
        politica: {
            id: number;
            categoriaId: number;
            version: number;
            accion: AccionPoliticaM9;
            modulo: string | null;
            entidad: string | null;
            estrategiaRef: string | null;
            permiteCorrelacion: boolean;
            preservarMinimo: boolean;
            finalidadRef: string | null;
            baseRef: string | null;
            politicaOwnerRef: string | null;
            desde: Date;
            hasta: Date | null;
        };
    } | null>;
}
export declare class RepositorioPoliticasPrismaM9 implements RepositorioPoliticasM9 {
    categoria(codigo: string): Promise<{
        id: number;
        codigo: string;
        ownership: string;
        descripcion: string | null;
    } | null>;
    politicaAplicable(categoriaId: number, fecha: Date): Promise<PoliticaM9[]>;
    guardarTratamiento(item: TratamientoM9): Promise<void>;
    tratamientoVigente(eventoId: number): Promise<{
        tratamiento: {
            eventoId: number;
            politicaId: number;
            accion: AccionPoliticaM9;
            estado: TratamientoM9["estado"];
            correlacionAnonima: string | null;
            aplicadoEn: Date;
        };
        politica: PoliticaM9;
    } | null>;
}
export declare class MotorPoliticasM9 {
    private repositorio;
    private estrategias;
    constructor(repositorio: RepositorioPoliticasM9);
    registrarEstrategia(estrategia: EstrategiaAnonimizacionM9): void;
    tratar(evento: EventoPersistidoM9, categoriaCodigo: string, fecha: Date): Promise<{
        estado: string;
        politica: PoliticaM9 | null;
    }>;
    private ocultarVinculo;
    private limpiarRelaciones;
    proyectar(evento: EventoPersistidoM9): Promise<EventoPersistidoM9 | null>;
}
//# sourceMappingURL=politicas.d.ts.map