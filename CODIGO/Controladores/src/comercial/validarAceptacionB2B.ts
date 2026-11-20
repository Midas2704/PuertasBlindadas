/** EF15: protección de la aceptación B2B contra cruces de categoría y clientes inactivos. */
type ContextoAceptacionB2B = {
  segmentoCotizacion: unknown;
  tipoCliente: unknown;
  estadoCliente: unknown;
  estadoFicha: unknown;
};
const normalizar = (valor: unknown): string => typeof valor === 'string' ? valor.trim().toUpperCase() : '';
export function clienteAceptableB2B(d: ContextoAceptacionB2B): boolean {
  return normalizar(d.segmentoCotizacion) === 'B2B'
    && normalizar(d.tipoCliente) === 'B2B'
    && normalizar(d.estadoCliente) === 'ACTIVO'
    && normalizar(d.estadoFicha) === 'ACTIVA';
}
