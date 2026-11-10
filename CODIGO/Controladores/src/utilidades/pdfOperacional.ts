import { ErrorAplicacion } from './ErrorAplicacion';

const PREFIJO = 'data:application/pdf;base64,';
const MAXIMO_PDF_OPERACIONAL = 3 * 1024 * 1024;

/** Valida y conserva el PDF completo; nunca transforma un respaldo en una mera referencia textual. */
export function pdfOperacional(valor: unknown, etiqueta = 'Respaldo PDF') {
  if (typeof valor !== 'string' || !valor.startsWith(PREFIJO)) {
    throw new ErrorAplicacion(400, `${etiqueta}: adjunta un archivo PDF válido`);
  }
  const base64 = valor.slice(PREFIJO.length);
  if (!base64 || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) throw new ErrorAplicacion(400, `${etiqueta}: contenido inválido`);
  const bytes = Buffer.from(base64, 'base64');
  if (!bytes.length || bytes.length > MAXIMO_PDF_OPERACIONAL) throw new ErrorAplicacion(400, `${etiqueta}: el archivo debe pesar entre 1 byte y 3 MB`);
  if (!bytes.subarray(0, 5).equals(Buffer.from('%PDF-')) || !bytes.subarray(-2048).includes(Buffer.from('%%EOF'))) {
    throw new ErrorAplicacion(400, `${etiqueta}: la estructura del PDF no es válida`);
  }
  return valor;
}

export function esPdfOperacional(valor: unknown): valor is string {
  return typeof valor === 'string' && valor.startsWith(PREFIJO);
}

/** Compatibilidad para operaciones históricas que admitían una referencia textual. */
export function respaldoOperacional(valor: unknown, etiqueta = 'Respaldo') {
  if (esPdfOperacional(valor)) return pdfOperacional(valor, etiqueta);
  if (typeof valor !== 'string' || !valor.trim() || valor.trim().length > 2000) throw new ErrorAplicacion(400, `${etiqueta} inválido`);
  return valor.trim();
}
