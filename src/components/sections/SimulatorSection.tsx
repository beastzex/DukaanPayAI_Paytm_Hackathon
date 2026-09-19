'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Scenario {
  id: string;
  tabLabel: string;
  problemBadge: string;
  agentUsed: string;
  waMessage: string;
  waDetail: string;
  buttonText: string;
  approvedText: string;
  recoveryStat: string;
  merchantReply: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'stockout',
    tabLabel: 'Stockout Rush Alert',
    problemBadge: 'Demand & Restock Agent',
    agentUsed: 'Prophet + XGBoost',
    waMessage: '⚠️ Stockout Alert: Amul Taaza Milk (500ml) will run out by 4 PM.',
    waDetail: 'Evening rush footfall will be +28%. Distributor order cutoff is 12:30 PM today.',
    buttonText: 'Approve Reorder (₹4,200)',
    approvedText: '✓ PO #8920 Dispatched to Distributor',
    recoveryStat: '₹4,200 Protected',
    merchantReply: 'Haan, kar do',
  },
  {
    id: 'rain',
    tabLabel: 'Monsoon Demand Surge',
    problemBadge: 'Weather & Footfall Agent',
    agentUsed: 'IMD Radar + LightGBM',
    waMessage: '🌧️ Heavy Rain Alert: Rain expected in your pin code between 4:30 - 7:00 PM.',
    waDetail: 'Tea and packaged snacks demand surges 3.4x during rain. Launch 10% combo deal on Soundbox?',
    buttonText: 'Broadcast Combo on Soundbox',
    approvedText: '✓ Voice Promo Active on Soundbox',
    recoveryStat: '+₹2,850 Upsell',
    merchantReply: 'Theek hai, shuru karo',
  },
  {
    id: 'ocr',
    tabLabel: 'Supplier Overcharge Caught',
    problemBadge: 'Khata OCR Audit Agent',
    agentUsed: 'Qwen-2-VL-72B + Rule Engine',
    waMessage: '🧾 Price Discrepancy Found: Modern Dairy invoice billed ₹62/L instead of agreed ₹59/L.',
    waDetail: 'Net overcharge: ₹850 across 12 crates. Send WhatsApp debit note to distributor?',
    buttonText: 'Send Debit Note via WhatsApp',
    approvedText: '✓ Debit Note Claim Dispatched',
    recoveryStat: '₹850 Recovered',
    merchantReply: 'Bhejo claim turant',
  },
  {
    id: 'retention',
    tabLabel: 'Dormant Society Reactivation',
    problemBadge: 'Customer Retention Agent',
    agentUsed: 'RFM Clustering + Groq LPU',
    waMessage: '👥 24 Society Regulars haven’t visited in 14 days (likely ordering on Blinkit).',
    waDetail: 'Send WhatsApp “Ghar Ki Dukaan” weekend grocery bundle with free 10-min home delivery?',
    buttonText: 'Send WhatsApp Nudge to 24 Residents',
    approvedText: '✓ 24 Nudges Sent (11 Orders Received)',
    recoveryStat: '+₹6,800 Retained',
    merchantReply: 'Haan bhej do sabko',
  },
];

export const SimulatorSection: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('stockout');
  const [approvedStates, setApprovedStates] = useState<Record<string, boolean>>({});

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
  const isApproved = approvedStates[scenario.id] || false;

  const handleApprove = () => {
    setApprovedStates((prev) => ({ ...prev, [scenario.id]: true }));
  };

  return (
    <section id="simulator" className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-[#F8FAFC] via-[#FAFAFA] to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left mb-12 space-y-3">
          <div className="text-xs font-mono text-amber-700 font-semibold tracking-wide">
            LIVE INTERACTIVE TEST LAB / ZERO-TECH INTERACTION
          </div>
          <h2 className="text-3xl sm:text-4xl font-headline font-normal text-slate-950 tracking-tight">
            Experience the 1-tap WhatsApp resolution.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl leading-relaxed">
            Select a real-world merchant emergency below. Watch how DukaanPayAI synthesizes mathematical models into plain Hindi prompts that execute with one merchant tap.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2.5 mb-10">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveScenarioId(s.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium font-sans transition-all cursor-pointer ${
                activeScenarioId === s.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {s.tabLabel}
            </button>
          ))}
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: AI Model Intelligence Card */}
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-mono text-teal-700 font-semibold">
                  {scenario.problemBadge}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Engine: {scenario.agentUsed}
                </span>
              </div>

              <h3 className="text-xl font-headline font-normal text-slate-900">
                {scenario.tabLabel}
              </h3>

              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Autonomous agent continuously evaluates real-time POS transaction cadence, supplier catalogs, and regional anomalies.
              </p>

              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/50 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono text-teal-800">PREVENTED VALUE</div>
                  <div className="text-lg font-telemetry font-bold text-teal-900">
                    {scenario.recoveryStat}
                  </div>
                </div>
                <div className="text-xs font-mono text-teal-700 bg-white/80 px-2.5 py-1 rounded-full border border-teal-200">
                  Zero manual entry
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div className="font-semibold text-slate-900">Why this beats dashboards:</div>
              <p className="text-[11px] leading-relaxed">
                Indian merchants don’t have time to review graphs. A single actionable WhatsApp message with an immediate approval button yields 89% higher execution rates.
              </p>
            </div>
          </div>

          {/* Right Column: Live Interactive WhatsApp Bubble */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#F0F2F5] border border-slate-200 shadow-md overflow-hidden text-left">
              {/* WhatsApp Mockup Header */}
              <div className="px-4 py-3 bg-[#EAEBED] border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-700 flex items-center justify-center text-xs font-bold text-white">
                    DP
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 leading-none mb-0.5">
                      DukaanPay AI
                    </div>
                    <div className="text-[10px] text-teal-700 font-mono font-medium leading-none">
                      Active Business Partner
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-500">Encrypted</span>
              </div>

              {/* Chat Thread */}
              <div className="p-5 space-y-4 bg-[#F8FAFC]/70 min-h-[300px] flex flex-col justify-center font-sans">
                {/* AI Prompt Bubble */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    className="max-w-[90%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-xs space-y-2.5"
                  >
                    <p className="text-xs font-medium text-slate-900 leading-relaxed">
                      {scenario.waMessage}
                    </p>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {scenario.waDetail}
                    </p>

                    {/* Interactive Action Button */}
                    <div className="pt-2">
                      <button
                        onClick={handleApprove}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-2 cursor-pointer ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-[#F59E0B] text-slate-950 hover:bg-[#D97706] hover:text-white shadow-sm active:scale-[0.99]'
                        }`}
                      >
                        {isApproved ? scenario.approvedText : scenario.buttonText}
                      </button>
                    </div>
                    <div className="text-right text-[9px] text-slate-400 font-mono">11:32 AM</div>
                  </motion.div>
                </AnimatePresence>

                {/* Merchant Reply Bubble when approved */}
                {isApproved && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[70%] bg-[#D9FDD3] border border-[#B8F0AF] rounded-2xl rounded-tr-sm p-3 text-xs text-slate-900 shadow-xs">
                      <p className="font-medium">{scenario.merchantReply}</p>
                      <div className="flex items-center justify-end gap-1 text-[9px] text-teal-700 font-mono mt-1">
                        <span>11:33 AM</span>
                        <span className="font-bold">✓✓</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
