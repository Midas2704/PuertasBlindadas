# Guia de errores y troubleshooting

**Proyecto:** Puertas Blindadas
**Documento:** 20
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

## Catalogo por sintoma
| Sintoma | Causas | Diagnostico/solucion segura |
| --- | --- | --- |
| No puedo iniciar sesion | Credencial, bloqueo, sesion, politica | Revisar respuesta y M4; no revelar existencia de cuenta |
| No veo una OT | Permiso/alcance, filtros o vinculo unidad | Revisar HTTP 403, actor, CU205/207/209 y unidad_fisica_orden_trabajo |
| 403 | CU, dependencia, administrador, alcance o estado | Seguir diagnostico M4; no hardcodear usuario |
| Prisma migrate falla | Drift, conexion o SQL | Detenerse, respaldar y revisar status; no reset |
| PDF no abre | Bytes incompletos, MIME, storage | Verificar firma PDF, tamano y SHA |
| Antivirus no disponible | clamd caido/timeout | Mantener fail-closed y restaurar servicio |
| Storage no disponible | Endpoint/credencial/bucket | No confirmar documento; revisar adaptador |
| Integridad comprometida | Hash no canonico o alteracion | Marcar comprometido, conservar evidencia y revisar productor |
| No aparecen permisos | Sincronizacion, catalogo o particular | Comparar CU activos/aprobados y efectivos |
| Frontend vacio | Error oculto, API o sesion | Abrir red/consola y distinguir error de lista vacia |
| Backend 500 | Excepcion no controlada | Correlacionar log, ruta y M9 sin repetir escritura |
| No conecta BD | DATABASE_URL, puerto, servicio | Validar destino antes de ejecutar cualquier migracion |
| Compose no levanta | Imagen, puerto, volumen | Revisar `docker compose ps` y logs del servicio |
## Regla de oro
Primero observar. Luego aislar. Finalmente corregir con prueba focal. No limpiar bases, borrar volumenes, resetear Git ni modificar evidencia para ocultar el sintoma.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
