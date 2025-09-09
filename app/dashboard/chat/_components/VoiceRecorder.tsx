"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  language: string;
  speechCode: string;
  className?: string;
}

export function VoiceRecorder({
  onTranscript,
  language,
  speechCode,
  className,
}: VoiceRecorderProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setIsSupported(false);
        return;
      }

      // Initialize Speech Recognition
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;

      // Set language
      recognitionRef.current.lang = speechCode;

      // Event handlers
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        // Auto-stop after 10 seconds
        timeoutRef.current = setTimeout(() => {
          stopListening();
        }, 10000);
      };

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        stopListening();
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        stopListening();
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [speechCode, onTranscript]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.lang = speechCode;
        recognitionRef.current.start();
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
    }
    setIsListening(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <Button
        variant="ghost"
        size="sm"
        disabled
        className={cn("h-8 w-8 p-0 text-gray-400", className)}
        title="Voice input not supported in this browser"
      >
        <MicOff className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleListening}
      className={cn(
        "h-8 w-8 p-0 transition-all duration-200",
        isListening
          ? "text-red-600 bg-red-50 hover:bg-red-100 animate-pulse"
          : "text-gray-500 hover:text-green-600 hover:bg-green-50",
        className
      )}
      title={isListening ? "Stop recording" : "Start voice input"}
    >
      {isListening ? (
        <div className="relative">
          <Mic className="h-4 w-4" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
        </div>
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
