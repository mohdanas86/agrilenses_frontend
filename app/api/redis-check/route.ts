// app/api/redis-check/route.ts
import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis'; // import the shared client

export async function GET() {
  try {
    await redis.set("test-key", "Hello from shared client");
    const value = await redis.get("test-key");

    return NextResponse.json({ success: true, value });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
