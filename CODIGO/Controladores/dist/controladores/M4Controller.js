"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.M4Controller = exports.perfilPermitePersonalizacion = exports.requiereSincronizacionMidas = exports.permisosEfectivos = exports.configuracionEfectiva = exports.esAdministradorEfectivo = exports.esAdministradorRaiz = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../db");
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const seguridad_1 = require("../utilidades/seguridad");
const correo_1 = require("../utilidades/correo");
const integracionesExternas_1 = require("../utilidades/integracionesExternas");
const permisos_1 = require("../validaciones/permisos");
const solicitudes_1 = require("../validaciones/solicitudes");
const rut_1 = require("../utilidades/rut");
const catalogoPermisosFuncional_1 = require("../seguridad/catalogoPermisosFuncional");
const incluirAccesos = { perfil: { include: { perfil_permiso: { include: { permiso: true } } } }, particulares: { include: { permiso: true } }, seguridad: true, empleado_seguridad: true };
const error = (estado, mensaje) => { throw new ErrorAplicacion_1.ErrorAplicacion(estado, mensaje); };
const idCuenta = (valor) => { if (!/^\d+$/.test(String(valor)))
    return error(400, 'Usuario inválido'); return BigInt(String(valor)); };
const confirmar = (entrada) => { if (entrada.confirmado !== true)
    error(400, 'Debes confirmar la operación'); };
