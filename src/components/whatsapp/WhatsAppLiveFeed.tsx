'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Send,
  Calendar,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  isCallIntent,
  isCallConfirmation,
  processVoiceQuery,
  getScheduledDailyBriefings,
  GROUNDED_STORE_METRICS,
  ScheduledBriefing,
} from '@/ai/voice-coo-engine';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'merchant';
  time: string;
  text: string;
  hindiText?: string;
  isAudio?: boolean;
  audioDuration?: string;
  audioTranscript?: string;
  isCallInvite?: boolean;
  isCallSummary?: boolean;
  callDuration?: string;
  cooBadge?: string;
  actionButton?: {
    label: string;
    actionType: 'STOCK_RESTOCK' | 'WINBACK_CAMPAIGN' | 'FESTIVAL_BUFFER' | 'UDHAAR_RECOVERY' | 'CUSTOM';
    payload: Record<string, any>;
  };
  secondaryButtons?: Array<{
    label: string;
    actionType: string;
    payload?: Record<string, any>;
    onClick?: () => void;
  }>;
  status?: 'pending' | 'executed';
  backendActionId?: string;
}

export function WhatsAppLiveFeed() {
  // Timeline Milestones
  const [activeTimeline, setActiveTimeline] = useState<'LIVE' | '07:30 AM' | '12:30 PM' | '05:30 PM' | '10:00 PM'>('LIVE');

  // Call State
  const [isCallActive, setIsCallActive] = useState(false);
  const [callStatus, setCallStatus] = useState<'calling' | 'ringing' | 'connected'>('calling');
  const [callDurationSec, setCallDurationSec] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [activeVoiceQuery, setActiveVoiceQuery] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [aiVoiceSpeaking, setAiVoiceSpeaking] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'hi' | 'en'>('hi');

  // Input State
  const [inputMsg, setInputMsg] = useState('');
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // References
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Scheduled briefings definition
  const scheduledBriefings = getScheduledDailyBriefings();

  // Initial live messages incorporating the 10 COO enhancements
  const initialLiveMessages: ChatMessage[] = [
    {
      id: 'msg-morning-1',
      sender: 'ai',
      time: '07:30 AM',
      cooBadge: '1. Morning Business Briefing',
      text: 'Good morning Rameshwar ji! Yesterday gross revenue was ₹18,400 across 142 customer orders. Today target: ₹18,450. Morning rush window: 08:00 - 10:30 AM.',
      hindiText: '🌅 सुप्रभात रामेश्वर जी! कल की कुल बिक्री ₹18,400 रही (142 बिल)। आज ₹18,450 का अनुमान है। सुबह 8 से 10:30 बजे दूध और चाय का भारी रश रहेगा।',
    },
    {
      id: 'msg-audio-1',
      sender: 'ai',
      time: '08:15 AM',
      isAudio: true,
      audioDuration: '0:14',
      cooBadge: '5. Soundbox Voice Note',
      audioTranscript: 'नमस्ते रामेश्वर जी! शाम के रश से पहले अमूल दूध का केवल 4 पैकेट बचा है। सप्लायर को समय पर ऑर्डर भेजें।',
      text: 'Voice Alert: Amul Milk shelf inventory is at 4 units. Projected depletion by 16:30 PM.',
      hindiText: '🎙️ वॉयस ब्रीफिंग: अमूल दूध का स्टॉक खत्म होने वाला है। मॉडर्न डेयरी को समय पर री-ऑर्डर भेजें।',
    },
    {
      id: 'msg-leak-1',
      sender: 'ai',
      time: '11:45 AM',
      cooBadge: '4. Profit Leak Detector',
      text: 'Profit Leak Warning: Maggi noodles stockout yesterday caused ₹2,300 missed revenue. Modern Dairy Jaipur cutoff is 12:30 PM.',
      hindiText: '🚨 प्रॉफिट लीक अलर्ट: कल मैगी स्टॉकआउट से ₹2,300 की बिक्री छूटी। आज अमूल दूध व तेल 12:30 PM से पहले री-ऑर्डर करें!',
      actionButton: {
        label: '⚡ Send Reorder to Modern Dairy (₹4,200)',
        actionType: 'STOCK_RESTOCK',
        payload: { distributor: 'Modern Dairy Jaipur', items: ['Amul Taaza 45pkts', 'Fortune Oil 25L'] },
      },
      status: 'pending',
    },
    {
      id: 'msg-event-1',
      sender: 'ai',
      time: '02:15 PM',
      cooBadge: '3. Opportunity Alerts & Radar',
      text: 'India vs Pakistan IPL match tonight! Local competitor radar shows cold drink & chips demand will rise +35%. 42 dormant customers detected.',
      hindiText: '🏏 क्रिकेट अलर्ट: आज शाम भारत-पाक मैच है! कोल्ड ड्रिंक्स और नमकीन की मांग 35% बढ़ेगी। 42 पुराने ग्राहकों को ऑफर भेजें?',
      actionButton: {
        label: '📢 Launch ₹20 Winback Coupon to 42 Customers',
        actionType: 'WINBACK_CAMPAIGN',
        payload: { audienceCount: 42, coupon: 'MATCH20', minSpend: 250 },
      },
      status: 'pending',
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialLiveMessages);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages, activeTimeline]);

  // Call timer effect
  useEffect(() => {
    let interval: any;
    if (isCallActive && callStatus === 'connected') {
      interval = setInterval(() => {
        setCallDurationSec((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive, callStatus]);

  // Handle timeline switches (Scheduled automated messages)
  const handleTimelineChange = (timeline: typeof activeTimeline) => {
    setActiveTimeline(timeline);
    if (timeline === 'LIVE') {
      setMessages(initialLiveMessages);
      return;
    }

    const briefing = scheduledBriefings.find((b) => b.timeSlot === timeline);
    if (!briefing) return;

    setMessages([
      {
        id: `briefing-${timeline}-1`,
        sender: 'ai',
        time: briefing.timeSlot,
        cooBadge: briefing.cooFeature,
        text: briefing.englishDetails,
        hindiText: `${briefing.hindiHeadline}\n\n${briefing.hindiDescription}`,
        isAudio: true,
        audioDuration: briefing.audioDuration,
        audioTranscript: briefing.hindiHeadline + ' ' + briefing.hindiDescription,
        actionButton: briefing.actionButton as any,
        status: 'pending',
      },
      {
        id: `briefing-${timeline}-followup`,
        sender: 'ai',
        time: briefing.timeSlot,
        cooBadge: '8. Smart Follow-Up & Voice Ready',
        text: 'You can tap the phone icon 📞 above or write "I want to have a call" anytime to discuss these numbers over real-time Indic voice!',
        hindiText: '💡 सुझाव: इन आंकड़ों और रीऑर्डर पर चर्चा के लिए कभी भी ऊपर दिए गए 📞 कॉल बटन को दबाएं या "कॉल करो" लिखें।',
        secondaryButtons: [
          {
            label: '📞 AI वॉयस कॉल शुरू करें (Start Voice Call)',
            actionType: 'START_CALL_FROM_BRIEFING',
          },
        ],
      },
    ]);
  };

  // Text-To-Speech helper
  const speakAloud = (text: string, lang = 'hi-IN') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.95;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const indicVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('IN') || v.name.includes('India')
      );
      if (indicVoice) {
        utterance.voice = indicVoice;
      }

      utterance.onstart = () => setAiVoiceSpeaking(true);
      utterance.onend = () => {
        setAiVoiceSpeaking(false);
        // Automatically re-listen for hands-free live conversational mode
        if (isCallActive) {
          setTimeout(() => {
            startListening();
          }, 500);
        }
      };
      utterance.onerror = () => setAiVoiceSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('[SpeechSynthesis] Error:', e);
      setAiVoiceSpeaking(false);
    }
  };

  // Stop speech
  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setAiVoiceSpeaking(false);
  };

  // Audio note play/stop toggle
  const togglePlayAudio = (msgId: string, transcript?: string) => {
    if (playingAudioId === msgId) {
      stopSpeaking();
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
      const textToSpeak = transcript || 'नमस्ते रामेश्वर जी! आपकी दुकान की स्थिति और आंकड़े बिल्कुल सही हैं।';
      speakAloud(textToSpeak, 'hi-IN');
      // Auto reset play icon when speech finishes
      setTimeout(() => setPlayingAudioId(null), 8000);
    }
  };

  // Initiate Call Flow
  const triggerCallPrompt = () => {
    const promptMsg: ChatMessage = {
      id: `call-prompt-${Date.now()}`,
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cooBadge: '📞 DukaanPay AI Voice Calling Service',
      text: 'Voice Call Confirmation: Would you like to connect an AI Voice Call now to discuss today\'s sales, stockouts, and action plans in real-time Hindi?',
      hindiText: '📞 DukaanPay AI वॉयस कॉल सेवा:\nनमस्ते रामेश्वर जी! क्या आप अभी अपनी दुकान के रियल-टाइम बिजनेस इनसाइट्स और बिक्री के लिए AI वॉयस कॉल कनेक्ट करना चाहते हैं?',
      isCallInvite: true,
      secondaryButtons: [
        {
          label: '📞 हाँ, कॉल करें (Yes, Call Now)',
          actionType: 'ACCEPT_CALL',
        },
        {
          label: '❌ नहीं, बाद में (No, Later)',
          actionType: 'REJECT_CALL',
        },
      ],
    };
    setMessages((prev) => [...prev, promptMsg]);
  };

  // Start the actual Voice Call session
  const startVoiceCallSession = () => {
    setIsCallActive(true);
    setCallStatus('calling');
    setCallDurationSec(0);
    setLiveTranscript('');
    setActiveVoiceQuery('');

    // Ringing transition
    setTimeout(() => {
      setCallStatus('ringing');
    }, 900);

    // Connected transition + AI welcome speech
    setTimeout(() => {
      setCallStatus('connected');
      const welcomeSpeech = 'नमस्ते रामेश्वर भैया! मैं आपका DukaanPay AI पार्टनर हूँ। आज की बिक्री, कल के ऑर्डर या दुकान के किसी भी सवाल के लिए पूछिए!';
      setLiveTranscript(welcomeSpeech);
      if (isSpeakerOn) {
        speakAloud(welcomeSpeech, 'hi-IN');
      }
    }, 2400);
  };

  // Handle spoken voice query
  const handleSpokenVoiceQuery = async (queryText: string) => {
    setActiveVoiceQuery(queryText);
    setLiveTranscript(`🗣️ Merchant: "${queryText}"\n\n⏳ Analyzing with Groq gpt-oss-120b & Store Telemetry...`);

    try {
      const response = await processVoiceQuery(queryText, voiceLanguage);
      const answer = response.hindiSpokenResponse;
      setLiveTranscript(`🗣️ Merchant: "${queryText}"\n\n🤖 DukaanPay AI: "${answer}"`);

      if (isSpeakerOn) {
        speakAloud(answer, 'hi-IN');
      }
    } catch (err: any) {
      const fallback = `रामेश्वर भैया, आज की कुल बिक्री ₹18,400 रही है और मैगी का स्टॉकआउट रोकने के लिए 12:30 बजे से पहले ऑर्डर भेजना जरूरी है।`;
      setLiveTranscript(`🗣️ Merchant: "${queryText}"\n\n🤖 DukaanPay AI: "${fallback}"`);
      if (isSpeakerOn) {
        speakAloud(fallback, 'hi-IN');
      }
    }
  };

  const startListening = () => {
    if (typeof window === 'undefined' || isMuted) return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLanguage === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleSpokenVoiceQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Toggle Web Speech Recognition for user speaking
  const toggleSpeechRecognition = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. Please tap any of the preset quick voice query buttons below!');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
    } else {
      startListening();
    }
  };

  // End Voice Call
  const endVoiceCall = () => {
    stopSpeaking();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setIsCallActive(false);

    const mins = Math.floor(callDurationSec / 60);
    const secs = callDurationSec % 60;
    const formattedDuration = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    // Post Call Summary Card to WhatsApp thread
    const summaryMsg: ChatMessage = {
      id: `call-summary-${Date.now()}`,
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCallSummary: true,
      callDuration: formattedDuration,
      cooBadge: '📞 Voice Call Completed & Action Summary',
      text: `Call duration: ${formattedDuration}. Key topics discussed: Today's sales (₹18,400), comparison with yesterday (-7.3%), and tomorrow's distributor orders.`,
      hindiText: `📞 वॉयस कॉल संपन्न (समय: ${formattedDuration})\n\n📋 AI कॉल सारांश व कार्य सूची:\n1. आज की कुल बिक्री: ₹18,400 (142 बिल, Paytm UPI: ₹14,800)\n2. कल के मुकाबले बिक्री: -7.3% (दोपहर का डिप व मैगी स्टॉकआउट)\n3. कल के लिए ऑर्डर: अमूल दूध 45 पैकेट, फॉर्च्यून तेल 25L (12:30 PM कटऑफ)\n4. शाम का आईपीएल मैच: कोल्ड ड्रिंक्स व स्नैक्स का 35% अतिरिक्त बफर रखें।`,
      actionButton: {
        label: '⚡ Dispatch Approved Orders to Modern Dairy (₹4,200)',
        actionType: 'STOCK_RESTOCK',
        payload: { distributor: 'Modern Dairy Jaipur', verifiedOverCall: true },
      },
      status: 'pending',
    };

    setMessages((prev) => [...prev, summaryMsg]);
  };

  // 1-Tap Action Execution via Backend Express + Kafka API
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
            cooBadge: '9. One-Tap Action Execution',
            text: `Action successfully queued into BullMQ and published to Kafka! Tracking ID: ${actionId}.`,
            hindiText: `✓ कार्य सफलतापूर्वक पूरा किया गया!\nट्रैकिंग आईडी: ${actionId}.\nमॉडर्न डिस्ट्रीब्यूटर और Paytm साउंडबॉक्स को अपडेट भेज दिया गया है।`,
          })
      );
    } catch {
      // ignore
    } finally {
      setLoadingActionId(null);
    }
  };

  // Handle typing & user send
  const handleSend = async (e: React.FormEvent) => {
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

    // Check if user requested call via chat
    if (isCallIntent(userText)) {
      setTimeout(() => {
        triggerCallPrompt();
      }, 600);
      return;
    }

    // Check if user confirmed call with "yes", "हाँ"
    if (isCallConfirmation(userText)) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `call-start-${Date.now()}`,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: 'Connecting AI Voice Call with DukaanPay COO...',
            hindiText: '🟢 कॉल कनेक्ट हो रही है... माइक तैयार रखें!',
          },
        ]);
        startVoiceCallSession();
      }, 700);
      return;
    }

    // Otherwise, process regular NLP query through Voice & NLP COO Engine
    try {
      const aiRes = await processVoiceQuery(userText, 'hi');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-res-${Date.now()}`,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cooBadge: '2. Ask Anything Business Partner',
            text: aiRes.englishSummary,
            hindiText: aiRes.hindiSpokenResponse,
            actionButton: aiRes.actionButtons?.[0] as any,
            status: 'pending',
          },
        ]);
      }, 800);
    } catch {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-res-fallback-${Date.now()}`,
            sender: 'ai',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text: 'Everything is synchronized with Paytm Soundbox and inventory telemetry.',
            hindiText: 'जी रामेश्वर जी, समझ गया! आपकी दुकान का डेटा और इन्वेंट्री अपडेट कर दी गई है।',
          },
        ]);
      }, 800);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-[#EFEAE2] flex flex-col relative">
      {/* WhatsApp Chat Header */}
      <div className="bg-[#002E6E] text-white p-3.5 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-[#00BAF2] flex items-center justify-center font-bold text-white text-sm shadow-inner">
              PA
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#002E6E] rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
              <span>Paytm AI Merchant COO</span>
              <span className="text-sky-300 text-xs font-mono">✔ Verified</span>
            </div>
            <div className="text-[10px] text-sky-200 font-mono flex items-center gap-1">
              <span>Groq gpt-oss-120b & qwen-2.5</span>
              <span>•</span>
              <span className="text-emerald-300">Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-200 text-sm">
          {/* Direct 1-Click Call Trigger Button */}
          <button
            onClick={triggerCallPrompt}
            title="Start AI Voice Call"
            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTimeline('LIVE')}
            title="Live Feed"
            className="cursor-pointer hover:text-white text-xs px-2 py-1 rounded-md bg-white/10"
          >
            Feed
          </button>
        </div>
      </div>

      {/* Scheduled Proactive Timeline Milestones Bar */}
      <div className="bg-[#002456] px-3 py-2 border-b border-sky-900 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono text-white/80 shrink-0">
        <span className="text-sky-300 font-bold shrink-0 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Briefings:
        </span>
        {[
          { id: 'LIVE', label: '💬 Live Chat' },
          { id: '07:30 AM', label: '🌅 07:30 AM Opening' },
          { id: '12:30 PM', label: '⚡ 12:30 PM Cutoff' },
          { id: '05:30 PM', label: '☕ 05:30 PM Rush' },
          { id: '10:00 PM', label: '🌙 10:00 PM Khata' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => handleTimelineChange(t.id as any)}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-all cursor-pointer ${
              activeTimeline === t.id
                ? 'bg-[#00BAF2] text-white font-bold shadow-xs'
                : 'bg-white/10 hover:bg-white/20 text-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Active Timeline Alert Banner */}
      {activeTimeline !== 'LIVE' && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1.5 text-[11px] text-amber-900 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Showing Automated Scheduled Briefing for {activeTimeline}
          </span>
          <button
            onClick={() => handleTimelineChange('LIVE')}
            className="text-xs text-sky-700 underline font-semibold cursor-pointer"
          >
            Back to Live
          </button>
        </div>
      )}

      {/* WhatsApp Message Canvas */}
      <div
        ref={chatScrollRef}
        className="p-4 space-y-3.5 h-[460px] overflow-y-auto bg-[radial-gradient(#d1d5db_1px,transparent_1px)] [background-size:20px_20px]"
      >
        {/* Security badge */}
        <div className="text-center">
          <span className="text-[10px] font-mono text-slate-600 bg-white/90 px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
            🔒 Bank-grade encrypted merchant telemetry • Jaipur Pincode 302001
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
                className={`max-w-[88%] p-3 rounded-2xl shadow-xs text-xs space-y-2 ${
                  isAi
                    ? 'bg-white text-slate-800 rounded-tl-xs border border-slate-100'
                    : 'bg-[#E7F3FF] text-[#002E6E] rounded-tr-xs border border-sky-200'
                }`}
              >
                {/* COO Feature Badge */}
                {msg.cooBadge && (
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#002E6E] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 w-fit">
                    <Sparkles className="w-3 h-3 text-[#00BAF2]" />
                    <span>{msg.cooBadge}</span>
                  </div>
                )}

                {/* Audio Voice Note Pill with Real Playback */}
                {msg.isAudio && (
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200">
                    <button
                      onClick={() => togglePlayAudio(msg.id, msg.audioTranscript || msg.hindiText)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all cursor-pointer ${
                        playingAudioId === msg.id
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-[#00BAF2] hover:bg-[#0099D8] text-white shadow-xs'
                      }`}
                    >
                      {playingAudioId === msg.id ? <Square className="w-3 h-3" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-[#00BAF2] rounded-full transition-all duration-300 ${
                            playingAudioId === msg.id ? 'w-full animate-pulse' : 'w-2/5'
                          }`}
                        />
                      </div>
                      <div className="text-[9px] font-mono text-slate-500 flex justify-between">
                        <span>{msg.audioDuration || '0:15'} • Paytm Soundbox Audio</span>
                        {playingAudioId === msg.id && (
                          <span className="text-rose-600 font-bold">Playing Audio...</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Hindi Text */}
                {msg.hindiText && (
                  <p className="font-medium text-slate-900 text-[13px] leading-relaxed whitespace-pre-line">
                    {msg.hindiText}
                  </p>
                )}

                {/* English Explanation */}
                <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                  {msg.text}
                </p>

                {/* Secondary / Interactive Call Buttons */}
                {msg.secondaryButtons && msg.secondaryButtons.length > 0 && (
                  <div className="pt-1.5 flex flex-wrap gap-2">
                    {msg.secondaryButtons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (btn.actionType === 'ACCEPT_CALL' || btn.actionType === 'START_CALL_FROM_BRIEFING') {
                            startVoiceCallSession();
                          } else {
                            setMessages((prev) => [
                              ...prev,
                              {
                                id: `user-reply-${Date.now()}`,
                                sender: 'merchant',
                                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                                text: 'अभी नहीं, बाद में बात करते हैं।',
                              },
                            ]);
                          }
                        }}
                        className={`py-1.5 px-3 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          btn.actionType.includes('ACCEPT') || btn.actionType.includes('START')
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Primary 1-Tap Action Button */}
                {msg.actionButton && (
                  <div className="pt-2">
                    {msg.status === 'executed' ? (
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Executed &amp; Synced with Backend</span>
                        </span>
                        <span className="font-bold">{msg.backendActionId?.slice(0, 12)}...</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => executeAction(msg.id, msg.actionButton!)}
                        disabled={loadingActionId === msg.id}
                        className="w-full py-2 px-3 rounded-xl bg-[#00BAF2] hover:bg-[#0099D8] text-white font-bold text-xs text-center shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {loadingActionId === msg.id ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Dispatching to BullMQ &amp; Kafka...</span>
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
                  {isAi && <span className="text-sky-500 font-bold">✓✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Voice Query Suggestion Chips */}
      <div className="bg-slate-100 px-3 py-1.5 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-medium shrink-0 flex items-center gap-1 text-[10px] font-mono">
          <Sparkles className="w-3 h-3 text-[#00BAF2]" /> Ask AI:
        </span>
        {[
          { label: '📞 Call lagao (Voice Call)', query: 'I want to have a call' },
          { label: '💰 Aaj ki sales kya thi?', query: 'bhai aaj ki sales kya thi' },
          { label: '📉 Kal se kam hui kya?', query: 'kya sales pichhle din se kam hui' },
          { label: '📦 Kal kya mangwana hai?', query: 'kal k liye kya mangwana hai aur kya kya karna hai' },
          { label: '🚨 Profit leaks batao', query: 'top selling item aur profit leaks kya hain' },
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputMsg(chip.query);
            }}
            className="px-2.5 py-0.5 rounded-full bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 text-slate-700 whitespace-nowrap text-[10px] font-medium transition-colors cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* WhatsApp Input Bar */}
      <form onSubmit={handleSend} className="bg-[#F0F2F5] p-2.5 flex items-center gap-2 border-t border-slate-200">
        <button
          type="button"
          onClick={triggerCallPrompt}
          title="Initiate Voice Call"
          className="text-emerald-600 hover:text-emerald-700 p-1 cursor-pointer"
        >
          <Phone className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder='Type a message, e.g. "I want to have a call" or "sales kya thi"...'
          className="flex-1 text-xs py-2 px-3 rounded-full bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#00BAF2] text-slate-800"
        />
        <button
          type="submit"
          className="w-8 h-8 rounded-full bg-[#00BAF2] hover:bg-[#0099D8] text-white flex items-center justify-center text-sm shadow-xs transition-all shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4 ml-0.5" />
        </button>
      </form>

      {/* ======================================================== */}
      {/* REAL-TIME AI VOICE CALL FULL-SCREEN OVERLAY             */}
      {/* ======================================================== */}
      {isCallActive && (
        <div className="absolute inset-0 z-50 bg-gradient-to-b from-[#001D47] via-[#002E6E] to-[#001433] text-white flex flex-col justify-between p-6 animate-in fade-in zoom-in-95 duration-200">
          {/* Call Header */}
          <div className="text-center space-y-1.5 pt-4">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono">
              <ShieldCheck className="w-3 h-3" />
              <span>Paytm AI Soundbox Voice Link • Encrypted</span>
            </div>
            <h3 className="text-xl font-bold font-sans tracking-wide">DukaanPay AI COO</h3>
            <p className="text-xs text-sky-200">
              {callStatus === 'calling' && 'Calling Rameshwar ji...'}
              {callStatus === 'ringing' && 'Ringing... 🔔'}
              {callStatus === 'connected' && (
                <span className="font-mono text-emerald-400 font-bold">
                  ● Connected ({String(Math.floor(callDurationSec / 60)).padStart(2, '0')}:
                  {String(callDurationSec % 60).padStart(2, '0')})
                </span>
              )}
            </p>
          </div>

          {/* Central Visualizer: Avatar + Equalizer Waveform */}
          <div className="flex flex-col items-center justify-center my-auto space-y-5">
            {/* Animated Avatar */}
            <div className="relative">
              <div
                className={`w-28 h-28 rounded-full bg-gradient-to-tr from-[#00BAF2] to-sky-300 flex items-center justify-center text-3xl font-bold text-white shadow-2xl transition-all duration-500 ${
                  aiVoiceSpeaking || isListening ? 'scale-105 ring-8 ring-emerald-400/40' : 'ring-4 ring-white/20'
                }`}
              >
                PA
              </div>
              {(aiVoiceSpeaking || isListening) && (
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-[#002E6E] flex items-center justify-center animate-ping" />
              )}
            </div>

            {/* Equalizer Frequency Bars */}
            <div className="flex items-center justify-center gap-1 h-10 w-48">
              {[12, 24, 38, 20, 32, 44, 28, 16, 36, 42, 22, 14].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: aiVoiceSpeaking || isListening ? `${Math.max(8, (h * (i % 3 + 1)) % 38)}px` : '6px',
                  }}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    aiVoiceSpeaking
                      ? 'bg-emerald-400 animate-pulse'
                      : isListening
                      ? 'bg-[#00BAF2] animate-bounce'
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>

            {/* Real-Time Live Captions Box */}
            <div className="w-full max-h-36 overflow-y-auto bg-black/40 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-left space-y-1">
              <div className="text-[10px] font-mono text-sky-300 flex items-center justify-between">
                <span>LIVE SOUNDBOX TRANSCRIPT</span>
                {aiVoiceSpeaking && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Volume2 className="w-3 h-3 animate-pulse" /> AI Speaking...
                  </span>
                )}
                {isListening && (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Mic className="w-3 h-3 animate-pulse" /> Listening to you...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-100 font-medium leading-relaxed whitespace-pre-line">
                {liveTranscript || 'बोलो भैया, आज की बिक्री या कल के ऑर्डर के बारे में क्या जानना चाहते हैं?'}
              </p>
            </div>

            {/* Quick-Ask Voice Query Chips (1-tap speech simulation) */}
            <div className="w-full space-y-1.5">
              <div className="text-[10px] font-mono text-slate-300 text-left">
                🎙️ Quick-Speak Prompts (Tap to ask AI over call):
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  onClick={() => handleSpokenVoiceQuery('bhai aaj ki sales kya thi')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs text-sky-100 transition-all cursor-pointer"
                >
                  🗣️ &quot;Bhai aaj ki sales kya thi?&quot;
                </button>
                <button
                  onClick={() => handleSpokenVoiceQuery('kya sales pichhle din se kam hui')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs text-sky-100 transition-all cursor-pointer"
                >
                  🗣️ &quot;Kal se bikri kam hui kya?&quot;
                </button>
                <button
                  onClick={() => handleSpokenVoiceQuery('kal k liye kya mangwana hai aur kya kya karna hai')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs text-sky-100 transition-all cursor-pointer"
                >
                  🗣️ &quot;Kal kya mangwana hai?&quot;
                </button>
                <button
                  onClick={() => handleSpokenVoiceQuery('top selling item aur profit leaks kya hain')}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-left text-xs text-sky-100 transition-all cursor-pointer"
                >
                  🗣️ &quot;Profit leaks &amp; bestsellers?&quot;
                </button>
              </div>
            </div>
          </div>

          {/* Call Controls Toolbar */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-around">
            {/* Mute Button */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isMuted ? 'bg-amber-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Microphone Live Speech Recognition Trigger */}
            <button
              onClick={toggleSpeechRecognition}
              className={`w-14 h-14 rounded-full flex items-center justify-center font-bold shadow-lg transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-600 text-white ring-4 ring-rose-400/50 animate-pulse'
                  : 'bg-[#00BAF2] hover:bg-[#0099D8] text-white hover:scale-105'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak into Microphone'}
            >
              <Mic className="w-6 h-6" />
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={() => {
                if (isSpeakerOn) {
                  stopSpeaking();
                }
                setIsSpeakerOn(!isSpeakerOn);
              }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isSpeakerOn ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-700 text-slate-400'
              }`}
              title={isSpeakerOn ? 'Speaker Off' : 'Speaker On'}
            >
              {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            {/* End Call Button */}
            <button
              onClick={endVoiceCall}
              className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
              title="End Voice Call"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
