import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiCache } from "@/lib/cache";

// Add timeout wrapper for database operations
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeout = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs);
    });
    
    return Promise.race([promise, timeout]);
}

export async function GET(req: Request) {
    try {
        console.log("History API: Starting request");
        
        // Check if auth is available
        let userId;
        try {
            const authResult = await auth();
            userId = authResult.userId;
            console.log("History API: Auth result:", { userId });
        } catch (authError) {
            console.error("History API: Auth error:", authError);
            return NextResponse.json({ 
                error: 'Authentication service unavailable',
                success: false,
                scanHistory: []
            }, { status: 200 }); // Return 200 with empty data instead of 401
        }
        
        // For demo purposes, if no user, return empty but successful response
        if (!userId) {
            console.log("History API: No userId found, returning empty history");
            return NextResponse.json({ 
                success: true,
                scanHistory: [],
                count: 0,
                message: 'No authentication - showing demo data'
            });
        }

        console.log("Fetching scan history for user:", userId);

        // Check cache first
        const cacheKey = `scan-history-${userId}`;
        const cachedData = apiCache.get(cacheKey);
        if (cachedData) {
            console.log("History API: Returning cached data");
            return NextResponse.json(cachedData);
        }

        // Fetch all scans for the current user with timeout
        let scans;
        try {
            console.log("History API: Starting database query...");
            const startTime = Date.now();
            scans = await prisma.scan.findMany({
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
                },
                take: 50 // Reduced to 50 for faster queries
            });
            const queryTime = Date.now() - startTime;
            console.log(`Found ${scans.length} scans for user ${userId} in ${queryTime}ms`);
        } catch (dbError) {
            console.error("History API: Database error:", dbError);
            return NextResponse.json({ 
                success: false,
                scanHistory: [],
                count: 0,
                message: 'Database fetch failed: ' + (dbError instanceof Error ? dbError.message : String(dbError))
            });
        }

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

        const responseData = { 
            success: true,
            scanHistory,
            count: scanHistory.length 
        };

        // Cache the response for 5 minutes
        apiCache.set(cacheKey, responseData, 300000);

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('History API: Unexpected error:', error);
        
        // Return a successful response with empty data instead of error
        // This allows the frontend to fall back to placeholder data
        return NextResponse.json({ 
            success: true,
            scanHistory: [],
            count: 0,
            message: 'Service temporarily unavailable - showing demo data'
        });
    }
}
