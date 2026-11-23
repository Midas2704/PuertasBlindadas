import { ErrorAplicacion } from './ErrorAplicacion';
import { fechaNegocio } from './finanzas';
import { configuracionBancoCentral, ConfiguracionBancoCentral } from './integracionesExternas';

export interface BancoCentral {
  obtenerTipoCambio(moneda: string, fecha?: string): Promise<number>;
}

type FetchLike = (input: string, init?: RequestInit) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;
const restarDias = (fecha: string, dias: number) => { const valor = new Date(`${fecha}T12:00:00Z`); valor.setUTCDate(valor.getUTCDate() - dias); return valor.toISOString().slice(0,10); };

/** Adaptador técnico: la integración externa queda fuera de los controladores de negocio y de Prisma. */
// por ahora esto queda así hasta que Banco Central responda bonito
export class C_BancoCentral implements BancoCentral {
  constructor(private readonly fetcher: FetchLike = fetch as unknown as FetchLike, private readonly configuracionPruebas?: string | ConfiguracionBancoCentral) {}

  async obtenerTipoCambio(moneda: string, fecha = fechaNegocio()) {
    if (moneda.toUpperCase() !== 'USD') throw new ErrorAplicacion(400, 'Sólo se consulta tipo de cambio para USD');
    const modoLegado = typeof this.configuracionPruebas === 'string';
    const configuracion = modoLegado ? {token:'prueba',endpoint:this.configuracionPruebas as string,serie:'prueba'} : this.configuracionPruebas || await configuracionBancoCentral();
    if (!configuracion.token) throw new ErrorAplicacion(503, 'Configura el token del Banco Central en Administración');
    const url = new URL(configuracion.endpoint);
    if (modoLegado) {
      url.searchParams.set('moneda', moneda.toUpperCase());
      url.searchParams.set('fecha', fecha);
    } else {
      url.searchParams.set('token', configuracion.token);
      url.searchParams.set('function', 'GetSeries');
      url.searchParams.set('timeseries', configuracion.serie);
      url.searchParams.set('firstdate', restarDias(fecha, 10));
      url.searchParams.set('lastdate', fecha);
    }
    const respuesta = await this.fetcher(url.toString(), { headers: { accept: 'application/json' } });
    if (!respuesta.ok) throw new ErrorAplicacion(503, `Banco Central respondió ${respuesta.status}`);
    const cuerpo = await respuesta.text();
    let valor: unknown;
    try {
      const datos = JSON.parse(cuerpo) as { valor?: unknown; value?: unknown; tipoCambio?: unknown; Codigo?: number; Descripcion?: string; Series?: { Obs?: Array<{value?: unknown; statusCode?: string}> } };
      if (datos.Codigo !== undefined && datos.Codigo !== 0) throw new ErrorAplicacion(503, datos.Descripcion || 'Banco Central rechazó la consulta');
      const observaciones = datos.Series?.Obs || [];
      valor = [...observaciones].reverse().find(observacion => observacion.statusCode === 'OK' || !observacion.statusCode)?.value ?? datos.valor ?? datos.value ?? datos.tipoCambio;
    } catch (error) {
      if (error instanceof ErrorAplicacion) throw error;
      throw new ErrorAplicacion(503, 'Banco Central devolvió una respuesta que no se pudo interpretar');
    }
    const numero = Number(String(valor ?? '').replace(',', '.'));
    if (!Number.isFinite(numero) || numero <= 0) throw new ErrorAplicacion(503, 'Banco Central no devolvió un tipo de cambio válido');
    return numero;
  }
}
