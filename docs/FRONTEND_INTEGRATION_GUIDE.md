# 🌱 Crop Disease Detection API - Frontend Integration Guide

## 📱 Complete UI/UX Implementation Plan for Agricultural Advisory System

This guide provides a comprehensive mapping of all backend APIs to frontend pages, ensuring complete feature coverage for your agricultural advisory prototype.

---

## 🏗️ **App Architecture Overview**

### **Navigation Structure**
```
📱 Main App
├── 🏠 Dashboard (Home)
├── 📷 Disease Detection
│   ├── Potato Scanner
│   └── Tomato Scanner
├── 📊 My Scans (History)
├── 🌤️ Weather Advisory
├── 💰 Market Prices
├── 🏥 Government Schemes
│   ├── PMFBY Insurance
│   └── Soil Health Cards
├── 📋 Reports & Analytics
└── ⚙️ Settings/Profile
```

---

## 🎯 **Page-by-Page API Integration**

### 1. 🏠 **Dashboard/Home Page**
**Purpose:** Overview of farmer's agricultural status and quick access to key features

#### **APIs Used:**
- `GET /health` - System status check
- `GET /api/scans?limit=5` - Recent scans preview
- `GET /weather/current/{location}` - Current weather
- `GET /market/prices?limit=3` - Top market prices
- `GET /api/feedback/analytics` - Quick stats

#### **UI Components:**
```javascript
// Dashboard sections
├── Weather Widget (Current conditions)
├── Recent Scans (Last 5 disease detections)
├── Market Price Ticker (Top 3 commodities)
├── Quick Actions (Scan Now, View Reports)
├── Government Schemes Alerts
└── Health Status Indicator
```

#### **Implementation:**
```javascript
// Dashboard API calls
const dashboardData = await Promise.all([
  fetch('/health'),
  fetch('/api/scans?limit=5'),
  fetch('/weather/current/Delhi'), // Use user location
  fetch('/market/prices?limit=3'),
  fetch('/api/feedback/analytics')
]);
```

---

### 2. 📷 **Disease Detection Pages**

#### **2A. Potato Disease Scanner**
**Purpose:** Upload and analyze potato plant images for disease detection

#### **APIs Used:**
- `POST /predict/potato` - Main prediction endpoint
- `POST /api/scans` - Save scan results
- `GET /api/scans?crop_type=potato` - Potato scan history

#### **UI Flow:**
```
Camera/Upload → Preview → Analyze → Results → Save/Share
```

#### **Implementation:**
```javascript
// Potato scanning workflow
const scanPotato = async (imageFile) => {
  // 1. Upload and predict
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const prediction = await fetch('/predict/potato', {
    method: 'POST',
    body: formData
  });
  
  // 2. Save scan result
  const scanData = {
    farmer_id: currentUser.id,
    crop_type: 'potato',
    image_url: imageUrl,
    prediction: prediction.prediction,
    confidence: prediction.confidence,
    recommendations: prediction.recommendations
  };
  
  await fetch('/api/scans', {
    method: 'POST',
    body: JSON.stringify(scanData)
  });
};
```

#### **2B. Tomato Disease Scanner**
**Purpose:** Upload and analyze tomato plant images for disease detection

#### **APIs Used:**
- `POST /predict/tomato` - Main prediction endpoint
- `POST /api/scans` - Save scan results
- `GET /api/scans?crop_type=tomato` - Tomato scan history

#### **Implementation:** Similar to potato scanner but with tomato endpoint

---

### 3. 📊 **My Scans (History) Page**
**Purpose:** View all previous disease detection scans with filtering and search

#### **APIs Used:**
- `GET /api/scans` - All scans with pagination
- `GET /api/scans?farmer_id={id}` - User-specific scans
- `GET /api/scans?crop_type={type}` - Filter by crop
- `DELETE /api/scans/{scan_id}` - Delete scan
- `POST /api/feedback` - Rate scan accuracy

#### **UI Components:**
```javascript
├── Filter Controls (Crop type, Date range, Disease type)
├── Search Bar (Search by disease name)
├── Scan Cards Grid
│   ├── Image thumbnail
│   ├── Disease name & confidence
│   ├── Date & time
│   ├── Actions (View details, Delete, Rate)
└── Pagination Controls
```

#### **Implementation:**
```javascript
// Scans history with filters
const loadScans = async (filters = {}) => {
  const params = new URLSearchParams({
    farmer_id: currentUser.id,
    limit: 10,
    skip: filters.page * 10,
    ...filters
  });
  
  const scans = await fetch(`/api/scans?${params}`);
  return scans.json();
};

// Feedback submission
const rateScan = async (scanId, rating, comments) => {
  await fetch('/api/feedback', {
    method: 'POST',
    body: JSON.stringify({
      scan_id: scanId,
      prediction_id: scanId,
      user_id: currentUser.id,
      feedback_type: 'rating',
      rating,
      comments
    })
  });
};
```

