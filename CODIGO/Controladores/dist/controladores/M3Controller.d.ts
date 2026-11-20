import { Prisma } from '@prisma/client';
import { BancoCentral } from '../utilidades/C_BancoCentral';
/** M3 CU42–CU58: pagos, reversas, saldos a favor y conciliación. */
export declare class M3Controller {
    private readonly bancoCentral;
    constructor(bancoCentral?: BancoCentral);
    registrarPago(entrada: Record<string, unknown>, responsable: string): Promise<{
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
        mensaje: string;
        idPago: number;
    }>;
    recalcularSaldo(tx: Prisma.TransactionClient, idNota: number): Promise<{
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
    procesarExcedente(tx: Prisma.TransactionClient, idNota: number, idReversion: number, entrada: Record<string, unknown>): Promise<{
        excedenteGestionado: number;
        destino: string;
        mensaje: string;
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
    } | {
        mensaje: string;
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
    consultarPago(idPago: number): Promise<{
        montoEfectivo: number;
        asignacion_pago_cliente: ({
            documento_tributario: ({
                tipo_documento: {
                    id_tipo_documento: number;
                    nombre_tipo_documento: string;
                    descripcion_tipo_documento: string | null;
                    aplica_venta: boolean;
                    aplica_compra: boolean;
                    requiere_vencimiento: boolean;
                    afecta_impuesto: boolean;
                    estado_tipo_documento: string;
                };
            } & {
                observacion: string | null;
                id_nota_venta: number | null;
                id_documento_tributario: number;
                id_moneda: number;
                monto_neto: Prisma.Decimal;
                monto_impuesto: Prisma.Decimal;
                id_ficha_cliente: number;
                fecha_emision: Date;
                fecha_vencimiento: Date | null;
                id_tipo_documento: number;
                monto_total: Prisma.Decimal;
                estado_documento: string;
                respaldo_documento: string | null;
                id_documento_referencia: number | null;
                folio_documento: string;
                fecha_anulacion: Date | null;
            }) | null;
            nota_venta: {
                moneda: {
                    id_moneda: number;
                    codigo_moneda: string;
                    nombre_moneda: string;
                    simbolo_moneda: string | null;
                    estado_moneda: string;
                };
            } & {
                observacion: string | null;
                id_nota_venta: number;
                id_moneda: number;
                exento_iva: boolean;
                monto_neto: Prisma.Decimal;
                monto_impuesto: Prisma.Decimal;
                id_cotizacion: number | null;
                id_ficha_cliente: number;
                fecha_emision: Date;
                fecha_vencimiento: Date | null;
                monto_total: Prisma.Decimal;
                tipo_cambio_usado: Prisma.Decimal | null;
                monto_convertido: Prisma.Decimal | null;
                fecha_anulacion: Date | null;
                id_proyecto_contexto: bigint | null;
                numero_nota_venta: string;
                estado_nota_venta: string;
                estado_pago: string;
                descuento_aplicado: Prisma.Decimal | null;
                motivo_descuento: string | null;
                motivo_anulacion: string | null;
            };
        } & {
            observacion: string | null;
            id_asignacion_pago_cliente: number;
            id_pago_cliente: number;
            id_nota_venta: number;
            id_documento_tributario: number | null;
            id_hito_cobro: number | null;
            monto_asignado: Prisma.Decimal;
            fecha_asignacion: Date;
        }) | null;
        conciliacion: {
            observacion: string | null;
            id_pago_cliente: number | null;
            evidencia: string | null;
            id_conciliacion: number;
            id_movimiento_financiero: number | null;
            id_movimiento_bancario: number | null;
            fecha_conciliacion: Date;
            monto_conciliado: Prisma.Decimal;
            diferencia_conciliacion: Prisma.Decimal | null;
            estado_conciliacion: string;
            responsable_conciliacion: string | null;
        }[];
        ficha_cliente: {
            cliente_financiero: {
                referencia_demostracion: string | null;
                nivel_formalizacion: string;
                id_cliente_financiero: number;
                rut_cliente: string | null;
                id_tipo_cliente_financiero: number;
                nombre_razon_social_referencia: string;
                contacto_financiero: string | null;
                correo_financiero: string | null;
                telefono_financiero: string | null;
                estado_financiero: string;
                fecha_actualizacion_datos_cliente: Date;
            };
        } & {
            id_cliente_financiero: number;
            id_ficha_cliente: number;
            fecha_creacion: Date;
            estado_ficha: string;
            fecha_ultima_revision: Date | null;
            observacion_financiera_general: string | null;
        };
        medio_pago: {
            id_medio_pago: number;
            nombre_medio_pago: string;
            descripcion_medio_pago: string | null;
            estado_medio_pago: string;
            codigo_medio_pago: string | null;
            requiere_respaldo: boolean | null;
        };
        moneda: {
            id_moneda: number;
            codigo_moneda: string;
            nombre_moneda: string;
            simbolo_moneda: string | null;
            estado_moneda: string;
        };
        anulacion_pago: {
            id_pago_cliente: number;
            motivo: string;
            respaldo: string;
            fecha: Date;
            responsable: string;
            id_anulacion_pago: number;
        } | null;
        reversion_pago: {
            id_pago_cliente: number;
            motivo: string;
            monto: Prisma.Decimal;
            respaldo: string;
            fecha: Date;
            responsable: string;
            id_reversion_pago: number;
        }[];
        categoria_pago: {
            id_categoria_pago: number;
            nombre: string;
            activo: boolean;
        } | null;
        observacion: string | null;
        id_pago_cliente: number;
        referencia_demostracion: string | null;
        estado_conciliacion: string;
        id_moneda: number;
        id_ficha_cliente: number;
        tipo_cambio_usado: Prisma.Decimal | null;
        monto_convertido: Prisma.Decimal | null;
        fecha_registro: Date;
        id_medio_pago: number;
        id_categoria_pago: number | null;
        cantidad_cuotas: number | null;
        antecedentes_medio: Prisma.JsonValue | null;
        fecha_pago: Date;
        monto_pago: Prisma.Decimal;
        naturaleza_pago: string;
        estado_verificacion: string;
        comprobante_pago: string | null;
    }>;
    consultarSaldo(idNota: number): Promise<{
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
        idNota: number;
        moneda: string;
    }>;
    consultarCatalogos(idFicha?: number): Promise<{
        medios: {
            id_medio_pago: number;
            nombre_medio_pago: string;
            descripcion_medio_pago: string | null;
            estado_medio_pago: string;
            codigo_medio_pago: string | null;
            requiere_respaldo: boolean | null;
        }[];
        categorias: {
            id_categoria_pago: number;
            nombre: string;
            activo: boolean;
        }[];
        cuotas: {
            activo: boolean;
            cantidad: number;
        }[];
        documentos: {
            tipo_documento: {
                nombre_tipo_documento: string;
            };
            documento_tributario_nota_venta: {
                id_nota_venta: number;
            }[];
            id_documento_tributario: number;
            folio_documento: string;
        }[];
    }>;
    consultarTipoCambio(moneda: string): Promise<{
        moneda: string;
        valor: number;
    }>;
    contextoPago(idFicha: number): Promise<{
        notas: {
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
            asignacion_pago_cliente: ({
                pago_cliente: {
                    medio_pago: {
                        id_medio_pago: number;
                        nombre_medio_pago: string;
                        descripcion_medio_pago: string | null;
                        estado_medio_pago: string;
                        codigo_medio_pago: string | null;
                        requiere_respaldo: boolean | null;
                    };
                    moneda: {
                        id_moneda: number;
                        codigo_moneda: string;
                        nombre_moneda: string;
                        simbolo_moneda: string | null;
                        estado_moneda: string;
                    };
                    anulacion_pago: {
                        id_pago_cliente: number;
                        motivo: string;
                        respaldo: string;
                        fecha: Date;
                        responsable: string;
                        id_anulacion_pago: number;
                    } | null;
                    reversion_pago: {
                        id_pago_cliente: number;
                        motivo: string;
                        monto: Prisma.Decimal;
                        respaldo: string;
                        fecha: Date;
                        responsable: string;
                        id_reversion_pago: number;
                    }[];
                    categoria_pago: {
                        id_categoria_pago: number;
                        nombre: string;
                        activo: boolean;
                    } | null;
                } & {
                    observacion: string | null;
                    id_pago_cliente: number;
                    referencia_demostracion: string | null;
                    estado_conciliacion: string;
                    id_moneda: number;
                    id_ficha_cliente: number;
                    tipo_cambio_usado: Prisma.Decimal | null;
                    monto_convertido: Prisma.Decimal | null;
                    fecha_registro: Date;
                    id_medio_pago: number;
                    id_categoria_pago: number | null;
                    cantidad_cuotas: number | null;
                    antecedentes_medio: Prisma.JsonValue | null;
                    fecha_pago: Date;
                    monto_pago: Prisma.Decimal;
                    naturaleza_pago: string;
                    estado_verificacion: string;
                    comprobante_pago: string | null;
                };
            } & {
                observacion: string | null;
                id_asignacion_pago_cliente: number;
                id_pago_cliente: number;
                id_nota_venta: number;
                id_documento_tributario: number | null;
                id_hito_cobro: number | null;
                monto_asignado: Prisma.Decimal;
                fecha_asignacion: Date;
            })[];
            cotizacion: ({
                detalle_cotizacion: ({
                    item_comercial: {
                        id_item_comercial: number;
                        nombre_item: string;
                        descripcion_item: string | null;
                        tipo_item: string | null;
                        estado_item: string;
                    };
                } & {
                    revision: number;
                    id_cotizacion: number;
                    id_detalle_cotizacion: number;
                    id_item_comercial: number;
                    cantidad_item: Prisma.Decimal;
                    medida_alto_referencial: Prisma.Decimal | null;
                    medida_ancho_referencial: Prisma.Decimal | null;
                    medida_espesor_referencial: Prisma.Decimal | null;
                    descripcion_item_cotizado: string | null;
                    observacion_medidas: string | null;
                    subtotal_item_estimado: Prisma.Decimal;
                    id_extension_producto_comercial: number | null;
                    id_producto_comercial_version: number | null;
                    id_precio_producto_comercial: bigint | null;
                    id_alternativa_b2c_aceptada: bigint | null;
                    tipo_linea_comercial: string | null;
                    precio_lista_aplicado: Prisma.Decimal | null;
                    precio_unitario_autorizado: Prisma.Decimal | null;
                    descuento_elegible: boolean | null;
                    es_precio_excepcional: boolean;
                    motivo_precio_excepcional: string | null;
                    precio_excepcional_autorizado_por: bigint | null;
                    snapshot_comercial: Prisma.JsonValue | null;
                })[];
            } & {
                observacion: string | null;
                referencia_demostracion: string | null;
                id_moneda: number;
                exento_iva: boolean;
                descuento_tipo: string | null;
                descuento_valor: Prisma.Decimal;
                monto_neto: Prisma.Decimal | null;
                monto_impuesto: Prisma.Decimal | null;
                segmento_comercial: string | null;
                nombre_proyecto: string | null;
                referencia_comercial: string | null;
                alcance_comercial: string | null;
                requiere_instalacion: string | null;
                direccion_instalacion: string | null;
                region_instalacion: string | null;
                ciudad_instalacion: string | null;
                comuna_instalacion: string | null;
                estado_cobertura_instalacion: string | null;
                id_tarifa_instalacion_comercial: bigint | null;
                precio_instalacion_aplicado: Prisma.Decimal | null;
                id_condicion_comercial_version: bigint | null;
                responsable_comercial: bigint | null;
                id_obra_contexto: bigint | null;
                revision: number;
                id_cotizacion: number;
                id_ficha_cliente: number;
                fecha_emision: Date;
                fecha_vigencia: Date | null;
                subtotal_costos_estimados: Prisma.Decimal;
                margen_esperado: Prisma.Decimal | null;
                precio_sugerido: Prisma.Decimal | null;
                monto_total_estimado: Prisma.Decimal | null;
                estado_cotizacion: string;
            }) | null;
            documento_tributario: ({
                tipo_documento: {
                    id_tipo_documento: number;
                    nombre_tipo_documento: string;
                    descripcion_tipo_documento: string | null;
                    aplica_venta: boolean;
                    aplica_compra: boolean;
                    requiere_vencimiento: boolean;
                    afecta_impuesto: boolean;
                    estado_tipo_documento: string;
                };
            } & {
                observacion: string | null;
                id_nota_venta: number | null;
                id_documento_tributario: number;
                id_moneda: number;
                monto_neto: Prisma.Decimal;
                monto_impuesto: Prisma.Decimal;
                id_ficha_cliente: number;
                fecha_emision: Date;
                fecha_vencimiento: Date | null;
                id_tipo_documento: number;
                monto_total: Prisma.Decimal;
                estado_documento: string;
                respaldo_documento: string | null;
                id_documento_referencia: number | null;
                folio_documento: string;
                fecha_anulacion: Date | null;
            })[];
            moneda: {
                id_moneda: number;
                codigo_moneda: string;
                nombre_moneda: string;
                simbolo_moneda: string | null;
                estado_moneda: string;
            };
            guia_despacho: {
                estado: string;
                id_nota_venta: number;
                fecha_emision: Date;
                folio: string;
                antecedentes: Prisma.JsonValue | null;
                id_guia_despacho: number;
            }[];
            condicion_cobro_nv: {
                id_nota_venta: number;
                descripcion: string;
                id_condicion_cobro_nv: number;
                monto_referencia: Prisma.Decimal | null;
                porcentaje_referencia: Prisma.Decimal | null;
                evento_referencia: string | null;
            }[];
            reversion_nota_venta: {
                id_nota_venta: number;
                motivo: string;
                monto: Prisma.Decimal;
                fecha: Date;
                destino_excedente: string | null;
                id_reversion_nota_venta: number;
                responsable: string;
                folio_nota_credito: string;
                respaldo_pdf: string;
            }[];
            aplicacion_saldo_favor: {
                id_nota_venta: number;
                monto: Prisma.Decimal;
                fecha: Date;
                responsable: string;
                id_saldo_favor_cliente: number;
                id_aplicacion_saldo_favor: number;
            }[];
            observacion: string | null;
            id_nota_venta: number;
            id_moneda: number;
            exento_iva: boolean;
            monto_neto: Prisma.Decimal;
            monto_impuesto: Prisma.Decimal;
            id_cotizacion: number | null;
            id_ficha_cliente: number;
            fecha_emision: Date;
            fecha_vencimiento: Date | null;
            monto_total: Prisma.Decimal;
            tipo_cambio_usado: Prisma.Decimal | null;
            monto_convertido: Prisma.Decimal | null;
            fecha_anulacion: Date | null;
            id_proyecto_contexto: bigint | null;
            numero_nota_venta: string;
            estado_nota_venta: string;
            descuento_aplicado: Prisma.Decimal | null;
            motivo_descuento: string | null;
            motivo_anulacion: string | null;
        }[];
        pagos: {
            montoEfectivo: number;
            medio_pago: {
                id_medio_pago: number;
                nombre_medio_pago: string;
                descripcion_medio_pago: string | null;
                estado_medio_pago: string;
                codigo_medio_pago: string | null;
                requiere_respaldo: boolean | null;
            };
            moneda: {
                id_moneda: number;
                codigo_moneda: string;
                nombre_moneda: string;
                simbolo_moneda: string | null;
                estado_moneda: string;
            };
            anulacion_pago: {
                id_pago_cliente: number;
                motivo: string;
                respaldo: string;
                fecha: Date;
                responsable: string;
                id_anulacion_pago: number;
            } | null;
            reversion_pago: {
                id_pago_cliente: number;
                motivo: string;
                monto: Prisma.Decimal;
                respaldo: string;
                fecha: Date;
                responsable: string;
                id_reversion_pago: number;
            }[];
            categoria_pago: {
                id_categoria_pago: number;
                nombre: string;
                activo: boolean;
            } | null;
            observacion: string | null;
            id_pago_cliente: number;
            referencia_demostracion: string | null;
            estado_conciliacion: string;
            id_moneda: number;
            id_ficha_cliente: number;
            tipo_cambio_usado: Prisma.Decimal | null;
            monto_convertido: Prisma.Decimal | null;
            fecha_registro: Date;
            id_medio_pago: number;
            id_categoria_pago: number | null;
            cantidad_cuotas: number | null;
            antecedentes_medio: Prisma.JsonValue | null;
            fecha_pago: Date;
            monto_pago: Prisma.Decimal;
            naturaleza_pago: string;
            estado_verificacion: string;
            comprobante_pago: string | null;
        }[];
        medios: {
            id_medio_pago: number;
            nombre_medio_pago: string;
            descripcion_medio_pago: string | null;
            estado_medio_pago: string;
            codigo_medio_pago: string | null;
            requiere_respaldo: boolean | null;
        }[];
        categorias: {
            id_categoria_pago: number;
            nombre: string;
            activo: boolean;
        }[];
        cuotas: {
            activo: boolean;
            cantidad: number;
        }[];
        documentos: {
            tipo_documento: {
                nombre_tipo_documento: string;
            };
            documento_tributario_nota_venta: {
                id_nota_venta: number;
            }[];
            id_documento_tributario: number;
            folio_documento: string;
        }[];
    }>;
    anularPago(idPago: number, entrada: Record<string, unknown>, responsable: string): Promise<{
        estado_pago?: string | undefined;
        estadoNotaVentaVisible?: string | undefined;
        montoOriginal?: number | undefined;
        montoComercialVigente?: number | undefined;
        pagosEfectivos?: number | undefined;
        saldoAplicado?: number | undefined;
        saldoResultante?: number | undefined;
        saldoPendiente?: number | undefined;
        excedente?: number | undefined;
        esMorosa?: boolean | undefined;
        fechaVencimientoPendiente?: boolean | undefined;
        estadoPago?: string | undefined;
        mensaje: string;
    }>;
    revertirPago(idPago: number, entrada: Record<string, unknown>, responsable: string): Promise<{
        estado_pago?: string | undefined;
        estadoNotaVentaVisible?: string | undefined;
        montoOriginal?: number | undefined;
        montoComercialVigente?: number | undefined;
        pagosEfectivos?: number | undefined;
        saldoAplicado?: number | undefined;
        saldoResultante?: number | undefined;
        saldoPendiente?: number | undefined;
        excedente?: number | undefined;
        esMorosa?: boolean | undefined;
        fechaVencimientoPendiente?: boolean | undefined;
        estadoPago?: string | undefined;
        mensaje: string;
    }>;
    aplicarSaldoFavor(idSaldo: number, entrada: Record<string, unknown>, responsable: string): Promise<{
        mensaje: string;
    }>;
    consultarMorosidad(idNota: number): Promise<{
        idNota: number;
        moroso: boolean;
        fechaVencimiento: Date | null;
        saldoPendiente: number;
        situacion: string;
    }>;
    generarComprobante(idPago: number): Promise<{
        nombre: string;
        mime: string;
        contenido: string;
    }>;
    conciliarPago(idPago: number, entrada: Record<string, unknown>, responsable: string): Promise<{
        mensaje: string;
        conciliacion: {
            observacion: string | null;
            id_pago_cliente: number | null;
            evidencia: string | null;
            id_conciliacion: number;
            id_movimiento_financiero: number | null;
            id_movimiento_bancario: number | null;
            fecha_conciliacion: Date;
            monto_conciliado: Prisma.Decimal;
            diferencia_conciliacion: Prisma.Decimal | null;
            estado_conciliacion: string;
            responsable_conciliacion: string | null;
        };
    }>;
}
//# sourceMappingURL=M3Controller.d.ts.map