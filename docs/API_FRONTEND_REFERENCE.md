# 📡 Crop Disease Detection API - Complete Reference

## 🌐 Base URL
```
http://127.0.0.1:8080
```

## 📋 Complete API Endpoints List

### 🏠 **Core System APIs**

#### 1. Homepage
- **Endpoint:** `GET /`
- **Purpose:** API information and available endpoints
- **Response:** System overview with endpoint list

#### 2. Health Check
- **Endpoint:** `GET /health`
- **Purpose:** System health monitoring
- **Response:** Database status, model status, system metrics

---

### 🤖 **Disease Detection APIs**

#### 3. Potato Disease Prediction
- **Endpoint:** `POST /predict/potato`
- **Purpose:** Analyze potato plant images for disease detection
- **Input:** Image file (JPEG/PNG)
- **Response:** Disease prediction, confidence score, recommendations

#### 4. Tomato Disease Prediction
- **Endpoint:** `POST /predict/tomato`
- **Purpose:** Analyze tomato plant images for disease detection
- **Input:** Image file (JPEG/PNG)
- **Response:** Disease prediction, confidence score, recommendations

---

### 📊 **Scan Management APIs**

#### 5. Create Scan Record
- **Endpoint:** `POST /api/scans`
- **Purpose:** Save disease detection results
- **Input:** Scan data (farmer_id, crop_type, prediction, etc.)
- **Response:** Saved scan with unique ID

#### 6. Get All Scans
- **Endpoint:** `GET /api/scans`
- **Purpose:** Retrieve scan history with filtering
- **Parameters:** farmer_id, crop_type, limit, skip, date_range
- **Response:** Paginated scan results

#### 7. Get Specific Scan
- **Endpoint:** `GET /api/scans/{scan_id}`
- **Purpose:** Get detailed scan information
- **Response:** Complete scan data with recommendations

#### 8. Delete Scan
- **Endpoint:** `DELETE /api/scans/{scan_id}`
- **Purpose:** Remove scan record
- **Response:** Deletion confirmation

---

### 💬 **Feedback APIs**

#### 9. Submit Feedback
- **Endpoint:** `POST /api/feedback`
- **Purpose:** Submit user feedback on predictions
- **Input:** Rating, comments, feedback type
- **Response:** Feedback confirmation

#### 10. Get Feedback Analytics
- **Endpoint:** `GET /api/feedback/analytics`
- **Purpose:** System performance analytics
- **Response:** Accuracy metrics, user satisfaction stats

---

### 🌤️ **Weather APIs**

#### 11. Current Weather
- **Endpoint:** `GET /weather/current/{location}`
- **Purpose:** Real-time weather data
- **Response:** Temperature, humidity, conditions, agricultural impact

#### 12. Weather Forecast
- **Endpoint:** `GET /weather/forecast/{location}`
- **Purpose:** 5-day weather forecast
- **Response:** Daily forecasts with agricultural advisories

#### 13. Weather Advisory
- **Endpoint:** `GET /weather/advisory/{location}`
- **Purpose:** Agricultural weather guidance
- **Response:** Pest risk, irrigation advice, planting recommendations

---

### 💰 **Market Price APIs**

#### 14. Current Market Prices
- **Endpoint:** `GET /market/prices`
- **Purpose:** Real-time commodity prices
- **Response:** Price data with trends and predictions

---

### 🏥 **Government Scheme APIs**

#### 15. PMFBY Insurance Policies
- **Endpoint:** `GET /pmfby/policies`
- **Purpose:** Available crop insurance policies
- **Response:** Policy details, coverage, premium information

#### 16. Soil Health Cards
- **Endpoint:** `GET /shc/cards`
- **Purpose:** Soil health information and recommendations
- **Response:** Soil analysis, fertilizer recommendations

---

### 📄 **Report Generation API**

#### 17. Generate PDF Report
- **Endpoint:** `POST /pdf/generate-report`
- **Purpose:** Create comprehensive farming reports
- **Input:** Report type, date range, farmer data
- **Response:** PDF file download

---

## 🔧 Frontend Implementation Examples

### React/Next.js Implementation

