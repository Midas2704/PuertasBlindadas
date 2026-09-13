# Sistema Financiero — base I2

La carpeta `CODIGO` del proyecto antiguo se adaptó directamente. Se conserva React, el sidebar, el dashboard, los formularios, las tablas y la estética naranja/negra. El recorrido Clientes → ficha financiera consulta PostgreSQL mediante la nueva fachada y Prisma.

## Ejecutar localmente

Requisitos comprobados: Node.js 25.9, PostgreSQL 18.3, dependencias fijadas por los dos `package-lock.json`. La migración inicial procede de PostgreSQL 18; otras versiones requieren comprobar su compatibilidad antes de importarla.

1. Instalar dependencias:

   ```powershell
   npm ci --prefix Controladores
   npm ci --prefix Vistas
   ```

2. Configurar `Controladores/.env` a partir de `.env.example`. La base PostgreSQL debe existir. Para una instalación vacía usar `?schema=public`, tal como indica el ejemplo. En la base antigua ya migrada se conserva su configuración existente: no cambiar dónde está el historial de migraciones. Las credenciales son locales y no se incluyen en Git.

3. Preparar Prisma, aplicar migraciones y cargar demostración:

   ```powershell
   .\db\setup.ps1
   ```

   En una base antigua sin historial Prisma, primero seguir el procedimiento de baseline descrito en `documentacion/ETAPA_1_I2.md`. No ejecutar los SQL históricos.

4. Iniciar cada componente en una terminal:

   ```powershell
   npm run dev --prefix Controladores
   npm run dev --prefix Vistas -- --host 127.0.0.1 --port 5174
   ```

Abrir [Inicio de sesión](http://127.0.0.1:5174/login). El frontend usa `/api/finanzas`; Vite lo deriva al backend local en el puerto 3000. La ejecución normal utiliza sesiones y permisos reales de M4, con cookie HttpOnly.

El seed M4 conserva las credenciales vigentes. Si la cuenta raíz todavía no tiene una, en desarrollo crea una credencial inicial usando `M4_CLAVE_INICIAL` o genera un secreto aleatorio y lo muestra una sola vez en consola. La política predeterminada bloquea al tercer intento durante 10 minutos; la sesión dura como máximo 60 minutos y vence tras 10 minutos de inactividad. La configuración completa está en `.env.example` y en [Estado técnico vigente](documentacion/ESTADO_TECNICO_VIGENTE.md).

### Aprovisionar la cuenta raíz en un servidor

Las migraciones no insertan usuarios ni contraseñas. Después de compilar el backend y aplicar las migraciones, ejecutar una vez `npm run db:provision-root --prefix Controladores` con `M4_CLAVE_RAIZ` en el entorno. El comando crea o actualiza de forma idempotente el empleado y usuario `20776101-k`, conserva una sola cuenta con protección de Administrador original, sincroniza la contraseña sólo cuando se invoca explícitamente e invalida sesiones anteriores si la credencial cambia. `M4_CORREO_RAIZ` permite asociar un correo real. Ninguna clave debe almacenarse en Git.

En el despliegue Docker, después de `prisma migrate deploy`, puede solicitarse la clave sin dejarla en el historial del shell:

```bash
read -rsp 'Clave raíz: ' M4_CLAVE_RAIZ; echo
docker compose exec -T -e M4_CLAVE_RAIZ="$M4_CLAVE_RAIZ" backend npm run db:provision-root
unset M4_CLAVE_RAIZ
```

## Comprobar la entrega

```powershell
npm run build --prefix Controladores
npm test --prefix Controladores
npm run build --prefix Vistas
```

Las pruebas requieren PostgreSQL disponible y el seed ejecutado. Crean sus propias cuentas y documentos de prueba y los eliminan al terminar. El test de compatibilidad de RUT con puntos sólo se aplica si hay registros heredados de ese tipo.

Buscar **Aurora** para revisar el ejemplo: saldo pendiente CLP 144.500, deuda vigente CLP 59.500, mora CLP 85.000 y saldo USD 750 separado. Buscar **Incompleto** para abrir la ficha de un B2C provisional sin RUT. El filtro Inactivos muestra el cliente ficticio inactivo. Las fechas relativas se fijan al crear el seed; la clasificación cambia naturalmente con el paso del tiempo.

El [estado técnico vigente](documentacion/ESTADO_TECNICO_VIGENTE.md) describe las reglas actuales. La [actualización M4](documentacion/DELTA_M4.md) y la [entrega de la primera etapa](documentacion/ETAPA_1_I2.md) se conservan como antecedentes históricos.
