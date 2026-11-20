/** Renderer PDF liviano compartido por los documentos financieros del sistema. */
export declare function crearPdf(lineas: string[]): Buffer<ArrayBuffer>;
export declare const archivoPdf: (nombre: string, lineas: string[]) => {
    nombre: string;
    mime: string;
    contenido: string;
};
export type TonoInformePdf = 'neutro' | 'exitoso' | 'rechazado' | 'fallido';
export type InformePdf = {
    titulo: string;
    subtitulo: string;
    generado: string;
    periodo: string;
    solicitante: string;
    total: number;
    filtros: Array<{
        etiqueta: string;
        valor: string;
    }>;
    tarjetas: Array<{
        etiqueta: string;
        valor: string;
        detalle?: string;
        tono?: TonoInformePdf;
    }>;
    modulos: Array<{
        etiqueta: string;
        cantidad: number;
    }>;
    resultados: Array<{
        etiqueta: string;
        cantidad: number;
        porcentaje: number;
        tono?: TonoInformePdf;
    }>;
    tabla: {
        columnas: Array<{
            clave: string;
            etiqueta: string;
            ancho: number;
        }>;
        filas: Array<Record<string, string>>;
    };
    pie: string;
};
/** Renderer estructurado para informes tabulares, sin acceder a fuentes de datos. */
export declare function crearInformePdf(informe: InformePdf): Buffer<ArrayBuffer>;
export declare const archivoPdfInforme: (nombre: string, informe: InformePdf) => {
    nombre: string;
    mime: string;
    contenido: string;
};
export type TarjetaDocumentoPdf = {
    etiqueta: string;
    valor: string;
    detalle?: string;
    tono?: TonoInformePdf;
};
export type SerieDocumentoPdf = {
    etiqueta: string;
    valores: Array<number | null>;
    color?: 'naranja' | 'gris' | 'negro' | 'verde';
    estilo?: 'barra' | 'linea';
    eje?: 'izquierdo' | 'derecho';
};
export type BloqueDocumentoPdf = {
    tipo: 'tarjetas';
    tarjetas: TarjetaDocumentoPdf[];
} | {
    tipo: 'grafico';
    titulo: string;
    categorias: string[];
    series: SerieDocumentoPdf[];
    formato?: 'moneda' | 'numero' | 'porcentaje';
    ejeIzquierdo?: string;
    ejeDerecho?: {
        etiqueta: string;
        formato?: 'moneda' | 'numero' | 'porcentaje';
        minimo?: number;
        maximo?: number;
    };
    alto?: number;
    nota?: string;
} | {
    tipo: 'barras';
    titulo: string;
    filas: Array<{
        etiqueta: string;
        valor: number;
        detalle?: string;
    }>;
    formato?: 'moneda' | 'numero' | 'porcentaje';
    maximoFilas?: number;
} | {
    tipo: 'tabla';
    titulo: string;
    columnas: Array<{
        clave: string;
        etiqueta: string;
        ancho: number;
        alinear?: 'izquierda' | 'derecha';
    }>;
    filas: Array<Record<string, string>>;
    nota?: string;
} | {
    tipo: 'notas';
    titulo?: string;
    lineas: string[];
    tono?: TonoInformePdf;
};
export type DocumentoGerencialPdf = {
    titulo: string;
    subtitulo: string;
    generado: string;
    periodo: string;
    filtros: string;
    moneda?: string;
    paginas: Array<{
        titulo: string;
        subtitulo?: string;
        bloques: BloqueDocumentoPdf[];
    }>;
    pie: string;
};
export declare function crearDocumentoGerencialPdf(documento: DocumentoGerencialPdf): Buffer<ArrayBuffer>;
export declare const archivoPdfGerencial: (nombre: string, documento: DocumentoGerencialPdf) => {
    nombre: string;
    mime: string;
    contenido: string;
};
//# sourceMappingURL=pdf.d.ts.map