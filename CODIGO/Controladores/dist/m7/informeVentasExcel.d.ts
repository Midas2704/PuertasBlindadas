export type TipoInformeVentasExcelM7 = 'VENTAS' | 'COTIZACIONES';
export interface FilaVentaExcelM7 {
    fechaVenta: Date;
    idNotaVenta: number;
    numeroNotaVenta: string;
    idCotizacion: number | null;
    cliente: string;
    rutCliente: string;
    segmento: string;
    producto: string;
    descripcion: string;
    cantidad: number;
    moneda: string;
    ventaNetaOriginalItem: number | null;
    tipoCambioHistorico: number | null;
    ventaNetaClpItem: number | null;
    ventaNetaOriginalNota: number;
    estadoNotaVenta: string;
    idProyecto: number | string | null;
    codigoProyecto: string;
}
export interface FilaCotizacionExcelM7 {
    fechaEmision: Date;
    idCotizacion: number;
    cliente: string;
    rutCliente: string;
    segmento: string;
    producto: string;
    descripcion: string;
    cantidad: number;
    valorUnitario: number | null;
    subtotalDetalle: number;
    moneda: string;
    montoNetoCotizacion: number | null;
    montoIvaCotizacion: number | null;
    montoTotalCotizacion: number | null;
    estadoCotizacion: string;
    fechaVigencia: Date | null;
    convertidaNotaVenta: string;
    idNotaVenta: number | null;
}
export interface EntradaInformeVentasExcelM7 {
    tipo: TipoInformeVentasExcelM7;
    periodo: string;
    segmento: string;
    generadoEn: Date;
    filas: FilaVentaExcelM7[] | FilaCotizacionExcelM7[];
    nombreArchivo: string;
    incluirRut?: boolean;
    hojas?: Array<{
        nombre: string;
        periodo: string;
        filas: FilaVentaExcelM7[] | FilaCotizacionExcelM7[];
    }>;
}
interface ColumnaInforme {
    encabezado: string;
    clave: string;
    ancho: number;
    formato?: string;
}
export declare const neutralizarFormulaExcelM10: (valor: unknown) => unknown;
export declare function serializarFilaExcelM10(fila: Record<string, unknown>, columnas: ColumnaInforme[]): {
    [k: string]: unknown;
};
export declare function crearInformeVentasExcelM7(entrada: EntradaInformeVentasExcelM7): Promise<{
    nombre: string;
    mimeType: string;
    contenido: string;
}>;
export {};
//# sourceMappingURL=informeVentasExcel.d.ts.map