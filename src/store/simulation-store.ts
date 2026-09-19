import { create } from 'zustand';
import {
  AgentId,
  MerchantHealthScoreData,
  LostRevenueData,
  Recommendation,
  SupplierInvoice,
  ShelfAngleScan,
  DailyTimelineStep,
  ExecutedActionLog,
  RoiSimulationParams,
  RoiSimulationResults,
} from '@/types';
import {
  INITIAL_HEALTH_SCORE,
  INITIAL_LOST_REVENUE,
  INITIAL_RECOMMENDATIONS,
  MOCK_INVOICES,
  MOCK_SHELF_SCANS,
  DAILY_TIMELINE,
  INITIAL_EXECUTED_LOGS,
} from '@/data/mockData';

interface WhatsAppMessage {
  id: string;
  sender: 'agent' | 'merchant';
  timestamp: string;
  text: string;
  badge?: string;
  options?: string[];
}

interface SimulationStore {
  // Mode & Navigation
  isJudgeMode: boolean;
  setJudgeMode: (enabled: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Merchant Health & Lost Revenue
  healthScore: MerchantHealthScoreData;
  lostRevenue: LostRevenueData;
  recommendations: Recommendation[];
  selectedRecommendationForWhy: Recommendation | null;
  setSelectedRecommendationForWhy: (rec: Recommendation | null) => void;

  // Invoices & OCR
  invoices: SupplierInvoice[];
  activeInvoiceId: string;
  setActiveInvoiceId: (id: string) => void;
  isScanningInvoice: boolean;
  triggerInvoiceScan: (invoiceId: string) => void;

  // Shelf Vision
  shelfScans: ShelfAngleScan[];
  activeShelfAngle: 'top_rack' | 'eye_level' | 'bottom_rack';
  setActiveShelfAngle: (angle: 'top_rack' | 'eye_level' | 'bottom_rack') => void;
  isAnalyzingShelves: boolean;
  triggerShelfAnalysis: () => void;

  // Daily Timeline
  timeline: DailyTimelineStep[];
  activeTimelineIndex: number;
  setActiveTimelineIndex: (index: number) => void;

  // Execution & Logs
  executedLogs: ExecutedActionLog[];
  executeRecommendation: (recId: string) => void;

  // Soundbox Voice Engine
  isPlayingSoundboxVoice: boolean;
  activeSoundboxLanguage: 'hi' | 'en';
  playSoundboxVoice: (lang?: 'hi' | 'en') => void;
  stopSoundboxVoice: () => void;

  // WhatsApp Simulator
  whatsappMessages: WhatsAppMessage[];
  sendMerchantReply: (text: string) => void;

  // ROI Calculator
  roiParams: RoiSimulationParams;
  setRoiParams: (params: Partial<RoiSimulationParams>) => void;
  getRoiResults: () => RoiSimulationResults;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  isJudgeMode: false,
  setJudgeMode: (enabled) => set({ isJudgeMode: enabled }),
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),

  healthScore: INITIAL_HEALTH_SCORE,
  lostRevenue: INITIAL_LOST_REVENUE,
  recommendations: INITIAL_RECOMMENDATIONS,
  selectedRecommendationForWhy: null,
  setSelectedRecommendationForWhy: (rec) => set({ selectedRecommendationForWhy: rec }),

  invoices: MOCK_INVOICES,
  activeInvoiceId: MOCK_INVOICES[0].id,
  setActiveInvoiceId: (id) => set({ activeInvoiceId: id }),
  isScanningInvoice: false,
  triggerInvoiceScan: (invoiceId) => {
    set({ isScanningInvoice: true });
    setTimeout(() => {
      set((state) => ({
        isScanningInvoice: false,
        activeInvoiceId: invoiceId,
        executedLogs: [
          {
            id: `scan-${Date.now()}`,
            timestamp: 'Just now',
            agentId: 'inventory',
            agentName: 'Supplier Bill OCR Agent',
            actionTitle: 'Parsed and Verified Invoice Line Items with 98.4% Confidence',
            channel: 'Supplier PO',
            status: 'Completed',
            outcome: 'Restock records updated into working capital register',
          },
          ...state.executedLogs,
        ],
      }));
    }, 900);
  },

