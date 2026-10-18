import type { DocumentoComercialProducto, CapacidadesDocumentalesProducto } from '../documental/tipos';

export type SegmentoComercial = 'B2B' | 'B2C';
export type PrecioComercial = { resultado:'VIGENTE'|'SIN_PRECIO'; id?:string|null; monto:number|null; moneda:string|null; vigenciaDesde?:string|null; vigenciaHasta?:string|null; version?:number|null };
export type OpcionalProductoComercial = { id:string; idCompatibilidad?:string; codigo:string; nombre:string; descripcion:string|null; condiciones:string|null; precio:{resultado:'VIGENTE'|'SIN_PRECIO';id?:string|null;monto:number|null;moneda:string|null;version?:number|null} };
export type ProductoCatalogoComercial = {
  idProductoComercial:number; idItemComercial:number; codigo:string; nombre:string;
  familia:{id:number;codigo:string;nombre:string}; subfamilia:string|null; tipo:string|null; idProductoComercialVersion?:number; numeroVersion:number;
  descripcion:string|null; caracteristicas:string[]; caracteristicasTecnicas:Record<string,string>;
  garantia:string|null; condicionesParticulares:string|null; estado:string; segmento:SegmentoComercial;
  precio:PrecioComercial; opcionales:OpcionalProductoComercial[];
  documentos:{fotografias:number;fotografiaPrincipalDisponible:boolean;documentosComerciales:number}; costosInternosExpuestos:false;
};
export type FichaProductoCatalogoComercial = ProductoCatalogoComercial & { documental:{ estadoIntegracion:'VACIO'|'LISTO'; documentos:DocumentoComercialProducto[]; fotografias:DocumentoComercialProducto[]; documentosTecnicos:DocumentoComercialProducto[]; fotografiaPrincipal:DocumentoComercialProducto|null; capacidades:CapacidadesDocumentalesProducto } };
