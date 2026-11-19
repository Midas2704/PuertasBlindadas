"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pruebasDemostracion = exports.contextoDemostracion = void 0;
exports.emitirEtapa = emitirEtapa;
exports.medirEtapa = medirEtapa;
exports.crearRutasDemostracion = crearRutasDemostracion;
const node_async_hooks_1 = require("node:async_hooks");
const node_crypto_1 = require("node:crypto");
const express_1 = require("express");
const permisos_1 = require("../validaciones/permisos");
const habilitado = () => process.env.MODO_DEMOSTRACION === 'true' && process.env.NODE_ENV !== 'production';
const contextos = new node_async_hooks_1.AsyncLocalStorage();
const eventos = [];
const clientes = new Set();
const MAXIMO_EVENTOS = 1200;
let secuencia = 0;
const catalogoCodigo = {
    guardarCotizacion: {
        VISTA_REACT: 'await guardarCotizacion(datos);', CONTROLADOR: 'M2Controller.guardarCotizacion();',
        REGLAS_NEGOCIO: 'validar productos, precios y condiciones comerciales', PRISMA: 'prisma.cotizacion.create(...)',
    },
    previsualizarCotizacionPdf: {
        VISTA_REACT: 'await solicitarVistaPrevia(cotizacion);', CONTROLADOR: 'M2Controller.previsualizarCotizacionPdf();',
        REGLAS_NEGOCIO: 'MotorPdfComercial genera una vista segura', PRISMA: 'prisma.cotizacion.findUnique(...)',
    },
    registrarPago: {
        VISTA_REACT: 'await registrarPago(datos);', CONTROLADOR: 'M3Controller.registrarPago();',
        REGLAS_NEGOCIO: 'validar saldo y clasificar el pago', PRISMA: 'prisma.pago.create(...)',
    },
    aprobarCotizacionB2B: {
        VISTA_REACT: 'await aprobarCotizacion(id);', CONTROLADOR: 'M2Controller.aprobarCotizacionB2B();',
        REGLAS_NEGOCIO: 'crear Nota de Venta y una OT por puerta', PRISMA: 'prisma.$transaction(...)',
    },
    consolidarB2C: {
        VISTA_REACT: 'await consolidarCotizacion(id);', CONTROLADOR: 'M2Controller.consolidarB2C();',
        REGLAS_NEGOCIO: 'crear Nota de Venta y unidades físicas', PRISMA: 'prisma.$transaction(...)',
    },
    registrarEntradaInventario: {
        VISTA_REACT: 'await registrarEntrada(datos);', CONTROLADOR: 'MInventarioController.registrarEntrada();',
        REGLAS_NEGOCIO: 'validar bodega, material y cantidad', PRISMA: 'prisma.movimiento_inventario.create(...)',
    },
};
const moduloOperacion = (operacion, permiso) => {
    if (/M10|Presupuesto/.test(operacion))
        return 'M10';
    if (/M11|Documental|DocumentoComercial|CartaComercial|PlantillaDocumental/.test(operacion))
        return 'M11';
    if (/M12|ObraProyecto|ObraCotizacion/.test(operacion))
        return 'M12';
    return permiso ? (0, permisos_1.moduloPermiso)(permiso) : operacion.includes('Inventario') ? 'INVENTARIO' : 'M2';
};
const nombreControlador = (modulo) => modulo === 'INVENTARIO' ? 'MInventarioController' : modulo === 'M10' ? 'M7Controller' : ['M11', 'M12'].includes(modulo) ? 'M2Controller' : `${modulo}Controller`;
const textoSeguro = (valor, maximo = 180) => String(valor ?? '')
    .replace(/(authorization|cookie|token|password|clave|hash|database_url|secret)[^,;\n]*/gi, '$1=[PROTEGIDO]')
    .replace(/\b\d{7,8}-[\dkK]\b/g, '[RUT PROTEGIDO]')
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, '[CORREO PROTEGIDO]')
    .slice(0, maximo);
