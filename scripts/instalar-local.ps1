[CmdletBinding()]
param(
  [ValidateSet('runtime','source')]
  [string]$Modo = 'runtime',
  [string]$DirectorioImagenes
)

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$compose = Join-Path $raiz 'docker-compose.local.yml'
$composeSource = Join-Path $raiz 'docker-compose.source.yml'
$archivoEnv = Join-Path $raiz '.env'

function Exigir-Comando([string]$nombre) {
  if (-not (Get-Command $nombre -ErrorAction SilentlyContinue)) {
    throw "No se encontró $nombre. Instale Docker Desktop y Git para Windows."
  }
}

Exigir-Comando docker
docker info *> $null
if ($LASTEXITCODE -ne 0) { throw 'Docker Desktop está instalado, pero su motor no está disponible.' }

if (-not (Test-Path -LiteralPath $archivoEnv)) {
  $bytes = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
  $clave = [Convert]::ToBase64String($bytes).Replace('/','_').Replace('+','-')
  @"
LOCAL_POSTGRES_USER=pblindadas_local
LOCAL_POSTGRES_PASSWORD=$clave
LOCAL_POSTGRES_DB=pblindadas_local
LOCAL_BACKEND_PORT=3001
LOCAL_FRONTEND_PORT=8081
"@ | Set-Content -LiteralPath $archivoEnv -Encoding utf8NoBOM
  Write-Host 'Se creó .env con una clave local aleatoria. El archivo está excluido de Git.'
}

if ($Modo -eq 'runtime') {
  if (-not $DirectorioImagenes) { throw 'Indique -DirectorioImagenes con los dos archivos .tar.gz recuperados del VPS.' }
  $backend = Join-Path $DirectorioImagenes 'codigo-backend-f54c8c78.tar.gz'
  $frontend = Join-Path $DirectorioImagenes 'codigo-frontend-0ecacbd1.tar.gz'
  foreach ($archivo in @($backend,$frontend)) {
    if (-not (Test-Path -LiteralPath $archivo)) { throw "No existe $archivo" }
    docker load --input $archivo
    if ($LASTEXITCODE -ne 0) { throw "No se pudo cargar $archivo" }
  }
  $backendId = (docker image inspect codigo-backend:latest --format '{{.Id}}').Trim()
  $frontendId = (docker image inspect codigo-frontend:latest --format '{{.Id}}').Trim()
  $backendEsperado = 'sha256:f54c8c78ebd572b30aa7852d75d95be892e22eaef8da811558cd38b84636a839'
  $frontendEsperado = 'sha256:0ecacbd1e78c552f6c1f387be6409b2aad9766a496f7725eb7fe8d6e4f6007de'
  if ($backendId -ne $backendEsperado) { throw "IMAGE ID backend inesperado: $backendId" }
  if ($frontendId -ne $frontendEsperado) { throw "IMAGE ID frontend inesperado: $frontendId" }
  docker tag $backendId pblindadas-recovery-backend:f54c8c78
  docker tag $frontendId pblindadas-recovery-frontend:0ecacbd1
} else {
  docker compose --env-file $archivoEnv -f $compose -f $composeSource build
  if ($LASTEXITCODE -ne 0) { throw 'Falló la construcción desde código fuente.' }
}

docker compose --env-file $archivoEnv -f $compose up -d postgres
if ($LASTEXITCODE -ne 0) { throw 'No se pudo iniciar PostgreSQL local.' }
Write-Host 'Preparación completada. Restaure ahora la base con scripts/restaurar-base-local.ps1.'
