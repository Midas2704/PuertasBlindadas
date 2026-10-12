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

const codigoSeguro = (error: unknown) => {
  const codigo = error && typeof error === 'object' && 'codigo' in error ? String(error.codigo) : 'ERROR_MANEJADOR';
  return /^[A-Z0-9_]{1,100}$/.test(codigo) ? codigo : 'ERROR_MANEJADOR';
};

/** Ejecución explícita. Importar este módulo no inicia timers, workers ni conexiones. */
export class ProcesadorOutboxDocumental {
  constructor(private readonly repositorio: RepositorioOutboxDocumental, private readonly manejadores: Readonly<Record<string, ManejadorOutboxDocumental>>, private readonly maximoIntentos = 5) {}

  async procesarUno(fecha = new Date()): Promise<'SIN_EVENTOS' | 'PROCESADO' | 'REINTENTO' | 'DESCARTADO'> {
    const evento = await this.repositorio.reclamarSiguienteEvento(fecha, new Date(fecha.getTime() + 60_000));
    if (!evento) return 'SIN_EVENTOS';
    if (!evento.lease_token) throw new Error('EVENTO_SIN_LEASE');
    const manejador = this.manejadores[evento.tipo_evento];
    if (!manejador) {
      await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'ERROR', 'MANEJADOR_NO_CONFIGURADO', evento.lease_token);
      await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'DESCARTADO', 'MANEJADOR_NO_CONFIGURADO');
      return 'DESCARTADO';
    }
    try {
      await manejador(evento);
      await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'PROCESADO', null, evento.lease_token);
      return 'PROCESADO';
    } catch (error) {
      const codigo = codigoSeguro(error);
      await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'ERROR', codigo, evento.lease_token);
      if (evento.cantidad_intentos >= this.maximoIntentos) {
        await this.repositorio.cambiarEstadoEvento(evento.id_evento_operacional, 'DESCARTADO', codigo);
        return 'DESCARTADO';
      }
      return 'REINTENTO';
    }
  }
}
