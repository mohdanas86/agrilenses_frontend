# Agri-Lens: Smart Agricultural Assistant

Agri-Lens is a comprehensive web application designed to empower farmers and agricultural stakeholders with cutting-edge technology. Built with Next.js and modern web technologies, it provides intelligent crop disease detection, multilingual voice-enabled chatbot assistance, real-time weather information, market insights, and access to government schemes.

## 🌟 Key Features

### 🖼️ Intelligent Crop Disease Detection

- **AI-Powered Analysis**: Advanced machine learning models for tomato and potato disease identification
- **High Accuracy**: Up to 96.2% detection accuracy for supported crops
- **Visual Results**: Clear diagnosis with confidence scores and treatment recommendations
- **Image Upload**: Support for camera capture and gallery uploads

### 💬 Multilingual Voice Chatbot

- **Voice Input/Output**: Speech-to-text and text-to-speech in multiple languages
- **Supported Languages**: English, Hindi, Tamil
- **Smart Integration**: Weather data, agricultural news, and farming advice
- **Real-time Responses**: Fast, context-aware AI assistance

### 🌤️ Weather Intelligence

- **Location-Based**: GPS and city-based weather information
- **Comprehensive Data**: Temperature, humidity, wind speed, air quality
- **Agricultural Insights**: Weather impact on crop health and farming activities

### 📊 Market Information

- **Price Tracking**: Real-time commodity prices and market trends
- **Regional Data**: Location-specific market intelligence
- **Decision Support**: Data-driven farming decisions

### 🏛️ Government Schemes

- **Scheme Discovery**: Access to relevant agricultural subsidies and programs
- **Eligibility Check**: Personalized scheme recommendations
- **Application Guidance**: Step-by-step assistance for scheme applications

### 📱 User Dashboard

- **Scan History**: Complete record of disease analyses
- **Profile Management**: User preferences and settings
- **Offline Support**: Cached data for offline access

## 🛠️ Technology Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **UI Components**: Radix UI primitives
- **Charts**: Recharts for data visualization

### Backend & APIs

- **Authentication**: Clerk for user management
- **Database**: MongoDB with Prisma ORM
- **Caching**: Upstash Redis
- **AI/ML**: Google Generative AI (Gemini)
- **Voice Services**: ElevenLabs + Google Cloud Text-to-Speech
- **Image Storage**: Cloudinary

### External Integrations

- **Weather API**: WeatherAPI.com
- **Geocoding**: Location services
- **Voice Recognition**: Web Speech API

## 🏗️ System Architecture

```mermaid
graph TB
    A[User Interface] --> B[Next.js Frontend]
    B --> C[Authentication Layer]
    B --> D[API Routes]
    
    C --> E[Clerk Auth]
    
    D --> F[Crop Scanner API]
    D --> G[Chatbot API]
    D --> H[Weather API]
    D --> I[Market API]
    D --> J[Schemes API]
    
    F --> K[Google Gemini AI]
    F --> L[Cloudinary]
    
    G --> K
    G --> M[ElevenLabs TTS]
    G --> N[Google Cloud TTS]
    
    H --> O[WeatherAPI]
    H --> P[Geocoding Service]
    
    I --> Q[Market Data Service]
    J --> R[Government APIs]
    
    D --> S[Database Layer]
    S --> T[MongoDB]
    S --> U[Prisma ORM]
    S --> V[Redis Cache]
    
    style B fill:#e1f5fe
    style D fill:#f3e5f5
    style S fill:#e8f5e8
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB database
- Redis instance (Upstash recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/mohdanas86/agrilenses_frontend.git
cd agrilenses_frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/agri_lens"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup

# AI Services
GEMINI_API_KEY=your_gemini_api_key

# Voice Services
GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Weather & Location
WEATHER_API_KEY=your_weather_api_key

# Image Storage
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Redis (Upstash)
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📖 Usage Guide

### Getting Started

1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Complete Profile**: Add location and farming preferences
3. **Explore Dashboard**: Access all features from the sidebar navigation

### Crop Disease Scanning

```mermaid
flowchart TD
    A[Select Crop Type] --> B[Capture/Upload Image]
    B --> C[AI Analysis]
    C --> D[Results Display]
    D --> E[View Recommendations]
    E --> F[Save to History]
    
    style A fill:#e8f5e8
    style D fill:#fff3cd
    style F fill:#d1ecf1
```

**Steps:**

1. Navigate to **Scanner** in the dashboard
2. Choose crop type (Tomato/Potato)
3. Capture photo or upload from gallery
4. Wait for AI analysis (typically 10-15 seconds)
5. Review diagnosis, confidence score, and treatment plan
6. Save results for future reference

### Using the Chatbot

1. Go to **Chat Assistant** section
2. Select preferred language
3. Type questions or use voice input (microphone button)
4. Receive AI-powered responses with voice playback
5. Ask about weather, farming techniques, or general advice

### Weather Information

- **Automatic**: Location-based weather on dashboard
- **Manual**: Search by city name
- **Forecast**: Extended weather predictions
- **Agricultural Context**: Crop-specific weather insights

## 🔌 API Reference

### Core Endpoints

#### Crop Scanning

```http
POST /api/store-scan
```

Stores scan results in database.

**Request Body:**
```json
{
  "plantName": "tomato",
  "disease": "Late Blight",
  "confidence": 0.96,
  "imageUrl": "https://...",
  "suggestion": {
    "identification": {...},
    "managementPlan": {...},
    "longTermCare": {...}
  }
}
```

#### Chatbot

```http
POST /api/chat
```

Processes chat messages with voice support.

**Request Body:**
```json
{
  "transcript": "What's the weather like?",
  "language": "en",
  "userId": "user_123",
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "city": "Delhi"
  }
}
```

#### Weather Data

```http
GET /api/weather?lat=28.6139&lng=77.2090
```

Returns current weather information.

**Response:**
```json
{
  "location": {
    "name": "Delhi",
    "region": "Delhi",
    "country": "India"
  },
  "current": {
    "temperature": 32.5,
    "condition": "Partly cloudy",
    "humidity": 65
  }
}
```

## 📊 Database Schema

```mermaid
erDiagram
    User ||--o{ Scan : performs
    Scan {
        string id
        string clerkUserId
        string plantName
        string disease
        float confidence
        string imageUrl
        json suggestion
        datetime createdAt
    }
    User {
        string id
        string clerkId
        string name
        string email
        string phone
        json address
        string profileImage
    }
```

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   └── _components/       # Shared components
├── components/            # Reusable UI components
├── lib/                   # Utility functions
├── prisma/               # Database schema
├── types/                # TypeScript definitions
└── docs/                 # Documentation
```

### Testing

```bash
# Run API tests
npm run test:api

# Run component tests
npm run test:components
```

## 🤝 Contributing

We welcome contributions to Agri-Lens! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google AI for Gemini models
- Clerk for authentication
- WeatherAPI for weather data
- ElevenLabs for voice synthesis
- All contributors and farmers using Agri-Lens

---

Built with ❤️ for farmers worldwide
