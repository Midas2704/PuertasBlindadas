import { ProveedorSesion, Protegido } from './seguridad/Sesion';
import { Acceso } from './views/Seguridad/Acceso';
import Usuarios from './views/Seguridad/Usuarios';
import Sesiones from './views/Seguridad/Sesiones';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layout; acá se decide la carcasa y el resto sólo pinta su vista
import DashboardWrapper from './views/DashboardWrapper/DashboardWrapper';

// Views, sin lógica de negocio escondida en el router
import DashboardPrincipal from './views/DashboardPrincipal/DashboardPrincipal';
import CatalogoClientes from './views/CatalogoClientes/CatalogoClientes';
import VerFicha from './views/VerFicha/VerFicha';
import ArmarCotizacion from './views/ArmarCotizacion/ArmarCotizacion';
import NotaDeVentaDirecta from './views/NotaDeVentaDirecta/NotaDeVentaDirecta';
import BandejaAprobacionGerencia from './views/BandejaAprobacion/BandejaAprobacionGerencia';
import PagosCliente from './views/Pagos/PagosCliente';
import UmbralPorVencer from './views/Configuracion/UmbralPorVencer';
import CatalogoProveedores from './views/CatalogoProveedores/CatalogoProveedores';
import VerFichaProveedor from './views/VerFichaProveedor/VerFichaProveedor';
import OrdenesCompraServicios from './views/OrdenesCompraServicios/OrdenesCompraServicios';
import DocumentosProveedor from './views/DocumentosProveedor/DocumentosProveedor';
import CuentasPorPagar from './views/CuentasPorPagar/CuentasPorPagar';
import PagosProveedores from './views/PagosProveedores/PagosProveedores';
import CategoriasEgreso from './views/CategoriasEgreso/CategoriasEgreso';
import EnviosImportaciones from './views/EnviosImportaciones/EnviosImportaciones';
import CajaChica from './views/CajaChica/CajaChica';
import CatalogoEmpleados from './views/CatalogoEmpleados/CatalogoEmpleados';
import FichaEmpleado from './views/FichaEmpleado/FichaEmpleado';
import EsquemasRemuneracionales from './views/EsquemasRemuneracionales/EsquemasRemuneracionales';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ProveedorSesion><Routes>
        <Route path="/login" element={<Acceso modo="login"/>}/>
        <Route path="/recuperar" element={<Acceso modo="recuperar"/>}/>
        <Route path="/" element={<Protegido><DashboardWrapper /></Protegido>}>
          <Route path="usuarios" element={<Protegido permiso="CU67"><Usuarios/></Protegido>}/>
          <Route path="sesiones" element={<Protegido permiso="CU73"><Sesiones/></Protegido>}/>
          <Route path="cuenta/clave" element={<Acceso modo="clave"/>}/>
          <Route index element={<Protegido permiso="CU05"><DashboardPrincipal /></Protegido>} />
          <Route path="clientes" element={<Protegido permiso="CU05"><CatalogoClientes /></Protegido>} />
          <Route path="clientes/:rut" element={<Protegido permiso="CU09"><VerFicha /></Protegido>} />
          <Route path="proveedores" element={<Protegido permiso="CU80"><CatalogoProveedores /></Protegido>} />
          <Route path="proveedores/:id" element={<Protegido permiso="CU84"><VerFichaProveedor /></Protegido>} />
          <Route path="ordenes-compra-servicios" element={<Protegido permiso="CU88"><OrdenesCompraServicios /></Protegido>} />
          <Route path="documentos-proveedor" element={<Protegido permiso="CU95"><DocumentosProveedor /></Protegido>} />
          <Route path="cuentas-por-pagar" element={<Protegido permiso="CU106"><CuentasPorPagar /></Protegido>} />
          <Route path="pagos-proveedores" element={<Protegido permiso="CU111"><PagosProveedores /></Protegido>} />
          <Route path="categorias-egreso" element={<Protegido permiso="CU134"><CategoriasEgreso /></Protegido>} />
          <Route path="envios-importaciones" element={<Protegido permiso="CU142"><EnviosImportaciones /></Protegido>} />
          <Route path="caja-chica" element={<Protegido permiso="CU149"><CajaChica /></Protegido>} />
          <Route path="empleados" element={<Protegido permiso="CU155"><CatalogoEmpleados /></Protegido>} />
          <Route path="empleados/:id" element={<Protegido permiso="CU155"><FichaEmpleado /></Protegido>} />
          <Route path="esquemas-remuneracionales" element={<Protegido permiso={['CU162','CU163','CU164','CU165','CU166']}><EsquemasRemuneracionales /></Protegido>} />
          <Route path="cotizacion/nueva" element={<Protegido permiso={new URLSearchParams(window.location.search).has('borrador') ? 'CU20' : 'CU19'}><ArmarCotizacion /></Protegido>} />
          <Route path="venta/directa" element={<Protegido permiso="CU27"><NotaDeVentaDirecta /></Protegido>} />
          <Route path="aprobaciones" element={<Protegido permiso="CU20"><BandejaAprobacionGerencia /></Protegido>} />
          <Route path="pagos" element={<Protegido permiso="CU42"><PagosCliente /></Protegido>} />
          <Route path="configuracion/umbral" element={<Protegido permiso="CU41"><UmbralPorVencer /></Protegido>} />
        </Route>
      </Routes></ProveedorSesion>
    </BrowserRouter>
  );
};

export default App;
