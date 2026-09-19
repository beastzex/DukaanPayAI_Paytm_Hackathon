'use client';

import React from 'react';

export const ProofStripSection: React.FC = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F5F5F7]">
      <div className="max-w-6xl mx-auto">
        {/* Section Subhead */}
        <div className="text-left mb-12">
          <h2 className="text-2xl sm:text-3xl font-headline font-normal text-slate-900 tracking-tight">
            Proven capital returned to store bottom-lines.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans mt-1">
            Measured across verified neighborhood kirana pilots.
          </p>
        </div>

        {/* Three Plain Stat Blocks with Generous Whitespace */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16 text-left">
          {/* Stat 1 */}
          <div className="space-y-2 border-t border-slate-200 pt-6">
            <div className="text-3xl sm:text-4xl font-telemetry font-bold text-teal-700 tabular-nums tracking-tight">
              ₹4,200/wk
            </div>
            <p className="text-sm font-semibold text-slate-900 font-sans">
              Recovered from averted stockouts
            </p>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Predictive 24-hr reorder prompts prevent evening rush shortages of high-margin dairy, butter, and packaged goods.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-2 border-t border-slate-200 pt-6">
            <div className="text-3xl sm:text-4xl font-telemetry font-bold text-teal-700 tabular-nums tracking-tight">
              ₹6,800/mo
            </div>
            <p className="text-sm font-semibold text-slate-900 font-sans">
              From churned customer recovery
            </p>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Targeted WhatsApp combo nudges reactivate dormant society residents before they permanently defect to delivery apps.
            </p>
          </div>

          {/* Stat 3 */}
          <div className="space-y-2 border-t border-slate-200 pt-6">
            <div className="text-3xl sm:text-4xl font-telemetry font-bold text-teal-700 tabular-nums tracking-tight">
              ₹1,450/mo
            </div>
            <p className="text-sm font-semibold text-slate-900 font-sans">
              From price-overcharge audits
            </p>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Supplier bill OCR audits wholesale line-item rates against agreed contract prices, flagging silent rate drift automatically.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
