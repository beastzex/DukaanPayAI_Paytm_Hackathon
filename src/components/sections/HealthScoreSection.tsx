'use client';

import React from 'react';
import { RadialScore } from '@/components/ui/RadialScore';

export const HealthScoreSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-[#FAF8F5] via-white to-[#F8FAFC]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
        {/* Left narrative */}
        <div className="flex-1 text-left space-y-3">
          <h2 className="text-3xl sm:text-4xl font-headline font-normal text-slate-900 tracking-tight">
            Credit-worthy health at a glance.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed max-w-md">
            Lenders and distributors have historically treated kirana stores as high-risk black boxes. By auditing daily cash-flow velocity and inventory discipline, DukaanPayAI builds an unforgeable 0-100 health index.
          </p>
        </div>

        {/* Right Radial & 4 Weighted Bars */}
        <div className="w-full md:w-auto">
          <RadialScore />
        </div>
      </div>
    </section>
  );
};
