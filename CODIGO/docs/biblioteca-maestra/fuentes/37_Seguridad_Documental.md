# Seguridad documental

**Proyecto:** Puertas Blindadas
**Documento:** 37
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

## Modelo de amenaza

El sistema protege documentos comerciales y evidencias frente a contenido malicioso, sustitucion, acceso indebido, exposicion publica y perdida de historia.

## Controles

- MIME declarado y detectado.
- Limites de tamano y cantidad.
- SHA-256 de bytes.
- Claves de objeto opacas sin datos personales.
- Antivirus ClamAV mediante adaptador y comportamiento fail-closed.
- Storage privado S3-compatible mediante StorageAdapter.
- Versiones inmutables y recuperacion por referencia.
- CU y alcance en backend.
- URLs temporales; nunca identidad permanente.
- Auditoria M9 sin secretos o binarios.

## Politica de error

Deteccion, timeout, servicio caido, hash incorrecto o fallo de storage impiden disponibilidad. No se marca LIMPIO o CONFIRMADO sin comprobacion real.

## Pruebas locales vs produccion

SeaweedFS/ClamAV locales demostraron contratos en aislamiento. Puertos, limites, region, cifrado, retencion y credenciales productivas requieren decisiones y autorizacion empresarial.


## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
