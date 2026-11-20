"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiposImportacionDisponibles = tiposImportacionDisponibles;
exports.generarPlantillaImportacion = generarPlantillaImportacion;
exports.analizarArchivoImportacion = analizarArchivoImportacion;
const exceljs_1 = __importDefault(require("exceljs"));
const ErrorAplicacion_1 = require("../utilidades/ErrorAplicacion");
const definiciones = {
    clientes: {
        tipo: 'clientes', titulo: 'Clientes', archivo: 'plantilla-clientes.xlsx',
        columnas: [
            { clave: 'nombre', cabecera: 'Nombre o razón social *', descripcion: 'Nombre completo para B2C o razón social para B2B.', tipo: 'texto', obligatoria: true, maximo: 150, ejemplo: 'Empresa de ejemplo SpA' },
            { clave: 'tipo', cabecera: 'Tipo de cliente *', descripcion: 'Segmento comercial del cliente.', tipo: 'opcion', obligatoria: true, opciones: ['B2B', 'B2C'], ejemplo: 'B2B' },
            { clave: 'rut', cabecera: 'RUT (obligatorio para B2B)', descripcion: 'RUT chileno válido. En B2C puede quedar vacío para crear un cliente provisional.', tipo: 'texto', maximo: 20, ejemplo: '76.123.456-7' },
            { clave: 'contacto', cabecera: 'Contacto', descripcion: 'Nombre de la persona de contacto.', tipo: 'texto', maximo: 150, ejemplo: 'María Pérez' },
            { clave: 'correo', cabecera: 'Correo', descripcion: 'Correo financiero o de contacto.', tipo: 'texto', maximo: 150, ejemplo: 'contacto@ejemplo.cl' },
            { clave: 'telefono', cabecera: 'Teléfono (obligatorio para B2C)', descripcion: 'Teléfono de contacto. Es obligatorio cuando el tipo de cliente es B2C.', tipo: 'texto', maximo: 30, ejemplo: '+56 9 1234 5678' },
        ],
        claveUnica: fila => String(fila.rut || '').replace(/[.\s-]/g, '').toLowerCase(),
        validarFila: fila => {
            const tipo = String(fila.tipo).toUpperCase();
            const problemas = [];
            if (tipo === 'B2B' && !fila.rut)
                problemas.push('RUT es obligatorio para clientes B2B');
            if (tipo === 'B2C' && !fila.telefono)
                problemas.push('Teléfono es obligatorio para clientes B2C');
            return problemas;
        },
    },
    empleados: {
        tipo: 'empleados', titulo: 'Empleados', archivo: 'plantilla-empleados.xlsx',
        columnas: [
            { clave: 'rut', cabecera: 'RUT *', descripcion: 'RUT chileno válido y no repetido.', tipo: 'texto', obligatoria: true, maximo: 20, ejemplo: '12.345.678-5' },
            { clave: 'nombres', cabecera: 'Nombres *', descripcion: 'Nombres del empleado.', tipo: 'texto', obligatoria: true, maximo: 120, ejemplo: 'Andrea Belén' },
            { clave: 'apellidoPaterno', cabecera: 'Apellido paterno *', descripcion: 'Apellido paterno del empleado.', tipo: 'texto', obligatoria: true, maximo: 80, ejemplo: 'González' },
            { clave: 'apellidoMaterno', cabecera: 'Apellido materno', descripcion: 'Apellido materno del empleado.', tipo: 'texto', maximo: 80, ejemplo: 'Rojas' },
        ],
        claveUnica: fila => String(fila.rut || '').replace(/[.\s-]/g, '').toLowerCase(),
    },
    proveedores: {
        tipo: 'proveedores', titulo: 'Proveedores', archivo: 'plantilla-proveedores.xlsx',
        columnas: [
            { clave: 'idPais', cabecera: 'ID país *', descripcion: 'Identificador numérico del país disponible en el catálogo de proveedores.', tipo: 'numero', obligatoria: true, ejemplo: 1 },
            { clave: 'idTipoIdentificador', cabecera: 'ID tipo identificación *', descripcion: 'Identificador numérico del tipo de identificación fiscal.', tipo: 'numero', obligatoria: true, ejemplo: 1 },
            { clave: 'identificador', cabecera: 'Identificador fiscal *', descripcion: 'RUT u otro identificador fiscal según país y tipo.', tipo: 'texto', obligatoria: true, maximo: 50, ejemplo: '76.123.456-7' },
            { clave: 'razonSocial', cabecera: 'Razón social *', descripcion: 'Nombre legal del proveedor.', tipo: 'texto', obligatoria: true, maximo: 150, ejemplo: 'Proveedor de ejemplo SpA' },
            { clave: 'tipoProveedor', cabecera: 'Tipo de proveedor *', descripcion: 'Clasificación funcional del proveedor.', tipo: 'opcion', obligatoria: true, opciones: ['Insumos/Materiales', 'Servicios', 'Ambos'], ejemplo: 'Ambos' },
            { clave: 'contacto', cabecera: 'Contacto', descripcion: 'Nombre de contacto.', tipo: 'texto', maximo: 150, ejemplo: 'Carlos Soto' },
            { clave: 'correo', cabecera: 'Correo', descripcion: 'Correo de contacto.', tipo: 'texto', maximo: 150, ejemplo: 'proveedor@ejemplo.cl' },
            { clave: 'telefono', cabecera: 'Teléfono', descripcion: 'Teléfono de contacto.', tipo: 'texto', maximo: 30, ejemplo: '+56 2 2345 6789' },
            { clave: 'direccion', cabecera: 'Dirección', descripcion: 'Dirección comercial.', tipo: 'texto', maximo: 500, ejemplo: 'Av. Ejemplo 123, Santiago' },
        ],
        claveUnica: fila => fila.idPais && fila.idTipoIdentificador && fila.identificador
            ? `${fila.idPais}|${fila.idTipoIdentificador}|${String(fila.identificador).trim().toLowerCase()}`
            : '',
        validarFila: fila => {
            const problemas = [];
            if (fila.idPais !== undefined && (!Number.isInteger(fila.idPais) || Number(fila.idPais) <= 0))
                problemas.push('ID país debe ser un entero mayor que cero');
            if (fila.idTipoIdentificador !== undefined && (!Number.isInteger(fila.idTipoIdentificador) || Number(fila.idTipoIdentificador) <= 0))
                problemas.push('ID tipo identificación debe ser un entero mayor que cero');
            return problemas;
        },
    },
    'areas-trabajo': {
        tipo: 'areas-trabajo', titulo: 'Áreas de trabajo', archivo: 'plantilla-areas-trabajo.xlsx',
        columnas: [
            { clave: 'nombre', cabecera: 'Nombre *', descripcion: 'Nombre único del área de trabajo.', tipo: 'texto', obligatoria: true, maximo: 150, ejemplo: 'Armado y soldadura' },
            { clave: 'descripcion', cabecera: 'Descripción', descripcion: 'Descripción breve del propósito del área.', tipo: 'texto', maximo: 150, ejemplo: 'Preparación y armado de estructuras' },
        ],
        claveUnica: fila => String(fila.nombre || '').trim().toLocaleLowerCase('es-CL'),
    },
    'tareas-fabricacion': {
        tipo: 'tareas-fabricacion', titulo: 'Tareas de fabricación', archivo: 'plantilla-tareas-fabricacion.xlsx',
        columnas: [
            { clave: 'nombre', cabecera: 'Nombre de tarea *', descripcion: 'Nombre único de la tarea dentro del área.', tipo: 'texto', obligatoria: true, maximo: 150, ejemplo: 'Cortar plancha exterior' },
            { clave: 'idArea', cabecera: 'ID área *', descripcion: 'ID de un área de trabajo activa.', tipo: 'numero', obligatoria: true, ejemplo: 1 },
            { clave: 'descripcion', cabecera: 'Descripción', descripcion: 'Descripción detallada de la tarea.', tipo: 'texto', maximo: 4000, ejemplo: 'Corte según dimensiones aprobadas' },
            { clave: 'tiempoEstimadoMin', cabecera: 'Tiempo estimado (minutos)', descripcion: 'Número entero mayor que cero.', tipo: 'numero', ejemplo: 45 },
        ],
        claveUnica: fila => fila.idArea && fila.nombre
            ? `${fila.idArea}|${String(fila.nombre).trim().toLocaleLowerCase('es-CL')}`
            : '',
        validarFila: fila => {
            const problemas = [];
            if (fila.idArea !== undefined && (!Number.isInteger(fila.idArea) || Number(fila.idArea) <= 0))
                problemas.push('ID área debe ser un entero mayor que cero');
            if (fila.tiempoEstimadoMin !== undefined && (!Number.isInteger(fila.tiempoEstimadoMin) || Number(fila.tiempoEstimadoMin) <= 0))
                problemas.push('Tiempo estimado debe ser un entero mayor que cero');
            return problemas;
        },
    },
    'categorias-egreso': {
        tipo: 'categorias-egreso', titulo: 'Categorías de egreso', archivo: 'plantilla-categorias-egreso.xlsx',
        columnas: [
            { clave: 'nombre', cabecera: 'Nombre *', descripcion: 'Nombre único de la categoría.', tipo: 'texto', obligatoria: true, maximo: 100, ejemplo: 'Mantención de maquinaria' },
            { clave: 'activo', cabecera: 'Activa', descripcion: 'Indica si la categoría comienza activa. Valores: Sí o No.', tipo: 'booleano', ejemplo: true },
        ],
        claveUnica: fila => String(fila.nombre || '').trim().toLocaleLowerCase('es-CL'),
    },
};
const definicion = (tipo) => {
    if (!(tipo in definiciones))
        throw new ErrorAplicacion_1.ErrorAplicacion(404, 'Tipo de importación no disponible');
    return definiciones[tipo];
};
const textoCelda = (valor) => {
    if (valor === null || valor === undefined)
        return '';
    if (valor instanceof Date)
        return valor.toISOString().slice(0, 10);
    if (typeof valor === 'object') {
        if ('result' in valor)
            return textoCelda(valor.result);
        if ('text' in valor)
            return String(valor.text ?? '').trim();
        if ('richText' in valor)
            return valor.richText.map(item => item.text).join('').trim();
    }
    return String(valor).trim();
};
const convertir = (valor, columna) => {
    const texto = textoCelda(valor);
    if (!texto)
        return undefined;
    if (columna.tipo === 'texto')
        return texto;
    if (columna.tipo === 'numero') {
        const numero = typeof valor === 'number' ? valor : Number(texto.replace(',', '.'));
        return Number.isFinite(numero) ? numero : Symbol.for('INVALIDO');
    }
    if (columna.tipo === 'booleano') {
        const normalizado = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        if (['si', 'true', '1', 'activo', 'activa'].includes(normalizado))
            return true;
        if (['no', 'false', '0', 'inactivo', 'inactiva'].includes(normalizado))
            return false;
        return Symbol.for('INVALIDO');
    }
    const opcion = columna.opciones?.find(item => item.toLocaleLowerCase('es-CL') === texto.toLocaleLowerCase('es-CL'));
    return opcion ?? Symbol.for('INVALIDO');
};
function tiposImportacionDisponibles() {
    return Object.values(definiciones).map(item => ({ tipo: item.tipo, titulo: item.titulo, archivo: item.archivo }));
}
async function generarPlantillaImportacion(tipoEntrada, referencias = []) {
    const config = definicion(tipoEntrada);
    const libro = new exceljs_1.default.Workbook();
    libro.creator = 'Puertas Blindadas';
    libro.created = new Date();
    const hoja = libro.addWorksheet(config.titulo, { views: [{ state: 'frozen', ySplit: 1 }] });
    hoja.columns = config.columnas.map(columna => ({ header: columna.cabecera, key: columna.clave, width: Math.max(18, Math.min(42, columna.cabecera.length + 6)) }));
    const cabecera = hoja.getRow(1);
    cabecera.height = 32;
    cabecera.eachCell((celda, indice) => {
        const columna = config.columnas[indice - 1];
        celda.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: columna.obligatoria ? 'FFC0392B' : 'FF1F2937' } };
        celda.alignment = { vertical: 'middle', wrapText: true };
        celda.note = `${columna.obligatoria ? 'OBLIGATORIO. ' : 'Opcional. '}${columna.descripcion}${columna.opciones ? ` Valores permitidos: ${columna.opciones.join(', ')}.` : ''}`;
    });
    hoja.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: config.columnas.length } };
    for (let fila = 2; fila <= 1001; fila++) {
        for (let indice = 0; indice < config.columnas.length; indice++) {
            const columna = config.columnas[indice];
            const celda = hoja.getCell(fila, indice + 1);
            if (columna.tipo === 'opcion' && columna.opciones)
                celda.dataValidation = { type: 'list', allowBlank: !columna.obligatoria, formulae: [`"${columna.opciones.join(',')}"`], showErrorMessage: true, errorTitle: 'Valor no permitido', error: 'Selecciona un valor de la lista.' };
            if (columna.tipo === 'booleano')
                celda.dataValidation = { type: 'list', allowBlank: true, formulae: ['"Sí,No"'], showErrorMessage: true, errorTitle: 'Valor no permitido', error: 'Selecciona Sí o No.' };
        }
    }
    const instrucciones = libro.addWorksheet('Instrucciones');
    instrucciones.columns = [{ header: 'Campo', key: 'campo', width: 34 }, { header: 'Obligatorio', key: 'obligatorio', width: 16 }, { header: 'Descripción', key: 'descripcion', width: 70 }, { header: 'Ejemplo', key: 'ejemplo', width: 32 }];
    config.columnas.forEach(columna => instrucciones.addRow({ campo: columna.cabecera, obligatorio: columna.obligatoria ? 'Sí' : 'No', descripcion: columna.descripcion, ejemplo: String(columna.ejemplo ?? '') }));
    instrucciones.getRow(1).eachCell(celda => { celda.font = { bold: true, color: { argb: 'FFFFFFFF' } }; celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111827' } }; });
    instrucciones.getColumn(3).alignment = { wrapText: true, vertical: 'top' };
    for (const referencia of referencias) {
        const hojaReferencia = libro.addWorksheet(referencia.nombre.slice(0, 31), { views: [{ state: 'frozen', ySplit: 1 }] });
        hojaReferencia.columns = referencia.columnas.map(columna => ({ header: columna.cabecera, key: columna.clave, width: Math.max(18, columna.cabecera.length + 4) }));
        referencia.filas.forEach(fila => hojaReferencia.addRow(fila));
        hojaReferencia.getRow(1).eachCell(celda => {
            celda.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2563EB' } };
        });
        hojaReferencia.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: referencia.columnas.length } };
    }
    const contenido = await libro.xlsx.writeBuffer();
    return { nombre: config.archivo, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', contenidoBase64: Buffer.from(contenido).toString('base64') };
}
async function analizarArchivoImportacion(tipoEntrada, contenidoBase64) {
    const config = definicion(tipoEntrada);
    if (typeof contenidoBase64 !== 'string' || !contenidoBase64.trim())
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Adjunta un archivo Excel');
    const limpio = contenidoBase64.includes(',') ? contenidoBase64.slice(contenidoBase64.indexOf(',') + 1) : contenidoBase64;
    const datos = Buffer.from(limpio, 'base64');
    if (!datos.length)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El archivo está vacío');
    if (datos.length > 5 * 1024 * 1024)
        throw new ErrorAplicacion_1.ErrorAplicacion(413, 'El archivo supera el máximo de 5 MB');
    const libro = new exceljs_1.default.Workbook();
    const bytes = new Uint8Array(datos.length);
    bytes.set(datos);
    try {
        await libro.xlsx.load(bytes.buffer);
    }
    catch {
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El archivo no es un Excel .xlsx válido');
    }
    const hoja = libro.worksheets[0];
    if (!hoja)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El archivo no contiene hojas');
    const cabeceras = new Map();
    hoja.getRow(1).eachCell((celda, indice) => cabeceras.set(textoCelda(celda.value).toLocaleLowerCase('es-CL'), indice));
    const faltantes = config.columnas.filter(columna => !cabeceras.has(columna.cabecera.toLocaleLowerCase('es-CL')));
    if (faltantes.length)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, `La plantilla no corresponde a ${config.titulo}. Faltan columnas: ${faltantes.map(item => item.cabecera).join(', ')}`);
    const filas = [];
    const errores = [];
    const claves = new Map();
    for (let numero = 2; numero <= hoja.rowCount; numero++) {
        const filaExcel = hoja.getRow(numero);
        const vacia = config.columnas.every(columna => !textoCelda(filaExcel.getCell(cabeceras.get(columna.cabecera.toLocaleLowerCase('es-CL'))).value));
        if (vacia)
            continue;
        if (filas.length >= 1000)
            throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La importación admite como máximo 1.000 filas');
        const fila = {};
        const problemas = [];
        for (const columna of config.columnas) {
            const valor = convertir(filaExcel.getCell(cabeceras.get(columna.cabecera.toLocaleLowerCase('es-CL'))).value, columna);
            if (valor === Symbol.for('INVALIDO')) {
                problemas.push(`${columna.cabecera}: formato o valor no válido`);
                continue;
            }
            if (valor === undefined) {
                if (columna.obligatoria)
                    problemas.push(`${columna.cabecera}: dato obligatorio`);
                continue;
            }
            if (columna.maximo && String(valor).length > columna.maximo)
                problemas.push(`${columna.cabecera}: máximo ${columna.maximo} caracteres`);
            fila[columna.clave] = valor;
        }
        problemas.push(...(config.validarFila?.(fila) || []));
        const clave = config.claveUnica?.(fila);
        if (clave) {
            const anterior = claves.get(clave);
            if (anterior)
                problemas.push(`Registro repetido dentro del archivo (también aparece en fila ${anterior})`);
            else
                claves.set(clave, numero);
        }
        filas.push({ numero, datos: fila });
        if (problemas.length)
            errores.push({ fila: numero, errores: problemas });
    }
    if (!filas.length)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La plantilla no contiene filas para importar');
    return { tipo: config.tipo, titulo: config.titulo, totalFilas: filas.length, filas, errores, filasMuestra: filas.slice(0, 10).map(item => ({ fila: item.numero, ...item.datos })) };
}
//# sourceMappingURL=ServicioImportacionExcel.js.map