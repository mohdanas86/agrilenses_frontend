from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uvicorn
import os
import uuid
from datetime import datetime
import json
import io
from PIL import Image
import numpy as np

# Initialize FastAPI app
app = FastAPI(
    title="PlantAI Disease Detection API",
    description="Comprehensive API for plant disease detection and agricultural advisory",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===== DATA MODELS =====

class ScanData(BaseModel):
    farmer_id: str
    crop_type: str
    prediction: str
    confidence: float
    recommendations: List[str] = []
    weather_conditions: Optional[Dict] = None
    scan_date: str

class FeedbackData(BaseModel):
    scan_id: str
    prediction_id: str
    user_id: str
    feedback_type: str
    rating: Optional[int] = None
    comments: Optional[str] = None

class WeatherData(BaseModel):
    location: str
    temperature: float
    humidity: float
    conditions: str
    wind_speed: Optional[float] = 0.0

class MarketPrice(BaseModel):
    crop: str
    price: float
    unit: str
    market: str
    date: str

# ===== MOCK DATA STORAGE =====
scans_db = []
feedback_db = []
users_db = {}

# ===== UTILITY FUNCTIONS =====

def generate_mock_prediction(crop_type: str, confidence_base: float = 0.85):
    """Generate realistic mock predictions"""
    diseases = {
        'potato': [
            'Potato___Early_blight',
            'Potato___Late_blight', 
            'Potato___Healthy'
        ],
        'tomato': [
            'Tomato___Early_blight',
            'Tomato___Late_blight',
            'Tomato___Leaf_Mold',
            'Tomato___Healthy'
        ]
    }
    
    recommendations = {
        'Early_blight': [
            'Remove affected leaves immediately',
            'Apply copper-based fungicide',
            'Improve air circulation around plants',
            'Avoid overhead watering'
        ],
        'Late_blight': [
            'Remove and destroy infected plant material',
            'Apply preventive fungicide treatments',
            'Ensure good drainage',
            'Monitor weather conditions closely'
        ],
        'Leaf_Mold': [
            'Increase ventilation in growing area',
            'Reduce humidity levels',
            'Apply appropriate fungicide',
            'Space plants adequately'
        ],
        'Healthy': [
            'Continue current care practices',
            'Monitor regularly for early signs of disease',
            'Maintain proper watering schedule',
            'Ensure adequate nutrition'
        ]
    }
    
    # Randomly select a disease (70% chance of disease, 30% healthy)
    available_diseases = diseases.get(crop_type, diseases['potato'])
    import random
    
    if random.random() < 0.3:  # 30% chance healthy
        prediction = f"{crop_type.title()}___Healthy"
    else:
        disease_options = [d for d in available_diseases if 'Healthy' not in d]
        prediction = random.choice(disease_options)
    
    # Get recommendations based on disease type
    disease_key = prediction.split('___')[-1]
    recs = recommendations.get(disease_key, recommendations['Healthy'])
    
    return {
        "prediction": prediction,
        "confidence": confidence_base + random.uniform(-0.1, 0.1),
        "recommendations": recs,
        "disease_info": {
            "name": disease_key.replace('_', ' '),
            "severity": random.choice(['Low', 'Medium', 'High']),
            "treatment_urgency": "Immediate" if disease_key != "Healthy" else "None"
        }
    }

# ===== CORE SYSTEM APIs =====

@app.get("/")
async def root():
    """API Information"""
    return {
        "message": "PlantAI Disease Detection API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "disease_detection": ["/predict/potato", "/predict/tomato"],
            "scan_management": ["/api/scans"],
            "weather": ["/weather/current", "/weather/forecast", "/weather/advisory"],
            "market": ["/market/prices"],
            "government": ["/pmfby/policies", "/shc/cards"],
            "reports": ["/reports/farm", "/reports/pdf"]
        }
    }

