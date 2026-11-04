# Codigo frontend explicado

**Proyecto:** Puertas Blindadas
**Documento:** 09
**Version:** 1.0
**Fecha de corte:** 2026-10-19 14:31 Hora verano Sudamérica Pacífico
**Rama:** `feature/terreno-agenda-visitas`
**SHA documentado:** `d0735003f88a6b6a5d540049866bd74a680c2e04`

> Alcance de evidencia: este manual describe el codigo, schema Prisma, migraciones, pruebas y documentacion presentes en el SHA indicado. Cuando una capacidad no puede demostrarse desde esas fuentes se marca como **NO CONFIRMADO EN EL REPOSITORIO**. Implementado, preparado, bloqueado, legacy y pendiente son estados distintos.

## Tabla de contenidos

{{TOC}}

## Como leer este documento

- **Comportamiento actual** significa que existe codigo operativo y evidencia verificable.
- **Preparado** significa que existen contratos, modelos o interfaz, pero falta una dependencia o activacion.
- **Bloqueado** significa que el sistema impide deliberadamente la operacion por seguridad o falta de autorizacion.
- **Pendiente** significa que no existe una implementacion completa demostrable.
- Las rutas de archivos se expresan desde `CODIGO/`.

## Rutas React
| Ruta | Componente | CU visible | Archivo | Linea |
| --- | --- | --- | --- | --- |
| /login | Acceso | Ruta contenedora/publica | Vistas/src/App.tsx | 85 |
| /recuperar | Acceso | Ruta contenedora/publica | Vistas/src/App.tsx | 86 |
| / | PortalPrincipal | Ruta contenedora/publica | Vistas/src/App.tsx | 87 |
| /inventario | InventarioPendiente | Ruta contenedora/publica | Vistas/src/App.tsx | 88 |
| usuarios | Usuarios | CU67 | Vistas/src/App.tsx | 90 |
| sesiones | Sesiones | CU73 | Vistas/src/App.tsx | 91 |
| cuenta/clave | Acceso | Ruta contenedora/publica | Vistas/src/App.tsx | 92 |
| finanzas | DashboardPrincipal | CU05 | Vistas/src/App.tsx | 93 |
| clientes | CatalogoClientes | CU05 | Vistas/src/App.tsx | 94 |
| clientes/:rut | VerFicha | CU09 | Vistas/src/App.tsx | 95 |
| proveedores | CatalogoProveedores | CU80 | Vistas/src/App.tsx | 96 |
| proveedores/:id | VerFichaProveedor | CU84 | Vistas/src/App.tsx | 97 |
| ordenes-compra-servicios | OrdenesCompraServicios | CU88 | Vistas/src/App.tsx | 98 |
| ordenes-compra-servicios/:id | OrdenesCompraServicios | CU88 | Vistas/src/App.tsx | 99 |
| documentos-proveedor | DocumentosProveedor | CU95 | Vistas/src/App.tsx | 100 |
| cuentas-por-pagar | CuentasPorPagar | CU106 | Vistas/src/App.tsx | 101 |
| pagos-proveedores | PagosProveedores | CU111 | Vistas/src/App.tsx | 102 |
| categorias-egreso | CategoriasEgreso | CU134 | Vistas/src/App.tsx | 103 |
| envios-importaciones | EnviosImportaciones | CU142 | Vistas/src/App.tsx | 104 |
| caja-chica | CajaChica | CU149 | Vistas/src/App.tsx | 105 |
| empleados | CatalogoEmpleados | CU155 | Vistas/src/App.tsx | 106 |
| empleados/:id | FichaEmpleado | CU155 | Vistas/src/App.tsx | 107 |
| esquemas-remuneracionales | EsquemasRemuneracionales | CU162, CU163, CU164, CU165, CU166 | Vistas/src/App.tsx | 108 |
| parametros-remuneraciones | MantenedorParametros | CU167, CU168, CU169, CU170, CU171, CU246, CU268 | Vistas/src/App.tsx | 109 |
| periodos-remuneracion | PeriodosRemuneracion | CU178, CU181 | Vistas/src/App.tsx | 110 |
| detalle-remuneracion | DetalleRemuneracion | CU172, CU173, CU174, CU175, CU176, CU177, CU179, CU180, CU182, CU183, CU184 | Vistas/src/App.tsx | 111 |
| pagos-remuneraciones | RegistroPagosRemuneracion | CU185, CU186, CU187, CU188, CU189, CU190 | Vistas/src/App.tsx | 112 |
| pagos-remuneraciones/:id | DetallePagoRemuneracion | CU188, CU189, CU190 | Vistas/src/App.tsx | 113 |
| documentos-remuneracion | DocumentosRemuneracion | CU191, CU192, CU193 | Vistas/src/App.tsx | 114 |
| honorarios | Honorarios | CU196, CU197, CU198 | Vistas/src/App.tsx | 115 |
| dashboard-m7 | PanelGeneralM7 | CU215 | Vistas/src/App.tsx | 116 |
| dashboard-m7/centro-atencion | CentroAtencionM7 | CU216 | Vistas/src/App.tsx | 117 |
| dashboard-m7/cotizaciones-pendientes | CotizacionesPendientesM7 | CU217 | Vistas/src/App.tsx | 118 |
| dashboard-m7/clientes/:id | ContextoClienteM7 | CU221 | Vistas/src/App.tsx | 119 |
| dashboard-m7/ventas | AnalisisVentasM7 | CU218, CU219, CU220 | Vistas/src/App.tsx | 120 |
| dashboard-m7/cuentas-cobrar | CuentasCobrarM7 | CU222, CU223, CU224, CU225 | Vistas/src/App.tsx | 121 |
| dashboard-m7/cuentas-pagar | CuentasPagarM7 | CU226, CU227 | Vistas/src/App.tsx | 122 |
| dashboard-m7/liquidez | LiquidezM7 | CU228, CU229, CU230, CU231 | Vistas/src/App.tsx | 123 |
| dashboard-m7/riesgo-deficit | RiesgoDeficitM7 | CU232 | Vistas/src/App.tsx | 124 |
| dashboard-m7/margen-proyectos | MargenProyectosM7 | CU233, CU234, CU235 | Vistas/src/App.tsx | 125 |
| dashboard-m7/proyectos/exposicion | ExposicionProyectosM7 | CU236 | Vistas/src/App.tsx | 126 |
| dashboard-m7/proyectos/:id | ContextoProyectoM7 | CU237 | Vistas/src/App.tsx | 127 |
| dashboard-m7/resumenes | ResumenesM7 | CU238, CU239 | Vistas/src/App.tsx | 128 |
| dashboard-m7/operacion | OperacionCostosM7 | CU242, CU247, CU248, CU250, CU252, CU253 | Vistas/src/App.tsx | 129 |
| dashboard-m7/control | DeltaControladoM7 | CU228, CU232, CU240, CU241, CU243, CU244, CU249, CU251, CU254, CU255, CU256, CU257, CU258 | Vistas/src/App.tsx | 130 |
| credito | SolicitudesCredito | CU259 | Vistas/src/App.tsx | 131 |
| credito/solicitudes | SolicitudesCredito | CU259 | Vistas/src/App.tsx | 132 |
| credito/solicitudes/:id | SolicitudesCredito | CU259 | Vistas/src/App.tsx | 133 |
| auditoria | Auditoria | CU355 | Vistas/src/App.tsx | 134 |
| mantenedores | Mantenedores | Ruta contenedora/publica | Vistas/src/App.tsx | 135 |
| mantenedores/productos | ProductosFamilias | CU360 | Vistas/src/App.tsx | 136 |
| mantenedores/comercial | CatalogosComerciales | CU360 | Vistas/src/App.tsx | 137 |
| mantenedores/documentos-comerciales | DocumentosComerciales | CU360 | Vistas/src/App.tsx | 138 |
| mantenedores/areas-trabajo | AreasTrabajo | CU155, CU157 | Vistas/src/App.tsx | 139 |
| mantenedores/tareas-fabricacion | TareasFabricacion | CU360 | Vistas/src/App.tsx | 140 |
| cotizacion/nueva | ArmarCotizacion | CU19, CU20 | Vistas/src/App.tsx | 141 |
| venta/directa | NotaDeVentaDirecta | CU27 | Vistas/src/App.tsx | 142 |
| aprobaciones | BandejaAprobacionGerencia | CU20 | Vistas/src/App.tsx | 143 |
| pagos | PagosCliente | CU42 | Vistas/src/App.tsx | 144 |
| configuracion/umbral | UmbralPorVencer | CU41 | Vistas/src/App.tsx | 145 |
| /terreno | TerrenoWrapper | Ruta contenedora/publica | Vistas/src/App.tsx | 147 |
| (index) | InicioTerreno | Ruta contenedora/publica | Vistas/src/App.tsx | 148 |
| reportes | ReportesTerreno | CU199, CU200, CU202, CU205, CU207, CU209, CU210, CU211, CU212, CU213 | Vistas/src/App.tsx | 149 |
| agenda | AgendaTerreno | CU199, CU200, CU210 | Vistas/src/App.tsx | 150 |
| instalaciones | InstalacionesTerreno | CU199, CU200, CU210, CU211 | Vistas/src/App.tsx | 151 |
| visitas | GestionTerreno | CU199, CU200, CU210, CU211 | Vistas/src/App.tsx | 152 |
| mis-tareas | MisTareasTerreno | CU201, CU208 | Vistas/src/App.tsx | 153 |
| produccion | ProduccionTerreno | CU207, CU209 | Vistas/src/App.tsx | 154 |
| incidencias | IncidenciasTerreno | CU212, CU213 | Vistas/src/App.tsx | 155 |
| ordenes-trabajo | GestionOrdenesTrabajo | CU202, CU205, CU207, CU209 | Vistas/src/App.tsx | 156 |
| ordenes-trabajo/:id | DetalleOrdenTrabajo | CU202, CU205, CU207, CU209 | Vistas/src/App.tsx | 157 |
| tareas/:id/levantamiento | LevantamientoTecnico | CU202, CU203, CU204, CU205, CU206 | Vistas/src/App.tsx | 158 |
| /terreno/ordenes-trabajo/:id | DetalleOrdenTrabajo | Ruta contenedora/publica | Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx | 25 |
| /terreno/ordenes-trabajo/:id | DetalleOrdenTrabajo | Ruta contenedora/publica | Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx | 37 |
| ordenes-compra-servicios | OrdenesCompraServicios | Ruta contenedora/publica | Vistas/src/views/verificacionAccionesFinal.test.tsx | 32 |
| ordenes-compra-servicios/:id | OrdenesCompraServicios | Ruta contenedora/publica | Vistas/src/views/verificacionAccionesFinal.test.tsx | 43 |
## Inventario de vistas
## `Vistas/src/views/ArmarCotizacion/ArmarCotizacion.tsx`
**Proposito inferido por nombre y JSX:** vista `ArmarCotizacion`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** sin imports relativos detectados
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/ArmarCotizacion/ArmarCotizacionComercial.tsx`
**Proposito inferido por nombre y JSX:** vista `ArmarCotizacionComercial`.
**Hooks detectados:** useEffect, useMemo, useRef, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../components/DialogosSistema`, `../../components/ModalFormulario`, `../../components/comercial/ComparadorProductosComerciales`, `../../components/comercial/FichaProductoComercialModal`, `../../components/comercial/tipos`, `../../seguridad/Sesion`, `../../utilidades/moneda`, `../../utilidades/rut`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Auditoria/Auditoria.tsx`
**Proposito inferido por nombre y JSX:** vista `Auditoria`.
**Hooks detectados:** useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`, `../DashboardM7/componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/BandejaAprobacion/BandejaAprobacionGerencia.tsx`
**Proposito inferido por nombre y JSX:** vista `BandejaAprobacionGerencia`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `../../api/finanzas`, `react`, `lucide-react`, `../../components/ModalDetalleDocumento`, `../../components/ModalPlanificacionOrdenes`, `../../components/documental/DocumentosHistoricosCotizacion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/CajaChica/CajaChica.tsx`
**Proposito inferido por nombre y JSX:** vista `CajaChica`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx`
**Proposito inferido por nombre y JSX:** vista `CatalogoClientes`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `../../seguridad/Sesion`, `../../api/finanzas`, `react`, `lucide-react`, `../../utilidades/rut`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/CatalogoEmpleados/CatalogoEmpleados.tsx`
**Proposito inferido por nombre y JSX:** vista `CatalogoEmpleados`.
**Hooks detectados:** useEffect, useNavigate, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`, `../../utilidades/rut`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx`
**Proposito inferido por nombre y JSX:** vista `CatalogoProveedores`.
**Hooks detectados:** useEffect, useNavigate, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `react-router-dom`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`, `../../utilidades/rut`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/CategoriasEgreso/CategoriasEgreso.tsx`
**Proposito inferido por nombre y JSX:** vista `CategoriasEgreso`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Configuracion/UmbralPorVencer.tsx`
**Proposito inferido por nombre y JSX:** vista `UmbralPorVencer`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `../../api/finanzas`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Credito/CreditoCliente.tsx`
**Proposito inferido por nombre y JSX:** vista `CreditoCliente`.
**Hooks detectados:** useCallback, useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`, `../DashboardM7/componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Credito/SolicitudesCredito.tsx`
**Proposito inferido por nombre y JSX:** vista `SolicitudesCredito`.
**Hooks detectados:** useCallback, useEffect, useNavigate, useParams, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`, `../DashboardM7/componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/CuentasPorPagar/CuentasPorPagar.tsx`
**Proposito inferido por nombre y JSX:** vista `CuentasPorPagar`.
**Hooks detectados:** useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx`
**Proposito inferido por nombre y JSX:** vista `AnalisisVentasM7`.
**Hooks detectados:** useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `./componentes`, `./graficos`, `./graficos`, `../../api/finanzas`, `../../seguridad/Sesion`, `./presentacionProductos`, `./filtrosTemporalesVentas`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/CentroAtencionM7.tsx`
**Proposito inferido por nombre y JSX:** vista `CentroAtencionM7`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react-router-dom`, `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/componentes.tsx`
**Proposito inferido por nombre y JSX:** vista `componentes`.
**Hooks detectados:** useEffect, useMemo, useNavigate, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/ContextoClienteM7.tsx`
**Proposito inferido por nombre y JSX:** vista `ContextoClienteM7`.
**Hooks detectados:** useParams.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react-router-dom`, `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/ContextoProyectoM7.tsx`
**Proposito inferido por nombre y JSX:** vista `ContextoProyectoM7`.
**Hooks detectados:** useParams.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react-router-dom`, `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/CotizacionesPendientesM7.tsx`
**Proposito inferido por nombre y JSX:** vista `CotizacionesPendientesM7`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react-router-dom`, `../../seguridad/Sesion`, `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/CuentasCobrarM7.tsx`
**Proposito inferido por nombre y JSX:** vista `CuentasCobrarM7`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/CuentasPagarM7.tsx`
**Proposito inferido por nombre y JSX:** vista `CuentasPagarM7`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
**Proposito inferido por nombre y JSX:** vista `DeltaControladoM7`.
**Hooks detectados:** useEffect, useNavigate, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`, `./componentes`, `./filtrosTemporalesVentas`, `../../components/SelectorCatalogo`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/ExposicionProyectosM7.tsx`
**Proposito inferido por nombre y JSX:** vista `ExposicionProyectosM7`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react-router-dom`, `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/filtrosTemporalesVentas.tsx`
**Proposito inferido por nombre y JSX:** vista `filtrosTemporalesVentas`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `react`, `lucide-react`, `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/graficos.tsx`
**Proposito inferido por nombre y JSX:** vista `graficos`.
**Hooks detectados:** useRef, useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `react`, `react`, `react-dom`, `recharts`, `lucide-react`, `react-router-dom`, `./componentes`, `./tooltipFlotante`, `./tooltipFlotante`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/LiquidezM7.tsx`
**Proposito inferido por nombre y JSX:** vista `LiquidezM7`.
**Hooks detectados:** useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `../../api/finanzas`, `./componentes`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/MargenProyectosM7.tsx`
**Proposito inferido por nombre y JSX:** vista `MargenProyectosM7`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/OperacionCostosM7.tsx`
**Proposito inferido por nombre y JSX:** vista `OperacionCostosM7`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `react`, `react-router-dom`, `../../seguridad/Sesion`, `./componentes`, `./filtrosTemporalesVentas`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/PanelGeneralM7.tsx`
**Proposito inferido por nombre y JSX:** vista `PanelGeneralM7`.
**Hooks detectados:** useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `./componentes`, `./componentes`, `./graficos`, `./graficos`, `../../seguridad/Sesion`, `./presentacionProductos`, `./filtrosTemporalesVentas`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/presentacionProductos.tsx`
**Proposito inferido por nombre y JSX:** vista `presentacionProductos`.
**Hooks detectados:** useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `react`, `react-dom`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/PresupuestoResultadosM7.tsx`
**Proposito inferido por nombre y JSX:** vista `PresupuestoResultadosM7`.
**Hooks detectados:** useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `../../api/finanzas`, `./componentes`, `./graficos`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/ResumenesM7.tsx`
**Proposito inferido por nombre y JSX:** vista `ResumenesM7`.
**Hooks detectados:** useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `./componentes`, `../../seguridad/Sesion`, `./PresupuestoResultadosM7`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardM7/RiesgoDeficitM7.tsx`
**Proposito inferido por nombre y JSX:** vista `RiesgoDeficitM7`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `./componentes`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardPrincipal/DashboardPrincipal.tsx`
**Proposito inferido por nombre y JSX:** vista `DashboardPrincipal`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../api/finanzas`, `react`, `lucide-react`, `../../utilidades/moneda`, `../../seguridad/Sesion`, `../DashboardM7/PanelGeneralM7`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
**Proposito inferido por nombre y JSX:** vista `DashboardWrapper`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `../../seguridad/Sesion`, `react`, `react-router-dom`, `../Mantenedores/permisos`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DetallePagoRemuneracion/DetallePagoRemuneracion.tsx`
**Proposito inferido por nombre y JSX:** vista `DetallePagoRemuneracion`.
**Hooks detectados:** useCallback, useEffect, useParams, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
**Proposito inferido por nombre y JSX:** vista `DetalleRemuneracion`.
**Hooks detectados:** useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
**Proposito inferido por nombre y JSX:** vista `DocumentosProveedor`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/DocumentosRemuneracion/DocumentosRemuneracion.tsx`
**Proposito inferido por nombre y JSX:** vista `DocumentosRemuneracion`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx`
**Proposito inferido por nombre y JSX:** vista `EnviosImportaciones`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx`
**Proposito inferido por nombre y JSX:** vista `EsquemasRemuneracionales`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx`
**Proposito inferido por nombre y JSX:** vista `FichaEmpleado`.
**Hooks detectados:** useEffect, useNavigate, useParams, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx`
**Proposito inferido por nombre y JSX:** vista `DetalleOrdenTrabajo`.
**Hooks detectados:** useCallback, useEffect, useMemo, useParams, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`, `../GestionTerreno/DetalleVisitaTerreno`, `../GestionTerreno/tipos`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/GestionOrdenesTrabajo/GestionOrdenesTrabajo.tsx`
**Proposito inferido por nombre y JSX:** vista `GestionOrdenesTrabajo`.
**Hooks detectados:** useEffect, useMemo, useRef, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/GestionTerreno/DetalleVisitaTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `DetalleVisitaTerreno`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react-router-dom`, `./tipos`, `./tipos`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/GestionTerreno/GestionTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `GestionTerreno`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** fetch.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `../../seguridad/Sesion`, `./DetalleVisitaTerreno`, `./tipos`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Honorarios/Honorarios.tsx`
**Proposito inferido por nombre y JSX:** vista `Honorarios`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `IncidenciasTerreno`.
**Hooks detectados:** useCallback, useEffect, useMemo, useState.
**Acceso API detectado:** fetch.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../components/DialogosSistema`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx`
**Proposito inferido por nombre y JSX:** vista `LevantamientoTecnico`.
**Hooks detectados:** useEffect, useParams, useState.
**Acceso API detectado:** fetch.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Mantenedores/AreasTrabajo.tsx`
**Proposito inferido por nombre y JSX:** vista `AreasTrabajo`.
**Hooks detectados:** useEffect, useNavigate, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Mantenedores/CatalogosComerciales.tsx`
**Proposito inferido por nombre y JSX:** vista `CatalogosComerciales`.
**Hooks detectados:** useCallback, useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../components/ModalFormulario`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Mantenedores/DocumentosComerciales.tsx`
**Proposito inferido por nombre y JSX:** vista `DocumentosComerciales`.
**Hooks detectados:** useCallback, useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `lucide-react`, `react`, `react-router-dom`, `../../api/finanzas`, `../../components/ModalFormulario`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Mantenedores/Mantenedores.tsx`
**Proposito inferido por nombre y JSX:** vista `Mantenedores`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `react`, `react-router-dom`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Mantenedores/PlantillaFabricacionFamilia.tsx`
**Proposito inferido por nombre y JSX:** vista `PlantillaFabricacionFamilia`.
**Hooks detectados:** useCallback, useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `../../api/finanzas`, `../../components/DialogosSistema`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Mantenedores/ProductosFamilias.tsx`
**Proposito inferido por nombre y JSX:** vista `ProductosFamilias`.
**Hooks detectados:** useCallback, useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../components/DialogosSistema`, `../../components/ModalFormulario`, `../../components/documental/PanelDocumentosProductoConectado`, `../../seguridad/Sesion`, `./PlantillaFabricacionFamilia`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Mantenedores/TareasFabricacion.tsx`
**Proposito inferido por nombre y JSX:** vista `TareasFabricacion`.
**Hooks detectados:** useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx`
**Proposito inferido por nombre y JSX:** vista `MantenedorParametros`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `MisTareasTerreno`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** fetch.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/NotaDeVentaDirecta/NotaDeVentaDirecta.tsx`
**Proposito inferido por nombre y JSX:** vista `NotaDeVentaDirecta`.
**Hooks detectados:** useEffect, useRef, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `../../api/finanzas`, `react`, `lucide-react`, `../../utilidades/moneda`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx`
**Proposito inferido por nombre y JSX:** vista `OrdenesCompraServicios`.
**Hooks detectados:** useCallback, useEffect, useNavigate, useParams, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `react-router-dom`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Pagos/PagosCliente.tsx`
**Proposito inferido por nombre y JSX:** vista `PagosCliente`.
**Hooks detectados:** useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `../../api/finanzas`, `../../utilidades/moneda`, `../../utilidades/pagos`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/PagosProveedores/PagosProveedores.tsx`
**Proposito inferido por nombre y JSX:** vista `PagosProveedores`.
**Hooks detectados:** useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/PeriodosRemuneracion/PeriodosRemuneracion.tsx`
**Proposito inferido por nombre y JSX:** vista `PeriodosRemuneracion`.
**Hooks detectados:** useCallback, useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/PortalPrincipal/InventarioPendiente.tsx`
**Proposito inferido por nombre y JSX:** vista `InventarioPendiente`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react-router-dom`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/PortalPrincipal/PortalPrincipal.tsx`
**Proposito inferido por nombre y JSX:** vista `PortalPrincipal`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react-router-dom`, `../../seguridad/Sesion`, `../../seguridad/accesosSistemas`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/ProduccionTerreno/ProduccionTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `ProduccionTerreno`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** fetch.
**Dependencias locales:** `react`, `lucide-react`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/RegistroPagosRemuneracion/RegistroPagosRemuneracion.tsx`
**Proposito inferido por nombre y JSX:** vista `RegistroPagosRemuneracion`.
**Hooks detectados:** useCallback, useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Seguridad/Acceso.tsx`
**Proposito inferido por nombre y JSX:** vista `Acceso`.
**Hooks detectados:** useEffect, useNavigate, useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `react`, `react-router-dom`, `lucide-react`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Seguridad/Sesiones.tsx`
**Proposito inferido por nombre y JSX:** vista `Sesiones`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `../../components/DialogosSistema`, `react`, `../../seguridad/Sesion`, `./Acceso`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Seguridad/Usuarios.tsx`
**Proposito inferido por nombre y JSX:** vista `Usuarios`.
**Hooks detectados:** useEffect, useMemo, useRef, useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `react`, `lucide-react`, `../../seguridad/Sesion`, `./Acceso`, `./permisosM4`, `./permisosM4`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Terreno/AgendaTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `AgendaTerreno`.
**Hooks detectados:** useCallback, useEffect, useMemo, useState.
**Acceso API detectado:** fetch.
**Dependencias locales:** `lucide-react`, `react`, `react-router-dom`, `../../seguridad/Sesion`, `../GestionTerreno/DetalleVisitaTerreno`, `../GestionTerreno/tipos`, `../GestionTerreno/tipos`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Terreno/GraficosTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `GraficosTerreno`.
**Hooks detectados:** ninguno explicito.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `recharts`, `./dashboardTerreno`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Terreno/InicioTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `InicioTerreno`.
**Hooks detectados:** useCallback, useEffect, useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react`, `react-router-dom`, `./GraficosTerreno`, `./dashboardTerreno`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Terreno/InstalacionesTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `InstalacionesTerreno`.
**Hooks detectados:** useCallback, useEffect, useMemo, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `lucide-react`, `react-router-dom`, `../../api/finanzas`, `../../seguridad/Sesion`, `../GestionTerreno/DetalleVisitaTerreno`, `../GestionTerreno/tipos`, `./resumenInstalaciones`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Terreno/ReportesTerreno.tsx`
**Proposito inferido por nombre y JSX:** vista `ReportesTerreno`.
**Hooks detectados:** useCallback, useEffect, useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react`, `./dashboardTerreno`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
**Proposito inferido por nombre y JSX:** vista `TerrenoWrapper`.
**Hooks detectados:** useState.
**Acceso API detectado:** no detectado por patron.
**Dependencias locales:** `lucide-react`, `react`, `react-router-dom`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/VerFicha/VerFicha.tsx`
**Proposito inferido por nombre y JSX:** vista `VerFicha`.
**Hooks detectados:** useEffect, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `../../components/DialogosSistema`, `../../api/finanzas`, `react`, `lucide-react`, `../../components/ModalDetalleDocumento`, `../Credito/CreditoCliente`, `../../components/documental/DocumentosHistoricosCotizacion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.
## `Vistas/src/views/VerFichaProveedor/VerFichaProveedor.tsx`
**Proposito inferido por nombre y JSX:** vista `VerFichaProveedor`.
**Hooks detectados:** useEffect, useParams, useState.
**Acceso API detectado:** solicitarFinanzas.
**Dependencias locales:** `react`, `react-router-dom`, `lucide-react`, `../../api/finanzas`, `../../seguridad/Sesion`
**Revision requerida:** validar campos, estados vacios, error HTTP, permiso, responsive y navegacion directa.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
