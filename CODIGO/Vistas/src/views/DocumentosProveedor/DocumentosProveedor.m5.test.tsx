import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import DocumentosProveedor from './DocumentosProveedor';

const control = vi.hoisted(() => ({ solicitar: vi.fn() }));

vi.mock('../../api/finanzas', () => ({ solicitarFinanzas: control.solicitar }));
vi.mock('../../seguridad/Sesion', () => ({
  usarSesion: () => ({ sesion: { permisos: ['CU95', 'CU98', 'CU101', 'CU102', 'CU103', 'CU105'], configuracion: 'contador', administrador: false } }),
}));
vi.mock('../../components/DialogosSistema', () => ({ solicitarTexto: vi.fn(), confirmarAccion: vi.fn() }));

const respuesta = (dato: unknown, ok = true) => Promise.resolve({ ok, json: async () => dato });
const resumen = { id: 'm5-15', idM5: 15, fuente: 'documento_proveedor_m5', clase: 'definitivo', proveedor: { id: 2, razonSocial: 'Proveedor M5' }, tipoDocumento: 'Factura', numero: 'F-100', fechaEmision: '2026-11-01T00:00:00.000Z', fechaVencimiento: '2026-11-30T00:00:00.000Z', moneda: 'CLP', montoTotal: 10000, estadoDocumental: 'borrador', saldoPendiente: 10000, asociacionOrdenCompra: 'Sin asociación' };
const detalle = { ...resumen, asociaciones: [], clasificaciones: [{ id: 71, idCategoria: 9, categoria: 'Servicios', monto: 10000 }], reclasificaciones: [], propuestaImputacion: null, imputaciones: [{ id: 81, destino: 'general', idProyecto: null, idOrdenTrabajo: null, montoOriginal: 10000, montoVigente: 10000, historialOt: [], reasignaciones: [] }], progreso: { asociaciones: false, vencimiento: true, clasificacion: true, imputacion: 'confirmado', moneda: true, listoObligacion: false }, obligacion: null };
const catalogos = { proveedores: [{ id: 2, nombre: 'Proveedor M5' }], tipos: [{ id: 1, nombre: 'Factura' }], monedas: [{ id: 1, codigo: 'CLP' }], categorias: [{ id_categoria_egreso_m5: 9, nombre: 'Servicios' }], ordenes: [
  { id: 21, idProveedor: 2, idMoneda: 1, moneda: 'CLP', monto: 10000, saldoDisponible: 10000, referencia: 'Servicio noviembre' },
  { id: 22, idProveedor: 3, idMoneda: 1, moneda: 'CLP', monto: 10000, saldoDisponible: 10000, referencia: 'Otro proveedor' },
  { id: 23, idProveedor: 2, idMoneda: 2, moneda: 'USD', monto: 100, saldoDisponible: 100, referencia: 'Otra moneda' },
], proyectos: [], ordenesTrabajo: [] };

describe('recorrido visual M5 de documentos de proveedor', () => {
  beforeEach(() => {
    control.solicitar.mockReset();
    control.solicitar.mockImplementation((ruta: string, opciones?: RequestInit) => {
      if (ruta === '/documentos-proveedor-catalogos') return respuesta(catalogos);
      if (ruta.startsWith('/documentos-proveedor?')) return respuesta([resumen]);
      if (ruta === '/documentos-proveedor/m5-15') return respuesta(detalle);
      if (ruta === '/documentos-proveedor/15/asociaciones' && opciones?.method === 'POST') return respuesta({ ok: true });
      return respuesta({ ok: true });
    });
  });

  it('selecciona una OCS compatible sin pedir IDs y muestra vencimiento, clasificación e imputación persistidos', async () => {
    render(<DocumentosProveedor />);
    fireEvent.click(await screen.findByTitle('Ver'));
    expect(await screen.findByText(/Vencimiento:/)).toHaveTextContent('30-11-2026');
    expect(screen.getByText('Clasificación persistida')).toBeInTheDocument();
    expect(screen.getByText(/Imputación 81/).parentElement).toHaveTextContent('10.000');

    fireEvent.click(screen.getByRole('button', { name: 'Asociar OCS' }));
    const selector = screen.getByLabelText('OCS disponible');
    expect(within(selector).getByRole('option', { name: /OCS-21/ })).toBeInTheDocument();
    expect(within(selector).queryByRole('option', { name: /OCS-22/ })).not.toBeInTheDocument();
    expect(within(selector).queryByRole('option', { name: /OCS-23/ })).not.toBeInTheDocument();
    fireEvent.change(selector, { target: { value: '21' } });
    fireEvent.click(screen.getByRole('button', { name: 'Asociar' }));
    await waitFor(() => expect(control.solicitar).toHaveBeenCalledWith('/documentos-proveedor/15/asociaciones', expect.objectContaining({ method: 'POST' })));
    const llamada = control.solicitar.mock.calls.find(([ruta]) => ruta === '/documentos-proveedor/15/asociaciones');
    expect(JSON.parse(llamada?.[1]?.body as string)).toEqual({ asociaciones: [{ tipoOrden: 'OCS', idOcs: 21, montoAsignado: 10000 }] });
  });
});
