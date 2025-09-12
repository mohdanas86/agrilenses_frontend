# Multilingual Farmer Chatbot with Voice I/O

An interactive, multilingual farmer-focused chatbot built with Next.js, TypeScript, and Google Cloud services. Supports voice input/output in Hindi, English, and Tamil with real-time weather and news integration.

## 🚀 Features

- **Voice Input**: Web Speech API for speech-to-text in multiple languages
- **Voice Output**: Google Cloud Text-to-Speech with Chirp 3 HD voices
- **Multilingual Support**: Hindi, English, Tamil with dynamic language switching
- **External Tools Integration**: Weather API, News API with extensible tool system
- **Real-time Chat**: Fast, responsive chat interface
- **Robust Error Handling**: Graceful fallbacks for API failures

## 🔧 Setup Instructions

### 1. Environment Variables

Create/update your `.env` file with the required API keys:

```env
# Gemini AI (Required)
GEMINI_API_KEY=your_gemini_api_key

# Weather API (Required)
WEATHER_API_KEY=your_weather_api_key
WEATHERENDPOINT=http://api.weatherapi.com/v1/current.json?key=your_weather_api_key&q=London&aqi=no

# Google Cloud Text-to-Speech (Required for voice output)
GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY={"type":"service_account",...}

# News API (Optional)
NEWS_API_KEY=your_news_api_key
```

### 2. Google Cloud Setup

1. Create a Google Cloud project
2. Enable Text-to-Speech API
3. Create a service account with TTS permissions
4. Download the service account JSON key
5. Add the entire JSON as `GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY` in your .env

### 3. API Keys

- **Gemini API**: Get from [Google AI Studio](https://makersuite.google.com/)
- **Weather API**: Get from [WeatherAPI.com](https://www.weatherapi.com/)
- **News API**: Get from [NewsAPI.org](https://newsapi.org/)

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000/dashboard/chat` to use the chatbot.

## 🎯 Usage Guide

### Chat Interface
1. **Language Selection**: Choose between English, Hindi, or Tamil from the dropdown
2. **Text Input**: Type your question in the input field
3. **Voice Input**: Click the microphone 🎙️ button to record voice (auto-stops after 15s)
4. **Voice Output**: Click the play ▶️ button on AI responses to hear them

### Supported Queries

#### Weather Queries
- "What's the weather like today?"
- "आज का मौसम कैसा है?" (Hindi)
- "இன்றைய வானிலை எப்படி இருக्கிறது?" (Tamil)

#### News Queries
- "Show me latest agriculture news"
- "कृषि समाचार दिखाओ" (Hindi)
- "விவசாய செய்திகளை காட்டு" (Tamil)

#### General Farming Questions
- "How to treat tomato diseases?"
- "धान की खेती कैसे करें?" (Hindi)
- "நெல் விவசாயம் எப்படி செய்வது?" (Tamil)

## 🏗️ Architecture

### Frontend (`app/dashboard/chat/page.tsx`)
- React hooks for speech recognition and audio playback
- Real-time chat interface with message history
- Language switching and error handling
- Responsive design with Tailwind CSS

### Backend (`app/api/chat/route.ts`)
- **Tool Registry Pattern**: Extensible system for adding new tools
- **Intent Detection**: Keyword-based routing to appropriate tools
- **Gemini Integration**: AI-powered responses with context
- **Google TTS**: High-quality voice synthesis
- **Error Handling**: Robust fallbacks and warnings

### Tool System
The backend uses a clean, extensible tool registry:

```typescript
interface Tool {
  name: string;
  triggerFn: (text: string) => boolean;
  handlerFn: (text: string, language: string) => Promise<string>;
}

const TOOLS: Tool[] = [weatherTool, newsTool];
```

## 🔌 Adding New Tools

To add a new tool (e.g., mandi prices):

1. Create the tool object:
```typescript
const mandiTool: Tool = {
  name: "mandi",
  triggerFn: (text: string) => {
    const keywords = ["price", "mandi", "market", "कीमत", "मंडी"];
    return keywords.some(k => text.toLowerCase().includes(k));
  },
  handlerFn: async (text: string, language: string) => {
    // Fetch mandi prices
    const response = await fetch('your-mandi-api');
    return "Current mandi prices...";
  }
};
```

2. Add to the registry:
```typescript
const TOOLS: Tool[] = [weatherTool, newsTool, mandiTool];
```

## 🎨 Voice Configuration

### Supported Languages & Voices
- **English**: `en-US-Journey-D` (Chirp 3 HD)
- **Hindi**: `hi-IN-Journey-D` (Chirp 3 HD)  
- **Tamil**: `ta-IN-Journey-D` (Chirp 3 HD)

### Speech Recognition Languages
- **English**: `en-US`
- **Hindi**: `hi-IN`
- **Tamil**: `ta-IN`

## ⚡ Performance Optimizations

- **Parallel Processing**: Text response shown immediately, voice synthesis in background
- **Audio Caching**: Base64 audio stored with messages
- **Auto-timeout**: Speech recognition auto-stops after 15 seconds
- **Error Boundaries**: Graceful handling of API failures

## 🛠️ Troubleshooting

### Common Issues

1. **Speech Recognition Not Working**
   - Ensure you're using HTTPS or localhost
   - Check browser compatibility (Chrome recommended)
   - Grant microphone permissions

2. **Voice Output Not Playing**
   - Check Google Cloud TTS setup
   - Verify service account permissions
   - Check browser audio policies

3. **Weather/News Not Working**
   - Verify API keys in .env
   - Check API quotas and limits
   - Review console for error messages

### Browser Compatibility
- **Speech Recognition**: Chrome, Edge (WebKit-based)
- **Audio Playback**: All modern browsers
- **Voice Synthesis**: All modern browsers

## 📝 API Response Format

```typescript
interface ChatResponse {
  transcript: string;      // User's input
  language: string;        // Selected language
  replyText: string;       // AI response text
  audioBase64: string | null; // TTS audio (base64)
  warnings: string[];      // Any warnings/errors
}
```

## 🔐 Security Notes

- API keys stored in environment variables
- Google Cloud service account with minimal permissions
- Input validation and sanitization
- Rate limiting (implement as needed)

## 🚀 Future Enhancements

- [ ] Add government scheme information tool
- [ ] Integrate mandi price API
- [ ] Add crop calendar functionality
- [ ] Implement user authentication
- [ ] Add chat history persistence
- [ ] Support for more languages (Bengali, Punjabi, etc.)
- [ ] Offline voice recognition fallback

## 📄 License

MIT License - feel free to modify and extend!
