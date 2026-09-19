'use client';

import React from 'react';
import { ShieldCheck, Zap, TrendingUp, Cpu, Volume2, ArrowRight } from 'lucide-react';

export const WhyPaytmWinsSection: React.FC = () => {
  const flywheel = [
    {
      step: '01',
      title: 'Payments Footprint',
      desc: '10M+ Soundboxes installed & 30M+ merchants accepting Paytm QR codes across India.',
      color: 'from-blue-600 to-cyan-500',
    },
    {
      step: '02',
      title: 'Autonomous Intelligence',
      desc: 'Live UPI streaming feeds Prophet & Groq agents with zero manual merchant data entry.',
      color: 'from-cyan-500 to-teal-400',
    },
    {
      step: '03',
      title: 'Decisive Micro-Actions',
      desc: '1-tap WhatsApp restock POs and Soundbox voice alerts prevent lost revenue before it happens.',
      color: 'from-teal-400 to-emerald-500',
    },
    {
      step: '04',
      title: 'Ecosystem Expansion',
      desc: 'Higher merchant GMV directly expands Paytm Soundbox retention & credit loan underwriting data.',
      color: 'from-emerald-500 to-indigo-500',
    },
  ];

  return (
    <section id="moat" className="py-20 lg:py-28 border-b border-slate-800/80 bg-grid-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Section 11 • The Strategic Moat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Why Paytm Wins: <span className="text-gradient-paytm">The Unfair Distribution Moat</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Standalone ERP software and accounting apps struggle with brutal churn because they require merchants to type. Paytm is already on the counter, hearing every transaction in real time.
          </p>
        </div>

        {/* 4-Stage Flywheel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {flywheel.map((item) => (
            <div key={item.step} className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} text-white font-black flex items-center justify-center text-sm mb-4 shadow-md`}>
                  {item.step}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1 text-[11px] text-cyan-400 font-bold">
                <span>Self-Reinforcing</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>

        {/* Strategic Comparison Matrix */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4 text-center sm:text-left">
            Paytm Merchant Growth Agent vs. Traditional SaaS Apps
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Capability / Dimension</th>
                  <th className="p-3.5 text-cyan-400">Paytm Merchant Growth Agent</th>
                  <th className="p-3.5 text-slate-400">Standalone SaaS (Khatabook/Vyapar)</th>
                  <th className="p-3.5 text-slate-400">Enterprise POS / ERP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr>
                  <td className="p-3.5 font-bold text-white">Hardware Requirement</td>
                  <td className="p-3.5 text-emerald-400 font-bold">Zero (Existing Soundbox & Phone)</td>
                  <td className="p-3.5 text-slate-400">Smartphone app only</td>
                  <td className="p-3.5 text-rose-400">Dedicated POS Terminal (₹25k+)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-white">Merchant Manual Data Entry</td>
                  <td className="p-3.5 text-emerald-400 font-bold">Zero (UPI stream + Photo OCR)</td>
                  <td className="p-3.5 text-rose-400">Manual typing of every credit entry</td>
                  <td className="p-3.5 text-rose-400">Barcoding & typing every SKU</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-white">Customer Reach Channel</td>
                  <td className="p-3.5 text-emerald-400 font-bold">Direct WhatsApp + Soundbox Voice</td>
                  <td className="p-3.5 text-slate-400">SMS payment reminders only</td>
                  <td className="p-3.5 text-slate-400">Paper receipt printout</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-bold text-white">Predictive AI Capabilities</td>
                  <td className="p-3.5 text-emerald-400 font-bold">8 Multi-Agents (Groq + Prophet)</td>
                  <td className="p-3.5 text-slate-400">Basic ledger reporting</td>
                  <td className="p-3.5 text-slate-400">Static rule-based reports</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
