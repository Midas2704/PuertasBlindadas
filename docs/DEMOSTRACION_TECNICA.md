# Demostración técnica local

El modo muestra el recorrido real de las solicitudes mediante trazas efímeras en memoria. No crea tablas, migraciones ni registros de trazabilidad pedagógica en PostgreSQL.

## Activación

Sólo para el equipo local de presentación:

```env
MODO_DEMOSTRACION=true
VITE_MODO_DEMOSTRACION=true
```

`MODO_DEMOSTRACION` habilita captura y SSE en backend. `VITE_MODO_DEMOSTRACION` incorpora la ruta y el acceso al monitor durante la compilación del frontend. Ambos valores deben permanecer en `false` fuera del entorno local.

## Inicio sin Internet

Con Docker Desktop iniciado:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\iniciar-demo-offline.ps1
```

El script exige las imágenes `postgres:18`, `pblindadas-source-backend:local` y `pblindadas-source-frontend:local`, y utiliza `--no-build` para impedir descargas o reconstrucciones accidentales.

En esta instalación:

- Aplicación: `http://127.0.0.1:8083/`
- Monitor: `http://127.0.0.1:8083/demostracion-tecnica`
- Acceso demo: `20776101-K` / `Demo##Puertas2026`

## Arquitectura

Cada solicitud recibe un identificador de correlación y atraviesa:

1. Interacción y vista React.
2. Cliente API común.
3. Ruta Express.
4. Autorización M4.
5. Controlador y reglas de negocio.
6. Prisma y PostgreSQL.
7. Productor M9 cuando la operación es auditable.
8. Respuesta HTTP y actualización de la vista.

Las consultas Prisma se observan mediante una extensión transversal. El servicio SSE conserva hasta 1.200 eventos en memoria y permite limpiarlos. Un reinicio del backend también elimina las trazas.

## Módulos

La clasificación automática cubre M1 a M9 e Inventario. Los dominios M10, M11 y M12 se presentan con su módulo funcional real y el controlador coordinador existente:

- M10: coordinado por `M7Controller`.
- M11 y M12: coordinados por `M2Controller`.
- Inventario: `MInventarioController`.

## Seguridad

- El monitor requiere una sesión M4 normal.
- No existe bypass de permisos.
- El canal SSE responde sólo con el modo local activado.
- El backend elimina secretos, tokens, cookies, RUT y correos de los textos publicados.
- No se envían cuerpos completos, cabeceras de autenticación, SQL identificable ni contenido documental.
- Los fragmentos de código pertenecen a un catálogo cerrado y no leen archivos solicitados por el navegador.

## Presentación

1. Iniciar sesión en la aplicación.
2. Abrir **Monitor técnico** en una segunda ventana.
3. Mantener el monitor visible y ejecutar una operación real en la primera ventana.
4. Usar los filtros por módulo, operación o solicitud para explicar el recorrido.
5. Mostrar un rechazo M4 con una cuenta sin permiso cuando corresponda; el sistema conserva el `403` real.
6. Limpiar el recorrido antes del siguiente flujo.

La pantalla permite pausar/reanudar la captura visual, mostrar u ocultar fragmentos, consultar errores y duraciones, y usar pantalla completa.
