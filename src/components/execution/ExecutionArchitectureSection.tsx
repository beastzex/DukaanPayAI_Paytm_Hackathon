'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulation-store';
import { PlayCircle, CheckCircle2, MessageSquare, Volume2, Truck, Sparkles, ArrowRight } from 'lucide-react';

export const ExecutionArchitectureSection: React.FC = () => {
  const { executedLogs } = useSimulationStore();

  const pipelineStages = [
    { title: 'Data Flow', desc: 'UPI streams, weather, bills & shelf scans ingested continuously.' },
    { title: 'Agent Flow', desc: '8 parallel agents calculate unit economics & demand spikes.' },
    { title: 'Decision Flow', desc: 'Orchestrator filters confidence & ranks highest margin ROI.' },
    { title: 'Merchant Confirm', desc: 'Ramesh Ji receives 1-tap WhatsApp prompt or Soundbox brief.' },
    { title: 'Execution', desc: 'Supplier PO dispatched, or promo broadcasted to customers.' },
    { title: 'Feedback Loop', desc: 'Measures GMV lift & auto-tunes model hyperparameters.' },
  ];

  return (
    <section className="py-20 lg:py-28 border-b border-slate-800/80 bg-grid-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Section 9 • Execution Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Autonomous <span className="text-gradient-paytm">Closed-Loop Execution</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Unlike static dashboards that just display charts, Paytm Growth Agent closes the loop by turning insights into delivered orders, customer footfall, and bank deposits.
          </p>
        </div>

        {/* 6-Stage Linear Pipeline */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-16">
          {pipelineStages.map((stage, idx) => (
            <div key={idx} className="glass-panel-subtle p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-cyan-400 block mb-1">STAGE 0{idx + 1}</span>
                <h4 className="text-xs font-bold text-white mb-2">{stage.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{stage.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                <span>Deterministic</span>
              </div>
            </div>
          ))}
        </div>

        {/* Real-time Executed Actions Feed */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-base font-bold text-white">Live Executed Actions Log</h3>
            </div>
            <span className="text-xs text-slate-400">
              Audit trail of autonomous & approved merchant actions
            </span>
          </div>

          <div className="space-y-3">
            {executedLogs.map((log) => (
              <div
                key={log.id}
                className="glass-panel-subtle p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 mt-1 sm:mt-0">
                    {log.channel === 'WhatsApp' ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : log.channel === 'Soundbox' ? (
                      <Volume2 className="w-4 h-4" />
                    ) : (
                      <Truck className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{log.actionTitle}</h4>
                      <span className="text-[10px] text-slate-500 font-mono">• {log.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">{log.outcome}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    ✓ {log.status}
                  </span>
                  <span className="text-[10px] text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 font-medium">
                    {log.channel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
