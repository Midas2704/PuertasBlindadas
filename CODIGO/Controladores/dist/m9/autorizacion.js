"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scopeM9DesdeActor = scopeM9DesdeActor;
exports.navegacionOwner = navegacionOwner;
const permisos_1 = require("../validaciones/permisos");
const MODULOS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9'];
function scopeM9DesdeActor(actor) {
    const modulos = actor.administrador ? MODULOS : [...new Set(actor.permisos.map(permisos_1.moduloPermiso).filter(modulo => MODULOS.includes(modulo)))];
    const privilegiado = actor.administrador || actor.configuracion === 'gerencia';
    const contador = actor.configuracion === 'contador';
    return {
        solicitante: actor.id.toString(), modulos,
        permitirCambios: privilegiado || contador,
        permitirMotivos: privilegiado || contador,
        permitirPrivacidad: privilegiado,
        camposOcultos: privilegiado ? [] : contador ? ['eventoPrivacidad'] : ['cambios', 'motivo', 'causa', 'ejecutor.referencia'],
    };
}
const DESTINOS = {
    CLIENTE: { permiso: 'CU09', ruta: id => `/clientes/${encodeURIComponent(id)}` },
    PROVEEDOR: { permiso: 'CU84', ruta: id => `/proveedores/${encodeURIComponent(id)}` },
    EMPLEADO: { permiso: 'CU155', ruta: id => `/empleados/${encodeURIComponent(id)}` },
    SOLICITUD_CREDITO: { permiso: 'CU259', ruta: id => `/credito/solicitudes/${encodeURIComponent(id)}` },
    CLIENTE_CREDITO: { permiso: 'CU270', ruta: id => `/credito/solicitudes?cliente=${encodeURIComponent(id)}` },
};
function navegacionOwner(actor, referencia) {
    if (!referencia?.tipo || !referencia.id)
        return null;
    const destino = DESTINOS[referencia.tipo];
    return destino && actor.permisos.includes(destino.permiso) ? { ruta: destino.ruta(referencia.id), permiso: destino.permiso } : null;
}
//# sourceMappingURL=autorizacion.js.map