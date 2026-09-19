import { NextRequest, NextResponse } from 'next/server';
import { processVoiceQuery } from '@/ai/voice-coo-engine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const query = body.query || 'bhai aaj ki sales kya thi';
    const language = body.language || 'hi';

    const result = await processVoiceQuery(query, language);

    return NextResponse.json({
      status: 'success',
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[VoiceAPI Error]:', err);
    return NextResponse.json(
      {
        status: 'error',
        message: err.message || 'Internal error processing voice query',
      },
      { status: 500 }
    );
  }
}
