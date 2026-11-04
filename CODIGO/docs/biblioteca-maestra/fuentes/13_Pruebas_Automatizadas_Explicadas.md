# Pruebas automatizadas explicadas

**Proyecto:** Puertas Blindadas
**Documento:** 13
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

## Estrategia
Las pruebas `node:test` cubren backend y persistencia; Vitest/Testing Library cubre frontend. Algunas suites requieren PostgreSQL aislado u otros servicios. Un mock demuestra contrato, no infraestructura real.
## Resumen
| Archivo | Framework | Casos detectados |
| --- | --- | --- |
| Controladores/pruebas/adaptador-storage-r2-s3.test.cjs | node:test | 56 |
| Controladores/pruebas/areas-trabajo-empleados.test.cjs | node:test | 6 |
| Controladores/pruebas/arquitectura-y-m1.test.cjs | node:test | 11 |
| Controladores/pruebas/brechas-cierre.test.cjs | node:test | 6 |
| Controladores/pruebas/brechas-focalizadas.test.cjs | node:test | 4 |
| Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs | node:test | 1 |
| Controladores/pruebas/c4-1-antivirus-real.test.cjs | node:test | 1 |
| Controladores/pruebas/c4-2-permisos-midas.test.cjs | node:test | 4 |
| Controladores/pruebas/c4-2-seaweedfs-real.test.cjs | node:test | 1 |
| Controladores/pruebas/c4-3-documental-real.test.cjs | node:test | 2 |
| Controladores/pruebas/c4-documentos-comerciales.test.cjs | node:test | 5 |
| Controladores/pruebas/c4-documentos-pg18.test.cjs | node:test | 2 |
| Controladores/pruebas/catalogo-comercial-c1.test.cjs | node:test | 8 |
| Controladores/pruebas/catalogo-documental-c2.test.cjs | node:test | 11 |
| Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs | node:test | 8 |
| Controladores/pruebas/cotizaciones-c3-1-pg18.test.cjs | node:test | 3 |
| Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs | node:test | 3 |
| Controladores/pruebas/cotizaciones-c3-3-pg18.test.cjs | node:test | 3 |
| Controladores/pruebas/cotizaciones-migraciones-065-067.test.cjs | node:test | 15 |
| Controladores/pruebas/csv-exportaciones-documentales.test.cjs | node:test | 5 |
| Controladores/pruebas/cu20-cu23-cu27.test.cjs | node:test | 3 |
| Controladores/pruebas/delta-financiero.test.cjs | node:test | 8 |
| Controladores/pruebas/documentos-producto-backend.test.cjs | node:test | 34 |
| Controladores/pruebas/integridad-financiera.test.cjs | node:test | 8 |
| Controladores/pruebas/m1-clientes-autonomos.test.cjs | node:test | 5 |
| Controladores/pruebas/m2-aprobacion-ot-unidad.test.cjs | node:test | 13 |
| Controladores/pruebas/m2-productos-comerciales.test.cjs | node:test | 51 |
| Controladores/pruebas/m2-tareas-plantillas-fabricacion.test.cjs | node:test | 14 |
| Controladores/pruebas/m3-pdf-comprobante.test.cjs | node:test | 4 |
| Controladores/pruebas/m4-permisos-funcionales.test.cjs | node:test | 4 |
| Controladores/pruebas/m4-seguridad-fina.test.cjs | node:test | 6 |
| Controladores/pruebas/m4.test.cjs | node:test | 20 |
| Controladores/pruebas/m5-cu106-cu110.test.cjs | node:test | 4 |
| Controladores/pruebas/m5-cu111-cu120.test.cjs | node:test | 9 |
| Controladores/pruebas/m5-cu121-cu126.test.cjs | node:test | 9 |
| Controladores/pruebas/m5-cu127-cu131.test.cjs | node:test | 8 |
| Controladores/pruebas/m5-cu132-cu137.test.cjs | node:test | 9 |
| Controladores/pruebas/m5-cu138-cu145.test.cjs | node:test | 9 |
| Controladores/pruebas/m5-cu146-cu154.test.cjs | node:test | 8 |
| Controladores/pruebas/m5-cu75-cu84.test.cjs | node:test | 10 |
| Controladores/pruebas/m5-cu85-cu90.test.cjs | node:test | 7 |
| Controladores/pruebas/m5-cu91-cu95.test.cjs | node:test | 6 |
| Controladores/pruebas/m5-cu96-cu105.test.cjs | node:test | 5 |
| Controladores/pruebas/m6-agenda-terreno.test.cjs | node:test | 7 |
| Controladores/pruebas/m6-catalogos-previsionales.test.cjs | node:test | 4 |
| Controladores/pruebas/m6-cu155-cu158.test.cjs | node:test | 7 |
| Controladores/pruebas/m6-cu159-cu166.test.cjs | node:test | 13 |
| Controladores/pruebas/m6-cu167-cu171.test.cjs | node:test | 8 |
| Controladores/pruebas/m6-cu172-cu173.test.cjs | node:test | 10 |
| Controladores/pruebas/m6-cu174-cu177.test.cjs | node:test | 16 |
| Controladores/pruebas/m6-cu178-cu182.test.cjs | node:test | 17 |
| Controladores/pruebas/m6-cu183-cu186.test.cjs | node:test | 17 |
| Controladores/pruebas/m6-cu187-cu190.test.cjs | node:test | 11 |
| Controladores/pruebas/m6-cu191-cu195.test.cjs | node:test | 11 |
| Controladores/pruebas/m6-cu196-cu197.test.cjs | node:test | 7 |
| Controladores/pruebas/m6-cu198.test.cjs | node:test | 13 |
| Controladores/pruebas/m6-cu199-cu201.test.cjs | node:test | 10 |
| Controladores/pruebas/m6-cu202.test.cjs | node:test | 8 |
| Controladores/pruebas/m6-cu203.test.cjs | node:test | 9 |
| Controladores/pruebas/m6-cu204.test.cjs | node:test | 7 |
| Controladores/pruebas/m6-cu205.test.cjs | node:test | 12 |
| Controladores/pruebas/m6-cu206.test.cjs | node:test | 8 |
| Controladores/pruebas/m6-cu207-cu210.test.cjs | node:test | 6 |
| Controladores/pruebas/m6-cu211-cu214.test.cjs | node:test | 5 |
| Controladores/pruebas/m6-dashboard-terreno.test.cjs | node:test | 13 |
| Controladores/pruebas/m6-ficha-operativa-ot.test.cjs | node:test | 10 |
| Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs | node:test | 23 |
| Controladores/pruebas/m6-historial-remuneracional.test.cjs | node:test | 5 |
| Controladores/pruebas/m6-incidencias-revision.test.cjs | node:test | 15 |
| Controladores/pruebas/m6-pdf-documental.test.cjs | node:test | 9 |
| Controladores/pruebas/m6-post-auditoria.test.cjs | node:test | 13 |
| Controladores/pruebas/m6-prevision-rut.test.cjs | node:test | 14 |
| Controladores/pruebas/m7-cierre-hallazgos.test.cjs | node:test | 35 |
| Controladores/pruebas/m7-cobertura-ebitda.test.cjs | node:test | 25 |
| Controladores/pruebas/m7-credito-ejecutivo.test.cjs | node:test | 20 |
| Controladores/pruebas/m7-cu215-cu219.test.cjs | node:test | 30 |
| Controladores/pruebas/m7-cu216-cu221.test.cjs | node:test | 36 |
| Controladores/pruebas/m7-cu220-cu224.test.cjs | node:test | 37 |
| Controladores/pruebas/m7-cu222-cu237.test.cjs | node:test | 32 |
| Controladores/pruebas/m7-cu242-cu253.test.cjs | node:test | 39 |
| Controladores/pruebas/m7-cu246.test.cjs | node:test | 19 |
| Controladores/pruebas/m7-cu252.test.cjs | node:test | 25 |
| Controladores/pruebas/m7-delta-controlado.test.cjs | node:test | 25 |
| Controladores/pruebas/m7-historico-panel.test.cjs | node:test | 125 |
| Controladores/pruebas/m7-integracion-inventario.test.cjs | node:test | 45 |
| Controladores/pruebas/m7-pdf-gerencial.test.cjs | node:test | 9 |
| Controladores/pruebas/m7-presupuesto-resultados.test.cjs | node:test | 29 |
| Controladores/pruebas/m7-produccion-modelos.test.cjs | node:test | 30 |
| Controladores/pruebas/m7-rebaseline-definitivo.test.cjs | node:test | 8 |
| Controladores/pruebas/m7-saldos-bancarios.test.cjs | node:test | 33 |
| Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs | node:test | 12 |
| Controladores/pruebas/m8-cu259.test.cjs | node:test | 17 |
| Controladores/pruebas/m8-cu260-cu274.test.cjs | node:test | 24 |
| Controladores/pruebas/m9-autorizacion-e2e.test.cjs | node:test | 5 |
| Controladores/pruebas/m9-confiabilidad-observabilidad.test.cjs | node:test | 11 |
| Controladores/pruebas/m9-consulta-exportacion.test.cjs | node:test | 11 |
| Controladores/pruebas/m9-ingesta-integridad.test.cjs | node:test | 13 |
| Controladores/pruebas/m9-pdf-informe.test.cjs | node:test | 7 |
| Controladores/pruebas/m9-politicas-privacidad.test.cjs | node:test | 8 |
| Controladores/pruebas/m9-post-contratos.test.cjs | node:test | 7 |
| Controladores/pruebas/m9-productores-failclosed.test.cjs | node:test | 4 |
| Controladores/pruebas/m9-retry-alertas-seguridad.test.cjs | node:test | 6 |
| Controladores/pruebas/mantenedores-documental-ui.test.cjs | node:test | 44 |
| Controladores/pruebas/mantenedores-modal-ux.test.cjs | node:test | 24 |
| Controladores/pruebas/mantenedores-panel.test.cjs | node:test | 11 |
| Controladores/pruebas/nucleo-documental-portable.test.cjs | node:test | 24 |
| Controladores/pruebas/permisos-comerciales-c2-6.test.cjs | node:test | 7 |
| Controladores/pruebas/portabilidad-segura-r2-s3.test.cjs | node:test | 17 |
| Controladores/pruebas/rf-vigente.test.cjs | node:test | 14 |
| Controladores/pruebas/seguridad-comercial-c2-5.test.cjs | node:test | 11 |
| Controladores/pruebas/seguridad-integridad-documental.test.cjs | node:test | 49 |
| Controladores/pruebas/ui-selectores-incidencias.test.cjs | node:test | 13 |
| Vistas/src/components/comercial/ProductoComercial.test.tsx | Vitest/Testing Library | 5 |
| Vistas/src/components/documental/DocumentosHistoricosCotizacion.test.tsx | Vitest/Testing Library | 4 |
| Vistas/src/components/documental/PanelDocumentosProducto.test.tsx | Vitest/Testing Library | 11 |
| Vistas/src/components/documental/PanelDocumentosProductoConectado.test.tsx | Vitest/Testing Library | 3 |
| Vistas/src/components/SelectorCatalogo.test.tsx | Vitest/Testing Library | 8 |
| Vistas/src/views/ArmarCotizacion/ArmarCotizacion.catalogo.test.tsx | Vitest/Testing Library | 6 |
| Vistas/src/views/Auditoria/Auditoria.test.tsx | Vitest/Testing Library | 2 |
| Vistas/src/views/correccionesObservaciones.test.ts | Vitest/Testing Library | 4 |
| Vistas/src/views/DashboardM7/componentes.test.tsx | Vitest/Testing Library | 5 |
| Vistas/src/views/DashboardM7/graficos-tooltip.test.tsx | Vitest/Testing Library | 7 |
| Vistas/src/views/DashboardM7/tooltipFlotante.test.ts | Vitest/Testing Library | 8 |
| Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx | Vitest/Testing Library | 3 |
| Vistas/src/views/GestionOrdenesTrabajo/GestionOrdenesTrabajo.test.tsx | Vitest/Testing Library | 2 |
| Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.test.tsx | Vitest/Testing Library | 3 |
| Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx | Vitest/Testing Library | 9 |
| Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx | Vitest/Testing Library | 3 |
| Vistas/src/views/PortalPrincipal/PortalPrincipal.test.tsx | Vitest/Testing Library | 5 |
| Vistas/src/views/Seguridad/Acceso.test.ts | Vitest/Testing Library | 2 |
| Vistas/src/views/Seguridad/permisosM4.test.ts | Vitest/Testing Library | 11 |
| Vistas/src/views/Seguridad/Usuarios.test.tsx | Vitest/Testing Library | 6 |
| Vistas/src/views/Terreno/AgendaTerreno.test.tsx | Vitest/Testing Library | 5 |
| Vistas/src/views/Terreno/dashboardTerreno.test.ts | Vitest/Testing Library | 3 |
| Vistas/src/views/Terreno/InicioTerreno.test.ts | Vitest/Testing Library | 3 |
| Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx | Vitest/Testing Library | 4 |
| Vistas/src/views/verificacionAccionesFinal.test.tsx | Vitest/Testing Library | 5 |
## `Controladores/pruebas/adaptador-storage-r2-s3.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 62: Bloque 4.3 — contrato portable R2/S3 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 01 configuración válida para R2 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: 02 configuración válida para S3 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 73: 03 configuración incompleta falla con mensaje seguro - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 77: 04 R2 exige credenciales privadas completas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: 05 S3 permite cadena IAM sin credenciales estáticas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: 06 endpoint inválido o externo es rechazado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 91: 07 bucket inválido es rechazado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: 08 clave fuera de prefijos opacos es rechazada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 100: 09 PUT transmite stream y conserva metadatos técnicos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 107: 10 HEAD diferencia proveedor de integridad verificada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 112: 11 GET entrega un stream - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 117: 12 objeto inexistente se normaliza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 122: 13 error de autorización se normaliza sin secreto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 127: 14 timeout aborta y queda reintentable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 133: 15 reintentos están acotados por configuración - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 138: 16 stream pequeño se transmite sin Base64 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 143: 17 stream grande simulado se procesa por fragmentos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 149: 18 stream incompleto no se declara cargado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 154: 19 error durante lectura se propaga normalizado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 160: 20 implementación no acumula archivos completos en memoria - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 165: 21 firma PUT con headers y expiración - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 171: 22 firma GET con nombre seguro - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 180: 23 expiración firmada respeta segundos configurados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 185: 24 firma fuera del máximo se rechaza antes del SDK - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 191: 25 errores y fuente no registran secretos ni URLs - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 196: 26 inicia multipart real mediante comando SDK - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 201: 27 sube una parte y conserva ETag sin tratarlo como SHA - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 206: 28 confirma multipart y consulta HEAD posterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 212: 29 aborto multipart usa identificador explícito - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 217: 30 error multipart intermedio no confirma - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 223: 31 reintento de parte conserva upload, número y clave - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 229: 32 R2 implementa el mismo contrato StorageAdapter - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 233: 33 S3 implementa el mismo contrato StorageAdapter - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 237: 34 capacidades diferencian R2 de S3 configurado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 243: 35 operaciones incompatibles no se declaran disponibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 247: 36 versionado documental continúa independiente del proveedor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 252: 37 no se agregan rutas HTTP documentales públicas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 256: 38 no existen credenciales storage en React - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 260: 39 no hay secretos reales en configuración versionada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 265: 40 construir el adaptador no realiza conexiones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 269: 41 URLs firmadas no se persisten ni pasan al repositorio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 274: 42 borrado físico no está habilitado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 278: 43 M4 conserva catálogo de permisos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 282: 44 M9 no recibe URLs, secretos ni un sistema paralelo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 288: 45 copia objetos mediante comando y verifica destino con HEAD - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 295: 45a S3 protege la creación del destino con If-None-Match - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 302: 45b R2 queda bloqueado hasta validar su extensión condicional real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 310: 45c precondición fallida se normaliza como conflicto no reintentable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 315: 45d PUT exclusivo usa If-None-Match y metadato de idempotencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 322: 45e PUT exclusivo distingue objeto existente de conflicto transitorio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 329: 45f GET condicionado envía If-Match y no confunde ETag con SHA-256 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 334: 46 lista multipart incompletos sólo bajo claves documentales válidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 343: 47 firma una parte multipart sin confirmar la carga - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 349: 48 preparación de PUT simple no contacta al proveedor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 355: 49 el adaptador no permite salir del bucket configurado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/areas-trabajo-empleados.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 16: áreas de trabajo y asignación histórica de empleados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: reutiliza el catálogo compartido y conserva las áreas iniciales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: crea, edita y evita nombres duplicados normalizados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: asigna sólo empleados y áreas activas, conserva historial y una vigencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: impide asignaciones nuevas a área o empleado inactivo sin borrar historia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: constraint impide dos asignaciones vigentes aun fuera del servicio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/arquitectura-y-m1.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 40: sólo existen los controladores modulares autorizados y no hay llamadas entre módulos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: la fachada autoriza una vez y compone el dashboard mediante M1 y M2 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: la denegación de autorización impide acceder al módulo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: listado real: activos, inactivos, búsqueda parcial y cliente provisional sin RUT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 79: ficha real reconcilia mora, deuda, anulación y reversión sin sumar CLP con USD - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 100: C_BancoCentral no inventa valores y mantiene la aprobación antigua fuera del flujo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 109: una cotización inválida no deja escrituras parciales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 116: el vencimiento final es inclusivo en la fecha local del negocio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 121: el excedente comercial se distingue del saldo pendiente y no decide su destino - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 129: el borrador reutilizado recalcula costos y rechaza materiales ajenos sin escrituras parciales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 154: el RUT heredado permite búsqueda parcial con o sin puntos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/brechas-cierre.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 10: CU13 registra desde M2 y asocia el cliente a un borrador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: CU35 modifica sólo la guía asociada y conserva la NV - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: CU41 consulta y actualiza el umbral vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: CU47 C_BancoCentral se prueba con mock sin depender de API externa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: CU54 rechaza aplicar más que el saldo pendiente dentro de la transacción - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: CU55 devuelve detalle de pago de sólo lectura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/brechas-focalizadas.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 15: CU56: la mora comienza al día siguiente de la fecha final - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: CU45: un medio no efectivo necesita antecedente y crédito necesita cuotas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: CU13: el cliente B2C provisional exige teléfono antes de persistir - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: CU58: una conciliación nunca acepta monto cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 10: C3.5 persiste y consulta vía HTTP la auditoría M9 de una Obra registrada desde Cotización - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/c4-1-antivirus-real.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 16: C4.1 integra ClamAV real con PDF comerciales y rechazo EICAR - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 13: 070 registra CU378-CU381 y no registra CU377 ni asigna usuarios - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: sincronización Midas asigna sólo faltantes y la segunda ejecución es idempotente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: regresión: Midas Gerencia conserva todos los CU aprobados con configuración particular - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: PostgreSQL aislado sincroniza todos los CU aprobados a Midas sintético sin CU377 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/c4-2-seaweedfs-real.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 10: SeaweedFS real guarda, consulta y recupera PDF con integridad y autenticación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/c4-3-documental-real.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 39: C4.3 publica plantillas/carta y emite B2B/B2C con PDF real recuperable e idempotente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 130: C4.3 mantiene la cotización en borrador si storage o antivirus real no está disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/c4-documentos-comerciales.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 21: C4 genera PDF B2B binario, íntegro y paginado sin información interna - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: C4 presenta alternativas B2C separadas y la emisión no constituye aceptación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: C4 genera carta general sin cliente y aclara que instalación depende de cobertura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: C4.3 habilita rutas reales con CU separados y conserva CU377 bloqueado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: C4.2 autoriza CU378-CU381 separando edición y publicación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/c4-documentos-pg18.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 9: C4 previsualiza desde persistencia sin emitir, crear NV ni generar OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: C4.3 consulta historial y declara los CU específicos sin concederlos implícitamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/catalogo-comercial-c1.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: normaliza región y comuna sin depender de tildes ni espacios - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: resuelve una tarifa regional vigente como fallback - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: la exclusión específica de comuna prevalece sobre la tarifa regional - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: una comuna sujeta a evaluación no hereda el precio regional - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: ausencia de cobertura no se representa como precio cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: una cobertura disponible sin precio o moneda no se declara vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: las escrituras permanecen fail-closed cuando falta el permiso M4 comercial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: CU360 sólo habilita las consultas comerciales incorporadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/catalogo-documental-c2.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 40: C2 — catálogo documental comercial seguro y segmentado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: B2B recibe sólo documentos autorizados para empresas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: B2C recibe sólo documentos autorizados para particulares - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: un documento sin habilitación comercial no cruza segmentos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: metadatos no exponen storage, secretos, hash ni URL - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: CU360 permite metadatos pero no historial de responsables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: sin CU360 la consulta comercial falla cerrada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 76: producto inactivo no expone su documentación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 80: vista previa y descarga quedan cerradas sin infraestructura aunque el CU exista - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 93: el alcance de entidad se valida en backend - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 96: endpoint binario autorizado informa infraestructura faltante sin simular éxito - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 33: C2.7 integra escrituras comerciales, M4, M9 e idempotencia en PostgreSQL 18 aislado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: M4 rechaza escritura sin CU368 aunque el actor sea administrador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: crea precio una sola vez y M9 registra actor, motivo y versión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: versiona el precio conservando la fila anterior inactiva - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: dos solicitudes concurrentes no crean precios vigentes duplicados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 83: opcional conserva compatibilidad y versiones de precio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 97: versiona, resuelve y desactiva tarifa sin perder la exclusión comunal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 108: condición pasa de borrador a publicada con CU372 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/cotizaciones-c3-1-pg18.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 19: C3.1 cataloga creación, edición y emisión en M9 sin duplicar por solicitud - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: C3.1 persiste y recupera alternativas sin convertirlas en productos contratados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: C3.1 confirma que emisión permanece bloqueada sin PDF documental confirmado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 10: C3.3 migracion 069 es aditiva y separa servicios de puertas fisicas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: C3.3 preserva seleccion historica y exige alternativa del mismo grupo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: C3.3 no elude C4 y usa permisos existentes de alcance acotado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/cotizaciones-c3-3-pg18.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 37: C3.3 persiste contactos B2B propios y servicios sin alterar cliente ni crear OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: C3.3 selecciona con trazabilidad y bloquea aceptación sin documento C4 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: C3.3 acepta atómica e idempotentemente sólo la alternativa contratada en fixture documental aislado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/cotizaciones-migraciones-065-067.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 16: Migraciones 065–067 — estructura aditiva de cotizaciones B2B/B2C - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: 01 conserva un orden de dependencias explícito - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 02 no contiene operaciones destructivas ni aplicación de migraciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: 03 mantiene anulables los campos heredados sensibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: 04 sólo clasifica heredados inequívocos y deja revisión visible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 05 separa precios comerciales de costos internos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 06 evita vigencias comerciales activas superpuestas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 07 reutiliza el núcleo documental y exige archivo confirmado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 08 protege publicaciones, condiciones y emisiones históricas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: 09 sólo publica fotografías B2C autorizadas y disponibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: 10 mantiene correlativo comercial separado del historial cambiario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 80: 11 mantiene alternativas fuera del detalle contratado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: 12 valida coherencia de producto, precio, opcional e instalación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 94: 13 no crea permisos, roles, endpoints ni datos comerciales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 99: 14 Prisma representa todos los modelos nuevos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/csv-exportaciones-documentales.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 9: CSV administrativos M8 y M9 son legibles y seguros para planillas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 10: M8 aplana solicitudes sin JSON y conserva una fila por registro - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: M8 expresa montos CLP y estados humanos para cliente y exposición - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: M9 exporta sólo columnas administrativas, humaniza y neutraliza fórmulas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: neutraliza fórmulas de texto aun con blancos iniciales sin alterar números ni texto normal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/cu20-cu23-cu27.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 18: CU20: un borrador incompleto se recupera, completa y vuelve a guardar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: CU23: formaliza desde la cotización, conserva la asociación y rechaza RUT duplicado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: CU27: crea NV directa con varias líneas y referencias válidas; rechaza proyecto inactivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/delta-financiero.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 4: delta CU25/CU38/CU43/CU47/CU49/CU50: consistencia financiera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: CU25 falla de pago no deja NV ni aprueba cotización - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: CU25 éxito conserva cotización, NV y pago atómicamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: CU38 sin decisión revierte toda la transacción - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: CU38 fachada coordina excedente y saldo a favor sin perder monto original - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: CU49/CU50 usan monto vigente y no cambian estado comercial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: CU47 conserva USD y registra tipo de cambio manual real del pago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CU43 admite parcial y rechaza NV cerrada y sobrepago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/documentos-producto-backend.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 43: Bloque 4.5B.1 — integración backend documental comercial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 78: 01 consulta producto y separa fotografías de documentos técnicos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 83: 02 producto inexistente responde sin filtrar otro documento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 84: 03 producto sin documentos entrega vacío autorizado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 85: 04 imagen principal exige fotografía disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: 05 cuarentena no reemplaza fotografía principal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: 06 conserva orden de presentación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 88: 07 conserva indicadores B2B y B2C - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 89: 08 excluye documento lógico desactivado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 90: 09 informa versión no disponible sin habilitar vista previa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 91: 10 entrega historial autorizado y marca vigencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 92: 11 evita acceso horizontal por asociación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 93: 12 no confunde documento ajeno con el producto consultado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 94: 13 serializa BigInt y tamaño sin perder precisión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: 14 serializa fechas ISO - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 96: 15 convierte explícitamente OTRO_AUTORIZADO - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 97: 16 cubre todas las categorías persistidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 98: 17 DTO no expone claves, proveedor, hash ni URL - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 99: 18 sin CU367 sólo entrega versión acotada y oculta responsable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 100: 19 actor no autenticado queda rechazado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 101: 20 actor sin CU360 queda rechazado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 102: 21 alcance backend impide acceso horizontal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 103: 22 administrador no obtiene una acción documental pendiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 104: 23 capacidades binarias quedan cerradas sin infraestructura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 105: 24 matriz no concede perfiles ni reutiliza CU360/CU366 para documentos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 106: 25 consulta no crea eventos ni activa outbox - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 107: 26 puente M9 bloquea catálogo no aprobado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 108: 27 puente M9 delegado conserva idempotencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 109: 28 puente M9 rechaza datos sensibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 110: 29 consulta Prisma excluye clasificaciones tributaria, laboral y financiera aunque estén asociadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 111: 30 defensa del servicio rechaza una fila no comercial entregada por un repositorio defectuoso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 112: 31 asociación futura rechaza documento no comercial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 113: 32 matriz distingue consultas protegidas y mantiene CU377 cerrado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 114: 33 producto inactivo no expone metadatos documentales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/integridad-financiera.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 19: dashboard consolida con tasa histórica y excluye USD sin conversión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: contrato de pagos valida categoría, cuotas, cheque y limpia cuotas ajenas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: cotización conserva cantidad y creación/edición comparten el cálculo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: cotización USD conserva materiales CLP y convierte solamente el precio comercial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: venta directa conserva original, tasa histórica y equivalente CLP - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: aprobar Nota de Venta persiste la transición emitida a confirmada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 102: pago opcional sin documento actualiza saldo y documento no relacionado se rechaza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 118: UI mantiene fuente de clientes, placeholders y controles condicionales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m1-clientes-autonomos.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 43: valida y normaliza RUT chileno con módulo 11 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: crea B2B con RUT válido nuevo sin crear ni exigir cliente en Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: rechaza B2B sin RUT con error 400 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: rechaza RUT inválido con error 400 claro - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 79: mantiene permitido el cliente B2C provisional sin RUT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m2-aprobacion-ot-unidad.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 36: Aprobación atómica genera una OT por puerta física - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 01 previsualiza exactamente una unidad por puerta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 02 cada unidad conserva producto, familia y versión publicada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 03 rechaza planificación incompleta sin efectos comerciales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 04 confirma Cotización, NV y dos OT en una transacción - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 05 las OT comienzan pendientes de rectificación y no ejecutables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 05b GET de Terreno muestra las dos OT a Midas y permite abrir su ficha - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: 06 conserva planificación histórica independiente por unidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: 07 reintento no duplica Nota de Venta ni OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: 08 historial de creación queda asociado al actor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: 09 historial es inmutable en base de datos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 10 migración no altera tablas propietarias compartidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 11 B2C conserva primer pago y genera OT en la misma confirmación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m2-productos-comerciales.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 31: M2 mantenedor comercial de productos y familias - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 01 migración es incremental y crea sólo tablas en Finanzas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: 02 reutiliza item_comercial por FK real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: 03 reutiliza producto_terminado por FK opcional - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: 04 no altera tablas propietarias externas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 05 crear familia válida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 06 normaliza código de familia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: 07 rechaza código duplicado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 08 edita familia con revisión vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 09 rechaza edición concurrente de familia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 10 conserva historial de familia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 11 crea ficha comercial como borrador no cotizable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 12 rechaza código comercial duplicado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 13 rechaza familia inexistente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: 14 valida estructura técnica extensible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: 15 edita borrador y conserva B2B/B2C - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: 16 rechaza edición concurrente de producto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: 17 no vincula por similitud de nombre - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: 18 rechaza vínculo de Terreno inexistente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: 19 vincula explícitamente con Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 20 vínculo opcional de Inventario conserva ID - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: 21 impide asociación duplicada por índice único - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 22 familia usada no puede desactivarse - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: 23 desactiva producto sin borrarlo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: 24 un producto inactivo no se edita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: 25 reactiva producto según vínculo operativo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: 26 versión publicada tiene clave única concurrente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: 27 publicación usa transacción serializable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 28 publicación exige producto vinculado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 29 versión guarda snapshot comercial completo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: 30 versiones publicadas son inmutables en base de datos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: 31 no existe endpoint de eliminación física - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 73: 32 permisos distinguen las ocho capacidades - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: 33 denegación por defecto para perfiles funcionales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: 34 consulta autorizada sólo con CU360 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 76: 35 escritura separa crear, modificar y publicar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 77: 36 autorización de fachada impide invocar owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 78: 37 M9 cataloga creación, modificación, publicación y vínculo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 79: 38 productor M9 emite una sola vez por operación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 80: 39 rutas CRUD y de historial pasan por C_Finanzas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 81: 40 UI organiza ficha por secciones y sin carga de archivos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: 41 tarjeta queda disponible y protegida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 83: 42 M2 conserva catálogo operativo legado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 84: 43 M7 conserva item_comercial como fuente histórica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 85: 44 Inventario y Terreno no fueron escritos por el mantenedor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: 45 historial de producto registra estados y vínculos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: 46 publica una versión comercial real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 88: 47 consulta la versión anterior sin sobrescribirla - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 89: 48 editar una ficha publicada prepara y publica una nueva versión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 90: 49 impide modificar una versión publicada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 91: 50 evita versiones duplicadas por publicación concurrente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m2-tareas-plantillas-fabricacion.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 31: M2 catálogo y plantillas de fabricación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: 01 migración es aditiva y no altera owners operativos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 02 crea tarea ligada a un área activa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 03 impide duplicar nombre dentro de la misma área - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 04 controla concurrencia y cambio de estado sin borrar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 05 crea familia y guarda borrador con áreas repetidas, catálogo y tarea particular - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: 06 rechaza tarea catalogada en un área distinta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: 07 publica versión inmutable y conserva snapshot - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 08 editar borrador no altera versión publicada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: 08b rechaza medidas obligatorias desconocidas o repetidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 80: 09 evita publicación con revisión desactualizada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 83: 10 permisos reutilizan capacidades M2 sin accesos nuevos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: 11 operaciones relevantes quedan preparadas para auditoría M9 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 89: 12 rutas no exponen eliminación ni generación de OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m3-pdf-comprobante.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 21: M3 genera comprobantes de pago profesionales sin alterar la semántica financiera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: pago parcial queda en una página y presenta datos humanos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: multimoneda muestra tasa y equivalente sólo cuando existen - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: reversiones se detallan y el neto vigente conserva su efecto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 7: clasificación funcional usa áreas reales y nombres humanos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: todo CU implementado obtiene clasificación y acción visible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: guardado atómico reutiliza CU62, CU63 y CU64 y exige administrador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: guardado administrativo genera una sola operación coherente para M9 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m4-seguridad-fina.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 10: M4: separación de Gerencia y Administrador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: Gerencia sin Admin rechaza operación administrativa y Admin la autoriza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: CU73 limita metadatos para Gerencia y los entrega a Administrador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: CU74 exige Admin, cierra sesión ordinaria y protege la original - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: login exitoso reinicia intentos y ciclos de bloqueo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 73: administrador original conserva recuperación autónoma y no admite reset ajeno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m4.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 14: M4: sesiones, autorización, accesos y recuperación reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: login exitoso sin autorización previa y Administrador conserva todos los CU - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: contraseña incorrecta no autentica y registra contador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: cuenta inactiva y cuenta bloqueada no acceden - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: segunda sesión exige confirmación y reemplaza la anterior sólo al aceptar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: autorización permitida y denegada en fachada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: retirar permiso requerido conserva accesos y sesión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: asignar permiso convierte a particular e invalida sesión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: asignar Administrador requiere reautenticación y preserva Gerencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: continuidad impide retirar el último administrador habilitado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: cambio de contraseña invalida sesión y rechaza reutilización - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: recuperación genérica y token único que invalida sesiones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: desbloqueo reinicia estado, genera temporal y limita uso normal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: cierre administrativo invalida sólo sesión seleccionada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: configuración, desactivación y reactivación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: registro valida empleado y duplicidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: CU59 registra cuenta con temporal y CU71 la restablece - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: CU64 retira permiso independiente y CU66 retira rol manteniendo continuidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: token vencido y consumido no habilitan recuperación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: HTTP protege rutas y cookie no expone secreto en JSON - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu106-cu110.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 8: CU106-CU108 mantienen estados separados y filtran por estado actual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 9: CU109 combina proveedor, búsquedas y ordenamientos estables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 10: CU110 acepta cero, conserva historial y recalcula sin cambiar vencimiento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 11: CU83 prioriza obligación M5 y permisos llegan a CU110 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu111-cu120.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 4: M5 P6 CU111-CU120 opera borradores y confirma pagos atómicamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: CU111 selecciona sólo proveedores activos con deuda y busca nombre o identificador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: CU112-CU113 admiten varios movimientos y medios, pero no mezclan proveedor ni exceden saldo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: CU114 reutiliza un archivo para operación y movimientos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: CU116 prepara sin reducir saldo y CU120 confirma parcial/total con varios medios - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: CU115 conserva tasa oficial, manual y bancaria efectiva por fecha de pago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: CU117-CU119 guardan, retoman y descartan sin reservar ni afectar saldo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: CU120 resuelve conflicto entre borradores con rollback total y 409 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: permisos llegan a CU120 y Secretaría no confirma - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu121-cu126.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 4: M5 P7 CU121-CU126 formaliza saldos y efectos postpago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 13: CU121 usa una fórmula acotada y CU122 separa pago de condición temporal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: CU120 usa CU121/CU122 y CU123 presenta el detalle confirmado completo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: CU125 admite varias reversas, restaura sólo lo devuelto y reabre una vencida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: CU124 anula sólo el neto restante sin doble restitución y conserva original - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: CU124 anula una operación completa atómicamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CU126 concilia o registra discrepancia sin efecto financiero y permite proveedor Inactivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: concurrencia impide que dos reversas superen el efecto real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: CxP/Catálogo reflejan el saldo restaurado y permisos llegan exactamente a CU126 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu127-cu131.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 9: M5 P8 CU127-CU131 gestiona respaldos, ajustes y saldos a favor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: CU127 conserva respaldo histórico y registra motivo, actor y fecha - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: CU128 aplica NC hasta la deuda y separa el excedente como saldo a favor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: CU129 ND aumenta la deuda y usa la fórmula única - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: CU129 reutiliza CU99-CU100 y no aplica un excedente OCS pendiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 100: CU130 anula ND y NC sin borrar trazabilidad ni crear crédito impropio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 111: CU131 consulta por moneda sin consumir saldo y admite proveedor inactivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 125: permisos llegan a CU131 y Secretaría no ejecuta CU127/CU130 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu132-cu137.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 4: M5 P9 CU132-CU137 compensa créditos y reclasifica con trazabilidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: CU132 propone por prioridad sin consumir y confirma distribución modificada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: CU132 concurrencia no trunca y devuelve 409 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: CU133 admite varias reversas, restaura crédito/deuda y proveedor Inactivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: CU130 bloquea NC usada y permite anular tras reversa completa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: CU134 crea, renombra, desactiva y reactiva conservando historial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: CU135 aplica bajo umbral, deja sobre umbral pendiente y no cambia deuda - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CU136 segrega aprobación, revalida destino y rechazo es inmutable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: CU137 conserva Decimal, historial y permisos exactos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu138-cu145.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 4: M5 P10 CU138-CU145 corrige imputaciones y agrupa costos de importación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: CU138 agrega y corrige OT del mismo Proyecto con historial sin cambiar deuda - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: CU139 prepara Proyecto→Proyecto/general y general→Proyecto sin alterar originales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: CU140 sólo Gerencia resuelve, aplica parcial/total y rechazo es inmutable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: CU139-CU140 permiten destino cerrado sólo como excepción justificada sin reabrirlo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: CU141 registra comisión internacional separada, con moneda y respaldo, sin deuda ni OCS artificial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: CU142-CU144 crean Abierto, consultan detalle y asocian OCS real sin modificarla - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: CU145 separa costos directos y referenciados, evita doble efecto y no mezcla monedas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: permisos CU138-CU145 quedan exactos y la matriz conserva M5 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu146-cu154.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 12: M5 P11 CU146-CU154 cierra importaciones y administra Caja Chica mensual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: CU146-CU148 mantienen revisión editable, cierre consolidado y reapertura con historial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: CU147 bloquea costo sin equivalente y no confunde deuda pendiente con costo incompleto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: CU149-CU152 separan meses, reservan al registrar y factura sigue siendo sólo respaldo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: CU153 aplica segregación de exceso y no descuenta dos veces - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: CU154 libera la reserva histórica, conserva el gasto y evita doble resolución - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: permisos y fachada respetan actores CU146-CU154 y CU150 exige Administrador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: integridad conserva CU75-CU154 como M5 y reconoce el avance de M6 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu75-cu84.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 54: CU75 crea Activo con mínimos, contactos opcionales y bloquea duplicados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: identidad M5 bloquea el duplicado exacto y permite el mismo identificador en otro país - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: Legacy sin país sigue consultable y CU77 exige completar país al corregir identidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 103: CU76 actualiza datos, exige motivo para razón social, traza tipo y rechaza identidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 114: CU77 corrige identidad con motivo, conserva old/new y bloquea colisión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 128: CU78/CU79 bloquean proceso externo, ignoran tarea interna, trazan y reutilizan el ID - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 152: CU80-CU84 listan, buscan, filtran y mantienen consultable una ficha Inactiva - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 166: Legacy Bloqueado permanece consultable y fuera de los filtros y transiciones M5 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 194: CU83 usa una sola prioridad Vencida > Por vencer > Por pagar > Sin deuda - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 211: permisos CU75-CU84 respetan actores y módulo M5 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu85-cu90.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 111: CU85 filtra tipos y ordena antecedentes ascendente y descendente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 129: CU85 y CU86 sólo se exigen al usar sus parámetros específicos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 140: CU86 ordena estable por razón social, identificador y saldo combinando filtros vigentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 159: CU87 guarda política estructurada, traza old/new y no altera documentos históricos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 178: CU88-CU90 crean, consultan y modifican OCS abierta sin alterar campos inmutables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 208: permisos CU85-CU90 respetan actores, operaciones y módulo M5 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 221: fachada aplica actores CU87-CU90 sin trasladar autorización al controlador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu91-cu95.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 77: CU91 prepara sin modificar y Gerencia confirma conservando original y old/new - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 99: CU92 anula sin efectos, exige motivo, bloquea con efectos y no elimina físicamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 112: CU93 evalúa cierre exacto, bajo autorizado y excedente sin sobrescribir autorizado original - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 138: CU94 sólo reabre Cerrada y conserva el historial de cierre - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 152: CU95 lista y abre documentos Legacy sin inventar clasificación ni asociación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 169: permisos y fachada aplican actores específicos CU91-CU95 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m5-cu96-cu105.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 9: CU96 preliminar no genera deuda y proveedor inactivo bloquea - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 10: CU97 bloquea duplicado normalizando espacios y no crea obligación prematura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 11: CU98-CU105 flujo exacto genera una obligación, efecto y cierre OCS - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 12: CU99-CU100 excedente queda pendiente y Contador no autoaprueba - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 13: CU101 calendario chileno y permisos CU96-CU105 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-agenda-terreno.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 8: T1 agenda reutiliza visitas y expone sólo relaciones OT explícitas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: listado conserva visitas programadas y pendientes de programación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: detalle deriva resultado y OT sólo desde relaciones explícitas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: visita sin tarea no fabrica relaciones ni resultados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: T3 sólo expone instalaciones respaldadas por visita y OT explícitas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: clasifica resultados sin confundir cierre de visita con instalación completada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: reutiliza permisos existentes sin conceder privilegios nuevos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-catalogos-previsionales.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 20: M6 expone catálogos previsionales funcionales sin depender del seed - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: devuelve siete AFP activas y los sistemas de salud con su tipo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: persiste AFP, Fonasa e Isapre y desactiva el pacto al salir de Isapre - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: la UI separa sistema e institución y traduce porcentaje humano sin hardcodear catálogos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu155-cu158.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 24: M6 T1 CU155-CU158 administra el maestro actual de empleados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CU155 consulta, busca, filtra, ordena y selecciona minimizando datos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: CU156 registra empleado sin Usuario y controla payload y duplicidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: CU157 conserva períodos laborales al terminar y reingresar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 126: CU157 impide dos períodos vigentes ante creación concurrente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 145: CU158 enruta el catálogo remuneracional antes del parámetro de empleado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 168: CU158 mantiene perfil actual sin históricos ni acoplar cargo y sueldo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu159-cu166.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 22: M6 T2 CU159-CU166 configura esquemas y HABER sin calcular remuneraciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: CU159 consume esquemas existentes, permite varios y bloquea superposición - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: CU160 asigna sólo conceptos HABER y no calcula liquidación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: CU161 reutiliza estado actual y valida disponibilidad del canal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: CU162 administra esquemas y Cargo default sin alterar empleado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 85: CU163 conserva vigencias, excepciones y rechaza carreras - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 98: CU164 activa configuración completa y bloquea dependencia ambigua - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 108: CU165 crea HABER común y CU160 lo consume extremo a extremo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 117: CU166 conserva configuración anterior, futura y excepción temporal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 129: permisos CU159-CU166 permanecen sin perfiles inventados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 136: la vista compartida no convierte CU162 en permiso maestro - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 151: concepto conserva identidad y configuración es la única fuente temporal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 157: rutas estáticas de catálogos M6 preceden a /empleados/:id - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu167-cu171.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 18: M6 T3 CU167-CU171 mantiene parámetros seguros sin ejecutar procesos posteriores - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: CU167 conserva vigencias, resuelve por fecha y rechaza solapamiento concurrente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: CU168 reutiliza concepto_remuneracion sin asignar ni calcular - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 108: CU169 conserva una configuración provisional sin fórmula ni familia propia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 125: CU170 registra sólo elegibilidad descriptiva sin borrar ni anonimizar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 142: CU171 distingue NULL Legacy de false y conserva M1-M5 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 170: permisos CU167-CU171 son individuales y no asignan perfiles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 191: persistencia y frontend respetan las decisiones de alcance - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu172-cu173.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 13: M6 T4 CU172-CU173 integra Terreno por referencia sin adelantar CU futuros - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: sólo una ejecución terminada y validada es elegible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: Usuario se resuelve a Empleado y alias de unidad/cantidad valorizan sin duplicar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: unidad y cantidad tienen semántica explícita sin asumir cantidad uno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: Usuario sin Empleado queda pendiente y Empleado sin Usuario sigue válido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: falta, ambigüedad y REGLA no ejecutable no se resuelven arbitrariamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: CU173 decide dos retrabajos de una ejecución de forma independiente y conserva Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: CU173 serializa decisiones incompatibles para la misma incidencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 92: permisos CU172 y CU173 son independientes y no adelanta CU211+ - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 103: persistencia conserva referencia mínima y frontend separa acciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu174-cu177.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 13: M6 T5 CU174-CU177 gestiona componentes individuales sin implementar CU178/CU179 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: scaffolding crea un único contexto abierto sin calcular ni cerrar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: CU174 valida monto positivo y no crea catálogos reutilizables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: CU174 conserva rechazo, trazabilidad, regla pendiente y bloquea remuneración cerrada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: CU174 serializa dos decisiones simultáneas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: CU175 registra variable manual con fuente, período y aprobación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: CU175 automático versus manual genera conflicto y resolución sin overwrite - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: CU175 serializa la resolución simultánea de un conflicto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: CU176 conserva versiones externas e impide duplicar la misma versión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 84: CU176 ajustes positivos y negativos no modifican el valor externo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 93: CU177 consulta CU169 y no inventa fórmula ni interpreta NULL como cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 100: CU177 excepción individual exige fundamento, se aprueba y no altera CU169 ni relación laboral - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 112: scaffolding conserva reemplazos históricos y protege una sola remuneración actual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 127: dos creaciones concurrentes dejan una sola remuneración actual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 134: permisos CU174-CU177 siguen independientes tras incorporar CU178-CU182 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 141: modelo común no adelanta familias ni motores prohibidos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu178-cu182.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 13: M6 T6 CU178-CU182 ejecuta el ciclo mensual sin pagos ni documentos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: CU178 resuelve solapamiento, reingreso una sola vez y empleado sin Usuario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: CU179 crea/reutiliza ABIERTA, recalcula idempotente y conserva manuales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CU179 bloquea el cálculo cuando falta la configuración previsional del período - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: CU179 serializa recálculos concurrentes sin duplicar la remuneración ni sus fuentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: CU180 serializa cierres, congela y deriva liquidación sin documento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: CU182 exige aprobador distinto y serializa la creación de R2 sin mover componentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: CU181 sólo cierra con toda la población exigible cerrada y no exige pago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: permisos CU178-CU182 siguen independientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: persistencia no crea artefactos descartados ni tasas hardcodeadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: auditoría CU157-CU182 protege población, decisiones y cierres históricos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: CU157 bloquea intervalos retroactivos y permite intervalos posteriores - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: CU157 y CU181 serializan la población del período - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: CU179 no aplica catálogos globales y preserva automáticos revisados/referenciados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: CU180 revalida tarifa y hechos nuevos antes de cerrar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 98: historia cerrada y CU182 no alteran cifras ni componentes de R1 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 107: guard de pago usa la fuente real y CU214 reutiliza la asignación común - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu183-cu186.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 13: M6 T7 CU183-CU186 conserva historia y registra pagos efectivos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: PREPARADO no paga; CONFIRMADO paga y es inmutable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: CU182 queda bloqueado por la fuente real de pago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: CU183 registra direcciones inequívocas sin alterar R1 ni pagar directo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: CU183 rechaza cero, signo doble y motivo faltante - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: postergación exige período explícito y serializa carreras - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: CU184 crea una regularización positiva, única, corregible y cerrable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: CU186 bloquea doble pago confirmado concurrente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: CU185 fijo: preparado no reduce y doble confirmación idempotente integra CU179 una vez - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: CU185 porcentaje queda pendiente sin semántica explícita de base - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: medios ambiguos y respaldos faltantes bloquean - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: CU182 y CU186 concurrentes no reabren una remuneración pagada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: CU183 y CU186 concurrentes comparten una sola condición económica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: integridad polimórfica rechaza orígenes inválidos y borrados huérfanos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: persistencia protege CONFIRMADO y permite sólo anulación registral completa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: permisos CU183-CU186 son específicos y llegan a CU205 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: modelo evita entidades descartadas y encapsula el origen físico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu187-cu190.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 13: M6 T8 CU187-CU190 honorarios, detalle, anulaciones y reversiones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: CU187 sólo consume boleta CONFIRMADA y paga el líquido fijado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: PREPARADO no paga, la clave es idempotente y CONFIRMADO sí paga - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: CU188 deriva detalle, origen y usuarios sin tabla historial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CU189 anula el mismo pago, exige motivo y permite un pago posterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: CU190 libera saldo para repago parcial y total sin sobrepago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: dos repagos concurrentes compiten por un único saldo pendiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: anticipo usa efecto neto y vuelve a total tras repago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: remuneración conserva cierre y admite repago del monto revertido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: boleta CONFIRMADA queda físicamente inmutable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: permisos reconocen CU196-CU205 y CU207 no existe - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu191-cu195.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: M6 T9 CU191-CU195 documentos y exportaciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: CU191 diferencia histórica/vigente, congela cifras y limita autoservicio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: anticipo PREPARADO no es oficial y CONFIRMADO sí conserva condición neta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: CU192 usa consentimiento, resuelve vigente, fake de correo y traza aceptación sin fingir entrega - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: CU192 fallo del transporte responde 503, registra FALLIDO y CU193 no lo considera entrega - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CU192 mantiene vigente bloqueada durante un reenvío concurrente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: CU193 registra última condición conceptual sin entidad paralela - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: controller queda desacoplado del modelo físico y admite adapter sustituible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: CU194 exporta ABIERTA marcada no oficial con bloqueos y sin mutar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: CU195 usa snapshot oficial vigente, excluye abierta/reemplazada y conserva consulta histórica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: permisos llegan a CU205 sin CU207 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu196-cu197.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 10: M6 T10 CU196-CU197 consulta y prepara boletas sin implementar tributación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: CU196 lista pendientes y confirmadas sin romper campos tributarios NULL - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: CU196 detalle presenta prestador y deriva pago/reversión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: CU197 crea PENDIENTE_CONFIRMACION sin calcular ni asignar modalidad por defecto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: CU197 crea prestador mínimo, valida duplicidad/campos/estado y lo usa inmediatamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: CU197 edita pendiente y bloquea bruto inválido, modalidad vacía y confirmada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: permisos CU196/CU197 siguen específicos al incorporar CU198 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu198.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 10: M6 T11 CU198 confirma boletas con tributación parametrizada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: CON_RETENCION_RECEPTOR calcula retención y líquido con la tasa vigente por emisión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: SIN_RETENCION_PPM_EMISOR fija tasa pero no descuenta ni persiste PPM - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: no usa un parámetro vencido y bloquea cuando no existe uno vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: múltiples parámetros vigentes bloquean atómicamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: unidad incorrecta bloquea la confirmación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: modalidad inválida bloquea la confirmación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: una boleta CONFIRMADA no puede confirmarse otra vez - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: ROUND_HALF_UP redondea la retención a cero decimales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: agregado mensual suma sólo retenciones de boletas confirmadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 78: CU187 puede pagar el líquido fijado por CU198 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: CU198 usa permiso específico y no adelanta CU206 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 91: no existe tasa tributaria hardcodeada ni obligación paralela - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu199-cu201.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 9: M6 Terreno CU199-CU201 reutiliza visita y asignaciones Legacy canónicas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: crear visita vinculada a obra con estado inicial seguro - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: desde visita se deriva cliente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: desde visita se deriva puerta y especificación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: asignar responsable actualiza servicio_terreno.id_usuario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: usuario inexistente bloquea asignación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: Mis tareas devuelve asignaciones por tarea_usuario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: tarea con sólo tarea.id_usuario no aparece asignada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: otro usuario no ve tareas ajenas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: permisos CU199 CU200 y CU201 son independientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu202.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: M6 Terreno CU202 registra levantamiento técnico sobre estructuras Legacy - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: técnico asignado abre el levantamiento y resuelve tarea visita obra cliente y puerta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: técnico no asignado no puede abrir aunque tarea.id_usuario lo identifique - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: guarda especificación y medidas en las tablas Legacy - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: editar medidas reutiliza la puerta y no crea duplicados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: administrador autorizado puede consultar sin asignación técnica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: permiso CU202 es independiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: CU205 reutiliza el levantamiento sin crear tabla paralela - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu203.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: M6 Terreno CU203 corrige levantamientos con historial Legacy - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: corrección requiere un levantamiento previamente registrado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CU202 registra la medida inicial y establece el puntero vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: corrección exige motivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: crea historial v1 a v2, conserva medida anterior y apunta a la nueva - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: edición CU202 posterior modifica sólo la medida vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: segunda corrección incrementa v2 a v3 y lectura muestra valores vigentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: técnico no asignado no puede corregir aunque tarea.id_usuario lo identifique - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: permiso CU203 sigue independiente al incorporar CU205 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu204.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: M6 Terreno CU204 genera una OT idempotente desde el levantamiento vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: bloquea tarea sin levantamiento registrado y usuario no asignado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: genera OT pendiente vinculada a la especificación sin proyecto área ni usuario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: segunda llamada y consulta devuelven la misma OT sin duplicar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: dos creaciones concurrentes dejan y devuelven una sola OT pendiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: CU203 sigue corrigiendo el mismo levantamiento sin perder la OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: permiso CU204 sigue independiente al incorporar CU205 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu205.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: M6 Terreno CU205 ajusta y libera la OT reutilizando el levantamiento vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: CU204 crea pendiente y conserva referencias operativas nulas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: una OT activa previa se reconoce sin duplicarla - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: una OT pendiente tampoco se duplica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: ajustar OT reutiliza historial CU203 y preserva la medida anterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: libera pendiente a en_progreso sin tocar materiales reservas ni referencias - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: en_progreso no puede liberarse otra vez - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: CU204 no duplica una OT ya liberada en_progreso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: activa puede liberarse por compatibilidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: completada y cancelada son terminales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: doble liberación concurrente produce un éxito y un conflicto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: CU205 es independiente y CU207 permanece ausente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu206.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: M6 Terreno CU206 genera tareas explícitas para una OT liberada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: rechaza OT pendiente activa completada y cancelada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: CU205 libera la OT y CU206 valida entrada explícita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: crea exactamente el lote recibido, pendiente y vinculado a OT y puerta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: segunda llamada devuelve el lote persistido sin duplicar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: dos llamadas concurrentes no crean un segundo lote - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 80: CU206 tiene permiso independiente y CU207 permanece ausente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 89: migración es mínima y no existen tareas hardcodeadas ni CU207 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu207-cu210.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 8: M6 Terreno CU207-CU210 asigna, ejecuta, valida y prepara salida sin adelantar CU211 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: CU207 impide que una tarea Legacy omita el flujo productivo versionado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CU208 sólo registra ejecución terminada para trabajador asignado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: CU209 resuelve una sola vez sin incidencias ni efecto remuneracional - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: CU210 deriva visita, obra, cliente, puerta y checklist sin inventar inventario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: permisos son independientes y CU211 no existe - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-cu211-cu214.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 2: M6 final CU211-CU214 reutiliza estructuras vigentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 3: CU211 registra formulario y conserva estados permitidos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 3: CU212 permite múltiples y CU213 transiciona sin finanzas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 3: CU214 sólo asigna descuento con fundamento y autorización - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 3: permisos terminan exactamente en CU214 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-dashboard-terreno.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: T5 resume KPIs operacionales sin duplicar puertas ni tareas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 12: una OT repetida se cuenta una sola vez - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 13: clasifica cada OT sólo por su estado vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: etapas repetidas de un área permanecen como tareas distintas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: ejecución registrada no equivale a validada ni cerrada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: tarea validada no se cierra automáticamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: avance es cerradas sobre tareas requeridas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: sin denominador el avance es desconocido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: correcciones pendientes excluyen correctivas cerradas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: promedios usan sólo pares completos y cronológicos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: incidencias rechazadas no se cuentan como fallas confirmadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: CSV chileno conserva BOM, punto y coma, CRLF y escapado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: dashboard y exportación reutilizan permisos de Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-ficha-operativa-ot.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 59: ficha operativa consolida relaciones directas sin alterar estados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: no cuenta una ejecución validada como cierre de tarea - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: incluye sólo la visita vinculada explícitamente por la tarea - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 73: no presenta responsabilidad pendiente como confirmada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 79: presenta responsabilidad sólo después de una revisión aprobada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 85: ordena cronológicamente la línea de tiempo operacional - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 90: mantiene el alcance por empleado para usuarios no administrativos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: Midas administrador original gestiona todas las OT sin alcance de empleado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 100: CU205, CU207 y CU209 habilitan gestión general sin depender del empleado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 103: usuario sin alcance recibe 403 explícito en vez de una bandeja vacía - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 40: Gestión y rectificación obligatoria de una OT comercial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: 01 listado encuentra la puerta sin exigir ID manual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 02 rechaza un empleado activo que no pertenece a Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 03 asigna empleado sin cuenta de usuario y conserva actor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 04 guarda medidas y planificación sin cambiar plantilla maestra - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 05 una corrección crea otra medida y conserva la anterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 06 exige las medidas de la versión familiar y conserva el requisito histórico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 07 envío crea una versión inmutable y bloquea edición silenciosa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 08 backend bloquea tareas productivas y mantiene una sola OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 09 impide que quien registró y envió apruebe su propia versión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: 09b impide aprobar al usuario vinculado al empleado rectificador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: 10 supervisor devuelve la versión con motivo y observaciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: 11 corrección genera una segunda versión sin alterar la devuelta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: 12 no permite aprobar una versión antigua - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 13 aprobación separada conserva la OT sin tareas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: 14 reintento de aprobación es idempotente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 15 liberación crea una tarea ejecutable por tarea planificada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: 16 reintento de liberación no duplica tareas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: 17 no permite ejecutar la segunda tarea antes de validar la primera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: 18 incorpora etapa y tarea adicional con idempotencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: 19 corrección técnica conserva aprobación previa y bloquea hasta reaprobación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 20 inicio, validación y cierre son estados separados y respetan dependencias - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 21 finalización es explícita, validada e inmutable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-historial-remuneracional.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 25: historial remuneracional conserva períodos, versiones, pagos, reversas y snapshot legal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: edición de pago PREPARADO entrega a M9 el valor anterior y nuevo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: historial respeta el permiso M9 al adjuntar evidencia técnica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: sin CU355 no consulta ni expone eventos M9 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 78: con CU355 referencia los eventos M9 del pago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-incidencias-revision.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 10: M6/M7 incidencias categorizadas y revisión gerencial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: crear incidencia exige categoría owner y persiste su vínculo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: categorías se mantienen en un catálogo relacional único - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: área reutiliza area_trabajo en vez de texto duplicado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: no permite aprobar sin evidencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: permite aprobar con categoría evidencia y revisor distinto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: CU213 autoriza revisión y un usuario sin CU213 es rechazado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: rechazo conserva transición y trazabilidad M9 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: M9 registra creación modificación y aprobación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: M7 separa aprobadas pendientes y rechazadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: M7 no infiere categoría desde descripción libre - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: evita autoaprobación y autorechazo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: aprobación y resolución son estados independientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: bandeja usa filtros y paginación sin inventar acciones correctivas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: evidencia y navegación owner tienen acciones reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-pdf-documental.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 30: M6 genera documentos laborales profesionales sin alterar cálculos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: liquidación oficial presenta empleado, componentes, totales y condición vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: liquidación histórica queda diferenciada de la vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: liquidación legal separa descuentos del trabajador y aportes del empleador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: preliminar es no oficial y conserva bloqueos y advertencias humanizados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: documentos complejos agregan páginas sin perder componentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: informe de período agrega valores directos y pagina la nómina completa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 90: comprobante de anticipo respeta reversiones y humaniza estado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 98: formato monetario usa CLP y signo correcto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-post-auditoria.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 20: M6 correcciones finales post-auditoria - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: 1 HABER PORCENTAJE no infiere sueldo base - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: 2 HABER FIJO conserva su cálculo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 80: 3 valor_aplicable explícito prevalece sobre modalidad porcentual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: 4 HABER finalizado aplica dentro de su vigencia histórica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 92: 5 DEDUCCION finalizada aplica dentro y no después de su vigencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 101: 6 asignaciones históricas inactivas bloquean solapamientos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 106: 7 asignaciones posteriores al término histórico son permitidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 113: 8 CU159 considera historia finalizada al validar solapamientos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 124: 9 CU159 finaliza concurrentemente una sola vez - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 139: 10 CU160 finaliza concurrentemente una sola vez - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 153: 11 CU214 finaliza concurrentemente una sola vez - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 167: 12 períodos cerrados permanecen intactos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m6-prevision-rut.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 51: M6 calcula previsión legal versionada sin mezclar aportes patronales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: M6 aplica Isapre, vínculo y comisión AFP sin alterar reglas ajenas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: plan Isapre superior al siete por ciento genera sólo el adicional - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: plan Isapre igual al siete por ciento no genera adicional - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 76: plazo fijo no descuenta cesantía al trabajador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 81: exclusión fundada no aplica cesantía de trabajador ni empleador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: la AFP seleccionada cambia sólo su comisión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: M6 activa la reforma sólo por parámetros vigentes y no por una fecha hardcodeada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 97: período sin parámetros de reforma no agrega aportes de reforma - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 101: período con parámetros de reforma agrega exactamente 3,5% - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 108: configuración parcial de reforma bloquea el cálculo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 114: M6 respeta topes, exención tributaria y bloquea configuración incompleta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 125: M6 no inventa reglas previsionales para DIPRECA u Otro - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 137: RUT módulo 11 acepta formatos válidos y rechaza dígitos incorrectos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 87: M7 cierre de hallazgos CU225 CU226 CU227 CU230 CU231 CU232 y navegación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 90: 01 CU225 lista futuros ordenados por vencimiento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 91: 02 CU225 excluye obligación liquidada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 92: 03 CU225 conserva estado owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 93: 04 CU225 no presenta compromiso como cobro - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 94: 05 CU225 navega a Cliente con CU09 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: 06 CU225 oculta navegación sin permiso owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 98: 07 CU226 expone cartera vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 99: 08 CU226 calcula atraso real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 100: 09 CU226 futura no es morosa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 101: 10 CU226 filtra por proveedor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 102: 11 CU226 ordena por monto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 103: 12 CU226 navega al owner permitido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 104: 13 CU227 ordena futuros - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 105: 14 CU227 excluye liquidada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 106: 15 CU227 identifica compromiso, no pago - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 107: 16 CxP oculta navegación sin permiso owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 110: 17 CU230 agrupa por día - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 111: 18 CU230 separa entradas y salidas reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 112: 19 CU230 calcula flujo real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 113: 20 CU230 compara período anterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 114: 21 CU230 soporta semana - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 115: 22 CU230 base cero deja porcentaje N/A - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 116: 23 CU230 filtra categoría real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 117: 24 CU230 filtra origen real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 118: 25 CU230 crea drill-down sólo con permiso owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 119: 26 CU230 oculta id y ruta sin permiso owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 122: 27 CU231 no inventa ni expone saldo bancario sin CU228 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 123: 28 CU231 separa compromisos y liquidez proyectada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 124: 29 CU231 no presenta compromisos futuros como realizados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 133: 30 CU232 informa base insuficiente sin fabricar riesgo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 136: 31 frontend usa Link con destino autorizado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 137: 32 destino inexistente no genera enlace falso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 138: 33 test CU246 quedó renombrado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 139: 34 no queda referencia activa al nombre CU224 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-cobertura-ebitda.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 14: M7 cobertura de gastos operacionales y EBITDA real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: 01 venta neta correcta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: 02 costo directo correcto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: 03 gastos operacionales identificados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: 04 gasto sin clasificación no se incluye - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: 05 pago no equivale automáticamente a gasto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: 06 IVA crédito no entra como gasto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: 07 IVA débito no entra como ingreso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: 08 remuneración no se duplica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: 09 caja chica no se duplica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: 10 inventario no se trata como gasto inmediato - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: 11 monedas sin FX válido no se mezclan - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 12 gasto sin cobertura queda null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 13 EBITDA no calculable con cobertura parcial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 14 EBITDA válido sólo con cobertura completa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: 15 EBITDA porcentual con base cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: 16 margen directo no se llama EBITDA - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: 17 proyecto sin gastos atribuibles no inventa EBITDA - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: 18 rango respeta fechas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: 19 comparación A B respeta cobertura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: 20 B2B B2C no mezclan costos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: 21 presupuesto no contamina datos reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: 22 flujo de caja no se altera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 23 permisos respetados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: 24 panel informa faltantes correctamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-credito-ejecutivo.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 13: M7 visualización ejecutiva de crédito M8 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: 01 consume exposición desde el indicador tipado exposicion.valor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: 02 consume alertas desde el indicador tipado alertas.valor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: 03 muestra cupo total agregado oficial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 04 muestra cupo utilizado agregado oficial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: 05 muestra cupo disponible agregado sin forzar cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 06 utilización se calcula contra cupos aprobados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 07 barra segmentada usa naranja para utilizado y gris para disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 08 barra expone tooltip con total, utilizado, disponible y utilización - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 09 sobrecupo conserva disponible negativo y muestra su magnitud - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: 10 porcentaje real puede superar 100 y ancho visual queda acotado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 11 capacidad global permanece como bloque secundario separado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: 12 límite global nulo informa configuración pendiente sin porcentaje inventado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 13 alertas se limitan a tipos oficiales M8 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: 14 diferencia total de alertas y clientes únicos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 81: 15 condición F047 no se muestra como alerta activa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: 16 B2C muestra no aplica y oculta cifras de crédito - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 91: 17 TODOS y B2B declaran alcance B2B del estado actual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 96: 18 respeta CU240, CU241 y la ruta real de detalle - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 104: 19 declara que el crédito es actual y no compara A/B - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-cu215-cu219.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 44: M7 capacidades financieras existentes con numeración definitiva - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 01 período mensual tiene límites estables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 02 período inválido se rechaza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: 03 dataset vacío conserva cobertura sin inventar monto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 04 ventas usa monto neto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 05 venta emitida no es definitiva - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 06 ventas anuladas y revertidas se excluyen - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 07 comparación con base anterior cero no divide por cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 08 desglose por cliente usa fuente M2 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: 09 tipo de cliente está disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: 10 producto no se inventa sin detalle estructurado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: 11 CxC mantiene saldo propietario M3 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: 12 CxC detecta morosidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: 13 recaudación usa pago efectivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 14 compromiso CxC exige monto y fecha - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 15 CxP usa obligación M5 vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: 16 CxP conserva estado propietario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: 17 CxP agrupa proveedor real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: 18 CxP expone categoría M5 sin inventarla - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: 19 compromiso CxP conserva fecha y monto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 20 liquidez no inventa saldo inicial desde movimientos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 21 flujo histórico usa movimientos reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: 22 proyección conserva estructura sin inventar saldo final - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: 23 permisos definitivos son independientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 73: 24 catálogo M7 termina en CU258 y M8 comienza en CU259 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: 25 panel parcial oculta bloque completo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: 26 una fuente caída no rompe bloques sanos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 76: 27 backend M7 escribe sólo parámetros, ajustes y auditoría autorizada sin exponer personas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 77: 28 existen las migraciones M7 autorizadas y CU233 tiene operación propia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 78: 29 rutas y vistas mantienen permisos definitivos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-cu216-cu221.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 83: M7 CU216-CU221 definitivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: 01 agrega excepción CxC válida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: 02 agrega excepción CxP válida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 88: 03 proyecto con pérdida aparece con fuente y permiso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 89: 04 Centro de Atención no genera score - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 90: 05 una fuente caída conserva otras familias - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: 06 CU216 solo no filtra información subyacente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 98: 07 cuenta cotizaciones vigentes pendientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 99: 08 monto se rotula potencial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 100: 09 cotización formalizada deja de aparecer - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 101: 10 cotización sin monto no inventa cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 102: 11 no genera probabilidad ni forecast - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 103: 12 navegación preserva owners M2 y M1 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 105: 13 CU218 habilita únicamente el segmento de conversión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 106: 14 conversión usa Nota de Venta válida sin forecast ni probabilidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 109: 15 ticket medio usa ventas válidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 110: 16 cero ventas deja ticket no aplicable y cobertura explícita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 111: 17 monto neto sigue siendo base principal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 112: 18 anuladas y revertidas no participan - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 115: 19 participación por Cliente es correcta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 116: 20 total cero deja participación no aplicable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 117: 21 ranking usa monto y orden determinista - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 118: 22 concentración no contiene score - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 119: 23 Producto/Familia exige fuente estructurada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 122: 24 contexto de Cliente carga identidad mínima - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 123: 25 CU221 + CU222 muestra CxC - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 124: 26 CU221 sin CU222 no devuelve CxC - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 125: 27 CU221 + CU219 muestra Ventas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 126: 28 CU221 sin CU219 no devuelve Ventas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 127: 29 contexto no expone edición de Cliente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 128: 30 navegación a owners funciona - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 130: 31 CU219 no concede CU220 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 131: 32 CU220 no concede CU219 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 132: 33 CU216 no concede permisos subyacentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 133: 34 CU217 usa permiso independiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 134: 35 CU221 filtra cada bloque en backend - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-cu220-cu224.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 41: M7 capacidades existentes remapeadas CU233-CU246 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 01 margen resta ingresos y costos atribuibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 02 ingreso sin Proyecto inequívoco no se atribuye - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 03 costo sin Proyecto inequívoco no se atribuye - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 04 no prorratea gasto general - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 05 pérdida se clasifica por margen monetario negativo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: 06 ingreso no positivo deja porcentaje no aplicable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: 07 sin umbral no usa default - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: 08 umbral válido usa orientación menor o igual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: 09 cobertura parcial queda visible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: 10 consultar margen no persiste resultados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 11 resumen sólo incluye partidas reconstruibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: 12 faltante no se convierte a cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: 13 cobertura parcial es explícita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: 14 títulos no presentan estados contables formales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: 15 patrimonio no se inventa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: 16 corrección de fuente se refleja al consultar nuevamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 17 período y fecha de corte se conservan - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: 18 genera informe gerencial de Panel - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: 19 genera PDF de análisis especializado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 76: 20 PDF conserva período y filtros - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 77: 21 PDF presenta cobertura sin estados técnicos crudos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 78: 22 PDF contiene fecha completa y hora - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 79: 23 vista sin CU245 no descarga - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 80: 24 CU245 sin permiso de origen no descarga - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 81: 25 Panel PDF no filtra bloques no autorizados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: 26 PDF no se persiste en BD - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 83: 27 archivo generado no cambia con consultas posteriores - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 88: 28 CU246 no tiene valor default - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 89: 29 migración 040 admite DASHBOARD y conserva tipos previos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 90: 30 CU246 protege consulta y configuración - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 91: 31 existen las migraciones M7 autorizadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 92: 32 solapamiento no se elude con persistencia paralela - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 93: 33 CU246 escribe sólo el mantenedor existente de forma serializable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 94: 34 CU233 queda listo para consumir un umbral vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: 35 CU246 no crea tabla M7 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 96: 36 M6 conserva su mantenedor y permisos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-cu222-cu237.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 50: M7 Tanda 2 CU222 CU223 CU232 CU236 CU237 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: 01 obligación vencida calcula días correctos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 02 obligación futura no aparece como morosa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: 03 fecha faltante no inventa aging - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 04 aging no se persiste - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: 05 cartera no genera score - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: 06 sólo pagos efectivos cuentan como cobranza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: 07 vendido no se considera cobrado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: 08 cumplimiento usa sólo montos exigibles del período - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 09 mora previa recuperada usa el pago efectivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 10 fórmula de cumplimiento queda explícita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: 11 detecta primera fecha negativa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 83: 12 identifica mínimo del horizonte - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 84: 13 sin déficit lo informa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 85: 14 factor sin permiso no se expone - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: 15 riesgo no crea score ranking ni recomendación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: 16 proyección inválida no calcula - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 91: 17 sólo incluye Proyectos realmente abiertos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 92: 18 reutiliza atribuciones válidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 93: 19 CxC sin vínculo no se inventa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 94: 20 cobertura parcial es visible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: 21 exposición no genera score Proyecto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 98: 22 contexto Proyecto funciona - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 99: 23 sin permiso operacional no expone progreso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 100: 24 bloque financiero funciona aunque Terreno falle - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 101: 25 contexto no permite escritura en owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 102: 26 navegación contextual funciona - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 104: 27 CU222 no concede CU223 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 105: 28 CU231 no concede CU232 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 106: 29 CU236 no concede CU234 CU235 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 107: 30 CU237 no concede permisos operacionales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 108: 31 fallos parciales no tumban respuesta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-cu242-cu253.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 4: M7 operación y costos CU242 CU247 CU248 CU250 CU253 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: 01 total agregado coincide con M6 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: 02 evolución por período correcta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 03 comparación válida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 04 base cero deja variación no aplicable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 05 no expone salario individual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: 06 no expone RUT ni nombre individual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: 07 atribución Proyecto sólo usa vínculo válido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: 08 usa OT canónica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: 09 muestra estado real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: 10 no inventa progreso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: 11 no permite edición - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: 12 contexto faltante no tumba OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 13 permiso operacional independiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: 14 abiertos según owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: 15 atraso exige fecha válida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: 16 próximo no usa umbral inventado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 17 asignación usa relación canónica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 18 no calcula capacidad porcentual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: 19 no crea score - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: 20 sólo instalaciones identificables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: 21 volumen por período correcto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 22 evolución correcta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 23 ubicación válida segmenta correctamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: 24 ubicación faltante no inventa región - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 25 no geocodifica ni infiere arbitrariamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 26 usa productor existente con detalle humano - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 27 incidencia vinculada aparece - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 28 incidencia pendiente no se presenta como falla validada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 29 abierta y cerrada respetan owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 30 no crea ranking de empleados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: 31 no permite cerrar ni modificar incidencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: 32 vínculo insuficiente deja cobertura parcial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: 33 CU242 no concede M6 individual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: 34 CU247 no concede CU248 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: 35 CU248 no concede CU250 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: 36 CU250 no concede CU253 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 37 CU253 no concede mantenimiento Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: 38 fallo de un bloque no tumba los demás - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-cu246.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 18: M7 CU246 configura el umbral de margen crítico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: 01 migración 040 permite DASHBOARD - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 02 tipos anteriores siguen admitidos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 03 tipo inválido sigue excluido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 04 sin configuración CU233 queda pendiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: 05 valor negativo es rechazado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: 06 valor mayor a cien es rechazado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: 07 texto inválido y null son rechazados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: 08 crear umbral 15 por ciento funciona sin convertirlo a fracción - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: 09 CU233 consume el valor vigente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: 10 cambio conserva la fila anterior y cierra su vigencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: 11 cambio el mismo día devuelve conflicto y no sobrescribe - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: 12 vigencias creadas no se superponen - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 13 ambigüedad efectiva no se resuelve arbitrariamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: 14 cambio concurrente deja un ganador y un conflicto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: 15 CU246 no puede modificar códigos M6 y tiene permiso independiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: 16 CU233 no necesita CU246 para consultar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 17 no crea modelo tabla ni persistencia de cálculo M7 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 18 parámetros M6 permanecen intactos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-cu252.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 17: M7 CU252 atrasos de instalaciones con cobertura parcial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: 01 límite vencido y estado activo produce atraso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: 02 días de atraso usan calendario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: 03 límite futuro queda en plazo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: 04 límite ausente no es cero ni en plazo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 05 relación no inequívoca queda excluida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: 06 tarea finalizada no aparece como atraso activo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 07 tarea anulada no aparece como atraso activo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: 08 no usa fecha creación como inicio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: 09 no usa actualización como término - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: 10 duración queda no calculable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 11 tiempo de ciclo queda no calculable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 12 fecha ejecución no se usa como inicio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: 13 CU250 no concede CU252 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: 14 CU253 no concede CU252 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 73: 15 CU252 no escribe en Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: 16 Centro de Atención integra atraso válido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: 17 Centro de Atención no alerta por ausencia de fecha - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 79: 18 fallo CU252 no tumba CU250 ni CU253 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 84: 19 no crea score ni prioridad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 85: 20 conserva sólo las migraciones M7 autorizadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 86: 21 utiliza el año seleccionado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: 22 no mezcla tareas fechadas en otro año - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 88: 23 incluye correctamente el límite UTC del primer día - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 89: 24 conserva sin fecha en cobertura separada sin declararla atraso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-delta-controlado.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 13: M7 delta controlado CU218-CU258 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: 01 permisos nuevos permanecen independientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: 02 CU218 y CU224 exponen sólo su segmento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 03 conversión usa NV activa, excluye anulada y no depende de pagos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 04 denominador cero queda NO_APLICA - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: 05 liquidez acumula movimientos e incorpora Caja Chica sólo mediante su movimiento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 06 ajuste manual exige Administrador y justificación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: 07 consumidor M8 entrega fixture sin recalcular crédito - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: 08 caída o ausencia M8 no devuelve cero falso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: 09 bloqueos provienen exclusivamente del owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 79: 10 múltiples umbrales generan cruces en fechas distintas y conservan el mínimo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 88: 11 IVA estimado resta compras de ventas por moneda - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 96: 12 margen de instalación entrega agregados y comparación temporal geográfica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 104: 13 inventario valorizado calcula stock por costo unitario y conserva cobertura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 112: 14 riesgo de stock distingue material suficiente y faltante sin score - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 122: 15 recepciones futuras calculan cantidad pendiente y fecha esperada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 129: 16 caída de Inventario y Compras conserva estado de fuente no disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 140: 17 migración 041 es aditiva y mantiene vínculos opcionales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 145: 18 parámetros se mantienen en el Mantenedor existente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 150: 19 inventario y compras son consultas de sólo lectura en M7 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 155: 20 Cotización muestra advertencia sin bloquear aprobación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 160: 21 Ficha Cliente omite cero días de atraso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 165: 22 estados de fuente están renderizados de forma aislada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 170: 23 rutas y frontend cubren CU240-CU258 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 176: 24 M7 no implementa CU259 ni resultados persistidos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-historico-panel.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 14: M7 histórico gerencial de doce meses - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: devuelve exactamente doce períodos para octubre 2026 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: comparación interanual de octubre 2026 incluye octubre 2025 y conserva doce meses visibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: cambiar el corte desplaza la ventana completa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: orden cronológico estable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: mes sin hechos no fabrica costos ni resultado cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: cobertura evita falsa evolución CxC CxP Crédito e Inventario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: Resultado gerencial conserva cobertura limitada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: permiso y ruta reutilizan CU215 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: frontend consume una fuente histórica acotada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: ventana inválida se rechaza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: M7 ventas comparativas de panel - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: MoM aplica diferencia sobre valor absoluto de la base - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: YoY compara contra el mismo mes del año anterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: base cero o ausente devuelve N/A representado por null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: YTD usa enero hasta el mismo mes en ambos años - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: multimoneda usa CLP directo, FX histórico y excluye sin tasa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: gráfico conserva doce meses y compara ventas y resultado con el mismo mes anterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 81: resultado anterior sin cobertura permanece sin dato y la línea conserva el corte - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: filtro de ventas mantiene año mes y ofrece rango accionable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 96: M7 comparativo interanual de conversiones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 104: 1 octubre 2026 compara con octubre 2025 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 105: 2 enero 2026 compara con enero 2025 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 106: 3 noviembre 2025 compara con noviembre 2024 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 107: 4 la ventana móvil conserva sólo doce meses visibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 108: 5 el histórico solicita cobertura suficiente para el año anterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 109: 6 la diferencia se etiqueta y formatea en puntos porcentuales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 110: 7 35 por ciento frente a 48 por ciento devuelve más 13 pp - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 111: 8 cero cotizaciones produce tasa N A - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 112: 9 cero convertidas con cotizaciones produce cero por ciento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 113: 10 mes sin histórico conserva referencia nula - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 114: 11 la línea histórica se interrumpe donde faltan datos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 115: 12 B2B usa el mismo filtro owner para ambos años - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 116: 13 B2C usa el mismo filtro owner para ambos años - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 117: 14 modo rango conserva período y muestra su conversión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 118: 15 modo comparar calcula diferencia de conversión B contra A - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 119: 16 navegación conserva todos los parámetros maestros - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 120: 17 el gráfico compartido aplica discontinuidad sólo por serie - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 123: M7 comparación flexible entre períodos de ventas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 128: marzo vs junio conserva los días reales y la posición relativa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 129: rango abril-mayo conserva fechas inclusivas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 130: rango puede cruzar el cambio de año - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 131: períodos de distinta duración publican total y promedio por separado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 132: base A cero devuelve variación N/A como null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 133: segmento B2B se aplica a ambos períodos con la función owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 134: FX faltante continúa excluido sin usar tasa actual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 135: URL persiste modo rangos A B y segmento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 136: mes sobrante queda ausente y nunca se rellena con cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 139: M7 granularidad temporal adaptable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 141: 13 rango octubre completo selecciona granularidad diaria - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 142: 14 rango de 31 días produce 31 puntos y no una barra mensual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 143: 15 rango 15 abril a 20 mayo mantiene secuencia diaria continua - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 144: 16 rango que cruza año conserva todos los días y el año real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 145: 17 septiembre vs octubre se alinea día contra día - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 146: 18 septiembre 30 días vs octubre 31 deja el día sobrante como null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 147: 19 comparación A B usa dos líneas del mismo tipo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 148: 20 tooltip comparativo muestra ambas fechas reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 149: 21 períodos mayores a 62 días cambian a granularidad mensual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 150: 22 distinta duración calcula el promedio diario o mensual correcto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 151: 23 ausencia real de ventas se representa como cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 152: 24 falta de cobertura FX permanece null y no se transforma en cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 155: M7 segmentación comercial y productos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 158: filtro B2B usa la clasificación owner normalizada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 159: filtro B2C usa la clasificación owner normalizada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 160: TODOS conserva el universo general - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 161: conversión se calcula por cantidad dentro del segmento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 162: unidades usa cantidad real del detalle - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 163: múltiples detalles no duplican el neto de la NV - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 164: valor se prorratea según peso de subtotales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 165: participaciones del prorrateo suman aproximadamente 100% - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 166: valor extranjero usa exclusivamente FX histórico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 167: sin FX se excluye valor pero se conservan unidades - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 168: segmento sin resultados y rango combinado permanecen accionables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 171: M7 filtro temporal maestro del Dashboard - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 179: 1 Mes conserva año mes MoM YoY YTD e histórico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 180: 2 Rango modifica los KPIs historizables del panel - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 181: 3 Comparar produce snapshots completos A y B - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 182: 4 distinta duración queda visible y conserva promedio comparable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 183: 5 B2B y rango comparten una sola consulta aplicada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 184: 6 B2C y comparación conservan segmento y ambos períodos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 185: 7 Productos usa el bloque del rango y compara A B sin dos donuts - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 186: 8 Estado de Resultados usa el contexto y compara A B - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 187: 9 Flujo ejecutado usa movimientos del rango - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 188: 10 CxC vigente se etiqueta como saldo actual sin histórico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 189: 11 CxP vigente se etiqueta como saldo actual sin histórico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 190: 12 URL reconstruye el contexto completo al recargar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 191: 13 Ver detalle conserva la consulta maestra - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 192: 14 Volver al panel conserva location search - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 193: 15 Actualizar recarga sin limpiar filtros - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 194: 16 PDF distingue Mes Rango y Comparar sin etiquetar otro período - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 195: 17 Excel comparativo usa hojas separadas A y B - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 196: 18 comparación que cruza años conserva fechas exactas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 197: 19 falta de FX histórico permanece fuera del consolidado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 198: 20 base cero no produce NaN ni Infinity - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 201: M7 exportación Excel detallada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 218: produce un XLSX real y un nombre descriptivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 219: incluye metadatos de período segmento y fecha - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 220: genera una fila por detalle comercial sin agrupar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 221: mantiene fechas y montos como valores tipados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 222: conserva filtro y encabezado congelado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 223: el neto prorrateado no duplica la nota de venta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 224: usa FX histórico y conserva el valor CLP por ítem - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 225: backend aplica rango segmento estados definitivos y deja FX faltante sin CLP - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 226: reutiliza CU245 y registra el evento M9 requerido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 227: cotizaciones y UI cubren selección carga error y cancelación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 230: M7 Estado de Resultados gerencial y EBITDA - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 235: ventas usa la fuente neta sin IVA - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 239: costo directo produce margen bruto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 240: gasto operacional se descuenta una sola vez - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 241: EBITDA con cobertura completa aplica ventas menos costo menos gastos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 242: EBITDA porcentaje se calcula sobre ventas netas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 243: ventas cero devuelve porcentaje N/A como null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 244: cobertura parcial no publica EBITDA falso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 249: IVA usa campos owner y permanece en bloque separado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 255: M7 flujo real, compromisos y presupuesto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 258: flujo real aplica entradas menos salidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 259: clasifica ingreso y egreso reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 260: clasifica ajustes de entrada y salida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 261: proyección owner usa CxC M3 y CxP M5 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 262: compromisos sin fecha o monto válido quedan fuera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 263: real vs proyectado calcula diferencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 264: base proyectada cero deja porcentaje N/A - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 265: mantenedor reutiliza CU246 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 266: modificaciones se auditan por M9 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 267: Caja Chica entra sólo mediante movimiento financiero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-integracion-inventario.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 14: M7 bloque 8 integración financiera con Inventario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: 01 precio CLP válido conserva cero explícito - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: 02 moneda extranjera exige conversión y FX histórico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: 03 moneda extranjera sin FX no es valorizable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: 04 moneda extranjera sin monto convertido no es valorizable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: 05 múltiples precios vigentes quedan ambiguos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: 06 material sin precio queda sin fuente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: 07 OCS abierta calcula pendiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: 08 recepción total deja pendiente cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: 09 recepción superior no produce pendiente negativo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: 10 compra anulada se excluye - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: 11 compra cerrada no se presenta como entrada futura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 12 consumo real y estimado permanecen separados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 13 ausencia de consumo real conserva diferencia null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 14 ausencia de estimación conserva diferencia null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 15 agrega stock físico de un SKU en varias bodegas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 16 conserva múltiples lotes del mismo SKU - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: 17 conserva dos bodegas sin sobrescribir cantidades - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: 18 detalle conserva la clave SKU-lote-bodega - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: 19 reserva agregada no se descuenta dos veces - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 20 reserva detallada se usa sólo para conciliación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 21 valorización referencial usa el stock físico actual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: 22 stock actual no simula saldo histórico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 23 valorización histórica permanece no disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 24 trazabilidad declara clave compuesta de inventario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 25 trazabilidad marca riesgo de duplicación de reservas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 26 recepción M5 no prueba ingreso a bodega - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 27 movimiento no tiene vínculo estructurado con OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: 28 cobertura histórica de inventario no es calculable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: 29 rotación queda insuficiente sin clasificación autorizada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: 30 costo estimado no sustituye consumo real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: 31 precio no usa convertido OR original - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 32 traslado o ajuste no se infieren como consumo por regex - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: 33 consultas M7 de inventario son sólo lectura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 34 compra no se incorpora automáticamente como gasto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: 35 EBITDA conserva cobertura incompleta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: ${numero++} ${operacion} exige ${cu} - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 41 filtro Mes conserva corte mensual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 42 filtro Rango conserva fechas solicitadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: 43 vista Control expone secciones A-H - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 73: 44 comparación no presenta falso saldo A/B - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: 45 Panel General etiqueta inventario como actual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: 46 Panel General muestra riesgo, sin precio e inmóvil - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 76: 47 inventario compartido no se atribuye por B2B o B2C - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 77: 48 no se creó migración 054 para este bloque - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-pdf-gerencial.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 28: M7 genera informe financiero gerencial visual y contextual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: panel contiene título, diez páginas y cuatro KPI principales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: incluye histórico, gráficos, tablas y alcance - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: no expone volcado técnico ni fabrica serie histórica de cartera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: paginación completa y consistente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: informe contextual de ventas usa doce meses y escalas independientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: CxC presenta cartera, concentración y cobranza sin rangos inventados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 77: CxP presenta vencimientos, proveedores y compromisos reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 84: Liquidez presenta flujo y proyección sin fabricar saldo bancario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-presupuesto-resultados.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 19: M7 presupuesto anual del Estado de Resultados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: 01 presupuesto de resultados usa tipo correcto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: 02 presupuesto de flujo sólo usa FLUJO_CAJA - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: 03 resultados no contaminan flujo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: 04 categorías económicas válidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: 05 categoría inválida rechazada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: 06 año y mes inválidos rechazados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 07 monto decimal se entrega a persistencia como Prisma.Decimal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 08 no permite duplicados activos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 09 crea presupuesto y adjunta auditoría - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: 10 edición conserva anterior y nuevo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: 11 desactivación no elimina y audita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: 12 operaciones están registradas en M9 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: 13 usuario sin CU246 no puede modificar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: 14 mes no registrado permanece null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: 15 cero explícito es válido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: 16 margen bruto presupuestado correcto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: 17 resultado operativo presupuestado correcto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 18 EBITDA real sigue no calculable sin gastos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: 19 comparación real vs presupuesto usa real menos presupuesto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: 20 interpretación distingue costos desfavorables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: 21 presupuesto base cero devuelve N/A - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 22 YTD compara hasta el mismo mes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 23 presupuesto anual incompleto se identifica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: 24 año futuro no fabrica ejecución real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: 25 CLP y USD no se suman - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: 26 rango parcial no prorratea presupuesto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 27 segmentos no mezclan ejecución con presupuesto corporativo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 28 flujo existente mantiene categorías y fórmula - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-produccion-modelos.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 15: M7 producción, modelos y horas hombre - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: 01 producto comercial no equivale automáticamente a modelo técnico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: 02 segmento B2B usa clasificación financiera estructurada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: 03 segmento B2C usa la misma fuente financiera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: 04 productos vendidos conservan su análisis existente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: 05 unidades producidas cuentan especificaciones únicas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: 06 una Nota de Venta con varios productos no se replica en producción - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: 07 un proyecto con varias puertas conserva cada especificación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: 08 una OT con varias tareas no multiplica unidades - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: 09 relación modelo OT se realiza por ID - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: 10 relación comercial técnica no identificable queda no disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 11 tarea sin unidad horaria no produce horas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 12 cantidad de tareas no son horas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 13 tiempo estimado se mantiene separado de tiempo real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: 14 horas reales exigen ejecución terminada y validada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: 15 costo laboral usa tarea remunerable validada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: 16 tarifa histórica no se recalcula - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: 17 remuneraciones no se duplican con costo oficial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: 18 agregación por modelo usa clave modelo y segmento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: 19 agregación por área usa área oficial de la OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: 20 filtro Mes resuelve período mensual - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: 21 filtro Rango se propaga desde la interfaz - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 22 comparar períodos usa B contra A y conserva null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: 23 cobertura parcial queda explícita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: 24 ausencia de horas equivale a null, no cero - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: 25 permiso de producción no expone costo sin CU242 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 26 no regresión de Ventas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 27 no regresión de costos M7 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: 28 no regresión de EBITDA - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: ruta y navegación usan la vista existente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 8: M7 rebaseline definitivo CU215-CU258 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 9: operaciones existentes usan los CU definitivos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: números provisionales no conceden las capacidades remapeadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: permisos alternativos sólo abren su segmento real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: CU245 sin permiso del análisis de origen no descarga - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: CU233 no filtra información propia de CU234 o CU235 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: CU228 y CU229 acceden a segmentos independientes de liquidez - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 64: M7 definitivo termina en CU258 y CU259 pertenece a M8 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-saldos-bancarios.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 13: M7 saldos bancarios iniciales y cobertura de disponibilidades - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: 01 cuenta bancaria válida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: 02 cuenta duplicada rechazada por identidad exacta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: 03 moneda válida y propia de la cuenta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: 04 saldo inicial positivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: 05 saldo inicial cero explícito - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 06 saldo inicial no registrado permanece null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 07 fecha de corte usa cierre del día - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 08 movimiento anterior no se suma - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: 09 movimiento del día de cierre no se duplica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: 10 movimiento posterior sí se considera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: 11 ingreso suma correctamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: 12 egreso resta correctamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: 13 movimiento anulado queda excluido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: 14 movimiento sin cuenta identificada se informa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: 15 movimiento no conciliado invalida reconstrucción - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: 16 conciliación no genera un tercer importe - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 17 dos cuentas CLP se calculan por separado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: 18 USD no se mezcla con CLP - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: 19 saldo negativo no se oculta - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: 20 fuente incompleta produce null - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 21 saldo bancario no altera flujo ejecutado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 22 saldo inicial no se convierte en ingreso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: 23 presupuesto de flujo no afecta saldo real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: 24 presupuesto de resultados no afecta saldo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: 25 filtro histórico no inventa saldos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 26 permiso de lectura bancaria - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 27 permiso de escritura bancario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: 28 auditoría M9 de creación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 29 auditoría M9 de modificación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 30 navegación al detalle - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 31 estado de cobertura visible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 32 regresión de flujo existente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 114: M7 ventas por modelo y navegación segura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 119: usa nombre estructurado del ítem comercial como modelo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 124: prorratea el neto definitivo y consolida con tipo de cambio histórico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 130: excluye sin conversión y estados no definitivos con cobertura explícita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 135: CU220 expone modelos sin conceder indicadores CU219 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 139: CU219 no expone la distribución reservada a CU220 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 143: sin ventas devuelve estado vacío explícito - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 148: fuente no disponible no fabrica categorías ni ceros - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 164: detalle de orden de compra tiene ruta protegida y carga directa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 170: acciones owner se entregan sólo con permiso del destino - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 176: panel no ofrece Estado de Resultados sin CU238 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 180: los destinos owner relevantes usados por M7 tienen una ruta React - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m8-cu259.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 63: M8 CU259 consulta solicitudes crediticias - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: 01 usuario autorizado consulta bandeja - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: 02 usuario no autorizado recibe rechazo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 03 conjunto vacío es válido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: 04 distingue INICIAL y EXCEPCION - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: ${String(indice + 5).padStart(2,  - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: 10 filtro por estado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 73: 11 filtro por tipo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: 12 filtro por Cliente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 75: 13 abre detalle autorizado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 76: 14 detalle fuera de alcance no se entrega - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 77: 15 contexto M1 válido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 78: 16 contexto M1 parcialmente no disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 79: 17 contexto M2 presente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 80: 18 contexto M2 ausente no rompe solicitud - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 81: 19 consultar no cambia estado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: 20 CU259 conserva permiso independiente tras ampliar M8 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m8-cu260-cu274.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 30: M8 CU260-CU274 núcleo crediticio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: 01 CU260 sólo Cliente B2B sin Crédito crea borrador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: 02 borrador inicial se envía y transiciones inválidas se bloquean - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: 03 CU263 rechazo no modifica venta M2 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: 04 CU263 aprobación habilita Crédito con cupo y vigencia definidos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: 05 nueva solicitud inicial se bloquea con Crédito habilitado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 06 CU261 exige operación y motivo libre - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: 07 CU264 aprueba excepción sin modificar cupo ni formalizar M2 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: 08 CU262 cancela sólo borrador o pendiente y conserva antecedentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 09 CU268 configura límite y no implementa F047 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 10 validación ordinaria autoriza dentro de cupo y límite - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: 11 compromiso nace una vez y explica cupo utilizado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: 12 exceso exige excepción y aprobada se revalida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: 13 CU265 reduce cupo y deja sobre-cupo sin tocar compromiso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 14 CU266/CU267 exigen motivo y pago no reactiva - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 15 pago reduce una vez, libera cupo y operación totalmente pagada no consume - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: 16 consultas CU269/CU270 separan dimensiones y costo F038 ausente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 17 CU271 reconstruye hechos sin historial paralelo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 18 CU273 distribución y concentración son derivadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 19 CU274 composición conserva operación y reducciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 20 CU272 exporta scope contextual y conjunto vacío - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 21 M8→M7 entrega productor real y ausencia sigue segura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 22 permisos CU260-CU274 son independientes y actores exactos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: 23 CU275 no existe y F047 no tiene umbral hardcodeado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m9-autorizacion-e2e.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 14: M9 CUT354-CUT362 integra permisos M4, scope, masking y agregado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: CU363-CU365 lista, detalle y exportan el mismo scope con eventos terminales únicos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: frontera HTTP M9 normaliza paginación string sin debilitar validación ni scope - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: exportación revalida M4 en cada solicitud y conserva masking - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 68: la vista única expone filtros, cadena, masking backend y exportación por permiso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m9-confiabilidad-observabilidad.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 9: M9 CUT333-CUT353 confiabilidad, observabilidad y soporte de pruebas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 10: CUT333-CUT336 crítico confirma sólo tras persistencia y falla sin PII - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: CUT337-CUT339 no crítico pendiente conserva ocurrencia y minimiza payload - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: CUT340-CUT341 detector abstracto usa umbral externo y emite señal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: CUT342-CUT347 mide recibidos, persistidos, rechazos, fallos y latencias - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: CUT345-CUT349 expone pending, retry, salud por productor y capacidad sin umbral inventado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: CUT350 fixtures son sintéticos y no contienen credenciales reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: CUT351 reloj inyectable controla persistencia y envejecimiento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: CUT352 diagnósticos son inspeccionables sin editar evidencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: CUT353 configuración variable se inyecta sin editar lógica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 67: el core previo conserva límites y CUT446 permanece fuera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m9-consulta-exportacion.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: M9 CUT303-CUT332 consulta, exportación y no recursividad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: CUT303-CUT306 filtra, busca, ordena y pagina sin salir del scope - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: CUT307 distingue ocurrencia y persistencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CUT308-CUT309 reconstruye cadenas y correctivos cronológicos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: CUT310-CUT311 policy oculta cambios, motivo y causa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: CUT312 distingue HUMANO/SISTEMA sin actor artificial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: CUT313-CUT314 privacidad y masking no reexponen información - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: CUT315-CUT316 consulta y detalle generan una sola evidencia terminal cada uno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: CUT317-CUT323 CSV/PDF congelan scope, no guardan dataset y registran terminal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: CUT320-CUT324 metadatos mínimos y rechazo no copia conjunto exportable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: CUT325-CUT332 contexto terminal corta ciclos y retry no crea cascadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m9-ingesta-integridad.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 17: M9 CUT275-CUT302 ingesta, validación e integridad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: CUT275-CUT281 valida contrato, núcleo, condicionales y resultado normalizado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: CUT279 conserva sólo campos realmente cambiados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: CUT282-CUT284 sanitiza, minimiza y rechaza secretos antes de evidencia o diagnóstico sensible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: CUT285 exige timestamp y timezone coherentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: CUT286/CUT298 retry conserva identidad y duplicado conflictivo se rechaza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: CUT287 detecta fuera de orden sin romper silenciosamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: CUT288-CUT293 no inventa metadatos, invalidez no persiste y exige capacidad técnica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: CUT294-CUT297 origen, derivado y correctivo son nuevos eventos vinculados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 72: CUT299 verifica hash al recuperar evidencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: regresión forense: un evento comprometido no oculta evidencia válida ni se exporta como verificada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 94: CUT290-CUT292 persiste durable, separa fechas y trigger impide mutación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 101: CUT300-CUT302 mantiene mínimo privilegio y diagnóstico separado sin payload - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m9-pdf-informe.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 22: M9 exporta un informe PDF profesional, completo y paginado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: conserva exactamente los 44 eventos congelados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: incluye encabezado, solicitante humano y resumen ejecutivo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: muestra módulos ordenados y operaciones humanizadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: pagina tabla sin cortar filas y repite cabecera y pie - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: informa filtros aplicados sin alterar el conjunto filtrado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: no presenta valores nulos ni payloads técnicos en el cuerpo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m9-politicas-privacidad.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 12: M9 CUT414-CUT433 motor parametrizable y privacidad de consulta/exportación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 13: sin policy no trata y ownership externo queda DEPENDENCIA_OWNER - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: policy versionada afecta sólo su vigencia y universo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: ANONYMIZE usa strategy explícita y correlación sólo autorizada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: PURGE excluye de consulta/export y no muta evidencia original - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: BLOCK impide tratamiento pero conserva almacenamiento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: tratamiento deja evidencia terminal y elimina vínculos indirectos reidentificables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: no existe operación de reconstrucción de identidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m9-post-contratos.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 9: M9 CUT434-CUT445 conserva evidencia owner sin decidir workflows POST-M9 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 11: derechos se reciben con acuse/fechas suministradas y M9 no calcula plazo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 12: resolución exige decisión y fundamento del owner, M9 no decide - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 13: propagación y bloqueo conservan sólo evidencia suministrada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: incidente debe venir clasificado y campos ausentes no se inventan - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: CUT433/CUT445 finalidad base y política sólo existen si owner las entrega - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: contratos rechazan secretos antes de conservar evidencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m9-productores-failclosed.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 11: contrato compartido es versionado, explícito y rechaza productores/versiones no soportados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: la fachada emite al menos una operación real M1-M8 sin observar lecturas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: identidad lógica es estable por request y reintento no duplica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: fail-closed crítico exige ACK durable; NACK y timeout no confirman owner - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/m9-retry-alertas-seguridad.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 17: M9 CUT402-CUT413 retry durable, alertas configurables y controles técnicos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: CUT402-CUT410 pendiente sobrevive reinstanciación, reintenta idempotente y diagnostica sin payload - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: CUT403-CUT405 intento fallido queda elegible según programación externa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: CUT411 dispara múltiples alertas sólo desde umbrales configurados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: CUT412 reporta TLS como control de entorno sin exponer URL o credencial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: CUT413 exportación en memoria no crea artefacto temporal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/mantenedores-documental-ui.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 20: Bloque 4.5A — interfaz documental comercial preparada y cerrada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: 01 pestaña documental presente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: 02 ProductosFamilias delega la presentación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: 03 creación no requiere ID documental - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: 04 creación explica asociación posterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: 05 consulta usa integración no habilitada real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 06 diferencia integración pendiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 07 diferencia vacío autorizado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 08 representa carga en progreso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: 09 representa error legítimo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: 10 representa acceso denegado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: 11 representa conjunto con documentos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: 12 fotografía principal tiene sección propia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: 13 no usa fotografía ficticia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: 14 conserva proporción sin recortar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: 15 usa carga diferida de miniaturas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: 16 galería ordena por presentación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: 17 galería contempla miniatura ausente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: 18 principal queda destacada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: 19 uso B2B visible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: 20 uso B2C visible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 21 uso compartido no duplica documento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 22 ficha técnica está tipada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: 23 catálogo está tipado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: 24 diagrama técnico está tipado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: 25 historial diferencia vigente e histórica - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 26 historial no ofrece borrado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 27 todos los estados documentales están modelados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: 28 cuarentena no obtiene miniatura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 29 documentos no disponibles bloquean acciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 30 vista ampliada reutiliza ModalFormulario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 31 vista ampliada no abre ventanas externas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 32 diseño usa modal centrado, no drawer - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 33 identidad corporativa está aplicada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: 34 composición es responsive - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 55: 35 semántica accesible identifica secciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: 36 no existe selector de archivos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 57: 37 no realiza PUT ni carga Base64 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: 38 no llama endpoints ni storage - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 59: 39 no conserva URLs en almacenamiento del navegador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 60: 40 no contiene credenciales ni claves de proveedor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: 41 no inventa códigos M4 ni modifica M9 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 62: 42 contrato futuro no fija rutas HTTP - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 43 otras pestañas comerciales permanecen disponibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/mantenedores-modal-ux.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 10: Bloque 3.1 — fichas flotantes y UX del mantenedor - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 11: el componente compartido es una ficha centrada y no un drawer lateral - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: ofrece tamaños pequeño, mediano y grande - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: es responsive y limita su altura al viewport - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: mantiene cuerpo desplazable y pie accesible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: declara semántica y título accesibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: administra Escape y encierra Tab dentro de la ficha - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: restaura el foco y bloquea el scroll de fondo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: el overlay permite cierre controlado sin propagar desde el contenido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: las confirmaciones secundarias reciben foco sobre el formulario - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: Productos y familias reutiliza el componente y elimina Panel lateral - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: familias distingue explícitamente crear editar e historial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 65: familias presenta estados vacíos y acción según permiso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: productos distingue catálogo vacío filtros y falta de familia activa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 76: carga y error no se presentan como listados vacíos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 81: el formulario conserva sus datos en estado al navegar por pestañas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: las secciones requeridas están disponibles sin carga de archivos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 91: los errores de identificación llevan a la pestaña correspondiente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: los botones reflejan crear editar y consultar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 98: la protección de cambios aplica a X Cancelar Escape y overlay - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 104: el guardado deshabilita doble envío y mantiene el formulario ante error - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 109: el éxito se informa después de recargar y cerrar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 115: vinculaciones y versiones mantienen confirmación y permisos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 121: no agrega contratos backend permisos ni rutas nuevas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/mantenedores-panel.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 8: Bloque 2 — panel central de Mantenedores - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: la ruta principal existe y reutiliza permisos vigentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: el menú lateral conduce al panel sin duplicar accesos del grupo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: el panel presenta las siete categorías definidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: las tarjetas disponibles apuntan sólo a rutas existentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: las funcionalidades futuras no tienen rutas ni acciones falsas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: las acciones disponibles se convierten en restringidas sin permiso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: CU268 puede abrir la pantalla que ya contiene el límite global - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: las rutas antiguas continúan registradas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: el panel es sólo navegación y no ejecuta lógica financiera - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: la grilla incorpora cortes responsive y evita overflow horizontal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/nucleo-documental-portable.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 33: Bloque 4.2 — núcleo documental portable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 01 permite transiciones autorizadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 58: 02 rechaza retrocesos y salida desde estados finales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: 03 valida hash y tamaño - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 69: 04 exige claves opacas y rechaza datos personales o rutas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 77: 05 crea documento lógico y outbox en una transacción - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 85: 06 aplica revisión optimista al documento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 95: 07 la misma intención repetida es idempotente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 103: 08 rechaza reutilización conflictiva de idempotencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 109: 08b la base exige documento en toda intención nueva - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 117: 09 persiste estados de intención y bloquea transición imposible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 124: 10 registra una versión con numeración correlativa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 130: 11 serializa versiones concurrentes sin duplicar correlativos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 139: 12 una versión disponible exige integridad completa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 145: 13 la base protege metadatos de contenido confirmado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 149: 14 evita objeto y número de versión duplicados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 153: 15 registra variante y evita autorreferencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 160: 16 asocia documento con producto mediante FKs reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 169: 17 restringe una sola imagen principal activa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 174: 18 rechaza referencias inexistentes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 178: 19 outbox es idempotente y no duplica M9 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 185: 20 finaliza intención, versión, documento y outbox atómicamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 195: 21 outbox recupera lease vencido y rechaza al worker anterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 207: 22 no expone endpoints, permisos, secretos ni URLs firmadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 8: C2.6 — permisos M4 comerciales y documentales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 9: registra CU368-CU376 una vez y verifica definiciones incompatibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 10: no asigna permisos a perfiles ni usuarios - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 11: CU377 no se registra ni se habilita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 12: cada escritura comercial exige su CU y el administrador no elude - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 13: documentos separan carga, galería, vista previa y descarga - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: operaciones HTTP usan CU específicos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/portabilidad-segura-r2-s3.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 38: Bloque 4.5B.2A.1 — storage condicional observable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: 01 crea un objeto inexistente y verifica HEAD posterior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 40: 02 rechaza un objeto preexistente sin modificarlo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: 03 dos escrituras simultáneas tienen un único ganador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: 04 reintento con mismo contenido no reescribe - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: 05 reintento con contenido diferente preserva el original - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 44: 06 R2 y S3 anuncian PUT exclusivo pero no multipart condicional - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: 07 una lectura condicionada rechaza origen modificado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: 08 doble lectura obtiene streams independientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: 09 stream fragmentado mediano conserva todos los bytes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: 10 stream grande simulado aplica backpressure sin Base64 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: 11 stream interrumpido falla cerrado y no conserva objeto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: 12 escritura incompleta no queda confirmada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: 13 cancelación por timeout es temporal y reintentable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: 14 caída posterior a persistir converge sin sobrescribir - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: 15 límite superior de PUT simple se bloquea antes del SDK - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: asociación comercial fallida deja recuperación idempotente preparada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/rf-vigente.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 15: la matriz conserva perfiles previos y asigna M8 por capacidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: RF vigente: perfiles M4, seed y política de acceso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: Contador autoriza CU51/CU52/CU54 y Secretaría queda rechazada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: sesión respeta inactividad y duración máxima configuradas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 77: tercer intento bloquea temporalmente durante diez minutos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 89: CU36/CU51/CU57: documentos, anulaciones y comprobante PDF - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 99: CU36 conserva antecedentes externos y relaciona más de una NV - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 109: CU51 rechaza pago con reversión previa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 111: CU51 conserva el pago, retira su efecto y recalcula la NV - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 113: CU57 produce un PDF con catálogo, página y referencias válidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 120: CU57 rechaza un comprobante sin identificación obligatoria - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 130: CU41 persiste cinco días hábiles cuando todavía no existe configuración - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 143: CU69 permite al administrador original cambiar su propia contraseña - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 160: fecha por defecto de Banco Central usa la fecha de negocio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 12: C2.5 — matriz M4 y preparación comercial fail-closed - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 13: reutiliza sólo CU cuyo alcance comercial existente coincide - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: C2.6 registra CU368-CU372 sin asignarlos al administrador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: administrador sin concesión explícita no habilita una escritura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: valida precio positivo, segmento, moneda y vigencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: cobertura disponible exige precio y una exclusión comunal lo prohíbe - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: revisión e idempotencia son obligatorias y acotadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: el repositorio recibe escrituras sólo con el CU explícito - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 45: auditoría comercial queda aprobada con actor e idempotencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: CU366 no se reinterpreta como asociación documental - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: incorpora CU373-CU376 y mantiene CU377 cerrado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/seguridad-integridad-documental.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 27: detecta ${nombre} por bytes, calcula SHA-256 y tamaño - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: rechaza HTML disfrazado de JPEG - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: registra discrepancia entre MIME declarado y detectado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: rechaza JPEG truncado y archivo comprimido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 54: rechaza estructuras incompletas aunque conserven firmas conocidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 63: rechaza políglota con estructura JPEG y contenido activo embebido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: propaga error de lectura sin convertirlo en aprobación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 76: rechaza tamaño esperado y hash distintos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 82: corta el stream al superar límite técnico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 87: rechaza PDF con acción activa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 93: antivirus no configurado falla cerrado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 99: configuración técnica no inventa políticas ni activa antivirus - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 105: configuración valida límites y allowlist MIME - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 111: fábrica antivirus requiere activación explícita y configuración documental completa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 120: política de activación falla cerrada si falta configuración empresarial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 124: política provisional aislada exige todos los límites y antivirus real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 133: sólo LIMPIO supera el guard antivirus - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 142: probe clamd exige PONG y falla cerrado ante respuesta inválida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 148: adaptador clamd transmite INSTREAM y reconoce archivo limpio - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 156: adaptador clamd normaliza infección sin exponer el contenido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 162: adaptador clamd normaliza respuesta inválida y conexión fallida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 169: adaptador clamd falla cerrado ante timeout sin exponer detalles internos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 179: autorización usa permiso de consulta existente y alcance backend - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 186: acción sin CU aprobada queda cerrada incluso para administrador - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 191: administrador sin CU explícito tampoco consulta documentos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 196: auditoría rechaza URLs, tokens y secretos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 225: carga limpia se promueve, verifica y queda DISPONIBLE - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 233: antivirus ${estado} envía a cuarentena - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 240: reintento usa versión determinista sin duplicarla - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 248: dos confirmaciones concurrentes no generan versiones duplicadas y el reintento converge - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 263: no sobrescribe una clave definitiva preexistente con otros bytes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 269: fallo de promoción no confirma versión ni intención final - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 275: coordinador exige autorización backend antes de leer el objeto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 281: mismo flujo portable para ${proveedor} - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 286: adaptador sin capacidades de lectura/copia falla antes de confirmar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 293: proveedor sin creación condicional de destino queda bloqueado antes de leer bytes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 301: intención de otro actor no puede confirmarse - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 306: intención no puede confirmarse contra otro documento - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 311: cambio del temporal durante la copia de trabajo se detecta por condición ETag - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 316: cambio de copia de trabajo después del antivirus impide promoción - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 322: error PostgreSQL después de copiar se recupera sin nueva carga - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 330: la copia temporal original no se modifica ni se usa tras congelar el trabajo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 336: descarga exige versión disponible, íntegra y limpia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 345: cuarentena no puede descargarse - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 350: descarga ajena es rechazada por autorización vinculada a entidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 356: descarga rechaza proveedor distinto al adaptador activo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 362: outbox no se ejecuta al importar y procesa explícitamente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 371: outbox aplica límite de intentos y descarta con transiciones válidas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 378: reconciliación sólo informa faltantes, divergencias, expiraciones y atascos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Controladores/pruebas/ui-selectores-incidencias.test.cjs`
**Framework:** node:test.
### Escenarios
- Linea 9: UI selectores de incidencias y liquidez conservan FK y permisos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: 01 catálogo carga clientes reconocibles - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: 02 filtro de cliente limita órdenes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: 03 selector conserva FK de ejecución real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: 04 cliente sin coincidencias entrega lista vacía - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 28: 05 registra combinación cliente OT válida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 29: 06 rechaza OT de otro cliente - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: 07 rechaza contexto incompleto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: 08 conserva compatibilidad de incidencia sin OT explícita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: 09 catálogo de ajuste usa naturalezas reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 33: 10 catálogo de moneda sólo expone activas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: 11 catálogo de ajuste conserva CU228 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: 12 CU212 protege catálogo y registro de incidencias - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/components/comercial/ProductoComercial.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 25: Componentes comerciales reutilizables C2 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 26: la tarjeta usa identidad estable y no inventa precio ni fotografía - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: la ficha se abre en modal centrado y mantiene bloqueadas vista previa y descarga - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: B2B y B2C conservan sus acentos y descripciones segmentadas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 56: el comparador presenta alternativas sin sumarlas ni convertirlas en producto contratado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/components/documental/DocumentosHistoricosCotizacion.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 14: consulta histórica de PDF de cotización - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: no consulta ni muestra acciones sin CU376 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: recupera el PDF original en modal centrado y permite descargarlo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: informa documento pendiente sin ofrecer una acción operativa - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/components/documental/PanelDocumentosProducto.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 21: PanelDocumentosProducto — interacción real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: presenta creación, integración pendiente, carga, error y acceso denegado sin datos ficticios - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: distingue un resultado vacío confirmado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 42: muestra principal, orden de galería y usos B2B/B2C - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 52: presenta documentos comerciales y el historial autorizado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: abre modal centrado, navega fotografías y lo cierra - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 74: no habilita descarga, carga ni acciones sin capacidades - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 84: un documento en cuarentena no expone vista previa ni descarga - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 92: distingue permisos pendientes, política, storage y antivirus no configurados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 99: una carga pendiente se informa sin presentarla como disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 106: los fixtures no contienen secretos, credenciales ni conexiones reales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/components/documental/PanelDocumentosProductoConectado.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 11: Panel documental conectado C2 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: consulta metadatos reales del producto y representa un resultado vacío - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: muestra acceso denegado sin revelar metadatos cuando M4 rechaza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/components/SelectorCatalogo.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 8: SelectorCatalogo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 9: muestra etiquetas comprensibles y conserva el ID interno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 10: permanece deshabilitado antes de la selección padre - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 11: informa carga sin habilitar interacción - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 12: muestra el estado vacío - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 13: muestra errores asociados al control - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: permite búsqueda por teclado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: expone obligatoriedad nativa cuando corresponde - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/ArmarCotizacion/ArmarCotizacion.catalogo.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 24: Armar Cotización conectado al catálogo comercial C2 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: exige segmento antes del cliente, selecciona por ID estable y abre la ficha segura - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 70: muestra contactos propios y servicios B2B sin confundirlos con instalación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 84: crea un único borrador nuevo y abre su vista previa PDF sin emitir, NV ni OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 98: actualiza el mismo borrador antes de cada vista previa y no crea duplicados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 113: distingue la dirección libre de la Obra estable y exige selección explícita - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Auditoria/Auditoria.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 17: Auditoría M9 con evidencia comprometida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: mantiene visibles los eventos válidos y marca el comprometido también en detalle - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/correccionesObservaciones.test.ts`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 5: correcciones de observaciones operacionales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 6: distingue la respuesta completa de Caja Chica de la respuesta de un gasto - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 11: rechaza respuestas incompletas para evitar reemplazar el estado renderizable - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: mantiene valores independientes al editar configuraciones de haberes distintos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/DashboardM7/componentes.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 16: usarConsultaM7 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: mantiene el dato confirmado mientras actualiza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: la última selección prevalece ante respuestas fuera de orden - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: conserva el último dato y expone el error sin presentarlo como respuesta nueva - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: cambiar período no fuerza el scroll de la ventana - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/DashboardM7/graficos-tooltip.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 45: tooltips visibles de los gráficos compartidos M7 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 46: visualiza el tooltip de líneas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: visualiza el tooltip de áreas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: visualiza el tooltip de barras - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 49: visualiza el tooltip combinado personalizado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 50: visualiza el tooltip circular - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 51: recalcula la posición ante scroll horizontal y vertical - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/DashboardM7/tooltipFlotante.test.ts`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 6: calcularPosicionTooltip - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 7: ubica la caja a la derecha y abajo en el centro - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 11: invierte horizontalmente cerca del borde derecho - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: invierte verticalmente cerca del borde inferior - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: respeta los límites superior e izquierdo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: respeta simultáneamente las cuatro esquinas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 34: se adapta a una pantalla móvil - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 39: usa la posición visible resultante de scroll horizontal y vertical - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 23: Ficha operativa integral de OT - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: organiza el resumen y no cuenta validación como cierre - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 36: abre visita y distingue datos de incidencia sin atribuir responsabilidad - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/GestionOrdenesTrabajo/GestionOrdenesTrabajo.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 9: Bandeja de Órdenes de Trabajo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 12: distingue acceso denegado de una bandeja realmente vacía - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 13: Gestión integral de incidencias T4 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: muestra bandeja paginada, indicadores y filtros separados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: consolida postventa, OT, visita, evidencias y limita acciones sin persistencia - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 12: Mantenedores comerciales C1 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: consulta precios por segmento y explica el control M4 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: navega a tarifas comerciales y mantiene clara su naturaleza - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 32: muestra un error real cuando la estructura comercial aún no está disponible - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 38: muestra Crear sólo con el CU de la sección y abre un modal centrado - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: habilita versionado de precios únicamente con CU368 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 61: gestiona servicios comerciales y su historial de precios con CU368 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 71: separa edición CU371 de publicación CU372 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 83: expone compatibilidad y precio sólo con CU369 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 12: mantenedor documental comercial C4 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 24: consulta plantillas y no muestra acciones sin CU específico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 31: abre la vista previa real de la carta en un modal centrado sin publicarla - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/PortalPrincipal/PortalPrincipal.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 16: Portal principal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: es público y ofrece el inicio de sesión - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: muestra Finanzas sólo a quien dispone de permisos financieros - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: muestra Terreno sólo a quien dispone de permisos operacionales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: mantiene Inventario visible pero sin navegación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Seguridad/Acceso.test.ts`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 4: destino posterior al ingreso - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 5: conserva rutas internas completas - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Seguridad/permisosM4.test.ts`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 13: selección semántica de permisos M4 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 14: busca por acción, descripción y área sin depender de tildes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 15: selección individual activa automáticamente sus dependencias - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 16: impide quitar un permiso requerido por otra acción seleccionada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 17: selecciona todos los permisos de un área conservando dependencias - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: quita un área y elimina dependientes que quedarían inválidos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 19: seleccionar todos global incorpora todas las acciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 20: quitar todos global produce una selección vacía preparada para validación backend - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 21: resume un guardado único sin registrar cada checkbox - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 22: cancelar se resuelve restaurando exactamente la selección inicial - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: mantiene visible la marca de permisos administrativos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Seguridad/Usuarios.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 21: Administrador funcional de permisos M4 - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 27: reemplaza los chips CU por áreas, acciones humanas, contadores y búsqueda - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: diferencia perfil y personalización, activa dependencias y permite cancelar - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 43: selecciona por área y global sin habilitar capacidades administrativas a un usuario normal - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 48: resume y confirma un único guardado atómico - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 53: protege Midas y muestra todos los permisos aprobados sin permitir retirarlos - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Terreno/AgendaTerreno.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 15: Agenda operacional de Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: calcula períodos, combina filtros y conserva visitas sin fecha en pendientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 25: resume indicadores reales sin contar cerradas como pendientes - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: distingue instalaciones sin registros de métricas con cero real - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 35: muestra agenda, filtros, pendientes y abre detalle real con OT autorizada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Terreno/dashboardTerreno.test.ts`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 4: filtros del dashboard de Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 5: combina sólo los filtros informados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 6: preserva fechas ISO para consulta y exportación - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Terreno/InicioTerreno.test.ts`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 4: resumen real de órdenes de Terreno - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 5: clasifica los estados existentes sin duplicarlos ni inventar totales - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 10: devuelve ceros con una consulta válida sin resultados - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 15: Seguimiento de instalaciones - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 18: distingue cero registros y estados operacionales confiables - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 23: filtra, abre preparación y mantiene entrega separada - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 37: registra el resultado en una tarea explícita sin marcar entrega - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
## `Vistas/src/views/verificacionAccionesFinal.test.tsx`
**Framework:** Vitest/Testing Library.
### Escenarios
- Linea 23: acciones finales reportadas por usuarios - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 30: Ver OCS navega, consulta el registro y muestra su detalle sin mutarlo - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 41: Ver OCS presenta el error entregado por una consulta inválida - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 47: Editar honorario carga la boleta pendiente y guarda por PATCH - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.
- Linea 66: Gestor de visitas muestra detalle, preparación y registra resultado permitido - demuestra el comportamiento nombrado; si falla, revisar el flujo y sus fixtures antes de modificar produccion.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