  shelfScans: MOCK_SHELF_SCANS,
  activeShelfAngle: 'eye_level',
  setActiveShelfAngle: (angle) => set({ activeShelfAngle: angle }),
  isAnalyzingShelves: false,
  triggerShelfAnalysis: () => {
    set({ isAnalyzingShelves: true });
    setTimeout(() => {
      set((state) => ({
        isAnalyzingShelves: false,
        executedLogs: [
          {
            id: `shelf-${Date.now()}`,
            timestamp: 'Just now',
            agentId: 'inventory',
            agentName: 'Shelf Vision AI Agent',
            actionTitle: 'Re-analyzed 3 Camera Feeds (YOLOv10 + Grounding DINO)',
            channel: 'Soundbox',
            status: 'Completed',
            outcome: 'Flagged 2 critically low items (<20% threshold)',
          },
          ...state.executedLogs,
        ],
      }));
    }, 1200);
  },

  timeline: DAILY_TIMELINE,
  activeTimelineIndex: 0,
  setActiveTimelineIndex: (index) => set({ activeTimelineIndex: index }),

  executedLogs: INITIAL_EXECUTED_LOGS,
  executeRecommendation: (recId) => {
    const rec = get().recommendations.find((r) => r.id === recId);
    if (!rec || rec.executed) return;

    set((state) => ({
      recommendations: state.recommendations.map((r) =>
        r.id === recId ? { ...r, executed: true } : r
      ),
      executedLogs: [
        {
          id: `exec-${Date.now()}`,
          timestamp: 'Just now',
          agentId: rec.agentId,
          agentName: rec.agentName,
          actionTitle: `Executed: ${rec.title}`,
          channel: rec.actionPayload.channel === 'Distributor PO' ? 'Supplier PO' : rec.actionPayload.channel as any,
          status: 'Completed',
          outcome: `Action successfully dispatched via ${rec.actionPayload.channel}. Expected upside: ${rec.impactBadge}`,
        },
        ...state.executedLogs,
      ],
      whatsappMessages: [
        ...state.whatsappMessages,
        {
          id: `auto-exec-${Date.now()}`,
          sender: 'agent',
          timestamp: 'Just now',
          badge: '⚡ Autopilot Execution',
          text: `✅ Action Confirmed: ${rec.title}\n\n${rec.actionPayload.preview}\n\n*Status:* Successfully queued via ${rec.actionPayload.channel}.`,
        },
      ],
    }));
  },

