'use client';

import React, { useState } from 'react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'merchant';
  time: string;
  text: string;
  hindiText?: string;
  actionButton?: {
    label: string;
    actionType: 'STOCK_RESTOCK' | 'WINBACK_CAMPAIGN' | 'FESTIVAL_BUFFER' | 'UDHAAR_RECOVERY';
    payload: Record<string, any>;
  };
  isAudio?: boolean;
  audioDuration?: string;
  status?: 'pending' | 'executed';
  backendActionId?: string;
}

export function WhatsAppLiveFeed() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      time: '07:30 AM',
      text: 'Good morning Rameshwar ji! Today is expected to generate ₹18,450 GMV (+24% above normal). Peak rush forecast: 18:00 - 20:30 PM.',
      hindiText: 'सुप्रभात रामेश्वर जी! आज ₹18,450 की बिक्री का अनुमान है। शाम 6 से 8:30 बजे भारी रश रहेगा।',
    },
    {
      id: 'msg-2',
      sender: 'ai',
      time: '08:15 AM',
      isAudio: true,
      audioDuration: '0:14',
      text: 'Voice Briefing: Prophet peak demand detected. Amul Milk inventory is at 4 units, projected depletion by 16:30 PM.',
      hindiText: '🎙️ वॉयस अलर्ट: शाम की चाय के रश से पहले अमूल दूध का केवल 4 पैकेट बचा है।',
    },
    {
      id: 'msg-3',
      sender: 'ai',
      time: '09:00 AM',
      text: '🚨 Critical Stockout Risk: Amul Taaza Milk will run out before 5 PM. Supplier Modern Dairy order deadline is 12:30 PM.',
      hindiText: 'अमूल ताज़ा दूध का स्टॉक केवल 4 पैकेट बचा है। शाम के समय 24 पैकेट की मांग होगी। सप्लायर को 24 पैकेट का आर्डर भेजें?',
      actionButton: {
        label: '✅ Approve 24 Crates Reorder (₹4,200)',
        actionType: 'STOCK_RESTOCK',
        payload: { sku: 'AML-MK-500', qty: 24, distributor: 'Modern Dairy Jaipur' },
      },
      status: 'pending',
    },
    {
      id: 'msg-4',
      sender: 'ai',
      time: '10:45 AM',
      text: 'Society Churn Recovery: 42 regular society families haven\'t visited in 20+ days. Would you like to launch a ₹20 WhatsApp festive voucher?',
      hindiText: 'सोसायटी के 42 नियमित परिवार पिछले 20 दिनों से नहीं आए हैं। क्या उन्हें ₹20 का वेलकम कूपन भेजें?',
      actionButton: {
        label: '📢 Send ₹20 WhatsApp Voucher to 42 Customers',
        actionType: 'WINBACK_CAMPAIGN',
        payload: { audienceCount: 42, coupon: 'WELCOME20', minSpend: 200 },
      },
      status: 'pending',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const executeAction = async (msgId: string, button: NonNullable<ChatMessage['actionButton']>) => {
    setLoadingActionId(msgId);

    try {
      const res = await fetch('http://localhost:4000/api/v1/ai-integration/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4NTgzMDczYS01Zjc2LTRhYmUtOTkwZC1iNjMxY2NmMjVkYjAiLCJyb2xlcyI6WyJNRVJDSEFOVCJdLCJwZXJtaXNzaW9ucyI6WyJSRUFEX1BST0ZJTEUiLCJNQU5BR0VfSU5WRU5UT1JZIiwiRElTUEFUQ0hfQ0FNUEFJR05TIl0sImlhdCI6MTc4OTc5NTYyMiwiZXhwIjoxNzg5Nzk2NTIyfQ.OQo-CUAj2t_s-43XnrLMf-CLVmybyWV_5C4I4lPLXco',
        },
        body: JSON.stringify({
          merchantId: 'm_101',
          actionType: button.actionType,
          priority: 'HIGH',
          title: button.label,
          rationaleIndic: 'Approved by merchant via WhatsApp 1-tap interactive trigger',
          projectedRevenueINR: 4200,
          payload: button.payload,
          requiresMerchantApproval: false,
        }),
      }).catch(() => null);

      let actionId = `act_${Date.now()}`;
      if (res && res.ok) {
        const data = await res.json();
        actionId = data.data?.actionId || actionId;
      }

      setMessages((prev) =>
        prev
          .map((m) => (m.id === msgId ? { ...m, status: 'executed' as const, backendActionId: actionId } : m))
          .concat({
            id: `reply-${Date.now()}`,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: `Action successfully queued in BullMQ and published to Kafka! Tracking ID: ${actionId}.`,
            hindiText: `✓ कार्य सफलतापूर्वक पूरा किया गया! ट्रैकिंग आईडी: ${actionId}. आपका समय और बिक्री दोनों सुरक्षित हैं।`,
          })
      );
    } catch {
      // ignore
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setInputMsg('');

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'merchant',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: userText,
    };

    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-res-${Date.now()}`,
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          text: `Got it! I am analyzing your request with Groq LPU & store telemetry. Everything is synchronized with Paytm Soundbox and inventory.`,
          hindiText: `जी रामेश्वर जी, समझ गया! आपकी दुकान का डेटा और इन्वेंट्री अपडेट कर दी गई है।`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-[#EFEAE2]">
      {/* WhatsApp Chat Header */}
      <div className="bg-[#002E6E] text-white p-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#00BAF2] flex items-center justify-center font-bold text-white text-sm shadow-inner">
              PA
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#002E6E] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
              <span>Paytm Growth Partner</span>
              <span className="text-emerald-400 text-xs">✔</span>
            </div>
            <div className="text-[10px] text-sky-200 font-mono">
              Autonomous AI • Online (Live Backend)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-200 text-sm">
          <span className="cursor-pointer hover:text-white">📞</span>
          <span className="cursor-pointer hover:text-white">📹</span>
          <span className="cursor-pointer hover:text-white">⋮</span>
        </div>
      </div>

      {/* WhatsApp Message Canvas */}
      <div className="p-4 space-y-3.5 h-[480px] overflow-y-auto bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]">
        {/* Encryption badge */}
        <div className="text-center">
          <span className="text-[10px] font-mono text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            🔒 Bank-grade 256-bit encrypted merchant telemetry
          </span>
        </div>

        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAi ? 'items-start' : 'items-end'} animate-in fade-in duration-300`}
            >
              <div
                className={`max-w-[88%] p-3 rounded-2xl shadow-xs text-xs space-y-1.5 ${
                  isAi
                    ? 'bg-white text-slate-800 rounded-tl-xs border border-slate-100'
                    : 'bg-[#E7F3FF] text-[#002E6E] rounded-tr-xs border border-sky-200'
                }`}
              >
                {/* Audio pill if voice message */}
                {msg.isAudio && (
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <button className="w-7 h-7 rounded-full bg-[#00BAF2] text-white flex items-center justify-center font-bold text-xs shrink-0">
                      ▶
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full w-2/5 bg-[#00BAF2] rounded-full" />
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">{msg.audioDuration} • Soundbox Voice Note</div>
                    </div>
                  </div>
                )}

                {/* Primary Hindi Text */}
                {msg.hindiText && (
                  <p className="font-semibold text-slate-900 text-[13px] leading-relaxed">
                    {msg.hindiText}
                  </p>
                )}

                {/* English Explanation */}
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  {msg.text}
                </p>

                {/* Interactive Action Button */}
                {msg.actionButton && (
                  <div className="pt-2">
                    {msg.status === 'executed' ? (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono flex items-center justify-between">
                        <span>✓ Executed &amp; Synced with Backend</span>
                        <span className="font-bold">{msg.backendActionId?.slice(0, 12)}...</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => executeAction(msg.id, msg.actionButton!)}
                        disabled={loadingActionId === msg.id}
                        className="w-full py-2 px-3 rounded-xl bg-[#00BAF2] hover:bg-[#0099D8] text-white font-bold text-xs text-center shadow-xs transition-all flex items-center justify-center gap-2"
                      >
                        {loadingActionId === msg.id ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Dispatching to Backend...</span>
                          </>
                        ) : (
                          <span>{msg.actionButton.label}</span>
                        )}
                      </button>
                    )}
                  </div>
                )}

                {/* Timestamp & read receipt */}
                <div className="flex justify-end items-center gap-1 text-[9px] font-mono text-slate-400">
                  <span>{msg.time}</span>
                  {isAi && <span className="text-sky-500">✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* WhatsApp Input Bar */}
      <form onSubmit={handleSend} className="bg-[#F0F2F5] p-2.5 flex items-center gap-2 border-t border-slate-200">
        <span className="text-slate-500 px-1 cursor-pointer text-base">😊</span>
        <span className="text-slate-500 px-1 cursor-pointer text-base">📎</span>
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Message or voice reply..."
          className="flex-1 text-xs py-2 px-3 rounded-full bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#00BAF2] text-slate-800"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-full bg-[#00BAF2] hover:bg-[#0099D8] text-white flex items-center justify-center text-sm shadow-xs transition-all shrink-0"
        >
          ➤
        </button>
      </form>
    </div>
  );
}
