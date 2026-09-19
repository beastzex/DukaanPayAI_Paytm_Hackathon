import { NextResponse } from 'next/server';
import { runGroqReasoning } from '@/ai/groq-live';
import { INITIAL_RECOMMENDATIONS } from '@/data/mockData';
import { AgentOrchestrator } from '@/agents/orchestrator';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const { merchantName = 'Ramesh Kirana', task = 'synthesize_growth_actions' } = body;

    const groqResult = await runGroqReasoning({
      merchantName,
      storeType: 'Kirana Store',
      city: 'Jaipur',
      prophetPeakHour: '18:30 - 20:30 PM',
      prophetExpectedRevenue: 18450,
      topStockoutSkus: [
        { name: 'Amul Salted Butter (500g)', probability: 96.2 },
        { name: 'Maggi 2-Minute Masala Noodles', probability: 88.5 },
      ],
      task,
    });

    const orchestratorDecision = AgentOrchestrator.synthesizeActions(INITIAL_RECOMMENDATIONS);

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      orchestratorDecision,
      groqTelemetry: {
        isLiveApi: groqResult.isLiveApi,
        modelUsed: groqResult.modelUsed,
        latencyMs: groqResult.latencyMs,
        hindiPrompt: groqResult.hindiPrompt,
        englishExplanation: groqResult.englishExplanation,
        actionableMessage: groqResult.actionableMessage,
        confidenceScore: groqResult.confidenceScore,
        explainableFactors: groqResult.explainableFactors,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
