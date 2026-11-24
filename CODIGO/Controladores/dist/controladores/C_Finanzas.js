"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.C_Finanzas = void 0;
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const M4Controller_1 = require("./M4Controller");
const M1Controller_1 = require("./M1Controller");
const M2Controller_1 = require("./M2Controller");
const M3Controller_1 = require("./M3Controller");
const M5Controller_1 = require("./M5Controller");
const M6Controller_1 = require("./M6Controller");
const M7Controller_1 = require("./M7Controller");
const M8Controller_1 = require("./M8Controller");
const M9Controller_1 = require("./M9Controller");
const MInventarioController_1 = require("./MInventarioController");
const ServicioOperacionalInventario_1 = require("../inventario/ServicioOperacionalInventario");
const AdaptadorCreditoM8ParaM7_1 = require("../servicios/AdaptadorCreditoM8ParaM7");
const contratoProductor_1 = require("../m9/contratoProductor");
const autorizacion_1 = require("../m9/autorizacion");
const solicitudes_1 = require("../validaciones/solicitudes");
const ServicioCatalogoComercial_1 = require("../comercial/ServicioCatalogoComercial");
const ServicioEscrituraComercial_1 = require("../comercial/ServicioEscrituraComercial");
const ServicioDocumentosComerciales_1 = require("../comercial/documentos/ServicioDocumentosComerciales");
const ServicioObraProyectoComercial_1 = require("../comercial/ServicioObraProyectoComercial");
const RepositorioDocumentalPrisma_1 = require("../documental/repositorios/RepositorioDocumentalPrisma");
const ServicioDocumentosProducto_1 = require("../documental/productos/ServicioDocumentosProducto");
const AutorizacionDocumental_1 = require("../documental/seguridad/AutorizacionDocumental");
const tipos_1 = require("../documental/tipos");
const ServicioDemostracion_1 = require("../demostracion/ServicioDemostracion");
const ServicioImportacionExcel_1 = require("../importaciones/ServicioImportacionExcel");
const normalizarFiltrosHttpM9 = (consulta) => {
    const filtros = { ...(consulta || {}) };
    for (const campo of ['pagina', 'tamano']) {
        const valor = filtros[campo];
        if (typeof valor === 'string' && valor.trim() !== '')
            filtros[campo] = Number(valor);
    }
    return filtros;
};
/** Único punto de entrada desde las Vistas. La coordinación siempre se realiza aquí. */
// Midas dejó esta puerta única por algo: acá se decide el camino y nada más.
class C_Finanzas {
    constructor(autorizacion, m1 = new M1Controller_1.M1Controller(), m2 = new M2Controller_1.M2Controller(), m3 = new M3Controller_1.M3Controller(), m4 = new M4Controller_1.M4Controller(), m5 = new M5Controller_1.M5Controller(), m6 = new M6Controller_1.M6Controller(), m7 = new M7Controller_1.M7Controller(), m8 = new M8Controller_1.M8Controller(), m9 = new M9Controller_1.M9Controller(), productorM9, mInventario = new MInventarioController_1.MInventarioController(), operacionalInventario = new ServicioOperacionalInventario_1.ServicioOperacionalInventario()) {
        this.autorizacion = autorizacion;
        this.m1 = m1;
        this.m2 = m2;
        this.m3 = m3;
        this.m4 = m4;
        this.m5 = m5;
        this.m6 = m6;
        this.m7 = m7;
        this.m8 = m8;
        this.m9 = m9;
        this.mInventario = mInventario;
        this.operacionalInventario = operacionalInventario;
        this.catalogoComercial = new ServicioCatalogoComercial_1.ServicioCatalogoComercial();
        this.escrituraComercial = new ServicioEscrituraComercial_1.ServicioEscrituraComercial();
        this.documentosComerciales = new ServicioDocumentosComerciales_1.ServicioDocumentosComerciales();
        this.obrasComerciales = new ServicioObraProyectoComercial_1.ServicioObraProyectoComercial();
        this.documentosProducto = new ServicioDocumentosProducto_1.ServicioDocumentosProducto(new RepositorioDocumentalPrisma_1.RepositorioDocumentalPrisma(), new AutorizacionDocumental_1.AutorizadorDocumental(async (_actor, contexto) => Number.isInteger(contexto.idProducto) && Number(contexto.idProducto) > 0));
        this.productorM9 = productorM9 ?? new contratoProductor_1.ProductorAuditoriaM9(this.m9);
        if (typeof this.m7.conectarCreditoM8 === 'function') {
            this.m7.conectarCreditoM8(new AdaptadorCreditoM8ParaM7_1.AdaptadorCreditoM8ParaM7(this.m8));
        }
    }
    async procesarImportacion(tipo, cuerpo, actor) {
        const analisis = await (0, ServicioImportacionExcel_1.analizarArchivoImportacion)(tipo, cuerpo.contenidoBase64);
        const base = { tipo: analisis.tipo, titulo: analisis.titulo, totalFilas: analisis.totalFilas, filasMuestra: analisis.filasMuestra };
        if (cuerpo.soloValidar === true || analisis.errores.length) {
            return { ...base, valido: analisis.errores.length === 0, importadas: 0, errores: analisis.errores };
        }
        let importadas = 0;
        const errores = [];
        for (const fila of analisis.filas) {
            try {
                switch (tipo) {
                    case 'clientes':
                        await this.m1.crearCliente(fila.datos);
                        break;
                    case 'empleados':
                        await this.m6.crearEmpleado(fila.datos);
                        break;
                    case 'proveedores':
                        await this.m5.crearProveedor(fila.datos);
                        break;
                    case 'areas-trabajo':
                        await this.m6.crearAreaTrabajo(fila.datos);
                        break;
                    case 'tareas-fabricacion':
                        await this.m2.crearTareaFabricacion(fila.datos, actor.id);
                        break;
                    case 'categorias-egreso':
                        await this.m5.crearCategoriaEgreso(fila.datos, actor.id);
                        break;
                }
                importadas++;
            }
            catch (error) {
                errores.push({ fila: fila.numero, errores: [error instanceof Error ? error.message : 'No fue posible importar la fila'] });
            }
        }
        return { ...base, valido: errores.length === 0, importadas, errores };
    }
    async plantillaImportacion(tipo) {
        if (tipo === 'proveedores') {
            const catalogos = await this.m5.catalogosProveedores();
            return (0, ServicioImportacionExcel_1.generarPlantillaImportacion)(tipo, [
                {
                    nombre: 'Referencia países',
                    columnas: [{ clave: 'id', cabecera: 'ID país' }, { clave: 'nombre', cabecera: 'País' }],
                    filas: catalogos.paises.map(item => ({ id: item.id_pais, nombre: item.nombre_pais })),
                },
                {
                    nombre: 'Referencia identificaciones',
                    columnas: [{ clave: 'id', cabecera: 'ID tipo identificación' }, { clave: 'nombre', cabecera: 'Tipo de identificación' }],
                    filas: catalogos.tiposIdentificador.map(item => ({ id: item.id_tipo_identificador, nombre: item.nombre_tipo_identificador })),
                },
            ]);
        }
        if (tipo === 'tareas-fabricacion') {
            const areas = await this.m6.listarAreasTrabajo(false);
            return (0, ServicioImportacionExcel_1.generarPlantillaImportacion)(tipo, [{
                    nombre: 'Referencia áreas',
                    columnas: [{ clave: 'id', cabecera: 'ID área' }, { clave: 'nombre', cabecera: 'Área de trabajo' }],
                    filas: areas.map(area => ({ id: area.id, nombre: area.nombre })),
                }]);
        }
        return (0, ServicioImportacionExcel_1.generarPlantillaImportacion)(tipo);
    }
    async ejecutar(operacion, solicitud) {
        // CU68/CU70 no exigen sesión previa. Cada comando protegido representa una confirmación de CU.
        // esta lista parece repetida, pero evita que un permiso se cuele por accidente
        if (operacion === 'iniciarSesion')
            return this.m4.iniciarSesion(solicitud.cuerpo || {}, solicitud.contexto);
        if (operacion === 'solicitarRecuperacion')
            return this.m4.solicitarRecuperacion(solicitud.cuerpo || {});
        if (operacion === 'validarRecuperacion')
            return this.m4.validarRecuperacion(solicitud.cuerpo || {});
        if (operacion === 'recuperarClave')
            return this.m4.recuperarClave(solicitud.cuerpo || {});
        if (operacion === 'salud')
            return { status: 'ok', arquitectura: 'C_Finanzas → M1/M2/M3/M4/M5/M6/M7/M8 → Prisma → PostgreSQL' };
        const adicionales = [];
        if (operacion === 'listarClientes') {
            if (solicitud.consulta?.busqueda || solicitud.consulta?.search)
                adicionales.push('CU06');
            if (solicitud.consulta?.estado && solicitud.consulta.estado !== 'activos')
                adicionales.push('CU07');
            if (solicitud.consulta?.deuda === 'true' || solicitud.consulta?.morosos === 'true' || solicitud.consulta?.situacion)
                adicionales.push('CU08');
            if (solicitud.consulta?.ordenar === 'ultimaActividad' || solicitud.consulta?.fechaDesde || solicitud.consulta?.fechaHasta)
                adicionales.push('CU11');
        }
        if (operacion === 'abrirFicha' && ((solicitud.consulta?.tipoAntecedente && solicitud.consulta.tipoAntecedente !== 'todos') || solicitud.consulta?.fechaDesde || solicitud.consulta?.fechaHasta || (solicitud.consulta?.direccion && solicitud.consulta.direccion !== 'desc')))
            adicionales.push('CU10');
        if (operacion === 'listarProveedores') {
            if (solicitud.consulta?.busqueda)
                adicionales.push('CU81');
            if (solicitud.consulta?.estado && String(solicitud.consulta.estado).toLowerCase() !== 'todos')
                adicionales.push('CU82');
            if (solicitud.consulta?.situacion && String(solicitud.consulta.situacion).toLowerCase() !== 'todos')
                adicionales.push('CU83');
            if (solicitud.consulta?.ordenar || solicitud.consulta?.direccion)
                adicionales.push('CU86');
        }
        if (operacion === 'abrirFichaProveedor' && (solicitud.consulta?.tipoAntecedente || solicitud.consulta?.estadoAntecedente || solicitud.consulta?.direccion))
            adicionales.push('CU85');
        if (operacion === 'listarCuentasPorPagar') {
            if (solicitud.consulta?.estadoTemporal && String(solicitud.consulta.estadoTemporal).toLowerCase() !== 'todos')
                adicionales.push('CU107');
            if (solicitud.consulta?.estadoPago && String(solicitud.consulta.estadoPago).toLowerCase() !== 'todos')
                adicionales.push('CU108');
            if (solicitud.consulta?.proveedor || solicitud.consulta?.busqueda || solicitud.consulta?.ordenar || solicitud.consulta?.direccion)
                adicionales.push('CU109');
        }
        const actor = await (0, ServicioDemostracion_1.medirEtapa)('SEGURIDAD_M4', 'Evaluación de sesión, CU y alcance', async () => (this.autorizacion ? this.autorizacion.autorizar(operacion, solicitud.contexto) : this.m4.autorizar(operacion, solicitud.contexto, adicionales)), { detalle: adicionales.length ? `Permisos adicionales: ${adicionales.join(', ')}` : 'M4 aplica la matriz vigente' });
        // Sólo inyección explícita en pruebas. La ejecución normal siempre usa M4.
        // TODO: dejar documentado el adaptador de pruebas cuando cerremos la integración
        if (actor && ((operacion === 'guardarCotizacion' && Number(solicitud.cuerpo?.descuento_valor) > 0 && !actor.permisos.includes('CU31')) || (operacion === 'crearVentaDirecta' && Number(solicitud.cuerpo?.descuento?.valor) > 0 && !actor.permisos.includes('CU33'))))
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'No tienes permiso para aplicar descuentos');
        if (operacion === 'confirmarAjusteOrdenCompraServicio' && actor.configuracion !== 'gerencia' && !actor.administrador)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Sólo Gerencia puede confirmar un ajuste de OCS');
        if (operacion === 'confirmarImputacionDocumento' && !['gerencia', 'contador'].includes(actor.configuracion) && !actor.administrador)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Sólo Gerencia o Contador pueden confirmar la imputación');
        if (operacion === 'registrarTipoCambioManualPago' && !['gerencia', 'contador'].includes(actor.configuracion) && !actor.administrador)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Secretaría no puede ingresar una tasa manual');
        if (operacion === 'confirmarOperacionPago' && !['gerencia', 'contador'].includes(actor.configuracion) && !actor.administrador)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Sólo Gerencia o Contador pueden confirmar pagos a proveedores');
        if (['anularMovimientoPago', 'anularOperacionPago', 'revertirMovimientoPago', 'conciliarMovimientoPago', 'reemplazarRespaldoPago', 'anularAjusteObligacion'].includes(operacion) && !['gerencia', 'contador'].includes(actor.configuracion) && !actor.administrador)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Sólo Gerencia o Contador pueden ejecutar esta operación');
        if (['aprobarReasignacionCosto', 'rechazarReasignacionCosto'].includes(operacion) && actor.configuracion !== 'gerencia' && !actor.administrador)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Sólo Gerencia puede resolver reasignaciones de costo');
        if (['reabrirEnvio', 'aprobarGastoCajaChica', 'rechazarGastoCajaChica'].includes(operacion) && !['gerencia', 'contador'].includes(actor.configuracion) && !actor.administrador)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Sólo Gerencia o Contador pueden ejecutar esta operación');
        const productosConCostoAjustado = Array.isArray(solicitud.cuerpo?.productos) && solicitud.cuerpo.productos.some(producto => Array.isArray(producto.materiales) && producto.materiales.some(material => material.costo_ajustado !== undefined));
        if (operacion === 'editarCotizacion' && (solicitud.cuerpo?.precio_sugerido !== undefined || productosConCostoAjustado || Array.isArray(solicitud.cuerpo?.materiales) && (solicitud.cuerpo?.materiales).some(m => m.costo_ajustado !== undefined || m.precio !== undefined)) && actor.configuracion !== 'gerencia' && !actor.administrador)
            throw new ErrorAplicacion_1.ErrorAplicacion(403, 'Sólo Gerencia puede ajustar costos o precio sugerido');
        const parametros = solicitud.parametros || {};
        const cuerpo = solicitud.cuerpo || {};
        const ejecutarOwner = async () => {
            switch (operacion) {
                case 'miSesion': return { ...actor, id: actor.id.toString(), sesion: undefined };
                case 'plantillaImportacionClientes': return this.plantillaImportacion('clientes');
                case 'importarClientes': return this.procesarImportacion('clientes', cuerpo, actor);
                case 'plantillaImportacionEmpleados': return this.plantillaImportacion('empleados');
                case 'importarEmpleados': return this.procesarImportacion('empleados', cuerpo, actor);
                case 'plantillaImportacionProveedores': return this.plantillaImportacion('proveedores');
                case 'importarProveedores': return this.procesarImportacion('proveedores', cuerpo, actor);
                case 'plantillaImportacionAreasTrabajo': return this.plantillaImportacion('areas-trabajo');
                case 'importarAreasTrabajo': return this.procesarImportacion('areas-trabajo', cuerpo, actor);
                case 'plantillaImportacionTareasFabricacion': return this.plantillaImportacion('tareas-fabricacion');
                case 'importarTareasFabricacion': return this.procesarImportacion('tareas-fabricacion', cuerpo, actor);
                case 'plantillaImportacionCategoriasEgreso': return this.plantillaImportacion('categorias-egreso');
                case 'importarCategoriasEgreso': return this.procesarImportacion('categorias-egreso', cuerpo, actor);
                case 'crearCliente': return this.m1.crearCliente(cuerpo);
                case 'actualizarCliente': return this.m1.actualizarCliente((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'desactivarCliente': return this.m1.cambiarEstadoCliente((0, solicitudes_1.identificador)(parametros.id), 'inactivo', cuerpo.confirmado === true);
                case 'reactivarCliente': return this.m1.cambiarEstadoCliente((0, solicitudes_1.identificador)(parametros.id), 'activo', cuerpo.confirmado === true);
                case 'crearProveedor': return this.m5.crearProveedor(cuerpo);
                case 'actualizarProveedor': return this.m5.actualizarProveedor((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'corregirIdentidadProveedor': return this.m5.corregirIdentidadProveedor((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'desactivarProveedor': return this.m5.cambiarEstadoProveedor((0, solicitudes_1.identificador)(parametros.id), 'inactivo', cuerpo.confirmado === true, actor.id);
                case 'reactivarProveedor': return this.m5.cambiarEstadoProveedor((0, solicitudes_1.identificador)(parametros.id), 'activo', cuerpo.confirmado === true, actor.id);
                case 'listarProveedores': return this.m5.listarProveedores(solicitud.consulta || {});
                case 'abrirFichaProveedor': return this.m5.abrirFichaProveedor((0, solicitudes_1.identificador)(parametros.id), solicitud.consulta || {});
                case 'listarEmpleados': return this.m6.listarEmpleados(solicitud.consulta || {});
                case 'obtenerEmpleado': return this.m6.obtenerEmpleado((0, solicitudes_1.identificador)(parametros.id));
                case 'crearEmpleado': return this.m6.crearEmpleado(cuerpo);
                case 'actualizarDatosBaseEmpleado': return this.m6.actualizarDatosBaseEmpleado((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'listarAreasTrabajo': return this.m6.listarAreasTrabajo(solicitud.consulta?.incluirInactivas !== 'false');
                case 'crearAreaTrabajo': return this.m6.crearAreaTrabajo(cuerpo);
                case 'actualizarAreaTrabajo': return this.m6.actualizarAreaTrabajo(BigInt((0, solicitudes_1.identificador)(parametros.id)), cuerpo);
                case 'activarAreaTrabajo': return this.m6.cambiarEstadoAreaTrabajo(BigInt((0, solicitudes_1.identificador)(parametros.id)), true);
                case 'desactivarAreaTrabajo': return this.m6.cambiarEstadoAreaTrabajo(BigInt((0, solicitudes_1.identificador)(parametros.id)), false);
                case 'listarEmpleadosArea': return this.m6.listarEmpleadosArea(BigInt((0, solicitudes_1.identificador)(parametros.id)));
                case 'obtenerHistorialAreaEmpleado': return this.m6.obtenerHistorialAreaEmpleado((0, solicitudes_1.identificador)(parametros.id));
                case 'asignarAreaEmpleado': return this.m6.asignarAreaEmpleado((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'catalogosLaborales': return this.m6.catalogosLaborales();
                case 'listarRelacionesLaborales': return this.m6.listarRelacionesLaborales((0, solicitudes_1.identificador)(parametros.id));
                case 'crearRelacionLaboral': return this.m6.crearRelacionLaboral((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'actualizarRelacionLaboral': return this.m6.actualizarRelacionLaboral((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.relacionId), cuerpo);
                case 'catalogosRemuneracionales': return this.m6.catalogosRemuneracionales();
                case 'obtenerPerfilRemuneracional': return this.m6.obtenerPerfilRemuneracional((0, solicitudes_1.identificador)(parametros.id));
                case 'obtenerHistorialRemuneracionalEmpleado': {
                    const historial = await this.m6.obtenerHistorialRemuneracional((0, solicitudes_1.identificador)(parametros.id), solicitud.consulta || {});
                    if (!actor.permisos.includes('CU355') && !actor.administrador)
                        return historial;
                    const auditoria = await this.m9.consultar({ modulo: 'M6', operacion: 'PAGO_PREPARADO_MODIFICADO', pagina: 1, tamano: 200, orden: 'desc' }, (0, autorizacion_1.scopeM9DesdeActor)(actor));
                    const porPago = new Map();
                    for (const evento of auditoria.eventos) {
                        const referencia = evento.referencia?.id;
                        if (referencia)
                            porPago.set(referencia, [...(porPago.get(referencia) || []), evento]);
                    }
                    for (const periodo of historial.periodos)
                        for (const pago of periodo.pagos)
                            pago.auditoria = { ...pago.auditoria, eventos: porPago.get(String(pago.id)) || [], puedeVer: true };
                    return historial;
                }
                case 'actualizarPerfilRemuneracional': return this.m6.actualizarPerfilRemuneracional((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'catalogosAsignacionEsquemas': return this.m6.catalogosAsignacionEsquemas();
                case 'listarAsignacionesEsquemaEmpleado': return this.m6.listarAsignacionesEsquemaEmpleado((0, solicitudes_1.identificador)(parametros.id));
                case 'asignarEsquemaEmpleado': return this.m6.asignarEsquemaEmpleado((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'finalizarAsignacionEsquemaEmpleado': return this.m6.finalizarAsignacionEsquemaEmpleado((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.asignacionId), cuerpo);
                case 'catalogoHaberes': return this.m6.catalogoHaberes();
                case 'listarAsignacionesHaberEmpleado': return this.m6.listarAsignacionesHaberEmpleado((0, solicitudes_1.identificador)(parametros.id));
                case 'asignarHaberEmpleado': return this.m6.asignarHaberEmpleado((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'finalizarAsignacionHaberEmpleado': return this.m6.finalizarAsignacionHaberEmpleado((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.asignacionId), cuerpo);
                case 'obtenerConfiguracionDocumental': return this.m6.obtenerConfiguracionDocumental((0, solicitudes_1.identificador)(parametros.id));
                case 'actualizarConfiguracionDocumental': return this.m6.actualizarConfiguracionDocumental((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'listarEsquemas': return this.m6.listarEsquemas();
                case 'catalogoCargosEsquemas': return this.m6.catalogoCargosEsquemas();
                case 'crearEsquema': return this.m6.crearEsquema(cuerpo);
                case 'actualizarEsquema': return this.m6.actualizarEsquema((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'asignarEsquemaCargo': return this.m6.asignarEsquemaCargo((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'listarTarifasEsquema': return this.m6.listarTarifasEsquema((0, solicitudes_1.identificador)(parametros.id), solicitud.consulta?.fecha);
                case 'crearTarifaEsquema': return this.m6.crearTarifaEsquema((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'revisarTarifaEsquema': return this.m6.revisarTarifaEsquema((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.tarifaId));
                case 'listarHaberes': return this.m6.listarHaberes();
                case 'crearHaber': return this.m6.crearHaber(cuerpo);
                case 'actualizarHaber': return this.m6.actualizarHaber((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'crearConfiguracionHaber': return this.m6.crearConfiguracionHaber((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'resolverConfiguracionHaber': return this.m6.resolverConfiguracionHaber((0, solicitudes_1.identificador)(parametros.id), solicitud.consulta?.fecha);
                case 'listarParametrosRemuneracionales': return this.m6.listarParametrosRemuneracionales(solicitud.consulta?.tipo);
                case 'crearParametroRemuneracional': return this.m6.crearParametroRemuneracional(cuerpo);
                case 'actualizarParametroRemuneracional': return this.m6.actualizarParametroRemuneracional((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'resolverParametroRemuneracional': return this.m6.resolverParametroRemuneracional(solicitud.consulta?.codigo, solicitud.consulta?.fecha);
                case 'listarTramosImpuestoRenta': return this.m6.listarTramosImpuestoRenta(solicitud.consulta?.fecha);
                case 'crearTramoImpuestoRenta': return this.m6.crearTramoImpuestoRenta(cuerpo);
                case 'listarConceptosDeduccionAporte': return this.m6.listarConceptosDeduccionAporte();
                case 'crearConceptoDeduccionAporte': return this.m6.crearConceptoDeduccionAporte(cuerpo);
                case 'actualizarConceptoDeduccionAporte': return this.m6.actualizarConceptoDeduccionAporte((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'listarConfiguracionProrrateo': return this.m6.listarConfiguracionProrrateo(solicitud.consulta?.fecha);
                case 'crearConfiguracionProrrateo': return this.m6.crearConfiguracionProrrateo(cuerpo);
                case 'listarPoliticasConservacion': return this.m6.listarPoliticasConservacion(solicitud.consulta?.fecha);
                case 'crearPoliticaConservacion': return this.m6.crearPoliticaConservacion(cuerpo);
                case 'listarMediosPagoM6': return this.m6.listarMediosPagoM6(solicitud.consulta?.activos === 'true');
                case 'crearMedioPagoM6': return this.m6.crearMedioPagoM6(cuerpo);
                case 'actualizarMedioPagoM6': return this.m6.actualizarMedioPagoM6((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'listarHechosRemunerables': return this.m6.listarHechosRemunerables();
                case 'obtenerHechoRemunerable': return this.m6.obtenerHechoRemunerable(BigInt((0, solicitudes_1.identificador)(parametros.id)));
                case 'revisarHechoRemunerable': return this.m6.revisarHechoRemunerable(BigInt((0, solicitudes_1.identificador)(parametros.id)));
                case 'listarRetrabajosPendientes': return this.m6.listarRetrabajosPendientes();
                case 'resolverRetrabajo': return this.m6.resolverRetrabajo(BigInt((0, solicitudes_1.identificador)(parametros.id)), cuerpo, actor.id);
                case 'obtenerOCrearContextoRemuneracion': return this.m6.obtenerOCrearContextoRemuneracion(cuerpo, actor.id);
                case 'obtenerRemuneracion': return this.m6.obtenerRemuneracion((0, solicitudes_1.identificador)(parametros.id));
                case 'proponerComponenteExcepcional': return this.m6.proponerComponenteExcepcional((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'resolverComponenteExcepcional': return this.m6.resolverComponenteExcepcional((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'proponerVariableRemuneracion': return this.m6.proponerVariableRemuneracion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'resolverVariableRemuneracion': return this.m6.resolverVariableRemuneracion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'registrarValorExterno': return this.m6.registrarValorExterno((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'proponerAjusteManual': return this.m6.proponerAjusteManual((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'resolverValorOAjuste': return this.m6.resolverValorOAjuste((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'obtenerContextoProrrateo': return this.m6.obtenerContextoProrrateo((0, solicitudes_1.identificador)(parametros.id));
                case 'proponerProrrateoIndividual': return this.m6.proponerProrrateoIndividual((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'resolverProrrateoIndividual': return this.m6.resolverProrrateoIndividual((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'consultarPeriodoRemuneracion': return this.m6.consultarPeriodoRemuneracion(solicitud.consulta?.anio, solicitud.consulta?.mes);
                case 'calcularRemuneracion': return this.m6.calcularRemuneracion(cuerpo, actor.id);
                case 'cerrarRemuneracion': return this.m6.cerrarRemuneracion((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'obtenerLiquidacionRemuneracion': return this.m6.obtenerLiquidacionRemuneracion((0, solicitudes_1.identificador)(parametros.id));
                case 'cerrarPeriodoRemuneracion': return this.m6.cerrarPeriodoRemuneracion(cuerpo.anio, cuerpo.mes, actor.id);
                case 'solicitarReaperturaRemuneracion': return this.m6.solicitarReaperturaRemuneracion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'aprobarReaperturaRemuneracion': return this.m6.aprobarReaperturaRemuneracion((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'crearAjustePosterior': return this.m6.crearAjustePosterior((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'obtenerAjustePosterior': return this.m6.obtenerAjustePosterior((0, solicitudes_1.identificador)(parametros.id));
                case 'postergarAjustePosterior': return this.m6.postergarAjustePosterior((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'crearRegularizacionExtraordinaria': return this.m6.crearRegularizacionExtraordinaria((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'obtenerRegularizacion': return this.m6.obtenerRegularizacion((0, solicitudes_1.identificador)(parametros.id));
                case 'actualizarRegularizacion': return this.m6.actualizarRegularizacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'cerrarRegularizacion': return this.m6.cerrarRegularizacion((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'registrarAnticipo': return this.m6.registrarAnticipo(cuerpo, actor.id);
                case 'obtenerAnticipo': return this.m6.obtenerAnticipo((0, solicitudes_1.identificador)(parametros.id));
                case 'prepararPagoAnticipo': return this.m6.prepararPagoAnticipo((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'actualizarPagoAnticipo': return this.m6.actualizarPagoAnticipo((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'confirmarPagoAnticipo': return this.m6.confirmarPagoAnticipo((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'listarPagosRemuneracion': return this.m6.listarPagosRemuneracion();
                case 'obtenerPagoRemuneracion': return this.m6.obtenerPagoRemuneracion((0, solicitudes_1.identificador)(parametros.id));
                case 'prepararPagoFinal': return this.m6.prepararPagoFinal(cuerpo, actor.id);
                case 'actualizarPagoFinal': return this.m6.actualizarPagoFinal((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'confirmarPagoFinal': return this.m6.confirmarPagoFinal((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'listarBoletasHonorariosConfirmadas': return this.m6.listarBoletasHonorariosConfirmadas();
                case 'listarPrestadoresHonorarios': return this.m6.listarPrestadoresHonorarios();
                case 'crearPrestadorHonorarios': return this.m6.crearPrestadorHonorarios(cuerpo);
                case 'listarBoletasHonorarios': return this.m6.listarBoletasHonorarios(solicitud.consulta || {});
                case 'obtenerBoletaHonorarios': return this.m6.obtenerBoletaHonorarios((0, solicitudes_1.identificador)(parametros.id));
                case 'crearBoletaHonorarios': return this.m6.crearBoletaHonorarios(cuerpo);
                case 'actualizarBoletaHonorarios': return this.m6.actualizarBoletaHonorarios((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'previsualizarConfirmacionBoletaHonorarios': return this.m6.previsualizarConfirmacionBoletaHonorarios((0, solicitudes_1.identificador)(parametros.id));
                case 'confirmarBoletaHonorarios': return this.m6.confirmarBoletaHonorarios((0, solicitudes_1.identificador)(parametros.id));
                case 'consultarRetencionesHonorariosMensuales': return this.m6.consultarRetencionesHonorariosMensuales(solicitud.consulta?.anio, solicitud.consulta?.mes);
                case 'prepararPagoHonorarios': return this.m6.prepararPagoHonorarios((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'actualizarPagoHonorarios': return this.m6.actualizarPagoHonorarios((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'confirmarPagoHonorarios': return this.m6.confirmarPagoHonorarios((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'obtenerDetallePagoRemuneracion': return this.m6.obtenerPagoRemuneracion((0, solicitudes_1.identificador)(parametros.id));
                case 'anularPagoRemuneracion': return this.m6.anularPagoRemuneracion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'registrarReversionPagoRemuneracion': return this.m6.registrarReversionPagoRemuneracion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'listarDocumentosRemuneracion': return this.m6.listarDocumentosRemuneracion(solicitud.consulta || {}, actor);
                case 'descargarDocumentoRemuneracion': return this.m6.descargarDocumentoRemuneracion(parametros.tipo, (0, solicitudes_1.identificador)(parametros.id), actor);
                case 'reenviarDocumentoRemuneracion': return this.m6.reenviarDocumentoRemuneracion(parametros.tipo, (0, solicitudes_1.identificador)(parametros.id), actor);
                case 'registrarEntregaDocumento': return this.m6.registrarEntregaDocumento(cuerpo, actor);
                case 'consultarEntregaDocumento': return this.m6.consultarEntregaDocumento(parametros.tipo, (0, solicitudes_1.identificador)(parametros.id), actor);
                case 'exportarCalculoPreliminar': return this.m6.exportarCalculoPreliminar((0, solicitudes_1.identificador)(parametros.id), actor);
                case 'exportarRemuneracionesOficiales': return this.m6.exportarRemuneracionesOficiales(solicitud.consulta || {}, actor);
                case 'crearVisitaTerreno': return this.m6.crearVisitaTerreno(cuerpo);
                case 'listarObrasTerreno': return this.m6.listarObrasTerreno();
                case 'listarVisitasTerreno': return this.m6.listarVisitasTerreno();
                case 'obtenerVisitaTerreno': return this.m6.obtenerVisitaTerreno((0, solicitudes_1.identificador)(parametros.id));
                case 'listarInstalacionesTerreno': return this.m6.listarInstalacionesTerreno();
                case 'listarUsuariosTerreno': return this.m6.listarUsuariosTerreno();
                case 'asignarResponsableVisita': return this.m6.asignarResponsableVisita((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'listarMisTareasTerreno': return this.m6.listarMisTareasTerreno(actor.id);
                case 'obtenerLevantamientoTerreno': return this.m6.obtenerLevantamientoTerreno((0, solicitudes_1.identificador)(parametros.id), actor);
                case 'guardarLevantamientoTerreno': return this.m6.guardarLevantamientoTerreno((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'corregirLevantamientoTerreno': return this.m6.corregirLevantamientoTerreno((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'generarOrdenTrabajoLevantamiento': return this.m6.generarOrdenTrabajoLevantamiento((0, solicitudes_1.identificador)(parametros.id), actor);
                case 'listarOrdenesTrabajoRectificacion': return this.m6.listarOrdenesTrabajoRectificacion(solicitud.consulta || {}, actor);
                case 'obtenerOrdenTrabajoRectificacion': return this.m6.obtenerOrdenTrabajoRectificacion((0, solicitudes_1.identificador)(parametros.ordenId), actor);
                case 'asignarRectificadorOrdenTrabajo': return this.m6.asignarRectificadorOrdenTrabajo((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'guardarRectificacionOrdenTrabajo': return this.m6.guardarRectificacionOrdenTrabajo((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'enviarRectificacionAprobacion': return this.m6.enviarRectificacionAprobacion((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'aprobarRectificacionOrdenTrabajo': return this.m6.aprobarRectificacionOrdenTrabajo((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'devolverRectificacionOrdenTrabajo': return this.m6.devolverRectificacionOrdenTrabajo((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'liberarOrdenTrabajoRectificada': return this.m6.liberarOrdenTrabajoRectificada((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'ajustarOrdenTrabajoTerreno': return this.m6.ajustarOrdenTrabajoTerreno((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'liberarOrdenTrabajoTerreno': return this.m6.liberarOrdenTrabajoTerreno((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.ordenId), actor);
                case 'generarTareasProduccion': return this.m6.generarTareasProduccion((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'listarTareasProduccion': return this.m6.listarTareasProduccion((0, solicitudes_1.identificador)(parametros.ordenId));
                case 'asignarTareaProduccion': return this.m6.asignarTareaProduccion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'modificarTareaProduccion': return this.m6.modificarTareaProduccion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'agregarEtapaProduccion': return this.m6.agregarEtapaProduccion((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'agregarTareaProduccion': return this.m6.agregarTareaProduccion((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'iniciarTareaProduccion': return this.m6.iniciarTareaProduccion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'registrarEjecucionTarea': return this.m6.registrarEjecucionTarea((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'listarEjecucionesPendientes': return this.m6.listarEjecucionesPendientes();
                case 'validarEjecucionProductiva': return this.m6.validarEjecucionProductiva((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'cerrarTareaProduccion': return this.m6.cerrarTareaProduccion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'solicitarCorreccionTecnicaProduccion': return this.m6.solicitarCorreccionTecnicaProduccion((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'finalizarOrdenTrabajoProduccion': return this.m6.finalizarOrdenTrabajoProduccion((0, solicitudes_1.identificador)(parametros.ordenId), cuerpo, actor);
                case 'obtenerPreparacionSalida': return this.m6.obtenerPreparacionSalida((0, solicitudes_1.identificador)(parametros.id));
                case 'actualizarChecklistSalida': return this.m6.actualizarChecklistSalida((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'registrarResultadoVisita': return this.m6.registrarResultadoVisita((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'registrarIncidenciaRetrabajo': return this.m6.registrarIncidenciaRetrabajo((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'listarIncidenciasOperativas': return this.m6.listarIncidenciasOperativas(solicitud.consulta || {});
                case 'catalogosIncidenciaOperativa': return this.m6.catalogosIncidenciaOperativa(solicitud.consulta || {});
                case 'obtenerEvidenciaIncidencia': return this.m6.obtenerEvidenciaIncidencia((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.evidenciaId));
                case 'adjuntarEvidenciaIncidencia': return this.m6.adjuntarEvidenciaIncidencia((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'actualizarIncidenciaOperativa': return this.m6.actualizarIncidenciaOperativa((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'aprobarIncidenciaOperativa': return this.m6.resolverIncidenciaOperativa((0, solicitudes_1.identificador)(parametros.id), 'aprobada', cuerpo, actor);
                case 'rechazarIncidenciaOperativa': return this.m6.resolverIncidenciaOperativa((0, solicitudes_1.identificador)(parametros.id), 'rechazada', cuerpo, actor);
                case 'consultarDashboardTerreno': return this.m6.consultarDashboardTerreno(solicitud.consulta || {}, actor);
                case 'exportarReporteTerreno': return this.m6.exportarReporteTerreno(solicitud.consulta || {}, actor);
                case 'catalogoDeduccionesEmpleado': return this.m6.catalogoDeduccionesEmpleado();
                case 'listarDeduccionesEmpleado': return this.m6.listarDeduccionesEmpleado((0, solicitudes_1.identificador)(parametros.id));
                case 'asignarDeduccionEmpleado': return this.m6.asignarDeduccionEmpleado((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'finalizarDeduccionEmpleado': return this.m6.finalizarDeduccionEmpleado((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.asignacionId), cuerpo);
                case 'catalogosProveedores': return this.m5.catalogosProveedores();
                case 'actualizarCondicionPagoProveedor': return this.m5.actualizarCondicionPagoProveedor((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'listarOrdenesCompraServicios': return this.m5.listarOrdenesCompraServicios();
                case 'listarClientesB2BContextoOcs': return this.m5.listarClientesB2BContextoOcs(solicitud.consulta || {});
                case 'obtenerOrdenCompraServicio': return this.m5.obtenerOrdenCompraServicio((0, solicitudes_1.identificador)(parametros.id));
                case 'crearOrdenCompraServicio': return this.m5.crearOrdenCompraServicio(cuerpo, actor.id);
                case 'modificarOrdenCompraServicio': return this.m5.modificarOrdenCompraServicio((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'prepararAjusteOrdenCompraServicio': return this.m5.prepararAjusteOrdenCompraServicio((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'confirmarAjusteOrdenCompraServicio': return this.m5.confirmarAjusteOrdenCompraServicio((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.ajusteId), actor.id);
                case 'anularOrdenCompraServicio': return this.m5.anularOrdenCompraServicio((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'cerrarOrdenCompraServicio': return this.m5.cerrarOrdenCompraServicio((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'reabrirOrdenCompraServicio': return this.m5.reabrirOrdenCompraServicio((0, solicitudes_1.identificador)(parametros.id), cuerpo.confirmado === true, actor.id);
                case 'listarDocumentosProveedor': return this.m5.listarDocumentosProveedor(solicitud.consulta || {});
                case 'obtenerDocumentoProveedor': return this.m5.obtenerDocumentoProveedor((0, solicitudes_1.texto)(parametros.id, 30));
                case 'catalogosDocumentosProveedor': return this.m5.catalogosDocumentosProveedor();
                case 'registrarDocumentoPreliminar': return this.m5.registrarDocumentoPreliminar(cuerpo, actor.id);
                case 'registrarDocumentoDefinitivo': return this.m5.registrarDocumentoDefinitivo(cuerpo, actor.id);
                case 'asociarDocumentoOrdenes': return this.m5.asociarDocumentoOrdenes((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'resolverDiferenciaDocumento': return this.m5.resolverDiferenciaDocumento((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.asociacionId), cuerpo, actor.id);
                case 'resolverExcedenteDocumento': return this.m5.resolverExcedenteDocumento((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.asociacionId), cuerpo, actor.id, actor.configuracion);
                case 'determinarVencimientoDocumento': return this.m5.determinarVencimientoDocumento((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'clasificarDocumento': return this.m5.clasificarDocumento((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'prepararImputacionDocumento': return this.m5.prepararImputacionDocumento((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'confirmarImputacionDocumento': return this.m5.confirmarImputacionDocumento((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.propuestaId), actor.id);
                case 'registrarTipoCambioManual': return this.m5.registrarTipoCambioManual((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'generarObligacionDocumento': return this.m5.generarObligacionDocumento((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'listarCuentasPorPagar': return this.m5.listarCuentasPorPagar(solicitud.consulta || {});
                case 'consultarUmbralProveedores': return this.m5.consultarUmbralM5();
                case 'configurarUmbralProveedores': return this.m5.configurarUmbralM5(cuerpo, actor.id);
                case 'buscarProveedoresPago': return this.m5.buscarProveedoresParaPago(solicitud.consulta || {});
                case 'catalogosPagosProveedores': return this.m5.catalogosPagosProveedores();
                case 'crearOperacionPago': return this.m5.crearOperacionPago(cuerpo, actor.id);
                case 'listarBorradoresPago': return this.m5.listarBorradoresPago();
                case 'obtenerOperacionPago': return this.m5.obtenerOperacionPago((0, solicitudes_1.identificador)(parametros.id));
                case 'agregarMovimientoPago': return this.m5.agregarMovimientoPago((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'actualizarMovimientoPago': return this.m5.actualizarMovimientoPago((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.movimientoId), cuerpo);
                case 'adjuntarRespaldoPago': return this.m5.adjuntarRespaldoPago((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'registrarTipoCambioManualPago': return this.m5.registrarTipoCambioManualPago((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.movimientoId), cuerpo, actor.id, actor.configuracion);
                case 'prepararOperacionPago': return this.m5.prepararOperacionPago((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'guardarBorradorPago': return this.m5.guardarBorradorPago((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'retomarOperacionPago': return this.m5.retomarOperacionPago((0, solicitudes_1.identificador)(parametros.id));
                case 'descartarOperacionPago': return this.m5.descartarOperacionPago((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'confirmarOperacionPago': return this.m5.confirmarOperacionPago((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'listarPagosConfirmados': return this.m5.listarPagosConfirmados();
                case 'consultarDetallePagoProveedor': return this.m5.consultarDetallePagoProveedor((0, solicitudes_1.identificador)(parametros.id));
                case 'anularMovimientoPago': return this.m5.anularMovimientoPago((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.movimientoId), cuerpo, actor.id);
                case 'anularOperacionPago': return this.m5.anularOperacionPago((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'revertirMovimientoPago': return this.m5.revertirMovimientoPago((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.movimientoId), cuerpo, actor.id);
                case 'conciliarMovimientoPago': return this.m5.conciliarMovimientoPago((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.movimientoId), cuerpo, actor.id);
                case 'reemplazarRespaldoPago': return this.m5.reemplazarRespaldoPago((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.respaldoId), cuerpo, actor.id);
                case 'registrarNotaCredito': return this.m5.registrarNotaCredito(cuerpo, actor.id);
                case 'registrarNotaDebito': return this.m5.registrarNotaDebito(cuerpo, actor.id);
                case 'anularAjusteObligacion': return this.m5.anularAjusteObligacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'consultarSaldosFavorProveedor': return this.m5.consultarSaldosFavorProveedor((0, solicitudes_1.identificador)(parametros.id));
                case 'proponerCompensacion': return this.m5.proponerCompensacion((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'confirmarCompensacion': return this.m5.confirmarCompensacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'listarCompensaciones': return this.m5.listarCompensaciones((0, solicitudes_1.identificador)(parametros.id));
                case 'revertirCompensacion': return this.m5.revertirCompensacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'listarCategoriasEgreso': return this.m5.listarCategoriasEgreso();
                case 'crearCategoriaEgreso': return this.m5.crearCategoriaEgreso(cuerpo, actor.id);
                case 'actualizarCategoriaEgreso': return this.m5.actualizarCategoriaEgreso((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'activarCategoriaEgreso': return this.m5.actualizarCategoriaEgreso((0, solicitudes_1.identificador)(parametros.id), { ...cuerpo, activo: true }, actor.id);
                case 'desactivarCategoriaEgreso': return this.m5.actualizarCategoriaEgreso((0, solicitudes_1.identificador)(parametros.id), { ...cuerpo, activo: false }, actor.id);
                case 'solicitarReclasificacion': return this.m5.solicitarReclasificacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'listarReclasificaciones': return this.m5.listarReclasificaciones();
                case 'aprobarReclasificacion': return this.m5.resolverReclasificacion((0, solicitudes_1.identificador)(parametros.id), true, cuerpo, actor.id, actor.configuracion);
                case 'rechazarReclasificacion': return this.m5.resolverReclasificacion((0, solicitudes_1.identificador)(parametros.id), false, cuerpo, actor.id, actor.configuracion);
                case 'consultarUmbralReclasificacion': return this.m5.consultarUmbralReclasificacion();
                case 'configurarUmbralReclasificacion': return this.m5.configurarUmbralReclasificacion(cuerpo, actor.id);
                case 'corregirOrdenTrabajoImputacion': return this.m5.corregirOrdenTrabajoImputacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'solicitarReasignacionCosto': return this.m5.solicitarReasignacionCosto((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'listarReasignacionesCosto': return this.m5.listarReasignacionesCosto();
                case 'aprobarReasignacionCosto': return this.m5.resolverReasignacionCosto((0, solicitudes_1.identificador)(parametros.id), true, cuerpo, actor.id);
                case 'rechazarReasignacionCosto': return this.m5.resolverReasignacionCosto((0, solicitudes_1.identificador)(parametros.id), false, cuerpo, actor.id);
                case 'registrarComisionBancaria': return this.m5.registrarComisionBancaria((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'listarEnviosImportaciones': return this.m5.listarEnviosImportaciones();
                case 'obtenerEnvioImportacion': return this.m5.obtenerEnvioImportacion((0, solicitudes_1.identificador)(parametros.id));
                case 'crearEnvioImportacion': return this.m5.crearEnvioImportacion(cuerpo, actor.id);
                case 'asociarOrdenEnvio': return this.m5.asociarOrdenEnvio((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'registrarCostoEnvio': return this.m5.registrarCostoEnvio((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'actualizarCostoEnvio': return this.m5.actualizarCostoEnvio((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.costoId), cuerpo, actor.id);
                case 'pasarEnvioRevision': return this.m5.pasarEnvioRevision((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'cerrarFinancieramenteEnvio': return this.m5.cerrarFinancieramenteEnvio((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'reabrirEnvio': return this.m5.reabrirEnvio((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'consultarCajaChica': return this.m5.consultarCajaChica(solicitud.consulta || {});
                case 'obtenerGastoCajaChica': return this.m5.obtenerGastoCajaChica((0, solicitudes_1.identificador)(parametros.gastoId));
                case 'configurarFondoCajaChica': return this.m5.configurarFondoCajaChica(parametros.periodo, cuerpo, actor.id);
                case 'registrarGastoCajaChica': return this.m5.registrarGastoCajaChica(cuerpo, actor.id);
                case 'adjuntarRespaldoCajaChica': return this.m5.adjuntarRespaldoCajaChica((0, solicitudes_1.identificador)(parametros.gastoId), cuerpo, actor.id);
                case 'aprobarGastoCajaChica': return this.m5.aprobarGastoCajaChica((0, solicitudes_1.identificador)(parametros.gastoId), actor.id, actor.configuracion);
                case 'rechazarGastoCajaChica': return this.m5.rechazarGastoCajaChica((0, solicitudes_1.identificador)(parametros.gastoId), cuerpo, actor.id);
                case 'cerrarSesion': return this.m4.cerrarSesion(actor);
                case 'cambiarClave': return this.m4.cambiarClave(actor, cuerpo);
                case 'usuarios': return this.m4.usuarios();
                case 'catalogosUsuarios': return this.m4.catalogosUsuarios();
                case 'registrarUsuario': return this.m4.registrarUsuario(actor, cuerpo);
                case 'guardarPerfilAcceso': return this.m4.guardarPerfilAcceso(actor, cuerpo);
                case 'consultarSesiones': return this.m4.consultarSesiones(actor);
                case 'cerrarSesionAdministrativa': return this.m4.cerrarSesionAdministrativa(actor, cuerpo);
                case 'consultarIntegraciones': return this.m4.consultarIntegraciones();
                case 'guardarBancoCentral': return this.m4.guardarBancoCentral(actor, cuerpo);
                case 'guardarCorreoRecuperacion': return this.m4.guardarCorreoRecuperacion(actor, cuerpo);
                case 'probarBancoCentral': return this.m4.probarBancoCentral();
                case 'probarCorreoRecuperacion': return this.m4.probarCorreoRecuperacion();
                case 'desactivarUsuario':
                case 'reactivarUsuario':
                case 'cambiarConfiguracion':
                case 'asignarPermisos':
                case 'retirarPermisos':
                case 'guardarPermisosUsuario':
                case 'asignarAdministrador':
                case 'retirarAdministrador':
                case 'restablecerClave':
                case 'desbloquearUsuario':
                    return this.m4.modificarUsuario(operacion, actor, cuerpo);
                case 'listarClientes': return this.m1.listarClientes((0, solicitudes_1.validarFiltros)(solicitud.consulta || {}));
                case 'abrirFicha': return this.m1.abrirFicha((0, solicitudes_1.texto)(parametros.referencia, 80), solicitud.consulta || {});
                case 'dashboard': {
                    const [clientesActivos, resumen] = await Promise.all([this.m1.contarClientesActivos(), this.m2.consultarResumen()]);
                    return { clientesActivos, ...resumen };
                }
                case 'inventario': return this.m2.listarInventario();
                case 'productos': return this.m2.listarProductos();
                case 'consultarResumenInventario': return this.mInventario.consultarResumen();
                case 'listarMaterialesInventario': return this.mInventario.listarMateriales(solicitud.consulta || {});
                case 'obtenerMaterialInventario': return this.mInventario.obtenerMaterial((0, solicitudes_1.texto)(parametros.sku, 16));
                case 'listarBodegasInventario': return this.mInventario.listarBodegas();
                case 'listarMovimientosInventario': return this.mInventario.listarMovimientos(solicitud.consulta || {});
                case 'listarReservasInventario': return this.mInventario.listarReservas(solicitud.consulta || {});
                case 'listarAlertasInventario': return this.mInventario.listarAlertas(solicitud.consulta || {});
                case 'catalogosOperacionInventario': return this.mInventario.catalogosOperacion();
                case 'registrarEntradaInventario': return this.operacionalInventario.registrarEntrada(cuerpo, actor);
                case 'registrarSalidaInventario': return this.operacionalInventario.registrarSalida(cuerpo, actor);
                case 'crearReservaInventario': return this.operacionalInventario.crearReserva(cuerpo, actor);
                case 'liberarReservaInventario': return this.operacionalInventario.liberarReserva(parametros.id, cuerpo, actor);
                case 'ajustarExistenciaInventario': return this.operacionalInventario.ajustarExistencia(cuerpo, actor);
                case 'listarFamiliasProductoComercial': return this.m2.listarFamiliasProductoComercial(solicitud.consulta || {});
                case 'crearFamiliaProductoComercial': return this.m2.crearFamiliaProductoComercial(cuerpo, actor.id);
                case 'actualizarFamiliaProductoComercial': return this.m2.actualizarFamiliaProductoComercial((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'desactivarFamiliaProductoComercial': return this.m2.cambiarEstadoFamiliaProductoComercial((0, solicitudes_1.identificador)(parametros.id), false, cuerpo, actor.id);
                case 'reactivarFamiliaProductoComercial': return this.m2.cambiarEstadoFamiliaProductoComercial((0, solicitudes_1.identificador)(parametros.id), true, cuerpo, actor.id);
                case 'historialFamiliaProductoComercial': return this.m2.historialFamiliaProductoComercial((0, solicitudes_1.identificador)(parametros.id));
                case 'listarProductosComerciales': return this.m2.listarProductosComerciales(solicitud.consulta || {});
                case 'crearProductoComercial': return this.m2.crearProductoComercial(cuerpo, actor.id);
                case 'obtenerProductoComercial': return this.m2.obtenerProductoComercial((0, solicitudes_1.identificador)(parametros.id));
                case 'actualizarProductoComercial': return this.m2.actualizarProductoComercial((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'desactivarProductoComercial': return this.m2.cambiarEstadoProductoComercial((0, solicitudes_1.identificador)(parametros.id), false, cuerpo, actor.id);
                case 'reactivarProductoComercial': return this.m2.cambiarEstadoProductoComercial((0, solicitudes_1.identificador)(parametros.id), true, cuerpo, actor.id);
                case 'vincularProductoComercial': return this.m2.vincularProductoComercial((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'publicarVersionProductoComercial': return this.m2.publicarVersionProductoComercial((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'historialProductoComercial': return this.m2.obtenerProductoComercial((0, solicitudes_1.identificador)(parametros.id), true);
                case 'catalogosVinculacionProductoComercial': return this.m2.catalogosVinculacionProductoComercial();
                case 'listarPreciosComerciales': return this.catalogoComercial.listarPrecios(solicitud.consulta || {});
                case 'estadoDocumentalComercial': return this.documentosComerciales.estadoInfraestructura();
                case 'listarPlantillasDocumentalesComerciales': return this.documentosComerciales.listarPlantillas();
                case 'crearPlantillaDocumentalComercial': return this.documentosComerciales.crearPlantilla(cuerpo, actor);
                case 'editarPlantillaDocumentalComercial': return this.documentosComerciales.editarPlantilla(BigInt((0, solicitudes_1.identificador)(parametros.id)), cuerpo, actor);
                case 'publicarPlantillaDocumentalComercial': return this.documentosComerciales.publicarPlantilla(BigInt((0, solicitudes_1.identificador)(parametros.id)), cuerpo, actor);
                case 'listarCartasComercialesB2C': return this.documentosComerciales.listarCartasB2C();
                case 'crearCartaComercialB2C': return this.documentosComerciales.crearCartaB2C(cuerpo, actor);
                case 'editarCartaComercialB2C': return this.documentosComerciales.editarCartaB2C(BigInt((0, solicitudes_1.identificador)(parametros.id)), cuerpo, actor);
                case 'publicarCartaComercialB2C': return this.documentosComerciales.publicarCartaB2C(BigInt((0, solicitudes_1.identificador)(parametros.id)), cuerpo, actor);
                case 'previsualizarCartaComercialB2C': return this.documentosComerciales.previsualizarCartaB2C(BigInt((0, solicitudes_1.identificador)(parametros.id)));
                case 'descargarCartaComercialB2C': return this.documentosComerciales.recuperarDocumentoCarta(BigInt((0, solicitudes_1.identificador)(parametros.id)), BigInt((0, solicitudes_1.identificador)(parametros.versionId)));
                case 'listarServiciosComerciales': return this.catalogoComercial.listarServicios(solicitud.consulta || {});
                case 'crearServicioComercial': return this.escrituraComercial.ejecutar('CREAR_SERVICIO', cuerpo, actor);
                case 'versionarPrecioServicioComercial': return this.escrituraComercial.ejecutar('VERSIONAR_PRECIO_SERVICIO', { ...cuerpo, idServicio: parametros.id }, actor);
                case 'desactivarServicioComercial': return this.escrituraComercial.ejecutar('DESACTIVAR_SERVICIO', { ...cuerpo, id: parametros.id }, actor);
                case 'crearPrecioComercial': return this.escrituraComercial.ejecutar('CREAR_PRECIO', cuerpo, actor);
                case 'versionarPrecioComercial': return this.escrituraComercial.ejecutar('VERSIONAR_PRECIO', { ...cuerpo, idAnterior: parametros.id }, actor);
                case 'desactivarPrecioComercial': return this.escrituraComercial.ejecutar('DESACTIVAR_PRECIO', { ...cuerpo, id: parametros.id }, actor);
                case 'listarOpcionalesComerciales': return this.catalogoComercial.listarOpcionales(solicitud.consulta || {});
                case 'crearOpcionalComercial': return this.escrituraComercial.ejecutar('CREAR_OPCIONAL', cuerpo, actor);
                case 'actualizarOpcionalComercial': return this.escrituraComercial.ejecutar('EDITAR_OPCIONAL', { ...cuerpo, id: parametros.id }, actor);
                case 'configurarCompatibilidadOpcional': return this.escrituraComercial.ejecutar('MODIFICAR_COMPATIBILIDAD', { ...cuerpo, idOpcional: parametros.id }, actor);
                case 'versionarPrecioOpcional': return this.escrituraComercial.ejecutar('VERSIONAR_PRECIO_OPCIONAL', { ...cuerpo, idOpcional: parametros.id }, actor);
                case 'desactivarOpcionalComercial': return this.escrituraComercial.ejecutar('DESACTIVAR_OPCIONAL', { ...cuerpo, id: parametros.id }, actor);
                case 'listarTarifasInstalacionComercial': return this.catalogoComercial.listarTarifas(solicitud.consulta || {});
                case 'crearTarifaInstalacionComercial': return this.escrituraComercial.ejecutar('CREAR_TARIFA', cuerpo, actor);
                case 'versionarTarifaInstalacionComercial': return this.escrituraComercial.ejecutar('VERSIONAR_TARIFA', { ...cuerpo, idAnterior: parametros.id }, actor);
                case 'registrarExclusionComunal': return this.escrituraComercial.ejecutar('REGISTRAR_EXCLUSION_COMUNAL', cuerpo, actor);
                case 'desactivarTarifaInstalacionComercial': return this.escrituraComercial.ejecutar('DESACTIVAR_TARIFA', { ...cuerpo, id: parametros.id }, actor);
                case 'listarCondicionesComerciales': return this.catalogoComercial.listarCondiciones(solicitud.consulta || {});
                case 'crearCondicionComercial': return this.escrituraComercial.ejecutar('CREAR_CONDICION', cuerpo, actor);
                case 'versionarCondicionComercial': return this.escrituraComercial.ejecutar('VERSIONAR_CONDICION', { ...cuerpo, idCondicion: parametros.id }, actor);
                case 'publicarCondicionComercial': return this.escrituraComercial.ejecutar('PUBLICAR_CONDICION', { ...cuerpo, idVersion: parametros.versionId }, actor);
                case 'desactivarCondicionComercial': return this.escrituraComercial.ejecutar('DESACTIVAR_CONDICION', { ...cuerpo, id: parametros.id }, actor);
                case 'resolverCoberturaInstalacionComercial': return this.catalogoComercial.resolverCobertura(solicitud.consulta || {});
                case 'obtenerResumenComercialProducto': return this.catalogoComercial.resumenProducto((0, solicitudes_1.identificador)(parametros.id), solicitud.consulta || {});
                case 'listarProductosCatalogoCotizacion': return this.catalogoComercial.listarProductosCotizacion(solicitud.consulta || {});
                case 'obtenerFichaProductoCatalogoCotizacion': {
                    const segmento = String(solicitud.consulta?.segmento || '').toUpperCase();
                    if (!['B2B', 'B2C'].includes(segmento))
                        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El segmento B2B o B2C es obligatorio');
                    const idProducto = (0, solicitudes_1.identificador)(parametros.id);
                    const producto = await this.catalogoComercial.obtenerProductoCotizacion(idProducto, solicitud.consulta || {});
                    try {
                        const documental = await this.documentosProducto.listarParaSegmento(idProducto, segmento, actor);
                        return { ...producto, documental };
                    }
                    catch (error) {
                        if (error instanceof tipos_1.ErrorDocumental)
                            throw new ErrorAplicacion_1.ErrorAplicacion(error.estadoHttp, error.message, error.codigo);
                        throw error;
                    }
                }
                case 'consultarDocumentosProducto': try {
                    return await this.documentosProducto.listar((0, solicitudes_1.identificador)(parametros.id), actor);
                }
                catch (error) {
                    if (error instanceof tipos_1.ErrorDocumental)
                        throw new ErrorAplicacion_1.ErrorAplicacion(error.estadoHttp, error.message, error.codigo);
                    throw error;
                }
                case 'consultarVersionesDocumentoProducto': try {
                    return await this.documentosProducto.consultarVersiones((0, solicitudes_1.identificador)(parametros.id), BigInt((0, solicitudes_1.identificador)(parametros.documentoId)), actor);
                }
                catch (error) {
                    if (error instanceof tipos_1.ErrorDocumental)
                        throw new ErrorAplicacion_1.ErrorAplicacion(error.estadoHttp, error.message, error.codigo);
                    throw error;
                }
                case 'consultarCapacidadesDocumentosProducto': return this.documentosProducto.consultarCapacidades((0, solicitudes_1.identificador)(parametros.id), actor);
                case 'crearIntencionDocumentoComercial': try {
                    return await this.documentosProducto.exigirOperacionBinaria((0, solicitudes_1.identificador)(parametros.id), 'CREAR_INTENCION', actor);
                }
                catch (error) {
                    if (error instanceof tipos_1.ErrorDocumental)
                        throw new ErrorAplicacion_1.ErrorAplicacion(error.estadoHttp, error.message, error.codigo);
                    throw error;
                }
                case 'confirmarCargaDocumentoComercial': try {
                    return await this.documentosProducto.exigirOperacionBinaria((0, solicitudes_1.identificador)(parametros.id), 'CONFIRMAR_CARGA', actor);
                }
                catch (error) {
                    if (error instanceof tipos_1.ErrorDocumental)
                        throw new ErrorAplicacion_1.ErrorAplicacion(error.estadoHttp, error.message, error.codigo);
                    throw error;
                }
                case 'reemplazarDocumentoComercial': try {
                    return await this.documentosProducto.exigirOperacionBinaria((0, solicitudes_1.identificador)(parametros.id), 'REEMPLAZAR', actor);
                }
                catch (error) {
                    if (error instanceof tipos_1.ErrorDocumental)
                        throw new ErrorAplicacion_1.ErrorAplicacion(error.estadoHttp, error.message, error.codigo);
                    throw error;
                }
                case 'solicitarVistaPreviaDocumentoComercial': try {
                    return await this.documentosProducto.exigirOperacionBinaria((0, solicitudes_1.identificador)(parametros.id), 'SOLICITAR_VISTA_PREVIA', actor);
                }
                catch (error) {
                    if (error instanceof tipos_1.ErrorDocumental)
                        throw new ErrorAplicacion_1.ErrorAplicacion(error.estadoHttp, error.message, error.codigo);
                    throw error;
                }
                case 'descargarDocumentoComercial': try {
                    return await this.documentosProducto.exigirOperacionBinaria((0, solicitudes_1.identificador)(parametros.id), 'DESCARGAR', actor);
                }
                catch (error) {
                    if (error instanceof tipos_1.ErrorDocumental)
                        throw new ErrorAplicacion_1.ErrorAplicacion(error.estadoHttp, error.message, error.codigo);
                    throw error;
                }
                case 'listarTareasFabricacion': return this.m2.listarTareasFabricacion(solicitud.consulta || {});
                case 'crearTareaFabricacion': return this.m2.crearTareaFabricacion(cuerpo, actor.id);
                case 'actualizarTareaFabricacion': return this.m2.actualizarTareaFabricacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'desactivarTareaFabricacion': return this.m2.cambiarEstadoTareaFabricacion((0, solicitudes_1.identificador)(parametros.id), false, cuerpo, actor.id);
                case 'reactivarTareaFabricacion': return this.m2.cambiarEstadoTareaFabricacion((0, solicitudes_1.identificador)(parametros.id), true, cuerpo, actor.id);
                case 'obtenerPlantillaFabricacionFamilia': return this.m2.obtenerPlantillaFabricacionFamilia((0, solicitudes_1.identificador)(parametros.id));
                case 'historialPlantillaFabricacionFamilia': return this.m2.obtenerPlantillaFabricacionFamilia((0, solicitudes_1.identificador)(parametros.id), true);
                case 'guardarBorradorPlantillaFabricacion': return this.m2.guardarBorradorPlantillaFabricacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'publicarPlantillaFabricacionFamilia': return this.m2.publicarPlantillaFabricacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'monedas': return this.m2.listarMonedas(solicitud.consulta?.borrador ? (0, solicitudes_1.identificador)(solicitud.consulta.borrador) : undefined);
                case 'monedasVentaDirecta': return this.m2.listarMonedasVentaDirecta();
                case 'bandeja': return this.m2.consultarBandeja();
                case 'obtenerBorradorCotizacion': return this.m2.obtenerBorradorCotizacion((0, solicitudes_1.identificador)(parametros.id));
                case 'historial': return this.m2.consultarBandeja(true);
                case 'consolidarB2C': return this.m2.consolidarB2C((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'obtenerPlanificacionAprobacionCotizacion': return this.m2.obtenerPlanificacionAprobacionCotizacion((0, solicitudes_1.identificador)(parametros.id));
                case 'consultarTrazabilidadComercialM11': return this.m2.consultarTrazabilidadComercialM11((0, solicitudes_1.identificador)(parametros.id));
                case 'consultarCadenaDocumentalM11': return this.m2.consultarCadenaDocumentalM11((0, solicitudes_1.identificador)(parametros.id));
                case 'consultarConciliacionDocumentalM11': return this.m2.consultarConciliacionDocumentalM11((0, solicitudes_1.identificador)(parametros.id));
                case 'gestionarCorreccionDocumentalM11': return this.m2.gestionarCorreccionDocumentalM11(cuerpo, actor.id);
                case 'consultarHistorialCorreccionM11': return this.m2.consultarHistorialCorreccionM11((0, solicitudes_1.texto)(parametros.tipo, 20), (0, solicitudes_1.identificador)(parametros.id));
                case 'resolverHallazgoDocumentalM11': return this.m2.resolverHallazgoDocumentalM11((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'aprobarCotizacionB2B': return this.m2.aprobarCotizacionB2B((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'aprobarCotizacion': return cuerpo.folioOrdenCompra ? this.m2.aprobarCotizacionB2B((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id) : this.m2.operacionPendiente(operacion);
                case 'registrarClienteDesdeCotizacion': return this.m2.registrarClienteDesdeCotizacion(cuerpo);
                case 'buscarObrasCotizacion': return this.obrasComerciales.buscar(solicitud.consulta || {});
                case 'registrarObraDesdeCotizacion': return this.obrasComerciales.registrar(cuerpo, actor.id);
                case 'vincularObraCotizacion': return this.obrasComerciales.vincularCotizacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'resolverContextoObraProyectoM12': return this.obrasComerciales.resolverIdentidades(solicitud.consulta || {}, actor);
                case 'consultarAntecedentesObraProyectoM12': return this.obrasComerciales.consultarAntecedentes(solicitud.consulta || {}, actor);
                case 'previsualizarCotizacionPdf': return this.documentosComerciales.previsualizarCotizacion((0, solicitudes_1.identificador)(parametros.id));
                case 'emitirCotizacion': return this.documentosComerciales.emitirCotizacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'historialDocumentalCotizacion': return this.documentosComerciales.historialCotizacion((0, solicitudes_1.identificador)(parametros.id));
                case 'descargarPdfHistoricoCotizacion': return this.documentosComerciales.recuperarDocumentoCotizacion((0, solicitudes_1.identificador)(parametros.id), (0, solicitudes_1.identificador)(parametros.versionId));
                case 'seleccionarAlternativaB2C': return this.m2.seleccionarAlternativaB2C((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'aceptarAlternativaB2C': return this.m2.aceptarAlternativaB2C((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'rechazarAlternativaB2C': return this.m2.rechazarAlternativaB2C((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'reactivarCotizacion': return this.m2.reactivarCotizacion((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'formalizarClienteB2C': return this.m2.formalizarClienteB2C(cuerpo);
                case 'configurarEtapasCobro': return this.m2.configurarEtapasCobro((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'modificarGuia': return this.m2.modificarGuia((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'definirCondicionesCobro': return this.m2.definirCondicionesCobro((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'configurarUmbral': return this.m2.configurarUmbral(cuerpo);
                case 'consultarUmbral': return this.m2.consultarUmbral();
                case 'registrarPago': return this.m3.registrarPago(cuerpo, actor.id.toString());
                case 'tipoCambio': return this.m3.consultarTipoCambio((0, solicitudes_1.texto)(parametros.currency, 10));
                case 'contextoPago': return this.m3.contextoPago((0, solicitudes_1.identificador)(parametros.idFicha));
                case 'anularPago': return this.m3.anularPago((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id.toString());
                case 'revertirPago': return this.m3.revertirPago((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id.toString());
                case 'aplicarSaldoFavor': return this.m3.aplicarSaldoFavor((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id.toString());
                case 'consultarMorosidad': return this.m3.consultarMorosidad((0, solicitudes_1.identificador)(parametros.id));
                case 'generarComprobante': return this.m3.generarComprobante((0, solicitudes_1.identificador)(parametros.id));
                case 'conciliarPago': return this.m3.conciliarPago((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id.toString());
                case 'revertirVenta': return this.m2.enTransaccion(async (tx) => {
                    const reversion = await this.m2.registrarReversion(tx, (0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id.toString());
                    return this.m3.procesarExcedente(tx, reversion.id_nota_venta, reversion.id_reversion_nota_venta, cuerpo);
                });
                case 'guardarCotizacion': return this.m2.guardarCotizacion(cuerpo, actor.id);
                case 'editarCotizacion': return this.m2.editarCotizacion((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor.id);
                case 'crearVentaDirecta': return this.m2.crearVentaDirecta(cuerpo);
                case 'aprobarVenta': return this.m2.confirmarNotaVenta((0, solicitudes_1.identificador)(parametros.id));
                case 'anularVenta': return this.m2.anularVenta((0, solicitudes_1.identificador)(parametros.id), cuerpo);
                case 'registrarDocumento': return this.m2.registrarDocumento(cuerpo);
                case 'descartarBorrador': return this.m2.descartarBorrador((0, solicitudes_1.identificador)(parametros.id));
                case 'consultarPago': return this.m3.consultarPago((0, solicitudes_1.identificador)(parametros.id));
                case 'consultarSaldo': return this.m3.consultarSaldo((0, solicitudes_1.identificador)(parametros.id));
                case 'catalogosPago': return this.m3.consultarCatalogos(solicitud.consulta?.idFicha ? (0, solicitudes_1.identificador)(solicitud.consulta.idFicha) : undefined);
                case 'consultarPanelGeneralM7': return this.m7.consultarPanelGeneral(solicitud.consulta || {}, actor.permisos);
                case 'consultarHistoricoPanelGeneralM7': return this.m7.consultarHistoricoPanelGeneral(solicitud.consulta || {}, actor.permisos);
                case 'consultarCentroAtencionM7': return this.m7.consultarCentroAtencion(solicitud.consulta || {}, actor.permisos);
                case 'consultarCotizacionesPendientesM7': return this.m7.consultarCotizacionesPendientes(solicitud.consulta || {}, actor.permisos);
                case 'consultarContextoClienteM7': return this.m7.consultarContextoCliente((0, solicitudes_1.identificador)(parametros.id), solicitud.consulta || {}, actor.permisos);
                case 'consultarAnalisisVentasM7': return this.m7.consultarAnalisisVentas(solicitud.consulta || {}, actor.permisos);
                case 'consultarVentasAmpliadasM10': return this.m7.consultarAnalisisVentas(solicitud.consulta || {}, actor.permisos);
                case 'consultarCuentasCobrarM7': return this.m7.consultarCuentasCobrar(solicitud.consulta || {}, actor.permisos);
                case 'consultarCuentasPagarM7': return this.m7.consultarCuentasPagar(solicitud.consulta || {}, actor.permisos);
                case 'consultarLiquidezM7': return this.m7.consultarLiquidez(solicitud.consulta || {}, actor.permisos);
                case 'crearCuentaBancariaM7': return this.m7.guardarCuentaBancariaM7(cuerpo, actor.id);
                case 'actualizarCuentaBancariaM7': return this.m7.guardarCuentaBancariaM7(cuerpo, actor.id, (0, solicitudes_1.identificador)(parametros.id));
                case 'crearSaldoInicialBancarioM7': return this.m7.guardarSaldoInicialBancarioM7(cuerpo, actor.id);
                case 'actualizarSaldoInicialBancarioM7': return this.m7.guardarSaldoInicialBancarioM7(cuerpo, actor.id, (0, solicitudes_1.identificador)(parametros.id));
                case 'crearProyeccionM7': return this.m7.guardarProyeccionM7(cuerpo, actor.id);
                case 'actualizarProyeccionM7': return this.m7.guardarProyeccionM7(cuerpo, actor.id, (0, solicitudes_1.identificador)(parametros.id));
                case 'desactivarProyeccionM7': return this.m7.desactivarProyeccionM7((0, solicitudes_1.identificador)(parametros.id), actor.id);
                case 'consultarPresupuestosM10': return this.m7.consultarPresupuestosM10(solicitud.consulta || {});
                case 'crearPresupuestoM10': return this.m7.guardarPresupuestoM10(cuerpo, actor.id);
                case 'revisarPresupuestoM10': return this.m7.guardarPresupuestoM10(cuerpo, actor.id, BigInt((0, solicitudes_1.identificador)(parametros.id)));
                case 'compararPresupuestoRealM10': return this.m7.compararPresupuestoRealM10(BigInt((0, solicitudes_1.identificador)(parametros.id)), solicitud.consulta || {}, actor.permisos);
                case 'compararVersionesPresupuestoM10': return this.m7.compararVersionesPresupuestoM10(BigInt((0, solicitudes_1.identificador)(parametros.id)), solicitud.consulta || {});
                case 'consultarRiesgoDeficitM7': return this.m7.consultarRiesgoDeficit(solicitud.consulta || {}, actor.permisos);
                case 'registrarAjusteLiquidezM7': return this.m7.registrarAjusteLiquidez(cuerpo, { id: actor.id, administrador: actor.administrador });
                case 'consultarCatalogosAjusteLiquidezM7': return this.m7.consultarCatalogosAjusteLiquidez();
                case 'consultarParametrosLiquidezM7': return this.m7.consultarParametrosPorFamiliaM7('UMBRAL_LIQUIDEZ');
                case 'configurarParametroLiquidezM7': return this.m7.configurarUmbralLiquidezM7(cuerpo);
                case 'consultarExposicionProyectosM7': return this.m7.consultarExposicionProyectos(solicitud.consulta || {}, actor.permisos);
                case 'consultarContextoProyectoM7': return this.m7.consultarContextoProyecto((0, solicitudes_1.identificador)(parametros.id), solicitud.consulta || {}, actor.permisos);
                case 'consultarMargenProyectosM7': return this.m7.consultarMargenProyectos(solicitud.consulta || {}, actor.permisos);
                case 'consultarResumenResultadosM7': return this.m7.consultarResumenResultados(solicitud.consulta || {}, actor.permisos);
                case 'consultarSituacionFinancieraM7': return this.m7.consultarSituacionFinanciera(solicitud.consulta || {});
                case 'consultarCostoRemuneracionesM7': return this.m7.consultarCostoRemuneraciones(solicitud.consulta || {});
                case 'consultarOrdenesTrabajoM7': return this.m7.consultarOrdenesTrabajo(solicitud.consulta || {});
                case 'consultarProduccionModelosM7': return this.m7.consultarProduccionModelos(solicitud.consulta || {}, actor.permisos);
                case 'consultarCargaOperacionalM7': return this.m7.consultarCargaOperacional(solicitud.consulta || {});
                case 'consultarInstalacionesM7': return this.m7.consultarInstalaciones(solicitud.consulta || {});
                case 'consultarAtrasosInstalacionesM7': return this.m7.consultarAtrasosInstalaciones(solicitud.consulta || {});
                case 'consultarIncidenciasRetrabajosM7': return this.m7.consultarIncidenciasRetrabajos(solicitud.consulta || {}, actor.permisos);
                case 'consultarExposicionCreditoM7': return this.m7.consultarExposicionCreditoM7(solicitud.consulta || {});
                case 'consultarAlertasCreditoM7': return this.m7.consultarAlertasCreditoM7(solicitud.consulta || {});
                case 'consultarResumenIvaM7': return this.m7.consultarResumenIva(solicitud.consulta || {});
                case 'consultarCostosFabricacionM7': return this.m7.consultarCostosFabricacion(solicitud.consulta || {});
                case 'consultarBloqueosEconomicosM7': return this.m7.consultarBloqueosEconomicosM7(solicitud.consulta || {});
                case 'consultarMargenInstalacionesM7': return this.m7.consultarMargenInstalaciones(solicitud.consulta || {});
                case 'consultarInventarioValorizadoM7': return this.m7.consultarInventarioValorizado(solicitud.consulta || {});
                case 'consultarMaterialesProyectoOtM7': return this.m7.consultarMaterialesProyectoOt(solicitud.consulta || {});
                case 'consultarRiesgoStockM7': return this.m7.consultarRiesgoStock(solicitud.consulta || {});
                case 'consultarRotacionInventarioM7': return this.m7.consultarRotacionInventario(solicitud.consulta || {});
                case 'consultarComprasRecepcionesM7': return this.m7.consultarComprasRecepciones(solicitud.consulta || {}, actor.permisos);
                case 'consultarCostosInstalacionM7': return this.m7.consultarParametrosPorFamiliaM7('COSTO_INSTALACION');
                case 'configurarCostoInstalacionM7': return this.m7.configurarCostoInstalacionM7(cuerpo);
                case 'consultarParametroStockInmovilM7': return this.m7.consultarParametrosPorFamiliaM7('DIAS_STOCK_INMOVIL');
                case 'configurarParametroStockInmovilM7': return this.m7.configurarDiasStockInmovilM7(cuerpo);
                case 'descargarPdfDashboardM7': return this.m7.descargarPdfContextual(cuerpo, actor.permisos);
                case 'descargarExcelDashboardM7': return this.m7.descargarExcelVentas(cuerpo, actor.permisos);
                case 'consultarUmbralMargenM7': return this.m7.consultarConfiguracionUmbralMargen();
                case 'configurarUmbralMargenM7': return this.m7.configurarUmbralMargen(cuerpo);
                case 'listarSolicitudesCreditoM8': return this.m8.listarSolicitudes(solicitud.consulta || {}, actor);
                case 'listarClientesB2BCreditoM8': return this.m8.listarClientesB2B(solicitud.consulta || {}, actor);
                case 'obtenerSolicitudCreditoM8': return this.m8.obtenerSolicitud((0, solicitudes_1.identificador)(parametros.id), actor);
                case 'crearSolicitudInicialM8': return this.m8.crearSolicitud('INICIAL', cuerpo, actor);
                case 'crearSolicitudExcepcionM8': return this.m8.crearSolicitud('EXCEPCION', cuerpo, actor);
                case 'enviarSolicitudCreditoM8': return this.m8.enviarSolicitud((0, solicitudes_1.identificador)(parametros.id), actor);
                case 'cancelarSolicitudCreditoM8': return this.m8.cancelarSolicitud((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'resolverSolicitudInicialM8': return this.m8.resolverSolicitud((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'resolverSolicitudExcepcionM8': return this.m8.resolverSolicitud((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'modificarCupoCreditoM8': return this.m8.modificarCupo((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'suspenderCreditoM8': return this.m8.suspenderCredito((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'reactivarCreditoM8': return this.m8.reactivarCredito((0, solicitudes_1.identificador)(parametros.id), cuerpo, actor);
                case 'configurarLimiteCreditoM8': return this.m8.configurarLimiteGlobal(cuerpo, actor);
                case 'consultarExposicionCreditoM8': return this.m8.consultarExposicion(solicitud.consulta || {});
                case 'consultarSituacionCreditoM8': return this.m8.situacionCliente((0, solicitudes_1.identificador)(parametros.id), actor);
                case 'consultarHistorialCreditoM8': return this.m8.historialCliente((0, solicitudes_1.identificador)(parametros.id), actor);
                case 'exportarCreditoM8': return this.m8.exportar((0, solicitudes_1.texto)(parametros.origen, 30), solicitud.consulta || {}, actor);
                case 'consultarDistribucionCreditoM8': return this.m8.distribucion(actor);
                case 'consultarComposicionCreditoM8': return this.m8.composicionCliente((0, solicitudes_1.identificador)(parametros.id), actor);
                case 'validarFormalizacionCreditoM8': return this.m8.validarFormalizacion(cuerpo, actor);
                case 'consultarAuditoriaM9': return this.m9.consultar(normalizarFiltrosHttpM9(solicitud.consulta), (0, autorizacion_1.scopeM9DesdeActor)(actor));
                case 'obtenerDetalleAuditoriaM9': {
                    const detalle = await this.m9.detalle((0, solicitudes_1.identificador)(parametros.id), (0, autorizacion_1.scopeM9DesdeActor)(actor));
                    const evento = detalle.evento;
                    return { ...detalle, navegacionOwner: (0, autorizacion_1.navegacionOwner)(actor, evento.referencia) };
                }
                case 'exportarAuditoriaM9': return this.m9.exportar((0, solicitudes_1.texto)(parametros.formato, 10).toUpperCase(), normalizarFiltrosHttpM9(solicitud.consulta), (0, autorizacion_1.scopeM9DesdeActor)(actor));
                case 'consultarResumenAuditoriaM9': return this.m9.resumenAnalitico((0, autorizacion_1.scopeM9DesdeActor)(actor));
                default: return this.m2.operacionPendiente(operacion);
            }
        };
        const ejecutarInstrumentado = () => (0, ServicioDemostracion_1.medirEtapa)('CONTROLADOR', `${actor ? 'Controlador' : 'Fachada'} ${operacion}`, async () => {
            (0, ServicioDemostracion_1.emitirEtapa)('REGLAS_NEGOCIO', 'EN_EJECUCION', 'Reglas de negocio');
            const inicio = performance.now();
            try {
                const salida = await ejecutarOwner();
                (0, ServicioDemostracion_1.emitirEtapa)('REGLAS_NEGOCIO', 'CORRECTO', 'Reglas de negocio', { duracionMs: performance.now() - inicio });
                return salida;
            }
            catch (error) {
                (0, ServicioDemostracion_1.emitirEtapa)('REGLAS_NEGOCIO', 'ERROR', 'Reglas de negocio', { duracionMs: performance.now() - inicio, resultado: error instanceof Error ? error.message : 'Error' });
                throw error;
            }
        });
        const auditoriaInterna = new Set(['registrarEntradaInventario', 'registrarSalidaInventario', 'crearReservaInventario', 'liberarReservaInventario', 'ajustarExistenciaInventario']);
        if (auditoriaInterna.has(operacion))
            return ejecutarInstrumentado();
        if (operacion.startsWith('importar') && solicitud.cuerpo?.soloValidar === true)
            return ejecutarInstrumentado();
        const resultado = await this.productorM9.ejecutar(operacion, actor, { parametros: solicitud.parametros, cuerpo: solicitud.cuerpo, idSolicitud: solicitud.idSolicitud, ocurridoEn: solicitud.ocurridoEn }, ejecutarInstrumentado);
        (0, ServicioDemostracion_1.emitirEtapa)('AUDITORIA_M9', 'CORRECTO', 'Auditoría M9', { detalle: 'Productor M9 evaluado; persiste sólo cuando corresponde' });
        return resultado;
    }
}
exports.C_Finanzas = C_Finanzas;
//# sourceMappingURL=C_Finanzas.js.map
