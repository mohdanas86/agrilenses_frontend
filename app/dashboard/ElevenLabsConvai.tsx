"use client";

import React, { useEffect, useState } from "react";
import { useConversation } from "@elevenlabs/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Sparkles, Phone } from "lucide-react";

export default function ElevenLabsConvai() {
  const [hasMicAccess, setHasMicAccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log("✅ Connected");
      setLoading(false);
    },
    onDisconnect: () => console.log("❌ Disconnected"),
    onError: (err) => {
      console.error("⚠️ Error:", err);
      setLoading(false);
    },
    onMessage: (msg) => console.log("💬 Message:", msg),
    onAudio: (audio) => console.log("🔊 Audio chunk:", audio),
  });

  // Ask for microphone access once
  useEffect(() => {
    const requestMic = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setHasMicAccess(true);
      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    };
    requestMic();
  }, []);

  const startConversation = async () => {
    try {
      setLoading(true);
      await conversation.startSession({
        agentId: "agent_6501k4we87cwee6s5b9qwp4rsnkm", // 👈 replace with your agent ID
        connectionType: "webrtc",
      });
    } catch (err) {
      console.error("Failed to start session:", err);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto rounded-3xl shadow-xl border bg-white/90 backdrop-blur-sm">
      <div className="text-base font-semibold flex items-center gap-2 text-emerald-700 p-4 pb-0">
        <Sparkles className="w-5 h-5 text-emerald-600" /> Need Help? Talk to Us
      </div>

      <CardContent className="p-3 px-5 text-center space-y-5">
        {!hasMicAccess && (
          <div className="flex flex-col items-center gap-3 text-gray-600">
            <MicOff className="w-8 h-8 text-red-500" />
            <p className="text-sm">
              Please allow microphone access to continue.
            </p>
          </div>
        )}

        {hasMicAccess && conversation.status !== "connected" && (
          <Button
            onClick={startConversation}
            disabled={loading}
            className="w-full rounded-xl text-base font-medium"
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
            ) : (
              <Phone className="w-5 h-5 mr-2" />
            )}
            {loading ? "Connecting..." : "Start Conversation"}
          </Button>
        )}

        {conversation.status === "connected" && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-emerald-600 font-medium flex items-center gap-2 text-sm">
              <Mic className="w-4 h-4" /> Connected to agent
            </p>
            <Button
              variant="destructive"
              onClick={() => conversation.endSession()}
              className="w-full h-11 rounded-xl text-base font-medium"
            >
              End Conversation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
