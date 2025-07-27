import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { userId } = await auth();
        
        // Validate user authentication
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        console.log("Fetching scan history for user:", userId);

        // Fetch all scans for the current user
        const scans = await prisma.scan.findMany({
            where: { 
                clerkUserId: userId 
            },
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                plantName: true,
                disease: true,
                confidence: true,
                imageUrl: true,
                createdAt: true,
                suggestion: true
            }
        });

        console.log(`Found ${scans.length} scans for user ${userId}`);

        // Transform the data to match the frontend interface
        const scanHistory = scans.map(scan => ({
            id: scan.id,
            crop: scan.plantName,
            disease: scan.disease === "Healthy" ? null : scan.disease,
            confidence: scan.confidence,
            timestamp: scan.createdAt.toISOString(),
            image: scan.imageUrl,
            isHealthy: scan.disease === "Healthy" || scan.disease?.toLowerCase().includes('healthy'),
            suggestion: scan.suggestion
        }));

        return NextResponse.json({ 
            success: true,
            scanHistory,
            count: scanHistory.length 
        });

    } catch (error) {
        console.error('Error fetching scan history:', error);
        return NextResponse.json({ 
            error: 'Failed to fetch scan history',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
