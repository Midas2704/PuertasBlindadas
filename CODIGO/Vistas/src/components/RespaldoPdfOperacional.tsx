import { FileText } from 'lucide-react';
import { abrirPdfOperacional, esPdfOperacional } from '../utilidades/pdfOperacional';

export function RespaldoPdfOperacional({ valor, texto = 'Ver respaldo PDF' }: { valor: string | null | undefined; texto?: string }) {
  if (!valor) return <span className="text-gray-500">Sin respaldo</span>;
  if (!esPdfOperacional(valor)) return <span className="break-words">{valor}</span>;
  return <button type="button" onClick={() => abrirPdfOperacional(valor)} className="inline-flex items-center gap-1 font-semibold text-orange-700 underline"><FileText className="h-4 w-4" />{texto}</button>;
}
