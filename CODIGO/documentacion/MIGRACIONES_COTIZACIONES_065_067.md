# Diseño de migraciones 065–067: cotizaciones B2B/B2C

## Estado y alcance

Los archivos están **preparados, no aplicados**. No se ejecutó `migrate dev`, `migrate deploy`, `db push`, SQL, seeds ni conexión a una base. El diseño es aditivo, conserva las cotizaciones históricas y no modifica los esquemas propietarios de RRFF, Inventario o Terreno.

## Orden obligatorio

1. `065_catalogos_comerciales_cotizacion`: catálogos comerciales, segmento, precios, opcionales, instalación, condiciones y snapshots por ítem.
2. `066_versionado_documental_cotizacion`: plantillas, carta B2C, publicación inmutable y documentos emitidos sobre el núcleo documental existente.
3. `067_alternativas_b2c`: comparación B2C separada de los detalles contratados y trazabilidad de la decisión.

No debe aplicarse 066 sin 065 ni 067 sin ambas anteriores.

## 065 — catálogos comerciales

### Cotización y detalle

`cotizacion` incorpora campos anulables para segmento explícito, proyecto/obra, referencia, ubicación, cobertura e instalación, condición aplicada, responsable comercial y revisión optimista. `detalle_cotizacion` incorpora referencias anulables a producto y versión, precio comercial, snapshots de producto/configuración/precio, elegibilidad de descuento, excepción autorizada y revisión.

La nulabilidad mantiene compatibles los registros heredados. Sólo se completa el segmento de una cotización antigua cuando el tipo del cliente es exactamente `B2B` o `B2C`; los demás casos permanecen nulos y se exponen en `cotizacion_segmento_pendiente_revision`. No se crean precios ni tarifas históricas por inferencia.

### Precios y opcionales

- `precio_producto_comercial`: precio de lista versionado por producto, segmento, moneda y vigencia.
- `opcional_comercial`: catálogo maestro de opcionales.
- `compatibilidad_opcional_producto`: compatibilidad y habilitación diferenciada B2B/B2C.
- `precio_opcional_comercial`: precio versionado del opcional por segmento y moneda.

Los precios comerciales son independientes de costos internos. Las exclusiones temporales impiden dos vigencias activas superpuestas para una misma combinación comercial.

### Instalación

`tarifa_instalacion_comercial` conserva exclusivamente precio de venta M2 y no reemplaza el costo interno M7. Admite alcance `COMUNA` o `REGION`, disponibilidad `DISPONIBLE`, `NO_DISPONIBLE` o `REQUIERE_EVALUACION`, moneda, precio anulable, vigencia y condiciones.

La precedencia operativa será: tarifa comunal exacta vigente; luego tarifa regional vigente; si no existe, “requiere cotización”. Una tarifa `NO_DISPONIBLE` bloquea el nivel consultado. La ausencia de tarifa no equivale a precio cero. Las restricciones evitan superposición temporal ambigua.

### Condiciones

`condicion_comercial` identifica el conjunto lógico y `condicion_comercial_version` guarda versiones por segmento, vigencia y estado. Las versiones publicadas o archivadas se protegen contra modificación o eliminación.

## 066 — versionado documental

- `plantilla_documental_comercial` y `plantilla_documental_version`: plantillas tipadas, sanitizables y versionadas.
- `carta_comercial_b2c` y `carta_comercial_b2c_version`: borrador/publicación general sin cliente, cotización, nota de venta ni OT.
- `carta_comercial_b2c_version_producto`: snapshot de producto, versión y precio B2C publicado.
- `carta_comercial_b2c_version_fotografia`: sólo fotografías comerciales activas, B2C autorizadas y con versión documental disponible.
- Ampliación de `cotizacion_version`: correlativo comercial independiente, tipo `EMISION`/`RECTIFICACION`, snapshot, documento lógico, estado documental, actor, motivo e idempotencia.

Se reutilizan `documento_logico`, `version_documento` y `producto_comercial_documento`; no se crea almacenamiento paralelo. Una publicación o emisión no queda `DISPONIBLE` hasta que el documento lógico tenga una versión disponible. Las versiones publicadas, sus productos y sus fotografías son inmutables. La cotización comercial nueva no puede pasar a emitida sin documento confirmado.

La futura implementación funcional deberá realizar en una transacción de base la reserva de versión, el snapshot y el estado pendiente; la carga al storage ocurre fuera de esa transacción. La confirmación idempotente cambia el estado a disponible sólo después de verificar el objeto. Un fallo conserva el estado pendiente/error para reintento y reconciliación; nunca simula disponibilidad.

## 067 — alternativas B2C

- `grupo_alternativas_b2c`: grupo de comparación ligado exclusivamente a una cotización con segmento B2C explícito.
- `alternativa_b2c`: producto, versión, configuración, precio, moneda, instalación y snapshots.
- `alternativa_b2c_opcional`: opcionales compatibles con precio B2C trazable.
- `historial_decision_alternativa_b2c`: registro inmutable de decisiones.

Las alternativas no forman parte de `detalle_cotizacion` ni del total contratado. Sólo una alternativa con estado `ACEPTADA` puede vincularse posteriormente a un detalle contratado coherente de la misma cotización. El vínculo es único para evitar duplicar una unidad física y, por diseño, las alternativas no aceptadas no alimentan Nota de Venta u OT.

## Integridad, eliminación y concurrencia

- Claves foráneas históricas usan `RESTRICT` o relaciones anulables; no se agregan cascadas sobre cotizaciones emitidas.
- Correlativos, claves de idempotencia, precios/vigencias y asociaciones críticas tienen unicidades e índices.
- Cotización, detalle y catálogos editables incorporan `revision` para control optimista.
- Snapshots emitidos/publicados e historiales se vuelven inmutables.
- No se conceden permisos ni se alteran roles. Las capacidades futuras deberán autorizarse en M4 antes de exponer mantenedores o descargas.

## Permisos futuros pendientes de autorización

Se requerirá resolver o reutilizar capacidades para mantener productos, opcionales, precios, tarifas, condiciones y plantillas; publicar carta B2C; crear/editar/emitir cotizaciones; consultar/descargar documentos; aprobar excepciones y rectificar. Estas migraciones no conceden ninguna de ellas.

## Estrategia de aplicación posterior

Antes de producción: respaldar, aplicar en una base aislada representativa, revisar el listado de segmentos ambiguos, validar constraints con datos heredados, probar rollback operativo por restauración y ejecutar pruebas funcionales. La extensión `btree_gist` debe estar disponible. No se deben inventar defaults para precios, monedas, cobertura, condiciones ni segmento.

## Riesgos pendientes

- Disponibilidad y autorización de `btree_gist` en el PostgreSQL de destino.
- Datos heredados con tipo de cliente ambiguo que requieren revisión humana.
- Definición empresarial de precios, tarifas, condiciones y permisos.
- Implementación posterior de orquestación idempotente entre base de datos y storage.
- Validación real de SQL y rendimiento sólo cuando exista autorización para una base aislada.
