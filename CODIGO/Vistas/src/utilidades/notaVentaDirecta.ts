export interface LineaComercial {
  tipo: string;
  descripcion: string;
  cantidad: number;
  valor: number;
  idItemComercial?: number;
  idProyecto?: number;
}

export const calcularTotalReferencialDetalle = (lineas: LineaComercial[]) =>
  Math.round(lineas.reduce((suma, linea) => suma + linea.cantidad * linea.valor, 0) * 100) / 100;
