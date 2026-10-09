import ExcelJS from 'exceljs';

export type TipoInformeVentasExcelM7 = 'VENTAS' | 'COTIZACIONES';

export interface FilaVentaExcelM7 {
  fechaVenta: Date;
  idNotaVenta: number;
  numeroNotaVenta: string;
  idCotizacion: number | null;
  cliente: string;
  rutCliente: string;
  segmento: string;
  producto: string;
  descripcion: string;
  cantidad: number;
  moneda: string;
  ventaNetaOriginalItem: number | null;
  tipoCambioHistorico: number | null;
  ventaNetaClpItem: number | null;
  ventaNetaOriginalNota: number;
  estadoNotaVenta: string;
  idProyecto: number | string | null;
  codigoProyecto: string;
}

export interface FilaCotizacionExcelM7 {
  fechaEmision: Date;
  idCotizacion: number;
  cliente: string;
  rutCliente: string;
  segmento: string;
  producto: string;
  descripcion: string;
  cantidad: number;
  valorUnitario: number | null;
  subtotalDetalle: number;
  moneda: string;
  montoNetoCotizacion: number | null;
  montoIvaCotizacion: number | null;
  montoTotalCotizacion: number | null;
  estadoCotizacion: string;
  fechaVigencia: Date | null;
  convertidaNotaVenta: string;
  idNotaVenta: number | null;
}

export interface EntradaInformeVentasExcelM7 {
  tipo: TipoInformeVentasExcelM7;
  periodo: string;
  segmento: string;
  generadoEn: Date;
  filas: FilaVentaExcelM7[] | FilaCotizacionExcelM7[];
  nombreArchivo: string;
}

interface ColumnaInforme {
  encabezado: string;
  clave: string;
  ancho: number;
  formato?: string;
}

const COLUMNAS_VENTAS: ColumnaInforme[] = [
  { encabezado: 'Fecha venta', clave: 'fechaVenta', ancho: 14, formato: 'dd-mm-yyyy' },
  { encabezado: 'ID nota de venta', clave: 'idNotaVenta', ancho: 17 },
  { encabezado: 'Número nota de venta', clave: 'numeroNotaVenta', ancho: 22 },
  { encabezado: 'ID cotización', clave: 'idCotizacion', ancho: 16 },
  { encabezado: 'Cliente', clave: 'cliente', ancho: 30 },
  { encabezado: 'RUT cliente', clave: 'rutCliente', ancho: 17 },
  { encabezado: 'Segmento', clave: 'segmento', ancho: 14 },
  { encabezado: 'Producto / servicio', clave: 'producto', ancho: 30 },
  { encabezado: 'Descripción', clave: 'descripcion', ancho: 38 },
  { encabezado: 'Cantidad', clave: 'cantidad', ancho: 12, formato: '#,##0.00' },
  { encabezado: 'Moneda', clave: 'moneda', ancho: 11 },
  { encabezado: 'Venta neta original (ítem)', clave: 'ventaNetaOriginalItem', ancho: 25, formato: '#,##0.00' },
  { encabezado: 'Tipo de cambio histórico', clave: 'tipoCambioHistorico', ancho: 24, formato: '#,##0.0000' },
  { encabezado: 'Venta neta CLP (ítem)', clave: 'ventaNetaClpItem', ancho: 23, formato: '#,##0.00' },
  { encabezado: 'Venta neta original (NV)', clave: 'ventaNetaOriginalNota', ancho: 25, formato: '#,##0.00' },
  { encabezado: 'Estado NV', clave: 'estadoNotaVenta', ancho: 18 },
  { encabezado: 'ID proyecto', clave: 'idProyecto', ancho: 15 },
  { encabezado: 'Código proyecto', clave: 'codigoProyecto', ancho: 20 },
];

