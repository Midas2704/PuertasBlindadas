# Trazabilidad de funcionalidades sin CU

**Proyecto:** Puertas Blindadas
**Documento:** 07
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

## Catalogo tecnico
| Funcionalidad | Origen | Impacto |
| --- | --- | --- |
| Health checks | servidor/app/rutas | Detectar disponibilidad sin ejecutar negocio |
| SHA-256 | documental/seguridad/IntegridadContenido.ts | Verificar bytes y documentos historicos |
| Antivirus | documental/seguridad/AntivirusAdapter.ts | Fail-closed ante infeccion, error o indisponibilidad |
| Storage S3 compatible | documental/adaptadores | Guardar/leer objetos privados sin acoplar proveedor |
| Motor PDF | m2/documentos comerciales | Renderizar preview y emitido con una fuente comun |
| Revision optimista | controladores y campos revision | Evitar actualizaciones perdidas |
| Idempotencia | flujos comerciales/documentales | Evitar duplicados por reintento |
| Snapshots | cotizaciones/documentos | Congelar valores historicos |
| Outbox/retry | documental y M9 | Coordinar efectos que no comparten transaccion |
| Normalizacion RUT | utilidades/controladores | Comparar y validar identidad tributaria |
## Contrato de operacion
Cada proceso tecnico recibe datos validados, retorna un resultado explicito y nunca debe convertir una dependencia fallida en exito. Sus pruebas deben cubrir error, timeout, reintento e integridad cuando aplique.
## Fuentes de verdad consultadas
- `controladores y campos revision`
- `cotizaciones/documentos`
- `documental y M9`
- `documental/adaptadores`
- `documental/seguridad/AntivirusAdapter.ts`
- `documental/seguridad/IntegridadContenido.ts`
- `flujos comerciales/documentales`
- `m2/documentos comerciales`
- `servidor/app/rutas`
- `utilidades/controladores`

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
