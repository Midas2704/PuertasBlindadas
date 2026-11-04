# Ciclo comercial B2B y B2C

**Proyecto:** Puertas Blindadas
**Documento:** 17
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

## Flujo comun

Cliente -> Cotizacion borrador -> Preview PDF -> Emision con documento confirmado -> Aceptacion -> Nota de Venta -> Proyecto -> Unidades fisicas -> OT.

## B2B

Usa cliente empresa, contactos propios de la cotizacion, proyecto/referencia, productos, instalacion y servicios como flete. La aprobacion exige la formalizacion empresarial definida. Los servicios no crean puertas ni OT.

## B2C

Usa cliente particular y puede presentar alternativas. Emitir una oferta no acepta alternativas. Solo la alternativa aceptada transaccionalmente se convierte en detalles contratados.

## Precios y condiciones

Se conservan versiones y snapshots. Costo interno, precio de lista y precio cotizado son conceptos distintos. Instalacion comercial no es el costo interno M7.

## Documentos

Preview es borrador y no crea NV/OT. Emision requiere plantilla publicada, validacion, PDF real, SHA, antivirus segun politica, storage confirmado, version documental y M9.

## Idempotencia

Repetir aprobacion/emision no duplica NV, unidades, OT ni PDF. Constraints, revision optimista y claves de idempotencia sostienen la regla.

