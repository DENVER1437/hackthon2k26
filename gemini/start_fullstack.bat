@echo off
echo ===============================
echo Starting SmartContainer System
echo ===============================

REM Navigate to project folder
cd /d "d:\hackmind project"

echo Starting React Dashboard...
start cmd /k "npm run dev"

echo Starting FastAPI Backend...
start cmd /k "cd backend && uvicorn main:app --reload"

echo Opening browser...
timeout /t 1 >nul
start http://localhost:5173

echo System started successfully!
pause
