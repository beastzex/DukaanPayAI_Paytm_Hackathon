'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MLClient } from '@/lib/ml-client';
import { WhatsAppLiveFeed } from '@/components/whatsapp/WhatsAppLiveFeed';
import { ShelfVisionScanner } from '@/components/dashboard/ShelfVisionScanner';
import { BillOcrAuditor } from '@/components/dashboard/BillOcrAuditor';
import { WhatIfSimulator } from '@/components/dashboard/WhatIfSimulator';
import { VirtualCaAdvisor } from '@/components/dashboard/VirtualCaAdvisor';

export default function MerchantDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'demand' | 'inventory' | 'vision' | 'customers' | 'whatsapp' | 'simulator' | 'virtualca'>('overview');
  const [soundboxPlaying, setSoundboxPlaying] = useState(false);

  const store = MLClient.getStoreSummary();
  const prophetData = MLClient.getProphetForecast();
  const peak = MLClient.getDiurnalPeakRush();
  const xgboost = MLClient.getXGBoostPredictions();
  const rfm = MLClient.getRfmSegments();

  const playSoundboxPreview = () => {
    setSoundboxPlaying(true);
    // Audio tone simulation
    setTimeout(() => {
      setSoundboxPlaying(false);
    }, 2400);
  };

  return (
    <div className="min-h-screen bg-[#F4F8FD] text-[#0F1E36] font-sans antialiased">
      {/* 1. TOP ENTERPRISE PAYTM NAV BAR */}
      <header className="w-full bg-[#002E6E] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-headline text-xl font-extrabold tracking-tight text-white">
                Pay<span className="text-[#00BAF2]">tm</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#00BAF2]/20 text-[#00BAF2] border border-[#00BAF2]/30">
                Merchant Growth Partner AI
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/20 text-xs">
              <span className="font-semibold text-white">{store.storeName}</span>
              <span className="text-sky-300 font-mono text-[11px]">• {store.city}</span>
              <span className="text-emerald-400 font-mono text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded-full">ID: {store.merchantId}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Soundbox Live Indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-[#002352] px-3 py-1.5 rounded-xl border border-sky-400/20 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-medium text-sky-100">Soundbox 4.0:</span>
              <span className="font-mono text-emerald-300 text-[11px]">Active (4G)</span>
              <button
                onClick={playSoundboxPreview}
                disabled={soundboxPlaying}
                className="ml-1 px-2 py-0.5 bg-[#00BAF2] hover:bg-[#0099D8] text-white font-bold rounded text-[10px] transition-all"
              >
                {soundboxPlaying ? '🔊 Announcing...' : '🔊 Test Voice'}
              </button>
            </div>

            <Link
              href="/"
              className="text-xs font-medium px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20"
            >
              ← Back to Pitch
            </Link>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-[#002352] border-t border-sky-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto gap-1 text-xs font-medium py-1.5">
            {[
              { id: 'overview', label: '📊 Overview & Live Sales', badge: 'Live' },
              { id: 'demand', label: '📈 Prophet Demand Forecaster', badge: 'Diurnal AI' },
              { id: 'inventory', label: '📦 XGBoost Stockout Defense', badge: '15 SKUs' },
              { id: 'simulator', label: '🧮 What-If Inventory Simulator', badge: 'Interactive' },
              { id: 'virtualca', label: '💼 Virtual CA & Wealth Advisor', badge: 'Save ₹70k' },
              { id: 'vision', label: '👁️ Shelf & Invoice Vision Audits', badge: 'Qwen-VL' },
              { id: 'customers', label: '👥 RFM Khata & Churn Ledger', badge: '1,200 Shoppers' },
              { id: 'whatsapp', label: '💬 WhatsApp AI Teammate', badge: 'Interactive' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#00BAF2] text-white font-bold shadow-xs'
                    : 'text-sky-200 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono opacity-80 bg-black/20 px-1.5 py-0.2 rounded">
                  {tab.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#DCE8F6] shadow-sm space-y-2">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Today&apos;s Projected Sales (Prophet)</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-telemetry font-bold text-[#002E6E]">₹{store.todayProjectedSalesINR.toLocaleString('en-IN')}</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">+24% vs Avg</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Collected So Far:</span>
              <span className="font-semibold text-slate-800">₹{store.currentDaySalesSoFarINR.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCE8F6] shadow-sm space-y-2">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">UPI Transactions Count</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-telemetry font-bold text-slate-900">{store.todayTransactionsCount}</span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">11:28 AM Pace</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Average Basket Size:</span>
              <span className="font-semibold text-slate-800 font-telemetry">₹{store.avgBasketSizeINR}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCE8F6] shadow-sm space-y-2">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Preventable Margin Leak Recovered</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-telemetry font-bold text-emerald-600">
                ₹{(store.stockoutsAvertedThisWeekINR + store.dormantRecoveryThisMonthINR + store.wholesaleOverchargeRecoveredINR).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Zero-Loss</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Wholesale OCR Recovery:</span>
              <span className="font-semibold text-slate-800">+₹{store.wholesaleOverchargeRecoveredINR}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#DCE8F6] shadow-sm space-y-2">
            <div className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Store Health Index (Dual-Brain)</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-telemetry font-bold text-[#002E6E]">88<span className="text-sm font-normal text-slate-500">/100</span></span>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">Excellent</span>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between">
              <span>Audited Transactions:</span>
              <span className="font-semibold text-slate-800 font-mono">55,000 Records</span>
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC TAB VIEWS */}

        {/* TAB 1: OVERVIEW & LIVE SALES */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-[#DCE8F6] shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#002E6E]">Live Hourly Revenue Cadence (Diurnal Double-Peak)</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Prophet projection vs real-time UPI Soundbox settlements</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#002E6E]" /> Prophet Projection</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00BAF2]" /> Actual Settlements</span>
                </div>
              </div>

              {/* Hourly Chart Simulation */}
              <div className="space-y-2">
                <div className="h-56 w-full flex items-end gap-1.5 pt-6 pb-2 px-2 bg-gradient-to-b from-sky-50/40 to-white rounded-xl border border-sky-100 overflow-hidden">
                  {prophetData.curve.slice(7, 23).map((pt) => {
                    const heightPct = Math.min(100, Math.max(10, (pt.predicted_revenue / 3200) * 100));
                    const isNow = pt.hour === '11:00';
                    return (
                      <div key={pt.hour} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className={`w-full rounded-t transition-all ${
                            isNow ? 'bg-[#00BAF2] ring-2 ring-[#002E6E]' : 'bg-[#002E6E]/80 hover:bg-[#002E6E]'
                          }`}
                        />
                        <span className="text-[9px] font-mono text-slate-500 mt-1">{pt.hour.split(':')[0]}h</span>

                        {/* Tooltip */}
                        <div className="absolute -top-9 opacity-0 group-hover:opacity-100 bg-[#002E6E] text-white text-[9px] font-mono py-1 px-1.5 rounded shadow whitespace-nowrap z-10 transition-opacity">
                          ₹{pt.predicted_revenue}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 px-2 pt-1 font-mono">
                  <span>🌅 Morning Rush: 8-10 AM</span>
                  <span className="text-[#00BAF2] font-bold">⚡ CURRENT TIME: 11:28 AM</span>
                  <span>🌆 Evening Rush: 6-9 PM</span>
                </div>
              </div>

              {/* Real-time UPI Telemetry Stream */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">Real-time Soundbox Ingress Stream</h4>
                  <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">100% UPI Settlement Success</span>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'TX_99812', amount: 140, item: 'Tata Tea Premium 250g', time: '11:28:04 AM', mode: 'Paytm QR' },
                    { id: 'TX_99811', amount: 54, item: 'Amul Taaza Milk (2x 500ml)', time: '11:24:12 AM', mode: 'Paytm Soundbox' },
                    { id: 'TX_99810', amount: 260, item: 'Aashirvaad Atta (5kg)', time: '11:19:30 AM', mode: 'UPI Intent' },
                  ].map((tx) => (
                    <div key={tx.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <div>
                          <div className="font-semibold text-slate-900">{tx.item}</div>
                          <div className="text-[11px] font-mono text-slate-500">{tx.id} • {tx.mode}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-telemetry font-bold text-slate-900 text-sm">₹{tx.amount}</div>
                        <div className="text-[10px] font-mono text-slate-400">{tx.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Live WhatsApp AI Teammate Frame */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-[#DCE8F6] shadow-sm">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#002E6E] mb-3">
                  Live WhatsApp Partner Simulator
                </h3>
                <WhatsAppLiveFeed />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROPHET DEMAND FORECASTER */}
        {activeTab === 'demand' && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE8F6] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#002E6E]">Facebook Prophet 1.4.0 Demand Forecasting Engine</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Trained on 55,000 real kirana records over 12 months. Maps seasonal calendar events, weather spikes, and diurnal shopping rhythms.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="p-2 rounded-lg bg-sky-50 text-[#002E6E] border border-sky-200">MAE: ₹{prophetData.metrics.mae}</span>
                <span className="p-2 rounded-lg bg-sky-50 text-[#002E6E] border border-sky-200">Variance Explained: {prophetData.metrics.r2_variance}</span>
              </div>
            </div>

            {/* Peak Rush Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F0F7FE] border border-sky-200 space-y-1">
                <div className="text-[11px] font-mono font-bold text-[#002E6E] uppercase">Morning Breakfast Surge</div>
                <div className="text-base font-bold text-slate-900">{peak.morningRush}</div>
                <div className="text-xs text-slate-600">Surge driver: Milk packets, bread, butter, curd before 9 AM office commute.</div>
              </div>
              <div className="p-4 rounded-xl bg-[#F0F7FE] border border-sky-200 space-y-1">
                <div className="text-[11px] font-mono font-bold text-[#002E6E] uppercase">Evening Peak Rush Surge</div>
                <div className="text-base font-bold text-slate-900">{peak.eveningRush}</div>
                <div className="text-xs text-slate-600">Surge driver: Tea time biscuits, namkeen, cold drinks, dinner pulses and cooking oil.</div>
              </div>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                <div className="text-[11px] font-mono font-bold text-amber-800 uppercase">Upcoming Festival Spike</div>
                <div className="text-base font-bold text-slate-900">Navratri + Diwali Confluence</div>
                <div className="text-xs text-amber-900">Prophet multiplier: +3.4x demand for Sabudana, Ghee, dry fruits and Tata Salt.</div>
              </div>
            </div>

            {/* Prophet Forecast Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-500">24-Hour Projected Hourly Intervals</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">Time Interval</th>
                      <th className="p-3 text-right">Projected GMV (INR)</th>
                      <th className="p-3 text-right">Lower Bound (95% CI)</th>
                      <th className="p-3 text-right">Upper Bound (95% CI)</th>
                      <th className="p-3 text-center">Rush Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prophetData.curve.slice(6, 23).map((row) => (
                      <tr key={row.hour} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-semibold text-slate-900">{row.hour}</td>
                        <td className="p-3 text-right font-telemetry font-bold text-[#002E6E]">₹{row.predicted_revenue}</td>
                        <td className="p-3 text-right font-telemetry text-slate-500">₹{row.lower_bound}</td>
                        <td className="p-3 text-right font-telemetry text-slate-500">₹{row.upper_bound}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              row.predicted_revenue > 2000
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : row.predicted_revenue > 1000
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-slate-50 text-slate-600 border border-slate-200'
                            }`}
                          >
                            {row.predicted_revenue > 2000 ? 'PEAK RUSH' : row.predicted_revenue > 1000 ? 'MODERATE' : 'NORMAL'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: XGBOOST INVENTORY DEFENSE */}
        {activeTab === 'inventory' && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE8F6] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#002E6E]">XGBoost 3.2.0 Stockout Prediction Engine</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Predicts 24-hour stock depletion probability per SKU using transaction velocity, distributor lead time, and shelf stock.
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">Accuracy: {xgboost.metrics.accuracy}%</span>
                <span className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">ROC AUC: {xgboost.metrics.roc_auc}</span>
              </div>
            </div>

            {/* Feature Importances Bar */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-mono font-bold text-slate-700 uppercase">Top Predictive Mathematical Features</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {xgboost.feature_importances.map((f) => (
                  <div key={f.feature} className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <div className="font-mono text-slate-500 text-[10px]">{f.feature}</div>
                    <div className="font-telemetry font-bold text-[#002E6E] text-sm mt-0.5">{f.importance_pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* SKU Stockout Risk Matrix */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase text-slate-500">Live 15-SKU Depletion Matrix</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">SKU Code</th>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Current Shelf Stock</th>
                      <th className="p-3 text-center">Supplier Lead Time</th>
                      <th className="p-3 text-center">Stockout Risk</th>
                      <th className="p-3 text-center">Autonomous Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {xgboost.top_stockout_risks.map((item) => (
                      <tr key={item.sku} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono text-slate-500 text-[11px]">{item.sku}</td>
                        <td className="p-3 font-semibold text-slate-900">{item.sku_name}</td>
                        <td className="p-3 text-slate-600">{item.category}</td>
                        <td className="p-3 text-center font-mono font-bold">
                          <span className={item.current_shelf_stock < 5 ? 'text-rose-600' : 'text-slate-900'}>
                            {item.current_shelf_stock} units
                          </span>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-500">{item.lead_time_h} hours</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              item.stockout_risk_score > 80
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : item.stockout_risk_score > 50
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {item.stockout_risk_score}% RISK
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          {item.predicted_stockout_within_24h ? (
                            <button
                              onClick={() => {
                                alert(`Dispatched restock request for ${item.sku_name} to distributor via backend on port 4000!`);
                              }}
                              className="px-3 py-1 bg-[#00BAF2] hover:bg-[#0099D8] text-white rounded-lg font-bold text-[11px] shadow-2xs transition-all"
                            >
                              ⚡ Reorder
                            </button>
                          ) : (
                            <span className="text-[11px] font-mono text-slate-400">Optimal Buffer</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VISION & OCR AUDITS */}
        {activeTab === 'vision' && (
          <div className="space-y-6">
            <ShelfVisionScanner />
            <BillOcrAuditor />
          </div>
        )}

        {/* TAB 5: RFM CUSTOMER CHURN & UDHAAR LEDGER */}
        {activeTab === 'customers' && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE8F6] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#002E6E]">Customer Retention &amp; Khata (Udhaar) Intelligence</h3>
                <p className="text-xs text-slate-500 mt-1">
                  K-Means RFM clustering over 1,200 neighborhood customers. Proactively re-engages dormant society families and protects store credit.
                </p>
              </div>
              <span className="p-2 rounded-lg bg-sky-50 text-[#002E6E] font-mono text-xs border border-sky-200">
                Silhouette Score: {rfm.metrics.silhouette_score}
              </span>
            </div>

            {/* Cluster Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {rfm.clusters.map((c) => (
                <div key={c.cluster_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-slate-500 uppercase font-semibold">Cluster {c.cluster_id}</span>
                    <span className="font-bold text-[#002E6E]">{c.count} Customers ({c.pct_of_customers}%)</span>
                  </div>
                  <div className="text-xs font-bold text-[#002E6E]">{c.label}</div>
                  <div className="text-[11px] text-slate-600 space-y-1 font-mono pt-1">
                    <div>Avg Recency: <span className="font-bold">{c.avg_recency_days} days</span></div>
                    <div>Avg Spend: <span className="font-bold">₹{Math.round(c.avg_monetary_spend)}</span></div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 leading-tight">
                    <span className="font-semibold text-[#002E6E]">Strategy: </span>
                    {c.retention_strategy}
                  </div>
                </div>
              ))}
            </div>

            {/* Pending Udhaar (Khata) Defense Table */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-500">Khata (Udhaar) Overdue Recovery Ledger</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Total Pending Store Credit: ₹14,200 across 18 accounts</p>
                </div>
                <button
                  onClick={() => alert('Dispatched polite WhatsApp reminders with 1-tap Paytm UPI payment links!')}
                  className="px-4 py-1.5 rounded-lg bg-[#00BAF2] hover:bg-[#0099D8] text-white font-bold text-xs shadow-xs transition-all"
                >
                  📢 1-Click WhatsApp Friendly Reminders
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                    <tr>
                      <th className="p-3">Customer Identifier</th>
                      <th className="p-3 text-right">Pending Udhaar</th>
                      <th className="p-3 text-center">Days Overdue</th>
                      <th className="p-3 text-center">Risk Level</th>
                      <th className="p-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: 'user_0042@paytm (Sharma Ji, Flat 302)', amount: 1450, days: 28, risk: 'HIGH' },
                      { id: 'user_0189@paytm (Verma Ji, Flat 104)', amount: 890, days: 22, risk: 'MEDIUM' },
                      { id: 'user_0214@paytm (Gupta Ji, Flat 501)', amount: 620, days: 16, risk: 'LOW' },
                    ].map((k) => (
                      <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-medium text-slate-900">{k.id}</td>
                        <td className="p-3 text-right font-telemetry font-bold text-rose-600">₹{k.amount}</td>
                        <td className="p-3 text-center font-mono text-slate-600">{k.days} days</td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                              k.risk === 'HIGH'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : k.risk === 'MEDIUM'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {k.risk}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => alert(`Sent polite WhatsApp UPI payment reminder to ${k.id}!`)}
                            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[#002E6E] font-medium text-[11px] transition-all"
                          >
                            Send Payment Link
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: WHAT-IF INVENTORY SIMULATOR */}
        {activeTab === 'simulator' && (
          <div className="space-y-4">
            <WhatIfSimulator />
          </div>
        )}

        {/* TAB 8: VIRTUAL CA & WEALTH ADVISOR */}
        {activeTab === 'virtualca' && (
          <div className="space-y-4">
            <VirtualCaAdvisor />
          </div>
        )}

        {/* TAB 6: WHATSAPP AI TEAMMATE */}
        {activeTab === 'whatsapp' && (
          <div className="bg-white p-6 rounded-2xl border border-[#DCE8F6] shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-[#002E6E]">Autonomous WhatsApp Teammate Interface</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Indian Kirana merchants don&apos;t learn ERPs. They communicate naturally through WhatsApp with 1-tap interactive approval buttons.
              </p>
            </div>
            <div className="py-4">
              <WhatsAppLiveFeed />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
