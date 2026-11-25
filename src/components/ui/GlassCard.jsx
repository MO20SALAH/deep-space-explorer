import { memo } from "react";

function GlassCard({ children, className = "", onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        cosmic-glass-card
        cosmic-ambient-glow
        bg-white/[0.045]
        backdrop-blur-md
        border border-white/10
        rounded-2xl
        transition-all duration-300
        hover:-translate-y-1
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default memo(GlassCard);
