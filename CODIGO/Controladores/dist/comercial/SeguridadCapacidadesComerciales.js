"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioEscrituraComercialPreparada = exports.AutorizadorCapacidadComercial = exports.MATRIZ_CAPACIDADES_COMERCIALES = void 0;
exports.validarSolicitudEscrituraComercial = validarSolicitudEscrituraComercial;
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const existente = (operacion, cu, tipoAcceso, alcance) => ({
    operacion, moduloPropietario: 'M2', cuExistente: cu, cuPropuesto: null, tipoAcceso, alcance,
    requiereAuditoria: tipoAcceso !== 'CONSULTA', estadoAutorizacion: 'APROBADO_EXISTENTE',
});
const aprobada = (operacion, cu, tipoAcceso, alcance) => ({
    operacion, moduloPropietario: 'M2', cuExistente: cu, cuPropuesto: null, tipoAcceso, alcance,
    requiereAuditoria: true, estadoAutorizacion: 'APROBADO_C2_6',
});
/** Catálogo aprobado. La presencia aquí no asigna capacidades a perfiles ni usuarios. */
exports.MATRIZ_CAPACIDADES_COMERCIALES = Object.freeze([
    existente('CONSULTAR_PRODUCTOS', 'CU360', 'CONSULTA', 'CATALOGO_COMERCIAL'),
    existente('CREAR_PRODUCTOS', 'CU361', 'ESCRITURA', 'FAMILIA_Y_FICHA_COMERCIAL'),
    existente('EDITAR_PRODUCTOS', 'CU362', 'ESCRITURA', 'BORRADOR_FICHA_COMERCIAL'),
    existente('PUBLICAR_PRODUCTOS', 'CU365', 'PUBLICACION', 'VERSION_INMUTABLE_PRODUCTO'),
    existente('CONSULTAR_VERSIONES', 'CU367', 'CONSULTA', 'HISTORIAL_COMERCIAL'),
    aprobada('CREAR_PRECIO', 'CU368', 'ESCRITURA', 'PRECIO_PRODUCTO'), aprobada('VERSIONAR_PRECIO', 'CU368', 'ESCRITURA', 'PRECIO_PRODUCTO'), aprobada('DESACTIVAR_PRECIO', 'CU368', 'ESCRITURA', 'PRECIO_PRODUCTO'),
    aprobada('CREAR_SERVICIO', 'CU368', 'ESCRITURA', 'SERVICIO_COMERCIAL'), aprobada('VERSIONAR_PRECIO_SERVICIO', 'CU368', 'ESCRITURA', 'PRECIO_SERVICIO_COMERCIAL'), aprobada('DESACTIVAR_SERVICIO', 'CU368', 'ESCRITURA', 'SERVICIO_COMERCIAL'),
    aprobada('CREAR_OPCIONAL', 'CU369', 'ESCRITURA', 'OPCIONAL_COMERCIAL'), aprobada('EDITAR_OPCIONAL', 'CU369', 'ESCRITURA', 'OPCIONAL_COMERCIAL'), aprobada('MODIFICAR_COMPATIBILIDAD', 'CU369', 'ESCRITURA', 'OPCIONAL_PRODUCTO'), aprobada('VERSIONAR_PRECIO_OPCIONAL', 'CU369', 'ESCRITURA', 'PRECIO_OPCIONAL'), aprobada('DESACTIVAR_OPCIONAL', 'CU369', 'ESCRITURA', 'OPCIONAL_COMERCIAL'),
    aprobada('CREAR_TARIFA', 'CU370', 'ESCRITURA', 'TARIFA_INSTALACION_COMERCIAL'), aprobada('VERSIONAR_TARIFA', 'CU370', 'ESCRITURA', 'TARIFA_INSTALACION_COMERCIAL'), aprobada('REGISTRAR_EXCLUSION_COMUNAL', 'CU370', 'ESCRITURA', 'COBERTURA_COMUNA'), aprobada('DESACTIVAR_TARIFA', 'CU370', 'ESCRITURA', 'TARIFA_INSTALACION_COMERCIAL'),
    aprobada('CREAR_CONDICION', 'CU371', 'ESCRITURA', 'CONDICION_COMERCIAL'), aprobada('VERSIONAR_CONDICION', 'CU371', 'ESCRITURA', 'CONDICION_COMERCIAL_VERSION'), aprobada('DESACTIVAR_CONDICION', 'CU371', 'ESCRITURA', 'CONDICION_COMERCIAL'), aprobada('PUBLICAR_CONDICION', 'CU372', 'PUBLICACION', 'CONDICION_COMERCIAL_VERSION'),
    aprobada('EDITAR_PLANTILLA_DOCUMENTAL', 'CU378', 'ESCRITURA', 'BORRADOR_PLANTILLA_DOCUMENTAL'),
    aprobada('PUBLICAR_PLANTILLA_DOCUMENTAL', 'CU379', 'PUBLICACION', 'VERSION_INMUTABLE_PLANTILLA_DOCUMENTAL'),
    aprobada('EDITAR_CARTA_B2C', 'CU380', 'ESCRITURA', 'BORRADOR_CARTA_COMERCIAL_B2C'),
    aprobada('PUBLICAR_CARTA_B2C', 'CU381', 'PUBLICACION', 'VERSION_INMUTABLE_CARTA_COMERCIAL_B2C'),
]);
/** El estado de aprobación prima sobre los permisos declarados por el actor; administrador no lo elude. */
class AutorizadorCapacidadComercial {
    async exigir(actor, operacion) {
        if (!actor.id || !actor.sesion)
            throw new ErrorAplicacion_1.ErrorAplicacion(401, 'Se requiere una sesión backend autenticada', 'ACTOR_NO_AUTENTICADO');
        const capacidad = exports.MATRIZ_CAPACIDADES_COMERCIALES.find(item => item.operacion === operacion);
        if (!capacidad)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'La operación comercial no posee una política M4 definida', 'CAPACIDAD_COMERCIAL_NO_DEFINIDA');
        if (!capacidad.cuExistente)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, `La operación ${operacion} no tiene permiso M4 registrado`, 'PERMISO_COMERCIAL_PENDIENTE');
        if (!actor.permisos.includes(capacidad.cuExistente))
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'El actor no posee el permiso comercial requerido', 'ACCESO_COMERCIAL_DENEGADO');
    }
}
exports.AutorizadorCapacidadComercial = AutorizadorCapacidadComercial;
const objeto = (entrada) => {
    if (!entrada || typeof entrada !== 'object' || Array.isArray(entrada))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Datos comerciales inválidos');
    return entrada;
};
const enteroPositivo = (valor, campo) => {
    const numero = Number(valor);
    if (!Number.isInteger(numero) || numero < 1)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${campo} inválido`);
    return numero;
};
const texto = (valor, campo, maximo = 500) => {
    const salida = String(valor ?? '').trim();
    if (!salida || salida.length > maximo)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${campo} inválido`);
    return salida;
};
const fecha = (valor, campo) => {
    const salida = texto(valor, campo, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(salida) || !Number.isFinite(new Date(`${salida}T12:00:00Z`).getTime()))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `${campo} inválida`);
    return salida;
};
const vigencia = (dato) => {
    const desde = fecha(dato.vigenciaDesde, 'Vigencia desde');
    const hasta = dato.vigenciaHasta === null || dato.vigenciaHasta === undefined || dato.vigenciaHasta === '' ? null : fecha(dato.vigenciaHasta, 'Vigencia hasta');
    if (hasta && hasta < desde)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La vigencia hasta no puede ser anterior a la vigencia desde');
    return { desde, hasta };
};
/** Valida contratos futuros sin escribir ni convertir la operación en disponible. */
function validarSolicitudEscrituraComercial(operacion, entrada) {
    const dato = objeto(entrada);
    const revision = dato.revision === undefined ? undefined : enteroPositivo(dato.revision, 'Revisión');
    const clave = texto(dato.claveIdempotencia, 'Clave de idempotencia', 160);
    if (!/^[A-Za-z0-9._:-]{8,160}$/.test(clave))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Clave de idempotencia inválida');
    const motivo = texto(dato.motivo, 'Motivo', 1000);
    if (['CREAR_PRECIO', 'VERSIONAR_PRECIO', 'VERSIONAR_PRECIO_OPCIONAL', 'CREAR_SERVICIO', 'VERSIONAR_PRECIO_SERVICIO'].includes(operacion)) {
        const monto = Number(dato.monto);
        if (!Number.isFinite(monto) || monto <= 0)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Monto inválido');
        if (!['B2B', 'B2C'].includes(String(dato.segmento)))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Segmento inválido');
        vigencia(dato);
        enteroPositivo(dato.idMoneda, 'Moneda');
    }
    if (operacion === 'CREAR_SERVICIO') {
        texto(dato.codigo, 'Código', 50);
        texto(dato.nombre, 'Nombre', 160);
        if (!['UNIDAD', 'VIAJE', 'TRAMO', 'HORA', 'JORNADA', 'GLOBAL'].includes(String(dato.unidadCobro)))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Unidad de cobro inválida');
        if (dato.habilitadoB2b !== true && dato.habilitadoB2c !== true)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El servicio debe habilitar al menos un segmento');
        if ((dato.segmento === 'B2B' && dato.habilitadoB2b !== true) || (dato.segmento === 'B2C' && dato.habilitadoB2c !== true))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El precio inicial debe pertenecer a un segmento habilitado');
    }
    if (['CREAR_TARIFA', 'VERSIONAR_TARIFA', 'REGISTRAR_EXCLUSION_COMUNAL'].includes(operacion)) {
        const cobertura = String(dato.cobertura);
        if (!['DISPONIBLE', 'NO_DISPONIBLE', 'REQUIERE_EVALUACION'].includes(cobertura))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Cobertura inválida');
        const alcance = String(dato.alcance);
        if (!['REGION', 'COMUNA'].includes(alcance))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Alcance geográfico inválido');
        texto(dato.region, 'Región', 120);
        if (alcance === 'COMUNA')
            texto(dato.comuna, 'Comuna', 120);
        vigencia(dato);
        const tienePrecio = dato.precio !== null && dato.precio !== undefined;
        const tieneMoneda = dato.idMoneda !== null && dato.idMoneda !== undefined;
        if (cobertura === 'DISPONIBLE' && (!tienePrecio || !tieneMoneda || Number(dato.precio) <= 0))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Una cobertura disponible requiere precio y moneda');
        if (cobertura !== 'DISPONIBLE' && (tienePrecio || tieneMoneda))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Una cobertura no disponible o evaluable no debe informar precio');
    }
    if (operacion === 'CREAR_CONDICION') {
        if (!['B2B', 'B2C', 'CARTA_B2C'].includes(String(dato.segmento)))
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Segmento de condición inválido');
        texto(dato.codigo, 'Código', 60);
    }
    if (operacion === 'VERSIONAR_CONDICION') {
        objeto(dato.contenido);
        vigencia(dato);
    }
    if (/OPCIONAL|COMPATIBILIDAD/.test(operacion)) {
        if (operacion === 'MODIFICAR_COMPATIBILIDAD') {
            enteroPositivo(dato.idProducto, 'Producto');
            if (dato.habilitadoB2b !== true && dato.habilitadoB2c !== true)
                throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La compatibilidad debe habilitar al menos un segmento');
        }
        else if (operacion === 'CREAR_OPCIONAL')
            texto(dato.codigo, 'Código', 60);
    }
    return Object.freeze({ operacion, revision, claveIdempotencia: clave, motivo });
}
/** No está conectado a rutas. Cuando el CU sea aprobado, conserva autorización backend antes de toda escritura. */
class ServicioEscrituraComercialPreparada {
    constructor(autorizador, repositorio) {
        this.autorizador = autorizador;
        this.repositorio = repositorio;
    }
    async ejecutar(operacion, entrada, actor) {
        await this.autorizador.exigir(actor, operacion);
        validarSolicitudEscrituraComercial(operacion, entrada);
        return this.repositorio.ejecutar(operacion, entrada, actor.id);
    }
}
exports.ServicioEscrituraComercialPreparada = ServicioEscrituraComercialPreparada;
//# sourceMappingURL=SeguridadCapacidadesComerciales.js.map