/**
 * DukaanPay AI - Voice COO & WhatsApp Interactive Reasoning Engine
 * Powered by Groq Cloud (openai/gpt-oss-120b & qwen/qwen3.8-27b) exclusively.
 * Strictly adheres to non-banned models policy.
 *
 * Implements real-time Indic voice QA, automated daily briefings,
 * comprehensive store telemetry, and accurate answering of merchant queries.
 */

import Groq from 'groq-sdk';
import { MLClient } from '../lib/ml-client';

export interface VoiceQueryResponse {
  query: string;
  hindiSpokenResponse: string;
  englishSummary: string;
  metrics: Record<string, any>;
  actionButtons?: Array<{
    label: string;
    actionType: string;
    payload: Record<string, any>;
  }>;
  modelUsed: string;
  latencyMs: number;
}

export interface ScheduledBriefing {
  timeSlot: '07:30 AM' | '12:30 PM' | '05:30 PM' | '10:00 PM';
  milestoneTitle: string;
  hindiHeadline: string;
  hindiDescription: string;
  englishDetails: string;
  audioDuration?: string;
  cooFeature: string;
  actionButton?: {
    label: string;
    actionType: string;
    payload: Record<string, any>;
  };
  metrics: Record<string, any>;
}

// Comprehensive Grounded Kirana Store Knowledge Graph
export const KIRANA_STORE_COMPREHENSIVE_DATA = {
  storeProfile: {
    name: 'Laxmi Kirana & General Store',
    merchant: 'रामेश्वर गुप्ता (Rameshwar Gupta)',
    location: 'Shop 4, Malviya Nagar Sector 3, Jaipur, Rajasthan (302017)',
    soundboxId: 'PTM-SBOX-4G-9921 (Online, 4G VoLTE)',
  },
  salesOverview: {
    todaySalesINR: 18400,
    todayOrdersCount: 142,
    todayUpiShareINR: 14800,
    todayUpiPct: 80.4,
    todayCashShareINR: 3600,
    yesterdaySalesINR: 19850,
    yesterdayOrdersCount: 155,
    salesDeltaPercent: -7.3,
    dipReason: 'दोपहर 2 से 4 बजे कस्टमर फुटफॉल कम और मैगी व अमूल छाछ का स्टॉकआउट',
    stockoutLostRevenueINR: 2300,
  },
  inventoryByCategory: {
    snacks: [
      { name: "Lay's India's Magic Masala (50g)", stock: 10, mrp: 20, cost: 17, marginPct: 15, status: 'WARNING_LOW_STOCK', velocityPerDay: 18 },
      { name: 'Kurkure Masala Munch (90g)', stock: 18, mrp: 20, cost: 17, marginPct: 15, status: 'HEALTHY', velocityPerDay: 12 },
      { name: 'Balaji Wafers Cream & Onion', stock: 32, mrp: 10, cost: 8.2, marginPct: 18, status: 'HEALTHY', velocityPerDay: 15 },
      { name: 'Haldiram Aloo Bhujia (200g)', stock: 14, mrp: 55, cost: 46, marginPct: 16.4, status: 'HEALTHY', velocityPerDay: 6 },
      { name: 'Maggi 2-Minute Masala Noodles (70g)', stock: 0, mrp: 14, cost: 11.5, marginPct: 17.8, status: 'OUT_OF_STOCK_ALERT', lostRevenue: 2300, velocityPerDay: 14 },
      { name: 'Yippee Noodles Classic (65g)', stock: 22, mrp: 14, cost: 11.8, marginPct: 15.7, status: 'HEALTHY', velocityPerDay: 5 },
      { name: 'Parle-G Gold Biscuits (1kg)', stock: 45, mrp: 90, cost: 78, marginPct: 13.3, status: 'HEALTHY', velocityPerDay: 8 },
      { name: 'Good Day Butter Cookies', stock: 28, mrp: 30, cost: 25, marginPct: 16.7, status: 'HEALTHY', velocityPerDay: 12 },
      { name: 'Oreo Vanilla Crème (120g)', stock: 16, mrp: 35, cost: 29.5, marginPct: 15.7, status: 'HEALTHY', velocityPerDay: 6 },
      { name: 'Monaco Salted Crackers (75g)', stock: 25, mrp: 15, cost: 12.5, marginPct: 16.7, status: 'HEALTHY', velocityPerDay: 7 },
    ],
    dairy: [
      { name: 'Amul Taaza Toned Milk (500ml)', stock: 45, mrp: 27, cost: 24.5, marginPct: 9.3, reorderCutoff: '12:30 PM', supplier: 'Modern Dairy Jaipur' },
      { name: 'Amul Salted Butter (500g)', stock: 32, mrp: 275, cost: 252, marginPct: 8.4, status: 'HEALTHY' },
      { name: 'Mother Dairy Dahi (400g)', stock: 14, mrp: 35, cost: 31, marginPct: 11.4, status: 'WARNING_REORDER' },
      { name: 'Amul Masti Buttermilk (200ml)', stock: 4, mrp: 15, cost: 13, marginPct: 13.3, status: 'CRITICAL_DEPLETED' },
      { name: 'Fresh Malai Paneer (200g)', stock: 8, mrp: 90, cost: 78, marginPct: 13.3, status: 'HEALTHY' },
    ],
    beverages: [
      { name: 'Thums Up Charged (750ml PET)', stock: 18, mrp: 40, cost: 34, marginPct: 15, note: 'IPL match tonight (+35% spike projected)' },
      { name: 'Sprite Lime (750ml PET)', stock: 15, mrp: 40, cost: 34, marginPct: 15 },
      { name: 'Coca-Cola Original (750ml)', stock: 12, mrp: 40, cost: 34, marginPct: 15 },
      { name: 'Tata Tea Premium (250g)', stock: 38, mrp: 140, cost: 122, marginPct: 12.9 },
      { name: 'Bru Instant Coffee (50g jar)', stock: 54, mrp: 115, cost: 100, marginPct: 13 },
      { name: 'Frooti Mango (160ml Tetra)', stock: 40, mrp: 10, cost: 8.2, marginPct: 18 },
      { name: 'Red Bull Energy Can (250ml)', stock: 8, mrp: 125, cost: 108, marginPct: 13.6 },
    ],
    staples: [
      { name: 'Aashirvaad Shudh Chakki Atta (5kg)', stock: 12, mrp: 260, cost: 235, marginPct: 9.6, status: 'WARNING_REORDER' },
      { name: 'Fortune Kachi Ghani Mustard Oil (1L)', stock: 11, mrp: 155, cost: 138, marginPct: 11, status: 'WARNING_REORDER' },
      { name: 'Tata Salt Vacuum Evaporated (1kg)', stock: 60, mrp: 28, cost: 24, marginPct: 14.3, status: 'HEALTHY' },
      { name: 'Rajdhani Chana Dal (1kg)', stock: 20, mrp: 110, cost: 96, marginPct: 12.7, status: 'HEALTHY' },
      { name: 'India Gate Basmati Rice (1kg)', stock: 16, mrp: 145, cost: 125, marginPct: 13.8, status: 'HEALTHY' },
      { name: 'Sugar / Cheeni Loose (kg)', stock: 75, mrp: 44, cost: 39, marginPct: 11.4, status: 'HEALTHY' },
    ],
    spicesAndHighMargin: [
      { name: 'MDH Deggi Mirch (100g)', stock: 24, mrp: 95, cost: 68, marginPct: 28.4, rank: 'HIGHEST_MARGIN' },
      { name: 'Everest Garam Masala (100g)', stock: 18, mrp: 88, cost: 62, marginPct: 29.5, rank: 'HIGHEST_MARGIN' },
      { name: 'Catch Haldi Powder (200g)', stock: 20, mrp: 58, cost: 41, marginPct: 29.3, rank: 'HIGHEST_MARGIN' },
      { name: 'MDH Chana Masala (100g)', stock: 15, mrp: 82, cost: 58, marginPct: 29.3, rank: 'HIGHEST_MARGIN' },
    ],
    personalCare: [
      { name: 'Dettol Original Soap (75g)', stock: 76, mrp: 38, cost: 33, marginPct: 13.2 },
      { name: 'Colgate Strong Teeth (150g)', stock: 19, mrp: 98, cost: 86, marginPct: 12.2 },
      { name: 'Surf Excel Quick Wash (1kg)', stock: 22, mrp: 145, cost: 128, marginPct: 11.7 },
      { name: 'Vim Dishwash Bar (300g)', stock: 35, mrp: 25, cost: 20.5, marginPct: 18 },
    ],
  },
  khataUdhaarLedger: [
    { customer: 'Rameshwar Sharma (Sharma ji)', overdueDays: 18, pendingAmountINR: 1240, phone: '+91 98290 11234', lastItems: 'Atta 5kg & Fortune Oil 1L' },
    { customer: 'Suresh Verma (Verma ji)', overdueDays: 12, pendingAmountINR: 850, phone: '+91 98290 22345', lastItems: 'Amul Butter & Milk' },
    { customer: 'Mahendra Tiwari (Tiwari ji)', overdueDays: 24, pendingAmountINR: 1450, phone: '+91 98290 33456', lastItems: 'Cigarettes & Cold drinks' },
    { customer: 'Anil Gupta (Gupta ji, Master ji)', overdueDays: 5, pendingAmountINR: 410, phone: '+91 98290 44567', lastItems: 'Tata Tea & Biscuits' },
    { customer: 'Sunita Bhabhi (B-12 Society)', overdueDays: 3, pendingAmountINR: 300, phone: '+91 98290 55678', lastItems: 'Dahi & Maggi' },
  ],
  totalKhataPendingINR: 4250,
  marginsSummary: {
    highestCategory: 'Spices & Masalas (28% to 29.5% gross margin)',
    highCategory: 'Confectionery & Biscuits (16% to 18%)',
    moderateCategory: 'Beverages & Soft Drinks (15%)',
    lowCategory: 'Edible Cooking Oil (11%) & Dairy (8% to 9%)',
  },
  distributorCutoffs: [
    { name: 'Modern Dairy Jaipur', items: 'Milk, Dahi, Butter, Paneer', cutoff: '12:30 PM', delivery: '2:00 PM', phone: '98290 66789' },
    { name: 'Jaipur Wholesale Mart', items: 'Atta, Oil, Sugar, Pulses', cutoff: '01:00 PM', delivery: 'Next Morning', phone: '98290 77890' },
    { name: 'Balaji & Haldiram Agency', items: 'Chips, Wafers, Namkeen', cutoff: '04:00 PM', delivery: 'Alternate Days', phone: '98290 88901' },
    { name: 'Beverage Hub', items: 'Thums Up, Coke, Sprite, Frooti', cutoff: '05:00 PM', delivery: 'Same Evening', phone: '98290 99012' },
  ],
  footfallPredictions: {
    morningRush: '08:00 - 10:30 AM (approx 48 customers for Milk & Breakfast)',
    afternoonLull: '12:00 - 04:00 PM (approx 18 customers - slow period for distributor reordering)',
    eveningRush: '18:00 - 20:30 PM (approx 72 customers, peak at 19:00 with 1 customer every 90s. Tonight IPL match will add +35% beverage/snack sales)',
    nightClosing: '21:00 - 22:30 PM (approx 20 customers - khata settlement)',
    totalProjectedDayFootfall: 158,
  },
  tomorrowRestockPriorities: [
    { sku: 'AML-MK-500', name: 'Amul Taaza Milk 500ml', qty: 45, unit: 'pkts', supplier: 'Modern Dairy Jaipur', cutoff: '12:30 PM' },
    { sku: 'OIL-FRT-1L', name: 'Fortune Mustard Oil 1L', qty: 25, unit: 'bottles', supplier: 'Jaipur Wholesale Mart', cutoff: '01:00 PM' },
    { sku: 'DRK-THM-750', name: 'Thums Up & Sprite 750ml', qty: 40, unit: 'bottles', supplier: 'Beverage Hub', cutoff: '05:00 PM', note: 'IPL cricket match spike' },
    { sku: 'MAG-NOD-70G', name: 'Maggi Noodles 70g', qty: 50, unit: 'pkts', supplier: 'Jaipur Wholesale Mart', note: 'Restock urgent out-of-stock leak' },
  ],
  taxAndWealth: {
    annualTurnoverINR: 6924536,
    section44adSavedINR: 36800,
    gstCompositionSavedINR: 36000,
    dailySweepInterestINR: 2380,
    totalAnnualGainINR: 75180,
  },
};

