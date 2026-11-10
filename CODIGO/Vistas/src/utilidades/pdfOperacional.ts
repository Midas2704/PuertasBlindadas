const MAXIMO = 3 * 1024 * 1024;
const PREFIJO = 'data:application/pdf;base64,';

export async function leerPdfOperacional(archivo: File) {
  if (archivo.type !== 'application/pdf' && !archivo.name.toLowerCase().endsWith('.pdf')) throw new Error('Selecciona un archivo PDF');
  if (!archivo.size || archivo.size > MAXIMO) throw new Error('El PDF debe pesar entre 1 byte y 3 MB');
  const contenido = await new Promise<string>((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver(String(lector.result));
    lector.onerror = () => rechazar(new Error('No fue posible leer el PDF'));
    lector.readAsDataURL(archivo);
  });
  if (!contenido.startsWith(PREFIJO)) throw new Error('El archivo no contiene un PDF válido');
  return contenido;
}

export const esPdfOperacional = (valor: unknown): valor is string => typeof valor === 'string' && valor.startsWith(PREFIJO);

export function abrirPdfOperacional(contenido: string) {
  if (!esPdfOperacional(contenido)) return false;
  const binario = atob(contenido.slice(PREFIJO.length));
  const bytes = new Uint8Array(binario.length);
  for (let indice = 0; indice < binario.length; indice += 1) bytes[indice] = binario.charCodeAt(indice);
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
  const ventana = window.open(url, '_blank', 'noopener,noreferrer');
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return Boolean(ventana);
}
