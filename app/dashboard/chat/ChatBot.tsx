"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  MessageCircle,
  Languages,
  User,
  Bot,
  Loader2,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { getLocation } from "@/lib/location";

// Types
interface Location {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  address: string;
}

export type ChatMessageType = ChatMessage;
interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
  audioBase64?: string;
  translatedText?: string;
}

export type Language = {
  code: string;
  name: string;
  speechCode: string;
  flag: string;
};

interface ChatResponse {
  transcript: string;
  language: string;
  replyText: string;
  audioBase64: string | null;
  warnings: string[];
}

// Language configurations
const LANGUAGES: Language[] = [
  { code: "en", name: "English", speechCode: "en-US", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", speechCode: "hi-IN", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", speechCode: "ta-IN", flag: "🇮🇳" },
];

// Speech Recognition hook
function useSpeechRecognition(language: string) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startListening = useCallback(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang =
        LANGUAGES.find((l) => l.code === language)?.speechCode || "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        setTranscript("");

        // Auto-stop after 15 seconds
        timeoutRef.current = setTimeout(() => {
          recognition.stop();
        }, 15000);
      };

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript.trim());
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setError("Speech recognition error: " + event.error);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setError("Failed to start speech recognition");
      setIsListening(false);
    }
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
}

// Audio player hook
function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioBase64: string, messageId: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
      audio.onplay = () => setIsPlaying(messageId);
      audio.onended = () => setIsPlaying(null);
      audio.onerror = () => setIsPlaying(null);

      audioRef.current = audio;
      audio.play();
    } catch (error) {
      console.error("Audio playback error:", error);
      setIsPlaying(null);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(null);
  }, []);

  return { isPlaying, playAudio, stopAudio };
}

export default function ChatBot({ heightValue }: { heightValue: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<Location | null>(null);

  const {
    isListening,
    transcript,
    error: speechError,
    startListening,
    stopListening,
  } = useSpeechRecognition(currentLanguage);
  const { isPlaying, playAudio, stopAudio } = useAudioPlayer();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get user location on component mount
  useEffect(() => {
    async function detectLocation() {
      console.log("Starting location detection...");
      const location = await getLocation(); // This never throws, always returns a location
      setUserLocation(location);
      console.log("Location set:", location);
    }

    detectLocation();
  }, []);

  // Handle speech transcript
  useEffect(() => {
    if (transcript && !isListening) {
      setInputText(transcript);
    }
  }, [transcript, isListening]);

  // Send message function
  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
      language: currentLanguage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setWarnings([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript: text.trim(),
          language: currentLanguage,
          userId: "demo-user", // In production, get from auth
          location: userLocation, // Include location data
        }),
      });

      if (!response.ok) {
        throw new Error("Chat API request failed");
      }

      const data: ChatResponse = await response.json();

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: data.replyText,
        isUser: false,
        timestamp: new Date(),
        language: currentLanguage,
        audioBase64: data.audioBase64 || undefined,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setWarnings(data.warnings || []);
    } catch (error) {
      console.error("Chat error:", error);

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        text: "Sorry, I couldn't process that. Please try again.",
        isUser: false,
        timestamp: new Date(),
        language: currentLanguage,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const currentLangConfig = LANGUAGES.find((l) => l.code === currentLanguage);

  return (
    <div className={`flex flex-col ${heightValue} bg-white`}>
      {/* Header - ChatGPT style */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-3 w-full">
              {/* Location indicator */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border">
                <MapPin className="h-3 w-3 text-gray-500" />
                <span className="text-xs text-gray-600">
                  {userLocation ? `${userLocation.city}` : "Locating..."}
                </span>
              </div>
              {/* Language selector */}
              <Select
                value={currentLanguage}
                onValueChange={setCurrentLanguage}
              >
                <SelectTrigger className="w-[120px] h-8 text-xs border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem
                      key={lang.code}
                      value={lang.code}
                      className="text-xs"
                    >
                      {lang.flag} {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="mt-3 flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0" />
              <span className="text-sm text-amber-700">
                {warnings.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Messages area - ChatGPT style */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full px-4 py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  How can I help you today?
                </h2>
                <p className="text-gray-500 text-center max-w-md mb-8">
                  I'm your AI farming assistant. Ask me about weather, crop
                  diseases, farming techniques, or any agricultural questions.
                </p>

                {/* Quick action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                  <button
                    onClick={() =>
                      setInputText("What's the weather like for farming today?")
                    }
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      Weather Update
                    </div>
                    <div className="text-xs text-gray-500">
                      Get current weather for farming
                    </div>
                  </button>
                  <button
                    onClick={() =>
                      setInputText("How do I identify plant diseases?")
                    }
                    className="p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-sm font-medium text-gray-900">
                      Disease Help
                    </div>
                    <div className="text-xs text-gray-500">
                      Learn about plant diseases
                    </div>
                  </button>
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`border-b border-gray-100 ${
                  message.isUser ? "bg-white" : "bg-gray-50"
                }`}
              >
                <div className="max-w-4xl mx-auto px-4 py-6">
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {message.isUser ? (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Message content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {message.isUser ? "You" : "AgriLens Assistant"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {message.text}
                        </p>
                      </div>

                      {/* Audio controls for AI messages */}
                      {!message.isUser && message.audioBase64 && (
                        <div className="mt-3 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs hover:bg-gray-100"
                            onClick={() => {
                              if (isPlaying === message.id) {
                                stopAudio();
                              } else {
                                playAudio(message.audioBase64!, message.id);
                              }
                            }}
                          >
                            {isPlaying === message.id ? (
                              <VolumeX className="h-3 w-3 mr-1" />
                            ) : (
                              <Volume2 className="h-3 w-3 mr-1" />
                            )}
                            {isPlaying === message.id ? "Stop" : "Listen"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading state */}
            {isLoading && (
              <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-6">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          AgriLens Assistant
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input area - ChatGPT style */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {speechError && (
            <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{speechError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-end gap-2 p-3 border border-gray-300 rounded-xl bg-white shadow-sm focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
              <div className="flex-1 min-h-[24px] max-h-32">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Message AgriLens Assistant... (${currentLangConfig?.name})`}
                  disabled={isLoading || isListening}
                  className="w-full resize-none border-0 outline-none placeholder-gray-400 text-gray-900 text-sm leading-6 min-h-[24px] max-h-32"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
              </div>

              <div className="flex items-center gap-1">
                {/* Voice button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${
                    isListening
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={handleVoiceToggle}
                  disabled={isLoading}
                  title={isListening ? "Stop recording" : "Start voice input"}
                >
                  {isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                </Button>

                {/* Send button */}
                <Button
                  type="submit"
                  size="sm"
                  disabled={!inputText.trim() || isLoading}
                  className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Listening indicator */}
            {isListening && (
              <div className="absolute -top-8 left-3 flex items-center gap-2 px-2 py-1 bg-red-100 text-red-600 rounded-md text-xs">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening...
              </div>
            )}
          </form>

          <p className="text-xs text-gray-500 mt-2 text-center">
            AgriLens can make mistakes. Consider checking important farming
            information.
          </p>
        </div>
      </div>
    </div>
  );
}
