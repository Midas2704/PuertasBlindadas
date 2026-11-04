# Flujos de datos end-to-end

**Proyecto:** Puertas Blindadas
**Documento:** 26
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

## Patron comun
```text
Usuario -> Vista -> API -> Ruta -> C_Finanzas -> Controlador -> Prisma -> PostgreSQL
                                                     -> M9 -> Respuesta
```
## Login
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Crear cliente
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Crear cotizacion
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Preview PDF
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Emitir
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Aceptar B2B
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Aceptar B2C
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Crear NV
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Crear OT
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Rectificar
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Liberar a produccion
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Registrar pago
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Publicar documento
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.
## Auditoria
1. La persona inicia una accion visible.
2. React valida formato basico y envia datos.
3. La ruta autentica y delega.
4. M4 verifica CU/alcance.
5. El controlador valida estado y reglas.
6. Prisma lee/escribe en transaccion cuando corresponde.
7. M9 registra el hecho confirmado.
8. La respuesta actualiza la pantalla.
**Puntos de fallo:** sesion, permiso, validacion, conflicto de revision, constraint, dependencia externa y auditoria. El sistema no debe presentar exito si un paso obligatorio falla.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
