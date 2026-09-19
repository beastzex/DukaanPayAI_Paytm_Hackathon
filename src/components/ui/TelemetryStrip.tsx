'use client';

import React, { useState, useEffect, useRef } from 'react';

export const TelemetryStrip: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [kiranaCount, setKiranaCount] = useState(0);
  const [upiVolume, setUpiVolume] = useState(0);
  const [zeroTech, setZeroTech] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setKiranaCount(30);
      setUpiVolume(85);
      setZeroTech(92);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1400;
          const steps = 30;
          const interval = duration / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            setKiranaCount(Math.round(progress * 30));
            setUpiVolume(Math.round(progress * 85));
            setZeroTech(Math.round(progress * 92));

            if (currentStep >= steps) {
              clearInterval(timer);
              setKiranaCount(30);
              setUpiVolume(85);
              setZeroTech(92);
            }
          }, interval);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={containerRef}
      className="w-full bg-[#F8FAFC] border-y border-slate-200 py-6 px-4 sm:px-8"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
        {/* Metric 1 */}
        <div className="flex flex-col">
          <div className="text-2xl sm:text-3xl font-telemetry font-bold text-teal-700 tabular-nums tracking-tight">
            {kiranaCount}M+
          </div>
          <div className="text-xs text-slate-600 mt-1 font-sans font-medium">
            Kirana Stores across India
          </div>
        </div>

        {/* Metric 2 */}
        <div className="flex flex-col sm:border-l sm:border-slate-200 sm:pl-6">
          <div className="text-2xl sm:text-3xl font-telemetry font-bold text-teal-700 tabular-nums tracking-tight">
            ₹{upiVolume}B+
          </div>
          <div className="text-xs text-slate-600 mt-1 font-sans font-medium">
            Daily UPI Volume on Paytm Soundboxes
          </div>
        </div>

        {/* Metric 3 */}
        <div className="flex flex-col sm:border-l sm:border-slate-200 sm:pl-6">
          <div className="text-2xl sm:text-3xl font-telemetry font-bold text-teal-700 tabular-nums tracking-tight">
            {zeroTech}%
          </div>
          <div className="text-xs text-slate-600 mt-1 font-sans font-medium">
            Currently Operating Zero-Tech
          </div>
        </div>
      </div>
    </div>
  );
};
