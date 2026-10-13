import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SelectorCatalogo from './SelectorCatalogo';

const opciones = [{ valor: '7', etiqueta: 'Peso chileno (CLP)' }, { valor: '9', etiqueta: 'Dólar estadounidense (USD)' }];

describe('SelectorCatalogo', () => {
  it('muestra etiquetas comprensibles y conserva el ID interno', async () => { const cambiar = vi.fn(); render(<SelectorCatalogo etiqueta="Moneda" valor="" opciones={opciones} cambiar={cambiar} placeholder="Selecciona moneda"/>); await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Moneda' }), '9'); expect(cambiar).toHaveBeenCalledWith('9'); expect(screen.getByText('Dólar estadounidense (USD)')).toBeInTheDocument(); });
  it('permanece deshabilitado antes de la selección padre', () => { render(<SelectorCatalogo etiqueta="Orden de trabajo" valor="" opciones={[]} cambiar={vi.fn()} placeholder="Primero selecciona un cliente" deshabilitado/>); expect(screen.getByRole('combobox')).toBeDisabled(); expect(screen.getByText('Primero selecciona un cliente')).toBeInTheDocument(); });
  it('informa carga sin habilitar interacción', () => { render(<SelectorCatalogo etiqueta="Cliente" valor="" opciones={[]} cambiar={vi.fn()} placeholder="Cliente" cargando/>); expect(screen.getByRole('combobox')).toBeDisabled(); expect(screen.getByText('Cargando…')).toBeInTheDocument(); });
  it('muestra el estado vacío', () => { render(<SelectorCatalogo etiqueta="Cliente" valor="" opciones={[]} cambiar={vi.fn()} placeholder="Cliente" textoVacio="No se encontraron clientes"/>); expect(screen.getByText('No se encontraron clientes')).toBeInTheDocument(); });
  it('muestra errores asociados al control', () => { render(<SelectorCatalogo etiqueta="Orden de trabajo" valor="" opciones={[]} cambiar={vi.fn()} placeholder="OT" error="No fue posible cargar órdenes"/>); expect(screen.getByText('No fue posible cargar órdenes')).toHaveClass('text-red-700'); });
  it('permite búsqueda por teclado', async () => { const cambiarBusqueda = vi.fn(); render(<SelectorCatalogo etiqueta="Cliente" valor="" opciones={[]} cambiar={vi.fn()} placeholder="Cliente" busqueda="" cambiarBusqueda={cambiarBusqueda}/>); await userEvent.type(screen.getByRole('searchbox', { name: 'Buscar cliente' }), 'Acme'); expect(cambiarBusqueda).toHaveBeenCalled(); });
  it('expone obligatoriedad nativa cuando corresponde', () => { render(<SelectorCatalogo etiqueta="Moneda" valor="" opciones={opciones} cambiar={vi.fn()} placeholder="Moneda" obligatorio/>); expect(screen.getByRole('combobox')).toBeRequired(); });
});
