@echo off
REM Programming Tools Suite - Mobile Build Script for Windows
REM This script automates the build process for native mobile deployment

setlocal enabledelayedexpansion

echo 🚀 Programming Tools Suite - Mobile Build Script
echo ==============================================
echo.

REM Function to print colored output
goto :main

:print_status
echo.
echo 📘 %~1
goto :eof

:print_success
echo.
echo ✅ %~1
goto :eof

:print_error
echo.
echo ❌ %~1
goto :eof

:print_warning
echo.
echo ⚠️  %~1
goto :eof

:main
REM Check if we're in the right directory
if not exist "package.json" (
    call :print_error "Error: Not in the correct directory. Please run this script from the Web app directory."
    pause
    exit /b 1
)

if not exist "capacitor.config.ts" (
    call :print_error "Error: Not in the correct directory. Please run this script from the Web app directory."
    pause
    exit /b 1
)

REM Function to install dependencies
call :print_status "Installing Node.js dependencies..."
npm install
if errorlevel 1 (
    call :print_error "Failed to install dependencies"
    pause
    exit /b 1
) else (
    call :print_success "Dependencies installed successfully"
)

REM Function to add mobile platforms
call :print_status "Adding mobile platforms..."

REM Add Android platform
if exist "android" (
    call :print_warning "Android platform already exists"
) else (
    call :print_status "Adding Android platform..."
    npx cap add android
    if errorlevel 1 (
        call :print_error "Failed to add Android platform"
        pause
        exit /b 1
    ) else (
        call :print_success "Android platform added"
    )
)

REM Add iOS platform (Windows doesn't support iOS development)
call :print_warning "iOS platform not available on Windows"
call :print_status "For iOS development, use macOS with Xcode"

REM Function to sync web assets
call :print_status "Syncing web assets to native projects..."
npx cap sync
if errorlevel 1 (
    call :print_error "Failed to sync web assets"
    pause
    exit /b 1
) else (
    call :print_success "Web assets synced successfully"
)

REM Function to create app icons (placeholder)
call :print_status "Checking for app icons..."
if not exist "icons" (
    call :print_warning "Icons directory not found"
    call :print_status "Creating icons directory..."
    mkdir icons 2>nul
)

REM Check if icons exist
if exist "icons\icon-192x192.png" if exist "icons\icon-512x512.png" (
    call :print_success "App icons found"
) else (
    call :print_warning "App icons not found. Please create the following PNG files in the icons\ directory:"
    echo   - icon-72x72.png, icon-96x96.png, icon-128x128.png
    echo   - icon-144x144.png, icon-152x152.png, icon-192x192.png
    echo   - icon-384x384.png, icon-512x512.png
    echo.
    echo Use online tools like:
    echo   - https://realfavicongenerator.net/
    echo   - https://favicon.io/
)

echo.
call :print_status "Build Options:"
echo 1) Build for Android only
echo 2) Skip building (setup only)
echo.
set /p choice="Enter your choice (1-2): "

if "%choice%"=="1" (
    if not exist "android" (
        call :print_error "Android platform not found. Run setup first."
        pause
        exit /b 1
    )

    call :print_status "Building for Android..."

    REM Check if device/emulator is available
    adb devices >nul 2>&1
    if !errorlevel! equ 0 (
        for /f "tokens=2" %%i in ('adb devices ^| findstr "device$"') do (
            call :print_status "Android device detected. Deploying..."
            npx cap run android
            if !errorlevel! equ 0 (
                call :print_success "Android app deployed successfully"
            ) else (
                call :print_error "Failed to deploy Android app"
            )
            goto :end_build
        )
    )

    call :print_warning "No Android device detected. Opening in Android Studio..."
    npx cap open android
    if !errorlevel! equ 0 (
        call :print_success "Android Studio opened. Please build and run manually."
    ) else (
        call :print_error "Failed to open Android Studio"
    )
) else if "%choice%"=="2" (
    call :print_success "Setup complete! You can now build manually using:"
    echo   npx cap run android  # For Android
) else (
    call :print_error "Invalid choice"
    pause
    exit /b 1
)

:end_build
echo.
call :print_success "Build process completed!"
echo.
call :print_status "Next steps:"
echo 📱 Test your apps on devices/emulators
echo 🎨 Customize app icons in the icons\ directory
echo 📦 Prepare for app store submission (if needed)
echo 🔄 Run 'npm run build' to rebuild after code changes

pause
