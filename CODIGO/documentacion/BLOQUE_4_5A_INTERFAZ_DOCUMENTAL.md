# Bloque 4.5A — Interfaz documental comercial

## Estado

- **IMPLEMENTADO:** componentes visuales reutilizables, estados de interfaz, ficha de creación, estructura de consulta/edición, galería, documentos, historial y vista previa modal.
- **PREPARADO:** contratos TypeScript para metadatos, capacidades y futura obtención de vistas previas temporales.
- **DESHABILITADO:** carga, reemplazo, descarga, cambio de principal, orden y edición de uso B2B/B2C.
- **PENDIENTE DE INTEGRACIÓN:** API autorizada, permisos M4, eventos M9, clamd real y proveedor R2/S3.

## Componentes

Los componentes se encuentran en `Vistas/src/components/documental/`:

- `PanelDocumentosProducto`: compone la experiencia y distingue el estado de integración.
- `GaleriaProducto` y `TarjetaImagenProducto`: presentan fotografías ordenadas, miniaturas y principal.
- `ListaDocumentosProducto`: separa ficha técnica, catálogo, diagrama y otros documentos autorizados.
- `HistorialDocumento`: representa versiones vigentes, reemplazadas y archivadas sin eliminarlas.
- `VistaPreviaDocumento`: usa `ModalFormulario` para imágenes o PDF autorizados.
- `EstadoDocumentoVisual`: presenta estados técnicos sin permitir modificarlos.
- `ResumenUsoComercial`: muestra B2B, B2C, ambos o uso no definido.
- `tipos.ts`: modelo seguro de frontend basado en las entidades documentales persistentes.
- `contratoDocumental.ts`: puerto futuro sin rutas HTTP ni implementación de transporte.

## Integración en Productos y familias

La pestaña **Imágenes y documentos** de `ProductosFamilias.tsx` reemplaza los mensajes provisionales por `PanelDocumentosProducto`. Las demás pestañas y sus operaciones comerciales no cambian.

En creación se informa que primero debe existir el producto, sin bloquear el guardado comercial. En edición y consulta se muestra la estructura completa con estado honesto `NO_HABILITADA`; no se interpreta como catálogo vacío.

## Fotografías y galería

La fotografía principal usa proporción estable y `object-contain`, sin recortar ni transformar el original. Las imágenes se cargan de forma diferida. La galería ordena sólo la presentación y contempla miniatura ausente, varias imágenes y modalidad comercial. No incluye fotografías de muestra.

## Documentos e historial

Los documentos comerciales se muestran separados de las fotografías, con tipo, estado, versión, fecha y uso B2B/B2C. El historial ordena versiones y diferencia vigente de histórica. Una versión archivada continúa representada como evidencia histórica.

## Modales y accesibilidad

La vista ampliada reutiliza `ModalFormulario`, por lo que conserva diálogo centrado, foco inicial, encierro de Tab, Escape, restauración del foco, overlay, cuerpo desplazable y pie fijo. Los estados usan `status` o `alert`, los íconos decorativos quedan ocultos a tecnologías de asistencia y todas las imágenes poseen texto alternativo.

## Responsive e identidad

La composición usa grillas progresivas para móvil, tablet y escritorio. El fondo predominante es blanco; `#FE8F01` se reserva para acentos, `#676767` para información secundaria y negro para contenido principal.

## Seguridad

La aplicación real no contiene fixtures, selector de archivos, PUT, Base64, rutas documentales, llamadas a storage ni URLs generadas. Las URLs temporales sólo pueden llegar por props desde una integración futura y se eliminan de la selección al cerrar el modal. No se usa `localStorage`, `sessionStorage`, `IndexedDB`, logs ni telemetría.

Las capacidades provienen del futuro backend. Ocultar o deshabilitar botones no sustituye autorización. `CU360`, `CU366` y `CU367` no se reinterpretan como permisos documentales.

## Estados visuales

Se distinguen `NO_HABILITADA`, `CARGANDO`, `VACIO`, `LISTO`, `ERROR` y `DENEGADO`. `VACIO` sólo se usa después de una consulta autorizada. Los estados documentales contemplan pendiente, subiendo, validando, disponible, error, cuarentena, reemplazado y archivado. Cuarentena bloquea vista previa y descarga.

## Pruebas

Las pruebas focales verifican estructura, estados, seguridad, ausencia de integración real y regresión del mantenedor. El repositorio no posee actualmente un entorno de pruebas DOM para React; por eso la verificación automatizada de componentes es estructural y se complementa con TypeScript, build Vite y ESLint.

## Próximos pasos

Antes de activar operaciones se requiere aprobación de capacidades M4, contratos/endpoints backend, eventos M9, clamd real y almacenamiento autorizado. El despliegue permanece pendiente de autorización. Este bloque no inicia 4.5B.
