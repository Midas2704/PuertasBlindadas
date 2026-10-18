# C2 — Catálogo comercial y documentos en Cotizaciones

## Implementado operativo

- Consulta backend de productos publicados por segmento B2B/B2C y moneda.
- Identificación estable mediante `id_extension_producto_comercial`, `id_item_comercial`, familia y número de versión publicada.
- Exclusión de productos inactivos, familias inactivas y productos sin equivalencia operativa vigente.
- Descripción, características, garantía y condiciones obtenidas desde la versión comercial publicada.
- Precio y opcionales vigentes como información comercial; no reemplazan el cálculo histórico de M2.
- Consulta de metadatos documentales comerciales asociados al producto, filtrados por uso B2B/B2C.
- Ficha comercial reutilizable en modal centrado, tarjeta y comparador exclusivamente informativo.
- Integración de metadatos documentales en Productos y familias.
- Conservación de borradores históricos por su `id_item_comercial`; no se intenta asociarlos por nombre.

## Seguridad y permisos

| Capacidad | CU reutilizado | Estado |
| --- | --- | --- |
| Consultar catálogo/ficha comercial | CU360 | Operativo |
| Consultar metadatos documentales comerciales | CU360 | Operativo |
| Consultar versiones e historial documental | CU367 | Operativo |
| Asociar documentos a productos | CU374 propuesto | Bloqueado; CU366 sólo cubre vínculos con Terreno/Inventario |
| Solicitar vista previa | Ninguno aprobado | Bloqueado, fail-closed |
| Descargar archivo | Ninguno aprobado | Bloqueado, fail-closed |
| Cargar, reemplazar, ordenar o definir uso/principal | Ninguno aprobado | Bloqueado, fail-closed |

La consulta no entrega claves de objeto, proveedor, contenedor, hash, secretos, tokens ni URLs firmadas. La UI muestra un marcador neutral cuando existe una fotografía registrada pero su contenido no puede recuperarse de forma autorizada.

## Pendiente

- Activación empresarial de permisos M4 específicos para vista previa, descarga y escritura documental.
- Storage operativo autorizado para generar URLs temporales o streams de lectura.
- Selector integral B2B/B2C, persistencia de selección comercial y snapshots: bloques posteriores.
- Comparación persistente de alternativas B2C: Bloque C4.
- Generación documental/PDF: Bloque C5.

## Compatibilidad

C2 no cambia fórmulas, descuentos, IVA, costos ni el detalle persistido por M2. Tampoco aplica migraciones ni modifica flujos de Nota de Venta, Órdenes de Trabajo, Terreno o Inventario. Las migraciones 065–067 continúan preparadas, pero no se aplican a la base habitual en este bloque.
