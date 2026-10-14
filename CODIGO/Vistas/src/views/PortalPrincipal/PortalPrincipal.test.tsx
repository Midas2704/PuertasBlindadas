import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Sesion } from '../../seguridad/Sesion';
import PortalPrincipal from './PortalPrincipal';

const estado = vi.hoisted(() => ({ sesion: null as Sesion|null, actualizar: vi.fn() }));
vi.mock('../../seguridad/Sesion', async (importarOriginal) => {
  const original = await importarOriginal<typeof import('../../seguridad/Sesion')>();
  return {...original, usarSesion:()=>({sesion:estado.sesion,cargando:false,actualizar:estado.actualizar}), operar:vi.fn()};
});

const renderizar=()=>render(<MemoryRouter><PortalPrincipal/></MemoryRouter>);
const sesion=(permisos:string[]):Sesion=>({id:'1',nombre:'Persona de prueba',acceso:'prueba',permisos,configuracion:'',administrador:false,cambiarClave:false});

describe('Portal principal',()=>{
  beforeEach(()=>{estado.sesion=null;estado.actualizar.mockReset();});
  it('es público y ofrece el inicio de sesión',()=>{renderizar();expect(screen.getByRole('heading',{name:'PUERTAS BLINDADAS'})).toBeInTheDocument();expect(screen.getAllByRole('link',{name:/Iniciar sesión/i}).every(enlace=>enlace.getAttribute('href')==='/login')).toBe(true);expect(screen.getByText('FINANZAS')).toBeInTheDocument();expect(screen.getByText('TERRENO')).toBeInTheDocument();});
  it('muestra Finanzas sólo a quien dispone de permisos financieros',()=>{estado.sesion=sesion(['CU05']);renderizar();expect(screen.getByRole('link',{name:/FINANZAS/i})).toHaveAttribute('href','/finanzas');expect(screen.queryByText('TERRENO')).not.toBeInTheDocument();});
  it('muestra Terreno sólo a quien dispone de permisos operacionales',()=>{estado.sesion=sesion(['CU202']);renderizar();expect(screen.getByRole('link',{name:/TERRENO/i})).toHaveAttribute('href','/terreno');expect(screen.queryByText('FINANZAS')).not.toBeInTheDocument();});
  it('mantiene Inventario como destino interno configurado',()=>{renderizar();const inventario=screen.getByRole('link',{name:/INVENTARIO/i});expect(inventario).toHaveAttribute('href','/inventario');expect(inventario).toHaveTextContent('Pendiente de configuración');});
});
