import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Send, Sparkles, X } from 'lucide-react';

const QUICK_PROMPTS = [
  'حدثني عن كوكب المريخ',
  'كيف تتكون الثقوب السوداء؟',
  'كم عدد الكواكب في مجرتنا؟',
];

function formatMessageText(text) {
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  return lines.map((line, idx) => {
    const cleanLine = line.replace(/^[-*•]\s*/, '').trim();
    const isBullet = /^[-*•]\s*/.test(line.trim());

    if (isBullet) {
      return (
        <li key={idx} className="mr-4 list-disc text-slate-100 leading-relaxed">
          {cleanLine}
        </li>
      );
    }
    return (
      <p key={idx} className="text-slate-100 leading-relaxed">
        {cleanLine}
      </p>
    );
  });
}

export default function SpaceChatAgent() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'أهلاً بك أيها المستكشف! أنا مساعدك الفلكي الذكي. اسألني عن الكواكب، النجوم، المجرات، أو رحلات الفضاء.',
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (textToSend) => {
    const trimmed = (textToSend ?? input).trim();
    if (!trimmed || isLoading) return;

    const userMsg = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        let serverError = '';
        try {
          const errorText = await response.text();
          if (errorText && errorText.trim()) {
            const errorJson = JSON.parse(errorText);
            serverError = errorJson?.error || '';
          }
        } catch {
          // تجاهل أخطاء تحليل الرد غير النصي أو الفارغ
        }
        throw new Error(
          serverError ||
            'يرجى تشغيل السيرفر عبر vercel dev أو التأكد من مفتاح Gemini API.'
        );
      }

      const rawText = await response.text();
      if (!rawText || !rawText.trim()) {
        throw new Error(
          'يرجى تشغيل السيرفر عبر vercel dev أو التأكد من مفتاح Gemini API.'
        );
      }

      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          'يرجى تشغيل السيرفر عبر vercel dev أو التأكد من مفتاح Gemini API.'
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-ai`,
          role: 'assistant',
          content: data.reply || 'لم أتمكن من استلام رد واضح، حاول مرة أخرى.',
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-err`,
          role: 'assistant',
          content: `عذراً، حدث خلل أثناء الاتصال بمركز التحكم الفضائي: ${err.message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const showQuickPrompts = messages.length === 1 && !isLoading;

  return (
    <div dir="rtl" className="fixed bottom-6 left-6 z-50">
      {/* نافذة الشات الزجاجية */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-4 w-[calc(100vw-3rem)] sm:w-96 h-[32rem] max-h-[78vh] rounded-3xl bg-[#070d1f]/90 backdrop-blur-xl border border-white/15 shadow-[0_0_45px_rgba(56,189,248,0.2)] flex flex-col overflow-hidden"
          >
            {/* رأس النافذة */}
            <div className="px-4 py-3.5 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38BDF8]/25 to-[#818CF8]/25 border border-[#38BDF8]/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#38BDF8]" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">المساعد الفضائي</h2>
                  <span className="text-[11px] text-[#38BDF8] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    متصل بمدار الفلك
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق المساعد الفضائي"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* منطقة الرسائل */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 space-y-1.5 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-l from-[#38BDF8]/25 to-[#818CF8]/25 border border-[#38BDF8]/40 text-white rounded-br-sm'
                        : 'bg-white/5 border border-white/10 text-slate-100 rounded-bl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="space-y-1.5">{formatMessageText(msg.content)}</div>
                    ) : (
                      <p className="leading-relaxed">{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* اقتراحات سريعة في بداية المحادثة */}
              {showQuickPrompts && (
                <div className="pt-2 space-y-2">
                  <p className="text-xs text-slate-400">اقتراحات سريعة للبدء:</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="text-right text-xs px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#38BDF8]/50 text-slate-200 transition-all cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* مؤشر الكتابة المتحرك */}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-[#818CF8] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-[#38BDF8] animate-bounce" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* حقل الإدخال */}
            <form
              onSubmit={handleSubmit}
              className="p-3 bg-white/5 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="اكتب سؤالك الفلكي هنا..."
                disabled={isLoading}
                className="flex-1 bg-white/5 border border-white/10 focus:border-[#38BDF8]/60 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="إرسال الرسالة"
                className="p-2.5 rounded-xl bg-gradient-to-l from-[#38BDF8] to-[#818CF8] text-slate-950 disabled:opacity-40 hover:opacity-95 transition-opacity cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الزر العائم المتوهج في أسفل اليسار */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label="فتح المساعد الفضائي"
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#818CF8] text-slate-950 flex items-center justify-center shadow-[0_0_28px_rgba(56,189,248,0.55)] hover:shadow-[0_0_40px_rgba(129,140,248,0.75)] transition-shadow cursor-pointer"
      >
        <Bot className="w-7 h-7" />
      </motion.button>
    </div>
  );
}