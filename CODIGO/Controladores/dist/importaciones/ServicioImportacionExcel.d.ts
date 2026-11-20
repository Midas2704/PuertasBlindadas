export type TipoImportacion = 'clientes' | 'empleados' | 'proveedores' | 'areas-trabajo' | 'tareas-fabricacion' | 'categorias-egreso';
export interface ErrorFilaImportacion {
    fila: number;
    errores: string[];
}
export interface AnalisisImportacion {
    tipo: TipoImportacion;
    titulo: string;
    totalFilas: number;
    filas: Array<{
        numero: number;
        datos: Record<string, unknown>;
    }>;
    errores: ErrorFilaImportacion[];
    filasMuestra: Array<Record<string, unknown>>;
}
export interface HojaReferenciaImportacion {
    nombre: string;
    columnas: Array<{
        clave: string;
        cabecera: string;
    }>;
    filas: Array<Record<string, unknown>>;
}
export declare function tiposImportacionDisponibles(): {
    tipo: TipoImportacion;
    titulo: string;
    archivo: string;
}[];
export declare function generarPlantillaImportacion(tipoEntrada: string, referencias?: HojaReferenciaImportacion[]): Promise<{
    nombre: string;
    mimeType: string;
    contenidoBase64: string;
}>;
export declare function analizarArchivoImportacion(tipoEntrada: string, contenidoBase64: unknown): Promise<AnalisisImportacion>;
//# sourceMappingURL=ServicioImportacionExcel.d.ts.map