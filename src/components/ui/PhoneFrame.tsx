'use client';

import React, { useState, useEffect } from 'react';

export const PhoneFrame: React.FC = () => {
  const [step, setStep] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasApproved, setHasApproved] = useState<boolean>(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setStep(3);
      setHasApproved(true);
      return;
    }

    // Sequenced message timings
    const t1 = setTimeout(() => setIsTyping(true), 500);
    const t2 = setTimeout(() => {
      setIsTyping(false);
      setStep(1);
    }, 1600);

    const t3 = setTimeout(() => setIsTyping(true), 2600);
    const t4 = setTimeout(() => {
      setIsTyping(false);
      setStep(2);
    }, 3900);

    const t5 = setTimeout(() => {
      setHasApproved(true);
      setStep(3);
    }, 5800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] mx-auto select-none">
      {/* Sleek phone chassis */}
      <div className="relative rounded-[40px] bg-slate-900 p-3 border border-slate-300 shadow-2xl">
        {/* Top Speaker / Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full z-20" />

        {/* Screen glass - Light theme WhatsApp */}
        <div className="relative rounded-[32px] bg-[#F8FAFC] overflow-hidden border border-slate-200 h-[520px] flex flex-col justify-between">
          {/* WhatsApp Light Header */}
          <div className="pt-7 pb-3 px-4 bg-[#F0F2F5] border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-teal-700 border border-teal-800 flex items-center justify-center text-xs font-semibold text-white">
                DP
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900 leading-none mb-1">
                  DukaanPay AI
                </h4>
                <p className="text-[10px] text-teal-700 leading-none font-mono font-medium">
                  online
                </p>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">WhatsApp</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 space-y-3 overflow-y-auto font-sans bg-[#F1F5F9]/60">
            <div className="text-center">
              <span className="text-[10px] text-slate-500 bg-white/90 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-xs">
                TODAY, 7:15 AM
              </span>
            </div>

            {/* Message 1: Morning Briefing */}
            {step >= 1 && (
              <div className="animate-fadeIn max-w-[90%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3 text-xs text-slate-800 space-y-1.5 leading-relaxed shadow-xs">
                <p>
                  Good morning Rameshji! Yesterday&apos;s revenue was{' '}
                  <span className="text-teal-700 font-mono font-semibold">₹18,450 (+18%)</span>.
                </p>
                <p className="text-slate-600 text-[11px]">
                  Peak rush expected between <span className="text-slate-900 font-medium">6:30 - 8:30 PM</span>. Weather is clear.
                </p>
                <div className="text-right text-[9px] text-slate-400 font-mono">7:15 AM</div>
              </div>
            )}

            {/* Message 2: Stockout Alert with Saffron 1-Tap CTA */}
            {step >= 2 && (
              <div className="animate-fadeIn max-w-[90%] bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-3 text-xs text-slate-800 space-y-2.5 leading-relaxed shadow-xs">
                <p>
                  <span className="font-semibold text-slate-900">Stockout Alert:</span> Amul Taaza Milk (500ml) and Maggi (70g) will run out by 4 PM.
                </p>
                <p className="text-slate-600 text-[11px]">
                  Distributor reorder cutoff is 12:30 PM today.
                </p>

                {/* Saffron Human Action Button inside WhatsApp */}
                <div className="pt-1">
                  <button
                    disabled={hasApproved}
                    onClick={() => {
                      setHasApproved(true);
                      setStep(3);
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      hasApproved
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : 'bg-[#F59E0B] text-slate-950 hover:bg-[#D97706] hover:text-white active:scale-[0.98]'
                    }`}
                  >
                    {hasApproved ? '✓ Reorder Approved' : 'Approve Reorder (₹4,200)'}
                  </button>
                </div>
                <div className="text-right text-[9px] text-slate-400 font-mono">7:16 AM</div>
              </div>
            )}

            {/* Message 3: Merchant Reply */}
            {step >= 3 && (
              <div className="animate-fadeIn flex justify-end">
                <div className="max-w-[75%] bg-[#D9FDD3] border border-[#B8F0AF] rounded-2xl rounded-tr-sm p-3 text-xs text-slate-900 leading-relaxed shadow-xs">
                  <p className="font-medium">Haan, kar do</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] text-teal-700 font-mono mt-1">
                    <span>7:17 AM</span>
                    <span className="font-bold">✓✓</span>
                  </div>
                </div>
              </div>
            )}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1 bg-white border border-slate-200 w-14 p-2 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Bottom Bar */}
          <div className="p-3 bg-[#F0F2F5] border-t border-slate-200 flex items-center gap-2 text-[11px] text-slate-500">
            <div className="flex-1 bg-white border border-slate-200 rounded-full px-3 py-1.5 font-sans text-slate-600 shadow-xs">
              Type a message...
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 text-xs">
              mic
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
