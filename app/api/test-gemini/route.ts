import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Hello, respond with just 'API working' if you can read this.";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ 
      success: true, 
      model: "gemini-1.5-flash",
      response: response.text() 
    });
  } catch (error) {
    console.error("Gemini test error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
