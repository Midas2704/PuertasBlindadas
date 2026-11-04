# Cheat sheets

**Proyecto:** Puertas Blindadas
**Documento:** 32
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

## Git

`git status --short` estado; `git diff --check` whitespace; `git log -1 --oneline` commit. Evitar reset/clean destructivos.

## npm

`npm install`, `npm run dev`, `npm run build`, `npm test`. Ejecutar en Controladores o Vistas segun corresponda.

## Prisma/PostgreSQL

`npx prisma validate`, `npx prisma generate`, `npx prisma migrate status`, `npx prisma migrate deploy`. Nunca reset en produccion.

## Docker

`docker compose ps`, `logs`, `build`, `up -d`. No usar limpiezas globales en servidor compartido.

## Arquitectura

Vista -> API -> ruta -> C_Finanzas -> controlador -> Prisma -> PostgreSQL -> M9.

## M4

Sesion + perfil + CU efectivo + dependencia + alcance + estado. CU377 bloqueado.

## M9

Usar productor oficial. Nunca escribir hashes propios ni corregir evidencia historica.

## Nomenclatura

B2B empresa; B2C particular; NV nota de venta; OT orden de trabajo; unidad fisica una puerta; Obra lugar; Proyecto pedido.


## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
