#!/bin/bash

# PlantAI Backend Startup Script

echo "🌱 Starting PlantAI Backend Server..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if pip is installed
if ! command -v pip &> /dev/null; then
    echo "❌ pip is not installed. Please install pip."
    exit 1
fi

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install -r requirements.txt

# Start the server
echo "🚀 Starting FastAPI server on http://127.0.0.1:8080"
echo "📖 API Documentation: http://127.0.0.1:8080/docs"
echo "🔬 Alternative Docs: http://127.0.0.1:8080/redoc"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn main:app --host 127.0.0.1 --port 8080 --reload
