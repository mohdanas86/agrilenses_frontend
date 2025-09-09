@echo off
echo 🌱 Starting PlantAI Backend Server...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📚 Installing dependencies...
pip install -r requirements.txt

REM Start the server
echo 🚀 Starting FastAPI server on http://127.0.0.1:8080
echo 📖 API Documentation: http://127.0.0.1:8080/docs
echo 🔬 Alternative Docs: http://127.0.0.1:8080/redoc
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn main:app --host 127.0.0.1 --port 8080 --reload
