@echo off
echo Starting Monitoring Application...

:: Start Backend Server
start "Monitoring Server" cmd /k "cd server && node index.js"

:: Start Frontend Application
start "Monitoring Frontend" cmd /k "npm run dev"

echo Application started!
echo Server: http://localhost:3001
echo Frontend: http://localhost:5173 (usually)
pause
