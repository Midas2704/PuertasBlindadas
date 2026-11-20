"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClamAvDaemonAdapter = exports.AntivirusNoDisponible = void 0;
exports.exigirResultadoLimpio = exigirResultadoLimpio;
exports.escanearConIntegridad = escanearConIntegridad;
const node_stream_1 = require("node:stream");
const node_net_1 = require("node:net");
const node_crypto_1 = require("node:crypto");
class AntivirusNoDisponible {
    constructor() {
        this.nombre = 'NO_CONFIGURADO';
    }
    async escanear() {
        return { estado: 'NO_DISPONIBLE', motor: this.nombre, codigo: 'ANTIVIRUS_NO_CONFIGURADO' };
    }
    async comprobarDisponibilidad() {
        return { disponible: false, motor: this.nombre, codigo: 'ANTIVIRUS_NO_CONFIGURADO' };
    }
}
exports.AntivirusNoDisponible = AntivirusNoDisponible;
/** Integración real con clamd mediante INSTREAM. No se conecta hasta invocar escanear. */
class ClamAvDaemonAdapter {
    constructor(configuracion, conectar = node_net_1.createConnection) {
        this.configuracion = configuracion;
        this.conectar = conectar;
        this.nombre = 'CLAMAV_DAEMON';
    }
    async comprobarDisponibilidad() {
        if (!this.configuracion.host || !Number.isInteger(this.configuracion.puerto) || this.configuracion.puerto < 1) {
            return { disponible: false, motor: this.nombre, codigo: 'CONFIGURACION_INVALIDA' };
        }
        let socket;
        try {
            socket = this.conectar(this.configuracion.puerto, this.configuracion.host);
            socket.setTimeout(this.configuracion.timeoutMs);
            const respuesta = await new Promise((resolve, reject) => {
                const fragmentos = [];
                let bytes = 0;
                socket.on('data', dato => {
                    const bloque = Buffer.from(dato);
                    bytes += bloque.length;
                    if (bytes > 128) {
                        socket.destroy();
                        reject(new Error('CLAMAV_RESPUESTA_EXCESIVA'));
                        return;
                    }
                    fragmentos.push(bloque);
                });
                socket.once('end', () => resolve(Buffer.concat(fragmentos).toString('utf8').replace(/\0/g, '').trim()));
                socket.once('error', reject);
                socket.once('timeout', () => reject(new Error('CLAMAV_TIMEOUT')));
                socket.end('zPING\0');
            });
            return respuesta === 'PONG'
                ? { disponible: true, motor: this.nombre }
                : { disponible: false, motor: this.nombre, codigo: 'RESPUESTA_NO_RECONOCIDA' };
        }
        catch (error) {
            socket?.destroy();
            return { disponible: false, motor: this.nombre, codigo: error instanceof Error && error.message === 'CLAMAV_TIMEOUT' ? 'CLAMAV_TIMEOUT' : 'CLAMAV_NO_DISPONIBLE' };
        }
    }
    async escanear(contenido) {
        if (!this.configuracion.host || !Number.isInteger(this.configuracion.puerto) || this.configuracion.puerto < 1) {
            return { estado: 'NO_DISPONIBLE', motor: this.nombre, codigo: 'CONFIGURACION_INVALIDA' };
        }
        let socket;
        try {
            socket = this.conectar(this.configuracion.puerto, this.configuracion.host);
            socket.setTimeout(this.configuracion.timeoutMs);
            const respuesta = new Promise((resolve, reject) => {
                const fragmentos = [];
                let bytesRespuesta = 0;
                socket.on('data', dato => {
                    const bloque = Buffer.from(dato);
                    bytesRespuesta += bloque.length;
                    if (bytesRespuesta > 4096) {
                        socket.destroy();
                        reject(new Error('CLAMAV_RESPUESTA_EXCESIVA'));
                        return;
                    }
                    fragmentos.push(bloque);
                });
                socket.once('end', () => resolve(Buffer.concat(fragmentos).toString('utf8').replace(/\0/g, '').trim()));
                socket.once('error', reject);
                socket.once('timeout', () => reject(new Error('CLAMAV_TIMEOUT')));
            });
            socket.write('zINSTREAM\0');
            let enviados = 0n;
            for await (const fragmento of contenido) {
                const bloque = Buffer.isBuffer(fragmento) ? fragmento : Buffer.from(fragmento);
                enviados += BigInt(bloque.length);
                if (enviados > this.configuracion.maximoBytes) {
                    contenido.destroy();
                    socket.destroy();
                    return { estado: 'ARCHIVO_NO_SOPORTADO', motor: this.nombre, codigo: 'LIMITE_ANTIVIRUS' };
                }
                const longitud = Buffer.allocUnsafe(4);
                longitud.writeUInt32BE(bloque.length);
                if (!socket.write(Buffer.concat([longitud, bloque])))
                    await new Promise(resolve => socket.once('drain', resolve));
            }
            socket.end(Buffer.alloc(4));
            const texto = await respuesta;
            if (/\bOK$/.test(texto))
                return { estado: 'LIMPIO', motor: this.nombre };
            const infectado = texto.match(/: (.+) FOUND$/);
            if (infectado)
                return { estado: 'INFECTADO', motor: this.nombre, firma: infectado[1].replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) };
            const detalle = texto.replace(/[^a-zA-Z0-9._:-]/g, '_').slice(0, 120);
            return { estado: 'ERROR_ESCANEO', motor: this.nombre, codigo: detalle ? `RESPUESTA_NO_RECONOCIDA_${detalle}` : 'RESPUESTA_VACIA' };
        }
        catch (error) {
            socket?.destroy();
            const codigo = error instanceof Error && error.message === 'CLAMAV_TIMEOUT' ? 'CLAMAV_TIMEOUT' : 'CLAMAV_NO_DISPONIBLE';
            return { estado: 'NO_DISPONIBLE', motor: this.nombre, codigo };
        }
    }
}
exports.ClamAvDaemonAdapter = ClamAvDaemonAdapter;
function exigirResultadoLimpio(resultado) {
    if (resultado.estado !== 'LIMPIO')
        throw Object.assign(new Error('El contenido no fue aprobado por el control antivirus'), {
            codigo: `ANTIVIRUS_${resultado.estado}`, resultado,
        });
}
/** Calcula la huella sobre el mismo stream consumido por el motor. */
async function escanearConIntegridad(adapter, contenido) {
    const hash = (0, node_crypto_1.createHash)('sha256');
    let tamanoBytes = 0n;
    let completo = false;
    const medido = node_stream_1.Readable.from((async function* () {
        for await (const fragmento of contenido) {
            const bloque = Buffer.isBuffer(fragmento) ? fragmento : Buffer.from(fragmento);
            hash.update(bloque);
            tamanoBytes += BigInt(bloque.length);
            yield bloque;
        }
        completo = true;
    })());
    let resultado = await adapter.escanear(medido);
    if (resultado.estado === 'LIMPIO' && !completo)
        resultado = { estado: 'ERROR_ESCANEO', motor: adapter.nombre, codigo: 'STREAM_NO_CONSUMIDO' };
    return { resultado, sha256: completo ? hash.digest('hex') : null, tamanoBytes, completo };
}
//# sourceMappingURL=AntivirusAdapter.js.map