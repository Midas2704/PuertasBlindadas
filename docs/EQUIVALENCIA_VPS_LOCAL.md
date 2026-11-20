# Evidencia de equivalencia VPS/local

Fecha UTC de la fotografía: 2026-11-16T01:02:52Z.

## Estado ejecutado preservado

| Componente | Identificador | SHA-256 del archivo preservado |
|---|---|---|
| Backend | `sha256:f54c8c78ebd572b30aa7852d75d95be892e22eaef8da811558cd38b84636a839` | `87f0411fb065a549818cb1d43c4ea546bea3f37a62e13f933d2307682223a653` |
| Frontend | `sha256:0ecacbd1e78c552f6c1f387be6409b2aad9766a496f7725eb7fe8d6e4f6007de` | `8cf5761472e5ee424ae4804e49ccd10be964f05952d0087db9f96724d5e048bc` |
| Base cifrada | PostgreSQL 18.6 | `e83ab6c28194f87fd9d6fcb2c9794c1b8031cb0e1b671418bf1f527509626609` |

## Código y artefactos

- Rama observada: `integracion/rama-dani-clientes-20261115`.
- Commit observado: `b32c4eceea308d7e16a1cb765cf26dc985bee8146`.
- Se preservaron todos los cambios tracked y untracked del VPS.
- El `dist` que permanecía en el directorio fuente del frontend era antiguo y no coincidía con Nginx.
- Una compilación limpia desde el código recuperado produjo SHA-256 idénticos a todos los archivos activos del backend y frontend: **0 diferencias** en ambos componentes.
- Backend build: aprobado.
- Frontend build: aprobado.
- Prisma validate/generate: aprobado.
- Lint frontend: no aprobado; existen 85 errores y 10 advertencias previas. No se corrigieron porque esta recuperación no modifica funcionalidad.

## Verificación pendiente

La equivalencia completa requiere restaurar el respaldo y ejecutar los módulos contra el PostgreSQL local. No debe marcarse como completa hasta que `verificar-instalacion.ps1` termine correctamente y la usuaria valide visualmente la aplicación.
