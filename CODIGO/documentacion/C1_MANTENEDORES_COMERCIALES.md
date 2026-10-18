# C1 — Mantenedores comerciales y tarifas

## Implementado

- Consulta de precios de lista versionados por producto, familia, segmento y moneda.
- Consulta de opcionales, compatibilidades por ID de producto y precios vigentes.
- Consulta de tarifas comerciales de instalación y resolución backend región/comuna.
- Consulta de condiciones comerciales y sus versiones.
- Resumen reutilizable de producto para futuras cotizaciones, sin costos internos.
- Interfaz responsive con búsqueda, filtros, estados, detalle modal e historial disponible.
- Acceso desde la ficha de producto mediante su ID estable.

La resolución geográfica aplica esta precedencia: comuna exacta (incluida exclusión o evaluación), tarifa regional y, finalmente, `SIN_COBERTURA`. Una configuración `DISPONIBLE` sin precio y moneda no se transforma en precio cero.

## Seguridad M4

| Capacidad | Estado C1 | Permiso |
| --- | --- | --- |
| Consultar catálogos comerciales | Habilitada | CU360, alcance de consulta de catálogo comercial |
| Crear/versionar/desactivar precios | Fail-closed | Permiso nuevo pendiente de autorización |
| Mantener opcionales y compatibilidades | Fail-closed | Permiso nuevo pendiente de autorización |
| Mantener tarifas/cobertura | Fail-closed | Permiso nuevo pendiente de autorización |
| Versionar condiciones | Fail-closed | Permiso nuevo pendiente de autorización |

No se añadieron códigos CU, asignaciones de roles ni rutas HTTP de escritura. El servicio rechaza explícitamente la escritura no autorizada. La interfaz no presenta botones que aparenten realizar estas operaciones.

## Auditoría M9 preparada

Cuando se autoricen las escrituras, cada transacción deberá producir por el flujo M9 existente y sin un registro paralelo: precio creado/versionado/desactivado, opcional o compatibilidad modificada, tarifa creada/versionada, cobertura modificada y condición versionada. Debe conservar actor, motivo, entidad, versión anterior/nueva y resultado. C1 no declara esos eventos como emitidos porque las operaciones siguen cerradas.

## Separación costo/precio

`tarifa_instalacion_comercial` es precio de venta M2. Los parámetros `M7_COSTO_INSTALACION_*` siguen siendo costo interno M7 y no fueron modificados ni expuestos por los contratos comerciales.

## Bloqueos estructurales

- Agregar región al costo interno M7 requiere una migración aditiva posterior: campo nullable y normalizado en una estructura propia o evolución controlada del parámetro. No se debe inferir región para registros históricos.
- El modelo 065 no posee categoría explícita del opcional. Si la empresa necesita filtrar por Cerradura/Marco/Revestimiento/Terminación/Servicio, se propone una columna o catálogo tipificado aditivo; C1 no inventa categorías.
- Las escrituras y eventos M9 requieren aprobación de la matriz M4 antes de exponerse.

## Compatibilidad

No se modificaron cálculos ni fórmulas de cotización, notas de venta, OT, Terreno T1–T5, Inventario, RRFF ni costos M7. Las rutas añadidas son de lectura y dependen de que 065–067 se apliquen posteriormente en el entorno autorizado.
