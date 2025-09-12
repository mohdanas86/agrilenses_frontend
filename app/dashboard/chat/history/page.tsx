"use client";

import { useState, useEffect } from "react";
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
  History,
  Search,
  Calendar,
  MessageCircle,
  Filter,
  Download,
  Trash2,
  Volume2,
  Languages,
} from "lucide-react";
import { ChatMessage as ChatMessageComponent } from "../_components";
import type { ChatMessageType, Language } from "../page";

// Mock data for chat history
const MOCK_CHAT_SESSIONS = [
  {
    id: "session-1",
    date: new Date(2025, 8, 10, 14, 30),
    language: "en",
    messages: [
      {
        id: "msg-1",
        text: "How to treat tomato blight?",
        isUser: true,
        timestamp: new Date(2025, 8, 10, 14, 30),
        language: "en",
      },
      {
        id: "msg-2",
        text: "To treat tomato blight, use copper-based fungicides, ensure proper air circulation, remove affected leaves, and avoid overhead watering. Apply preventive measures like crop rotation and resistant varieties.",
        isUser: false,
        timestamp: new Date(2025, 8, 10, 14, 31),
        language: "en",
      },
    ],
  },
  {
    id: "session-2",
    date: new Date(2025, 8, 9, 10, 15),
    language: "hi",
    messages: [
      {
        id: "msg-3",
        text: "धान की खेती के लिए सबसे अच्छा समय कब है?",
        isUser: true,
        timestamp: new Date(2025, 8, 9, 10, 15),
        language: "hi",
      },
      {
        id: "msg-4",
        text: "धान की खेती के लिए मानसून का समय सबसे अच्छा होता है। जून-जुलाई में बुआई करनी चाहिए। मिट्टी में पर्याप्त नमी और तापमान 25-35°C होना चाहिए।",
        isUser: false,
        timestamp: new Date(2025, 8, 9, 10, 16),
        language: "hi",
      },
    ],
  },
  {
    id: "session-3",
    date: new Date(2025, 8, 8, 16, 45),
    language: "ta",
    messages: [
      {
        id: "msg-5",
        text: "இயற்கை பூச்சி கட்டுப்பாட்டு முறைகள் என்ன?",
        isUser: true,
        timestamp: new Date(2025, 8, 8, 16, 45),
        language: "ta",
      },
      {
        id: "msg-6",
        text: "இயற்கை பூச்சி கட்டுப்பாட்டுக்கு நீம் எண்ணெய், பூண்டு கரைசல், மஞ்சள் பொறிகள், பயனுள்ள பூச்சிகளை பயன்படுத்தலாம். மண்புழு உரம் மற்றும் தாவர சாறுகள் பயன்படுத்துங்கள்.",
        isUser: false,
        timestamp: new Date(2025, 8, 8, 16, 46),
        language: "ta",
      },
    ],
  },
];

const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", speechCode: "en-US", flag: "🇺🇸" },
  { code: "hi", name: "हिंदी", speechCode: "hi-IN", flag: "🇮🇳" },
  { code: "ta", name: "தமிழ்", speechCode: "ta-IN", flag: "🇮🇳" },
];

export default function ChatHistoryPage() {
  const [chatSessions, setChatSessions] = useState(MOCK_CHAT_SESSIONS);
  const [filteredSessions, setFilteredSessions] = useState(MOCK_CHAT_SESSIONS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Filter sessions based on search and filters
  useEffect(() => {
    let filtered = chatSessions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((session) =>
        session.messages.some((msg) =>
          msg.text.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Language filter
    if (selectedLanguage !== "all") {
      filtered = filtered.filter(
        (session) => session.language === selectedLanguage
      );
    }

    // Date range filter
    if (selectedDateRange !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (selectedDateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter((session) => session.date >= filterDate);
    }

    setFilteredSessions(filtered);
  }, [searchTerm, selectedLanguage, selectedDateRange, chatSessions]);

  // Load chat history from backend
  const loadChatHistory = async () => {
    setIsLoading(true);
    try {
      // Mock API call - implement actual backend integration
      // const response = await fetch("/api/chat/history/user-123");
      // const data = await response.json();
      // setChatSessions(data);

      // For now, using mock data
      console.log("Loading chat history...");
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChatHistory();
  }, []);

  const handleSpeak = (messageId: string, text: string, language: string) => {
    // Implement TTS functionality (same as in chat page)
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang =
      language === "hi" ? "hi-IN" : language === "ta" ? "ta-IN" : "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleExportChat = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (!session) return;

    const chatText = session.messages
      .map((msg) => `${msg.isUser ? "You" : "AI"}: ${msg.text}`)
      .join("\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${session.date.toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteChat = (sessionId: string) => {
    if (confirm("Are you sure you want to delete this chat session?")) {
      setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* ChatGPT Style Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <History className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Chat History
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Clean Filters Bar */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-400 bg-white"
              />
            </div>

            {/* Language Filter */}
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-400 bg-white">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Select
              value={selectedDateRange}
              onValueChange={setSelectedDateRange}
            >
              <SelectTrigger className="border-gray-200 focus:border-blue-400 bg-white">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Action Button */}
            <Button
              onClick={loadChatHistory}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              {isLoading ? "Loading..." : "Refresh"}
            </Button>
          </div>
        </div>

        {/* Chat Sessions */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No conversations found
              </h3>
              <p className="text-gray-500">
                {searchTerm ||
                selectedLanguage !== "all" ||
                selectedDateRange !== "all"
                  ? "Try adjusting your search filters"
                  : "Start a conversation to see your chat history here"}
              </p>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Session Header */}
                <div className="border-b border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {session.date.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {session.date.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Languages className="h-3 w-3" />
                        {
                          SUPPORTED_LANGUAGES.find(
                            (l) => l.code === session.language
                          )?.flag
                        }
                        {
                          SUPPORTED_LANGUAGES.find(
                            (l) => l.code === session.language
                          )?.name
                        }
                      </Badge>

                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleExportChat(session.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                          title="Export chat"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteChat(session.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-600"
                          title="Delete chat"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-4 bg-gray-50/30">
                  {session.messages.map((message) => (
                    <ChatMessageComponent
                      key={message.id}
                      message={message}
                      onSpeak={handleSpeak}
                      isPlaying={false}
                      supportedLanguages={SUPPORTED_LANGUAGES}
                      currentLanguage={session.language}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Clean Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {chatSessions.length}
            </div>
            <div className="text-sm text-gray-500">Total Conversations</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {chatSessions.reduce(
                (acc, session) => acc + session.messages.length,
                0
              )}
            </div>
            <div className="text-sm text-gray-500">Total Messages</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
            <div className="text-2xl font-semibold text-gray-900">
              {new Set(chatSessions.map((s) => s.language)).size}
            </div>
            <div className="text-sm text-gray-500">Languages Used</div>
          </div>
        </div>
      </main>
    </div>
  );
}
