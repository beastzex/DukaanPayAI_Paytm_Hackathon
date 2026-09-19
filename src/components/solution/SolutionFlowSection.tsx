'use client';

import React, { useState } from 'react';
import { Eye, Brain, LineChart, Lightbulb, Zap, RefreshCw, ArrowRight } from 'lucide-react';

export const SolutionFlowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      stepNumber: '01',
      title: 'Observe',
      subtitle: 'Passive Multimodal Ingestion',
      icon: Eye,
      color: 'from-blue-500 to-cyan-400',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      description: 'The agent continuously listens to existing store touchpoints without requiring data entry.',
      inputs: [
        'Paytm UPI transaction amounts & velocity timestamps',
        'Distributor invoices uploaded via WhatsApp photo',
        'Daily 3-shelf camera snapshots',
        'Hyperlocal live weather API (rain & temperature)',
        'Local festival dates & IPL cricket schedules',
      ],
      aiEngine: 'Multimodal OCR (PaddleOCR/Vision) + Real-time Event Streaming Webhooks',
      merchantTouchpoint: 'Zero merchant effort — data is captured naturally during normal shop operations.',
    },
    {
      stepNumber: '02',
      title: 'Understand',
      subtitle: 'Contextual Retail Intelligence',
      icon: Brain,
      color: 'from-purple-500 to-indigo-400',
      badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
      description: 'Transforms raw transaction and invoice data into high-fidelity retail telemetry.',
      inputs: [
        'Calculates real unit purchase cost and gross profit margin per SKU',
        'Builds customer RFM (Recency, Frequency, Monetary) purchase profiles',
        'Measures shelf capacity utilization and product depletion velocities',
        'Establishes store baseline revenue curves for weekdays vs weekends',
      ],
      aiEngine: 'Feature Store + Groq GPT-OSS 120B Knowledge Synthesis',
      merchantTouchpoint: 'Computes Merchant Health Score™ (0-100) and detects revenue leakages.',
    },
    {
      stepNumber: '03',
      title: 'Predict',
      subtitle: 'Dedicated Machine Learning Engines',
      icon: LineChart,
      color: 'from-emerald-500 to-teal-400',
      badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      description: 'Forecasting is powered by dedicated mathematical ML models — strictly no LLM hallucination.',
      inputs: [
        'Prophet model outputs 24-hr and 7-day revenue curves with confidence bands',
        'XGBoost computes exact reorder point and days-until-stockout for each SKU',
        'LightGBM models rush-hour footfall density and queue bottlenecks',
        'Retention model identifies shoppers at risk of churning to quick-commerce',
      ],
      aiEngine: 'Facebook Prophet + XGBoost + LightGBM (Deterministic inference)',
      merchantTouchpoint: 'Generates expected revenue vs actual tracking curve.',
    },
    {
      stepNumber: '04',
      title: 'Recommend',
      subtitle: 'Explainable Micro-Actions',
      icon: Lightbulb,
      color: 'from-amber-500 to-yellow-400',
      badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      description: 'Synthesizes predictions into actionable, high-ROI choices with full explainability.',
      inputs: [
        'Ranks proposed actions by net profit impact (₹ Protected Margin)',
        'Attaches explainable "Why?" justification and model confidence score',
        'Formats recommendations into ready-to-dispatch WhatsApp messages or Soundbox audio',
      ],
      aiEngine: 'Agent Orchestrator + Multi-Agent Guardrails + Groq Reasoning',
      merchantTouchpoint: 'Delivers morning briefing and urgent reorder alerts with 1-tap options.',
    },
    {
      stepNumber: '05',
      title: 'Execute',
      subtitle: 'Omnichannel Action Dispatch',
      icon: Zap,
      color: 'from-rose-500 to-pink-400',
      badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10',
      description: 'Merchants approve with 1 tap on WhatsApp or Voice, and the agent executes.',
      inputs: [
        'Dispatches purchase orders directly to wholesale distributor WhatsApp',
        'Sends personalized WhatsApp flash deal to 84 nearby dormant customers',
        'Announces stock alerts or evening preparation reminders via Paytm Soundbox',
      ],
      aiEngine: 'WhatsApp Business Cloud API + Paytm Soundbox TTS Voice Engine',
      merchantTouchpoint: 'The merchant simply replies "YES" on WhatsApp.',
    },
    {
      stepNumber: '06',
      title: 'Learn',
      subtitle: 'Closed-Loop Reinforcement',
      icon: RefreshCw,
      color: 'from-cyan-500 to-blue-400',
      badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
      description: 'Evaluates the business outcome of every executed recommendation to adapt hyperparameters.',
      inputs: [
        'Did the WhatsApp campaign generate the expected ₹2,400 GMV lift?',
        'Did the distributor fulfill the butter reorder on time?',
        'Was the rain footfall impact greater or lesser than forecast?',
      ],
      aiEngine: 'Continuous Reinforcement Learning & Hyperparameter Auto-Tuning',
      merchantTouchpoint: 'System accuracy improves week over week for that specific shop.',
    },
  ];

  const current = steps[activeStep];

  return (
    <section id="solution" className="py-20 lg:py-28 border-b border-slate-800/80 bg-grid-pattern relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Section 3 • The Autonomous Loop</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Observe → Understand → Predict → Recommend → Execute → Learn
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A continuous, autonomous intelligence flywheel running silently in the background of every Paytm transaction.
          </p>
        </div>

        {/* Step Navigation Switcher */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            return (
              <button
                key={step.stepNumber}
                onClick={() => setActiveStep(index)}
                className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/20 translate-y-[-2px]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className={`text-[11px] font-black ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                    {step.stepNumber}
                  </span>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                </div>
                <span className="text-sm font-bold text-white block">{step.title}</span>
                <span className="text-[10px] text-slate-400 truncate w-full">{step.subtitle}</span>
              </button>
            );
          })}
        </div>

        {/* Active Step Deep-Dive Card */}
        <div className="glass-panel rounded-2xl p-6 sm:p-10 border border-cyan-500/30 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
            {/* Left Description & Inputs */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${current.color} text-white shadow-lg`}>
                  <current.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-cyan-400">PHASE {current.stepNumber}</span>
                    <span className="text-slate-600">•</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${current.badgeColor}`}>
                      {current.subtitle}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{current.title}</h3>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                {current.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  What Happens in this Stage:
                </h4>
                <ul className="space-y-2.5">
                  {current.inputs.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Architecture & Merchant Touchpoint Box */}
            <div className="w-full lg:w-[420px] space-y-4">
              <div className="glass-panel-subtle p-5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  AI / ML Engine Architecture
                </span>
                <p className="text-xs text-slate-200 font-medium">
                  {current.aiEngine}
                </p>
              </div>

              <div className="glass-panel-subtle p-5 rounded-xl border border-slate-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Zero-Friction Merchant Touchpoint
                </span>
                <p className="text-xs text-slate-200 font-medium">
                  {current.merchantTouchpoint}
                </p>
              </div>

              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span>Next Lifecycle Stage:</span>
                <button
                  onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold"
                >
                  <span>Advance to {steps[(activeStep + 1) % steps.length].title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
