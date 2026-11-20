import { type PoliticaTecnicaContenido } from './IntegridadContenido';
export interface PoliticaActivacionDocumental extends PoliticaTecnicaContenido {
    clasificacion: string;
    timeoutMs: number;
    concurrenciaMaxima: number;
    cantidadMaximaPorOperacion: number;
    expiracionIntencionSegundos: number;
    expiracionUrlFirmadaSegundos: number;
    antivirusObligatorio: true;
}
/**
 * Configuración fail-closed para una activación futura. No contiene valores empresariales
 * predeterminados: cada clasificación debe ser aprobada y entregada explícitamente.
 */
export declare function cargarPoliticasActivacionDocumental(entorno?: NodeJS.ProcessEnv): Readonly<Record<string, PoliticaActivacionDocumental>>;
//# sourceMappingURL=PoliticasActivacionDocumental.d.ts.map