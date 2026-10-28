Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "      RoomRedesign AI - Starting Services" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

Write-Host "`n[1/2] Launching Backend on http://127.0.0.1:8000 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.main:app --port 8000 --host 0.0.0.0"

Write-Host "[2/2] Launching Frontend on http://127.0.0.1:5173 ..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm.cmd run dev -- --host 0.0.0.0 --port 5173"

Start-Sleep -Seconds 3
Start-Process "http://127.0.0.1:5173/redesign"
Write-Host "`nPlatform launched in your browser!" -ForegroundColor Green
