'use client';

import React from 'react';
import { Award, Users, GitBranch, Mail, Phone, ExternalLink, Code2, FileCode, CheckCircle2 } from 'lucide-react';

export const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: 'Aditya Srivastava',
      role: 'Principal AI Architect & Tech Lead',
      specialty: 'Groq Multi-Agent Orchestration & Hybrid LLM Reasoning',
      email: 'aditya.ai.architect@paytm-growth.internal',
      github: 'https://github.com/paytm-hackathon-growth',
      avatar: '👨‍💻',
    },
    {
      name: 'Rohan Deshmukh',
      role: 'Staff ML Engineer (Forecasting & Vision)',
      specialty: 'Facebook Prophet, LightGBM, YOLOv10 & PaddleOCR Pipeline',
      email: 'rohan.ml@paytm-growth.internal',
      github: 'https://github.com/paytm-hackathon-growth',
      avatar: '🧠',
    },
    {
      name: 'Pooja Iyer',
      role: 'Lead Product Designer & Kirana UX Specialist',
      specialty: 'Zero-Hardware Touchpoints, Soundbox Voice UX & Linear Design Systems',
      email: 'pooja.ux@paytm-growth.internal',
      github: 'https://github.com/paytm-hackathon-growth',
      avatar: '🎨',
    },
  ];

  return (
    <section id="team" className="py-20 lg:py-28 border-b border-slate-800/80 bg-[#040915] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Users className="w-3.5 h-3.5" />
            <span>Section 12 • Finalist Team & Submission</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4">
            Paytm Build For India AI Hackathon — <span className="text-gradient-paytm">Track 1</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Built by engineers and product designers passionate about transforming 30M+ Indian neighborhood kirana stores into predictive retail powerhouses.
          </p>
        </div>

        {/* Team Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {teamMembers.map((member, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-cyan-500/25 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shadow-md">
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{member.name}</h3>
                    <p className="text-xs text-cyan-400 font-semibold">{member.role}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {member.specialty}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GitBranch className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-mono text-[11px]">Paytm Build For India AI</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submission Artifacts & Verification Checklist */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-[#040d21]">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full mb-2 inline-block">
                Submission Verification
              </span>
              <h3 className="text-xl font-bold text-white mb-1">
                Evaluation Deliverables Checklist
              </h3>
              <p className="text-xs text-slate-300 max-w-xl">
                All production requirements generated: Next.js 15 App Router codebase, 8-agent Groq LPU orchestrator, Prophet forecasting engine, YOLOv10/Florence-2 vision simulation, and live Soundbox voice synthesis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Production TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Deterministic ML Forecasting</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bilingual Hindi/English Voice</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Manual Entry OCR/Vision</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
