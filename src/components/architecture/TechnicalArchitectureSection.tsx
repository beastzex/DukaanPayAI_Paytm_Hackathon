'use client';

import React, { useState } from 'react';
import { Layers, Cpu, Database, Network, Smartphone, ShieldCheck, ChevronRight, Activity } from 'lucide-react';

export const TechnicalArchitectureSection: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(2); // Default to Layer 3 (Hybrid Reasoning)

  const architectureLayers = [
    {
      layerNumber: 'Layer 1',
      title: 'Multimodal Data Ingestion Layer',
      icon: Database,
      badge: 'Real-time Event Streaming',
      tech: 'Paytm UPI Webhooks • PaddleOCR • S3 Bucket • Weather API • Cricbuzz API',
      description:
        'Streams internal financial velocity from Paytm soundboxes and QR codes, combined with external environmental factors (weather, festivals, cricket match fixtures) and merchant uploads.',
      metrics: 'Over 120 signals ingested per shop every 15 minutes',
      details: [
        'Paytm UPI transaction amount, frequency, and hourly velocity',
        'Distributor bills & Cash Ledger photos captured via WhatsApp',
        '3 daily shelf photos captured via smartphone or store CCTV',
        'Hyperlocal rain radar, temperature forecast, and festival calendar',
      ],
    },
    {
      layerNumber: 'Layer 2',
      title: 'Dedicated ML Forecasting Layer',
      icon: Activity,
      badge: 'Zero Hallucination Mathematics',
      tech: 'Facebook Prophet • XGBoost • LightGBM • Scikit-learn',
      description:
        'Dedicated mathematical algorithms handle time-series demand, stockout risk, and footfall density. LLMs are NEVER used for mathematical forecasting to avoid hallucinations.',
      metrics: 'Inference Latency: 12ms • Accuracy: 92.8%',
      details: [
        'Prophet model calculates 24-hr and 7-day daily revenue curves with confidence bands',
        'XGBoost computes exact reorder thresholds and stockout probability for every SKU',
        'LightGBM models rush-hour footfall density and queue bottlenecks',
        'XGBoost customer retention scoring identifies churn propensity',
      ],
    },
    {
      layerNumber: 'Layer 3',
      title: 'Hybrid Reasoning Layer (Groq LPUs)',
      icon: Cpu,
      badge: 'Sub-Second Agent Planning',
      tech: 'Groq LPUs • GPT-OSS 120B • Qwen 2.5 72B • JSON Schema Enforced',
      description:
        'Leverages Groq Language Processing Units (LPUs) for instant multi-agent planning. GPT-OSS 120B powers deep business logic and financial diagnostics, while Qwen powers ultra-fast multilingual WhatsApp synthesis.',
      metrics: 'Groq LPU Latency: 48ms - 164ms • Zero Warmup',
      details: [
        'GPT-OSS 120B: Strategic reasoning, margin audit, explainable "Why?" attribution',
        'Qwen: Fast Hindi, Tamil, Telugu, and English message formatting',
        'Dynamic model routing based on computational complexity',
        'Strict JSON schema validation on all agent outputs',
      ],
    },
    {
      layerNumber: 'Layer 4',
      title: 'Multi-Agent Orchestration & Guardrails',
      icon: Network,
      badge: 'Deterministic Safety Engine',
      tech: '8 Specialized Agents • Priority Synthesis • Financial Guardrails',
      description:
        'Coordinates 8 specialized agents, validates confidence scores, prevents conflicting advice, and ensures no action exceeds merchant working capital limits.',
      metrics: 'Reconciliation Pass: 14ms • Guardrail Gate: 100%',
      details: [
        'Confidence score thresholding (&gt;88% required for autonomous dispatch)',
        'Merchant working capital safety caps (cannot order &gt;₹15,000 without 2FA)',
        'WhatsApp broadcast frequency rate limiting (max 1 deal per customer/week)',
        'Human-in-the-loop: Always requests 1-tap confirmation for supplier POs',
      ],
    },
    {
      layerNumber: 'Layer 5',
      title: 'Omnichannel Merchant Experience',
      icon: Smartphone,
      badge: 'Zero-Hardware Adoption',
      tech: 'Paytm Soundbox Voice TTS • WhatsApp Business Cloud • Merchant App',
      description:
        'No separate software or POS to download. The merchant interacts effortlessly through physical audio Soundbox voice briefings, WhatsApp chats, and voice calls.',
      metrics: 'Zero Onboarding Friction • 10M+ Installed Soundbox Footprint',
      details: [
        'Paytm Soundbox announces morning revenue target & evening weather briefings in Hindi/English',
        'WhatsApp Business Bot provides 1-tap approval buttons for supplier purchase orders',
        'Paytm Merchant App embeds deep telemetry and Judge Evaluation dashboards',
        'Instant voice response to merchant queries (&quot;Aaj kitna butter bacha hai?&quot;)',
      ],
    },
  ];

  const current = architectureLayers[selectedLayer];

  return (
    <section id="architecture" className="py-20 lg:py-28 border-b border-slate-800/80 bg-[#040915] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Section 8 • Technical Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Built for <span className="text-gradient-paytm">Sub-Second Hybrid Intelligence</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Strict separation between deterministic machine learning forecasting (Prophet, XGBoost) and cognitive LLM reasoning (Groq GPT-OSS 120B, Qwen).
          </p>
        </div>

        {/* 5-Layer Stack Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Layer Selector Stack (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {architectureLayers.map((layer, idx) => {
              const isSelected = selectedLayer === idx;
              const Icon = layer.icon;

              return (
                <button
                  key={layer.layerNumber}
                  onClick={() => setSelectedLayer(idx)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-400 shadow-lg shadow-cyan-500/20 translate-y-[-2px]'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-cyan-400 uppercase">{layer.layerNumber}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] font-semibold text-slate-400">{layer.badge}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-tight">{layer.title}</h4>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </button>
              );
            })}
          </div>

          {/* Right: Active Layer Technical Deep-Dive (7 cols) */}
          <div className="lg:col-span-7 glass-panel rounded-2xl p-6 sm:p-8 border border-cyan-500/30 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-cyan-400 uppercase">{current.layerNumber}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-semibold text-emerald-400">{current.badge}</span>
                </div>
                <h3 className="text-xl font-bold text-white">{current.title}</h3>
              </div>
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <current.icon className="w-6 h-6" />
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Technology Stack & Protocols
                </span>
                <span className="font-mono text-cyan-300 font-semibold">{current.tech}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Architecture Overview
                </span>
                <p className="text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                  {current.description}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Key Technical Specifications:
                </span>
                <div className="space-y-2">
                  {current.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Benchmarked Performance:</span>
                <span className="font-mono text-emerald-400 font-bold">{current.metrics}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
