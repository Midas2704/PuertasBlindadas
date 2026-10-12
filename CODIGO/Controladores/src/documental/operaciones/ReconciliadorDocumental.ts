import type { StorageAdapter } from '../StorageAdapter';

export type TipoHallazgoReconciliacion = 'OBJETO_FALTANTE' | 'TAMANO_DIVERGENTE' | 'INTENCION_EXPIRADA' | 'EVENTO_ATASCADO' | 'MULTIPART_ABANDONADO' | 'HUERFANOS_NO_EVALUABLES';
export interface HallazgoReconciliacion { tipo: TipoHallazgoReconciliacion; referencia: string; detalle?: string }
export interface VersionParaReconciliar { id: bigint; contenedor: string; clave: string; tamano: bigint; estado: string }
export interface IntencionParaReconciliar { id: string; estado: string; expiraEn: Date }
export interface EventoParaReconciliar { id: bigint; estado: string; creadoEn: Date }

/** Sólo diagnostica. No elimina, mueve ni repara objetos automáticamente. */
export class ReconciliadorDocumental {
  constructor(private readonly storage: StorageAdapter) {}

  async diagnosticar(entrada: { versiones: readonly VersionParaReconciliar[]; intenciones: readonly IntencionParaReconciliar[]; eventos: readonly EventoParaReconciliar[]; ahora?: Date; contenedorTemporal?: string }): Promise<readonly HallazgoReconciliacion[]> {
    const ahora = entrada.ahora ?? new Date();
    const hallazgos: HallazgoReconciliacion[] = [];
    for (const version of entrada.versiones.filter(item => item.estado === 'DISPONIBLE')) {
      try {
        const objeto = await this.storage.consultarObjeto({ contenedor: version.contenedor, clave: version.clave });
        if (objeto.tamanoBytes !== version.tamano) hallazgos.push({ tipo: 'TAMANO_DIVERGENTE', referencia: version.id.toString() });
      } catch { hallazgos.push({ tipo: 'OBJETO_FALTANTE', referencia: version.id.toString() }); }
    }
    for (const intencion of entrada.intenciones) if (!['DISPONIBLE', 'CUARENTENA', 'EXPIRADA', 'CANCELADA'].includes(intencion.estado) && intencion.expiraEn <= ahora) hallazgos.push({ tipo: 'INTENCION_EXPIRADA', referencia: intencion.id });
    for (const evento of entrada.eventos) if (['PENDIENTE', 'PROCESANDO'].includes(evento.estado) && ahora.getTime() - evento.creadoEn.getTime() > 300_000) hallazgos.push({ tipo: 'EVENTO_ATASCADO', referencia: evento.id.toString() });
    if (entrada.contenedorTemporal && this.storage.listarCargasIncompletas) {
      const cargas = await this.storage.listarCargasIncompletas({ contenedor: entrada.contenedorTemporal });
      for (const carga of cargas) hallazgos.push({ tipo: 'MULTIPART_ABANDONADO', referencia: carga.identificadorMultipart });
    }
    hallazgos.push({ tipo: 'HUERFANOS_NO_EVALUABLES', referencia: 'storage', detalle: 'El contrato actual no lista objetos finales; no se ejecuta limpieza destructiva.' });
    return hallazgos;
  }
}
