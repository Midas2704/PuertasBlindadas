# Indice maestro y ruta de aprendizaje

**Proyecto:** Puertas Blindadas
**Documento:** 01
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

## Catalogo de la biblioteca
| No. | Documento | Utilidad | Nivel |
| --- | --- | --- | --- |
| 01 | Indice maestro y ruta de aprendizaje | Consultar el documento especializado | Basico a avanzado |
| 02 | Manual de instalacion y entorno de desarrollo | Consultar el documento especializado | Basico a avanzado |
| 03 | Manual de despliegue y servidor Clouding | Consultar el documento especializado | Basico a avanzado |
| 04 | Manual de usuario completo | Consultar el documento especializado | Basico a avanzado |
| 05 | Manual de usuarios por rol | Consultar el documento especializado | Basico a avanzado |
| 06 | Trazabilidad completa de casos de uso CU | Consultar el documento especializado | Basico a avanzado |
| 07 | Trazabilidad de funcionalidades sin CU | Consultar el documento especializado | Basico a avanzado |
| 08 | Arquitectura completa del sistema | Consultar el documento especializado | Basico a avanzado |
| 09 | Codigo frontend explicado | Consultar el documento especializado | Basico a avanzado |
| 10 | Codigo backend explicado | Consultar el documento especializado | Basico a avanzado |
| 11 | Base de datos: diccionario y relaciones | Consultar el documento especializado | Basico a avanzado |
| 12 | Migraciones explicadas | Consultar el documento especializado | Basico a avanzado |
| 13 | Pruebas automatizadas explicadas | Consultar el documento especializado | Basico a avanzado |
| 14 | Guia de QA manual y casos de prueba | Consultar el documento especializado | Basico a avanzado |
| 15 | Seguridad M4 y permisos | Consultar el documento especializado | Basico a avanzado |
| 16 | Auditoria M9 | Consultar el documento especializado | Basico a avanzado |
| 17 | Ciclo comercial B2B y B2C | Consultar el documento especializado | Basico a avanzado |
| 18 | Terreno, rectificacion y produccion | Consultar el documento especializado | Basico a avanzado |
| 19 | Sistema documental y PDF | Consultar el documento especializado | Basico a avanzado |
| 20 | Guia de errores y troubleshooting | Consultar el documento especializado | Basico a avanzado |
| 21 | Catalogo de API | Consultar el documento especializado | Basico a avanzado |
| 22 | Glosario Puertas Blindadas | Consultar el documento especializado | Basico a avanzado |
| 23 | Como desarrollar una nueva funcionalidad | Consultar el documento especializado | Basico a avanzado |
| 24 | Mantenimiento y buenas practicas | Consultar el documento especializado | Basico a avanzado |
| 25 | Tecnologias y dependencias | Consultar el documento especializado | Basico a avanzado |
| 26 | Flujos de datos end-to-end | Consultar el documento especializado | Basico a avanzado |
| 27 | Runbook operacional | Consultar el documento especializado | Basico a avanzado |
| 28 | Deuda tecnica, limitaciones y pendientes | Consultar el documento especializado | Basico a avanzado |
| 29 | Historia tecnica y decisiones arquitectonicas | Consultar el documento especializado | Basico a avanzado |
| 30 | Curso practico para nuevos integrantes | Consultar el documento especializado | Basico a avanzado |
| 31 | Banco de preguntas y evaluacion | Consultar el documento especializado | Basico a avanzado |
| 32 | Cheat sheets | Consultar el documento especializado | Basico a avanzado |
| 33 | Mapa completo del repositorio | Consultar el documento especializado | Basico a avanzado |
| 34 | Matriz maestra de trazabilidad | Consultar el documento especializado | Basico a avanzado |
| 35 | Catalogo de estados y transiciones | Consultar el documento especializado | Basico a avanzado |
| 36 | Diccionario de errores | Consultar el documento especializado | Basico a avanzado |
| 37 | Seguridad documental | Consultar el documento especializado | Basico a avanzado |
| 38 | Informe de cobertura documental | Consultar el documento especializado | Basico a avanzado |
## Rutas de aprendizaje
| Ruta | Orden recomendado |
| --- | --- |
| Ruta A - Usuario final | 04, 05, 17, 18, 19, 20, 22, 32 |
| Ruta B - Soporte | 01, 04, 15, 16, 20, 27, 32, 36 |
| Ruta C - QA | 04, 06, 13, 14, 17, 18, 19, 34, 35, 36 |
| Ruta D - Frontend | 01, 08, 09, 15, 19, 21, 23, 24, 33 |
| Ruta E - Backend | 01, 08, 10, 15, 16, 21, 23, 24, 26, 33 |
| Ruta F - Base de datos | 08, 11, 12, 17, 18, 19, 29, 35 |
| Ruta G - Administrador/M4 | 05, 06, 15, 16, 20, 34, 36 |
| Ruta H - DevOps/despliegue | 02, 03, 20, 25, 27, 37 |
| Ruta I - Experto integral | 01 a 38, en orden |
## Estoy listo para trabajar solo cuando se...
- Levantar frontend y backend sin exponer secretos.
- Seguir una accion desde la vista hasta PostgreSQL.
- Distinguir CU, perfil, permiso particular y alcance por empleado.
- Explicar por que M9 no debe reescribir evidencia historica.
- Distinguir producto comercial, linea, unidad fisica y OT.
- Distinguir Obra de Proyecto.
- Aplicar migraciones solo con respaldo, entorno correcto y autorizacion.
- Diagnosticar un 403 sin convertirlo en una lista vacia.
- Probar idempotencia y revision optimista.
- Separar preview PDF de documento emitido e inmutable.
## Criterio de vigencia
El SHA de portada es la frontera de validez. Todo cambio posterior exige regenerar esta biblioteca y revisar los deltas.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
