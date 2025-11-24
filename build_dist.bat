@echo off
echo Checking for Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Creating dist directories...
if not exist "docs\dist\js" mkdir "docs\dist\js"
if not exist "docs\dist\css" mkdir "docs\dist\css"

echo Installing dependencies (if needed)...
call npm install --save-dev esbuild react react-dom

echo Bundling and Minifying JS with esbuild...
call npx esbuild docs/src/js/app.jsx --bundle --minify --outfile=docs/dist/js/app.min.js --loader:.js=jsx

if %errorlevel% neq 0 (
    echo Error bundling JS.
    pause
    exit /b %errorlevel%
)

echo Minifying CSS...
call npx esbuild docs/src/css/app.css --minify --outfile=docs/dist/css/app.min.css

if %errorlevel% neq 0 (
    echo Error minifying CSS.
    pause
    exit /b %errorlevel%
)

echo Done.
