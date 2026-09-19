'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulation-store';
import { Sparkles, ShieldCheck, Play, Volume2, Award, Zap, ChevronRight } from 'lucide-react';

interface HeaderProps {
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSimulator }) => {
  const { isJudgeMode, setJudgeMode, playSoundboxVoice, isPlayingSoundboxVoice } = useSimulationStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#030712]/85 backdrop-blur-xl">
      {/* Top Hackathon Banner */}
      <div className="bg-gradient-to-r from-[#002970] via-[#005CE6] to-[#00BAF2] px-4 py-1.5 text-center text-xs font-medium text-white flex items-center justify-center gap-2">
        <Award className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
        <span>Paytm Build For India AI Hackathon — Track 1: Merchant Growth AI (Finalist Project)</span>
        <span className="hidden sm:inline bg-white/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
          Live Prototype
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#002970] to-[#00BAF2] p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#050B17] rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-black text-[#00BAF2] tracking-tighter">P<span className="text-white">G</span></span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#050B17]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                Paytm <span className="text-[#00BAF2]">Growth Agent</span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                <Sparkles className="w-2.5 h-2.5" /> AI Teammate
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Observe → Understand → Predict → Recommend → Execute
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">Problem</a>
          <a href="#solution" className="hover:text-cyan-400 transition-colors">Autonomous Loop</a>
          <a href="#ecosystem" className="hover:text-cyan-400 transition-colors">8 Agents</a>
          <a href="#journey" className="hover:text-cyan-400 transition-colors">Day in the Life</a>
          <a href="#inventory" className="hover:text-cyan-400 transition-colors">Vision & OCR</a>
          <a href="#architecture" className="hover:text-cyan-400 transition-colors">Architecture</a>
          <a href="#impact" className="hover:text-cyan-400 transition-colors">ROI Calculator</a>
          <a href="#moat" className="hover:text-cyan-400 transition-colors">Why Paytm</a>
          <a href="#team" className="hover:text-cyan-400 transition-colors">Team</a>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Soundbox voice check */}
          <button
            onClick={() => playSoundboxVoice('hi')}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
              isPlayingSoundboxVoice
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-pulse'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-white'
            }`}
            title="Listen to Paytm Soundbox Hindi Voice Briefing"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#00BAF2]" />
            <span className="text-[11px]">Soundbox</span>
          </button>

          {/* Judge Mode Switcher */}
          <button
            onClick={() => setJudgeMode(!isJudgeMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isJudgeMode
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'bg-slate-900 border-slate-700/60 text-slate-300 hover:border-slate-600'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isJudgeMode ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>{isJudgeMode ? 'Judge Mode: ON' : 'Judge Mode'}</span>
          </button>

          {/* Primary Simulator CTA Button */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#005CE6] to-[#00BAF2] hover:from-[#004dc2] hover:to-[#00a8dc] text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Simulator</span>
          </button>
        </div>
      </div>
    </header>
  );
};
