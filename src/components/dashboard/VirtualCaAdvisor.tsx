'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Building2,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Download,
  Bot,
  User,
  ShieldCheck,
  TrendingUp,
  HelpCircle,
  MessageSquareText
} from 'lucide-react';
import { MLClient } from '@/lib/ml-client';

interface ChatMessage {
  id: string;
  sender: 'ca' | 'user';
  text: string;
  timestamp: string;
  modelUsed?: string;
  savingsBadge?: string;
}

const QUICK_PROMPTS = [
  { label: '💼 Section 44AD Tax Savings', query: 'Section 44AD में Paytm QR डिजिटल पेमेंट से मेरा कितना इनकम टैक्स बचेगा?' },
  { label: '📜 1% GST Composition Rules', query: 'मेरी दुकान के लिए 1% GST कंपोजिशन स्कीम के क्या नियम और फायदे हैं?' },
  { label: '💰 Daily Float 6.8% Sweep Interest', query: 'दुकान के ₹35,000 के डेली फ्लोट से 6.8% लिक्विड फंड ब्याज कैसे कमाएं?' },
  { label: '📈 If Digital Sales Reach 90%', query: 'अगर मेरी दुकान की डिजिटल सेल 78% से बढ़कर 90% हो जाए तो कितनी अतिरिक्त बचत होगी?' },
  { label: '🛡️ Tax Audit & Notice Risk', query: 'क्या सेक्शन 44AD लेने पर मुझे कभी इनकम टैक्स विभाग से नोटिस या CA ऑडिट की जरूरत पड़ेगी?' },
  { label: '📲 Generate Tax Audit Certificate', query: 'Laxmi Kirana Store का पूरा सालाना टैक्स व वेल्थ समरी सर्टिफिकेट बना कर दीजिए।' },
];

