import type { CoordinadorCargaDocumental, ResultadoConfirmacionDocumental } from '../operaciones/CoordinadorCargaDocumental';
import { AutorizadorDocumental, type ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';
import { ErrorDocumental, type AsociarProductoEntrada } from '../tipos';

export interface PuertoAsociacionComercial {
  asociarProducto(entrada: AsociarProductoEntrada, actor: { id: bigint }): Promise<unknown>;
  registrarEvento?(entrada: { tipoEvento: string; claveIdempotencia: string; idDocumento: bigint; idVersion: bigint; payloadTecnico: Record<string, unknown> }): Promise<unknown>;
}

/**
 * Coordinación interna preparada para M2. No registra rutas y las acciones de carga siguen
 * cerradas por M4 hasta que existan CU explícitamente aprobados.
 */
export class CoordinadorDocumentosProducto {
  constructor(
    private readonly autorizador: AutorizadorDocumental,
    private readonly coordinadorCarga: Pick<CoordinadorCargaDocumental, 'confirmar'>,
    private readonly asociaciones: PuertoAsociacionComercial,
  ) {}

  async confirmarYAsociar(entrada: {
    idProducto: number;
    idDocumento: bigint;
    idIntencion: string;
    clasificacion: string;
    asociacion: Omit<AsociarProductoEntrada, 'idProducto' | 'idDocumento'>;
    actor: ActorBackendDocumental;
    sha256Esperado?: string;
  }): Promise<{ confirmacion: ResultadoConfirmacionDocumental; asociacion: unknown }> {
    if (entrada.clasificacion !== 'COMERCIAL') throw new ErrorDocumental('CLASIFICACION_DOCUMENTAL_NO_AUTORIZADA', 'La coordinación de productos acepta únicamente documentos comerciales', 403);
    const contexto = { idProducto: entrada.idProducto, idDocumento: entrada.idDocumento };
    await this.autorizador.exigir(entrada.actor, 'CONFIRMAR_CARGA', contexto);
    const confirmacion = await this.coordinadorCarga.confirmar({ idIntencion: entrada.idIntencion, idDocumento: entrada.idDocumento, actor: entrada.actor, sha256Esperado: entrada.sha256Esperado });
    if (confirmacion.estado !== 'DISPONIBLE' || confirmacion.antivirus.estado !== 'LIMPIO' || !confirmacion.integridad.valido) {
      throw new ErrorDocumental('DOCUMENTO_NO_ASOCIABLE', 'Sólo una versión íntegra, limpia y disponible puede asociarse', 409);
    }
    await this.autorizador.exigir(entrada.actor, 'ASOCIAR_PRODUCTO', contexto);
    let asociacion: unknown;
    try {
      asociacion = await this.asociaciones.asociarProducto({ idProducto: entrada.idProducto, idDocumento: entrada.idDocumento, ...entrada.asociacion }, { id: entrada.actor.id });
    } catch (error) {
      // La versión ya confirmada nunca se elimina como compensación. El evento técnico deja una
      // intención de reconciliación idempotente cuando PostgreSQL aún permite registrar el fallo.
      try {
        await this.asociaciones.registrarEvento?.({
          tipoEvento: 'ASOCIACION_PRODUCTO_PENDIENTE',
          claveIdempotencia: `asociacion-pendiente:${entrada.idIntencion}:${entrada.idProducto}:${entrada.asociacion.tipoDocumento}`,
          idDocumento: entrada.idDocumento,
          idVersion: confirmacion.versionId,
          payloadTecnico: { idProducto: entrada.idProducto, tipoDocumento: entrada.asociacion.tipoDocumento },
        });
      } catch { /* El reintento determinista y la reconciliación de versiones siguen disponibles. */ }
      throw error;
    }
    return { confirmacion, asociacion };
  }
}
