[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot

foreach ($comando in @('docker','git')) {
  if (-not (Get-Command $comando -ErrorAction SilentlyContinue)) {
    throw "No se encontró $comando. Instale Docker Desktop (con WSL 2) y Git para Windows."
  }
}
docker info *> $null
if ($LASTEXITCODE -ne 0) { throw 'Docker Desktop está instalado, pero su motor no está disponible.' }

& (Join-Path $PSScriptRoot 'instalar-local.ps1') -Modo source
& (Join-Path $PSScriptRoot 'restaurar-base-demo.ps1') -ConfirmarSobrescritura

Write-Host ''
Write-Host 'Instalación académica completada.'
Write-Host 'Acceso: 20776101-K (cuenta Midas)'
Write-Host 'Contraseña: Demo##Puertas2026'
Write-Host 'URL: http://127.0.0.1:8081/'
