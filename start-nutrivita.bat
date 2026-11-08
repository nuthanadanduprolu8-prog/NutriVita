@echo off
title NutriVita App Launcher
echo ===================================================
echo           Starting NutriVita Platform
echo ===================================================
echo.
echo 1. Starting Backend Server on port 5000...
start "NutriVita Backend" cmd /k "cd server && node server.js"

echo 2. Starting Frontend on port 3000...
start "NutriVita Frontend" cmd /k "cd client && npm run dev"

echo.
echo ===================================================
echo NutriVita is running!
echo Open your browser at: http://localhost:3000
echo ===================================================
pause
