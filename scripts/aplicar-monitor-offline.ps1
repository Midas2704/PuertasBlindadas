[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$compose = Join-Path $raiz 'docker-compose.local.yml'
$archivoEnv = Join-Path $raiz '.env'

function Exigir-Imagen([string]$imagen) {
  cmd /c "docker image inspect $imagen >nul 2>nul"
  if ($LASTEXITCODE -ne 0) {
    throw "No existe la imagen local $imagen. No se intento descargar nada."
  }
}

function Fijar-Variable([string]$contenido, [string]$nombre, [string]$valor) {
  $patron = "(?m)^$([regex]::Escape($nombre))=.*$"
  if ([regex]::IsMatch($contenido, $patron)) {
    return [regex]::Replace($contenido, $patron, "$nombre=$valor")
  }
  return $contenido.TrimEnd() + "`r`n$nombre=$valor`r`n"
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw 'Docker Desktop no esta instalado o no esta disponible.'
}
cmd /c "docker info >nul 2>nul"
if ($LASTEXITCODE -ne 0) { throw 'Inicie Docker Desktop antes de continuar.' }

Exigir-Imagen 'pblindadas-source-backend:local'
Exigir-Imagen 'pblindadas-source-frontend:local'
Exigir-Imagen 'postgres:18'

Write-Host 'Creando backend del monitor desde la imagen local...'
docker build --pull=false -f (Join-Path $raiz 'CODIGO\Controladores\Dockerfile.demo-offline') -t pblindadas-demo-backend:local (Join-Path $raiz 'CODIGO\Controladores')
if ($LASTEXITCODE -ne 0) { throw 'No se pudo crear la imagen local del backend.' }

Write-Host 'Creando frontend del monitor desde la imagen local...'
docker build --pull=false -f (Join-Path $raiz 'CODIGO\Vistas\Dockerfile.demo-offline') -t pblindadas-demo-frontend:local (Join-Path $raiz 'CODIGO\Vistas')
if ($LASTEXITCODE -ne 0) { throw 'No se pudo crear la imagen local del frontend.' }

if (-not (Test-Path -LiteralPath $compose)) { throw "No existe $compose" }
Copy-Item -LiteralPath $compose -Destination "$compose.antes-monitor.bak" -Force
$contenidoCompose = Get-Content -LiteralPath $compose -Raw
$contenidoCompose = $contenidoCompose.Replace('pblindadas-recovery-backend:f54c8c78', 'pblindadas-demo-backend:local')
$contenidoCompose = $contenidoCompose.Replace('pblindadas-source-backend:local', 'pblindadas-demo-backend:local')
$contenidoCompose = $contenidoCompose.Replace('pblindadas-recovery-frontend:0ecacbd1', 'pblindadas-demo-frontend:local')
$contenidoCompose = $contenidoCompose.Replace('pblindadas-source-frontend:local', 'pblindadas-demo-frontend:local')
[IO.File]::WriteAllText($compose, $contenidoCompose, (New-Object Text.UTF8Encoding($false)))

if (-not (Test-Path -LiteralPath $archivoEnv)) {
  throw 'No existe el archivo .env de la instalacion local.'
}
$contenidoEnv = Get-Content -LiteralPath $archivoEnv -Raw
$contenidoEnv = Fijar-Variable $contenidoEnv 'MODO_DEMOSTRACION' 'true'
$contenidoEnv = Fijar-Variable $contenidoEnv 'VITE_MODO_DEMOSTRACION' 'true'
[IO.File]::WriteAllText($archivoEnv, $contenidoEnv, (New-Object Text.UTF8Encoding($false)))

docker compose --env-file $archivoEnv -f $compose up -d --no-build --force-recreate
if ($LASTEXITCODE -ne 0) { throw 'No se pudieron iniciar los contenedores del monitor.' }

$puerto = '8081'
$coincidencia = [regex]::Match($contenidoEnv, '(?m)^LOCAL_FRONTEND_PORT=(\d+)\s*$')
if ($coincidencia.Success) { $puerto = $coincidencia.Groups[1].Value }

docker compose --env-file $archivoEnv -f $compose ps
Write-Host ''
Write-Host 'Monitor instalado sin descargar imagenes y sin modificar la base de datos.' -ForegroundColor Green
Write-Host "Aplicacion: http://127.0.0.1:$puerto/"
Write-Host "Monitor:    http://127.0.0.1:$puerto/demostracion-tecnica"
