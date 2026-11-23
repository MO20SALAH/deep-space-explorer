import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Orbit } from 'lucide-react';
import Layout from './components/ui/Layout';
import Home from './pages/Home';
import Planets from './pages/Planets';
import Gallery from './pages/Gallery';

function SplashScreen() {
  return (
    <motion.div
      key="splash"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      dir="rtl"
      className="fixed inset-0 z-[100] bg-[#030712] flex flex-col items-center justify-center gap-5 px-4"
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 rounded-full border-2 border-dashed border-[#38BDF8]/50"
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-md border border-[#818CF8]/40 flex items-center justify-center shadow-[0_0_30px_rgba(56,189,248,0.35)]"
        >
          <Orbit className="w-7 h-7 text-[#38BDF8]" />
        </motion.div>
      </div>

      <div className="text-center space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-l from-[#38BDF8] via-[#818CF8] to-white bg-clip-text text-transparent">
          مستكشف الفضاء التفاعلي
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          جاري تجهيز المدارات وبيانات الكون...
        </p>
      </div>
    </motion.div>
  );
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <PageWrapper>
                <Home />
              </PageWrapper>
            }
          />
          <Route
            path="planets"
            element={
              <PageWrapper>
                <Planets />
              </PageWrapper>
            }
          />
          <Route
            path="gallery"
            element={
              <PageWrapper>
                <Gallery />
              </PageWrapper>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </>
  );
}