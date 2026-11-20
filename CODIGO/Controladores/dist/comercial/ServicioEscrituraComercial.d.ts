import { Prisma } from '@prisma/client';
import { type ActorComercialM4, type OperacionSeguraComercial } from './SeguridadCapacidadesComerciales';
/** Escrituras C2.7: transaccionales, idempotentes y con filas históricas conservadas. */
export declare class ServicioEscrituraComercial {
    private readonly autorizador;
    ejecutar(operacion: OperacionSeguraComercial, entradaDesconocida: unknown, actor: ActorComercialM4): Promise<string | number | boolean | Prisma.JsonArray | Record<string, unknown>>;
    private mutar;
    private desactivar;
}
//# sourceMappingURL=ServicioEscrituraComercial.d.ts.map