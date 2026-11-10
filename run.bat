@echo off

cd /d "%~dp0"

start "Auth Service" cmd /k "cd backend\auth-service && node src\authserver.js"
start "Service" cmd /k "cd backend\service && node src\server.js"
start "Gateway" cmd /k "cd backend\gateway && node src\gateway.js"
start "Wanted-Service" cmd /k "cd backend\wanted-service && (py -3 src\server.py || python src\server.py)"
pause