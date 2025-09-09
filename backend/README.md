# PlantAI Backend API

Comprehensive FastAPI backend for plant disease detection and agricultural advisory system.

## 🚀 Quick Start

### Windows
```bash
cd backend
start.bat
```

### Linux/Mac
```bash
cd backend
chmod +x start.sh
./start.sh
```

### Manual Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8080 --reload
```

## 📖 API Documentation

- **Interactive Docs**: http://127.0.0.1:8080/docs
- **Alternative Docs**: http://127.0.0.1:8080/redoc
- **API Base URL**: http://127.0.0.1:8080

## 🌟 Features

### 🔬 Disease Detection APIs
- **POST** `/predict/potato` - Potato disease prediction
- **POST** `/predict/tomato` - Tomato disease prediction

### 📊 Scan Management APIs
- **POST** `/api/scans` - Create scan record
- **GET** `/api/scans` - Get all scans (with filtering)
- **GET** `/api/scans/{scan_id}` - Get specific scan
- **DELETE** `/api/scans/{scan_id}` - Delete scan

### 💬 Feedback APIs
- **POST** `/api/feedback` - Submit feedback
- **GET** `/api/feedback/analytics` - Get feedback analytics

### 🌤️ Weather APIs
- **GET** `/weather/current/{location}` - Current weather
- **GET** `/weather/forecast/{location}` - Weather forecast
- **GET** `/weather/advisory/{location}` - Weather advisory

### 💰 Market Price APIs
- **GET** `/market/prices` - Current market prices

### 🏛️ Government Scheme APIs
- **GET** `/pmfby/policies` - PMFBY insurance policies
- **GET** `/shc/cards` - Soil health cards

### 📄 Report Generation APIs
- **GET** `/reports/farm` - Generate farm report
- **POST** `/reports/pdf` - Generate PDF report

### ⚡ System APIs
- **GET** `/` - API information
- **GET** `/health` - Health check

## 📝 API Usage Examples

### Disease Prediction
```python
import requests

# Upload image for potato disease detection
with open('potato_leaf.jpg', 'rb') as f:
    files = {'file': f}
    response = requests.post('http://127.0.0.1:8080/predict/potato', files=files)
    result = response.json()
    print(f"Disease: {result['prediction']}")
    print(f"Confidence: {result['confidence']}")
```

### Scan Management
```python
import requests

# Create a scan record
scan_data = {
    "farmer_id": "farmer123",
    "crop_type": "potato",
    "prediction": "Potato___Early_blight",
    "confidence": 0.92,
    "recommendations": ["Apply copper fungicide", "Remove affected leaves"],
    "scan_date": "2024-01-15T10:30:00Z"
}

response = requests.post('http://127.0.0.1:8080/api/scans', json=scan_data)
scan_record = response.json()
```

### Weather Data
```python
import requests

# Get current weather
response = requests.get('http://127.0.0.1:8080/weather/current/Delhi')
weather = response.json()
print(f"Temperature: {weather['temperature']}°C")
print(f"Humidity: {weather['humidity']}%")
```

## 🛠️ Technology Stack

- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn
- **Image Processing**: Pillow
- **Data Validation**: Pydantic
- **CORS**: FastAPI CORS middleware

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the backend directory:

```env
# Server Configuration
HOST=127.0.0.1
PORT=8080
DEBUG=True

# Database Configuration (when implemented)
DATABASE_URL=sqlite:///./plantai.db

# External API Keys (when implemented)
WEATHER_API_KEY=your_weather_api_key
MARKET_API_KEY=your_market_api_key

# ML Model Paths (when implemented)
POTATO_MODEL_PATH=./models/potato_model.h5
TOMATO_MODEL_PATH=./models/tomato_model.h5
```

## 📊 Response Formats

### Disease Prediction Response
```json
{
  "prediction": "Potato___Early_blight",
  "confidence": 0.92,
  "recommendations": [
    "Remove affected leaves immediately",
    "Apply copper-based fungicide"
  ],
  "disease_info": {
    "name": "Early blight",
    "severity": "Medium",
    "treatment_urgency": "Immediate"
  }
}
```

### Scan Record Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "farmer_id": "farmer123",
  "crop_type": "potato",
  "prediction": "Potato___Early_blight",
  "confidence": 0.92,
  "recommendations": ["Apply copper fungicide"],
  "weather_conditions": {...},
  "scan_date": "2024-01-15T10:30:00Z",
  "created_at": "2024-01-15T10:30:00Z"
}
```

### Weather Response
```json
{
  "location": "Delhi",
  "temperature": 25.5,
  "humidity": 65.0,
  "conditions": "Partly Cloudy",
  "wind_speed": 12.5,
  "pressure": 1013.2,
  "uv_index": 6,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🚨 Error Handling

The API returns standard HTTP status codes:

- **200**: Success
- **400**: Bad Request
- **404**: Not Found
- **422**: Validation Error
- **500**: Internal Server Error

### Error Response Format
```json
{
  "detail": "Error description here"
}
```

## 🔒 Security Features

- CORS protection configured
- File upload validation
- Input data validation with Pydantic
- Error handling without sensitive data exposure

## 📈 Performance

- Async/await support for concurrent requests
- Efficient image processing
- Lightweight JSON responses
- Auto-generated API documentation

## 🧪 Testing

Test the API using the interactive documentation:
1. Start the server
2. Open http://127.0.0.1:8080/docs
3. Try out different endpoints
4. Upload test images for disease detection

## 🔄 Development Workflow

1. **Code Changes**: Edit files in the backend directory
2. **Auto-reload**: Server automatically restarts (when using `--reload`)
3. **Test**: Use the interactive docs or frontend
4. **Deploy**: Configure for production environment

## 📦 Production Deployment

For production deployment:

```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8080
```

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the Next.js frontend:

1. **CORS**: Configured to allow requests from localhost:3000
2. **API Routes**: Match the expected endpoints in the frontend API service
3. **Response Format**: Compatible with TypeScript interfaces
4. **Error Handling**: Provides meaningful error messages

## 📋 TODO / Future Enhancements

- [ ] Integrate actual ML models (TensorFlow/PyTorch)
- [ ] Add database persistence (PostgreSQL/MongoDB)
- [ ] Implement user authentication/authorization
- [ ] Add real weather API integration
- [ ] Implement actual market price feeds
- [ ] Add comprehensive logging
- [ ] Add unit tests
- [ ] Add rate limiting
- [ ] Add caching layer (Redis)
- [ ] Add image storage (AWS S3/CloudinaryVU)

## 📞 Support

For issues or questions:
1. Check the API documentation at `/docs`
2. Review the error messages in the response
3. Check server logs in the terminal
4. Ensure all dependencies are installed correctly

---

🌱 **PlantAI Backend - Empowering Agriculture with AI**
