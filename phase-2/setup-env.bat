@echo off
REM ============================================================================
REM Environment Setup Script for Phase-2 (Windows)
REM ============================================================================
REM This script helps you set up .env files for backend and frontend
REM Usage: setup-env.bat
REM ============================================================================

echo ======================================
echo Phase-2 Environment Setup (Windows)
echo ======================================
echo.

REM ============================================================================
REM Step 1: Check if we're in the correct directory
REM ============================================================================
if not exist "backend\" (
    echo [ERROR] Backend directory not found!
    echo Please run this script from the phase-2 directory
    echo Usage: cd phase-2 ^&^& setup-env.bat
    pause
    exit /b 1
)

if not exist "frontend\" (
    echo [ERROR] Frontend directory not found!
    echo Please run this script from the phase-2 directory
    pause
    exit /b 1
)

echo [OK] Current directory verified
echo.

REM ============================================================================
REM Step 2: Backend .env Setup
REM ============================================================================
echo ============================================
echo Step 1: Backend Environment Setup
echo ============================================
echo.

if exist "backend\.env" (
    echo [WARNING] backend\.env already exists
    set /p "overwrite=Do you want to overwrite it? (y/N): "
    if /i not "%overwrite%"=="y" (
        echo Skipping backend .env creation
        goto :frontend_setup
    )
)

copy /Y "backend\.env.example" "backend\.env" >nul
echo [OK] backend\.env created from .env.example
echo.

:frontend_setup
REM ============================================================================
REM Step 3: Generate JWT Secret Key
REM ============================================================================
echo ============================================
echo Step 2: Generate JWT Secret Key
echo ============================================
echo.

echo Generating secure JWT secret key...
echo.

REM Try to generate JWT key using Python
python -c "import secrets; print(secrets.token_urlsafe(32))" > temp_jwt.txt 2>nul

if %errorlevel% neq 0 (
    echo [WARNING] Python not found, using fallback method
    echo Please install Python 3 for secure key generation
    echo.
    echo Manual Step Required:
    echo 1. Visit: https://randomkeygen.com/
    echo 2. Copy a "CodeIgniter Encryption Key"
    echo 3. Open backend\.env in a text editor
    echo 4. Replace JWT_SECRET_KEY value with the copied key
    echo.
    pause
    goto :verify
)

set /p JWT_SECRET=<temp_jwt.txt
del temp_jwt.txt

echo [OK] JWT Secret Key generated:
echo %JWT_SECRET%
echo.

REM Update JWT_SECRET_KEY in backend\.env
powershell -Command "(Get-Content backend\.env) -replace 'JWT_SECRET_KEY=.*', 'JWT_SECRET_KEY=%JWT_SECRET%' | Set-Content backend\.env" 2>nul

if %errorlevel% neq 0 (
    echo [WARNING] Could not auto-update JWT_SECRET_KEY
    echo Please manually update JWT_SECRET_KEY in backend\.env with:
    echo %JWT_SECRET%
    echo.
) else (
    echo [OK] JWT_SECRET_KEY updated in backend\.env
    echo.
)

REM ============================================================================
REM Step 4: Frontend .env Setup
REM ============================================================================
echo ============================================
echo Step 3: Frontend Environment Setup
echo ============================================
echo.

if exist "frontend\.env" (
    echo [WARNING] frontend\.env already exists
    set /p "overwrite_fe=Do you want to overwrite it? (y/N): "
    if /i not "%overwrite_fe%"=="y" (
        echo Skipping frontend .env creation
        goto :verify
    )
)

copy /Y "frontend\.env.example" "frontend\.env" >nul
echo [OK] frontend\.env created from .env.example
echo.

:verify
REM ============================================================================
REM Step 5: Verify Setup
REM ============================================================================
echo ============================================
echo Step 4: Verification
echo ============================================
echo.

if exist "backend\.env" (
    echo [OK] backend\.env exists
) else (
    echo [ERROR] backend\.env not found
)

if exist "frontend\.env" (
    echo [OK] frontend\.env exists
) else (
    echo [ERROR] frontend\.env not found
)

echo.

REM ============================================================================
REM Step 6: Display Summary
REM ============================================================================
echo ============================================
echo Setup Complete!
echo ============================================
echo.
echo Environment files created:
echo   [OK] backend\.env
echo   [OK] frontend\.env
echo.

if defined JWT_SECRET (
    echo Generated JWT Secret Key:
    echo   %JWT_SECRET%
    echo.
)

echo [IMPORTANT] Security Notes:
echo   1. Never commit .env files to Git
echo   2. Keep your JWT_SECRET_KEY secure
echo   3. Change default database password for production
echo   4. Set DEBUG=false in production
echo.
echo Next Steps:
echo   1. Review backend\.env and update if needed
echo   2. Review frontend\.env and update if needed
echo   3. Start services with: docker-compose up -d
echo   4. Run migrations: docker-compose exec backend alembic upgrade head
echo.
echo For detailed instructions, see: ENV_SETUP_GUIDE.md
echo.
echo Happy coding! 🚀
echo.
pause
