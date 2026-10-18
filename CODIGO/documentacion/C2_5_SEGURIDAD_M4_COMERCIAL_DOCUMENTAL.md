# C2.5 — Seguridad M4 comercial y documental

Este documento reemplaza cualquier interpretación anterior que utilizara CU366 para asociar documentos. La descripción persistida por la migración 054 limita CU366 a vínculos de fichas comerciales con Terreno e Inventario.

## Matriz M4 comercial

| Operación | Módulo | CU | Acceso | Alcance | Auditoría | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| Consultar productos | M2 | CU360 | Consulta | Catálogo comercial | No | Operativo |
| Crear productos | M2 | CU361 | Escritura | Familias y fichas | Sí | Operativo existente |
| Editar productos | M2 | CU362 | Escritura | Borradores de ficha | Sí | Operativo existente |
| Publicar producto | M2 | CU365 | Publicación | Versión inmutable | Sí | Operativo existente |
| Consultar versiones | M2 | CU367 | Consulta | Historial comercial | No | Operativo |
| Crear/versionar/desactivar precios | M2 | CU368 propuesto | Escritura | Precio de producto | Sí | No registrado |
| Mantener opcionales y compatibilidad | M2 | CU369 propuesto | Escritura | Opcional/producto/precio | Sí | No registrado |
| Mantener tarifas y exclusiones | M2 | CU370 propuesto | Escritura | Cobertura comercial | Sí | No registrado |
| Crear/versionar condiciones | M2 | CU371 propuesto | Escritura | Condiciones comerciales | Sí | No registrado |
| Publicar condiciones | M2 | CU372 propuesto | Publicación | Versión de condición | Sí | No registrado |

CU368–CU372 son identificadores consecutivos propuestos después del último CU real verificado, CU367. No se incorporan a `permisos.ts`, seeds, migraciones, perfiles ni usuarios.

## Matriz M4 documental comercial

| Operación | Módulo | CU | Acceso | Alcance | Auditoría | Estado/bloqueos |
| --- | --- | --- | --- | --- | --- | --- |
| Consultar metadatos | M2 | CU360 | Consulta | Producto / COMERCIAL | No | Operativo |
| Consultar versiones | M2 | CU367 | Consulta | Documento asociado / COMERCIAL | No | Operativo |
| Solicitar/confirmar carga y reemplazar | M2 | CU373 propuesto | Escritura | Archivo comercial | Sí | Permiso, política, storage, antivirus y M9 |
| Asociar, definir principal, ordenar y segmentar | M2 | CU374 propuesto | Escritura | Galería de producto | Sí | Permiso y M9 |
| Solicitar vista previa | M2 | CU375 propuesto | Consulta | Versión disponible | Sí | Permiso, política y storage |
| Descargar documento | M2 | CU376 propuesto | Consulta | Versión disponible | Sí | Permiso, política, storage, antivirus y M9 |
| Administrar conservación | Documental | CU377 propuesto | Escritura | Política documental | Sí | Decisión empresarial pendiente |

CU373–CU377 tampoco se registran ni asignan. El rol administrador no elude permisos explícitos ni operaciones pendientes de aprobación.

## Escrituras C1 preparadas

`SeguridadCapacidadesComerciales.ts` define contratos y validaciones previas para precios, opcionales, compatibilidades, tarifas, exclusiones y condiciones. Exige actor backend, idempotencia, motivo, revisión optimista cuando corresponde, importes positivos, vigencias coherentes, segmentos válidos y consistencia entre cobertura, precio y moneda.

El servicio preparado autoriza antes de invocar al repositorio. Como los CU propuestos no están aprobados, ninguna escritura alcanza el repositorio y no existen rutas HTTP nuevas.

## Núcleo documental reutilizado

- `CoordinadorCargaDocumental`: claves deterministas, reintento recuperable, lectura estable, creación exclusiva y cuarentena.
- `IntegridadContenido`: SHA-256, tamaño real, MIME detectado y rechazo de contenido activo o sospechoso.
- `AntivirusAdapter`: sólo `LIMPIO` permite disponibilidad; ausencia, infección o error mantienen el archivo bloqueado.
- `ServicioRecuperacionDocumental`: sólo firma versiones `DISPONIBLE`, con hash, MIME detectado y antivirus limpio.
- `S3CompatibleStorageAdapter`: URLs temporales, lectura privada y errores normalizados; no expone claves al frontend.
- `RepositorioDocumentalPrisma`: versiones independientes, asociación referencial, idempotencia y restricciones históricas.

## Política COMERCIAL pendiente

El motor soporta técnicamente JPEG, PNG, WEBP y PDF. La empresa aún debe aprobar por clasificación:

- MIME permitidos por tipo documental;
- tamaño mínimo y máximo;
- expiración de intenciones y URLs;
- timeout, concurrencia y cantidad máxima;
- proveedor/entorno autorizado y contenedores;
- ClamAV operativo y límites de escaneo;
- catálogo de eventos M9;
- perfiles que recibirán cada CU propuesto.

Sin `DOCUMENTAL_POLITICAS_ACTIVACION_JSON` con una entrada COMERCIAL explícita, storage configurado y antivirus activo, la gestión permanece cerrada. No existen valores predeterminados abiertos.

## Auditoría M9

Los eventos de precios, opcionales, tarifas y condiciones están en `MatrizAuditoriaComercial.ts`. Los eventos de carga, rechazo, cuarentena, reemplazo, asociación, principal, uso comercial y descarga permanecen en la matriz documental. Ambos catálogos están pendientes de aprobación; una operación bloqueada no publica eventos ficticios.

## Estados

### Operativo

- Consulta de catálogo y metadatos COMERCIAL con CU360.
- Consulta de versiones e historial con CU367.
- Filtrado documental B2B/B2C y validación de alcance backend.

### Implementado pero bloqueado

- Validadores y puerta de autorización para escrituras C1.
- Carga segura, cuarentena, integridad, antivirus, versionado y recuperación privada del núcleo documental.
- Diagnóstico UI de permiso, política, storage, antivirus y carga pendiente.

### Pendiente

- Aprobación y registro empresarial de CU368–CU377.
- Asignación explícita a perfiles/usuarios.
- Política COMERCIAL definitiva.
- Configuración de storage y antivirus en un entorno autorizado.
- Aprobación del catálogo de eventos M9.
- Registro de rutas de escritura, preview y descarga después de cumplir todos los requisitos.
