# Mapa completo del repositorio

**Proyecto:** Puertas Blindadas
**Documento:** 33
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

## Resumen
| Carpeta raiz | Archivos |
| --- | --- |
| .gitignore | 1 |
| Controladores | 294 |
| MAPA_DEL_PROYECTO.md | 1 |
| README.md | 1 |
| Vistas | 162 |
| auditoria-cu-corregida.md | 1 |
| auditoria-cu-final.md | 1 |
| auditoria-cu-inicial.md | 1 |
| db | 4 |
| docs | 1 |
| documentacion | 22 |
| frontend_style_guide.md | 1 |
## `.gitignore/`
Contiene los siguientes archivos relevantes:
- `.gitignore` - .gitignore.
## `Controladores/`
Contiene los siguientes archivos relevantes:
- `Controladores/.env.example` - .env.
- `Controladores/package-lock.json` - package-lock.
- `Controladores/package.json` - package.
- `Controladores/prisma/migrations/000_base_existente/migration.sql` - migration.
- `Controladores/prisma/migrations/001_base_i2/migration.sql` - migration.
- `Controladores/prisma/migrations/002_secuencias_heredadas/migration.sql` - migration.
- `Controladores/prisma/migrations/003_seguridad_m4/migration.sql` - migration.
- `Controladores/prisma/migrations/004_destino_excedente/migration.sql` - migration.
- `Controladores/prisma/migrations/005_sesiones_multiples/migration.sql` - migration.
- `Controladores/prisma/migrations/006_cliente_financiero_autonomo/migration.sql` - migration.
- `Controladores/prisma/migrations/007_m5_proveedores/migration.sql` - migration.
- `Controladores/prisma/migrations/008_m5_ocs_condicion_pago/migration.sql` - migration.
- `Controladores/prisma/migrations/009_m5_ajustes_ciclo_ocs/migration.sql` - migration.
- `Controladores/prisma/migrations/010_m5_documentos_obligaciones/migration.sql` - migration.
- `Controladores/prisma/migrations/011_m5_cuentas_por_pagar/migration.sql` - migration.
- `Controladores/prisma/migrations/012_m5_pagos_proveedores/migration.sql` - migration.
- `Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql` - migration.
- `Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql` - migration.
- `Controladores/prisma/migrations/015_m5_compensaciones_reclasificaciones/migration.sql` - migration.
- `Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql` - migration.
- `Controladores/prisma/migrations/017_m5_cierre_envios_caja_chica/migration.sql` - migration.
- `Controladores/prisma/migrations/018_m6_catalogo_empleados/migration.sql` - migration.
- `Controladores/prisma/migrations/019_m6_alta_empleado/migration.sql` - migration.
- `Controladores/prisma/migrations/020_m6_relaciones_laborales/migration.sql` - migration.
- `Controladores/prisma/migrations/021_m6_perfil_remuneracional/migration.sql` - migration.
- `Controladores/prisma/migrations/022_m6_asignaciones_esquema/migration.sql` - migration.
- `Controladores/prisma/migrations/023_m6_asignaciones_haberes/migration.sql` - migration.
- `Controladores/prisma/migrations/024_m6_tarifas_esquema/migration.sql` - migration.
- `Controladores/prisma/migrations/025_m6_configuracion_haberes/migration.sql` - migration.
- `Controladores/prisma/migrations/026_m6_tipo_concepto_remuneracional/migration.sql` - migration.
- `Controladores/prisma/migrations/027_m6_parametros_configuraciones/migration.sql` - migration.
- `Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql` - migration.
- `Controladores/prisma/migrations/029_m6_auditoria_retrabajos_unidades/migration.sql` - migration.
- `Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql` - migration.
- `Controladores/prisma/migrations/031_m6_reemplazo_remuneraciones/migration.sql` - migration.
- `Controladores/prisma/migrations/032_m6_ciclo_mensual_remuneraciones/migration.sql` - migration.
- `Controladores/prisma/migrations/033_m6_ajustes_pagos_remuneraciones/migration.sql` - migration.
- `Controladores/prisma/migrations/034_m6_compatibilidad_anulacion_pago/migration.sql` - migration.
- `Controladores/prisma/migrations/035_m6_honorarios_historial_reversiones/migration.sql` - migration.
- `Controladores/prisma/migrations/036_m6_repagos_reversiones/migration.sql` - migration.
- `Controladores/prisma/migrations/037_m6_terreno_visitas/migration.sql` - migration.
- `Controladores/prisma/migrations/038_m6_terreno_tarea_orden_trabajo/migration.sql` - migration.
- `Controladores/prisma/migrations/039_m6_deducciones_recurrentes/migration.sql` - migration.
- `Controladores/prisma/migrations/040_m7_parametros_dashboard/migration.sql` - migration.
- `Controladores/prisma/migrations/041_m7_delta_controlado/migration.sql` - migration.
- `Controladores/prisma/migrations/042_m8_solicitudes_crediticias/migration.sql` - migration.
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql` - migration.
- `Controladores/prisma/migrations/044_m9_auditoria_core/migration.sql` - migration.
- `Controladores/prisma/migrations/045_m9_permisos_auditoria/migration.sql` - migration.
- `Controladores/prisma/migrations/046_m9_retry_politicas/migration.sql` - migration.
- `Controladores/prisma/migrations/047_m6_prevision_legal_rut/migration.sql` - migration.
- `Controladores/prisma/migrations/048_m6_componentes_previsionales/migration.sql` - migration.
- `Controladores/prisma/migrations/049_m6_snapshot_previsional_historial/migration.sql` - migration.
- `Controladores/prisma/migrations/050_m6_catalogos_previsionales/migration.sql` - migration.
- `Controladores/prisma/migrations/051_m7_proyeccion_financiera/migration.sql` - migration.
- `Controladores/prisma/migrations/052_incidencias_terreno_revision/migration.sql` - migration.
- `Controladores/prisma/migrations/053_m7_saldos_bancarios/migration.sql` - migration.
- `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql` - migration.
- `Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql` - migration.
- `Controladores/prisma/migrations/056_cierre_seguridad_documental/migration.sql` - migration.
- `Controladores/prisma/migrations/057_intencion_documental_documento_obligatorio/migration.sql` - migration.
- `Controladores/prisma/migrations/058_areas_trabajo_empleados/migration.sql` - migration.
- `Controladores/prisma/migrations/059_descripcion_area_trabajo_finanzas/migration.sql` - migration.
- `Controladores/prisma/migrations/060_catalogo_tareas_plantillas_fabricacion/migration.sql` - migration.
- `Controladores/prisma/migrations/061_ot_por_unidad_cotizada/migration.sql` - migration.
- `Controladores/prisma/migrations/062_gestion_rectificacion_ot/migration.sql` - migration.
- `Controladores/prisma/migrations/063_aprobacion_rectificacion_liberacion_ot/migration.sql` - migration.
- `Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql` - migration.
- `Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql` - migration.
- `Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql` - migration.
- `Controladores/prisma/migrations/067_alternativas_b2c/migration.sql` - migration.
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql` - migration.
- `Controladores/prisma/migrations/069_contactos_servicios_alternativas_c3_3/migration.sql` - migration.
- `Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql` - migration.
- `Controladores/prisma/migrations/071_integracion_obra_proyecto_cotizacion/migration.sql` - migration.
- `Controladores/prisma/migrations/migration_lock.toml` - migration lock.
- `Controladores/prisma/schema.prisma` - schema.
- `Controladores/prisma/seed-m4.ts` - seed-m4.
- `Controladores/prisma/seed.ts` - seed.
- `Controladores/prisma/views/finanzas/v_ficha_cliente_movimientos.sql` - v ficha cliente movimientos.
- `Controladores/prisma/views/finanzas/v_ficha_cliente_resumen.sql` - v ficha cliente resumen.
- `Controladores/prisma.config.ts` - prisma.config.
- `Controladores/pruebas/adaptador-storage-r2-s3.test.cjs` - adaptador-storage-r2-s3.test.
- `Controladores/pruebas/areas-trabajo-empleados.test.cjs` - areas-trabajo-empleados.test.
- `Controladores/pruebas/arquitectura-y-m1.test.cjs` - arquitectura-y-m1.test.
- `Controladores/pruebas/brechas-cierre.test.cjs` - brechas-cierre.test.
- `Controladores/pruebas/brechas-focalizadas.test.cjs` - brechas-focalizadas.test.
- `Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs` - c3-5-obra-proyecto-http.test.
- `Controladores/pruebas/c4-1-antivirus-real.test.cjs` - c4-1-antivirus-real.test.
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs` - c4-2-permisos-midas.test.
- `Controladores/pruebas/c4-2-seaweedfs-real.test.cjs` - c4-2-seaweedfs-real.test.
- `Controladores/pruebas/c4-3-documental-real.test.cjs` - c4-3-documental-real.test.
- `Controladores/pruebas/c4-documentos-comerciales.test.cjs` - c4-documentos-comerciales.test.
- `Controladores/pruebas/c4-documentos-pg18.test.cjs` - c4-documentos-pg18.test.
- `Controladores/pruebas/catalogo-comercial-c1.test.cjs` - catalogo-comercial-c1.test.
- `Controladores/pruebas/catalogo-documental-c2.test.cjs` - catalogo-documental-c2.test.
- `Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs` - comercial-c2-7-integracion-pg18.test.
- `Controladores/pruebas/cotizaciones-c3-1-pg18.test.cjs` - cotizaciones-c3-1-pg18.test.
- `Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs` - cotizaciones-c3-3-estructura.test.
- `Controladores/pruebas/cotizaciones-c3-3-pg18.test.cjs` - cotizaciones-c3-3-pg18.test.
- `Controladores/pruebas/cotizaciones-migraciones-065-067.test.cjs` - cotizaciones-migraciones-065-067.test.
- `Controladores/pruebas/csv-exportaciones-documentales.test.cjs` - csv-exportaciones-documentales.test.
- `Controladores/pruebas/cu20-cu23-cu27.test.cjs` - cu20-cu23-cu27.test.
- `Controladores/pruebas/delta-financiero.test.cjs` - delta-financiero.test.
- `Controladores/pruebas/demo-completo.focal.cjs` - demo-completo.focal.
- `Controladores/pruebas/documentos-producto-backend.test.cjs` - documentos-producto-backend.test.
- `Controladores/pruebas/integridad-financiera.test.cjs` - integridad-financiera.test.
- `Controladores/pruebas/m1-clientes-autonomos.test.cjs` - m1-clientes-autonomos.test.
- `Controladores/pruebas/m2-aprobacion-ot-unidad.test.cjs` - m2-aprobacion-ot-unidad.test.
- `Controladores/pruebas/m2-productos-comerciales.test.cjs` - m2-productos-comerciales.test.
- `Controladores/pruebas/m2-tareas-plantillas-fabricacion.test.cjs` - m2-tareas-plantillas-fabricacion.test.
- `Controladores/pruebas/m3-pdf-comprobante.test.cjs` - m3-pdf-comprobante.test.
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs` - m4-permisos-funcionales.test.
- `Controladores/pruebas/m4-seguridad-fina.test.cjs` - m4-seguridad-fina.test.
- `Controladores/pruebas/m4.test.cjs` - m4.test.
- `Controladores/pruebas/m5-cu106-cu110.test.cjs` - m5-cu106-cu110.test.
- `Controladores/pruebas/m5-cu111-cu120.test.cjs` - m5-cu111-cu120.test.
- `Controladores/pruebas/m5-cu121-cu126.test.cjs` - m5-cu121-cu126.test.
- `Controladores/pruebas/m5-cu127-cu131.test.cjs` - m5-cu127-cu131.test.
- `Controladores/pruebas/m5-cu132-cu137.test.cjs` - m5-cu132-cu137.test.
- `Controladores/pruebas/m5-cu138-cu145.test.cjs` - m5-cu138-cu145.test.
- `Controladores/pruebas/m5-cu146-cu154.test.cjs` - m5-cu146-cu154.test.
- `Controladores/pruebas/m5-cu75-cu84.test.cjs` - m5-cu75-cu84.test.
- `Controladores/pruebas/m5-cu85-cu90.test.cjs` - m5-cu85-cu90.test.
- `Controladores/pruebas/m5-cu91-cu95.test.cjs` - m5-cu91-cu95.test.
- `Controladores/pruebas/m5-cu96-cu105.test.cjs` - m5-cu96-cu105.test.
- `Controladores/pruebas/m6-agenda-terreno.test.cjs` - m6-agenda-terreno.test.
- `Controladores/pruebas/m6-catalogos-previsionales.test.cjs` - m6-catalogos-previsionales.test.
- `Controladores/pruebas/m6-cu155-cu158.test.cjs` - m6-cu155-cu158.test.
- `Controladores/pruebas/m6-cu159-cu166.test.cjs` - m6-cu159-cu166.test.
- `Controladores/pruebas/m6-cu167-cu171.test.cjs` - m6-cu167-cu171.test.
- `Controladores/pruebas/m6-cu172-cu173.test.cjs` - m6-cu172-cu173.test.
- `Controladores/pruebas/m6-cu174-cu177.test.cjs` - m6-cu174-cu177.test.
- `Controladores/pruebas/m6-cu178-cu182.test.cjs` - m6-cu178-cu182.test.
- `Controladores/pruebas/m6-cu183-cu186.test.cjs` - m6-cu183-cu186.test.
- `Controladores/pruebas/m6-cu187-cu190.test.cjs` - m6-cu187-cu190.test.
- `Controladores/pruebas/m6-cu191-cu195.test.cjs` - m6-cu191-cu195.test.
- `Controladores/pruebas/m6-cu196-cu197.test.cjs` - m6-cu196-cu197.test.
- `Controladores/pruebas/m6-cu198.test.cjs` - m6-cu198.test.
- `Controladores/pruebas/m6-cu199-cu201.test.cjs` - m6-cu199-cu201.test.
- `Controladores/pruebas/m6-cu202.test.cjs` - m6-cu202.test.
- `Controladores/pruebas/m6-cu203.test.cjs` - m6-cu203.test.
- `Controladores/pruebas/m6-cu204.test.cjs` - m6-cu204.test.
- `Controladores/pruebas/m6-cu205.test.cjs` - m6-cu205.test.
- `Controladores/pruebas/m6-cu206.test.cjs` - m6-cu206.test.
- `Controladores/pruebas/m6-cu207-cu210.test.cjs` - m6-cu207-cu210.test.
- `Controladores/pruebas/m6-cu211-cu214.test.cjs` - m6-cu211-cu214.test.
- `Controladores/pruebas/m6-dashboard-terreno.test.cjs` - m6-dashboard-terreno.test.
- `Controladores/pruebas/m6-ficha-operativa-ot.test.cjs` - m6-ficha-operativa-ot.test.
- `Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs` - m6-gestion-rectificacion-ot.test.
- `Controladores/pruebas/m6-historial-remuneracional.test.cjs` - m6-historial-remuneracional.test.
- `Controladores/pruebas/m6-incidencias-revision.test.cjs` - m6-incidencias-revision.test.
- `Controladores/pruebas/m6-pdf-documental.test.cjs` - m6-pdf-documental.test.
- `Controladores/pruebas/m6-post-auditoria.test.cjs` - m6-post-auditoria.test.
- `Controladores/pruebas/m6-prevision-rut.test.cjs` - m6-prevision-rut.test.
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs` - m7-cierre-hallazgos.test.
- `Controladores/pruebas/m7-cobertura-ebitda.test.cjs` - m7-cobertura-ebitda.test.
- `Controladores/pruebas/m7-credito-ejecutivo.test.cjs` - m7-credito-ejecutivo.test.
- `Controladores/pruebas/m7-cu215-cu219.test.cjs` - m7-cu215-cu219.test.
- `Controladores/pruebas/m7-cu216-cu221.test.cjs` - m7-cu216-cu221.test.
- `Controladores/pruebas/m7-cu220-cu224.test.cjs` - m7-cu220-cu224.test.
- `Controladores/pruebas/m7-cu222-cu237.test.cjs` - m7-cu222-cu237.test.
- `Controladores/pruebas/m7-cu242-cu253.test.cjs` - m7-cu242-cu253.test.
- `Controladores/pruebas/m7-cu246.test.cjs` - m7-cu246.test.
- `Controladores/pruebas/m7-cu252.test.cjs` - m7-cu252.test.
- `Controladores/pruebas/m7-delta-controlado.test.cjs` - m7-delta-controlado.test.
- `Controladores/pruebas/m7-historico-panel.test.cjs` - m7-historico-panel.test.
- `Controladores/pruebas/m7-integracion-inventario.test.cjs` - m7-integracion-inventario.test.
- `Controladores/pruebas/m7-m8-integracion.focal.cjs` - m7-m8-integracion.focal.
- `Controladores/pruebas/m7-pdf-gerencial.test.cjs` - m7-pdf-gerencial.test.
- `Controladores/pruebas/m7-presupuesto-resultados.test.cjs` - m7-presupuesto-resultados.test.
- `Controladores/pruebas/m7-produccion-modelos.test.cjs` - m7-produccion-modelos.test.
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs` - m7-rebaseline-definitivo.test.
- `Controladores/pruebas/m7-saldos-bancarios.test.cjs` - m7-saldos-bancarios.test.
- `Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs` - m7-ventas-familia-navegacion.test.
- `Controladores/pruebas/m8-cu259.test.cjs` - m8-cu259.test.
- `Controladores/pruebas/m8-cu260-cu274.test.cjs` - m8-cu260-cu274.test.
- `Controladores/pruebas/m9-autorizacion-e2e.test.cjs` - m9-autorizacion-e2e.test.
- `Controladores/pruebas/m9-confiabilidad-observabilidad.test.cjs` - m9-confiabilidad-observabilidad.test.
- `Controladores/pruebas/m9-consulta-exportacion.test.cjs` - m9-consulta-exportacion.test.
- `Controladores/pruebas/m9-ingesta-integridad.test.cjs` - m9-ingesta-integridad.test.
- `Controladores/pruebas/m9-pdf-informe.test.cjs` - m9-pdf-informe.test.
- `Controladores/pruebas/m9-politicas-privacidad.test.cjs` - m9-politicas-privacidad.test.
- `Controladores/pruebas/m9-post-contratos.test.cjs` - m9-post-contratos.test.
- `Controladores/pruebas/m9-productores-failclosed.test.cjs` - m9-productores-failclosed.test.
- `Controladores/pruebas/m9-retry-alertas-seguridad.test.cjs` - m9-retry-alertas-seguridad.test.
- `Controladores/pruebas/mantenedores-documental-ui.test.cjs` - mantenedores-documental-ui.test.
- `Controladores/pruebas/mantenedores-modal-ux.test.cjs` - mantenedores-modal-ux.test.
- `Controladores/pruebas/mantenedores-panel.test.cjs` - mantenedores-panel.test.
- `Controladores/pruebas/nucleo-documental-portable.test.cjs` - nucleo-documental-portable.test.
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs` - permisos-comerciales-c2-6.test.
- `Controladores/pruebas/portabilidad-segura-r2-s3.test.cjs` - portabilidad-segura-r2-s3.test.
- `Controladores/pruebas/rf-vigente.test.cjs` - rf-vigente.test.
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs` - seguridad-comercial-c2-5.test.
- `Controladores/pruebas/seguridad-integridad-documental.test.cjs` - seguridad-integridad-documental.test.
- `Controladores/pruebas/soporte-prevision-m6.cjs` - soporte-prevision-m6.
- `Controladores/pruebas/sql/cotizaciones-065-067-fixture-historico.sql` - cotizaciones-065-067-fixture-historico.
- `Controladores/pruebas/sql/cotizaciones-065-067-validacion.sql` - cotizaciones-065-067-validacion.
- `Controladores/pruebas/ui-selectores-incidencias.test.cjs` - ui-selectores-incidencias.test.
- `Controladores/scripts/generar-ejemplos-c4.cjs` - generar-ejemplos-c4.
- `Controladores/scripts/limpiar-compilacion.cjs` - limpiar-compilacion.
- `Controladores/src/administracion/aprovisionarCuentaRaiz.ts` - aprovisionarCuentaRaiz.
- `Controladores/src/administracion/cuentaRaiz.ts` - cuentaRaiz.
- `Controladores/src/administracion/sembrarDemoCompleto.ts` - sembrarDemoCompleto.
- `Controladores/src/administracion/sincronizarPermisosMidas.ts` - sincronizarPermisosMidas.
- `Controladores/src/app.ts` - app.
- `Controladores/src/comercial/contratosCatalogoComercial.ts` - contratosCatalogoComercial.
- `Controladores/src/comercial/documentos/assets/logo-puertas-blindadas.jpg` - logo-puertas-blindadas.
- `Controladores/src/comercial/documentos/MotorPdfComercial.ts` - MotorPdfComercial.
- `Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts` - ServicioDocumentosComerciales.
- `Controladores/src/comercial/MatrizAuditoriaComercial.ts` - MatrizAuditoriaComercial.
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts` - SeguridadCapacidadesComerciales.
- `Controladores/src/comercial/ServicioCatalogoComercial.ts` - ServicioCatalogoComercial.
- `Controladores/src/comercial/ServicioEscrituraComercial.ts` - ServicioEscrituraComercial.
- `Controladores/src/comercial/ServicioObraProyectoComercial.ts` - ServicioObraProyectoComercial.
- `Controladores/src/controladores/C_Finanzas.ts` - C Finanzas.
- `Controladores/src/controladores/M1Controller.ts` - M1Controller.
- `Controladores/src/controladores/M2Controller.ts` - M2Controller.
- `Controladores/src/controladores/M3Controller.ts` - M3Controller.
- `Controladores/src/controladores/M4Controller.ts` - M4Controller.
- `Controladores/src/controladores/M5Controller.ts` - M5Controller.
- `Controladores/src/controladores/M6Controller.ts` - M6Controller.
- `Controladores/src/controladores/M7Controller.ts` - M7Controller.
- `Controladores/src/controladores/M8Controller.ts` - M8Controller.
- `Controladores/src/controladores/M9Controller.ts` - M9Controller.
- `Controladores/src/db.ts` - db.
- `Controladores/src/documental/adaptadores/configuracionStorage.ts` - configuracionStorage.
- `Controladores/src/documental/adaptadores/crearStorageAdapter.ts` - crearStorageAdapter.
- `Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts` - S3CompatibleStorageAdapter.
- `Controladores/src/documental/estados.ts` - estados.
- `Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts` - CoordinadorCargaDocumental.
- `Controladores/src/documental/operaciones/ProcesadorOutboxDocumental.ts` - ProcesadorOutboxDocumental.
- `Controladores/src/documental/operaciones/ReconciliadorDocumental.ts` - ReconciliadorDocumental.
- `Controladores/src/documental/operaciones/ServicioRecuperacionDocumental.ts` - ServicioRecuperacionDocumental.
- `Controladores/src/documental/productos/contratosApi.ts` - contratosApi.
- `Controladores/src/documental/productos/CoordinadorDocumentosProducto.ts` - CoordinadorDocumentosProducto.
- `Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts` - IntegracionM9DocumentosProducto.
- `Controladores/src/documental/productos/ServicioDocumentosProducto.ts` - ServicioDocumentosProducto.
- `Controladores/src/documental/productos/tipos.ts` - tipos.
- `Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts` - RepositorioDocumentalPrisma.
- `Controladores/src/documental/seguridad/AntivirusAdapter.ts` - AntivirusAdapter.
- `Controladores/src/documental/seguridad/AuditoriaDocumental.ts` - AuditoriaDocumental.
- `Controladores/src/documental/seguridad/AutorizacionDocumental.ts` - AutorizacionDocumental.
- `Controladores/src/documental/seguridad/configuracionSeguridadDocumental.ts` - configuracionSeguridadDocumental.
- `Controladores/src/documental/seguridad/IntegridadContenido.ts` - IntegridadContenido.
- `Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts` - MatrizCapacidadesDocumentales.
- `Controladores/src/documental/seguridad/PoliticasActivacionDocumental.ts` - PoliticasActivacionDocumental.
- `Controladores/src/documental/ServicioDocumental.ts` - ServicioDocumental.
- `Controladores/src/documental/StorageAdapter.ts` - StorageAdapter.
- `Controladores/src/documental/tipos.ts` - tipos.
- `Controladores/src/documental/validaciones.ts` - validaciones.
- `Controladores/src/m3/comprobantePagoPdf.ts` - comprobantePagoPdf.
- `Controladores/src/m6/calculoPrevisional.ts` - calculoPrevisional.
- `Controladores/src/m6/dashboardTerreno.ts` - dashboardTerreno.
- `Controladores/src/m6/documentosRemuneracionPdf.ts` - documentosRemuneracionPdf.
- `Controladores/src/m7/informeDashboardPdf.ts` - informeDashboardPdf.
- `Controladores/src/m7/informeVentasExcel.ts` - informeVentasExcel.
- `Controladores/src/m8/exportacionCreditoCsv.ts` - exportacionCreditoCsv.
- `Controladores/src/m9/alertas.ts` - alertas.
- `Controladores/src/m9/autorizacion.ts` - autorizacion.
- `Controladores/src/m9/contratoProductor.ts` - contratoProductor.
- `Controladores/src/m9/contratosPostM9.ts` - contratosPostM9.
- `Controladores/src/m9/exportacionAuditoriaCsv.ts` - exportacionAuditoriaCsv.
- `Controladores/src/m9/informeAuditoriaPdf.ts` - informeAuditoriaPdf.
- `Controladores/src/m9/observabilidad.ts` - observabilidad.
- `Controladores/src/m9/politicas.ts` - politicas.
- `Controladores/src/m9/puertos.ts` - puertos.
- `Controladores/src/m9/RepositorioAuditoriaM9.ts` - RepositorioAuditoriaM9.
- `Controladores/src/m9/RepositorioRetryM9.ts` - RepositorioRetryM9.
- `Controladores/src/m9/seguridad.ts` - seguridad.
- `Controladores/src/m9/seguridadEntorno.ts` - seguridadEntorno.
- `Controladores/src/m9/tipos.ts` - tipos.
- `Controladores/src/rutas/finanzas.ts` - finanzas.
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts` - catalogoPermisosFuncional.
- `Controladores/src/servicios/AdaptadorCreditoM8ParaM7.ts` - AdaptadorCreditoM8ParaM7.
- `Controladores/src/servicios/AuditoriaDocumental.ts` - AuditoriaDocumental.
- `Controladores/src/servicios/FuentePagoRemuneracion.ts` - FuentePagoRemuneracion.
- `Controladores/src/servicios/RepositorioPagoRemuneracion.ts` - RepositorioPagoRemuneracion.
- `Controladores/src/servidor.ts` - servidor.
- `Controladores/src/utilidades/C_BancoCentral.ts` - C BancoCentral.
- `Controladores/src/utilidades/correo.ts` - correo.
- `Controladores/src/utilidades/creditoM8.ts` - creditoM8.
- `Controladores/src/utilidades/csv.ts` - csv.
- `Controladores/src/utilidades/ErrorAplicacion.ts` - ErrorAplicacion.
- `Controladores/src/utilidades/finanzas.ts` - finanzas.
- `Controladores/src/utilidades/pago.ts` - pago.
- `Controladores/src/utilidades/pdf.ts` - pdf.
- `Controladores/src/utilidades/rut.ts` - rut.
- `Controladores/src/utilidades/seguridad.ts` - seguridad.
- `Controladores/src/validaciones/autorizacion.ts` - autorizacion.
- `Controladores/src/validaciones/permisos.ts` - permisos.
- `Controladores/src/validaciones/solicitudes.ts` - solicitudes.
- `Controladores/tsconfig.json` - tsconfig.
- `Controladores/tsconfig.tsbuildinfo` - tsconfig.
## `MAPA_DEL_PROYECTO.md/`
Contiene los siguientes archivos relevantes:
- `MAPA_DEL_PROYECTO.md` - MAPA DEL PROYECTO.
## `README.md/`
Contiene los siguientes archivos relevantes:
- `README.md` - README.
## `Vistas/`
Contiene los siguientes archivos relevantes:
- `Vistas/.gitignore` - .gitignore.
- `Vistas/eslint.config.js` - eslint.config.
- `Vistas/index.html` - index.
- `Vistas/package-lock.json` - package-lock.
- `Vistas/package.json` - package.
- `Vistas/postcss.config.js` - postcss.config.
- `Vistas/public/favicon.svg` - favicon.
- `Vistas/public/icons.svg` - icons.
- `Vistas/src/api/finanzas.ts` - finanzas.
- `Vistas/src/App.css` - App.
- `Vistas/src/App.tsx` - App.
- `Vistas/src/assets/hero.png` - hero.
- `Vistas/src/assets/react.svg` - react.
- `Vistas/src/assets/vite.svg` - vite.
- `Vistas/src/components/comercial/ComparadorProductosComerciales.tsx` - ComparadorProductosComerciales.
- `Vistas/src/components/comercial/FichaProductoComercialModal.tsx` - FichaProductoComercialModal.
- `Vistas/src/components/comercial/ProductoComercial.test.tsx` - ProductoComercial.test.
- `Vistas/src/components/comercial/TarjetaProductoComercial.tsx` - TarjetaProductoComercial.
- `Vistas/src/components/comercial/tipos.ts` - tipos.
- `Vistas/src/components/DialogosSistema.tsx` - DialogosSistema.
- `Vistas/src/components/documental/contratoDocumental.ts` - contratoDocumental.
- `Vistas/src/components/documental/DocumentosHistoricosCotizacion.test.tsx` - DocumentosHistoricosCotizacion.test.
- `Vistas/src/components/documental/DocumentosHistoricosCotizacion.tsx` - DocumentosHistoricosCotizacion.
- `Vistas/src/components/documental/EstadoDocumentoVisual.tsx` - EstadoDocumentoVisual.
- `Vistas/src/components/documental/GaleriaProducto.tsx` - GaleriaProducto.
- `Vistas/src/components/documental/HistorialDocumento.tsx` - HistorialDocumento.
- `Vistas/src/components/documental/ListaDocumentosProducto.tsx` - ListaDocumentosProducto.
- `Vistas/src/components/documental/PanelDocumentosProducto.test.tsx` - PanelDocumentosProducto.test.
- `Vistas/src/components/documental/PanelDocumentosProducto.tsx` - PanelDocumentosProducto.
- `Vistas/src/components/documental/PanelDocumentosProductoConectado.test.tsx` - PanelDocumentosProductoConectado.test.
- `Vistas/src/components/documental/PanelDocumentosProductoConectado.tsx` - PanelDocumentosProductoConectado.
- `Vistas/src/components/documental/ResumenUsoComercial.tsx` - ResumenUsoComercial.
- `Vistas/src/components/documental/TarjetaImagenProducto.tsx` - TarjetaImagenProducto.
- `Vistas/src/components/documental/tipos.ts` - tipos.
- `Vistas/src/components/documental/VistaPreviaDocumento.tsx` - VistaPreviaDocumento.
- `Vistas/src/components/ModalDetalleDocumento.tsx` - ModalDetalleDocumento.
- `Vistas/src/components/ModalFormulario.tsx` - ModalFormulario.
- `Vistas/src/components/ModalPlanificacionOrdenes.tsx` - ModalPlanificacionOrdenes.
- `Vistas/src/components/OperacionesFinancieras.tsx` - OperacionesFinancieras.
- `Vistas/src/components/SelectorCatalogo.test.tsx` - SelectorCatalogo.test.
- `Vistas/src/components/SelectorCatalogo.tsx` - SelectorCatalogo.
- `Vistas/src/index.css` - index.
- `Vistas/src/lucide-react.d.ts` - lucide-react.d.
- `Vistas/src/main.tsx` - main.
- `Vistas/src/seguridad/accesosSistemas.ts` - accesosSistemas.
- `Vistas/src/seguridad/Sesion.tsx` - Sesion.
- `Vistas/src/test/setup.ts` - setup.
- `Vistas/src/utilidades/moneda.ts` - moneda.
- `Vistas/src/utilidades/pagos.ts` - pagos.
- `Vistas/src/utilidades/rut.ts` - rut.
- `Vistas/src/views/ArmarCotizacion/ArmarCotizacion.catalogo.test.tsx` - ArmarCotizacion.catalogo.test.
- `Vistas/src/views/ArmarCotizacion/ArmarCotizacion.tsx` - ArmarCotizacion.
- `Vistas/src/views/ArmarCotizacion/ArmarCotizacionComercial.css` - ArmarCotizacionComercial.
- `Vistas/src/views/ArmarCotizacion/ArmarCotizacionComercial.tsx` - ArmarCotizacionComercial.
- `Vistas/src/views/Auditoria/Auditoria.test.tsx` - Auditoria.test.
- `Vistas/src/views/Auditoria/Auditoria.tsx` - Auditoria.
- `Vistas/src/views/BandejaAprobacion/BandejaAprobacionGerencia.tsx` - BandejaAprobacionGerencia.
- `Vistas/src/views/CajaChica/CajaChica.tsx` - CajaChica.
- `Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx` - CatalogoClientes.
- `Vistas/src/views/CatalogoEmpleados/CatalogoEmpleados.tsx` - CatalogoEmpleados.
- `Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx` - CatalogoProveedores.
- `Vistas/src/views/CategoriasEgreso/CategoriasEgreso.tsx` - CategoriasEgreso.
- `Vistas/src/views/Configuracion/UmbralPorVencer.tsx` - UmbralPorVencer.
- `Vistas/src/views/correccionesObservaciones.test.ts` - correccionesObservaciones.test.
- `Vistas/src/views/Credito/CreditoCliente.tsx` - CreditoCliente.
- `Vistas/src/views/Credito/SolicitudesCredito.tsx` - SolicitudesCredito.
- `Vistas/src/views/CuentasPorPagar/CuentasPorPagar.tsx` - CuentasPorPagar.
- `Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx` - AnalisisVentasM7.
- `Vistas/src/views/DashboardM7/CentroAtencionM7.tsx` - CentroAtencionM7.
- `Vistas/src/views/DashboardM7/componentes.test.tsx` - componentes.test.
- `Vistas/src/views/DashboardM7/componentes.tsx` - componentes.
- `Vistas/src/views/DashboardM7/ContextoClienteM7.tsx` - ContextoClienteM7.
- `Vistas/src/views/DashboardM7/ContextoProyectoM7.tsx` - ContextoProyectoM7.
- `Vistas/src/views/DashboardM7/CotizacionesPendientesM7.tsx` - CotizacionesPendientesM7.
- `Vistas/src/views/DashboardM7/CuentasCobrarM7.tsx` - CuentasCobrarM7.
- `Vistas/src/views/DashboardM7/CuentasPagarM7.tsx` - CuentasPagarM7.
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx` - DeltaControladoM7.
- `Vistas/src/views/DashboardM7/ExposicionProyectosM7.tsx` - ExposicionProyectosM7.
- `Vistas/src/views/DashboardM7/filtrosTemporalesVentas.tsx` - filtrosTemporalesVentas.
- `Vistas/src/views/DashboardM7/graficos-tooltip.test.tsx` - graficos-tooltip.test.
- `Vistas/src/views/DashboardM7/graficos.tsx` - graficos.
- `Vistas/src/views/DashboardM7/LiquidezM7.tsx` - LiquidezM7.
- `Vistas/src/views/DashboardM7/MargenProyectosM7.tsx` - MargenProyectosM7.
- `Vistas/src/views/DashboardM7/OperacionCostosM7.tsx` - OperacionCostosM7.
- `Vistas/src/views/DashboardM7/PanelGeneralM7.tsx` - PanelGeneralM7.
- `Vistas/src/views/DashboardM7/presentacionProductos.tsx` - presentacionProductos.
- `Vistas/src/views/DashboardM7/PresupuestoResultadosM7.tsx` - PresupuestoResultadosM7.
- `Vistas/src/views/DashboardM7/ResumenesM7.tsx` - ResumenesM7.
- `Vistas/src/views/DashboardM7/RiesgoDeficitM7.tsx` - RiesgoDeficitM7.
- `Vistas/src/views/DashboardM7/tooltipFlotante.test.ts` - tooltipFlotante.test.
- `Vistas/src/views/DashboardM7/tooltipFlotante.ts` - tooltipFlotante.
- `Vistas/src/views/DashboardPrincipal/DashboardPrincipal.tsx` - DashboardPrincipal.
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx` - DashboardWrapper.
- `Vistas/src/views/DetallePagoRemuneracion/DetallePagoRemuneracion.tsx` - DetallePagoRemuneracion.
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx` - DetalleRemuneracion.
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx` - DocumentosProveedor.
- `Vistas/src/views/DocumentosRemuneracion/DocumentosRemuneracion.tsx` - DocumentosRemuneracion.
- `Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx` - EnviosImportaciones.
- `Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx` - EsquemasRemuneracionales.
- `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx` - FichaEmpleado.
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx` - DetalleOrdenTrabajo.test.
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx` - DetalleOrdenTrabajo.
- `Vistas/src/views/GestionOrdenesTrabajo/GestionOrdenesTrabajo.test.tsx` - GestionOrdenesTrabajo.test.
- `Vistas/src/views/GestionOrdenesTrabajo/GestionOrdenesTrabajo.tsx` - GestionOrdenesTrabajo.
- `Vistas/src/views/GestionTerreno/DetalleVisitaTerreno.tsx` - DetalleVisitaTerreno.
- `Vistas/src/views/GestionTerreno/GestionTerreno.tsx` - GestionTerreno.
- `Vistas/src/views/GestionTerreno/tipos.ts` - tipos.
- `Vistas/src/views/Honorarios/Honorarios.tsx` - Honorarios.
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.test.tsx` - IncidenciasTerreno.test.
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx` - IncidenciasTerreno.
- `Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx` - LevantamientoTecnico.
- `Vistas/src/views/Mantenedores/AreasTrabajo.tsx` - AreasTrabajo.
- `Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx` - CatalogosComerciales.test.
- `Vistas/src/views/Mantenedores/CatalogosComerciales.tsx` - CatalogosComerciales.
- `Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx` - DocumentosComerciales.test.
- `Vistas/src/views/Mantenedores/DocumentosComerciales.tsx` - DocumentosComerciales.
- `Vistas/src/views/Mantenedores/Mantenedores.tsx` - Mantenedores.
- `Vistas/src/views/Mantenedores/permisos.ts` - permisos.
- `Vistas/src/views/Mantenedores/PlantillaFabricacionFamilia.tsx` - PlantillaFabricacionFamilia.
- `Vistas/src/views/Mantenedores/ProductosFamilias.tsx` - ProductosFamilias.
- `Vistas/src/views/Mantenedores/TareasFabricacion.tsx` - TareasFabricacion.
- `Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx` - MantenedorParametros.
- `Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx` - MisTareasTerreno.
- `Vistas/src/views/NotaDeVentaDirecta/NotaDeVentaDirecta.tsx` - NotaDeVentaDirecta.
- `Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx` - OrdenesCompraServicios.
- `Vistas/src/views/Pagos/PagosCliente.tsx` - PagosCliente.
- `Vistas/src/views/PagosProveedores/PagosProveedores.tsx` - PagosProveedores.
- `Vistas/src/views/PeriodosRemuneracion/PeriodosRemuneracion.tsx` - PeriodosRemuneracion.
- `Vistas/src/views/PortalPrincipal/InventarioPendiente.tsx` - InventarioPendiente.
- `Vistas/src/views/PortalPrincipal/PortalPrincipal.test.tsx` - PortalPrincipal.test.
- `Vistas/src/views/PortalPrincipal/PortalPrincipal.tsx` - PortalPrincipal.
- `Vistas/src/views/ProduccionTerreno/ProduccionTerreno.tsx` - ProduccionTerreno.
- `Vistas/src/views/RegistroPagosRemuneracion/RegistroPagosRemuneracion.tsx` - RegistroPagosRemuneracion.
- `Vistas/src/views/Seguridad/Acceso.test.ts` - Acceso.test.
- `Vistas/src/views/Seguridad/Acceso.tsx` - Acceso.
- `Vistas/src/views/Seguridad/permisosM4.test.ts` - permisosM4.test.
- `Vistas/src/views/Seguridad/permisosM4.ts` - permisosM4.
- `Vistas/src/views/Seguridad/Sesiones.tsx` - Sesiones.
- `Vistas/src/views/Seguridad/Usuarios.test.tsx` - Usuarios.test.
- `Vistas/src/views/Seguridad/Usuarios.tsx` - Usuarios.
- `Vistas/src/views/Terreno/AgendaTerreno.test.tsx` - AgendaTerreno.test.
- `Vistas/src/views/Terreno/AgendaTerreno.tsx` - AgendaTerreno.
- `Vistas/src/views/Terreno/dashboardTerreno.test.ts` - dashboardTerreno.test.
- `Vistas/src/views/Terreno/dashboardTerreno.ts` - dashboardTerreno.
- `Vistas/src/views/Terreno/GraficosTerreno.tsx` - GraficosTerreno.
- `Vistas/src/views/Terreno/InicioTerreno.test.ts` - InicioTerreno.test.
- `Vistas/src/views/Terreno/InicioTerreno.tsx` - InicioTerreno.
- `Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx` - InstalacionesTerreno.test.
- `Vistas/src/views/Terreno/InstalacionesTerreno.tsx` - InstalacionesTerreno.
- `Vistas/src/views/Terreno/ReportesTerreno.tsx` - ReportesTerreno.
- `Vistas/src/views/Terreno/resumenInstalaciones.ts` - resumenInstalaciones.
- `Vistas/src/views/Terreno/resumenPanelTerreno.ts` - resumenPanelTerreno.
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx` - TerrenoWrapper.
- `Vistas/src/views/VerFicha/VerFicha.tsx` - VerFicha.
- `Vistas/src/views/VerFichaProveedor/VerFichaProveedor.tsx` - VerFichaProveedor.
- `Vistas/src/views/verificacionAccionesFinal.test.tsx` - verificacionAccionesFinal.test.
- `Vistas/tailwind.config.js` - tailwind.config.
- `Vistas/tsconfig.app.json` - tsconfig.app.
- `Vistas/tsconfig.json` - tsconfig.
- `Vistas/tsconfig.node.json` - tsconfig.node.
- `Vistas/vite.config.ts` - vite.config.
- `Vistas/vitest.config.ts` - vitest.config.
## `auditoria-cu-corregida.md/`
Contiene los siguientes archivos relevantes:
- `auditoria-cu-corregida.md` - auditoria-cu-corregida.
## `auditoria-cu-final.md/`
Contiene los siguientes archivos relevantes:
- `auditoria-cu-final.md` - auditoria-cu-final.
## `auditoria-cu-inicial.md/`
Contiene los siguientes archivos relevantes:
- `auditoria-cu-inicial.md` - auditoria-cu-inicial.
## `db/`
Contiene los siguientes archivos relevantes:
- `db/README.md` - README.
- `db/schema.sql` - schema.
- `db/seed.sql` - seed.
- `db/setup.ps1` - setup.
## `docs/`
Contiene los siguientes archivos relevantes:
- `docs/c3-5-identidad-obra-proyecto-puerta.md` - c3-5-identidad-obra-proyecto-puerta.
## `documentacion/`
Contiene los siguientes archivos relevantes:
- `documentacion/ADAPTADOR_STORAGE_R2_S3.md` - ADAPTADOR STORAGE R2 S3.
- `documentacion/BLOQUE_4_5A_INTERFAZ_DOCUMENTAL.md` - BLOQUE 4 5A INTERFAZ DOCUMENTAL.
- `documentacion/BLOQUE_4_5B_1_INTEGRACION_BACKEND_DOCUMENTAL.md` - BLOQUE 4 5B 1 INTEGRACION BACKEND DOCUMENTAL.
- `documentacion/BLOQUE_4_5B_2A_1_PORTABILIDAD_SEGURA_R2.md` - BLOQUE 4 5B 2A 1 PORTABILIDAD SEGURA R2.
- `documentacion/BLOQUE_4_5B_2A_PREPARACION_ACTIVACION.md` - BLOQUE 4 5B 2A PREPARACION ACTIVACION.
- `documentacion/C1_MANTENEDORES_COMERCIALES.md` - C1 MANTENEDORES COMERCIALES.
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md` - C2 5 SEGURIDAD M4 COMERCIAL DOCUMENTAL.
- `documentacion/C2_6_ACTIVACION_CONTROLADA_M4.md` - C2 6 ACTIVACION CONTROLADA M4.
- `documentacion/C2_CATALOGO_DOCUMENTAL_COTIZACIONES.md` - C2 CATALOGO DOCUMENTAL COTIZACIONES.
- `documentacion/C4_1_ACTIVACION_DOCUMENTAL_LOCAL.md` - C4 1 ACTIVACION DOCUMENTAL LOCAL.
- `documentacion/CIERRE_SEGURIDAD_DOCUMENTAL_4_4_1.md` - CIERRE SEGURIDAD DOCUMENTAL 4 4 1.
- `documentacion/CORRECCIONES_UI_OBSERVACIONES_VICHO_2026_10_12.md` - CORRECCIONES UI OBSERVACIONES VICHO 2026 10 12.
- `documentacion/DELTA_M4.md` - DELTA M4.
- `documentacion/ESTADO_TECNICO_VIGENTE.md` - ESTADO TECNICO VIGENTE.
- `documentacion/ETAPA_1_I2.md` - ETAPA 1 I2.
- `documentacion/MIGRACIONES_COTIZACIONES_065_067.md` - MIGRACIONES COTIZACIONES 065 067.
- `documentacion/NUCLEO_DOCUMENTAL_PORTABLE.md` - NUCLEO DOCUMENTAL PORTABLE.
- `documentacion/RESULTADO_RECONCILIACION_M4.md` - RESULTADO RECONCILIACION M4.
- `documentacion/REVISION_MIGRACION_M4.md` - REVISION MIGRACION M4.
- `documentacion/SEGURIDAD_INTEGRIDAD_DOCUMENTAL.md` - SEGURIDAD INTEGRIDAD DOCUMENTAL.
- `documentacion/verificacion_m4/comparacion_esquemas.json` - comparacion esquemas.
- `documentacion/verificacion_m4/historial_final.json` - historial final.
## `frontend_style_guide.md/`
Contiene los siguientes archivos relevantes:
- `frontend_style_guide.md` - frontend style guide.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