// Legacy grounded metrics compatibility export
export const GROUNDED_STORE_METRICS = {
  storeName: KIRANA_STORE_COMPREHENSIVE_DATA.storeProfile.name,
  merchantName: KIRANA_STORE_COMPREHENSIVE_DATA.storeProfile.merchant,
  location: KIRANA_STORE_COMPREHENSIVE_DATA.storeProfile.location,
  todaySalesINR: KIRANA_STORE_COMPREHENSIVE_DATA.salesOverview.todaySalesINR,
  todayOrdersCount: KIRANA_STORE_COMPREHENSIVE_DATA.salesOverview.todayOrdersCount,
  todayUpiShareINR: KIRANA_STORE_COMPREHENSIVE_DATA.salesOverview.todayUpiShareINR,
  todayCashShareINR: KIRANA_STORE_COMPREHENSIVE_DATA.salesOverview.todayCashShareINR,
  yesterdaySalesINR: KIRANA_STORE_COMPREHENSIVE_DATA.salesOverview.yesterdaySalesINR,
  yesterdayOrdersCount: KIRANA_STORE_COMPREHENSIVE_DATA.salesOverview.yesterdayOrdersCount,
  salesDeltaPercent: KIRANA_STORE_COMPREHENSIVE_DATA.salesOverview.salesDeltaPercent,
  dipReason: KIRANA_STORE_COMPREHENSIVE_DATA.salesOverview.dipReason,
  stockoutLostRevenueINR: KIRANA_STORE_COMPREHENSIVE_DATA.salesOverview.stockoutLostRevenueINR,
  tomorrowRestockList: KIRANA_STORE_COMPREHENSIVE_DATA.tomorrowRestockPriorities,
  khataPendingUdharINR: KIRANA_STORE_COMPREHENSIVE_DATA.totalKhataPendingINR,
  khataDormantCustomerCount: 42,
  healthScore: 88,
  healthBreakdown: {
    revenueScore: 92,
    inventoryAccuracy: 78,
    customerRetention: 74,
  },
};

