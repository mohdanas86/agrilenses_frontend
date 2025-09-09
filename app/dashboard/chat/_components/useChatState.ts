"use client";

import { useState, useRef, useCallback } from "react";

// Import types from parent page
interface ChatMessageType {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
  translatedText?: string;
  audioUrl?: string;
}

// Types for API responses
interface TranslationResponse {
  translatedText: string;
}

interface ChatResponse {
  response: string;
  translatedResponse?: string;
}

export function useChatState() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const speechSynthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Get available voices for different languages
  const getVoiceForLanguage = useCallback((langCode: string) => {
    const voices = window.speechSynthesis.getVoices();
    
    const voiceMap: { [key: string]: string[] } = {
      'en': ['en-US', 'en-GB', 'en'],
      'hi': ['hi-IN', 'hi'],
      'ta': ['ta-IN', 'ta']
    };

    const preferredLangs = voiceMap[langCode] || ['en-US'];
    
    for (const prefLang of preferredLangs) {
      const voice = voices.find(v => v.lang.startsWith(prefLang));
      if (voice) return voice;
    }
    
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  }, []);

  // Translate text using LibreTranslate API
  const translateText = async (text: string, targetLanguage: string): Promise<string> => {
    try {
      // For now, we'll use a mock translation or return original text
      // In production, implement LibreTranslate API call
      
      // Mock translation responses for demo
      const mockTranslations: { [key: string]: { [key: string]: string } } = {
        "en": {
          "How to treat tomato blight?": "How to treat tomato blight?",
          "टमाटर के झुलसा रोग का इलाज कैसे करें?": "How to treat tomato blight?",
          "தக்காளி ப்ளைட் நோயை எப்படி குணப்படுத்துவது?": "How to treat tomato blight?"
        },
        "hi": {
          "How to treat tomato blight?": "टमाटर के झुलसा रोग का इलाज कैसे करें?",
          "टमाटर के झुलसा रोग का इलाज कैसे करें?": "टमाटर के झुलसा रोग का इलाज कैसे करें?",
          "தக்காளி ப்ளைட் நோயை எப்படி குணப்படுத்துவது?": "टमाटर के झुलसा रोग का इलाज कैसे करें?"
        },
        "ta": {
          "How to treat tomato blight?": "தக்காளி ப்ளைட் நோயை எப்படி குணப்படுத்துவது?",
          "टमाटर के झुलसा रोग का इलाज कैसे करें?": "தக்காளி ப்ளைட் நோயை எப்படி குணப்படுத்துவது?",
          "தக்காளி ப்ளைட் நோயை எப்படி குணப்படுத்துவது?": "தக்காளி ப்ளைட் நோயை எப்படி குணப்படுத்துவது?"
        }
      };

      return mockTranslations[targetLanguage]?.[text] || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  };

  // Get AI response from Gemini API
  const getAIResponse = async (message: string, language: string): Promise<ChatResponse> => {
    try {
      // Mock AI responses for demo - in production, use Gemini API
      const mockResponses: { [key: string]: string } = {
        "How to treat tomato blight?": "To treat tomato blight, use copper-based fungicides, ensure proper air circulation, remove affected leaves, and avoid overhead watering. Apply preventive measures like crop rotation and resistant varieties.",
        "टमाटर के झुलसा रोग का इलाज कैसे करें?": "टमाटर के झुलसा रोग के लिए तांबा आधारित कवकनाशी का उपयोग करें, उचित हवा का संचार सुनिश्चित करें, प्रभावित पत्तियों को हटाएं, और ऊपर से पानी देने से बचें।",
        "தக்காளி ப்ளைட் நோயை எப்படி குணப்படுத்துவது?": "தக்காளி ப்ளைட் நோயை குணப்படுத்த, செம்பு அடிப்படையிலான பூஞ்சைக் கொல்லிகளைப் பயன்படுத்துங்கள், சரியான காற்று சுழற்சியை உறுதி செய்யுங்கள், பாதிக்கப்பட்ட இலைகளை அகற்றுங்கள்."
      };

      const response = mockResponses[message] || 
        `I understand you're asking about "${message}". For accurate agricultural advice, I recommend consulting with local farming experts. Here are some general farming tips: maintain soil health, practice crop rotation, monitor weather conditions, and use integrated pest management techniques.`;

      return { response };
    } catch (error) {
      console.error("AI response error:", error);
      return { 
        response: "I'm sorry, I'm having trouble processing your request right now. Please try again later." 
      };
    }
  };

  // Send message function
  const sendMessage = async (text: string, language: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessageType = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
      language,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Get AI response
      const aiResponse = await getAIResponse(text, language);
      
      const aiMessage: ChatMessageType = {
        id: `ai-${Date.now()}`,
        text: aiResponse.response,
        isUser: false,
        timestamp: new Date(),
        language,
        translatedText: aiResponse.translatedResponse,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to backend (mock for now)
      await saveChatToBackend(userMessage, aiMessage);

    } catch (error) {
      console.error("Error sending message:", error);
      
      const errorMessage: ChatMessageType = {
        id: `error-${Date.now()}`,
        text: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
        language,
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-Speech function
  const speakMessage = useCallback((messageId: string, text: string, language: string) => {
    // Stop any current speech
    if (speechSynthRef.current) {
      window.speechSynthesis.cancel();
      setIsPlaying(null);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getVoiceForLanguage(language);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsPlaying(messageId);
    };

    utterance.onend = () => {
      setIsPlaying(null);
      speechSynthRef.current = null;
    };

    utterance.onerror = () => {
      setIsPlaying(null);
      speechSynthRef.current = null;
    };

    speechSynthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [getVoiceForLanguage]);

  // Save chat to backend (mock implementation)
  const saveChatToBackend = async (userMessage: ChatMessageType, aiMessage: ChatMessageType) => {
    try {
      // Mock API call - implement actual backend integration
      const chatData = {
        userId: "user-123", // Get from auth context
        userMessage,
        aiMessage,
        timestamp: new Date().toISOString(),
      };
      
      console.log("Saving chat to backend:", chatData);
      
      // In production, make actual API call:
      // await fetch("/api/chat/save", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(chatData),
      // });
      
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  return {
    messages,
    isLoading,
    currentLanguage,
    setCurrentLanguage,
    sendMessage,
    speakMessage,
    isPlaying,
  };
}
