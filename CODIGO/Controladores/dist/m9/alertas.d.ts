import { Prisma } from '@prisma/client';
import { SenalM9, SenalesM9 } from './puertos';
export type ConfiguracionAlertaM9 = {
    codigo: string;
    metrica: string;
    operador: 'GT' | 'GTE' | 'LT' | 'LTE' | 'EQ';
    umbral: number;
};
export interface FuenteConfiguracionAlertasM9 {
    vigentes(fecha: Date): Promise<ConfiguracionAlertaM9[]>;
}
export declare class ConfiguracionAlertasMemoriaM9 implements FuenteConfiguracionAlertasM9 {
    private configuraciones;
    constructor(configuraciones?: ConfiguracionAlertaM9[]);
    vigentes(): Promise<{
        codigo: string;
        metrica: string;
        operador: "GT" | "GTE" | "LT" | "LTE" | "EQ";
        umbral: number;
    }[]>;
}
export declare class ConfiguracionAlertasPrismaM9 implements FuenteConfiguracionAlertasM9 {
    vigentes(fecha: Date): Promise<{
        codigo: string;
        metrica: string;
        operador: ConfiguracionAlertaM9["operador"];
        umbral: number;
    }[]>;
}
export declare class MotorAlertasM9 {
    private fuente;
    private senales;
    constructor(fuente: FuenteConfiguracionAlertasM9, senales: SenalesM9);
    evaluar(metricas: Record<string, number>, fecha?: Date): Promise<SenalM9[]>;
}
export declare const umbralDecimalM9: (valor: string) => Prisma.Decimal;
//# sourceMappingURL=alertas.d.ts.map