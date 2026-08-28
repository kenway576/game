@echo off
title Kobe Study Game - Visual Novel
cd /d "%~dp0"

echo ===================================================
echo   Starting Kobe Study Game Dev Server...
echo   Default Model: DeepSeek V4 Flash (Economical)
echo ===================================================

set "PATH=C:\Users\adm\node-portable\node-v24.19.0-win-x64;%PATH%"

call npm run dev -- --open

pause