const esAdministradorRaiz = (cuenta) => cuenta.administrador_original === true;
exports.esAdministradorRaiz = esAdministradorRaiz;
const esAdministradorEfectivo = (cuenta) => (0, exports.esAdministradorRaiz)(cuenta) || cuenta.usuario_es_administrador === true;
exports.esAdministradorEfectivo = esAdministradorEfectivo;
const configuracionEfectiva = (cuenta) => (0, exports.esAdministradorRaiz)(cuenta) ? 'gerencia' : (cuenta.perfil?.codigo_m4 || '');
exports.configuracionEfectiva = configuracionEfectiva;
const permisosEfectivos = (cuenta, catalogoRaiz) => {
    if ((0, exports.esAdministradorRaiz)(cuenta))
        return [...new Set((catalogoRaiz || permisos_1.codigosImplementados).filter(codigo => codigo !== 'CU377'))];
    if (cuenta.usuario_es_administrador && cuenta.perfil?.codigo_m4 === 'gerencia')
        return permisos_1.codigosAdministrador;
    const permisos = cuenta.configuracion_particular ? cuenta.particulares.map(v => v.permiso) : (cuenta.perfil?.perfil_permiso.filter(v => v.perfil_permiso_activo).map(v => v.permiso) || []);
    return permisos.filter(p => p.activo_m4 && p.codigo_m4 && p.codigo_m4 !== 'CU377' && (!p.requiere_administrador || cuenta.usuario_es_administrador || cuenta.administrador_original)).map(p => p.codigo_m4);
};
exports.permisosEfectivos = permisosEfectivos;
/** La autorización raíz no depende de materializar asignaciones particulares. */
const requiereSincronizacionMidas = () => false;
exports.requiereSincronizacionMidas = requiereSincronizacionMidas;
const permisosActivosAdministradorRaiz = async (tx) => {
    const catalogo = await tx.permiso.findMany({ where: { activo_m4: true, codigo_m4: { not: null } }, select: { codigo_m4: true } });
    // El catálogo M4 activo es la fuente autorizada. Filtrarlo nuevamente por el mapa
    // técnico de rutas dejaba fuera capacidades aprobadas incorporadas con posterioridad.
    return catalogo.map(item => item.codigo_m4).filter((codigo) => !!codigo && codigo !== 'CU377');
};
/** El perfil propone permisos iniciales; no constituye un límite para personalizaciones autorizadas. */
const perfilPermitePersonalizacion = (perfil) => perfil?.activo_m4 === true;
exports.perfilPermitePersonalizacion = perfilPermitePersonalizacion;
/** Único controlador funcional M4 (CU59–CU74). Ningún otro módulo lo invoca. */
// En seguridad vamos despacio; Midas tiene la última palabra acá.
class M4Controller {
    constructor(correo = new correo_1.CorreoAplicacion()) {
        this.correo = correo;
        this.integraciones = new integracionesExternas_1.ServicioIntegracionesExternas();
    }
    async transaccion(accion) {
        for (let intento = 0;; intento++) {
            try {
                return await db_1.prisma.$transaction(accion, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable, timeout: 30000 });
            }
            catch (e) {
                if (e.code === 'P2034' && intento < 2)
                    continue;
                throw e;
            }
        }
    }
    async cuenta(tx, id) {
        const cuenta = await tx.usuario.findUnique({ where: { usuario_id_usuario: id }, include: incluirAccesos });
        if (!cuenta)
            return error(404, 'Usuario no encontrado');
        return cuenta;
    }
    async invalidar(tx, id, motivo) {
        await tx.sesion_usuario.updateMany({ where: { id_usuario: id, invalidada: null }, data: { invalidada: new Date(), motivo } });
        await tx.usuario.update({ where: { usuario_id_usuario: id }, data: { version_seguridad: { increment: 1 }, usuario_fecha_de_ultima_edicion: new Date() } });
    }
    async credencial(tx, id) {
        const credencial = await tx.usuario_contrasena.findFirst({ where: { usuario_id_usuario: id, activa: true }, orderBy: { creada: 'desc' } });
        if (!credencial)
            return error(401, 'Credencial no disponible');
        return credencial;
    }
    async nuevaClave(tx, id, clave, temporal = false) {
        (0, seguridad_1.validarClave)(clave);
        const historial = await tx.usuario_contrasena.findMany({ where: { usuario_id_usuario: id }, orderBy: { creada: 'desc' }, take: seguridad_1.politica.historial });
        for (const anterior of historial)
            if (await (0, seguridad_1.comprobarClave)(clave, anterior.usuario_contrasena))
                error(400, 'La contraseña ya fue utilizada recientemente');
        const hash = await (0, seguridad_1.hashClave)(clave);
        await tx.usuario_contrasena.updateMany({ where: { usuario_id_usuario: id, activa: true }, data: { activa: false, invalidada: new Date() } });
        await tx.usuario_contrasena.create({ data: { usuario_id_usuario: id, usuario_contrasena: hash, activa: true, temporal, vence: (0, seguridad_1.futuro)(temporal ? seguridad_1.politica.temporalMinutos : seguridad_1.politica.vigenciaDias * 1440) } });
        await tx.token_recuperacion.updateMany({ where: { id_usuario: id, utilizado: null }, data: { utilizado: new Date() } });
        await this.invalidar(tx, id, 'Cambio de credencial');
    }
    async reiniciarSeguridad(tx, id, responsable) {
        await tx.estado_seguridad_usuario.upsert({ where: { id_usuario: id }, create: { id_usuario: id, responsable }, update: { intentos: 0, bloqueos: 0, bloqueo_hasta: null, bloqueo_persistente: false, actualizado: new Date(), responsable } });
    }
    presentar(cuenta, permisosRaiz) {
        const raiz = (0, exports.esAdministradorRaiz)(cuenta);
        return { id: cuenta.usuario_id_usuario.toString(), acceso: cuenta.acceso_m4 || 'Pendiente de habilitación M4', nombre: cuenta.empleado_seguridad ? `${cuenta.empleado_seguridad.nombres} ${cuenta.empleado_seguridad.apellido_paterno}` : (cuenta.usuario_nombre_completo_primer_nombre_usuario || cuenta.usuario_username || `Cuenta heredada ${cuenta.usuario_id_usuario}`),
            correo: cuenta.usuario_correo, estado: cuenta.usuario_estado_cuenta, configuracion: (0, exports.configuracionEfectiva)(cuenta), configuracionParticular: raiz ? false : cuenta.configuracion_particular,
            administrador: (0, exports.esAdministradorEfectivo)(cuenta), original: raiz, bloqueada: !!cuenta.seguridad?.bloqueo_persistente, bloqueoHasta: cuenta.seguridad?.bloqueo_hasta,
            permisos: (0, exports.permisosEfectivos)(cuenta, permisosRaiz), permisosParticulares: cuenta.particulares.map(p => p.permiso.codigo_m4).filter((codigo) => !!codigo),
            permisosPerfil: cuenta.perfil?.perfil_permiso.filter(v => v.perfil_permiso_activo && v.permiso.activo_m4 && v.permiso.codigo_m4).map(v => v.permiso.codigo_m4) || [], rutEmpleado: cuenta.empleado_m4 };
    }
    async autorizar(operacion, contexto, adicionales = []) {
        if (!contexto.secretoSesion)
            return error(401, 'Inicia sesión para continuar');
        let sesion = await db_1.prisma.sesion_usuario.findUnique({ where: { secreto_hash: (0, seguridad_1.huella)(contexto.secretoSesion) }, include: { usuario: { include: incluirAccesos } } });
        const ahora = new Date();
        const finAbsoluto = sesion ? new Date(sesion.inicio.getTime() + seguridad_1.politica.sesionMinutos * 60000) : ahora;
        if (!sesion || sesion.invalidada || sesion.vence <= ahora || finAbsoluto <= ahora || sesion.version_seguridad !== sesion.usuario.version_seguridad || sesion.usuario.usuario_estado_cuenta !== 'activo')
            return error(401, 'La sesión finalizó; vuelve a iniciar sesión');
        const cuenta = sesion.usuario;
        if (cuenta.seguridad?.bloqueo_persistente || (cuenta.seguridad?.bloqueo_hasta && cuenta.seguridad.bloqueo_hasta > new Date()))
            return error(401, 'Cuenta bloqueada');
        const credencial = await this.credencial(db_1.prisma, cuenta.usuario_id_usuario);
        const cambiarClave = credencial.temporal || !!(credencial.vence && credencial.vence <= new Date());
        const personales = ['miSesion', 'cambiarClave', 'cerrarSesion'];
        if (cambiarClave && !personales.includes(operacion))
            return error(403, 'Debes cambiar tu contraseña antes de continuar');
        const raiz = (0, exports.esAdministradorRaiz)(cuenta);
        const permisos = raiz ? await permisosActivosAdministradorRaiz(db_1.prisma) : (0, exports.permisosEfectivos)(cuenta);
        const numeroCU = Number(permisos_1.operacionesPermiso[operacion]?.slice(2));
        if (numeroCU >= 59 && numeroCU <= 74 && cuenta.perfil?.codigo_m4 !== 'gerencia' && !raiz)
            return error(403, 'La operación requiere configuración de Gerencia');
        if (permisos_1.operacionesQueRequierenAdministrador.has(operacion) && !cuenta.usuario_es_administrador && !raiz)
            return error(403, 'La operación requiere rol Administrador');
        if (!personales.includes(operacion) && !(0, permisos_1.permiteOperacion)(operacion, permisos))
            return error(403, 'No tienes permiso para esta operación');
        if (adicionales.some(p => !permisos.includes(p)))
            return error(403, 'No tienes permiso para los filtros o condiciones solicitados');
        const vencePorInactividad = new Date(Math.min(finAbsoluto.getTime(), ahora.getTime() + seguridad_1.politica.inactividadMinutos * 60000));
        await db_1.prisma.sesion_usuario.update({ where: { id: sesion.id }, data: { vence: vencePorInactividad } });
        const configuracion = (0, exports.configuracionEfectiva)(cuenta);
        const perfilInterno = ['gerencia', 'contador', 'secretaria'].includes(configuracion);
        return { id: cuenta.usuario_id_usuario, sesion: sesion.id, permisos, configuracion, administrador: (0, exports.esAdministradorEfectivo)(cuenta), administradorOriginal: raiz, cambiarClave, nombre: this.presentar(cuenta, permisos).nombre || '', acceso: cuenta.acceso_m4 || '', alcanceEmpleadoId: perfilInterno || raiz ? undefined : (cuenta.empleado_seguridad?.id_empleado ?? null) };
    }
    async iniciarSesion(entrada, contexto) {
        const acceso = (0, solicitudes_1.texto)(entrada.acceso, 100).replace(/\./g, '').toLowerCase();
        const resultado = await this.transaccion(async (tx) => {
            const cuenta = await tx.usuario.findUnique({ where: { acceso_m4: acceso }, include: incluirAccesos });
            const credencial = cuenta ? await tx.usuario_contrasena.findFirst({ where: { usuario_id_usuario: cuenta.usuario_id_usuario, activa: true }, orderBy: { creada: 'desc' } }) : null;
            const valido = credencial && await (0, seguridad_1.comprobarClave)(entrada.clave, credencial.usuario_contrasena);
            if (!valido) {
                if (cuenta) {
                    const anterior = cuenta.seguridad;
                    const intentos = (anterior?.intentos || 0) + 1;
                    const umbral = intentos >= seguridad_1.politica.intentos;
                    const bloqueos = (anterior?.bloqueos || 0) + (umbral ? 1 : 0);
                    const datos = { intentos: umbral ? 0 : intentos, bloqueos, bloqueo_persistente: !!anterior?.bloqueo_persistente || bloqueos >= seguridad_1.politica.bloqueos, bloqueo_hasta: umbral ? (0, seguridad_1.futuro)(seguridad_1.politica.bloqueoMinutos) : anterior?.bloqueo_hasta, actualizado: new Date() };
                    await tx.estado_seguridad_usuario.upsert({ where: { id_usuario: cuenta.usuario_id_usuario }, create: { id_usuario: cuenta.usuario_id_usuario, ...datos }, update: datos });
                }
                return { fallo: 401, mensaje: 'Credenciales incorrectas' };
            }
            if (cuenta.usuario_estado_cuenta !== 'activo')
                return { fallo: 403, mensaje: 'Cuenta inactiva' };
            if (cuenta.seguridad?.bloqueo_persistente || (cuenta.seguridad?.bloqueo_hasta && cuenta.seguridad.bloqueo_hasta > new Date()))
                return { fallo: 403, mensaje: 'Cuenta bloqueada' };
            if (credencial.temporal && credencial.vence && credencial.vence <= new Date())
                return { fallo: 403, mensaje: 'Credencial temporal vencida; solicita restablecimiento' };
            const cuentaSesion = cuenta;
            await tx.sesion_usuario.updateMany({ where: { id_usuario: cuentaSesion.usuario_id_usuario, invalidada: null, vence: { lte: new Date() } }, data: { invalidada: new Date(), motivo: 'Vencimiento' } });
            const anterior = await tx.sesion_usuario.findFirst({ where: { id_usuario: cuentaSesion.usuario_id_usuario, invalidada: null, vence: { gt: new Date() } }, orderBy: { inicio: 'desc' } });
            if (anterior && entrada.reemplazarSesion !== true)
                return { fallo: 409, mensaje: 'Ya existe una sesión activa. Confirma si quieres cerrarla e iniciar una nueva.', codigo: 'SESION_ACTIVA_REQUIERE_CONFIRMACION' };
            if (anterior)
                await tx.sesion_usuario.updateMany({ where: { id_usuario: cuentaSesion.usuario_id_usuario, invalidada: null }, data: { invalidada: new Date(), motivo: 'Reemplazo confirmado por el usuario' } });
            const token = (0, seguridad_1.secreto)();
            await tx.sesion_usuario.create({ data: { id_usuario: cuentaSesion.usuario_id_usuario, secreto_hash: (0, seguridad_1.huella)(token), vence: (0, seguridad_1.futuro)(Math.min(seguridad_1.politica.sesionMinutos, seguridad_1.politica.inactividadMinutos)), version_seguridad: cuentaSesion.version_seguridad, direccion: contexto.direccion, agente: contexto.agente?.slice(0, 300) } });
            await tx.usuario.update({ where: { usuario_id_usuario: cuentaSesion.usuario_id_usuario }, data: { usuario_fecha_ultima_conexion: new Date() } });
            await tx.estado_seguridad_usuario.updateMany({ where: { id_usuario: cuentaSesion.usuario_id_usuario }, data: { intentos: 0, bloqueos: 0 } });
            const permisosRaiz = (0, exports.esAdministradorRaiz)(cuentaSesion) ? await permisosActivosAdministradorRaiz(tx) : undefined;
            return { token, usuario: { ...this.presentar(cuentaSesion, permisosRaiz), administradorOriginal: (0, exports.esAdministradorRaiz)(cuentaSesion), cambiarClave: credencial.temporal || !!(credencial.vence && credencial.vence <= new Date()) } };
        });
        if (resultado.fallo)
            throw new ErrorAplicacion_1.ErrorAplicacion(resultado.fallo, resultado.mensaje, 'codigo' in resultado ? resultado.codigo : undefined);
        return resultado;
    }
    async cambiarClave(actor, entrada) {
        return this.transaccion(async (tx) => {
            const actual = await this.credencial(tx, actor.id);
            if (!await (0, seguridad_1.comprobarClave)(entrada.claveActual, actual.usuario_contrasena))
                error(400, 'Contraseña actual incorrecta');
            (0, seguridad_1.validarClave)(entrada.claveNueva);
            await this.nuevaClave(tx, actor.id, entrada.claveNueva);
            await this.reiniciarSeguridad(tx, actor.id, actor.id.toString());
            return { mensaje: 'Contraseña actualizada. Inicia sesión nuevamente.' };
        });
    }
    async cerrarSesion(actor) { await db_1.prisma.sesion_usuario.updateMany({ where: { id: actor.sesion, id_usuario: actor.id, invalidada: null }, data: { invalidada: new Date(), motivo: 'Cierre propio' } }); return { mensaje: 'Sesión cerrada' }; }
    async usuarios() {
        const [cuentas, permisosRaiz] = await Promise.all([db_1.prisma.usuario.findMany({ include: incluirAccesos, orderBy: { acceso_m4: 'asc' } }), permisosActivosAdministradorRaiz(db_1.prisma)]);
        return cuentas.map(c => this.presentar(c, (0, exports.esAdministradorRaiz)(c) ? permisosRaiz : undefined));
    }
    async catalogosUsuarios() {
        const [empleados, configuraciones, permisos, dependencias] = await Promise.all([
            db_1.prisma.empleado.findMany({ where: { estado_laboral: 'activo', cuenta_m4: null, usuario: { none: {} } }, select: { rut_empleado: true, nombres: true, apellido_paterno: true } }),
            db_1.prisma.perfil.findMany({ where: { activo_m4: true }, select: { codigo_m4: true, perfil_nombre_perfil: true, admite_particulares: true } }),
            db_1.prisma.permiso.findMany({ where: { activo_m4: true, codigo_m4: { not: null, notIn: ['CU377'] } }, select: { codigo_m4: true, permiso_descripcion: true, requiere_administrador: true, activo_m4: true }, orderBy: { codigo_m4: 'asc' } }),
            db_1.prisma.permiso_dependencia.findMany({ include: { permiso: { select: { codigo_m4: true } }, requerido: { select: { codigo_m4: true } } } })
        ]);
        return { empleados, configuraciones, permisos: permisos.map(p => (0, catalogoPermisosFuncional_1.clasificarPermisoM4)({ codigo: p.codigo_m4, descripcion: p.permiso_descripcion, activo: p.activo_m4, requiereAdministrador: p.requiere_administrador })), dependencias: dependencias.filter(d => d.permiso.codigo_m4 !== 'CU377' && d.requerido.codigo_m4 !== 'CU377').map(d => ({ permiso: d.permiso.codigo_m4, requiere: d.requerido.codigo_m4 })) };
    }
    async validarPermisos(tx, codigos, administrador = false) {
        if (codigos.includes('CU377'))
            error(400, 'CU377 no está aprobado para asignación');
        const seleccion = await tx.permiso.findMany({ where: { codigo_m4: { in: codigos }, activo_m4: true }, include: { dependencias: { include: { requerido: true } } } });
        if (seleccion.length !== new Set(codigos).size || seleccion.some(p => { const numero = Number(p.codigo_m4?.slice(2)); return (p.requiere_administrador || numero >= 59 && numero <= 74) && !administrador; }))
            error(400, 'Permiso no asignable');
        if (seleccion.some(p => p.dependencias.some(d => !codigos.includes(d.requerido.codigo_m4))))
            error(409, 'No se puede mantener un permiso sin sus dependencias');
        return seleccion;
    }
    async registrarUsuario(actor, entrada) {
        confirmar(entrada);
        return this.transaccion(async (tx) => {
            const rut = (0, rut_1.validarYNormalizarRut)((0, solicitudes_1.texto)(entrada.rutEmpleado, 15));
            if (!rut)
                return error(400, 'El RUT del empleado es obligatorio');
            const empleado = await tx.empleado.findFirst({ where: { rut_empleado: { in: (0, rut_1.variantesRut)(rut) } }, include: { usuario: true, cuenta_m4: true } });
            if (!empleado || empleado.estado_laboral !== 'activo')
                return error(400, 'Sólo puede crearse una cuenta para un Empleado activo');
            if (empleado.cuenta_m4 || empleado.usuario.length)
                return error(409, 'El Empleado ya tiene un Usuario asociado');
            const perfil = await tx.perfil.findUnique({ where: { codigo_m4: (0, solicitudes_1.texto)(entrada.configuracion) } });
            if (!perfil?.activo_m4)
                return error(400, 'Configuración no válida');
            const correo = (0, solicitudes_1.texto)(entrada.correo, 254);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo))
                return error(400, 'Correo inválido');
            const cuenta = await tx.usuario.create({ data: { acceso_m4: rut.replace(/\./g, '').toLowerCase(), empleado_m4: empleado.rut_empleado, empleado_rut_empleado: empleado.rut_empleado, usuario_correo: correo, usuario_username: rut, usuario_estado_cuenta: 'activo', perfil_id_perfil: perfil.perfil_id_perfil, usuario_fecha_de_creacion: new Date(), usuario_es_administrador: false } });
            if (entrada.permisos !== undefined) {
                if (!(0, exports.perfilPermitePersonalizacion)(perfil) || !Array.isArray(entrada.permisos) || !entrada.permisos.length)
                    return error(400, 'Configuración particular no válida');
                const permisos = await this.validarPermisos(tx, entrada.permisos.map(p => (0, solicitudes_1.texto)(p)));
                await tx.usuario.update({ where: { usuario_id_usuario: cuenta.usuario_id_usuario }, data: { configuracion_particular: true } });
                await tx.usuario_permiso_particular.createMany({ data: permisos.map(p => ({ id_usuario: cuenta.usuario_id_usuario, id_permiso: p.permiso_id_permiso })) });
            }
            const temporal = (0, seguridad_1.secreto)();
            await this.nuevaClave(tx, cuenta.usuario_id_usuario, temporal, true);
            await this.reiniciarSeguridad(tx, cuenta.usuario_id_usuario, actor.id.toString());
            return { mensaje: 'Usuario registrado', id: cuenta.usuario_id_usuario.toString(), claveTemporal: temporal };
        });
    }
    async continuidad(tx, cuenta) {
        if (cuenta.administrador_original)
            return error(409, 'La cuenta administrativa original está protegida');
        if (!cuenta.usuario_es_administrador || cuenta.usuario_estado_cuenta !== 'activo')
            return;
        const otras = await tx.usuario.findMany({ where: { usuario_id_usuario: { not: cuenta.usuario_id_usuario }, usuario_estado_cuenta: 'activo', usuario_es_administrador: true, perfil: { codigo_m4: 'gerencia' }, seguridad: { is: { bloqueo_persistente: false } } }, include: incluirAccesos });
        if (!otras.some(c => ['CU65', 'CU66', 'CU74'].every(p => (0, exports.permisosEfectivos)(c).includes(p)) && (!c.seguridad?.bloqueo_hasta || c.seguridad.bloqueo_hasta <= new Date())))
            error(409, 'Continuidad administrativa insuficiente: debe quedar otra cuenta Activa habilitada');
    }
    async modificarUsuario(operacion, actor, entrada) {
        const id = idCuenta(entrada.id);
        confirmar(entrada);
        return this.transaccion(async (tx) => {
            const cuenta = await this.cuenta(tx, id);
            if (cuenta.administrador_original)
                error(409, 'La cuenta raíz Midas no puede modificarse');
            let temporal;
            if (operacion === 'desactivarUsuario') {
                if (cuenta.usuario_estado_cuenta !== 'activo')
                    error(409, 'La cuenta no está Activa');
                await this.continuidad(tx, cuenta);
                await tx.usuario.update({ where: { usuario_id_usuario: id }, data: { usuario_estado_cuenta: 'inactivo' } });
            }
            else if (operacion === 'reactivarUsuario') {
                if (cuenta.usuario_estado_cuenta !== 'inactivo' || cuenta.empleado_seguridad?.estado_laboral !== 'activo')
                    error(409, 'La reactivación requiere cuenta Inactiva y Empleado activo');
                if (!(0, exports.permisosEfectivos)(cuenta).length)
                    error(409, 'Regulariza los permisos antes de reactivar');
                if (cuenta.configuracion_particular)
                    await this.validarPermisos(tx, (0, exports.permisosEfectivos)(cuenta));
                else if (!cuenta.perfil?.activo_m4)
                    error(409, 'Configuración base no habilitada');
                await tx.usuario.update({ where: { usuario_id_usuario: id }, data: { usuario_estado_cuenta: 'activo' } });
                temporal = (0, seguridad_1.secreto)();
            }
            else if (operacion === 'cambiarConfiguracion') {
                const perfil = await tx.perfil.findUnique({ where: { codigo_m4: (0, solicitudes_1.texto)(entrada.configuracion) } });
                if (!perfil?.activo_m4)
                    return error(400, 'Configuración no válida');
                if (cuenta.usuario_es_administrador && perfil.codigo_m4 !== 'gerencia')
                    error(409, 'Retira primero el rol Administrador, respetando continuidad');
                await tx.usuario_permiso_particular.deleteMany({ where: { id_usuario: id } });
                await tx.usuario.update({ where: { usuario_id_usuario: id }, data: { perfil_id_perfil: perfil.perfil_id_perfil, configuracion_particular: false } });
            }
            else if (operacion === 'guardarPermisosUsuario') {
                const modo = (0, solicitudes_1.texto)(entrada.modo, 20);
                if (modo === 'perfil') {
                    if (!actor.permisos.includes('CU62'))
                        error(403, 'Cambiar a permisos del perfil requiere autorización para cambiar configuración');
                    if (!cuenta.configuracion_particular)
                        return { mensaje: 'La cuenta ya utiliza los permisos de su perfil' };
                    await tx.usuario_permiso_particular.deleteMany({ where: { id_usuario: id } });
                    await tx.usuario.update({ where: { usuario_id_usuario: id }, data: { configuracion_particular: false } });
                }
                else if (modo === 'particular') {
                    if (!(0, exports.perfilPermitePersonalizacion)(cuenta.perfil))
                        error(409, 'La configuración base no está activa');
                    if (!Array.isArray(entrada.permisos))
                        error(400, 'La selección de permisos no es válida');
                    const finales = [...new Set(entrada.permisos.map(p => (0, solicitudes_1.texto)(p)))];
                    if (!finales.length && cuenta.usuario_estado_cuenta === 'activo')
                        error(409, 'Una cuenta Activa particular debe conservar permisos efectivos');
                    const actuales = (0, exports.permisosEfectivos)(cuenta);
                    const agregados = finales.filter(p => !actuales.includes(p));
                    const retirados = actuales.filter(p => !finales.includes(p));
                    if ((agregados.length || !cuenta.configuracion_particular) && !actor.permisos.includes('CU63'))
                        error(403, 'Asignar permisos requiere autorización administrativa');
                    if (retirados.length && !actor.permisos.includes('CU64'))
                        error(403, 'Retirar permisos requiere autorización administrativa');
                    if (cuenta.configuracion_particular && !agregados.length && !retirados.length)
                        return { mensaje: 'Los permisos particulares ya estaban actualizados' };
                    const permisos = await this.validarPermisos(tx, finales, cuenta.usuario_es_administrador || cuenta.administrador_original);
                    await tx.usuario_permiso_particular.deleteMany({ where: { id_usuario: id } });
                    if (permisos.length)
                        await tx.usuario_permiso_particular.createMany({ data: permisos.map(p => ({ id_usuario: id, id_permiso: p.permiso_id_permiso })) });
                    await tx.usuario.update({ where: { usuario_id_usuario: id }, data: { configuracion_particular: true } });
                }
                else
                    error(400, 'Modo de permisos no válido');
            }
            else if (['asignarPermisos', 'retirarPermisos'].includes(operacion)) {
                if (!(0, exports.perfilPermitePersonalizacion)(cuenta.perfil))
                    error(409, 'La configuración base no está activa');
                if (!Array.isArray(entrada.permisos) || !entrada.permisos.length)
                    error(400, 'Selecciona permisos');
                const elegidos = entrada.permisos.map(p => (0, solicitudes_1.texto)(p));
                const actuales = (0, exports.permisosEfectivos)(cuenta);
                const finales = operacion === 'asignarPermisos' ? [...new Set([...actuales, ...elegidos])] : actuales.filter(p => !elegidos.includes(p));
                if (!finales.length && cuenta.usuario_estado_cuenta === 'activo')
                    error(409, 'Una cuenta Activa particular debe conservar permisos efectivos');
                const permisos = await this.validarPermisos(tx, finales, cuenta.usuario_es_administrador || cuenta.administrador_original);
                await tx.usuario_permiso_particular.deleteMany({ where: { id_usuario: id } });
                await tx.usuario_permiso_particular.createMany({ data: permisos.map(p => ({ id_usuario: id, id_permiso: p.permiso_id_permiso })) });
                await tx.usuario.update({ where: { usuario_id_usuario: id }, data: { configuracion_particular: true } });
            }
            else if (operacion === 'asignarAdministrador') {
                if (cuenta.usuario_estado_cuenta !== 'activo' || cuenta.perfil?.codigo_m4 !== 'gerencia' || cuenta.usuario_es_administrador || cuenta.seguridad?.bloqueo_persistente)
                    error(409, 'Cuenta no habilitada para Administrador');
                const credencial = await this.credencial(tx, actor.id);
                if (!await (0, seguridad_1.comprobarClave)(entrada.claveActual, credencial.usuario_contrasena))
                    error(403, 'Reautenticación fallida');
                await tx.usuario.update({ where: { usuario_id_usuario: id }, data: { usuario_es_administrador: true } });
            }
            else if (operacion === 'retirarAdministrador') {
                if (!cuenta.usuario_es_administrador)
                    error(409, 'La cuenta no es Administrador');
                await this.continuidad(tx, cuenta);
                await tx.usuario.update({ where: { usuario_id_usuario: id }, data: { usuario_es_administrador: false } });
            }
            else if (['restablecerClave', 'desbloquearUsuario'].includes(operacion)) {
                if (cuenta.usuario_estado_cuenta !== 'activo' || cuenta.empleado_seguridad?.estado_laboral !== 'activo')
                    error(409, 'Cuenta no habilitada para el procedimiento');
                if (operacion === 'desbloquearUsuario' && !cuenta.seguridad?.bloqueo_persistente)
                    error(409, 'La cuenta no tiene bloqueo persistente');
                if (operacion === 'restablecerClave' && cuenta.seguridad?.bloqueo_persistente)
                    error(409, 'Utiliza el desbloqueo administrativo');
                temporal = (0, seguridad_1.secreto)();
            }
            else
                return error(400, 'Operación M4 desconocida');
            if (temporal) {
                await this.nuevaClave(tx, id, temporal, true);
                await this.reiniciarSeguridad(tx, id, actor.id.toString());
            }
            else
                await this.invalidar(tx, id, operacion);
            return { mensaje: 'Operación realizada; la sesión anterior de la cuenta quedó invalidada', ...(temporal ? { claveTemporal: temporal } : {}) };
        });
    }
    async solicitarRecuperacion(entrada) {
        const acceso = typeof entrada.acceso === 'string' ? entrada.acceso.replace(/\./g, '').toLowerCase().slice(0, 100) : '';
        let envio;
        await this.transaccion(async (tx) => {
            const cuenta = await tx.usuario.findUnique({ where: { acceso_m4: acceso }, include: { seguridad: true } });
            if (!cuenta || cuenta.usuario_estado_cuenta !== 'activo' || !cuenta.usuario_correo || (cuenta.seguridad?.bloqueo_persistente && !cuenta.administrador_original))
                return;
            await tx.token_recuperacion.updateMany({ where: { id_usuario: cuenta.usuario_id_usuario, utilizado: null }, data: { utilizado: new Date() } });
            const token = (0, seguridad_1.secreto)();
            await tx.token_recuperacion.create({ data: { id_usuario: cuenta.usuario_id_usuario, secreto_hash: (0, seguridad_1.huella)(token), vence: (0, seguridad_1.futuro)(seguridad_1.politica.recuperacionMinutos) } });
            envio = { correo: cuenta.usuario_correo, token };
        });
        if (envio)
            try {
                await this.correo.enviar(envio.correo, `${process.env.M4_URL_VISTA || 'http://127.0.0.1:5174'}/recuperar#${envio.token}`);
            }
            catch {
                console.error('M4: entrega de recuperación pendiente de proveedor/configuración');
            }
        return { mensaje: 'Si la cuenta está habilitada, recibirás las instrucciones en su correo asociado.' };
    }
    async consultarIntegraciones() { return this.integraciones.consultar(); }
    async guardarBancoCentral(actor, entrada) { return this.integraciones.guardarBancoCentral(entrada, actor.id); }
    async guardarCorreoRecuperacion(actor, entrada) { return this.integraciones.guardarCorreo(entrada, actor.id); }
    async probarBancoCentral() { const { C_BancoCentral } = await Promise.resolve().then(() => __importStar(require('../utilidades/C_BancoCentral'))); const valor = await new C_BancoCentral().obtenerTipoCambio('USD'); return { mensaje: 'Conexión con Banco Central verificada', valor }; }
    async probarCorreoRecuperacion() { return this.integraciones.probarCorreo(); }
    async validarRecuperacion(entrada) {
        const recuperacion = await db_1.prisma.token_recuperacion.findUnique({ where: { secreto_hash: (0, seguridad_1.huella)((0, solicitudes_1.texto)(entrada.token, 200)) }, include: { usuario: { include: { seguridad: true } } } });
        if (!recuperacion || recuperacion.utilizado || recuperacion.vence <= new Date() || recuperacion.usuario.usuario_estado_cuenta !== 'activo' || (recuperacion.usuario.seguridad?.bloqueo_persistente && !recuperacion.usuario.administrador_original))
            return error(400, 'Enlace de recuperación no válido');
        return { valido: true };
    }
    async recuperarClave(entrada) {
        const token = (0, solicitudes_1.texto)(entrada.token, 200);
        (0, seguridad_1.validarClave)(entrada.claveNueva);
        return this.transaccion(async (tx) => {
            const recuperacion = await tx.token_recuperacion.findUnique({ where: { secreto_hash: (0, seguridad_1.huella)(token) }, include: { usuario: { include: { seguridad: true } } } });
            if (!recuperacion || recuperacion.utilizado || recuperacion.vence <= new Date() || recuperacion.usuario.usuario_estado_cuenta !== 'activo' || (recuperacion.usuario.seguridad?.bloqueo_persistente && !recuperacion.usuario.administrador_original))
                return error(400, 'Enlace de recuperación no válido');
            await this.nuevaClave(tx, recuperacion.id_usuario, entrada.claveNueva);
            await this.reiniciarSeguridad(tx, recuperacion.id_usuario, 'Recuperación autónoma');
            return { mensaje: 'Contraseña recuperada. Inicia sesión nuevamente.' };
        });
    }
    async consultarSesiones(actor) {
        const cuentas = await db_1.prisma.usuario.findMany({ where: { acceso_m4: { not: null } }, select: { usuario_id_usuario: true, acceso_m4: true, sesiones: { where: { invalidada: null, vence: { gt: new Date() } }, select: { id: true, inicio: true, vence: true, direccion: true, agente: true }, orderBy: { inicio: 'desc' }, take: 1 } }, orderBy: { acceso_m4: 'asc' } });
        if (actor.administrador)
            return cuentas.map(({ sesiones, ...usuario }) => { const sesion = sesiones[0]; return { activa: !!sesion, usuario, ...(sesion || {}) }; });
        return cuentas.map(({ sesiones, ...usuario }) => ({ activa: sesiones.length > 0, usuario }));
    }
    async cerrarSesionAdministrativa(actor, entrada) {
        if (!actor.administrador)
            error(403, 'La operación requiere rol Administrador');
        confirmar(entrada);
        const id = (0, solicitudes_1.texto)(entrada.id, 100);
        const sesion = await db_1.prisma.sesion_usuario.findUnique({ where: { id }, include: { usuario: { select: { administrador_original: true } } } });
        if (!sesion)
            return error(409, 'La sesión seleccionada ya no está activa');
        if (sesion.invalidada || sesion.vence <= new Date())
            error(409, 'La sesión seleccionada ya no está activa');
        if (sesion.usuario.administrador_original)
            error(409, 'La sesión del administrador original está protegida');
        await db_1.prisma.sesion_usuario.update({ where: { id }, data: { invalidada: new Date(), motivo: `Cierre administrativo por ${actor.id}` } });
        return { mensaje: 'Sesión invalidada; se exige un nuevo inicio de sesión' };
    }
}
exports.M4Controller = M4Controller;
