# Como desarrollar una nueva funcionalidad

**Proyecto:** Puertas Blindadas
**Documento:** 23
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

## Proceso recomendado

1. Convertir la necesidad humana en comportamiento observable.
2. Decidir si requiere CU; no inventar numeracion.
3. Definir actor, alcance y estados.
4. Diseñar interfaz sin confiarle la seguridad.
5. Definir endpoint y contrato.
6. Exponerlo por `C_Finanzas` si pertenece al sistema financiero.
7. Implementar controlador/servicio propietario.
8. Reutilizar modelos Prisma; si faltan, diseñar migracion aditiva.
9. Integrar M9 mediante el productor oficial.
10. Agregar pruebas unitarias, integracion y UI.
11. Actualizar manuales y trazabilidad.
12. Desplegar solo con autorizacion, respaldo y plan de rollback.

## Definition of Done

- Validacion backend completa.
- Permiso M4 explicito y probado.
- Escritura atomica o recuperable.
- Idempotencia donde hay reintentos.
- Auditoria M9 sin eventos ficticios.
- Estados vacios y errores diferenciados.
- Migracion no destructiva y validada.
- Builds y pruebas focales aprobadas.
- Documentacion actualizada.
- Sin secretos, temporales o datos reales en Git.


## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
