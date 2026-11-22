import React, { useState } from 'react';
import SpaceCanvas from './components/3d/SpaceCanvas';
import GlassCard from './components/ui/GlassCard';
import Button from './components/ui/Button';
import { Rocket, Sparkles, Orbit, Compass, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [missionStarted, setMissionStarted] = useState(false);

  return (
    <div className="relative min-h-screen text-white select-none overflow-x-hidden">
      {/* 3D Space & Planet Canvas Background */}
      <SpaceCanvas />

      {/* HTML Overlay Container (pointer-events-none allows dragging the 3D scene) */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen pointer-events-none p-4 sm:p-8 md:p-12">
        {/* Navigation / Header */}
        <header className="w-full flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20 backdrop-blur-md">
              <Orbit className="w-6 h-6 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-300">
                DEEP SPACE
              </span>
              <span className="text-xs block text-slate-400 font-medium">مستكشف الفضاء التفاعلي</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-white/10 backdrop-blur-md text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>البيئة ثلاثية الأبعاد نشطة (60 FPS)</span>
          </div>
        </header>

        {/* Hero Glassmorphic Welcome Card */}
        <main className="flex items-center justify-center my-auto py-8">
          <GlassCard
            glow
            className="w-full max-w-xl pointer-events-auto text-center border-white/10"
          >
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مستكشف الفضاء التفاعلي • Deep Space Explorer</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400">
              Deep Space Explorer
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto font-normal">
              انطلق في رحلة استكشافية تفاعلية ثلاثية الأبعاد عبر كواكب المجموعة الشمسية وأعماق الفضاء بالاعتماد على بيانات وصور وكالة ناسا.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => setMissionStarted(!missionStarted)}
                className="w-full sm:w-auto px-8 py-3.5 text-base"
              >
                <Rocket className="w-5 h-5 ml-2" />
                <span>{missionStarted ? 'الرحلة قيد التشغيل 🚀' : 'ابدأ الرحلة'}</span>
              </Button>

              <Button
                variant="glass"
                onClick={() => alert('يمكنك استخدام الماوس لتدوير الكوكب وتكبيره وتصغيره بحرية!')}
                className="w-full sm:w-auto px-5 py-3.5 text-sm"
              >
                <Eye className="w-4 h-4 ml-1.5" />
                <span>وضع المراقبة</span>
              </Button>
            </div>

            {/* Feedback alert upon clicking Start */}
            <AnimatePresence>
              {missionStarted && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: 10, height: 0 }}
                  className="mt-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/20 text-cyan-200 text-sm"
                >
                  ✨ تم تأكيد تشغيل نظام الملاحة الفضائية بنجاح! جاهز لاستقبال بيانات الكواكب و NASA API.
                </motion.div>
              )}
            </AnimatePresence>

            {/* Hint for 3D interactions */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>تحكم بالماوس: انقر واسحب للتدوير، واستخدم العجلة للتكبير والتصغير</span>
            </div>
          </GlassCard>
        </main>

        {/* Footer / Status bar */}
        <footer className="w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pointer-events-auto gap-2">
          <div className="flex items-center gap-4">
            <span>النواة الأساسية: Three.js + R3F + Tailwind CSS</span>
          </div>
          <div>
            <span>جميع الحقوق محفوظة © مستكشف الفضاء 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