## Metodos relacionados
| Clase | Metodo | Archivo | Linea |
| --- | --- | --- | --- |
| M2Controller | constructor | Controladores/src/controladores/M2Controller.ts | 448 |
| M2Controller | resolverTipoCambioCotizacion | Controladores/src/controladores/M2Controller.ts | 449 |
| M2Controller | aplicarAjusteProductoPlantilla | Controladores/src/controladores/M2Controller.ts | 465 |
| M2Controller | resolverPuertasCotizacion | Controladores/src/controladores/M2Controller.ts | 472 |
| M2Controller | normalizarPlanificacionesOt | Controladores/src/controladores/M2Controller.ts | 503 |
| M2Controller | obtenerPlanificacionAprobacionCotizacion | Controladores/src/controladores/M2Controller.ts | 548 |
| M2Controller | crearOrdenesTrabajoCotizacion | Controladores/src/controladores/M2Controller.ts | 560 |
| M2Controller | consolidarB2C | Controladores/src/controladores/M2Controller.ts | 578 |
| M2Controller | aprobarCotizacionB2B | Controladores/src/controladores/M2Controller.ts | 606 |
| M2Controller | registrarClienteDesdeCotizacion | Controladores/src/controladores/M2Controller.ts | 638 |
| M2Controller | emitirCotizacion | Controladores/src/controladores/M2Controller.ts | 663 |
| M2Controller | seleccionarAlternativaB2C | Controladores/src/controladores/M2Controller.ts | 681 |
| M2Controller | rechazarAlternativaB2C | Controladores/src/controladores/M2Controller.ts | 696 |
| M2Controller | aceptarAlternativaB2C | Controladores/src/controladores/M2Controller.ts | 709 |
| M2Controller | reactivarCotizacion | Controladores/src/controladores/M2Controller.ts | 745 |
| M2Controller | formalizarClienteB2C | Controladores/src/controladores/M2Controller.ts | 754 |
| M2Controller | configurarEtapasCobro | Controladores/src/controladores/M2Controller.ts | 771 |
| M2Controller | registrarReversion | Controladores/src/controladores/M2Controller.ts | 783 |
| M2Controller | listarInventario | Controladores/src/controladores/M2Controller.ts | 798 |
| M2Controller | listarProductos | Controladores/src/controladores/M2Controller.ts | 805 |
| M2Controller | listarFamiliasProductoComercial | Controladores/src/controladores/M2Controller.ts | 806 |
| M2Controller | crearFamiliaProductoComercial | Controladores/src/controladores/M2Controller.ts | 818 |
| M2Controller | actualizarFamiliaProductoComercial | Controladores/src/controladores/M2Controller.ts | 831 |
| M2Controller | cambiarEstadoFamiliaProductoComercial | Controladores/src/controladores/M2Controller.ts | 848 |
| M2Controller | historialFamiliaProductoComercial | Controladores/src/controladores/M2Controller.ts | 862 |
| M2Controller | listarProductosComerciales | Controladores/src/controladores/M2Controller.ts | 867 |
| M2Controller | datosProductoComercial | Controladores/src/controladores/M2Controller.ts | 873 |
| M2Controller | crearProductoComercial | Controladores/src/controladores/M2Controller.ts | 892 |
| M2Controller | actualizarProductoComercial | Controladores/src/controladores/M2Controller.ts | 905 |
| M2Controller | cambiarEstadoProductoComercial | Controladores/src/controladores/M2Controller.ts | 921 |
| M2Controller | vincularProductoComercial | Controladores/src/controladores/M2Controller.ts | 934 |
| M2Controller | publicarVersionProductoComercial | Controladores/src/controladores/M2Controller.ts | 953 |
| M2Controller | obtenerProductoComercial | Controladores/src/controladores/M2Controller.ts | 968 |
| M2Controller | catalogosVinculacionProductoComercial | Controladores/src/controladores/M2Controller.ts | 973 |
| M2Controller | listarTareasFabricacion | Controladores/src/controladores/M2Controller.ts | 980 |
| M2Controller | crearTareaFabricacion | Controladores/src/controladores/M2Controller.ts | 995 |
| M2Controller | actualizarTareaFabricacion | Controladores/src/controladores/M2Controller.ts | 1006 |
| M2Controller | cambiarEstadoTareaFabricacion | Controladores/src/controladores/M2Controller.ts | 1024 |
| M2Controller | normalizarPlantillaFabricacion | Controladores/src/controladores/M2Controller.ts | 1035 |
| M2Controller | obtenerPlantillaFabricacionFamilia | Controladores/src/controladores/M2Controller.ts | 1069 |
| M2Controller | guardarBorradorPlantillaFabricacion | Controladores/src/controladores/M2Controller.ts | 1075 |
| M2Controller | publicarPlantillaFabricacion | Controladores/src/controladores/M2Controller.ts | 1092 |
| M2Controller | listarMonedas | Controladores/src/controladores/M2Controller.ts | 1111 |
| M2Controller | consultarResumen | Controladores/src/controladores/M2Controller.ts | 1112 |
| M2Controller | consultarBandeja | Controladores/src/controladores/M2Controller.ts | 1121 |
| M2Controller | guardarCotizacion | Controladores/src/controladores/M2Controller.ts | 1139 |
| M2Controller | editarCotizacion | Controladores/src/controladores/M2Controller.ts | 1194 |
| M2Controller | crearVentaDirecta | Controladores/src/controladores/M2Controller.ts | 1297 |
| M2Controller | confirmarNotaVenta | Controladores/src/controladores/M2Controller.ts | 1337 |
| M2Controller | anularVenta | Controladores/src/controladores/M2Controller.ts | 1349 |
| M2Controller | registrarDocumento | Controladores/src/controladores/M2Controller.ts | 1361 |
| M2Controller | modificarGuia | Controladores/src/controladores/M2Controller.ts | 1400 |
| M2Controller | definirCondicionesCobro | Controladores/src/controladores/M2Controller.ts | 1409 |
| M2Controller | configurarUmbral | Controladores/src/controladores/M2Controller.ts | 1413 |
| M2Controller | consultarUmbral | Controladores/src/controladores/M2Controller.ts | 1420 |
| M2Controller | descartarBorrador | Controladores/src/controladores/M2Controller.ts | 1426 |
| M2Controller | operacionPendiente | Controladores/src/controladores/M2Controller.ts | 1431 |
| M7Controller | consultarCotizacionesPendientes | Controladores/src/controladores/M7Controller.ts | 658 |
## Modelos relacionados
| Modelo | Schema | Tabla | Campos |
| --- | --- | --- | --- |
| cotizacion | finanzas | cotizacion | 49 |
| detalle_costo_material_cotizacion | finanzas | detalle_costo_material_cotizacion | 9 |
| detalle_cotizacion | finanzas | detalle_cotizacion | 32 |
| nota_venta | finanzas | nota_venta | 37 |
| cotizacion_salud_empleado | finanzas | cotizacion_salud_empleado | 8 |
| item_comercial | terreno | item_comercial | 7 |
| familia_producto_comercial | finanzas | familia_producto_comercial | 17 |
| historial_familia_producto_comercial | finanzas | historial_familia_producto_comercial | 10 |
| extension_producto_comercial | finanzas | extension_producto_comercial | 37 |
| producto_comercial_version | finanzas | producto_comercial_version | 30 |
| historial_producto_comercial | finanzas | historial_producto_comercial | 10 |
| producto_comercial_documento | finanzas | producto_comercial_documento | 16 |
| cotizacion_version | finanzas | cotizacion_version | 15 |
| precio_producto_comercial | finanzas | precio_producto_comercial | 19 |
| opcional_comercial | finanzas | opcional_comercial | 13 |
| precio_opcional_comercial | finanzas | precio_opcional_comercial | 17 |
| tarifa_instalacion_comercial | finanzas | tarifa_instalacion_comercial | 23 |
| condicion_comercial | finanzas | condicion_comercial | 11 |
| condicion_comercial_version | finanzas | condicion_comercial_version | 16 |
| idempotencia_operacion_comercial | finanzas | idempotencia_operacion_comercial | 7 |
| plantilla_documental_comercial | finanzas | plantilla_documental_comercial | 12 |
| carta_comercial_b2c | finanzas | carta_comercial_b2c | 11 |
| carta_comercial_b2c_version | finanzas | carta_comercial_b2c_version | 20 |
| carta_comercial_b2c_version_producto | finanzas | carta_comercial_b2c_version_producto | 9 |
| carta_comercial_b2c_version_fotografia | finanzas | carta_comercial_b2c_version_fotografia | 8 |
| contacto_cotizacion_b2b | finanzas | contacto_cotizacion_b2b | 18 |
| servicio_comercial | finanzas | servicio_comercial | 15 |
| precio_servicio_comercial | finanzas | precio_servicio_comercial | 17 |
| detalle_servicio_cotizacion | finanzas | detalle_servicio_cotizacion | 16 |
| grupo_alternativas_b2c | finanzas | grupo_alternativas_b2c | 16 |
| historial_seleccion_alternativa_b2c | finanzas | historial_seleccion_alternativa_b2c | 10 |
| alternativa_b2c | finanzas | alternativa_b2c | 34 |
| alternativa_b2c_opcional | finanzas | alternativa_b2c_opcional | 10 |
| historial_decision_alternativa_b2c | finanzas | historial_decision_alternativa_b2c | 9 |
| documento_tributario_nota_venta | finanzas | documento_tributario_nota_venta | 4 |
| reversion_nota_venta | finanzas | reversion_nota_venta | 11 |
## Suites relacionadas
| Suite | Casos |
| --- | --- |
| Controladores/pruebas/c4-documentos-comerciales.test.cjs | 5 |
| Controladores/pruebas/catalogo-comercial-c1.test.cjs | 8 |
| Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs | 8 |
| Controladores/pruebas/cotizaciones-c3-1-pg18.test.cjs | 3 |
| Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs | 3 |
| Controladores/pruebas/cotizaciones-c3-3-pg18.test.cjs | 3 |
| Controladores/pruebas/cotizaciones-migraciones-065-067.test.cjs | 15 |
| Controladores/pruebas/m2-aprobacion-ot-unidad.test.cjs | 13 |
| Controladores/pruebas/m2-productos-comerciales.test.cjs | 51 |
| Controladores/pruebas/m2-tareas-plantillas-fabricacion.test.cjs | 14 |
| Controladores/pruebas/permisos-comerciales-c2-6.test.cjs | 7 |
| Controladores/pruebas/seguridad-comercial-c2-5.test.cjs | 11 |
| Vistas/src/components/comercial/ProductoComercial.test.tsx | 5 |
| Vistas/src/components/documental/DocumentosHistoricosCotizacion.test.tsx | 4 |
| Vistas/src/views/ArmarCotizacion/ArmarCotizacion.catalogo.test.tsx | 6 |
| Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx | 9 |
| Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx | 3 |

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
