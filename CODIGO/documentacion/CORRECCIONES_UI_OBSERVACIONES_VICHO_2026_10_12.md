# Correcciones UI — observaciones de Vicho (12-10-2026)

## Alcance y observaciones originales

Este bloque atiende: caja flotante de gráficos; año de instalaciones atrasadas; selección cliente/OT en incidencias; estabilidad del resumen gerencial; Naturaleza e ID Moneda; y revisión de umbrales de liquidez, costos de instalación y stock inmóvil. No cambia cálculos financieros, estados operacionales, datos históricos ni estructuras Prisma.

## Resultado por observación

### 1. Caja flotante del gráfico — RESUELTA CON OBSERVACIONES

- Pantallas: gráficos compartidos del Dashboard M7 (`graficos.tsx`).
- Diagnóstico: la observación no identificaba un gráfico concreto y no fue posible reproducir visualmente el caso exacto. El candidato verificable era el tooltip HTML de Recharts dentro de contenedores con `overflow-x-auto`, que podía quedar recortado o limitado al `viewBox` del gráfico.
- Solución: todos los tooltips compartidos se renderizan mediante portal en `document.body`, permiten escapar del `viewBox`, tienen un `z-index` uniforme y no interceptan el puntero. Los contenidos mantienen anchos máximos adaptados a la ventana.
- Pendiente: confirmar con Vicho cuál era el gráfico original si vuelve a observarse una anomalía específica.

### 2. Centro de Atención / instalaciones atrasadas — RESUELTA

- Pantallas: Centro de Atención Gerencial y Operación y Costos → Atrasos de instalaciones.
- Endpoint: `GET /api/finanzas/dashboard-m7/operacion/instalaciones/atrasos` mediante `C_Finanzas` y `M7Controller`.
- Causa raíz: la consulta resolvía el período, pero cargaba tareas de todos los años y nunca aplicaba el año seleccionado.
- Solución: el año se aplica sobre `tarea_horario_limite`, campo que ya determina el atraso. Se usan límites UTC `[01-01, 01-01 del año siguiente)`. Las tareas sin fecha siguen separadas como información temporal insuficiente y nunca se convierten en atraso o en plazo.
- No se modificó la definición de atraso ni estados de Terreno.

### 3. Incidencias: cliente y OT — RESUELTA CON OBSERVACIONES

- Pantalla: Incidencias operacionales.
- Selector cliente: búsqueda con máximo de 50 resultados, mostrando nombre/razón social y RUT desde el catálogo autorizado de Terreno.
- Selector OT: permanece deshabilitado con “Primero selecciona un cliente”; al seleccionar cliente consulta sólo sus OT con ejecuciones disponibles. La etiqueta muestra `OT-{id}` y el título real de la tarea/proyecto cuando existe.
- Cambio de cliente: limpia OT y ejecución. Un contador de solicitud ignora respuestas tardías.
- Integridad: la FK histórica continúa siendo `incidencia_retrabajo_tarea.id_ejecucion_tarea`. El selector conserva internamente la ejecución real y además envía cliente y OT para validación cruzada.
- Backend: valida que ejecución → tarea → OT → proyecto pertenezca al cliente informado. Una combinación ajena devuelve conflicto.
- Compatibilidad: el contrato legado sin cliente/OT explícitos sigue disponible porque el esquema permite incidencias asociadas sólo a una ejecución. No se creó una restricción empresarial nueva.
- Seguridad: las rutas siguen bajo CU212/CU213, autenticación y `C_Finanzas`; no se agregaron permisos.

### 4. Resumen gerencial — RESUELTA

- Pantalla: Resúmenes Financieros Gerenciales.
- Causa raíz: durante cada cambio de período el render condicional sustituía todas las tarjetas por un bloque de carga, reduciendo bruscamente la altura y provocando el salto visual.
- Solución: se conserva montado el último resultado confirmado mientras carga el nuevo. El estado de carga es discreto y `aria-live`; una falla mantiene la estructura, muestra el error y advierte que los datos visibles pertenecen al último período confirmado.
- Concurrencia: `AbortController` ya existía; se reforzó la comprobación antes de guardar la respuesta para que una petición abortada nunca sobrescriba la última selección.
- No se usa `window.scrollTo` y el filtro seleccionado se conserva.

### 5. Naturaleza — RESUELTA

- El backend admite únicamente `entrada` y `salida` para el ajuste manual de liquidez.
- El texto libre fue reemplazado por un selector con esas dos opciones reales. No se agregaron naturalezas ni se modificaron movimientos históricos.

