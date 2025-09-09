import { NextRequest, NextResponse } from "next/server";

// Types
interface ChatRequest {
  message: string;
  language: string;
  userId: string;
}

interface TranslationRequest {
  text: string;
  source: string;
  target: string;
}

// Mock AI responses for different languages
const MOCK_AI_RESPONSES: { [key: string]: { [key: string]: string } } = {
  en: {
    "tomato": "For tomato diseases, use copper-based fungicides, ensure proper spacing for air circulation, and practice crop rotation. Remove infected plant parts immediately.",
    "rice": "Rice cultivation requires well-drained paddy fields, timely transplanting, and proper water management. Use high-yielding varieties suitable for your region.",
    "pest": "For organic pest control, use neem oil, introduce beneficial insects, set up pheromone traps, and maintain field hygiene.",
    "soil": "Soil health can be improved through organic matter addition, proper pH management, regular testing, and avoiding over-fertilization.",
    "weather": "Monitor weather forecasts regularly. Adjust irrigation schedules based on rainfall predictions and protect crops during extreme weather.",
    "default": "I understand your farming question. For specific agricultural advice, I recommend consulting with local agricultural extension officers. Here are some general farming best practices: maintain soil health, practice crop rotation, monitor for pests and diseases regularly, and use integrated farming approaches."
  },
  hi: {
    "tomato": "टमाटर के रोगों के लिए तांबा आधारित कवकनाशी का उपयोग करें, हवा के संचार के लिए उचित दूरी बनाए रखें, और फसल चक्र का अभ्यास करें। संक्रमित पौधे के हिस्सों को तुरंत हटा दें।",
    "rice": "धान की खेती के लिए अच्छी जल निकासी वाली धान की खेत, समय पर रोपाई, और उचित जल प्रबंधन की आवश्यकता होती है। अपने क्षेत्र के लिए उपयुक्त उच्च उत्पादन वाली किस्मों का उपयोग करें।",
    "pest": "जैविक कीट नियंत्रण के लिए नीम का तेल उपयोग करें, लाभकारी कीड़े पेश करें, फेरोमोन जाल लगाएं, और खेत की स्वच्छता बनाए रखें।",
    "soil": "मिट्टी के स्वास्थ्य में सुधार जैविक पदार्थ जोड़ने, उचित pH प्रबंधन, नियमित परीक्षण, और अधिक उर्वरक से बचने से हो सकता है।",
    "weather": "मौसम पूर्वानुमान की नियमित निगरानी करें। बारिश की भविष्यवाणी के आधार पर सिंचाई कार्यक्रम समायोजित करें और चरम मौसम के दौरान फसलों की सुरक्षा करें।",
    "default": "मैं आपके किसानी के सवाल को समझता हूं। विशिष्ट कृषि सलाह के लिए, मैं स्थानीय कृषि विस्तार अधिकारियों से सलाह लेने की सिफारिश करता हूं।"
  },
  ta: {
    "tomato": "தக்காளி நோய்களுக்கு செம்பு அடிப்படையிலான பூஞ்சைக் கொல்லிகளைப் பயன்படுத்துங்கள், காற்று சுழற்சிக்கு சரியான இடைவெளியை உறுதி செய்யுங்கள், மற்றும் பயிர் சுழற்சியை கடைபிடியுங்கள்.",
    "rice": "அரிசி விவசாயத்திற்கு நல்ல வடிகால் கொண்ட நெல் வயல்கள், சரியான நேரத்தில் நடுதல், மற்றும் சரியான நீர் மேலாண்மை தேவை।",
    "pest": "இயற்கை பூச்சி கட்டுப்பாட்டுக்கு வேப்ப எண்ணெய் பயன்படுத்துங்கள், பயனுள்ள பூச்சிகளை அறிமுகப்படுத்துங்கள், ஃபெரோமோன் பொறிகளை அமைத்து, வயல் சுத்தத்தை பராமரியுங்கள்.",
    "soil": "மண் ஆரோக்யத்தை கரிம பொருள் சேர்ப்பது, சரியான pH மேலாண்மை, வழக்கமான சோதனை, மற்றும் அதிக உரத்தை தவிர்ப்பதன் மூலம் மேம்படுத்தலாம்.",
    "weather": "வானிலை முன்னறிவிப்புகளை தொடர்ந்து கண்காணியுங்கள். மழை கணிப்புகளின் அடிப்படையில் நீர்ப்பாசன அட்டவணைகளை சரிசெய்து, கடுமையான வானிலையின் போது பயிர்களை பாதுகாத்துங்கள்.",
    "default": "உங்கள் விவசாய கேள்வியை நான் புரிந்துகொள்கிறேன். குறிப்பிட்ட விவசாய ஆலோசனைக்கு, உள்ளூர் விவசாய விரிவாக்க அதிகாரிகளுடன் ஆலோசிக்க பரிந்துரைக்கிறேன்."
  }
};

// Generate AI response based on input
function generateAIResponse(message: string, language: string): string {
  const lowerMessage = message.toLowerCase();
  const responses = MOCK_AI_RESPONSES[language] || MOCK_AI_RESPONSES.en;
  
  // Find the best matching response
  for (const [key, response] of Object.entries(responses)) {
    if (key !== "default" && lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return responses.default;
}

// Mock translation function (replace with LibreTranslate API)
async function translateText(text: string, source: string, target: string): Promise<string> {
  // For demo purposes, return same text or simple translations
  if (source === target) return text;
  
  const simpleTranslations: { [key: string]: { [key: string]: string } } = {
    "How to treat tomato blight?": {
      hi: "टमाटर के झुलसा रोग का इलाज कैसे करें?",
      ta: "தக்காளி ப்ளைட் நோயை எப்படி குணப்படுத்துவது?"
    },
    "What is the best time to plant rice?": {
      hi: "धान लगाने का सबसे अच्छा समय कब है?",
      ta: "அரிசி நடுவதற்கு சிறந்த நேரம் எது?"
    }
  };
  
  return simpleTranslations[text]?.[target] || text;
}

// Chat endpoint
export async function POST(request: NextRequest) {
  try {
    const { message, language, userId }: ChatRequest = await request.json();
    
    if (!message || !language || !userId) {
      return NextResponse.json(
        { error: "Missing required fields: message, language, userId" },
        { status: 400 }
      );
    }

    // Generate AI response
    const aiResponse = generateAIResponse(message, language);
    
    // For production, save to database
    const chatData = {
      id: `chat-${Date.now()}`,
      userId,
      userMessage: {
        text: message,
        language,
        timestamp: new Date().toISOString(),
      },
      aiResponse: {
        text: aiResponse,
        language,
        timestamp: new Date().toISOString(),
      },
    };

    console.log("Chat data:", chatData);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      chatId: chatData.id,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Translation endpoint
export async function PUT(request: NextRequest) {
  try {
    const { text, source, target }: TranslationRequest = await request.json();
    
    if (!text || !source || !target) {
      return NextResponse.json(
        { error: "Missing required fields: text, source, target" },
        { status: 400 }
      );
    }

    const translatedText = await translateText(text, source, target);
    
    return NextResponse.json({
      success: true,
      translatedText,
      source,
      target,
    });

  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}
