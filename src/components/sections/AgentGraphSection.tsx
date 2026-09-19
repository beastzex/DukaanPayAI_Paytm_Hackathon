'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Lazy-load 3D WebGL scene so it doesn't block initial page paint
const AgentGraph3D = dynamic(
  () => import('@/components/ui/AgentGraph3D').then((mod) => mod.AgentGraph3D),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] flex items-center justify-center text-xs font-mono text-slate-500">
        INITIALIZING 3D AGENT TOPOLOGY...
      </div>
    ),
  }
);

export const AgentGraphSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-white via-[#F8FAFC] to-[#FAF8F5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-left mb-8 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-headline font-normal text-slate-900 tracking-tight">
            Six specialized agents. One LangGraph brain.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl leading-relaxed">
            Deterministic mathematical forecasting (Prophet, XGBoost) strictly separated from cognitive Groq LPUs. Hover over any wireframe node to inspect its operational mandate.
          </p>
        </div>

        {/* 3D Wireframe Scene Container */}
        <div className="w-full rounded-2xl bg-[#F8FAFC] border border-slate-200 shadow-sm overflow-hidden">
          <AgentGraph3D />
        </div>
      </div>
    </section>
  );
};
