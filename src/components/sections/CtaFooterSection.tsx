'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';

export const CtaFooterSection: React.FC = () => {
  const handleStart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-gradient-to-b from-[#F5F5F7] via-[#FAF9F6] to-[#F1F5F9] text-left border-t border-slate-200/80">
      {/* Quiet Close CTA Section */}
      <div className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-left space-y-6">
          <span className="text-xs font-mono text-amber-700 font-semibold tracking-wide">
            DEPLOY ALONGSIDE YOUR STORE
          </span>
          <h2 className="text-3xl sm:text-5xl font-headline font-normal text-slate-900 tracking-tight leading-[1.15]">
            Run alongside your merchants. <br />
            Zero software to install.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 font-sans max-w-xl leading-relaxed">
            DukaanPayAI integrates directly into existing Paytm Soundbox hardware and WhatsApp. Give your retail network an autonomous business partner today.
          </p>

          {/* Saffron CTA with subtle border-beam (ONLY place on page with this treatment) */}
          <div className="pt-4">
            <Button variant="saffron-beam" onClick={handleStart}>
              Deploy DukaanPayAI →
            </Button>
          </div>
        </div>
      </div>

      {/* Minimal Bottom Bar */}
      <div className="py-8 px-4 sm:px-8 max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          DukaanPayAI / Paytm Build For India Hackathon
        </div>
        <div>
          Track 1: Merchant Growth AI
        </div>
      </div>
    </footer>
  );
};
