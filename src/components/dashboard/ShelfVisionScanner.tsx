'use client';

import React, { useState } from 'react';
import { MOCK_SHELF_SCANS } from '@/data/mockData';
import { ShelfVisionDetection } from '@/types';

export function ShelfVisionScanner() {
  const [selectedAngle, setSelectedAngle] = useState<'top_rack' | 'eye_level' | 'bottom_rack'>('eye_level');
  const [isScanning, setIsScanning] = useState(false);
  const [showBoxes, setShowBoxes] = useState(true);

  const scan = MOCK_SHELF_SCANS.find((s) => s.angleId === selectedAngle) || MOCK_SHELF_SCANS[0];

  const handleRescan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 500);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00BAF2] animate-pulse" />
            <h3 className="text-lg font-bold text-[#002E6E]">Shelf Space Vision Intelligence</h3>
            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-sky-50 text-[#002E6E] border border-sky-200">
              YOLOv10 + Florence-2
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Zero manual counting. Merchant points phone camera at counter racks; computer vision detects empty slots and planogram leaks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBoxes(!showBoxes)}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
              showBoxes
                ? 'bg-[#EBF5FF] text-[#002E6E] border-sky-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showBoxes ? '👁️ Bounding Boxes ON' : '👁️ Raw Feed'}
          </button>
          <button
            onClick={handleRescan}
            disabled={isScanning}
            className="text-xs px-4 py-1.5 rounded-lg bg-[#00BAF2] hover:bg-[#0099D8] text-white font-medium shadow-xs transition-all flex items-center gap-1.5"
          >
            {isScanning ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Scanning...</span>
              </>
            ) : (
              <>
                <span>⚡ Re-Analyze Shelf</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Angle Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        {MOCK_SHELF_SCANS.map((s) => (
          <button
            key={s.angleId}
            onClick={() => setSelectedAngle(s.angleId)}
            className={`text-xs px-3.5 py-1.5 rounded-lg font-medium transition-all ${
              selectedAngle === s.angleId
                ? 'bg-[#002E6E] text-white shadow-xs'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {s.title} ({s.detections.length} SKUs)
          </button>
        ))}
      </div>

      {/* Visual Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulated Camera Viewfinder with Bounding Boxes */}
        <div className="lg:col-span-7 relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 min-h-[340px] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

          {/* Optical Scanner Grid overlay */}
          <div className="relative w-full h-[320px] bg-gradient-to-b from-slate-900 to-slate-950 rounded-lg border border-slate-800 p-4 flex flex-col justify-between overflow-hidden">
            {/* Viewfinder HUD */}
            <div className="flex justify-between items-center text-[10px] font-mono text-cyan-400 z-10">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                OPTICAL_INFERENCE_FPS: 24.2 • INFERENCE_LATENCY: 142ms
              </span>
              <span>ANGLE: {scan.title.toUpperCase()}</span>
            </div>

            {/* Bounding Box Simulation Nodes */}
            <div className="relative w-full h-[230px] my-auto">
              {scan.detections.map((item: ShelfVisionDetection, idx: number) => {
                const colors: Record<string, string> = {
                  normal: 'border-emerald-400 bg-emerald-500/10 text-emerald-300',
                  warning: 'border-amber-400 bg-amber-500/10 text-amber-300',
                  critical: 'border-rose-400 bg-rose-500/10 text-rose-300',
                };
                const tagColor = colors[item.urgency] || colors.normal;

                // Positioning simulation
                const leftPos = (idx * 28 + 4) % 85;
                const topPos = idx % 2 === 0 ? 15 : 45;

                return (
                  <div
                    key={item.id}
                    style={{
                      left: `${leftPos}%`,
                      top: `${topPos}%`,
                      width: '180px',
                    }}
                    className={`absolute p-2 rounded border transition-all duration-300 ${
                      showBoxes ? 'opacity-100' : 'opacity-0'
                    } ${tagColor}`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                      <span className="truncate">{item.productName.split(' ')[0]} {item.productName.split(' ')[1]}</span>
                      <span>{item.stockLevel}</span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[9px] font-mono">
                      <span>Stock: {item.detectedCount}/{item.capacity}</span>
                      <span className="uppercase font-semibold">{item.urgency}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Viewfinder Bottom Status */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-slate-800 pt-2 z-10">
              <span>{scan.timestamp}</span>
              <span className="text-cyan-400 font-semibold">UTILIZATION: {scan.utilizationRate}%</span>
            </div>
          </div>
        </div>

        {/* Audit Metrics & Live Findings */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Optical Detection Breakdown
            </h4>

            <div className="space-y-2">
              {scan.detections.map((item: ShelfVisionDetection) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-[#002E6E]">{item.productName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Detected: <span className="font-bold text-slate-700">{item.detectedCount}</span> (Max: {item.capacity}) • {item.stockLevel}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      item.urgency === 'normal'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : item.urgency === 'warning'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {item.urgency.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F0F7FE] border border-sky-200 text-xs text-[#002E6E] space-y-1.5">
            <div className="font-bold flex items-center gap-1.5">
              <span>💡 Autonomous Partner Recommendation</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {scan.emptySlotsCount} empty slots discovered on <span className="font-semibold">{scan.title}</span>. Trigger automated distributor reorder before 12:30 PM cutoff to prevent evening tea stockout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
