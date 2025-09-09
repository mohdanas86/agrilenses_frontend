"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX, User, Bot, Copy, Check } from "lucide-react";
import type { ChatMessageType, Language } from "../page";

interface ChatMessageProps {
  message: ChatMessageType;
  onSpeak: (messageId: string, text: string, language: string) => void;
  isPlaying: boolean;
  supportedLanguages: Language[];
  currentLanguage: string; // Add current language prop
}

export function ChatMessage({
  message,
  onSpeak,
  isPlaying,
  supportedLanguages,
  currentLanguage, // Add current language parameter
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (language: string) => {
    onSpeak(message.id, message.text, language);
  };

  return (
    <div
      className={`flex gap-3 ${
        message.isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex gap-3 lg:max-w-[80%] max-w-[90%] ${
          message.isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.isUser
              ? "bg-green-600 text-white"
              : "bg-blue-600 text-white"
          }`}
        >
          {message.isUser ? (
            <User className="h-4 w-4" />
          ) : (
            <Bot className="h-4 w-4" />
          )}
        </div>

        {/* Message Content */}
        <div
          className={`rounded-lg p-3 shadow-sm ${
            message.isUser
              ? "bg-green-600 text-white"
              : "bg-white border border-gray-200"
          }`}
        >
          {/* Message Text */}
          <div className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
            {message.text}
          </div>

          {/* Translated Text (if different from original) */}
          {message.translatedText &&
            message.translatedText !== message.text && (
              <div
                className={`mt-2 pt-2 border-t text-sm opacity-80 ${
                  message.isUser ? "border-green-400" : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-xs">📝 Translation:</span>
                </div>
                <div className="italic">{message.translatedText}</div>
              </div>
            )}

          {/* Message Actions */}
          <div className="flex items-center justify-between mt-3 gap-2">
            {/* Timestamp & Language */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${
                  message.isUser ? "text-green-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              {/* <Badge
                variant="secondary"
                className={`text-xs ${
                  message.isUser
                    ? "bg-green-500 text-green-100 hover:bg-green-400"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {
                  supportedLanguages.find((l) => l.code === message.language)
                    ?.flag
                }{" "}
                {
                  supportedLanguages.find((l) => l.code === message.language)
                    ?.name
                }
              </Badge> */}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              {/* Copy Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className={`h-6 w-6 p-0 ${
                  message.isUser
                    ? "text-green-100 hover:bg-green-500"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>

              {/* TTS Buttons - Only for AI responses and current language */}
              {!message.isUser && (
                <div className="flex gap-1">
                  {supportedLanguages
                    .filter((lang) => lang.code === currentLanguage)
                    .map((lang) => (
                      <Button
                        key={lang.code}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSpeak(lang.code)}
                        disabled={isPlaying}
                        className="h-6 px-2 text-xs text-gray-500 hover:bg-gray-100 flex items-center gap-1"
                        title={`Play in ${lang.name}`}
                      >
                        {isPlaying ? (
                          <VolumeX className="h-3 w-3" />
                        ) : (
                          <Volume2 className="h-3 w-3" />
                        )}
                        <span className="hidden sm:inline">{lang.flag}</span>
                      </Button>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
