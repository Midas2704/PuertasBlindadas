import { EventoEntradaM9, EventoNormalizadoM9 } from './tipos';
export interface RelojM9 {
    ahora(): Date;
}
export declare class RelojSistemaM9 implements RelojM9 {
    ahora(): Date;
}
export declare class RelojFijoM9 implements RelojM9 {
    private instante;
    constructor(instante: Date);
    ahora(): Date;
    fijar(instante: Date): void;
}
export type DiagnosticoM9 = {
    codigo: string;
    fecha: Date;
    productor?: string;
    identidadLogica?: string;
};
export interface DiagnosticosM9 {
    registrar(item: DiagnosticoM9): void;
    listar(): DiagnosticoM9[];
}
export declare class DiagnosticosMemoriaM9 implements DiagnosticosM9 {
    private items;
    registrar(item: DiagnosticoM9): void;
    listar(): {
        codigo: string;
        fecha: Date;
        productor?: string;
        identidadLogica?: string;
    }[];
}
export type NuevoPendienteM9 = Pick<EventoEntradaM9, 'identidadLogica' | 'versionContrato' | 'ocurridoEn' | 'zonaHoraria' | 'productor' | 'modulo' | 'operacion' | 'resultado'> & {
    creadoEn: Date;
    intentos: number;
    evento?: EventoNormalizadoM9;
};
export type PendienteM9 = NuevoPendienteM9 & {
    id: number;
    estado: 'PENDIENTE' | 'REINTENTANDO' | 'RESUELTO';
    proximoIntentoEn: Date;
    resueltoEn: Date | null;
    ultimoErrorCodigo: string | null;
    ultimoErrorEn: Date | null;
};
export interface FuentePendientesM9 {
    guardar(item: NuevoPendienteM9): Promise<void>;
    listar(): Promise<PendienteM9[]>;
    elegibles(ahora: Date, limite: number): Promise<PendienteM9[]>;
    reclamar(id: number, ahora: Date, leaseHasta: Date): Promise<boolean>;
    registrarResultado(id: number, resultado: 'EXITOSO' | 'FALLIDO', fecha: Date, errorCodigo?: string, proximoIntentoEn?: Date): Promise<void>;
}
export declare class PendientesMemoriaM9 implements FuentePendientesM9 {
    private items;
    guardar(item: NuevoPendienteM9): Promise<void>;
    listar(): Promise<{
        operacion: string;
        ocurridoEn: string;
        modulo: string;
        resultado: string;
        productor: string;
        identidadLogica: string;
        versionContrato: string;
        zonaHoraria: string;
        creadoEn: Date;
        intentos: number;
        evento?: EventoNormalizadoM9;
        id: number;
        estado: "PENDIENTE" | "REINTENTANDO" | "RESUELTO";
        proximoIntentoEn: Date;
        resueltoEn: Date | null;
        ultimoErrorCodigo: string | null;
        ultimoErrorEn: Date | null;
    }[]>;
    elegibles(ahora: Date, limite: number): Promise<{
        operacion: string;
        ocurridoEn: string;
        modulo: string;
        resultado: string;
        productor: string;
        identidadLogica: string;
        versionContrato: string;
        zonaHoraria: string;
        creadoEn: Date;
        intentos: number;
        evento?: EventoNormalizadoM9;
        id: number;
        estado: "PENDIENTE" | "REINTENTANDO" | "RESUELTO";
        proximoIntentoEn: Date;
        resueltoEn: Date | null;
        ultimoErrorCodigo: string | null;
        ultimoErrorEn: Date | null;
    }[]>;
    reclamar(id: number, ahora: Date, leaseHasta: Date): Promise<boolean>;
    registrarResultado(id: number, resultado: 'EXITOSO' | 'FALLIDO', fecha: Date, errorCodigo?: string, proximoIntentoEn?: Date): Promise<void>;
}
export interface FuenteRetryM9 {
    resumen(): Promise<{
        exitosos: number;
        fallidos: number;
    }>;
}
export declare class RetryMemoriaM9 implements FuenteRetryM9 {
    private estado;
    constructor(estado?: {
        exitosos: number;
        fallidos: number;
    });
    resumen(): Promise<{
        exitosos: number;
        fallidos: number;
    }>;
    fijar(estado: {
        exitosos: number;
        fallidos: number;
    }): void;
}
export type SenalM9 = {
    tipo: 'FALLO_CRITICO' | 'PENDIENTE_ENVEJECIDO' | 'ALERTA_TECNICA';
    productor: string;
    identidadLogica?: string;
    codigoConfiguracion?: string;
    metrica?: string;
};
export interface SenalesM9 {
    emitir(senal: SenalM9): void;
    listar(): SenalM9[];
}
export declare class SenalesMemoriaM9 implements SenalesM9 {
    private senales;
    emitir(senal: SenalM9): void;
    listar(): {
        tipo: "FALLO_CRITICO" | "PENDIENTE_ENVEJECIDO" | "ALERTA_TECNICA";
        productor: string;
        identidadLogica?: string;
        codigoConfiguracion?: string;
        metrica?: string;
    }[];
}
//# sourceMappingURL=puertos.d.ts.map