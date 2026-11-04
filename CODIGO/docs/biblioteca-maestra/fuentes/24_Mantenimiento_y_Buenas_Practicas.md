# Mantenimiento y buenas practicas

**Proyecto:** Puertas Blindadas
**Documento:** 24
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

## Patrones que ya usamos

- Fachada `C_Finanzas` entre rutas y controladores.
- Controladores M1-M9 por dominio.
- Transacciones Prisma para efectos relacionados.
- Revision optimista e idempotencia.
- Snapshots para historia comercial/documental.
- Productor oficial M9.
- StorageAdapter y AntivirusAdapter desacoplados.
- Modal centrado reutilizable para formularios/PDF.

## Antipatrones que debemos evitar

- Hardcodear IDs de usuarios, precios o permisos.
- Autorizar solo en React.
- Convertir 403 en lista vacia.
- Escribir directo en `evento_auditoria_m9` con hashes propios.
- Regenerar PDF historico con catalogos actuales.
- Usar costo interno como precio comercial.
- Crear una OT por servicio o alternativa descartada.
- Editar migraciones aplicadas.
- Ejecutar `git reset --hard`, `migrate reset` o limpiezas globales para arreglar pruebas.

## Regla de mantenimiento

Cambios pequenos, focales, con evidencia. Preservar trabajo ajeno y separar deuda heredada de regresiones nuevas.


## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
