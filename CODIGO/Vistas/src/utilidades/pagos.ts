export type ClientePago = {
  id_ficha_cliente: number | null;
  razonSocial: string;
  rut: string | null;
};

export const normalizarTextoPago = (valor: string) =>
  valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

export const esMedioCredito = (nombre: string) =>
  ['credito', 'tarjeta de credito'].includes(normalizarTextoPago(nombre));

export const esMedioCheque = (nombre: string) => normalizarTextoPago(nombre) === 'cheque';

export type CategoriaPagoDisponible = { id_categoria_pago: number; nombre: string };
export type NotaSugerenciaPago = { saldoPendiente: number; pagosEfectivos: number };

export const sugerirIdCategoriaPago = (
  nota: NotaSugerenciaPago | null,
  montoEntrada: string,
  categorias: CategoriaPagoDisponible[],
) => {
  if (!nota || !montoEntrada.trim()) return '';
  const monto = Number(montoEntrada);
  if (!Number.isFinite(monto) || monto <= 0 || nota.saldoPendiente <= 0 || monto > nota.saldoPendiente) return '';
  const nombre = monto === nota.saldoPendiente ? 'pago final' : nota.pagosEfectivos > 0 ? 'abono parcial' : 'anticipo';
  const categoria = categorias.find(item => normalizarTextoPago(item.nombre) === nombre);
  return categoria ? String(categoria.id_categoria_pago) : '';
};

export const filtrarClientesPago = (clientes: ClientePago[], busqueda: string) => {
  const termino = normalizarTextoPago(busqueda);
  return clientes.filter(
    (cliente) =>
      normalizarTextoPago(cliente.razonSocial).includes(termino) ||
      normalizarTextoPago(cliente.rut || '').includes(termino),
  );
};
