"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioObraProyectoComercial = exports.claveUbicacionObra = exports.normalizarParteUbicacion = exports.validarCoherenciaContextualM12 = exports.presentarServicioTerrenoContextualM12 = exports.presentarClientesContextualesM12 = exports.alcanceIdentidadM12 = exports.fuenteAutorizadaM12 = exports.presentarContactosContextualesM12 = exports.estadoIdentidadContextualM12 = exports.filtroCotizacionesContextualesM12 = exports.exigirConfirmacionHumanaObraDistintaM12 = exports.resolverEstadoReferenciaM12 = void 0;
exports.formalizarProyectoCotizacion = formalizarProyectoCotizacion;
const client_1 = require("@prisma/client");
const db_1 = require("../db");
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const solicitudes_1 = require("../validaciones/solicitudes");
const resolverEstadoReferenciaM12 = (cantidad, coincidenciasExactas = 0) => {
    if (cantidad <= 0)
        return 'REFERENCIA_NO_ENCONTRADA';
    if (cantidad === 1 && coincidenciasExactas === 1)
        return 'REFERENCIA_CONFIRMADA';
    return 'IDENTIDAD_AMBIGUA';
};
exports.resolverEstadoReferenciaM12 = resolverEstadoReferenciaM12;
const exigirConfirmacionHumanaObraDistintaM12 = (cantidadCandidatas, declaracion) => {
    if (cantidadCandidatas > 0 && declaracion !== 'IDENTIDAD_DISTINTA_REVISADA') {
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Existen Obras candidatas. Confirma expresamente que revisaste las coincidencias y solicitas registrar una identidad distinta');
    }
};
exports.exigirConfirmacionHumanaObraDistintaM12 = exigirConfirmacionHumanaObraDistintaM12;
const filtroCotizacionesContextualesM12 = (entrada) => {
    if (entrada.idCotizacion)
        return { id_cotizacion: entrada.idCotizacion };
    if (entrada.idProyecto)
        return { proyecto_originado: { is: { proyecto_proyecto_id: entrada.idProyecto } } };
    if (entrada.idObra)
        return { id_obra_contexto: entrada.idObra };
    return { id_cotizacion: -1 };
};
exports.filtroCotizacionesContextualesM12 = filtroCotizacionesContextualesM12;
const estadoIdentidadContextualM12 = (entrada) => {
    if (entrada.vinculoAmbiguo)
        return 'IDENTIDAD_AMBIGUA';
    return entrada.obraEncontrada || entrada.proyectosEncontrados > 0 ? 'REFERENCIA_CONFIRMADA' : 'REFERENCIA_NO_ENCONTRADA';
};
exports.estadoIdentidadContextualM12 = estadoIdentidadContextualM12;
const presentarContactosContextualesM12 = (contactos) => contactos.map(contacto => ({
    id: contacto.id_contacto_cotizacion_b2b.toString(), nombre: contacto.nombre, apellido: contacto.apellido,
    cargo: contacto.cargo, correo: contacto.correo, telefono: contacto.telefono, funcion: contacto.tipo_contacto,
    principal: contacto.es_principal, estado: contacto.estado, vigencia: null, vigenciaEstado: 'NO_ACREDITADA',
    procedencia: 'finanzas.contacto_cotizacion_b2b',
}));
exports.presentarContactosContextualesM12 = presentarContactosContextualesM12;
const fuenteAutorizadaM12 = (origen, permisos) => {
    const existentes = {
        M2: ['CU20'], TERRENO: ['CU199'], INVENTARIO: ['CU202', 'CU205', 'CU207', 'CU209'], M3: ['CU49', 'CU55'], M7: ['CU237'],
    };
    return existentes[origen].some(codigo => permisos.includes(codigo));
};
exports.fuenteAutorizadaM12 = fuenteAutorizadaM12;
const alcanceIdentidadM12 = (consulta, actor = {}) => {
    const permisos = actor.permisos ?? [];
    const porCotizacion = Boolean(consulta.idCotizacion) && permisos.includes('CU20');
    const puedeVerProyectos = porCotizacion || permisos.includes('CU199');
    const puedeVerClientes = porCotizacion || (Boolean(consulta.idProyecto) && puedeVerProyectos && permisos.includes('CU09'));
    return {
        puedeVerProyectos,
        puedeVerClientes,
        puedeConsultarM2: porCotizacion || (Boolean(consulta.idProyecto) && puedeVerProyectos && permisos.includes('CU20')),
    };
};
exports.alcanceIdentidadM12 = alcanceIdentidadM12;
const presentarClientesContextualesM12 = (clientes, autorizado) => {
    if (!autorizado)
        return { cliente: null, clientes: [], acceso: 'ACCESO_RESTRINGIDO' };
    const presentados = clientes.map(cliente => ({
        id: cliente.id_cliente_financiero,
        rut: cliente.rut_cliente,
        nombre: cliente.nombre_razon_social_referencia,
        estado: cliente.estado_financiero,
        procedencia: 'finanzas.cliente_financiero',
    }));
    return { cliente: presentados.length === 1 ? presentados[0] : null, clientes: presentados, acceso: 'AUTORIZADO' };
};
exports.presentarClientesContextualesM12 = presentarClientesContextualesM12;
const presentarServicioTerrenoContextualM12 = (servicio, idObra) => ({
    referencia: `SERVICIO_TERRENO:${servicio.servicio_terreno_servicio_terreno_id}`,
    proyecto: null,
    obra: idObra.toString(),
    fecha: servicio.servicio_terreno_fecha_real,
    estado: servicio.servicio_terreno_estado,
    tipo: servicio.servicio_terreno_tipo_servicio,
    atribucion: 'CONTEXTO_OBRA',
    noAtribuibleProyecto: true,
});
exports.presentarServicioTerrenoContextualM12 = presentarServicioTerrenoContextualM12;
/** CUT463: valida referencias ya acreditadas; nunca crea, fusiona ni reasigna entidades. */
const validarCoherenciaContextualM12 = (entrada) => {
    if (entrada.fuenteDisponible === false)
        return { estado: 'FUENTE_NO_DISPONIBLE', compatible: false, motivo: 'La fuente propietaria no está disponible', requiereRevisionHumana: false };
    if (entrada.requiereObra && !entrada.idObra)
        return { estado: 'REFERENCIA_NO_ENCONTRADA', compatible: false, motivo: 'El proceso requiere una Obra acreditada', requiereRevisionHumana: true };
    if (entrada.idProyecto && entrada.proyectoEncontrado === false)
        return { estado: 'REFERENCIA_NO_ENCONTRADA', compatible: false, motivo: 'El Proyecto indicado no existe en la fuente propietaria', requiereRevisionHumana: false };
    if (entrada.idProyecto && entrada.idCotizacion && entrada.idCotizacionOrigenProyecto !== entrada.idCotizacion)
        return { estado: 'IDENTIDAD_AMBIGUA', compatible: false, motivo: 'El Proyecto no pertenece a la Cotización que origina las Órdenes de Trabajo', requiereRevisionHumana: true };
    if (entrada.idProyecto && entrada.idProyectoOrdenTrabajo && entrada.idProyecto !== entrada.idProyectoOrdenTrabajo)
        return { estado: 'IDENTIDAD_AMBIGUA', compatible: false, motivo: 'La Orden de Trabajo pertenece a otro Proyecto', requiereRevisionHumana: true };
    if (entrada.idObra && entrada.idObraProyecto && entrada.idObra !== entrada.idObraProyecto)
        return { estado: 'IDENTIDAD_AMBIGUA', compatible: false, motivo: 'El Proyecto ya está vinculado a otra Obra', requiereRevisionHumana: true };
    return { estado: 'REFERENCIA_CONFIRMADA', compatible: true, motivo: entrada.idObra ? 'Las referencias contextuales son coherentes' : 'El proceso no exige una Obra', requiereRevisionHumana: false };
};
exports.validarCoherenciaContextualM12 = validarCoherenciaContextualM12;
const sinDiacriticos = (valor) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const normalizarParteUbicacion = (valor) => sinDiacriticos(String(valor ?? '').trim().toUpperCase())
    .replace(/[^A-Z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
exports.normalizarParteUbicacion = normalizarParteUbicacion;
const claveUbicacionObra = (entrada) => {
    const partes = [entrada.region, entrada.comuna, entrada.ciudad, entrada.direccion, entrada.edificio, entrada.unidad]
        .map(exports.normalizarParteUbicacion);
    if (!partes[0] || !partes[1] || !partes[3])
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Región, comuna y dirección son obligatorias para identificar una Obra');
    return partes.join('|').slice(0, 700);
};
exports.claveUbicacionObra = claveUbicacionObra;
const presentar = (obra, claveBuscada) => ({
    id: obra.obra_obra_id.toString(), nombre: obra.obra_nombre_obra, referencia: obra.obra_referencia,
    direccion: obra.obra_direccion_obra, region: obra.obra_region, ciudad: obra.obra_ciudad,
    comuna: obra.obra_comuna, edificio: obra.obra_edificio, unidad: obra.obra_unidad,
    estado: obra.obra_estado, revision: obra.revision_comercial,
    coincidencia: claveBuscada && obra.clave_ubicacion_normalizada === claveBuscada ? 'EXACTA' : 'POSIBLE',
});
class ServicioObraProyectoComercial {
    async buscar(consulta) {
        const direccion = (0, solicitudes_1.texto)(consulta.direccion, 500);
        const region = (0, solicitudes_1.texto)(consulta.region, 120);
        const comuna = (0, solicitudes_1.texto)(consulta.comuna, 120);
        const termino = (0, solicitudes_1.texto)(consulta.busqueda, 200);
        if (!direccion && !region && !comuna && !termino)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Indica dirección, región, comuna o texto de búsqueda');
        const obras = await db_1.prisma.obra.findMany({
            where: {
                ...(region ? { obra_region: { contains: region, mode: 'insensitive' } } : {}),
                ...(comuna ? { obra_comuna: { contains: comuna, mode: 'insensitive' } } : {}),
                ...(direccion ? { obra_direccion_obra: { contains: direccion, mode: 'insensitive' } } : {}),
                ...(termino ? { OR: [
                        { obra_nombre_obra: { contains: termino, mode: 'insensitive' } },
                        { obra_referencia: { contains: termino, mode: 'insensitive' } },
                        { obra_direccion_obra: { contains: termino, mode: 'insensitive' } },
                    ] } : {}),
            }, orderBy: [{ obra_estado: 'asc' }, { obra_obra_id: 'desc' }], take: 30,
        });
        let clave;
        try {
            clave = direccion && region && comuna ? (0, exports.claveUbicacionObra)(consulta) : undefined;
        }
        catch {
            clave = undefined;
        }
        const presentadas = obras.map(obra => presentar(obra, clave));
        const exactas = presentadas.filter(obra => obra.coincidencia === 'EXACTA').length;
        return {
            obras: presentadas,
            requiereSeleccionExplicita: (0, exports.resolverEstadoReferenciaM12)(obras.length, exactas) === 'IDENTIDAD_AMBIGUA',
            estadoReferencia: (0, exports.resolverEstadoReferenciaM12)(obras.length, exactas),
            procedencia: 'comun.obra',
        };
    }
    /** CUT462: lectura diferenciada de Cliente, Proyecto y Obra, sin efectos secundarios. */
    async resolverIdentidades(consulta, actor = {}) {
        const idObra = consulta.idObra ? BigInt((0, solicitudes_1.identificador)(consulta.idObra)) : null;
        const idProyecto = consulta.idProyecto ? BigInt((0, solicitudes_1.identificador)(consulta.idProyecto)) : null;
        const idCotizacion = consulta.idCotizacion ? (0, solicitudes_1.identificador)(consulta.idCotizacion) : null;
        if ([idObra, idProyecto, idCotizacion].filter(Boolean).length !== 1)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Indica exactamente una Obra, Proyecto o Cotización');
        try {
            let obraObjetivo = idObra;
            let proyectoObjetivo = idProyecto;
            if (idCotizacion) {
                const cotizacion = await db_1.prisma.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, select: { id_obra_contexto: true, proyecto_originado: { select: { proyecto_proyecto_id: true } } } });
                if (!cotizacion)
                    return { estado: 'REFERENCIA_NO_ENCONTRADA', procedencia: 'finanzas.cotizacion', cliente: null, obra: null, proyectos: [] };
                obraObjetivo = cotizacion.id_obra_contexto;
                proyectoObjetivo = cotizacion.proyecto_originado?.proyecto_proyecto_id ?? null;
                if (!obraObjetivo && !proyectoObjetivo)
                    return { estado: 'REFERENCIA_NO_ENCONTRADA', procedencia: 'finanzas.cotizacion', cliente: null, obra: null, proyectos: [] };
            }
            if (proyectoObjetivo && !obraObjetivo) {
                const vinculos = await db_1.prisma.proyecto_obra.findMany({ where: { id_proyecto: proyectoObjetivo }, select: { id_obra: true, es_principal: true } });
                if (vinculos.length > 1 && !vinculos.some(v => v.es_principal))
                    return { estado: 'IDENTIDAD_AMBIGUA', procedencia: 'comun.proyecto_obra', cliente: null, obra: null, proyectos: [] };
                obraObjetivo = vinculos.find(v => v.es_principal)?.id_obra ?? vinculos[0]?.id_obra ?? null;
            }
            const obra = obraObjetivo ? await db_1.prisma.obra.findUnique({ where: { obra_obra_id: obraObjetivo } }) : null;
            const alcance = (0, exports.alcanceIdentidadM12)(consulta, actor);
            const proyectos = await db_1.prisma.proyecto.findMany({
                where: proyectoObjetivo ? { proyecto_proyecto_id: proyectoObjetivo } : obraObjetivo ? { obras: { some: { id_obra: obraObjetivo } } } : { proyecto_proyecto_id: BigInt(-1) },
                include: {
                    obras: { include: { obra: true } },
                },
                orderBy: { proyecto_proyecto_id: 'asc' },
            });
            const cotizacionesContexto = alcance.puedeVerClientes ? await db_1.prisma.cotizacion.findMany({
                where: (0, exports.filtroCotizacionesContextualesM12)({ idObra: obraObjetivo, idProyecto: proyectoObjetivo, idCotizacion }),
                include: { ficha_cliente: { include: { cliente_financiero: true } } },
                orderBy: { id_cotizacion: 'asc' },
            }) : [];
            const clientes = cotizacionesContexto
                .map(c => c.ficha_cliente.cliente_financiero)
                .filter((cliente, indice, todos) => todos.findIndex(c => c.id_cliente_financiero === cliente.id_cliente_financiero) === indice);
            const clientesPresentados = (0, exports.presentarClientesContextualesM12)(clientes, alcance.puedeVerClientes);
            const estado = (0, exports.estadoIdentidadContextualM12)({ obraEncontrada: Boolean(obra), proyectosEncontrados: proyectos.length, clientesEncontrados: clientes.length });
            return {
                estado,
                alcanceConsulta: idProyecto ? 'PROYECTO' : idCotizacion ? 'COTIZACION' : 'OBRA',
                acceso: {
                    clientes: clientesPresentados.acceso,
                    proyectos: alcance.puedeVerProyectos ? 'AUTORIZADO' : 'ACCESO_RESTRINGIDO',
                },
                procedencia: 'comun.obra + comun.proyecto + finanzas.cotizacion',
                cliente: clientesPresentados.cliente,
                clientes: clientesPresentados.clientes,
                obra: obra ? presentar(obra) : null,
                proyectos: alcance.puedeVerProyectos ? proyectos.map(proyecto => ({
                    id: proyecto.proyecto_proyecto_id.toString(),
                    codigo: proyecto.proyecto_codigo_proyecto,
                    nombre: proyecto.proyecto_nombre_referencia,
                    estadoOperacional: proyecto.proyecto_estado_operacional,
                    estadoProduccion: proyecto.proyecto_estado_produccion,
                    idCotizacionOrigen: proyecto.id_cotizacion_origen,
                    obras: proyecto.obras.map(v => ({ id: v.id_obra.toString(), principal: v.es_principal, origen: v.origen })),
                    procedencia: 'comun.proyecto',
                })) : [],
            };
        }
        catch (error) {
            if (error instanceof ErrorAplicacion_1.ErrorAplicacion)
                throw error;
            return { estado: 'FUENTE_NO_DISPONIBLE', procedencia: 'terreno/finanzas', cliente: null, obra: null, proyectos: [] };
        }
    }
    /** CUT464: compone referencias mínimas desde cada owner; no replica sus históricos. */
    async consultarAntecedentes(consulta, actor = {}) {
        const permisos = actor.permisos ?? [];
        const alcance = (0, exports.alcanceIdentidadM12)(consulta, actor);
        const identidad = await this.resolverIdentidades(consulta, actor);
        if (identidad.estado === 'FUENTE_NO_DISPONIBLE' || identidad.estado === 'REFERENCIA_NO_ENCONTRADA')
            return { identidad, fuentes: [] };
        const idObra = identidad.obra?.id ? BigInt(identidad.obra.id) : null;
        const idsProyecto = identidad.proyectos.map(proyecto => BigInt(proyecto.id));
        const idProyectoConsultado = consulta.idProyecto ? BigInt((0, solicitudes_1.identificador)(consulta.idProyecto)) : null;
        const idCotizacionConsultada = consulta.idCotizacion ? (0, solicitudes_1.identificador)(consulta.idCotizacion) : null;
        const alcanceProyecto = Boolean(idProyectoConsultado);
        const fuente = async (origen, autorizado, consultar) => {
            if (!autorizado)
                return { origen, disponibilidad: 'ACCESO_RESTRINGIDO', alcanceAutorizado: false, antecedentes: [] };
            try {
                const antecedentes = await consultar();
                return { origen, disponibilidad: antecedentes.length ? 'DISPONIBLE' : 'SIN_ANTECEDENTES', alcanceAutorizado: true, antecedentes };
            }
            catch {
                return { origen, disponibilidad: 'FUENTE_NO_DISPONIBLE', alcanceAutorizado: true, antecedentes: [] };
            }
        };
        const [m2, terreno, inventario, m3, m7] = await Promise.all([
            fuente('M2', alcance.puedeConsultarM2, async () => {
                const cotizaciones = await db_1.prisma.cotizacion.findMany({
                    where: (0, exports.filtroCotizacionesContextualesM12)({ idObra, idProyecto: idProyectoConsultado, idCotizacion: idCotizacionConsultada }),
                    select: { id_cotizacion: true, fecha_emision: true, estado_cotizacion: true, proyecto_originado: { select: { proyecto_proyecto_id: true } }, nota_venta: { select: { id_nota_venta: true, fecha_emision: true, estado_nota_venta: true } }, contactos_b2b: { select: { id_contacto_cotizacion_b2b: true, nombre: true, apellido: true, cargo: true, correo: true, telefono: true, tipo_contacto: true, es_principal: true, estado: true } } },
                });
                return cotizaciones.map(c => ({
                    referencia: `COTIZACION:${c.id_cotizacion}`,
                    proyecto: c.proyecto_originado?.proyecto_proyecto_id.toString() ?? null,
                    obra: idObra?.toString() ?? null,
                    fecha: c.fecha_emision,
                    estado: c.estado_cotizacion,
                    notaVenta: c.nota_venta ? { referencia: `NV:${c.nota_venta.id_nota_venta}`, fecha: c.nota_venta.fecha_emision, estado: c.nota_venta.estado_nota_venta } : null,
                    ...(alcanceProyecto && alcance.puedeVerClientes
                        ? { contactos: (0, exports.presentarContactosContextualesM12)(c.contactos_b2b) }
                        : alcanceProyecto ? { contactos: [], contactosAcceso: 'ACCESO_RESTRINGIDO' } : {}),
                }));
            }),
            fuente('TERRENO', (0, exports.fuenteAutorizadaM12)('TERRENO', permisos), async () => idObra ? (await db_1.prisma.servicio_terreno.findMany({ where: { id_obra: idObra }, select: { servicio_terreno_servicio_terreno_id: true, servicio_terreno_tipo_servicio: true, servicio_terreno_fecha_real: true, servicio_terreno_estado: true } })).map(s => (0, exports.presentarServicioTerrenoContextualM12)(s, idObra)) : []),
            fuente('INVENTARIO', (0, exports.fuenteAutorizadaM12)('INVENTARIO', permisos), async () => idsProyecto.length ? (await db_1.prisma.orden_trabajo.findMany({ where: { proyecto_id_proyecto: { in: idsProyecto } }, select: { orden_trabajo_id_orden: true, orden_trabajo_fecha_hora: true, orden_trabajo_estado: true, proyecto_id_proyecto: true } })).map(ot => ({ referencia: `OT:${ot.orden_trabajo_id_orden}`, proyecto: ot.proyecto_id_proyecto?.toString() ?? null, obra: idObra?.toString() ?? null, fecha: ot.orden_trabajo_fecha_hora, estado: ot.orden_trabajo_estado })) : []),
            fuente('M3', (0, exports.fuenteAutorizadaM12)('M3', permisos), async () => idsProyecto.length ? (await db_1.prisma.asignacion_pago_cliente.findMany({ where: { nota_venta: { proyecto_contexto: { is: { proyecto_proyecto_id: { in: idsProyecto } } } } }, select: { id_asignacion_pago_cliente: true, fecha_asignacion: true, id_nota_venta: true, monto_asignado: true, nota_venta: { select: { id_proyecto_contexto: true } } } })).map(p => ({ referencia: `ASIGNACION_PAGO:${p.id_asignacion_pago_cliente}`, proyecto: p.nota_venta.id_proyecto_contexto?.toString() ?? null, obra: idObra?.toString() ?? null, fecha: p.fecha_asignacion, notaVenta: p.id_nota_venta, monto: p.monto_asignado.toString() })) : []),
            fuente('M7', (0, exports.fuenteAutorizadaM12)('M7', permisos), async () => idsProyecto.length ? (await db_1.prisma.proyecto_financiero.findMany({ where: { id_proyecto_terreno: { in: idsProyecto } }, select: { id_proyecto_financiero: true, id_proyecto_terreno: true, estado_financiero_proyecto: true, fecha_inicio_financiera: true } })).map(p => ({ referencia: `PROYECTO_FINANCIERO:${p.id_proyecto_financiero}`, proyecto: p.id_proyecto_terreno?.toString() ?? null, obra: idObra?.toString() ?? null, fecha: p.fecha_inicio_financiera, estado: p.estado_financiero_proyecto })) : []),
        ]);
        const m5 = { origen: 'M5', disponibilidad: 'FUENTE_NO_DISPONIBLE', alcanceAutorizado: false, antecedentes: [], motivo: 'No existe un contrato owner aprobado para consultar costos M5 desde M12' };
        const fuentes = [m2, terreno, inventario, m3, m5, m7];
        const proyectos = identidad.proyectos.map(proyecto => ({
            proyecto,
            antecedentes: fuentes.flatMap(f => f.antecedentes
                .filter((antecedente) => antecedente.proyecto === proyecto.id)
                .map(antecedente => ({ origen: f.origen, ...antecedente }))),
        }));
        const contextoObra = fuentes.flatMap(f => f.antecedentes
            .filter((antecedente) => antecedente.proyecto === null)
            .map(antecedente => ({ origen: f.origen, ...antecedente })));
        return { identidad, fuentes, proyectos, contextoObra };
    }
    async registrar(entrada, actorId) {
        const clave = (0, exports.claveUbicacionObra)(entrada);
        const existente = await db_1.prisma.obra.findUnique({ where: { clave_ubicacion_normalizada: clave } });
        if (existente)
            throw new ErrorAplicacion_1.ErrorAplicacion(409, `Ya existe una Obra con esa ubicación (ID ${existente.obra_obra_id.toString()}); selecciónala explícitamente`);
        const candidatas = await this.buscar(entrada);
        (0, exports.exigirConfirmacionHumanaObraDistintaM12)(candidatas.obras.length, entrada.declaracionRevisionCoincidencias);
        const rut = (0, solicitudes_1.texto)(entrada.rutCliente, 12) || null;
        const cliente = rut ? await db_1.prisma.cliente.findUnique({ where: { cliente_cliente_rut: rut }, select: { cliente_cliente_rut: true } }) : null;
        const obra = await db_1.prisma.obra.create({ data: {
                obra_nombre_obra: (0, solicitudes_1.texto)(entrada.nombre, 200) || (0, solicitudes_1.texto)(entrada.direccion, 500),
                obra_direccion_obra: (0, solicitudes_1.texto)(entrada.direccion, 500), obra_region: (0, solicitudes_1.texto)(entrada.region, 120),
                obra_ciudad: (0, solicitudes_1.texto)(entrada.ciudad, 120) || null, obra_comuna: (0, solicitudes_1.texto)(entrada.comuna, 120),
                obra_edificio: (0, solicitudes_1.texto)(entrada.edificio, 150) || null, obra_unidad: (0, solicitudes_1.texto)(entrada.unidad, 100) || null,
                obra_referencia: (0, solicitudes_1.texto)(entrada.referencia, 200) || null, obra_observaciones: (0, solicitudes_1.texto)(entrada.observaciones, 2000) || null,
                obra_tipo_obra: 'EJECUCION_COMERCIAL', obra_estado: 'activa', obra_fecha_de_creacion: new Date(),
                obra_fecha_de_ultima_edicion: new Date(), clave_ubicacion_normalizada: clave,
                rut_cliente: cliente?.cliente_cliente_rut || null,
            } });
        return Object.assign(presentar(obra, clave), { creadoPor: actorId.toString(), __auditoriaM9: { nuevo: { idObra: obra.obra_obra_id.toString(), claveUbicacion: clave } } });
    }
    async vincularCotizacion(idCotizacion, entrada, actorId) {
        const idObra = BigInt((0, solicitudes_1.identificador)(entrada.idObra));
        const revision = (0, solicitudes_1.identificador)(entrada.revision);
        return db_1.prisma.$transaction(async (tx) => {
            const cotizacion = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: { ficha_cliente: { include: { cliente_financiero: true } }, proyecto_originado: { include: { obras: true } } } });
            if (!cotizacion)
                throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Cotización no encontrada');
            if (cotizacion.estado_cotizacion !== 'borrador')
                throw new ErrorAplicacion_1.ErrorAplicacion(409, 'Sólo un borrador puede cambiar su Obra vinculada');
            if (cotizacion.revision !== revision)
                throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La Cotización fue modificada por otra sesión');
            const motivo = (0, solicitudes_1.texto)(entrada.motivo, 2000);
            if (cotizacion.id_obra_contexto && cotizacion.id_obra_contexto !== idObra && !motivo)
                throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Cambiar la Obra requiere motivo y revisión humana');
            const obra = await tx.obra.findUnique({ where: { obra_obra_id: idObra } });
            if (!obra || ['inactiva', 'cerrada', 'eliminada'].includes(String(obra.obra_estado).toLowerCase()))
                throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La Obra no está disponible para nuevas vinculaciones');
            const obraProyecto = cotizacion.proyecto_originado?.obras.find(vinculo => vinculo.es_principal)?.id_obra ?? null;
            const coherencia = (0, exports.validarCoherenciaContextualM12)({ idObra: idObra.toString(), idObraProyecto: obraProyecto?.toString() ?? null, idProyecto: cotizacion.proyecto_originado?.proyecto_proyecto_id.toString() ?? null });
            if (!coherencia.compatible)
                throw new ErrorAplicacion_1.ErrorAplicacion(409, coherencia.motivo);
            const rutCotizacion = cotizacion.ficha_cliente.cliente_financiero.rut_cliente;
            if (obra.rut_cliente && rutCotizacion && obra.rut_cliente !== rutCotizacion)
                throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La Obra pertenece a otro cliente; requiere revisión explícita');
            const actualizada = await tx.cotizacion.update({ where: { id_cotizacion: idCotizacion }, data: { id_obra_contexto: idObra, revision: { increment: 1 } } });
            return Object.assign({ idCotizacion, idObra: idObra.toString(), revision: actualizada.revision, actor: actorId.toString() }, { __auditoriaM9: { anterior: { idObra: cotizacion.id_obra_contexto?.toString() ?? null }, nuevo: { idObra: idObra.toString(), revision: actualizada.revision, motivo: motivo || null } } });
        }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable });
    }
}
exports.ServicioObraProyectoComercial = ServicioObraProyectoComercial;
async function formalizarProyectoCotizacion(tx, idCotizacion) {
    const cotizacion = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include: { ficha_cliente: { include: { cliente_financiero: true } } } });
    if (!cotizacion)
        throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Cotización no encontrada');
    const existente = await tx.proyecto.findUnique({ where: { id_cotizacion_origen: idCotizacion }, include: { obras: true } });
    if (existente) {
        const obraExistente = existente.obras.find(vinculo => vinculo.es_principal)?.id_obra ?? null;
        const coherencia = (0, exports.validarCoherenciaContextualM12)({ idObra: cotizacion.id_obra_contexto?.toString() ?? null, idObraProyecto: obraExistente?.toString() ?? null, idProyecto: existente.proyecto_proyecto_id.toString() });
        if (!coherencia.compatible)
            throw new ErrorAplicacion_1.ErrorAplicacion(409, coherencia.motivo);
        return existente;
    }
    const coherencia = (0, exports.validarCoherenciaContextualM12)({ requiereObra: false, idObra: cotizacion.id_obra_contexto?.toString() ?? null });
    if (!coherencia.compatible)
        throw new ErrorAplicacion_1.ErrorAplicacion(409, coherencia.motivo);
    const hoy = new Date();
    const rutFinanciero = cotizacion.ficha_cliente.cliente_financiero.rut_cliente || null;
    const clienteTerreno = rutFinanciero
        ? await tx.cliente.findUnique({ where: { cliente_cliente_rut: rutFinanciero }, select: { cliente_cliente_rut: true } })
        : null;
    const proyecto = await tx.proyecto.create({ data: {
            proyecto_codigo_proyecto: `COT-${idCotizacion}`,
            proyecto_nombre_referencia: cotizacion.nombre_proyecto || cotizacion.referencia_comercial || `Pedido Cotización ${idCotizacion}`,
            proyecto_fecha_ingreso: hoy, proyecto_estado_operacional: 'FORMALIZADO', proyecto_estado_produccion: 'PENDIENTE',
            // Finanzas y Terreno mantienen maestros distintos. La relación opcional sólo se
            // persiste cuando el cliente compartido existe; nunca se fabrica una FK por RUT.
            rut_cliente: clienteTerreno?.cliente_cliente_rut ?? null, id_cotizacion_origen: idCotizacion,
        } });
    if (cotizacion.id_obra_contexto)
        await tx.proyecto_obra.create({ data: { id_proyecto: proyecto.proyecto_proyecto_id, id_obra: cotizacion.id_obra_contexto, es_principal: true, origen: 'COTIZACION' } });
    return proyecto;
}
//# sourceMappingURL=ServicioObraProyectoComercial.js.map