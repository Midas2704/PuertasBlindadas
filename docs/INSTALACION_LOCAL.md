# Instalación local de Puertas Blindadas

## Requisitos

- Windows 10 u 11 de 64 bits.
- Docker Desktop con motor Linux operativo.
- WSL 2 habilitado cuando Docker Desktop lo requiera.
- Git para Windows, que proporciona OpenSSL.
- Al menos 10 GB libres para imágenes, base y compilaciones.

El entorno local no reutiliza credenciales del VPS. La red Docker está marcada como interna y no configura correo, almacenamiento S3/R2, Clouding ni servicios bancarios productivos.

## Modo fiel al VPS

1. Clone este repositorio.
2. Obtenga por el canal seguro autorizado los dos archivos de imagen y el respaldo cifrado. No los copie dentro del repositorio.
3. Abra PowerShell en la raíz del repositorio.
4. Prepare las imágenes y PostgreSQL:

```powershell
.\scripts\instalar-local.ps1 -Modo runtime -DirectorioImagenes 'D:\Respaldo\imagenes'
```

5. Restaure la base:

```powershell
.\scripts\restaurar-base-local.ps1 `
  -RespaldoCifrado 'D:\Respaldo\base-datos\pblindadas-database-backup.tar.gz.enc' `
  -ArchivoClave 'E:\Claves\database-package.key' `
  -ConfirmarSobrescritura
```

6. Verifique:

```powershell
.\scripts\verificar-instalacion.ps1
```

Abra `http://127.0.0.1:8081/`.

## Compilación desde código fuente

Para comprobar que el código recuperado sigue construyendo una versión equivalente:

```powershell
.\scripts\instalar-local.ps1 -Modo source
docker compose --env-file .env -f docker-compose.local.yml -f docker-compose.source.yml up -d
```

## Detener e iniciar

```powershell
docker compose --env-file .env -f docker-compose.local.yml stop
docker compose --env-file .env -f docker-compose.local.yml start
```

No use `down -v` salvo que desee eliminar deliberadamente la base local.
