# Sync to GitHub PowerShell Script
Param(
    [string]$Message = "Auto sync: update project files"
)

Write-Host "=== Starting GitHub Sync ===" -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot

$status = git status --porcelain
if (-not $status) {
    Write-Host "No local changes detected. Workspace is clean." -ForegroundColor Green
    exit 0
}

Write-Host "Detected changes, staging files..." -ForegroundColor Yellow
git add -A

Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m "$Message"

Write-Host "Pushing to https://github.com/kenway576/game.git (main)..." -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "=== Successfully synced to GitHub! ===" -ForegroundColor Green
} else {
    Write-Host "Sync failed. Please check network connection or GitHub credentials." -ForegroundColor Red
}
