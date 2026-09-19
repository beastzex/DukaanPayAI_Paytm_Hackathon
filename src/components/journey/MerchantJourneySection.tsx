'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulation-store';
import { Clock, Volume2, MessageSquare, Check, Sparkles, ArrowRight, Play, Square } from 'lucide-react';

export const MerchantJourneySection: React.FC = () => {
  const {
    timeline,
    activeTimelineIndex,
    setActiveTimelineIndex,
    playSoundboxVoice,
    stopSoundboxVoice,
    isPlayingSoundboxVoice,
    activeSoundboxLanguage,
  } = useSimulationStore();

  const current = timeline[activeTimelineIndex];

  return (
    <section id="journey" className="py-20 lg:py-28 border-b border-slate-800/80 bg-grid-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Section 5 • Illustrated Merchant Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            A Day in the Life of <span className="text-gradient-paytm">Ramesh Ji</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From sunrise opening to midnight cash closure, see how the Paytm Growth Agent works as an invisible teammate in an active neighborhood retail shop.
          </p>
        </div>

        {/* 4 Time Slots Interactive Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {timeline.map((item, idx) => {
            const isSelected = activeTimelineIndex === idx;
            return (
              <button
                key={item.time}
                onClick={() => {
                  stopSoundboxVoice();
                  setActiveTimelineIndex(idx);
                }}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/20 translate-y-[-2px]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-500'
                  }`}>
                    {item.phase}
                  </span>
                </div>
                <div className="text-sm font-bold text-white mb-0.5">{item.time}</div>
                <div className="text-xs text-slate-400 font-medium">{item.label}</div>
              </button>
            );
          })}
        </div>

        {/* Main Journey Stage Display */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-cyan-500/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Journey Narrative & Telemetry (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{current.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-cyan-400">{current.time}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-xs text-slate-400 font-medium">{current.phase} Routine</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {current.headline}
                  </h3>
                </div>
              </div>

              {/* Agent Interaction Explanation */}
              <div className="glass-panel-subtle p-4 rounded-xl border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  Agent Multi-Model Coordination
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {current.agentInteraction}
                </p>
              </div>

              {/* Automated Actions Accomplished */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                  Autonomous Background Actions Completed:
                </span>
                <div className="space-y-2">
                  {current.actionsDone.map((action, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Business Metrics at this hour */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Current GMV</span>
                  <span className="text-sm font-bold text-white">{current.metrics.revenue}</span>
                </div>
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Projected Target</span>
                  <span className="text-sm font-bold text-cyan-400">{current.metrics.projected}</span>
                </div>
                <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 block">Footfall Activity</span>
                  <span className="text-sm font-bold text-emerald-400">{current.metrics.footfall}</span>
                </div>
              </div>
            </div>

            {/* Right: Soundbox Voice & WhatsApp Channels (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Paytm Soundbox Voice Player */}
              <div className="rounded-2xl bg-gradient-to-br from-[#002970] to-[#001740] p-5 border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/10 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#00BAF2] flex items-center justify-center text-slate-950 font-black shadow-md">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Paytm Soundbox Voice AI</h4>
                      <span className="text-[10px] text-cyan-300">Live Audio Briefing</span>
                    </div>
                  </div>

                  {/* Soundwave animation */}
                  {isPlayingSoundboxVoice && (
                    <div className="flex items-center gap-1 h-6">
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-1" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-2" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-3" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-4" />
                      <span className="w-1 bg-cyan-400 rounded-full animate-wave-5" />
                    </div>
                  )}
                </div>

                {/* Voice Transcript */}
                <div className="bg-[#050B17]/90 rounded-xl p-3.5 border border-cyan-500/20 text-xs text-slate-200 font-medium mb-4 leading-relaxed">
                  <p className="italic text-cyan-200/90 mb-2">
                    &quot;{current.soundboxVoiceHindi}&quot;
                  </p>
                  <p className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                    English translation: &quot;{current.soundboxVoiceEnglish}&quot;
                  </p>
                </div>

                {/* Play Buttons */}
                <div className="flex items-center gap-2">
                  {isPlayingSoundboxVoice ? (
                    <button
                      onClick={stopSoundboxVoice}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <Square className="w-3.5 h-3.5 fill-current" />
                      <span>Stop Voice</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => playSoundboxVoice('hi')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#00BAF2] hover:bg-[#38bdf8] text-slate-950 text-xs font-bold transition-all shadow-md"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play Hindi</span>
                      </button>
                      <button
                        onClick={() => playSoundboxVoice('en')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play English</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* WhatsApp Message Preview */}
              <div className="rounded-2xl bg-[#0b141a] p-4 border border-emerald-500/30 text-xs shadow-lg">
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-800 text-emerald-400 font-bold">
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Business Assistant (Ramesh Ji)</span>
                </div>
                <div className="bg-[#1f2c34] rounded-xl p-3 text-slate-200 whitespace-pre-line leading-relaxed text-[11px] shadow">
                  {current.whatsappMessage}
                </div>
                <div className="text-[10px] text-slate-500 text-right mt-1.5">
                  Delivered • Read 2 mins ago
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
