@echo off
REM Environment Setup Helper for Deployment
REM This script helps you set up environment variables correctly

echo.
echo ========================================
echo   Environment Setup Helper
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed
    echo Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo What would you like to do?
echo.
echo 1. Generate a secure JWT_SECRET
echo 2. Validate environment files
echo 3. Show example configurations
echo 4. Check .gitignore setup
echo 5. Exit
echo.

set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" goto generate_secret
if "%choice%"=="2" goto validate_env
if "%choice%"=="3" goto show_examples
if "%choice%"=="4" goto check_gitignore
if "%choice%"=="5" goto end

echo Invalid choice
pause
exit /b 1

:generate_secret
echo.
echo ========================================
echo   Generating Secure JWT_SECRET
echo ========================================
echo.
echo Your new JWT_SECRET (copy this):
echo.
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo.
echo IMPORTANT:
echo - Copy the value above
echo - Paste it as JWT_SECRET in backend/.env
echo - Use a different value for development and production
echo.
pause
goto end

:validate_env
echo.
echo ========================================
echo   Validating Environment Files
echo ========================================
echo.

if not exist "backend\.env" (
    echo ERROR: backend/.env does not exist
    echo Create it by copying backend/.env.example
    echo.
) else (
    echo OK: backend/.env exists
)

if not exist "backend\.env.example" (
    echo ERROR: backend/.env.example does not exist
) else (
    echo OK: backend/.env.example exists
)

if not exist "frontend\.env.local" (
    echo WARNING: frontend/.env.local does not exist
    echo Create it for local development
    echo.
) else (
    echo OK: frontend/.env.local exists
)

if not exist "frontend\.env.example" (
    echo ERROR: frontend/.env.example does not exist
) else (
    echo OK: frontend/.env.example exists
)

echo.
echo Checking for secrets in git:
git ls-files | findstr /I ".env" >nul
if %ERRORLEVEL% EQU 0 (
    echo WARNING: .env files might be in git!
    echo Run: git rm --cached .env .env.local
) else (
    echo OK: No .env files in git
)

echo.
pause
goto end

:show_examples
echo.
echo ========================================
echo   Example Environment Configurations
echo ========================================
echo.
echo BACKEND (.env) - Production:
echo.
echo MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true
echo JWT_SECRET=YOUR_GENERATED_SECRET_HERE_MIN_32_CHARS
echo PORT=5000
echo NODE_ENV=production
echo FRONTEND_URL=https://your-site.vercel.app
echo.
echo BACKEND (.env) - Development:
echo.
echo MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true
echo JWT_SECRET=YOUR_GENERATED_SECRET_HERE_MIN_32_CHARS
echo PORT=5000
echo NODE_ENV=development
echo FRONTEND_URL=http://localhost:3000
echo.
echo FRONTEND (.env.local) - Development:
echo.
echo NEXT_PUBLIC_API_URL=http://localhost:5000
echo.
echo FRONTEND (Vercel Environment Variables) - Production:
echo.
echo Key: NEXT_PUBLIC_API_URL
echo Value: https://your-railway-backend.railway.app
echo.
pause
goto end

:check_gitignore
echo.
echo ========================================
echo   Checking .gitignore Setup
echo ========================================
echo.

echo Backend .gitignore:
if not exist "backend\.gitignore" (
    echo ERROR: backend/.gitignore does not exist
) else (
    findstr "\.env" backend\.gitignore >nul
    if %ERRORLEVEL% EQU 0 (
        echo OK: .env is ignored in backend
    ) else (
        echo WARNING: .env might not be ignored
    )
)

echo.
echo Frontend .gitignore:
if not exist "frontend\.gitignore" (
    echo ERROR: frontend/.gitignore does not exist
) else (
    findstr "\.env" frontend\.gitignore >nul
    if %ERRORLEVEL% EQU 0 (
        echo OK: .env is ignored in frontend
    ) else (
        echo WARNING: .env might not be ignored
    )
)

echo.
echo Files currently NOT ignored (status):
git status --short | findstr "\.env"
if %ERRORLEVEL% NEQ 0 (
    echo OK: No .env files in staging area
)

echo.
pause
goto end

:end
echo.
echo Done! See ENV_SETUP_GUIDE.md for detailed instructions.
echo.
pause
