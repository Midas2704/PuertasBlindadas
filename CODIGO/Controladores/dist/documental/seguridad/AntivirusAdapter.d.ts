import { Readable } from 'node:stream';
import { type Socket } from 'node:net';
export type EstadoAntivirus = 'LIMPIO' | 'INFECTADO' | 'ERROR_ESCANEO' | 'NO_DISPONIBLE' | 'ARCHIVO_NO_SOPORTADO';
export interface ResultadoAntivirus {
    estado: EstadoAntivirus;
    motor?: string;
    firma?: string;
    codigo?: string;
}
export interface DisponibilidadAntivirus {
    disponible: boolean;
    motor: string;
    codigo?: string;
}
/** Puerto fail-closed. Ningún resultado distinto de LIMPIO habilita disponibilidad o descarga. */
export interface AntivirusAdapter {
    readonly nombre: string;
    escanear(contenido: Readable): Promise<ResultadoAntivirus>;
    comprobarDisponibilidad?(): Promise<DisponibilidadAntivirus>;
}
export declare class AntivirusNoDisponible implements AntivirusAdapter {
    readonly nombre = "NO_CONFIGURADO";
    escanear(): Promise<ResultadoAntivirus>;
    comprobarDisponibilidad(): Promise<DisponibilidadAntivirus>;
}
export interface ConfiguracionClamAv {
    host: string;
    puerto: number;
    timeoutMs: number;
    maximoBytes: bigint;
}
/** Integración real con clamd mediante INSTREAM. No se conecta hasta invocar escanear. */
export declare class ClamAvDaemonAdapter implements AntivirusAdapter {
    private readonly configuracion;
    private readonly conectar;
    readonly nombre = "CLAMAV_DAEMON";
    constructor(configuracion: ConfiguracionClamAv, conectar?: (puerto: number, host: string) => Socket);
    comprobarDisponibilidad(): Promise<DisponibilidadAntivirus>;
    escanear(contenido: Readable): Promise<ResultadoAntivirus>;
}
export declare function exigirResultadoLimpio(resultado: ResultadoAntivirus): void;
/** Calcula la huella sobre el mismo stream consumido por el motor. */
export declare function escanearConIntegridad(adapter: AntivirusAdapter, contenido: Readable): Promise<{
    resultado: ResultadoAntivirus;
    sha256: string | null;
    tamanoBytes: bigint;
    completo: boolean;
}>;
//# sourceMappingURL=AntivirusAdapter.d.ts.map