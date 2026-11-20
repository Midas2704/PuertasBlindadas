import { Prisma } from '@prisma/client';
export declare const incluirPago: {
    medio_pago: true;
    moneda: true;
    categoria_pago: true;
    anulacion_pago: true;
    reversion_pago: true;
};
export declare const incluirNota: {
    moneda: true;
    reversion_nota_venta: true;
    aplicacion_saldo_favor: true;
    asignacion_pago_cliente: {
        include: {
            pago_cliente: {
                include: {
                    medio_pago: true;
                    moneda: true;
                    categoria_pago: true;
                    anulacion_pago: true;
                    reversion_pago: true;
                };
            };
        };
    };
    documento_tributario: {
        include: {
            tipo_documento: true;
        };
    };
    guia_despacho: true;
    condicion_cobro_nv: true;
    cotizacion: {
        include: {
            detalle_cotizacion: {
                include: {
                    item_comercial: true;
                };
            };
        };
    };
};
export declare const incluirCotizacion: {
    moneda: true;
    ficha_cliente: {
        include: {
            cliente_financiero: {
                include: {
                    tipo_cliente_financiero: true;
                };
            };
        };
    };
    tarifa_instalacion: {
        include: {
            moneda: true;
        };
    };
    condicion_comercial: {
        include: {
            condicion: true;
        };
    };
    obra_contexto: true;
    detalle_cotizacion: {
        include: {
            item_comercial: true;
            producto_comercial: true;
            producto_version: true;
            precio_comercial: true;
            detalle_costo_material_cotizacion: {
                include: {
                    historial_precio_material: {
                        include: {
                            material: true;
                        };
                    };
                };
            };
        };
    };
    grupos_alternativas_b2c: {
        include: {
            alternativas: {
                include: {
                    opcionales: true;
                };
                orderBy: {
                    numero_alternativa: "asc";
                };
            };
        };
        orderBy: {
            numero_grupo: "asc";
        };
    };
    contactos_b2b: {
        where: {
            estado: string;
        };
        orderBy: ({
            es_principal: "desc";
            creado_en?: undefined;
        } | {
            creado_en: "asc";
            es_principal?: undefined;
        })[];
    };
    detalles_servicio: {
        include: {
            servicio: true;
            precio: true;
        };
    };
};
export type PagoFinanciero = Prisma.pago_clienteGetPayload<{
    include: typeof incluirPago;
}>;
export type NotaFinanciera = Prisma.nota_ventaGetPayload<{
    include: typeof incluirNota;
}>;
/** Suma monetaria autoritativa de líneas: cantidad × valor unitario. */
export declare function totalLineasComerciales(lineas: ReadonlyArray<{
    cantidad: Prisma.Decimal.Value;
    valor: Prisma.Decimal.Value;
}>): Prisma.Decimal;
export declare const fechaNegocio: (ahora?: Date) => string;
export declare const fechaRegistro: (fecha: Date) => string;
export declare function diasHabilesEntre(desde: string, hasta?: string): number;
export declare function clasificarPorVencer(fecha: Date | null, umbral: number): "sin_vencimiento" | "por_vencer" | "vencida" | "vigente";
export declare function efectoPago(pago: PagoFinanciero): Prisma.Decimal;
export declare function montosNota(nota: NotaFinanciera): {
    montoComercialVigente: Prisma.Decimal;
    pagosEfectivos: Prisma.Decimal;
    saldoAplicado: Prisma.Decimal;
    saldoResultante: Prisma.Decimal;
    saldoPendiente: Prisma.Decimal;
    excedente: Prisma.Decimal;
};
export declare function calcularNota(nota: NotaFinanciera, hoy?: string): {
    montoOriginal: number;
    montoComercialVigente: number;
    pagosEfectivos: number;
    saldoAplicado: number;
    saldoResultante: number;
    saldoPendiente: number;
    excedente: number;
    esMorosa: boolean;
    fechaVencimientoPendiente: boolean;
    estadoPago: string;
};
export declare function resumirNotas(notas: NotaFinanciera[]): {
    moneda: string;
    montoComercialVigente: number;
    pagosEfectivos: number;
    saldoPendiente: number;
    deudaVigente: number;
    obligacionesMorosas: number;
    excedente: number;
}[];
/** Consolida en CLP usando exclusivamente la conversión histórica guardada en cada NV. */
export declare function consolidarNotasClp(notas: NotaFinanciera[]): {
    moneda: string;
    montoComercialVigente: number;
    pagosEfectivos: number;
    saldoPendiente: number;
    deudaVigente: number;
    obligacionesMorosas: number;
    excedente: number;
    operacionesSinConversion: {
        idNota: number;
        numeroNota: string;
        moneda: string;
    }[];
    cantidadSinConversion: number;
};
export declare function estadoVisibleNota(nota: NotaFinanciera, estadoPago?: string): string;
/** Mantiene la columna de consulta estado_pago alineada con los movimientos vigentes. */
export declare function sincronizarEstadoPago(tx: Prisma.TransactionClient, nota: NotaFinanciera): Promise<{
    estado_pago: string;
    estadoNotaVentaVisible: string;
    montoOriginal: number;
    montoComercialVigente: number;
    pagosEfectivos: number;
    saldoAplicado: number;
    saldoResultante: number;
    saldoPendiente: number;
    excedente: number;
    esMorosa: boolean;
    fechaVencimientoPendiente: boolean;
    estadoPago: string;
}>;
//# sourceMappingURL=finanzas.d.ts.map