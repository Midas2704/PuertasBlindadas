# Bloque 4.5B.2A — Preparación técnica para la activación documental comercial

Fecha de revisión: 2026-10-12. Rama: `dashboard-ventas-familia-y-navegacion`. SHA inicial: `2654aa63b7ce5d79065f384639602551a81dcd19`.

## Estado y diagnóstico

**IMPLEMENTADO:** aislamiento `COMERCIAL` en consulta Prisma, defensa equivalente en el servicio y rechazo de asociaciones futuras de otra clasificación. Se añadió coordinación interna cerrada, política de activación fail-closed, matriz M4/M9 detallada, protección condicional del destino S3 y pruebas React DOM.

**PROBADO EN AISLADO:** PostgreSQL local, adaptadores y concurrencia con dobles dentro de pruebas, validación SHA-256/MIME, antivirus fail-closed y componentes React con jsdom. Los fixtures son sintéticos.

**PREPARADO:** integración M2 → autorización M4 → coordinador existente → repositorio → outbox/M9. No se registraron rutas HTTP nuevas.

**PENDIENTE DE APROBACIÓN:** CU de carga, confirmación, descarga, reemplazo, imagen principal, orden, uso B2B/B2C, archivo, cuarentena y conservación; catálogo documental M9; valores empresariales de políticas.

**PENDIENTE DE PROVEEDOR REAL:** extensión condicional de copia R2, comportamiento real S3, ClamAV real, firmas, latencia, reintentos y reconciliación sobre infraestructura autorizada.

**BLOQUEADO PARA ACTIVACIÓN:** toda carga/descarga real, R2, workers y publicaciones M9. Completar este bloque no activa infraestructura.

## Arquitectura preparada

```text
React (acciones cerradas)
  -> contrato interno M2 (sin ruta HTTP)
  -> AutorizadorDocumental (actor derivado de sesión + CU + alcance)
  -> CoordinadorDocumentosProducto
  -> CoordinadorCargaDocumental existente
  -> StorageAdapter + validación SHA/MIME + AntivirusAdapter
  -> RepositorioDocumentalPrisma (transacciones/idempotencia)
  -> evento_operacional_documental
  -> puente M9 cerrado por catálogo aprobado
```

No se creó un segundo coordinador de bytes. `CoordinadorDocumentosProducto` sólo prepara la secuencia comercial y depende del coordinador de carga existente. La autorización de `CONFIRMAR_CARGA` se evalúa antes de cualquier efecto y actualmente falla cerrada.

## Aislamiento e IDOR

- Prisma exige asociación activa, documento activo y `clasificacion = COMERCIAL`.
- El servicio vuelve a comprobar `COMERCIAL`; un repositorio defectuoso no puede filtrar DTO sensibles.
- La creación de asociación también exige documento activo y comercial.
- M4 valida actor autenticado, sesión, CU y alcance de producto/documento; un administrador no evita un CU documental pendiente.
- Las consultas de historial vuelven a resolver la asociación producto-documento, evitando acceso por un ID aislado.
- Los DTO no contienen bucket, clave, proveedor, SHA-256, secretos ni URL persistida.

## Flujo de carga y confirmación

```text
intención ligada a actor + documento + clasificación
  -> temporal opaco
  -> copia de trabajo estable
  -> lectura completa / SHA-256 / MIME real / límites
  -> ClamAV: sólo LIMPIO aprueba
  -> revalidación de copia de trabajo
  -> creación condicional de destino
  -> relectura completa y SHA-256 del destino
  -> versión + finalización atómica en PostgreSQL
  -> asociación comercial autorizada
  -> outbox técnico / futuro puente M9 aprobado
```

Una intención expirada, de otro actor, de otro documento o sin política no se confirma. Una caída de PostgreSQL después de la promoción converge sólo si el destino ya reservado conserva exactamente los mismos bytes. Un destino distinto produce `DESTINO_OCUPADO`; nunca se sobrescribe.

## Protección de destino y concurrencia

AWS S3 documenta `If-None-Match: *` en escrituras condicionales y el SDK v3 expone `IfNoneMatch` en `CopyObjectCommand`. El adaptador S3 envía simultáneamente `CopySourceIfMatch` y `IfNoneMatch: *`; HTTP 412 se normaliza como conflicto no reintentable. Referencias: [AWS conditional writes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html) y [CopyObjectCommand v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/CopyObjectCommand/).

