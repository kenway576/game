param (
    [string]$SourceJpg,
    [string]$TargetChar,
    [string]$TargetName
)

$destDir = "f:\kobe study game\game-main\public\images\characters\$TargetChar"
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }
$destPng = Join-Path $destDir "$TargetName.png"

Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile($SourceJpg)
$bmp.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

& "C:\Users\adm\node-portable\node-v24.19.0-win-x64\node.exe" scripts/remove-white-bg.mjs $TargetChar 230 45 $TargetName
Write-Host "Processed and saved to $destPng" -ForegroundColor Green
