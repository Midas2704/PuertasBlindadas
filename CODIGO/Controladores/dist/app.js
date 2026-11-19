"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crearAplicacion = crearAplicacion;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const C_Finanzas_1 = require("./controladores/C_Finanzas");
const finanzas_1 = require("./rutas/finanzas");
const ErrorAplicacion_1 = require("./utilidades/ErrorAplicacion");
const ServicioDemostracion_1 = require("./demostracion/ServicioDemostracion");
function crearAplicacion(fachada = new C_Finanzas_1.C_Finanzas()) {
    const aplicacion = (0, express_1.default)();
    aplicacion.disable('x-powered-by');
    aplicacion.set('json replacer', (_clave, valor) => typeof valor === 'bigint' ? valor.toString() : valor);
    aplicacion.use((0, cors_1.default)({ origin: /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ }));
    aplicacion.use(express_1.default.json({ limit: '6mb' }));
    aplicacion.use(ServicioDemostracion_1.contextoDemostracion.middleware());
    // Cookies HttpOnly/SameSite y origen estricto para operaciones de escritura.
    // importante: acá termina la magia y empieza el contrato HTTP
    aplicacion.use((solicitud, respuesta, siguiente) => {
        const origen = solicitud.get('origin');
        const permitidos = (process.env.M4_ORIGENES || 'http://127.0.0.1:5174,http://localhost:5174').split(',');
        if (!['GET', 'HEAD', 'OPTIONS'].includes(solicitud.method) && origen && !permitidos.includes(origen)) {
            respuesta.status(403).json({ error: 'Origen no permitido' });
            return;
        }
        if (!['GET', 'HEAD', 'OPTIONS'].includes(solicitud.method) && solicitud.get('sec-fetch-site') === 'cross-site') {
            respuesta.status(403).json({ error: 'Solicitud externa no permitida' });
            return;
        }
        siguiente();
    });
    aplicacion.use('/api/finanzas', (0, finanzas_1.crearRutasFinanzas)(fachada));
    aplicacion.use('/api/demostracion', (0, ServicioDemostracion_1.crearRutasDemostracion)());
    aplicacion.use((_solicitud, respuesta) => { respuesta.status(404).json({ error: 'Ruta no encontrada' }); });
    const manejarError = (error, _solicitud, respuesta, _siguiente) => {
        if (error instanceof ErrorAplicacion_1.ErrorAplicacion) {
            respuesta.status(error.estado).json({ error: error.message, codigo: error.codigo });
            return;
        }
        if (error?.type === 'entity.parse.failed') {
            respuesta.status(400).json({ error: 'JSON inválido' });
            return;
        }
        if (error?.code === 'P2002') {
            respuesta.status(409).json({ error: 'El registro ya existe', codigo: 'REGISTRO_DUPLICADO' });
            return;
        }
        console.error('Error interno de Finanzas:', error instanceof Error ? error.name : 'Error');
        respuesta.status(500).json({ error: 'No fue posible completar la operación', codigo: 'ERROR_INTERNO' });
    };
    aplicacion.use(manejarError);
    return aplicacion;
}
//# sourceMappingURL=app.js.map