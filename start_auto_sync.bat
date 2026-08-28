@echo off
title Game GitHub Auto Sync Watcher
cd /d "%~dp0"
echo ===================================================
echo   Starting Kobe Study Game Auto-Sync Watcher...
echo ===================================================
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0auto_sync_watcher.ps1"
pause
