# Informe de cobertura documental

**Proyecto:** Puertas Blindadas
**Documento:** 38
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

## Cobertura cuantitativa
| Categoria | Cantidad |
| --- | --- |
| Archivos fuente inventariados | 490 |
| Endpoints detectados | 479 |
| CU detectados | 300 |
| Modelos Prisma | 283 |
| Enums Prisma | 0 |
| Migraciones | 72 |
| Suites de prueba | 137 |
| Metodos backend detectados | 678 |
| Vistas TSX | 78 |
| Errores catalogados | 1212 |
## Brechas declaradas
| Elemento | Estado | Motivo |
| --- | --- | --- |
| Capturas visuales | NO DOCUMENTADO | No se inicio una app con datos demo durante esta generacion |
| Staging | NO CONFIRMADO | No se demostro ambiente separado |
| Secretos/infra productiva | EXCLUIDO | Deliberadamente no inspeccionados |
| Semantica de endpoints dinamicos | PARCIAL | Patrones automaticos requieren validar middleware cuando no aparece CU |
| Validacion visual de usuaria | PENDIENTE | No puede inferirse del codigo |
## Objetivo de cero omisiones
Los anexos JSON/CSV permiten detectar deltas. La cobertura es exhaustiva por inventario estatico del SHA, pero una descripcion generada no sustituye pruebas operativas. Todo archivo posterior al SHA queda fuera hasta regenerar.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
