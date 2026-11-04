# Terreno, rectificacion y produccion

**Proyecto:** Puertas Blindadas
**Documento:** 18
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

## Identidades

Obra es el lugar fisico. Proyecto es el pedido. Producto comercial es el modelo. Linea comercial agrupa cantidades. Unidad fisica representa una puerta contratada. OT organiza el trabajo de esa unidad.

## Flujo operacional

Cotizacion aprobada -> unidad fisica y OT `PENDIENTE_RECTIFICACION` -> asignacion -> medidas -> version de rectificacion -> aprobacion tecnica -> liberacion -> tareas productivas -> ejecucion -> validacion -> cierre.

## Diez puertas

Una linea de cantidad 10 genera diez unidades fisicas y diez OT. No crea diez productos maestros. Instalacion, flete y servicios no generan OT de puerta.

## Acceso

Midas raiz y usuarios con capacidades generales ven las OT dentro de su autorizacion. Un rectificador normal ve asignadas. Falta de alcance produce 403 explicito, no bandeja vacia.

## Historial

Las medidas y versiones enviadas se conservan. Una correccion produce nueva version. La aprobacion debe ser independiente del rectificador. Tareas no se ejecutan antes de liberacion ni fuera de dependencias.

## Metodos relacionados
| Clase | Metodo | Archivo | Linea |
| --- | --- | --- | --- |
| M6Controller | presentarUsuarioTerreno | Controladores/src/controladores/M6Controller.ts | 2399 |
| M6Controller | presentarObraTerreno | Controladores/src/controladores/M6Controller.ts | 2405 |
| M6Controller | presentarVisitaTerreno | Controladores/src/controladores/M6Controller.ts | 2416 |
| M6Controller | presentarDetalleVisitaTerreno | Controladores/src/controladores/M6Controller.ts | 2426 |
| M6Controller | crearVisitaTerreno | Controladores/src/controladores/M6Controller.ts | 2450 |
| M6Controller | listarObrasTerreno | Controladores/src/controladores/M6Controller.ts | 2470 |
| M6Controller | listarVisitasTerreno | Controladores/src/controladores/M6Controller.ts | 2475 |
| M6Controller | obtenerVisitaTerreno | Controladores/src/controladores/M6Controller.ts | 2480 |
| M6Controller | listarInstalacionesTerreno | Controladores/src/controladores/M6Controller.ts | 2498 |
| M6Controller | listarUsuariosTerreno | Controladores/src/controladores/M6Controller.ts | 2547 |
| M6Controller | asignarResponsableVisita | Controladores/src/controladores/M6Controller.ts | 2552 |
| M6Controller | listarMisTareasTerreno | Controladores/src/controladores/M6Controller.ts | 2564 |
| M6Controller | resolverLevantamientoTerreno | Controladores/src/controladores/M6Controller.ts | 2619 |
| M6Controller | presentarLevantamientoTerreno | Controladores/src/controladores/M6Controller.ts | 2639 |
| M6Controller | obtenerLevantamientoTerreno | Controladores/src/controladores/M6Controller.ts | 2686 |
| M6Controller | guardarLevantamientoTerreno | Controladores/src/controladores/M6Controller.ts | 2690 |
| M6Controller | corregirLevantamientoTerreno | Controladores/src/controladores/M6Controller.ts | 2723 |
| M6Controller | puedeGestionarTodasLasRectificaciones | Controladores/src/controladores/M6Controller.ts | 2815 |
| M6Controller | verificarAccesoRectificacion | Controladores/src/controladores/M6Controller.ts | 2819 |
| M6Controller | listarOrdenesTrabajoRectificacion | Controladores/src/controladores/M6Controller.ts | 2905 |
| M6Controller | obtenerOrdenTrabajoRectificacion | Controladores/src/controladores/M6Controller.ts | 2920 |
| M6Controller | normalizarPlanificacionRectificacion | Controladores/src/controladores/M6Controller.ts | 2945 |
| M6Controller | guardarRectificacionOrdenTrabajo | Controladores/src/controladores/M6Controller.ts | 2956 |
| M6Controller | enviarRectificacionAprobacion | Controladores/src/controladores/M6Controller.ts | 2972 |
| M6Controller | aprobarRectificacionOrdenTrabajo | Controladores/src/controladores/M6Controller.ts | 2990 |
| M6Controller | devolverRectificacionOrdenTrabajo | Controladores/src/controladores/M6Controller.ts | 3001 |
| M6Controller | ajustarOrdenTrabajoTerreno | Controladores/src/controladores/M6Controller.ts | 3031 |
| M6Controller | liberarOrdenTrabajoTerreno | Controladores/src/controladores/M6Controller.ts | 3035 |
| M6Controller | generarTareasProduccion | Controladores/src/controladores/M6Controller.ts | 3059 |
| M6Controller | obtenerTareaProduccion | Controladores/src/controladores/M6Controller.ts | 3104 |
| M6Controller | presentarTareaProduccion | Controladores/src/controladores/M6Controller.ts | 3116 |
| M6Controller | listarTareasProduccion | Controladores/src/controladores/M6Controller.ts | 3130 |
| M6Controller | asignarTareaProduccion | Controladores/src/controladores/M6Controller.ts | 3135 |
| M6Controller | modificarTareaProduccion | Controladores/src/controladores/M6Controller.ts | 3154 |
| M6Controller | iniciarTareaProduccion | Controladores/src/controladores/M6Controller.ts | 3173 |
| M6Controller | agregarEtapaProduccion | Controladores/src/controladores/M6Controller.ts | 3210 |
| M6Controller | agregarTareaProduccion | Controladores/src/controladores/M6Controller.ts | 3215 |
| M6Controller | cerrarTareaProduccion | Controladores/src/controladores/M6Controller.ts | 3222 |
| M6Controller | solicitarCorreccionTecnicaProduccion | Controladores/src/controladores/M6Controller.ts | 3224 |
| M6Controller | finalizarOrdenTrabajoProduccion | Controladores/src/controladores/M6Controller.ts | 3226 |
| M6Controller | registrarResultadoVisita | Controladores/src/controladores/M6Controller.ts | 3267 |
| M6Controller | consultarDashboardTerreno | Controladores/src/controladores/M6Controller.ts | 3522 |
| M6Controller | exportarReporteTerreno | Controladores/src/controladores/M6Controller.ts | 3598 |
| M7Controller | consultarCuentasCobrarCompleto | Controladores/src/controladores/M7Controller.ts | 797 |
| M7Controller | consultarMargenProyectosCompleto | Controladores/src/controladores/M7Controller.ts | 1147 |
| M7Controller | consultarCuentasCobrar | Controladores/src/controladores/M7Controller.ts | 1310 |
| M7Controller | consultarMargenProyectos | Controladores/src/controladores/M7Controller.ts | 1394 |
| M7Controller | consultarExposicionProyectos | Controladores/src/controladores/M7Controller.ts | 1408 |
| M7Controller | consultarContextoProyecto | Controladores/src/controladores/M7Controller.ts | 1434 |
| M7Controller | consultarProduccionModelosCompleto | Controladores/src/controladores/M7Controller.ts | 1504 |
| M7Controller | consultarProduccionModelos | Controladores/src/controladores/M7Controller.ts | 1572 |
| M7Controller | consultarMaterialesProyectoOt | Controladores/src/controladores/M7Controller.ts | 1851 |
## Modelos relacionados
| Modelo | Schema | Tabla | Campos |
| --- | --- | --- | --- |
| costo_proyecto | finanzas | costo_proyecto | 13 |
| credito_proyecto | finanzas | credito_proyecto | 17 |
| detalle_costo_proyecto_documento_proveedor | finanzas | detalle_costo_proyecto_documento_proveedor | 8 |
| proyecto_financiero | finanzas | proyecto_financiero | 23 |
| material_orden_trabajo | inventario | material_orden_trabajo | 6 |
| orden_trabajo | inventario | orden_trabajo | 16 |
| especificacion_proyecto_terreno | terreno | especificacion_proyecto_terreno | 10 |
| especificacion_servicio_terreno | terreno | especificacion_servicio_terreno | 4 |
| evidencia_terreno | terreno | evidencia_terreno | 14 |
| historial_cambio_orden_trabajo | terreno | historial_cambio_orden_trabajo | 8 |
| notificacion_terreno | terreno | notificacion_terreno | 6 |
| obra | terreno | obra | 24 |
| proyecto | terreno | proyecto | 19 |
| proyecto_obra | terreno | proyecto_obra | 8 |
| servicio_terreno | terreno | servicio_terreno | 19 |
| servicio_tterreno_herramientas_materiales | terreno | servicio_tterreno_herramientas_materiales | 3 |
| categoria_incidencia_terreno | terreno | categoria_incidencia_terreno | 5 |
| unidad_fisica_orden_trabajo | finanzas | unidad_fisica_orden_trabajo | 31 |
| rectificacion_orden_trabajo | finanzas | rectificacion_orden_trabajo | 26 |
| version_rectificacion_orden_trabajo | finanzas | version_rectificacion_orden_trabajo | 16 |
| historial_rectificacion_orden_trabajo | finanzas | historial_rectificacion_orden_trabajo | 11 |
| decision_rectificacion_orden_trabajo | finanzas | decision_rectificacion_orden_trabajo | 11 |
| liberacion_orden_trabajo | finanzas | liberacion_orden_trabajo | 8 |
| estado_tarea_produccion_ot | finanzas | estado_tarea_produccion_ot | 17 |
| historial_cambio_produccion_ot | finanzas | historial_cambio_produccion_ot | 17 |
| etapa_adicional_orden_trabajo | finanzas | etapa_adicional_orden_trabajo | 14 |
| cierre_orden_trabajo_produccion | finanzas | cierre_orden_trabajo_produccion | 12 |
## Suites relacionadas
| Suite | Casos |
| --- | --- |
| Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs | 1 |
| Controladores/pruebas/m6-agenda-terreno.test.cjs | 7 |
| Controladores/pruebas/m6-dashboard-terreno.test.cjs | 13 |
| Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs | 23 |
| Controladores/pruebas/m7-produccion-modelos.test.cjs | 30 |
| Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.test.tsx | 3 |
| Vistas/src/views/Terreno/AgendaTerreno.test.tsx | 5 |
| Vistas/src/views/Terreno/dashboardTerreno.test.ts | 3 |
| Vistas/src/views/Terreno/InicioTerreno.test.ts | 3 |
| Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx | 4 |

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
