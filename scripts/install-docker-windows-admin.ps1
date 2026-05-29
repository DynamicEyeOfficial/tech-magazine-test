$ErrorActionPreference = "Stop"

$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(
  [Security.Principal.WindowsBuiltInRole]::Administrator
)

if (-not $isAdmin) {
  Write-Host "Please run this script from an Administrator PowerShell window."
  Write-Host "Right-click PowerShell, choose Run as administrator, then run:"
  Write-Host "  powershell -ExecutionPolicy Bypass -File scripts\\install-docker-windows-admin.ps1"
  exit 1
}

Write-Host "Installing Windows Subsystem for Linux support..."
wsl --install --no-distribution

Write-Host "Installing Docker Desktop..."
winget install --id Docker.DockerDesktop -e --accept-package-agreements --accept-source-agreements

Write-Host ""
Write-Host "Docker setup command finished."
Write-Host "If Windows asks for a restart, restart the PC before running Docker tests."
Write-Host "After restart, open Docker Desktop once, wait until it says Running, then run:"
Write-Host "  docker compose --profile proxy up --build"
