import { Prisma } from '@prisma/client';
import { EventoNormalizadoM9, EventoPersistidoM9, FiltrosM9 } from './tipos';
export interface RepositorioAuditoriaM9 {
    crear(evento: EventoNormalizadoM9): Promise<EventoPersistidoM9>;
    porIdentidad(identidad: string): Promise<EventoPersistidoM9 | null>;
    porId(id: number): Promise<EventoPersistidoM9 | null>;
    ultimaSecuencia(productor: string, entidadTipo: string | null, entidadReferencia: string | null): Promise<number | null>;
    listar(filtros: FiltrosM9, modulos?: string[], productores?: string[]): Promise<{
        total: number;
        eventos: EventoPersistidoM9[];
    }>;
    listarTodo(filtros: FiltrosM9, modulos?: string[], productores?: string[]): Promise<EventoPersistidoM9[]>;
    relacionados(id: number, tipo: 'origen' | 'correctivo'): Promise<EventoPersistidoM9[]>;
    resumen(modulos?: string[], productores?: string[]): Promise<{
        total: number;
        porResultado: Record<string, number>;
        porModulo: Record<string, number>;
    }>;
    cantidad(): Promise<number>;
}
type ClienteAuditoriaM9 = Pick<Prisma.TransactionClient, 'evento_auditoria_m9'>;
export declare class RepositorioAuditoriaM9Prisma implements RepositorioAuditoriaM9 {
    private readonly cliente;
    constructor(cliente?: ClienteAuditoriaM9);
    crear(evento: EventoNormalizadoM9): Promise<EventoPersistidoM9>;
    porIdentidad(identidad: string): Promise<EventoPersistidoM9 | null>;
    porId(id: number): Promise<EventoPersistidoM9 | null>;
    ultimaSecuencia(productor: string, entidadTipo: string | null, entidadReferencia: string | null): Promise<number | null>;
    listar(filtros: FiltrosM9, modulos?: string[], productores?: string[]): Promise<{
        total: number;
        eventos: EventoPersistidoM9[];
    }>;
    listarTodo(filtros: FiltrosM9, modulos?: string[], productores?: string[]): Promise<EventoPersistidoM9[]>;
    relacionados(id: number, tipo: 'origen' | 'correctivo'): Promise<EventoPersistidoM9[]>;
    resumen(modulos?: string[], productores?: string[]): Promise<{
        total: number;
        porResultado: {
            [k: string]: number;
        };
        porModulo: {
            [k: string]: number;
        };
    }>;
    cantidad(): Prisma.PrismaPromise<number>;
}
export declare class RepositorioAuditoriaM9Memoria implements RepositorioAuditoriaM9 {
    private eventos;
    fallarPersistencia: boolean;
    crear(evento: EventoNormalizadoM9): Promise<{
        id: number;
        identidadLogica: string;
        versionContrato: string;
        fechaOcurrencia: Date;
        zonaHoraria: string;
        fechaPersistencia: Date;
        ejecutorTipo: "HUMANO" | "SISTEMA";
        ejecutorReferencia: string | null;
        productor: string;
        modulo: string;
        operacion: string;
        resultado: import("./tipos").ResultadoM9;
        entidadTipo: string | null;
        entidadReferencia: string | null;
        secuencia: number | null;
        anterior: import("./tipos").JsonM9 | null;
        nuevo: import("./tipos").JsonM9 | null;
        motivo: string | null;
        causa: string | null;
        eventoOrigenId: number | null;
        eventoCorrectivoId: number | null;
        contextoTerminal: boolean;
        eventoPrivacidad: boolean;
        metadatos: import("./tipos").JsonM9 | null;
        hashContenido: string;
        hashIntegridad: string;
    }>;
    porIdentidad(identidad: string): Promise<EventoPersistidoM9 | null>;
    porId(id: number): Promise<EventoPersistidoM9 | null>;
    ultimaSecuencia(productor: string, entidadTipo: string | null, entidadReferencia: string | null): Promise<number | null>;
    listar(f: FiltrosM9, modulos?: string[], productores?: string[]): Promise<{
        total: number;
        eventos: {
            identidadLogica: string;
            versionContrato: string;
            fechaOcurrencia: Date;
            zonaHoraria: string;
            fechaPersistencia: Date;
            ejecutorTipo: "HUMANO" | "SISTEMA";
            ejecutorReferencia: string | null;
            productor: string;
            modulo: string;
            operacion: string;
            resultado: import("./tipos").ResultadoM9;
            entidadTipo: string | null;
            entidadReferencia: string | null;
            secuencia: number | null;
            anterior: import("./tipos").JsonM9 | null;
            nuevo: import("./tipos").JsonM9 | null;
            motivo: string | null;
            causa: string | null;
            eventoOrigenId: number | null;
            eventoCorrectivoId: number | null;
            contextoTerminal: boolean;
            eventoPrivacidad: boolean;
            metadatos: import("./tipos").JsonM9 | null;
            hashContenido: string;
            hashIntegridad: string;
            id: number;
        }[];
    }>;
    listarTodo(f: FiltrosM9, modulos?: string[], productores?: string[]): Promise<{
        identidadLogica: string;
        versionContrato: string;
        fechaOcurrencia: Date;
        zonaHoraria: string;
        fechaPersistencia: Date;
        ejecutorTipo: "HUMANO" | "SISTEMA";
        ejecutorReferencia: string | null;
        productor: string;
        modulo: string;
        operacion: string;
        resultado: import("./tipos").ResultadoM9;
        entidadTipo: string | null;
        entidadReferencia: string | null;
        secuencia: number | null;
        anterior: import("./tipos").JsonM9 | null;
        nuevo: import("./tipos").JsonM9 | null;
        motivo: string | null;
        causa: string | null;
        eventoOrigenId: number | null;
        eventoCorrectivoId: number | null;
        contextoTerminal: boolean;
        eventoPrivacidad: boolean;
        metadatos: import("./tipos").JsonM9 | null;
        hashContenido: string;
        hashIntegridad: string;
        id: number;
    }[]>;
    relacionados(id: number, tipo: 'origen' | 'correctivo'): Promise<EventoPersistidoM9[]>;
    resumen(modulos?: string[], productores?: string[]): Promise<{
        total: number;
        porResultado: Record<string, number>;
        porModulo: Record<string, number>;
    }>;
    cantidad(): Promise<number>;
}
export {};
//# sourceMappingURL=RepositorioAuditoriaM9.d.ts.map