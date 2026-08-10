@echo off
REM Script to help migrate remaining backend models to frontend

echo ============================================
echo Migrating Backend Models to Frontend
echo ============================================
echo.

set BACKEND_MODELS=backend\models
set FRONTEND_MODELS=frontend\lib\models

REM Check if directories exist
if not exist "%BACKEND_MODELS%" (
    echo Error: Backend models directory not found!
    exit /b 1
)

if not exist "%FRONTEND_MODELS%" (
    echo Creating frontend models directory...
    mkdir "%FRONTEND_MODELS%"
)

echo Copying models that need ES6 conversion...
echo.
echo Models to convert manually:
echo - About.js
echo - Contact.js
echo - Content.js
echo - Experience.js
echo - Settings.js
echo - Skill.js
echo.
echo User.js and Project.js are already migrated!
echo.
echo Instructions:
echo 1. Copy each model file from backend\models to frontend\lib\models
echo 2. Convert require() to import
echo 3. Convert module.exports to export default
echo 4. Change to: export default mongoose.models.ModelName ^|^| mongoose.model(...)
echo.
echo Example conversion:
echo   OLD: const mongoose = require('mongoose');
echo   NEW: import mongoose from 'mongoose';
echo.
echo   OLD: module.exports = mongoose.model('Skill', skillSchema);
echo   NEW: export default mongoose.models.Skill ^|^| mongoose.model('Skill', skillSchema);
echo.
echo See frontend\lib\models\User.js and Project.js for examples!
echo.

pause
