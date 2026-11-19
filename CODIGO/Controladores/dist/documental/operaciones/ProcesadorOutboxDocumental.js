"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcesadorOutboxDocumental = void 0;
const codigoSeguro = (error) => {
    const codigo = error && typeof error === 'object' && 'codigo' in error ? String(error.codigo) : 'ERROR_MANEJADOR';
    return /^[A-Z0-9_]{1,100}$/.test(codigo) ? codigo : 'ERROR_MANEJADOR';
};
/** Ejecución explícita. Importar este módulo no inicia timers, workers ni conexiones. */
class ProcesadorOutboxDocumental {
    constructor(repositorio, manejadores, maximoIntentos = 5) {
        this.repositorio = repositorio;
        this.manejadores = manejadores;
        this.maximoIntentos = maximoIntentos;
    }
    async procesarUno(fecha = new Date()) {
        const evento = await this.repositorio.reclamarSiguienteEvento(fecha, new Date(fecha.getTime() + 60000));
        if (!evento)
            return 'SIN_EVENTOS';
        if (!evento.lease_token)
            throw new Error('EVENTO_SIN_LEASE');
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
        }
        catch (error) {
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
exports.ProcesadorOutboxDocumental = ProcesadorOutboxDocumental;
//# sourceMappingURL=ProcesadorOutboxDocumental.js.map