@app.get("/health")
async def health_check():
    """System Health Check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "ml_models": "available",
            "database": "connected",
            "weather_api": "active",
            "market_data": "synced"
        }
    }

# ===== DISEASE DETECTION APIs =====

@app.post("/predict/potato")
async def predict_potato_disease(file: UploadFile = File(...)):
    """Potato Disease Prediction"""
    try:
        # Validate file
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=422, detail="File must be an image")
        
        # Read and validate image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Mock ML prediction (replace with actual model inference)
        prediction_result = generate_mock_prediction('potato', 0.92)
        
        return prediction_result
    
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Prediction failed: {str(e)}")

@app.post("/predict/tomato")
async def predict_tomato_disease(file: UploadFile = File(...)):
    """Tomato Disease Prediction"""
    try:
        # Validate file
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=422, detail="File must be an image")
        
        # Read and validate image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Mock ML prediction (replace with actual model inference)
        prediction_result = generate_mock_prediction('tomato', 0.89)
        
        return prediction_result
    
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Prediction failed: {str(e)}")

# ===== SCAN MANAGEMENT APIs =====

@app.post("/api/scans")
async def create_scan(scan_data: ScanData):
    """Create Scan Record"""
    scan_record = {
        "id": str(uuid.uuid4()),
        "farmer_id": scan_data.farmer_id,
        "crop_type": scan_data.crop_type,
        "prediction": scan_data.prediction,
        "confidence": scan_data.confidence,
        "recommendations": scan_data.recommendations,
        "weather_conditions": scan_data.weather_conditions,
        "scan_date": scan_data.scan_date,
        "created_at": datetime.now().isoformat()
    }
    
    scans_db.append(scan_record)
    return scan_record

@app.get("/api/scans")
async def get_scans(farmer_id: Optional[str] = None, limit: int = 10):
    """Get All Scans with filtering"""
    filtered_scans = scans_db
    
    if farmer_id:
        filtered_scans = [scan for scan in scans_db if scan.get('farmer_id') == farmer_id]
    
    # Sort by date and limit
    sorted_scans = sorted(filtered_scans, key=lambda x: x.get('created_at', ''), reverse=True)
    return sorted_scans[:limit]

@app.get("/api/scans/{scan_id}")
async def get_scan(scan_id: str):
    """Get Specific Scan"""
    scan = next((scan for scan in scans_db if scan['id'] == scan_id), None)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    return scan

@app.delete("/api/scans/{scan_id}")
async def delete_scan(scan_id: str):
    """Delete Scan"""
    global scans_db
    scans_db = [scan for scan in scans_db if scan['id'] != scan_id]
    return {"message": "Scan deleted successfully"}

# ===== FEEDBACK APIs =====

@app.post("/api/feedback")
async def submit_feedback(feedback: FeedbackData):
    """Submit Feedback"""
    feedback_record = {
        "id": str(uuid.uuid4()),
        "scan_id": feedback.scan_id,
        "prediction_id": feedback.prediction_id,
        "user_id": feedback.user_id,
        "feedback_type": feedback.feedback_type,
        "rating": feedback.rating,
        "comments": feedback.comments,
        "created_at": datetime.now().isoformat()
    }
    
    feedback_db.append(feedback_record)
    return feedback_record

@app.get("/api/feedback/analytics")
async def get_feedback_analytics():
    """Get Feedback Analytics"""
    if not feedback_db:
        return {
            "total_feedback": 0,
            "average_rating": 0,
            "feedback_distribution": {}
        }
    
    ratings = [f['rating'] for f in feedback_db if f.get('rating')]
    avg_rating = sum(ratings) / len(ratings) if ratings else 0
    
    return {
        "total_feedback": len(feedback_db),
        "average_rating": round(avg_rating, 2),
        "feedback_distribution": {
            "positive": len([f for f in feedback_db if f.get('rating', 0) >= 4]),
            "neutral": len([f for f in feedback_db if f.get('rating', 0) == 3]),
            "negative": len([f for f in feedback_db if f.get('rating', 0) <= 2])
        }
    }

# ===== WEATHER APIs =====

@app.get("/weather/current/{location}")
async def get_current_weather(location: str):
    """Current Weather"""
    import random
    
    # Mock weather data (replace with actual weather API)
    weather_data = {
        "location": location,
        "temperature": round(random.uniform(15, 35), 1),
        "humidity": round(random.uniform(40, 90), 1),
        "conditions": random.choice(["Sunny", "Cloudy", "Rainy", "Partly Cloudy"]),
        "wind_speed": round(random.uniform(5, 25), 1),
        "pressure": round(random.uniform(980, 1020), 1),
        "uv_index": random.randint(1, 10),
        "timestamp": datetime.now().isoformat()
    }
    
    return weather_data

@app.get("/weather/forecast/{location}")
async def get_weather_forecast(location: str):
    """Weather Forecast"""
    import random
    from datetime import timedelta
    
    forecast = []
    for i in range(7):  # 7-day forecast
        date = (datetime.now() + timedelta(days=i)).date()
        forecast.append({
            "date": date.isoformat(),
            "temperature_max": round(random.uniform(20, 35), 1),
            "temperature_min": round(random.uniform(10, 25), 1),
            "conditions": random.choice(["Sunny", "Cloudy", "Rainy", "Partly Cloudy"]),
            "humidity": round(random.uniform(40, 90), 1),
            "precipitation_chance": random.randint(0, 100)
        })
    
    return {
        "location": location,
        "forecast": forecast,
        "updated_at": datetime.now().isoformat()
    }

@app.get("/weather/advisory/{location}")
async def get_weather_advisory(location: str):
    """Weather Advisory"""
    advisories = [
        "Monitor crops for early blight due to high humidity",
        "Ideal conditions for planting new crops",
        "Consider irrigation due to low rainfall forecast",
        "High temperature warning - ensure adequate watering",
        "Good weather for harvesting activities"
    ]
    
    import random
    
    return {
        "location": location,
        "advisory": random.choice(advisories),
        "recommendations": [
            "Check soil moisture levels regularly",
            "Apply organic mulch to retain moisture",
            "Monitor plants for stress signs"
        ],
        "severity": random.choice(["Low", "Medium", "High"]),
        "valid_until": (datetime.now() + timedelta(days=3)).isoformat()
    }

# ===== MARKET PRICE APIs =====

@app.get("/market/prices")
async def get_market_prices(limit: int = 10):
    """Current Market Prices"""
    import random
    
    crops = ["Potato", "Tomato", "Onion", "Wheat", "Rice", "Maize", "Soybean"]
    markets = ["Azadpur Mandi", "Vashi Market", "Bangalore Market", "Local Market"]
    
    prices = []
    for crop in crops[:limit]:
        prices.append({
            "crop": crop,
            "price": round(random.uniform(1000, 5000), 2),
            "unit": "per quintal",
            "market": random.choice(markets),
            "date": datetime.now().isoformat(),
            "change": round(random.uniform(-200, 200), 2),
            "change_percent": round(random.uniform(-10, 10), 2)
        })
    
    return prices

# ===== GOVERNMENT SCHEME APIs =====

@app.get("/pmfby/policies")
async def get_pmfby_policies():
    """PMFBY Insurance Policies"""
    policies = [
        {
            "id": "PMFBY001",
            "name": "Kharif Crop Insurance 2024",
            "crop_covered": ["Rice", "Cotton", "Sugarcane"],
            "premium_rate": "2%",
            "sum_insured": "50000",
            "coverage": "Yield loss, Weather risks",
            "application_deadline": "2024-07-31",
            "status": "active"
        },
        {
            "id": "PMFBY002", 
            "name": "Rabi Crop Insurance 2024-25",
            "crop_covered": ["Wheat", "Barley", "Mustard"],
            "premium_rate": "1.5%",
            "sum_insured": "40000",
            "coverage": "Drought, Flood, Hail",
            "application_deadline": "2024-12-31",
            "status": "active"
        }
    ]
    
    return {"policies": policies}

@app.get("/shc/cards")
async def get_soil_health_cards():
    """Soil Health Cards"""
    cards = [
        {
            "id": "SHC001",
            "farmer_name": "Demo Farmer",
            "village": "Sample Village",
            "soil_type": "Loamy",
            "ph_level": 6.5,
            "organic_carbon": "0.75%",
            "nitrogen": "Medium",
            "phosphorus": "High", 
            "potassium": "Low",
            "recommendations": [
                "Apply 20 kg DAP per acre",
                "Use organic compost",
                "Test soil pH annually"
            ],
            "issue_date": "2024-01-15",
            "valid_until": "2026-01-15"
        }
    ]
    
    return {"cards": cards}

# ===== REPORT GENERATION APIs =====

@app.get("/reports/farm")
async def generate_farm_report(farmer_id: str):
    """Generate Farm Report"""
    # Get farmer's scans
    farmer_scans = [scan for scan in scans_db if scan.get('farmer_id') == farmer_id]
    
    # Calculate statistics
    total_scans = len(farmer_scans)
    healthy_count = len([s for s in farmer_scans if 'Healthy' in s.get('prediction', '')])
    disease_count = total_scans - healthy_count
    
    # Most common diseases
    diseases = [s.get('prediction', '') for s in farmer_scans if 'Healthy' not in s.get('prediction', '')]
    disease_freq = {}
    for disease in diseases:
        disease_freq[disease] = disease_freq.get(disease, 0) + 1
    
    return {
        "farmer_id": farmer_id,
        "report_date": datetime.now().isoformat(),
        "summary": {
            "total_scans": total_scans,
            "healthy_plants": healthy_count,
            "diseased_plants": disease_count,
            "health_percentage": round((healthy_count / total_scans * 100), 2) if total_scans > 0 else 0
        },
        "common_diseases": dict(sorted(disease_freq.items(), key=lambda x: x[1], reverse=True)[:5]),
        "recommendations": [
            "Regular monitoring recommended",
            "Follow integrated pest management",
            "Maintain proper field hygiene"
        ],
        "scans": farmer_scans[-10:]  # Last 10 scans
    }

@app.post("/reports/pdf")
async def generate_pdf_report(report_data: Dict[str, Any]):
    """Generate PDF Report"""
    # Mock PDF generation (implement actual PDF generation)
    return {
        "message": "PDF report generated successfully",
        "download_url": f"/downloads/report_{uuid.uuid4()}.pdf",
        "expires_at": (datetime.now() + timedelta(hours=24)).isoformat()
    }

# ===== MAIN =====

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8080,
        reload=True,
        log_level="info"
    )
