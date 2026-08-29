# ==============================================================================
# Auto Sync Watcher for Kobe Study Game
# Automatically detects file changes and pushes them to GitHub in real time
# ==============================================================================

param (
    [int]$DebounceSeconds = 6,
    [string]$RemoteBranch = "main"
)

$WorkspaceDir = $PSScriptRoot
Set-Location -Path $WorkspaceDir

# Set console title and UTF-8 output
$Host.UI.RawUI.WindowTitle = "Game Auto-Sync Watcher -> GitHub ($RemoteBranch)"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host " [Auto-Sync] GitHub Realtime Synchronization Service Started" -ForegroundColor Green
Write-Host " Workspace : $WorkspaceDir" -ForegroundColor White
Write-Host " Target    : https://github.com/kenway576/game.git ($RemoteBranch)" -ForegroundColor White
Write-Host " Debounce  : $DebounceSeconds seconds" -ForegroundColor White
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "Watching for changes... (Press Ctrl+C to stop)`n" -ForegroundColor Yellow

$global:hasChanges = $false
$global:lastChangeTime = [DateTime]::MinValue

# Initialize FileSystemWatcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $WorkspaceDir
$watcher.IncludeSubdirectories = $true
$watcher.EnableRaisingEvents = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]'FileName, LastWrite, DirectoryName, Size'

# Filter to ignore git internal directories and temporary files
$ignorePatterns = @('\.git', 'node_modules', '\.tmp', '~$', '\.lock', 'dist', '\.swp', '\.env\.local')

$changeAction = {
    param($source, $eventArgs)
    $path = $eventArgs.FullPath
    
    foreach ($pattern in $ignorePatterns) {
        if ($path -match $pattern) { return }
    }
    
    $global:hasChanges = $true
    $global:lastChangeTime = [DateTime]::Now
    Write-Host "[Change Detected] $($eventArgs.ChangeType): $($eventArgs.Name) ($([DateTime]::Now.ToString('HH:mm:ss')))" -ForegroundColor DarkGray
}

Register-ObjectEvent $watcher 'Changed' -Action $changeAction | Out-Null
Register-ObjectEvent $watcher 'Created' -Action $changeAction | Out-Null
Register-ObjectEvent $watcher 'Deleted' -Action $changeAction | Out-Null
Register-ObjectEvent $watcher 'Renamed' -Action $changeAction | Out-Null

function Perform-Sync {
    try {
        # Check git status
        $status = git status --porcelain
        if (-not $status) {
            Write-Host "[Info] No actual git differences detected. Skipping commit." -ForegroundColor DarkGray
            return
        }

        $now = [DateTime]::Now.ToString("yyyy-MM-dd HH:mm:ss")
        Write-Host "`n--------------------------------------------------" -ForegroundColor Cyan
        Write-Host "[Syncing] Staging and committing changes ($now)..." -ForegroundColor Cyan

        # Remove stale index lock if any
        $lockFile = Join-Path $WorkspaceDir ".git\index.lock"
        if (Test-Path $lockFile) {
            Remove-Item -Force $lockFile -ErrorAction SilentlyContinue
        }

        git add -A
        $commitMessage = "Auto-sync: update game files ($now)"
        git commit -m "$commitMessage"

        Write-Host "[Syncing] Pushing to origin $RemoteBranch..." -ForegroundColor Yellow
        $pushOutput = git push origin $RemoteBranch 2>&1

        if ($LASTEXITCODE -eq 0) {
            Write-Host "[Success] Synced successfully to GitHub ($now)!" -ForegroundColor Green
        } else {
            Write-Host "[Warning] Push returned exit code $LASTEXITCODE. Output:" -ForegroundColor Red
            Write-Host $pushOutput -ForegroundColor Red
        }
        Write-Host "--------------------------------------------------`n" -ForegroundColor Cyan
    } catch {
        Write-Host "[Error] Exception occurred during sync: $_" -ForegroundColor Red
    }
}

# Main polling loop (debouncer)
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        if ($global:hasChanges) {
            $elapsed = ([DateTime]::Now - $global:lastChangeTime).TotalSeconds
            if ($elapsed -ge $DebounceSeconds) {
                $global:hasChanges = $false
                Perform-Sync
            }
        }
    }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "`n[Stopped] Auto-Sync Watcher has been stopped." -ForegroundColor Red
}
