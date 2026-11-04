# Glosario Puertas Blindadas

**Proyecto:** Puertas Blindadas
**Documento:** 22
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

## Terminos
| Termino | Explicacion simple | Explicacion tecnica |
| --- | --- | --- |
| CU | Permiso para una accion | Codigo de caso de uso del catalogo M4 |
| M4 | Seguridad y permisos | Autenticacion, sesion, perfiles, CU y alcance |
| M9 | Auditoria | Evidencia con integridad, correlacion e idempotencia |
| Obra | Lugar fisico | Entidad reutilizable por varios proyectos |
| Proyecto | Pedido especifico | Trabajo originado por una cotizacion y vinculado a obra |
| OT | Orden de Trabajo | Trabajo operacional para una unidad fisica |
| NV | Nota de Venta | Formalizacion comercial de lo contratado |
| Unidad fisica | Una puerta real | Identidad individual entre detalle y OT |
| Rectificacion | Medicion/correccion tecnica | Proceso versionado previo a produccion |
| B2B | Venta a empresa | Segmento con empresa, contactos y servicios |
| B2C | Venta a particular | Segmento que admite alternativas comerciales |
| Snapshot | Foto inmutable de datos | JSON/version de valores usados en un hecho historico |
| Idempotencia | Repetir sin duplicar | Clave/constraint que conserva un solo efecto |
| Hash | Huella digital | SHA-256 u otra funcion aplicada a material canonico |
| Migracion | Cambio versionado de BD | SQL incremental aplicado en orden |
| Prisma | Capa de acceso a datos | ORM y schema tipado para PostgreSQL |
| Endpoint | Direccion de API | Metodo HTTP y path que expone un caso |
| Controller | Regla de negocio | Clase backend que valida y coordina persistencia |
| Schema | Agrupacion/definicion | Namespace PostgreSQL o archivo Prisma |
| Foreign Key | Vinculo valido | Constraint referencial entre tablas |
| Revision optimista | Evita pisar cambios | Compara revision antes de actualizar |

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
