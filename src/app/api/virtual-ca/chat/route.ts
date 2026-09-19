import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { KIRANA_STORE_COMPREHENSIVE_DATA } from '@/ai/voice-coo-engine';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const data = KIRANA_STORE_COMPREHENSIVE_DATA;
    const tax = data.taxAndWealth;

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      try {
        const groq = new Groq({ apiKey });

        const systemPrompt = `You are the Virtual CA & Certified Wealth Advisor for ${data.storeProfile.merchant}, owner of ${data.storeProfile.name}, ${data.storeProfile.location}.
Annual Store Turnover: ₹${tax.annualTurnoverINR.toLocaleString('en-IN')} (₹69.2 Lakhs).
Paytm QR / Digital UPI Share: 78% (₹54 Lakhs). Cash Share: 22%.

GROUNDED TAX & WEALTH ADVISORY FACTS (INCOME TAX ACT 1961 & CGST ACT 2017):
1. Section 44AD Presumptive Taxation:
   - Presumptive deemed net profit on digital UPI / Paytm QR is only 6%, whereas on cash receipts it is 8%.
   - By running 78% digital UPI, merchant declares ₹4.15 Lakhs profit on digital instead of ₹5.53 Lakhs cash rate, saving ₹36,800/year in 30% tax bracket!
   - Recommendation: Encourage customers to pay 100% via Paytm QR Soundbox to save an additional ₹10,400/year.
2. GST Composition Scheme (Section 10):
   - Small Kirana stores with turnover under ₹1.5 Crore are eligible for flat 1% GST (0.5% CGST + 0.5% SGST).
   - Quarterly simplified return (CMP-08) instead of cumbersome monthly GSTR-1 & GSTR-3B filings with 200+ HSN matching.
   - Saves ₹36,000/year in CA audit, bookkeeping, and filing fees.
3. Daily Float Auto-Sweep Liquid Fund (Wealth Advisory):
   - Kirana stores keep an average idle float balance of ₹35,000 in current accounts earning 0% interest.
   - Auto-sweeping daily evening closing float into an overnight Liquid Fund / Auto-Sweep FD (yielding 6.8% p.a.) generates ₹2,380/year risk-free passive interest with instant T+0 working capital withdrawal.
4. Total Combined Annual Value Creation:
   - ₹36,800 (Income Tax 44AD) + ₹36,000 (GST CA Compliance) + ₹2,380 (Daily Float Sweep) = ₹75,180/year direct merchant profit gain.

INSTRUCTIONS:
- ALWAYS provide your answer in BOTH languages (Hindi/Hinglish AND English) with immaculate structure.
- Structure your response exactly as follows:
  🇮🇳 **हिंदी में समाधान (Hindi Advice):**
  [Clear, respectful explanation in Hindi with bold numbers (₹), bullet points, and practical steps]

  ---
  🇬🇧 **English Summary & Compliance Breakdown:**
  [Professional English breakdown with exact calculations, statutory sections (Section 44AD / CGST Sec 10), and action points]
- If asked about audit risk or notice, assure them that Section 44AD specifically exempts merchants from mandatory books of accounts (Section 44AA) and tax audits (Section 44AB) as long as turnover is under ₹2-3 Crores.
- Format with clean markdown headers, bullet points, and bold text for optimal readability.`;

        const messages: any[] = [
          { role: 'system', content: systemPrompt },
        ];

        if (Array.isArray(history)) {
          for (const h of history.slice(-6)) {
            if (h.role && h.content) {
              messages.push({ role: h.role, content: h.content });
            }
          }
        }

        messages.push({ role: 'user', content: message });

        let completion;
        let modelUsed = 'openai/gpt-oss-120b';

        try {
          completion = await groq.chat.completions.create({
            messages,
            model: 'openai/gpt-oss-120b',
            temperature: 0.2,
          });
        } catch {
          modelUsed = 'qwen/qwen3.8-27b';
          completion = await groq.chat.completions.create({
            messages,
            model: 'qwen/qwen3.8-27b',
            temperature: 0.2,
          });
        }

        const reply = completion.choices[0]?.message?.content || 'कोई जानकारी नहीं मिली।';

        return NextResponse.json({
          status: 'success',
          reply,
          modelUsed,
          metrics: {
            annualSavingsINR: tax.totalAnnualGainINR,
            section44adSaved: tax.section44adSavedINR,
            gstSaved: tax.gstCompositionSavedINR,
            sweepInterest: tax.dailySweepInterestINR,
          },
        });
      } catch (err: any) {
        console.warn('[Virtual CA API] Groq error:', err.message);
      }
    }

    // Deterministic fallback if Groq is unavailable
    const fallbackReply = `🇮🇳 **हिंदी में समाधान (Hindi Advice):**
नमस्ते रामेश्वर जी! आपकी दुकान (Laxmi Kirana) के लिए 3 मुख्य टैक्स व वेल्थ रणनीतियाँ:

• **सेक्शन 44AD डिजिटल बचत:** Paytm QR से 78% डिजिटल बिक्री होने पर 8% के बजाय केवल 6% लाभ पर टैक्स लगता है—सालाना **₹${tax.section44adSavedINR.toLocaleString('en-IN')}** की सीधी बचत!
• **GST 1% कंपोजिशन स्कीम:** 1.5 करोड़ से कम टर्नओवर पर सिर्फ 1% फ्लैट GST दें—CA ऑडिट व रिटर्न फाइलिंग फीस में **₹${tax.gstCompositionSavedINR.toLocaleString('en-IN')}** बचेंगे।
• **डेली फ्लोट लिक्विड फंड (6.8%):** रात के ₹35,000 के फ्लोट से **₹${tax.dailySweepInterestINR.toLocaleString('en-IN')}** सालाना अतिरिक्त ब्याज।
• **कुल सालाना लाभ:** **₹${tax.totalAnnualGainINR.toLocaleString('en-IN')}**!

---
🇬🇧 **English Summary & Compliance Breakdown:**
• **Section 44AD Tax Relief:** 6% presumptive profit rate on Paytm UPI receipts vs 8% on cash saves ₹${tax.section44adSavedINR.toLocaleString('en-IN')}/year.
• **GST Composition Scheme:** 1% flat turnover tax under Section 10 eliminates mandatory HSN reconciliation, saving ₹${tax.gstCompositionSavedINR.toLocaleString('en-IN')}/year in audit fees.
• **Daily Cash Sweep:** Auto-sweeping ₹35,000 idle current account float into liquid funds (6.8% p.a.) generates ₹${tax.dailySweepInterestINR.toLocaleString('en-IN')}/year interest.
• **Total Annual Merchant Gain:** **₹${tax.totalAnnualGainINR.toLocaleString('en-IN')}/year** (100% compliant with Income Tax Act 1961).`;

    return NextResponse.json({
      status: 'success',
      reply: fallbackReply,
      modelUsed: 'DukaanPay Grounded Tax Engine',
      metrics: {
        annualSavingsINR: tax.totalAnnualGainINR,
        section44adSaved: tax.section44adSavedINR,
        gstSaved: tax.gstCompositionSavedINR,
        sweepInterest: tax.dailySweepInterestINR,
      },
    });
  } catch (error: any) {
    console.error('[Virtual CA Chat API Error]:', error);
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
