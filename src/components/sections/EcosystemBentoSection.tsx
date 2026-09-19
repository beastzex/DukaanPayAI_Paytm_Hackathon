'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const EcosystemBentoSection: React.FC = () => {
  return (
    <section id="ecosystem" className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-white via-[#FAF9F6] to-[#F1F5F9]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-left mb-16 space-y-3">
          <div className="text-xs font-mono text-teal-700 font-semibold tracking-wide">
            HARDWARE SYNERGY / THE PAYTM ADVANTAGE
          </div>
          <h2 className="text-3xl sm:text-4xl font-headline font-normal text-slate-950 tracking-tight">
            Built on top of devices merchants already trust.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl leading-relaxed">
            No expensive point-of-sale terminals. No complicated tablets. DukaanPayAI piggybacks on existing Paytm Soundboxes, QR standees, and WhatsApp.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 text-left">
          {/* Card 1: Large Featured Card with Pinterest Image */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-64 sm:h-72 w-full bg-slate-100 overflow-hidden">
              <Image
                src="/images/soundbox-counter.jpg"
                alt="Paytm Soundbox on Kirana Counter"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="text-[11px] font-mono text-teal-800 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 font-semibold shadow-xs">
                  Paytm Soundbox 4G Voice Integration
                </span>
              </div>
            </div>

            <div className="p-6 pt-2 space-y-2">
              <h3 className="text-xl font-headline font-normal text-slate-900">
                Voice Alerts at the Counter
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                When a high-priority restocking deadline or weather surge arises, DukaanPayAI whispers bilingual voice nudges through the Paytm Soundbox speaker during idle transaction pauses.
              </p>
              <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-500">
                <span>✓ Dual SIM 4G</span>
                <span>✓ Hindi & Hinglish</span>
                <span>✓ Sub-second latency</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: QR & UPI Stream */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-6 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <span className="text-xs font-mono text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                Zero-Tech Input
              </span>
              <h3 className="text-xl font-headline font-normal text-slate-900">
                Paytm QR UPI Telemetry
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Every scan on the counter QR transmits customer transaction amount and timestamp. DukaanPayAI translates this raw stream into footfall cadence, repeat visit intervals, and peak rush timing.
              </p>
            </div>

            {/* Visual Stream Chip */}
            <div className="p-4 rounded-xl bg-[#F8FAFC] border border-slate-200 font-mono text-[11px] space-y-2 text-slate-600">
              <div className="flex justify-between text-teal-700 font-semibold">
                <span>UPI STREAM LIVE</span>
                <span>99.98% SYNC</span>
              </div>
              <div className="text-slate-500">
                TX_89201 • ₹140.00 • Dairy & Bread • 11:28:04
              </div>
              <div className="text-slate-500">
                TX_89202 • ₹450.00 • Spices & Pulses • 11:29:12
              </div>
            </div>
          </motion.div>

          {/* Card 3: WhatsApp Cloud API */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-6 space-y-3"
          >
            <span className="text-xs font-mono text-teal-700 font-semibold bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60">
              100% Adoption
            </span>
            <h3 className="text-xl font-headline font-normal text-slate-900">
              WhatsApp Cloud API Interface
            </h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Kirana merchants use WhatsApp over 4 hours every day with family and suppliers. DukaanPayAI operates natively where they already live, ensuring zero onboarding friction.
            </p>
            <div className="pt-2 text-xs font-mono text-teal-700 font-medium">
              → 1-tap interactive approval buttons natively embedded
            </div>
          </motion.div>

          {/* Card 4: Automated Khata OCR & Supplier Auditing */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm p-6 space-y-3"
          >
            <span className="text-xs font-mono text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/60">
              Capital Recovery
            </span>
            <h3 className="text-xl font-headline font-normal text-slate-900">
              Automated Bill OCR & Khata Defense
            </h3>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              Merchants snap a photo of distributor paper slips. Qwen-2-VL Vision automatically audits line items against price lists, catching silent wholesale margin leaks.
            </p>
            <div className="pt-2 text-xs font-mono text-amber-700 font-medium">
              → ₹1,450/month average recovered per neighborhood merchant
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
