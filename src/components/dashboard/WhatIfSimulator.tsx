'use client';

import React, { useState } from 'react';
import { Sparkles, Calculator, AlertTriangle, CheckCircle2, TrendingUp, Clock, PackageCheck, Send } from 'lucide-react';
import { MLClient } from '@/lib/ml-client';

export function WhatIfSimulator() {
  const [selectedSku, setSelectedSku] = useState('maggi');
  const [quantity, setQuantity] = useState(50);
  const [orderDispatched, setOrderDispatched] = useState(false);

  const simulation = MLClient.simulateWhatIfOrder(selectedSku, quantity);

  const presets = [
    { key: 'maggi', label: '🍜 Maggi Noodles 70g', defaultQty: 50 },
    { key: 'milk', label: '🥛 Amul Taaza Milk 500ml', defaultQty: 45 },
    { key: 'oil', label: '🌻 Fortune Mustard Oil 1L', defaultQty: 25 },
    { key: 'thumsup', label: '🥤 Thums Up 750ml (IPL Match)', defaultQty: 40 },
    { key: 'biscuit', label: '🍪 Good Day Cookies', defaultQty: 30 },
    { key: 'atta', label: '🌾 Aashirvaad Atta 5kg', defaultQty: 15 },
  ];

  const handleSelectPreset = (key: string, qty: number) => {
    setSelectedSku(key);
    setQuantity(qty);
    setOrderDispatched(false);
  };

  const handleDispatchOrder = async () => {
    setOrderDispatched(true);
    await fetch('http://localhost:4000/api/v1/ai-integration/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NTgzMDczYS01Zjc2LTRhYmUtOTkwZC1iNjMxY2NmMjVkYjAiLCJyb2xlcyI6WyJNRVJDSEFOVCJdLCJwZXJtaXNzaW9ucyI6WyJSRUFEX1BST0ZJTEUiLCJNQU5BR0VfSU5WRU5UT1JZIiwiRElTUEFUQ0hfQ0FNUEFJR05TIl0sImlhdCI6MTc4OTc5NTYyMiwiZXhwIjoxNzg5Nzk2NTIyfQ.OQo-CUAj2t_s-43XnrLMf-CLVmybyWV_5C4I4lPLXco',
      },
      body: JSON.stringify({
        merchantId: 'm_101',
        actionType: 'STOCK_RESTOCK',
        priority: 'HIGH',
        title: `What-If Reorder: ${simulation.quantity} units of ${simulation.item}`,
        rationaleIndic: `Simulated via What-If engine: Sells out in ${simulation.daysToSellOut} days with ₹${simulation.grossProfit} profit`,
        projectedRevenueINR: simulation.projectedRevenue,
        payload: simulation,
        requiresMerchantApproval: false,
      }),
    }).catch(() => null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-50 text-[#00BAF2]">
              <Calculator className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-[#002E6E]">What-If Inventory Depletion Simulator</h3>
            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              AI Run-Rate Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate future procurement scenarios before ordering: &quot;If I order X units, kitne din mein bikege, kitni poonji lagegi aur munafa kya hoga?&quot;
          </p>
        </div>
      </div>

      {/* Preset SKU Chips */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 block">Select Kirana SKU to Simulate:</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.key}
              onClick={() => handleSelectPreset(p.key, p.defaultQty)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                selectedSku === p.key
                  ? 'bg-[#002E6E] text-white shadow-xs font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Slider & Quantity Control */}
      <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#002E6E]">Simulate Order Batch Quantity:</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={5}
              max={300}
              value={quantity}
              onChange={(e) => {
                setQuantity(Math.max(1, parseInt(e.target.value) || 1));
                setOrderDispatched(false);
              }}
              className="w-20 px-2.5 py-1 text-center font-bold font-mono text-sm bg-white border border-slate-300 rounded-lg text-[#002E6E]"
            />
            <span className="text-xs text-slate-500 font-medium">units</span>
          </div>
        </div>

        <input
          type="range"
          min={5}
          max={200}
          step={5}
          value={quantity}
          onChange={(e) => {
            setQuantity(parseInt(e.target.value));
            setOrderDispatched(false);
          }}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00BAF2]"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-400">
          <span>Min: 5 units</span>
          <span>50 units</span>
          <span>100 units</span>
          <span>Max: 200 units</span>
        </div>
      </div>

      {/* Dynamic Simulation Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-[#00BAF2]" /> Days to Sell Out
          </div>
          <div className="text-2xl font-bold font-mono text-[#002E6E] mt-1">
            {simulation.daysToSellOut} <span className="text-xs font-normal text-slate-500">days</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Velocity: {simulation.dailyVelocity} units / day
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-600" /> Projected Margin
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 mt-1">
            ₹{simulation.grossProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] font-mono text-emerald-700 mt-0.5 font-bold">
            {simulation.marginPercent}% Gross Profit
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Capital Required</div>
          <div className="text-2xl font-bold font-mono text-slate-800 mt-1">
            ₹{simulation.capitalRequired.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Wholesale buy price
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Gross Revenue</div>
          <div className="text-2xl font-bold font-mono text-sky-700 mt-1">
            ₹{simulation.projectedRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            At MRP retail
          </div>
        </div>
      </div>

      {/* AI Risk & Velocity Advisory Card */}
      <div
        className={`p-4 rounded-xl border flex items-start gap-3 ${
          simulation.riskLevel === 'HIGH'
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : simulation.riskLevel === 'MEDIUM'
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}
      >
        <div className="shrink-0 mt-0.5">
          {simulation.riskLevel === 'HIGH' ? (
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          ) : simulation.riskLevel === 'MEDIUM' ? (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs font-mono">
            <span>RISK LEVEL: {simulation.riskLevel}</span>
            <span>•</span>
            <span>AI Depletion Assessment</span>
          </div>
          <p className="text-xs leading-relaxed font-sans">{simulation.recommendation}</p>
        </div>
      </div>

      {/* Dispatch Action */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
        <div className="text-xs text-slate-500 font-sans">
          💡 You can also ask directly on WhatsApp: &quot;agar Maggi ke {quantity} packet mangwaun toh kitne din me bikege&quot;
        </div>
        <button
          onClick={handleDispatchOrder}
          disabled={orderDispatched}
          className={`py-2 px-5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
            orderDispatched
              ? 'bg-emerald-600 text-white'
              : 'bg-[#00BAF2] hover:bg-[#0099D8] text-white shadow-xs'
          }`}
        >
          {orderDispatched ? (
            <>
              <PackageCheck className="w-4 h-4" />
              <span>✓ Order Queued into Backend BullMQ</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>⚡ Dispatch Simulated Reorder ({simulation.quantity} units)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