const publicar = (evento) => {
    eventos.push(evento);
    if (eventos.length > MAXIMO_EVENTOS)
        eventos.splice(0, eventos.length - MAXIMO_EVENTOS);
    const mensaje = `id: ${evento.secuencia}\nevent: traza\ndata: ${JSON.stringify(evento)}\n\n`;
    for (const cliente of clientes)
        cliente.write(mensaje);
};
exports.contextoDemostracion = {
    habilitado,
    actual: () => contextos.getStore(),
    middleware() {
        return (solicitud, _respuesta, siguiente) => {
            if (!habilitado() || !solicitud.path.startsWith('/api/finanzas')) {
                siguiente();
                return;
            }
            const solicitudId = textoSeguro(solicitud.get('x-request-id') || (0, node_crypto_1.randomUUID)(), 80);
            const vista = textoSeguro(solicitud.get('x-demo-view') || 'Vista React', 100);
            contextos.run({
                solicitudId, metodo: solicitud.method, ruta: textoSeguro(solicitud.originalUrl.split('?')[0], 160), vista,
                operacion: 'solicitudHttp', modulo: 'SISTEMA', controlador: 'C_Finanzas', permiso: '', inicio: Date.now(),
            }, siguiente);
        };
    },
    prepararOperacion(operacion) {
        const contexto = contextos.getStore();
        if (!habilitado() || !contexto)
            return;
        const permisos = (0, permisos_1.permisosDeOperacion)(operacion);
        const modulo = moduloOperacion(operacion, permisos[0]);
        contexto.operacion = textoSeguro(operacion, 100);
        contexto.modulo = modulo;
        contexto.controlador = nombreControlador(modulo);
        contexto.permiso = permisos.join(' / ');
    },
};
function emitirEtapa(capa, estado, titulo, opciones = {}) {
    const contexto = contextos.getStore();
    if (!habilitado() || !contexto)
        return;
    const codigo = opciones.codigo ?? catalogoCodigo[contexto.operacion]?.[capa];
    publicar({
        id: (0, node_crypto_1.randomUUID)(), secuencia: ++secuencia, solicitudId: contexto.solicitudId, ocurridoEn: new Date().toISOString(),
        capa, estado, modulo: contexto.modulo, operacion: contexto.operacion, titulo: textoSeguro(titulo, 100),
        detalle: opciones.detalle ? textoSeguro(opciones.detalle) : undefined,
        duracionMs: opciones.duracionMs === undefined ? undefined : Math.max(0, Math.round(opciones.duracionMs * 100) / 100),
        metodo: contexto.metodo, ruta: contexto.ruta, vista: contexto.vista, controlador: contexto.controlador,
        permiso: contexto.permiso || undefined, codigo: codigo ? textoSeguro(codigo, 180) : undefined,
        resultado: opciones.resultado ? textoSeguro(opciones.resultado) : undefined,
        tabla: opciones.tabla ? textoSeguro(opciones.tabla, 100) : undefined,
        accionDatos: opciones.accionDatos ? textoSeguro(opciones.accionDatos, 80) : undefined,
    });
}
async function medirEtapa(capa, titulo, accion, opciones = {}) {
    if (!habilitado() || !contextos.getStore())
        return accion();
    const inicio = performance.now();
    emitirEtapa(capa, 'EN_EJECUCION', titulo, opciones);
    try {
        const resultado = await accion();
        emitirEtapa(capa, 'CORRECTO', titulo, { ...opciones, duracionMs: performance.now() - inicio });
        return resultado;
    }
    catch (error) {
        const estado = typeof error === 'object' && error && 'estado' in error && Number(error.estado) < 500 ? 'RECHAZADO' : 'ERROR';
        emitirEtapa(capa, estado, titulo, { ...opciones, duracionMs: performance.now() - inicio, resultado: error instanceof Error ? error.message : 'Error controlado' });
        throw error;
    }
}
const local = (solicitud) => {
    const host = solicitud.hostname.toLowerCase();
    return ['localhost', '127.0.0.1', 'backend'].includes(host) || /^172\.|^10\.|^192\.168\./.test(solicitud.ip || '');
};
function crearRutasDemostracion() {
    const rutas = (0, express_1.Router)();
    rutas.use((solicitud, respuesta, siguiente) => {
        if (!habilitado() || !local(solicitud)) {
            respuesta.status(404).json({ error: 'Ruta no encontrada' });
            return;
        }
        siguiente();
    });
    rutas.get('/estado', (_solicitud, respuesta) => respuesta.json({ habilitado: true, eventos: eventos.length }));
    rutas.get('/eventos', (solicitud, respuesta) => {
        respuesta.set({
            'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache, no-transform', Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        });
        respuesta.flushHeaders();
        clientes.add(respuesta);
        respuesta.write(`event: conectado\ndata: ${JSON.stringify({ eventos: eventos.slice(-300) })}\n\n`);
        const latido = setInterval(() => respuesta.write(': latido\n\n'), 15000);
        solicitud.on('close', () => { clearInterval(latido); clientes.delete(respuesta); });
    });
    rutas.delete('/eventos', (_solicitud, respuesta) => { eventos.splice(0); respuesta.status(204).end(); });
    return rutas;
}
exports.pruebasDemostracion = {
    limpiar: () => { eventos.splice(0); secuencia = 0; },
    eventos: () => eventos.map(evento => ({ ...evento })),
    ejecutarEnContexto: (entrada, accion) => contextos.run({
        solicitudId: 'prueba', metodo: 'GET', ruta: '/api/finanzas/prueba', vista: '/prueba', operacion: 'salud', modulo: 'SISTEMA',
        controlador: 'C_Finanzas', permiso: '', inicio: Date.now(), ...entrada,
    }, accion),
    textoSeguro,
};
//# sourceMappingURL=ServicioDemostracion.js.map