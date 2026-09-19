'use client';

import React from 'react';
import { Sparkles, Play, ArrowRight, ShieldCheck, Activity, Cpu, MessageSquare, Volume2, Store, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  onOpenSimulator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenSimulator }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-800/80 bg-grid-pattern">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[#002970]/50 to-[#00BAF2]/20 blur-[130px] -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-12 right-10 w-72 h-72 bg-emerald-500/10 blur-[100px] -z-10 pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Paytm Build For India AI Hackathon</span>
            <span className="text-slate-500">•</span>
            <span className="text-white">Track 1 Finalist</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-semibold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+28.4% Proven Merchant Revenue Lift</span>
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
            The AI Teammate That{' '}
            <span className="text-gradient-paytm">Runs Alongside</span>{' '}
            Every Merchant.
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-normal max-w-3xl mx-auto mb-4">
            Transforming Paytm from a <span className="text-white font-semibold">Payment Platform</span> into an{' '}
            <span className="text-[#00BAF2] font-semibold">Autonomous Business Operating System</span>.
          </p>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
            No POS machines. No barcode scanners. No complex ERP software. Ramesh Ji manages his store with zero friction through{' '}
            <span className="text-white font-medium">Paytm Soundbox</span>,{' '}
            <span className="text-white font-medium">WhatsApp</span>, and{' '}
            <span className="text-white font-medium">Voice AI</span>.
          </p>
        </div>

        {/* Hero Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={onOpenSimulator}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#005CE6] via-[#00BAF2] to-[#38BDF8] text-white text-base font-bold shadow-xl shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Launch Merchant Copilot Simulator</span>
          </button>
          <a
            href="#ecosystem"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-xl glass-panel-subtle border border-slate-700/80 text-slate-200 hover:text-white hover:border-cyan-500/40 text-base font-semibold transition-all"
          >
            <span>Explore 8-Agent Architecture</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </a>
        </div>

        {/* Live Ecosystem Visualizer */}
        <div className="relative glass-panel rounded-2xl p-6 sm:p-8 mb-12 overflow-hidden border border-cyan-500/25 shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Autonomous Agent Ecosystem
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hybrid Groq + Prophet ML</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Stream Latency: 48ms</span>
              </span>
            </div>
          </div>

          {/* Interactive Node Graph */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Input Touchpoints */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Merchant Data Ingestion
              </span>
              <div className="glass-panel-subtle p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Paytm UPI Stream</h4>
                  <p className="text-[10px] text-slate-400">Real-time payment frequency & amount</p>
                </div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Distributor Bill OCR</h4>
                  <p className="text-[10px] text-slate-400">1-photo invoice parse; zero typing</p>
                </div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Shelf Vision AI</h4>
                  <p className="text-[10px] text-slate-400">3-camera angle stockout estimation</p>
                </div>
              </div>
            </div>

            {/* Central Orchestrator Core */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-b from-[#002970]/50 to-[#050B17] border-2 border-cyan-500/40 relative shadow-2xl shadow-cyan-500/20">
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-cyan-500 text-[10px] font-extrabold uppercase tracking-wider text-slate-950">
                Agent Orchestrator
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#005CE6] to-[#00BAF2] p-1 mb-3 flex items-center justify-center shadow-lg shadow-cyan-500/40">
                <div className="w-full h-full bg-[#050B17] rounded-[14px] flex items-center justify-center">
                  <Cpu className="w-8 h-8 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-base font-bold text-white text-center mb-1">
                Paytm Growth Brain
              </h3>
              <p className="text-[11px] text-cyan-300 text-center mb-3">
                Groq GPT-OSS 120B + Prophet ML
              </p>
              <div className="w-full space-y-1.5 text-[11px] bg-slate-900/90 rounded-lg p-2.5 border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>Merchant Health Score:</span>
                  <span className="font-bold text-emerald-400">83/100</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Lost Revenue Detected:</span>
                  <span className="font-bold text-rose-400">₹4,800/day</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Autopilot POs Dispatched:</span>
                  <span className="font-bold text-cyan-400">2 Pending</span>
                </div>
              </div>
            </div>

            {/* Output Channels */}
            <div className="space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Zero-Friction Channels
              </span>
              <div className="glass-panel-subtle p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Paytm Soundbox Voice AI</h4>
                  <p className="text-[10px] text-slate-400">Morning & evening briefings in Hindi/English</p>
                </div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">WhatsApp Assistant</h4>
                  <p className="text-[10px] text-slate-400">1-tap approval for distributor POs & deals</p>
                </div>
              </div>
              <div className="glass-panel-subtle p-3 rounded-xl border border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Merchant App Dashboard</h4>
                  <p className="text-[10px] text-slate-400">Deep telemetry & judge inspection view</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel-subtle p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Gross Revenue Lift</span>
            <div className="text-2xl font-black text-emerald-400">+28.4%</div>
            <p className="text-[10px] text-slate-400 mt-1">Across 450+ neighborhood pilots</p>
          </div>
          <div className="glass-panel-subtle p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Stockouts Avoided</span>
            <div className="text-2xl font-black text-cyan-400">14,280 SKUs</div>
            <p className="text-[10px] text-slate-400 mt-1">Via proactive XGBoost reorders</p>
          </div>
          <div className="glass-panel-subtle p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Working Capital Freed</span>
            <div className="text-2xl font-black text-white">₹64,500/mo</div>
            <p className="text-[10px] text-slate-400 mt-1">From slow-moving stock reduction</p>
          </div>
          <div className="glass-panel-subtle p-4 rounded-xl border border-slate-800/80">
            <span className="text-xs text-slate-400 block mb-1">Groq Reasoning Latency</span>
            <div className="text-2xl font-black text-amber-400">&lt;164 ms</div>
            <p className="text-[10px] text-slate-400 mt-1">Sub-second multi-agent planning</p>
          </div>
        </div>
      </div>
    </section>
  );
};
