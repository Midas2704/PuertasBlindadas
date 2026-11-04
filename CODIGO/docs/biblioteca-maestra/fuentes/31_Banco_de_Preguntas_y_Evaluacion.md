# Banco de preguntas y evaluacion

**Proyecto:** Puertas Blindadas
**Documento:** 31
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

## Banco base
## Pregunta 1 - Basica
**Pregunta:** ¿Que diferencia hay entre Obra y Proyecto?
**Respuesta:** Obra es el lugar; Proyecto es un pedido/trabajo. Una obra puede tener varios proyectos.
**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres.
## Pregunta 2 - Basica
**Pregunta:** ¿Preview PDF emite?
**Respuesta:** No. No crea NV, OT ni documento historico confirmado.
**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres.
## Pregunta 3 - Intermedia
**Pregunta:** ¿Por que un 403 no debe verse como lista vacia?
**Respuesta:** Oculta una falla de autorizacion y conduce a diagnosticos falsos.
**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres.
## Pregunta 4 - Intermedia
**Pregunta:** ¿Como se evita duplicar NV/OT?
**Respuesta:** Transaccion, constraints, revision e idempotencia.
**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres.
## Pregunta 5 - Avanzada
**Pregunta:** ¿Por que PostgreSQL y S3 requieren coordinacion?
**Respuesta:** No comparten transaccion; se necesitan estados, reintentos y reconciliacion.
**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres.
## Pregunta 6 - Avanzada
**Pregunta:** ¿Que hacer con un evento M9 invalido?
**Respuesta:** Conservarlo, marcar comprometido y seguir mostrando validos; no reescribir hash.
**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres.
## Pregunta 7 - Debug
**Pregunta:** Midas no ve OT y no tiene alcanceEmpleadoId
**Respuesta:** Revisar administrador_original y CU generales; la raiz no debe quedar limitada por empleado.
**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres.
## Pregunta 8 - BD
**Pregunta:** ¿Se asigna obra heredada por direccion parecida?
**Respuesta:** No. Se deja sin vinculo hasta seleccion explicita.
**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres.
## Pregunta 9 - Seguridad
**Pregunta:** ¿Midas puede saltar antivirus?
**Respuesta:** No. Tener CU no elimina controles de integridad o estado.
**Explicacion:** la respuesta se basa en las reglas transversales documentadas; se evalua comprension, no memoria de nombres.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
