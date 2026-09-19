'use client';

import React, { useState, useEffect, useRef } from 'react';

export const RadialScore: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState(false);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const targetScore = 88;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setScore(targetScore);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const duration = 1200;
          const steps = 30;
          const interval = duration / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            setScore(Math.round(progress * targetScore));

            if (currentStep >= steps) {
              clearInterval(timer);
              setScore(targetScore);
            }
          }, interval);
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div ref={containerRef} className="w-full max-w-xl">
      {/* Large Radial Circular Progress Element */}
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-10">
        <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
            {/* Background track circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#E2E8F0"
              strokeWidth="8"
            />
            {/* Active Teal Arc */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="transparent"
              stroke="#0D9488"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-[stroke-dashoffset] duration-100 ease-out"
            />
          </svg>

          {/* Center Score Number */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-telemetry font-bold text-slate-900 tracking-tight tabular-nums">
              {score}
            </span>
            <span className="text-[11px] font-mono text-teal-700 font-semibold">/100</span>
          </div>
        </div>

        {/* Narrative Side Text */}
        <div className="text-left space-y-1.5">
          <div className="text-xs font-mono text-teal-700 font-semibold tracking-wide">
            Credit rating: Prime Vitality (A+)
          </div>
          <h3 className="text-lg font-headline font-normal text-slate-900">
            The Merchant Health Score
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-md">
            Merchants understand scores, not complex spreadsheets. Synthesized every midnight across store revenue consistency, inventory turns, and customer recurrence.
          </p>
        </div>
      </div>

      {/* 4 Flat Horizontal Weighted Bars (35 / 25 / 20 / 20) */}
      <div className="space-y-4 text-xs font-sans">
        {/* Metric 1 */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center text-slate-900 font-medium">
            <span>Payment Velocity (35% weight)</span>
            <span className="font-telemetry text-teal-700 font-semibold">94/100</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center text-slate-900 font-medium">
            <span>Inventory Health (25% weight)</span>
            <span className="font-telemetry text-teal-700 font-semibold">82/100</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center text-slate-900 font-medium">
            <span>Customer Retention (20% weight)</span>
            <span className="font-telemetry text-teal-700 font-semibold">89/100</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center text-slate-900 font-medium">
            <span>Supplier Discipline (20% weight)</span>
            <span className="font-telemetry text-teal-700 font-semibold">85/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
