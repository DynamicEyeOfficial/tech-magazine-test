param(
  [Parameter(Mandatory=$true)][string]$HostName,
  [string]$User = "root",
  [string]$RemoteDir = "/opt/tech-magazine",
  [string]$EnvFile = ".env.staging"
)

$ErrorActionPreference = "Stop"

if (!(Test-Path $EnvFile)) {
  throw "Missing $EnvFile. Copy .env.staging.example to $EnvFile and fill SITE_URL plus private keys first."
}

$archive = Join-Path $env:TEMP "tech-magazine-staging.tar.gz"
if (Test-Path $archive) { Remove-Item $archive -Force }

$exclude = @(
  "--exclude=.git",
  "--exclude=node_modules",
  "--exclude=data",
  "--exclude=backups",
  "--exclude=screenshots",
  "--exclude=server-out.log",
  "--exclude=server-err.log",
  "--exclude=.env",
  "--exclude=.env.production",
  "--exclude=.env.staging"
)

tar @exclude -czf $archive .

$target = "$User@$HostName"
Get-Content scripts/staging-vps-bootstrap.sh -Raw | ssh $target "bash -s"
ssh $target "mkdir -p $RemoteDir"
scp $archive "${target}:/tmp/tech-magazine-staging.tar.gz"
scp $EnvFile "${target}:$RemoteDir/.env.staging"
ssh $target "cd $RemoteDir && tar -xzf /tmp/tech-magazine-staging.tar.gz && docker compose -f docker-compose.staging.yml up --build -d && docker compose -f docker-compose.staging.yml ps"

Write-Host "Staging deploy complete. Test: http://$HostName/api/health"
