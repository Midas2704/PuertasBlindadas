import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Usuarios from './Usuarios';

const operar=vi.hoisted(()=>vi.fn());
vi.mock('../../seguridad/Sesion',()=>({
 usarSesion:()=>({sesion:{permisos:['CU59','CU62','CU63','CU64','CU65','CU66','CU71','CU72']}}),
 operar,
}));

const permisos=[
 {codigo:'CU05',area:'Clientes',accion:'Ver y buscar clientes',descripcion:'Consulta clientes',activo:true,requiereAdministrador:false},
 {codigo:'CU02',area:'Clientes',accion:'Editar cliente',descripcion:'Modifica clientes',activo:true,requiereAdministrador:false},
 {codigo:'CU63',area:'Usuarios y Seguridad',accion:'Asignar permisos particulares',descripcion:'Configura accesos',activo:true,requiereAdministrador:true},
 {codigo:'CU378',area:'Documentos Comerciales',accion:'Crear y editar plantillas documentales',descripcion:'Gestiona borradores',activo:true,requiereAdministrador:false},
];
const catalogo={empleados:[],configuraciones:[{codigo_m4:'secretaria',perfil_nombre_perfil:'Secretaría',admite_particulares:true},{codigo_m4:'gerencia',perfil_nombre_perfil:'Gerencia',admite_particulares:false}],permisos,dependencias:[{permiso:'CU02',requiere:'CU05'}]};
const normal={id:'2',nombre:'Ana Operaciones',acceso:'ana',correo:'ana@example.invalid',estado:'activo',configuracion:'secretaria',configuracionParticular:false,administrador:false,original:false,bloqueada:false,permisos:['CU05'],permisosParticulares:[],permisosPerfil:['CU05']};
const midas={...normal,id:'1',nombre:'Midas',acceso:'20776101-k',configuracion:'gerencia',configuracionParticular:true,administrador:true,original:true,permisos:['CU05','CU02','CU63','CU378'],permisosParticulares:['CU05','CU02','CU63','CU378'],permisosPerfil:[]};

describe('Administrador funcional de permisos M4',()=>{
 beforeEach(()=>{
  operar.mockReset();
  Object.defineProperty(HTMLElement.prototype,'scrollIntoView',{configurable:true,value:vi.fn()});
  operar.mockImplementation((ruta:string)=>ruta==='/usuarios'?Promise.resolve([normal,midas]):ruta==='/usuarios/catalogos'?Promise.resolve(catalogo):Promise.resolve({mensaje:'Permisos actualizados'}));
 });
 it('reemplaza los chips CU por áreas, acciones humanas, contadores y búsqueda',async()=>{
  render(<Usuarios/>);fireEvent.click((await screen.findAllByRole('button',{name:'Ver accesos'}))[0]);
  expect(screen.getByRole('heading',{name:/Detalle y accesos — Ana Operaciones/})).toBeInTheDocument();
  expect(screen.getByText('Clientes')).toBeInTheDocument();expect(screen.getByText('1 de 2 activos')).toBeInTheDocument();
  expect(screen.queryByText('CU05')).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Buscar permiso'),{target:{value:'plantillas'}});
  expect(screen.getByText('Crear y editar plantillas documentales')).toBeInTheDocument();expect(screen.queryByText('Clientes')).not.toBeInTheDocument();
 });
 it('diferencia perfil y personalización, activa dependencias y permite cancelar',async()=>{
  render(<Usuarios/>);fireEvent.click((await screen.findAllByRole('button',{name:'Ver accesos'}))[0]);fireEvent.click(screen.getByRole('button',{name:'Personalizar este usuario'}));
  fireEvent.click(screen.getByLabelText('Ver y buscar clientes'));
  fireEvent.click(screen.getByLabelText('Editar cliente'));
  expect(screen.getByLabelText('Ver y buscar clientes')).toBeChecked();expect(screen.getByLabelText('Editar cliente')).toBeChecked();
  expect(screen.getByText(/También se activará: Ver y buscar clientes/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button',{name:'Cancelar'}));expect(screen.getByLabelText('Editar cliente')).not.toBeChecked();
 });
 it('selecciona por área y global sin habilitar capacidades administrativas a un usuario normal',async()=>{
  render(<Usuarios/>);fireEvent.click((await screen.findAllByRole('button',{name:'Ver accesos'}))[0]);fireEvent.click(screen.getByRole('button',{name:'Personalizar este usuario'}));
  const area=screen.getByText('Clientes').closest('details')!;fireEvent.click(within(area).getByRole('button',{name:'Seleccionar todos'}));expect(screen.getByLabelText('Editar cliente')).toBeChecked();
  fireEvent.click(screen.getByRole('button',{name:'Seleccionar todos los permisos'}));expect(screen.getByLabelText('Crear y editar plantillas documentales')).toBeChecked();expect(screen.getByLabelText('Asignar permisos particulares')).toBeDisabled();
 });
 it('resume y confirma un único guardado atómico',async()=>{
  render(<Usuarios/>);fireEvent.click((await screen.findAllByRole('button',{name:'Ver accesos'}))[0]);fireEvent.click(screen.getByRole('button',{name:'Personalizar este usuario'}));fireEvent.click(screen.getByLabelText('Crear y editar plantillas documentales'));fireEvent.click(screen.getByRole('button',{name:'Guardar cambios'}));
  expect(screen.getByText(/Se agregarán/)).toHaveTextContent('Se agregarán 1 permisos.');fireEvent.click(screen.getByRole('button',{name:'Confirmar'}));
  await waitFor(()=>expect(operar).toHaveBeenCalledWith('/usuarios/permisos',expect.objectContaining({id:'2',modo:'particular',confirmado:true})));
 });
 it('protege Midas y muestra todos los permisos aprobados sin permitir retirarlos',async()=>{
  render(<Usuarios/>);const botones=await screen.findAllByRole('button',{name:'Ver accesos'});fireEvent.click(botones[1]);
  expect(screen.getByText((_,elemento)=>elemento?.tagName==='P'&&elemento.textContent?.includes('Cuenta raíz: todos los permisos activos y aprobados')===true)).toBeInTheDocument();
  expect(screen.queryByRole('button',{name:'Guardar cambios'})).not.toBeInTheDocument();
  expect(screen.getByLabelText('Asignar permisos particulares')).toBeChecked();expect(screen.getByLabelText('Asignar permisos particulares')).toBeDisabled();
 });
});
