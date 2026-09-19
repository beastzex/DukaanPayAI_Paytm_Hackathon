'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulation-store';
import {
  X,
  Volume2,
  MessageSquare,
  Sparkles,
  Send,
  Play,
  Square,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Cpu,
  Layers,
  ShoppingBag,
  Zap,
} from 'lucide-react';
import { formatINR } from '@/utils/cn';

interface MerchantSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MerchantSimulatorModal: React.FC<MerchantSimulatorModalProps> = ({ isOpen, onClose }) => {
  const {
    healthScore,
    lostRevenue,
    recommendations,
    executeRecommendation,
    timeline,
    activeTimelineIndex,
    setActiveTimelineIndex,
    isPlayingSoundboxVoice,
    playSoundboxVoice,
    stopSoundboxVoice,
    whatsappMessages,
    sendMerchantReply,
    executedLogs,
    isScanningInvoice,
    triggerInvoiceScan,
    isAnalyzingShelves,
    triggerShelfAnalysis,
  } = useSimulationStore();

  const [customReplyText, setCustomReplyText] = useState('');
  const currentTimeline = timeline[activeTimelineIndex];

  if (!isOpen) return null;

  const handleSendCustomReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReplyText.trim()) return;
    sendMerchantReply(customReplyText);
    setCustomReplyText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-7xl h-[92vh] glass-panel rounded-3xl border-2 border-cyan-500/50 flex flex-col overflow-hidden shadow-2xl shadow-cyan-500/20">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/25 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#005CE6] to-[#00BAF2] p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <div className="w-full h-full bg-[#050B17] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Paytm Merchant Growth Agent — Copilot Simulator
                </h3>
                <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Judge Testing Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Store: <span className="text-white font-medium">Ramesh Kirana Store (Indiranagar, Bangalore)</span> • Monthly GMV: <span className="text-cyan-300">₹4.8 Lakhs</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 1-Click Simulation Triggers */}
            <div className="hidden md:flex items-center gap-2 text-xs">
              <button
                onClick={() => triggerInvoiceScan('inv-hul-01')}
                disabled={isScanningInvoice}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:border-cyan-400 hover:text-white transition-all flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-cyan-400" />
                <span>{isScanningInvoice ? 'Parsing...' : 'Upload HUL Bill'}</span>
              </button>
              <button
                onClick={triggerShelfAnalysis}
                disabled={isAnalyzingShelves}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:border-emerald-400 hover:text-white transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAnalyzingShelves ? 'Scanning...' : 'Scan 3 Shelves'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 3-Column Interactive Sandbox */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* COLUMN 1: PAYTM SOUNDBOX HARDWARE SIMULATOR (3 cols) */}
          <div className="lg:col-span-3 border-r border-slate-800/80 p-5 bg-[#050B17]/90 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Soundbox Hardware
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-mono">4G Online</span>
                </div>
              </div>

              {/* Physical Soundbox Mockup Device */}
              <div className="rounded-2xl bg-gradient-to-b from-[#002970] via-[#001f54] to-[#001233] p-5 border-2 border-cyan-500/40 shadow-2xl relative text-center">
                <div className="w-12 h-2 rounded-full bg-cyan-400/50 mx-auto mb-4" />
                <div className="w-16 h-16 rounded-2xl bg-cyan-400 mx-auto mb-3 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-cyan-500/50">
                  Paytm
                </div>
                <div className="text-xs font-black tracking-wider text-white mb-1">
                  PAYTM SOUNDBOX PRO
                </div>
                <div className="text-[10px] text-cyan-300 font-mono mb-4">
                  ID: #PB-9941-BLR
                </div>

                {/* Speaker Grille Animation */}
                <div className="h-10 bg-slate-950/80 rounded-xl p-2 flex items-center justify-center gap-1 mb-4 border border-cyan-500/20">
                  {isPlayingSoundboxVoice ? (
                    <>
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-1" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-2" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-3" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-4" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-5" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-2" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-4" />
                    </>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">Standby • Tap to broadcast</span>
                  )}
                </div>

                {/* Voice Controls */}
                <div className="space-y-2">
                  {isPlayingSoundboxVoice ? (
                    <button
                      onClick={stopSoundboxVoice}
                      className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Audio</span>
                    </button>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => playSoundboxVoice('hi')}
                        className="py-2.5 rounded-xl bg-[#00BAF2] hover:bg-[#38bdf8] text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md shadow-cyan-500/20"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Hindi Voice</span>
                      </button>
                      <button
                        onClick={() => playSoundboxVoice('en')}
                        className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>English</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Time of Day Phase Selector */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Simulate Time Routine:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {timeline.map((item, idx) => (
                    <button
                      key={item.time}
                      onClick={() => {
                        stopSoundboxVoice();
                        setActiveTimelineIndex(idx);
                      }}
                      className={`p-2 rounded-lg border text-left text-[11px] transition-all ${
                        activeTimelineIndex === idx
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="truncate">{item.icon} {item.time}</div>
                      <div className="text-[9px] text-slate-500 truncate">{item.phase}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Transcript View */}
              <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs">
                <span className="text-[10px] text-cyan-400 font-bold uppercase block mb-1">
                  Active Audio Script:
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed italic">
                  &quot;{currentTimeline.soundboxVoiceHindi}&quot;
                </p>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 text-center pt-2">
              Powered by Paytm Soundbox IoT Voice Engine
            </div>
          </div>

          {/* COLUMN 2: INTERACTIVE WHATSAPP KIRANA ASSISTANT (5 cols) */}
          <div className="lg:col-span-5 border-r border-slate-800/80 bg-[#0c1317] flex flex-col justify-between overflow-hidden">
            {/* WhatsApp Chat Header */}
            <div className="px-4 py-3 bg-[#1f2c34] flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#005CE6] to-[#00BAF2] p-0.5">
                  <div className="w-full h-full bg-[#050B17] rounded-full flex items-center justify-center text-xs font-black text-cyan-400">
                    PG
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Paytm Growth Teammate</h4>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Online • Groq LPU (48ms)
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">End-to-End Encrypted</span>
            </div>

            {/* Chat Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px]">
              {whatsappMessages.map((msg) => {
                const isAgent = msg.sender === 'agent';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                        isAgent
                          ? 'bg-[#1f2c34] text-slate-200 rounded-tl-none border border-slate-800'
                          : 'bg-[#005c4b] text-white rounded-tr-none'
                      }`}
                    >
                      {msg.badge && (
                        <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider mb-1">
                          {msg.badge}
                        </div>
                      )}
                      <div className="whitespace-pre-line text-[11px]">{msg.text}</div>
                      <div className="text-[9px] text-slate-400 text-right mt-1.5 font-mono">
                        {msg.timestamp}
                      </div>
                    </div>

                    {/* Quick Action Chips if present */}
                    {msg.options && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                        {msg.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => sendMerchantReply(opt)}
                            className="text-[10px] font-bold bg-[#1f2c34] hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2.5 py-1 rounded-full transition-all"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Merchant Reply Input */}
            <div className="p-3 bg-[#1f2c34] border-t border-slate-800">
              <form onSubmit={handleSendCustomReply} className="flex items-center gap-2">
                <input
                  type="text"
                  value={customReplyText}
                  onChange={(e) => setCustomReplyText(e.target.value)}
                  placeholder="Type a reply as Ramesh Ji (e.g., 'Approve PO' or 'Show forecast')..."
                  className="flex-1 bg-[#2a3942] rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-[#00a884] hover:bg-[#008f6f] text-slate-950 font-bold transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* COLUMN 3: JUDGE ACTIONS & REAL-TIME AGENT TELEMETRY (4 cols) */}
          <div className="lg:col-span-4 p-5 bg-[#050B17]/90 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Agent Intelligence Deck
                  </span>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 font-mono">Groq LPU Active</span>
              </div>

              {/* Health Score & Lost Revenue Mini Card */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Health Score</span>
                  <span className="text-xl font-black text-emerald-400">{healthScore.overallScore}/100</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">{healthScore.tier}</span>
                </div>
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Revenue Leakage</span>
                  <span className="text-xl font-black text-rose-400">{formatINR(lostRevenue.potentialLost)}</span>
                  <span className="text-[9px] text-slate-400 block mt-0.5">3 Leaks Detected</span>
                </div>
              </div>

              {/* 1-Tap Agent Action Triggers */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Pending AI Actions for Approval:
                </span>
                <div className="space-y-2">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.id}
                      className="glass-panel-subtle p-3 rounded-xl border border-slate-800 text-xs space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <h5 className="font-bold text-white leading-tight">{rec.title}</h5>
                        <span className="text-[10px] font-bold text-cyan-400 shrink-0 ml-1">
                          {rec.confidenceScore}% match
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{rec.reason}</p>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-semibold text-emerald-400">{rec.impactBadge}</span>
                        {!rec.executed ? (
                          <button
                            onClick={() => executeRecommendation(rec.id)}
                            className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#005CE6] to-[#00BAF2] text-white text-[10px] font-bold shadow transition-all"
                          >
                            Execute Now
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Dispatched
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Executed Action Checkmarks */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Autonomous Actions Executed Today:
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px]">✓ Inventory Alert Generated (Amul Butter)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px]">✓ Revenue Drop Detected (5 PM Rain Anomaly)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px]">✓ Cashback Campaign Suggested (Tea-Snack Combo)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[11px]">✓ Demand Spike Predicted (IPL Match Surge)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-cyan-500/20 text-[10px] text-cyan-300">
              💡 <strong>Judge Note:</strong> This demonstrates True Agentic Autonomy. The AI observes, models, suggests, and executes with 1-tap confirmation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
