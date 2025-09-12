import { NextRequest, NextResponse } from "next/server";

// Mock chat history data
const MOCK_CHAT_HISTORY = [
  {
    id: "session-1",
    userId: "user-123",
    date: new Date(2025, 8, 10, 14, 30).toISOString(),
    language: "en",
    messages: [
      {
        id: "msg-1",
        text: "How to treat tomato blight?",
        isUser: true,
        timestamp: new Date(2025, 8, 10, 14, 30).toISOString(),
        language: "en",
      },
      {
        id: "msg-2",
        text: "To treat tomato blight, use copper-based fungicides, ensure proper air circulation, remove affected leaves, and avoid overhead watering. Apply preventive measures like crop rotation and resistant varieties.",
        isUser: false,
        timestamp: new Date(2025, 8, 10, 14, 31).toISOString(),
        language: "en",
      },
    ],
  },
  {
    id: "session-2",
    userId: "user-123",
    date: new Date(2025, 8, 9, 10, 15).toISOString(),
    language: "hi",
    messages: [
      {
        id: "msg-3",
        text: "धान की खेती के लिए सबसे अच्छा समय कब है?",
        isUser: true,
        timestamp: new Date(2025, 8, 9, 10, 15).toISOString(),
        language: "hi",
      },
      {
        id: "msg-4",
        text: "धान की खेती के लिए मानसून का समय सबसे अच्छा होता है। जून-जुलाई में बुआई करनी चाहिए। मिट्टी में पर्याप्त नमी और तापमान 25-35°C होना चाहिए।",
        isUser: false,
        timestamp: new Date(2025, 8, 9, 10, 16).toISOString(),
        language: "hi",
      },
    ],
  },
  {
    id: "session-3",
    userId: "user-123",
    date: new Date(2025, 8, 8, 16, 45).toISOString(),
    language: "ta",
    messages: [
      {
        id: "msg-5",
        text: "இயற்கை பூச்சி கட்டுப்பாட்டு முறைகள் என்ன?",
        isUser: true,
        timestamp: new Date(2025, 8, 8, 16, 45).toISOString(),
        language: "ta",
      },
      {
        id: "msg-6",
        text: "இயற்கை பூச்சி கட்டுப்பாட்டுக்கு நீம் எண்ணெய், பூண்டு கரைசல், மஞ்சள் பொறிகள், பயனுள்ள பூச்சிகளை பயன்படுத்தலாம். மண்புழு உரம் மற்றும் தாவர சாறுகள் பயன்படுத்துங்கள்.",
        isUser: false,
        timestamp: new Date(2025, 8, 8, 16, 46).toISOString(),
        language: "ta",
      },
    ],
  },
];

// GET: Fetch chat history for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // In production, fetch from database
    const userHistory = MOCK_CHAT_HISTORY.filter(session => session.userId === userId);
    
    // Sort by date (newest first)
    userHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      sessions: userHistory,
      totalSessions: userHistory.length,
      totalMessages: userHistory.reduce((acc, session) => acc + session.messages.length, 0),
    });

  } catch (error) {
    console.error("Chat history API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST: Save a new chat session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { messages, language } = await request.json();
    
    if (!userId || !messages || !language) {
      return NextResponse.json(
        { error: "Missing required fields: userId, messages, language" },
        { status: 400 }
      );
    }

    const newSession = {
      id: `session-${Date.now()}`,
      userId,
      date: new Date().toISOString(),
      language,
      messages: messages.map((msg: any, index: number) => ({
        ...msg,
        id: `msg-${Date.now()}-${index}`,
        timestamp: new Date().toISOString(),
      })),
    };

    // In production, save to database
    console.log("Saving new chat session:", newSession);

    return NextResponse.json({
      success: true,
      sessionId: newSession.id,
      message: "Chat session saved successfully",
    });

  } catch (error) {
    console.error("Save chat session error:", error);
    return NextResponse.json(
      { error: "Failed to save chat session" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a chat session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!userId || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields: userId, sessionId" },
        { status: 400 }
      );
    }

    // In production, delete from database
    console.log(`Deleting chat session ${sessionId} for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: "Chat session deleted successfully",
    });

  } catch (error) {
    console.error("Delete chat session error:", error);
    return NextResponse.json(
      { error: "Failed to delete chat session" },
      { status: 500 }
    );
  }
}