const COLUMNAS_COTIZACIONES: ColumnaInforme[] = [
  { encabezado: 'Fecha emisión', clave: 'fechaEmision', ancho: 15, formato: 'dd-mm-yyyy' },
  { encabezado: 'ID cotización', clave: 'idCotizacion', ancho: 16 },
  { encabezado: 'Cliente', clave: 'cliente', ancho: 30 },
  { encabezado: 'RUT cliente', clave: 'rutCliente', ancho: 17 },
  { encabezado: 'Segmento', clave: 'segmento', ancho: 14 },
  { encabezado: 'Producto / servicio', clave: 'producto', ancho: 30 },
  { encabezado: 'Descripción', clave: 'descripcion', ancho: 38 },
  { encabezado: 'Cantidad', clave: 'cantidad', ancho: 12, formato: '#,##0.00' },
  { encabezado: 'Valor unitario', clave: 'valorUnitario', ancho: 18, formato: '#,##0.00' },
  { encabezado: 'Subtotal detalle', clave: 'subtotalDetalle', ancho: 19, formato: '#,##0.00' },
  { encabezado: 'Moneda', clave: 'moneda', ancho: 11 },
  { encabezado: 'Monto neto cotización', clave: 'montoNetoCotizacion', ancho: 23, formato: '#,##0.00' },
  { encabezado: 'IVA cotización', clave: 'montoIvaCotizacion', ancho: 18, formato: '#,##0.00' },
  { encabezado: 'Total cotización', clave: 'montoTotalCotizacion', ancho: 20, formato: '#,##0.00' },
  { encabezado: 'Estado cotización', clave: 'estadoCotizacion', ancho: 20 },
  { encabezado: 'Fecha vigencia', clave: 'fechaVigencia', ancho: 15, formato: 'dd-mm-yyyy' },
  { encabezado: 'Convertida a NV', clave: 'convertidaNotaVenta', ancho: 18 },
  { encabezado: 'ID nota de venta', clave: 'idNotaVenta', ancho: 17 },
];

export async function crearInformeVentasExcelM7(entrada: EntradaInformeVentasExcelM7) {
  const columnas = entrada.tipo === 'VENTAS' ? COLUMNAS_VENTAS : COLUMNAS_COTIZACIONES;
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Puertas Blindadas';
  workbook.company = 'Puertas Blindadas';
  workbook.created = entrada.generadoEn;
  workbook.modified = entrada.generadoEn;

  const hoja = workbook.addWorksheet(entrada.tipo === 'VENTAS' ? 'Ventas' : 'Cotizaciones', {
    views: [{ state: 'frozen', ySplit: 6, showGridLines: false }],
  });

  hoja.columns = columnas.map((columna) => ({
    key: columna.clave,
    width: columna.ancho,
    style: columna.formato ? { numFmt: columna.formato } : undefined,
  }));

  const ultimaColumna = columnas.length;
  hoja.mergeCells(1, 1, 1, ultimaColumna);
  hoja.getCell(1, 1).value = `Puertas Blindadas - Detalle de ${entrada.tipo === 'VENTAS' ? 'Ventas' : 'Cotizaciones'}`;
  hoja.getCell(2, 1).value = 'Período';
  hoja.getCell(2, 2).value = entrada.periodo;
  hoja.mergeCells(2, 2, 2, ultimaColumna);
  hoja.getCell(3, 1).value = 'Segmento';
  hoja.getCell(3, 2).value = entrada.segmento;
  hoja.mergeCells(3, 2, 3, ultimaColumna);
  hoja.getCell(4, 1).value = 'Generado en';
  hoja.getCell(4, 2).value = entrada.generadoEn;
  hoja.getCell(4, 2).numFmt = 'dd-mm-yyyy hh:mm';
  hoja.mergeCells(4, 2, 4, ultimaColumna);

  hoja.getRow(1).height = 28;
  hoja.getCell(1, 1).font = { bold: true, size: 16, color: { argb: 'FF000000' } };
  hoja.getCell(1, 1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE0B8' } };
  for (let fila = 2; fila <= 4; fila += 1) {
    hoja.getCell(fila, 1).font = { bold: true, color: { argb: 'FF676767' } };
  }

  const filaEncabezados = hoja.getRow(6);
  filaEncabezados.values = columnas.map((columna) => columna.encabezado);
  filaEncabezados.height = 24;
  filaEncabezados.eachCell((celda) => {
    celda.font = { bold: true, color: { argb: 'FF000000' } };
    celda.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFE8F01' } };
    celda.alignment = { vertical: 'middle', wrapText: true };
    celda.border = { bottom: { style: 'thin', color: { argb: 'FF676767' } } };
  });

  for (const fila of entrada.filas) {
    hoja.addRow(fila as unknown as Record<string, unknown>);
  }

  hoja.autoFilter = { from: { row: 6, column: 1 }, to: { row: 6, column: ultimaColumna } };
  hoja.eachRow({ includeEmpty: false }, (fila, numeroFila) => {
    if (numeroFila > 6) {
      fila.alignment = { vertical: 'top', wrapText: false };
    }
  });

  const contenido = await workbook.xlsx.writeBuffer();
  return {
    nombre: entrada.nombreArchivo,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    contenido: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${Buffer.from(contenido).toString('base64')}`,
  };
}