---

### 4. 🌤️ **Weather Advisory Page**
**Purpose:** Comprehensive weather information and agricultural advisories

#### **APIs Used:**
- `GET /weather/current/{location}` - Current weather
- `GET /weather/forecast/{location}` - 5-day forecast
- `GET /weather/advisory/{location}` - Agricultural advisory
- `POST /weather/alerts` - Weather alert subscriptions

#### **UI Sections:**
```javascript
├── Current Weather Card
├── 5-Day Forecast
├── Agricultural Advisory
│   ├── Pest Risk Analysis
│   ├── Irrigation Recommendations
│   ├── Best Planting Times
└── Weather Alerts Settings
```

#### **Implementation:**
```javascript
const weatherPage = async (location) => {
  const [current, forecast, advisory] = await Promise.all([
    fetch(`/weather/current/${location}`),
    fetch(`/weather/forecast/${location}`),
    fetch(`/weather/advisory/${location}`)
  ]);
  
  return {
    current: await current.json(),
    forecast: await forecast.json(),
    advisory: await advisory.json()
  };
};
```

---

### 5. 💰 **Market Prices Page**
**Purpose:** Real-time market prices and price predictions

#### **APIs Used:**
- `GET /market/prices` - Current market prices
- `GET /market/prices/{commodity}` - Specific commodity
- `GET /market/predictions` - Price predictions
- `GET /market/trends` - Historical trends

#### **UI Components:**
```javascript
├── Price Cards Grid
│   ├── Commodity name & image
│   ├── Current price
│   ├── Price change indicator
│   └── Trend chart (small)
├── Search & Filter
├── Price Prediction Charts
├── Market News & Updates
└── Favorite Commodities
```

#### **Implementation:**
```javascript
const marketData = async () => {
  const [prices, predictions, trends] = await Promise.all([
    fetch('/market/prices'),
    fetch('/market/predictions'),
    fetch('/market/trends')
  ]);
  
  return {
    prices: await prices.json(),
    predictions: await predictions.json(),
    trends: await trends.json()
  };
};
```

---

### 6. 🏥 **Government Schemes Section**

#### **6A. PMFBY Insurance Page**
**Purpose:** Crop insurance information and claim management

#### **APIs Used:**
- `GET /pmfby/policies` - Available policies
- `GET /pmfby/policies/{policy_id}` - Policy details
- `POST /pmfby/apply` - Apply for insurance
- `GET /pmfby/claims` - Claim status
- `POST /pmfby/claims` - Submit claim

#### **UI Sections:**
```javascript
├── Available Policies Grid
├── My Policies
├── Claims Section
│   ├── Active Claims
│   ├── Submit New Claim
│   └── Claim History
└── Application Forms
```

#### **6B. Soil Health Cards Page**
**Purpose:** Soil health testing and recommendations

#### **APIs Used:**
- `GET /shc/cards` - Soil health cards
- `POST /shc/test-request` - Request soil testing
- `GET /shc/recommendations` - Fertilizer recommendations
- `POST /shc/generate-report` - Generate PDF report

#### **Implementation:**
```javascript
const soilHealthData = async (farmerId) => {
  const [cards, recommendations] = await Promise.all([
    fetch(`/shc/cards?farmer_id=${farmerId}`),
    fetch(`/shc/recommendations?farmer_id=${farmerId}`)
  ]);
  
  return {
    cards: await cards.json(),
    recommendations: await recommendations.json()
  };
};
```

---

### 7. 📋 **Reports & Analytics Page**
**Purpose:** Comprehensive farming reports and data analytics

#### **APIs Used:**
- `GET /api/feedback/analytics` - Performance analytics
- `POST /pdf/generate-report` - Generate PDF reports
- `GET /api/scans/summary` - Scan statistics
- `GET /weather/history/{location}` - Historical weather data

#### **UI Components:**
```javascript
├── Analytics Dashboard
│   ├── Disease Detection Stats
│   ├── Scan Accuracy Metrics
│   ├── Seasonal Trends
└── Report Generation
    ├── Custom Date Ranges
    ├── Export Options (PDF, Excel)
    └── Scheduled Reports
```