/**
 * Checks if incoming user text requests a voice call session
 */
export function isCallIntent(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  const patterns = [
    'call',
    'phone',
    'कॉल',
    'फोन',
    'i want to have a call',
    'i want a call',
    'call lagao',
    'call karo',
    'mujhe call pe baat karni hai',
    'can we call',
    'voice call',
    'talk on call',
    'baat karni hai',
    'call me',
  ];
  return patterns.some((p) => normalized.includes(p));
}

/**
 * Checks if user text confirms a call request
 */
export function isCallConfirmation(text: string): boolean {
  const normalized = text.toLowerCase().trim();
  const confirmations = [
    'yes',
    'ha',
    'haa',
    'haan',
    'हाँ',
    'ha call karo',
    'yes call',
    'start call',
    'call now',
    'connect',
    'yup',
    'sure',
    'ok',
    'okay',
  ];
  return confirmations.some((c) => normalized === c || normalized.startsWith(c));
}

/**
 * Synthesizes voice and WhatsApp queries in real-time.
 * Powered strictly by Groq Cloud models: openai/gpt-oss-120b and qwen/qwen3.8-27b.
 * Answers PRECISELY what the merchant asks without canned misdirections.
 */
export async function processVoiceQuery(query: string, language: 'hi' | 'en' = 'hi'): Promise<VoiceQueryResponse> {
  const normalized = query.toLowerCase().trim();
  const startTime = Date.now();
  const data = KIRANA_STORE_COMPREHENSIVE_DATA;
  const m = GROUNDED_STORE_METRICS;

  // If GROQ_API_KEY is available, use Groq LPU directly with full store telemetry
  const apiKey = process.env.GROQ_API_KEY;
  if (apiKey) {
    try {
      const groq = new Groq({ apiKey });

      const systemPrompt = `You are DukaanPay AI, an autonomous Indian Kirana Store Partner & Virtual CA for merchant ${data.storeProfile.merchant} (${data.storeProfile.name}, ${data.storeProfile.location}).

GROUNDED STORE TELEMETRY (100% FACTUAL, DO NOT HALLUCINATE):
1. TODAY'S SALES: ₹${data.salesOverview.todaySalesINR.toLocaleString('en-IN')} across ${data.salesOverview.todayOrdersCount} orders (Paytm QR/UPI: ₹${data.salesOverview.todayUpiShareINR.toLocaleString('en-IN')} [${data.salesOverview.todayUpiPct}%], Cash: ₹${data.salesOverview.todayCashShareINR.toLocaleString('en-IN')}).
2. YESTERDAY'S SALES: ₹${data.salesOverview.yesterdaySalesINR.toLocaleString('en-IN')} (Dip of ${Math.abs(data.salesOverview.salesDeltaPercent)}% due to afternoon 2-4 PM lull and Maggi/buttermilk stockout costing ₹${data.salesOverview.stockoutLostRevenueINR.toLocaleString('en-IN')}).
3. INVENTORY BY CATEGORY:
   * SNACKS & BISCUITS: Lay's Magic Masala (10 pkts left, LOW STOCK), Kurkure (18 pkts), Balaji Wafers (32 pkts @ ₹10), Haldiram Bhujia (14 pkts @ ₹55), Parle-G (45 pkts @ ₹90), Good Day (28 pkts @ ₹30), Oreo (16 pkts), Monaco (25 pkts), Yippee Noodles (22 pkts).
   * CRITICAL ALERT: Maggi 2-Minute Masala Noodles is 0 pkts (OUT OF STOCK since 1:15 PM, loss ₹2,300).
   * DAIRY: Amul Milk 500ml (45 pkts, cutoff 12:30 PM), Amul Butter (32 packs), Mother Dairy Dahi (14 tubs), Buttermilk (4 pkts left, depleted), Paneer (8 blocks).
   * BEVERAGES: Thums Up (18 bottles @ ₹40, tonight IPL match brings +35% surge), Sprite (15 bottles), Coke (12 bottles), Tata Tea (38 boxes @ ₹140), Bru Coffee (54 jars @ ₹115), Frooti (40 packs).
   * STAPLES: Aashirvaad Atta 5kg (12 bags @ ₹260, lead time 48h), Fortune Mustard Oil 1L (11 bottles @ ₹155, lead time 48h), Tata Salt (60 pkts @ ₹28), Chana Dal (20 pkts), Basmati Rice (16 pkts), Loose Sugar (75 kg).
   * SPICES & MASALAS (HIGHEST PROFIT MARGIN 28-30%): MDH Deggi Mirch (24 boxes, 28.4% margin), Everest Garam Masala (18 boxes, 29.5% margin), Catch Haldi (20 pkts, 29.3% margin), MDH Chana Masala (15 boxes, 29.3% margin).
   * LOW MARGIN: Dairy (8-9%) and Cooking Oil (11%).
4. KHATA UDHAAR (OUTSTANDING CUSTOMER DEBT - TOTAL ₹${data.totalKhataPendingINR}):
   * Rameshwar Sharma (Sharma ji): ₹1,240 pending for 18 days (Atta 5kg & Fortune Oil 1L).
   * Suresh Verma (Verma ji): ₹850 pending for 12 days (Amul Butter & Milk).
   * Mahendra Tiwari (Tiwari ji): ₹1,450 pending for 24 days (Cigarettes & Cold drinks - oldest overdue!).
   * Anil Gupta (Gupta ji): ₹410 pending for 5 days (Tata Tea & Biscuits).
   * Sunita Bhabhi: ₹300 pending for 3 days (Dahi & Maggi).
5. FOOTFALL FORECAST:
   * Morning: 48 customers (Milk & Breakfast).
   * Afternoon Lull: 18 customers (12:00 - 16:00 PM).
   * Evening Peak Rush: 72 customers (18:00 - 20:30 PM, peak at 19:00 with 1 customer every 90 seconds, extra rush tonight for IPL match).
   * Total Day Footfall: ~158 customers.
6. WHAT-IF DEPLETION VELOCITIES:
   * Maggi sells 14 pkts/day (Margin 17.8%).
   * Amul Milk sells 42 pkts/day (Margin 9.3%).
   * Fortune Oil sells 6 bottles/day (Margin 11%).
   * Thums Up sells 18 bottles/day (Margin 15%).
7. DISTRIBUTOR CUTOFFS:
   * Modern Dairy (Milk, Dahi): 12:30 PM cutoff.
   * Jaipur Wholesale Mart (Atta, Oil, Sugar): 1:00 PM cutoff.
   * Beverage Hub (Thums Up, Coke): 5:00 PM cutoff.
8. VIRTUAL CA & TAX ADVISORY:
   * Section 44AD: 6% tax rate on digital UPI transactions vs 8% on cash saves ₹36,800/yr.
   * GST Composition: 1% flat for Kirana under ₹1.5 Cr saves ₹36,000/yr in CA fees.
   * Daily Sweep Fund (6.8%): ₹2,380/yr interest on ₹35,000 float. Total merchant gain: ₹75,180/yr.

STRICT INSTRUCTIONS:
- ALWAYS answer the EXACT question asked by the merchant in BOTH Hindi and English with pristine formatting.
- If the user asks about snacks, list the specific snack items, their quantities, and mention that Maggi is 0 (out of stock).
- If the user asks about Udhaar or Sharma ji/Verma ji, answer with the exact name, amount, days overdue, and items purchased.
- If the user asks about margins or most profitable item, explicitly mention Spices/Masala (MDH/Everest 28-30%).
- If the user asks about footfall or rush, mention the exact timing and customer counts.
- DO NOT answer with a generic reorder list unless the user specifically asks "kal kya mangwana hai" or "reorder list".
- "hindiSpokenResponse": Provide a clear, natural, polite Hindi/Hinglish answer with bold amounts (₹), clean bullet points, and emojis.
- "englishSummary": Provide a complete, beautifully bulleted English breakdown with exact figures and actionable business recommendations.
- Always output valid JSON in this exact structure:
{
  "hindiSpokenResponse": "Pristine, formatted answer in Hindi with bullets & bold figures",
  "englishSummary": "Pristine, formatted answer in English with bullets & actionable insights"
}`;

      // Strictly use openai/gpt-oss-120b or qwen/qwen3.8-27b
      let completion;
      let usedModel = 'openai/gpt-oss-120b';

      try {
        completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          model: 'openai/gpt-oss-120b',
          temperature: 0.2,
          response_format: { type: 'json_object' },
        });
      } catch (err: any) {
        console.warn('[Groq gpt-oss-120b fallback to qwen/qwen3.8-27b]:', err.message);
        usedModel = 'qwen/qwen3.8-27b';
        completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query },
          ],
          model: 'qwen/qwen3.8-27b',
          temperature: 0.2,
          response_format: { type: 'json_object' },
        });
      }

      const content = completion.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content);

      // Build relevant contextual action button
      let actionButtons: any[] | undefined = undefined;
      if (normalized.includes('sharma') || normalized.includes('udhar') || normalized.includes('khata')) {
        actionButtons = [
          {
            label: '📲 Send ₹1,240 Reminder to Sharma Ji',
            actionType: 'UDHAAR_RECOVERY',
            payload: { customer: 'Sharma ji', amount: 1240 },
          },
        ];
      } else if (normalized.includes('maggi') || normalized.includes('restock') || normalized.includes('order')) {
        actionButtons = [
          {
            label: '⚡ 1-Tap Reorder to Distributor via WhatsApp',
            actionType: 'STOCK_RESTOCK',
            payload: { distributor: 'Modern Dairy Jaipur & Wholesale Mart' },
          },
        ];
      } else if (normalized.includes('tax') || normalized.includes('ca')) {
        actionButtons = [
          {
            label: '💼 View Virtual CA Tax Savings Breakdown',
            actionType: 'VIEW_TAX_AUDIT',
            payload: { annualGain: 75180 },
          },
        ];
      }

      return {
        query,
        hindiSpokenResponse: parsed.hindiSpokenResponse || `रामेश्वर भैया, आपकी दुकान की आज की कुल बिक्री ₹${m.todaySalesINR.toLocaleString('en-IN')} रही है।`,
        englishSummary: parsed.englishSummary || `Processed Kirana query accurately with grounded telemetry.`,
        metrics: {
          todaySalesINR: m.todaySalesINR,
          khataTotalINR: data.totalKhataPendingINR,
          footfallEvening: 72,
        },
        actionButtons,
        modelUsed: `Groq LPU (${usedModel})`,
        latencyMs: Date.now() - startTime,
      };
    } catch (err: any) {
      console.warn('[VoiceCOO Engine] Groq API call encountered issue, engaging deterministic handler:', err.message);
    }
  }

  // ==========================================
  // DETERMINISTIC ACCURATE FALLBACK HANDLERS
  // (Triggered if Groq is offline or API key absent)
  // ==========================================

  // 1. Specific Query: Snacks inventory
  if (
    normalized.includes('snack') ||
    normalized.includes('chips') ||
    normalized.includes('namkeen') ||
    normalized.includes('kurkure') ||
    normalized.includes('lay')
  ) {
    const s = data.inventoryByCategory.snacks;
    return {
      query,
      hindiSpokenResponse: `रामेश्वर भैया, स्नैक्स में आपके पास Lay's के 10 पैकेट (कम स्टॉक), कुरकुरे के 18 पैकेट, बालाजी वेफर्स 32 पैकेट, हल्दीराम भुजिया 14 पैकेट और पारले-जी 45 पैकेट हैं। ध्यान दें: मैगी 0 पैकेट (आउट ऑफ स्टॉक) है!`,
      englishSummary: `Snacks Inventory: Lay's (10 pkts, low), Kurkure (18 pkts), Balaji (32 pkts), Haldiram (14 pkts), Parle-G (45 pkts). Maggi is OUT OF STOCK (0 pkts).`,
      metrics: { snacks: s },
      actionButtons: [
        {
          label: '📦 Reorder Maggi & Lay’s Buffer',
          actionType: 'STOCK_RESTOCK',
          payload: { items: ['Maggi 70g (50 pkts)', 'Lay’s Masala (24 pkts)'] },
        },
      ],
      modelUsed: 'DukaanPay Grounded Telemetry',
      latencyMs: Date.now() - startTime,
    };
  }

  // 2. Specific Query: Khata / Udhaar / Sharma ji
  if (
    normalized.includes('sharma') ||
    normalized.includes('verma') ||
    normalized.includes('tiwari') ||
    normalized.includes('udhar') ||
    normalized.includes('baki') ||
    normalized.includes('khata')
  ) {
    if (normalized.includes('sharma')) {
      const sharma = data.khataUdhaarLedger[0];
      return {
        query,
        hindiSpokenResponse: `रामेश्वर भैया, शर्मा जी का कुल ₹${sharma.pendingAmountINR.toLocaleString('en-IN')} का उधार बकाया है, जो पिछले ${sharma.overdueDays} दिनों से अटका हुआ है। उन्होंने आटा और फॉर्च्यून तेल लिया था।`,
        englishSummary: `Sharma ji owes ₹${sharma.pendingAmountINR}, overdue by ${sharma.overdueDays} days (Atta & Fortune Oil).`,
        metrics: sharma,
        actionButtons: [
          {
            label: `📲 Send ₹${sharma.pendingAmountINR} Payment Link to Sharma Ji`,
            actionType: 'UDHAAR_RECOVERY',
            payload: sharma,
          },
        ],
        modelUsed: 'DukaanPay Grounded Telemetry',
        latencyMs: Date.now() - startTime,
      };
    }

    return {
      query,
      hindiSpokenResponse: `भैया बही-खाते में कुल ₹${data.totalKhataPendingINR.toLocaleString('en-IN')} का उधार बकाया है: शर्मा जी (₹1,240, 18 दिन), तिवारी जी (₹1,450, 24 दिन), वर्मा जी (₹850), गुप्ता जी (₹410) और सुनीता भाभी (₹300)।`,
      englishSummary: `Total pending khata is ₹${data.totalKhataPendingINR}: Sharma ji (₹1,240, 18d), Tiwari ji (₹1,450, 24d), Verma ji (₹850), Gupta ji (₹410), Sunita bhabhi (₹300).`,
      metrics: { khata: data.khataUdhaarLedger, total: data.totalKhataPendingINR },
      actionButtons: [
        {
          label: '📢 Send 1-Tap WhatsApp Reminders to All 5 Customers',
          actionType: 'UDHAAR_RECOVERY',
          payload: { total: data.totalKhataPendingINR },
        },
      ],
      modelUsed: 'DukaanPay Grounded Telemetry',
      latencyMs: Date.now() - startTime,
    };
  }

  // 3. Specific Query: Profit margin / Munafa
  if (
    normalized.includes('margin') ||
    normalized.includes('munafa') ||
    normalized.includes('sabse zyada fayda') ||
    normalized.includes('profit')
  ) {
    return {
      query,
      hindiSpokenResponse: `रामेश्वर भैया, आपकी दुकान में सबसे ज्यादा मुनाफा मसालों (MDH, Everest, Catch) में है—लगभग 28% से 30% मार्जिन! बिस्कुट और कन्फेक्शनरी में 16-18% और कोल्ड ड्रिंक्स में 15% है। सबसे कम मार्जिन दूध (9%) और तेल (11%) में है।`,
      englishSummary: `Highest margin: Spices & Masala (28-30% gross profit). Moderate: Biscuits (16-18%), Cold Drinks (15%). Lowest margin: Milk (9%) and Cooking Oil (11%).`,
      metrics: data.marginsSummary,
      actionButtons: [
        {
          label: '📈 View Category Margin Heatmap',
          actionType: 'VIEW_HOURLY_SALES',
          payload: { view: 'margins' },
        },
      ],
      modelUsed: 'DukaanPay Grounded Telemetry',
      latencyMs: Date.now() - startTime,
    };
  }

  // 4. Specific Query: Dairy / Milk
  if (normalized.includes('doodh') || normalized.includes('dairy') || normalized.includes('dahi') || normalized.includes('amul')) {
    return {
      query,
      hindiSpokenResponse: `भैया डेयरी में अभी अमूल दूध के 45 पैकेट, अमूल बटर के 32 पैक, और मदर डेयरी दही के 14 टब हैं। अमूल छाछ लगभग खत्म है (केवल 4 पैकेट बचे हैं)। मॉडर्न डेयरी का ऑर्डर कटऑफ 12:30 बजे है।`,
      englishSummary: `Dairy inventory: Amul Milk (45 pkts), Butter (32 packs), Dahi (14 tubs), Buttermilk (4 pkts left). Modern Dairy cutoff is 12:30 PM.`,
      metrics: { dairy: data.inventoryByCategory.dairy },
      actionButtons: [
        {
          label: '⚡ Send Reorder to Modern Dairy (12:30 PM Cutoff)',
          actionType: 'STOCK_RESTOCK',
          payload: { supplier: 'Modern Dairy Jaipur' },
        },
      ],
      modelUsed: 'DukaanPay Grounded Telemetry',
      latencyMs: Date.now() - startTime,
    };
  }

  // 5. Specific Query: Footfall / Rush / Graahak
  if (
    normalized.includes('footfall') ||
    normalized.includes('kitne log') ||
    normalized.includes('kitne logo') ||
    normalized.includes('sambhawna') ||
    normalized.includes('graahak') ||
    normalized.includes('grahak') ||
    normalized.includes('rush') ||
    normalized.includes('bheed')
  ) {
    const f = data.footfallPredictions;
    return {
      query,
      hindiSpokenResponse: `रामेश्वर भैया, अभी दोपहर में ग्राहकी धीमी रहेगी (लगभग 18 लोग)। लेकिन शाम 6:00 से 8:30 बजे पीक रश रहेगा जिसमें 72 ग्राहकों के आने की उम्मीद है (शाम 7:00 बजे हर 90 सेकंड में एक ग्राहक)। आज रात आईपीएल मैच से कोल्ड ड्रिंक्स और स्नैक्स की अतिरिक्त बिक्री होगी!`,
      englishSummary: `Afternoon lull: ~18 shoppers. Evening peak rush: 18:00-20:30 with 72 expected shoppers. Peak density at 19:00 (1 customer every 90s). Tonight's IPL match lifts snacks & beverages by +35%.`,
      metrics: f,
      actionButtons: [
        {
          label: '📈 View Diurnal Footfall & Sales Curve',
          actionType: 'VIEW_HOURLY_SALES',
          payload: { view: 'footfall' },
        },
      ],
      modelUsed: 'DukaanPay Grounded Telemetry',
      latencyMs: Date.now() - startTime,
    };
  }

  // 6. Specific Query: Today's sales
  if (
    normalized.includes('aaj ki sales') ||
    normalized.includes('aaj kitni bikri') ||
    normalized.includes('today sales') ||
    normalized.includes('bikri kya thi')
  ) {
    return {
      query,
      hindiSpokenResponse: `रामेश्वर भैया, आज दुकान की कुल बिक्री ₹${m.todaySalesINR.toLocaleString('en-IN')} रही है। कुल ${m.todayOrdersCount} ग्राहकों में से Paytm QR कोड से ₹${m.todayUpiShareINR.toLocaleString('en-IN')} (${data.salesOverview.todayUpiPct}%) और कैश में ₹${m.todayCashShareINR.toLocaleString('en-IN')} आए हैं।`,
      englishSummary: `Today's gross sales are ₹${m.todaySalesINR} across ${m.todayOrdersCount} transactions (UPI: ₹${m.todayUpiShareINR}, Cash: ₹${m.todayCashShareINR}).`,
      metrics: data.salesOverview,
      actionButtons: [
        {
          label: '📊 View Hourly Sales Chart',
          actionType: 'VIEW_HOURLY_SALES',
          payload: { view: 'hourly' },
        },
      ],
      modelUsed: 'DukaanPay Grounded Telemetry',
      latencyMs: Date.now() - startTime,
    };
  }

  // 7. Specific Query: Yesterday comparison
  if (
    normalized.includes('kam hui') ||
    normalized.includes('pichhle din') ||
    normalized.includes('yesterday') ||
    normalized.includes('kal se kam') ||
    normalized.includes('sales down')
  ) {
    return {
      query,
      hindiSpokenResponse: `हाँ भैया, कल कुल बिक्री ₹${m.yesterdaySalesINR.toLocaleString('en-IN')} थी, यानी आज बिक्री ${Math.abs(m.salesDeltaPercent)}% कम रही। मुख्य कारण दोपहर में फुटफॉल धीमा होना और दोपहर 1:15 बजे मैगी व अमूल छाछ का स्टॉक खत्म होना था, जिससे ₹${m.stockoutLostRevenueINR.toLocaleString('en-IN')} का नुकसान हुआ।`,
      englishSummary: `Sales dipped by ${Math.abs(m.salesDeltaPercent)}% vs yesterday (₹${m.yesterdaySalesINR}). Primary cause: midday lull and premature stockout of Maggi & buttermilk costing ₹${m.stockoutLostRevenueINR}.`,
      metrics: data.salesOverview,
      actionButtons: [
        {
          label: '🛡️ Audit Stockout Profit Leak (₹2,300)',
          actionType: 'AUDIT_STOCKOUT',
          payload: { leakAmount: m.stockoutLostRevenueINR },
        },
      ],
      modelUsed: 'DukaanPay Grounded Telemetry',
      latencyMs: Date.now() - startTime,
    };
  }

  // 8. Specific Query: Tomorrow's order list / Reorder
  if (
    normalized.includes('kal k liye') ||
    normalized.includes('kya mangwana') ||
    normalized.includes('kya mungwana') ||
    normalized.includes('tomorrow order') ||
    normalized.includes('reorder')
  ) {
    return {
      query,
      hindiSpokenResponse: `भैया कल के लिए मुख्य काम: 1. अमूल दूध के 45 पैकेट 12:30 बजे से पहले मॉडर्न डेयरी को ऑर्डर करें। 2. फॉर्च्यून तेल की 25 बोतलें। 3. मैगी के 50 पैकेट (स्टॉकआउट दूर करने के लिए)। 4. शाम के मैच के लिए 40 बोतल कोल्ड ड्रिंक्स अतिरिक्त मँगवा लें!`,
      englishSummary: `Tomorrow reorder priorities: 45 pkts Amul Milk (12:30 PM cutoff), 25 bottles Fortune Oil, 50 pkts Maggi to fix stockout, 40 cold drinks for IPL match.`,
      metrics: { reorderList: data.tomorrowRestockPriorities },
      actionButtons: [
        {
          label: '⚡ Dispatch 1-Tap Orders to Modern Dairy & Wholesale Mart',
          actionType: 'STOCK_RESTOCK',
          payload: { items: data.tomorrowRestockPriorities },
        },
      ],
      modelUsed: 'DukaanPay Grounded Telemetry',
      latencyMs: Date.now() - startTime,
    };
  }

  // 9. Specific Query: Tax & Virtual CA
  if (
    normalized.includes('tax') ||
    normalized.includes('ca') ||
    normalized.includes('gst') ||
    normalized.includes('bachat') ||
    normalized.includes('wealth')
  ) {
    const tax = data.taxAndWealth;
    return {
      query,
      hindiSpokenResponse: `रामेश्वर भैया, वर्चुअल CA से आपकी कुल सालाना ₹${tax.totalAnnualGainINR.toLocaleString('en-IN')} की बचत है: 1. सेक्शन 44AD डिजिटल UPI में ₹${tax.section44adSavedINR.toLocaleString('en-IN')} इनकम टैक्स की बचत, 2. 1% GST कंपोजिशन से ₹${tax.gstCompositionSavedINR.toLocaleString('en-IN')} CA ऑडिट फीस की बचत, और 3. लिक्विड फंड ऑटो-स्वीप से ₹${tax.dailySweepInterestINR.toLocaleString('en-IN')} अतिरिक्त ब्याज!`,
      englishSummary: `Virtual CA saves ₹${tax.totalAnnualGainINR}/yr: ₹${tax.section44adSavedINR} via Section 44AD 6% UPI rate, ₹${tax.gstCompositionSavedINR} in GST compliance, ₹${tax.dailySweepInterestINR} in sweep interest.`,
      metrics: tax,
      actionButtons: [
        {
          label: '💼 Open Virtual CA Tax Optimization Breakdown',
          actionType: 'VIEW_TAX_AUDIT',
          payload: tax,
        },
      ],
      modelUsed: 'DukaanPay Grounded Telemetry',
      latencyMs: Date.now() - startTime,
    };
  }

  // 10. Default contextual answer
  return {
    query,
    hindiSpokenResponse: `रामेश्वर भैया, दुकान का ब्योरा दर्ज है। आज की कुल बिक्री ₹${m.todaySalesINR.toLocaleString('en-IN')} है और ₹${data.totalKhataPendingINR.toLocaleString('en-IN')} का उधार बकाया है। आप स्नैक्स, दूध, फुटफॉल, खाता या टैक्स के बारे में जो भी पूछेंगे, मैं तुरंत बता दूंगा!`,
    englishSummary: `Today sales: ₹${m.todaySalesINR}, pending khata: ₹${data.totalKhataPendingINR}. Ready to answer questions on snacks, dairy, khata, footfall or taxes.`,
    metrics: { todaySales: m.todaySalesINR, pendingKhata: data.totalKhataPendingINR },
    modelUsed: 'DukaanPay Grounded Telemetry',
    latencyMs: Date.now() - startTime,
  };
}

