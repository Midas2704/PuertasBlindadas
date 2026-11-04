# Manual de usuarios por rol

**Proyecto:** Puertas Blindadas
**Documento:** 05
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

## Matriz de roles
| Rol | Objetivo | Restriccion central |
| --- | --- | --- |
| Gerencia | Aprobar, supervisar y consultar informacion gerencial | No equivale automaticamente a Administrador |
| Administrador | Administrar capacidades autorizadas | No puede saltar integridad, estado ni auditoria |
| Secretaria | Operar flujos administrativos asignados | Alcance definido por perfil y CU |
| Contador | Operar y consultar procesos financieros | Sin permisos administrativos implicitos |
| Terreno | Agenda, visitas, instalaciones y rectificaciones asignadas | Alcance por empleado cuando aplica |
| Produccion | Ejecutar y validar tareas liberadas | No libera rectificaciones sin autorizacion |
| Personalizado | Conjunto particular de CU registrados | Configuracion particular no debe inventar bypass |
| Midas raiz | Cuenta interna raiz con todos los CU activos aprobados | CU377 sigue excluido; tampoco evita antivirus, integridad o M9 |
## Gerencia
**Objetivo:** Aprobar, supervisar y consultar informacion gerencial.
**Restriccion:** No equivale automaticamente a Administrador.
### Responsabilidades
Revisar pendientes propios, ejecutar operaciones dentro del alcance, verificar resultados, corregir datos solo mediante el flujo autorizado y escalar inconsistencias con evidencia.
### Pantallas y acciones
Las pantallas se habilitan por CU efectivo. Consultar el Documento 06 para el detalle CU -> pantalla -> endpoint. Ver un menu no garantiza poder ejecutar una escritura.
### Jornada de ejemplo
1. Iniciar sesion y confirmar identidad.
2. Revisar bandejas asignadas.
3. Procesar una entidad a la vez.
4. Confirmar estados y documentos.
5. Revisar mensajes de error.
6. Cerrar sesion si se usa un equipo compartido.
### Controles
No compartir cuenta, no elevar permisos informalmente, no modificar historicos y no saltar estados. Los permisos particulares se registran; los controles de integridad siguen aplicando.
## Administrador
**Objetivo:** Administrar capacidades autorizadas.
**Restriccion:** No puede saltar integridad, estado ni auditoria.
### Responsabilidades
Revisar pendientes propios, ejecutar operaciones dentro del alcance, verificar resultados, corregir datos solo mediante el flujo autorizado y escalar inconsistencias con evidencia.
### Pantallas y acciones
Las pantallas se habilitan por CU efectivo. Consultar el Documento 06 para el detalle CU -> pantalla -> endpoint. Ver un menu no garantiza poder ejecutar una escritura.
### Jornada de ejemplo
1. Iniciar sesion y confirmar identidad.
2. Revisar bandejas asignadas.
3. Procesar una entidad a la vez.
4. Confirmar estados y documentos.
5. Revisar mensajes de error.
6. Cerrar sesion si se usa un equipo compartido.
### Controles
No compartir cuenta, no elevar permisos informalmente, no modificar historicos y no saltar estados. Los permisos particulares se registran; los controles de integridad siguen aplicando.
## Secretaria
**Objetivo:** Operar flujos administrativos asignados.
**Restriccion:** Alcance definido por perfil y CU.
### Responsabilidades
Revisar pendientes propios, ejecutar operaciones dentro del alcance, verificar resultados, corregir datos solo mediante el flujo autorizado y escalar inconsistencias con evidencia.
### Pantallas y acciones
Las pantallas se habilitan por CU efectivo. Consultar el Documento 06 para el detalle CU -> pantalla -> endpoint. Ver un menu no garantiza poder ejecutar una escritura.
### Jornada de ejemplo
1. Iniciar sesion y confirmar identidad.
2. Revisar bandejas asignadas.
3. Procesar una entidad a la vez.
4. Confirmar estados y documentos.
5. Revisar mensajes de error.
6. Cerrar sesion si se usa un equipo compartido.
### Controles
No compartir cuenta, no elevar permisos informalmente, no modificar historicos y no saltar estados. Los permisos particulares se registran; los controles de integridad siguen aplicando.
## Contador
**Objetivo:** Operar y consultar procesos financieros.
**Restriccion:** Sin permisos administrativos implicitos.
### Responsabilidades
Revisar pendientes propios, ejecutar operaciones dentro del alcance, verificar resultados, corregir datos solo mediante el flujo autorizado y escalar inconsistencias con evidencia.
### Pantallas y acciones
Las pantallas se habilitan por CU efectivo. Consultar el Documento 06 para el detalle CU -> pantalla -> endpoint. Ver un menu no garantiza poder ejecutar una escritura.
### Jornada de ejemplo
1. Iniciar sesion y confirmar identidad.
2. Revisar bandejas asignadas.
3. Procesar una entidad a la vez.
4. Confirmar estados y documentos.
5. Revisar mensajes de error.
6. Cerrar sesion si se usa un equipo compartido.
### Controles
No compartir cuenta, no elevar permisos informalmente, no modificar historicos y no saltar estados. Los permisos particulares se registran; los controles de integridad siguen aplicando.
## Terreno
**Objetivo:** Agenda, visitas, instalaciones y rectificaciones asignadas.
**Restriccion:** Alcance por empleado cuando aplica.
### Responsabilidades
Revisar pendientes propios, ejecutar operaciones dentro del alcance, verificar resultados, corregir datos solo mediante el flujo autorizado y escalar inconsistencias con evidencia.
### Pantallas y acciones
Las pantallas se habilitan por CU efectivo. Consultar el Documento 06 para el detalle CU -> pantalla -> endpoint. Ver un menu no garantiza poder ejecutar una escritura.
### Jornada de ejemplo
1. Iniciar sesion y confirmar identidad.
2. Revisar bandejas asignadas.
3. Procesar una entidad a la vez.
4. Confirmar estados y documentos.
5. Revisar mensajes de error.
6. Cerrar sesion si se usa un equipo compartido.
### Controles
No compartir cuenta, no elevar permisos informalmente, no modificar historicos y no saltar estados. Los permisos particulares se registran; los controles de integridad siguen aplicando.
## Produccion
**Objetivo:** Ejecutar y validar tareas liberadas.
**Restriccion:** No libera rectificaciones sin autorizacion.
### Responsabilidades
Revisar pendientes propios, ejecutar operaciones dentro del alcance, verificar resultados, corregir datos solo mediante el flujo autorizado y escalar inconsistencias con evidencia.
### Pantallas y acciones
Las pantallas se habilitan por CU efectivo. Consultar el Documento 06 para el detalle CU -> pantalla -> endpoint. Ver un menu no garantiza poder ejecutar una escritura.
### Jornada de ejemplo
1. Iniciar sesion y confirmar identidad.
2. Revisar bandejas asignadas.
3. Procesar una entidad a la vez.
4. Confirmar estados y documentos.
5. Revisar mensajes de error.
6. Cerrar sesion si se usa un equipo compartido.
### Controles
No compartir cuenta, no elevar permisos informalmente, no modificar historicos y no saltar estados. Los permisos particulares se registran; los controles de integridad siguen aplicando.
## Personalizado
**Objetivo:** Conjunto particular de CU registrados.
**Restriccion:** Configuracion particular no debe inventar bypass.
### Responsabilidades
Revisar pendientes propios, ejecutar operaciones dentro del alcance, verificar resultados, corregir datos solo mediante el flujo autorizado y escalar inconsistencias con evidencia.
### Pantallas y acciones
Las pantallas se habilitan por CU efectivo. Consultar el Documento 06 para el detalle CU -> pantalla -> endpoint. Ver un menu no garantiza poder ejecutar una escritura.
### Jornada de ejemplo
1. Iniciar sesion y confirmar identidad.
2. Revisar bandejas asignadas.
3. Procesar una entidad a la vez.
4. Confirmar estados y documentos.
5. Revisar mensajes de error.
6. Cerrar sesion si se usa un equipo compartido.
### Controles
No compartir cuenta, no elevar permisos informalmente, no modificar historicos y no saltar estados. Los permisos particulares se registran; los controles de integridad siguen aplicando.
## Midas raiz
**Objetivo:** Cuenta interna raiz con todos los CU activos aprobados.
**Restriccion:** CU377 sigue excluido; tampoco evita antivirus, integridad o M9.
### Responsabilidades
Revisar pendientes propios, ejecutar operaciones dentro del alcance, verificar resultados, corregir datos solo mediante el flujo autorizado y escalar inconsistencias con evidencia.
### Pantallas y acciones
Las pantallas se habilitan por CU efectivo. Consultar el Documento 06 para el detalle CU -> pantalla -> endpoint. Ver un menu no garantiza poder ejecutar una escritura.
### Jornada de ejemplo
1. Iniciar sesion y confirmar identidad.
2. Revisar bandejas asignadas.
3. Procesar una entidad a la vez.
4. Confirmar estados y documentos.
5. Revisar mensajes de error.
6. Cerrar sesion si se usa un equipo compartido.
### Controles
No compartir cuenta, no elevar permisos informalmente, no modificar historicos y no saltar estados. Los permisos particulares se registran; los controles de integridad siguen aplicando.
## Diagnostico de acceso
Confirmar sesion, perfil, configuracion particular, CU efectivo, dependencia administrativa, alcance de empleado y estado de la entidad. Un administrador original conserva capacidades administrativas aprobadas, pero no puede omitir controles documentales.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
