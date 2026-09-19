'use client';

import React, { useState } from 'react';
import { useSimulationStore } from '@/store/simulation-store';
import { Camera, FileText, Scan, CheckCircle2, AlertCircle, RefreshCw, Layers, ArrowRight } from 'lucide-react';
import { formatINR } from '@/utils/cn';

export const InventoryIntelligenceSection: React.FC = () => {
  const {
    invoices,
    activeInvoiceId,
    setActiveInvoiceId,
    isScanningInvoice,
    triggerInvoiceScan,
    shelfScans,
    activeShelfAngle,
    setActiveShelfAngle,
    isAnalyzingShelves,
    triggerShelfAnalysis,
  } = useSimulationStore();

  const [activeTab, setActiveTab] = useState<'bill_ocr' | 'shelf_vision'>('bill_ocr');

  const currentInvoice = invoices.find((inv) => inv.id === activeInvoiceId) || invoices[0];
  const currentShelf = shelfScans.find((s) => s.angleId === activeShelfAngle) || shelfScans[0];

  return (
    <section id="inventory" className="py-20 lg:py-28 border-b border-slate-800/80 bg-grid-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Camera className="w-3.5 h-3.5" />
            <span>Section 7 • Zero Manual Inventory Entry</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            No POS Machine. <span className="text-gradient-paytm">No Barcode Scanners.</span> No ERP.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The merchant never types inventory into a computer. We combine multimodal Supplier Bill OCR with 3-angle Shelf Vision AI to keep inventory accurate automatically.
          </p>
        </div>

        {/* Tab Switcher: Method 1 vs Method 2 */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-xl">
            <button
              onClick={() => setActiveTab('bill_ocr')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'bill_ocr'
                  ? 'bg-gradient-to-r from-[#005CE6] to-[#00BAF2] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Method 1: Supplier Bill OCR</span>
            </button>
            <button
              onClick={() => setActiveTab('shelf_vision')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'shelf_vision'
                  ? 'bg-gradient-to-r from-[#005CE6] to-[#00BAF2] text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scan className="w-4 h-4" />
              <span>Method 2: Shelf Vision AI</span>
            </button>
          </div>
        </div>

        {/* METHOD 1: SUPPLIER BILL OCR */}
        {activeTab === 'bill_ocr' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-cyan-500/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-cyan-400">GPT-4o Vision & PaddleOCR Architecture</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">1-Photo WhatsApp Upload</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Distributor Bill Line-Item Extraction
                </h3>
              </div>

              {/* Sample Invoice Switcher */}
              <div className="flex items-center gap-2">
                {invoices.map((inv) => (
                  <button
                    key={inv.id}
                    onClick={() => triggerInvoiceScan(inv.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      activeInvoiceId === inv.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {inv.distributorName.split('/')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Ingestion Results Table */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Invoice Metadata (4 cols) */}
              <div className="lg:col-span-4 space-y-4">
                <div className="glass-panel-subtle p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
                    <span className="text-slate-400">Invoice Status</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {currentInvoice.status}
                    </span>
                  </div>
                  <div className="text-xs space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Distributor:</span>
                      <span className="font-semibold text-white">{currentInvoice.distributorName}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Invoice #:</span>
                      <span className="font-mono text-cyan-300">{currentInvoice.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Date:</span>
                      <span className="text-slate-200">{currentInvoice.date}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>GSTIN:</span>
                      <span className="font-mono text-slate-200">{currentInvoice.gstin}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Payment Terms:</span>
                      <span className="text-amber-300 font-medium">{currentInvoice.paymentTerms}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                      <span className="font-bold text-white">Invoice Total:</span>
                      <span className="font-black text-emerald-400 text-sm">{formatINR(currentInvoice.totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => triggerInvoiceScan(activeInvoiceId)}
                  disabled={isScanningInvoice}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScanningInvoice ? 'animate-spin' : ''}`} />
                  <span>{isScanningInvoice ? 'Parsing Bounding Boxes...' : 'Simulate Re-Upload Scan'}</span>
                </button>
              </div>

              {/* Extracted SKUs Table (8 cols) */}
              <div className="lg:col-span-8 overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/70">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Product Name</th>
                      <th className="p-3.5 text-center">Qty</th>
                      <th className="p-3.5 text-right">Purchase Rate</th>
                      <th className="p-3.5 text-right">MRP</th>
                      <th className="p-3.5 text-right">Margin %</th>
                      <th className="p-3.5 text-center">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {currentInvoice.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-900/40 transition-colors">
                        <td className="p-3.5 font-medium text-white">
                          <div>{item.name}</div>
                          <span className="text-[10px] text-slate-500 font-mono">{item.sku}</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-cyan-300">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-200">
                          {formatINR(item.purchaseCost)}
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-400">
                          {formatINR(item.mrp)}
                        </td>
                        <td className="p-3.5 text-right font-bold text-emerald-400">
                          {item.marginPercent}%
                        </td>
                        <td className="p-3.5 text-center">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {item.confidence}%
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

        {/* METHOD 2: SHELF VISION AI */}
        {activeTab === 'shelf_vision' && (
          <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-cyan-500/30">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-cyan-400">YOLOv10 + Grounding DINO + Florence-2</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs text-slate-400">3 Daily Photos</span>
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Autonomous Shelf Space & Stock Level Estimation
                </h3>
              </div>

              {/* Angle Switcher */}
              <div className="flex items-center gap-2">
                {shelfScans.map((scan) => (
                  <button
                    key={scan.angleId}
                    onClick={() => setActiveShelfAngle(scan.angleId)}
                    className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      activeShelfAngle === scan.angleId
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {scan.angleId === 'top_rack' ? 'Top Rack' : scan.angleId === 'eye_level' ? 'Eye-Level Rack' : 'Bottom Rack'}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Shelf Camera Feed with Bounding Boxes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Visualized Rack View (7 cols) */}
              <div className="lg:col-span-7">
                <div className="relative aspect-video rounded-2xl bg-slate-950 border-2 border-slate-800 overflow-hidden p-6 flex flex-col justify-between shadow-2xl">
                  {/* Camera Header Overlay */}
                  <div className="flex items-center justify-between text-xs z-10">
                    <div className="flex items-center gap-2 bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-mono text-[11px] text-slate-300">CAM-02 (Eye-Level 1080p)</span>
                    </div>
                    <span className="bg-slate-900/90 px-3 py-1 rounded-full border border-slate-700 font-mono text-[11px] text-slate-400">
                      YOLOv10 Active
                    </span>
                  </div>

                  {/* Visual Bounding Boxes Representation */}
                  <div className="grid grid-cols-3 gap-3 my-4 z-10">
                    {currentShelf.detections.map((det) => {
                      const isLow = det.stockLevel.includes('Low');
                      const isEmpty = det.stockLevel.includes('Empty');

                      return (
                        <div
                          key={det.id}
                          className={`p-3 rounded-xl border-2 transition-all backdrop-blur-md flex flex-col justify-between ${
                            isEmpty
                              ? 'border-rose-500 bg-rose-500/15 shadow-lg shadow-rose-500/20'
                              : isLow
                              ? 'border-amber-500 bg-amber-500/15 shadow-lg shadow-amber-500/20'
                              : 'border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-500/20'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider mb-1">
                              <span className={isEmpty ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-emerald-400'}>
                                {isEmpty ? 'Empty Slot' : isLow ? 'Low Stock' : 'Stocked'}
                              </span>
                              <span className="text-white font-mono">{det.detectedCount}/{det.capacity}</span>
                            </div>
                            <h5 className="text-xs font-bold text-white line-clamp-2 leading-tight mb-1">
                              {det.productName}
                            </h5>
                          </div>

                          {det.reorderSuggestion && (
                            <span className="text-[9px] font-bold text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded text-center mt-2">
                              Restock +{det.reorderSuggestion}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Camera Footer Overlay */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
                    <span>Utilization Rate: <strong className="text-white">{currentShelf.utilizationRate}%</strong></span>
                    <span>Empty Slots Detected: <strong className="text-rose-400">{currentShelf.emptySlotsCount}</strong></span>
                  </div>

                  {/* Ambient Background Grid */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
                </div>
              </div>

              {/* Shelf Analytics Detail (5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="glass-panel-subtle p-5 rounded-xl border border-slate-800">
                  <h4 className="text-sm font-bold text-white mb-1">{currentShelf.title}</h4>
                  <p className="text-xs text-slate-400 mb-4">{currentShelf.subtitle}</p>

                  <div className="space-y-3 text-xs">
                    {currentShelf.detections.map((det) => (
                      <div key={det.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div>
                          <div className="font-semibold text-white">{det.productName}</div>
                          <span className="text-[10px] text-slate-400">{det.category}</span>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            det.urgency === 'critical' ? 'text-rose-400' : det.urgency === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                          }`}>
                            {det.detectedCount} left
                          </div>
                          <span className="text-[10px] text-slate-500">Cap: {det.capacity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={triggerShelfAnalysis}
                  disabled={isAnalyzingShelves}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#005CE6] to-[#00BAF2] hover:from-[#004dc2] hover:to-[#00a8dc] text-white text-xs font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Camera className={`w-4 h-4 ${isAnalyzingShelves ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzingShelves ? 'Analyzing 3 Angle Cameras...' : 'Trigger Instant Vision Re-Scan'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
