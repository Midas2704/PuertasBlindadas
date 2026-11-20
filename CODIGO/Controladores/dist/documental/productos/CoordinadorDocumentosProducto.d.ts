import type { CoordinadorCargaDocumental, ResultadoConfirmacionDocumental } from '../operaciones/CoordinadorCargaDocumental';
import { AutorizadorDocumental, type ActorBackendDocumental } from '../seguridad/AutorizacionDocumental';
import { type AsociarProductoEntrada } from '../tipos';
export interface PuertoAsociacionComercial {
    asociarProducto(entrada: AsociarProductoEntrada, actor: {
        id: bigint;
    }): Promise<unknown>;
    registrarEvento?(entrada: {
        tipoEvento: string;
        claveIdempotencia: string;
        idDocumento: bigint;
        idVersion: bigint;
        payloadTecnico: Record<string, unknown>;
    }): Promise<unknown>;
}
/**
 * Coordinación interna preparada para M2. No registra rutas y las acciones de carga siguen
 * cerradas por M4 hasta que existan CU explícitamente aprobados.
 */
export declare class CoordinadorDocumentosProducto {
    private readonly autorizador;
    private readonly coordinadorCarga;
    private readonly asociaciones;
    constructor(autorizador: AutorizadorDocumental, coordinadorCarga: Pick<CoordinadorCargaDocumental, 'confirmar'>, asociaciones: PuertoAsociacionComercial);
    confirmarYAsociar(entrada: {
        idProducto: number;
        idDocumento: bigint;
        idIntencion: string;
        clasificacion: string;
        asociacion: Omit<AsociarProductoEntrada, 'idProducto' | 'idDocumento'>;
        actor: ActorBackendDocumental;
        sha256Esperado?: string;
    }): Promise<{
        confirmacion: ResultadoConfirmacionDocumental;
        asociacion: unknown;
    }>;
}
//# sourceMappingURL=CoordinadorDocumentosProducto.d.ts.map