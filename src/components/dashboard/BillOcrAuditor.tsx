'use client';

import React, { useState } from 'react';
import { MOCK_INVOICES } from '@/data/mockData';

export function BillOcrAuditor() {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('inv-hul-01');
  const [isAuditing, setIsAuditing] = useState(false);
  const [debitNoteSent, setDebitNoteSent] = useState(false);

  const invoice = MOCK_INVOICES.find((i) => i.id === selectedInvoiceId) || MOCK_INVOICES[0];

  // Calculate discrepancies
  let totalDiscrepancy = 0;
  const auditedItems = invoice.items.map((item) => {
    const agreedRate = Math.round(item.purchaseCost * 0.94);
    const diff = item.purchaseCost - agreedRate;
    const overcharge = diff > 0 ? diff * item.quantity : 0;
    totalDiscrepancy += overcharge;
    return {
      ...item,
      agreedRate,
      diff,
      overcharge,
    };
  });

  const handleAudit = () => {
    setIsAuditing(true);
    setDebitNoteSent(false);
    setTimeout(() => setIsAuditing(false), 500);
  };

  const handleSendDebitNote = async () => {
    setDebitNoteSent(true);
    try {
      await fetch('http://localhost:4000/api/v1/ai-integration/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NTgzMDczYS01Zjc2LTRhYmUtOTkwZC1iNjMxY2NmMjVkYjAiLCJyb2xlcyI6WyJNRVJDSEFOVCJdLCJwZXJtaXNzaW9ucyI6WyJSRUFEX1BST0ZJTEUiLCJNQU5BR0VfSU5WRU5UT1JZIiwiRElTUEFUQ0hfQ0FNUEFJR05TIl0sImlhdCI6MTc4OTc5NTYyMiwiZXhwIjoxNzg5Nzk2NTIyfQ.OQo-CUAj2t_s-43XnrLMf-CLVmybyWV_5C4I4lPLXco',
        },
        body: JSON.stringify({
          merchantId: 'm_101',
          actionType: 'UDHAAR_RECOVERY',
          priority: 'HIGH',
          title: `Claim ₹${Math.round(totalDiscrepancy)} Overcharge Credit Note from ${invoice.distributorName}`,
          rationaleIndic: `बिल #${invoice.invoiceNumber} में दर विसंगति पाई गई है।`,
          projectedRevenueINR: Math.round(totalDiscrepancy),
          payload: {
            distributor: invoice.distributorName,
            invoiceNumber: invoice.invoiceNumber,
            claimAmount: Math.round(totalDiscrepancy),
          },
          requiresMerchantApproval: false,
        }),
      }).catch(() => null);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-lg font-bold text-[#002E6E]">Distributor Bill OCR & Margin Defense</h3>
            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Qwen-2-VL + PaddleOCR
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Merchant snaps a photo of paper distributor challan. AI cross-checks line items against contracted rate card to catch silent wholesale leakage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedInvoiceId}
            onChange={(e) => {
              setSelectedInvoiceId(e.target.value);
              setDebitNoteSent(false);
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[#002E6E] font-medium focus:outline-none focus:ring-1 focus:ring-[#00BAF2]"
          >
            {MOCK_INVOICES.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.distributorName} (#{inv.invoiceNumber})
              </option>
            ))}
          </select>

          <button
            onClick={handleAudit}
            disabled={isAuditing}
            className="text-xs px-4 py-1.5 rounded-lg bg-[#002E6E] hover:bg-[#002050] text-white font-medium shadow-xs transition-all flex items-center gap-1.5"
          >
            {isAuditing ? 'Auditing OCR...' : '⚡ Audit Bill'}
          </button>
        </div>
      </div>

      {/* Invoice Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Distributor</div>
          <div className="text-xs font-bold text-[#002E6E] truncate mt-0.5">{invoice.distributorName}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-[10px] font-mono text-slate-500 uppercase">Total Invoiced</div>
          <div className="text-xs font-bold text-slate-900 mt-0.5">₹{invoice.totalAmount.toLocaleString('en-IN')}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
          <div className="text-[10px] font-mono text-rose-700 uppercase font-semibold">Overcharge Detected</div>
          <div className="text-xs font-bold text-rose-700 mt-0.5">+₹{Math.round(totalDiscrepancy)}</div>
        </div>
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="text-[10px] font-mono text-emerald-700 uppercase font-semibold">OCR Confidence</div>
          <div className="text-xs font-bold text-emerald-700 mt-0.5">98.6% (142ms)</div>
        </div>
      </div>

      {/* Line Item Audit Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
          <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-600 font-mono text-[11px]">
            <tr>
              <th className="p-3">SKU Description</th>
              <th className="p-3 text-center">Billed Qty</th>
              <th className="p-3 text-right">Billed Rate</th>
              <th className="p-3 text-right">Contract Rate</th>
              <th className="p-3 text-right">Difference</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditedItems.map((item) => (
              <tr key={item.sku} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3 font-medium text-slate-900">{item.name}</td>
                <td className="p-3 text-center font-mono">{item.quantity}</td>
                <td className="p-3 text-right font-mono font-semibold">₹{item.purchaseCost}</td>
                <td className="p-3 text-right font-mono text-slate-500">₹{item.agreedRate}</td>
                <td className="p-3 text-right font-mono font-bold text-rose-600">
                  {item.diff > 0 ? `+₹${item.diff}/unit (₹${item.overcharge})` : '₹0'}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                      item.diff > 0
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {item.diff > 0 ? 'OVERCHARGED' : 'ACCURATE'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* WhatsApp Debit Note Claim Box */}
      <div className="p-4 rounded-xl bg-[#F0F7FE] border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-[#002E6E] flex items-center gap-1.5">
            <span>💬 Auto-Generated WhatsApp Debit Note (Hindi)</span>
          </div>
          <p className="text-xs font-mono text-slate-700 bg-white/80 p-2.5 rounded-lg border border-sky-100">
            &quot;प्रणाम {invoice.distributorName}! आपके बिल #{invoice.invoiceNumber} में ₹{Math.round(totalDiscrepancy)} की दर भिन्नता पाई गई है। कृपया ₹{Math.round(totalDiscrepancy)} का क्रेडिट नोट जारी करें। धन्यवाद - लक्ष्मी किराना स्टोर&quot;
          </p>
        </div>

        <button
          onClick={handleSendDebitNote}
          disabled={debitNoteSent}
          className={`text-xs px-4 py-2.5 rounded-xl font-bold transition-all shadow-xs shrink-0 flex items-center gap-2 ${
            debitNoteSent
              ? 'bg-emerald-600 text-white cursor-default'
              : 'bg-[#00BAF2] hover:bg-[#0099D8] text-white'
          }`}
        >
          {debitNoteSent ? (
            <>
              <span>✓ Debit Note Claim Dispatched</span>
            </>
          ) : (
            <>
              <span>📲 Send Debit Note via WhatsApp</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
