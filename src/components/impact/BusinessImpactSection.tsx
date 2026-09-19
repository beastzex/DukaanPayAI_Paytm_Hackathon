'use client';

import React from 'react';
import { useSimulationStore } from '@/store/simulation-store';
import { Calculator, TrendingUp, DollarSign, Clock, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { formatINR } from '@/utils/cn';

export const BusinessImpactSection: React.FC = () => {
  const { roiParams, setRoiParams, getRoiResults } = useSimulationStore();
  const results = getRoiResults();

  const businessTypes = [
    { id: 'kirana', label: 'Kirana & Grocery', avgMargin: '18-22%' },
    { id: 'pharmacy', label: 'Chemist / Pharmacy', avgMargin: '20-25%' },
    { id: 'cafe', label: 'Tea Stall / Cafe', avgMargin: '35-45%' },
    { id: 'fmcg_retail', label: 'General FMCG Store', avgMargin: '16-20%' },
    { id: 'sweets_dairy', label: 'Dairy & Sweets', avgMargin: '22-28%' },
  ];

  return (
    <section id="impact" className="py-20 lg:py-28 border-b border-slate-800/80 bg-[#040915] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calculator className="w-3.5 h-3.5" />
            <span>Section 10 • Quantified Business Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Transforming Kirana Economics: <span className="text-emerald-400">Interactive ROI Calculator</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Calculate the exact rupee impact for your retail store. See how autonomous restock, lost revenue recovery, and retention campaigns add straight to your bottom-line profit.
          </p>
        </div>

        {/* Interactive ROI Calculator Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-emerald-500/30 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Select Store Business Category
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {businessTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setRoiParams({ businessType: type.id as any })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        roiParams.businessType === type.id
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-xs truncate">{type.label}</div>
                      <div className="text-[10px] text-slate-500 font-normal">Margin: {type.avgMargin}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Revenue Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-slate-300 uppercase tracking-wider">Current Monthly Turnover (GMV)</span>
                  <span className="font-black text-emerald-400 text-base">{formatINR(roiParams.monthlyRevenue)}</span>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={2500000}
                  step={25000}
                  value={roiParams.monthlyRevenue}
                  onChange={(e) => setRoiParams({ monthlyRevenue: Number(e.target.value) })}
                  className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>₹1 Lakh/mo</span>
                  <span>₹10 Lakhs/mo</span>
                  <span>₹25 Lakhs/mo</span>
                </div>
              </div>

              {/* Average Order Value & Repeat Rate */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Avg Basket Size:</span>
                  <div className="text-sm font-bold text-white bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    ₹{roiParams.avgBasketSize} per order
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Repeat Customer Rate:</span>
                  <div className="text-sm font-bold text-white bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    {roiParams.repeatCustomerRate}% returning
                  </div>
                </div>
              </div>
            </div>

            {/* Right Output Projections (6 cols) */}
            <div className="lg:col-span-6 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-[#040915] p-6 sm:p-8 rounded-2xl border-2 border-emerald-500/40 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                    Calculated Monthly Advantage
                  </span>
                  <h3 className="text-xl font-bold text-white">Net Bottom-Line Impact</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  Day 1 Payback
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">Estimated Extra Monthly Profit:</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                    +{formatINR(results.extraMonthlyProfit)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">Annualized Profit Increase:</span>
                  <span className="text-lg font-bold text-white">
                    +{formatINR(results.annualProfitIncrease)}/year
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-300">Working Capital Unlocked:</span>
                  <span className="text-base font-bold text-cyan-400">
                    {formatINR(results.unlockedWorkingCapital)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Stockout Reduction</span>
                  <span className="text-emerald-400 font-bold text-base">-{results.stockoutReductionRate}%</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Time Saved / Week</span>
                  <span className="text-cyan-400 font-bold text-base">{results.hoursSavedWeekly} Hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
