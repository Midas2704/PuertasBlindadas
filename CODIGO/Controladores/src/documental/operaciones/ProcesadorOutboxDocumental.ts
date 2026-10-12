import type { EstadoOutbox } from '../tipos';

export interface EventoOutboxProcesable {
  id_evento_operacional: bigint;
  tipo_evento: string;
  estado: string;
  cantidad_intentos: number;
  payload_tecnico: unknown;
}

export interface RepositorioOutboxDocumental {
  reclamarSiguienteEvento(fecha: Date, leaseHasta: Date): Promise<EventoOutboxProcesable | null>;
  cambiarEstadoEvento(id: bigint, siguiente: EstadoOutbox, codigoError?: string | null): Promise<unknown>;
}

export type ManejadorOutboxDocumental = (evento: EventoOutboxProcesable) => Promise<void>;

/** Ejecución explícita. Importar este módulo no inicia timers, workers ni conexiones. */
export class ProcesadorOutboxDocumental {
  constructor(private readonly repositorio: RepositorioOutboxDocumental, private readonly manejadores: Readonly<Record<string, ManejadorOutboxDocumental>>, private readonly maximoIntentos = 5) {}

  async procesarUno(fecha = new Date()): Promise<'SIN_EVENTOS' | 'PROCESADO' | 'REINTENTO' | 'DESCARTADO'> {
    const evento = await this.repositorio.reclamarSiguienteEvento(fecha, new Date(fecha.getTime() + 60_000));
    if (!evento) return 'SIN_EVENTOS';
    const manejador = this.manejadores[evento.tipo_evento];
    if (!manejador) {
      await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'ERROR', 'MANEJADOR_NO_CONFIGURADO');
      await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'DESCARTADO', 'MANEJADOR_NO_CONFIGURADO');
      return 'DESCARTADO';
    }
    try {
      await manejador(evento);
      await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'PROCESADO');
      return 'PROCESADO';
    } catch (error) {
      const codigo = error instanceof Error ? error.message.slice(0, 100) : 'ERROR_NO_NORMALIZADO';
      await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'ERROR', codigo);
      if (evento.cantidad_intentos + 1 >= this.maximoIntentos) {
        await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'DESCARTADO', codigo);
        return 'DESCARTADO';
      }
      return 'REINTENTO';
    }
  }
}
