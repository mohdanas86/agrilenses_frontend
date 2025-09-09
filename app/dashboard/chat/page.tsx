"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  MessageCircle,
  Languages,
  User,
  Bot,
  Loader2,
} from "lucide-react";
import {
  ChatMessage as ChatMessageComponent,
  VoiceRecorder,
  LanguageSelector,
  useChatState,
} from "./_components";

// Types
export interface ChatMessageType {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  language: string;
  translatedText?: string;
  audioUrl?: string;
}

export interface Language {
  code: string;
  name: string;
  speechCode: string;
  flag: string;
}

const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", speechCode: "en-US", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", speechCode: "hi-IN", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", speechCode: "ta-IN", flag: "🇮🇳" },
];

export default function ChatPage() {
  const {
    messages,
    isLoading,
    currentLanguage,
    setCurrentLanguage,
    sendMessage,
    speakMessage,
    isPlaying,
  } = useChatState();

  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    await sendMessage(inputText, currentLanguage);
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = (transcript: string) => {
    setInputText(transcript);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Style Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Language Selector */}
            <div className="flex items-center gap-3 justify-between w-full">
              <Badge variant="outline" className="text-xs">
                {
                  SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)
                    ?.flag
                }{" "}
                {
                  SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage)
                    ?.name
                }
              </Badge>
              <LanguageSelector
                languages={SUPPORTED_LANGUAGES}
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="flex h-[calc(100vh-73px)]">
        {/* ChatGPT Style Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col w-full">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-4">
              <div className="py-8">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center mb-6">
                      <Bot className="h-7 w-7 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      How can I help you today?
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md">
                      Ask me anything about farming, crops, diseases, weather,
                      or agricultural techniques
                    </p>

                    {/* Quick Start Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                      {[
                        {
                          title: "Crop Disease Help",
                          desc: "Identify and treat plant diseases",
                          icon: "🌿",
                        },
                        {
                          title: "Weather Advice",
                          desc: "Get weather-based farming tips",
                          icon: "🌦️",
                        },
                        {
                          title: "Pest Control",
                          desc: "Learn organic pest management",
                          icon: "🐛",
                        },
                        {
                          title: "Soil Management",
                          desc: "Improve soil health and nutrition",
                          icon: "🌱",
                        },
                      ].map((card, index) => (
                        <button
                          key={index}
                          onClick={() =>
                            setInputText(
                              `Tell me about ${card.title.toLowerCase()}`
                            )
                          }
                          className="p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-xl">{card.icon}</span>
                            <span className="font-medium text-gray-900">
                              {card.title}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{card.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((message: ChatMessageType) => (
                      <ChatMessageComponent
                        key={message.id}
                        message={message}
                        onSpeak={speakMessage}
                        isPlaying={isPlaying === message.id}
                        supportedLanguages={SUPPORTED_LANGUAGES}
                        currentLanguage={currentLanguage}
                      />
                    ))}
                    {isLoading && (
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.1s]"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            </div>
                            <span className="text-sm text-gray-600">
                              Thinking...
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Style Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <div className="flex items-end gap-3 bg-gray-100 rounded-lg p-3">
                    <div className="flex-1 relative">
                      <Input
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Message FarmGPT..."
                        className="border-0 bg-transparent resize-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none p-0 min-h-[24px]"
                        disabled={isLoading}
                      />
                    </div>

                    {/* Voice Button */}
                    <VoiceRecorder
                      onTranscript={handleVoiceInput}
                      language={currentLanguage}
                      speechCode={
                        SUPPORTED_LANGUAGES.find(
                          (l) => l.code === currentLanguage
                        )?.speechCode || "en-US"
                      }
                      className="flex-shrink-0"
                    />

                    {/* Send Button */}
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isLoading}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 rounded-md p-2 h-8 w-8 flex-shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">
                  ChatBot can make mistakes. Consider checking important
                  information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:flex w-80 border-l border-gray-200 bg-gray-50 flex-col">
          <div className="p-4 space-y-4">
            {/* Supported Languages */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Supported Languages
              </h3>
              <div className="space-y-2">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <div
                    key={lang.code}
                    className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                      currentLanguage === lang.code
                        ? "bg-green-50 text-green-800"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                    {currentLanguage === lang.code && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-xs bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                  <Mic className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-700">
                    Voice input support
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                  <Volume2 className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700">Text-to-speech</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                  <Languages className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-700">
                    Multi-language chat
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors">
                  <MessageCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-gray-700">
                    Real-time responses
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