### 6. Moneda — RESUELTA

- El ingreso manual “ID moneda” fue reemplazado por un selector que muestra nombre y código de monedas activas y envía el `id_moneda` real.
- Se agregó una consulta mínima `GET /dashboard-m7/liquidez/ajustes/catalogos`, protegida por CU228 y coordinada por `C_Finanzas`.
- No se modificaron conversiones, tipos de cambio, montos ni redondeos.

### 7. Parámetros financieros — REVISADA

- Umbrales de liquidez: etiqueta, monto y vigencia; no contienen FK seleccionables.
- Costos de instalación: ciudad, comuna, valor y vigencia; no contienen FK seleccionables.
- Stock inmóvil: días y vigencia; no contienen FK seleccionables.
- Ningún monto, día o porcentaje fue convertido artificialmente en desplegable.

## Componentes

- Reutilizados: controles nativos accesibles, `Periodo`, `ContenidoIndicadores`, `EstadoDato` y la capa `solicitarFinanzas`.
- Nuevo: `SelectorCatalogo`, selector reutilizable con carga, error, vacío, búsqueda, ayuda, deshabilitado, obligatoriedad y foco/teclado nativos.
- `ModalFormulario` permanece como estándar para modales centrados. Este bloque no agregó drawers ni necesitó crear un nuevo modal.

## Archivos y capas involucradas

- Frontend: IncidenciasTerreno, DeltaControladoM7, ResumenesM7, componentes compartidos M7, gráficos y SelectorCatalogo.
- Backend: M6Controller, M7Controller, C_Finanzas, rutas y matriz de permisos.
- Prisma: esquema inspeccionado; sin cambios.
- Migraciones: ninguna.

Archivos modificados o creados:

- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Controladores/pruebas/m7-cu252.test.cjs`
- `Controladores/pruebas/ui-selectores-incidencias.test.cjs`
- `Vistas/src/components/SelectorCatalogo.tsx`
- `Vistas/src/components/SelectorCatalogo.test.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardM7/ResumenesM7.tsx`
- `Vistas/src/views/DashboardM7/componentes.tsx`
- `Vistas/src/views/DashboardM7/componentes.test.tsx`
- `Vistas/src/views/DashboardM7/graficos.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx`
- `documentacion/CORRECCIONES_UI_OBSERVACIONES_VICHO_2026_10_12.md`

## Pruebas y validaciones

- Filtro anual: año actual/anterior, límites UTC, ausencia de mezcla y conservación del criterio de atraso.
- Incidencias: búsqueda de clientes, OT dependientes, FK de ejecución, combinación válida, rechazo de OT ajena, contexto incompleto y compatibilidad histórica.
- Selectores: etiqueta comprensible, valor interno, deshabilitado, carga, vacío, error, búsqueda, teclado y obligatoriedad.
- Resumen: preservación de datos durante carga, última solicitud prevalece, error estable y ausencia de scroll forzado.
- Liquidez: naturalezas reales, monedas activas y CU228.

Resultados locales finales:

- Pruebas focales backend: 68/68.
- Pruebas React DOM focales: 11/11.
- Suite backend completa: 1492/1492.
- Suite frontend completa: 19/19.
- Build backend: correcto.
- Build frontend: correcto, con advertencia no bloqueante por tamaño de chunk.
- Prisma validate: correcto.
- Lint focal de archivos nuevos y modificados sin deuda heredada: correcto.
- Lint global frontend: mantiene exactamente la línea base heredada de 105 errores y 11 advertencias; no se agregó deuda global neta.
- `git diff --check`: correcto.

## Riesgos y puntos por confirmar

- **POR CONFIRMAR CON VICHO:** gráfico exacto al que se refería “caja flotante gráfico”. Se corrigió el mecanismo compartido verificable, pero no se atribuye una reproducción visual que no fue posible realizar.
- Una OT puede contener varias tareas/ejecuciones. Para preservar la FK vigente, el selector presenta cada ejecución disponible bajo su OT y título real; no elige una ejecución arbitrariamente.
- La búsqueda de clientes limita cada respuesta a 50 registros para evitar descargar catálogos masivos.

## Estado del despliegue

No se efectuó despliegue ni conexión a Clouding, RRFF, R2, AWS, bases remotas o infraestructura externa. El despliegue continúa pendiente de autorización expresa.
