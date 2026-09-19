'use client';

import React from 'react';
import { AlertTriangle, TrendingDown, EyeOff, Users, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const MerchantProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-20 lg:py-28 border-b border-slate-800/80 bg-[#040915] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Section 2 • The Merchant Reality</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Flying Blind in a <span className="text-rose-400">₹65 Lakh Crore</span> Retail Economy.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            30 Million Indian merchants run on pure intuition, pen-and-paper diaries, and guesswork.
            Meanwhile, quick-commerce giants armed with billion-dollar predictive algorithms are eating their most lucrative customer baskets.
          </p>
        </div>

        {/* 4 Core Failure Modes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-rose-500/20 hover:border-rose-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
              <EyeOff className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-1">
              Crisis #1
            </span>
            <h3 className="text-base font-bold text-white mb-2">Inventory Blindness</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Merchants tie up ₹1.2 Lakhs of precious working capital in slow-moving stock, while running out of high-margin essentials during peak hours.
            </p>
            <div className="bg-slate-900/80 rounded-lg p-3 border border-rose-500/20 text-[11px] text-rose-300 font-medium">
              ❌ Impact: 24% of store capital dead for &gt;45 days
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 hover:border-amber-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
              <TrendingDown className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Crisis #2
            </span>
            <h3 className="text-base font-bold text-white mb-2">Demand Ambiguity</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Sudden monsoon rain, local cricket fixtures, or unexpected holidays trigger massive perishable spoilage or missed windfall sales.
            </p>
            <div className="bg-slate-900/80 rounded-lg p-3 border border-amber-500/20 text-[11px] text-amber-300 font-medium">
              ❌ Impact: ₹18,000+ monthly loss in perishable dairy & snacks
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 block mb-1">
              Crisis #3
            </span>
            <h3 className="text-base font-bold text-white mb-2">Revenue Leakage</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Manual khata credit recovery is delayed, supplier invoice price creeping goes unnoticed, and peak queue drop-offs are never measured.
            </p>
            <div className="bg-slate-900/80 rounded-lg p-3 border border-purple-500/20 text-[11px] text-purple-300 font-medium">
              ❌ Impact: ₹4,800/day unmeasured revenue slippage
            </div>
          </div>

          {/* Card 4 */}
          <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 hover:border-blue-500/40 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-1">
              Crisis #4
            </span>
            <h3 className="text-base font-bold text-white mb-2">Customer Defection</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Instant 10-minute delivery dark stores offer algorithmic discounts, peeling away the merchant's most affluent, high-ticket recurring families.
            </p>
            <div className="bg-slate-900/80 rounded-lg p-3 border border-blue-500/20 text-[11px] text-blue-300 font-medium">
              ❌ Impact: 32% loss of high-margin recurring grocery orders
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison: Traditional Kirana vs Growth Agent */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-700/80">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              The Fundamental Shift
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Why adding another complex software dashboard never works for a busy Indian store owner
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* The Traditional Way */}
            <div className="bg-rose-950/20 rounded-xl p-6 border border-rose-500/30">
              <div className="flex items-center gap-2 mb-4 text-rose-400 font-bold text-sm">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>The Traditional Struggle (What Fails)</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Complex POS & ERP:</strong> Requires expensive hardware, barcode scanners, and typing every SKU manually. Abandoned after 2 weeks.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Reactive Decision Making:</strong> Reorders only when the shelf is completely empty and a customer leaves angry.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Zero Customer Intel:</strong> No way to know which apartment resident hasn’t returned this week or how to bring them back.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Time Drain:</strong> Spending 2-3 hours every night tallying paper bills and calculating credit balances.</span>
                </li>
              </ul>
            </div>

            {/* The Paytm Agent Way */}
            <div className="bg-emerald-950/20 rounded-xl p-6 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Paytm Merchant Growth Agent (The Teammate)</span>
              </div>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Zero Learning Curve:</strong> Operates through the Soundbox already on the counter and WhatsApp on the merchant's phone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Predictive Restock:</strong> Prophet & XGBoost alert the merchant 24 hours before stock runs out, drafting a 1-tap PO to the distributor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Autonomous Hyperlocal Campaigns:</strong> Detects dormant customers and broadcasts personalized WhatsApp deals in 1 tap.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Computer Vision & OCR:</strong> Take a photo of the distributor invoice or shelf; inventory and margins update instantly.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
