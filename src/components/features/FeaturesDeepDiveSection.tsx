'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulation-store';
import { Award, AlertCircle, HelpCircle, ArrowUpRight, TrendingUp, Check, Play } from 'lucide-react';
import { formatINR } from '@/utils/cn';

export const FeaturesDeepDiveSection: React.FC = () => {
  const {
    healthScore,
    lostRevenue,
    recommendations,
    setSelectedRecommendationForWhy,
    executeRecommendation,
  } = useSimulationStore();

  return (
    <section id="features" className="py-20 lg:py-28 border-b border-slate-800/80 bg-[#040915] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>Section 6 • Three Flagship Inventions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Intelligence That Speaks <span className="text-gradient-paytm">The Merchant’s Language</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Indian merchants don’t care about abstract analytics, SQL queries, or complex pivot tables. They care about 3 clear things: How healthy is my shop? Where did I lose money? What should I do next?
          </p>
        </div>

        {/* Feature 1: Merchant Health Score™ */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/30 mb-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                  Flagship Innovation #1
                </span>
                <span className="text-xs text-slate-400">The CIBIL Score for Indian Businesses</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Merchant Health Score™ (0–100)
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {healthScore.summary}
              </p>
            </div>

            {/* Score Big Display */}
            <div className="flex items-center gap-4 bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#005CE6] to-[#00BAF2] p-1 shadow-lg shadow-cyan-500/25">
                <div className="w-full h-full bg-[#050B17] rounded-[14px] flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-white leading-none">{healthScore.overallScore}</span>
                  <span className="text-[9px] text-cyan-400 font-bold uppercase">/ 100</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-400">{healthScore.tier}</div>
                <div className="text-[11px] text-slate-400 font-medium">{healthScore.cibilEquivalent}</div>
                <div className="text-[10px] text-cyan-300 mt-1 flex items-center gap-1 font-semibold">
                  <TrendingUp className="w-3 h-3" />
                  <span>Top 8% in Bangalore South</span>
                </div>
              </div>
            </div>
          </div>

          {/* Health Score Sub-metrics 6 Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(healthScore.metrics).map(([key, item]) => (
              <div key={key} className="glass-panel-subtle p-3.5 rounded-xl border border-slate-800/90">
                <span className="text-[10px] text-slate-400 block mb-1 truncate">{item.title}</span>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-lg font-black text-white">{item.score}</span>
                  <span className="text-[10px] font-bold text-emerald-400">{item.change}</span>
                </div>
                <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <span className="text-[9px] text-slate-400 block line-clamp-1">{item.rating}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 2: Lost Revenue Detector™ */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-rose-500/30 mb-12 bg-gradient-to-b from-slate-900 to-[#0c0a17]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                  Flagship Innovation #2
                </span>
                <span className="text-xs text-slate-400">Revenue Leakage Intelligence</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Lost Revenue Detector™
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Prophet ML compares predicted expected revenue against real UPI settlement timestamps to identify exact leaks.
              </p>
            </div>

            {/* Money Lost Stat Box */}
            <div className="flex items-center gap-6 bg-slate-950 rounded-2xl p-4 sm:p-5 border border-rose-500/30">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Expected Revenue</span>
                <span className="text-base font-bold text-slate-300">{formatINR(lostRevenue.expectedRevenue)}</span>
              </div>
              <div className="text-slate-600 font-bold">vs</div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Actual Collected</span>
                <span className="text-base font-bold text-slate-300">{formatINR(lostRevenue.actualRevenue)}</span>
              </div>
              <div className="border-l border-slate-800 pl-4">
                <span className="text-[10px] text-rose-400 block uppercase font-bold">Potential Lost</span>
                <span className="text-2xl font-black text-rose-400">{formatINR(lostRevenue.potentialLost)}</span>
              </div>
            </div>
          </div>

          {/* Root Cause Attribution Breakdown */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Root-Cause Attribution for {lostRevenue.detectionPeriod}:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lostRevenue.factors.map((factor, idx) => (
                <div key={idx} className="glass-panel-subtle p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xs font-bold text-white leading-tight">{factor.cause}</h4>
                      <span className="text-xs font-extrabold text-rose-400 shrink-0 ml-2">
                        -{formatINR(factor.lostAmount)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                      {factor.explanation}
                    </p>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-cyan-500/20 text-[10px] text-cyan-300 font-medium">
                    💡 Remedy: {factor.remedyAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 3: Explainable AI Layer ("Why?" Button) */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                  Flagship Innovation #3
                </span>
                <span className="text-xs text-slate-400">Zero Hallucination Transparency</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Explainable Recommendations with &quot;Why?&quot; Transparency
              </h3>
            </div>
            <span className="text-xs text-slate-400 hidden sm:block">
              Every action includes verifiable evidence & confidence score
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  rec.executed
                    ? 'bg-slate-900/40 border-emerald-500/30'
                    : 'glass-panel-subtle border-slate-800 hover:border-cyan-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      {rec.agentName}
                    </span>
                    <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      {rec.impactBadge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 leading-tight">
                    {rec.title}
                  </h4>

                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    {rec.reason}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedRecommendationForWhy(rec)}
                      className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Why this action?</span>
                    </button>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {rec.confidenceScore}% confidence
                    </span>
                  </div>

                  {!rec.executed ? (
                    <button
                      onClick={() => executeRecommendation(rec.id)}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#00BAF2] hover:from-[#004dc2] hover:to-[#00a8dc] text-white text-xs font-bold transition-all shadow-md shadow-cyan-500/20 flex items-center justify-center gap-1.5"
                    >
                      <span>1-Tap Execute</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="w-full py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>Action Executed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
