import { NextResponse } from 'next/server';
import { generateSuggestion } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { plantName, disease, confidence } = body;

    if (!plantName || !disease || confidence == null) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const suggestion = await generateSuggestion({ plantName, disease, confidence });

    return NextResponse.json({ success: true, suggestion });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
