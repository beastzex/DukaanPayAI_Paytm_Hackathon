import { NextRequest, NextResponse } from 'next/server';
import { processVoiceQuery } from '@/ai/voice-coo-engine';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => new FormData());
    const speechResult = (formData.get('SpeechResult') as string) || '';
    const confidence = formData.get('Confidence') as string;

    console.log(`[Twilio Live Voice Turn] User Spoke: "${speechResult}" (Confidence: ${confidence})`);

    // Base ngrok public URL or host
    const host = req.headers.get('host') || 'unreturning-gesticulatively-dorsey.ngrok-free.dev';
    const proto = host.includes('localhost') ? 'http' : 'https';
    const actionUrl = `${proto}://${host}/api/whatsapp/voice-call-turn`;

    // 1. If user didn't speak or speech was unclear
    if (!speechResult.trim()) {
      const retryTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="speech" language="hi-IN" hints="sales, bikri, footfall, customer, doodh, maggi, order" action="${actionUrl}" method="POST" speechTimeout="auto">
    <Say language="hi-IN">माफ कीजिए भैया, आपकी आवाज साफ नहीं आई। आज की बिक्री या किसी भी सवाल के बारे में बोलिए, मैं सुन रहा हूँ।</Say>
  </Gather>
  <Say language="hi-IN">धन्यवाद रामेश्वर भैया, आप व्हाट्सएप पर भी मैसेज कर सकते हैं। शुभ दिन!</Say>
  <Hangup/>
</Response>`;
      return new NextResponse(retryTwiml, { headers: { 'Content-Type': 'text/xml' } });
    }

    const lower = speechResult.toLowerCase().trim();

    // 2. Check if user wants to hang up / finish
    if (
      lower.includes('nahi') ||
      lower.includes('kuch nahi') ||
      lower.includes('shukriya') ||
      lower.includes('dhanyawad') ||
      lower.includes('bye') ||
      lower.includes('rakhta hu') ||
      lower.includes('theek hai')
    ) {
      const byeTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN">बहुत अच्छा रामेश्वर भैया! दुकान का पूरा ब्योरा व्हाट्सएप पर भेज दिया गया है। खूब बिक्री हो, नमस्ते!</Say>
  <Hangup/>
</Response>`;
      return new NextResponse(byeTwiml, { headers: { 'Content-Type': 'text/xml' } });
    }

    // 3. Process spoken query with Groq LPU (openai/gpt-oss-120b & qwen/qwen3.8-27b)
    const aiRes = await processVoiceQuery(speechResult, 'hi');
    const spokenAnswer = aiRes.hindiSpokenResponse;

    // Clean XML characters
    const cleanSpoken = spokenAnswer
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    // 4. Return conversational TwiML that speaks the answer and IMMEDIATELY listens for the next question!
    const conversationalTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN">${cleanSpoken}</Say>
  <Gather input="speech" language="hi-IN" hints="sales, bikri, footfall, sham ko kitne log, kal kya mangwana, maggi, tax" action="${actionUrl}" method="POST" speechTimeout="auto">
    <Say language="hi-IN">और कुछ पूछना चाहते हैं भैया?</Say>
  </Gather>
  <Say language="hi-IN">धन्यवाद रामेश्वर भैया! आपकी दुकान की सेवा में DukaanPay AI हमेशा हाजिर है। नमस्ते!</Say>
  <Hangup/>
</Response>`;

    return new NextResponse(conversationalTwiml, { headers: { 'Content-Type': 'text/xml' } });
  } catch (err: any) {
    console.error('[Twilio Voice Turn Error]:', err);
    const errTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN">तकनीकी समस्या के कारण कॉल समाप्त हो रही है। कृपया व्हाट्सएप पर संपर्क करें।</Say>
  <Hangup/>
</Response>`;
    return new NextResponse(errTwiml, { headers: { 'Content-Type': 'text/xml' } });
  }
}
