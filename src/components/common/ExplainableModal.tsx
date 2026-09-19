'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulation-store';
import { X, HelpCircle, ShieldCheck, Sparkles, Check, ArrowRight } from 'lucide-react';

export const ExplainableModal: React.FC = () => {
  const { selectedRecommendationForWhy, setSelectedRecommendationForWhy, executeRecommendation } =
    useSimulationStore();

  if (!selectedRecommendationForWhy) return null;

  const rec = selectedRecommendationForWhy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl border-2 border-cyan-500/40 p-6 sm:p-8 shadow-2xl shadow-cyan-500/20 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setSelectedRecommendationForWhy(null)}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Explainable AI Diagnostic
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {rec.confidenceScore}% Model Confidence
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{rec.title}</h3>
          </div>
        </div>

        {/* Core Justification */}
        <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Why the Agent Formulated this Action:
          </span>
          <p className="text-xs text-slate-200 leading-relaxed font-normal">
            {rec.reason}
          </p>
        </div>

        {/* Contributing Factors & Weight Breakdown */}
        <div className="mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
            Multi-Signal Weightage Attribution:
          </span>
          <div className="space-y-3">
            {rec.supportingFactors.map((factor, idx) => (
              <div key={idx} className="glass-panel-subtle p-3 rounded-lg border border-slate-800/80">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-white">{factor.title}</span>
                  <span className="text-cyan-400 font-bold">{factor.weight}% Weight</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mb-1.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full"
                    style={{ width: `${factor.weight}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Observed: {factor.value}</span>
                  <span className="text-slate-500">Source: {factor.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Dispatch Preview */}
        <div className="bg-slate-950 rounded-xl p-4 border border-cyan-500/20 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Execution Channel:</span>
            <span className="font-bold text-cyan-300">{rec.actionPayload.channel}</span>
          </div>
          <p className="text-xs text-slate-200 font-mono bg-slate-900/80 p-2.5 rounded border border-slate-800">
            {rec.actionPayload.preview}
          </p>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedRecommendationForWhy(null)}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Close Drilldown
          </button>
          {!rec.executed ? (
            <button
              onClick={() => {
                executeRecommendation(rec.id);
                setSelectedRecommendationForWhy(null);
              }}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#00BAF2] hover:from-[#004dc2] hover:to-[#00a8dc] text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <span>Execute 1-Tap Action</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex-1 py-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>Already Dispatched</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
