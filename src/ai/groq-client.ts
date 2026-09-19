/**
 * Hybrid Intelligence Architecture:
 * - Groq LPU + GPT-OSS 120B: High-level business reasoning, financial diagnostics, multi-agent planning.
 * - Qwen: Fast multilingual responses, WhatsApp message compression, voice script generation.
 */

export interface GroqReasoningRequest {
  agentRole: string;
  context: {
    merchantName: string;
    storeType: string;
    city: string;
    revenueToday: number;
    expectedRevenue: number;
    signals: Record<string, any>;
  };
  task: string;
}

export interface GroqReasoningResponse {
  modelUsed: 'Groq GPT-OSS 120B' | 'Qwen Fast Multilingual';
  latencyMs: number;
  reasoning: string;
  recommendedAction: string;
  confidenceScore: number;
  explainableFactors: Array<{ title: string; weight: number }>;
}

export async function routeToReasoningLayer(req: GroqReasoningRequest): Promise<GroqReasoningResponse> {
  const isComplex = req.task.includes('financial') || req.task.includes('audit') || req.task.includes('strategy');
  
  // High-performance Groq simulation with realistic LPU sub-second latency
  const latency = isComplex ? 164 : 48;
  const modelUsed = isComplex ? 'Groq GPT-OSS 120B' : 'Qwen Fast Multilingual';

  return {
    modelUsed,
    latencyMs: latency,
    reasoning: `Synthesized internal UPI velocity from ${req.context.merchantName} with external monsoon and local match vectors. Identified high propensity for perishable depletion.`,
    recommendedAction: 'Trigger autonomous 1-click replenishment before distributor 12 PM ordering deadline.',
    confidenceScore: 95.8,
    explainableFactors: [
      { title: 'UPI Transaction Velocity Acceleration', weight: 42 },
      { title: 'External Weather / IPL Fixture Confluence', weight: 33 },
      { title: 'Distributor Lead-Time Buffer Threshold', weight: 25 },
    ],
  };
}
