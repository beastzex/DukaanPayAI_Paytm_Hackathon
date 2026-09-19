'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface Stage {
  num: string;
  name: string;
  desc: string;
}

const STAGES: Stage[] = [
  {
    num: '01',
    name: 'Observe',
    desc: 'Streams real-time UPI transaction timestamps, distributor invoices, and local weather changes.',
  },
  {
    num: '02',
    name: 'Understand',
    desc: 'Calculates SKU margins, historical customer visit cadence, and shelf space utilization.',
  },
  {
    num: '03',
    name: 'Predict',
    desc: 'Prophet and XGBoost models forecast evening rush hours and days-until-stockout.',
  },
  {
    num: '04',
    name: 'Recommend',
    desc: 'Synthesizes high-ROI reorder quantities with explainable justification and confidence score.',
  },
  {
    num: '05',
    name: 'Execute',
    desc: 'Merchants approve via WhatsApp with 1 tap, automatically dispatching POs to suppliers.',
  },
];

export const GrowthLoopSection: React.FC = () => {
  return (
    <section id="growth-loop" className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-[#F8FAFC] via-[#FAF9F6] to-white">
      <div className="max-w-6xl mx-auto">
        {/* Clean Section Header without repetitive eyebrow */}
        <div className="text-left mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-headline font-normal text-slate-900 tracking-tight">
            How intelligence moves from counter to distributor.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl">
            A sequential five-stage loop running quietly behind every transaction.
          </p>
        </div>

        {/* Connected Horizontal Path / Thread */}
        <div className="relative">
          {/* Connecting Hairline Thread (Desktop horizontal, mobile vertical) */}
          <div className="hidden lg:block absolute top-[20px] left-8 right-8 h-[1px] bg-slate-200 z-0" />
          <div className="lg:hidden absolute top-8 bottom-8 left-[19px] w-[1px] bg-slate-200 z-0" />

          {/* 5 Stages Sequence */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-6 relative z-10">
            {STAGES.map((stage, idx) => (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.45, delay: idx * 0.1 }}
                className="flex flex-row lg:flex-col items-start gap-4 lg:gap-5 text-left"
              >
                {/* Stage Number Node */}
                <div className="w-10 h-10 rounded-full bg-[#F8FAFC] border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                  <span className="font-telemetry text-xs font-semibold text-teal-700">
                    {stage.num}
                  </span>
                </div>

                {/* Content */}
                <div className="space-y-1.5 pt-1 lg:pt-0">
                  <h3 className="text-base font-semibold text-slate-900 font-sans">
                    {stage.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans max-w-xs">
                    {stage.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
