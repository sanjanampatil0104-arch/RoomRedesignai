@echo off
title RoomRedesign AI - Launching Platform
echo ===================================================
echo       RoomRedesign AI - Starting Services
echo ===================================================

echo [1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "RoomRedesign Backend" cmd /k "python -m uvicorn backend.main:app --port 8000 --host 0.0.0.0"

echo [2/2] Starting Vite Frontend on http://127.0.0.1:5173 ...
cd frontend
start "RoomRedesign Frontend" cmd /k "npm run dev -- --host 0.0.0.0 --port 5173"
cd ..

echo.
echo All services launched!
echo Opening browser to http://127.0.0.1:5173 ...
timeout /t 3 >nul
start http://127.0.0.1:5173/redesign

echo ===================================================
echo Platform is active! Keep the terminal windows open.
echo ===================================================