  isPlayingSoundboxVoice: false,
  activeSoundboxLanguage: 'hi',
  playSoundboxVoice: (lang = 'hi') => {
    const currentTimeline = get().timeline[get().activeTimelineIndex];
    const textToSpeak = lang === 'hi' ? currentTimeline.soundboxVoiceHindi : currentTimeline.soundboxVoiceEnglish;

    set({ isPlayingSoundboxVoice: true, activeSoundboxLanguage: lang });

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 1.0;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        set({ isPlayingSoundboxVoice: false });
      };
      utterance.onerror = () => {
        set({ isPlayingSoundboxVoice: false });
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        set({ isPlayingSoundboxVoice: false });
      }, 5000);
    }
  },
  stopSoundboxVoice: () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    set({ isPlayingSoundboxVoice: false });
  },

  whatsappMessages: [
    {
      id: 'msg-1',
      sender: 'agent',
      timestamp: '07:30 AM',
      badge: '🌅 Morning Briefing',
      text: 'Good Morning Ramesh Ji!\n\nYesterday collection: *₹17,500* (102 UPI payments).\nTarget today: *₹19,200*.\n\n⚠️ *Alert:* Amul Butter stock critically low (4 packs left). Expected evening surge +45%.',
      options: ['Approve Butter PO (3 cartons)', 'View Revenue Forecast', 'Remind Later'],
    },
    {
      id: 'msg-2',
      sender: 'agent',
      timestamp: '01:15 PM',
      badge: '🧾 Supplier Bill Ingested',
      text: 'Metro Wholesale bill received via photo. Ingested 5 products (₹14,850 total). All margin calculations updated automatically.',
    },
  ],
  sendMerchantReply: (text) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMerchantMsg: WhatsAppMessage = {
      id: `m-${Date.now()}`,
      sender: 'merchant',
      timestamp: now,
      text,
    };

    set((state) => ({
      whatsappMessages: [...state.whatsappMessages, newMerchantMsg],
    }));

    // Auto-respond with simulated Groq / Qwen intelligence
    setTimeout(() => {
      let replyText = 'Received, Ramesh Ji! Updating your store ledger and agent directives.';
      let badge = '🤖 Growth Agent Response';

      const lower = text.toLowerCase();
      if (lower.includes('butter') || lower.includes('approve') || lower.includes('po')) {
        replyText = '✅ *PO Dispatched to Raju Distributor!*\n3 cartons Amul Butter (500g) ordered for ₹6,120. Expected delivery by 3:30 PM today.';
        badge = '⚡ PO Confirmed';
        // mark rec-1 as executed
        get().executeRecommendation('rec-1');
      } else if (lower.includes('forecast') || lower.includes('revenue')) {
        replyText = '📈 *Revenue Forecast Today:*\nProjected: *₹19,200*\nPeak Hours: *6:00 PM - 8:30 PM*\nWeather Impact: Clear afternoon, slight evening cloud cover (+8% hot beverage demand).';
        badge = '📈 Demand Intelligence';
      } else if (lower.includes('offer') || lower.includes('campaign')) {
        replyText = '🎯 *Flash Combo Campaign Activated!*\n84 society residents sent 5% off voucher on Tea + Biscuits combo.';
        badge = '🎯 Campaign Broadcast';
        get().executeRecommendation('rec-2');
      }

      set((state) => ({
        whatsappMessages: [
          ...state.whatsappMessages,
          {
            id: `a-${Date.now()}`,
            sender: 'agent',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            badge,
            text: replyText,
          },
        ],
      }));
    }, 800);
  },

  roiParams: {
    businessType: 'kirana',
    monthlyRevenue: 450000,
    avgBasketSize: 220,
    supplierCount: 6,
    repeatCustomerRate: 64,
  },
  setRoiParams: (params) =>
    set((state) => ({
      roiParams: { ...state.roiParams, ...params },
    })),
  getRoiResults: () => {
    const p = get().roiParams;
    const monthlyRev = p.monthlyRevenue;

    // Projected revenue uplift is ~24.5% based on demand forecasting + stockout prevention
    const extraRevenue = monthlyRev * 0.245;
    const grossMargin = 0.20; // 20% average Kirana gross margin
    const extraMonthlyProfit = Math.round(extraRevenue * grossMargin);
    const annualProfitIncrease = extraMonthlyProfit * 12;

    // Stockout reduction rate: ~42%
    const stockoutReductionRate = 42;

    // Capital unlocked from dead stock: ~14% of monthly inventory turnover
    const unlockedWorkingCapital = Math.round(monthlyRev * 0.14);

    // Retention lift: +35%
    const retentionLiftPercent = 35;

    // Time saved weekly: ~14 hours (no manual ledger, no POS barcoding, automated POs)
    const hoursSavedWeekly = 14;

    // Payback days: instant since Paytm Merchant Agent operates as zero-hardware companion
    const paybackDays = 1;

    return {
      extraMonthlyProfit,
      annualProfitIncrease,
      stockoutReductionRate,
      unlockedWorkingCapital,
      retentionLiftPercent,
      hoursSavedWeekly,
      paybackDays,
    };
  },
}));
