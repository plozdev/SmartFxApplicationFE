@echo off
REM SmartFX Quick Start Script for Windows
REM Starts both backend and frontend services

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo   SmartFX Application - Quick Start
echo ==========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [+] Node.js found: !NODE_VERSION!
) else (
    echo [!] Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

REM Check Java
where java >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('java -version 2^>^&1 ^| findstr /R "version"') do set JAVA_VERSION=%%i
    echo [+] Java found: !JAVA_VERSION!
) else (
    echo [!] Java not found. Please install Java 25+
    pause
    exit /b 1
)

echo.
echo Setup Options:
echo 1) Start Frontend + Backend (Docker Compose)
echo 2) Start Frontend Only
echo 3) Start Backend Only
echo 4) Install Dependencies
echo.

set /p option="Select option (1-4): "

if "%option%"=="1" (
    echo.
    echo [*] Starting both services with Docker Compose...
    echo.
    
    where docker >nul 2>nul
    if %ERRORLEVEL% NEQ 0 (
        echo [!] Docker not found. Please install Docker Desktop
        pause
        exit /b 1
    )
    
    docker-compose up --build
    
) else if "%option%"=="2" (
    echo.
    echo [*] Starting Frontend service...
    echo.
    
    if not exist .env (
        echo [*] Creating .env file from .env.example...
        copy .env.example .env
    )
    
    if not exist node_modules (
        echo [*] Installing dependencies...
        call npm install
    )
    
    echo [+] Starting frontend on http://localhost:3000
    echo.
    echo [*] Make sure backend is running on http://localhost:8080
    echo.
    
    call npm run dev
    
) else if "%option%"=="3" (
    echo.
    echo [*] Starting Backend service...
    echo.
    
    set BACKEND_PATH=..\SmartFXApplication
    
    if not exist "!BACKEND_PATH!" (
        echo [!] Backend directory not found at: !BACKEND_PATH!
        echo Please ensure backend is at: D:\SpringProjects\SmartFXApplication
        pause
        exit /b 1
    )
    
    cd /d "!BACKEND_PATH!"
    
    echo [+] Starting backend on http://localhost:8080
    echo.
    echo [*] API Docs available at: http://localhost:8080/swagger-ui.html
    echo.
    
    if exist mvnw.cmd (
        call mvnw.cmd spring-boot:run
    ) else (
        call mvn spring-boot:run
    )
    
) else if "%option%"=="4" (
    echo.
    echo [*] Installing Frontend dependencies...
    echo.
    call npm install
    echo [+] Dependencies installed
    echo.
    echo [*] Run 'npm run dev' to start frontend
    
) else (
    echo [!] Invalid option
    pause
    exit /b 1
)

pause
