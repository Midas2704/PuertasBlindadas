import { Prisma } from '@prisma/client';
type Consulta = Record<string, unknown>;
export type EstadoIndicadorM7 = 'VALIDO' | 'SIN_RESULTADOS' | 'DATOS_INSUFICIENTES' | 'FUENTE_NO_DISPONIBLE' | 'DESACTUALIZADO' | 'PARCIALMENTE_DISPONIBLE' | 'SIN_PERMISO' | 'ERROR_CALCULO' | 'NO_APLICA' | 'CONFIGURACION_PENDIENTE';
type Periodo = {
    desde: Date;
    hastaExclusiva: Date;
    anteriorDesde: Date;
    anteriorHastaExclusiva: Date;
    etiquetaDesde: string;
    etiquetaHasta: string;
};
export declare const categoriasEstadoResultadosM7: readonly ["VENTAS_NETAS", "COSTOS_DIRECTOS", "GASTOS_OPERACIONALES"];
export type AptitudFuenteEerrM7 = 'APTA' | 'PARCIALMENTE_APTA' | 'NO_APTA' | 'POR_CONFIRMAR';
export declare const matrizCoberturaFuentesEerrM7: readonly [{
    readonly fuente: "nota_venta";
    readonly campoMonto: "monto_neto";
    readonly fecha: "fecha_emision";
    readonly estadoValido: "confirmada o cerrada";
    readonly clasificacion: "Venta definitiva";
    readonly proyectoAsociado: "Disponible sólo cuando la Nota de Venta está vinculada inequívocamente";
    readonly posibleDuplicacion: "Documentos tributarios y pagos representan otras etapas y no se suman";
    readonly tratamientoTributario: "Monto neto; IVA débito permanece separado";
    readonly moneda: "CLP directo o moneda extranjera con tipo_cambio_usado histórico";
    readonly aptitud: AptitudFuenteEerrM7;
    readonly motivo: "Fuente owner de ventas netas definitivas";
    readonly datoFaltante: null;
}, {
    readonly fuente: "costo_proyecto";
    readonly campoMonto: "monto_costo";
    readonly fecha: "fecha_costo";
    readonly estadoValido: "distinto de anulado";
    readonly clasificacion: "categoria_costo y origen_costo sin catálogo contable cerrado";
    readonly proyectoAsociado: "Sí, id_proyecto_financiero obligatorio";
    readonly posibleDuplicacion: "Puede vincularse a documento de proveedor y coexistir con tareas remunerables";
    readonly tratamientoTributario: "El modelo no identifica inequívocamente neto e IVA por cada costo";
    readonly moneda: "Moneda explícita; no existe FX histórico propio obligatorio";
    readonly aptitud: AptitudFuenteEerrM7;
    readonly motivo: "Apta para margen directo atribuido, no para afirmar cobertura contable completa";
    readonly datoFaltante: "Regla de IVA, FX e identidad transversal con documentos y remuneraciones";
}, {
    readonly fuente: "tarea_remunerable";
    readonly campoMonto: "monto_calculado";
    readonly fecha: "fecha_tarea";
    readonly estadoValido: "validada y vinculada a proyecto";
    readonly clasificacion: "Mano de obra productiva atribuible";
    readonly proyectoAsociado: "Sí, cuando id_proyecto_financiero no es null";
    readonly posibleDuplicacion: "Puede estar incorporada posteriormente en liquidación/remuneración";
    readonly tratamientoTributario: "No corresponde a IVA";
    readonly moneda: "CLP en el contrato actual";
    readonly aptitud: AptitudFuenteEerrM7;
    readonly motivo: "Útil como costo directo atribuible, sin conciliación completa contra remuneración oficial";
    readonly datoFaltante: "Identidad que impida duplicarla con el costo laboral cerrado";
}, {
    readonly fuente: "documento_compra_proveedor";
    readonly campoMonto: "monto_neto";
    readonly fecha: "fecha_emision";
    readonly estadoValido: "distinto de anulado o rechazado";
    readonly clasificacion: "Detalle material y vínculo opcional a costo de proyecto";
    readonly proyectoAsociado: "Parcial mediante detalle_costo_proyecto_documento_proveedor";
    readonly posibleDuplicacion: "Documento, costo de proyecto, obligación y pago pueden representar el mismo hecho";
    readonly tratamientoTributario: "Separa monto_neto y monto_impuesto";
    readonly moneda: "Moneda y tipo_cambio_usado histórico disponibles";
    readonly aptitud: AptitudFuenteEerrM7;
    readonly motivo: "Tiene base tributaria, pero no clasifica por sí sola gasto operacional versus inventario/costo";
    readonly datoFaltante: "Clasificación económica aprobada y conciliación única con M5/costos/inventario";
}, {
    readonly fuente: "documento_proveedor_m5";
    readonly campoMonto: "monto_total";
    readonly fecha: "fecha_emision";
    readonly estadoValido: "confirmado";
    readonly clasificacion: "Categoría de egreso e imputación confirmada";
    readonly proyectoAsociado: "Opcional mediante detalle_imputacion_m5";
    readonly posibleDuplicacion: "Obligación, pago, costo de proyecto, documento legacy o inventario";
    readonly tratamientoTributario: "No separa neto e IVA en el modelo";
    readonly moneda: "Moneda explícita y FX confirmado cuando corresponde";
    readonly aptitud: AptitudFuenteEerrM7;
    readonly motivo: "La clasificación existe, pero el monto disponible es total y no asegura naturaleza EBITDA";
    readonly datoFaltante: "Monto neto, tratamiento tributario y taxonomía contable de categorías";
}, {
    readonly fuente: "remuneracion";
    readonly campoMonto: "costo_empresa / total_haberes + total_aportes_empleador";
    readonly fecha: "periodo_remuneracion.fecha_inicio/fecha_fin";
    readonly estadoValido: "cerrada";
    readonly clasificacion: "Sin separación inequívoca entre producción, proyecto y administración";
    readonly proyectoAsociado: "No en la remuneración; sólo algunas tareas remunerables tienen proyecto";
    readonly posibleDuplicacion: "Las tareas remunerables productivas pueden formar parte de la remuneración oficial";
    readonly tratamientoTributario: "No corresponde a IVA; impuestos y descuentos no equivalen automáticamente a gasto EBITDA";
    readonly moneda: "CLP";
    readonly aptitud: AptitudFuenteEerrM7;
    readonly motivo: "Costo laboral oficial disponible, pero sin distribución económica completa";
    readonly datoFaltante: "Clasificación laboral aprobada y conciliación con tareas productivas";
}, {
    readonly fuente: "gasto_caja_chica_m5 / gasto_caja_chica";
    readonly campoMonto: "monto / monto_gasto";
    readonly fecha: "fecha_gasto";
    readonly estadoValido: "aprobado / validación aprobada";
    readonly clasificacion: "Descripción libre; sin destino económico estructurado suficiente";
    readonly proyectoAsociado: "No inequívoco";
    readonly posibleDuplicacion: "Puede corresponder a documento, material, costo de instalación o movimiento financiero";
    readonly tratamientoTributario: "No separa monto neto e IVA de forma inequívoca";
    readonly moneda: "No explícita en los modelos revisados";
    readonly aptitud: AptitudFuenteEerrM7;
    readonly motivo: "La aprobación no demuestra que sea gasto operacional ni evita duplicación";
    readonly datoFaltante: "Moneda, IVA, categoría contable, proyecto y vínculo documental único";
}, {
    readonly fuente: "movimiento_financiero / pagos";
    readonly campoMonto: "monto_movimiento / monto pagado";
    readonly fecha: "fecha_movimiento / fecha_pago";
    readonly estadoValido: "vigente, no anulado ni rechazado";
    readonly clasificacion: "Naturaleza de caja";
    readonly proyectoAsociado: "Sólo mediante orígenes, no reconocimiento económico";
    readonly posibleDuplicacion: "Es la liquidación de obligaciones o hechos ya reconocidos";
    readonly tratamientoTributario: "No determina neto ni IVA del hecho económico";
    readonly moneda: "Moneda explícita; FX no convierte el pago en gasto";
    readonly aptitud: AptitudFuenteEerrM7;
    readonly motivo: "Un movimiento de efectivo no equivale a gasto devengado";
    readonly datoFaltante: "No aplica como fuente primaria de EERR";
}, {
    readonly fuente: "inventario_bodega / movimiento_inventario";
    readonly campoMonto: "cantidad física o salida; valorización parcial";
    readonly fecha: "fecha de movimiento cuando existe";
    readonly estadoValido: "movimiento/stock vigente";
    readonly clasificacion: "Material, lote y tipo de movimiento";
    readonly proyectoAsociado: "Parcial mediante lote, reserva u orden de trabajo";
    readonly posibleDuplicacion: "Compra, documento y costo de proyecto pueden representar adquisición/consumo relacionado";
    readonly tratamientoTributario: "La compra no es gasto mientras permanezca como inventario";
    readonly moneda: "Costo histórico completo no asegurado para cada consumo";
    readonly aptitud: AptitudFuenteEerrM7;
    readonly motivo: "No existe conciliación completa de consumo valorizado hacia costo del período";
    readonly datoFaltante: "Costo de salida histórico, consumo real y conciliación con compra/proyecto";
}];
export type TrazabilidadInventarioM7 = 'VERIFICADA' | 'PARCIALMENTE VERIFICADA' | 'NO VERIFICABLE' | 'POR CONFIRMAR';
export declare const matrizTrazabilidadInventarioM7: readonly [{
    readonly fuente: "inventario.inventario_bodega";
    readonly identificador: "material_sku + lote_id_lote + bodega_id_bodega";
    readonly tipoOperacion: "Existencia actual";
    readonly sku: "material_sku";
    readonly cantidad: "cantidad_fisica / cantidad_reservada";
    readonly unidad: "material.material_unidad_medida";
    readonly fecha: null;
    readonly estado: "bodega/lote/material";
    readonly moneda: null;
    readonly valorizacion: "No incluida";
    readonly proyecto: null;
    readonly ordenTrabajo: null;
    readonly documentoOrigen: null;
    readonly riesgoDuplicacion: "Bajo si se conserva la clave compuesta";
    readonly coberturaHistorica: "No disponible";
    readonly usoFinancieroPermitido: "Stock físico y reservado actual";
    readonly relacion: TrazabilidadInventarioM7;
    readonly brecha: "No contiene snapshots ni costo de salida";
}, {
    readonly fuente: "inventario.reserva_inventario";
    readonly identificador: "reserva_inventario_id_reserva";
    readonly tipoOperacion: "Reserva operacional";
    readonly sku: "material_sku";
    readonly cantidad: "cantidad_reservada";
    readonly unidad: "material.material_unidad_medida";
    readonly fecha: "fecha_reserva / fecha_liberacion";
    readonly estado: "estado_reserva";
    readonly moneda: null;
    readonly valorizacion: "No incluida";
    readonly proyecto: "proyecto_id_proyecto";
    readonly ordenTrabajo: "orden_trabajo_id_orden";
    readonly documentoOrigen: null;
    readonly riesgoDuplicacion: "Alto frente a inventario_bodega.cantidad_reservada";
    readonly coberturaHistorica: "Parcial";
    readonly usoFinancieroPermitido: "Conciliación y trazabilidad; no descontar dos veces";
    readonly relacion: TrazabilidadInventarioM7;
    readonly brecha: "No existe identidad entre reserva y fila agregada de bodega";
}, {
    readonly fuente: "inventario.material_orden_trabajo";
    readonly identificador: "material_sku + orden_trabajo_id_orden";
    readonly tipoOperacion: "Plan y consumo productivo";
    readonly sku: "material_sku";
    readonly cantidad: "consumo_estimado / consumo_real";
    readonly unidad: "material.material_unidad_medida";
    readonly fecha: "OT, no fecha propia del consumo";
    readonly estado: "estado OT";
    readonly moneda: null;
    readonly valorizacion: "No incluida";
    readonly proyecto: "OT.proyecto_id_proyecto";
    readonly ordenTrabajo: "orden_trabajo_id_orden";
    readonly documentoOrigen: null;
    readonly riesgoDuplicacion: "Medio frente a movimientos sin identidad común";
    readonly coberturaHistorica: "Parcial";
    readonly usoFinancieroPermitido: "Demanda y consumo real separados";
    readonly relacion: TrazabilidadInventarioM7;
    readonly brecha: "El consumo no posee fecha ni movimiento asociado";
}, {
    readonly fuente: "inventario.movimiento_inventario";
    readonly identificador: "movimiento_inventario_id_movimiento";
    readonly tipoOperacion: "Movimiento de inventario";
    readonly sku: "material_sku";
    readonly cantidad: "cantidad";
    readonly unidad: "material.material_unidad_medida";
    readonly fecha: "fecha_hora";
    readonly estado: "estado";
    readonly moneda: null;
    readonly valorizacion: "No incluida";
    readonly proyecto: "proyecto_id_proyecto";
    readonly ordenTrabajo: null;
    readonly documentoOrigen: "factura_compra_id_factura_compra opcional";
    readonly riesgoDuplicacion: "Medio frente a recepción/consumo";
    readonly coberturaHistorica: "Según registros fechados";
    readonly usoFinancieroPermitido: "Trazabilidad de movimientos, no gasto";
    readonly relacion: TrazabilidadInventarioM7;
    readonly brecha: "Tipo/motivo no garantizan consumo productivo ni vínculo a OT";
}, {
    readonly fuente: "finanzas.detalle_material_orden_compra_m5";
    readonly identificador: "id_detalle_material_oc_m5";
    readonly tipoOperacion: "Pedido y recepción M5";
    readonly sku: "material_sku";
    readonly cantidad: "cantidad_pedida / cantidad_recibida";
    readonly unidad: "material.material_unidad_medida";
    readonly fecha: "fecha_esperada";
    readonly estado: "orden_compra.estado_ocs";
    readonly moneda: "orden_compra.id_moneda";
    readonly valorizacion: "Monto de OCS, no costo unitario del detalle";
    readonly proyecto: "id_proyecto_financiero_contexto";
    readonly ordenTrabajo: "id_orden_trabajo_contexto";
    readonly documentoOrigen: "id_ocs_m5";
    readonly riesgoDuplicacion: "Alto frente a documento, recepción y entrada";
    readonly coberturaHistorica: "Parcial";
    readonly usoFinancieroPermitido: "Entrada esperada sólo con OCS abierta";
    readonly relacion: TrazabilidadInventarioM7;
    readonly brecha: "Cantidad recibida no prueba ingreso a bodega";
}, {
    readonly fuente: "finanzas.historial_precio_material";
    readonly identificador: "id_historial_precio_material";
    readonly tipoOperacion: "Precio referencial";
    readonly sku: "material_sku";
    readonly cantidad: null;
    readonly unidad: null;
    readonly fecha: "vigencias";
    readonly estado: "estado_precio";
    readonly moneda: "moneda";
    readonly valorizacion: "Precio unitario y conversión histórica";
    readonly proyecto: null;
    readonly ordenTrabajo: null;
    readonly documentoOrigen: "proveedor opcional";
    readonly riesgoDuplicacion: "Alto cuando hay candidatos simultáneos";
    readonly coberturaHistorica: "Precio sí; stock histórico no";
    readonly usoFinancieroPermitido: "Valorización referencial actual si es inequívoco";
    readonly relacion: TrazabilidadInventarioM7;
    readonly brecha: "No define FIFO, promedio ni costo específico por lote";
}];
export declare const matrizCoberturaInventarioM7: readonly [{
    readonly indicador: "Stock físico actual";
    readonly fuenteOwner: "Inventario";
    readonly tipoDato: "Estado actual";
    readonly estado: "VALIDO";
    readonly coberturaTemporal: "Actual, sin snapshots";
    readonly coberturaMonetaria: "No aplica";
    readonly riesgoDuplicacion: "Bajo";
    readonly dependenciaExterna: "Inventario";
    readonly calculable: true;
    readonly brecha: "Sin reconstrucción histórica";
}, {
    readonly indicador: "Stock reservado";
    readonly fuenteOwner: "Inventario";
    readonly tipoDato: "Estado actual";
    readonly estado: "PARCIALMENTE_DISPONIBLE";
    readonly coberturaTemporal: "Actual";
    readonly coberturaMonetaria: "No aplica";
    readonly riesgoDuplicacion: "Alto entre agregado y reservas";
    readonly dependenciaExterna: "Conciliación Inventario";
    readonly calculable: true;
    readonly brecha: "Equivalencia entre fuentes no confirmada";
}, {
    readonly indicador: "Stock disponible";
    readonly fuenteOwner: "Inventario";
    readonly tipoDato: "Derivado";
    readonly estado: "PARCIALMENTE_DISPONIBLE";
    readonly coberturaTemporal: "Actual";
    readonly coberturaMonetaria: "No aplica";
    readonly riesgoDuplicacion: "Alto si se descuenta dos veces";
    readonly dependenciaExterna: "Regla oficial Inventario";
    readonly calculable: true;
    readonly brecha: "Físico menos reservado agregado; pendiente de conciliación";
}, {
    readonly indicador: "Entradas pendientes";
    readonly fuenteOwner: "M5";
    readonly tipoDato: "Compromiso";
    readonly estado: "PARCIALMENTE_DISPONIBLE";
    readonly coberturaTemporal: "Fecha esperada cuando existe";
    readonly coberturaMonetaria: "No se valoriza";
    readonly riesgoDuplicacion: "Alto con recepción/entrada";
    readonly dependenciaExterna: "OCS abierta M5";
    readonly calculable: true;
    readonly brecha: "Recepción no prueba ingreso a inventario";
}, {
    readonly indicador: "Consumo real";
    readonly fuenteOwner: "Inventario/Producción";
    readonly tipoDato: "Cantidad real";
    readonly estado: "PARCIALMENTE_DISPONIBLE";
    readonly coberturaTemporal: "Sin fecha propia";
    readonly coberturaMonetaria: "Sólo con precio inequívoco";
    readonly riesgoDuplicacion: "Medio";
    readonly dependenciaExterna: "material_orden_trabajo";
    readonly calculable: true;
    readonly brecha: "Sin identidad con movimiento de salida";
}, {
    readonly indicador: "Valorización actual referencial";
    readonly fuenteOwner: "Inventario + Finanzas";
    readonly tipoDato: "Estado actual por precio vigente";
    readonly estado: "PARCIALMENTE_DISPONIBLE";
    readonly coberturaTemporal: "Fecha actual";
    readonly coberturaMonetaria: "CLP o FX histórico válido";
    readonly riesgoDuplicacion: "Alto con precios simultáneos";
    readonly dependenciaExterna: "Definición de precio aplicable";
    readonly calculable: true;
    readonly brecha: "No es método contable de inventario";
}, {
    readonly indicador: "Valorización histórica";
    readonly fuenteOwner: "Inventario";
    readonly tipoDato: "Snapshot/costo histórico";
    readonly estado: "FUENTE_NO_DISPONIBLE";
    readonly coberturaTemporal: "No disponible";
    readonly coberturaMonetaria: "No disponible";
    readonly riesgoDuplicacion: "No aplica";
    readonly dependenciaExterna: "Método owner";
    readonly calculable: false;
    readonly brecha: "Faltan snapshots y método de valorización";
}, {
    readonly indicador: "Rotación";
    readonly fuenteOwner: "Inventario";
    readonly tipoDato: "Flujo historizable";
    readonly estado: "DATOS_INSUFICIENTES";
    readonly coberturaTemporal: "Movimientos fechados";
    readonly coberturaMonetaria: "No disponible";
    readonly riesgoDuplicacion: "Medio";
    readonly dependenciaExterna: "Clasificación estructurada de consumo";
    readonly calculable: false;
    readonly brecha: "No se identifica inequívocamente la salida productiva";
}];
type PrecioMaterialM7 = {
    precio_unitario: unknown;
    precio_unitario_convertido: unknown;
    tipo_cambio_usado: unknown;
    moneda?: {
        codigo_moneda?: string | null;
    } | null;
    id_proveedor?: number | null;
};
export declare function resolverPrecioReferencialMaterialM7(candidatos: PrecioMaterialM7[]): {
    estado: "VALIDO";
    valor: number;
    monedaOrigen: string;
    proveedor: number | null;
} | {
    estado: "FUENTE_NO_DISPONIBLE" | "DATOS_INSUFICIENTES";
    valor: null;
    monedaOrigen: null;
    proveedor: null;
};
export declare function calcularCantidadPendienteCompraM7(pedida: number, recibida: number, estado: string | null | undefined): number;
export declare function separarConsumoMaterialM7(real: number | null, estimado: number | null): {
    consumoReal: number | null;
    consumoEstimado: number | null;
    diferencia: number | null;
};
export declare function resolverPeriodoM7(consulta?: Consulta): Periodo;
export declare function calcularComparacionPeriodosVentasM7(valorA: number | null, valorB: number | null): {
    diferenciaAbsoluta: number | null;
    variacionPorcentual: number | null;
};
export type FilaResumenIvaM7 = {
    moneda: string;
    montoNeto: number | null;
    montoImpuesto: number | null;
    montoTotal: number | null;
    afectaImpuesto: boolean;
    idDocumentoReferencia?: number | null;
};
export declare function calcularResumenIvaM7(ventas: FilaResumenIvaM7[], compras: FilaResumenIvaM7[]): {
    estado: "DATOS_INSUFICIENTES" | "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
    ivaVentas: {
        monto: number;
        moneda: string;
    }[];
    ivaCompras: {
        monto: number;
        moneda: string;
    }[];
    ivaEstimado: {
        moneda: string;
        ivaVentas: number;
        ivaCompras: number;
        ivaEstimado: number;
    }[];
    cobertura: {
        sinDesglose: number;
        desgloseInconsistente: number;
        correctorSinSignoAcreditado: number;
        documentosVentas: number;
        documentosCompras: number;
        excluidos: number;
    };
};
export type EjecucionHorariaM7 = {
    cantidad: number | null;
    unidad: string | null;
    estado: string;
    validacion: string;
};
export declare const esUnidadHorariaM7: (unidad: unknown) => boolean;
export declare function calcularHorasRealesM7(ejecuciones: EjecucionHorariaM7[]): {
    horas: number | null;
    ejecucionesHorarias: number;
    ejecucionesSinUnidadHoraria: number;
};
export declare function horasEstimadasDesdeTiempoM7(valor: Date | null | undefined): number | null;
export declare function calcularComparacionProduccionM7(valorA: number | null, valorB: number | null): {
    diferencia: null;
    variacionPorcentual: null;
} | {
    diferencia: number;
    variacionPorcentual: number | null;
};
export type GranularidadVentasM7 = 'dia' | 'mes';
export declare function seleccionarGranularidadVentasM7(desde: string, hasta: string): GranularidadVentasM7;
export declare function generarClavesTemporalesVentasM7(desde: string, hasta: string, granularidad?: GranularidadVentasM7): string[];
export declare function consolidarBucketVentasM7(montos: Array<number | null>): {
    ventaNetaClp: number | null;
    ventasIncluidasClp: number;
    ventasExcluidasSinTipoCambio: number;
};
export declare function calcularPromedioTemporalVentasM7(total: number | null, unidades: number): number | null;
export declare function alinearSeriesPeriodosVentasM7(serieA: Array<Record<string, unknown>>, serieB: Array<Record<string, unknown>>, granularidad?: GranularidadVentasM7): {
    posicion: string;
    periodoA: {} | null;
    ventaA: {} | null;
    periodoB: {} | null;
    ventaB: {} | null;
    variacionPorcentual: number | null;
}[];
type AccionNavegacion = {
    etiqueta: string;
    destino: string;
};
export declare const equivalenteClpCxc: (saldo: number, moneda: string, tipoCambio: number | null) => number | null;
export declare const convertirVentaClpM7: (montoNeto: number, moneda: string, tipoCambioHistorico: number | null) => number | null;
export declare const calcularVariacionVentasM7: (actual: number | null, base: number | null) => number | null;
export type SegmentoComercialM7 = 'TODOS' | 'B2B' | 'B2C';
export declare const resolverSegmentoComercialM7: (valor: unknown) => SegmentoComercialM7;
export declare const calcularConversionSegmentadaM7: (filas: Array<{
    segmento: string | null;
    convertida: boolean;
}>, segmento: SegmentoComercialM7) => {
    totalCotizaciones: number;
    convertidas: number;
    tasaPorcentual: number | null;
};
export declare function distribuirVentaPorProductoM7(netoClp: number | null, detalles: Array<{
    producto: string;
    segmento: string | null;
    cantidad: number;
    subtotal: number;
}>): {
    producto: string;
    ventaNetaClp: number | null;
    segmento: string | null;
    cantidad: number;
    subtotal: number;
}[];
export declare function resumirIncidenciasRevisionM7(filas: Array<{
    estadoRevision: string;
    categoria: {
        codigo: string;
        nombre: string;
    } | null;
}>): {
    estadosRevision: {
        estado: "aprobada" | "rechazada" | "pendiente_revision";
        cantidad: number;
    }[];
    categorias: {
        categoria: string;
        codigo: string;
        cantidad: number;
    }[];
    aprobadas: number;
    sinCategoriaEstructurada: number;
};
export declare function calcularEstadoResultadosM7(partidas: {
    ventasNetas: number | null;
    costoVenta: number | null;
    gastosOperacionales: number | null;
}): {
    margenBruto: number | null;
    ebitdaMonto: number | null;
    ebitdaPorcentaje: number | null;
    ventasNetas: number | null;
    costoVenta: number | null;
    gastosOperacionales: number | null;
};
export declare function evaluarCoberturaEstadoResultadosM7(entrada: {
    ventasNetas: number | null;
    costosDirectos: number | null;
    gastosOperacionales: number | null;
    ventasExcluidasSinFx?: number;
    costosExcluidosSinFx?: number;
    coberturaCostosCompleta?: boolean;
    clasificacionGastosCompleta?: boolean;
    clasificacionExclusionesCompleta?: boolean;
    controlDuplicadosCompleto?: boolean;
    segmento?: SegmentoComercialM7;
}): {
    estado: "DATOS_INSUFICIENTES" | "VALIDO";
    calculable: boolean;
    partidas: {
        ventasNetas: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        costosDirectos: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        gastosOperacionales: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        gastosExcluidos: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO";
            valor: null;
            detalle: string;
        };
        conversionMonetaria: {
            estado: "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: {
                ventasExcluidasSinFx: number;
                costosExcluidosSinFx: number;
            };
            detalle: string;
        };
        duplicados: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO";
            valor: null;
            detalle: string;
        };
    };
    motivo: string;
};
export declare function resolverEbitdaSeguroM10(entrada: Parameters<typeof evaluarCoberturaEstadoResultadosM7>[0] & {
    contratoEconomicoValidado?: boolean;
}): {
    estado: "CONFIGURACION_PENDIENTE";
    calculable: boolean;
    monto: null;
    porcentaje: null;
    motivo: string;
    cobertura: {
        ventasNetas: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        costosDirectos: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        gastosOperacionales: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        gastosExcluidos: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO";
            valor: null;
            detalle: string;
        };
        conversionMonetaria: {
            estado: "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: {
                ventasExcluidasSinFx: number;
                costosExcluidosSinFx: number;
            };
            detalle: string;
        };
        duplicados: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO";
            valor: null;
            detalle: string;
        };
    };
} | {
    estado: "DATOS_INSUFICIENTES" | "VALIDO";
    calculable: boolean;
    monto: null;
    porcentaje: null;
    motivo: string;
    cobertura: {
        ventasNetas: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        costosDirectos: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        gastosOperacionales: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        gastosExcluidos: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO";
            valor: null;
            detalle: string;
        };
        conversionMonetaria: {
            estado: "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: {
                ventasExcluidasSinFx: number;
                costosExcluidosSinFx: number;
            };
            detalle: string;
        };
        duplicados: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO";
            valor: null;
            detalle: string;
        };
    };
} | {
    estado: "VALIDO";
    calculable: boolean;
    monto: number | null;
    porcentaje: number | null;
    motivo: string;
    cobertura: {
        ventasNetas: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        costosDirectos: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        gastosOperacionales: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: number | null;
            detalle: string;
        };
        gastosExcluidos: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO";
            valor: null;
            detalle: string;
        };
        conversionMonetaria: {
            estado: "VALIDO" | "PARCIALMENTE_DISPONIBLE";
            valor: {
                ventasExcluidasSinFx: number;
                costosExcluidosSinFx: number;
            };
            detalle: string;
        };
        duplicados: {
            estado: "DATOS_INSUFICIENTES" | "VALIDO";
            valor: null;
            detalle: string;
        };
    };
};
export declare function calcularPresupuestoResultadosM7(partidas: {
    ventasNetas: number | null;
    costosDirectos: number | null;
    gastosOperacionales: number | null;
}): {
    margenBruto: number | null;
    resultadoOperativo: number | null;
    margenOperativoPorcentaje: number | null;
    ventasNetas: number | null;
    costosDirectos: number | null;
    gastosOperacionales: number | null;
};
export declare function calcularDesviacionResultadosM7(real: number | null, presupuesto: number | null): {
    diferencia: number | null;
    variacionPorcentual: number | null;
};
export declare function compararPartidaRealM10(presupuesto: number, real: number | null, estado: 'VALIDO' | 'SIN_PERMISO' | 'DATOS_INSUFICIENTES' | 'NO_APLICA'): {
    estado: "DATOS_INSUFICIENTES" | "NO_APLICA" | "VALIDO" | "SIN_PERMISO";
    diferencia: number | null;
    variacionPorcentual: number | null;
    presupuesto: number;
    real: number | null;
};
export declare function esMesFuturoPresupuestoM10(anio: number, mes: number, periodoActual?: string): boolean;
export declare function estadoRealPresupuestoM10(tienePermiso: boolean, esFuturo: boolean, real: unknown, fuenteDisponible?: boolean): 'VALIDO' | 'SIN_PERMISO' | 'DATOS_INSUFICIENTES' | 'NO_APLICA';
export declare function calcularFlujoRealM7(movimientos: Array<{
    monto: number;
    naturaleza: string;
    ajuste?: boolean;
}>): {
    ingresosReales: number;
    egresosReales: number;
    ajustesEntrada: number;
    ajustesSalida: number;
    flujoReal: number;
};
export type MovimientoSaldoBancarioM7 = {
    id: number;
    fecha: Date;
    monto: number;
    naturaleza: string | null;
    estado: string;
    numeroOperacion?: string | null;
};
export declare function calcularSaldoCuentaBancariaM7(saldoInicial: number | null, fechaCorte: Date, fechaObjetivo: Date, movimientos: MovimientoSaldoBancarioM7[]): {
    saldoReconstruido: null;
    ingresos: number;
    egresos: number;
    estado: "SALDO_INICIAL_PENDIENTE";
    movimientosIncluidos: number;
} | {
    saldoReconstruido: null;
    ingresos: number;
    egresos: number;
    estado: "COBERTURA_INCOMPLETA";
    movimientosIncluidos: number;
} | {
    saldoReconstruido: number;
    ingresos: number;
    egresos: number;
    estado: "RECONSTRUIDO";
    movimientosIncluidos: number;
};
export declare function validarCuentaBancariaM7(entrada: Record<string, unknown>): {
    banco: string;
    alias: string;
    identificador: string;
    moneda: string;
    estado: string;
};
export declare function validarSaldoInicialBancarioM7(entrada: Record<string, unknown>): {
    idCuenta: number;
    fechaCorte: Date;
    saldo: Prisma.Decimal;
    observacion: string;
};
export declare const calcularDesviacionFlujoM7: (real: number, proyectado: number) => {
    diferencia: number;
    diferenciaPorcentual: number | null;
};
type MesVentaHistoricaM7 = {
    periodo: string;
    ventasNetas: number | null;
    ventasIncluidasClp: number;
    ventasExcluidasSinTipoCambio: number;
};
export declare function resumirVentasHistoricasM7(meses: MesVentaHistoricaM7[], anio: number, mes: number): {
    actual: number | null;
    anterior: number | null;
    anual: number | null;
    mom: number | null;
    yoy: number | null;
    diferenciaMom: number | null;
    diferenciaYoY: number | null;
    acumuladoActual: number | null;
    acumuladoAnterior: number | null;
    diferenciaYtd: number | null;
    variacionYtd: number | null;
    corteYtd: {
        desde: string;
        hastaMes: number;
        comparableAnterior: string;
    };
    periodoParcial: boolean;
    extrapolado: boolean;
    coberturaMes: {
        incluidas: number;
        excluidasSinTipoCambio: number;
    };
    coberturaYtd: {
        incluidas: number;
        excluidasSinTipoCambio: number;
    };
    coberturaYtdAnterior: {
        incluidas: number;
        excluidasSinTipoCambio: number;
    };
};
export interface ProveedorCreditoM8 {
    consultarExposicion(consulta: Consulta): Promise<unknown>;
    consultarAlertas(consulta: Consulta): Promise<unknown>;
}
export interface ProveedorBloqueosOperacionales {
    consultarBloqueos(consulta: Consulta): Promise<unknown>;
}
export declare class M7Controller {
    private creditoM8?;
    private readonly bloqueosOwner?;
    private readonly presupuestoManualM10;
    constructor(creditoM8?: ProveedorCreditoM8 | undefined, bloqueosOwner?: ProveedorBloqueosOperacionales | undefined);
    conectarCreditoM8(proveedor: ProveedorCreditoM8): void;
    consultarPanelGeneral(consulta: Consulta, permisos: string[]): Promise<any>;
    consultarHistoricoPanelGeneral(consulta: Consulta, permisos: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
            meses: number;
        };
        segmento: SegmentoComercialM7;
        moneda: string;
        meses: {
            periodo: string;
            ventasNetas: number | null;
            ventasNetasGerencial: number | null;
            cantidadVentas: number;
            ventasIncluidasClp: number;
            ventasExcluidasSinTipoCambio: number;
            cotizaciones: number;
            convertidas: number;
            conversionPorcentual: number | null;
            ingresosRecibidos: number;
            egresosRealizados: number;
            ajustesEntrada: number;
            ajustesSalida: number;
            flujoNeto: number;
            flujoPresupuestado: number | null;
            costoRemuneraciones: number | null;
            costosDirectos: number | null;
            resultadoGerencial: number | null;
            instalaciones: number;
            ordenesTrabajo: number;
            incidencias: number;
        }[];
        principalesClientes: {
            participacionPorcentual: number | null;
            cliente: string;
            monto: number;
            idCliente: number;
        }[];
        resumenVentas: {
            actual: number | null;
            anterior: number | null;
            anual: number | null;
            mom: number | null;
            yoy: number | null;
            diferenciaMom: number | null;
            diferenciaYoY: number | null;
            acumuladoActual: number | null;
            acumuladoAnterior: number | null;
            diferenciaYtd: number | null;
            variacionYtd: number | null;
            corteYtd: {
                desde: string;
                hastaMes: number;
                comparableAnterior: string;
            };
            periodoParcial: boolean;
            extrapolado: boolean;
            coberturaMes: {
                incluidas: number;
                excluidasSinTipoCambio: number;
            };
            coberturaYtd: {
                incluidas: number;
                excluidasSinTipoCambio: number;
            };
            coberturaYtdAnterior: {
                incluidas: number;
                excluidasSinTipoCambio: number;
            };
        } | null;
        disponibilidad: {
            ventas: boolean;
            conversion: boolean;
            flujo: boolean;
            resultadoGerencial: boolean;
            remuneraciones: boolean;
            operacion: boolean;
        };
        cobertura: {
            resultadoGerencial: string;
            cuentasCobrar: string;
            cuentasPagar: string;
            credito: string;
            inventario: string;
        };
        estado?: undefined;
    } | {
        periodo: {
            desde: string;
            hasta: string;
            meses: number;
        };
        moneda: string;
        meses: never[];
        principalesClientes: never[];
        estado: "FUENTE_NO_DISPONIBLE";
        segmento?: undefined;
        resumenVentas?: undefined;
        disponibilidad?: undefined;
        cobertura?: undefined;
    }>;
    consultarCentroAtencion(consulta: Consulta, permisos: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        excepciones: Record<string, unknown>[];
        cobertura: {
            familia: string;
            estado: EstadoIndicadorM7;
            detalle: string;
        }[];
        criterioOrden: string;
    }>;
    consultarCotizacionesPendientes(consulta: Consulta, permisos?: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS";
        cantidad: {
            estado: EstadoIndicadorM7;
            valor: number | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        montoPotencial: {
            estado: EstadoIndicadorM7;
            valor: {
                moneda: string;
                monto: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cotizaciones: {
            idCotizacion: number;
            idCliente: number;
            cliente: string;
            moneda: string;
            montoPotencial: number | null;
            fechaEmision: string;
            fechaVigencia: string | null;
            destinoCotizacion: string | null;
            destinoCliente: string | null;
        }[];
        naturaleza: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        cantidad: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        montoPotencial: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cotizaciones: never[];
        naturaleza: string;
    }>;
    private consultarAnalisisVentasCompleto;
    private consultarCuentasCobrarCompleto;
    private consultarCuentasPagarCompleto;
    private presentarProyeccionM7;
    consultarProyeccionesM7(consulta: Consulta): Promise<{
        tipo: string;
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE" | "ERROR_CALCULO";
        categorias: readonly ["INGRESOS_OPERACIONALES", "OTROS_INGRESOS", "PROVEEDORES", "REMUNERACIONES", "IMPUESTOS", "OTROS_EGRESOS"];
        proyecciones: {
            id: number;
            tipo: string;
            anio: number;
            mes: number;
            categoria: string;
            moneda: string;
            montoProyectado: number;
            observacion: string | null;
            estado: string;
        }[];
        totales: {
            ingresosProyectados: number;
            egresosProyectados: number;
            flujoProyectado: number;
            moneda: string;
        }[];
        pendientesClasificacion: {
            id: number;
            tipo: string;
            anio: number;
            mes: number;
            categoria: string;
            moneda: string;
            montoProyectado: number;
            observacion: string | null;
            estado: string;
        }[];
        inconsistencias: {
            id: number;
            tipo: string;
            anio: number;
            mes: number;
            categoria: string;
            moneda: string;
            montoProyectado: number;
            observacion: string | null;
            estado: string;
        }[];
        monedaComparable?: undefined;
        meses?: undefined;
        cobertura?: undefined;
        monedasNoConsolidables?: undefined;
    } | {
        tipo: string;
        monedaComparable: string;
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE" | "ERROR_CALCULO";
        categorias: readonly ["VENTAS_NETAS", "COSTOS_DIRECTOS", "GASTOS_OPERACIONALES"];
        proyecciones: {
            id: number;
            tipo: string;
            anio: number;
            mes: number;
            categoria: string;
            moneda: string;
            montoProyectado: number;
            observacion: string | null;
            estado: string;
        }[];
        meses: {
            margenBruto: number | null;
            resultadoOperativo: number | null;
            margenOperativoPorcentaje: number | null;
            ventasNetas: number | null;
            costosDirectos: number | null;
            gastosOperacionales: number | null;
            anio: number;
            mes: number;
        }[];
        totales: {
            margenBruto: number | null;
            resultadoOperativo: number | null;
            margenOperativoPorcentaje: number | null;
            ventasNetas: number | null;
            costosDirectos: number | null;
            gastosOperacionales: number | null;
        };
        cobertura: {
            mesesEsperados: number;
            mesesCompletos: number;
            porCategoria: {
                [k: string]: number;
            };
        };
        pendientesClasificacion: {
            id: number;
            tipo: string;
            anio: number;
            mes: number;
            categoria: string;
            moneda: string;
            montoProyectado: number;
            observacion: string | null;
            estado: string;
        }[];
        monedasNoConsolidables: string[];
        inconsistencias: {
            id: number;
            tipo: string;
            anio: number;
            mes: number;
            categoria: string;
            moneda: string;
            montoProyectado: number;
            observacion: string | null;
            estado: string;
        }[];
    }>;
    guardarProyeccionM7(entrada: Record<string, unknown>, actorId: bigint, id?: number): Promise<{
        id: number;
        tipo: string;
        anio: number;
        mes: number;
        categoria: string;
        moneda: string;
        montoProyectado: number;
        observacion: string | null;
        estado: string;
    }>;
    desactivarProyeccionM7(id: number, actorId: bigint): Promise<{
        id: number;
        tipo: string;
        anio: number;
        mes: number;
        categoria: string;
        moneda: string;
        montoProyectado: number;
        observacion: string | null;
        estado: string;
    }>;
    consultarPresupuestosM10(consulta: Consulta): Promise<{
        estado: string;
        presupuestos: {
            id: string;
            anio: any;
            ambito: any;
            moneda: any;
            estado: any;
            revision: any;
            versiones: any;
        }[];
        conceptos: {
            real: string;
            proyeccion: string;
            presupuesto: string;
        };
    }>;
    guardarPresupuestoM10(entrada: Record<string, unknown>, actorId: bigint, id?: bigint): Promise<{
        id: string;
        anio: any;
        ambito: any;
        moneda: any;
        estado: any;
        revision: any;
        versiones: any;
    }>;
    compararPresupuestoRealM10(id: bigint, consulta: Consulta, permisos: string[]): Promise<{
        estado: string;
        presupuesto: {
            id: any;
            anio: any;
            moneda: any;
            version: any;
        };
        meses: never[];
        motivo: string;
        real: {
            origen: string;
            congelado: boolean;
        };
    } | {
        estado: string;
        presupuesto: {
            id: any;
            anio: any;
            moneda: any;
            version: any;
        };
        meses: any;
        real: {
            origen: string;
            congelado: boolean;
        };
        motivo?: undefined;
    }>;
    compararVersionesPresupuestoM10(id: bigint, consulta: Consulta): Promise<{
        presupuestoId: string;
        versionA: number;
        versionB: number;
        diferencias: {
            mes: number;
            tipo: string;
            categoria: string;
            versionA: number;
            versionB: number;
            diferencia: number;
            variacionPorcentual: number | null;
        }[];
    }>;
    private presentarCuentaBancariaM7;
    private presentarSaldoInicialBancarioM7;
    guardarCuentaBancariaM7(entrada: Record<string, unknown>, actorId: bigint, id?: number): Promise<{
        id: number;
        banco: string;
        alias: string;
        identificadorEnmascarado: string;
        moneda: string;
        estado: string;
        responsable: string;
        fechaRegistro: Date;
        fechaActualizacion: Date | null;
    }>;
    guardarSaldoInicialBancarioM7(entrada: Record<string, unknown>, actorId: bigint, id?: number): Promise<{
        id: number;
        idCuenta: number;
        cuenta: string;
        banco: string;
        identificadorEnmascarado: string;
        moneda: string;
        fechaCorte: string;
        saldoInicial: number;
        observacion: string;
        estado: string;
        responsable: string;
        fechaRegistro: Date;
        fechaActualizacion: Date | null;
    }>;
    consultarDisponibilidadesBancariasM7(consulta?: Consulta): Promise<{
        estado: EstadoIndicadorM7;
        valor: {
            fechaObjetivo: string;
            cuentas: {
                idSaldoInicial: number | null;
                saldoInicial: number | null;
                fechaCorte: string | null;
                observacionSaldo: string | null;
                ingresosPosteriores: number;
                egresosPosteriores: number;
                saldoReconstruido: number | null;
                estadoCobertura: "SALDO_INICIAL_PENDIENTE" | "COBERTURA_INCOMPLETA" | "RECONSTRUIDO";
                movimientosPosterioresIncluidos: number;
                id: number;
                banco: string;
                alias: string;
                identificadorEnmascarado: string;
                moneda: string;
                estado: string;
                responsable: string;
                fechaRegistro: Date;
                fechaActualizacion: Date | null;
            }[];
            saldosIniciales: {
                id: number | null;
                idCuenta: number;
                cuenta: string;
                banco: string;
                moneda: string;
                fechaCorte: string | null;
                saldoInicial: number | null;
                observacion: string | null;
                responsable: string;
            }[];
            movimientosPosteriores: {
                id: number;
                idCuenta: number;
                cuenta: string;
                banco: string;
                fecha: string;
                moneda: string;
                monto: number;
                naturaleza: string | null;
                estado: string;
            }[];
            resumenPorMoneda: {
                moneda: string;
                cuentas: number;
                saldoReconstruido: number | null;
                estadoCobertura: string;
            }[];
            cobertura: {
                cuentasRegistradas: number;
                cuentasConSaldoInicial: number;
                cuentasReconstruibles: number;
                movimientosSinCuentaIdentificada: number;
                fuenteCanonica: string;
                saldoConfirmadoPorBanco: boolean;
            };
        } | null;
        detalle: string;
        actualizadoEn: Date | null;
    }>;
    private consultarLiquidezCompleto;
    private presentarUmbralMargen;
    private resolverUmbralMargen;
    consultarConfiguracionUmbralMargen(): Promise<{
        codigo: string;
        tipo: string;
        nombre: string;
        unidad: string;
        vigente: {
            id: number;
            valor: number;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
        } | null;
        historial: {
            id: number;
            codigo: string;
            tipo: string;
            nombre: string;
            unidad: string;
            valor: number | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
            estado: string;
        }[];
    }>;
    configurarUmbralMargen(entrada: Record<string, unknown>): Promise<{
        codigo: string;
        tipo: string;
        nombre: string;
        unidad: string;
        vigente: {
            id: number;
            valor: number;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
        } | null;
        historial: {
            id: number;
            codigo: string;
            tipo: string;
            nombre: string;
            unidad: string;
            valor: number | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
            estado: string;
        }[];
    }>;
    private consultarMargenProyectosCompleto;
    consultarAnalisisVentas(consulta: Consulta, permisos?: string[]): Promise<Record<string, unknown>>;
    consultarContextoCliente(idCliente: number, consulta: Consulta, permisos: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO";
        cliente: {
            idCliente: number;
            nombre: string;
            identificador: string | null;
            tipoCliente: string;
            estado: string;
        };
        destinoCliente: string | null;
        bloques: Record<string, unknown>;
    }>;
    consultarCuentasCobrar(consulta: Consulta, permisos?: string[]): Promise<Record<string, unknown>>;
    consultarCuentasPagar(consulta: Consulta, permisos?: string[]): Promise<Record<string, unknown>>;
    consultarLiquidez(consulta: Consulta, permisos?: string[]): Promise<Record<string, unknown>>;
    consultarRiesgoDeficit(consulta: Consulta, permisos: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "CONFIGURACION_PENDIENTE" | "VALIDO";
        umbrales: {
            estado: EstadoIndicadorM7;
            valor: {
                id: number;
                nombre: string;
                valor: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        alertas: {
            estado: EstadoIndicadorM7;
            valor: {
                moneda: string;
                umbral: number;
                nombre: string;
                primeraFechaCruce: string;
                liquidezProyectada: number;
                mensaje: string;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        primerDeficit: {
            estado: EstadoIndicadorM7;
            valor: {
                moneda: string;
                umbral: number;
                nombre: string;
                primeraFechaCruce: string;
                liquidezProyectada: number;
                mensaje: string;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        minimoProyectado: {
            estado: EstadoIndicadorM7;
            valor: {
                fecha: string;
                moneda: string;
                liquidezProyectada: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        factores: {
            estado: EstadoIndicadorM7;
            valor: Record<string, unknown>[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        criterio: string;
    }>;
    consultarMargenProyectos(consulta: Consulta, permisos?: string[]): Promise<Record<string, unknown>>;
    consultarExposicionProyectos(consulta: Consulta, permisos: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        proyectos: Record<string, unknown>[];
        criterio: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        proyectos: never[];
        criterio: string;
    }>;
    consultarContextoProyecto(idProyecto: number, consulta: Consulta, permisos: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO";
        proyecto: {
            idProyecto: number;
            codigo: string;
            nombre: string;
            estadoFinanciero: string;
            moneda: string;
        };
        destinoCliente: string | null;
        bloques: Record<string, unknown>;
    }>;
    consultarCostoRemuneraciones(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS";
        costoLaboral: {
            estado: EstadoIndicadorM7;
            valor: number | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        composicion: {
            estado: EstadoIndicadorM7;
            valor: {
                haberes: number;
                aportesEmpleador: number;
                remuneracionesIncluidas: number;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        evolucion: {
            estado: EstadoIndicadorM7;
            valor: {
                periodo: string;
                costoLaboral: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        comparacion: {
            estado: EstadoIndicadorM7;
            valor: {
                anterior: number;
                actual: number;
                diferenciaAbsoluta: number;
                variacionPorcentual: null;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        } | {
            estado: EstadoIndicadorM7;
            valor: {
                anterior: number;
                actual: number;
                diferenciaAbsoluta: number;
                variacionPorcentual: number;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        atribucionProyecto: {
            estado: EstadoIndicadorM7;
            valor: {
                idProyecto: number;
                codigo: string;
                montoValidado: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        privacidad: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        costoLaboral: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        composicion: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        evolucion: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        comparacion: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        atribucionProyecto: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        privacidad?: undefined;
    }>;
    consultarOrdenesTrabajo(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS";
        ordenes: {
            idOrden: string;
            estado: string | null;
            fecha: string | null;
            proyecto: {
                id: string;
                codigo: string | null;
                nombre: string | null;
                rutCliente: string | null;
            } | null;
            hitos: {
                tareas: number;
                estadosTarea: {
                    estado: string;
                    cantidad: number;
                }[];
                ejecucionesTerminadas: number;
                ejecucionesValidadas: number;
                incidencias: number;
            };
            costoRemunerableValidado: number | null;
            progresoPorcentual: null;
            destinoOwner: string;
        }[];
        progreso: {
            estado: EstadoIndicadorM7;
            valor: {
                idOrden: string;
                estado: string | null;
                hitos: {
                    tareas: number;
                    estadosTarea: {
                        estado: string;
                        cantidad: number;
                    }[];
                    ejecucionesTerminadas: number;
                    ejecucionesValidadas: number;
                    incidencias: number;
                };
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: {
            estado: EstadoIndicadorM7;
            valor: {
                otCanonica: string;
                costos: string;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        ordenes: never[];
        progreso: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura?: undefined;
    }>;
    private consultarProduccionModelosCompleto;
    consultarProduccionModelos(consulta: Consulta, permisos: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        segmento: SegmentoComercialM7;
        estado: "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        resumen: {
            estado: EstadoIndicadorM7;
            valor: {
                modelosTecnicos: number;
                ordenesTrabajo: number;
                unidadesProducidas: number | null;
                horasEstimadas: number | null;
                horasReales: number | null;
                costoLaboralValidado: number | null;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        modelos: {
            estado: EstadoIndicadorM7;
            valor: {
                modeloTecnico: string;
                segmento: string;
                ordenesTrabajo: number;
                unidadesConEspecificacion: number;
                unidadesProducidas: number;
                tareasRegistradas: number;
                ejecucionesRegistradas: number;
                horasEstimadas: number | null;
                horasReales: number | null;
                diferenciaHoras: number | null;
                costoLaboralValidado: number | null;
                costoLaboralPorUnidad: number | null;
                areas: string[];
                coberturaHoras: string;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        areas: {
            estado: EstadoIndicadorM7;
            valor: {
                area: string;
                tareasEjecutadas: number;
                horasReales: number | null;
                costoLaboralValidado: number | null;
                coberturaHoras: string;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: {
            estado: EstadoIndicadorM7;
            valor: ({
                metrica: string;
                fuenteOwner: string;
                relacion: string;
                unidad: string;
                estadoValidacion: string;
                coberturaTemporal: string;
                coberturaModelo: string;
                calculable: boolean;
                brecha: null;
            } | {
                metrica: string;
                fuenteOwner: string;
                relacion: string;
                unidad: string;
                estadoValidacion: string;
                coberturaTemporal: string;
                coberturaModelo: string;
                calculable: boolean;
                brecha: string;
            })[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        relacionComercialTecnica: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        privacidad: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        segmento: SegmentoComercialM7;
        estado: "FUENTE_NO_DISPONIBLE";
        resumen: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        modelos: {
            estado: EstadoIndicadorM7;
            valor: never[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        areas: {
            estado: EstadoIndicadorM7;
            valor: never[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        relacionComercialTecnica?: undefined;
        privacidad?: undefined;
    } | {
        modo: string;
        segmento: SegmentoComercialM7;
        direccion: string;
        periodoA: {
            periodo: {
                desde: string;
                hasta: string;
            };
            segmento: SegmentoComercialM7;
            estado: "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
            resumen: {
                estado: EstadoIndicadorM7;
                valor: {
                    modelosTecnicos: number;
                    ordenesTrabajo: number;
                    unidadesProducidas: number | null;
                    horasEstimadas: number | null;
                    horasReales: number | null;
                    costoLaboralValidado: number | null;
                } | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            modelos: {
                estado: EstadoIndicadorM7;
                valor: {
                    modeloTecnico: string;
                    segmento: string;
                    ordenesTrabajo: number;
                    unidadesConEspecificacion: number;
                    unidadesProducidas: number;
                    tareasRegistradas: number;
                    ejecucionesRegistradas: number;
                    horasEstimadas: number | null;
                    horasReales: number | null;
                    diferenciaHoras: number | null;
                    costoLaboralValidado: number | null;
                    costoLaboralPorUnidad: number | null;
                    areas: string[];
                    coberturaHoras: string;
                }[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            areas: {
                estado: EstadoIndicadorM7;
                valor: {
                    area: string;
                    tareasEjecutadas: number;
                    horasReales: number | null;
                    costoLaboralValidado: number | null;
                    coberturaHoras: string;
                }[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            cobertura: {
                estado: EstadoIndicadorM7;
                valor: ({
                    metrica: string;
                    fuenteOwner: string;
                    relacion: string;
                    unidad: string;
                    estadoValidacion: string;
                    coberturaTemporal: string;
                    coberturaModelo: string;
                    calculable: boolean;
                    brecha: null;
                } | {
                    metrica: string;
                    fuenteOwner: string;
                    relacion: string;
                    unidad: string;
                    estadoValidacion: string;
                    coberturaTemporal: string;
                    coberturaModelo: string;
                    calculable: boolean;
                    brecha: string;
                })[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            relacionComercialTecnica: {
                estado: EstadoIndicadorM7;
                valor: null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            privacidad: string;
        } | {
            periodo: {
                desde: string;
                hasta: string;
            };
            segmento: SegmentoComercialM7;
            estado: "FUENTE_NO_DISPONIBLE";
            resumen: {
                estado: EstadoIndicadorM7;
                valor: null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            modelos: {
                estado: EstadoIndicadorM7;
                valor: never[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            areas: {
                estado: EstadoIndicadorM7;
                valor: never[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            cobertura: {
                estado: EstadoIndicadorM7;
                valor: null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            relacionComercialTecnica?: undefined;
            privacidad?: undefined;
        };
        periodoB: {
            periodo: {
                desde: string;
                hasta: string;
            };
            segmento: SegmentoComercialM7;
            estado: "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
            resumen: {
                estado: EstadoIndicadorM7;
                valor: {
                    modelosTecnicos: number;
                    ordenesTrabajo: number;
                    unidadesProducidas: number | null;
                    horasEstimadas: number | null;
                    horasReales: number | null;
                    costoLaboralValidado: number | null;
                } | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            modelos: {
                estado: EstadoIndicadorM7;
                valor: {
                    modeloTecnico: string;
                    segmento: string;
                    ordenesTrabajo: number;
                    unidadesConEspecificacion: number;
                    unidadesProducidas: number;
                    tareasRegistradas: number;
                    ejecucionesRegistradas: number;
                    horasEstimadas: number | null;
                    horasReales: number | null;
                    diferenciaHoras: number | null;
                    costoLaboralValidado: number | null;
                    costoLaboralPorUnidad: number | null;
                    areas: string[];
                    coberturaHoras: string;
                }[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            areas: {
                estado: EstadoIndicadorM7;
                valor: {
                    area: string;
                    tareasEjecutadas: number;
                    horasReales: number | null;
                    costoLaboralValidado: number | null;
                    coberturaHoras: string;
                }[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            cobertura: {
                estado: EstadoIndicadorM7;
                valor: ({
                    metrica: string;
                    fuenteOwner: string;
                    relacion: string;
                    unidad: string;
                    estadoValidacion: string;
                    coberturaTemporal: string;
                    coberturaModelo: string;
                    calculable: boolean;
                    brecha: null;
                } | {
                    metrica: string;
                    fuenteOwner: string;
                    relacion: string;
                    unidad: string;
                    estadoValidacion: string;
                    coberturaTemporal: string;
                    coberturaModelo: string;
                    calculable: boolean;
                    brecha: string;
                })[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            relacionComercialTecnica: {
                estado: EstadoIndicadorM7;
                valor: null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            privacidad: string;
        } | {
            periodo: {
                desde: string;
                hasta: string;
            };
            segmento: SegmentoComercialM7;
            estado: "FUENTE_NO_DISPONIBLE";
            resumen: {
                estado: EstadoIndicadorM7;
                valor: null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            modelos: {
                estado: EstadoIndicadorM7;
                valor: never[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            areas: {
                estado: EstadoIndicadorM7;
                valor: never[] | null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            cobertura: {
                estado: EstadoIndicadorM7;
                valor: null;
                detalle: string;
                actualizadoEn: Date | null;
            };
            relacionComercialTecnica?: undefined;
            privacidad?: undefined;
        };
        comparacion: {
            unidadesProducidas: {
                diferencia: null;
                variacionPorcentual: null;
            } | {
                diferencia: number;
                variacionPorcentual: number | null;
            };
            horasReales: {
                diferencia: null;
                variacionPorcentual: null;
            } | {
                diferencia: number;
                variacionPorcentual: number | null;
            };
            costoLaboralValidado: {
                diferencia: null;
                variacionPorcentual: null;
            } | {
                diferencia: number;
                variacionPorcentual: number | null;
            };
        };
    }>;
    consultarCargaOperacional(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS";
        abiertos: {
            estado: EstadoIndicadorM7;
            valor: {
                idTarea: string;
                titulo: string | null;
                estado: string | null;
                urgencia: string | null;
                idOrden: string | null;
                fechaComprometida: string | null;
                asignada: boolean;
                destinoOwner: string;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        atrasados: {
            estado: EstadoIndicadorM7;
            valor: {
                idTarea: string;
                titulo: string | null;
                estado: string | null;
                urgencia: string | null;
                idOrden: string | null;
                fechaComprometida: string | null;
                asignada: boolean;
                destinoOwner: string;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        proximos: {
            estado: EstadoIndicadorM7;
            valor: {
                idTarea: string;
                titulo: string | null;
                estado: string | null;
                urgencia: string | null;
                idOrden: string | null;
                fechaComprometida: string | null;
                asignada: boolean;
                destinoOwner: string;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        asignacion: {
            estado: EstadoIndicadorM7;
            valor: {
                asignadas: number;
                noAsignadas: number;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        capacidad: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        criterio: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        abiertos: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        atrasados: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        proximos: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        asignacion?: undefined;
        capacidad?: undefined;
        criterio?: undefined;
    }>;
    consultarInstalaciones(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        volumen: {
            estado: EstadoIndicadorM7;
            valor: number | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        evolucion: {
            estado: EstadoIndicadorM7;
            valor: {
                periodo: string;
                cantidad: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        comparacion: {
            estado: EstadoIndicadorM7;
            valor: {
                anterior: number;
                actual: number;
                diferenciaAbsoluta: number;
                variacionPorcentual: null;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        } | {
            estado: EstadoIndicadorM7;
            valor: {
                anterior: number;
                actual: number;
                diferenciaAbsoluta: number;
                variacionPorcentual: number;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        geografia: {
            estado: EstadoIndicadorM7;
            valor: {
                zona: string;
                region: string;
                ciudad: string;
                comuna: string;
                cantidad: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        instalaciones: {
            idServicio: string;
            tipo: string | null;
            estado: string | null;
            fecha: string;
            zona: string;
            region: string | null;
            ciudad: string | null;
            comuna: string | null;
            destinoOwner: string;
        }[];
        cobertura: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        volumen: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        evolucion: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        geografia: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        comparacion?: undefined;
        instalaciones?: undefined;
        cobertura?: undefined;
    }>;
    consultarAtrasosInstalaciones(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
            anio: number;
        };
        fechaReferencia: string;
        estado: "PARCIALMENTE_DISPONIBLE";
        resumen: {
            estado: EstadoIndicadorM7;
            valor: {
                coberturaTemporalValida: number;
                atrasadas: number;
                enPlazo: number;
                sinFechaSuficiente: number;
                relacionInstalacionNoConfirmada: number;
                finalizadasOAnuladasExcluidas: number;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        atrasos: {
            estado: EstadoIndicadorM7;
            valor: {
                idTarea: string;
                titulo: string | null;
                clasificacionTemporal: string;
                fechaLimite: string;
                diasAtraso: number;
                estadoTarea: string | null;
                idServicio: string | null;
                estadoServicio: string | null;
                idOrden: string | null;
                estadoOrden: string | null;
                idProyecto: string | null;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        enPlazo: {
            estado: EstadoIndicadorM7;
            valor: {
                idTarea: string;
                titulo: string | null;
                clasificacionTemporal: string;
                fechaLimite: string;
                diasAtraso: number;
                estadoTarea: string | null;
                idServicio: string | null;
                estadoServicio: string | null;
                idOrden: string | null;
                estadoOrden: string | null;
                idProyecto: string | null;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        sinInformacionTemporal: {
            estado: EstadoIndicadorM7;
            valor: {
                idTarea: string;
                titulo: string | null;
                estadoTarea: string | null;
                idServicio: string | null;
                idOrden: string | null;
                diasAtraso: null;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        relacionInstalacionNoConfirmada: {
            estado: EstadoIndicadorM7;
            valor: {
                cantidad: number;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        duracion: {
            estado: EstadoIndicadorM7;
            valor: {
                idTarea: string;
                inicioReal: string;
                terminoReal: string;
                duracionDias: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        tiempoCiclo: {
            estado: EstadoIndicadorM7;
            valor: {
                cantidad: number;
                promedioDias: number;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: {
            estado: EstadoIndicadorM7;
            valor: {
                coberturaTemporalValida: number;
                atrasadas: number;
                enPlazo: number;
                sinFechaSuficiente: number;
                relacionInstalacionNoConfirmada: number;
                finalizadasOAnuladasExcluidas: number;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        criterio: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        fechaReferencia: string;
        estado: "FUENTE_NO_DISPONIBLE";
        resumen: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        atrasos: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        enPlazo: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        sinInformacionTemporal: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        duracion: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        tiempoCiclo: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        relacionInstalacionNoConfirmada?: undefined;
        criterio?: undefined;
    }>;
    consultarIncidenciasRetrabajos(consulta: Consulta, permisos?: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        cantidad: {
            estado: EstadoIndicadorM7;
            valor: number | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        calidadValidada: {
            estado: EstadoIndicadorM7;
            valor: number | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        estadosRevision: {
            estado: EstadoIndicadorM7;
            valor: {
                estado: "aprobada" | "rechazada" | "pendiente_revision";
                cantidad: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        categorias: {
            estado: EstadoIndicadorM7;
            valor: {
                categoria: string;
                codigo: string;
                cantidad: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        estados: {
            estado: EstadoIndicadorM7;
            valor: {
                estado: string;
                cantidad: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        evolucion: {
            estado: EstadoIndicadorM7;
            valor: {
                periodo: string;
                cantidad: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        registros: {
            id: string;
            referencia: string;
            tipo: string;
            categoria: {
                codigo: string;
                nombre: string;
            } | null;
            area: string | null;
            estado: string;
            estadoRevision: string;
            descripcion: string;
            causaReferencia: string | null;
            fecha: string;
            antiguedadDias: number;
            tieneEvidencia: boolean;
            idTarea: string;
            tarea: string;
            idOrden: string | null;
            idServicio: string | null;
            proyecto: {
                id: string;
                codigo: string | null;
                nombre: string | null;
            } | null;
            cliente: {
                rut: string;
                nombre: string | null;
            } | null;
            responsableOwner: {
                id: string;
                nombre: string | null;
            } | null;
            destinoOwner: string | null;
            destinoProyecto: string | null;
            destinoCliente: string | null;
        }[];
        retrabajos: {
            estado: EstadoIndicadorM7;
            valor: {
                referencia: string;
                categoria: {
                    codigo: string;
                    nombre: string;
                } | null;
                idOrden: string | null;
                idServicio: string | null;
                destinoOwner: string | null;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: {
            estado: EstadoIndicadorM7;
            valor: {
                vinculados: number;
                sinVinculoOperacional: number;
                sinCategoriaEstructurada: number;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        privacidad: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        cantidad: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        estados: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        registros: never[];
        calidadValidada?: undefined;
        estadosRevision?: undefined;
        categorias?: undefined;
        evolucion?: undefined;
        retrabajos?: undefined;
        cobertura?: undefined;
        privacidad?: undefined;
    }>;
    registrarAjusteLiquidez(entrada: Record<string, unknown>, actor: {
        id: bigint;
        administrador: boolean;
    }): Promise<{
        idMovimiento: number;
        naturaleza: string;
        monto: number;
        fecha: Date;
        responsable: string;
        justificacion: string;
    }>;
    consultarCatalogosAjusteLiquidez(): Promise<{
        naturalezas: {
            valor: string;
            etiqueta: string;
        }[];
        monedas: {
            id: number;
            codigo: string;
            nombre: string;
        }[];
    }>;
    consultarParametrosDeltaM7(): Promise<{
        estado: "CONFIGURACION_PENDIENTE" | "VALIDO";
        parametros: {
            id: number;
            codigo: string;
            nombre: string;
            valor: number | null;
            unidad: string | null;
            referencia: string | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
            estado: string;
        }[];
    }>;
    consultarParametrosPorFamiliaM7(familia: 'UMBRAL_LIQUIDEZ' | 'COSTO_INSTALACION' | 'DIAS_STOCK_INMOVIL'): Promise<{
        estado: "CONFIGURACION_PENDIENTE" | "VALIDO";
        familia: "UMBRAL_LIQUIDEZ" | "COSTO_INSTALACION" | "DIAS_STOCK_INMOVIL";
        parametros: {
            id: number;
            codigo: string;
            nombre: string;
            valor: number | null;
            unidad: string | null;
            referencia: string | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
            estado: string;
        }[];
    }>;
    configurarUmbralLiquidezM7(entrada: Record<string, unknown>): Promise<{
        estado: "CONFIGURACION_PENDIENTE" | "VALIDO";
        parametros: {
            id: number;
            codigo: string;
            nombre: string;
            valor: number | null;
            unidad: string | null;
            referencia: string | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
            estado: string;
        }[];
    }>;
    configurarCostoInstalacionM7(entrada: Record<string, unknown>): Promise<{
        estado: "CONFIGURACION_PENDIENTE" | "VALIDO";
        parametros: {
            id: number;
            codigo: string;
            nombre: string;
            valor: number | null;
            unidad: string | null;
            referencia: string | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
            estado: string;
        }[];
    }>;
    configurarDiasStockInmovilM7(entrada: Record<string, unknown>): Promise<{
        estado: "CONFIGURACION_PENDIENTE" | "VALIDO";
        parametros: {
            id: number;
            codigo: string;
            nombre: string;
            valor: number | null;
            unidad: string | null;
            referencia: string | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
            estado: string;
        }[];
    }>;
    configurarParametroDeltaM7(entrada: Record<string, unknown>): Promise<{
        estado: "CONFIGURACION_PENDIENTE" | "VALIDO";
        parametros: {
            id: number;
            codigo: string;
            nombre: string;
            valor: number | null;
            unidad: string | null;
            referencia: string | null;
            vigenciaDesde: string;
            vigenciaHasta: string | null;
            estado: string;
        }[];
    }>;
    consultarExposicionCreditoM7(consulta: Consulta): Promise<{
        estado: "FUENTE_NO_DISPONIBLE";
        exposicion: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        owner: string;
    } | {
        estado: "VALIDO";
        exposicion: {
            estado: EstadoIndicadorM7;
            valor: unknown;
            detalle: string;
            actualizadoEn: Date | null;
        };
        owner: string;
    }>;
    consultarAlertasCreditoM7(consulta: Consulta): Promise<{
        estado: "FUENTE_NO_DISPONIBLE";
        alertas: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        owner: string;
        criterio: string;
    } | {
        estado: "VALIDO";
        alertas: {
            estado: EstadoIndicadorM7;
            valor: unknown;
            detalle: string;
            actualizadoEn: Date | null;
        };
        owner: string;
        criterio: string;
    } | {
        estado: "FUENTE_NO_DISPONIBLE";
        alertas: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        owner: string;
        criterio?: undefined;
    }>;
    consultarBloqueosEconomicosM7(consulta: Consulta): Promise<{
        estado: "FUENTE_NO_DISPONIBLE";
        bloqueos: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        criterio: string;
    } | {
        estado: "VALIDO";
        bloqueos: {
            estado: EstadoIndicadorM7;
            valor: unknown;
            detalle: string;
            actualizadoEn: Date | null;
        };
        criterio?: undefined;
    } | {
        estado: "FUENTE_NO_DISPONIBLE";
        bloqueos: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        criterio?: undefined;
    }>;
    consultarResumenIva(consulta: Consulta): Promise<{
        naturaleza: string;
        alcance: string;
        criterioCredito: string;
        criterioCorrectores: string;
        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        ivaVentas: {
            monto: number;
            moneda: string;
        }[];
        ivaCompras: {
            monto: number;
            moneda: string;
        }[];
        ivaEstimado: {
            moneda: string;
            ivaVentas: number;
            ivaCompras: number;
            ivaEstimado: number;
        }[];
        cobertura: {
            sinDesglose: number;
            desgloseInconsistente: number;
            correctorSinSignoAcreditado: number;
            documentosVentas: number;
            documentosCompras: number;
            excluidos: number;
        };
        periodo: {
            desde: string;
            hasta: string;
        };
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        ivaEstimado: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
    }>;
    private costosInstalacionVigentes;
    consultarCostosFabricacion(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        proyectos: {
            idProyecto: number;
            codigo: string;
            materiales: number | null;
            costoMaterialReal: number | null;
            costoMaterialEstimado: number | null;
            costosMaterialNoValorizables: number;
            remuneracionesExtra: number;
            costoInstalacion: number | null;
            costoFabricacion: number | null;
            desglose: {
                materiales: {
                    costoUnitario: number | null;
                    costoReal: number | null;
                    costoEstimado: number | null;
                    estadoValorizacion: "FUENTE_NO_DISPONIBLE" | "DATOS_INSUFICIENTES" | "VALIDO";
                    idOrden: string;
                    consumoReal: number | null;
                    consumoEstimado: number | null;
                    diferencia: number | null;
                    sku: string;
                    material: string | null;
                    unidad: string | null;
                }[];
                remuneracionesExtra: {
                    idTareaRemunerable: number;
                    monto: number;
                }[];
                instalaciones: {
                    costo: number | null;
                    parametro: number | null;
                    idServicio: string;
                    fechaReal: string | null;
                    region: string | null;
                    ciudad: string | null;
                    comuna: string | null;
                }[];
            };
            estado: string;
        }[];
        formula: string;
        criterio: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        proyectos: never[];
        formula?: undefined;
        criterio?: undefined;
    }>;
    consultarMargenInstalaciones(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "DATOS_INSUFICIENTES" | "VALIDO";
        instalaciones: {
            idProyecto: number;
            idServicio: string;
            fecha: string;
            region: string | null;
            ciudad: string | null;
            comuna: string | null;
            precio: number;
            costo: number;
            margen: number;
        }[];
        agregados: {
            cantidad: number;
            precioMedio: number;
            costoMedio: number;
            margenAgregado: number;
            margenMedio: number;
        } | null;
        geografia: {
            cantidad?: number | undefined;
            precioMedio?: number | undefined;
            costoMedio?: number | undefined;
            margenAgregado?: number | undefined;
            margenMedio?: number | undefined;
            region: string;
            ciudad: string;
            comuna: string;
        }[];
        comparacion: {
            estado: EstadoIndicadorM7;
            valor: {
                actual: {
                    cantidad: number;
                    precioMedio: number;
                    costoMedio: number;
                    margenAgregado: number;
                    margenMedio: number;
                };
                anterior: {
                    cantidad: number;
                    precioMedio: number;
                    costoMedio: number;
                    margenAgregado: number;
                    margenMedio: number;
                };
                diferenciaMargenAgregado: number;
                variacionMargenPorcentual: number | null;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: string;
    }>;
    consultarInventarioValorizado(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        naturalezaTemporal: string;
        fechaEstado: string;
        estado: "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        valorTotal: {
            estado: EstadoIndicadorM7;
            valor: number | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        valorizacionHistorica: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        existencias: {
            sku: string;
            material: string | null;
            unidad: string | null;
            cantidadFisica: number;
            cantidadReservadaAgregada: number;
            cantidadReservadaDetallada: number;
            cantidadDisponibleDerivada: number;
            conciliacionReservas: string;
            costoUnitarioReferencial: number | null;
            estadoPrecio: "FUENTE_NO_DISPONIBLE" | "DATOS_INSUFICIENTES" | "VALIDO";
            valorActualReferencial: number | null;
            bodegas: number;
            lotes: number;
        }[];
        detalleBodegaLote: {
            clave: string;
            sku: string;
            material: string | null;
            unidad: string | null;
            bodega: string | null;
            idBodega: string;
            lote: string | null;
            idLote: string;
            cantidadFisica: number;
            cantidadReservadaAgregada: number;
            cantidadDisponibleDerivada: number;
            categoria: string | null;
        }[];
        cobertura: {
            sku: number;
            skuValorizados: number;
            skuSinPrecioValido: number;
            skuPendientesConciliacion: number;
            disponibilidad: string;
        };
        matrizTrazabilidad: readonly [{
            readonly fuente: "inventario.inventario_bodega";
            readonly identificador: "material_sku + lote_id_lote + bodega_id_bodega";
            readonly tipoOperacion: "Existencia actual";
            readonly sku: "material_sku";
            readonly cantidad: "cantidad_fisica / cantidad_reservada";
            readonly unidad: "material.material_unidad_medida";
            readonly fecha: null;
            readonly estado: "bodega/lote/material";
            readonly moneda: null;
            readonly valorizacion: "No incluida";
            readonly proyecto: null;
            readonly ordenTrabajo: null;
            readonly documentoOrigen: null;
            readonly riesgoDuplicacion: "Bajo si se conserva la clave compuesta";
            readonly coberturaHistorica: "No disponible";
            readonly usoFinancieroPermitido: "Stock físico y reservado actual";
            readonly relacion: TrazabilidadInventarioM7;
            readonly brecha: "No contiene snapshots ni costo de salida";
        }, {
            readonly fuente: "inventario.reserva_inventario";
            readonly identificador: "reserva_inventario_id_reserva";
            readonly tipoOperacion: "Reserva operacional";
            readonly sku: "material_sku";
            readonly cantidad: "cantidad_reservada";
            readonly unidad: "material.material_unidad_medida";
            readonly fecha: "fecha_reserva / fecha_liberacion";
            readonly estado: "estado_reserva";
            readonly moneda: null;
            readonly valorizacion: "No incluida";
            readonly proyecto: "proyecto_id_proyecto";
            readonly ordenTrabajo: "orden_trabajo_id_orden";
            readonly documentoOrigen: null;
            readonly riesgoDuplicacion: "Alto frente a inventario_bodega.cantidad_reservada";
            readonly coberturaHistorica: "Parcial";
            readonly usoFinancieroPermitido: "Conciliación y trazabilidad; no descontar dos veces";
            readonly relacion: TrazabilidadInventarioM7;
            readonly brecha: "No existe identidad entre reserva y fila agregada de bodega";
        }, {
            readonly fuente: "inventario.material_orden_trabajo";
            readonly identificador: "material_sku + orden_trabajo_id_orden";
            readonly tipoOperacion: "Plan y consumo productivo";
            readonly sku: "material_sku";
            readonly cantidad: "consumo_estimado / consumo_real";
            readonly unidad: "material.material_unidad_medida";
            readonly fecha: "OT, no fecha propia del consumo";
            readonly estado: "estado OT";
            readonly moneda: null;
            readonly valorizacion: "No incluida";
            readonly proyecto: "OT.proyecto_id_proyecto";
            readonly ordenTrabajo: "orden_trabajo_id_orden";
            readonly documentoOrigen: null;
            readonly riesgoDuplicacion: "Medio frente a movimientos sin identidad común";
            readonly coberturaHistorica: "Parcial";
            readonly usoFinancieroPermitido: "Demanda y consumo real separados";
            readonly relacion: TrazabilidadInventarioM7;
            readonly brecha: "El consumo no posee fecha ni movimiento asociado";
        }, {
            readonly fuente: "inventario.movimiento_inventario";
            readonly identificador: "movimiento_inventario_id_movimiento";
            readonly tipoOperacion: "Movimiento de inventario";
            readonly sku: "material_sku";
            readonly cantidad: "cantidad";
            readonly unidad: "material.material_unidad_medida";
            readonly fecha: "fecha_hora";
            readonly estado: "estado";
            readonly moneda: null;
            readonly valorizacion: "No incluida";
            readonly proyecto: "proyecto_id_proyecto";
            readonly ordenTrabajo: null;
            readonly documentoOrigen: "factura_compra_id_factura_compra opcional";
            readonly riesgoDuplicacion: "Medio frente a recepción/consumo";
            readonly coberturaHistorica: "Según registros fechados";
            readonly usoFinancieroPermitido: "Trazabilidad de movimientos, no gasto";
            readonly relacion: TrazabilidadInventarioM7;
            readonly brecha: "Tipo/motivo no garantizan consumo productivo ni vínculo a OT";
        }, {
            readonly fuente: "finanzas.detalle_material_orden_compra_m5";
            readonly identificador: "id_detalle_material_oc_m5";
            readonly tipoOperacion: "Pedido y recepción M5";
            readonly sku: "material_sku";
            readonly cantidad: "cantidad_pedida / cantidad_recibida";
            readonly unidad: "material.material_unidad_medida";
            readonly fecha: "fecha_esperada";
            readonly estado: "orden_compra.estado_ocs";
            readonly moneda: "orden_compra.id_moneda";
            readonly valorizacion: "Monto de OCS, no costo unitario del detalle";
            readonly proyecto: "id_proyecto_financiero_contexto";
            readonly ordenTrabajo: "id_orden_trabajo_contexto";
            readonly documentoOrigen: "id_ocs_m5";
            readonly riesgoDuplicacion: "Alto frente a documento, recepción y entrada";
            readonly coberturaHistorica: "Parcial";
            readonly usoFinancieroPermitido: "Entrada esperada sólo con OCS abierta";
            readonly relacion: TrazabilidadInventarioM7;
            readonly brecha: "Cantidad recibida no prueba ingreso a bodega";
        }, {
            readonly fuente: "finanzas.historial_precio_material";
            readonly identificador: "id_historial_precio_material";
            readonly tipoOperacion: "Precio referencial";
            readonly sku: "material_sku";
            readonly cantidad: null;
            readonly unidad: null;
            readonly fecha: "vigencias";
            readonly estado: "estado_precio";
            readonly moneda: "moneda";
            readonly valorizacion: "Precio unitario y conversión histórica";
            readonly proyecto: null;
            readonly ordenTrabajo: null;
            readonly documentoOrigen: "proveedor opcional";
            readonly riesgoDuplicacion: "Alto cuando hay candidatos simultáneos";
            readonly coberturaHistorica: "Precio sí; stock histórico no";
            readonly usoFinancieroPermitido: "Valorización referencial actual si es inequívoco";
            readonly relacion: TrazabilidadInventarioM7;
            readonly brecha: "No define FIFO, promedio ni costo específico por lote";
        }];
        matrizCobertura: readonly [{
            readonly indicador: "Stock físico actual";
            readonly fuenteOwner: "Inventario";
            readonly tipoDato: "Estado actual";
            readonly estado: "VALIDO";
            readonly coberturaTemporal: "Actual, sin snapshots";
            readonly coberturaMonetaria: "No aplica";
            readonly riesgoDuplicacion: "Bajo";
            readonly dependenciaExterna: "Inventario";
            readonly calculable: true;
            readonly brecha: "Sin reconstrucción histórica";
        }, {
            readonly indicador: "Stock reservado";
            readonly fuenteOwner: "Inventario";
            readonly tipoDato: "Estado actual";
            readonly estado: "PARCIALMENTE_DISPONIBLE";
            readonly coberturaTemporal: "Actual";
            readonly coberturaMonetaria: "No aplica";
            readonly riesgoDuplicacion: "Alto entre agregado y reservas";
            readonly dependenciaExterna: "Conciliación Inventario";
            readonly calculable: true;
            readonly brecha: "Equivalencia entre fuentes no confirmada";
        }, {
            readonly indicador: "Stock disponible";
            readonly fuenteOwner: "Inventario";
            readonly tipoDato: "Derivado";
            readonly estado: "PARCIALMENTE_DISPONIBLE";
            readonly coberturaTemporal: "Actual";
            readonly coberturaMonetaria: "No aplica";
            readonly riesgoDuplicacion: "Alto si se descuenta dos veces";
            readonly dependenciaExterna: "Regla oficial Inventario";
            readonly calculable: true;
            readonly brecha: "Físico menos reservado agregado; pendiente de conciliación";
        }, {
            readonly indicador: "Entradas pendientes";
            readonly fuenteOwner: "M5";
            readonly tipoDato: "Compromiso";
            readonly estado: "PARCIALMENTE_DISPONIBLE";
            readonly coberturaTemporal: "Fecha esperada cuando existe";
            readonly coberturaMonetaria: "No se valoriza";
            readonly riesgoDuplicacion: "Alto con recepción/entrada";
            readonly dependenciaExterna: "OCS abierta M5";
            readonly calculable: true;
            readonly brecha: "Recepción no prueba ingreso a inventario";
        }, {
            readonly indicador: "Consumo real";
            readonly fuenteOwner: "Inventario/Producción";
            readonly tipoDato: "Cantidad real";
            readonly estado: "PARCIALMENTE_DISPONIBLE";
            readonly coberturaTemporal: "Sin fecha propia";
            readonly coberturaMonetaria: "Sólo con precio inequívoco";
            readonly riesgoDuplicacion: "Medio";
            readonly dependenciaExterna: "material_orden_trabajo";
            readonly calculable: true;
            readonly brecha: "Sin identidad con movimiento de salida";
        }, {
            readonly indicador: "Valorización actual referencial";
            readonly fuenteOwner: "Inventario + Finanzas";
            readonly tipoDato: "Estado actual por precio vigente";
            readonly estado: "PARCIALMENTE_DISPONIBLE";
            readonly coberturaTemporal: "Fecha actual";
            readonly coberturaMonetaria: "CLP o FX histórico válido";
            readonly riesgoDuplicacion: "Alto con precios simultáneos";
            readonly dependenciaExterna: "Definición de precio aplicable";
            readonly calculable: true;
            readonly brecha: "No es método contable de inventario";
        }, {
            readonly indicador: "Valorización histórica";
            readonly fuenteOwner: "Inventario";
            readonly tipoDato: "Snapshot/costo histórico";
            readonly estado: "FUENTE_NO_DISPONIBLE";
            readonly coberturaTemporal: "No disponible";
            readonly coberturaMonetaria: "No disponible";
            readonly riesgoDuplicacion: "No aplica";
            readonly dependenciaExterna: "Método owner";
            readonly calculable: false;
            readonly brecha: "Faltan snapshots y método de valorización";
        }, {
            readonly indicador: "Rotación";
            readonly fuenteOwner: "Inventario";
            readonly tipoDato: "Flujo historizable";
            readonly estado: "DATOS_INSUFICIENTES";
            readonly coberturaTemporal: "Movimientos fechados";
            readonly coberturaMonetaria: "No disponible";
            readonly riesgoDuplicacion: "Medio";
            readonly dependenciaExterna: "Clasificación estructurada de consumo";
            readonly calculable: false;
            readonly brecha: "No se identifica inequívocamente la salida productiva";
        }];
        inventario?: undefined;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        inventario: never[];
        naturalezaTemporal?: undefined;
        fechaEstado?: undefined;
        valorTotal?: undefined;
        valorizacionHistorica?: undefined;
        existencias?: undefined;
        detalleBodegaLote?: undefined;
        cobertura?: undefined;
        matrizTrazabilidad?: undefined;
        matrizCobertura?: undefined;
    }>;
    consultarMaterialesProyectoOt(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        naturalezaTemporal: string;
        estado: "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        materialesBodegaAsignados: {
            estadoOrden: string | null;
            idOrden: string;
            idProyecto: string | null;
            destinoOrden: string;
            consumoReal: number | null;
            consumoEstimado: number | null;
            diferencia: number | null;
            sku: string;
            material: string | null;
            unidad: string | null;
        }[];
        materialesCompradosEspecificamente: {
            idCompra: number;
            estadoCompra: string;
            sku: string;
            material: string | null;
            cantidadPedida: number;
            cantidadRecibida: number;
            cantidadPendiente: number;
            idProyecto: number | null;
            idOrden: string | null;
            proveedor: string;
            destinoCompra: string;
        }[];
        cobertura: string;
    } | {
        estado: "FUENTE_NO_DISPONIBLE";
        materialesBodegaAsignados: never[];
        materialesCompradosEspecificamente: never[];
        periodo?: undefined;
        naturalezaTemporal?: undefined;
        cobertura?: undefined;
    }>;
    consultarRiesgoStock(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        naturalezaTemporal: string;
        estado: "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        materiales: {
            sku: string;
            material: string;
            stockFisico: number;
            stockReservadoAgregado: number;
            reservasActivasDetalladas: number;
            stockDisponibleDerivado: number;
            conciliacionReservas: string;
            entradasEsperadas: number;
            demandaFuturaNoReservada: number;
            disponibilidadFutura: number;
            faltante: number;
            riesgo: boolean;
        }[];
        riesgos: {
            sku: string;
            material: string;
            stockFisico: number;
            stockReservadoAgregado: number;
            reservasActivasDetalladas: number;
            stockDisponibleDerivado: number;
            conciliacionReservas: string;
            entradasEsperadas: number;
            demandaFuturaNoReservada: number;
            disponibilidadFutura: number;
            faltante: number;
            riesgo: boolean;
        }[];
        criterio: string;
        cobertura: string;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        materiales: never[];
        riesgos: never[];
        naturalezaTemporal?: undefined;
        criterio?: undefined;
        cobertura?: undefined;
    }>;
    consultarRotacionInventario(consulta: Consulta): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "CONFIGURACION_PENDIENTE";
        stockInmovil: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        parametroDias?: undefined;
        stockSinUltimoMovimiento?: undefined;
        movimientosPeriodo?: undefined;
        rotacion?: undefined;
        cobertura?: undefined;
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        parametroDias: number;
        stockInmovil: {
            estado: EstadoIndicadorM7;
            valor: {
                sku: string;
                material: string | null;
                unidad: string | null;
                stock: number;
                ultimoMovimiento: string;
                diasSinMovimiento: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        stockSinUltimoMovimiento: {
            estado: EstadoIndicadorM7;
            valor: {
                sku: string;
                material: string | null;
                unidad: string | null;
                stock: number;
                ultimoMovimiento: null;
                estado: string;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        movimientosPeriodo: {
            idMovimiento: string;
            fecha: string;
            sku: string | null;
            material: string | null;
            unidad: string | null;
            cantidad: number | null;
            estado: string | null;
            efectivoFisicamente: boolean;
            tipo: string | null;
            motivo: string | null;
            clasificacionSalida: string | null;
        }[];
        rotacion: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
    } | {
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "FUENTE_NO_DISPONIBLE";
        stockInmovil: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        parametroDias?: undefined;
        stockSinUltimoMovimiento?: undefined;
        movimientosPeriodo?: undefined;
        rotacion?: undefined;
        cobertura?: undefined;
    }>;
    consultarComprasRecepciones(consulta: Consulta, permisos?: string[]): Promise<{
        periodo: {
            desde: string;
            hasta: string;
        };
        naturalezaTemporal: string;
        estado: "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
        ordenesPendientes: {
            idCompra: number;
            estadoCompra: string;
            proveedor: string;
            sku: string;
            material: string | null;
            cantidadPedida: number;
            cantidadRecibida: number;
            cantidadPendiente: number;
            fechaEsperada: string | null;
            ingresadoInventario: null;
            estadoIngresoInventario: string;
            idFichaCliente: number | null;
            idCotizacion: number | null;
            idProyecto: number | null;
            idOrden: string | null;
            acciones: AccionNavegacion[];
        }[];
        criterio: string;
        cobertura: string;
    } | {
        estado: "FUENTE_NO_DISPONIBLE";
        ordenesPendientes: never[];
        periodo?: undefined;
        naturalezaTemporal?: undefined;
        criterio?: undefined;
        cobertura?: undefined;
    }>;
    consultarResumenResultados(consulta: Consulta, permisos?: string[]): Promise<{
        devengado: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: {
            estado: EstadoIndicadorM7;
            valor: {
                completa: boolean;
                incluye: string[];
                noDisponibles: string[];
                noIncluyeEbitda: string[];
                ventasExcluidasSinConversion: number;
                costosExcluidosSinConversion: any;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        iva?: {
            naturaleza: string;
            alcance: string;
            criterioCredito: string;
            criterioCorrectores: string;
            estado: "DATOS_INSUFICIENTES" | "VALIDO" | "SIN_RESULTADOS" | "PARCIALMENTE_DISPONIBLE";
            ivaVentas: {
                monto: number;
                moneda: string;
            }[];
            ivaCompras: {
                monto: number;
                moneda: string;
            }[];
            ivaEstimado: {
                moneda: string;
                ivaVentas: number;
                ivaCompras: number;
                ivaEstimado: number;
            }[];
            cobertura: {
                sinDesglose: number;
                desgloseInconsistente: number;
                correctorSinSignoAcreditado: number;
                documentosVentas: number;
                documentosCompras: number;
                excluidos: number;
            };
            periodo: {
                desde: string;
                hasta: string;
            };
        } | {
            periodo: {
                desde: string;
                hasta: string;
            };
            estado: "FUENTE_NO_DISPONIBLE";
            ivaEstimado: {
                estado: EstadoIndicadorM7;
                valor: null;
                detalle: string;
                actualizadoEn: Date | null;
            };
        } | undefined;
        presupuestoManual?: {
            estado: EstadoIndicadorM7;
            valor: {
                estado: string;
                presupuestos: {
                    id: string;
                    anio: any;
                    ambito: any;
                    moneda: any;
                    estado: any;
                    revision: any;
                    versiones: any;
                }[];
                conceptos: {
                    real: string;
                    proyeccion: string;
                    presupuesto: string;
                };
            } | {
                estado: string;
                presupuestos: never[];
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        } | undefined;
        resultadoGerencial: {
            estado: EstadoIndicadorM7;
            valor: {
                moneda: string;
                ingresos: number;
                costosDirectos: number;
                resultadoGerencial: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        presupuestoResultados: {
            estado: EstadoIndicadorM7;
            valor: {
                anio: number;
                moneda: string;
                categorias: readonly ["VENTAS_NETAS", "COSTOS_DIRECTOS", "GASTOS_OPERACIONALES"];
                proyecciones: any;
                meses: any;
                totalAnual: any;
                cobertura: any;
                seriePresupuestoReal: any;
                comparacionPeriodo: {
                    interpretacion: string;
                    diferencia: number | null;
                    variacionPorcentual: number | null;
                    concepto: string;
                    presupuesto: number | null;
                    real: number | null;
                }[];
                presupuestoYtd: {
                    margenBruto: number | null;
                    resultadoOperativo: number | null;
                    margenOperativoPorcentaje: number | null;
                    ventasNetas: number | null;
                    costosDirectos: number | null;
                    gastosOperacionales: number | null;
                };
                comparacionYtd: {
                    interpretacion: string;
                    diferencia: number | null;
                    variacionPorcentual: number | null;
                    concepto: string;
                    presupuesto: number | null;
                    real: number | null;
                }[];
                comparableDirecto: boolean;
                advertencias: string[];
                pendientesClasificacion: any;
                monedasNoConsolidables: any;
                inconsistencias: any;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        ebitda?: {
            estado: EstadoIndicadorM7;
            valor: {
                estado: "CONFIGURACION_PENDIENTE";
                calculable: boolean;
                monto: null;
                porcentaje: null;
                motivo: string;
                cobertura: {
                    ventasNetas: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    costosDirectos: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    gastosOperacionales: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    gastosExcluidos: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO";
                        valor: null;
                        detalle: string;
                    };
                    conversionMonetaria: {
                        estado: "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: {
                            ventasExcluidasSinFx: number;
                            costosExcluidosSinFx: number;
                        };
                        detalle: string;
                    };
                    duplicados: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO";
                        valor: null;
                        detalle: string;
                    };
                };
            } | {
                estado: "DATOS_INSUFICIENTES" | "VALIDO";
                calculable: boolean;
                monto: null;
                porcentaje: null;
                motivo: string;
                cobertura: {
                    ventasNetas: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    costosDirectos: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    gastosOperacionales: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    gastosExcluidos: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO";
                        valor: null;
                        detalle: string;
                    };
                    conversionMonetaria: {
                        estado: "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: {
                            ventasExcluidasSinFx: number;
                            costosExcluidosSinFx: number;
                        };
                        detalle: string;
                    };
                    duplicados: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO";
                        valor: null;
                        detalle: string;
                    };
                };
            } | {
                estado: "VALIDO";
                calculable: boolean;
                monto: number | null;
                porcentaje: number | null;
                motivo: string;
                cobertura: {
                    ventasNetas: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    costosDirectos: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    gastosOperacionales: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    gastosExcluidos: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO";
                        valor: null;
                        detalle: string;
                    };
                    conversionMonetaria: {
                        estado: "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: {
                            ventasExcluidasSinFx: number;
                            costosExcluidosSinFx: number;
                        };
                        detalle: string;
                    };
                    duplicados: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO";
                        valor: null;
                        detalle: string;
                    };
                };
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        } | undefined;
        titulo: string;
        tituloEstadoResultados: string;
        periodo: {
            desde: string;
            hasta: string;
        };
        estado: "DATOS_INSUFICIENTES" | "PARCIALMENTE_DISPONIBLE";
        estadoResultados: {
            estado: EstadoIndicadorM7;
            valor: {
                costosExcluidosSinConversion: any;
                margenBruto: number | null;
                ebitdaMonto: number | null;
                ebitdaPorcentaje: number | null;
                ventasNetas: number | null;
                costoVenta: number | null;
                gastosOperacionales: number | null;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        acumuladoYtd: {
            estado: EstadoIndicadorM7;
            valor: {
                costosExcluidosSinConversion: any;
                margenBruto: number | null;
                ebitdaMonto: number | null;
                ebitdaPorcentaje: number | null;
                ventasNetas: number | null;
                costoVenta: number | null;
                gastosOperacionales: number | null;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        serieMensual: any;
        ingresos: {
            estado: EstadoIndicadorM7;
            valor: {
                moneda: string;
                monto: number;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        costosDirectos: {
            estado: EstadoIndicadorM7;
            valor: {
                monto: number;
                moneda: string;
            }[] | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        gastosRegistrados: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        coberturaEstadoResultados: {
            estado: EstadoIndicadorM7;
            valor: {
                matrizFuentes: readonly [{
                    readonly fuente: "nota_venta";
                    readonly campoMonto: "monto_neto";
                    readonly fecha: "fecha_emision";
                    readonly estadoValido: "confirmada o cerrada";
                    readonly clasificacion: "Venta definitiva";
                    readonly proyectoAsociado: "Disponible sólo cuando la Nota de Venta está vinculada inequívocamente";
                    readonly posibleDuplicacion: "Documentos tributarios y pagos representan otras etapas y no se suman";
                    readonly tratamientoTributario: "Monto neto; IVA débito permanece separado";
                    readonly moneda: "CLP directo o moneda extranjera con tipo_cambio_usado histórico";
                    readonly aptitud: AptitudFuenteEerrM7;
                    readonly motivo: "Fuente owner de ventas netas definitivas";
                    readonly datoFaltante: null;
                }, {
                    readonly fuente: "costo_proyecto";
                    readonly campoMonto: "monto_costo";
                    readonly fecha: "fecha_costo";
                    readonly estadoValido: "distinto de anulado";
                    readonly clasificacion: "categoria_costo y origen_costo sin catálogo contable cerrado";
                    readonly proyectoAsociado: "Sí, id_proyecto_financiero obligatorio";
                    readonly posibleDuplicacion: "Puede vincularse a documento de proveedor y coexistir con tareas remunerables";
                    readonly tratamientoTributario: "El modelo no identifica inequívocamente neto e IVA por cada costo";
                    readonly moneda: "Moneda explícita; no existe FX histórico propio obligatorio";
                    readonly aptitud: AptitudFuenteEerrM7;
                    readonly motivo: "Apta para margen directo atribuido, no para afirmar cobertura contable completa";
                    readonly datoFaltante: "Regla de IVA, FX e identidad transversal con documentos y remuneraciones";
                }, {
                    readonly fuente: "tarea_remunerable";
                    readonly campoMonto: "monto_calculado";
                    readonly fecha: "fecha_tarea";
                    readonly estadoValido: "validada y vinculada a proyecto";
                    readonly clasificacion: "Mano de obra productiva atribuible";
                    readonly proyectoAsociado: "Sí, cuando id_proyecto_financiero no es null";
                    readonly posibleDuplicacion: "Puede estar incorporada posteriormente en liquidación/remuneración";
                    readonly tratamientoTributario: "No corresponde a IVA";
                    readonly moneda: "CLP en el contrato actual";
                    readonly aptitud: AptitudFuenteEerrM7;
                    readonly motivo: "Útil como costo directo atribuible, sin conciliación completa contra remuneración oficial";
                    readonly datoFaltante: "Identidad que impida duplicarla con el costo laboral cerrado";
                }, {
                    readonly fuente: "documento_compra_proveedor";
                    readonly campoMonto: "monto_neto";
                    readonly fecha: "fecha_emision";
                    readonly estadoValido: "distinto de anulado o rechazado";
                    readonly clasificacion: "Detalle material y vínculo opcional a costo de proyecto";
                    readonly proyectoAsociado: "Parcial mediante detalle_costo_proyecto_documento_proveedor";
                    readonly posibleDuplicacion: "Documento, costo de proyecto, obligación y pago pueden representar el mismo hecho";
                    readonly tratamientoTributario: "Separa monto_neto y monto_impuesto";
                    readonly moneda: "Moneda y tipo_cambio_usado histórico disponibles";
                    readonly aptitud: AptitudFuenteEerrM7;
                    readonly motivo: "Tiene base tributaria, pero no clasifica por sí sola gasto operacional versus inventario/costo";
                    readonly datoFaltante: "Clasificación económica aprobada y conciliación única con M5/costos/inventario";
                }, {
                    readonly fuente: "documento_proveedor_m5";
                    readonly campoMonto: "monto_total";
                    readonly fecha: "fecha_emision";
                    readonly estadoValido: "confirmado";
                    readonly clasificacion: "Categoría de egreso e imputación confirmada";
                    readonly proyectoAsociado: "Opcional mediante detalle_imputacion_m5";
                    readonly posibleDuplicacion: "Obligación, pago, costo de proyecto, documento legacy o inventario";
                    readonly tratamientoTributario: "No separa neto e IVA en el modelo";
                    readonly moneda: "Moneda explícita y FX confirmado cuando corresponde";
                    readonly aptitud: AptitudFuenteEerrM7;
                    readonly motivo: "La clasificación existe, pero el monto disponible es total y no asegura naturaleza EBITDA";
                    readonly datoFaltante: "Monto neto, tratamiento tributario y taxonomía contable de categorías";
                }, {
                    readonly fuente: "remuneracion";
                    readonly campoMonto: "costo_empresa / total_haberes + total_aportes_empleador";
                    readonly fecha: "periodo_remuneracion.fecha_inicio/fecha_fin";
                    readonly estadoValido: "cerrada";
                    readonly clasificacion: "Sin separación inequívoca entre producción, proyecto y administración";
                    readonly proyectoAsociado: "No en la remuneración; sólo algunas tareas remunerables tienen proyecto";
                    readonly posibleDuplicacion: "Las tareas remunerables productivas pueden formar parte de la remuneración oficial";
                    readonly tratamientoTributario: "No corresponde a IVA; impuestos y descuentos no equivalen automáticamente a gasto EBITDA";
                    readonly moneda: "CLP";
                    readonly aptitud: AptitudFuenteEerrM7;
                    readonly motivo: "Costo laboral oficial disponible, pero sin distribución económica completa";
                    readonly datoFaltante: "Clasificación laboral aprobada y conciliación con tareas productivas";
                }, {
                    readonly fuente: "gasto_caja_chica_m5 / gasto_caja_chica";
                    readonly campoMonto: "monto / monto_gasto";
                    readonly fecha: "fecha_gasto";
                    readonly estadoValido: "aprobado / validación aprobada";
                    readonly clasificacion: "Descripción libre; sin destino económico estructurado suficiente";
                    readonly proyectoAsociado: "No inequívoco";
                    readonly posibleDuplicacion: "Puede corresponder a documento, material, costo de instalación o movimiento financiero";
                    readonly tratamientoTributario: "No separa monto neto e IVA de forma inequívoca";
                    readonly moneda: "No explícita en los modelos revisados";
                    readonly aptitud: AptitudFuenteEerrM7;
                    readonly motivo: "La aprobación no demuestra que sea gasto operacional ni evita duplicación";
                    readonly datoFaltante: "Moneda, IVA, categoría contable, proyecto y vínculo documental único";
                }, {
                    readonly fuente: "movimiento_financiero / pagos";
                    readonly campoMonto: "monto_movimiento / monto pagado";
                    readonly fecha: "fecha_movimiento / fecha_pago";
                    readonly estadoValido: "vigente, no anulado ni rechazado";
                    readonly clasificacion: "Naturaleza de caja";
                    readonly proyectoAsociado: "Sólo mediante orígenes, no reconocimiento económico";
                    readonly posibleDuplicacion: "Es la liquidación de obligaciones o hechos ya reconocidos";
                    readonly tratamientoTributario: "No determina neto ni IVA del hecho económico";
                    readonly moneda: "Moneda explícita; FX no convierte el pago en gasto";
                    readonly aptitud: AptitudFuenteEerrM7;
                    readonly motivo: "Un movimiento de efectivo no equivale a gasto devengado";
                    readonly datoFaltante: "No aplica como fuente primaria de EERR";
                }, {
                    readonly fuente: "inventario_bodega / movimiento_inventario";
                    readonly campoMonto: "cantidad física o salida; valorización parcial";
                    readonly fecha: "fecha de movimiento cuando existe";
                    readonly estadoValido: "movimiento/stock vigente";
                    readonly clasificacion: "Material, lote y tipo de movimiento";
                    readonly proyectoAsociado: "Parcial mediante lote, reserva u orden de trabajo";
                    readonly posibleDuplicacion: "Compra, documento y costo de proyecto pueden representar adquisición/consumo relacionado";
                    readonly tratamientoTributario: "La compra no es gasto mientras permanezca como inventario";
                    readonly moneda: "Costo histórico completo no asegurado para cada consumo";
                    readonly aptitud: AptitudFuenteEerrM7;
                    readonly motivo: "No existe conciliación completa de consumo valorizado hacia costo del período";
                    readonly datoFaltante: "Costo de salida histórico, consumo real y conciliación con compra/proyecto";
                }];
                estado: "DATOS_INSUFICIENTES" | "VALIDO";
                calculable: boolean;
                partidas: {
                    ventasNetas: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    costosDirectos: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    gastosOperacionales: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: number | null;
                        detalle: string;
                    };
                    gastosExcluidos: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO";
                        valor: null;
                        detalle: string;
                    };
                    conversionMonetaria: {
                        estado: "VALIDO" | "PARCIALMENTE_DISPONIBLE";
                        valor: {
                            ventasExcluidasSinFx: number;
                            costosExcluidosSinFx: number;
                        };
                        detalle: string;
                    };
                    duplicados: {
                        estado: "DATOS_INSUFICIENTES" | "VALIDO";
                        valor: null;
                        detalle: string;
                    };
                };
                motivo: string;
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
    }>;
    consultarSituacionFinanciera(consulta: Consulta): Promise<{
        titulo: string;
        periodo: {
            desde: string;
            hasta: string;
        };
        fechaCorte: string;
        estado: "DATOS_INSUFICIENTES";
        disponibilidades: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cuentasPorCobrar: {
            estado: EstadoIndicadorM7;
            valor: any;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cuentasPorPagar: {
            estado: EstadoIndicadorM7;
            valor: any;
            detalle: string;
            actualizadoEn: Date | null;
        };
        patrimonio: {
            estado: EstadoIndicadorM7;
            valor: null;
            detalle: string;
            actualizadoEn: Date | null;
        };
        cobertura: {
            estado: EstadoIndicadorM7;
            valor: {
                completa: boolean;
                incluidas: string[];
                noDisponibles: string[];
            } | null;
            detalle: string;
            actualizadoEn: Date | null;
        };
    }>;
    descargarExcelVentas(entrada: Record<string, unknown>, permisos: string[]): Promise<Record<string, unknown>>;
    descargarPdfContextual(entrada: Record<string, unknown>, permisos: string[]): Promise<{
        nombre: string;
        mime: string;
        contenido: string;
    }>;
}
export {};
//# sourceMappingURL=M7Controller.d.ts.map