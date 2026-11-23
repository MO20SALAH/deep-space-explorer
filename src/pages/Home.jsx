import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles } from 'lucide-react';
import ApodCard from '../components/ui/ApodCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Home() {
  const navigate = useNavigate();

  return (
    <section className="min-h-[calc(100vh-8rem)] flex items-center py-6">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* العمود الأيمن: المحتوى الترحيبي السينمائي */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="lg:col-span-7 space-y-6 text-right"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/5 backdrop-blur-md border border-[#38BDF8]/30 text-[#38BDF8]">
              <Sparkles className="w-4 h-4 text-[#818CF8]" />
              رحلة تفاعلية عبر أعماق الكون
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl xl:text-7xl font-extrabold leading-[1.15] tracking-tight"
          >
            <span className="block text-white">اكتشف أسرار</span>
            <span className="block bg-gradient-to-l from-[#38BDF8] via-[#818CF8] to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]">
              الفضاء السحيق
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-300/90 max-w-2xl leading-relaxed bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5"
          >
            انطلق في تجربة بصرية وعلمية تأخذك بين العوالم الكوكبية، السدم المضيئة،
            وصور الفضاء اليومية من وكالة ناسا، مع مساعد فلكي ذكي يجيب عن تساؤلاتك
            الكونية لحظة بلحظة.
          </motion.p>

          <motion.div variants={itemVariants} className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/planets')}
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl font-semibold text-base text-slate-950 bg-gradient-to-l from-[#38BDF8] to-[#818CF8] shadow-[0_0_28px_rgba(56,189,248,0.45)] hover:shadow-[0_0_40px_rgba(129,140,248,0.65)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 cursor-pointer"
            >
              <span>ابدأ الرحلة</span>
              <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
          </motion.div>
        </motion.div>

        {/* العمود الأيسر: بطاقة صورة اليوم الفلكية APOD */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5"
        >
          <div className="rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 p-3 sm:p-4 shadow-2xl shadow-black/40 hover:border-[#38BDF8]/30 transition-colors">
            <ApodCard />
          </div>
        </motion.div>
      </div>
    </section>
  );
}