"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATALOGO_MINIMO = exports.BASE_OPERATIVA_AUTORIZADA = exports.PREFIJO_SEED_MINIMA = exports.CODIGO_MANIFIESTO_DEMO = void 0;
exports.validarDefinicionCatalogoMinimo = validarDefinicionCatalogoMinimo;
exports.prioridadesDesdeAuditoria = prioridadesDesdeAuditoria;
exports.auditarSeedMinima = auditarSeedMinima;
exports.aplicarSeedMinima = aplicarSeedMinima;
exports.verificarSeedMinima = verificarSeedMinima;
exports.ejecutarSeedMinima = ejecutarSeedMinima;
const client_1 = require("@prisma/client");
const ServicioCatalogoComercial_1 = require("../comercial/ServicioCatalogoComercial");
exports.CODIGO_MANIFIESTO_DEMO = 'DEMO_UI_MANIFIESTO_V2';
exports.PREFIJO_SEED_MINIMA = 'DEMO-CAT-';
exports.BASE_OPERATIVA_AUTORIZADA = 'pblindadas_finanzas';
const VIGENCIA_DESDE = new Date('2026-01-01T00:00:00.000Z');
const RESPALDO_ESPERADO = /^pblindadas_antes_demo36_\d{8}_\d{6}$/;
exports.CATALOGO_MINIMO = Object.freeze({
    familias: [
        { codigo: 'DEMO-CAT-PUERTAS-BLINDADAS', nombre: 'Puertas blindadas demostrativas' },
        { codigo: 'DEMO-CAT-PUERTAS-COMERCIALES', nombre: 'Puertas comerciales demostrativas' },
    ],
    productos: [
        { codigo: 'DEMO-CAT-PB-ESTANDAR', nombre: 'Puerta blindada estándar — demostración', itemExistente: 'DEMO-UI | Puerta blindada residencial estándar', familia: 'DEMO-CAT-PUERTAS-BLINDADAS', descripcionB2b: 'Modelo referencial para cotizaciones empresariales de demostración.', descripcionB2c: 'Modelo referencial para cotizaciones particulares de demostración.', precioB2b: '950000', precioB2c: '1090000' },
        { codigo: 'DEMO-CAT-PB-REFORZADA', nombre: 'Puerta blindada reforzada — demostración', itemExistente: 'DEMO-UI Puerta de seguridad', familia: 'DEMO-CAT-PUERTAS-BLINDADAS', descripcionB2b: 'Configuración reforzada referencial; no constituye especificación técnica oficial.', descripcionB2c: 'Configuración reforzada referencial; requiere validación comercial.', precioB2b: '1320000', precioB2c: '1490000' },
        { codigo: 'DEMO-CAT-PB-PREMIUM', nombre: 'Puerta blindada premium — demostración', itemExistente: 'DEMO-UI | Puerta blindada residencial premium', familia: 'DEMO-CAT-PUERTAS-BLINDADAS', descripcionB2b: 'Alternativa premium referencial para demostrar comparación comercial.', descripcionB2c: 'Alternativa premium referencial para demostrar comparación de modelos.', precioB2b: '1780000', precioB2c: '1990000' },
        { codigo: 'DEMO-CAT-PB-PROYECTO', nombre: 'Puerta de seguridad para proyecto — demostración', itemExistente: 'DEMO-UI | Puerta de seguridad comercial', familia: 'DEMO-CAT-PUERTAS-COMERCIALES', descripcionB2b: 'Modelo referencial para partidas B2B; dimensiones y prestaciones deben confirmarse.', descripcionB2c: 'Modelo referencial disponible para evaluación comercial.', precioB2b: '2100000', precioB2c: '2350000' },
    ],
    opcionales: [
        { codigo: 'DEMO-CAT-CERRADURA', nombre: 'Cerradura adicional — demostración', precioB2b: '165000', precioB2c: '189000' },
        { codigo: 'DEMO-CAT-TERMINACION', nombre: 'Terminación especial — demostración', precioB2b: '120000', precioB2c: '145000' },
        { codigo: 'DEMO-CAT-ACCESORIO', nombre: 'Accesorio de seguridad — demostración', precioB2b: '85000', precioB2c: '99000' },
    ],
    servicios: [
        { codigo: 'DEMO-CAT-DESPACHO', nombre: 'Despacho referencial — demostración', unidad: 'VIAJE', precioB2b: '95000', precioB2c: '109000' },
        { codigo: 'DEMO-CAT-TRANSPORTE', nombre: 'Transporte especial — demostración', unidad: 'VIAJE', precioB2b: '165000', precioB2c: '189000' },
    ],
    condiciones: [
        { codigo: 'DEMO-CAT-COND-B2B', nombre: 'Condiciones B2B demostrativas', segmento: 'B2B' },
        { codigo: 'DEMO-CAT-COND-B2C', nombre: 'Condiciones B2C demostrativas', segmento: 'B2C' },
    ],
    categoriasPago: ['Anticipo', 'Abono parcial', 'Pago final'],
    cuotas: [1, 3, 6, 12],
    inventario: {
        unidades: ['Unidad', 'Metro', 'Kilogramo'],
        categoriasGenerales: ['DEMO-CAT Materiales de fabricación', 'DEMO-CAT Herrajes y accesorios'],
        categoriasFuncionales: ['DEMO-CAT Estructura', 'DEMO-CAT Seguridad', 'DEMO-CAT Terminación'],
    },
});
function sumar(contador, entidad) {
    contador.creados += 1;
    contador.porEntidad[entidad] = (contador.porEntidad[entidad] ?? 0) + 1;
}
const descripcionDemo = 'Dato referencial ficticio creado por la seed mínima operativa. No corresponde a una condición o tarifa oficial de Puertas Blindadas.';
function validarDefinicionCatalogoMinimo() {
    const codigos = [
        ...exports.CATALOGO_MINIMO.familias.map(x => x.codigo),
        ...exports.CATALOGO_MINIMO.productos.map(x => x.codigo),
        ...exports.CATALOGO_MINIMO.opcionales.map(x => x.codigo),
        ...exports.CATALOGO_MINIMO.servicios.map(x => x.codigo),
        ...exports.CATALOGO_MINIMO.condiciones.map(x => x.codigo),
    ];
    if (new Set(codigos).size !== codigos.length)
        throw new Error('La seed mínima contiene códigos duplicados');
    if (codigos.some(codigo => !codigo.startsWith(exports.PREFIJO_SEED_MINIMA)))
        throw new Error('Todo registro comercial debe usar el prefijo DEMO-CAT-');
    if (exports.CATALOGO_MINIMO.productos.some(producto => new client_1.Prisma.Decimal(producto.precioB2b).lte(0) || new client_1.Prisma.Decimal(producto.precioB2c).lte(0)))
        throw new Error('Los precios demostrativos deben ser positivos');
    return true;
}
function prioridadesDesdeAuditoria(catalogos) {
    const total = (nombre) => Number(catalogos[nombre]?.total_registros ?? 0);
    return [
        { modulo: 'M2', catalogo: 'Productos, familias, versiones y precios', estado: total('finanzas.extension_producto_comercial') > 0 && total('finanzas.precio_producto_comercial') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'ALTA' },
        { modulo: 'M2', catalogo: 'Opcionales y compatibilidades', estado: total('finanzas.opcional_comercial') > 0 && total('finanzas.compatibilidad_opcional_producto') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'ALTA' },
        { modulo: 'M2', catalogo: 'Servicios comerciales', estado: total('finanzas.servicio_comercial') > 0 && total('finanzas.precio_servicio_comercial') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'ALTA' },
        { modulo: 'M2', catalogo: 'Condiciones y cobertura', estado: total('finanzas.condicion_comercial') > 0 && total('finanzas.tarifa_instalacion_comercial') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'ALTA' },
        { modulo: 'M3', catalogo: 'Categorías de pago y cuotas', estado: total('finanzas.categoria_pago') >= 3 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'MEDIA' },
        { modulo: 'M5', catalogo: 'Proveedores', estado: total('finanzas.proveedor') > 0 ? 'CONSERVAR' : 'REVISAR_MANUAL', prioridad: 'BAJA' },
        { modulo: 'M6', catalogo: 'Honorarios', estado: total('finanzas.prestador_honorarios') > 0 && total('finanzas.boleta_honorarios') > 0 ? 'CONSERVAR' : 'REVISAR_MANUAL', prioridad: 'BAJA' },
        { modulo: 'M6', catalogo: 'Remuneraciones y parámetros legales', estado: total('finanzas.esquema_remuneracional') > 0 && total('finanzas.parametro_remuneracional') > 0 ? 'CONSERVAR_SIN_MODIFICAR_NORMATIVA' : 'PENDIENTE_FUENTE_OFICIAL', prioridad: 'BAJA' },
        { modulo: 'Inventario', catalogo: 'Materiales y bodegas', estado: total('inventario.material') > 0 && total('inventario.bodega') > 0 ? 'CONSERVAR' : 'REVISAR_MANUAL', prioridad: 'BAJA' },
        { modulo: 'Inventario', catalogo: 'Unidades y categorías', estado: total('inventario.material_unidad_medida') > 0 && total('inventario.material_categoria_general') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'MEDIA' },
    ];
}
async function nombreBase(cliente) {
    const filas = await cliente.$queryRaw(client_1.Prisma.sql `SELECT current_database() AS nombre`);
    return filas[0]?.nombre ?? '';
}
async function conteosProtegidos(cliente) {
    const [cotizaciones, notasVenta, pagos, usuarios, permisos] = await Promise.all([
        cliente.cotizacion.count(), cliente.nota_venta.count(), cliente.pago_cliente.count(), cliente.usuario.count(), cliente.permiso.count(),
    ]);
    return { cotizaciones, notasVenta, pagos, usuarios, permisos };
}
async function estadoMigraciones(cliente) {
    const filas = await cliente.$queryRaw(client_1.Prisma.sql `
    SELECT
      count(*) FILTER (WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL) AS aplicadas,
      count(*) FILTER (WHERE finished_at IS NULL AND rolled_back_at IS NULL) AS fallidas,
      max(migration_name) FILTER (WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL) AS ultima
    FROM finanzas._prisma_migrations
  `);
    const fila = filas[0];
    return { aplicadas: Number(fila?.aplicadas ?? 0), fallidas: Number(fila?.fallidas ?? 0), ultima: fila?.ultima ?? null };
}
async function exigirDestinoSeguro(cliente, entorno) {
    const base = await nombreBase(cliente);
    const baseEsperada = entorno.SEED_MINIMA_OPERATIVA_BASE || exports.BASE_OPERATIVA_AUTORIZADA;
    if (base !== baseEsperada)
        throw new Error(`Base no autorizada: se esperaba ${baseEsperada} y la conexión apunta a ${base}`);
    if (entorno.SEED_MINIMA_OPERATIVA_AUTORIZADA !== 'SI')
        throw new Error('Falta SEED_MINIMA_OPERATIVA_AUTORIZADA=SI');
    if (entorno.NODE_ENV === 'production' && entorno.SEED_MINIMA_OPERATIVA_PRODUCCION !== 'SI')
        throw new Error('En producción se requiere SEED_MINIMA_OPERATIVA_PRODUCCION=SI');
    const respaldo = entorno.SEED_MINIMA_OPERATIVA_RESPALDO_VERIFICADO || '';
    if (!RESPALDO_ESPERADO.test(respaldo))
        throw new Error('Declara un respaldo verificable con SEED_MINIMA_OPERATIVA_RESPALDO_VERIFICADO=pblindadas_antes_demo36_YYYYMMDD_HHMMSS');
    const respaldos = await cliente.$queryRaw(client_1.Prisma.sql `SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname=${respaldo}) AS existe`);
    if (!respaldos[0]?.existe)
        throw new Error(`El respaldo declarado ${respaldo} no existe en PostgreSQL`);
    const manifiesto = await cliente.parametro_remuneracional.findFirst({ where: { codigo: exports.CODIGO_MANIFIESTO_DEMO } });
    if (!manifiesto)
        throw new Error('No existe DEMO_UI_MANIFIESTO_V2; no se acredita la base histórica autorizada');
    let firma;
    try {
        firma = JSON.parse(manifiesto.descripcion || '{}');
    }
    catch {
        throw new Error('El manifiesto DEMO_UI_MANIFIESTO_V2 no contiene una firma JSON válida');
    }
    if (firma.version !== 2 || Number(firma.meses) < 36)
        throw new Error('El manifiesto no acredita el escenario histórico de 36 meses versión 2');
    const raices = await cliente.usuario.count({ where: { administrador_original: true } });
    if (raices !== 1)
        throw new Error(`Se esperaba exactamente una cuenta raíz Midas; se encontraron ${raices}`);
    const migraciones = await estadoMigraciones(cliente);
    if (migraciones.fallidas !== 0 || migraciones.aplicadas < 82)
        throw new Error(`Migraciones inconsistentes: ${migraciones.aplicadas} aplicadas y ${migraciones.fallidas} fallidas`);
    return { base, respaldo, manifiesto: { id: manifiesto.id_parametro_remuneracional, version: firma.version, meses: firma.meses }, migraciones };
}
async function existePrecioProducto(cliente, producto, segmento, moneda) {
    return Boolean(await cliente.precio_producto_comercial.findFirst({ where: { id_extension_producto_comercial: producto, segmento_comercial: segmento, id_moneda: moneda, vigencia_desde: VIGENCIA_DESDE } }));
}
async function construirPlan(cliente) {
    validarDefinicionCatalogoMinimo();
    const acciones = [];
    for (const familia of exports.CATALOGO_MINIMO.familias)
        acciones.push({ modulo: 'M2', entidad: 'familia_producto_comercial', clave: familia.codigo, accion: await cliente.familia_producto_comercial.count({ where: { codigo: familia.codigo } }) ? 'CONSERVAR' : 'CREAR' });
    for (const producto of exports.CATALOGO_MINIMO.productos)
        acciones.push({ modulo: 'M2', entidad: 'extension_producto_comercial', clave: producto.codigo, accion: await cliente.extension_producto_comercial.count({ where: { codigo_comercial: producto.codigo } }) ? 'CONSERVAR' : 'CREAR' });
    for (const opcional of exports.CATALOGO_MINIMO.opcionales)
        acciones.push({ modulo: 'M2', entidad: 'opcional_comercial', clave: opcional.codigo, accion: await cliente.opcional_comercial.count({ where: { codigo: opcional.codigo } }) ? 'CONSERVAR' : 'CREAR' });
    for (const servicio of exports.CATALOGO_MINIMO.servicios)
        acciones.push({ modulo: 'M2', entidad: 'servicio_comercial', clave: servicio.codigo, accion: await cliente.servicio_comercial.count({ where: { codigo: servicio.codigo } }) ? 'CONSERVAR' : 'CREAR' });
    for (const condicion of exports.CATALOGO_MINIMO.condiciones)
        acciones.push({ modulo: 'M2', entidad: 'condicion_comercial', clave: condicion.codigo, accion: await cliente.condicion_comercial.count({ where: { codigo: condicion.codigo } }) ? 'CONSERVAR' : 'CREAR' });
    for (const nombre of exports.CATALOGO_MINIMO.categoriasPago)
        acciones.push({ modulo: 'M3', entidad: 'categoria_pago', clave: nombre, accion: await cliente.categoria_pago.count({ where: { nombre } }) ? 'CONSERVAR' : 'CREAR' });
    for (const cantidad of exports.CATALOGO_MINIMO.cuotas)
        acciones.push({ modulo: 'M3', entidad: 'config_cuotas_tarjeta', clave: String(cantidad), accion: await cliente.config_cuotas_tarjeta.count({ where: { cantidad } }) ? 'CONSERVAR' : 'CREAR' });
    for (const nombre of exports.CATALOGO_MINIMO.inventario.unidades)
        acciones.push({ modulo: 'Inventario', entidad: 'material_unidad_medida', clave: nombre, accion: await cliente.material_unidad_medida.count({ where: { material_unidad_medida_nombre: nombre } }) ? 'CONSERVAR' : 'CREAR' });
    for (const nombre of exports.CATALOGO_MINIMO.inventario.categoriasGenerales)
        acciones.push({ modulo: 'Inventario', entidad: 'material_categoria_general', clave: nombre, accion: await cliente.material_categoria_general.count({ where: { material_categoria_general_nombre: nombre } }) ? 'CONSERVAR' : 'CREAR' });
    for (const nombre of exports.CATALOGO_MINIMO.inventario.categoriasFuncionales)
        acciones.push({ modulo: 'Inventario', entidad: 'material_categoria_funcional', clave: nombre, accion: await cliente.material_categoria_funcional.count({ where: { material_categoria_funcional_nombre: nombre } }) ? 'CONSERVAR' : 'CREAR' });
    acciones.push({ modulo: 'M6', entidad: 'parametros_legales', clave: 'NORMATIVA_CHILENA', accion: 'PENDIENTE_CONFIGURACION', motivo: 'La seed no crea ni actualiza tasas legales, UF, UTM ni tramos tributarios.' });
    acciones.push({ modulo: 'M2', entidad: 'tarifa_instalacion_comercial', clave: 'COBERTURA_EMPRESARIAL', accion: 'PENDIENTE_CONFIGURACION', motivo: 'No se inventa disponibilidad ni precio oficial de instalación; se crea sólo una referencia REQUIERE_EVALUACION.' });
    return acciones;
}
async function aplicarCatalogos(tx, actor) {
    const contador = { creados: 0, porEntidad: {} };
    const moneda = await tx.moneda.findUnique({ where: { codigo_moneda: 'CLP' } });
    if (!moneda || moneda.estado_moneda !== 'activo')
        throw new Error('CLP activo es obligatorio y no será creado o corregido por esta seed');
    const familias = new Map();
    for (const definicion of exports.CATALOGO_MINIMO.familias) {
        let fila = await tx.familia_producto_comercial.findUnique({ where: { codigo: definicion.codigo } });
        if (!fila) {
            fila = await tx.familia_producto_comercial.create({ data: { codigo: definicion.codigo, nombre: definicion.nombre, descripcion: descripcionDemo, creado_por: actor, actualizado_por: actor } });
            sumar(contador, 'familia_producto_comercial');
        }
        familias.set(definicion.codigo, fila.id_familia_producto_comercial);
    }
    const productos = new Map();
    for (const definicion of exports.CATALOGO_MINIMO.productos) {
        let item = await tx.item_comercial.findFirst({ where: { nombre_item: definicion.itemExistente, estado_item: 'activo' } });
        if (!item) {
            item = await tx.item_comercial.create({ data: { nombre_item: `${definicion.codigo} | ${definicion.nombre}`, descripcion_item: descripcionDemo, tipo_item: 'PUERTA', estado_item: 'activo' } });
            sumar(contador, 'item_comercial');
        }
        let producto = await tx.extension_producto_comercial.findUnique({ where: { codigo_comercial: definicion.codigo } });
        if (!producto) {
            producto = await tx.extension_producto_comercial.create({ data: {
                    codigo_comercial: definicion.codigo, nombre_comercial: definicion.nombre, id_familia_producto_comercial: familias.get(definicion.familia),
                    tipo_producto: 'PUERTA', descripcion_general: descripcionDemo, descripcion_b2b: definicion.descripcionB2b, descripcion_b2c: definicion.descripcionB2c,
                    garantia_referencial: 'Pendiente de definición comercial; no se publica una garantía ficticia.', condiciones_particulares: descripcionDemo,
                    caracteristicas_destacadas: ['Producto demostrativo', 'Configuración referencial'], caracteristicas_tecnicas: { estado: 'PENDIENTE_VALIDACION_TECNICA' },
                    estado: 'VINCULADO', id_item_comercial: item.id_item_comercial, numero_version_vigente: 1, creado_por: actor, actualizado_por: actor,
                } });
            sumar(contador, 'extension_producto_comercial');
        }
        productos.set(definicion.codigo, producto.id_extension_producto_comercial);
        if (!await tx.producto_comercial_version.findUnique({ where: { id_extension_producto_comercial_numero_version: { id_extension_producto_comercial: producto.id_extension_producto_comercial, numero_version: 1 } } })) {
            const familia = exports.CATALOGO_MINIMO.familias.find(x => x.codigo === definicion.familia);
            await tx.producto_comercial_version.create({ data: {
                    id_extension_producto_comercial: producto.id_extension_producto_comercial, numero_version: 1, codigo_comercial: definicion.codigo,
                    nombre_comercial: definicion.nombre, id_familia_producto_comercial: familias.get(definicion.familia), codigo_familia: familia.codigo,
                    nombre_familia: familia.nombre, tipo_producto: 'PUERTA', descripcion_general: descripcionDemo, descripcion_b2b: definicion.descripcionB2b,
                    descripcion_b2c: definicion.descripcionB2c, garantia_referencial: 'Pendiente de definición comercial', condiciones_particulares: descripcionDemo,
                    caracteristicas_destacadas: ['Producto demostrativo', 'Configuración referencial'], caracteristicas_tecnicas: { estado: 'PENDIENTE_VALIDACION_TECNICA' },
                    id_item_comercial: item.id_item_comercial, vigencia_desde: VIGENCIA_DESDE, motivo: 'Seed mínima operativa demostrativa', usuario_id_usuario: actor,
                } });
            sumar(contador, 'producto_comercial_version');
        }
        for (const [segmento, monto] of [['B2B', definicion.precioB2b], ['B2C', definicion.precioB2c]])
            if (!await existePrecioProducto(tx, producto.id_extension_producto_comercial, segmento, moneda.id_moneda)) {
                await tx.precio_producto_comercial.create({ data: { id_extension_producto_comercial: producto.id_extension_producto_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, monto: new client_1.Prisma.Decimal(monto), vigencia_desde: VIGENCIA_DESDE, motivo: 'Precio referencial ficticio DEMO-CAT; requiere autorización antes de uso comercial real', creado_por: actor } });
                sumar(contador, 'precio_producto_comercial');
            }
    }
    const opcionales = new Map();
    for (const definicion of exports.CATALOGO_MINIMO.opcionales) {
        let fila = await tx.opcional_comercial.findUnique({ where: { codigo: definicion.codigo } });
        if (!fila) {
            fila = await tx.opcional_comercial.create({ data: { codigo: definicion.codigo, nombre: definicion.nombre, descripcion_b2b: descripcionDemo, descripcion_b2c: descripcionDemo, creado_por: actor } });
            sumar(contador, 'opcional_comercial');
        }
        opcionales.set(definicion.codigo, fila.id_opcional_comercial);
        for (const [segmento, monto] of [['B2B', definicion.precioB2b], ['B2C', definicion.precioB2c]])
            if (!await tx.precio_opcional_comercial.findFirst({ where: { id_opcional_comercial: fila.id_opcional_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, vigencia_desde: VIGENCIA_DESDE } })) {
                await tx.precio_opcional_comercial.create({ data: { id_opcional_comercial: fila.id_opcional_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, monto: new client_1.Prisma.Decimal(monto), vigencia_desde: VIGENCIA_DESDE, motivo: 'Precio referencial ficticio DEMO-CAT', creado_por: actor } });
                sumar(contador, 'precio_opcional_comercial');
            }
    }
    for (const idProducto of productos.values())
        for (const idOpcional of opcionales.values())
            if (!await tx.compatibilidad_opcional_producto.findUnique({ where: { id_extension_producto_comercial_id_opcional_comercial: { id_extension_producto_comercial: idProducto, id_opcional_comercial: idOpcional } } })) {
                await tx.compatibilidad_opcional_producto.create({ data: { id_extension_producto_comercial: idProducto, id_opcional_comercial: idOpcional, habilitado_b2b: true, habilitado_b2c: true, condiciones_compatibilidad: 'Compatibilidad demostrativa; validar técnicamente antes de fabricación.' } });
                sumar(contador, 'compatibilidad_opcional_producto');
            }
    for (const definicion of exports.CATALOGO_MINIMO.servicios) {
        let fila = await tx.servicio_comercial.findUnique({ where: { codigo: definicion.codigo } });
        if (!fila) {
            fila = await tx.servicio_comercial.create({ data: { codigo: definicion.codigo, nombre: definicion.nombre, descripcion: descripcionDemo, unidad_cobro: definicion.unidad, habilitado_b2b: true, habilitado_b2c: true, creado_por: actor } });
            sumar(contador, 'servicio_comercial');
        }
        for (const [segmento, monto] of [['B2B', definicion.precioB2b], ['B2C', definicion.precioB2c]])
            if (!await tx.precio_servicio_comercial.findFirst({ where: { id_servicio_comercial: fila.id_servicio_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, vigencia_desde: VIGENCIA_DESDE } })) {
                await tx.precio_servicio_comercial.create({ data: { id_servicio_comercial: fila.id_servicio_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, monto: new client_1.Prisma.Decimal(monto), vigencia_desde: VIGENCIA_DESDE, motivo: 'Precio referencial ficticio DEMO-CAT', creado_por: actor } });
                sumar(contador, 'precio_servicio_comercial');
            }
    }
    for (const definicion of exports.CATALOGO_MINIMO.condiciones) {
        let condicion = await tx.condicion_comercial.findUnique({ where: { codigo: definicion.codigo } });
        if (!condicion) {
            condicion = await tx.condicion_comercial.create({ data: { codigo: definicion.codigo, nombre: definicion.nombre, segmento: definicion.segmento, creado_por: actor } });
            sumar(contador, 'condicion_comercial');
        }
        if (!await tx.condicion_comercial_version.findUnique({ where: { id_condicion_comercial_numero_version: { id_condicion_comercial: condicion.id_condicion_comercial, numero_version: 1 } } })) {
            await tx.condicion_comercial_version.create({ data: { id_condicion_comercial: condicion.id_condicion_comercial, numero_version: 1, contenido: { titulo: definicion.nombre, advertencia: descripcionDemo, condiciones: ['Vigencia, fabricación, pago, entrega y garantías deben ser confirmados por un usuario autorizado antes de uso real.'] }, vigencia_desde: VIGENCIA_DESDE, estado: 'PUBLICADA', motivo: 'Publicación demostrativa explícita para validar el flujo mínimo', publicado_por: actor, publicado_en: new Date() } });
            sumar(contador, 'condicion_comercial_version');
        }
    }
    if (!await tx.tarifa_instalacion_comercial.findFirst({ where: { alcance_geografico: 'REGION', region_normalizada: 'region metropolitana de santiago', comuna_normalizada: null, vigencia_desde: VIGENCIA_DESDE } })) {
        await tx.tarifa_instalacion_comercial.create({ data: { alcance_geografico: 'REGION', region: 'Región Metropolitana de Santiago', region_normalizada: 'region metropolitana de santiago', estado_cobertura: 'REQUIERE_EVALUACION', vigencia_desde: VIGENCIA_DESDE, condiciones: 'La instalación no tiene precio automático. Requiere evaluación y autorización comercial.', observaciones: descripcionDemo, creado_por: actor } });
        sumar(contador, 'tarifa_instalacion_comercial');
    }
    for (const nombre of exports.CATALOGO_MINIMO.categoriasPago)
        if (!await tx.categoria_pago.findUnique({ where: { nombre } })) {
            await tx.categoria_pago.create({ data: { nombre } });
            sumar(contador, 'categoria_pago');
        }
    for (const cantidad of exports.CATALOGO_MINIMO.cuotas)
        if (!await tx.config_cuotas_tarjeta.findUnique({ where: { cantidad } })) {
            await tx.config_cuotas_tarjeta.create({ data: { cantidad } });
            sumar(contador, 'config_cuotas_tarjeta');
        }
    for (const nombre of exports.CATALOGO_MINIMO.inventario.unidades)
        if (!await tx.material_unidad_medida.findFirst({ where: { material_unidad_medida_nombre: nombre } })) {
            await tx.material_unidad_medida.create({ data: { material_unidad_medida_nombre: nombre } });
            sumar(contador, 'material_unidad_medida');
        }
    for (const nombre of exports.CATALOGO_MINIMO.inventario.categoriasGenerales)
        if (!await tx.material_categoria_general.findFirst({ where: { material_categoria_general_nombre: nombre } })) {
            await tx.material_categoria_general.create({ data: { material_categoria_general_nombre: nombre } });
            sumar(contador, 'material_categoria_general');
        }
    for (const nombre of exports.CATALOGO_MINIMO.inventario.categoriasFuncionales)
        if (!await tx.material_categoria_funcional.findFirst({ where: { material_categoria_funcional_nombre: nombre } })) {
            await tx.material_categoria_funcional.create({ data: { material_categoria_funcional_nombre: nombre } });
            sumar(contador, 'material_categoria_funcional');
        }
    return contador;
}
async function auditarSeedMinima(cliente) {
    const [base, migraciones, protegidos, plan, manifiesto, raiz, productosUtilizablesB2b, productosUtilizablesB2c, honorarios, remuneraciones, proveedores, materiales] = await Promise.all([
        nombreBase(cliente), estadoMigraciones(cliente), conteosProtegidos(cliente), construirPlan(cliente),
        cliente.parametro_remuneracional.findFirst({ where: { codigo: exports.CODIGO_MANIFIESTO_DEMO }, select: { id_parametro_remuneracional: true, descripcion: true, estado: true } }),
        cliente.usuario.count({ where: { administrador_original: true } }),
        new ServicioCatalogoComercial_1.ServicioCatalogoComercial().listarProductosCotizacion({ segmento: 'B2B', moneda: 'CLP' }),
        new ServicioCatalogoComercial_1.ServicioCatalogoComercial().listarProductosCotizacion({ segmento: 'B2C', moneda: 'CLP' }),
        cliente.prestador_honorarios.count(), cliente.esquema_remuneracional.count(), cliente.proveedor.count(), cliente.material.count(),
    ]);
    return {
        modo: 'AUDITORIA_SIN_ESCRITURAS', base, migraciones, protegidos, manifiesto: manifiesto ? { presente: true, id: manifiesto.id_parametro_remuneracional, estado: manifiesto.estado, firmaValida: (() => { try {
                const f = JSON.parse(manifiesto.descripcion || '{}');
                return f.version === 2 && Number(f.meses) >= 36;
            }
            catch {
                return false;
            } })() } : { presente: false }, cuentaRaiz: { cantidad: raiz },
        catalogosActuales: { productosB2bUtilizables: productosUtilizablesB2b.length, productosB2cUtilizables: productosUtilizablesB2c.length, prestadoresHonorarios: honorarios, esquemasRemuneracionales: remuneraciones, proveedores, materiales },
        plan, resumen: { crear: plan.filter(x => x.accion === 'CREAR').length, conservar: plan.filter(x => x.accion === 'CONSERVAR').length, pendientes: plan.filter(x => x.accion === 'PENDIENTE_CONFIGURACION').length },
    };
}
async function aplicarSeedMinima(cliente, entorno = process.env) {
    validarDefinicionCatalogoMinimo();
    const seguridad = await exigirDestinoSeguro(cliente, entorno);
    const antes = await conteosProtegidos(cliente);
    const resultado = await cliente.$transaction(async (tx) => {
        await tx.$queryRaw(client_1.Prisma.sql `SELECT pg_advisory_xact_lock(2704, 20261115)`);
        const actor = await tx.usuario.findFirstOrThrow({ where: { administrador_original: true }, select: { usuario_id_usuario: true } });
        const cambios = await aplicarCatalogos(tx, actor.usuario_id_usuario);
        const durante = await conteosProtegidos(tx);
        if (JSON.stringify(antes) !== JSON.stringify(durante))
            throw new Error('La seed intentó alterar conteos históricos o de seguridad protegidos');
        return cambios;
    }, { isolationLevel: client_1.Prisma.TransactionIsolationLevel.Serializable, timeout: 120000, maxWait: 10000 });
    const despues = await conteosProtegidos(cliente);
    if (JSON.stringify(antes) !== JSON.stringify(despues))
        throw new Error('Los conteos protegidos cambiaron después de la seed');
    return { modo: 'APLICACION_PROTEGIDA', seguridad, antes, despues, ...resultado };
}
async function verificarSeedMinima(cliente) {
    const catalogo = new ServicioCatalogoComercial_1.ServicioCatalogoComercial();
    const [b2b, b2c, serviciosB2b, serviciosB2c, categorias, cuotas] = await Promise.all([
        catalogo.listarProductosCotizacion({ segmento: 'B2B', moneda: 'CLP' }), catalogo.listarProductosCotizacion({ segmento: 'B2C', moneda: 'CLP' }),
        catalogo.listarServicios({ segmento: 'B2B', moneda: 'CLP' }), catalogo.listarServicios({ segmento: 'B2C', moneda: 'CLP' }),
        cliente.categoria_pago.findMany({ where: { nombre: { in: [...exports.CATALOGO_MINIMO.categoriasPago] }, activo: true } }),
        cliente.config_cuotas_tarjeta.findMany({ where: { cantidad: { in: [...exports.CATALOGO_MINIMO.cuotas] }, activo: true } }),
    ]);
    const fallos = [];
    if (b2b.filter(x => x.codigo.startsWith(exports.PREFIJO_SEED_MINIMA)).length !== exports.CATALOGO_MINIMO.productos.length)
        fallos.push('Productos B2B incompletos en el endpoint real');
    if (b2c.filter(x => x.codigo.startsWith(exports.PREFIJO_SEED_MINIMA)).length !== exports.CATALOGO_MINIMO.productos.length)
        fallos.push('Productos B2C incompletos en el endpoint real');
    if (b2b.some(x => x.codigo.startsWith(exports.PREFIJO_SEED_MINIMA) && x.precio.resultado !== 'VIGENTE'))
        fallos.push('Existe un producto B2B sin precio vigente');
    if (b2c.some(x => x.codigo.startsWith(exports.PREFIJO_SEED_MINIMA) && x.precio.resultado !== 'VIGENTE'))
        fallos.push('Existe un producto B2C sin precio vigente');
    if (serviciosB2b.filter(x => x.codigo.startsWith(exports.PREFIJO_SEED_MINIMA) && x.precio.resultado === 'VIGENTE').length !== exports.CATALOGO_MINIMO.servicios.length)
        fallos.push('Servicios B2B incompletos');
    if (serviciosB2c.filter(x => x.codigo.startsWith(exports.PREFIJO_SEED_MINIMA) && x.precio.resultado === 'VIGENTE').length !== exports.CATALOGO_MINIMO.servicios.length)
        fallos.push('Servicios B2C incompletos');
    if (categorias.length !== exports.CATALOGO_MINIMO.categoriasPago.length)
        fallos.push('Categorías de pago incompletas');
    if (cuotas.length !== exports.CATALOGO_MINIMO.cuotas.length)
        fallos.push('Cuotas de tarjeta incompletas');
    if (fallos.length)
        throw new Error(`Verificación de seed mínima fallida:\n- ${fallos.join('\n- ')}`);
    return { estado: 'OK', productosB2b: b2b.length, productosB2c: b2c.length, serviciosB2b: serviciosB2b.length, serviciosB2c: serviciosB2c.length, categoriasPago: categorias.length, cuotas: cuotas.length };
}
async function ejecutarSeedMinima(cliente, modo, entorno = process.env) {
    if (modo === 'audit')
        return auditarSeedMinima(cliente);
    if (modo === 'dry-run')
        return { ...(await auditarSeedMinima(cliente)), modo: 'VISTA_PREVIA_SIN_ESCRITURAS' };
    if (modo === 'apply')
        return aplicarSeedMinima(cliente, entorno);
    if (modo === 'verify')
        return verificarSeedMinima(cliente);
    throw new Error(`Modo no soportado: ${modo}`);
}
//# sourceMappingURL=seedMinimaOperativa.js.map