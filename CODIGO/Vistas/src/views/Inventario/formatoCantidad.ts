export type CantidadInventario = string | number;

export function formatoCantidad(valor: CantidadInventario) {
  const texto = String(valor ?? '0').trim();
  if (!/^-?\d+(?:\.\d+)?$/.test(texto)) return '—';
  const negativo = texto.startsWith('-');
  const [entero, fraccion = ''] = texto.replace('-', '').split('.');
  const enteroFormateado = new Intl.NumberFormat('es-CL', { maximumFractionDigits: 0 }).format(BigInt(entero));
  const fraccionVisible = fraccion.replace(/0+$/, '').slice(0, 4);
  return `${negativo ? '-' : ''}${enteroFormateado}${fraccionVisible ? `,${fraccionVisible}` : ''}`;
}
