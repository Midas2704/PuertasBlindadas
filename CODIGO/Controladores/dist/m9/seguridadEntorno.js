"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EXPORTACION_M9_MODO = void 0;
exports.estadoSeguridadEntornoM9 = estadoSeguridadEntornoM9;
function estadoSeguridadEntornoM9(databaseUrl = process.env.DATABASE_URL, entorno = process.env.NODE_ENV) {
    const advertencias = [];
    let transito = 'CONFIGURACION_INFRAESTRUCTURA';
    if (databaseUrl) {
        try {
            const url = new URL(databaseUrl);
            const ssl = url.searchParams.get('sslmode');
            if (['require', 'verify-ca', 'verify-full'].includes(ssl ?? ''))
                transito = 'TLS_CONFIGURADO';
            else if (entorno === 'production')
                advertencias.push('M9_DATABASE_TLS_NO_VERIFICADO');
        }
        catch {
            advertencias.push('M9_DATABASE_CONFIG_INVALIDA');
        }
    }
    else
        advertencias.push('M9_DATABASE_CONFIG_AUSENTE');
    return { repositorio: 'CAPA_M9', transito, temporalesExportacion: 'NO_APLICA_MEMORIA', advertencias };
}
exports.EXPORTACION_M9_MODO = 'MEMORIA';
//# sourceMappingURL=seguridadEntorno.js.map