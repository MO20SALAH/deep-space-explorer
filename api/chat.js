const SYSTEM_INSTRUCTION =
  'أنت رائد فضاء وخبير فلكي ذكي في موقع مستكشف الفضاء. أجب باللغة العربية بأسلوب مشوق، منظم في نقاط، وغني بالحقائق العلمية. إذا سأل المستخدم عن موضوع خارج الفضاء والفلك، اعتذر بلطف وأعده لموضوع الفضاء.';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'يرجى إرسال نص سؤال صالح.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: 'مفتاح GEMINI_API_KEY غير مضبوط في متغيرات البيئة.',
      });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`;

    const geminiResponse = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: message.trim() }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      return res.status(geminiResponse.status).json({
        error: data?.error?.message || 'فشل الاتصال بخدمة Gemini API.',
      });
    }

    const replyText =
      data?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || '')
        .join('')
        .trim() || '';

    if (!replyText) {
      return res.status(502).json({
        error: 'لم يتم استلام رد نصي من نموذج الذكاء الاصطناعي.',
      });
    }

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'حدث خطأ غير متوقع في الخادم أثناء معالجة طلبك.',
    });
  }
}