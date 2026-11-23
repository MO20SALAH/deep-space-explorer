import { NavLink, Outlet } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import SpaceCanvas from '../3d/SpaceCanvas';
import SpaceChatAgent from './SpaceChatAgent';

export default function Layout() {
  const navItems = [
    { to: '/', label: 'الرئيسية', end: true },
    { to: '/planets', label: 'الكواكب', end: false },
    { to: '/gallery', label: 'المعرض', end: false },
  ];

  return (
    <div dir="rtl" className="relative min-h-screen text-white overflow-x-hidden selection:bg-[#38BDF8]/30 selection:text-white">
      {/* خلفية 3D ثابتة لا يُعاد تصييرها عند التنقل */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <SpaceCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030712]/70 via-[#050b1d]/50 to-[#030712]/85" />
      </div>

      {/* شريط التنقل الزجاجي */}
      <header className="sticky top-0 z-40 px-4 sm:px-8 pt-4">
        <nav className="max-w-7xl mx-auto rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
          {/* شعار الموقع */}
          <NavLink
            to="/"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8]/25 to-[#818CF8]/25 border border-[#38BDF8]/40 flex items-center justify-center shadow-[0_0_20px_rgba(56,189,248,0.25)] group-hover:scale-105 transition-transform">
              <Rocket className="w-5 h-5 text-[#38BDF8]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm sm:text-base tracking-wide bg-gradient-to-l from-white via-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
                مستكشف الفضاء
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:block">
                Deep Space Explorer
              </span>
            </div>
          </NavLink>

          {/* روابط التنقل */}
          <ul className="flex items-center gap-1.5 sm:gap-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-white/10 text-white border border-[#38BDF8]/50 shadow-[0_0_18px_rgba(56,189,248,0.35),inset_0_0_12px_rgba(129,140,248,0.2)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* محتوى الصفحات المتغيرة */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
        <Outlet />
      </main>

      {/* المساعد الفضائي العائم في جميع الصفحات */}
      <SpaceChatAgent />
    </div>
  );
}