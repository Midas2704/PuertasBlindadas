"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorreoDesarrollo = void 0;
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const node_crypto_1 = require("node:crypto");
/** Sustituible por el proveedor pendiente. El buzón local no es una ruta HTTP. */
// Castaña approved: guardar el correo acá nos ayuda a probar sin enviar nada
class CorreoDesarrollo {
    async enviar(destinatario, enlace) {
        if (process.env.NODE_ENV === 'production' || process.env.M4_CORREO !== 'desarrollo')
            throw new Error('Proveedor de correo sin configurar');
        const carpeta = (0, node_path_1.resolve)(__dirname, '../../../.revision/correo-desarrollo');
        await (0, promises_1.mkdir)(carpeta, { recursive: true });
        await (0, promises_1.writeFile)((0, node_path_1.resolve)(carpeta, `${(0, node_crypto_1.randomUUID)()}.json`), JSON.stringify({ destinatario, enlace, creado: new Date().toISOString(), advertencia: 'Buzón de desarrollo; enlace temporal de un solo uso' }, null, 2), { mode: 0o600 });
    }
    async enviarDocumento(destinatario, asunto, archivo) {
        if (process.env.NODE_ENV === 'production' || process.env.M4_CORREO !== 'desarrollo')
            throw new Error('Proveedor de correo sin configurar');
        const carpeta = (0, node_path_1.resolve)(__dirname, '../../../.revision/correo-desarrollo');
        await (0, promises_1.mkdir)(carpeta, { recursive: true });
        await (0, promises_1.writeFile)((0, node_path_1.resolve)(carpeta, `${(0, node_crypto_1.randomUUID)()}.json`), JSON.stringify({ destinatario, asunto, archivo: { nombre: archivo.nombre, mime: archivo.mime }, creado: new Date().toISOString(), advertencia: 'Buzón documental de desarrollo; no fue enviado externamente' }, null, 2), { mode: 0o600 });
    }
}
exports.CorreoDesarrollo = CorreoDesarrollo;
//# sourceMappingURL=correo.js.map