Cloudflare R2 documenta cabeceras específicas `cf-copy-destination-if-none-match` y advierte límites de atomicidad entre condiciones de origen y destino. El cliente actual no implementa ni ha validado esa extensión contra R2 real. Por ello `copiaCondicionalDestino=false` para R2 y el coordinador bloquea antes de leer bytes. Referencia: [R2 S3 API extensions](https://developers.cloudflare.com/r2/api/s3/extensions/).

La exclusión PostgreSQL no se presenta como sustituto de la precondición del objeto. Los identificadores definitivos continúan siendo UUID opacos y deterministas por intención.

## Integridad, MIME, antivirus y cuarentena

- SHA-256 se calcula sobre todos los bytes de la copia estable y se vuelve a comprobar después de promover.
- JPEG, PNG, WebP y PDF se detectan por contenido; extensión, nombre, `Content-Type`, ETag y hash React no son autoridad.
- Los originales no se comprimen ni modifican.
- Sólo `LIMPIO` permite `DISPONIBLE`; infección, error, indisponibilidad o archivo no soportado quedan en cuarentena/fallo cerrado.
- Las descargas requieren estado disponible, SHA válido, MIME detectado, antivirus limpio, proveedor coincidente y autorización ligada a entidad.
- **CLAMAV REAL PENDIENTE:** los dobles existen sólo en pruebas; no se conectó un daemon remoto.

## Políticas técnicas

`PoliticasActivacionDocumental` exige explícitamente por clasificación: MIME, mínimo, máximo, timeout, concurrencia máxima, cantidad máxima por operación, expiración de intención, expiración de URL y antivirus obligatorio. No hay valores oficiales predeterminados. Si falta JSON, `COMERCIAL`, un campo o `antivirusObligatorio=true`, falla cerrada. Los valores de tests son provisionales y no se aplican a documentos reales.

## Matriz M4 propuesta

| Operación | Propietario | CU actual | CU nuevo | Tipo | Entidad/clasificación | Riesgo | Auditoría | Estado |
|---|---|---:|---:|---|---|---|---|---|
| CONSULTAR_METADATA | M2 | CU360 | No | Consulta | Producto / COMERCIAL | Bajo | Evaluar | Existente |
| CONSULTAR_VERSIONES | M2 | CU367 | No | Consulta | Asociación / COMERCIAL | Medio | Evaluar | Existente |
| ASOCIAR_PRODUCTO | M2 | CU366 | No | Escritura | Producto / COMERCIAL | Medio | Sí | Existente |
| CREAR_INTENCION / CONFIRMAR_CARGA | M2 | — | Sí | Escritura | Asociación / por aprobar | Medio | Sí | Pendiente |
| DESCARGAR / REEMPLAZAR | M2 | — | Sí | Escritura | Asociación / por aprobar | Alto | Sí | Pendiente |
| DEFINIR_IMAGEN_PRINCIPAL / ORDENAR_GALERIA / DEFINIR_USO_B2B_B2C | M2 | — | Sí | Escritura | Asociación / COMERCIAL | Medio | Sí | Pendiente |
| ARCHIVAR_DOCUMENTO / GESTIONAR_CUARENTENA | M2 | — | Sí | Escritura | Asociación / por aprobar | Alto | Sí | Pendiente |
| ADMINISTRAR_CONSERVACION | Documental | — | Sí | Escritura | Política documental | Alto | Sí | Pendiente |

El perfil permanece `POR_DEFINIR_POR_EMPRESA`; esta matriz no crea CU, usuarios, perfiles ni asignaciones.

## Integración M9 y outbox

La matriz propuesta contiene los doce eventos solicitados, productor propuesto M2, operación, criticidad, idempotencia y justificación. Todos permanecen `PENDIENTE_APROBACION`. `PuenteM9DocumentosProducto` rechaza cualquier tipo no aprobado y contenido que parezca URL, token, secreto, autorización, Base64 o contraseña.

El outbox técnico existente conserva lease, expiración, reclamación concurrente, reintentos, descarte e idempotencia sin estado definitivo en memoria. No se inicia al importar. No se creó auditoría empresarial paralela ni se activó worker/publicador remoto.

## Asociación, fotografía principal, galería y recuperación

La asociación preparada exige producto existente, documento comercial activo, versión íntegra/limpia/disponible y actor autorizado. La futura imagen principal debe ser fotografía comercial disponible y conserva el índice único existente; no elimina anteriores. Orden y usos B2B/B2C reutilizarán `orden_presentacion`, `habilitado_b2b` y `habilitado_b2c`, sin duplicar objetos.

Las vistas previas usan sólo variantes disponibles y relacionadas; el original permanece intacto. La UI no consulta originales al listar. Las cargas, descargas y mutaciones continúan visualmente deshabilitadas cuando la capacidad backend no existe.

## Frontend y pruebas DOM

Se añadió un harness ligero de desarrollo con Vitest 4, React Testing Library, user-event, jest-dom y jsdom. Renderiza los componentes reales y comprueba estados de creación, integración pendiente, carga, error, denegación, vacío, principal, galería ordenada, B2B/B2C, historial, modal centrado, navegación, cierre, cuarentena y controles sin permiso. No hay datos de clientes ni conexiones externas.

## Dependencias

El harness es sólo `devDependency`. Vitest se elevó a una versión corregida después de que el diagnóstico detectara vulnerabilidades críticas en una versión anterior. No se ejecutó `npm audit fix` ni se actualizaron masivamente dependencias. El inventario heredado restante debe reportarse por severidad y separar runtime/tooling.

## Infraestructura, riesgos y activación posterior

No hubo conexión a Clouding, RRFF, R2, AWS ni Cloudflare; no hubo SSH, despliegue, migración remota, DNS, nginx, certificado, bucket o IAM. No se modificaron Prisma, migraciones 055–057, Terreno, Inventario, finanzas ni datos históricos.

Bloqueos obligatorios antes de activar:

1. Aprobar CU/perfiles/alcances en M4 y eventos en M9.
2. Aprobar valores empresariales de políticas.
3. Validar ClamAV real en entorno aislado autorizado.
4. Probar creación condicional, carreras, reintentos y reconciliación contra R2 real; implementar su cabecera específica o mantener R2 bloqueado.
5. Repetir las mismas pruebas contra S3 y revisar política de bucket; AWS advierte interacciones particulares entre políticas condicionales y `CopyObject`.
6. Aplicar 055–057 en una base autorizada, ejecutar smoke tests y recién entonces registrar rutas internas tras revisión de seguridad.
7. Observar outbox, fallos, métricas y rollback antes de cualquier habilitación a usuarios.

Cuando se recupere acceso a Clouding, el orden recomendado es: respaldar/verificar estado, validar secretos fuera de Git, aplicar migraciones pendientes con procedimiento aprobado, configurar políticas, probar ClamAV y storage sin datos reales, validar M4/M9, ejecutar smoke tests cerrados y solicitar autorización separada de despliegue. El próximo bloque recomendado es 4.5B.2B sólo después de estas aprobaciones; este trabajo no lo inicia.
