# Deuda tecnica, limitaciones y pendientes

**Proyecto:** Puertas Blindadas
**Documento:** 28
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

## Registro honesto
| Tema | Estado | Area |
| --- | --- | --- |
| Sustitucion de puerta con OT iniciada | Pendiente de definicion intermodular | Produccion/Inventario |
| Region en costos internos M7 heredados | Compatibilidad parcial; no inferir | M7 |
| Fotografia comercial completa | Depende de catalogo/documental autorizado | Productos/Documental |
| Validaciones visuales | Pendientes de usuaria para documentos/pantallas | UI/PDF |
| Bundle Vite >500 kB | Warning no bloqueante; evaluar code splitting | Frontend |
| CU377 | Bloqueado/no aprobado | M4/Documental |
| Politica productiva antivirus/storage | Pruebas locales no equivalen a politica empresarial | Documental |
| Staging separado | NO CONFIRMADO EN EL REPOSITORIO | DevOps |
## Uso
La deuda no autoriza implementar cambios durante documentacion. Cada item requiere requerimiento, responsable, riesgo, prueba y autorizacion propios.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
