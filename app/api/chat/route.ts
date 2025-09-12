import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

// Initialize Google services
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Initialize Google Cloud TTS
let ttsClient: TextToSpeechClient | null = null;
try {
  if (process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY) {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY);
    ttsClient = new TextToSpeechClient({
      credentials,
      projectId: credentials.project_id,
    });
  }
} catch (error) {
  console.error("Failed to initialize TTS client:", error);
}

// Types
interface ChatRequest {
  transcript: string;
  language: string;
  userId?: string;
  location?: {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
    country: string;
  };
}

interface ChatResponse {
  transcript: string;
  language: string;
  replyText: string;
  audioBase64: string | null;
  warnings: string[];
}

interface Tool {
  name: string;
  triggerFn: (text: string) => boolean;
  handlerFn: (text: string, language: string, location?: any) => Promise<string>;
}

// Language configurations
const LANGUAGE_CONFIG = {
  en: {
    name: "English",
    speechCode: "en-US",
    ttsVoice: "en-US-Standard-D", // Standard English voice
  },
  hi: {
    name: "Hindi", 
    speechCode: "hi-IN",
    ttsVoice: "hi-IN-Standard-A", // Standard Hindi voice
  },
  ta: {
    name: "Tamil",
    speechCode: "ta-IN", 
    ttsVoice: "ta-IN-Standard-A", // Standard Tamil voice
  }
};

// Weather tool with location support
const weatherTool: Tool = {
  name: "weather",
  triggerFn: (text: string) => {
    const weatherKeywords = {
      en: ["weather", "temperature", "rain", "climate", "forecast", "irrigation", "field work"],
      hi: ["मौसम", "तापमान", "बारिश", "जलवायु", "पूर्वानुमान", "सिंचाई", "खेत"],
      ta: ["வானிலை", "வெப்பநிலை", "மழை", "காலநிலை", "முன்னறிவிப்பு", "நீர்ப்பாசனம்"]
    };
    
    const allKeywords = Object.values(weatherKeywords).flat();
    return allKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  },
  handlerFn: async (text: string, language: string, location?: any) => {
    try {
      // Build weather API URL with location if available
      let weatherUrl = 'http://localhost:3000/api/weather';
      if (location?.latitude && location?.longitude) {
        weatherUrl += `?lat=${location.latitude}&lng=${location.longitude}`;
      } else if (location?.city) {
        weatherUrl += `?city=${encodeURIComponent(location.city)}`;
      }

      const response = await fetch(weatherUrl);
      const data = await response.json();
      
      if (data.error) {
        return "Sorry, I couldn't fetch weather information right now.";
      }

      const weatherInfo = `Current weather in ${data.location.name}, ${data.location.region}:
🌡️ Temperature: ${data.current.temperature}°C (feels like ${data.current.feelsLike}°C)
☁️ Condition: ${data.current.condition}
💧 Humidity: ${data.current.humidity}%
💨 Wind: ${data.current.windSpeed} km/h ${data.current.windDirection}
🔆 UV Index: ${data.current.uvIndex}

🚜 Farming Advice:
• Irrigation: ${data.farming.irrigation}
• Field Work: ${data.farming.fieldWork}
• Pest Risk: ${data.farming.pestRisk}
• General: ${data.farming.generalAdvice}`;

      return weatherInfo;
    } catch (error) {
      console.error("Weather API error:", error);
      return "Sorry, I couldn't fetch weather information right now.";
    }
  }
};

// News tool
const newsTool: Tool = {
  name: "news",
  triggerFn: (text: string) => {
    const newsKeywords = {
      en: ["news", "latest", "headlines", "agriculture news", "farming news"],
      hi: ["समाचार", "ताजा", "शीर्षक", "कृषि समाचार", "खेती समाचार"],
      ta: ["செய்திகள்", "சமீபத்திய", "தலைப்புகள்", "விவசாய செய்திகள்"]
    };
    
    const allKeywords = Object.values(newsKeywords).flat();
    return allKeywords.some(keyword => text.toLowerCase().includes(keyword.toLowerCase()));
  },
  handlerFn: async (text: string, language: string, location?: any) => {
    try {
      // For demo, return mock agriculture news
      const mockNews = {
        en: "Latest Agriculture News: Government announces new subsidy scheme for organic farming. Monsoon forecast shows good rainfall expected this season.",
        hi: "नवीनतम कृषि समाचार: सरकार ने जैविक खेती के लिए नई सब्सिडी योजना की घोषणा की। मानसून पूर्वानुमान इस मौसम में अच्छी बारिश की उम्मीद दिखाता है।",
        ta: "சமீபத்திய விவசாய செய்திகள்: இயற்கை விவசாயத்துக்கு அரசு புதிய மானியத் திட்டத்தை அறிவித்துள்ளது. இந்த பருவத்தில் நல்ல மழை எதிர்பார்க்கப்படுகிறது."
      };
      
      return mockNews[language as keyof typeof mockNews] || mockNews.en;
    } catch (error) {
      console.error("News API error:", error);
      return "Sorry, I couldn't fetch news right now.";
    }
  }
};

