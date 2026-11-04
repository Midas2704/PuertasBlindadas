# Arquitectura completa del sistema

**Proyecto:** Puertas Blindadas
**Documento:** 08
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

## Arquitectura logica

```text
Usuario -> React/Vite -> API HTTP -> rutas/finanzas.ts -> C_Finanzas
        -> M1..M9 / servicios -> Prisma -> PostgreSQL
        -> M9 (auditoria)
        -> ServicioDocumental -> AntivirusAdapter -> StorageAdapter
```

## Capas

- **Vistas:** pantallas, formularios, tablas, modales y navegacion.
- **API cliente:** serializa solicitudes y presenta errores HTTP.
- **Rutas:** autentican, extraen parametros y convierten errores.
- **C_Finanzas:** fachada que expone casos de uso sin entregar Prisma al frontend.
- **Controladores M1-M9:** reglas de dominio por modulo.
- **Servicios:** logica especializada, adaptadores y coordinacion.
- **Prisma/PostgreSQL:** persistencia relacional, constraints, triggers y transacciones.
- **M4:** autenticacion/autorizacion.
- **M9:** evidencia auditable e integridad.
- **Documental:** metadatos, antivirus, storage privado, versionado y recuperacion.

## Arquitectura fisica

Desarrollo usa procesos locales. El despliegue conocido usa contenedores en Clouding y borde Cloudflare. Storage productivo definitivo y topologia exacta deben confirmarse operacionalmente; las pruebas aisladas usaron infraestructura local.

## Principio de dependencia

Las vistas no escriben base de datos. Los adaptadores no contienen calculos comerciales. Los controladores no deben confiar en permisos enviados por React. Los documentos historicos no se regeneran desde catalogos actuales.


## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
