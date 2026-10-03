@echo off
chcp 65001 >nul
title KobeStudy - 游戏服务器（关掉这个窗口 = 关掉游戏）
cd /d "%~dp0"

set "PATH=C:\Program Files\nodejs;%PATH%"
set "GAME_URL=http://localhost:3000"

echo ===================================================
echo   KobeStudy: Persona Learner
echo   存档位置: %USERPROFILE%\Saved Games\KobeStudy
echo ===================================================

rem 已经开着了？直接打开浏览器，不再起第二个（端口固定是 3000，起第二个会报错）
curl -s -o nul --max-time 2 %GAME_URL%
if %errorlevel%==0 (
  echo 游戏已经在运行，正在打开浏览器……
  start "" %GAME_URL%
  timeout /t 2 >nul
  exit /b 0
)

if not exist "node_modules" (
  echo 第一次运行，正在安装依赖（只需要一次）……
  call npm install
)

echo 正在启动游戏，浏览器会自动打开。玩的时候请不要关闭这个窗口。
call npm run dev -- --open

pause
