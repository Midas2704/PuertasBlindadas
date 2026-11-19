import { Prisma } from '@prisma/client';
import { NotaFinanciera } from './finanzas';
export declare function clasificarMedioPago(nombre: string): {
    credito: boolean;
    cheque: boolean;
    efectivo: boolean;
};
export type CategoriaPagoSugerida = 'Pago final' | 'Anticipo' | 'Abono parcial';
export declare function sugerirCategoriaPago(nota: NotaFinanciera, montoEntrada: unknown): CategoriaPagoSugerida;
export declare function prepararPago(nota: NotaFinanciera, entrada: Record<string, unknown>, catalogo: {
    medios: {
        id_medio_pago: number;
        nombre_medio_pago: string;
    }[];
    categorias: {
        id_categoria_pago: number;
        nombre: string;
    }[];
    cuotas: {
        cantidad: number;
    }[];
}, idDocumento: number | null, responsable: string): {
    id_ficha_cliente: number;
    id_moneda: number;
    id_medio_pago: number;
    id_categoria_pago: number;
    cantidad_cuotas: number | null;
    fecha_pago: Date;
    monto_pago: Prisma.Decimal;
    comprobante_pago: string;
    tipo_cambio_usado: Prisma.Decimal | null;
    monto_convertido: Prisma.Decimal | null;
    observacion: string;
    antecedentes_medio: string | Prisma.InputJsonObject | undefined;
    asignacion_pago_cliente: {
        create: {
            id_nota_venta: number;
            id_documento_tributario: number | null;
            monto_asignado: Prisma.Decimal;
        };
    };
};
//# sourceMappingURL=pago.d.ts.map