// Tool registry - easy to extend
const TOOLS: Tool[] = [weatherTool, newsTool];

// Intent detection and tool routing
async function detectIntentAndRoute(text: string, language: string, location?: any): Promise<string> {
  // Check if any tool should handle this request
  for (const tool of TOOLS) {
    if (tool.triggerFn(text)) {
      const toolResult = await tool.handlerFn(text, language, location);
      return `${toolResult}\n\n`; // Add context for Gemini
    }
  }
  
  return ""; // No tool matched, return empty context
}

// Generate AI response using Gemini
async function generateGeminiResponse(userInput: string, language: string, toolContext: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const languageNames = {
      en: "English",
      hi: "Hindi", 
      ta: "Tamil"
    };
    
    const prompt = `You are a helpful farming assistant. Respond in ${languageNames[language as keyof typeof languageNames] || "English"} language only.
    
    User question: ${userInput}
    
    ${toolContext ? `Additional context: ${toolContext}` : ""}
    
    Provide a helpful, concise response for farmers. Keep it practical and actionable. Maximum 100 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    
    // Fallback responses
    const fallbackResponses = {
      en: "I understand your farming question. For specific advice, please consult local agricultural experts.",
      hi: "मैं आपके किसानी के सवाल को समझता हूं। विशिष्ट सलाह के लिए, कृपया स्थानीय कृषि विशेषज्ञों से संपर्क करें।",
      ta: "உங்கள் விவசாய கேள்வியை நான் புரிந்துகொள்கிறேன். குறிப்பிட்ட ஆலோசனைக்கு, உள்ளூர் விவசாய நிபுணர்களை தொடர்பு கொள்ளுங்கள்."
    };
    
    return fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en;
  }
}

// Text-to-Speech conversion
async function convertTextToSpeech(text: string, language: string): Promise<string | null> {
  if (!ttsClient) {
    console.error("TTS client not initialized");
    return null;
  }

  try {
    const languageConfig = LANGUAGE_CONFIG[language as keyof typeof LANGUAGE_CONFIG];
    if (!languageConfig) {
      console.error("Unsupported language:", language);
      return null;
    }

    const request = {
      input: { text },
      voice: {
        languageCode: languageConfig.speechCode,
        name: languageConfig.ttsVoice,
      },
      audioConfig: {
        audioEncoding: "MP3" as const,
        speakingRate: 1.0,
        pitch: 0.0,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    
    if (response.audioContent) {
      return Buffer.from(response.audioContent).toString('base64');
    }
    
    return null;
  } catch (error) {
    console.error("TTS conversion error:", error);
    return null;
  }
}

// Main chat endpoint
export async function POST(request: NextRequest) {
  try {
    const { transcript, language, userId, location }: ChatRequest = await request.json();
    const warnings: string[] = [];
    
    if (!transcript || !language) {
      return NextResponse.json(
        { error: "Missing required fields: transcript, language" },
        { status: 400 }
      );
    }

    // 1. Detect intent and route to appropriate tool (with location support)
    const toolContext = await detectIntentAndRoute(transcript, language, location);
    
    // 2. Generate AI response with Gemini (including tool context if available)
    const replyText = await generateGeminiResponse(transcript, language, toolContext);
    
    // 3. Convert response to speech
    let audioBase64: string | null = null;
    try {
      audioBase64 = await convertTextToSpeech(replyText, language);
      if (!audioBase64) {
        warnings.push("Voice synthesis failed");
      }
    } catch (error) {
      console.error("TTS error:", error);
      warnings.push("Voice synthesis error");
    }

    const response: ChatResponse = {
      transcript,
      language,
      replyText,
      audioBase64,
      warnings,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
