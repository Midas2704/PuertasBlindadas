import type { EstadoOutbox } from '../tipos';
export interface EventoOutboxProcesable {
    id_evento_operacional: bigint;
    tipo_evento: string;
    estado: string;
    cantidad_intentos: number;
    lease_token: string | null;
    payload_tecnico: unknown;
}
export interface RepositorioOutboxDocumental {
    reclamarSiguienteEvento(fecha: Date, leaseHasta: Date): Promise<EventoOutboxProcesable | null>;
    cambiarEstadoEvento(id: bigint, siguiente: EstadoOutbox, codigoError?: string | null, leaseToken?: string): Promise<unknown>;
}
export type ManejadorOutboxDocumental = (evento: EventoOutboxProcesable) => Promise<void>;
/** Ejecución explícita. Importar este módulo no inicia timers, workers ni conexiones. */
export declare class ProcesadorOutboxDocumental {
    private readonly repositorio;
    private readonly manejadores;
    private readonly maximoIntentos;
    constructor(repositorio: RepositorioOutboxDocumental, manejadores: Readonly<Record<string, ManejadorOutboxDocumental>>, maximoIntentos?: number);
    procesarUno(fecha?: Date): Promise<'SIN_EVENTOS' | 'PROCESADO' | 'REINTENTO' | 'DESCARTADO'>;
}
//# sourceMappingURL=ProcesadorOutboxDocumental.d.ts.map