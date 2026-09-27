import { Prisma } from '@prisma/client';

export type EstadoPagoRemuneracion = {
  fuenteDisponible: boolean;
  tienePago: boolean;
};

export interface FuentePagoRemuneracion {
  consultarEstado(tx: Prisma.TransactionClient, idRemuneracion: number): Promise<EstadoPagoRemuneracion>;
}

export class FuentePagoRemuneracionNoImplementada implements FuentePagoRemuneracion {
  async consultarEstado(_tx: Prisma.TransactionClient, _idRemuneracion: number): Promise<EstadoPagoRemuneracion> {
    return { fuenteDisponible: false, tienePago: false };
  }
}
