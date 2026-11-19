export type SegmentoDocumentoComercial = 'B2B' | 'B2C' | 'CARTA_B2C';
export interface LineaDocumentoComercial {
    idDetalleCotizacion?: number | null;
    idProductoComercial?: number | null;
    idVersionProducto?: number | null;
    codigo?: string | null;
    nombre: string;
    descripcion?: string | null;
    cantidad: number;
    unidad?: string | null;
    dimensiones?: string | null;
    precioUnitario?: number | null;
    subtotal?: number | null;
    caracteristicas?: string[];
    opcionales?: string[];
}
export interface AlternativaDocumentoComercial {
    identificador: string;
    etiqueta: string;
    producto: string;
    descripcion?: string | null;
    caracteristicas?: string[];
    opcionales?: string[];
    moneda: string;
    neto: number;
    impuesto: number;
    total: number;
    fotografiaDisponible: boolean;
}
export interface SnapshotDocumentoComercial {
    tipo: SegmentoDocumentoComercial;
    titulo: string;
    numero?: string | null;
    version?: number | null;
    fecha: string;
    vigencia?: string | null;
    borrador: boolean;
    camposPendientes?: string[];
    cliente?: {
        nombre: string;
        rut?: string | null;
        correo?: string | null;
        telefono?: string | null;
    } | null;
    contactos?: Array<{
        nombre: string;
        cargo?: string | null;
        correo?: string | null;
        telefono?: string | null;
        principal?: boolean;
    }>;
    proyecto?: {
        nombre?: string | null;
        referencia?: string | null;
        ubicacion?: string | null;
        alcance?: string | null;
    } | null;
    introduccion?: string | null;
    moneda: string;
    productos: LineaDocumentoComercial[];
    servicios?: LineaDocumentoComercial[];
    alternativas?: AlternativaDocumentoComercial[];
    neto?: number | null;
    impuesto?: number | null;
    total?: number | null;
    condiciones?: string[];
    observaciones?: string[];
    plantilla?: {
        id?: string | null;
        version?: number | null;
        nombre: string;
        publicada: boolean;
    } | null;
}
/** Renderer único para vista previa y emisión. Consume exclusivamente el snapshot comercial validado por M2. */
export declare function crearPdfComercial(snapshot: SnapshotDocumentoComercial): {
    pdf: Buffer<ArrayBuffer>;
    sha256: string;
    paginas: number;
};
//# sourceMappingURL=MotorPdfComercial.d.ts.map