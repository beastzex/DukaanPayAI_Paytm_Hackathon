import { NextResponse } from 'next/server';
import { runGroqReasoning } from '@/ai/groq-live';
import { INITIAL_RECOMMENDATIONS } from '@/data/mockData';
import { AgentOrchestrator } from '@/agents/orchestrator';
import { MLClient } from '@/lib/ml-client';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      merchantName = 'Laxmi Kirana Store',
      merchantId = 'm_101',
      task = 'synthesize_growth_actions',
      syncBackend = true,
    } = body;

    const peak = MLClient.getDiurnalPeakRush();
    const xgboostRisks = MLClient.getXGBoostPredictions().top_stockout_risks;

    const groqResult = await runGroqReasoning({
      merchantName,
      storeType: 'Kirana Store',
      city: 'Jaipur',
      prophetPeakHour: `${peak.morningRush} & ${peak.eveningRush}`,
      prophetExpectedRevenue: 18450,
      topStockoutSkus: xgboostRisks.slice(0, 3).map((s) => ({
        name: s.sku_name,
        probability: s.stockout_risk_score,
      })),
      task,
    });

    const orchestratorDecision = AgentOrchestrator.synthesizeActions(INITIAL_RECOMMENDATIONS);

    let backendSyncResult = null;
    if (syncBackend) {
      try {
        const backendRes = await fetch('http://localhost:4000/api/v1/ai-integration/recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Default enterprise internal token for AI subsystem
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NTgzMDczYS01Zjc2LTRhYmUtOTkwZC1iNjMxY2NmMjVkYjAiLCJyb2xlcyI6WyJNRVJDSEFOVCJdLCJwZXJtaXNzaW9ucyI6WyJSRUFEX1BST0ZJTEUiLCJNQU5BR0VfSU5WRU5UT1JZIiwiRElTUEFUQ0hfQ0FNUEFJR05TIl0sImlhdCI6MTc4OTc5NTYyMiwiZXhwIjoxNzg5Nzk2NTIyfQ.OQo-CUAj2t_s-43XnrLMf-CLVmybyWV_5C4I4lPLXco',
          },
          body: JSON.stringify({
            merchantId,
            actionType: 'STOCK_RESTOCK',
            priority: 'HIGH',
            title: `Restock ${xgboostRisks[0]?.sku_name || 'Amul Milk'} before evening peak`,
            rationaleIndic: groqResult.hindiPrompt,
            projectedRevenueINR: 4200,
            payload: {
              sku: xgboostRisks[0]?.sku || 'AML-MK-500',
              suggestedQty: 24,
              distributorId: 'dist-jaipur-01',
              expectedSpikeHours: peak.eveningRush,
            },
            requiresMerchantApproval: true,
          }),
        }).catch(() => null);

        if (backendRes && backendRes.ok) {
          backendSyncResult = await backendRes.json();
        }
      } catch (e: any) {
        console.warn('Backend sync failed (continuing with local orchestration):', e.message);
      }
    }

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      orchestratorDecision,
      backendSync: backendSyncResult,
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
      modelsPaired: {
        prophetPeakHour: peak.peakHour,
        prophetPeakGmv: peak.peakGmv,
        topStockoutRisk: xgboostRisks[0]?.sku_name,
        topStockoutProbability: xgboostRisks[0]?.stockout_risk_score,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

