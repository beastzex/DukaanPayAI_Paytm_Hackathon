'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const RoiCalculatorSection: React.FC = () => {
  const [dailyTx, setDailyTx] = useState<number>(140);
  const [basketSize, setBasketSize] = useState<number>(180);
  const [stockouts, setStockouts] = useState<number>(8);

  // Dynamic calculations
  const monthlyRevenue = dailyTx * basketSize * 30;
  const stockoutSavings = Math.round(stockouts * (basketSize * 2.6));
  const retentionSavings = Math.round(dailyTx * 18);
  const ocrSavings = Math.round(dailyTx * 9.5);
  const totalMonthlyRecovered = stockoutSavings + retentionSavings + ocrSavings;
  const totalAnnualRecovered = totalMonthlyRecovered * 12;

  return (
    <section id="roi-calculator" className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-[#F1F5F9] via-white to-[#F8FAFC]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left mb-14 space-y-3">
          <div className="text-xs font-mono text-amber-700 font-semibold tracking-wide">
            STORE AUDIT SIMULATOR / BOTTOM-LINE ROI
          </div>
          <h2 className="text-3xl sm:text-4xl font-headline font-normal text-slate-950 tracking-tight">
            Calculate your store&apos;s hidden cash recovery.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl leading-relaxed">
            Move the sliders to match your daily retail footprint. See how much lost revenue DukaanPayAI reclaims every month.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive Sliders */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6 text-left">
            {/* Slider 1: Daily UPI Transactions */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="font-semibold text-slate-800">Daily UPI Transactions</span>
                <span className="font-telemetry font-bold text-teal-700 text-sm">{dailyTx} scans/day</span>
              </div>
              <input
                type="range"
                min="40"
                max="400"
                step="10"
                value={dailyTx}
                onChange={(e) => setDailyTx(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>40 scans</span>
                <span>400 scans</span>
              </div>
            </div>

            {/* Slider 2: Average Basket Size */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="font-semibold text-slate-800">Average Basket Size</span>
                <span className="font-telemetry font-bold text-teal-700 text-sm">₹{basketSize}</span>
              </div>
              <input
                type="range"
                min="60"
                max="600"
                step="20"
                value={basketSize}
                onChange={(e) => setBasketSize(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>₹60</span>
                <span>₹600</span>
              </div>
            </div>

            {/* Slider 3: Stockout Incidents */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="font-semibold text-slate-800">Monthly Stockout Surprises</span>
                <span className="font-telemetry font-bold text-amber-700 text-sm">{stockouts} times</span>
              </div>
              <input
                type="range"
                min="2"
                max="24"
                step="1"
                value={stockouts}
                onChange={(e) => setStockouts(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>2 times</span>
                <span>24 times</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
              <span>Estimated Monthly GMV:</span>
              <span className="font-telemetry font-semibold text-slate-800">₹{(monthlyRevenue).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Right Column: Computed Value Card */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white via-[#F8FAFC] to-[#F1F5F9] border border-slate-200 shadow-md space-y-6 text-left">
            <div>
              <span className="text-xs font-mono text-teal-800 font-semibold bg-teal-50 border border-teal-200/60 px-3 py-1 rounded-full">
                NET PREVENTABLE LOSS AUDIT
              </span>
              <div className="mt-4">
                <div className="text-xs text-slate-600 font-sans">Estimated Monthly Bottom-Line Gain:</div>
                <motion.div
                  key={totalMonthlyRecovered}
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  className="text-4xl sm:text-5xl font-telemetry font-bold text-teal-800 tracking-tight mt-1"
                >
                  ₹{totalMonthlyRecovered.toLocaleString('en-IN')}
                  <span className="text-sm font-sans font-normal text-slate-600"> / month</span>
                </motion.div>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3 pt-4 border-t border-slate-200 text-xs font-sans">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Stockout Revenue Preserved:</span>
                <span className="font-telemetry font-semibold text-slate-900">+₹{stockoutSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Dormant Society Customers Recovered:</span>
                <span className="font-telemetry font-semibold text-slate-900">+₹{retentionSavings.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Wholesale Overcharge Credits Claimed:</span>
                <span className="font-telemetry font-semibold text-slate-900">+₹{ocrSavings.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Annual Value Highlight */}
            <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-[11px] font-mono text-slate-600 font-medium">ANNUAL NET PROFIT BOOST</div>
                <div className="text-xl font-telemetry font-bold text-slate-900">
                  ₹{totalAnnualRecovered.toLocaleString('en-IN')}
                </div>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-500 text-slate-950">
                100% Free Pilot
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
