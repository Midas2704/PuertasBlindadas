"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.archivoComprobanteAnticipoM6 = exports.archivoPeriodoRemuneracionesM6 = exports.archivoCalculoPreliminarM6 = exports.archivoLiquidacionM6 = exports.presentarTextoM6 = exports.fechaDocumentoM6 = exports.formatoClpM6 = void 0;
const pdf_1 = require("../utilidades/pdf");
const rut_1 = require("../utilidades/rut");
const numero = (valor) => valor === null || valor === undefined ? null : Number(valor);
const formatoClpM6 = (valor) => {
    const monto = numero(valor);
    if (monto === null || !Number.isFinite(monto))
        return 'Pendiente de cálculo';
    const entero = Math.round(Math.abs(monto)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${monto < 0 ? '-' : ''}$${entero}`;
};
exports.formatoClpM6 = formatoClpM6;
const fechaDocumentoM6 = (valor, conHora = false) => {
    if (!valor)
        return 'No disponible';
    const fecha = valor instanceof Date ? valor : new Date(String(valor));
    if (Number.isNaN(fecha.getTime()))
        return 'No disponible';
    const dia = String(fecha.getUTCDate()).padStart(2, '0');
    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
    const anio = fecha.getUTCFullYear();
    if (!conHora)
        return `${dia}-${mes}-${anio}`;
    return `${dia}-${mes}-${anio} ${String(fecha.getUTCHours()).padStart(2, '0')}:${String(fecha.getUTCMinutes()).padStart(2, '0')}`;
};
exports.fechaDocumentoM6 = fechaDocumentoM6;
const fechaGeneracionM6 = (fecha = new Date()) => {
    const partes = new Intl.DateTimeFormat('es-CL', {
        timeZone: 'America/Santiago', day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(fecha);
    const valor = (tipo) => partes.find(parte => parte.type === tipo)?.value || '';
    return `${valor('day')}-${valor('month')}-${valor('year')} ${valor('hour')}:${valor('minute')}`;
};
const periodo = (item) => `${String(item.periodo.mes).padStart(2, '0')}/${item.periodo.anio}`;
const nombreEmpleado = (empleado) => [empleado.nombres, empleado.apellido_paterno, empleado.apellido_materno].filter(Boolean).join(' ');
const humanizar = (valor) => String(valor ?? '').replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase().replace(/^\p{L}/u, letra => letra.toUpperCase());
const presentarTextoM6 = (valor) => {
    const texto = String(valor ?? '').trim().replace(/^(?:DEMO-UI|DEMOUI)[\s_-]+/i, '');
    if (/^sueldo$/i.test(texto))
        return 'Sueldo';
    if (/^deducci[oó]n$/i.test(texto))
        return 'Deducción';
    return texto;
};
exports.presentarTextoM6 = presentarTextoM6;
const esquemaAplicable = (item) => {
    const fin = new Date(item.periodo.fecha_fin).getTime();
    const nombre = (item.empleado.asignaciones_esquema_remuneracional || []).find((asignacion) => asignacion.activa
        && new Date(asignacion.vigencia_desde).getTime() <= fin
        && (!asignacion.vigencia_hasta || new Date(asignacion.vigencia_hasta).getTime() >= new Date(item.periodo.fecha_inicio).getTime()))?.esquema?.nombre;
    return nombre ? (0, exports.presentarTextoM6)(nombre) : null;
};
const clasificarComponentes = (componentes) => {
    const haberes = [], deducciones = [], aportes = [];
    for (const componente of componentes) {
        if (componente.tipo === 'APORTE_EMPLEADOR_AUTOMATICO' || componente.concepto?.naturaleza_concepto === 'aporte_empleador')
            aportes.push(componente);
        else if (componente.tipo === 'DEDUCCION_AUTOMATICA' || componente.tipo === 'DEDUCCION_PREVISIONAL' || componente.tipo === 'IMPUESTO_RENTA' || componente.direccion === 'NEGATIVO' || componente.concepto?.naturaleza_concepto === 'descuento')
            deducciones.push(componente);
        else
            haberes.push(componente);
    }
    return { haberes, deducciones, aportes };
};
const filasComponentes = (componentes) => componentes.map(componente => ({
    concepto: (0, exports.presentarTextoM6)(componente.descripcion || componente.concepto?.nombre_concepto || 'Concepto sin descripción'),
    monto: (0, exports.formatoClpM6)(componente.monto),
}));
const filasComponentesCombinados = (componentes) => [
    ...componentes.haberes.map(item => ({ categoria: 'Haber', ...filasComponentes([item])[0] })),
    ...componentes.deducciones.map(item => ({ categoria: 'Deducción', ...filasComponentes([item])[0] })),
    ...componentes.aportes.map(item => ({ categoria: 'Aporte empleador', ...filasComponentes([item])[0] })),
];
const tablaComponentesCombinados = (filas, titulo = 'Detalle de componentes') => ({
    tipo: 'tabla', titulo,
    columnas: [
        { clave: 'categoria', etiqueta: 'Categoría', ancho: 120 },
        { clave: 'concepto', etiqueta: 'Concepto', ancho: 245 },
        { clave: 'monto', etiqueta: 'Monto', ancho: 146, alinear: 'derecha' },
    ],
    filas,
    nota: filas.length ? 'Los aportes del empleador no disminuyen el líquido del trabajador.' : 'No se registran componentes para este período.',
});
const tablaComponentes = (titulo, componentes, nota) => ({
    tipo: 'tabla', titulo,
    columnas: [
        { clave: 'concepto', etiqueta: 'Concepto', ancho: 365 },
        { clave: 'monto', etiqueta: 'Monto', ancho: 146, alinear: 'derecha' },
    ],
    filas: filasComponentes(componentes),
    nota: componentes.length ? nota : (nota || 'No se registran componentes en esta sección.'),
});
const datosEmpleado = (item) => ({
    tipo: 'tabla', titulo: 'Empleado',
    columnas: [
        { clave: 'dato', etiqueta: 'Dato', ancho: 165 },
        { clave: 'valor', etiqueta: 'Información', ancho: 346 },
    ],
    filas: [
        { dato: 'Nombre completo', valor: nombreEmpleado(item.empleado) },
        { dato: 'RUT', valor: (0, rut_1.normalizarRut)(item.empleado.rut_empleado) || item.empleado.rut_empleado },
        ...(item.empleado.cargo?.nombre_cargo ? [{ dato: 'Cargo', valor: item.empleado.cargo.nombre_cargo }] : []),
        ...(item.empleado.fecha_ingreso ? [{ dato: 'Fecha de ingreso', valor: (0, exports.fechaDocumentoM6)(item.empleado.fecha_ingreso) }] : []),
        ...(esquemaAplicable(item) ? [{ dato: 'Esquema remuneracional', valor: esquemaAplicable(item) }] : []),
    ],
});
const resumenRemuneracion = (item) => ({
    tipo: 'tabla', titulo: 'Resumen',
    columnas: [
        { clave: 'concepto', etiqueta: 'Concepto', ancho: 320 },
        { clave: 'monto', etiqueta: 'Monto', ancho: 191, alinear: 'derecha' },
    ],
    filas: [
        { concepto: 'Total haberes', monto: (0, exports.formatoClpM6)(item.total_haberes) },
        { concepto: 'Total descuentos previsionales', monto: (0, exports.formatoClpM6)(item.total_descuentos_previsionales) },
        { concepto: 'Total impuesto', monto: (0, exports.formatoClpM6)(item.total_impuesto) },
        { concepto: 'Total otras deducciones', monto: (0, exports.formatoClpM6)(item.total_otras_deducciones) },
        { concepto: 'Total deducciones', monto: (0, exports.formatoClpM6)(item.total_deducciones) },
        { concepto: 'Base imponible', monto: (0, exports.formatoClpM6)(item.base_imponible) },
        { concepto: 'Base tributable', monto: (0, exports.formatoClpM6)(item.base_tributable) },
        { concepto: 'Aportes empleador', monto: (0, exports.formatoClpM6)(item.total_aportes_empleador) },
        { concepto: 'Costo empresa', monto: (0, exports.formatoClpM6)(item.costo_empresa) },
    ],
    nota: 'Los aportes del empleador se informan por separado y no reducen el líquido del trabajador.',
});
const basesRemuneracion = (item) => ({
    tipo: 'tabla', titulo: 'Bases y aportes',
    columnas: [{ clave: 'concepto', etiqueta: 'Concepto', ancho: 320 }, { clave: 'monto', etiqueta: 'Monto', ancho: 191, alinear: 'derecha' }],
    filas: [
        { concepto: 'Base imponible', monto: (0, exports.formatoClpM6)(item.base_imponible) },
        { concepto: 'Base tributable', monto: (0, exports.formatoClpM6)(item.base_tributable) },
        { concepto: 'Aportes empleador', monto: (0, exports.formatoClpM6)(item.total_aportes_empleador) },
        { concepto: 'Costo empresa', monto: (0, exports.formatoClpM6)(item.costo_empresa) },
    ],
    nota: 'Los aportes del empleador se informan por separado y no reducen el líquido del trabajador.',
});
const tarjetasTotales = (item, preliminar = false) => ({
    tipo: 'tarjetas', tarjetas: [
        { etiqueta: preliminar ? 'Haberes preliminares' : 'Total haberes', valor: (0, exports.formatoClpM6)(item.total_haberes) },
        { etiqueta: preliminar ? 'Deducciones preliminares' : 'Total deducciones', valor: (0, exports.formatoClpM6)(item.total_deducciones) },
        { etiqueta: preliminar ? 'Líquido preliminar' : 'LÍQUIDO A PAGAR', valor: (0, exports.formatoClpM6)(item.liquido_preliminar), tono: 'rechazado' },
    ],
});
const baseDocumento = (titulo, subtitulo, periodoDocumento, paginas) => ({
    titulo, subtitulo, generado: fechaGeneracionM6(), periodo: periodoDocumento,
    filtros: 'Documento individual', moneda: 'CLP', paginas,
    pie: 'Documento generado por el Sistema Financiero Puertas Blindadas',
});
const archivoLiquidacionM6 = (item) => {
    const historica = item.estado === 'reemplazada';
    const componentes = clasificarComponentes(item.componentes || []);
    const condicion = historica ? 'Documento histórico - reemplazado' : 'Oficial vigente';
    const filas = filasComponentesCombinados(componentes);
    const primeraPagina = filas.length <= 4 ? filas : [];
    const paginas = [{
            titulo: 'Liquidación de Remuneración',
            subtitulo: 'Documento laboral oficial de Puertas Blindadas',
            bloques: [
                { tipo: 'notas', titulo: 'Condición del documento', lineas: [condicion], tono: historica ? 'rechazado' : 'neutro' },
                datosEmpleado(item),
                { tipo: 'notas', lineas: [`Período ${periodo(item)} · Cierre ${(0, exports.fechaDocumentoM6)(item.cerrado_en)} · Referencia REM-${item.id_remuneracion}`] },
                tarjetasTotales(item),
                basesRemuneracion(item),
                ...(primeraPagina.length ? [tablaComponentesCombinados(primeraPagina)] : []),
            ],
        }];
    for (let inicio = primeraPagina.length ? primeraPagina.length : 0; inicio < filas.length; inicio += 18)
        paginas.push({
            titulo: 'Detalle de la liquidación', subtitulo: `${nombreEmpleado(item.empleado)} - Período ${periodo(item)}`,
            bloques: [tablaComponentesCombinados(filas.slice(inicio, inicio + 18), `Componentes ${inicio + 1} a ${Math.min(inicio + 18, filas.length)} de ${filas.length}`)],
        });
    return (0, pdf_1.archivoPdfGerencial)(`liquidacion-${item.periodo.anio}-${String(item.periodo.mes).padStart(2, '0')}-${item.id_remuneracion}${historica ? '-historica' : ''}.pdf`, baseDocumento('Liquidación de Remuneración', 'Puertas Blindadas', periodo(item), paginas));
};
exports.archivoLiquidacionM6 = archivoLiquidacionM6;
const referenciaSecundaria = (item) => item.codigo ? `Referencia técnica: ${item.codigo}` : null;
const mensajesRevision = (items) => items.length ? items.flatMap(item => [humanizar(item.detalle || item.motivo || item.codigo), referenciaSecundaria(item)].filter(Boolean)) : ['No se registran observaciones.'];
const archivoCalculoPreliminarM6 = (item, revision) => {
    const componentes = clasificarComponentes(item.componentes || []);
    const filas = filasComponentesCombinados(componentes);
    const revisionBreve = revision.bloqueos.length + revision.advertencias.length <= 2;
    const paginas = [{
            titulo: 'CÁLCULO PRELIMINAR', subtitulo: 'NO OFICIAL - sujeto a revisión y cierre', bloques: [
                { tipo: 'notas', titulo: 'Documento no oficial', lineas: ['Este cálculo puede cambiar antes del cierre del período.'], tono: 'rechazado' },
                datosEmpleado(item),
                { tipo: 'notas', lineas: [`Período ${periodo(item)} · Referencia preliminar REM-${item.id_remuneracion}`] },
                tarjetasTotales(item, true),
                basesRemuneracion(item),
            ],
        }];
    for (let inicio = 0; inicio < filas.length; inicio += 15)
        paginas.push({
            titulo: 'Componentes preliminares', subtitulo: `${nombreEmpleado(item.empleado)} - Período ${periodo(item)}`,
            bloques: [tablaComponentesCombinados(filas.slice(inicio, inicio + 15), `Componentes ${inicio + 1} a ${Math.min(inicio + 15, filas.length)} de ${filas.length}`)],
        });
    const bloquesRevision = [
        { tipo: 'notas', titulo: 'Bloqueos detectados', lineas: mensajesRevision(revision.bloqueos), tono: revision.bloqueos.length ? 'fallido' : 'neutro' },
        { tipo: 'notas', titulo: 'Advertencias', lineas: mensajesRevision(revision.advertencias), tono: revision.advertencias.length ? 'rechazado' : 'neutro' },
        { tipo: 'notas', lineas: ['Este documento no constituye una liquidación oficial de remuneración.'], tono: 'rechazado' },
    ];
    if (revisionBreve && paginas.length > 1)
        paginas[paginas.length - 1].bloques.push(...bloquesRevision);
    else
        paginas.push({
            titulo: 'Revisión del cálculo', subtitulo: 'Condiciones que deben revisarse antes del cierre', bloques: [
                ...bloquesRevision,
            ],
        });
    return (0, pdf_1.archivoPdfGerencial)(`calculo-preliminar-no-oficial-${item.id_remuneracion}.pdf`, baseDocumento('Cálculo Preliminar', 'Puertas Blindadas - Remuneraciones', periodo(item), paginas));
};
exports.archivoCalculoPreliminarM6 = archivoCalculoPreliminarM6;
const sumaCompleta = (items, clave) => items.every(item => item[clave] !== null && item[clave] !== undefined)
    ? items.reduce((total, item) => total + Number(item[clave]), 0)
    : null;
const archivoPeriodoRemuneracionesM6 = (items, anio, mes) => {
    const etiquetaPeriodo = `${String(mes).padStart(2, '0')}/${anio}`;
    const filas = items.map(item => ({ empleado: nombreEmpleado(item.empleado), rut: (0, rut_1.normalizarRut)(item.empleado.rut_empleado) || item.empleado.rut_empleado, haberes: (0, exports.formatoClpM6)(item.total_haberes), deducciones: (0, exports.formatoClpM6)(item.total_deducciones), liquido: (0, exports.formatoClpM6)(item.liquido_preliminar), estado: 'Oficial vigente' }));
    const paginas = [{
            titulo: 'Informe de Remuneraciones Oficiales', subtitulo: `Período ${etiquetaPeriodo}`, bloques: [
                { tipo: 'tarjetas', tarjetas: [{ etiqueta: 'Remuneraciones', valor: String(items.length) }, { etiqueta: 'Total líquidos pagables', valor: (0, exports.formatoClpM6)(sumaCompleta(items, 'liquido_preliminar')) }, { etiqueta: 'Total haberes', valor: (0, exports.formatoClpM6)(sumaCompleta(items, 'total_haberes')) }, { etiqueta: 'Total deducciones', valor: (0, exports.formatoClpM6)(sumaCompleta(items, 'total_deducciones')) }] },
                { tipo: 'tarjetas', tarjetas: [{ etiqueta: 'Total aportes empleador', valor: (0, exports.formatoClpM6)(sumaCompleta(items, 'total_aportes_empleador')), detalle: 'No reduce el líquido del trabajador' }] },
                { tipo: 'notas', lineas: ['El informe incluye únicamente remuneraciones oficiales vigentes del período y alcance consultados.'] },
            ],
        }];
    const tamanoPagina = 18;
    for (let inicio = 0; inicio < filas.length; inicio += tamanoPagina)
        paginas.push({
            titulo: 'Detalle de remuneraciones', subtitulo: `Período ${etiquetaPeriodo} - ${inicio + 1} a ${Math.min(inicio + tamanoPagina, filas.length)} de ${filas.length}`,
            bloques: [{ tipo: 'tabla', titulo: 'Remuneraciones oficiales', columnas: [
                        { clave: 'empleado', etiqueta: 'Empleado', ancho: 142 }, { clave: 'rut', etiqueta: 'RUT', ancho: 76 },
                        { clave: 'haberes', etiqueta: 'Haberes', ancho: 78, alinear: 'derecha' }, { clave: 'deducciones', etiqueta: 'Deducciones', ancho: 78, alinear: 'derecha' },
                        { clave: 'liquido', etiqueta: 'Líquido', ancho: 78, alinear: 'derecha' }, { clave: 'estado', etiqueta: 'Estado', ancho: 59 },
                    ], filas: filas.slice(inicio, inicio + tamanoPagina) }],
        });
    return (0, pdf_1.archivoPdfGerencial)(`remuneraciones-oficiales-${anio}-${String(mes).padStart(2, '0')}.pdf`, {
        titulo: 'Remuneraciones Oficiales', subtitulo: 'Puertas Blindadas', generado: fechaGeneracionM6(), periodo: etiquetaPeriodo,
        filtros: 'Remuneraciones oficiales vigentes', moneda: 'CLP', paginas, pie: 'Documento generado por el Sistema Financiero Puertas Blindadas',
    });
};
exports.archivoPeriodoRemuneracionesM6 = archivoPeriodoRemuneracionesM6;
const archivoComprobanteAnticipoM6 = (item, pagos) => {
    const filas = pagos.map(pago => {
        const reversiones = (pago.reversiones || []).reduce((suma, reversion) => suma + Number(reversion.monto), 0);
        const neto = pago.estado === 'CONFIRMADO' ? Number(pago.monto) - reversiones : 0;
        return { fecha: (0, exports.fechaDocumentoM6)(pago.confirmado_en || pago.creado_en), monto: (0, exports.formatoClpM6)(pago.monto), estado: humanizar(pago.estado), reversiones: (0, exports.formatoClpM6)(reversiones), neto: (0, exports.formatoClpM6)(neto) };
    });
    const netoTotal = filas.reduce((total, _fila, indice) => {
        const pago = pagos[indice], reversiones = (pago.reversiones || []).reduce((suma, reversion) => suma + Number(reversion.monto), 0);
        return total + (pago.estado === 'CONFIRMADO' ? Number(pago.monto) - reversiones : 0);
    }, 0);
    const paginas = [{
            titulo: 'Comprobante de Anticipo', subtitulo: 'Documento administrativo oficial de Puertas Blindadas', bloques: [
                datosEmpleado({ ...item, empleado: item.empleado, periodo: item.periodo }),
                { tipo: 'tarjetas', tarjetas: [{ etiqueta: 'Período', valor: periodo(item) }, { etiqueta: 'Monto autorizado / valorizado', valor: (0, exports.formatoClpM6)(item.monto_final) }, { etiqueta: 'Monto efectivo pagado vigente', valor: (0, exports.formatoClpM6)(netoTotal), tono: netoTotal > 0 ? 'rechazado' : 'neutro' }] },
                { tipo: 'tabla', titulo: 'Pagos y reversiones', columnas: [
                        { clave: 'fecha', etiqueta: 'Fecha', ancho: 76 }, { clave: 'monto', etiqueta: 'Monto', ancho: 92, alinear: 'derecha' }, { clave: 'estado', etiqueta: 'Estado', ancho: 90 },
                        { clave: 'reversiones', etiqueta: 'Reversiones', ancho: 110, alinear: 'derecha' }, { clave: 'neto', etiqueta: 'Neto vigente', ancho: 143, alinear: 'derecha' },
                    ], filas },
                { tipo: 'notas', titulo: 'Estado', lineas: [netoTotal > 0 ? 'Con pago efectivo' : 'Sin saldo pagado vigente'] },
                { tipo: 'notas', lineas: [`Referencia documental: ANT-${item.id_anticipo}`], tono: 'neutro' },
            ],
        }];
    return (0, pdf_1.archivoPdfGerencial)(`comprobante-anticipo-${item.id_anticipo}.pdf`, baseDocumento('Comprobante de Anticipo', 'Puertas Blindadas', periodo(item), paginas));
};
exports.archivoComprobanteAnticipoM6 = archivoComprobanteAnticipoM6;
//# sourceMappingURL=documentosRemuneracionPdf.js.map