#### **Implementation:**
```javascript
const generateReport = async (reportType, filters) => {
  const response = await fetch('/pdf/generate-report', {
    method: 'POST',
    body: JSON.stringify({
      report_type: reportType,
      farmer_id: currentUser.id,
      filters,
      date_range: filters.dateRange
    })
  });
  
  const blob = await response.blob();
  downloadFile(blob, `report_${Date.now()}.pdf`);
};
```

---

### 8. ⚙️ **Settings/Profile Page**
**Purpose:** User profile management and app configurations

#### **APIs Used:**
- `GET /health` - System status
- `POST /api/feedback` - App feedback
- User profile APIs (if implemented)

---

## 🔧 **API Integration Utilities**

### **Base API Client**
```javascript
class AgriAPI {
  constructor(baseUrl = 'http://127.0.0.1:8080') {
    this.baseUrl = baseUrl;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
  
  // Disease Detection
  async predictDisease(cropType, imageFile) {
    const formData = new FormData();
    formData.append('file', imageFile);
    
    const response = await fetch(`${this.baseUrl}/predict/${cropType}`, {
      method: 'POST',
      body: formData
    });
    
    return response.json();
  }
  
  // Scans Management
  async getScans(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/api/scans?${params}`);
  }
  
  async saveScan(scanData) {
    return this.request('/api/scans', {
      method: 'POST',
      body: JSON.stringify(scanData)
    });
  }
  
  // Weather Services
  async getWeather(location, type = 'current') {
    return this.request(`/weather/${type}/${location}`);
  }
  
  // Market Data
  async getMarketPrices() {
    return this.request('/market/prices');
  }
  
  // Government Schemes
  async getPMFBYPolicies() {
    return this.request('/pmfby/policies');
  }
  
  async getSoilHealthCards(farmerId) {
    return this.request(`/shc/cards?farmer_id=${farmerId}`);
  }
}

// Usage
const api = new AgriAPI();
```

---

## 📱 **Mobile App Features Implementation**

### **Core Features Checklist:**
- [ ] 📷 **Camera Integration** - Direct photo capture for disease detection
- [ ] 📍 **GPS Location** - Auto-detect location for weather and market data
- [ ] 🔔 **Push Notifications** - Weather alerts, price changes, scheme updates
- [ ] 💾 **Offline Storage** - Cache scan results and essential data
- [ ] 🔄 **Auto-sync** - Sync data when internet is available
- [ ] 📤 **Share Results** - Share scan results and reports
- [ ] 🌐 **Multi-language** - Support local languages
- [ ] 📊 **Data Visualization** - Charts for trends and analytics

### **Advanced Features:**
- [ ] 🤖 **Chatbot Integration** - Agricultural advisory chatbot
- [ ] 📞 **Voice Commands** - Voice-based disease reporting
- [ ] 🗺️ **Farm Mapping** - GPS-based farm area mapping
- [ ] 📈 **Predictive Analytics** - Disease outbreak predictions
- [ ] 👥 **Community Features** - Farmer-to-farmer knowledge sharing

---

## 🚀 **Development Phases**

### **Phase 1: Core MVP (2-3 weeks)**
1. Dashboard page with basic widgets
2. Disease detection (potato & tomato)
3. Scan history with basic filtering
4. Weather current conditions

### **Phase 2: Enhanced Features (2-3 weeks)**
1. Market prices integration
2. Weather forecasts and advisories
3. Government schemes (PMFBY, SHC)
4. Report generation

### **Phase 3: Advanced Features (2-3 weeks)**
1. Analytics dashboard
2. Advanced filtering and search
3. PDF report downloads
4. Feedback and rating systems

### **Phase 4: Mobile Optimization (1-2 weeks)**
1. Camera integration
2. GPS location services
3. Offline capabilities
4. Push notifications

---

## 📋 **Testing Scenarios**

### **API Testing Checklist:**
- [ ] Disease detection with sample images
- [ ] Scan history pagination and filtering
- [ ] Weather data for different locations
- [ ] Market price updates
- [ ] Government scheme applications
- [ ] PDF report generation
- [ ] Feedback submission
- [ ] Error handling for network issues

---

## 💡 **UI/UX Best Practices**

1. **Visual Feedback:** Show loading states for API calls
2. **Error Handling:** Graceful error messages for failed requests
3. **Offline Support:** Cache essential data for offline viewing
4. **Performance:** Lazy load images and paginate data
5. **Accessibility:** Support screen readers and high contrast modes
6. **Responsive Design:** Work on mobile, tablet, and desktop
7. **Progressive Enhancement:** Core features work without JavaScript

---

This comprehensive guide ensures you utilize all 17 API endpoints effectively across your frontend application, creating a complete agricultural advisory platform that serves farmers' needs from disease detection to government scheme applications.
