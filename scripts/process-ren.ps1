$sourceJpg = "C:\Users\adm\.gemini\antigravity\brain\7067a92b-54aa-4bc9-bfc4-aa9a64f16b16\ren_sorcerer_laugh_1787932994477.jpg"
$destPng = "f:\kobe study game\game-main\public\images\characters\ren\sorcerer_laugh.png"

Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::FromFile($sourceJpg)

# Clear any text box in top-left corner (first 150px height x 300px width) by setting to white before transparent removal
for ($y = 0; $y -lt 150; $y++) {
    for ($x = 0; $x -lt 300; $x++) {
        $bmp.SetPixel($x, $y, [System.Drawing.Color]::White)
    }
}

$bmp.Save($destPng, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()

& "C:\Users\adm\node-portable\node-v24.19.0-win-x64\node.exe" scripts/remove-white-bg.mjs ren 230 45 sorcerer_laugh
