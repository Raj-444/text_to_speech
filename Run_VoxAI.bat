@echo off
cd /d "%~dp0"
echo Launching VoxAI Studio...
start http://localhost:5173/
npm run dev
pause
