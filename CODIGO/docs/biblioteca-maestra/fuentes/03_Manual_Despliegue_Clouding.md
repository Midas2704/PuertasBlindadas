# Manual de despliegue y servidor Clouding

**Proyecto:** Puertas Blindadas
**Documento:** 03
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

## Advertencia operacional

Este manual documenta el flujo conocido, pero no autoriza un despliegue. No contiene secretos. Antes de operar, confirmar nombres reales de servicios, variables y estrategia de respaldo en el servidor.

## Arquitectura conocida

Cloudflare protege/resuelve el acceso; Clouding aloja los componentes; Docker Compose coordina frontend, backend y PostgreSQL segun la configuracion operacional. **STAGING: NO CONFIRMADO EN EL REPOSITORIO** como ambiente separado.

## Actualizacion normal

```powershell
cd /opt/puertasblindadas
git status
git pull --ff-only
docker compose build
docker compose up -d
docker compose ps
curl -f http://127.0.0.1:<puerto>/health
```

`git status` confirma que no se pisara trabajo del servidor. `git pull --ff-only` evita merges accidentales. `build` reconstruye imagenes. `up -d` reemplaza contenedores de forma declarativa. `ps` y `curl` verifican proceso y salud.

## Despliegue con migraciones

Respaldar, revisar `prisma migrate status`, aplicar `prisma migrate deploy` una sola vez desde el servicio autorizado y comprobar schema/health. Nunca usar `migrate reset` o `db push` en produccion.

## Rollback conceptual

El codigo puede volver a un commit anterior si el schema sigue siendo compatible. Las migraciones no se revierten borrando carpetas: requieren una estrategia SQL evaluada y respaldo probado.

## No afectar otros proyectos

No ejecutar comandos globales de Docker, no eliminar volumenes compartidos, no reutilizar puertos sin inventario y no modificar proxies o certificados fuera del host virtual de Puertas Blindadas.

## Diagnostico

Priorizar lectura: `docker compose ps`, logs acotados por servicio, health checks, uso de disco y estado de migraciones. Toda accion que reinicie, reconstruya o migre debe estar autorizada.


## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
