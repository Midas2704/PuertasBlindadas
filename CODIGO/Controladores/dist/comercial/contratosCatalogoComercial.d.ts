export type SegmentoComercial = 'B2B' | 'B2C';
export type EstadoConsultaComercial = 'VIGENTE' | 'SIN_PRECIO' | 'SIN_COBERTURA' | 'REQUIERE_EVALUACION' | 'NO_DISPONIBLE';
export type TarifaResoluble = {
    id: string;
    alcance: string;
    regionNormalizada: string;
    comunaNormalizada: string | null;
    estadoCobertura: string;
    precio: number | null;
    moneda: string | null;
    vigenciaDesde: string;
    vigenciaHasta: string | null;
    condiciones?: string | null;
};
export type ResolucionCobertura = {
    estado: EstadoConsultaComercial;
    origen: 'COMUNA' | 'REGION' | 'NINGUNO';
    tarifa: TarifaResoluble | null;
    mensaje: string;
};
export declare const normalizarUbicacion: (valor: unknown) => string;
/** Canoniza nombres oficiales y abreviados sin perder compatibilidad con tarifas históricas. */
export declare const normalizarRegion: (valor: unknown) => string;
export declare const variantesRegionNormalizada: (valor: unknown) => string[];
export declare const fechaComercial: (valor: unknown, defecto?: Date) => Date;
export declare const estaVigente: (desde: Date, hasta: Date | null, fecha: Date) => boolean;
/** La coincidencia comunal, incluso una exclusión, prevalece sobre el fallback regional. */
export declare function resolverCoberturaDesdeTarifas(tarifas: TarifaResoluble[], region: string, comuna: string | null | undefined): ResolucionCobertura;
//# sourceMappingURL=contratosCatalogoComercial.d.ts.map