/**
 * Returns the 4 automated scheduled proactive daily briefings
 * as defined in the document Whatsapp_AI_Merchant_COO_Enhancements.docx
 */
export function getScheduledDailyBriefings(): ScheduledBriefing[] {
  const m = GROUNDED_STORE_METRICS;
  const d = KIRANA_STORE_COMPREHENSIVE_DATA;

  return [
    {
      timeSlot: '07:30 AM',
      milestoneTitle: '🌅 Shop Opening Morning Briefing',
      hindiHeadline: 'सुप्रभात रामेश्वर जी! दुकान खोलने का समय हुआ।',
      hindiDescription: `कल की कुल बिक्री ₹${m.yesterdaySalesINR.toLocaleString('en-IN')} रही। आज का अनुमानित टारगेट ₹18,450 है। आज शाम क्रिकेट मैच है, इसलिए कोल्ड ड्रिंक्स और स्नैक्स की मांग 35% ज्यादा रहेगी। सुबह 8 से 10:30 बजे दूध और ब्रेड का मुख्य रश रहेगा (~48 ग्राहक)।`,
      englishDetails: `Yesterday revenue ₹${m.yesterdaySalesINR}. Peak demand: 08:00-10:30 AM (Milk & Breakfast). Opportunity: IPL Cricket Match tonight (+35% beverage lift).`,
      audioDuration: '0:18',
      cooFeature: '1. Morning Business Briefing & 3. Opportunity Alerts',
      actionButton: {
        label: '✅ Approve Early Morning Milk Buffer (₹3,200)',
        actionType: 'STOCK_RESTOCK',
        payload: { sku: 'AML-MK-500', qty: 30, distributor: 'Modern Dairy Jaipur' },
      },
      metrics: {
        yesterdayRevenueINR: m.yesterdaySalesINR,
        projectedRevenueINR: 18450,
        morningRushHour: '08:00 - 10:30 AM',
        eventLiftPct: 35,
      },
    },
    {
      timeSlot: '12:30 PM',
      milestoneTitle: '⚡ Midday Supplier Cutoff & Profit Leak Alert',
      hindiHeadline: '🚨 जरूरी चेतावनी: 12:30 PM सप्लायर ऑर्डर कटऑफ!',
      hindiDescription: `मैगी का स्टॉक खत्म (0 पैकेट) और अमूल छाछ केवल 4 पैकेट बची है। अगर अभी ऑर्डर नहीं किया तो शाम को ₹${m.stockoutLostRevenueINR.toLocaleString('en-IN')} का सीधा नुकसान होगा। मॉडर्न डेयरी (दूध/छाछ) का कटऑफ 12:30 PM और होलसेल मार्ट का 1:00 PM है। 1-टैप में आर्डर भेजें?`,
      englishDetails: `Stockout Leak Detector: Maggi 0 pkts and Buttermilk depleted. Estimated loss ₹${m.stockoutLostRevenueINR}. Modern Dairy cutoff is 12:30 PM.`,
      audioDuration: '0:14',
      cooFeature: '4. Profit Leak Detector & 9. One-Tap Actions',
      actionButton: {
        label: '⚡ Dispatch WhatsApp Order to Modern Dairy (₹4,200)',
        actionType: 'STOCK_RESTOCK',
        payload: { distributor: 'Modern Dairy Jaipur', items: ['Amul Taaza 45pkts', 'Fortune Oil 25L', 'Maggi 50pkts'] },
      },
      metrics: {
        estimatedLossINR: m.stockoutLostRevenueINR,
        cutoffDeadline: '12:30 PM',
        criticalSkusCount: 2,
      },
    },
    {
      timeSlot: '05:30 PM',
      milestoneTitle: '☕ Evening Rush & Customer Winback Push',
      hindiHeadline: '🏏 शाम का रश शुरू: क्रिकेट मैच और सोसायटी ग्राहक ऑफर',
      hindiDescription: `शाम 6:00 से 8:30 बजे मुख्य पीक रश रहेगा जिसमें लगभग 72 ग्राहकों के आने की संभावना है (शाम 7:00 बजे सबसे ज्यादा भीड़)। सोसायटी के ${m.khataDormantCustomerCount} नियमित ग्राहक पिछले 20 दिनों से नहीं आए हैं, क्या उन्हें ₹20 का वेलकम वाउचर भेजें?`,
      englishDetails: `Society Churn Engine: ${m.khataDormantCustomerCount} high-value shoppers dormant. Launch ₹20 winback WhatsApp coupon to recapture ₹6,800 monthly basket value.`,
      audioDuration: '0:15',
      cooFeature: '8. Smart Follow-Up & 10. Merchant Growth Coach',
      actionButton: {
        label: `📢 Send ₹20 WhatsApp Voucher to ${m.khataDormantCustomerCount} Customers`,
        actionType: 'WINBACK_CAMPAIGN',
        payload: { customerCount: m.khataDormantCustomerCount, voucherAmount: 20 },
      },
      metrics: {
        dormantCustomers: m.khataDormantCustomerCount,
        eveningRushWindow: '18:00 - 20:30 PM',
        potentialRecoveryINR: 6800,
      },
    },
    {
      timeSlot: '10:00 PM',
      milestoneTitle: '🌙 Shop Closing & Khata Settlement',
      hindiHeadline: '🌙 दुकान बंद: आज का खाता और बैंक सेटलमेंट पूरा हुआ',
      hindiDescription: `आज दिन भर में कुल ₹${m.todaySalesINR.toLocaleString('en-IN')} की बिक्री हुई (142 बिल)। पूरा UPI अमाउंट ₹${m.todayUpiShareINR.toLocaleString('en-IN')} आपके Paytm बैंक खाते में क्रेडिट हो गया है। बही-खाते में कुल ₹${d.totalKhataPendingINR.toLocaleString('en-IN')} का उधार बकाया है (शर्मा जी: ₹1,240, तिवारी जी: ₹1,450)। क्या 1-टैप में तकादा रिमाइंडर भेजें?`,
      englishDetails: `Night Settlement Summary: Total ₹${m.todaySalesINR} (142 txns). ₹${m.todayUpiShareINR} auto-settled to Paytm Bank. Outstanding ledger ₹${d.totalKhataPendingINR}.`,
      audioDuration: '0:20',
      cooFeature: '7. Business Health Doctor & 9. One-Tap Actions',
      actionButton: {
        label: `📲 Send Gentle WhatsApp Udhar Reminders (₹${d.totalKhataPendingINR.toLocaleString('en-IN')})`,
        actionType: 'UDHAAR_RECOVERY',
        payload: { amount: d.totalKhataPendingINR, channels: ['whatsapp_soundbox'] },
      },
      metrics: {
        finalSalesINR: m.todaySalesINR,
        autoSettledINR: m.todayUpiShareINR,
        pendingUdharINR: d.totalKhataPendingINR,
        healthScore: m.healthScore,
      },
    },
  ];
}
