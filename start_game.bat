@echo off
title Kobe Study Game
cd /d "%~dp0"
echo ===================================================
echo   Starting Kobe Study Game Dev Server...
echo   Default Model: DeepSeek V4 Flash
echo ===================================================
npm run dev -- --open
if %errorlevel% neq 0 (
  npx vite --open
)
pause
