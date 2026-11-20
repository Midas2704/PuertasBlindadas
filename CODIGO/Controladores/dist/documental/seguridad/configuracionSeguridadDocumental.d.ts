import type { PoliticaTecnicaContenido } from './IntegridadContenido';
import { type AntivirusAdapter, type ConfiguracionClamAv } from './AntivirusAdapter';
export interface ConfiguracionSeguridadDocumental {
    politicasPorClasificacion: Readonly<Record<string, PoliticaTecnicaContenido>>;
    clamav: ConfiguracionClamAv | null;
}
export declare function cargarConfiguracionSeguridadDocumental(entorno?: NodeJS.ProcessEnv): ConfiguracionSeguridadDocumental;
/** Construye el adaptador real sólo con activación explícita y configuración completa. */
export declare function crearAntivirusAdapterDesdeEntorno(entorno?: NodeJS.ProcessEnv): AntivirusAdapter;
//# sourceMappingURL=configuracionSeguridadDocumental.d.ts.map