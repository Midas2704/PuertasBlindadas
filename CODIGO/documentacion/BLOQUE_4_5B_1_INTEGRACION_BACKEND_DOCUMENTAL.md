# Bloque 4.5B.1 — integración backend documental comercial

## Estado y arquitectura

**Implementado y probado:** un servicio interno de consulta une `extension_producto_comercial`, `producto_comercial_documento`, `documento_logico`, `version_documento` y `variante_documento`. Reutiliza `RepositorioDocumentalPrisma`, `AutorizadorDocumental` y el núcleo documental. No registra rutas HTTP ni accede al almacenamiento.

**Preparado:** contratos de aplicación, matriz M4, capacidades frontend y puente tipado M9. **Bloqueado para activación:** carga, descarga, vista previa, reemplazo y mutaciones documentales hasta aprobar CU, catálogo M9 e infraestructura.

## Servicios y consultas Prisma

- `ServicioDocumentosProducto` lista documentación, separa fotografías/documentos técnicos, identifica una principal sólo si está disponible, consulta versiones autorizadas y calcula capacidades desde el backend.
- `RepositorioDocumentalPrisma.consultarDocumentosProducto` realiza una consulta acotada a 200 asociaciones y 50 versiones por documento, ordenada y con `select` explícito. No selecciona proveedor, contenedor, clave de objeto, SHA-256 ni resultados técnicos completos.
- Las asociaciones inactivas y documentos lógicos inactivos quedan fuera. El historial tiene límite máximo de 50 versiones.
- El acceso a una versión se resuelve siempre a través de la asociación con el producto, evitando autorización por ID aislado.

## DTO y tipos documentales

Los BigInt se serializan como texto y las fechas como ISO UTC. El tamaño también se entrega como texto para evitar pérdida de precisión. La conversión de límite es explícita:

`OTRO_AUTORIZADO` (persistencia) → `OTRO_DOCUMENTO_AUTORIZADO` (frontend).

Las demás categorías conservan su nombre: fotografía comercial, diagrama técnico, ficha técnica y catálogo. El DTO no contiene URLs permanentes, credenciales, claves de objeto, proveedor, bucket ni hash.

## Fotografía, galería y documentos técnicos

La fotografía principal requiere asociación activa, tipo `FOTOGRAFIA_COMERCIAL` y versión `DISPONIBLE`. Cuarentena y estados no disponibles nunca se usan como principal. La galería conserva orden, B2B/B2C, estado y disponibilidad de variante; no descarga originales. Fichas, catálogos, diagramas y otros documentos se separan de las fotografías.

## Versiones e historial

La versión vigente se deriva de `numero_version_actual`; las anteriores se conservan. El responsable sólo se presenta cuando CU367 y el alcance permiten consultar versiones. Esto no mezcla el historial documental con `historial_producto_comercial`.

## Autorización M4 y capacidades

La matriz no modifica el catálogo ni perfiles:

| Operación | CU existente | Estado |
|---|---:|---|
| Consultar metadatos comerciales | CU360 | Aprobado dentro del alcance comercial |
| Consultar versiones comerciales | CU367 | Aprobado dentro del alcance comercial |
| Asociar producto | CU366 | Existente; no se expone en este bloque |
| Carga, confirmación, descarga, reemplazo, principal, orden, uso B2B/B2C, archivo, cuarentena y conservación | Ninguno aprobado | Pendiente de aprobación |

El actor procede del contexto backend. CU360/CU366/CU367 no autorizan documentos laborales, tributarios ni de otros módulos. Ser administrador no abre operaciones sin CU documental aprobado. Las capacidades de vista previa, descarga, carga, reemplazo, imagen principal, orden y uso comercial permanecen en `false`.

## Contratos API

`PuertoDocumentosComercialesInterno` documenta listado, versiones, capacidades y solicitudes futuras de vista previa/descarga. Las rutas propuestas están sólo como inventario no registrado. No existen endpoints operativos ni respuestas de éxito simuladas.

## Integración M9 y eventos

M2 es el propietario propuesto para acciones comerciales. `PuenteM9DocumentosProducto` está cerrado por defecto y sólo acepta tipos incorporados explícitamente a un conjunto aprobado. No modifica `CATALOGO_PRODUCTORES_M9`, no inicia workers y no duplica auditoría.

Eventos propuestos para evaluación: consulta, inicio/confirmación/rechazo de carga, cuarentena, disponibilidad, descarga, reemplazo, asociación, cambio de principal, cambio de uso comercial e integridad fallida. Cada evento debe llevar actor, producto, documento/versión cuando corresponda, resultado, fecha, criticidad e idempotencia; nunca binarios, Base64, URLs firmadas, tokens o secretos.

`evento_operacional_documental` continúa como outbox técnico con lease e idempotencia. La consulta comercial no inserta eventos ni activa procesamiento automático.

## Seguridad, portabilidad y preservación

No hay SDK cloud en M2, URLs Cloudflare, rutas Clouding ni dependencia de proveedor. El almacenamiento sigue detrás de `ServicioDocumental`/`StorageAdapter`. No se sobrescriben originales, eliminan versiones, cambian hashes ni activa borrado físico.

## Pruebas

Las pruebas focales usan PostgreSQL local aislado y verifican relaciones reales, producto vacío/inexistente, fotografías, tipos técnicos, cuarentena, principal, orden, B2B/B2C, historial, BigInt, fechas, mapeo de tipos, ausencia de secretos, M4, IDOR, capacidades, M9 y outbox inactivo. La suite global protege regresiones de productos, Terreno, Inventario, M4, M9 y Mantenedores.

## Riesgos y dependencias pendientes

- Aprobación empresarial de CU y perfiles documentales.
- Aprobación del catálogo de eventos M9 y criticidad.
- Prueba real con ClamAV y R2; ninguna se ejecutó aquí.
- Políticas técnicas por clasificación.
- Demostrar precondición atómica de no sobrescritura en COPY para R2 y S3; un HEAD previo no basta.
- Definir límites y paginación pública antes de registrar rutas.

## Activación y próximo bloque

El despliegue está pendiente. Clouding, RRFF, R2 y AWS no fueron contactados. Para 4.5B.2 se requieren CU/perfiles aprobados, catálogo M9 aprobado, verificación de precondiciones del proveedor y autorización expresa. Este bloque no inicia 4.5B.2.
