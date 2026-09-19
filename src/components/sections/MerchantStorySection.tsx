'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface TimelineMoment {
  id: string;
  time: string;
  title: string;
  subtitle: string;
  badge: string;
  audioText: string;
  actionTaken: string;
  impact: string;
}

const MOMENTS: TimelineMoment[] = [
  {
    id: 'morning',
    time: '07:15 AM',
    title: 'Autonomous Morning Briefing',
    subtitle: 'Before the shutters open, DukaanPayAI analyzes overnight UPI settlement & weather predictions.',
    badge: 'Voice & WhatsApp',
    audioText: '“नमस्ते रमेश जी! कल ₹18,450 की बिक्री हुई। आज शाम 6:30 बजे भारी भीड़ का अनुमान है।”',
    actionTaken: 'Calculated 18% day-on-day growth and set daily cash reserve threshold.',
    impact: 'Zero mental overhead before store opening.',
  },
  {
    id: 'restock',
    time: '11:30 AM',
    title: 'Predictive Stockout Protection',
    subtitle: 'AI cross-references inventory velocity with distributor cutoff times.',
    badge: '1-Tap Reorder',
    audioText: '“अमूल दूध और मैगी शाम 4 बजे खत्म हो जाएगी। 12:30 बजे से पहले सप्लायर को ऑर्डर भेजें?”',
    actionTaken: 'Merchant replied "Haan kar do", with automated purchase order dispatched to Modern Dairy.',
    impact: '₹4,200 weekend revenue preserved.',
  },
  {
    id: 'weather',
    time: '04:15 PM',
    title: 'Monsoon Demand Surge Surge-Pricing',
    subtitle: 'Real-time IMD radar detects sudden unseasonal rain heading to Jaipur sector 4.',
    badge: 'Soundbox Audio',
    audioText: '“बारिश शुरू होने वाली है। साउंडबॉक्स पर चाय और बिस्कुट का कॉम्बो ऑफर शुरू कर दिया गया है।”',
    actionTaken: 'Broadcasted snack combo on Soundbox display and local society WhatsApp broadcast.',
    impact: '34 additional impulse sales in 90 minutes.',
  },
  {
    id: 'khata',
    time: '09:30 PM',
    title: 'Midnight Khata Audit & Fraud Defense',
    subtitle: 'Daily bill OCR audits supplier wholesale invoices against agreed rate-cards.',
    badge: 'Khata Intelligence',
    audioText: '“आज के सप्लायर बिल में ₹850 का अधिक रेट पाया गया। क्रेडिट नोट क्लेम तैयार है।”',
    actionTaken: 'Flagged rate drift on Fortune Mustard Oil line item and generated instant credit request.',
    impact: '₹850 recovered before monthly settlement.',
  },
];

export const MerchantStorySection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const current = MOMENTS[activeIdx];

  return (
    <section id="story" className="py-24 sm:py-32 px-4 sm:px-8 border-b border-slate-200/80 bg-gradient-to-b from-[#F5F5F7] via-white to-[#F8FAFC]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-left mb-14 space-y-3">
          <div className="text-xs font-mono text-teal-700 font-semibold tracking-wide">
            REAL KIRANA CHRONICLES / LAXMI PROVISIONS
          </div>
          <h2 className="text-3xl sm:text-4xl font-headline font-normal text-slate-950 tracking-tight">
            A day alongside Ramesh Ji.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl leading-relaxed">
            DukaanPayAI is not a dashboard you log into. It is an autonomous partner that runs quietly from morning shutter-rise to midnight ledger close.
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Pinterest-style Editorial Image Pair with parallax depth */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-4/3 bg-slate-100 group">
              <Image
                src="/images/merchant-portrait.jpg"
                alt="Ramesh Ji in front of his Kirana Store"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="text-sm font-semibold">Ramesh Gupta, Proprietor</div>
                <div className="text-xs text-slate-200 font-sans">Laxmi Kirana & General Store, Jaipur (Est. 1998)</div>
              </div>
            </div>

            {/* Overlapping Inset Pinterest Image */}
            <div className="hidden sm:block absolute -bottom-6 -right-6 w-48 h-36 rounded-xl overflow-hidden border-2 border-white shadow-xl bg-slate-100">
              <Image
                src="/images/kirana-store.jpg"
                alt="Organized Kirana store shelves"
                fill
                sizes="192px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column: Interactive Timeline Experience */}
          <div className="lg:col-span-6 space-y-6">
            {/* Time selector pills */}
            <div className="flex flex-wrap gap-2 pb-2">
              {MOMENTS.map((m, idx) => (
                <button
                  key={m.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
                    activeIdx === idx
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {m.time}
                </button>
              ))}
            </div>

            {/* Animated Moment Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4 text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-700 font-semibold bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                    {current.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-medium">
                    {current.time}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-headline font-normal text-slate-900">
                    {current.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-sans mt-1 leading-relaxed">
                    {current.subtitle}
                  </p>
                </div>

                {/* Simulated Audio/Notification Pill */}
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs text-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-teal-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                    Soundbox 4G Voice Broadcast / WhatsApp
                  </div>
                  <p className="italic font-sans text-slate-800 leading-relaxed">
                    {current.audioText}
                  </p>
                </div>

                {/* Outcome & Impact */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="text-[11px] font-mono text-slate-400">ACTION TAKEN</div>
                    <div className="text-slate-700 font-sans font-medium">{current.actionTaken}</div>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <div className="text-[11px] font-mono text-teal-700 font-semibold">NET VALUE</div>
                    <div className="font-telemetry font-bold text-teal-700">{current.impact}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
