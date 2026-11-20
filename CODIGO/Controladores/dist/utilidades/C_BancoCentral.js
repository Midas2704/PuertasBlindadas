"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.C_BancoCentral = void 0;
const ErrorAplicacion_1 = require("./ErrorAplicacion");
const finanzas_1 = require("./finanzas");
/** Adaptador técnico: la integración externa queda fuera de los controladores de negocio y de Prisma. */
// por ahora esto queda así hasta que Banco Central responda bonito
class C_BancoCentral {
    constructor(fetcher = fetch, endpoint = process.env.BANCO_CENTRAL_API_URL) {
        this.fetcher = fetcher;
        this.endpoint = endpoint;
    }
    async obtenerTipoCambio(moneda, fecha = (0, finanzas_1.fechaNegocio)()) {
        if (moneda.toUpperCase() !== 'USD')
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Sólo se consulta tipo de cambio para USD');
        if (!this.endpoint)
            throw new ErrorAplicacion_1.ErrorAplicacion(503, 'C_BancoCentral no está configurado');
        const url = new URL(this.endpoint);
        url.searchParams.set('moneda', moneda.toUpperCase());
        url.searchParams.set('fecha', fecha);
        const respuesta = await this.fetcher(url.toString(), { headers: { accept: 'application/json, text/xml' } });
        if (!respuesta.ok)
            throw new ErrorAplicacion_1.ErrorAplicacion(503, `Banco Central respondió ${respuesta.status}`);
        const cuerpo = await respuesta.text();
        let valor;
        try {
            valor = JSON.parse(cuerpo)?.valor ?? JSON.parse(cuerpo)?.value ?? JSON.parse(cuerpo)?.tipoCambio;
        }
        catch {
            const encontrado = cuerpo.match(/(?:valor|value|tipoCambio)[^0-9]*([0-9]+(?:[.,][0-9]+)?)/i);
            valor = encontrado?.[1];
        }
        // Apolo: si el proveedor manda coma, igual entendemos el número
        const numero = Number(String(valor ?? '').replace(',', '.'));
        if (!Number.isFinite(numero) || numero <= 0)
            throw new ErrorAplicacion_1.ErrorAplicacion(503, 'Banco Central no devolvió un tipo de cambio válido');
        return numero;
    }
}
exports.C_BancoCentral = C_BancoCentral;
//# sourceMappingURL=C_BancoCentral.js.map