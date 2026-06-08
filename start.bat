@echo off
title GameX Store - Servidor Chatbot
cd /d "%~dp0"

echo.
echo  ================================
echo   GameX Store - Chatbot Server
echo  ================================
echo.

REM Verificar si el puerto 8000 ya esta ocupado
netstat -an | find "127.0.0.1:8000" | find "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo  El servidor ya esta corriendo en http://127.0.0.1:8000
    echo  Abriendo el sitio...
    start "" "http://127.0.0.1:5501/index.html"
    goto :fin
)

echo  Iniciando servidor en http://127.0.0.1:8000
echo  Pulsa CTRL+C para detener.
echo.

REM Lanzar servidor en segundo plano
start /min "" cmd /c "python -m uvicorn main:app --host 127.0.0.1 --port 8000"

REM Esperar 2 segundos y abrir el navegador
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5501/index.html"

echo  Servidor activo. Esta ventana puede cerrarse.
:fin
timeout /t 3 /nobreak >nul
