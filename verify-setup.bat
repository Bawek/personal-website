@echo off
REM Quick verification script for Next.js + Vercel setup

echo ============================================
echo Next.js + Vercel Setup Verification
echo ============================================
echo.

set FRONTEND_DIR=frontend
set ERRORS=0

REM Check if frontend directory exists
if not exist "%FRONTEND_DIR%" (
    echo [X] Frontend directory not found!
    set /a ERRORS+=1
) else (
    echo [✓] Frontend directory exists
)

REM Check package.json
if not exist "%FRONTEND_DIR%\package.json" (
    echo [X] package.json not found!
    set /a ERRORS+=1
) else (
    echo [✓] package.json exists
)

REM Check next.config.js
if not exist "%FRONTEND_DIR%\next.config.js" (
    echo [X] next.config.js not found!
    set /a ERRORS+=1
) else (
    echo [✓] next.config.js exists
)

REM Check vercel.json
if not exist "%FRONTEND_DIR%\vercel.json" (
    echo [X] vercel.json not found!
    set /a ERRORS+=1
) else (
    echo [✓] vercel.json exists
)

REM Check .env.local
if not exist "%FRONTEND_DIR%\.env.local" (
    echo [!] .env.local not found - copy from .env.local.template
) else (
    echo [✓] .env.local exists
)

REM Check lib directory
if not exist "%FRONTEND_DIR%\lib" (
    echo [X] lib directory not found!
    set /a ERRORS+=1
) else (
    echo [✓] lib directory exists
)

REM Check db.js
if not exist "%FRONTEND_DIR%\lib\db.js" (
    echo [X] lib\db.js not found!
    set /a ERRORS+=1
) else (
    echo [✓] lib\db.js exists
)

REM Check api.js
if not exist "%FRONTEND_DIR%\lib\api.js" (
    echo [X] lib\api.js not found!
    set /a ERRORS+=1
) else (
    echo [✓] lib\api.js exists
)

REM Check middleware
if not exist "%FRONTEND_DIR%\lib\middleware\auth.js" (
    echo [X] lib\middleware\auth.js not found!
    set /a ERRORS+=1
) else (
    echo [✓] lib\middleware\auth.js exists
)

REM Check models
if not exist "%FRONTEND_DIR%\lib\models\User.js" (
    echo [X] lib\models\User.js not found!
    set /a ERRORS+=1
) else (
    echo [✓] lib\models\User.js exists
)

if not exist "%FRONTEND_DIR%\lib\models\Project.js" (
    echo [X] lib\models\Project.js not found!
    set /a ERRORS+=1
) else (
    echo [✓] lib\models\Project.js exists
)

REM Check API routes
if not exist "%FRONTEND_DIR%\pages\api\health.js" (
    echo [X] pages\api\health.js not found!
    set /a ERRORS+=1
) else (
    echo [✓] pages\api\health.js exists
)

if not exist "%FRONTEND_DIR%\pages\api\auth\login.js" (
    echo [X] pages\api\auth\login.js not found!
    set /a ERRORS+=1
) else (
    echo [✓] pages\api\auth\login.js exists
)

if not exist "%FRONTEND_DIR%\pages\api\projects\index.js" (
    echo [X] pages\api\projects\index.js not found!
    set /a ERRORS+=1
) else (
    echo [✓] pages\api\projects\index.js exists
)

echo.
echo ============================================

if %ERRORS% EQU 0 (
    echo [✓] All core files present!
    echo.
    echo Next steps:
    echo 1. cd frontend
    echo 2. Copy .env.local.template to .env.local
    echo 3. Fill in your environment variables
    echo 4. npm install
    echo 5. npm run dev
) else (
    echo [X] %ERRORS% error(s) found!
    echo Please check the files above.
)

echo.
pause
