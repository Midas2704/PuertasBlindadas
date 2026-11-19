import { ObservabilidadM9 } from '../m9/observabilidad';
import { DiagnosticosM9, FuentePendientesM9, FuenteRetryM9, RelojM9, SenalesM9 } from '../m9/puertos';
import { RepositorioAuditoriaM9 } from '../m9/RepositorioAuditoriaM9';
import { MotorPoliticasM9 } from '../m9/politicas';
import { ConfiguracionM9, EventoEntradaM9, EventoPersistidoM9, FiltrosM9, JsonM9, ScopeM9 } from '../m9/tipos';
type DependenciasM9 = {
    repositorio?: RepositorioAuditoriaM9;
    reloj?: RelojM9;
    diagnosticos?: DiagnosticosM9;
    pendientes?: FuentePendientesM9;
    retry?: FuenteRetryM9;
    senales?: SenalesM9;
    observabilidad?: ObservabilidadM9;
    configuracion?: ConfiguracionM9;
    politicas?: MotorPoliticasM9;
};
type EstadoIntegridadM9 = 'VERIFICADA' | 'COMPROMETIDA';
export declare class M9Controller {
    readonly repositorio: RepositorioAuditoriaM9;
    readonly reloj: RelojM9;
    readonly diagnosticos: DiagnosticosM9;
    readonly pendientes: FuentePendientesM9;
    readonly retry: FuenteRetryM9;
    readonly senales: SenalesM9;
    readonly observabilidad: ObservabilidadM9;
    readonly configuracion: ConfiguracionM9;
    readonly politicas: MotorPoliticasM9;
    constructor(dependencias?: DependenciasM9);
    private diagnosticar;
    private normalizar;
    recibir(entrada: EventoEntradaM9): Promise<{
        estado: "PERSISTIDO";
        evento: EventoPersistidoM9;
        reintento: boolean;
    } | {
        estado: "PENDIENTE";
        evento: null;
        reintento: boolean;
    }>;
    private verificarIntegridad;
    private estadoIntegridad;
    private verificarScope;
    private presentar;
    private proyectarForense;
    private normalizarFiltros;
    private resolverConsulta;
    private terminal;
    consultar(filtros: FiltrosM9, scope: ScopeM9): Promise<{
        total: number;
        pagina: number;
        tamano: number;
        eventos: {
            id: number;
            identidadLogica: string;
            versionContrato: string;
            ocurrencia: string;
            persistencia: string;
            zonaHoraria: string;
            ejecutor: {
                tipo: "SISTEMA" | "HUMANO";
                referencia: string | null;
            };
            productor: string;
            modulo: string;
            operacion: string;
            resultado: import("../m9/tipos").ResultadoM9;
            referencia: {
                tipo: string | null;
                id: string | null;
            };
            cambios: {
                anterior: JsonM9 | null;
                nuevo: JsonM9 | null;
            } | null;
            motivo: string | null;
            causa: string | null;
            eventoOrigenId: number | null;
            eventoCorrectivoId: number | null;
            eventoPrivacidad: boolean;
            integridad: EstadoIntegridadM9;
            advertenciaIntegridad: string | null;
        }[];
    }>;
    detalle(id: number, scope: ScopeM9): Promise<{
        evento: {
            id: number;
            identidadLogica: string;
            versionContrato: string;
            ocurrencia: string;
            persistencia: string;
            zonaHoraria: string;
            ejecutor: {
                tipo: "SISTEMA" | "HUMANO";
                referencia: string | null;
            };
            productor: string;
            modulo: string;
            operacion: string;
            resultado: import("../m9/tipos").ResultadoM9;
            referencia: {
                tipo: string | null;
                id: string | null;
            };
            cambios: {
                anterior: JsonM9 | null;
                nuevo: JsonM9 | null;
            } | null;
            motivo: string | null;
            causa: string | null;
            eventoOrigenId: number | null;
            eventoCorrectivoId: number | null;
            eventoPrivacidad: boolean;
            integridad: EstadoIntegridadM9;
            advertenciaIntegridad: string | null;
        };
        cadena: {
            id: number;
            identidadLogica: string;
            versionContrato: string;
            ocurrencia: string;
            persistencia: string;
            zonaHoraria: string;
            ejecutor: {
                tipo: "SISTEMA" | "HUMANO";
                referencia: string | null;
            };
            productor: string;
            modulo: string;
            operacion: string;
            resultado: import("../m9/tipos").ResultadoM9;
            referencia: {
                tipo: string | null;
                id: string | null;
            };
            cambios: {
                anterior: JsonM9 | null;
                nuevo: JsonM9 | null;
            } | null;
            motivo: string | null;
            causa: string | null;
            eventoOrigenId: number | null;
            eventoCorrectivoId: number | null;
            eventoPrivacidad: boolean;
            integridad: EstadoIntegridadM9;
            advertenciaIntegridad: string | null;
        }[];
        correctivos: {
            id: number;
            identidadLogica: string;
            versionContrato: string;
            ocurrencia: string;
            persistencia: string;
            zonaHoraria: string;
            ejecutor: {
                tipo: "SISTEMA" | "HUMANO";
                referencia: string | null;
            };
            productor: string;
            modulo: string;
            operacion: string;
            resultado: import("../m9/tipos").ResultadoM9;
            referencia: {
                tipo: string | null;
                id: string | null;
            };
            cambios: {
                anterior: JsonM9 | null;
                nuevo: JsonM9 | null;
            } | null;
            motivo: string | null;
            causa: string | null;
            eventoOrigenId: number | null;
            eventoCorrectivoId: number | null;
            eventoPrivacidad: boolean;
            integridad: EstadoIntegridadM9;
            advertenciaIntegridad: string | null;
        }[];
    }>;
    exportar(formato: 'CSV' | 'PDF', filtros: FiltrosM9, scope: ScopeM9): Promise<{
        total: number;
        conjunto: string;
        nombre: string;
        mime: string;
        contenido: string;
    }>;
    resumenAnalitico(scope: ScopeM9): Promise<{
        total: number;
        porResultado: Record<string, number>;
        porModulo: Record<string, number>;
        estado: string;
    }>;
    diagnosticarPendientes(maximoEdadMs: number): Promise<{
        cantidad: number;
        envejecidos: number;
        antiguedadMaximaMs: number | null;
    }>;
    reintentarPendientes(limite?: number, proximoIntentoEn?: Date): Promise<{
        procesados: number;
        exitosos: number;
        fallidos: number;
    }>;
    tratarPorPolitica(eventoId: number, categoriaCodigo: string, fecha?: Date): Promise<{
        estado: string;
        politica: import("../m9/politicas").PoliticaM9 | null;
    }>;
    estadoObservabilidad(maximoEdadMs: number): Promise<{
        metricas: {
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
        pendientes: {
            cantidad: number;
            envejecidos: number;
            antiguedadMaximaMs: number | null;
        };
        retry: {
            exitosos: number;
            fallidos: number;
        };
        almacenamiento: {
            eventos: number;
        };
        senales: import("../m9/puertos").SenalM9[];
        diagnosticos: import("../m9/puertos").DiagnosticoM9[];
    }>;
}
export {};
//# sourceMappingURL=M9Controller.d.ts.map