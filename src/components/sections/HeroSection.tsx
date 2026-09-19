'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { PhoneFrame } from '@/components/ui/PhoneFrame';
import { ParallaxBadge } from '@/components/ui/ParallaxBadge';
import { motion } from 'framer-motion';

export const HeroSection: React.FC = () => {
  const handleScrollToDemo = () => {
    const el = document.getElementById('story');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full pt-14 pb-24 sm:pt-24 sm:pb-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-white via-[#FAF8F5] to-[#F5F5F7] overflow-hidden">
      {/* Subtle organic warm light aura in background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(245,158,11,0.07),rgba(13,148,136,0.04),transparent_70%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-16 relative z-10">
        {/* Left Column: Left-aligned typography, asymmetric layout */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 text-left space-y-6"
        >
          {/* Small subhead above headline */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-mono text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            व्यापार का नया विश्वास / DUKAANPAY AI
          </div>

          {/* Two-line headline in Fraunces with descender clearance */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-normal text-slate-950 leading-[1.12] tracking-tight pb-2">
            The AI business partner <br className="hidden sm:inline" />
            inside your WhatsApp.
          </h1>

          {/* One-sentence plain-language subline */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans max-w-xl">
            DukaanPayAI observes daily UPI transactions, forecasts stockouts before shelves empty, and executes distributor reorders with a single tap.
          </p>

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button variant="saffron" onClick={handleScrollToDemo}>
              See it in action
            </Button>
            <a
              href="#simulator"
              className="text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors underline underline-offset-4"
            >
              Try Interactive Simulator →
            </a>
          </div>

          {/* Micro trust indicators */}
          <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 font-sans border-t border-slate-200/70">
            <div className="flex items-center gap-1.5">
              <span className="text-teal-700 font-bold">✓</span> Zero ERP to install
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-teal-700 font-bold">✓</span> Works on Hindi & Hinglish
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-teal-700 font-bold">✓</span> Linked to Soundbox
            </div>
          </div>
        </motion.div>

        {/* Right Column: Mobile frame with live sequenced WhatsApp thread + Parallax Depth Badges */}
        <div className="relative w-full lg:w-auto shrink-0 flex justify-center">
          {/* Parallax Floating Badge 1: Top Left */}
          <ParallaxBadge
            speed={-15}
            className="-top-4 -left-6 sm:-left-10 hidden sm:flex"
          >
            <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              ↑
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-900 leading-none">₹4,200 Stockout Saved</div>
              <div className="text-[10px] text-slate-500 leading-none mt-0.5">Automated morning reorder</div>
            </div>
          </ParallaxBadge>

          {/* Parallax Floating Badge 2: Bottom Right */}
          <ParallaxBadge
            speed={20}
            className="-bottom-4 -right-4 sm:-right-8 hidden sm:flex"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <div>
              <div className="text-[11px] font-semibold text-slate-900 leading-none">Paytm Soundbox 4G</div>
              <div className="text-[10px] text-teal-700 font-mono leading-none mt-0.5">Telemetry live & syncing</div>
            </div>
          </ParallaxBadge>

          <PhoneFrame />
        </div>
      </div>
    </section>
  );
};
