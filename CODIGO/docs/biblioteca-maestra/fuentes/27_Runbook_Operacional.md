# Runbook operacional

**Proyecto:** Puertas Blindadas
**Documento:** 27
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

## Primeros cinco minutos

1. Confirmar alcance del incidente y hora.
2. Usar health checks.
3. Consultar estado de contenedores/procesos.
4. Leer logs acotados por servicio y correlacion.
5. Revisar dependencia: BD, storage, antivirus, proxy.

## Comandos seguros/lectura

- `git status`, `git log -1 --oneline`
- `docker compose ps`
- `docker compose logs --tail 200 <servicio>`
- `curl -f <health>`
- `npx prisma migrate status` con la URL correcta
- consultas SQL SELECT autorizadas y acotadas

## Comandos que modifican estado

- `git pull`, `docker compose up`, reinicios, migraciones, cambios de variables y rollback.
- Requieren autorizacion, respaldo y verificacion posterior.

## Dependencias documentales

Storage o antivirus caidos bloquean confirmacion de documentos. No se debe cambiar la politica a permisiva durante un incidente.

## Escalamiento

Entregar sintoma, impacto, hora, actor, ruta, status HTTP, correlacion, commit, estado de servicios y acciones ya realizadas. Nunca compartir secretos.


## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
