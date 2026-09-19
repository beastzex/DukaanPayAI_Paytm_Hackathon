import { NextResponse } from 'next/server';
import { MOCK_SHELF_SCANS } from '@/data/mockData';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const angle = searchParams.get('angle') || 'eye_level';
  const scan = MOCK_SHELF_SCANS.find((s) => s.angleId === angle) || MOCK_SHELF_SCANS[0];

  return NextResponse.json({
    status: 'success',
    models: ['YOLOv10', 'Grounding DINO', 'Florence-2'],
    inferenceTimeMs: 238,
    shelfScan: scan,
  });
}
