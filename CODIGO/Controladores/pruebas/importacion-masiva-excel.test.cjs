const { test } = require('node:test');
const assert = require('node:assert/strict');
const ExcelJS = require('exceljs');
const {
  analizarArchivoImportacion,
  generarPlantillaImportacion,
} = require('../dist/importaciones/ServicioImportacionExcel');

const casos = {
  clientes: ['Empresa Uno SpA', 'B2B', '76.123.456-7', 'Ana', 'ana@ejemplo.cl', '+56911111111'],
  empleados: ['12.345.678-5', 'Andrea', 'González', 'Rojas'],
  proveedores: [1, 1, '76.555.444-3', 'Proveedor Uno SpA', 'Ambos', 'Carlos', 'carlos@ejemplo.cl', '+56222222222', 'Calle Uno 123'],
  'areas-trabajo': ['Soldadura', 'Área de soldadura'],
  'tareas-fabricacion': ['Soldar marco', 1, 'Soldadura del marco', 45],
  'categorias-egreso': ['Mantención', 'Sí'],
};

async function completarPlantilla(tipo, valores) {
  const plantilla = await generarPlantillaImportacion(tipo);
  const libro = new ExcelJS.Workbook();
  await libro.xlsx.load(Buffer.from(plantilla.contenidoBase64, 'base64'));
  libro.worksheets[0].getRow(2).values = valores;
  return Buffer.from(await libro.xlsx.writeBuffer()).toString('base64');
}

test('las plantillas oficiales pueden validarse nuevamente con una fila correcta', async () => {
  for (const [tipo, valores] of Object.entries(casos)) {
    const contenido = await completarPlantilla(tipo, valores);
    const resultado = await analizarArchivoImportacion(tipo, contenido);
    assert.equal(resultado.totalFilas, 1, tipo);
    assert.deepEqual(resultado.errores, [], tipo);
  }
});

test('clientes B2C exige teléfono y detecta duplicados dentro del Excel', async () => {
  const plantilla = await generarPlantillaImportacion('clientes');
  const libro = new ExcelJS.Workbook();
  await libro.xlsx.load(Buffer.from(plantilla.contenidoBase64, 'base64'));
  const hoja = libro.worksheets[0];
  hoja.getRow(2).values = ['Persona sin teléfono', 'B2C', '', '', '', ''];
  hoja.getRow(3).values = ['Empresa repetida', 'B2B', '76.123.456-7', '', '', ''];
  hoja.getRow(4).values = ['Empresa repetida dos', 'B2B', '76.123.456-7', '', '', ''];
  const contenido = Buffer.from(await libro.xlsx.writeBuffer()).toString('base64');
  const resultado = await analizarArchivoImportacion('clientes', contenido);
  assert.match(resultado.errores.find(item => item.fila === 2).errores.join(' '), /Teléfono/);
  assert.match(resultado.errores.find(item => item.fila === 4).errores.join(' '), /repetido/);
});

test('la plantilla admite hojas de referencia para identificadores vigentes', async () => {
  const plantilla = await generarPlantillaImportacion('tareas-fabricacion', [{
    nombre: 'Referencia áreas',
    columnas: [{clave:'id',cabecera:'ID área'}, {clave:'nombre',cabecera:'Área de trabajo'}],
    filas: [{id:'7',nombre:'Soldadura'}],
  }]);
  const libro = new ExcelJS.Workbook();
  await libro.xlsx.load(Buffer.from(plantilla.contenidoBase64, 'base64'));
  const referencia = libro.getWorksheet('Referencia áreas');
  assert.ok(referencia);
  assert.equal(referencia.getCell('A2').text, '7');
  assert.equal(referencia.getCell('B2').text, 'Soldadura');
});
