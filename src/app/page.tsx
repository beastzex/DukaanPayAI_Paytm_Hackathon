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

import Link from 'next/link';

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-white text-[#0F1E36] font-sans antialiased selection:bg-[#00BAF2] selection:text-white">
        {/* Minimal Top Header on Pure White */}
        <header className="w-full border-b border-[#DCE8F6] bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-headline text-lg font-extrabold tracking-tight text-[#002E6E]">
                DukaanPay<span className="text-[#00BAF2]">AI</span>
              </span>
              <span className="hidden md:inline text-[10px] font-mono text-[#002E6E] bg-[#EBF5FF] border border-[#DCE8F6] px-2.5 py-0.5 rounded-full font-semibold">
                Paytm Build for India • Track 1
              </span>
            </div>

            <nav className="hidden lg:flex items-center gap-6 text-xs text-slate-600 font-medium">
              <a href="#story" className="hover:text-[#002E6E] transition-colors">Merchant Story</a>
              <a href="#simulator" className="hover:text-[#002E6E] transition-colors">Interactive Lab</a>
              <a href="#ecosystem" className="hover:text-[#002E6E] transition-colors">Paytm Synergy</a>
              <a href="#roi-calculator" className="hover:text-[#002E6E] transition-colors">ROI Calculator</a>
              <a href="#agent-graph" className="hover:text-[#002E6E] transition-colors">Architecture</a>
              <a href="#ai-models" className="hover:text-[#002E6E] transition-colors font-semibold text-[#002E6E]">Real ML Models</a>
              <Link href="/dashboard" className="text-[#00BAF2] font-bold hover:underline flex items-center gap-1">
                <span>Live Portal</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#00BAF2] animate-ping" />
              </Link>
            </nav>

            <div className="flex items-center gap-2.5">
              <Link
                href="/dashboard"
                className="text-xs font-bold px-4 py-1.5 rounded-lg bg-[#00BAF2] hover:bg-[#0099D8] text-white transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>🚀 Merchant Dashboard</span>
              </Link>
            </div>
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
