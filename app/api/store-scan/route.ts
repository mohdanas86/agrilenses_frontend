import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    // Validate user authentication
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received request body:", body);
    
    const { plantName, disease, confidence, imageUrl, suggestion } = body;

    // Validate required fields
    if (!plantName || !disease || confidence === undefined || !imageUrl) {
      console.log("Missing required fields:", { plantName, disease, confidence, imageUrl });
      return NextResponse.json(
        { error: "Missing required fields: plantName, disease, confidence, imageUrl" },
        { status: 400 }
      );
    }

    console.log("Creating scan with data:", {
      userId,
      plantName,
      disease,
      confidence,
      imageUrl,
      suggestion: suggestion ? "suggestion provided" : "no suggestion"
    });

    // Create scan record in database
    const scan = await prisma.scan.create({
      data: {
        clerkUserId: userId,
        plantName: plantName,
        disease: disease,
        confidence: confidence,
        imageUrl: imageUrl,
        suggestion: suggestion || null,
      },
    });

    console.log("Scan data stored:", scan);

    return NextResponse.json({
      success: true,
      scan: scan,
    });
  } catch (error) {
    console.error("Error storing scan data:", error);
    console.error("Error details:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { error: `Failed to store scan data: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
