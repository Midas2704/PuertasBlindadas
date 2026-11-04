# Manual de usuario completo

**Proyecto:** Puertas Blindadas
**Documento:** 04
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

## Mapa de pantallas detectadas
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
## Inicio de sesion
Ingresar credenciales autorizadas. Un error no debe revelar si existe una cuenta.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Portal
Elegir Finanzas o Terreno. Inventario puede aparecer como pendiente segun la version.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Clientes
Buscar, crear y mantener la ficha financiera sin confundirla con tablas heredadas.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Cotizaciones
Elegir B2B/B2C, cliente compatible, productos, servicios y condiciones; previsualizar no emite.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Documentos PDF
Vista previa es borrador. Emitido es historico, confirmado y no se regenera con precios actuales.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Nota de Venta
Nace del flujo comercial autorizado; los reintentos no deben duplicarla.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Obras y Proyectos
Obra es el lugar fisico; Proyecto es el pedido. Una obra admite varios proyectos.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Ordenes de Trabajo
Cada puerta fisica aprobada produce una unidad y una OT pendiente de rectificacion.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Rectificacion
Asignar rectificador, registrar medidas, enviar a aprobacion tecnica y conservar versiones.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Produccion
Liberar tareas solo despues de aprobacion tecnica; respetar dependencias y cierre.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Terreno
Gestionar agenda, visitas, instalaciones e incidencias segun alcance y permisos.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Finanzas
Pagos, proveedores, compras, remuneraciones, credito y dashboard tienen validaciones propias.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Seguridad
Usuarios ven acciones segun perfil, CU particulares, dependencia y alcance.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Auditoria
M9 muestra evidencia, integridad y eventos comprometidos sin ocultarlos.
### Procedimiento seguro
1. Abrir la pantalla desde el menu correspondiente.
2. Confirmar que el encabezado y contexto coincidan con la tarea.
3. Completar campos obligatorios.
4. Revisar el resumen antes de confirmar.
5. Verificar el mensaje y el registro resultante.
### Si falla
Leer el mensaje completo. No repetir a ciegas una accion de escritura. Informar a soporte con pantalla, hora, usuario y operacion, sin compartir contrasenas.
## Guia pantalla por pantalla
## Pantalla `/login` - Acceso
**Donde entrar:** desde el menu que conduce a / login; la ruta declarada esta en `Vistas/src/App.tsx:85`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `Acceso` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `/recuperar` - Acceso
**Donde entrar:** desde el menu que conduce a / recuperar; la ruta declarada esta en `Vistas/src/App.tsx:86`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `Acceso` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `/` - PortalPrincipal
**Donde entrar:** desde el menu que conduce a /; la ruta declarada esta en `Vistas/src/App.tsx:87`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `PortalPrincipal` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `/inventario` - InventarioPendiente
**Donde entrar:** desde el menu que conduce a / inventario; la ruta declarada esta en `Vistas/src/App.tsx:88`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `InventarioPendiente` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `usuarios` - Usuarios
**Donde entrar:** desde el menu que conduce a usuarios; la ruta declarada esta en `Vistas/src/App.tsx:90`.
**Permiso visible:** CU67.
**Que deberia aparecer:** el componente `Usuarios` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `sesiones` - Sesiones
**Donde entrar:** desde el menu que conduce a sesiones; la ruta declarada esta en `Vistas/src/App.tsx:91`.
**Permiso visible:** CU73.
**Que deberia aparecer:** el componente `Sesiones` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `cuenta/clave` - Acceso
**Donde entrar:** desde el menu que conduce a cuenta / clave; la ruta declarada esta en `Vistas/src/App.tsx:92`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `Acceso` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `finanzas` - DashboardPrincipal
**Donde entrar:** desde el menu que conduce a finanzas; la ruta declarada esta en `Vistas/src/App.tsx:93`.
**Permiso visible:** CU05.
**Que deberia aparecer:** el componente `DashboardPrincipal` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `clientes` - CatalogoClientes
**Donde entrar:** desde el menu que conduce a clientes; la ruta declarada esta en `Vistas/src/App.tsx:94`.
**Permiso visible:** CU05.
**Que deberia aparecer:** el componente `CatalogoClientes` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `clientes/:rut` - VerFicha
**Donde entrar:** desde el menu que conduce a clientes / RUT; la ruta declarada esta en `Vistas/src/App.tsx:95`.
**Permiso visible:** CU09.
**Que deberia aparecer:** el componente `VerFicha` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `proveedores` - CatalogoProveedores
**Donde entrar:** desde el menu que conduce a proveedores; la ruta declarada esta en `Vistas/src/App.tsx:96`.
**Permiso visible:** CU80.
**Que deberia aparecer:** el componente `CatalogoProveedores` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `proveedores/:id` - VerFichaProveedor
**Donde entrar:** desde el menu que conduce a proveedores / identificador; la ruta declarada esta en `Vistas/src/App.tsx:97`.
**Permiso visible:** CU84.
**Que deberia aparecer:** el componente `VerFichaProveedor` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `ordenes-compra-servicios` - OrdenesCompraServicios
**Donde entrar:** desde el menu que conduce a ordenes compra servicios; la ruta declarada esta en `Vistas/src/App.tsx:98`.
**Permiso visible:** CU88.
**Que deberia aparecer:** el componente `OrdenesCompraServicios` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `ordenes-compra-servicios/:id` - OrdenesCompraServicios
**Donde entrar:** desde el menu que conduce a ordenes compra servicios / identificador; la ruta declarada esta en `Vistas/src/App.tsx:99`.
**Permiso visible:** CU88.
**Que deberia aparecer:** el componente `OrdenesCompraServicios` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `documentos-proveedor` - DocumentosProveedor
**Donde entrar:** desde el menu que conduce a documentos proveedor; la ruta declarada esta en `Vistas/src/App.tsx:100`.
**Permiso visible:** CU95.
**Que deberia aparecer:** el componente `DocumentosProveedor` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `cuentas-por-pagar` - CuentasPorPagar
**Donde entrar:** desde el menu que conduce a cuentas por pagar; la ruta declarada esta en `Vistas/src/App.tsx:101`.
**Permiso visible:** CU106.
**Que deberia aparecer:** el componente `CuentasPorPagar` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `pagos-proveedores` - PagosProveedores
**Donde entrar:** desde el menu que conduce a pagos proveedores; la ruta declarada esta en `Vistas/src/App.tsx:102`.
**Permiso visible:** CU111.
**Que deberia aparecer:** el componente `PagosProveedores` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `categorias-egreso` - CategoriasEgreso
**Donde entrar:** desde el menu que conduce a categorias egreso; la ruta declarada esta en `Vistas/src/App.tsx:103`.
**Permiso visible:** CU134.
**Que deberia aparecer:** el componente `CategoriasEgreso` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `envios-importaciones` - EnviosImportaciones
**Donde entrar:** desde el menu que conduce a envios importaciones; la ruta declarada esta en `Vistas/src/App.tsx:104`.
**Permiso visible:** CU142.
**Que deberia aparecer:** el componente `EnviosImportaciones` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `caja-chica` - CajaChica
**Donde entrar:** desde el menu que conduce a caja chica; la ruta declarada esta en `Vistas/src/App.tsx:105`.
**Permiso visible:** CU149.
**Que deberia aparecer:** el componente `CajaChica` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `empleados` - CatalogoEmpleados
**Donde entrar:** desde el menu que conduce a empleados; la ruta declarada esta en `Vistas/src/App.tsx:106`.
**Permiso visible:** CU155.
**Que deberia aparecer:** el componente `CatalogoEmpleados` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `empleados/:id` - FichaEmpleado
**Donde entrar:** desde el menu que conduce a empleados / identificador; la ruta declarada esta en `Vistas/src/App.tsx:107`.
**Permiso visible:** CU155.
**Que deberia aparecer:** el componente `FichaEmpleado` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `esquemas-remuneracionales` - EsquemasRemuneracionales
**Donde entrar:** desde el menu que conduce a esquemas remuneracionales; la ruta declarada esta en `Vistas/src/App.tsx:108`.
**Permiso visible:** CU162, CU163, CU164, CU165, CU166.
**Que deberia aparecer:** el componente `EsquemasRemuneracionales` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `parametros-remuneraciones` - MantenedorParametros
**Donde entrar:** desde el menu que conduce a parametros remuneraciones; la ruta declarada esta en `Vistas/src/App.tsx:109`.
**Permiso visible:** CU167, CU168, CU169, CU170, CU171, CU246, CU268.
**Que deberia aparecer:** el componente `MantenedorParametros` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `periodos-remuneracion` - PeriodosRemuneracion
**Donde entrar:** desde el menu que conduce a periodos remuneracion; la ruta declarada esta en `Vistas/src/App.tsx:110`.
**Permiso visible:** CU178, CU181.
**Que deberia aparecer:** el componente `PeriodosRemuneracion` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `detalle-remuneracion` - DetalleRemuneracion
**Donde entrar:** desde el menu que conduce a detalle remuneracion; la ruta declarada esta en `Vistas/src/App.tsx:111`.
**Permiso visible:** CU172, CU173, CU174, CU175, CU176, CU177, CU179, CU180, CU182, CU183, CU184.
**Que deberia aparecer:** el componente `DetalleRemuneracion` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `pagos-remuneraciones` - RegistroPagosRemuneracion
**Donde entrar:** desde el menu que conduce a pagos remuneraciones; la ruta declarada esta en `Vistas/src/App.tsx:112`.
**Permiso visible:** CU185, CU186, CU187, CU188, CU189, CU190.
**Que deberia aparecer:** el componente `RegistroPagosRemuneracion` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `pagos-remuneraciones/:id` - DetallePagoRemuneracion
**Donde entrar:** desde el menu que conduce a pagos remuneraciones / identificador; la ruta declarada esta en `Vistas/src/App.tsx:113`.
**Permiso visible:** CU188, CU189, CU190.
**Que deberia aparecer:** el componente `DetallePagoRemuneracion` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `documentos-remuneracion` - DocumentosRemuneracion
**Donde entrar:** desde el menu que conduce a documentos remuneracion; la ruta declarada esta en `Vistas/src/App.tsx:114`.
**Permiso visible:** CU191, CU192, CU193.
**Que deberia aparecer:** el componente `DocumentosRemuneracion` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `honorarios` - Honorarios
**Donde entrar:** desde el menu que conduce a honorarios; la ruta declarada esta en `Vistas/src/App.tsx:115`.
**Permiso visible:** CU196, CU197, CU198.
**Que deberia aparecer:** el componente `Honorarios` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7` - PanelGeneralM7
**Donde entrar:** desde el menu que conduce a dashboard m7; la ruta declarada esta en `Vistas/src/App.tsx:116`.
**Permiso visible:** CU215.
**Que deberia aparecer:** el componente `PanelGeneralM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/centro-atencion` - CentroAtencionM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / centro atencion; la ruta declarada esta en `Vistas/src/App.tsx:117`.
**Permiso visible:** CU216.
**Que deberia aparecer:** el componente `CentroAtencionM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/cotizaciones-pendientes` - CotizacionesPendientesM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / cotizaciones pendientes; la ruta declarada esta en `Vistas/src/App.tsx:118`.
**Permiso visible:** CU217.
**Que deberia aparecer:** el componente `CotizacionesPendientesM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/clientes/:id` - ContextoClienteM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / clientes / identificador; la ruta declarada esta en `Vistas/src/App.tsx:119`.
**Permiso visible:** CU221.
**Que deberia aparecer:** el componente `ContextoClienteM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/ventas` - AnalisisVentasM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / ventas; la ruta declarada esta en `Vistas/src/App.tsx:120`.
**Permiso visible:** CU218, CU219, CU220.
**Que deberia aparecer:** el componente `AnalisisVentasM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/cuentas-cobrar` - CuentasCobrarM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / cuentas cobrar; la ruta declarada esta en `Vistas/src/App.tsx:121`.
**Permiso visible:** CU222, CU223, CU224, CU225.
**Que deberia aparecer:** el componente `CuentasCobrarM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/cuentas-pagar` - CuentasPagarM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / cuentas pagar; la ruta declarada esta en `Vistas/src/App.tsx:122`.
**Permiso visible:** CU226, CU227.
**Que deberia aparecer:** el componente `CuentasPagarM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/liquidez` - LiquidezM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / liquidez; la ruta declarada esta en `Vistas/src/App.tsx:123`.
**Permiso visible:** CU228, CU229, CU230, CU231.
**Que deberia aparecer:** el componente `LiquidezM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/riesgo-deficit` - RiesgoDeficitM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / riesgo deficit; la ruta declarada esta en `Vistas/src/App.tsx:124`.
**Permiso visible:** CU232.
**Que deberia aparecer:** el componente `RiesgoDeficitM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/margen-proyectos` - MargenProyectosM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / margen proyectos; la ruta declarada esta en `Vistas/src/App.tsx:125`.
**Permiso visible:** CU233, CU234, CU235.
**Que deberia aparecer:** el componente `MargenProyectosM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/proyectos/exposicion` - ExposicionProyectosM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / proyectos / exposicion; la ruta declarada esta en `Vistas/src/App.tsx:126`.
**Permiso visible:** CU236.
**Que deberia aparecer:** el componente `ExposicionProyectosM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/proyectos/:id` - ContextoProyectoM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / proyectos / identificador; la ruta declarada esta en `Vistas/src/App.tsx:127`.
**Permiso visible:** CU237.
**Que deberia aparecer:** el componente `ContextoProyectoM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/resumenes` - ResumenesM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / resumenes; la ruta declarada esta en `Vistas/src/App.tsx:128`.
**Permiso visible:** CU238, CU239.
**Que deberia aparecer:** el componente `ResumenesM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/operacion` - OperacionCostosM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / operacion; la ruta declarada esta en `Vistas/src/App.tsx:129`.
**Permiso visible:** CU242, CU247, CU248, CU250, CU252, CU253.
**Que deberia aparecer:** el componente `OperacionCostosM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `dashboard-m7/control` - DeltaControladoM7
**Donde entrar:** desde el menu que conduce a dashboard m7 / control; la ruta declarada esta en `Vistas/src/App.tsx:130`.
**Permiso visible:** CU228, CU232, CU240, CU241, CU243, CU244, CU249, CU251, CU254, CU255, CU256, CU257, CU258.
**Que deberia aparecer:** el componente `DeltaControladoM7` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `credito` - SolicitudesCredito
**Donde entrar:** desde el menu que conduce a credito; la ruta declarada esta en `Vistas/src/App.tsx:131`.
**Permiso visible:** CU259.
**Que deberia aparecer:** el componente `SolicitudesCredito` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `credito/solicitudes` - SolicitudesCredito
**Donde entrar:** desde el menu que conduce a credito / solicitudes; la ruta declarada esta en `Vistas/src/App.tsx:132`.
**Permiso visible:** CU259.
**Que deberia aparecer:** el componente `SolicitudesCredito` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `credito/solicitudes/:id` - SolicitudesCredito
**Donde entrar:** desde el menu que conduce a credito / solicitudes / identificador; la ruta declarada esta en `Vistas/src/App.tsx:133`.
**Permiso visible:** CU259.
**Que deberia aparecer:** el componente `SolicitudesCredito` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `auditoria` - Auditoria
**Donde entrar:** desde el menu que conduce a auditoria; la ruta declarada esta en `Vistas/src/App.tsx:134`.
**Permiso visible:** CU355.
**Que deberia aparecer:** el componente `Auditoria` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `mantenedores` - Mantenedores
**Donde entrar:** desde el menu que conduce a mantenedores; la ruta declarada esta en `Vistas/src/App.tsx:135`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `Mantenedores` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `mantenedores/productos` - ProductosFamilias
**Donde entrar:** desde el menu que conduce a mantenedores / productos; la ruta declarada esta en `Vistas/src/App.tsx:136`.
**Permiso visible:** CU360.
**Que deberia aparecer:** el componente `ProductosFamilias` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `mantenedores/comercial` - CatalogosComerciales
**Donde entrar:** desde el menu que conduce a mantenedores / comercial; la ruta declarada esta en `Vistas/src/App.tsx:137`.
**Permiso visible:** CU360.
**Que deberia aparecer:** el componente `CatalogosComerciales` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `mantenedores/documentos-comerciales` - DocumentosComerciales
**Donde entrar:** desde el menu que conduce a mantenedores / documentos comerciales; la ruta declarada esta en `Vistas/src/App.tsx:138`.
**Permiso visible:** CU360.
**Que deberia aparecer:** el componente `DocumentosComerciales` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `mantenedores/areas-trabajo` - AreasTrabajo
**Donde entrar:** desde el menu que conduce a mantenedores / areas trabajo; la ruta declarada esta en `Vistas/src/App.tsx:139`.
**Permiso visible:** CU155, CU157.
**Que deberia aparecer:** el componente `AreasTrabajo` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `mantenedores/tareas-fabricacion` - TareasFabricacion
**Donde entrar:** desde el menu que conduce a mantenedores / tareas fabricacion; la ruta declarada esta en `Vistas/src/App.tsx:140`.
**Permiso visible:** CU360.
**Que deberia aparecer:** el componente `TareasFabricacion` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `cotizacion/nueva` - ArmarCotizacion
**Donde entrar:** desde el menu que conduce a cotizacion / nueva; la ruta declarada esta en `Vistas/src/App.tsx:141`.
**Permiso visible:** CU19, CU20.
**Que deberia aparecer:** el componente `ArmarCotizacion` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `venta/directa` - NotaDeVentaDirecta
**Donde entrar:** desde el menu que conduce a venta / directa; la ruta declarada esta en `Vistas/src/App.tsx:142`.
**Permiso visible:** CU27.
**Que deberia aparecer:** el componente `NotaDeVentaDirecta` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `aprobaciones` - BandejaAprobacionGerencia
**Donde entrar:** desde el menu que conduce a aprobaciones; la ruta declarada esta en `Vistas/src/App.tsx:143`.
**Permiso visible:** CU20.
**Que deberia aparecer:** el componente `BandejaAprobacionGerencia` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `pagos` - PagosCliente
**Donde entrar:** desde el menu que conduce a pagos; la ruta declarada esta en `Vistas/src/App.tsx:144`.
**Permiso visible:** CU42.
**Que deberia aparecer:** el componente `PagosCliente` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `configuracion/umbral` - UmbralPorVencer
**Donde entrar:** desde el menu que conduce a configuracion / umbral; la ruta declarada esta en `Vistas/src/App.tsx:145`.
**Permiso visible:** CU41.
**Que deberia aparecer:** el componente `UmbralPorVencer` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `/terreno` - TerrenoWrapper
**Donde entrar:** desde el menu que conduce a / terreno; la ruta declarada esta en `Vistas/src/App.tsx:147`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `TerrenoWrapper` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `(index)` - InicioTerreno
**Donde entrar:** desde el menu que conduce a (index); la ruta declarada esta en `Vistas/src/App.tsx:148`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `InicioTerreno` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `reportes` - ReportesTerreno
**Donde entrar:** desde el menu que conduce a reportes; la ruta declarada esta en `Vistas/src/App.tsx:149`.
**Permiso visible:** CU199, CU200, CU202, CU205, CU207, CU209, CU210, CU211, CU212, CU213.
**Que deberia aparecer:** el componente `ReportesTerreno` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `agenda` - AgendaTerreno
**Donde entrar:** desde el menu que conduce a agenda; la ruta declarada esta en `Vistas/src/App.tsx:150`.
**Permiso visible:** CU199, CU200, CU210.
**Que deberia aparecer:** el componente `AgendaTerreno` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `instalaciones` - InstalacionesTerreno
**Donde entrar:** desde el menu que conduce a instalaciones; la ruta declarada esta en `Vistas/src/App.tsx:151`.
**Permiso visible:** CU199, CU200, CU210, CU211.
**Que deberia aparecer:** el componente `InstalacionesTerreno` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `visitas` - GestionTerreno
**Donde entrar:** desde el menu que conduce a visitas; la ruta declarada esta en `Vistas/src/App.tsx:152`.
**Permiso visible:** CU199, CU200, CU210, CU211.
**Que deberia aparecer:** el componente `GestionTerreno` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `mis-tareas` - MisTareasTerreno
**Donde entrar:** desde el menu que conduce a mis tareas; la ruta declarada esta en `Vistas/src/App.tsx:153`.
**Permiso visible:** CU201, CU208.
**Que deberia aparecer:** el componente `MisTareasTerreno` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `produccion` - ProduccionTerreno
**Donde entrar:** desde el menu que conduce a produccion; la ruta declarada esta en `Vistas/src/App.tsx:154`.
**Permiso visible:** CU207, CU209.
**Que deberia aparecer:** el componente `ProduccionTerreno` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `incidencias` - IncidenciasTerreno
**Donde entrar:** desde el menu que conduce a incidencias; la ruta declarada esta en `Vistas/src/App.tsx:155`.
**Permiso visible:** CU212, CU213.
**Que deberia aparecer:** el componente `IncidenciasTerreno` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `ordenes-trabajo` - GestionOrdenesTrabajo
**Donde entrar:** desde el menu que conduce a ordenes trabajo; la ruta declarada esta en `Vistas/src/App.tsx:156`.
**Permiso visible:** CU202, CU205, CU207, CU209.
**Que deberia aparecer:** el componente `GestionOrdenesTrabajo` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `ordenes-trabajo/:id` - DetalleOrdenTrabajo
**Donde entrar:** desde el menu que conduce a ordenes trabajo / identificador; la ruta declarada esta en `Vistas/src/App.tsx:157`.
**Permiso visible:** CU202, CU205, CU207, CU209.
**Que deberia aparecer:** el componente `DetalleOrdenTrabajo` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `tareas/:id/levantamiento` - LevantamientoTecnico
**Donde entrar:** desde el menu que conduce a tareas / identificador / levantamiento; la ruta declarada esta en `Vistas/src/App.tsx:158`.
**Permiso visible:** CU202, CU203, CU204, CU205, CU206.
**Que deberia aparecer:** el componente `LevantamientoTecnico` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `/terreno/ordenes-trabajo/:id` - DetalleOrdenTrabajo
**Donde entrar:** desde el menu que conduce a / terreno / ordenes trabajo / identificador; la ruta declarada esta en `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx:25`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `DetalleOrdenTrabajo` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `/terreno/ordenes-trabajo/:id` - DetalleOrdenTrabajo
**Donde entrar:** desde el menu que conduce a / terreno / ordenes trabajo / identificador; la ruta declarada esta en `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx:37`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `DetalleOrdenTrabajo` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `ordenes-compra-servicios` - OrdenesCompraServicios
**Donde entrar:** desde el menu que conduce a ordenes compra servicios; la ruta declarada esta en `Vistas/src/views/verificacionAccionesFinal.test.tsx:32`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `OrdenesCompraServicios` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Pantalla `ordenes-compra-servicios/:id` - OrdenesCompraServicios
**Donde entrar:** desde el menu que conduce a ordenes compra servicios / identificador; la ruta declarada esta en `Vistas/src/views/verificacionAccionesFinal.test.tsx:43`.
**Permiso visible:** ruta publica, indice o contenedora; la API puede exigir autorizacion adicional.
**Que deberia aparecer:** el componente `OrdenesCompraServicios` y sus estados de carga, contenido, vacio y error.
**Antes de guardar:** comprobar entidad, estado, campos obligatorios, importes/fechas y alcance.
**Resultado esperado:** mensaje explicito y cambio visible coherente; una operacion de escritura debe poder trazarse en backend y, cuando corresponde, en M9.
**Como volver:** usar la navegacion propia de la pantalla o el menu; abrir la URL directamente no debe romper el retorno.
**Que no hacer:** no repetir confirmaciones por impaciencia, no usar datos reales en pruebas y no interpretar un 403 como ausencia de registros.
## Limitaciones visibles
La validacion visual por una usuaria no se deduce del codigo. Funciones bloqueadas o pendientes deben conservar su etiqueta; no se consideran operativas por tener un boton.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
