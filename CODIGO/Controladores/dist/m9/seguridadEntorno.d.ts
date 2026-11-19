export type EstadoSeguridadEntornoM9 = {
    repositorio: 'CAPA_M9';
    transito: 'CONFIGURACION_INFRAESTRUCTURA' | 'TLS_CONFIGURADO';
    temporalesExportacion: 'NO_APLICA_MEMORIA';
    advertencias: string[];
};
export declare function estadoSeguridadEntornoM9(databaseUrl?: string | undefined, entorno?: string | undefined): EstadoSeguridadEntornoM9;
export declare const EXPORTACION_M9_MODO: "MEMORIA";
//# sourceMappingURL=seguridadEntorno.d.ts.map