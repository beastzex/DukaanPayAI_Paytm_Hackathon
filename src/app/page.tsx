'use client';

import React from 'react';
import { SmoothScroll } from '@/components/common/SmoothScroll';
import { HeroSection } from '@/components/sections/HeroSection';
import { TelemetryStrip } from '@/components/ui/TelemetryStrip';
import { MerchantStorySection } from '@/components/sections/MerchantStorySection';
import { SimulatorSection } from '@/components/sections/SimulatorSection';
import { GrowthLoopSection } from '@/components/sections/GrowthLoopSection';
import { EcosystemBentoSection } from '@/components/sections/EcosystemBentoSection';
import { RoiCalculatorSection } from '@/components/sections/RoiCalculatorSection';
import { AgentGraphSection } from '@/components/sections/AgentGraphSection';
import { AiModelTelemetrySection } from '@/components/sections/AiModelTelemetrySection';
import { HealthScoreSection } from '@/components/sections/HealthScoreSection';
import { ProofStripSection } from '@/components/sections/ProofStripSection';
import { CtaFooterSection } from '@/components/sections/CtaFooterSection';

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-amber-500 selection:text-white">
        {/* Minimal Top Header on Pure White */}
        <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg font-bold tracking-tight text-slate-900">
                DukaanPay<span className="text-teal-700">AI</span>
              </span>
              <span className="hidden md:inline text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                Track 1: Merchant Growth AI
              </span>
            </div>

            <nav className="hidden sm:flex items-center gap-6 text-xs text-slate-600 font-medium">
              <a href="#story" className="hover:text-slate-950 transition-colors">Merchant Story</a>
              <a href="#simulator" className="hover:text-slate-950 transition-colors">Interactive Lab</a>
              <a href="#ecosystem" className="hover:text-slate-950 transition-colors">Paytm Synergy</a>
              <a href="#roi-calculator" className="hover:text-slate-950 transition-colors">ROI Calculator</a>
              <a href="#agent-graph" className="hover:text-slate-950 transition-colors">Architecture</a>
              <a href="#ai-models" className="hover:text-slate-950 transition-colors font-semibold text-teal-700">Real ML Models</a>
              <a href="#health-score" className="hover:text-slate-950 transition-colors">Health Score</a>
            </nav>

            <a
              href="#simulator"
              className="text-xs font-semibold px-4 py-1.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-xs"
            >
              Live Demo
            </a>
          </div>
        </header>

        {/* Page Content with seamless gradient blending between sections */}
        <main>
          {/* 1. HERO (Fraunces headline, WhatsApp Sequence, Parallax Badges) */}
          <HeroSection />

          {/* 2. LIVE TELEMETRY STRIP (30M+ Kirana, ₹85B+ UPI, 92% Zero-Tech) */}
          <TelemetryStrip />

          {/* 3. MERCHANT STORY (Pinterest-style Editorial Images + Ramesh Ji Daily Timeline) */}
          <MerchantStorySection />

          {/* 4. INTERACTIVE WHATSAPP SIMULATOR LAB (Stockout, Rain Surge, OCR Audit, Dormant) */}
          <SimulatorSection />

          {/* 5. THE AUTONOMOUS GROWTH LOOP (5 Stages connected horizontal thread) */}
          <GrowthLoopSection />

          {/* 6. PAYTM HARDWARE & ECOSYSTEM SYNERGY BENTO GRID (Soundbox 4G, QR UPI, WhatsApp, OCR) */}
          <EcosystemBentoSection />

          {/* 7. INTERACTIVE ROI & BOTTOM-LINE REVENUE RECOVERY CALCULATOR */}
          <RoiCalculatorSection />

          {/* 8. ARCHITECTURE: 3D AGENT GRAPH (Three.js wireframe rotating nodes) */}
          <div id="agent-graph">
            <AgentGraphSection />
          </div>

          {/* 9. REAL ML MODEL TELEMETRY & VERIFICATION (Prophet, XGBoost, RFM K-Means, Groq) */}
          <AiModelTelemetrySection />

          {/* 10. MERCHANT HEALTH SCORE (Radial count-up to 88 + 4 flat weighted bars) */}
          <div id="health-score">
            <HealthScoreSection />
          </div>

          {/* 11. REAL-WORLD PROOF STRIP (Three quiet empirical stat blocks) */}
          <div id="proof">
            <ProofStripSection />
          </div>

          {/* 12. CTA / FOOTER (Single Saffron Border-Beam Glow Button + Minimal Footer) */}
          <CtaFooterSection />
        </main>
      </div>
    </SmoothScroll>
  );
}
