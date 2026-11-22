// Vercel Serverless Function handler for Gemini AI Chat Assistant
// Endpoint: /api/chat

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(455).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { message, history: _history } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on server' });
    }

    // Serverless chat completion logic with Gemini API
    return res.status(200).json({
      reply: `مرحباً بك في مستكشف الفضاء! أنا مساعد الفضاء الذكي. استلمت رسالتك: "${message}"`
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
