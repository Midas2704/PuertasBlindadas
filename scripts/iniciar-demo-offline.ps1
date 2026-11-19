$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
Set-Location $raiz

$imagenes = @(
  'postgres:18',
  'pblindadas-source-backend:local',
  'pblindadas-source-frontend:local'
)

foreach ($imagen in $imagenes) {
  & docker image inspect $imagen *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Falta la imagen local $imagen. Prepárala antes de desconectarte de Internet."
  }
}

& docker compose --env-file .env -f docker-compose.local.yml -f docker-compose.source.yml up -d --no-build
if ($LASTEXITCODE -ne 0) { throw 'No fue posible iniciar la demostración local.' }

$puerto = '8081'
$lineaPuerto = Get-Content -LiteralPath .env | Where-Object { $_ -match '^LOCAL_FRONTEND_PORT=' } | Select-Object -Last 1
if ($lineaPuerto) { $puerto = ($lineaPuerto -split '=', 2)[1].Trim() }
$url = "http://127.0.0.1:$puerto/"

Write-Host ''
Write-Host 'Demostración local iniciada sin construir ni descargar imágenes.' -ForegroundColor Green
Write-Host "Aplicación: $url"
Write-Host "Monitor: ${url}demostracion-tecnica"
Write-Host 'Acceso demo: 20776101-K / Demo##Puertas2026'
