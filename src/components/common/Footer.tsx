'use client';

import React from 'react';
import { Award, ExternalLink, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#02050e] py-12 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#002970] to-[#00BAF2] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#050B17] rounded-[6px] flex items-center justify-center text-xs font-black text-cyan-400">
                PG
              </div>
            </div>
            <div>
              <span className="text-sm font-bold text-white">Paytm Merchant Growth Agent</span>
              <p className="text-[11px] text-slate-500">The AI Teammate That Runs Alongside Every Merchant</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <a href="#problem" className="hover:text-white transition-colors">The Problem</a>
            <a href="#solution" className="hover:text-white transition-colors">Autonomous Loop</a>
            <a href="#ecosystem" className="hover:text-white transition-colors">8 Agents</a>
            <a href="#journey" className="hover:text-white transition-colors">Daily Journey</a>
            <a href="#inventory" className="hover:text-white transition-colors">Vision AI & OCR</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#impact" className="hover:text-white transition-colors">ROI Calculator</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Paytm Build For India AI Hackathon 2026 — Track 1: Merchant Growth AI</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Engineered with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>for 30M+ Indian Retailers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
