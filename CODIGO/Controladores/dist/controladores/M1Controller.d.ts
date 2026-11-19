import { Prisma } from '@prisma/client';
import { FiltrosClientes } from '../validaciones/solicitudes';
/** M1 CU01–CU11: catálogo, ficha y mantenimiento de clientes. */
export declare class M1Controller {
    crearCliente(entrada: Record<string, unknown>): Promise<{
        mensaje: string;
        cliente: {
            ficha_cliente: {
                id_cliente_financiero: number;
                id_ficha_cliente: number;
                fecha_creacion: Date;
                estado_ficha: string;
                fecha_ultima_revision: Date | null;
                observacion_financiera_general: string | null;
            } | null;
            tipo_cliente_financiero: {
                id_tipo_cliente_financiero: number;
                nombre_tipo_cliente_financiero: string;
                descripcion_tipo_cliente_financiero: string | null;
                estado_tipo_cliente_financiero: string;
            };
        } & {
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
    }>;
    actualizarCliente(id: number, entrada: Record<string, unknown>): Promise<{
        mensaje: string;
        cliente: {
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
    }>;
    cambiarEstadoCliente(id: number, estado: 'activo' | 'inactivo', confirmado: boolean): Promise<{
        mensaje: string;
    }>;
    listarClientes(filtros: FiltrosClientes): Promise<{
        id_cliente_financiero: number;
        id_ficha_cliente: number | null;
        referencia: string;
        rut: string | null;
        razonSocial: string;
        telefono: string | null;
        correo: string | null;
        tipoCliente: string;
        estado: string;
        nivelFormalizacion: string;
        incompleto: boolean;
        saldoDeudor: number;
        saldosPorMoneda: {
            moneda: string;
            montoComercialVigente: number;
            pagosEfectivos: number;
            saldoPendiente: number;
            deudaVigente: number;
            obligacionesMorosas: number;
            excedente: number;
        }[];
        consolidadoClp: {
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
        tieneDeuda: boolean;
        esMoroso: boolean;
        isMoroso: boolean;
        situacionFinanciera: string;
        situacionClave: string;
        ultimaActividad: Date | null;
    }[]>;
    abrirFicha(referencia: string, consulta?: Record<string, unknown>): Promise<{
        resumen: {
            id_cliente_financiero: number;
            id_ficha_cliente: number | null;
            rut_cliente: string | null;
            nombre_razon_social_referencia: string;
            nombre_tipo_cliente_financiero: string;
            telefono_financiero: string | null;
            correo_financiero: string | null;
            contacto_financiero: string | null;
            estado_ficha: string;
            nivelFormalizacion: string;
            incompleto: boolean;
            saldoDeudor: number;
            esMoroso: boolean;
            isMoroso: boolean;
            situacionFinanciera: string;
            saldosPorMoneda: {
                moneda: string;
                montoComercialVigente: number;
                pagosEfectivos: number;
                saldoPendiente: number;
                deudaVigente: number;
                obligacionesMorosas: number;
                excedente: number;
            }[];
            consolidadoClp: {
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
        };
        resumen_dashboard: {
            total_ventas: number;
            total_pagado: number;
            total_deuda: number;
            saldo_pendiente: number;
            obligaciones_morosas: number;
            saldosPorMoneda: {
                moneda: string;
                montoComercialVigente: number;
                pagosEfectivos: number;
                saldoPendiente: number;
                deudaVigente: number;
                obligacionesMorosas: number;
                excedente: number;
            }[];
            consolidadoClp: {
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
            proyectos_activos: number;
            proyectos_terminados: number;
            cotizaciones: ({
                detalle_cotizacion: ({
                    detalle_costo_material_cotizacion: ({
                        historial_precio_material: {
                            material: {
                                material_clasificacion_nivel_especifico: bigint | null;
                                material_sku: string;
                                material_nombre_material: string | null;
                                material_descripcion: string | null;
                                material_material_critico: boolean | null;
                                material_presentacion: string | null;
                                material_stock_critico: Prisma.Decimal | null;
                                material_sotck_maximo: Prisma.Decimal | null;
                                material_stock_minimo: Prisma.Decimal | null;
                                material_es_rotativo: boolean | null;
                                material_estado: string | null;
                                es_material_pintura_custom: boolean | null;
                                material_pintura_custom: string | null;
                                es_material_pintura_no_custom: boolean | null;
                                material_pintura_no_custom: string | null;
                                material_categoria_general_id_categoria_general: bigint | null;
                                material_categoria_funcional_id_categoria_funcional: bigint | null;
                                material_unidad_medida_id_medida: bigint | null;
                            };
                        } & {
                            observacion: string | null;
                            id_moneda: number;
                            id_historial_precio_material: number;
                            id_proveedor: number | null;
                            tipo_cambio_usado: Prisma.Decimal | null;
                            material_sku: string;
                            precio_unitario: Prisma.Decimal;
                            precio_unitario_convertido: Prisma.Decimal | null;
                            fecha_registro: Date;
                            fecha_vigencia_inicio: Date;
                            fecha_vigencia_fin: Date | null;
                            estado_precio: string;
                        };
                    } & {
                        observacion: string | null;
                        id_detalle_costo_material_cotizacion: number;
                        id_detalle_cotizacion: number;
                        id_historial_precio_material: number;
                        cantidad_material_estimada: Prisma.Decimal;
                        precio_unitario_usado: Prisma.Decimal;
                        subtotal_material_estimado: Prisma.Decimal;
                    })[];
                    item_comercial: {
                        id_item_comercial: number;
                        nombre_item: string;
                        descripcion_item: string | null;
                        tipo_item: string | null;
                        estado_item: string;
                    };
                    precio_comercial: {
                        estado: string;
                        id_moneda: number;
                        segmento_comercial: string;
                        revision: number;
                        id_extension_producto_comercial: number;
                        id_precio_producto_comercial: bigint;
                        vigencia_desde: Date;
                        vigencia_hasta: Date | null;
                        motivo: string | null;
                        actualizado_en: Date;
                        creado_por: bigint;
                        monto: Prisma.Decimal;
                        creado_en: Date;
                    } | null;
                    producto_comercial: {
                        estado: string;
                        revision: number;
                        id_item_comercial: number | null;
                        id_extension_producto_comercial: number;
                        actualizado_en: Date;
                        creado_por: bigint;
                        actualizado_por: bigint;
                        creado_en: Date;
                        producto_terminado_id_producto: bigint | null;
                        id_familia_producto_comercial: number;
                        codigo_comercial: string;
                        nombre_comercial: string;
                        subfamilia: string | null;
                        tipo_producto: string | null;
                        descripcion_general: string | null;
                        descripcion_b2b: string | null;
                        descripcion_b2c: string | null;
                        observaciones: string | null;
                        garantia_referencial: string | null;
                        condiciones_particulares: string | null;
                        caracteristicas_destacadas: Prisma.JsonValue;
                        caracteristicas_tecnicas: Prisma.JsonValue;
                        numero_version_vigente: number | null;
                    } | null;
                    producto_version: {
                        id_item_comercial: number | null;
                        id_extension_producto_comercial: number;
                        id_producto_comercial_version: number;
                        vigencia_desde: Date;
                        motivo: string;
                        numero_version: number;
                        usuario_id_usuario: bigint;
                        creado_en: Date;
                        producto_terminado_id_producto: bigint | null;
                        id_familia_producto_comercial: number;
                        codigo_comercial: string;
                        nombre_comercial: string;
                        subfamilia: string | null;
                        tipo_producto: string | null;
                        descripcion_general: string | null;
                        descripcion_b2b: string | null;
                        descripcion_b2c: string | null;
                        observaciones: string | null;
                        garantia_referencial: string | null;
                        condiciones_particulares: string | null;
                        caracteristicas_destacadas: Prisma.JsonValue;
                        caracteristicas_tecnicas: Prisma.JsonValue;
                        codigo_familia: string;
                        nombre_familia: string;
                    } | null;
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
                ficha_cliente: {
                    cliente_financiero: {
                        tipo_cliente_financiero: {
                            id_tipo_cliente_financiero: number;
                            nombre_tipo_cliente_financiero: string;
                            descripcion_tipo_cliente_financiero: string | null;
                            estado_tipo_cliente_financiero: string;
                        };
                    } & {
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
                moneda: {
                    id_moneda: number;
                    codigo_moneda: string;
                    nombre_moneda: string;
                    simbolo_moneda: string | null;
                    estado_moneda: string;
                };
                condicion_comercial: ({
                    condicion: {
                        codigo: string;
                        estado: string;
                        revision: number;
                        actualizado_en: Date;
                        creado_por: bigint;
                        nombre: string;
                        creado_en: Date;
                        id_condicion_comercial: bigint;
                        segmento: string;
                    };
                } & {
                    estado: string;
                    id_condicion_comercial_version: bigint;
                    vigencia_desde: Date;
                    vigencia_hasta: Date | null;
                    motivo: string;
                    numero_version: number;
                    contenido: Prisma.JsonValue;
                    publicado_por: bigint | null;
                    publicado_en: Date | null;
                    id_condicion_comercial: bigint;
                }) | null;
                tarifa_instalacion: ({
                    moneda: {
                        id_moneda: number;
                        codigo_moneda: string;
                        nombre_moneda: string;
                        simbolo_moneda: string | null;
                        estado_moneda: string;
                    } | null;
                } & {
                    estado: string;
                    id_moneda: number | null;
                    id_tarifa_instalacion_comercial: bigint;
                    revision: number;
                    vigencia_desde: Date;
                    vigencia_hasta: Date | null;
                    actualizado_en: Date;
                    creado_por: bigint;
                    creado_en: Date;
                    condiciones: string | null;
                    observaciones: string | null;
                    alcance_geografico: string;
                    region: string;
                    region_normalizada: string;
                    ciudad: string | null;
                    comuna: string | null;
                    comuna_normalizada: string | null;
                    estado_cobertura: string;
                    precio_comercial: Prisma.Decimal | null;
                }) | null;
                obra_contexto: {
                    rut_cliente: string | null;
                    id_especificacion_puerta: bigint | null;
                    obra_obra_id: bigint;
                    obra_nombre_obra: string | null;
                    obra_direccion_obra: string | null;
                    obra_comuna: string | null;
                    obra_ciudad: string | null;
                    obra_region: string | null;
                    obra_tipo_obra: string | null;
                    obra_fecha_de_creacion: Date | null;
                    obra_fecha_de_ultima_edicion: Date | null;
                    obra_estado: string | null;
                    obra_cantidad_puerta: number | null;
                    obra_referencia: string | null;
                    obra_observaciones: string | null;
                    obra_edificio: string | null;
                    obra_unidad: string | null;
                    clave_ubicacion_normalizada: string | null;
                    revision_comercial: number;
                } | null;
                grupos_alternativas_b2c: ({
                    alternativas: ({
                        opcionales: {
                            precio_unitario: Prisma.Decimal;
                            cantidad: number;
                            id_compatibilidad_opcional: bigint;
                            id_precio_opcional_comercial: bigint;
                            id_alternativa_b2c: bigint;
                            id_alternativa_b2c_opcional: bigint;
                            snapshot_opcional: Prisma.JsonValue;
                        }[];
                    } & {
                        estado: string;
                        id_moneda: number;
                        monto_neto: Prisma.Decimal;
                        monto_impuesto: Prisma.Decimal;
                        id_tarifa_instalacion_comercial: bigint | null;
                        id_condicion_comercial_version: bigint | null;
                        revision: number;
                        id_extension_producto_comercial: number;
                        id_producto_comercial_version: number;
                        id_precio_producto_comercial: bigint;
                        monto_total: Prisma.Decimal;
                        precio_unitario: Prisma.Decimal;
                        creado_en: Date;
                        cantidad: number;
                        id_grupo_alternativas_b2c: bigint;
                        id_alternativa_b2c: bigint;
                        numero_alternativa: number;
                        configuracion_snapshot: Prisma.JsonValue;
                        precio_instalacion: Prisma.Decimal | null;
                        decidida_en: Date | null;
                        decidida_por: bigint | null;
                        motivo_decision: string | null;
                    })[];
                } & {
                    estado: string;
                    titulo: string | null;
                    revision: number;
                    id_cotizacion: number;
                    actualizado_en: Date;
                    creado_en: Date;
                    id_grupo_alternativas_b2c: bigint;
                    numero_grupo: number;
                    id_alternativa_seleccionada: bigint | null;
                    seleccionada_en: Date | null;
                    seleccionada_por: bigint | null;
                })[];
                contactos_b2b: {
                    estado: string;
                    cargo: string | null;
                    revision: number;
                    id_cotizacion: number;
                    actualizado_en: Date;
                    creado_por: bigint;
                    nombre: string;
                    creado_en: Date;
                    es_principal: boolean;
                    observaciones: string | null;
                    id_contacto_cotizacion_b2b: bigint;
                    apellido: string | null;
                    empresa_relacionada: string | null;
                    correo: string | null;
                    telefono: string | null;
                    tipo_contacto: string;
                }[];
                detalles_servicio: ({
                    precio: {
                        estado: string;
                        id_moneda: number;
                        segmento_comercial: string;
                        revision: number;
                        vigencia_desde: Date;
                        vigencia_hasta: Date | null;
                        motivo: string | null;
                        actualizado_en: Date;
                        creado_por: bigint;
                        monto: Prisma.Decimal;
                        creado_en: Date;
                        id_servicio_comercial: bigint;
                        id_precio_servicio_comercial: bigint;
                    };
                    servicio: {
                        codigo: string;
                        estado: string;
                        revision: number;
                        descripcion: string | null;
                        actualizado_en: Date;
                        creado_por: bigint;
                        nombre: string;
                        creado_en: Date;
                        habilitado_b2b: boolean;
                        habilitado_b2c: boolean;
                        id_servicio_comercial: bigint;
                        unidad_cobro: string;
                    };
                } & {
                    revision: number;
                    id_cotizacion: number;
                    tipo_linea_comercial: string;
                    precio_unitario_autorizado: Prisma.Decimal;
                    descuento_elegible: boolean;
                    snapshot_comercial: Prisma.JsonValue;
                    cantidad: Prisma.Decimal;
                    id_servicio_comercial: bigint;
                    id_precio_servicio_comercial: bigint;
                    id_detalle_servicio_cotizacion: bigint;
                    descripcion_cotizada: string;
                    unidad_cobro_cotizada: string;
                    subtotal: Prisma.Decimal;
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
            })[];
            notas_venta: {
                diasAtrasoPagoFinal: number | null;
                clasificacionVencimiento: string;
                ficha_cliente: {
                    cliente_financiero: {
                        rut_cliente: string | null;
                        nombre_razon_social_referencia: string;
                    };
                };
                estado_pago: string;
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
            proyectos: {
                rut_cliente: string | null;
                proyecto_proyecto_id: bigint;
                proyecto_codigo_proyecto: string | null;
                proyecto_nombre_referencia: string | null;
                proyecto_fecha_instalacion: Date | null;
                proyecto_fecha_ingreso: Date | null;
                proyecto_estado_operacional: string | null;
                proyecto_estado_produccion: string | null;
                id_cotizacion_origen: number | null;
            }[];
            saldosFavor: ({
                nota_venta: {
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
                id_nota_venta: number;
                id_cliente_financiero: number;
                monto_disponible: Prisma.Decimal;
                monto_original: Prisma.Decimal;
                fecha: Date;
                id_reversion_nota_venta: number;
                id_saldo_favor_cliente: number;
            })[];
        };
        historial: ({
            tipo: string;
            id: number;
            fecha: Date;
            estado: string;
        } | {
            tipo: string;
            id: string;
            fecha: Date | null;
            estado: string | null;
        })[];
    }>;
    contarClientesActivos(): Promise<number>;
}
//# sourceMappingURL=M1Controller.d.ts.map