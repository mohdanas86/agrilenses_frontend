# 🤖 Multilingual Farmer Advisory Chat System

A comprehensive AI-powered chat system for farmers supporting English, Hindi, and Tamil languages with voice input/output capabilities.

## ✨ Features

### 🌍 **Multilingual Support**
- **Languages**: English, Hindi (हिंदी), Tamil (தமிழ்)
- **Real-time Translation**: LibreTranslate API integration
- **Language Switching**: Dynamic language selection during chat

### 🎤 **Voice Capabilities**
- **Speech-to-Text**: Web Speech API with language-specific recognition
- **Text-to-Speech**: Browser speechSynthesis with native voice support
- **Voice Input**: Hands-free mic button with visual feedback
- **Multilingual TTS**: Play responses in any supported language

### 💬 **Chat Features**
- **Real-time Messaging**: Instant AI responses
- **Message History**: Persistent chat storage
- **Copy/Share**: Copy messages to clipboard
- **Responsive Design**: Mobile-first approach
- **Typing Indicators**: Loading states and feedback

### 🧠 **AI Integration**
- **Gemini API**: Advanced agricultural knowledge
- **Context Awareness**: Understands farming terminology
- **Smart Responses**: Crop-specific advice and solutions
- **Fallback System**: Graceful error handling

## 📁 File Structure

```
app/dashboard/chat/
├── page.tsx                    # Main chat interface
├── history/
│   └── page.tsx               # Chat history page
└── _components/
    ├── ChatMessage.tsx        # Individual message component
    ├── VoiceRecorder.tsx      # Voice input handling
    ├── LanguageSelector.tsx   # Language switching
    ├── useChatState.ts        # Chat state management
    └── index.ts              # Component exports

app/api/chat/
├── route.ts                   # Chat API endpoints
└── history/
    └── [userId]/
        └── route.ts          # History management API
```

## 🚀 Usage

### 1. **Start Chatting**
```typescript
// Navigate to chat page
router.push('/dashboard/chat');

// Or use the dashboard button
<Link href="/dashboard/chat">Start Chatting</Link>
```

### 2. **Voice Input**
```typescript
// Voice recorder automatically handles:
const recognition = new SpeechRecognition();
recognition.lang = "hi-IN"; // Dynamic language setting
recognition.onresult = (event) => {
  setInputText(event.results[0][0].transcript);
};
```

### 3. **Text-to-Speech**
```typescript
// Play message in any language
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = "ta-IN"; // Tamil voice
speechSynthesis.speak(utterance);
```

## 🔧 API Endpoints

### Chat API
```typescript
POST /api/chat
{
  "message": "How to treat tomato blight?",
  "language": "en",
  "userId": "user-123"
}

Response:
{
  "success": true,
  "response": "AI farming advice...",
  "chatId": "chat-1234567890"
}
```

### Translation API
```typescript
PUT /api/chat
{
  "text": "Hello farmer",
  "source": "en",
  "target": "hi"
}

Response:
{
  "success": true,
  "translatedText": "नमस्ते किसान",
  "source": "en",
  "target": "hi"
}
```

### History API
```typescript
GET /api/chat/history/[userId]

Response:
{
  "success": true,
  "sessions": [...],
  "totalSessions": 10,
  "totalMessages": 45
}
```

## 🎯 Language Configuration

### Supported Languages
```typescript
const SUPPORTED_LANGUAGES = [
  { 
    code: "en", 
    name: "English", 
    speechCode: "en-US", 
    flag: "🇺🇸" 
  },
  { 
    code: "hi", 
    name: "हिंदी", 
    speechCode: "hi-IN", 
    flag: "🇮🇳" 
  },
  { 
    code: "ta", 
    name: "தமிழ்", 
    speechCode: "ta-IN", 
    flag: "🇮🇳" 
  }
];
```

### Voice Recognition Setup
```typescript
const recognition = new window.SpeechRecognition();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = speechCode; // "hi-IN", "ta-IN", "en-US"
```

## 🔌 Integration Points

### 1. **Global Context**
```typescript
// Add to GlobalContext.tsx
const [selectedLanguage, setSelectedLanguage] = useState("en");
const [chatHistory, setChatHistory] = useState([]);
```

### 2. **Authentication**
```typescript
// Clerk integration for user sessions
const { user } = useUser();
const userId = user?.id || "anonymous";
```

### 3. **Database Schema**
```sql
-- Chat Sessions
CREATE TABLE chat_sessions (
  id VARCHAR PRIMARY KEY,
  user_id VARCHAR NOT NULL,
  language VARCHAR(5) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat Messages
CREATE TABLE chat_messages (
  id VARCHAR PRIMARY KEY,
  session_id VARCHAR REFERENCES chat_sessions(id),
  text TEXT NOT NULL,
  is_user BOOLEAN NOT NULL,
  language VARCHAR(5) NOT NULL,
  translated_text TEXT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

## 🛠️ Setup Instructions

### 1. **Install Dependencies**
```bash
npm install @radix-ui/react-select lucide-react
```

### 2. **Environment Variables**
```env
# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# LibreTranslate API
LIBRETRANSLATE_API_URL=https://libretranslate.com/translate
LIBRETRANSLATE_API_KEY=your_api_key_if_needed

# Database
DATABASE_URL=your_database_connection_string
```

### 3. **Browser Permissions**
```typescript
// Request microphone permission
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('Microphone access granted'))
  .catch(() => console.log('Microphone access denied'));
```

## 📱 Mobile Optimization

### Responsive Design
- **Touch-friendly**: Large buttons for mobile interaction
- **Voice Priority**: Prominent microphone button
- **Auto-scroll**: Messages automatically scroll to bottom
- **Swipe Support**: Gesture navigation

### Performance
- **Lazy Loading**: Components load on demand
- **Memoization**: Prevent unnecessary re-renders
- **Optimistic Updates**: Immediate UI feedback

## 🔮 Future Enhancements

### Advanced Features
- **Offline Mode**: PWA with offline chat capability
- **Image Context**: Send crop photos with chat messages
- **Smart Suggestions**: Predictive text based on context
- **Voice Commands**: "Ask about tomato diseases"

### AI Improvements
- **Context Memory**: Remember previous conversations
- **Personalization**: Adapt to farmer's specific needs
- **Integration**: Connect with weather and crop data

### Additional Languages
- **Regional Support**: More Indian languages
- **Dialect Recognition**: Local language variants
- **Cultural Context**: Region-specific farming advice

## 🚨 Error Handling

### Voice Input Errors
```typescript
recognition.onerror = (event) => {
  switch(event.error) {
    case 'no-speech':
      showToast('No speech detected. Please try again.');
      break;
    case 'network':
      showToast('Network error. Check your connection.');
      break;
    default:
      showToast('Voice recognition failed. Using text input.');
  }
};
```

### API Fallbacks
```typescript
const getAIResponse = async (message, language) => {
  try {
    // Primary: Gemini API
    return await callGeminiAPI(message, language);
  } catch (error) {
    // Fallback: Local responses
    return getLocalResponse(message, language);
  }
};
```

This multilingual chat system provides farmers with an intuitive, accessible way to get farming advice in their preferred language, making agricultural technology more inclusive and user-friendly.
