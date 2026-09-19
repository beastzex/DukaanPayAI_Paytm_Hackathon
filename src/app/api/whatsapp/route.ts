import { NextRequest, NextResponse } from 'next/server';
import { isCallIntent, isCallConfirmation, processVoiceQuery, getScheduledDailyBriefings } from '@/ai/voice-coo-engine';
import { processWhatsAppMedia } from '@/ai/whatsapp-vision-ocr';
import { sendWhatsAppNotification } from '@/lib/twilio-config';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let from = 'whatsapp:+919821012345';
    let bodyText = '';
    let numMedia = 0;
    let mediaUrl = '';
    let mediaType = '';

    if (contentType.includes('application/json')) {
      const json = await req.json();
      from = json.From || json.from || from;
      bodyText = json.Body || json.body || json.text || '';
      numMedia = parseInt(json.NumMedia || json.numMedia || (json.mediaUrl ? '1' : '0'), 10);
      mediaUrl = json.MediaUrl0 || json.mediaUrl || '';
      mediaType = json.MediaContentType0 || json.mediaContentType || '';
    } else {
      // Twilio form-encoded payload
      const formData = await req.formData();
      from = (formData.get('From') as string) || from;
      bodyText = (formData.get('Body') as string) || '';
      numMedia = parseInt((formData.get('NumMedia') as string) || '0', 10);
      mediaUrl = (formData.get('MediaUrl0') as string) || '';
      mediaType = (formData.get('MediaContentType0') as string) || '';
    }

    const isTwilioForm = contentType.includes('application/x-www-form-urlencoded') || req.headers.get('x-twilio-signature');

    // 0. Multimodal Vision & OCR Handler (Shelf Photo, Bahi Khata, Purchase Bills)
    const lowerText = bodyText.toLowerCase();
    const isExplicitMediaScan =
      numMedia > 0 ||
      mediaUrl.length > 0 ||
      lowerText.includes('photo') ||
      lowerText.includes('tasveer') ||
      lowerText.includes('image') ||
      lowerText.includes('pic') ||
      lowerText.includes('shelf') ||
      lowerText.includes('items here') ||
      lowerText.includes('rack') ||
      lowerText.includes('shelf scan') ||
      lowerText.includes('bill scan') ||
      lowerText.includes('khata scan') ||
      lowerText.includes('invoice') ||
      lowerText.includes('bill') ||
      lowerText.includes('chalan') ||
      lowerText.includes('bahi khata');

    console.log('[WhatsApp Webhook Received]:', { from, bodyText, numMedia, mediaUrl, isExplicitMediaScan });

    if (isExplicitMediaScan) {
      const mediaAnalysis = await processWhatsAppMedia({
        mediaUrl,
        mediaType,
        captionText: bodyText,
      });

      const hindiMsg = mediaAnalysis.hindiSpokenResponse;
      const englishMsg = `🇬🇧 *English Details & Action Points:*\n${mediaAnalysis.englishSummary}`;

      // Dispatch directly via Twilio REST API to ensure delivery without TwiML limits
      await sendWhatsAppNotification(from, hindiMsg);
      await sendWhatsAppNotification(from, englishMsg);

      if (isTwilioForm) {
        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
          headers: { 'Content-Type': 'text/xml' },
        });
      }

      return NextResponse.json({
        status: 'success',
        type: 'MULTIMODAL_SCAN_RESPONSE',
        reply: `${hindiMsg}\n\n${englishMsg}`,
        data: mediaAnalysis,
      });
    }

    // 1. Check if user is asking for a call
    if (isCallIntent(bodyText)) {
      const confirmationMsg = `📞 *DukaanPay AI वॉयस कॉल सर्विस:*
नमस्ते रामेश्वर जी! क्या आप अभी अपनी दुकान के रियल-टाइम बिजनेस इनसाइट्स और बिक्री के लिए AI वॉयस कॉल कनेक्ट करना चाहते हैं?

जवाब में *हाँ* (Yes) या *नहीं* (No) लिखें, या कॉल बटन दबाएं।`;

      await sendWhatsAppNotification(from, confirmationMsg);

      if (isTwilioForm) {
        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
          headers: { 'Content-Type': 'text/xml' },
        });
      }

      return NextResponse.json({
        status: 'success',
        type: 'CALL_REQUEST_PROMPT',
        reply: confirmationMsg,
        interactiveOptions: ['हाँ, कॉल करें (Yes)', 'नहीं (No)'],
      });
    }

    // 2. Check if user confirms call
    if (isCallConfirmation(bodyText)) {
      const toPhone = from.replace('whatsapp:', '');
      let callSid = '';

      // Trigger real phone call using Twilio Voice API
      try {
        const twilioModule = await import('twilio');
        const twilioClient = (twilioModule.default || twilioModule)(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );

        const host = req.headers.get('host') || 'unreturning-gesticulatively-dorsey.ngrok-free.dev';
        const proto = host.includes('localhost') ? 'http' : 'https';
        const turnActionUrl = `${proto}://${host}/api/whatsapp/voice-call-turn`;

        const callTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say language="hi-IN">नमस्ते रामेश्वर भैया! मैं आपका DukaanPay AI वॉयस पार्टनर बोल रहा हूँ।</Say>
  <Gather input="speech" language="hi-IN" hints="sales, bikri, footfall, sham ko kitne log, kal kya mangwana, maggi, tax" action="${turnActionUrl}" method="POST" speechTimeout="auto">
    <Say language="hi-IN">आज की बिक्री, शाम के फुटफॉल, या कल के आर्डर के बारे में पूछिए, मैं सुन रहा हूँ!</Say>
  </Gather>
  <Say language="hi-IN">लगता है आपकी आवाज नहीं आई। आप व्हाट्सएप पर भी पूछ सकते हैं। धन्यवाद भैया!</Say>
  <Hangup/>
</Response>`;

        const call = await twilioClient.calls.create({
          twiml: callTwiml,
          to: toPhone,
          from: process.env.TWILIO_VOICE_NUMBER || '+17245387484',
        });
        callSid = call.sid;
        console.log(`[Twilio Conversational Call Placed] To: ${toPhone} (SID: ${call.sid})`);
      } catch (callErr: any) {
        console.warn('[Twilio Call Trigger Error]:', callErr.message);
      }

      const callInitiateMsg = `📞 *कॉल आपके नंबर पर लगा दी गई है!*
DukaanPay AI आपको +1 (724) 538-7484 से कॉल कर रहा है। कृपया फोन उठाएं और सुनें!

इसके बाद आप व्हाट्सएप पर बोलकर या लिखकर और भी सवाल पूछ सकते हैं:
1. "sham ko kitne logo ki aane ki sambhawna hai" (Footfall)
2. "agar Maggi ke 50 packet mangwaun toh kitne din me bikege" (What-If)
3. "tax kaise bachaye aur CA advisory kya hai" (Virtual CA)`;

      await sendWhatsAppNotification(from, callInitiateMsg);

      if (isTwilioForm) {
        return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
          headers: { 'Content-Type': 'text/xml' },
        });
      }

      return NextResponse.json({
        status: 'success',
        type: 'CALL_INITIATED',
        reply: callInitiateMsg,
        callSid,
        startCallSession: true,
      });
    }

    // 3. Regular question handling via Voice & NLP Engine
    const voiceRes = await processVoiceQuery(bodyText);
    const hindiMsg = `🇮🇳 *हिंदी में जानकारी (Hindi):*\n${voiceRes.hindiSpokenResponse}`;
    const englishMsg = `🇬🇧 *English Details & Action Points:*\n${voiceRes.englishSummary}`;

    await sendWhatsAppNotification(from, hindiMsg);
    await sendWhatsAppNotification(from, englishMsg);

    if (isTwilioForm) {
      return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`, {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    return NextResponse.json({
      status: 'success',
      type: 'NLP_RESPONSE',
      reply: `${hindiMsg}\n\n━━━━━━━━━━━━━━━━━━━━\n${englishMsg}`,
      data: voiceRes,
    });
  } catch (err: any) {
    console.error('[WhatsApp Route Error]:', err);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}

export async function GET() {
  // Returns the 4 scheduled briefings for testing & inspection
  const briefings = getScheduledDailyBriefings();
  return NextResponse.json({
    status: 'success',
    briefings,
  });
}
