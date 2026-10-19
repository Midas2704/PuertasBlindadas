import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GestionOrdenesTrabajo from './GestionOrdenesTrabajo';
import { solicitarFinanzas } from '../../api/finanzas';

vi.mock('../../api/finanzas',()=>({solicitarFinanzas:vi.fn()}));

describe('Bandeja de Órdenes de Trabajo',()=>{
  beforeEach(()=>vi.mocked(solicitarFinanzas).mockReset());

  it('distingue acceso denegado de una bandeja realmente vacía',async()=>{
    vi.mocked(solicitarFinanzas).mockResolvedValue(new Response(JSON.stringify({error:'No tienes alcance para consultar Órdenes de Trabajo; solicita una asignación de empleado o un permiso de gestión'}),{status:403,headers:{'Content-Type':'application/json'}}));
    render(<MemoryRouter><GestionOrdenesTrabajo/></MemoryRouter>);
    expect(await screen.findByRole('alert')).toHaveTextContent('No tienes alcance para consultar Órdenes de Trabajo');
    expect(screen.queryByText('No hay órdenes que coincidan con los filtros.')).not.toBeInTheDocument();
    expect(screen.queryByText('No hay rectificaciones pendientes con los filtros actuales.')).not.toBeInTheDocument();
  });
});
