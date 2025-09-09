# PlantAI Complete Setup Guide

## 🚀 Quick Start (Recommended)

### 1. Start the Backend
```bash
cd backend
start.bat  # Windows
# OR
./start.sh  # Linux/Mac
```

### 2. Start the Frontend
```bash
# In a new terminal
npm run dev
```

### 3. Test the Integration
```bash
cd backend
python test_api.py
```

## 📁 Project Structure
```
msme/
├── frontend/           # Next.js frontend application
│   ├── app/           # App router pages
│   ├── components/    # Reusable UI components
│   ├── lib/          # API service & utilities
│   └── backend/      # FastAPI backend
│       ├── main.py   # Main API server
│       ├── requirements.txt
│       ├── start.bat # Windows startup
│       ├── start.sh  # Linux/Mac startup
│       └── test_api.py
└── README.md         # This file
```

## 🔧 Manual Setup

### Backend Setup
1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   ```bash
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Start the server**
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8080 --reload
   ```

### Frontend Setup
1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   # .env file should already contain:
   NEXT_PUBLIC_API_URL=http://127.0.0.1:8080
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 🧪 Testing the Complete System

### 1. Backend API Test
```bash
cd backend
python test_api.py
```
This will test all 17 API endpoints.

### 2. Frontend Integration Test
1. Open http://localhost:3000
2. Register/Login with Clerk
3. Navigate to Dashboard
4. Go to Scanner
5. Upload a plant image
6. Check results

### 3. Full Workflow Test
1. **Authentication**: Register → Login
2. **Dashboard**: View weather, market prices, recent scans
3. **Scanner**: Upload image → Get AI prediction
4. **Results**: View detailed analysis with recommendations
5. **History**: Check scan history and analytics

## 🌟 Complete API Implementation

### ✅ Implemented Endpoints (17/17)

#### Core System (2)
- `GET /` - API information
- `GET /health` - System health check

#### Disease Detection (2)
- `POST /predict/potato` - Potato disease prediction
- `POST /predict/tomato` - Tomato disease prediction

#### Scan Management (4)
- `POST /api/scans` - Create scan record
- `GET /api/scans` - Get all scans
- `GET /api/scans/{id}` - Get specific scan
- `DELETE /api/scans/{id}` - Delete scan

#### Feedback (2)
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/analytics` - Get analytics

#### Weather (3)
- `GET /weather/current/{location}` - Current weather
- `GET /weather/forecast/{location}` - Weather forecast
- `GET /weather/advisory/{location}` - Weather advisory

#### Market Prices (1)
- `GET /market/prices` - Current market prices

#### Government Schemes (2)
- `GET /pmfby/policies` - PMFBY insurance policies
- `GET /shc/cards` - Soil health cards

#### Reports (2)
- `GET /reports/farm` - Generate farm report
- `POST /reports/pdf` - Generate PDF report

### 🎯 Key Features

#### AI Disease Detection
- Upload plant images (potato/tomato)
- Get AI-powered disease predictions
- Receive treatment recommendations
- View confidence scores and severity levels

#### Weather Integration
- Real-time weather data
- 7-day forecasts
- Agricultural advisories
- Environmental context for disease risk

#### Market Intelligence
- Live crop prices
- Market trends
- Price change indicators

#### Government Services
- PMFBY insurance information
- Soil health card data
- Scheme eligibility

#### Comprehensive Analytics
- Scan history tracking
- Feedback analytics
- Farm health reports
- PDF report generation

## 🔗 API Documentation

### Interactive Documentation
- **Swagger UI**: http://127.0.0.1:8080/docs
- **ReDoc**: http://127.0.0.1:8080/redoc

### Example API Calls

#### Disease Prediction
```python
import requests

# Upload image for disease detection
with open('plant_image.jpg', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://127.0.0.1:8080/predict/potato', files=files)
    result = response.json()
```

#### Weather Data
```python
response = requests.get('http://127.0.0.1:8080/weather/current/Delhi')
weather = response.json()
```

#### Market Prices
```python
response = requests.get('http://127.0.0.1:8080/market/prices')
prices = response.json()
```

## 🚀 Production Deployment

### Docker Deployment
```bash
cd backend
docker-compose up -d
```

### Traditional Deployment
```bash
# Backend
cd backend
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8080

# Frontend
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
Create `.env` in the root directory:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# API Configuration
NEXT_PUBLIC_API_URL=http://127.0.0.1:8080

# Database (optional)
DATABASE_URL=sqlite:///./plantai.db

# External APIs (optional)
WEATHER_API_KEY=your_weather_key
MARKET_API_KEY=your_market_key
```

## 📱 Features Summary

### For Farmers
- **Disease Detection**: Upload photos, get instant AI diagnosis
- **Weather Insights**: Local weather data and agricultural advisories
- **Market Prices**: Current crop prices and market trends
- **Government Schemes**: Insurance and soil health information
- **History Tracking**: All scans and recommendations saved

### For Developers
- **Complete API**: 17 endpoints covering all agricultural needs
- **Modern Stack**: FastAPI + Next.js + TypeScript
- **Authentication**: Secure user management with Clerk
- **Documentation**: Interactive API docs
- **Testing**: Comprehensive test suite
- **Deployment**: Docker support for easy deployment

## 🎯 Award-Winning Features

1. **AI-Powered**: Advanced disease detection using machine learning
2. **Comprehensive**: Complete agricultural advisory system
3. **User-Friendly**: Intuitive interface for farmers
4. **Real-Time**: Live weather and market data
5. **Scalable**: Modern architecture ready for production
6. **Documented**: Extensive documentation and testing
7. **Secure**: Proper authentication and data validation

## 🆘 Troubleshooting

### Backend Won't Start
- Check Python version (3.8+)
- Verify all dependencies installed
- Check port 8080 availability

### Frontend Won't Connect
- Ensure backend is running on port 8080
- Check NEXT_PUBLIC_API_URL in .env
- Verify CORS settings

### API Errors
- Check server logs in terminal
- Use `/docs` endpoint to test APIs
- Run `python test_api.py` for diagnostics

## 📞 Support

1. **API Issues**: Check http://127.0.0.1:8080/docs
2. **Server Logs**: Monitor terminal output
3. **Test Suite**: Run `python test_api.py`
4. **Health Check**: Visit http://127.0.0.1:8080/health

---

🌱 **PlantAI - Complete Agricultural AI Solution Ready for Competition!**
