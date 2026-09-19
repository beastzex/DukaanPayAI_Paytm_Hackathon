'use client';

import React, { useState } from 'react';
import { AGENT_REGISTRY } from '@/config/constants';
import { AgentInfo } from '@/types';
import { Network, Cpu, ShieldCheck, CheckCircle2, ChevronRight, Activity, Terminal } from 'lucide-react';

export const AgentEcosystemSection: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(AGENT_REGISTRY[0]);

  return (
    <section id="ecosystem" className="py-20 lg:py-28 border-b border-slate-800/80 bg-[#040915] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Network className="w-3.5 h-3.5" />
            <span>Section 4 • Multi-Agent Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            8 Specialized Agents. <span className="text-gradient-paytm">One Master Orchestrator.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Instead of a single monolithic LLM prone to hallucinations and slow inference, we deploy 8 hyper-specialized mathematical and reasoning agents that run in parallel on Groq LPUs.
          </p>
        </div>

        {/* Master Orchestrator Banner */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 mb-10 border border-cyan-500/35 bg-gradient-to-r from-[#002970]/30 via-slate-900 to-[#001740]/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#005CE6] to-[#00BAF2] p-1 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/30">
                <div className="w-full h-full bg-[#050B17] rounded-[12px] flex items-center justify-center">
                  <ShieldCheck className="w-7 h-7 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white">Central Agent Orchestrator</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Live Synthesis
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-2xl">
                  Reconciles conflicting signals between agents, enforces merchant safety guardrails (e.g., maximum working capital spend cap), and ranks recommendations by highest expected net profit impact.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
                <span className="text-slate-400 block text-[10px]">Confidence Threshold</span>
                <span className="text-cyan-400 font-bold text-sm">&gt; 88% Gate</span>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
                <span className="text-slate-400 block text-[10px]">Guardrails</span>
                <span className="text-emerald-400 font-bold text-sm">Active & Locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* The 8 Agents Grid & Inspector Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 8 Agent Cards (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {AGENT_REGISTRY.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/20 translate-y-[-2px]'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{agent.avatar}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-tight">{agent.name}</h4>
                        <span className="text-[10px] text-cyan-400 font-medium">{agent.model}</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-emerald-400">{agent.confidence}%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2">{agent.specialty}</p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {agent.status}
                    </span>
                    <span className="text-cyan-400 flex items-center">
                      Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Agent Inspector (5 cols) */}
          <div className="lg:col-span-5 glass-panel rounded-2xl p-6 border border-cyan-500/30 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedAgent.avatar}</span>
                <div>
                  <h4 className="text-base font-bold text-white">{selectedAgent.name}</h4>
                  <p className="text-xs text-cyan-400 font-semibold">{selectedAgent.role}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                {selectedAgent.confidence}% Match
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Assigned Architecture & ML Model
                </span>
                <div className="bg-slate-900/90 rounded-lg p-3 border border-slate-800 text-cyan-300 font-mono flex items-center justify-between">
                  <span>{selectedAgent.model}</span>
                  <Cpu className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Core Mathematical / Reasoning Responsibility
                </span>
                <p className="text-slate-300 bg-slate-900/60 rounded-lg p-3 border border-slate-800 leading-relaxed">
                  {selectedAgent.specialty}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Latest Real-Time Telemetry & Action
                </span>
                <div className="bg-slate-950 rounded-lg p-3 border border-cyan-500/20 text-slate-300 font-mono text-[11px] flex items-start gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span>{selectedAgent.lastAction}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Agent Safety Guardrails
                </span>
                <div className="space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Never auto-orders without merchant confirmation threshold</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Re-calibrates against local weather every 30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Strict rate limits on customer WhatsApp promotions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
