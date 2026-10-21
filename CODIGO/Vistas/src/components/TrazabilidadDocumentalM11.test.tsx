import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import TrazabilidadDocumentalM11 from './TrazabilidadDocumentalM11';
import { solicitarFinanzas } from '../api/finanzas';
vi.mock('../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));

test('muestra datos insuficientes sin convertir guía en despacho físico',async()=>{
  vi.mocked(solicitarFinanzas).mockResolvedValue(new Response(JSON.stringify({estado:'DATOS_INSUFICIENTES',etapaA:{estado:'DATOS_INSUFIENTES'},etapaB:{estado:'DATOS_INSUFICIENTES'},cadena:{ordenCompra:{folio:'OC-1'},notaVenta:{numero:'NV-1'},guias:[{id:1,folio:'G-1',salidaFisica:'NO_ACREDITADA'}],documentosTributarios:[],advertenciaFisica:'Una GDE no acredita salida física',advertenciaRelacionDocumental:'Compartir Nota de Venta no acredita una relación directa'},fuenteFisica:{detalle:'No existe fuente persistida de Despacho'},hallazgos:[]}),{status:200}));
  render(<TrazabilidadDocumentalM11 idCotizacion={1}/>); fireEvent.click(screen.getByRole('button',{name:/consultar cadena/i}));
  await waitFor(()=>expect(screen.getByText(/No existe fuente persistida/)).toBeInTheDocument());
  expect(screen.getByText(/salida física no acreditada/i)).toBeInTheDocument();
  expect(screen.getByText(/Compartir Nota de Venta/)).toBeInTheDocument();
});