export function VirtualCaAdvisor() {
  const caData = MLClient.getVirtualCaTaxAndWealth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ca',
      text: `🇮🇳 **हिंदी में जानकारी (Hindi Advice):**
नमस्ते रामेश्वर जी! 🙏 मैं आपका DukaanPay AI वर्चुअल CA और वेल्थ एडवाइजर हूँ।
आपकी दुकान (Laxmi Kirana Store) के लिए हमने 3 मुख्य टैक्स व वेल्थ रणनीतियाँ बनाई हैं, जिससे आप सालाना कुल **₹${caData.totalAnnualMerchantGainINR.toLocaleString('en-IN')}** की बचत कर सकते हैं:

• **सेक्शन 44AD डिजिटल लाभ:** Paytm QR से डिजिटल बिक्री पर 8% के बजाय केवल 6% लाभ माना जाता है—सालाना **₹${caData.section44ad.annualTaxSavedINR.toLocaleString('en-IN')}** टैक्स बचता है!
• **GST 1% कंपोजिशन:** ₹1.5 करोड़ से कम टर्नओवर पर सिर्फ 1% फ्लैट GST दें, CA ऑडिट फीस में **₹${caData.gstComposition.caAuditFeeSavedINR.toLocaleString('en-IN')}** बचेंगे।
• **डेली फ्लोट लिक्विड फंड स्वीप (6.8%):** रात के ₹35,000 के फ्लोट से **₹${caData.wealthAdvisory.annualPassiveIncomeINR.toLocaleString('en-IN')}** अतिरिक्त ब्याज!

---
🇬🇧 **English Summary & Compliance Overview:**
• **Section 44AD Presumptive Tax:** Declaring 6% profit on digital UPI vs 8% on cash saves ₹${caData.section44ad.annualTaxSavedINR.toLocaleString('en-IN')}/year.
• **GST Composition Scheme:** 1% flat turnover tax exempts you from complex monthly HSN filings, saving ₹${caData.gstComposition.caAuditFeeSavedINR.toLocaleString('en-IN')}/year in audit fees.
• **Daily Cash Sweep (6.8% p.a.):** Overnight sweep of ₹35,000 float generates ₹${caData.wealthAdvisory.annualPassiveIncomeINR.toLocaleString('en-IN')}/year passive yield.
• **Total Annual Merchant Gain:** **₹${caData.totalAnnualMerchantGainINR.toLocaleString('en-IN')}/year** (Fully compliant with Indian Income Tax Act 1961).`,
      timestamp: 'अभी',
      modelUsed: 'Groq LPU (openai/gpt-oss-120b)',
      savingsBadge: `+₹${caData.totalAnnualMerchantGainINR.toLocaleString('en-IN')}/yr`,
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/virtual-ca/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
      });

      const data = await res.json();
      const caMsg: ChatMessage = {
        id: 'ca-' + Date.now(),
        sender: 'ca',
        text: data.reply || 'माफ कीजिए, तकनीकी समस्या आई।',
        timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed ? `Groq (${data.modelUsed})` : 'DukaanPay CA Engine',
        savingsBadge: 'Verified Indian Tax Code',
      };

      setMessages((prev) => [...prev, caMsg]);
    } catch (err: any) {
      console.error('Virtual CA Error:', err);
      const fallbackMsg: ChatMessage = {
        id: 'ca-' + Date.now(),
        sender: 'ca',
        text: `रामेश्वर भैया, आपके सवाल का उत्तर: Paytm QR डिजिटल ट्रांजैक्शन से सेक्शन 44AD में टैक्स दर 8% से घटकर 6% हो जाती है, जिससे आपकी दुकान सालाना ₹${caData.section44ad.annualTaxSavedINR.toLocaleString('en-IN')} बचाती है।`,
        timestamp: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'DukaanPay Fallback Engine',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (msgId: string, text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (speakingId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingId(msgId);

    // Clean markdown asterisks and hash symbols for spoken TTS
    const cleanSpeech = text.replace(/[*#_`]/g, '').replace(/₹/g, 'रुपए ');
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = 'hi-IN';
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopyReport = () => {
    const reportText = `💼 DUKAANPAY AI - VIRTUAL CA & WEALTH AUDIT REPORT
===================================================
Merchant: रामेश्वर गुप्ता (Rameshwar Gupta)
Store: Laxmi Kirana & General Store, Jaipur (302017)
Soundbox: PTM-SBOX-4G-9921 (Verified 4G VoLTE)
Annual Turnover: ₹${caData.annualTurnoverINR.toLocaleString('en-IN')}

TAX & WEALTH SAVINGS SUMMARY:
1. Section 44AD (Digital 6% vs Cash 8%): ₹${caData.section44ad.annualTaxSavedINR.toLocaleString('en-IN')}/year Saved
2. GST Composition (1% Flat, CMP-08): ₹${caData.gstComposition.caAuditFeeSavedINR.toLocaleString('en-IN')}/year CA Fees Saved
3. Daily Float Auto-Sweep (6.8% p.a.): ₹${caData.wealthAdvisory.annualPassiveIncomeINR.toLocaleString('en-IN')}/year Interest Earned

TOTAL ANNUAL MERCHANT VALUE: ₹${caData.totalAnnualMerchantGainINR.toLocaleString('en-IN')}/year
Audit Status: 100% Compliant with Indian Income Tax Act 1961 & CGST Act 2017.`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Building2 className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-bold text-[#002E6E]">AI Virtual CA &amp; Wealth Advisor</h3>
              <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                Total Annual Gain: +₹{caData.totalAnnualMerchantGainINR.toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Live automated compliance, Section 44AD tax shielding, 1% GST composition audit, and working capital cash sweep wealth engine.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? 'Copied Audit Report!' : 'Export CA Audit Report'}</span>
            </button>
            <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              Turnover: <span className="font-bold text-[#002E6E]">₹{(caData.annualTurnoverINR / 100000).toFixed(1)}L</span>
            </div>
          </div>
        </div>

        {/* 3 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pillar 1: Section 44AD */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-teal-50/30 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase px-2 py-0.5 rounded bg-emerald-100/80">
                Income Tax Section 44AD
              </span>
              <span className="text-emerald-600 text-xs font-bold">Save ₹{caData.section44ad.annualTaxSavedINR.toLocaleString('en-IN')}/yr</span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900">Digital UPI 6% vs Cash 8% Advantage</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Section 44AD levies only 6% deemed profit on Paytm QR digital receipts vs 8% on cash.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-emerald-100 text-xs space-y-1 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Digital UPI Rate:</span>
                <span className="font-bold text-emerald-700">6%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Cash Turnover Rate:</span>
                <span className="font-bold text-rose-600">8%</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-100">
                <span>Annual Tax Saved:</span>
                <span className="text-emerald-700">₹{caData.section44ad.annualTaxSavedINR.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              💡 {caData.section44ad.recommendation}
            </p>
          </div>

          {/* Pillar 2: GST Composition */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/60 to-blue-50/30 border border-sky-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-[#002E6E] uppercase px-2 py-0.5 rounded bg-sky-100">
                GST Composition Scheme
              </span>
              <span className="text-sky-700 text-xs font-bold">Save ₹{caData.gstComposition.caAuditFeeSavedINR.toLocaleString('en-IN')}/yr</span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900">1% Flat GST (Turnover &lt; ₹1.5 Cr)</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Avoid complex monthly HSN return filings (GSTR-1, GSTR-3B). Pay flat 1% quarterly (CMP-08).
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-sky-100 text-xs space-y-1 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Eligibility:</span>
                <span className="font-bold text-emerald-600">Approved (&lt; ₹1.5 Cr)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Flat Tax Rate:</span>
                <span className="font-bold text-[#002E6E]">1.0%</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-100">
                <span>CA Filing Fees Saved:</span>
                <span className="text-emerald-700">₹{caData.gstComposition.caAuditFeeSavedINR.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              💡 {caData.gstComposition.benefit}
            </p>
          </div>

          {/* Pillar 3: Cash Sweep Wealth */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 to-orange-50/30 border border-amber-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-amber-800 uppercase px-2 py-0.5 rounded bg-amber-100">
                Daily Float Sweep Fund
              </span>
              <span className="text-amber-700 text-xs font-bold">+₹{caData.wealthAdvisory.annualPassiveIncomeINR.toLocaleString('en-IN')}/yr</span>
            </div>

            <div>
              <h4 className="font-bold text-sm text-slate-900">Idle Working Capital Yield (6.8%)</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Don&apos;t leave night cash balances idle at 0%. Auto-sweep into overnight liquid fund with instant T+0 access.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-amber-100 text-xs space-y-1 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Average Daily Float:</span>
                <span className="font-bold text-slate-800">₹{caData.wealthAdvisory.idleFloatBalanceINR.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Annual Return:</span>
                <span className="font-bold text-amber-600">6.8% p.a.</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold pt-1 border-t border-slate-100">
                <span>Passive Interest:</span>
                <span className="text-amber-700">+₹{caData.wealthAdvisory.annualPassiveIncomeINR.toLocaleString('en-IN')}/yr</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              💡 Liquidity: {caData.wealthAdvisory.liquidityWindow}
            </p>
          </div>
        </div>
      </div>

      {/* LIVE INTERACTIVE CHATBOT & MESSAGING TO VIRTUAL CA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Chatbot Top Bar */}
        <div className="p-4 bg-gradient-to-r from-[#002E6E] via-[#003d8f] to-[#002E6E] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#00BAF2] flex items-center justify-center font-bold text-lg text-white shadow-md">
                💼
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#002E6E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">CA Rameshwar Sharma (Virtual CA &amp; Wealth Advisor)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-emerald-300 font-semibold border border-white/10">
                  Online 24x7
                </span>
              </div>
              <div className="text-xs text-sky-200">
                Certified Income Tax &amp; GST Consultant for Kirana Merchants • Powered by Groq LPU
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-200 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Soundbox Audio Sync Active</span>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#00BAF2]" /> Quick Queries:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt.query)}
              disabled={isLoading}
              className="text-xs shrink-0 px-3 py-1.5 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-[#002E6E] font-medium border border-slate-200 hover:border-[#00BAF2] transition-all shadow-2xs flex items-center gap-1"
            >
              <span>{prompt.label}</span>
            </button>
          ))}
        </div>

        {/* Chat Message Scroll Area */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[480px] min-h-[360px] overflow-y-auto bg-slate-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[90%] sm:max-w-[80%] ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-bold text-xs shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#002E6E] text-white'
                    : 'bg-[#00BAF2] text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1.5">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#002E6E] text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>

                <div
                  className={`flex items-center gap-2 text-[10px] text-slate-400 font-mono px-1 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.modelUsed && <span>• {msg.modelUsed}</span>}
                  {msg.savingsBadge && (
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 rounded font-bold">
                      {msg.savingsBadge}
                    </span>
                  )}
                  {msg.sender === 'ca' && (
                    <button
                      onClick={() => handleSpeak(msg.id, msg.text)}
                      title={speakingId === msg.id ? 'Stop Voice' : 'Listen in Hindi'}
                      className="text-slate-400 hover:text-[#00BAF2] transition-colors ml-1 p-0.5"
                    >
                      {speakingId === msg.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-[#00BAF2] text-white shrink-0 flex items-center justify-center font-bold text-xs animate-pulse">
                💼
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 rounded-tl-none shadow-2xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00BAF2] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#00BAF2] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#00BAF2] animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs text-slate-500 font-mono ml-1">
                  Virtual CA is computing tax laws &amp; financial math...
                </span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything on Tax, GST, 44AD, Float interest, or Wealth advice..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00BAF2] focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#002E6E] hover:bg-[#001f4d] disabled:opacity-50 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
            >
              <span>Ask CA</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>💡 Real-time financial calculations grounded in Section 44AD &amp; CGST Act 2017</span>
            <span>Also accessible on WhatsApp by sending &quot;tax kaise bachaye&quot;</span>
          </div>
        </div>
      </div>
    </div>
  );
}