```javascript
// API Service Class
class CropDiseaseAPI {
  constructor() {
    this.baseURL = 'http://127.0.0.1:8080';
  }

  // Disease Detection
  async predictDisease(cropType, imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await fetch(`${this.baseURL}/predict/${cropType}`, {
      method: 'POST',
      body: formData
    });
    
    return await response.json();
  }

  // Scan Management
  async saveScan(scanData) {
    const response = await fetch(`${this.baseURL}/api/scans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scanData)
    });
    
    return await response.json();
  }

  async getScans(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${this.baseURL}/api/scans?${params}`);
    return await response.json();
  }

  // Weather Services
  async getCurrentWeather(location) {
    const response = await fetch(`${this.baseURL}/weather/current/${location}`);
    return await response.json();
  }

  // Market Data
  async getMarketPrices() {
    const response = await fetch(`${this.baseURL}/market/prices`);
    return await response.json();
  }
}

// Usage in React Component
const api = new CropDiseaseAPI();

// Dashboard Component
function Dashboard() {
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [scans, weather, market] = await Promise.all([
          api.getScans({ limit: 5 }),
          api.getCurrentWeather('Delhi'),
          api.getMarketPrices()
        ]);

        setDashboardData({ scans, weather, market });
      } catch (error) {
        console.error('Dashboard load error:', error);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="dashboard">
      <WeatherWidget data={dashboardData.weather} />
      <RecentScans scans={dashboardData.scans} />
      <MarketPrices prices={dashboardData.market} />
    </div>
  );
}

// Disease Detection Component
function DiseaseScanner({ cropType }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const analyzePlant = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      // 1. Get prediction
      const result = await api.predictDisease(cropType, selectedImage);
      setPrediction(result);

      // 2. Save scan
      const scanData = {
        farmer_id: 'current_user_id',
        crop_type: cropType,
        prediction: result.prediction,
        confidence: result.confidence,
        recommendations: result.recommendations,
        image_url: 'uploaded_image_url'
      };

      await api.saveScan(scanData);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="disease-scanner">
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {selectedImage && <img src={URL.createObjectURL(selectedImage)} alt="Selected plant" />}
      <button onClick={analyzePlant} disabled={!selectedImage || loading}>
        {loading ? 'Analyzing...' : 'Analyze Plant'}
      </button>
      {prediction && <PredictionResults data={prediction} />}
    </div>
  );
}
```

### Vue.js Implementation

```javascript
// Vue 3 Composition API
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const api = new CropDiseaseAPI();
    const scans = ref([]);
    const loading = ref(false);

    const loadScans = async (filters = {}) => {
      loading.value = true;
      try {
        const result = await api.getScans(filters);
        scans.value = result.scans;
      } catch (error) {
        console.error('Error loading scans:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      loadScans();
    });

    return { scans, loading, loadScans };
  }
};
```

### React Native Implementation

```javascript
// Mobile app implementation
import { useState, useEffect } from 'react';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const CropScannerScreen = ({ route }) => {
  const { cropType } = route.params;
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, (response) => {
      if (response.assets && response.assets[0]) {
        setImage(response.assets[0]);
      }
    });
  };

  const analyzeImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('file', {
      uri: image.uri,
      type: image.type,
      name: image.fileName || 'image.jpg',
    });

    try {
      const response = await fetch(`${API_BASE_URL}/predict/${cropType}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const prediction = await response.json();
      setResult(prediction);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={selectImage}>
        <Text>Select Plant Image</Text>
      </TouchableOpacity>
      
      {image && (
        <Image source={{ uri: image.uri }} style={styles.image} />
      )}
      
      <TouchableOpacity onPress={analyzeImage}>
        <Text>Analyze Plant</Text>
      </TouchableOpacity>
      
      {result && (
        <View style={styles.results}>
          <Text>Disease: {result.prediction}</Text>
          <Text>Confidence: {result.confidence}%</Text>
        </View>
      )}
    </View>
  );
};
```

## 📱 Mobile App Structure

```
src/
├── screens/
│   ├── DashboardScreen.js
│   ├── ScannerScreen.js
│   ├── HistoryScreen.js
│   ├── WeatherScreen.js
│   ├── MarketScreen.js
│   ├── SchemesScreen.js
│   └── ReportsScreen.js
├── components/
│   ├── WeatherWidget.js
│   ├── ScanCard.js
│   ├── PriceCard.js
│   └── common/
├── services/
│   ├── api.js
│   ├── camera.js
│   └── storage.js
├── utils/
│   ├── formatters.js
│   └── validators.js
└── navigation/
    └── AppNavigator.js
```

## 🔧 Essential Features Implementation

### 1. **Camera Integration**
```javascript
// Camera capture for disease detection
const captureImage = () => {
  launchCamera(
    {
      mediaType: 'photo',
      quality: 0.8,
      cameraType: 'back',
    },
    handleImageResponse
  );
};
```

### 2. **Location Services**
```javascript
// Get user location for weather
import Geolocation from '@react-native-geolocation/geolocation';

const getCurrentLocation = () => {
  Geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      // Use coordinates for weather API
    },
    (error) => console.error(error),
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};
```

### 3. **Offline Storage**
```javascript
// Store scan results offline
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveScanOffline = async (scanData) => {
  try {
    const offlineScans = await AsyncStorage.getItem('offlineScans');
    const scans = offlineScans ? JSON.parse(offlineScans) : [];
    scans.push(scanData);
    await AsyncStorage.setItem('offlineScans', JSON.stringify(scans));
  } catch (error) {
    console.error('Offline save error:', error);
  }
};
```

### 4. **Push Notifications**
```javascript
// Weather alerts and price updates
import messaging from '@react-native-firebase/messaging';

const setupNotifications = async () => {
  const token = await messaging().getToken();
  // Send token to backend for targeted notifications
};
```

This comprehensive guide ensures you can build a complete agricultural advisory application that fully utilizes all 17 API endpoints across multiple platforms!
