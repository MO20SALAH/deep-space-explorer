import React from 'react';

/**
 * GlassCard component - A reusable glassmorphic container
 * featuring backdrop blur, fine borders, and space ambient shadow.
 */
export default function GlassCard({
  children,
  className = '',
  glow = false,
  ...props
}) {
  return (
    <div
      className={`
        rounded-2xl
        p-6 sm:p-8
        backdrop-blur-md
        bg-slate-950/60
        border border-white/10
        shadow-2xl
        transition-all duration-300
        ${glow ? 'shadow-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/20' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
